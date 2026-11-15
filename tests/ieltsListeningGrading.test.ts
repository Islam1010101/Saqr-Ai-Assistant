import assert from 'node:assert/strict';
import { isListeningAnswerCorrect, isListeningAnswerComplete, normaliseListeningAnswer, listeningAnswerSummary } from '../src/utils/ieltsListeningGrading.ts';

const note = {prompt:'Fill the meeting time',options:[],correctIndex:-1,explanation:'The audio states 5:00 p.m.',kind:'note-completion' as const,answerText:'5:00 p.m.',acceptedAnswers:['5pm','5 pm','5:00 pm']};
const table = {prompt:'How many minutes late?',options:[],correctIndex:-1,explanation:'The presenter specifies 43 minutes.',kind:'table-completion' as const,answerText:'43',acceptedAnswers:['forty-three','forty three']};
const multiple = {prompt:'What was discussed?', options:['Work','Travel','Weather'],correctIndex:2,explanation:'The recording discusses weather.'};

assert.equal(normaliseListeningAnswer(' 5:00 P.M. '),'500pm');
assert.equal(isListeningAnswerComplete(0),true);
assert.equal(isListeningAnswerComplete('  '),false);
assert.equal(isListeningAnswerComplete(undefined),false);
assert.equal(isListeningAnswerCorrect(note,'5:00 P.M.'),true);
assert.equal(isListeningAnswerCorrect(note,'5 pm'),true);
assert.equal(isListeningAnswerCorrect(note,'6pm'),false);
assert.equal(isListeningAnswerCorrect(note,0),false);
assert.equal(isListeningAnswerCorrect(table,'43'),true);
assert.equal(isListeningAnswerCorrect(table,'forty three'),true);
assert.equal(isListeningAnswerCorrect(table,'34'),false);
assert.equal(isListeningAnswerCorrect(multiple,2),true);
assert.equal(isListeningAnswerCorrect(multiple,0),false);
assert.equal(isListeningAnswerCorrect(multiple,'Weather'),false);
assert.deepEqual(listeningAnswerSummary(note,'5 pm'),{studentAnswer:'5 pm',correctAnswer:'5:00 p.m.',correct:true});
assert.deepEqual(listeningAnswerSummary(multiple,2),{studentAnswer:'Weather',correctAnswer:'Weather',correct:true});
console.log('PASS: Saqr IELTS original graded MCQ, note and table completion answers');
