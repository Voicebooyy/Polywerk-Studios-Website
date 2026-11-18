# Generates the HTML pages (shared header/footer). Run: python3 build.py
MAIL = 'polywerk.business@gmail.com'
DISCORD = 'https://discord.gg/nbb7JpqRh4'
NAV = [('index', 'Home'), ('games', 'Games'), ('about', 'About'), ('contact', 'Contact & support')]

# Hexagon frame with diamonds, taken from the logo
HEX = ('<svg class="hexmark" viewBox="100 40 830 940" aria-hidden="true"><g stroke="#F3EDDC" stroke-width="34" fill="none">'
       '<path d="M200,263 L452,116M572,116 L825,263M139,366 L139,657M884,366 L884,657M200,760 L452,907M572,907 L825,760"/></g>'
       '<g fill="#F3EDDC"><path d="M511,44 L547,80 L511,116 L475,80Z M140,261 L176,297 L140,333 L104,297Z M883,261 L919,297 L883,333 L847,297Z '
       'M140,690 L176,726 L140,762 L104,726Z M883,690 L919,726 L883,762 L847,726Z M511,906 L547,942 L511,978 L475,942Z"/></g></svg>')


def page(fn, title, desc, body):
    nav = ''.join(f'<a href="{f}.html"{" aria-current=\"page\"" if f == fn else ""}>{t}</a>' for f, t in NAV)
    full = 'Polywerk Studios' if fn == 'index' else f'{title} | Polywerk Studios'
    html = f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{full}</title><meta name="description" content="{desc}">
<meta name="robots" content="noindex"><!-- remove before launch -->
<meta property="og:title" content="{full}"><meta property="og:description" content="{desc}"><meta property="og:image" content="assets/polywerk-banner.png">
<meta name="theme-color" content="#000000">
<link rel="icon" href="assets/polywerk-icon.svg" type="image/svg+xml"><link rel="preload" href="assets/archivo.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="assets/style.css"></head>
<body><header class="wrap top"><a class="brand" href="index.html"><img src="assets/polywerk-icon.svg" alt="" width="40" height="40">Polywerk Studios</a><nav aria-label="Main">{nav}</nav></header>
<main>{body}</main>
<footer><div class="wrap"><span>&copy; 2026 Polywerk Studios</span><nav aria-label="Legal"><a href="impressum.html">Impressum</a><a href="datenschutz.html">Privacy policy</a></nav></div></footer>
</body></html>
'''
    open(fn + '.html', 'w').write(html)


SLOGAN = "We're a small team building games with passion."

page('index', 'Home', SLOGAN, f'''
<div class="hero"><div class="wrap">
<h1>Games you can only win together.</h1>
<p class="lead">{SLOGAN} Our first co-op game is in the works.</p>
<div class="actions"><a class="btn" href="{DISCORD}">Join our Discord</a><a href="games.html">See what we're making</a></div>
</div></div>
<section><div class="wrap split">
<h2>What we make</h2>
<div class="pair">
<div>{HEX}<h3>Co-op games</h3><p class="muted">2D casual games where every player has to pitch in. Easy to learn, best played with friends.</p></div>
<div>{HEX}<h3>Small everyday games</h3><p class="muted">Later on: tiny games that fit into a short break.</p></div>
</div></div></section>
<section id="newsletter"><div class="wrap split">
<h2>Newsletter</h2>
<div><p class="lead">Coming soon. We'll only write when there's something to show.</p><p class="muted">Until then, follow along on Discord.</p></div>
</div></section>''')

page('games', 'Games', 'Games by Polywerk Studios, currently in development.', '''
<div class="wrap page-head"><h1>Games</h1><p class="lead">Nothing released yet. Here's what we're working on.</p></div>
<section><div class="wrap">
<article class="game"><span class="status">In development</span><h2>Untitled co-op game</h2><p>A 2D co-op game for friends. Details soon.</p></article>
<article class="game"><span class="status">Planned</span><h2>Everyday games</h2><p>Small games for short breaks.</p></article>
</div></section>''')

page('about', 'About', 'About Polywerk Studios, an independent game studio.', f'''
<div class="wrap page-head"><h1>A small studio for shared games.</h1></div>
<section><div class="wrap split">
<h2>About us</h2>
<div><p class="lead">Polywerk Studios is an independent game studio. {SLOGAN}</p>
<p class="muted">We make games that people play together: quick to start, hard to finish without your friends. Our first focus is cooperative 2D casual games. Later we want to add small games for everyday moments.</p></div>
</div></section>''')

page('contact', 'Contact & support', 'Contact and support for players, sponsors and partners of Polywerk Studios.', f'''
<div class="wrap page-head"><h1>Contact &amp; support</h1><p class="lead">Players, sponsors and partners: here's how to reach us.</p></div>
<section><div class="wrap pair">
<div><h2>Player support</h2><p class="muted" style="margin-top:16px">Found a bug or stuck somewhere? Discord is the fastest way to reach us.</p>
<div class="actions"><a class="btn" href="{DISCORD}">Join our Discord</a></div>
<p class="muted" style="margin-top:24px">Or email <a class="mail" href="mailto:{MAIL}">{MAIL}</a></p></div>
<div><h2>Business inquiries</h2><p class="muted" style="margin-top:16px">Sponsorships, partnerships and press: write to us by email.</p>
<div class="actions"><a class="btn ghost" href="mailto:{MAIL}?subject=Business%20inquiry">Email us</a></div>
<p class="muted" style="margin-top:24px"><span class="mail">{MAIL}</span></p></div>
</div></section>''')

page('impressum', 'Impressum', 'Legal notice', '''
<div class="wrap page-head"><h1>Impressum</h1></div>
<div class="wrap legal"><p class="lead">Placeholder. The legal notice will be added before launch.</p></div>''')

page('datenschutz', 'Privacy policy', 'Privacy policy', '''
<div class="wrap page-head"><h1>Privacy policy</h1></div>
<div class="wrap legal"><p class="lead">Placeholder. The privacy policy will be added before launch.</p></div>''')
