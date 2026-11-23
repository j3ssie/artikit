/* how this page's tokens line up with the shared tweak palettes.
   The page's tokens are the sixteen palette roles under other names; the grid rules, bar tracks and button fills are mixed from them, so they follow. */
window.TWEAK_PAGE = {
  key: 'console-activity',
  modes: ['dark', 'light'], /* the page ships both, through light-dark() tokens */
  /* no data-theme yet means the page is following the system */
  getMode: () => { const t = document.documentElement.getAttribute('data-theme'); return t === 'dark' || t === 'light' ? t : matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'; },
  setMode: m => { document.documentElement.setAttribute('data-theme', m); try { localStorage.setItem('ca-theme', m); } catch (e) {} },
  sans: '--sans', mono: '--mono', scale: { r: ['--r-sheet', '--r-card', '--r-ctl'] },
  chrome: { bg: 'var(--raised)', fg: 'var(--ink)', dim: 'var(--dim)', line: 'var(--line-2)', hover: 'var(--hover)', accent: 'var(--accent-fg)' },
  accentOwn: { dark: '#4c5ff0', light: '#4c5ff0' },
  /* the page's own colours in palette order (app surf raised inset hover line line2 text text2 dim green red yellow blue magenta warn); used for glass */
  own: {
    dark: '0d0d0d 161616 1c1c1c 121212 262626 262626 343434 ededed a3a3a3 6e6e6e 3fb871 ec5d5d d9a33c 4c5ff0 d06fa8 f07c3a',
    light: 'ebebe9 f7f7f6 ffffff f2f2f0 ececea e3e3e0 d1d1cd 171717 5b5b58 8c8c88 1f8a4c cf3036 a86c00 4c5ff0 bd468d e0651f',
  },
  map: (p, mix) => ({
    '--bg': p.app, '--sheet': p.surf, '--card': p.raised, '--raised': mix(p.hover, 35, p.raised), '--inset': p.inset, '--hover': p.hover,
    '--line': p.line, '--line-2': p.line2, '--ink': p.text, '--ink-2': p.text2, '--dim': p.dim,
    '--grid': mix(p.line, 70, p.raised), '--bar': p.line2, '--track': mix(p.hover, 60, p.raised),
    /* status follows the theme; the model series (--s*) keep the colours that were checked as a set */
    '--ok': p.green, '--err': p.red, '--warn': p.yellow, '--dot': p.warn,
  }),
  /* the accent drives the step card, the heat grid, the client and provider bars and the focus ring */
  accent: c => ({ '--accent': c }),
  gutter: { own: 'boxed', css: 'html[data-tw-gutter="full-width"] :is(.wrap,.foot){max-width:none}' },
  glass: '.tip, .rt-menu, .pop', /* only boxes that float over other content */
};
