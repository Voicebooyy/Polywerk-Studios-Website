(function () {
  var reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;

  // Playful tab title while the tab is in the background
  var title = document.title;
  document.addEventListener("visibilitychange", function () { document.title = document.hidden ? "Psst, we're still here." : title; });

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

  // Depth: layers drift at different speeds with scroll and pointer; band slides with scroll; tilt on the tile
  var layers = document.querySelectorAll("[data-depth]"), band = document.querySelector("[data-band]"), bar = document.querySelector(".progress");
  var px = 0, py = 0;
  if (!reduce) {
    addEventListener("pointermove", function (e) { if (e.pointerType !== "touch") { px = e.clientX / innerWidth - 0.5; py = e.clientY / innerHeight - 0.5; } });
    (function loop() {
      var sy = scrollY, H = innerHeight;
      layers.forEach(function (l) {
        var d = +l.dataset.depth;
        l.style.transform = "translate3d(" + (-px * d * 46).toFixed(1) + "px," + (-sy * d * 0.22 - py * d * 46).toFixed(1) + "px,0)";
      });
      document.querySelectorAll(".intro [data-fade]").forEach(function (ib) {
        var pr = Math.min(1, sy / (H * 0.85)); ib.style.opacity = (1 - pr).toFixed(3); ib.style.transform = "translate3d(0," + (sy * 0.35).toFixed(1) + "px,0) scale(" + (1 - pr * 0.07).toFixed(3) + ")"; });
      if (band) band.style.transform = "translate3d(" + (-(H - band.parentNode.getBoundingClientRect().top) * 0.45).toFixed(1) + "px,0,0)";
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll(".tile3d").forEach(function (t) {
      t.addEventListener("pointermove", function (e) {
        var r = t.getBoundingClientRect(), nx = (e.clientX - r.left) / r.width - 0.5, ny = (e.clientY - r.top) / r.height - 0.5;
        t.style.transform = "perspective(900px) rotateY(" + (nx * 9).toFixed(2) + "deg) rotateX(" + (-ny * 9).toFixed(2) + "deg)";
      });
      t.addEventListener("pointerleave", function () { t.style.transform = ""; });
    });
  }
  var railUl = document.querySelector(".rail ul");
  var upd = function () {
    var h = document.documentElement.scrollHeight - innerHeight, f = h > 0 ? Math.min(1, scrollY / h) : 0;
    if (bar) bar.style.transform = "scaleX(" + f + ")";
    if (railUl) railUl.style.setProperty("--p", f);
    document.body.classList.toggle("past", scrollY > innerHeight * 0.6);
  };
  addEventListener("scroll", upd, { passive: true }); upd();
  var ct = document.getElementById("contact");
  if (ct && "IntersectionObserver" in window) {
    new IntersectionObserver(function (en) { document.body.classList.toggle("at-contact", en[0].isIntersecting); }, { threshold: 0.35 }).observe(ct);
  }

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
  // The center follows the mouse and passes freely over text; with no mouse (touch, pointer
  // left) it roams on its own.
  var c = document.getElementById("net");
  if (!c) return;
  var x = c.getContext("2d"), dpr = Math.min(devicePixelRatio || 1, 2), W = 0, H = 0, P = [], G = 60, R = 125, A = 1;
  var m = { x: 0, y: 0, on: false }, ctr = { x: -999, y: -999 };
  var INK = "20,20,20";

  function size() {
    W = innerWidth; H = innerHeight;
    c.width = W * dpr; c.height = H * dpr;
    x.setTransform(dpr, 0, 0, dpr, 0, 0);
    var small = W < 760; A = small ? 0.6 : 1;
    G = Math.max(small ? 80 : 56, Math.sqrt(W * H / (small ? 420 : 650)));
    P = [];
    for (var i = -1; i * G < W + G; i++) for (var j = -1; j * G < H + G; j++) {
      var hx = i * G + (Math.random() - 0.5) * G * 0.75, hy = j * G + (Math.random() - 0.5) * G * 0.75;
      P.push({ hx: hx, hy: hy, x: hx, y: hy, vx: 0, vy: 0 });
    }
  }
  function still() {
    x.clearRect(0, 0, W, H);
    x.fillStyle = "rgba(" + INK + ",.25)";
    P.forEach(function (p) { x.beginPath(); x.arc(p.x, p.y, 1.5, 0, 6.3); x.fill(); });
  }
  function frame(t) {
    var real = m.on, tx, ty;
    if (real) { tx = m.x; ty = m.y; }
    else { tx = W * (0.5 + 0.36 * Math.sin(t / 2300)); ty = H * (0.5 + 0.34 * Math.sin(t / 3100 + 1)); }
    if (ctr.x < -900) { ctr.x = tx; ctr.y = ty; }
    var f = real ? 0.35 : 0.07;
    ctr.x += (tx - ctr.x) * f; ctr.y += (ty - ctr.y) * f;
    var mx = ctr.x, my = ctr.y;
    x.clearRect(0, 0, W, H);
    var near = [];
    for (var i = 0; i < P.length; i++) {
      var p = P[i], dx = mx - p.x, dy = my - p.y, d = Math.sqrt(dx * dx + dy * dy);
      var fx = (p.hx - p.x) * 0.06, fy = (p.hy - p.y) * 0.06, k = 0;
      if (d < R) { k = 1 - d / R; fx += dx * k * 0.05; fy += dy * k * 0.05; p.k = k; near.push(p); }
      p.vx = (p.vx + fx) * 0.82; p.vy = (p.vy + fy) * 0.82; p.x += p.vx; p.y += p.vy;
      x.fillStyle = "rgba(" + INK + "," + (0.22 + k * 0.5) * A + ")";
      x.beginPath(); x.arc(p.x, p.y, 1.4 + k * 1.6, 0, 6.3); x.fill();
    }
    x.lineWidth = 1;
    for (var a = 0; a < near.length; a++) {
      var pa = near[a];
      x.strokeStyle = "rgba(" + INK + "," + pa.k * 0.5 * A + ")";
      x.beginPath(); x.moveTo(pa.x, pa.y); x.lineTo(mx, my); x.stroke();
      for (var b = a + 1; b < near.length; b++) {
        var pb = near[b], ex = pa.x - pb.x, ey = pa.y - pb.y;
        if (ex * ex + ey * ey < G * G * 1.6) {
          x.strokeStyle = "rgba(" + INK + "," + Math.min(pa.k, pb.k) * 0.28 * A + ")";
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
  if (reduce) { still(); return; }
  // touch never counts as a mouse: the net keeps roaming on its own
  addEventListener("pointermove", function (e) {
    if (e.pointerType === "touch") { m.on = false; return; }
    m.x = e.clientX; m.y = e.clientY; m.on = true;
  });
  document.documentElement.addEventListener("pointerleave", function () { m.on = false; });
  addEventListener("blur", function () { m.on = false; });
  requestAnimationFrame(frame);
})();
