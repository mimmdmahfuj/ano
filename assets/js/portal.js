```javascript
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

  // Keep iframe/session alive after closing the portal
  let loadedPortal = null;

  const close = () => {
    modal.classList.remove("open", "active");
    modal.setAttribute("aria-hidden", "true");

    /*
      IMPORTANT:
      Do NOT use:
      frame.src = "about:blank";

      Because that destroys the Google Apps Script portal
      and causes the user to login again.
    */

    document.body.style.overflow = "";

    if (loading) {
      loading.style.display = "none";
    }
  };

  document.querySelectorAll("[data-portal]").forEach((button) => {
    button.addEventListener("click", () => {
      const type = button.dataset.portal || "member";

      if (title) {
        title.textContent =
          type === "member"
            ? "মেম্বার পোর্টাল"
            : "অ্যাডমিন পোর্টাল";
      }

      /*
        Load the portal only when necessary.
        If the user closes and opens again,
        the existing iframe/session remains alive.
      */
      if (loadedPortal !== type) {
        if (loading) {
          loading.style.display = "flex";
        }

        frame.src = PORTALS[type] || PORTALS.member;
        loadedPortal = type;
      } else {
        if (loading) {
          loading.style.display = "none";
        }
      }

      modal.classList.add("open", "active");
      modal.setAttribute("aria-hidden", "false");

      document.body.style.overflow = "hidden";
    });
  });

  frame.addEventListener("load", () => {
    if (loading) {
      loading.style.display = "none";
    }
  });

  // Close button
  modal
    .querySelector(".portal-close, .modal-close")
    ?.addEventListener("click", close);

  // Clicking outside the portal
  modal
    .querySelector(".portal-backdrop, .modal-backdrop")
    ?.addEventListener("click", close);

  // ESC key
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      (
        modal.classList.contains("open") ||
        modal.classList.contains("active")
      )
    ) {
      close();
    }
  });
});
```
