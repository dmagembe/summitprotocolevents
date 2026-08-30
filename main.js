(function(){
  const nav = document.getElementById('mainNav');
  const hamburger = document.getElementById('hamburgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  function updateNav(){
    if(!nav) return;
    const force = nav.dataset.solid === 'true';
    if(force || window.scrollY > 50){
      nav.classList.remove('nav--transparent');
      nav.classList.add('nav--scrolled');
    }else{
      nav.classList.add('nav--transparent');
      nav.classList.remove('nav--scrolled');
    }
  }

  if(nav){
    window.addEventListener('scroll', updateNav, {passive:true});
    updateNav();
  }

  if(hamburger && mobileMenu){
    function setMenuOpen(open){
      hamburger.classList.toggle('open', open);
      mobileMenu.classList.toggle('open', open);
      document.body.classList.toggle('menu-open', open);
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
      mobileMenu.setAttribute('aria-hidden', open ? 'false' : 'true');
    }
    hamburger.addEventListener('click', function(){
      setMenuOpen(!mobileMenu.classList.contains('open'));
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function(){
        setMenuOpen(false);
      });
    });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && mobileMenu.classList.contains('open')) setMenuOpen(false);
    });
  }

  if('IntersectionObserver' in window){
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('in');
          obs.unobserve(entry.target);
        }
      });
    }, {threshold:.1});
    document.querySelectorAll('.fade').forEach(el => obs.observe(el));
  }else{
    document.querySelectorAll('.fade').forEach(el => el.classList.add('in'));
  }

  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    if(!q) return;
    q.addEventListener('click', () => {
      const open = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if(!open) item.classList.add('open');
    });
  });
})();

(function(){
  const counters = document.querySelectorAll('[data-count]');
  if(!counters.length || !('IntersectionObserver' in window)) return;

  function animateCounter(el){
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();

    function tick(now){
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if(progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        animateCounter(entry.target);
        counterObs.unobserve(entry.target);
      }
    });
  }, {threshold:.5});

  counters.forEach(el => counterObs.observe(el));
})();

(function(){
  const filterBtns = document.querySelectorAll('[data-filter]');
  const filterItems = document.querySelectorAll('[data-category]');
  if(!filterBtns.length || !filterItems.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterItems.forEach(item => {
        item.classList.toggle('hidden', filter !== 'all' && item.dataset.category !== filter);
      });
    });
  });
})();

(function(){
  const lightbox = document.getElementById('lightbox');
  if(!lightbox) return;

  const media = document.getElementById('lbMedia');
  const cat = document.getElementById('lbCat');
  const title = document.getElementById('lbTitle');
  const close = document.getElementById('lbClose');
  const prev = document.getElementById('lbPrev');
  const next = document.getElementById('lbNext');
  let items = [];
  let current = 0;

  function visibleItems(){
    return [...document.querySelectorAll('[data-lightbox]')].filter(item => !item.classList.contains('hidden'));
  }

  function render(index){
    if(!items.length || !media) return;
    current = (index + items.length) % items.length;
    const item = items[current];
    const type = item.dataset.type || 'image';
    const src = item.dataset.src;
    const poster = item.dataset.poster || '';
    const alt = item.dataset.alt || item.dataset.title || 'Summit Protocol media';

    if(type === 'video'){
      media.innerHTML = '<video controls autoplay playsinline poster="' + poster + '"><source src="' + src + '"></video>';
    }else{
      media.innerHTML = '<img src="' + src + '" alt="' + alt + '">';
    }
    if(cat) cat.textContent = item.dataset.categoryLabel || item.dataset.category || '';
    if(title) title.textContent = item.dataset.title || '';
  }

  document.querySelectorAll('[data-lightbox]').forEach(item => {
    item.addEventListener('click', () => {
      items = visibleItems();
      current = items.indexOf(item);
      if(current < 0) current = 0;
      render(current);
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLb(){
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    if(media) media.innerHTML = '';
  }

  close && close.addEventListener('click', closeLb);
  prev && prev.addEventListener('click', () => render(current - 1));
  next && next.addEventListener('click', () => render(current + 1));
  lightbox.addEventListener('click', e => {
    if(e.target === lightbox) closeLb();
  });
  document.addEventListener('keydown', e => {
    if(!lightbox.classList.contains('open')) return;
    if(e.key === 'Escape') closeLb();
    if(e.key === 'ArrowLeft') render(current - 1);
    if(e.key === 'ArrowRight') render(current + 1);
  });
})();

(function(){
  const guestInput = document.getElementById('guestCount');
  const guestRange = document.getElementById('guestRange');
  const eventType = document.getElementById('eventType');
  const eventDays = document.getElementById('eventDays');
  if(!guestInput || !guestRange || !eventType || !eventDays) return;

  const packages = [
    {name:'Starter', min:0, max:100, ushers:5, base:1000000},
    {name:'Essential', min:101, max:200, ushers:10, base:2000000},
    {name:'Standard', min:201, max:400, ushers:15, base:3500000},
    {name:'Premium', min:401, max:700, ushers:20, base:5000000},
    {name:'Executive', min:701, max:1000, ushers:30, base:7500000},
    {name:'Grand', min:1001, max:1500, ushers:40, base:10000000}
  ];

  function fmt(n){ return 'UGX ' + n.toLocaleString('en-UG'); }
  function pkgFor(guests){ return packages.find(p => guests >= p.min && guests <= p.max) || packages[packages.length - 1]; }
  function price(pkg){
    return Math.round(pkg.base * parseFloat(eventType.value) * parseFloat(eventDays.value) / 100000) * 100000;
  }

  function setText(id, value){
    const el = document.getElementById(id);
    if(el) el.textContent = value;
  }
  function setValue(id, value){
    const el = document.getElementById(id);
    if(el) el.value = value;
  }

  function update(){
    const guests = Math.min(1500, Math.max(10, parseInt(guestInput.value, 10) || 10));
    const pkg = pkgFor(guests);
    const total = price(pkg);

    guestRange.value = guests;
    setText('rcPackage', pkg.name);
    setText('rcGuests', pkg.min.toLocaleString() + '-' + pkg.max.toLocaleString() + ' guests');
    setText('rcUshers', pkg.ushers);
    setText('rcPrice', fmt(total));
    setValue('formGuestCount', guests);
    setValue('formPackage', pkg.name + ' Package - ' + pkg.ushers + ' ushers (' + fmt(total) + ' estimate)');

    document.querySelectorAll('#pkgTable tbody tr').forEach(row => {
      row.classList.toggle('pkg-active', row.dataset.pkg === pkg.name);
    });
  }

  guestInput.addEventListener('input', update);
  guestRange.addEventListener('input', () => {
    guestInput.value = guestRange.value;
    update();
  });
  eventType.addEventListener('change', update);
  eventDays.addEventListener('change', update);
  update();
})();

(function(){
  const email = 'summitprotocolinfo@gmail.com';
  const whatsapp = '256780793279';

  function values(form){
    return Object.fromEntries(new FormData(form).entries());
  }

  function lines(fields){
    return Object.entries(fields)
      .filter(([, value]) => String(value || '').trim())
      .map(([key, value]) => key.replaceAll('_',' ') + ': ' + value);
  }

  function openMail(subject, fields){
    const body = lines(fields).join('\n');
    window.location.href = 'mailto:' + email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  }

  function openWhatsApp(prefix, fields){
    const body = prefix + '\n\n' + lines(fields).join('\n');
    window.open('https://wa.me/' + whatsapp + '?text=' + encodeURIComponent(body), '_blank', 'noopener');
  }

  document.querySelectorAll('[data-email-form]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      openMail(form.dataset.subject || 'Summit Protocol Enquiry', values(form));
    });
  });

  document.querySelectorAll('[data-whatsapp-submit]').forEach(button => {
    button.addEventListener('click', () => {
      const form = button.closest('form');
      if(!form) return;
      if(!form.reportValidity()) return;
      openWhatsApp(button.dataset.message || 'Hello Summit Protocol, I would like to make an enquiry.', values(form));
    });
  });
})();
