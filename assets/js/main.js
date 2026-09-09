document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".mobile-menu-btn, .menu-toggle");
  const navigation = document.querySelector(".main-nav");

  const closeMenu = () => {
    if (!navigation || !menuButton) return;
    navigation.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    const icon = menuButton.querySelector("i");
    if (icon) icon.className = "bi bi-list";
  };

  if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
      const isOpen = navigation.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
      const icon = menuButton.querySelector("i");
      if (icon) icon.className = isOpen ? "bi bi-x-lg" : "bi bi-list";
    });

    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", (event) => {
      if (!navigation.classList.contains("open")) return;
      if (!navigation.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
    });
  }

  const revealElements = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("visible"));
  }

  const counters = document.querySelectorAll(".counter");
  const animateCounter = (element) => {
    const target = Number(element.dataset.target || 0);
    const suffix = element.dataset.suffix || "";
    const startTime = performance.now();
    const duration = 1500;
    const update = (currentTime) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = `${Math.floor(target * eased)}${suffix}`;
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  };

  if (counters.length && "IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.7 });
    counters.forEach((counter) => counterObserver.observe(counter));
  }

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const toTop = document.querySelector(".to-top");
  if (toTop) {
    const updateToTop = () => toTop.classList.toggle("show", window.scrollY > 500);
    window.addEventListener("scroll", updateToTop, { passive: true });
    updateToTop();
    toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  // --- 1. Toast Notification Helper ---
  let toastEl = document.querySelector(".toast-notification");
  if (!toastEl) {
    toastEl = document.createElement("div");
    toastEl.className = "toast-notification";
    toastEl.innerHTML = '<i class="bi bi-check-circle-fill text-teal-400"></i> <span class="toast-text"></span>';
    document.body.appendChild(toastEl);
  }

  const showToast = (message, duration = 3000) => {
    const toastText = toastEl.querySelector(".toast-text");
    if (toastText) toastText.textContent = message;
    toastEl.classList.add("show");
    clearTimeout(toastEl._timer);
    toastEl._timer = setTimeout(() => {
      toastEl.classList.remove("show");
    }, duration);
  };
  window.showToast = showToast;

  // --- 2. One-Click Copy to Clipboard ---
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute("data-copy");
      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);
        const originalHtml = btn.innerHTML;
        btn.classList.add("copied");
        btn.innerHTML = '<i class="bi bi-check2"></i> কপি হয়েছে!';
        showToast(`"${textToCopy}" ক্লিপবোর্ডে কপি করা হয়েছে!`);
        setTimeout(() => {
          btn.classList.remove("copied");
          btn.innerHTML = originalHtml;
        }, 2500);
      } catch (err) {
        // Fallback for older browsers
        const textarea = document.createElement("textarea");
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        showToast(`"${textToCopy}" কপি করা হয়েছে!`);
      }
    });
  });

  // --- 3. Interactive FAQ Accordion ---
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    const questionBtn = item.querySelector(".faq-question");
    const answerEl = item.querySelector(".faq-answer");
    if (!questionBtn || !answerEl) return;

    questionBtn.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      // Optional: close other open items for cleaner single-open view
      faqItems.forEach((other) => {
        if (other !== item && other.classList.contains("active")) {
          other.classList.remove("active");
          const otherAns = other.querySelector(".faq-answer");
          const otherBtn = other.querySelector(".faq-question");
          if (otherAns) otherAns.style.maxHeight = "0";
          if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
        }
      });

      if (isActive) {
        item.classList.remove("active");
        answerEl.style.maxHeight = "0";
        questionBtn.setAttribute("aria-expanded", "false");
      } else {
        item.classList.add("active");
        answerEl.style.maxHeight = `${answerEl.scrollHeight}px`;
        questionBtn.setAttribute("aria-expanded", "true");
      }
    });
  });

  // --- 4. Gallery Category Filter & Lightbox Modal ---
  const filterBtns = document.querySelectorAll(".gallery-filter-btn");
  const galleryCards = document.querySelectorAll(".gallery-card");
  const galleryModal = document.querySelector(".gallery-modal");

  if (filterBtns.length && galleryCards.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const category = btn.getAttribute("data-filter");

        galleryCards.forEach((card) => {
          const cardCat = card.getAttribute("data-category");
          if (category === "all" || cardCat === category) {
            card.style.display = "flex";
            card.style.animation = "modalPop 0.3s ease";
          } else {
            card.style.display = "none";
          }
        });
      });
    });
  }

  if (galleryModal) {
    const modalImg = galleryModal.querySelector(".gallery-modal-img");
    const modalTitle = galleryModal.querySelector(".gallery-modal-title");
    const modalDesc = galleryModal.querySelector(".gallery-modal-text");
    const closeBtn = galleryModal.querySelector(".gallery-modal-close");

    galleryCards.forEach((card) => {
      card.addEventListener("click", () => {
        const title = card.getAttribute("data-title") || "";
        const desc = card.getAttribute("data-desc") || "";
        const img = card.querySelector("img");

        if (modalTitle) modalTitle.textContent = title;
        if (modalDesc) modalDesc.textContent = desc;
        if (modalImg && img) {
          modalImg.src = img.src;
          modalImg.alt = title;
        }

        galleryModal.classList.add("show");
        document.body.style.overflow = "hidden";
      });
    });

    const closeModal = () => {
      galleryModal.classList.remove("show");
      document.body.style.overflow = "";
    };

    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    galleryModal.addEventListener("click", (e) => {
      if (e.target === galleryModal) closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && galleryModal.classList.contains("show")) closeModal();
    });
  }

  // --- 5. Download Center Triggers ---
  document.querySelectorAll("[data-download-name]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const docName = btn.getAttribute("data-download-name") || "নথি";
      showToast(`"${docName}" প্রস্তুত হচ্ছে... ডাউনলোড শুরু হয়েছে!`);
      // Simulating file download link trigger
      setTimeout(() => {
        const fakeBlob = new Blob([
          `আন নাফে অর্গানাইজেশন (ANO)\nনথির নাম: ${docName}\n\nসততা, স্বচ্ছতা ও কল্যাণের প্রত্যয়ে হালাল ও নিরাপদ সমবায়ী সংগঠন।\nওয়েবসাইট: https://annafe.org\nযোগাযোগ: +880 1635-275513\nতারিখ: ${new Date().toLocaleDateString('bn-BD')}`
        ], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(fakeBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${docName.replace(/\s+/g, '_')}_ANO.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 600);
    });
  });

  // --- 6. PWA Service Worker & Install Prompt ---
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").then(
        (reg) => {
          console.log("ANO PWA Service Worker registered with scope:", reg.scope);
        },
        (err) => {
          console.warn("ANO PWA Service Worker registration failed:", err);
        }
      );
    });
  }

  // Install Prompt Banner handling
  let deferredPrompt;
  const pwaBanner = document.querySelector(".pwa-install-banner");
  const installBtn = document.querySelector(".btn-pwa-install");
  const dismissBtn = document.querySelector(".btn-pwa-dismiss");

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const dismissed = localStorage.getItem("ano_pwa_dismissed");
    if (!dismissed && pwaBanner) {
      setTimeout(() => {
        pwaBanner.style.display = "flex";
      }, 2000);
    }
  });

  if (installBtn) {
    installBtn.addEventListener("click", async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
          showToast("আন নাফে অ্যাপ হোম স্ক্রিনে যুক্ত হচ্ছে...");
        }
        deferredPrompt = null;
        if (pwaBanner) pwaBanner.style.display = "none";
      } else {
        showToast("আপনার ব্রাউজারের মেনু থেকে 'Add to Home screen' বা 'Install' সিলেক্ট করুন।", 5000);
      }
    });
  }

  if (dismissBtn && pwaBanner) {
    dismissBtn.addEventListener("click", () => {
      pwaBanner.style.display = "none";
      localStorage.setItem("ano_pwa_dismissed", "true");
    });
  }
});

