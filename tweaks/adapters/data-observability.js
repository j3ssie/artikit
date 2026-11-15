/* how this page's tokens line up with the shared tweak palettes.
   The page ships a dark palette only, so every light theme comes from map(). */
window.TWEAK_PAGE = (() => {
  const rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const blend = (a, pct, b) => { const A = rgb(a), B = rgb(b); return '#' + A.map((v, i) => Math.round(v * pct / 100 + B[i] * (1 - pct / 100)).toString(16).padStart(2, '0')).join(''); };
  const lin = h => rgb(h).map(v => (v /= 255) <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
  const lum = h => lin(h).reduce((a, v, i) => a + v * [.2126, .7152, .0722][i], 0);
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
  /* how clearly two neighbouring series separate, as distance in OKLab x100 against the floors the charts are held to:
     15 with full colour vision, 8 under protan and deutan (Machado 2009, full severity). 1 or more clears all three. */
  const CVD = [[.152286, 1.052583, -.204868, .114503, .786281, .099216, -.003882, -.048116, 1.051998], [.367322, .860646, -.227968, .280085, .672501, .047413, -.01182, .04294, .968881]];
  const lab = (h, M) => { let [r, g, b] = lin(h); if (M) [r, g, b] = [0, 3, 6].map(i => Math.min(1, Math.max(0, M[i] * r + M[i + 1] * g + M[i + 2] * b)));
    const l = Math.cbrt(.4122214708 * r + .5363325363 * g + .0514459929 * b), m = Math.cbrt(.2119034982 * r + .6806995451 * g + .1073969566 * b), s = Math.cbrt(.0883024619 * r + .2817188376 * g + .6299787005 * b);
    return [.2104542553 * l + .793617785 * m - .0040720468 * s, 1.9779984951 * l - 2.428592205 * m + .4505937099 * s, .0259040371 * l + .7827717662 * m - .808675766 * s]; };
  const dist = (a, b, M) => { const x = lab(a, M), y = lab(b, M); return 100 * Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]); };
  const apart = (a, b) => Math.min(dist(a, b) / 15, dist(a, b, CVD[0]) / 8, dist(a, b, CVD[1]) / 8);
  const TEAL = { dark: '#14a089', light: '#0f8a74' }, OWN = { bg: '#09090b', fg: '#f4f4f5' };
  /* step a colour toward white (dark themes) or black (light themes) until it passes a contrast test.
     A palette colour that already passes comes back untouched. */
  const clear = (c, pole, ok) => { for (let k = 100; k > 40; k -= 5) { const m = blend(c, k, pole); if (ok(m)) return m; } return blend(c, 40, pole); };

  return {
    key: 'observability',
    modes: ['dark'],
    getMode: () => 'dark',
    setMode: () => {},
    sans: '--sans', mono: '--mono',
    scale: { r: ['--r-sm', '--r'], d: ['--gutter', '--section-gap', '--bleed'] },
    chrome: { bg: 'var(--bg-raise-2)', fg: 'var(--fg)', dim: 'var(--fg-2)', line: 'var(--line-2)', hover: 'var(--line-2)', accent: 'var(--s-blue)' },
    accentOwn: { dark: '#3b82f6' },
    /* the page's own colours in palette order (app surf raised inset hover line line2 text text2 dim green red yellow blue magenta warn); used for glass */
    own: { dark: '09090b 111113 18181b 0c0c0e 1f1f23 18181a 222224 f4f4f5 9a9ba3 3f4047 22b052 e5484d f0ad26 3b82f6 8c7cf0 ec835a' },

    map: (p, mix) => {
      const light = p.mode === 'light', pole = light ? '#000000' : '#ffffff';
      /* the page is flat, with no cards. Dark sits on the darkest plane and its controls go a step lighter;
         light sits on the paper colour and its controls go a step darker. Under glass the backdrop is the app colour either way. */
      const bg = light && !p.glass ? p.solid : p.app;
      /* the least favourable planes that carry text (worked out by hand under glass, where the control steps are translucent):
         step1 is a hovered row or a control, where status and tertiary text can sit; step2 is a pill, key cap or pressed chip, which only carry primary and secondary text */
      const step1 = light ? (p.glass ? blend(p.text, 4, p.app) : p.inset) : p.solid;
      const step2 = light ? (p.glass ? blend(p.text, 7, p.app) : p.hover) : (p.glass ? blend(p.text, 5, p.solid) : p.raised);
      const own = p.app === OWN.bg && p.text === OWN.fg; /* the page's own palette (page default + glass) was tuned by hand: it passes through as it is */
      const on = (c, plane, min = 4.5) => own ? c : clear(c, pole, m => ratio(m, plane) >= min), mark = c => own ? c : clear(c, pole, m => ratio(m, bg) >= 3);
      const fg = on(p.text, step2, 5.5), good = on(p.green, step1), warn = on(p.yellow, step1);
      const crit = own ? p.red : clear(p.red, pole, m => ratio(m, step1) >= 4.5 && ratio(m, blend(m, 12, bg)) >= 4.5); /* critical is also pill text on its own wash */
      /* count badge: white on a darkened red where that reads, otherwise the darkest ink on the plain red */
      const deep = blend(p.red, 88, '#000000'), ink = light ? fg : p.app;
      const badge = light ? [crit, '#ffffff'] : own || ratio('#ffffff', deep) >= 4.5 || ratio('#ffffff', deep) >= ratio(ink, p.red) ? [deep, '#ffffff'] : [p.red, ink];
      return {
        '--bg': bg, '--bg-raise': light ? p.inset : p.surf, '--bg-raise-2': light ? p.hover : p.raised,
        '--pop': p.glass ? mix(p.solid, 86) : p.raised,
        '--fg': fg, '--fg-2': on(p.text2, step2, 5), '--fg-3': own ? '#7c7d86' : on(blend(p.text2, 62, p.dim), step1), '--fg-4': p.dim,
        '--fg-hover': blend(fg, light ? 90 : 60, light ? bg : '#ffffff'),
        '--line': mix(p.text, light ? 9 : 7), '--line-2': mix(p.text, light ? 15 : 12),
        '--grid': mix(p.text, light ? 8 : 6), '--axis': mix(p.text, light ? 15 : 11),
        /* series two and three keep the page's hues; the light set is stepped down for a pale surface */
        '--s-teal': mark(TEAL[p.mode]), '--s-violet': mark(light ? '#6d54d6' : '#8c7cf0'),
        '--s-grey': mix(p.text, light ? 18 : 22),
        '--good': good, '--warn': warn, '--crit': crit,
        '--good-wash': mix(good, 12), '--warn-wash': mix(warn, 12), '--crit-wash': mix(crit, 12),
        '--badge': badge[0], '--on-badge': badge[1],
        '--pill-edge': light ? 'rgba(255,255,255,.6)' : mix(p.text, 4),
        '--shadow': light ? mix(p.text, 32) : 'rgba(0,0,0,.8)',
      };
    },

    /* the accent is the first series; the ordinal ramp (p50, p95, p99), the heat ramp and the accent-coloured text are steps of it */
    accent: (c, mix, mode, p, tokens) => {
      const light = mode === 'light', bg = tokens ? tokens['--bg'] : OWN.bg; /* the surface map() chose; when it did not run, the page's own is in force */
      const pale = !light && lum(c) > .6; /* an accent already near white has no room above it: step down only */
      /* ordinal: pale to deep in both modes, as tints and shades of the one hue. On paper the pale end is the lightest tint that
         still holds 3:1; an accent with no such tint (it is close to 3:1 itself) starts the ramp instead. */
      const tint = [55, 60, 65, 70, 75, 80].map(k => blend(c, k, bg)).find(m => ratio(m, bg) >= 3);
      const ord = light ? (tint ? [tint, c, blend(c, 58, '#000000')] : [c, blend(c, 72, '#000000'), blend(c, 46, '#000000')])
        : pale ? [c, blend(c, 74, bg), blend(c, 52, bg)] : [blend(c, 50, '#ffffff'), c, blend(c, 76, bg)];
      /* heat: from the surface up to the accent, then past it toward the far pole */
      const far = light ? '#000000' : '#ffffff';
      const heat = pale ? [12, 24, 38, 52, 68, 84, 100].map(k => blend(c, k, bg)) : [16, 32, 50, 72, 92].map(k => blend(c, k, bg)).concat(blend(c, 72, far), blend(c, 48, far));
      /* series two keeps its hue, but takes another step of it when the accent lands too close */
      const steps = [[100, bg], [88, '#000000'], [76, '#000000'], [64, '#000000'], [92, '#ffffff'], [84, '#ffffff'], [76, '#ffffff'], [64, '#ffffff']].map(([k, pole]) => blend(TEAL[mode], k, pole)).filter((m, i) => !i || ratio(m, bg) >= 3);
      const teal = steps.find(m => apart(m, c) >= 1) || steps.reduce((a, m) => apart(m, c) > apart(a, c) + .2 ? m : a); /* none clears: move only for a real gain */
      const out = {
        '--focus': c, '--s-blue': c, '--s-teal': teal,
        '--blue-wash': mix(c, 14), '--glow': mix(c, light ? 7 : 10), '--select': mix(c, light ? 24 : 35),
        '--fg-accent': light ? clear(c, '#000000', m => ratio(m, bg) >= 4.9) : ord[0], /* 4.9 on the page keeps 4.5 on a hovered row */
        '--o1': ord[0], '--o2': ord[1], '--o3': ord[2], '--q0': blend(c, 5, bg),
      };
      heat.forEach((v, i) => { out['--q' + (i + 1)] = v; });
      return out;
    },

    gutter: { own: 'boxed', css: 'html[data-tw-gutter="full-width"]{--container:none}' },
    glass: '.tip, .rt-menu',
  };
})();
