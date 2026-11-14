import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const app = readFileSync('App.tsx', 'utf8');
const landing = readFileSync('pages/NationalIdentityPage.tsx', 'utf8');
const anthem = readFileSync('pages/NationalAnthemChallengePage.tsx', 'utf8');
const convert = readFileSync('src/utils/podcastMp3.ts', 'utf8');
const anthemStyles = readFileSync('pages/nationalAnthemChallenge.css', 'utf8');
const identityStyles = readFileSync('pages/nationalIdentityLanding.css', 'utf8');

const permissions = readFileSync('src/utils/nationalIdentityAccess.ts', 'utf8');

assert.ok(app.includes('path="/saqr-national-identity/anthem"'));
assert.ok(app.includes('<NationalIdentityRoute><NationalAnthemChallengePage /></NationalIdentityRoute>'),
  'National anthem access must match the existing student/admin/HR040 identity challenge');
assert.ok(landing.includes('to="/saqr-national-identity/anthem"'));
assert.ok(landing.includes('تحدي صوت الاتحاد') && landing.includes('Voice of the Union'));
assert.ok(permissions.includes('HR040') && permissions.includes("role === 'student'") && permissions.includes("role === 'admin'"));
assert.ok(anthem.includes('canAccessNationalIdentity(') && anthem.includes('<Navigate to="/home" replace />'));
assert.ok(anthem.includes('navigator.mediaDevices.getUserMedia('), 'Recording must ask for microphone permission');
assert.ok(anthem.includes('ctx.createMediaStreamDestination()'), 'Use real-time audio graph to merge voice and music');
assert.ok(anthem.includes('voice.connect(micGain)') && anthem.includes('micGain.connect(mixed)'));
assert.ok(anthem.includes('music.connect(backingGain)') && anthem.includes('backingGain.connect(mixed)'));
assert.ok(anthem.includes('backingGain.connect(ctx.destination)'), 'Student must hear accompaniment while recording');
assert.ok(anthem.includes('recordingToMp3(captured)') && convert.includes('new lamejs.Mp3Encoder('),
  'Recorded mix must really encode MPEG Layer III, not only rename a WebM recording');
assert.ok(anthem.includes('download="EFIPS-Voice-of-the-Union.mp3"'));
assert.ok(anthem.includes('new Blob(chunks') && anthem.includes('ondataavailable'));
assert.ok(anthem.includes('audioBuffer.current') && anthem.includes('music.onended'), 'Song should stop at track end');
assert.ok(anthem.includes('URL.revokeObjectURL(fileUrl.current)'));
assert.ok(anthem.includes('URL.revokeObjectURL(resultUrl.current)'));
assert.ok(anthem.includes('getUserMedia({') && anthem.includes('getAudioContext()'), 'Audio capture stays in the browser');
assert.ok(!anthem.includes('.storage.from(') && !anthem.includes('.insert(') && !anthem.includes('.upload('),
  'Student voice must remain on the device by default');
assert.ok(anthem.includes('UAE_national_anthem.ogg'));
assert.ok(anthem.includes('File:UAE_national_anthem.ogg'));
assert.ok(anthem.includes('https://www.protocol.dubai.ae/'));
console.log('PASS: UAE anthem route, microphone, mixing, privacy, and true MP3 download');

assert.ok(anthem.includes("import './nationalIdentityLanding.css'"), 'Reuse National Identity visual language');
assert.ok(anthem.includes("import './nationalAnthemChallenge.css'"), 'Apply scoped responsive Singer layout');
assert.ok(anthem.includes('className="national-heritage nh-v2 nh-anthem-page'), 'Use national identity page layout');
assert.ok(anthem.includes('className="nh-hero nh-v2-hero nh-anthem-hero'), 'Reuse National Identity emerald hero');
assert.ok(anthem.includes('src="/SAQR%20Singer.png"'), 'Show existing SAQR Singer artwork as hero');
assert.ok(anthem.includes('nh-anthem-singer'), 'Apply responsive artwork fit');
assert.ok(anthemStyles.includes('.nh-anthem-singer') && anthemStyles.includes('@media(max-width:660px)'));
assert.ok(identityStyles.includes('.nh-v2-hero-grid'), 'Shared layout must exist');
assert.ok(anthem.includes("t('مصادر النشيد','Anthem sources')"), 'Rename source panel after removal of privacy text');
assert.ok(!anthem.includes('الصوت يُسجَّل ويُخلَط محليًا في متصفحك.'), 'Hide requested Arabic privacy note');
assert.ok(!anthem.includes('Your voice is recorded and mixed locally in your browser.'), 'Hide requested English privacy note');
assert.ok(anthem.includes('recordingToMp3(captured)'), 'The recording/download functionality must stay intact');

assert.ok(landing.includes('xl:grid-cols-3'), 'The National Identity landing cards should use three columns on large screens');
assert.ok(identityStyles.includes('grid-template-columns:repeat(3,minmax(0,1fr))'), 'Desktop challenge grid is exactly three columns');
assert.ok(identityStyles.includes('grid-template-columns:repeat(2,minmax(0,1fr))'), 'Tablet challenge grid retains two columns');
assert.ok(identityStyles.includes('grid-template-columns:1fr;gap:16px'), 'Mobile challenge grid stays one column');
assert.ok(anthem.includes('nh-anthem-actionbar'), 'Keep recording controls grouped for narrow screens');
assert.ok(anthem.includes('nh-anthem-equalizer') && anthem.includes('data-active={busyRecording}'), 'Meter animates only while singing');
assert.ok(anthem.includes("transform: 'scaleX(' + ratio / 100"), 'Recording progress uses compositor transform, not width reflow');
assert.ok(anthem.includes('}, 300);'), 'Throttle visual progress updates without changing audio capture');
assert.ok(anthemStyles.includes('nh-anthem-meter') && anthemStyles.includes('[data-active="true"] i'), 'Keep tiny recording-only effect');
assert.ok(anthemStyles.includes('@media(max-width:860px)') && anthemStyles.includes('grid-template-columns:minmax(0,1fr)'), 'Tablet-sized studio stacks');
assert.ok(anthemStyles.includes('@media(max-width:660px)') && anthemStyles.includes('.nh-anthem-actionbar'), 'Phone buttons become full width');
assert.ok(anthemStyles.includes('env(safe-area-inset-bottom)'), 'Allow mobile safe area in portrait');
assert.ok(anthemStyles.includes('prefers-reduced-motion:reduce'), 'Respect reduced-motion preference');
assert.ok(anthemStyles.includes('animation:none;') && anthemStyles.includes('.nh-v2-art-orbit'), 'Eliminate persistent rotating decorative orbits');
assert.ok(anthemStyles.includes('filter:none;') && anthemStyles.includes('.nh-v2-art-glow'), 'Avoid live blurred backdrops on phones');
assert.ok(anthem.includes('recordingToMp3(captured)') && anthem.includes('getUserMedia({') && anthem.includes('download="EFIPS-Voice-of-the-Union.mp3"'), 'MP3/microphone functionality stays unchanged');
console.log('PASS: responsive 3/2/1 identity cards and efficient Safari/mobile anthem visuals');
