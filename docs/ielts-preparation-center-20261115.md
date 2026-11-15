# EFIPS IELTS Preparation Center — implementation note (15 November 2026)

## Source and scope
- Source folder: Google Drive / English Books / IELTS (ID \`1kGcWsBCLkyRqHxSL8o84YX-cmNRIGZbh\`).
- \`Cambridge 1-20\` subfolder: 19 Cambridge IELTS PDFs numbered 01–19; Cambridge 20 is not present.
- Five other PDFs: Official Cambridge Guide, IELTS Trainer, Writing, Grammar, Vocabulary.
- Independent registry in \`src/data/ieltsResources.ts\`, intentionally **not** appended to \`ENGLISH_LIBRARY_DATABASE\` (existing English photos and their counts remain intact).
- File names, identifiers, and byte sizes were read from Drive on 2026-11-15; PDF interiors/audio were not exhaustively audited. Volumes 01–10 are not labelled Academic without edition verification. No separate listening MP3s were listed in these two folders.

## Rights and privacy
- The school representative confirmed rights for electronic student/staff use in this conversation on 2026-11-15. This implementation stores only Drive PDF metadata and links, **not** PDF bytes or extracted book text in GitHub.
- The app does not claim to be an official IELTS/Cambridge partner, nor does it reproduce protected practice questions for Saqr.
- All PDF access remains subject to the **actual Google Drive file ACL**, the signed-in school's Google identity, and Google OAuth permissions. The site route guard is not a substitute for Drive permissions.
- The current client-side reader uses direct Google Drive API range reads with a browser-scoped token, not the unrestricted public PDF endpoint.
- For full student access, verify the individual files' Drive sharing permissions using a school student account; uploader access alone does not prove that students can open every file. Confirm audio supplements separately.

## Implementation
- \`/#/digital-library/english/ielts\`: dedicated bilingual study centre with four skills, configurable four-phase plan, individual PDF records, search, Cambridge track label filter, and study references.
- Discovery: CTA inside English Library and shortcut on Digital Library landing page.
- Reuses \`DigitalBookReader\` (PDF.js, page navigation, reading progress). Keeps \`EnglishPhotoBookReader\` unchanged.
- Saqr buttons link to \`/#/smart-search?ielts=<skill>\`; SmartSearchPage pre-fills an editable prompt and does **not** auto-send or alter the original chat routing, model providers, lesson plans, certificates or library search rules.
- Extends GoogleSchoolReturn for the 24 explicitly allowlisted IELTS IDs so an authorised Google OAuth reader-consent return reopens the same file.
- The study plan is a suggested timeline, **not** a verified estimate of IELTS score, official test, or persistent assessment.

## Verification / release gate
1. Run \`node --test tests/ieltsCenter.test.mjs\`.
2. Run \`npm run build\` and (where possible) \`npx tsc --noEmit\`.
3. Smoke-test route in both languages, light and dark mode, mobile and desktop.
4. From school student account, open a small (<20MB) and large (>20MB) IELTS PDF inside the glass reader, including OAuth re-consent return.
5. Verify Saqr's four pre-filled prompts, no unrelated catalog search, and unchanged teacher/young-author behavior.
6. Merge and deploy only after the branch checks and a human review; no production deployment is part of this change.
