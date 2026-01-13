/* داخل كود AboutPage.tsx ابحث عن نهاية قسم النص التعريفي (p1 و p2) */

<section className="glass-panel p-8 rounded-[2.5rem] overflow-hidden">
    <h2 className="text-2xl font-black mb-6 text-gray-800 dark:text-white flex items-center gap-3">
        <span className="w-2 h-8 bg-green-700 rounded-full shadow-[0_0_10px_rgba(0,115,47,0.4)]"></span>
        {t('aboutSchoolTitle')}
    </h2>
    <div className="space-y-4 text-lg leading-relaxed text-gray-600 dark:text-gray-300 font-medium">
        <p>{t('p1')}</p>
        <p>{t('p2')}</p>
    </div>

    {/* إضافة رابط الموقع الرسمي في نهاية الفقرة */}
    <div className="mt-8 pt-6 border-t border-white/10 flex justify-center lg:justify-start">
        <a 
            href="https://www.falcon-school.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="glass-button-black inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-black transition-all hover:gap-5"
        >
            <span>{t('schoolWebsite')}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rotate-[-45deg] rtl:rotate-[135deg]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
        </a>
    </div>
</section>
