const SUPABASE_URL = 'https://hbhchaylifgwulzxyygw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhiaGNoYXlsaWZnd3Vsenh5eWd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5NzEyNzgsImV4cCI6MjA5NDU0NzI3OH0.lYSMZBdgSMgTg-Qhwkr__fqxR5ntHmlJG0H9ACSVEWw';
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const ADMIN_PASSWORD = 'ursula60';
let galleryImages = []; // Wird aus der DB gefüllt

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

const initApp = async () => {
    await fetchImages();
    renderTimeline();
    fetchMemories();
    initScrollObserver();
    initInteractions();
    initMemoryModal();
    initImageModal();
};

// --- Supabase: Bilder laden ---
const fetchImages = async () => {
    try {
        const { data, error } = await supabaseClient
            .from('images')
            .select('*')
            .order('sort_order', { ascending: true });
            
        if (error) throw error;
        galleryImages = data;
    } catch (err) {
        console.error("Fehler beim Laden der Bilder:", err);
    }
};

// --- Timeline Rendern ---
const renderTimeline = () => {
    const container = document.getElementById('timeline-container');
    const loadingIndicator = document.getElementById('loading-indicator');
    if(!container) return;
    
    let html = '';
    
    galleryImages.forEach((imgObj, index) => {
        const isLeft = index % 2 === 0;
        
        const memoriesHtml = `
            <div class="mt-8 border-t border-outline-variant/30 pt-6 hidden" id="memories-container-${imgObj.id}">
                <div class="space-y-6" id="memories-list-${imgObj.id}"></div>
            </div>
            <button onclick="openMemoryModal('${imgObj.id}', null)" class="mt-8 font-label-sm text-[11px] uppercase tracking-[0.15em] text-secondary hover:text-primary transition-colors flex items-center gap-3 group">
                <span class="w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center group-hover:border-primary transition-colors text-[20px] font-light pb-[2px]">+</span>
                Erinnerung hinzufügen
            </button>
        `;

        const template = `
            <div class="relative flex flex-col md:flex-row${isLeft ? '' : '-reverse'} items-center md:items-start justify-center gap-12 md:gap-16 mb-24 md:mb-32 group scroll-reveal" id="timeline-item-${imgObj.id}">
                <div class="hidden md:flex absolute left-1/2 top-1/2 md:top-24 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-outline-variant bg-surface-container-lowest z-10 transition-all duration-500 group-hover:scale-150 group-hover:bg-primary group-hover:border-primary shadow-sm"></div>
                
                <div class="w-full md:w-1/2 ${isLeft ? 'md:pr-16 flex justify-end' : 'md:pl-16 flex justify-start'} relative">
                    <div class="w-full max-w-md rounded-xl overflow-hidden image-card border border-outline-variant/20 bg-surface-container-lowest p-2">
                        <img loading="lazy" alt="${imgObj.title_text}" class="w-full h-auto rounded-lg object-cover gallery-img-clickable" src="${imgObj.filename}">
                    </div>
                </div>
                
                <div class="w-full md:w-1/2 ${isLeft ? 'md:pl-16 text-center md:text-left' : 'md:pr-16 text-center md:text-right'} mt-6 md:mt-0 relative group">
                    <span class="font-label-sm text-[12px] text-secondary uppercase tracking-[0.15em] mb-2 flex items-center gap-2 justify-center ${isLeft ? 'md:justify-start' : 'md:justify-end'}">
                        ${imgObj.year_text}
                    </span>
                    <h2 class="font-headline-sm text-[28px] text-primary mb-4 flex items-center gap-3 justify-center ${isLeft ? 'md:justify-start' : 'md:justify-end'}">
                        ${imgObj.title_text}
                        <button onclick='openImageModal(${JSON.stringify(imgObj).replace(/'/g, "&#39;")})' class="admin-action text-secondary hover:text-primary transition-colors flex items-center" title="Bild-Titel bearbeiten">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                        </button>
                        <button onclick='deleteImage("${imgObj.id}")' class="admin-action text-red-400 hover:text-red-600 transition-colors flex items-center" title="Bild löschen">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                    </h2>
                    
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
            
        if (error) throw error;

        memories.forEach(memory => {
            appendMemoryToDOM(memory.image_id, memory);
        });
    } catch (err) {
        console.error("Fehler beim Laden der Erinnerungen:", err);
    }
};

const appendMemoryToDOM = (imageId, memory) => {
    const listContainer = document.getElementById(`memories-list-${imageId}`);
    const parentContainer = document.getElementById(`memories-container-${imageId}`);
    if(!listContainer || !parentContainer) return;
    
    parentContainer.classList.remove('hidden');

    const date = new Date(memory.created_at);
    const dateString = date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
    
    const existingMemory = document.getElementById(`memory-item-${memory.id}`);
    const memoryHtml = `
        <div class="memory-entry text-left group/mem" id="memory-item-${memory.id}">
            <div class="flex items-baseline gap-3 mb-1 justify-center md:justify-start relative">
                <span class="font-headline-sm text-lg text-primary">${memory.author_name}</span>
                <span class="font-label-sm text-[10px] text-secondary tracking-widest">${dateString}</span>
                <div class="flex gap-3 ml-3 opacity-0 group-hover/mem:opacity-100 transition-opacity items-center">
                    <button onclick='openMemoryModal("${imageId}", ${JSON.stringify(memory).replace(/'/g, "&#39;")})' class="admin-action text-secondary hover:text-primary transition-colors flex items-center" title="Bearbeiten">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                    </button>
                    <button onclick='deleteMemory("${memory.id}")' class="admin-action text-red-400 hover:text-red-600 transition-colors flex items-center" title="Löschen">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
            </div>
            <p class="font-body-md text-[15px] text-on-surface-variant leading-relaxed">
                ${memory.memory_text.replace(/\n/g, '<br>')}
            </p>
        </div>
    `;

    if(existingMemory) {
        existingMemory.outerHTML = memoryHtml;
    } else {
        listContainer.insertAdjacentHTML('beforeend', memoryHtml);
    }
};

// --- Admin Security Wrapper ---
const requireAdmin = (callback) => {
    const modal = document.getElementById('admin-modal');
    const input = document.getElementById('admin-password-input');
    const confirmBtn = document.getElementById('admin-confirm-btn');
    const cancelBtn = document.getElementById('admin-cancel-btn');
    const errorMsg = document.getElementById('admin-error');

    input.value = '';
    errorMsg.classList.add('hidden');
    
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.querySelector('div').classList.remove('scale-95');
        modal.querySelector('div').classList.add('scale-100');
    }, 10);

    const closeAdmin = () => {
        modal.classList.add('opacity-0');
        modal.querySelector('div').classList.remove('scale-100');
        modal.querySelector('div').classList.add('scale-95');
        setTimeout(() => modal.classList.add('hidden'), 300);
        
        // Cleanup event listeners
        confirmBtn.onclick = null;
        cancelBtn.onclick = null;
    };

    cancelBtn.onclick = closeAdmin;

    confirmBtn.onclick = () => {
        if(input.value === ADMIN_PASSWORD) {
            closeAdmin();
            callback();
        } else {
            errorMsg.classList.remove('hidden');
        }
    };
};

// --- API Calls ---
const deleteMemory = (memoryId) => {
    requireAdmin(async () => {
        if(confirm('Erinnerung wirklich löschen?')) {
            await supabaseClient.from('memories').delete().eq('id', memoryId);
            document.getElementById(`memory-item-${memoryId}`).remove();
        }
    });
};

const deleteImage = (imageId) => {
    requireAdmin(async () => {
        if(confirm('Soll dieses Bild komplett aus der Timeline gelöscht werden?')) {
            await supabaseClient.from('images').delete().eq('id', imageId);
            document.getElementById(`timeline-item-${imageId}`).remove();
        }
    });
};

// --- Modals ---
const initMemoryModal = () => {
    const modal = document.getElementById('memory-modal');
    const closeBtn = document.getElementById('memory-modal-close');
    const form = document.getElementById('memory-form');

    window.openMemoryModal = (imageId, editMemoryObj = null) => {
        document.getElementById('memory-image-id').value = imageId;
        const authorInput = document.getElementById('author-name');
        const textInput = document.getElementById('memory-text');
        const editIdInput = document.getElementById('memory-edit-id');
        const title = document.getElementById('memory-modal-title');

        if(editMemoryObj) {
            // Require Admin to open Edit modal
            requireAdmin(() => {
                authorInput.value = editMemoryObj.author_name;
                textInput.value = editMemoryObj.memory_text;
                editIdInput.value = editMemoryObj.id;
                title.textContent = "Erinnerung bearbeiten";
                showModal();
            });
        } else {
            form.reset();
            editIdInput.value = '';
            document.getElementById('memory-image-id').value = imageId;
            title.textContent = "Erinnerung teilen";
            showModal();
        }

        function showModal() {
            modal.classList.remove('hidden');
            setTimeout(() => {
                modal.classList.remove('opacity-0');
                modal.querySelector('div').classList.remove('scale-95');
                modal.querySelector('div').classList.add('scale-100');
            }, 10);
            document.body.style.overflow = 'hidden';
        }
    };

    const closeModal = () => {
        modal.classList.add('opacity-0');
        modal.querySelector('div').classList.remove('scale-100');
        modal.querySelector('div').classList.add('scale-95');
        setTimeout(() => {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }, 300);
    };

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const imageId = document.getElementById('memory-image-id').value;
        const editId = document.getElementById('memory-edit-id').value;
        const authorName = document.getElementById('author-name').value;
        const memoryText = document.getElementById('memory-text').value;
        
        const submitBtn = document.getElementById('memory-submit-btn');
        const submitText = document.getElementById('submit-text');
        const submitSpinner = document.getElementById('submit-spinner');
        
        submitBtn.disabled = true;
        submitText.textContent = 'Speichert...';
        submitSpinner.classList.remove('hidden');

        try {
            if(editId) {
                const { data, error } = await supabaseClient.from('memories').update({ author_name: authorName, memory_text: memoryText }).eq('id', editId).select();
                if (error) throw error;
                if (data) appendMemoryToDOM(imageId, data[0]);
            } else {
                const { data, error } = await supabaseClient.from('memories').insert([{ image_id: imageId, author_name: authorName, memory_text: memoryText }]).select();
                if (error) throw error;
                if (data) appendMemoryToDOM(imageId, data[0]);
            }
            closeModal();
        } catch (err) {
            console.error(err);
            alert("Fehler beim Speichern.");
        } finally {
            submitBtn.disabled = false;
            submitText.textContent = 'Speichern';
            submitSpinner.classList.add('hidden');
        }
    });
};

const initImageModal = () => {
    const modal = document.getElementById('image-modal');
    const closeBtn = document.getElementById('image-modal-close');
    const form = document.getElementById('image-form');

    window.openImageModal = (editImgObj = null) => {
        requireAdmin(() => {
            const filenameInput = document.getElementById('image-filename');
            const yearInput = document.getElementById('image-year');
            const titleInput = document.getElementById('image-title');
            const sortInput = document.getElementById('image-sort');
            const editIdInput = document.getElementById('image-edit-id');
            const title = document.getElementById('image-modal-title');
            const sortContainer = document.getElementById('image-sort-container');

            if(editImgObj) {
                filenameInput.value = editImgObj.filename;
                yearInput.value = editImgObj.year_text;
                titleInput.value = editImgObj.title_text;
                sortInput.value = editImgObj.sort_order;
                editIdInput.value = editImgObj.id;
                title.textContent = "Bild bearbeiten";
            } else {
                form.reset();
                editIdInput.value = '';
                sortInput.value = (galleryImages.length > 0 ? Math.max(...galleryImages.map(i => i.sort_order)) + 1 : 1);
                title.textContent = "Bild hinzufügen";
            }

            modal.classList.remove('hidden');
            setTimeout(() => {
                modal.classList.remove('opacity-0');
                modal.querySelector('div').classList.remove('scale-95');
                modal.querySelector('div').classList.add('scale-100');
            }, 10);
            document.body.style.overflow = 'hidden';
        });
    };

    const closeModal = () => {
        modal.classList.add('opacity-0');
        modal.querySelector('div').classList.remove('scale-100');
        modal.querySelector('div').classList.add('scale-95');
        setTimeout(() => {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }, 300);
    };

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const editId = document.getElementById('image-edit-id').value;
        const filename = document.getElementById('image-filename').value;
        const year = document.getElementById('image-year').value;
        const titleText = document.getElementById('image-title').value;
        const sortOrder = parseInt(document.getElementById('image-sort').value);
        
        const submitBtn = document.getElementById('image-submit-btn');
        const submitText = document.getElementById('img-submit-text');
        const submitSpinner = document.getElementById('img-submit-spinner');
        
        submitBtn.disabled = true;
        submitText.textContent = 'Speichert...';
        submitSpinner.classList.remove('hidden');

        try {
            if(editId) {
                const { error } = await supabaseClient.from('images').update({ filename: filename, year_text: year, title_text: titleText, sort_order: sortOrder }).eq('id', editId);
                if (error) throw error;
            } else {
                const { error } = await supabaseClient.from('images').insert([{ filename: filename, year_text: year, title_text: titleText, sort_order: sortOrder }]);
                if (error) throw error;
            }
            
            // Reload page to reflect changes
            window.location.reload();
            
        } catch (err) {
            console.error(err);
            alert("Fehler beim Speichern des Bildes.");
            submitBtn.disabled = false;
            submitText.textContent = 'Speichern';
            submitSpinner.classList.add('hidden');
        }
    });
};

// --- UI / Animations ---
const initScrollObserver = () => {
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('show');
        });
    }, observerOptions);

    // Initialisierung erfolgt nun im DOM nachdem fetch() durch ist. Da es async ist, 
    // brauchen wir eine regelmäßige Prüfung oder rufen es nach renderTimeline auf.
    // Ein MutationObserver ist robuster, wenn DOM sich ändert:
    const mo = new MutationObserver(() => {
        document.querySelectorAll('.scroll-reveal:not(.show)').forEach(item => {
            observer.observe(item);
        });
    });
    mo.observe(document.body, { childList: true, subtree: true });
};

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
