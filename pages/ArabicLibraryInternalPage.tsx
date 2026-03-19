import React, { useState, useMemo, useRef } from 'react';
import { useLanguage } from '../App';
import { useNavigate } from 'react-router-dom';

// --- 1. قاعدة البيانات ---
interface Book {
    id: string;
    title: string;
    author: string;
    subject: string;
    driveLink: string;
    bio: string;
    summary: string;
    publisher?: string;
    audioId?: string;
}

export const ARABIC_LIBRARY_DATABASE: Book[] = [
    { id: "AR_1", title: "مجموعة روايات أجاثا كريستي", author: "أجاثا كريستي", subject: "قصص بوليسية", publisher: "ناشرون متعددون", driveLink: "https://drive.google.com/drive/folders/1PZk0vPQrKXIgE0WmUXlEMcSzt_d94Q6u", bio: "ملكة الجريمة عالمياً، صاحبة الشخصيات الخالدة مثل هيركيول بوارو.", summary: "أضخم مجموعة لروايات التحقيق والغموض التي تتميز بحبكة عبقرية ونهايات صادمة." },
    { id: "AR_2", title: "أرض الإله", author: "أحمد مراد", subject: "أدب تاريخي", publisher: "دار الشروق", driveLink: "https://drive.google.com/file/d/1Q-dT9-g292nqv1N_PvlB2TnZMBdQGpio/view", bio: "كاتب ومصور مصري معاصر، تميز برواياته التي تمزج بين التاريخ والغموض.", summary: "رحلة تاريخية مثيرة في زمن الفراعنة تكشف أسراراً مخفية حول خروج بني إسرائيل.", audioId: "/audio/أرض الإله.mp3" },
    { id: "AR_3", title: "أرض النفاق", author: "يوسف السباعي", subject: "أدب خيالي", publisher: "مكتبة مصر", driveLink: "https://drive.google.com/file/d/14KCqI_ffiUg8if8uqs_vQ-oJIXBEsKD3/view", bio: "فارس الرومانسية المصرية، وزير ثقافة سابق، اشتهر بأسلوبه الساخر.", summary: "رواية رمزية ساخرة تنتقد الأخلاق الاجتماعية عبر فكرة بيع الأخلاق في دكاكين متخصصة.", audioId: "/audio/أرض النفاق.mp3" },
    { id: "AR_4", title: "أكواريل", author: "أحمد خالد توفيق", subject: "أدب خيالي", publisher: "دار سما للنشر والتوزيع", driveLink: "https://drive.google.com/file/d/1NLK9-pE6uoHU8po8BC8731KIZ3oc0qU5/view", bio: "عراب أدب الرعب العربي، أول كاتب عربي برع في أدب الإثارة للشباب.", summary: "مجموعة قصصية مشوقة تأخذنا إلى عوالم من الغموض الطبي والنفسي بأسلوب العراب الفريد.", audioId: "/audio/Aquarel.mp3" },
    { id: "AR_6", title: "نائب عزارئيل", author: "يوسف السباعي", subject: "أدب خيالي", publisher: "مكتبة الإسكندرية", driveLink: "https://drive.google.com/file/d/1vC4PIAZ2ekJ-uU3wCE4zV70glD8VjDT0/view", bio: "أديب مصري راحل لقب بـ فارس الرومانسية وساهم في إثراء المكتبة العربية.", summary: "رواية فانتازيا فلسفية تتخيل شخصاً يقوم بدور عزرائيل، بأسلوب ساخر وعميق.", audioId: "/audio/نائب عزرائيل.mp3" },
    { id: "AR_7", title: "المكتبة الخضراء للأطفال", author: "مؤلفين", subject: "قصص للأطفال", publisher: "دار المعارف", driveLink: "https://drive.google.com/drive/folders/1AHrYDDPkocCEAnJXAfhbnTYtfkpcuUIn?usp=sharing", bio: "نخبة من كبار كتاب أدب الطفل صاغوا حكايات تربوية عالمية بأسلوب مشوق.", summary: "أشهر سلاسل القصص للأطفال، تهدف لغرس القيم النبيلة بأسلوب حكائي ورسوم جذابة." },
    { id: "AR_8", title: "أوقات عصيبة", author: "تشارلز ديكنز", subject: "قصص عالمية", publisher: "مكتبة الأنجلو المصرية", driveLink: "https://drive.google.com/file/d/1TxWYfZmTOjvpj5mjTeKBueUDHrEIViAB/view", bio: "أعظم الروائيين الإنجليز في العصر الفيكتوري، اشتهر بدفاعه عن الطبقات الفقيرة.", summary: "رواية كلاسيكية تستعرض الصراعات الاجتماعية في إنجلترا خلال الثورة الصناعية.", audioId: "/audio/اوقات عصيبة.mp3" },
    { id: "AR_9", title: "أوليفر تويسيت", author: "تشارلز ديكنز", subject: "قصص عالمية", publisher: "دار العلم للملايين", driveLink: "https://drive.google.com/file/d/1zkFntttQq6pzErlvPCKbmW8odDORoneJ/view", bio: "روائي عبقري رسم بكلماته ملامح الحياة في لندن القديمة.", summary: "حكاية اليتيم أوليفر ورحلته للبحث عن هويته وسط عالم من الجريمة والظلم.", audioId: "/audio/أوليفر تويست.mp3" },
    { id: "AR_10", title: "الآمال الكبيرة", author: "تشارلز ديكنز", subject: "قصص عالمية", publisher: "مكتبة الأسرة 2000", driveLink: "https://drive.google.com/file/d/1aYWKfjB1fJu3CfII-yK55hM5qmt3ji5Y/view", bio: "سيد الرواية الاجتماعية الإنجليزية، يمتلك قدرة فريدة على رسم الشخصيات.", summary: "قصة الشاب بيب وطموحاته التي تتغير مع مرور الوقت في دراما إنسانية خالدة.", audioId: "/audio/الآمال العظيمة.mp3" },
    { id: "AR_11", title: "ترويض النمرة", author: "ويليام شيكسبير", subject: "قصص عالمية", publisher: "هنداوي", driveLink: "https://drive.google.com/file/d/1GjLXf2OvsdypCva9Uf34mbchFkYSjBtd/view", bio: "الشاعر والكاتب المسرحي الإنجليزي الأشهر، رائد الأدب العالمي.", summary: "كوميديا اجتماعية تتناول علاقات الزواج بأسلوب شيكسبيري ممتع ومليء بالمفارقات.", audioId: "/audio/ترويض النمرة.mp3" },
    { id: "AR_12", title: "جعجعة بدون طحن", author: "ويليام شيكسبير", subject: "مسرحيات عالمية", publisher: "دار نظير عبود", driveLink: "https://drive.google.com/file/d/1Myn0epkZJEkV2CQO_xaLpmJu6DFu0rrt/view", bio: "عبقري الكلمة الذي جسد النفس البشرية في كافة حالاتها.", summary: "مسرحية كوميدية تدور حول الحب والغيرة والمؤامرات بأسلوب ذكي وحوارات شيقة.", audioId: "/audio/جعجعة بدون طحن.mp3" },
    { id: "AR_13", title: "دايفيد كوبرفيلد", author: "تشارلز ديكنز", subject: "قصص عالمية", publisher: "مكتبة الأسرة 2000", driveLink: "https://drive.google.com/file/d/1MCmhkl0ul9zmZ7jvdaSKmG4bwLdHDRHz/view", bio: "ديكنز يروي جانباً من سيرته الذاتية المقنعة في هذه التحفة الروائية.", summary: "رحلة دايفيد من الطفولة البائسة إلى النجاح، وهي أكثر روايات ديكنز قرباً لقلبه.", audioId: "/audio/Daved.mp3" },
    { id: "AR_14", title: "دمبي وولده", author: "تشارلز ديكنز", subject: "قصص عالمية", publisher: "جداران المعرفة", driveLink: "https://drive.google.com/file/d/14ex-UE5dQDaZtdeQ9s4KUd0-YYH4_Lfh/view", bio: "كاتب برع في نقد قسوة الرأسمالية بأسلوب إنساني مؤثر.", summary: "رواية تتناول العلاقات الأسرية والغرور التجاري في العصر الفيكتوري اللندني.", audioId: "/audio/domby.mp3" },
    { id: "AR_15", title: "قصة مدينتين", author: "تشارلز ديكنز", subject: "قصص عالمية", publisher: "دار العلم للملايين", driveLink: "https://drive.google.com/file/d/1baMVDkz88y5uRMIp1Aj506WZPD5dpibU/view", bio: "ديكنز في قمته التاريخية يصور أحداث الثورة الفرنسية.", summary: "ملحمة تدور بين لندن وباريس، تجسد التضحية والحب في زمن الاضطرابات الكبرى.", audioId: "/audio/قصة مدينتين.mp3" },
    { id: "AR_16", title: "هملت : أمير دانمركة", author: "ويليام شيكسبير", subject: "مسرحيات عالمية", publisher: "دار المعارف", driveLink: "https://drive.google.com/file/d/1qWz0xEuQUqhGQtESVtVo_pmC4DLIP4L-/view", bio: "أعظم تراجيديا في تاريخ المسرح العالمي، تدرس حتى اليوم.", summary: "صراع الوجود والانتقام في عقل الأمير هملت: أكون أو لا أكون، تلك هي المسألة.", audioId: "/audio/هاملت.mp3" },
    { id: "AR_17", title: "مذكرات بيكويك", author: "تشارلز ديكنز", subject: "قصص عالمية", publisher: "هنداوي", driveLink: "https://drive.google.com/file/d/1_okaw0LTO6nSyLJrQrDHCOYCndk4wdgF/view", bio: "ديكنز الكوميدي، أول أعماله التي حققت شهرة واسعة.", summary: "مغامرات فكاهية لجمعية بيكويك وأعضائها أثناء تجولهم في أرجاء إنجلترا.", audioId: "/audio/مذكرات بيكويك.mp3" },
    { id: "AR_18", title: "سلسلة رجل المستحيل", author: "نبيل فاروق", subject: "قصص بوليسية", publisher: "المؤسسة العربية الحديثة", driveLink: "https://drive.google.com/drive/folders/1yjQ37_OKjp0N7VB6BrIVP7SNzQLAU2fS", bio: "رائد أدب الجاسوسية العربي، صنع بطلاً أسطورياً أسر عقول أجيال.", summary: "مغامرات شيقة لرجل المخابرات أدهم صبري، يواجه فيها أخطاراً تهدد الأمن القومي." },
    { id: "AR_19", title: "سلسلة ما وراء الطبيعة", author: "أحمد خالد توفيق", subject: "أدب خيالي", publisher: "المؤسسة العربية الحديثة", driveLink: "https://drive.google.com/drive/folders/1qJD1adnBDMgQFPWMSnMM3KJmbVlmBr6W", bio: "الأديب الذي جعل الشباب يقرأون، مبتكر شخصية رفعت إسماعيل.", summary: "سلسلة خوارق ورعب تروي مغامرات رفعت إسماعيل مع الأساطير والظواهر المجهولة." },
    { id: "AR_20", title: "سلسلة الشياطين ال13", author: "محمود سالم", subject: "أدب خيالي", publisher: "هنداوي", driveLink: "https://drive.google.com/drive/folders/1OoXAgtzyZ4QK0WIIJPCU5IICwlUPED0w", bio: "أشهر من كتب الألغاز والمغامرات للشباب في العالم العربي.", summary: "مغامرات ذكية لمجموعة من الفتيان العرب يحلون أصعب الجرائم والألغاز." },
    { id: "AR_21", title: "مختصر تفسير ابن كثير", author: "ابن كثير", subject: "تفسير القرآن", publisher: "دار المعرفة", driveLink: "https://drive.google.com/drive/folders/1lLmRHktJSbAJjjX0Wdh4shjHyweQy_0h", bio: "الحافظ والمؤرخ اسماعيل بن كثير، من أعظم المفسرين في التاريخ.", summary: "تلخيص شامل لأهم تفاسير القرآن الكريم المعتمدة على المأثور والحديث الصحيح." },
    { id: "AR_22", title: "أنبياء الله", author: "أحمد بهجت", subject: "قصص الأنبياء", publisher: "دار الشروق", driveLink: "https://drive.google.com/file/d/1lYq2LekqrEL2lnWQb1ogMd5saEo43860/view?usp=drive_link", bio: "كاتب وصحفي مصري متميز بأسلوبه الإيماني والعلمي الرصين.", summary: "استعراض لقصص الأنبياء بأسلوب أدبي رفيع يجمع بين الحقيقة التاريخية والوعظ." },
    { id: "AR_23", title: "قصص الأنبياء وسيرة الرسول", author: "محمد متولي الشعراوي", subject: "قصص الأنبياء", publisher: "دار القدس", driveLink: "https://drive.google.com/file/d/1QNUYu7lHEh9FdoBD8gptW14jEmFqBspb/view?usp=drive_link", bio: "إمام الدعاة، اشتهر بخواطره الإيمانية وتفسيره الميسر للقرآن.", summary: "رحلة إيمانية في سير الأنبياء وخاتم المرسلين بأسلوب الشيخ الشعراوي العذب." },
    { id: "AR_24", title: "قصص الأنبياء للأطفال", author: "محمود المصري", subject: "قصص الأنبياء", publisher: "مكتبة الصفا", driveLink: "https://drive.google.com/file/d/1t6mWRohKvE0RmqI9TcM7JqtD07bGWqkm/view?usp=drive_link", bio: "داعية إسلامي متخصص في تبسيط العلوم الشرعية للصغار.", summary: "مجموعة قصصية تربوية تعرف الأطفال بسير الأنبياء بأسلوب سهل ورسوم جذابة." },
    { id: "AR_25", title: "قصص الحيوان في القرآن", author: "أحمد بهجت", subject: "أدب إسلامي", publisher: "دار الشروق", driveLink: "https://drive.google.com/file/d/1N9pbgYG1qLrfiwLEnUeiAFL8tFdcOksr/view?usp=drive_link", bio: "أديب برع في استنطاق كائنات الطبيعة لتقديم دروس إيمانية.", summary: "حكايات ممتعة على لسان الحيوانات التي ذكرت في القرآن الكريم، تحمل حكماً بليغة." },
    { id: "AR_26", title: "شرح الأربعين النووية", author: "عبد الرؤوف المناوي", subject: "كتب سنة", publisher: "دار الضياء", driveLink: "https://drive.google.com/file/d/1L6-Q83l5OdNujMAjJ2UtxxG-a04hvyPE/view?usp=drive_link", bio: "فقيه ومحدث مصري، صاحب المصنفات العظيمة في شرح السنة.", summary: "شرح وافٍ للأحاديث الأربعين التي جمعها الإمام النووي، والتي تعد أصول الدين." },
    { id: "AR_27", title: "صحيح البخاري", author: "البخاري", subject: "كتب سنة", publisher: "دار ابن كثير", driveLink: "https://drive.google.com/file/d/1j7rtHR8fP3et3p1cQ8fB15Wb4Of8GBnG/view", bio: "الإمام محمد بن إسماعيل البخاري، صاحب أصح كتاب بعد القرآن.", summary: "الجامع المسند الصحيح لأقوال وأفعال وتقارير النبي صلى الله عليه وسلم." },
    { id: "AR_28", title: "صحيح مسلم", author: "مسلم", subject: "كتب سنة", publisher: "دار الحديث", driveLink: "https://drive.google.com/file/d/1k3nMYrD9V40GGP2BDJ18IinXBWXbL-04/view", bio: "الإمام مسلم بن الحجاج، أحد كبار علماء الحديث النبوي.", summary: "ثاني أصح الكتب في الحديث النبوي، مرتباً ترتيباً فقهياً دقيقاً وشاملاً." },
    { id: "AR_29", title: "الأب الغني والأب الفقير", author: "روبرت كيوساكي", subject: "تنمية بشرية", publisher: "مكتبة جرير", driveLink: "https://drive.google.com/file/d/17S2yXqeKbybMCdpuxV_vZU3McSarrp-1/view", bio: "رجل أعمال ومستثمر أمريكي، أحدث ثورة في الثقافة المالية.", summary: "كتاب يعلمك الفرق بين الأصول والالتزامات، وكيف تبدأ رحلتك نحو الاستقلال المالي." },
    { id: "AR_30", title: "الرقص مع الحياة", author: "مهدي الموسوي", subject: "تنمية بشرية", publisher: "مدارك", driveLink: "https://drive.google.com/file/d/1GNcOcjbcGARMXTMh0A0wYnaOxDHQ2ivt/view", bio: "باحث وكاتب كويتي، يركز في كتاباته على السعادة الداخلية والسلام.", summary: "دعوة ملهمة لعيش الحياة ببهجة وسلام، متجاوزاً العقبات الروحية والنفسية." },
    { id: "AR_31", title: "المفاتيح العشرة للنجاح", author: "إبراهيم الفقي", subject: "تنمية بشرية", publisher: "غير محدد", driveLink: "https://drive.google.com/file/d/1Oi25K6qOcePeORTEFaev4dFkWGFonwdf/view", bio: "خبير التنمية البشرية والبرمجة اللغوية العصبية، رائد هذا المجال عربياً.", summary: "دليل عملي يحتوي على أهم القواعد والخطوات لتحقيق النجاح في كافة مجالات الحياة." },
    { id: "AR_32", title: "خوارق اللاشعور", author: "علي الوردي", subject: "تنمية بشرية", publisher: "الوراق", driveLink: "https://drive.google.com/file/d/1_8qsQrkCoIDFJbFD1lB7be6JpOApErLR/view", bio: "عالم اجتماع عراقي شهير، عرف بتحليله النفسي والاجتماعي العميق.", summary: "دراسة في طبيعة النفس البشرية وتأثير اللاشعور على سلوك الفرد والمجتمع." },
    { id: "AR_33", title: "قوة الآن", author: "إيكهارت تول", subject: "تنمية بشرية", publisher: "دار علاء الدين", driveLink: "https://drive.google.com/file/d/1_jmXl_PDCqU1ElBcJZGYLoUIydM32mec/view", bio: "معلم روحي عالمي، يركز على العيش في اللحظة الحاضرة.", summary: "دليل للتنوير الروحي عبر التخلص من آلام الماضي وقلق المستقبل والعيش الآن." },
    { id: "AR_34", title: "أربعون", author: "أحمد الشقيري", subject: "تنمية بشرية", publisher: "الدار العربية للعلوم", driveLink: "https://drive.google.com/file/d/1IFeA8ElveWPYWKuiWQIhR4zdmZPSwKa0/view", bio: "إعلامي سعودي متميز، اشتهر ببرامج تحسين المجتمع فكرياً.", summary: "خواطر وتجارب شخصية كتبها الشقيري خلال خلوته، تلخص أهم دروس الحياة." },
    { id: "AR_35", title: "كيف تكسب الأصدقاء", author: "ديل كارنيجي", subject: "تنمية بشرية", publisher: "الأهلية", driveLink: "https://drive.google.com/file/d/168TUXU8P_5HcFmSKkrctOOFX0HG30Vbr/view", bio: "أشهر كاتب في تطوير العلاقات الإنسانية والمهارات القيادية عالمياً.", summary: "الكتاب المرجعي في فن التواصل الاجتماعي وبناء علاقات ناجحة ومؤثرة." },
    { id: "AR_36", title: "حكايات الغرفة 207", author: "أحمد خالد توفيق", subject: "أدب خيالي", publisher: "إصدارات دايموند", driveLink: "https://drive.google.com/file/d/1Cy8w5xDHqtIc--F2ad77sePB1tcGkr3s/view", bio: "طبيب ومؤلف مصري رائد في الرعب، له الفضل في تشكيل وعي جيل كامل.", summary: "سلسلة قصص غامضة ومخيفة تدور أحداثها داخل غرفة فندقية مسكونة بالأسرار.", audioId: "/audio/الغرفة207.mp3" },
    { id: "AR_37", title: "يوتوبيا", author: "أحمد خالد توفيق", subject: "أدب خيالي", publisher: "دار ميريت", driveLink: "https://drive.google.com/file/d/1hH9elAOnS9pRccxnFad4-vym_px-DbX1/view", bio: "العراب الذي برع في التنبؤ بالمستقبل عبر روايات الديستوبيا.", summary: "رواية سوداوية تتخيل العالم منقسم بين طبقتين: طبقة غنية منعزلة وطبقة مسحوقة.", audioId: "/audio/يوتوبيا.mp3" },
    { id: "AR_38", title: "خلف أسوار العقل", author: "نبيل فاروق", subject: "أدب خيالي", publisher: "المبدعون", driveLink: "https://drive.google.com/file/d/14p7eM2uBYrmYs3xuNRg1tNGXFBegW-ZM/view", bio: "رائد أدب الخيال العلمي، تميزت أعماله بالسرعة والتشويق الذهني.", summary: "مجموعة مقالات وقصص تتناول أسرار العقل البشري والظواهر الغريبة بأسلوب علمي.", audioId: "/audio/العقل.mp3" },
    { id: "AR_39", title: "انهم يأتون ليلا", author: "خالد أمين", subject: "أدب خيالي", publisher: "دار دون", driveLink: "https://drive.google.com/file/d/1M4LYoDVUunT7utYTqJD-6rXkAxQlrH_Y/view", bio: "كاتب مصري متميز في أدب الرعب والجريمة، يجمع بين الغموض والتشويق.", summary: "رواية رعب نفسية تدور حول مخاوف الإنسان وما يختبئ في الظلام بانتظارنا.", audioId: "/audio/انهم ياتون ليلا.mp3" },
    { id: "AR_40", title: "الذين كانوا", author: "نبيل فاروق", subject: "أدب خيالي", publisher: "سبارك للنشر", driveLink: "https://drive.google.com/file/d/1dDnEc6sG2LKVQDKlIw6ZL0x4lNKJtNOs/view", bio: "أديب الملايين الذي أثرى المكتبة العربية بمئات روايات الجيب.", summary: "قصص خيالية مثيرة حول حضارات بائدة وكائنات مجهولة تعود للظهور.", audioId: "/audio/اللذين كانوا.mp3" },
    { id: "AR_41", title: "ألف اختراع واختراع", author: "رولاند جاكسون", subject: "التراث العربي", publisher: "ناشونال جيوجرافيك", driveLink: "https://drive.google.com/file/d/1_4IKkimJy1MmApcRz_0HA9_wKWy6H-Mp", bio: "باحث ومؤرخ اهتم بإبراز الإسهامات العلمية للحضارة الإسلامية.", summary: "موسوعة مصورة مذهلة تستعرض الإنجازات العلمية الإسلامية التي شكلت عالمنا الحديث." },
    { id: "AR_42", title: "سلطان وقصص القرآن", author: "وائل عادل", subject: "أدب إسلامي", publisher: "مركز الوجدان الحضاري", driveLink: "https://drive.google.com/drive/folders/1FfcyIwRkO-Nn_Gq1RzPtDGfLG4mQwXSZ?usp=drive_link", bio: "مركز الوجدان الحضاري يسعى لبناء وعي الأجيال عبر محتوى تربوي أصيل.", summary: "مجموعة قصصية لغرس القيم بوجدان الأطفال بطريقة مشوقة عبر الطائر سلطان." },
    { id: "AR_43", title: "3D قصص الأنبياء", author: "متنوع", subject: "أدب إسلامي", publisher: "New Horizon", driveLink: "https://drive.google.com/drive/folders/1xZ6XqVdf_OG-tRf8068Q6VXrAPz7obQW?usp=drive_link", bio: "شركة متخصصة في كتب الأطفال والمناهج التعليمية بأساليب مبتكرة.", summary: "مجموعة كتب تضم رسوماً ثلاثية الأبعاد تشرح قصص الأنبياء بأسلوب ممتع للأطفال." },
    { id: "AR_44", title: "الفيزياء للصغار", author: "ليونيد سيكوروك", subject: "علوم", publisher: "دار مير للطباعة", driveLink: "https://drive.google.com/file/d/1l_-lECWoN0C3ARPD70oaD_4Ee3J6wb3p/view?usp=drive_link", bio: "مؤلف روسي معروف بكتبه المبسطة للعلوم الموجهة للأطفال.", summary: "كتاب يبسط مفاهيم الفيزياء لغير المتخصصين وحظي بتقدير واسع في العالم العربي." },
    { id: "AR_45", title: "أعظم 100 عالم", author: "جون بالتشين", subject: "علوم", publisher: "دار الكتب العلمية", driveLink: "https://drive.google.com/file/d/1aOHxire8Y9UWIdV6cO0Hc1nw2VWpEBYf/view?usp=drive_link", bio: "مؤلف بريطاني متخصص في تبسيط العلوم وتاريخها للقارئ العام.", summary: "يسرد جذور الاكتشافات العلمية الحديثة عبر سير أبرز العلماء العرب والغربيين." },
    { id: "AR_46", title: "أرض زيكولا", author: "عمرو عبدالحميد", subject: "أدب خيالي", publisher: "عصير الكتب", driveLink: "https://drive.google.com/file/d/1Mihna00ArISLe5SUifUemqbU3HoVIIEa/view?usp=drive_link", bio: "كاتب وطبيب مصري بارز، يُعد من أشهر روائيي الفنتازيا في الوطن العربي.", summary: "مغامرة شاب مصري ينتقل إلى أرض زيكولا، حيث العملة هي وحدات الذكاء بدلاً من المال.", audioId: "/audio/Zkola.mp3" },
    { id: "AR_47", title: "أماريتا", author: "عمرو عبدالحميد", subject: "أدب خيالي", publisher: "عصير الكتب", driveLink: "https://drive.google.com/file/d/17ultoN_mUJaG360jAp6t4JtXkQQoNKUS/view?usp=drive_link", bio: "كاتب مصري تميز بأسلوبه السلس في ربط الواقع بالخيال الملحمي.", summary: "الجزء الثاني من زيكولا، حيث تضطر الطبيبة أسيل للهروب وتواجه تحديات جديدة ومثيرة.", audioId: "/audio/Amarita.mp3" },
    { id: "AR_48", title: "وادي الذئاب المنسية", author: "عمرو عبدالحميد", subject: "أدب خيالي", publisher: "عصير الكتب", driveLink: "https://drive.google.com/file/d/1UeaCT1D75jpzjESxUw-ztusUvBrXXV4Q/view?usp=drive_link", bio: "مؤلف يمتلك قاعدة جماهيرية ضخمة لأسلوبه المشوق في سرد الخيال.", summary: "يامن يخوض مغامرة كبرى في عالم زيكولا وأماريتا لإنقاذ ما يمكن إنقاذه في الجزء الثالث.", audioId: "/audio/Wolf.mp3" },
    { id: "AR_49", title: "جلسات نفسية", author: "محمد إبراهيم", subject: "تنمية بشرية", publisher: "عصير الكتب", driveLink: "https://drive.google.com/file/d/1rvbFWFmgQ65Ufub-6tC-AeuqCYiNOW82/view?usp=drive_link", bio: "طبيب نفسي يقدم المفاهيم المعقدة بأسلوب مبسط قريب من القراء.", summary: "مجموعة جلسات نفسية تهدف لتحسين الصحة النفسية والتعامل مع التوتر بأساليب عملية." },
    { id: "AR_50", title: "كليلة ودمنة", author: "عبدالله بن المقفع", subject: "أدب خيالي", publisher: "هنداوي", driveLink: "https://drive.google.com/file/d/1manKVHamsvHDO-37IxmecGeKOtKxpJhB/view?usp=drive_link", bio: "أديب عباسي اشتهر ببلاغته ودوره في نقل الحكمة وتطوير النثر العربي.", summary: "كتاب قصصي ذو أصول هندية تدور أحداثه على ألسنة الحيوانات لتقديم نصائح سياسية وأخلاقية.", audioId: "/audio/كليلة.mp3" }
];

const translations = {
    ar: {
        pageTitle: "المكتبة العربية",
        searchPlaceholder: "ابحث عن عنوان أو كاتب...",
        sortBy: "فرز حسب",
        alphabetical: "العنوان",
        authorSort: "المؤلف",
        subjectSort: "الموضوع",
        audioSort: "الصوتيات أولاً",
        allAuthors: "كل المؤلفين",
        allSubjects: "كل الموضوعات",
        audioOnly: "صوتيات فقط",
        read: "قراءة المحتوى",
        listen: "تلخيص صقر الصوتي",
        summaryTitle: "ملخص صقر الرقمي",
        back: "العودة",
        close: "إغلاق",
        bioTitle: "نبذة عن المؤلف",
        exclusive: "حصرياً",
        topicLabel: "الموضوع"
    },
    en: {
        pageTitle: "Arabic Library",
        searchPlaceholder: "Search title or author...",
        sortBy: "Sort By",
        alphabetical: "Title",
        authorSort: "Author",
        subjectSort: "Subject",
        audioSort: "Audio First",
        allAuthors: "All Authors",
        allSubjects: "All Subjects",
        audioOnly: "Audio Only",
        read: "Read Content",
        listen: "Saqr Audio Summary",
        summaryTitle: "Saqr Digital Summary",
        back: "Back",
        close: "Close",
        bioTitle: "About Author",
        exclusive: "Exclusively",
        topicLabel: "Topic"
    }
};

const SchoolLogo = ({ forceWhite = false, className = "" }: { forceWhite?: boolean; className?: string }) => (
    <img src="/school-logo.png" alt="Logo" className={`h-8 md:h-12 w-auto transition-all duration-500 ${forceWhite ? 'brightness-0 invert' : 'dark:brightness-0 dark:invert'} ${className}`} />
);

const AudioWaveIcon = () => (
    <div className="flex gap-[3px] items-end h-4">
        <div className="w-1 bg-green-500 animate-audio-bar-1 rounded-t-sm"></div>
        <div className="w-1 bg-green-500 animate-audio-bar-2 rounded-t-sm"></div>
        <div className="w-1 bg-green-500 animate-audio-bar-3 rounded-t-sm"></div>
        <div className="w-1 bg-green-500 animate-audio-bar-2 rounded-t-sm"></div>
    </div>
);

const SaqrAudioPlayer: React.FC<{ audioSrc: string; t: any }> = ({ audioSrc, t }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [speed, setSpeed] = useState(1);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) audioRef.current.pause();
            else audioRef.current.play();
            setIsPlaying(!isPlaying);
        }
    };

    const handleSpeed = () => {
        const speeds = [1, 1.5, 2, 0.5];
        const nextSpeed = speeds[(speeds.indexOf(speed) + 1) % speeds.length];
        setSpeed(nextSpeed);
        if (audioRef.current) audioRef.current.playbackRate = nextSpeed;
    };

    return (
        <div className="mt-8 animate-fade-in-up">
            <h4 className="text-xs font-bold text-green-600 dark:text-green-500 tracking-widest mb-3 flex items-center gap-2">
                <span className="text-lg">🎧</span> {t('listen')}
            </h4>
            <div className="p-4 md:p-5 rounded-[1.5rem] bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 flex items-center gap-4 shadow-sm">
                <audio 
                    ref={audioRef} 
                    src={audioSrc} 
                    onTimeUpdate={() => setProgress((audioRef.current!.currentTime / audioRef.current!.duration) * 100)} 
                    onEnded={() => setIsPlaying(false)} 
                />
                <button onClick={togglePlay} className="w-12 h-12 rounded-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center shadow-md hover:shadow-lg transition-all shrink-0 active:scale-95">
                    {isPlaying ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
                    ) : (
                        <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" strokeWidth="2" strokeLinejoin="round"/></svg>
                    )}
                </button>
                <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 transition-all duration-100" style={{ width: `${progress}%` }} />
                </div>
                <button onClick={handleSpeed} className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-green-100 hover:text-green-600 dark:hover:bg-slate-700 transition-colors shrink-0">
                    {speed}x
                </button>
            </div>
        </div>
    );
};

const ArabicLibraryInternalPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const navigate = useNavigate();
    const isAr = locale === 'ar';
    const t = (key: keyof typeof translations.ar) => translations[locale][key];

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBook, setSelectedBook] = useState<any>(null);
    const [authorFilter, setAuthorFilter] = useState('all');
    const [subjectFilter, setSubjectFilter] = useState('all');
    const [sortBy, setSortBy] = useState('alphabetical');
    const [audioOnly, setAudioOnly] = useState(false);
    const [tooltip, setTooltip] = useState<{ text: string, x: number, y: number } | null>(null);

    const authors = useMemo(() => ["all", ...new Set(ARABIC_LIBRARY_DATABASE.map(b => b.author))].sort(), []);
    const subjects = useMemo(() => ["all", ...new Set(ARABIC_LIBRARY_DATABASE.map(b => b.subject))].sort(), []);

    const filteredBooks = useMemo(() => {
        const term = searchTerm.toLowerCase().trim();
        let result = ARABIC_LIBRARY_DATABASE.filter(b => {
            const matchesSearch = b.title.includes(term) || b.author.includes(term);
            const matchesAuthor = authorFilter === 'all' || b.author === authorFilter;
            const matchesSubject = subjectFilter === 'all' || b.subject === subjectFilter;
            const matchesAudio = audioOnly ? !!b.audioId : true;
            return matchesSearch && matchesAuthor && matchesSubject && matchesAudio;
        });

        if (sortBy === 'author') result = [...result].sort((a, b) => a.author.localeCompare(b.author, locale));
        else if (sortBy === 'subject') result = [...result].sort((a, b) => a.subject.localeCompare(b.subject, locale));
        else if (sortBy === 'audio') result = [...result].sort((a, b) => (b.audioId ? 1 : 0) - (a.audioId ? 1 : 0));
        else result = [...result].sort((a, b) => a.title.localeCompare(b.title, locale));

        return result;
    }, [searchTerm, authorFilter, subjectFilter, audioOnly, sortBy, locale]);

    const handleAuthorHover = (e: React.MouseEvent, bio: string | null) => {
        if (!bio || window.innerWidth < 768) { setTooltip(null); return; }
        setTooltip({ text: bio, x: e.clientX, y: e.clientY });
    };

    return (
        <div dir={dir} className="w-full min-h-[100dvh] flex flex-col bg-slate-50 dark:bg-slate-950 font-sans relative overflow-x-hidden transition-colors duration-300 py-6 md:py-10 px-4 md:px-6">
            
            {/* الخلفية الديناميكية الموحدة */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none opacity-40 dark:opacity-20">
               <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-green-600/30 rounded-full blur-[120px]"></div>
               <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] bg-red-600/30 rounded-full blur-[100px]"></div>
            </div>

            <div className="w-full max-w-[1400px] mx-auto flex flex-col animate-fade-in-up pb-20 z-10">
                
                {/* Tooltip */}
                {tooltip && (
                    <div 
                        className="fixed pointer-events-none z-[300] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl shadow-xl animate-zoom-in max-w-xs"
                        style={{ left: tooltip.x + 15, top: tooltip.y + 15, transform: isAr ? 'translateX(-100%)' : 'none' }}
                    >
                        <p className="text-[10px] font-bold text-green-600 dark:text-green-500 uppercase mb-1 tracking-widest">{t('bioTitle')}</p>
                        <p className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-relaxed">{tooltip.text}</p>
                    </div>
                )}

                {/* الهيدر */}
                <div className="relative text-center mb-10 md:mb-16">
                    <button onClick={() => navigate(-1)} className="absolute start-0 top-1/2 -translate-y-1/2 text-slate-500 hover:text-green-600 dark:text-slate-400 dark:hover:text-green-400 flex items-center gap-2 transition-colors font-bold text-sm md:text-base">
                        <svg className="w-5 h-5 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                        {t('back')}
                    </button>
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight inline-block relative">
                        {t('pageTitle')}
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-green-600 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                    </h1>
                </div>

                {/* شريط البحث والفلاتر (Sticky) */}
                <div className="sticky top-4 md:top-6 z-[100] mb-8 md:mb-12">
                    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-sm rounded-3xl md:rounded-[2.5rem] p-4 md:p-6 transition-all">
                        <div className="flex flex-col gap-4">
                            
                            <div className="relative group">
                                <input 
                                    type="text" 
                                    placeholder={t('searchPlaceholder')} 
                                    className="w-full py-4 px-6 ps-12 md:ps-14 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-green-500 dark:focus:border-green-500 rounded-2xl outline-none transition-colors text-slate-900 dark:text-white font-medium text-sm md:text-base placeholder-slate-400"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)} 
                                />
                                <svg className="absolute start-4 top-1/2 -translate-y-1/2 h-5 w-5 md:h-6 md:w-6 text-slate-400 group-focus-within:text-green-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </div>
                            
                            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
                                <select value={authorFilter} onChange={(e) => setAuthorFilter(e.target.value)} className="w-full py-3 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer outline-none focus:border-green-500 transition-colors appearance-none text-center">
                                    <option value="all">{t('allAuthors')}</option>
                                    {authors.filter(a => a !== "all").map(a => <option key={a} value={a}>{a}</option>)}
                                </select>
                                <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} className="w-full py-3 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer outline-none focus:border-green-500 transition-colors appearance-none text-center">
                                    <option value="all">{t('allSubjects')}</option>
                                    {subjects.filter(s => s !== "all").map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full py-3 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer outline-none focus:border-green-500 transition-colors appearance-none text-center lg:col-span-2">
                                    <option value="alphabetical">{t('alphabetical')}</option>
                                    <option value="author">{t('authorSort')}</option>
                                    <option value="subject">{t('subjectSort')}</option>
                                    <option value="audio">{t('audioSort')}</option>
                                </select>
                                <button 
                                    onClick={() => setAudioOnly(!audioOnly)} 
                                    className={`w-full py-3 px-4 rounded-xl font-bold text-xs transition-colors border col-span-2 lg:col-span-1 flex justify-center items-center gap-2 ${audioOnly ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/30' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                                >
                                    🎧 {t('audioOnly')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* شبكة الكتب */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                    {filteredBooks.map((book) => (
                        <div key={book.id} onClick={() => setSelectedBook(book)} className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-700 hover:border-green-500/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer h-full relative">
                            
                            <div className={`absolute top-0 start-0 w-1.5 h-full transition-colors duration-300 ${book.audioId ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`}></div>

                            <div className="p-6 md:p-8 flex-1 flex flex-col text-start">
                                <div className="flex justify-between items-center mb-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border
                                        ${book.audioId ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/20' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600'}`}>
                                        {book.subject}
                                    </span>
                                    {book.audioId && <AudioWaveIcon />}
                                </div>
                                
                                <h3 className="font-black text-lg md:text-xl text-slate-900 dark:text-white leading-snug mb-3 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors line-clamp-2">
                                    {book.title}
                                </h3>
                                
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-auto truncate flex items-center gap-2">
                                    <span className="text-lg">👤</span> {book.author}
                                </p>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-900/50 px-6 py-4 flex justify-between items-center border-t border-slate-100 dark:border-slate-700">
                                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-widest uppercase">Digital Index</span>
                                <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-400 group-hover:bg-green-600 group-hover:border-green-600 group-hover:text-white transition-colors">
                                    <svg className="w-4 h-4 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredBooks.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-xl font-bold text-slate-500 dark:text-slate-400">لا توجد كتب مطابقة لبحثك.</p>
                    </div>
                )}
            </div>

            {/* نافذة تفاصيل الكتاب (Modal) */}
            {selectedBook && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 backdrop-blur-sm bg-slate-900/40 dark:bg-black/60 animate-fade-in" onClick={() => setSelectedBook(null)}>
                    <div className="relative w-full max-w-4xl bg-white dark:bg-slate-800 rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] border border-slate-200 dark:border-slate-700 animate-zoom-in" onClick={(e) => e.stopPropagation()}>
                        
                        <button onClick={() => setSelectedBook(null)} className={`absolute top-4 ${isAr ? 'left-4' : 'right-4'} z-50 p-2 md:p-3 bg-slate-100 hover:bg-green-100 dark:bg-slate-700 dark:hover:bg-green-900/30 text-slate-500 hover:text-green-600 transition-colors rounded-full`}>
                            <svg className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                        
                        <div className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto no-scrollbar flex flex-col">
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight mb-2">{selectedBook.title}</h2>
                            <p 
                                onMouseMove={(e) => handleAuthorHover(e, selectedBook.bio)} 
                                onMouseLeave={(e) => handleAuthorHover(e, null)}
                                className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-medium mb-8 cursor-help inline-block border-b border-dashed border-slate-300 dark:border-slate-600 w-max pb-1"
                            >
                                بقلم: {selectedBook.author}
                            </p>
                            
                            <div className="bg-slate-50 dark:bg-slate-900/50 p-6 md:p-8 rounded-3xl border border-slate-100 dark:border-slate-700 flex-1">
                                <p className="text-xs text-green-600 dark:text-green-500 font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <span className="text-base">✨</span> {t('summaryTitle')}
                                </p>
                                <p className="text-slate-800 dark:text-slate-200 text-base md:text-lg font-medium leading-[1.8]">
                                    {selectedBook.summary}
                                </p>
                            </div>

                            {selectedBook.audioId && <SaqrAudioPlayer audioSrc={selectedBook.audioId} t={t} />}
                        </div>

                        <div className="w-full md:w-72 lg:w-80 bg-slate-50 dark:bg-slate-900 p-6 md:p-10 flex flex-col justify-center items-center border-t md:border-t-0 md:border-s border-slate-200 dark:border-slate-700 shrink-0">
                            <div className="w-full text-center flex flex-col items-center gap-2 mb-8">
                                <span className="text-xs font-bold text-slate-400 tracking-widest">{t('exclusive')}</span>
                                <SchoolLogo className="h-12 w-auto mt-2" />
                            </div>
                            
                            <div className="w-full flex flex-col gap-4">
                                <a href={selectedBook.driveLink} target="_blank" rel="noreferrer" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-full transition-colors text-center text-sm md:text-base shadow-md hover:shadow-lg flex justify-center items-center gap-2">
                                    {t('read')}
                                </a>
                                <button onClick={() => setSelectedBook(null)} className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-bold py-4 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-sm">
                                    {t('close')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');
                * { font-family: 'Cairo', sans-serif !important; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                
                @keyframes audio-bar { 0%, 100% { height: 4px; } 50% { height: 16px; } }
                .animate-audio-bar-1 { animation: audio-bar 0.8s ease-in-out infinite; }
                .animate-audio-bar-2 { animation: audio-bar 1s ease-in-out infinite 0.2s; }
                .animate-audio-bar-3 { animation: audio-bar 0.9s ease-in-out infinite 0.4s; }
                
                @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
                .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
                
                @keyframes zoom-in { 0% { opacity: 0; transform: scale(0.95); } 100% { opacity: 1; transform: scale(1); } }
                .animate-zoom-in { animation: zoom-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                
                @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default ArabicLibraryInternalPage;
