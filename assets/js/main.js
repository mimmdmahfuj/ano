document.addEventListener("DOMContentLoaded", function () {


    /* =========================================
       MOBILE MENU
    ========================================= */

    const menuButton =
        document.querySelector(".mobile-menu-btn");

    const navigation =
        document.querySelector(".main-nav");


    if (menuButton && navigation) {

        menuButton.addEventListener(
            "click",
            function () {

                const isOpen =
                    navigation.classList.toggle("open");

                menuButton.setAttribute(
                    "aria-expanded",
                    isOpen
                );


                const icon =
                    menuButton.querySelector("i");


                if (icon) {

                    icon.className =
                        isOpen
                            ? "bi bi-x-lg"
                            : "bi bi-list";

                }

            }
        );


        navigation
            .querySelectorAll("a")
            .forEach(function (link) {

                link.addEventListener(
                    "click",
                    function () {

                        navigation.classList.remove("open");

                        menuButton.setAttribute(
                            "aria-expanded",
                            "false"
                        );


                        const icon =
                            menuButton.querySelector("i");


                        if (icon) {

                            icon.className =
                                "bi bi-list";

                        }

                    }
                );

            });

    }



    /* =========================================
       REVEAL ON SCROLL
    ========================================= */

    const revealElements =
        document.querySelectorAll(".reveal");


    if ("IntersectionObserver" in window) {

        const revealObserver =
            new IntersectionObserver(
                function (entries, observer) {

                    entries.forEach(
                        function (entry) {

                            if (entry.isIntersecting) {

                                entry.target.classList.add(
                                    "visible"
                                );

                                observer.unobserve(
                                    entry.target
                                );

                            }

                        }
                    );

                },
                {
                    threshold: 0.12
                }
            );


        revealElements.forEach(
            function (element) {

                revealObserver.observe(element);

            }
        );

    } else {

        revealElements.forEach(
            function (element) {

                element.classList.add("visible");

            }
        );

    }



    /* =========================================
       NUMBER COUNTER
    ========================================= */

    const counters =
        document.querySelectorAll(".counter");


    function animateCounter(element) {

        const target =
            Number(element.dataset.target || 0);

        const suffix =
            element.dataset.suffix || "";

        const duration =
            1500;

        const startTime =
            performance.now();


        function updateCounter(currentTime) {

            const elapsed =
                currentTime - startTime;

            const progress =
                Math.min(
                    elapsed / duration,
                    1
                );


            const eased =
                1 -
                Math.pow(
                    1 - progress,
                    3
                );


            const current =
                Math.floor(
                    target * eased
                );


            element.textContent =
                current + suffix;


            if (progress < 1) {

                requestAnimationFrame(
                    updateCounter
                );

            }

        }


        requestAnimationFrame(
            updateCounter
        );

    }



    if (
        counters.length &&
        "IntersectionObserver" in window
    ) {

        const counterObserver =
            new IntersectionObserver(
                function (entries, observer) {

                    entries.forEach(
                        function (entry) {

                            if (
                                entry.isIntersecting
                            ) {

                                animateCounter(
                                    entry.target
                                );

                                observer.unobserve(
                                    entry.target
                                );

                            }

                        }
                    );

                },
                {
                    threshold: .7
                }
            );


        counters.forEach(
            function (counter) {

                counterObserver.observe(counter);

            }
        );

    }



    /* =========================================
       CURRENT YEAR
    ========================================= */

    const year =
        document.getElementById("year");


    if (year) {

        year.textContent =
            new Date().getFullYear();

    }



    /* =========================================
       CLOSE MENU ON OUTSIDE CLICK
    ========================================= */

    document.addEventListener(
        "click",
        function (event) {

            if (
                !navigation ||
                !menuButton
            ) {
                return;
            }


            if (
                navigation.classList.contains("open") &&
                !navigation.contains(event.target) &&
                !menuButton.contains(event.target)
            ) {

                navigation.classList.remove("open");

                menuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );


                const icon =
                    menuButton.querySelector("i");


                if (icon) {

                    icon.className =
                        "bi bi-list";

                }

            }

        }
    );

});
