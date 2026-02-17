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
const IconMenu = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
const IconSave = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>;

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
    const [isNeonMode, setIsNeonMode] = useState(false);
    const [isReplaying, setIsReplaying] = useState(false);
    
    // للتحكم في ظهور الشرائط الجانبية في الموبايل
    const [isToolsOpen, setIsToolsOpen] = useState(false);
    const [isSaveOpen, setIsSaveOpen] = useState(false);

    // تخزين المسارات
    const [drawingHistory, setDrawingHistory] = useState<DrawPath[][]>([]);
    const [currentPath, setCurrentPath] = useState<DrawPath[]>([]);

    // ضبط الكانفاس ليملأ الشاشة
    useEffect(() => {
        const resize = () => {
            const canvas = canvasRef.current;
            const container = containerRef.current;
            if (!canvas || !container) return;
            
            const tempImage = canvas.toDataURL();
            const img = new Image();
            img.src = tempImage;
            
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            
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
        const cx = e.touches ? e.touches[0].clientX : e.clientX;
        const cy = e.touches ? e.touches[0].clientY : e.clientY;
        return { x: cx - rect.left, y: cy - rect.top };
    };

    const startDraw = (e: any) => {
        if ((e.button !== 0 && !e.touches) || isReplaying) return;
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        setIsDrawing(true);
        const pos = getCoord(e);
        ctx.beginPath(); ctx.moveTo(pos.x, pos.y);
        
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
        const strokeColor = tool === 'eraser' ? (document.documentElement.classList.contains('dark') ? '#020617' : '#ffffff') : color;
        
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = strokeColor;
        
        if (isNeonMode && tool !== 'eraser') {
            ctx.shadowBlur = 15; ctx.shadowColor = strokeColor;
        } else {
            ctx.shadowBlur = 0;
        }

        ctx.lineTo(pos.x, pos.y); ctx.stroke();

        const point: DrawPath = { 
            x: pos.x, y: pos.y, color: strokeColor, width: lineWidth, isNeon: isNeonMode, type: 'line' 
        };
        setCurrentPath(prev => [...prev, point]);
    };

    const stop = () => { 
        if (isDrawing) { 
            canvasRef.current?.getContext('2d')?.closePath(); 
            setIsDrawing(false);
            setDrawingHistory(prev => [...prev, currentPath]);
        } 
    };

    const replayDrawing = async () => {
        if (isReplaying || drawingHistory.length === 0) return;
        setIsReplaying(true);
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (const path of drawingHistory) {
            ctx.beginPath();
            for (let i = 0; i < path.length; i++) {
                const p = path[i];
                if (p.type === 'move') {
                    ctx.moveTo(p.x, p.y);
                } else {
                    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
                    ctx.lineWidth = p.width; ctx.strokeStyle = p.color;
                    if (p.isNeon && p.color !== '#ffffff' && p.color !== '#020617') {
                        ctx.shadowBlur = 15; ctx.shadowColor = p.color;
                    } else { ctx.shadowBlur = 0; }
                    ctx.lineTo(p.x, p.y); ctx.stroke();
                }
                if (i % 3 === 0) await new Promise(r => setTimeout(r, 2));
            }
            ctx.closePath();
        }
        setIsReplaying(false);
    };

    const clearCanvas = () => {
        canvasRef.current?.getContext('2d')?.clearRect(0,0,5000,5000);
        setDrawingHistory([]);
    };

    const downloadPNG = () => {
        if (!studentName.trim()) return;
        const link = document.createElement('a');
        link.download = `Saqr-Art-${studentName}.png`;
        link.href = canvasRef.current!.toDataURL("image/png");
        link.click();
    };

    return (
        // z-[200] عشان يغطي على الهيدر والفوتر بتوع الـ App
        <div dir={dir} className="fixed inset-0 z-[200] bg-white dark:bg-[#020617] transition-colors duration-700 font-black overflow-hidden antialiased">
            
            {/* اللوحة الخلفية (Full Screen) */}
            <div ref={containerRef} className="absolute inset-0 z-0 cursor-crosshair active:cursor-grabbing">
                <canvas 
                    ref={canvasRef}
                    onMouseDown={startDraw} onMouseMove={drawing} onMouseUp={stop} onMouseLeave={stop}
                    onTouchStart={startDraw} onTouchMove={drawing} onTouchEnd={stop}
                    className={`touch-none w-full h-full ${isReplaying ? 'pointer-events-none' : ''}`}
                />
                {/* الووتر مارك */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] dark:opacity-[0.05]">
                    <img src="/school-logo.png" alt="Watermark" className="w-[30%] object-contain dark:brightness-0 dark:invert" />
                </div>
            </div>

            {/* الهيدر العائم (بسيط وفي الوسط) */}
            <header className="absolute top-6 left-0 right-0 z-40 pointer-events-none flex justify-center items-center px-4">
                <div className="glass-panel px-8 py-3 rounded-full flex items-center gap-6 pointer-events-auto shadow-sm bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/50 dark:border-white/10">
                    <Link to="/creators" className="text-xs text-slate-500 hover:text-red-600 transition-colors uppercase font-bold flex items-center gap-1">
                        {isAr ? 'خروج' : 'Exit'}
                    </Link>
                    
                    <div className="h-5 w-px bg-slate-300 dark:bg-white/20"></div>
                    
                    <h1 className="text-lg text-slate-900 dark:text-white font-bold flex items-center gap-3 select-none">
                        {isAr ? 'ارسم ابداعك' : 'Draw Magic'}
                        <img src="/unnamed.png" alt="Saqr" className="h-6 w-6 object-contain" />
                    </h1>
                </div>
            </header>

            {/* 1. الشريط الجانبي للأدوات (يمين أو شمال حسب اللغة) */}
            <div 
                className={`fixed top-1/2 -translate-y-1/2 z-50 transition-all duration-300 ease-out group
                    ${dir === 'rtl' ? 'right-0 translate-x-[85%] hover:translate-x-0' : 'left-0 -translate-x-[85%] hover:translate-x-0'}
                    ${isToolsOpen ? '!translate-x-0' : ''}
                `}
                onClick={() => setIsToolsOpen(!isToolsOpen)}
            >
                {/* مقبض الأدوات */}
                <div className={`absolute top-1/2 -translate-y-1/2 w-8 h-16 bg-slate-200/80 dark:bg-white/10 backdrop-blur-md flex items-center justify-center cursor-pointer shadow-md
                    ${dir === 'rtl' ? '-left-8 rounded-l-full' : '-right-8 rounded-r-full'}
                `}>
                    <IconMenu />
                </div>

                <div className="glass-panel-heavy p-3 rounded-[2rem] border border-white/20 flex flex-col gap-4 shadow-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl m-4"
                     onMouseDown={(e) => e.stopPropagation()} 
                     onTouchStart={(e) => e.stopPropagation()}
                >
                    <button onClick={() => setTool('pen')} className={`p-3 rounded-xl transition-all ${tool === 'pen' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}><IconPen /></button>
                    <button onClick={() => setTool('eraser')} className={`p-3 rounded-xl transition-all ${tool === 'eraser' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}><IconEraser /></button>
                    <button onClick={() => setIsNeonMode(!isNeonMode)} className={`p-3 rounded-xl transition-all ${isNeonMode ? 'text-green-400 bg-green-900/30 shadow-[0_0_10px_#4ade80]' : 'text-slate-400 hover:text-green-400'}`}><IconNeon /></button>
                    <button onClick={() => replayDrawing()} disabled={isReplaying} className={`p-3 rounded-xl transition-all ${isReplaying ? 'text-yellow-400 animate-pulse' : 'text-slate-400 hover:text-yellow-400'}`}><IconReplay /></button>
                    <button onClick={() => clearCanvas()} className="p-3 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"><IconTrash /></button>
                    <div className="w-full h-px bg-slate-300 dark:bg-white/20"></div>
                    <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-10 h-10 rounded-full cursor-pointer bg-transparent border-none p-0 shadow-lg hover:scale-110 transition-transform" />
                </div>
            </div>

            {/* 2. الشريط الجانبي للحفظ والاسم (الجهة العكسية) */}
            <div 
                className={`fixed top-1/2 -translate-y-1/2 z-50 transition-all duration-300 ease-out group
                    ${dir === 'rtl' ? 'left-0 -translate-x-[85%] hover:translate-x-0' : 'right-0 translate-x-[85%] hover:translate-x-0'}
                    ${isSaveOpen ? '!translate-x-0' : ''}
                `}
                onClick={() => setIsSaveOpen(!isSaveOpen)}
            >
                {/* مقبض الحفظ */}
                <div className={`absolute top-1/2 -translate-y-1/2 w-8 h-16 bg-slate-900 text-white backdrop-blur-md flex items-center justify-center cursor-pointer shadow-md
                    ${dir === 'rtl' ? '-right-8 rounded-r-full' : '-left-8 rounded-l-full'}
                `}>
                    <IconDownload />
                </div>

                <div className="glass-panel-heavy p-5 rounded-[2rem] border border-white/20 flex flex-col gap-4 shadow-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl m-4 w-64"
                     onMouseDown={(e) => e.stopPropagation()} 
                     onTouchStart={(e) => e.stopPropagation()}
                >
                    <h3 className="text-center font-bold text-slate-900 dark:text-white text-lg">{isAr ? 'حفظ اللوحة' : 'Save Art'}</h3>
                    
                    <input 
                        type="text" 
                        placeholder={isAr ? "اسم الفنان..." : "Artist Name..."}
                        value={studentName} 
                        onChange={(e) => setStudentName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-white/10 border-2 border-transparent focus:border-red-600 text-slate-900 dark:text-white outline-none font-bold text-center transition-all"
                    />
                    
                    <button 
                        onClick={downloadPNG} 
                        disabled={!studentName.trim() || isReplaying}
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white font-black shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-2"
                    >
                        <IconSave /> {isAr ? 'تحميل PNG' : 'Download'}
                    </button>
                </div>
            </div>

            {/* مؤشرات الحالة */}
            {isReplaying && (
                <div className="fixed top-24 right-1/2 translate-x-1/2 px-6 py-2 glass-panel bg-yellow-500/20 border-yellow-500 text-yellow-500 rounded-full text-xs font-bold animate-pulse z-30 pointer-events-none">
                    {isAr ? '🎥 جاري إعادة العرض...' : '🎥 Replaying...'}
                </div>
            )}

            <style>{`
                .glass-panel { backdrop-filter: blur(12px); }
                .glass-panel-heavy { backdrop-filter: blur(25px); }
                canvas { touch-action: none; }
                body { overflow: hidden; user-select: none; }
                input { user-select: text; }
                * { font-style: normal !important; -webkit-font-smoothing: antialiased; }
            `}</style>
        </div>
    );
};

export default CreatorsStudioPage;
