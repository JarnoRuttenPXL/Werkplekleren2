(function () {
    const header = document.querySelector(".navbar");
    const nav = document.getElementById("primary-navigation");
    const toggle = document.querySelector(".nav-toggle");
    const navLinks = document.querySelectorAll('.nav-left a[href^="#"]');

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function headerOffset() {
        return header ? header.offsetHeight : 0;
    }

    function closeMenu() {
        if (!nav || !toggle) return;
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
    }

    function openMenu() {
        if (!nav || !toggle) return;
        nav.classList.add("is-open");
        toggle.setAttribute("aria-expanded", "true");
    }

    function toggleMenu() {
        if (!nav || !toggle) return;
        const isOpen = nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    }

    function scrollToHash(hash) {
        if (!hash || !hash.startsWith("#")) return;
        const target = document.querySelector(hash);
        if (!target) return;

        const extraGap = 12;
        const top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset() - extraGap;

        window.scrollTo({
            top: Math.max(0, top),
            behavior: prefersReducedMotion ? "auto" : "smooth",
        });
    }

    if (toggle) {
        toggle.addEventListener("click", toggleMenu);
    }

    navLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            const href = link.getAttribute("href");
            if (!href || !href.startsWith("#")) return;

            e.preventDefault();
            scrollToHash(href);

            history.pushState(null, "", href);

            closeMenu();
        });
    });

    document.addEventListener("click", (e) => {
        if (!nav || !toggle) return;
        if (!nav.classList.contains("is-open")) return;

        const clickedInsideNav = nav.contains(e.target);
        const clickedToggle = toggle.contains(e.target);
        if (!clickedInsideNav && !clickedToggle) closeMenu();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeMenu();
    });

    window.addEventListener("load", () => {
        if (location.hash) {
            scrollToHash(location.hash);
        }
    });

    window.addEventListener("popstate", () => {
        if (location.hash) scrollToHash(location.hash);
    });

    if (header) {
        const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 4);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
    }

    const sections = document.querySelectorAll("section[id]");
    const linkByHash = new Map(
        Array.from(navLinks).map((a) => [a.getAttribute("href"), a])
    );

    function setActive(hash) {
        linkByHash.forEach((a, h) => {
            const active = h === hash;
            a.classList.toggle("is-active", active);
            if (active) a.setAttribute("aria-current", "page");
            else a.removeAttribute("aria-current");
        });
    }

    if (sections.length) {
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (!entry.isIntersecting) continue;
                    setActive(`#${entry.target.id}`);
                    break;
                }
            },
            {
                rootMargin: `-${headerOffset() + 20}px 0px -60% 0px`,
                threshold: 0.1,
            }
        );

        sections.forEach((s) => observer.observe(s));
    }

    const contactBtn = document.getElementById("contactBtn");
    if (contactBtn) {
        contactBtn.addEventListener("click", () => scrollToHash("#contact"));
    }

    (function initModal() {
        const modal = document.getElementById("modal");
        if (!modal) return;

        const modalImg = document.getElementById("modal-img");
        const modalTitle = document.getElementById("modal-title");
        const modalMeta = document.getElementById("modal-meta");
        const modalDesc = document.getElementById("modal-desc");

        const cards = document.querySelectorAll(".card");
        const closeTargets = modal.querySelectorAll("[data-close]");

        let lastFocused = null;

        function openModalFromCard(card) {
            lastFocused = document.activeElement;

            const title = card.dataset.title || "";
            const vak = card.dataset.vak || "";
            const img = card.dataset.image || "";
            const desc = card.dataset.description || "";

            modalTitle.textContent = title;
            modalMeta.textContent = vak ? `Vak: ${vak}` : "";
            modalDesc.textContent = desc;

            if (modalImg) {
                modalImg.src = img;
                modalImg.alt = title ? `Afbeelding van ${title}` : "Projectafbeelding";
            }

            modal.classList.add("is-open");
            modal.setAttribute("aria-hidden", "false");

            const closeBtn = modal.querySelector(".modal__close");
            closeBtn?.focus();
        }

        function closeModal() {
            modal.classList.remove("is-open");
            modal.setAttribute("aria-hidden", "true");

            if (modalImg) {
                modalImg.src = "";
                modalImg.alt = "";
            }

            if (lastFocused && typeof lastFocused.focus === "function") {
                lastFocused.focus();
            }
        }

        cards.forEach((card) => {
            card.addEventListener("click", () => openModalFromCard(card));
            card.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openModalFromCard(card);
                }
            });
        });

        closeTargets.forEach((el) => el.addEventListener("click", closeModal));

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && modal.classList.contains("is-open")) {
                closeModal();
            }
        });
    })();

    const jrForm = document.getElementById("jrContactForm");
    const jrStatus = document.getElementById("jrContactStatus");
    const jrSubmit = document.getElementById("jrContactSubmit");

    function jrIsValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    }

    if (jrForm && jrStatus && jrSubmit) {
        jrForm.addEventListener("submit", (e) => {
            e.preventDefault();
            jrStatus.textContent = "";

            const name = jrForm.elements.name.value.trim();
            const email = jrForm.elements.email.value.trim();
            const message = jrForm.elements.message.value.trim();

            if (!name || !email || !message) {
                jrStatus.textContent = "Vul alle velden in aub.";
                return;
            }

            if (!jrIsValidEmail(email)) {
                jrStatus.textContent = "Vul een geldig e-mailadres in.";
                return;
            }

            jrStatus.textContent = "Verzenden...";
            jrSubmit.disabled = true;

            setTimeout(() => {
                jrStatus.textContent = "Bedankt! Ik neem zo snel mogelijk contact met je op.";
                jrForm.reset();
                jrSubmit.disabled = false;
            }, 700);
        });
    }
})();
zonderHTMLtoetelaten in data-attribuut; modalDesc.innerHTML = modalDesc.innerHTML.replace(/\n/g,
);