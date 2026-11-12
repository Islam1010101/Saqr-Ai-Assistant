import React, { useEffect, useRef, useState } from 'react';

type TourOrb = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
};
type TourBurst = { id: number; tx: number; ty: number; rot: number; color: string };

export default function TutorialGlassOrbit({
  isAr,
  items,
  onMascotClick,
  bursts,
  showBubble,
}: {
  isAr: boolean;
  items: TourOrb[];
  onMascotClick: () => void;
  bursts: TourBurst[];
  showBubble: boolean;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const activeItem = items.find(item => item.id === selected);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav || typeof IntersectionObserver === 'undefined' ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const spheres = Array.from(nav.querySelectorAll<HTMLElement>('.tutorial-glass-orb'));
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) entry.target.classList.toggle('is-revealed', entry.isIntersecting);
    }, { threshold: .12 });
    nav.classList.add('tutorial-orbit-motion-ready');
    spheres.forEach(sphere => observer.observe(sphere));
    return () => {
      observer.disconnect();
      nav.classList.remove('tutorial-orbit-motion-ready');
      spheres.forEach(sphere => sphere.classList.remove('is-revealed'));
    };
  }, [items.length]);

  return (
    <section className="tutorial-glass-orbit" aria-label={isAr ? 'جولة تفاعلية في خدمات صقر' : 'Interactive tour of Saqr services'}>
      <header className="tutorial-glass-orbit-head">
        <h2>{isAr ? 'اكتشف عالم المكتبة مع صقر' : 'Explore the Library with Saqr'}</h2>
      </header>
      <div className="tutorial-glass-orbit-scene">
        <span className="tutorial-glass-crest" aria-hidden="true">
          <img src="/school-logo.png" alt="" loading="lazy" />
        </span>
        <button type="button" className="tutorial-glass-mascot"
          onClick={event => { event.stopPropagation(); onMascotClick(); }}
          aria-label={isAr ? 'المس شخصية صقر للتفاعل' : 'Tap Saqr to interact'}>
          <img src="/Saqr.png" alt="" loading="lazy" decoding="async"/>
          <span className="tutorial-glass-mascot-caption">{isAr ? 'صقر يساعدك' : 'Saqr helps you'}</span>
          {showBubble && <span className="tutorial-glass-speech">{isAr ? 'فخورين بالإمارات' : 'Proud of the UAE'}</span>}
          {bursts.map(burst => (
            <svg key={burst.id} className="tutorial-glass-burst" viewBox="0 0 24 24"
              style={{ '--burst-x': burst.tx + 'px', '--burst-y': burst.ty + 'px', '--burst-rot': burst.rot + 'deg' } as React.CSSProperties}
              aria-hidden="true">
              <path d="m12 2 2.5 6.5L21 11l-6.5 2.5L12 20l-2.5-6.5L3 11l6.5-2.5L12 2Z" fill="#ca9c3d"/>
            </svg>
          ))}
        </button>
      </div>
      <div className="tutorial-glass-orbits" ref={navRef}>
        {items.map((item, index) => (
          <button type="button" key={item.id} className={'tutorial-glass-orb' + (selected === item.id ? ' is-selected' : '')}
            style={{ '--orb-delay': (-index * .41) + 's' } as React.CSSProperties}
            aria-pressed={selected === item.id} aria-label={item.title}
            onClick={() => setSelected(current => current === item.id ? null : item.id)}>
            <span aria-hidden="true">{item.icon}</span>
            <strong>{item.title}</strong>
          </button>
        ))}
      </div>
      {activeItem && (
        <div className="tutorial-glass-detail" role="status" aria-live="polite">
          <strong>{activeItem.title}</strong>
          <p>{activeItem.description}</p>
        </div>
      )}
    </section>
  );
}
