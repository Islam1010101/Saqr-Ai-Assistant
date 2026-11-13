import { DIGITAL_SERIES_VOLUMES } from '../src/data/digitalSeriesVolumes.js';
import { ENGLISH_PHOTO_LIBRARY_20261111 } from '../src/data/englishPhotoLibrary20261111';
import { PHOTO_SERIES_FOLDERS_20261111 } from '../src/data/photoSeriesFolders20261111.js';
import { MAN_IMPOSSIBLE_20261112_CATALOG } from '../src/data/manImpossible20261112Index';
import { reviewArabicDigitalLibrary } from '../src/data/arabicEditorialReview20261112';
import {NEW_PHOTO_ONLY_ARABIC_BOOKS} from '../src/data/photoOnlyArabicCatalog20261110';
import {ADDITIONAL_ARABIC_PHOTO_BOOKS} from '../src/data/additionalArabicPhotoBooks20261110';
import {MIGRATED_ARABIC_PHOTO_SOURCES} from '../src/data/migratedArabicPhotoSources20261110';

/** Shared single source for both digital libraries and Saqr catalog search.
 * Keep book metadata, IDs, links and existing display behavior unchanged.
 */
export type DigitalLibraryBook = {
  id: string | number;
  title: string;
  author: string;
  subject: string;
  driveLink: string;
  bio: string;
  summary: string;
  publisher?: string;
  audioId?: string;
  /** Set only after a school reviewer checks the actual edition. */
  reviewedAgeGroup?: 'children' | 'teens' | 'adults';
  readingLevel?: string;
  pageCount?: number;
  edition?: string;
  /** True only for a separately labeled partial photo excerpt or promotional preview. */
  isExcerpt?: boolean;
  keywords?: string[];
  /** A volume appears as an individual book while retaining its series grouping. */
  series?: string;
  seriesOrder?: number;
  /** School-facing reading audience suggestion, distinct from edition-approved age metadata. */
  readingAudience?: 'children' | 'teens' | 'adults';
  reviewStatus?: 'pending' | 'approved' | 'needs-changes';
  /** Open privately in Google Drive with the school Google account; not a public PDF proxy source. */
  requiresSchoolGoogleAccess?: boolean;
  /** Verified raw Drive PDF size; used to avoid Google preview for very large books. */
  fileSizeBytes?: number;
  /** Verified English photo-edition page-manifest batch. */
  photoBatch?: string;
  reviewedOn?: string;
};
const ARABIC_LIBRARY_SEED: DigitalLibraryBook[] = [
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
    { id: "AR_41", pageCount: 199, readingAudience: 'teens', title: "ألف اختراع واختراع", author: "رولاند جاكسون", subject: "التراث العربي", publisher: "ناشونال جيوجرافيك", driveLink: "https://drive.google.com/file/d/1_4IKkimJy1MmApcRz_0HA9_wKWy6H-Mp", bio: "باحث ومؤرخ اهتم بإبراز الإسهامات العلمية للحضارة الإسلامية.", summary: "موسوعة مصورة مذهلة تستعرض الإنجازات العلمية الإسلامية التي شكلت عالمنا الحديث." },
    { id: "AR_42", title: "سلطان وقصص القرآن", author: "وائل عادل", subject: "أدب إسلامي", publisher: "مركز الوجدان الحضاري - وزارة الثقافة دولة قطر", driveLink: "https://drive.google.com/drive/folders/1FfcyIwRkO-Nn_Gq1RzPtDGfLG4mQwXSZ?usp=drive_link", bio: "ينطلق مركز الوجدان الحضاري من فكرة أساسية وهي: أن وجدان أي أمة هو ضميرها ومشاعرها وطريقة تكوينها الفكري والعاطفي.", summary: "مجموعة قصصية لغرس القيم بوجدان الأطفال بطريقة مشوقة، عبر بطل القصص الطائر “سلطان”." },
    { id: "AR_43", title: "3D قصص الأنبياء", author: "متنوع", subject: "أدب إسلامي", publisher: "New Horizon", driveLink: "https://drive.google.com/drive/folders/1xZ6XqVdf_OG-tRf8068Q6VXrAPz7obQW?usp=drive_link", bio: "شركة متخصصة في كتب الأطفال والمناهج التعليمية العربية والإنجليزية.", summary: "مجموعة كتب تضم رسوماً كرتونية بتقنية ثلاثية الأبعاد تشرح قصص الأنبياء المذكورين في القرآن الكريم بأسلوب شيق." },
    { id: "AR_44", pageCount: 104, readingAudience: 'children', title: "الفيزياء للصغار", author: "ليونيد سيكوروك", subject: "علوم", publisher: "دار مير للطباعة والنشر", driveLink: "https://drive.google.com/file/d/1l_-lECWoN0C3ARPD70oaD_4Ee3J6wb3p/view?usp=drive_link", bio: "مؤلف روسي معروف بكتابه المبسط في الفيزياء للأطفال.", summary: "يُعد هذا الكتاب مثالاً لجهود تبسيط العلوم لغير المتخصصين، وحظي بتقدير واسع النطاق في الأوساط العربية." },
    { id: "AR_45", pageCount: 416, readingAudience: 'teens', title: "أعظم 100عالم غيروا العالم", author: "جون بالتشين", subject: "علوم", publisher: "دار الكتب العلمية", driveLink: "https://drive.google.com/file/d/1aOHxire8Y9UWIdV6cO0Hc1nw2VWpEBYf/view?usp=drive_link", bio: "كاتب ومؤلف بريطاني متخصص في تبسيط العلوم وتاريخها.", summary: "يسرد الكتاب جذور الاكتشافات العلمية الحديثة بحيث يذكر مختلف العلماء وما ساهموا في اكتشافه." },
    { id: "AR_46", title: "أرض زيكولا", author: "عمرو عبدالحميد", subject: "أدب خيالي", publisher: "عصير الكتب", driveLink: "https://drive.google.com/file/d/1Mihna00ArISLe5SUifUemqbU3HoVIIEa/view?usp=drive_link", bio: "كاتب وطبيب مصري بارز، يُعد من أشهر روائيي الفنتازيا والخيال في الوطن العربي.", summary: "شاب عادي يدخل سرداب فوريك الغامض ليجد نفسه في عالم يتعامل بوحدات الذكاء بدلاً من المال.", audioId: "/audio/Zkola.mp3" },
    { id: "AR_47", title: "أماريتا", author: "عمرو عبدالحميد", subject: "أدب خيالي", publisher: "عصير الكتب", driveLink: "https://drive.google.com/file/d/17ultoN_mUJaG360jAp6t4JtXkQQoNKUS/view?usp=drive_link", bio: "كاتب وطبيب مصري بارز، يُعد من أشهر روائيي الفنتازيا والخيال في الوطن العربي.", summary: "الطبيبة أسيل تُتهم بالخيانة العظمى لقوانين زيكولا، وتُجبر على الهروب من مدينتها.", audioId: "/audio/Amarita.mp3" },
    { id: "AR_48", title: "وادي الذئاب المنسية", author: "عمرو عبدالحميد", subject: "أدب خيالي", publisher: "عصير الكتب", driveLink: "https://drive.google.com/file/d/1UeaCT1D75jpzjESxUw-ztusUvBrXXV4Q/view?usp=drive_link", bio: "كاتب وطبيب مصري بارز، يُعد من أشهر روائيي الفنتازيا والخيال في الوطن العربي.", summary: "يامن يخوض مغامرة كبرى في عالم زيكولا وأماريتا بعد سنوات من نهاية أحداث الجزء السابق.", audioId: "/audio/Wolf.mp3" },
    { id: "AR_49", title: "جلسات نفسية", author: "محمد إبراهيم", subject: "تنمية بشرية", publisher: "عصير الكتب", driveLink: "https://drive.google.com/file/d/1rvbFWFmgQ65Ufub-6tC-AeuqCYiNOW82/view?usp=drive_link", bio: "كاتب وأخصائي في علم النفس،​​ يتميز بقدرته على تبسيط المفاهيم النفسية وتقديمها بأسلوب سلس.", summary: "مجموعة من الجلسات النفسية التي تهدف إلى تحسين الصحة النفسية وتعزيز الرفاهية بأساليب فعالة." },
    { id: "AR_50", pageCount: 222, readingAudience: 'teens', title: "كليلة ودمنة", author: "عبدالله بن المقفع", subject: "أدب خيالي", publisher: "هنداوي", driveLink: "https://drive.google.com/file/d/1manKVHamsvHDO-37IxmecGeKOtKxpJhB/view?usp=drive_link", bio: "أديب ومفكر عبقري من العصر العباسي، اشتهر ببلاغته الاستثنائية ودوره المحوري في نقل الحكمة الفارسية.", summary: "كتاب قصصي ذو أصول هندية تدور أحداثه على ألسنة الحيوانات والطيور لتقديم نصائح وحكم.", audioId: "/audio/كليلة.mp3" },
    { id: "AR_51", title: "مغامرات جحا", author: "مؤلفون", subject: "أدب عربي/تراث", publisher: "المؤسسة العربية الحديثة", driveLink: "https://drive.google.com/drive/folders/1WCsXruxkyuiG-QV6iXFGMemtwv6vvq3-?usp=drive_link", bio: "مجموعة من المؤلفين العرب", summary: "قصص فكاهية تعكس ذكاءً فطرياً وسخرية فلسفية من مواقف الحياة اليومية، حيث يتقمص جحا دور الأحمق ليعطي دروساً عميقة وحكماً بليغة." },
    { id: "AR_52", pageCount: 160, readingAudience: 'adults', title: "أخلاقيات الذكاء الاصطناعي", author: "مارك كوكلبيرج", subject: "تكنولوجيا", publisher: "هنداوي", driveLink: "https://drive.google.com/file/d/1A98xA-eWvm8Z_Gktfg-XmSLmT0Xkz9wB/view?usp=drive_link", bio: "أستاذ فلسفة الإعلام والتكنولوجيا في جامعة فيينا بفرنسا، وعضو في مجموعات استشارية رفيعة المستوى حول الذكاء الاصطناعي لدى المفوضية الأوروبية. يُعرف بقدرته على ربط الأسئلة الفلسفية العميقة بالتحديات التقنية والسياسية الراهنة.", summary: "يُعد كتاب أخلاقيات الذكاء الاصطناعي (AI Ethics)، الصادر ضمن سلسلة MIT Press Essential Knowledge ، أحد أهم المراجع الحديثة التي تُفند المعضلات الأخلاقية الناتجة عن تطور التقنيات الذكية بأسلوب فلسفي وعملي في آن واحد." },
    { id: "AR_53", pageCount: 174, readingAudience: 'teens', title: "التفكير الحوسبي", author: "بيتر جيه دنينج ، ماتي تيدري", subject: "تكنولوجيا", publisher: "هنداوي", driveLink: "https://drive.google.com/file/d/1X0h06VJmX9BUWhZsDPx6TTGIDdV6YzsK/view?usp=drive_link", bio: "بيتر جيه دنينج (Peter J. Denning): أحد رواد علوم الحاسوب، ورئيس سابق لجمعية آلات بمساهمات تأسيسية في أنظمة التشغيل والشبكات", summary: "يُعد كتاب التفكير الحوسبي (Computational Thinking)، وهو أيضاً جزء من سلسلة MIT Press Essential Knowledge، مرجعاً أساسياً لفهم كيف غيرت علوم الحاسوب الطريقة التي نحل بها المشكلات، ليس فقط في البرمجة، بل في مختلف مجالات الحياة." },
    { id: "AR_54", pageCount: 284, readingAudience: 'teens', title: "الدماغ المبتكر", author: "مين جونج", subject: "تكنولوجيا", publisher: "هنداوي", driveLink: "https://drive.google.com/file/d/1GZpt4CrcZomX4WHyoh6E2HcOdjrDCsBE/view?usp=drive_link", bio: "هو باحث متخصص في علوم الدماغ والذكاء، يركز في دراساته على كيفية تحويل العمليات العصبية المعقدة إلى مهارات عملية يمكن للإنسان استخدامها لتطوير قدراته الإبداعية وتوليد أفكار غير تقليدية.", summary: "يدحض الكتاب فكرة أن الإبداع موهبة فطرية يولد بها البعض وينحرم منها الآخرون، بل يؤكد أنه عضلة يمكن تدريبها من خلال فهم كيفية عمل الدماغ." },
    { id: "AR_55", pageCount: 172, readingAudience: 'children', title: "الرياح في أشجار الصفصاف", author: "كينيث جرام", subject: "أدب أطفال", publisher: "هنداوي", driveLink: "https://drive.google.com/file/d/1CwrvdNwi5yPQFvkce_OV_nHy0ipcvi0V/view?usp=drive_link", bio: "كاتباً إسكتلندياً، كتب هذه الرواية في الأصل كمجموعة من القصص والرسائل لابنه الصغير أليستير. استلهم جرام أحداث الرواية من الطبيعة الإنجليزية الهادئة التي كان يحبها، هرباً من ضغوط عمله الرسمي في بنك إنجلترا.", summary: "تُعد رواية الرياح في أشجار الصفصاف (The Wind in the Willows)، الصادرة عام 1908، واحدة من أعظم كلاسيكيات أدب الأطفال العالمي، وهي عمل أدبي يتجاوز الصغار ليخاطب الكبار برمزياته العميقة وجمال وصفه للطبيعة." },
    { id: "AR_56", pageCount: 362, readingAudience: 'adults', title: "ذكاء اصطناعي متوافق مع البشر: حتى لا تفرض الآلات سيطرتها على البشر", author: "ستيوارت راسل", subject: "تكنولوجيا", publisher: "هنداوي", driveLink: "https://drive.google.com/file/d/1ddbyuo2M2dfh-86lM3as1uoYDoB4fz1K/view?usp=drive_link", bio: "هو أحد أعمدة علم الذكاء الاصطناعي في العالم، وأستاذ علوم الحاسوب في جامعة كاليفورنيا ببرلين.", summary: "يُعتبر كتاب ذكاء اصطناعي متوافق مع البشر: مشكلة السيطرة (Human Compatible: Artificial Intelligence and the Problem of Control)، الصادر عام 2019، من أهم الكتب التي تتناول مستقبل البشرية في ظل وجود ذكاء اصطناعي فائق، ويُعد صرخة تحذير علمية رصينة من داخل المجتمع التقني نفسه." },
    { id: "AR_57", pageCount: 244, readingAudience: 'teens', title: "عشرون قصة من روائع شكسبير", author: "إديث نسبيت", subject: "أدب عالمي", publisher: "هنداوي", driveLink: "https://drive.google.com/file/d/1ocR16ZTGPIioAOMEMr1BY189jHFP3MJ_/view?usp=drive_link", bio: "هي رائدة أدب الأطفال الحديث، وصاحبة الرواية الشهيرة أطفال السكك الحديدية. تميزت بقدرتها الفائقة على تبسيط الأفكار العميقة وتقديمها بأسلوب قصصي جذاب يجمع بين المتعة والدرس الأخلاقي.", summary: "مسرحيات شكسبير الأصلية مكتوبة بلغة إنجليزية قديمة وشاعرية صعبة حتى على الكبار أحياناً. ما فعلته نسبيت هنا هو إعادة صياغة لأشهر المسرحيات بأسلوب نثري قصصي مشوق." },
    { id: "AR_58", pageCount: 42, readingAudience: 'children', title: "يوميات فوكس ميكي", author: "ساشا تشيورني", subject: "أدب عالمي", publisher: "هنداوي", driveLink: "https://drive.google.com/file/d/1m_d_qCj9CIEeAI7d8CDdJ02Yv30odXkE/view?usp=drive_link", bio: "هو شاعر وكاتب ساخر روسي شهير (1880-1932). عُرف بأسلوبه النقدي الساخر في شعره للكبار، لكنه عندما كتب للأطفال، قدم أعمالاً خالدة تميزت بقدرته المذهلة على التقمص النفسي، وأشهرها هذه اليوميات التي كتبها عام 1927.", summary: "الكتاب مكتوب بالكامل على لسان الكلب ميكي ، وهو من فصيلة فوكس تيرير (Fox Terrier). ميكي ليس مجرد كلب عادي، بل هو كلب مثقف يستطيع القراءة والكتابة (في خياله على الأقل)، ويقرر تدوين يومياته ليعبر عن وجهة نظره في عالم البشر الغريب." },
    { id: "AR_59", title: "همس الجنون", author: "نجيب محفوظ", subject: "أدب عالمي", publisher: "هنداوي", driveLink: "https://drive.google.com/file/d/1RQYTtBhOwni78bg5IwqW0UVQfp4546hD/view?usp=drive_link", bio: "رائدُ الرواية العربية، والحائزُ على أعلى جائزةٍ أدبية في العالَم ، وُلِد في ١١ ديسمبر ١٩١١م في حي الجمالية بالقاهرة، لعائلةٍ من الطبقة المتوسطة، وكان والده موظفًا حكوميًّا، وقد اختار له اسمَ الطبيب الذي أشرَف على وِلادته، وهو الدكتور نجيب محفوظ باشا، ليصبح اسمُه مُركَّبًا نجيب محفوظ.", summary: "يُبدِع «نجيب محفوظ»، عميد الرواية العربية وفارس القصة القصيرة، في هذه المجموعة القصصية التي كانت أُولى تَجارِبه القصصية والتي ضمَّت ثمانيًا وعشرين قصة، في السرد عن الجنون بلغةٍ سلسة مُحكَمة وحكمةٍ مُتوارية في همساته؛ جنون الحب، جنون العظمة، جنون الجوع، جنون المال، الجنون المحض" },
    {"id":"AR_60","pageCount":577,"readingAudience":"adults","title":"الأعمال الكاملة للشاعر صلاح جاهين","author":"صلاح جاهين","subject":"أدب عربي","publisher":"دار الصفوة","driveLink":"https://drive.google.com/file/d/1Nr4GIjwLKwfJFYkWzPgOaZMB5_6veZph/view?usp=sharing","bio":"صلاح جاهين هو شاعر عامية ورسام كاريكاتير ومؤلف مصري بارز، يُعد أحد أهم قامات الفن والثقافة في مصر بفضل رباعياته الشعرية الشهيرة وإسهاماته الخالدة في الأغنية الوطنية والمسرح.","summary":"يجمع كتاب الأعمال الكاملة لصلاح جاهين نتاجه الإبداعي الشامل؛ حيث يضم رباعياته الشهيرة كاملة، ودواوينه الشعرية العامية، بالإضافة إلى نصوص أعماله الغنائية والمسرحية الخالدة وعلى رأسها أوبريت الليلة الكبيرة."}
];
/** Editorial reading-group suggestions pending edition-level library approval.
 * No reviewedAgeGroup is inferred from the filename or series alone.
 */
const CHILDREN_AUDIENCE_IDS = new Set(["ar:AR_7","ar:AR_24","ar:AR_25","ar:AR_42","ar:AR_43","ar:AR_44","ar:AR_51","ar:AR_55","ar:AR_57","ar:AR_58"]);
const TEENS_AUDIENCE_IDS = new Set(["ar:AR_1","ar:AR_3","ar:AR_8","ar:AR_9","ar:AR_10","ar:AR_11","ar:AR_12","ar:AR_13","ar:AR_14","ar:AR_15","ar:AR_16","ar:AR_17","ar:AR_18","ar:AR_19","ar:AR_20","ar:AR_38","ar:AR_41","ar:AR_45","ar:AR_46","ar:AR_47","ar:AR_48","ar:AR_50"]);
function suggestedAudience(lang: 'ar'|'en', book: DigitalLibraryBook): 'children'|'teens'|'adults' {
  const key = lang + ':' + String(book.id);
  return CHILDREN_AUDIENCE_IDS.has(key) ? 'children' : TEENS_AUDIENCE_IDS.has(key) ? 'teens' : 'adults';
}

/** Expand series to their stable volume IDs; prefer fully verified photographed editions over legacy PDF links. */
function expandDigitalSeries(books: DigitalLibraryBook[], lang: 'ar'|'en'): DigitalLibraryBook[] {
  return books.flatMap<DigitalLibraryBook>(book => {
    const readingAudience = book.reviewedAgeGroup || book.readingAudience || suggestedAudience(lang, book);
    // Retire the original Man of the Impossible books; they are replaced only by complete new Drive JPEG editions.
    if (lang === 'ar' && String(book.id) === 'AR_18') return [];
    const volumes = DIGITAL_SERIES_VOLUMES[String(book.id)];
    if (!volumes?.length) return [{ ...book, readingAudience }];
    return volumes.map(volume => ({
      ...book,
      id: String(book.id) + '-' + volume.fileId,
      title: volume.title,
      driveLink: PHOTO_SERIES_FOLDERS_20261111[String(book.id) + '-' + volume.fileId]
        ? 'https://drive.google.com/drive/folders/' + PHOTO_SERIES_FOLDERS_20261111[String(book.id) + '-' + volume.fileId]
        : 'https://drive.google.com/file/d/' + volume.fileId + '/view',
      series: book.title,
      seriesOrder: volume.order ?? undefined,
      readingAudience,
      // Never mislabel each volume with its parent collection's unverified publisher.
      publisher: volume.fileId === '1RLqKQ0FGSQBo2PlRk4rCU4FEiUsByGQN' ? 'مكتبة النافذة'
        : String(book.id) === 'AR_7' ? 'دار المعارف' : undefined,
      summary: String(book.id).startsWith('AR_')
        ? 'كتاب مستقل ضمن سلسلة «' + book.title + '».'
        : 'An individual book in the ' + book.title + ' series.',
      // Existing standalone-book audioId values stay untouched; do not assign one series clip to every volume.
      reviewedAgeGroup: undefined,
      readingLevel: undefined,
      pageCount: undefined,
      edition: undefined,
      reviewStatus: undefined,
      reviewedOn: undefined,
    }));
  });
}

const VERIFIED_ARABIC_SOURCE_BY_ID = new Map(MIGRATED_ARABIC_PHOTO_SOURCES.map(source=>[source.id,source]));
const ARABIC_LIBRARY_PHOTO_SEED = ARABIC_LIBRARY_SEED.map(book => {
  const photo = VERIFIED_ARABIC_SOURCE_BY_ID.get(String(book.id));
  return photo ? {...book,driveLink:photo.driveLink,pageCount:photo.pageCount} : book;
});
// Include only the complete photo-only books belonging in the Arabic reading library.
// UAE national heritage books remain in their separate national identity catalog.
export const ARABIC_LIBRARY_DATABASE: DigitalLibraryBook[] = reviewArabicDigitalLibrary([
  ...expandDigitalSeries(ARABIC_LIBRARY_PHOTO_SEED, 'ar'),
  ...NEW_PHOTO_ONLY_ARABIC_BOOKS.filter(book=>!String(book.id).startsWith('NI_PH_')),
  ...ADDITIONAL_ARABIC_PHOTO_BOOKS,
  ...MAN_IMPOSSIBLE_20261112_CATALOG.map(book => ({...book, keywords:[...book.keywords]})),
]);
// The 10 prophet-book volume IDs remain untouched. All former Man of the Impossible records
// are replaced with the complete, duplicate-free November 12 Drive photo edition.
// Single official English catalog: the current, verified Drive photo editions only.
// All legacy PDF seeds and imports are retired; Saqr continues to read this shared export.
export const ENGLISH_LIBRARY_DATABASE: DigitalLibraryBook[] = ENGLISH_PHOTO_LIBRARY_20261111 as DigitalLibraryBook[];
