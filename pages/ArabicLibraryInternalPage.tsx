import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useLanguage } from '../App';
import { useNavigate } from 'react-router-dom';

// --- قاعدة البيانات الكاملة (تم تصحيح مسارات الملفات المحلية) ---
const ARABIC_LIBRARY_DATABASE = [
    // الكتب التي لها ملفات صوتية محلية (تم إزالة كلمة public من المسار)
    { id: "AR_1", title: "مجموعة روايات أجاثا كريستي", author: "أجاثا كريستي", subject: "قصص بوليسية", publisher: "ناشرون متعددون", driveLink: "https://drive.google.com/drive/folders/1PZk0vPQrKXIgE0WmUXlEMcSzt_d94Q6u", bio: "ملكة الجريمة عالمياً، صاحبة الشخصيات الخالدة مثل هيركيول بوارو.", summary: "أضخم مجموعة لروايات التحقيق والغموض التي تتميز بحبكة عبقرية ونهايات صادمة." },
    { id: "AR_2", title: "أرض الإله", author: "أحمد مراد", subject: "أدب تاريخي", publisher: "دار الشروق", driveLink: "https://drive.google.com/file/d/1Q-dT9-g292nqv1N_PvlB2TnZMBdQGpio/view", bio: "كاتب ومصور مصري معاصر، تميز برواياته التي تمزج بين التاريخ والغموض.", summary: "رحلة تاريخية مثيرة في زمن الفراعنة تكشف أسراراً مخفية حول خروج بني إسرائيل.", audioId: "/audio/أرض الإله.mp3" },
    { id: "AR_3", title: "أرض النفاق", author: "يوسف السباعي", subject: "أدب خيالي", publisher: "مكتبة مصر", driveLink: "https://drive.google.com/file/d/14KCqI_ffiUg8if8uqs_vQ-oJIXBEsKD3/view", bio: "فارس الرومانسية المصرية، وزير ثقافة سابق، اشتهر بأسلوبه الساخر.", summary: "رواية رمزية ساخرة تنتقد الأخلاق الاجتماعية عبر فكرة بيع الأخلاق في دكاكين متخصصة." },
    { id: "AR_4", title: "أكواريل", author: "أحمد خالد توفيق", subject: "أدب خيالي", publisher: "دار سما للنشر والتوزيع", driveLink: "https://drive.google.com/file/d/1NLK9-pE6uoHU8po8BC8731KIZ3oc0qU5/view", bio: "عراب أدب الرعب العربي، أول كاتب عربي برع في أدب الإثارة للشباب.", summary: "مجموعة قصصية مشوقة تأخذنا إلى عوالم من الغموض الطبي والنفسي بأسلوب العراب الفريد.", audioId: "/audio/Aquarel.mp3" },
    { id: "AR_5", title: "الفيل الأزرق", author: "أحمد مراد", subject: "أدب خيالي", publisher: "دار الشروق", driveLink: "https://drive.google.com/file/d/1Vr0BCdRxRC4k9e8t7g5sqtfnW1BHZbTD/view", bio: "أحد أبرز الروائيين العرب حالياً، تحولت معظم أعماله إلى أفلام سينمائية ناجحة.", summary: "رحلة نفسية غامضة داخل مستشفى العباسية للأمراض العقلية، تمزج بين الواقع والهلوسة." },
    { id: "AR_6", title: "نائب عزارئيل", author: "يوسف السباعي", subject: "أدب خيالي", publisher: "مكتبة الإسكندرية", driveLink: "https://drive.google.com/file/d/1vC4PIAZ2ekJ-uU3wCE4zV70glD8VjDT0/view", bio: "أديب مصري راحل لقب بـ فارس الرومانسية وساهم في إثراء المكتبة العربية.", summary: "رواية فانتازيا فلسفية تتخيل شخصاً يقوم بدور عزرائيل، بأسلوب ساخر وعميق.", audioId: "/audio/نائب عزرائيل.mp3" },
    { id: "AR_7", title: "المكتبة الخضراء للأطفال", author: "مؤلفين", subject: "قصص للأطفال", publisher: "دار المعارف", driveLink: "https://drive.google.com/drive/folders/1AHrYDDPkocCEAnJXAfhbnTYtfkpcuUIn?usp=sharing", bio: "نخبة من كبار كتاب أدب الطفل صاغوا حكايات تربوية عالمية بأسلوب مشوق.", summary: "أشهر سلاسل القصص للأطفال، تهدف لغرس القيم النبيلة بأسلوب حكائي ورسوم جذابة." },
    { id: "AR_8", title: "أوقات عصيبة", author: "تشارلز ديكنز", subject: "قصص عالمية", publisher: "مكتبة الأنجلو المصرية", driveLink: "https://drive.google.com/file/d/1TxWYfZmTOjvpj5mjTeKBueUDHrEIViAB/view", bio: "أعظم الروائيين الإنجليز في العصر الفيكتوري، اشتهر بدفاعه عن الطبقات الفقيرة.", summary: "رواية كلاسيكية تستعرض الصراعات الاجتماعية في إنجلترا خلال الثورة الصناعية.", audioId: "/audio/اوقات عصيبة.mp3" },
    { id: "AR_9", title: "أوليفر تويسيت", author: "تشارلز ديكنز", subject: "قصص عالمية", publisher: "دار العلم للملايين", driveLink: "https://drive.google.com/file/d/1zkFntttQq6pzErlvPCKbmW8odDORoneJ/view", bio: "روائي عبقري رسم بكلماته ملامح الحياة في لندن القديمة.", summary: "حكاية اليتيم أوليفر ورحلته للبحث عن هويته وسط عالم من الجريمة والظلم." },
    { id: "AR_10", title: "الآمال الكبيرة", author: "تشارلز ديكنز", subject: "قصص عالمية", publisher: "مكتبة الأسرة 2000", driveLink: "https://drive.google.com/file/d/1aYWKfjB1fJu3CfII-yK55hM5qmt3ji5Y/view", bio: "سيد الرواية الاجتماعية الإنجليزية، يمتلك قدرة فريدة على رسم الشخصيات.", summary: "قصة الشاب بيب وطموحاته التي تتغير مع مرور الوقت في دراما إنسانية خالدة." },
    { id: "AR_11", title: "ترويض النمرة", author: "ويليام شيكسبير", subject: "قصص عالمية", publisher: "هنداوي", driveLink: "https://drive.google.com/file/d/1GjLXf2OvsdypCva9Uf34mbchFkYSjBtd/view", bio: "الشاعر والكاتب المسرحي الإنجليزي الأشهر، رائد الأدب العالمي.", summary: "كوميديا اجتماعية تتناول علاقات الزواج بأسلوب شيكسبيري ممتع ومليء بالمفارقات." },
    { id: "AR_12", title: "جعجعة بدون طحن", author: "ويليام شيكسبير", subject: "قصص عالمية", publisher: "دار نظير عبود", driveLink: "https://drive.google.com/file/d/1Myn0epkZJEkV2CQO_xaLpmJu6DFu0rrt/view", bio: "عبقري الكلمة الذي جسد النفس البشرية في كافة حالاتها.", summary: "مسرحية كوميدية تدور حول الحب والغيرة والمؤامرات بأسلوب ذكي وحوارات شيقة.", audioId: "/audio/جعجعة بدون طحن.mp3" },
    { id: "AR_13", title: "دايفيد كوبرفيلد", author: "تشارلز ديكنز", subject: "قصص عالمية", publisher: "مكتبة الأسرة 2000", driveLink: "https://drive.google.com/file/d/1MCmhkl0ul9zmZ7jvdaSKmG4bwLdHDRHz/view", bio: "ديكنز يروي جانباً من سيرته الذاتية المقنعة في هذه التحفة الروائية.", summary: "رحلة دايفيد من الطفولة البائسة إلى النجاح، وهي أكثر روايات ديكنز قرباً لقلبه." },
    { id: "AR_14", title: "دمبي وولده", author: "تشارلز ديكنز", subject: "قصص عالمية", publisher: "جداران المعرفة", driveLink: "https://drive.google.com/file/d/14ex-UE5dQDaZtdeQ9s4KUd0-YYH4_Lfh/view", bio: "كاتب برع في نقد قسوة الرأسمالية بأسلوب إنساني مؤثر.", summary: "رواية تتناول العلاقات الأسرية والغرور التجاري في العصر الفيكتوري اللندني.", audioId: "/audio/domby.mp3" },
    { id: "AR_15", title: "قصة مدينتين", author: "تشارلز ديكنز", subject: "قصص عالمية", publisher: "دار العلم للملايين", driveLink: "https://drive.google.com/file/d/1baMVDkz88y5uRMIp1Aj506WZPD5dpibU/view", bio: "ديكنز في قمته التاريخية يصور أحداث الثورة الفرنسية.", summary: "ملحمة تدور بين لندن وباريس، تجسد التضحية والحب في زمن الاضطرابات الكبرى." },
    { id: "AR_16", title: "هملت : أمير دانمركة", author: "ويليام شيكسبير", subject: "قصص عالمية", publisher: "دار المعارف", driveLink: "https://drive.google.com/file/d/1qWz0xEuQUqhGQtESVtVo_pmC4DLIP4L-/view", bio: "أعظم تراجيديا في تاريخ المسرح العالمي، تدرس حتى اليوم.", summary: "صراع الوجود والانتقام في عقل الأمير هملت: أكون أو لا أكون، تلك هي المسألة." },
    { id: "AR_17", title: "مذكرات بكوك", author: "تشارلز ديكنز", subject: "قصص عالمية", publisher: "هنداوي", driveLink: "https://drive.google.com/file/d/1_okaw0LTO6nSyLJrQrDHCOYCndk4wdgF/view", bio: "ديكنز الكوميدي، أول أعماله التي حققت شهرة واسعة.", summary: "مغامرات فكاهية لجمعية بكوك وأعضائها أثناء تجولهم في أرجاء إنجلترا." },
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
    { id: "AR_36", title: "حكايات الغرفة 207", author: "أحمد خالد توفيق", subject: "أدب خيالي", publisher: "إصدارات دايموند", driveLink: "https://drive.google.com/file/d/1Cy8w5xDHqtIc--F2ad77sePB1tcGkr3s/view", bio: "طبيب ومؤلف مصري رائد في الرعب، له الفضل في تشكيل وعي جيل كامل.", summary: "سلسلة قصص غامضة ومخيفة تدور أحداثها داخل غرفة فندقية مسكونة بالأسرار." },
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
        allSubjects: "المواضيع",
        allAuthors: "المؤلفين",
        sortBy: "فرز حسب",
        alphabetical: "أبجدياً (العنوان)",
        authorSort: "المؤلف",
        subjectSort: "الموضوع",
        read: "قراءة المحتوى",
        listen: "مشغل صقر الحصري",
        bioTitle: "حول المؤلف",
        summaryTitle: "ملخص صقر الذكي",
        back: "العودة",
        close: "إغلاق",
        locationLabel: "EFIPS",
        publisherLabel: "الناشر",
        audioBadge: "صوتي",
        audioOnly: "صوتيات فقط",
        playing: "جاري التشغيل",
        paused: "موقف مؤقت",
    },
    en: {
        pageTitle: "Arabic Library",
        searchPlaceholder: "Search title or author...",
        allSubjects: "Subjects",
        allAuthors: "Authors",
        sortBy: "Sort By",
        alphabetical: "Alphabetical (Title)",
        authorSort: "Author",
        subjectSort: "Subject",
        read: "Read Content",
        listen: "Saqr Exclusive Player",
        bioTitle: "About Author",
        summaryTitle: "Saqr AI Summary",
        back: "Back",
        close: "Close",
        locationLabel: "EFIPS",
        publisherLabel: "Publisher",
        audioBadge: "Audio",
        audioOnly: "Audio Only",
        playing: "Playing Now",
        paused: "Paused",
    }
};

const trackActivity = (type: 'searched' | 'digital' | 'ai', label: string) => {
    const logs = JSON.parse(localStorage.getItem('efips_activity_logs') || '[]');
    logs.push({ type, label, date: new Date().toISOString() });
    localStorage.setItem('efips_activity_logs', JSON.stringify(logs));
};

// --- مكون مشغل صقر الحصري الجديد (Saqr Exclusive Player Component) ---
const SaqrAudioPlayer: React.FC<{ audioSrc: string; t: any }> = ({ audioSrc, t }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    // دوال مساعدة لتنسيق الوقت (دقيقة:ثانية)
    const formatTime = (time: number) => {
        if (isNaN(time)) return "00:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) audioRef.current.pause();
            else audioRef.current.play();
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            const current = audioRef.current.currentTime;
            const dur = audioRef.current.duration;
            setCurrentTime(current);
            setProgress((current / dur) * 100);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    // التعامل مع النقر على شريط التقدم لتقديم/تأخير الصوت
    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (audioRef.current && e.currentTarget) {
            const clickPosition = (e.clientX - e.currentTarget.getBoundingClientRect().left) / e.currentTarget.offsetWidth;
            audioRef.current.currentTime = clickPosition * audioRef.current.duration;
        }
    };

    return (
        <div className="mt-6 sm:mt-8 p-4 sm:p-5 rounded-[2rem] bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border-2 border-red-600/20 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-700 group select-none">
            {/* عنصر الصوت المخفي */}
            <audio 
                ref={audioRef} 
                src={audioSrc} 
                onTimeUpdate={handleTimeUpdate} 
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
            />

            <div className="flex items-center gap-3 sm:gap-5">
                 {/* زر التشغيل النيوني */}
                <button 
                    onClick={togglePlay} 
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${isPlaying ? 'bg-red-600 text-white shadow-red-600/50 scale-105 animate-pulse' : 'bg-white dark:bg-slate-800 text-red-600 border-2 border-red-600/30 hover:border-red-600 hover:scale-105 hover:shadow-red-600/30'}`}
                >
                    {isPlaying ? (
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                    ) : (
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 ps-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    )}
                </button>

                <div className="flex-1 flex flex-col justify-center gap-1.5 sm:gap-2">
                    {/* حالة التشغيل والوقت */}
                    <div className="flex justify-between items-center text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-2">
                             <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-red-600 animate-ping' : 'bg-slate-400'}`}></span>
                             <span className={isPlaying ? 'text-red-600' : ''}>{isPlaying ? t('playing') : t('paused')}</span>
                        </div>
                        <div className="flex gap-1 tabular-nums">
                            <span>{formatTime(currentTime)}</span> / <span>{formatTime(duration)}</span>
                        </div>
                    </div>

                    {/* شريط التقدم التفاعلي */}
                    <div 
                        className="relative h-2 sm:h-2.5 w-full bg-slate-200 dark:bg-slate-700/50 rounded-full overflow-hidden cursor-pointer group-hover:h-3 transition-all duration-300"
                        onClick={handleProgressClick}
                    >
                        {/* الخلفية المتدرجة */}
                        <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-600/80 to-red-500/80 transition-all duration-150 ease-out shadow-[0_0_10px_rgba(220,38,38,0.5)]" style={{ width: `${progress}%` }}>
                            {/* مؤشر النهاية المضيء */}
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- نافذة الكتاب المحدثة ---
const BookModal: React.FC<{ book: any | null; onClose: () => void; t: any; onAuthorHover: (e: React.MouseEvent, bio: string | null) => void }> = ({ book, onClose, t, onAuthorHover }) => {
    if (!book) return null;
    
    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-2 sm:p-4 backdrop-blur-3xl animate-in fade-in duration-500" onClick={onClose}>
            <div className="glass-panel w-full max-w-4xl rounded-[2rem] sm:rounded-[3rem] border-none shadow-2xl overflow-y-auto max-h-[92vh] md:overflow-hidden relative animate-in zoom-in-95 duration-500 flex flex-col md:flex-row bg-white/95 dark:bg-slate-950/95" onClick={(e) => e.stopPropagation()}>
                
                <button onClick={onClose} className="absolute top-3 end-3 sm:top-6 sm:end-6 z-50 p-2 bg-red-600 text-white rounded-full hover:scale-110 active:scale-90 transition-all shadow-lg">
                    <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}><path d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <div className="flex-1 p-6 sm:p-14 flex flex-col justify-center border-b md:border-b-0 md:border-e border-slate-200 dark:border-white/10 text-start font-black overflow-y-auto no-scrollbar">
                    <div className="mb-6">
                        <span className="inline-block px-3 py-1 rounded-lg text-[8px] sm:text-[9px] font-black uppercase tracking-widest mb-4 bg-green-600 text-white shadow-md">{book.subject}</span>
                        <h2 className="text-2xl sm:text-5xl font-black text-slate-950 dark:text-white leading-[1.1] mb-2 sm:mb-3 tracking-tighter">{book.title}</h2>
                        <p onMouseMove={(e) => onAuthorHover(e, book.bio)} onMouseLeave={(e) => onAuthorHover(e, null)} className="text-lg sm:text-xl text-red-600 dark:text-red-500 font-bold hover:text-slate-950 dark:hover:white transition-colors inline-block cursor-help border-b-2 border-dotted border-slate-300">By {book.author}</p>
                    </div>
                    
                    <div className="bg-slate-100/50 dark:bg-white/5 p-5 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-white/10 text-start mb-6">
                        <p className="text-[9px] sm:text-[10px] text-red-600 font-black uppercase mb-2 sm:mb-3 tracking-widest flex items-center gap-2">
                            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-red-600 rounded-full animate-pulse shadow-lg"></span> {t('summaryTitle')}
                        </p>
                        <p className="text-slate-800 dark:text-slate-200 text-base sm:text-lg font-medium leading-relaxed italic line-clamp-6 sm:line-clamp-none">"{book.summary}"</p>
                    </div>

                    {/* استدعاء المشغل الحصري الجديد إذا كان الملف موجوداً */}
                    {book.audioId && (
                        <>
                            <div className="flex items-center gap-2 mb-2 animate-fade-up">
                                <span className="text-lganimate-bounce text-red-600">🎧</span>
                                <span className="text-[9px] font-black text-red-600 uppercase tracking-widest">{t('listen')}</span>
                            </div>
                            <SaqrAudioPlayer audioSrc={book.audioId} t={t} />
                        </>
                    )}
                </div>

                <div className="w-full md:w-[280px] lg:w-[320px] bg-slate-950 dark:bg-black p-8 sm:p-10 flex flex-col justify-center items-center text-center text-white relative font-black shrink-0">
                    <div className="space-y-6 sm:space-y-10 relative z-10 w-full">
                        <div>
                            <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 sm:mb-8">{t('locationLabel')}</p>
                            <a href={book.driveLink} target="_blank" rel="noopener noreferrer" onClick={() => trackActivity('digital', book.title)} className="w-full bg-red-600 text-white font-black py-4 sm:py-6 rounded-2xl flex items-center justify-center gap-3 hover:bg-red-700 active:scale-95 shadow-xl transition-all shadow-red-600/30"><span className="text-sm sm:text-xl uppercase tracking-widest">{t('read')}</span></a>
                        </div>
                        <button onClick={onClose} className="w-full bg-white/10 text-white border border-white/20 font-black py-3 sm:py-4 rounded-xl active:scale-95 text-[10px] sm:text-xs uppercase tracking-widest transition-all hover:bg-white hover:text-black">{t('close')}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- كارت الكتاب مع أنيميشن الصوت ---
const BookCard = React.memo(({ book, onClick, t, onAuthorHover }: { book: any; onClick: () => void; t: any; onAuthorHover: (e: React.MouseEvent, bio: string | null) => void }) => (
    <div onClick={() => { trackActivity('searched', book.title); onClick(); }} 
         className={`group relative glass-panel bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border-none rounded-[2rem] sm:rounded-[2.5rem] transition-all duration-500 cursor-pointer flex flex-col h-full overflow-hidden shadow-lg hover:shadow-2xl active:scale-[0.98] md:active:scale-95 hover:-translate-y-1 md:hover:-translate-y-2 
         ${book.audioId ? 'ring-2 ring-red-600/20 dark:ring-red-500/10 shadow-[0_15px_40px_rgba(220,38,38,0.05)]' : ''}`}>
        
        <div className={`absolute top-0 start-0 w-1.5 h-full ${book.audioId ? 'bg-red-600 shadow-[2px_0_15px_rgba(220,38,38,0.4)]' : 'bg-green-600 shadow-[2px_0_15px_rgba(34,197,94,0.4)]'}`}></div>

        <div className="p-6 sm:p-9 flex-grow text-start font-black relative">
            {book.audioId && (
                <div className="absolute top-5 end-5 flex items-center gap-1.5 bg-red-600/10 px-2 py-1 rounded-lg">
                    <div className="flex gap-0.5 h-3 items-end mb-0.5">
                        <div className="w-0.5 sm:w-1 bg-red-600 rounded-full animate-eq-1"></div>
                        <div className="w-1 bg-red-600 rounded-full animate-eq-2"></div>
                        <div className="w-1 bg-red-600 rounded-full animate-eq-3"></div>
                    </div>
                    <span className="text-[7px] sm:text-[9px] font-black uppercase tracking-tighter text-red-600 animate-pulse">{t('audioBadge')}</span>
                </div>
            )}

            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest mb-4 text-white shadow-lg ${book.audioId ? 'bg-red-600' : 'bg-green-600'}`}>{book.subject}</span>
            <h2 className="font-black text-lg sm:text-2xl text-slate-950 dark:text-white leading-tight mb-2 sm:mb-3 tracking-tighter line-clamp-2">{book.title}</h2>
            <div className="flex items-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                <span className="text-sm">👤</span>
                <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-bold hover:text-red-600 transition-all inline-block underline decoration-dotted underline-offset-4 cursor-help">By {book.author}</p>
            </div>
        </div>
        
        <div className="bg-slate-50/50 dark:bg-black/40 py-3 sm:py-4 px-6 sm:px-8 border-t border-slate-100 dark:border-white/5 mt-auto flex items-center justify-between font-black text-[9px] sm:text-[10px]">
             <div className="flex items-center gap-2 opacity-50">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                <span className="truncate max-w-[100px]">{book.publisher}</span>
            </div>
            <p className="font-black text-slate-900 dark:text-white uppercase tracking-[0.3em] opacity-30 group-hover:opacity-100 transition-all">EFIPS</p>
        </div>
    </div>
));

const ArabicLibraryInternalPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const navigate = useNavigate();
    const isAr = locale === 'ar';
    const t = (key: keyof typeof translations.ar) => translations[locale][key];

    const [searchTerm, setSearchTerm] = useState('');
    const [subjectFilter, setSubjectFilter] = useState('all');
    const [authorFilter, setAuthorFilter] = useState('all');
    const [sortBy, setSortBy] = useState('alphabetical');
    const [selectedBook, setSelectedBook] = useState<any>(null);
    const [tooltip, setTooltip] = useState<{ text: string, x: number, y: number } | null>(null);
    const [showAudioOnly, setShowAudioOnly] = useState(false);

    const handleAuthorHover = (e: React.MouseEvent, bio: string | null) => {
        if (!bio || window.innerWidth < 768) { setTooltip(null); return; }
        setTooltip({ text: bio, x: e.clientX, y: e.clientY - 40 });
    };

    const filters = useMemo(() => ({
        subjects: ["all", ...new Set(ARABIC_LIBRARY_DATABASE.map(b => b.subject))].sort(),
        authors: ["all", ...new Set(ARABIC_LIBRARY_DATABASE.map(b => b.author))].sort()
    }), []);

    const filteredBooks = useMemo(() => {
        const term = searchTerm.toLowerCase().trim();
        let result = ARABIC_LIBRARY_DATABASE.filter(b => {
            const matchesTerm = !term || b.title.includes(term) || b.author.includes(term);
            const matchesSub = subjectFilter === 'all' || b.subject === subjectFilter;
            const matchesAuth = authorFilter === 'all' || b.author === authorFilter;
            const matchesAudio = showAudioOnly ? !!b.audioId : true;
            return matchesTerm && matchesSub && matchesAuth && matchesAudio;
        });
        if (sortBy === 'alphabetical') result = [...result].sort((a, b) => a.title.localeCompare(b.title, locale));
        else if (sortBy === 'author') result = [...result].sort((a, b) => a.author.localeCompare(b.author, locale));
        else if (sortBy === 'subject') result = [...result].sort((a, b) => a.subject.localeCompare(b.subject, locale));
        return result;
    }, [searchTerm, subjectFilter, authorFilter, sortBy, showAudioOnly, locale]);

    return (
        <div dir={dir} className="max-w-7xl mx-auto px-2 sm:px-4 pb-20 sm:pb-32 relative z-10 text-start antialiased font-black">
            {tooltip && (
                <div className="fixed pointer-events-none z-[200] glass-panel px-6 py-3 rounded-2xl border-white/40 shadow-2xl animate-in fade-in zoom-in duration-200 max-w-xs transition-opacity" style={{ left: tooltip.x, top: tooltip.y, transform: 'translate(-50%, -100%)' }}>
                    <p className="text-[10px] font-black text-red-600 uppercase mb-2 tracking-widest">{t('bioTitle')}</p>
                    <p className="text-xs font-black text-slate-900 dark:text-white leading-relaxed">{tooltip.text}</p>
                </div>
            )}

            <div className="text-center mt-8 sm:mt-12 mb-10 sm:mb-24 relative animate-fade-up">
                <button onClick={() => navigate(-1)} className="absolute start-0 top-1/2 -translate-y-1/2 flex items-center gap-2 sm:gap-3 text-slate-400 hover:text-red-600 transition-colors group">
                    <svg className={`h-6 w-6 sm:h-7 sm:w-7 transform group-hover:-translate-x-1 ${isAr ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}><path d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest hidden xs:inline">{t('back')}</span>
                </button>
                <h1 className="text-3xl sm:text-5xl md:text-[8rem] font-black text-slate-950 dark:text-white tracking-tighter leading-none drop-shadow-2xl">{t('pageTitle')}</h1>
                <div className="h-1.5 sm:h-2 w-20 sm:w-32 bg-green-600 mx-auto mt-6 sm:mt-8 rounded-full shadow-[0_0_20px_rgba(34,197,94,0.5)]"></div>
            </div>

            <div className="sticky top-16 sm:top-20 z-50 mb-10 sm:mb-16 animate-fade-up px-1 sm:px-0">
                <div className="glass-panel p-2 sm:p-5 rounded-[1.5rem] sm:rounded-[3.5rem] shadow-2xl border-none backdrop-blur-3xl max-w-6xl mx-auto bg-white/90 dark:bg-slate-900/80">
                    <div className="flex flex-col lg:flex-row gap-2 sm:gap-4 items-center">
                        <div className="w-full lg:flex-[3] relative">
                            <input type="text" placeholder={t('searchPlaceholder')} className="w-full p-3 sm:p-4 ps-10 sm:ps-14 bg-slate-100/50 dark:bg-black/40 text-slate-950 dark:text-white border-2 border-transparent focus:border-red-600 rounded-xl sm:rounded-3xl outline-none transition-all font-black text-sm sm:text-base shadow-inner" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            <svg className="absolute start-3 sm:start-5 top-1/2 -translate-y-1/2 h-5 w-5 sm:h-6 sm:w-6 text-green-600 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        <div className="w-full lg:flex-[5] grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
                            <button onClick={() => setShowAudioOnly(!showAudioOnly)}
                                className={`p-2.5 sm:p-3 rounded-lg sm:rounded-2xl font-black text-[8px] sm:text-xs transition-all flex items-center justify-center gap-1 sm:gap-2 border shadow-sm
                                ${showAudioOnly ? 'bg-red-600 text-white border-red-600 shadow-red-600/30' : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-100 dark:border-white/5 hover:border-red-600'}`}>
                                <span className={showAudioOnly ? 'animate-pulse' : ''}>🎧</span> {t('audioOnly')}
                            </button>
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="p-2.5 sm:p-3 rounded-lg sm:rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 font-black text-[8px] sm:text-xs cursor-pointer outline-none focus:border-red-600 appearance-none text-center shadow-md">
                                <option value="alphabetical">{t('alphabetical')}</option>
                                <option value="author">{t('authorSort')}</option>
                                <option value="subject">{t('subjectSort')}</option>
                            </select>
                            <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} className="p-2.5 sm:p-3 rounded-lg sm:rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 font-black text-[8px] sm:text-xs cursor-pointer outline-none focus:border-green-600 appearance-none text-center shadow-md">
                                <option value="all">{t('allSubjects')}</option>
                                {filters.subjects.map(o => o !== "all" && <option key={o} value={o}>{o}</option>)}
                            </select>
                            <select value={authorFilter} onChange={(e) => setAuthorFilter(e.target.value)} className="p-2.5 sm:p-3 rounded-lg sm:rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 font-black text-[8px] sm:text-xs cursor-pointer outline-none focus:border-green-600 appearance-none text-center shadow-md">
                                <option value="all">{t('allAuthors')}</option>
                                {filters.authors.map(o => o !== "all" && <option key={o} value={o}>{o}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8 md:gap-12 animate-fade-up">
                {filteredBooks.map((book) => (
                    <BookCard key={book.id} book={book} t={t} onClick={() => setSelectedBook(book)} onAuthorHover={handleAuthorHover} />
                ))}
            </div>

            <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} t={t} onAuthorHover={handleAuthorHover} />

            <style>{`
                @keyframes eq { 0%, 100% { height: 4px; } 50% { height: 14px; } }
                .animate-eq-1 { animation: eq 0.6s ease-in-out infinite; }
                .animate-eq-2 { animation: eq 0.8s ease-in-out infinite 0.2s; }
                .animate-eq-3 { animation: eq 0.7s ease-in-out infinite 0.4s; }
                /* إخفاء شريط التمرير في النافذة المنبثقة */
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
};

export default ArabicLibraryInternalPage;
