import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../App';

// --- الأيقونات ---
const IconPen = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/></svg>;
const IconEraser = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 20H7L3 16C2.5 15.5 2.5 14.5 3 14L13 4L20 11L11 20"/></svg>;
const IconTrash = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/></svg>;
const IconMagic = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 4V2m0 4v2m8-3h-2m4 0h-2M3 10l6 6m-6 0l6-6M2 2l20 20"/></svg>;

const CreatorsStudioPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const isAr = locale === 'ar';
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#ef4444');
    const [lineWidth, setLineWidth] = useState(6);
    const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
    const [mode, setMode] = useState<'cover' | 'innovation'>('cover');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [saqrFeedback, setSaqrFeedback] = useState<string | null>(null);
    const [studentName, setStudentName] = useState("");
    const [step, setStep] = useState<'draw' | 'result'>('draw');

    // تظبيط أبعاد اللوحة لضمان الاستجابة الكاملة
    useEffect(() => {
        const resizeCanvas = () => {
            const canvas = canvasRef.current;
            const container = containerRef.current;
            if (!canvas || !container) return;

            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            // أخذ الأبعاد الحقيقية للحاوية
            canvas.width = container.offsetWidth;
            canvas.height = container.offsetHeight;

            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
        };

        resizeCanvas();
        const timer = setTimeout(resizeCanvas, 100);
        window.addEventListener('resize', resizeCanvas);
        return () => {
            window.removeEventListener('resize', resizeCanvas);
            clearTimeout(timer);
        };
    }, []);

    const getPos = (e: any) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return { x: clientX - rect.left, y: clientY - rect.top };
    };

    const startDrawing = (e: any) => {
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        setIsDrawing(true);
        const pos = getPos(e);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
    };

    const draw = (e: any) => {
        if (!isDrawing) return;
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        const pos = getPos(e);
        ctx.lineWidth = lineWidth;
        // اللون يتغير للأبيض/الأسود في حالة الممحاة حسب الثيم
        ctx.strokeStyle = tool === 'eraser' ? (document.documentElement.classList.contains('dark') ? '#020617' : '#ffffff') : color;
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
    };

    const stopDrawing = () => setIsDrawing(false);

    const handleAnalyze = () => {
        setIsAnalyzing(true);
        setTimeout(() => {
            setIsAnalyzing(false);
            setSaqrFeedback(mode === 'cover' 
                ? (isAr ? "تحليل صقر: غلاف مذهل! التناسق اللوني رائع والخط يعبر عن روح القصة." : "Saqr Analyze: Stunning cover! Great color harmony and the font reflects the story spirit.")
                : (isAr ? "تحليل صقر: ابتكار عبقري! المخطط الهندسي دقيق جداً ويوضح فكرتك بذكاء." : "Saqr Analyze: Genius innovation! The diagram is precise and shows your brilliant idea."));
            setStep('result');
            new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3').play().catch(()=>{});
        }, 2500);
    };

    return (
        <div dir={dir} className="min-h-screen bg-slate-50 dark:bg-[#020617] transition-colors duration-700 font-black relative pb-20 pt-10 md:pt-24 overflow-x-hidden">
            
            {/* الخلفية المضيئة المطابقة للموقع */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-50">
              <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-red-600/10 dark:bg-red-500/20 blur-[150px] rounded-full animate-pulse"></div>
              <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-green-600/10 dark:bg-green-500/20 blur-[150px] rounded-full animate-pulse [animation-delay:2s]"></div>
            </div>

            {/* الهيدر المطور مع الشعار الصحيح unnamed.png */}
            <header className="relative text-center px-4 mb-10 z-10">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-gradient-to-r from-red-600 to-yellow-500 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-all duration-1000"></div>
                        <img src="/unnamed.png" alt="Saqr Studio Logo" className="w-32 h-32 md:w-48 md:h-48 object-contain animate-float drop-shadow-2xl" />
                    </div>
                    <h1 className="text-4xl md:text-7xl lg:text-8xl tracking-tighter text-slate-950 dark:text-white uppercase leading-none drop-shadow-sm">
                        {isAr ? 'مرسم صقر الذكي' : 'SAQR ART STUDIO'}
                    </h1>
                    <div className="h-1.5 w-24 md:w-40 bg-red-600 rounded-full mx-auto mt-2"></div>
                </div>
            </header>

            <div className="max-w-[1900px] mx-auto px-4 md:px-10 grid grid-cols-1 xl:grid-cols-12 gap-6 md:gap-10 items-start relative z-10">
                
                {/* 1. لوحة التحكم - أدوات الرسم */}
                <div className="xl:col-span-3 order-2 xl:order-1 space-y-6 w-full">
                    <div className="glass-panel p-6 md:p-8 rounded-[2.5rem] border border-white/20 dark:border-white/5 shadow-2xl bg-white/60 dark:bg-slate-900/40 backdrop-blur-3xl space-y-8">
                        <div className="space-y-4">
                            <h3 className="text-red-600 text-sm md:text-lg uppercase tracking-widest">{isAr ? 'اختر التحدي' : 'Select Mode'}</h3>
                            <div className="grid grid-cols-1 gap-3">
                                <button onClick={() => setMode('cover')} className={`py-4 rounded-2xl transition-all font-black shadow-sm ${mode === 'cover' ? 'bg-red-600 text-white scale-[1.02]' : 'bg-black/5 dark:bg-white/5 dark:text-white hover:bg-black/10'}`}>{isAr ? '🎨 غلاف كتاب' : '🎨 Book Cover'}</button>
                                <button onClick={() => setMode('innovation')} className={`py-4 rounded-2xl transition-all font-black shadow-sm ${mode === 'innovation' ? 'bg-green-600 text-white scale-[1.02]' : 'bg-black/5 dark:bg-white/5 dark:text-white hover:bg-black/10'}`}>{isAr ? '🚀 ابتكار علمي' : '🚀 Innovation'}</button>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-slate-500 dark:text-slate-400 text-sm uppercase tracking-widest">{isAr ? 'صندوق الأدوات' : 'The Toolbox'}</h3>
                            <div className="flex gap-3">
                                <button onClick={() => setTool('pen')} className={`flex-1 p-5 rounded-2xl border-2 transition-all ${tool === 'pen' ? 'border-red-600 bg-red-600/10 text-red-600' : 'border-transparent bg-black/5 dark:bg-white/5 dark:text-white'}`}><IconPen /></button>
                                <button onClick={() => setTool('eraser')} className={`flex-1 p-5 rounded-2xl border-2 transition-all ${tool === 'eraser' ? 'border-red-600 bg-red-600/10 text-red-600' : 'border-transparent bg-black/5 dark:bg-white/5 dark:text-white'}`}><IconEraser /></button>
                                <button onClick={() => canvasRef.current?.getContext('2d')?.clearRect(0,0,5000,5000)} className="p-5 rounded-2xl bg-red-500/10 text-red-600 hover:bg-red-600 hover:text-white transition-all"><IconTrash /></button>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center px-1">
                                    <span className="text-[10px] text-slate-400 uppercase font-black">{isAr ? 'اللون' : 'Color'}</span>
                                    <span className="text-[10px] font-mono opacity-50">{color}</span>
                                </div>
                                <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-14 rounded-2xl cursor-pointer bg-transparent border-none p-0 overflow-hidden" />
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between text-[10px] text-slate-400 uppercase font-black px-1">
                                    <span>{isAr ? 'حجم الخط' : 'Size'}</span>
                                    <span>{lineWidth}px</span>
                                </div>
                                <input type="range" min="2" max="60" value={lineWidth} onChange={(e) => setLineWidth(Number(e.target.value))} className="w-full accent-red-600 h-1.5 bg-black/10 dark:bg-white/10 rounded-full appearance-none cursor-pointer" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. اللوحة المركزية (الكانفاس) */}
                <div className="xl:col-span-6 order-1 xl:order-2 flex flex-col gap-6 w-full h-full min-h-[500px] md:min-h-[700px]">
                    <div ref={containerRef} className="flex-1 bg-white/90 dark:bg-[#020617]/80 backdrop-blur-md border-4 border-white/20 dark:border-white/5 rounded-[3rem] shadow-3xl overflow-hidden relative cursor-crosshair group/canvas">
                        <canvas 
                            ref={canvasRef}
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                            onTouchStart={startDrawing}
                            onTouchMove={draw}
                            onTouchEnd={stopDrawing}
                            className="touch-none w-full h-full"
                        />
                        {/* لوجو خلفية باهت للوحة */}
                        <div className="absolute inset-0 flex items-center justify-center -z-10 opacity-[0.03] dark:opacity-[0.05] pointer-events-none rotate-12 transition-opacity group-hover/canvas:opacity-[0.07]">
                            <img src="/unnamed.png" alt="Watermark" className="w-[60%] object-contain" />
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleAnalyze} 
                        disabled={isAnalyzing || step === 'result'}
                        className="group relative overflow-hidden py-6 md:py-8 rounded-[2.5rem] bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-black text-2xl md:text-4xl shadow-3xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-yellow-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                        <span className="relative flex items-center justify-center gap-4">
                           {isAnalyzing ? (isAr ? 'صقر يحلل ريشتك...' : 'Analyzing Your Brush...') : <><IconMagic /> {isAr ? 'أظهر إبداعك لصقر' : 'Show Saqr Your Magic'}</>}
                        </span>
                    </button>
                </div>

                {/* 3. نافذة فيدباك صقر والنتيجة */}
                <div className="xl:col-span-3 order-3 space-y-6 w-full">
                    <div className="glass-panel p-8 rounded-[3rem] border border-white/20 dark:border-white/5 shadow-2xl bg-white/60 dark:bg-slate-900/40 backdrop-blur-3xl text-center min-h-[450px] flex flex-col justify-center relative overflow-hidden">
                        {step === 'draw' ? (
                            <div className="space-y-8 animate-fade-in">
                                <div className="relative inline-block">
                                    <div className="absolute -inset-2 bg-red-600 rounded-full blur opacity-20 animate-pulse"></div>
                                    <img src="/unnamed.png" className="w-32 h-32 md:w-40 md:h-40 object-contain relative z-10" alt="Saqr Avatar" />
                                </div>
                                <div className="space-y-3">
                                    <p className="text-slate-950 dark:text-white text-xl md:text-2xl font-black leading-tight tracking-tighter">
                                        {isAr ? 'مستعد يا بطل؟' : 'Ready Hero?'}
                                    </p>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base font-bold italic leading-relaxed">
                                        "{isAr ? 'ارسم فكرتك الآن، وسأقوم بتحليل كل لمسة من ريشتك الذكية!' : 'Draw your idea now, and I will analyze every touch of your smart brush!'}"
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-8 animate-fade-up">
                                <img src="/unnamed.png" className="w-24 h-24 md:w-32 md:h-32 object-contain mx-auto drop-shadow-xl" alt="Saqr Success" />
                                <div className="bg-slate-950 dark:bg-white text-white dark:text-slate-950 p-6 rounded-[2rem] shadow-xl border-t-8 border-green-500">
                                    <p className="text-lg md:text-xl font-black leading-relaxed">{saqrFeedback}</p>
                                </div>
                                <div className="space-y-4">
                                    <input 
                                        type="text" 
                                        placeholder={isAr ? "اكتب اسمك يا مبدع" : "Your name, artist"}
                                        value={studentName}
                                        onChange={(e) => setStudentName(e.target.value)}
                                        className="w-full p-5 rounded-2xl border-2 border-slate-200 dark:border-white/10 outline-none focus:border-green-500 dark:bg-black/40 dark:text-white text-center font-black text-lg shadow-inner"
                                    />
                                    <button 
                                        onClick={() => { alert(isAr ? `تم حفظ عملك يا ${studentName}! سيعرض قريباً في المعرض.` : `Saved! ${studentName}, your work will be in the gallery soon.`); setStep('draw'); setSaqrFeedback(null); }}
                                        className="w-full py-5 bg-green-600 text-white rounded-[1.8rem] font-black text-xl shadow-xl hover:bg-green-700 transition-all hover:-translate-y-1 active:translate-y-0"
                                    >
                                        {isAr ? 'توثيق الإنجاز ✨' : 'Publish Masterpiece ✨'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ستايلات الأنيميشن واللمسات النهائية */}
            <style>{`
                @keyframes float { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-15px) rotate(5deg); } }
                .animate-float { animation: float 5s ease-in-out infinite; }
                .glass-panel { transition: transform 0.3s ease, box-shadow 0.3s ease; }
                input[type="range"]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 18px;
                    height: 18px;
                    background: #ef4444;
                    cursor: pointer;
                    border-radius: 50%;
                    border: 3px solid white;
                    box-shadow: 0 0 10px rgba(0,0,0,0.1);
                }
                * { font-style: normal !important; -webkit-font-smoothing: antialiased; }
                canvas { cursor: url('https://cur.cursors-4u.net/others/oth-2/oth135.cur'), auto; }
            `}</style>
        </div>
    );
};

export default CreatorsStudioPage;
