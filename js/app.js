// --- Supabase Konfiguration ---
const SUPABASE_URL = 'https://hbhchaylifgwulzxyygw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhiaGNoYXlsaWZnd3Vsenh5eWd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5NzEyNzgsImV4cCI6MjA5NDU0NzI3OH0.lYSMZBdgSMgTg-Qhwkr__fqxR5ntHmlJG0H9ACSVEWw';
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener('DOMContentLoaded', () => {
    // 1. Timeline dynamisch rendern
    renderTimeline();
    
    // 2. Erinnerungen aus Supabase laden
    fetchMemories();

    // 3. Observer für Animationen initialisieren
    initScrollObserver();

    // 4. Lightbox und Smooth Scroll initialisieren
    initInteractions();

    // 5. Modal Logic initialisieren
    initMemoryModal();
});

// --- Rendert die HTML Struktur basierend auf js/config.js ---
const renderTimeline = () => {
    const container = document.getElementById('timeline-container');
    const loadingIndicator = document.getElementById('loading-indicator');
    if(!container) return;
    
    let html = '';
    
    // galleryImages kommt aus js/config.js
    galleryImages.forEach((imgObj, index) => {
        const isLeft = index % 2 === 0; // Gerade Indices Links, ungerade Rechts
        
        // HTML für den Erinnerungs-Container und den "+ Erinnerung hinzufügen" Button
        const memoriesHtml = `
            <div class="mt-8 border-t border-outline-variant/30 pt-6 hidden" id="memories-container-${imgObj.id}">
                <div class="space-y-6" id="memories-list-${imgObj.id}">
                    <!-- Kommentare werden hier per JS eingefügt -->
                </div>
            </div>
            <button onclick="openMemoryModal('${imgObj.id}')" class="mt-8 font-label-sm text-[11px] uppercase tracking-[0.15em] text-secondary hover:text-primary transition-colors flex items-center gap-3 group">
                <span class="w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center group-hover:border-primary transition-colors">+</span>
                Erinnerung hinzufügen
            </button>
        `;

        // Gesamtes HTML-Template für ein Bild (inkl. Lazy Loading)
        const template = `
            <!-- Timeline Item ${index + 1} -->
            <div class="relative flex flex-col md:flex-row${isLeft ? '' : '-reverse'} items-center md:items-start justify-center gap-12 md:gap-16 mb-24 md:mb-32 group scroll-reveal">
                <!-- Timeline Marker (nur Desktop) -->
                <div class="hidden md:flex absolute left-1/2 top-1/2 md:top-24 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-outline-variant bg-surface-container-lowest z-10 transition-all duration-500 group-hover:scale-150 group-hover:bg-primary group-hover:border-primary shadow-sm"></div>
                
                <!-- Bild Container -->
                <div class="w-full md:w-1/2 ${isLeft ? 'md:pr-16 flex justify-end' : 'md:pl-16 flex justify-start'}">
                    <div class="w-full max-w-md rounded-xl overflow-hidden image-card border border-outline-variant/20 bg-surface-container-lowest p-2">
                        <!-- Ladezeit-Optimierung: loading="lazy" ! -->
                        <img loading="lazy" alt="${imgObj.title}" class="w-full h-auto rounded-lg object-cover gallery-img-clickable" src="${imgObj.src}">
                    </div>
                </div>
                
                <!-- Text Container -->
                <div class="w-full md:w-1/2 ${isLeft ? 'md:pl-16 text-center md:text-left' : 'md:pr-16 text-center md:text-right'} mt-6 md:mt-0">
                    <span class="font-label-sm text-[12px] text-secondary uppercase tracking-[0.15em] block mb-4">${imgObj.year}</span>
                    <h2 class="font-headline-sm text-[28px] text-primary mb-4">${imgObj.title}</h2>
                    
                    ${memoriesHtml}
                </div>
            </div>
        `;
        html += template;
    });
    
    container.innerHTML = html;
    if(loadingIndicator) loadingIndicator.style.display = 'none';
};

// --- Supabase: Erinnerungen laden ---
const fetchMemories = async () => {
    try {
        const { data: memories, error } = await supabaseClient
            .from('memories')
            .select('*')
            .order('created_at', { ascending: true });
            
        if (error) {
            console.error("Fehler beim Laden der Erinnerungen:", error);
            return;
        }

        // Gruppiere Erinnerungen nach image_id
        memories.forEach(memory => {
            appendMemoryToDOM(memory.image_id, memory);
        });

    } catch (err) {
        console.error("Unerwarteter Fehler:", err);
    }
};

// --- DOM Hilfsfunktion: Fügt eine Erinnerung unter dem Bild ein ---
const appendMemoryToDOM = (imageId, memory) => {
    const listContainer = document.getElementById(`memories-list-${imageId}`);
    const parentContainer = document.getElementById(`memories-container-${imageId}`);
    
    if(!listContainer || !parentContainer) return;
    
    parentContainer.classList.remove('hidden'); // Container sichtbar machen, da jetzt Inhalte existieren

    // Datum formatieren
    const date = new Date(memory.created_at);
    const dateString = date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });

    const memoryHtml = `
        <div class="memory-entry text-left">
            <div class="flex items-baseline gap-3 mb-1 justify-center md:justify-start">
                <span class="font-headline-sm text-lg text-primary">${memory.author_name}</span>
                <span class="font-label-sm text-[10px] text-secondary tracking-widest">${dateString}</span>
            </div>
            <p class="font-body-md text-[15px] text-on-surface-variant leading-relaxed">
                ${memory.memory_text.replace(/\n/g, '<br>')}
            </p>
        </div>
    `;

    listContainer.insertAdjacentHTML('beforeend', memoryHtml);
};

// --- Modal Logik ---
const initMemoryModal = () => {
    const modal = document.getElementById('memory-modal');
    const closeBtn = document.getElementById('memory-modal-close');
    const form = document.getElementById('memory-form');

    // Modal global verfügbar machen für das onClick Attribut
    window.openMemoryModal = (imageId) => {
        document.getElementById('memory-image-id').value = imageId;
        modal.classList.remove('hidden');
        setTimeout(() => {
            modal.classList.remove('opacity-0');
            modal.querySelector('div').classList.remove('scale-95');
            modal.querySelector('div').classList.add('scale-100');
        }, 10);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modal.classList.add('opacity-0');
        modal.querySelector('div').classList.remove('scale-100');
        modal.querySelector('div').classList.add('scale-95');
        setTimeout(() => {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
            form.reset();
        }, 300);
    };

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Formular absenden (In Supabase speichern)
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const imageId = document.getElementById('memory-image-id').value;
        const authorName = document.getElementById('author-name').value;
        const memoryText = document.getElementById('memory-text').value;
        
        // Button Loading State
        const submitBtn = document.getElementById('memory-submit-btn');
        const submitText = document.getElementById('submit-text');
        const submitSpinner = document.getElementById('submit-spinner');
        
        submitBtn.disabled = true;
        submitText.textContent = 'Speichert...';
        submitSpinner.classList.remove('hidden');

        try {
            // In Supabase einfügen
            const { data, error } = await supabaseClient
                .from('memories')
                .insert([
                    { image_id: imageId, author_name: authorName, memory_text: memoryText }
                ])
                .select();

            if (error) throw error;

            // Erfolgreich -> Direkt im UI anzeigen
            if (data && data.length > 0) {
                appendMemoryToDOM(imageId, data[0]);
            }
            
            closeModal();
            
        } catch (err) {
            console.error("Fehler beim Speichern:", err);
            alert("Es gab einen Fehler beim Speichern der Erinnerung. Bitte versuche es noch einmal.");
        } finally {
            submitBtn.disabled = false;
            submitText.textContent = 'Speichern';
            submitSpinner.classList.add('hidden');
        }
    });
};

// --- Animations Observer ---
const initScrollObserver = () => {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, observerOptions);

    const timelineItems = document.querySelectorAll('.scroll-reveal');
    timelineItems.forEach(item => {
        observer.observe(item);
    });
};

// --- Lightbox & Smooth Scroll ---
const initInteractions = () => {
    const scrollBtn = document.querySelector('a[href="#gallery"]');
    if(scrollBtn) {
        scrollBtn.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector('#gallery').scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    const lightbox = document.getElementById('lightbox');
    if(lightbox) {
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxClose = document.getElementById('lightbox-close');
        
        // Verwende Event Delegation für dynamische Bilder
        document.getElementById('timeline-container').addEventListener('click', (e) => {
            if (e.target && e.target.classList.contains('gallery-img-clickable')) {
                lightboxImg.src = e.target.src;
                lightbox.classList.remove('hidden');
                setTimeout(() => {
                    lightbox.classList.remove('opacity-0');
                    lightboxImg.classList.remove('scale-95');
                    lightboxImg.classList.add('scale-100');
                }, 10);
                document.body.style.overflow = 'hidden';
            }
        });

        const closeLightbox = () => {
            lightbox.classList.add('opacity-0');
            lightboxImg.classList.remove('scale-100');
            lightboxImg.classList.add('scale-95');
            setTimeout(() => {
                lightbox.classList.add('hidden');
                document.body.style.overflow = '';
                lightboxImg.src = '';
            }, 500);
        };

        lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !lightbox.classList.contains('hidden')) closeLightbox(); });
    }
};
