import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
    0%   { background-position: -400px 0; }
    100% { background-position:  400px 0; }
  }
  @keyframes pulseGlow {
    0%, 100% { box-shadow: 0 0 0 0 rgba(232,146,124,0); }
    50%       { box-shadow: 0 0 0 6px rgba(232,146,124,0.15); }
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
    background: linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 55%);
  }
  .sg-card-stagger-1 { animation-delay: 0.05s; }
  .sg-card-stagger-2 { animation-delay: 0.10s; }
  .sg-card-stagger-3 { animation-delay: 0.15s; }
  .sg-card-stagger-4 { animation-delay: 0.20s; }
  .sg-card-stagger-5 { animation-delay: 0.25s; }
  .sg-card-stagger-6 { animation-delay: 0.30s; }

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
   MOCK DATA
───────────────────────────────────────── */
const suggestions = [
  {
    id: 1,
    name: 'Velvet accent sofa, sand',
    category: 'Seating',
    reason: 'Your warm neutral walls call for texture. This sofa anchors the space without competing.',
    price: '$649',
    retailer: 'West Elm',
    match: 97,
    gradient: 'linear-gradient(145deg, #5C4A3A 0%, #8B6B4A 60%, #A07850 100%)',
    tag: '✦ Top pick',
    accentColor: '#8B6B4A',
  },
  {
    id: 2,
    name: 'Arc floor lamp, brass',
    category: 'Lighting',
    reason: 'The empty corner behind your sofa needs light. An arc lamp fills it without using floor space.',
    price: '$189',
    retailer: 'CB2',
    match: 93,
    gradient: 'linear-gradient(145deg, #7A6A40 0%, #C4A870 60%, #E0C080 100%)',
    tag: null,
    accentColor: '#C4A870',
  },
  {
    id: 3,
    name: 'Moroccan area rug, plum',
    category: 'Rugs',
    reason: 'Your floors are bare — a rug will define the seating zone and add the contrast your palette is missing.',
    price: '$299',
    retailer: 'Rugs USA',
    match: 91,
    gradient: 'linear-gradient(145deg, #5A4058 0%, #A07080 60%, #C090A0 100%)',
    tag: null,
    accentColor: '#A07080',
  },
  {
    id: 4,
    name: 'Rattan side table',
    category: 'Tables',
    reason: 'Natural materials soften the space. This works as a bedside or sofa-side table.',
    price: '$129',
    retailer: 'Article',
    match: 88,
    gradient: 'linear-gradient(145deg, #6A5030 0%, #B89060 60%, #D0A870 100%)',
    tag: null,
    accentColor: '#B89060',
  },
  {
    id: 5,
    name: 'Linen throw pillow set',
    category: 'Decor',
    reason: 'Quick wins. Two pillows in terracotta pick up the warmth already in your room.',
    price: '$59',
    retailer: 'H&M Home',
    match: 85,
    gradient: 'linear-gradient(145deg, #904840 0%, #C4907A 60%, #E0A888 100%)',
    tag: null,
    accentColor: '#C4907A',
  },
  {
    id: 6,
    name: 'Minimalist wall shelf',
    category: 'Storage',
    reason: 'The wall above your sofa is empty — a slim shelf with a plant or books adds dimension.',
    price: '$89',
    retailer: 'IKEA',
    match: 82,
    gradient: 'linear-gradient(145deg, #404848 0%, #708080 60%, #8A9898 100%)',
    tag: null,
    accentColor: '#708080',
  },
];

const palette = [
  { color: '#C4906A', label: 'Warm sand' },
  { color: '#8B6B4A', label: 'Cognac' },
  { color: '#A07080', label: 'Dusty plum' },
  { color: '#3A3028', label: 'Deep walnut' },
  { color: '#F2EDE6', label: 'Ivory' },
];

const roomInsights = [
  { icon: '☀️', label: 'Natural light', value: 'Medium — south-facing' },
  { icon: '📐', label: 'Estimated size', value: '~180 sq ft' },
  { icon: '🎨', label: 'Current style', value: 'Transitional / warm neutral' },
  { icon: '⚡', label: 'Biggest opportunity', value: 'Lighting & texture' },
];

/* ─────────────────────────────────────────
   NAV
───────────────────────────────────────── */
function ResultsNav() {
  const navigate = useNavigate();
  return (
    <nav style={s.nav} className="sg-nav">
      <button onClick={() => navigate('/')} style={s.navLogo}>
        Sug<span style={{ color: 'var(--rose)' }}>Gos</span>
      </button>
      <div style={s.navCenter} className="sg-nav-center">
        <span style={s.navCrumb}>My living room</span>
        <span style={s.navCrumbSep}>·</span>
        <span style={{ ...s.navCrumb, color: 'var(--rose)' }}>6 suggestions</span>
      </div>
      <button className="sg-share-btn">Share results</button>
    </nav>
  );
}

/* ─────────────────────────────────────────
   ROOM PREVIEW
───────────────────────────────────────── */
function RoomPreview({ activeId }) {
  return (
    <div style={s.previewWrap} className="sg-preview-wrap">
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
        {/* Sofa */}
        <rect x="110" y="232" width="380" height="58" rx="8"
          fill={activeId === 1 ? '#9A7A5A' : '#7A5C44'}
          stroke={activeId === 1 ? '#E8927C' : '#9A7A5A'}
          strokeWidth={activeId === 1 ? 2.5 : 1}
          style={{ transition: 'fill 0.25s, stroke 0.25s' }}/>
        <rect x="110" y="210" width="380" height="30" rx="6"
          fill={activeId === 1 ? '#B09070' : '#8A6A50'}
          style={{ transition: 'fill 0.25s' }}/>
        <rect x="110" y="232" width="46" height="58" rx="5" fill={activeId === 1 ? '#B09070' : '#8A6A50'} style={{ transition: 'fill 0.25s' }}/>
        <rect x="444" y="232" width="46" height="58" rx="5" fill={activeId === 1 ? '#B09070' : '#8A6A50'} style={{ transition: 'fill 0.25s' }}/>
        <rect x="152" y="214" width="72" height="28" rx="10" fill={activeId === 1 ? '#D4A880' : '#C4906A'} opacity="0.9" style={{ transition: 'fill 0.25s' }}/>
        <rect x="244" y="214" width="72" height="28" rx="10" fill={activeId === 1 ? '#F0C4A4' : '#E8927C'} opacity="0.8" style={{ transition: 'fill 0.25s' }}/>
        <rect x="336" y="214" width="72" height="28" rx="10" fill={activeId === 1 ? '#D4A880' : '#C4906A'} opacity="0.9" style={{ transition: 'fill 0.25s' }}/>
        {/* Rug */}
        <ellipse cx="300" cy="298" rx="210" ry="20"
          fill={activeId === 3 ? '#9A6080' : '#5A4060'}
          stroke={activeId === 3 ? '#E8927C' : '#7A6080'}
          strokeWidth={activeId === 3 ? 2.5 : 1}
          style={{ transition: 'fill 0.25s, stroke 0.25s' }}/>
        <ellipse cx="300" cy="298" rx="145" ry="13" fill={activeId === 3 ? '#C080A0' : '#7A5080'} opacity="0.5" style={{ transition: 'fill 0.25s' }}/>
        {/* Lamp */}
        <ellipse cx="560" cy="200" rx="90" ry="75" fill="url(#lampGlowR)"/>
        <rect x="535" y="240" width="72" height="44" rx="5"
          fill={activeId === 2 ? '#7A6040' : '#5A4030'}
          stroke={activeId === 2 ? '#E8927C' : '#7A6040'}
          strokeWidth={activeId === 2 ? 2.5 : 1}
          style={{ transition: 'fill 0.25s, stroke 0.25s' }}/>
        <rect x="540" y="226" width="62" height="18" rx="5" fill={activeId === 2 ? '#A08050' : '#6A5040'} style={{ transition: 'fill 0.25s' }}/>
        <polygon points="572,226 552,174 592,174" fill={activeId === 2 ? '#E8B060' : '#C48A40'} stroke={activeId === 2 ? '#FFD080' : '#E8B060'} strokeWidth="1" style={{ transition: 'fill 0.25s' }}/>
        <rect x="568" y="174" width="9" height="54" fill={activeId === 2 ? '#A08050' : '#7A5830'} style={{ transition: 'fill 0.25s' }}/>
        <circle cx="572" cy="174" r="7" fill={activeId === 2 ? '#FFEEAA' : '#FFE0A0'} opacity="0.95"/>
        {/* Side table */}
        <rect x="505" y="258" width="60" height="30" rx="4"
          fill={activeId === 4 ? '#B09060' : '#8A7050'}
          stroke={activeId === 4 ? '#E8927C' : 'transparent'}
          strokeWidth={activeId === 4 ? 2.5 : 0}
          style={{ transition: 'fill 0.25s, stroke 0.25s' }}/>
        {/* Plant */}
        <rect x="52" y="248" width="18" height="30" rx="3" fill="#4A3828"/>
        <ellipse cx="61" cy="248" rx="26" ry="32" fill="#3A5030"/>
        <ellipse cx="44" cy="232" rx="18" ry="24" fill="#4A6040"/>
        <ellipse cx="76" cy="228" rx="15" ry="20" fill="#3A5030"/>
        {/* Shelves */}
        <rect x="178" y="38" width="50" height="60" rx="4" fill="#3A3028" stroke="#5A4838" strokeWidth="1"/>
        <rect x="472" y="38" width="50" height="60" rx="4" fill="#3A3028" stroke="#5A4838" strokeWidth="1"/>
        {activeId && <ellipse cx="300" cy="295" rx="300" ry="30" fill="rgba(232,146,124,0.05)"/>}
      </svg>

      <div style={s.preview3dBadge}>
        <span style={{ fontSize: '1rem' }}>🧊</span>
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.78rem', marginBottom: '0.1rem' }}>3D preview</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--stone-light)' }}>Coming soon</div>
        </div>
      </div>

      {activeId && (
        <div style={{ ...s.previewActiveLabel, animation: 'fadeIn 0.2s ease' }}>
          <span style={{ color: 'var(--rose)', marginRight: '0.4rem' }}>●</span>
          {suggestions.find(x => x.id === activeId)?.name}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   SUGGESTION CARD — redesigned
───────────────────────────────────────── */
function SuggestionCard({ item, isActive, onHover, onLeave, index }) {
  return (
    <div
      className={`sg-card sg-card-stagger-${index + 1}${isActive ? ' active' : ''}`}
      onMouseEnter={() => onHover(item.id)}
      onMouseLeave={onLeave}
    >
      {/* Thumb — taller, with gradient overlay for text legibility */}
      <div style={{ ...s.cardThumb, background: item.gradient, position: 'relative' }}>
        <div className="sg-thumb-overlay" />

        {/* Match bar — bottom of thumb */}
        <div style={s.matchBar}>
          <div style={{ ...s.matchFill, width: `${item.match}%`, background: item.accentColor }} />
        </div>

        {/* Badges */}
        {item.tag && <div style={s.cardTag}>{item.tag}</div>}
        <div style={s.matchBadge}>{item.match}%</div>

        {/* Category inside thumb */}
        <div style={s.thumbCategory}>{item.category}</div>
      </div>

      {/* Body */}
      <div style={s.cardBody}>
        <h3 style={s.cardName}>{item.name}</h3>
        <p style={s.cardReason}>{item.reason}</p>

        {/* Divider */}
        <div style={s.cardDivider} />

        <div style={s.cardFooter}>
          <div>
            <div style={s.cardPrice}>{item.price}</div>
            <div style={s.cardRetailer}>via {item.retailer}</div>
          </div>
          <button className="sg-card-btn">Shop now →</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   COLOR PALETTE
───────────────────────────────────────── */
function PaletteStrip() {
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
function RoomInsights() {
  return (
    <div style={s.insightsWrap}>
      <div style={s.sectionLabel}>Room analysis</div>
      {roomInsights.map(item => (
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
  const [activeId, setActiveId] = useState(null);
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();

  const categories = ['All', ...Array.from(new Set(suggestions.map(s => s.category)))];
  const filtered = filter === 'All' ? suggestions : suggestions.filter(s => s.category === filter);

  return (
    <div style={s.page}>
      <ResultsNav />

      <main style={s.main} className="sg-main">
        {/* Sidebar */}
        <aside style={s.sidebar} className="sg-sidebar">
          <RoomPreview activeId={activeId} />
          <PaletteStrip />
          <RoomInsights />
          <button className="sg-reupload-btn" onClick={() => navigate('/')}>
            ↑ Upload a new room
          </button>
        </aside>

        {/* Suggestions column */}
        <section style={s.suggestionsCol} className="sg-suggestions-col">
          <div style={s.suggestionsHeader} className="sg-suggestions-header">
            <div style={{ animation: 'fadeUp 0.4s ease' }}>
              <div style={s.eyebrow}>ai suggestions</div>
              <h1 style={s.suggestionsH1} className="sg-suggestions-h1">
                Here's what your room <em style={{ fontStyle: 'italic', color: 'var(--rose)' }}>needs.</em>
              </h1>
            </div>
            <div style={s.budgetPill} className="sg-budget-pill">
              Est. total: <strong>$1,414</strong>
            </div>
          </div>

          {/* Filter tabs */}
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

          {/* Cards */}
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
    display: 'grid',
    gridTemplateColumns: '400px 1fr',
    minHeight: '100vh',
    paddingTop: 64,
  },

  sidebar: {
    background: 'var(--dark)',
    padding: '2rem 1.8rem',
    position: 'sticky',
    top: 64,
    height: 'calc(100vh - 64px)',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem',
  },

  previewWrap: {
    borderRadius: 14, overflow: 'hidden',
    position: 'relative', background: '#1C1917',
    border: '1px solid rgba(255,255,255,0.06)',
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
  insightRow: {
    display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.8rem',
  },
  insightIconWrap: {
    width: 30, height: 30, borderRadius: 8,
    background: 'rgba(255,255,255,0.05)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.85rem', flexShrink: 0,
  },
  insightLabel: { fontSize: '0.7rem', color: 'var(--stone)', marginBottom: '0.12rem' },
  insightValue: { fontSize: '0.8rem', color: 'var(--ivory)', fontWeight: 500 },

  suggestionsCol: {
    padding: '2.8rem 2.8rem 4rem',
    background: 'var(--ivory)',
    overflowY: 'auto',
  },
  suggestionsHeader: {
    display: 'flex', alignItems: 'flex-start',
    justifyContent: 'space-between', marginBottom: '1.8rem',
    flexWrap: 'wrap', gap: '1rem',
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
    background: '#fff', border: '1px solid #E8E0D8',
    borderRadius: 100, padding: '0.5rem 1.1rem',
    fontSize: '0.8rem', color: 'var(--stone)', whiteSpace: 'nowrap',
    alignSelf: 'flex-start',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },

  filterRow: { display: 'flex', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '1.8rem' },

  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '1.1rem',
  },

  /* CARD */
  cardThumb: {
    height: 160,
    position: 'relative',
  },
  cardTag: {
    position: 'absolute', top: 10, left: 10,
    background: 'rgba(232,146,124,0.92)', color: '#fff',
    fontSize: '0.67rem', fontWeight: 700, letterSpacing: '0.05em',
    padding: '0.28rem 0.65rem', borderRadius: 100,
    backdropFilter: 'blur(4px)',
  },
  matchBadge: {
    position: 'absolute', top: 10, right: 10,
    background: 'rgba(0,0,0,0.48)', backdropFilter: 'blur(6px)',
    color: '#fff', fontSize: '0.7rem', fontWeight: 700,
    padding: '0.28rem 0.65rem', borderRadius: 100,
  },
  thumbCategory: {
    position: 'absolute', bottom: 24, left: 12,
    fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.1em',
    textTransform: 'uppercase', color: 'rgba(255,255,255,0.75)',
  },
  matchBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: 3, background: 'rgba(0,0,0,0.2)',
  },
  matchFill: {
    height: '100%', borderRadius: 0,
    transition: 'width 0.6s ease',
    opacity: 0.85,
  },
  cardBody: { padding: '1.1rem 1.15rem 1.15rem' },
  cardName: {
    fontFamily: 'var(--serif)', fontSize: '1.02rem', fontWeight: 400,
    color: 'var(--dark)', lineHeight: 1.3, marginBottom: '0.5rem',
  },
  cardReason: {
    fontSize: '0.78rem', color: 'var(--stone)', lineHeight: 1.65,
    fontWeight: 300, marginBottom: '0.9rem',
  },
  cardDivider: {
    height: 1, background: '#F0EAE2', marginBottom: '0.9rem',
  },
  cardFooter: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  cardPrice: {
    fontFamily: 'var(--serif)', fontSize: '1.1rem', fontWeight: 500, color: 'var(--dark)',
  },
  cardRetailer: { fontSize: '0.68rem', color: 'var(--stone-light)', marginTop: '0.08rem' },
};
