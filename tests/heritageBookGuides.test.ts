import assert from 'node:assert/strict';
import {getGuidedHeritageBook,guidedMissionIds} from '../src/utils/heritageBookGuides.ts';
import {nationalIdentityBooks} from '../src/utils/nationalIdentityCatalog.ts';
assert.equal(guidedMissionIds.length,22);
for(const id of guidedMissionIds){
 for(let level=1;level<=4;level++){
 const g=getGuidedHeritageBook(id,level,level);
 assert.ok(g,'Missing guide '+id);
 assert.ok(nationalIdentityBooks.some(b=>b.id===g.id&&b.shelf===g.shelf&&b.row===g.row&&b.author===g.author));
 assert.equal(g.shelf,41);
 assert.ok(g.task.ar&&g.task.en);
 assert.ok(!/page \d+|صفحة \d+/.test(g.task.ar+' '+g.task.en));
 }
}
const fs=await import('node:fs');const page=fs.readFileSync('pages/NationalIdentityPage.tsx','utf8');
assert.ok(page.includes('getGuidedHeritageBook(item.id'));
assert.ok(page.includes("currentMode==='passport'||currentMode==='archive'"));
assert.ok(page.includes("storageKey = useMemo"));
assert.ok(page.includes("setFlagChallengeOpen(true)"));
console.log('PASS 22 book guides, tiered tasks, exact catalog shelf and author, no invented pages');
