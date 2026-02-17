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
}

const RamadanTreasuresPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const isAr = locale === 'ar';
    const [particles, setParticles] = useState<StarParticle[]>([]);
    const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

    // تأثير حركة الخلفية مع الماوس
    const handleMouseMove = (e: React.MouseEvent) => {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        setMousePos({ x, y });
    };

    // --- محرك انفجار النجوم والهلال ---
    const explodeStars = (e: React.MouseEvent | React.TouchEvent) => {
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
        
        const newParticles: StarParticle[] = [];
        const emojis = ["🌙", "⭐", "✨", "🕌", "💫", "📿"];

        for (let i = 0; i < 25; i++) {
            newParticles.push({
                id: Date.now() + i,
                x: clientX,
                y: clientY,
                emoji: emojis[Math.floor(Math.random() * emojis.length)],
                velocity: {
                    x: (Math.random() - 0.5) * 20,
                    y: (Math.random() - 0.5) * 20
                },
                opacity: 1,
                scale: 0.5 + Math.random()
            });
        }
        setParticles(prev => [...prev, ...newParticles]);
        // صوت نقرة خفيفة
        new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3').play().catch(()=>{});
    };

    // تحديث فيزيائيات الجزيئات
    useEffect(() => {
        const interval = setInterval(() => {
            setParticles(prev => prev.map(p => ({
                ...p,
                x: p.x + p.velocity.x,
                y: p.y + p.velocity.y,
                opacity: p.opacity - 0.02, // اختفاء تدريجي
                velocity: { x: p.velocity.x * 0.94, y: p.velocity.y * 0.94 + 0.5 } // جاذبية
            })).filter(p => p.opacity > 0));
        }, 16);
        return () => clearInterval(interval);
    }, []);

    return (
        <div dir={dir} onMouseMove={handleMouseMove} className="min-h-[100dvh] bg-slate-50 dark:bg-[#020617] transition-colors duration-700 font-black relative overflow-hidden flex flex-col items-center justify-center antialiased selection:bg-yellow-500/30">
            
            {/* 1. زينة رمضان (فوانيس ونجوم) */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
                {/* فوانيس متدلية */}
                <div className="absolute -top-5 left-[10%] text-[4rem] md:text-[6rem] animate-swing origin-top opacity-90 drop-shadow-lg filter drop-shadow(0 10px 20px rgba(255,215,0,0.3))">🏮</div>
                <div className="absolute -top-16 right-[15%] text-[3rem] md:text-[5rem] animate-swing-delayed origin-top opacity-80 drop-shadow-lg">🏮</div>
                <div className="absolute top-10 left-[40%] text-[2rem] md:text-[3rem] animate-pulse opacity-60">✨</div>
                <div className="absolute top-20 right-[5%] text-[2rem] md:text-[3rem] animate-pulse delay-700 opacity-60">🌙</div>
                
                {/* خلفية مضيئة */}
                <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] bg-yellow-500/10 dark:bg-yellow-400/5 blur-[150px] rounded-full animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-600/10 dark:bg-purple-500/10 blur-[150px] rounded-full animate-pulse delay-1000"></div>
            </div>

            {/* 2. زر العودة */}
            <div className="absolute top-6 left-6 z-50">
                <Link to="/" className="glass-panel px-6 py-3 rounded-full text-xs font-bold text-slate-900 dark:text-white hover:bg-yellow-500 hover:text-white transition-all shadow-xl uppercase flex items-center gap-2 border border-yellow-500/20">
                    <span>⬅</span> {isAr ? 'الرئيسية' : 'Home'}
                </Link>
            </div>

            {/* 3. المحتوى الرئيسي */}
            <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-5xl px-4 text-center space-y-4 md:space-y-8">
                
                {/* العنوان الرئيسي */}
                <h1 className="text-6xl md:text-[8rem] tracking-tighter text-slate-950 dark:text-white font-black ramadan-title drop-shadow-2xl animate-fade-in-up select-none">
                    {isAr ? 'كنوز رمضان' : 'Ramadan Treasures'}
                </h1>

                {/* منطقة الشخصية والشعار */}
                <div className="relative w-full flex justify-center items-center py-6 md:py-10 group cursor-pointer" onClick={explodeStars} onTouchStart={explodeStars}>
                    
                    {/* الشعار المائل (الووتر مارك) */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[650px] opacity-[0.05] dark:opacity-[0.15] dark:brightness-150 transition-all duration-700 group-hover:scale-110 group-hover:opacity-20 pointer-events-none">
                        <img src="/school-logo.png" alt="School Logo" className="w-full object-contain rotate-[15deg]" />
                    </div>

                    {/* الشخصية الرمضانية (صقر) - الاسم الجديد */}
                    <div className="relative z-20 w-64 md:w-[28rem] transition-transform duration-300 transform group-hover:-translate-y-4 group-active:scale-95">
                        {/* هالة نورانية خلف الشخصية */}
                        <div className="absolute inset-0 bg-yellow-500/30 blur-[60px] rounded-full scale-75 animate-pulse-slow"></div>
                        <img 
                            src="/ramadan-saqr.png" 
                            alt="Ramadan Saqr" 
                            className="w-full h-auto object-contain drop-shadow-[0_20px_60px_rgba(0,0,0,0.4)] rounded-[2.5rem] border-4 border-white/30 dark:border-yellow-500/20 ring-4 ring-black/5"
                        />
                        {/* وميض أبيض عند الضغط */}
                        <div className="absolute inset-0 bg-white/40 rounded-[2.5rem] opacity-0 group-active:opacity-100 transition-opacity duration-100 pointer-events-none"></div>
                        <p className="mt-4 text-xs md:text-sm opacity-50 font-bold tracking-widest uppercase animate-bounce">{isAr ? 'اضغط عليّ للمفاجأة' : 'Tap me for magic'}</p>
                    </div>
                </div>

                {/* النصوص السفلية */}
                <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <div className="glass-panel inline-block px-10 py-5 rounded-3xl bg-yellow-500/10 dark:bg-yellow-500/10 border border-yellow-500/30 backdrop-blur-md shadow-lg transform hover:scale-105 transition-transform">
                        <p className="text-xl md:text-4xl text-yellow-700 dark:text-yellow-400 font-bold tracking-wide">
                            {isAr ? 'قريباً يوم الاثنين القادم' : 'Coming Soon Next Monday'}
                        </p>
                    </div>
                    
                    <p className="text-5xl md:text-8xl text-slate-800 dark:text-white ramadan-font leading-tight pt-2 drop-shadow-lg">
                        {isAr ? 'رمضان كريم' : 'Ramadan Kareem'} <span className="text-yellow-500">🌙</span>
                    </p>
                </div>
            </div>

            {/* 4. الجزيئات المتطايرة (Render Particles) */}
            {particles.map(p => (
                <div 
                    key={p.id} 
                    className="fixed pointer-events-none z-[100] text-3xl md:text-5xl select-none"
                    style={{ 
                        left: p.x, 
                        top: p.y, 
                        opacity: p.opacity,
                        transform: `scale(${p.scale}) rotate(${p.x * 2}deg)`
                    }}
                >
                    {p.emoji}
                </div>
            ))}

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Reem+Kufi:wght@700&display=swap');

                .ramadan-title {
                    font-family: 'Reem Kufi', sans-serif;
                    background: linear-gradient(to bottom, #b48c1c, #d4af37);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    filter: drop-shadow(0 4px 15px rgba(212, 175, 55, 0.4));
                }
                
                .ramadan-font {
                    font-family: 'Reem Kufi', sans-serif;
                }

                @keyframes swing {
                    0%, 100% { transform: rotate(-5deg); }
                    50% { transform: rotate(5deg); }
                }
                .animate-swing { animation: swing 3s ease-in-out infinite; }
                .animate-swing-delayed { animation: swing 4.5s ease-in-out infinite reverse; }
                
                .glass-panel {
                    backdrop-filter: blur(20px);
                    background: rgba(255, 255, 255, 0.1);
                    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
                }

                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.3; transform: scale(0.8); }
                    50% { opacity: 0.6; transform: scale(1.1); }
                }
                .animate-pulse-slow { animation: pulse-slow 4s infinite; }

                /* للغة العربية */
                [dir="rtl"] .ramadan-font { letter-spacing: 0; }
            `}</style>
        </div>
    );
};

export default RamadanTreasuresPage;
