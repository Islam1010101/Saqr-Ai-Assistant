/** Source: EFIPS Google Drive / English Books / IELTS, inventory checked 2026-11-15.
 * This is a separate study catalog, NOT part of the existing ENGLISH_LIBRARY_DATABASE.
 * These are Drive file metadata only; no PDFs or text copies are hosted in the source code.
 * School Google account permissions remain authoritative when opening each file.
 */
export type IeltsCategory = 'cambridge' | 'guide' | 'trainer' | 'writing' | 'grammar' | 'vocabulary';
export type IeltsTrack = 'general' | 'unspecified';
export type IeltsResource = {
  id: string;
  title: string;
  originalName: string;
  category: IeltsCategory;
  track: IeltsTrack;
  description: string;
  driveLink: string;
  fileSizeBytes: number;
  sortOrder: number;
};

export const IELTS_RESOURCES: ReadonlyArray<IeltsResource> = [
  {
    "id": "IELTS_CAMBRIDGE_01",
    "title": "Cambridge IELTS 01",
    "originalName": "Cambridge IELTS 01.pdf",
    "category": "cambridge",
    "track": "unspecified",
    "description": "Cambridge IELTS practice-test volume 1. Check the uploaded edition and supplementary audio separately.",
    "driveLink": "https://drive.google.com/file/d/1Dt6jOyHlm37w610hnWkbauwr7tXmW2LZ/view",
    "fileSizeBytes": 2941500,
    "sortOrder": 1
  },
  {
    "id": "IELTS_CAMBRIDGE_02",
    "title": "Cambridge IELTS 02",
    "originalName": "Cambridge IELTS 02.pdf",
    "category": "cambridge",
    "track": "unspecified",
    "description": "Cambridge IELTS practice-test volume 2. Check the uploaded edition and supplementary audio separately.",
    "driveLink": "https://drive.google.com/file/d/1pgrdb7mVso1TO9OsSBwDsFCy9svqZujh/view",
    "fileSizeBytes": 619741,
    "sortOrder": 2
  },
  {
    "id": "IELTS_CAMBRIDGE_03",
    "title": "Cambridge IELTS 03",
    "originalName": "Cambridge IELTS 03.pdf",
    "category": "cambridge",
    "track": "unspecified",
    "description": "Cambridge IELTS practice-test volume 3. Check the uploaded edition and supplementary audio separately.",
    "driveLink": "https://drive.google.com/file/d/1v3sYXWVSSFud6DWdQELbzGl1-rmudfBr/view",
    "fileSizeBytes": 3403408,
    "sortOrder": 3
  },
  {
    "id": "IELTS_CAMBRIDGE_04",
    "title": "Cambridge IELTS 04",
    "originalName": "Cambridge IELTS 04.pdf",
    "category": "cambridge",
    "track": "unspecified",
    "description": "Cambridge IELTS practice-test volume 4. Check the uploaded edition and supplementary audio separately.",
    "driveLink": "https://drive.google.com/file/d/12pN0jpbDRGfePmfgCAol9XWEOOnjXumO/view",
    "fileSizeBytes": 10096610,
    "sortOrder": 4
  },
  {
    "id": "IELTS_CAMBRIDGE_05",
    "title": "Cambridge IELTS 05",
    "originalName": "Cambridge IELTS 05.pdf",
    "category": "cambridge",
    "track": "unspecified",
    "description": "Cambridge IELTS practice-test volume 5. Check the uploaded edition and supplementary audio separately.",
    "driveLink": "https://drive.google.com/file/d/1b8q2vEMn3GXE_7JyjZAqXJTtV1GDIouf/view",
    "fileSizeBytes": 18815030,
    "sortOrder": 5
  },
  {
    "id": "IELTS_CAMBRIDGE_06",
    "title": "Cambridge IELTS 06",
    "originalName": "Cambridge IELTS 6.pdf",
    "category": "cambridge",
    "track": "unspecified",
    "description": "Cambridge IELTS practice-test volume 6. Check the uploaded edition and supplementary audio separately.",
    "driveLink": "https://drive.google.com/file/d/1Dd0gG2aE-ZEgex_EJxJZg5amSdX2zdvN/view",
    "fileSizeBytes": 21863339,
    "sortOrder": 6
  },
  {
    "id": "IELTS_CAMBRIDGE_07",
    "title": "Cambridge IELTS 07",
    "originalName": "Cambridge IELTS 07.pdf",
    "category": "cambridge",
    "track": "unspecified",
    "description": "Cambridge IELTS practice-test volume 7. Check the uploaded edition and supplementary audio separately.",
    "driveLink": "https://drive.google.com/file/d/1G3b0A_YflLs4eWCwEsqb21DNc1jSZIW9/view",
    "fileSizeBytes": 35410445,
    "sortOrder": 7
  },
  {
    "id": "IELTS_CAMBRIDGE_08",
    "title": "Cambridge IELTS 08",
    "originalName": "Cambridge IELTS 08.pdf",
    "category": "cambridge",
    "track": "unspecified",
    "description": "Cambridge IELTS practice-test volume 8. Check the uploaded edition and supplementary audio separately.",
    "driveLink": "https://drive.google.com/file/d/1LYQsIEleCLE_KHhmUpnwCL_avR5PbGi-/view",
    "fileSizeBytes": 9979713,
    "sortOrder": 8
  },
  {
    "id": "IELTS_CAMBRIDGE_09",
    "title": "Cambridge IELTS 09",
    "originalName": "Cambridge IELTS 09.pdf",
    "category": "cambridge",
    "track": "unspecified",
    "description": "Cambridge IELTS practice-test volume 9. Check the uploaded edition and supplementary audio separately.",
    "driveLink": "https://drive.google.com/file/d/1L0sVy58uKN7bzpWqm6ukaKrO04uSL1_R/view",
    "fileSizeBytes": 25105659,
    "sortOrder": 9
  },
  {
    "id": "IELTS_CAMBRIDGE_10",
    "title": "Cambridge IELTS 10",
    "originalName": "Cambridge IELTS 10.pdf",
    "category": "cambridge",
    "track": "unspecified",
    "description": "Cambridge IELTS practice-test volume 10. Check the uploaded edition and supplementary audio separately.",
    "driveLink": "https://drive.google.com/file/d/1dj8cyRwDhsqX9XPk7b6U-iPZD9r73Ke9/view",
    "fileSizeBytes": 52513667,
    "sortOrder": 10
  },
  {
    "id": "IELTS_CAMBRIDGE_11",
    "title": "Cambridge IELTS 11",
    "originalName": "Cambridge IELTS 11 General Training.pdf",
    "category": "cambridge",
    "track": "general",
    "description": "Cambridge IELTS practice-test volume 11. Check the uploaded edition and supplementary audio separately.",
    "driveLink": "https://drive.google.com/file/d/1ukI3Xzq3P02I3I7ECBe1kEcHs4iU-gTt/view",
    "fileSizeBytes": 34433583,
    "sortOrder": 11
  },
  {
    "id": "IELTS_CAMBRIDGE_12",
    "title": "Cambridge IELTS 12",
    "originalName": "Cambridge IELTS 12 General Training.pdf",
    "category": "cambridge",
    "track": "general",
    "description": "Cambridge IELTS practice-test volume 12. Check the uploaded edition and supplementary audio separately.",
    "driveLink": "https://drive.google.com/file/d/1X9yd91dF3t2SYJo46hvviT7pkllVe6Ws/view",
    "fileSizeBytes": 15678194,
    "sortOrder": 12
  },
  {
    "id": "IELTS_CAMBRIDGE_13",
    "title": "Cambridge IELTS 13",
    "originalName": "Cambridge IELTS 13 General Training.pdf",
    "category": "cambridge",
    "track": "general",
    "description": "Cambridge IELTS practice-test volume 13. Check the uploaded edition and supplementary audio separately.",
    "driveLink": "https://drive.google.com/file/d/1XoKjyTpeIMICxla8rJTf2Td2K4AQWKlI/view",
    "fileSizeBytes": 17218053,
    "sortOrder": 13
  },
  {
    "id": "IELTS_CAMBRIDGE_14",
    "title": "Cambridge IELTS 14",
    "originalName": "Cambridge IELTS-14-General Training.pdf",
    "category": "cambridge",
    "track": "general",
    "description": "Cambridge IELTS practice-test volume 14. Check the uploaded edition and supplementary audio separately.",
    "driveLink": "https://drive.google.com/file/d/1mvwmM7O_lSxtuVwMr3sW-ZS1j9OTiJ2y/view",
    "fileSizeBytes": 12107999,
    "sortOrder": 14
  },
  {
    "id": "IELTS_CAMBRIDGE_15",
    "title": "Cambridge IELTS 15",
    "originalName": "cambridge IELTS 15 General Training.pdf",
    "category": "cambridge",
    "track": "general",
    "description": "Cambridge IELTS practice-test volume 15. Check the uploaded edition and supplementary audio separately.",
    "driveLink": "https://drive.google.com/file/d/1mfGf3MkyLu1TnWAmGH7oj58yPE-cUzzg/view",
    "fileSizeBytes": 9611843,
    "sortOrder": 15
  },
  {
    "id": "IELTS_CAMBRIDGE_16",
    "title": "Cambridge IELTS 16",
    "originalName": "Cambridge IELTS 16 General Training.pdf",
    "category": "cambridge",
    "track": "general",
    "description": "Cambridge IELTS practice-test volume 16. Check the uploaded edition and supplementary audio separately.",
    "driveLink": "https://drive.google.com/file/d/1QtPcuNM1LRzbB9RQtDs5CiDqRrZuT06I/view",
    "fileSizeBytes": 43512634,
    "sortOrder": 16
  },
  {
    "id": "IELTS_CAMBRIDGE_17",
    "title": "Cambridge IELTS 17",
    "originalName": "Cambridge IELTS 17 General Training.pdf",
    "category": "cambridge",
    "track": "general",
    "description": "Cambridge IELTS practice-test volume 17. Check the uploaded edition and supplementary audio separately.",
    "driveLink": "https://drive.google.com/file/d/1SKolXFcUT9dUmTl6DZ3oavVCGS29VWEl/view",
    "fileSizeBytes": 10715573,
    "sortOrder": 17
  },
  {
    "id": "IELTS_CAMBRIDGE_18",
    "title": "Cambridge IELTS 18",
    "originalName": "Cambridge IELTS 18 General Training.pdf",
    "category": "cambridge",
    "track": "general",
    "description": "Cambridge IELTS practice-test volume 18. Check the uploaded edition and supplementary audio separately.",
    "driveLink": "https://drive.google.com/file/d/1OZ0ZFZNKk0P1uHl58sar_X-PIfWBKVCH/view",
    "fileSizeBytes": 9690300,
    "sortOrder": 18
  },
  {
    "id": "IELTS_CAMBRIDGE_19",
    "title": "Cambridge IELTS 19",
    "originalName": "Cambridge IELTS 19 General Training.pdf",
    "category": "cambridge",
    "track": "general",
    "description": "Cambridge IELTS practice-test volume 19. Check the uploaded edition and supplementary audio separately.",
    "driveLink": "https://drive.google.com/file/d/1fbP_8Zkai1nzb7jLhF1-KyEaapHY7Wc7/view",
    "fileSizeBytes": 100345671,
    "sortOrder": 19
  },
  {
    "id": "IELTS_GUIDE",
    "title": "The Official Cambridge Guide to IELTS",
    "originalName": "The Official Cambridge Guide to IELTS.pdf",
    "category": "guide",
    "track": "unspecified",
    "description": "A general IELTS preparation reference. The edition and included supplementary media are not yet verified.",
    "driveLink": "https://drive.google.com/file/d/1JPt774HNrdTFwjX4gMWKJrYjYcvILuKJ/view",
    "fileSizeBytes": 65553206,
    "sortOrder": 100
  },
  {
    "id": "IELTS_TRAINER",
    "title": "IELTS Trainer",
    "originalName": "IELTS Ttrainerpdf.pdf",
    "category": "trainer",
    "track": "unspecified",
    "description": "Test-preparation workbook. Practice components and answer-key coverage are not independently verified.",
    "driveLink": "https://drive.google.com/file/d/1Zy_N2OR96jLYHqeqBdJUP4DPQV7omPQA/view",
    "fileSizeBytes": 61875713,
    "sortOrder": 101
  },
  {
    "id": "IELTS_WRITING",
    "title": "Writing for IELTS",
    "originalName": "Writing-for-IELTS.pdf",
    "category": "writing",
    "track": "unspecified",
    "description": "Writing practice and guidance. Edition details and exercise completeness require PDF review.",
    "driveLink": "https://drive.google.com/file/d/1_4Nk9mOai8yrstcUlnasNH-dD3tDyfKZ/view",
    "fileSizeBytes": 7283781,
    "sortOrder": 102
  },
  {
    "id": "IELTS_GRAMMAR",
    "title": "IELTS Grammar for Bands 6.5 and Above",
    "originalName": "IELTS Grammar For Bands 6.5 and above.pdf",
    "category": "grammar",
    "track": "unspecified",
    "description": "Grammar revision for higher-band IELTS preparation. Exercise coverage is pending edition review.",
    "driveLink": "https://drive.google.com/file/d/103PEHZVZn9BzxLplp2Myw-MBe6b28aaz/view",
    "fileSizeBytes": 62455569,
    "sortOrder": 103
  },
  {
    "id": "IELTS_VOCABULARY",
    "title": "IELTS Vocabulary for Bands 6.5 and Above",
    "originalName": "IELTS Vocabulary for Bands 6.5 and Above by Pauline Cullen Avaye hahir.pdf",
    "category": "vocabulary",
    "track": "unspecified",
    "description": "Vocabulary development for higher-band IELTS preparation. This title is taken from the uploaded filename.",
    "driveLink": "https://drive.google.com/file/d/1ET3XCyYEl34nZgCS1-DTHVcCuAM0b_8R/view",
    "fileSizeBytes": 38022900,
    "sortOrder": 104
  }
];

export const findIeltsResource = (id: string): IeltsResource | undefined =>
  IELTS_RESOURCES.find(resource => resource.id === id);

export const IELTS_COACH_STARTERS = {
  reading: "Act as my IELTS Reading coach. First ask whether I am preparing for Academic or General Training. Create an original short passage, then ask one question at a time, explain my mistakes, and gradually increase difficulty. Do not copy published test passages.",
  writing: "Act as my IELTS Writing coach. Ask whether I am preparing for Academic or General Training, and ask my target band. Then give me one original writing task, wait for my answer, and provide detailed feedback on task achievement, coherence, vocabulary, grammar, and specific corrections. Do not claim an official IELTS score.",
  listening: "Act as my IELTS Listening coach. Ask me which test type I am preparing for and explain a practical listening strategy. If audio is unavailable, use an original transcript-based comprehension exercise and clearly label it as text-based practice, not a real listening test.",
  speaking: "Act as my IELTS Speaking coach. Run an original speaking-practice interview one question at a time, following Parts 1–3. Give supportive English feedback on fluency, vocabulary, and grammar. If no audio input is provided, do not claim to evaluate my pronunciation.",
} as const;
export type IeltsCoachSkill = keyof typeof IELTS_COACH_STARTERS;
