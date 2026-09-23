import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useLanguage } from '../App';
import { useNavigate } from 'react-router-dom';
import { trackActivity } from '../src/utils/tracker';

// --- 1. قاعدة البيانات ---
export const ARABIC_LIBRARY_DATABASE = [
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
    { id: "AR_23", title: "قصص الأنبياء ومعها سيرة الرسول صلى الله عليه وسلم", author: "محمد متولي الشعراوي", subject: "قصص الأنبياء", publisher: "دار القدس", driveLink: "https://drive.google.com/file/d/1QNUYu7lHEh9FdoBD8gptW14jEmFqBspb/view?usp=drive_link", bio: "إمام الدعاة، اشتهر بخواطره الإيمانية وتفسيره الميسر للقرآن.", summary: "رحلة إيمانية في سير الأنبياء وخاتم المرسلين بأسلوب الشيخ الشعراوي العذب." },
    { id: "AR_24", title: "قصص الأنبياء للأطفال", author: "محمود المصري", subject: "قصص الأنبياء", publisher: "مكتبة الصفا", driveLink: "https://drive.google.com/file/d/1t6mWRohKvE0RmqI9TcM7JqtD07bGWqkm/view?usp=drive_link", bio: "داعية إسلامي متخصص في تبسيط العلوم الشرعية للصغار.", summary: "مجموعة قصصية تربوية تعرف الأطفال بسير الأنبياء بأسلوب سهل ورسوم جذابة." },
    { id: "AR_25", title: "قصص الحيوان في القرآن", author: "أحمد بهجت", subject: "أدب إسلامي", publisher: "دار الشروق", driveLink: "https://drive.google.com/file/d/1N9pbgYG1qLrfiwLEnUeiAFL8tFdcOksr/view?usp=drive_link", bio: "أديب برع في استنطاق كائنات الطبيعة لتقديم دروس إيمانية.", summary: "حكايات ممتعة على لسان الحيوانات التي ذكرت في القرآن الكريم، تحمل حكماً بليغة." },
    { id: "AR_26", title: "شرح الأربعين النووية", author: "عبد الرؤوف المناوي", subject: "كتب سنة", publisher: "دار الضياء", driveLink: "https://drive.google.com/file/d/1L6-Q83l5OdNujMAjJ2UtxxG-a04hvyPE/view?usp=drive_link", bio: "فقيه ومحدث مصري، صاحب المصنفات العظيمة في شرح السنة.", summary: "شرح وافٍ للأحاديث الأربعين التي جمعها الإمام النووي، والتي تعد أصول الدين." },
    { id: "AR_27", title: "صحيح البخاري", author: "البخاري", subject: "كتب سنة", publisher: "دار ابن كثير", driveLink: "https://drive.google.com/file/d/1j7rtHR8fP3et3p1cQ8fB15Wb4Of8GBnG/view", bio: "الإمام محمد بن إسماعيل البخاري، صاحب أصح كتاب بعد القرآن.", summary: "الجامع المسند الصحيح لأقوال وأفعال وتقارير النبي صلى الله عليه وسلم." },
    { id: "AR_28", title: "صحيح مسلم", author: "مسلم", subject: "كتب سنة", publisher: "دار الحديث", driveLink: "https://drive.google.com/file/d/1k3nMYrD9V40GGP2BDJ18IinXBWXbL-04/view", bio: "الإمام مسلم بن الحجاج، أحد كبار علماء الحديث النبوي.", summary: "ثاني أصح الكتب في الحديث النبوي، مرتباً ترتيباً فقهياً دقيقاً وشاملاً." },
    { id: "AR_29", title: "الأب الغني والأب الفقير", author: "روبرت كيوساكي", subject: "تنمية بشرية", publisher: "مكتبة جرير", driveLink: "https://drive.google.com/file/d/17S2yXqeKbybMCdpuxV_vZU3McSarrp-1/view", bio: "رجل أعمال ومستثمر أمريكي، أحدث ثورة في الثقافة المالية.", summary: "كتاب يعلمك الفرق بين الأصول والالتزامات، وكيف تبدأ رحلتك نحو الاستقلال المالي." },
    { id: "AR_30", title: "الرقص مع الحياة", author: "مهدي الموسوي", subject: "تنمية بشرية", publisher: "مدارك", driveLink: "https://drive.google.com/file/d/1GNcOcjbcGARMXTMh0A0wYnaOxDHQ2ivt/view", bio: "باحث وكاتب كويتي، يركز في كتاباته على السعادة الداخلية السلام.", summary: "دعوة ملهمة لعيش الحياة ببهجة وسلام، متجاوزاً العقبات الروحية والنفسية." },
    { id: "AR_31", title: "المفاتيح العشرة للنجاح", author: "إبراهيم الفقي", subject: "تنمية بشرية", publisher: "غير محدد", driveLink: "https://drive.google.com/file/d/1Oi25K6qOcePeORTEFaev4dFkWGFonwdf/view", bio: "خبير التنمية البشرية والبرمجة اللغوية العصبية، رائد هذا المجال عربياً.", summary: "دليل عملي يحتوي على أهم القواعد والخطوات لتحقيق النجاح في كافة مجالات الحياة." },
    { id: "AR_32", title: "خوارق اللاشعور", author: "علي الوردي", subject: "تنمية بشرية", publisher: "الوراق", driveLink: "https://drive.google.com/file/d/1_8qsQrkCoIDFJbFD1lB7be6JpOApErLR/view", bio: "عالم اجتماع عراقي شهير، عرف بتحليله النفسي والاجتماعي العميق.", summary: "دراسة في طبيعة النفس البشرية وتأثير اللاشعور على سلوك الفرد والمجتمع." },
    { id: "AR_33", title: "قوة الآن", author: "إيكهارت تول", subject: "تنمية بشرية", publisher: "دار علاء الدين", driveLink: "https://drive.google.com/file/d/1_jmXl_PDCqU1ElBcJZGYLoUIydM32mec/view", bio: "معلم روحي عالمي، يركز على العيش في اللحظة الحاضرة.", summary: "دليل للتنوير الروحي عبر التخلص من آلام الماضي وقلق المستقبل والعيش الآن." },
    { id: "AR_34", title: "أربعون", author: "أحمد الشقيري", subject: "تنمية بشرية", publisher: "الدار العربية للعلوم", driveLink: "https://drive.google.com/file/d/1IFeA8ElveWPYWKuiWQIhR4zdmZPSwKa0/view", bio: "إعلامي سعودي متميز، اشتهر ببرامج تحسين المجتمع فكرياً.", summary: "خواطر وتجارب شخصية كتبها الشقيري خلال خلوته، تلخص أهم دروس الحياة." },
    { id: "AR_35", title: "كيف تكسب الأصدقاء وتؤثر في الناس", author: "ديل كارنيجي", subject: "تنمية بشرية", publisher: "الأهلية", driveLink: "https://drive.google.com/file/d/168TUXU8P_5HcFmSKkrctOOFX0HG30Vbr/view", bio: "أشهر كاتب في تطوير العلاقات الإنسانية والمهارات القيادية عالمياً.", summary: "الكتاب المرجعي في فن التواصل الاجتماعي وبناء علاقات ناجحة ومؤثرة." },
    { id: "AR_36", title: "حكايات الغرفة 207", author: "أحمد خالد توفيق", subject: "أدب خيالي", publisher: "إصدارات دايموند", driveLink: "https://drive.google.com/file/d/1Cy8w5xDHqtIc--F2ad77sePB1tcGkr3s/view", bio: "طبيب ومؤلف مصري رائد في الرعب، له الفضل في تشكيل وعي جيل كامل.", summary: "سلسلة قصص غامضة ومخيفة تدور أحداثها داخل غرفة فندقية مسكونة بالأسرار.", audioId: "/audio/الغرفة207.mp3" },
    { id: "AR_37", title: "يوتوبيا", author: "أحمد خالد توفيق", subject: "أدب خيالي", publisher: "دار ميريت", driveLink: "https://drive.google.com/file/d/1hH9elAOnS9pRccxnFad4-vym_px-DbX1/view", bio: "العراب الذي برع في التنبؤ بالمستقبل عبر روايات الديستوبيا.", summary: "رواية سوداوية تتخيل العالم منقسم بين طبقتين: طبقة غنية منعزلة وطبقة مسحوقة.", audioId: "/audio/يوتوبيا.mp3" },
    { id: "AR_38", title: "خلف أسوار العقل", author: "نبيل فاروق", subject: "أدب خيالي", publisher: "المبدعون", driveLink: "https://drive.google.com/file/d/14p7eM2uBYrmYs3xuNRg1tNGXFBegW-ZM/view", bio: "رائد أدب الخيال العلمي، تميزت أعماله بالسرعة والتشويق الذهني.", summary: "مجموعة مقالات وقصص تتناول أسرار العقل البشري والظواهر الغريبة بأسلوب علمي.", audioId: "/audio/العقل.mp3" },
    { id: "AR_39", title: "انهم يأتون ليلا", author: "خالد أمين", subject: "أدب خيالي", publisher: "دار دون", driveLink: "https://drive.google.com/file/d/1M4LYoDVUunT7utYTqJD-6rXkAxQlrH_Y/view", bio: "كاتب مصري متميز في أدب الرعب والجريمة، يجمع بين الغموض والتشويق.", summary: "رواية رعب نفسية تدور حول مخاوف الإنسان وما يختبئ في الظلام بانتظارنا.", audioId: "/audio/انهم ياتون ليلا.mp3" },
    { id: "AR_40", title: "الذين كانوا", author: "نبيل فاروق", subject: "أدب خيالي", publisher: "سبارك للنشر والتوزيع", driveLink: "https://drive.google.com/file/d/1dDnEc6sG2LKVQDKlIw6ZL0x4lNKJtNOs/view", bio: "أديب الملايين الذي أثرى المكتبة العربية بمئات روايات الجيب.", summary: "قصص خيالية مثيرة حول حضارات بائدة وكائنات مجهولة تعود للظهور.", audioId: "/audio/اللذين كانوا.mp3" },
    { id: "AR_41", title: "ألف اختراع واختراع", author: "رولاند جاكسون", subject: "التراث العربي", publisher: "ناشونال جيوجرافيك", driveLink: "https://drive.google.com/file/d/1_4IKkimJy1MmApcRz_0HA9_wKWy6H-Mp", bio: "باحث ومؤرخ اهتم بإبراز الإسهامات العلمية للحضارة الإسلامية.", summary: "موسوعة مصورة مذهلة تستعرض الإنجازات العلمية الإسلامية التي شكلت عالمنا الحديث." },
    { id: "AR_42", title: "سلطان وقصص القرآن", author: "وائل عادل", subject: "أدب إسلامي", publisher: "مركز الوجدان الحضاري - وزارة الثقافة دولة قطر", driveLink: "https://drive.google.com/drive/folders/1FfcyIwRkO-Nn_Gq1RzPtDGfLG4mQwXSZ?usp=drive_link", bio: "ينطلق مركز الوجدان الحضاري من فكرة أساسية وهي: أن وجدان أي أمة هو ضميرها ومشاعرها وطريقة تكوينها الفكري والعاطفي.", summary: "مجموعة قصصية لغرس القيم بوجدان الأطفال بطريقة مشوقة، عبر بطل القصص الطائر “سلطان”." },
    { id: "AR_43", title: "3D قصص الأنبياء", author: "متنوع", subject: "أدب إسلامي", publisher: "New Horizon", driveLink: "https://drive.google.com/drive/folders/1xZ6XqVdf_OG-tRf8068Q6VXrAPz7obQW?usp=drive_link", bio: "شركة متخصصة في كتب الأطفال والمناهج التعليمية العربية والإنجليزية.", summary: "مجموعة كتب تضم رسوماً كرتونية بتقنية ثلاثية الأبعاد تشرح قصص الأنبياء المذكورين في القرآن الكريم بأسلوب شيق." },
    { id: "AR_44", title: "الفيزياء للصغار", author: "ليونيد سيكوروك", subject: "علوم", publisher: "دار مير للطباعة والنشر", driveLink: "https://drive.google.com/file/d/1l_-lECWoN0C3ARPD70oaD_4Ee3J6wb3p/view?usp=drive_link", bio: "مؤلف روسي معروف بكتابه المبسط في الفيزياء للأطفال.", summary: "يُعد هذا الكتاب مثالاً لجهود تبسيط العلوم لغير المتخصصين، وحظي بتقدير واسع النطاق في الأوساط العربية." },
    { id: "AR_45", title: "أعظم 100عالم غيروا العالم", author: "جون بالتشين", subject: "علوم", publisher: "دار الكتب العلمية", driveLink: "https://drive.google.com/file/d/1aOHxire8Y9UWIdV6cO0Hc1nw2VWpEBYf/view?usp=drive_link", bio: "كاتب ومؤلف بريطاني متخصص في تبسيط العلوم وتاريخها.", summary: "يسرد الكتاب جذور الاكتشافات العلمية الحديثة بحيث يذكر مختلف العلماء وما ساهموا في اكتشافه." },
    { id: "AR_46", title: "أرض زيكولا", author: "عمرو عبدالحميد", subject: "أدب خيالي", publisher: "عصير الكتب", driveLink: "https://drive.google.com/file/d/1Mihna00ArISLe5SUifUemqbU3HoVIIEa/view?usp=drive_link", bio: "كاتب وطبيب مصري بارز، يُعد من أشهر روائيي الفنتازيا والخيال في الوطن العربي.", summary: "شاب عادي يدخل سرداب فوريك الغامض ليجد نفسه في عالم يتعامل بوحدات الذكاء بدلاً من المال.", audioId: "/audio/Zkola.mp3" },
    { id: "AR_47", title: "أماريتا", author: "عمرو عبدالحميد", subject: "أدب خيالي", publisher: "عصير الكتب", driveLink: "https://drive.google.com/file/d/17ultoN_mUJaG360jAp6t4JtXkQQoNKUS/view?usp=drive_link", bio: "كاتب وطبيب مصري بارز، يُعد من أشهر روائيي الفنتازيا والخيال في الوطن العربي.", summary: "الطبيبة أسيل تُتهم بالخيانة العظمى لقوانين زيكولا، وتُجبر على الهروب من مدينتها.", audioId: "/audio/Amarita.mp3" },
    { id: "AR_48", title: "وادي الذئاب المنسية", author: "عمرو عبدالحميد", subject: "أدب خيالي", publisher: "عصير الكتب", driveLink: "https://drive.google.com/file/d/1UeaCT1D75jpzjESxUw-ztusUvBrXXV4Q/view?usp=drive_link", bio: "كاتب وطبيب مصري بارز، يُعد من أشهر روائيي الفنتازيا والخيال في الوطن العربي.", summary: "يامن يخوض مغامرة كبرى في عالم زيكولا وأماريتا بعد سنوات من نهاية أحداث الجزء السابق.", audioId: "/audio/Wolf.mp3" },
    { id: "AR_49", title: "جلسات نفسية", author: "محمد إبراهيم", subject: "تنمية بشرية", publisher: "عصير الكتب", driveLink: "https://drive.google.com/file/d/1rvbFWFmgQ65Ufub-6tC-AeuqCYiNOW82/view?usp=drive_link", bio: "كاتب وأخصائي في علم النفس،​​ يتميز بقدرته على تبسيط المفاهيم النفسية وتقديمها بأسلوب سلس.", summary: "مجموعة من الجلسات النفسية التي تهدف إلى تحسين الصحة النفسية وتعزيز الرفاهية بأساليب فعالة." },
    { id: "AR_50", title: "كليلة ودمنة", author: "عبدالله بن المقفع", subject: "أدب خيالي", publisher: "هنداوي", driveLink: "https://drive.google.com/file/d/1manKVHamsvHDO-37IxmecGeKOtKxpJhB/view?usp=drive_link", bio: "أديب ومفكر عبقري من العصر العباسي، اشتهر ببلاغته الاستثنائية ودوره المحوري في نقل الحكمة الفارسية.", summary: "كتاب قصصي ذو أصول هندية تدور أحداثه على ألسنة الحيوانات والطيور لتقديم نصائح وحكم.", audioId: "/audio/كليلة.mp3" },
    { id: "AR_51", title: "مغامرات جحا", author: "مؤلفون", subject: "أدب عربي/تراث", publisher: "المؤسسة العربية الحديثة", driveLink: "https://drive.google.com/drive/folders/1WCsXruxkyuiG-QV6iXFGMemtwv6vvq3-?usp=drive_link", bio: "مجموعة من المؤلفين العرب", summary: "قصص فكاهية تعكس ذكاءً فطرياً وسخرية فلسفية من مواقف الحياة اليومية، حيث يتقمص جحا دور الأحمق ليعطي دروساً عميقة وحكماً بليغة." },
    { id: "AR_52", title: "أخلاقيات الذكاء الاصطناعي", author: "مارك كوكلبيرج", subject: "تكنولوجيا", publisher: "هنداوي", driveLink: "https://drive.google.com/file/d/1A98xA-eWvm8Z_Gktfg-XmSLmT0Xkz9wB/view?usp=drive_link", bio: "أستاذ فلسفة الإعلام والتكنولوجيا في جامعة فيينا بفرنسا، وعضو في مجموعات استشارية رفيعة المستوى حول الذكاء الاصطناعي لدى المفوضية الأوروبية. يُعرف بقدرته على ربط الأسئلة الفلسفية العميقة بالتحديات التقنية والسياسية الراهنة.", summary: "يُعد كتاب أخلاقيات الذكاء الاصطناعي (AI Ethics)، الصادر ضمن سلسلة MIT Press Essential Knowledge ، أحد أهم المراجع الحديثة التي تُفند المعضلات الأخلاقية الناتجة عن تطور التقنيات الذكية بأسلوب فلسفي وعملي في آن واحد." },
    { id: "AR_53", title: "التفكير الحوسبي", author: "بيتر جيه دنينج ، ماتي تيدري", subject: "تكنولوجيا", publisher: "هنداوي", driveLink: "https://drive.google.com/file/d/1X0h06VJmX9BUWhZsDPx6TTGIDdV6YzsK/view?usp=drive_link", bio: "بيتر جيه دنينج (Peter J. Denning): أحد رواد علوم الحاسوب، ورئيس سابق لجمعية آلات بمساهمات تأسيسية في أنظمة التشغيل والشبكات", summary: "يُعد كتاب التفكير الحوسبي (Computational Thinking)، وهو أيضاً جزء من سلسلة MIT Press Essential Knowledge، مرجعاً أساسياً لفهم كيف غيرت علوم الحاسوب الطريقة التي نحل بها المشكلات، ليس فقط في البرمجة، بل في مختلف مجالات الحياة." },
    { id: "AR_54", title: "الدماغ المبتكر", author: "مين جونج", subject: "تكنولوجيا", publisher: "هنداوي", driveLink: "https://drive.google.com/file/d/1GZpt4CrcZomX4WHyoh6E2HcOdjrDCsBE/view?usp=drive_link", bio: "هو باحث متخصص في علوم الدماغ والذكاء، يركز في دراساته على كيفية تحويل العمليات العصبية المعقدة إلى مهارات عملية يمكن للإنسان استخدامها لتطوير قدراته الإبداعية وتوليد أفكار غير تقليدية.", summary: "يدحض الكتاب فكرة أن الإبداع موهبة فطرية يولد بها البعض وينحرم منها الآخرون، بل يؤكد أنه عضلة يمكن تدريبها من خلال فهم كيفية عمل الدماغ." },
    { id: "AR_55", title: "الرياح في أشجار الصفصاف", author: "كينيث جرام", subject: "أدب أطفال", publisher: "هنداوي", driveLink: "https://drive.google.com/file/d/1CwrvdNwi5yPQFvkce_OV_nHy0ipcvi0V/view?usp=drive_link", bio: "كاتباً إسكتلندياً، كتب هذه الرواية في الأصل كمجموعة من القصص والرسائل لابنه الصغير أليستير. استلهم جرام أحداث الرواية من الطبيعة الإنجليزية الهادئة التي كان يحبها، هرباً من ضغوط عمله الرسمي في بنك إنجلترا.", summary: "تُعد رواية الرياح في أشجار الصفصاف (The Wind in the Willows)، الصادرة عام 1908، واحدة من أعظم كلاسيكيات أدب الأطفال العالمي، وهي عمل أدبي يتجاوز الصغار ليخاطب الكبار برمزياته العميقة وجمال وصفه للطبيعة." },
    { id: "AR_56", title: "ذكاء اصطناعي متوافق مع البشر: حتى لا تفرض الآلات سيطرتها على البشر", author: "ستيوارت راسل", subject: "تكنولوجيا", publisher: "هنداوي", driveLink: "https://drive.google.com/file/d/1ddbyuo2M2dfh-86lM3as1uoYDoB4fz1K/view?usp=drive_link", bio: "هو أحد أعمدة علم الذكاء الاصطناعي في العالم، وأستاذ علوم الحاسوب في جامعة كاليفورنيا ببرلين.", summary: "يُعتبر كتاب ذكاء اصطناعي متوافق مع البشر: مشكلة السيطرة (Human Compatible: Artificial Intelligence and the Problem of Control)، الصادر عام 2019، من أهم الكتب التي تتناول مستقبل البشرية في ظل وجود ذكاء اصطناعي فائق، ويُعد صرخة تحذير علمية رصينة من داخل المجتمع التقني نفسه." },
    { id: "AR_57", title: "عشرون قصة من روائع شكسبير", author: "إديث نسبيت", subject: "أدب عالمي", publisher: "هنداوي", driveLink: "https://drive.google.com/file/d/1ocR16ZTGPIioAOMEMr1BY189jHFP3MJ_/view?usp=drive_link", bio: "هي رائدة أدب الأطفال الحديث، وصاحبة الرواية الشهيرة أطفال السكك الحديدية. تميزت بقدرتها الفائقة على تبسيط الأفكار العميقة وتقديمها بأسلوب قصصي جذاب يجمع بين المتعة والدرس الأخلاقي.", summary: "مسرحيات شكسبير الأصلية مكتوبة بلغة إنجليزية قديمة وشاعرية صعبة حتى على الكبار أحياناً. ما فعلته نسبيت هنا هو إعادة صياغة لأشهر المسرحيات بأسلوب نثري قصصي مشوق." },
    { id: "AR_58", title: "يوميات فوكس ميكي", author: "ساشا تشيورني", subject: "أدب عالمي", publisher: "هنداوي", driveLink: "https://drive.google.com/file/d/1m_d_qCj9CIEeAI7d8CDdJ02Yv30odXkE/view?usp=drive_link", bio: "هو شاعر وكاتب ساخر روسي شهير (1880-1932). عُرف بأسلوبه النقدي الساخر في شعره للكبار، لكنه عندما كتب للأطفال، قدم أعمالاً خالدة تميزت بقدرته المذهلة على التقمص النفسي، وأشهرها هذه اليوميات التي كتبها عام 1927.", summary: "الكتاب مكتوب بالكامل على لسان الكلب ميكي ، وهو من فصيلة فوكس تيرير (Fox Terrier). ميكي ليس مجرد كلب عادي، بل هو كلب مثقف يستطيع القراءة والكتابة (في خياله على الأقل)، ويقرر تدوين يومياته ليعبر عن وجهة نظره في عالم البشر الغريب." },
    { id: "AR_59", title: "همس الجنون", author: "نجيب محفوظ", subject: "أدب عالمي", publisher: "هنداوي", driveLink: "https://drive.google.com/file/d/1RQYTtBhOwni78bg5IwqW0UVQfp4546hD/view?usp=drive_link", bio: "رائدُ الرواية العربية، والحائزُ على أعلى جائزةٍ أدبية في العالَم ، وُلِد في ١١ ديسمبر ١٩١١م في حي الجمالية بالقاهرة، لعائلةٍ من الطبقة المتوسطة، وكان والده موظفًا حكوميًّا، وقد اختار له اسمَ الطبيب الذي أشرَف على وِلادته، وهو الدكتور نجيب محفوظ باشا، ليصبح اسمُه مُركَّبًا نجيب محفوظ.", summary: "يُبدِع «نجيب محفوظ»، عميد الرواية العربية وفارس القصة القصيرة، في هذه المجموعة القصصية التي كانت أُولى تَجارِبه القصصية والتي ضمَّت ثمانيًا وعشرين قصة، في السرد عن الجنون بلغةٍ سلسة مُحكَمة وحكمةٍ مُتوارية في همساته؛ جنون الحب، جنون العظمة، جنون الجوع، جنون المال، الجنون المحض" }
];

const translations = {
  en: {
    pageTitle: "Arabic Library",
    searchPlaceholder: "Search title or author...",
    allSubjects: "Subjects",
    allAuthors: "Authors",
    sortBy: "Sort By",
    alphabetical: "Alphabetical",
    authorName: "Author",
    none: "Default",
    noResults: "No results found.",
    close: "Close",
    subjectLabel: "Topic",
    audioOnly: "Audio Only",
    audioSort: "Audio First",
    read: "Read Content",
    listen: "Saqr Audio Summary",
    back: "Back",
    ageClassification: "Age Group",
    bioLabel: "Author Bio:",
    summaryLabel: "Book Summary"
  },
  ar: {
    pageTitle: "المكتبة العربية",
    searchPlaceholder: "ابحث عن عنوان أو مؤلف...",
    allSubjects: "المواضيع",
    allAuthors: "المؤلفين",
    sortBy: "فرز حسب",
    alphabetical: "أبجدياً",
    authorName: "المؤلف",
    none: "تلقائي",
    noResults: "لا توجد نتائج.",
    close: "إغلاق",
    subjectLabel: "الموضوع",
    audioOnly: "صوتيات فقط",
    audioSort: "الصوتيات أولاً",
    read: "قراءة المحتوى",
    listen: "تلخيص صقر الصوتي",
    back: "العودة",
    ageClassification: "التصنيف العمري",
    bioLabel: "نبذة عن المؤلف:",
    summaryLabel: "نبذة عن الكتاب"
  }
};

// ==========================================
// أيقونات SVG جذابة (بديلة للإيموجيز)
// ==========================================
const UserIcon = () => (
  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const SearchSvg = () => (
  <svg className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const CloseSvg = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const RobotSvg = () => (
  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <circle cx="12" cy="5" r="2" />
    <path d="M12 7v4" />
    <line x1="8" y1="16" x2="8" y2="16" strokeWidth={4} />
    <line x1="16" y1="16" x2="16" y2="16" strokeWidth={4} />
  </svg>
);

const HeadphonesIcon = () => (
  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
  </svg>
);

const PlayIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
);
const PauseIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
);

// --- مشغل الصوت ---
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
        <div className="mt-8 animate-fade-in-up w-full max-w-lg mx-auto">
            <h4 className="text-xs font-black text-rose-500 uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
                <HeadphonesIcon /> {t('listen')}
            </h4>
            <div className="p-4 md:p-5 rounded-[2rem] bg-rose-50 dark:bg-slate-800 border-4 border-rose-200 dark:border-rose-900/50 shadow-sm flex items-center gap-4">
                <audio ref={audioRef} src={audioSrc} onTimeUpdate={() => setProgress((audioRef.current!.currentTime / audioRef.current!.duration) * 100)} onEnded={() => setIsPlaying(false)} />
                <button onClick={togglePlay} className="w-12 h-12 shrink-0 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-transform">
                    {isPlaying ? <PauseIcon /> : <PlayIcon />}
                </button>
                <div className="flex-1">
                    <div className="h-3 w-full bg-rose-200 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
                        <div className="h-full bg-rose-500 transition-all duration-300 rounded-full" style={{ width: `${progress}%` }} />
                    </div>
                </div>
                <button onClick={handleSpeed} className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 text-[10px] font-black hover:bg-rose-100 transition-colors uppercase min-w-[45px] shadow-sm border-2 border-rose-200 dark:border-rose-900">{speed}x</button>
            </div>
        </div>
    );
};

// --- 3. Component: BookModal ---
const BookModal: React.FC<{ book: any | null; onClose: () => void; t: any }> = ({ book, onClose, t }) => {
    const [ageGroup, setAgeGroup] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!book) return;
        setLoading(true);
        const fetchAgeGroup = async () => {
            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        messages: [{
                            role: 'system',
                            content: `Analyze the book titled "${book.title}". Return JSON ONLY: {"ageGroup": "أطفال أو مراهقين أو كبار"}`
                        }]
                    })
                });
                const data = await response.json();
                setAgeGroup(JSON.parse(data.reply.replace(/```json|```/g, '').trim()).ageGroup);
            } catch (err) {
                let fallbackAge = "كبار";
                if (book.subject.includes("أطفال")) fallbackAge = "أطفال";
                else if (book.subject.includes("خيالي") || book.subject.includes("بوليسية")) fallbackAge = "مراهقين وكبار";
                setAgeGroup(fallbackAge);
            } finally { setLoading(false); }
        };
        fetchAgeGroup();
    }, [book]);

    if (!book) return null;

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}>
            <div 
                className="relative w-full max-w-3xl mx-auto bg-white dark:bg-slate-800 rounded-[3rem] border-8 border-amber-400 dark:border-slate-700 shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] animate-in zoom-in-95 duration-300 cursor-default"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 end-4 z-50 p-2 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-transform shadow-lg active:scale-90 active:translate-y-1">
                    <CloseSvg />
                </button>

                <div className="flex-1 p-8 overflow-y-auto scrollbar-thin text-start flex flex-col mt-4 md:mt-0">
                    <h2 className="text-3xl md:text-4xl text-slate-900 dark:text-white font-black leading-tight mb-4">{book.title}</h2>
                    
                    <div className="relative group/author inline-flex items-center gap-2 mb-8 bg-sky-50 dark:bg-slate-700 w-fit px-4 py-2 rounded-full border-2 border-sky-200 dark:border-slate-600 cursor-help">
                        <UserIcon />
                        <p className="text-base text-sky-600 dark:text-sky-400 font-bold">{book.author}</p>
                        <div className="absolute top-full mt-2 start-0 w-64 p-4 bg-slate-900 text-white text-xs rounded-2xl opacity-0 invisible group-hover/author:opacity-100 group-hover/author:visible transition-all shadow-xl z-50 font-medium leading-relaxed">
                            <strong className="block mb-2 text-sky-400 font-black uppercase">{t('bioLabel')}</strong>
                            {book.bio}
                        </div>
                    </div>
                    
                    <div className="bg-slate-50 dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] border-4 border-slate-200 dark:border-slate-700 shadow-inner text-start flex-grow">
                        <div className="flex items-center gap-2 mb-4">
                           <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                           <p className="text-xs text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest">{t('summaryLabel')}</p>
                        </div>
                        <p className="text-slate-700 dark:text-slate-200 text-base md:text-lg font-bold leading-relaxed">
                           {book.summary}
                        </p>
                    </div>

                    {book.audioId && <SaqrAudioPlayer audioSrc={book.audioId} t={t} />}
                </div>

                <div className="w-full md:w-[280px] bg-slate-100 dark:bg-slate-900/50 p-8 flex flex-col justify-center items-center border-t-4 md:border-t-0 md:border-s-4 border-slate-200 dark:border-slate-700 shrink-0">
                    <div className="w-full text-center space-y-6">
                        <div className="bg-white dark:bg-slate-800 p-5 rounded-[2rem] border-4 border-slate-200 dark:border-slate-600 shadow-sm">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t('subjectLabel')}</p>
                            <p className="text-xl font-black text-slate-900 dark:text-white truncate">{book.subject}</p>
                        </div>
                        
                        <div className="bg-rose-50 dark:bg-slate-800 p-5 rounded-[2rem] border-4 border-rose-200 dark:border-slate-600 shadow-sm">
                            <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-2">{t('ageClassification')}</p>
                            <p className="text-2xl font-black text-rose-600 truncate">{loading ? '...' : (ageGroup || 'عام')}</p>
                        </div>

                        <div className="pt-6">
                            <a href={book.driveLink} target="_blank" rel="noreferrer" className="w-full block bg-emerald-500 text-white font-black py-4 rounded-[2rem] hover:-translate-y-1 active:translate-y-2 border-b-8 border-emerald-700 active:border-b-0 transition-all text-center uppercase tracking-widest text-base shadow-md">
                                {t('read')}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- 4. Component: BookCard (Realistic Book Design) ---
const BookCard = React.memo(({ book, onClick, t }: { book: any; onClick: () => void; t: any }) => {
  const isAi = !book.subject || book.subject === "Unknown";
  const hasAudio = !!book.audioId;

  // توليد لون عشوائي للغلاف بناءً على الحرف الأول
  const colors = [
    'from-blue-500 to-blue-700 border-blue-800',
    'from-emerald-500 to-emerald-700 border-emerald-800',
    'from-rose-500 to-rose-700 border-rose-800',
    'from-amber-500 to-amber-600 border-amber-700',
    'from-purple-500 to-purple-700 border-purple-800'
  ];
  const colorClass = colors[book.title.length % colors.length];

  return (
    <div onClick={onClick} className="relative group cursor-pointer w-full h-[320px] perspective-1000 flex items-end justify-center pb-2">
      {/* تصميم الكتاب الواقعي */}
      <div className={`book-volume w-[90%] h-full relative transform-style-3d transition-transform duration-500 group-hover:rotate-y-[-15deg] group-hover:-translate-y-4 group-hover:scale-105 rounded-r-2xl border-l-[16px] shadow-[-10px_10px_20px_rgba(0,0,0,0.15)] bg-gradient-to-br ${colorClass}`}>
        
        {/* الغلاف الأمامي */}
        <div className="absolute inset-0 flex flex-col p-5 overflow-hidden rounded-r-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-black/20 pointer-events-none"></div>

          <div className="mb-auto mt-2 flex justify-between items-start">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-white/20 text-white backdrop-blur-sm border border-white/30 shadow-sm max-w-[70%]`}>
               {isAi && <RobotSvg />}
               <span className="truncate">{isAi ? t('aiSubject') : book.subject}</span>
            </span>
            {hasAudio && (
              <div className="bg-white/20 backdrop-blur-sm p-1.5 rounded-full border border-white/30 text-white animate-pulse">
                <HeadphonesIcon />
              </div>
            )}
          </div>
          
          <div className="relative z-10 flex-1 flex flex-col justify-center">
            <h3 className="font-black text-lg md:text-xl text-white leading-snug drop-shadow-md line-clamp-3 mb-3">
                {book.title}
            </h3>
            <div className="flex items-center gap-2 text-white/80 mt-auto mb-2">
                <UserIcon />
                <p className="text-xs font-bold truncate uppercase">{book.author}</p>
            </div>
          </div>
        </div>

        {/* كعب الكتاب */}
        <div className="absolute top-0 left-[-16px] w-[16px] h-full bg-black/30 origin-right transform rotate-y-90 flex flex-col items-center justify-between py-6">
           <div className="w-full h-1 bg-white/30"></div>
           <div className="text-[10px] text-white/50 font-black -rotate-90 tracking-widest">{book.publisher?.substring(0, 10)}</div>
           <div className="w-full h-1 bg-white/30"></div>
        </div>

        {/* صفحات الكتاب */}
        <div className="absolute top-2 right-[-6px] w-[6px] h-[calc(100%-4px)] bg-[#fdfbf7] origin-left transform rotate-y-[-90deg] rounded-r-sm shadow-inner border-y border-r border-[#e2e8f0]">
           <div className="w-full h-full bg-[repeating-linear-gradient(transparent,transparent_2px,#e2e8f0_2px,#e2e8f0_3px)] opacity-50"></div>
        </div>
      </div>
    </div>
  );
});

// --- 5. Main Component: ArabicLibraryInternalPage ---
const ArabicLibraryInternalPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const navigate = useNavigate();
    const t = (key: keyof typeof translations.ar) => translations[locale as keyof typeof translations]?.[key] as string;
    
    const [searchTerm, setSearchTerm] = useState('');
    const [subjectFilter, setSubjectFilter] = useState('all');
    const [authorFilter, setAuthorFilter] = useState('all');
    const [sortBy, setSortBy] = useState('alphabetical'); 
    const [audioOnly, setAudioOnly] = useState(false);
    const [selectedBook, setSelectedBook] = useState<any | null>(null);
    const [visibleCount, setVisibleCount] = useState(16);

    const [showSearch, setShowSearch] = useState(true);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
                setShowSearch(false);
            } else {
                setShowSearch(true);
            }
            lastScrollY.current = currentScrollY;
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const filters = useMemo(() => ({
        subjects: [...new Set(ARABIC_LIBRARY_DATABASE.map(b => b.subject))].filter(s => s !== "Unknown").sort(),
        authors: [...new Set(ARABIC_LIBRARY_DATABASE.map(b => b.author))].filter(a => a !== 'Unknown Author').sort(),
    }), []);

    const filteredBooks = useMemo(() => {
        const term = searchTerm.toLowerCase().trim();
        let result = ARABIC_LIBRARY_DATABASE.filter(b => {
            const matchesSearch = b.title.toLowerCase().includes(term) || b.author.toLowerCase().includes(term);
            const matchesSubject = subjectFilter === 'all' || b.subject === subjectFilter;
            const matchesAuthor = authorFilter === 'all' || b.author === authorFilter;
            const matchesAudio = audioOnly ? !!b.audioId : true;
            return matchesSearch && matchesSubject && matchesAuthor && matchesAudio;
        });

        if (sortBy === 'author') result = [...result].sort((a, b) => a.author.localeCompare(b.author, locale));
        else if (sortBy === 'subject') result = [...result].sort((a, b) => a.subject.localeCompare(b.subject, locale));
        else if (sortBy === 'audio') result = [...result].sort((a, b) => (b.audioId ? 1 : 0) - (a.audioId ? 1 : 0));
        else result = [...result].sort((a, b) => a.title.localeCompare(b.title, locale));
        return result;
    }, [searchTerm, subjectFilter, authorFilter, audioOnly, sortBy, locale]);

    return (
        <div dir={dir} className="w-full min-h-screen bg-[#f8fafc] dark:bg-slate-950 font-sans relative overflow-x-hidden transition-colors duration-300">
            
            {/* 🌟 تصميم طفولي للخلفية */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none opacity-50 dark:opacity-20">
               <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-400/20 rounded-full blur-[100px] animate-blob"></div>
               <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] bg-amber-400/20 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
            </div>

            <div className="max-w-[1400px] mx-auto px-4 md:px-6 pb-20 relative z-10 antialiased overflow-x-hidden">
                
                {/* العنوان والزر */}
                <div className="text-center mt-12 mb-16 relative">
                    <button onClick={() => navigate(-1)} className="absolute start-0 top-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 text-slate-800 dark:text-white px-5 py-2.5 rounded-full font-black text-sm hover:bg-slate-200 hover:-translate-x-1 active:translate-y-1 border-b-4 border-slate-300 dark:border-slate-700 active:border-b-0 transition-all flex items-center gap-2 shadow-sm">
                        <span className="text-xl leading-none rtl:rotate-180">←</span> {t('back')}
                    </button>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-800 dark:text-white tracking-tight uppercase">{t('pageTitle')}</h1>
                    <div className="flex justify-center gap-3 mt-6">
                        <div className="w-16 h-2 bg-emerald-500 rounded-full" />
                        <div className="w-8 h-2 bg-amber-400 rounded-full" />
                    </div>
                </div>

                {/* شريط البحث المبهج */}
                <div className={`sticky z-[100] transition-all duration-500 ease-in-out ${showSearch ? 'top-4 md:top-6 opacity-100 translate-y-0' : '-top-40 opacity-0 -translate-y-full'} mb-16`}>
                    <div className="bg-white dark:bg-slate-800 p-5 md:p-8 rounded-[3rem] border-4 border-emerald-300 dark:border-emerald-600 shadow-xl max-w-5xl mx-auto">
                        <div className="flex flex-col gap-5">
                            <div className="relative group">
                                <input 
                                  type="text" 
                                  placeholder={t('searchPlaceholder')} 
                                  className="w-full p-4 md:p-5 ps-14 md:ps-16 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border-4 border-slate-200 dark:border-slate-700 focus:border-emerald-400 rounded-[2rem] outline-none transition-colors text-base md:text-lg font-black shadow-inner" 
                                  value={searchTerm}
                                  onChange={(e) => setSearchTerm(e.target.value)} 
                                />
                                <div className="absolute start-5 md:start-6 top-1/2 -translate-y-1/2 text-emerald-500">
                                    <SearchSvg />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                                <select value={authorFilter} onChange={(e) => setAuthorFilter(e.target.value)} className="w-full p-3 md:p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 font-black text-xs md:text-sm cursor-pointer appearance-none text-center hover:border-emerald-400 transition-colors outline-none focus:border-emerald-500 text-slate-700 dark:text-slate-200">
                                    <option value="all">{t('allAuthors')}</option>
                                    {filters.authors.map(a => <option key={a} value={a}>{a}</option>)}
                                </select>
                                <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} className="w-full p-3 md:p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 font-black text-xs md:text-sm cursor-pointer appearance-none text-center hover:border-emerald-400 transition-colors outline-none focus:border-emerald-500 text-slate-700 dark:text-slate-200">
                                    <option value="all">{t('allSubjects')}</option>
                                    {filters.subjects.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full p-3 md:p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 font-black text-xs md:text-sm cursor-pointer appearance-none text-center hover:border-emerald-400 transition-colors outline-none focus:border-emerald-500 text-slate-700 dark:text-slate-200">
                                    <option value="alphabetical">{t('alphabetical')}</option>
                                    <option value="audio">{t('audioSort')}</option>
                                </select>
                                <button onClick={() => setAudioOnly(!audioOnly)} className={`w-full p-3 md:p-4 rounded-2xl font-black text-xs md:text-sm transition-all border-b-4 active:border-b-0 active:translate-y-1 flex items-center justify-center gap-2 ${audioOnly ? 'bg-rose-500 text-white border-rose-700 animate-pulse' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 border-2'}`}>
                                    <HeadphonesIcon /> {t('audioOnly')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* عرض الكتب كأرفف مكتبة حقيقية */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-12 gap-x-4 md:gap-x-8 px-2 md:px-8">
                    {filteredBooks.slice(0, visibleCount).map((book) => (
                        <div key={book.id} className="relative">
                           <BookCard 
                               book={book} 
                               t={t} 
                               onClick={() => {
                                   setSelectedBook(book); 
                                   trackActivity('digital', book.title); 
                               }} 
                           />
                           {/* خط الرف الخشبي أسفل الكتاب */}
                           <div className="absolute -bottom-2 w-[110%] -left-[5%] h-4 bg-[#8B4513] rounded-sm shadow-md border-b-4 border-[#5C2E0B] -z-10"></div>
                        </div>
                    ))}
                </div>

                {filteredBooks.length === 0 && (
                    <div className="py-20 text-center text-slate-400 dark:text-slate-600 flex flex-col items-center">
                        <svg className="w-24 h-24 mb-6 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-3xl font-black">{t('noResults')}</p>
                    </div>
                )}

                {filteredBooks.length > visibleCount && (
                    <div className="mt-20 text-center">
                        <button 
                            onClick={() => setVisibleCount(prev => prev + 16)} 
                            className="bg-emerald-500 text-white px-10 py-4 rounded-full font-black text-lg md:text-xl border-b-8 border-emerald-700 hover:-translate-y-1 active:border-b-0 active:translate-y-2 transition-all shadow-md uppercase tracking-widest"
                        >
                            EXPLORE MORE
                        </button>
                    </div>
                )}

                <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} t={t} />

            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');
                * { font-family: 'Cairo', sans-serif !important; }
                .scrollbar-thin::-webkit-scrollbar { width: 6px; }
                .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
                .scrollbar-thin::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                .dark .scrollbar-thin::-webkit-scrollbar-thumb { background: #475569; }
                
                /* إعدادات الشكل ثلاثي الأبعاد للكتاب */
                .perspective-1000 { perspective: 1000px; }
                .transform-style-3d { transform-style: preserve-3d; }
                .rotate-y-90 { transform: rotateY(90deg); }
                .-rotate-y-15 { transform: rotateY(-15deg); }
                
                @keyframes blob {
                  0% { transform: translate(0px, 0px) scale(1); }
                  33% { transform: translate(30px, -50px) scale(1.1); }
                  66% { transform: translate(-20px, 20px) scale(0.9); }
                  100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob { animation: blob 7s infinite alternate ease-in-out; }
                
                @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
                .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default ArabicLibraryInternalPage;
