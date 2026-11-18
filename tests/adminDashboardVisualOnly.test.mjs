import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=(file)=>readFileSync(new URL('../'+file,import.meta.url),'utf8');
const admin=read('pages/AdminDashboard.tsx');
const visuals=read('src/components/AdminExecutiveCharts.tsx');

test('all ten existing administration sections remain available',()=>{
 for(const id of ['overview','reports','analytics','attendance','reading','library','add-books','children','orison','management']){
  assert.ok(admin.includes("id:'"+id+"'"),'Missing navigation item: '+id);
  assert.ok(admin.includes("activeSection === '"+id+"'"),'Missing page section: '+id);
 }
 assert.match(admin,/navigationGroups\.map\(group=>/);
 assert.match(admin,/dashboardSections\.filter\(matchingSection\)/);
 assert.match(admin,/switchAdminSection\(item\.id\)/);
});
test('all existing components and management action handlers still exist',()=>{
 for(const component of ['AdminCatalogManager','AdminPeriodReports','AdminInsightsPanels','AdminLibraryAttendance',
   'AdminReadingChallenge','AdminChildrenReadingReview','AdminOrisonInventoryReview',
   'AdminSaqrProviderMetrics','AdminUserFeaturePermissions']){
   assert.ok(admin.includes('<'+component+' ')||admin.includes('<'+component+'/'),'Missing admin component: '+component);
 }
 for(const fn of ['fetchRealDashboardData','handlePrintDashboardReport','toggleTheme','handleAccountAccess',
  'handleReturnBook','handleRejectRequest','handleSubmitForm','refreshBorrowingsOnly']){
  assert.ok(admin.includes(fn),'Original action missing: '+fn);
 }
});
test('new charts consume only original dashboard metrics',()=>{
 assert.match(admin,/<AdminExecutiveCharts/);
 for(const value of ['physical={physicalCatalogCount}','arabic={arabicDigitalCoreCount}',
 'english={englishDigitalCount}','nationalDigital={nationalDigitalCount}',
 'logins={loginActivity}','operations={libraryImpact}','digitalAvailable={digitalBookReadStatsAvailable}'])
  assert.ok(admin.includes(value),'Wrong visualization source: '+value);
 for(const chart of ['PieChart','AreaChart','BarChart','ResponsiveContainer'])assert.ok(visuals.includes(chart));
 assert.doesNotMatch(visuals,/\bsupabase\b|\bfetch\(/);
});
test('original reports and protected user management remain',()=>{
 assert.match(admin,/<details className="efips-admin-section-details/);
 assert.match(admin,/\{activeSection === 'reports'/);
 assert.match(admin,/\.from\('students'\)/);
 assert.match(admin,/\.from\('teachers'\)/);
 assert.match(admin,/\.from\('login_logs'\)/);
 assert.match(admin,/\.from\('lesson_reports'\)/);
 assert.match(admin,/<AdminUserFeaturePermissions/);
});
