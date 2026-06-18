import './App.css';
import { useRef, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import ResultsPage from './ResultsPage';

/* ─────────────────────────────────────────
   GLOBAL CSS — responsive + animations
───────────────────────────────────────── */
const HOMEPAGE_CSS = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes scanLine {
    0%   { top: 8%; opacity: 0.7; }
    100% { top: 88%; opacity: 0; }
  }
  @keyframes progressFill {
    from { width: 0%; }
    to   { width: 100%; }
  }
  @keyframes pulseRing {
    0%   { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(232,146,124,0.4); }
    70%  { transform: scale(1);    box-shadow: 0 0 0 14px rgba(232,146,124,0); }
    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(232,146,124,0); }
  }
  @keyframes dotBounce {
    0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
    40%           { transform: translateY(-6px); opacity: 1; }
  }

  /* ── HAMBURGER NAV ── */
  .hp-nav-links { display: flex; align-items: center; gap: 2.5rem; }
  .hp-hamburger { display: none; background: none; border: none; cursor: pointer; padding: 4px; }
  .hp-mobile-menu {
    display: none;
    position: fixed; top: 64px; left: 0; right: 0; z-index: 190;
    background: rgba(28,25,23,0.98); backdrop-filter: blur(12px);
    padding: 1.5rem 2rem 2rem;
    flex-direction: column; gap: 1.2rem;
    border-bottom: 1px solid rgba(255,255,255,0.08);
    animation: fadeIn 0.2s ease;
  }
  .hp-mobile-menu.open { display: flex; }
  .hp-mobile-link {
    font-size: 1rem; color: var(--stone-light);
    text-decoration: none; font-weight: 400;
  }

  /* ── ROOM STRIP ── */
  .hp-room-strip { display: flex; gap: 12px; max-width: 900px; width: 100%; margin: 0 auto; }

  /* ── STEPS ── */
  .hp-steps-row { display: grid; grid-template-columns: repeat(3,1fr); gap: 2.5rem; margin-top: 4rem; }

  /* ── BENTO ── */
  .hp-bento { display: grid; grid-template-columns: 1.4fr 1fr; grid-template-rows: auto auto; gap: 16px; margin-top: 4rem; }

  /* ── REVIEWS ── */
  .hp-reviews-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.5rem; margin-top: 4rem; }

  /* ── PROOF BAR ── */
  .hp-proof-bar { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; }

  /* ── FOOTER ── */
  .hp-footer-links { display: flex; gap: 2rem; list-style: none; }

  /* ── DRAG OVERLAY ── */
  .hp-drop-active .hp-hero-upload-zone {
    border-color: var(--rose) !important;
    background: rgba(232,146,124,0.08) !important;
  }

  /* ════════════════════════════════════════
     TABLET  (≤ 900px)
  ════════════════════════════════════════ */
  @media (max-width: 900px) {
    .hp-nav-links { display: none !important; }
    .hp-hamburger { display: flex !important; }

    .hp-room-strip { flex-direction: column !important; gap: 8px !important; }

    .hp-steps-row { grid-template-columns: 1fr !important; gap: 2rem !important; }

    .hp-bento { grid-template-columns: 1fr !important; }
    .hp-bento > div:first-child { grid-row: auto !important; }

    .hp-reviews-grid { grid-template-columns: 1fr !important; gap: 1rem !important; }

    .hp-proof-bar { gap: 0 !important; }
    .hp-proof-item { padding: 0.8rem 1.2rem !important; }

    .hp-footer-inner {
      flex-direction: column !important;
      align-items: flex-start !important;
      gap: 1.2rem !important;
    }
    .hp-footer-links { flex-wrap: wrap !important; gap: 1rem !important; }
  }

  /* ════════════════════════════════════════
     MOBILE  (≤ 600px)
  ════════════════════════════════════════ */
  @media (max-width: 600px) {
    .hp-hero { padding: 7rem 1.4rem 3.5rem !important; }
    .hp-hero-h1 { font-size: 2.4rem !important; }
    .hp-hero-sub { font-size: 0.97rem !important; }
    .hp-hero-actions { flex-direction: column !important; align-items: center !important; }
    .hp-hero-actions a, .hp-hero-actions button { width: 100% !important; max-width: 320px !important; text-align: center !important; }

    .hp-how { padding: 5rem 1.4rem !important; }
    .hp-what { padding: 5rem 1.4rem !important; }
    .hp-testimonials { padding: 5rem 1.4rem !important; }
    .hp-cta { padding: 5rem 1.4rem !important; }

    .hp-reviews-grid { grid-template-columns: 1fr !important; }
    .hp-proof-bar { gap: 0 !important; }
    .hp-proof-item { padding: 0.6rem 0.9rem !important; }
    .hp-proof-num { font-size: 1.4rem !important; }

    .hp-nav { padding: 0 1.2rem !important; }
    .hp-footer { padding: 2rem 1.4rem !important; }
  }

  /* ════════════════════════════════════════
     SMALL MOBILE  (≤ 400px)
  ════════════════════════════════════════ */
  @media (max-width: 400px) {
    .hp-hero-h1 { font-size: 2rem !important; }
    .hp-suggestion-float { display: none !important; }
  }
`;

function useInjectStyle(css) {
  useEffect(() => {
    const el = document.createElement('style');
    el.textContent = css;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, [css]);
}

/* ─────────────────────────────────────────
   ANALYZING SCREEN
───────────────────────────────────────── */
const ANALYZING_STEPS = [
  'Reading room dimensions…',
  'Detecting colour palette…',
  'Identifying existing furniture…',
  'Matching lighting conditions…',
  'Generating style suggestions…',
];

function AnalyzingScreen({ imageDataUrl }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress]   = useState(0);

  useEffect(() => {
    // Cycle through step labels every 700ms
    const stepTimer = setInterval(() => {
      setStepIndex(i => (i + 1) % ANALYZING_STEPS.length);
    }, 700);

    // Smooth progress bar over ~3.5 s
    const start  = Date.now();
    const duration = 3500;
    const tick = () => {
      const elapsed = Date.now() - start;
      setProgress(Math.min(95, (elapsed / duration) * 100));
      if (elapsed < duration) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    return () => clearInterval(stepTimer);
  }, []);

  return (
    <div style={as.overlay}>
      {/* Blurred room photo bg */}
      {imageDataUrl && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: `url(${imageDataUrl})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'blur(18px) brightness(0.25)',
          transform: 'scale(1.05)',
        }} />
      )}

      <div style={as.card}>
        {/* Room preview with scan line */}
        {imageDataUrl && (
          <div style={as.previewBox}>
            <img src={imageDataUrl} alt="room" style={as.previewImg} />
            {/* Animated scan line */}
            <div style={as.scanLine} />
            {/* Corner brackets */}
            {['tl','tr','bl','br'].map(c => (
              <div key={c} style={{ ...as.corner, ...as[c] }} />
            ))}
          </div>
        )}

        {/* Pulsing icon */}
        <div style={as.iconRing}>
          <span style={{ fontSize: '1.6rem' }}>✦</span>
        </div>

        <h2 style={as.title}>Analysing your room</h2>

        {/* Step text with dots */}
        <div style={as.stepRow}>
          <span style={as.stepText}>{ANALYZING_STEPS[stepIndex]}</span>
          <span style={as.dots}>
            {[0,1,2].map(i => (
              <span key={i} style={{ ...as.dot, animationDelay: `${i * 0.18}s` }} />
            ))}
          </span>
        </div>

        {/* Progress bar */}
        <div style={as.progressTrack}>
          <div style={{ ...as.progressFill, width: `${progress}%` }} />
        </div>
        <div style={as.progressLabel}>{Math.round(progress)}%</div>
      </div>
    </div>
  );
}

const as = {
  overlay: {
    position: 'fixed', inset: 0, zIndex: 500,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'rgba(20,18,16,0.7)',
    animation: 'fadeIn 0.3s ease',
  },
  card: {
    position: 'relative', zIndex: 1,
    background: 'rgba(28,25,23,0.95)',
    border: '1px solid rgba(232,146,124,0.2)',
    borderRadius: 24, padding: '2.8rem 2.4rem',
    width: '100%', maxWidth: 420,
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    gap: '1.4rem', backdropFilter: 'blur(20px)',
    boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
  },
  previewBox: {
    width: '100%', borderRadius: 14, overflow: 'hidden',
    position: 'relative', aspectRatio: '16/9',
    border: '1px solid rgba(232,146,124,0.25)',
  },
  previewImg: {
    width: '100%', height: '100%', objectFit: 'cover', display: 'block',
  },
  scanLine: {
    position: 'absolute', left: 0, right: 0, height: 2,
    background: 'linear-gradient(90deg, transparent, rgba(232,146,124,0.9), transparent)',
    animation: 'scanLine 1.4s ease-in-out infinite',
    boxShadow: '0 0 12px rgba(232,146,124,0.6)',
  },
  corner: {
    position: 'absolute', width: 18, height: 18,
    border: '2px solid var(--rose)', opacity: 0.8,
  },
  tl: { top: 8,  left: 8,  borderRight: 'none', borderBottom: 'none' },
  tr: { top: 8,  right: 8, borderLeft: 'none',  borderBottom: 'none' },
  bl: { bottom: 8, left: 8,  borderRight: 'none', borderTop: 'none' },
  br: { bottom: 8, right: 8, borderLeft: 'none',  borderTop: 'none' },
  iconRing: {
    width: 60, height: 60, borderRadius: '50%',
    background: 'rgba(232,146,124,0.12)',
    border: '1px solid rgba(232,146,124,0.3)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'var(--rose)',
    animation: 'pulseRing 1.8s ease infinite',
  },
  title: {
    fontFamily: 'var(--serif)', fontSize: '1.5rem',
    fontWeight: 400, color: 'var(--ivory)', margin: 0, textAlign: 'center',
  },
  stepRow: {
    display: 'flex', alignItems: 'center', gap: '0.5rem',
    minHeight: 22,
  },
  stepText: {
    fontSize: '0.85rem', color: 'var(--stone-light)', fontWeight: 300,
    animation: 'fadeIn 0.25s ease',
  },
  dots: { display: 'flex', gap: 4 },
  dot: {
    display: 'inline-block', width: 5, height: 5, borderRadius: '50%',
    background: 'var(--rose)', opacity: 0.4,
    animation: 'dotBounce 1s ease infinite',
  },
  progressTrack: {
    width: '100%', height: 4, borderRadius: 100,
    background: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%', borderRadius: 100,
    background: 'linear-gradient(90deg, #c4705a, var(--rose), #f0a090)',
    transition: 'width 0.3s ease',
    boxShadow: '0 0 8px rgba(232,146,124,0.5)',
  },
  progressLabel: {
    fontSize: '0.75rem', color: 'var(--stone)', fontWeight: 500,
    alignSelf: 'flex-end', marginTop: '-0.8rem',
  },
};

/* ─────────────────────────────────────────
   NAV
───────────────────────────────────────── */
function Nav({ onUpload }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const fileRef = useRef(null);

  return (
    <>
      <nav style={styles.nav} className="hp-nav">
        <a href="/" style={styles.logo}>
          Sug<span style={{ color: 'var(--rose)' }}>Gos</span>
        </a>

        {/* Desktop links */}
        <div className="hp-nav-links">
          <a href="#how" style={styles.navLink}>How it works</a>
          <a href="#features" style={styles.navLink}>Features</a>
          <input type="file" accept="image/*" ref={fileRef} hidden onChange={onUpload} />
          <button
            onClick={() => fileRef.current.click()}
            style={{ ...styles.navLink, ...styles.navBtn, border: 'none', cursor: 'pointer' }}
          >
            Try for free
          </button>
        </div>

        {/* Hamburger */}
        <button
          className="hp-hamburger"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Menu"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            {menuOpen
              ? <>
                  <line x1="4" y1="4" x2="18" y2="18" stroke="#A8A29E" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="18" y1="4" x2="4" y2="18" stroke="#A8A29E" strokeWidth="2" strokeLinecap="round"/>
                </>
              : <>
                  <line x1="3" y1="6"  x2="19" y2="6"  stroke="#A8A29E" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="3" y1="11" x2="19" y2="11" stroke="#A8A29E" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="3" y1="16" x2="19" y2="16" stroke="#A8A29E" strokeWidth="2" strokeLinecap="round"/>
                </>
            }
          </svg>
        </button>
      </nav>

      {/* Mobile dropdown */}
      <div className={`hp-mobile-menu${menuOpen ? ' open' : ''}`}>
        <a href="#how"      className="hp-mobile-link" onClick={() => setMenuOpen(false)}>How it works</a>
        <a href="#features" className="hp-mobile-link" onClick={() => setMenuOpen(false)}>Features</a>
        <input type="file" accept="image/*" hidden onChange={e => { onUpload(e); setMenuOpen(false); }} id="mob-upload" />
        <label htmlFor="mob-upload" style={{
          background: 'var(--rose)', color: '#fff', fontSize: '0.95rem',
          fontWeight: 500, padding: '0.85rem 1.6rem', borderRadius: 100,
          textAlign: 'center', cursor: 'pointer',
        }}>
          Upload your room →
        </label>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────
   SVG ROOM ILLUSTRATIONS
───────────────────────────────────────── */
function RoomBefore() {
  return (
    <svg style={styles.roomSvg} viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="300" fill="#201C1A"/>
      <polygon points="0,180 400,180 400,300 0,300" fill="#2A2420"/>
      <line x1="0" y1="210" x2="400" y2="210" stroke="#322C28" strokeWidth="1"/>
      <line x1="0" y1="240" x2="400" y2="240" stroke="#322C28" strokeWidth="1"/>
      <line x1="0" y1="270" x2="400" y2="270" stroke="#322C28" strokeWidth="1"/>
      <line x1="100" y1="180" x2="80" y2="300" stroke="#322C28" strokeWidth="1"/>
      <line x1="200" y1="180" x2="200" y2="300" stroke="#322C28" strokeWidth="1"/>
      <line x1="300" y1="180" x2="320" y2="300" stroke="#322C28" strokeWidth="1"/>
      <rect x="140" y="30" width="120" height="90" rx="2" fill="#1A2030" stroke="#2A3040" strokeWidth="1.5"/>
      <line x1="200" y1="30" x2="200" y2="120" stroke="#2A3040" strokeWidth="1.5"/>
      <line x1="140" y1="75" x2="260" y2="75" stroke="#2A3040" strokeWidth="1.5"/>
      <polygon points="200,120 130,180 270,180" fill="rgba(200,220,255,0.03)"/>
      <rect x="60" y="148" width="220" height="40" rx="3" fill="#3A2E26" stroke="#4A3A2E" strokeWidth="1"/>
      <rect x="60" y="130" width="220" height="22" rx="3" fill="#4A3A2E"/>
      <rect x="60" y="148" width="30" height="40" rx="2" fill="#4A3A2E"/>
      <rect x="250" y="148" width="30" height="40" rx="2" fill="#4A3A2E"/>
      <ellipse cx="200" cy="185" rx="120" ry="12" fill="#2E2620" stroke="#3A302A" strokeWidth="1"/>
      <rect x="295" y="158" width="45" height="30" rx="2" fill="#2E2820"/>
      <rect x="298" y="148" width="39" height="12" rx="2" fill="#3A342C"/>
      <polygon points="320,148 308,118 332,118" fill="#3A3430"/>
      <rect x="317" y="118" width="6" height="30" fill="#3A3430"/>
    </svg>
  );
}

function RoomAfter() {
  return (
    <svg style={styles.roomSvg} viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="300" fill="#2A2220"/>
      <rect x="100" y="0" width="200" height="180" fill="#2E2520"/>
      <polygon points="0,180 400,180 400,300 0,300" fill="#2E2824"/>
      <line x1="0" y1="210" x2="400" y2="210" stroke="#3A3028" strokeWidth="1"/>
      <line x1="0" y1="240" x2="400" y2="240" stroke="#3A3028" strokeWidth="1"/>
      <line x1="0" y1="270" x2="400" y2="270" stroke="#3A3028" strokeWidth="1"/>
      <line x1="100" y1="180" x2="80" y2="300" stroke="#3A3028" strokeWidth="1"/>
      <line x1="200" y1="180" x2="200" y2="300" stroke="#3A3028" strokeWidth="1"/>
      <line x1="300" y1="180" x2="320" y2="300" stroke="#3A3028" strokeWidth="1"/>
      <rect x="140" y="30" width="120" height="90" rx="2" fill="#2A3848" stroke="#3A5060" strokeWidth="1.5"/>
      <line x1="200" y1="30" x2="200" y2="120" stroke="#3A5060" strokeWidth="1.5"/>
      <line x1="140" y1="75" x2="260" y2="75" stroke="#3A5060" strokeWidth="1.5"/>
      <defs>
        <radialGradient id="lampGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E8A060" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#E8A060" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <ellipse cx="320" cy="130" rx="60" ry="50" fill="url(#lampGlow)"/>
      <rect x="55" y="150" width="230" height="36" rx="6" fill="#7A5C44" stroke="#9A7A5A" strokeWidth="1"/>
      <rect x="55" y="132" width="230" height="22" rx="5" fill="#8A6A50"/>
      <rect x="55" y="150" width="28" height="36" rx="4" fill="#8A6A50"/>
      <rect x="257" y="150" width="28" height="36" rx="4" fill="#8A6A50"/>
      <rect x="92" y="136" width="44" height="18" rx="8" fill="#C4906A" opacity="0.8"/>
      <rect x="148" y="136" width="44" height="18" rx="8" fill="#E8927C" opacity="0.7"/>
      <rect x="204" y="136" width="44" height="18" rx="8" fill="#C4906A" opacity="0.8"/>
      <ellipse cx="180" cy="188" rx="130" ry="14" fill="#5A4060" stroke="#7A6080" strokeWidth="1"/>
      <ellipse cx="180" cy="188" rx="90" ry="9" fill="#7A5080" opacity="0.5"/>
      <rect x="295" y="158" width="50" height="30" rx="4" fill="#5A4030" stroke="#7A6040" strokeWidth="1"/>
      <rect x="298" y="148" width="44" height="13" rx="4" fill="#6A5040"/>
      <polygon points="323,148 309,112 337,112" fill="#C48A40" stroke="#E8B060" strokeWidth="1"/>
      <rect x="319" y="112" width="8" height="38" fill="#7A5830"/>
      <circle cx="323" cy="112" r="5" fill="#FFE0A0" opacity="0.9"/>
      <rect x="22" y="158" width="14" height="22" rx="2" fill="#4A3828"/>
      <ellipse cx="29" cy="158" rx="18" ry="22" fill="#3A5030"/>
      <ellipse cx="20" cy="148" rx="12" ry="16" fill="#4A6040"/>
      <ellipse cx="36" cy="145" rx="10" ry="14" fill="#3A5030"/>
      <rect x="108" y="22" width="60" height="50" rx="3" fill="#3A3028" stroke="#5A4838" strokeWidth="1"/>
      <ellipse cx="138" cy="47" rx="18" ry="14" fill="#7A5040" opacity="0.6"/>
      <rect x="232" y="22" width="60" height="50" rx="3" fill="#3A3028" stroke="#5A4838" strokeWidth="1"/>
      <line x1="248" y1="35" x2="276" y2="65" stroke="#6A8040" strokeWidth="2" opacity="0.6"/>
      <line x1="276" y1="35" x2="248" y2="65" stroke="#6A8040" strokeWidth="2" opacity="0.4"/>
    </svg>
  );
}

/* ─────────────────────────────────────────
   HERO
───────────────────────────────────────── */
function Hero({ onUpload }) {
  const fileRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const fakeEvent = { target: { files: [file] } };
    onUpload(fakeEvent);
  }

  return (
    <section
      style={styles.hero}
      className={`hp-hero${dragging ? ' hp-drop-active' : ''}`}
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <div style={styles.heroBg} aria-hidden="true" />
      <div style={styles.heroTag}>AI-powered interior design</div>
      <h1 style={styles.heroH1} className="hp-hero-h1">
        Your room has a<br />
        <em style={{ fontStyle: 'italic', color: 'var(--rose)' }}>better version</em> of itself.
      </h1>
      <p style={styles.heroSub} className="hp-hero-sub">
        Upload a photo. SugGos reads your space and shows you exactly how to make it beautiful — with real furniture you can actually buy.
      </p>

      <div style={styles.heroActions} className="hp-hero-actions">
        <input type="file" accept="image/*" ref={fileRef} hidden onChange={onUpload} />
        <button
          onClick={() => fileRef.current.click()}
          style={{ ...styles.btnRose, border: 'none', cursor: 'pointer' }}
        >
          Upload your room →
        </button>
        <a href="#how" style={styles.btnGhost}>See how it works</a>
      </div>

      {/* Drag hint */}
      {dragging && (
        <div style={styles.dragHint}>📷 Drop your room photo here</div>
      )}

      {/* Room strip */}
      <div className="hp-room-strip">
        <div style={{ ...styles.roomCard, ...styles.roomBefore }}>
          <RoomBefore />
          <div style={styles.roomPill}>before</div>
        </div>
        <div style={{ ...styles.roomCard, ...styles.roomAfter }}>
          <RoomAfter />
          <div style={styles.suggestionFloat} className="hp-suggestion-float">
            <strong style={{ display: 'block', fontWeight: 600, fontSize: '0.75rem', marginBottom: '0.2rem' }}>✦ SugGos pick</strong>
            Velvet accent sofa<br />
            <span style={{ color: 'var(--rose)', fontWeight: 600 }}>$649 →</span>
          </div>
          <div style={{ ...styles.roomPill, background: 'rgba(232,146,124,0.8)' }}>after</div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   PROOF BAR
───────────────────────────────────────── */
const proofItems = [
  { num: '50k+', label: 'rooms redesigned' },
  { num: '4.9★', label: 'average rating' },
  { num: '30 sec', label: 'to first suggestion' },
  { num: 'Free', label: 'to get started' },
];

function ProofBar() {
  return (
    <div style={styles.proofBar} className="hp-proof-bar">
      {proofItems.map((item, i) => (
        <div key={item.label} style={{ display: 'flex', alignItems: 'center' }}>
          {i > 0 && <div style={styles.proofDivider} />}
          <div style={styles.proofItem} className="hp-proof-item">
            <div style={styles.proofNum} className="hp-proof-num">{item.num}</div>
            <div style={styles.proofLabel}>{item.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   HOW IT WORKS
───────────────────────────────────────── */
const steps = [
  { icon: '📷', title: 'Snap a photo', body: 'Take a quick photo of any room — living room, bedroom, kitchen, anywhere. No special setup needed. A phone photo works perfectly.' },
  { icon: '✨', title: 'AI reads your space', body: 'SugGos analyzes your room — the layout, the light, what furniture you already have, and your colour palette — in about 30 seconds.' },
  { icon: '🛒', title: 'Shop the look', body: 'Get personalised furniture and decor suggestions matched to your space, with real products and prices. Preview them in 3D before you buy.' },
];

function HowItWorks() {
  return (
    <section style={styles.how} className="hp-how" id="how">
      <div style={styles.eyebrow}>how it works</div>
      <h2 style={styles.sectionH}>Three steps to a room you <em style={{ fontStyle: 'italic' }}>love.</em></h2>
      <div className="hp-steps-row">
        {steps.map(step => (
          <div key={step.title} style={styles.stepItem}>
            <div style={styles.stepIconWrap}>{step.icon}</div>
            <h3 style={styles.stepH}>{step.title}</h3>
            <p style={styles.stepP}>{step.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   FEATURES BENTO
───────────────────────────────────────── */
const products = [
  { thumb: { background: 'linear-gradient(135deg, #5C4A3A, #8B6B4A)' }, name: 'Velvet accent sofa, sand', meta: 'matches your warm palette', price: '$649' },
  { thumb: { background: 'linear-gradient(135deg, #8A7A5A, #C4A870)' }, name: 'Arc floor lamp, brass', meta: 'fills your empty corner', price: '$189' },
  { thumb: { background: 'linear-gradient(135deg, #6A5060, #A07080)' }, name: 'Moroccan area rug, plum', meta: 'anchors your seating area', price: '$299' },
];

function Features() {
  return (
    <section style={styles.what} className="hp-what" id="features">
      <div style={styles.whatInner}>
        <div style={{ ...styles.eyebrow, color: 'var(--rose-light)' }}>what you get</div>
        <h2 style={{ ...styles.sectionH, color: 'var(--ivory)', maxWidth: 500 }}>
          Design advice that <em style={{ fontStyle: 'italic' }}>knows</em> your room.
        </h2>
        <div className="hp-bento" style={{ marginTop: '4rem' }}>
          <div style={{ ...styles.bentoCard, gridRow: 'span 2' }}>
            <span style={styles.bentoIcon}>🛋️</span>
            <h3 style={styles.bentoH}>Real products, real prices</h3>
            <p style={styles.bentoP}>Every suggestion is a real item you can buy. SugGos matches furniture and decor to your room's style.</p>
            <div style={styles.bentoVisual}>
              {products.map(p => (
                <div key={p.name} style={styles.productRow}>
                  <div style={{ ...styles.productThumb, ...p.thumb }} />
                  <div style={{ flex: 1 }}>
                    <div style={styles.productName}>{p.name}</div>
                    <div style={styles.productMeta}>{p.meta}</div>
                  </div>
                  <div style={styles.productPrice}>{p.price}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={styles.bentoCard}>
            <span style={styles.bentoIcon}>🧊</span>
            <h3 style={styles.bentoH}>See it in 3D first</h3>
            <p style={styles.bentoP}>Preview any piece of furniture in your actual room before spending a cent.</p>
          </div>
          <div style={styles.bentoCard}>
            <span style={styles.bentoIcon}>🎨</span>
            <h3 style={styles.bentoH}>Colour & layout ideas</h3>
            <p style={styles.bentoP}>Get colour palette suggestions and layout tweaks tailored to your specific room.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   TESTIMONIALS
───────────────────────────────────────── */
const reviews = [
  { text: 'I uploaded a photo of my sad living room and within a minute I had a complete redesign plan. It looks like a magazine spread now.', name: 'Priya M.', loc: 'Mumbai', initials: 'P', av: { background: 'linear-gradient(135deg, #E8927C, #C4705A)' } },
  { text: "I've always been bad at decorating. SugGos just… got my style immediately. The 3D preview saved me from a couch I would have hated.", name: 'James T.', loc: 'London', initials: 'J', av: { background: 'linear-gradient(135deg, #7C8CE8, #5A6AC4)' } },
  { text: 'Moved into a new flat with no idea where to start. SugGos gave me an entire room plan with a budget I could actually work with.', name: 'Amara K.', loc: 'Lagos', initials: 'A', av: { background: 'linear-gradient(135deg, #7CE8A0, #5AC470)' } },
];

function Testimonials() {
  return (
    <section style={styles.testimonials} className="hp-testimonials">
      <div style={styles.eyebrow}>people love it</div>
      <h2 style={styles.sectionH}>Real rooms. Real <em style={{ fontStyle: 'italic' }}>results.</em></h2>
      <div className="hp-reviews-grid">
        {reviews.map(r => (
          <div key={r.name} style={styles.reviewCard}>
            <div style={styles.stars}>★★★★★</div>
            <p style={styles.reviewText}>"{r.text}"</p>
            <div style={styles.reviewer}>
              <div style={{ ...styles.reviewerAvatar, ...r.av }}>{r.initials}</div>
              <div>
                <div style={styles.reviewerName}>{r.name}</div>
                <div style={styles.reviewerLoc}>{r.loc}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   CTA BAND
───────────────────────────────────────── */
function CtaBand({ onUpload }) {
  const fileRef = useRef(null);
  return (
    <section style={styles.ctaBand} className="hp-cta">
      <h2 style={styles.ctaH2}>Your best room is one<br /><em style={{ fontStyle: 'italic' }}>photo away.</em></h2>
      <p style={styles.ctaP}>Free to try. No account needed. Just upload and see what's possible.</p>
      <input type="file" accept="image/*" ref={fileRef} hidden onChange={onUpload} />
      <button
        onClick={() => fileRef.current.click()}
        style={{ ...styles.ctaWhite, border: 'none', cursor: 'pointer' }}
      >
        Upload a room photo →
      </button>
    </section>
  );
}

/* ─────────────────────────────────────────
   FOOTER
───────────────────────────────────────── */
const footerLinks = ['How it works', 'Pricing', 'Privacy', 'Contact'];

function Footer() {
  return (
    <footer style={styles.footer} className="hp-footer">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', width: '100%' }} className="hp-footer-inner">
        <div style={styles.footerLogo}>Sug<span style={{ color: 'var(--rose)' }}>Gos</span></div>
        <ul style={{ margin: 0, padding: 0 }} className="hp-footer-links">
          {footerLinks.map(l => (
            <li key={l}><a href="#" style={styles.footerLink}>{l}</a></li>
          ))}
        </ul>
      </div>
      <div style={styles.footerCopy}>© 2025 SugGos. All rights reserved.</div>
    </footer>
  );
}

/* ─────────────────────────────────────────
   HOME PAGE — with analyzing state
───────────────────────────────────────── */
function HomePage() {
  useInjectStyle(HOMEPAGE_CSS);
  const navigate = useNavigate();
  const [analyzing, setAnalyzing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    // Reset input so same file can be re-selected
    if (e.target) e.target.value = '';
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      setPreviewUrl(dataUrl);
      setAnalyzing(true);
      // Show analyzing screen for 3.5s then go to results
      setTimeout(() => {
        navigate('/results', { state: { imageDataUrl: dataUrl } });
      }, 3500);
    };
    reader.readAsDataURL(file);
  }

  return (
    <>
      {analyzing && <AnalyzingScreen imageDataUrl={previewUrl} />}
      <Nav onUpload={handleUpload} />
      <Hero onUpload={handleUpload} />
      <ProofBar />
      <HowItWorks />
      <Features />
      <Testimonials />
      <CtaBand onUpload={handleUpload} />
      <Footer />
    </>
  );
}

/* ─────────────────────────────────────────
   APP ROOT
───────────────────────────────────────── */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/results" element={<ResultsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

/* ─────────────────────────────────────────
   STYLES
───────────────────────────────────────── */
const styles = {
  nav: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 3rem', height: 64,
    background: 'rgba(28,25,23,0.85)',
    backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
  },
  logo: {
    fontFamily: 'var(--serif)', fontSize: '1.4rem', fontWeight: 500,
    color: 'var(--ivory)', textDecoration: 'none', letterSpacing: '0.02em',
  },
  navLink: { fontSize: '0.88rem', color: 'var(--stone-light)', textDecoration: 'none', fontWeight: 400 },
  navBtn: {
    background: 'var(--rose)', color: '#fff',
    padding: '0.55rem 1.4rem', borderRadius: 100,
    fontWeight: 500, fontFamily: 'var(--sans)',
  },
  hero: {
    background: 'var(--dark)', minHeight: '100vh',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', textAlign: 'center',
    padding: '8rem 2rem 5rem', position: 'relative', overflow: 'hidden',
  },
  heroBg: {
    position: 'absolute', inset: 0, pointerEvents: 'none',
    background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(232,146,124,0.12) 0%, transparent 70%)',
  },
  heroTag: {
    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
    background: 'rgba(232,146,124,0.12)', border: '1px solid rgba(232,146,124,0.3)',
    color: 'var(--rose-light)', fontSize: '0.78rem', fontWeight: 500,
    letterSpacing: '0.06em', textTransform: 'uppercase',
    padding: '0.4rem 1rem', borderRadius: 100, marginBottom: '2rem',
  },
  heroH1: {
    fontFamily: 'var(--serif)', fontSize: 'clamp(3rem, 6vw, 5.2rem)',
    fontWeight: 400, color: 'var(--ivory)', lineHeight: 1.1,
    maxWidth: 820, margin: '0 auto 1.6rem',
  },
  heroSub: {
    fontSize: 'clamp(1rem, 1.5vw, 1.15rem)', color: 'var(--stone-light)',
    maxWidth: 520, margin: '0 auto 2.8rem', lineHeight: 1.75, fontWeight: 300,
  },
  heroActions: {
    display: 'flex', gap: '1rem', justifyContent: 'center',
    flexWrap: 'wrap', marginBottom: '5rem',
  },
  btnRose: {
    background: 'var(--rose)', color: '#fff', fontSize: '0.95rem',
    fontWeight: 500, padding: '0.85rem 2rem', borderRadius: 100,
    textDecoration: 'none', fontFamily: 'var(--sans)',
  },
  btnGhost: {
    background: 'transparent', color: 'var(--stone-light)', fontSize: '0.95rem',
    fontWeight: 400, padding: '0.85rem 2rem', borderRadius: 100,
    border: '1px solid rgba(168,162,158,0.3)', textDecoration: 'none',
  },
  dragHint: {
    position: 'absolute', top: '50%', left: '50%',
    transform: 'translate(-50%,-50%)',
    background: 'rgba(232,146,124,0.15)',
    border: '2px dashed var(--rose)', borderRadius: 16,
    color: 'var(--rose-light)', fontSize: '1.1rem', fontWeight: 500,
    padding: '1.5rem 3rem', pointerEvents: 'none',
    zIndex: 10,
  },
  roomCard: {
    flex: 1, borderRadius: 16, overflow: 'hidden',
    position: 'relative', aspectRatio: '4/3', background: 'var(--dark2)',
  },
  roomBefore: { background: 'linear-gradient(160deg, #2A2320 0%, #1E1A18 100%)' },
  roomAfter: {
    background: 'linear-gradient(160deg, #2C2420 0%, #3A2D26 100%)',
    border: '1px solid rgba(232,146,124,0.25)',
    boxShadow: '0 0 40px rgba(232,146,124,0.08)',
  },
  roomSvg: { width: '100%', height: '100%' },
  roomPill: {
    position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)',
    background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)',
    color: '#fff', fontSize: '0.72rem', fontWeight: 500,
    padding: '0.35rem 0.9rem', borderRadius: 100,
    whiteSpace: 'nowrap', letterSpacing: '0.04em',
  },
  suggestionFloat: {
    position: 'absolute', top: 14, right: 14,
    background: 'rgba(250,248,244,0.92)', backdropFilter: 'blur(10px)',
    borderRadius: 10, padding: '0.7rem 0.9rem',
    fontSize: '0.72rem', color: 'var(--dark)', lineHeight: 1.5,
    maxWidth: 150, boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
  },
  proofBar: {
    background: 'var(--ivory2)',
    borderTop: '1px solid #E8E0D8', borderBottom: '1px solid #E8E0D8',
    padding: '1.6rem 2rem',
  },
  proofItem: { textAlign: 'center', padding: '0 2rem' },
  proofNum: { fontFamily: 'var(--serif)', fontSize: '1.8rem', fontWeight: 500, color: 'var(--dark)', lineHeight: 1 },
  proofLabel: { fontSize: '0.78rem', color: 'var(--stone)', marginTop: '0.2rem', fontWeight: 400 },
  proofDivider: { width: 1, height: 40, background: '#D4CCC4' },
  how: { maxWidth: 1100, margin: '0 auto', padding: '8rem 2rem' },
  eyebrow: {
    fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.12em',
    textTransform: 'uppercase', color: 'var(--rose)', marginBottom: '1rem',
  },
  sectionH: {
    fontFamily: 'var(--serif)', fontSize: 'clamp(2rem, 3.5vw, 3rem)',
    fontWeight: 400, lineHeight: 1.2, color: 'var(--dark)', maxWidth: 560,
  },
  stepItem: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  stepIconWrap: {
    width: 52, height: 52, borderRadius: 14, background: 'var(--rose-pale)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem',
  },
  stepH: { fontFamily: 'var(--serif)', fontSize: '1.25rem', fontWeight: 400, color: 'var(--dark)', lineHeight: 1.3 },
  stepP: { fontSize: '0.9rem', color: 'var(--stone)', lineHeight: 1.7, fontWeight: 300 },
  what: { background: 'var(--dark)', padding: '8rem 2rem' },
  whatInner: { maxWidth: 1100, margin: '0 auto' },
  bentoCard: {
    background: 'var(--dark2)', borderRadius: 20, padding: '2.2rem 2rem',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  bentoIcon: { fontSize: '2rem', marginBottom: '1.4rem', display: 'block' },
  bentoH: { fontFamily: 'var(--serif)', fontSize: '1.35rem', fontWeight: 400, color: 'var(--ivory)', marginBottom: '0.7rem', lineHeight: 1.3 },
  bentoP: { fontSize: '0.88rem', color: '#78716C', lineHeight: 1.7, fontWeight: 300 },
  bentoVisual: {
    marginTop: '2rem', background: 'rgba(255,255,255,0.04)',
    borderRadius: 12, padding: '1.4rem',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  productRow: {
    display: 'flex', alignItems: 'center', gap: '1rem',
    padding: '0.8rem', background: 'rgba(255,255,255,0.04)',
    borderRadius: 10, marginBottom: '0.6rem', cursor: 'pointer',
  },
  productThumb: { width: 42, height: 42, borderRadius: 8, flexShrink: 0 },
  productName: { fontSize: '0.82rem', color: '#D4CCC4', fontWeight: 500, marginBottom: '0.1rem' },
  productMeta: { fontSize: '0.72rem', color: '#55524F' },
  productPrice: { fontSize: '0.88rem', color: 'var(--rose)', fontWeight: 600 },
  testimonials: { maxWidth: 1100, margin: '0 auto', padding: '8rem 2rem' },
  reviewCard: { background: 'var(--ivory2)', borderRadius: 16, padding: '1.8rem', border: '1px solid #E8E0D8' },
  stars: { color: 'var(--rose)', fontSize: '0.85rem', letterSpacing: '0.05em', marginBottom: '1rem' },
  reviewText: {
    fontFamily: 'var(--serif)', fontSize: '1rem', fontWeight: 400,
    color: 'var(--dark)', lineHeight: 1.65, fontStyle: 'italic', marginBottom: '1.4rem',
  },
  reviewer: { display: 'flex', alignItems: 'center', gap: '0.8rem' },
  reviewerAvatar: {
    width: 36, height: 36, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.9rem', fontWeight: 600, color: '#fff', flexShrink: 0,
  },
  reviewerName: { fontSize: '0.85rem', fontWeight: 600, color: 'var(--dark)' },
  reviewerLoc: { fontSize: '0.75rem', color: 'var(--stone-light)' },
  ctaBand: { background: 'var(--rose)', padding: '7rem 2rem', textAlign: 'center' },
  ctaH2: {
    fontFamily: 'var(--serif)', fontSize: 'clamp(2.2rem, 4vw, 3.4rem)',
    fontWeight: 400, color: '#fff', lineHeight: 1.2,
    marginBottom: '1.2rem', maxWidth: 640, marginLeft: 'auto', marginRight: 'auto',
  },
  ctaP: { fontSize: '1rem', color: 'rgba(255,255,255,0.75)', marginBottom: '2.5rem', fontWeight: 300 },
  ctaWhite: {
    display: 'inline-block', background: '#fff', color: 'var(--rose)',
    fontSize: '0.95rem', fontWeight: 600, padding: '0.9rem 2.4rem',
    borderRadius: 100, textDecoration: 'none', fontFamily: 'var(--sans)',
  },
  footer: {
    background: 'var(--dark)', padding: '3rem',
    display: 'flex', flexDirection: 'column', gap: '0',
  },
  footerLogo: { fontFamily: 'var(--serif)', fontSize: '1.2rem', color: 'var(--stone-light)' },
  footerLink: { fontSize: '0.82rem', color: '#55524F', textDecoration: 'none' },
  footerCopy: {
    fontSize: '0.75rem', color: '#44403C', width: '100%',
    textAlign: 'center', paddingTop: '1.5rem',
    borderTop: '1px solid #2A2724', marginTop: '1rem',
  },
};
