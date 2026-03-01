import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import type { ReactNode, CSSProperties, FormEvent } from 'react'

const P = 'https://picsum.photos'
const I = {
  h1: `${P}/id/240/1920/1080`,
  h2: `${P}/id/164/1920/1080`,
  h3: `${P}/id/169/1920/1080`,
  tent: `${P}/id/225/1200/800`,
  pool: `${P}/id/164/1200/1600`,
  camels: `${P}/id/219/1200/1600`,
  dinner: `${P}/id/292/1200/800`,
  pano: `${P}/id/258/1920/700`,
  f1: `${P}/id/312/800/1000`,
  f2: `${P}/id/292/800/1000`,
  f3: `${P}/id/326/800/1000`,
  dusk: `${P}/id/184/1920/700`,
  s1: `${P}/id/164/1200/900`,
  s2: `${P}/id/225/1200/900`,
  s3: `${P}/id/237/1200/900`,
  loc: `${P}/id/240/1200/900`,
  gd: `${P}/id/431/1200/500`,
}

const HERO_SLIDES = [I.h1, I.h2, I.h3]

const SUITES_DATA = [
  { name: 'The Atlas Pavilion', desc: 'A sanctuary of hand-woven textiles and desert light, with panoramic views of the Atlas Mountains from your private terrace.', price: 'From $850 / night', image: I.s1 },
  { name: 'The Nomad Suite', desc: 'Inspired by the Berber caravans that once crossed these dunes, with an open-air bathing courtyard beneath the stars.', price: 'From $1,200 / night', image: I.s2 },
  { name: 'The Saint\u2019s Retreat', desc: 'Our most private residence with a plunge pool and 360-degree desert views from the highest dune.', price: 'From $2,400 / night', image: I.s3 },
]

const QUOTES = [
  { text: 'A place where time dissolves and the desert speaks. The Seven Saints is not a hotel \u2014 it is an awakening.', by: 'Cond\u00e9 Nast Traveller' },
  { text: 'The most extraordinary desert experience in North Africa. Every detail whispers ancient luxury.', by: 'Monocle Magazine' },
  { text: 'We arrived as guests and left transformed. The silence, the stars, the sacred hospitality.', by: 'Alexandra & James, London' },
]

const NAV = ['Experience', 'Suites', 'Dining', 'Story', 'Book']
const cc = { bg: '#1A1714', bg2: '#2C2825', cream: '#F5F0E8', gold: '#C9A96E', gm: '#B8A080', terra: '#C4785B', brown: '#5A4E42' }
const ff = { h: "'Cormorant Garamond', serif", b: "'Montserrat', sans-serif" }

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Montserrat:wght@200;300;400;500&display=swap');
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{font-family:${ff.b};background:${cc.bg};color:${cc.cream};overflow-x:hidden}
img{display:block;max-width:100%}
button{cursor:pointer}
a{text-decoration:none}
@keyframes twinkle{0%,100%{opacity:.05}50%{opacity:.8}}
@keyframes kb1{0%{transform:scale(1) translate(0,0)}100%{transform:scale(1.18) translate(-1.5%,-1%)}}
@keyframes kb2{0%{transform:scale(1.1) translate(1%,0)}100%{transform:scale(1) translate(-1%,1%)}}
@keyframes kb3{0%{transform:scale(1) translate(0,1%)}100%{transform:scale(1.15) translate(1%,-1%)}}
@keyframes scrollBounce{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(10px)}}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes sandFloat{0%{transform:translateX(-10px) translateY(0);opacity:0}10%{opacity:.12}90%{opacity:.06}100%{transform:translateX(100vw) translateY(-20px);opacity:0}}
.grid-exp{display:grid;grid-template-columns:1fr;gap:clamp(12px,2vw,22px)}
.grid-food{display:grid;grid-template-columns:1fr;gap:clamp(12px,2vw,18px)}
.grid-form{display:grid;grid-template-columns:1fr;gap:24px}
.grid-footer{display:grid;grid-template-columns:1fr;gap:36px;text-align:center;margin-bottom:50px}
.suite-row{display:flex;flex-direction:column;gap:clamp(28px,4vw,52px);align-items:center}
.suite-img{width:100%}.suite-txt{width:100%;text-align:center}
.suite-line{margin:0 auto 22px}
.loc-wrap{display:flex;flex-direction:column;gap:clamp(36px,5vw,60px);align-items:center}
.loc-text{width:100%;text-align:center}.loc-img{width:100%}
.nav-desktop{display:flex;align-items:center;gap:clamp(20px,3vw,36px)}
.nav-mobile{display:none!important}
.brand-label{}
@media(max-width:767px){.nav-desktop{display:none!important}.nav-mobile{display:block!important}.brand-label{display:none}}
@media(min-width:640px){.grid-food{grid-template-columns:repeat(3,1fr)}.grid-form{grid-template-columns:1fr 1fr}}
@media(min-width:768px){.grid-exp{grid-template-columns:7fr 5fr}.exp-main{grid-column:1}.exp-side{grid-column:2}.exp-side2{grid-column:1}.exp-main2{grid-column:2}.grid-footer{grid-template-columns:repeat(3,1fr)}}
@media(min-width:1024px){.suite-even{flex-direction:row}.suite-odd{flex-direction:row-reverse}.suite-img{width:58%}.suite-txt{width:42%;text-align:left}.suite-line{margin:0 0 22px}.loc-wrap{flex-direction:row}.loc-text{width:42%;text-align:left}.loc-img{width:58%}}
`

function useVisible(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setVis(true); observer.disconnect() } }, { threshold })
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])
  return { ref, vis }
}

function useScroll() {
  const [scrollY, setScrollY] = useState(0)
  useEffect(() => {
    const handler = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])
  return scrollY
}

function Photo({ src, alt, style }: { src: string; alt: string; style?: CSSProperties }) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: `linear-gradient(135deg, ${cc.bg}, ${cc.bg2})`, overflow: 'hidden' }}>
      {error ? (
        <div style={{ width: '100%', height: '100%', minHeight: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: cc.gold, opacity: 0.2, fontSize: 32 }}>✦</span>
        </div>
      ) : (
        <img src={src} alt={alt} loading="lazy" onLoad={() => setLoaded(true)} onError={() => setError(true)}
          style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', opacity: loaded ? 1 : 0, transition: 'opacity 0.6s ease', ...style }} />
      )}
    </div>
  )
}

function AspectBox({ ratio, children }: { ratio: string; children: ReactNode }) {
  return <div style={{ aspectRatio: ratio, overflow: 'hidden', width: '100%' }}>{children}</div>
}

function FadeIn({ children, delay = 0, threshold = 0.15 }: { children: ReactNode; delay?: number; threshold?: number }) {
  const { ref, vis } = useVisible(threshold)
  return (
    <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(30px)', transition: `opacity 0.8s ease ${delay}ms, transform 0.8s ease ${delay}ms` }}>
      {children}
    </div>
  )
}

function RevealImage({ src, alt, ratio = '4/3', direction = 'left', delay = 0 }: { src: string; alt: string; ratio?: string; direction?: string; delay?: number }) {
  const { ref, vis } = useVisible(0.08)
  const clipFrom = direction === 'right' ? 'inset(0 100% 0 0)' : direction === 'up' ? 'inset(100% 0 0 0)' : 'inset(0 0 0 100%)'
  return (
    <div ref={ref} style={{ overflow: 'hidden', clipPath: vis ? 'inset(0 0 0 0)' : clipFrom, transition: `clip-path 1.2s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}ms` }}>
      <AspectBox ratio={ratio}>
        <div style={{ width: '100%', height: '100%', transform: vis ? 'scale(1)' : 'scale(1.12)', transition: 'transform 1.8s ease' }}>
          <Photo src={src} alt={alt} />
        </div>
      </AspectBox>
    </div>
  )
}

function GoldLine({ visible, width = 60, delay = 0 }: { visible: boolean; width?: number; delay?: number }) {
  return <div style={{ height: 1, margin: '0 auto', width: visible ? width : 0, background: `linear-gradient(90deg, transparent, ${cc.gold}, transparent)`, transition: `width 1s ease ${delay}ms` }} />
}

function DiamondSep() {
  const { ref, vis } = useVisible(0.5)
  return (
    <div ref={ref} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '16px 0' }}>
      <div style={{ height: 1, background: `linear-gradient(270deg, ${cc.gold}80, transparent)`, width: vis ? 50 : 0, transition: 'width 1s ease 0.2s' }} />
      <div style={{ width: 8, height: 8, border: `1px solid ${cc.gold}`, transform: vis ? 'rotate(45deg) scale(1)' : 'rotate(45deg) scale(0)', opacity: vis ? 0.6 : 0, transition: 'all 1s ease 0.4s' }} />
      <div style={{ height: 1, background: `linear-gradient(90deg, ${cc.gold}80, transparent)`, width: vis ? 50 : 0, transition: 'width 1s ease 0.2s' }} />
    </div>
  )
}

function AnimText({ text, show, delay = 0, style }: { text: string; show: boolean; delay?: number; style?: CSSProperties }) {
  return (
    <span style={style} aria-label={text}>
      {text.split('').map((char, i) => (
        <span key={i} style={{ display: 'inline-block', opacity: show ? 1 : 0, transform: show ? 'translateY(0)' : 'translateY(25px)', transition: `all 0.5s ease ${delay + i * 45}ms` }}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  )
}

function Stars({ count = 30 }: { count?: number }) {
  const stars = useMemo(() => Array.from({ length: count }, (_, i) => ({ i, sz: Math.random() * 2.5 + 0.5, t: Math.random() * 85 + 5, l: Math.random() * 95 + 2, du: Math.random() * 4 + 2, de: Math.random() * 8 })), [count])
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {stars.map(s => <div key={s.i} style={{ position: 'absolute', width: s.sz, height: s.sz, borderRadius: '50%', top: `${s.t}%`, left: `${s.l}%`, backgroundColor: cc.gold, animation: `twinkle ${s.du}s ease-in-out ${s.de}s infinite` }} />)}
    </div>
  )
}

function SandParticles() {
  const particles = useMemo(() => Array.from({ length: 15 }, (_, i) => ({ i, sz: Math.random() * 3 + 1, t: Math.random() * 80 + 5, du: Math.random() * 14 + 14, de: Math.random() * 20 })), [])
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 2 }}>
      {particles.map(p => <div key={p.i} style={{ position: 'absolute', width: p.sz, height: p.sz, borderRadius: '50%', top: `${p.t}%`, left: '-10px', backgroundColor: `${cc.gold}60`, animation: `sandFloat ${p.du}s linear ${p.de}s infinite` }} />)}
    </div>
  )
}

function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0)
  useEffect(() => {
    const t = [setTimeout(() => setPhase(1), 300), setTimeout(() => setPhase(2), 1200), setTimeout(() => setPhase(3), 2200), setTimeout(() => setPhase(4), 3400), setTimeout(() => { setPhase(5); onComplete() }, 4200)]
    return () => t.forEach(clearTimeout)
  }, [onComplete])
  if (phase === 5) return null
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: cc.bg, transform: phase >= 4 ? 'translateY(-100%)' : 'translateY(0)', transition: 'transform 1.2s cubic-bezier(0.77,0,0.175,1)' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 70%, rgba(196,120,91,0.06), transparent 60%)', opacity: phase >= 2 ? 1 : 0, transition: 'opacity 2s' }} />
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
        <p style={{ fontFamily: ff.b, fontSize: 10, letterSpacing: 6, textTransform: 'uppercase', color: `${cc.gm}70`, marginBottom: 28, opacity: phase >= 2 ? 1 : 0, transition: 'opacity 1s' }}>Agafay Desert · Marrakech</p>
        <div style={{ opacity: phase >= 1 ? 1 : 0, transform: phase >= 1 ? 'scale(1)' : 'scale(0.8)', transition: 'all 1.4s ease' }}>
          <div style={{ fontSize: 44, color: cc.gold, opacity: 0.5, marginBottom: 14 }}>✦</div>
          <h1 style={{ fontFamily: ff.h, fontSize: 'clamp(18px,3vw,26px)', letterSpacing: 10, textTransform: 'uppercase', color: cc.gold, textShadow: `0 0 40px ${cc.gold}30` }}>THE SEVEN SAINTS</h1>
        </div>
        <div style={{ height: 1, margin: '22px auto 0', width: phase >= 2 ? 100 : 0, background: `linear-gradient(90deg, transparent, ${cc.terra}80, ${cc.gold}, ${cc.terra}80, transparent)`, transition: 'width 1.4s ease' }} />
        <p style={{ fontFamily: ff.b, fontSize: 10, letterSpacing: 5, textTransform: 'uppercase', color: `${cc.cream}30`, marginTop: 24, opacity: phase >= 3 ? 1 : 0, transition: 'opacity 1s ease 300ms' }}>Where earth meets sky</p>
      </div>
    </div>
  )
}

function Navigation({ ready }: { ready: boolean }) {
  const scrollY = useScroll()
  const isScrolled = scrollY > 80
  const [mobileOpen, setMobileOpen] = useState(false)
  const [prevY, setPrevY] = useState(0)
  const [isHidden, setIsHidden] = useState(false)
  useEffect(() => { setIsHidden(scrollY > 400 && scrollY > prevY); setPrevY(scrollY) }, [scrollY])
  const goTo = useCallback((id: string) => { setMobileOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }) }, [])
  const btnStyle: CSSProperties = { background: 'none', border: 'none', fontFamily: ff.b, fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: `${cc.cream}CC` }

  return (
    <>
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: isScrolled ? `${cc.bg}EB` : 'transparent', backdropFilter: isScrolled ? 'blur(16px)' : 'none', borderBottom: isScrolled ? `1px solid ${cc.gold}14` : '1px solid transparent', transform: isHidden ? 'translateY(-100%)' : 'translateY(0)', opacity: ready ? 1 : 0, transition: 'all 0.6s ease' }}>
        <div style={{ maxWidth: 1440, margin: '0 auto', padding: '0 clamp(16px,3vw,56px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 'clamp(56px,8vw,80px)' }}>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ ...btnStyle, display: 'flex', alignItems: 'center', gap: 8, color: cc.gold, letterSpacing: 5, fontSize: 12 }}>
            <span style={{ fontSize: 18, opacity: 0.7 }}>✦</span>
            <span className="brand-label">THE SEVEN SAINTS</span>
          </button>
          <div className="nav-desktop">
            {NAV.map(item => <button key={item} onClick={() => goTo(item.toLowerCase())} style={btnStyle} onMouseEnter={e => (e.currentTarget.style.color = cc.gold)} onMouseLeave={e => (e.currentTarget.style.color = `${cc.cream}CC`)}>{item}</button>)}
          </div>
          <button className="nav-mobile" onClick={() => setMobileOpen(true)} style={{ ...btnStyle, padding: 8 }} aria-label="Menu">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><line x1="3" y1="7" x2="21" y2="7" /><line x1="7" y1="12" x2="21" y2="12" /><line x1="3" y1="17" x2="21" y2="17" /></svg>
          </button>
        </div>
      </nav>
      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 60, background: `${cc.bg}FA`, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeUp 0.4s ease' }}>
          <Stars count={12} />
          <button onClick={() => setMobileOpen(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: `${cc.cream}99`, padding: 12 }} aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><line x1="4" y1="4" x2="20" y2="20" /><line x1="20" y1="4" x2="4" y2="20" /></svg>
          </button>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
            {NAV.map(item => <button key={item} onClick={() => goTo(item.toLowerCase())} style={{ background: 'none', border: 'none', fontFamily: ff.h, fontSize: 22, letterSpacing: 8, textTransform: 'uppercase', color: `${cc.cream}B3` }}>{item}</button>)}
          </div>
        </div>
      )}
    </>
  )
}

function ScrollProgress() {
  const scrollY = useScroll()
  const total = typeof document !== 'undefined' ? document.documentElement.scrollHeight - window.innerHeight : 1
  const percent = total > 0 ? (scrollY / total) * 100 : 0
  return <div style={{ position: 'fixed', top: 0, left: 0, height: 2, zIndex: 90, width: `${percent}%`, background: `linear-gradient(90deg, ${cc.terra}, ${cc.gold}, #E0C88A, ${cc.gold})`, boxShadow: `0 0 12px ${cc.gold}80` }} />
}

function BackToTopBtn() {
  const scrollY = useScroll()
  const show = scrollY > 800
  return (
    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top" style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 50, width: 44, height: 44, borderRadius: '50%', border: `1px solid ${cc.gold}4D`, background: `${cc.bg}CC`, backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: show ? 1 : 0, transform: show ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.5s ease', pointerEvents: show ? 'auto' : 'none' }}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={cc.gold} strokeWidth="1.5" strokeLinecap="round"><path d="M7 12V2M2 6l5-4 5 4" /></svg>
    </button>
  )
}

function HeroSection({ ready }: { ready: boolean }) {
  const scrollY = useScroll()
  const [currentSlide, setCurrentSlide] = useState(0)
  useEffect(() => { const t = setInterval(() => setCurrentSlide(s => (s + 1) % 3), 6000); return () => clearInterval(t) }, [])

  return (
    <section style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, transform: `translateY(${scrollY * 0.3}px)` }}>
        <div style={{ width: '100%', height: '130%', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${cc.bg}, #2A1808 30%, #4A3520 55%, ${cc.bg})` }} />
          {HERO_SLIDES.map((url, i) => (
            <div key={i} style={{ position: 'absolute', inset: 0, opacity: i === currentSlide ? 1 : 0, transition: 'opacity 2s ease-in-out' }}>
              <img src={url} alt="" loading={i === 0 ? 'eager' : 'lazy'} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.65) brightness(0.45) sepia(0.3) contrast(1.1)', animation: i === currentSlide ? `kb${(i % 3) + 1} 14s ease-in-out alternate infinite` : 'none' }} />
            </div>
          ))}
        </div>
      </div>
      <SandParticles />
      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, ${cc.bg}, ${cc.bg}33, transparent)` }} />
      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, ${cc.bg}55, transparent)` }} />
      <div style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 20px' }}>
        <div style={{ fontSize: 38, color: cc.gold, marginBottom: 16, opacity: ready ? 0.5 : 0, transform: ready ? 'scale(1)' : 'scale(0.5)', transition: 'all 1.2s ease 200ms', filter: `drop-shadow(0 0 30px ${cc.gold}40)` }}>✦</div>
        <h1><AnimText text="THE SEVEN SAINTS" show={ready} delay={400} style={{ fontFamily: ff.h, color: cc.cream, fontSize: 'clamp(30px,7vw,76px)', letterSpacing: 'clamp(6px,1.5vw,14px)', textTransform: 'uppercase', lineHeight: 1.1, textShadow: `0 0 60px ${cc.gold}25` }} /></h1>
        <div style={{ height: 1, margin: '24px auto 0', width: ready ? 100 : 0, background: `linear-gradient(90deg, transparent, ${cc.terra}80, ${cc.gold}, ${cc.terra}80, transparent)`, transition: 'width 1.2s ease 1800ms', boxShadow: `0 0 20px ${cc.gold}25` }} />
        <p style={{ fontFamily: ff.b, fontWeight: 300, color: `${cc.cream}BF`, fontSize: 'clamp(10px,1.5vw,13px)', letterSpacing: 'clamp(3px,0.8vw,6px)', textTransform: 'uppercase', marginTop: 22, opacity: ready ? 1 : 0, transition: 'all 1s ease 2200ms', textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}>At the summit of the Agafay dunes, Marrakech</p>
      </div>
      <div style={{ position: 'absolute', bottom: 36, left: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: ready ? 1 : 0, transition: 'opacity 1s ease 3s', animation: 'scrollBounce 2s ease-in-out infinite' }}>
        <p style={{ fontFamily: ff.b, fontSize: 8, letterSpacing: 4, textTransform: 'uppercase', color: `${cc.cream}40`, marginBottom: 10 }}>Scroll</p>
        <div style={{ width: 1, height: 36, background: `linear-gradient(to bottom, transparent, ${cc.gold}66, ${cc.gold}99)` }} />
      </div>
    </section>
  )
}

function IntroSection() {
  const { ref, vis } = useVisible(0.3)
  return (
    <section style={{ background: cc.cream, padding: 'clamp(80px,12vw,180px) 0' }}>
      <div ref={ref} style={{ maxWidth: 640, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
        <FadeIn><p style={{ fontFamily: ff.b, fontSize: 11, letterSpacing: 5, textTransform: 'uppercase', color: cc.gm, marginBottom: 24 }}>AGAFAY, MARRAKECH</p></FadeIn>
        <FadeIn delay={200}><h2 style={{ fontFamily: ff.h, color: cc.bg2, fontSize: 'clamp(24px,4vw,38px)', lineHeight: 1.4, marginBottom: 28 }}>Where Earth Meets Sky and Silence Becomes Ceremony</h2></FadeIn>
        <FadeIn delay={400}><p style={{ fontFamily: ff.b, fontWeight: 300, color: cc.brown, fontSize: 15, lineHeight: 2, marginBottom: 36 }}>Perched upon the ancient stone dunes of the Agafay desert, The Seven Saints is a sanctuary of silence, starlight, and Moroccan heritage. Here, the Atlas Mountains frame every horizon, and the rhythm of the desert replaces the pace of the world you left behind.</p></FadeIn>
        <FadeIn delay={600}><GoldLine visible={vis} delay={600} /></FadeIn>
      </div>
    </section>
  )
}

function ExperienceSection() {
  const { ref, vis } = useVisible(0.3)
  return (
    <section id="experience" style={{ position: 'relative', background: cc.bg, padding: 'clamp(80px,10vw,150px) 0', overflow: 'hidden' }}>
      <Stars count={20} />
      <div style={{ position: 'relative', zIndex: 10, maxWidth: 1380, margin: '0 auto', padding: '0 clamp(16px,3vw,48px)' }}>
        <div ref={ref} style={{ textAlign: 'center', marginBottom: 'clamp(50px,8vw,90px)' }}>
          <FadeIn><p style={{ fontFamily: ff.b, fontSize: 9, letterSpacing: 5, textTransform: 'uppercase', color: `${cc.gm}80`, marginBottom: 14 }}>CHAPTER ONE</p></FadeIn>
          <h2 style={{ fontFamily: ff.h, color: cc.gold, fontSize: 13, letterSpacing: 6, textTransform: 'uppercase', marginBottom: 18, textShadow: `0 0 30px ${cc.gold}30` }}><AnimText text="THE EXPERIENCE" show={vis} /></h2>
          <GoldLine visible={vis} delay={800} width={80} />
        </div>
        <div className="grid-exp">
          <div className="exp-main">
            <RevealImage src={I.tent} alt="Luxury tent interior" ratio="16/10" />
            <p style={{ fontFamily: ff.b, fontStyle: 'italic', fontWeight: 300, color: `${cc.cream}50`, fontSize: 12, letterSpacing: 2, marginTop: 10 }}>Handcrafted luxury, draped in desert warmth</p>
          </div>
          <div className="exp-side" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <RevealImage src={I.pool} alt="Infinity pool" ratio="3/4" direction="right" delay={200} />
          </div>
          <div style={{ gridColumn: '1 / -1', padding: 'clamp(20px,3vw,36px) 0', textAlign: 'center' }}><FadeIn><p style={{ fontFamily: ff.h, fontStyle: 'italic', color: `${cc.cream}40`, fontSize: 'clamp(15px,2vw,20px)', letterSpacing: 3 }}>where the dunes glow gold before nightfall</p></FadeIn></div>
          <div className="exp-side2"><RevealImage src={I.camels} alt="Camels at golden hour" ratio="3/4" delay={100} /></div>
          <div className="exp-main2">
            <RevealImage src={I.dinner} alt="Candlelit dinner" ratio="16/10" direction="right" delay={250} />
            <p style={{ fontFamily: ff.b, fontStyle: 'italic', fontWeight: 300, color: `${cc.cream}50`, fontSize: 12, letterSpacing: 2, marginTop: 10, textAlign: 'right' }}>Evenings woven with candlelight and conversation</p>
          </div>
          <div style={{ gridColumn: '1 / -1', padding: 'clamp(20px,3vw,36px) 0', textAlign: 'center' }}><FadeIn><p style={{ fontFamily: ff.h, fontStyle: 'italic', color: `${cc.cream}40`, fontSize: 'clamp(15px,2vw,20px)', letterSpacing: 3 }}>silence, starlight, and the ancient desert</p></FadeIn></div>
          <div style={{ gridColumn: '1 / -1' }}><RevealImage src={I.pano} alt="Desert panorama" ratio="21/8" direction="up" delay={150} /></div>
        </div>
      </div>
    </section>
  )
}

function SuitesSection() {
  return (
    <section id="suites" style={{ background: cc.cream, padding: 'clamp(80px,10vw,150px) 0' }}>
      <div style={{ maxWidth: 1380, margin: '0 auto', padding: '0 clamp(16px,3vw,48px)' }}>
        <FadeIn><div style={{ textAlign: 'center', marginBottom: 20 }}>
          <p style={{ fontFamily: ff.b, fontSize: 9, letterSpacing: 5, textTransform: 'uppercase', color: `${cc.gm}80`, marginBottom: 14 }}>CHAPTER TWO</p>
          <h2 style={{ fontFamily: ff.h, color: cc.bg2, fontSize: 'clamp(24px,4vw,38px)', letterSpacing: 4, textTransform: 'uppercase' }}>Suites & Tents</h2>
        </div></FadeIn>
        <FadeIn delay={200}><p style={{ fontFamily: ff.b, fontWeight: 300, color: `${cc.brown}B3`, fontSize: 14, textAlign: 'center', maxWidth: 480, margin: '0 auto clamp(60px,8vw,90px)', lineHeight: 1.8 }}>Each residence is a private sanctuary, designed to dissolve the boundary between shelter and sky.</p></FadeIn>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(70px,10vw,130px)' }}>
          {SUITES_DATA.map((suite, i) => (
            <div key={suite.name} className={`suite-row suite-${i % 2 === 0 ? 'even' : 'odd'}`}>
              <div className="suite-img"><RevealImage src={suite.image} alt={suite.name} direction={i % 2 === 0 ? 'left' : 'right'} /></div>
              <div className="suite-txt">
                <FadeIn delay={200}><div style={{ height: 1, width: 40, background: `${cc.gold}66`, marginBottom: 22 }} className="suite-line" /><h3 style={{ fontFamily: ff.h, color: cc.bg2, fontSize: 'clamp(22px,3vw,32px)', marginBottom: 18, lineHeight: 1.2 }}>{suite.name}</h3></FadeIn>
                <FadeIn delay={400}><p style={{ fontFamily: ff.b, fontWeight: 300, color: cc.brown, fontSize: 15, lineHeight: 2, marginBottom: 22, maxWidth: 400 }}>{suite.desc}</p></FadeIn>
                <FadeIn delay={600}><p style={{ fontFamily: ff.b, fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: cc.gm }}>{suite.price}</p></FadeIn>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function DiningSection() {
  return (
    <section id="dining">
      <div style={{ position: 'relative', height: '65vh', overflow: 'hidden' }}>
        <img src={I.dinner} alt="Desert dining" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.4) saturate(0.8)' }} />
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, ${cc.bg}B3, transparent, ${cc.bg}4D)` }} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 16px' }}>
          <FadeIn><p style={{ fontFamily: ff.b, fontSize: 9, letterSpacing: 5, textTransform: 'uppercase', color: `${cc.gm}80`, marginBottom: 18 }}>CHAPTER THREE</p></FadeIn>
          <FadeIn delay={200}><h2 style={{ fontFamily: ff.h, color: cc.cream, fontSize: 'clamp(28px,5vw,50px)', letterSpacing: 4, textTransform: 'uppercase', textShadow: `0 0 30px ${cc.gold}30` }}>Dine Beneath the Stars</h2></FadeIn>
          <FadeIn delay={400}><div style={{ height: 1, width: 60, margin: '22px auto 0', background: `linear-gradient(90deg, transparent, ${cc.gold}, transparent)` }} /></FadeIn>
        </div>
      </div>
      <div style={{ background: cc.cream, padding: 'clamp(60px,8vw,120px) 0' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 clamp(16px,3vw,48px)' }}>
          <div className="grid-food">
            <RevealImage src={I.f1} alt="Moroccan tagine" ratio="4/5" />
            <RevealImage src={I.f2} alt="Artisan dishes" ratio="4/5" direction="up" delay={200} />
            <RevealImage src={I.f3} alt="Desert cuisine" ratio="4/5" direction="right" delay={400} />
          </div>
          <FadeIn><p style={{ fontFamily: ff.b, fontWeight: 300, color: cc.brown, textAlign: 'center', fontSize: 15, lineHeight: 2, maxWidth: 560, margin: 'clamp(40px,6vw,60px) auto' }}>Moroccan heritage meets artisan craft. Every plate tells a story of the land — saffron from Taliouine, olive oil from the Atlas foothills, bread baked at dawn.</p></FadeIn>
          <RevealImage src={I.gd} alt="Guest dining" ratio="21/9" direction="up" />
        </div>
      </div>
    </section>
  )
}

function StorySection() {
  return (
    <section id="story" style={{ position: 'relative', background: cc.bg2, padding: 'clamp(80px,10vw,150px) 0', overflow: 'hidden' }}>
      <Stars count={40} />
      <div style={{ position: 'relative', zIndex: 10, maxWidth: 680, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
        <FadeIn>
          <p style={{ fontFamily: ff.b, fontSize: 9, letterSpacing: 5, textTransform: 'uppercase', color: `${cc.gm}80`, marginBottom: 10 }}>CHAPTER FOUR</p>
          <p style={{ fontFamily: ff.b, fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', color: cc.gm, marginBottom: 26 }}>OUR STORY</p>
        </FadeIn>
        <FadeIn delay={200}><h2 style={{ fontFamily: ff.h, color: cc.gold, fontSize: 'clamp(26px,4vw,42px)', lineHeight: 1.3, marginBottom: 36, textShadow: `0 0 30px ${cc.gold}30` }}>The Seven Saints of Marrakech</h2></FadeIn>
        <FadeIn delay={400}><p style={{ fontFamily: ff.b, fontWeight: 300, color: `${cc.cream}CC`, fontSize: 15, lineHeight: 2.1, marginBottom: 28 }}>For centuries, Marrakech has been watched over by its seven patron saints — the Sab'atou Rijal. These holy men, mystics and scholars, arrived from across the Islamic world and chose this red city as their home.</p></FadeIn>
        <FadeIn delay={600}><p style={{ fontFamily: ff.b, fontWeight: 300, color: `${cc.cream}CC`, fontSize: 15, lineHeight: 2.1, marginBottom: 28 }}>Their tombs became pilgrimage sites. Their teachings became the spiritual foundation of a city that has enchanted travelers for a thousand years.</p></FadeIn>
        <FadeIn delay={800}><p style={{ fontFamily: ff.b, fontWeight: 300, color: `${cc.cream}CC`, fontSize: 15, lineHeight: 2.1, marginBottom: 44 }}>The Seven Saints Agafay carries this legacy into the desert — where hospitality is not a service, but a sacred act.</p></FadeIn>
        <DiamondSep />
      </div>
      <div style={{ marginTop: 'clamp(60px,8vw,120px)' }}><RevealImage src={I.dusk} alt="Desert twilight" ratio="21/8" direction="up" /></div>
    </section>
  )
}

function TestimonialsSection() {
  const [current, setCurrent] = useState(0)
  useEffect(() => { const t = setInterval(() => setCurrent(x => (x + 1) % QUOTES.length), 5500); return () => clearInterval(t) }, [])
  return (
    <section style={{ background: cc.cream, padding: 'clamp(80px,10vw,140px) 0' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
        <FadeIn><div style={{ color: `${cc.gold}40`, fontSize: 80, fontFamily: ff.h, lineHeight: 0.8, marginBottom: 8, userSelect: 'none' }}>&ldquo;</div></FadeIn>
        <div style={{ position: 'relative', height: 180 }}>
          {QUOTES.map((quote, i) => (
            <div key={i} style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: i === current ? 1 : 0, transform: i === current ? 'translateY(0)' : 'translateY(8px)', transition: 'all 0.9s ease' }}>
              <p style={{ fontFamily: ff.h, fontStyle: 'italic', color: cc.bg2, fontSize: 'clamp(17px,2.5vw,23px)', lineHeight: 1.6, marginBottom: 18 }}>{quote.text}</p>
              <p style={{ fontFamily: ff.b, fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: cc.gm }}>— {quote.by}</p>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 28 }}>
          {QUOTES.map((_, i) => <button key={i} onClick={() => setCurrent(i)} aria-label={`Quote ${i + 1}`} style={{ border: 'none', padding: 0, borderRadius: 3, width: i === current ? 22 : 6, height: 6, backgroundColor: i === current ? cc.gold : `${cc.gm}40`, transition: 'all 0.5s ease' }} />)}
        </div>
        <div style={{ marginTop: 'clamp(60px,8vw,90px)' }}>
          <FadeIn><p style={{ fontFamily: ff.b, fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', color: `${cc.gm}66`, marginBottom: 28 }}>AS FEATURED IN</p></FadeIn>
          <FadeIn delay={200}><div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(16px,3vw,44px)', flexWrap: 'wrap' }}>
            {['CONDÉ NAST', 'MONOCLE', 'WALLPAPER*', 'DEPARTURES', 'ROBB REPORT'].map(name => <span key={name} style={{ fontFamily: ff.h, color: `${cc.bg2}33`, fontSize: 14, letterSpacing: 3, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{name}</span>)}
          </div></FadeIn>
        </div>
      </div>
    </section>
  )
}

function BookingSection() {
  const [formData, setFormData] = useState({ checkIn: '', checkOut: '', suite: '', guests: '', email: '' })
  const [submitted, setSubmitted] = useState(false)
  const handleSubmit = (e: FormEvent) => { e.preventDefault(); setSubmitted(true); setTimeout(() => setSubmitted(false), 3000) }
  const inputStyle: CSSProperties = { width: '100%', backgroundColor: 'transparent', border: 'none', borderBottom: `1px solid ${cc.gm}4D`, padding: '10px 0', fontFamily: ff.b, fontWeight: 300, fontSize: 14, color: cc.bg2, outline: 'none' }
  const labelStyle: CSSProperties = { display: 'block', fontFamily: ff.b, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: `${cc.gm}B3`, marginBottom: 6 }

  return (
    <section id="book" style={{ padding: 'clamp(80px,10vw,140px) 0', background: 'linear-gradient(180deg, #F0E8D8, #EDE4D4, #F0E8D8)' }}>
      <div style={{ maxWidth: 560, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
        <FadeIn>
          <p style={{ fontFamily: ff.b, fontSize: 9, letterSpacing: 5, textTransform: 'uppercase', color: `${cc.gm}80`, marginBottom: 14 }}>CHAPTER FIVE</p>
          <h2 style={{ fontFamily: ff.h, color: cc.bg2, fontSize: 'clamp(24px,4vw,38px)', marginBottom: 10 }}>Begin Your Journey</h2>
        </FadeIn>
        <FadeIn delay={150}><p style={{ fontFamily: ff.b, fontWeight: 300, color: `${cc.brown}B3`, fontSize: 13, letterSpacing: 2, marginBottom: 'clamp(44px,6vw,52px)' }}>Book direct for the best rate guaranteed</p></FadeIn>
        <FadeIn delay={300}>
          <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
            <div className="grid-form">
              <div><label style={labelStyle}>Check-in</label><input type="date" value={formData.checkIn} onChange={e => setFormData({ ...formData, checkIn: e.target.value })} style={inputStyle} required /></div>
              <div><label style={labelStyle}>Check-out</label><input type="date" value={formData.checkOut} onChange={e => setFormData({ ...formData, checkOut: e.target.value })} style={inputStyle} required /></div>
              <div><label style={labelStyle}>Suite</label><select value={formData.suite} onChange={e => setFormData({ ...formData, suite: e.target.value })} style={{ ...inputStyle, appearance: 'none' as const }} required><option value="">Select</option>{SUITES_DATA.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}</select></div>
              <div><label style={labelStyle}>Guests</label><select value={formData.guests} onChange={e => setFormData({ ...formData, guests: e.target.value })} style={{ ...inputStyle, appearance: 'none' as const }} required><option value="">Select</option>{[1, 2, 3, 4].map(n => <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>)}</select></div>
            </div>
            <div style={{ marginTop: 24 }}><label style={labelStyle}>Email</label><input type="email" placeholder="your@email.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} style={inputStyle} required /></div>
            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <button type="submit" style={{ backgroundColor: cc.terra, color: cc.cream, border: 'none', fontFamily: ff.b, fontSize: 12, letterSpacing: 3, textTransform: 'uppercase', padding: '14px 52px', transition: 'background 0.3s' }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#B06A4F')} onMouseLeave={e => (e.currentTarget.style.backgroundColor = cc.terra)}>{submitted ? 'Thank You ✓' : 'Reserve'}</button>
            </div>
          </form>
        </FadeIn>
        <FadeIn delay={500}>
          <div style={{ marginTop: 44, paddingTop: 28 }}>
            <DiamondSep />
            <p style={{ fontFamily: ff.b, fontWeight: 300, color: `${cc.brown}99`, fontSize: 12, marginTop: 22, marginBottom: 10 }}>Or contact us directly</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 18, flexWrap: 'wrap' }}>
              <a href="mailto:reservations@thesevensaints.com" style={{ fontFamily: ff.b, fontSize: 12, color: cc.gm }}>reservations@thesevensaints.com</a>
              <span style={{ color: `${cc.gm}4D` }}>|</span>
              <a href="https://wa.me/212661370050" target="_blank" rel="noopener noreferrer" style={{ fontFamily: ff.b, fontSize: 12, color: cc.gm }}>WhatsApp</a>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

function LocationSection() {
  return (
    <section style={{ position: 'relative', background: cc.bg, padding: 'clamp(80px,10vw,140px) 0', overflow: 'hidden' }}>
      <Stars count={16} />
      <div className="loc-wrap" style={{ position: 'relative', zIndex: 10, maxWidth: 1380, margin: '0 auto', padding: '0 clamp(16px,3vw,48px)' }}>
        <div className="loc-text">
          <FadeIn>
            <p style={{ fontFamily: ff.b, fontSize: 9, letterSpacing: 5, textTransform: 'uppercase', color: `${cc.gm}80`, marginBottom: 14 }}>FIND US</p>
            <h2 style={{ fontFamily: ff.h, color: cc.gold, fontSize: 'clamp(24px,3.5vw,36px)', marginBottom: 18, textShadow: `0 0 30px ${cc.gold}30` }}>Where the Atlas Meets the Desert</h2>
          </FadeIn>
          <FadeIn delay={200}><p style={{ fontFamily: ff.b, fontWeight: 300, color: `${cc.cream}BF`, fontSize: 15, lineHeight: 2, marginBottom: 28 }}>40 minutes from the Marrakech Medina. A world away from everything else.</p></FadeIn>
          <FadeIn delay={400}><div style={{ fontFamily: ff.b, fontWeight: 300, color: `${cc.cream}8C`, fontSize: 13, lineHeight: 1.9 }}>
            {[{ label: 'From Marrakech', text: '40-minute scenic drive through the Agafay plateau.' }, { label: 'From Airport', text: 'Marrakech Menara (RAK) — 50-minute transfer included.' }, { label: 'Coordinates', text: '31.4°N, 8.2°W — Agafay Stone Dunes' }].map(item => (
              <div key={item.label} style={{ marginBottom: 18 }}><span style={{ display: 'block', color: `${cc.gm}99`, fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 4 }}>{item.label}</span>{item.text}</div>
            ))}
          </div></FadeIn>
        </div>
        <div className="loc-img"><RevealImage src={I.loc} alt="Agafay Desert" direction="right" /></div>
      </div>
    </section>
  )
}

function FooterSection() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const handleSubscribe = (e: FormEvent) => { e.preventDefault(); if (email) { setSubscribed(true); setEmail(''); setTimeout(() => setSubscribed(false), 3000) } }

  return (
    <footer style={{ background: cc.bg, padding: 'clamp(60px,8vw,90px) 0', borderTop: `1px solid ${cc.gold}14` }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 clamp(20px,3vw,48px)' }}>
        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <div style={{ fontSize: 26, color: cc.gold, opacity: 0.3, marginBottom: 10 }}>✦</div>
          <h3 style={{ fontFamily: ff.h, color: `${cc.gold}59`, fontSize: 13, letterSpacing: 8, textTransform: 'uppercase' }}>THE SEVEN SAINTS</h3>
        </div>
        <div className="grid-footer">
          <div>
            <h4 style={{ fontFamily: ff.b, fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: `${cc.gm}66`, marginBottom: 18 }}>Contact</h4>
            <a href="mailto:reservations@thesevensaints.com" style={{ display: 'block', fontFamily: ff.b, fontWeight: 300, color: `${cc.cream}66`, fontSize: 12, marginBottom: 8 }}>reservations@thesevensaints.com</a>
            <a href="tel:+212661370050" style={{ display: 'block', fontFamily: ff.b, fontWeight: 300, color: `${cc.cream}66`, fontSize: 12, marginBottom: 8 }}>+212 661 370 050</a>
            <a href="https://wa.me/212661370050" target="_blank" rel="noopener noreferrer" style={{ display: 'block', fontFamily: ff.b, fontWeight: 300, color: `${cc.cream}66`, fontSize: 12 }}>WhatsApp</a>
          </div>
          <div>
            <h4 style={{ fontFamily: ff.b, fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: `${cc.gm}66`, marginBottom: 18 }}>Explore</h4>
            {NAV.map(item => <button key={item} onClick={() => document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })} style={{ display: 'block', width: '100%', background: 'none', border: 'none', fontFamily: ff.b, fontWeight: 300, color: `${cc.cream}66`, fontSize: 12, marginBottom: 8, textAlign: 'inherit' }}>{item}</button>)}
          </div>
          <div>
            <h4 style={{ fontFamily: ff.b, fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: `${cc.gm}66`, marginBottom: 18 }}>Follow</h4>
            {['Instagram', 'Facebook', 'TikTok'].map(name => <a key={name} href="#" style={{ display: 'block', fontFamily: ff.b, fontWeight: 300, color: `${cc.cream}59`, fontSize: 12, marginBottom: 8 }}>{name}</a>)}
          </div>
        </div>
        <div style={{ maxWidth: 360, margin: '44px auto', textAlign: 'center' }}>
          <p style={{ fontFamily: ff.b, fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: `${cc.gm}59`, marginBottom: 10 }}>Newsletter</p>
          <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
            <input type="email" placeholder="Your email" value={email} onChange={e => setEmail(e.target.value)} style={{ flex: 1, backgroundColor: 'transparent', border: 'none', borderBottom: `1px solid ${cc.gold}26`, padding: '8px 0', fontFamily: ff.b, fontWeight: 300, fontSize: 12, color: `${cc.cream}99`, outline: 'none' }} required />
            <button type="submit" style={{ background: 'none', border: 'none', fontFamily: ff.b, fontSize: 16, color: `${cc.gm}66`, paddingBottom: 8 }}>{subscribed ? '✓' : '→'}</button>
          </form>
        </div>
        <div style={{ textAlign: 'center', paddingTop: 28, borderTop: `1px solid ${cc.gold}0F` }}>
          <p style={{ fontFamily: ff.b, fontWeight: 300, color: `${cc.gm}4D`, fontSize: 10, letterSpacing: 2 }}>The Seven Saints Agafay — Marrakech, Morocco</p>
          <p style={{ fontFamily: ff.b, fontWeight: 300, color: `${cc.gm}2E`, fontSize: 9, marginTop: 6 }}>© {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  const [ready, setReady] = useState(false)
  const handleLoadingComplete = useCallback(() => setReady(true), [])

  useEffect(() => {
    const styleId = 'seven-saints-styles'
    if (!document.getElementById(styleId)) {
      const styleEl = document.createElement('style')
      styleEl.id = styleId
      styleEl.textContent = STYLES
      document.head.appendChild(styleEl)
    }
  }, [])

  return (
    <>
      <LoadingScreen onComplete={handleLoadingComplete} />
      <ScrollProgress />
      <BackToTopBtn />
      <Navigation ready={ready} />
      <main>
        <HeroSection ready={ready} />
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
