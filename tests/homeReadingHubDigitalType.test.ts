import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const hub = readFileSync('src/components/HomeReadingHub.tsx', 'utf8');
const tour = readFileSync('pages/TutorialPage.tsx', 'utf8');

// User-facing choices are one physical/digital selector, not two language options.
assert.ok(hub.includes("useState<'all'|'physical'|'digital'>('all')"));
assert.ok(hub.includes('<option value="all">') &&
          hub.includes('<option value="physical">') &&
          hub.includes('<option value="digital">{ar?\'رقمي\':\'Digital\'}</option>'));
assert.ok(!hub.includes('<option value="ar">') && !hub.includes('<option value="en">'));
assert.ok(hub.includes("if (category === 'physical' && book.format !== 'physical') return false;"));
assert.ok(hub.includes("if (category === 'digital' && book.format === 'physical') return false;"));

// The locale is a hard restriction applied to all/physical/digital before ranking.
// It cannot be overridden by saved-book preferences, labels or profile names.
assert.ok(hub.includes('if (bookLanguage(book) !== locale) return false;'));
assert.ok(hub.includes("if (book.format === 'ar' || book.format === 'en') return book.format;"));
assert.ok(hub.includes("book.language === 'AR' ? 'ar' : 'en'"));

// Existing reader suitability and ranking must remain intact.
assert.ok(hub.includes('if (!fitsReaderAudience(book, profile.role, profile.grade)) return false;'));
assert.ok(hub.includes("if (role === 'teacher' || role === 'admin')"));
assert.ok(hub.includes("if (grade > 0 && grade <= 6) return audience === 'children'"));
assert.ok(hub.includes("return audience === 'children' || audience === 'teens'"));
assert.ok(hub.includes('if (!interestedInFaithBooks && isFaithFocused(book)) return false;'));
assert.ok(hub.includes('if (data.completed.includes(book.key) || data.saved.includes(book.key)) return false;'));
assert.ok(hub.includes('relevanceScore(book,profile.role,profile.grade,preferredSubjects,history,languageWeights)'));
assert.ok(hub.includes('const identityIndex = selected.findIndex(isNationalIdentityBook);'));
assert.ok(hub.includes('selected.splice(3, 0, identity)'));
assert.ok(hub.includes('const monthlyCompleted = useMemo('));
assert.ok(hub.includes("variant==='books' && <button"));
assert.ok(hub.includes("ar?'أضف لتحدي القراءة':'Add to reading challenge'"));

// Tutorial's public sample should match the simplified selector semantics.
assert.ok(tour.includes("kind:label('كتاب رقمي','Digital book')"));
assert.ok(!tour.includes("kind:label('رقمي عربي','Arabic digital')"));
assert.ok(!tour.includes("kind:label('رقمي إنجليزي','English digital')"));

console.log('PASS: single localized Digital selector, language hard filter, age/role/interest recommendations, National Identity and monthly challenge preserved');
