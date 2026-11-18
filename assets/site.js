(function () {
  var reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;
  var hasIO = "IntersectionObserver" in window;
  var root = document.documentElement, body = document.body;

  // Playful tab title while the tab is in the background
  var title = document.title;
  document.addEventListener("visibilitychange", function () {
    document.title = document.hidden ? "Psst, we're still here." : title;
  });

  // Scroll reveal: toggles both ways, so animations replay on every pass
  var reveals = document.querySelectorAll("[data-r]");
  if (hasIO) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { x.target.classList.toggle("in", x.isIntersecting); });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    reveals.forEach(function (e) { io.observe(e); });
  } else reveals.forEach(function (e) { e.classList.add("in"); });

  // Fast eased scroll; any wheel or touch input cancels it
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

  // Mobile menu: focus moves into the list on open and back to the button on close
  var rail = document.querySelector(".rail"), btn = document.querySelector(".rail-btn");
  function isOpen() { return rail && rail.classList.contains("open"); }
  function closeMenu(refocus) {
    if (!isOpen()) return;
    rail.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");
    if (refocus) btn.focus();
  }
  if (rail && btn) {
    btn.addEventListener("click", function () {
      if (isOpen()) { closeMenu(true); return; }
      rail.classList.add("open");
      btn.setAttribute("aria-expanded", "true");
      rail.querySelector("ul a").focus();
    });
    document.addEventListener("click", function (e) { if (isOpen() && !rail.contains(e.target)) closeMenu(true); });
    addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(true); });
  }

  // In-page links: animated scroll, then keyboard focus moves to the target
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href").slice(1), t = document.getElementById(id);
      if (!t) return;
      e.preventDefault();
      closeMenu(false);
      go(t.getBoundingClientRect().top + scrollY);
      t.focus({ preventScroll: true });
      history.replaceState(null, "", "#" + id);
    });
  });

  // Menu marks the section in view (aria-current also tells screen readers)
  var links = {};
  document.querySelectorAll(".rail a").forEach(function (a) { links[a.getAttribute("href").slice(1)] = a; });
  if (hasIO) {
    var so = new IntersectionObserver(function (en) {
      en.forEach(function (x) {
        if (!x.isIntersecting) return;
        for (var k in links) {
          if (k === x.target.id) links[k].setAttribute("aria-current", "true");
          else links[k].removeAttribute("aria-current");
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    document.querySelectorAll("main section").forEach(function (s) { so.observe(s); });
    var ct = document.getElementById("contact");
    if (ct) new IntersectionObserver(function (en) { body.classList.toggle("at-contact", en[0].isIntersecting); }, { threshold: 0.35 }).observe(ct);
  }

  // Scroll-driven effects, computed only when something changed (no idle loop):
  // menu progress line, "past the banner" flag, banner fade, floating hexagons.
  var railUl = document.querySelector(".rail ul"), home = document.getElementById("home");
  var layers = document.querySelectorAll("[data-depth]"), fades = document.querySelectorAll(".intro [data-fade]");
  var px = 0, py = 0, homeOn = true, queued = false;
  function paint() {
    queued = false;
    var sy = scrollY, H = innerHeight, h = root.scrollHeight - H;
    if (railUl) railUl.style.setProperty("--p", h > 0 ? Math.min(1, sy / h) : 0);
    body.classList.toggle("past", sy > H * 0.6);
    if (reduce || !homeOn) return;
    layers.forEach(function (l) {
      var d = +l.dataset.depth;
      l.style.transform = "translate3d(" + (-px * d * 46).toFixed(1) + "px," + (-sy * d * 0.22 - py * d * 46).toFixed(1) + "px,0)";
    });
    var pr = Math.min(1, sy / (H * 0.85));
    fades.forEach(function (f) {
      f.style.opacity = (1 - pr).toFixed(3);
      f.style.transform = "translate3d(0," + (sy * 0.35).toFixed(1) + "px,0) scale(" + (1 - pr * 0.07).toFixed(3) + ")";
    });
  }
  function request() { if (!queued) { queued = true; requestAnimationFrame(paint); } }
  addEventListener("scroll", request, { passive: true });
  addEventListener("resize", request);
  if (!reduce) addEventListener("pointermove", function (e) {
    if (e.pointerType === "touch" || !homeOn) return;
    px = e.clientX / innerWidth - 0.5; py = e.clientY / innerHeight - 0.5;
    request();
  });
  if (home && hasIO) new IntersectionObserver(function (en) { homeOn = en[0].isIntersecting; if (homeOn) request(); }).observe(home);
  paint();

  // Games tile tilts toward the pointer
  if (!reduce) document.querySelectorAll(".tile3d").forEach(function (t) {
    t.addEventListener("pointermove", function (e) {
      var r = t.getBoundingClientRect(), nx = (e.clientX - r.left) / r.width - 0.5, ny = (e.clientY - r.top) / r.height - 0.5;
      t.style.transform = "perspective(900px) rotateY(" + (nx * 9).toFixed(2) + "deg) rotateX(" + (-ny * 9).toFixed(2) + "deg)";
    });
    t.addEventListener("pointerleave", function () { t.style.transform = ""; });
  });

  // Cursor net: dots are pulled toward a center point and linked to it with thin lines.
  // The center follows the mouse and passes freely over text; with no mouse (touch,
  // pointer left the page) it roams on its own. Drawing is batched (one path per shade
  // level) and limited to the area that changed: resting dots stay on the canvas.
  var c = document.getElementById("net");
  if (!c) return;
  var x = c.getContext("2d"), dpr = Math.min(devicePixelRatio || 1, 2);
  var W = 0, H = 0, P = [], G = 60, R = 125, A = 1, LV = 8;
  var m = { x: 0, y: 0, on: false }, ctr = { x: -999, y: -999 }, box = null;
  function ink(a) { return "rgba(20,20,20," + a.toFixed(3) + ")"; }

  function size() {
    W = innerWidth; H = innerHeight;
    c.width = W * dpr; c.height = H * dpr;
    x.setTransform(dpr, 0, 0, dpr, 0, 0);
    var small = W < 760;
    A = small ? 0.6 : 1;
    G = Math.max(small ? 80 : 56, Math.sqrt(W * H / (small ? 420 : 650)));
    P = [];
    for (var i = -1; i * G < W + G; i++) for (var j = -1; j * G < H + G; j++) {
      var hx = i * G + (Math.random() - 0.5) * G * 0.75, hy = j * G + (Math.random() - 0.5) * G * 0.75;
      P.push({ hx: hx, hy: hy, x: hx, y: hy, vx: 0, vy: 0, k: 0 });
    }
    box = null; // canvas was reset: draw everything once
  }
  function grow(b, px, py, r) {
    if (px - r < b[0]) b[0] = px - r; if (py - r < b[1]) b[1] = py - r;
    if (px + r > b[2]) b[2] = px + r; if (py + r > b[3]) b[3] = py + r;
  }
  function dotPath(list, r) {
    x.beginPath();
    for (var i = 0; i < list.length; i++) { var p = list[i]; x.moveTo(p.x + r, p.y); x.arc(p.x, p.y, r, 0, 6.2832); }
  }
  function still() { x.clearRect(0, 0, W, H); x.fillStyle = ink(0.25); dotPath(P, 1.5); x.fill(); }

  function frame(t) {
    var real = m.on, tx, ty;
    if (real) { tx = m.x; ty = m.y; }
    else { tx = W * (0.5 + 0.36 * Math.sin(t / 2300)); ty = H * (0.5 + 0.34 * Math.sin(t / 3100 + 1)); }
    if (ctr.x < -900) { ctr.x = tx; ctr.y = ty; }
    var f = real ? 0.35 : 0.07;
    ctr.x += (tx - ctr.x) * f; ctr.y += (ty - ctr.y) * f;
    var mx = ctr.x, my = ctr.y, far = [], near = [], lvl = [], spokes = [], pairs = [], l;
    var cur = [mx, my, mx, my]; grow(cur, mx, my, 8);
    for (l = 0; l < LV; l++) { lvl.push([]); spokes.push([]); pairs.push([]); }

    for (var i = 0; i < P.length; i++) {
      var p = P[i], ox = p.x, oy = p.y, dx = mx - p.x, dy = my - p.y, d = Math.sqrt(dx * dx + dy * dy);
      var fx = (p.hx - p.x) * 0.06, fy = (p.hy - p.y) * 0.06;
      p.k = 0;
      if (d < R) { p.k = 1 - d / R; fx += dx * p.k * 0.05; fy += dy * p.k * 0.05; }
      p.vx = (p.vx + fx) * 0.82; p.vy = (p.vy + fy) * 0.82; p.x += p.vx; p.y += p.vy;
      // a dot that moves (or was moved) needs its old and new spot repainted
      if (p.k > 0 || Math.abs(p.vx) + Math.abs(p.vy) > 0.01 || Math.abs(p.x - p.hx) + Math.abs(p.y - p.hy) > 0.05) { grow(cur, ox, oy, 5); grow(cur, p.x, p.y, 5); }
      if (p.k > 0) { p.l = Math.min(LV - 1, (p.k * LV) | 0); near.push(p); lvl[p.l].push(p); spokes[p.l].push(p); }
      else far.push(p);
    }
    for (var a = 0; a < near.length; a++) for (var b = a + 1; b < near.length; b++) {
      var pa = near[a], pb = near[b], ex = pa.x - pb.x, ey = pa.y - pb.y;
      if (ex * ex + ey * ey < G * G * 1.6) pairs[Math.min(pa.l, pb.l)].push(pa, pb);
    }

    // repaint only last frame's area plus this frame's area
    var r = box ? [Math.min(box[0], cur[0]), Math.min(box[1], cur[1]), Math.max(box[2], cur[2]), Math.max(box[3], cur[3])] : [0, 0, W, H];
    r[0] = Math.max(0, Math.floor(r[0])); r[1] = Math.max(0, Math.floor(r[1])); r[2] = Math.min(W, Math.ceil(r[2])); r[3] = Math.min(H, Math.ceil(r[3]));
    box = cur;
    x.save(); x.beginPath(); x.rect(r[0], r[1], r[2] - r[0], r[3] - r[1]); x.clip();
    x.clearRect(r[0], r[1], r[2] - r[0], r[3] - r[1]);
    var inside = far.filter(function (p) { return p.x > r[0] - 3 && p.x < r[2] + 3 && p.y > r[1] - 3 && p.y < r[3] + 3; });
    x.fillStyle = ink(0.22 * A); dotPath(inside, 1.4); x.fill();
    x.lineWidth = 1;
    for (l = 0; l < LV; l++) {
      var kq = (l + 0.5) / LV, j;
      if (lvl[l].length) { x.fillStyle = ink((0.22 + kq * 0.5) * A); dotPath(lvl[l], 1.4 + kq * 1.6); x.fill(); }
      if (spokes[l].length) {
        x.strokeStyle = ink(kq * 0.5 * A); x.beginPath();
        for (j = 0; j < spokes[l].length; j++) { x.moveTo(spokes[l][j].x, spokes[l][j].y); x.lineTo(mx, my); }
        x.stroke();
      }
      if (pairs[l].length) {
        x.strokeStyle = ink(kq * 0.28 * A); x.beginPath();
        for (j = 0; j < pairs[l].length; j += 2) { x.moveTo(pairs[l][j].x, pairs[l][j].y); x.lineTo(pairs[l][j + 1].x, pairs[l][j + 1].y); }
        x.stroke();
      }
    }
    if (real) { x.strokeStyle = ink(0.6); x.beginPath(); x.arc(mx, my, 4, 0, 6.2832); x.stroke(); }
    x.restore();
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
  root.addEventListener("pointerleave", function () { m.on = false; });
  addEventListener("blur", function () { m.on = false; });
  requestAnimationFrame(frame);
})();
