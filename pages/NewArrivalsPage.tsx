import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage, useTheme } from '../App';

const pageTranslations = {
  ar: {
    title: "وصل حديثاً للمكتبة",
    subtitle: "رصد ذكي يستعرض أحدث المؤلفات والدراسات التي انضمت إلى رفوفنا مؤخراً.",
    backBtn: "العودة للرئيسية",
    by: "تأليف:",
    publisher: "الناشر:",
    category: "التصنيف:",
    searchPlaceholder: "ابحث عن كتاب، مؤلف، أو دار نشر..."
  },
  en: {
    title: "New Arrivals",
    subtitle: "A smart showcase reviewing the latest books and studies added to our shelves.",
    backBtn: "Back to Home",
    by: "By:",
    publisher: "Publisher:",
    category: "Category:",
    searchPlaceholder: "Search for a book, author, or publisher..."
  }
};

// הקائمة الكاملة والشاملة لجميع الكتب مع ملخصاتها وتصنيفاتها (كما هي)
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
  { titleAr: "أوليفر تويست : كوميكس", authorAr: "تشارلز ديكنز", publisherAr: "مكتبة جرير", titleEn: "Oliver Twist: Comics", authorEn: "Charles Dickens", publisherEn: "Jarir Bookstore", catAr: "روايات مصورة", catEn: "Graphic Novels", summaryAr: "رواية تشارلز ديكنز الشهيرة في قالب قصص مصورة يسهل على الطلاب استيعاب أحداثها.", summaryEn: "The famous classic novel presented in a graphic layout, making it accessible to students." },
  { titleAr: "ثلاثة رجال في قارب", authorAr: "جيروم جيروم", publisherAr: "مكتبة جرير", titleEn: "Three Men in a Boat", authorEn: "Jerome K. Jerome", publisherEn: "Jarir Bookstore", catAr: "روايات مصورة", catEn: "Graphic Novels", summaryAr: "مغامرة كوميدية كلاسيكية مصورة تأخذ القراء في رحلة نهرية مليئة بالمواقف الطريفة.", summaryEn: "A classic comic river adventure presented in a vibrant and engaging graphic format." },
  { titleAr: "مغامرات توم سوير", authorAr: "مارك توين", publisherAr: "مكتبة جرير", titleEn: "The Adventures of Tom Sawyer", authorEn: "Mark Twain", publisherEn: "Jarir Bookstore", catAr: "روايات مصورة", catEn: "Graphic Novels", summaryAr: "روائع الأدب العالمي الممسرح والمصور لتنمية شغف القراءة والمغامرة والاستكشاف الذكي.", summaryEn: "Classic adventure literature, illustrated to boost reading passion and exploration skills." },
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
  { titleAr: "الصديقان", authorAr: "صفاء عزمي", publisherAr: "واحة الحكايات", titleEn: "The Two Friends", authorEn: "Safaa Azmy", publisherEn: "Oasis of Stories", catAr: "هوية وطنية", catEn: "National Identity", summaryAr: "قصة جميلة تدور حول الصداقة الوفية والتعاون من أجل خدمة البيئة المدرسية والمجتمع.", summaryEn: "A beautiful story about true friendship and cooperation to serve the school community." },
  { titleAr: "كتاب العش", authorAr: "فاطمة البريكي", publisherAr: "سما للنشر والتوزيع", titleEn: "The Nest Book", authorEn: "Fatima Al Buraiki", publisherEn: "Sama Publishing", catAr: "بيئة وحيوان", catEn: "Nature", summaryAr: "يستعرض البيوت الهندسية الرائعة التي تبنيها الطيور والحيوانات لحماية صغارها في الطبيعة.", summaryEn: "Showcases the amazing architectural structures built by birds to protect their young." },
  { titleAr: "كتاب المقعد", authorAr: "فاطمة البريكي", publisherAr: "سما للنشر والتوزيع", titleEn: "The Chair Book", authorEn: "Fatima Al Buraiki", publisherEn: "Sama Publishing", catAr: "قصص أطفال", catEn: "Kids Stories", summaryAr: "قصة رمزية خيالية تحكي مغامرات مقعد مدرسي والدروس اليومية التي يتعلمها من الطلاب.", summaryEn: "An imaginative symbolic story tracking a school bench's adventures and lessons." },
  { titleAr: "في بيت الجدة حصة", authorAr: "عبدالرحمن المحيميد", publisherAr: "Austin Macauley", titleEn: "In Grandma Hessa's House", authorEn: "Abdulrahman Al Muhaimid", publisherEn: "Austin Macauley", catAr: "تراث وعائلة", catEn: "Family & Heritage", summaryAr: "ينقل عبق الماضي والتراث الإماراتي من خلال التجمعات العائلية الدافئة وحكايا الجدة.", summaryEn: "Conveys the warm atmosphere of Emirati heritage through cozy family gatherings and tales." },
  { titleAr: "سمسم ومرمر في عالم السنافر", authorAr: "فاطمة البريكي", publisherAr: "سما للنشر", titleEn: "Simsim & Marmar in Smurfs", authorEn: "Fatima Al Buraiki", publisherEn: "Sama Publishing", catAr: "خيال ومغامرة", catEn: "Fantasy", summaryAr: "مغامرة خيالية ممتعة تجمع بين الأصدقاء في عالم السنافر لتعلم العمل الجماعي المشترك.", summaryEn: "A fun fantasy adventure focusing on cooperation and collaborative team efforts." },
  { titleAr: "مرمر مع ليلى والذئب", authorAr: "فاطمة البريكي", publisherAr: "سما للنشر", titleEn: "Marmar with Little Red", authorEn: "Fatima Al Buraiki", publisherEn: "Sama Publishing", catAr: "حكايات معدلة", catEn: "Adapted Tales", summaryAr: "إعادة صياغة إبداعية وبمنظور تربوي جديد للقصة العالمية الكلاسيكية ليلى والذئب.", summaryEn: "A creative and educational adaptation of the classic global Little Red Riding Hood tale." },
  { titleAr: "المغامرون الأربعة مع المتنبي", authorAr: "فاطمة البريكي", publisherAr: "سما للنشر", titleEn: "The Adventurers with Al-Mutanabbi", authorEn: "Fatima Al Buraiki", publisherEn: "Sama Publishing", catAr: "ثقافة وأدب", catEn: "Literature", summaryAr: "رحلة تاريخية وأدبية مشوقة يتعرف من خلالها الطلاب على روائع شعر المتنبي وبلاغته.", summaryEn: "An engaging historical-literary trip introducing students to Al-Mutanabbi's master poetry." },
  { titleAr: "مانع في عالم الموسيقى", authorAr: "فاطمة البريكي", publisherAr: "سما للنشر", titleEn: "Mane' in the World of Music", authorEn: "Fatima Al Buraiki", publisherEn: "Sama Publishing", catAr: "فنون وموسيقى", catEn: "Arts & Music", summaryAr: "يعرف الصغار بالنوتات والمقامات الموسيقية والآلات الشرقية والغربية بطريقة مبسطة.", summaryEn: "Introduces children to musical notes, oriental instruments, and basic melodies smoothly." },
  { titleAr: "ليلى والبسكويت المقزز", authorAr: "شون كوفي", publisherAr: "مكتبة جرير", titleEn: "Laila and the Yucky Biscuit", authorEn: "Sean Covey", publisherEn: "Jarir Bookstore", catAr: "عادات إيجابية", catEn: "Positive Habits", summaryAr: "قصة مأخوذة من عادات الأطفال السعداء السبع لتعليم اتخاذ القرارات السليمة والاختيارات الذكية.", summaryEn: "A story adapted from the 7 Habits of Happy Kids teaching proactive choice-making." },
  { titleAr: "يوميات الإخوة الثلاثة", authorAr: "جمانة خالد", publisherAr: "قنديل للنشر", titleEn: "Diaries of the Three Brothers", authorEn: "Jumana Khaled", publisherEn: "Qandeel Printing", catAr: "اجتماعي - يافعين", catEn: "Social - Youth", summaryAr: "مواقف ومفارقات عائلية تعزز التلاحم الأسري وحل الخلافات الأخوية بذكاء ومحبة.", summaryEn: "Family situations promoting brotherly bonding and solving sibling conflicts with love." },
  { titleAr: "رسالة إلى والدي", authorAr: "فاطمة البريكي", publisherAr: "سما للنشر", titleEn: "A Letter to My Father", authorEn: "Fatima Al Buraiki", publisherEn: "Sama Publishing", catAr: "مشاعر وعائلة", catEn: "Family", summaryAr: "قصة دافئة تعبر عن مشاعر الامتنان والتقدير التي يحملها الأبناء تجاه تضحيات الآباء.", summaryEn: "A heartwarming story expressing children's deep gratitude for fathers' sacrifices." },
  { titleAr: "محمد بن زايد رجل السلام", authorAr: "سلطان الجسمي", publisherAr: "مداد للنشر", titleEn: "Mohamed bin Zayed: Man of Peace", authorEn: "Sultan Al Jasmi", publisherEn: "Medad Publishing", catAr: "هوية وطنية", catEn: "National Identity", summaryAr: "كتاب يسلط الضوء على الجهود الدبلوماسية والإنسانية الكبيرة لترسيخ السلام والتعايش.", summaryEn: "A biographical book highlighting humanitarian leadership and global peace initiatives." },
  { titleAr: "الغيمة الرمادية الصغيرة", authorAr: "شيخة", publisherAr: "مداد للنشر", titleEn: "The Little Gray Cloud", authorEn: "Sheikha", publisherEn: "Medad Publishing", catAr: "قصص أطفال", catEn: "Kids Stories", summaryAr: "رحلة غيمة صغيرة تبحث عن دورها ومكانها لتنشر الخير والمطر فوق الأرض العطشى.", summaryEn: "The story of a little cloud searching for its purpose to spread rain over dry lands." },
  { titleAr: "أنا طفل مميز", authorAr: "أماني المحمادي", publisherAr: "Austin Macauley", titleEn: "I Am a Special Child", authorEn: "Amani Al Muhammadi", publisherEn: "Austin Macauley", catAr: "ثقة بالنفس", catEn: "Self Confidence", summaryAr: "كتاب يعزز تقدير الذات لدى الأطفال ويشجعهم على اكتشاف مواهبهم الفردية الفريدة.", summaryEn: "A book designed to boost children's self-esteem and unique individual talents." },
  { titleAr: "الممرضة الصغيرة", authorAr: "ريم الدوسري", publisherAr: "Austin Macauley", titleEn: "The Little Nurse", authorEn: "Reem Al Dousari", publisherEn: "Austin Macauley", catAr: "قصص هادفة", catEn: "Inspiring Stories", summaryAr: "قصة طفلة تطمح لمساعدة الآخرين وتتعلم مبادئ الرعاية الصحية والتعاطف الإنساني.", summaryEn: "A story of a young girl aspiring to help others, learning healthcare and sympathy." },
  { titleAr: "حكايات للبنات", authorAr: "دون مؤلف", publisherAr: "مكتبة جرير", titleEn: "Tales for Girls", authorEn: "Anonymous", publisherEn: "Jarir Bookstore", catAr: "طفولة مبكرة", catEn: "Early Childhood", summaryAr: "قصص تفاعلية ناعمة ورسومات زاهية لتعزيز التطور اللغوي المبكر لدى الفتيات الصغيرات.", summaryEn: "Gentle stories and rich visuals crafted to enhance early language paths for toddlers." },
  { titleAr: "كسلان جداً...جداً", authorAr: "فوزية الفهدية", publisherAr: "الظبي للنشر", titleEn: "Very... Very Lazy", authorEn: "Fawzia Al Fahdi", publisherEn: "Al Dhabi Publishing", catAr: "سلوكي", catEn: "Behavioral", summaryAr: "قصة فكاهية هادفة تعالج مشكلة الكسل وتوضح فوائد النشاط والعمل والإنجاز المثمر.", summaryEn: "A humorous targeted story addressing laziness while showcasing the benefits of being active." },
  { titleAr: "تسامح أميرة", authorAr: "صفاء عزمي", publisherAr: "واحة الحكايات", titleEn: "Princess Tolerance", authorEn: "Safaa Azmy", publisherEn: "Oasis of Stories", catAr: "قصص أخلاقية", catEn: "Moral Stories", summaryAr: "مجموعة قصصية تغرس شيم التسامح العفو والوفاء بالعهود في نفوس الأميرات الصغيرات.", summaryEn: "A narrative structure deeply instilling values of forgiveness and loyalty in kids." },
  { titleAr: "لن أغضب", authorAr: "عائشة الغيص", publisherAr: "الظبي للنشر", titleEn: "I Will Not Get Angry", authorEn: "Aisha Al Ghais", publisherEn: "Al Dhabi Publishing", catAr: "تحكم بالمشاعر", catEn: "Emotional Control", summaryAr: "توجيهات تربوية ممتازة مساعدة الأطفال على ضبط الانفعالات والتعامل مع الغضب بهدوء.", summaryEn: "Excellent educational guide helping children manage anger and control daily emotions." },
  { titleAr: "كيف تصبح صقارا ؟", authorAr: "عائشة المنصوري", publisherAr: "قنديل للنشر", titleEn: "How to Become a Falconer?", authorEn: "Aisha Al Mansoori", publisherEn: "Qandeel Printing", catAr: "تراث", catEn: "Heritage", summaryAr: "دليل تراثي رائع يعلم اليافعين أصول الصقارة العربية التقليدية وكيفية رعاية الصقور.", summaryEn: "A comprehensive heritage guide teaching youth the traditional art of Arab falconry." },
  { titleAr: "رحلة رجل الثلج", authorAr: "عائشة الحارثي", publisherAr: "لؤلؤ للنشر والتوزيع", titleEn: "The Snowman's Journey", authorEn: "Aisha Al Harthi", publisherEn: "Lulu Publishing", catAr: "خيال", catEn: "Fantasy", summaryAr: "قصة شائقة حول رجل ثلج يخوض مغامرة دافئة يبحث فيها عن سر الشتاء والصداقة.", summaryEn: "An imaginative tale about a snowman embarking on a warm path searching for winter secrets." },
  { titleAr: "غافتان", authorAr: "نادية النجار", publisherAr: "الهدهد للنشر", titleEn: "Two Ghaf Trees", authorEn: "Nadia Al Najjar", publisherEn: "Al Hudhud", catAr: "هوية وطنية", catEn: "National Environment", summaryAr: "حوار بين شجرتي غاف يروي تاريخ الأرض والقدرة المذهلة على الصمود والتكيف البيئي.", summaryEn: "A dialogue between two Ghaf trees narrating local history and environmental resilience." },
  { titleAr: "العاصمة العالمية للكتاب", authorAr: "بدور القاسمي", publisherAr: "كلمات", titleEn: "World Book Capital", authorEn: "Bodour Al Qasimi", publisherEn: "Kalimat", catAr: "قصص ثقافية", catEn: "Cultural Kids", summaryAr: "يحتفي بالشارقة كمنارة للثقافة والقراءة، مشجعاً الأطفال على حب الكتاب والمعرفة.", summaryEn: "Celebrating Sharjah as a beacon of culture, inspiring children to fall in love with reading." },
  { titleAr: "رحلة الخمسين", authorAr: "جاسم عبيد", publisherAr: "جاسم عبيد", titleEn: "The Journey of the Fifty", authorEn: "Jassim Obeid", publisherEn: "Jassim Obeid", catAr: "تاريخ إماراتي", catEn: "UAE History", summaryAr: "كتاب توثيقي يستعرض الإنجازات التاريخية المذهلة لدولة الإمارات خلال خمسين عاماً.", summaryEn: "A documentary volume capturing the UAE's grand milestones over fifty historic years." },
  { titleAr: "يوميات آيباد", authorAr: "فاضل الكعبي", publisherAr: "نبض القلم", titleEn: "iPad Diaries", authorEn: "Fadel Al Kaabi", publisherEn: "Nabdh Al Qalam", catAr: "وعي رقمي", catEn: "Digital Awareness", summaryAr: "تناول نقدي هادف لعلاقة الجيل الجديد بالأجهزة الرقمية والموازنة بين التقنية والحياة.", summaryEn: "A thoughtful look at balancing technological tools with active daily school life." },
  { titleAr: "العادات ال7 للأطفال", authorAr: "شون كوفي", publisherAr: "مكتبة جرير", titleEn: "The 7 Habits of Happy Kids", authorEn: "Sean Covey", publisherEn: "Jarir Bookstore", catAr: "تطوير سلوكي", catEn: "Behavioral Development", summaryAr: "تطبيق عملي لأهم المبادئ والمهارات الحياتية التي تبني شخصيات الطلاب القيادية والناجحة.", summaryEn: "Practical adaptation of core life strategies for building successful youth leadership." },
  { titleAr: "شيرلوك سام وخدعة الكتب", authorAr: "إيه. جيه. لو", publisherAr: "مكتبة جرير", titleEn: "Sherlock Sam", authorEn: "A.J. Low", publisherEn: "Jarir Bookstore", catAr: "بوليسي", catEn: "Mystery", summaryAr: "مغامرة بوليسية شيقة للأطفال تحفز الذكاء وحل الألغاز والمشكلات بطرق منطقية إبداعية.", summaryEn: "A fun mystery engaging kids in logical problem solving and clever deduction." },
  { titleAr: "رواية الاعتراف", authorAr: "علي أبو الريش", publisherAr: "مداد للنشر", titleEn: "The Confession Novel", authorEn: "Ali Abu Al Reesh", publisherEn: "Medad Publishing", catAr: "أدب", catEn: "Literature", summaryAr: "عمل أدبي رفيع وعميق يغوص في النفس البشرية ويناقش قضايا مجتمعية وفلسفية معاصرة.", summaryEn: "A rich literary masterpiece exploring complex social values and human philosophies." },

  // --- مستند 3: مكتبة زايد العامة ---
  { titleAr: "مقولات يوغا بتنجالي", authorAr: "سوامي برابهافانندا", publisherAr: "كلمة", titleEn: "Patanjali Yoga", authorEn: "Swami Prabhavananda", publisherEn: "Kalima", catAr: "فلسفة", catEn: "Philosophy", summaryAr: "ترجمة ممتازة لنصوص اليوغا الفلسفية القديمة لاستكشاف فنون التأمل والسلام الداخلي.", summaryEn: "A translation of ancient texts exploring inner meditation methods and absolute mental peace." },
  { titleAr: "النظرية الثقافية", authorAr: "جون ستوريك", publisherAr: "كلمة", titleEn: "Cultural Theory", authorEn: "John Storey", publisherEn: "Kalima", catAr: "دراسات ثقافية", catEn: "Cultural Studies", summaryAr: "كتاب أكاديمي يبحث في تطور الثقافات الجماهيرية وتأثيرها على المجتمعات الحديثة.", summaryEn: "An academic review looking at mass culture patterns and its societal impact." },
  { titleAr: "الأعمال المصرفية الرومانية", authorAr: "جان أندرو", publisherAr: "كلمة", titleEn: "Roman Banking", authorEn: "Jean Andreau", publisherEn: "Kalima", catAr: "تاريخ", catEn: "History", summaryAr: "دراسة تاريخية فريدة للنظم المالية والأنشطة الاقتصادية في العهد الروماني القديم.", summaryEn: "A fascinating study detailing financial strategies and trade in the ancient Roman era." },
  { titleAr: "ظلال الاستهلاك", authorAr: "بيتر دوفيرن", publisherAr: "كلمة", titleEn: "Shadows of Consumption", authorEn: "Peter Dauvergne", publisherEn: "Kalima", catAr: "بيئة", catEn: "Environment", summaryAr: "يحلل الآثار السلبية للاستهلاك البشري المفرط على الأنظمة البيئية والمناخ العالمي لجغرافيي الغد.", summaryEn: "Analyses the negative footprints of consumption patterns on global ecosystems." },
  { titleAr: "حرب الجينوم", authorAr: "جيمس شريف", publisherAr: "كلمة", titleEn: "The Genome War", authorEn: "James Shreeve", publisherEn: "Kalima", catAr: "علوم", catEn: "Science", summaryAr: "السباق العلمي المثير لفك شفرة الجينوم البشري وثورته الطبية المعاصرة.", summaryEn: "The dramatic scientific journey of decoding the human DNA and biological revolutions." },
  { titleAr: "موسیقى الهند", authorAr: "ريجنالد ماسي", publisherAr: "كلمة", titleEn: "The Music of India", authorEn: "Reginald Massey", publisherEn: "Kalima", catAr: "فنون", catEn: "Arts", summaryAr: "يتناول تاريخ المقامات والآلات الموسيقية الهندية العريقة وتطورها عبر العصور.", summaryEn: "Explores the deep histories and traditions of classical Indian musical patterns." },
  { titleAr: "الإقتصاد الصيني", authorAr: "لين يي فو", publisherAr: "كلمة", titleEn: "Chinese Economy", authorEn: "Lin Yifu", publisherEn: "Kalima", catAr: "اقتصاد", catEn: "Economics", summaryAr: "كشف أسرار وآليات الصعود الاقتصادي المذهل لجمهورية الصين لتصبح قوة عظمى.", summaryEn: "Unveiling the structural parameters that shaped the modern economic rise of China." },
  { titleAr: "البندقية بوابة الشرق", authorAr: "ماريا بيداني", publisherAr: "كلمة", titleEn: "Venice & Islamic World", authorEn: "Maria Pedani", publisherEn: "Kalima", catAr: "تاريخ", catEn: "History", summaryAr: "يوثق الروابط التاريخية والتبادل الثقافي بين مدينة البندقية والعالم الإسلامي.", summaryEn: "Documenting the historical and cross-cultural trade links between Venice and the Orient." },
  { titleAr: "الفن الصخري في أبو ظبي", authorAr: "وليد التكريتي", publisherAr: "هيئة السياحة", titleEn: "Rock Art in Abu Dhabi", authorEn: "Walid Al Tikriti", publisherEn: "TCA", catAr: "آثار", catEn: "Archeology", summaryAr: "كتاب أثري قيم يستعرض الرسوم والنقوش الصخرية التاريخية المكتشفة في أبوظبي.", summaryEn: "A valuable archaeological piece uncovering ancient rock carvings found in Abu Dhabi." },
  { titleAr: "الآلات الموسيقية الإماراتية", authorAr: "عبدالجليل السعد", publisherAr: "هيئة السياحة", titleEn: "UAE Musical Instruments", authorEn: "Abduljaleel Al Saad", publisherEn: "TCA", catAr: "تراث", catEn: "Heritage", summaryAr: "توثيق شامل للآلات الإيقاعية والوترية التقليدية مثل العود والقانون والطبول.", summaryEn: "A rich documentation of traditional UAE musical instruments like Oud, Qanun, and drums." },
  { titleAr: "الموسيقا العربية في مئة عام", authorAr: "عادل الهاشمي", publisherAr: "هيئة السياحة", titleEn: "Arabic Music", authorEn: "Adel Al Hashemi", publisherEn: "TCA", catAr: "فنون", catEn: "Music History", summaryAr: "دراسة نقدية ترصد تطور الأنماط الغنائية والموسيقية العربية والأصوات الخالدة.", summaryEn: "A comprehensive critical history mapping modern Arab musical shifts and timeless voices." },
  { titleAr: "الأمير الصغير", authorAr: "سانت إكزوبري", publisherAr: "هيئة السياحة", titleEn: "The Little Prince", authorEn: "Saint-Exupéry", publisherEn: "TCA", catAr: "أدب عالمي", catEn: "Literature", summaryAr: "الرواية الفلسفية الشهيرة التي تبحر بالطلاب في معاني الحياة والصداقة الحقيقية.", summaryEn: "The timeless masterpiece guiding readers through deep human philosophies and life's meaning." }
];

// ==========================================
// أيقونات SVG جذابة (بديلة للإيموجيز)
// ==========================================
const SearchSvg = () => (
  <svg className="w-5 h-5 md:w-6 md:h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const UserSvg = () => (
  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const SparkleSvg = () => (
  <svg className="w-3 h-3 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const BookSvg = () => (
  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const NewArrivalsPage: React.FC = () => {
  const { locale, dir } = useLanguage();
  const isAr = locale === 'ar';
  
  const [searchTerm, setSearchTerm] = useState('');
  
  // حالات تتبع الماوس ومحتوى السامري العائم
  const [hoveredBook, setHoveredBook] = useState<any | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  // حالة لإدارة اللمس التفاعلي
  const [activeTouchIdx, setActiveTouchId] = useState<number | null>(null);

  const pt = (key: keyof typeof pageTranslations.ar) => pageTranslations[locale][key];

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

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
    <div dir={dir} className="w-full min-h-[100dvh] flex flex-col items-center bg-[#f8fafc] text-slate-900 dark:bg-slate-950 dark:text-white font-sans relative overflow-x-hidden pb-20 md:pb-32 pt-24 md:pt-32 px-4 sm:px-6 md:px-8 transition-colors duration-500">
      
      {/* 🌟 تصميم طفولي للخلفية 🌟 */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none opacity-50 dark:opacity-20">
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-400/20 rounded-full blur-[100px] animate-blob"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] bg-amber-400/20 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
      </div>

      <div className="w-full max-w-[1350px] flex flex-col gap-10 md:gap-14 animate-fade-in-up relative z-10">
        
        {/* زر العودة بتصميم طفولي صلب */}
        <div className="w-full flex justify-start px-2">
          <Link to="/" className="group flex items-center gap-3 bg-white dark:bg-slate-800 border-b-4 border-slate-300 dark:border-slate-700 font-black px-6 py-3 rounded-[1.5rem] shadow-sm hover:-translate-y-1 active:border-b-0 active:translate-y-1 transition-all duration-300 text-slate-800 dark:text-white text-xs md:text-sm uppercase tracking-widest">
            <span className={`transform transition-transform duration-300 ${isAr ? 'group-hover:translate-x-1' : 'group-hover:-translate-x-1'}`}>&larr;</span>
            {pt('backBtn')}
          </Link>
        </div>

        {/* 💎 الترويسة الأنيقة */}
        <div className="text-center space-y-4 max-w-4xl mx-auto px-2 select-none">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-tight uppercase">
            {pt('title')}
          </h1>
          <p className="text-base md:text-xl text-slate-600 dark:text-slate-400 font-bold leading-relaxed max-w-2xl mx-auto px-1">
            {pt('subtitle')}
          </p>
          <div className="flex justify-center gap-3 pt-2">
              <div className="h-2 w-16 bg-emerald-500 rounded-full" />
              <div className="h-2 w-8 bg-amber-400 rounded-full" />
          </div>
        </div>

        {/* 🔍 شريط البحث بتصميم صلب وألعاب */}
        <div className="w-full max-w-2xl mx-auto px-2">
          <div className="relative flex items-center bg-white dark:bg-slate-800 border-4 border-slate-200 dark:border-slate-700 rounded-[2.5rem] shadow-lg focus-within:border-emerald-400 dark:focus-within:border-emerald-500 transition-all duration-300 pl-2 pr-2">
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={pt('searchPlaceholder')}
              className="w-full bg-transparent rounded-full py-4 md:py-5 ps-14 pe-14 text-base md:text-lg font-black focus:outline-none text-slate-900 dark:text-white placeholder-slate-400"
            />
            <div className="absolute start-5 md:start-6 top-1/2 -translate-y-1/2 pointer-events-none">
                <SearchSvg />
            </div>
          </div>
        </div>

        {/* 📱 شبكة الكتب (Realistic Books on Shelves) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-12 md:gap-x-8 px-2 md:px-8">
          {filteredBooks.map((book, idx) => {
            const isTouchActive = activeTouchIdx === idx;
            
            // توليد ألوان الكتب
            const colors = [
              'from-sky-400 to-sky-600 border-sky-700',
              'from-emerald-400 to-emerald-600 border-emerald-700',
              'from-rose-400 to-rose-600 border-rose-700',
              'from-amber-400 to-amber-500 border-amber-600',
              'from-purple-400 to-purple-600 border-purple-700'
            ];
            const colorClass = colors[book.titleEn.length % colors.length];

            return (
              <div 
                key={idx}
                onMouseEnter={() => setHoveredBook(book)}
                onMouseLeave={() => setHoveredBook(null)}
                onMouseMove={handleMouseMove}
                onClick={() => setActiveTouchId(isTouchActive ? null : idx)}
                className="relative group cursor-pointer w-full h-[280px] md:h-[320px] perspective-1000 flex items-end justify-center pb-2"
              >
                {/* الكتاب الواقعي */}
                <div className={`book-volume w-[90%] h-full relative transform-style-3d transition-transform duration-500 group-hover:rotate-y-[-15deg] group-hover:-translate-y-4 group-hover:scale-105 rounded-r-2xl border-l-[12px] md:border-l-[16px] shadow-[-8px_8px_15px_rgba(0,0,0,0.15)] bg-gradient-to-br ${colorClass}`}>
                  
                  <div className="absolute inset-0 flex flex-col p-4 md:p-5 overflow-hidden rounded-r-2xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-black/20 pointer-events-none"></div>

                    <div className="mb-auto mt-1 flex justify-between items-start">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-[8px] md:text-[9px] font-black uppercase tracking-wider bg-white/20 text-white backdrop-blur-sm border border-white/30 shadow-sm max-w-[80%]`}>
                         <span className="truncate">{isAr ? book.catAr : book.catEn}</span>
                      </span>
                      {/* لمبة تلميح للموبايل تظهر ملخص عند اللمس */}
                      <span className="block sm:hidden text-white animate-pulse">
                         <SparkleSvg />
                      </span>
                    </div>
                    
                    <div className="relative z-10 flex-1 flex flex-col justify-center">
                      <h3 className="font-black text-base md:text-lg text-white leading-snug drop-shadow-md line-clamp-3 mb-2" dir={isAr ? "rtl" : "ltr"}>
                          {isAr ? book.titleAr : book.titleEn}
                      </h3>
                      <div className="flex items-center gap-1.5 text-white/80 mt-auto mb-1">
                          <UserSvg />
                          <p className="text-[10px] md:text-xs font-bold truncate uppercase">{isAr ? book.authorAr : book.authorEn}</p>
                      </div>
                    </div>
                  </div>

                  {/* كعب الكتاب */}
                  <div className="absolute top-0 left-[-12px] md:left-[-16px] w-[12px] md:w-[16px] h-full bg-black/30 origin-right transform rotate-y-90 flex flex-col items-center justify-between py-6">
                     <div className="w-full h-1 bg-white/30"></div>
                     <div className="text-[8px] md:text-[10px] text-white/50 font-black -rotate-90 tracking-widest truncate max-w-[200px] px-2">{isAr ? book.publisherAr : book.publisherEn}</div>
                     <div className="w-full h-1 bg-white/30"></div>
                  </div>

                  {/* صفحات الكتاب */}
                  <div className="absolute top-2 right-[-4px] md:right-[-6px] w-[4px] md:w-[6px] h-[calc(100%-4px)] bg-[#fdfbf7] origin-left transform rotate-y-[-90deg] rounded-r-sm shadow-inner border-y border-r border-[#e2e8f0]">
                     <div className="w-full h-full bg-[repeating-linear-gradient(transparent,transparent_2px,#e2e8f0_2px,#e2e8f0_3px)] opacity-50"></div>
                  </div>
                </div>

                {/* خط الرف الخشبي أسفل الكتاب */}
                <div className="absolute -bottom-2 w-[110%] -left-[5%] h-3 md:h-4 bg-[#8B4513] rounded-sm shadow-md border-b-4 border-[#5C2E0B] -z-10"></div>

                {/* 📱 العرض المخصص للموبايل والآيباد عند اللمس (يظهر منسدلاً أسفل الكارت) */}
                {isTouchActive && (
                  <div className="block sm:hidden absolute top-[105%] left-1/2 -translate-x-1/2 w-[120%] bg-slate-900 border-4 border-slate-700 p-4 rounded-[2rem] text-white shadow-2xl z-50 animate-zoom-in text-xs leading-relaxed font-bold">
                    <div className="text-[10px] text-emerald-400 font-black mb-2 uppercase tracking-widest flex items-center gap-1">
                        <SparkleSvg /> {isAr ? 'ملخص صقر' : 'Saqr Summary'}
                    </div>
                    {isAr ? book.summaryAr : book.summaryEn}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 🔮 السامري العائم ذو الخلفية الداكنة الواضحة والثابتة للابتوب والحاسوب الشخصي (يتحرك بطلاقة مع الماوس) */}
      {hoveredBook && (
        <div 
          className="hidden sm:block fixed z-[99999] pointer-events-none max-w-xs md:max-w-sm transition-transform duration-75 ease-out"
          style={{ 
            left: mousePos.x + 20, 
            top: mousePos.y + 20,
            transform: isAr ? 'translate(-100%, 0)' : 'none' 
          }}
        >
          <div className="bg-slate-900 border-4 border-slate-700 p-5 rounded-[2.5rem] shadow-2xl space-y-3 animate-zoom-in text-white text-xs md:text-sm">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-[10px] md:text-xs font-black uppercase tracking-widest">
              <SparkleSvg /> {isAr ? 'ملخص صقر' : 'Saqr Summary'}
            </div>
            <p className="text-slate-100 font-bold leading-relaxed">
              {isAr ? hoveredBook.summaryAr : hoveredBook.summaryEn}
            </p>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');
        * { font-family: 'Cairo', sans-serif !important; }
        
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(25px, -35px) scale(1.06); }
          66% { transform: translate(-15px, 15px) scale(0.97); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 8s infinite alternate ease-in-out; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        
        @keyframes fade-in-up { 
          0% { opacity: 0; transform: translateY(15px); } 
          100% { opacity: 1; transform: translateY(0); } 
        }
        .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }

        @keyframes zoom-in {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-zoom-in { animation: zoom-in 0.15s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .rotate-y-90 { transform: rotateY(90deg); }
        .-rotate-y-15 { transform: rotateY(-15deg); }
      `}</style>
    </div>
  );
};

export default NewArrivalsPage;
