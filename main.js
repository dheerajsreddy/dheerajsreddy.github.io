/* ============================================================
   Dheeraj Sridhar Reddy — portfolio
   Vanilla JS, no dependencies.
   ============================================================ */
(() => {
  'use strict';

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- theme ---------- */
  const root = document.documentElement;
  const stored = localStorage.getItem('theme');
  const systemLight = matchMedia('(prefers-color-scheme: light)').matches;
  root.dataset.theme = stored || (systemLight ? 'light' : 'dark');

  const setTheme = t => {
    root.dataset.theme = t;
    localStorage.setItem('theme', t);
    $('meta[name="theme-color"]')?.setAttribute('content', t === 'light' ? '#fbfbfa' : '#08080a');
  };
  const toggleTheme = () => setTheme(root.dataset.theme === 'light' ? 'dark' : 'light');
  $('#theme-toggle').addEventListener('click', toggleTheme);

  /* ---------- year ---------- */
  $('#yr').textContent = new Date().getFullYear();

  /* ---------- portrait: fall back to the monogram if no photo yet ---------- */
  const me = $('#me');
  const noPhoto = () => $('#portrait').classList.add('no-img');
  me.addEventListener('error', noPhoto);
  if (me.complete && me.naturalWidth === 0) noPhoto();

  /* ---------- nav: stuck state + scroll progress ---------- */
  const nav = $('#nav');
  const bar = $('#progress-bar');

  const onScroll = () => {
    nav.classList.toggle('stuck', scrollY > 12);
    const h = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = (h > 0 ? (scrollY / h) * 100 : 0) + '%';
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- nav: scroll-spy with sliding indicator ---------- */
  const navLinks = $$('.links a');
  const ind = $('#ind');

  const moveInd = el => {
    if (!el) { ind.style.opacity = '0'; return; }
    ind.style.opacity = '1';
    ind.style.width = el.offsetWidth + 'px';
    ind.style.transform = `translateX(${el.offsetLeft}px)`;
  };

  const spy = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const link = navLinks.find(a => a.getAttribute('href') === '#' + e.target.id);
      navLinks.forEach(a => a.classList.remove('on'));
      if (link) { link.classList.add('on'); moveInd(link); }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  $$('section[id]').forEach(s => spy.observe(s));
  navLinks.forEach(a => a.addEventListener('mouseenter', () => moveInd(a)));
  $('.links').addEventListener('mouseleave', () => moveInd($('.links a.on')));
  addEventListener('resize', () => moveInd($('.links a.on')));

  /* ---------- reveal on scroll ---------- */
  if (reduced) {
    $$('.reveal').forEach(el => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    $$('.reveal').forEach(el => io.observe(el));
  }

  /* ---------- cards: cursor-follow glow ---------- */
  if (!reduced && matchMedia('(hover: hover)').matches) {
    $$('.card').forEach(card => {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    });
  }

  /* ---------- project filters ---------- */
  const cards = $$('#grid .card');
  $$('.filters button').forEach(btn => {
    btn.addEventListener('click', () => {
      const f = btn.dataset.f;
      $$('.filters button').forEach(b => b.setAttribute('aria-selected', String(b === btn)));
      cards.forEach(c => {
        const show = f === 'all' || c.dataset.tag.split(' ').includes(f);
        c.classList.toggle('hide', !show);
      });
    });
  });

  /* ---------- copy email ---------- */
  const copyBtn = $('#copy-mail');
  copyBtn.addEventListener('click', async () => {
    const label = copyBtn.querySelector('span');
    try {
      await navigator.clipboard.writeText(copyBtn.dataset.mail);
      const old = label.textContent;
      label.textContent = 'Copied';
      setTimeout(() => { label.textContent = old; }, 1600);
    } catch {
      location.href = 'mailto:' + copyBtn.dataset.mail;
    }
  });

  /* ---------- command palette ---------- */
  const ICON = {
    jump: '<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    code: '<svg viewBox="0 0 24 24"><path d="M9 8l-4 4 4 4M15 8l4 4-4 4"/></svg>',
    link: '<svg viewBox="0 0 24 24"><path d="M9.5 14.5l5-5M11 6.5l1.6-1.6a4 4 0 1 1 5.6 5.6L16.5 12M13 17.5l-1.6 1.6a4 4 0 1 1-5.6-5.6L7.5 12"/></svg>',
    doc:  '<svg viewBox="0 0 24 24"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/></svg>',
    mail: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 6.5l8.5 6 8.5-6"/></svg>',
    bulb: '<svg viewBox="0 0 24 24"><path d="M9.5 18h5M10 21h4M12 3a6 6 0 0 1 3.6 10.8c-.6.5-.9 1-1 1.7h-5.2c-.1-.7-.4-1.2-1-1.7A6 6 0 0 1 12 3z"/></svg>'
  };

  const items = [
    { t: 'Experience',  s: 'Scry AI · Netcore Unbxd · Viga',       i: ICON.jump, k: 'nav', go: '#work' },
    { t: 'Selected work', s: 'Projects and things I have built',   i: ICON.jump, k: 'nav', go: '#projects' },
    { t: 'Research',    s: 'Publications',                          i: ICON.jump, k: 'nav', go: '#writing' },
    { t: 'Stack',       s: 'Languages, infra, ML tooling',          i: ICON.jump, k: 'nav', go: '#stack' },
    { t: 'About',       s: 'Background and education',              i: ICON.jump, k: 'nav', go: '#about' },
    { t: 'Contact',     s: 'Get in touch',                          i: ICON.jump, k: 'nav', go: '#contact' },

    { t: 'PocketLLM',   s: 'Self-hosted AI assistant · MERN + Ollama + RAG', i: ICON.code, k: 'project', url: 'https://github.com/dheerajsreddy/PocketLLM' },
    { t: 'Multimodal Misinformation Detection', s: 'BERT + ViT + GraphSAGE · 56% → 82%', i: ICON.code, k: 'project', url: 'https://github.com/dheerajsreddy/swarm-guard' },
    { t: 'Sarcasm Detection in Indic Languages', s: 'XLM-RoBERTa · macro F1 0.91', i: ICON.code, k: 'project', url: 'https://github.com/dheerajsreddy/Sarcasm-Detection-in-Low-Resource-Indic-Languages' },
    { t: 'FinSight',    s: 'Agentic financial research · Groq + Llama 4', i: ICON.code, k: 'project', url: 'https://github.com/dheerajsreddy/Agentic_AI' },
    { t: 'Fix-It',      s: 'Multimodal repair diagnosis · Gemini · LA Hacks', i: ICON.code, k: 'project', url: 'https://github.com/dheerajsreddy/LA_Hacks' },
    { t: 'Cardiac Segmentation', s: 'Chest CT · K-Means + morphology', i: ICON.code, k: 'project', url: 'https://github.com/dheerajsreddy/cardiac-segmentation' },

    { t: 'GitHub',      s: 'github.com/dheerajsreddy',              i: ICON.link, k: 'link', url: 'https://github.com/dheerajsreddy' },
    { t: 'LinkedIn',    s: 'linkedin.com/in/dheerajsreddy',         i: ICON.link, k: 'link', url: 'https://linkedin.com/in/dheerajsreddy' },
    { t: 'Download résumé', s: 'PDF',                               i: ICON.doc,  k: 'link', url: 'assets/Dheeraj_Sridhar_Reddy_Resume.pdf' },
    { t: 'Email me',    s: 'dsreddy@usc.edu',                       i: ICON.mail, k: 'link', url: 'mailto:dsreddy@usc.edu' },

    { t: 'Toggle theme', s: 'Switch between dark and light',        i: ICON.bulb, k: 'action', fn: toggleTheme }
  ];

  const pal   = $('#pal');
  const input = $('#pal-input');
  const list  = $('#pal-list');
  let results = [], cursor = 0;

  const score = (item, q) => {
    const hay = (item.t + ' ' + item.s).toLowerCase();
    if (!q) return 1;
    if (item.t.toLowerCase().startsWith(q)) return 3;
    if (hay.includes(q)) return 2;
    // subsequence match, so "pllm" still finds PocketLLM
    let i = 0;
    for (const ch of hay) if (ch === q[i]) i++;
    return i === q.length ? 1 : 0;
  };

  const render = () => {
    if (!results.length) {
      list.innerHTML = '<div class="pal-empty">No matches.</div>';
      return;
    }
    list.innerHTML = results.map((it, n) => `
      <li role="option" aria-selected="${n === cursor}" data-n="${n}">
        <span class="pi">${it.i}</span>
        <span class="pt"><b>${it.t}</b><span>${it.s}</span></span>
        <span class="pk">${it.k}</span>
      </li>`).join('');

    list.querySelectorAll('li').forEach(li => {
      li.addEventListener('click', () => run(results[+li.dataset.n]));
      li.addEventListener('mousemove', () => {
        cursor = +li.dataset.n;
        list.querySelectorAll('li').forEach(x => x.setAttribute('aria-selected', String(+x.dataset.n === cursor)));
      });
    });
    list.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' });
  };

  const filter = () => {
    const q = input.value.trim().toLowerCase();
    results = items
      .map(it => ({ it, s: score(it, q) }))
      .filter(r => r.s > 0)
      .sort((a, b) => b.s - a.s)
      .map(r => r.it);
    cursor = 0;
    render();
  };

  const open = () => {
    pal.hidden = false;
    document.body.style.overflow = 'hidden';
    input.value = '';
    filter();
    input.focus();
  };
  const close = () => {
    pal.hidden = true;
    document.body.style.overflow = '';
  };
  const run = item => {
    close();
    if (item.fn) return item.fn();
    if (item.go) return document.querySelector(item.go)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    if (item.url) {
      const external = /^https?:|^mailto:/.test(item.url);
      if (item.url.startsWith('mailto:')) location.href = item.url;
      else window.open(item.url, external ? '_blank' : '_self', 'noopener');
    }
  };

  $('#open-palette').addEventListener('click', open);
  input.addEventListener('input', filter);

  pal.addEventListener('click', e => { if (e.target === pal) close(); });

  addEventListener('keydown', e => {
    const mod = e.metaKey || e.ctrlKey;
    if (mod && e.key.toLowerCase() === 'k') { e.preventDefault(); pal.hidden ? open() : close(); return; }
    if (e.key === '/' && pal.hidden && !/^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName)) {
      e.preventDefault(); open(); return;
    }
    if (pal.hidden) return;

    if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); cursor = (cursor + 1) % results.length; render(); }
    else if (e.key === 'ArrowUp')   { e.preventDefault(); cursor = (cursor - 1 + results.length) % results.length; render(); }
    else if (e.key === 'Enter')     { e.preventDefault(); if (results[cursor]) run(results[cursor]); }
  });

  /* ---------- console easter egg ---------- */
  console.log(
    '%cDheeraj Sridhar Reddy%c\nSoftware Engineer @ Scry AI\nLooked under the hood — I like that.\ngithub.com/dheerajsreddy',
    'font-size:15px;font-weight:600;color:#7c6cff', 'color:#8b8b98;line-height:1.6'
  );
})();
