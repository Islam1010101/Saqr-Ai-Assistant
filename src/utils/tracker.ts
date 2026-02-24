import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase'; // السطر ده صح طالما الملفين مع بعض في نفس الفولدر

// 1. التراكر العام المربوط بالسحابة
export const trackActivity = async (type: 'searched' | 'digital' | 'ai' | 'ramadan', label: string) => {
    try {
        await addDoc(collection(db, 'activity_logs'), {
            type,
            label,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("Error saving activity to cloud:", error);
    }
};

// 2. دالة تسجيل بطل كنوز رمضان في السحابة
export const trackRamadanWinner = async (studentName: string, studentGrade: string, studentEmail: string, answer: string, code: string) => {
    try {
        await addDoc(collection(db, 'saqrReports'), {
            event: "RamadanQuestWinner",
            timestamp: new Date().toISOString(),
            studentName,
            studentEmail,
            studentGrade,
            enteredAnswer: answer,
            enteredCode: code
        });

        // ب. قفل السؤال محلياً
        const theWinner = { name: studentName, grade: studentGrade };
        localStorage.setItem("ramadanQuestWinner", JSON.stringify(theWinner));
        
    } catch (error) {
        console.error("Error saving Ramadan winner to cloud:", error);
    }
};
