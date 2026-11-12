# EFIPS English digital library — current Drive inventory

**Audit:** 12 November 2026. **Implementation:** [Draft PR #195](https://github.com/Islam1010101/Saqr-Ai-Assistant/pull/195).

## Summary

- Source of truth: current Google Drive **English Books / Photo Books** folders, not the obsolete 11 November folder URLs.
- **71** consecutively numbered reading records, containing **14,514** JPEG pages: 47 previously catalogued book records linked to new Drive source IDs and 24 additional entries.
- Every indexed page-manifest sequence was checked for 1…N numbering, no gaps, and nonempty Drive image IDs. This cannot independently guarantee that the scanned original includes all publisher pages or that all school accounts can load each image.
- Reader behavior remains the existing immersive Saqr glass reader; no changes to AI prompts, intent logic, conversation state, lesson preparation, or other modules.
- Saqr's catalog imports the same `ENGLISH_LIBRARY_DATABASE` as the English library page; this makes titles, descriptions, authors, and source links visible to the existing recommendation/catalog retrieval. **This is not full-page book-text OCR or semantic full-text indexing.**
- Author biographies and title-specific summaries were added or corrected. Publisher is displayed only when supported by inspected source imprint; unverified imprints are marked as pending.
- Excluded as unverified *full* books: **Dog Man: Sneak Peek at New Movie** (16 photos), **Murdle** (21 photos), **The Sherlock Holmes Puzzle Collection** (21 photos). These source folders remain untouched.

## Existing 47 titles — replaced source image manifests

| Book title (catalog label) | Images | Current Drive folder |
| --- | ---: | --- |
| Super Shark Encyclopedia | 216 | [Drive](https://drive.google.com/drive/folders/1YgDYAzmwfoTegYodJEGT5ngluhVtYHbs) |
| Hamlet: The Manga Edition | 193 | [Drive](https://drive.google.com/drive/folders/1BGsk_PhHCsM9UM3WDvjuIkUXZlLqKOdP) |
| Othello (Pocket Classics) | 68 | [Drive](https://drive.google.com/drive/folders/1NAd6iQKqBh2X53tjWjxOTxduTvf8DCDz) |
| Understanding Comics | 223 | [Drive](https://drive.google.com/drive/folders/1qtDATHwaHpB51KFpO0CpZmY0h8qNUILx) |
| Nicholas Nickleby (Famous Authors Edition) | 52 | [Drive](https://drive.google.com/drive/folders/1RqZst8AHwWs3vOvImjao5VT_qk6COylc) |
| How to Draw Comics the Marvel Way | 138 | [Drive](https://drive.google.com/drive/folders/1hfraoVijnlKCLbXcp-RuLGFC68YLqNgY) |
| Macbeth (Illustrated Classics) | 64 | [Drive](https://drive.google.com/drive/folders/1og9avMeSTYBotDuTbwEi_YsH6stTro80) |
| DKfindout! Coding | 70 | [Drive](https://drive.google.com/drive/folders/1gLrks5UhSAoSZx1bayMpWnPsEnV_tCM_) |
| Dog Man: Twenty Thousand Fleas Under the Sea | 237 | [Drive](https://drive.google.com/drive/folders/1cS2UJfZXm3HxQ57MPz9h0JvBDDCEUuoK) |
| Dog Man: A Tale of Two Kitties | 258 | [Drive](https://drive.google.com/drive/folders/1EIUIjct3BOutDZoPekxWLSLjWaoe8wHw) |
| Disney Adventures: Super Comic Special | 96 | [Drive](https://drive.google.com/drive/folders/1GcsOf435CFnPRs2DlJjwKK0GRMdTPNP6) |
| Big Jim Believes | 226 | [Drive](https://drive.google.com/drive/folders/1btVyWKohzlMqqpT-IDLGEPDS8_RT-bRk) |
| Cat Kid Comic Club: Perspectives | 232 | [Drive](https://drive.google.com/drive/folders/1MtmqrTHlQME1SaFLR_S4S7ziteNtRusE) |
| The 7 Habits of Happy Kids | 97 | [Drive](https://drive.google.com/drive/folders/1H0wjoLjMep944oAwvS7B8HEUFQeHmxrz) |
| DK Children's Encyclopedia | 312 | [Drive](https://drive.google.com/drive/folders/1RzYlkLKeSPWocZG2huagHW26egWm2kax) |
| Cat Kid Comic Club | 158 | [Drive](https://drive.google.com/drive/folders/1oOpnOA1lO4DTyozE2pm6VOiSMPnkhQd-) |
| Cat Kid Comic Club: Collaborations | 234 | [Drive](https://drive.google.com/drive/folders/1VK-qpDOGik-gNXBMsGuQNdZlZA4xFl_V) |
| As You Like It (Pocket Classics) | 68 | [Drive](https://drive.google.com/drive/folders/1tSR3MWli0PwyY9TKBTiOyTHpoJqGHz7s) |
| Artist's Painting Techniques | 312 | [Drive](https://drive.google.com/drive/folders/1GeUeCveLZVI6MtNPjeCulJv7BmpW9vdN) |
| 1000 Inventions and Discoveries | 260 | [Drive](https://drive.google.com/drive/folders/1c6tyrghAk3u9vOIljGZfJTHQOoCa3Mrf) |
| Gravity Falls: Lost Legends | 148 | [Drive](https://drive.google.com/drive/folders/1nA9f54qCxGlWP1vrwaFC_J_OGSe3b_r6) |
| Wonder | 317 | [Drive](https://drive.google.com/drive/folders/1fvTbosYfCTxq6X64s4qo7Ei5fd7FOyUt) |
| We Hunt the Flame | 411 | [Drive](https://drive.google.com/drive/folders/1OC8_X4EbhC9UOkMchgg5IFhUP_v8-BMp) |
| A Long Walk to Water | 131 | [Drive](https://drive.google.com/drive/folders/1LUyMfn-IUUTiDRhqV1L9xVSk13z4S1aT) |
| The House on Mango Street | 124 | [Drive](https://drive.google.com/drive/folders/1BuqLV1tUsYzcPZ1G6wh1mtN7i9y5WC8E) |
| Fantastic Beasts and Where to Find Them | 131 | [Drive](https://drive.google.com/drive/folders/1XIWh08zkjiN-P2iROedfwdWOxCzTYCAA) |
| The Hound of the Baskervilles | 400 | [Drive](https://drive.google.com/drive/folders/1PfFNBF3_dKdjF3C0aJizzcyU83RYZnLe) |
| And Then There Were None | 112 | [Drive](https://drive.google.com/drive/folders/1Zp4XTYk0wlS-TKJ2yYSiTYtgfk79z-VD) |
| Tales of the Unexpected | 286 | [Drive](https://drive.google.com/drive/folders/1YBE6NZJB2NBmmkV3Pfaj5eHxdS4H3vRj) |
| How Much Land Does a Man Need? | 14 | [Drive](https://drive.google.com/drive/folders/13xPM86Zr8XdQ8nRz_nQ9CBjKnZqrAghl) |
| The Great Gatsby | 193 | [Drive](https://drive.google.com/drive/folders/176W5r9VOktVDvwUU4t0LbOkFuQZA4Uh4) |
| The Tell-Tale Heart | 4 | [Drive](https://drive.google.com/drive/folders/1Ff9YidMfIGfF98OC0bWovlA366eNxF19) |
| Barry's Buzzy World | 29 | [Drive](https://drive.google.com/drive/folders/1DOb8q4KtsYLH4A7sbm4yKrK52y7cWd7d) |
| The Sand Witch | 36 | [Drive](https://drive.google.com/drive/folders/1LGF3wmGuMcQ_KU62wREiG5Uq_ZR6IiyU) |
| The Lion King | 45 | [Drive](https://drive.google.com/drive/folders/10J9RrfuTZyXutGHfzi85zePxc5JZ6um4) |
| Brother Bear | 45 | [Drive](https://drive.google.com/drive/folders/10J9_Kdzs-bGxI3zKTWmH-Ldh0zpeprYz) |
| Diary of a Wimpy Kid: The Third Wheel | 226 | [Drive](https://drive.google.com/drive/folders/1Xwr8zjpTR4DHZB6u8SsSsq3z9ZFrhb7N) |
| Diary of a Wimpy Kid: Rodrick Rules | 223 | [Drive](https://drive.google.com/drive/folders/12aIZLwF7HpkdeFa15t7IRajvS8id6VBS) |
| Diary of a Wimpy Kid: Hard Luck | 213 | [Drive](https://drive.google.com/drive/folders/1phKHsbnJkqrxleNU8KNojcb6_MoDxOfI) |
| Diary of a Wimpy Kid: Cabin Fever | 220 | [Drive](https://drive.google.com/drive/folders/1NxZ1WEVCSpA4Lwn3QI8Jt_OtaDYW9xv9) |
| Diary of a Wimpy Kid: Double Down | 226 | [Drive](https://drive.google.com/drive/folders/1UQALdoOsP9nes7hMjrkK3suvPdWWhYcD) |
| Critical Thinking Puzzles | 98 | [Drive](https://drive.google.com/drive/folders/1t6zCtoBjgd_csvPis29sgacQGzQPMERY) |
| What Is the Name of This Book? | 254 | [Drive](https://drive.google.com/drive/folders/1pxkNbLUISrIaAKQF_71ZePy7ZJTG5xkh) |
| The 5 Second Rule | 252 | [Drive](https://drive.google.com/drive/folders/1Qeq5GxRFWQ9nAYddhJjxMhU24EIeDzYU) |
| Atomic Habits | 341 | [Drive](https://drive.google.com/drive/folders/1gmO3Bd9G9ZZWJpWesfL9IBm7i9_dt9BD) |
| How to Win Friends and Influence People | 232 | [Drive](https://drive.google.com/drive/folders/1yhy4okxr2tUD2FG1A_9JBsrDqBio88A5) |
| Diary of a Wimpy Kid — Collected Photo Edition | 1279 | [Drive](https://drive.google.com/drive/folders/1wgKOQml3GAHva_d0z93WUiDl_ft00fll) |

## Additional 24 current Drive titles

| Title | Images | Publisher (edition evidence) | Current Drive folder |
| --- | ---: | --- | --- |
| Knowledge Encyclopedia | 368 | DK | [Drive](https://drive.google.com/drive/folders/1Gom1O60XO28Ze0IMO6pWbY-O4lcNv-qN) |
| Space! The Universe as You've Never Seen It Before | 216 | DK | [Drive](https://drive.google.com/drive/folders/18GH3LLVIibC9f9aUVCUQja3aOV7qmSuo) |
| The Magical Yet | 38 | Disney-Hyperion | [Drive](https://drive.google.com/drive/folders/1AT1JRt6xe2ObzN-a68OXbJVw5MfC5ois) |
| The Power of Habit | 386 | Edition not yet verified | [Drive](https://drive.google.com/drive/folders/1N8I7bEFDkyanQM7_taynR_DX1xXMmSRr) |
| Mindset: The New Psychology of Success | 283 | Random House | [Drive](https://drive.google.com/drive/folders/1SD7B9qOZKm8A5dwsv9He44PklCVhc_Qn) |
| Deep Work: Rules for Focused Success in a Distracted World | 190 | Grand Central Publishing | [Drive](https://drive.google.com/drive/folders/1v4QY_1TWDCnxV_Qk6hB--fxeU19SyqmV) |
| Who Will Cry When You Die? | 135 | HarperCollins e-books | [Drive](https://drive.google.com/drive/folders/1aZ9Pt7BwV07hpIQr5rpsS4YDa1zjDL0H) |
| The 7 Habits of Highly Effective People | 282 | Edition not yet verified | [Drive](https://drive.google.com/drive/folders/1VtUqxIlppb9edR05nLtRXRZ-O2-E1vSE) |
| The Kite Runner | 374 | Edition not yet verified | [Drive](https://drive.google.com/drive/folders/1fXg5LDgJ2uDQaAdhiAERi_JfoS6YkOiE) |
| Me Before You | 393 | Edition not yet verified | [Drive](https://drive.google.com/drive/folders/1kQ2FQovVhUg98ZP8WefJ-e5jkpXDI8pa) |
| The Girl on the Train | 181 | Edition not yet verified | [Drive](https://drive.google.com/drive/folders/15bqnegQmYdeeDIzTmJKHe0d7pj9cfwc8) |
| The Silent Patient | 299 | Edition not yet verified | [Drive](https://drive.google.com/drive/folders/1pa_Ap9Sez2S2Sxs_U2Mr0n1My43KSQQm) |
| The Lottery | 16 | Edition not yet verified | [Drive](https://drive.google.com/drive/folders/1CJZsz-kbp0qMdeTntVrIOeNQVgnDX-2c) |
| The Landlady | 5 | Edition not yet verified | [Drive](https://drive.google.com/drive/folders/1jCCE3XMXKQYsl1327U8CmGXJP6slzgS4) |
| The Bet | 7 | Edition not yet verified | [Drive](https://drive.google.com/drive/folders/13kxtbGs6Wn6et5GsnRGdZftL9WobtQkA) |
| The Death of Ivan Ilyich | 28 | Edition not yet verified | [Drive](https://drive.google.com/drive/folders/1z2YluisB59IhspsEO0s5qAGSSBGBFwFn) |
| Clam-I-Am! All About the Beach | 40 | Edition not yet verified | [Drive](https://drive.google.com/drive/folders/1btikwfqB0hqvJnx4mG5x4c1QWqyi_s8N) |
| DC Comics Encyclopedia | 394 | Edition not yet verified | [Drive](https://drive.google.com/drive/folders/1R7ccg_YrngwXAgc50XJ701oTcxNHnEAt) |
| Pocahontas (Illustrated Story) | 21 | Edition not yet verified | [Drive](https://drive.google.com/drive/folders/1YhitHxwoCVuUNfIoScRB7NaarqjcuVxD) |
| Marvel Encyclopedia: New Edition | 450 | Edition not yet verified | [Drive](https://drive.google.com/drive/folders/1IqYym6qoVISMYGqevViv-vTY2nDuuczY) |
| Diary of a Wimpy Kid: The Long Haul | 226 | Edition not yet verified | [Drive](https://drive.google.com/drive/folders/1Viz-RXGtaH88BuEL55M4BaYKs3TQLNQW) |
| Diary of a Wimpy Kid: Old School | 226 | Edition not yet verified | [Drive](https://drive.google.com/drive/folders/1pKmXmOyN6y9h4LirviTMDD2SpgmDQyiA) |
| Diary of a Wimpy Kid: The Getaway | 226 | Edition not yet verified | [Drive](https://drive.google.com/drive/folders/1uT1p1IYb8Cjv4sw0TOeLEvknIYeKX9sx) |
| Diary of a Wimpy Kid: The Meltdown | 226 | Edition not yet verified | [Drive](https://drive.google.com/drive/folders/1yf4umFh2VdzcsYBic2p8wAV8BvufYXQd) |

## Remaining verification before production

1. Check the first/last spread of each scanned edition against a physical or complete original; numbered images alone cannot certify the original's full length.
2. Verify publishers against actual title and copyright pages wherever the photographed edition does not visibly state an imprint; do not infer a publisher from a novel's original publication.
3. Smoke-test thumbnails and glass-reader page turns using a real school Google account; connector access does not prove every student's permissions.
4. Run all relevant GitHub checks and release preview when Vercel's free daily deployment limit permits. Do not merge this draft while checks or release verification are blocked.
