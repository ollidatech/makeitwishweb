// Reveal-on-scroll using IntersectionObserver with a simple fallback.
document.addEventListener('DOMContentLoaded', () => {
  const revealItems = document.querySelectorAll('.reveal-on-scroll');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries, io) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { root: null, threshold: 0.15 }
    );

    revealItems.forEach((item) => observer.observe(item));
  } else {
    // Fallback: immediately show all if IO is unavailable.
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  // Privacy policy modal
  const policyModal = document.querySelector('.policy-modal');
  const policyTriggers = document.querySelectorAll('.policy-trigger');
  const policyClose = document.querySelector('.policy-modal__close');
  const policyBackdrop = policyModal ? policyModal.querySelector('.policy-modal__backdrop') : null;

  const openPolicy = (e) => {
    if (e) e.preventDefault();
    if (!policyModal) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      policyModal.classList.add('is-open');
      document.body.classList.add('modal-open');
      document.body.style.overflow = 'hidden';
    }, 300);
  };

  const closePolicy = () => {
    if (!policyModal) return;
    policyModal.classList.remove('is-open');
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
  };

  policyTriggers.forEach((trigger) => trigger.addEventListener('click', openPolicy));
  if (policyClose) policyClose.addEventListener('click', closePolicy);
  if (policyBackdrop) policyBackdrop.addEventListener('click', closePolicy);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && policyModal && policyModal.classList.contains('is-open')) {
      closePolicy();
    }
  });

  // Terms modal
  const termsLink = document.querySelector('[data-open-terms]');
  const termsModal = document.querySelector('.terms-modal');
  const termsClose = document.querySelector('.terms-modal__close');
  const termsBackdrop = termsModal ? termsModal.querySelector('.terms-modal__backdrop') : null;

  const openTermsModal = (e) => {
    if (e) e.preventDefault();
    if (!termsModal) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      termsModal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }, 300);
  };

  const closeTermsModal = () => {
    if (!termsModal) return;
    termsModal.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  if (termsLink && termsModal) {
    termsLink.addEventListener('click', openTermsModal);
  }

  [termsClose, termsBackdrop].forEach((el) => {
    if (el) el.addEventListener('click', closeTermsModal);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && termsModal && termsModal.classList.contains('is-open')) {
      closeTermsModal();
    }
  });

  // 3D tilt on cards (desktop pointers only)
  const prefersFinePointer = window.matchMedia('(pointer: fine)').matches;
  if (prefersFinePointer) {
    const tiltSelectors = [
      '.fragrance-card',
      '.testimonial-card',
      '.value-prop-item',
      '.contact-item',
    ];

    const maxTilt = 12; // degrees
    const perspective = 900;

    const applyTilt = (card) => {
      card.style.transformStyle = 'preserve-3d';
      card.style.transition = card.style.transition || 'transform 180ms ease-out, box-shadow 180ms ease-out';

      const handleMove = (event) => {
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const percentX = (event.clientX - centerX) / (rect.width / 2);
        const percentY = (event.clientY - centerY) / (rect.height / 2);

        const rotateY = -percentX * maxTilt;
        const rotateX = percentY * maxTilt;

        card.style.transform = `perspective(${perspective}px) translateY(-6px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        card.style.boxShadow = '0 26px 60px rgba(15, 23, 42, 0.2)';
      };

      const reset = () => {
        card.style.transform = 'translateY(0) rotateX(0deg) rotateY(0deg)';
        card.style.boxShadow = '';
      };

      card.addEventListener('mousemove', handleMove);
      card.addEventListener('mouseleave', reset);
    };

    tiltSelectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach(applyTilt);
    });
  }
});
