"use strict";

const hasGSAP = typeof gsap !== "undefined";
const hasST = hasGSAP && typeof ScrollTrigger !== "undefined";
if (hasST) gsap.registerPlugin(ScrollTrigger);

const $ = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];
const mob = () => window.innerWidth < 860;
const tch = () => window.matchMedia("(hover: none)").matches;
const prm = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.addEventListener("DOMContentLoaded", () => {
  initEntryScreen();
  initYear();
  initCursor();
  initNav();
  initHeroVideo();
  initClock();
  initReveal();
  initCounters();
  initFilters();
  initGallery();
  initFaq();
  initTilt();
  initMagnetic();
  initParallax();
  initBackTop();
  initForm();
  initLeadForm();
  initLogoCarousel();
  initActiveNav();
  initOfferPrefill();
  initModals();
  initLanguage();
  initPortalAccess();
});

function initEntryScreen() {
  const screen = $("#entryScreen");
  const btn = $("#entryBtn");
  if (!screen) return;

  document.body.classList.add("menu-open");

  const dismiss = () => {
    screen.classList.add("hidden");
    document.body.classList.remove("menu-open");

    const vid = $("#heroVideo");
    const soundBtn = $("#videoSoundBtn");

    if (vid) {
      vid.removeAttribute("muted");
      vid.muted = false;
      vid.volume = 1;

      vid.play()
        .then(() => {
          if (soundBtn) {
            soundBtn.classList.add("sound-on");
            soundBtn.setAttribute("aria-pressed", "true");
            soundBtn.setAttribute("aria-label", "Couper le son");
          }
        })
        .catch(err => {
          console.warn("[PitLane] Son bloqué :", err);
          vid.muted = true;
          vid.play().catch(() => {});

          if (soundBtn) {
            soundBtn.classList.remove("sound-on");
            soundBtn.setAttribute("aria-pressed", "false");
            soundBtn.setAttribute("aria-label", "Activer le son");
          }
        });
    }

    initHeroAnim();

    screen.addEventListener("transitionend", () => {
      screen.remove();
    }, { once: true });
  };

  if (btn) {
    btn.addEventListener("click", dismiss);
    btn.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        dismiss();
      }
    });
    btn.focus();
  }
}

function initHeroVideo() {
  const vid = $("#heroVideo");
  const soundBtn = $("#videoSoundBtn");
  if (!vid || !soundBtn) return;

  soundBtn.addEventListener("click", () => {
    if (!vid.muted) {
      vid.muted = true;
      vid.volume = 0;
      soundBtn.classList.remove("sound-on");
      soundBtn.setAttribute("aria-pressed", "false");
      soundBtn.setAttribute("aria-label", "Activer le son");
    } else {
      vid.removeAttribute("muted");
      vid.muted = false;
      vid.volume = 1;
      if (vid.paused) vid.play().catch(() => {});
      soundBtn.classList.add("sound-on");
      soundBtn.setAttribute("aria-pressed", "true");
      soundBtn.setAttribute("aria-label", "Couper le son");
    }
  });

  vid.addEventListener("volumechange", () => {
    if (vid.muted) {
      soundBtn.classList.remove("sound-on");
      soundBtn.setAttribute("aria-pressed", "false");
      soundBtn.setAttribute("aria-label", "Activer le son");
    } else {
      soundBtn.classList.add("sound-on");
      soundBtn.setAttribute("aria-pressed", "true");
      soundBtn.setAttribute("aria-label", "Couper le son");
    }
  });
}

function initHeroAnim() {
  if (!hasGSAP || prm()) return;

  const eyebrow = $(".hero-eyebrow");
  const lines = $$(".h1-line");
  const desc = $(".hero-desc");
  const btns = $(".hero-btns");
  const tags = $(".hero-tags");

  const els = [eyebrow, ...lines, desc, btns, tags].filter(Boolean);
  if (!els.length) return;

  gsap.set(els, { opacity: 0, y: 40 });

  gsap.timeline({ defaults: { ease: "power3.out" } })
    .to(eyebrow, { opacity: 1, y: 0, duration: .7 }, "+=0.1")
    .to(lines, { opacity: 1, y: 0, duration: .9, stagger: .1 }, "-=0.4")
    .to(desc, { opacity: 1, y: 0, duration: .7 }, "-=0.5")
    .to(btns, { opacity: 1, y: 0, duration: .6 }, "-=0.4")
    .to(tags, { opacity: 1, y: 0, duration: .5 }, "-=0.3");
}

function initYear() {
  const el = $("#year");
  if (el) el.textContent = new Date().getFullYear();
}

function initCursor() {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  const dot = $("#cursorDot");
  const ring = $("#cursorRing");
  if (!dot || !ring) return;

  let mx = 0;
  let my = 0;
  let rx = 0;
  let ry = 0;

  document.addEventListener("mousemove", e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = `${mx}px`;
    dot.style.top = `${my}px`;
  }, { passive: true });

  const loop = () => {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = `${rx}px`;
    ring.style.top = `${ry}px`;
    requestAnimationFrame(loop);
  };
  loop();

  const hoverSel = "a, button, .tilt-card, .svc-card, .partner-card, .team-card, .blog-card, .gallery-item, .logo-item, input, textarea, select";
  document.addEventListener("mouseover", e => {
    if (e.target.closest(hoverSel)) ring.classList.add("hover");
  });
  document.addEventListener("mouseout", e => {
    if (e.target.closest(hoverSel)) ring.classList.remove("hover");
  });
}

function initNav() {
  const navbar = $("#navbar");
  const burger = $("#navBurger");
  const links = $("#navLinks");

  const onScroll = () => navbar?.classList.toggle("scrolled", window.scrollY > 60);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (!burger || !links) return;

  const openMenu = () => {
    links.classList.add("open");
    burger.classList.add("open");
    burger.setAttribute("aria-expanded", "true");
    burger.setAttribute("aria-label", "Fermer le menu");
    document.body.classList.add("menu-open");
  };

  const closeMenu = () => {
    links.classList.remove("open");
    burger.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Ouvrir le menu");
    document.body.classList.remove("menu-open");
  };

  burger.addEventListener("click", () => links.classList.contains("open") ? closeMenu() : openMenu());
  links.querySelectorAll("a").forEach(a => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && links.classList.contains("open")) closeMenu();
  });
  document.addEventListener("click", e => {
    if (links.classList.contains("open") && !navbar.contains(e.target)) closeMenu();
  });
}

function initClock() {
  const el = $("#heroTime");
  if (!el) return;

  const tick = () => {
    const n = new Date();
    el.textContent = [n.getHours(), n.getMinutes(), n.getSeconds()]
      .map(v => String(v).padStart(2, "0"))
      .join(":");
  };

  tick();
  setInterval(tick, 1000);
}

function initReveal() {
  const els = $$("[data-reveal]");
  if (!els.length) return;

  if (!("IntersectionObserver" in window)) {
    els.forEach(el => el.classList.add("visible"));
    return;
  }

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = parseFloat(el.dataset.revealDelay || 0);

      setTimeout(() => {
        if (hasGSAP && !prm()) {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: .90,
            ease: "power3.out",
            onStart: () => el.classList.add("visible")
          });
        } else {
          el.classList.add("visible");
        }
      }, delay * 1000);

      obs.unobserve(el);
    });
  }, { threshold: .13, rootMargin: "0px 0px -40px 0px" });

  els.forEach(el => obs.observe(el));
}

function initCounters() {
  const els = $$("[data-count]");
  if (!els.length) return;

  const easeOut = t => 1 - Math.pow(1 - t, 4);

  const animNum = el => {
    const target = Number(el.dataset.count);
    if (isNaN(target)) return;

    const dur = 1500;
    const t0 = performance.now();

    const step = now => {
      const p = Math.min((now - t0) / dur, 1);
      el.textContent = Math.round(easeOut(p) * target);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };

    requestAnimationFrame(step);
  };

  const obs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      animNum(en.target);
      obs.unobserve(en.target);
    });
  }, { threshold: .65 });

  els.forEach(el => obs.observe(el));
}

function initFilters() {
  const btns = $$(".filter-btn");
  const cards = $$("[data-service]");
  if (!btns.length || !cards.length) return;

  btns.forEach(btn => {
    btn.addEventListener("click", () => {
      const f = btn.dataset.filter;

      btns.forEach(b => {
        b.classList.remove("active");
        b.removeAttribute("aria-current");
      });

      btn.classList.add("active");
      btn.setAttribute("aria-current", "true");

      cards.forEach(card => {
        const show = f === "all" || f === card.dataset.service;

        if (show) {
          card.classList.remove("is-hidden");
          if (hasGSAP && !prm()) {
            gsap.fromTo(card, { opacity: 0, y: 20 }, {
              opacity: 1,
              y: 0,
              duration: .38,
              ease: "power2.out",
              clearProps: "opacity,y"
            });
          }
        } else {
          card.classList.add("is-hidden");
        }
      });
    });
  });
}

function initGallery() {
  const filters = $$(".gallery-filter");
  const items = $$(".gallery-item");
  const lightbox = $("#lightbox");
  const lightboxImg = $("#lightboxImg");
  const close = $("#lightboxClose");

  if (filters.length && items.length) {
    filters.forEach(btn => {
      btn.addEventListener("click", () => {
        const f = btn.dataset.galleryFilter;

        filters.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        items.forEach(item => {
          const show = f === "all" || item.dataset.gallery === f;
          item.classList.toggle("is-hidden", !show);
        });
      });
    });
  }

  if (lightbox && lightboxImg) {
    items.forEach(item => {
      item.addEventListener("click", () => {
        const img = item.dataset.img;
        if (!img) return;
        lightboxImg.src = img;
        lightbox.classList.add("open");
        lightbox.setAttribute("aria-hidden", "false");
      });
    });

    close?.addEventListener("click", () => closeLightbox());
    lightbox.addEventListener("click", e => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", e => {
      if (e.key === "Escape") closeLightbox();
    });
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    if (lightboxImg) lightboxImg.src = "";
  }
}

function initFaq() {
  const items = $$(".faq-item");
  if (!items.length) return;

  items.forEach(item => {
    const btn = $(".faq-question", item);
    const answer = $(".faq-answer", item);
    if (!btn || !answer) return;

    btn.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      items.forEach(i => {
        i.classList.remove("open");
        const a = $(".faq-answer", i);
        if (a) a.style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add("open");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });
}

function initTilt() {
  const MAX = 6;

  $$(".tilt-card").forEach(card => {
    card.addEventListener("mousemove", e => {
      if (mob() || tch() || prm()) return;

      const r = card.getBoundingClientRect();
      const rx = -((e.clientY - r.top) / r.height - .5) * MAX;
      const ry = ((e.clientX - r.left) / r.width - .5) * MAX;

      if (hasGSAP) {
        gsap.to(card, {
          rotateX: rx,
          rotateY: ry,
          translateY: -5,
          perspective: 1000,
          duration: .25,
          ease: "power2.out",
          overwrite: "auto"
        });
      } else {
        card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-5px)`;
      }
    }, { passive: true });

    card.addEventListener("mouseleave", () => {
      if (hasGSAP) {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          translateY: 0,
          duration: .55,
          ease: "power3.out"
        });
      } else {
        card.style.transform = "";
      }
    });
  });
}

function initMagnetic() {
  $$(".magnetic").forEach(el => {
    el.addEventListener("mousemove", e => {
      if (mob() || tch() || prm()) return;

      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;

      if (hasGSAP) {
        gsap.to(el, {
          x: x * 14,
          y: y * 10,
          duration: .40,
          ease: "power2.out"
        });
      } else {
        el.style.transform = `translate(${x * 14}px, ${y * 10}px)`;
      }
    }, { passive: true });

    el.addEventListener("mouseleave", () => {
      if (hasGSAP) {
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: .60,
          ease: "elastic.out(1, .55)"
        });
      } else {
        el.style.transform = "";
      }
    });
  });
}

function initParallax() {
  if (!hasST || prm()) return;

  const vid = $("#heroVideo");
  if (vid) {
    gsap.to(vid, {
      yPercent: 20,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero-video-section",
        start: "top top",
        end: "bottom top",
        scrub: 1.2
      }
    });
  }

  const rPic = $(".romain-photo");
  if (rPic) {
    gsap.to(rPic, {
      yPercent: 9,
      ease: "none",
      scrollTrigger: {
        trigger: ".romain-photo-wrap",
        start: "top bottom",
        end: "bottom top",
        scrub: 1.5
      }
    });
  }

  [
    { item: ".svc-card", container: ".svc-grid" },
    { item: ".partner-card", container: ".partners-grid" },
    { item: ".pilot-card", container: ".pilots-grid" },
    { item: ".compare-card", container: ".compare-box" },
    { item: ".raid-argument-card", container: ".raid-arguments" },
    { item: ".pricing-card", container: ".pricing-grid" },
    { item: ".why-card", container: ".why-grid" },
    { item: ".team-card", container: ".team-grid" },
    { item: ".blog-card", container: ".blog-grid" },
    { item: ".gallery-item", container: ".gallery-grid" }
  ].forEach(({ item, container }) => {
    $$(container).forEach(grid => {
      const items = $$(item, grid);
      if (!items.length) return;

      gsap.from(items, {
        y: 50,
        opacity: 0,
        duration: .85,
        stagger: .07,
        ease: "power3.out",
        scrollTrigger: {
          trigger: grid,
          start: "top 82%"
        }
      });
    });
  });

  $$(".sec-title").forEach(h => {
    gsap.from(h, {
      y: 50,
      opacity: 0,
      skewY: 1.4,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: h,
        start: "top 88%"
      }
    });
  });

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 200);
  }, { passive: true });
}

function initBackTop() {
  const btn = $("#backTop");
  if (!btn) return;

  const onScroll = () => btn.classList.toggle("show", window.scrollY > 700);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

function initForm() {
  const form = $("#contactForm");
  const ok = $("#formOk");
  if (!form) return;

  form.addEventListener("submit", e => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);

    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const profile = String(formData.get("profile") || "").trim();
    const offer = String(formData.get("offer") || "").trim();
    const message = String(formData.get("message") || "").trim();

    const subject = encodeURIComponent(`Demande PitLane — ${offer || "nouveau projet"}`);
    const body = encodeURIComponent(
      `Nom : ${name}\n` +
      `Email : ${email}\n` +
      `Profil : ${profile}\n` +
      `Offre souhaitée : ${offer}\n\n` +
      `Message :\n${message}`
    );

    const submitBtn = form.querySelector("button[type='submit']");

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Ouverture de votre email…";
    }

    if (ok) ok.textContent = "Votre client mail va s'ouvrir pour envoyer votre demande.";

    window.location.href = `mailto:contact@pitlane.fr?subject=${subject}&body=${body}`;

    setTimeout(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Envoyer ma demande";
      }

      form.reset();

      if (ok) {
        ok.textContent = "✓ Demande préparée. Vous pouvez l'envoyer depuis votre boîte mail.";
        setTimeout(() => { ok.textContent = ""; }, 6000);
      }
    }, 1200);
  });
}

function initLeadForm() {
  const form = $("#leadForm");
  const ok = $("#leadOk");
  if (!form) return;

  form.addEventListener("submit", e => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const email = String(new FormData(form).get("leadEmail") || "").trim();

    if (ok) {
      ok.textContent = "✓ Demande reçue. Le guide sera envoyé à " + email;
    }

    form.reset();

    setTimeout(() => {
      closeAllModals();
      if (ok) ok.textContent = "";
    }, 1800);
  });
}

function initLogoCarousel() {
  const car = $(".logo-carousel");
  const track = $(".logo-track");
  if (!car || !track) return;

  car.addEventListener("mouseenter", () => { track.style.animationPlayState = "paused"; });
  car.addEventListener("mouseleave", () => { track.style.animationPlayState = "running"; });
  car.addEventListener("focusin", () => { track.style.animationPlayState = "paused"; });
  car.addEventListener("focusout", () => { track.style.animationPlayState = "running"; });

  if (prm()) track.style.animationPlayState = "paused";
}

function initActiveNav() {
  const links = $$(".nav-link");
  if (!links.length) return;

  const sections = links
    .map(link => {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) return null;

      const section = document.querySelector(href);
      if (!section) return null;

      return { link, section };
    })
    .filter(Boolean);

  if (!sections.length) return;

  const update = () => {
    const y = window.scrollY + 140;
    let current = sections[0];

    sections.forEach(item => {
      if (item.section.offsetTop <= y) current = item;
    });

    links.forEach(link => link.classList.remove("active"));
    current.link.classList.add("active");
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
}

function initOfferPrefill() {
  const triggers = $$("[data-offer]");
  const select = $("#contact-offer");
  if (!triggers.length || !select) return;

  triggers.forEach(trigger => {
    trigger.addEventListener("click", () => {
      const offer = trigger.dataset.offer;
      if (!offer) return;

      const exists = [...select.options].some(opt => opt.value === offer);
      if (!exists) return;

      select.value = offer;

      select.style.transition = "border-color .3s, box-shadow .3s";
      select.style.borderColor = "rgba(229,9,20,.80)";
      select.style.boxShadow = "0 0 0 4px rgba(229,9,20,.18)";

      setTimeout(() => {
        select.style.borderColor = "";
        select.style.boxShadow = "";
      }, 1400);

      select.dispatchEvent(new Event("change", { bubbles: true }));
    });
  });
}

function initModals() {
  const openLead = $("#openLeadBtn");
  const leadModal = $("#leadModal");

  const openBooking = $("#openBookingBtn");
  const bookingModal = $("#bookingModal");

  const openPortal = $("#openPortalBtn");
  const portalModal = $("#portalModal");

  openLead?.addEventListener("click", () => openModal(leadModal));
  openBooking?.addEventListener("click", () => openModal(bookingModal));
  openPortal?.addEventListener("click", () => openModal(portalModal));

  $$("[data-close-modal]").forEach(el => {
    el.addEventListener("click", () => closeAllModals());
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeAllModals();
  });
}
function openModal(modal) {
  if (!modal) return;

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("menu-open");
}

function closeAllModals() {
  $$(".modal.open").forEach(modal => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  });

  document.body.classList.remove("menu-open");
}

function initLanguage() {
  const btn = $("#langBtn");
  if (!btn) return;

  const dict = {
    fr: {
      heroEyebrow: "Communication automobile · Sponsoring · Image premium",
      heroTitle1: "La communication automobile",
      heroTitle2: "pensée pour performer.",
      heroDesc: "PitLane accompagne marques, concessions, écuries, pilotes et projets automobiles dans leur communication, leur visibilité, leur image de marque et leur recherche de partenaires.",
      heroBtn1: "Découvrir nos offres",
      heroBtn2: "Je suis pilote"
    },
    en: {
      heroEyebrow: "Automotive communication · Sponsorship · Premium image",
      heroTitle1: "Automotive communication",
      heroTitle2: "built to perform.",
      heroDesc: "PitLane supports brands, dealerships, teams, drivers and automotive projects with communication, visibility, branding and sponsorship strategy.",
      heroBtn1: "Discover our offers",
      heroBtn2: "I am a driver"
    }
  };

  let current = "fr";

  btn.addEventListener("click", () => {
    current = current === "fr" ? "en" : "fr";
    btn.textContent = current.toUpperCase();
    document.documentElement.lang = current;

    $$("[data-i18n]").forEach(el => {
      const key = el.dataset.i18n;
      if (dict[current][key]) el.textContent = dict[current][key];
    });
  });
}
/* =========================================================
   ESPACE CLIENT PRIVÉ — ACCÈS PAR CODE
   Version simple côté front
========================================================= */
function initPortalAccess() {
  const login = $("#portalLogin");
  const dashboard = $("#portalDashboard");
  const form = $("#portalLoginForm");
  const input = $("#portalCode");
  const error = $("#portalError");
  const logout = $("#portalLogout");

  if (!login || !dashboard || !form || !input) return;

  const clients = {
    "adminpitlane2025": {
      name: "PitLane Admin",
      role: "Administrateur · Vue globale",
      project: "Tous les projets clients",
      status: "Pilotage agence",
      progress: 100,
      links: [
        {
          title: "CRM Sponsors",
          desc: "Suivi global des prospects sponsors.",
          url: "#"
        },
        {
          title: "Drive PitLane",
          desc: "Documents internes, offres, contrats.",
          url: "#"
        },
        {
          title: "Reporting clients",
          desc: "Accès aux reportings mensuels.",
          url: "#"
        },
        {
          title: "Planning éditorial",
          desc: "Calendrier global des contenus.",
          url: "#"
        }
      ],
      tasks: [
        ["Starter Pack Romain", "En cours"],
        ["Prospection Nathan & Rémy", "À relancer"],
        ["Pack Raid Nathan 205", "Brief à compléter"],
        ["Reporting mensuel", "À produire"]
      ]
    },

    "romain2025": {
      name: "Romain Favre",
      role: "Pilote LMP3 · Ambassadeur PitLane",
      project: "Image pilote · Ambassadeur",
      status: "En cours",
      progress: 75,
      links: [
        {
          title: "Dossier ambassadeur",
          desc: "Document de présentation officiel.",
          url: "#"
        },
        {
          title: "Kit médias",
          desc: "Photos, bio, éléments presse.",
          url: "#"
        },
        {
          title: "Calendrier contenus",
          desc: "Planning éditorial ambassadeur.",
          url: "#"
        }
      ],
      tasks: [
        ["Bio pilote", "Validé"],
        ["Photos officielles", "En cours"],
        ["Kit média", "À finaliser"]
      ]
    },

    "nathanrallye2025": {
      name: "Nathan Nadeau & Rémy Bayet",
      role: "Équipage Rallye · Savoie",
      project: "Pack Pilote · Rallye Savoie",
      status: "Prospection active",
      progress: 60,
      links: [
        {
          title: "Dossier sponsoring",
          desc: "PDF de présentation sponsor.",
          url: "#"
        },
        {
          title: "Liste sponsors",
          desc: "Suivi des 20 entreprises ciblées.",
          url: "#"
        },
        {
          title: "Planning rallye",
          desc: "Calendrier prévisionnel saison.",
          url: "#"
        },
        {
          title: "Drive contenus",
          desc: "Photos et vidéos de l'équipage.",
          url: "#"
        }
      ],
      tasks: [
        ["Starter Pack", "En cours"],
        ["Liste 20 sponsors", "En cours"],
        ["Premier email sponsor", "À faire"],
        ["Shooting équipage", "À planifier"]
      ]
    },

    "nathan205raid2025": {
      name: "Nathan Nadeau",
      role: "205 Raid · Aventure humanitaire",
      project: "Pack Raid Humanitaire",
      status: "Préparation dossier",
      progress: 45,
      links: [
        {
          title: "Dossier solidaire",
          desc: "Dossier sponsor orienté RSE.",
          url: "#"
        },
        {
          title: "Planning contenu",
          desc: "Stratégie avant, pendant, après.",
          url: "#"
        },
        {
          title: "Liste sponsors RSE",
          desc: "Entreprises à prospecter.",
          url: "#"
        }
      ],
      tasks: [
        ["Storytelling humanitaire", "En cours"],
        ["Photos de la 205", "À recevoir"],
        ["Liste sponsors RSE", "À construire"],
        ["Guide de prise de vue", "À produire"]
      ]
    }
  };

  const savedCode = sessionStorage.getItem("pitlanePortalCode");
  if (savedCode && clients[savedCode]) {
    renderPortal(clients[savedCode]);
  }

  form.addEventListener("submit", e => {
    e.preventDefault();

    const code = input.value.trim().toLowerCase();

    if (!clients[code]) {
      if (error) error.textContent = "Code incorrect. Vérifie ton accès ou contacte PitLane.";
      input.focus();
      return;
    }

    sessionStorage.setItem("pitlanePortalCode", code);
    if (error) error.textContent = "";

    renderPortal(clients[code]);
  });

  logout?.addEventListener("click", () => {
    sessionStorage.removeItem("pitlanePortalCode");
    dashboard.hidden = true;
    login.hidden = false;
    input.value = "";
    if (error) error.textContent = "";
  });

  function renderPortal(data) {
    login.hidden = true;
    dashboard.hidden = false;

    $("#portalName").textContent = data.name;
    $("#portalRole").textContent = data.role;
    $("#portalProject").textContent = data.project;
    $("#portalStatus").textContent = data.status;
    $("#portalProgressLabel").textContent = `${data.progress}%`;
    $("#portalProgressBar").style.width = `${data.progress}%`;

    const linksWrap = $("#portalLinks");
    const tasksWrap = $("#portalTasks");

    if (linksWrap) {
      linksWrap.innerHTML = data.links.map(link => `
        <a href="${link.url}" class="portal-link-card" target="_blank" rel="noopener noreferrer">
          <strong>${link.title}</strong>
          <span>${link.desc}</span>
        </a>
      `).join("");
    }

    if (tasksWrap) {
      tasksWrap.innerHTML = data.tasks.map(([label, status]) => {
        let cls = "wait";

        if (status.toLowerCase().includes("validé")) cls = "done";
        if (status.toLowerCase().includes("cours")) cls = "progress";

        return `
          <div class="portal-task ${cls}">
            <span>${label}</span>
            <strong>${status}</strong>
          </div>
        `;
      }).join("");
    }
  }
}