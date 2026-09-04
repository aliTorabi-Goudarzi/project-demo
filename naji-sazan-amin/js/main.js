/* ================================================================
   Naji Sazan Amin — Front-end behaviour
   - Theme toggle (light/dark, persisted)
   - Mobile drawer
   - Scroll reveal
   - Project modal
   - Project filter
   - Contact form validation
   ================================================================ */

(function () {
  'use strict';

  /* ---- Theme ---- */
  const root = document.documentElement;
  const saved = localStorage.getItem('nsa-theme');
  if (saved === 'dark' || saved === 'light') root.setAttribute('data-theme', saved);
  else if (window.matchMedia('(prefers-color-scheme: dark)').matches) root.setAttribute('data-theme', 'dark');

  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('nsa-theme', next);
    });
  }

  /* ---- Mobile drawer ---- */
  const menuBtn = document.getElementById('menuBtn');
  const drawer = document.getElementById('drawer');
  if (menuBtn && drawer) {
    const setOpen = (open) => {
      const willOpen = open ?? !drawer.classList.contains('is-open');
      drawer.classList.toggle('is-open', willOpen);
      menuBtn.setAttribute('aria-expanded', String(willOpen));
      document.body.style.overflow = willOpen ? 'hidden' : '';
    };
    menuBtn.addEventListener('click', () => setOpen());
    drawer.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && drawer.classList.contains('is-open')) setOpen(false); });
  }

  /* ---- Floating header scroll state ---- */
  const siteHeader = document.getElementById('siteHeader');
  if (siteHeader) {
    let ticking = false;
    const sync = () => {
      siteHeader.classList.toggle('is-scrolled', window.scrollY > 8);
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(sync); }
    }, { passive: true });
    sync();
  }

  /* ---- Scroll reveal ---- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---- Project modal ---- */
  const modal = document.getElementById('projectModal');
  if (modal && window.NSA_PROJECTS) {
    const media    = document.getElementById('modalMedia');
    const title    = document.getElementById('modalTitle');
    const code     = document.getElementById('modalCode');
    const client   = document.getElementById('modalClient');
    const location = document.getElementById('modalLocation');
    const year     = document.getElementById('modalYear');
    const category = document.getElementById('modalCategory');
    const desc     = document.getElementById('modalDesc');
    const closeBtn = document.getElementById('modalClose');

    const open = (id) => {
      const p = window.NSA_PROJECTS.find(x => x.id === id);
      if (!p) return;
      if (p.image) {
        const base = p.image.replace(/\.jpg$/, '');
        media.innerHTML = '<picture>' +
          '<source srcset="' + base + '.webp" type="image/webp">' +
          '<img src="' + p.image + '" alt="' + p.title + '" loading="lazy" width="800" height="600">' +
          '</picture>';
      } else {
        media.innerHTML = window.NSA_drawing(p);
      }
      title.textContent   = p.title;
      code.textContent    = p.code;
      client.textContent  = p.client;
      location.textContent= p.location;
      year.textContent    = p.year;
      category.textContent= p.category;
      desc.textContent    = p.description;
      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    };
    const close = () => {
      modal.classList.remove('is-open');
      document.body.style.overflow = '';
    };

    document.addEventListener('click', (e) => {
      const card = e.target.closest('[data-project]');
      if (card) { e.preventDefault(); open(card.dataset.project); }
    });
    closeBtn && closeBtn.addEventListener('click', close);
    modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  }

  /* ---- Filter ---- */
  const filterBar = document.getElementById('filterBar');
  const projectGrid = document.getElementById('projectGrid');
  if (filterBar && projectGrid && window.NSA_PROJECTS) {
    filterBar.addEventListener('click', (e) => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      filterBar.querySelectorAll('.chip').forEach((c) => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      const cat = chip.dataset.cat;
      projectGrid.querySelectorAll('.project').forEach((card) => {
        const show = cat === 'all' || card.dataset.cat === cat;
        card.style.display = show ? '' : 'none';
      });
    });
  }

  /* ---- Services21: autoplay with progress bar ---- */
  const svcList = document.getElementById('svc21List');
  if (svcList) {
    const img = document.getElementById('svc21Img');
    const title = document.getElementById('svc21Title');
    const desc = document.getElementById('svc21Desc');
    const link = document.getElementById('svc21Link');
    const items = Array.from(svcList.querySelectorAll('.svc21__item'));
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const DUR = 5000;
    let idx = Math.max(0, items.findIndex((b) => b.classList.contains('is-active')));
    let timer = null;
    const show = (btn, instant) => {
      items.forEach((b) => b.classList.toggle('is-active', b === btn));
      const swap = () => {
        img.src = btn.dataset.img;
        img.alt = btn.dataset.alt || btn.dataset.title;
        title.textContent = btn.dataset.title;
        desc.textContent = btn.dataset.desc;
        link.textContent = btn.dataset.link;
        link.href = btn.dataset.href;
        img.classList.remove('is-fading');
      };
      if (instant || reduceMotion) { swap(); return; }
      img.classList.add('is-fading');
      setTimeout(swap, 150);
    };
    const restartBar = (btn) => {
      const fill = btn.querySelector('.svc21__bar-fill');
      if (!fill) return;
      fill.style.animation = 'none';
      void fill.offsetWidth;
      fill.style.animation = '';
    };
    const stop = () => { if (timer) { clearTimeout(timer); timer = null; } };
    const play = () => {
      if (reduceMotion || document.hidden) return;
      stop();
      timer = setTimeout(() => {
        idx = (idx + 1) % items.length;
        show(items[idx]);
        restartBar(items[idx]);
        play();
      }, DUR);
    };
    const go = (i, instant) => {
      idx = i;
      show(items[idx], instant);
      restartBar(items[idx]);
      play();
    };
    document.documentElement.style.setProperty('--svc21-dur', (DUR / 1000) + 's');
    show(items[idx], true);
    restartBar(items[idx]);
    play();
    items.forEach((btn, i) => {
      btn.addEventListener('click', () => go(i, true));
      btn.addEventListener('focus', () => { stop(); svcList.classList.add('is-paused'); show(items[i], true); });
      btn.addEventListener('blur', () => { svcList.classList.remove('is-paused'); restartBar(items[idx]); play(); });
    });
    svcList.addEventListener('mouseenter', () => { stop(); svcList.classList.add('is-paused'); });
    svcList.addEventListener('mouseleave', () => { svcList.classList.remove('is-paused'); restartBar(items[idx]); play(); });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { stop(); svcList.classList.add('is-paused'); }
      else { svcList.classList.remove('is-paused'); restartBar(items[idx]); play(); }
    });
  }

  /* ---- Contact form ---- */
  const form = document.getElementById('contactForm');
  if (form) {
    const success = document.getElementById('formSuccess');
    const validators = {
      name:    (v) => v.trim().length >= 2  || 'نام و نام خانوادگی الزامی است',
      email:   (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'ایمیل معتبر وارد کنید',
      phone:   (v) => v.trim() === '' || /^[\d\+\-\s]{8,}$/.test(v) || 'شماره تماس معتبر وارد کنید',
      message: (v) => v.trim().length >= 10 || 'پیام باید حداقل ۱۰ کاراکتر باشد'
    };
    const setError = (field, msg) => {
      const wrap = field.closest('.field');
      if (!wrap) return;
      if (msg === true) { wrap.classList.remove('field--error'); return; }
      wrap.classList.add('field--error');
      const err = wrap.querySelector('.field__error');
      if (err && typeof msg === 'string') err.textContent = msg;
    };
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let ok = true;
      Object.keys(validators).forEach((name) => {
        const field = form.elements[name];
        if (!field) return;
        const res = validators[name](field.value);
        if (res !== true) { setError(field, res); ok = false; }
        else setError(field, true);
      });
      if (!ok) return;
      success.classList.add('is-visible');
      form.reset();
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => success.classList.remove('is-visible'), 6000);
    });
    form.addEventListener('input', (e) => {
      if (e.target.closest('.field--error')) setError(e.target, true);
    });
  }
})();
