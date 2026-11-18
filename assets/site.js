(function () {
  var reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;

  // Scroll reveal: toggles both ways, so animations replay on every pass
  var els = document.querySelectorAll("[data-r]");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { x.target.classList.toggle("in", x.isIntersecting); });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    els.forEach(function (e) { io.observe(e); });
  } else els.forEach(function (e) { e.classList.add("in"); });

  // Fast eased scroll to a section
  var anim = 0;
  function go(y) {
    if (reduce) { scrollTo(0, y); return; }
    var s = scrollY, d = y - s, t0 = performance.now(), id = ++anim;
    var dur = Math.min(850, Math.max(450, Math.abs(d) * 0.3));
    function f(t) {
      if (id !== anim) return;
      var p = Math.min(1, (t - t0) / dur), e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      scrollTo(0, s + d * e);
      if (p < 1) requestAnimationFrame(f);
    }
    requestAnimationFrame(f);
  }
  ["wheel", "touchstart"].forEach(function (n) { addEventListener(n, function () { anim++; }, { passive: true }); });

  var rail = document.querySelector(".rail"), btn = document.querySelector(".rail-btn");
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var t = document.getElementById(a.getAttribute("href").slice(1));
      if (!t) return;
      e.preventDefault();
      go(t.getBoundingClientRect().top + scrollY);
      history.replaceState(null, "", a.getAttribute("href"));
      if (rail) { rail.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); }
    });
  });
  if (btn) {
    btn.addEventListener("click", function () {
      btn.setAttribute("aria-expanded", rail.classList.toggle("open"));
    });
    addEventListener("keydown", function (e) { if (e.key === "Escape") { rail.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); } });
  }

  // Highlight the current section in the rail
  var links = {};
  document.querySelectorAll(".rail a").forEach(function (a) { links[a.getAttribute("href").slice(1)] = a; });
  if ("IntersectionObserver" in window) {
    var so = new IntersectionObserver(function (en) {
      en.forEach(function (x) {
        if (!x.isIntersecting) return;
        Object.keys(links).forEach(function (k) { links[k].classList.toggle("on", k === x.target.id); });
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    document.querySelectorAll("main section").forEach(function (s) { so.observe(s); });
  }

  // Cursor net: dots are pulled toward a center point and linked to it with thin lines.
  // The center follows the mouse; with no mouse (touch, pointer left) it roams on its own.
  // Text blocks are no-go zones: no dots, no lines and no center inside them.
  var c = document.getElementById("net");
  if (!c) return;
  var x = c.getContext("2d"), dpr = Math.min(devicePixelRatio || 1, 2), W = 0, H = 0, P = [], G = 60, R = 125, PAD = 14;
  var m = { x: 0, y: 0, on: false }, ctr = { x: -999, y: -999 };
  var INK = "20,20,20";
  var HIT = document.querySelectorAll("main h1 span,main h2,main h3,main p,main dl,main .btn,main .tile,.logo,.rail,footer .wrap>span,footer nav a");
  var rg = document.createRange();

  function rects() {
    var out = [];
    HIT.forEach(function (el) {
      var r;
      if (/^(SPAN|H2|H3|P)$/.test(el.tagName) && !el.classList.contains("btn")) { rg.selectNodeContents(el); r = rg.getBoundingClientRect(); }
      else r = el.getBoundingClientRect();
      if (r.width && r.bottom > -40 && r.top < H + 40) out.push({ l: r.left - PAD, t: r.top - PAD, r: r.right + PAD, b: r.bottom + PAD });
    });
    return out;
  }
  function inside(px, py, RS) {
    for (var i = 0; i < RS.length; i++) { var r = RS[i]; if (px > r.l && px < r.r && py > r.t && py < r.b) return true; }
    return false;
  }
  function pushOut(px, py, RS) {
    for (var k = 0; k < 3; k++) for (var i = 0; i < RS.length; i++) {
      var r = RS[i];
      if (px > r.l && px < r.r && py > r.t && py < r.b) {
        var d = [px - r.l, r.r - px, py - r.t, r.b - py], mi = d.indexOf(Math.min.apply(null, d));
        if (mi === 0) px = r.l - 1; else if (mi === 1) px = r.r + 1; else if (mi === 2) py = r.t - 1; else py = r.b + 1;
      }
    }
    return { x: px, y: py };
  }
  // Liang-Barsky: does segment A-B cross rect r?
  function crosses(ax, ay, bx, by, RS) {
    var dx = bx - ax, dy = by - ay;
    for (var i = 0; i < RS.length; i++) {
      var r = RS[i], t0 = 0, t1 = 1, p = [-dx, dx, -dy, dy], q = [ax - r.l, r.r - ax, ay - r.t, r.b - ay], ok = true;
      for (var j = 0; j < 4; j++) {
        if (p[j] === 0) { if (q[j] < 0) { ok = false; break; } }
        else {
          var t = q[j] / p[j];
          if (p[j] < 0) { if (t > t1) { ok = false; break; } if (t > t0) t0 = t; }
          else { if (t < t0) { ok = false; break; } if (t < t1) t1 = t; }
        }
      }
      if (ok) return true;
    }
    return false;
  }

  function size() {
    W = innerWidth; H = innerHeight;
    c.width = W * dpr; c.height = H * dpr;
    x.setTransform(dpr, 0, 0, dpr, 0, 0);
    G = Math.max(56, Math.sqrt(W * H / 650));
    P = [];
    for (var i = -1; i * G < W + G; i++) for (var j = -1; j * G < H + G; j++) {
      var hx = i * G + (Math.random() - 0.5) * G * 0.75, hy = j * G + (Math.random() - 0.5) * G * 0.75;
      P.push({ hx: hx, hy: hy, x: hx, y: hy, vx: 0, vy: 0 });
    }
  }
  function still() {
    var RS = rects();
    x.clearRect(0, 0, W, H);
    x.fillStyle = "rgba(" + INK + ",.25)";
    P.forEach(function (p) { if (inside(p.x, p.y, RS)) return; x.beginPath(); x.arc(p.x, p.y, 1.5, 0, 6.3); x.fill(); });
  }
  function frame(t) {
    var RS = rects(), tx, ty, real = m.on;
    if (real) { tx = m.x; ty = m.y; }
    else { tx = W * (0.5 + 0.36 * Math.sin(t / 2300)); ty = H * (0.5 + 0.34 * Math.sin(t / 3100 + 1)); }
    var o = pushOut(tx, ty, RS);
    if (ctr.x < -900) { ctr.x = o.x; ctr.y = o.y; }
    var f = real ? 0.35 : 0.07;
    ctr.x += (o.x - ctr.x) * f; ctr.y += (o.y - ctr.y) * f;
    var mx = ctr.x, my = ctr.y;
    x.clearRect(0, 0, W, H);
    var near = [];
    for (var i = 0; i < P.length; i++) {
      var p = P[i], dx = mx - p.x, dy = my - p.y, d = Math.sqrt(dx * dx + dy * dy);
      var fx = (p.hx - p.x) * 0.06, fy = (p.hy - p.y) * 0.06, k = 0;
      var hidden = inside(p.x, p.y, RS);
      if (d < R && !hidden) { k = 1 - d / R; fx += dx * k * 0.05; fy += dy * k * 0.05; p.k = k; near.push(p); }
      p.vx = (p.vx + fx) * 0.82; p.vy = (p.vy + fy) * 0.82; p.x += p.vx; p.y += p.vy;
      if (hidden) continue;
      x.fillStyle = "rgba(" + INK + "," + (0.22 + k * 0.5) + ")";
      x.beginPath(); x.arc(p.x, p.y, 1.4 + k * 1.6, 0, 6.3); x.fill();
    }
    x.lineWidth = 1;
    for (var a = 0; a < near.length; a++) {
      var pa = near[a];
      if (!crosses(pa.x, pa.y, mx, my, RS)) {
        x.strokeStyle = "rgba(" + INK + "," + pa.k * 0.5 + ")";
        x.beginPath(); x.moveTo(pa.x, pa.y); x.lineTo(mx, my); x.stroke();
      }
      for (var b = a + 1; b < near.length; b++) {
        var pb = near[b], ex = pa.x - pb.x, ey = pa.y - pb.y;
        if (ex * ex + ey * ey < G * G * 1.6 && !crosses(pa.x, pa.y, pb.x, pb.y, RS)) {
          x.strokeStyle = "rgba(" + INK + "," + Math.min(pa.k, pb.k) * 0.28 + ")";
          x.beginPath(); x.moveTo(pa.x, pa.y); x.lineTo(pb.x, pb.y); x.stroke();
        }
      }
    }
    if (real) { x.strokeStyle = "rgba(" + INK + ",.6)"; x.beginPath(); x.arc(mx, my, 4, 0, 6.3); x.stroke(); }
    requestAnimationFrame(frame);
  }
  size();
  addEventListener("resize", function () {
    if (innerWidth !== W || Math.abs(innerHeight - H) > 150) { size(); if (reduce) still(); }
  });
  if (reduce) { still(); addEventListener("scroll", still, { passive: true }); return; }
  // touch never counts as a mouse: the net keeps roaming on its own
  addEventListener("pointermove", function (e) {
    if (e.pointerType === "touch") { m.on = false; return; }
    m.x = e.clientX; m.y = e.clientY; m.on = true;
  });
  document.documentElement.addEventListener("pointerleave", function () { m.on = false; });
  addEventListener("blur", function () { m.on = false; });
  requestAnimationFrame(frame);
})();
