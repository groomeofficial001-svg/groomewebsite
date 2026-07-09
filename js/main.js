/* =========================================================
   GROOME — interactions (dependency-free)
   ========================================================= */
(function () {
  'use strict';

  /* ---- Splash Screen ----
     Show on: first visit from outside + page reload
     Skip on: internal navigation between pages
  ---- */
  var splash = document.getElementById('splash-screen');
  var splashLogo = document.querySelector('.splash-logo');
  if (splash && splashLogo && typeof gsap !== 'undefined') {
    // Check if navigating from within the same site
    var referrer = document.referrer;
    var siteHost = window.location.hostname;
    var isInternalNav = referrer && (referrer.indexOf(siteHost) !== -1 || (siteHost === '' && referrer.indexOf('file://') !== -1));

    if (isInternalNav) {
      // Coming from another page on this site — skip splash immediately
      splash.style.display = 'none';
    } else {
      // First visit or reload — show splash animation
      document.body.style.overflow = 'hidden';
      gsap.to(splashLogo, {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "power3.out"
      });
      gsap.to(splashLogo, {
        opacity: 0,
        scale: 1.1,
        duration: 0.4,
        delay: 1.2,
        ease: "power2.in"
      });
      gsap.to(splash, {
        opacity: 0,
        duration: 0.6,
        delay: 1.4,
        ease: "power2.inOut",
        onComplete: function() {
          splash.style.display = 'none';
          document.body.style.overflow = '';
        }
      });
    }
  }


  /* ---- Lucide icons ---- */
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }

  /* ---- Footer year ---- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* ---- Sticky nav background on scroll ---- */
  var nav = document.getElementById('nav');
  if (nav) {
    window.lastScrollY = 0;
    var darkSections = document.querySelectorAll('.story-carousel, .community, .footer, .cine-story, .page-hero.dark, .join-card.feature-dark');
    
    var navScroll = function () {
      var currentScrollY = window.scrollY;
      var delta = currentScrollY - window.lastScrollY;
      
      // 1. Scrolled state (for floating pill effect)
      if (currentScrollY > 24) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');

      // 2. Smart Navbar: (Disabled per request to keep it static over the top)
      window.lastScrollY = currentScrollY;

      // 3. Dark-aware nav: adapt when overlapping dark sections
      var navBottom = nav.getBoundingClientRect().bottom;
      var overDark = false;
      darkSections.forEach(function(sec) {
        var rect = sec.getBoundingClientRect();
        if (rect.top < navBottom && rect.bottom > 0) overDark = true;
      });
      nav.classList.toggle('nav-dark', overDark);
    };
    window.addEventListener('scroll', navScroll, { passive: true });
    navScroll();

    /* ---- Mobile menu ---- */
    var toggle = document.getElementById('navToggle');
    if (toggle) {
      toggle.addEventListener('click', function () {
        var open = nav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      nav.querySelectorAll('.nav-links a').forEach(function (a) {
        a.addEventListener('click', function () {
          nav.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });
    }
  }

  /* ---- Word-stagger text reveal: split .tr into animated words ---- */
  (function splitTextReveals() {
    document.querySelectorAll('.tr').forEach(function (el) {
      var words = [];
      function processText(node, parent) {
        var parts = node.textContent.split(/(\s+)/);
        var frag = document.createDocumentFragment();
        parts.forEach(function (p) {
          if (p === '' ) return;
          if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(p)); return; }
          var s = document.createElement('span');
          s.className = 'tr-word';
          s.textContent = p;
          frag.appendChild(s);
          words.push(s);
        });
        parent.replaceChild(frag, node); } Array.prototype.slice.call(el.childNodes).forEach(function (child) {
        if (child.nodeType === 3) { processText(child, el); } else if (child.nodeType === 1) {
          Array.prototype.slice.call(child.childNodes).forEach(function (gc) {
            if (gc.nodeType === 3) processText(gc, child);
          }); } });
      words.forEach(function (w, i) { w.style.transitionDelay = (i * 0.06) + 's'; });
    });
  })();

  /* ---- Reveal-on-scroll (with directional + blur + text variants) ---- */
  var revealSel = '.reveal, .reveal-l, .reveal-r, .reveal-scale, .reveal-blur, .tr';
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); revealObserver.unobserve(e.target); } });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll(revealSel).forEach(function (el) {
      if (!el.classList.contains('in')) revealObserver.observe(el);
    });
  } else {
    document.querySelectorAll(revealSel).forEach(function (el) { el.classList.add('in'); }); } // Robustly reveal anything already in the initial viewport (covers fast loads / IO timing)
  var revealInView = function () {
    document.querySelectorAll(revealSel).forEach(function (el) {
      if (el.classList.contains('in')) return;
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('in');
    });
  };
  revealInView();
  window.addEventListener('load', revealInView);
  window.addEventListener('scroll', revealInView, { passive: true });

  /* ---- Subtle hero parallax ---- */
  var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var heroStage = document.querySelector('.hero .hero-stage');
  var aurora = document.querySelector('.hero .aurora');
  if (!prefersReduced && (heroStage || aurora)) {
    var pTicking = false;
    var onParallax = function () {
      if (pTicking) return;
      pTicking = true;
      requestAnimationFrame(function () {
        var sy = window.scrollY;
        if (sy < 900) {
          if (aurora) aurora.style.transform = 'translateY(' + (sy * 0.18) + 'px)';
          if (heroStage) heroStage.style.transform = 'translateY(' + (sy * -0.06) + 'px)';
        }
        pTicking = false;
      });
    };
    window.addEventListener('scroll', onParallax, { passive: true });
  }

  /* ---- Scroll progress bar ---- */
  var sp = document.getElementById('scrollProgress');
  if (sp) {
    var spTick = false;
    var updSp = function () {
      if (spTick) return;
      spTick = true;
      requestAnimationFrame(function () {
        var h = document.documentElement;
        var max = h.scrollHeight - h.clientHeight;
        sp.style.transform = 'scaleX(' + (max > 0 ? (h.scrollTop / max) : 0) + ')';
        spTick = false;
      });
    };
    window.addEventListener('scroll', updSp, { passive: true });
    updSp();
  }

  /* ---- IMMERSIVE GSAP FLIPBOOK ---- */
  (function initGSAPBook() {
    var section = document.querySelector('.gsap-book-section');
    var leaves = document.querySelectorAll('.gsap-leaf');
    if (!section || !leaves.length || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;



    gsap.registerPlugin(ScrollTrigger);

    var numLeaves = leaves.length;
    var sortedLeaves = Array.from(leaves).sort(function(a,b) {
      return parseInt(a.getAttribute('data-leaf')) - parseInt(b.getAttribute('data-leaf'));
    });

    // Initial z-index setup: Top of the right stack (leaf 1) should have highest z-index.
    sortedLeaves.forEach(function(leaf, index) {
       leaf.style.zIndex = numLeaves - index; // 4, 3, 2, 1
    });

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=8000",
        scrub: 1, // Smooth scrubbing
        pin: true,
        anticipatePin: 1
      }
    });


    var isMobile = window.innerWidth <= 900;

    // Animate each leaf sequentially
    sortedLeaves.forEach(function(leaf, index) {
      // The flip animation
      var flipVars = {
        ease: "none",
        duration: 1
      };
      
      if (isMobile) {
        flipVars.rotateX = 180;
      } else {
        flipVars.rotateY = -180;
      }
      
      tl.to(leaf, flipVars);
      // Swap z-index halfway through the flip so it stacks correctly on the left side
      tl.set(leaf, { zIndex: index + 1 }, "<0.5");
    });
    
    // Auto-reload page if crossing the mobile breakpoint to prevent GSAP and CSS getting out of sync
    var wasMobile = window.innerWidth <= 900;
    window.addEventListener('resize', function() {
      var isNowMobile = window.innerWidth <= 900;
      if (wasMobile !== isNowMobile) {
        window.location.reload();
      }
    });

  })();

  /* ---- Count-up KPIs when a dashboard scrolls into view ---- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var isFloat = target % 1 !== 0;
    var dur = 1200, t0 = null;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var val = target * (1 - Math.pow(1 - p, 3));
      el.textContent = isFloat ? val.toFixed(1) : Math.round(val);
      if (p < 1) requestAnimationFrame(step); } requestAnimationFrame(step); } document.querySelectorAll('.dash, .growth-card').forEach(function (dash) {
    if (!('IntersectionObserver' in window)) {
      dash.querySelectorAll('[data-count]').forEach(animateCount); return;
    }
    var o = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { dash.querySelectorAll('[data-count]').forEach(animateCount); obs.disconnect(); } });
    }, { threshold: 0.4 });
    o.observe(dash);
  });

  /* ---- Demo forms (capture + toast) ---- */
  var toast = document.getElementById('toast');
  var toastMsg = document.getElementById('toastMsg');
  var toastTimer;
  function showToast(msg) {
    if (!toast) return;
    toastMsg.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 3200);
  }
  document.querySelectorAll('form[data-form]').forEach(function (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var kind = form.getAttribute('data-form');
      
      if (typeof emailjs !== 'undefined') {
        var btn = form.querySelector('button[type="submit"]');
        var oldText = btn ? btn.textContent : '';
        if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }
        
        emailjs.sendForm('service_rrwka9o', 'template_5zc8gcj', form)
          .then(function() {
              form.reset();
              if (kind === 'Early access') {
                showToast("You're on the list — welcome to the journey!");
              } else if (kind === 'Business onboarding') {
                showToast("Thanks — we'll be in touch about onboarding!");
              } else {
                showToast("Thanks — your message has been sent successfully!");
              }
              if (btn) { btn.disabled = false; btn.textContent = oldText; }
          }, function(error) {
              console.error('EmailJS Error:', error);
              showToast("Oops! Something went wrong. Please try again.");
              if (btn) { btn.disabled = false; btn.textContent = oldText; }
          });
      } else {
          showToast("Error: Email system not initialized.");
      }
    });
  });


  /* =========================================================
     GODMODE / ULTIMATE UX ADDITIONS
     ========================================================= */

  /* 1. Custom Cursor Logic */
  var cursorDot = document.getElementById('cursorDot');
  var cursorOutline = document.getElementById('cursorOutline');
  if (cursorDot && cursorOutline && !prefersReduced && window.matchMedia('(pointer: fine)').matches) {
    var posX = 0, posY = 0, mouseX = 0, mouseY = 0;
    window.addEventListener('mousemove', function(e) {
      mouseX = e.clientX; mouseY = e.clientY;
      cursorDot.style.transform = 'translate(' + mouseX + 'px, ' + mouseY + 'px)';
    });
    function renderCursor() {
      posX += (mouseX - posX) * 0.15;
      posY += (mouseY - posY) * 0.15;
      cursorOutline.style.transform = 'translate(' + posX + 'px, ' + posY + 'px)';
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Hover states for links and buttons
    document.querySelectorAll('a, button, .magnetic, .path-card, .feature').forEach(function(el) {
      el.addEventListener('mouseenter', function() {
        document.body.classList.add(el.closest('.dark, .story, .footer, .community') ? 'cursor-hover-light' : 'cursor-hover');
      });
      el.addEventListener('mouseleave', function() {
        document.body.classList.remove('cursor-hover', 'cursor-hover-light');
      });
    });
    
    // Hide default cursor when leaving window
    document.addEventListener('mouseleave', function() {
      cursorDot.classList.add('cursor-hidden');
      cursorOutline.classList.add('cursor-hidden');
    });
    document.addEventListener('mouseenter', function() {
      cursorDot.classList.remove('cursor-hidden');
      cursorOutline.classList.remove('cursor-hidden');
    });
  }

  /* 2. Global GSAP ScrollTrigger Overhaul */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    
    // Smooth stagger reveal for all standard sections

    // Fade up sections
    gsap.utils.toArray('.reveal').forEach(function(el) {
      gsap.fromTo(el, 
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" }
        }
      );
    });

    // Animate split words
    gsap.utils.toArray('.tr').forEach(function(el) {
      var words = el.querySelectorAll('.w');
      if (!words.length) return;
      gsap.fromTo(words,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.04, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" }
        }
      );
    });

    // Hero Timeline (if on home page with loader)
    var loaderBrand = document.querySelector('.loader-brand');
    if (loaderBrand) {
      gsap.timeline()
        .to(loaderBrand, { opacity: 0, y: -20, duration: 0.5, delay: 0.5 })
        .to('.loader-overlay', { height: 0, duration: 0.8, ease: "power4.inOut" })
        .fromTo('.hero h1', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power4.out" }, "-=0.2")
        .fromTo('.hero .lead', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, "-=0.6")
        .fromTo('.hero-cta, .trust-row', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 }, "-=0.6");
    }

    // Parallax floating for big background blobs
    gsap.utils.toArray('.liquid-blob').forEach(function(blob, i) {
      gsap.to(blob, {
        y: (i % 2 === 0 ? 100 : -100),
        ease: "none",
        scrollTrigger: { trigger: "body", start: "top top", end: "bottom bottom", scrub: true }
      });
    });

    /* ---- CINEMATIC 3D STORY (journey.html) - SCROLL TRIGGERED ---- */
    var cineStory = document.querySelector('.cine-story');
    if (cineStory) {
      var scenes = gsap.utils.toArray('.cine-scene');
      var totalScenes = scenes.length;
      
      // Pin the section and tie animation to scroll
      var tl = gsap.timeline({
        scrollTrigger: {
          trigger: cineStory,
          start: "top top",
          end: "+=" + (totalScenes * 100) + "%", // scroll duration based on number of scenes
          pin: true,
          scrub: 1, // smooth scrubbing
        }
      });

      // Make first scene visible immediately
      if (scenes.length > 0) {
        gsap.set(scenes[0], { opacity: 1, visibility: 'visible' });
      }

      scenes.forEach(function(scene, i) {
        var content = scene.querySelector('.cine-content');
        var visual = scene.querySelector('.cine-visual');
        
        // Scene entrance (except for first scene which is already visible)
        if (i > 0) {
          tl.to(scene, { opacity: 1, visibility: 'visible', duration: 1 });
          if (content) {
            tl.fromTo(content, { x: -50, rotateY: 10, opacity: 0 }, { x: 0, rotateY: 0, opacity: 1, duration: 1 }, "<");
          }
          if (visual) {
            tl.fromTo(visual, { x: 50, rotateY: -10, scale: 0.9, opacity: 0 }, { x: 0, rotateY: 0, scale: 1, opacity: 1, duration: 1 }, "<");
          }
        }

        // Hold scene so user can read it
        tl.to({}, { duration: 2 });

        // Scene exit (fade out before next scene comes in), except for the last one
        if (i !== totalScenes - 1) {
          tl.to(scene, { opacity: 0, visibility: 'hidden', duration: 1 });
          if (content) tl.to(content, { x: -50, rotateY: -10, opacity: 0, duration: 1 }, "<");
          if (visual) tl.to(visual, { x: 50, rotateY: 10, scale: 0.9, opacity: 0, duration: 1 }, "<");
        }
      });
    }

    /* ---- CINEMATIC PAGE TRANSITIONS REMOVED ---- */
  }
})();


(function() {
  // INITIAL SPLASH SCREEN LOGIC
  var splash = document.getElementById('initial-splash');
  if (splash) {
    document.body.classList.add('splash-active');
    var minTimeElapsed = false;
    var loaded = false;

    setTimeout(function() {
      minTimeElapsed = true;
      tryHideSplash();
    }, 1500);

    window.addEventListener('load', function() {
      loaded = true;
      tryHideSplash();
    });

    if (document.readyState === 'complete') {
      loaded = true;
    }

    function tryHideSplash() {
      if (minTimeElapsed && loaded) {
        if (typeof gsap !== 'undefined') {
          gsap.to(splash, {
            opacity: 0,
            duration: 0.8,
            ease: 'power2.inOut',
            onComplete: function() {
              splash.style.display = 'none';
              document.body.classList.remove('splash-active');
              if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
              gsap.from('.hero-content > *', {
                y: 30,
                opacity: 0,
                duration: 1,
                stagger: 0.1,
                ease: 'power3.out'
              });
            }
          });
        } else {
          splash.style.display = 'none';
          document.body.classList.remove('splash-active');
        }
      }
    }
  }
})();
