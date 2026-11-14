import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const app = readFileSync('App.tsx', 'utf8');
const landing = readFileSync('pages/NationalIdentityPage.tsx', 'utf8');
const anthem = readFileSync('pages/NationalAnthemChallengePage.tsx', 'utf8');
const convert = readFileSync('src/utils/podcastMp3.ts', 'utf8');
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
