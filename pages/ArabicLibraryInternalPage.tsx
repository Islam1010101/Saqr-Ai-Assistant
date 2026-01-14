import React, { useState, useMemo } from 'react';
import { useLanguage } from '../App';
import { useNavigate } from 'react-router-dom';

// --- قاعدة البيانات المستخرجة حرفياً من ملفك (35 عنواناً) ---
const ARABIC_LIBRARY_DATABASE = [
  { id: 1, title: "مجموعة روايات أجاثا كريستي", author: "أجاثا كريستي", subject: "قصص بوليسية", publisher: "الأجيال للترجمة والنشر", driveLink: "https://drive.google.com/drive/folders/1PZk0vPQrKXIgE0WmUXlEMcSzt_d94Q6u?usp=sharing", bio: "أشهر مؤلفة لروايات الجريمة عالمياً، لُقبت بملكة الجريمة لابتكارها حبكات بوليسية لا تُضاهى.", summary: "مجموعة ضخمة تضم مغامرات المحقق هيركيول بوارو والآنسة ماربل في حل أعقد الألغاز الجنائية." },
  { id: 2, title: "أرض الإله", author: "أحمد مراد", subject: "أدب تاريخي", publisher: "دار الشروق", driveLink: "https://drive.google.com/file/d/1Q-dT9-g292nqv1N_PvlB2TnZMBdQGpio/view?usp=drive_link", bio: "كاتب وسيناريست مصري معاصر، تميزت أعماله بالدمج المثير بين التاريخ والتشويق النفسي.", summary: "رواية تاريخية تأخذنا في رحلة إلى مصر القديمة لكشف أسرار قديمة مخبأة في المخطوطات والكهنة." },
  { id: 3, title: "أرض النفاق", author: "يوسف السباعي", subject: "أدب خيالي", publisher: "مكتبة مصر", driveLink: "https://drive.google.com/file/d/14KCqI_ffiUg8if8uqs_vQ-oJIXBEsKD3/view?usp=drive_link", bio: "أديب ووزير مصري، لُقب بـ 'فارس الرواية'، امتاز أسلوبه بالسخرية الاجتماعية الهادفة والرومانسية.", summary: "رواية رمزية ساخرة تصف مجتمعاً تُباع فيه الأخلاق في حبوب وزجاجات، منتقدةً النفاق البشري." },
  { id: 4, title: "أكواريل", author: "أحمد خالد توفيق", subject: "أدب خيالي", publisher: "دار سما للنشر والتوزيع", driveLink: "https://drive.google.com/file/d/1NLK9-pE6uoHU8po8BC8731KIZ3oc0qU5/view?usp=drive_link", bio: "العراب، رائد أدب الرعب والشباب في الوطن العربي، الذي جعل القراءة عادة يومية لملايين الشباب.", summary: "مجموعة قصصية فنية تمزج بين الغموض والواقعية بأسلوب العراب السلس الذي يشد القارئ للنهاية." },
  { id: 5, title: "الفيل الأزرق", author: "أحمد مراد", subject: "أدب خيالي", publisher: "دار الشروق", driveLink: "https://drive.google.com/file/d/1Vr0BCdRxRC4k9e8t7g5sqtfnW1BHZbTD/view?usp=drive_link", bio: "روائي مصري حقق مبيعات قياسية، تميزت رواياته بعمق التحليل النفسي والغموض السينمائي المثير.", summary: "رحلة نفسية مضطربة داخل عالم الطب الشرعي والأمراض العقلية، حيث يختلط الواقع بالهلوسة المرعبة." },
  { id: 6, title: "نائب عزارئيل", author: "يوسف السباعي", subject: "أدب خيالي", publisher: "مكتبة الإسكندرية", driveLink: "https://drive.google.com/file/d/1vC4PIAZ2ekJ-uU3wCE4zV70glD8VjDT0/view?usp=drive_link", bio: "كاتب موسوعي أثرى المكتبة العربية بروايات ومسرحيات شكلت وجدان الجيل الذهبي للأدب المصري.", summary: "رواية فانتازية طريفة حول شخص يجد نفسه في موقع ملك الموت، مما يولد مواقف فلسفية وإنسانية." },
  { id: 7, title: "المكتبة الخضراء للأطفال", author: "مؤلفين", subject: "قصص للأطفال", publisher: "دار المعارف", driveLink: "https://drive.google.com/drive/folders/1AHrYDDPkocCEAnJXAfhbnTYtfkpcuUIn?usp=drive_link", bio: "مجموعة من أدباء وكتاب الأطفال المتميزين الذين صاغوا حكايات تربوية وخيالية للأجيال.", summary: "سلسلة قصصية شهيرة تهدف لغرس القيم الأخلاقية والجمالية في نفوس الأطفال عبر حكايات مشوقة." },
  { id: 8, title: "أوقات عصيبة", author: "تشارلز ديكنز", subject: "قصص عالمية", publisher: "مكتبة الأنجلو المصرية", driveLink: "https://drive.google.com/file/d/1TxWYfZmTOjvpj5mjTeKBueUDHrEIViAB/view?usp=drive_link", bio: "أعظم الروائيين الإنجليز في العصر الفيكتوري، عُرف بدفاعه عن الفقراء وتصويره الدقيق للمجتمع.", summary: "رواية اجتماعية تنتقد المادية المفرطة في المجتمع الصناعي، وتدعو للحفاظ على الخيال والمشاعر الإنسانية." },
  { id: 9, title: "أوليفر تويسيت", author: "تشارلز ديكنز", subject: "قصص عالمية", publisher: "دار العلم للملايين", driveLink: "https://drive.google.com/file/d/1zkFntttQq6pzErlvPCKbmW8odDORoneJ/view?usp=drive_link", bio: "روائي عالمي استلهم معظم أعماله من طفولته القاسية، وصار صوتاً للمظلومين في الأدب العالمي.", summary: "رحلة طفل يتيم في شوارع لندن المظلمة، يواجه الصعاب بقلب نقي باحثاً عن عائلة تنقذه من الضياع." },
  { id: 10, title: "الآمال الكبيرة", author: "تشارلز ديكنز", subject: "قصص عالمية", publisher: "مكتبة الأسرة 2000", driveLink: "https://drive.google.com/file/d/1aYWKfjB1fJu3CfII-yK55hM5qmt3ji5Y/view?usp=drive_link", bio: "كاتب بريطاني تعتبر أعماله من كلاسيكيات الأدب العالمي التي تدرس حتى اليوم لعمقها الإنساني.", summary: "قصة الشاب 'بيب' وطموحاته الكبيرة في الارتقاء الاجتماعي، مكتشفاً المعنى الحقيقي للكرامة والإخلاص." },
  { id: 11, title: "ترويض النمرة", author: "ويليام شيكسبير", subject: "قصص عالمية", publisher: "هنداوي", driveLink: "https://drive.google.com/file/d/1GjLXf2OvsdypCva9Uf34mbchFkYSjBtd/view?usp=drive_link", bio: "شاعر وكاتب مسرحي إنجليزي، يُعتبر أعظم كاتب في اللغة الإنجليزية ومن أبرز الأدباء عالمياً.", summary: "مسرحية كوميدية شهيرة تتناول الصراع بين طباع الرجل والمرأة بأسلوب حواري ذكي وشاعري فذ." },
  { id: 12, title: "جعجعة بدون طحن", author: "ويليام شيكسبير", subject: "قصص عالمية", publisher: "دار نظير عبود", driveLink: "https://drive.google.com/file/d/1Myn0epkZJEkV2CQO_xaLpmJu6DFu0rrt/view?usp=drive_link", bio: "الملقب بـ 'شاعر آفون'، استطاعت مسرحياته أن تعبر الزمن لتلامس مشاعر البشر في كل مكان وزمان.", summary: "عمل مسرحي كوميدي رائع يدور حول سوء الفهم والمؤامرات العاطفية في إطار من الفكاهة والذكاء." },
  { id: 13, title: "دايفيد كوبرفيلد", author: "تشارلز ديكنز", subject: "قصص عالمية", publisher: "مكتبة الأسرة 2000", driveLink: "https://drive.google.com/file/d/1MCmhkl0ul9zmZ7jvdaSKmG4bwLdHDRHz/view?usp=drive_link", bio: "روائي عبقري صور التناقضات الصارخة في المجتمع الإنجليزي بلغة عاطفية وسردية مذهلة.", summary: "رواية شبه ذاتية تروي رحلة نمو بطلها من الطفولة إلى النضج، مواجهاً تحديات الحياة والفقر بالأمل." },
  { id: 14, title: "دمبي وولده", author: "تشارلز ديكنز", subject: "قصص عالمية", publisher: "جداران المعرفة", driveLink: "https://drive.google.com/file/d/14ex-UE5dQDaZtdeQ9s4KUd0-YYH4_Lfh/view?usp=drive_link", bio: "أستاذ السرد الفيكتوري الذي استطاع أن يجعل من الحكاية الاجتماعية أداة للتغيير الفكري والروحي.", summary: "دراما عائلية حول الكبرياء والمال، وتأثيرهما على الروابط الإنسانية داخل عائلة السيد دمبي." },
  { id: 15, title: "قصة مدينتين", author: "تشارلز ديكنز", subject: "قصص عالمية", publisher: "دار العلم للملايين", driveLink: "https://drive.google.com/file/d/1baMVDkz88y5uRMIp1Aj506WZPD5dpibU/view?usp=drive_link", bio: "كاتب تميز بأسلوبه الذي يجمع بين التراجيديا والكوميديا، وأصبحت رواياته رموزاً للعدالة الاجتماعية.", summary: "ملحمة تاريخية تدور أحداثها بين لندن وباريس خلال الثورة الفرنسية، مجسدةً أعظم صور التضحية." },
  { id: 16, title: "هملت : أمير دانمركة", author: "ويليام شيكسبير", subject: "قصص عالمية", publisher: "دار المعارف", driveLink: "https://drive.google.com/file/d/1qWz0xEuQUqhGQtESVtVo_pmC4DLIP4L-/view?usp=drive_link", bio: "عملاق الأدب المسرحي، ناقش في أعماله أعمق قضايا الوجود والروح البشرية بصورة خالدة.", summary: "أشهر تراجيديا عالمية، تتناول موضوع الانتقام والتردد الوجودي من خلال قصة الأمير هملت التاريخية." },
  { id: 17, title: "مذكرات بكوك", author: "تشارلز ديكنز", subject: "قصص عالمية", publisher: "هنداوي", driveLink: "https://drive.google.com/file/d/1_okaw0LTO6nSyLJrQrDHCOYCndk4wdgF/view?usp=drive_link", bio: "الروائي الذي أسر القلوب بابتكاره لشخصيات نابضة بالحياة تعكس طرائف المجتمع وعيوبه.", summary: "مجموعة من الحكايات الفكاهية التي تروي مغامرات السيد بكوك وأصدقائه في رحلاتهم عبر إنجلترا." },
  { id: 18, title: "سلسلة رجل المستحيل", author: "نبيل فاروق", subject: "قصص بوليسية", publisher: "المؤسسة العربية الحديثة", driveLink: "https://drive.google.com/drive/folders/1yjQ37_OKjp0N7VB6BrIVP7SNzQLAU2fS?usp=drive_link", bio: "رائد أدب الجاسوسية العربي، صنع شخصية 'أدهم صبري' التي ألهبت خيال ملايين القراء الشباب.", summary: "مغامرات شيقة لجهاز المخابرات المصري، تعتمد على الذكاء الخارق والمهارات القتالية في حماية الوطن." },
  { id: 19, title: "سلسلة ما وراء الطبيعة", author: "أحمد خالد توفيق", subject: "أدب خيالي", publisher: "المؤسسة العربية الحديثة", driveLink: "https://drive.google.com/drive/folders/1qJD1adnBDMgQFPWMSnMM3KJmbVlmBr6W?usp=drive_link", bio: "أديب مصري استثنائي، نقل الرعب الميتافيزيقي إلى الأدب العربي بأسلوب ساخر وفريد.", summary: "سلسلة أيقونية تروي مذكرات الطبيب رفعت إسماعيل مع الأساطير والظواهر الخارقة للطبيعة." },
  { id: 20, title: "سلسلة الشياطين ال13", author: "محمود سالم", subject: "أدب خيالي", publisher: "هنداوي", driveLink: "https://drive.google.com/drive/folders/1OoXAgtzyZ4QK0WIIJPCU5IICwlUPED0w?usp=drive_link", bio: "رائد أدب الألغاز للناشئة، اشتهر بابتكار فرق المغامرين التي تعلم الأطفال التعاون والذكاء.", summary: "مغامرات بوليسية دولية تخوضها مجموعة من الشباب الموهوبين لمحاربة الجريمة في كل مكان." },
  { id: 21, title: "مختصر تفسير ابن كثير", author: "الحافظ أبي الفداء اسماعيل بن كثير", subject: "تفسير القرآن", publisher: "دار المعرفة", driveLink: "https://drive.google.com/drive/folders/1lLmRHktJSbAJjjX0Wdh4shjHyweQy_0h?usp=drive_link", bio: "مؤرخ ومفسر وفقيه، صاحب 'تفسير القرآن العظيم' الذي يُعد من أصح وأشهر كتب التفسير.", summary: "نسخة مختصرة لواحد من أمهات كتب التفسير، يعتمد على تفسير القرآن بالقرآن وبالسنة النبوية." },
  { id: 22, title: "أنبياء الله", author: "أحمد بهجت", subject: "قصص الأنبياء", publisher: "دار الشروق", driveLink: "https://drive.google.com/file/d/1lYq2LekqrEL2lnWQb1ogMd5saEo43860/view?usp=drive_link", bio: "كاتب وصحفي مصري متميز، امتاز بأسلوبه الأدبي الصوفي الرقيق في عرض القصص الدينية.", summary: "عرض أدبي راقٍ لسير أنبياء الله عليهم السلام، يستخلص العبر والحكمة من حياتهم ودعوتهم." },
  { id: 23, title: "قصص الأنبياء ومعها سيرة الرسول صلى الله عليه وسلم", author: "محمد متولي الشعراوي", subject: "قصص الأنبياء", publisher: "دار القدس", driveLink: "https://drive.google.com/file/d/1QNUYu7lHEh9FdoBD8gptW14jEmFqBspb/view?usp=drive_link", bio: "إمام الدعاة، تميز بقدرته الفائقة على تبسيط أعمق المعاني الإيمانية لتصل لقلوب كافة المسلمين.", summary: "شرح إيماني عميق لقصص الأنبياء وسيرة المصطفى ﷺ، يركز على الجوانب التربوية والروحية." },
  { id: 24, title: "قصص الأنبياء للأطفال", author: "محمود المصري", subject: "قصص الأنبياء", publisher: "مكتبة الصفا", driveLink: "https://drive.google.com/file/d/1t6mWRohKvE0RmqI9TcM7JqtD07bGWqkm/view?usp=drive_link", bio: "داعية إسلامي مصري، عُرف بأسلوبه المحبب والسهل في تقديم التربية الإسلامية للأجيال الناشئة.", summary: "مجموعة من قصص الأنبياء مصاغة بأسلوب مبسط وجذاب يناسب إدراك وخيال الأطفال الصغار." },
  { id: 25, title: "قصص الحيوان في القرآن", author: "أحمد بهجت", subject: "أدب إسلامي", publisher: "دار الشروق", driveLink: "https://drive.google.com/file/d/1N9pbgYG1qLrfiwLEnUeiAFL8tFdcOksr/view?usp=drive_link", bio: "مفكر أدبي مبدع استطاع أن يسخر القلم لخدمة الفكر الإسلامي بجمالية لغوية منقطعة النظير.", summary: "حكايات ممتعة على لسان الحيوانات التي ورد ذكرها في القرآن، توضح المعجزات بأسلوب تربوي." },
  { id: 26, title: "شرح الأربعين النووية", author: "زين الدين عبد الرؤوف المناوي الشافعي", subject: "كتب سنة", publisher: "دار الضياء", driveLink: "https://drive.google.com/file/d/1L6-Q83l5OdNujMAjJ2UtxxG-a04hvyPE/view?usp=drive_link", bio: "عالم ومحدث، من كبار فقهاء الشافعية، صاحب تصانيف علمية رصينة أثرت المكتبة الإسلامية.", summary: "تحليل لغوي وشرعي للأحاديث الأربعين التي جمعها الإمام النووي لتكون أصولاً للدين الإسلامي." },
  { id: 27, title: "صحيح البخاري", author: "أبي عبدالله محمد بن اسماعيل البخاري", subject: "كتب سنة", publisher: "دار ابن كثير", driveLink: "https://drive.google.com/file/d/1j7rtHR8fP3et3p1cQ8fB15Wb4Of8GBnG/view?usp=drive_link", bio: "أمير المؤمنين في الحديث، أفنى حياته في جمع وتدقيق سنة النبي ﷺ في أصح كتاب بعد القرآن.", summary: "الجامع الصحيح المسند من حديث رسول الله ﷺ وسننه وأيامه، المرجع الأول للسنة النبوية." },
  { id: 28, title: "صحيح مسلم", author: "أبي الحسين مسلم بن الحجاج القشيري النيسابوري", subject: "كتب سنة", publisher: "دار الحديث", driveLink: "https://drive.google.com/file/d/1k3nMYrD9V40GGP2BDJ18IinXBWXbL-04/view?usp=drive_link", bio: "إمام جليل وتلميذ البخاري، وضع منهجاً علمياً صارماً في ترتيب وصحة الأحاديث النبوية الشريفة.", summary: "ثاني أصح كتب الحديث الشريف، يمتاز بحسن الترتيب وسياق الطرق المتعددة للحديث الواحد." },
  { id: 29, title: "الأب الغني والأب الفقير", author: "روبرت تي. كيوساكي", subject: "تنمية بشرية", publisher: "مكتبة جرير", driveLink: "https://drive.google.com/file/d/17S2yXqeKbybMCdpuxV_vZU3McSarrp-1/view?usp=drive_link", bio: "مستثمر ومؤلف أمريكي عالمي، يعتبر أحد أهم المحاضرين في مجال الوعي المالي الشخصي.", summary: "دليل عملي يعلمك كيفية بناء الثروة والفرق الجوهري بين الأصول والخصوم بأسلوب ملهم." },
  { id: 30, title: "الرقص مع الحياة", author: "مهدي الموسوي", subject: "تنمية بشرية", publisher: "مدارك", driveLink: "https://drive.google.com/file/d/1GNcOcjbcGARMXTMh0A0wYnaOxDHQ2ivt/view?usp=drive_link", bio: "كاتب وباحث في علم النفس الإيجابي، يدعو دائماً لتبسيط الحياة والتركيز على السعادة الروحية.", summary: "كتاب يدعوك لتذوق متعة الحياة الحقيقية، والبحث عن الكنوز الداخلية في أعماق نفسك." },
  { id: 31, title: "المفاتيح العشرة للنجاح", author: "إبراهيم الفقي", subject: "تنمية بشرية", publisher: "راية للنشر", driveLink: "https://drive.google.com/file/d/1Oi25K6qOcePeORTEFaev4dFkWGFonwdf/view?usp=drive_link", bio: "رائد التنمية البشرية في الوطن العربي، مؤسس علم قوة الطاقة البشرية ومدرب الملايين.", summary: "خلاصة تجارب الدكتور الفقي في كيفية السيطرة على الذات وتحويل الأحلام إلى واقع ملموس." },
  { id: 32, title: "خوارق اللاشعور أو اسرار الشخصيه الناجحه ", author: " علي الوردي ", subject: "تنمية بشرية", publisher: "الوراق", driveLink: "https://drive.google.com/file/d/1_8qsQrkCoIDFJbFD1lB7be6JpOApErLR/view?usp=drive_link", bio: "عالم اجتماع ومفكر عراقي، تميز بتحليله الجريء للنفس البشرية والمجتمع بأسلوب علمي.", summary: "دراسة في طبيعة النفس البشرية والعوامل الخفية التي تصنع النجاح أو الفشل في الشخصية." },
  { id: 33, title: "قوة الآن : الدليل إلى التنوير الروحي", author: "ايكهارت تول", subject: "تنمية بشرية", publisher: "دار علاء الدين", driveLink: "https://drive.google.com/file/d/1_jmXl_PDCqU1ElBcJZGYLoUIydM32mec/view?usp=drive_link", bio: "مرشد روحي ومؤلف ألماني الأصل، تعتبر كتبه من الأكثر مبيعاً في مجال الوعي والسكينة النفسية.", summary: "رحلة روحية تعلمك كيف تعيش في اللحظة الحالية وتتخلص من آلام الماضي وقلق المستقبل." },
  { id: 34, title: "أربعون", author: "أحمد الشقيري", subject: "تنمية بشرية", publisher: "الدار العربية للعلوم", driveLink: "https://drive.google.com/file/d/1IFeA8ElveWPYWKuiWQIhR4zdmZPSwKa0/view?usp=drive_link", bio: "إعلامي ومفكر سعودي، اشتهر ببرنامج 'خواطر' الذي هدف لإحداث نهضة فكرية وشبابية.", summary: "خلاصة تأملات الشقيري خلال خلوته، يقدم 40 فكرة في تطوير الذات، العلاقة مع الله، وتحسين المجتمع." },
  { id: 35, title: "كيف تكسب الأصدقاء وتؤثر في الناس", author: "ديل كارنيجي ", subject: "تنمية بشرية", publisher: "الأهلية", driveLink: "https://drive.google.com/file/d/168TUXU8P_5HcFmSKkrctOOFX0HG30Vbr/view?usp=drive_link", bio: "كاتب ومحاضر أمريكي، يُعد الأب الروحي لفنون التواصل والتعامل مع الآخرين في العصر الحديث.", summary: "الدليل الذهبي في فنون التواصل الإنساني، يقدم قواعد خالدة لكسب محبة الناس وبناء علاقات ناجحة." }
];

const ArabicLibraryInternalPage: React.FC = () => {
  const { locale, dir } = useLanguage();
  const isAr = locale === 'ar';
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [selectedBio, setSelectedBio] = useState<any>(null);
  const [ripples, setRipples] = useState<{ id: number, x: number, y: number }[]>([]);

  const subjects = useMemo(() => [...new Set(ARABIC_LIBRARY_DATABASE.map(b => b.subject))], []);

  const filteredContent = useMemo(() => {
    return ARABIC_LIBRARY_DATABASE.filter(item => {
      const term = searchTerm.toLowerCase();
      const matchesSearch = item.title.toLowerCase().includes(term) || item.author.toLowerCase().includes(term);
      const matchesSub = subjectFilter === 'all' || item.subject === subjectFilter;
      return matchesSearch && matchesSub;
    });
  }, [searchTerm, subjectFilter]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    (e.currentTarget as HTMLElement).style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    (e.currentTarget as HTMLElement).style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  };

  const handleInteraction = (e: React.MouseEvent, action: () => void) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setRipples(prev => [...prev, { id: Date.now(), x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setTimeout(action, 400);
  };

  return (
    <div dir={dir} className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-1000 relative">
      
      {/* زر العودة */}
      <button onClick={() => navigate(-1)} className="mb-10 flex items-center gap-2 text-gray-500 hover:text-red-600 font-black transition-colors group">
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transform group-hover:-translate-x-1 ${isAr ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        {isAr ? 'العودة للمكتبة الرقمية' : 'Back'}
      </button>

      {/* الفهرس الذكي (Search Bar & Filters) */}
      <div onMouseMove={handleMouseMove} className="glass-panel glass-card-interactive p-8 rounded-[2.5rem] shadow-2xl mb-12 border-white/30 sticky top-24 z-30 backdrop-blur-3xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 relative z-10">
          <div className="lg:col-span-2 relative">
            <input 
              type="text" 
              placeholder={isAr ? "ابحث بالعنوان أو اسم المؤلف..." : "Search title or author..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-4 ps-12 rounded-2xl bg-white/50 dark:bg-gray-900/50 border-2 border-transparent focus:border-red-600 outline-none font-black text-gray-950 dark:text-white transition-all shadow-inner"
            />
            <svg className="absolute start-4 top-4 h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} className="p-4 rounded-2xl bg-white/40 dark:bg-gray-800/60 border border-white/10 dark:text-white font-black cursor-pointer appearance-none shadow-sm">
            <option value="all">{isAr ? "كل التصنيفات" : "All Categories"}</option>
            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* شبكة كروت الكتب */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredContent.map((item) => (
          <div key={item.id} onMouseMove={handleMouseMove} className="glass-panel glass-card-interactive group relative overflow-hidden p-8 rounded-[3rem] border-white/20 flex flex-col justify-between hover:scale-[1.03] transition-all duration-500 h-full shadow-lg">
            {ripples.map(r => <span key={r.id} className="ripple-effect border-red-500/20" style={{ left: r.x, top: r.y }} />)}
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-5">
                <span className="bg-red-600 text-white px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-md">{item.subject}</span>
                <span className="text-3xl filter grayscale group-hover:grayscale-0 transition-all duration-500">📖</span>
              </div>
              
              <h2 className="text-2xl font-black text-gray-950 dark:text-white mb-2 group-hover:text-red-600 transition-colors leading-tight tracking-tighter line-clamp-2 h-14 overflow-hidden">{item.title}</h2>
              <p className="text-green-700 dark:text-green-400 font-black text-sm mb-1">{item.author}</p>
              <p className="text-[10px] text-gray-500 font-bold mb-4 italic line-clamp-1">{item.publisher}</p>
              
              {/* ملخص الذكاء الاصطناعي */}
              <div className="bg-black/5 dark:bg-white/5 p-5 rounded-[1.5rem] border border-white/10 mb-6">
                <p className="text-[9px] text-red-600 font-black uppercase mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse shadow-[0_0_10px_rgba(220,38,38,0.5)]"></span>
                  ملخص صقر AI
                </p>
                <p className="text-gray-700 dark:text-gray-300 font-medium italic text-sm leading-relaxed line-clamp-3">"{item.summary}"</p>
              </div>
            </div>

            {/* الأزرار التفاعلية */}
            <div className="flex flex-col gap-3 z-10">
              <button 
                onClick={(e) => handleInteraction(e as any, () => setSelectedBio(item))}
                className="w-full bg-white/40 dark:bg-white/5 border border-red-500/30 text-gray-900 dark:text-white font-black py-3 rounded-2xl hover:bg-red-600 hover:text-white transition-all text-xs active:scale-95"
              >
                نبذة عن المؤلف
              </button>
              <a 
                href={item.driveLink} 
                target="_blank" 
                rel="noopener noreferrer"
                onMouseDown={(e) => handleInteraction(e as any, () => {})}
                className="relative overflow-hidden w-full bg-gray-950 text-white dark:bg-white dark:text-gray-950 font-black py-4 rounded-[1.5rem] flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all group/btn"
              >
                {ripples.map(r => <span key={r.id} className="ripple-effect border-red-500/30" style={{ left: r.x, top: r.y }} />)}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                <span>تصفح المحتوى</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* نافذة نبذة المؤلف المنبثقة (Modal) */}
      {selectedBio && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="glass-panel w-full max-w-lg p-10 rounded-[3rem] border-white/20 shadow-2xl relative animate-in zoom-in-95">
             <button onClick={() => setSelectedBio(null)} className="absolute top-6 end-6 p-2 bg-red-600 text-white rounded-full hover:scale-110 transition-transform">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
             <h3 className="text-3xl font-black text-gray-950 dark:text-white mb-2">{selectedBio.author}</h3>
             <p className="text-red-600 font-black uppercase text-xs tracking-widest mb-6">نبذة تاريخية (AI Bio)</p>
             <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed font-medium">"{selectedBio.bio}"</p>
             <div className="mt-8 pt-6 border-t border-black/5 dark:border-white/10 flex justify-center">
                <img src="/school-logo.png" alt="EFIIPS" className="h-10 opacity-30 logo-white-filter" />
             </div>
          </div>
        </div>
      )}

      {/* الفوتر الرسمي لمدرسة صقر الإمارات */}
      <div className="mt-24 flex flex-col items-center gap-4 opacity-15 grayscale hover:grayscale-0 transition-all duration-700">
          <img src="/school-logo.png" alt="EFIIPS" className="h-24 w-auto logo-white-filter" />
          <p className="font-black text-[10px] uppercase tracking-[0.3em] text-gray-500">Emirates Falcon International Private School</p>
      </div>
    </div>
  );
};

export default ArabicLibraryInternalPage;
