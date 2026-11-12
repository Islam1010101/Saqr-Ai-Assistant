# EFIPS Arabic Digital Book Evidence — isolated, source-first extension

**Scope:** All **502** Arabic digital catalogue records (including image-only
editions). This is a page-level evidence pipeline, **not** a replacement for
Saqr's conversation engine, prompts, Groq/Cloudflare fallbacks, student creative
work, teacher planning, search filters, ratings, reader or rewards.

## Safeguards

- All original book IDs, original Google Drive links and readers are untouched.
- A page is searchable **only after real text has been extracted** from a
  numbered source image or PDF; editorial summaries do **not** masquerade as
  full-text evidence.
- When OCR text is unreviewed, Saqr receives an explicit accuracy warning.
- Missing/blocked pages are reported. No fake summaries or page numbers.
- Page retrieval runs **only** behind the existing explicit library-search
  intent; ordinary conversation, story writing and educational requests are
  untouched. Unavailable evidence causes a no-op.
- New isolated Supabase table: `public.saqr_arabic_page_passages` with RLS.
  Only authenticated school-email users can SELECT page evidence. Only backend
  service-role ingestion can INSERT/UPDATE it. Never put service-role secrets
  in client-side code or messages.

## Index pipeline

1. `node tools/arabic-knowledge/export-manifest.mjs /tmp/saqr-arabic-manifest.json`
   reads the current **actual** Arabic catalogue and all literal page
   manifests; produces a summary of photos/PDFs/missing sources. No source
   books are copied into the repository.
2. `tools/arabic-knowledge/index-books.py` downloads only verified book IDs,
   uses `pdftotext` for digital PDF text, and Tesseract Arabic/English OCR
   for image-only pages and scanned PDF pages. It upserts small numbered
   text passages into Supabase and writes a report listing failures.
3. `src/utils/saqrArabicPageEvidence.ts` retrieves small matching excerpts
   through the authenticated RLS-protected RPC. It returns an empty array
   on failure, timeout or no matching indexed pages.
4. `pages/SmartSearchPage.tsx` adds this optional evidence only after the
   existing `isSaqrLibrarySearchIntent` decision. No changes to `api/chat.ts`
   or its AI provider route.

## Manual batch ingestion (GitHub Actions)

Workflow: `.github/workflows/arabic-book-index.yml`, **Run workflow**.
Install two secrets under the repository's **Settings → Secrets and variables
→ Actions** (never paste the values into a public issue or source file):

- `SUPABASE_URL` — the school Supabase project URL.
- `SUPABASE_SERVICE_ROLE_KEY` — server-side service-role key **restricted to
  Actions secrets**, not a public Vite variable.

The recommended first run uses `book_id=AR_PH_20261110_CHILD_LITERATURE`,
`max_pages=20`. Check the downloadable report, then repeat the same book
to process its next unindexed pages. For other books, use `offset` and
`max_books` (the manifest uses the existing 502-book order). Existing
indexed pages are skipped. For very long books, run multiple batches.
The workflow is manual, not recurring: processing thousands of pages can
exceed GitHub Actions free quotas and Google Drive request limits.

This pipeline supports all 502 books structurally. **It does not mean all
pages are indexed.** Verify actual coverage before telling users that a
particular book was read or analyzed completely.

## Verification

- `node --test tests/saqrArabicPageEvidenceIsolation.test.mjs`
- `node --test tests/saqrIntentStoryCertificate.test.ts` (with Node's
  TypeScript stripping on supported Node versions)
- `node tools/arabic-knowledge/export-manifest.mjs ...` to audit original
  source IDs/pages.
- Supabase read-only check:

```sql
select count(distinct book_id) as indexed_books,
       count(distinct (book_id,page_number)) as indexed_pages
from public.saqr_arabic_page_passages;
```

The `page_number` is the numbered image/PDF page, which may differ from the
printed page label inside the book. OCR can contain mistakes. Domain access
and copyright rights must be reviewed by the school before any bulk export.
