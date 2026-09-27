document.addEventListener('DOMContentLoaded', function () {
  setTimeout(function () {
    var toggle = document.querySelector('.menu-toggle');
    var sidebar = document.querySelector('.sidebar');
    var overlay = document.querySelector('.overlay');
    var navLinks = document.querySelectorAll('.sidebar-nav a');

    var mobileQuery = window.matchMedia('(max-width: 768px)');

    function setMenuOpen(open) {
      if (!sidebar) return;
      sidebar.classList.toggle('open', open);
      if (overlay) overlay.classList.toggle('open', open);
      document.body.classList.toggle('menu-open', open);
      if (toggle) {
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        toggle.textContent = open ? '✕ Close' : '☰ Menu';
      }
    }

    function isMenuOpen() {
      return sidebar && sidebar.classList.contains('open');
    }

    // Mobile toggle
    if (toggle && sidebar) {
      toggle.addEventListener('click', function () {
        setMenuOpen(!isMenuOpen());
      });
    }
    if (overlay) {
      overlay.addEventListener('click', function () { setMenuOpen(false); });
    }
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isMenuOpen()) {
        setMenuOpen(false);
        if (toggle) toggle.focus();
      }
    });
    // Don't leave the page scroll-locked if the window grows past the mobile breakpoint
    mobileQuery.addEventListener('change', function (e) {
      if (!e.matches) setMenuOpen(false);
    });

    // Smooth scroll on nav click
    navLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href = link.getAttribute('href');
        if (href.startsWith('#')) {
          e.preventDefault();
          var target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
          // Close mobile sidebar
          if (mobileQuery.matches) setMenuOpen(false);
        }
      });
    });

    // Active nav on scroll (IntersectionObserver)
    var sections = document.querySelectorAll('.section[id]');
    var observerOpts = { root: null, rootMargin: '-20% 0px -60% 0px', threshold: 0 };

    function setActive(id) {
      var activeLink = document.querySelector('.sidebar-nav a[href="#' + id + '"]');
      if (!activeLink) return;
      navLinks.forEach(function (link) { link.classList.remove('active'); });
      activeLink.classList.add('active');
    }

    // Initial active: the section in the URL hash, else the first one.
    // The observer's first callback (async) then corrects it to what's actually on screen.
    var initialId = location.hash.slice(1);
    if (!document.querySelector('.sidebar-nav a[href="#' + initialId + '"]') && navLinks.length > 0) {
      initialId = navLinks[0].getAttribute('href').slice(1);
    }
    setActive(initialId);

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, observerOpts);

    sections.forEach(function (sec) { observer.observe(sec); });

  }, 60);
});

// Cycle through images listed in data-frames (comma-separated) every data-interval ms
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('img[data-frames]').forEach(function (img) {
    var frames = img.dataset.frames.split(',');
    var interval = parseInt(img.dataset.interval, 10) || 1500;
    var i = 0;
    frames.forEach(function (src) { new Image().src = src; });
    setInterval(function () {
      i = (i + 1) % frames.length;
      img.src = frames[i];
    }, interval);
  });
});
