import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';

const read=path=>readFileSync(path,'utf8');
const access=read('src/utils/efipsFeatureAccess.ts');
const header=read('App.tsx').split('const Header: React.FC = () => {')[1].split('// -------- 3.')[0];
const orbit=read('src/components/SaqrOrbitNavigation.tsx');
const css=read('src/components/SaqrOrbitNavigation.css');
const home=read('pages/HomePage.tsx');
const gate=read('src/components/SchoolFeatureRoute.tsx');
const backend=read('supabase/functions/efips-feature-access/index.ts');

test('One authenticated permission request shared by header, orbit and route',()=>{
  assert.match(access,/let pending:\{token:string;promise:Promise<SchoolFeatureAccess>\}\|null=null/);
  assert.match(access,/if\(pending\?\.token===token\)return pending\.promise/);
  assert.match(access,/const CACHE_MS=30_000/);
  assert.match(access,/getCachedSchoolFeatureAccess\(\)/);
  assert.match(access,/supabase\.auth\.onAuthStateChange/);
  assert.match(access,/event==='SIGNED_OUT'/);
  assert.match(access,/authGeneration!==version/);
  assert.match(access,/auth\.getSession\(\)/);
  assert.match(access,/functions\.invoke\('efips-feature-access'/);
  assert.doesNotMatch(access,/localStorage|sessionStorage|service_role/i);
  assert.match(backend,/auth\.auth\.getUser\(token\)/);
  assert.match(backend,/efips_google_staff_accounts/);
});

test('Top navbar keeps verified per-user filtering but no staggered entrance',()=>{
  assert.match(header,/getCachedSchoolFeatureAccess\(\)\?\.features/);
  assert.match(header,/getSchoolFeatureAccess\(force\)/);
  assert.match(header,/const onFocus = \(\) => refresh\(true\)/);
  assert.match(header,/headerFeatures\[headerService\[link.path\]\]===true/);
  assert.match(header,/userRole==='admin'/);
  assert.doesNotMatch(header,/animate-fade-in-up|animationDelay:/);
  assert.match(header,/window\.addEventListener\('scroll', onScroll, \{ passive: true \}\)/);
  assert.match(header,/window\.requestAnimationFrame\(update\)/);
});

test('Saqr bubbles paint as soon as verified, no double permission check and no observer hiding',()=>{
  assert.match(orbit,/useState<SchoolFeatureAccess \| null>\(getCachedSchoolFeatureAccess\)/);
  assert.match(orbit,/schoolAccess\.features\[feature\]===true/);
  assert.match(orbit,/getSchoolFeatureAccess\(force\)/);
  assert.match(orbit,/getSchoolFeatureAccess\(true\)/);
  assert.doesNotMatch(orbit,/new IntersectionObserver|saqr-orbit-motion-ready|setLearningAllowed|--reveal-delay|getSaqrLearningAccess\(/);
  assert.doesNotMatch(css,/\.saqr-orbit-stage\.saqr-orbit-motion-ready/);
  assert.doesNotMatch(css,/transition: opacity \.58s|--reveal-delay/);
  assert.match(css,/\.saqr-orbit-bubble\s*\{[\s\S]*?opacity: 1;/);
  assert.match(css,/animation: saqr-orbit-sphere-float/);
  assert.match(css,/\.saqr-orbit-bubble:hover/);
  assert.match(css,/@media \(prefers-reduced-motion:reduce\)/);
  assert.doesNotMatch(home,/<RevealSection delay=\{210\}>/);
  assert.match(home,/<SaqrOrbitNavigation isAr=\{isAr\}/);
  // Other homepage reveal sections, news ribbon and role-appropriate navigation remain intact.
  assert.match(home,/<RevealSection delay=\{200\}>/);
  assert.match(home,/data-news-paused=\{newsPaused\}/);
});

test('Sensitive routes remain fail closed and refresh on focus without escalating role',()=>{
  assert.match(gate,/getSchoolFeatureAccess\(force\)/);
  assert.match(gate,/const onFocus=\(\)=>check\(true\)/);
  assert.match(gate,/status==='denied'/);
  assert.match(gate,/<Navigate to="\/home" replace\/>/);
  assert.doesNotMatch(gate,/getCachedSchoolFeatureAccess/);
  assert.match(orbit,/schoolAccess\.role === 'admin'/);
  assert.doesNotMatch(orbit,/localStorage\.getItem\('user_type'\)/);
  assert.match(backend,/if\(who\.role!=="admin"\)/);
});
