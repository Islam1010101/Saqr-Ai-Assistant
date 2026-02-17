import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../App';

// --- الأيقونات ---
const IconPen = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/></svg>;
const IconEraser = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 20H7L3 16C2.5 15.5 2.5 14.5 3 14L13 4L20 11L11 20"/></svg>;
const IconTrash = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/></svg>;
const IconDownload = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
const IconReplay = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3" /></svg>;
const IconNeon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>;

// تخزين مسارات الرسم لإعادة العرض
interface DrawPath {
    x: number;
    y: number;
    color: string;
    width: number;
    isNeon: boolean;
    type: 'move' | 'line';
}

const CreatorsStudioPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const isAr = locale === 'ar';
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    
    // State
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#ef4444');
    const [lineWidth, setLineWidth] = useState(8);
    const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
    const [studentName, setStudentName] = useState("");
    const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
    const [isNeonMode, setIsNeonMode] = useState(false);
    const [isReplaying, setIsReplaying] = useState(false);

    // تخزين كل حركة (The Magic History)
    const [drawingHistory, setDrawingHistory] = useState<DrawPath[][]>([]);
    const [currentPath, setCurrentPath] = useState<DrawPath[]>([]);

    const handleTitleHover = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePos({ 
            x: ((e.clientX - rect.left) / rect.width) * 100, 
            y: ((e.clientY - rect.top) / rect.height) * 100 
        });
    };

    // ضبط الكانفاس
    useEffect(() => {
        const resize = () => {
            const canvas = canvasRef.current;
            const container = containerRef.current;
            if (!canvas || !container) return;
            // نحفظ الصورة الحالية قبل التغيير
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
        if ((e.button !== 0 && !e.touches) || isReplaying) return;
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        
        setIsDrawing(true);
        const pos = getCoord(e);
        
        // إعدادات القلم
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        
        // حفظ بداية المسار
        const point: DrawPath = { 
            x: pos.x, y: pos.y, 
            color: tool === 'eraser' ? '#ffffff' : color, 
            width: lineWidth, 
            isNeon: isNeonMode,
            type: 'move' 
        };
        setCurrentPath([point]);
    };

    const drawing = (e: any) => {
        if (!isDrawing || isReplaying) return;
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        
        const pos = getCoord(e);
        
        // إعدادات النيون واللون
        const strokeColor = tool === 'eraser' ? (document.documentElement.classList.contains('dark') ? '#020617' : '#ffffff') : color;
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = strokeColor;
        
        if (isNeonMode && tool !== 'eraser') {
            ctx.shadowBlur = 15;
            ctx.shadowColor = strokeColor;
        } else {
            ctx.shadowBlur = 0;
        }

        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();

        // حفظ النقطة
        const point: DrawPath = { 
            x: pos.x, y: pos.y, 
            color: strokeColor, 
            width: lineWidth, 
            isNeon: isNeonMode,
            type: 'line' 
        };
        setCurrentPath(prev => [...prev, point]);
    };

    const stop = () => { 
        if (isDrawing) { 
            canvasRef.current?.getContext('2d')?.closePath(); 
            setIsDrawing(false);
            // حفظ المسار الكامل في التاريخ
            setDrawingHistory(prev => [...prev, currentPath]);
        } 
    };

    // --- 🔮 دالة سحر الزمن (Replay) ---
    const replayDrawing = async () => {
        if (isReplaying || drawingHistory.length === 0) return;
        setIsReplaying(true);
        
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        // مسح الكانفاس
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // إعادة الرسم خطوة بخطوة
        for (const path of drawingHistory) {
            ctx.beginPath();
            for (let i = 0; i < path.length; i++) {
                const p = path[i];
                if (p.type === 'move') {
                    ctx.moveTo(p.x, p.y);
                } else {
                    ctx.lineCap = 'round';
                    ctx.lineJoin = 'round';
                    ctx.lineWidth = p.width;
                    ctx.strokeStyle = p.color;
                    
                    if (p.isNeon && p.color !== '#ffffff' && p.color !== '#020617') {
                        ctx.shadowBlur = 15;
                        ctx.shadowColor = p.color;
                    } else {
                        ctx.shadowBlur = 0;
                    }
                    
                    ctx.lineTo(p.x, p.y);
                    ctx.stroke();
                }
                // سرعة الإعادة (كل ما الرقم قل كل ما كان أسرع)
                if (i % 2 === 0) await new Promise(r => setTimeout(r, 5));
            }
            ctx.closePath();
        }
        setIsReplaying(false);
    };

    const clearCanvas = () => {
        canvasRef.current?.getContext('2d')?.clearRect(0,0,5000,5000);
        setDrawingHistory([]); // مسح التاريخ كمان
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
        <div dir={dir} className="min-h-[100dvh] bg-slate-50 dark:bg-[#01040a] transition-colors duration-700 font-black relative overflow-hidden flex flex-col antialiased">
            
            {/* الهيدر */}
            <header className="relative z-30 px-4 md:px-10 w-full flex flex-col items-center pt-2 md:pt-4 mb-2 md:mb-6">
                <div className="flex w-full justify-between items-center max-w-[1800px]">
                    <Link to="/creators" className="glass-panel border border-white/40 px-3 py-2 md:px-10 md:py-4 bg-white/20 dark:bg-white/5 rounded-xl md:rounded-2xl text-[10px] md:text-lg text-slate-900 dark:text-white hover:bg-red-600 transition-all font-black">
                        {isAr ? '⬅ عودة' : '⬅ BACK'}
                    </Link>
                    <img src="/unnamed.png" alt="Saqr" className="h-8 md:h-24 object-contain animate-float" />
                </div>
                
                <div className="relative group mt-1" onMouseMove={handleTitleHover}>
                    <h1 className="text-3xl md:text-[8rem] lg:text-[10rem] tracking-tighter uppercase leading-none cursor-default select-none royal-title-dynamic"
                        style={{ '--glow-x': `${mousePos.x}%`, '--glow-y': `${mousePos.y}%` } as any}>
                        {isAr ? 'ارسم ابداعك' : 'DRAW MAGIC'}
                    </h1>
                </div>
            </header>

            {/* الحاوية الرئيسية */}
            <main className="flex-1 flex flex-col lg:flex-row gap-2 md:gap-8 px-2 md:px-10 mb-4 max-w-[1900px] mx-auto w-full overflow-hidden">
                
                {/* صندوق الأدوات */}
                <div className="flex lg:flex-col gap-2 md:gap-6 justify-center items-center lg:w-24 order-2 lg:order-1 px-2">
                    <div className="glass-panel-heavy p-2 md:p-6 rounded-2xl md:rounded-[3rem] border border-white/20 flex lg:flex-col gap-3 md:gap-6 w-full lg:h-full justify-around items-center bg-white/50 dark:bg-slate-900/40">
                        {/* أدوات الرسم */}
                        <button onClick={() => setTool('pen')} className={`p-3 md:p-6 rounded-xl md:rounded-3xl border-2 md:border-4 transition-all ${tool === 'pen' ? 'border-red-600 bg-red-600/20 text-red-600 scale-110' : 'border-transparent dark:text-white'}`}><IconPen /></button>
                        <button onClick={() => setTool('eraser')} className={`p-3 md:p-6 rounded-xl md:rounded-3xl border-2 md:border-4 transition-all ${tool === 'eraser' ? 'border-red-600 bg-red-600/20 text-red-600 scale-110' : 'border-transparent dark:text-white'}`}><IconEraser /></button>
                        
                        {/* زرار النيون الجديد */}
                        <button onClick={() => setIsNeonMode(!isNeonMode)} className={`p-3 md:p-6 rounded-xl md:rounded-3xl border-2 md:border-4 transition-all ${isNeonMode ? 'border-green-400 bg-green-400/20 text-green-400 shadow-[0_0_15px_#4ade80] scale-110' : 'border-transparent dark:text-white hover:text-green-400'}`}>
                            <IconNeon />
                        </button>

                        {/* زرار إعادة العرض (Replay) */}
                        <button onClick={replayDrawing} disabled={isReplaying || drawingHistory.length === 0} className={`p-3 md:p-6 rounded-xl md:rounded-3xl border-2 md:border-4 transition-all ${isReplaying ? 'border-yellow-400 text-yellow-400 animate-pulse' : 'border-transparent dark:text-white hover:text-yellow-400 disabled:opacity-30'}`}>
                            <IconReplay />
                        </button>

                        <button onClick={clearCanvas} className="p-3 md:p-6 rounded-xl md:rounded-3xl bg-red-500/10 text-red-600 hover:bg-red-600 transition-all"><IconTrash /></button>
                        
                        <div className="hidden lg:block w-full h-px bg-white/10 my-2"></div>
                        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-8 h-8 md:w-16 md:h-16 rounded-full cursor-pointer bg-transparent border-none p-0 shadow-xl" />
                    </div>
                </div>

                {/* لوحة الرسم */}
                <div className="flex-1 flex flex-col gap-3 order-1 lg:order-2 h-[65vh] md:h-full min-h-[350px]">
                    <div ref={containerRef} className="flex-1 bg-white dark:bg-[#020617] border-4 md:border-[10px] border-white dark:border-white/5 rounded-[2rem] md:rounded-[6rem] shadow-2xl overflow-hidden relative border-glass-shine group/canvas">
                        <canvas 
                            ref={canvasRef}
                            onMouseDown={startDraw} onMouseMove={drawing} onMouseUp={stop} onMouseLeave={stop}
                            onTouchStart={startDraw} onTouchMove={drawing} onTouchEnd={stop}
                            className={`touch-none w-full h-full relative z-10 ${isReplaying ? 'pointer-events-none' : 'cursor-crosshair'}`}
                        />
                        <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none opacity-[0.04] dark:opacity-[0.1]">
                            <img src="/school-logo.png" alt="EFIPS" className="w-[80%] md:w-[40%] object-contain dark:brightness-0 dark:invert" />
                        </div>
                        
                        {/* مؤشر التسجيل */}
                        {!isReplaying && drawingHistory.length > 0 && (
                            <div className="absolute top-6 left-6 w-3 h-3 bg-red-600 rounded-full animate-pulse shadow-[0_0_10px_red]"></div>
                        )}
                        {/* مؤشر إعادة العرض */}
                        {isReplaying && (
                            <div className="absolute top-6 right-6 px-4 py-1 bg-yellow-500 text-black text-xs font-black rounded-full animate-bounce">
                                {isAr ? 'جاري إعادة الرسم...' : 'Replaying Art...'}
                            </div>
                        )}
                    </div>
                    
                    {/* الاسم والحفظ */}
                    <div className="flex flex-col md:flex-row gap-2 md:gap-6 items-stretch w-full">
                        <input 
                            type="text" placeholder={isAr ? "اسمك هنا..." : "Name..."}
                            value={studentName} onChange={(e) => setStudentName(e.target.value)}
                            className="flex-1 p-4 md:p-10 rounded-2xl md:rounded-[5rem] bg-white/80 dark:bg-white/5 border-2 md:border-4 border-slate-200 dark:border-white/10 text-slate-950 dark:text-white outline-none focus:border-red-600 font-black text-center text-lg md:text-5xl shadow-xl"
                        />
                        <button 
                            onClick={downloadPNG} disabled={!studentName.trim() || isReplaying}
                            className="flex items-center justify-center gap-2 md:gap-4 py-4 md:py-10 px-8 md:px-20 rounded-2xl md:rounded-[5rem] bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-black text-lg md:text-6xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-20"
                        >
                            <IconDownload /> {isAr ? 'حفظ' : 'SAVE'}
                        </button>
                    </div>
                </div>
            </main>

            <style>{`
                .royal-title-dynamic {
                    color: #000;
                    background: radial-gradient(circle at var(--glow-x) var(--glow-y), #fff 0%, #000 40%);
                    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
                    transition: all 0.1s ease;
                }
                .dark .royal-title-dynamic {
                    color: #fff;
                    background: radial-gradient(circle at var(--glow-x) var(--glow-y), #fff 0%, #334155 40%, #fff 100%);
                    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
                }
                .glass-panel-heavy { backdrop-filter: blur(20px); }
                canvas { touch-action: none; image-rendering: pixelated; }
                * { font-style: normal !important; -webkit-font-smoothing: antialiased; }
            `}</style>
        </div>
    );
};

export default CreatorsStudioPage;
