/* =========================================================================
   Prashant Singh — Portfolio
   No dependencies. Everything degrades gracefully without JS.
   ========================================================================= */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------ Theme -------------------------------- */
  var themeToggle = document.getElementById('theme-toggle');
  function syncThemeToggle() {
    if (!themeToggle) return;
    var isLight = root.dataset.theme === 'light';
    themeToggle.setAttribute('aria-pressed', String(isLight));
    themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
  }
  if (themeToggle) {
    syncThemeToggle();
    themeToggle.addEventListener('click', function () {
      var next = root.dataset.theme === 'light' ? 'dark' : 'light';
      root.dataset.theme = next;
      try { localStorage.setItem('theme', next); } catch (e) { /* private mode */ }
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', next === 'light' ? '#fbfbf9' : '#0a0b0d');
      syncThemeToggle();
    });
  }

  /* --------------------------- Mobile menu ----------------------------- */
  var menuBtn = document.getElementById('menu-btn');
  var nav = document.getElementById('nav');

  function closeMenu() {
    if (!nav || !menuBtn) return;
    nav.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Open navigation menu');
  }

  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') closeMenu();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 880) closeMenu();
    });
  }

  /* --------------------- Header shadow on scroll ----------------------- */
  var header = document.getElementById('header');
  var scrollProgress = document.getElementById('scroll-progress');
  var backToTop = document.getElementById('back-to-top');
  function onScroll() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    if (header) header.classList.toggle('is-stuck', scrollTop > 8);
    if (backToTop) backToTop.classList.toggle('is-visible', scrollTop > 720);
    if (scrollProgress) {
      var max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      scrollProgress.style.transform = 'scaleX(' + Math.min(scrollTop / max, 1) + ')';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ----------------------- Pointer surface depth ----------------------- */
  if (!reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.hero-panel, .card, .tl-card, .contact').forEach(function (surface) {
      surface.addEventListener('pointermove', function (event) {
        var rect = surface.getBoundingClientRect();
        var x = ((event.clientX - rect.left) / rect.width) * 100;
        var y = ((event.clientY - rect.top) / rect.height) * 100;
        surface.style.setProperty('--spotlight-x', x + '%');
        surface.style.setProperty('--spotlight-y', y + '%');
        if (surface.classList.contains('hero-panel')) {
          surface.style.setProperty('--tilt-x', ((y - 50) / -28).toFixed(2) + 'deg');
          surface.style.setProperty('--tilt-y', ((x - 50) / 32).toFixed(2) + 'deg');
        }
      });
      surface.addEventListener('pointerenter', function () { surface.classList.add('is-pointer-active'); });
      surface.addEventListener('pointerleave', function () {
        surface.classList.remove('is-pointer-active');
        surface.style.setProperty('--tilt-x', '0deg');
        surface.style.setProperty('--tilt-y', '0deg');
      });
    });
  }

  /* --------------------------- Reveal on view -------------------------- */
  var revealables = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window) || reduceMotion) {
    revealables.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        // Stagger siblings that enter together for a softer cascade.
        window.setTimeout(function () { el.classList.add('is-visible'); }, i * 70);
        revealObserver.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    revealables.forEach(function (el) { revealObserver.observe(el); });
  }

  /* -------------------------- Active nav link -------------------------- */
  var sections = Array.prototype.slice.call(
    document.querySelectorAll('main section[id]')
  );
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav a'));

  if ('IntersectionObserver' in window && sections.length) {
    var visible = new Set();
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) visible.add(entry.target.id);
        else visible.delete(entry.target.id);
      });
      // Highlight the topmost section currently in view.
      var current = sections.map(function (s) { return s.id; })
        .filter(function (id) { return visible.has(id); })[0];
      navLinks.forEach(function (link) {
        link.classList.toggle('is-active', link.getAttribute('href') === '#' + current);
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (s) { sectionObserver.observe(s); });
  }

  /* -------------------------- Counting stats --------------------------- */
  function formatCount(el, value) {
    var prefix = el.dataset.prefix || '';
    var suffix = el.dataset.suffix || '';
    return prefix + value + suffix;
  }

  function countUp(el) {
    var target = parseInt(el.dataset.count, 10);
    if (isNaN(target)) return;
    if (reduceMotion) { el.textContent = formatCount(el, target); return; }

    var duration = 1100;
    var start = null;

    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = formatCount(el, Math.round(target * eased));
      if (p < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }

  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window) {
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        countUp(entry.target);
        countObserver.unobserve(entry.target);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { countObserver.observe(el); });
  } else {
    counters.forEach(function (el) { el.textContent = formatCount(el, el.dataset.count); });
  }

  /* --------------------- Hero pipeline animation ----------------------- */
  var pipeline = document.getElementById('pipeline');
  var waveEl = document.getElementById('wave');
  var latencyEl = document.getElementById('latency');

  if (waveEl) {
    for (var b = 0; b < 28; b++) waveEl.appendChild(document.createElement('span'));
  }

  if (pipeline && !reduceMotion) {
    var stages = Array.prototype.slice.call(pipeline.querySelectorAll('.stage'));
    var bars = waveEl ? Array.prototype.slice.call(waveEl.children) : [];
    var index = 0;
    var running = true;
    var cycleTimer = null;
    var waveTimer = null;

    function cycle() {
      stages.forEach(function (s, i) { s.classList.toggle('is-active', i === index); });
      index = (index + 1) % stages.length;

      // A fresh plausible round-trip figure each full pass through the stack.
      if (index === 0 && latencyEl) {
        latencyEl.textContent = String(800 + Math.floor(Math.random() * 100));
      }
    }

    function animateWave() {
      bars.forEach(function (bar, i) {
        var base = Math.sin((Date.now() / 190) + i * 0.55);
        var jitter = Math.random() * 0.5;
        var height = Math.max(10, Math.abs(base) * 62 + jitter * 34);
        bar.style.height = height + '%';
      });
    }

    function start() {
      if (cycleTimer) return;
      cycle();
      cycleTimer = window.setInterval(cycle, 1400);
      if (bars.length) waveTimer = window.setInterval(animateWave, 110);
    }

    function stop() {
      window.clearInterval(cycleTimer);
      window.clearInterval(waveTimer);
      cycleTimer = waveTimer = null;
    }

    // Only animate while the panel is on screen and the tab is focused.
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        running = entries[0].isIntersecting;
        if (running && !document.hidden) start(); else stop();
      }, { threshold: 0.2 }).observe(pipeline);
    } else {
      start();
    }

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop();
      else if (running) start();
    });
  }

  /* ----------------------------- Copy email ---------------------------- */
  document.querySelectorAll('.copy-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var text = btn.dataset.copy || '';
      var done = function () {
        var original = btn.textContent;
        btn.textContent = 'Copied';
        btn.classList.add('is-copied');
        window.setTimeout(function () {
          btn.textContent = original;
          btn.classList.remove('is-copied');
        }, 1600);
      };

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done).catch(function () { fallbackCopy(text, done); });
      } else {
        fallbackCopy(text, done);
      }
    });
  });

  function fallbackCopy(text, done) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); done(); } catch (e) { /* nothing to do */ }
    document.body.removeChild(ta);
  }

  /* ------------------------------- Footer ------------------------------ */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
