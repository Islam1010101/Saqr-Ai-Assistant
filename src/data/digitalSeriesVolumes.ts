/** Verified direct PDF file IDs from the ten original EFIPS Google Drive series folders.
 * Source folders stay unchanged in Drive. Each volume has its own stable reading key.
 * Titles come from PDF filenames; age groups, levels and page counts are not inferred.
 */
export type DigitalSeriesVolume = { fileId: string; title: string; order: number | null };
export const DIGITAL_SERIES_VOLUMES: Record<string, DigitalSeriesVolume[]> = {
  "38": [
    {
      "fileId": "16LGHNPV2Ckoc0NUr9a4VinDy7dhOPY6C",
      "title": "Diary of A Wimpy Kid (1)",
      "order": 1
    },
    {
      "fileId": "17w6NLyMFX8kXOvem3xqhtNQ8q1r-6y4J",
      "title": "Rodrick Rules (2)",
      "order": 2
    },
    {
      "fileId": "1WrM43dmZu_vr4kGuSwFUGLiBaH-tOS1R",
      "title": "Cabin Fever (6)",
      "order": 6
    },
    {
      "fileId": "1z0W4VhjKH-RWmysytSUbzR6tgx5cmry8",
      "title": "The Third Wheel (7)",
      "order": 7
    },
    {
      "fileId": "10fsESHKDYF62ULsG7JUlndcyD2id50lv",
      "title": "Hard Luck (8)",
      "order": 8
    },
    {
      "fileId": "1jUonzBR8xaQSPnYLeWoIwJUz152He1Cj",
      "title": "The Long Haul (9)",
      "order": 9
    },
    {
      "fileId": "1FNi2C2-FQCxpL_EBxt-zCQlcznom6tBh",
      "title": "Old School (10)",
      "order": 10
    },
    {
      "fileId": "1chryme5U_OmPiCakjtSLkXUetB5LP-sM",
      "title": "Double Down (11)",
      "order": 11
    },
    {
      "fileId": "1WjxgBn1uFJ1Zg5-Bs5zrEFi40UO2zLMx",
      "title": "The Getaway (12)",
      "order": 12
    },
    {
      "fileId": "1N8HdBLTCOVaeH0tg5buWR_N8NkPOzG8N",
      "title": "Meldown (13)",
      "order": 13
    }
  ],
  "AR_1": [
    {
      "fileId": "1pf0MvdcLiBQlp7iSNIjbDOKRtcl8WMyU",
      "title": "إبزيم الحذاء",
      "order": null
    },
    {
      "fileId": "1Id_Y9Uiel_8zfvjruYyB-ALEgY_uvUco",
      "title": "إخناتون",
      "order": null
    },
    {
      "fileId": "1RLqKQ0FGSQBo2PlRk4rCU4FEiUsByGQN",
      "title": "أقوى من الموت",
      "order": null
    },
    {
      "fileId": "1QpA9U8pyqZ1bv0mmqv6VUxguC2Gj51Pk",
      "title": "الأربعة الكبار",
      "order": null
    },
    {
      "fileId": "1DFXYAQtsDwLosXQxkynjKiAu0jPkxOhd",
      "title": "الإصبع المتحرك",
      "order": null
    },
    {
      "fileId": "1o4c1SED3Y8OH--_B8hGL1ATHSK3UkxIG",
      "title": "البيت الأعوج",
      "order": null
    },
    {
      "fileId": "1ddfxv77cg4DKisw-WX4eefoAtE3LeHwi",
      "title": "البيت المائل",
      "order": null
    },
    {
      "fileId": "1Eur7KiD2pCVPs1N-d6slf3Wh7KLtZQKg",
      "title": "الثعلب",
      "order": null
    },
    {
      "fileId": "1ZEdv_Kib_ZNR6DbrnmsHgQP2ueXMZw0w",
      "title": "الجريمة النائمة",
      "order": null
    },
    {
      "fileId": "1aLwhL3DK4E8op9ItB7SbNjUW98y7yldu",
      "title": "الرجل الغامض",
      "order": null
    },
    {
      "fileId": "1i8e6RMiNr_2POtKYHFa15dHbuIqu7k2K",
      "title": "الستارة",
      "order": null
    },
    {
      "fileId": "1POtgSuRqGAciGZofFjSYqO5PFdyHyXkb",
      "title": "الطائرة المفقودة",
      "order": null
    },
    {
      "fileId": "1OYD7pDUo8agqfYRrubwtVydVLmPhB1fr",
      "title": "العميل السري",
      "order": null
    },
    {
      "fileId": "1BXHJBRGFDTyqTnUepsgAVhJvni5vz-4U",
      "title": "الفتاة الثالثة",
      "order": null
    },
    {
      "fileId": "1tB9yJyPtJTz85gcubmqyZqc1hRbOCQnD",
      "title": "القضايا الأخيرة للآنسة ماربل",
      "order": null
    },
    {
      "fileId": "1I_odesNCJkBFX1HqslsP_2fRr_R1ppn9",
      "title": "القضية الكبرى",
      "order": null
    },
    {
      "fileId": "1FQ8oTA1OxoQvcg814Q4XMTOCvdBi81KG",
      "title": "انتقام العدالة",
      "order": null
    },
    {
      "fileId": "1_VFmp4-rUUWOVXxRgDYGEgEA_hlwRzU1",
      "title": "جثة في المكتبة",
      "order": null
    },
    {
      "fileId": "1utvKSt4enxCVuFXbFnuM1kQUrTvr68PS",
      "title": "جريمة العيد",
      "order": null
    },
    {
      "fileId": "1JMqtL-nGHXByUdViMipFrF_UAL_U_xaL",
      "title": "جريمة في القرية",
      "order": null
    },
    {
      "fileId": "1tu8Ae6qWmdO8EK_UY4LLRKxr6WxuzPB1",
      "title": "جريمة في القصر",
      "order": null
    },
    {
      "fileId": "1QJO66BTHDnR7sw5LkorjcqWziVWx7-N-",
      "title": "خداع المرايا",
      "order": null
    },
    {
      "fileId": "1-EiiAeF-Rnt_1IDx0LMORANtefi_KIYc",
      "title": "رجل بلا وجه",
      "order": null
    },
    {
      "fileId": "16d3jkgkGsfNVi5mCKh1eP_Qb2uFJ7iYK",
      "title": "رصاصة في الرأس",
      "order": null
    },
    {
      "fileId": "1uHRPNI95uZnkQ-HolXW88zqFi46c2Rm_",
      "title": "لغز سيتافورد",
      "order": null
    },
    {
      "fileId": "1ptgGLoYD_p1wK8uP4LGqxgJZ0ftEwov6",
      "title": "محنة البريء",
      "order": null
    },
    {
      "fileId": "1kg8C37Haj2BzoOWf19OF08d03UwLCU5F",
      "title": "وصلوا الى بغداد",
      "order": null
    }
  ],
  "AR_7": [
    {
      "fileId": "1jBYeBtwEqBx95SWQfb5V-tmoL-9LBLsi",
      "title": "أطفال الغابة",
      "order": 1
    },
    {
      "fileId": "1s_K5CM4Ii6fe841c2jPmf8s26aqbdJP_",
      "title": "سندريلا",
      "order": 2
    },
    {
      "fileId": "1fcBVWjL1RS0lfj7hY-NGxhDgG5BikEjk",
      "title": "السلطان المسحور",
      "order": 3
    },
    {
      "fileId": "1Dp1VyZ-dEdMxnk462xWCepm8rd4kLyZ9",
      "title": "القداحة العجيبة",
      "order": 4
    },
    {
      "fileId": "1rPx7L01KGuiSUCU65gsdvmh0HWpUY3r-",
      "title": "البجعات المتوحشات",
      "order": 5
    },
    {
      "fileId": "1B3d54FMR6F2HCZ9H9RcAwJ3Zd4H60RR7",
      "title": "الأميرة الحسناء",
      "order": 6
    },
    {
      "fileId": "1HU__mKJwGf8owcoP4htsXPuJf2vwo3XN",
      "title": "الرفيق المجهول",
      "order": 7
    },
    {
      "fileId": "150unncb1fnZy2aSwI5COUwpKO1qYk90i",
      "title": "الأميرة و الثعبان",
      "order": 8
    },
    {
      "fileId": "1vjQ9D1dz2jR5cRnO4In38ky9Jo5y1iiv",
      "title": "الملك عادل",
      "order": 9
    },
    {
      "fileId": "1rYwY_3jmBZLK-y2KR88mFbdN2AW8y1XP",
      "title": "البلبل",
      "order": 10
    },
    {
      "fileId": "1AhJhbp50zPyU2ixZiQZhc5W0sG8VSZ5n",
      "title": "الأنف العجيب",
      "order": 11
    },
    {
      "fileId": "1JpewBvL_aO0N8F7nb3KKLiMpYKCJWRM3",
      "title": "الجميلة النائمة",
      "order": 12
    },
    {
      "fileId": "1f0qAeMUnhK3X6uZW_QfL0qbZNy3zKIp0",
      "title": "عقلة الأصبع",
      "order": 14
    },
    {
      "fileId": "1hGt-f3BvjHiMJO_C_urWM9v2wV0O98CE",
      "title": "الأخوات الثلاث",
      "order": 15
    },
    {
      "fileId": "16EUtNZnfm2jPxa91NwXAlfsOBlZivXDG",
      "title": "البنت و الأسد",
      "order": 16
    },
    {
      "fileId": "124Ry4Gh0k_FeBRjp4H0Er51uqKoxydCm",
      "title": "المغامر الجرىء",
      "order": 17
    },
    {
      "fileId": "1rdngxeXWMcPfJ-c_HYqVtCfYEKR_eDuV",
      "title": "قصير الذيل",
      "order": 18
    },
    {
      "fileId": "1N2X5Zc1H9yZO3Uj6TpwoktHy_MxBThYJ",
      "title": "الليمون العجيب",
      "order": 19
    },
    {
      "fileId": "1V0OZvzun71yWB_yM3f1NvVob67ET6UXz",
      "title": "فى جزيرة النور",
      "order": 20
    },
    {
      "fileId": "1sXOAitWGlRGvMCa8nBTnVEVn7hIVoAP4",
      "title": "الفأرة البيضاء",
      "order": 21
    },
    {
      "fileId": "1T2BLXQ2qX7Ehr7ngxPQ0BQqgF9D4l8gI",
      "title": "جبل العجائب",
      "order": 22
    },
    {
      "fileId": "109pcShSEO9QVf-BCc8jYPYyFcl9bQAcU",
      "title": "أليس فى بلاد العجائب",
      "order": 23
    },
    {
      "fileId": "15FKQ6w8VLlH10hfmEbPMzHFmEYyAJiLf",
      "title": "الراعى الشجاع",
      "order": 24
    },
    {
      "fileId": "1Sv_MkkiDRRCmtwsSYCFOWiv6B3UujfEN",
      "title": "الصياد الماهر",
      "order": 25
    },
    {
      "fileId": "1-YniWT16pPwyxJYQ6O__OtHqBJW8jou_",
      "title": "الكرة الذهبية",
      "order": 26
    },
    {
      "fileId": "1TYnflEL3qZ_QvG6c7_v-70ssZTNti3DF",
      "title": "الشاطر محظوظ",
      "order": 27
    },
    {
      "fileId": "1USLrRLhbAoMwVW4aKrJwjnVqwIUEojFE",
      "title": "الحصان الطيار",
      "order": 28
    },
    {
      "fileId": "1A5aG-xwa4Q1C6vXAaFqP62R3KGOVjlVA",
      "title": "أميرة القصر الذهبى",
      "order": 29
    },
    {
      "fileId": "159j37HgkJPTlgCU-PX78vNyRSgajJFzX",
      "title": "دنانير لبلبة",
      "order": 30
    },
    {
      "fileId": "1GZoezD9AxaRR_M7CZGTc6xtNjklGONXC",
      "title": "نهر الذهب",
      "order": 31
    },
    {
      "fileId": "1HwXM9bZHQeOKRqz_ZiobR8DTGqy0bRaq",
      "title": "خاتم السلطان",
      "order": 32
    },
    {
      "fileId": "1b6Ia2rTakBDmhFe9E1ML1MmAJP0_9SwB",
      "title": "المرآة السحرية",
      "order": 33
    },
    {
      "fileId": "1-rxjx5VhO2boKM_CV3Tl7YTio1dx1z9L",
      "title": "بنات الصياد",
      "order": 34
    },
    {
      "fileId": "1bktU5ooFWhLPk-eJJkRujulqBoHKpWvM",
      "title": "الوزير الحكيم",
      "order": 35
    },
    {
      "fileId": "1DNEt-fzWNSGKIp208gGqapv9MiWWscNv",
      "title": "سر اللحية البيضاء",
      "order": 36
    },
    {
      "fileId": "1gNMktJmLOmtcsRleO0nh9BBk79--WaWP",
      "title": "سر الشعر الأسود",
      "order": 37
    },
    {
      "fileId": "1Epvz2KvNUkZ5y0Z3NAus9uVCIqJwme3S",
      "title": "القدم الذهبية",
      "order": 38
    },
    {
      "fileId": "1PrOsXmbhdQjPepl3jYMCy6r2pN39CR65",
      "title": "الرحلة العجيبة لعروس النيل",
      "order": 39
    },
    {
      "fileId": "1vMR5mCmTW4pgxciY5trWlGH9M13PyMIL",
      "title": "سر العلبة الذهبية",
      "order": 40
    },
    {
      "fileId": "1k_ywQ55PlTjcq0jeUGUzX0XY8lwN1Gga",
      "title": "التاج المسحور",
      "order": 41
    },
    {
      "fileId": "1k25MWn721lnnq1TJtpVCs06faT808i5T",
      "title": "عفاريت نصف الليل",
      "order": 42
    },
    {
      "fileId": "1Xm5UmaQpDvPiAbSHqeqq4ErmebTSjop3",
      "title": "النجم الكبير",
      "order": 43
    },
    {
      "fileId": "1eD2MU-uufkPvgra5wqubx74_N-ixcv1-",
      "title": "مملكة العدل",
      "order": 44
    },
    {
      "fileId": "1I49lwaQ7-sT7cUlPi_2cUOfRDWYmjvxe",
      "title": "الصياد المسكين و المارد اللعين",
      "order": 45
    },
    {
      "fileId": "1RS6YkfVHsMIbCScJcrRdOWxKMaWyxoXh",
      "title": "بدر البدور و الحصان المسحور",
      "order": 46
    },
    {
      "fileId": "1K4JwgJrnIb9trQrPorkeE_XdtJs2Hb51",
      "title": "مغامرة زهرة مع الشجرة",
      "order": 47
    },
    {
      "fileId": "1SHNmI41bMYa6L0Nn1XFBSzQ8sCH4vS2K",
      "title": "أمير فى بلاد الأقزام",
      "order": 48
    },
    {
      "fileId": "1ouyy0BROCvH0Or55oUHMklPnRVwXtxzg",
      "title": "الطبلة المسحورة",
      "order": 49
    },
    {
      "fileId": "19QtbrAflL11GJlkZ3SnaUl47eN-GZTPt",
      "title": "حلم من دخان",
      "order": 50
    },
    {
      "fileId": "1aC-762FXCO6aCOV95UQbzgZUuuH8cG7X",
      "title": "بلاد النهر",
      "order": 51
    },
    {
      "fileId": "1d7N2Ua1Ze6LNeu2jvjo_Vf_LZemrs0FW",
      "title": "حسناء و الثعبان الملكى",
      "order": 52
    },
    {
      "fileId": "1C3ypaeuA-B_hSFSuu5dEKRkb99CVZWhL",
      "title": "تائه فى القناة",
      "order": 53
    },
    {
      "fileId": "1vdvHTs-QnEbgddw17Tm_kOOUVGidOacF",
      "title": "سلطان ليوم واحد",
      "order": 54
    },
    {
      "fileId": "16NV5fRW8O8ar64S381dQWDNYMoMFJ-TR",
      "title": "ضوء النهار و الملك زنكار",
      "order": 55
    },
    {
      "fileId": "1HTROWGUBD-kvo58hNAMMWa8i8vFl9Z_8",
      "title": "الجزيرة المهجورة",
      "order": 56
    },
    {
      "fileId": "1QL39-s2CDONSMqG62J_JrDoikPPKcZPL",
      "title": "طيور الأحلام",
      "order": 57
    },
    {
      "fileId": "1zXj2ynmf8Lnx5VUosgANbnyRslK_gpZu",
      "title": "الصياد و دينار السلطان",
      "order": 58
    },
    {
      "fileId": "13KrJ3oKOHq-BV0X2mICpZbcCmUy2Oxd-",
      "title": "ثروة تحت الأرض",
      "order": 59
    },
    {
      "fileId": "16x_I8JFIqYExpGouBlnTaKEE0FKIzq0r",
      "title": "الأميرة المخطوفة",
      "order": 60
    },
    {
      "fileId": "1CTVMnQNbD8w1PNwkEgYITjP6DHMAPpne",
      "title": "الهدهد يمتلك تاجا",
      "order": 61
    },
    {
      "fileId": "1iUT2hp4K7k9CnuKsZtGOAOgeic1wJbE8",
      "title": "الكسلان و تاج السلطان",
      "order": 62
    },
    {
      "fileId": "1wmW_rp8xXsbeoGn9n7rteJUAEWeYhupM",
      "title": "الماسة الزرقاء",
      "order": 63
    },
    {
      "fileId": "10bEyVMpM9ibjkvIc2BcldJ16q1yZh20h",
      "title": "العظماء السبعة",
      "order": null
    }
  ],
  "AR_18": [
    {
      "fileId": "1jBa8Z7y_OuUsrpX91pMUbn3po5UWnUzl",
      "title": "الأختفاء الغامض",
      "order": 1
    },
    {
      "fileId": "189dbv7BxQvphfSzSfj6Y5xeI35yFNLMK",
      "title": "سباق الموت",
      "order": 2
    },
    {
      "fileId": "1zZ0wYJF-_0bNS4tFE3NHFmC-JyU11xQ5",
      "title": "قناع الخطر",
      "order": 3
    },
    {
      "fileId": "1gTHbQRgrgCPaTNlWTW0A50HBCz2xRv9E",
      "title": "صائد الجواسيس",
      "order": 4
    },
    {
      "fileId": "1w38J-AgzwmJNUdt-1aCdtJKffBEYzyYV",
      "title": "الجليد الدامي",
      "order": 5
    },
    {
      "fileId": "17tTBKwRITbHzMzHANt_CcTDJnGwMECdd",
      "title": "قتال الذئاب",
      "order": 6
    },
    {
      "fileId": "1idBq6EIesRQtraYNLDHeaAkN3dPm54Cd",
      "title": "بريق الماس",
      "order": 7
    },
    {
      "fileId": "16uY9rVlqSzn15sQ4eqgyhSWREJl0HDuT",
      "title": "غريم الشيطان",
      "order": 8
    },
    {
      "fileId": "1fABKfbTUmgob5l_oJQNzsgWIGFUoz7v8",
      "title": "أنياب الثعبان",
      "order": 9
    },
    {
      "fileId": "1asypbI1LWL46sg_XoixjIQIo32n70IXm",
      "title": "المال الملعون",
      "order": 10
    },
    {
      "fileId": "1AO61BwF_NCIs3vw-ZAE9d6G-GyZ7Zd00",
      "title": "المؤامرة الخفية",
      "order": 11
    },
    {
      "fileId": "1uj6ri2C8RVPwq9o-Jg5zEtrHucpZa4IJ",
      "title": "حلفاء الشر",
      "order": 12
    },
    {
      "fileId": "1Rv54A8CROHKGDewJYT16UMVuh6lYXMyv",
      "title": "ارض الاهوال",
      "order": 13
    },
    {
      "fileId": "1vtbF8w4EBzy6FDbMAvJZK169BXfhh5VU",
      "title": "عملية مونت كارلو",
      "order": 14
    },
    {
      "fileId": "18TjU-T4gjZL1nJ3HQLAVqKrLbS5Hav0L",
      "title": "إمبراطورية السم",
      "order": 15
    },
    {
      "fileId": "1l3oYfY-8x3ZXTvimovxzKco31F53Qwxp",
      "title": "الخدعة الاخيرة",
      "order": 16
    },
    {
      "fileId": "1J3wThEefOidlEcpjHA16L9QILkydxv2Z",
      "title": "انتقام العقرب",
      "order": 17
    },
    {
      "fileId": "1swgzfDowMzULw5w7HfPcXFzw9IZKU0Rs",
      "title": "قاهر العمالقة ج1",
      "order": 18
    },
    {
      "fileId": "1bb9dcY1_dOV_CzTUml5pAmBIa38Wg8k8",
      "title": "ابواب الجحيم ج2",
      "order": 19
    },
    {
      "fileId": "1WvzdQ6dknJsv9DSCHrwlBJgvV-a3MFDc",
      "title": "ثعلب الثلوج",
      "order": 20
    },
    {
      "fileId": "1jqiYysxYkMTWzFzTAqk1gZzC425LrKrq",
      "title": "مضيق النيران",
      "order": 21
    },
    {
      "fileId": "1VSsk2yn7VpCOKCxxKt8csacnzSq0Yd9M",
      "title": "أصابع الدمار",
      "order": 22
    },
    {
      "fileId": "1iXcL_DJ_9dwJnhRXrPQbEF1u004uKRMg",
      "title": "فارس اللؤلؤ",
      "order": 23
    },
    {
      "fileId": "19SsqX--AwJJC3z3MCjhrTZ3eZdTp5DPH",
      "title": "الضباب القاتل",
      "order": 24
    },
    {
      "fileId": "173xMVYFPEapXP_BGlR5DSi0Nk2xVyLAO",
      "title": "الخنجر الفضى",
      "order": 25
    },
    {
      "fileId": "1HZDkeWWH-NP8iBaKeEByxM0bhaFwac0m",
      "title": "اخر الجبابرة",
      "order": 26
    },
    {
      "fileId": "1aEMIJBFy3DNpCRRO4bgUiNS7SyOX9uJd",
      "title": "الجوهرة السوداء",
      "order": 27
    },
    {
      "fileId": "1roriHzmUIlE7lLHITWv5tLtc6lkjhW4B",
      "title": "قلب العاصفة",
      "order": 28
    },
    {
      "fileId": "1-YPBzGDzgF9xprghrmdqZciIBLB7aCWQ",
      "title": "الصراع الشيطاني",
      "order": 29
    },
    {
      "fileId": "1wdpwbMY3Qm7zDdWdT9RcdF9qaf9P3rCr",
      "title": "الرمال المحرقة",
      "order": 30
    },
    {
      "fileId": "1B20i9abkFFwagyuJ5vXCJ_MTh_m5p7RS",
      "title": "الخطوة الاولى",
      "order": 31
    },
    {
      "fileId": "11qKMEerNQAwIwBfYs9NDjlkKfr1V790r",
      "title": "خيط اللهب",
      "order": 32
    },
    {
      "fileId": "1UqvI1k6h7OMHywV5OWJI8CmaVroT4zPJ",
      "title": "القوة أ",
      "order": 33
    },
    {
      "fileId": "1A7_rs8bwqK2yGb35_maCxQOGsISj3VJh",
      "title": "مارد الغضب",
      "order": 34
    },
    {
      "fileId": "1uABu3V5jOLLHavwQh9Uln0vmhCxVBEWd",
      "title": "قراصنة الجو",
      "order": 35
    },
    {
      "fileId": "1UuAulxWUYngWeUvLdHdLt2ppxeleMvOO",
      "title": "ذئب الاحراش",
      "order": 36
    },
    {
      "fileId": "1Jpp9RmQe4tuQJpTdzW55zlxvmetxgKJH",
      "title": "مخلب الشيطان",
      "order": 37
    },
    {
      "fileId": "1p7jUnksxxIjsFXZ-aTC58FikbTrsLvlJ",
      "title": "لعبة المحترفين",
      "order": 38
    },
    {
      "fileId": "1b5BYEyDIyGow5FTyY3Lu98JIBhbn0ECP",
      "title": "أعماق الخطر",
      "order": 39
    },
    {
      "fileId": "1eAQk-e39jjbCTSbFKwP_ntlpOS0wBUmS",
      "title": "مهنتي القتل",
      "order": 40
    },
    {
      "fileId": "1v72Lw7HuNTAAFo0KnN9VjwdeWQRWeVHx",
      "title": "الانتحاريون",
      "order": 41
    },
    {
      "fileId": "18LszPDkgYQcyC0OKav0EG-8g19GBgXu9",
      "title": "الهدف القاتل",
      "order": 42
    },
    {
      "fileId": "1K3i21xDhe2Ube2nHOYQgKdntBdattPXm",
      "title": "المخاطر",
      "order": 43
    },
    {
      "fileId": "1xSZgUOmHjexeQluYKEfjWZArryH9_h9g",
      "title": "العين الثالثة ج1",
      "order": 44
    },
    {
      "fileId": "1hEQ4Hp2tmojcAHa4ACVxgjg86tLKPSCs",
      "title": "القضبان الجليدية ج2",
      "order": 45
    },
    {
      "fileId": "1u5bdlHpQCA5MV1zH6Q5XHaqh2rqH40fv",
      "title": "لهيب الثلج ج3",
      "order": 46
    },
    {
      "fileId": "1SXCFAZLGVOtdoo3MW8B73l9GFBhO6A4-",
      "title": "الرصاصة الذهبية ج1",
      "order": 47
    },
    {
      "fileId": "1YeJzsYkq0LGdP8D7SdfG1ZI9oz9wNm81",
      "title": "شيطان المافيا ج2",
      "order": 48
    },
    {
      "fileId": "1IVrNz2dZ-VCn8XPBaKvVGorim-mT77M8",
      "title": "الضربة القاضية ج3",
      "order": 49
    },
    {
      "fileId": "1OWr3weEec7PiOflfoeuh29xpwe9GUKEo",
      "title": "مهمة خاصة",
      "order": 50
    },
    {
      "fileId": "1i6AsJX8HbzRoWSPzau35dO56Vc0X79LS",
      "title": "سم الكوبرا",
      "order": 51
    },
    {
      "fileId": "1vzLYlXueUMOZa6zwwIvVFZEVjzOmIon1",
      "title": "جبال الموت ج1",
      "order": 52
    },
    {
      "fileId": "1mUgje_wmThFNQ-6k3AJegqMhSG8yocwJ",
      "title": "ذئاب ودماء ج2",
      "order": 53
    },
    {
      "fileId": "1DkPGKBFF7YlvZMbYP-ZqVKpcYJ5-ujfX",
      "title": "رحلة الهلاك ج1",
      "order": 54
    },
    {
      "fileId": "1lvEQeDo7pIhm07ZVM9vBxLr8Ta9pwZOx",
      "title": "أفعى برشلونة ج2",
      "order": 55
    },
    {
      "fileId": "1KinEaM-aiJIJsximIZxTJ2ZQSCrT8COg",
      "title": "الفهد الأبيض",
      "order": 56
    },
    {
      "fileId": "1gXdAHp0c9qFskKKctHi87agRTrqh1HN9",
      "title": "عملية الادغال",
      "order": 57
    },
    {
      "fileId": "1wkJeqcgUCE3kDM2QW35wm8DKz3rGAIDc",
      "title": "اعدام بطل ج1",
      "order": 58
    },
    {
      "fileId": "12BIXLk2oXctyAvvNCp890sQLOXZV0QZK",
      "title": "انتقام شبح ج2",
      "order": 59
    },
    {
      "fileId": "1UQGdc3g5awWD7zv8V5ckGFbYS_g-Yv4h",
      "title": "دونا كارولينا",
      "order": 60
    },
    {
      "fileId": "1s4vsr-i7V5vNLF1r3YynDZIUpLu4eMmY",
      "title": "ملائكة الجحيم ج1",
      "order": 61
    },
    {
      "fileId": "1DMj1T1Whix5O4FVhbq1bKH_6bRSzLF0u",
      "title": "ملك العصابات ج2",
      "order": 62
    },
    {
      "fileId": "17VcjszaxBh27BpCF8YWndGR_vWShXsy4",
      "title": "الجاسوس ج3",
      "order": 63
    },
    {
      "fileId": "1I9dBGF6KOgVb4_qkup57F7qafUtCE5BI",
      "title": "تحت الصفر ج1",
      "order": 64
    },
    {
      "fileId": "1GVepWCYiIwdJWH-vYyQLKblSSVydAx0j",
      "title": "الجليد المشتعل ج2",
      "order": 65
    },
    {
      "fileId": "12fhBkXajMukr7XqJmffB3Bt_HLKGh0J2",
      "title": "ألف وجه ج1",
      "order": 66
    },
    {
      "fileId": "1XgUBRHdzVpCkplbCLdjuuviHQdULvLcR",
      "title": "الجحيم المزدوج ج2",
      "order": 67
    },
    {
      "fileId": "1Q2wXpn5A8IKduurNAgF8ApBET0oyQ_Kb",
      "title": "قلعة الصقور ج1",
      "order": 68
    },
    {
      "fileId": "1f2EGGEqUnxP3EU_aGE8koGztcgWKbYrL",
      "title": "أجنحة الإنتقام ج2",
      "order": 69
    },
    {
      "fileId": "1Fewn9K4jrRSAGkz_qJEH3VNwLWd90Emb",
      "title": "أباطرة الشر ج3",
      "order": 70
    },
    {
      "fileId": "1DdCfzg2_yDWMLM0m_Ob7z1jxTov2D5Jq",
      "title": "ضد القانون ج1",
      "order": 71
    },
    {
      "fileId": "1WS4qORyMW2gjimdhR5uZeN4NwcGsl_Ox",
      "title": "شريعة الغاب ج2",
      "order": 72
    },
    {
      "fileId": "11cgzegYb02KDrHHQlehvj2wTV-zmlFED",
      "title": "المعتقل الرهيب ج1",
      "order": 73
    },
    {
      "fileId": "1Z6SosGak1kkyuEHrzsPbj_XdOpmX2_ad",
      "title": "الدائرة الجهنمية ج2",
      "order": 74
    },
    {
      "fileId": "1GuqyGk_K7rpNKpIANb-wlbx7WiU39lGH",
      "title": "أسوار الجحيم ج3",
      "order": 75
    },
    {
      "fileId": "1GBX8do1zk8VEN3Jlaht-2rY5C3h3I3E_",
      "title": "النهر الأسود ج1",
      "order": 76
    },
    {
      "fileId": "1-QtE9dwaT4QplV-qVYK8IgEHcj6BScs5",
      "title": "عمالقة مارسيليا",
      "order": 77
    },
    {
      "fileId": "1jQLkELhoFFlUq4R9ICDnIxYabTZiMwwC",
      "title": "صحراء الدم ج1",
      "order": 78
    },
    {
      "fileId": "1WI6k1Vtdh3lIGf-CFps4rGRDb1EZK_FW",
      "title": "صفقة الموت ج2",
      "order": 79
    },
    {
      "fileId": "1PU0s2A9lHfRx5f8iEq4cWS1qSC23KnYf",
      "title": "وكر الإرهاب ج3",
      "order": 80
    },
    {
      "fileId": "1w_zJCOAw_A7MCiHRMK5p4-vAUaKxt7Ot",
      "title": "الرجل الآخر ج1",
      "order": 81
    },
    {
      "fileId": "1TyKIrj19YLJutdaX-Y141QnF67Ixi4gH",
      "title": "الأخطبوط ج2",
      "order": 82
    },
    {
      "fileId": "1ILkRbn2474qz6omUbHfmw7Zq_CxqRl1O",
      "title": "معركة القمة ج3",
      "order": 83
    },
    {
      "fileId": "1dbzBFq0kgqeQMg12aBwc1ahfbSlr8FtY",
      "title": "جزيرة الجحيم ج4",
      "order": 84
    },
    {
      "fileId": "1QWwssBqief5uVSBk1z6yqwz4d7tA3i1u",
      "title": "لمسة الشر ج1",
      "order": 85
    },
    {
      "fileId": "1-wivRgpI0JCkfYpfvqdljiz9skMN1OiN",
      "title": "الثعلب ج2",
      "order": 86
    },
    {
      "fileId": "1_7DZQhqjtFWocLocRw8v25tmJUoTmuGL",
      "title": "خط المواجهة ج3",
      "order": 87
    },
    {
      "fileId": "1PU5YcsjP9idC3oA0YXVJnb1jAat8qK7M",
      "title": "سفير الخطر ج1",
      "order": 88
    },
    {
      "fileId": "19jmMXP-xmZC-KoF3WFAmAslAG4BmkCzS",
      "title": "قبضة السفاح ج2",
      "order": 89
    },
    {
      "fileId": "1eCKJBLg_CAem2Y168dqrrdnt8-ko0urr",
      "title": "الهدف ج3",
      "order": 90
    },
    {
      "fileId": "1Ocb48pGKCe45xr1r73PZ_rdiN0KdS-LN",
      "title": "الوجه الخفى ج1",
      "order": 91
    },
    {
      "fileId": "1v8WIOkQ1xW55LMN7O4XhpqUhqVveDoAo",
      "title": "الخطر ج2",
      "order": 92
    },
    {
      "fileId": "1h-Ht6qANym2cE-mTBw0x5XQ0HQwlA-dv",
      "title": "أرض العدو ج3",
      "order": 93
    },
    {
      "fileId": "15WeIHKXpQLvkuBh1vEUvxpOCmTArqR4a",
      "title": "كتيبة الدمار ج1",
      "order": 94
    },
    {
      "fileId": "142veNmz82Qty1Tq9XEixhgUaZcKkL9P5",
      "title": "الصراع الوحشي ج2",
      "order": 95
    },
    {
      "fileId": "10ADtFJeMgmx1Bfc9rciNHsyjps0ZHpmF",
      "title": "المعركة الفاصلة ج3",
      "order": 96
    },
    {
      "fileId": "1HfiBmMuvkltmIP7YpTSpta0vDk-KY9fG",
      "title": "الصقر الأعمى ج1",
      "order": 97
    },
    {
      "fileId": "1EB41uQAQ21Cd-IHTp_Sn0gcfJ5woFmcD",
      "title": "القناص ج2",
      "order": 98
    },
    {
      "fileId": "1bA9VZ0H9c1O7ZygUvyiBFM8wabksDZrS",
      "title": "مذاق الدم ج3",
      "order": 99
    },
    {
      "fileId": "1wHh80-yqgd6VfYXcXrPBwqM5enR3Aay8",
      "title": "الضربة القاصمة ج4",
      "order": 100
    },
    {
      "fileId": "1apJa6_DE2sUYCbeX6yHyh524YWRhMRc-",
      "title": "انقلاب",
      "order": 101
    },
    {
      "fileId": "1e4kqxY6U9QldjuVkAmv4mOGJihdSw14W",
      "title": "نهر الدم",
      "order": 102
    },
    {
      "fileId": "1dqFE6fDPbc4F1AaF8RzUNv9y6Ed95lRb",
      "title": "المحترف",
      "order": 103
    },
    {
      "fileId": "1jMJ6ZvHFQ5uLNs_QIXkKL7sSkjKcpghu",
      "title": "الإعصار الأحمر ج1",
      "order": 104
    },
    {
      "fileId": "1gk6tPQ-PTEI-TH7K-KXXO3Tfh47mWjZe",
      "title": "عقارب الساعة ج2",
      "order": 105
    },
    {
      "fileId": "1HKe701Tb79G0bIq21rLJF4uLPosK0Xsv",
      "title": "الأفعى ج1",
      "order": 106
    },
    {
      "fileId": "1Jp5ifUADyTYJTnnOx0C528vrS2n70gIU",
      "title": "إتحاد القتلة ج2",
      "order": 107
    },
    {
      "fileId": "1Meg3w-iEVaIb0zqftAdviYq3OAg_iG8R",
      "title": "الفخ ج3",
      "order": 108
    },
    {
      "fileId": "16dRifxAA5ukJPbCGo4Of7mpqUigYizKV",
      "title": "قبضة الشر ج4",
      "order": 109
    },
    {
      "fileId": "1KYBH21b3cYVh_ylUI9Ms_xjiKKkIlbSU",
      "title": "إغتيال ج1",
      "order": 110
    },
    {
      "fileId": "1SIDOz3ERfi79nmFzOUKWvOTAACQC9syn",
      "title": "معبد الجريمة ج2",
      "order": 111
    },
    {
      "fileId": "1vaJSdL8r9l0L5_xhHVQdBHvwkqbXhiS6",
      "title": "الفريق الأسود ج3",
      "order": 112
    },
    {
      "fileId": "1xcNw0pC5mjRvdux27GEHFoNBE_UXDcfP",
      "title": "رياح الخطر ج1",
      "order": 113
    },
    {
      "fileId": "1oFmkcc_Qv3cjV6k7eFpf1YrOx29om0ry",
      "title": "ممر الجحيم ج2",
      "order": 114
    },
    {
      "fileId": "1nLVLIb0OpnHKtSqowvGoc2JBXi0FCvFd",
      "title": "بلا رحمة ج3",
      "order": 115
    },
    {
      "fileId": "1xmGLPhqGSjoHyHiUc0vc7kGXu0KXEe3y",
      "title": "مهرجان الموت ج4",
      "order": 116
    },
    {
      "fileId": "18uOrhwRpgcg9es0fbT1ckyoDOmf39ueh",
      "title": "عمالقة الجبال ج5",
      "order": 117
    },
    {
      "fileId": "1VISP9uQpV3SVBL4V5sbary9ns62Wq2kp",
      "title": "الأربعة الكبار ج1",
      "order": 118
    },
    {
      "fileId": "1IaLFPanTNPuqaVGjyqUizz-MhFxNnrPw",
      "title": "فوق القمة ج2",
      "order": 119
    },
    {
      "fileId": "1Df_T4jsI-6c8U0ZQjLUMlxHWuiu8dra_",
      "title": "السنيورا ج3",
      "order": 120
    },
    {
      "fileId": "1IaE8mPofoMcBIp5ec1jmPsQt-PGozrv-",
      "title": "وجه الأفعى ج4",
      "order": 121
    },
    {
      "fileId": "1ckRYhgS2BlA5pR1DRKhvmOSEMz8CEWfU",
      "title": "الأصابع الذهبية ج1",
      "order": 122
    },
    {
      "fileId": "1yliCEOS6usC4ZtMX95T9pH4fgDyneyTs",
      "title": "المستحيل ج2",
      "order": 123
    },
    {
      "fileId": "1CD67u_wV-jy67pzcZJz5sTYXBDd2Ti3K",
      "title": "اللمسة الأخيرة ج3",
      "order": 124
    },
    {
      "fileId": "1ci2K3xCSU2phIuQ_rt6Xqwhn2ypmTi5G",
      "title": "عملية النيل ج1",
      "order": 125
    },
    {
      "fileId": "1XUYMLC6xjarJ_0F42v-VVGK6QRnvJwbJ",
      "title": "ساعة الصفر ج2",
      "order": 126
    },
    {
      "fileId": "1iBjOtPxKOe-4aVNZaFtb6EcLXDNNljfF",
      "title": "نقطة الضعف ج1",
      "order": 127
    },
    {
      "fileId": "1nFOe5vjb7NZym6r-O8zC1_2xndWmTVoz",
      "title": "الصحوة ج2",
      "order": 128
    },
    {
      "fileId": "1QA1Yb0O6FZtqI1OMq0trNN_zFP8yVGkT",
      "title": "القراصنة ج3",
      "order": 129
    },
    {
      "fileId": "1SMfcT6vzBUbTcYBXZXuKdgsOnZ5OLmGt",
      "title": "محيط الدم ج4",
      "order": 130
    },
    {
      "fileId": "1BIiFAmKf1plq-slNpK_EnsKniBF6xkJy",
      "title": "الحدود ج1",
      "order": 131
    },
    {
      "fileId": "1RJoLqMORKsG43BAhSrGnxtaFUWEaW0OF",
      "title": "فريق المستحيل ج2",
      "order": 132
    },
    {
      "fileId": "1j7fIrnbosAsw5sh_TtxcpkoMrGGvPGa_",
      "title": "نمور الثلوج ج3",
      "order": 133
    },
    {
      "fileId": "16A7t6DSZaIX852UuVoVNhO4Am4ps-KOX",
      "title": "الابطال ج4",
      "order": 134
    },
    {
      "fileId": "1Uy6ZRd4M8bGaKxaM6tfswRpbA4bwsN79",
      "title": "الاستاذ ج1",
      "order": 135
    },
    {
      "fileId": "14Zrvpr8Q3z6nnkzC4ijjbqksob9v-jNM",
      "title": "المغامرة الكبرى ج2",
      "order": 136
    },
    {
      "fileId": "1-ooYeojDT1VZyeScnbZZi8NJR6EqPR-n",
      "title": "مدينة الذئاب ج3",
      "order": 137
    },
    {
      "fileId": "1HbeIejMDjAkQpgYhBYIGh9_EBF30Soiz",
      "title": "الضحايا ج4",
      "order": 138
    },
    {
      "fileId": "1RaMCW4EoZF4LFDswyRFLiktnnma2rvF5",
      "title": "الوحش الادمى ج5",
      "order": 139
    },
    {
      "fileId": "11OgNwKJhD_NihMJpFyPRQZ4dt8VIpUFC",
      "title": "المواجهة الأخيرة ج6",
      "order": 140
    },
    {
      "fileId": "14d7xHI4foebL05pK78lepExVjVHpeUz_",
      "title": "رمال و دماء ج1",
      "order": 141
    },
    {
      "fileId": "1SuQXLMM-fYpCm_RpMh0W2oSyYgcBeEZw",
      "title": "رجل وجيش ج2",
      "order": 142
    },
    {
      "fileId": "1Xv-tOH32rbCNS_S6LdXG8DEHSx810ic7",
      "title": "الأوراق المكشوفة ج1",
      "order": 143
    },
    {
      "fileId": "1Uo0UUYz3ZjFV-aftyDy2N_aL4-6Ry6wV",
      "title": "المحترفون ج2",
      "order": 144
    },
    {
      "fileId": "1_Bw_nT0d9A6NgfCbuKnxAi97TU0r65BP",
      "title": "الورقة الأخيرة ج3",
      "order": 145
    },
    {
      "fileId": "1FWJWyGUbgWEvDnWPkUXhOarY3lxRppUd",
      "title": "المأزق ج1",
      "order": 146
    },
    {
      "fileId": "1nmGq4VG8_gfaqzuwIB9RG9kj1srs9XvO",
      "title": "الغامضة ج2",
      "order": 147
    },
    {
      "fileId": "1yx4hoJQWGPgXbaAA9ca6ZPFo2EJssqcJ",
      "title": "الخطة ب ج3",
      "order": 148
    },
    {
      "fileId": "1UzH6RwDvuzQXQuLEmb0YVVA3J_uNHnjx",
      "title": "المصيدة ج4",
      "order": 149
    },
    {
      "fileId": "1tl3wuZSfTE5OEkonmzwkyaLznGVueWVD",
      "title": "النهاية ج5",
      "order": 150
    },
    {
      "fileId": "1U3vI__d8LGvhyMY4ulk_RM9iyKljEQwq",
      "title": "العوده ج1",
      "order": 151
    },
    {
      "fileId": "1rUvhb68OJ5nLmoJ3DC926BhTyzKdUQn2",
      "title": "القناع ج2",
      "order": 152
    },
    {
      "fileId": "13leeUZ07ShCIV-Snjx5OIJxn5OaqZkuq",
      "title": "الأحراش ج3",
      "order": 153
    },
    {
      "fileId": "1944kgnb8nakfXJ7GXNBE11CVIxuw_Rq0",
      "title": "الحرب ج4",
      "order": 154
    },
    {
      "fileId": "13OYVGRO8fMbyLweo_HrDxSkqG51vsW9Y",
      "title": "الإرهاب ج1",
      "order": 155
    },
    {
      "fileId": "1kK37rizgjfiMd8XsjxPQE5-IcvHt7cWd",
      "title": "المواجهة ج2",
      "order": 156
    },
    {
      "fileId": "12nv7GLxr1wz0UN80ey6XcNtufq7VIyRj",
      "title": "المدرب ج1",
      "order": 157
    },
    {
      "fileId": "1xjHc7EwsdmTQyJuOY3sl35wolHYh2AZc",
      "title": "الخطة ج2",
      "order": 158
    },
    {
      "fileId": "1A4ZNICiL8drevB8uksKytijCWPJBP1Ld",
      "title": "الهجوم ج3",
      "order": 159
    },
    {
      "fileId": "1Y7qAzeYussQiJxTeGuxHLSKQ2VsmABgE",
      "title": "الوداع ج4",
      "order": 160
    }
  ],
  "AR_19": [
    {
      "fileId": "1JorFopW3ojBP9FX9oy-VQxcfKxtsrbaW",
      "title": "مصاص الدماء و أسطورة الرجل الذئب",
      "order": 1
    },
    {
      "fileId": "1NJTyWPWWwqGDAGoUKUbwCDhWPqq1sy22",
      "title": "أسطورة النداهة",
      "order": 2
    },
    {
      "fileId": "10-_2b-c0trghZO8-iZHSwKEE4XtxvEJ4",
      "title": "أسطورة وحش البحيرة",
      "order": 3
    },
    {
      "fileId": "1pv6IqyiAUL_K0lv8w-qyGSBbpPGBf7cF",
      "title": "أسطورة آكل البشر",
      "order": 4
    },
    {
      "fileId": "1ziCwaM96GYdlUePt-AkLn1cdQIuuETCz",
      "title": "أسطورة الموتى الأحياء",
      "order": 5
    },
    {
      "fileId": "1xlBLQ3nO1UuIS5hDqJ4DBscuTO-3izEQ",
      "title": "أسطورة رأس ميدوسا",
      "order": 6
    },
    {
      "fileId": "1O-M2nrMEsZRQ4t9KSdpO0vaeu50YhDxz",
      "title": "أسطورة حارس الكهف",
      "order": 7
    },
    {
      "fileId": "105k8diH2KgBloZHdYlNiYO_wXqEPJ-OY",
      "title": "أسطورة أرض أخرى",
      "order": 8
    },
    {
      "fileId": "1VRFVx6IYaygHpvbF3NBsBcLcgoDSvQF3",
      "title": "أسطورة لعنة الفرعون",
      "order": 9
    },
    {
      "fileId": "12hLkuvV4zSM3tKdJdV7i6d7XLwgNUb7Q",
      "title": "حلقة الرعب",
      "order": 10
    },
    {
      "fileId": "1X1euFzhkQHg13vbBfDZJZJEuE3MyjIe4",
      "title": "أسطورة الكاهن الأخير",
      "order": 11
    },
    {
      "fileId": "1ilMB0kPgO29h7yC0hfMKpApxdx0ATVqA",
      "title": "أسطورة البيت",
      "order": 12
    },
    {
      "fileId": "1qY_LbmrOvsNU8X2q796waL7IfP7_airC",
      "title": "أسطورة اللهب الأزرق",
      "order": 13
    },
    {
      "fileId": "1XFVw_NjYq1aVHsY_fE9GWRH2Wq75LSpj",
      "title": "أسطورة رجل الثلوج",
      "order": 14
    },
    {
      "fileId": "1pKEv-QSrR36Ez8CGWzQVjdmgjS3G3Wul",
      "title": "أسطورة النبات",
      "order": 15
    },
    {
      "fileId": "1Hx5YuwrPuOdBnn5lOYHClvEXZIjec8pw",
      "title": "أسطورة  النافاراى",
      "order": 16
    },
    {
      "fileId": "1BEGxjDICWt3HbyUMe2L5douKuwIjClbT",
      "title": "أسطورة  حسناء المقبرة",
      "order": 17
    },
    {
      "fileId": "1hIxsqrX6aSbyreJq-fZudYQs4VEr4iVz",
      "title": "أسطورة الغرباء",
      "order": 18
    },
    {
      "fileId": "17HT1Aes0HUKcgI115np1pkCOVQr_AHri",
      "title": "أسطورة بو",
      "order": 19
    },
    {
      "fileId": "1zPxyo0rjdp8yMTuzyuU5yIsPY2OEOB8D",
      "title": "حكايات التاروت",
      "order": 20
    },
    {
      "fileId": "1gSQps-hwB0p4U856nDH8iwHcUIL-ZUOU",
      "title": "أسطورة  عدو الشمس",
      "order": 21
    },
    {
      "fileId": "1nLkXgO0Gx7OIUkJPT2cJ2Q7xxpZD3RuN",
      "title": "أسطورة المينوتور",
      "order": 22
    },
    {
      "fileId": "1ZSX4Fa4ETJd3sV-hQcz2r-uJ3jgYzA8j",
      "title": "أسطورة رعب المستنقعات",
      "order": 23
    },
    {
      "fileId": "1gCSdKveKoAXg4p6-GNIrw1s5YXHV6I6h",
      "title": "أسطورة أيجور ج1",
      "order": 24
    },
    {
      "fileId": "1Sq3mx84z7DCs1NqZ6qqLmSIGGfi97ZKG",
      "title": "أسطورة الجنرال العائد ج2",
      "order": 25
    },
    {
      "fileId": "1vkwmY5uQiyByPyThWHPFc5ddF8eLyWG9",
      "title": "أسطورة المواجهة ج3",
      "order": 26
    },
    {
      "fileId": "1Y-0DX5PbVXDHqvdHTHmTqjf_-4Xjv-dm",
      "title": "!..أسطورتنا",
      "order": 27
    },
    {
      "fileId": "190aXxgagDYjFFuEfGUR_kcEWjT7sF-5S",
      "title": "أسطورة آخر الليل ج1",
      "order": 28
    },
    {
      "fileId": "1F80RiarUt1Is4g5jo3vDnR014U_t1SU4",
      "title": "أسطورة الجاثوم ج2",
      "order": 29
    },
    {
      "fileId": "1LUw8cS0k-NkoQgaNuLPrscfXVZTvMmuX",
      "title": "أسطورة بعد منتصف الليل",
      "order": 30
    },
    {
      "fileId": "1d2sQgJfRMZjyHkVN5PicfMllHwKfZikF",
      "title": "!..أسطورتها",
      "order": 31
    },
    {
      "fileId": "13sv6DhftfSoM5YEa9PeDq2_fnFjwHAaP",
      "title": "أسطورة رفعت",
      "order": 32
    },
    {
      "fileId": "1ajAiJkexkwRffkhIHp5ufsViSyUE7TSQ",
      "title": "أسطورة أرض المغول",
      "order": 33
    },
    {
      "fileId": "13DJ_Kkm6iQeKSyiZ6jrUu7dLKp30zscf",
      "title": "أسطورة  الشاحبين ج1",
      "order": 34
    },
    {
      "fileId": "1JMXdxhEGfTqxgKJO1aSYeYABRD7HPn5x",
      "title": "أسطورة دماء دراكيولا ج2",
      "order": 35
    },
    {
      "fileId": "1niM4uP0M3q6qnqbC9cl6XTdaf-TliJZL",
      "title": "أسطورة الفصيلة السادسة",
      "order": 36
    },
    {
      "fileId": "1yzM8BgunL7X7y1sCBsZWbIVzzw-rvg9L",
      "title": "أسطورة الدمية",
      "order": 37
    },
    {
      "fileId": "1A0_uPe-TGKyPSaVQdO50-goaIvg6rApR",
      "title": "أسطورة النصف الآخر ج1",
      "order": 38
    },
    {
      "fileId": "1XEf0L80yeQ-OPzQsPPLM80YAG5leTt1R",
      "title": "أسطورة التوءمين ج2",
      "order": 39
    },
    {
      "fileId": "1IUm8dMz_IwarLMG2ZVGAdkqbcgVWpmna",
      "title": "وراء الباب المغلق",
      "order": 40
    },
    {
      "fileId": "1P3Jfl9jfMfbXPURyzKtrVf9IckAFaR5w",
      "title": "أسطورة  فرانكنشتاين",
      "order": 41
    },
    {
      "fileId": "18jAcTQ6xpIeC3q-H6T28wBoQ68p2fqZ0",
      "title": "أسطورة الكلمات السبع",
      "order": 42
    },
    {
      "fileId": "1JqBCTQTE_cgOAXB8eUHePhoUNw0_d0ok",
      "title": "أسطورة تختلف",
      "order": 43
    },
    {
      "fileId": "1sKjjgJh3Y5j4DWFZiTNKpmv2kEGaO4J6",
      "title": "أسطورة رجل بكين",
      "order": 44
    },
    {
      "fileId": "1yNLnuHz8oRhqO5Ab37JMzsKvUZVvwzn0",
      "title": "أسطورة بيت الأفاعى",
      "order": 45
    },
    {
      "fileId": "1ZS-dKiukZ7w26SDiXpL4H8yqF8VbKrXS",
      "title": "أسطورة طفل أخر",
      "order": 46
    },
    {
      "fileId": "1XrrNEVU7d6DWGinTBJr4snz3aJ0fdxno",
      "title": "أسطورة المنزل رقم ٥",
      "order": 47
    },
    {
      "fileId": "1d-ghklT8QBdVy761GbQG1H0yti_Mmqhd",
      "title": "أسطورة المومياء",
      "order": 48
    },
    {
      "fileId": "1KlqgtzXDNpxNwtPj_g0nMs3NOMA3ilAn",
      "title": "أسطورة العشيرة",
      "order": 49
    },
    {
      "fileId": "1LL4CZvmihAjKi7iYMFMn7Im71TFi3afa",
      "title": "أسطورة فى جانب النجوم",
      "order": 50
    },
    {
      "fileId": "1x3RYVDpQ0DhaprntGGUSLlZHmbd54fSz",
      "title": "أسطورة الرقم المشئوم",
      "order": 51
    },
    {
      "fileId": "1VIEVd11YUnfrr4xpqQLDe4zYaC--Y9xn",
      "title": "أسطورة مملة",
      "order": 52
    },
    {
      "fileId": "1QEHuXC7aqa0hDOT-oO_vEhLmjsecUB7p",
      "title": "أسطورة النبوءة ج1",
      "order": 53
    },
    {
      "fileId": "1kDKBiIpRliqyzEtpR_cxw6IhcNQTXDOh",
      "title": "أسطورة العراف ج2",
      "order": 54
    },
    {
      "fileId": "17NTIQQNutiRoOD803a1RJtrUuZVQxtXY",
      "title": "99 أسطورة",
      "order": 55
    },
    {
      "fileId": "1Ix_SkKP0f2yoh1-tjjrrTIHHH_WJQYcY",
      "title": "أسطورة ملك الذباب",
      "order": 56
    },
    {
      "fileId": "1_DEOUgiBaJS2svE4e-Wr9-cUmbZUyIEy",
      "title": "أسطورة المقبرة",
      "order": 57
    },
    {
      "fileId": "1cEey69yPyAdxlmoe7KJhXnZEUSAYDccA",
      "title": "أسطورة أرض العظايا",
      "order": 58
    },
    {
      "fileId": "19ZVjF_4Yl37-Nlp0RaoG8Xwc6MzmDG5v",
      "title": "أسطورة رونيل السوداء",
      "order": 59
    },
    {
      "fileId": "1SA2bAhx2coLKAMWPLsqzfhzqbr3nxJY2",
      "title": "المتحف الأسود",
      "order": 60
    },
    {
      "fileId": "1QK4HLK56t_hx3w4hwIBJRZcVmnPiaq-T",
      "title": "أسطورة الشئ",
      "order": 61
    },
    {
      "fileId": "1wytQyW8mOWdOmg9f3qVik5wQDec327M4",
      "title": "أسطورة صندوق بندورا",
      "order": 62
    },
    {
      "fileId": "1KjjMDnoCAxUnrXHPtsBiWkkIW4Xml0aP",
      "title": "أسطورة المحركين",
      "order": 63
    },
    {
      "fileId": "15dZ7CEymbvtZa-sAUtCZrigbsIQflPV6",
      "title": "أسطورتهم",
      "order": 64
    },
    {
      "fileId": "1phRCVL26sUkNKwUAm1fNteKRFjbnINmc",
      "title": "أسطورة العلامات الدامية",
      "order": 65
    },
    {
      "fileId": "17rfHfMD-hBBlHsuH84aQ03XsUxQHHE_K",
      "title": "الرجال اللذين لم يعودوا كذلك",
      "order": 66
    },
    {
      "fileId": "1TnY5KrwPbkVt1JFudQq89P9HDs8k1cuF",
      "title": "أسطورة بيت الأشباح",
      "order": 67
    },
    {
      "fileId": "1jQOBu8rvozrH8xVdTkjI4Axi0o4jArMZ",
      "title": "أسطورة أرض الظلام",
      "order": 68
    },
    {
      "fileId": "1MJuGiuTjPXohTIDdm2WttWlpTaQ8_2LP",
      "title": "أسطورة نادى الغيلان",
      "order": 69
    },
    {
      "fileId": "1OoJ0nGS6aqd36opjZQjuTTV0HfpoTQX2",
      "title": "الحلقات المنسية",
      "order": 70
    }
  ],
  "AR_20": [
    {
      "fileId": "1gByIaBAJ89glWO5z3Cx9ICoCHJJSoeCl",
      "title": "اختفاء الرقم صفر",
      "order": null
    },
    {
      "fileId": "1BofJmLAbGhB0eZXXcSC5rLR2yj6aVgyV",
      "title": "الأخطبوط",
      "order": null
    },
    {
      "fileId": "1ahVf21wMst4Gcm1NMxw0umNwmR3cP42i",
      "title": "الأمير الصغير",
      "order": null
    },
    {
      "fileId": "1fqk8l80QeaOgWQ-k2NZrXvq126ibjptW",
      "title": "الانفجار",
      "order": null
    },
    {
      "fileId": "1IPDNGEHK4nh1n1xeGPAJQqAWhNiOIQCl",
      "title": "التنين الأحمر",
      "order": null
    },
    {
      "fileId": "1jtq6XTjHMQSs5hOhu3AEjmMKcqTKB82F",
      "title": "الثقب الأسود",
      "order": null
    },
    {
      "fileId": "1okN0kca_DskE80njR5rTH8DfN2LBrE-x",
      "title": "الجزيرة الذهبية",
      "order": null
    },
    {
      "fileId": "1etCq_mkEtgc6u5_Vjb-Lg516aY9x17Z_",
      "title": "الحوت الذهبي",
      "order": null
    },
    {
      "fileId": "1uKtVZpYrWg9Tn2XiVCrZydA_5xZSMQEV",
      "title": "الخدعة الكبرى",
      "order": null
    },
    {
      "fileId": "1SwVD77SbrJqvetyKSRVo6r4zYXiq938l",
      "title": "الرجل الحديدي",
      "order": null
    },
    {
      "fileId": "1U4Broi5NAObWDX_bxIzX7-E6GbZwY7Hk",
      "title": "الرسالة الزرقاء",
      "order": null
    },
    {
      "fileId": "1XPvx7WOCmjLSoW4gNmDJ6h3ZmSuliXpM",
      "title": "السجن الرهيب",
      "order": null
    },
    {
      "fileId": "17p-xq0WZ5S1zQYAeZXhJpWaR79r4ACmK",
      "title": "القبض على النايل سات",
      "order": null
    },
    {
      "fileId": "1u_A0nSYP3BfCxKnsK-5AC6zTlfIVQE9D",
      "title": "القصر الأبيض",
      "order": null
    },
    {
      "fileId": "18cZDHc2q8A5mw1FxwioBUmsIBDaPigR1",
      "title": "القمر العميل",
      "order": null
    },
    {
      "fileId": "12EW5LlJH4m4zImIkglJ9Lm4VPuGqxeRi",
      "title": "الكنز الفضي",
      "order": null
    },
    {
      "fileId": "1F-NKTXdmlfr-1kmYdL8wA5yYHq742kOw",
      "title": "الكوبالت القاتلة",
      "order": null
    },
    {
      "fileId": "1Ny52OQDbfj-kUBYT_kDUfCfvwGsTrBHP",
      "title": "اللعبة القاتلة",
      "order": null
    },
    {
      "fileId": "11IEltkZ2aiikrYtxFvesVedWtEM9yKE-",
      "title": "الماكينات البشرية",
      "order": null
    },
    {
      "fileId": "1CUd5P8yW79XaxYCcumH9JbaoUNS7xq-u",
      "title": "المعركة الأخيرة",
      "order": null
    },
    {
      "fileId": "10-hdBN5S9iEJ1WapPmSwqAx3sKv6K_Fm",
      "title": "المنقذون",
      "order": null
    },
    {
      "fileId": "17sfq-kobXJXSuU6YCTomqouBY8uYwjNw",
      "title": "المهمة المستحيلة",
      "order": null
    },
    {
      "fileId": "12ZIdavG54dnzZsxm82IJlGgFSvWHcdgE",
      "title": "الهجوم الفضائي",
      "order": null
    },
    {
      "fileId": "1bt8Vu6L4JqD9Q1hYqL_PUdAO1movangK",
      "title": "تحدي القرصنة",
      "order": null
    },
    {
      "fileId": "1vmKTLYLNFof3u8mxtmQdv712WLBk-NVw",
      "title": "جزيرة ريوكيو",
      "order": null
    },
    {
      "fileId": "1DrprpLo8knjz_TfvUd6trTFwoyIRTEnE",
      "title": "حصان طروادة",
      "order": null
    },
    {
      "fileId": "1Npq3Vy2IqY4cU2dVWe-kbE9JjGB7t48-",
      "title": "حوار بين طفل ساذج وقط مثقف",
      "order": null
    },
    {
      "fileId": "1hI56cD9i058LDPHtoFycVYBMsIWYNeOC",
      "title": "رأس الأفعى",
      "order": null
    },
    {
      "fileId": "1TaqAUca20_nFLF4OyOmiJEg0L00eKK1t",
      "title": "رحلة الأخطار",
      "order": null
    },
    {
      "fileId": "1fNEDjDmi3mJ5XmUChGgQkMBBju5ZQgVz",
      "title": "سر اختفاء القبطان",
      "order": null
    },
    {
      "fileId": "159Ei_pMtlsxQi4B4q0Zbc3YgCOzwDWVY",
      "title": "سر الدلفين الغامض",
      "order": null
    },
    {
      "fileId": "1OePNGMeP8fqhPPGejTA1iJdTEgCD7NX_",
      "title": "سقوط القلعة",
      "order": null
    },
    {
      "fileId": "1bVwqntEAtsIUEwkpf0G896rKrzIuqVKG",
      "title": "صرخة القط البري",
      "order": null
    },
    {
      "fileId": "17RxTQKbdJ7w54AMdMzVBgplDV8pDHIkW",
      "title": "عش النسر",
      "order": null
    },
    {
      "fileId": "12ZzoOIq6VmhhJNOE16frXOiflbrja03j",
      "title": "عملية القرن القادم",
      "order": null
    },
    {
      "fileId": "1HHuzLdhpRt5AtNAc3LFPb_Mg9aqfHItg",
      "title": "قطار الذهب",
      "order": null
    },
    {
      "fileId": "1oxWLa_ZFpaFKQ4gyDRUyB4mGuZ-WvG0u",
      "title": "لعبة الأقزام",
      "order": null
    },
    {
      "fileId": "15kEp03ZYtAiD2PdOPdM59MHX7CBsbTTp",
      "title": "لغز القرية المسحورة",
      "order": null
    },
    {
      "fileId": "1esUiBJjPiVGRuVXZIfX3gFiXgkKK5Rl6",
      "title": "مسيرة قمرين",
      "order": null
    },
    {
      "fileId": "1DWcwzZm3hOBn1eB7p5v3gOjnAzAF2oH8",
      "title": "معرض الأخطار",
      "order": null
    },
    {
      "fileId": "1HNiCv2eA0tqUtESy9lIw8AwdfN8jnY2C",
      "title": "وحش الأعماق",
      "order": null
    }
  ],
  "AR_21": [
    {
      "fileId": "1JYfcIBUsYFXbvMbLjW8gCjI5PcfVBOLn",
      "title": "تفسير أبن كثير - المجلد الأول",
      "order": null
    },
    {
      "fileId": "1NV2fMvPCymrFKdw1jGGLm1WDIlP9T5oI",
      "title": "تفسير أبن كثير - المجلد الثاني",
      "order": null
    }
  ],
  "AR_42": [
    {
      "fileId": "1j_YWg3s3ZeCgRe8Hd5T7x43V9ma3yu-u",
      "title": "احتفال-السماء",
      "order": 1
    },
    {
      "fileId": "1FHhcDKcaB_b6CqyZfbIWNKoZ8Zkw2bdK",
      "title": "ابتسامة-نملة",
      "order": 2
    },
    {
      "fileId": "1wZDD-iNpzyvi0VHaU5lumodhM-wh3QkB",
      "title": "صاحب-المزرعتين",
      "order": 3
    },
    {
      "fileId": "1azdZlpWAKCEqdmQp7E_Hyc1BZVRGJ3bF",
      "title": "سفينة-نوح",
      "order": 4
    },
    {
      "fileId": "1UokeEMr2nUSWiKo2Rz1W_Ki_snVxyEGl",
      "title": "جبل-النور",
      "order": 5
    },
    {
      "fileId": "1zapytcaKVmGuql434YPo5TFLyNQbIMGY",
      "title": "صديق-الكون",
      "order": 6
    },
    {
      "fileId": "18OLUW0xtxmwttSkia3hhsNO9n6dLgxv-",
      "title": "جزاء-الخير",
      "order": 7
    },
    {
      "fileId": "14b9k6HJcbVBMn5xMSfEV6YASIj-fMJst",
      "title": "هدهدسليمان",
      "order": 8
    },
    {
      "fileId": "1RCeflVe0l0-8SQCRXT9kHslclfN-bd4Q",
      "title": "حكايةكعبة",
      "order": 9
    },
    {
      "fileId": "1_qVjpP4xqZea152jDxmARy5qjEywoBoK",
      "title": "ادخار-يوسف",
      "order": 10
    },
    {
      "fileId": "19Ubu6Az2seDbYYHZxEJn-_eiEYsgA987",
      "title": "الفيل-والطير-الأبابيل",
      "order": 11
    },
    {
      "fileId": "1BsuVsJrBtje_jU9kAuv5vtPE_wKCkdrx",
      "title": "ذو-القرنين",
      "order": 12
    }
  ],
  "AR_43": [
    {
      "fileId": "1XNfavfpipzZQMKeqmY_LQW9-icPVd3EU",
      "title": "آدم عليه السلام",
      "order": null
    },
    {
      "fileId": "1BNKTdfVYkcjnXbMstwEuzm12Ot16JCId",
      "title": "إبراهيم عليه السلام",
      "order": null
    },
    {
      "fileId": "1O_SV_usy69ElwuOBzAmhz5bR2X8B-c8u",
      "title": "إسماعيل عليه السلام",
      "order": null
    },
    {
      "fileId": "1UqR8GRdPE75m4abQOrDNChbkltwT8pgH",
      "title": "داوود عليه السلام",
      "order": null
    },
    {
      "fileId": "10AHjDbPXIpgoAYj6_HADF7rVVUcN9IiC",
      "title": "صالح عليه السلام",
      "order": null
    },
    {
      "fileId": "10hpdq3TIeTcDjFAmoBLFOdcFxVi997fT",
      "title": "عيسي عليه السلام",
      "order": null
    },
    {
      "fileId": "1mZSbiosYgju8bg475FnLhrH0XfoM-5w0",
      "title": "موسى عليه السلام",
      "order": null
    },
    {
      "fileId": "1veIO_1oJnzVP2nTrRb4mlSOCfOIYBeql",
      "title": "نوح عليه السلام",
      "order": null
    },
    {
      "fileId": "1H_gp35wT9xx8RgdBGPUHGLnb7xmxajRs",
      "title": "هود عليه السلام",
      "order": null
    },
    {
      "fileId": "1uk84fow0WRBkdOIbvmlqTa-JEi7aLH4m",
      "title": "يوسف عليه السلام",
      "order": null
    }
  ],
  "AR_51": [
    {
      "fileId": "1cglcYFVp-PlIMP68V4fjUQpKaxSVQUsC",
      "title": "أجرك صوت الدراهم",
      "order": null
    },
    {
      "fileId": "1QUjQ5enD10j-53hqLl4NSK6J3eRmPbvc",
      "title": "الله يعطيك",
      "order": null
    },
    {
      "fileId": "1-qwEb2h_O8_TMngI305QISZiF8OmeFrM",
      "title": "ثيابي اولى مني",
      "order": null
    },
    {
      "fileId": "14eiVQn_HlYXYX4WFFmOvAGy9QG36wHnR",
      "title": "جحا آكل السمك",
      "order": null
    },
    {
      "fileId": "1XEpi8KIrY14TZzjJuER5qjfI6w5ibtQp",
      "title": "جحا فارس الفرسان",
      "order": null
    },
    {
      "fileId": "1Qb4YSvLn0WrU0iLXgIbzvubV2zG7y-Xh",
      "title": "جحا مجنون",
      "order": null
    },
    {
      "fileId": "1XlQCiI9OTNk26393nVewBDjrDY5yVErg",
      "title": "جحا والببغاء",
      "order": null
    },
    {
      "fileId": "12wskeeIGL_bikSuKyThgUbtqo1onPGrD",
      "title": "جحا والجار",
      "order": null
    },
    {
      "fileId": "1_ud1HqVDrsstHk6jpeov8H1j-tPxngeF",
      "title": "جحا والحمار الخشبي",
      "order": null
    },
    {
      "fileId": "1u_WCkoijoIiEGL52nAuFIU01aVgVyxk0",
      "title": "جحا والحمار الناقص",
      "order": null
    },
    {
      "fileId": "10Acz_FxtVzxLUlbaD1-ToH2irMf1KHMu",
      "title": "جحا والدجاجة العجيبة",
      "order": null
    },
    {
      "fileId": "1ygCRrcdx-x9yqDhUDB-ZyFD3pt9qDfzj",
      "title": "جحا والله لن أشتريك",
      "order": null
    },
    {
      "fileId": "1lrr5n1A9m4KgxBLmjpvGgQvlbi33isCG",
      "title": "جحا والملك",
      "order": null
    },
    {
      "fileId": "1bovhBCB0dIcc-uxI3U-P3Hb8TqanNBAc",
      "title": "جحا وكلام الناس",
      "order": null
    },
    {
      "fileId": "1r0RloAipG9J6uQj1r4JTtpMhPclsDN0U",
      "title": "عمامة جحا",
      "order": null
    },
    {
      "fileId": "1_EK1l5O-YB7kT6-zRwmrVz5B9I9szeNt",
      "title": "لحاف جحا",
      "order": null
    },
    {
      "fileId": "1nqkDPZmLtLTHpl_c0g0dfyepIjk36WVn",
      "title": "مسمار جحا",
      "order": null
    }
  ]
};
