(function () {
    const HEADER_H = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue("--header-h")
    ) || 68;

    const toggle = document.querySelector(".nav-toggle");
    const nav    = document.getElementById("primary-navigation");

    if (toggle && nav) {
        toggle.addEventListener("click", () => {
            const open = nav.classList.toggle("is-open");
            toggle.setAttribute("aria-expanded", open ? "true" : "false");
        });
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                nav.classList.remove("is-open");
                toggle.setAttribute("aria-expanded", "false");
            }
        });
        document.addEventListener("click", (e) => {
            if (!nav.classList.contains("is-open")) return;
            if (!nav.contains(e.target) && !toggle.contains(e.target)) {
                nav.classList.remove("is-open");
                toggle.setAttribute("aria-expanded", "false");
            }
        });
    }

    function scrollTo(hash) {
        const target = document.querySelector(hash);
        if (!target) return;
        const top = target.getBoundingClientRect().top + window.scrollY - HEADER_H - 12;
        window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    }

    document.querySelectorAll('#toc a[href^="#"]').forEach((a) => {
        a.addEventListener("click", (e) => {
            e.preventDefault();
            const href = a.getAttribute("href");
            history.pushState(null, "", href);
            scrollTo(href);
        });
    });

    const tocLinks = Array.from(document.querySelectorAll('#toc a[href^="#"]'));
    const linkMap  = new Map(tocLinks.map((a) => [a.getAttribute("href"), a]));

    function setActive(hash) {
        linkMap.forEach((el, h) => {
            el.classList.toggle("is-active", h === hash);
        });
    }

    const sections = tocLinks
        .map((a) => document.querySelector(a.getAttribute("href")))
        .filter(Boolean);

    if (sections.length) {
        const io = new IntersectionObserver(
            (entries) => {
                const hit = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
                if (hit) setActive("#" + hit.target.id);
            },
            { rootMargin: `-${HEADER_H + 16}px 0px -60% 0px`, threshold: 0.1 }
        );
        sections.forEach((s) => io.observe(s));
    }

    window.addEventListener("load", () => {
        if (location.hash) scrollTo(location.hash);
    });
})();
