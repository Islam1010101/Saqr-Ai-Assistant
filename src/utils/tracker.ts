// 1. التراكر العام (تم إضافة ramadan للأنواع)
export const trackActivity = (type: 'searched' | 'digital' | 'ai' | 'ramadan', label: string) => {
    const logs = JSON.parse(localStorage.getItem('efips_activity_logs') || '[]');
    // تسجيل آخر 1000 عملية فقط للحفاظ على سرعة المتصفح
    if (logs.length > 1000) logs.shift(); 
    logs.push({ type, label, date: new Date().toISOString() });
    localStorage.setItem('efips_activity_logs', JSON.stringify(logs));
};

// 2. دالة جديدة مخصوصة لتسجيل بطل كنوز رمضان وتخزين بياناته للتقارير
export const trackRamadanWinner = (studentName: string, studentGrade: string, studentEmail: string, answer: string, code: string) => {
    // أ. تسجيل الفائز في تقارير صقر
    const reportData = {
        event: "RamadanQuestWinner",
        timestamp: new Date().toISOString(),
        studentName,
        studentEmail,
        studentGrade,
        enteredAnswer: answer,
        enteredCode: code
    };
    
    const existingReports = JSON.parse(localStorage.getItem("saqrReports") || "[]");
    localStorage.setItem("saqrReports", JSON.stringify([...existingReports, reportData]));

    // ب. قفل السؤال على باقي الطلاب (تخزين الفائز العام)
    const theWinner = { name: studentName, grade: studentGrade };
    localStorage.setItem("ramadanQuestWinner", JSON.stringify(theWinner));
};
