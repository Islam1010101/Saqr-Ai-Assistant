import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../App';

// --- الأيقونات الملكية ---
const IconPen = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/></svg>;
const IconEraser = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 20H7L3 16C2.5 15.5 2.5 14.5 3 14L13 4L20 11L11 20"/></svg>;
const IconTrash = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/></svg>;
const IconMagic = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M15 4V2m0 4v2m8-3h-2m4 0h-2M3 10l6 6m-6 0l6-6M2 2l20 20"/></svg>;
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
    const [titlePos, setTitlePos] = useState({ x: 0, y: 0 });

    // تأثير العنوان الزجاجي
    const handleMouseMove = (e: React.MouseEvent) => {
        const x = (e.clientX - window.innerWidth / 2) / 40;
        const y = (e.clientY - window.innerHeight / 2) / 40;
        setTitlePos({ x, y });
    };

    // ضبط أبعاد اللوحة بدقة لكل الشاشات
    useEffect(() => {
        const updateCanvas = () => {
            const canvas = canvasRef.current;
            const container = containerRef.current;
            if (!canvas || !container) return;
            
            const temp = canvas.toDataURL();
            const img = new Image();
            img.src = temp;
            
            canvas.width = container.offsetWidth;
            canvas.height = container.offsetHeight;
            
            img.onload = () => {
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.drawImage(img, 0, 0);
                    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
                }
            };
        };
        updateCanvas();
        window.addEventListener('resize', updateCanvas);
        return () => window.removeEventListener('resize', updateCanvas);
    }, []);

    const getPos = (e: any) => {
        const rect = canvasRef.current!.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return { x: clientX - rect.left, y: clientY - rect.top };
    };

    // تفعيل الضغط فقط (Start)
    const start = (e: any) => {
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        setIsDrawing(true);
        const pos = getPos(e);
        ctx.beginPath(); ctx.moveTo(pos.x, pos.y);
    };

    // الرسم (Move)
    const draw = (e: any) => {
        if (!isDrawing) return; // يمنع الرسم لو مش ضاغط
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        const pos = getPos(e);
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = tool === 'eraser' ? (document.documentElement.classList.contains('dark') ? '#020617' : '#ffffff') : color;
        ctx.lineTo(pos.x, pos.y); ctx.stroke();
    };

    // إيقاف الرسم (Stop)
    const stop = () => setIsDrawing(false);

    // --- 🦅 تحليل صقر الجبار (Auto-Detect Vision) ---
    const handleAnalyze = async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const GROQ_KEY = (import.meta as any).env?.VITE_GROQ_API_KEY || (process as any).env?.REACT_APP_GROQ_API_KEY;
        if (!GROQ_KEY) {
            alert(isAr ? "خطأ في المفتاح البرمجي!" : "API Key Error!"); return;
        }

        setIsAnalyzing(true);
        const imageData = canvas.toDataURL("image/png");

        try {
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: { "Authorization": `Bearer ${GROQ_KEY}`, "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: "llama-3.2-11b-vision-preview",
                    messages: [
                        {
                            role: "user",
                            content: [
                                { type: "text", text: "أنت صقر، مساعد ذكي بمدرسة صقر الإمارات. حلل هذه الصورة بذكاء. حدد تلقائياً هل هذا 'مخطط هندسي' لابتكار، أم 'غلاف كتاب' قصصي، أم 'رسمة شمس/سيارة/إلخ'. تعرّف على الكتابة اليدوية إن وجدت. رد بلهجة مصرية مرحة جداً، شجع المبدع الصغير واشرح له ماذا رأيت بوضوح وفخر." },
                                { type: "image_url", image_url: { url: imageData } }
                            ]
                        }
                    ],
                    temperature: 0.8
                })
            });

            const result = await response.json();
            setSaqrFeedback(result.choices[0]?.message?.content || "صقر مبهور بيك بس الـ AI مهنج!");
            setStep('result');
            new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3').play().catch(()=>{});
        } catch (e) {
            setSaqrFeedback(isAr ? "صقر تعب من كتر الذكاء، جرب تاني!" : "Saqr is tired, try again!");
        } finally { setIsAnalyzing(false); }
    };

    const downloadPNG = () => {
        const link = document.createElement('a');
        link.download = `Saqr-Art-${studentName || 'Hero'}.png`;
        link.href = canvasRef.current!.toDataURL("image/png");
        link.click();
    };

    return (
        <div dir={dir} onMouseMove={handleMouseMove} className="min-h-[100dvh] bg-slate-50 dark:bg-[#020617] transition-colors duration-700 font-black relative overflow-y-auto flex flex-col pt-4 antialiased">
            
            {/* الهيدر الزجاجي المطور */}
            <header className="relative z-30 px-4 md:px-10 w-full flex flex-col items-center gap-4 mb-4">
                <div className="flex w-full justify-between items-center max-w-[1900px]">
                    <Link to="/creators" className="glass-panel border border-white/20 px-4 md:px-8 py-2 md:py-4 rounded-2xl text-[10px] md:text-xs hover:bg-red-600 hover:text-white transition-all shadow-xl uppercase font-black">
                        {isAr ? '⬅ العودة' : '⬅ Back'}
                    </Link>
                    <img src="/unnamed.png" alt="Saqr" className="h-10 md:h-28 object-contain animate-float drop-shadow-2xl" />
                </div>
                
                <h1 className="text-4xl md:text-[9rem] tracking-tighter text-slate-950 dark:text-white uppercase leading-none cursor-default transition-all duration-300 select-none"
                    style={{ transform: `translate(${titlePos.x}px, ${titlePos.y}px)`, textShadow: '0 20px 50px rgba(0,0,0,0.1)' }}>
                    {isAr ? 'ارسم ابداعك' : 'DRAW MAGIC'}
                </h1>
                <div className="h-1.5 w-32 md:w-80 bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 rounded-full"></div>
            </header>

            {/* منطقة الرسم المركزية */}
            <div className="flex-1 max-w-[1920px] mx-auto px-2 md:px-10 grid grid-cols-1 xl:grid-cols-12 gap-4 relative z-10 items-stretch mb-6 w-full">
                
                {/* 1. صندوق الأدوات (متجاوب للموبايل) */}
                <div className="xl:col-span-2 order-2 xl:order-1 flex xl:flex-col gap-2 md:gap-4 h-fit xl:h-full">
                    <div className="glass-panel p-3 md:p-6 rounded-[2.5rem] border border-white/20 shadow-2xl bg-white/60 dark:bg-slate-900/40 backdrop-blur-3xl flex xl:flex-col gap-3 w-full justify-center items-center">
                        <button onMouseDown={start} onTouchStart={start} onClick={() => setTool('pen')} className={`p-4 md:p-8 rounded-3xl border-4 transition-all ${tool === 'pen' ? 'border-red-600 bg-red-600/10 text-red-600 scale-110' : 'border-transparent bg-black/5'}`}><IconPen /></button>
                        <button onMouseDown={start} onTouchStart={start} onClick={() => setTool('eraser')} className={`p-4 md:p-8 rounded-3xl border-4 transition-all ${tool === 'eraser' ? 'border-red-600 bg-red-600/10 text-red-600 scale-110' : 'border-transparent bg-black/5'}`}><IconEraser /></button>
                        <button onClick={() => canvasRef.current?.getContext('2d')?.clearRect(0,0,5000,5000)} className="p-4 md:p-8 rounded-3xl bg-red-500/10 text-red-600 hover:bg-red-600 hover:text-white transition-all"><IconTrash /></button>
                        <div className="w-px h-10 bg-slate-300 xl:w-full xl:h-px my-2"></div>
                        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-12 h-12 md:w-16 md:h-16 rounded-3xl cursor-pointer bg-transparent border-none p-0 shadow-2xl hover:scale-105" />
                        <div className="hidden md:block w-full px-2">
                             <input type="range" min="2" max="120" value={lineWidth} onChange={(e) => setLineWidth(Number(e.target.value))} className="w-full accent-red-600 cursor-pointer" />
                        </div>
                    </div>
                </div>

                {/* 2. اللوحة الضخمة (The Masterpiece Canvas) */}
                <div className="xl:col-span-7 order-1 xl:order-2 flex flex-col gap-4 h-[55vh] md:h-full">
                    <div ref={containerRef} className="flex-1 bg-white/95 dark:bg-[#01040a] backdrop-blur-2xl border-[6px] border-white/40 dark:border-white/5 rounded-[3rem] md:rounded-[6rem] shadow-2xl overflow-hidden relative cursor-crosshair group/canvas">
                        <canvas 
                            ref={canvasRef}
                            onMouseDown={start} onMouseMove={draw} onMouseUp={stop} onMouseLeave={stop}
                            onTouchStart={start} onTouchMove={draw} onTouchEnd={stop}
                            className="touch-none w-full h-full relative z-10"
                        />
                        {/* ووتر مارك شعار مدرسة صقر الإمارات (مايلة يمين وباهتة) */}
                        <div className="absolute top-1/2 right-10 -translate-y-1/2 z-0 opacity-[0.03] dark:opacity-[0.06] pointer-events-none transition-all duration-1000 group-hover/canvas:opacity-[0.1]">
                            <img src="/school-logo.png" alt="Watermark" className="w-[40vw] object-contain rotate-[20deg] translate-x-10" />
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleAnalyze} 
                        disabled={isAnalyzing}
                        className="group relative overflow-hidden py-5 md:py-10 rounded-[2.5rem] md:rounded-[5rem] bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-black text-xl md:text-5xl shadow-3xl transition-all disabled:opacity-50"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 opacity-0 group-hover:opacity-20 transition-all duration-700"></div>
                        <span className="relative z-10 flex items-center justify-center gap-6">
                           {isAnalyzing ? (isAr ? 'صقر يحلل بصماتك...' : 'Saqr analyzing...') : <><IconMagic /> {isAr ? 'اسأل صقر عن رسمتك' : 'Ask Saqr Vision'}</>}
                        </span>
                    </button>
                </div>

                {/* 3. نافذة صقر والفيدباك (اليمين) */}
                <div className="xl:col-span-3 order-3 flex flex-col h-full">
                    <div className="glass-panel p-6 md:p-10 rounded-[3.5rem] border border-white/20 shadow-2xl bg-white/80 dark:bg-slate-900/60 backdrop-blur-3xl text-center flex flex-col justify-center min-h-[300px] xl:h-full relative overflow-hidden">
                        {step === 'draw' ? (
                            <div className="space-y-8 animate-fade-in">
                                <img src="/unnamed.png" className="w-32 md:w-56 object-contain mx-auto animate-float" alt="Saqr" />
                                <div className="space-y-4">
                                    <p className="text-slate-950 dark:text-white text-xl md:text-3xl font-black uppercase">{isAr ? 'صقر الذكي' : 'Smart Saqr'}</p>
                                    <p className="text-slate-500 dark:text-slate-400 text-xs md:text-lg font-bold italic leading-relaxed">
                                        "{isAr ? 'ارسم ما تشاء.. وسأعرف هل هو مخطط علمي أم غلاف كتاب أم شيء آخر تماماً!' : 'Draw anything.. I will detect if it is a diagram or a cover!'}"
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6 animate-fade-up w-full">
                                <img src="/unnamed.png" className="w-20 md:w-32 object-contain mx-auto" alt="Result" />
                                <div className="bg-slate-950 dark:bg-white text-white dark:text-slate-950 p-6 rounded-[2.5rem] shadow-2xl border-t-[12px] border-green-500 max-h-[40vh] overflow-y-auto no-scrollbar">
                                    <p className="text-sm md:text-xl font-black leading-tight text-start whitespace-pre-wrap">{saqrFeedback}</p>
                                </div>
                                <div className="space-y-3 pt-4">
                                    <input 
                                        type="text" placeholder={isAr ? "اسمك يا بطل" : "Creator Name"}
                                        value={studentName} onChange={(e) => setStudentName(e.target.value)}
                                        className="w-full p-4 md:p-6 rounded-3xl border-2 border-slate-200 dark:border-white/10 outline-none focus:border-green-500 dark:bg-black/40 text-center font-black"
                                    />
                                    <button onClick={downloadPNG} className="w-full py-5 bg-red-600 text-white rounded-[2rem] font-black text-lg shadow-xl flex items-center justify-center gap-3 hover:scale-105 transition-all">
                                        <IconDownload /> {isAr ? 'حفظ العمل PNG' : 'Save as PNG'}
                                    </button>
                                    <button onClick={() => {setStep('draw'); setSaqrFeedback(null);}} className="w-full text-slate-400 font-black text-[10px] uppercase underline">{isAr ? 'رسمة جديدة' : 'New Canvas'}</button>
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
                .no-scrollbar::-webkit-scrollbar { display: none; }
                * { font-style: normal !important; -webkit-font-smoothing: antialiased; }
                canvas { cursor: crosshair; touch-action: none; image-rendering: pixelated; }
                input[type="range"]::-webkit-slider-thumb {
                    -webkit-appearance: none; appearance: none; width: 25px; height: 25px;
                    background: #ef4444; border: 4px solid white; border-radius: 50%;
                }
            `}</style>
        </div>
    );
};

export default CreatorsStudioPage;
