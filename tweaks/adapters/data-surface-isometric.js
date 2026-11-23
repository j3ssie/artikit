/* how this page's tokens line up with the shared tweak palettes.
   The page's tokens are the sixteen palette roles under other names; the rack faces, platform ground and chips are mixed from them in the page's CSS, so they follow. */
window.TWEAK_PAGE = {
  key: 'surface-isometric',
  modes: ['light', 'dark'], /* the page ships both, through light-dark() tokens */
  /* no data-theme yet means the page is following the system */
  getMode: () => { const t = document.documentElement.getAttribute('data-theme'); return t === 'dark' || t === 'light' ? t : matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; },
  setMode: m => { document.documentElement.setAttribute('data-theme', m); try { localStorage.setItem('surface-theme', m); } catch (e) {} },
  sans: '--sans', mono: '--mono', scale: { r: ['--r-ctl', '--r-pill', '--r-card'] },
  chrome: { bg: 'var(--raised)', fg: 'var(--ink)', dim: 'var(--dim)', line: 'var(--line-2)', hover: 'var(--hover)', accent: 'var(--accent)' },
  /* the selection is ink until a hue is picked */
  accentOwn: { light: '#1d1d1b', dark: '#ecebe6' },
  /* the page's own colours in palette order (app surf raised inset hover line line2 text text2 dim green red yellow blue magenta warn); used for glass */
  own: {
    light: 'e7e6e2 efeeeb f7f6f3 dedcd7 dcdad5 d3d1cb bdbab3 1d1d1b 5c5b57 8f8d87 56763a c2452f b07d12 3f6aa8 9a4f86 e8821e',
    dark: '1a1a19 222220 2c2b29 151514 302f2d 363532 4a4945 ecebe6 a8a7a1 74736e 8db26b e5735c d9ab4e 7ea3d6 c58ab6 f0953a',
  },
  map: p => ({
    '--bg': p.app, '--surf': p.surf, '--raised': p.raised, '--inset': p.inset, '--hover': p.hover, '--line': p.line, '--line-2': p.line2,
    '--ink': p.text, '--ink-2': p.text2, '--dim': p.dim,
    /* waiting is the theme's warm hue, running its green, critical its red */
    '--wait': p.warn, '--run': p.green, '--crit': p.red, '--accent': p.text,
  }),
  /* the accent is the selection: the pressed lens, the selected target's label, the lit rack unit and its brackets */
  accent: c => ({ '--accent': c }),
  gutter: { own: 'full-width', css: 'html[data-tw-gutter="boxed"] .app{max-width:1440px;margin-inline:auto}' },
  glass: '.tip, .rt-menu, .keysheet', /* only boxes that float over other content */
};
