document.addEventListener("DOMContentLoaded", () => {
  /* ========================= 
SMOOTH SCROLL 
========================= */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const target = this.getAttribute("href");
      if (!target || target === "#") return;
      const element = document.querySelector(target);
      if (!element) return;
      e.preventDefault();
      element.scrollIntoView({ behavior: "smooth" });
    });
  });
  /* ========================= 
NAV ACTIVE SECTION 
========================= */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  const hero = document.querySelector(".hero");
  let isScrolling = false;

  function updateOnScroll() {
    const scrollY = window.scrollY;
    if (hero) {
      hero.style.transform = `translateY(${scrollY * 0.15}px)`;
    }
    sections.forEach((sec) => {
      const top = sec.offsetTop - 120;
      const height = sec.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.dataset.section === sec.id);
        });
      }
    });
    isScrolling = false;
  }

  window.addEventListener("scroll", () => {
    if (!isScrolling) {
      window.requestAnimationFrame(updateOnScroll);
      isScrolling = true;
    }
  });

  /* ========================= 
SKILLS ANIMATION 
========================= */
  const skills = document.querySelectorAll(".skill-item");
  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          let level = entry.target.dataset.level;
          entry.target.innerHTML = `
<h4>${entry.target.dataset.skill}</h4>
<div class="skill-bar">
  <div class="skill-fill" style="width:${level}%"></div>
</div>
`;
          skillObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 },
  );
  skills.forEach((skill) => skillObserver.observe(skill));

  function closePortfolioModal() {
    modal.classList.remove("active");
    modal.setAttribute("hidden", "");
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
      document.getElementById("modal-next")?.click();
    }
    if (e.key === "ArrowLeft") {
      document.getElementById("modal-prev")?.click();
    }
    if (e.key === "Escape") {
      closePortfolioModal();
    }
  });

  /* ========================= 
PORTFOLIO DATA 
========================= */
  let portfolioData = {};
  const modal = document.getElementById("portfolio-modal");
  const modalImg = document.getElementById("modal-current-img");
  const thumbs = document.getElementById("modal-thumbnails");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const portfolioCards = document.querySelectorAll(".portfolio-category");
  const closeModalButton = document.querySelector(".close-modal");
  let currentCategory = "";
  let currentIndex = 0;

  function filterPortfolio(category) {
    portfolioCards.forEach((card) => {
      card.classList.toggle(
        "hidden",
        category !== "all" && card.dataset.category !== category,
      );
    });
    filterButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.category === category);
    });
  }

  function initPortfolio() {
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        filterPortfolio(button.dataset.category);
      });
    });

    portfolioCards.forEach((item) => {
      item.addEventListener("click", () => {
        currentCategory = item.dataset.category;
        if (!portfolioData[currentCategory]) return;
        currentIndex = 0;
        modal.removeAttribute("hidden");
        modal.classList.add("active");
        closeModalButton?.focus();
        updateGallery();
      });
    });

    const defaultFilter =
      document.querySelector(".filter-btn.active")?.dataset.category ||
      "branding";
    filterPortfolio(defaultFilter);
  }

  fetch("portfolio.json")
    .then((res) => res.json())
    .then((data) => {
      portfolioData = data;
      initPortfolio();
    })
    .catch((err) => console.error("Portfolio JSON load failed:", err));

  /* ========================= 
UPDATE GALLERY 
========================= */
  function updateGallery() {
    const category = portfolioData[currentCategory];
    if (!Array.isArray(category) || !category.length) return;
    modalImg.src = category[currentIndex].image;
    modalImg.alt = category[currentIndex].title || "Portfolio image";
    thumbs.innerHTML = "";
    category.forEach((item, i) => {
      const t = document.createElement("img");
      t.src = item.image;
      if (i === currentIndex) {
        t.classList.add("active-thumb");
      }
      t.onclick = () => {
        currentIndex = i;
        updateGallery();
      };
      thumbs.appendChild(t);
    });
  }
  /* ========================= 
MODAL NAV 
========================= */
  document.getElementById("modal-prev").onclick = () => {
    const arr = portfolioData[currentCategory] || [];
    if (!arr.length) return;
    currentIndex = (currentIndex - 1 + arr.length) % arr.length;
    updateGallery();
  };
  document.getElementById("modal-next").onclick = () => {
    const arr = portfolioData[currentCategory] || [];
    if (!arr.length) return;
    currentIndex = (currentIndex + 1) % arr.length;
    updateGallery();
  };
  /* ========================= 
CLOSE MODAL 
========================= */
  closeModalButton?.addEventListener("click", closePortfolioModal);
  modal?.addEventListener("click", (e) => {
    if (e.target === modal) {
      closePortfolioModal();
    }
  });
  /* ========================= 
IMAGE ZOOM 
========================= */
  modalImg.addEventListener("click", () => {
    modalImg.classList.toggle("zoomed");
  });
  /* ========================= 
3D TILT 
========================= */
  document.querySelectorAll(".portfolio-category").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = -(y - rect.height / 2) / 10;
      const rotateY = (x - rect.width / 2) / 10;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "none";
    });
  });
  /* ========================= 
TESTIMONIAL CAROUSEL 
========================= */
  const carouselContainer = document.querySelector(".carousel-container");
  const carouselTrack = document.getElementById("carousel-track");
  const carouselDots = document.getElementById("carousel-dots");
  const carouselPrev = document.querySelector(".carousel-prev");
  const carouselNext = document.querySelector(".carousel-next");
  const carouselSlides = carouselTrack
    ? carouselTrack.querySelectorAll(".testimonial-card")
    : [];
  let currentSlide = 0;
  let autoplayTimer = null;
  let isAutoplayPaused = false;
  let touchStartX = 0;

  function updateCarousel() {
    if (!carouselTrack || !carouselSlides.length) return;
    carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    carouselDots?.querySelectorAll(".dot").forEach((dot, index) => {
      dot.classList.toggle("active", index === currentSlide);
    });
  }

  function buildCarouselDots() {
    if (!carouselDots || !carouselSlides.length) return;
    carouselDots.innerHTML = "";
    carouselSlides.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "dot";
      dot.setAttribute("aria-label", `Go to testimonial ${index + 1}`);
      if (index === 0) dot.classList.add("active");
      dot.addEventListener("click", () => {
        currentSlide = index;
        updateCarousel();
        restartAutoplay();
      });
      carouselDots.appendChild(dot);
    });
  }

  function goToNextSlide() {
    if (!carouselSlides.length) return;
    currentSlide = (currentSlide + 1) % carouselSlides.length;
    updateCarousel();
  }

  function goToPrevSlide() {
    if (!carouselSlides.length) return;
    currentSlide =
      (currentSlide - 1 + carouselSlides.length) % carouselSlides.length;
    updateCarousel();
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = window.setInterval(() => {
      if (!isAutoplayPaused) {
        goToNextSlide();
      }
    }, 5000);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      window.clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function pauseAutoplay() {
    isAutoplayPaused = true;
  }

  function resumeAutoplay() {
    isAutoplayPaused = false;
  }

  function restartAutoplay() {
    pauseAutoplay();
    startAutoplay();
  }

  carouselPrev?.addEventListener("click", () => {
    goToPrevSlide();
    restartAutoplay();
  });

  carouselNext?.addEventListener("click", () => {
    goToNextSlide();
    restartAutoplay();
  });

  carouselContainer?.addEventListener("mouseenter", pauseAutoplay);
  carouselContainer?.addEventListener("mouseleave", resumeAutoplay);
  carouselContainer?.addEventListener("focusin", pauseAutoplay);
  carouselContainer?.addEventListener("focusout", resumeAutoplay);

  carouselContainer?.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.touches[0].clientX;
      pauseAutoplay();
    },
    { passive: true },
  );

  carouselContainer?.addEventListener(
    "touchend",
    (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const delta = touchEndX - touchStartX;
      if (Math.abs(delta) > 40) {
        if (delta < 0) {
          goToNextSlide();
        } else {
          goToPrevSlide();
        }
      }
      resumeAutoplay();
    },
    { passive: true },
  );

  buildCarouselDots();
  updateCarousel();
  startAutoplay();

  /* ========================= 
CONTACT FORM 
========================= */
  const contactForm = document.getElementById("contactForm");
  const formFeedback = document.getElementById("form-feedback");

  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!contactForm.action || contactForm.action.includes("yourFormId")) {
        formFeedback.textContent =
          "Please replace the Formspree form ID in the form action.";
        formFeedback.className = "form-feedback error";
        return;
      }

      const formData = new FormData(contactForm);
      try {
        const response = await fetch(contactForm.action, {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body: formData,
        });

        if (response.ok) {
          formFeedback.textContent =
            "Thanks! Your message has been sent successfully.";
          formFeedback.className = "form-feedback success";
          contactForm.reset();
        } else {
          const data = await response.json();
          formFeedback.textContent =
            data.error ||
            "Unable to send your message. Please try again later.";
          formFeedback.className = "form-feedback error";
        }
      } catch (error) {
        formFeedback.textContent =
          "Network error. Please check your connection and try again.";
        formFeedback.className = "form-feedback error";
      }
    });
  }

  /* ========================= 
PARALLAX HERO 
========================= */
  // Scroll behavior is handled via requestAnimationFrame above.
});
