import type { IeltsListeningQuestion } from '../data/ieltsListeningLessons';

/** Original Saqr practice questions, not licensed IELTS assessment scoring. */
export type IeltsListeningAnswer = number | string;

export function normaliseListeningAnswer(value: string): string {
  return value.trim().toLocaleLowerCase('en').replace(/[^a-z0-9]+/g,'');
}

export function isListeningCompletion(question: IeltsListeningQuestion): boolean {
  return question.kind === 'note-completion' ||
    question.kind === 'table-completion' ||
    question.kind === 'short-answer';
}

export function isListeningAnswerComplete(answer: IeltsListeningAnswer | undefined): boolean {
  return answer !== undefined &&
    (typeof answer !== 'string' || answer.trim().length > 0);
}

export function isListeningAnswerCorrect(question: IeltsListeningQuestion, answer: IeltsListeningAnswer | undefined): boolean {
  if (isListeningCompletion(question)) {
    if (typeof answer !== 'string' || !answer.trim() || !question.answerText) return false;
    const accepted = [question.answerText, ...(question.acceptedAnswers || [])]
      .map(normaliseListeningAnswer).filter(Boolean);
    return accepted.includes(normaliseListeningAnswer(answer));
  }
  return typeof answer === 'number' &&
    Number.isInteger(answer) && answer === question.correctIndex;
}

export function listeningAnswerSummary(question:IeltsListeningQuestion, answer:IeltsListeningAnswer):{
  studentAnswer:string;
  correctAnswer:string;
  correct:boolean;
}{
  const completion=isListeningCompletion(question);
  return {
    studentAnswer:completion ? String(answer) : question.options[answer as number] || '—',
    correctAnswer:completion ? question.answerText || '—' : question.options[question.correctIndex] || '—',
    correct:isListeningAnswerCorrect(question,answer),
  };
}
