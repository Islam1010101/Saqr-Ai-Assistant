import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../App';

// --- واجهة النجوم المتطايرة ---
interface StarParticle {
    id: number;
    x: number;
    y: number;
    emoji: string;
    velocity: { x: number; y: number };
    opacity: number;
    scale: number;
    rotation: number;
}

const RamadanTreasuresPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const isAr = locale === 'ar';
    const [particles, setParticles] = useState<StarParticle[]>([]);
    const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

    // تأثير حركة الخلفية الهادئة
    const handleMouseMove = (e: React.MouseEvent) => {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        setMousePos({ x, y });
    };

    // --- محرك الانفجار الناعم والبطيء ---
    const explodeStars = (e: React.MouseEvent | React.TouchEvent) => {
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
        
        const newParticles: StarParticle[] = [];
        const emojis = ["🌙", "⭐", "✨", "🕌", "💫", "📿", "🏮"];

        for (let i = 0; i < 30; i++) {
            newParticles.push({
                id: Date.now() + i,
                x: clientX,
                y: clientY,
                emoji: emojis[Math.floor(Math.random() * emojis.length)],
                velocity: {
                    // سرعة أبطأ وانتشار أوسع
                    x: (Math.random() - 0.5) * 12, 
                    y: (Math.random() - 0.5) * 12
                },
                opacity: 1,
                scale: 0.5 + Math.random() * 0.8,
                rotation: Math.random() * 360
            });
        }
        setParticles(prev => [...prev, ...newParticles]);
        
        // صوت هادئ جداً
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
        audio.volume = 0.2;
        audio.play().catch(()=>{});
    };

    // فيزيائيات الحركة (ناعمة وبطيئة)
    useEffect(() => {
        const interval = setInterval(() => {
            setParticles(prev => prev.map(p => ({
                ...p,
                x: p.x + p.velocity.x,
                y: p.y + p.velocity.y,
                rotation: p.rotation + 1, // دوران بطيء
                opacity: p.opacity - 0.008, // اختفاء بطيء جداً
                velocity: { 
                    x: p.velocity.x * 0.98, // احتكاك ناعم
                    y: p.velocity.y * 0.98 + 0.1 // جاذبية خفيفة جداً
                } 
            })).filter(p => p.opacity > 0));
        }, 16);
        return () => clearInterval(interval);
    }, []);

    return (
        <div dir={dir} onMouseMove={handleMouseMove} className="min-h-[100dvh] bg-slate-50 dark:bg-[#020617] transition-colors duration-1000 font-black relative flex flex-col items-center justify-center antialiased overflow-hidden selection:bg-yellow-500/30">
            
            {/* 1. زينة رمضان (بدون قص) */}
            <div className="absolute inset-0 pointer-events-none z-0">
                {/* فوانيس متدلية بأبعاد آمنة */}
                <div className="absolute -top-2 left-[8%] text-[3.5rem] md:text-[6rem] animate-swing origin-top opacity-90 drop-shadow-2xl filter drop-shadow(0 0 15px rgba(255,215,0,0.4))">🏮</div>
                <div className="absolute -top-4 right-[12%] text-[2.5rem] md:text-[5rem] animate-swing-delayed origin-top opacity-80 drop-shadow-2xl">🏮</div>
                <div className="absolute top-[15%] left-[35%] text-[1.5rem] md:text-[3rem] animate-pulse opacity-50">✨</div>
                <div className="absolute top-[20%] right-[8%] text-[1.5rem] md:text-[3rem] animate-pulse delay-700 opacity-50">🌙</div>
                
                {/* خلفية مضيئة ناعمة */}
                <div className="absolute top-[-30%] right-[-20%] w-[80%] h-[80%] bg-yellow-500/10 dark:bg-yellow-600/5 blur-[180px] rounded-full animate-pulse-slow"></div>
                <div className="absolute bottom-[-20%] left-[-20%] w-[70%] h-[70%] bg-purple-600/10 dark:bg-purple-900/10 blur-[180px] rounded-full animate-pulse-slow delay-1000"></div>
            </div>

            {/* 2. زر العودة (مؤمن ضد القص) */}
            <div className="absolute top-8 left-8 z-50">
                <Link to="/" className="glass-panel px-6 py-3 rounded-full text-xs font-bold text-slate-900 dark:text-white hover:bg-yellow-600 hover:text-white transition-all shadow-xl uppercase flex items-center gap-2 border border-yellow-500/20 active:scale-95">
                    <span>⬅</span> {isAr ? 'الرئيسية' : 'Home'}
                </Link>
            </div>

            {/* 3. المحتوى الرئيسي */}
            <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-6xl px-6 text-center space-y-6 md:space-y-10 py-20">
                
                {/* العنوان الرئيسي */}
                <h1 className="text-5xl md:text-[9rem] tracking-tighter text-slate-900 dark:text-white font-black ramadan-title drop-shadow-2xl animate-fade-in-up select-none leading-tight">
                    {isAr ? 'كنوز رمضان' : 'Ramadan Treasures'}
                </h1>

                {/* منطقة الشخصية والشعار */}
                <div className="relative w-full flex justify-center items-center py-4 md:py-8 group cursor-pointer" onClick={explodeStars} onTouchStart={explodeStars}>
                    
                    {/* الشعار المائل (الووتر مارك) - التعديل هنا لتحويله للأبيض في الدارك مود */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] md:w-[700px] opacity-[0.04] dark:opacity-[0.12] transition-all duration-1000 group-hover:scale-105 pointer-events-none">
                        <img 
                            src="/school-logo.png" 
                            alt="School Logo" 
                            className="w-full object-contain rotate-[12deg] dark:brightness-0 dark:invert transition-all duration-700" 
                        />
                    </div>

                    {/* الشخصية الرمضانية (صقر) - بدون إطار */}
                    <div className="relative z-20 w-60 md:w-[30rem] transition-all duration-500 ease-out transform group-hover:-translate-y-2 group-active:scale-[0.98] group-active:brightness-110">
                        {/* هالة نورانية خلف الشخصية */}
                        <div className="absolute inset-0 bg-yellow-500/20 blur-[80px] rounded-full scale-90 animate-pulse-slow"></div>
                        <img 
                            src="/ramadan-saqr.png" 
                            alt="Ramadan Saqr" 
                            // تم إزالة الإطار والبوردر من هنا
                            className="w-full h-auto object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.3)] rounded-[3rem]"
                        />
                    </div>
                </div>

                {/* النصوص السفلية */}
                <div className="space-y-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <div className="glass-panel inline-block px-12 py-6 rounded-full bg-yellow-500/10 dark:bg-yellow-500/5 border border-yellow-500/20 backdrop-blur-xl shadow-lg hover:shadow-yellow-500/10 transition-shadow">
                        <p className="text-lg md:text-3xl text-yellow-800 dark:text-yellow-400 font-bold tracking-wider">
                            {isAr ? 'يوم الاثنين القادم' : 'Next Monday'}
                        </p>
                    </div>
                    
                    <p className="text-4xl md:text-8xl text-slate-800 dark:text-white ramadan-font leading-none pt-4 drop-shadow-xl opacity-90">
                        {isAr ? 'رمضان كريم' : 'Ramadan Kareem'} <span className="text-yellow-500 animate-pulse">🌙</span>
                    </p>
                </div>
            </div>

            {/* 4. الجزيئات المتطايرة (المحسنة) */}
            {particles.map(p => (
                <div 
                    key={p.id} 
                    className="fixed pointer-events-none z-[100] text-3xl md:text-5xl select-none"
                    style={{ 
                        left: p.x, 
                        top: p.y, 
                        opacity: p.opacity,
                        transform: `translate(-50%, -50%) scale(${p.scale}) rotate(${p.rotation}deg)`,
                        transition: 'transform 0.1s linear'
                    }}
                >
                    {p.emoji}
                </div>
            ))}

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Reem+Kufi:wght@700&display=swap');

                .ramadan-title {
                    font-family: 'Reem Kufi', sans-serif;
                    background: linear-gradient(to bottom, #b48c1c, #d4af37, #fcd34d);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    filter: drop-shadow(0 10px 20px rgba(0,0,0,0.1));
                }
                
                .ramadan-font {
                    font-family: 'Reem Kufi', sans-serif;
                }

                @keyframes swing {
                    0%, 100% { transform: rotate(-3deg); }
                    50% { transform: rotate(3deg); }
                }
                .animate-swing { animation: swing 5s ease-in-out infinite; }
                .animate-swing-delayed { animation: swing 7s ease-in-out infinite reverse; }
                
                .glass-panel {
                    backdrop-filter: blur(25px);
                    background: rgba(255, 255, 255, 0.05);
                    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.1);
                }

                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.4; transform: scale(0.9); }
                    50% { opacity: 0.7; transform: scale(1.05); }
                }
                .animate-pulse-slow { animation: pulse-slow 5s infinite; }

                /* للغة العربية */
                [dir="rtl"] .ramadan-font { letter-spacing: 0; }
                
                /* إخفاء السكرول بار للحفاظ على نظافة التصميم */
                ::-webkit-scrollbar { width: 0px; background: transparent; }
            `}</style>
        </div>
    );
};

export default RamadanTreasuresPage;
