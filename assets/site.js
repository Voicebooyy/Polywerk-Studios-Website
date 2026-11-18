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

  // Cursor net: dots are pulled toward the pointer and linked to it with thin lines
  var c = document.getElementById("net");
  if (!c) return;
  var x = c.getContext("2d"), dpr = Math.min(devicePixelRatio || 1, 2), W = 0, H = 0, P = [], G = 60, R = 170;
  var m = { x: 0, y: 0, on: false, last: -9999 };
  var INK = "20,20,20";

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
    x.clearRect(0, 0, W, H);
    x.fillStyle = "rgba(" + INK + ",.25)";
    P.forEach(function (p) { x.beginPath(); x.arc(p.x, p.y, 1.5, 0, 6.3); x.fill(); });
  }
  function frame(t) {
    var mx, my, real = m.on && t - m.last < 4000;
    if (real) { mx = m.x; my = m.y; }
    else { mx = W * (0.5 + 0.32 * Math.sin(t / 2600)); my = H * (0.5 + 0.3 * Math.sin(t / 3300 + 1)); }
    x.clearRect(0, 0, W, H);
    var near = [];
    for (var i = 0; i < P.length; i++) {
      var p = P[i], dx = mx - p.x, dy = my - p.y, d = Math.sqrt(dx * dx + dy * dy);
      var fx = (p.hx - p.x) * 0.06, fy = (p.hy - p.y) * 0.06, k = 0;
      if (d < R) { k = 1 - d / R; fx += dx * k * 0.05; fy += dy * k * 0.05; p.d = d; p.k = k; near.push(p); }
      p.vx = (p.vx + fx) * 0.82; p.vy = (p.vy + fy) * 0.82; p.x += p.vx; p.y += p.vy;
      x.fillStyle = "rgba(" + INK + "," + (0.22 + k * 0.5) + ")";
      x.beginPath(); x.arc(p.x, p.y, 1.4 + k * 1.6, 0, 6.3); x.fill();
    }
    x.lineWidth = 1;
    for (var a = 0; a < near.length; a++) {
      var pa = near[a];
      x.strokeStyle = "rgba(" + INK + "," + pa.k * 0.5 + ")";
      x.beginPath(); x.moveTo(pa.x, pa.y); x.lineTo(mx, my); x.stroke();
      for (var b = a + 1; b < near.length; b++) {
        var pb = near[b], ex = pa.x - pb.x, ey = pa.y - pb.y;
        if (ex * ex + ey * ey < G * G * 2.2) {
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
  if (reduce) { still(); return; }
  addEventListener("pointermove", function (e) { m.x = e.clientX; m.y = e.clientY; m.on = true; m.last = performance.now(); });
  document.addEventListener("pointerleave", function () { m.on = false; });
  requestAnimationFrame(frame);
})();
