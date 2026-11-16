/** Grant/deny/inherit applies per verified school Google email, independently from role.
 * The backend's key allowlist MUST match these entries; the "admin" role is NOT a feature.
 */
export const EFIPS_FEATURES = [
  {
    "id": "catalog",
    "ar": "دليل المكتبة",
    "en": "Library catalog",
    "group": "core"
  },
  {
    "id": "saqr_ai",
    "ar": "صقر الذكي",
    "en": "Saqr AI",
    "group": "core"
  },
  {
    "id": "digital_library",
    "ar": "المكتبة الرقمية",
    "en": "Digital library",
    "group": "core"
  },
  {
    "id": "creators",
    "ar": "بوابة المبدعين",
    "en": "Creators portal",
    "group": "core"
  },
  {
    "id": "suggestions",
    "ar": "المقترحات",
    "en": "Suggestions",
    "group": "core"
  },
  {
    "id": "ielts",
    "ar": "مركز IELTS",
    "en": "IELTS Center",
    "group": "core"
  },
  {
    "id": "saqr_learning",
    "ar": "صقر يساعدني",
    "en": "Saqr Helps Me",
    "group": "special"
  },
  {
    "id": "schedule",
    "ar": "جدول الحصص (عرض للطلاب)",
    "en": "Library schedule (students view only)",
    "group": "special"
  },
  {
    "id": "national_identity",
    "ar": "صقر وهوية وطن — الصفحة",
    "en": "National identity hub",
    "group": "identity"
  },
  {
    "id": "passport",
    "ar": "جواز صقر الثقافي",
    "en": "Cultural passport",
    "group": "identity"
  },
  {
    "id": "emirati_language",
    "ar": "كنوز لغتنا الإماراتية",
    "en": "Emirati language treasures",
    "group": "identity"
  },
  {
    "id": "heritage_detective",
    "ar": "محقق ذاكرة وطن",
    "en": "Heritage detective",
    "group": "identity"
  },
  {
    "id": "flag_glory",
    "ar": "تحدي راية المجد",
    "en": "Flag of Glory",
    "group": "identity"
  },
  {
    "id": "voice_union",
    "ar": "تحدي صوت الاتحاد",
    "en": "Voice of the Union",
    "group": "identity"
  },
  {
    "id": "national_books",
    "ar": "جناح كتب الهوية الوطنية",
    "en": "National identity books",
    "group": "identity"
  },
  {
    "id": "challenges",
    "ar": "تحديات صقر — الصفحة",
    "en": "Saqr challenges hub",
    "group": "challenges"
  },
  {
    "id": "reading_quest",
    "ar": "بين السطور",
    "en": "Between the Lines",
    "group": "challenges"
  },
  {
    "id": "sort_library",
    "ar": "رتّب المكتبة",
    "en": "Organize the Library",
    "group": "challenges"
  },
  {
    "id": "saqr_studio",
    "ar": "استديو صقر",
    "en": "Saqr Studio",
    "group": "challenges"
  },
  {
    "id": "podcast",
    "ar": "بودكاست صقر",
    "en": "Saqr Podcast",
    "group": "challenges"
  }
] as const;
export type EfipsFeature = typeof EFIPS_FEATURES[number]['id'];
export type FeatureOverride = 'allow'|'deny'|'inherit';
export type EfipsFeatureMap = Record<EfipsFeature,boolean>;
export const EFIPS_FEATURE_KEYS: readonly EfipsFeature[] = EFIPS_FEATURES.map(x=>x.id);
export const FEATURE_ROUTE_KEYS: Record<string,EfipsFeature> = {
  '/search':'catalog',
  '/smart-search':'saqr_ai',
  '/digital-library':'digital_library',
  '/digital-library/arabic':'digital_library',
  '/digital-library/english':'digital_library',
  '/digital-library/english/ielts':'ielts',
  '/digital-library/national-identity':'national_books',
  '/creators':'creators',
  '/feedback':'suggestions',
  '/saqr-learning':'saqr_learning',
  '/schedule':'schedule',
  '/saqr-national-identity':'national_identity',
  '/saqr-national-identity/books':'national_books',
  '/saqr-national-identity/anthem':'voice_union',
  '/saqr-challenges':'challenges',
  '/saqr-reading-quest':'reading_quest',
  '/game':'sort_library',
  '/saqr-studio':'saqr_studio',
  '/podcast':'podcast',
};
