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
    const [lineWidth] = useState(8);
    const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
    const [studentName, setStudentName] = useState("");
    const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

    // توجيه التوهج في العنوان
    const handleTitleHover = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setMousePos({ x, y });
    };

    // إعداد الكانفاس وربطه بحجم الشاشة
    useEffect(() => {
        const resize = () => {
            const canvas = canvasRef.current;
            const container = containerRef.current;
            if (!canvas || !container) return;

            // حفظ الرسم الحالي قبل تغيير الحجم
            const tempImage = canvas.toDataURL();
            const img = new Image();
            img.src = tempImage;

            canvas.width = container.offsetWidth;
            canvas.height = container.offsetHeight;

            img.onload = () => {
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.lineCap = 'round';
                    ctx.lineJoin = 'round';
                    ctx.drawImage(img, 0, 0);
                }
            };
        };

        resize();
        window.addEventListener('resize', resize);
        return () => window.removeEventListener('resize', resize);
    }, []);

    // حساب الإحداثيات بدقة متناهية
    const getCoord = (e: any) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const cx = e.touches ? e.touches[0].clientX : e.clientX;
        const cy = e.touches ? e.touches[0].clientY : e.clientY;

        return {
            x: (cx - rect.left) * scaleX,
            y: (cy - rect.top) * scaleY
        };
    };

    const startDraw = (e: any) => {
        if (e.button !== 0 && !e.touches) return; // يرسم فقط بالضغط الأساسي
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;

        setIsDrawing(true);
        const pos = getCoord(e);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    };

    const drawing = (e: any) => {
        if (!isDrawing) return;
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;

        const pos = getCoord(e);
        ctx.lineWidth = lineWidth;
        
        // ظبط اللون بناءً على الأداة والوضع (ليلي/نهاري)
        if (tool === 'eraser') {
            ctx.strokeStyle = document.documentElement.classList.contains('dark') ? '#020617' : '#ffffff';
        } else {
            ctx.strokeStyle = color;
        }

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
        <div dir={dir} className="min-h-[100dvh] bg-slate-50 dark:bg-[#01040a] transition-colors duration-700 font-black relative overflow-hidden flex flex-col pt-4 antialiased">
            
            {/* الهيدر الملكي */}
            <header className="relative z-30 px-4 md:px-10 w-full flex flex-col items-center gap-2 mb-6">
                <div className="flex w-full justify-between items-center max-w-[1800px] mb-2">
                    <Link to="/creators" className="glass-panel border border-white/40 px-6 py-2 md:px-10 md:py-4 bg-white/20 dark:bg-white/5 rounded-2xl text-xs md:text-lg text-slate-900 dark:text-white hover:bg-red-600 transition-all shadow-xl font-black uppercase">
                        {isAr ? '⬅ بوابة المبدعين' : '⬅ Portal'}
                    </Link>
                    <img src="/unnamed.png" alt="Saqr" className="h-12 md:h-28 object-contain animate-float drop-shadow-2xl" />
                </div>
                
                <div className="relative group overflow-visible" onMouseMove={handleTitleHover}>
                    <h1 className="text-6xl md:text-[10rem] tracking-tighter uppercase leading-none cursor-default select-none royal-black-title"
                        style={{ '--glow-x': `${mousePos.x}%`, '--glow-y': `${mousePos.y}%` } as any}>
                        {isAr ? 'ارسم ابداعك' : 'DRAW MAGIC'}
                    </h1>
                </div>
                <div className="h-1.5 w-40 md:w-[60rem] bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 rounded-full opacity-40 shadow-lg"></div>
            </header>

            {/* الحاوية الرئيسية - محسنة للكمبيوتر */}
            <div className="flex-1 max-w-[1900px] mx-auto px-4 md:px-10 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 items-stretch mb-8 w-full h-full">
                
                {/* 1. صندوق الأدوات (Sidebar) */}
                <div className="lg:col-span-1 order-2 lg:order-1 flex lg:flex-col gap-4">
                    <div className="glass-panel-heavy p-4 md:p-8 rounded-[3rem] border border-white/20 shadow-2xl bg-white/70 dark:bg-slate-900/40 backdrop-blur-3xl flex lg:flex-col gap-6 w-full h-fit lg:h-full justify-center items-center">
                        <button onClick={() => setTool('pen')} className={`p-5 md:p-10 rounded-3xl border-4 transition-all ${tool === 'pen' ? 'border-red-600 bg-red-600/10 text-red-600 scale-110 shadow-2xl' : 'border-transparent bg-black/5 dark:bg-white/10 dark:text-white'}`}><IconPen /></button>
                        <button onClick={() => setTool('eraser')} className={`p-5 md:p-10 rounded-3xl border-4 transition-all ${tool === 'eraser' ? 'border-red-600 bg-red-600/10 text-red-600 scale-110 shadow-2xl' : 'border-transparent bg-black/5 dark:bg-white/10 dark:text-white'}`}><IconEraser /></button>
                        <button onClick={() => canvasRef.current?.getContext('2d')?.clearRect(0,0,5000,5000)} className="p-5 md:p-10 rounded-3xl bg-red-500/10 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-lg"><IconTrash /></button>
                        <div className="w-px h-12 lg:w-full lg:h-px bg-slate-300 dark:bg-white/10 my-4"></div>
                        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-12 h-12 md:w-20 md:h-20 rounded-full cursor-pointer bg-transparent border-none p-0 shadow-2xl hover:scale-125 transition-transform" />
                    </div>
                </div>

                {/* 2. اللوحة المركزية */}
                <div className="lg:col-span-11 order-1 lg:order-2 flex flex-col gap-6 h-[50vh] lg:h-full">
                    <div ref={containerRef} className="flex-1 bg-white dark:bg-[#020617] border-[10px] border-white dark:border-white/5 rounded-[4rem] lg:rounded-[7rem] shadow-[0_60px_150px_rgba(0,0,0,0.5)] overflow-hidden relative cursor-crosshair group/canvas border-glass-shine">
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
                        {/* الووتر مارك الملكية */}
                        <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none opacity-[0.06] dark:opacity-[0.15] transition-all duration-1000 group-hover/canvas:opacity-[0.2]">
                            <img src="/school-logo.png" alt="EFIPS" className="w-[80%] md:w-[45%] object-contain rotate-[-10deg] select-none dark:brightness-0 dark:invert" />
                        </div>
                    </div>
                    
                    {/* منطقة الاسم والتحميل */}
                    <div className="flex flex-col md:flex-row gap-6 items-center w-full lg:px-10">
                        <input 
                            type="text" placeholder={isAr ? "اكتب اسمك يا مبدع..." : "Name your masterpiece..."}
                            value={studentName} onChange={(e) => setStudentName(e.target.value)}
                            className="flex-1 w-full p-8 md:p-12 rounded-[3rem] md:rounded-[6rem] bg-white/80 dark:bg-white/5 border-4 border-slate-200 dark:border-white/10 text-slate-950 dark:text-white outline-none focus:border-red-600 transition-all font-black text-center text-2xl md:text-6xl shadow-2xl placeholder:opacity-20"
                        />
                        <button 
                            onClick={downloadPNG} 
                            disabled={!studentName.trim()}
                            className="group relative overflow-hidden py-8 md:py-12 px-16 md:px-40 rounded-[3rem] md:rounded-[6rem] bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-black text-3xl md:text-7xl shadow-[0_30px_60px_rgba(0,0,0,0.3)] hover:scale-[1.03] active:scale-95 transition-all disabled:opacity-20 cursor-pointer"
                        >
                            <span className="relative flex items-center justify-center gap-8">
                               <IconDownload /> {isAr ? 'حفظ' : 'SAVE'}
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-15px); } }
                .animate-float { animation: float 5s ease-in-out infinite; }
                .glass-panel-heavy { backdrop-filter: blur(80px); }
                
                .royal-black-title {
                    color: #000;
                    background: radial-gradient(circle at var(--glow-x) var(--glow-y), #fff 0%, #000 35%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    transition: background 0.15s ease-out;
                }
                .dark .royal-black-title {
                    background: radial-gradient(circle at var(--glow-x) var(--glow-y), #fff 0%, #444 40%, #111 100%);
                }

                canvas { cursor: crosshair; touch-action: none; image-rendering: -webkit-optimize-contrast; }
                * { font-style: normal !important; }
            `}</style>
        </div>
    );
};

export default CreatorsStudioPage;
