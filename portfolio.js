(() => {
    const btn = document.getElementById("pfToggleAll");
    if (!btn) return;

    const panels = Array.from(document.querySelectorAll("details.pf-card"));
    if (panels.length === 0) return;

    btn.addEventListener("click", () => {
        const shouldOpen = panels.some(d => !d.open);
        panels.forEach(d => (d.open = shouldOpen));
    });
})();
