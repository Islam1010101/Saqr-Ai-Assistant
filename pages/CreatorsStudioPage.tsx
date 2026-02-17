import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../App';

// --- الأيقونات الملكية ---
const IconPen = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/></svg>;
const IconEraser = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 20H7L3 16C2.5 15.5 2.5 14.5 3 14L13 4L20 11L11 20"/></svg>;
const IconTrash = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/></svg>;
const IconDownload = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;

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

    const handleTitleHover = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePos({ 
            x: ((e.clientX - rect.left) / rect.width) * 100, 
            y: ((e.clientY - rect.top) / rect.height) * 100 
        });
    };

    useEffect(() => {
        const resize = () => {
            const canvas = canvasRef.current;
            const container = containerRef.current;
            if (!canvas || !container) return;
            const tempImage = canvas.toDataURL();
            const img = new Image();
            img.src = tempImage;
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
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const cx = e.touches ? e.touches[0].clientX : e.clientX;
        const cy = e.touches ? e.touches[0].clientY : e.clientY;
        return { x: (cx - rect.left) * scaleX, y: (cy - rect.top) * scaleY };
    };

    const startDraw = (e: any) => {
        if (e.button !== 0 && !e.touches) return;
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        setIsDrawing(true);
        const pos = getCoord(e);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
    };

    const drawing = (e: any) => {
        if (!isDrawing) return;
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        const pos = getCoord(e);
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = tool === 'eraser' ? (document.documentElement.classList.contains('dark') ? '#020617' : '#ffffff') : color;
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
    };

    const stop = () => { if (isDrawing) { canvasRef.current?.getContext('2d')?.closePath(); setIsDrawing(false); } };

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
        <div dir={dir} className="min-h-[100dvh] bg-slate-50 dark:bg-[#01040a] transition-colors duration-700 font-black relative overflow-hidden flex flex-col antialiased">
            
            {/* الهيدر المضغوط (Minimal Header) */}
            <header className="relative z-30 px-4 md:px-8 w-full flex items-center justify-between py-2 md:py-3 shadow-sm bg-white/50 dark:bg-black/20 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <Link to="/creators" className="glass-panel border border-white/40 px-4 py-2 rounded-xl text-xs md:text-sm text-slate-900 dark:text-white hover:bg-red-600 hover:text-white transition-all font-black uppercase">
                        {isAr ? '⬅ خروج' : '⬅ EXIT'}
                    </Link>
                    <img src="/unnamed.png" alt="Saqr" className="h-8 md:h-12 object-contain" />
                </div>
                
                <div className="relative group mx-auto absolute left-1/2 -translate-x-1/2" onMouseMove={handleTitleHover}>
                    <h1 className="text-2xl md:text-5xl tracking-tighter uppercase leading-none cursor-default select-none royal-title-dynamic"
                        style={{ '--glow-x': `${mousePos.x}%`, '--glow-y': `${mousePos.y}%` } as any}>
                        {isAr ? 'ارسم ابداعك' : 'DRAW MAGIC'}
                    </h1>
                </div>
                <div className="w-16"></div> {/* Spacer for alignment */}
            </header>

            {/* الحاوية الرئيسية - Full Screen Canvas */}
            <main className="flex-1 flex flex-col lg:flex-row gap-0 overflow-hidden relative">
                
                {/* 1. شريط الأدوات الجانبي (Sidebar) */}
                <div className="flex lg:flex-col justify-center items-center bg-white/80 dark:bg-slate-900/80 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-white/10 z-20 shadow-xl lg:w-20 py-2 lg:py-0 px-4 lg:px-0 gap-4 lg:gap-8">
                    <button onClick={() => setTool('pen')} className={`p-2 md:p-3 rounded-xl transition-all ${tool === 'pen' ? 'text-red-600 bg-red-100 dark:bg-red-900/30 scale-110' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}><IconPen /></button>
                    <button onClick={() => setTool('eraser')} className={`p-2 md:p-3 rounded-xl transition-all ${tool === 'eraser' ? 'text-red-600 bg-red-100 dark:bg-red-900/30 scale-110' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}><IconEraser /></button>
                    <button onClick={() => canvasRef.current?.getContext('2d')?.clearRect(0,0,5000,5000)} className="p-2 md:p-3 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"><IconTrash /></button>
                    <div className="w-px h-8 lg:w-8 lg:h-px bg-slate-300 dark:bg-white/20"></div>
                    <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-8 h-8 rounded-full cursor-pointer bg-transparent border-none p-0 shadow-lg hover:scale-110 transition-transform" />
                    <div className="hidden lg:block lg:flex-1"></div>
                </div>

                {/* 2. منطقة الرسم والتحكم (Canvas & Controls) */}
                <div className="flex-1 flex flex-col relative bg-slate-100 dark:bg-black p-2 md:p-4 gap-2 md:gap-4">
                    
                    {/* اللوحة */}
                    <div ref={containerRef} className="flex-1 bg-white dark:bg-[#020617] rounded-2xl md:rounded-3xl shadow-inner overflow-hidden relative cursor-crosshair border border-slate-200 dark:border-white/10">
                        <canvas 
                            ref={canvasRef}
                            onMouseDown={startDraw} onMouseMove={drawing} onMouseUp={stop} onMouseLeave={stop}
                            onTouchStart={startDraw} onTouchMove={drawing} onTouchEnd={stop}
                            className="touch-none w-full h-full relative z-10"
                        />
                        {/* ووتر مارك في المنتصف */}
                        <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.08]">
                            <img src="/school-logo.png" alt="Watermark" className="w-[30%] object-contain dark:brightness-0 dark:invert opacity-50" />
                        </div>
                    </div>

                    {/* شريط التحكم السفلي (الاسم والحفظ) */}
                    <div className="h-16 md:h-20 flex gap-2 md:gap-4 shrink-0">
                        <input 
                            type="text" placeholder={isAr ? "اكتب اسمك هنا..." : "Enter your name..."}
                            value={studentName} onChange={(e) => setStudentName(e.target.value)}
                            className="flex-[2] h-full px-6 rounded-2xl bg-white dark:bg-white/5 border-2 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white outline-none focus:border-red-600 font-black text-center text-lg md:text-2xl shadow-sm transition-all"
                        />
                        <button 
                            onClick={downloadPNG} disabled={!studentName.trim()}
                            className="flex-1 h-full flex items-center justify-center gap-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-lg md:text-2xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
                        >
                            <IconDownload /> {isAr ? 'حفظ اللوحة' : 'SAVE ART'}
                        </button>
                    </div>
                </div>
            </main>

            <style>{`
                .royal-title-dynamic {
                    color: #000;
                    background: radial-gradient(circle at var(--glow-x) var(--glow-y), #fff 0%, #000 40%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    transition: all 0.1s ease;
                }
                .dark .royal-title-dynamic {
                    color: #fff;
                    background: radial-gradient(circle at var(--glow-x) var(--glow-y), #fff 0%, #94a3b8 50%, #fff 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                
                .glass-panel { backdrop-filter: blur(10px); }
                canvas { touch-action: none; image-rendering: pixelated; }
                * { font-style: normal !important; -webkit-font-smoothing: antialiased; }
            `}</style>
        </div>
    );
};

export default CreatorsStudioPage;
