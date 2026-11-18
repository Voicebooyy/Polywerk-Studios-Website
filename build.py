# Generates the HTML pages. Run: python3 build.py
MAIL = 'polywerk.business@gmail.com'
DISCORD = 'https://discord.gg/nbb7JpqRh4'
SLOGAN = "We're a small team building games with passion."
NAV = [('home', 'Home'), ('games', 'Games'), ('about', 'About'), ('press', 'Press & partners'), ('contact', 'Contact')]

# Hexagon frame with diamonds, taken from the logo
HEX = ('<svg class="hexmark" viewBox="100 40 830 940" aria-hidden="true"><g stroke="currentColor" stroke-width="34" fill="none">'
       '<path d="M200,263 L452,116M572,116 L825,263M139,366 L139,657M884,366 L884,657M200,760 L452,907M572,907 L825,760"/></g>'
       '<g fill="currentColor"><path d="M511,44 L547,80 L511,116 L475,80Z M140,261 L176,297 L140,333 L104,297Z M883,261 L919,297 L883,333 L847,297Z '
       'M140,690 L176,726 L140,762 L104,726Z M883,690 L919,726 L883,762 L847,726Z M511,906 L547,942 L511,978 L475,942Z"/></g></svg>')

HEAD = '''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{title}</title><meta name="description" content="{desc}">
<meta name="robots" content="noindex"><!-- remove before launch -->
<meta property="og:title" content="{title}"><meta property="og:description" content="{desc}"><meta property="og:image" content="assets/polywerk-banner.png">
<meta name="theme-color" content="#FAF8F3">
<script>document.documentElement.className+=" js"</script>
<link rel="icon" href="assets/polywerk-icon.svg" type="image/svg+xml"><link rel="preload" href="assets/archivo.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="assets/style.css"></head>
'''
LEGAL_LINKS = '<nav aria-label="Legal"><a href="impressum.html">Impressum</a><a href="datenschutz.html">Privacy policy</a></nav>'
LOGO = '<a class="logo" href="{href}" aria-label="Polywerk Studios, home"><img src="assets/polywerk-icon.svg" alt="" width="44" height="44"></a>'

rail = ''.join(f'<li><a href="#{i}"><span class="lbl">{t}</span><i></i></a></li>' for i, t in NAV)

home = HEAD.format(title='Polywerk Studios', desc=SLOGAN) + f'''<body>
<canvas id="net" aria-hidden="true"></canvas>
{LOGO.format(href='#home')}
<nav class="rail" aria-label="Main"><button class="rail-btn" type="button" aria-expanded="false">Menu</button><ul>{rail}</ul></nav>
<main>

<section id="home" class="hero"><div class="wrap">
<h1 data-r><span>Polywerk</span><span>Studios</span></h1>
<p class="lead" data-r style="--d:.15s">{SLOGAN}</p>
<div class="actions" data-r style="--d:.3s"><a class="btn" href="{DISCORD}">Join our Discord</a></div>
</div></section>

<section id="games"><div class="wrap g12">
<div style="--c:1/6"><h2 data-r>Games</h2><p class="lead" data-r style="--d:.1s;margin-top:20px">There is nothing to play yet.</p></div>
<div class="tile" data-r style="--c:6/13;margin-top:88px">{HEX}<h3 class="statement" style="font-size:clamp(1.5rem,3vw,2.4rem)">Our first project is in development.</h3><p class="muted">We will share more as soon as we can.</p></div>
</div></section>

<section id="about"><div class="wrap g12">
<h2 data-r style="--c:1/7">About us</h2>
<p class="statement" data-r style="--c:3/13;margin-top:-8px">Polywerk Studios is an independent game studio. {SLOGAN}</p>
<div class="princ" data-r style="--c:1/5">{HEX}<h3>Small team</h3><p class="muted">Short ways and personal care for every detail.</p></div>
<div class="princ" data-r style="--c:5/9;margin-top:56px;--d:.12s">{HEX}<h3>Direct contact</h3><p class="muted">You can talk to us on Discord or by email.</p></div>
<div class="princ" data-r style="--c:9/13;margin-top:112px;--d:.24s">{HEX}<h3>Made with passion</h3><p class="muted">We build what we would like to play ourselves.</p></div>
<p class="muted" data-r style="--c:6/12;margin-top:24px">We want to create games that are enjoyable, carefully made and fair to the people who play them. A friendly and respectful community matters to us.</p>
</div></section>

<section id="press"><div class="wrap g12">
<div style="--c:1/8"><h2 data-r>Press &amp; partners</h2><p class="lead" data-r style="--d:.1s;margin-top:20px">Everything you need to write about us or work with us.</p></div>
<div style="--c:1/6" data-r><h3>Short description</h3><p class="muted" style="margin-top:12px">Polywerk Studios is an independent game studio. {SLOGAN}</p></div>
<dl class="facts" data-r style="--c:7/13;margin-top:40px;--d:.12s">
<dt>Name</dt><dd>Polywerk Studios</dd><dt>Type</dt><dd>Independent game studio</dd>
<dt>Status</dt><dd>First project in development</dd><dt>Press</dt><dd><a href="mailto:{MAIL}">{MAIL}</a></dd></dl>
<div class="dl" data-r style="--c:2/13">
<a href="assets/polywerk-logo-horizontal.png" download><div class="thumb"><img src="assets/polywerk-logo-horizontal.png" alt="Polywerk Studios logo, horizontal" loading="lazy"></div><span>Logo, horizontal (PNG)</span></a>
<a href="assets/polywerk-icon.png" download><div class="thumb"><img src="assets/polywerk-icon.png" alt="Polywerk Studios icon" loading="lazy" style="max-width:55%"></div><span>Icon (PNG)</span></a>
<a href="assets/polywerk-banner.png" download><div class="thumb"><img src="assets/polywerk-banner.png" alt="Polywerk Studios banner" loading="lazy"></div><span>Banner, 1920 x 1080 (PNG)</span></a>
</div>
</div></section>

<section id="contact"><div class="wrap g12">
<h2 data-r style="--c:1/6">Contact</h2>
<div data-r style="--c:6/13;--d:.1s"><h3>Player support</h3><p class="muted" style="margin-top:12px">Do you have a question or found a problem? Discord is the fastest way to reach us.</p>
<div class="actions"><a class="btn" href="{DISCORD}">Join our Discord</a></div></div>
<div data-r style="--c:3/10;margin-top:24px"><h3>Business inquiries</h3><p class="muted" style="margin-top:12px">Sponsors and partners are welcome to contact us by email.</p>
<p><a class="mail" href="mailto:{MAIL}">{MAIL}</a></p></div>
</div></section>

</main>
<footer><div class="wrap"><span>&copy; 2026 Polywerk Studios</span>{LEGAL_LINKS}</div></footer>
<script src="assets/site.js" defer></script>
</body></html>
'''
open('index.html', 'w').write(home)


def legal(fn, title, text):
    open(fn + '.html', 'w').write(HEAD.format(title=f'{title} | Polywerk Studios', desc=title) + f'''<body>
<header class="wrap bar">{LOGO.format(href='index.html')}<a href="index.html">Back to home</a></header>
<main class="wrap legal"><h1>{title}</h1><p class="lead">{text}</p></main>
<footer><div class="wrap"><span>&copy; 2026 Polywerk Studios</span>{LEGAL_LINKS}</div></footer>
</body></html>
''')


legal('impressum', 'Impressum', 'Placeholder. The legal notice will be added before launch.')
legal('datenschutz', 'Privacy policy', 'Placeholder. The privacy policy will be added before launch.')
