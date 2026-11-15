#!/usr/bin/env python3
"""inject.py [<page.html> <adapter.js>]: put the tweaks block (adapter + shared module) right before </head>, replacing a previous one.
With no arguments it does this for every adapter in adapters/, into the page of the same name in ../pages/."""
import sys, json, re, os, glob
here = os.path.dirname(os.path.abspath(__file__))
mod = open(os.path.join(here, 'module.html')).read().strip()
assert mod.count('__THEMES__') == 1
mod = mod.replace('__THEMES__', json.dumps(json.load(open(os.path.join(here, 'themes.json'))), indent=1))  # JSON is a valid JS literal

def inject(page, adapter):
    block = '<!-- tweaks:start -->\n<script>\n' + open(adapter).read().strip() + '\n</script>\n' + mod + '\n<!-- tweaks:end -->\n'
    s = open(page).read()
    s, n = re.subn(r'<!-- tweaks:start -->.*?<!-- tweaks:end -->\n', '', s, flags=re.S)
    assert s.count('</head>') == 1, 'expected one </head> in ' + page
    open(page, 'w').write(s.replace('</head>', block + '</head>'))
    print(('replaced' if n else 'inserted'), 'tweaks block in', os.path.relpath(page), '(%d bytes)' % len(block))

if len(sys.argv) == 3:
    inject(sys.argv[1], sys.argv[2])
else:
    for adapter in sorted(glob.glob(os.path.join(here, 'adapters', '*.js'))):
        inject(os.path.join(here, '..', 'pages', os.path.basename(adapter)[:-3] + '.html'), adapter)
