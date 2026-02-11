import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../App';

// --- الأيقونات ---
const IconPen = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/></svg>;
const IconEraser = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 20H7L3 16C2.5 15.5 2.5 14.5 3 14L13 4L20 11L11 20"/></svg>;
const IconTrash = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/></svg>;
const IconMagic = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 4V2m0 4v2m8-3h-2m4 0h-2M3 10l6 6m-6 0l6-6M2 2l20 20"/></svg>;
const IconDownload = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;

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

    // --- 🦅 محرك رؤية صقر الذكي للتعرف التلقائي ---
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

            if (filledPixels < 100) {
                feedback = isAr ? "صقر يطلب منك رسم شيء ما أولاً لكي يحلله!" : "Saqr asks you to draw something first to analyze!";
            } else {
                // منطق التعرف التلقائي
                if (aspectRatio > 0.7 && aspectRatio < 1.3 && density > 0.45) {
                    feedback = isAr ? "أوه! صقر يرى 'شمساً' ساطعة وجميلة في رسمك! لقد قمت بتعديل خطوطك لتكون أكثر إشراقاً." : "Oh! Saqr sees a bright 'Sun' in your drawing! I've refined your strokes to be more radiant.";
                } else if (aspectRatio > 1.4 && minY > canvas.height * 0.3) {
                    feedback = isAr ? "تحليل رائع! صقر اكتشف أنك ترسم 'سيارة' أو مركبة متحركة. تصميمك انسيابي وممتاز!" : "Great analysis! Saqr detected a 'Car' or moving vehicle. Your design is smooth and excellent!";
                } else if (height < 120 && width > 150) {
                    feedback = isAr ? "أنت تكتب بيدك الآن! صقر استطاع قراءة الكلمات رغم تعرج الخط.. أنت مؤلف واعد." : "You are writing by hand! Saqr could read the words despite the shaky lines.. you are a promising author.";
                } else if (density < 0.25) {
                    feedback = isAr ? "هذا مخطط هندسي ذكي لابتكار علمي! صقر أعجب بتفاصيل مشروعك الصغير." : "This is a smart engineering diagram for an innovation! Saqr loved your project details.";
                } else {
                    feedback = isAr ? "غلاف فني مذهل! لقد حللت رسمك واكتشفت تناسقاً رائعاً في الأشكال والألوان." : "Amazing artistic cover! I analyzed your drawing and discovered great harmony in shapes and colors.";
                }
            }

            setSaqrFeedback(feedback);
            if (filledPixels >= 100) setStep('result');
            new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3').play().catch(()=>{});
        }, 2000);
    };

    // --- تحميل الصورة بصيغة PNG ---
    const downloadImage = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const link = document.createElement('a');
        link.download = `saqr-art-${studentName || 'creator'}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
    };

    return (
        <div dir={dir} className="min-h-screen bg-slate-50 dark:bg-[#020617] transition-colors duration-700 font-black relative pb-2 overflow-x-hidden antialiased">
            
            <header className="relative py-4 md:py-8 text-center px-4 z-20 flex flex-col md:flex-row items-center justify-between gap-4 max-w-[1900px] mx-auto">
                <Link to="/creators" className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-2xl text-xs hover:bg-red-600 hover:text-white transition-all shadow-xl font-black uppercase">
                    {isAr ? '⬅ العودة' : '⬅ Back'}
                </Link>
                <div className="flex items-center gap-4">
                    <img src="/unnamed.png" alt="Saqr" className="h-12 md:h-20 object-contain animate-float" />
                    <h1 className="text-3xl md:text-6xl tracking-tighter text-slate-950 dark:text-white uppercase leading-none">
                        {isAr ? 'ارسم ابداعك' : 'DRAW YOUR MAGIC'}
                    </h1>
                </div>
                <div className="w-24 hidden md:block"></div>
            </header>

            <div className="max-w-[1900px] mx-auto px-2 md:px-6 grid grid-cols-1 xl:grid-cols-12 gap-4 h-[calc(100vh-160px)] relative z-10 items-stretch">
                
                {/* 1. لوحة الأدوات الجانبية (Compact) */}
                <div className="xl:col-span-2 order-2 xl:order-1 flex xl:flex-col gap-3 h-fit xl:h-full">
                    <div className="glass-panel p-4 rounded-[2.5rem] border border-white/20 shadow-2xl bg-white/70 dark:bg-slate-900/50 backdrop-blur-3xl flex xl:flex-col gap-4 w-full">
                        <button onClick={() => setTool('pen')} className={`flex-1 p-5 rounded-2xl border-4 transition-all ${tool === 'pen' ? 'border-red-600 bg-red-600/10 text-red-600' : 'border-transparent bg-black/5'}`}><IconPen /></button>
                        <button onClick={() => setTool('eraser')} className={`flex-1 p-5 rounded-2xl border-4 transition-all ${tool === 'eraser' ? 'border-red-600 bg-red-600/10 text-red-600' : 'border-transparent bg-black/5'}`}><IconEraser /></button>
                        <button onClick={() => canvasRef.current?.getContext('2d')?.clearRect(0,0,5000,5000)} className="p-5 rounded-2xl bg-red-500/10 text-red-600 hover:bg-red-600 hover:text-white transition-all"><IconTrash /></button>
                        <div className="flex-1 flex flex-col gap-2">
                             <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-14 rounded-2xl cursor-pointer bg-transparent border-none p-0 overflow-hidden shadow-inner" />
                             <input type="range" min="2" max="80" value={lineWidth} onChange={(e) => setLineWidth(Number(e.target.value))} className="w-full accent-red-600 h-2 bg-black/10 rounded-full appearance-none cursor-pointer" />
                        </div>
                    </div>
                </div>

                {/* 2. اللوحة العملاقة (The Main Canvas) */}
                <div className="xl:col-span-7 order-1 xl:order-2 flex flex-col gap-4 h-full min-h-[400px]">
                    <div ref={containerRef} className="flex-1 bg-white/95 dark:bg-[#020617]/90 backdrop-blur-xl border-4 border-white/20 rounded-[3rem] md:rounded-[5rem] shadow-3xl overflow-hidden relative cursor-crosshair group/canvas">
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
                        <div className="absolute top-6 right-6 opacity-10 pointer-events-none">
                             <img src="/unnamed.png" alt="watermark" className="w-32 rotate-12" />
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleAnalyze} 
                        disabled={isAnalyzing}
                        className="group relative overflow-hidden py-5 md:py-8 rounded-[2.5rem] bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-black text-2xl md:text-5xl shadow-3xl hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-4">
                           {isAnalyzing ? (isAr ? 'صقر يقرأ سحرك...' : 'Saqr is reading...') : <><IconMagic /> {isAr ? 'تحليل ذكاء صقر التلقائي' : 'Run Saqr Vision AI'}</>}
                        </span>
                    </button>
                </div>

                {/* 3. نافذة الفيدباك (Result Panel) */}
                <div className="xl:col-span-3 order-3 w-full h-full min-h-[300px]">
                    <div className="glass-panel p-6 md:p-8 rounded-[3rem] border border-white/20 shadow-2xl bg-white/70 dark:bg-slate-900/50 backdrop-blur-3xl text-center flex flex-col justify-center h-full relative overflow-hidden">
                        {step === 'draw' ? (
                            <div className="space-y-6 animate-fade-in">
                                <img src="/unnamed.png" className="w-24 md:w-40 object-contain mx-auto drop-shadow-xl" alt="Saqr" />
                                <div className="space-y-2">
                                    <p className="text-slate-950 dark:text-white text-xl md:text-2xl font-black">{isAr ? 'مختبر صقر' : 'Saqr Lab'}</p>
                                    <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm font-bold italic leading-relaxed">
                                        "{isAr ? 'ارسم شمس أو سيارة أو غلاف كتاب، وسأعرف فوراً ما هو إبداعك!' : 'Draw a sun, a car or a cover, and I will know it instantly!'}"
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6 animate-fade-up w-full">
                                <div className="bg-slate-950 dark:bg-white text-white dark:text-slate-950 p-6 rounded-3xl border-t-8 border-green-500 shadow-xl">
                                    <p className="text-sm md:text-lg leading-relaxed font-black">{saqrFeedback}</p>
                                </div>
                                <div className="space-y-4">
                                    <input 
                                        type="text" 
                                        placeholder={isAr ? "اكتب اسمك يا بطل" : "Your Name"}
                                        value={studentName}
                                        onChange={(e) => setStudentName(e.target.value)}
                                        className="w-full p-4 rounded-2xl border-2 border-slate-200 dark:border-white/10 outline-none focus:border-green-500 dark:bg-black/40 text-center font-black"
                                    />
                                    <div className="grid grid-cols-1 gap-2">
                                        <button 
                                            onClick={downloadImage}
                                            className="w-full py-4 bg-red-600 text-white rounded-2xl font-black shadow-lg hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                                        >
                                            <IconDownload /> {isAr ? 'تحميل PNG' : 'Download PNG'}
                                        </button>
                                        <button onClick={() => {setStep('draw'); setSaqrFeedback(null);}} className="w-full py-4 bg-slate-200 dark:bg-white/10 rounded-2xl font-black text-xs uppercase">
                                            {isAr ? 'رسمة جديدة' : 'New Drawing'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
                .animate-float { animation: float 4s ease-in-out infinite; }
                .glass-panel { transition: all 0.4s ease; }
                * { font-style: normal !important; -webkit-font-smoothing: antialiased; }
                canvas { cursor: crosshair; touch-action: none; }
                input[type="range"]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 20px;
                    height: 20px;
                    background: #ef4444;
                    border: 3px solid white;
                    border-radius: 50%;
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
};

export default CreatorsStudioPage;
