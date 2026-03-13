// nav scroll
(function(){
  const nav = document.getElementById('mainNav');
  if(!nav) return;
  function update(){
    if(window.scrollY > 60){
      nav.classList.remove('nav--transparent');
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.add('nav--transparent');
      nav.classList.remove('nav--scrolled');
    }
  }
  window.addEventListener('scroll', update, {passive:true});
  update();
})();

// fade-in on scroll
(function(){
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(e.isIntersecting){ e.target.classList.add('in'); obs.unobserve(e.target); }
    });
  }, {threshold: 0.1});
  document.querySelectorAll('.fade').forEach(el => obs.observe(el));
})();

// faq accordion
document.querySelectorAll('.faq-item').forEach(item => {
  const q = item.querySelector('.faq-q');
  if(q) q.addEventListener('click', () => {
    const open = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if(!open) item.classList.add('open');
  });
});
