import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../App';

// --- الأيقونات الملكية ---
const IconPen = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/></svg>;
const IconEraser = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 20H7L3 16C2.5 15.5 2.5 14.5 3 14L13 4L20 11L11 20"/></svg>;
const IconTrash = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/></svg>;
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

    // توجيه التوهج الأبيض في العنوان
    const handleTitleHover = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setMousePos({ x, y });
    };

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
        e.preventDefault();
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        setIsDrawing(true);
        const pos = getCoord(e);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
    };

    const drawing = (e: any) => {
        if (!isDrawing) return;
        e.preventDefault();
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        const pos = getCoord(e);
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = tool === 'eraser' ? (document.documentElement.classList.contains('dark') ? '#01040a' : '#ffffff') : color;
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
    };

    const stop = () => {
        if (isDrawing) {
            canvasRef.current?.getContext('2d')?.closePath();
            setIsDrawing(false);
        }
    };

    const downloadPNG = () => {
        if (!studentName.trim()) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const link = document.createElement('a');
        link.download = `Saqr-Art-${studentName}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
    };

    return (
        <div dir={dir} className="min-h-[100dvh] bg-slate-50 dark:bg-[#01040a] transition-colors duration-700 font-black relative overflow-hidden flex flex-col pt-2 md:pt-4 antialiased">
            
            {/* الهيدر الملكي */}
            <header className="relative z-30 px-4 md:px-10 w-full flex flex-col items-center gap-2 mb-4">
                <div className="flex w-full justify-between items-center max-w-[1900px] mb-2">
                    <Link to="/creators" className="glass-panel border border-white/40 px-5 py-2 md:px-8 md:py-3 bg-white/20 dark:bg-white/5 rounded-2xl text-[10px] md:text-xs text-slate-900 dark:text-white hover:bg-red-600 transition-all shadow-xl font-black uppercase">
                        {isAr ? '⬅ بوابة المبدعين' : '⬅ Portal'}
                    </Link>
                    <img src="/unnamed.png" alt="Saqr" className="h-10 md:h-24 object-contain animate-float drop-shadow-2xl" />
                </div>
                
                {/* العنوان الأسود الملكي مع التوهج الأبيض */}
                <div className="relative group overflow-visible" onMouseMove={handleTitleHover}>
                    <h1 className="text-5xl md:text-[11rem] tracking-tighter uppercase leading-none cursor-default select-none royal-black-title"
                        style={{ '--glow-x': `${mousePos.x}%`, '--glow-y': `${mousePos.y}%` } as any}>
                        {isAr ? 'ارسم ابداعك' : 'DRAW MAGIC'}
                    </h1>
                </div>
                <div className="h-1 w-40 md:w-[50rem] bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 rounded-full opacity-40"></div>
            </header>

            {/* الحاوية الرئيسية - محسنة جداً للكمبيوتر */}
            <div className="flex-1 max-w-[1920px] mx-auto px-2 md:px-10 grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10 items-stretch mb-6 w-full h-full overflow-hidden">
                
                {/* 1. صندوق الأدوات ( Sidebar ) */}
                <div className="lg:col-span-1 order-2 lg:order-1 flex lg:flex-col gap-2">
                    <div className="glass-panel-heavy p-3 md:p-6 rounded-[2.5rem] border border-white/30 shadow-2xl bg-white/80 dark:bg-slate-900/50 backdrop-blur-3xl flex lg:flex-col gap-4 w-full h-fit lg:h-full justify-center items-center">
                        <button onClick={() => setTool('pen')} className={`p-4 md:p-8 rounded-3xl border-4 transition-all ${tool === 'pen' ? 'border-red-600 bg-red-600/10 text-red-600 scale-110 shadow-xl' : 'border-transparent bg-black/5 dark:bg-white/10 dark:text-white'}`}><IconPen /></button>
                        <button onClick={() => setTool('eraser')} className={`p-4 md:p-8 rounded-3xl border-4 transition-all ${tool === 'eraser' ? 'border-red-600 bg-red-600/10 text-red-600 scale-110 shadow-xl' : 'border-transparent bg-black/5 dark:bg-white/10 dark:text-white'}`}><IconEraser /></button>
                        <button onClick={() => canvasRef.current?.getContext('2d')?.clearRect(0,0,5000,5000)} className="p-4 md:p-8 rounded-3xl bg-red-500/10 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-lg"><IconTrash /></button>
                        <div className="w-px h-10 lg:w-full lg:h-px bg-slate-400 dark:bg-white/20 my-2"></div>
                        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-10 h-10 md:w-16 md:h-16 rounded-full cursor-pointer bg-transparent border-none p-0 shadow-2xl hover:scale-125 transition-transform" />
                    </div>
                </div>

                {/* 2. اللوحة المركزية العملاقة */}
                <div className="lg:col-span-11 order-1 lg:order-2 flex flex-col gap-4 h-[55vh] lg:h-full min-h-[450px]">
                    <div ref={containerRef} className="flex-1 bg-white dark:bg-[#020617] backdrop-blur-3xl border-[8px] border-white/60 dark:border-white/5 rounded-[3.5rem] lg:rounded-[6rem] shadow-[0_50px_120px_rgba(0,0,0,0.4)] overflow-hidden relative cursor-crosshair group/canvas border-glass-shine">
                        <canvas 
                            ref={canvasRef}
                            onMouseDown={startDraw}
                            onMouseMove={drawing}
                            onMouseUp={stop}
                            onMouseLeave={stop}
                            onTouchStart={startDraw}
                            onTouchMove={drawing}
                            onTouchEnd={stop}
                            className="touch-none w-full h-full relative z-10 block"
                        />
                        {/* الووتر مارك الملكية - في النص بظبط */}
                        <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none opacity-[0.05] dark:opacity-[0.1] transition-all duration-1000 group-hover/canvas:opacity-[0.15]">
                            <img src="/school-logo.png" alt="EFIPS" className="w-[70%] md:w-[35%] object-contain rotate-[15deg] select-none" />
                        </div>
                    </div>
                    
                    {/* منطقة الاسم والتحميل */}
                    <div className="flex flex-col md:flex-row gap-4 items-center w-full px-2 lg:px-20">
                        <div className="relative flex-1 w-full">
                            <input 
                                type="text" placeholder={isAr ? "اكتب اسمك يا مبدع لحفظ اللوحة..." : "Your name to save..."}
                                value={studentName} onChange={(e) => setStudentName(e.target.value)}
                                className="w-full p-6 md:p-10 rounded-[2.5rem] md:rounded-[5rem] bg-white/90 dark:bg-white/5 border-4 border-slate-200 dark:border-white/10 text-slate-950 dark:text-white outline-none focus:border-red-600 transition-all font-black text-center text-xl md:text-5xl shadow-2xl placeholder:opacity-30"
                            />
                        </div>
                        <button 
                            onClick={downloadPNG} 
                            disabled={!studentName.trim()}
                            className="group relative overflow-hidden py-6 md:py-10 px-12 md:px-32 rounded-[2.5rem] md:rounded-[5rem] bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-black text-2xl md:text-6xl shadow-3xl hover:scale-[1.05] active:scale-95 transition-all disabled:opacity-10 disabled:grayscale cursor-pointer"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 opacity-0 group-hover:opacity-20 transition-all duration-700"></div>
                            <span className="relative flex items-center justify-center gap-6">
                               <IconDownload /> {isAr ? 'حفظ' : 'SAVE'}
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }
                .animate-float { animation: float 6s ease-in-out infinite; }
                .glass-panel-heavy { background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(50px); border: 1px solid rgba(255, 255, 255, 0.2); }
                
                .royal-black-title {
                    color: #000;
                    background: radial-gradient(circle at var(--glow-x) var(--glow-y), #fff 0%, #000 30%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    transition: 0.1s ease-out;
                }
                .dark .royal-black-title {
                    background: radial-gradient(circle at var(--glow-x) var(--my), #fff 0%, #333 40%, #000 100%);
                }

                canvas { cursor: crosshair; touch-action: none; image-rendering: auto; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                * { font-style: normal !important; -webkit-font-smoothing: antialiased; }
                [dir="rtl"] h1, [dir="rtl"] p, [dir="rtl"] input { letter-spacing: 0 !important; }

                input[type="range"]::-webkit-slider-thumb {
                    -webkit-appearance: none; appearance: none; width: 30px; height: 30px;
                    background: #ef4444; border: 5px solid white; border-radius: 50%;
                    box-shadow: 0 5px 20px rgba(0,0,0,0.2);
                }
            `}</style>
        </div>
    );
};

export default CreatorsStudioPage;
