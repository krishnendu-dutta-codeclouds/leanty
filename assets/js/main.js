
(function () {
  'use strict';

  var hasGSAP = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';

  if (hasGSAP) {
    document.documentElement.classList.add('gsap-ready');
    gsap.registerPlugin(ScrollTrigger);
    if (typeof ScrollTrigger.normalizeScroll === 'function') {
      ScrollTrigger.normalizeScroll(true);
    }
  } else {
    console.warn('[Leanty] GSAP failed to load — animations disabled.');
  }

  /* ============================================================
     1.  HERO INTRO TIMELINE
     ============================================================ */
  function initHeroIntro() {
    if (!hasGSAP) return;
    if (document.querySelector('.hero h1') == null) return;
    var eyebrow = document.querySelector('.hero > .wrap > .pill');
    var words = document.querySelectorAll('.hero h1 .word span');
    var copy = document.querySelectorAll('.hero h1 + p, .hero-meta, .hero-ctas, .hero-ctas + .gs-fade');
    var cards = document.querySelectorAll('.hero-card');
    var stats = document.querySelectorAll('.hero-stat');
    var hiddenEls = [eyebrow]
      .concat(gsap.utils.toArray(copy))
      .concat(gsap.utils.toArray(cards))
      .concat(gsap.utils.toArray(stats))
      .filter(Boolean);

    gsap.set(words, { yPercent: 110, autoAlpha: 1 });
    gsap.set(hiddenEls, { autoAlpha: 0 });
    gsap.set(copy, { y: 18 });
    gsap.set(cards, { y: 36, scale: 0.82, rotate: -2, transformOrigin: '50% 55%' });
    gsap.set(stats, { y: 24, scale: 0.96 });

    var tl = gsap.timeline({
      defaults: { ease: 'expo.out' },
      onComplete: initHeroFloat
    });

    tl.fromTo('.nav-inner',
        { y: -28, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.75 }
      )
      .to(eyebrow, { y: 0, autoAlpha: 1, duration: 0.55 }, '-=0.35')
      .fromTo(words,
        { yPercent: 110 },
        { yPercent: 0, duration: 1.05, stagger: 0.075, immediateRender: false },
        '-=0.25'
      )
      .to(copy, { y: 0, autoAlpha: 1, duration: 0.62, stagger: 0.055 }, '-=0.65')
      .to(cards, {
        y: 0,
        scale: 1,
        rotate: 0,
        autoAlpha: 1,
        duration: 1,
        stagger: 0.12,
        ease: 'back.out(1.35)'
      }, '-=0.85')
      .to(stats, { y: 0, scale: 1, autoAlpha: 1, duration: 0.65, stagger: 0.1 }, '-=0.45');
  }

  /* ============================================================
     2.  HERO FLOATING MOTION (infinite yoyo)
     ============================================================ */
  function initHeroFloat() {
    if (!hasGSAP) return;
    if (initHeroFloat.started) return;
    initHeroFloat.started = true;
    gsap.to('.hero-float',   { y: '-=20', duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.hero-float-2', { y: '-=14', duration: 5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.4 });
    gsap.to('.hero-float-3', { y: '-=10', rotation: 3, duration: 3.5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.2 });
  }

  /* ============================================================
     3.  MARQUEE (infinite scroll)
     ============================================================ */
  function initMarquee() {
    if (!hasGSAP) return;
    var track = document.querySelector('.hero-marquee .track');
    if (!track) return;
    gsap.to(track, { xPercent: -50, duration: 30, repeat: -1, ease: 'linear' });
  }

  /* ============================================================
     4.  REVEAL ANIMATIONS (text + clip-path image reveals)
     ============================================================ */
  function initReveals() {
    if (!hasGSAP) return;
    gsap.utils.toArray('.reveal').forEach(function (el) {
      gsap.to(el, {
        y: 0, opacity: 1, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%' }
      });
    });
    gsap.utils.toArray('.reveal-img').forEach(function (el) {
      gsap.to(el, {
        clipPath: 'inset(0% 0 0 0)', duration: 1.2, ease: 'power4.out',
        scrollTrigger: { trigger: el, start: 'top 85%' }
      });
    });
  }

  /* ============================================================
     5.  HEADLINE WORD-MASK REVEALS
     ============================================================ */
  function initHeadlineReveals() {
    if (!hasGSAP) return;
    var groups = ['.section-head h2', '.faq h2', '.cta h2'];
    groups.forEach(function (selector) {
      gsap.utils.toArray(selector).forEach(function (h) {
        var words = h.querySelectorAll('.word span');
        if (!words.length) return;
        gsap.from(words, {
          yPercent: 110, opacity: 0, duration: 1, stagger: 0.05, ease: 'expo.out',
          scrollTrigger: { trigger: h, start: 'top 85%' }
        });
      });
    });
  }

  /* ============================================================
     6.  COUNTER ANIMATION (number roll-up)
     ============================================================ */
  function initCounters() {
    if (!hasGSAP) return;
    gsap.utils.toArray('.stat .num span').forEach(function (span) {
      var target = parseFloat(span.dataset.count) || 0;
      var obj = { v: 0 };
      gsap.to(obj, {
        v: target, duration: 2, ease: 'power2.out',
        scrollTrigger: { trigger: span, start: 'top 85%' },
        onUpdate: function () { span.textContent = Math.round(obj.v); }
      });
    });
  }

  /* ============================================================
     7.  STAGGERED CARD REVEALS
     ============================================================ */
  function initStaggerCards() {
    if (!hasGSAP) return;
    var groups = [
      { sel: '.feat',  delay: 0.05 },
      { sel: '.step',  delay: 0.10 },
      { sel: '.t-card', delay: 0.06 },
      { sel: '.doc',   delay: 0.06 },
      { sel: '.stat',  delay: 0.08 }
    ];
    groups.forEach(function (g) {
      gsap.utils.toArray(g.sel).forEach(function (el, i) {
        gsap.fromTo(el, { y: 60, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.8, delay: i * g.delay, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%' }
        });
      });
    });
  }

  /* ============================================================
     8.  HERO PARALLAX
     ============================================================ */
  function initHeroParallax() {
    if (!hasGSAP) return;
    var side = document.querySelector('.hero-side');
    if (!side) return;
    gsap.to(side, {
      yPercent: -8, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
  }

  /* ============================================================
     9.  PRODUCT STAGE VIAL / CARD REVEAL
     ============================================================ */
  function initProductStage() {
    if (!hasGSAP) return;
    var stage = document.querySelector('.product-stage');
    if (!stage) return;
    gsap.from('.vial', {
      y: 60, opacity: 0, rotate: 6, duration: 1.2, stagger: 0.1, ease: 'back.out(1.2)',
      scrollTrigger: { trigger: stage, start: 'top 80%' }
    });
    gsap.from('.switch-card', {
      scale: 0.6, opacity: 0, duration: 1, ease: 'back.out(1.4)',
      scrollTrigger: { trigger: stage, start: 'top 80%' }
    });
  }

  /* ============================================================
     10. CTA GLOW DRIFT
     ============================================================ */
  function initCtaGlow() {
    if (!hasGSAP) return;
    var glow  = document.querySelector('.cta .glow');
    var glow2 = document.querySelector('.cta .glow.g2');
    if (glow)  gsap.to(glow,  { x: 60,  y: 30,  duration: 8,  repeat: -1, yoyo: true, ease: 'sine.inOut' });
    if (glow2) gsap.to(glow2, { x: -60, y: -30, duration: 10, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  }

  /* ============================================================
     11. BEFORE / AFTER DRAG SLIDER
     ============================================================ */
  function initBASlider() {
    var slider  = document.getElementById('baSlider');
    var before  = document.getElementById('baBefore');
    var handle  = document.getElementById('baHandle');
    if (!slider || !before || !handle) return;

    var dragging = false;

    function getX(e) {
      if (e.touches && e.touches.length) return e.touches[0].clientX;
      if (e.changedTouches && e.changedTouches.length) return e.changedTouches[0].clientX;
      return e.clientX;
    }

    function syncSliderWidth() {
      slider.style.setProperty('--ba-slider-width', slider.getBoundingClientRect().width + 'px');
    }

    function setBA(x) {
      syncSliderWidth();
      var rect = slider.getBoundingClientRect();
      var pct  = (x - rect.left) / rect.width;
      pct = Math.max(0.05, Math.min(0.95, pct));
      if (hasGSAP) {
        gsap.to(before, { width: (pct * 100) + '%', duration: 0.18, ease: 'power2.out', overwrite: 'auto' });
        gsap.to(handle, { left: (pct * 100) + '%', duration: 0.18, ease: 'power2.out', overwrite: 'auto' });
      } else {
        before.style.width = (pct * 100) + '%';
        handle.style.left = (pct * 100) + '%';
      }
    }

    slider.addEventListener('mousedown',  function (e) { dragging = true; setBA(e.clientX); });
    window.addEventListener('mouseup',    function ()  { dragging = false; });
    window.addEventListener('mousemove',  function (e) { if (dragging) setBA(e.clientX); });

    slider.addEventListener('touchstart', function (e) { dragging = true; setBA(getX(e)); }, { passive: true });
    window.addEventListener('touchend',   function ()  { dragging = false; });
    window.addEventListener('touchmove',  function (e) { if (dragging) setBA(getX(e)); }, { passive: true });

    syncSliderWidth();

    // Recalculate clipped image size on resize
    window.addEventListener('resize', function () {
      syncSliderWidth();
    });
  }

  /* ============================================================
     12. WEIGHT-LOSS ESTIMATOR
     ============================================================ */
  function initEstimator() {
    var sw       = document.getElementById('sw');
    var swVal    = document.getElementById('swVal');
    var estLoss  = document.getElementById('estLoss');
    var tgt      = document.getElementById('tgt');
    var durSeg   = document.getElementById('durSeg');
    if (!sw || !durSeg) return;

    var duration = 6;

    function calc() {
      var startW = parseInt(sw.value, 10) || 0;
      swVal.textContent = startW;

      // ~6% of body weight lost per month under medical supervision
      var lossPerMonth = startW * 0.06;
      var loss = Math.round(lossPerMonth * duration);
      estLoss.textContent = loss;
      tgt.textContent = (startW - loss) + ' lbs';

      // Update the slider fill gradient
      var min = parseFloat(sw.min) || 0;
      var max = parseFloat(sw.max) || 100;
      var p   = ((startW - min) / (max - min)) * 100;
      sw.style.background =
        'linear-gradient(to right, var(--ink) 0%, var(--ink) ' + p +
        '%, #cdc7b9 ' + p + '%, #cdc7b9 100%)';
    }

    sw.addEventListener('input', calc);

    durSeg.querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', function () {
        durSeg.querySelectorAll('button').forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
        duration = parseInt(b.dataset.v, 10) || 6;
        calc();
      });
    });

    calc();
  }

  /* ============================================================
     13. FAQ ACCORDION
     ============================================================ */
  function initFAQ() {
    document.querySelectorAll('.faq-item').forEach(function (item) {
      item.addEventListener('click', function () { item.classList.toggle('open'); });
    });
  }

  /* ============================================================
     14. SMOOTH ANCHOR SCROLL
     ============================================================ */
  function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        if (!id || id.length <= 1) return;
        var el = document.querySelector(id);
        if (!el) return;
        e.preventDefault();
        var offset = parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--header-offset'), 10) || 80;
        window.scrollTo({
          top: el.getBoundingClientRect().top + window.scrollY - offset,
          behavior: 'smooth'
        });
      });
    });
  }

  /* ============================================================
     15. MOBILE MENU
     ============================================================ */
  function initMobileMenu() {
    var toggle = document.querySelector('.menu-toggle');
    var menu = document.getElementById('mobileMenu');
    var closeEls = document.querySelectorAll('[data-menu-close], .mobile-links a, .mobile-cta');
    if (!toggle || !menu) return;

    function setOpen(open) {
      document.body.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      menu.setAttribute('aria-hidden', open ? 'false' : 'true');
    }

    toggle.addEventListener('click', function () {
      setOpen(!document.body.classList.contains('menu-open'));
    });

    closeEls.forEach(function (el) {
      el.addEventListener('click', function () { setOpen(false); });
    });

    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 980) setOpen(false);
    });
  }

  /* ============================================================
     16. INIT — wait for DOM + fonts so measurements are correct
     ============================================================ */
  function init() {
    initHeroIntro();
    initMarquee();
    initReveals();
    initHeadlineReveals();
    initCounters();
    initStaggerCards();
    initHeroParallax();
    initProductStage();
    initCtaGlow();
    initBASlider();
    initEstimator();
    initFAQ();
    initSmoothAnchors();
    initMobileMenu();

    // Refresh ScrollTrigger after webfonts load (avoids misaligned triggers)
    if (hasGSAP && document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
    }
    // Also refresh once on full window load (images may shift layout)
    if (hasGSAP) {
      window.addEventListener('load', function () { ScrollTrigger.refresh(); });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
