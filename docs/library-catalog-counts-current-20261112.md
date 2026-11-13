# EFIPS library catalog — canonical counts (13 November 2026)

This is a **catalog record audit**, not a physical stocktake or a guarantee that all school Google Drive images are accessible to every student account. Counts are computed from the app's source arrays by `tests/catalogAuditCounts.test.ts`; the admin dashboard reads those same arrays at runtime.

| Section | Active catalog records | Distinct normalized titles | Notes |
| --- | ---: | ---: | --- |
| Physical library | **4,056** | **3,841** | The source is `api/bookData.ts` |
| UAE national identity — physical subset | **99** | **94** | **Already within physical 4,056**, do not add again; 93 records are on shelf 41 |
| Arabic digital library | **502** | **502** | `ARABIC_LIBRARY_DATABASE` |
| English digital library — **current Drive photo collection only** | **73** | **73** | `ENGLISH_LIBRARY_DATABASE`; 14,178 ordered JPEG pages, 16 lazy page batches (three clearly marked samples) |
| UAE national identity — digital | **9** | **9** | Independent `NATIONAL_IDENTITY_DIGITAL_BOOKS` |

- **All digital catalog records:** 502 + 73 + 9 = **584**.
- **All non-overlapping physical and digital catalog records:** 4,056 + 584 = **4,640**.
- **All 584 digital entries have HTTPS links** in the current catalog snapshot; linked assets were not exhaustively tested with school accounts.
- Digital catalog IDs are unique within all three sections; 99 national identity physical records are confirmed to be included in the physical library total.
- The old **77-book English PDF index** is **retired**, not included in any number. The new English photo edition is the sole English public listing and Saqr catalog source.
- Three sample/excerpt folders are indexed and **clearly labeled as preview-only**: `Murdle` (21 pages), `The Sherlock Holmes Puzzle Collection` (21 pages), `Dog Man: Sneak Peek at New Movie` (16 pages). The unavailable `DC Comics Encyclopedia` (394 pages in the old manifest) is removed. Image sequence checks do not independently prove that every original published edition is complete.
- Source: current 13 November Drive folder census and `tests/catalogAuditCounts.test.ts` output `EFIPS_CATALOG_AUDIT_RESULT`. The audit checks (not fixed literal constants) compute all counts whenever the workflow runs.

## Counting policy
`catalogTotal = bookData.length + ARABIC_LIBRARY_DATABASE.length + ENGLISH_LIBRARY_DATABASE.length + NATIONAL_IDENTITY_DIGITAL_BOOKS.length`

Do not add `nationalIdentityBooks.length` to the total; those physical holdings are already rows in `bookData`. Avoid counting superseded archives and reader manifests as extra books.
