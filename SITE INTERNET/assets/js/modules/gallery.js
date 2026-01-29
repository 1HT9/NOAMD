/**
 * ============================================================================
 * NOMAD RISE - Module : Galerie Photos
 * ============================================================================
 * 
 * SOMMAIRE :
 * ---------------------------------------------------------------------------
 * 1. Configuration
 * 2. Éléments DOM
 * 3. Chargement des Photos
 * 4. Filtrage par Catégorie
 * 5. Rendu de la Grille
 * 6. Lightbox (Visionneuse)
 * 7. Navigation Lightbox
 * 8. Événements
 * 9. Initialisation
 * 
 * DESCRIPTION :
 * Gère toute la logique de la galerie photos : chargement depuis JSON,
 * filtrage par catégorie, affichage en grille et visionneuse lightbox.
 * 
 * ============================================================================
 */


/* ==========================================================================
   OBJET GESTIONNAIRE DE GALERIE
   ==========================================================================
   Singleton qui centralise toute la logique de la galerie.
   ========================================================================== */

const GalleryManager = {
    
    /* ======================================================================
       1. CONFIGURATION
       ======================================================================
       Paramètres de la galerie.
       ====================================================================== */
    
    // Données des photos
    photos: [],
    filteredPhotos: [],
    
    // État actuel
    currentFilter: 'all',
    photosPerPage: 12,
    currentPage: 1,
    lightboxIndex: 0,

    
    /* ======================================================================
       2. ÉLÉMENTS DOM
       ======================================================================
       Références aux éléments du DOM utilisés par la galerie.
       ====================================================================== */
    
    elements: {
        grid: null,
        loading: null,
        empty: null,
        loadMore: null,
        loadMoreBtn: null,
        filterBtns: null,
        filterIndicator: null,
        lightbox: null,
        lightboxImg: null,
        lightboxInfo: null,
        lightboxCounter: null
    },

    
    /* ======================================================================
       3. INITIALISATION
       ======================================================================
       Point d'entrée de la galerie.
       ====================================================================== */
    
    init() {
        // Récupérer les éléments DOM
        this.elements.grid = document.getElementById('gallery-grid');
        this.elements.loading = document.getElementById('gallery-loading');
        this.elements.empty = document.getElementById('gallery-empty');
        this.elements.loadMore = document.getElementById('gallery-load-more');
        this.elements.loadMoreBtn = document.getElementById('load-more-btn');
        this.elements.filterBtns = document.querySelectorAll('.filter-btn');
        this.elements.filterIndicator = document.querySelector('.filter-indicator');
        this.elements.lightbox = document.getElementById('lightbox');
        this.elements.lightboxImg = document.getElementById('lightbox-img');
        this.elements.lightboxInfo = document.getElementById('lightbox-info');
        this.elements.lightboxCounter = document.getElementById('lightbox-counter');

        // Vérifier si les éléments de la galerie existent
        if (!this.elements.grid) return;

        // Attacher les événements
        this.bindEvents();
        
        // Initialiser la position de l'indicateur de filtre
        this.updateFilterIndicator();

        // Charger les photos
        this.loadPhotos();
    },

    
    /* ======================================================================
       4. CHARGEMENT DES PHOTOS
       ======================================================================
       Charge les photos depuis le fichier JSON.
       ====================================================================== */
    
    async loadPhotos() {
        this.showLoading(true);
        
        try {
            const response = await fetch('photos.json');
            if (!response.ok) throw new Error('Échec du chargement des photos');
            
            const data = await response.json();
            this.photos = data.photos || [];
            
            // Trier par date (plus récentes en premier)
            this.photos.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            // Appliquer le filtre initial
            this.applyFilter();
            
        } catch (error) {
            console.error('Erreur lors du chargement de la galerie:', error);
            this.showEmpty();
        } finally {
            this.showLoading(false);
        }
    },

    /**
     * Affiche ou masque l'état de chargement
     * @param {boolean} show - Afficher ou non
     */
    showLoading(show) {
        if (this.elements.loading) {
            this.elements.loading.style.display = show ? 'flex' : 'none';
        }
        if (this.elements.grid) {
            this.elements.grid.classList.toggle('loading', show);
        }
    },

    /**
     * Affiche l'état vide (aucune photo)
     */
    showEmpty() {
        if (this.elements.empty) {
            this.elements.empty.style.display = 'block';
        }
        if (this.elements.grid) {
            this.elements.grid.innerHTML = '';
        }
        if (this.elements.loadMore) {
            this.elements.loadMore.style.display = 'none';
        }
    },

    
    /* ======================================================================
       5. FILTRAGE PAR CATÉGORIE
       ======================================================================
       Gère le filtrage des photos par catégorie (camps, tournois, coaching).
       ====================================================================== */
    
    /**
     * Définit le filtre actif
     * @param {string} filter - Le nom du filtre (all, camps, tournois, coaching)
     */
    setFilter(filter) {
        this.currentFilter = filter;
        this.currentPage = 1;
        
        // Mettre à jour l'état des boutons
        this.elements.filterBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        
        // Mettre à jour la position de l'indicateur
        this.updateFilterIndicator();
        
        // Appliquer le filtre
        this.applyFilter();
    },
    
    /**
     * Met à jour la position de l'indicateur animé
     */
    updateFilterIndicator() {
        const activeBtn = document.querySelector('.filter-btn.active');
        const indicator = this.elements.filterIndicator;
        
        if (activeBtn && indicator) {
            const track = document.querySelector('.filter-track');
            const trackRect = track.getBoundingClientRect();
            const btnRect = activeBtn.getBoundingClientRect();
            
            indicator.style.width = btnRect.width + 'px';
            indicator.style.left = (btnRect.left - trackRect.left) + 'px';
        }
    },

    /**
     * Applique le filtre actuel aux photos
     */
    applyFilter() {
        if (this.currentFilter === 'all') {
            this.filteredPhotos = [...this.photos];
        } else {
            this.filteredPhotos = this.photos.filter(photo => photo.category === this.currentFilter);
        }
        
        // Si aucune photo après filtrage
        if (this.filteredPhotos.length === 0) {
            this.showEmpty();
            return;
        }
        
        // Masquer l'état vide
        if (this.elements.empty) {
            this.elements.empty.style.display = 'none';
        }
        
        // Afficher les photos
        this.renderPhotos();
    },

    
    /* ======================================================================
       6. RENDU DE LA GRILLE
       ======================================================================
       Génère le HTML de la grille de photos.
       ====================================================================== */
    
    /**
     * Affiche les photos dans la grille
     */
    renderPhotos() {
        const endIndex = this.currentPage * this.photosPerPage;
        const photosToShow = this.filteredPhotos.slice(0, endIndex);
        
        // Générer le HTML de chaque photo
        this.elements.grid.innerHTML = photosToShow.map((photo, index) => `
            <div class="gallery-item" data-index="${index}" onclick="GalleryManager.openLightbox(${index})">
                <img src="${photo.url}" alt="${photo.event || 'Nomad Rise'}" loading="lazy">
                <div class="gallery-item-overlay">
                    <div class="gallery-item-info">
                        <h4>${photo.event || 'Nomad Rise'}</h4>
                        <span>${this.formatDate(photo.date)} • ${this.getCategoryLabel(photo.category)}</span>
                    </div>
                </div>
                <div class="gallery-item-zoom">
                    <i class="fas fa-expand"></i>
                </div>
            </div>
        `).join('');
        
        // Afficher/masquer le bouton "Voir plus"
        const hasMore = endIndex < this.filteredPhotos.length;
        if (this.elements.loadMore) {
            this.elements.loadMore.style.display = hasMore ? 'flex' : 'none';
        }
    },

    /**
     * Charge plus de photos (pagination)
     */
    loadMorePhotos() {
        this.currentPage++;
        this.renderPhotos();
    },

    
    /* ======================================================================
       7. FONCTIONS UTILITAIRES
       ======================================================================
       Fonctions d'aide pour le formatage.
       ====================================================================== */
    
    /**
     * Formate une date pour l'affichage
     * @param {string} dateStr - Date en format ISO
     * @returns {string} Date formatée en français
     */
    formatDate(dateStr) {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('fr-FR', { 
            day: 'numeric',
            month: 'long', 
            year: 'numeric' 
        });
    },

    /**
     * Retourne le libellé français d'une catégorie
     * @param {string} category - Code de la catégorie
     * @returns {string} Libellé en français
     */
    getCategoryLabel(category) {
        const labels = {
            'camps': 'Camp',
            'tournois': 'Tournoi',
            'coaching': 'Coaching'
        };
        return labels[category] || category;
    },

    
    /* ======================================================================
       8. LIGHTBOX (VISIONNEUSE)
       ======================================================================
       Gère l'affichage plein écran des photos.
       ====================================================================== */
    
    /**
     * Ouvre la lightbox avec une photo
     * @param {number} index - Index de la photo dans filteredPhotos
     */
    openLightbox(index) {
        this.lightboxIndex = index;
        const photo = this.filteredPhotos[index];
        
        if (!photo || !this.elements.lightbox) return;
        
        // Définir l'image
        this.elements.lightboxImg.src = photo.url;
        this.elements.lightboxImg.alt = photo.event || 'Nomad Rise';
        
        // Définir les informations
        if (this.elements.lightboxInfo) {
            this.elements.lightboxInfo.innerHTML = `
                <h4>${photo.event || 'Nomad Rise'}</h4>
                <span>${this.formatDate(photo.date)} • ${this.getCategoryLabel(photo.category)}</span>
            `;
        }
        
        // Définir le compteur
        if (this.elements.lightboxCounter) {
            this.elements.lightboxCounter.textContent = `${index + 1} / ${this.filteredPhotos.length}`;
        }
        
        // Afficher la lightbox
        this.elements.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Empêcher le scroll
    },

    /**
     * Ferme la lightbox
     */
    closeLightbox() {
        if (this.elements.lightbox) {
            this.elements.lightbox.classList.remove('active');
            document.body.style.overflow = ''; // Restaurer le scroll
        }
    },

    /**
     * Photo précédente dans la lightbox
     */
    prevPhoto() {
        const newIndex = this.lightboxIndex > 0 
            ? this.lightboxIndex - 1 
            : this.filteredPhotos.length - 1; // Boucle vers la fin
        this.openLightbox(newIndex);
    },

    /**
     * Photo suivante dans la lightbox
     */
    nextPhoto() {
        const newIndex = this.lightboxIndex < this.filteredPhotos.length - 1 
            ? this.lightboxIndex + 1 
            : 0; // Boucle vers le début
        this.openLightbox(newIndex);
    },

    
    /* ======================================================================
       9. ÉVÉNEMENTS
       ======================================================================
       Attache tous les gestionnaires d'événements.
       ====================================================================== */
    
    bindEvents() {
        // Boutons de filtre
        this.elements.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.setFilter(btn.dataset.filter);
            });
        });

        // Bouton "Voir plus"
        if (this.elements.loadMoreBtn) {
            this.elements.loadMoreBtn.addEventListener('click', () => {
                this.loadMorePhotos();
            });
        }

        // Contrôles de la lightbox
        if (this.elements.lightbox) {
            // Bouton fermer
            document.getElementById('lightbox-close')?.addEventListener('click', () => this.closeLightbox());
            
            // Boutons précédent/suivant
            document.getElementById('lightbox-prev')?.addEventListener('click', () => this.prevPhoto());
            document.getElementById('lightbox-next')?.addEventListener('click', () => this.nextPhoto());

            // Fermer au clic sur le fond
            this.elements.lightbox.addEventListener('click', (e) => {
                if (e.target === this.elements.lightbox) {
                    this.closeLightbox();
                }
            });

            // Navigation au clavier
            document.addEventListener('keydown', (e) => {
                if (!this.elements.lightbox.classList.contains('active')) return;
                
                switch(e.key) {
                    case 'Escape':
                        this.closeLightbox();
                        break;
                    case 'ArrowLeft':
                        this.prevPhoto();
                        break;
                    case 'ArrowRight':
                        this.nextPhoto();
                        break;
                }
            });
        }
        
        // Mettre à jour l'indicateur au redimensionnement
        window.addEventListener('resize', () => {
            this.updateFilterIndicator();
        });
    }
};


/* ==========================================================================
   INITIALISATION AU CHARGEMENT DU DOM
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    GalleryManager.init();
});


/* ==========================================================================
   EXPORT
   ==========================================================================
   Rendre le gestionnaire accessible globalement pour les événements onclick.
   ========================================================================== */

window.GalleryManager = GalleryManager;
