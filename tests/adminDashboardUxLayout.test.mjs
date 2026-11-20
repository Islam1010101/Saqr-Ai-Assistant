import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const dashboard=read('pages/AdminDashboard.tsx');

test('Administration navigation preserves every existing module with grouped search and mobile access',()=>{
 for(const section of ['overview','reports','analytics','attendance','reading','library','add-books','children','orison','management'])
  assert.ok(dashboard.includes("id:'"+section+"'"),'Missing admin module '+section);
 for(const feature of ['navigationGroups','priorityActions','shortcutGroups','sectionGroup','relatedSections',
  'efips-admin-mobile-search','efips-admin-sidebar-search','switchAdminSection(item.id)',
  "key:'reviews'","key:'catalog'","key:'operations'","key:'insights'"])
  assert.ok(dashboard.includes(feature),'Missing navigation feature '+feature);
 assert.ok(dashboard.includes('aria-label={isAr?'), 'Accessible bilingual labels');
});

test('Existing reports, real charts, verified data sources and admin actions remain wired',()=>{
 for(const component of ['<AdminExecutiveCharts','<AdminInsightsPanels','<AdminPeriodReports',
   '<AdminSaqrProviderMetrics','<AdminReadingChallenge','<AdminLibraryAttendance',
   '<AdminCatalogManager','<AdminChildrenReadingReview','<AdminOrisonInventoryReview',
   '<AdminUserFeaturePermissions'])
  assert.ok(dashboard.includes(component),'Lost embedded admin feature '+component);
 for(const action of ['handleInstantApprove','handleRejectRequest','handleReturnBook',
  'handleAccountAccess','fetchRealDashboardData','refreshBorrowingsOnly','handleSubmitForm',
  'handlePrintDashboardReport','getDefaultReturnDate','isActiveBorrowing',
  "table: 'borrowings'","table: 'book_views'","table: 'login_logs'"])
  assert.ok(dashboard.includes(action),'Lost existing behavior '+action);
 assert.ok(dashboard.includes('priorityActions.map'),'Data-backed priority indicators are visible');
 assert.ok(dashboard.includes('AdminExecutiveCharts'),'Existing Recharts infographics are preserved');
});

test('Arabic admin copy is formal and English variants are US English',()=>{
 const adminFiles=[
  'pages/AdminDashboard.tsx',
  'src/components/AdminCatalogManager.tsx',
  'src/components/AdminPeriodReports.tsx',
  'src/components/AdminSaqrProviderMetrics.tsx',
  'src/components/AdminUserFeaturePermissions.tsx'
 ].map(read);
 for(const text of adminFiles)
  for(const colloquial of ['ملوش','سيبه فاضي','مش باركود','امسحه','الاسم بالعربي','الأدمن','جاري تحميل','الإيميل'])
   assert.ok(!text.includes(colloquial),'Colloquial admin text still present: '+colloquial);
 assert.ok(dashboard.includes("lang={isAr?'ar':'en-US'}"));
 assert.ok(dashboard.includes("Library Administration"));
 assert.ok(dashboard.includes("Book Catalog Management"));
});

test('Scope remains presentational: no authorization or account role changes',()=>{
 assert.ok(dashboard.includes('const [isAdmin,'));
 assert.ok(dashboard.includes('if (isAdmin === false)'));
 assert.ok(dashboard.includes('staffRoleDirectory'));
 assert.ok(dashboard.includes("value=\"teacher\""));
 assert.ok(dashboard.includes("value=\"admin\""));
});
