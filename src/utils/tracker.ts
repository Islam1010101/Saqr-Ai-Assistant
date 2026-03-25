import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase'; // السطر ده صح طالما الملفين مع بعض في نفس الفولدر

// التراكر العام المربوط بالسحابة لتسجيل تفاعلات الطلاب
export const trackActivity = async (type: 'searched' | 'digital' | 'ai', label: string) => {
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
