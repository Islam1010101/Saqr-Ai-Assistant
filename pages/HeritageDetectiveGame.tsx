import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bilingual, HeritageInvestigation, heritageInvestigations } from '../src/data/heritageInvestigations';
import { getGuidedHeritageBook } from '../src/utils/heritageBookGuides';
import './heritageDetectiveGame.css';

type Props = {
  language: 'ar' | 'en';
  completedIds: string[];
  onComplete: (caseId: string) => void;
  onBack: () => void;
};
type Verdict = HeritageInvestigation['verdict'];
type Stage = 'brief' | 'evidence' | 'timeline' | 'verdict';
type Mark = 'folder' | 'lens' | 'clock' | 'seal' | 'check' | 'arrow' | 'book' | 'file' | 'lock';

const stageNames: Record<Stage, Bilingual> = {
  brief: { ar: 'استلام البلاغ', en: 'The briefing' },
  evidence: { ar: 'معمل الأدلة', en: 'Evidence lab' },
  timeline: { ar: 'خط الأحداث', en: 'Timeline' },
  verdict: { ar: 'كشف الحقيقة', en: 'The verdict' }
};
const stageIcons: Record<Stage, Mark> = {
  brief: 'folder', evidence: 'lens', timeline: 'clock', verdict: 'seal'
};
const verdicts: Array<{ id: Verdict; label: Bilingual; tag: Bilingual }> = [
  { id: 'supported', label: { ar: 'البلاغ صحيح', en: 'Supported' }, tag: { ar: 'مؤكد', en: 'Verified' } },
  { id: 'misleading', label: { ar: 'الحقيقة ناقصة', en: 'Misleading' }, tag: { ar: 'مضلل', en: 'Misleading' } },
  { id: 'false', label: { ar: 'البلاغ خاطئ', en: 'False claim' }, tag: { ar: 'مرفوض', en: 'Rejected' } }
];
const move = <T,>(list: T[], from: number, to: number) => {
  if (to < 0 || to >= list.length) return list;
  const copy = [...list];
  copy.splice(to, 0, ...copy.splice(from, 1));
  return copy;
};

/** Lightweight line icons. No icon font, external image, or third-party animation package. */
const MarkIcon: React.FC<{ name: Mark; size?: number }> = ({ name, size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {name === 'folder' && <><path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10H3Z"/><path d="M3 10h18"/></>}
    {name === 'lens' && <><circle cx="10.7" cy="10.7" r="6.8"/><path d="m16 16 5 5M8 11l2 2 4-5"/></>}
    {name === 'clock' && <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l4 2"/></>}
    {name === 'seal' && <><path d="M12 2 15 5l4-.1.4 4L22 12l-2.6 3.1-.4 4-4-.1-3 3-3-3-4 .1-.4-4L2 12l2.6-3.1.4-4 4 .1Z"/><path d="m8.5 12 2.5 2.5 4.5-5"/></>}
    {name === 'check' && <path d="m5 12 4 4L19 6"/>}
    {name === 'arrow' && <><path d="m5 12 14 0M13 6l6 6-6 6"/></>}
    {name === 'book' && <><path d="M12 6C9 4 6 4 2 5v14c4-1 7-1 10 1 3-2 6-2 10-1V5c-4-1-7-1-10 1Z"/><path d="M12 6v14"/></>}
    {name === 'file' && <><path d="M6 2h8l4 4v16H6Z"/><path d="M14 2v5h4M9 12h6M9 16h5"/></>}
    {name === 'lock' && <><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>}
  </svg>
);

/** Staged investigation room: each case remains source-first, and validation remains unchanged. */
const HeritageDetectiveGame: React.FC<Props> = ({ language, completedIds, onComplete, onBack }) => {
  const [selectedCase, setSelectedCase] = useState<number | null>(null);
  const [stage, setStage] = useState<Stage>('brief');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [inspected, setInspected] = useState<string[]>([]);
  const [proof, setProof] = useState<string[]>([]);
  const [rejected, setRejected] = useState<string | null>(null);
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [reason, setReason] = useState('');
  const [solved, setSolved] = useState(false);
  const [issues, setIssues] = useState<string[]>([]);
  const [showBook, setShowBook] = useState(false);
  const caseFile = heritageInvestigations[selectedCase ?? 0];
  const libraryBook = useMemo(() => getGuidedHeritageBook(caseFile.id, caseFile.level), [caseFile.id, caseFile.level]);
  const t = (value: Bilingual) => value[language];
  const stages: Stage[] = caseFile.timeline ? ['brief', 'evidence', 'timeline', 'verdict'] : ['brief', 'evidence', 'verdict'];
  const [ordered, setOrdered] = useState<string[]>(() =>
    [...(heritageInvestigations[0].timeline || [])].reverse().map(entry => entry.id)
  );
  const completedCount = heritageInvestigations.filter(item => completedIds.includes(item.id)).length;
  const selectedEvidence = caseFile.evidence.find(item => item.id === expanded);
  const officialCount = caseFile.evidence.filter(item => proof.includes(item.id) && item.official).length;
  const chronologicalDone = !caseFile.timeline || ordered.every((id, position) =>
    caseFile.timeline?.find(item => item.id === id)?.order === position
  );
  const evidenceReady = inspected.length === caseFile.evidence.length && officialCount === 2 && !!rejected;
  const stepPosition = stages.indexOf(stage);

  const openCase = (next: number) => {
    if (next < 0 || next >= heritageInvestigations.length) return;
    const target = heritageInvestigations[next];
    setSelectedCase(next);
    setStage('brief');
    setExpanded(null);
    setInspected([]);
    setProof([]);
    setRejected(null);
    setVerdict(null);
    setReason('');
    setSolved(false);
    setIssues([]);
    setShowBook(false);
    setOrdered(target.timeline ? [...target.timeline].reverse().map(entry => entry.id) : []);
  };
  const inspect = (id: string) => {
    setExpanded(id);
    setInspected(current => current.includes(id) ? current : [...current, id]);
    setIssues([]);
  };
  const toggleProof = (id: string) => {
    setProof(current => current.includes(id) ? current.filter(value => value !== id) : current.length < 2 ? [...current, id] : current);
    setRejected(current => current === id ? null : current);
    setIssues([]);
  };
  const markUnreliable = (id: string) => {
    setRejected(current => current === id ? null : id);
    setProof(current => current.filter(value => value !== id));
    setIssues([]);
  };
  const verify = () => {
    const errors: string[] = [];
    if (inspected.length < caseFile.evidence.length)
      errors.push(t({ ar: 'افحص المستندات الثلاثة قبل حسم القضية.', en: 'Inspect all three records before closing the case.' }));
    if (proof.length !== 2 || caseFile.evidence.filter(item => proof.includes(item.id) && item.official).length !== 2)
      errors.push(t({ ar: 'ثبت وثيقتين موثوقتين على لوحة الأدلة.', en: 'Pin two dependable documents on the evidence board.' }));
    if (!rejected || caseFile.evidence.find(item => item.id === rejected)?.official !== false)
      errors.push(t({ ar: 'استبعد الادعاء التدريبي الذي لا يملك مصدرًا أصليًا.', en: 'Reject the unsourced practice claim.' }));
    if (caseFile.timeline && !chronologicalDone)
      errors.push(t({ ar: 'أعد ترتيب خط الأحداث من الأقدم إلى الأحدث.', en: 'Reconstruct the timeline from earliest to latest.' }));
    if (verdict !== caseFile.verdict)
      errors.push(t({ ar: 'قرارك لا يتوافق مع الأدلة. أعد مقارنة المصادر.', en: 'Your verdict conflicts with the evidence. Compare the sources again.' }));
    if (reason.trim().length < 25)
      errors.push(t({ ar: 'سجّل ملاحظة استنتاج من 25 حرفًا على الأقل.', en: 'Record a finding of at least 25 characters.' }));
    setIssues(errors);
    if (errors.length) return;
    setSolved(true);
    onComplete(caseFile.id);
  };
  const nextStage = () => { if (stepPosition < stages.length - 1) setStage(stages[stepPosition + 1]); };

  return (
    <section className="hd" dir={language === 'ar' ? 'rtl' : 'ltr'} aria-label={t({ ar: 'مكتب محقق ذاكرة وطن', en: 'National Memory Detective Bureau' })}>
      <div className="hd-atmosphere" aria-hidden="true"><span/><span/><span/></div>
      <div className="hd-topbar">
        <button type="button" className="hd-back" onClick={selectedCase === null ? onBack : () => setSelectedCase(null)}>
          <span className="hd-back-symbol" aria-hidden="true">‹</span>
          {selectedCase === null ? t({ ar: 'تحديات صقر', en: 'Saqr challenges' }) : t({ ar: 'غرفة القضايا', en: 'Case room' })}
        </button>
        <div className="hd-brand"><span className="hd-status-light"/>{t({ ar: 'وحدة التحقيق التاريخي', en: 'HISTORICAL INVESTIGATION UNIT' })}<small>EFIPS</small></div>
      </div>

      {selectedCase === null ? (
        <div className="hd-enter" key="case-room">
          <header className="hd-hero">
            <div className="hd-hero-copy">
              <span className="hd-eyebrow"><span className="hd-pulse-dot"/>{t({ ar: 'ملفات حقيقية • مصادر رسمية', en: 'TRUE HISTORY • OFFICIAL SOURCES' })}</span>
              <h2>{t({ ar: 'محقق', en: 'Memory' })}<br/><em>{t({ ar: 'ذاكرة وطن', en: 'Detective' })}</em></h2>
              <p>{t({ ar: 'في الأرشيف أسرار لا تُحل بالتخمين. اختر قضية، افحص الأدلة، واربط الخيوط حتى تظهر الحقيقة.', en: 'There is more to every story. Choose a mystery, inspect the records, connect the clues and uncover the truth.' })}</p>
              <div className="hd-hero-chips"><span>{t({ ar: '10 قضايا', en: '10 cases' })}</span><span>{t({ ar: 'أدلة رسمية', en: 'Verified records' })}</span><span>{t({ ar: 'بدون عداد وقت', en: 'No timer' })}</span></div>
            </div>
            <div className="hd-hero-art" aria-hidden="true">
              <div className="hd-art-ring hd-art-ring-one"/><div className="hd-art-ring hd-art-ring-two"/>
              <div className="hd-art-document"><span/><span/><span/><span/></div>
              <div className="hd-art-magnifier"><div className="hd-art-glass"><div className="hd-art-fingerprint"/></div><i/></div>
              <div className="hd-art-tag">CASE FILES</div>
            </div>
          </header>
          <div className="hd-case-heading">
            <div><span className="hd-kicker">{t({ ar: 'الأرشيف المفتوح', en: 'OPEN ARCHIVE' })}</span><h3>{t({ ar: 'اختر القضية التي ستكشفها', en: 'Choose your investigation' })}</h3></div>
            <div className="hd-progress-badge"><MarkIcon name="seal" size={22}/><strong>{completedCount}</strong><span>/ {heritageInvestigations.length} {t({ ar: 'مكتملة', en: 'solved' })}</span></div>
          </div>
          <div className="hd-case-grid">
            {heritageInvestigations.map((item, position) => {
              const done = completedIds.includes(item.id);
              return <button type="button" key={item.id} onClick={() => openCase(position)} className={'hd-case-tile ' + (done ? 'hd-case-tile-done' : '')}>
                <span className="hd-case-tile-top"><span className="hd-case-index">{String(position + 1).padStart(2, '0')}</span><span className="hd-case-mini-icon"><MarkIcon name={done ? 'check' : position % 3 === 0 ? 'lens' : position % 3 === 1 ? 'file' : 'folder'} size={25}/></span></span>
                <strong>{t(item.title)}</strong>
                <span className="hd-case-tile-bottom"><span>{t({ ar: 'مستوى', en: 'Level' })} {item.level}</span><span>{done ? t({ ar: 'تم حلها', en: 'Resolved' }) : t({ ar: 'افتح الملف', en: 'Open file' })} <MarkIcon name="arrow" size={17}/></span></span>
                {done && <span className="hd-case-watermark" aria-hidden="true"><MarkIcon name="seal" size={56}/></span>}
              </button>;
            })}
          </div>
          <div className="hd-room-footer"><MarkIcon name="lock" size={17}/>{t({ ar: 'المعلومات مصدرها سجلات رسمية. بعض الأوراق داخل القضايا ادعاءات تدريبية غير موثقة، وليست وثائق أصلية.', en: 'Records are traced to official sources. Some cards are fictional training claims, not original archival documents.' })}</div>
        </div>
      ) : (
        <div className="hd-enter" key={caseFile.id}>
          <div className="hd-mission-head">
            <div className="hd-mission-heading">
              <span className="hd-kicker">{t({ ar: 'قضية رقم', en: 'CASE NO.' })} {String(selectedCase + 1).padStart(2, '0')} <i/> {t({ ar: 'مستوى', en: 'LEVEL' })} {caseFile.level}</span>
              <h2>{t(caseFile.title)}</h2>
              <span className="hd-mission-sub">{t({ ar: 'ملف تحقيق مفتوح • كل خطوة تكشف جزءًا من الصورة', en: 'Investigation open • Each stage uncovers another clue' })}</span>
            </div>
            <div className="hd-mission-progress"><div className="hd-progress-orbit"><span>{solved ? '100%' : String(Math.round(((stepPosition + 1) / stages.length) * 100)) + '%'}</span></div><small>{t({ ar: 'تقدم المهمة', en: 'MISSION PROGRESS' })}</small></div>
          </div>

          <nav className="hd-steps" aria-label={t({ ar: 'مراحل التحقيق', en: 'Investigation stages' })}>
            {stages.map((item, position) =>
              <button type="button" key={item} aria-current={stage === item ? 'step' : undefined}
                className={'hd-step ' + (stage === item ? 'hd-step-active ' : '') + (position < stepPosition || solved ? 'hd-step-visited' : '')}
                onClick={() => setStage(item)}>
                <span className="hd-step-icon"><MarkIcon name={stageIcons[item]} size={21}/></span>
                <span className="hd-step-text"><small>{t({ ar: 'المرحلة', en: 'STAGE' })} {position + 1}</small><strong>{t(stageNames[item])}</strong></span>
                {position < stages.length - 1 && <span className="hd-step-connector" aria-hidden="true"/>}
              </button>
            )}
          </nav>

          <div key={stage} className="hd-stage hd-stage-reveal">
            {stage === 'brief' && <div className="hd-brief-layout">
              <div className="hd-brief-card">
                <div className="hd-card-head"><span className="hd-round-icon"><MarkIcon name="folder" size={25}/></span><div><span className="hd-kicker">{t({ ar: 'ملف سري • البلاغ الوارد', en: 'INCOMING CASE REPORT' })}</span><h3>{t({ ar: 'ما الحقيقة وراء هذا البلاغ؟', en: 'What is the truth?' })}</h3></div></div>
                <div className="hd-claim"><span className="hd-claim-label">{t({ ar: 'قيد التحقيق • ليس حقيقة مثبتة', en: 'UNDER INVESTIGATION • NOT A VERIFIED FACT' })}</span><p>{t(caseFile.allegation)}</p><div className="hd-claim-stamp" aria-hidden="true">?</div></div>
                <p className="hd-brief-story">{t(caseFile.briefing)}</p>
                <button type="button" className="hd-cta" onClick={() => setStage('evidence')}><MarkIcon name="lens" size={23}/>{t({ ar: 'ابدأ فحص مسرح الأدلة', en: 'Enter the evidence lab' })}<span className="hd-cta-arrow"><MarkIcon name="arrow" size={21}/></span></button>
              </div>
              <div className="hd-brief-side">
                <div className="hd-brief-compass"><span className="hd-compass-center"><MarkIcon name="lens" size={53}/></span><span className="hd-compass-orbit"/></div>
                <h4>{t({ ar: 'مهمتك كمحقق', en: 'YOUR MISSION' })}</h4>
                <div className="hd-mission-tasks">
                  <span><MarkIcon name="lens" size={19}/>{t({ ar: 'افحص 3 مستندات', en: 'Inspect 3 records' })}</span>
                  <span><MarkIcon name="folder" size={19}/>{t({ ar: 'ثبّت دليلين موثوقين', en: 'Pin 2 reliable sources' })}</span>
                  <span><MarkIcon name="seal" size={19}/>{t({ ar: 'استبعد الخبر المضلل', en: 'Reject the unsourced claim' })}</span>
                </div>
              </div>
            </div>}

            {stage === 'evidence' && <div className="hd-evidence-stage">
              <div className="hd-section-title"><div><span className="hd-kicker">{t({ ar: 'المرحلة الثانية • معمل الأدلة', en: 'EVIDENCE LAB' })}</span><h3>{t({ ar: 'افتح المظاريف... واربط الخيوط', en: 'Open the files. Connect the clues.' })}</h3><p>{t({ ar: 'اضغط على كل ملف لفحص تفاصيله ومصدره، ثم قرر هل تثبته كدليل أم تستبعده.', en: 'Open each file and inspect its source, then pin it as evidence or reject it.' })}</p></div><div className="hd-counter">{inspected.length} / 3 <small>{t({ ar: 'تم فحصها', en: 'INSPECTED' })}</small></div></div>

              <div className="hd-evidence-wall">
                <div className="hd-evidence-grid">
                  {caseFile.evidence.map((item, position) => {
                    const isProof = proof.includes(item.id);
                    const isRejected = rejected === item.id;
                    const isOpen = expanded === item.id;
                    const isInspected = inspected.includes(item.id);
                    return <button type="button" key={item.id} onClick={() => inspect(item.id)} aria-pressed={isOpen}
                      className={'hd-document ' + (isOpen ? 'hd-document-active ' : '') + (isProof ? 'hd-document-pinned ' : '') + (isRejected ? 'hd-document-rejected ' : '')}>
                      <span className="hd-document-pin"/><span className="hd-document-number">{t({ ar: 'قرينة', en: 'CLUE' })} {String(position + 1).padStart(2, '0')}</span>
                      <span className="hd-document-illustration"><MarkIcon name={isInspected ? 'file' : 'lock'} size={39}/></span>
                      <strong>{t(item.title)}</strong><span className="hd-document-publisher">{isInspected ? t(item.publisher) : t({ ar: 'اضغط للكشف عن المحتوى', en: 'Tap to unseal this file' })}</span>
                      <span className="hd-document-bottom">{isProof ? t({ ar: 'مثبّت على اللوحة', en: 'PINNED' }) : isRejected ? t({ ar: 'مستبعد', en: 'REJECTED' }) : isInspected ? t({ ar: 'تم فتح الملف', en: 'INSPECTED' }) : t({ ar: 'ملف مغلق', en: 'SEALED' })}<MarkIcon name={isInspected ? 'check' : 'lens'} size={17}/></span>
                    </button>;
                  })}
                </div>
                <div className="hd-dossier" aria-live="polite">
                  {selectedEvidence ? <>
                    <span className="hd-kicker">{t({ ar: 'تحت العدسة', en: 'UNDER THE LENS' })}</span>
                    <h4>{t(selectedEvidence.title)}</h4>
                    <p className="hd-dossier-summary">{t(selectedEvidence.summary)}</p>
                    <div className="hd-dossier-source"><span>{t({ ar: 'جهة النشر المذكورة', en: 'ATTRIBUTED SOURCE' })}</span><strong>{t(selectedEvidence.publisher)}</strong>
                      {selectedEvidence.url ? <a href={selectedEvidence.url} target="_blank" rel="noopener noreferrer">{t({ ar: 'راجع المصدر الرسمي الأصلي', en: 'Verify original official source' })}<MarkIcon name="arrow" size={17}/></a> : <small>{t({ ar: 'لا يوجد رابط أو سجل أصلي؛ هذه بطاقة افتراضية للتدريب وليست وثيقة تاريخية.', en: 'No original source exists. This is a fictional practice card, not an archival record.' })}</small>}
                    </div>
                    <div className="hd-dossier-actions">
                      <button type="button" disabled={solved || (!proof.includes(selectedEvidence.id) && proof.length >= 2)} aria-pressed={proof.includes(selectedEvidence.id)} className={'hd-action-proof ' + (proof.includes(selectedEvidence.id) ? 'hd-action-selected' : '')} onClick={() => toggleProof(selectedEvidence.id)}><MarkIcon name="check" size={20}/>{proof.includes(selectedEvidence.id) ? t({ ar: 'إزالة من لوحة الإثبات', en: 'Unpin evidence' }) : t({ ar: 'ثبّت كدليل', en: 'Pin as evidence' })}</button>
                      <button type="button" disabled={solved} aria-pressed={rejected === selectedEvidence.id} className={'hd-action-reject ' + (rejected === selectedEvidence.id ? 'hd-action-selected' : '')} onClick={() => markUnreliable(selectedEvidence.id)}>{rejected === selectedEvidence.id ? t({ ar: 'إلغاء الاستبعاد', en: 'Undo rejection' }) : t({ ar: 'استبعد لغياب المصدر', en: 'Reject as unreliable' })}</button>
                    </div>
                  </> : <div className="hd-dossier-idle"><div className="hd-dossier-orbit"><MarkIcon name="lens" size={64}/></div><strong>{t({ ar: 'العدسة جاهزة', en: 'MAGNIFIER READY' })}</strong><p>{t({ ar: 'اختر أحد المظاريف الثلاثة من اللوحة لبدء فحص الدليل.', en: 'Select one of the three envelopes to inspect its contents.' })}</p></div>}
                </div>
              </div>

              <div className="hd-connections"><div className="hd-connections-title"><MarkIcon name="folder" size={25}/><div><h4>{t({ ar: 'لوحة ربط الخيوط', en: 'EVIDENCE CONNECTION BOARD' })}</h4><small>{t({ ar: 'دليلان موثوقان + ادعاء واحد مستبعد', en: 'Two dependable records + one discarded claim' })}</small></div></div>
                <div className="hd-connection-slots">
                  {[0, 1].map(position => <div key={position} className={'hd-connection-slot ' + (proof[position] ? 'hd-connection-filled' : '')}><span>{t({ ar: 'دليل', en: 'PROOF' })} {position + 1}</span><strong>{proof[position] ? t(caseFile.evidence.find(item => item.id === proof[position])!.title) : t({ ar: 'بانتظار التثبيت', en: 'Awaiting evidence' })}</strong></div>)}
                  <div className={'hd-connection-slot hd-connection-discard ' + (rejected ? 'hd-connection-filled' : '')}><span>{t({ ar: 'ادعاء مستبعد', en: 'DISCARDED' })}</span><strong>{rejected ? t(caseFile.evidence.find(item => item.id === rejected)!.title) : t({ ar: 'بانتظار الاستبعاد', en: 'Nothing rejected yet' })}</strong></div>
                </div>
              </div>

              {libraryBook && <div className="hd-library">
                <button type="button" aria-expanded={showBook} onClick={() => setShowBook(value => !value)}><MarkIcon name="book" size={22}/>{t({ ar: 'افتح ملحق مكتبة صقر (اختياري)', en: 'Explore a library book (optional)' })}<span>{showBook ? '−' : '+'}</span></button>
                {showBook && <div className="hd-library-body"><strong>{libraryBook.title} — {libraryBook.author}</strong><p>{t({ ar: 'الرف', en: 'Shelf' })} {libraryBook.shelf} · {t({ ar: 'الصف', en: 'Row' })} — {t(libraryBook.task)}</p><small>{t({ ar: 'للاستزادة فقط؛ الكتاب ليس اقتباسًا موثقًا من صفحات تم فحصها.', en: 'Optional reading only; not a verified quotation from pages we inspected.' })}</small><Link to="/saqr-national-identity/books">{t({ ar: 'فهرس كتب الهوية', en: 'Heritage library' })}</Link></div>}
              </div>}
              <div className="hd-stage-bottom"><span>{evidenceReady ? t({ ar: 'لوحة الأدلة مكتملة مبدئيًا', en: 'Evidence board assembled' }) : t({ ar: 'افحص 3 قرائن، ثبّت 2، واستبعد 1', en: 'Inspect 3, pin 2, reject 1' })}</span><button type="button" className="hd-cta" onClick={nextStage}>{t({ ar: caseFile.timeline ? 'إلى خط الأحداث' : 'إلى كشف الحقيقة', en: caseFile.timeline ? 'Reconstruct the timeline' : 'Review the finding' })}<MarkIcon name="arrow" size={19}/></button></div>
            </div>}

            {stage === 'timeline' && caseFile.timeline && <div className="hd-time-stage">
              <div className="hd-section-title"><div><span className="hd-kicker">{t({ ar: 'أعد بناء ما حدث', en: 'REBUILD THE CHRONOLOGY' })}</span><h3>{t({ ar: 'التواريخ مبعثرة... رتبها بنفسك', en: 'The dates are scattered. Put them in order.' })}</h3><p>{t({ ar: 'حرّك البطاقات بالأسهم من الحدث الأقدم إلى الأحدث. ارجع إلى الوثائق عند الحاجة.', en: 'Use the arrows to move events from earliest to latest. Recheck your records when needed.' })}</p></div><div className="hd-counter"><MarkIcon name="clock" size={30}/></div></div>
              <div className="hd-time-track">
                {ordered.map((id, position) => <div key={id} className="hd-time-event">
                  <span className="hd-time-node">{String(position + 1).padStart(2, '0')}</span>
                  <div className="hd-time-event-card"><strong>{t(caseFile.timeline!.find(item => item.id === id)!.label)}</strong><div className="hd-time-controls">
                    <button type="button" disabled={solved || position === 0} onClick={() => setOrdered(items => move(items, position, position - 1))} aria-label={t({ ar: 'حرّك الحدث إلى موضع أقدم', en: 'Move event earlier' })}>↑</button>
                    <button type="button" disabled={solved || position === ordered.length - 1} onClick={() => setOrdered(items => move(items, position, position + 1))} aria-label={t({ ar: 'حرّك الحدث إلى موضع أحدث', en: 'Move event later' })}>↓</button>
                  </div></div>
                </div>)}
              </div>
              <div className="hd-stage-bottom"><button type="button" className="hd-secondary" onClick={() => setStage('evidence')}>{t({ ar: 'ارجع للأدلة', en: 'Back to evidence' })}</button><button type="button" className="hd-cta" onClick={() => setStage('verdict')}>{t({ ar: 'واجه الحقيقة', en: 'Issue a finding' })}<MarkIcon name="arrow" size={19}/></button></div>
            </div>}

            {stage === 'verdict' && <div className="hd-verdict-stage">
              {!solved ? <>
                <div className="hd-section-title"><div><span className="hd-kicker">{t({ ar: 'المرحلة الأخيرة • غرفة القرار', en: 'THE FINAL CHAMBER' })}</span><h3>{t({ ar: 'الأدلة أمامك... ما حكمك؟', en: 'The evidence is in. What is your verdict?' })}</h3><p>{t({ ar: 'اختر الختم المناسب، وسجل ملاحظة قصيرة تربط قرارك بالمصادر. ليس امتحان كتابة.', en: 'Choose a finding and leave a brief case note citing the evidence.' })}</p></div><div className="hd-counter"><MarkIcon name="seal" size={31}/></div></div>
                <div className="hd-verdict-layout"><div className="hd-verdict-report"><span className="hd-kicker">{t({ ar: 'البلاغ الأصلي', en: 'ORIGINAL CLAIM' })}</span><p>{t(caseFile.allegation)}</p><div className="hd-verdict-checks">
                  <span className={inspected.length === 3 ? 'hd-check-done' : ''}><MarkIcon name="check" size={16}/>{t({ ar: 'فحص المستندات', en: 'Records inspected' })} {inspected.length}/3</span>
                  <span className={officialCount === 2 ? 'hd-check-done' : ''}><MarkIcon name="check" size={16}/>{t({ ar: 'الأدلة الموثوقة', en: 'Reliable evidence' })} {officialCount}/2</span>
                  <span className={rejected ? 'hd-check-done' : ''}><MarkIcon name="check" size={16}/>{t({ ar: 'الادعاء المستبعد', en: 'Unsourced claim' })}</span>
                  {caseFile.timeline && <span className={chronologicalDone ? 'hd-check-done' : ''}><MarkIcon name="clock" size={16}/>{t({ ar: 'ترتيب الأحداث', en: 'Chronology' })}</span>}
                </div></div>
                <div className="hd-verdict-options" role="group" aria-label={t({ ar: 'القرار النهائي', en: 'Final verdict' })}>
                  {verdicts.map(item => <button key={item.id} type="button" aria-pressed={verdict === item.id} onClick={() => { setVerdict(item.id); setIssues([]); }}
                    className={'hd-verdict-choice hd-verdict-' + item.id + (verdict === item.id ? ' hd-verdict-choice-selected' : '')}>
                    <span className="hd-verdict-graphic"><MarkIcon name="seal" size={34}/></span><strong>{t(item.label)}</strong><small>{t(item.tag)}</small>
                  </button>)}
                </div></div>
                <div className="hd-detective-note"><div className="hd-note-head"><MarkIcon name="file" size={23}/><div><strong>{t({ ar: 'ملاحظة المحقق', en: "DETECTIVE'S NOTE" })}</strong><small>{t(caseFile.reasoningPrompt)}</small></div></div><textarea id="hd-reason" value={reason} maxLength={1200} rows={3}
                  onChange={event => { setReason(event.target.value.slice(0, 1200)); setIssues([]); }}
                  aria-label={t({ ar: 'سجل ملاحظتك', en: 'Write your case note' })}
                  placeholder={t({ ar: 'اكتشفت أن... والدليل من مصدر... لأن...', en: 'I discovered that... The evidence from... shows...' })}/><span className="hd-note-count">{reason.trim().length} / 25 {t({ ar: 'حرفًا للحد الأدنى', en: 'characters minimum' })}</span></div>
                {issues.length > 0 && <div role="alert" className="hd-issues"><strong>{t({ ar: 'المحقق يحتاج يراجع شوية خيوط:', en: 'A few clues need a second look:' })}</strong><ul>{issues.map((issue, position) => <li key={position}>{issue}</li>)}</ul><button type="button" className="hd-secondary" onClick={() => setStage('evidence')}>{t({ ar: 'ارجع لمعمل الأدلة', en: 'Review the records' })}</button></div>}
                <button type="button" className="hd-cta hd-final-cta" onClick={verify}><MarkIcon name="seal" size={27}/>{t({ ar: 'اكشف الحقيقة وأغلق القضية', en: 'Reveal the truth and close the case' })}<MarkIcon name="arrow" size={22}/></button>
              </> : <div className="hd-success" role="status" aria-live="polite"><div className="hd-success-sparks" aria-hidden="true"/><span className="hd-success-medal"><MarkIcon name="seal" size={79}/></span><span className="hd-kicker">{t({ ar: 'المهمة أُنجزت', en: 'MISSION ACCOMPLISHED' })}</span><h3>{t({ ar: 'تم كشف الحقيقة!', en: 'The truth is uncovered!' })}</h3><p>{t(caseFile.conclusion)}</p><small>{t({ ar: 'سُجل إنجاز القضية. تظل ملاحظة المحقق في جلسة اللعب الحالية فقط.', en: 'Case completion saved. Your case note remains in this play session only.' })}</small></div>}
                <div className="hd-stage-bottom"><button type="button" className="hd-secondary" onClick={() => setSelectedCase(null)}>{t({ ar: 'العودة لغرفة القضايا', en: 'Return to case room' })}</button>{selectedCase < heritageInvestigations.length - 1 && <button type="button" className="hd-cta" onClick={() => openCase(selectedCase + 1)}>{t({ ar: 'القضية التالية', en: 'Next investigation' })}<MarkIcon name="arrow" size={19}/></button>}</div>
              </div>}
          </div>
        </div>
      )}
    </section>
  );
};
export default HeritageDetectiveGame;
