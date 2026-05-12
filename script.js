/* ========================================================
   AZOURY JÓIAS — Animações e interações
   Lenis + GSAP + ScrollTrigger
   ======================================================== */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============== NATIVE SMOOTH SCROLL TO ANCHORS ============== */
  // Lenis was disabled — it was making the scroll feel locked/sluggish on some setups.
  // Native scroll + CSS `scroll-behavior: smooth` (set on <html>) handles anchor jumps.
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#' || href.length < 2) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.pageYOffset - 60;
      window.scrollTo({ top, behavior: 'smooth' });

      const navMob = document.getElementById('navMobile');
      const toggle = document.getElementById('navToggle');
      if (navMob && navMob.classList.contains('is-open')) {
        navMob.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  /* ============== GSAP setup ============== */
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);


    // Custom eases
    if (window.CustomEase) {
      CustomEase.create('wood', 'M0,0 C0.1,0 0.25,0.85 1,1');
      CustomEase.create('artisan', 'M0,0 C0.4,0 0.2,1 1,1');
      CustomEase.create('leaf', 'M0,0 C0.25,0.46 0.45,0.94 1,1');
    }

    /* ============== PREPARE LINE-REVEAL TITLES ============== */
    function prepareTitleLines() {
      document.querySelectorAll('h1 .line, h2 .line').forEach((line) => {
        const html = line.innerHTML.trim();
        line.classList.add('is-prepared');
        line.innerHTML = '<span class="inner">' + html + '</span>';
      });
      const inners = document.querySelectorAll('.line .inner');
      // Set GSAP-tracked initial state, then unlock visibility
      gsap.set(inners, { yPercent: 110, force3D: true });
      document.querySelectorAll('.line').forEach(l => l.classList.add('gsap-ready'));
    }
    prepareTitleLines();

    /* ============== HERO ANIMATIONS ============== */
    const hero = document.querySelector('.hero');
    if (hero && !prefersReducedMotion) {
      // Set initial states for elements that fade in
      gsap.set('.hero__eyebrow', { autoAlpha: 0, y: 14 });
      gsap.set('.hero__sub', { autoAlpha: 0, y: 18 });
      gsap.set('.hero__ctas .btn', { autoAlpha: 0, y: 16, scale: 0.94 });
      gsap.set('.hero__note', { autoAlpha: 0, y: 12, rotate: 2 });
      gsap.set('.hero__scroll', { autoAlpha: 0 });

      const tl = gsap.timeline({ defaults: { ease: 'wood' } });

      tl.from('.hero__bg', {
        scale: 1.12,
        duration: 1.8,
      })
        .to('.hero__eyebrow', {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
        }, 0.6)
        .to('.hero__title .line .inner', {
          yPercent: 0,
          duration: 1.1,
          stagger: 0.12,
        }, 0.85)
        .to('.hero__sub', {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
        }, 1.5)
        .to('.hero__ctas .btn', {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
        }, 1.8)
        .to('.hero__note', {
          autoAlpha: 1,
          y: 0,
          rotate: -2,
          duration: 0.8,
        }, 2.1)
        .to('.hero__scroll', {
          autoAlpha: 0.7,
          duration: 0.6,
        }, 2.4);

      // Mandala slow rotation
      gsap.to('.hero__mandala svg', {
        rotation: 360,
        duration: 60,
        ease: 'none',
        repeat: -1,
      });

      // Hero parallax
      gsap.to('.hero__image', {
        yPercent: 18,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      gsap.to('.hero__content', {
        yPercent: -12,
        opacity: 0.4,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }

    /* ============== GENERIC: TITLE LINE REVEAL ON SCROLL ============== */
    document.querySelectorAll('h2').forEach((h2) => {
      const lines = h2.querySelectorAll('.line .inner');
      if (!lines.length) return;
      gsap.to(lines, {
        yPercent: 0,
        duration: 1,
        ease: 'wood',
        stagger: 0.1,
        scrollTrigger: {
          trigger: h2,
          start: 'top 85%',
        },
      });
    });

    /* ============== SOBRE — photo reveal + counters ============== */
    const sobrePhoto = document.querySelector('.sobre__photo-frame img');
    if (sobrePhoto) {
      gsap.from(sobrePhoto, {
        clipPath: 'inset(0 100% 0 0)',
        scale: 1.15,
        duration: 1.4,
        ease: 'wood',
        scrollTrigger: {
          trigger: '.sobre__photo',
          start: 'top 75%',
        },
      });
    }

    gsap.utils.toArray('.sobre__body p').forEach((p, i) => {
      gsap.from(p, {
        opacity: 0,
        y: 24,
        duration: 0.9,
        ease: 'wood',
        delay: i * 0.08,
        scrollTrigger: {
          trigger: p,
          start: 'top 88%',
        },
      });
    });

    document.querySelectorAll('.cred__number[data-count]').forEach((el) => {
      const target = parseFloat(el.dataset.count);
      const obj = { val: 0 };
      gsap.to(obj, {
        val: target,
        duration: 1.8,
        ease: 'wood',
        snap: { val: 1 },
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
        },
        onUpdate: () => {
          const v = Math.round(obj.val);
          el.textContent = v >= 1000 ? v.toLocaleString('pt-BR') : v;
        },
      });
    });

    gsap.from('.cred', {
      opacity: 0,
      y: 20,
      duration: 0.8,
      stagger: 0.12,
      ease: 'wood',
      scrollTrigger: {
        trigger: '.sobre__creds',
        start: 'top 85%',
      },
    });

    /* ============== MANIFESTO ============== */
    gsap.from('.manifesto__body p', {
      opacity: 0,
      y: 20,
      duration: 0.9,
      stagger: 0.1,
      ease: 'wood',
      scrollTrigger: {
        trigger: '.manifesto__body',
        start: 'top 80%',
      },
    });

    gsap.from('.manifesto__quote', {
      opacity: 0,
      x: 30,
      duration: 1,
      ease: 'wood',
      scrollTrigger: {
        trigger: '.manifesto__quote',
        start: 'top 80%',
      },
    });

    gsap.from('.value', {
      opacity: 0,
      y: 30,
      duration: 0.9,
      stagger: 0.12,
      ease: 'wood',
      scrollTrigger: {
        trigger: '.manifesto__values',
        start: 'top 85%',
      },
    });

    // Leaves drift
    gsap.to('.leaf--1', {
      y: 20,
      rotation: -10,
      duration: 8,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
    gsap.to('.leaf--2', {
      y: -25,
      rotation: 170,
      duration: 10,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });

    /* ============== CURSOS — staggered cards ============== */
    gsap.from('.curso-card', {
      opacity: 0,
      y: 50,
      rotation: -1.5,
      duration: 1,
      stagger: 0.14,
      ease: 'wood',
      scrollTrigger: {
        trigger: '.cursos__grid',
        start: 'top 80%',
      },
    });

    gsap.from('.cursos__sub, .cursos__note', {
      opacity: 0,
      y: 14,
      duration: 0.8,
      ease: 'wood',
      scrollTrigger: {
        trigger: '.cursos',
        start: 'top 70%',
      },
    });

    /* ============== COLEÇÕES ============== */
    gsap.from('.colecao', {
      opacity: 0,
      y: 40,
      scale: 0.96,
      duration: 1,
      stagger: 0.1,
      ease: 'wood',
      scrollTrigger: {
        trigger: '.colecoes__grid',
        start: 'top 80%',
      },
    });

    /* ============== DEPOIMENTOS — drag carrossel ============== */
    setupTestimonials();

    /* ============== PROJETO ============== */
    gsap.from('.projeto__body p', {
      opacity: 0,
      y: 20,
      duration: 0.9,
      stagger: 0.1,
      ease: 'wood',
      scrollTrigger: {
        trigger: '.projeto__body',
        start: 'top 85%',
      },
    });
    gsap.from('.stamp', {
      opacity: 0,
      scale: 0.7,
      rotation: -20,
      duration: 1.2,
      ease: 'wood',
      scrollTrigger: {
        trigger: '.projeto__right',
        start: 'top 80%',
      },
    });
    gsap.from('.projeto__highlights li', {
      opacity: 0,
      x: 20,
      duration: 0.8,
      stagger: 0.1,
      ease: 'wood',
      scrollTrigger: {
        trigger: '.projeto__highlights',
        start: 'top 85%',
      },
    });

    /* ============== CTA FINAL ============== */
    gsap.from('.cta-final__body, .cta-final__ctas', {
      opacity: 0,
      y: 24,
      duration: 0.9,
      stagger: 0.15,
      ease: 'wood',
      scrollTrigger: {
        trigger: '.cta-final',
        start: 'top 75%',
      },
    });
  }

  /* ============== NAV SCROLL STATE ============== */
  const nav = document.getElementById('nav');
  function updateNav() {
    if (window.scrollY > 40) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* ============== MOBILE NAV TOGGLE ============== */
  const toggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('navMobile');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  /* ============== TESTIMONIALS CAROUSEL ============== */
  function setupTestimonials() {
    const track = document.getElementById('depoimentosTrack');
    const prev = document.getElementById('depPrev');
    const next = document.getElementById('depNext');
    const progress = document.getElementById('depProgress');
    if (!track || !prev || !next) return;

    const cards = track.querySelectorAll('.dep-card');
    if (!cards.length) return;

    let currentX = 0;
    let isDragging = false;
    let startX = 0;
    let startScroll = 0;

    function getStep() {
      const first = cards[0];
      const style = window.getComputedStyle(track);
      const gap = parseFloat(style.gap) || 28;
      return first.offsetWidth + gap;
    }
    function getMax() {
      return Math.max(0, track.scrollWidth - track.parentElement.offsetWidth);
    }
    function clamp(x) {
      const max = getMax();
      return Math.min(0, Math.max(-max, x));
    }
    function applyTransform(animate = true) {
      if (window.gsap && animate) {
        gsap.to(track, {
          x: currentX,
          duration: 0.85,
          ease: 'wood',
        });
      } else {
        track.style.transform = `translate3d(${currentX}px, 0, 0)`;
      }
      updateProgress();
    }
    function updateProgress() {
      const max = getMax();
      if (max === 0) {
        progress.style.width = '100%';
        return;
      }
      const ratio = Math.abs(currentX) / max;
      const visible = track.parentElement.offsetWidth / track.scrollWidth;
      const w = Math.max(visible, ratio + visible) * 100;
      progress.style.width = `${Math.min(100, w)}%`;
    }

    next.addEventListener('click', () => {
      currentX = clamp(currentX - getStep());
      applyTransform();
    });
    prev.addEventListener('click', () => {
      currentX = clamp(currentX + getStep());
      applyTransform();
    });

    // Drag (mouse + touch)
    function onStart(e) {
      isDragging = true;
      track.style.cursor = 'grabbing';
      startX = e.touches ? e.touches[0].clientX : e.clientX;
      startScroll = currentX;
      if (window.gsap) gsap.killTweensOf(track);
    }
    function onMove(e) {
      if (!isDragging) return;
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      const delta = x - startX;
      currentX = clamp(startScroll + delta);
      track.style.transform = `translate3d(${currentX}px, 0, 0)`;
      updateProgress();
    }
    function onEnd() {
      isDragging = false;
      track.style.cursor = '';
    }

    track.addEventListener('mousedown', onStart);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);

    track.addEventListener('touchstart', onStart, { passive: true });
    track.addEventListener('touchmove', onMove, { passive: true });
    track.addEventListener('touchend', onEnd);

    window.addEventListener('resize', () => {
      currentX = clamp(currentX);
      applyTransform(false);
    });

    updateProgress();

    // Entrance animation
    if (window.gsap && window.ScrollTrigger) {
      gsap.from(cards, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.1,
        ease: 'wood',
        scrollTrigger: {
          trigger: track,
          start: 'top 85%',
        },
      });
    }
  }
})();
