// 1. تعريف نوع البيانات
export type Book = {
  id: string;
  title: string;
  author: string;
  subject: string;
  shelf: number;
  row: number;
  level?: string;
  language: 'AR' | 'EN';
  summary: string;
};

// 2. البيانات الخام
const rawBookData = [
{ "title": "CREATING EXCELLENCE", "author": "Craig R. Hickman", "shelf": 4, "row": 1 },
{ "title": "The Canadian SMALL BUSINESS Handbook", "author": "Susan Kennedy", "shelf": 4, "row": 1 },
{ "title": "PREPARING FOR ADOLESCENCE", "author": "James Dobson", "shelf": 4, "row": 1 },
{ "title": "Black Canadians", "author": "Joseph Mensah", "shelf": 4, "row": 1 },
{ "title": "HOW TO STOP THE ONE YOU LOVE FROM DRINKING", "author": "Mary Ellen Pinkham", "shelf": 4, "row": 1 },
{ "title": "To Buy Almost Any Drug Without A Prescription", "author": "", "shelf": 4, "row": 1 },
{ "title": "PSYCHOLOGICAL SYMPTOMS", "author": "Frank J. Bruno", "shelf": 4, "row": 1 },
{ "title": "A WALK DOWN WALL STREET", "author": "Burton Malkiel", "shelf": 4, "row": 1 },
{ "title": "PRINCIPLE-CENTERED LEADERSHIP", "author": "STEPHEN R. COVEY", "shelf": 4, "row": 1 },
{ "title": "The Rich Get Rich", "author": "David Hapgood", "shelf": 4, "row": 1 },
{ "title": "HOW TO BEAT THE TAXMAN ALL YEAR ROUND", "author": "COSTELLO", "shelf": 4, "row": 1 },
{ "title": "Beginnings", "author": "BETTY JANE WYLIE", "shelf": 4, "row": 1 },
{ "title": "HOW TO MAKE MEETINGS WORK", "author": "DAVID STRAUS", "shelf": 4, "row": 1 },
{ "title": "Investment Survival (The Battle for Investment Survival)", "author": "Gerald M. Loeb", "shelf": 4, "row": 1 },
{ "title": "SUCCESSFUL AGING", "author": "Daniel J. Levitin", "shelf": 4, "row": 1 },
{ "title": "Construction Health & Safety Manual", "author": "Construction Safety Association of Ontario", "shelf": 4, "row": 1 },
{ "title": "THE ANTICAPITALISTIC MENTALITY", "author": "Ludvig von Mises", "shelf": 4, "row": 1 },
{ "title": "A FATE WORSE THAN DEBT", "author": "SUSAN GEORGE", "shelf": 4, "row": 1 },
{ "title": "Our Parents Need Us Most", "author": "McKenna", "shelf": 4, "row": 1 },
{ "title": "Women and Children Last", "author": "Ruth Sidel", "shelf": 4, "row": 1 },
{ "title": "THE 100 BEST JOBS FOR THE 1990S AND BEYOND", "author": "CAROL KLEIMAN", "shelf": 4, "row": 1 },
{ "title": "THE BUSY BOOK", "author": "Trish Kuffner", "shelf": 4, "row": 1 },
{ "title": "THE PRINCE", "author": "MACHIAVELLI", "shelf": 4, "row": 1 },
{ "title": "THE NEW EXECUTIVE WOMAN", "author": "Marcille Williams", "shelf": 4, "row": 1 },
{ "title": "BARRON'S Canadian Mortgage Payments", "author": "(Topic: Finance)", "shelf": 4, "row": 1 },
{ "title": "PRICE WATERHOUSE PERSONAL TAX ADVISER", "author": "(Topic: Finance)", "shelf": 4, "row": 1 },
{ "title": "THE MALABRE BUSINESS CYCLE SYSTEM", "author": "MALABRE", "shelf": 4, "row": 1 },
{ "title": "HOW TO READ THE FINANCIAL PAGES", "author": "Michael Brett", "shelf": 4, "row": 1 },
{ "title": "Realty Bluebook", "author": "(Topic: Real Estate Manual)", "shelf": 4, "row": 1 },
{ "title": "Let's Talk about MONEY", "author": "Stan & Jan Berenstain", "shelf": 4, "row": 1 },
{ "title": "CONTEMPORARY BUSINESS STATISTICS", "author": "Wagner", "shelf": 4, "row": 2 },
{ "title": "THE WEALTHY BARBER", "author": "David Chilton", "shelf": 4, "row": 2 },
{ "title": "The Personal Tax Planner", "author": "Garde", "shelf": 4, "row": 2 },
{ "title": "Management of Information Technology", "author": "(Topic: IT Management)", "shelf": 4, "row": 2 },
{ "title": "RICH SHAREOWNER, POOR SHAREOWNER", "author": "Will Marshall", "shelf": 4, "row": 2 },
{ "title": "Topics in Managerial Accounting", "author": "Rosen", "shelf": 4, "row": 2 },
{ "title": "The Cub Book", "author": "Dick Wingert", "shelf": 4, "row": 2 },
{ "title": "RACE, CLASS, and GENDER An Anthology", "author": "(Topic: Sociology Anthology)", "shelf": 4, "row": 2 },
{ "title": "THE FRIENDLY DICTATORSHIP", "author": "FREY SIMPSON", "shelf": 4, "row": 2 },
{ "title": "THE ONE MINUTE MILLIONAIRE", "author": "MARK VICTOR HANSEN", "shelf": 4, "row": 2 },
{ "title": "ELEMENTARY SOCIAL STUDIES HANDBOOK", "author": "(Topic: Education)", "shelf": 4, "row": 2 },
{ "title": "COMMUNICATION systems", "author": "(Topic: Engineering)", "shelf": 4, "row": 2 },
{ "title": "INTERPLAY", "author": "(Topic: Communication)", "shelf": 4, "row": 2 },
{ "title": "Photographer's Market", "author": "(Topic: Business/Photography)", "shelf": 4, "row": 2 },
{ "title": "THE BANKER'S SECRET", "author": "MARC EISENSON", "shelf": 4, "row": 2 },
{ "title": "RELATIONSHIP RESCUE", "author": "PHILLIP C. MCGRAW (PH.D.)", "shelf": 4, "row": 2 },
{ "title": "naked Babies", "author": "Nick Kelsh & Anna Quindlen", "shelf": 4, "row": 2 },
{ "title": "ALCOHOL & DRUG PROBLEMS", "author": "(Topic: Health)", "shelf": 4, "row": 2 },
{ "title": "ADVERTISING PRINCIPLES AND PRACTICE", "author": "WELLS BURNETT MORIARTY", "shelf": 4, "row": 2 },
{ "title": "Official Guide to the ACT", "author": "The Princeton Review", "shelf": 4, "row": 2 },
{ "title": "AMERICA, RUSSIA, (AND THE) COLD WAR, 1945-1976", "author": "Walter LaFeber", "shelf": 4, "row": 2 },
{ "title": "MICROECONOMICS", "author": "Barash / Warren", "shelf": 4, "row": 3 },
{ "title": "Professional Secretary's Handbook", "author": "(Topic: Business Manual)", "shelf": 4, "row": 3 },
{ "title": "THE EMPTY TANK", "author": "Jeremy Leggett", "shelf": 4, "row": 3 },
{ "title": "BREWER'S POLITICS", "author": "Nicholas Comfort", "shelf": 4, "row": 3 },
{ "title": "THE ST. JAMES ENCYCLOPEDIA OF MORTGAGE & REAL ESTATE", "author": "(Topic: Finance/Reference)", "shelf": 4, "row": 3 },
{ "title": "THE PROCESS OF MANAGEMENT", "author": "J. Nicholson", "shelf": 4, "row": 3 },
{ "title": "COMPETITIVE STRATEGY", "author": "Porter", "shelf": 4, "row": 3 },
{ "title": "SALES TECHNIQUES", "author": "(Topic: Business)", "shelf": 4, "row": 3 },
{ "title": "TREASURES!", "author": "H. A. HYMAN", "shelf": 4, "row": 3 },
{ "title": "THE MOTLEY FOOL INVESTMENT WORKBOOK", "author": "DAVID & TOM GARDNER", "shelf": 4, "row": 3 },
{ "title": "RETAIL MERCHANDISING", "author": "Kraus / Curtis", "shelf": 4, "row": 3 },
{ "title": "CREATIVE MANAGEMENT IN RECREATION AND PARKS", "author": "(Topic: Management)", "shelf": 4, "row": 3 },
{ "title": "What the IRS Doesn't Want You to Know", "author": "Martin S. Kaplan", "shelf": 4, "row": 3 },
{ "title": "THE PRIME SOLUTION", "author": "(Topic: Business/Management)", "shelf": 4, "row": 3 },
{ "title": "LOW RISK INVESTING", "author": "(Topic: Finance)", "shelf": 4, "row": 3 },
{ "title": "BLOOD (IN) The STREETS", "author": "(Topic: Finance)", "shelf": 4, "row": 3 },
{ "title": "Managing Retirement", "author": "(Topic: Finance)", "shelf": 4, "row": 3 },
{ "title": "You Can Profit from a Monetary Crisis", "author": "Harry Browne", "shelf": 4, "row": 3 },
{ "title": "How to start, finance, and manage your own small business", "author": "(Topic: Business)", "shelf": 4, "row": 3 },
{ "title": "Compassionate Capitalism", "author": "Rich DeVos", "shelf": 4, "row": 3 },
{ "title": "EFFECTIVE MANAGEMENT", "author": "(Topic: Business)", "shelf": 4, "row": 3 },
{ "title": "BUSINESS Its Legal, Ethical and Global Environment", "author": "MARIANNE JENNINGS", "shelf": 4, "row": 3 },
{ "title": "SWORD TO PLOWSHARES", "author": "(Topic: Political Science)", "shelf": 4, "row": 4 },
{ "title": "REAL ESTATE INVESTMENT", "author": "(Topic: Finance)", "shelf": 4, "row": 4 },
{ "title": "IN SEARCH OF PERFECTION", "author": "(Topic: Business)", "shelf": 4, "row": 4 },
{ "title": "COMPETITOR INTELLIGENCE How to Get It; How to Use It", "author": "FULD", "shelf": 4, "row": 4 },
{ "title": "POWER REAL ESTATE SELLING", "author": "(Topic: Business/Real Estate)", "shelf": 4, "row": 4 },
{ "title": "Direct Social Work Practice Theory and Skills", "author": "(Topic: Social Work)", "shelf": 4, "row": 4 },
{ "title": "THE ROAD TO WEALTH", "author": "(Topic: Finance)", "shelf": 4, "row": 4 },
{ "title": "YOUR HOME OFFICE", "author": "NORMAN SCHREIBER", "shelf": 4, "row": 4 },
{ "title": "Judicial Revolution", "author": "Gerald T. Dunne", "shelf": 4, "row": 4 },
{ "title": "Production and Operations Management", "author": "Chase and Aquilano", "shelf": 4, "row": 4 },
{ "title": "Public Relations", "author": "(Topic: Business)", "shelf": 4, "row": 4 },
{ "title": "Modern Real Estate Practice", "author": "(Topic: Real Estate)", "shelf": 4, "row": 4 },
{ "title": "More RETAIL DETAILS...", "author": "(Topic: Business)", "shelf": 4, "row": 4 },
{ "title": "GORDON PAPE'S 2002 BUYER'S GUIDE", "author": "Gordon Pape", "shelf": 4, "row": 4 },
{ "title": "marketing and distribution", "author": "MASON RATH", "shelf": 4, "row": 4 },
{ "title": "FILE YOUR OWN BANKRUPTCY", "author": "(Topic: Legal/Finance)", "shelf": 4, "row": 4 },
{ "title": "Techniques of Retail Merchandising", "author": "WINGATE", "shelf": 4, "row": 4 },
{ "title": "Statistical Analysis for Decision Making", "author": "(Topic: Business/Statistics)", "shelf": 4, "row": 4 },
{ "title": "Retailing", "author": "LEWISON BALDERSON", "shelf": 4, "row": 4 },
{ "title": "Personal Finance For Canadians", "author": "(Topic: Finance)", "shelf": 4, "row": 4 },
{ "title": "Shopping Online For Canadians", "author": "(Topic: E-commerce)", "shelf": 4, "row": 4 },
{ "title": "FINANCIAL ACCOUNTING PRINCIPLES", "author": "Kohler, Keller, Warrask, Bartel", "shelf": 4, "row": 5 },
{ "title": "COST ACCOUNTING a managerial emphasis", "author": "(Topic: Accounting)", "shelf": 4, "row": 5 },
{ "title": "FINANCIAL ACCOUNTING", "author": "(Topic: Accounting)", "shelf": 4, "row": 5 },
{ "title": "ACCOUNTING INFORMATION SYSTEMS", "author": "STEPHEN A MOSCOVE and MARK G. SIMION", "shelf": 4, "row": 5 },
{ "title": "Financial Theory and Corporate Policy", "author": "(Topic: Finance)", "shelf": 4, "row": 5 },
{ "title": "STATISTICS FOR BUSINESS AND ECONOMICS", "author": "(Topic: Statistics)", "shelf": 4, "row": 5 },
{ "title": "HOW TO SELL NEW IDEAS", "author": "(Topic: Business)", "shelf": 4, "row": 5 },
{ "title": "MAKING the MOST of YOUR MONEY", "author": "JANE BRYANT QUINN", "shelf": 4, "row": 5 },
{ "title": "Simply Accounting", "author": "(Topic: Software/Accounting)", "shelf": 4, "row": 5 },
{ "title": "THE WALL STREET JOURNAL GUIDE TO PLANNING YOUR FINANCIAL FUTURE", "author": "(Topic: Finance)", "shelf": 4, "row": 5 },
{ "title": "Deloitte & Touche Canadian Guide To Personal Financial Management", "author": "(Topic: Finance)", "shelf": 4, "row": 5 },
{ "title": "the psychology of motivation", "author": "(Topic: Psychology)", "shelf": 4, "row": 5 },
{ "title": "The Organized Executive", "author": "(Topic: Business)", "shelf": 4, "row": 5 },
{ "title": "he's just not that into you", "author": "Greg Behrendt and Liz Tuccillo", "shelf": 4, "row": 5 },
{ "title": "YOUR MONEY AND HOW TO KEEP IT", "author": "COSTELLO", "shelf": 4, "row": 5 },
{ "title": "The Ultimate Marketing Plan", "author": "Kennedy", "shelf": 4, "row": 5 },
{ "title": "FAMILY FINANCES", "author": "(Topic: Finance)", "shelf": 4, "row": 5 },
{ "title": "GET A FINANCIAL LIFE", "author": "(Topic: Finance)", "shelf": 4, "row": 5 },
{ "title": "VALUES ADDED", "author": "(Topic: Business)", "shelf": 4, "row": 5 },
{ "title": "Secrets of Power Presentations", "author": "(Topic: Business)", "shelf": 4, "row": 5 },
{ "title": "WHAT COLOR IS YOUR PARACHUTE?", "author": "BOLLES", "shelf": 4, "row": 5 },
{ "title": "RENTAL REAL ESTATE", "author": "(Topic: Real Estate)", "shelf": 4, "row": 5 },
{ "title": "Find It Fast", "author": "Berkman", "shelf": 4, "row": 5 },
{ "title": "Dictionary of Insurance Terms", "author": "(Topic: Finance/Reference)", "shelf": 4, "row": 5 },
{ "title": "50 SIMPLE THINGS KIDS CAN DO TO SAVE THE EARTH", "author": "(Topic: Environment/Kids)", "shelf": 4, "row": 5 },
{ "title": "50 SIMPLE THINGS YOU CAN DO TO SAVE THE EARTH", "author": "(Topic: Environment)", "shelf": 4, "row": 5 },
{ "title": "Managerial Decision Making", "author": "(Topic: Business)", "shelf": 4, "row": 5 },
{ "title": "Team Up For Success: Building Teams in the Workplace", "author": "(Topic: Business)", "shelf": 4, "row": 6 },
{ "title": "Crafting and Executing Strategy", "author": "(Topic: Business)", "shelf": 4, "row": 6 },
{ "title": "Economic Analysis Theory and Application", "author": "(Topic: Economics)", "shelf": 4, "row": 6 },
{ "title": "COLLECTIVE BARGAINING...", "author": "(Topic: Business)", "shelf": 4, "row": 6 },
{ "title": "SIMCITY 2000", "author": "(Topic: Game Manual)", "shelf": 4, "row": 6 },
{ "title": "MAJOR IN SUCCESS", "author": "(Topic: Career)", "shelf": 4, "row": 6 },
{ "title": "Readings In Marketing Strategy", "author": "(Topic: Business)", "shelf": 4, "row": 6 },
{ "title": "Glassware of the Depression Era", "author": "FLORENCE", "shelf": 4, "row": 6 },
{ "title": "RISK ANALYSIS AND THE SECURITY SURVEY", "author": "(Topic: Business/Security)", "shelf": 4, "row": 6 },
{ "title": "MAKING IT ON YOUR OWN", "author": "(Topic: Business)", "shelf": 4, "row": 6 },
{ "title": "SUPERVISION", "author": "(Topic: Management)", "shelf": 4, "row": 6 },
{ "title": "PENSION PLANNING", "author": "(Topic: Finance)", "shelf": 4, "row": 6 },
{ "title": "MANAGER'S GUIDE TO CONTINUOUS QUALITY IMPROVEMENT", "author": "(Topic: Business)", "shelf": 4, "row": 6 },
{ "title": "ESTATE PLANNING BASICS", "author": "(Topic: Finance)", "shelf": 4, "row": 6 },
{ "title": "HOW TO MAKE MONEY IN STOCKS", "author": "(Topic: Finance)", "shelf": 4, "row": 6 },
{ "title": "Operating a Business in Illinois", "author": "(Topic: Business)", "shelf": 4, "row": 6 },
{ "title": "macroeconomics made simple", "author": "(Topic: Economics)", "shelf": 4, "row": 6 },
{ "title": "Advanced Illustration and Design", "author": "JENNINGS", "shelf": 4, "row": 6 },
{ "title": "Fundamental accounting principles", "author": "PYLE WHITE LARSON ZIN", "shelf": 4, "row": 6 },
{ "title": "PROJECT MANAGEMENT", "author": "KERZNER", "shelf": 4, "row": 6 },
{ "title": "INTERNATIONAL MARKETING", "author": "(Topic: Business)", "shelf": 4, "row": 6 },
{ "title": "INVESTMENTS", "author": "RODIE MARCUS", "shelf": 4, "row": 6 },
{ "title": "Business in the Canadian Environment", "author": "(Topic: Business)", "shelf": 4, "row": 6 },
{ "title": "MONEY & BANKING", "author": "(Topic: Finance)", "shelf": 4, "row": 6 },
{ "title": "Principles Of Bank Operations", "author": "(Topic: Finance)", "shelf": 4, "row": 6 },
{ "title": "CANADIAN INCOME TAXATION", "author": "(Topic: Finance)", "shelf": 4, "row": 6 },
{ "title": "آلات الأوركسترا","author":"كفاح فاخوري","shelf":33,"row":1},
{ "title":"آلات الموسيقى العربية","author":"كفاح فاخوري","shelf":33,"row":1},
{ "title":"النص والعرض المسرحي في الإمارات","author":"د. هيثم يحيى الخواجة","shelf":33,"row":1},
{ "title":"وديع الصافي","author":"غير محدد (سيرة ذاتية)","shelf":33,"row":1},
{ "title":"المؤتلف في المختلف (الانفتاح على المرئي)","author":"محمد العامري","shelf":33,"row":1},
{ "title":"كتاب الموسم الثقافي","author":"وزارة الإعلام والثقافة (إصدار دوري)","shelf":33,"row":2},
{ "title":"كيف تؤلف كتاباً؟","author":"(إصدار دار العلم للملايين)","shelf":33,"row":2},
{ "title":"مختارات من الشعراء الرواد في لبنان","author":"تقديم: عصام محفوظ","shelf":33,"row":2},
{ "title":"في مدار اللغة واللسان","author":"د. محمد حاطوم","shelf":33,"row":2},
{ "title":"موسوعة الأمثال والحكم والأقوال العالمية","author":"منير عبود","shelf":33,"row":2},
{ "title":"سقط الزند","author":"أبو العلاء المعري","shelf":33,"row":2},
{ "title":"محاضرات نوبل","author":"مجموعة مؤلفين (جائزة نوبل)","shelf":33,"row":2},
{ "title":"حول العالم في ثمانين يوماً","author":"جول فيرن","shelf":33,"row":2},
{ "title":"السر المدفون","author":"د. طارق البكري","shelf":33,"row":2},
{ "title":"ابنة غواص اللؤلؤ","author":"مريم العقاد المنصوري","shelf":33,"row":2},
{ "title":"الأسطورة والإبداع","author":"مريم العقاد المنصوري","shelf":33,"row":2},
{ "title":"خطوات حديدية","author":"مريم العقاد المنصوري (مرجح)","shelf":33,"row":2},
{ "title":"في بلاد التنين","author":"د. طارق البكري (مرجح - أدب ناشئة)","shelf":33,"row":2},
{ "title":"حكايات شعبية من الخليج","author":"غير محدد","shelf":33,"row":2},
{ "title":"من ركل القطة","author":"غير محدد","shelf":33,"row":2},
{ "title":"ديوان زهير بن جناب الكلبي","author":"زهير بن جناب الكلبي","shelf":33,"row":3},
{ "title":"ديوان المفضليات","author":"المفضل الضبي","shelf":33,"row":3},
{ "title":"كتاب الحماسة","author":"أبو تمام","shelf":33,"row":3},
{ "title":"ديوان النابغة الذبياني","author":"النابغة الذبياني","shelf":33,"row":3},
{ "title":"السموأل وابن الورد","author":"السموأل / عروة بن الورد","shelf":33,"row":3},
{ "title":"ديوان عبيد بن الأبرص","author":"عبيد بن الأبرص","shelf":33,"row":3},
{ "title":"ديوان الأصمعي (الأصمعيات)","author":"الأصمعي","shelf":33,"row":3},
{ "title":"ديوان طرفة بن العبد","author":"طرفة بن العبد","shelf":33,"row":3},
{ "title":"أمثال العرب","author":"المفضل الضبي (تحقيق: د. عادل جمال)","shelf":33,"row":3},
{ "title":"المستطرف في كل فن مستظرف","author":"شهاب الدين الأبشيهي","shelf":33,"row":4},
{ "title":"الصورة البيانية في شعر إبراهيم ناجي","author":"د. وصال الدليمي","shelf":33,"row":4},
{ "title":"مطالعات في الشعر المملوكي والعثماني","author":"د. بكري الشيخ أمين","shelf":33,"row":4},
{ "title":"الأدب البلغاري المعاصر","author":"غير محدد","shelf":33,"row":4},
{ "title":"الحجاج في الشعر العربي","author":"سامية الدريدي (مرجح)","shelf":33,"row":4},
{ "title":"سنوات من حياة التيم","author":"هادي مدني الخفاجي","shelf":33,"row":4},
{ "title":"الفن ومذاهبه في النثر العربي","author":"شوقي ضيف","shelf":33,"row":4},
{ "title":"الشعر النبطي في منطقة الخليج","author":"د. غسان حسن","shelf":33,"row":4},
{ "title":"الوحوش والصحراء في الشعر الجاهلي","author":"د. أحمد مرسي","shelf":33,"row":4},
{ "title":"عالم النبات في الأدب العربي","author":"حسن محمود موسى","shelf":33,"row":4},
{ "title":"الخطاب الشعري الجاهلي","author":"د. حسن (غير واضح)","shelf":33,"row":4},
{ "title":"ديوان مخدوم قولي","author":"مخدوم قولي فراغي","shelf":33,"row":4},
{ "title":"عزلة الملاك","author":"غير محدد","shelf":33,"row":4},
{ "title":"شعرية التفاصيل (قراءة في شعر سعدي يوسف)","author":"سلمى النمري","shelf":33,"row":4},
{ "title":"وجوه البرجس - مرايا الماء","author":"محمد الغربي","shelf":33,"row":4},
{ "title":"الصورة الفنية في الشعر الجاهلي","author":"د. نصرت عبد الرحمن","shelf":33,"row":4},
{ "title":"الحب والتصوف عند العرب","author":"د. عادل كامل","shelf":33,"row":4},
{ "title":"المعلقات العشر","author":"مفيد نجم","shelf":33,"row":4},
{ "title":"تلقي الشعر","author":"د. عبد الرحمن ياتي","shelf":33,"row":4},
{ "title":"أثر العلماء في الشعر الجاهلي","author":"غير محدد","shelf":33,"row":4},
{ "title":"ديوان القاضي الجرجاني","author":"القاضي علي بن عبدالعزيز الجرجاني","shelf":33,"row":4}
];

// 3. دالة معالجة البيانات
const processBookData = (rawData: any[]): Book[] => {
  return rawData.map((rawBook, index) => {
    let author = (rawBook.author || "").toString();
    let subject = 'Uncategorized';

    // التمييز بين العربية والإنجليزية
    const arabicRegex = /[\u0600-\u06FF]/;
    const language: 'EN' | 'AR' = arabicRegex.test(rawBook.title) || arabicRegex.test(author) ? 'AR' : 'EN';
    
    // استخراج الموضوع إذا كان موجوداً في خانة المؤلف بتنسيق (Topic: ...)
    const topicMatch = author.match(/\(Topic: (.*?)\)/);
    if (topicMatch) {
      subject = topicMatch[1];
      author = 'Unknown Author';
    } else if (!author || author.trim() === "") {
      author = language === 'AR' ? 'مؤلف غير معروف' : 'Unknown Author';
    }

    // تنظيف خانة المؤلف من الأقواس والأرقام الزائدة في النهاية
    author = author.replace(/\s*\d+$/, '').trim();
    if (author.startsWith('(') && author.endsWith(')')) {
        author = author.slice(1, -1);
    }

    return {
      id: `${rawBook.shelf}-${rawBook.row}-${index + 1}`,
      title: rawBook.title,
      author: author,
      subject: subject,
      shelf: rawBook.shelf,
      row: rawBook.row,
      level: 'General',
      language: language,
      summary: language === 'AR' 
        ? `ملخص كتاب "${rawBook.title}" سيكون متاحاً قريباً.`
        : `A summary for the book "${rawBook.title}" will be available soon.`,
    };
  });
};

// 4. تصدير البيانات النهائية
export const bookData: Book[] = processBookData(rawBookData);

// 5. دالة البحث المخصصة للاستخدام في تطبيق الويب
export function findInCatalog(q: string): Book[] {
  const query = (q || '').toLowerCase().trim();
  if (!query) return [];

  const results = bookData.filter((b) => {
    const text = `${b.title} ${b.author} ${b.subject}`.toLowerCase();
    return text.includes(query);
  });

  // نرجع أول 5 نتائج فقط للحفاظ على سرعة الاستجابة
  return results.slice(0, 5);
}
