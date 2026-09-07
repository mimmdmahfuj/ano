const PORTALS = {
  member: "https://script.google.com/macros/s/AKfycbxRKo42ib1ijLIxacokcz1XpEF4R6iDJCrJYy_gdph4NW4Ou5J97cAfAu3XKuCPqICQjw/exec?p=member",
  admin: "https://script.google.com/macros/s/AKfycbxRKo42ib1ijLIxacokcz1XpEF4R6iDJCrJYy_gdph4NW4Ou5J97cAfAu3XKuCPqICQjw/exec"
};

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.querySelector(".portal-modal");
  const frame = document.getElementById("portalFrame");
  const title = document.getElementById("portalTitle");
  const loading = document.querySelector(".modal-loading");
  if (!modal || !frame) return;

  const openPortal = (type) => {
    const portalUrl = PORTALS[type] || PORTALS.member;
    const currentUrl = frame.getAttribute("src") || "about:blank";
    const isNewPortal = currentUrl !== portalUrl;

    if (title) {
      title.textContent = type === "member" ? "মেম্বার পোর্টাল" : "অ্যাডমিন পোর্টাল";
    }

    if (isNewPortal) {
      if (loading) loading.style.display = "flex";
      frame.src = portalUrl;
    }

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const close = () => {
    modal.classList.remove("open", "active");
    modal.setAttribute("aria-hidden", "true");
    // Do not reset frame.src here. Keeping the iframe mounted preserves
    // the portal's in-page state and lets users return without logging in again.
    document.body.style.overflow = "";
    if (loading) loading.style.display = "none";
  };

  document.querySelectorAll("[data-portal]").forEach((button) => {
    button.addEventListener("click", () => openPortal(button.dataset.portal));
  });

  frame.addEventListener("load", () => {
    if (loading) loading.style.display = "none";
  });

  modal.querySelector(".portal-close, .modal-close")?.addEventListener("click", close);
  modal.querySelector(".portal-backdrop, .modal-backdrop")?.addEventListener("click", close);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && (modal.classList.contains("open") || modal.classList.contains("active"))) {
      close();
    }
  });
});
