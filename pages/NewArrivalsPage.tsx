import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../App';

const pageTranslations = {
  ar: {
    title: "بوابة صقر للإصدارات الحديثة",
    subtitle: "كنز معرفي متجدد يضم أحدث الكتب والدراسات التي انضمت إلى مكتبتنا مع رصد شامل وموجز ذكي لكل مصنف.",
    backBtn: "العودة للرئيسية",
    by: "تأليف:",
    publisher: "الناشر:",
    category: "التصنيف:",
    searchPlaceholder: "ابحث عن جوهرة معرفية، مؤلف، أو دار نشر...",
    aiBadge: "ملخص صقر الذكي ✨",
    closeHint: "اضغط لإغلاق الملخص"
  },
  en: {
    title: "Saqr Portal For New Arrivals",
    subtitle: "A renewed knowledge treasure featuring the latest books and studies added to our library with smart AI summaries.",
    backBtn: "Back to Home",
    by: "By:",
    publisher: "Publisher:",
    category: "Category:",
    searchPlaceholder: "Search for a title, author, or publisher...",
    aiBadge: "Saqr AI Summary ✨",
    closeHint: "Tap to close summary"
  }
};

// المصفوفة الكاملة والشاملة لجميع الكتب من كافة المستندات مع الملخصات الذكية والتصنيفات
const ALL_BOOKS_DATA = [
  // --- مستند 1: سلامة بنت هزاع آل نهيان ---
  { titleAr: "يتامى في الغيب", authorAr: "سلامة بنت هزاع آل نهيان", publisherAr: "المؤلف", titleEn: "Orphans in the Unseen", authorEn: "Salama Bint Hazza Al Nahyan", publisherEn: "Author", catAr: "رواية", catEn: "Novel", summaryAr: "رواية أدبية بلمسة خيالية ساحرة تأخذ القارئ في رحلة مشاعر إنسانية عميقة واستكشاف الذات.", summaryEn: "A captivating literary novel with a touch of fantasy exploring deep human emotions and self-discovery." },
  { titleAr: "الحصان السلوقي والصقور", authorAr: "سلامة بنت هزاع آل نهيان", publisherAr: "المؤلف", titleEn: "The Horse, The Saluki & The Falcon", authorEn: "Salama Bint Hazza Al Nahyan", publisherEn: "Author", catAr: "تراث وثقافة", catEn: "Heritage", summaryAr: "قصة مشوقة تسلط الضوء على رموز البيئة البرية والتراثية الأصيلة لدولة الإمارات.", summaryEn: "An engaging story highlighting the authentic symbols of the UAE traditional wildlife and heritage." },
  { titleAr: "أم النار", authorAr: "سلامة بنت هزاع آل نهيان", publisherAr: "المؤلف", titleEn: "Umm Al Nar", authorEn: "Salama Bint Hazza Al Nahyan", publisherEn: "Author", catAr: "تاريخ وآثار", catEn: "History", summaryAr: "رحلة تاريخية تأخذ القراء الصغار لاستكشاف حضارة أبوظبي العريقة وحقبة أم النار الأثرية.", summaryEn: "A historic journey taking young readers to explore Abu Dhabi's ancient Umm Al Nar civilization." },
  { titleAr: "The Well Of Mysteries", authorAr: "سلامة بنت هزاع آل نهيان", publisherAr: "المؤلف", titleEn: "The Well Of Mysteries", authorEn: "Salama Bint Hazza Al Nahyan", publisherEn: "Author", catAr: "غموض ومغامرة", catEn: "Mystery", summaryAr: "مغامرة إنجليزية غامضة مليئة بالألغاز والتشويق التي تحفز التفكير التحليلي وحب الاستكشاف.", summaryEn: "A thrilling mystery novel filled with riddles that stimulate analytical thinking and discovery." },
  { titleAr: "The Invisible Orphans", authorAr: "سلامة بنت هزاع آل نهيان", publisherAr: "المؤلف", titleEn: "The Invisible Orphans", authorEn: "Salama Bint Hazza Al Nahyan", publisherEn: "Author", catAr: "قصص إنسانية", catEn: "Fiction", summaryAr: "قصة إنجليزية تلمس القلوب وتناقش قيم التكافل الاجتماعي والتعاطف الإنساني بين البشر.", summaryEn: "A touching English story discussing social solidarity and empathy among people." },

  // --- مستند 2: دائرة التعليم والمعرفة (ADEK) ---
  { titleAr: "سلسلة عالمي الصغير", authorAr: "محمد بن راشد آل مكتوم", publisherAr: "دون ناشر", titleEn: "My Little World Series", authorEn: "Mohammed bin Rashid Al Maktoum", publisherEn: "No Publisher", catAr: "هوية وطنية – أطفال", catEn: "National Identity - Kids", summaryAr: "قصص ملهمة تنقل مواقف وتجارب قيادية في قالب مبسط يغرس القيم وحب الوطن في نفوس النشء.", summaryEn: "Inspiring stories conveying leadership experiences in a simplified form to instil values in youth." },
  { titleAr: "حكاية رملة", authorAr: "السيد نون", publisherAr: "لؤلؤ للنشر والتوزيع", titleEn: "Ramla's Tale", authorEn: "Mr. Noon", publisherEn: "Lulu Publishing", catAr: "أطفال - حكايات", catEn: "Kids - Stories", summaryAr: "حكاية دافئة حول البيئة الصحراوية وارتباط الإنسان بالطبيعة وحبات الرمل الذهبية.", summaryEn: "A warm tale about the desert environment and the human connection to nature's golden sands." },
  { titleAr: "العنكبوتة الوردية", authorAr: "سهاد تيجاني", publisherAr: "لؤلؤ للنشر والتوزيع", titleEn: "The Pink Spider", authorEn: "Suhad Tijani", publisherEn: "Lulu Publishing", catAr: "قصص أطفال", catEn: "Kids Stories", summaryAr: "قصة طريفة تعلم الأطفال تقبل الاختلاف والتميز والبحث عن الجمال الداخلي في كل كائن.", summaryEn: "A funny story teaching children to accept diversity and search for inner beauty." },
  { titleAr: "أخيراً، وجدت أمي", authorAr: "دجى بن فرج", publisherAr: "لؤلؤ للنشر والتوزيع", titleEn: "Finally, I Found My Mother", authorEn: "Duja Bin Faraj", publisherEn: "Lulu Publishing", catAr: "قصص أطفال", catEn: "Kids Stories", summaryAr: "قصة عاطفية مؤثرة تتمحور حول مشاعر الأمان الأسري وأهمية حنان الأمومة في الحياة.", summaryEn: "A touching emotional story centering on family security and the vital warmth of motherhood." },
  { titleAr: "أنا طفل إماراتي", authorAr: "عبدة تقلا", publisherAr: "قنديل للطباعة والنشر", titleEn: "I Am a UAE Child", authorEn: "Abda Taqla", publisherEn: "Qandeel Printing", catAr: "هوية وطنية – أطفال", catEn: "National Identity - Kids", summaryAr: "قصائد وقصص قصيرة تعزز الاعتزاز بالهوية الإماراتية والتقاليد الثقافية الغنية للدولة.", summaryEn: "Poems and short tales reinforcing pride in UAE identity and its rich cultural traditions." },
  { titleAr: "أخبرني عن خوفك", authorAr: "جيكار خورشيد", publisherAr: "نبض القلم للنشر والتوزيع", titleEn: "Tell Me About Your Fear", authorEn: "Jekar Khorshid", publisherEn: "Nabdh Al Qalam", catAr: "ذكاء عاطفي - أطفال", catEn: "Emotional Intelligence", summaryAr: "كتاب تربوي يساعد الأطفال على فهم مشاعر الخوف والتعامل معها بطرق ذكية وإيجابية.", summaryEn: "An educational book helping kids understand and manage fear in intelligent, positive ways." },
  { titleAr: "أحمد بن ماجد: أسد البحار", authorAr: "عائشة الغيص", publisherAr: "الظبي للنشر", titleEn: "Ahmad bin Majid: Sea Lion", authorEn: "Aisha Al Ghais", publisherEn: "Al Dhabi Publishing", catAr: "هوية وطنية – أطفال", catEn: "National Identity - Kids", summaryAr: "قصة تاريخية مشوقة تسلط الضوء على مغامرات واكتشافات الملاح العربي الشهير ابن ماجد.", summaryEn: "An adventurous historical tale highlighting the sea discoveries of the legendary Arab navigator." },
  { titleAr: "الكلمات الدفينة لوليام القلق", authorAr: "وليام كيلي", publisherAr: "Austin Macauley", titleEn: "The Hidden Words of Anxious William", authorEn: "William Kelly", publisherEn: "Austin Macauley", catAr: "روايات يافعين", catEn: "Youth Novels", summaryAr: "رواية نفسية مشوقة تأخذ اليافعين في رحلة لمواجهة القلق وبناء الثقة بالنفس والصلابة الذاتية.", summaryEn: "A psychological novel leading youth on a journey to confront anxiety and build self-resilience." },
  { titleAr: "السيد بقعة وألوانه السبعة", authorAr: "سرى غزوان", publisherAr: "لؤلؤ للنشر", titleEn: "Mr. Spot and His Seven Colors", authorEn: "Sura Ghazwan", publisherEn: "Lulu Publishing", catAr: "أطفال", catEn: "Kids", summaryAr: "رحلة بصرية ممتعة للأطفال في عالم الألوان والابتكار تنمي الخيال والمهارات الإبداعية.", summaryEn: "A fun visual trip into the world of colors and innovation, boosting imagination and creativity." },
  { titleAr: "أسرار الفضاء مع هزاع وأصدقائه", authorAr: "هدى المشالي", publisherAr: "نبض القلم", titleEn: "Space Secrets with Hazza & Friends", authorEn: "Huda Al Mashali", publisherEn: "Nabdh Al Qalam", catAr: "علمي - يافعين", catEn: "Science - Youth", summaryAr: "رحلة تعليمية ممتعة في أعماق الفضاء الخارجي مستوحاة من إنجازات رواد الفضاء الإماراتيين.", summaryEn: "An exciting educational journey into deep space inspired by UAE space missions." },
  { titleAr: "حرف بلا نقطة", authorAr: "فاطمة الزهراء", publisherAr: "نبض القلم", titleEn: "A Letter Without a Dot", authorEn: "Fatima Al Zahraa", publisherEn: "Nabdh Al Qalam", catAr: "لغوي - أطفال", catEn: "Language - Kids", summaryAr: "قصة إبداعية ممتعة لتعريف الأطفال بجماليات اللغة العربية وحروفها بطريقة تفاعلية.", summaryEn: "An innovative, playful story introducing kids to the beauty of the Arabic alphabet." },
  { titleAr: "حكايات للأطفال في سن عامين", authorAr: "دون مؤلف", publisherAr: "مكتبة جرير", titleEn: "Tales for Two-Year-Olds", authorEn: "Anonymous", publisherEn: "Jarir Bookstore", catAr: "طفولة مبكرة", catEn: "Early Childhood", summaryAr: "مجموعة من القصص البسيطة والملونة المصممة خصيصاً لتنمية الإدراك البصري واللغوي المبكر.", summaryEn: "A collection of simple, colorful stories tailored to enhance early cognitive perception." },
  { titleAr: "مهارات القرن الحادي والعشرين", authorAr: "صفاء عزمي", publisherAr: "واحة الحكايات", titleEn: "21st Century Skills", authorEn: "Safaa Azmy", publisherEn: "Oasis of Stories", catAr: "تطوير مهارات", catEn: "Skills Development", summaryAr: "دليل عملي مبسط يهدف لتنمية مهارات التفكير النقدي، حل المشكلات والتعاون الجماعي.", summaryEn: "A simplified practical guide aimed at building critical thinking, problem-solving, and collaboration." },
  { titleAr: "هل أنا مختلف ؟", authorAr: "محمد العوهلي", publisherAr: "الهدهد للنشر", titleEn: "Am I Different?", authorEn: "Mohammed Al Ouhali", publisherEn: "Al Hudhud", catAr: "تربوي - أطفال", catEn: "Educational", summaryAr: "تعزيز ثقة الطفل بنفسه وتقدير ميزاته الخاصة واحترام الفروق الفردية بين الأصدقاء.", summaryEn: "Boosting child self-confidence, appreciating unique traits, and respecting individual differences." },
  { titleAr: "الهواء الماء الضوء", authorAr: "دون مؤلف", publisherAr: "مكتبة جرير", titleEn: "Air, Water, Light", authorEn: "Anonymous", publisherEn: "Jarir Bookstore", catAr: "علوم - أطفال", catEn: "Science - Kids", summaryAr: "شروحات وتجارب مبسطة تعرف الأطفال بعناصر الطبيعة الأساسية وأهميتها للحياة.", summaryEn: "Simplified experiments introducing children to the primary elements of nature and life." },
  { titleAr: "حكيم العرب", authorAr: "مريم صقر القاسمي", publisherAr: "الهدهد للنشر", titleEn: "Wise Man of the Arabs", authorEn: "Maryam Saqr Al Qasimi", publisherEn: "Al Hudhud", catAr: "هوية وطنية", catEn: "National Identity", summaryAr: "تناول شيق لسيرة ومواقف الوالد المؤسس الشيخ زايد، طيب الله ثراه، وقيمه الإنسانية.", summaryEn: "An engaging look at the life and timeless humanitarian values of the founding father, Sheikh Zayed." },
  { titleAr: "محمد بن زايد والتعليم", authorAr: "مركز الإمارات للدراسات", publisherAr: "مركز الإمارات للدراسات", titleEn: "Mohamed bin Zayed and Education", authorEn: "ECSSR", publisherEn: "ECSSR", catAr: "هوية وطنية", catEn: "National Identity", summaryAr: "يستعرض الرؤية الاستشرافية للقيادة الحكيمة في تطوير المنظومة التعليمية وبناء المستقبل.", summaryEn: "Highlights the wise leadership's vision for developing the educational system." },
  { titleAr: "أوليفر تويست : كوميكس", authorAr: "تشارلز ديكنز", publisherAr: "مكتبة جرير", titleEn: "Oliver Twist: Comics", authorEn: "Charles Dickens", publisherEn: "Jarir Bookstore", catAr: "روايات عالمية مصورة", catEn: "Graphic Novels", summaryAr: "رواية تشارلز ديكنز الشهيرة في قالب قصص مصورة يسهل على الطلاب استيعاب أحداثها الكلاسيكية.", summaryEn: "The famous classic novel presented in a graphic layout, making it accessible to students." },
  { titleAr: "ثلاثة رجال في قارب : كوميكس", authorAr: "جيروم جيروم", publisherAr: "مكتبة جرير", titleEn: "Three Men in a Boat: Comics", authorEn: "Jerome K. Jerome", publisherEn: "Jarir Bookstore", catAr: "روايات عالمية مصورة", catEn: "Graphic Novels", summaryAr: "مغامرة كوميدية كلاسيكية مصورة تأخذ القراء في رحلة نهرية مليئة بالمواقف الطريفة.", summaryEn: "A classic comic river adventure presented in a vibrant and engaging graphic format." },
  { titleAr: "مغامرات توم سوير", authorAr: "مارك توين", publisherAr: "مكتبة جرير", titleEn: "The Adventures of Tom Sawyer", authorEn: "Mark Twain", publisherEn: "Jarir Bookstore", catAr: "روايات عالمية مصورة", catEn: "Graphic Novels", summaryAr: "روائع الأدب العالمي الممسرح والمصور لتنمية شغف القراءة والمغامرة والاستكشاف الذكي.", summaryEn: "Classic adventure literature, illustrated to boost reading passion and exploration skills." },
  { titleAr: "حكايات لا تنسى", authorAr: "علي الشهراني", publisherAr: "مداد للنشر والتوزيع", titleEn: "Unforgettable Tales", authorEn: "Ali Al Shahrani", publisherEn: "Medad Publishing", catAr: "قصص تربوية", catEn: "Educational Stories", summaryAr: "قصص وعبر مستوحاة من الواقع تغرس مكارم الأخلاق والقيم النبيلة في نفوس القراء الجدد.", summaryEn: "Moral stories inspired by real life designed to instil values in new readers." },
  { titleAr: "المغامرون الأربعة مع المعري", authorAr: "فاطمة البريكي", publisherAr: "سما للنشر والتوزيع", titleEn: "The Four Adventurers with Al-Ma'arri", authorEn: "Fatima Al Buraiki", publisherEn: "Sama Publishing", catAr: "أدب وثقافة", catEn: "Literature", summaryAr: "رحلة خيالية عبر الزمن تجمع أربعة مغامرين مع الشاعر الفيلسوف أبو العلاء المعري.", summaryEn: "A fictional time-travel journey linking four adventurers with the philosopher-poet Al-Ma'arri." },
  { titleAr: "سمسم في عالم سندريلا", authorAr: "فاطمة البريكي", publisherAr: "سما للنشر", titleEn: "Simsim in Cinderella's World", authorEn: "Fatima Al Buraiki", publisherEn: "Sama Publishing", catAr: "قصص خيالية", catEn: "Fantasy Stories", summaryAr: "مزيج إبداعي بين الشخصيات المحلية والقصص العالمية الكلاسيكية يثري خيال الطفل.", summaryEn: "A creative blend between local characters and global classic tales enriching kids' imagination." },
  { titleAr: "مرمر في عالم الألوان", authorAr: "فاطمة البريكي", publisherAr: "سما للنشر", titleEn: "Marmar in the World of Colors", authorEn: "Fatima Al Buraiki", publisherEn: "Sama Publishing", catAr: "طفولة مبكرة", catEn: "Early Childhood", summaryAr: "قصة تفاعلية مبهجة تساعد الأطفال على تمييز الألوان الأساسية وتأثيرها البصري الجميل.", summaryEn: "An interactive, delightful story helping children identify basic colors and visual harmony." },
  { titleAr: "كتاب العصافير", authorAr: "فاطمة البريكي", publisherAr: "سما للنشر", titleEn: "The Book of Birds", authorEn: "Fatima Al Buraiki", publisherEn: "Sama Publishing", catAr: "بيئي - أطفال", catEn: "Environment - Kids", summaryAr: "دليل مصور ومبسط يعرف الصغار على أنواع العصافير وأصواتها وكيفية الحفاظ على الطبيعة.", summaryEn: "An illustrated guide introducing kids to bird species, their sounds, and nature care." },
  { titleAr: "كتاب الأشجار", authorAr: "فاطمة البريكي", publisherAr: "سما للنشر", titleEn: "The Book of Trees", authorEn: "Fatima Al Buraiki", publisherEn: "Sama Publishing", catAr: "بيئي - أطفال", catEn: "Environment - Kids", summaryAr: "يتناول أهمية الأشجار في النظام البيئي ودورها في منحنا الهواء النقي والظلال الوفيرة.", summaryEn: "Explores the vital role of trees in our ecosystem, giving clean air and shade." },
  { titleAr: "زيد خفيف الظل", authorAr: "جمانة خالد", publisherAr: "قنديل للطباعة والنشر", titleEn: "Zaid the Witty", authorEn: "Jumana Khaled", publisherEn: "Qandeel Printing", catAr: "قصص فكاهية", catEn: "Humorous Stories", summaryAr: "مواقف يومية مضحكة للبطل 'زيد' يتعلم من خلالها حل مشكلاته بذكاء وابتسامة.", summaryEn: "Funny daily situations where the hero 'Zaid' learns to solve his problems with a smile." },
  { titleAr: "أطلس العالم", authorAr: "دون مؤلف", publisherAr: "دار نهضة مصر", titleEn: "World Atlas", authorEn: "Anonymous", publisherEn: "Nahdet Misr", catAr: "جغرافيا - أطفال", catEn: "Geography - Kids", summaryAr: "خرائط ملونة ومعلومات جغرافية وثقافية مبسطة وممتعة حول قارات ودول العالم.", summaryEn: "Colorful maps and exciting geographical information about global continents and countries." },
  { titleAr: "لم أفعل ذلك : كتاب عن قول الصدق", authorAr: "سو جريفيز", publisherAr: "نور المعارف", titleEn: "I Didn't Do It: A Book About Truth", authorEn: "Sue Graves", publisherEn: "Noor Al Maaref", catAr: "تربوي وسلوكي", catEn: "Behavioral", summaryAr: "قصة تربوية هادفة توضح للأطفال قيمة الصدق وعواقب إخفاء الحقيقة في الحياة.", summaryEn: "An educational story highlighting the value of honesty and facing consequences." },
  { titleAr: "من يشعر بالخوف ؟", authorAr: "سو جريفيز", publisherAr: "نور المعارف", titleEn: "Who Feels Afraid?", authorEn: "Sue Graves", publisherEn: "Noor Al Maaref", catAr: "تربوي وسلوكي", catEn: "Behavioral", summaryAr: "يساعد الأطفال على التعبير عن مخاوفهم وبناء الشجاعة لمواجهة المواقف الجديدة بثقة.", summaryEn: "Helps children express their fears and develop courage to face new challenges with confidence." },
  { titleAr: "الصديقان", authorAr: "صفاء عزمي", publisherAr: "واحة الحكايات", titleEn: "The Two Friends", authorEn: "Safaa Azmy", publisherEn: "Oasis of Stories", catAr: "هوية وطنية – قصص", catEn: "National Identity", summaryAr: "قصة جميلة تدور حول الصداقة الوفية والتعاون من أجل خدمة البيئة المدرسية والمجتمع.", summaryEn: "A beautiful story about true friendship and cooperation to serve the school community." },
  { titleAr: "كتاب العش", authorAr: "فاطمة البريكي", publisherAr: "سما للنشر والتوزيع", titleEn: "The Nest Book", authorEn: "Fatima Al Buraiki", publisherEn: "Sama Publishing", catAr: "بيئة وحيوان", catEn: "Nature", summaryAr: "يستعرض البيوت الهندسية الرائعة التي تبنيها الطيور والحيوانات لحماية صغارها في الطبيعة.", summaryEn: "Showcases the amazing architectural structures built by birds to protect their young." },
  { titleAr: "كتاب المقعد", authorAr: "فاطمة البريكي", publisherAr: "سما للنشر والتوزيع", titleEn: "The Chair Book", authorEn: "Fatima Al Buraiki", publisherEn: "Sama Publishing", catAr: "قصص أطفال", catEn: "Kids Stories", summaryAr: "قصة رمزية خيالية تحكي مغامرات مقعد مدرسي والدروس اليومية التي يتعلمها من الطلاب.", summaryEn: "An imaginative symbolic story tracking a school bench's adventures and lessons." },
  { titleAr: "في بيت الجدة حصة", authorAr: "عبدالرحمن محمد المحيميد", publisherAr: "Austin Macauley", titleEn: "In Grandma Hessa's House", authorEn: "Abdulrahman Al Muhaimid", publisherEn: "Austin Macauley", catAr: "تراث وعائلة", catEn: "Family & Heritage", summaryAr: "ينقل عبق الماضي والتراث الإماراتي من خلال التجمعات العائلية الدافئة وحكايا الجدة.", summaryEn: "Conveys the warm atmosphere of Emirati heritage through cozy family gatherings and tales." },
  { titleAr: "سمسم ومرمر في عالم السنافر", authorAr: "فاطمة البريكي", publisherAr: "سما للنشر", titleEn: "Simsim & Marmar in Smurfs World", authorEn: "Fatima Al Buraiki", publisherEn: "Sama Publishing", catAr: "خيال ومغامرة", catEn: "Fantasy", summaryAr: "مغامرة خيالية ممتعة تجمع بين الأصدقاء في عالم السنافر لتعلم العمل الجماعي المشترك.", summaryEn: "A fun fantasy adventure focusing on cooperation and collaborative team efforts." },
  { titleAr: "مرمر مع ليلى والذئب", authorAr: "فاطمة البريكي", publisherAr: "سما للنشر", titleEn: "Marmar with Little Red Riding Hood", authorEn: "Fatima Al Buraiki", publisherEn: "Sama Publishing", catAr: "حكايات معدلة", catEn: "Adapted Tales", summaryAr: "إعادة صياغة إبداعية وبمنظور تربوي جديد للقصة العالمية الكلاسيكية ليلى والذئب.", summaryEn: "A creative and educational adaptation of the classic global Little Red Riding Hood tale." },
  { titleAr: "المغامرون الأربعة مع المتنبي", authorAr: "فاطمة البريكي", publisherAr: "سما للنشر", titleEn: "The Four Adventurers with Al-Mutanabbi", authorEn: "Fatima Al Buraiki", publisherEn: "Sama Publishing", catAr: "ثقافة وأدب", catEn: "Literature", summaryAr: "رحلة تاريخية وأدبية مشوقة يتعرف من خلالها الطلاب على روائع شعر المتنبي وبلاغته.", summaryEn: "An engaging historical-literary trip introducing students to Al-Mutanabbi's master poetry." },
  { titleAr: "مانع في عالم الموسيقى", authorAr: "فاطمة البريكي", publisherAr: "سما للنشر", titleEn: "Mane' in the World of Music", authorEn: "Fatima Al Buraiki", publisherEn: "Sama Publishing", catAr: "فنون وموسيقى", catEn: "Arts & Music", summaryAr: "يعرف الصغار بالنوتات والمقامات الموسيقية والآلات الشرقية والغربية بطريقة مبسطة.", summaryEn: "Introduces children to musical notes, oriental instruments, and basic melodies smoothly." },
  { titleAr: "ليلى والبسكويت المقزز", authorAr: "شون كوفي", publisherAr: "مكتبة جرير", titleEn: "Laila and the Yucky Biscuit", authorEn: "Sean Covey", publisherEn: "Jarir Bookstore", catAr: "عادات إيجابية", catEn: "Positive Habits", summaryAr: "قصة مأخوذة من عادات الأطفال السعداء السبع لتعليم اتخاذ القرارات السليمة والاختيارات الذكية.", summaryEn: "A story adapted from the 7 Habits of Happy Kids teaching proactive choice-making." },
  { titleAr: "يوميات الإخوة الثلاثة", authorAr: "جمانة خالد", publisherAr: "قنديل للنشر", titleEn: "Diaries of the Three Brothers", authorEn: "Jumana Khaled", publisherEn: "Qandeel Printing", catAr: "اجتماعي - يافعين", catEn: "Social - Youth", summaryAr: "مواقف ومفارقات عائلية تعزز التلاحم الأسري وحل الخلافات الأخوية بذكاء ومحبة.", summaryEn: "Family situations promoting brotherly bonding and solving sibling conflicts with love." },
  { titleAr: "رسالة إلى والدي", authorAr: "فاطمة البريكي", publisherAr: "سما للنشر", titleEn: "A Letter to My Father", authorEn: "Fatima Al Buraiki", publisherEn: "Sama Publishing", catAr: "مشاعر وعائلة", catEn: "Family", summaryAr: "قصة دافئة تعبر عن مشاعر الامتنان والتقدير التي يحملها الأبناء تجاه تضحيات الآباء.", summaryEn: "A heartwarming story expressing children's deep gratitude for fathers' sacrifices." },
  { titleAr: "محمد بن زايد رجل السلام الأول", authorAr: "سلطان حميد الجسمي", publisherAr: "مداد للنشر", titleEn: "Mohamed bin Zayed: Man of Peace", authorEn: "Sultan Al Jasmi", publisherEn: "Medad Publishing", catAr: "هوية وطنية", catEn: "National Identity", summaryAr: "كتاب يسلط الضوء على الجهود الدبلوماسية والإنسانية الكبيرة لترسيخ السلام العالمي والتعايش.", summaryEn: "A biographical book highlighting humanitarian leadership and global peace initiatives." },
  { titleAr: "الغيمة الرمادية الصغيرة", authorAr: "شيخة", publisherAr: "مداد للنشر والتوزيع", titleEn: "The Little Gray Cloud", authorEn: "Sheikha", publisherEn: "Medad Publishing", catAr: "قصص أطفال", catEn: "Kids Stories", summaryAr: "رحلة غيمة صغيرة تبحث عن دورها ومكانها لتنشر الخير والمطر فوق الأرض العطشى.", summaryEn: "The story of a little cloud searching for its purpose to spread rain over dry lands." },
  { titleAr: "أنا طفل مميز", authorAr: "أماني طلال المحمادي", publisherAr: "Austin Macauley", titleEn: "I Am a Special Child", authorEn: "Amani Al Muhammadi", publisherEn: "Austin Macauley", catAr: "ثقة بالنفس", catEn: "Self Confidence", summaryAr: "كتاب يعزز تقدير الذات لدى الأطفال ويشجعهم على اكتشاف مواهبهم الفردية الفريدة.", summaryEn: "A book designed to boost children's self-esteem and unique individual talents." },
  { titleAr: "الممرضة الصغيرة", authorAr: "ريم ناصر الدوسري", publisherAr: "Austin Macauley", titleEn: "The Little Nurse", authorEn: "Reem Al Dousari", publisherEn: "Austin Macauley", catAr: "قصص هادفة", catEn: "Inspiring Stories", summaryAr: "قصة طفلة تطمح لمساعدة الآخرين وتتعلم مبادئ الرعاية الصحية والتعاطف الإنساني النبيل.", summaryEn: "A story of a young girl aspiring to help others, learning healthcare and sympathy." },
  { titleAr: "حكايات للبنات في سن عام / عامين", authorAr: "دون مؤلف", publisherAr: "مكتبة جرير", titleEn: "Tales for Girls (1-2 Years)", authorEn: "Anonymous", publisherEn: "Jarir Bookstore", catAr: "طفولة مبكرة", catEn: "Early Childhood", summaryAr: "قصص تفاعلية ناعمة ورسومات زاهية لتعزيز التطور اللغوي المبكر لدى الفتيات الصغيرات.", summaryEn: "Gentle stories and rich visuals crafted to enhance early language paths for toddlers." },
  { titleAr: "كسلان جداً...جداً جداً", authorAr: "فوزية الفهدية", publisherAr: "الظبي للنشر", titleEn: "Very... Very Lazy k visual", authorEn: "Fawzia Al Fahdi", publisherEn: "Al Dhabi Publishing", catAr: "تربوي وسلوكي", catEn: "Behavioral", summaryAr: "قصة فكاهية هادفة تعالج مشكلة الكسل وتوضح فوائد النشاط والعمل والإنجاز المثمر.", summaryEn: "A humorous targeted story addressing laziness while showcasing the benefits of being active." },
  { titleAr: "تسامح أميرة / وفاء أميرة", authorAr: "صفاء عزمي", publisherAr: "واحة الحكايات", titleEn: "Princess Tolerance & Loyalty", authorEn: "Safaa Azmy", publisherEn: "Oasis of Stories", catAr: "قصص أخلاقية", catEn: "Moral Stories", summaryAr: "مجموعة قصصية تغرس شيم التسامح العفو والوفاء بالعهود في نفوس الأميرات الصغيرات.", summaryEn: "A narrative structure deeply instilling values of forgiveness and loyalty in kids." },
  { titleAr: "لن أغضب", authorAr: "عائشة الغيص", publisherAr: "الظبي للنشر", titleEn: "I Will Not Get Angry", authorEn: "Aisha Al Ghais", publisherEn: "Al Dhabi Publishing", catAr: "تحكم بالمشاعر", catEn: "Emotional Control", summaryAr: "توجيهات تربوية ممتازة لم مساعدة الأطفال على ضبط الانفعالات والتعامل مع الغضب بهدوء.", summaryEn: "Excellent educational guide helping children manage anger and control daily emotions." },
  { titleAr: "الفرسان الثلاثة / أليس في بلاد العجائب", authorAr: "ألكساندر دوما / لويس كارول", publisherAr: "مكتبة جرير", titleEn: "The Three Musketeers / Alice", authorEn: "Alexandre Dumas / Lewis Carroll", publisherEn: "Jarir Bookstore", catAr: "روايات عالمية مصورة", catEn: "Graphic Novels", summaryAr: "روائع الأدب العالمي الكلاسيكي المعاد صياغتها بالرسوم المشوقة لتسهيل تصفح الطلاب للقراءة.", summaryEn: "Re-imagined timeless masterpieces with rich graphics for dynamic reading experiences." },
  { titleAr: "كيف تصبح صقارا ؟", authorAr: "عائشة مطر المنصوري", publisherAr: "قنديل للنشر", titleEn: "How to Become a Falconer?", authorEn: "Aisha Al Mansoori", publisherEn: "Qandeel Printing", catAr: "هوية وطنية وتراث", catEn: "National Heritage", summaryAr: "دليل تراثي رائع يعلم اليافعين أصول الصقارة العربية التقليدية وكيفية رعاية الصقور.", summaryEn: "A comprehensive heritage guide teaching youth the traditional art of Arab falconry." },
  { titleAr: "رحلة رجل الثلج", authorAr: "عائشة الحارثي", publisherAr: "لؤلؤ للنشر والتوزيع", titleEn: "The Snowman's Journey", authorEn: "Aisha Al Harthi", publisherEn: "Lulu Publishing", catAr: "خيال - أطفال", catEn: "Fantasy - Kids", summaryAr: "قصة شائقة حول رجل ثلج يخوض مغامرة دافئة يبحث فيها عن سر الشتاء والصداقة.", summaryEn: "An imaginative tale about a snowman embarking on a warm path searching for winter secrets." },
  { titleAr: "غافتان", authorAr: "نادية النجار", publisherAr: "الهدهد للنشر", titleEn: "Two Ghaf Trees", authorEn: "Nadia Al Najjar", publisherEn: "Al Hudhud", catAr: "هوية وطنية وبيئة", catEn: "National Environment", summaryAr: "حوار بين شجرتي غاف يروي تاريخ الأرض والقدرة المذهلة على الصمود والتكيف البيئي.", summaryEn: "A dialogue between two Ghaf trees narrating local history and environmental resilience." },
  { titleAr: "العاصمة العالمية للكتاب", authorAr: "بدور القاسمي", publisherAr: "كلمات", titleEn: "World Book Capital", authorEn: "Bodour Al Qasimi", publisherEn: "Kalimat", catAr: "قصص أطفال ثقافية", catEn: "Cultural Kids", summaryAr: "يحتفي بالشارقة كمنارة للثقافة والقراءة، مشجعاً الأطفال على حب الكتاب والمعرفة.", summaryEn: "Celebrating Sharjah as a beacon of culture, inspiring children to fall in love with reading." },
  { titleAr: "رحلة الخمسين", authorAr: "جاسم عبيد", publisherAr: "جاسم عبيد", titleEn: "The Journey of the Fifty", authorEn: "Jassim Obeid", publisherEn: "Jassim Obeid", catAr: "هوية وطنية – بالغين", catEn: "National Identity", summaryAr: "كتاب توثيقي يستعرض الإنجازات التاريخية المذهلة لدولة الإمارات خلال خمسين عاماً.", summaryEn: "A documentary volume capturing the UAE's grand milestones over fifty historic years." },
  { titleAr: "يوميات آيباد", authorAr: "فاضل الكعبي", publisherAr: "نبض القلم للنشر", titleEn: "iPad Diaries", authorEn: "Fadel Al Kaabi", publisherEn: "Nabdh Al Qalam", catAr: "وعي رقمي", catEn: "Digital Awareness", summaryAr: "تناول نقدي هادف لعلاقة الجيل الجديد بالأجهزة الرقمية والموازنة بين التقنية والحياة الحقيقية.", summaryEn: "A thoughtful look at balancing technological tools with active daily school life." },
  { titleAr: "العادات ال7 للأطفال السعداء", authorAr: "شون كوفي", publisherAr: "مكتبة جرير", titleEn: "The 7 Habits of Happy Kids", authorEn: "Sean Covey", publisherEn: "Jarir Bookstore", catAr: "تطوير سلوكي", catEn: "Behavioral Development", summaryAr: "تطبيق عملي لأهم المبادئ والمهارات الحياتية التي تبني شخصيات الطلاب القيادية والناجحة.", summaryEn: "Practical adaptation of core life strategies for building successful youth leadership." },
  { titleAr: "شيرلوك سام وخدعة الكتب المصورة", authorAr: "إيه. جيه. لو", publisherAr: "مكتبة جرير", titleEn: "Sherlock Sam and the Comic Book Trick", authorEn: "A.J. Low", publisherEn: "Jarir Bookstore", catAr: "بوليسي وغموض", catEn: "Mystery", summaryAr: "مغامرة بوليسية شيقة للأطفال تحفز الذكاء وحل الألغاز والمشكلات بطرق منطقية إبداعية.", summaryEn: "A fun mystery engaging kids in logical problem solving and clever deduction." },
  { titleAr: "رواية الاعتراف", authorAr: "علي أبو الريش", publisherAr: "مداد للنشر والتوزيع", titleEn: "The Confession Novel", authorEn: "Ali Abu Al Reesh", publisherEn: "Medad Publishing", catAr: "أدب – بالغين", catEn: "Adult Literature", summaryAr: "عمل أدبي رفيع وعميق يغوص في النفس البشرية ويناقش قضايا مجتمعية وفلسفية معاصرة.", summaryEn: "A rich literary masterpiece exploring complex social values and human philosophies." },

  // --- مستند 3: مكتبة زايد العامة (إصدارات مشروع كلمة وهيئة أبوظبي للثقافة) ---
  { titleAr: "مقولات يوغا بتنجالي", authorAr: "سوامي برابهافانندا", publisherAr: "كلمة", titleEn: "Patanjali Yoga Aphorisms", authorEn: "Swami Prabhavananda", publisherEn: "Kalima", catAr: "فلسفة وتأمل", catEn: "Philosophy", summaryAr: "ترجمة ممتازة لنصوص اليوغا الفلسفية القديمة لاستكشاف فنون التأمل والسلام الداخلي.", summaryEn: "A translation of ancient texts exploring inner meditation methods and absolute mental peace." },
  { titleAr: "النظرية الثقافية والثقافة الشعبية", authorAr: "جون ستوريك", publisherAr: "كلمة", titleEn: "Cultural Theory and Popular Culture", authorEn: "John Storey", publisherEn: "Kalima", catAr: "دراسات ثقافية", catEn: "Cultural Studies", summaryAr: "كتاب أكاديمي يبحث في تطور الثقافات الجماهيرية وتأثيرها على المجتمعات الحديثة.", summaryEn: "An academic review looking at mass culture patterns and its societal impact." },
  { titleAr: "الأعمال المصرفية في العالم الروماني", authorAr: "جان أندرو", publisherAr: "كلمة", titleEn: "Banking in the Roman World", authorEn: "Jean Andreau", publisherEn: "Kalima", catAr: "تاريخ واقتصاد", catEn: "History & Economics", summaryAr: "دراسة تاريخية فريدة للنظم المالية والأنشطة الاقتصادية في العهد الروماني القديم.", summaryEn: "A fascinating study detailing financial strategies and trade in the ancient Roman era." },
  { titleAr: "ظلال الاستهلاك : عواقب البيئة العالمية", authorAr: "بيتر دوفيرن", publisherAr: "كلمة", titleEn: "Shadows of Consumption", authorEn: "Peter Dauvergne", publisherEn: "Kalima", catAr: "بيئة واقتصاد", catEn: "Environment", summaryAr: "يحلل الآثار السلبية للاستهلاك البشري المفرط على الأنظمة البيئية والمناخ العالمي لجغرافيي الغد.", summaryEn: "Analyses the negative footprints of consumption patterns on global ecosystems." },
  { titleAr: "حرب الجينوم: شفرة الحياة", authorAr: "جيمس شريف", publisherAr: "كلمة", titleEn: "The Genome War", authorEn: "James Shreeve", publisherEn: "Kalima", catAr: "علوم وحياة", catEn: "Science", summaryAr: "السباق العلمي المثير لفك شفرة الجينوم البشري وثورته الطبية المعاصرة.", summaryEn: "The dramatic scientific journey of decoding the human DNA and biological revolutions." },
  { titleAr: "موسیقى الهند", authorAr: "ريجنالد ماسي، جميلة ماسي", publisherAr: "كلمة", titleEn: "The Music of India", authorEn: "Reginald & Jamila Massey", publisherEn: "Kalima", catAr: "فنون وموسيقى", catEn: "Arts & Music", summaryAr: "يتناول تاريخ المقامات والآلات الموسيقية الهندية العريقة وتطورها عبر العصور الثقافية المختلفة.", summaryEn: "Explores the deep histories and traditions of classical Indian musical patterns." },
  { titleAr: "قراءة في الإقتصاد الصيني", authorAr: "لين يي فو", publisherAr: "كلمة", titleEn: "Demystifying the Chinese Economy", authorEn: "Lin Yifu", publisherEn: "Kalima", catAr: "اقتصاد دولي", catEn: "Economics", summaryAr: "كشف أسرار وآليات الصعود الاقتصادي المذهل لجمهورية الصين لتصبح قوة اقتصادية عظمى.", summaryEn: "Unveiling the structural parameters that shaped the modern economic rise of China." },
  { titleAr: "البندقية بوابة الشرق", authorAr: "ماريا بيا بيداني", publisherAr: "كلمة", titleEn: "Venice and the Islamic World", authorEn: "Maria Pia Pedani", publisherEn: "Kalima", catAr: "تاريخ وعلاقات", catEn: "History", summaryAr: "يوثق الروابط التاريخية والتجارية العميقة والتبادل الثقافي بين مدينة البندقية والعالم الإسلامي.", summaryEn: "Documenting the historical and cross-cultural trade links between Venice and the Orient." },
  { titleAr: "الفن الصخري : في إمارة أبو ظبي", authorAr: "وليد ياسين التكريتي", publisherAr: "هيئة أبوظبي للسياحة والثقافة", titleEn: "Rock Art in Abu Dhabi", authorEn: "Walid Yasin Al Tikriti", publisherEn: "TCA Abu Dhabi", catAr: "تاريخ وآثار الإمارات", catEn: "UAE Archeology", summaryAr: "كتاب أثري قيم يستعرض الرسوم والنقوش الصخرية التاريخية المكتشفة في أبوظبي.", summaryEn: "A valuable archaeological piece uncovering ancient rock carvings found in Abu Dhabi." },
  { titleAr: "الآلات الموسيقية في دولة الإمارات", authorAr: "عبدالجليل علي السعد", publisherAr: "هيئة أبوظبي للسياحة والثقافة", titleEn: "Musical Instruments in the UAE", authorEn: "Abduljaleel Al Saad", publisherEn: "TCA Abu Dhabi", catAr: "تراث وفنون", catEn: "UAE Arts", summaryAr: "توثيق شامل للآلات الإيقاعية والوترية التقليدية مثل العود والقانون والطبول التراثية بالدولة.", summaryEn: "A rich documentation of traditional UAE musical instruments like Oud, Qanun, and heritage drums." },
  { titleAr: "الموسيقا العربية في مئة عام", authorAr: "عادل الهاشمي", publisherAr: "هيئة أبوظبي للسياحة والثقافة", titleEn: "Arabic Music in a Century", authorEn: "Adel Al Hashemi", publisherEn: "TCA Abu Dhabi", catAr: "فنون وموسيقى", catEn: "Arabic Music History", summaryAr: "دراسة نقدية وتاريخية ترصد تطور الأنماط الغنائية والموسيقية العربية والأصوات الخالدة.", summaryEn: "A comprehensive critical history mapping modern Arab musical shifts and timeless voices." },
  { titleAr: "الأمير الصغير", authorAr: "سانت إكزوبري", publisherAr: "هيئة أبوظبي للسياحة والثقافة", titleEn: "The Little Prince", authorEn: "Antoine de Saint-Exupéry", publisherEn: "TCA Abu Dhabi", catAr: "أدب عالمي كلاسيكي", catEn: "Classic Literature", summaryAr: "الرواية الفلسفية الإنسانية الشهيرة المترجمة لتبحر بالطلاب في معاني الحياة والصداقة الحقيقية.", summaryEn: "The timeless masterpiece guiding readers through deep human philosophies and meaning of life." }
];

const NewArrivalsPage: React.FC = () => {
  const { locale, dir } = useLanguage();
  const isAr = locale === 'ar';
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTouchId, setActiveTouchId] = useState<number | null>(null); // لإدارة ظهور الهنت باللمس
  
  const pt = (key: keyof typeof pageTranslations.ar) => pageTranslations[locale][key];

  const filteredBooks = useMemo(() => {
    return ALL_BOOKS_DATA.filter(book => {
      const targetStr = searchTerm.toLowerCase();
      const matchAr = book.titleAr.toLowerCase().includes(targetStr) || 
                      book.authorAr.toLowerCase().includes(targetStr) ||
                      book.publisherAr.toLowerCase().includes(targetStr);
      const matchEn = book.titleEn.toLowerCase().includes(targetStr) || 
                      book.authorEn.toLowerCase().includes(targetStr) ||
                      book.publisherEn.toLowerCase().includes(targetStr);
      return matchAr || matchEn;
    });
  }, [searchTerm]);

  return (
    <div dir={dir} className="w-full min-h-[100dvh] flex flex-col items-center bg-slate-50 dark:bg-slate-950 font-sans relative overflow-x-hidden transition-colors duration-300 py-12 md:py-24 px-4 sm:px-6 md:px-8">
      
      {/* 🌟 الخلفية الديناميكية الموحدة الثابتة لضمان استقرار الهوية البصرية */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none opacity-40 dark:opacity-20">
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-red-500/20 rounded-full blur-[120px] animate-blob"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] bg-blue-500/10 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
         <div className="absolute top-[40%] left-[20%] w-[30%] h-[30%] bg-green-500/10 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-[1400px] flex flex-col gap-10 md:gap-16 animate-fade-in-up">
        
        {/* زر العودة بتصميم زجاجي عائم ومقاوم للمس العشوائي */}
        <div className="w-full flex justify-start relative z-30">
          <Link to="/" className="group flex items-center gap-2 bg-white/40 dark:bg-slate-900/40 border border-white/50 dark:border-slate-800/60 backdrop-blur-xl font-bold px-6 py-3 rounded-full shadow-lg hover:border-red-500 hover:bg-white/60 dark:hover:bg-slate-900/60 transition-all duration-300 text-slate-800 dark:text-white text-xs md:text-sm active:scale-95 touch-manipulation">
            <span className={`transform transition-transform duration-300 ${isAr ? 'group-hover:translate-x-1' : 'group-hover:-translate-x-1'}`}>&larr;</span>
            {pt('backBtn')}
          </Link>
        </div>

        {/* 💎 الترويسة والعنوان الضخم ثلاثي التدرج مع حركات الظل اللامع */}
        <div className="text-center space-y-6 max-w-5xl mx-auto relative z-20 hover:scale-[1.01] transition-transform duration-700">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight leading-tight select-none">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-amber-500 to-red-600 dark:from-emerald-400 dark:via-amber-400 dark:to-red-400 drop-shadow-[0_4px_12px_rgba(0,0,0,0.08)] animate-text-reveal">
              {pt('title')}
            </span>
          </h1>
          <p className="text-sm sm:text-base md:text-2xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-3xl mx-auto px-2 animate-text-reveal-delayed">
            {pt('subtitle')}
          </p>
          <div className="h-1.5 w-32 bg-gradient-to-r from-emerald-500 via-amber-500 to-red-600 mx-auto rounded-full shadow-[0_0_20px_rgba(220,38,38,0.4)] animate-pulse"></div>
        </div>

        {/* 🔍 شريط البحث الزجاجي المتجاوب كلياً مع اللمس وأجهزة التابلت واللابتوب */}
        <div className="w-full max-w-2xl mx-auto relative z-30 px-2 sm:px-4">
          <div className="relative flex items-center bg-white/30 dark:bg-slate-900/30 backdrop-blur-xl border border-white/40 dark:border-slate-800/50 rounded-full shadow-xl focus-within:border-emerald-500 focus-within:shadow-[0_0_30px_rgba(16,185,129,0.2)] transition-all duration-300">
            <span className="absolute inset-y-0 right-5 md:right-6 flex items-center text-lg md:text-xl pointer-events-none select-none">{isAr ? '🔍' : ''}</span>
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={pt('searchPlaceholder')}
              className={`w-full bg-transparent rounded-full py-4 md:py-5 text-sm md:text-base text-slate-900 dark:text-white font-bold placeholder-slate-400/80 focus:outline-none touch-manipulation ${isAr ? 'pr-12 pl-6 text-right' : 'pl-12 pr-6 text-left'}`}
            />
            <span className="absolute inset-y-0 left-5 md:left-6 flex items-center text-lg md:text-xl pointer-events-none select-none">{!isAr ? '🔍' : ''}</span>
          </div>
        </div>

        {/* 📱 شبكة كروت الكتب فائقة التجاوب Glassmorphism Grid تلائم الشاشات واللمس واللابتوبس */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 sm:gap-8 relative z-30 px-2 sm:px-0">
          {filteredBooks.map((book, idx) => {
            const isCurrentActive = activeTouchId === idx;
            return (
              <div 
                key={idx}
                onClick={() => setActiveTouchId(isCurrentActive ? null : idx)}
                className="group relative bg-white/40 dark:bg-slate-900/40 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/50 dark:border-slate-800/40 shadow-lg hover:shadow-2xl hover:border-emerald-500/80 hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between h-[200px] sm:h-[210px] overflow-visible cursor-pointer select-none active:scale-[0.99] touch-manipulation"
              >
                {/* المحتوى النصي الافتراضي للكارت */}
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500/10 dark:bg-emerald-400/10 rounded-2xl flex items-center justify-center text-xl shadow-inner shrink-0 group-hover:scale-110 transition-transform duration-300">📚</div>
                    <h4 className="text-base md:text-lg font-black text-slate-900 dark:text-white line-clamp-1 leading-snug flex-1">
                      {isAr ? book.titleAr : book.titleEn}
                    </h4>
                  </div>
                  
                  <div className="space-y-1 text-xs md:text-sm pt-3 border-t border-slate-200/40 dark:border-slate-700/30 mt-3">
                    <p className="text-slate-700 dark:text-slate-300 font-bold truncate">
                      <span className="text-slate-400 dark:text-slate-500 ml-1">{pt('by')}</span> {isAr ? book.authorAr : book.authorEn}
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 font-medium truncate">
                      <span className="text-slate-400 dark:text-slate-500 ml-1">{pt('publisher')}</span> {isAr ? book.publisherAr : book.publisherEn}
                    </p>
                    <div className="pt-2">
                      <span className="inline-block bg-gradient-to-r from-slate-100 to-slate-200/80 dark:from-slate-800 dark:to-slate-800/50 px-3 py-1 rounded-xl font-bold text-[10px] md:text-xs text-slate-500 dark:text-slate-400 shadow-sm border border-white/20">
                        {pt('category')} {isAr ? book.catAr : book.catEn}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 🔮 طبقة الهنت والملخص الزجاجي المطور - متجاوب مع حوم الحاسوب واللمس الفوري للتابلت والهواتف */}
                <div className={`absolute inset-0 bg-gradient-to-br from-slate-900/98 via-slate-950/98 to-slate-900/95 rounded-[2.5rem] p-6 text-white flex flex-col justify-between transition-all duration-500 shadow-2xl z-40 ${isCurrentActive ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none lg:group-hover:opacity-100 lg:group-hover:scale-100 lg:group-hover:pointer-events-auto'}`}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="inline-block px-3 py-1 rounded-full bg-emerald-600 text-[10px] md:text-xs font-black tracking-wide uppercase shadow-md animate-pulse">
                        {pt('aiBadge')}
                      </div>
                      {/* تلميح غلق مخصص لبيئات اللمس (مخفي اختيارياً على الشاشات الكبيرة) */}
                      <span className="block lg:hidden text-[9px] bg-white/10 px-2 py-0.5 rounded-full font-bold text-slate-400">
                        {pt('closeHint')}
                      </span>
                    </div>
                    <p className="text-xs md:text-sm text-slate-200 font-bold leading-relaxed pt-1 overflow-y-auto no-scrollbar max-h-[90px] sm:max-h-[100px]">
                      {isAr ? book.summaryAr : book.summaryEn}
                    </p>
                  </div>
                  <div className="text-[10px] text-slate-400 font-black border-t border-slate-800/80 pt-2 flex items-center justify-between">
                    <span>✨ مدرسة صقر الإمارات الدولية</span>
                    <span className="text-emerald-400 font-bold">SAQR AI</span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');
        * { font-family: 'Cairo', sans-serif !important; }
        
        @keyframes reveal-text {
          0% { clip-path: polygon(0 100%, 100% 100%, 100% 100%, 0 100%); transform: translateY(30px); opacity: 0; }
          100% { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); transform: translateY(0); opacity: 1; }
        }
        .animate-text-reveal { animation: reveal-text 1.2s cubic-bezier(0.77, 0, 0.175, 1) forwards; }
        .animate-text-reveal-delayed { animation: reveal-text 1.2s cubic-bezier(0.77, 0, 0.175, 1) 0.3s forwards; clip-path: polygon(0 100%, 100% 100%, 100% 100%, 0 100%); }

        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(25px, -40px) scale(1.08); }
          66% { transform: translate(-15px, 15px) scale(0.95); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 8s infinite alternate ease-in-out; }
        
        @keyframes fade-in-up { 
          0% { opacity: 0; transform: translateY(20px); } 
          100% { opacity: 1; transform: translateY(0); } 
        }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }

        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default NewArrivalsPage;
