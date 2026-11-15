/* how this page's tokens line up with the shared tweak palettes.
   The page ships a dark palette only, so every light theme comes from map(). */
window.TWEAK_PAGE = {
  key: 'vigolium-charts',
  modes: ['dark'],
  getMode: () => 'dark',
  setMode: () => {},
  sans: '--sans', mono: '--mono',
  /* no scale.r: the page's --r and --mr read the dock's --tw-r themselves, so corners stay square on "default" and "sharp" and only "round" turns them on */
  chrome: { bg: 'var(--pop)', fg: 'var(--ink)', dim: 'var(--muted)', line: 'var(--line-2)', hover: 'color-mix(in srgb, var(--ink) 9%, transparent)', accent: 'var(--accent)' },
  accentOwn: { dark: '#ff9447' },
  /* the page's own colours in palette order (app surf raised inset hover line line2 text text2 dim green red yellow blue magenta warn); used for glass */
  own: { dark: '1c1b19 201f1c 262420 181715 2b2925 2f2c27 4a453c fce8c3 c4b291 6b6258 50fa7b f75341 fbb829 53bdfa bd93f9 ff9447' },
  map: (p, mix) => {
    const light = p.mode === 'light';
    const out = {
      '--bg': p.app, '--card': p.surf, '--card-2': p.surf, '--fig': p.inset, '--fig-solid': p.glass ? p.app : p.inset, '--pop': p.glass ? mix(p.solid, 90) : p.raised,
      '--line': mix(p.text, light ? 11 : 9), '--line-2': mix(p.text, light ? 24 : 20), '--hair': mix(p.text, light ? 8 : 6),
      '--grid': mix(p.text, light ? 9 : 7), '--axis': mix(p.text, light ? 26 : 20),
      '--ink': p.text, '--body': p.text2, '--muted': mix(p.text2, 72, p.dim), '--faint': p.dim,
      '--neon': p.green, '--sky': p.blue, '--rule': p.red, '--good': p.green, '--bad': p.red,
    };
    /* the series were checked as sets: the dark set is the page's own, this one is the same hues stepped for a pale surface */
    if (light) Object.assign(out, {
      '--s1': '#c36101', '--s2': '#058ac4', '--s3': '#009b3d', '--s4': '#9167c9',
      '--sev1': '#c8321f', '--sev2': '#e67f2a', '--sev3': '#f2c744', '--sev4': '#8f877c',
      '--o1': '#f68b3d', '--o2': '#da721c', '--o3': '#ba5d04', '--o4': '#984b03', '--o5': '#783a02',
    });
    return out;
  },
  /* the accent is chrome only (range switch, dots, the brand frame, the backdrop glow): the chart series keep their checked colours */
  accent: c => ({ '--accent': c }),
  gutter: { own: 'boxed', css: 'html[data-tw-gutter="full-width"] .wrap{max-width:none}' },
  glass: '.tip, .top, .rt-menu', /* only boxes that float over other content */
};
