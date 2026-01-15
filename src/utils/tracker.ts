export const trackActivity = (type: 'searched' | 'digital' | 'ai', label: string) => {
    const logs = JSON.parse(localStorage.getItem('efips_activity_logs') || '[]');
    // تسجيل آخر 1000 عملية فقط للحفاظ على سرعة المتصفح
    if (logs.length > 1000) logs.shift(); 
    logs.push({ type, label, date: new Date().toISOString() });
    localStorage.setItem('efips_activity_logs', JSON.stringify(logs));
};
