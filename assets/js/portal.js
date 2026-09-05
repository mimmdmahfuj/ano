const PORTALS = {
  member: "https://script.google.com/macros/s/AKfycbxMwVL4VwYRXFWGn9ppr5Qs7ONcyJG_l6_rX6owmXUl2DqBsbGBgB_zdCuogooPRnzL1A/exec?p=member",
  admin: "https://script.google.com/macros/s/AKfycbxMwVL4VwYRXFWGn9ppr5Qs7ONcyJG_l6_rX6owmXUl2DqBsbGBgB_zdCuogooPRnzL1A/exec"
};

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.querySelector(".portal-modal");
  const frame = document.getElementById("portalFrame");
  const title = document.getElementById("portalTitle");
  const loading = document.querySelector(".modal-loading");
  if (!modal || !frame) return;

  const confirmAndClose = () => {
    const isConfirmed = confirm("আপনি কি নিশ্চিত যে পোর্টাল বন্ধ করতে চান?");
    if (isConfirmed) {
      modal.classList.remove("open", "active");
      modal.setAttribute("aria-hidden", "true");
      frame.src = "about:blank";
      document.body.style.overflow = "";
      if (loading) loading.style.display = "none";
    }
  };

  document.querySelectorAll("[data-portal]").forEach((button) => {
    button.addEventListener("click", () => {
      const type = button.dataset.portal;
      if (title) title.textContent = type === "member" ? "মেম্বার পোর্টাল" : "অ্যাডমিন পোর্টাল";
      if (loading) loading.style.display = "flex";
      frame.src = PORTALS[type] || PORTALS.member;
      modal.classList.add("open", "active");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    });
  });

  frame.addEventListener("load", () => {
    if (loading) loading.style.display = "none";
  });

  modal.querySelector(".portal-close, .modal-close")?.addEventListener("click", confirmAndClose);
  // Disabled backdrop auto-close to prevent accidental dismissal
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && (modal.classList.contains("open") || modal.classList.contains("active"))) {
      confirmAndClose();
    }
  });
});
