import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    gradient: 'linear-gradient(135deg, #5C4A3A 0%, #8B6B4A 100%)',
    tag: '✦ Top pick',
  },
  {
    id: 2,
    name: 'Arc floor lamp, brass',
    category: 'Lighting',
    reason: 'The empty corner behind your sofa needs light. An arc lamp fills it without using floor space.',
    price: '$189',
    retailer: 'CB2',
    match: 93,
    gradient: 'linear-gradient(135deg, #8A7A5A 0%, #C4A870 100%)',
    tag: null,
  },
  {
    id: 3,
    name: 'Moroccan area rug, plum',
    category: 'Rugs',
    reason: 'Your floors are bare — a rug will define the seating zone and add the contrast your palette is missing.',
    price: '$299',
    retailer: 'Rugs USA',
    match: 91,
    gradient: 'linear-gradient(135deg, #6A5060 0%, #A07080 100%)',
    tag: null,
  },
  {
    id: 4,
    name: 'Rattan side table',
    category: 'Tables',
    reason: 'Natural materials soften the space. This works as a bedside or sofa-side table.',
    price: '$129',
    retailer: 'Article',
    match: 88,
    gradient: 'linear-gradient(135deg, #7A6040 0%, #B89060 100%)',
    tag: null,
  },
  {
    id: 5,
    name: 'Linen throw pillow set',
    category: 'Decor',
    reason: 'Quick wins. Two pillows in terracotta pick up the warmth already in your room.',
    price: '$59',
    retailer: 'H&M Home',
    match: 85,
    gradient: 'linear-gradient(135deg, #A06050 0%, #C4907A 100%)',
    tag: null,
  },
  {
    id: 6,
    name: 'Minimalist wall shelf',
    category: 'Storage',
    reason: 'The wall above your sofa is empty — a slim shelf with a plant or books adds dimension.',
    price: '$89',
    retailer: 'IKEA',
    match: 82,
    gradient: 'linear-gradient(135deg, #505858 0%, #788080 100%)',
    tag: null,
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
   NAV (results variant)
───────────────────────────────────────── */
function ResultsNav() {
  const navigate = useNavigate();
  return (
    <nav style={s.nav}>
      <button onClick={() => navigate('/')} style={s.navLogo}>
        Sug<span style={{ color: 'var(--rose)' }}>Gos</span>
      </button>
      <div style={s.navCenter}>
        <span style={s.navCrumb}>My living room</span>
        <span style={s.navCrumbSep}>·</span>
        <span style={{ ...s.navCrumb, color: 'var(--rose)' }}>6 suggestions</span>
      </div>
      <button style={s.navShare}>Share results</button>
    </nav>
  );
}

/* ─────────────────────────────────────────
   ROOM PREVIEW (placeholder 3D)
───────────────────────────────────────── */
function RoomPreview({ activeId }) {
  return (
    <div style={s.previewWrap}>
      {/* SVG room illustration */}
      <svg style={s.previewSvg} viewBox="0 0 700 420" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Room shell */}
        <rect width="700" height="420" fill="#2A2220"/>
        <rect x="175" y="0" width="350" height="280" fill="#2E2520"/>
        {/* Floor */}
        <polygon points="0,280 700,280 700,420 0,420" fill="#2E2824"/>
        <line x1="0" y1="315" x2="700" y2="315" stroke="#3A3028" strokeWidth="1"/>
        <line x1="0" y1="350" x2="700" y2="350" stroke="#3A3028" strokeWidth="1"/>
        <line x1="0" y1="385" x2="700" y2="385" stroke="#3A3028" strokeWidth="1"/>
        <line x1="175" y1="280" x2="140" y2="420" stroke="#3A3028" strokeWidth="1"/>
        <line x1="350" y1="280" x2="350" y2="420" stroke="#3A3028" strokeWidth="1"/>
        <line x1="525" y1="280" x2="560" y2="420" stroke="#3A3028" strokeWidth="1"/>
        {/* Window */}
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
        {/* Sofa — highlighted if active */}
        <rect x="110" y="232" width="380" height="58" rx="8"
          fill={activeId === 1 ? '#9A7A5A' : '#7A5C44'}
          stroke={activeId === 1 ? '#E8927C' : '#9A7A5A'}
          strokeWidth={activeId === 1 ? 2 : 1}/>
        <rect x="110" y="210" width="380" height="30" rx="6"
          fill={activeId === 1 ? '#B09070' : '#8A6A50'}/>
        <rect x="110" y="232" width="46" height="58" rx="5"
          fill={activeId === 1 ? '#B09070' : '#8A6A50'}/>
        <rect x="444" y="232" width="46" height="58" rx="5"
          fill={activeId === 1 ? '#B09070' : '#8A6A50'}/>
        {/* Cushions */}
        <rect x="152" y="214" width="72" height="28" rx="10"
          fill={activeId === 1 ? '#D4A880' : '#C4906A'} opacity="0.9"/>
        <rect x="244" y="214" width="72" height="28" rx="10"
          fill={activeId === 1 ? '#F0C4A4' : '#E8927C'} opacity="0.8"/>
        <rect x="336" y="214" width="72" height="28" rx="10"
          fill={activeId === 1 ? '#D4A880' : '#C4906A'} opacity="0.9"/>
        {/* Rug */}
        <ellipse cx="300" cy="298" rx="210" ry="20"
          fill={activeId === 3 ? '#9A6080' : '#5A4060'}
          stroke={activeId === 3 ? '#E8927C' : '#7A6080'}
          strokeWidth={activeId === 3 ? 2 : 1}/>
        <ellipse cx="300" cy="298" rx="145" ry="13"
          fill={activeId === 3 ? '#C080A0' : '#7A5080'} opacity="0.5"/>
        {/* Lamp */}
        <ellipse cx="560" cy="200" rx="90" ry="75" fill="url(#lampGlowR)"/>
        <rect x="535" y="240" width="72" height="44" rx="5"
          fill={activeId === 2 ? '#7A6040' : '#5A4030'}
          stroke={activeId === 2 ? '#E8927C' : '#7A6040'}
          strokeWidth={activeId === 2 ? 2 : 1}/>
        <rect x="540" y="226" width="62" height="18" rx="5"
          fill={activeId === 2 ? '#A08050' : '#6A5040'}/>
        <polygon points="572,226 552,174 592,174"
          fill={activeId === 2 ? '#E8B060' : '#C48A40'}
          stroke={activeId === 2 ? '#FFD080' : '#E8B060'}
          strokeWidth="1"/>
        <rect x="568" y="174" width="9" height="54" fill={activeId === 2 ? '#A08050' : '#7A5830'}/>
        <circle cx="572" cy="174" r="7"
          fill={activeId === 2 ? '#FFEEAA' : '#FFE0A0'} opacity="0.95"/>
        {/* Side table */}
        <rect x="505" y="258" width="60" height="30" rx="4"
          fill={activeId === 4 ? '#B09060' : '#8A7050'}
          stroke={activeId === 4 ? '#E8927C' : 'transparent'}
          strokeWidth={activeId === 4 ? 2 : 0}/>
        {/* Plant */}
        <rect x="52" y="248" width="18" height="30" rx="3" fill="#4A3828"/>
        <ellipse cx="61" cy="248" rx="26" ry="32" fill="#3A5030"/>
        <ellipse cx="44" cy="232" rx="18" ry="24" fill="#4A6040"/>
        <ellipse cx="76" cy="228" rx="15" ry="20" fill="#3A5030"/>
        {/* Shelf hint */}
        <rect x="178" y="38" width="50" height="60" rx="4" fill="#3A3028" stroke="#5A4838" strokeWidth="1"/>
        <rect x="472" y="38" width="50" height="60" rx="4" fill="#3A3028" stroke="#5A4838" strokeWidth="1"/>
        {/* Active highlight glow */}
        {activeId && (
          <ellipse cx="300" cy="295" rx="300" ry="30" fill="rgba(232,146,124,0.04)"/>
        )}
      </svg>

      {/* 3D placeholder badge */}
      <div style={s.preview3dBadge}>
        <span style={{ fontSize: '1rem' }}>🧊</span>
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.78rem', marginBottom: '0.1rem' }}>3D preview</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--stone-light)' }}>Coming soon</div>
        </div>
      </div>

      {/* Active item label */}
      {activeId && (
        <div style={s.previewActiveLabel}>
          <span style={{ color: 'var(--rose)', marginRight: '0.4rem' }}>●</span>
          {suggestions.find(s => s.id === activeId)?.name}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   SUGGESTION CARD
───────────────────────────────────────── */
function SuggestionCard({ item, isActive, onHover, onLeave }) {
  return (
    <div
      style={{
        ...s.card,
        ...(isActive ? s.cardActive : {}),
      }}
      onMouseEnter={() => onHover(item.id)}
      onMouseLeave={onLeave}
    >
      {/* Thumb */}
      <div style={{ ...s.cardThumb, background: item.gradient }}>
        {item.tag && <div style={s.cardTag}>{item.tag}</div>}
        <div style={s.matchBadge}>{item.match}% match</div>
      </div>

      {/* Body */}
      <div style={s.cardBody}>
        <div style={s.cardMeta}>{item.category}</div>
        <h3 style={s.cardName}>{item.name}</h3>
        <p style={s.cardReason}>{item.reason}</p>
        <div style={s.cardFooter}>
          <div>
            <div style={s.cardPrice}>{item.price}</div>
            <div style={s.cardRetailer}>via {item.retailer}</div>
          </div>
          <button style={s.cardBtn}>View item →</button>
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
      <div style={s.paletteLabel}>Detected palette</div>
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
      <div style={s.insightsTitle}>Room analysis</div>
      {roomInsights.map(item => (
        <div key={item.label} style={s.insightRow}>
          <span style={s.insightIcon}>{item.icon}</span>
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
  const [activeId, setActiveId] = useState(null);
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();

  const categories = ['All', ...Array.from(new Set(suggestions.map(s => s.category)))];
  const filtered = filter === 'All' ? suggestions : suggestions.filter(s => s.category === filter);

  return (
    <div style={s.page}>
      <ResultsNav />

      <main style={s.main}>
        {/* Left: room preview + insights */}
        <aside style={s.sidebar}>
          <RoomPreview activeId={activeId} />
          <PaletteStrip />
          <RoomInsights />
          <button onClick={() => navigate('/')} style={s.reuploadBtn}>
            ↑ Upload a new room
          </button>
        </aside>

        {/* Right: suggestions */}
        <section style={s.suggestionsCol}>
          {/* Header */}
          <div style={s.suggestionsHeader}>
            <div>
              <div style={s.suggestionsEyebrow}>ai suggestions</div>
              <h1 style={s.suggestionsH1}>
                Here's what your room <em style={{ fontStyle: 'italic', color: 'var(--rose)' }}>needs.</em>
              </h1>
            </div>
            <div style={s.budgetPill}>Est. total: <strong>$1,414</strong></div>
          </div>

          {/* Filter tabs */}
          <div style={s.filterRow}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                style={{ ...s.filterTab, ...(filter === cat ? s.filterTabActive : {}) }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Cards grid */}
          <div style={s.cardsGrid}>
            {filtered.map(item => (
              <SuggestionCard
                key={item.id}
                item={item}
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
  page: {
    background: 'var(--ivory)',
    minHeight: '100vh',
    fontFamily: 'var(--sans)',
  },

  /* NAV */
  nav: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 2.5rem', height: 64,
    background: 'rgba(28,25,23,0.92)',
    backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
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
  navShare: {
    fontSize: '0.82rem', fontWeight: 500, color: 'var(--stone-light)',
    background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
    padding: '0.45rem 1.1rem', borderRadius: 100, cursor: 'pointer',
  },

  /* LAYOUT */
  main: {
    display: 'grid',
    gridTemplateColumns: '420px 1fr',
    minHeight: '100vh',
    paddingTop: 64,
  },

  /* SIDEBAR */
  sidebar: {
    background: 'var(--dark)',
    padding: '2.5rem 2rem',
    position: 'sticky',
    top: 64,
    height: 'calc(100vh - 64px)',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },

  /* PREVIEW */
  previewWrap: {
    borderRadius: 16, overflow: 'hidden',
    position: 'relative', background: '#1C1917',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  previewSvg: { width: '100%', display: 'block' },
  preview3dBadge: {
    position: 'absolute', bottom: 12, left: 12,
    background: 'rgba(28,25,23,0.88)', backdropFilter: 'blur(8px)',
    borderRadius: 10, padding: '0.55rem 0.9rem',
    display: 'flex', alignItems: 'center', gap: '0.6rem',
    color: 'var(--ivory)', fontSize: '0.78rem',
    border: '1px solid rgba(255,255,255,0.08)',
  },
  previewActiveLabel: {
    position: 'absolute', top: 12, left: 12,
    background: 'rgba(28,25,23,0.88)', backdropFilter: 'blur(8px)',
    borderRadius: 8, padding: '0.4rem 0.8rem',
    fontSize: '0.75rem', color: 'var(--ivory)',
    border: '1px solid rgba(232,146,124,0.3)',
  },

  /* PALETTE */
  paletteWrap: {
    background: 'var(--dark2)', borderRadius: 14, padding: '1.2rem',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  paletteLabel: {
    fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em',
    textTransform: 'uppercase', color: 'var(--stone)', marginBottom: '0.9rem',
  },
  paletteSwatches: { display: 'flex', gap: '0.6rem', flexWrap: 'wrap' },
  swatchWrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' },
  swatch: { width: 36, height: 36, borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)' },
  swatchName: { fontSize: '0.62rem', color: 'var(--stone)', textAlign: 'center', maxWidth: 44 },

  /* INSIGHTS */
  insightsWrap: {
    background: 'var(--dark2)', borderRadius: 14, padding: '1.2rem',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  insightsTitle: {
    fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em',
    textTransform: 'uppercase', color: 'var(--stone)', marginBottom: '1rem',
  },
  insightRow: {
    display: 'flex', alignItems: 'flex-start', gap: '0.8rem',
    marginBottom: '0.9rem',
  },
  insightIcon: { fontSize: '1rem', lineHeight: 1, marginTop: '0.1rem' },
  insightLabel: { fontSize: '0.72rem', color: 'var(--stone)', marginBottom: '0.15rem' },
  insightValue: { fontSize: '0.82rem', color: 'var(--ivory)', fontWeight: 500 },

  reuploadBtn: {
    width: '100%', padding: '0.75rem', borderRadius: 10,
    background: 'rgba(232,146,124,0.1)', border: '1px solid rgba(232,146,124,0.25)',
    color: 'var(--rose-light)', fontSize: '0.84rem', fontWeight: 500,
    cursor: 'pointer', marginTop: 'auto',
  },

  /* SUGGESTIONS COLUMN */
  suggestionsCol: {
    padding: '3rem 3rem 4rem',
    background: 'var(--ivory)',
    overflowY: 'auto',
  },
  suggestionsHeader: {
    display: 'flex', alignItems: 'flex-start',
    justifyContent: 'space-between', marginBottom: '2rem',
    flexWrap: 'wrap', gap: '1rem',
  },
  suggestionsEyebrow: {
    fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.12em',
    textTransform: 'uppercase', color: 'var(--rose)', marginBottom: '0.5rem',
  },
  suggestionsH1: {
    fontFamily: 'var(--serif)', fontSize: 'clamp(1.8rem, 2.5vw, 2.5rem)',
    fontWeight: 400, lineHeight: 1.2, color: 'var(--dark)',
  },
  budgetPill: {
    background: 'var(--ivory2)', border: '1px solid #E8E0D8',
    borderRadius: 100, padding: '0.55rem 1.2rem',
    fontSize: '0.82rem', color: 'var(--stone)', whiteSpace: 'nowrap',
    alignSelf: 'flex-start',
  },

  /* FILTERS */
  filterRow: {
    display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem',
  },
  filterTab: {
    padding: '0.45rem 1rem', borderRadius: 100,
    background: 'transparent', border: '1px solid #E8E0D8',
    fontSize: '0.8rem', color: 'var(--stone)', cursor: 'pointer',
    fontFamily: 'var(--sans)',
  },
  filterTabActive: {
    background: 'var(--dark)', border: '1px solid var(--dark)',
    color: '#fff',
  },

  /* CARDS */
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.2rem',
  },
  card: {
    background: '#fff', borderRadius: 16, overflow: 'hidden',
    border: '1px solid #E8E0D8',
    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
    cursor: 'default',
  },
  cardActive: {
    transform: 'translateY(-3px)',
    boxShadow: '0 8px 32px rgba(232,146,124,0.18)',
    border: '1px solid rgba(232,146,124,0.4)',
  },
  cardThumb: {
    height: 140, position: 'relative',
  },
  cardTag: {
    position: 'absolute', top: 10, left: 10,
    background: 'rgba(232,146,124,0.9)', color: '#fff',
    fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.04em',
    padding: '0.3rem 0.7rem', borderRadius: 100,
  },
  matchBadge: {
    position: 'absolute', top: 10, right: 10,
    background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)',
    color: '#fff', fontSize: '0.68rem', fontWeight: 600,
    padding: '0.3rem 0.7rem', borderRadius: 100,
  },
  cardBody: { padding: '1.2rem' },
  cardMeta: {
    fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.1em',
    textTransform: 'uppercase', color: 'var(--stone)', marginBottom: '0.35rem',
  },
  cardName: {
    fontFamily: 'var(--serif)', fontSize: '1.05rem', fontWeight: 400,
    color: 'var(--dark)', lineHeight: 1.3, marginBottom: '0.6rem',
  },
  cardReason: {
    fontSize: '0.8rem', color: 'var(--stone)', lineHeight: 1.65,
    fontWeight: 300, marginBottom: '1rem',
  },
  cardFooter: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  cardPrice: {
    fontFamily: 'var(--serif)', fontSize: '1.15rem',
    fontWeight: 500, color: 'var(--dark)',
  },
  cardRetailer: { fontSize: '0.7rem', color: 'var(--stone-light)', marginTop: '0.1rem' },
  cardBtn: {
    background: 'var(--rose)', color: '#fff',
    border: 'none', borderRadius: 100,
    padding: '0.5rem 1rem', fontSize: '0.78rem',
    fontWeight: 500, cursor: 'pointer',
    fontFamily: 'var(--sans)',
  },
};
