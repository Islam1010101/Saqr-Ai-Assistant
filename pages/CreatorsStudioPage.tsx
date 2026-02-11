import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../App';

// --- الأيقونات ---
const IconPen = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/></svg>;
const IconEraser = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 20H7L3 16C2.5 15.5 2.5 14.5 3 14L13 4L20 11L11 20"/></svg>;
const IconTrash = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/></svg>;
const IconMagic = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M15 4V2m0 4v2m8-3h-2m4 0h-2M3 10l6 6m-6 0l6-6M2 2l20 20"/></svg>;
const IconDownload = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;

const CreatorsStudioPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const isAr = locale === 'ar';
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#ef4444');
    const [lineWidth, setLineWidth] = useState(8);
    const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
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

            const tempImage = canvas.toDataURL();
            const img = new Image();
            img.src = tempImage;

            canvas.width = container.offsetWidth;
            canvas.height = container.offsetHeight;

            img.onload = () => {
                ctx.drawImage(img, 0, 0);
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
            };
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        return () => window.removeEventListener('resize', resizeCanvas);
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

    // --- 🦅 محرك رؤية صقر المطوّر (Saqr Vision Core) ---
    const handleAnalyze = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        setIsAnalyzing(true);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        let minX = canvas.width, maxX = 0, minY = canvas.height, maxY = 0;
        let filledPixels = 0;

        for (let i = 0; i < data.length; i += 4) {
            if (data[i + 3] > 10) {
                filledPixels++;
                const x = (i / 4) % canvas.width;
                const y = Math.floor((i / 4) / canvas.width);
                if (x < minX) minX = x; if (x > maxX) maxX = x;
                if (y < minY) minY = y; if (y > maxY) maxY = y;
            }
        }

        const width = maxX - minX;
        const height = maxY - minY;
        const aspectRatio = width / (height || 1);
        const density = filledPixels / (width * height || 1);

        setTimeout(() => {
            setIsAnalyzing(false);
            let feedback = "";

            if (filledPixels < 150) {
                feedback = isAr ? "صقر يطلب منك وضع بصمتك الإبداعية أولاً! اللوحة لا تزال بانتظارك." : "Saqr asks for your creative touch first! The canvas is waiting.";
            } else {
                // منطق التفريق الذكي التلقائي
                const isLikelyDiagram = density < 0.22 && filledPixels > 500; // خطوط كثيرة بمساحة فارغة كبيرة
                
                if (isLikelyDiagram) {
                    feedback = isAr 
                        ? "تحليل مذهل! صقر اكتشف أنك ترسم 'مخططاً هندسياً' لابتكار علمي.. توزيع العناصر دقيق ومنظم جداً." 
                        : "Amazing analysis! Saqr detected a 'Scientific Diagram' for an innovation.. your layout is very precise.";
                } else if (aspectRatio > 0.8 && aspectRatio < 1.2 && density > 0.45) {
                    feedback = isAr ? "يا له من إبداع! صقر يرى 'شمساً' ساطعة أو شكلاً دائرياً متناسقاً يزين اللوحة." : "Incredible! Saqr sees a bright 'Sun' or a balanced circular shape decorating the canvas.";
                } else if (aspectRatio > 1.5 && minY > canvas.height * 0.35) {
                    feedback = isAr ? "تحليل صقر: لقد رسمت 'سيارة' أو مركبة سريعة! الخطوط الانسيابية تدل على ذكاء فني كبير." : "Saqr's Analysis: You drew a 'Car' or a fast vehicle! The smooth lines show great artistic flair.";
                } else if (height < 100 && width > 180) {
                    feedback = isAr ? "أنت تعبر بالكلمات! لقد تعرف صقر على خط يدك الجميل.. أنت كاتب ومبدع موهوب." : "You're expressing with words! Saqr recognized your beautiful handwriting.. you're a talented author.";
                } else {
                    feedback = isAr ? "غلاف كتاب ملكي! لقد حللت رسمك واكتشفت تكويناً فنياً رائعاً يصلح ليكون واجهة لأجمل القصص." : "A Royal Book Cover! I analyzed your drawing and found a great artistic composition fit for the best stories.";
                }
            }

            setSaqrFeedback(feedback);
            if (filledPixels >= 150) setStep('result');
            new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3').play().catch(()=>{});
        }, 2200);
    };

    const downloadPNG = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const link = document.createElement('a');
        link.download = `Saqr-Creator-${studentName || 'Hero'}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
    };

    return (
        <div dir={dir} className="min-h-screen bg-slate-50 dark:bg-[#020617] transition-colors duration-700 font-black relative pb-4 overflow-x-hidden antialiased">
            
            {/* الخلفية المضيئة */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
              <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-red-600/10 blur-[150px] rounded-full animate-pulse"></div>
              <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-green-600/10 blur-[150px] rounded-full animate-pulse [animation-delay:2s]"></div>
            </div>

            {/* الهيدر مع تأثير العنوان الزجاجي المتفاعل */}
            <header className="relative pt-6 md:pt-12 pb-4 text-center px-4 z-20 flex flex-col items-center gap-4 max-w-[1900px] mx-auto">
                <div className="flex w-full justify-between items-center px-2 md:px-10">
                    <Link to="/creators" className="glass-panel border border-white/20 px-6 py-3 rounded-2xl text-[10px] hover:bg-red-600 hover:text-white transition-all shadow-xl uppercase font-black">
                        {isAr ? '⬅ العودة' : '⬅ Back'}
                    </Link>
                    <img src="/unnamed.png" alt="Saqr" className="h-14 md:h-24 object-contain animate-float drop-shadow-2xl" />
                    <div className="w-24 hidden md:block"></div>
                </div>
                
                <div className="relative group perspective-1000">
                    <h1 className="text-5xl md:text-[10rem] tracking-tighter text-slate-950 dark:text-white uppercase leading-none glass-text-effect cursor-default transition-transform duration-500 hover:scale-105 active:scale-95">
                        {isAr ? 'ارسم ابداعك' : 'DRAW YOUR MAGIC'}
                    </h1>
                </div>
                <div className="h-2 w-32 md:w-64 bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 rounded-full shadow-lg"></div>
            </header>

            <div className="max-w-[1920px] mx-auto px-4 md:px-10 grid grid-cols-1 xl:grid-cols-12 gap-6 h-[calc(100vh-280px)] relative z-10 items-stretch">
                
                {/* 1. الأدوات الجانبية (Glass Sidebar) */}
                <div className="xl:col-span-2 order-2 xl:order-1 flex xl:flex-col gap-4">
                    <div className="glass-panel p-4 md:p-6 rounded-[3rem] border border-white/20 shadow-2xl bg-white/60 dark:bg-slate-900/40 backdrop-blur-3xl flex xl:flex-col gap-5 w-full h-full justify-center">
                        <button onClick={() => setTool('pen')} title="Brush" className={`flex-1 xl:flex-none p-6 rounded-3xl border-4 transition-all hover:scale-110 ${tool === 'pen' ? 'border-red-600 bg-red-600/10 text-red-600 shadow-xl' : 'border-transparent bg-black/5 dark:bg-white/5'}`}><IconPen /></button>
                        <button onClick={() => setTool('eraser')} title="Eraser" className={`flex-1 xl:flex-none p-6 rounded-3xl border-4 transition-all hover:scale-110 ${tool === 'eraser' ? 'border-red-600 bg-red-600/10 text-red-600 shadow-xl' : 'border-transparent bg-black/5 dark:bg-white/5'}`}><IconEraser /></button>
                        <button onClick={() => canvasRef.current?.getContext('2d')?.clearRect(0,0,5000,5000)} title="Clear" className="p-6 rounded-3xl bg-red-500/10 text-red-600 hover:bg-red-600 hover:text-white hover:scale-110 transition-all shadow-lg"><IconTrash /></button>
                        
                        <div className="flex-1 xl:flex-none space-y-4">
                             <div className="relative group">
                                <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-20 rounded-3xl cursor-pointer bg-transparent border-none p-0 overflow-hidden shadow-2xl transition-transform hover:scale-105" />
                                <div className="absolute inset-0 rounded-3xl border-4 border-white/40 pointer-events-none"></div>
                             </div>
                             <div className="bg-black/5 dark:bg-white/5 p-4 rounded-3xl">
                                <input type="range" min="2" max="100" value={lineWidth} onChange={(e) => setLineWidth(Number(e.target.value))} className="w-full accent-red-600 h-2 cursor-pointer" />
                                <p className="text-[10px] mt-2 opacity-50 text-center uppercase tracking-widest">{isAr ? 'حجم الخط' : 'Line Size'}</p>
                             </div>
                        </div>
                    </div>
                </div>

                {/* 2. مساحة الرسم العملاقة (The Master Canvas) */}
                <div className="xl:col-span-8 order-1 xl:order-2 flex flex-col gap-6 h-full min-h-[450px]">
                    <div ref={containerRef} className="flex-1 bg-white/95 dark:bg-[#01040a] backdrop-blur-2xl border-[6px] border-white/30 dark:border-white/5 rounded-[3.5rem] md:rounded-[6rem] shadow-[0_40px_100px_rgba(0,0,0,0.2)] overflow-hidden relative cursor-crosshair group/canvas border-glass-shine">
                        <canvas 
                            ref={canvasRef}
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                            onTouchStart={startDrawing}
                            onTouchMove={draw}
                            onTouchEnd={stopDrawing}
                            className="touch-none w-full h-full relative z-10"
                        />
                        {/* الووتر مارك الملكية (شعار مدرسة صقر الإمارات) */}
                        <div className="absolute inset-0 flex items-center justify-center z-0 opacity-[0.03] dark:opacity-[0.06] pointer-events-none select-none transition-all duration-1000 group-hover/canvas:opacity-[0.08]">
                            <img src="/school-logo.png" alt="Watermark" className="w-[65%] object-contain rotate-12 translate-x-10" />
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleAnalyze} 
                        disabled={isAnalyzing}
                        className="group relative overflow-hidden py-7 md:py-10 rounded-[3rem] md:rounded-[5rem] bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-black text-2xl md:text-6xl shadow-[0_30px_70px_rgba(0,0,0,0.4)] hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 opacity-0 group-hover:opacity-10 transition-opacity duration-700"></div>
                        <span className="relative z-10 flex items-center justify-center gap-6">
                           {isAnalyzing ? (isAr ? 'صقر يحلل ريشتك...' : 'Saqr analyzing...') : <><IconMagic /> {isAr ? 'تحليل ذكاء صقر الفعلي' : 'Run Real Saqr AI'}</>}
                        </span>
                    </button>
                </div>

                {/* 3. نافذة الفيدباك الذكي (Smart Insight) */}
                <div className="xl:col-span-2 order-3 w-full h-full min-h-[300px]">
                    <div className="glass-panel p-6 md:p-8 rounded-[3.5rem] border border-white/20 shadow-2xl bg-white/80 dark:bg-slate-900/60 backdrop-blur-3xl text-center flex flex-col justify-center h-full relative overflow-hidden border-glass-shine">
                        {step === 'draw' ? (
                            <div className="space-y-8 animate-fade-in">
                                <div className="relative inline-block group">
                                    <div className="absolute -inset-4 bg-red-600 rounded-full blur opacity-20 animate-pulse group-hover:opacity-40 transition-opacity"></div>
                                    <img src="/unnamed.png" className="w-28 md:w-48 object-contain relative z-10" alt="Saqr" />
                                </div>
                                <div className="space-y-4">
                                    <p className="text-slate-950 dark:text-white text-2xl font-black tracking-tighter leading-none">{isAr ? 'صقر في انتظارك' : 'Saqr Waiting'}</p>
                                    <p className="text-slate-500 dark:text-slate-400 text-[10px] md:text-sm font-bold italic leading-relaxed">
                                        "{isAr ? 'ارسم شمس، سيارة، مخطط علمي أو غلافاً.. صقر سيحلل إبداعك فوراً!' : 'Draw a sun, car, or a diagram.. Saqr will analyze it instantly!'}"
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-8 animate-fade-up w-full">
                                <img src="/unnamed.png" className="w-20 md:w-32 object-contain mx-auto drop-shadow-xl" alt="Saqr Result" />
                                <div className="bg-slate-950 dark:bg-white text-white dark:text-slate-950 p-6 rounded-[2.5rem] shadow-2xl border-t-[12px] border-green-500">
                                    <p className="text-[10px] md:text-xl font-black leading-tight">{saqrFeedback}</p>
                                </div>
                                <div className="space-y-4">
                                    <input 
                                        type="text" 
                                        placeholder={isAr ? "اكتب اسمك يا مبدع" : "Your Name"}
                                        value={studentName}
                                        onChange={(e) => setStudentName(e.target.value)}
                                        className="w-full p-5 rounded-3xl border-2 border-slate-200 dark:border-white/10 outline-none focus:border-green-500 dark:bg-black/40 text-center font-black text-xs shadow-inner"
                                    />
                                    <div className="grid grid-cols-1 gap-3">
                                        <button 
                                            onClick={downloadPNG}
                                            className="w-full py-5 bg-red-600 text-white rounded-[2rem] font-black text-xs shadow-xl hover:bg-red-700 transition-all flex items-center justify-center gap-3 hover:-translate-y-1 active:translate-y-0"
                                        >
                                            <IconDownload /> {isAr ? 'تحميل PNG' : 'Save PNG'}
                                        </button>
                                        <button onClick={() => {setStep('draw'); setSaqrFeedback(null);}} className="w-full py-4 bg-slate-200 dark:bg-white/5 rounded-[2rem] font-black text-[9px] uppercase hover:bg-slate-300 dark:hover:bg-white/10 transition-all opacity-60">
                                            {isAr ? 'محاولة جديدة' : 'New Challenge'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes float { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-15px) rotate(3deg); } }
                .animate-float { animation: float 6s ease-in-out infinite; }
                .glass-panel { transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1); }
                .border-glass-shine { border: 1px solid rgba(255, 255, 255, 0.1); }
                
                .glass-text-effect {
                    background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.4) 100%);
                    -webkit-background-clip: text;
                    text-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    filter: drop-shadow(0 0 1px rgba(255,255,255,0.5));
                }
                
                canvas { cursor: crosshair; touch-action: none; image-rendering: pixelated; }
                
                input[type="range"]::-webkit-slider-thumb {
                    -webkit-appearance: none; appearance: none; width: 25px; height: 25px;
                    background: #ef4444; border: 4px solid white; border-radius: 50%;
                    cursor: pointer; box-shadow: 0 5px 15px rgba(239,68,68,0.4);
                }
                
                * { font-style: normal !important; -webkit-font-smoothing: antialiased; }
                [dir="rtl"] h1, [dir="rtl"] p, [dir="rtl"] button { letter-spacing: 0 !important; }
            `}</style>
        </div>
    );
};

export default CreatorsStudioPage;
