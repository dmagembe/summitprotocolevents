(function(){
  const page = document.body.dataset.page || '';
  const navSolid = document.body.dataset.navSolid === 'true';

  const links = [
    {href:'index.html', label:'Home', id:'home'},
    {href:'about.html', label:'About', id:'about'},
    {href:'services.html', label:'Services', id:'services'},
    {href:'gallery.html', label:'Gallery', id:'gallery'},
    {href:'contact.html', label:'Contact', id:'contact'}
  ];

  function navLink(item){
    const active = page === item.id ? ' class="active"' : '';
    return '<a' + active + ' href="' + item.href + '">' + item.label + '</a>';
  }

  const brandName = 'Summit Protocol Events';
  const brandTag = 'Kampala, Uganda';
  const logoSrc = 'img2/logo.webp';
  const waMessage = encodeURIComponent('Hello Summit Protocol Events, I would like to book protocol services for my event.');

  const navHTML =
    '<nav class="nav ' + (navSolid ? 'nav--scrolled' : 'nav--transparent') + '" id="mainNav"' + (navSolid ? ' data-solid="true"' : '') + '>' +
      '<a href="index.html" class="nav__brand">' +
        '<span class="nav__logo-wrap"><img class="nav__logo nav__logo--brand" src="' + logoSrc + '" width="44" height="44" alt=""></span>' +
        '<span class="nav__brand-text"><span class="nav__name">' + brandName + '</span><span class="nav__tag">' + brandTag + '</span></span>' +
      '</a>' +
      '<ul class="nav__links">' + links.map(l => '<li><a' + (page === l.id ? ' class="active"' : '') + ' href="' + l.href + '">' + l.label + '</a></li>').join('') + '</ul>' +
      '<a class="nav__cta' + (page === 'booking' ? ' active' : '') + '" href="booking.html">Book Now</a>' +
      '<button class="hamburger" id="hamburgerBtn" type="button" aria-label="Open menu" aria-expanded="false"><span></span><span></span><span></span></button>' +
    '</nav>' +
    '<div class="mobile-menu" id="mobileMenu" aria-hidden="true">' +
      '<div class="mobile-menu__head">' +
        '<button class="mobile-menu__close" id="mobileMenuClose" type="button" aria-label="Close menu"><span aria-hidden="true">&times;</span></button>' +
      '</div>' +
      '<div class="mobile-menu__links">' +
        links.map(navLink).join('') +
        '<a href="booking.html" class="mobile-menu__cta">Book Now</a>' +
      '</div>' +
    '</div>';

  const socialSVG = {
    instagram:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm10 2H7a3 3 0 00-3 3v10a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3zm-5 3.5A5.5 5.5 0 1111.5 18 5.5 5.5 0 0112 7.5zm0 2A3.5 3.5 0 1015.5 13 3.5 3.5 0 0012 9.5zM17.8 6.2a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"/></svg>',
    facebook:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 22v-8h3l.5-4H13V8.5c0-1.2.3-2 2-2h2V3h-3c-2.7 0-4.5 1.6-4.5 4.6V10H7v4h2.5v8H13z"/></svg>',
    linkedin:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 3a2 2 0 110 4 2 2 0 010-4zM3 8h3v13H3V8zm7 0h2.8v1.8h.1c.4-.7 1.4-1.8 3-1.8 3.2 0 3.8 2.1 3.8 4.8V21h-3v-6c0-1.4 0-3.2-2-3.2s-2.3 1.5-2.3 3.1V21h-3V8z"/></svg>'
  };

  const footerHTML =
    '<footer class="footer">' +
      '<div class="footer__grid">' +
        '<div><div class="footer__brand-row"><img class="footer__logo footer__logo--brand" src="' + logoSrc + '" width="160" height="64" alt="' + brandName + '"><div><div class="footer__name">' + brandName + '</div><div class="footer__tag">' + brandTag + '</div></div></div><p>Executive ushering, protocol management, VIP guest handling and wedding support for events in Kampala, Uganda and East Africa.</p></div>' +
        '<div><h3>Services</h3><ul><li><a href="services.html">Executive Ushering</a></li><li><a href="services.html">Protocol Management</a></li><li><a href="services.html">VIP Guest Handling</a></li><li><a href="services.html">Wedding Ushers</a></li></ul></div>' +
        '<div><h3>Company</h3><ul><li><a href="about.html">About</a></li><li><a href="gallery.html">Gallery</a></li><li><a href="booking.html">Booking</a></li><li><a href="contact.html">Contact</a></li></ul></div>' +
        '<div><h3>Contact</h3><p>Email: <a href="mailto:summitprotocolinfo@gmail.com">summitprotocolinfo@gmail.com</a><br>WhatsApp: <a href="https://wa.me/256780793279" target="_blank" rel="noopener">+256 780 793 279</a><br>Phone: +256 704 169 519<br>Kampala, Uganda</p></div>' +
      '</div>' +
      '<div class="footer__bottom"><span>&copy; 2026 ' + brandName + '. All rights reserved.</span>' +
        '<div class="socials socials--icons">' +
          '<a href="https://www.instagram.com/summit_protocal_services?igsh=Z3E3bzYwYW9nenll" target="_blank" rel="noopener" aria-label="Instagram">' + socialSVG.instagram + '</a>' +
          '<a href="https://www.facebook.com/summitprotocolug" target="_blank" rel="noopener" aria-label="Facebook">' + socialSVG.facebook + '</a>' +
          '<a href="https://www.linkedin.com/company/summit-protocol-uganda" target="_blank" rel="noopener" aria-label="LinkedIn">' + socialSVG.linkedin + '</a>' +
        '</div>' +
      '</div>' +
    '</footer>';

  const fabHTML =
    '<a class="fab-wa" href="https://wa.me/256780793279?text=' + waMessage + '" target="_blank" rel="noopener" aria-label="Book on WhatsApp">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>' +
    '</a>';

  const stickyHTML =
    '<div class="mobile-bar" id="mobileBar" aria-label="Quick actions">' +
      '<a class="mobile-bar__btn mobile-bar__btn--gold" href="booking.html">Get Estimate</a>' +
      '<a class="mobile-bar__btn" href="https://wa.me/256780793279?text=' + waMessage + '" target="_blank" rel="noopener">WhatsApp</a>' +
    '</div>';

  const toastHTML = '<div class="toast" id="siteToast" role="status" aria-live="polite" aria-atomic="true"></div>';

  const lightboxHTML =
    '<div class="lightbox" id="lightbox" aria-hidden="true" role="dialog" aria-modal="true" aria-label="Media viewer">' +
      '<div class="lb-inner">' +
        '<button class="lb-close" id="lbClose" type="button" aria-label="Close">&times;</button>' +
        '<button class="lb-prev" id="lbPrev" type="button" aria-label="Previous">&lsaquo;</button>' +
        '<div class="lb-media" id="lbMedia"></div>' +
        '<button class="lb-next" id="lbNext" type="button" aria-label="Next">&rsaquo;</button>' +
        '<div class="lb-caption"><div><span id="lbCat"></span><strong id="lbTitle"></strong></div><span class="lb-count" id="lbCount"></span></div>' +
      '</div>' +
    '</div>';

  function inject(id, html){
    const el = document.getElementById(id);
    if(el) el.innerHTML = html;
  }

  inject('chrome-nav', navHTML);
  inject('chrome-footer', footerHTML);
  inject('chrome-fab', fabHTML);
  inject('chrome-sticky', stickyHTML);
  inject('chrome-toast', toastHTML);
  inject('chrome-lightbox', lightboxHTML);

  const mobileMenu = document.getElementById('mobileMenu');
  if(mobileMenu && mobileMenu.parentElement !== document.body){
    document.body.appendChild(mobileMenu);
  }

  window.showToast = function(message){
    const toast = document.getElementById('siteToast');
    if(!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(window._toastTimer);
    window._toastTimer = setTimeout(function(){ toast.classList.remove('show'); }, 4200);
  };
})();
