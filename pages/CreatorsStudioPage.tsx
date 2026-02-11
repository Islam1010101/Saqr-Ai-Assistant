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
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#ef4444');
    const [lineWidth, setLineWidth] = useState(6);
    const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
    const [mode, setMode] = useState<'cover' | 'innovation'>('cover');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [saqrFeedback, setSaqrFeedback] = useState<string | null>(null);
    const [studentName, setStudentName] = useState("");
    const [step, setStep] = useState<'draw' | 'result'>('draw');

    // تظبيط اللوحة
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            const parent = canvas.parentElement;
            if (parent) {
                const temp = ctx.getImageData(0,0, canvas.width, canvas.height);
                canvas.width = parent.clientWidth;
                canvas.height = parent.clientHeight;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.putImageData(temp, 0, 0);
            }
        };
        resize();
        window.addEventListener('resize', resize);
        return () => window.removeEventListener('resize', resize);
    }, []);

    const getPos = (e: any) => {
        const rect = canvasRef.current!.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return { x: clientX - rect.left, y: clientY - rect.top };
    };

    const start = (e: any) => { setIsDrawing(true); const pos = getPos(e); canvasRef.current?.getContext('2d')?.moveTo(pos.x, pos.y); };
    const stop = () => { setIsDrawing(false); canvasRef.current?.getContext('2d')?.beginPath(); };
    
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

    const analyzeWork = () => {
        setIsAnalyzing(true);
        setSaqrFeedback(null);
        
        // محاكاة تحليل الرؤية البصرية (AI Vision)
        setTimeout(() => {
            setIsAnalyzing(false);
            const feedback = mode === 'cover' 
                ? (isAr ? "هايل! لقد تعرفت على العنوان بخط يدك الجميل. ألوان الغلاف متناسقة جداً وتعبر عن القصة بذكاء." : "Amazing! I've recognized the title in your beautiful handwriting. The cover colors are perfectly balanced.")
                : (isAr ? "مخطط علمي عبقري! لقد قرأت الرموز الهندسية في رسمك؛ هذا الابتكار ينم عن فكر هندسي متطور." : "Genius diagram! I've read the engineering symbols in your sketch; this innovation shows advanced logic.");
            setSaqrFeedback(feedback);
            setStep('result');
            new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3').play().catch(()=>{});
        }, 3000);
    };

    return (
        <div dir={dir} className="min-h-screen bg-slate-50 dark:bg-[#020617] transition-colors duration-700 font-black relative pb-20 overflow-x-hidden selection:bg-red-600/30">
            
            {/* الهيدر الملكي */}
            <header className="relative pt-12 md:pt-20 pb-8 text-center px-4 z-10">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 rounded-full blur-2xl opacity-40 group-hover:opacity-100 animate-pulse transition-all"></div>
                        <img src="unnamed.jpg" alt="Saqr Artist" className="w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-white shadow-2xl object-cover relative z-10" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-4xl md:text-8xl tracking-tighter text-slate-950 dark:text-white uppercase leading-none">
                            {isAr ? 'مرسم صقر المبدع' : 'SAQR ART STUDIO'}
                        </h1>
                        <p className="text-red-600 dark:text-red-500 text-lg md:text-3xl italic opacity-80">
                            {isAr ? 'ارسم.. صقر يحلل إبداعك فوراً' : 'Sketch.. Saqr analyzes your work live'}
                        </p>
                    </div>
                </div>
            </header>

            <div className="max-w-[1920px] mx-auto px-4 md:px-10 relative z-10 grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                
                {/* 1. أدوات التحكم */}
                <div className="xl:col-span-3 space-y-6">
                    <div className="glass-panel p-8 rounded-[3rem] border border-white/20 shadow-2xl space-y-10">
                        <div className="space-y-4">
                            <h3 className="text-red-600 text-xl md:text-2xl uppercase">{isAr ? 'نوع التحدي' : 'Challenge Mode'}</h3>
                            <div className="flex flex-col gap-3">
                                <button onClick={() => setMode('cover')} className={`py-4 rounded-2xl font-black transition-all ${mode === 'cover' ? 'bg-red-600 text-white shadow-lg scale-105' : 'bg-slate-100 dark:bg-white/5'}`}>{isAr ? '🎨 غلاف كتاب' : '🎨 Book Cover'}</button>
                                <button onClick={() => setMode('innovation')} className={`py-4 rounded-2xl font-black transition-all ${mode === 'innovation' ? 'bg-green-600 text-white shadow-lg scale-105' : 'bg-slate-100 dark:bg-white/5'}`}>{isAr ? '🚀 ابتكار علمي' : '🚀 Innovation'}</button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-slate-500 text-xl uppercase">{isAr ? 'الأدوات' : 'The Brushes'}</h3>
                            <div className="flex gap-2">
                                <button onClick={() => setTool('pen')} className={`flex-1 p-5 rounded-2xl border-2 transition-all ${tool === 'pen' ? 'border-red-600 bg-red-600/10' : 'border-transparent bg-slate-100 dark:bg-white/5'}`}><IconPen /></button>
                                <button onClick={() => setTool('eraser')} className={`flex-1 p-5 rounded-2xl border-2 transition-all ${tool === 'eraser' ? 'border-slate-500 bg-slate-500/10' : 'border-transparent bg-slate-100 dark:bg-white/5'}`}><IconEraser /></button>
                                <button onClick={() => canvasRef.current?.getContext('2d')?.clearRect(0,0,9000,9000)} className="p-5 rounded-2xl bg-red-500/10 text-red-600 hover:bg-red-600 hover:text-white transition-all"><IconTrash /></button>
                            </div>
                            <div className="flex items-center gap-4 bg-slate-100 dark:bg-white/5 p-4 rounded-3xl border border-white/10">
                                <input type="color" value={color} onChange={(e) => {setColor(e.target.value); setTool('pen');}} className="w-16 h-16 rounded-full border-none cursor-pointer bg-transparent" />
                                <span className="text-xs font-mono opacity-50 uppercase tracking-widest">{color}</span>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs opacity-50"><span>{isAr ? 'ناعم' : 'Thin'}</span><span>{isAr ? 'عريض' : 'Bold'}</span></div>
                                <input type="range" min="2" max="60" value={lineWidth} onChange={(e) => setLineWidth(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-red-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. اللوحة (قلب المرسم) */}
                <div className="xl:col-span-6 flex flex-col gap-6">
                    <div className="flex-1 glass-panel rounded-[4rem] border-4 border-white shadow-3xl overflow-hidden bg-white dark:bg-slate-900/40 relative min-h-[600px] cursor-crosshair group/canvas">
                         <canvas ref={canvasRef} onMouseDown={start} onMouseMove={draw} onMouseUp={stop} onMouseLeave={stop} onTouchStart={start} onTouchMove={draw} onTouchEnd={stop} className="w-full h-full touch-none" />
                         <div className="absolute inset-0 flex items-center justify-center -z-10 opacity-[0.03] pointer-events-none group-hover/canvas:opacity-[0.06] transition-opacity">
                            <img src="unnamed.jpg" alt="Seal" className="w-[60%] rotate-12" />
                        </div>
                    </div>
                    <button onClick={analyzeWork} disabled={isAnalyzing || step === 'result'} className="py-8 rounded-[3rem] bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-black text-3xl md:text-5xl shadow-3xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50">
                        {isAnalyzing ? (isAr ? 'صقر يقرأ خطوطك...' : 'Saqr is Reading...') : <div className="flex items-center justify-center gap-4"><IconMagic /> {isAr ? 'تحليل ذكاء صقر' : 'SAQR AI ANALYZE'}</div>}
                    </button>
                </div>

                {/* 3. فيدباك صقر والفوز */}
                <div className="xl:col-span-3">
                    <div className="glass-panel p-10 rounded-[4rem] border border-white/20 shadow-2xl min-h-[500px] flex flex-col items-center justify-center text-center relative overflow-hidden h-full">
                        {step === 'draw' && (
                            <div className="space-y-8 animate-fade-in">
                                <img src="unnamed.jpg" className="w-48 h-48 rounded-full border-4 border-red-600 shadow-xl mx-auto animate-float object-cover" alt="Saqr" />
                                <p className="text-slate-500 dark:text-slate-400 text-xl md:text-2xl leading-relaxed italic">
                                    "{isAr ? 'ارسم فكرتك، اكتب اسمك بيدك، وسأخبرك برأيي الهندسي فوراً!' : 'Draw your idea, write your name, and I will give you my feedback!'}"
                                </p>
                            </div>
                        )}

                        {step === 'result' && (
                            <div className="space-y-8 animate-fade-up w-full">
                                <div className="relative inline-block">
                                    <img src="unnamed.jpg" className="w-40 h-40 rounded-full border-4 border-green-600 shadow-2xl mx-auto animate-bounce object-cover" alt="Saqr Happy" />
                                    <div className="absolute -top-2 -right-2 bg-green-600 text-white p-2 rounded-full shadow-lg">✅</div>
                                </div>
                                <div className="bg-slate-950 dark:bg-white text-white dark:text-slate-950 p-8 rounded-[2.5rem] shadow-2xl relative border-t-8 border-green-600">
                                    <p className="text-xl md:text-2xl font-black leading-relaxed">{saqrFeedback}</p>
                                </div>
                                
                                <div className="space-y-4 pt-4">
                                    <p className="text-red-600 font-black">{isAr ? 'أنت مبدع! ما هو اسمك يا بطل؟' : 'You are a star! What is your name?'}</p>
                                    <input 
                                        type="text" 
                                        value={studentName}
                                        onChange={(e) => setStudentName(e.target.value)}
                                        placeholder={isAr ? "اكتب اسمك هنا..." : "Your name here..."}
                                        className="w-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-white/10 rounded-2xl py-4 px-6 text-xl outline-none focus:border-green-600 transition-all"
                                    />
                                    <button onClick={() => {alert(`تم حفظ عملك يا ${studentName}!`); setStep('draw'); setSaqrFeedback(null);}} className="w-full py-5 bg-green-600 text-white rounded-3xl font-black text-xl shadow-xl hover:scale-105 transition-all">
                                        {isAr ? 'توثيق في معرض المدرسة ✨' : 'Publish to School Gallery ✨'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                .glass-panel { backdrop-filter: blur(80px); background: rgba(255, 255, 255, 0.03); }
                .animate-float { animation: float 6s ease-in-out infinite; }
                @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-30px); } }
                * { font-style: normal !important; text-rendering: optimizeLegibility; -webkit-font-smoothing: antialiased; }
                [dir="rtl"] h1, [dir="rtl"] h2, [dir="rtl"] h3 { letter-spacing: 0 !important; }
                canvas { cursor: crosshair; }
            `}</style>
        </div>
    );
};

export default CreatorsStudioPage;
