# EFIPS library catalog — canonical counts (12 November 2026)

This is a **catalog record audit**, not a physical stocktake or a guarantee that all school Google Drive images are accessible to every student account. Counts are computed from the app's source arrays by `tests/catalogAuditCounts.test.ts`; the admin dashboard reads those same arrays at runtime.

| Section | Active catalog records | Distinct normalized titles | Notes |
| --- | ---: | ---: | --- |
| Physical library | **4,056** | **3,841** | The source is `api/bookData.ts` |
| UAE national identity — physical subset | **99** | **94** | **Already within physical 4,056**, do not add again; 93 records are on shelf 41 |
| Arabic digital library | **502** | **502** | `ARABIC_LIBRARY_DATABASE` |
| English digital library — **current Drive photo collection only** | **71** | **71** | `ENGLISH_LIBRARY_DATABASE`; 14,514 ordered JPEG pages, 15 lazy page chunks |
| UAE national identity — digital | **9** | **9** | Independent `NATIONAL_IDENTITY_DIGITAL_BOOKS` |

- **All digital catalog records:** 502 + 71 + 9 = **582**.
- **All non-overlapping physical and digital catalog records:** 4,056 + 582 = **4,638**.
- **All 582 digital entries have HTTPS links** in the current catalog snapshot; linked assets were not exhaustively tested with school accounts.
- Digital catalog IDs are unique within all three sections; 99 national identity physical records are confirmed to be included in the physical library total.
- The old **77-book English PDF index** is **retired**, not included in any number. The new English photo edition is the sole English public listing and Saqr catalog source.
- Three sample/excerpt folders in the current English Drive are excluded: `Murdle`, `The Sherlock Holmes Puzzle Collection`, `Dog Man: Sneak Peek at New Movie`. Image sequence checks do not independently prove that every original published edition is complete.
- Source run: GitHub Actions catalog-and-build of PR #196, commit `cc68899ae226198d50b9f5806e936d5d3772d693`, output `EFIPS_CATALOG_AUDIT_RESULT`. The audit checks (not fixed literal constants) compute all counts whenever the workflow runs.

## Counting policy
`catalogTotal = bookData.length + ARABIC_LIBRARY_DATABASE.length + ENGLISH_LIBRARY_DATABASE.length + NATIONAL_IDENTITY_DIGITAL_BOOKS.length`

Do not add `nationalIdentityBooks.length` to the total; those physical holdings are already rows in `bookData`. Avoid counting superseded archives and reader manifests as extra books.
