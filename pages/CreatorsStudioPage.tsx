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
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    // تأثير العنوان المتفاعل (Mouse Reflection)
    const handleMouseMove = (e: React.MouseEvent) => {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        setMousePos({ x, y });
    };

    // تظبيط اللوحة لكل الأحجام
    useEffect(() => {
        const updateSize = () => {
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
                    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
                    ctx.drawImage(img, 0, 0);
                }
            };
        };
        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    const getCoord = (e: any) => {
        const rect = canvasRef.current!.getBoundingClientRect();
        const cx = e.touches ? e.touches[0].clientX : e.clientX;
        const cy = e.touches ? e.touches[0].clientY : e.clientY;
        return { x: cx - rect.left, y: cy - rect.top };
    };

    const startDraw = (e: any) => {
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        setIsDrawing(true);
        const p = getCoord(e);
        ctx.beginPath(); ctx.moveTo(p.x, p.y);
    };

    const drawing = (e: any) => {
        if (!isDrawing) return; // الاستجابة للضغط فقط
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        const p = getCoord(e);
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = tool === 'eraser' ? (document.documentElement.classList.contains('dark') ? '#020617' : '#ffffff') : color;
        ctx.lineTo(p.x, p.y); ctx.stroke();
    };

    // --- 🦅 ذكاء صقر (Auto-Detect بـ Groq) ---
    const handleAnalyze = async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // استدعاء المفتاح المسمى GROQ_API_KEY كما طلبت
        const KEY = (import.meta as any).env?.VITE_GROQ_API_KEY || (import.meta as any).env?.GROQ_API_KEY;

        if (!KEY) {
            setSaqrFeedback(isAr ? "يا بطل، الـ API Key مش واصل! تأكد من إعدادات Vercel (GROQ_API_KEY)." : "Hero, API Key is missing! (GROQ_API_KEY).");
            setStep('result'); return;
        }

        setIsAnalyzing(true);
        const dataUrl = canvas.toDataURL("image/png");

        try {
            const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: { "Authorization": `Bearer ${KEY}`, "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: "llama-3.2-11b-vision-preview",
                    messages: [
                        {
                            role: "user",
                            content: [
                                { type: "text", text: "أنت صقر المساعد الذكي لمدرسة صقر الإمارات. حلل هذه الصورة بذكاء. حدد هل هي غلاف كتاب أم مخطط ابتكار علمي أم رسمة عفوية. تعرّف على أي كتابة يدوية بالداخل. رد بلهجة مصرية مرحة ومشجعة جداً للأطفال واشرح ما تراه بفخر." },
                                { type: "image_url", image_url: { url: dataUrl } }
                            ]
                        }
                    ]
                })
            });
            const json = await res.json();
            setSaqrFeedback(json.choices[0]?.message?.content || "صقر مبهور بيك بس مش لاقي كلام يوصفك!");
            setStep('result');
            new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3').play().catch(()=>{});
        } catch (err) {
            setSaqrFeedback(isAr ? "صقر تعب من كتر الذكاء، جرب تاني يا بطل!" : "Saqr is exhausted, try again!");
        } finally { setIsAnalyzing(false); }
    };

    const savePNG = () => {
        const link = document.createElement('a');
        link.download = `Saqr-Creation-${studentName || 'Hero'}.png`;
        link.href = canvasRef.current!.toDataURL("image/png");
        link.click();
    };

    return (
        <div dir={dir} onMouseMove={handleMouseMove} className="min-h-[100dvh] bg-slate-50 dark:bg-[#020617] transition-colors duration-700 font-black relative overflow-hidden flex flex-col pt-2 md:pt-10 antialiased">
            
            {/* العنوان الكريستالي المتفاعل */}
            <header className="relative z-30 px-4 w-full flex flex-col items-center gap-2 mb-4">
                <div className="flex w-full justify-between items-center max-w-[1900px] mb-2">
                    <Link to="/creators" className="glass-panel border border-white/20 px-5 py-2 rounded-2xl text-[9px] hover:bg-red-600 hover:text-white transition-all shadow-xl font-black uppercase">
                        {isAr ? '⬅ بوابة المبدعين' : '⬅ Portal'}
                    </Link>
                    <img src="/unnamed.png" alt="Saqr" className="h-10 md:h-24 object-contain animate-float drop-shadow-2xl" />
                </div>
                
                <h1 className="text-4xl md:text-[9rem] tracking-tighter text-slate-950 dark:text-white uppercase leading-none cursor-default select-none glass-text"
                    style={{ '--mx': `${mousePos.x}%`, '--my': `${mousePos.y}%` } as any}>
                    {isAr ? 'ارسم ابداعك' : 'DRAW MAGIC'}
                </h1>
                <div className="h-1 w-32 md:w-80 bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 rounded-full opacity-50"></div>
            </header>

            {/* الجسم الرئيسي - Grid ذكي لكل الشاشات */}
            <div className="flex-1 max-w-[1920px] mx-auto px-2 md:px-10 grid grid-cols-1 lg:grid-cols-12 gap-4 relative z-10 items-stretch mb-4 w-full overflow-hidden">
                
                {/* 1. الأدوات - Sidebar في الكمبيوتر و Top-bar في الموبايل */}
                <div className="lg:col-span-2 order-2 lg:order-1 flex lg:flex-col gap-2">
                    <div className="glass-panel p-3 md:p-6 rounded-[2.5rem] border border-white/20 shadow-2xl bg-white/60 dark:bg-slate-900/40 backdrop-blur-3xl flex lg:flex-col gap-3 w-full h-fit lg:h-full justify-center items-center">
                        <button onMouseDown={startDraw} onTouchStart={startDraw} onClick={() => setTool('pen')} className={`p-4 md:p-8 rounded-3xl border-4 transition-all ${tool === 'pen' ? 'border-red-600 bg-red-600/10 text-red-600 scale-110 shadow-xl' : 'border-transparent bg-black/5 dark:bg-white/5'}`}><IconPen /></button>
                        <button onMouseDown={startDraw} onTouchStart={startDraw} onClick={() => setTool('eraser')} className={`p-4 md:p-8 rounded-3xl border-4 transition-all ${tool === 'eraser' ? 'border-red-600 bg-red-600/10 text-red-600 scale-110 shadow-xl' : 'border-transparent bg-black/5 dark:bg-white/5'}`}><IconEraser /></button>
                        <button onClick={() => canvasRef.current?.getContext('2d')?.clearRect(0,0,5000,5000)} className="p-4 md:p-8 rounded-3xl bg-red-500/10 text-red-600 hover:bg-red-600 hover:text-white transition-all"><IconTrash /></button>
                        <div className="w-px h-10 lg:w-full lg:h-px bg-slate-300 dark:bg-white/10 my-2"></div>
                        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-10 h-10 md:w-16 md:h-16 rounded-3xl cursor-pointer bg-transparent border-none p-0 shadow-2xl hover:scale-110 transition-transform" />
                    </div>
                </div>

                {/* 2. اللوحة المركزية العملاقة */}
                <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col gap-3 h-[50vh] lg:h-full">
                    <div ref={containerRef} className="flex-1 bg-white/95 dark:bg-[#01040a] backdrop-blur-2xl border-[5px] border-white/40 dark:border-white/5 rounded-[3rem] lg:rounded-[5rem] shadow-2xl overflow-hidden relative cursor-crosshair group/canvas">
                        <canvas 
                            ref={canvasRef}
                            onMouseDown={startDraw} onMouseMove={drawing} onMouseUp={stop} onMouseLeave={stop}
                            onTouchStart={startDraw} onTouchMove={drawing} onTouchEnd={stop}
                            className="touch-none w-full h-full relative z-10"
                        />
                        {/* الووتر مارك الملكية باهتة ومايلة يمين */}
                        <div className="absolute top-1/2 right-12 -translate-y-1/2 z-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none transition-all duration-700 group-hover/canvas:opacity-[0.08]">
                            <img src="/school-logo.png" alt="EFIPS" className="w-[35vw] object-contain rotate-[22deg]" />
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleAnalyze} 
                        disabled={isAnalyzing}
                        className="group relative overflow-hidden py-4 lg:py-8 rounded-[2rem] lg:rounded-[4rem] bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-black text-xl lg:text-5xl shadow-2xl hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 opacity-0 group-hover:opacity-20 transition-all duration-500"></div>
                        <span className="relative flex items-center justify-center gap-4">
                           {isAnalyzing ? (isAr ? 'صقر يقرأ سحرك...' : 'Saqr analyzing...') : <><IconMagic /> {isAr ? 'اسأل ذكاء صقر' : 'Saqr Vision AI'}</>}
                        </span>
                    </button>
                </div>

                {/* 3. نافذة الفيدباك (اليمين/الأسفل) */}
                <div className="lg:col-span-3 order-3 flex flex-col h-fit lg:h-full">
                    <div className="glass-panel p-5 lg:p-8 rounded-[3rem] border border-white/20 shadow-2xl bg-white/80 dark:bg-slate-900/60 backdrop-blur-3xl text-center flex flex-col justify-center min-h-[250px] lg:h-full relative overflow-hidden">
                        {step === 'draw' ? (
                            <div className="space-y-6 animate-fade-in">
                                <img src="/unnamed.png" className="w-28 lg:w-44 object-contain mx-auto animate-float" alt="Saqr" />
                                <p className="text-slate-500 dark:text-slate-400 text-[10px] lg:text-sm font-bold italic leading-relaxed">
                                    "{isAr ? 'ارسم ما تشاء.. صقر هيعرفه تلقائياً ويقولك ملاحظاته الملكية فوراً!' : 'Draw anything.. Saqr will detect it and give you royal feedback!'}"
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-6 animate-fade-up w-full">
                                <div className="bg-slate-950 dark:bg-white text-white dark:text-slate-950 p-5 rounded-[2rem] shadow-2xl border-t-[10px] border-green-500 max-h-[30vh] overflow-y-auto no-scrollbar">
                                    <p className="text-xs lg:text-lg font-black leading-tight text-start whitespace-pre-wrap">{saqrFeedback}</p>
                                </div>
                                <div className="space-y-3">
                                    <input 
                                        type="text" placeholder={isAr ? "اسم المبدع" : "Creator Name"}
                                        value={studentName} onChange={(e) => setStudentName(e.target.value)}
                                        className="w-full p-4 rounded-3xl border-2 border-slate-200 dark:border-white/10 outline-none focus:border-green-500 dark:bg-black/40 text-center font-black text-xs"
                                    />
                                    <button onClick={savePNG} className="w-full py-4 bg-red-600 text-white rounded-[1.8rem] font-black text-xs lg:text-lg shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2">
                                        <IconDownload /> {isAr ? 'حفظ العمل PNG' : 'Save PNG'}
                                    </button>
                                    <button onClick={() => {setStep('draw'); setSaqrFeedback(null);}} className="w-full text-slate-400 font-black text-[9px] uppercase underline">{isAr ? 'رسمة جديدة' : 'New Canvas'}</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes float { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-10px) rotate(2deg); } }
                .animate-float { animation: float 6s ease-in-out infinite; }
                .glass-panel { transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1); }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .glass-text {
                    background: radial-gradient(circle at var(--mx) var(--my), rgba(255,255,255,1) 0%, rgba(255,255,255,0.2) 60%, rgba(255,255,255,1) 100%);
                    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
                }
                canvas { cursor: crosshair; touch-action: none; image-rendering: pixelated; }
                * { font-style: normal !important; -webkit-font-smoothing: antialiased; }
                [dir="rtl"] h1, [dir="rtl"] p { letter-spacing: 0 !important; }
            `}</style>
        </div>
    );
};

export default CreatorsStudioPage;
