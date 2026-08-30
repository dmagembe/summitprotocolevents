import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const base = 'file:///' + __dirname.replace(/\\/g, '/') + '/';
const pages = ['index.html', 'about.html', 'services.html', 'gallery.html', 'booking.html', 'contact.html'];

const viewports = [
  { name: 'iPhone SE', width: 375, height: 667 },
  { name: 'iPhone 14', width: 390, height: 844 },
  { name: 'iPhone 14 Pro Max', width: 430, height: 932 },
  { name: 'iPad Mini', width: 768, height: 1024 },
  { name: 'iPad Air', width: 820, height: 1180 },
  { name: 'iPad Landscape', width: 1024, height: 768 },
  { name: 'Laptop', width: 1280, height: 800 },
  { name: 'Desktop', width: 1440, height: 900 },
];

const browser = await chromium.launch();
const issues = [];

for (const vp of viewports) {
  const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await context.newPage();

  for (const file of pages) {
    const url = `${base}/${file}`;
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(600);

      const result = await page.evaluate(() => {
        const doc = document.documentElement;
        const overflowX = doc.scrollWidth - doc.clientWidth;
        const offenders = [];

        document.querySelectorAll('body *').forEach((el) => {
          if (!(el instanceof HTMLElement)) return;
          const rect = el.getBoundingClientRect();
          if (rect.width < 2 || rect.height < 2) return;
          const style = getComputedStyle(el);
          if (style.position === 'fixed' || style.visibility === 'hidden' || style.display === 'none') return;
          if (el.classList.contains('skip-link')) return;
          const right = rect.right;
          const left = rect.left;
          const vw = window.innerWidth;
          if (right > vw + 2) {
            offenders.push({
              tag: el.tagName.toLowerCase(),
              cls: (el.className || '').toString().slice(0, 80),
              overflow: Math.round(right - vw),
            });
          }
          if (left < -2) {
            offenders.push({
              tag: el.tagName.toLowerCase(),
              cls: (el.className || '').toString().slice(0, 80),
              overflow: Math.round(Math.abs(left)),
              side: 'left',
            });
          }
        });

        const nav = document.getElementById('mainNav');
        const hamburger = document.getElementById('hamburgerBtn');
        const mobileBar = document.getElementById('mobileBar');
        const fab = document.querySelector('.fab-wa');

        let navOverlap = false;
        if (nav && hamburger && getComputedStyle(hamburger).display !== 'none') {
          const nb = nav.querySelector('.nav__brand')?.getBoundingClientRect();
          const hb = hamburger.getBoundingClientRect();
          if (nb && hb.width > 0 && hb.left < nb.right + 4) navOverlap = true;
        }

        let fabBarOverlap = false;
        if (fab && mobileBar) {
          const fb = fab.getBoundingClientRect();
          const mb = mobileBar.getBoundingClientRect();
          if (getComputedStyle(mobileBar).display !== 'none' && fb.bottom > mb.top - 4) fabBarOverlap = true;
        }

        const tinyText = [];
        document.querySelectorAll('h1, h2, .nav__name, .btn').forEach((el) => {
          const fs = parseFloat(getComputedStyle(el).fontSize);
          if (fs > 0 && fs < 11) tinyText.push({ cls: el.className, fs });
        });

        return {
          overflowX,
          offenders: offenders.slice(0, 5),
          navOverlap,
          fabBarOverlap,
          hasH1: !!document.querySelector('h1'),
          mobileMenuWorks: !!hamburger,
          stickyVisible: mobileBar ? getComputedStyle(mobileBar).display !== 'none' : false,
          tinyText,
        };
      });

      if (result.overflowX > 2) {
        issues.push({ vp: vp.name, page: file, type: 'horizontal-scroll', px: result.overflowX, offenders: result.offenders });
      }
      if (result.navOverlap) {
        issues.push({ vp: vp.name, page: file, type: 'nav-brand-hamburger-overlap' });
      }
      if (result.fabBarOverlap) {
        issues.push({ vp: vp.name, page: file, type: 'fab-overlaps-mobile-bar' });
      }
      if (!result.hasH1) {
        issues.push({ vp: vp.name, page: file, type: 'missing-h1' });
      }
    } catch (err) {
      issues.push({ vp: vp.name, page: file, type: 'load-error', msg: String(err.message || err) });
    }
  }

  await context.close();
}

await browser.close();

if (!issues.length) {
  console.log('PASS: No responsive issues detected across', viewports.length, 'viewports and', pages.length, 'pages.');
} else {
  console.log('ISSUES FOUND:', issues.length);
  for (const i of issues) console.log(JSON.stringify(i));
  process.exit(1);
}
