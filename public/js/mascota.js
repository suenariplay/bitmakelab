/* Bit, la mascota de bitmakelab: pasea, mira, responde. */
(function () {
  'use strict';

  var quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var frases = {
    feliz: '¡Hola! Soy Bit.',
    sorprendido: '¿En serio? ¡Qué buena idea!',
    pensando: 'Déjame pensarlo…',
    emocionado: '¡Vamos allá!',
    guino: 'Tranqui, lo tenemos.',
    concentrado: 'Modo pro activado.'
  };

  var hero = document.getElementById('mascotaHero');
  var globo = document.getElementById('globo');
  var espejo = document.getElementById('mascotaEspejo');
  var globoEspejo = document.getElementById('globoEspejo');
  var chips = document.querySelectorAll('.chip');

  /* --- Bit que pasea por el borde inferior --- */
  var paseante = document.querySelector('.paseante');
  var bitPaseante = null;

  if (paseante && hero) {
    bitPaseante = hero.cloneNode(true);
    bitPaseante.id = 'mascotaPaseante';
    bitPaseante.removeAttribute('aria-label');
    bitPaseante.setAttribute('aria-hidden', 'true');
    var viejo = paseante.querySelector('svg');
    if (viejo) {
      viejo.parentNode.replaceChild(bitPaseante, viejo);
    } else {
      paseante.insertBefore(bitPaseante, paseante.firstChild);
    }
  }

  var ultimaX = -1;
  var parar;

  function pintarPaseante() {
    if (!paseante || !bitPaseante) return;
    var alto = document.documentElement.scrollHeight - window.innerHeight;
    var p = alto > 0 ? Math.min(1, Math.max(0, window.scrollY / alto)) : 0;
    var libre = Math.max(0, window.innerWidth - 132);
    var x = Math.round(p * libre);

    paseante.style.transform = 'translate3d(' + x + 'px,0,0)';

    if (x !== ultimaX) {
      var dir = x > ultimaX ? 1 : -1;
      bitPaseante.style.transform = 'scaleX(' + dir + ')';
      bitPaseante.classList.add('es-andando');
      ultimaX = x;
      clearTimeout(parar);
      parar = setTimeout(function () {
        bitPaseante.classList.remove('es-andando');
      }, 280);
    }
  }

  if (!quieto) {
    var pedido = false;
    window.addEventListener('scroll', function () {
      if (pedido) return;
      pedido = true;
      window.requestAnimationFrame(function () {
        pintarPaseante();
        pedido = false;
      });
    }, { passive: true });
    window.addEventListener('resize', pintarPaseante);
    pintarPaseante();
  }

  /* --- la mirada sigue al ratón --- */
  if (hero && !quieto) {
    window.addEventListener('pointermove', function (ev) {
      var caja = hero.getBoundingClientRect();
      if (!caja.width) return;
      var cx = caja.left + caja.width * 0.68;
      var cy = caja.top + caja.height * 0.32;
      var dx = ev.clientX - cx;
      var dy = ev.clientY - cy;
      var lejos = Math.min(1, Math.sqrt(dx * dx + dy * dy) / 460);
      var ang = Math.atan2(dy, dx);
      hero.style.setProperty('--px', (Math.cos(ang) * 7 * lejos).toFixed(1) + 'px');
      hero.style.setProperty('--py', (Math.sin(ang) * 6 * lejos).toFixed(1) + 'px');
      hero.style.setProperty('--tilt', (Math.cos(ang) * 4 * lejos).toFixed(1) + 'deg');
    }, { passive: true });
  }

  /* --- caras --- */
  function ponerCara(svg, animo) {
    if (!svg) return;
    svg.setAttribute('data-animo', animo);
  }

  if (chips.length) {
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var animo = chip.getAttribute('data-animo') || 'feliz';
        chips.forEach(function (c) { c.classList.remove('activo'); });
        chip.classList.add('activo');
        ponerCara(espejo, animo);
        ponerCara(hero, animo);
        if (globoEspejo) globoEspejo.textContent = frases[animo] || frases.feliz;
        if (globo) globo.textContent = frases[animo] || frases.feliz;
      });
    });
  }

  /* --- saludo al entrar --- */
  if (hero && !quieto) {
    setTimeout(function () {
      hero.classList.add('saluda');
      setTimeout(function () { hero.classList.remove('saluda'); }, 1800);
    }, 900);
  }

  /* --- aparición de secciones --- */
  var revelar = document.querySelectorAll('.revelar');
  if ('IntersectionObserver' in window && revelar.length) {
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('dentro');
          obs.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
    revelar.forEach(function (el) { obs.observe(el); });
  } else {
    revelar.forEach(function (el) { el.classList.add('dentro'); });
  }

  /* --- formulario de prototipo --- */
  var form = document.querySelector('.contacto form');
  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var aviso = form.querySelector('.aviso-form');
      if (aviso) {
        aviso.textContent = 'Formulario de prototipo: todavía no envía correos. Escríbenos directamente.';
        aviso.style.color = '#0A9560';
      }
    });
  }
})();
