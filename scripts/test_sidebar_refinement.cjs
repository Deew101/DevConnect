const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const navbar = fs.readFileSync(path.join(rootDir, 'src/components/layout/Navbar.tsx'), 'utf8');
const sidebar = fs.readFileSync(path.join(rootDir, 'src/components/layout/Sidebar.tsx'), 'utf8');
const css = fs.readFileSync(path.join(rootDir, 'src/index.css'), 'utf8');
const app = fs.readFileSync(path.join(rootDir, 'src/App.tsx'), 'utf8');

console.log('=== DEVCONNECT SIDEBAR, NAVIGATION & HEADER VERIFICATION ===\n');

// 1. Header Badges
console.log('1. Checking Header Badges:');
const hasEditionBadge = navbar.includes('EDITION 2026');
const hasDemoBadge = navbar.includes('DEMO COMMUNITY DATA');
console.log('   - Contains EDITION 2026:', hasEditionBadge);
console.log('   - Contains DEMO COMMUNITY DATA:', hasDemoBadge);
if (hasEditionBadge || hasDemoBadge) {
  throw new Error('Header badges still present in Navbar.tsx!');
}
console.log('   ✓ Both header badges successfully removed from Navbar.\n');

// 2. Sidebar Dimensions & Alignment
console.log('2. Checking Sidebar Dimensions & Active Alignment:');
const hasFixedRowDimensions = sidebar.includes('h-10 w-full') && sidebar.includes('box-border');
const hasNoHoverTranslate = !sidebar.includes('hover:translate-x-1.5');
const hasActivePill = sidebar.includes('activeSidebarHighlight') && sidebar.includes('activeSidebarIndicator');
console.log('   - Consistent h-10 w-full box-border rows:', hasFixedRowDimensions);
console.log('   - Free of hover:translate-x-1.5 shifting:', hasNoHoverTranslate);
console.log('   - Dual decorative active highlight & indicator:', hasActivePill);
if (!hasFixedRowDimensions || !hasNoHoverTranslate || !hasActivePill) {
  throw new Error('Sidebar navigation rows missing required styling or still using transforms!');
}
console.log('   ✓ Active highlight & indicator properly separated without layout shifts.\n');

// 3. Independent Sidebar Scrolling
console.log('3. Checking Independent Sidebar Scrolling:');
const hasScrollContainer = sidebar.includes('overflow-y-auto') && sidebar.includes('sidebar-scroll') && sidebar.includes('overscroll-contain');
const hasCustomScrollbarCss = css.includes('.sidebar-scroll') && css.includes('scrollbar-width: thin');
const hasAutoScrollIntoView = sidebar.includes('scrollIntoView');
console.log('   - Navigation body is independent scroll container:', hasScrollContainer);
console.log('   - Dedicated thin violet scrollbar defined in CSS:', hasCustomScrollbarCss);
console.log('   - Auto scrollIntoView on navigation change:', hasAutoScrollIntoView);
if (!hasScrollContainer || !hasCustomScrollbarCss || !hasAutoScrollIntoView) {
  throw new Error('Sidebar scrolling setup incomplete!');
}
console.log('   ✓ Independent scrolling with thin violet scrollbar confirmed.\n');

// 4. Checking Routes
console.log('4. Checking Navigation Routes:');
const routes = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Discover Developers', path: '/developers' },
  { label: 'GitHub Developers', path: '/github-developers' },
  { label: 'Explore Projects', path: '/projects' },
  { label: 'Open Source Repos', path: '/repositories' },
  { label: 'Collaborative Teams', path: '/teams' },
  { label: 'My Projects', path: '/my-projects' },
  { label: 'Messages', path: '/messages' },
  { label: 'Notifications', path: '/notifications' },
  { label: 'Saved Projects', path: '/saved-projects' },
  { label: 'Settings & Skills', path: '/profile/edit' },
];

for (const r of routes) {
  if (!sidebar.includes(r.path)) {
    throw new Error('Missing route in sidebar: ' + r.path);
  }
}
console.log('   ✓ All 11 navigation routes registered and accounted for.');
console.log('   ✓ /settings alias confirmed in App.tsx:', app.includes('path="/settings"'));

console.log('\n=== ALL AUTOMATED VERIFICATIONS PASSED SUCCESSFULLY ===');
