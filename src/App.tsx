import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import type { ReactNode, CSSProperties, FormEvent } from 'react'

// ============================================================
// IMAGES - using picsum with specific seeds for consistency
// ============================================================

const I = {
  h1: 'https://picsum.photos/seed/desert1/1920/1080',
  h2: 'https://picsum.photos/seed/desert2/1920/1080',
  h3: 'https://picsum.photos/seed/desert3/1920/1080',
  tent: 'https://picsum.photos/seed/tent1/1200/800',
  pool: 'https://picsum.photos/seed/pool1/1200/1600',
  camels: 'https://picsum.photos/seed/camel1/1200/1600',
  dinner: 'https://picsum.photos/seed/dinner1/1200/800',
  pano: 'https://picsum.photos/seed/pano1/1920/700',
  f1: 'https://picsum.photos/seed/food1/800/1000',
  f2: 'https://picsum.photos/seed/food2/800/1000',
  f3: 'https://picsum.photos/seed/food3/800/1000',
  dusk: 'https://picsum.photos/seed/dusk1/1920/700',
  s1: 'https://picsum.photos/seed/suite1/1200/900',
  s2: 'https://picsum.photos/seed/suite2/1200/900',
  s3: 'https://picsum.photos/seed/suite3/1200/900',
  loc: 'https://picsum.photos/seed/location1/1200/900',
  gd: 'https://picsum.photos/seed/gdining/1200/500',
}

// ============================================================
// DATA
// ============================================================

const SUITES = [
  {
    name: 'The Atlas Pavilion',
    desc: 'A sanctuary of hand-woven textiles and desert light, with panoramic views of the Atlas Mountains from your private terrace.',
    price: 'From $850 / night',
    image: I.s1,
  },
  {
    name: 'The Nomad Suite',
    desc: 'Inspired by the Berber caravans that once crossed these dunes, with an open-air bathing courtyard beneath the stars.',
    price: 'From $1,200 / night',
    image: I.s2,
  },
  {
    name: 'The Saint\u2019s Retreat',
    desc: 'Our most private residence with a plunge pool and 360-degree desert views from the highest dune.',
    price: 'From $2,400 / night',
    image: I.s3,
  },
]

const QUOTES = [
  {
    text: 'A place where time dissolves and the desert speaks. The Seven Saints is not a hotel — it is an awakening.',
    by: 'Condé Nast Traveller',
  },
  {
    text: 'The most extraordinary desert experience in North Africa. Every detail whispers ancient luxury.',
    by: 'Monocle Magazine',
  },
  {
    text: 'We arrived as guests and left transformed. The silence, the stars, the sacred hospitality.',
    by: 'Alexandra & James, London',
  },
]

const NAV_ITEMS = ['Experience', 'Suites', 'Dining', 'Story', 'Book']

// ============================================================
// THEME
// ============================================================

const C = {
  bg: '#1A1714',
  bg2: '#2C2825',
  cream: '#F5F0E8',
  gold: '#C9A96E',
  gm: '#B8A080',
  terra: '#C4785B',
  brown: '#5A4E42',
}

const F = {
  h: "'Cormorant Garamond', serif",
  b: "'Montserrat', sans-serif",
}

// ============================================================
// INJECT GLOBAL CSS
// ============================================================

const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Montserrat:wght@200;300;400;500&display=swap');

*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Montserrat', sans-serif;
  background-color: #1A1714;
  color: #F5F0E8;
  overflow-x: hidden;
}

img {
  display: block;
  max-width: 100%;
}

button {
  cursor: pointer;
}

a {
  text-decoration: none;
}

@keyframes twinkle {
  0%, 100% { opacity: 0.05; }
  50% { opacity: 0.8; }
}

@keyframes kb1 {
  0% { transform: scale(1) translate(0, 0); }
  100% { transform: scale(1.18) translate(-1.5%, -1%); }
}

@keyframes kb2 {
  0% { transform: scale(1.1) translate(1%, 0); }
  100% { transform: scale(1) translate(-1%, 1%); }
}

@keyframes kb3 {
  0% { transform: scale(1) translate(0, 1%); }
  100% { transform: scale(1.15) translate(1%, -1%); }
}

@keyframes scrollBounce {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(10px); }
}

@keyframes sandFloat {
  0% { transform: translateX(-10px) translateY(0); opacity: 0; }
  10% { opacity: 0.12; }
  90% { opacity: 0.06; }
  100% { transform: translateX(100vw) translateY(-20px); opacity: 0; }
}
`

// ============================================================
// HOOKS
// ============================================================

function useVisible(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [vis, setVis] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVis(true)
          observer.disconnect()
        }
      },
      { threshold, rootMargin: '50px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, vis }
}

function useScroll() {
  const [y, setY] = useState(0)
  useEffect(() => {
    const handler = () => setY(window.scrollY)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])
  return y
}

// ============================================================
// BASIC COMPONENTS
// ============================================================

function Img({
  src,
  alt,
  width,
  height,
  eager,
  imgStyle,
}: {
  src: string
  alt: string
  width?: string
  height?: string
  eager?: boolean
  imgStyle?: CSSProperties
}) {
  const [loaded, setLoaded] = useState(false)
  const [err, setErr] = useState(false)

  if (err) {
    return (
      <div
        style={{
          width: width || '100%',
          height: height || '300px',
          backgroundColor: C.bg2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ color: C.gold, opacity: 0.3, fontSize: 32 }}>✦</span>
      </div>
    )
  }

  return (
    <div
      style={{
        width: width || '100%',
        height: height || 'auto',
        backgroundColor: C.bg2,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <img
        src={src}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        onLoad={() => setLoaded(true)}
        onError={() => setErr(true)}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.8s ease',
          ...imgStyle,
        }}
      />
    </div>
  )
}

function FadeIn({
  children,
  delay = 0,
}: {
  children: ReactNode
  delay?: number
}) {
  const { ref, vis } = useVisible(0.05)

  return (
    <div
      ref={ref}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? 'translateY(0)' : 'translateY(25px)',
        transition: `opacity 0.8s ease ${delay}ms, transform 0.8s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

function SectionTitle({
  chapter,
  title,
  light = false,
}: {
  chapter: string
  title: string
  light?: boolean
}) {
  return (
    <div style={{ textAlign: 'center', marginBottom: 'clamp(40px, 6vw, 70px)' }}>
      <FadeIn>
        <p
          style={{
            fontFamily: F.b,
            fontSize: 9,
            letterSpacing: 5,
            textTransform: 'uppercase',
            color: light ? `${C.gm}80` : `${C.gm}80`,
            marginBottom: 14,
          }}
        >
          {chapter}
        </p>
        <h2
          style={{
            fontFamily: F.h,
            color: light ? C.gold : C.bg2,
            fontSize: 'clamp(24px, 4vw, 40px)',
            letterSpacing: 4,
            textTransform: 'uppercase',
            marginBottom: 18,
            textShadow: light ? `0 0 30px ${C.gold}30` : 'none',
          }}
        >
          {title}
        </h2>
        <div
          style={{
            height: 1,
            width: 60,
            margin: '0 auto',
            background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`,
          }}
        />
      </FadeIn>
    </div>
  )
}

function DiamondSep() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        padding: '16px 0',
      }}
    >
      <div
        style={{
          height: 1,
          width: 50,
          background: `linear-gradient(270deg, ${C.gold}80, transparent)`,
        }}
      />
      <div
        style={{
          width: 8,
          height: 8,
          border: `1px solid ${C.gold}`,
          transform: 'rotate(45deg)',
          opacity: 0.6,
        }}
      />
      <div
        style={{
          height: 1,
          width: 50,
          background: `linear-gradient(90deg, ${C.gold}80, transparent)`,
        }}
      />
    </div>
  )
}

function Stars({ count = 30 }: { count?: number }) {
  const stars = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        i,
        sz: Math.random() * 2.5 + 0.5,
        t: Math.random() * 85 + 5,
        l: Math.random() * 95 + 2,
        du: Math.random() * 4 + 2,
        de: Math.random() * 8,
      })),
    [count]
  )
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {stars.map((s) => (
        <div
          key={s.i}
          style={{
            position: 'absolute',
            width: s.sz,
            height: s.sz,
            borderRadius: '50%',
            top: `${s.t}%`,
            left: `${s.l}%`,
            backgroundColor: C.gold,
            animation: `twinkle ${s.du}s ease-in-out ${s.de}s infinite`,
          }}
        />
      ))}
    </div>
  )
}

function SandParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        i,
        sz: Math.random() * 3 + 1,
        t: Math.random() * 80 + 5,
        du: Math.random() * 14 + 14,
        de: Math.random() * 20,
      })),
    []
  )
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 2,
      }}
    >
      {particles.map((p) => (
        <div
          key={p.i}
          style={{
            position: 'absolute',
            width: p.sz,
            height: p.sz,
            borderRadius: '50%',
            top: `${p.t}%`,
            left: '-10px',
            backgroundColor: `${C.gold}60`,
            animation: `sandFloat ${p.du}s linear ${p.de}s infinite`,
          }}
        />
      ))}
    </div>
  )
}

// ============================================================
// WRAP - max width container
// ============================================================

function Wrap({
  children,
  max = 1380,
  style,
}: {
  children: ReactNode
  max?: number
  style?: CSSProperties
}) {
  return (
    <div
      style={{
        maxWidth: max,
        margin: '0 auto',
        padding: '0 clamp(16px, 3vw, 48px)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

// ============================================================
// LOADING SCREEN
// ============================================================

function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 2200),
      setTimeout(() => setPhase(4), 3400),
      setTimeout(() => {
        setPhase(5)
        onComplete()
      }, 4200),
    ]
    return () => timers.forEach(clearTimeout)
  }, [onComplete])

  if (phase === 5) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: C.bg,
        transform: phase >= 4 ? 'translateY(-100%)' : 'translateY(0)',
        transition: 'transform 1.2s cubic-bezier(0.77, 0, 0.175, 1)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 50% 70%, rgba(196,120,91,0.06), transparent 60%)',
          opacity: phase >= 2 ? 1 : 0,
          transition: 'opacity 2s',
        }}
      />
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
        <p
          style={{
            fontFamily: F.b,
            fontSize: 10,
            letterSpacing: 6,
            textTransform: 'uppercase',
            color: `${C.gm}70`,
            marginBottom: 28,
            opacity: phase >= 2 ? 1 : 0,
            transition: 'opacity 1s',
          }}
        >
          Agafay Desert · Marrakech
        </p>
        <div
          style={{
            opacity: phase >= 1 ? 1 : 0,
            transform: phase >= 1 ? 'scale(1)' : 'scale(0.8)',
            transition: 'all 1.4s ease',
          }}
        >
          <div
            style={{
              fontSize: 44,
              color: C.gold,
              opacity: 0.5,
              marginBottom: 14,
            }}
          >
            ✦
          </div>
          <h1
            style={{
              fontFamily: F.h,
              fontSize: 'clamp(18px, 3vw, 26px)',
              letterSpacing: 10,
              textTransform: 'uppercase',
              color: C.gold,
              textShadow: `0 0 40px ${C.gold}30`,
            }}
          >
            THE SEVEN SAINTS
          </h1>
        </div>
        <div
          style={{
            height: 1,
            margin: '22px auto 0',
            width: phase >= 2 ? 100 : 0,
            background: `linear-gradient(90deg, transparent, ${C.terra}80, ${C.gold}, ${C.terra}80, transparent)`,
            transition: 'width 1.4s ease',
          }}
        />
        <p
          style={{
            fontFamily: F.b,
            fontSize: 10,
            letterSpacing: 5,
            textTransform: 'uppercase',
            color: `${C.cream}30`,
            marginTop: 24,
            opacity: phase >= 3 ? 1 : 0,
            transition: 'opacity 1s ease 300ms',
          }}
        >
          Where earth meets sky
        </p>
      </div>
    </div>
  )
}

// ============================================================
// NAV
// ============================================================

function Nav({ ready }: { ready: boolean }) {
  const scrollY = useScroll()
  const scrolled = scrollY > 80
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const prevY = useRef(0)

  useEffect(() => {
    setHidden(scrollY > 400 && scrollY > prevY.current)
    prevY.current = scrollY
  }, [scrollY])

  const goTo = useCallback((id: string) => {
    setMobileOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: scrolled ? `${C.bg}EB` : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled
            ? `1px solid ${C.gold}14`
            : '1px solid transparent',
          transform: hidden ? 'translateY(-100%)' : 'translateY(0)',
          opacity: ready ? 1 : 0,
          transition: 'all 0.6s ease',
        }}
      >
        <div
          style={{
            maxWidth: 1440,
            margin: '0 auto',
            padding: '0 clamp(16px, 3vw, 56px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 'clamp(56px, 8vw, 80px)',
          }}
        >
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{
              background: 'none',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              color: C.gold,
              fontFamily: F.b,
              fontSize: 12,
              letterSpacing: 5,
              textTransform: 'uppercase',
            }}
          >
            <span style={{ fontSize: 18, opacity: 0.7 }}>✦</span>
            <span>THE SEVEN SAINTS</span>
          </button>

          {/* Desktop nav */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(20px, 3vw, 36px)',
            }}
          >
            {NAV_ITEMS.map((item) => (
              <button
                key={item}
                onClick={() => goTo(item.toLowerCase())}
                style={{
                  background: 'none',
                  border: 'none',
                  fontFamily: F.b,
                  fontSize: 11,
                  letterSpacing: 3,
                  textTransform: 'uppercase',
                  color: `${C.cream}CC`,
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 60,
            background: `${C.bg}FA`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <button
            onClick={() => setMobileOpen(false)}
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              background: 'none',
              border: 'none',
              color: `${C.cream}99`,
              padding: 12,
            }}
          >
            ✕
          </button>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 32,
            }}
          >
            {NAV_ITEMS.map((item) => (
              <button
                key={item}
                onClick={() => goTo(item.toLowerCase())}
                style={{
                  background: 'none',
                  border: 'none',
                  fontFamily: F.h,
                  fontSize: 22,
                  letterSpacing: 8,
                  textTransform: 'uppercase',
                  color: `${C.cream}B3`,
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

// ============================================================
// SCROLL PROGRESS
// ============================================================

function ScrollProgress() {
  const y = useScroll()
  const [pct, setPct] = useState(0)

  useEffect(() => {
    const total =
      document.documentElement.scrollHeight - window.innerHeight
    setPct(total > 0 ? (y / total) * 100 : 0)
  }, [y])

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: 2,
        zIndex: 90,
        width: `${pct}%`,
        background: `linear-gradient(90deg, ${C.terra}, ${C.gold}, #E0C88A)`,
        boxShadow: `0 0 12px ${C.gold}80`,
      }}
    />
  )
}

function BackToTop() {
  const y = useScroll()
  const show = y > 800
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      style={{
        position: 'fixed',
        bottom: 32,
        right: 32,
        zIndex: 50,
        width: 44,
        height: 44,
        borderRadius: '50%',
        border: `1px solid ${C.gold}4D`,
        background: `${C.bg}CC`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.5s ease',
        pointerEvents: show ? 'auto' : 'none',
        color: C.gold,
        fontSize: 18,
      }}
    >
      ↑
    </button>
  )
}

// ============================================================
// HERO
// ============================================================

function Hero({ ready }: { ready: boolean }) {
  const scrollY = useScroll()
  const [slide, setSlide] = useState(0)
  const heroSlides = [I.h1, I.h2, I.h3]

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % 3), 6000)
    return () => clearInterval(t)
  }, [])

  return (
    <section
      style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}
    >
      {/* BG slides */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translateY(${scrollY * 0.3}px)`,
        }}
      >
        <div
          style={{ width: '100%', height: '130%', position: 'relative' }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(180deg, ${C.bg}, #2A1808 30%, #4A3520 55%, ${C.bg})`,
            }}
          />
          {heroSlides.map((url, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                inset: 0,
                opacity: i === slide ? 1 : 0,
                transition: 'opacity 2s ease-in-out',
              }}
            >
              <img
                src={url}
                alt=""
                loading={i === 0 ? 'eager' : 'lazy'}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter:
                    'saturate(0.65) brightness(0.45) sepia(0.3) contrast(1.1)',
                  animation:
                    i === slide
                      ? `kb${(i % 3) + 1} 14s ease-in-out alternate infinite`
                      : 'none',
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <SandParticles />

      {/* Overlays */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(to top, ${C.bg}, ${C.bg}33, transparent)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(to bottom, ${C.bg}55, transparent)`,
        }}
      />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '0 20px',
        }}
      >
        <div
          style={{
            fontSize: 38,
            color: C.gold,
            marginBottom: 16,
            opacity: ready ? 0.5 : 0,
            transform: ready ? 'scale(1)' : 'scale(0.5)',
            transition: 'all 1.2s ease 200ms',
          }}
        >
          ✦
        </div>

        <h1
          style={{
            fontFamily: F.h,
            color: C.cream,
            fontSize: 'clamp(30px, 7vw, 76px)',
            letterSpacing: 'clamp(6px, 1.5vw, 14px)',
            textTransform: 'uppercase',
            lineHeight: 1.1,
            textShadow: `0 0 60px ${C.gold}25`,
            opacity: ready ? 1 : 0,
            transform: ready ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 1s ease 400ms',
          }}
        >
          THE SEVEN SAINTS
        </h1>

        <div
          style={{
            height: 1,
            margin: '24px auto 0',
            width: ready ? 100 : 0,
            background: `linear-gradient(90deg, transparent, ${C.terra}80, ${C.gold}, ${C.terra}80, transparent)`,
            transition: 'width 1.2s ease 1800ms',
          }}
        />

        <p
          style={{
            fontFamily: F.b,
            fontWeight: 300,
            color: `${C.cream}BF`,
            fontSize: 'clamp(10px, 1.5vw, 13px)',
            letterSpacing: 'clamp(3px, 0.8vw, 6px)',
            textTransform: 'uppercase',
            marginTop: 22,
            opacity: ready ? 1 : 0,
            transition: 'all 1s ease 2200ms',
          }}
        >
          At the summit of the Agafay dunes, Marrakech
        </p>
      </div>

      {/* Scroll indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: 36,
          left: '50%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          opacity: ready ? 1 : 0,
          transition: 'opacity 1s ease 3s',
          animation: 'scrollBounce 2s ease-in-out infinite',
        }}
      >
        <p
          style={{
            fontFamily: F.b,
            fontSize: 8,
            letterSpacing: 4,
            textTransform: 'uppercase',
            color: `${C.cream}40`,
            marginBottom: 10,
          }}
        >
          Scroll
        </p>
        <div
          style={{
            width: 1,
            height: 36,
            background: `linear-gradient(to bottom, transparent, ${C.gold}66, ${C.gold}99)`,
          }}
        />
      </div>
    </section>
  )
}

// ============================================================
// INTRO
// ============================================================

function IntroSection() {
  return (
    <section
      style={{
        backgroundColor: C.cream,
        padding: 'clamp(80px, 12vw, 180px) 0',
      }}
    >
      <Wrap max={640} style={{ textAlign: 'center' }}>
        <FadeIn>
          <p
            style={{
              fontFamily: F.b,
              fontSize: 11,
              letterSpacing: 5,
              textTransform: 'uppercase',
              color: C.gm,
              marginBottom: 24,
            }}
          >
            AGAFAY, MARRAKECH
          </p>
        </FadeIn>
        <FadeIn delay={200}>
          <h2
            style={{
              fontFamily: F.h,
              color: C.bg2,
              fontSize: 'clamp(24px, 4vw, 38px)',
              lineHeight: 1.4,
              marginBottom: 28,
            }}
          >
            Where Earth Meets Sky and Silence Becomes Ceremony
          </h2>
        </FadeIn>
        <FadeIn delay={400}>
          <p
            style={{
              fontFamily: F.b,
              fontWeight: 300,
              color: C.brown,
              fontSize: 15,
              lineHeight: 2,
              marginBottom: 36,
            }}
          >
            Perched upon the ancient stone dunes of the Agafay desert, The
            Seven Saints is a sanctuary of silence, starlight, and Moroccan
            heritage. Here, the Atlas Mountains frame every horizon.
          </p>
        </FadeIn>
        <FadeIn delay={600}>
          <div
            style={{
              height: 1,
              width: 60,
              margin: '0 auto',
              background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`,
            }}
          />
        </FadeIn>
      </Wrap>
    </section>
  )
}

// ============================================================
// EXPERIENCE
// ============================================================

function ExperienceSection() {
  return (
    <section
      id="experience"
      style={{
        position: 'relative',
        backgroundColor: C.bg,
        padding: 'clamp(80px, 10vw, 150px) 0',
        overflow: 'hidden',
      }}
    >
      <Stars count={20} />
      <Wrap style={{ position: 'relative', zIndex: 10 }}>
        <SectionTitle chapter="CHAPTER ONE" title="The Experience" light />

        {/* Row 1 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 20,
            marginBottom: 40,
          }}
        >
          <FadeIn>
            <Img src={I.tent} alt="Luxury tent" height="400px" />
            <p
              style={{
                fontFamily: F.b,
                fontStyle: 'italic',
                fontWeight: 300,
                color: `${C.cream}50`,
                fontSize: 12,
                marginTop: 10,
              }}
            >
              Handcrafted luxury, draped in desert warmth
            </p>
          </FadeIn>
        </div>

        {/* Row 2: two images side by side */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 20,
            marginBottom: 40,
          }}
        >
          <FadeIn>
            <Img src={I.pool} alt="Infinity pool" height="500px" />
          </FadeIn>
          <FadeIn delay={200}>
            <Img src={I.camels} alt="Camels at golden hour" height="500px" />
          </FadeIn>
        </div>

        {/* Quote */}
        <FadeIn>
          <p
            style={{
              fontFamily: F.h,
              fontStyle: 'italic',
              color: `${C.cream}40`,
              fontSize: 'clamp(16px, 2vw, 20px)',
              letterSpacing: 3,
              textAlign: 'center',
              margin: '20px 0 40px',
            }}
          >
            where the dunes glow gold before nightfall
          </p>
        </FadeIn>

        {/* Row 3 */}
        <FadeIn>
          <Img src={I.dinner} alt="Candlelit dinner" height="400px" />
          <p
            style={{
              fontFamily: F.b,
              fontStyle: 'italic',
              fontWeight: 300,
              color: `${C.cream}50`,
              fontSize: 12,
              marginTop: 10,
              textAlign: 'right',
            }}
          >
            Evenings woven with candlelight and conversation
          </p>
        </FadeIn>

        {/* Panorama */}
        <div style={{ marginTop: 40 }}>
          <FadeIn>
            <Img src={I.pano} alt="Desert panorama" height="350px" />
          </FadeIn>
        </div>
      </Wrap>
    </section>
  )
}

// ============================================================
// SUITES
// ============================================================

function SuitesSection() {
  return (
    <section
      id="suites"
      style={{
        backgroundColor: C.cream,
        padding: 'clamp(80px, 10vw, 150px) 0',
      }}
    >
      <Wrap>
        <SectionTitle chapter="CHAPTER TWO" title="Suites & Tents" />

        <FadeIn>
          <p
            style={{
              fontFamily: F.b,
              fontWeight: 300,
              color: `${C.brown}B3`,
              fontSize: 14,
              textAlign: 'center',
              maxWidth: 480,
              margin: '0 auto 60px',
              lineHeight: 1.8,
            }}
          >
            Each residence is a private sanctuary, designed to dissolve the
            boundary between shelter and sky.
          </p>
        </FadeIn>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(60px, 8vw, 100px)',
          }}
        >
          {SUITES.map((suite, i) => (
            <div
              key={suite.name}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'clamp(24px, 4vw, 48px)',
                alignItems: 'center',
              }}
            >
              {/* Image */}
              <FadeIn>
                <Img
                  src={suite.image}
                  alt={suite.name}
                  height="450px"
                />
              </FadeIn>

              {/* Text */}
              <div style={{ textAlign: 'center', maxWidth: 500 }}>
                <FadeIn delay={200}>
                  <div
                    style={{
                      height: 1,
                      width: 40,
                      background: `${C.gold}66`,
                      margin: '0 auto 22px',
                    }}
                  />
                  <h3
                    style={{
                      fontFamily: F.h,
                      color: C.bg2,
                      fontSize: 'clamp(22px, 3vw, 32px)',
                      marginBottom: 18,
                      lineHeight: 1.2,
                    }}
                  >
                    {suite.name}
                  </h3>
                </FadeIn>
                <FadeIn delay={400}>
                  <p
                    style={{
                      fontFamily: F.b,
                      fontWeight: 300,
                      color: C.brown,
                      fontSize: 15,
                      lineHeight: 2,
                      marginBottom: 22,
                    }}
                  >
                    {suite.desc}
                  </p>
                </FadeIn>
                <FadeIn delay={600}>
                  <p
                    style={{
                      fontFamily: F.b,
                      fontSize: 11,
                      letterSpacing: 3,
                      textTransform: 'uppercase',
                      color: C.gm,
                    }}
                  >
                    {suite.price}
                  </p>
                </FadeIn>
              </div>
            </div>
          ))}
        </div>
      </Wrap>
    </section>
  )
}

// ============================================================
// DINING
// ============================================================

function DiningSection() {
  return (
    <section id="dining">
      {/* Hero banner */}
      <div
        style={{
          position: 'relative',
          height: '65vh',
          overflow: 'hidden',
        }}
      >
        <img
          src={I.dinner}
          alt="Desert dining"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.4) saturate(0.8)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(to top, ${C.bg}B3, transparent, ${C.bg}4D)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '0 16px',
          }}
        >
          <FadeIn>
            <p
              style={{
                fontFamily: F.b,
                fontSize: 9,
                letterSpacing: 5,
                textTransform: 'uppercase',
                color: `${C.gm}80`,
                marginBottom: 18,
              }}
            >
              CHAPTER THREE
            </p>
          </FadeIn>
          <FadeIn delay={200}>
            <h2
              style={{
                fontFamily: F.h,
                color: C.cream,
                fontSize: 'clamp(28px, 5vw, 50px)',
                letterSpacing: 4,
                textTransform: 'uppercase',
                textShadow: `0 0 30px ${C.gold}30`,
              }}
            >
              Dine Beneath the Stars
            </h2>
          </FadeIn>
          <FadeIn delay={400}>
            <div
              style={{
                height: 1,
                width: 60,
                margin: '22px auto 0',
                background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`,
              }}
            />
          </FadeIn>
        </div>
      </div>

      {/* Food images */}
      <div
        style={{
          backgroundColor: C.cream,
          padding: 'clamp(60px, 8vw, 120px) 0',
        }}
      >
        <Wrap max={1180}>
          {/* 3 food images */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 20,
              marginBottom: 50,
            }}
          >
            <FadeIn>
              <Img src={I.f1} alt="Moroccan tagine" height="400px" />
            </FadeIn>
            <FadeIn delay={200}>
              <Img src={I.f2} alt="Artisan dishes" height="400px" />
            </FadeIn>
            <FadeIn delay={400}>
              <Img src={I.f3} alt="Desert cuisine" height="400px" />
            </FadeIn>
          </div>

          <FadeIn>
            <p
              style={{
                fontFamily: F.b,
                fontWeight: 300,
                color: C.brown,
                textAlign: 'center',
                fontSize: 15,
                lineHeight: 2,
                maxWidth: 560,
                margin: '0 auto 50px',
              }}
            >
              Moroccan heritage meets artisan craft. Every plate tells a
              story of the land — saffron from Taliouine, olive oil from the
              Atlas foothills, bread baked at dawn.
            </p>
          </FadeIn>

          <FadeIn>
            <Img src={I.gd} alt="Guest dining" height="350px" />
          </FadeIn>
        </Wrap>
      </div>
    </section>
  )
}

// ============================================================
// STORY
// ============================================================

function StorySection() {
  return (
    <section
      id="story"
      style={{
        position: 'relative',
        backgroundColor: C.bg2,
        padding: 'clamp(80px, 10vw, 150px) 0',
        overflow: 'hidden',
      }}
    >
      <Stars count={40} />

      <Wrap max={680} style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
        <SectionTitle chapter="CHAPTER FOUR" title="The Seven Saints of Marrakech" light />

        <FadeIn delay={200}>
          <p
            style={{
              fontFamily: F.b,
              fontWeight: 300,
              color: `${C.cream}CC`,
              fontSize: 15,
              lineHeight: 2.1,
              marginBottom: 28,
            }}
          >
            For centuries, Marrakech has been watched over by its seven
            patron saints — the Sab'atou Rijal. These holy men, mystics
            and scholars, arrived from across the Islamic world and chose
            this red city as their home.
          </p>
        </FadeIn>

        <FadeIn delay={400}>
          <p
            style={{
              fontFamily: F.b,
              fontWeight: 300,
              color: `${C.cream}CC`,
              fontSize: 15,
              lineHeight: 2.1,
              marginBottom: 28,
            }}
          >
            Their tombs became pilgrimage sites. Their teachings became the
            spiritual foundation of a city that has enchanted travelers for
            a thousand years.
          </p>
        </FadeIn>

        <FadeIn delay={600}>
          <p
            style={{
              fontFamily: F.b,
              fontWeight: 300,
              color: `${C.cream}CC`,
              fontSize: 15,
              lineHeight: 2.1,
              marginBottom: 44,
            }}
          >
            The Seven Saints Agafay carries this legacy into the desert —
            where hospitality is not a service, but a sacred act.
          </p>
        </FadeIn>

        <DiamondSep />
      </Wrap>

      {/* Wide image */}
      <div style={{ marginTop: 'clamp(60px, 8vw, 120px)' }}>
        <FadeIn>
          <Img src={I.dusk} alt="Desert twilight" height="400px" />
        </FadeIn>
      </div>
    </section>
  )
}

// ============================================================
// TESTIMONIALS
// ============================================================

function TestimonialsSection() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const t = setInterval(
      () => setCurrent((x) => (x + 1) % QUOTES.length),
      5500
    )
    return () => clearInterval(t)
  }, [])

  return (
    <section
      style={{
        backgroundColor: C.cream,
        padding: 'clamp(80px, 10vw, 140px) 0',
      }}
    >
      <Wrap max={760} style={{ textAlign: 'center' }}>
        <div
          style={{
            color: `${C.gold}40`,
            fontSize: 80,
            fontFamily: F.h,
            lineHeight: 0.8,
            marginBottom: 8,
            userSelect: 'none',
          }}
        >
          &ldquo;
        </div>

        <div style={{ position: 'relative', height: 180 }}>
          {QUOTES.map((q, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: i === current ? 1 : 0,
                transform:
                  i === current ? 'translateY(0)' : 'translateY(8px)',
                transition: 'all 0.9s ease',
              }}
            >
              <p
                style={{
                  fontFamily: F.h,
                  fontStyle: 'italic',
                  color: C.bg2,
                  fontSize: 'clamp(17px, 2.5vw, 23px)',
                  lineHeight: 1.6,
                  marginBottom: 18,
                }}
              >
                {q.text}
              </p>
              <p
                style={{
                  fontFamily: F.b,
                  fontSize: 11,
                  letterSpacing: 3,
                  textTransform: 'uppercase',
                  color: C.gm,
                }}
              >
                — {q.by}
              </p>
            </div>
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 10,
            marginTop: 28,
          }}
        >
          {QUOTES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                border: 'none',
                padding: 0,
                borderRadius: 3,
                width: i === current ? 22 : 6,
                height: 6,
                backgroundColor:
                  i === current ? C.gold : `${C.gm}40`,
                transition: 'all 0.5s ease',
              }}
            />
          ))}
        </div>

        <div style={{ marginTop: 'clamp(60px, 8vw, 90px)' }}>
          <FadeIn>
            <p
              style={{
                fontFamily: F.b,
                fontSize: 10,
                letterSpacing: 4,
                textTransform: 'uppercase',
                color: `${C.gm}66`,
                marginBottom: 28,
              }}
            >
              AS FEATURED IN
            </p>
          </FadeIn>
          <FadeIn delay={200}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 'clamp(16px, 3vw, 44px)',
                flexWrap: 'wrap',
              }}
            >
              {[
                'CONDÉ NAST',
                'MONOCLE',
                'WALLPAPER*',
                'DEPARTURES',
                'ROBB REPORT',
              ].map((name) => (
                <span
                  key={name}
                  style={{
                    fontFamily: F.h,
                    color: `${C.bg2}33`,
                    fontSize: 14,
                    letterSpacing: 3,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {name}
                </span>
              ))}
            </div>
          </FadeIn>
        </div>
      </Wrap>
    </section>
  )
}

// ============================================================
// BOOKING
// ============================================================

function BookingSection() {
  const [form, setForm] = useState({
    checkIn: '',
    checkOut: '',
    suite: '',
    guests: '',
    email: '',
  })
  const [sent, setSent] = useState(false)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => setSent(false), 3000)
  }

  const inputStyle: CSSProperties = {
    width: '100%',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: `1px solid ${C.gm}4D`,
    padding: '10px 0',
    fontFamily: F.b,
    fontWeight: 300,
    fontSize: 14,
    color: C.bg2,
    outline: 'none',
  }

  const labelStyle: CSSProperties = {
    display: 'block',
    fontFamily: F.b,
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: `${C.gm}B3`,
    marginBottom: 6,
  }

  return (
    <section
      id="book"
      style={{
        padding: 'clamp(80px, 10vw, 140px) 0',
        background:
          'linear-gradient(180deg, #F0E8D8, #EDE4D4, #F0E8D8)',
      }}
    >
      <Wrap max={560} style={{ textAlign: 'center' }}>
        <FadeIn>
          <p
            style={{
              fontFamily: F.b,
              fontSize: 9,
              letterSpacing: 5,
              textTransform: 'uppercase',
              color: `${C.gm}80`,
              marginBottom: 14,
            }}
          >
            CHAPTER FIVE
          </p>
          <h2
            style={{
              fontFamily: F.h,
              color: C.bg2,
              fontSize: 'clamp(24px, 4vw, 38px)',
              marginBottom: 10,
            }}
          >
            Begin Your Journey
          </h2>
        </FadeIn>
        <FadeIn delay={150}>
          <p
            style={{
              fontFamily: F.b,
              fontWeight: 300,
              color: `${C.brown}B3`,
              fontSize: 13,
              letterSpacing: 2,
              marginBottom: 50,
            }}
          >
            Book direct for the best rate guaranteed
          </p>
        </FadeIn>

        <FadeIn delay={300}>
          <form onSubmit={submit} style={{ textAlign: 'left' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 24,
              }}
            >
              <div>
                <label style={labelStyle}>Check-in</label>
                <input
                  type="date"
                  value={form.checkIn}
                  onChange={(e) =>
                    setForm({ ...form, checkIn: e.target.value })
                  }
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Check-out</label>
                <input
                  type="date"
                  value={form.checkOut}
                  onChange={(e) =>
                    setForm({ ...form, checkOut: e.target.value })
                  }
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Suite</label>
                <select
                  value={form.suite}
                  onChange={(e) =>
                    setForm({ ...form, suite: e.target.value })
                  }
                  style={inputStyle}
                  required
                >
                  <option value="">Select</option>
                  {SUITES.map((s) => (
                    <option key={s.name} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Guests</label>
                <select
                  value={form.guests}
                  onChange={(e) =>
                    setForm({ ...form, guests: e.target.value })
                  }
                  style={inputStyle}
                  required
                >
                  <option value="">Select</option>
                  {[1, 2, 3, 4].map((n) => (
                    <option key={n} value={n}>
                      {n} Guest{n > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ marginTop: 24 }}>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                style={inputStyle}
                required
              />
            </div>
            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <button
                type="submit"
                style={{
                  backgroundColor: C.terra,
                  color: C.cream,
                  border: 'none',
                  fontFamily: F.b,
                  fontSize: 12,
                  letterSpacing: 3,
                  textTransform: 'uppercase',
                  padding: '14px 52px',
                  transition: 'background 0.3s',
                }}
              >
                {sent ? 'Thank You ✓' : 'Reserve'}
              </button>
            </div>
          </form>
        </FadeIn>

        <FadeIn delay={500}>
          <div style={{ marginTop: 44, paddingTop: 28 }}>
            <DiamondSep />
            <p
              style={{
                fontFamily: F.b,
                fontWeight: 300,
                color: `${C.brown}99`,
                fontSize: 12,
                marginTop: 22,
                marginBottom: 10,
              }}
            >
              Or contact us directly
            </p>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 18,
                flexWrap: 'wrap',
              }}
            >
              <a
                href="mailto:reservations@thesevensaints.com"
                style={{ fontFamily: F.b, fontSize: 12, color: C.gm }}
              >
                reservations@thesevensaints.com
              </a>
              <span style={{ color: `${C.gm}4D` }}>|</span>
              <a
                href="https://wa.me/212661370050"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontFamily: F.b, fontSize: 12, color: C.gm }}
              >
                WhatsApp
              </a>
            </div>
          </div>
        </FadeIn>
      </Wrap>
    </section>
  )
}

// ============================================================
// LOCATION
// ============================================================

function LocationSection() {
  return (
    <section
      style={{
        position: 'relative',
        backgroundColor: C.bg,
        padding: 'clamp(80px, 10vw, 140px) 0',
        overflow: 'hidden',
      }}
    >
      <Stars count={16} />

      <Wrap style={{ position: 'relative', zIndex: 10 }}>
        <SectionTitle chapter="FIND US" title="Where the Atlas Meets the Desert" light />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'clamp(30px, 4vw, 60px)',
            alignItems: 'center',
          }}
        >
          {/* Text */}
          <div>
            <FadeIn>
              <p
                style={{
                  fontFamily: F.b,
                  fontWeight: 300,
                  color: `${C.cream}BF`,
                  fontSize: 15,
                  lineHeight: 2,
                  marginBottom: 28,
                }}
              >
                40 minutes from the Marrakech Medina. A world away from
                everything else.
              </p>
            </FadeIn>
            <FadeIn delay={200}>
              <div
                style={{
                  fontFamily: F.b,
                  fontWeight: 300,
                  color: `${C.cream}8C`,
                  fontSize: 13,
                  lineHeight: 1.9,
                }}
              >
                {[
                  {
                    label: 'From Marrakech',
                    text: '40-minute scenic drive through the Agafay plateau.',
                  },
                  {
                    label: 'From Airport',
                    text: 'Marrakech Menara (RAK) — 50-minute transfer included.',
                  },
                  {
                    label: 'Coordinates',
                    text: '31.4°N, 8.2°W — Agafay Stone Dunes',
                  },
                ].map((item) => (
                  <div key={item.label} style={{ marginBottom: 18 }}>
                    <span
                      style={{
                        display: 'block',
                        color: `${C.gm}99`,
                        fontSize: 10,
                        letterSpacing: 3,
                        textTransform: 'uppercase',
                        marginBottom: 4,
                      }}
                    >
                      {item.label}
                    </span>
                    {item.text}
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>

          {/* Image */}
          <FadeIn delay={300}>
            <Img src={I.loc} alt="Agafay Desert" height="450px" />
          </FadeIn>
        </div>
      </Wrap>
    </section>
  )
}

// ============================================================
// FOOTER
// ============================================================

function FooterSection() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSub = (e: FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  return (
    <footer
      style={{
        backgroundColor: C.bg,
        padding: 'clamp(60px, 8vw, 90px) 0',
        borderTop: `1px solid ${C.gold}14`,
      }}
    >
      <Wrap max={1180}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <div
            style={{
              fontSize: 26,
              color: C.gold,
              opacity: 0.3,
              marginBottom: 10,
            }}
          >
            ✦
          </div>
          <h3
            style={{
              fontFamily: F.h,
              color: `${C.gold}59`,
              fontSize: 13,
              letterSpacing: 8,
              textTransform: 'uppercase',
            }}
          >
            THE SEVEN SAINTS
          </h3>
        </div>

        {/* Links */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 36,
            textAlign: 'center',
            marginBottom: 50,
          }}
        >
          <div>
            <h4
              style={{
                fontFamily: F.b,
                fontSize: 10,
                letterSpacing: 3,
                textTransform: 'uppercase',
                color: `${C.gm}66`,
                marginBottom: 18,
              }}
            >
              Contact
            </h4>
            <a
              href="mailto:reservations@thesevensaints.com"
              style={{
                display: 'block',
                fontFamily: F.b,
                fontWeight: 300,
                color: `${C.cream}66`,
                fontSize: 12,
                marginBottom: 8,
              }}
            >
              reservations@thesevensaints.com
            </a>
            <a
              href="tel:+212661370050"
              style={{
                display: 'block',
                fontFamily: F.b,
                fontWeight: 300,
                color: `${C.cream}66`,
                fontSize: 12,
                marginBottom: 8,
              }}
            >
              +212 661 370 050
            </a>
            <a
              href="https://wa.me/212661370050"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block',
                fontFamily: F.b,
                fontWeight: 300,
                color: `${C.cream}66`,
                fontSize: 12,
              }}
            >
              WhatsApp
            </a>
          </div>
          <div>
            <h4
              style={{
                fontFamily: F.b,
                fontSize: 10,
                letterSpacing: 3,
                textTransform: 'uppercase',
                color: `${C.gm}66`,
                marginBottom: 18,
              }}
            >
              Explore
            </h4>
            {NAV_ITEMS.map((item) => (
              <button
                key={item}
                onClick={() =>
                  document
                    .getElementById(item.toLowerCase())
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
                style={{
                  display: 'block',
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  fontFamily: F.b,
                  fontWeight: 300,
                  color: `${C.cream}66`,
                  fontSize: 12,
                  marginBottom: 8,
                }}
              >
                {item}
              </button>
            ))}
          </div>
          <div>
            <h4
              style={{
                fontFamily: F.b,
                fontSize: 10,
                letterSpacing: 3,
                textTransform: 'uppercase',
                color: `${C.gm}66`,
                marginBottom: 18,
              }}
            >
              Follow
            </h4>
            {['Instagram', 'Facebook', 'TikTok'].map((name) => (
              <a
                key={name}
                href="#"
                style={{
                  display: 'block',
                  fontFamily: F.b,
                  fontWeight: 300,
                  color: `${C.cream}59`,
                  fontSize: 12,
                  marginBottom: 8,
                }}
              >
                {name}
              </a>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div
          style={{
            maxWidth: 360,
            margin: '0 auto 44px',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              fontFamily: F.b,
              fontSize: 9,
              letterSpacing: 3,
              textTransform: 'uppercase',
              color: `${C.gm}59`,
              marginBottom: 10,
            }}
          >
            Newsletter
          </p>
          <form
            onSubmit={handleSub}
            style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}
          >
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: `1px solid ${C.gold}26`,
                padding: '8px 0',
                fontFamily: F.b,
                fontWeight: 300,
                fontSize: 12,
                color: `${C.cream}99`,
                outline: 'none',
              }}
              required
            />
            <button
              type="submit"
              style={{
                background: 'none',
                border: 'none',
                fontFamily: F.b,
                fontSize: 16,
                color: `${C.gm}66`,
                paddingBottom: 8,
              }}
            >
              {subscribed ? '✓' : '→'}
            </button>
          </form>
        </div>

        {/* Copyright */}
        <div
          style={{
            textAlign: 'center',
            paddingTop: 28,
            borderTop: `1px solid ${C.gold}0F`,
          }}
        >
          <p
            style={{
              fontFamily: F.b,
              fontWeight: 300,
              color: `${C.gm}4D`,
              fontSize: 10,
              letterSpacing: 2,
            }}
          >
            The Seven Saints Agafay — Marrakech, Morocco
          </p>
          <p
            style={{
              fontFamily: F.b,
              fontWeight: 300,
              color: `${C.gm}2E`,
              fontSize: 9,
              marginTop: 6,
            }}
          >
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </Wrap>
    </footer>
  )
}

// ============================================================
// APP
// ============================================================

export default function App() {
  const [ready, setReady] = useState(false)
  const handleComplete = useCallback(() => setReady(true), [])

  // Inject CSS once
  useEffect(() => {
    const id = 'seven-saints-css'
    if (!document.getElementById(id)) {
      const el = document.createElement('style')
      el.id = id
      el.textContent = GLOBAL_CSS
      document.head.appendChild(el)
    }
  }, [])

  return (
    <>
      <LoadingScreen onComplete={handleComplete} />
      <ScrollProgress />
      <BackToTop />
      <Nav ready={ready} />
      <main>
        <Hero ready={ready} />
        <IntroSection />
        <ExperienceSection />
        <SuitesSection />
        <DiningSection />
        <StorySection />
        <TestimonialsSection />
        <BookingSection />
        <LocationSection />
      </main>
      <FooterSection />
    </>
  )
}
