import { useEffect, useMemo, useState } from 'react';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { LoaderIntro } from './components/LoaderIntro';
import { ScrollProgress } from './components/ScrollProgress';
import { CustomCursor } from './components/CustomCursor';
import { IntroSection } from './components/IntroSection';
import { ExperienceGallery, type GalleryItem } from './components/ExperienceGallery';
import { SuitesSection, type Accommodation } from './components/SuitesSection';
import { DiningSection } from './components/DiningSection';
import { StorySection } from './components/StorySection';
import { PressSection, type PressLogo, type Testimonial } from './components/PressSection';
import { BookingSection } from './components/BookingSection';
import { LocationSection } from './components/LocationSection';
import { Footer } from './components/Footer';

type SectionRow = {
  id: number;
  slug: string;
  title: string;
  subtitle: string | null;
  body: string | null;
  theme: string;
  sort_order: number;
  media: any;
};

function parseMedia(raw: any) {
  if (!raw) return {};
  if (typeof raw === 'object') return raw;
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export default function App() {
  const [introDone, setIntroDone] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState<SectionRow[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [pressLogos, setPressLogos] = useState<PressLogo[]>([]);

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/content');
      const data = await res.json();
      setSections((data.sections || []).map((s: any) => ({ ...s, media: parseMedia(s.media) })));
      setGallery(data.gallery || []);
      setAccommodations(data.accommodations || []);
      setTestimonials(data.testimonials || []);
      setPressLogos(data.pressLogos || []);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const bySlug = useMemo(() => {
    const m = new Map<string, SectionRow>();
    for (const s of sections) m.set(s.slug, s);
    return m;
  }, [sections]);

  const hero = bySlug.get('hero');
  const intro = bySlug.get('intro');
  const exp = bySlug.get('experience');
  const suites = bySlug.get('suites');
  const dining = bySlug.get('dining');
  const story = bySlug.get('story');
  const press = bySlug.get('press');
  const book = bySlug.get('book');
  const location = bySlug.get('location');

  const expItems = gallery.filter((g) => g.section_slug === 'experience');
  const diningItems = gallery.filter((g) => g.section_slug === 'dining');
  const storyImage = gallery.find((g) => g.section_slug === 'story');
  const locationImage = gallery.find((g) => g.section_slug === 'location');

  return (
    <div className="min-h-screen bg-[#0F0D0B] text-[#F5F0E8] selection:bg-[#C9A96E] selection:text-[#1A1714]">
      <ScrollProgress />
      <CustomCursor />
      <Nav />

      {!introDone && <LoaderIntro onDone={() => setIntroDone(true)} />}

      {loading ? (
        <div className="flex h-[60vh] items-center justify-center bg-[#0F0D0B]">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#C9A96E]/30 border-t-[#C9A96E]" />
        </div>
      ) : (
        <>
          {hero && (
            <Hero
              title={hero.title}
              subtitle={hero.subtitle || ''}
              heroVideoSrc={hero.media?.heroVideoSrc || '/videos/hero.mp4'}
              posterImage={hero.media?.posterImage || undefined}
            />
          )}
          {intro && <IntroSection label={intro.subtitle || ''} title={intro.title} body={intro.body || ''} />}
          {exp && <ExperienceGallery title={exp.title} body={exp.body || ''} items={expItems} />}
          {suites && <SuitesSection title={suites.title} items={accommodations} />}
          {dining && <DiningSection title={dining.title} body={dining.body || ''} items={diningItems} />}
          {story && <StorySection label={story.subtitle || 'OUR STORY'} title={story.title} body={story.body || ''} image={storyImage} />}
          {press && <PressSection testimonials={testimonials} logos={pressLogos} />}
          {book && <BookingSection title={book.title} subtitle={book.subtitle || ''} accommodations={accommodations} />}
          {location && <LocationSection title={location.title} subtitle={location.subtitle || ''} body={location.body || ''} mapImage={locationImage} />}
          <Footer />
        </>
      )}
    </div>
  );
}
