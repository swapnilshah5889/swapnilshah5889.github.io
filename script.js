// Year
document.getElementById("year").textContent = new Date().getFullYear();

// Randomize each stat card's rotating border so they never look in sync
document.querySelectorAll(".stat-card").forEach((card) => {
  const duration = 3.5 + Math.random() * 3;
  card.style.setProperty("--border-duration", `${duration.toFixed(1)}s`);
  card.style.setProperty("--border-delay", `-${(Math.random() * duration).toFixed(1)}s`);
});

// Randomize each skill card's background glow so they never look in sync
const GLOW_COLORS = [
  "rgba(124, 92, 255, 0.16)",
  "rgba(34, 211, 238, 0.16)",
  "rgba(244, 114, 182, 0.13)",
];
document.querySelectorAll(".skill-card").forEach((card) => {
  const duration = 18 + Math.random() * 16;
  card.style.setProperty("--glow-duration", `${duration.toFixed(1)}s`);
  card.style.setProperty("--glow-delay", `-${(Math.random() * duration).toFixed(1)}s`);
  card.style.setProperty("--glow-color", GLOW_COLORS[Math.floor(Math.random() * GLOW_COLORS.length)]);
});

// Cursor glow (desktop only, follows via CSS vars)
const glow = document.getElementById("cursorGlow");
if (window.matchMedia("(pointer: fine)").matches) {
  window.addEventListener("mousemove", (e) => {
    document.documentElement.style.setProperty("--x", `${e.clientX}px`);
    document.documentElement.style.setProperty("--y", `${e.clientY}px`);
  });
} else if (glow) {
  glow.style.display = "none";
}

if (window.matchMedia("(pointer: fine)").matches) {
  // Spotlight hover glow that follows the cursor within each card
  document.querySelectorAll(".stat-card, .skill-card, .timeline-card, .edu-card").forEach((el) => {
    el.classList.add("spotlight");
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      el.style.setProperty("--my", `${e.clientY - rect.top}px`);
    });
  });

  // Subtle 3D tilt on the stat cards
  document.querySelectorAll(".stat-card").forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rotateY = (px - 0.5) * 14;
      const rotateX = (0.5 - py) * 14;
      el.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });
    el.addEventListener("mouseleave", () => {
      el.style.transform = "";
    });
  });
}

// Nav scroll state + mobile toggle
const nav = document.getElementById("nav");
window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 20);
});

const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
navToggle.addEventListener("click", () => {
  navToggle.classList.toggle("open");
  navLinks.classList.toggle("open");
});
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navToggle.classList.remove("open");
    navLinks.classList.remove("open");
  });
});

// Typed role effect
const roles = [
  "Senior Software Engineer",
  "Backend & Platform Architect",
  "AI Document Pipeline Builder",
  "Svelte 5 & React Frontend Engineer",
];
const typedEl = document.getElementById("typedRole");
let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
  const current = roles[roleIndex];
  if (!deleting) {
    charIndex++;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1400);
      return;
    }
  } else {
    charIndex--;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }
  setTimeout(typeLoop, deleting ? 35 : 65);
}
typeLoop();

// Scroll reveal
const revealEls = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
revealEls.forEach((el) => revealObserver.observe(el));

// Animated stat counters
const statEls = document.querySelectorAll(".stat-number");
const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const prefix = el.dataset.prefix || "";
      const suffix = el.dataset.suffix || "";
      const duration = 1400;
      const start = performance.now();

      function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = prefix + Math.round(target * eased) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      statObserver.unobserve(el);
    });
  },
  { threshold: 0.4 }
);
statEls.forEach((el) => statObserver.observe(el));
