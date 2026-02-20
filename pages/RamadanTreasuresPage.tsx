import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../App';

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
    
    // --- State المسابقة ---
    const [answer, setAnswer] = useState("");
    const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
    
    const [securityCode, setSecurityCode] = useState("");
    const [isCodeCorrect, setIsCodeCorrect] = useState(false);
    
    const [winnerData, setWinnerData] = useState({ name: "", grade: "", email: "" });
    const [errorMsg, setErrorMsg] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    // --- State الفائز العام ---
    const [globalWinner, setGlobalWinner] = useState<{name: string, grade: string} | null>(null);

    // التحقق عند تحميل الصفحة
    useEffect(() => {
        const savedWinner = localStorage.getItem("ramadanQuestWinner");
        if (savedWinner) {
            setGlobalWinner(JSON.parse(savedWinner));
        }
    }, []);

    // الإجابات والكود الصحيح
    const validAnswers = ["مدفع رمضان", "the iftar cannon", "midfa al iftar"];
    const validCode = "1906efips2026";

    const handleAnswerSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const cleanAnswer = answer.trim().toLowerCase();
        if (validAnswers.includes(cleanAnswer)) {
            setIsAnswerCorrect(true);
            setErrorMsg("");
            explodeStars(window.innerWidth / 2, window.innerHeight / 2, 50);
        } else {
            setErrorMsg(isAr ? "إجابة خاطئة، حاول مرة أخرى يا بطل!" : "Wrong answer, try again hero!");
        }
    };

    const handleCodeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (securityCode.trim() === validCode) {
            setIsCodeCorrect(true);
            setErrorMsg("");
        } else {
            setErrorMsg(isAr ? "كود غير صحيح!" : "Invalid Security Code!");
        }
    };

    const handleFinalSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (winnerData.name && winnerData.grade && winnerData.email) {
            
            const theWinner = { name: winnerData.name, grade: winnerData.grade };
            
            // تسجيل الفائز في اللوكال ستوريدج
            localStorage.setItem("ramadanQuestWinner", JSON.stringify(theWinner));
            setGlobalWinner(theWinner); 
            
            // إرسال حدث (Event) لصفحة التقارير
            const reportData = {
                event: "RamadanQuestWinner",
                timestamp: new Date().toISOString(),
                studentName: winnerData.name,
                studentEmail: winnerData.email,
                studentGrade: winnerData.grade,
                enteredAnswer: answer,
                enteredCode: securityCode
            };
            
            const existingReports = JSON.parse(localStorage.getItem("saqrReports") || "[]");
            localStorage.setItem("saqrReports", JSON.stringify([...existingReports, reportData]));

            setIsSubmitted(true);
            explodeStars(window.innerWidth / 2, window.innerHeight / 2, 100);
        }
    };

    const explodeStars = (x: number, y: number, count: number = 30) => {
        const newParticles: StarParticle[] = [];
        const emojis = ["🌙", "⭐", "✨", "🕌", "💫", "📿", "🏮", "🎉", "🏆"];

        for (let i = 0; i < count; i++) {
            newParticles.push({
                id: Date.now() + i,
                x: x,
                y: y,
                emoji: emojis[Math.floor(Math.random() * emojis.length)],
                velocity: { x: (Math.random() - 0.5) * 15, y: (Math.random() - 0.5) * 15 },
                opacity: 1,
                scale: 0.5 + Math.random() * 0.8,
                rotation: Math.random() * 360
            });
        }
        setParticles(prev => [...prev, ...newParticles]);
        new Audio("https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3").play().catch(()=>{});
    };

    const handleAvatarClick = (e: React.MouseEvent | React.TouchEvent) => {
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
        explodeStars(clientX, clientY, 20);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setParticles(prev => prev.map(p => ({
                ...p,
                x: p.x + p.velocity.x,
                y: p.y + p.velocity.y,
                rotation: p.rotation + 1, 
                opacity: p.opacity - 0.01, 
                velocity: { x: p.velocity.x * 0.98, y: p.velocity.y * 0.98 + 0.1 } 
            })).filter(p => p.opacity > 0));
        }, 16);
        return () => clearInterval(interval);
    }, []);

    return (
        // تم إزالة العزل (fixed inset-0 z-200) لجعل الصفحة طبيعية مع الهيدر والفوتر
        // تم إزالة onMouseMove الثقيل لتحسين السكرول
        <div dir={dir} className="min-h-[100dvh] bg-transparent font-black relative flex flex-col items-center antialiased selection:bg-yellow-500/30 pb-20 w-full overflow-hidden">
            
            {/* زينة رمضان - بخلفية هادية */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute -top-2 left-[8%] text-[3.5rem] md:text-[6rem] animate-swing origin-top opacity-90 drop-shadow-2xl">🏮</div>
                <div className="absolute -top-4 right-[12%] text-[2.5rem] md:text-[5rem] animate-swing-delayed origin-top opacity-80 drop-shadow-2xl">🏮</div>
                <div className="absolute top-[15%] left-[35%] text-[1.5rem] md:text-[3rem] animate-pulse opacity-50">✨</div>
                <div className="absolute top-[20%] right-[8%] text-[1.5rem] md:text-[3rem] animate-pulse delay-700 opacity-50">🌙</div>
            </div>

            {/* زر العودة - اختياري لو حابب تسيبه جوه محتوى الصفحة */}
            <div className="w-full max-w-6xl px-4 pt-6 md:pt-10 z-10 flex justify-start">
                <Link to="/" className="glass-panel px-5 py-2 md:px-6 md:py-3 rounded-full text-[10px] md:text-xs font-bold text-slate-900 dark:text-white hover:bg-yellow-600 hover:text-white transition-all shadow-xl uppercase flex items-center gap-2 border border-yellow-500/20 active:scale-95">
                    <span>⬅</span> {isAr ? "الرئيسية" : "Home"}
                </Link>
            </div>

            <div className="relative z-10 flex flex-col items-center w-full max-w-4xl px-4 pt-10 md:pt-16 space-y-6 md:space-y-10">
                
                <h1 className="text-4xl md:text-[7rem] tracking-tighter text-slate-900 dark:text-white font-black ramadan-title drop-shadow-2xl animate-fade-in-up text-center leading-tight">
                    {isAr ? "كنوز صقر الإمارات" : "Emirates Falcon Treasures"}
                </h1>

                <div className="relative w-full flex justify-center items-center py-2 group cursor-pointer" onClick={handleAvatarClick} onTouchStart={handleAvatarClick}>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] md:w-[600px] opacity-[0.05] dark:opacity-[0.12] transition-all duration-1000 group-hover:scale-105 pointer-events-none">
                        <img src="/school-logo.png" alt="School Logo" className="w-full object-contain rotate-[12deg] dark:brightness-0 dark:invert" />
                    </div>
                    <div className="relative z-20 w-48 md:w-[22rem] transition-all duration-500 ease-out transform group-hover:-translate-y-2 group-active:scale-[0.98]">
                        <div className="absolute inset-0 bg-yellow-500/20 blur-[60px] rounded-full scale-90 animate-pulse-slow"></div>
                        <img src="/ramadan-saqr.png" alt="Ramadan Saqr" className="w-full h-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.3)] rounded-[3rem]" />
                    </div>
                </div>

                <div className="w-full max-w-2xl animate-fade-in-up pb-10" style={{ animationDelay: "0.3s" }}>
                    
                    {/* شاشة الفوز / الإغلاق */}
                    {globalWinner || isSubmitted ? (
                        <div className="glass-panel p-8 md:p-12 rounded-[2.5rem] border-2 border-yellow-400 bg-yellow-500/10 text-center space-y-6 transform scale-105 transition-all">
                            <div className="text-6xl animate-bounce">🏆</div>
                            <h2 className="text-2xl md:text-4xl text-yellow-600 dark:text-yellow-400 font-black tracking-tight leading-snug">
                                {isAr ? "انتهت المهمة! لدينا فائز" : "Quest Ended! We have a Winner"}
                            </h2>
                            <div className="text-xl md:text-3xl text-slate-800 dark:text-white py-4 border-y border-yellow-500/30">
                                <p className="text-red-600 dark:text-red-400 mb-2 font-extrabold">{globalWinner ? globalWinner.name : winnerData.name}</p>
                                <p className="opacity-80 text-lg md:text-2xl">
                                    {isAr ? "الصف: " + (globalWinner ? globalWinner.grade : winnerData.grade) : "Grade: " + (globalWinner ? globalWinner.grade : winnerData.grade)}
                                </p>
                            </div>
                            <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mt-4 bg-black/5 dark:bg-white/5 p-4 rounded-xl">
                                {isAr ? "انتظروا السؤال القادم قريباً.." : "Wait for the next quest soon.."}
                            </p>
                        </div>
                    ) : (
                        <div className="glass-panel p-6 md:p-10 rounded-[2.5rem] border border-yellow-500/30 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl shadow-2xl space-y-6">
                            
                            {/* 1. السؤال الأول */}
                            <div className="space-y-4 text-center">
                                <h3 className="text-xl md:text-3xl text-slate-900 dark:text-white font-black leading-snug">
                                    {isAr ? "ماهي الطريقة التقليدية التي كانت تستخدم قديما ومازالت كتقليد لإعلام الناس بموعد الإفطار في رمضان؟" 
                                         : "What is the traditional method used in the past and still as a tradition to inform people of Iftar time?"}
                                </h3>
                                <div className="inline-block px-4 py-2 rounded-xl bg-red-600/10 border border-red-600/20 text-red-600 dark:text-red-400 text-sm md:text-base">
                                    💡 {isAr ? "تلميح الكنز: المكتبة - دولاب 31 - رف 3" : "Hint: Library - Cabinet 31 - Shelf 3"}
                                </div>
                            </div>

                            {errorMsg && <p className="text-red-500 text-center animate-pulse">{errorMsg}</p>}

                            {/* 2. إدخال الإجابة */}
                            {!isAnswerCorrect && (
                                <form onSubmit={handleAnswerSubmit} className="flex flex-col gap-4">
                                    <input 
                                        type="text" required
                                        placeholder={isAr ? "أدخل الإجابة هنا..." : "Enter your answer..."}
                                        value={answer} onChange={(e) => setAnswer(e.target.value)}
                                        className="w-full p-4 rounded-2xl bg-white dark:bg-black/50 border-2 border-slate-200 dark:border-slate-700 focus:border-yellow-500 outline-none text-center text-lg dark:text-white transition-all shadow-inner"
                                    />
                                    <button type="submit" className="w-full py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-lg hover:bg-yellow-500 dark:hover:bg-yellow-500 hover:text-white transition-colors shadow-lg">
                                        {isAr ? "تحقق من الإجابة" : "Check Answer"}
                                    </button>
                                </form>
                            )}

                            {/* 3. إدخال الكود السري */}
                            {isAnswerCorrect && !isCodeCorrect && (
                                <form onSubmit={handleCodeSubmit} className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="text-center text-green-600 dark:text-green-400 mb-2 font-bold text-lg">✅ {isAr ? "إجابة صحيحة! أدخل كود الكنز:" : "Correct! Enter Treasure Code:"}</div>
                                    <input 
                                        type="text" required
                                        placeholder={isAr ? "كود الكنز..." : "Treasure Code..."}
                                        value={securityCode} onChange={(e) => setSecurityCode(e.target.value)}
                                        className="w-full p-4 rounded-2xl bg-white dark:bg-black/50 border-2 border-slate-200 dark:border-slate-700 focus:border-green-500 outline-none text-center text-lg dark:text-white transition-all font-mono tracking-widest shadow-inner"
                                    />
                                    <button type="submit" className="w-full py-4 rounded-2xl bg-green-600 text-white font-black text-lg hover:bg-green-500 transition-colors shadow-lg">
                                        {isAr ? "تأكيد الكود" : "Verify Code"}
                                    </button>
                                </form>
                            )}

                            {/* 4. إدخال بيانات الفائز */}
                            {isCodeCorrect && !isSubmitted && (
                                <form onSubmit={handleFinalSubmit} className="flex flex-col gap-4 animate-in fade-in zoom-in duration-500">
                                    <div className="text-center text-yellow-600 dark:text-yellow-400 font-black text-2xl mb-2">🎉 {isAr ? "أنت بطل! سجل بياناتك لاستلام الجائزة" : "You are a Hero! Register Data to claim prize"}</div>
                                    <input 
                                        type="text" required placeholder={isAr ? "الاسم الثلاثي" : "Full Name"}
                                        value={winnerData.name} onChange={(e) => setWinnerData({...winnerData, name: e.target.value})}
                                        className="w-full p-4 rounded-2xl bg-white dark:bg-black/50 border-2 border-slate-200 dark:border-slate-700 outline-none dark:text-white text-center shadow-inner"
                                    />
                                    <input 
                                        type="text" required placeholder={isAr ? "الصف والشعبة (مثال: 5A)" : "Grade & Section (e.g. 5A)"}
                                        value={winnerData.grade} onChange={(e) => setWinnerData({...winnerData, grade: e.target.value})}
                                        className="w-full p-4 rounded-2xl bg-white dark:bg-black/50 border-2 border-slate-200 dark:border-slate-700 outline-none dark:text-white text-center shadow-inner"
                                    />
                                    <input 
                                        type="email" required placeholder={isAr ? "البريد الإلكتروني المدرسي" : "School Email"}
                                        value={winnerData.email} onChange={(e) => setWinnerData({...winnerData, email: e.target.value})}
                                        className="w-full p-4 rounded-2xl bg-white dark:bg-black/50 border-2 border-slate-200 dark:border-slate-700 outline-none dark:text-white text-center shadow-inner" dir="ltr"
                                    />
                                    <button type="submit" className="w-full py-4 mt-2 rounded-2xl bg-gradient-to-r from-yellow-600 to-yellow-400 text-white font-black text-xl shadow-xl hover:scale-105 active:scale-95 transition-all">
                                        {isAr ? "تأكيد واستلام الجائزة 🎁" : "Confirm & Claim Prize 🎁"}
                                    </button>
                                </form>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {particles.map(p => (
                <div key={p.id} className="fixed pointer-events-none z-[100] text-2xl md:text-4xl select-none"
                    style={{ left: p.x, top: p.y, opacity: p.opacity, transform: `translate(-50%, -50%) scale(${p.scale}) rotate(${p.rotation}deg)`, transition: "transform 0.1s linear" }}>
                    {p.emoji}
                </div>
            ))}

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Reem+Kufi:wght@700&display=swap');
                .ramadan-title {
                    font-family: 'Reem Kufi', sans-serif;
                    background: linear-gradient(to bottom, #b48c1c, #d4af37, #fcd34d);
                    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
                }
                .ramadan-font { font-family: 'Reem Kufi', sans-serif; }
                @keyframes swing { 0%, 100% { transform: rotate(-3deg); } 50% { transform: rotate(3deg); } }
                .animate-swing { animation: swing 5s ease-in-out infinite; }
                .animate-swing-delayed { animation: swing 7s ease-in-out infinite reverse; }
                .glass-panel { backdrop-filter: blur(25px); }
                @keyframes pulse-slow { 0%, 100% { opacity: 0.4; transform: scale(0.9); } 50% { opacity: 0.7; transform: scale(1.05); } }
                .animate-pulse-slow { animation: pulse-slow 5s infinite; }
                [dir="rtl"] .ramadan-font { letter-spacing: 0; }
                /* تحسينات عامة للسكرول */
                ::-webkit-scrollbar { width: 8px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: #d4af37; border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default RamadanTreasuresPage;
