/**
 * Physical-book additions transcribed from EFIPS Book1.xlsx (64 supplied rows).
 * Append only: existing catalog IDs, borrowings and saved-book keys stay stable.
 * ISBNs are source-provided, not edition-verified; invalid entries are omitted.
 */
const sourceRows = [
  ["Inside Energy Machines","Steve Parker",24,2,"9781848108349"],
  ["الهندسة للأطفال الفضوليين","ربيع ديركي , Charis Oxlade",35,4,"9789933644475"],
  ["موسوعة العلوم","ربيع ديركي , Giles Sparrow",35,4,"9789933400675"],
  ["الكيمياء للأطفال الفضوليين","ربيع ديركي , Lynn Huggins-Cooper",35,4,"9789933644321"],
  ["موسوعة الديناصورات","ربيع ديركي , Clare Hibbert",35,4,"9789933400668"],
  ["علم الفضاء للأطفال الفضوليين","ربيع ديركي , Giles Sparrow",35,4,"9789933644826"],
  ["الفيزياء للأطفال الفضوليين","ربيع ديركي , Laura Baker , Alex Woolf",35,4,"9789933644444"],
  ["موسوعة التكنولوجيا","ربيع ديركي , Anita Loughrey , Alex Woolf",35,4,"9789933400941"],
  ["موسوعة كوكب الأرض","ربيع ديركي , Clare Hibbert , Honor Head",35,4,"9789933400958"],
  ["DIARY OF A WIMPY KID : THE DEEP END","JEFF KINNEY",30,3,"9780241760031"],
  ["DIARY OF A WIMPY KID : THE LAST STRAW","JEFF KINNEY",30,3,"9780241342701"],
  ["DIARY OF A WIMPY KID : THE LONG HAUL","JEFF KINNEY",30,3,"9780241342763"],
  ["DIARY OF A WIMPY KID :DOG DAYS","JEFF KINNEY",30,3,"978024134271"],
  ["DIARY OF A WIMPY KID :HARD LUCK","JEFF KINNEY",30,3,"9780141353074"],
  ["DIARY OF A WIMPY KID :DIPER OVERLOAD","JEFF KINNEY",30,3,"9781419762949"],
  ["DIARY OF A WIMPY KID :WRECKING BALL","JEFF KINNEY",30,3,"9780241759998"],
  ["DIARY OF A WIMPY KID :DOUBLE DOWN","JEFF KINNEY",30,3,"9780241342787"],
  ["DIARY OF A WIMPY KID :THE GETAWAY","JEFF KINNEY",30,3,"9780241437865"],
  ["DIARY OF A WIMPY KID :THE MELTDOWN","JEFF KINNEY",30,3,"9780241566695"],
  ["MIDDLE SCHOOL :SAVE RAFE!","JAMES PATTERSON",30,3,"9780099596431"],
  ["SHERLOCK HOLMES : A STUDY IN SCARLET","SIR ARTHUR CONAN DOYLE",40,2,"9781782264095"],
  ["SHERLOCK HOLMES :THE VEILED LODGER","SIR ARTHUR CONAN DOYLE",40,2,"9781782264170"],
  ["SHERLOCK HOLMES :THE SPECKLED BAND","SIR ARTHUR CONAN DOYLE",40,2,"9781782264132"],
  ["SHERLOCK HOLMES :THE BLUE CARBUNCLE","SIR ARTHUR CONAN DOYLE",40,2,"9781782264125"],
  ["SHERLOCK HOLMES :THE NAVAL TREATY","SIR ARTHUR CONAN DOYLE",40,2,"9781782264156"],
  ["SHERLOCK HOLMES : THE SUSSEX VAMPIRE","SIR ARTHUR CONAN DOYLE",40,2,"9781782264163"],
  ["SHERLOCK HOLMES :THE RED-HEADED LEAGUE","SIR ARTHUR CONAN DOYLE",40,2,"1711721264778"],
  ["SHERLOCK HOLMES :THE REIGATE SQUIRES","SIR ARTHUR CONAN DOYLE",40,2,"9781782264149"],
  ["SHERLOCK HOLMES :THE THREE STUDENTS","SIR ARTHUR CONAN DOYLE",40,2,"9781782264187"],
  ["SHERLOCK HOLMES :THE SIGN OF THE FOUR","SIR ARTHUR CONAN DOYLE",40,2,"9781782264101"],
  ["ADVENTURES ON TRAIN : DAGER AT DEAD MAN'S PASS","M.G LEAONARD, SAM SEDGMAN",30,3,"9781035038770"],
  ["ADVENTURES ON TRAIN : MURDER ON THE SAFARI STAR","M.G LEAONARD, SAM SEDGMAN",30,3,"9781035038770"],
  ["ADVENTURES ON TRAIN : KIDNAP ON THE CALFORNIA COMET","M.G LEAONARD, SAM SEDGMAN",30,3,"9781035038770"],
  ["ADVENTURES ON TRAIN : THE HIGHLAND FALCON THIEF","M.G LEAONARD, SAM SEDGMAN",30,3,"9781035038770"],
  ["THE ALCHEMIST","PAULO COELHO",15,3,"9780061122415"],
  ["THINK AND GROW RICH NAPOLEON HILL","DR ARTHUR R.PELL",3,1,"9780091900212"],
  ["MUFASA : THE LION KING","CHARLES ORGBON III",22,6,"9781836501008"],
  ["DISNRY ENCANTO : MYSTERY IN THE RAINFOREST","SUSANA ILLERA MARTINEZ",22,5,"9781837712991"],
  ["CAPTAIN AMERICA : AHERO LOOKS LIKE YOU","KWAME MBALIA",22,3,"9781836503644"],
  ["MARVEL : GUARDIANS OF THE GALAXY","CLARISSA WONG",22,3,"9781484700068"],
  ["JUDY MOODY : GOES TO COLLEGE","MEGAN MCDONALD",30,3,"9781536200782"],
  ["WALT DISNEY'S : DONALD DUCK","LARS JESEN",22,3,""],
  ["SPIDEY AND HIS AMAZING FRINDS : TEAM SPIDEY DOESIT ALL!","LUKE ROBERTSON",22,3,"9781837951307"],
  ["ULTIMATE FOOTBALL HEROES : SON","MATT OLDFIELD",25,4,"9781789464719"],
  ["SCIENCE COMICS : ROCKETS DEFYING GRAVITY","ANNE DROZD , JERZY DROZD",24,2,"9781626728257"],
  ["ميساء في زمن العباقرة : نجمة ليوناردو","بياتريشه مازيني",35,1,"9789933160104"],
  ["افتح النوافذ واكتشف : جسم الإنسان","SHAYNIE EDWARD",35,4,"9789933165307"],
  ["افتح النوافذ واكتشف : الديناصورات","SHAYNIE EDWARD",35,4,"9789933165338"],
  ["افتح النوافذ واكتشف : الفضاء","SHAYNIE EDWARD",35,4,"9789933165321"],
  ["أحمد بن ماجد أسد البحار","عائشة الغيص",41,6,"9552259948978"],
  ["خنير وكتارة من الإمارات","حليمة عبدالله راشد محمد",41,5,"9789948253303"],
  ["ابن ماجد","فاطمة شرف الدين",41,9,"9789948245629"],
  ["أ ب ت من الإمارات","كلمات",41,8,"9789948158158"],
  ["كيف تصبح صقارًا ؟","عائشة مطر المنصوري",41,9,"9789948243755"],
  ["سمور في وادي الوريعة","كريمة السعدي",41,9,"9789948232711"],
  ["شيرلوك سام وخدعة الكتب المصورة","إيه. جيه. لو",33,3,"6281072124892"],
  ["وتلك الأيام","شيخة مبارك سيف الناخي",41,2,"9789948449492"],
  ["موسوعتي الصغيرة : أطلس العالم","إليزابيث كارني",35,4,"6221133358828"],
  ["امرح مع العلوم : الهواء الماء الضوء","مكتبة جرير",35,4,"6281072118426"],
  ["الإمارات في القلب : شعر","طلال سعيد الجنيبي",33,4,"9789948398493"],
  ["محمد بن زايد والتعليم","مركز الإمارات للدراسات والبحوث الاستراتيجية",41,2,"9789948242598"],
  ["رواية الاعتراف","علي أبو ريش",33,3,"9789948376330"],
  ["محمد بن زايد رجل السلام الأول","سلطان حميد الجسمي",41,2,"9789948449195"],
  ["الآن سيصدقون","ريم محمد",41,9,"9789948247623"]
] as const;

export type AddedPhysicalBook = {
  title:string;author:string;shelf:number;row:number;isbn?:string;
};
const validISBN13=(isbn:string):boolean=>isbn.length===13&&/^\d{13}$/.test(isbn)&&
  [...isbn].reduce((sum,d,i)=>sum+Number(d)*(i%2===0?1:3),0)%10===0;
export const physicalBookAdditions:AddedPhysicalBook[] = sourceRows.map(([title,author,shelf,row,isbn])=>({
 title,author,shelf,row,...(validISBN13(isbn)?{isbn}: {})
}));
