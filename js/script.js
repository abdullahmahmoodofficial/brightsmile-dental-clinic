/* ============================================================
   BrightSmile Dental Clinic — script.js (multi-page safe)
   Every feature runs only on pages where its elements exist.
   ============================================================ */
(function () {
  'use strict';

  var CLINIC_WHATSAPP = '923001234567'; // clinic WhatsApp number

  /* ---------- Sticky header shadow + back-to-top ---------- */
  var header = document.getElementById('header');
  var toTop = document.getElementById('toTop');
  if (header && toTop) {
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      header.classList.toggle('scrolled', y > 10);
      toTop.classList.toggle('show', y > 600);
    }, { passive: true });
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Mobile nav ---------- */
  var hamburger = document.getElementById('hamburger');
  var nav = document.getElementById('nav');
  if (hamburger && nav) {
    hamburger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  if ('IntersectionObserver' in window) {
    var revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          revealer.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(function (el) { revealer.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- Animated counters ---------- */
  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    var dur = 1600, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString('en-US');
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll('.counter');
  if (counters.length && 'IntersectionObserver' in window) {
    var counterObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          animateCounter(e.target);
          counterObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { counterObs.observe(el); });
  }

  /* ---------- Testimonials slider (home page) ---------- */
  var slides = document.querySelectorAll('.slide');
  var dotsWrap = document.getElementById('dots');
  if (slides.length && dotsWrap) {
    var current = 0, timer = null;
    slides.forEach(function (_, i) {
      var d = document.createElement('button');
      d.className = 'dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', 'Go to review ' + (i + 1));
      d.addEventListener('click', function () { goTo(i); restart(); });
      dotsWrap.appendChild(d);
    });
    var dots = dotsWrap.querySelectorAll('.dot');
    function goTo(i) {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = (i + slides.length) % slides.length;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
    }
    function restart() {
      clearInterval(timer);
      timer = setInterval(function () { goTo(current + 1); }, 5200);
    }
    var prev = document.getElementById('prevSlide');
    var next = document.getElementById('nextSlide');
    if (prev) prev.addEventListener('click', function () { goTo(current - 1); restart(); });
    if (next) next.addEventListener('click', function () { goTo(current + 1); restart(); });
    restart();
  }

  /* ---------- FAQ accordion (contact page) ---------- */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    var a = item.querySelector('.faq-a');
    if (!q || !a) return;
    q.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (o) {
        o.classList.remove('open');
        o.querySelector('.faq-a').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });

  /* ---------- Booking form (appointment page) ---------- */
  var form = document.getElementById('bookingForm');
  if (form) {
    var treatmentSelect = document.getElementById('fTreatment');
    var doctorSelect = document.getElementById('fDoctor');
    var dateInput = document.getElementById('fDate');
    dateInput.min = new Date().toISOString().split('T')[0]; // no past dates

    /* Pre-fill from URL: ?t=<treatment> and ?d=<doctor> */
    var params = new URLSearchParams(window.location.search);
    function preselect(select, value) {
      if (!select || !value) return;
      for (var i = 0; i < select.options.length; i++) {
        if (select.options[i].text === value || select.options[i].value === value) {
          select.selectedIndex = i;
          return;
        }
      }
    }
    preselect(treatmentSelect, params.get('t'));
    preselect(doctorSelect, params.get('d'));

    function setError(input, msg) {
      var group = input.closest('.f-group');
      group.classList.add('invalid');
      group.querySelector('.err').textContent = msg;
    }
    function clearError(input) {
      var group = input.closest('.f-group');
      group.classList.remove('invalid');
      var err = group.querySelector('.err');
      if (err) err.textContent = '';
    }
    ['fName', 'fPhone', 'fTreatment', 'fDate', 'fTime'].forEach(function (id) {
      var el = document.getElementById(id);
      el.addEventListener('input', function () { clearError(el); });
      el.addEventListener('change', function () { clearError(el); });
    });

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var name = document.getElementById('fName');
      var phone = document.getElementById('fPhone');
      var time = document.getElementById('fTime');
      var msg = document.getElementById('fMsg');
      var ok = true;

      if (name.value.trim().length < 3) { setError(name, 'Please enter your full name.'); ok = false; }
      var digits = phone.value.replace(/\D/g, '');
      if (digits.length < 10 || digits.length > 13) { setError(phone, 'Enter a valid mobile number, e.g. 03001234567.'); ok = false; }
      if (!treatmentSelect.value) { setError(treatmentSelect, 'Please select a treatment.'); ok = false; }
      if (!dateInput.value) { setError(dateInput, 'Please pick a date.'); ok = false; }
      if (!time.value) { setError(time, 'Please pick a time slot.'); ok = false; }
      if (!ok) {
        var firstBad = form.querySelector('.f-group.invalid input, .f-group.invalid select');
        if (firstBad) firstBad.focus();
        return;
      }

      var niceDate = new Date(dateInput.value + 'T00:00:00').toLocaleDateString('en-GB', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
      });
      var lines = [
        'Assalam-o-Alaikum! I want to book an appointment at BrightSmile Dental Clinic.',
        '',
        'Name: ' + name.value.trim(),
        'Mobile: ' + phone.value.trim(),
        'Treatment: ' + treatmentSelect.value,
        'Preferred Doctor: ' + doctorSelect.value,
        'Date: ' + niceDate,
        'Time: ' + time.value
      ];
      if (msg.value.trim()) lines.push('Note: ' + msg.value.trim());
      var url = 'https://wa.me/' + CLINIC_WHATSAPP + '?text=' + encodeURIComponent(lines.join('\n'));

      var success = document.getElementById('formSuccess');
      document.getElementById('waFallback').href = url;
      success.hidden = false;
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      window.open(url, '_blank');
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
