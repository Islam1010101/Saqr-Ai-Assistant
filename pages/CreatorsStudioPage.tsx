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
    const titleRef = useRef<HTMLHeadingElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#ef4444');
    const [lineWidth, setLineWidth] = useState(8);
    const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [saqrFeedback, setSaqrFeedback] = useState<string | null>(null);
    const [studentName, setStudentName] = useState("");
    const [step, setStep] = useState<'draw' | 'result'>('draw');

    // تأثير العنوان المتفاعل مع الماوس
    const handleTitleMouseMove = (e: React.MouseEvent) => {
        if (!titleRef.current) return;
        const { left, top, width, height } = titleRef.current.getBoundingClientRect();
        const x = (e.clientX - left) / width;
        const y = (e.clientY - top) / height;
        titleRef.current.style.setProperty('--x', x.toString());
        titleRef.current.style.setProperty('--y', y.toString());
    };

    // ضبط أبعاد اللوحة
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

    // --- 🦅 ربط الذكاء الاصطناعي الفعلي بـ Groq API ---
    const handleAnalyze = async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        setIsAnalyzing(true);
        setSaqrFeedback(null);

        // 1. تحويل الرسمة لـ Base64
        const imageData = canvas.toDataURL("image/png");

        try {
            // 2. إرسال الطلب لـ Groq (موديل رؤية Llama 3.2)
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer YOUR_GROQ_API_KEY`, // ضع مفتاحك هنا
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "llama-3.2-11b-vision-preview",
                    messages: [
                        {
                            role: "user",
                            content: [
                                { type: "text", text: isAr ? "أنت صقر، مساعد ذكي في مدرسة صقر الإمارات. حلل هذه الرسمة أو الكتابة اليدوية. أخبرني ماذا ترى (هل هي شمس، سيارة، كائن، أم كتابة؟) وإذا كانت مخططاً علمياً أو غلاف كتاب. شجع الطالب بلهجة مصرية مرحة وباللغة العربية." : "Analyze this drawing. Identify objects like sun, car, or handwriting. Determine if it is a scientific diagram or a book cover. Be encouraging and fun in Arabic." },
                                { type: "image_url", image_url: { url: imageData } }
                            ]
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 300
                })
            });

            const result = await response.json();
            const aiResponse = result.choices[0]?.message?.content || (isAr ? "صقر مبهور بيك بس مش عارف ينطق!" : "Saqr is speechless!");
            
            setSaqrFeedback(aiResponse);
            setStep('result');
            new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3').play().catch(()=>{});

        } catch (error) {
            setSaqrFeedback(isAr ? "عذراً يا بطل، صقر واجه مشكلة في الاتصال بالشبكة!" : "Sorry, Saqr lost connection!");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const downloadPNG = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const link = document.createElement('a');
        link.download = `Saqr-Art-${studentName || 'Creator'}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
    };

    return (
        <div dir={dir} className="min-h-screen bg-slate-50 dark:bg-[#020617] transition-colors duration-700 font-black relative overflow-x-hidden antialiased flex flex-col">
            
            {/* الهيدر الزجاجي الفخم */}
            <header className="relative pt-8 pb-4 text-center px-4 z-20 flex flex-col items-center gap-6 max-w-[1900px] mx-auto w-full">
                <div className="flex w-full justify-between items-center px-4 md:px-10">
                    <Link to="/creators" className="glass-panel border border-white/20 px-6 py-3 rounded-2xl text-xs hover:bg-red-600 hover:text-white transition-all shadow-xl font-black uppercase">
                        {isAr ? '⬅ العودة' : '⬅ Back'}
                    </Link>
                    <img src="/unnamed.png" alt="Saqr" className="h-16 md:h-28 object-contain animate-float drop-shadow-2xl" />
                    <div className="w-10 md:w-24"></div>
                </div>
                
                <div className="relative group" onMouseMove={handleTitleMouseMove}>
                    <h1 ref={titleRef} className="text-5xl md:text-[11rem] tracking-tighter text-slate-950 dark:text-white uppercase leading-none glass-text-effect cursor-default transition-all duration-500 hover:scale-105 active:scale-95">
                        {isAr ? 'ارسم ابداعك' : 'DRAW YOUR MAGIC'}
                    </h1>
                </div>
                <div className="h-2 w-40 md:w-80 bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 rounded-full shadow-lg"></div>
            </header>

            {/* الحاوية الرئيسية للمرسم */}
            <div className="flex-1 max-w-[1920px] mx-auto px-4 md:px-10 grid grid-cols-1 xl:grid-cols-12 gap-6 relative z-10 items-stretch h-full mb-10">
                
                {/* 1. أدوات الرسم (Sidebar) */}
                <div className="xl:col-span-2 order-2 xl:order-1 flex xl:flex-col gap-4 h-fit xl:h-full">
                    <div className="glass-panel p-4 md:p-6 rounded-[3rem] border border-white/20 shadow-2xl bg-white/60 dark:bg-slate-900/40 backdrop-blur-3xl flex xl:flex-col gap-5 w-full h-full justify-center">
                        <button onClick={() => setTool('pen')} className={`p-6 rounded-3xl border-4 transition-all hover:scale-110 ${tool === 'pen' ? 'border-red-600 bg-red-600/10 text-red-600' : 'border-transparent bg-black/5 dark:bg-white/5'}`}><IconPen /></button>
                        <button onClick={() => setTool('eraser')} className={`p-6 rounded-3xl border-4 transition-all hover:scale-110 ${tool === 'eraser' ? 'border-red-600 bg-red-600/10 text-red-600' : 'border-transparent bg-black/5 dark:bg-white/5'}`}><IconEraser /></button>
                        <button onClick={() => canvasRef.current?.getContext('2d')?.clearRect(0,0,5000,5000)} className="p-6 rounded-3xl bg-red-500/10 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-lg"><IconTrash /></button>
                        <div className="space-y-4">
                             <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-16 rounded-3xl cursor-pointer bg-transparent border-none p-0 overflow-hidden shadow-2xl" />
                             <div className="bg-black/5 dark:bg-white/5 p-4 rounded-3xl">
                                <input type="range" min="2" max="100" value={lineWidth} onChange={(e) => setLineWidth(Number(e.target.value))} className="w-full accent-red-600 h-2 cursor-pointer" />
                             </div>
                        </div>
                    </div>
                </div>

                {/* 2. اللوحة المركزية (The Giant Master Canvas) */}
                <div className="xl:col-span-7 order-1 xl:order-2 flex flex-col gap-4 min-h-[500px] h-full">
                    <div ref={containerRef} className="flex-1 bg-white/95 dark:bg-[#01040a] backdrop-blur-2xl border-[6px] border-white/30 dark:border-white/5 rounded-[4rem] md:rounded-[6rem] shadow-[0_40px_100px_rgba(0,0,0,0.2)] overflow-hidden relative cursor-crosshair group/canvas border-glass-shine">
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
                        {/* الووتر مارك الملكية (شعار المدرسة المائل) */}
                        <div className="absolute inset-0 flex items-center justify-center z-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none transition-all group-hover/canvas:opacity-[0.08]">
                            <img src="/school-logo.png" alt="EFIPS Watermark" className="w-[70%] object-contain rotate-[20deg] translate-x-10" />
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleAnalyze} 
                        disabled={isAnalyzing}
                        className="group relative overflow-hidden py-8 rounded-[3rem] md:rounded-[5rem] bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-black text-2xl md:text-5xl shadow-3xl hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 opacity-0 group-hover:opacity-10 transition-opacity duration-700"></div>
                        <span className="relative z-10 flex items-center justify-center gap-6">
                           {isAnalyzing ? (isAr ? 'صقر يحلل ريشتك...' : 'Saqr analyzing...') : <><IconMagic /> {isAr ? 'تفعيل ذكاء صقر الفعلي' : 'Run Real Saqr AI'}</>}
                        </span>
                    </button>
                </div>

                {/* 3. نافذة فيدباك صقر والتحميل */}
                <div className="xl:col-span-3 order-3 w-full h-fit xl:h-full">
                    <div className="glass-panel p-8 rounded-[4rem] border border-white/20 shadow-2xl bg-white/80 dark:bg-slate-900/60 backdrop-blur-3xl text-center flex flex-col justify-center min-h-[400px] md:h-full relative overflow-hidden">
                        {step === 'draw' ? (
                            <div className="space-y-8 animate-fade-in">
                                <img src="/unnamed.png" className="w-32 md:w-56 object-contain mx-auto animate-float" alt="Saqr" />
                                <div className="space-y-4">
                                    <p className="text-slate-950 dark:text-white text-2xl md:text-4xl font-black leading-none">{isAr ? 'مختبر صقر' : 'Saqr Lab'}</p>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm md:text-lg font-bold italic leading-relaxed">
                                        "{isAr ? 'ارسم أي شيء الآن، وسأخبرك فوراً ما هو إبداعك وملاحظاتي عليه!' : 'Draw anything, and I will tell you what it is instantly!'}"
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6 animate-fade-up w-full px-2">
                                <img src="/unnamed.png" className="w-24 md:w-32 object-contain mx-auto" alt="Saqr Feedback" />
                                <div className="bg-slate-950 dark:bg-white text-white dark:text-slate-950 p-6 rounded-[2.5rem] shadow-2xl border-t-[12px] border-green-500 max-h-[300px] overflow-y-auto no-scrollbar">
                                    <p className="text-sm md:text-xl font-black leading-tight text-start">{saqrFeedback}</p>
                                </div>
                                <div className="space-y-4">
                                    <input 
                                        type="text" 
                                        placeholder={isAr ? "اكتب اسمك يا بطل" : "Your Name"}
                                        value={studentName}
                                        onChange={(e) => setStudentName(e.target.value)}
                                        className="w-full p-5 rounded-3xl border-2 border-slate-200 dark:border-white/10 outline-none focus:border-green-500 dark:bg-black/40 text-center font-black text-sm shadow-inner"
                                    />
                                    <button 
                                        onClick={downloadPNG}
                                        className="w-full py-5 bg-red-600 text-white rounded-[2rem] font-black text-xs md:text-lg shadow-xl hover:bg-red-700 transition-all flex items-center justify-center gap-3"
                                    >
                                        <IconDownload /> {isAr ? 'تحميل PNG' : 'Save PNG'}
                                    </button>
                                    <button onClick={() => {setStep('draw'); setSaqrFeedback(null);}} className="w-full py-4 text-slate-400 font-black text-[10px] uppercase underline">{isAr ? 'رسمة جديدة' : 'New Drawing'}</button>
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
                    background: linear-gradient(calc(var(--x, 0.5) * 360deg), rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.8) 100%);
                    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
                    filter: drop-shadow(0 10px 30px rgba(0,0,0,0.1));
                }
                canvas { cursor: crosshair; touch-action: none; image-rendering: pixelated; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                * { font-style: normal !important; -webkit-font-smoothing: antialiased; }
                [dir="rtl"] h1, [dir="rtl"] p { letter-spacing: 0 !important; }
            `}</style>
        </div>
    );
};

export default CreatorsStudioPage;
