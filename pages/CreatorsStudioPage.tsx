import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../App';

// --- الأيقونات الملكية ---
const IconPen = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/></svg>;
const IconEraser = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 20H7L3 16C2.5 15.5 2.5 14.5 3 14L13 4L20 11L11 20"/></svg>;
const IconTrash = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/></svg>;
const IconDownload = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;

const CreatorsStudioPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const isAr = locale === 'ar';
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#ef4444');
    const [lineWidth, setLineWidth] = useState(8);
    const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
    const [studentName, setStudentName] = useState("");
    const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

    // تأثير العنوان الزجاجي المتفاعل
    const handleMouseMove = (e: React.MouseEvent) => {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        setMousePos({ x, y });
    };

    // ضبط اللوحة
    useEffect(() => {
        const resize = () => {
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
        resize();
        window.addEventListener('resize', resize);
        return () => window.removeEventListener('resize', resize);
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
        ctx.strokeStyle = tool === 'eraser' ? (document.documentElement.classList.contains('dark') ? '#020617' : '#ffffff') : color;
        ctx.lineTo(pos.x, pos.y); ctx.stroke();
    };

    const stop = () => setIsDrawing(false);

    const downloadPNG = () => {
        const link = document.createElement('a');
        link.download = `Saqr-Creation-${studentName || 'Hero'}.png`;
        link.href = canvasRef.current!.toDataURL("image/png");
        link.click();
    };

    return (
        <div dir={dir} onMouseMove={handleMouseMove} className="min-h-screen bg-slate-50 dark:bg-[#020617] transition-colors duration-700 font-black relative overflow-x-hidden flex flex-col pt-2 antialiased">
            
            {/* الهيدر الملكي */}
            <header className="relative z-30 px-4 md:px-10 w-full flex flex-col items-center gap-2 mb-4">
                <div className="flex w-full justify-between items-center max-w-[1900px]">
                    <Link to="/creators" className="glass-panel border border-white/20 px-5 py-2 md:px-8 md:py-3 bg-white/10 dark:bg-white/5 rounded-2xl text-[10px] md:text-xs text-slate-900 dark:text-white hover:bg-red-600 hover:text-white transition-all shadow-xl font-black uppercase">
                        {isAr ? '⬅ بوابة المبدعين' : '⬅ Portal'}
                    </Link>
                    <img src="/unnamed.png" alt="Saqr" className="h-10 md:h-28 object-contain animate-float drop-shadow-2xl" />
                </div>
                
                <h1 className="text-4xl md:text-[10rem] tracking-tighter text-slate-950 dark:text-white uppercase leading-none cursor-default select-none glass-text"
                    style={{ '--mx': `${mousePos.x}%`, '--my': `${mousePos.y}%` } as any}>
                    {isAr ? 'ارسم ابداعك' : 'DRAW MAGIC'}
                </h1>
                <div className="h-1.5 w-40 md:w-96 bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 rounded-full opacity-60"></div>
            </header>

            {/* الحاوية الرئيسية - مرنة جداً */}
            <div className="flex-1 max-w-[1920px] mx-auto px-2 md:px-10 grid grid-cols-1 lg:grid-cols-12 gap-4 relative z-10 items-stretch mb-6 w-full h-full overflow-hidden">
                
                {/* 1. صندوق الأدوات (اليسار/الأسفل) */}
                <div className="lg:col-span-2 order-2 lg:order-1 flex lg:flex-col gap-2">
                    <div className="glass-panel p-3 md:p-6 rounded-[2.5rem] border border-white/20 shadow-2xl bg-white/60 dark:bg-slate-900/40 backdrop-blur-3xl flex lg:flex-col gap-3 w-full h-fit lg:h-full justify-center items-center">
                        <button onMouseDown={(e) => e.stopPropagation()} onClick={() => setTool('pen')} className={`p-4 md:p-8 rounded-3xl border-4 transition-all ${tool === 'pen' ? 'border-red-600 bg-red-600/10 text-red-600 scale-110 shadow-xl' : 'border-transparent bg-black/5 dark:bg-white/5 dark:text-white'}`}><IconPen /></button>
                        <button onMouseDown={(e) => e.stopPropagation()} onClick={() => setTool('eraser')} className={`p-4 md:p-8 rounded-3xl border-4 transition-all ${tool === 'eraser' ? 'border-red-600 bg-red-600/10 text-red-600 scale-110 shadow-xl' : 'border-transparent bg-black/5 dark:bg-white/5 dark:text-white'}`}><IconEraser /></button>
                        <button onClick={() => canvasRef.current?.getContext('2d')?.clearRect(0,0,5000,5000)} className="p-4 md:p-8 rounded-3xl bg-red-500/10 text-red-600 hover:bg-red-600 hover:text-white transition-all"><IconTrash /></button>
                        <div className="w-px h-10 lg:w-full lg:h-px bg-slate-300 dark:bg-white/10 my-2"></div>
                        <div className="flex lg:flex-col items-center gap-3">
                             <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-12 h-12 md:w-20 md:h-20 rounded-3xl cursor-pointer bg-transparent border-none p-0 shadow-2xl hover:scale-110 transition-transform" />
                             <div className="hidden lg:block w-full">
                                <input type="range" min="2" max="150" value={lineWidth} onChange={(e) => setLineWidth(Number(e.target.value))} className="w-full accent-red-600 cursor-pointer" />
                             </div>
                        </div>
                    </div>
                </div>

                {/* 2. اللوحة المركزية العملاقة */}
                <div className="lg:col-span-10 order-1 lg:order-2 flex flex-col gap-4 h-[60vh] lg:h-full min-h-[450px]">
                    <div ref={containerRef} className="flex-1 bg-white/95 dark:bg-[#01040a] backdrop-blur-2xl border-[6px] border-white/40 dark:border-white/5 rounded-[3rem] lg:rounded-[6rem] shadow-[0_40px_100px_rgba(0,0,0,0.2)] overflow-hidden relative cursor-crosshair group/canvas border-glass-shine">
                        <canvas 
                            ref={canvasRef}
                            onMouseDown={startDraw} onMouseMove={drawing} onMouseUp={stop} onMouseLeave={stop}
                            onTouchStart={startDraw} onTouchMove={drawing} onTouchEnd={stop}
                            className="touch-none w-full h-full relative z-10"
                        />
                        {/* ووتر مارك شعار مدرسة صقر الإمارات (تعديل الظهور في الدارك مود) */}
                        <div className="absolute top-1/2 right-10 -translate-y-1/2 z-0 opacity-[0.06] dark:opacity-[0.15] dark:brightness-200 pointer-events-none transition-all duration-1000 group-hover/canvas:opacity-[0.2]">
                            <img src="/school-logo.png" alt="Watermark" className="w-[45vw] lg:w-[30vw] object-contain rotate-[20deg] translate-x-10 lg:translate-x-20" />
                        </div>
                    </div>
                    
                    {/* زر التحميل العملاق (بدل التحليل) */}
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <input 
                            type="text" placeholder={isAr ? "اكتب اسمك يا بطل قبل التحميل" : "Enter your name before saving"}
                            value={studentName} onChange={(e) => setStudentName(e.target.value)}
                            className="flex-1 w-full p-5 md:p-8 rounded-[2rem] md:rounded-[3.5rem] bg-white/80 dark:bg-white/5 border-4 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white outline-none focus:border-red-600 transition-all font-black text-center text-lg md:text-2xl shadow-xl"
                        />
                        <button 
                            onClick={downloadPNG} 
                            className="group relative overflow-hidden py-5 md:py-8 px-10 md:px-20 rounded-[2rem] md:rounded-[4rem] bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-black text-xl md:text-4xl shadow-3xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-6"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 opacity-0 group-hover:opacity-20 transition-all duration-700"></div>
                            <IconDownload /> <span className="relative">{isAr ? 'حفظ العمل كصورة PNG' : 'SAVE AS PNG'}</span>
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes float { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-10px) rotate(2deg); } }
                .animate-float { animation: float 6s ease-in-out infinite; }
                .glass-panel { transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1); }
                .border-glass-shine { border: 1px solid rgba(255, 255, 255, 0.1); }
                
                .glass-text {
                    background: radial-gradient(circle at var(--mx) var(--my), rgba(255,255,255,1) 0%, rgba(255,255,255,0.2) 60%, rgba(255,255,255,1) 100%);
                    -webkit-background-clip: text; 
                    -webkit-text-fill-color: transparent;
                    color: black; /* Fallback */
                }
                
                /* لضمان وضوح النص في اللايت مود */
                .glass-text {
                    filter: drop-shadow(0 5px 15px rgba(0,0,0,0.1));
                }

                canvas { cursor: crosshair; touch-action: none; image-rendering: pixelated; }
                
                input[type="range"]::-webkit-slider-thumb {
                    -webkit-appearance: none; appearance: none; width: 25px; height: 25px;
                    background: #ef4444; border: 4px solid white; border-radius: 50%;
                }
                
                .no-scrollbar::-webkit-scrollbar { display: none; }
                * { font-style: normal !important; -webkit-font-smoothing: antialiased; }
                [dir="rtl"] h1, [dir="rtl"] p { letter-spacing: 0 !important; }
            `}</style>
        </div>
    );
};

export default CreatorsStudioPage;
