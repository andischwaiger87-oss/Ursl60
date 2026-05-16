document.addEventListener('DOMContentLoaded', () => {
    // Intersection Observer für Scroll-Animationen
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Element wird eingeblendet, wenn 15% sichtbar sind
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Füge die 'show' Klasse hinzu, um die CSS Animation zu starten
                entry.target.classList.add('show');
                // Optional: Element nur einmal animieren
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Alle Timeline-Elemente beobachten
    const timelineItems = document.querySelectorAll('.scroll-reveal');
    timelineItems.forEach(item => {
        observer.observe(item);
    });
});
