import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useLanguage } from '../App';
import { useNavigate } from 'react-router-dom';

// --- 1. قاعدة البيانات (Database) ---
const ARABIC_LIBRARY_DATABASE = [
    { id: "AR_1", title: "مجموعة روايات أجاثا كريستي", author: "أجاثا كريستي", subject: "قصص بوليسية", publisher: "ناشرون متعددون", driveLink: "https://drive.google.com/drive/folders/1PZk0vPQrKXIgE0WmUXlEMcSzt_d94Q6u", bio: "ملكة الجريمة عالمياً، صاحبة الشخصيات الخالدة مثل هيركيول بوارو.", summary: "أضخم مجموعة لروايات التحقيق والغموض التي تتميز بحبكة عبقرية ونهايات صادمة." },
    { id: "AR_2", title: "أرض الإله", author: "أحمد مراد", subject: "أدب تاريخي", publisher: "دار الشروق", driveLink: "https://drive.google.com/file/d/1Q-dT9-g292nqv1N_PvlB2TnZMBdQGpio/view", bio: "كاتب ومصور مصري معاصر، تميز برواياته التي تمزج بين التاريخ والغموض.", summary: "رحلة تاريخية مثيرة في زمن الفراعنة تكشف أسراراً مخفية حول خروج بني إسرائيل.", audioId: "/audio/أرض الإله.mp3" },
    { id: "AR_3", title: "أرض النفاق", author: "يوسف السباعي", subject: "أدب خيالي", publisher: "مكتبة مصر", driveLink: "https://drive.google.com/file/d/14KCqI_ffiUg8if8uqs_vQ-oJIXBEsKD3/view", bio: "فارس الرومانسية المصرية، وزير ثقافة سابق، اشتهر بأسلوبه الساخر.", summary: "رواية رمزية ساخرة تنتقد الأخلاق الاجتماعية عبر فكرة بيع الأخلاق في دكاكين متخصصة.", audioId: "/audio/أرض النفاق.mp3" },
    { id: "AR_4", title: "أكواريل", author: "أحمد خالد توفيق", subject: "أدب خيالي", publisher: "دار سما للنشر والتوزيع", driveLink: "https://drive.google.com/file/d/1NLK9-pE6uoHU8po8BC8731KIZ3oc0qU5/view", bio: "عراب أدب الرعب العربي، أول كاتب عربي برع في أدب الإثارة للشباب.", summary: "مجموعة قصصية مشوقة تأخذنا إلى عوالم من الغموض الطبي والنفسي بأسلوب العراب الفريد.", audioId: "/audio/Aquarel.mp3" },
    { id: "AR_5", title: "الفيل الأزرق", author: "أحمد مراد", subject: "أدب خيالي", publisher: "دار الشروق", driveLink: "https://drive.google.com/file/d/1Vr0BCdRxRC4k9e8t7g5sqtfnW1BHZbTD/view", bio: "أحد أبرز الروائيين العرب حالياً، تحولت معظم أعماله إلى أفلام سينمائية ناجحة.", summary: "رحلة نفسية غامضة داخل مستشفى العباسية للأمراض العقلية، تمزج بين الواقع والهلوسة.", audioId: "/audio/الفيل الازرق.mp3" },
    { id: "AR_6", title: "نائب عزارئيل", author: "يوسف السباعي", subject: "أدب خيالي", publisher: "مكتبة الإسكندرية", driveLink: "https://drive.google.com/file/d/1vC4PIAZ2ekJ-uU3wCE4zV70glD8VjDT0/view", bio: "أديب مصري راحل لقب بـ فارس الرومانسية وساهم في إثراء المكتبة العربية.", summary: "رواية فانتازيا فلسفية تتخيل شخصاً يقوم بدور عزرائيل، بأسلوب ساخر وعميق.", audioId: "/audio/نائب عزرائيل.mp3" },
    { id: "AR_7", title: "المكتبة الخضراء للأطفال", author: "مؤلفين", subject: "قصص للأطفال", publisher: "دار المعارف", driveLink: "https://drive.google.com/drive/folders/1AHrYDDPkocCEAnJXAfhbnTYtfkpcuUIn?usp=sharing", bio: "نخبة من كبار كتاب أدب الطفل صاغوا حكايات تربوية عالمية بأسلوب مشوق.", summary: "أشهر سلاسل القصص للأطفال، تهدف لغرس القيم النبيلة بأسلوب حكائي ورسوم جذابة." },
    { id: "AR_8", title: "أوقات عصيبة", author: "تشارلز ديكنز", subject: "قصص عالمية", publisher: "مكتبة الأنجلو المصرية", driveLink: "https://drive.google.com/file/d/1TxWYfZmTOjvpj5mjTeKBueUDHrEIViAB/view", bio: "أعظم الروائيين الإنجليز في العصر الفيكتوري، اشتهر بدفاعه عن الطبقات الفقيرة.", summary: "رواية كلاسيكية تستعرض الصراعات الاجتماعية في إنجلترا خلال الثورة الصناعية.", audioId: "/audio/اوقات عصيبة.mp3" },
    { id: "AR_9", title: "أوليفر تويسيت", author: "تشارلز ديكنز", subject: "قصص عالمية", publisher: "دار العلم للملايين", driveLink: "https://drive.google.com/file/d/1zkFntttQq6pzErlvPCKbmW8odDORoneJ/view", bio: "روائي عبقري رسم بكلماته ملامح الحياة في لندن القديمة.", summary: "حكاية اليتيم أوليفر ورحلته للبحث عن هويته وسط عالم من الجريمة والظلم.", audioId: "/audio/أوليفر تويست.mp3" },
    { id: "AR_10", title: "الآمال الكبيرة", author: "تشارلز ديكنز", subject: "قصص عالمية", publisher: "مكتبة الأسرة 2000", driveLink: "https://drive.google.com/file/d/1aYWKfjB1fJu3CfII-yK55hM5qmt3ji5Y/view", bio: "سيد الرواية الاجتماعية الإنجليزية، يمتلك قدرة فريدة على رسم الشخصيات.", summary: "قصة الشاب بيب وطموحاته التي تتغير مع مرور الوقت في دراما إنسانية خالدة.", audioId: "/audio/الآمال العظيمة.mp3" },
    { id: "AR_11", title: "ترويض النمرة", author: "ويليام شيكسبير", subject: "قصص عالمية", publisher: "هنداوي", driveLink: "https://drive.google.com/file/d/1GjLXf2OvsdypCva9Uf34mbchFkYSjBtd/view", bio: "الشاعر والكاتب المسرحي الإنجليزي الأشهر، رائد الأدب العالمي.", summary: "كوميديا اجتماعية تتناول علاقات الزواج بأسلوب شيكسبيري ممتع ومليء بالمفارقات." },
    { id: "AR_12", title: "جعجعة بدون طحن", author: "ويليام شيكسبير", subject: "مسرحيات عالمية", publisher: "دار نظير عبود", driveLink: "https://drive.google.com/file/d/1Myn0epkZJEkV2CQO_xaLpmJu6DFu0rrt/view", bio: "عبقري الكلمة الذي جسد النفس البشرية في كافة حالاتها.", summary: "مسرحية كوميدية تدور حول الحب والغيرة والمؤامرات بأسلوب ذكي وحوارات شيقة.", audioId: "/audio/جعجعة بدون طحن.mp3" },
    { id: "AR_13", title: "دايفيد كوبرفيلد", author: "تشارلز ديكنز", subject: "قصص عالمية", publisher: "مكتبة الأسرة 2000", driveLink: "https://drive.google.com/file/d/1MCmhkl0ul9zmZ7jvdaSKmG4bwLdHDRHz/view", bio: "ديكنز يروي جانباً من سيرته الذاتية المقنعة في هذه التحفة الروائية.", summary: "رحلة دايفيد من الطفولة البائسة إلى النجاح، وهي أكثر روايات ديكنز قرباً لقلبه." },
    { id: "AR_14", title: "دمبي وولده", author: "تشارلز ديكنز", subject: "قصص عالمية", publisher: "جداران المعرفة", driveLink: "https://drive.google.com/file/d/14ex-UE5dQDaZtdeQ9s4KUd0-YYH4_Lfh/view", bio: "كاتب برع في نقد قسوة الرأسمالية بأسلوب إنساني مؤثر.", summary: "رواية تتناول العلاقات الأسرية والغرور التجاري في العصر الفيكتوري اللندني.", audioId: "/audio/domby.mp3" },
    { id: "AR_15", title: "قصة مدينتين", author: "تشارلز ديكنز", subject: "قصص عالمية", publisher: "دار العلم للملايين", driveLink: "https://drive.google.com/file/d/1baMVDkz88y5uRMIp1Aj506WZPD5dpibU/view", bio: "ديكنز في قمته التاريخية يصور أحداث الثورة الفرنسية.", summary: "ملحمة تدور بين لندن وباريس، تجسد التضحية والحب في زمن الاضطرابات الكبرى.", audioId: "/audio/قصة مدينتين.mp3" },
    { id: "AR_16", title: "هملت : أمير دانمركة", author: "ويليام شيكسبير", subject: "مسرحيات عالمية", publisher: "دار المعارف", driveLink: "https://drive.google.com/file/d/1qWz0xEuQUqhGQtESVtVo_pmC4DLIP4L-/view", bio: "أعظم تراجيديا في تاريخ المسرح العالمي، تدرس حتى اليوم.", summary: "صراع الوجود والانتقام في عقل الأمير هملت: أكون أو لا أكون، تلك هي المسألة.", audioId: "/audio/هاملت.mp3" },
    { id: "AR_17", title: "مذكرات بيكويك", author: "تشارلز ديكنز", subject: "قصص عالمية", publisher: "هنداوي", driveLink: "https://drive.google.com/file/d/1_okaw0LTO6nSyLJrQrDHCOYCndk4wdgF/view", bio: "ديكنز الكوميدي، أول أعماله التي حققت شهرة واسعة.", summary: "مغامرات فكاهية لجمعية بيكويك وأعضائها أثناء تجولهم في أرجاء إنجلترا.", audioId: "/audio/مذكرات بيكويك.mp3" },
    { id: "AR_18", title: "سلسلة رجل المستحيل", author: "نبيل فاروق", subject: "قصص بوليسية", publisher: "المؤسسة العربية الحديثة", driveLink: "https://drive.google.com/drive/folders/1yjQ37_OKjp0N7VB6BrIVP7SNzQLAU2fS", bio: "رائد أدب الجاسوسية العربي، صنع بطلاً أسطورياً أسر عقول أجيال.", summary: "مغامرات شيقة لرجل المخابرات أدهم صبري، يواجه فيها أخطاراً تهدد الأمن القومي." },
    { id: "AR_19", title: "سلسلة ما وراء الطبيعة", author: "أحمد خالد توفيق", subject: "أدب خيالي", publisher: "المؤسسة العربية الحديثة", driveLink: "https://drive.google.com/drive/folders/1qJD1adnBDMgQFPWMSnMM3KJmbVlmBr6W", bio: "الأديب الذي جعل الشباب يقرأون، مبتكر شخصية رفعت إسماعيل.", summary: "سلسلة خوارق ورعب تروي مغامرات رفعت إسماعيل مع الأساطير والظواهر المجهولة." },
    { id: "AR_20", title: "سلسلة الشياطين ال13", author: "محمود سالم", subject: "أدب خيالي", publisher: "هنداوي", driveLink: "https://drive.google.com/drive/folders/1OoXAgtzyZ4QK0WIIJPCU5IICwlUPED0w", bio: "أشهر من كتب الألغاز والمغامرات للشباب في العالم العربي.", summary: "مغامرات ذكية لمجموعة من الفتيان العرب يحلون أصعب الجرائم والألغاز." },
    { id: "AR_21", title: "مختصر تفسير ابن كثير", author: "ابن كثير", subject: "تفسير القرآن", publisher: "دار المعرفة", driveLink: "https://drive.google.com/drive/folders/1lLmRHktJSbAJjjX0Wdh4shjHyweQy_0h", bio: "الحافظ والمؤرخ اسماعيل بن كثير، من أعظم المفسرين في التاريخ.", summary: "تلخيص شامل لأهم تفاسير القرآن الكريم المعتمدة على المأثور والحديث الصحيح." },
    { id: "AR_22", title: "أنبياء الله", author: "أحمد بهجت", subject: "قصص الأنبياء", publisher: "دار الشروق", driveLink: "https://drive.google.com/file/d/1lYq2LekqrEL2lnWQb1ogMd5saEo43860/view?usp=drive_link", bio: "كاتب وصحفي مصري متميز بأسلوبه الإيماني والعلمي الرصين.", summary: "استعراض لقصص الأنبياء بأسلوب أدبي رفيع يجمع بين الحقيقة التاريخية والوعظ." },
    { id: "AR_23", title: "قصص الأنبياء ومعها سيرة الرسول صلى الله عليه وسلم", author: "محمد متولي الشعراوي", subject: "قصص الأنبياء", publisher: "دار القدس", driveLink: "https://drive.google.com/file/d/1QNUYu7lHEh9FdoBD8gptW14jEmFqBspb/view?usp=drive_link", bio: "إمام الدعاة، اشتهر بخواطره الإيمانية وتفسيره الميسر للقرآن.", summary: "رحلة إيمانية في سير الأنبياء وخاتم المرسلين بأسلوب الشيخ الشعراوي العذب." },
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
    { id: "AR_35", title: "كيف تكسب الأصدقاء وتؤثر في الناس", author: "ديل كارنيجي", subject: "تنمية بشرية", publisher: "الأهلية", driveLink: "https://drive.google.com/file/d/168TUXU8P_5HcFmSKkrctOOFX0HG30Vbr/view", bio: "أشهر كاتب في تطوير العلاقات الإنسانية والمهارات القيادية عالمياً.", summary: "الكتاب المرجعي في فن التواصل الاجتماعي وبناء علاقات ناجحة ومؤثرة." },
    { id: "AR_36", title: "حكايات الغرفة 207", author: "أحمد خالد توفيق", subject: "أدب خيالي", publisher: "إصدارات دايموند", driveLink: "https://drive.google.com/file/d/1Cy8w5xDHqtIc--F2ad77sePB1tcGkr3s/view", bio: "طبيب ومؤلف مصري رائد في الرعب، له الفضل في تشكيل وعي جيل كامل.", summary: "سلسلة قصص غامضة ومخيفة تدور أحداثها داخل غرفة فندقية مسكونة بالأسرار.", audioId: "/audio/الغرفة207.mp3" },
    { id: "AR_37", title: "يوتوبيا", author: "أحمد خالد توفيق", subject: "أدب خيالي", publisher: "دار ميريت", driveLink: "https://drive.google.com/file/d/1hH9elAOnS9pRccxnFad4-vym_px-DbX1/view", bio: "العراب الذي برع في التنبؤ بالمستقبل عبر روايات الديستوبيا.", summary: "رواية سوداوية تتخيل مصر منقسمة بين طبقتين: طبقة غنية منعزلة وطبقة مسحوقة.", audioId: "/audio/يوتوبيا.mp3" },
    { id: "AR_38", title: "خلف أسوار العقل", author: "نبيل فاروق", subject: "أدب خيالي", publisher: "المبدعون", driveLink: "https://drive.google.com/file/d/14p7eM2uBYrmYs3xuNRg1tNGXFBegW-ZM/view", bio: "رائد أدب الخيال العلمي، تميزت أعماله بالسرعة والتشويق الذهني.", summary: "مجموعة مقالات وقصص تتناول أسرار العقل البشري والظواهر الغريبة بأسلوب علمي." },
    { id: "AR_39", title: "انهم يأتون ليلا", author: "خالد أمين", subject: "أدب خيالي", publisher: "دار دون", driveLink: "https://drive.google.com/file/d/1M4LYoDVUunT7utYTqJD-6rXkAxQlrH_Y/view", bio: "كاتب مصري متميز في أدب الرعب والجريمة، يجمع بين الغموض والتشويق.", summary: "رواية رعب نفسية تدور حول مخاوف الإنسان وما يختبئ في الظلام بانتظارنا.", audioId: "/audio/انهم ياتون ليلا.mp3" },
    { id: "AR_40", title: "الذين كانوا", author: "نبيل فاروق", subject: "أدب خيالي", publisher: "سبارك للنشر والتوزيع", driveLink: "https://drive.google.com/file/d/1dDnEc6sG2LKVQDKlIw6ZL0x4lNKJtNOs/view", bio: "أديب الملايين الذي أثرى المكتبة العربية بمئات روايات الجيب.", summary: "قصص خيالية مثيرة حول حضارات بائدة وكائنات مجهولة تعود للظهور.", audioId: "/audio/اللذين كانوا.mp3" },
    { id: "AR_41", title: "ألف اختراع واختراع", author: "رولاند جاكسون", subject: "التراث العربي", publisher: "ناشونال جيوجرافيك", driveLink: "https://drive.google.com/file/d/1_4IKkimJy1MmApcRz_0HA9_wKWy6H-Mp", bio: "باحث ومؤرخ اهتم بإبراز الإسهامات العلمية للحضارة الإسلامية.", summary: "موسوعة مصورة مذهلة تستعرض الإنجازات العلمية الإسلامية التي شكلت عالمنا الحديث." },
    { id: "AR_42", title: "سلطان وقصص القرآن", author: "وائل عادل", subject: "أدب إسلامي", publisher: "مركز الوجدان الحضاري - وزارة الثقافة دولة قطر", driveLink: "https://drive.google.com/drive/folders/1FfcyIwRkO-Nn_Gq1RzPtDGfLG4mQwXSZ?usp=drive_link", bio: "ينطلق مركز الوجدان الحضاري من فكرة أساسية وهي: أن وجدان أي أمة هو ضميرها ومشاعرها وطريقة تكوينها الفكري والعاطفي، فالمرتكزات الكبرى لأي أمة هي وعيها وأفكارها وقيمها ومشاعرها.", summary: "تأتي هذه المجموعة القصصية من سلسلة “سلطان وقصص القرآن” لغرس القيم بوجدان الأطفال بطريقة مشوقة، عبر بطل القصص الطائر “سلطان” ، يتعلم من خلال مشاهد مختارات من قصص القرآن.." },
    { id: "AR_43", title: "3D قصص الأنبياء", author: "متنوع", subject: "أدب إسلامي", publisher: "New Horizon", driveLink: "https://drive.google.com/drive/folders/1xZ6XqVdf_OG-tRf8068Q6VXrAPz7obQW?usp=drive_link", bio: "نحن شركة متخصصة في كتب الأطفال والمناهج التعليمية العربية والإنجليزية كما توجد لنا إصدارات وسلاسل قصص باللغة الفرنسية.", summary: "هي مجموعة كتب تضم رسوماً كرتونية بتقنيةثلاثية الأبعاد تشرح قصص الأنبياء المذكورين في القرآن الكريم بأسلوب شيق وممتع للأطفال." },
    { id: "AR_44", title: "الفيزياء للصغار", author: "ليونيد سيكوروك", subject: "علوم", publisher: "دار مير للطباعة والنشر", driveLink: "https://drive.google.com/file/d/1l_-lECWoN0C3ARPD70oaD_4Ee3J6wb3p/view?usp=drive_link", bio: "هو مؤلف روسي معروف بكتابه المبسط في الفيزياء للأطفال بعنوان الفيزياء للصغار Physics for Kids", summary: "يُعد هذا الكتاب مثالاً لجهود تبسيط العلوم لغير المتخصصين، وحظي بترجمات وتقدير واسع النطاق، خاصة في الأوساط العربية." },
    { id: "AR_45", title: "أعظم 100عالم غيروا العالم", author: "جون بالتشين", subject: "علوم", publisher: "دار الكتب العلمية", driveLink: "https://drive.google.com/file/d/1aOHxire8Y9UWIdV6cO0Hc1nw2VWpEBYf/view?usp=drive_link", bio: "هو كاتب ومؤلف بريطاني متخصص في تبسيط العلوم وتاريخها، ويشتهر بكتابه أعظم 100 عالم غيروا العالم الذي يُقدم سيرة وحياة واكتشافات أبرز العلماء بطريقة شيقة ومبسطة للقارئ العام", summary: "يسرد الكتاب جذور الاكتشافات العلمية الحديثة بحيث يذكر مختلف العلماء الغرب والعرب وما ساهموا في اكتشافه" },
    { id: "AR_46", title: "أرض زيكولا", author: "عمرو عبدالحميد", subject: "أدب خيالي", publisher: "عصير الكتب", driveLink: "https://drive.google.com/file/d/1Mihna00ArISLe5SUifUemqbU3HoVIIEa/view?usp=drive_link", bio: "عمرو عبد الحميد هو كاتب وطبيب مصري بارز، يُعد من أشهر روائيي الفنتازيا والخيال في الوطن العربي، وقد حققت رواياته شهرة واسعة خاصة رواية أرض زيكولا وسلسلة قواعد جارتين", summary: "تبدأ الأحداث مع شاب يدعى خالد، من قرية البهو فريك المصرية، الذي يحاول مراراً خطبة الفتاة التي يحبها، لكن والدها يرفضه في كل مرة بحجة أنه شاب عادي ولا يملك ما يميزه. هذا الرفض يدفع خالد لخوض مغامرة لإثبات ذاته، فيقرر دخول سرداب فوريك الغامض الذي تحوم حوله الأساطير في قريته.", audioId: "/audio/Zkola.mp3" },
    { id: "AR_47", title: "أماريتا", author: "عمرو عبدالحميد", subject: "أدب خيالي", publisher: "عصير الكتب", driveLink: "https://drive.google.com/file/d/17ultoN_mUJaG360jAp6t4JtXkQQoNKUS/view?usp=drive_link", bio: "عمرو عبد الحميد هو كاتب وطبيب مصري بارز، يُعد من أشهر روائيي الفنتازيا والخيال في الوطن العربي، وقد حققت رواياته شهرة واسعة خاصة رواية أرض زيكولا وسلسلة قواعد جارتين", summary: "تتمحور أحداث هذا الجزء حول الطبيبة أسيل، التي ضحت بمكانتها ووحدات ذكائها في الجزء الأول لمساعدة خالد على الهروب والعودة إلى عالمه. نتيجة لذلك، تُتهم أسيل بالخيانة العظمى لقوانين زيكولا، وتُجبر على الهروب من مدينتها لتبدأ رحلة شاقة من المعاناة والتشرد.", audioId: "/audio/Amarita.mp3" },
    { id: "AR_48", title: "وادي الذئاب المنسية", author: "عمرو عبدالحميد", subject: "أدب خيالي", publisher: "عصير الكتب", driveLink: "https://drive.google.com/file/d/1UeaCT1D75jpzjESxUw-ztusUvBrXXV4Q/view?usp=drive_link", bio: "عمرو عبد الحميد هو كاتب وطبيب مصري بارز، يُعد من أشهر روائيي الفنتازيا والخيال في الوطن العربي، وقد حققت رواياته شهرة واسعة خاصة رواية أرض زيكولا وسلسلة قواعد جارتين", summary: "تبدأ أحداث هذا الجزء بعد سنوات من نهاية أحداث أماريتا. المحرك الأساسي للقصة هذه المرة ليس خالد الأب، بل ابنه يامن، الذي يجد نفسه مدفوعاً لخوض مغامرة كبرى في عالم زيكولا وأماريتا.", audioId: "/audio/Wolf.mp3" },
    { id: "AR_49", title: "جلسات نفسية", author: "محمد إبراهيم", subject: "تنمية بشرية", publisher: "عصير الكتب", driveLink: "https://drive.google.com/file/d/1rvbFWFmgQ65Ufub-6tC-AeuqCYiNOW82/view?usp=drive_link", bio: "كاتب وأخصائي في علم النفس،​​ ​​يتميز الدكتور محمد إبراهيم بقدرته على تبسيط المفاهيم النفسية وتقديمها بأسلوب سلس ومباشر، مما يجعله قريبًا من القراء الباحثين عن فهم أعمق لذواتهم وتحقيق السكينة النفسية", summary: "يحتوي هذا الكتاب المكون من 120 صفحة على مجموعة من الجلسات النفسية التي تهدف إلى تحسين الصحة النفسية وتعزيز الرفاهية. حيث يقدم أساليب فعالة للتعامل مع التوتر والقلق، بالإضافة إلى تمارين تنمية الذات التي تساعدك على فهم مشاعرك وتطوير مهاراتك الشخصية." }
];
const translations = {
    ar: {
        pageTitle: "المكتبة العربية",
        searchPlaceholder: "ابحث عن عنوان أو كاتب...",
        sortBy: "فرز حسب",
        alphabetical: "العنوان",
        authorSort: "المؤلف",
        subjectSort: "الموضوع",
        audioSort: "الصوتيات",
        read: "قراءة المحتوى",
        listen: "تلخيص صقر الصوتي",
        summaryTitle: "ملخص صقر الرقمي",
        back: "العودة",
        close: "إغلاق",
        playing: "جاري التشغيل",
        paused: "توقف مؤقت",
        bioTitle: "نبذة عن المؤلف",
    },
    en: {
        pageTitle: "Arabic Library",
        searchPlaceholder: "Search title or author...",
        sortBy: "Sort By",
        alphabetical: "Title",
        authorSort: "Author",
        subjectSort: "Subject",
        audioSort: "Audio First",
        read: "Read Content",
        listen: "Saqr Audio Summary",
        summaryTitle: "Saqr Digital Summary",
        back: "Back",
        close: "Close",
        playing: "Playing Now",
        paused: "Paused",
        bioTitle: "About Author",
    }
};

// --- 3. مكونات التصميم المحدثة ---

const SchoolLogo = () => (
    <img 
        src="/school-logo.png" 
        alt="School Logo" 
        className="h-8 w-auto rotate-[12deg] logo-white-filter opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:rotate-[15deg]"
    />
);

const SaqrAudioPlayer: React.FC<{ audioSrc: string; t: any }> = ({ audioSrc, t }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) audioRef.current.pause();
            else audioRef.current.play();
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <div className="mt-8">
            <p className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                <span className="text-lg">🎧</span> {t('listen')}
            </p>
            <div className="p-5 rounded-[2rem] bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/20 shadow-inner">
                <audio ref={audioRef} src={audioSrc} onTimeUpdate={() => setProgress((audioRef.current!.currentTime / audioRef.current!.duration) * 100)} onEnded={() => setIsPlaying(false)} />
                <div className="flex items-center gap-5">
                    <button onClick={togglePlay} className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all">
                        {isPlaying ? (
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                        ) : (
                            <svg className="w-6 h-6 ps-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        )}
                    </button>
                    <div className="flex-1">
                        <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.6)] transition-all duration-300" style={{ width: `${progress}%` }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- 4. نافذة تفاصيل الكتاب (Modal) ---
const BookModal: React.FC<{ book: any | null; onClose: () => void; t: any; onAuthorHover: (e: React.MouseEvent, bio: string | null) => void }> = ({ book, onClose, t, onAuthorHover }) => {
    if (!book) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 backdrop-blur-3xl animate-fade-up" onClick={onClose}>
            <div className="relative w-full max-w-4xl glass-panel rounded-[3rem] overflow-hidden flex flex-col md:flex-row shadow-2xl bg-white/95 dark:bg-slate-950/95" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-6 end-6 z-50 p-2 bg-red-600 text-white rounded-full hover:rotate-90 transition-all shadow-xl">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                
                <div className="flex-1 p-8 md:p-14 text-start">
                    <h2 className="text-3xl md:text-5xl font-black text-slate-950 dark:text-white leading-tight mb-2 tracking-tighter">{book.title}</h2>
                    <p 
                        onMouseMove={(e) => onAuthorHover(e, book.bio)} 
                        onMouseLeave={(e) => onAuthorHover(e, null)}
                        className="text-xl text-red-600 font-bold mb-8 cursor-help inline-block border-b-2 border-dotted border-red-200"
                    >
                        By {book.author}
                    </p>
                    
                    <div className="p-6 rounded-[2rem] bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-inner">
                        <p className="text-[10px] text-green-600 font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> {t('summaryTitle')}
                        </p>
                        <p className="text-slate-800 dark:text-slate-200 text-lg leading-relaxed italic">
                            "{book.summary}"
                        </p>
                    </div>
                    {book.audioId && <SaqrAudioPlayer audioSrc={book.audioId} t={t} />}
                </div>

                <div className="w-full md:w-[300px] bg-slate-950 p-10 flex flex-col justify-center items-center text-white border-s border-white/10">
                    <div className="space-y-6 w-full text-center">
                        <a href={book.driveLink} target="_blank" rel="noreferrer" className="w-full block bg-red-600 text-white font-black py-5 rounded-2xl hover:bg-red-700 transition-all text-center uppercase tracking-widest shadow-xl shadow-red-600/20">
                            {t('read')}
                        </a>
                        <button onClick={onClose} className="w-full bg-white/10 text-white border border-white/20 font-black py-3 rounded-xl hover:bg-white hover:text-black transition-all text-xs uppercase tracking-[0.2em]">
                            {t('close')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- 5. الصفحة الرئيسية ---
const ArabicLibraryInternalPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const navigate = useNavigate();
    const t = (key: keyof typeof translations.ar) => translations[locale][key];

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBook, setSelectedBook] = useState<any>(null);
    const [sortBy, setSortBy] = useState('alphabetical');
    const [tooltip, setTooltip] = useState<{ text: string, x: number, y: number } | null>(null);

    const handleAuthorHover = (e: React.MouseEvent, bio: string | null) => {
        if (!bio || window.innerWidth < 768) { setTooltip(null); return; }
        setTooltip({ text: bio, x: e.clientX, y: e.clientY });
    };

    const filteredBooks = useMemo(() => {
        const term = searchTerm.toLowerCase().trim();
        let result = ARABIC_LIBRARY_DATABASE.filter(b => b.title.includes(term) || b.author.includes(term));
        
        if (sortBy === 'author') result = [...result].sort((a, b) => a.author.localeCompare(b.author, locale));
        else if (sortBy === 'subject') result = [...result].sort((a, b) => a.subject.localeCompare(b.subject, locale));
        else if (sortBy === 'audio') result = [...result].sort((a, b) => (b.audioId ? 1 : 0) - (a.audioId ? 1 : 0));
        else result = [...result].sort((a, b) => a.title.localeCompare(b.title, locale));
        
        return result;
    }, [searchTerm, sortBy, locale]);

    return (
        <div dir={dir} className="max-w-7xl mx-auto px-4 pb-40 relative z-10 font-black antialiased">
            
            {/* Glass Bio Tooltip */}
            {tooltip && (
                <div 
                    className="fixed pointer-events-none z-[300] bg-white/20 dark:bg-black/40 backdrop-blur-xl border border-white/30 p-5 rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200 max-w-xs"
                    style={{ left: tooltip.x + 15, top: tooltip.y + 15, transform: locale === 'ar' ? 'translateX(-100%)' : 'none' }}
                >
                    <p className="text-[9px] font-black text-red-600 uppercase mb-2 tracking-widest">{t('bioTitle')}</p>
                    <p className="text-xs font-bold text-slate-900 dark:text-white leading-relaxed">{tooltip.text}</p>
                </div>
            )}

            <div className="text-center mt-12 mb-20 animate-fade-up">
                <button onClick={() => navigate(-1)} className="absolute start-0 top-0 text-slate-400 hover:text-red-600 flex items-center gap-2 transition-all">
                    <span className="text-2xl">←</span> {t('back')}
                </button>
                <h1 className="text-4xl md:text-[6rem] font-black text-slate-950 dark:text-white tracking-tighter leading-none">
                    {t('pageTitle')}
                </h1>
                <div className="h-2 w-32 bg-[#00732f] mx-auto mt-8 rounded-full shadow-lg" />
            </div>

            <div className="sticky top-6 z-50 mb-16 px-2 md:px-0">
                <div className="glass-panel p-3 md:p-5 rounded-[2.5rem] md:rounded-[4rem] bg-white/80 dark:bg-slate-900/80 border-none shadow-2xl flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <input 
                            type="text" 
                            placeholder={t('searchPlaceholder')} 
                            className="w-full p-4 md:p-5 ps-12 bg-white dark:bg-black/40 text-slate-950 dark:text-white rounded-[1.5rem] md:rounded-[2.5rem] outline-none border-2 border-transparent focus:border-red-600 transition-all font-black"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <span className="absolute start-5 top-1/2 -translate-y-1/2 opacity-40">🔍</span>
                    </div>
                    <div className="flex gap-2">
                        <select 
                            value={sortBy} 
                            onChange={(e) => setSortBy(e.target.value)}
                            className="p-4 px-6 rounded-[1.5rem] md:rounded-[2.5rem] bg-white dark:bg-slate-800 font-black text-xs cursor-pointer border border-white/10 outline-none focus:border-red-600"
                        >
                            <option value="alphabetical">{t('alphabetical')}</option>
                            <option value="author">{t('authorSort')}</option>
                            <option value="subject">{t('subjectSort')}</option>
                            <option value="audio">{t('audioSort')}</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
                {filteredBooks.map((book) => (
                    <div key={book.id} onClick={() => setSelectedBook(book)} className="group relative glass-panel rounded-[2.5rem] p-1 cursor-pointer transition-all duration-500 hover:-translate-y-3 h-full animate-fade-up border-none shadow-lg">
                        <div className="relative overflow-hidden rounded-[2.4rem] bg-white/20 dark:bg-slate-900/40 backdrop-blur-md h-full flex flex-col">
                            <div className={`absolute top-0 start-0 w-1.5 h-full ${book.audioId ? 'bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.4)]' : 'bg-[#00732f] shadow-[0_0_15px_rgba(0,115,47,0.4)]'}`} />
                            <div className="p-8 relative z-10 flex-grow text-start">
                                <span className={`inline-block px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest mb-4 text-white ${book.audioId ? 'bg-red-600' : 'bg-[#00732f]'}`}>
                                    {book.subject}
                                </span>
                                <h2 className="font-black text-xl md:text-2xl text-slate-950 dark:text-white leading-tight mb-4 group-hover:text-red-600 transition-colors line-clamp-2">
                                    {book.title}
                                </h2>
                                <div className="flex items-center gap-2 opacity-60">
                                    <span className="text-sm">👤</span>
                                    <p className="text-[10px] font-bold uppercase truncate tracking-widest">{book.author}</p>
                                </div>
                            </div>
                            <div className="bg-black/5 dark:bg-white/5 py-5 px-8 border-t border-white/10 mt-auto flex items-center justify-between relative z-10">
                                <div className="text-[8px] font-black opacity-30 uppercase tracking-widest text-red-600">Saqr Digital</div>
                                <SchoolLogo />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} t={t} onAuthorHover={handleAuthorHover} />
        </div>
    );
};

export default ArabicLibraryInternalPage;
