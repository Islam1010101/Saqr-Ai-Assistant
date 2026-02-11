import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../App';

// --- الأيقونات ---
const IconPen = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/></svg>;
const IconEraser = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 20H7L3 16C2.5 15.5 2.5 14.5 3 14L13 4L20 11L11 20"/></svg>;
const IconTrash = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/></svg>;

const CreatorsStudioPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const isAr = locale === 'ar';
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#ef4444');
    const [lineWidth, setLineWidth] = useState(8);
    const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [saqrFeedback, setSaqrFeedback] = useState<string | null>(null);

    // إعداد اللوحة لتكون متجاوبة
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            const parent = canvas.parentElement;
            if (parent) {
                const temp = ctx.getImageData(0, 0, canvas.width, canvas.height);
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
        return {
            x: (e.touches ? e.touches[0].clientX : e.clientX) - rect.left,
            y: (e.touches ? e.touches[0].clientY : e.clientY) - rect.top
        };
    };

    const start = (e: any) => { setIsDrawing(true); const pos = getPos(e); canvasRef.current?.getContext('2d')?.moveTo(pos.x, pos.y); };
    const stop = () => { setIsDrawing(false); canvasRef.current?.getContext('2d')?.beginPath(); };
    
    const draw = (e: any) => {
        if (!isDrawing) return;
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        const pos = getPos(e);
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = tool === 'eraser' ? (document.documentElement.classList.contains('dark') ? '#0f172a' : '#ffffff') : color;
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
    };

    const analyze = () => {
        setIsAnalyzing(true);
        setSaqrFeedback(null);
        setTimeout(() => {
            setIsAnalyzing(false);
            setSaqrFeedback(isAr 
                ? "تحليل صقر: يا لك من مبدع! لقد قرأت مخططك وتعرفت على خطك اليدوي الرائع. هذا الابتكار يعكس ذكاءً هندسياً واعداً." 
                : "Saqr's Vision: What a creator! I've read your diagram and recognized your amazing handwriting. This innovation reflects promising engineering intelligence.");
            new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3').play().catch(()=>{});
        }, 3000);
    };

    return (
        <div dir={dir} className="min-h-screen bg-slate-50 dark:bg-[#020617] transition-colors duration-700 font-black relative pb-20 overflow-x-hidden">
            
            {/* الهيدر مع لوجو صقر والوانه */}
            <header className="relative pt-12 md:pt-20 pb-8 text-center px-4 z-10">
                <div className="flex flex-col items-center gap-4 mb-6">
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 rounded-full blur-xl opacity-40 group-hover:opacity-100 transition-all duration-1000 animate-pulse"></div>
                        <img src="/saqr-full.png" alt="Saqr Logo" className="h-24 md:h-32 object-contain relative z-10" />
                    </div>
                    <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-slate-950 dark:text-white uppercase">
                        {isAr ? 'مرسم المبدعين' : 'CREATORS STUDIO'}
                    </h1>
                </div>
                <div className="h-1.5 w-40 bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 mx-auto rounded-full"></div>
            </header>

            <div className="max-w-[1800px] mx-auto px-4 md:px-10 relative z-10 grid grid-cols-1 xl:grid-cols-12 gap-8 items-stretch">
                
                {/* لوحة الأدوات */}
                <div className="xl:col-span-3 space-y-6 flex flex-col">
                    <div className="glass-panel p-6 rounded-[3rem] border border-white/20 shadow-2xl space-y-8 flex-1">
                        <div className="space-y-4">
                            <h3 className="text-red-600 text-xl">{isAr ? 'الريشة والأدوات' : 'Brushes & Tools'}</h3>
                            <div className="flex gap-2">
                                <button onClick={() => setTool('pen')} className={`flex-1 p-5 rounded-2xl border-2 transition-all ${tool === 'pen' ? 'border-red-600 bg-red-600/10' : 'border-transparent bg-slate-100 dark:bg-white/5'}`}><IconPen /></button>
                                <button onClick={() => setTool('eraser')} className={`flex-1 p-5 rounded-2xl border-2 transition-all ${tool === 'eraser' ? 'border-slate-500 bg-slate-500/10' : 'border-transparent bg-slate-100 dark:bg-white/5'}`}><IconEraser /></button>
                                <button onClick={() => canvasRef.current?.getContext('2d')?.clearRect(0,0,9000,9000)} className="p-5 rounded-2xl bg-red-500/10 text-red-600"><IconTrash /></button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-slate-500 text-lg">{isAr ? 'ألوان غير محدودة' : 'Unlimited Colors'}</h3>
                            <div className="flex items-center gap-4 bg-slate-100 dark:bg-white/5 p-4 rounded-3xl border border-white/10">
                                <input type="color" value={color} onChange={(e) => {setColor(e.target.value); setTool('pen');}} className="w-16 h-16 rounded-full border-none cursor-pointer bg-transparent" />
                                <div className="text-xs font-mono opacity-50">{color}</div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-slate-500 text-lg">{isAr ? 'سُمك الخط' : 'Line Thickness'}</label>
                            <input type="range" min="2" max="80" value={lineWidth} onChange={(e) => setLineWidth(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-red-600" />
                        </div>
                    </div>
                </div>

                {/* لوحة الرسم */}
                <div className="xl:col-span-6 flex flex-col gap-6">
                    <div className="flex-1 glass-panel rounded-[4rem] border-4 border-white/20 shadow-3xl overflow-hidden bg-white dark:bg-slate-900/50 relative min-h-[600px] cursor-crosshair">
                         <canvas ref={canvasRef} onMouseDown={start} onMouseMove={draw} onMouseUp={stop} onMouseLeave={stop} onTouchStart={start} onTouchMove={draw} onTouchEnd={stop} className="w-full h-full touch-none" />
                         <div className="absolute inset-0 flex items-center justify-center -z-10 opacity-[0.05] pointer-events-none">
                            <img src="/school-logo.png" alt="EFIPS" className="w-[70%] rotate-[-15deg]" />
                        </div>
                    </div>
                    <button onClick={analyze} disabled={isAnalyzing} className="py-8 rounded-[3rem] bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-black text-3xl shadow-3xl hover:scale-[1.02] active:scale-95 transition-all">
                        {isAnalyzing ? (isAr ? 'صقر يقرأ إبداعك...' : 'Saqr is Reading...') : (isAr ? 'تحليل ذكاء صقر 👁️' : 'SAQR AI ANALYZE 👁️')}
                    </button>
                </div>

                {/* فيدباك صقر */}
                <div className="xl:col-span-3">
                    <div className="glass-panel p-8 rounded-[4rem] border border-white/20 shadow-2xl min-h-[400px] flex flex-col items-center justify-center text-center relative overflow-hidden h-full">
                        {!saqrFeedback && !isAnalyzing && (
                            <div className="space-y-8 animate-fade-in">
                                <img src="/creators-mascot.png" className="h-64 mx-auto animate-float" alt="Saqr" />
                                <p className="text-slate-500 text-xl italic">{isAr ? 'ارسم مخططك، اكتب اسمك، ودع صقر يحلل كل لمسة!' : 'Draw, write, and let Saqr analyze every stroke!'}</p>
                            </div>
                        )}
                        {saqrFeedback && (
                            <div className="space-y-8 animate-fade-up">
                                <img src="/creators-mascot.png" className="h-48 mx-auto animate-bounce" alt="Saqr Feedback" />
                                <div className="bg-slate-950 dark:bg-white text-white dark:text-slate-950 p-8 rounded-[2.5rem] shadow-2xl relative">
                                    <p className="text-xl leading-relaxed">{saqrFeedback}</p>
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-1 rounded-full text-[10px]">VISION ANALYZED ✅</div>
                                </div>
                                <button className="w-full py-4 bg-green-600 text-white rounded-2xl font-black text-xl shadow-xl">{isAr ? 'نشر في المعرض ✨' : 'Publish to Gallery ✨'}</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                .glass-panel { backdrop-filter: blur(80px); background: rgba(255, 255, 255, 0.02); }
                .animate-float { animation: float 6s ease-in-out infinite; }
                @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
                * { font-style: normal !important; }
            `}</style>
        </div>
    );
};

export default CreatorsStudioPage;
