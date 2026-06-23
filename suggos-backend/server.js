// SugGos backend — proxies AI room analysis requests to Google Gemini.
//
// WHY THIS EXISTS:
// Browsers block direct calls from a webpage to most AI APIs (CORS policy),
// and API keys must never live in frontend code anyway (anyone could steal
// them from the browser's network tab). So the React app calls THIS server,
// and this server — running on a machine, not in a browser — calls Gemini.
//
//   Browser (React, localhost:3000)
//        |  POST /api/analyze { imageDataUrl }
//        v
//   This backend (localhost:5000)
//        |  calls Gemini with the API key (kept secret in .env)
//        v
//   Google Gemini API
//        |  returns suggestions + palette + insights
//        v
//   back to the browser

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Allow the React dev server (and same-origin in production) to call this API.
app.use(cors());
// Room photos as base64 data URLs can be a few MB — raise the body limit.
app.use(express.json({ limit: '15mb' }));

const SYSTEM_PROMPT = `You are an expert interior designer with a precise eye for color. Analyze this room photo and return ONLY a valid JSON object — no markdown, no explanation, nothing else.

The JSON must follow this exact shape:
{
  "suggestions": [
    {
      "id": 1,
      "name": "product name",
      "category": "one of: Seating | Lighting | Rugs | Tables | Decor | Storage | Art | Plants",
      "reason": "1-2 sentence explanation tied to what you see in the room",
      "price": "$XXX",
      "retailer": "retailer name",
      "link": "https://retailer.com/search?q=product",
      "match": 95,
      "gradient": "linear-gradient(145deg, #hex 0%, #hex 60%, #hex 100%)",
      "tag": "✦ Top pick or null",
      "accentColor": "#hex",
      "imageQuery": "2-4 word search query for this product type, e.g. velvet sofa sand"
    }
  ],
  "palette": [
    { "color": "#hex", "label": "what this color is from, e.g. Wall paint" }
  ],
  "insights": [
    { "icon": "emoji", "label": "insight label", "value": "insight value" }
  ]
}

HOW TO BUILD THE PALETTE (this is the most important part — look carefully, do not guess a generic "interior design" palette):
Step 1 — Look at the actual photo region by region and identify the REAL colors present:
  a) The wall / background color (the largest flat surface, usually behind furniture)
  b) The floor or rug color
  c) The color of the largest piece of furniture (sofa, bed, cabinet, etc.)
  d) The color of a secondary furniture piece or fabric (cushion, curtain, chair)
  e) Any strong accent color visible (a plant, artwork, a small object) — if none, use a trim/ceiling/door color instead
Step 2 — For each of the 5 regions above, output the closest matching hex code to what is ACTUALLY visible in the photo. Do not default to generic "warm neutral" interior design colors unless the photo genuinely is that color — e.g. if the wall is grey, output a grey hex, not a beige one.
Step 3 — Label each color by what it actually is in the photo ("Wall paint", "Floor / rug", "Sofa fabric", "Cushion accent", "Curtain", etc.) rather than abstract color names like "Cognac" or "Dusty plum".

Other rules:
- Return exactly 6 suggestions, sorted by match % descending. First item gets tag "✦ Top pick", others null.
- Each gradient should use colors that visually represent the product (earthy for wood, warm for brass, etc.)
- imageQuery should be a short descriptive phrase that would find a good real-world product photo.
- Return exactly 5 palette colors, one for each region in Step 1, drawn from what is actually visible in this specific photo.
- Return exactly 4 insights covering: natural light, estimated size, current style, biggest opportunity.
- Retailer links should be real search URLs (West Elm, CB2, IKEA, Article, Wayfair, H&M Home, Rugs USA, etc.)
- match % should be between 75 and 99.`;

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, hasKey: Boolean(GEMINI_API_KEY) });
});

// Calls Gemini, automatically retrying a couple of times if Google's
// servers report a temporary problem (503 Service Unavailable) or a
// rate limit (429 Too Many Requests). Other errors (400, 404, etc.)
// are real problems with the request itself, so we don't retry those —
// retrying a bad request just wastes time and gets the same error.
async function callGeminiWithRetry(mimeType, base64Data, maxRetries = 2) {
  const RETRYABLE_STATUSES = [429, 503];
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: SYSTEM_PROMPT },
                { inline_data: { mime_type: mimeType, data: base64Data } },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 3000,
          },
        }),
      }
    );

    if (geminiResponse.ok) {
      return geminiResponse;
    }

    const errText = await geminiResponse.text();
    console.error(`Gemini API error (attempt ${attempt + 1}/${maxRetries + 1}):`, geminiResponse.status, errText);

    if (!RETRYABLE_STATUSES.includes(geminiResponse.status) || attempt === maxRetries) {
      // Not retryable, or we're out of retries — give up and report this error.
      const err = new Error(`Gemini API error (${geminiResponse.status})`);
      err.status = geminiResponse.status;
      err.detail = errText;
      throw err;
    }

    // Exponential backoff: wait 1s, then 2s, then 4s, etc. before retrying.
    const waitMs = 1000 * Math.pow(2, attempt);
    console.log(`Retrying in ${waitMs}ms...`);
    await new Promise(resolve => setTimeout(resolve, waitMs));
  }

  throw lastError;
}

app.post('/api/analyze', async (req, res) => {
  try {
    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Server is missing GEMINI_API_KEY. Add it to suggos-backend/.env and restart the server.' });
    }

    const { imageDataUrl } = req.body;
    if (!imageDataUrl || typeof imageDataUrl !== 'string') {
      return res.status(400).json({ error: 'Missing imageDataUrl in request body.' });
    }

    // imageDataUrl looks like: data:image/jpeg;base64,/9j/4AAQ...
    const match = imageDataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
    if (!match) {
      return res.status(400).json({ error: 'imageDataUrl is not a valid base64 image data URL.' });
    }
    const mimeType = match[1];
    const base64Data = match[2];

    let geminiResponse;
    try {
      geminiResponse = await callGeminiWithRetry(mimeType, base64Data);
    } catch (err) {
      const friendly = err.status === 503
        ? "Google's AI servers are temporarily overloaded. This usually clears up within a minute — please try again shortly."
        : err.status === 429
        ? 'Too many requests right now — please wait a moment and try again.'
        : `Gemini API error (${err.status || 'unknown'})`;
      return res.status(502).json({ error: friendly, detail: err.detail });
    }

    const geminiData = await geminiResponse.json();
    const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error('Failed to parse Gemini JSON output:', cleaned);
      return res.status(502).json({ error: 'Gemini returned non-JSON output.', raw: cleaned });
    }

    return res.json(parsed);
  } catch (err) {
    console.error('Unexpected error in /api/analyze:', err);
    return res.status(500).json({ error: 'Unexpected server error.', detail: String(err) });
  }
});

app.listen(PORT, () => {
  console.log(`SugGos backend listening on http://localhost:${PORT}`);
  console.log(`Gemini key loaded: ${GEMINI_API_KEY ? 'yes' : 'NO — set GEMINI_API_KEY in .env'}`);
});
