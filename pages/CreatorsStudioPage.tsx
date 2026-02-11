import React, { useState, useRef, useEffect } from 'react';
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

    // 1. تظبيط أبعاد اللوحة بدقة
    useEffect(() => {
        const updateCanvasSize = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const parent = canvas.parentElement;
            if (!parent) return;

            const ctx = canvas.getContext('2d');
            // حفظ المحتوى قبل التكبير
            const tempImageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
            
            canvas.width = parent.clientWidth;
            canvas.height = parent.clientHeight;

            if (ctx && tempImageData) {
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                try { ctx.putImageData(tempImageData, 0, 0); } catch (e) {}
            }
        };

        // تشغيل التحديث فوراً وبعد وقت قصير لضمان تحميل الـ Layout
        updateCanvasSize();
        const timeoutId = setTimeout(updateCanvasSize, 100);

        window.addEventListener('resize', updateCanvasSize);
        return () => {
            window.removeEventListener('resize', updateCanvasSize);
            clearTimeout(timeoutId);
        };
    }, []);

    // 2. حساب موقع الماوس/اللمس
    const getPos = (e: any) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    };

    const startDrawing = (e: any) => {
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        setIsDrawing(true);
        const pos = getPos(e);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        e.preventDefault();
    };

    const draw = (e: any) => {
        if (!isDrawing) return;
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        const pos = getPos(e);
        
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        // مسح أو رسم
        ctx.strokeStyle = tool === 'eraser' ? (document.documentElement.classList.contains('dark') ? '#020617' : '#ffffff') : color;
        
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        e.preventDefault();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const analyzeWork = () => {
        setIsAnalyzing(true);
        setSaqrFeedback(null);
        
        setTimeout(() => {
            setIsAnalyzing(false);
            const feedback = mode === 'cover' 
                ? (isAr ? "يا فنان! لقد حللت غلافك.. التكوين رائع والخط اليدوي للعنوان مذهل. صقر يرى مستقبلاً باهراً لك!" : "Artist! I analyzed your cover.. The composition is great and the handwriting is amazing. Saqr sees a bright future!")
                : (isAr ? "مخطط هندسي ذكي! لقد تعرفت على الابتكار الذي رسمته؛ توزيع العناصر ينم عن تفكير منطقي ممتاز." : "Smart engineering diagram! I've recognized your innovation; the layout shows excellent logical thinking.");
            setSaqrFeedback(feedback);
            setStep('result');
            new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3').play().catch(()=>{});
        }, 3000);
    };

    return (
        <div dir={dir} className="min-h-screen bg-slate-50 dark:bg-[#020617] transition-colors duration-700 font-black relative pb-20 overflow-x-hidden pt-20">
            
            <header className="relative pb-8 text-center px-4 z-10">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                        <img src="/unnamed.jpg" alt="Saqr Artist" className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-2xl object-cover relative z-10" />
                    </div>
                    <h1 className="text-4xl md:text-7xl tracking-tighter text-slate-950 dark:text-white uppercase leading-none">
                        {isAr ? 'مرسم صقر المبدع' : 'SAQR ART STUDIO'}
                    </h1>
                </div>
            </header>

            <div className="max-w-[1920px] mx-auto px-4 md:px-10 relative z-10 grid grid-cols-1 xl:grid-cols-12 gap-8 items-stretch h-[70vh] min-h-[600px]">
                
                {/* 1. أدوات التحكم */}
                <div className="xl:col-span-3 space-y-6">
                    <div className="bg-white/40 dark:bg-white/5 backdrop-blur-3xl p-6 rounded-[3rem] border border-white/20 shadow-2xl space-y-8 h-full">
                        <div className="space-y-4">
                            <h3 className="text-red-600 text-xl font-black uppercase">{isAr ? 'نوع التحدي' : 'Challenge Type'}</h3>
                            <div className="flex flex-col gap-2">
                                <button onClick={() => setMode('cover')} className={`py-4 rounded-2xl transition-all font-black ${mode === 'cover' ? 'bg-red-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-white/10'}`}>{isAr ? '🎨 غلاف كتاب' : '🎨 Book Cover'}</button>
                                <button onClick={() => setMode('innovation')} className={`py-4 rounded-2xl transition-all font-black ${mode === 'innovation' ? 'bg-green-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-white/10'}`}>{isAr ? '🚀 ابتكار علمي' : '🚀 Innovation'}</button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-slate-500 text-lg uppercase">{isAr ? 'الأدوات' : 'Tools'}</h3>
                            <div className="flex gap-2">
                                <button onClick={() => setTool('pen')} className={`flex-1 p-5 rounded-xl border-2 transition-all ${tool === 'pen' ? 'border-red-600 bg-red-600/10' : 'border-transparent bg-slate-100 dark:bg-white/10'}`}><IconPen /></button>
                                <button onClick={() => setTool('eraser')} className={`flex-1 p-5 rounded-xl border-2 transition-all ${tool === 'eraser' ? 'border-slate-500 bg-slate-500/10' : 'border-transparent bg-slate-100 dark:bg-white/10'}`}><IconEraser /></button>
                                <button onClick={() => canvasRef.current?.getContext('2d')?.clearRect(0,0,9000,9000)} className="p-5 rounded-xl bg-red-500/10 text-red-600 hover:bg-red-600 hover:text-white transition-all"><IconTrash /></button>
                            </div>
                            <div className="flex items-center gap-4 bg-slate-100 dark:bg-white/5 p-4 rounded-2xl border border-white/10">
                                <input type="color" value={color} onChange={(e) => {setColor(e.target.value); setTool('pen');}} className="w-12 h-12 rounded-full border-none cursor-pointer bg-transparent" />
                                <span className="text-xs font-bold opacity-60 uppercase">{color}</span>
                            </div>
                            <input type="range" min="2" max="50" value={lineWidth} onChange={(e) => setLineWidth(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-red-600" />
                        </div>
                    </div>
                </div>

                {/* 2. اللوحة (القلب) */}
                <div className="xl:col-span-6 flex flex-col gap-6 h-full min-h-[500px]">
                    <div className="flex-1 bg-white dark:bg-slate-900/40 backdrop-blur-3xl rounded-[4rem] border-4 border-white/20 shadow-3xl overflow-hidden relative cursor-crosshair">
                         <canvas 
                            ref={canvasRef} 
                            onMouseDown={startDrawing} 
                            onMouseMove={draw} 
                            onMouseUp={stopDrawing} 
                            onMouseLeave={stopDrawing}
                            onTouchStart={startDrawing}
                            onTouchMove={draw}
                            onTouchEnd={stopDrawing}
                            className="w-full h-full touch-none" 
                         />
                         <div className="absolute inset-0 flex items-center justify-center -z-10 opacity-[0.03] pointer-events-none">
                            <img src="/school-logo.png" alt="EFIPS" className="w-[60%] rotate-12" />
                        </div>
                    </div>
                    <button 
                        onClick={analyzeWork} 
                        disabled={isAnalyzing || step === 'result'} 
                        className="py-6 rounded-[2.5rem] bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-black text-3xl shadow-3xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                    >
                        {isAnalyzing ? (isAr ? 'صقر يقرأ إبداعك...' : 'Saqr is Scanning...') : <div className="flex items-center justify-center gap-4"><IconMagic /> {isAr ? 'اطلب رأي صقر (Live AI)' : 'Get Saqr Live Feedback'}</div>}
                    </button>
                </div>

                {/* 3. فيدباك صقر */}
                <div className="xl:col-span-3 h-full">
                    <div className="bg-white/40 dark:bg-white/5 backdrop-blur-3xl p-8 rounded-[4rem] border border-white/20 shadow-2xl flex flex-col items-center justify-center text-center relative overflow-hidden h-full">
                        {step === 'draw' && (
                            <div className="space-y-6 animate-fade-in">
                                <img src="/unnamed.jpg" className="w-48 h-48 rounded-full border-4 border-red-600 shadow-xl mx-auto animate-float object-cover" />
                                <p className="text-slate-500 dark:text-slate-400 text-xl font-bold leading-relaxed italic">
                                    "{isAr ? 'ارسم مخططك، وسأقوم بتحليل كل لمسة من ريشتك!' : 'Draw your work, and I will analyze every brushstroke!'}"
                                </p>
                            </div>
                        )}

                        {step === 'result' && (
                            <div className="space-y-6 animate-fade-up w-full">
                                <img src="/unnamed.jpg" className="w-32 h-32 rounded-full border-4 border-green-600 shadow-2xl mx-auto animate-bounce object-cover" />
                                <div className="bg-slate-950 dark:bg-white text-white dark:text-slate-950 p-6 rounded-[2.5rem] shadow-xl border-t-8 border-green-600">
                                    <p className="text-lg md:text-xl font-black leading-relaxed">{saqrFeedback}</p>
                                </div>
                                
                                <div className="space-y-4">
                                    <input 
                                        type="text" 
                                        value={studentName}
                                        onChange={(e) => setStudentName(e.target.value)}
                                        placeholder={isAr ? "اسمك يا بطل؟" : "Your name, hero?"}
                                        className="w-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-white/10 rounded-2xl py-4 px-6 text-xl outline-none focus:border-green-600 transition-all text-center"
                                    />
                                    <button 
                                        onClick={() => { alert(isAr ? `تم توثيق فوزك يا ${studentName}!` : `Well done, ${studentName}!`); setStep('draw'); setSaqrFeedback(null); }}
                                        className="w-full py-4 bg-green-600 text-white rounded-2xl font-black text-xl shadow-xl hover:scale-105"
                                    >
                                        {isAr ? 'نشر العمل ✨' : 'Publish Work ✨'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                .animate-float { animation: float 6s ease-in-out infinite; }
                @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
                canvas { cursor: crosshair; touch-action: none; width: 100% !important; height: 100% !important; }
                * { font-style: normal !important; }
            `}</style>
        </div>
    );
};

export default CreatorsStudioPage;
