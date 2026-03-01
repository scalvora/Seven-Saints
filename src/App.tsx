import { useState, useEffect, useRef, useCallback, useMemo, type ReactNode, type CSSProperties } from 'react';

// ============================================================
// GLOBAL STYLES — injected into <head>, no external CSS needed
// ============================================================

const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Montserrat:ital,wght@0,200;0,300;0,400;0,500;1,300&display=swap');

*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  font-family: 'Montserrat', sans-serif;
  background-color: #1A1714;
  color: #F5F0E8;
  overflow-x: hidden;
}
img { display: block; max-width: 100%; }
button { cursor: pointer; }
a { text-decoration: none; }

@keyframes kenBurns1 {
  0% { transform: scale(1) translate(0,0); }
  100% { transform: scale(1.2) translate(-2%,-1%); }
}
@keyframes kenBurns2 {
  0% { transform: scale(1.1) translate(1%,0); }
  100% { transform: scale(1) translate(-1%,1%); }
}
@keyframes kenBurns3 {
  0% { transform: scale(1) translate(0,1%); }
  100% { transform: scale(1.15) translate(1%,-1%); }
}
@keyframes twinkle {
  0%, 100% { opacity: 0.05; }
  50% { opacity: 0.8; }
}
@keyframes sandDrift {
  0% { transform: translateX(-10px) translateY(0); opacity: 0; }
  10% { opacity: 0.12; }
  90% { opacity: 0.08; }
  100% { transform: translateX(100vw) translateY(-20px); opacity: 0; }
}
@keyframes scrollBounce {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(10px); }
}
@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
`;

// ============================================================
// IMAGES — verified working Unsplash URLs
// ============================================================

const IMG = {
  hero1: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1920&q=80&auto=format',
  hero2: 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=1920&q=80&auto=format',
  hero3: 'https://images.unsplash.com/photo-1504261521163-3e1c5fa0e654?w=1920&q=80&auto=format',
  tentInterior: 'https://images.unsplash.com/photo-1595521624992-48a59aef95e3?w=1200&q=80&auto=format',
  pool: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=80&auto=format',
  camels: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=1200&q=80&auto=format',
  candleDinner: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80&auto=format',
  panorama: 'https://images.unsplash.com/photo-1542401886-65d6c61db217?w=1920&q=80&auto=format',
  food1: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=800&q=80&auto=format',
  food2: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80&auto=format',
  food3: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80&auto=format',
  twilight: 'https://images.unsplash.com/photo-1455734729978-db1ae4f687fc?w=1920&q=80&auto=format',
  suite1: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=80&auto=format',
  suite2: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80&auto=format',
  suite3: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&q=80&auto=format',
  diningHero: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80&auto=format',
  location: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=1200&q=80&auto=format',
  guestDining: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&q=80&auto=format',
};

const HERO_SLIDES = [IMG.hero1, IMG.hero2, IMG.hero3];

const TESTIMONIALS = [
  { text: 'A place where time dissolves and the desert speaks. The Seven Saints is not a hotel — it is an awakening.', author: 'Condé Nast Traveller' },
  { text: 'The most extraordinary desert experience in North Africa. Every detail whispers ancient luxury.', author: 'Monocle Magazine' },
  { text: 'We arrived as guests and left transformed. The silence, the stars, the sacred hospitality — nothing compares.', author: 'Alexandra & James, London' },
];

const SUITES = [
  { name: 'The Atlas Pavilion', desc: 'A sanctuary of hand-woven textiles and desert light, with panoramic views of the Atlas Mountains from your private terrace.', price: 'From $850 / night', img: IMG.suite1 },
  { name: 'The Nomad Suite', desc: 'Inspired by the Berber caravans that once crossed these dunes, with an open-air bathing courtyard beneath the stars.', price: 'From $1,200 / night', img: IMG.suite2 },
  { name: 'The Saint\u2019s Retreat', desc: 'Our most private residence with a plunge pool and 360-degree desert views from the highest dune.', price: 'From $2,400 / night', img: IMG.suite3 },
];

const NAV_ITEMS = ['Experience', 'Suites', 'Dining', 'Story', 'Book'];

// ============================================================
// STYLE HELPERS
// ============================================================

const font = {
  heading: "'Cormorant Garamond', serif",
  body: "'Montserrat', sans-serif",
};

const color = {
  bg: '#1A1714',
  bgLight: '#2C2825',
  cream: '#F5F0E8',
  gold: '#C9A96E',
  goldMuted: '#B8A080',
  terra: '#C4785B',
  brown: '#5A4E42',
};

// ============================================================
// HOOKS
// ============================================================

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const h = () => setY(window.scrollY);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);
  return y;
}

// ============================================================
// CORE COMPONENTS
// ============================================================

/** Simple image with inline placeholder on error */
function Img({ src, alt, style, className }: {
  src: string; alt: string; style?: CSSProperties; className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (failed) {
    return (
      <div style={{
        width: '100%', height: '100%', minHeight: 200,
        background: `linear-gradient(135deg, ${color.bg}, ${color.bgLight}, ${color.bg})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        ...style,
      }} className={className}>
        <span style={{ color: color.gold, opacity: 0.3, fontSize: 32 }}>✦</span>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {!loaded && (
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(135deg, ${color.bg}, ${color.bgLight})`,
          animation: 'shimmer 2s infinite',
        }} />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        referrerPolicy="no-referrer"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        style={{
          width: '100%', height: '100%', objectFit: 'cover',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.6s ease',
          ...style,
        }}
        className={className}
      />
    </div>
  );
}

/** Fade-up on scroll */
function FadeIn({ children, delay = 0, style, threshold = 0.15 }: {
  children: ReactNode; delay?: number; style?: CSSProperties; threshold?: number;
}) {
  const { ref, visible } = useInView(threshold);
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(35px)',
      transition: `opacity 0.9s ease ${delay}ms, transform 0.9s cubic-bezier(.25,.46,.45,.94) ${delay}ms`,
      ...style,
    }}>
      {children}
    </div>
  );
}

/** Reveal image with clip-path */
function RevealImg({ src, alt, aspect = '4/3', direction = 'left', delay = 0 }: {
  src: string; alt: string; aspect?: string; direction?: 'left' | 'right' | 'up'; delay?: number;
}) {
  const { ref, visible } = useInView(0.08);
  const from = direction === 'right' ? 'inset(0 100% 0 0)' : direction === 'up' ? 'inset(100% 0 0 0)' : 'inset(0 0 0 100%)';

  return (
    <div ref={ref} style={{
      overflow: 'hidden',
      clipPath: visible ? 'inset(0 0 0 0)' : from,
      transition: `clip-path 1.3s cubic-bezier(.25,.46,.45,.94) ${delay}ms`,
    }}>
      <div style={{ aspectRatio: aspect, overflow: 'hidden' }}>
        <div style={{
          width: '100%', height: '100%',
          transform: visible ? 'scale(1)' : 'scale(1.15)',
          transition: 'transform 2s cubic-bezier(.25,.46,.45,.94)',
        }}>
          <Img src={src} alt={alt} />
        </div>
      </div>
    </div>
  );
}

/** Gold line that expands */
function GoldLine({ visible, w = 60, delay = 0 }: { visible: boolean; w?: number; delay?: number }) {
  return <div style={{
    height: 1, margin: '0 auto',
    width: visible ? w : 0,
    background: `linear-gradient(90deg, transparent, ${color.gold}, transparent)`,
    transition: `width 1s ease ${delay}ms`,
  }} />;
}

/** Moroccan diamond divider */
function Divider() {
  const { ref, visible } = useInView(0.5);
  return (
    <div ref={ref} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '16px 0' }}>
      <div style={{ height: 1, background: `linear-gradient(270deg, ${color.gold}80, transparent)`, width: visible ? 50 : 0, transition: 'width 1s ease 0.2s' }} />
      <div style={{
        width: 8, height: 8, border: `1px solid ${color.gold}`,
        transform: visible ? 'rotate(45deg) scale(1)' : 'rotate(45deg) scale(0)',
        opacity: visible ? 0.6 : 0, transition: 'all 1s ease 0.4s',
      }} />
      <div style={{ height: 1, background: `linear-gradient(90deg, ${color.gold}80, transparent)`, width: visible ? 50 : 0, transition: 'width 1s ease 0.2s' }} />
    </div>
  );
}

/** Letter-by-letter animation */
function AnimLetters({ text, show, delay = 0, style }: {
  text: string; show: boolean; delay?: number; style?: CSSProperties;
}) {
  return (
    <span style={style} aria-label={text}>
      {text.split('').map((c, i) => (
        <span key={i} style={{
          display: 'inline-block',
          opacity: show ? 1 : 0,
          transform: show ? 'translateY(0)' : 'translateY(25px)',
          transition: `opacity 0.6s ease ${delay + i * 50}ms, transform 0.6s ease ${delay + i * 50}ms`,
        }}>
          {c === ' ' ? '\u00A0' : c}
        </span>
      ))}
    </span>
  );
}

/** Stars background */
function Stars({ count = 30 }: { count?: number }) {
  const stars = useMemo(() => Array.from({ length: count }, (_, i) => ({
    id: i, size: Math.random() * 2.5 + 0.5,
    top: Math.random() * 85 + 5, left: Math.random() * 95 + 2,
    dur: Math.random() * 4 + 2, del: Math.random() * 8,
  })), [count]);
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {stars.map(s => (
        <div key={s.id} style={{
          position: 'absolute', width: s.size, height: s.size, borderRadius: '50%',
          top: `${s.top}%`, left: `${s.left}%`,
          backgroundColor: `${color.gold}`,
          animation: `twinkle ${s.dur}s ease-in-out ${s.del}s infinite`,
        }} />
      ))}
    </div>
  );
}

/** Sand particles */
function Sand() {
  const p = useMemo(() => Array.from({ length: 18 }, (_, i) => ({
    id: i, size: Math.random() * 3 + 1, top: Math.random() * 80 + 5,
    dur: Math.random() * 14 + 14, del: Math.random() * 20,
  })), []);
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 2 }}>
      {p.map(x => (
        <div key={x.id} style={{
          position: 'absolute', width: x.size, height: x.size, borderRadius: '50%',
          top: `${x.top}%`, left: '-10px',
          backgroundColor: `${color.gold}60`,
          animation: `sandDrift ${x.dur}s linear ${x.del}s infinite`,
        }} />
      ))}
    </div>
  );
}

// ============================================================
// LOADING SCREEN
// ============================================================

function Loading({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 2200),
      setTimeout(() => setPhase(4), 3200),
      setTimeout(() => { setPhase(5); onDone(); }, 4200),
    ];
    return () => t.forEach(clearTimeout);
  }, [onDone]);

  if (phase === 5) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: color.bg,
      transform: phase >= 4 ? 'translateY(-100%)' : 'translateY(0)',
      transition: 'transform 1.2s cubic-bezier(.77,0,.175,1)',
    }}>
      {/* Background gradient */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 50% 70%, rgba(196,120,91,0.08), transparent 60%)',
        opacity: phase >= 2 ? 1 : 0, transition: 'opacity 2s ease',
      }} />

      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
        <p style={{
          fontFamily: font.body, fontSize: 10, letterSpacing: 6, textTransform: 'uppercase',
          color: `${color.goldMuted}70`, marginBottom: 32,
          opacity: phase >= 2 ? 1 : 0, transform: phase >= 2 ? 'translateY(0)' : 'translateY(10px)',
          transition: 'all 1s ease',
        }}>
          Agafay Desert · Marrakech
        </p>

        {/* Star symbol instead of logo */}
        <div style={{
          opacity: phase >= 1 ? 1 : 0,
          transform: phase >= 1 ? 'scale(1)' : 'scale(0.8)',
          transition: 'all 1.4s ease',
        }}>
          <div style={{ fontSize: 48, color: color.gold, marginBottom: 16, lineHeight: 1, opacity: 0.6 }}>✦</div>
          <h1 style={{
            fontFamily: font.heading, fontSize: 'clamp(18px, 3vw, 28px)',
            letterSpacing: 12, textTransform: 'uppercase', color: color.gold,
            textShadow: `0 0 40px ${color.gold}30`,
          }}>
            THE SEVEN SAINTS
          </h1>
        </div>

        <div style={{
          height: 1, margin: '24px auto 0',
          width: phase >= 2 ? 120 : 0,
          background: `linear-gradient(90deg, transparent, ${color.terra}80, ${color.gold}, ${color.terra}80, transparent)`,
          transition: 'width 1.4s ease',
        }} />

        <p style={{
          fontFamily: font.body, fontSize: 10, letterSpacing: 5, textTransform: 'uppercase',
          color: `${color.cream}30`, marginTop: 28,
          opacity: phase >= 3 ? 1 : 0, transition: 'opacity 1s ease 300ms',
        }}>
          Where earth meets sky
        </p>
      </div>
    </div>
  );
}

// ============================================================
// NAVIGATION
// ============================================================

function Nav({ loaded }: { loaded: boolean }) {
  const scrollY = useScrollY();
  const scrolled = scrollY > 80;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lastY, setLastY] = useState(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    setHidden(scrollY > 400 && scrollY > lastY);
    setLastY(scrollY);
  }, [scrollY]);

  const go = useCallback((id: string) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const navBtnStyle: CSSProperties = {
    background: 'none', border: 'none', fontFamily: font.body,
    fontSize: 11, letterSpacing: 3, textTransform: 'uppercase',
    color: `${color.cream}CC`, transition: 'color 0.3s',
  };

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: scrolled ? `${color.bg}EB` : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? `1px solid ${color.gold}14` : '1px solid transparent',
        transform: hidden ? 'translateY(-100%)' : 'translateY(0)',
        opacity: loaded ? 1 : 0,
        transition: 'all 0.6s ease',
      }}>
        <div style={{
          maxWidth: 1440, margin: '0 auto', padding: '0 clamp(20px,3vw,56px)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: 'clamp(60px,8vw,88px)',
        }}>
          {/* Brand */}
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{ ...navBtnStyle, display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, letterSpacing: 6, color: color.gold }}>
            <span style={{ fontSize: 20, opacity: 0.7 }}>✦</span>
            <span className="brand-text">THE SEVEN SAINTS</span>
          </button>

          {/* Desktop links */}
          <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 'clamp(24px,3vw,40px)' }}>
            {NAV_ITEMS.map(item => (
              <button key={item} onClick={() => go(item.toLowerCase())} style={navBtnStyle}
                onMouseEnter={e => (e.currentTarget.style.color = color.gold)}
                onMouseLeave={e => (e.currentTarget.style.color = `${color.cream}CC`)}>
                {item}
              </button>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button className="mobile-burger" onClick={() => setMobileOpen(true)}
            style={{ ...navBtnStyle, padding: 8, display: 'none' }} aria-label="Menu">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <line x1="3" y1="7" x2="21" y2="7" /><line x1="7" y1="12" x2="21" y2="12" /><line x1="3" y1="17" x2="21" y2="17" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 60,
          background: `${color.bg}FA`, backdropFilter: 'blur(20px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'fadeInUp 0.4s ease',
        }}>
          <Stars count={12} />
          <button onClick={() => setMobileOpen(false)}
            style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: `${color.cream}99`, padding: 12 }}
            aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <line x1="4" y1="4" x2="20" y2="20" /><line x1="20" y1="4" x2="4" y2="20" />
            </svg>
          </button>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 36 }}>
            {NAV_ITEMS.map(item => (
              <button key={item} onClick={() => go(item.toLowerCase())}
                style={{ background: 'none', border: 'none', fontFamily: font.heading, fontSize: 24, letterSpacing: 8, textTransform: 'uppercase', color: `${color.cream}B3` }}>
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Responsive CSS for nav */}
      <style>{`
        @media (max-width: 767px) {
          .desktop-nav { display: none !important; }
          .mobile-burger { display: block !important; }
          .brand-text { display: none; }
        }
      `}</style>
    </>
  );
}

// ============================================================
// SCROLL PROGRESS + BACK TO TOP
// ============================================================

function ScrollProgress() {
  const y = useScrollY();
  const total = typeof document !== 'undefined' ? document.documentElement.scrollHeight - window.innerHeight : 1;
  const pct = total > 0 ? (y / total) * 100 : 0;
  return <div style={{
    position: 'fixed', top: 0, left: 0, height: 2, zIndex: 90,
    width: `${pct}%`,
    background: `linear-gradient(90deg, ${color.terra}, ${color.gold}, #E0C88A, ${color.gold})`,
    boxShadow: `0 0 12px ${color.gold}80`,
  }} />;
}

function BackToTop() {
  const y = useScrollY();
  const show = y > 800;
  return (
    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top"
      style={{
        position: 'fixed', bottom: 32, right: 32, zIndex: 50,
        width: 44, height: 44, borderRadius: '50%',
        border: `1px solid ${color.gold}4D`, background: `${color.bg}CC`,
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: show ? 1 : 0, transform: show ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.5s ease', pointerEvents: show ? 'auto' : 'none',
      }}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={color.gold} strokeWidth="1.5" strokeLinecap="round">
        <path d="M7 12V2M2 6l5-4 5 4" />
      </svg>
    </button>
  );
}

// ============================================================
// HERO
// ============================================================

function Hero({ loaded }: { loaded: boolean }) {
  const y = useScrollY();
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % HERO_SLIDES.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <section style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      {/* Slideshow */}
      <div style={{ position: 'absolute', inset: 0, transform: `translateY(${y * 0.3}px)` }}>
        <div style={{ width: '100%', height: '130%', position: 'relative' }}>
          {/* Base gradient always visible */}
          <div style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(180deg, ${color.bg} 0%, #2A1808 30%, #4A3520 55%, ${color.bg} 100%)`,
          }} />

          {/* Images */}
          {HERO_SLIDES.map((src, i) => (
            <div key={i} style={{
              position: 'absolute', inset: 0,
              opacity: i === slide ? 1 : 0,
              transition: 'opacity 2s ease-in-out',
            }}>
              <Img src={src} alt="" style={{
                width: '100%', height: '100%',
                filter: 'saturate(0.65) brightness(0.5) sepia(0.3) contrast(1.1)',
                animation: i === slide ? `kenBurns${(i % 3) + 1} 12s ease-in-out alternate infinite` : 'none',
              }} />
            </div>
          ))}
        </div>
      </div>

      <Sand />

      {/* Overlays */}
      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, ${color.bg}, ${color.bg}33, transparent)` }} />
      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, ${color.bg}66, transparent, transparent)` }} />

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 10, height: '100%',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '0 20px',
      }}>
        {/* Star icon */}
        <div style={{
          fontSize: 40, color: color.gold, marginBottom: 20, opacity: loaded ? 0.5 : 0,
          transform: loaded ? 'scale(1)' : 'scale(0.5)',
          transition: 'all 1.2s ease 200ms',
          filter: `drop-shadow(0 0 30px ${color.gold}40)`,
        }}>✦</div>

        <h1>
          <AnimLetters text="THE SEVEN SAINTS" show={loaded} delay={400} style={{
            fontFamily: font.heading, color: color.cream,
            fontSize: 'clamp(32px, 7vw, 78px)',
            letterSpacing: 'clamp(6px, 1.5vw, 14px)',
            textTransform: 'uppercase', lineHeight: 1.1,
            textShadow: `0 0 60px ${color.gold}25`,
          }} />
        </h1>

        {/* Gold line */}
        <div style={{
          height: 1, margin: '28px auto 0',
          width: loaded ? 100 : 0,
          background: `linear-gradient(90deg, transparent, ${color.terra}80, ${color.gold}, #E0C88A, ${color.gold}, ${color.terra}80, transparent)`,
          transition: 'width 1.2s ease 1800ms',
          boxShadow: `0 0 20px ${color.gold}25`,
        }} />

        <p style={{
          fontFamily: font.body, fontWeight: 300, color: `${color.cream}BF`,
          fontSize: 'clamp(10px, 1.5vw, 13px)', letterSpacing: 'clamp(4px, 0.8vw, 6px)',
          textTransform: 'uppercase', marginTop: 24,
          opacity: loaded ? 1 : 0, transform: loaded ? 'translateY(0)' : 'translateY(15px)',
          transition: 'all 1s ease 2200ms',
          textShadow: '0 2px 20px rgba(0,0,0,0.5)',
        }}>
          At the summit of the Agafay dunes, Marrakech
        </p>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute', bottom: 40, left: '50%',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        opacity: loaded ? 1 : 0, transition: 'opacity 1s ease 3s',
        animation: 'scrollBounce 2s ease-in-out infinite',
      }}>
        <p style={{ fontFamily: font.body, fontSize: 8, letterSpacing: 4, textTransform: 'uppercase', color: `${color.cream}40`, marginBottom: 12 }}>Scroll</p>
        <div style={{ width: 1, height: 40, background: `linear-gradient(to bottom, transparent, ${color.gold}66, ${color.gold}99)` }} />
      </div>
    </section>
  );
}

// ============================================================
// INTRO
// ============================================================

function Intro() {
  const { ref, visible } = useInView(0.3);
  return (
    <section style={{ backgroundColor: color.cream, padding: 'clamp(80px, 12vw, 192px) 0' }}>
      <div ref={ref} style={{ maxWidth: 660, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
        <FadeIn>
          <p style={{ fontFamily: font.body, fontSize: 11, letterSpacing: 5, textTransform: 'uppercase', color: color.goldMuted, marginBottom: 28 }}>
            AGAFAY, MARRAKECH
          </p>
        </FadeIn>
        <FadeIn delay={200}>
          <h2 style={{ fontFamily: font.heading, color: color.bgLight, fontSize: 'clamp(26px, 4vw, 40px)', lineHeight: 1.4, marginBottom: 32 }}>
            Where Earth Meets Sky and Silence Becomes Ceremony
          </h2>
        </FadeIn>
        <FadeIn delay={400}>
          <p style={{ fontFamily: font.body, fontWeight: 300, color: color.brown, fontSize: 15, lineHeight: 2, marginBottom: 40 }}>
            Perched upon the ancient stone dunes of the Agafay desert, The Seven Saints is a sanctuary of silence,
            starlight, and Moroccan heritage. Here, the Atlas Mountains frame every horizon, and the rhythm of the desert
            replaces the pace of the world you left behind.
          </p>
        </FadeIn>
        <FadeIn delay={600}><GoldLine visible={visible} delay={600} /></FadeIn>
      </div>
    </section>
  );
}

// ============================================================
// EXPERIENCE
// ============================================================

function Experience() {
  const { ref, visible } = useInView(0.3);
  return (
    <section id="experience" style={{ position: 'relative', backgroundColor: color.bg, padding: 'clamp(80px, 10vw, 160px) 0', overflow: 'hidden' }}>
      <Stars count={22} />
      <div style={{ position: 'relative', zIndex: 10, maxWidth: 1400, margin: '0 auto', padding: '0 clamp(20px, 3vw, 48px)' }}>
        <div ref={ref} style={{ textAlign: 'center', marginBottom: 'clamp(56px, 8vw, 96px)' }}>
          <FadeIn>
            <p style={{ fontFamily: font.body, fontSize: 9, letterSpacing: 5, textTransform: 'uppercase', color: `${color.goldMuted}80`, marginBottom: 16 }}>CHAPTER ONE</p>
          </FadeIn>
          <h2 style={{ fontFamily: font.heading, color: color.gold, fontSize: 13, letterSpacing: 6, textTransform: 'uppercase', marginBottom: 20, textShadow: `0 0 30px ${color.gold}30` }}>
            <AnimLetters text="THE EXPERIENCE" show={visible} />
          </h2>
          <GoldLine visible={visible} delay={800} w={80} />
        </div>

        {/* Grid */}
        <div className="exp-grid">
          <div className="exp-main">
            <RevealImg src={IMG.tentInterior} alt="Luxury tent interior" aspect="16/10" />
            <p style={{ fontFamily: font.body, fontStyle: 'italic', fontWeight: 300, color: `${color.cream}59`, fontSize: 12, letterSpacing: 2, marginTop: 12 }}>
              Handcrafted luxury, draped in desert warmth
            </p>
          </div>
          <div className="exp-side">
            <RevealImg src={IMG.pool} alt="Infinity pool" aspect="3/4" direction="right" delay={200} />
          </div>

          <div style={{ gridColumn: '1 / -1', padding: 'clamp(24px, 3vw, 40px) 0', textAlign: 'center' }}>
            <FadeIn>
              <p style={{ fontFamily: font.heading, fontStyle: 'italic', color: `${color.cream}4D`, fontSize: 'clamp(16px, 2vw, 20px)', letterSpacing: 3 }}>
                where the dunes glow gold before nightfall
              </p>
            </FadeIn>
          </div>

          <div className="exp-side2">
            <RevealImg src={IMG.camels} alt="Camels at golden hour" aspect="3/4" delay={100} />
          </div>
          <div className="exp-main2">
            <RevealImg src={IMG.candleDinner} alt="Candlelit dinner" aspect="16/10" direction="right" delay={250} />
            <p style={{ fontFamily: font.body, fontStyle: 'italic', fontWeight: 300, color: `${color.cream}59`, fontSize: 12, letterSpacing: 2, marginTop: 12, textAlign: 'right' }}>
              Evenings woven with candlelight and conversation
            </p>
          </div>

          <div style={{ gridColumn: '1 / -1', padding: 'clamp(24px, 3vw, 40px) 0', textAlign: 'center' }}>
            <FadeIn>
              <p style={{ fontFamily: font.heading, fontStyle: 'italic', color: `${color.cream}4D`, fontSize: 'clamp(16px, 2vw, 20px)', letterSpacing: 3 }}>
                silence, starlight, and the ancient desert
              </p>
            </FadeIn>
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <RevealImg src={IMG.panorama} alt="Desert panorama" aspect="21/8" direction="up" delay={150} />
          </div>
        </div>

        <style>{`
          .exp-grid { display: grid; grid-template-columns: 1fr; gap: clamp(12px, 2vw, 24px); }
          @media (min-width: 768px) {
            .exp-grid { grid-template-columns: 7fr 5fr; }
            .exp-main { grid-column: 1; }
            .exp-side { grid-column: 2; display: flex; flex-direction: column; justify-content: flex-end; }
            .exp-side2 { grid-column: 1; }
            .exp-main2 { grid-column: 2; }
          }
        `}</style>
      </div>
    </section>
  );
}

// ============================================================
// SUITES
// ============================================================

function SuitesSection() {
  return (
    <section id="suites" style={{ backgroundColor: color.cream, padding: 'clamp(80px, 10vw, 160px) 0' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 clamp(20px, 3vw, 48px)' }}>
        <FadeIn><div style={{ textAlign: 'center', marginBottom: 24 }}>
          <p style={{ fontFamily: font.body, fontSize: 9, letterSpacing: 5, textTransform: 'uppercase', color: `${color.goldMuted}80`, marginBottom: 16 }}>CHAPTER TWO</p>
          <h2 style={{ fontFamily: font.heading, color: color.bgLight, fontSize: 'clamp(26px, 4vw, 40px)', letterSpacing: 4, textTransform: 'uppercase' }}>Suites & Tents</h2>
        </div></FadeIn>
        <FadeIn delay={200}>
          <p style={{ fontFamily: font.body, fontWeight: 300, color: `${color.brown}B3`, fontSize: 14, textAlign: 'center', maxWidth: 500, margin: '0 auto clamp(64px, 8vw, 96px)', lineHeight: 1.8 }}>
            Each residence is a private sanctuary, designed to dissolve the boundary between shelter and sky.
          </p>
        </FadeIn>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(80px, 10vw, 144px)' }}>
          {SUITES.map((s, i) => (
            <div key={s.name} className={`suite-row suite-${i % 2 === 0 ? 'even' : 'odd'}`}>
              <div className="suite-img">
                <RevealImg src={s.img} alt={s.name} direction={i % 2 === 0 ? 'left' : 'right'} />
              </div>
              <div className="suite-info">
                <FadeIn delay={200}>
                  <div style={{ height: 1, width: 40, backgroundColor: `${color.gold}66`, marginBottom: 24 }} className="suite-line" />
                  <h3 style={{ fontFamily: font.heading, color: color.bgLight, fontSize: 'clamp(24px, 3vw, 34px)', marginBottom: 20, lineHeight: 1.2 }}>{s.name}</h3>
                </FadeIn>
                <FadeIn delay={400}>
                  <p style={{ fontFamily: font.body, fontWeight: 300, color: color.brown, fontSize: 15, lineHeight: 2, marginBottom: 24, maxWidth: 420 }}>{s.desc}</p>
                </FadeIn>
                <FadeIn delay={600}>
                  <p style={{ fontFamily: font.body, fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: color.goldMuted }}>{s.price}</p>
                </FadeIn>
              </div>
            </div>
          ))}
        </div>

        <style>{`
          .suite-row { display: flex; flex-direction: column; gap: clamp(32px, 4vw, 56px); align-items: center; }
          .suite-img { width: 100%; }
          .suite-info { width: 100%; text-align: center; }
          .suite-line { margin-left: auto; margin-right: auto; }
          @media (min-width: 1024px) {
            .suite-even { flex-direction: row; }
            .suite-odd { flex-direction: row-reverse; }
            .suite-img { width: 58%; }
            .suite-info { width: 42%; text-align: left; }
            .suite-info .suite-line { margin-left: 0; }
          }
        `}</style>
      </div>
    </section>
  );
}

// ============================================================
// DINING
// ============================================================

function Dining() {
  return (
    <section id="dining">
      {/* Hero image */}
      <div style={{ position: 'relative', height: '70vh', overflow: 'hidden' }}>
        <Img src={IMG.diningHero} alt="Desert dining" style={{
          width: '100%', height: '100%',
          filter: 'brightness(0.45) saturate(0.8)',
        }} />
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, ${color.bg}B3, transparent, ${color.bg}4D)` }} />
        <div style={{
          position: 'absolute', inset: 0, zIndex: 10,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', padding: '0 16px',
        }}>
          <FadeIn>
            <p style={{ fontFamily: font.body, fontSize: 9, letterSpacing: 5, textTransform: 'uppercase', color: `${color.goldMuted}80`, marginBottom: 20 }}>CHAPTER THREE</p>
          </FadeIn>
          <FadeIn delay={200}>
            <h2 style={{
              fontFamily: font.heading, color: color.cream,
              fontSize: 'clamp(30px, 5vw, 52px)', letterSpacing: 4, textTransform: 'uppercase',
              textShadow: `0 0 30px ${color.gold}30, 0 2px 30px rgba(0,0,0,0.5)`,
            }}>Dine Beneath the Stars</h2>
          </FadeIn>
          <FadeIn delay={400}>
            <div style={{ height: 1, width: 64, margin: '24px auto 0', background: `linear-gradient(90deg, transparent, ${color.gold}, transparent)` }} />
          </FadeIn>
        </div>
      </div>

      {/* Food grid */}
      <div style={{ backgroundColor: color.cream, padding: 'clamp(64px, 8vw, 128px) 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(20px, 3vw, 48px)' }}>
          <div className="food-grid">
            <RevealImg src={IMG.food1} alt="Moroccan tagine" aspect="4/5" />
            <RevealImg src={IMG.food2} alt="Artisan dishes" aspect="4/5" direction="up" delay={200} />
            <RevealImg src={IMG.food3} alt="Desert cuisine" aspect="4/5" direction="right" delay={400} />
          </div>
          <FadeIn>
            <p style={{ fontFamily: font.body, fontWeight: 300, color: color.brown, textAlign: 'center', fontSize: 15, lineHeight: 2, maxWidth: 580, margin: 'clamp(48px, 6vw, 64px) auto' }}>
              Moroccan heritage meets artisan craft. Every plate tells a story of the land — saffron from Taliouine,
              olive oil from the Atlas foothills, bread baked in earth ovens at dawn.
            </p>
          </FadeIn>
          <RevealImg src={IMG.guestDining} alt="Atmospheric dining" aspect="21/9" direction="up" />
        </div>
        <style>{`
          .food-grid { display: grid; grid-template-columns: 1fr; gap: clamp(12px, 2vw, 20px); }
          @media (min-width: 640px) { .food-grid { grid-template-columns: repeat(3, 1fr); } }
        `}</style>
      </div>
    </section>
  );
}

// ============================================================
// STORY
// ============================================================

function Story() {
  return (
    <section id="story" style={{ position: 'relative', backgroundColor: color.bgLight, padding: 'clamp(80px, 10vw, 160px) 0', overflow: 'hidden' }}>
      <Stars count={45} />
      <div style={{ position: 'relative', zIndex: 10, maxWidth: 700, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
        <FadeIn>
          <p style={{ fontFamily: font.body, fontSize: 9, letterSpacing: 5, textTransform: 'uppercase', color: `${color.goldMuted}80`, marginBottom: 12 }}>CHAPTER FOUR</p>
          <p style={{ fontFamily: font.body, fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', color: color.goldMuted, marginBottom: 28 }}>OUR STORY</p>
        </FadeIn>
        <FadeIn delay={200}>
          <h2 style={{ fontFamily: font.heading, color: color.gold, fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: 1.3, marginBottom: 40, textShadow: `0 0 30px ${color.gold}30` }}>
            The Seven Saints of Marrakech
          </h2>
        </FadeIn>
        <FadeIn delay={400}>
          <p style={{ fontFamily: font.body, fontWeight: 300, color: `${color.cream}CC`, fontSize: 15, lineHeight: 2.1, marginBottom: 32 }}>
            For centuries, the city of Marrakech has been watched over by its seven patron saints — the Sab'atou Rijal.
            These seven holy men, mystics and scholars, arrived from across the Islamic world and chose this red city
            as their home, their sanctuary, their final resting place.
          </p>
        </FadeIn>
        <FadeIn delay={600}>
          <p style={{ fontFamily: font.body, fontWeight: 300, color: `${color.cream}CC`, fontSize: 15, lineHeight: 2.1, marginBottom: 32 }}>
            Their tombs became pilgrimage sites. Their teachings became the spiritual foundation of a city that has
            enchanted travelers for a thousand years.
          </p>
        </FadeIn>
        <FadeIn delay={800}>
          <p style={{ fontFamily: font.body, fontWeight: 300, color: `${color.cream}CC`, fontSize: 15, lineHeight: 2.1, marginBottom: 48 }}>
            The Seven Saints Agafay carries this legacy into the desert — a place where every guest is received not
            as a visitor, but as a pilgrim. Where hospitality is not a service, but a sacred act.
          </p>
        </FadeIn>
        <Divider />
      </div>
      <div style={{ marginTop: 'clamp(64px, 8vw, 128px)' }}>
        <RevealImg src={IMG.twilight} alt="Desert at twilight" aspect="21/8" direction="up" />
      </div>
    </section>
  );
}

// ============================================================
// TESTIMONIALS
// ============================================================

function TestimonialSection() {
  const [cur, setCur] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setCur(c => (c + 1) % TESTIMONIALS.length), 5500);
    return () => clearInterval(t);
  }, []);

  return (
    <section style={{ backgroundColor: color.cream, padding: 'clamp(80px, 10vw, 144px) 0' }}>
      <div style={{ maxWidth: 780, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
        <FadeIn>
          <div style={{ color: `${color.gold}40`, fontSize: 90, fontFamily: font.heading, lineHeight: 0.8, marginBottom: 8, userSelect: 'none' }}>"</div>
        </FadeIn>

        <div style={{ position: 'relative', height: 180 }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              opacity: i === cur ? 1 : 0,
              transform: i === cur ? 'translateY(0)' : 'translateY(8px)',
              transition: 'all 0.9s ease',
            }}>
              <p style={{ fontFamily: font.heading, fontStyle: 'italic', color: color.bgLight, fontSize: 'clamp(18px, 2.5vw, 24px)', lineHeight: 1.6, marginBottom: 20, padding: '0 8px' }}>
                {t.text}
              </p>
              <p style={{ fontFamily: font.body, fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: color.goldMuted }}>
                — {t.author}
              </p>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 32 }}>
          {TESTIMONIALS.map((_, i) => (
            <button key={i} onClick={() => setCur(i)} aria-label={`Show testimonial ${i + 1}`}
              style={{
                border: 'none', padding: 0, borderRadius: 3,
                width: i === cur ? 24 : 6, height: 6,
                backgroundColor: i === cur ? color.gold : `${color.goldMuted}40`,
                transition: 'all 0.5s ease',
              }} />
          ))}
        </div>

        <div style={{ marginTop: 'clamp(64px, 8vw, 96px)' }}>
          <FadeIn>
            <p style={{ fontFamily: font.body, fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', color: `${color.goldMuted}66`, marginBottom: 32 }}>AS FEATURED IN</p>
          </FadeIn>
          <FadeIn delay={200}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(20px, 3vw, 48px)', flexWrap: 'wrap' }}>
              {['CONDÉ NAST', 'MONOCLE', 'WALLPAPER*', 'DEPARTURES', 'ROBB REPORT'].map(n => (
                <span key={n} style={{ fontFamily: font.heading, color: `${color.bgLight}33`, fontSize: 15, letterSpacing: 3, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{n}</span>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// BOOKING
// ============================================================

function Booking() {
  const [form, setForm] = useState({ checkIn: '', checkOut: '', suite: '', guests: '', email: '' });
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault(); setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  const inp: CSSProperties = {
    width: '100%', backgroundColor: 'transparent',
    border: 'none', borderBottom: `1px solid ${color.goldMuted}4D`,
    padding: '12px 0', fontFamily: font.body, fontWeight: 300,
    fontSize: 14, color: color.bgLight, outline: 'none',
  };

  return (
    <section id="book" style={{ padding: 'clamp(80px, 10vw, 144px) 0', background: `linear-gradient(180deg, #F0E8D8, #EDE4D4, #F0E8D8)` }}>
      <div style={{ maxWidth: 580, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
        <FadeIn>
          <p style={{ fontFamily: font.body, fontSize: 9, letterSpacing: 5, textTransform: 'uppercase', color: `${color.goldMuted}80`, marginBottom: 16 }}>CHAPTER FIVE</p>
          <h2 style={{ fontFamily: font.heading, color: color.bgLight, fontSize: 'clamp(26px, 4vw, 40px)', marginBottom: 12 }}>Begin Your Journey</h2>
        </FadeIn>
        <FadeIn delay={150}>
          <p style={{ fontFamily: font.body, fontWeight: 300, color: `${color.brown}B3`, fontSize: 13, letterSpacing: 2, marginBottom: 'clamp(48px, 6vw, 56px)' }}>
            Book direct for the best rate guaranteed
          </p>
        </FadeIn>

        <FadeIn delay={300}>
          <form onSubmit={submit} style={{ textAlign: 'left' }}>
            <div className="form-grid">
              <div>
                <label style={{ display: 'block', fontFamily: font.body, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: `${color.goldMuted}B3`, marginBottom: 8 }}>Check-in</label>
                <input type="date" value={form.checkIn} onChange={e => setForm({ ...form, checkIn: e.target.value })} style={inp} required />
              </div>
              <div>
                <label style={{ display: 'block', fontFamily: font.body, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: `${color.goldMuted}B3`, marginBottom: 8 }}>Check-out</label>
                <input type="date" value={form.checkOut} onChange={e => setForm({ ...form, checkOut: e.target.value })} style={inp} required />
              </div>
              <div>
                <label style={{ display: 'block', fontFamily: font.body, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: `${color.goldMuted}B3`, marginBottom: 8 }}>Suite</label>
                <select value={form.suite} onChange={e => setForm({ ...form, suite: e.target.value })} style={{ ...inp, appearance: 'none' as const }} required>
                  <option value="">Select</option>
                  {SUITES.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontFamily: font.body, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: `${color.goldMuted}B3`, marginBottom: 8 }}>Guests</label>
                <select value={form.guests} onChange={e => setForm({ ...form, guests: e.target.value })} style={{ ...inp, appearance: 'none' as const }} required>
                  <option value="">Select</option>
                  {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginTop: 28 }}>
              <label style={{ display: 'block', fontFamily: font.body, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: `${color.goldMuted}B3`, marginBottom: 8 }}>Email</label>
              <input type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inp} required />
            </div>
            <div style={{ textAlign: 'center', marginTop: 36 }}>
              <button type="submit" style={{
                backgroundColor: color.terra, color: color.cream, border: 'none',
                fontFamily: font.body, fontSize: 12, letterSpacing: 3, textTransform: 'uppercase',
                padding: '16px 56px', transition: 'background-color 0.3s',
              }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#B06A4F')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = color.terra)}>
                {sent ? 'Thank You ✓' : 'Reserve'}
              </button>
            </div>
          </form>
        </FadeIn>

        <FadeIn delay={500}>
          <div style={{ marginTop: 48, paddingTop: 32 }}>
            <Divider />
            <p style={{ fontFamily: font.body, fontWeight: 300, color: `${color.brown}99`, fontSize: 12, marginTop: 24, marginBottom: 12 }}>Or contact us directly</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap' }}>
              <a href="mailto:reservations@thesevensaints.com" style={{ fontFamily: font.body, fontSize: 12, color: color.goldMuted }}>reservations@thesevensaints.com</a>
              <span style={{ color: `${color.goldMuted}4D` }}>|</span>
              <a href="https://wa.me/212661370050" target="_blank" rel="noopener noreferrer" style={{ fontFamily: font.body, fontSize: 12, color: color.goldMuted }}>WhatsApp</a>
            </div>
          </div>
        </FadeIn>

        <style>{`
          .form-grid { display: grid; grid-template-columns: 1fr; gap: 28px; }
          @media (min-width: 640px) { .form-grid { grid-template-columns: 1fr 1fr; } }
        `}</style>
      </div>
    </section>
  );
}

// ============================================================
// LOCATION
// ============================================================

function Location() {
  return (
    <section style={{ position: 'relative', backgroundColor: color.bg, padding: 'clamp(80px, 10vw, 144px) 0', overflow: 'hidden' }}>
      <Stars count={18} />
      <div className="loc-wrap" style={{ position: 'relative', zIndex: 10, maxWidth: 1400, margin: '0 auto', padding: '0 clamp(20px, 3vw, 48px)' }}>
        <div className="loc-text">
          <FadeIn>
            <p style={{ fontFamily: font.body, fontSize: 9, letterSpacing: 5, textTransform: 'uppercase', color: `${color.goldMuted}80`, marginBottom: 16 }}>FIND US</p>
            <h2 style={{ fontFamily: font.heading, color: color.gold, fontSize: 'clamp(26px, 3.5vw, 38px)', marginBottom: 20, textShadow: `0 0 30px ${color.gold}30` }}>
              Where the Atlas Meets the Desert
            </h2>
          </FadeIn>
          <FadeIn delay={200}>
            <p style={{ fontFamily: font.body, fontWeight: 300, color: `${color.cream}BF`, fontSize: 15, lineHeight: 2, marginBottom: 32 }}>
              40 minutes from the Marrakech Medina. A world away from everything else.
            </p>
          </FadeIn>
          <FadeIn delay={400}>
            <div style={{ fontFamily: font.body, fontWeight: 300, color: `${color.cream}8C`, fontSize: 13, lineHeight: 1.9 }}>
              {[
                { label: 'From Marrakech', text: 'Private transfer arranged upon booking. 40-minute scenic drive.' },
                { label: 'From Airport', text: 'Marrakech Menara Airport (RAK) — 50-minute private transfer included.' },
                { label: 'Coordinates', text: '31.4°N, 8.2°W — Summit of the Agafay Stone Dunes' },
              ].map(item => (
                <div key={item.label} style={{ marginBottom: 20 }}>
                  <span style={{ display: 'block', color: `${color.goldMuted}99`, fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 4 }}>{item.label}</span>
                  {item.text}
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
        <div className="loc-img">
          <RevealImg src={IMG.location} alt="Agafay Desert" direction="right" />
        </div>
      </div>
      <style>{`
        .loc-wrap { display: flex; flex-direction: column; gap: clamp(40px, 5vw, 64px); align-items: center; }
        .loc-text { width: 100%; text-align: center; }
        .loc-img { width: 100%; }
        @media (min-width: 1024px) {
          .loc-wrap { flex-direction: row; }
          .loc-text { width: 42%; text-align: left; }
          .loc-img { width: 58%; }
        }
      `}</style>
    </section>
  );
}

// ============================================================
// FOOTER
// ============================================================

function Footer() {
  const [email, setEmail] = useState('');
  const [sub, setSub] = useState(false);
  const go = (e: React.FormEvent) => { e.preventDefault(); if (email) { setSub(true); setEmail(''); setTimeout(() => setSub(false), 3000); } };

  return (
    <footer style={{ backgroundColor: color.bg, padding: 'clamp(64px, 8vw, 96px) 0', borderTop: `1px solid ${color.gold}14` }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(24px, 3vw, 48px)' }}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ fontSize: 28, color: color.gold, opacity: 0.3, marginBottom: 12 }}>✦</div>
          <h3 style={{ fontFamily: font.heading, color: `${color.gold}59`, fontSize: 13, letterSpacing: 8, textTransform: 'uppercase' }}>THE SEVEN SAINTS</h3>
        </div>

        {/* Links */}
        <div className="footer-grid">
          <div>
            <h4 style={{ fontFamily: font.body, fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: `${color.goldMuted}66`, marginBottom: 20 }}>Contact</h4>
            {[
              { href: 'mailto:reservations@thesevensaints.com', text: 'reservations@thesevensaints.com' },
              { href: 'tel:+212661370050', text: '+212 661 370 050' },
              { href: 'https://wa.me/212661370050', text: 'WhatsApp' },
            ].map(l => (
              <a key={l.text} href={l.href} target={l.href.startsWith('https') ? '_blank' : undefined} rel="noopener noreferrer"
                style={{ display: 'block', fontFamily: font.body, fontWeight: 300, color: `${color.cream}66`, fontSize: 12, marginBottom: 10, textDecoration: 'none' }}>
                {l.text}
              </a>
            ))}
          </div>
          <div>
            <h4 style={{ fontFamily: font.body, fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: `${color.goldMuted}66`, marginBottom: 20 }}>Explore</h4>
            {NAV_ITEMS.map(item => (
              <button key={item} onClick={() => document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })}
                style={{ display: 'block', width: '100%', background: 'none', border: 'none', fontFamily: font.body, fontWeight: 300, color: `${color.cream}66`, fontSize: 12, marginBottom: 10, textAlign: 'inherit' }}>
                {item}
              </button>
            ))}
          </div>
          <div>
            <h4 style={{ fontFamily: font.body, fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: `${color.goldMuted}66`, marginBottom: 20 }}>Follow</h4>
            {['Instagram', 'Facebook', 'TikTok'].map(n => (
              <a key={n} href="#" style={{ display: 'block', fontFamily: font.body, fontWeight: 300, color: `${color.cream}59`, fontSize: 12, marginBottom: 10, textDecoration: 'none' }}>{n}</a>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div style={{ maxWidth: 380, margin: '48px auto', textAlign: 'center' }}>
          <p style={{ fontFamily: font.body, fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: `${color.goldMuted}59`, marginBottom: 12 }}>Newsletter</p>
          <form onSubmit={go} style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
            <input type="email" placeholder="Your email" value={email} onChange={e => setEmail(e.target.value)}
              style={{ flex: 1, backgroundColor: 'transparent', border: 'none', borderBottom: `1px solid ${color.gold}26`, padding: '8px 0', fontFamily: font.body, fontWeight: 300, fontSize: 12, color: `${color.cream}99`, outline: 'none' }} required />
            <button type="submit" style={{ background: 'none', border: 'none', fontFamily: font.body, fontSize: 16, color: `${color.goldMuted}66`, paddingBottom: 8 }}>
              {sub ? '✓' : '→'}
            </button>
          </form>
        </div>

        {/* Copyright */}
        <div style={{ textAlign: 'center', paddingTop: 32, borderTop: `1px solid ${color.gold}0F` }}>
          <p style={{ fontFamily: font.body, fontWeight: 300, color: `${color.goldMuted}4D`, fontSize: 10, letterSpacing: 2 }}>
            The Seven Saints Agafay — Marrakech, Morocco
          </p>
          <p style={{ fontFamily: font.body, fontWeight: 300, color: `${color.goldMuted}2E`, fontSize: 9, marginTop: 8 }}>
            © {new Date().getFullYear()} The Seven Saints. All rights reserved.
          </p>
        </div>

        <style>{`
          .footer-grid { display: grid; grid-template-columns: 1fr; gap: 40px; text-align: center; margin-bottom: 56px; }
          @media (min-width: 768px) { .footer-grid { grid-template-columns: repeat(3, 1fr); } }
        `}</style>
      </div>
    </footer>
  );
}

// ============================================================
// APP
// ============================================================

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const onDone = useCallback(() => setLoaded(true), []);

  // Inject global CSS once
  useEffect(() => {
    const id = 'seven-saints-global-css';
    if (!document.getElementById(id)) {
      const style = document.createElement('style');
      style.id = id;
      style.textContent = GLOBAL_CSS;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <>
      <Loading onDone={onDone} />
      <ScrollProgress />
      <BackToTop />
      <Nav loaded={loaded} />
      <main>
        <Hero loaded={loaded} />
        <Intro />
        <Experience />
        <SuitesSection />
        <Dining />
        <Story />
        <TestimonialSection />
        <Booking />
        <Location />
      </main>
      <Footer />
    </>
  );
}
