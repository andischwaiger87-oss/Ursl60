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
                entry.target.classList.add('show');
            }
        });
    }, observerOptions);

    // Alle Timeline-Elemente beobachten
    const timelineItems = document.querySelectorAll('.scroll-reveal');
    timelineItems.forEach(item => {
        observer.observe(item);
    });

    // Smooth Scroll für "Zeitreise starten" Button
    const scrollBtn = document.querySelector('a[href="#gallery"]');
    if(scrollBtn) {
        scrollBtn.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector('#gallery').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    }

    // Lightbox Funktionalität
    const lightbox = document.getElementById('lightbox');
    if(lightbox) {
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxClose = document.getElementById('lightbox-close');
        const images = document.querySelectorAll('.image-card img');

        // Cursor bei Bildern anpassen
        images.forEach(img => {
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', () => {
                lightboxImg.src = img.src;
                lightbox.classList.remove('hidden');
                
                // Kurze Verzögerung für CSS Transition
                setTimeout(() => {
                    lightbox.classList.remove('opacity-0');
                    lightboxImg.classList.remove('scale-95');
                    lightboxImg.classList.add('scale-100');
                }, 10);
                
                document.body.style.overflow = 'hidden'; // Scrollen im Hintergrund verhindern
            });
        });

        const closeLightbox = () => {
            lightbox.classList.add('opacity-0');
            lightboxImg.classList.remove('scale-100');
            lightboxImg.classList.add('scale-95');
            
            setTimeout(() => {
                lightbox.classList.add('hidden');
                document.body.style.overflow = ''; // Scrollen wieder aktivieren
                lightboxImg.src = '';
            }, 300);
        };

        lightboxClose.addEventListener('click', closeLightbox);
        
        // Schließen bei Klick außerhalb des Bildes
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Schließen mit ESC-Taste
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !lightbox.classList.contains('hidden')) {
                closeLightbox();
            }
        });
    }
});
