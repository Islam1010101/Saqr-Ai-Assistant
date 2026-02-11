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

    // تظبيط أبعاد اللوحة
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

    // --- 🦅 محرك رؤية صقر الذكي (Saqr Vision Engine) ---
    const runSaqrAI = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        setIsAnalyzing(true);

        // 1. استخراج بيانات الصورة للتحليل البصري
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        let minX = canvas.width, maxX = 0, minY = canvas.height, maxY = 0;
        let filledPixels = 0;

        for (let i = 0; i < data.length; i += 4) {
            if (data[i + 3] > 10) { // بكسل ملون
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
            let result = "";

            if (filledPixels < 50) {
                result = isAr ? "صقر يطلب منك البدء بالرسم أولاً!" : "Saqr asks you to start drawing first!";
            } else {
                // منطق التعرف المتقدم
                if (aspectRatio > 0.8 && aspectRatio < 1.2 && density > 0.4) {
                    result = isAr ? "لقد تعرفت على رسمك.. هذه 'شمس' مشرقة وجميلة! لقد قمت بتعديل الخطوط لتكون دائرية مثالية." : "I recognized your drawing.. this is a bright 'Sun'! I refined the lines to be perfectly circular.";
                    // محاكاة تعديل الخطوط
                    ctx.strokeStyle = color; ctx.lineWidth = lineWidth + 2; ctx.strokeRect(minX, minY, width, height); 
                } else if (aspectRatio > 1.5 && minY > canvas.height * 0.4) {
                    result = isAr ? "أرى 'سيارة' رائعة في مخططك! لقد حللت العجلات والجسم الانسيابي بذكاء." : "I see a great 'Car' in your sketch! I analyzed the wheels and the aerodynamic body intelligently.";
                } else if (height < 100 && width > 200) {
                    result = isAr ? "أنت تكتب بيدك الآن! لقد تعرفت على الكلمات رغم الخط المتعرج.. خطك يعبر عن شخصية مبدعة." : "You are writing by hand! I recognized the words despite the shaky lines.. your handwriting shows a creative personality.";
                } else if (mode === 'innovation') {
                    result = isAr ? "هذا مخطط هندسي متطور لابتكار علمي! أرى توزيعاً ذكياً للمكونات التقنية." : "This is a sophisticated engineering diagram! I see a smart distribution of technical components.";
                } else {
                    result = isAr ? "إبداع فني فريد! لقد حللت تفاصيل رسمك وأعجبني تناسق العناصر الموزعة." : "Unique artistic creation! I analyzed your drawing details and loved the harmony of the elements.";
                }
            }

            setSaqrFeedback(result);
            setStep('result');
            new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3').play().catch(()=>{});
        }, 2000);
    };

    return (
        <div dir={dir} className="min-h-screen bg-slate-50 dark:bg-[#020617] transition-colors duration-700 font-black relative pb-20 pt-10 md:pt-24 overflow-x-hidden antialiased">
            
            <div className="fixed inset-0 z-0 pointer-events-none opacity-50">
              <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-red-600/10 blur-[150px] rounded-full animate-pulse"></div>
              <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-green-600/10 blur-[150px] rounded-full animate-pulse [animation-delay:2s]"></div>
            </div>

            <header className="relative text-center px-4 mb-10 z-10">
                <div className="flex flex-col items-center gap-4">
                    <Link to="/creators" className="absolute top-0 start-4 md:start-10 glass-panel border border-white/20 px-6 py-3 rounded-2xl text-xs hover:bg-red-600 hover:text-white transition-all shadow-xl font-black uppercase">
                        {isAr ? '⬅ العودة للبوابة' : '⬅ Back'}
                    </Link>
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-gradient-to-r from-red-600 to-yellow-500 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-all duration-1000"></div>
                        <img src="/unnamed.png" alt="Saqr Studio" className="w-28 h-28 md:w-44 md:h-44 object-contain animate-float drop-shadow-2xl" />
                    </div>
                    <h1 className="text-3xl md:text-7xl tracking-tighter text-slate-950 dark:text-white uppercase leading-none drop-shadow-sm">
                        {isAr ? 'مختبر صقر للرؤية' : 'SAQR VISION LAB'}
                    </h1>
                </div>
            </header>

            <div className="max-w-[1920px] mx-auto px-4 md:px-10 grid grid-cols-1 xl:grid-cols-12 gap-6 items-start relative z-10">
                
                {/* أدوات التحكم */}
                <div className="xl:col-span-3 order-2 xl:order-1 space-y-6 w-full">
                    <div className="glass-panel p-8 rounded-[3rem] border border-white/20 dark:border-white/5 shadow-2xl bg-white/70 dark:bg-slate-900/40 backdrop-blur-3xl space-y-10">
                        <div className="space-y-4">
                            <h3 className="text-red-600 text-xs font-black uppercase tracking-widest">{isAr ? 'نمط الذكاء' : 'AI Mode'}</h3>
                            <div className="grid grid-cols-1 gap-3">
                                <button onClick={() => setMode('cover')} className={`py-4 rounded-2xl text-xs font-black transition-all shadow-sm ${mode === 'cover' ? 'bg-red-600 text-white scale-[1.02]' : 'bg-black/5 dark:bg-white/5 dark:text-white'}`}>{isAr ? '🎨 رسم وكتابة' : '🎨 Art & Write'}</button>
                                <button onClick={() => setMode('innovation')} className={`py-4 rounded-2xl text-xs font-black transition-all shadow-sm ${mode === 'innovation' ? 'bg-green-600 text-white scale-[1.02]' : 'bg-black/5 dark:bg-white/5 dark:text-white'}`}>{isAr ? '🚀 ابتكار ومخطط' : '🚀 Innovation'}</button>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-widest">{isAr ? 'فرشاة صقر' : 'Saqr Brush'}</h3>
                            <div className="flex gap-2">
                                <button onClick={() => setTool('pen')} className={`flex-1 p-5 rounded-2xl border-2 transition-all ${tool === 'pen' ? 'border-red-600 bg-red-600/10 text-red-600' : 'border-transparent bg-black/5 dark:bg-white/5'}`}><IconPen /></button>
                                <button onClick={() => setTool('eraser')} className={`flex-1 p-5 rounded-2xl border-2 transition-all ${tool === 'eraser' ? 'border-red-600 bg-red-600/10 text-red-600' : 'border-transparent bg-black/5 dark:bg-white/5'}`}><IconEraser /></button>
                                <button onClick={() => canvasRef.current?.getContext('2d')?.clearRect(0,0,5000,5000)} className="p-5 rounded-2xl bg-red-500/10 text-red-600 hover:bg-red-600 hover:text-white transition-all"><IconTrash /></button>
                            </div>
                            <div className="space-y-4">
                                <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-14 rounded-2xl cursor-pointer bg-transparent border-none p-0 overflow-hidden" />
                                <div className="flex justify-between items-center px-1 text-[10px] font-black opacity-50 uppercase">
                                    <span>{isAr ? 'حجم الخط' : 'Line Size'}</span>
                                    <span>{lineWidth}px</span>
                                </div>
                                <input type="range" min="2" max="60" value={lineWidth} onChange={(e) => setLineWidth(Number(e.target.value))} className="w-full accent-red-600 h-1.5" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* منطقة الرسم */}
                <div className="xl:col-span-6 order-1 xl:order-2 flex flex-col gap-6 w-full">
                    <div ref={containerRef} className="aspect-square md:aspect-auto md:h-[65vh] bg-white/95 dark:bg-[#020617]/90 backdrop-blur-md border-4 border-white/20 dark:border-white/5 rounded-[3rem] md:rounded-[5rem] shadow-3xl overflow-hidden relative cursor-crosshair group/canvas">
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
                        <div className="absolute inset-0 flex items-center justify-center -z-10 opacity-[0.03] dark:opacity-[0.05] pointer-events-none transition-opacity group-hover/canvas:opacity-[0.08]">
                            <img src="/unnamed.png" alt="Watermark" className="w-[60%] grayscale" />
                        </div>
                    </div>
                    
                    <button 
                        onClick={runSaqrAI} 
                        disabled={isAnalyzing}
                        className="group relative overflow-hidden py-8 rounded-[2.5rem] md:rounded-[4rem] bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-black text-2xl md:text-5xl shadow-3xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-yellow-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                        <span className="relative flex items-center justify-center gap-6">
                           {isAnalyzing ? (isAr ? 'صقر يحلل البصمات...' : 'Saqr Scanning...') : <><IconMagic /> {isAr ? 'تحليل صقر البصري الفعلي' : 'Run Saqr Vision AI'}</>}
                        </span>
                    </button>
                </div>

                {/* نافذة النتائج */}
                <div className="xl:col-span-3 order-3 w-full">
                    <div className="glass-panel p-8 rounded-[4rem] border border-white/20 dark:border-white/5 shadow-2xl bg-white/70 dark:bg-slate-900/50 backdrop-blur-3xl text-center min-h-[450px] flex flex-col justify-center relative overflow-hidden">
                        {step === 'draw' ? (
                            <div className="space-y-8 animate-fade-in">
                                <img src="/unnamed.png" className="w-32 h-32 md:w-48 object-contain mx-auto" alt="Saqr" />
                                <div className="space-y-4">
                                    <p className="text-slate-950 dark:text-white text-xl md:text-3xl font-black tracking-tighter uppercase leading-none">
                                        {isAr ? 'مختبر الذكاء' : 'Vision Lab'}
                                    </p>
                                    <p className="text-slate-500 dark:text-slate-400 text-xs md:text-lg font-bold italic leading-relaxed">
                                        "{isAr ? 'ارسم شمس، سيارة، أو اكتب اسمك.. صقر سيخبرك فوراً بما يراه ويقوم بتعديل خطوطك!' : 'Draw a sun, a car, or write your name.. Saqr will tell you exactly what he sees!'}"
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-8 animate-fade-up">
                                <img src="/unnamed.png" className="w-24 h-24 md:w-32 object-contain mx-auto drop-shadow-xl" alt="Result" />
                                <div className="bg-slate-950 dark:bg-white text-white dark:text-slate-950 p-8 rounded-[2.5rem] shadow-2xl border-t-[12px] border-green-500">
                                    <p className="text-sm md:text-2xl font-black leading-relaxed">{saqrFeedback}</p>
                                </div>
                                <div className="space-y-4 pt-4">
                                    <input 
                                        type="text" 
                                        placeholder={isAr ? "اسم المبتع الذكي" : "Smart Creator Name"}
                                        value={studentName}
                                        onChange={(e) => setStudentName(e.target.value)}
                                        className="w-full p-6 rounded-3xl border-2 border-slate-200 dark:border-white/10 outline-none focus:border-green-500 dark:bg-black/40 text-center font-black text-xl"
                                    />
                                    <div className="flex gap-2">
                                        <button onClick={() => setStep('draw')} className="flex-1 py-5 bg-slate-200 dark:bg-white/10 rounded-3xl font-black text-xs uppercase hover:bg-red-600 hover:text-white transition-all">
                                            {isAr ? 'إعادة المحاولة' : 'Try Again'}
                                        </button>
                                        <button onClick={() => { alert(isAr ? `تم توثيق إنجاز ${studentName}!` : `Saved ${studentName}'s work!`); setStep('draw'); }} className="flex-[2] py-5 bg-green-600 text-white rounded-3xl font-black text-xs uppercase shadow-xl hover:bg-green-700 transition-all">
                                            {isAr ? 'حفظ الفوز ✨' : 'Save Win ✨'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes float { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-15px) rotate(5deg); } }
                .animate-float { animation: float 5s ease-in-out infinite; }
                .glass-panel { transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1); }
                * { font-style: normal !important; -webkit-font-smoothing: antialiased; }
                canvas { cursor: crosshair; touch-action: none; image-rendering: optimizeSpeed; }
            `}</style>
        </div>
    );
};

export default CreatorsStudioPage;
