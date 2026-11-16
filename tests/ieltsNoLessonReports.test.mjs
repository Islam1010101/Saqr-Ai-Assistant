import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = readFileSync('pages/SmartSearchPage.tsx','utf8');
const entry = readFileSync('src/components/IeltsSaqrEntry.tsx','utf8');
const chatSend = source.slice(
  source.indexOf('  const handleSendMessage = async'),
  source.indexOf('  const visibleMessages =')
);
const reportStart = chatSend.indexOf('// تسجيل التحضير في قاعدة بيانات الإدارة');
const reportEnd = chatSend.indexOf('// Exact national-identity collection request:');
const reports = chatSend.slice(reportStart,reportEnd);

test('IELTS trainer launch is an explicit scoped session, for every skill',()=>{
  assert.match(source,/const showIeltsSkillChoice = chatNavigationState\?\.ieltsSelfTest === true/);
  assert.match(source,/ieltsLaunchPromptRef\.current = practicePrompt/);
  assert.match(source,/const isIeltsPracticeSession = ieltsLaunchPromptRef\.current !== null;/);
  for(const skill of ['listening','reading','writing','speaking','mixed'])
    assert.match(readFileSync('src/utils/ieltsSaqrPractice.ts','utf8'),new RegExp("id:'"+skill+"'"));
  assert.match(entry,/onReview={prompt => onChoose\('listening', prompt\)}/);
  assert.match(entry,/onStart={prompt => onChoose\(activePractice, prompt\)}/);
  assert.match(entry,/onChoose\('speaking', ieltsWrittenSpeakingRequest\(locale\)\)/);
});

test('IELTS reports and feedback never insert into teacher lesson reports',()=>{
  assert.ok(reportStart>=0 && reportEnd>reportStart,'Existing lesson_reports block must be present');
  assert.match(reports,/if \(isTeacherOrAdmin && !isIeltsPracticeSession && \(/);
  assert.match(reports,/userQuery\.includes\('تحضير'\)/);
  assert.match(reports,/userQuery\.includes\('عرض'\)/);
  assert.match(reports,/userQuery\.includes\('lesson plan'\)/);
  assert.match(reports,/userQuery\.includes\('presentation'\)/);
  assert.equal((reports.match(/supabase\.from\('lesson_reports'\)\.insert/g)||[]).length,1);
  assert.ok(source.indexOf('const isIeltsPracticeSession = ieltsLaunchPromptRef.current !== null;')<
    source.indexOf("supabase.from('lesson_reports').insert"),'Guard must be assigned before the database call');
});

test('IELTS sessions never enter teacher-only lesson generation or lesson proofreading; normal teacher mode remains intact',()=>{
  assert.match(chatSend,/const startingTeacherLesson = teacherAccount && !isIeltsPracticeSession && isSaqrLessonPreparationRequest\(userQuery\);/);
  assert.match(chatSend,/const resumingTeacherLesson = teacherAccount && !isIeltsPracticeSession && !startingTeacherLesson &&/);
  assert.match(chatSend,/const printingTeacherLesson = teacherAccount && !isIeltsPracticeSession && Boolean\(/);
  assert.match(chatSend,/lessonTurn: !isIeltsPracticeSession && \(Boolean\(activeTeacherLesson\) \|\| isSaqrLessonPreparationRequest\(userQuery\) \|\| isLessonPlanRequest\(userQuery\)\)/);
  assert.match(chatSend,/const activeTeacherLesson:SaqrTeacherLessonSession\|null = startingTeacherLesson/);
  assert.match(chatSend,/startSaqrTeacherLesson\(userQuery\)/);
  assert.match(chatSend,/lessonPart: Boolean\(activeTeacherLesson\)/);
});
