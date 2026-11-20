/* how this page's tokens line up with the shared tweak palettes.
   The page's own two schemes are the dock's Copperplate (dark) and Porcelain (light): its tokens are those palettes, role for role,
   the same as Copperplate · Runs. */
window.TWEAK_PAGE = {
  key: 'gimorra-console-copperplate',
  modes: ['dark', 'light'], /* the page ships both, through light-dark() tokens */
  /* no data-theme yet means the page is following the system */
  getMode: () => { const t = document.documentElement.getAttribute('data-theme'); return t === 'dark' || t === 'light' ? t : matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'; },
  setMode: m => { document.documentElement.setAttribute('data-theme', m); try { localStorage.setItem('gl-theme', m); } catch (e) {} },
  /* corners scale the radius tokens; density scales the card padding, the table cell padding and the space between bands */
  /* one level past compact: tight. The page also shortens its plates with --tw-d */
  density: { tight: .5, compact: .72, default: 1, relaxed: 1.32 },
  sans: '--sans', mono: '--mono', scale: { r: ['--r-panel', '--r-ctl', '--r-pill'], d: ['--pad-card', '--cell', '--band'] },
  chrome: { bg: 'var(--bg-raised)', fg: 'var(--text-1)', dim: 'var(--text-dim)', line: 'var(--border-2)', hover: 'var(--bg-hover)', accent: 'var(--accent-fg)' },
  accentOwn: { dark: '#78d670', light: '#516e47' },
  /* the page's own colours in palette order (app surf raised inset hover line line2 text text2 dim green red yellow blue magenta warn); used for glass */
  own: {
    dark: '18140e 211b14 2b241a 18130e 342c1f 413724 5e4d34 ead9c0 c0a989 a9987e a4c26f e0705a d8a24a 8aa8bd c98da4 cf8236',
    light: 'efece8 fbf9f6 ffffff f4f1ec e9e5df ddd8d0 c2bab0 33302b 5e5951 6e6960 3d8b3d c53a3a a37414 3565c0 ad3d8d bb6a1e',
  },
  map: (p, mix) => ({
    '--bg-app': p.app, '--bg-terminal': p.surf, '--bg-raised': p.raised, '--bg-inset': p.inset, '--bg-hover': p.hover,
    '--border-1': p.line, '--border-2': p.line2, '--text-1': p.text, '--text-2': p.text2, '--text-dim': mix(p.text2, 60, p.dim), /* the page's dim is label text, so it sits nearer the body colour than a palette's faintest step */
    /* the semantic hues follow the theme: pills, status text, dots, and the severity ramp built from red and orange.
       The verdict and job-status colours (--vd-*, --js-wait) keep the values that were checked as a set */
    '--green': p.green, '--red': p.red, '--yellow': p.yellow, '--blue': p.blue, '--orange': p.warn,
  }),
  /* the accent drives the headline, the pressed tabs, the cursor, the lit dots and the focus ring, through --accent-fg, -fill and -soft */
  accent: c => ({ '--accent': c }),
  gutter: { own: 'boxed', css: 'html[data-tw-gutter="full-width"] :is(.main,.nav-inner,.foot){max-width:none}' },
  glass: '.tip, .toast', /* only boxes that float over other content */
};
