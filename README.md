# Saqr AI — EFIPS Smart Library Platform

**A bilingual, AI-assisted school library and learning platform for Emirates Falcon International Private School (EFIPS), United Arab Emirates.**

[Live platform](https://www.efipslibrary.com) · [Source repository](https://github.com/Islam1010101/Saqr-Ai-Assistant)

Saqr brings together the school's physical catalog, Arabic and English digital libraries, reading activities, teacher services, UAE national-identity experiences, and an interactive AI librarian. The application supports Arabic (right-to-left) and English (left-to-right), responsive desktop/mobile layouts, and school-account-based access.

> **Project status — November 2026:** This is an actively developed application with working frontend, API routes, Supabase integration, Google-based school sign-in, and AI provider integrations. It is **not** a UI-only prototype. Availability of individual services, books, or AI responses depends on deployment configuration, verified permissions, and upstream providers.

## What's new

Recent changes implemented in the repository include:

- **IELTS Preparation Center:** A dedicated English-library study area with a four-stage study plan, searchable Cambridge/reference PDF listings, and practice for Listening, Reading, Writing, and typed Speaking. The listening practice currently includes **14 credited VOA recordings and 52 original questions**, arranged across four instructional stages, with feedback through Saqr. Official IELTS sample resources are linked separately; Saqr does not reproduce copyrighted test papers or issue official band scores.
- **Fine-grained service access:** Administrators can allow, deny, or inherit access to **20 individual services** for a verified school Google account without changing that person's student/teacher/admin role. Examples include enabling national-identity activities for a teacher or giving a student *read-only* timetable access. A service grant does not grant administrative privileges or sibling services.
- **Faster navigation and access checks:** Shared, server-verified feature entitlements reduce duplicate requests affecting the top navigation and Saqr's orbit bubbles. Restricted routes continue to use fail-closed checks.
- **Refreshed digital collections:** Updated Arabic catalog metadata, a replacement English photo-book collection with the Saqr glass-style reader, and separately indexed UAE national-identity digital books. The retired English PDF catalog is not counted as an additional live collection.
- **More contextual Saqr AI:** Catalog-grounded book and author discovery, bilingual title/topic matching, follow-up handling, teaching assistance, creative-writing activities, and clearer separation between genuine library searches and unrelated conversations.
- **AI operations and observability:** Groq and Cloudflare Workers AI support in the existing serverless chat API, provider fallback/selection behavior, and an admin-facing provider-usage dashboard when metrics are configured.
- **Regression coverage:** GitHub Actions and targeted tests for catalog integrity, readers, IELTS experiences, access controls, navigation performance, and read-only RLS safety preflight checks.

## Platform capabilities

| Area | Capabilities |
| --- | --- |
| **Saqr AI librarian** | Conversational guidance, book/author/topic discovery, library-aware recommendations, general questions, bilingual interactions, and a floating assistant accessible across supported pages. Catalog matches are shown for actual library-search intent, not every creative or teaching request. |
| **Physical library** | Searchable book listings with title, author, classification, and recorded shelf/row location; supporting catalog audits. |
| **Digital libraries** | Arabic, English, and UAE national-identity collections; book descriptions and metadata; PDF/photo reading experiences, including a glass-style reader for English photo books. |
| **IELTS Center** | School-controlled reference PDFs, study pathways, graded listening, original exam-style reading/writing practice, typed speaking practice, and Saqr coaching. |
| **Borrowing and reading** | School library borrowing workflows, read-later lists, reading goals/progress, and related notifications where supported by the signed-in account. |
| **Teachers and scheduling** | Library period scheduling/booking, teacher-oriented lesson-planning assistance, and lesson-content review. Student schedule access, when granted, is view-only. |
| **Student creativity** | Young Author activities, writing feedback, spelling/grammar review, Saqr Studio, Creators Portal, and printable outputs/certificates where provided. |
| **Reading and games** | *Between the Lines with Saqr*, reading quizzes, library-sorting activities, Saqr challenges, and the podcast experience. |
| **UAE national identity** | Cultural Passport, Emirati Language Treasures, Heritage Detective, Flag of Glory, Voice of the Union, and national-identity books. |
| **Personalized learning** | *Saqr Helps Me* learning and accessibility experiences for appropriately enabled users. |
| **Administration** | User/role administration, independent service entitlements, reporting/usage views, borrowing and timetable oversight, and AI provider metrics. |
| **Information pages** | Tutorial, school/library information, feedback and suggestions, bilingual announcements, and responsive navigation. |

### Saqr response principles

- Prefer recorded school holdings for answers about **books actually available at EFIPS**; do not present external suggestions as owned library items.
- Preserve a normal conversational response for non-catalog requests, including stories, general assistance, and lesson preparation.
- Support Arabic and English; use formal language for generated educational deliverables such as lesson plans and student stories while keeping conversational guidance friendly and locale-aware.
- Treat AI output as assistance, not as an authoritative inventory verification, exam result, or replacement for teacher review.

## Technology stack

| Layer | Technology | Purpose |
| --- | --- | --- |
| Frontend | **React 18**, **TypeScript**, **Vite 5** | Single-page application and development/build tooling |
| UI | **Tailwind CSS 3**, CSS, **React Router 6** (HashRouter) | Responsive bilingual styling, RTL/LTR layout, client-side routes |
| Data visualizations | **Recharts** | Administrative charts and reports |
| Backend APIs | **Vercel Node.js serverless functions** (TypeScript) | AI chat and controlled PDF delivery routes |
| AI inference | **Groq SDK** and **Cloudflare Workers AI API** | Model inference, provider selection and fallback |
| Data and identity | **Supabase** (PostgreSQL, Auth, Edge Functions, client SDK) | Accounts, school records, reading data, entitlements, and server-side authorization |
| School sign-in | **Google OAuth via Supabase** | Verified EFIPS school Google identity and account-to-role matching |
| Book storage | **Google Drive** and school-managed digital assets | Authorized digital books and reader sources; access remains subject to Drive permissions |
| Readers and export | **PDF.js (pdfjs-dist)**, **react-pageflip**, **jsPDF**, **html2canvas** | PDF display, page-turning experiences, and printable/exportable content |
| Visual effects and audio | **Three.js**, **Vanta**, **lamejs** | Selected interactive backgrounds and media functionality |
| Hosting / CI | **Vercel**, **GitHub Actions** | Web deployment, serverless runtime, and regression workflows |

The catalog is **hybrid**: many library records are maintained in TypeScript source registries, while account-based data and selected service records live in Supabase. Do not assume every book is a row in the database.

## Catalog snapshot

The following values are the **source-catalog audit of 13 November 2026**, not a physical stocktake or a guarantee that every linked file is accessible with every school account.

| Catalog section | Active records | Notes |
| --- | ---: | --- |
| Physical library | **4,070** | Includes the national-identity physical subset |
| Arabic digital library | **502** | Current Arabic catalog registry |
| English digital library | **73** | Replacement Drive photo-book collection; some items are clearly marked excerpts |
| UAE national-identity digital library | **9** | Separate digital registry |
| **Digital total** | **584** | 502 + 73 + 9 |
| **Non-overlapping catalog total** | **4,654** | 4,070 physical + 584 digital |

The **99 national-identity physical catalog records** are already included in the physical total and must **not** be added again. The IELTS resource list is a separate study collection and is **not** included in the 73 English photo books or the 4,654-record total. Its inventory currently lists **19 Cambridge IELTS PDFs (volumes 01–19) plus five other study PDFs**; the availability of individual supplemental audio files is not implied.

Current details and counting policy: [catalog audit](docs/library-catalog-counts-current-20261112.md) · [IELTS implementation notes](docs/ielts-preparation-center-20261115.md).

## Identity, roles, and service permissions

School access is based on verified Google identities under **`@falcon-school.com`**, matched with the school's authorized records. Supported login roles are **student**, **teacher**, and **admin**.

The independent service-access system provides three per-user states:

- **Inherit:** use the default service availability for the verified role and account.
- **Allow:** enable the selected service without changing the account role.
- **Deny:** hide/block the selected service without deleting the account.

A server-side Supabase Edge Function (`supabase/functions/efips-feature-access/`) validates the signed-in school user and enforces the feature allowlist. Only a verified administrator may modify service grants. A service override does **not** promote a user to admin, change their login identity, or automatically grant all other features. Route-level checks remain in place.

**Security scope:** Supabase RLS policies must be reviewed and deployed per table. The repository's RLS preflight is read-only; a passing preflight is **not** proof that every production table has RLS enabled. School Google Drive files also require appropriate Drive ACLs, regardless of website route access. Do not commit service-role keys, provider tokens, or other credentials.

## Project structure

```text
/
├── App.tsx                       # Application shell, routes, navigation
├── pages/                        # Library, AI, admin, IELTS, identity, games
├── src/
│   ├── components/               # Readers, feature guards, admin and practice UI
│   ├── data/                     # IELTS and other source-based registries
│   ├── utils/                    # Catalog matching, access, reading, AI helpers
│   └── server/                   # Shared server-side reader logic
├── api/
│   ├── chat.ts                   # Existing AI serverless endpoint
│   ├── digital-book.ts           # Controlled digital PDF route
│   ├── bookData.ts               # Physical library catalog records
│   └── nationalIdentityDigitalBooks.ts
├── supabase/
│   └── functions/                # School sign-in and service-access Edge Functions
├── tests/                        # Targeted automated regression tests
├── tools/                        # Reader tests, catalog/indexing helpers
├── docs/                         # Audits, implementation and access notes
├── .github/workflows/            # CI checks
├── package.json
└── vite.config.ts
```

## Local development

**Prerequisites:** Node.js **22.x** is recommended (also used by the repository's CI), npm, and access to the necessary school development services for authenticated features.

```bash
git clone https://github.com/Islam1010101/Saqr-Ai-Assistant.git
cd Saqr-Ai-Assistant
npm install
npm run dev
```

The Vite dev server is configured for **http://localhost:3000**. Local access to authenticated school features depends on Supabase, the Google OAuth configuration and permitted redirects; cloning the repo alone does not create a working school account.

### Build and preview

```bash
npm run build
npm run preview
```

### Selected checks

```bash
npm run test:pdf-reader
node --test tests/ieltsCenter.test.mjs
node --test tests/saqrNavigationFirstPaint.test.mjs
node --test tests/rlsSafetyPreflight.test.mjs
```

Additional test suites (including the TypeScript catalog audit) run through the relevant GitHub Actions workflows. Test success checks repository behavior; it does not by itself verify the deployed database policies, OAuth configuration, Drive file permissions, or live AI providers.

## Deployment and configuration

The production website is hosted on **Vercel** at [www.efipslibrary.com](https://www.efipslibrary.com). The Vite frontend builds to `dist/`; Vercel also runs serverless routes in `api/`. Supabase Edge Functions and database policies are managed as separate backend resources.

Relevant runtime configuration includes:

| Component | Environment names used in the code |
| --- | --- |
| AI serverless API | `GROQ_API_KEY`; `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_AI_API_TOKEN` for Cloudflare inference |
| AI telemetry (when enabled) | `SAQR_METRICS_SUPABASE_URL`, `SAQR_METRICS_API_KEY`, `SAQR_METRICS_SIGNING_SECRET` |
| Supabase Edge Functions | `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (server-side only) |

**Never commit actual values** of these variables. In particular, inspect `vite.config.ts` before exposing an AI key to a build environment: its legacy `define` mapping references `GROQ_API_KEY`, so provider secrets must not be assumed to be browser-private merely because their names lack the `VITE_` prefix. The Supabase service-role key belongs **only** in trusted backend/CI secret stores, never the browser.

For deployment validation, check the frontend build, `/api/chat` behavior, Supabase/Google login with each authorized role, entitlement restrictions, PDF/photo readers with a school account, and the active GitHub Actions status before treating a release as verified.

## Responsible use and content

- Digital books and IELTS PDFs remain subject to school authorization, copyright restrictions, and their source Google Drive access settings.
- The IELTS Center is an **independent school preparation experience**; it is not affiliated with, endorsed by, or an official assessment service of IELTS, Cambridge, the British Council, or IDP.
- VOA audio/text used in graded listening is credited to its source; the associated practice questions are original Saqr educational material.
- AI responses may contain errors. Verify bibliographic claims against the recorded catalog and review important educational outputs before use.

## Documentation

- [Canonical library catalog counts](docs/library-catalog-counts-current-20261112.md)
- [English digital library inventory](docs/english-digital-library-current-drive-20261112.md)
- [IELTS Preparation Center notes](docs/ielts-preparation-center-20261115.md)
- [Arabic full-text/page-evidence indexing notes](docs/saqr-arabic-fulltext-indexing-20261112.md)

---

**Emirates Falcon International Private School — EFIPS Library**  
*Built to make reading, school-library services, creativity, and learning more accessible through Saqr.*
