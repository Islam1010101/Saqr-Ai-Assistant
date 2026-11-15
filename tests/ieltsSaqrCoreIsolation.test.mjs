import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import test from 'node:test';

// Frozen production SHA before the IELTS self-test add-on was requested.
// This strict test reconstructs the original Saqr component from the ONLY
// allowed small UI changes, and verifies every original byte is identical.
const BASELINE = '6371f2bb8080674c268a1b64a105be18bc02f4f3';
const saqr = readFileSync('pages/SmartSearchPage.tsx', 'utf8');
const baseline = execFileSync('git', ['show', BASELINE+':pages/SmartSearchPage.tsx'], {encoding:'utf8'});

const allowedPatches = [
  [
    "import { useLocation, useNavigate } from 'react-router-dom';\n"+
    "import IeltsSaqrEntry from '../src/components/IeltsSaqrEntry';\n"+
    "import { ieltsSaqrPracticeRequest } from '../src/utils/ieltsSaqrPractice';\n",
    '',
  ],
  [
    "  const { state: chatNavigationState } = useLocation();\n"+
    "  const navigate = useNavigate();\n"+
    "  // Only an explicit navigation from the IELTS center passes this route state.\n"+
    "  // Direct /smart-search or hand-typed query URLs remain the exact normal Saqr.\n"+
    "  const showIeltsSkillChoice = chatNavigationState?.ieltsSelfTest === true;\n",
    '',
  ],
  [
    [
      "      {showIeltsSkillChoice && !hasConversation ? (",
      '        <main className="saqr-empty-chat" data-ielts-self-test="true">',
      '          <IeltsSaqrEntry locale={locale} disabled={isLoading}',
      '            onChoose={skill => {',
      '              // Consume the launch flag after selection; all later Saqr turns',
      '              // are ordinary chat turns on the unchanged /smart-search route.',
      "              navigate('/smart-search', { replace: true, state: null });",
      '              void handleSendMessage(ieltsSaqrPracticeRequest(skill, locale));',
      '            }} />',
      '          {composer}',
      '        </main>',
      '      ) : !hasConversation ? (',
    ].join('\n'),
    '      {!hasConversation ? (',
  ],
];

test('Saqr original chat, AI system prompt, dispatch, teacher workflows and challenge handling are byte-identical',()=>{
  let restored = saqr;
  for(const [addition, original] of allowedPatches){
    const occurrenceCount=restored.split(addition).length-1;
    assert.equal(occurrenceCount,1,'Each approved entry-only UI addition appears exactly once');
    restored=restored.replace(addition,original);
  }
  assert.equal(restored,baseline,'Only three narrowly scoped IELTS entry UI additions are permitted');
});

test('The IELTS feature cannot activate via regular Saqr navigation or query URLs',()=>{
  const page=readFileSync('pages/IeltsPreparationCenterPage.tsx','utf8');
  const helper=readFileSync('src/utils/ieltsSaqrPractice.ts','utf8');
  assert.match(page,/to="\/smart-search" state=\{\{ieltsSelfTest:true\}\}/);
  assert.match(saqr,/chatNavigationState\?\.ieltsSelfTest === true/);
  assert.doesNotMatch(saqr,/get\('ielts'\)/);
  assert.match(saqr,/navigate\('\/smart-search', \{ replace: true, state: null \}\)/);
  assert.match(saqr,/handleSendMessage\(ieltsSaqrPracticeRequest\(skill, locale\)\)/);
  assert.match(helper,/IELTS_RESOURCES\.map/);
  for(const skill of ['listening','reading','writing','speaking','mixed'])
    assert.match(helper,new RegExp("id:'"+skill+"'"));
});
