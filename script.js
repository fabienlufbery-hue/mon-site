/* ASYT — Animations & interactions */
(function() {
  'use strict';

  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Particules de données (arrière-plan animé) ---------- */
  function initParticles() {
    const canvas = document.getElementById('data-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let connections = [];
    let mouseX = -9999;
    let mouseY = -9999;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.scale(dpr, dpr);
    }

    function createParticles() {
      particles = [];
      const count = Math.min(50, Math.floor((width * height) / 25000));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 1.8,
          vy: (Math.random() - 0.5) * 1.8,
          radius: Math.random() * 1.5 + 0.5
        });
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      // Mise à jour positions + répulsion souris
      const repelRadius = 120;
      const repelStrength = 0.6;
      const maxSpeed = 5;
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < repelRadius && dist > 0) {
          const force = (repelRadius - dist) / repelRadius * repelStrength;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
          const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
          if (speed > maxSpeed) {
            p.vx = (p.vx / speed) * maxSpeed;
            p.vy = (p.vy / speed) * maxSpeed;
          }
        }
      });

      // Connexions
      ctx.strokeStyle = 'rgba(31, 24, 18, 0.08)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            ctx.globalAlpha = (1 - dist / 140) * 0.6;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;

      // Points
      ctx.fillStyle = 'rgba(31, 24, 18, 0.4)';
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      if (!reducedMotion) requestAnimationFrame(animate);
    }

    if (!reducedMotion) window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    if (!reducedMotion) window.addEventListener('mouseleave', () => {
      mouseX = -9999;
      mouseY = -9999;
    });

    resize();
    createParticles();
    animate();

    window.addEventListener('resize', () => {
      resize();
      createParticles();
      if (reducedMotion) animate(); // image fixe redessinée après redimensionnement
    });
  }

  /* ---------- Scroll reveal ---------- */
  function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -80px 0px'
    });

    elements.forEach(el => observer.observe(el));
  }

  /* ---------- Header scrolled state ---------- */
  function initHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;
    function check() {
      if (window.scrollY > 20) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    }
    window.addEventListener('scroll', check, { passive: true });
    check();
  }

  /* ---------- Compteur numérique pour les stats ---------- */
  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10);
          const duration = 1600;
          const start = performance.now();

          function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);
            // Préserver le contenu fixe (% etc.)
            const suffix = el.dataset.suffix || '';
            el.textContent = current + suffix;
            if (progress < 1) requestAnimationFrame(tick);
            else el.textContent = target + suffix;
          }
          requestAnimationFrame(tick);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
  }

  /* ---------- Smooth parallax sur le hero logo ---------- */
  function initParallax() {
    const logo = document.querySelector('.hero-logo');
    if (!logo) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrolled = window.scrollY;
          if (scrolled < window.innerHeight) {
            logo.style.transform = `translateY(${scrolled * -0.15}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ---------- Accordéon ---------- */
  function initAccordions() {
    var triggers = document.querySelectorAll('.accordion-trigger');
    if (!triggers.length) return;

    triggers.forEach(function(trigger) {
      trigger.addEventListener('click', function() {
        var expanded = trigger.getAttribute('aria-expanded') === 'true';
        var panel = document.getElementById(trigger.getAttribute('aria-controls'));
        if (!panel) return;
        trigger.setAttribute('aria-expanded', String(!expanded));
        panel.classList.toggle('is-open', !expanded);
      });
    });
  }

  /* ---------- Comparaison cloud / local (chapitre 02) ----------
     L'apparition passe par .reveal (initScrollReveal). Ici, on met en
     pause les animations permanentes tant que la comparaison est hors écran. */
  function initCompare() {
    var section = document.querySelector('.cvl');
    var target = section && section.querySelector('.cvl-compare');
    if (!target || !('IntersectionObserver' in window)) return;
    section.classList.add('cvl-idle');
    new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        section.classList.toggle('cvl-idle', !entry.isIntersecting);
      });
    }, { rootMargin: '120px 0px' }).observe(target);
  }

  /* ---------- Formulaire : sujet présélectionné via ?sujet=... ---------- */
  function initFormPrefill() {
    var select = document.getElementById('sujet');
    if (!select || !window.URLSearchParams) return;
    var wanted = new URLSearchParams(window.location.search).get('sujet');
    if (!wanted) return;
    var options = select.querySelectorAll('option[data-key]');
    for (var i = 0; i < options.length; i++) {
      if (options[i].getAttribute('data-key') === wanted) {
        select.value = options[i].value;
        break;
      }
    }
  }

  /* ---------- Menu mobile : focus à l'ouverture, Échap pour fermer ---------- */
  function initMenuEscape() {
    var nav = document.getElementById('primary-nav');
    var toggle = document.querySelector('.menu-toggle');
    if (!nav || !toggle) return;
    // Le menu précède le bouton dans le HTML : on envoie le focus au premier lien à l'ouverture
    toggle.addEventListener('click', function() {
      if (toggle.getAttribute('aria-expanded') === 'true') {
        var first = nav.querySelector('a');
        if (first) first.focus();
      }
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  /* ---------- Chapitres 03 à 08 : récit immersif ----------
     - .sx-live : section proche de l'écran (les boucles tournent, sinon pause)
     - .sx-seen : section entrée dans l'écran (animations d'entrée)
     - --e      : ouverture des sections sombres en pleine largeur
     - 03       : capture inclinée → à plat → zooms (défilement)
     - 04       : mise en évidence d'une brique du graphe
     - 05       : scénario HERMES joué pas à pas
     - 06       : déploiement de la pile matérielle
     - 07       : onglets de secteurs (clavier : flèches gauche/droite, Début, Fin)
     Mouvement réduit : rien n'est animé, les scènes restent complètes. */
  function initStory() {
    var sections = document.querySelectorAll('.sx');
    if (!sections.length || !('IntersectionObserver' in window)) return;
    document.documentElement.classList.add('sx-js');

    var live = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        entry.target.classList.toggle('sx-live', entry.isIntersecting);
        entry.target.dispatchEvent(new CustomEvent('sxlive', { detail: entry.isIntersecting }));
      });
    }, { rootMargin: '150px 0px' });
    var seen = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('sx-seen');
          seen.unobserve(entry.target);
        }
      });
    }, { threshold: 0.22 });
    sections.forEach(function(s) { live.observe(s); seen.observe(s); });

    initUseCases();
    initGraphFocus();
    initHermes();
    if (!reducedMotion) initStoryScroll();
  }

  function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function smooth(v) { v = clamp01(v); return v * v * (3 - 2 * v); }

  /* Effets liés au défilement (calculés une fois par image, seulement si nécessaire) */
  function initStoryScroll() {
    var darks = [].slice.call(document.querySelectorAll('.sx--dark'));
    var ui = document.querySelector('.sx-ui');
    var track = ui && ui.querySelector('.sx-ui-track');
    var scene = ui && ui.querySelector('.sx-ui-scene');
    var steps = ui ? [].slice.call(ui.querySelectorAll('.sx-ui-step')) : [];
    var sticky = ui && ui.querySelector('.sx-ui-sticky');
    var hw = document.querySelector('.sx-hw-stage');
    var ticking = false;
    var lastStep = -1;

    // Zooms de la capture : [progression, inclinaison, échelle, point visé x, point visé y]
    var keys = [
      [0.00, 1, 1.0, 0.5, 0.5],
      [0.16, 0, 1.0, 0.5, 0.5],
      [0.32, 0, 1.0, 0.5, 0.5],
      [0.44, 0, 2.6, 0.1, 0.15],
      [0.58, 0, 2.6, 0.1, 0.15],
      [0.70, 0, 1.55, 0.44, 0.3],
      [0.86, 0, 1.55, 0.44, 0.3],
      [0.97, 0, 1.0, 0.5, 0.5]
    ];
    function sample(p) {
      for (var i = 1; i < keys.length; i++) {
        if (p <= keys[i][0]) {
          var a = keys[i - 1], b = keys[i];
          var t = smooth((p - a[0]) / (b[0] - a[0]));
          return [a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t, a[3] + (b[3] - a[3]) * t, a[4] + (b[4] - a[4]) * t];
        }
      }
      var k = keys[keys.length - 1];
      return [k[1], k[2], k[3], k[4]];
    }
    function bump(p, a, b) { return Math.min(smooth((p - a) / 0.05), smooth((b - p) / 0.05)); }

    function update() {
      ticking = false;
      var vh = window.innerHeight;

      darks.forEach(function(s) {
        if (!s.classList.contains('sx-live')) return;
        var r = s.getBoundingClientRect();
        var e = Math.min(clamp01((vh - r.top) / (vh * 0.6)), clamp01(r.bottom / (vh * 0.6)));
        e = smooth(e);
        s.style.setProperty('--e', e > 0.98 ? '1' : e.toFixed(3));
      });

      if (track && ui.classList.contains('sx-live') && getComputedStyle(sticky).position === 'sticky') {
        var tr = track.getBoundingClientRect();
        var span = tr.height - vh;
        var p = span > 0 ? clamp01(-tr.top / span) : 0;
        var v = sample(p);
        var s = v[1];
        var tx = Math.min(0, Math.max(1 - s, 0.5 - v[2] * s)) * 100;
        var ty = Math.min(0, Math.max(1 - s, 0.5 - v[3] * s)) * 100;
        scene.style.setProperty('--tilt', v[0].toFixed(3));
        scene.style.setProperty('--s', s.toFixed(3));
        scene.style.setProperty('--tx', tx.toFixed(2) + '%');
        scene.style.setProperty('--ty', ty.toFixed(2) + '%');
        scene.style.setProperty('--fn', bump(p, 0.42, 0.6).toFixed(2));
        scene.style.setProperty('--fi', bump(p, 0.68, 0.88).toFixed(2));
        var step = p < 0.38 ? 0 : p < 0.64 ? 1 : 2;
        if (step !== lastStep) {
          lastStep = step;
          steps.forEach(function(li, i) {
            li.classList.toggle('is-active', i === step);
            li.classList.toggle('is-done', i < step);
          });
        }
      }

      if (hw && hw.closest('.sx').classList.contains('sx-live')) {
        var hr = hw.getBoundingClientRect();
        var x = smooth((vh - hr.top) / (vh * 0.6) - 0.1);
        hw.style.setProperty('--explode', x.toFixed(3));
      }
    }
    function request() {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    darks.concat(ui ? [ui] : []).forEach(function(s) { s.addEventListener('sxlive', request); });
    if (hw) hw.closest('.sx').addEventListener('sxlive', request);
    request();
  }

  /* 04 — Survol ou focus d'une carte : la brique correspondante ressort dans le graphe */
  function initGraphFocus() {
    var graph = document.querySelector('.sx-kg');
    if (!graph) return;
    document.querySelectorAll('.sx-kg-cards [data-focus]').forEach(function(card) {
      var key = card.getAttribute('data-focus');
      function on() { graph.setAttribute('data-focus', key); }
      function off() { graph.setAttribute('data-focus', ''); }
      card.addEventListener('mouseenter', on);
      card.addEventListener('mouseleave', off);
      card.addEventListener('focusin', on);
      card.addEventListener('focusout', off);
    });
  }

  /* 05 — Scénario HERMES : instruction → plan → autorisation → exécution → planification */
  function initHermes() {
    var box = document.querySelector('.sx-hm-console');
    if (!box || reducedMotion) return; // sans animation : état final complet (CSS)
    var items = [].slice.call(box.querySelectorAll('[data-at]'));
    // Durée d'affichage de chaque étape (ms) ; la dernière est la pause avant reprise
    var hold = [500, 1000, 1300, 700, 300, 300, 300, 800, 1400, 350, 900, 1100, 1100, 1100, 1100, 600, 4800];
    var n = 0, timer = null, running = false;

    function attr(el, name) {
      var v = el.getAttribute(name);
      return v === null ? null : parseInt(v, 10);
    }
    function render() {
      items.forEach(function(el) {
        var at = attr(el, 'data-at'), run = attr(el, 'data-run'), done = attr(el, 'data-done'), press = attr(el, 'data-press');
        el.classList.toggle('is-on', n >= at);
        el.classList.toggle('is-run', run !== null && n >= run && (done === null || n < done));
        el.classList.toggle('is-done', done !== null && n >= done);
        el.classList.toggle('is-press', press !== null && n === press);
      });
    }
    function next() {
      if (!running) return;
      if (n >= hold.length - 1) {
        box.classList.add('is-reset');
        timer = setTimeout(function() {
          n = 0; render(); box.classList.remove('is-reset');
          timer = setTimeout(next, hold[0]);
        }, 700);
        return;
      }
      n++;
      render();
      timer = setTimeout(next, hold[n]);
    }
    box.setAttribute('data-live', '');
    render();
    // Le scénario démarre quand la console est vraiment visible, et s'arrête hors écran
    new IntersectionObserver(function(entries) {
      var visible = entries[0].isIntersecting;
      if (visible && !running) { running = true; timer = setTimeout(next, hold[n]); }
      else if (!visible && running) { running = false; clearTimeout(timer); }
    }, { threshold: 0.35 }).observe(box);
  }

  /* 07 — Onglets des secteurs (motif ARIA « tabs », activation automatique) */
  function initUseCases() {
    var list = document.querySelector('.sx-tabs');
    if (!list) return;
    var tabs = [].slice.call(list.querySelectorAll('[role="tab"]'));
    var panels = tabs.map(function(t) { return document.getElementById(t.getAttribute('aria-controls')); });

    function select(i, focus) {
      tabs.forEach(function(t, j) {
        var on = i === j;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        panels[j].hidden = !on;
        panels[j].classList.toggle('is-enter', on);
      });
      if (focus) tabs[i].focus();
    }
    tabs.forEach(function(t, i) {
      t.addEventListener('click', function() { select(i, false); });
      t.addEventListener('keydown', function(e) {
        var k = e.key, j = null;
        if (k === 'ArrowRight') j = (i + 1) % tabs.length;
        else if (k === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
        else if (k === 'Home') j = 0;
        else if (k === 'End') j = tabs.length - 1;
        if (j !== null) { e.preventDefault(); select(j, true); }
      });
    });
    tabs.forEach(function(t, j) { panels[j].hidden = j !== 0; });
  }

  /* ---------- Initialisation au chargement ---------- */
  function init() {
    initParticles();
    initScrollReveal();
    initHeader();
    initCounters();
    initParallax();
    initAccordions();
    initCompare();
    initStory();
    initFormPrefill();
    initMenuEscape();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
