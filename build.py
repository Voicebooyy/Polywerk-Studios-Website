# Generates the HTML pages (shared header/footer). Run: python3 build.py
MAIL = 'polywerk.business@gmail.com'
DISCORD = 'https://discord.gg/nbb7JpqRh4'
NAV = [('index', 'Home'), ('games', 'Games'), ('about', 'About'), ('press', 'Press & partners'), ('contact', 'Contact')]
SLOGAN = "We're a small team building games with passion."

# Hexagon frame with diamonds, taken from the logo
HEX_INNER = ('<g stroke="currentColor" stroke-width="34" fill="none">'
             '<path d="M200,263 L452,116M572,116 L825,263M139,366 L139,657M884,366 L884,657M200,760 L452,907M572,907 L825,760"/></g>'
             '<g fill="currentColor"><path d="M511,44 L547,80 L511,116 L475,80Z M140,261 L176,297 L140,333 L104,297Z M883,261 L919,297 L883,333 L847,297Z '
             'M140,690 L176,726 L140,762 L104,726Z M883,690 L919,726 L883,762 L847,726Z M511,906 L547,942 L511,978 L475,942Z"/></g>')
HEX = f'<svg class="hexmark" viewBox="100 40 830 940" aria-hidden="true">{HEX_INNER}</svg>'
HEX_BG = f'<svg class="hex-bg" data-r viewBox="100 40 830 940" aria-hidden="true">{HEX_INNER}</svg>'

SCRIPT = '''<script>
(function(){var els=document.querySelectorAll("[data-r]");
if(!("IntersectionObserver"in window)){els.forEach(function(e){e.classList.add("in")});return}
var io=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){x.target.classList.add("in");io.unobserve(x.target)}})},{threshold:.15});
els.forEach(function(e){io.observe(e)})})();
</script>'''


def page(fn, title, desc, body):
    nav = ''.join(f'<a href="{f}.html"{" aria-current=\"page\"" if f == fn else ""}>{t}</a>' for f, t in NAV)
    full = 'Polywerk Studios' if fn == 'index' else f'{title} | Polywerk Studios'
    open(fn + '.html', 'w').write(f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{full}</title><meta name="description" content="{desc}">
<meta name="robots" content="noindex"><!-- remove before launch -->
<meta property="og:title" content="{full}"><meta property="og:description" content="{desc}"><meta property="og:image" content="assets/polywerk-banner.png">
<meta name="theme-color" content="#161718">
<script>document.documentElement.className+=" js"</script>
<link rel="icon" href="assets/polywerk-icon.svg" type="image/svg+xml"><link rel="preload" href="assets/archivo.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="assets/style.css"></head>
<body><header class="wrap top"><a class="brand" href="index.html"><img src="assets/polywerk-icon.svg" alt="" width="40" height="40">Polywerk Studios</a><nav aria-label="Main">{nav}</nav></header>
<main>{body}</main>
<footer><div class="wrap"><span>&copy; 2026 Polywerk Studios</span><nav aria-label="Legal"><a href="impressum.html">Impressum</a><a href="datenschutz.html">Privacy policy</a></nav></div></footer>
{SCRIPT}
</body></html>
''')


page('index', 'Home', SLOGAN, f'''
<div class="hero"><div class="wrap">{HEX_BG}
<h1 data-r>Polywerk<br>Studios</h1>
<p class="lead" data-r style="--d:.15s">{SLOGAN}</p>
<div class="actions" data-r style="--d:.3s"><a class="btn" href="{DISCORD}">Join our Discord</a></div>
</div></div>
<section><div class="wrap triple">
<div data-r>{HEX}<h3>Small team</h3><p class="muted">Short ways and personal care for every detail.</p></div>
<div data-r style="--d:.12s">{HEX}<h3>Direct contact</h3><p class="muted">You can talk to us on Discord or by email.</p></div>
<div data-r style="--d:.24s">{HEX}<h3>Made with passion</h3><p class="muted">We build what we would like to play ourselves.</p></div>
</div></section>
<section><div class="wrap">
<h2 class="statement" data-r>Our first project is in development.</h2>
<p class="lead" data-r style="--d:.15s;margin-top:24px">We will share more as soon as we can.</p>
</div></section>''')

page('games', 'Games', 'Games by Polywerk Studios, currently in development.', '''
<div class="wrap page-head"><h1 data-r>Games</h1><p class="lead" data-r style="--d:.12s">There is nothing to play yet.</p></div>
<section><div class="wrap">
<div class="tile" data-r><h2>Coming soon</h2><p class="muted">Our first project is in development. Details will follow here.</p></div>
</div></section>''')

page('about', 'About', 'About Polywerk Studios, an independent game studio.', f'''
<div class="wrap page-head"><h1 data-r>About us</h1></div>
<section><div class="wrap split">
<h2 data-r>The studio</h2>
<div data-r style="--d:.12s"><p class="lead">Polywerk Studios is an independent game studio. {SLOGAN}</p>
<p class="muted">We want to create games that are enjoyable, carefully made and fair to the people who play them. A friendly and respectful community matters to us.</p>
<p class="muted">If you have a question, an idea or feedback, please get in touch. We are glad to hear from you.</p></div>
</div></section>''')

page('press', 'Press & partners', 'Press kit and partnership information for Polywerk Studios.', f'''
<div class="wrap page-head"><h1 data-r>Press &amp; partners</h1><p class="lead" data-r style="--d:.12s">Everything you need to write about us or work with us.</p></div>
<section><div class="wrap split">
<h2 data-r>Facts</h2>
<dl class="facts" data-r style="--d:.12s">
<dt>Name</dt><dd>Polywerk Studios</dd>
<dt>Type</dt><dd>Independent game studio</dd>
<dt>Status</dt><dd>First project in development</dd>
<dt>Contact</dt><dd><a href="mailto:{MAIL}">{MAIL}</a></dd></dl>
</div></section>
<section><div class="wrap split">
<h2 data-r>Short description</h2>
<p class="lead" data-r style="--d:.12s">Polywerk Studios is an independent game studio. {SLOGAN}</p>
</div></section>
<section><div class="wrap split">
<h2 data-r>Logos</h2>
<div class="dl" data-r style="--d:.12s">
<a href="assets/polywerk-logo-horizontal.png" download><div class="thumb"><img src="assets/polywerk-logo-horizontal.png" alt="Polywerk Studios logo, horizontal" loading="lazy"></div><span>Logo, horizontal (PNG)</span></a>
<a href="assets/polywerk-icon.png" download><div class="thumb"><img src="assets/polywerk-icon.png" alt="Polywerk Studios icon" loading="lazy" style="max-width:40%"></div><span>Icon (PNG)</span></a>
<a href="assets/polywerk-banner.png" download><div class="thumb"><img src="assets/polywerk-banner.png" alt="Polywerk Studios banner" loading="lazy"></div><span>Banner, 1920 x 1080 (PNG)</span></a>
</div></div></section>
<section><div class="wrap split">
<h2 data-r>Work with us</h2>
<div data-r style="--d:.12s"><p class="lead">For sponsorships, partnerships and press requests, please write to us.</p>
<div class="actions"><a class="btn" href="mailto:{MAIL}?subject=Business%20inquiry">Email us</a></div></div>
</div></section>''')

page('contact', 'Contact', 'Contact and support for players, sponsors and partners of Polywerk Studios.', f'''
<div class="wrap page-head"><h1 data-r>Contact</h1><p class="lead" data-r style="--d:.12s">We are happy to help.</p></div>
<section><div class="wrap pair">
<div data-r><h2>Player support</h2><p class="muted" style="margin-top:16px">Do you have a question or found a problem? Discord is the fastest way to reach us. You can also write an email.</p>
<div class="actions"><a class="btn" href="{DISCORD}">Join our Discord</a></div></div>
<div data-r style="--d:.12s"><h2>Business inquiries</h2><p class="muted" style="margin-top:16px">Sponsors and partners are welcome to contact us by email.</p>
<p><a class="mail" href="mailto:{MAIL}">{MAIL}</a></p></div>
</div></section>''')

page('impressum', 'Impressum', 'Legal notice', '''
<div class="wrap page-head"><h1>Impressum</h1></div>
<div class="wrap legal"><p class="lead">Placeholder. The legal notice will be added before launch.</p></div>''')

page('datenschutz', 'Privacy policy', 'Privacy policy', '''
<div class="wrap page-head"><h1>Privacy policy</h1></div>
<div class="wrap legal"><p class="lead">Placeholder. The privacy policy will be added before launch.</p></div>''')
