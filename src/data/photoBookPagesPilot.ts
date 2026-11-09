/**
 * EFIPS School Library — image reader PILOT ONLY.
 * Verified directly against English Books / New / Photo Books /
 * Find Out Coding By James Floyd Kelly, 9 November 2026.
 * 70 sequential JPG pages, no gaps, original PDF retained in Drive.
 *
 * NOTE: Do not infer access control from a protected EFIPS UI route.
 * The linked Drive images currently have 'anyone with the link' read
 * permissions, inherited from their Google Drive folder. The school
 * owner must remove this public sharing and review copyright permissions
 * before expanding access beyond the controlled pilot.
 */
export const CODING_IMAGE_BOOK_ID = 'EN_NEW_20261109_17';
export const CODING_IMAGE_FOLDER_ID = '1z5ZUJZ4hlzGEFp9DQ3WDP1w1avpjO-Wg';

export const CODING_IMAGE_PAGE_IDS: readonly string[] = [
  "1uJJ5IhitfxNkiR2x9VRvjF3CfBoscE85",
  "1k_YKCeJfcJpj5m0maYzSBSb9bUPV_O0E",
  "1s7DkfeXOOHKNjX1-BtQhX5PnNTKdMk7Y",
  "1prsNPtVgW8BVDEM8MMbmL8gfbG3g_Sq9",
  "1LvZjXY7TxLNBfutm4a_mmabbVnLuai01",
  "114bwZ6EldiNS0X5pFmsIqC40kixqhRo0",
  "1X9DxQQpgWA91Bhnl5jvRiv0GMmT_233N",
  "1N6FwciPPmnYKwSuNmEvvVld9O-NMHOMx",
  "1DpeMJm556rso9ngAWTcxmFb2h5PPUUT-",
  "1_ifP-sN0CbUwuFGKYOVhhkjjaCI5RHTn",
  "1dAcWMjvUTpeG-2d9HGfS-Jscl0ZZsama",
  "1rV7T5ozd9pM6goXb6_fI1dAx6tne_Xqy",
  "1friXyDyuiEVfuWLU9Mjig2-4aDM5lqZ_",
  "1yCSWRdUBjwALMgOmmQk93s6JqA-NnZuR",
  "1ixBmW2chOIE20SPPJJli_fnGbKaJiPr1",
  "1esvy96cNGIFL1NkF4y5-o0eQK30pncce",
  "16gBdMGeJEhwXE9LFIWKrrwU1ObQyXbnr",
  "1yz6Nq-HUhKo50wlhhGRVZ3-mneq94GPd",
  "1bcn9dXRguO1PACTXMLmTf1TE4XN254ia",
  "1QYn7pvNffuFNZJUqb-y-MHHOpaHisvB2",
  "1sNH5fgw4yo_nXw-r2Kif__GPm0D9pAh7",
  "1ZWxKBNCTRL16tOrY6uew-0XRFvVipylt",
  "1M8RVohWkoZ5UDDdKzdsr8XVLFENd3xSp",
  "1hhVKYlH9GBZk9Ekwpz6Em5wfbvSfI8Ya",
  "1V1B_jE3Ulqk12vvo9cv_JMHXaxSnIeHZ",
  "167NoTzXHaqOFFZ41_EB0FCATQ8tyziEE",
  "1kbU4XavBOpqMNpGVK6uNRS7kXlkJFel-",
  "1T6y28DKnY8_YZMz0Cv1PmYt3PRgqMO_z",
  "12GkkmWGmx3pPdBzGfJjhUqAd3aS798SS",
  "1rtnq7ROcAI0ZlVTjiznf0c2QTvt392nD",
  "1Olm9Obrh7K9ZuoFrVa6eLN1cQBBzv2Wr",
  "12SJoEuucrYNfTJmgVe4J4feoXScNfcCC",
  "1cVP3MwQQofX8fzQSJ7i4H3yqieXeU3JE",
  "1e_mD64M__auK-rrJPA5cPNzjlG4EgM3W",
  "1y64zTU3RRR8BuFXtRd1Z_gh1ZlOjIvvL",
  "1VxQwR3Z6T0pU-nnLlVD6kXhkJVqi7TaR",
  "1CPKNX-6G-8_d0CGdzKsmsg3FOz40f6ra",
  "1k-nTr_eIdj2WrRXyXNKp9pCmyIcVvCuq",
  "1B6llk28KFnBKxMkX_VkMa4NOqJatljgg",
  "1pOKEMGsPRl93vtAvxZ7MdpJCO6vV5dsd",
  "1RmWDBh_ZlHxOqJlwrONyu0IPZ6VOS5Ho",
  "1EVre7LZYA-MfaGrKwIZC91RV3hKUovac",
  "1Da0dTUgRJOGacrjkBHj09vUZCqwVaYmo",
  "1bHRYpmf_X31dbRxkNXw7HMbneXTFT7BI",
  "1NC6Kf4E0USIlil-ieyoPjJhM7Sa4ONrU",
  "1HvdBpgy-KWihAtyE4Z-2GHq_PQ7nGFum",
  "1QNjtxIp1xt__e8d711ZK9Yrzmj9KEFiU",
  "1ckiX8YwCRhjqBp-Tr4xS5vNleA7NAoIL",
  "1RFb3qqw5sNuXs0OMhErVk6uCdd-5lQcw",
  "1Ob6LUgaf3D8QqVbIzg6TERrGd_BODzuy",
  "1HF44CenAQz9fqJ_h4P5rrkDkVZr0Pxgs",
  "1lFHsDlRv_dUsZeR-R2NQCGW-SjtB5BwQ",
  "1392_vcI_0sFYS7TnYtjdqEDB1aIpQmmq",
  "1e05xDTNo9O1UMrv9PPIzRu19TYEWM-Hh",
  "1-55whBpx0WboAaLI1MbspIb6Bx20fGcN",
  "18b2Ldcht7qy-xPLj7Vv-GEILXBQZRb5Q",
  "1gCo6QQ-U4ZhS4fPnmFeiEpWi1HXNYOC9",
  "1q2KiJRvH5bzS1CLOI0H95GUj5D9zwY0D",
  "1FKp1HuOPkm7ZVlCq60ahdwJ-EDOOAG_2",
  "1nvY3oY5y1s59a8RVzDsur-u6QclFcSTK",
  "1N96x2zZeskR_lydt-Ge7I016KsaQAwAq",
  "1ljLGw4RYWIhY6CkEOR16wAEBUyCXtOGl",
  "1vkl9XqHvBO6PJc9QZVWlx-Lk2CUh5DO2",
  "1TQEUaN4_nGht_0rhWy3a7ac_wvL2BFU1",
  "1lyOt0AKNzyohRmv3TEyyZwGKVV_wGuaW",
  "18jlK6-iJclj-UWm_U0cCuGq4QKbSXtmd",
  "10oV9tgcVPN2AzjFp-GtzZRPR9Ia2m-pR",
  "1DeKKTFxuxIN-RnXP-hdKMYmF4_knkXma",
  "1VholEVK3-q6Ncr430O4cvi1ezT2BPuup",
  "12S1czdpC5Hv7Hv5REGwuC2VJW5PWJFu9"
] as const;

export function photoBookPagesFor(bookId:string | number):readonly string[] | null {
  return String(bookId) === CODING_IMAGE_BOOK_ID ? CODING_IMAGE_PAGE_IDS : null;
}
