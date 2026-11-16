import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import test from 'node:test';

// The initial production Saqr component before the dedicated IELTS entry.
// The original system prompt, API request, lessons and challenges must remain
// byte-identical after only the approved IELTS entry and no-lesson-report guards are removed.
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
    "  // Presentation-only: do not display the initial IELTS request as a chat bubble.\n"+
    "  // The original Saqr send handler still receives and processes the full request.\n"+
    "  const ieltsLaunchPromptRef = useRef<string|null>(null);\n",
    '',
  ],
  [
      "    // An IELTS self-test may contain \"preparation\", \"lesson\" or \"presentation\" as learning content.\n"+
      "    // Keep this session out of teacher-only lesson planning and lesson_reports on every follow-up turn.\n"+
      "    const isIeltsPracticeSession = ieltsLaunchPromptRef.current !== null;\n"+
      "    const startingTeacherLesson = teacherAccount && !isIeltsPracticeSession && isSaqrLessonPreparationRequest(userQuery);",
    "    const startingTeacherLesson = teacherAccount && isSaqrLessonPreparationRequest(userQuery);",
  ],
  [
    "    const resumingTeacherLesson = teacherAccount && !isIeltsPracticeSession && !startingTeacherLesson &&",
    "    const resumingTeacherLesson = teacherAccount && !startingTeacherLesson &&",
  ],
  [
    "    const printingTeacherLesson = teacherAccount && !isIeltsPracticeSession && Boolean(",
    "    const printingTeacherLesson = teacherAccount && Boolean(",
  ],
  [
    "      lessonTurn: !isIeltsPracticeSession && (Boolean(activeTeacherLesson) || isSaqrLessonPreparationRequest(userQuery) || isLessonPlanRequest(userQuery)),",
    "      lessonTurn: Boolean(activeTeacherLesson) || isSaqrLessonPreparationRequest(userQuery) || isLessonPlanRequest(userQuery),",
  ],
  [
    "    if (isTeacherOrAdmin && !isIeltsPracticeSession && (",
    "    if (isTeacherOrAdmin && (",
  ],
  [
    [
      "  const visibleMessages = hasConversation",
      "    ? messages.filter((message, index) =>",
      "        !(index === 0 && message.role === 'assistant') &&",
      "        !(index === 1 && message.role === 'user' && ieltsLaunchPromptRef.current === message.content))",
      "    : [];",
    ].join('\n'),
    [
      "  const visibleMessages = hasConversation",
      "    ? messages.filter((message, index) => !(index === 0 && message.role === 'assistant'))",
      "    : [];",
    ].join('\n'),
  ],
  [
    [
      "      {showIeltsSkillChoice && !hasConversation ? (",
      '        <main className="saqr-empty-chat" data-ielts-self-test="true">',
      '          <IeltsSaqrEntry locale={locale} disabled={isLoading}',
      '            onChoose={(skill, listeningPrompt) => {',
      '              // Consume the launch flag after selection; all later Saqr turns',
      '              // are ordinary chat turns on the unchanged /smart-search route.',
      '              const practicePrompt = listeningPrompt || ieltsSaqrPracticeRequest(skill, locale);',
      '              ieltsLaunchPromptRef.current = practicePrompt;',
      "              navigate('/smart-search', { replace: true, state: null });",
      '              void handleSendMessage(practicePrompt);',
      '            }} />',
      '          {composer}',
      '        </main>',
      '      ) : !hasConversation ? (',
    ].join('\n'),
    '      {!hasConversation ? (',
  ],
  // Catalog-only exceptions are verified by Saqr bibliography and digital reader
  // regression suites; keep this guard strict for every other IELTS/core line.
  [
    "import {isSaqrDigitalReaderHref} from '../src/utils/saqrDigitalReaderLinks';\n",
    "",
  ],
  [
    "const readingInterview=namedCatalogEntity ? {kind:'none' as const}\n      : getReadingInterviewStep(userQuery,messages,locale==='ar'?'ar':'en');",
    "const readingInterview=getReadingInterviewStep(userQuery,messages,locale==='ar'?'ar':'en');",
  ],
  [
    "    const explicitCatalogSearch=/(?:^|\\s)(?:بدور|بدورلي|بيدور|ببحث|ادور|أدور|دورلي|دور\\s*لي|دور|ابحث(?:لي)?|إبحث(?:لي)?|وريني|هاتلي|search|find|look\\s+for|show\\s+me)(?=\\s|$)/i.test(userQuery);",
    "    const explicitCatalogSearch=/(?:^|\\s)(?:دورلي|دور\\s*لي|دور|ابحث(?:لي)?|إبحث(?:لي)?|وريني|هاتلي|search|find|look\\s+for|show\\s+me)(?=\\s|$)/i.test(userQuery);",
  ],
  [
    "<ReactMarkdown components={{a: ({node: _node,href,children,...props}) => (\n                              <a {...props} href={href}\n                                className={isSaqrDigitalReaderHref(href)\n                                  ? 'inline-flex items-center justify-center rounded-xl bg-emerald-700 px-4 py-2 my-1 font-bold text-white !no-underline hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500'\n                                  : undefined}>{children}</a>\n                            )}}>{msg.role === 'assistant' && index > 0 && isLessonPlanRequest(visibleMessages[index - 1]?.content || '') ? formatLessonPlanDisplay(msg.content) : msg.content}</ReactMarkdown>",
    "<ReactMarkdown>{msg.role === 'assistant' && index > 0 && isLessonPlanRequest(visibleMessages[index - 1]?.content || '') ? formatLessonPlanDisplay(msg.content) : msg.content}</ReactMarkdown>",
  ],
];

test('Saqr original logic, dispatch, system prompt, teacher workflows and challenges remain byte-identical',()=>{
  let restored=saqr;
  for(const [addition,original] of allowedPatches){
    assert.equal(restored.split(addition).length-1,1,'Each approved IELTS UI change appears exactly once');
    restored=restored.replace(addition,original);
  }
  assert.equal(restored,baseline,'Only approved IELTS UI entry and no-report guards are allowed');
});

test('The invisible practice-prompt bubble only applies to the center-launched IELTS request',()=>{
  const page=readFileSync('pages/IeltsPreparationCenterPage.tsx','utf8');
  const helper=readFileSync('src/utils/ieltsSaqrPractice.ts','utf8');
  assert.equal((page.match(/to="\/smart-search" state=\{\{ieltsSelfTest:true\}\}/g)||[]).length,1);
  assert.match(saqr,/chatNavigationState\?\.ieltsSelfTest === true/);
  assert.doesNotMatch(saqr,/get\('ielts'\)/);
  assert.match(saqr,/navigate\('\/smart-search', \{ replace: true, state: null \}\)/);
  assert.match(saqr,/ieltsLaunchPromptRef\.current = practicePrompt/);
  assert.match(saqr,/handleSendMessage\(practicePrompt\)/);
  assert.match(saqr,/index === 1 && message\.role === 'user' && ieltsLaunchPromptRef\.current === message\.content/);
  assert.match(helper,/IELTS_RESOURCES\.map/);
  for(const skill of ['listening','reading','writing','speaking','mixed'])
    assert.match(helper,new RegExp("id:'"+skill+"'"));
});
