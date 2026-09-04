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
    let isScrolled = null;
    const sync = () => {
      const shouldScroll = window.scrollY > 28;
      if (shouldScroll !== isScrolled) {
        isScrolled = shouldScroll;
        siteHeader.classList.toggle('is-scrolled', isScrolled);
      }
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
        media.innerHTML = '<img src="' + p.image + '" alt="' + p.title + '" loading="lazy" decoding="async" width="800" height="600">';
      } else {
        media.innerHTML = window.NSA_drawing(p);
      }
      title.textContent   = p.title;
      if (code) code.textContent = p.code;
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

  /* ---- Contact Hub: Interactive Service & Scale Chips ---- */
  const initChipsGroup = (containerId, inputId) => {
    const container = document.getElementById(containerId);
    const hiddenInput = document.getElementById(inputId);
    if (!container || !hiddenInput) return;

    container.addEventListener('click', (e) => {
      const chip = e.target.closest('.form-chip');
      if (!chip) return;
      container.querySelectorAll('.form-chip').forEach((c) => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      const val = chip.getAttribute('data-value') || chip.textContent.trim();
      hiddenInput.value = val;
    });
  };
  initChipsGroup('serviceChips', 'serviceInput');
  initChipsGroup('scaleChips', 'scaleInput');

  /* ---- Copy to Clipboard helper ---- */
  const copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;
      try {
        await navigator.clipboard.writeText(textToCopy);
        const textSpan = btn.querySelector('.copy-btn-text');
        const originalText = textSpan ? textSpan.textContent : '';
        btn.classList.add('is-copied');
        if (textSpan) textSpan.textContent = 'کپی شد!';
        setTimeout(() => {
          btn.classList.remove('is-copied');
          if (textSpan) textSpan.textContent = originalText;
        }, 2000);
      } catch (err) {
        // Fallback for older browsers or non-secure contexts
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand('copy');
          const textSpan = btn.querySelector('.copy-btn-text');
          const originalText = textSpan ? textSpan.textContent : '';
          btn.classList.add('is-copied');
          if (textSpan) textSpan.textContent = 'کپی شد!';
          setTimeout(() => {
            btn.classList.remove('is-copied');
            if (textSpan) textSpan.textContent = originalText;
          }, 2000);
        } catch (e) {}
        document.body.removeChild(textarea);
      }
    });
  });

  /* ---- Live Office Status Calculator (Tehran Time) ---- */
  const updateOfficeStatus = () => {
    const pill = document.getElementById('officeStatus');
    const text = document.getElementById('officeStatusText');
    if (!pill || !text) return;

    try {
      const now = new Date();
      const tehranDateStr = now.toLocaleString('en-US', { timeZone: 'Asia/Tehran' });
      const tehranDate = new Date(tehranDateStr);
      const day = tehranDate.getDay(); // 0: Sun, 1: Mon, 2: Tue, 3: Wed, 4: Thu, 5: Fri, 6: Sat
      const hour = tehranDate.getHours();
      const minute = tehranDate.getMinutes();
      const timeInMinutes = hour * 60 + minute;

      // Iran working days: Sat(6), Sun(0), Mon(1), Tue(2), Wed(3)
      // Working hours: 08:00 (480 mins) to 17:00 (1020 mins)
      const isWorkDay = [6, 0, 1, 2, 3].includes(day);
      const isOpen = isWorkDay && timeInMinutes >= 480 && timeInMinutes < 1020;

      if (isOpen) {
        pill.classList.remove('is-closed');
        text.textContent = 'هم‌اکنون دفتر باز است • پذیرش تا ۱۷:۰۰';
      } else {
        pill.classList.add('is-closed');
        if (day === 4 || day === 5) {
          text.textContent = 'دفتر اکنون تعطیل است • آغاز کار: شنبه ۸:۰۰';
        } else if (timeInMinutes < 480) {
          text.textContent = 'دفتر اکنون تعطیل است • آغاز کار: امروز ۸:۰۰';
        } else {
          text.textContent = 'دفتر اکنون تعطیل است • آغاز کار: فردا ۸:۰۰';
        }
      }
    } catch (e) {
      // Fallback
    }
  };
  updateOfficeStatus();

  /* ---- Persian Digits Helper ---- */
  const toPersianDigits = (n) => String(n).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

  /* ---- 21st.dev Mouse-tracking Spotlight Cards ---- */
  /* ---- 21st.dev Mouse-tracking Spotlight Cards (Optimized with cached rect) ---- */
  const initSpotlights = () => {
    const cards = document.querySelectorAll('.spotlight-card');
    cards.forEach((card) => {
      let rect = null;
      card.addEventListener('mouseenter', () => {
        rect = card.getBoundingClientRect();
      }, { passive: true });
      card.addEventListener('mousemove', (e) => {
        if (!rect) rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      }, { passive: true });
      card.addEventListener('mouseleave', () => {
        rect = null;
      }, { passive: true });
    });
  };
  initSpotlights();
  window.initSpotlights = initSpotlights;

  /* ---- Hero Architectural 3D Background Video & IntersectionObserver ---- */
  const heroBgVideo = document.getElementById('heroBgVideo');
  const heroSection = document.querySelector('.hero');
  if (heroBgVideo && heroSection && 'IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          heroBgVideo.play().catch(() => {});
        } else {
          heroBgVideo.pause();
        }
      });
    }, { rootMargin: '80px' });
    videoObserver.observe(heroSection);
  }

  /* ---- Animated Number Counters (Persian digits) ---- */
  const counterEls = document.querySelectorAll('[data-target]');
  if (counterEls.length && 'IntersectionObserver' in window) {
    const counterIo = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        counterIo.unobserve(el);
        const target = parseInt(el.getAttribute('data-target'), 10);
        if (isNaN(target)) return;
        const duration = 1600;
        const startTime = performance.now();
        const step = (now) => {
          const progress = Math.min((now - startTime) / duration, 1);
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(target * easeOut);
          el.textContent = toPersianDigits(current);
          if (progress < 1) requestAnimationFrame(step);
          else el.textContent = toPersianDigits(target);
        };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.15 });
    counterEls.forEach((el) => counterIo.observe(el));
  }

  /* ---- Interactive Before / After Slider ---- */
  const baContainers = document.querySelectorAll('.before-after');
  baContainers.forEach((ba) => {
    let active = false;
    const update = (clientX) => {
      const rect = ba.getBoundingClientRect();
      let pos = ((clientX - rect.left) / rect.width) * 100;
      pos = Math.max(5, Math.min(95, pos));
      ba.style.setProperty('--ba-pos', `${pos}%`);
    };
    const onDown = (e) => {
      active = true;
      const clientX = e.clientX ?? (e.touches && e.touches[0].clientX);
      if (clientX !== undefined) update(clientX);
    };
    const onUp = () => { active = false; };
    const onMove = (e) => {
      if (!active) return;
      const clientX = e.clientX ?? (e.touches && e.touches[0].clientX);
      if (clientX !== undefined) update(clientX);
    };
    ba.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('mousemove', onMove);

    ba.addEventListener('touchstart', onDown, { passive: true });
    window.addEventListener('touchend', onUp);
    window.addEventListener('touchmove', onMove, { passive: true });
  });

  /* ---- Magnetic Buttons ---- */
  const magBtns = document.querySelectorAll('.btn--magnetic');
  magBtns.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });

  /* ================================================================
     3D Circular Gallery Showcase (21st.dev component port)
     ================================================================ */
  function initCircularGallery() {
    const stage = document.getElementById('circularGalleryStage');
    const rotator = document.getElementById('circularGalleryRotator');
    if (!stage || !rotator) return;

    const prevBtn = document.getElementById('circularPrevBtn');
    const nextBtn = document.getElementById('circularNextBtn');

    const galleryProjects = [
      {
        id: 'cg-1',
        title: 'برج مسکونی لوکس پارسا',
        cat: 'طرح سه‌بعدی معماری · ۲۲ طبقه',
        loc: 'تهران / الهیه',
        badge: 'طرح ۳ بعدی معماری',
        badgeType: '3d',
        image: 'assets/projects/1769976149673.webp',
        code: 'NSA-3D-01',
        client: 'سرمایه‌گذاری بخش خصوصی',
        year: '۱۴۰۲',
        description: 'طراحی جامع معماری، مدلسازی فاز ۲ و رندرینگ واقع‌گرایانه برج مسکونی با ۲۲ طبقه و سیستم سازه بتنی قاب خمشی ویژه.'
      },
      {
        id: 'cg-2',
        title: 'نظارت عالیه و اجرای بتنی',
        cat: 'تصویر واقعی کارگاه · نظارت مقیم',
        loc: 'تهران',
        badge: 'تصویر واقعی کارگاه',
        badgeType: 'real',
        image: 'assets/projects/1770011545995.webp',
        code: 'NSA-SITE-02',
        client: 'سازمان مجری ساختمان‌های دولتی',
        year: '۱۴۰۱',
        description: 'عملیات نظارت مقیم کارگاهی، کنترل کیفی بتن‌ریزی فونداسیون و آزمون‌های غیرمخرب با استانداردهای نظام مهندسی پایه یک.'
      },
      {
        id: 'cg-3',
        title: 'مجتمع اداری تجاری دیدار',
        cat: 'طرح سه‌بعدی و مدلسازی BIM',
        loc: 'تهران / بزرگراه حقانی',
        badge: 'طرح ۳ بعدی معماری',
        badgeType: '3d',
        image: 'assets/projects/DIDAR_113542.webp',
        code: 'NSA-3D-03',
        client: 'هلدینگ عمران دیدار',
        year: '۱۴۰۳',
        description: 'طراحی معماری معاصر با تلفیق شیشه و آلومینیوم کامپوزیت، هماهنگ‌سازی نقشه‌های تاسیسات و سازه در پلتفرم BIM.'
      },
      {
        id: 'cg-4',
        title: 'برج تجاری چندمنظوره',
        cat: 'طراحی معماری و سازه',
        loc: 'گیلان / رشت',
        badge: 'طرح ۳ بعدی معماری',
        badgeType: '3d',
        image: 'assets/projects/1787629992134.webp',
        code: 'NSA-3D-04',
        client: 'شرکت سرمایه‌گذاری سپیدرود',
        year: '۱۴۰۱',
        description: 'طراحی مفهومی و محاسبات لرزه‌ای سازه فولادی پیشرفته با دهانه‌های بزرگ و فضاهای باز تجاری.'
      },
      {
        id: 'cg-5',
        title: 'پردیس پارک علم و فناوری',
        cat: 'طرح سه‌بعدی جامع و محوطه‌سازی',
        loc: 'تهران / پردیس',
        badge: 'طرح ۳ بعدی معماری',
        badgeType: '3d',
        image: 'assets/projects/elm fanavari_113531.webp',
        code: 'NSA-3D-05',
        client: 'معاونت علمی و فناوری ریاست جمهوری',
        year: '۱۴۰۰',
        description: 'طرح کلان سایت، ساختمان‌های اداری و آزمایشگاهی با معماری پایدار، بهینه‌سازی مصرف انرژی و روف‌گاردن‌های مدرن.'
      },
      {
        id: 'cg-6',
        title: 'آرماتوربندی و کنترل کیفی',
        cat: 'تصویر واقعی کارگاه · آزمایشگاه مقیم',
        loc: 'اصفهان',
        badge: 'تصویر واقعی کارگاه',
        badgeType: 'real',
        image: 'assets/projects/IMG_20260614_091140_548.webp',
        code: 'NSA-SITE-06',
        client: 'شهرداری اصفهان',
        year: '۱۴۰۲',
        description: 'نظارت تخصصی بر چیدمان میلگردها، اتصال مکانیکی (کوپلر) و بررسی مقاومت تسلیم مصالح در پروژه تقاطع چندسطحی.'
      },
      {
        id: 'cg-7',
        title: 'مجتمع اقامتی و گردشگری',
        cat: 'طرح سه‌بعدی معماری',
        loc: 'مازندران / رامسر',
        badge: 'طرح ۳ بعدی معماری',
        badgeType: '3d',
        image: 'assets/projects/1769976149661.webp',
        code: 'NSA-3D-07',
        client: 'شرکت توسعه گردشگری آرین',
        year: '۱۴۰۱',
        description: 'طراحی معماری منطبق با اقلیم معتدل و مرطوب شمال، تراس‌های کنسول‌شده رو به دریا و سازه بتن مسلح مقاوم به رطوبت.'
      },
      {
        id: 'cg-8',
        title: 'سازه اسکلت بتنی و نظارت',
        cat: 'تصویر واقعی کارگاه · نظارت کارگاهی',
        loc: 'شیراز',
        badge: 'تصویر واقعی کارگاه',
        badgeType: 'real',
        image: 'assets/projects/1770024107531.webp',
        code: 'NSA-SITE-08',
        client: 'سازمان مسکن و شهرسازی',
        year: '۱۴۰۰',
        description: 'مدیریت نظارت بر قالب‌بندی مدولار، شاقول‌سازی ستون‌ها و کنترل کیفی اجرای دیوارهای برشی پروژه مسکونی.'
      },
      {
        id: 'cg-9',
        title: 'دهکده ساحلی و گردشگری',
        cat: 'طرح سه‌بعدی و سایت‌پلان',
        loc: 'کیش',
        badge: 'طرح ۳ بعدی معماری',
        badgeType: '3d',
        image: 'assets/projects/01 ok_072527.webp',
        code: 'NSA-3D-09',
        client: 'سازمان منطقه آزاد کیش',
        year: '۱۳۹۹',
        description: 'مسترپلان تفصیلی و طراحی بلوک‌های ویلایی ساحلی با نمای سفید مدرن و بهره‌گیری از جریان بادهای مطلوب خلیج فارس.'
      },
      {
        id: 'cg-10',
        title: 'مجتمع اداری و انتظامی',
        cat: 'تصویر واقعی پروژه · تحویل قطعی',
        loc: 'تهران',
        badge: 'تصویر واقعی کارگاه',
        badgeType: 'real',
        image: 'assets/projects/polic_102036.webp',
        code: 'NSA-SITE-10',
        client: 'فرماندهی انتظامی کل کشور',
        year: '۱۴۰۲',
        description: 'طراحی و نظارت کامل تا تحویل موقت و قطعی ساختمان اداری و خدماتی با رعایت کامل ضوابط پدافند غیرعامل.'
      },
      {
        id: 'cg-11',
        title: 'سالن همایش و آمفی‌تئاتر',
        cat: 'طرح سه‌بعدی و طراحی داخلی',
        loc: 'مشهد',
        badge: 'طرح ۳ بعدی معماری',
        badgeType: '3d',
        image: 'assets/projects/InShot_20260201_214433625.webp',
        code: 'NSA-3D-11',
        client: 'موسسه آموزش عالی فردوس',
        year: '۱۴۰۲',
        description: 'محاسبات آکوستیک، نورپردازی تخصصی صحنه و طراحی مدرن پانل‌های دیواری جاذب صدا برای سالن همایش ۵۰۰ نفره.'
      },
      {
        id: 'cg-12',
        title: 'مرکز خرید و تجاری آریا',
        cat: 'تصویر واقعی نما و بهره‌برداری',
        loc: 'تبریز',
        badge: 'تصویر واقعی کارگاه',
        badgeType: 'real',
        image: 'assets/projects/1770021679871 (1).webp',
        code: 'NSA-SITE-12',
        client: 'شرکت سرمایه‌گذاری آریا',
        year: '۱۴۰۰',
        description: 'نظارت عالیه بر اجرای نمای مدرن و جزئیات تاسیسات مکانیکی و الکتریکی پروژه تجاری در مرکز کلانشهر تبریز.'
      }
    ];

    // Inject into window.NSA_PROJECTS if available so modal can display them
    if (window.NSA_PROJECTS) {
      galleryProjects.forEach((p) => {
        if (!window.NSA_PROJECTS.some((x) => x.id === p.id)) {
          window.NSA_PROJECTS.push({
            id: p.id,
            code: p.code,
            title: p.title,
            summary: p.cat,
            client: p.client,
            location: p.loc,
            year: p.year,
            category: p.cat,
            categorySlug: p.badgeType === '3d' ? '3d-render' : 'real-photo',
            image: p.image,
            description: p.description
          });
        }
      });
    }

    const total = galleryProjects.length;
    const angleStep = 360 / total;

    const getRadius = () => {
      const w = window.innerWidth;
      if (w < 600) return 340;
      if (w < 960) return 480;
      return 640;
    };

    let radius = getRadius();

    // Render items into rotator
    rotator.innerHTML = '';
    const itemEls = [];

    galleryProjects.forEach((p, i) => {
      const item = document.createElement('div');
      item.className = 'circular-gallery-item';
      item.dataset.index = String(i);

      const baseAngle = i * angleStep;
      item.style.transform = `rotateY(${baseAngle}deg) translateZ(${radius}px)`;

      item.innerHTML = `
        <div class="circular-gallery-card" data-project="${p.id}" tabindex="0" role="button" aria-label="${p.title}">
          <img class="circular-gallery-img" src="${p.image}" alt="${p.title}" loading="lazy" decoding="async" width="290" height="400" />
          <div class="circular-gallery-scrim">
            <h3 class="circular-gallery-title">${p.title}</h3>
            <div class="circular-gallery-loc">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 21s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 7.2c0 7.3-8 11.8-8 11.8z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span>${p.loc}</span>
            </div>
          </div>
        </div>
      `;
      rotator.appendChild(item);
      itemEls.push(item);
    });

    // Animation & physics state
    let currentAngle = 0;
    let targetAngle = 0;
    let isAutoRotating = true;
    let autoSpeed = 0.12;
    let lastCardUpdateAngle = -9999;
    let isVisible = false;
    let rafId = null;

    const updateTransforms = () => {
      radius = getRadius();
      itemEls.forEach((item, i) => {
        const baseAngle = i * angleStep;
        item.style.transform = `rotateY(${baseAngle}deg) translateZ(${radius}px)`;
      });
      lastCardUpdateAngle = -9999; // force opacity refresh on resize
    };
    window.addEventListener('resize', updateTransforms);

    // Optimized render loop
    const tick = () => {
      if (!isVisible) {
        rafId = null;
        return;
      }

      if (isAutoRotating) {
        targetAngle -= autoSpeed;
      }

      currentAngle += (targetAngle - currentAngle) * 0.1;
      rotator.style.transform = `rotateY(${currentAngle}deg)`;

      // Throttle card opacity and pointer-events updates to avoid per-frame style recalculations
      if (Math.abs(currentAngle - lastCardUpdateAngle) > 0.45) {
        lastCardUpdateAngle = currentAngle;
        for (let i = 0; i < total; i++) {
          const baseAngle = i * angleStep;
          let diff = (currentAngle + baseAngle) % 360;
          if (diff < 0) diff += 360;
          const distFromCenter = Math.abs(diff <= 180 ? diff : 360 - diff);

          const opacity = Math.max(0.18, 1 - (distFromCenter / 180) * 1.08);
          itemEls[i].style.opacity = opacity.toFixed(3);
          itemEls[i].style.pointerEvents = distFromCenter < 65 ? 'auto' : 'none';
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    // IntersectionObserver to pause loop completely when offscreen
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            isVisible = entry.isIntersecting;
            if (isVisible) {
              lastScrollY = window.scrollY;
              if (!rafId) rafId = requestAnimationFrame(tick);
            } else {
              if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = null;
              }
            }
          });
        },
        { rootMargin: '100px' }
      );
      observer.observe(stage);
    } else {
      isVisible = true;
      rafId = requestAnimationFrame(tick);
    }

    // Scroll-driven rotation (smoothly rotates as the user scrolls past the gallery)
    let lastScrollY = window.scrollY;
    window.addEventListener(
      'scroll',
      () => {
        const scrollY = window.scrollY;
        if (!isVisible) {
          lastScrollY = scrollY;
          return;
        }
        const dy = scrollY - lastScrollY;
        lastScrollY = scrollY;
        targetAngle -= dy * 0.12;
      },
      { passive: true }
    );

    // Hover pause behavior: pauses on hover, resumes on mouse leave
    stage.addEventListener('mouseenter', () => {
      isAutoRotating = false;
    });
    stage.addEventListener('mouseleave', () => {
      isAutoRotating = true;
    });

    // Navigation buttons (Prev / Next)
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        targetAngle += angleStep;
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        targetAngle -= angleStep;
      });
    }
  }

  // Initialize Circular 3D Gallery
  initCircularGallery();
})();

