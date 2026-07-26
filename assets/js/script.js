document.addEventListener('DOMContentLoaded', () => {
  // Initialize standard features
  initTheme();
  initMobileMenu();
  initScrollReveal();
  initActiveNav();
  initDestinationModals();
  initContactForm();
});

/* ==========================================
   THEME TOGGLER (LIGHT / DARK MODE)
   ========================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const metaColorScheme = document.querySelector('meta[name="color-scheme"]');
  
  if (!themeToggleBtn) return;

  // Retrieve stored theme, otherwise check system preference
  const savedTheme = localStorage.getItem('color-scheme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  let currentTheme = 'system';
  if (savedTheme === 'dark' || (savedTheme === null && systemPrefersDark)) {
    currentTheme = 'dark';
    applyTheme('dark');
  } else if (savedTheme === 'light') {
    currentTheme = 'light';
    applyTheme('light');
  } else {
    applyTheme('system');
  }

  // Handle manual toggle click
  themeToggleBtn.addEventListener('click', () => {
    let nextTheme = 'light';
    
    // Toggle state
    if (document.documentElement.classList.contains('dark')) {
      nextTheme = 'light';
    } else if (document.documentElement.classList.contains('light')) {
      nextTheme = 'dark';
    } else {
      // If currently system default, pick the opposite of system preference
      nextTheme = systemPrefersDark ? 'light' : 'dark';
    }
    
    applyTheme(nextTheme);
    localStorage.setItem('color-scheme', nextTheme);
  });

  // Listen to system changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    // Only apply if the user hasn't pinned a preference
    if (localStorage.getItem('color-scheme') === null || localStorage.getItem('color-scheme') === 'system') {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  function applyTheme(theme) {
    const isDark = theme === 'dark';
    
    document.documentElement.classList.remove('light', 'dark');
    
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      if (metaColorScheme) metaColorScheme.content = 'dark';
      updateToggleIcon(true);
    } else if (theme === 'light') {
      document.documentElement.classList.add('light');
      if (metaColorScheme) metaColorScheme.content = 'light';
      updateToggleIcon(false);
    } else {
      // System default
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.add(prefersDark ? 'dark' : 'light');
      if (metaColorScheme) metaColorScheme.content = 'light dark';
      updateToggleIcon(prefersDark);
    }
  }

  function updateToggleIcon(isDark) {
    // We toggle between SVG path sets
    const sunIcon = `<path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.01c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>`;
    const moonIcon = `<path d="M12.3 22h-.1c-5.5 0-10-4.5-10-10 0-4.7 3.3-8.7 7.9-9.7.6-.1 1.1.4 1 .9-.5 2 .1 4.3 1.6 5.8 1.5 1.5 3.8 2.1 5.8 1.6.5-.1 1 .4.9 1-.9 4.6-4.9 7.9-9.6 7.9-1.5 0-3-.3-4.5-1-.5-.2-.7.3-.4.7 1.8 2.2 4.6 3.8 7.8 3.8 5.5 0 10-4.5 10-10 0-.6-.5-1-1.1-.9-3 .5-6-.4-8.1-2.5-2.1-2.1-3-5.1-2.5-8.1.1-.6-.3-1.1-.9-1C6.2 3.6 2 8.3 2 14c0 6.6 5.4 12 12 12 4.7 0 8.8-2.7 10.7-6.8.2-.5-.2-1-.7-.8-1.5.7-3.1 1.1-4.7 1.1z"/>`;
    
    themeToggleBtn.innerHTML = `<svg viewBox="0 0 24 24">${isDark ? sunIcon : moonIcon}</svg>`;
    themeToggleBtn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  }
}

/* ==========================================
   MOBILE MENU DRAWER
   ========================================== */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const drawer = document.getElementById('mobile-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  const closeLinks = document.querySelectorAll('.mobile-nav-link');

  if (!hamburger || !drawer || !backdrop) return;

  function openMenu() {
    hamburger.classList.add('open');
    drawer.classList.add('open');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock background scroll
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    drawer.classList.remove('open');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    hamburger.classList.contains('open') ? closeMenu() : openMenu();
  });

  backdrop.addEventListener('click', closeMenu);
  
  // Close menu when a link inside is clicked
  closeLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Handle escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeMenu();
    }
  });
}

/* ==========================================
   SCROLL REVEAL ANIMATIONS
   ========================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  
  if (revealElements.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Stop observing once it's revealed
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px' // Triggers slightly before element enters viewport
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================
   ACTIVE NAVIGATION HIGHLIGHT
   ========================================== */
function initActiveNav() {
  const path = window.location.pathname;
  const page = path.split('/').pop() || 'index.html';
  
  // Desktop links
  const desktopLinks = document.querySelectorAll('.nav-link');
  desktopLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (page === 'index.html' && href === './') || (href === 'index.html' && page === '')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Mobile links
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  mobileLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (page === 'index.html' && href === './') || (href === 'index.html' && page === '')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* ==========================================
   DESTINATION DETAILS DYNAMIC MODAL
   ========================================== */
function initDestinationModals() {
  const modal = document.getElementById('dest-modal');
  if (!modal) return;

  const modalClose = modal.querySelector('.modal-close');
  const modalBackdrop = modal.querySelector('.modal-backdrop');
  const learnMoreBtns = document.querySelectorAll('.learn-more-btn');

  // Destination specific detailed database
  const destData = {
    santorini: {
      title: 'Santorini, Greece',
      location: 'Aegean Sea, Greece',
      image: 'assets/images/santorini.png',
      desc: 'Santorini is one of the Cyclades islands in the Aegean Sea. It was devastated by a volcanic eruption in the 16th century BC, forever shaping its rugged landscape. The giant central lagoon, or caldera, is surrounded by steep cliffs capped by white washed houses.',
      extra: 'Stunning sunsets, iconic blue domes, volcanic beaches, and ancient archeological sites make Santorini a dream escape. Rent a scooter to explore the red sands of Akrotiri, taste crisp white Assyrtiko wines at cliffside estates, or walk the scenic caldera trail from Fira to Oia.',
      days: '3-5 Days',
      budget: 'Premium',
      season: 'Jun - Sep'
    },
    kyoto: {
      title: 'Kyoto, Japan',
      location: 'Kansai Region, Japan',
      image: 'assets/images/kyoto.png',
      desc: 'Kyoto, once the capital of Japan, is a city on the island of Honshu. It is famous for its numerous classical Buddhist temples, gardens, imperial palaces, Shinto shrines and traditional wooden houses.',
      extra: 'Walk through the towering stalks of the Arashiyama Bamboo Grove, explore the thousands of vermilion torii gates at Fushimi Inari-taisha, and catch a glimpse of geishas strolling through the historic Gion district. Spring cherry blossoms and autumn maples turn the city into a canvas of color.',
      days: '4-6 Days',
      budget: 'Medium',
      season: 'Apr - May, Oct - Nov'
    },
    machu_picchu: {
      title: 'Machu Picchu, Peru',
      location: 'Andes Mountains, Peru',
      image: 'assets/images/machu_picchu.png',
      desc: 'Machu Picchu is an Incan citadel set high in the Andes Mountains in Peru, above the Urubamba River valley. Built in the 15th century and later abandoned, it’s renowned for its sophisticated dry-stone walls that fuse huge blocks without the use of mortar.',
      extra: 'Embark on the multi-day classic Inca Trail or take the panoramic Vistadome train through the Sacred Valley. Discover the Temple of the Sun, the Intihuatana stone, and climb Huayna Picchu for a sweeping bird\'s-eye view of the mysterious citadel enveloped by cloud forests.',
      days: '2-4 Days',
      budget: 'Medium-High',
      season: 'May - Sep'
    },
    swiss_alps: {
      title: 'Swiss Alps, Switzerland',
      location: 'Central Europe, Switzerland',
      image: 'assets/images/swiss_alps.png',
      desc: 'The Swiss Alps form a spectacular portion of the Alps mountain range, spanning peaks like the Matterhorn and Jungfrau. It is an expansive playground for winter snow sports and summer hiking.',
      extra: 'Explore car-free mountain towns like Zermatt, ride the scenic Glacier Express railway, and hike alongside turquoise glacial lakes in Grindelwald. Whether you are looking for world-class skiing or dining on creamy cheese fondue in a cozy alpine cabin, the Swiss Alps offer unparalleled alpine luxury.',
      days: '5-7 Days',
      budget: 'Premium',
      season: 'Dec - Mar, Jul - Aug'
    }
  };

  function openModal(destKey) {
    const data = destData[destKey];
    if (!data) return;

    // Populate modal fields
    modal.querySelector('.modal-img').src = data.image;
    modal.querySelector('.modal-img').alt = data.title;
    modal.querySelector('.modal-title').textContent = data.title;
    modal.querySelector('.modal-loc-text').textContent = data.location;
    modal.querySelector('.modal-desc-main').textContent = data.desc;
    modal.querySelector('.modal-desc-extra').textContent = data.extra;
    modal.querySelector('.modal-val-days').textContent = data.days;
    modal.querySelector('.modal-val-budget').textContent = data.budget;
    modal.querySelector('.modal-val-season').textContent = data.season;

    // Show modal
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  learnMoreBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const destKey = btn.getAttribute('data-dest');
      openModal(destKey);
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

  // Close modal on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/* ==========================================
   CONTACT FORM VALIDATION & HANDLING
   ========================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const alertContainer = document.getElementById('form-alert');
  
  if (!form || !alertContainer) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Reset alert
    alertContainer.className = 'form-alert';
    alertContainer.style.display = 'none';

    // Extract values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    // Custom simple email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validation checks
    if (!name || !email || !message) {
      showAlert('All fields are required. Please fill out the form entirely.', 'error');
      return;
    }

    if (!emailRegex.test(email)) {
      showAlert('Please enter a valid email address.', 'error');
      return;
    }

    // Success feedback (Simulated submit)
    showAlert(`Thank you, ${name}! Your message has been sent successfully. We will get back to you shortly.`, 'success');
    
    // Reset form fields
    form.reset();
  });

  function showAlert(msg, type) {
    alertContainer.textContent = msg;
    alertContainer.className = `form-alert ${type}`;
    alertContainer.style.display = 'block';
    
    // Scroll alert into view
    alertContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}
