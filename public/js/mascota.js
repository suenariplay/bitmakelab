/* Bit, la mascota de bitmakelab: pasea, mira y cambia de cara. */
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
  var globoHero = document.getElementById('globo');
  var espejo = document.getElementById('mascotaEspejo');
  var globoEspejo = document.getElementById('globoEspejo');
  var chips = document.querySelectorAll('.chip');

  function ponerAnimo(animo, destino, globo) {
    if (!destino || !animo) return;
    destino.setAttribute('data-animo', animo);
    if (globo && frases[animo]) globo.textContent = frases[animo];
  }

  Array.prototype.forEach.call(chips, function (chip) {
    chip.addEventListener('click', function () {
      Array.prototype.forEach.call(chips, function (otro) {
        otro.classList.remove('activo');
        otro.setAttribute('aria-pressed', 'false');
      });
      chip.classList.add('activo');
      chip.setAttribute('aria-pressed', 'true');
      var animo = chip.getAttribute('data-animo');
      ponerAnimo(animo, espejo, globoEspejo);
      ponerAnimo(animo, hero, globoHero);
    });
  });

  /* El ojo sigue al puntero */
  if (hero && !quieto) {
    var pupila = hero.querySelector('.m-pupila');
    var brillo = hero.querySelector('.m-brillo');
    window.addEventListener('pointermove', function (e) {
      var caja = hero.getBoundingClientRect();
      var cx = caja.left + caja.width / 2;
      var cy = caja.top + caja.height / 2;
      var dx = Math.max(-1, Math.min(1, (e.clientX - cx) / (window.innerWidth / 2)));
      var dy = Math.max(-1, Math.min(1, (e.clientY - cy) / (window.innerHeight / 2)));
      var t = 'translate(' + (dx * 6).toFixed(1) + 'px,' + (dy * 5).toFixed(1) + 'px)';
      if (pupila) pupila.style.transform = t;
      if (brillo) brillo.style.transform = t;
    }, { passive: true });
  }

  /* Bit pasea por la página al hacer scroll */
  var paseante = document.getElementById('paseante');
  var globoPaseante = document.getElementById('globoPaseante');
  var svgPaseante = paseante ? paseante.querySelector('.paseante-svg') : null;
  var ultimoX = 0;
  var temporizador = null;
  var quietoTemporal = null;
  var dichas = ['¡Hola!', 'Ideas más rápidas', 'Desarrollo sin complicaciones', 'De ideas a resultados', '¿Subimos?'];
  var indice = 0;

  function decir(texto) {
    if (!globoPaseante) return;
    globoPaseante.textContent = texto;
    globoPaseante.classList.add('visible');
    clearTimeout(temporizador);
    temporizador = setTimeout(function () {
      globoPaseante.classList.remove('visible');
    }, 2800);
  }

  if (paseante && !quieto) {
    var pedido = false;

    var pasear = function () {
      pedido = false;
      var recorrido = document.documentElement.scrollHeight - window.innerHeight;
      var progreso = recorrido > 0 ? window.scrollY / recorrido : 0;
      var tope = Math.max(0, window.innerWidth - paseante.offsetWidth - 12);
      var x = Math.round(progreso * tope);
      paseante.style.transform = 'translateX(' + x + 'px)';

      if (x !== ultimoX && svgPaseante) {
        svgPaseante.style.setProperty('--dir', x < ultimoX ? '-1' : '1');
        ultimoX = x;
      }

      paseante.classList.add('andando');
      clearTimeout(quietoTemporal);
      quietoTemporal = setTimeout(function () {
        paseante.classList.remove('andando');
      }, 420);
    };

    window.addEventListener('scroll', function () {
      if (!pedido) {
        pedido = true;
        window.requestAnimationFrame(pasear);
      }
    }, { passive: true });

    window.addEventListener('resize', pasear);
    pasear();

    paseante.addEventListener('click', function () {
      decir(dichas[indice % dichas.length]);
      indice++;
    });
  }

  /* Aparición suave de las secciones */
  var aRevelar = document.querySelectorAll('.revelar');
  if (!quieto && 'IntersectionObserver' in window) {
    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('visto');
          observador.unobserve(entrada.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
    Array.prototype.forEach.call(aRevelar, function (el) { observador.observe(el); });
  } else {
    Array.prototype.forEach.call(aRevelar, function (el) { el.classList.add('visto'); });
  }

  /* Formulario de prototipo */
  var formulario = document.getElementById('formulario');
  var estado = document.getElementById('estadoForm');
  if (formulario) {
    formulario.addEventListener('submit', function (e) {
      e.preventDefault();
      if (estado) estado.textContent = 'Gracias. Esto es un prototipo: escríbenos a hola@bitmakelab.com y te contestamos igual.';
    });
  }
}());
