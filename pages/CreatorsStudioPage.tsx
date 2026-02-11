import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../App';

// --- الأيقونات الملكية المحدثة ---
const IconPen = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/></svg>;
const IconEraser = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 20H7L3 16C2.5 15.5 2.5 14.5 3 14L13 4L20 11L11 20"/></svg>;
const IconTrash = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/></svg>;
const IconDownload = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
const IconMagic = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>;

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
    const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

    const handleMouseMove = (e: React.MouseEvent) => {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        setMousePos({ x, y });
    };

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
        const pos = getCoord(e);
        ctx.beginPath(); ctx.moveTo(pos.x, pos.y);
    };

    const drawing = (e: any) => {
        if (!isDrawing) return;
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        const pos = getCoord(e);
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = tool === 'eraser' ? (document.documentElement.classList.contains('dark') ? '#01040a' : '#ffffff') : color;
        ctx.lineTo(pos.x, pos.y); ctx.stroke();
    };

    const stop = () => setIsDrawing(false);

    // --- 🦅 تحليل صقر الجبار الفعلي عبر Groq ---
    const handleAnalyze = async () => {
        if (!studentName.trim()) return;
        const canvas = canvasRef.current;
        if (!canvas) return;

        const KEY = (import.meta as any).env?.VITE_GROQ_API_KEY || (process as any).env?.GROQ_API_KEY;
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
                                { type: "text", text: `أنت صقر، مساعد ذكي بمدرسة صقر الإمارات. حلل رسمة المبدع ${studentName}. هل هذا مخطط هندسي دقيق لابتكار أم غلاف كتاب قصصي؟ تعرف على الأشكال (سيارة، شمس، روبوت). رد بلهجة مصرية مرحة جداً، شجع الطالب واشرح له تفاصيل ما تراه كأنك خبير فني وهندسي.` },
                                { type: "image_url", image_url: { url: dataUrl } }
                            ]
                        }
                    ],
                    temperature: 0.7
                })
            });
            const json = await res.json();
            setSaqrFeedback(json.choices[0]?.message?.content || "صقر مبهور بيك بس الـ AI مهنج!");
            setStep('result');
            new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3').play().catch(()=>{});
        } catch (err) {
            setSaqrFeedback(isAr ? "صقر تعب من كتر الذكاء، جرب تاني يا بطل!" : "Saqr is tired, try again!");
        } finally { setIsAnalyzing(false); }
    };

    const downloadPNG = () => {
        if (!studentName.trim()) {
            alert(isAr ? "اكتب اسمك الأول يا بطل عشان نوثق الرسمة!" : "Enter your name first, hero!");
            return;
        }
        const link = document.createElement('a');
        link.download = `Saqr-Art-${studentName}.png`;
        link.href = canvasRef.current!.toDataURL("image/png");
        link.click();
    };

    return (
        <div dir={dir} onMouseMove={handleBackgroundMouseMove} className="min-h-[100dvh] bg-slate-50 dark:bg-[#01040a] transition-colors duration-700 font-black relative overflow-hidden flex flex-col pt-2 md:pt-6 antialiased">
            
            {/* الخلفية النبضية */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-30">
              <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-red-600/20 blur-[120px] rounded-full animate-pulse"></div>
              <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-green-600/20 blur-[120px] rounded-full animate-pulse"></div>
            </div>

            {/* الهيدر الملكي الفخم */}
            <header className="relative z-30 px-4 md:px-10 w-full flex flex-col items-center gap-4 mb-2 md:mb-6">
                <div className="flex w-full justify-between items-center max-w-[1900px]">
                    <Link to="/creators" className="glass-panel border border-white/30 px-6 py-3 rounded-2xl text-xs text-slate-900 dark:text-white hover:bg-red-600 hover:text-white transition-all shadow-2xl font-black uppercase">
                        {isAr ? '⬅ بوابة المبدعين' : '⬅ Back'}
                    </Link>
                    <img src="/unnamed.png" alt="Saqr" className="h-12 md:h-24 object-contain animate-float drop-shadow-2xl" />
                </div>
                
                <h1 className="text-5xl md:text-[10rem] tracking-tighter text-slate-900 dark:text-white uppercase leading-none cursor-default select-none glass-text-hero"
                    style={{ '--mx': `${mousePos.x}%`, '--my': `${mousePos.y}%` } as any}>
                    {isAr ? 'ارسم ابداعك' : 'DRAW MAGIC'}
                </h1>
            </header>

            {/* الجسم الرئيسي - مرونة تامة للهاتف والكمبيوتر */}
            <div className="flex-1 max-w-[1920px] mx-auto px-2 md:px-10 grid grid-cols-1 lg:grid-cols-12 gap-4 relative z-10 items-stretch mb-4 w-full h-full overflow-hidden">
                
                {/* 1. صندوق الأدوات (متجاوب) */}
                <div className="lg:col-span-1 order-2 lg:order-1 flex lg:flex-col gap-2">
                    <div className="glass-panel-heavy p-3 md:p-6 rounded-[2rem] md:rounded-[3rem] border border-white/40 shadow-2xl bg-white/70 dark:bg-slate-900/50 backdrop-blur-3xl flex lg:flex-col gap-3 w-full h-fit lg:h-full justify-center items-center">
                        <button onMouseDown={(e) => e.stopPropagation()} onClick={() => setTool('pen')} className={`p-4 md:p-6 rounded-2xl border-4 transition-all ${tool === 'pen' ? 'border-red-600 bg-red-600/10 text-red-600 scale-110' : 'border-transparent bg-black/5 dark:bg-white/5 dark:text-white'}`}><IconPen /></button>
                        <button onMouseDown={(e) => e.stopPropagation()} onClick={() => setTool('eraser')} className={`p-4 md:p-6 rounded-2xl border-4 transition-all ${tool === 'eraser' ? 'border-red-600 bg-red-600/10 text-red-600 scale-110' : 'border-transparent bg-black/5 dark:bg-white/5 dark:text-white'}`}><IconEraser /></button>
                        <button onClick={() => canvasRef.current?.getContext('2d')?.clearRect(0,0,5000,5000)} className="p-4 md:p-6 rounded-2xl bg-red-500/10 text-red-600 hover:bg-red-600 hover:text-white transition-all"><IconTrash /></button>
                        <div className="w-px h-10 lg:w-full lg:h-px bg-slate-400 dark:bg-white/20 my-2"></div>
                        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-10 h-10 md:w-14 md:h-14 rounded-full cursor-pointer bg-transparent border-none p-0 shadow-2xl hover:scale-110 transition-transform" />
                    </div>
                </div>

                {/* 2. اللوحة المركزية العملاقة (The Giant Canvas) */}
                <div className="lg:col-span-8 order-1 lg:order-2 flex flex-col gap-4 h-[50vh] lg:h-full min-h-[400px]">
                    <div ref={containerRef} className="flex-1 bg-white dark:bg-[#020617] backdrop-blur-2xl border-[6px] border-white/50 dark:border-white/10 rounded-[3rem] lg:rounded-[5rem] shadow-[0_40px_100px_rgba(0,0,0,0.3)] overflow-hidden relative cursor-crosshair group/canvas">
                        <canvas 
                            ref={canvasRef}
                            onMouseDown={startDraw} onMouseMove={drawing} onMouseUp={stop} onMouseLeave={stop}
                            onTouchStart={startDraw} onTouchMove={drawing} onTouchEnd={stop}
                            className="touch-none w-full h-full relative z-10"
                        />
                        {/* شعار المدرسة - ووتر مارك في النص باهتة جداً ومايلة */}
                        <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.06] transition-all duration-1000 group-hover/canvas:opacity-[0.1]">
                            <img src="/school-logo.png" alt="EFIPS Watermark" className="w-[80%] md:w-[50%] object-contain rotate-[20deg]" />
                        </div>
                    </div>
                    
                    {/* منطقة التحكم بالاسم والتحميل */}
                    <div className="flex flex-col md:flex-row gap-3 items-center">
                        <div className="relative flex-1 w-full group">
                            <input 
                                type="text" placeholder={isAr ? "اكتب اسمك يا بطل..." : "Your name, hero..."}
                                value={studentName} onChange={(e) => setStudentName(e.target.value)}
                                className="w-full p-5 md:p-8 rounded-[2rem] md:rounded-[3.5rem] bg-white/90 dark:bg-white/5 border-4 border-slate-200 dark:border-white/10 text-slate-950 dark:text-white outline-none focus:border-red-600 transition-all font-black text-center text-lg md:text-3xl shadow-xl placeholder:opacity-30"
                            />
                            {studentName.trim() === "" && <span className="absolute left-1/2 -translate-x-1/2 -bottom-2 text-[10px] text-red-600 animate-bounce">{isAr ? 'الاسم مطلوب للتحميل!' : 'Name required!'}</span>}
                        </div>

                        <button 
                            onClick={handleAnalyze}
                            disabled={isAnalyzing || !studentName.trim()}
                            className="group relative overflow-hidden p-5 md:p-8 rounded-[2rem] md:rounded-[4rem] bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-black text-xl md:text-3xl shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-20 disabled:grayscale"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-green-600 opacity-0 group-hover:opacity-20 transition-all"></div>
                            <span className="relative flex items-center gap-4"><IconMagic /> {isAr ? 'تحليل صقر' : 'Saqr AI'}</span>
                        </button>

                        <button 
                            onClick={downloadPNG} 
                            disabled={!studentName.trim()}
                            className="group relative overflow-hidden p-5 md:p-8 rounded-[2rem] md:rounded-[4rem] bg-red-600 text-white font-black text-xl md:text-3xl shadow-3xl hover:scale-105 active:scale-95 transition-all disabled:opacity-20"
                        >
                            <IconDownload />
                        </button>
                    </div>
                </div>

                {/* 3. الفيدباك الملكي (الجانبي) */}
                <div className="lg:col-span-3 order-3 flex flex-col h-fit lg:h-full">
                    <div className="glass-panel-heavy p-6 md:p-10 rounded-[3rem] border border-white/40 shadow-2xl bg-white/80 dark:bg-slate-900/60 backdrop-blur-3xl text-center flex flex-col justify-center min-h-[300px] lg:h-full relative overflow-hidden">
                        {step === 'draw' ? (
                            <div className="space-y-8 animate-fade-in px-4">
                                <img src="/unnamed.png" className="w-32 md:w-56 object-contain mx-auto animate-float drop-shadow-2xl" alt="Saqr" />
                                <div className="space-y-4">
                                    <p className="text-slate-900 dark:text-white text-2xl md:text-4xl font-black tracking-tighter leading-none">{isAr ? 'صقر في انتظارك' : 'Saqr is Ready'}</p>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm md:text-lg font-bold italic leading-relaxed">
                                        "{isAr ? 'اكتب اسمك، ارسم فكرتك، وصقر هيقولك رأيه الهندسي فوراً!' : 'Enter your name, draw, and get Saqr\'s technical feedback!'}"
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6 animate-fade-up w-full px-2">
                                <div className="bg-slate-950 dark:bg-white text-white dark:text-slate-950 p-6 rounded-[2.5rem] shadow-2xl border-t-[12px] border-green-500 max-h-[50vh] overflow-y-auto no-scrollbar scroll-smooth">
                                    <p className="text-sm md:text-2xl font-black leading-tight text-start whitespace-pre-wrap">{saqrFeedback}</p>
                                </div>
                                <button onClick={() => {setStep('draw'); setSaqrFeedback(null);}} className="w-full py-4 text-red-600 font-black text-xs md:text-lg uppercase underline decoration-4 underline-offset-8 transition-all hover:text-slate-900">{isAr ? 'تحدي جديد' : 'New Sketch'}</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes float { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-15px) rotate(3deg); } }
                .animate-float { animation: float 6s ease-in-out infinite; }
                .glass-panel-heavy { background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(40px); border: 1px solid rgba(255, 255, 255, 0.2); }
                
                .glass-text-hero {
                    background: radial-gradient(circle at var(--mx) var(--my), #ff0000 0%, #000 70%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    filter: drop-shadow(0 10px 30px rgba(0,0,0,0.2));
                }
                .dark .glass-text-hero {
                    background: radial-gradient(circle at var(--mx) var(--my), #ffffff 0%, #ff0000 40%, #000 80%);
                }

                canvas { cursor: crosshair; touch-action: none; image-rendering: pixelated; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                
                input[type="range"]::-webkit-slider-thumb {
                    -webkit-appearance: none; appearance: none; width: 25px; height: 25px;
                    background: #ef4444; border: 4px solid white; border-radius: 50%;
                    cursor: pointer; box-shadow: 0 5px 15px rgba(239,68,68,0.4);
                }

                * { font-style: normal !important; -webkit-font-smoothing: antialiased; }
                [dir="rtl"] h1, [dir="rtl"] p, [dir="rtl"] input { letter-spacing: 0 !important; }
            `}</style>
        </div>
    );
};

export default CreatorsStudioPage;
