import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../App';
import './saqrStudioVisual.css';

// --- مسار الصورة المباشر من مجلد public ---
const saqrAvatar = '/Saqr_Studio.png'; 

const translations = {
  ar: {
    pageTitle: "استديو صقر",
    comingSoon: "قريباً",
    podcast: "بودكاست",
    dubbing: "أفلامك AI",
    studioDesc: "مساحتك الإبداعية للتعبير، الإلقاء، صناعة أفكارك.",
    onAir: "على الهواء"
  },
  en: {
    pageTitle: "Saqr Studio",
    comingSoon: "COMING SOON",
    podcast: "Podcast",
    dubbing: "AI Filming",
    studioDesc: "Your creative space to express, narrate, Create Your Ideias.",
    onAir: "ON AIR"
  }
};

// ==========================================
// أيقونات SVG جذابة (بديلة للإيموجيز)
// ==========================================
const PodcastIcon = () => (
    <svg className="w-10 h-10 md:w-12 md:h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
);

const DubbingIcon = () => (
    <svg className="w-10 h-10 md:w-12 md:h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
    </svg>
);

// --- مكون الموجات الصوتية (Equalizer) ---
const AudioEqualizer = () => (
  <div className="studio-equalizer">
    {Array.from({ length: 24 }, (_, i) => (
      <div key={i} style={{
        height: `${16 + ((i * 37 + 19) % 70)}%`,
        animationDelay: `${(i % 8) * -.13}s`,
        animationDuration: `${.85 + (i % 5) * .17}s`
      }} />
    ))}
  </div>
);

const SaqrStudioPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const isAr = locale === 'ar';
    const t = (key: keyof typeof translations.ar) => translations[locale][key];
    
    const handleStudioPointerMove = (event: React.PointerEvent<HTMLElement>) => {
        if (event.pointerType !== 'mouse') return;
        const rect = event.currentTarget.getBoundingClientRect();
        const x = Math.max(-1, Math.min(1, (event.clientX - rect.left - rect.width / 2) / (rect.width / 2)));
        const y = Math.max(-1, Math.min(1, (event.clientY - rect.top - rect.height / 2) / (rect.height / 2)));
        event.currentTarget.style.setProperty('--studio-x', (x * 11).toFixed(1) + 'px');
        event.currentTarget.style.setProperty('--studio-y', (y * 9).toFixed(1) + 'px');
    };
    const resetStudioPointer = (event: React.PointerEvent<HTMLElement>) => {
        event.currentTarget.style.setProperty('--studio-x', '0px');
        event.currentTarget.style.setProperty('--studio-y', '0px');
    };

    return (
      <div dir={dir} className="saqr-studio-page">
        <div className="studio-atmosphere" aria-hidden="true" />
        <main className="studio-shell">
          <section className="studio-hero" aria-labelledby="studio-page-heading" onPointerMove={handleStudioPointerMove} onPointerLeave={resetStudioPointer}>
            <div className="studio-copy">
              <span className="studio-live"><span className="studio-live-indicator" aria-hidden="true"/>{t('onAir')}</span>
              <h1 className="studio-title" id="studio-page-heading">{t('pageTitle')}</h1>
              <span className="studio-title-rule" aria-hidden="true" />
              <p className="studio-description">{t('studioDesc')}</p>
              <div className="studio-wave-wrap" aria-hidden="true">
                <span className="studio-wave-icon"><PodcastIcon /></span>
                <AudioEqualizer />
              </div>
            </div>
            <div className="studio-art">
              <span className="studio-art-disc" aria-hidden="true" />
              <span className="studio-art-halo" aria-hidden="true" />
              <span className="studio-art-ring" aria-hidden="true" />
              <span className="studio-art-ring studio-art-ring-two" aria-hidden="true" />
              <span className="studio-orbit-symbol studio-orbit-mic" aria-hidden="true"><PodcastIcon /></span>
              <span className="studio-orbit-symbol studio-orbit-stars" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m12 2 2.6 7.3L22 12l-7.4 2.7L12 22l-2.6-7.3L2 12l7.4-2.7L12 2Z" /></svg>
              </span>
              <span className="studio-orbit-symbol studio-orbit-film" aria-hidden="true"><DubbingIcon /></span>
              <span className="studio-art-sparkle studio-sparkle-one" aria-hidden="true" />
              <span className="studio-art-sparkle studio-sparkle-two" aria-hidden="true" />
              <img src={saqrAvatar} className="studio-avatar" alt={isAr ? 'صقر في الاستديو' : 'Saqr Studio mascot'} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            </div>
          </section>
          <section className="studio-options" aria-label={t('pageTitle')}>
            <Link to="/podcast" className="studio-option studio-option--podcast">
              <span className="studio-option-icon"><PodcastIcon /></span>
              <div className="studio-option-content">
                <h2 className="studio-option-title">{t('podcast')}</h2>
                <span className="studio-option-arrow" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7" /></svg></span>
              </div>
            </Link>
            <div className="studio-option studio-option--soon" aria-disabled="true">
              <span className="studio-coming-soon">{t('comingSoon')}</span>
              <span className="studio-option-icon"><DubbingIcon /></span>
              <div className="studio-option-content"><h2 className="studio-option-title">{t('dubbing')}</h2></div>
            </div>
          </section>
        </main>
      </div>
    );

};

export default SaqrStudioPage;
