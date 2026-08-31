const PORTALS = {
    member:
        "https://script.google.com/macros/s/AKfycbxMwVL4VwYRXFWGn9ppr5Qs7ONcyJG_l6_rX6owmXUl2DqBsbGBgB_zdCuogooPRnzL1A/exec?p=member",

    admin:
        "https://script.google.com/macros/s/AKfycbxMwVL4VwYRXFWGn9ppr5Qs7ONcyJG_l6_rX6owmXUl2DqBsbGBgB_zdCuogooPRnzL1A/exec"
};


document.addEventListener("DOMContentLoaded", function () {

    const modal =
        document.querySelector(".portal-modal");

    const frame =
        document.getElementById("portalFrame");

    const title =
        document.getElementById("portalTitle");

    const closeButton =
        document.querySelector(".portal-close");

    const backdrop =
        document.querySelector(".portal-backdrop");


    if (!modal || !frame) {
        return;
    }


    /*
    ==========================================
    FULL WIDTH PORTAL
    ==========================================
    */

    const modalBox =
        modal.querySelector(".portal-modal-box");


    if (modalBox) {

        modalBox.style.width = "100vw";
        modalBox.style.maxWidth = "100vw";
        modalBox.style.height = "100vh";
        modalBox.style.maxHeight = "100vh";
        modalBox.style.margin = "0";

    }


    frame.style.width = "100%";
    frame.style.height = "calc(100vh - 64px)";
    frame.style.minHeight = "600px";
    frame.style.border = "0";


    /*
    ==========================================
    OPEN PORTAL
    ==========================================
    */

    function openPortal(type) {

        const url = PORTALS[type];

        if (!url) {
            return;
        }


        if (title) {

            title.textContent =
                type === "member"
                    ? "মেম্বার পোর্টাল"
                    : "অ্যাডমিন পোর্টাল";

        }


        frame.src = url;


        modal.classList.add("open");

        modal.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.style.overflow =
            "hidden";

    }


    /*
    ==========================================
    CLOSE PORTAL
    ==========================================
    */

    function closePortal() {

        modal.classList.remove("open");

        modal.setAttribute(
            "aria-hidden",
            "true"
        );


        frame.src =
            "about:blank";


        document.body.style.overflow =
            "";

    }


    /*
    ==========================================
    PORTAL BUTTONS
    ==========================================
    */

    document
        .querySelectorAll("[data-portal]")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    openPortal(
                        button.dataset.portal
                    );

                }
            );

        });


    /*
    ==========================================
    CLOSE BUTTON
    ==========================================
    */

    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closePortal
        );

    }


    if (backdrop) {

        backdrop.addEventListener(
            "click",
            closePortal
        );

    }


    /*
    ==========================================
    ESC KEY
    ==========================================
    */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                modal.classList.contains("open")
            ) {

                closePortal();

            }

        }
    );

});
