import { useState, useEffect, useRef, useCallback, useMemo, type ReactNode } from 'react';

// ============================================================
// CONSTANTS
// ============================================================

const LOGO_SRC = '/uploads/WhatsApp_Image_2026-03-01_at_1.35.39_PM-removebg-preview.png';

// Multiple video sources from different providers — tries sequentially until one works
const DESERT_VIDEO_URLS = [
  // Mixkit free stock videos (desert/sand dunes)
  'https://assets.mixkit.co/videos/preview/mixkit-sand-dunes-during-golden-hour-4109-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-white-sand-dunes-and-a-blue-sky-4783-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-sand-dunes-in-a-desert-49740-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-sandy-desert-dune-4108-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-dry-desert-land-4797-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-wind-blowing-sand-across-a-sand-dune-50654-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-desert-at-sunset-seen-from-inside-a-cave-50649-large.mp4',
  // Pexels — various resolution/fps format attempts
  'https://videos.pexels.com/video-files/854224/854224-hd_1920_1080_25fps.mp4',
  'https://videos.pexels.com/video-files/854224/854224-hd_1280_720_25fps.mp4',
  'https://videos.pexels.com/video-files/856973/856973-hd_1920_1080_30fps.mp4',
  'https://videos.pexels.com/video-files/856973/856973-hd_1280_720_30fps.mp4',
  'https://videos.pexels.com/video-files/857251/857251-hd_1920_1080_25fps.mp4',
  'https://videos.pexels.com/video-files/857251/857251-hd_1280_720_25fps.mp4',
  'https://videos.pexels.com/video-files/2166695/2166695-hd_1920_1080_24fps.mp4',
  'https://videos.pexels.com/video-files/3571551/3571551-uhd_2560_1440_25fps.mp4',
  'https://videos.pexels.com/video-files/3571551/3571551-hd_1920_1080_25fps.mp4',
  'https://videos.pexels.com/video-files/2491278/2491278-uhd_2560_1440_24fps.mp4',
  'https://videos.pexels.com/video-files/2491278/2491278-hd_1920_1080_24fps.mp4',
];

// Ken Burns slideshow images — GUARANTEED to load from Unsplash
const DESERT_SLIDESHOW_IMAGES = [
https://images.unsplash.com/photo-1568801556940-e5b3a55fa6ea?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D  'https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1504261521163-3e1c5fa0e654?auto=format&fit=crop&w=1920&q=80',
];

const IMAGES = {
  tentInterior: 'https://images.unsplash.com/photo-1595521624992-48a59aef95e3?auto=format&fit=crop&w=1200&q=80',
  pool: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
  camels: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&w=1200&q=80',
  candleDinner: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80',
  desertPanorama: 'https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=1920&q=85',
  food1: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=800&q=80',
  food2: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
  food3: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
  campTwilight: 'https://images.unsplash.com/photo-1455734729978-db1ae4f687fc?auto=format&fit=crop&w=1920&q=80',
  suite1: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
  suite2: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
  suite3: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
  diningHero: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1920&q=80',
  location: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&w=1200&q=80',
  guestDining: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80',
};

const TESTIMONIALS = [
  {
    text: 'A place where time dissolves and the desert speaks. The Seven Saints is not a hotel \u2014 it is an awakening.',
    author: 'Cond\u00e9 Nast Traveller',
  },
  {
    text: 'The most extraordinary desert experience in North Africa. Every detail whispers ancient luxury.',
    author: 'Monocle Magazine',
  },
  {
    text: 'We arrived as guests and left transformed. The silence, the stars, the sacred hospitality \u2014 nothing compares.',
    author: 'Alexandra & James, London',
  },
];

const SUITES = [
  {
    name: 'The Atlas Pavilion',
    description:
      'A sanctuary of hand-woven textiles and desert light, with panoramic views of the Atlas Mountains from your private terrace.',
    price: 'From $850 per night',
    image: IMAGES.suite1,
  },
  {
    name: 'The Nomad Suite',
    description:
      'Inspired by the Berber caravans that once crossed these dunes, with an open-air bathing courtyard beneath the stars.',
    price: 'From $1,200 per night',
    image: IMAGES.suite2,
  },
  {
    name: 'The Saint\u2019s Retreat',
    description:
      'Our most private residence, nestled at the highest point of the dunes, with a plunge pool and 360-degree desert views.',
    price: 'From $2,400 per night',
    image: IMAGES.suite3,
  },
];

const NAV_LINKS = ['Experience', 'Suites', 'Dining', 'Story', 'Book'];

// ============================================================
// HOOKS
// ============================================================

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setIsInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, isInView };
}

function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const h = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? window.scrollY / total : 0);
    };
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);
  return progress;
}

function useScrollDirection() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  useEffect(() => {
    const h = () => {
      const y = window.scrollY;
      setScrolled(y > 80);
      setHidden(y > 400 && y > lastY.current);
      lastY.current = y;
    };
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);
  return { scrolled, hidden };
}

/**
 * Robust video loader — tries each URL sequentially with timeout.
 * Returns the video ref and whether a video successfully loaded.
 */
function useDesertVideo(urls: string[]) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);
  const cancelledRef = useRef(false);
  const urlsRef = useRef(urls);

  useEffect(() => {
    cancelledRef.current = false;
    const video = videoRef.current;
    if (!video || urlsRef.current.length === 0) return;

    let timeoutId: ReturnType<typeof setTimeout>;

    const tryUrl = (index: number) => {
      if (cancelledRef.current || index >= urlsRef.current.length) return;

      const url = urlsRef.current[index];
      const v = videoRef.current;
      if (!v) return;

      const cleanup = () => {
        clearTimeout(timeoutId);
        v.removeEventListener('canplaythrough', onCanPlay);
        v.removeEventListener('error', onError);
      };

      const onCanPlay = () => {
        cleanup();
        if (!cancelledRef.current) {
          setLoaded(true);
          v.play().catch(() => {});
        }
      };

      const onError = () => {
        cleanup();
        if (!cancelledRef.current) tryUrl(index + 1);
      };

      v.addEventListener('canplaythrough', onCanPlay, { once: true });
      v.addEventListener('error', onError, { once: true });

      // Timeout: if this URL takes too long, try next
      timeoutId = setTimeout(() => {
        v.removeEventListener('canplaythrough', onCanPlay);
        v.removeEventListener('error', onError);
        if (!cancelledRef.current) tryUrl(index + 1);
      }, 6000);

      v.src = url;
      v.load();
    };

    tryUrl(0);

    return () => {
      cancelledRef.current = true;
      clearTimeout(timeoutId);
    };
  }, []);

  return { videoRef, loaded };
}

// ============================================================
// ANIMATION COMPONENTS
// ============================================================

function AnimatedLetters({ text, isVisible, className = '', delay = 0 }: {
  text: string; isVisible: boolean; className?: string; delay?: number;
}) {
  return (
    <span className={className} aria-label={text}>
      {text.split('').map((c, i) => (
        <span key={i} className="inline-block" style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0) rotateX(0)' : 'translateY(30px) rotateX(-40deg)',
          transition: 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          transitionDelay: `${delay + i * 60}ms`,
        }}>
          {c === ' ' ? '\u00A0' : c}
        </span>
      ))}
    </span>
  );
}

function FadeUp({ children, delay = 0, className = '', threshold = 0.15 }: {
  children: ReactNode; delay?: number; className?: string; threshold?: number;
}) {
  const { ref, isInView } = useInView(threshold);
  return (
    <div ref={ref} className={`fade-up ${isInView ? 'visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function RevealImage({ src, alt, className = '', direction = 'left', delay = 0, aspect = 'aspect-[4/3]' }: {
  src: string; alt: string; className?: string; direction?: 'left' | 'right' | 'up'; delay?: number; aspect?: string;
}) {
  const { ref, isInView } = useInView(0.08);
  const cls = direction === 'right' ? 'reveal-mask-right' : direction === 'up' ? 'reveal-mask-up' : 'reveal-mask';
  return (
    <div ref={ref} className={`${cls} ${isInView ? 'revealed' : ''} ${className} overflow-hidden group img-warm-hover`}
      style={{ transitionDelay: `${delay}ms` }}>
      <div className={`${aspect} overflow-hidden`}>
        <img src={src} alt={alt} loading="lazy"
          className="w-full h-full object-cover img-hover" />
      </div>
    </div>
  );
}

function GoldLine({ isVisible, delay = 0, width = 60 }: { isVisible: boolean; delay?: number; width?: number }) {
  return (
    <div className="h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent mx-auto transition-all ease-out"
      style={{
        width: isVisible ? `${width}px` : '0px',
        transitionDuration: '1000ms',
        transitionDelay: `${delay}ms`,
      }}
    />
  );
}

function MoroccanDivider() {
  const { ref, isInView } = useInView(0.5);
  return (
    <div ref={ref} className="py-4">
      <div className="elegant-separator">
        <div className="line line-reverse" style={{ width: isInView ? '50px' : '0px' }} />
        <div className="moroccan-star" style={{
          opacity: isInView ? 1 : 0,
          transform: isInView ? 'scale(1)' : 'scale(0)',
          transition: 'opacity 1s ease 0.4s, transform 1s ease 0.4s',
        }} />
        <div className="line" style={{ width: isInView ? '50px' : '0px' }} />
      </div>
    </div>
  );
}

// ============================================================
// CINEMATIC DESERT BACKGROUND
// — Ken Burns slideshow (guaranteed) + video overlay (if available)
// ============================================================

function DesertBackground({
  videoUrls,
  opacity = 1,
  overlayOpacity = 0.5,
  gradeClass = 'video-desert-grade',
  slideshowInterval = 7000,
  className = '',
}: {
  videoUrls: string[];
  opacity?: number;
  overlayOpacity?: number;
  gradeClass?: string;
  slideshowInterval?: number;
  className?: string;
}) {
  const { videoRef, loaded: videoLoaded } = useDesertVideo(videoUrls);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % DESERT_SLIDESHOW_IMAGES.length);
    }, slideshowInterval);
    return () => clearInterval(timer);
  }, [slideshowInterval]);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} style={{ opacity }}>
      {/* Layer 0: Animated desert gradient (always visible, base layer) */}
      <div className="absolute inset-0 desert-gradient-animated" />

      {/* Layer 0.5: Abstract dune silhouette shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="dune-shape-1 absolute bottom-0 left-0 right-0 h-[45%]"
          style={{
            background: 'linear-gradient(to top, rgba(90, 62, 36, 0.5) 0%, rgba(139, 105, 20, 0.2) 40%, transparent 100%)',
            clipPath: 'polygon(0% 100%, 0% 55%, 8% 48%, 18% 42%, 30% 38%, 42% 35%, 52% 33%, 60% 32%, 68% 33%, 78% 36%, 88% 40%, 95% 45%, 100% 50%, 100% 100%)',
          }} />
        <div className="dune-shape-2 absolute bottom-0 left-0 right-0 h-[35%]"
          style={{
            background: 'linear-gradient(to top, rgba(26, 23, 20, 0.6) 0%, rgba(90, 62, 36, 0.3) 50%, transparent 100%)',
            clipPath: 'polygon(0% 100%, 0% 65%, 5% 58%, 15% 50%, 25% 45%, 38% 42%, 50% 40%, 62% 38%, 72% 40%, 82% 44%, 90% 50%, 96% 58%, 100% 65%, 100% 100%)',
          }} />
      </div>

      {/* Layer 1: Ken Burns image slideshow (guaranteed to work) */}
      <div className="absolute inset-0">
        {DESERT_SLIDESHOW_IMAGES.map((src, i) => (
          <div key={src} className="absolute inset-0 transition-opacity duration-[2500ms] ease-in-out"
            style={{ opacity: i === currentSlide ? 1 : 0 }}>
            <img src={src} alt="" loading={i === 0 ? 'eager' : 'lazy'}
              className={`w-full h-full object-cover ${i === currentSlide ? `kb-anim-${i % 4}` : ''}`}
              style={{ filter: 'saturate(0.7) brightness(0.6) sepia(0.3) contrast(1.1)' }} />
          </div>
        ))}
      </div>

      {/* Layer 2: Video (fades in over slideshow when loaded) */}
      <video ref={videoRef} muted loop playsInline preload="none"
        className={`absolute inset-0 w-full h-full object-cover ${gradeClass}`}
        style={{
          opacity: videoLoaded ? 1 : 0,
          transition: 'opacity 3s ease-in-out',
        }} />

      {/* Layer 3: Gradient overlays for depth and text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1714] via-[#1A1714]/30 to-transparent"
        style={{ opacity: overlayOpacity }} />
      <div className="absolute inset-0 bg-gradient-to-b from-[#1A1714]/50 via-transparent to-transparent"
        style={{ opacity: overlayOpacity * 0.8 }} />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1A1714]/25 via-transparent to-[#1A1714]/25" />

      {/* Warm cinematic color wash */}
      <div className="absolute inset-0 bg-[#2A1808]/10 mix-blend-multiply" />
    </div>
  );
}

// ============================================================
// ATMOSPHERIC EFFECTS
// ============================================================

function SandParticles() {
  const particles = useMemo(() =>
    Array.from({ length: 28 }, (_, i) => ({
      id: i,
      size: Math.random() * 3.5 + 0.8,
      top: Math.random() * 85 + 5,
      delay: Math.random() * 22,
      duration: Math.random() * 14 + 14,
      opacity: Math.random() * 0.18 + 0.04,
    })), []
  );
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[2]">
      {particles.map(p => (
        <div key={p.id} className="sand-particle" style={{
          width: p.size, height: p.size,
          top: `${p.top}%`, left: '-2%',
          '--sand-delay': `${p.delay}s`,
          '--sand-duration': `${p.duration}s`,
          '--sand-opacity': p.opacity,
        } as React.CSSProperties} />
      ))}
    </div>
  );
}

function TwinklingStars({ count = 35 }: { count?: number }) {
  const stars = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      size: Math.random() * 2.5 + 0.5,
      top: Math.random() * 80 + 5,
      left: Math.random() * 95 + 2,
      delay: Math.random() * 8,
      duration: Math.random() * 4 + 2,
      brightness: Math.random() * 0.6 + 0.2,
    })), [count]
  );
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map(s => (
        <div key={s.id} className="star" style={{
          width: s.size, height: s.size,
          top: `${s.top}%`, left: `${s.left}%`,
          '--star-delay': `${s.delay}s`,
          '--star-duration': `${s.duration}s`,
          '--star-brightness': s.brightness,
        } as React.CSSProperties} />
      ))}
    </div>
  );
}

function GoldenLightRays() {
  const rays = useMemo(() => [
    { right: '12%', width: 280, skew: -14, duration: 14, delay: 0, opacity: 0.035 },
    { right: '30%', width: 180, skew: -20, duration: 11, delay: 3, opacity: 0.025 },
    { right: '52%', width: 130, skew: -10, duration: 16, delay: 6, opacity: 0.02 },
    { right: '70%', width: 200, skew: -18, duration: 13, delay: 9, opacity: 0.015 },
  ], []);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
      {rays.map((r, i) => (
        <div key={i} className="absolute top-0 h-full light-ray" style={{
          right: r.right,
          width: `${r.width}px`,
          opacity: r.opacity,
          background: `linear-gradient(195deg, rgba(201,169,110,0.35), rgba(196,120,91,0.1) 40%, transparent 75%)`,
          '--ray-skew': `${r.skew}deg`,
          '--ray-duration': `${r.duration}s`,
          '--ray-delay': `${r.delay}s`,
          transform: `skewX(${r.skew}deg)`,
        } as React.CSSProperties} />
      ))}
    </div>
  );
}

// ============================================================
// LOADING SCREEN
// ============================================================

function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 1400),
      setTimeout(() => setPhase(3), 2600),
      setTimeout(() => setPhase(4), 3600),
      setTimeout(() => setPhase(5), 4400),
      setTimeout(() => { setPhase(6); onComplete(); }, 5400),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  if (phase === 6) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
      style={{
        backgroundColor: '#1A1714',
        transform: phase >= 5 ? 'translateY(-100%)' : 'translateY(0)',
        transition: 'transform 1.2s cubic-bezier(0.77, 0, 0.175, 1)',
      }}>

      {/* Desert background — Ken Burns slideshow + video attempt */}
      <div style={{
        opacity: phase >= 2 ? (phase >= 3 ? 0.45 : 0.2) : 0,
        transition: 'opacity 2.5s ease',
      }}>
        <DesertBackground
          videoUrls={DESERT_VIDEO_URLS}
          gradeClass="video-loading-grade"
          overlayOpacity={0.7}
          slideshowInterval={4000}
        />
      </div>

      {/* Extra dark overlays for loading screen readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1714] via-[#1A1714]/50 to-[#1A1714]/30" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#1A1714]/40 via-transparent to-[#1A1714]" />

      {/* Warm desert dawn glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at 50% 65%, rgba(196, 120, 91, 0.08) 0%, rgba(201, 169, 110, 0.04) 30%, transparent 60%)',
        opacity: phase >= 3 ? 1 : 0,
        transition: 'opacity 2s ease',
      }} />

      {/* Horizon warm glow line */}
      <div className="absolute left-0 right-0 top-[58%] h-[2px] horizon-glow" style={{
        background: 'linear-gradient(90deg, transparent 10%, rgba(201, 169, 110, 0.15) 30%, rgba(196, 120, 91, 0.2) 50%, rgba(201, 169, 110, 0.15) 70%, transparent 90%)',
        opacity: phase >= 3 ? 0.6 : 0,
        transition: 'opacity 2s ease',
      }} />

      {/* Content */}
      <div className="relative z-10 text-center">
        {/* Location whisper */}
        <p className="font-montserrat text-[9px] sm:text-[10px] tracking-[6px] uppercase mb-8"
          style={{
            color: 'rgba(184, 160, 128, 0.45)',
            opacity: phase >= 2 ? 1 : 0,
            transform: phase >= 2 ? 'translateY(0)' : 'translateY(10px)',
            transition: 'all 1.2s ease',
          }}>
          Agafay Desert &middot; Marrakech
        </p>

        {/* Logo */}
        <div style={{
          opacity: phase >= 1 ? 1 : 0,
          transform: phase >= 1 ? 'translateY(0) scale(1)' : 'translateY(15px) scale(0.95)',
          transition: 'all 1.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}>
          <img src={LOGO_SRC} alt="The Seven Saints" className="h-14 sm:h-18 md:h-20 mx-auto mb-4 object-contain"
            style={{ filter: 'brightness(1.2) sepia(0.2)' }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          <h1 className={`font-cormorant text-xl sm:text-2xl md:text-3xl tracking-[10px] sm:tracking-[12px] uppercase gold-glow ${phase >= 3 ? 'shimmer-gold' : 'text-gold'}`}
            style={{ transition: 'all 0.5s ease' }}>
            THE SEVEN SAINTS
          </h1>
        </div>

        {/* Expanding gold horizon line */}
        <div className="h-[1px] mx-auto mt-6" style={{
          width: phase >= 2 ? '120px' : '0px',
          background: 'linear-gradient(90deg, transparent, rgba(196,120,91,0.5), #C9A96E, rgba(196,120,91,0.5), transparent)',
          transition: 'width 1.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }} />

        {/* Poetic subtitle */}
        <p className="font-montserrat text-[9px] sm:text-[10px] tracking-[5px] uppercase mt-7"
          style={{
            color: 'rgba(245, 240, 232, 0.2)',
            opacity: phase >= 3 ? 1 : 0,
            transform: phase >= 3 ? 'translateY(0)' : 'translateY(8px)',
            transition: 'all 1s ease',
            transitionDelay: '300ms',
          }}>
          Where earth meets sky
        </p>
      </div>
    </div>
  );
}

// ============================================================
// CUSTOM CURSOR
// ============================================================

function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return;
    setVisible(true);
    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      setHovering(!!(t.closest('a') || t.closest('button') || t.closest('input') ||
        t.closest('select') || t.closest('textarea') || t.closest('.img-hover')));
    };
    const out = () => setHovering(false);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', over);
    window.addEventListener('mouseout', out);
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseover', over); window.removeEventListener('mouseout', out); };
  }, []);

  if (!visible) return null;
  return (
    <>
      <div className="fixed pointer-events-none z-[9999] rounded-full mix-blend-difference"
        style={{
          width: hovering ? '44px' : '12px', height: hovering ? '44px' : '12px',
          left: pos.x, top: pos.y, transform: 'translate(-50%, -50%)',
          border: `1px solid rgba(201, 169, 110, ${hovering ? '0.6' : '0.8'})`,
          backgroundColor: hovering ? 'rgba(201, 169, 110, 0.08)' : 'rgba(201, 169, 110, 0.5)',
          transition: 'width 0.35s ease, height 0.35s ease, background-color 0.35s ease, border 0.35s ease',
        }}
      />
      <div className="fixed pointer-events-none z-[9999] rounded-full"
        style={{
          width: '4px', height: '4px',
          left: pos.x, top: pos.y, transform: 'translate(-50%, -50%)',
          backgroundColor: '#C9A96E',
          transition: 'left 0.15s ease, top 0.15s ease',
          opacity: hovering ? 0 : 0.8,
        }}
      />
    </>
  );
}

// ============================================================
// SCROLL PROGRESS & BACK TO TOP
// ============================================================

function ScrollProgressBar() {
  const progress = useScrollProgress();
  return (
    <div className="fixed top-0 left-0 h-[2px] z-[90]"
      style={{
        width: `${progress * 100}%`,
        background: 'linear-gradient(90deg, #C4785B, #C9A96E, #E0C88A, #C9A96E)',
        transition: 'width 0.08s linear',
        boxShadow: '0 0 12px rgba(201, 169, 110, 0.5)',
      }}
    />
  );
}

function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const h = () => setShow(window.scrollY > 800);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);
  return (
    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      className="fixed bottom-8 right-8 z-50 w-11 h-11 rounded-full border border-gold/30 bg-charcoal/80 backdrop-blur-sm flex items-center justify-center transition-all duration-500 hover:border-gold hover:bg-charcoal"
      style={{
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0)' : 'translateY(20px)',
        pointerEvents: show ? 'auto' : 'none',
      }}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round">
        <path d="M7 12V2M2 6l5-4 5 4" />
      </svg>
    </button>
  );
}

// ============================================================
// NAVIGATION
// ============================================================

function Navigation({ loaded }: { loaded: boolean }) {
  const { scrolled, hidden } = useScrollDirection();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = useCallback((id: string) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-700"
        style={{
          background: scrolled ? 'rgba(26, 23, 20, 0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px) saturate(1.2)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(201, 169, 110, 0.08)' : '1px solid transparent',
          transform: hidden ? 'translateY(-100%)' : 'translateY(0)',
          opacity: loaded ? 1 : 0,
        }}>
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-14 flex items-center justify-between h-18 sm:h-20 lg:h-24">
          <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-500">
            <img src={LOGO_SRC} alt="" className="h-8 sm:h-9 object-contain"
              style={{ filter: 'brightness(1.1)' }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <span className="font-cormorant text-gold text-[11px] sm:text-[12px] tracking-[5px] sm:tracking-[6px] uppercase hidden sm:inline">
              THE SEVEN SAINTS
            </span>
          </a>
          <div className="hidden md:flex items-center gap-7 lg:gap-10">
            {NAV_LINKS.map(link => (
              <button key={link} onClick={() => handleNav(link.toLowerCase())}
                className="nav-link font-montserrat text-[10px] lg:text-[11px] tracking-[3px] uppercase text-cream/80 hover:text-gold transition-colors duration-400">
                {link}
              </button>
            ))}
          </div>
          <button onClick={() => setMobileOpen(true)} className="md:hidden text-cream/80 p-2 hover:text-gold transition-colors" aria-label="Menu">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <line x1="3" y1="7" x2="21" y2="7" /><line x1="7" y1="12" x2="21" y2="12" /><line x1="3" y1="17" x2="21" y2="17" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className="fixed inset-0 z-[60] flex items-center justify-center transition-all duration-700"
        style={{
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? 'auto' : 'none',
          visibility: mobileOpen ? 'visible' : 'hidden',
          background: 'rgba(26, 23, 20, 0.98)',
          backdropFilter: 'blur(20px)',
        }}>
        {mobileOpen && <TwinklingStars count={15} />}
        <button onClick={() => setMobileOpen(false)} className="absolute top-5 right-5 text-cream/60 p-3 hover:text-gold transition-colors" aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <line x1="4" y1="4" x2="20" y2="20" /><line x1="20" y1="4" x2="4" y2="20" />
          </svg>
        </button>
        <div className="flex flex-col items-center gap-9">
          <img src={LOGO_SRC} alt="" className="h-12 mb-4 object-contain opacity-60"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          {NAV_LINKS.map((link, i) => (
            <button key={link} onClick={() => handleNav(link.toLowerCase())}
              className="font-cormorant text-xl sm:text-2xl tracking-[8px] uppercase text-cream/70 hover:text-gold transition-all duration-500"
              style={{
                opacity: mobileOpen ? 1 : 0,
                transform: mobileOpen ? 'translateY(0)' : 'translateY(25px)',
                transitionDelay: mobileOpen ? `${i * 80 + 200}ms` : '0ms',
                transitionDuration: '600ms',
              }}>
              {link}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

// ============================================================
// HERO SECTION
// ============================================================

function HeroSection({ loaded }: { loaded: boolean }) {
  const [parallaxY, setParallaxY] = useState(0);

  useEffect(() => {
    const h = () => setParallaxY(window.scrollY * 0.35);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Desert background with parallax */}
      <div className="absolute inset-0 parallax-container" style={{ transform: `translateY(${parallaxY}px)` }}>
        <div className="w-full h-[140%] relative">
          <DesertBackground
            videoUrls={DESERT_VIDEO_URLS}
            overlayOpacity={0.6}
            slideshowInterval={7000}
          />
        </div>
      </div>

      {/* Sand particles drifting */}
      <SandParticles />

      {/* Golden light rays from the right */}
      <GoldenLightRays />

      {/* Ambient warm glow */}
      <div className="ambient-glow top-[5%] left-[10%]" />
      <div className="ambient-glow bottom-[15%] right-[5%]" style={{ animationDelay: '7s', opacity: 0.08 }} />

      {/* Additional gradient overlays for the hero specifically */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1714] via-[#1A1714]/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#1A1714]/40 via-transparent to-transparent" />

      {/* Desert horizon warm glow */}
      <div className="absolute bottom-[25%] left-0 right-0 h-[20%] pointer-events-none horizon-glow" style={{
        background: 'radial-gradient(ellipse at 50% 50%, rgba(196, 120, 91, 0.06), transparent 70%)',
      }} />

      {/* Heat haze at bottom horizon */}
      <div className="absolute bottom-0 left-0 right-0 h-[15%] heat-haze" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        {/* Logo image */}
        <div style={{
          opacity: loaded ? 1 : 0,
          transform: loaded ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)',
          transition: 'all 1.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          transitionDelay: '100ms',
        }}>
          <img src={LOGO_SRC} alt="" className="h-16 sm:h-20 md:h-24 mx-auto mb-5 object-contain"
            style={{ filter: 'brightness(1.3) drop-shadow(0 0 30px rgba(201,169,110,0.2))' }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </div>

        <h1 className="block">
          <AnimatedLetters text="THE SEVEN SAINTS" isVisible={loaded}
            className="font-cormorant text-cream text-[36px] sm:text-[50px] md:text-[64px] lg:text-[78px] tracking-[8px] sm:tracking-[10px] md:tracking-[14px] uppercase leading-tight gold-glow"
            delay={200}
          />
        </h1>

        {/* Expanding gold line */}
        <div className="h-[1px] mx-auto mt-6 md:mt-8" style={{
          width: loaded ? '100px' : '0px',
          background: 'linear-gradient(90deg, transparent, rgba(196,120,91,0.5), #C9A96E, #E0C88A, #C9A96E, rgba(196,120,91,0.5), transparent)',
          transition: 'width 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          transitionDelay: '1800ms',
          boxShadow: '0 0 20px rgba(201, 169, 110, 0.15)',
        }} />

        {/* Subtitle */}
        <p className="font-montserrat font-light text-cream/75 text-[10px] sm:text-[12px] md:text-[13px] tracking-[4px] sm:tracking-[6px] uppercase mt-5 md:mt-7"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'translateY(0)' : 'translateY(15px)',
            transition: 'all 1s ease',
            transitionDelay: '2200ms',
            textShadow: '0 2px 20px rgba(0,0,0,0.5)',
          }}>
          At the summit of the Agafay dunes, Marrakech
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center animate-scroll-bounce"
        style={{ opacity: loaded ? 1 : 0, transition: 'opacity 1s ease', transitionDelay: '3s' }}>
        <p className="font-montserrat text-[8px] tracking-[4px] uppercase text-cream/25 mb-3">Scroll</p>
        <div className="w-[1px] h-10 bg-gradient-to-b from-transparent via-gold/40 to-gold/60" />
      </div>
    </section>
  );
}

// ============================================================
// INTRO SECTION
// ============================================================

function IntroSection() {
  const { ref, isInView } = useInView(0.3);
  return (
    <section className="relative bg-cream py-28 sm:py-36 lg:py-48 warm-border-top">
      <div ref={ref} className="max-w-[660px] mx-auto px-6 text-center">
        <FadeUp>
          <p className="font-montserrat text-[10px] sm:text-[11px] tracking-[5px] uppercase text-gold-muted mb-7">
            AGAFAY, MARRAKECH
          </p>
        </FadeUp>
        <FadeUp delay={200}>
          <h2 className="font-cormorant text-charcoal-light text-[26px] sm:text-[32px] md:text-[40px] leading-[1.4] mb-8">
            Where Earth Meets Sky and Silence Becomes Ceremony
          </h2>
        </FadeUp>
        <FadeUp delay={400}>
          <p className="font-montserrat font-light text-brown text-[14px] sm:text-[15px] leading-[2] mb-10">
            Perched upon the ancient stone dunes of the Agafay desert, The Seven Saints is a sanctuary of silence,
            starlight, and Moroccan heritage. Here, the Atlas Mountains frame every horizon, and the rhythm of the desert
            replaces the pace of the world you left behind.
          </p>
        </FadeUp>
        <FadeUp delay={600}>
          <GoldLine isVisible={isInView} delay={600} />
        </FadeUp>
      </div>
    </section>
  );
}

// ============================================================
// EXPERIENCE SECTION
// ============================================================

function ExperienceSection() {
  const { ref: titleRef, isInView: titleVisible } = useInView(0.3);

  return (
    <section id="experience" className="relative bg-charcoal py-20 sm:py-28 lg:py-40 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#2A2218]/50 via-transparent to-[#1A1714] pointer-events-none" />
      <TwinklingStars count={22} />

      <div className="relative z-10 max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
        <div ref={titleRef} className="text-center mb-14 sm:mb-20 lg:mb-24">
          <FadeUp>
            <p className="font-montserrat text-[9px] tracking-[5px] uppercase text-gold-muted/50 mb-4">
              CHAPTER ONE
            </p>
          </FadeUp>
          <h2 className="font-cormorant text-gold text-[12px] sm:text-[13px] tracking-[6px] uppercase mb-5 gold-glow">
            <AnimatedLetters text="THE EXPERIENCE" isVisible={titleVisible} />
          </h2>
          <GoldLine isVisible={titleVisible} delay={800} width={80} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-5 lg:gap-6">
          <div className="md:col-span-7">
            <RevealImage src={IMAGES.tentInterior} alt="Luxury tented suite interior" aspect="aspect-[16/10]" direction="left" />
            <p className="font-montserrat italic font-light text-cream/35 text-[11px] sm:text-[12px] tracking-[2px] mt-3 ml-1">
              Handcrafted luxury, draped in desert warmth
            </p>
          </div>
          <div className="md:col-span-5 flex flex-col justify-end">
            <RevealImage src={IMAGES.pool} alt="Infinity pool with Atlas Mountains" aspect="aspect-[3/4]" direction="right" delay={200} />
          </div>

          <div className="md:col-span-12 py-6 sm:py-10 text-center">
            <FadeUp>
              <p className="font-cormorant italic text-cream/30 text-[16px] sm:text-[20px] tracking-[3px]">
                where the dunes glow gold before nightfall
              </p>
            </FadeUp>
          </div>

          <div className="md:col-span-5">
            <RevealImage src={IMAGES.camels} alt="Camel silhouettes at golden hour" aspect="aspect-[3/4]" direction="left" delay={100} />
          </div>
          <div className="md:col-span-7 flex flex-col justify-start">
            <RevealImage src={IMAGES.candleDinner} alt="Candlelit dinner under the stars" aspect="aspect-[16/10]" direction="right" delay={250} />
            <p className="font-montserrat italic font-light text-cream/35 text-[11px] sm:text-[12px] tracking-[2px] mt-3 text-right mr-1">
              Evenings woven with candlelight and conversation
            </p>
          </div>

          <div className="md:col-span-12 py-6 sm:py-10 text-center">
            <FadeUp>
              <p className="font-cormorant italic text-cream/30 text-[16px] sm:text-[20px] tracking-[3px]">
                silence, starlight, and the ancient desert
              </p>
            </FadeUp>
          </div>

          <div className="md:col-span-12">
            <RevealImage src={IMAGES.desertPanorama} alt="Sand dune patterns at golden hour" aspect="aspect-[21/8]" direction="up" delay={150} />
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// SUITES SECTION
// ============================================================

function SuitesSection() {
  return (
    <section id="suites" className="relative bg-cream py-20 sm:py-28 lg:py-40 warm-border-top">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
        <FadeUp>
          <div className="text-center mb-6">
            <p className="font-montserrat text-[9px] tracking-[5px] uppercase text-gold-muted/50 mb-4">
              CHAPTER TWO
            </p>
            <h2 className="font-cormorant text-charcoal-light text-[26px] sm:text-[32px] md:text-[40px] tracking-[4px] uppercase">
              Suites &amp; Tents
            </h2>
          </div>
        </FadeUp>
        <FadeUp delay={200}>
          <p className="font-montserrat font-light text-brown/70 text-[13px] sm:text-[14px] text-center max-w-[500px] mx-auto mb-16 sm:mb-20 lg:mb-24 leading-[1.8]">
            Each residence is a private sanctuary, designed to dissolve the boundary between shelter and sky.
          </p>
        </FadeUp>

        <div className="space-y-20 sm:space-y-28 lg:space-y-36">
          {SUITES.map((suite, i) => (
            <div key={suite.name} className={`flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-14 items-center`}>
              <div className="w-full lg:w-[58%]">
                <RevealImage src={suite.image} alt={suite.name} aspect="aspect-[4/3]" direction={i % 2 === 0 ? 'left' : 'right'} />
              </div>
              <div className="w-full lg:w-[42%] text-center lg:text-left">
                <FadeUp delay={200}>
                  <div className="h-[1px] w-10 bg-gold/40 mb-6 mx-auto lg:mx-0" />
                  <h3 className="font-cormorant text-charcoal-light text-[24px] sm:text-[28px] md:text-[34px] mb-5 leading-tight">
                    {suite.name}
                  </h3>
                </FadeUp>
                <FadeUp delay={400}>
                  <p className="font-montserrat font-light text-brown text-[14px] sm:text-[15px] leading-[2] mb-6 max-w-[420px] mx-auto lg:mx-0">
                    {suite.description}
                  </p>
                </FadeUp>
                <FadeUp delay={600}>
                  <p className="font-montserrat text-[11px] tracking-[3px] uppercase text-gold-muted">
                    {suite.price}
                  </p>
                </FadeUp>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// DINING SECTION
// ============================================================

function DiningSection() {
  const [parallaxY, setParallaxY] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const h = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        setParallaxY(-rect.top * 0.15);
      }
    };
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <section id="dining" ref={sectionRef} className="relative">
      <div className="relative h-[65vh] sm:h-[75vh] overflow-hidden">
        <div className="absolute inset-0 animate-ken-burns-out parallax-container" style={{ transform: `translateY(${parallaxY}px)` }}>
          <img src={IMAGES.diningHero} alt="Outdoor desert dining" loading="lazy" className="w-full h-[125%] object-cover" />
        </div>
        <div className="absolute inset-0 bg-[#1A1714]/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1714]/70 via-transparent to-[#1A1714]/30" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <FadeUp>
            <p className="font-montserrat text-[9px] tracking-[5px] uppercase text-gold-muted/50 mb-5">CHAPTER THREE</p>
          </FadeUp>
          <FadeUp delay={200}>
            <h2 className="font-cormorant text-cream text-[30px] sm:text-[40px] md:text-[52px] tracking-[4px] uppercase gold-glow"
              style={{ textShadow: '0 2px 30px rgba(0,0,0,0.5)' }}>
              Dine Beneath the Stars
            </h2>
          </FadeUp>
          <FadeUp delay={400}>
            <div className="h-[1px] w-16 mx-auto mt-6" style={{ background: 'linear-gradient(90deg, transparent, #C9A96E, transparent)' }} />
          </FadeUp>
        </div>
      </div>

      <div className="bg-cream py-16 sm:py-24 lg:py-32 warm-border-top">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5 mb-12 sm:mb-16">
            <RevealImage src={IMAGES.food1} alt="Moroccan tagine" aspect="aspect-[4/5]" direction="left" />
            <RevealImage src={IMAGES.food2} alt="Artisan Moroccan dishes" aspect="aspect-[4/5]" direction="up" delay={200} />
            <RevealImage src={IMAGES.food3} alt="Desert cuisine" aspect="aspect-[4/5]" direction="right" delay={400} />
          </div>
          <FadeUp>
            <p className="font-montserrat font-light text-brown text-center text-[14px] sm:text-[15px] leading-[2] max-w-[580px] mx-auto mb-12 sm:mb-16">
              Moroccan heritage meets artisan craft. Every plate tells a story of the land &mdash; saffron from Taliouine,
              olive oil from the Atlas foothills, bread baked in earth ovens at dawn.
            </p>
          </FadeUp>
          <RevealImage src={IMAGES.guestDining} alt="Atmospheric desert dining" aspect="aspect-[21/9]" direction="up" />
        </div>
      </div>
    </section>
  );
}

// ============================================================
// STORY SECTION
// ============================================================

function StorySection() {
  return (
    <section id="story" className="relative bg-charcoal-light moroccan-pattern py-20 sm:py-28 lg:py-40 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#352D26]/50 via-[#2C2825] to-[#1A1714]/80 pointer-events-none" />
      <TwinklingStars count={45} />

      <div className="relative z-10 max-w-[700px] mx-auto px-6 text-center">
        <FadeUp>
          <p className="font-montserrat text-[9px] tracking-[5px] uppercase text-gold-muted/50 mb-3">CHAPTER FOUR</p>
          <p className="font-montserrat text-[10px] sm:text-[11px] tracking-[4px] uppercase text-gold-muted mb-7">OUR STORY</p>
        </FadeUp>

        <FadeUp delay={200}>
          <h2 className="font-cormorant text-gold text-[28px] sm:text-[36px] md:text-[44px] leading-[1.3] mb-10 gold-glow">
            The Seven Saints of Marrakech
          </h2>
        </FadeUp>

        <FadeUp delay={400}>
          <p className="font-montserrat font-light text-cream/80 text-[14px] sm:text-[15px] leading-[2.1] mb-8">
            For centuries, the city of Marrakech has been watched over by its seven patron saints &mdash; the Sab&#39;atou Rijal.
            These seven holy men, mystics and scholars, arrived from across the Islamic world and chose this red city
            as their home, their sanctuary, their final resting place.
          </p>
        </FadeUp>

        <FadeUp delay={600}>
          <p className="font-montserrat font-light text-cream/80 text-[14px] sm:text-[15px] leading-[2.1] mb-8">
            Their tombs became pilgrimage sites. Their teachings became the spiritual foundation of a city that has
            enchanted travelers for a thousand years. To invoke the seven saints is to invoke protection, wisdom,
            and the grace of the desert.
          </p>
        </FadeUp>

        <FadeUp delay={800}>
          <p className="font-montserrat font-light text-cream/80 text-[14px] sm:text-[15px] leading-[2.1] mb-12">
            The Seven Saints Agafay carries this legacy into the desert &mdash; a place where every guest is received not
            as a visitor, but as a pilgrim. Where hospitality is not a service, but a sacred act. Where the land
            itself holds memory, and the silence speaks of centuries.
          </p>
        </FadeUp>

        <MoroccanDivider />
      </div>

      <div className="mt-16 sm:mt-24 lg:mt-32">
        <RevealImage src={IMAGES.campTwilight} alt="Desert dunes at twilight" aspect="aspect-[21/8] sm:aspect-[3/1]" direction="up" className="mx-3 sm:mx-0" />
      </div>
    </section>
  );
}

// ============================================================
// TESTIMONIALS
// ============================================================

function TestimonialsSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const i = setInterval(() => setCurrent(c => (c + 1) % TESTIMONIALS.length), 5500);
    return () => clearInterval(i);
  }, []);

  return (
    <section className="relative bg-cream py-20 sm:py-28 lg:py-36 section-glow-top">
      <div className="max-w-[780px] mx-auto px-6 text-center">
        <FadeUp>
          <div className="text-gold/25 text-[70px] sm:text-[90px] font-cormorant leading-none mb-2 select-none">
            &#8220;
          </div>
        </FadeUp>

        <div className="relative h-[180px] sm:h-[140px] flex items-center justify-center">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="absolute inset-0 flex flex-col items-center justify-center"
              style={{
                opacity: i === current ? 1 : 0,
                transform: i === current ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.98)',
                transition: 'all 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              }}>
              <p className="font-cormorant italic text-charcoal-light text-[18px] sm:text-[22px] md:text-[24px] leading-[1.6] mb-5 px-2">
                {t.text}
              </p>
              <p className="font-montserrat text-[10px] sm:text-[11px] tracking-[3px] uppercase text-gold-muted">
                &mdash; {t.author}
              </p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-3 mt-8">
          {TESTIMONIALS.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} aria-label={`Testimonial ${i + 1}`}
              className="transition-all duration-500" style={{
                width: i === current ? '24px' : '6px', height: '6px', borderRadius: '3px',
                backgroundColor: i === current ? '#C9A96E' : 'rgba(184, 160, 128, 0.25)',
              }} />
          ))}
        </div>

        <div className="mt-16 sm:mt-24">
          <FadeUp>
            <p className="font-montserrat text-[9px] sm:text-[10px] tracking-[4px] uppercase text-gold-muted/40 mb-8">AS FEATURED IN</p>
          </FadeUp>
          <FadeUp delay={200}>
            <div className="flex items-center justify-center gap-6 sm:gap-12 flex-wrap">
              {['COND\u00c9 NAST', 'MONOCLE', 'WALLPAPER*', 'DEPARTURES', 'ROBB REPORT'].map(name => (
                <span key={name} className="font-cormorant text-charcoal-light/20 text-[13px] sm:text-[15px] tracking-[3px] uppercase whitespace-nowrap hover:text-charcoal-light/40 transition-colors duration-500">
                  {name}
                </span>
              ))}
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// BOOKING SECTION
// ============================================================

function BookingSection() {
  const [formData, setFormData] = useState({ checkIn: '', checkOut: '', accommodation: '', guests: '', email: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const inputCls = 'w-full bg-transparent border-0 border-b border-gold-muted/30 py-3 font-montserrat font-light text-[13px] sm:text-[14px] text-charcoal-light placeholder:text-warm-gray/50 focus:outline-none focus:border-gold transition-colors duration-500';

  return (
    <section id="book" className="relative py-20 sm:py-28 lg:py-36 overflow-hidden warm-border-top"
      style={{ background: 'linear-gradient(180deg, #F0E8D8 0%, #EDE4D4 50%, #F0E8D8 100%)' }}>
      <div className="absolute inset-0 opacity-[0.015] moroccan-pattern pointer-events-none" />

      <div className="relative z-10 max-w-[580px] mx-auto px-6 text-center">
        <FadeUp>
          <p className="font-montserrat text-[9px] tracking-[5px] uppercase text-gold-muted/50 mb-4">CHAPTER FIVE</p>
          <h2 className="font-cormorant text-charcoal-light text-[26px] sm:text-[32px] md:text-[40px] mb-3">
            Begin Your Journey
          </h2>
        </FadeUp>
        <FadeUp delay={150}>
          <p className="font-montserrat font-light text-brown/70 text-[12px] sm:text-[13px] tracking-[2px] mb-12 sm:mb-14">
            Book direct for the best rate guaranteed
          </p>
        </FadeUp>

        <FadeUp delay={300}>
          <form onSubmit={handleSubmit} className="space-y-7 text-left">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
              <div>
                <label className="block font-montserrat text-[10px] tracking-[2px] uppercase text-gold-muted/70 mb-2">Check-in</label>
                <input type="date" value={formData.checkIn} onChange={e => setFormData({ ...formData, checkIn: e.target.value })} className={inputCls} required />
              </div>
              <div>
                <label className="block font-montserrat text-[10px] tracking-[2px] uppercase text-gold-muted/70 mb-2">Check-out</label>
                <input type="date" value={formData.checkOut} onChange={e => setFormData({ ...formData, checkOut: e.target.value })} className={inputCls} required />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
              <div>
                <label className="block font-montserrat text-[10px] tracking-[2px] uppercase text-gold-muted/70 mb-2">Accommodation</label>
                <select value={formData.accommodation} onChange={e => setFormData({ ...formData, accommodation: e.target.value })} className={`${inputCls} appearance-none`} required>
                  <option value="">Select</option>
                  <option value="atlas">The Atlas Pavilion</option>
                  <option value="nomad">The Nomad Suite</option>
                  <option value="saints">The Saint&#39;s Retreat</option>
                </select>
              </div>
              <div>
                <label className="block font-montserrat text-[10px] tracking-[2px] uppercase text-gold-muted/70 mb-2">Guests</label>
                <select value={formData.guests} onChange={e => setFormData({ ...formData, guests: e.target.value })} className={`${inputCls} appearance-none`} required>
                  <option value="">Select</option>
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4 Guests</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block font-montserrat text-[10px] tracking-[2px] uppercase text-gold-muted/70 mb-2">Email</label>
              <input type="email" placeholder="your@email.com" value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })} className={inputCls} required />
            </div>
            <div className="text-center pt-5">
              <button type="submit"
                className="btn-luxury bg-terracotta text-cream font-montserrat text-[11px] sm:text-[12px] tracking-[3px] uppercase px-14 py-4 rounded-none">
                {submitted ? 'Thank You' : 'Reserve'}
              </button>
            </div>
          </form>
        </FadeUp>

        <FadeUp delay={500}>
          <div className="mt-12 pt-8">
            <MoroccanDivider />
            <p className="font-montserrat font-light text-brown/60 text-[12px] mt-6 mb-3">Or contact us directly</p>
            <div className="flex items-center justify-center gap-5 flex-wrap">
              <a href="mailto:reservations@thesevensaints.com" className="font-montserrat text-[11px] sm:text-[12px] tracking-[1px] text-gold-muted hover:text-gold transition-colors duration-400">
                reservations@thesevensaints.com
              </a>
              <span className="text-gold-muted/30">|</span>
              <a href="https://wa.me/212661370050" target="_blank" rel="noopener noreferrer" className="font-montserrat text-[11px] sm:text-[12px] tracking-[1px] text-gold-muted hover:text-gold transition-colors duration-400">
                WhatsApp
              </a>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ============================================================
// LOCATION SECTION
// ============================================================

function LocationSection() {
  return (
    <section className="relative bg-charcoal py-20 sm:py-28 lg:py-36 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#2A2218]/40 via-transparent to-[#1A1714] pointer-events-none" />
      <TwinklingStars count={18} />

      <div className="relative z-10 max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">
          <div className="w-full lg:w-[42%] text-center lg:text-left">
            <FadeUp>
              <p className="font-montserrat text-[9px] tracking-[5px] uppercase text-gold-muted/50 mb-4">FIND US</p>
              <h2 className="font-cormorant text-gold text-[26px] sm:text-[32px] md:text-[38px] mb-5 gold-glow">
                Where the Atlas Meets the Desert
              </h2>
            </FadeUp>
            <FadeUp delay={200}>
              <p className="font-montserrat font-light text-cream/75 text-[14px] sm:text-[15px] leading-[2] mb-8">
                40 minutes from the Marrakech Medina. A world away from everything else.
              </p>
            </FadeUp>
            <FadeUp delay={400}>
              <div className="space-y-5 font-montserrat font-light text-cream/55 text-[13px] leading-[1.9]">
                <div>
                  <span className="text-gold-muted/60 text-[10px] tracking-[3px] uppercase block mb-1">From Marrakech</span>
                  Private transfer arranged upon booking. 40-minute scenic drive through the Agafay plateau.
                </div>
                <div>
                  <span className="text-gold-muted/60 text-[10px] tracking-[3px] uppercase block mb-1">From Airport</span>
                  Marrakech Menara Airport (RAK) &mdash; 50-minute private transfer included with all stays.
                </div>
                <div>
                  <span className="text-gold-muted/60 text-[10px] tracking-[3px] uppercase block mb-1">Coordinates</span>
                  31.4&deg;N, 8.2&deg;W &mdash; Summit of the Agafay Stone Dunes
                </div>
              </div>
            </FadeUp>
          </div>
          <div className="w-full lg:w-[58%]">
            <RevealImage src={IMAGES.location} alt="Agafay Desert landscape" aspect="aspect-[4/3]" direction="right" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// FOOTER
// ============================================================

function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSub = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(''); setTimeout(() => setSubscribed(false), 3000); }
  };

  return (
    <footer className="bg-charcoal py-16 sm:py-24 border-t border-gold/8">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        <div className="text-center mb-14">
          <img src={LOGO_SRC} alt="" className="h-10 sm:h-12 mx-auto mb-4 object-contain opacity-50"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          <h3 className="font-cormorant text-gold/35 text-[12px] sm:text-[13px] tracking-[8px] uppercase">
            THE SEVEN SAINTS
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 text-center mb-14">
          <div>
            <h4 className="font-montserrat text-[10px] tracking-[3px] uppercase text-gold-muted/40 mb-5">Contact</h4>
            <div className="space-y-2.5">
              <a href="mailto:reservations@thesevensaints.com" className="block font-montserrat font-light text-cream/40 text-[12px] hover:text-gold transition-colors duration-400">
                reservations@thesevensaints.com
              </a>
              <a href="tel:+212661370050" className="block font-montserrat font-light text-cream/40 text-[12px] hover:text-gold transition-colors duration-400">
                +212 661 370 050
              </a>
              <a href="https://wa.me/212661370050" target="_blank" rel="noopener noreferrer" className="block font-montserrat font-light text-cream/40 text-[12px] hover:text-gold transition-colors duration-400">
                WhatsApp
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-montserrat text-[10px] tracking-[3px] uppercase text-gold-muted/40 mb-5">Explore</h4>
            <div className="space-y-2.5">
              {NAV_LINKS.map(link => (
                <button key={link} onClick={() => { const el = document.getElementById(link.toLowerCase()); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}
                  className="block w-full font-montserrat font-light text-cream/40 text-[12px] hover:text-gold transition-colors duration-400">
                  {link}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-montserrat text-[10px] tracking-[3px] uppercase text-gold-muted/40 mb-5">Follow</h4>
            <div className="flex items-center justify-center gap-5">
              <a href="#" className="text-cream/35 hover:text-gold transition-colors duration-400" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a href="#" className="text-cream/35 hover:text-gold transition-colors duration-400" aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a href="#" className="text-cream/35 hover:text-gold transition-colors duration-400" aria-label="TikTok">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-[380px] mx-auto text-center mb-12">
          <p className="font-montserrat text-[9px] tracking-[3px] uppercase text-gold-muted/35 mb-3">Newsletter</p>
          <form onSubmit={handleSub} className="flex items-end gap-3">
            <input type="email" placeholder="Your email" value={email} onChange={e => setEmail(e.target.value)}
              className="flex-1 bg-transparent border-0 border-b border-gold/15 py-2 font-montserrat font-light text-[12px] text-cream/60 placeholder:text-cream/20 focus:outline-none focus:border-gold/40 transition-colors duration-500" required />
            <button type="submit" className="font-montserrat text-[10px] tracking-[2px] uppercase text-gold-muted/40 hover:text-gold transition-colors duration-400 pb-2">
              {subscribed ? '\u2713' : '\u2192'}
            </button>
          </form>
        </div>

        <div className="text-center pt-8" style={{ borderTop: '1px solid rgba(201, 169, 110, 0.06)' }}>
          <p className="font-montserrat font-light text-warm-gray/30 text-[10px] tracking-[2px]">
            The Seven Saints Agafay &mdash; Marrakech, Morocco
          </p>
          <p className="font-montserrat font-light text-warm-gray/18 text-[9px] tracking-[1px] mt-2">
            &copy; {new Date().getFullYear()} The Seven Saints. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ============================================================
// APP
// ============================================================

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const handleLoadingComplete = useCallback(() => setLoaded(true), []);

  return (
    <div className="grain-texture">
      <LoadingScreen onComplete={handleLoadingComplete} />
      <CustomCursor />
      <ScrollProgressBar />
      <BackToTop />
      <Navigation loaded={loaded} />

      <main>
        <HeroSection loaded={loaded} />
        <IntroSection />
        <ExperienceSection />
        <SuitesSection />
        <DiningSection />
        <StorySection />
        <TestimonialsSection />
        <BookingSection />
        <LocationSection />
      </main>

      <Footer />
    </div>
  );
}
