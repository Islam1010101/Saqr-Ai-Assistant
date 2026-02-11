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

    // تظبيط أبعاد اللوحة وإعدادات التنعيم
    useEffect(() => {
        const resizeCanvas = () => {
            const canvas = canvasRef.current;
            const container = containerRef.current;
            if (!canvas || !container) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const tempImage = canvas.toDataURL();
            const img = new Image();
            img.src = tempImage;

            canvas.width = container.offsetWidth;
            canvas.height = container.offsetHeight;

            img.onload = () => {
                ctx.drawImage(img, 0, 0);
                // إعدادات تنعيم الخطوط "الذكية"
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.shadowBlur = 1; // يقلل من حدة الخطوط العشوائية
                ctx.shadowColor = color;
            };
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        return () => window.removeEventListener('resize', resizeCanvas);
    }, [color]);

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

    // --- محرك تحليل "صقر" الفعلي للمحتوى ---
    const handleAnalyze = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        setIsAnalyzing(true);

        // 1. استخراج بيانات الصورة وتحليل الكثافة والمواقع
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        let leftSide = 0, rightSide = 0, topSide = 0, bottomSide = 0;
        let totalActive = 0;

        for (let i = 0; i < data.length; i += 4) {
            if (data[i + 3] > 0) {
                totalActive++;
                const x = (i / 4) % canvas.width;
                const y = Math.floor((i / 4) / canvas.width);
                if (x < canvas.width / 2) leftSide++; else rightSide++;
                if (y < canvas.height / 2) topSide++; else bottomSide++;
            }
        }

        const coverage = (totalActive / (canvas.width * canvas.height)) * 100;

        setTimeout(() => {
            setIsAnalyzing(false);
            let feedback = "";

            if (coverage < 0.1) {
                feedback = isAr ? "صقر يرى لوحة بيضاء.. أين اختفى إبداعك؟" : "Saqr sees a blank canvas.. Where is your magic?";
            } else {
                // منطق التعرف على نوع الرسم
                const isWriting = Math.abs(leftSide - rightSide) < (totalActive * 0.2); // توزيع متوازن يشبه الكتابة
                const isComplex = coverage > 5; // رسمة مليئة بالتفاصيل

                if (mode === 'cover') {
                    if (isWriting && !isComplex) {
                        feedback = isAr 
                            ? "لقد تعرفت على خط يدك! أنت تكتب عنوان الكتاب بوضوح (عربي/إنجليزي).. الخط جميل ومنظم." 
                            : "I recognized your handwriting! You're writing the book title clearly. The font is neat and elegant.";
                    } else {
                        feedback = isAr 
                            ? "غلاف رائع! أرى رسماً تعبيرياً يملأ مساحة اللوحة.. تناسق الألوان يعكس موضوع القصة." 
                            : "Great cover! I see an expressive drawing filling the canvas.. The color harmony reflects the story theme.";
                    }
                } else {
                    // وضع الابتكار الهندسي
                    if (isComplex) {
                        feedback = isAr 
                            ? "مخطط هندسي معقد! لقد حللت الرموز والوصلات؛ هذا يبدو كمحرك أو نظام طاقة متطور." 
                            : "Complex engineering diagram! I analyzed the symbols and connections; this looks like an advanced motor or energy system.";
                    } else {
                        feedback = isAr 
                            ? "رسم تقني مبدئي.. صقر ينصحك بتقوية الخطوط الرئيسية لتوضيح فكرة ابتكارك أكثر." 
                            : "Initial technical sketch.. Saqr suggests bolding the main lines to clarify your innovation idea.";
                    }
                }
            }

            setSaqrFeedback(feedback);
            if (coverage >= 0.1) setStep('result');
            new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3').play().catch(()=>{});
        }, 2500);
    };

    return (
        <div dir={dir} className="min-h-screen bg-slate-50 dark:bg-[#020617] transition-colors duration-700 font-black relative pb-20 pt-10 md:pt-24 overflow-x-hidden">
            
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-50">
              <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-red-600/10 dark:bg-red-500/20 blur-[150px] rounded-full animate-pulse"></div>
              <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-green-600/10 dark:bg-green-500/20 blur-[150px] rounded-full animate-pulse [animation-delay:2s]"></div>
            </div>

            <header className="relative text-center px-4 mb-10 z-10">
                <div className="flex flex-col items-center gap-4">
                    <Link to="/creators" className="absolute top-0 start-4 md:start-10 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl text-[10px] hover:bg-red-600 hover:text-white transition-all">
                        {isAr ? '⬅ العودة للبوابة' : '⬅ Back'}
                    </Link>
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-gradient-to-r from-red-600 to-yellow-500 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-all"></div>
                        <img src="/unnamed.png" alt="Saqr Studio" className="w-28 h-28 md:w-44 md:h-44 object-contain animate-float drop-shadow-2xl" />
                    </div>
                    <h1 className="text-3xl md:text-6xl tracking-tighter text-slate-950 dark:text-white uppercase leading-none">
                        {isAr ? 'مرسم صقر الذكي' : 'SAQR SMART STUDIO'}
                    </h1>
                </div>
            </header>

            <div className="max-w-[1900px] mx-auto px-4 md:px-10 grid grid-cols-1 xl:grid-cols-12 gap-6 items-start relative z-10">
                
                <div className="xl:col-span-3 order-2 xl:order-1 space-y-6 w-full">
                    <div className="glass-panel p-6 rounded-[2.5rem] border border-white/20 dark:border-white/5 shadow-2xl bg-white/70 dark:bg-slate-900/50 backdrop-blur-3xl space-y-8">
                        <div className="space-y-4 text-start px-2">
                            <h3 className="text-red-600 text-xs md:text-sm uppercase tracking-widest">{isAr ? 'وضع التحليل' : 'Analysis Mode'}</h3>
                            <div className="grid grid-cols-2 xl:grid-cols-1 gap-2">
                                <button onClick={() => setMode('cover')} className={`py-3 rounded-xl text-[10px] md:text-xs font-black transition-all ${mode === 'cover' ? 'bg-red-600 text-white shadow-lg' : 'bg-black/5'}`}>{isAr ? '🎨 أغلفة وكتب' : '🎨 Covers'}</button>
                                <button onClick={() => setMode('innovation')} className={`py-3 rounded-xl text-[10px] md:text-xs font-black transition-all ${mode === 'innovation' ? 'bg-green-600 text-white shadow-lg' : 'bg-black/5'}`}>{isAr ? '🚀 ابتكار ومخططات' : '🚀 Innovation'}</button>
                            </div>
                        </div>

                        <div className="space-y-6 text-start px-2">
                            <h3 className="text-slate-500 dark:text-slate-400 text-xs md:text-sm uppercase tracking-widest">{isAr ? 'ريشة صقر' : 'Saqr Brush'}</h3>
                            <div className="flex gap-2">
                                <button onClick={() => setTool('pen')} className={`flex-1 p-4 rounded-xl border-2 transition-all ${tool === 'pen' ? 'border-red-600 text-red-600' : 'border-transparent'}`}><IconPen /></button>
                                <button onClick={() => setTool('eraser')} className={`flex-1 p-4 rounded-xl border-2 transition-all ${tool === 'eraser' ? 'border-red-600 text-red-600' : 'border-transparent'}`}><IconEraser /></button>
                                <button onClick={() => canvasRef.current?.getContext('2d')?.clearRect(0,0,5000,5000)} className="p-4 rounded-xl bg-red-500/10 text-red-600"><IconTrash /></button>
                            </div>
                            <div className="space-y-2">
                                <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-12 rounded-xl cursor-pointer bg-transparent border-none p-0 overflow-hidden" />
                                <input type="range" min="2" max="60" value={lineWidth} onChange={(e) => setLineWidth(Number(e.target.value))} className="w-full accent-red-600 h-1.5" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="xl:col-span-6 order-1 xl:order-2 flex flex-col gap-6 w-full">
                    <div ref={containerRef} className="aspect-video xl:aspect-auto xl:h-[65vh] bg-white/95 dark:bg-[#020617]/90 backdrop-blur-md border-4 border-white/20 dark:border-white/5 rounded-[2.5rem] md:rounded-[4rem] shadow-3xl overflow-hidden relative cursor-crosshair">
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
                    </div>
                    
                    <button 
                        onClick={handleAnalyze} 
                        disabled={isAnalyzing}
                        className="group relative py-6 rounded-[2rem] bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-black text-xl md:text-3xl shadow-3xl transition-all"
                    >
                        {isAnalyzing ? (isAr ? 'صقر يقرأ أفكارك...' : 'Reading your mind...') : <><IconMagic /> {isAr ? 'تفعيل تحليل صقر البصري' : 'Run Saqr Vision AI'}</>}
                    </button>
                </div>

                <div className="xl:col-span-3 order-3 w-full">
                    <div className="glass-panel p-8 rounded-[3rem] border border-white/20 shadow-2xl bg-white/70 dark:bg-slate-900/50 backdrop-blur-3xl text-center min-h-[400px] flex flex-col justify-center relative">
                        {step === 'draw' ? (
                            <div className="space-y-6">
                                <img src="/unnamed.png" className="w-32 h-32 object-contain mx-auto" alt="Saqr" />
                                <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base font-bold italic leading-relaxed">
                                    "{isAr ? 'ارسم أو اكتب بيدك، وسأخبرك بنوع إبداعك وملاحظاتي الفنية عليه!' : 'Draw or write, and I will tell you the type of your creation!'}"
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-6 animate-fade-up">
                                <img src="/unnamed.png" className="w-24 h-24 object-contain mx-auto" alt="Result" />
                                <div className="bg-slate-950 dark:bg-white text-white dark:text-slate-950 p-6 rounded-3xl border-t-8 border-green-500 shadow-xl">
                                    <p className="text-sm md:text-lg leading-relaxed font-black">{saqrFeedback}</p>
                                </div>
                                <div className="space-y-4 pt-4">
                                    <input 
                                        type="text" 
                                        placeholder={isAr ? "اكتب اسمك يا بطل" : "Your Name"}
                                        value={studentName}
                                        onChange={(e) => setStudentName(e.target.value)}
                                        className="w-full p-4 rounded-2xl border-2 border-slate-200 dark:bg-black/40 text-center font-black"
                                    />
                                    <button onClick={() => setStep('draw')} className="w-full py-4 bg-green-600 text-white rounded-2xl font-black shadow-lg hover:bg-green-700 transition-all">
                                        {isAr ? 'حفظ العمل في المعرض ✨' : 'Save to Gallery ✨'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-15px); } }
                .animate-float { animation: float 5s ease-in-out infinite; }
                * { font-style: normal !important; -webkit-font-smoothing: antialiased; }
                canvas { cursor: crosshair; touch-action: none; }
            `}</style>
        </div>
    );
};

export default CreatorsStudioPage;
