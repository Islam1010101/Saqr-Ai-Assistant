import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useLanguage } from '../App';
import { useNavigate } from 'react-router-dom';

// --- 1. قاعدة البيانات (تم الإبقاء عليها كما هي) ---
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
    { id: "AR_50", title: "كليلة ودمنة", author: "عبدالله بن المقفع", subject: "أدب خيالي", publisher: "هنداوي", driveLink: "https://drive.google.com/file/d/1manKVHamsvHDO-37IxmecGeKOtKxpJhB/view?usp=drive_link", bio: "أديب ومفكر عبقري من العصر العباسي، اشتهر ببلاغته الاستثنائية ودوره المحوري في نقل الحكمة الفارسية.", summary: "كتاب قصصي ذو أصول هندية تدور أحداثه على ألسنة الحيوانات والطيور لتقديم نصائح وحكم.", audioId: "/audio/كليلة.mp3" }
];

const translations = {
  ar: {
    pageTitle: "المكتبة العربية",
    searchPlaceholder: "ابحث عن عنوان أو مؤلف...",
    allSubjects: "المواضيع",
    allAuthors: "المؤلفين",
    allShelves: "الرفوف",
    sortBy: "فرز حسب",
    alphabetical: "أبجدياً",
    authorName: "المؤلف",
    none: "تلقائي",
    shelf: "الرف",
    row: "الصف",
    noResults: "لا توجد نتائج.",
    aiSubject: "تصنيف صقر الذكي",
    close: "إغلاق",
    subjectLabel: "الموضوع",
    officialAi: "تحليل صقر الذكي",
    audioOnly: "صوتيات فقط",
    audioSort: "الصوتيات أولاً",
    read: "قراءة المحتوى",
    listen: "تلخيص صقر الصوتي",
    summaryTitle: "ملخص صقر الرقمي",
    back: "العودة"
  },
  en: {
    pageTitle: "Arabic Library",
    searchPlaceholder: "Search title or author...",
    allSubjects: "Subjects",
    allAuthors: "Authors",
    allShelves: "Shelves",
    sortBy: "Sort By",
    alphabetical: "Alphabetical",
    authorName: "Author",
    none: "Default",
    shelf: "Shelf",
    row: "Row",
    noResults: "No results found.",
    aiSubject: "Saqr AI Classified",
    close: "Close",
    subjectLabel: "Topic",
    officialAi: "Saqr AI Analysis",
    audioOnly: "Audio Only",
    audioSort: "Audio First",
    read: "Read Content",
    listen: "Saqr Audio Summary",
    summaryTitle: "Saqr Digital Summary",
    back: "Back"
  }
};

// --- 2. مكونات التصميم الزجاجي ---
const ReflectionLayer = () => (
  <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden rounded-[inherit]">
    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-white/5 to-transparent opacity-40" />
    <div className="absolute -top-[100%] -left-[100%] w-[300%] h-[300%] bg-[linear-gradient(45deg,transparent_45%,rgba(255,255,255,0.15)_50%,transparent_55%)] animate-[shine_10s_infinite] opacity-30" />
  </div>
);

const AudioWaveIcon = () => (
    <div className="flex gap-[2px] items-end h-3">
        <div className="w-[2px] bg-white/80 animate-audio-bar-1"></div>
        <div className="w-[2px] bg-white/80 animate-audio-bar-2"></div>
        <div className="w-[2px] bg-white/80 animate-audio-bar-3"></div>
        <div className="w-[2px] bg-white/80 animate-audio-bar-2"></div>
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
        <div className="mt-6 animate-fade-up">
            <h4 className="text-[10px] font-bold text-[#00732f] uppercase tracking-widest mb-3 flex items-center gap-2">🎧 {t('listen')}</h4>
            <div className="p-4 md:p-5 rounded-[2rem] bg-slate-50/50 dark:bg-white/5 backdrop-blur-xl border border-white/20 shadow-sm flex items-center gap-4">
                <audio ref={audioRef} src={audioSrc} onTimeUpdate={() => setProgress((audioRef.current!.currentTime / audioRef.current!.duration) * 100)} onEnded={() => setIsPlaying(false)} />
                <button onClick={togglePlay} className="w-12 h-12 shrink-0 rounded-full bg-[#00732f] text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all">
                    {isPlaying ? <span className="text-xl">⏸</span> : <span className="text-xl ps-1">▶</span>}
                </button>
                <div className="flex-1">
                    <div className="h-1 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-red-600 transition-all duration-300" style={{ width: `${progress}%` }} />
                    </div>
                </div>
                <button onClick={handleSpeed} className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-white text-[10px] font-bold hover:bg-slate-300 transition-colors uppercase min-w-[45px]">{speed}x</button>
            </div>
        </div>
    );
};

// --- 3. Component: BookModal (تعديل: توسيط النافذة) ---
const BookModal: React.FC<{ book: any | null; onClose: () => void; t: any }> = ({ book, onClose, t }) => {
    const { locale } = useLanguage();
    const [aiContent, setAiContent] = useState({ summary: '', genre: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!book) return;
        const fetchAiDeepDive = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        messages: [{
                            role: 'system',
                            content: `Analyze the book titled "${book.title}" ${book.author ? `by "${book.author}"` : ''}. Provide: 1. A clear 2-sentence summary. 2. A specific Topic (Genre). Language: ${locale === 'ar' ? 'Arabic' : 'English'}. Return JSON ONLY: {"summary": "...", "genre": "..."}`
                        }]
                    })
                });
                const data = await response.json();
                const parsed = JSON.parse(data.reply.replace(/```json|```/g, '').trim());
                setAiContent(parsed);
            } catch (err) {
                setAiContent({ 
                    summary: book.summary || (locale === 'ar' ? "كتاب متميز يفتح آفاق المعرفة للقارئ." : "An exceptional book that expands the reader's horizons."),
                    genre: book.subject !== "Unknown" ? book.subject : (locale === 'ar' ? "عام" : "General")
                });
            } finally { setLoading(false); }
        };
        fetchAiDeepDive();
    }, [book, locale]);

    if (!book) return null;

    return (
        // التوسيط هنا باستخدام flex items-center justify-center
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 backdrop-blur-md bg-slate-900/40 animate-fade-in" onClick={onClose}>
            {/* النافذة المنبثقة: تمت إضافة mx-auto لضمان التوسيط في جميع الشاشات */}
            <div className="relative w-full max-w-3xl mx-auto bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-[2rem] border border-white/20 shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[85vh] animate-zoom-in" onClick={(e) => e.stopPropagation()}>
                
                <button onClick={onClose} className="absolute top-4 end-4 z-50 p-2 bg-slate-100/50 dark:bg-slate-800/50 hover:bg-red-600 hover:text-white rounded-full transition-all shadow-sm">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                {/* القسم الأيمن: البيانات والتفاصيل */}
                <div className="flex-1 p-6 md:p-8 overflow-y-auto no-scrollbar text-start flex flex-col">
                    <span className="inline-block px-3 py-1 rounded-full bg-red-600/10 text-red-600 text-[10px] font-bold uppercase tracking-widest w-fit mb-3">Saqr AI Insight</span>
                    <h2 className="text-2xl md:text-3xl text-slate-950 dark:text-white font-bold leading-tight mb-2">{book.title}</h2>
                    <p className="text-sm md:text-base text-[#00732f] font-medium mb-6">By {book.author}</p>
                    
                    <div className="bg-slate-50/50 dark:bg-white/5 p-5 rounded-[1.5rem] border border-white/20 shadow-inner text-start flex-grow">
                        <div className="flex items-center gap-2 mb-3">
                           <span className={`w-2 h-2 rounded-full ${loading ? 'animate-ping bg-red-500' : 'bg-green-500'}`}></span>
                           <p className="text-[10px] text-green-700 dark:text-green-400 font-bold uppercase tracking-widest">{t('officialAi')}</p>
                        </div>
                        <p className="text-slate-700 dark:text-slate-200 text-sm md:text-base font-medium leading-relaxed">
                           {loading ? "..." : `"${aiContent.summary}"`}
                        </p>
                    </div>

                    {book.audioId && <SaqrAudioPlayer audioSrc={book.audioId} t={t} />}
                </div>

                {/* القسم الأيسر: الإجراءات والتصنيف */}
                <div className="w-full md:w-[260px] bg-slate-100/50 dark:bg-black/20 p-6 md:p-8 flex flex-col justify-center items-center border-t md:border-t-0 md:border-s border-slate-200 dark:border-white/10 shrink-0">
                    <div className="w-full text-center space-y-6">
                        <div className="bg-white/60 dark:bg-slate-800/60 p-4 rounded-2xl border border-white/30 shadow-sm">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t('subjectLabel')}</p>
                            <p className="text-lg font-bold text-slate-900 dark:text-white truncate">{loading ? '...' : (aiContent.genre || book.subject)}</p>
                        </div>
                        
                        <div className="flex justify-center gap-8">
                            <div className="text-center">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t('shelf')}</p>
                                <p className="text-3xl font-bold text-red-600">{book.shelf}</p>
                            </div>
                            <div className="w-px h-10 bg-slate-300 dark:bg-slate-700" />
                            <div className="text-center">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t('row')}</p>
                                <p className="text-3xl font-bold text-[#00732f]">{book.row}</p>
                            </div>
                        </div>

                        <div className="space-y-3 pt-4">
                            <a href={book.driveLink} target="_blank" rel="noreferrer" className="w-full block bg-[#00732f] text-white font-bold py-3.5 rounded-xl hover:bg-green-700 transition-all text-center uppercase tracking-widest text-xs shadow-md shadow-green-900/20">{t('read')}</a>
                            <button onClick={onClose} className="w-full bg-white dark:bg-slate-800 text-slate-700 dark:text-white border border-slate-200 dark:border-slate-700 font-bold py-3.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-all text-xs uppercase tracking-widest">{t('close')}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- 4. Component: BookCard (تعديل: تمييز إطار الصوتيات بالأحمر) ---
const BookCard = React.memo(({ book, onClick, t }: { book: any; onClick: () => void; t: any }) => {
  const isAi = !book.subject || book.subject === "Unknown";
  // شرط للتحقق مما إذا كان الكتاب يحتوي على ملف صوتي
  const hasAudio = !!book.audioId;

  return (
    <div onClick={onClick} className="group relative glass-panel rounded-[2rem] p-0.5 cursor-pointer transition-all duration-500 hover:-translate-y-2 h-full active:scale-[0.98] shadow-sm hover:shadow-xl">
      {/* تم تغيير الحدود هنا لتصبح حمراء في حال وجود ملف صوتي مع إضافة تأثير توهج خفيف */}
      <div className={`relative overflow-hidden rounded-[1.9rem] bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl h-full flex flex-col border transition-all duration-300 
        ${hasAudio ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-white/30 dark:border-white/10'}`}>
        
        <ReflectionLayer />
        
        <div className={`absolute top-0 start-0 w-1.5 h-full z-30 transition-all duration-500 ${isAi ? 'bg-red-600' : 'bg-[#00732f]'}`} />

        <div className="p-6 relative z-10 flex-grow text-start">
          <div className="flex justify-between items-start mb-3">
              <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border border-white/20 shadow-sm
                             ${isAi ? 'bg-red-600 text-white' : 'bg-[#00732f] text-white'}`}>
                 {isAi ? t('aiSubject') : book.subject}
              </span>
              {hasAudio && <div className="bg-red-600 px-2 py-1 rounded-full shadow-sm"><AudioWaveIcon /></div>}
          </div>
          
          <h3 className="font-semibold text-lg md:text-xl text-slate-900 dark:text-white leading-snug mb-3 group-hover:text-red-600 transition-colors line-clamp-2">
              {book.title}
          </h3>
          
          <div className="flex items-center gap-2 opacity-70">
              <span className="text-sm">👤</span>
              <p className="text-[11px] font-medium truncate uppercase">{book.author}</p>
          </div>
        </div>

        <div className="bg-slate-50/50 dark:bg-black/20 py-4 px-6 border-t border-slate-200/50 dark:border-white/10 mt-auto flex items-center justify-between relative z-10 backdrop-blur-md">
            <div className="flex gap-5 items-center">
                <div className="text-center">
                  <p className="text-[8px] text-red-600 font-bold tracking-widest uppercase mb-0.5">S</p>
                  <p className="text-base font-bold text-slate-800 dark:text-white leading-none">{book.shelf}</p>
                </div>
                <div className="w-px h-6 bg-slate-300 dark:bg-slate-700" />
                <div className="text-center">
                  <p className="text-[8px] text-[#00732f] font-bold tracking-widest uppercase mb-0.5">R</p>
                  <p className="text-base font-bold text-slate-800 dark:text-white leading-none">{book.row}</p>
                </div>
            </div>
            <div className="w-8 h-8 rounded-full border border-slate-300 dark:border-white/20 flex items-center justify-center text-slate-400 group-hover:border-red-600 group-hover:text-red-600 group-hover:bg-red-50 dark:group-hover:bg-red-900/20 transition-all">
              <span className="text-[10px]">➔</span>
            </div>
        </div>
      </div>
    </div>
  );
});

// --- 5. Main Component: ArabicLibraryInternalPage (بدون تغييرات جوهرية) ---
const ArabicLibraryInternalPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const navigate = useNavigate();
    const t = (key: keyof typeof translations.ar) => translations[locale][key] as string;
    
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
        <div dir={dir} className="max-w-7xl mx-auto px-4 md:px-6 pb-20 relative z-10 antialiased">
            
            <div className="text-center mt-12 mb-16 animate-fade-up relative">
                <button onClick={() => navigate(-1)} className="absolute start-0 top-1/2 -translate-y-1/2 text-slate-500 hover:text-red-600 font-bold flex items-center gap-2 transition-all"><span className="text-xl">←</span> {t('back')}</button>
                <h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">{t('pageTitle')}</h1>
                <div className="flex justify-center gap-1.5 mt-6"><div className="w-10 h-1 bg-red-600 rounded-full" /><div className="w-10 h-1 bg-[#00732f] rounded-full" /></div>
            </div>

            <div className={`sticky z-[100] transition-all duration-500 ease-in-out ${showSearch ? 'top-4 md:top-6 opacity-100 translate-y-0' : '-top-40 opacity-0 -translate-y-full'} mb-12`}>
                <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border border-white/40 dark:border-white/10 shadow-xl rounded-[2rem] p-4 md:p-5">
                    <div className="flex flex-col gap-4">
                        <div className="relative group">
                            <input 
                              type="text" 
                              placeholder={t('searchPlaceholder')} 
                              className="w-full p-4 ps-12 md:ps-14 bg-white/60 dark:bg-black/40 text-slate-900 dark:text-white border border-slate-200 dark:border-transparent focus:border-red-500 rounded-2xl outline-none transition-all text-sm md:text-base font-medium shadow-inner" 
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)} 
                            />
                            <svg className="absolute start-4 md:start-5 top-1/2 -translate-y-1/2 h-5 w-5 text-red-600 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                            <select value={authorFilter} onChange={(e) => setAuthorFilter(e.target.value)} className="p-3 rounded-xl bg-white/60 dark:bg-slate-800 border border-slate-200 dark:border-white/10 font-bold text-[10px] md:text-xs text-slate-700 dark:text-slate-300 outline-none cursor-pointer hover:bg-white dark:hover:bg-slate-700 transition-all shadow-sm">
                                <option value="all">{t('allAuthors')}</option>
                                {filters.authors.map(a => <option key={a} value={a}>{a}</option>)}
                            </select>
                            <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} className="p-3 rounded-xl bg-white/60 dark:bg-slate-800 border border-slate-200 dark:border-white/10 font-bold text-[10px] md:text-xs text-slate-700 dark:text-slate-300 outline-none cursor-pointer hover:bg-white dark:hover:bg-slate-700 transition-all shadow-sm">
                                <option value="all">{t('allSubjects')}</option>
                                {filters.subjects.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="p-3 rounded-xl bg-white/60 dark:bg-slate-800 border border-slate-200 dark:border-white/10 font-bold text-[10px] md:text-xs text-slate-700 dark:text-slate-300 outline-none cursor-pointer hover:bg-white dark:hover:bg-slate-700 transition-all shadow-sm">
                                <option value="alphabetical">{t('alphabetical')}</option>
                                <option value="author">{t('authorName')}</option>
                                <option value="audio">{t('audioSort')}</option>
                            </select>
                            <button onClick={() => setAudioOnly(!audioOnly)} className={`p-3 rounded-xl font-bold text-[10px] md:text-xs transition-all shadow-sm border ${audioOnly ? 'bg-red-600 text-white border-red-600' : 'bg-white/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:bg-white dark:hover:bg-slate-700'}`}>
                                🎧 {t('audioOnly')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {filteredBooks.slice(0, visibleCount).map((book) => (
                    <BookCard key={book.id} book={book} t={t} onClick={() => setSelectedBook(book)} />
                ))}
            </div>

            {filteredBooks.length === 0 && (
                <div className="py-20 text-center opacity-40">
                    <span className="text-6xl mb-4 block">📚</span>
                    <p className="text-2xl font-bold text-slate-500">{t('noResults')}</p>
                </div>
            )}

            {filteredBooks.length > visibleCount && (
                <div className="mt-16 text-center">
                    <button onClick={() => setVisibleCount(v => v + 16)} className="bg-[#00732f] text-white px-10 py-4 rounded-full font-bold text-sm hover:bg-red-600 transition-all shadow-lg tracking-widest uppercase active:scale-95">
                        Explore More
                    </button>
                </div>
            )}

            <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} t={t} />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap');
                * { font-family: 'Cairo', sans-serif !important; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                @keyframes audio-bar { 0%, 100% { height: 4px; } 50% { height: 12px; } }
                .animate-audio-bar-1 { animation: audio-bar 0.6s ease-in-out infinite; }
                .animate-audio-bar-2 { animation: audio-bar 0.8s ease-in-out infinite 0.2s; }
                .animate-audio-bar-3 { animation: audio-bar 0.7s ease-in-out infinite 0.4s; }
                @keyframes shine {
                  0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
                  100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
                }
            `}</style>
        </div>
    );
};

export default ArabicLibraryInternalPage;
