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

    // تظبيط أبعاد اللوحة - نسخة "محصنة"
    useEffect(() => {
        console.log("Studio Page Loaded - Setting up Canvas...");
        const resizeCanvas = () => {
            const canvas = canvasRef.current;
            const container = containerRef.current;
            if (!canvas || !container) return;

            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            // ضبط الأبعاد بناءً على مساحة الـ Div الأب
            canvas.width = container.offsetWidth;
            canvas.height = container.offsetHeight;

            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            console.log(`Canvas Resized: ${canvas.width}x${canvas.height}`);
        };

        // تشغيل التعديل فوراً وبعد 100ms لضمان ثبات الـ CSS
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
        <div dir={dir} className="min-h-screen bg-slate-50 dark:bg-[#020617] transition-colors duration-700 font-black relative pb-20 pt-24 overflow-x-hidden">
            
            {/* الهيدر */}
            <header className="relative text-center px-4 mb-8 z-10">
                <div className="flex flex-col items-center gap-4">
                    <img src="/unnamed.jpg" alt="Saqr Artist" className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-red-600 shadow-2xl object-cover animate-float" />
                    <h1 className="text-3xl md:text-6xl tracking-tighter text-slate-950 dark:text-white uppercase">
                        {isAr ? 'مرسم صقر المبدع' : 'SAQR ART STUDIO'}
                    </h1>
                </div>
            </header>

            <div className="max-w-[1800px] mx-auto px-4 md:px-10 grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                
                {/* 1. التحكم */}
                <div className="xl:col-span-3 space-y-6">
                    <div className="bg-white/50 dark:bg-white/5 backdrop-blur-3xl p-6 rounded-[2.5rem] border border-white/20 shadow-xl space-y-8">
                        <div className="space-y-3">
                            <h3 className="text-red-600 text-lg uppercase">{isAr ? 'الوضع' : 'Mode'}</h3>
                            <button onClick={() => setMode('cover')} className={`w-full py-3 rounded-xl transition-all ${mode === 'cover' ? 'bg-red-600 text-white' : 'bg-slate-200 dark:bg-white/10'}`}>{isAr ? 'غلاف كتاب' : 'Book Cover'}</button>
                            <button onClick={() => setMode('innovation')} className={`w-full py-3 rounded-xl transition-all ${mode === 'innovation' ? 'bg-green-600 text-white' : 'bg-slate-200 dark:bg-white/10'}`}>{isAr ? 'ابتكار علمي' : 'Innovation'}</button>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-slate-500 text-lg uppercase">{isAr ? 'الألوان' : 'Colors'}</h3>
                            <div className="flex gap-2 mb-4">
                                <button onClick={() => setTool('pen')} className={`flex-1 p-4 rounded-xl border-2 ${tool === 'pen' ? 'border-red-600' : 'border-transparent'}`}><IconPen /></button>
                                <button onClick={() => setTool('eraser')} className={`flex-1 p-4 rounded-xl border-2 ${tool === 'eraser' ? 'border-red-600' : 'border-transparent'}`}><IconEraser /></button>
                                <button onClick={() => canvasRef.current?.getContext('2d')?.clearRect(0,0,5000,5000)} className="p-4 rounded-xl bg-red-500/10 text-red-600"><IconTrash /></button>
                            </div>
                            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-12 rounded-xl cursor-pointer bg-transparent border-none" />
                            <input type="range" min="2" max="40" value={lineWidth} onChange={(e) => setLineWidth(Number(e.target.value))} className="w-full accent-red-600" />
                        </div>
                    </div>
                </div>

                {/* 2. اللوحة - أهم جزء */}
                <div className="xl:col-span-6 flex flex-col gap-4 min-h-[500px]">
                    <div ref={containerRef} className="flex-1 bg-white dark:bg-slate-900 border-4 border-white/20 rounded-[3rem] shadow-2xl overflow-hidden relative" style={{ height: '60vh' }}>
                        <canvas 
                            ref={canvasRef}
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                            onTouchStart={startDrawing}
                            onTouchMove={draw}
                            onTouchEnd={stopDrawing}
                            className="touch-none cursor-crosshair"
                        />
                    </div>
                    <button 
                        onClick={handleAnalyze} 
                        disabled={isAnalyzing || step === 'result'}
                        className="py-6 rounded-3xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-black text-2xl shadow-2xl hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        {isAnalyzing ? (isAr ? 'جاري التحليل...' : 'Analyzing...') : <><IconMagic /> {isAr ? 'تحليل صقر الذكي' : 'Saqr AI Analysis'}</>}
                    </button>
                </div>

                {/* 3. النتيجة */}
                <div className="xl:col-span-3">
                    <div className="bg-white/50 dark:bg-white/5 backdrop-blur-3xl p-8 rounded-[3rem] border border-white/20 shadow-xl text-center min-h-[400px] flex flex-col justify-center">
                        {step === 'draw' ? (
                            <div className="space-y-6">
                                <img src="/unnamed.jpg" className="w-40 h-40 rounded-full border-4 border-red-600 mx-auto" alt="Saqr" />
                                <p className="text-slate-500 text-xl font-bold italic">"{isAr ? 'ابدأ بالرسم الآن واسأل صقر عن رأيه!' : 'Start drawing and ask Saqr for feedback!'}"</p>
                            </div>
                        ) : (
                            <div className="space-y-6 animate-fade-up">
                                <img src="/unnamed.jpg" className="w-32 h-32 rounded-full border-4 border-green-500 mx-auto" alt="Saqr" />
                                <div className="bg-slate-900 text-white p-6 rounded-2xl border-t-4 border-green-500">
                                    <p className="text-lg leading-relaxed">{saqrFeedback}</p>
                                </div>
                                <input 
                                    type="text" 
                                    placeholder={isAr ? "اكتب اسمك يا مبدع" : "Your name, artist"}
                                    value={studentName}
                                    onChange={(e) => setStudentName(e.target.value)}
                                    className="w-full p-4 rounded-xl border-2 border-slate-200 outline-none focus:border-green-500 dark:bg-black/40"
                                />
                                <button 
                                    onClick={() => { alert(`تم الحفظ يا ${studentName}`); setStep('draw'); }}
                                    className="w-full py-4 bg-green-600 text-white rounded-xl font-black shadow-lg"
                                >
                                    {isAr ? 'نشر في المعرض ✨' : 'Publish ✨'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                .animate-float { animation: float 6s ease-in-out infinite; }
                @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
                * { font-style: normal !important; }
            `}</style>
        </div>
    );
};

export default CreatorsStudioPage;
