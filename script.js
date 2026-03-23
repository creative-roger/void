/* ================================================================
   VOID Studio — script.js
   ================================================================ */

/* ─── Wait for DOM ────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

  /* ─── Marquee ─────────────────────────────────────────────── */
  const TECH_ITEMS = [
    'React', 'Next.js', 'TypeScript', 'Node.js', 'Tailwind CSS',
    'Supabase', 'Figma', 'Webflow', 'Three.js', 'PostgreSQL', 'GraphQL', 'AWS'
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
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');

  // Only run cursor on devices that support hover
  const hasHover = window.matchMedia('(hover: hover)').matches;
  if (dot && ring && hasHover) {
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx, ry = my;
    const LERP = 0.13;

    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top = my + 'px';
    });

    // Cursor leaves / enters window
    document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });

    const animateCursor = () => {
      rx += (mx - rx) * LERP;
      ry += (my - ry) * LERP;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
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
    if (dot) dot.style.display = 'none';
    if (ring) ring.style.display = 'none';
  }

  /* ─── Projects (Case Studies) ─────────────────────────── */
  const PROJECTS = [
    {
      title: "Private Safari's",
      category: "Tour Agency / Safari",
      desc: "Private and Custom Safaris Landing — built in 6 weeks.",
      link: "https://safariwithus.vercel.app/",
      size: "large"
    },
    {
      title: "Wild Photography",
      category: "Portfolio",
      desc: "Personal portfolio for a wildlife photographer.",
      link: "https://wildphoto.vercel.app/",
      size: "small"
    },
    {
      title: "Forma Store",
      category: "E-Commerce",
      desc: "Headless Shopify storefront for modern lifestyle.",
      link: "https://github.com/zikka/void-studio", // Placeholder link
      size: "small"
    }
  ];

  const renderProjects = () => {
    const grid = document.getElementById('work-grid');
    if (!grid) return;

    // Helper to get auto-screenshot from Microlink
    const getScreenshotUrl = (url) => {
      if (!url || url === '#') return '';
      return `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`;
    };

    // We'll group them: one large, then a column of others if they are small
    let html = '';
    let smallCardsHtml = '';

    PROJECTS.forEach((proj, idx) => {
      const isLarge = proj.size === 'large';
      const delayClass = `work-card--d${idx % 3}`;
      const imgUrl = getScreenshotUrl(proj.link);

      const cardHtml = `
        <a class="work-card ${proj.size} reveal ${delayClass}" 
           href="${proj.link}" 
           target="_blank" 
           rel="noopener noreferrer"
           aria-label="View ${proj.title} case study">
          <div class="work-thumb">
            ${imgUrl ? `<img src="${imgUrl}" alt="${proj.title}" class="work-img" loading="lazy">` : ''}
            <div class="thumb-fade"></div>
          </div>
          <div class="work-info">
            <p class="work-category">${proj.category}</p>
            <h3 class="work-title">${proj.title}</h3>
            <p class="work-desc">${proj.desc}</p>
            <span class="work-link">View Project <span class="work-arrow">→</span></span>
          </div>
        </a>
      `;

      if (isLarge) {
        html += cardHtml;
      } else {
        smallCardsHtml += cardHtml;
      }
    });

    // Wrap small cards in a column if they exist
    if (smallCardsHtml) {
      html += `<div class="work-right-col">${smallCardsHtml}</div>`;
    }

    grid.innerHTML = html;

    // Re-observe new elements for reveal animation
    if ('IntersectionObserver' in window) {
      const newReveals = grid.querySelectorAll('.reveal');
      newReveals.forEach(el => revealObs.observe(el));
    }
  };

  // Define revealObs in outer scope to reuse it
  let revealObs;

  /* ─── Scroll Reveal ───────────────────────────────────────── */
  const reveals = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    revealObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Don't unobserve if we want to re-trigger or handle dynamic content carefully
          // but usually one-time reveal is better
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.10, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(el => revealObs.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('visible'));
  }

  // Initialize projects
  renderProjects();

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
        const top = target.getBoundingClientRect().top + window.scrollY - navH;
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
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  const openMobileMenu = () => {
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
