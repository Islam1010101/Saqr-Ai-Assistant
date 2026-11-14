import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const app = readFileSync('App.tsx', 'utf8');
const home = readFileSync('pages/HomePage.tsx', 'utf8');
const other = [
  'pages/TutorialPage.tsx',
  'pages/ArabicLibraryInternalPage.tsx',
  'pages/EnglishLibraryInternalPage.tsx',
  'pages/DigitalLibraryPage.tsx',
].map(file => [file, readFileSync(file, 'utf8')] as const);

assert.ok(app.includes("window.addEventListener('scroll', onScroll, { passive: true })"), 'Scroll listeners must be passive');
assert.ok(app.includes('scrollFrameRef.current = window.requestAnimationFrame(update)'), 'Throttled nav scroll state');
assert.ok(app.includes('window.cancelAnimationFrame(scrollFrameRef.current)'), 'Cancel pending scroll frames');
assert.ok(app.includes('setIsVisible(visible => visible === shouldShow ? visible : shouldShow)'), 'Render navbar only on show/hide transition');
assert.ok(!app.includes('setLastScrollY('), 'ScrollY must not live in React state');
assert.ok(app.includes('lastScrollYRef.current'), 'Keep previous Y in a ref');
assert.ok(app.includes('.efips-navbar-surface'), 'Scope mobile fixed backdrop optimization');
assert.ok(app.includes('-webkit-backdrop-filter: none !important'), 'Disable fixed nav blur on touch hardware');
assert.ok(app.includes("background-color: rgba(255,255,255,.96)"), 'Preserve readable light-mode navbar');
assert.ok(app.includes("background-color: rgba(15,23,42,.96)"), 'Preserve readable dark-mode navbar');

assert.ok(home.includes('const BorrowingReturnStatus:'), 'Borrowing clock has a local React state');
assert.ok(home.includes('<BorrowingReturnStatus returnDate={returnDate} isAr={isAr}'), 'Each active borrowing retains countdown');
assert.ok(home.includes('document.addEventListener(\'visibilitychange\', tick)'), 'Clock refreshes after tab resumes');
assert.ok(home.includes('role="status"'), 'Borrowing reminder preserved');
assert.ok(!home.includes('setBorrowCountdownNow'), 'No one-second whole-homepage re-render');
assert.ok(home.includes("window.setInterval(tick, 1000)"), 'Live countdown still ticks every second');
assert.ok(home.includes('teacherSchedule.length > 0'), 'Teacher schedule remains available');

for (const [name, source] of [['pages/HomePage.tsx', home] as const, ...other]) {
  assert.ok(source.includes("rootMargin: '160px 0px 160px 0px'"), name+' reveals before entering viewport');
  assert.ok(source.includes('if (entry.isIntersecting)'), name+' observes intersection');
  assert.ok(source.includes('observer.disconnect()'), name+' reveal only once');
  assert.ok(source.includes('else if (!entered)'), name+' does not hide content on scroll-back');
}

const digital=readFileSync('pages/DigitalLibraryPage.tsx', 'utf8');
assert.ok(digital.includes('.efips-digital-ambient .animate-blob { animation: none !important; }'),
  'Reduce giant blurred background animation on touch devices');
assert.ok(digital.includes('bg-emerald-400/20') && digital.includes('bg-sky-400/20'),
  'Preserve original digital-library background colors');
assert.ok(app.includes('<Routes>') && app.includes('<Route path="/home"'), 'Routing stays intact');
const search = readFileSync('pages/SearchPage.tsx', 'utf8');
const creators = readFileSync('pages/CreatorsPortalPage.tsx', 'utf8');
const orbit = readFileSync('src/components/SaqrOrbitNavigation.css', 'utf8');
const tutorialVisual = readFileSync('src/components/EFIPSGlassVisualTheme.css', 'utf8');
assert.ok(app.includes('Math.abs(currentY - previousY) < 18'),
  'Navbar hides/shows after a meaningful scroll direction change, not trackpad jitter');
assert.ok(app.includes('.tutorial-topbar') && app.includes('backdrop-filter: none !important'),
  'Desktop and mobile fixed navigation surfaces do not re-blur every scroll frame');
assert.ok(orbit.includes('backdrop-filter: none;') && !orbit.includes('backdrop-filter: blur(13px)'),
  'Animated orbit bubbles keep gradients without live backdrop blur');
assert.ok(tutorialVisual.includes('backdrop-filter: none;'),
  'Tour bubbles avoid live blur while preserving their glass fills');
assert.ok(search.includes('window.requestAnimationFrame(updateSearchVisibility)') &&
  search.includes('window.cancelAnimationFrame(scrollFrame)') &&
  search.includes('setShowSearch(visible => visible === shouldShow ? visible : shouldShow)'),
  'Catalog scroll controls throttle and clean up frames without redundant React updates');
assert.ok(creators.includes('window.requestAnimationFrame(updateVisibility)') &&
  creators.includes('window.cancelAnimationFrame(scrollFrame)') &&
  creators.includes('setIsVisible(visible => visible === shouldShow ? visible : shouldShow)'),
  'Creators navigation uses the same stable, passive scroll behavior');
assert.ok(home.includes('Math.min(delay, 80)') && home.includes('transition-[opacity,transform] duration-300'),
  'Homepage reveal keeps motion short and avoids heavy scaling');

console.log('PASS: scroll event throttling, countdown isolation, once-only reveals, Safari compositing and preserved features');
