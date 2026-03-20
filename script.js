/* ================================================================
   VOID Studio — script.js
   ================================================================ */

/* ─── Wait for DOM ────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

  /* ─── Marquee ─────────────────────────────────────────────── */
  const TECH_ITEMS = [
    'React','Next.js','TypeScript','Node.js','Tailwind CSS',
    'Supabase','Figma','Webflow','Three.js','PostgreSQL','GraphQL','AWS'
  ];

  const track = document.getElementById('marquee-track');
  if (track) {
    const buildSet = () => TECH_ITEMS.map(label =>
      `<span class="marquee-item">${label}<span class="marquee-dot">·</span></span>`
    ).join('');
    // Duplicate for seamless infinite loop
    track.innerHTML = buildSet() + buildSet();
  }

  /* ─── Custom Cursor ───────────────────────────────────────── */
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');

  // Only run cursor on devices that support hover
  const hasHover = window.matchMedia('(hover: hover)').matches;
  if (dot && ring && hasHover) {
    let mx = window.innerWidth  / 2;
    let my = window.innerHeight / 2;
    let rx = mx, ry = my;
    const LERP = 0.13;

    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
    });

    // Cursor leaves / enters window
    document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });

    const animateCursor = () => {
      rx += (mx - rx) * LERP;
      ry += (my - ry) * LERP;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(animateCursor);
    };
    animateCursor();

    // Hover state for interactive elements
    const hoverTargets = document.querySelectorAll(
      'a, button, .work-card, .service-card, .process-item, [data-cursor]'
    );
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
    });
  } else {
    // Remove cursor elements from layout on touch devices
    if (dot)  dot.style.display  = 'none';
    if (ring) ring.style.display = 'none';
  }

  /* ─── Scroll Reveal ───────────────────────────────────────── */
  const reveals = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.10, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(el => revealObs.observe(el));
  } else {
    // Fallback — show everything immediately
    reveals.forEach(el => el.classList.add('visible'));
  }

  /* ─── Smooth Anchor Scroll ────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        // Account for fixed nav height
        const navH = document.querySelector('nav')?.offsetHeight || 68;
        const top  = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top, behavior: 'smooth' });
        // Close mobile menu if open
        closeMobileMenu();
      }
    });
  });

  /* ─── Nav shadow on scroll ────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const updateNavShadow = () => {
      navbar.style.boxShadow = window.scrollY > 30
        ? '0 4px 40px rgba(0,0,0,0.45)'
        : 'none';
    };
    window.addEventListener('scroll', updateNavShadow, { passive: true });
    updateNavShadow();
  }

  /* ─── Mobile hamburger menu ───────────────────────────────── */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  const openMobileMenu  = () => {
    hamburger?.classList.add('open');
    hamburger?.setAttribute('aria-expanded', 'true');
    mobileMenu?.classList.add('open');
    mobileMenu?.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';
  };

  const closeMobileMenu = () => {
    hamburger?.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
    mobileMenu?.classList.remove('open');
    mobileMenu?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  hamburger?.addEventListener('click', () => {
    hamburger.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
  });

  // Close menu when resizing to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeMobileMenu();
  }, { passive: true });

  /* ─── Active nav link highlight on scroll ─────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  const highlightNav = () => {
    const scrollMid = window.scrollY + window.innerHeight / 3;
    sections.forEach(sec => {
      if (scrollMid >= sec.offsetTop && scrollMid < sec.offsetTop + sec.offsetHeight) {
        navAnchors.forEach(a => {
          a.style.color = a.getAttribute('href') === '#' + sec.id
            ? 'var(--text)'
            : '';
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });

}); // end DOMContentLoaded
