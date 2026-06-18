import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/* ─────────────────────────────────────────
   GLOBAL STYLES (animations + responsive)
───────────────────────────────────────── */
const GLOBAL_CSS = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes shimmer {
    0%   { background-position: -600px 0; }
    100% { background-position:  600px 0; }
  }
  @keyframes pulseGlow {
    0%, 100% { box-shadow: 0 0 0 0 rgba(232,146,124,0); }
    50%       { box-shadow: 0 0 0 6px rgba(232,146,124,0.15); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .sg-shimmer {
    background: linear-gradient(90deg, #f0ece8 25%, #e8e2dc 50%, #f0ece8 75%);
    background-size: 600px 100%;
    animation: shimmer 1.4s ease infinite;
  }

  .sg-card {
    background: #fff;
    border-radius: 18px;
    overflow: hidden;
    border: 1px solid #E8E0D8;
    transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
    cursor: default;
    animation: fadeUp 0.4s ease both;
  }
  .sg-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(232,146,124,0.16);
    border-color: rgba(232,146,124,0.45);
  }
  .sg-card.active {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(232,146,124,0.22);
    border-color: rgba(232,146,124,0.55);
    animation: pulseGlow 2s ease infinite;
  }
  .sg-card-btn {
    background: var(--rose);
    color: #fff;
    border: none;
    border-radius: 100px;
    padding: 0.52rem 1.1rem;
    font-size: 0.78rem;
    font-weight: 500;
    cursor: pointer;
    font-family: var(--sans);
    transition: background 0.15s ease, transform 0.1s ease;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
  }
  .sg-card-btn:hover {
    background: #d4745c;
    transform: scale(1.04);
  }
  .sg-filter-tab {
    padding: 0.45rem 1.1rem;
    border-radius: 100px;
    background: transparent;
    border: 1px solid #E8E0D8;
    font-size: 0.8rem;
    color: var(--stone);
    cursor: pointer;
    font-family: var(--sans);
    transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
  }
  .sg-filter-tab:hover { border-color: #c4b8b0; color: var(--dark); }
  .sg-filter-tab.active {
    background: var(--dark);
    border-color: var(--dark);
    color: #fff;
  }
  .sg-reupload-btn {
    width: 100%;
    padding: 0.75rem;
    border-radius: 10px;
    background: rgba(232,146,124,0.1);
    border: 1px solid rgba(232,146,124,0.25);
    color: var(--rose-light);
    font-size: 0.84rem;
    font-weight: 500;
    cursor: pointer;
    margin-top: auto;
    transition: background 0.15s ease;
    font-family: var(--sans);
  }
  .sg-reupload-btn:hover { background: rgba(232,146,124,0.18); }
  .sg-share-btn {
    font-size: 0.82rem;
    font-weight: 500;
    color: var(--stone-light);
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.1);
    padding: 0.45rem 1.1rem;
    border-radius: 100px;
    cursor: pointer;
    transition: background 0.15s ease;
    font-family: var(--sans);
  }
  .sg-share-btn:hover { background: rgba(255,255,255,0.13); }
  .sg-thumb-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.42) 0%, transparent 55%);
  }
  .sg-card-stagger-1 { animation-delay: 0.05s; }
  .sg-card-stagger-2 { animation-delay: 0.10s; }
  .sg-card-stagger-3 { animation-delay: 0.15s; }
  .sg-card-stagger-4 { animation-delay: 0.20s; }
  .sg-card-stagger-5 { animation-delay: 0.25s; }
  .sg-card-stagger-6 { animation-delay: 0.30s; }

  .sg-spinner {
    width: 28px; height: 28px;
    border: 3px solid rgba(232,146,124,0.2);
    border-top-color: var(--rose);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  /* card photo */
  .sg-card-photo {
    width: 100%; height: 100%;
    object-fit: cover;
    position: absolute; inset: 0;
    transition: opacity 0.35s ease;
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 900px) {
    .sg-main { grid-template-columns: 1fr !important; }
    .sg-sidebar {
      position: static !important;
      height: auto !important;
      padding: 1.5rem 1.2rem !important;
    }
    .sg-preview-wrap { max-height: 240px; overflow: hidden; }
    .sg-suggestions-col { padding: 1.8rem 1.2rem 3rem !important; }
    .sg-suggestions-h1 { font-size: 1.7rem !important; }
    .sg-cards-grid { grid-template-columns: 1fr !important; }
    .sg-nav-center { display: none !important; }
    .sg-nav { padding: 0 1.2rem !important; }
    .sg-suggestions-header { flex-direction: column !important; gap: 0.6rem !important; }
  }
  @media (min-width: 901px) and (max-width: 1200px) {
    .sg-main { grid-template-columns: 360px 1fr !important; }
    .sg-cards-grid { grid-template-columns: repeat(2, 1fr) !important; }
    .sg-suggestions-col { padding: 2rem 2rem 3rem !important; }
  }
  @media (max-width: 480px) {
    .sg-budget-pill { display: none !important; }
    .sg-filter-row { gap: 0.35rem !important; }
    .sg-filter-tab { font-size: 0.74rem !important; padding: 0.38rem 0.8rem !important; }
  }
`;

function useGlobalStyle(css) {
  useEffect(() => {
    const el = document.createElement('style');
    el.textContent = css;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, [css]);
}

/* ─────────────────────────────────────────
   UNSPLASH PHOTO URL helper
   Uses the free Unsplash Source redirect API
───────────────────────────────────────── */
function unsplashUrl(query, w = 400, h = 300) {
  return `https://source.unsplash.com/${w}x${h}/?${encodeURIComponent(query)}&auto=format`;
}

/* ─────────────────────────────────────────
   FALLBACK MOCK DATA (used when no photo)
───────────────────────────────────────── */
const FALLBACK_SUGGESTIONS = [
  {
    id: 1,
    name: 'Velvet accent sofa, sand',
    category: 'Seating',
    reason: 'Your warm neutral walls call for texture. This sofa anchors the space without competing.',
    price: '$649',
    retailer: 'West Elm',
    link: 'https://www.westelm.com/search/results.html?words=velvet+accent+sofa',
    match: 97,
    gradient: 'linear-gradient(145deg, #5C4A3A 0%, #8B6B4A 60%, #A07850 100%)',
    tag: '✦ Top pick',
    accentColor: '#8B6B4A',
    imageQuery: 'velvet sand sofa living room',
  },
  {
    id: 2,
    name: 'Arc floor lamp, brass',
    category: 'Lighting',
    reason: 'The empty corner behind your sofa needs light. An arc lamp fills it without using floor space.',
    price: '$189',
    retailer: 'CB2',
    link: 'https://www.cb2.com/search?query=arc+floor+lamp+brass',
    match: 93,
    gradient: 'linear-gradient(145deg, #7A6A40 0%, #C4A870 60%, #E0C080 100%)',
    tag: null,
    accentColor: '#C4A870',
    imageQuery: 'arc floor lamp brass interior',
  },
  {
    id: 3,
    name: 'Moroccan area rug, plum',
    category: 'Rugs',
    reason: 'Your floors are bare — a rug will define the seating zone and add the contrast your palette is missing.',
    price: '$299',
    retailer: 'Rugs USA',
    link: 'https://www.rugsusa.com/search#q=moroccan+area+rug',
    match: 91,
    gradient: 'linear-gradient(145deg, #5A4058 0%, #A07080 60%, #C090A0 100%)',
    tag: null,
    accentColor: '#A07080',
    imageQuery: 'moroccan area rug purple living room',
  },
  {
    id: 4,
    name: 'Rattan side table',
    category: 'Tables',
    reason: 'Natural materials soften the space. This works as a bedside or sofa-side table.',
    price: '$129',
    retailer: 'Article',
    link: 'https://www.article.com/category/tables/side-tables',
    match: 88,
    gradient: 'linear-gradient(145deg, #6A5030 0%, #B89060 60%, #D0A870 100%)',
    tag: null,
    accentColor: '#B89060',
    imageQuery: 'rattan wicker side table interior',
  },
  {
    id: 5,
    name: 'Linen throw pillow set',
    category: 'Decor',
    reason: 'Quick wins. Two pillows in terracotta pick up the warmth already in your room.',
    price: '$59',
    retailer: 'H&M Home',
    link: 'https://www2.hm.com/en_us/home/shop-by-product/cushions-covers.html',
    match: 85,
    gradient: 'linear-gradient(145deg, #904840 0%, #C4907A 60%, #E0A888 100%)',
    tag: null,
    accentColor: '#C4907A',
    imageQuery: 'terracotta linen throw pillows sofa',
  },
  {
    id: 6,
    name: 'Minimalist wall shelf',
    category: 'Storage',
    reason: 'The wall above your sofa is empty — a slim shelf with a plant or books adds dimension.',
    price: '$89',
    retailer: 'IKEA',
    link: 'https://www.ikea.com/us/en/cat/wall-shelves-10725/',
    match: 82,
    gradient: 'linear-gradient(145deg, #404848 0%, #708080 60%, #8A9898 100%)',
    tag: null,
    accentColor: '#708080',
    imageQuery: 'minimalist floating wall shelf interior',
  },
];

const FALLBACK_PALETTE = [
  { color: '#C4906A', label: 'Warm sand' },
  { color: '#8B6B4A', label: 'Cognac' },
  { color: '#A07080', label: 'Dusty plum' },
  { color: '#3A3028', label: 'Deep walnut' },
  { color: '#F2EDE6', label: 'Ivory' },
];

const FALLBACK_INSIGHTS = [
  { icon: '☀️', label: 'Natural light', value: 'Medium — south-facing' },
  { icon: '📐', label: 'Estimated size', value: '~180 sq ft' },
  { icon: '🎨', label: 'Current style', value: 'Transitional / warm neutral' },
  { icon: '⚡', label: 'Biggest opportunity', value: 'Lighting & texture' },
];

/* ─────────────────────────────────────────
   AI ANALYSIS — one call, three outputs
───────────────────────────────────────── */
async function analyzeRoom(imageDataUrl) {
  const base64Data = imageDataUrl.split(',')[1];
  const mediaType = imageDataUrl.split(';')[0].split(':')[1] || 'image/jpeg';

  const prompt = `You are an expert interior designer. Analyze this room photo and return ONLY a valid JSON object — no markdown, no explanation, nothing else.

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
      "imageQuery": "2-4 word Unsplash search query for this product type, e.g. velvet sofa sand"
    }
  ],
  "palette": [
    { "color": "#hex", "label": "color name" }
  ],
  "insights": [
    { "icon": "emoji", "label": "insight label", "value": "insight value" }
  ]
}

Rules:
- Return exactly 6 suggestions, sorted by match % descending. First item gets tag "✦ Top pick", others null.
- Each gradient should use colors that visually represent the product (earthy for wood, warm for brass, etc.)
- imageQuery should be a short descriptive phrase that would find a good product photo on Unsplash.
- Return exactly 5 palette colors extracted from the actual room photo.
- Return exactly 4 insights covering: natural light, estimated size, current style, biggest opportunity.
- Retailer links should be real search URLs (West Elm, CB2, IKEA, Article, Wayfair, H&M Home, Rugs USA, etc.)
- match % should be between 75 and 99.`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1200,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: mediaType, data: base64Data },
            },
            { type: 'text', text: prompt },
          ],
        },
      ],
    }),
  });

  if (!response.ok) throw new Error(`API error: ${response.status}`);
  const data = await response.json();
  const text = data.content.map(b => b.text || '').join('');
  const clean = text.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}

/* ─────────────────────────────────────────
   NAV
───────────────────────────────────────── */
function ResultsNav({ count }) {
  const navigate = useNavigate();
  return (
    <nav style={s.nav} className="sg-nav">
      <button onClick={() => navigate('/')} style={s.navLogo}>
        Sug<span style={{ color: 'var(--rose)' }}>Gos</span>
      </button>
      <div style={s.navCenter} className="sg-nav-center">
        <span style={s.navCrumb}>My room</span>
        <span style={s.navCrumbSep}>·</span>
        <span style={{ ...s.navCrumb, color: 'var(--rose)' }}>{count} suggestions</span>
      </div>
      <button className="sg-share-btn">Share results</button>
    </nav>
  );
}

/* ─────────────────────────────────────────
   ROOM PREVIEW
───────────────────────────────────────── */
function RoomPreview({ activeId, imageDataUrl, suggestions }) {
  return (
    <div style={s.previewWrap} className="sg-preview-wrap">
      {imageDataUrl ? (
        <img
          src={imageDataUrl}
          alt="Your uploaded room"
          style={{ width: '100%', display: 'block', objectFit: 'cover', maxHeight: 280 }}
        />
      ) : (
        <svg style={s.previewSvg} viewBox="0 0 700 420" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="700" height="420" fill="#2A2220"/>
          <rect x="175" y="0" width="350" height="280" fill="#2E2520"/>
          <polygon points="0,280 700,280 700,420 0,420" fill="#2E2824"/>
          <line x1="0" y1="315" x2="700" y2="315" stroke="#3A3028" strokeWidth="1"/>
          <line x1="0" y1="350" x2="700" y2="350" stroke="#3A3028" strokeWidth="1"/>
          <line x1="0" y1="385" x2="700" y2="385" stroke="#3A3028" strokeWidth="1"/>
          <line x1="175" y1="280" x2="140" y2="420" stroke="#3A3028" strokeWidth="1"/>
          <line x1="350" y1="280" x2="350" y2="420" stroke="#3A3028" strokeWidth="1"/>
          <line x1="525" y1="280" x2="560" y2="420" stroke="#3A3028" strokeWidth="1"/>
          <rect x="245" y="40" width="210" height="140" rx="3" fill="#2A3848" stroke="#3A5060" strokeWidth="2"/>
          <line x1="350" y1="40" x2="350" y2="180" stroke="#3A5060" strokeWidth="2"/>
          <line x1="245" y1="110" x2="455" y2="110" stroke="#3A5060" strokeWidth="2"/>
          <defs>
            <radialGradient id="winLight" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#B8D4F0" stopOpacity="0.12"/>
              <stop offset="100%" stopColor="#B8D4F0" stopOpacity="0"/>
            </radialGradient>
            <radialGradient id="lampGlowR" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#E8A060" stopOpacity="0.35"/>
              <stop offset="100%" stopColor="#E8A060" stopOpacity="0"/>
            </radialGradient>
          </defs>
          <polygon points="350,180 210,280 490,280" fill="url(#winLight)"/>
          <rect x="110" y="232" width="380" height="58" rx="8" fill={activeId === 1 ? '#9A7A5A' : '#7A5C44'} stroke={activeId === 1 ? '#E8927C' : '#9A7A5A'} strokeWidth={activeId === 1 ? 2.5 : 1} style={{ transition: 'fill 0.25s, stroke 0.25s' }}/>
          <rect x="110" y="210" width="380" height="30" rx="6" fill={activeId === 1 ? '#B09070' : '#8A6A50'} style={{ transition: 'fill 0.25s' }}/>
          <rect x="110" y="232" width="46" height="58" rx="5" fill={activeId === 1 ? '#B09070' : '#8A6A50'} style={{ transition: 'fill 0.25s' }}/>
          <rect x="444" y="232" width="46" height="58" rx="5" fill={activeId === 1 ? '#B09070' : '#8A6A50'} style={{ transition: 'fill 0.25s' }}/>
          <rect x="152" y="214" width="72" height="28" rx="10" fill={activeId === 1 ? '#D4A880' : '#C4906A'} opacity="0.9" style={{ transition: 'fill 0.25s' }}/>
          <rect x="244" y="214" width="72" height="28" rx="10" fill={activeId === 1 ? '#F0C4A4' : '#E8927C'} opacity="0.8" style={{ transition: 'fill 0.25s' }}/>
          <rect x="336" y="214" width="72" height="28" rx="10" fill={activeId === 1 ? '#D4A880' : '#C4906A'} opacity="0.9" style={{ transition: 'fill 0.25s' }}/>
          <ellipse cx="300" cy="298" rx="210" ry="20" fill={activeId === 3 ? '#9A6080' : '#5A4060'} stroke={activeId === 3 ? '#E8927C' : '#7A6080'} strokeWidth={activeId === 3 ? 2.5 : 1} style={{ transition: 'fill 0.25s, stroke 0.25s' }}/>
          <ellipse cx="300" cy="298" rx="145" ry="13" fill={activeId === 3 ? '#C080A0' : '#7A5080'} opacity="0.5" style={{ transition: 'fill 0.25s' }}/>
          <ellipse cx="560" cy="200" rx="90" ry="75" fill="url(#lampGlowR)"/>
          <rect x="535" y="240" width="72" height="44" rx="5" fill={activeId === 2 ? '#7A6040' : '#5A4030'} stroke={activeId === 2 ? '#E8927C' : '#7A6040'} strokeWidth={activeId === 2 ? 2.5 : 1} style={{ transition: 'fill 0.25s, stroke 0.25s' }}/>
          <rect x="540" y="226" width="62" height="18" rx="5" fill={activeId === 2 ? '#A08050' : '#6A5040'} style={{ transition: 'fill 0.25s' }}/>
          <polygon points="572,226 552,174 592,174" fill={activeId === 2 ? '#E8B060' : '#C48A40'} stroke={activeId === 2 ? '#FFD080' : '#E8B060'} strokeWidth="1" style={{ transition: 'fill 0.25s' }}/>
          <rect x="568" y="174" width="9" height="54" fill={activeId === 2 ? '#A08050' : '#7A5830'} style={{ transition: 'fill 0.25s' }}/>
          <circle cx="572" cy="174" r="7" fill={activeId === 2 ? '#FFEEAA' : '#FFE0A0'} opacity="0.95"/>
          <rect x="505" y="258" width="60" height="30" rx="4" fill={activeId === 4 ? '#B09060' : '#8A7050'} stroke={activeId === 4 ? '#E8927C' : 'transparent'} strokeWidth={activeId === 4 ? 2.5 : 0} style={{ transition: 'fill 0.25s, stroke 0.25s' }}/>
          <rect x="52" y="248" width="18" height="30" rx="3" fill="#4A3828"/>
          <ellipse cx="61" cy="248" rx="26" ry="32" fill="#3A5030"/>
          <ellipse cx="44" cy="232" rx="18" ry="24" fill="#4A6040"/>
          <ellipse cx="76" cy="228" rx="15" ry="20" fill="#3A5030"/>
          <rect x="178" y="38" width="50" height="60" rx="4" fill="#3A3028" stroke="#5A4838" strokeWidth="1"/>
          <rect x="472" y="38" width="50" height="60" rx="4" fill="#3A3028" stroke="#5A4838" strokeWidth="1"/>
          {activeId && <ellipse cx="300" cy="295" rx="300" ry="30" fill="rgba(232,146,124,0.05)"/>}
        </svg>
      )}

      <div style={s.preview3dBadge}>
        <span style={{ fontSize: '1rem' }}>🧊</span>
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.78rem', marginBottom: '0.1rem' }}>3D preview</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--stone-light)' }}>Coming soon</div>
        </div>
      </div>

      {imageDataUrl ? (
        <div style={{ ...s.previewActiveLabel, animation: 'fadeIn 0.2s ease' }}>
          <span style={{ color: 'var(--rose)', marginRight: '0.4rem' }}>📷</span>
          Your room
        </div>
      ) : activeId ? (
        <div style={{ ...s.previewActiveLabel, animation: 'fadeIn 0.2s ease' }}>
          <span style={{ color: 'var(--rose)', marginRight: '0.4rem' }}>●</span>
          {suggestions.find(x => x.id === activeId)?.name}
        </div>
      ) : null}
    </div>
  );
}

/* ─────────────────────────────────────────
   SKELETON CARD — shimmer placeholder
───────────────────────────────────────── */
function SkeletonCard({ index }) {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 18,
        overflow: 'hidden',
        border: '1px solid #E8E0D8',
        animation: `fadeUp 0.3s ease both`,
        animationDelay: `${index * 0.06}s`,
      }}
    >
      {/* thumb */}
      <div className="sg-shimmer" style={{ height: 160 }} />
      {/* body */}
      <div style={{ padding: '1.1rem 1.15rem 1.15rem' }}>
        {/* title */}
        <div className="sg-shimmer" style={{ height: 14, borderRadius: 6, marginBottom: 8, width: '72%' }} />
        <div className="sg-shimmer" style={{ height: 14, borderRadius: 6, marginBottom: 4, width: '55%' }} />
        {/* reason lines */}
        <div className="sg-shimmer" style={{ height: 11, borderRadius: 6, marginBottom: 6, marginTop: 14, width: '100%' }} />
        <div className="sg-shimmer" style={{ height: 11, borderRadius: 6, marginBottom: 6, width: '85%' }} />
        {/* divider */}
        <div style={{ height: 1, background: '#F0EAE2', margin: '14px 0' }} />
        {/* footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div className="sg-shimmer" style={{ height: 18, borderRadius: 6, width: 60, marginBottom: 5 }} />
            <div className="sg-shimmer" style={{ height: 10, borderRadius: 6, width: 48 }} />
          </div>
          <div className="sg-shimmer" style={{ height: 32, borderRadius: 100, width: 90 }} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   SKELETON GRID — 6 skeleton cards
───────────────────────────────────────── */
function SkeletonGrid() {
  return (
    <>
      {/* filter row skeleton */}
      <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '1.8rem' }}>
        {[80, 68, 72, 64].map((w, i) => (
          <div key={i} className="sg-shimmer" style={{ height: 32, borderRadius: 100, width: w }} />
        ))}
      </div>
      {/* cards */}
      <div style={s.cardsGrid} className="sg-cards-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} index={i} />
        ))}
      </div>
    </>
  );
}

/* ─────────────────────────────────────────
   SUGGESTION CARD — with real photo
───────────────────────────────────────── */
function SuggestionCard({ item, isActive, onHover, onLeave, index }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError]   = useState(false);
  const photoUrl = item.imageQuery ? unsplashUrl(item.imageQuery) : null;

  return (
    <div
      className={`sg-card sg-card-stagger-${index + 1}${isActive ? ' active' : ''}`}
      onMouseEnter={() => onHover(item.id)}
      onMouseLeave={onLeave}
    >
      <div style={{ ...s.cardThumb, background: item.gradient, position: 'relative' }}>
        {/* Real photo — fades in over gradient once loaded */}
        {photoUrl && !imgError && (
          <img
            className="sg-card-photo"
            src={photoUrl}
            alt={item.name}
            style={{ opacity: imgLoaded ? 1 : 0 }}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
          />
        )}
        <div className="sg-thumb-overlay" />
        <div style={s.matchBar}>
          <div style={{ ...s.matchFill, width: `${item.match}%`, background: item.accentColor }} />
        </div>
        {item.tag && <div style={s.cardTag}>{item.tag}</div>}
        <div style={s.matchBadge}>{item.match}%</div>
        <div style={s.thumbCategory}>{item.category}</div>
      </div>
      <div style={s.cardBody}>
        <h3 style={s.cardName}>{item.name}</h3>
        <p style={s.cardReason}>{item.reason}</p>
        <div style={s.cardDivider} />
        <div style={s.cardFooter}>
          <div>
            <div style={s.cardPrice}>{item.price}</div>
            <div style={s.cardRetailer}>via {item.retailer}</div>
          </div>
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="sg-card-btn"
          >
            Shop now →
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   COLOR PALETTE
───────────────────────────────────────── */
function PaletteStrip({ palette }) {
  return (
    <div style={s.paletteWrap}>
      <div style={s.sectionLabel}>Detected palette</div>
      <div style={s.paletteSwatches}>
        {palette.map(p => (
          <div key={p.color} style={s.swatchWrap}>
            <div style={{ ...s.swatch, background: p.color }} />
            <div style={s.swatchName}>{p.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   ROOM INSIGHTS
───────────────────────────────────────── */
function RoomInsights({ insights }) {
  return (
    <div style={s.insightsWrap}>
      <div style={s.sectionLabel}>Room analysis</div>
      {insights.map(item => (
        <div key={item.label} style={s.insightRow}>
          <div style={s.insightIconWrap}>{item.icon}</div>
          <div>
            <div style={s.insightLabel}>{item.label}</div>
            <div style={s.insightValue}>{item.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   RESULTS PAGE
───────────────────────────────────────── */
export default function ResultsPage() {
  useGlobalStyle(GLOBAL_CSS);
  const [activeId, setActiveId]       = useState(null);
  const [filter, setFilter]           = useState('All');
  const [suggestions, setSuggestions] = useState(FALLBACK_SUGGESTIONS);
  const [palette, setPalette]         = useState(FALLBACK_PALETTE);
  const [insights, setInsights]       = useState(FALLBACK_INSIGHTS);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);

  // Keep image in local state so re-upload triggers a new analysis without a full navigate
  const location    = useLocation();
  const navigate    = useNavigate();
  const fileRef     = useRef(null);
  const [imageDataUrl, setImageDataUrl] = useState(location.state?.imageDataUrl || null);

  // Run AI analysis whenever imageDataUrl changes
  const runAnalysis = useCallback(async (imgUrl) => {
    if (!imgUrl) return;
    setLoading(true);
    setError(null);
    // Reset to fallback while analysing so stale data doesn't linger
    setSuggestions(FALLBACK_SUGGESTIONS);
    setPalette(FALLBACK_PALETTE);
    setInsights(FALLBACK_INSIGHTS);
    setFilter('All');
    try {
      const result = await analyzeRoom(imgUrl);
      setSuggestions(result.suggestions);
      setPalette(result.palette);
      setInsights(result.insights);
    } catch (err) {
      console.error('AI analysis failed:', err);
      setError('Could not analyse the photo. Showing general suggestions instead.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    runAnalysis(imageDataUrl);
  }, [imageDataUrl, runAnalysis]);

  // Re-upload handler — update local state instead of navigating,
  // which guarantees the useEffect above fires even for the same route.
  function handleReupload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    // Reset the input so selecting the same file again still fires onChange
    e.target.value = '';
    const reader = new FileReader();
    reader.onload = () => setImageDataUrl(reader.result);
    reader.readAsDataURL(file);
  }

  const categories = ['All', ...Array.from(new Set(suggestions.map(sg => sg.category)))];
  const filtered   = filter === 'All' ? suggestions : suggestions.filter(sg => sg.category === filter);

  // Calculate estimated total from suggestions
  const totalCost = suggestions.reduce((acc, sg) => {
    const num = parseFloat((sg.price || '').replace(/[^0-9.]/g, ''));
    return acc + (isNaN(num) ? 0 : num);
  }, 0);

  return (
    <div style={s.page}>
      <ResultsNav count={suggestions.length} />

      <main style={s.main} className="sg-main">
        {/* Sidebar */}
        <aside style={s.sidebar} className="sg-sidebar">
          <RoomPreview activeId={activeId} imageDataUrl={imageDataUrl} suggestions={suggestions} />
          <PaletteStrip palette={palette} />
          <RoomInsights insights={insights} />
          <input type="file" accept="image/*" ref={fileRef} hidden onChange={handleReupload} />
          <button className="sg-reupload-btn" onClick={() => fileRef.current.click()}>
            ↑ Upload a new room
          </button>
        </aside>

        {/* Suggestions column */}
        <section style={s.suggestionsCol} className="sg-suggestions-col">
          <div style={s.suggestionsHeader} className="sg-suggestions-header">
            <div style={{ animation: 'fadeUp 0.4s ease' }}>
              <div style={s.eyebrow}>ai suggestions</div>
              <h1 style={s.suggestionsH1} className="sg-suggestions-h1">
                Here's what your room{' '}
                <em style={{ fontStyle: 'italic', color: 'var(--rose)' }}>needs.</em>
              </h1>
            </div>
            <div style={s.budgetPill} className="sg-budget-pill">
              Est. total: <strong>${totalCost.toLocaleString()}</strong>
            </div>
          </div>

          {error && (
            <div style={s.errorBanner}>⚠️ {error}</div>
          )}

          {loading ? (
            <SkeletonGrid />
          ) : (
            <>
              <div style={s.filterRow} className="sg-filter-row">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`sg-filter-tab${filter === cat ? ' active' : ''}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div style={s.cardsGrid} className="sg-cards-grid">
                {filtered.map((item, i) => (
                  <SuggestionCard
                    key={item.id}
                    item={item}
                    index={i}
                    isActive={activeId === item.id}
                    onHover={setActiveId}
                    onLeave={() => setActiveId(null)}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

/* ─────────────────────────────────────────
   STYLES
───────────────────────────────────────── */
const s = {
  page: { background: 'var(--ivory)', minHeight: '100vh', fontFamily: 'var(--sans)' },
  nav: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 2.5rem', height: 64,
    background: 'rgba(28,25,23,0.93)',
    backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  navLogo: {
    fontFamily: 'var(--serif)', fontSize: '1.3rem', fontWeight: 500,
    color: 'var(--ivory)', background: 'none', border: 'none', cursor: 'pointer',
    letterSpacing: '0.02em',
  },
  navCenter: { display: 'flex', alignItems: 'center', gap: '0.6rem' },
  navCrumb: { fontSize: '0.84rem', color: 'var(--stone-light)' },
  navCrumbSep: { color: '#44403C', fontSize: '0.84rem' },
  main: {
    display: 'grid', gridTemplateColumns: '400px 1fr',
    minHeight: '100vh', paddingTop: 64,
  },
  sidebar: {
    background: 'var(--dark)', padding: '2rem 1.8rem',
    position: 'sticky', top: 64, height: 'calc(100vh - 64px)',
    overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.2rem',
  },
  previewWrap: {
    borderRadius: 14, overflow: 'hidden', position: 'relative',
    background: '#1C1917', border: '1px solid rgba(255,255,255,0.06)',
  },
  previewSvg: { width: '100%', display: 'block' },
  preview3dBadge: {
    position: 'absolute', bottom: 10, left: 10,
    background: 'rgba(20,18,17,0.88)', backdropFilter: 'blur(8px)',
    borderRadius: 10, padding: '0.5rem 0.85rem',
    display: 'flex', alignItems: 'center', gap: '0.55rem',
    color: 'var(--ivory)', fontSize: '0.75rem',
    border: '1px solid rgba(255,255,255,0.08)',
  },
  previewActiveLabel: {
    position: 'absolute', top: 10, left: 10,
    background: 'rgba(20,18,17,0.88)', backdropFilter: 'blur(8px)',
    borderRadius: 8, padding: '0.38rem 0.75rem',
    fontSize: '0.73rem', color: 'var(--ivory)',
    border: '1px solid rgba(232,146,124,0.35)',
  },
  sectionLabel: {
    fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.11em',
    textTransform: 'uppercase', color: 'var(--stone)', marginBottom: '0.85rem',
  },
  paletteWrap: {
    background: 'var(--dark2)', borderRadius: 12, padding: '1.1rem',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  paletteSwatches: { display: 'flex', gap: '0.55rem', flexWrap: 'wrap' },
  swatchWrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' },
  swatch: { width: 34, height: 34, borderRadius: 8, border: '1px solid rgba(255,255,255,0.07)' },
  swatchName: { fontSize: '0.6rem', color: '#55524F', textAlign: 'center', maxWidth: 42 },
  insightsWrap: {
    background: 'var(--dark2)', borderRadius: 12, padding: '1.1rem',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  insightRow: { display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.8rem' },
  insightIconWrap: {
    width: 30, height: 30, borderRadius: 8, background: 'rgba(255,255,255,0.05)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.85rem', flexShrink: 0,
  },
  insightLabel: { fontSize: '0.7rem', color: 'var(--stone)', marginBottom: '0.12rem' },
  insightValue: { fontSize: '0.8rem', color: 'var(--ivory)', fontWeight: 500 },
  suggestionsCol: { padding: '2.8rem 2.8rem 4rem', background: 'var(--ivory)', overflowY: 'auto' },
  suggestionsHeader: {
    display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
    marginBottom: '1.8rem', flexWrap: 'wrap', gap: '1rem',
  },
  eyebrow: {
    fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.13em',
    textTransform: 'uppercase', color: 'var(--rose)', marginBottom: '0.45rem',
  },
  suggestionsH1: {
    fontFamily: 'var(--serif)', fontSize: 'clamp(1.8rem, 2.4vw, 2.4rem)',
    fontWeight: 400, lineHeight: 1.2, color: 'var(--dark)',
  },
  budgetPill: {
    background: '#fff', border: '1px solid #E8E0D8', borderRadius: 100,
    padding: '0.5rem 1.1rem', fontSize: '0.8rem', color: 'var(--stone)',
    whiteSpace: 'nowrap', alignSelf: 'flex-start', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  filterRow: { display: 'flex', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '1.8rem' },
  cardsGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.1rem',
  },
  cardThumb: { height: 160, position: 'relative' },
  cardTag: {
    position: 'absolute', top: 10, left: 10,
    background: 'rgba(232,146,124,0.92)', color: '#fff',
    fontSize: '0.67rem', fontWeight: 700, letterSpacing: '0.05em',
    padding: '0.28rem 0.65rem', borderRadius: 100, backdropFilter: 'blur(4px)',
    zIndex: 2,
  },
  matchBadge: {
    position: 'absolute', top: 10, right: 10,
    background: 'rgba(0,0,0,0.48)', backdropFilter: 'blur(6px)',
    color: '#fff', fontSize: '0.7rem', fontWeight: 700,
    padding: '0.28rem 0.65rem', borderRadius: 100,
    zIndex: 2,
  },
  thumbCategory: {
    position: 'absolute', bottom: 24, left: 12,
    fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.1em',
    textTransform: 'uppercase', color: 'rgba(255,255,255,0.75)',
    zIndex: 2,
  },
  matchBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: 'rgba(0,0,0,0.2)', zIndex: 2 },
  matchFill: { height: '100%', transition: 'width 0.6s ease', opacity: 0.85 },
  cardBody: { padding: '1.1rem 1.15rem 1.15rem' },
  cardName: {
    fontFamily: 'var(--serif)', fontSize: '1.02rem', fontWeight: 400,
    color: 'var(--dark)', lineHeight: 1.3, marginBottom: '0.5rem',
  },
  cardReason: { fontSize: '0.78rem', color: 'var(--stone)', lineHeight: 1.65, fontWeight: 300, marginBottom: '0.9rem' },
  cardDivider: { height: 1, background: '#F0EAE2', marginBottom: '0.9rem' },
  cardFooter: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  cardPrice: { fontFamily: 'var(--serif)', fontSize: '1.1rem', fontWeight: 500, color: 'var(--dark)' },
  cardRetailer: { fontSize: '0.68rem', color: 'var(--stone-light)', marginTop: '0.08rem' },
  errorBanner: {
    background: 'rgba(232,146,124,0.1)', border: '1px solid rgba(232,146,124,0.3)',
    borderRadius: 10, padding: '0.75rem 1rem', fontSize: '0.82rem',
    color: 'var(--rose)', marginBottom: '1.2rem',
  },
};
