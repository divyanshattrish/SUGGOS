import './App.css';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import ResultsPage from './ResultsPage';

/* ─────────────────────────────────────────
   NAV
───────────────────────────────────────── */
function Nav() {
  return (
    <nav style={styles.nav}>
      <a href="/" style={styles.logo}>
        Sug<span style={{ color: 'var(--rose)' }}>Gos</span>
      </a>
      <div style={styles.navRight}>
        <a href="#how" style={styles.navLink}>How it works</a>
        <a href="#features" style={styles.navLink}>Features</a>
        <a href="/results" style={{ ...styles.navLink, ...styles.navBtn }}>Try for free</a>
      </div>
    </nav>
  );
}

/* ─────────────────────────────────────────
   HERO — Before/After SVG rooms
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

function Hero() {
  const navigate = useNavigate();
  return (
    <section style={styles.hero}>
      <div style={styles.heroBg} aria-hidden="true" />
      <div style={styles.heroTag}>AI-powered interior design</div>
      <h1 style={styles.heroH1}>
        Your room has a<br /><em style={{ fontStyle: 'italic', color: 'var(--rose)' }}>better version</em> of itself.
      </h1>
      <p style={styles.heroSub}>
        Upload a photo. SugGos reads your space and shows you exactly how to make it beautiful — with real furniture you can actually buy.
      </p>
      <div style={styles.heroActions}>
        <button onClick={() => navigate('/results')} style={{ ...styles.btnRose, border: 'none', cursor: 'pointer' }}>Upload your room →</button>
        <a href="#how" style={styles.btnGhost}>See how it works</a>
      </div>

      {/* Room strip */}
      <div style={styles.roomStrip}>
        <div style={{ ...styles.roomCard, ...styles.roomBefore }}>
          <RoomBefore />
          <div style={styles.roomPill}>before</div>
        </div>
        <div style={{ ...styles.roomCard, ...styles.roomAfter }}>
          <RoomAfter />
          <div style={styles.suggestionFloat}>
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
   SOCIAL PROOF BAR
───────────────────────────────────────── */
const proofItems = [
  { num: '50k+', label: 'rooms redesigned' },
  { num: '4.9★', label: 'average rating' },
  { num: '30 sec', label: 'to first suggestion' },
  { num: 'Free', label: 'to get started' },
];

function ProofBar() {
  return (
    <div style={styles.proofBar}>
      {proofItems.map((item, i) => (
        <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '4rem' }}>
          {i > 0 && <div style={styles.proofDivider} />}
          <div style={styles.proofItem}>
            <div style={styles.proofNum}>{item.num}</div>
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
  { icon: '✨', title: 'AI reads your space', body: 'SugGos analyzes your room — the layout, the light, what furniture you already have, and your color palette — in about 30 seconds.' },
  { icon: '🛒', title: 'Shop the look', body: 'Get personalized furniture and decor suggestions matched to your space, with real products and prices. Preview them in 3D before you buy.' },
];

function HowItWorks() {
  return (
    <section style={styles.how} id="how">
      <div style={styles.eyebrow}>how it works</div>
      <h2 style={styles.sectionH}>Three steps to a room you <em style={{ fontStyle: 'italic' }}>love.</em></h2>
      <div style={styles.stepsRow}>
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
    <section style={styles.what} id="features">
      <div style={styles.whatInner}>
        <div style={{ ...styles.eyebrow, color: 'var(--rose-light)' }}>what you get</div>
        <h2 style={{ ...styles.sectionH, color: 'var(--ivory)', maxWidth: 500 }}>
          Design advice that <em style={{ fontStyle: 'italic' }}>knows</em> your room.
        </h2>
        <div style={styles.bento}>
          <div style={{ ...styles.bentoCard, gridRow: 'span 2' }}>
            <span style={styles.bentoIcon}>🛋️</span>
            <h3 style={styles.bentoH}>Real products, real prices</h3>
            <p style={styles.bentoP}>Every suggestion is a real item you can actually buy. SugGos matches furniture and decor to your room's style and ships you straight to the product page.</p>
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
            <p style={styles.bentoP}>Preview any piece of furniture in your actual room before spending a cent. Rotate it, move it around, see if it fits.</p>
          </div>
          <div style={styles.bentoCard}>
            <span style={styles.bentoIcon}>🎨</span>
            <h3 style={styles.bentoH}>Color & layout ideas</h3>
            <p style={styles.bentoP}>Get color palette suggestions and layout tweaks tailored to your room — not generic tips from a blog post.</p>
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
  { text: 'I uploaded a photo of my sad living room and within a minute I had a complete redesign plan. Bought two pieces SugGos suggested and my room looks like a magazine spread.', name: 'Priya M.', loc: 'Mumbai', initials: 'P', av: { background: 'linear-gradient(135deg, #E8927C, #C4705A)' } },
  { text: "I've always been bad at decorating. SugGos just… got my style immediately. The 3D preview saved me from a couch I would have hated.", name: 'James T.', loc: 'London', initials: 'J', av: { background: 'linear-gradient(135deg, #7C8CE8, #5A6AC4)' } },
  { text: 'Moved into a new flat and had no idea where to start. SugGos gave me an entire room plan with a budget I could actually work with. Game changer.', name: 'Amara K.', loc: 'Lagos', initials: 'A', av: { background: 'linear-gradient(135deg, #7CE8A0, #5AC470)' } },
];

function Testimonials() {
  return (
    <section style={styles.testimonials}>
      <div style={styles.eyebrow}>people love it</div>
      <h2 style={styles.sectionH}>Real rooms. Real <em style={{ fontStyle: 'italic' }}>results.</em></h2>
      <div style={styles.reviewsGrid}>
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
function CtaBand() {
  const navigate = useNavigate();
  return (
    <section style={styles.ctaBand}>
      <h2 style={styles.ctaH2}>Your best room is one<br /><em style={{ fontStyle: 'italic' }}>photo away.</em></h2>
      <p style={styles.ctaP}>Free to try. No account needed. Just upload and see what's possible.</p>
      <button onClick={() => navigate('/results')} style={{ ...styles.ctaWhite, border: 'none', cursor: 'pointer' }}>Upload a room photo →</button>
    </section>
  );
}

/* ─────────────────────────────────────────
   FOOTER
───────────────────────────────────────── */
const footerLinks = ['How it works', 'Pricing', 'Privacy', 'Contact'];

function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.footerLogo}>Sug<span style={{ color: 'var(--rose)' }}>Gos</span></div>
      <ul style={styles.footerLinks}>
        {footerLinks.map(l => (
          <li key={l}><a href="#" style={styles.footerLink}>{l}</a></li>
        ))}
      </ul>
      <div style={styles.footerCopy}>© 2025 SugGos. All rights reserved.</div>
    </footer>
  );
}

/* ─────────────────────────────────────────
   HOME PAGE
───────────────────────────────────────── */
function HomePage() {
  return (
    <>
      <Nav />
      <Hero />
      <ProofBar />
      <HowItWorks />
      <Features />
      <Testimonials />
      <CtaBand />
      <Footer />
    </>
  );
}

/* ─────────────────────────────────────────
   APP ROOT — with Router
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
  navRight: { display: 'flex', alignItems: 'center', gap: '2.5rem' },
  navLink: {
    fontSize: '0.88rem', color: 'var(--stone-light)',
    textDecoration: 'none', fontWeight: 400,
  },
  navBtn: {
    background: 'var(--rose)', color: '#fff',
    padding: '0.55rem 1.4rem', borderRadius: 100,
    fontWeight: 500,
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
    textDecoration: 'none',
  },
  btnGhost: {
    background: 'transparent', color: 'var(--stone-light)', fontSize: '0.95rem',
    fontWeight: 400, padding: '0.85rem 2rem', borderRadius: 100,
    border: '1px solid rgba(168,162,158,0.3)', textDecoration: 'none',
  },
  roomStrip: {
    display: 'flex', gap: 12, maxWidth: 900, width: '100%', margin: '0 auto',
  },
  roomCard: {
    flex: 1, borderRadius: 16, overflow: 'hidden',
    position: 'relative', aspectRatio: '4/3', background: 'var(--dark2)',
  },
  roomBefore: {
    background: 'linear-gradient(160deg, #2A2320 0%, #1E1A18 100%)',
  },
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
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: '0', flexWrap: 'wrap',
  },
  proofItem: { textAlign: 'center', padding: '0 2rem' },
  proofNum: {
    fontFamily: 'var(--serif)', fontSize: '1.8rem',
    fontWeight: 500, color: 'var(--dark)', lineHeight: 1,
  },
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
  stepsRow: {
    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '2.5rem', marginTop: '4rem',
  },
  stepItem: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  stepIconWrap: {
    width: 52, height: 52, borderRadius: 14, background: 'var(--rose-pale)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem',
  },
  stepH: {
    fontFamily: 'var(--serif)', fontSize: '1.25rem',
    fontWeight: 400, color: 'var(--dark)', lineHeight: 1.3,
  },
  stepP: { fontSize: '0.9rem', color: 'var(--stone)', lineHeight: 1.7, fontWeight: 300 },
  what: { background: 'var(--dark)', padding: '8rem 2rem' },
  whatInner: { maxWidth: 1100, margin: '0 auto' },
  bento: {
    display: 'grid', gridTemplateColumns: '1.4fr 1fr',
    gridTemplateRows: 'auto auto', gap: 16, marginTop: '4rem',
  },
  bentoCard: {
    background: 'var(--dark2)', borderRadius: 20, padding: '2.2rem 2rem',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  bentoIcon: { fontSize: '2rem', marginBottom: '1.4rem', display: 'block' },
  bentoH: {
    fontFamily: 'var(--serif)', fontSize: '1.35rem',
    fontWeight: 400, color: 'var(--ivory)', marginBottom: '0.7rem', lineHeight: 1.3,
  },
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
  reviewsGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1.5rem', marginTop: '4rem',
  },
  reviewCard: {
    background: 'var(--ivory2)', borderRadius: 16, padding: '1.8rem',
    border: '1px solid #E8E0D8',
  },
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
  ctaP: {
    fontSize: '1rem', color: 'rgba(255,255,255,0.75)',
    marginBottom: '2.5rem', fontWeight: 300,
  },
  ctaWhite: {
    display: 'inline-block', background: '#fff', color: 'var(--rose)',
    fontSize: '0.95rem', fontWeight: 600, padding: '0.9rem 2.4rem',
    borderRadius: 100, textDecoration: 'none',
  },
  footer: {
    background: 'var(--dark)', padding: '3rem',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    flexWrap: 'wrap', gap: '1rem',
  },
  footerLogo: {
    fontFamily: 'var(--serif)', fontSize: '1.2rem', color: 'var(--stone-light)',
  },
  footerLinks: {
    display: 'flex', gap: '2rem', listStyle: 'none',
  },
  footerLink: { fontSize: '0.82rem', color: '#55524F', textDecoration: 'none' },
  footerCopy: {
    fontSize: '0.75rem', color: '#44403C', width: '100%',
    textAlign: 'center', paddingTop: '1.5rem',
    borderTop: '1px solid #2A2724', marginTop: '1rem',
  },
};
