/**
 * ============================================================================
 * NOMAD RISE - Module Core : DOM et Utilitaires
 * ============================================================================
 * 
 * SOMMAIRE :
 * ---------------------------------------------------------------------------
 * 1. Sélection des Éléments DOM
 * 2. Classe de Notification
 * 3. Fonctions Utilitaires
 * 4. Export des Éléments
 * 
 * DESCRIPTION :
 * Ce module centralise la sélection des éléments DOM principaux et fournit
 * des utilitaires de base réutilisables dans tout le site.
 * 
 * ============================================================================
 */


/* ==========================================================================
   1. SÉLECTION DES ÉLÉMENTS DOM
   ==========================================================================
   Centralise tous les éléments DOM utilisés par les autres modules.
   Cela évite de rechercher les mêmes éléments plusieurs fois.
   ========================================================================== */

const DOM = {
    // Navigation
    navbar: document.getElementById('navbar'),
    mobileMenuBtn: document.getElementById('mobileMenuBtn'),
    navLinks: document.getElementById('navLinks'),
    
    // Boutons globaux
    backToTopBtn: document.getElementById('backToTop'),
    
    // Formulaires
    contactForm: document.getElementById('contactForm'),
    bookingForm: document.getElementById('bookingForm'),
    personalForm: document.getElementById('personalForm'),
    
    // Galerie
    galleryGrid: document.getElementById('gallery-grid'),
    galleryLoading: document.getElementById('gallery-loading'),
    galleryEmpty: document.getElementById('gallery-empty'),
    galleryLoadMore: document.getElementById('gallery-load-more'),
    loadMoreBtn: document.getElementById('load-more-btn'),
    filterBtns: document.querySelectorAll('.filter-btn'),
    filterIndicator: document.querySelector('.filter-indicator'),
    
    // Lightbox
    lightbox: document.getElementById('lightbox'),
    lightboxImg: document.getElementById('lightbox-img'),
    lightboxInfo: document.getElementById('lightbox-info'),
    lightboxCounter: document.getElementById('lightbox-counter'),
    lightboxClose: document.getElementById('lightbox-close'),
    lightboxPrev: document.getElementById('lightbox-prev'),
    lightboxNext: document.getElementById('lightbox-next'),
    
    // Réservation
    durationSelect: document.getElementById('bookingDuree'),
    focus30Checkboxes: document.querySelectorAll('input[name="focus30"]'),
    focus60Checkboxes: document.querySelectorAll('input[name="focus60"]')
};


/* ==========================================================================
   2. CLASSE DE NOTIFICATION
   ==========================================================================
   Système de notification toast pour afficher des messages à l'utilisateur.
   Types disponibles : success (vert), error (rouge), warning (orange), info (bleu)
   ========================================================================== */

const Notification = {
    /**
     * Affiche une notification à l'utilisateur
     * @param {string} message - Le message à afficher
     * @param {string} type - Le type de notification (success, error, warning, info)
     */
    show(message, type = 'info') {
        // Supprimer les notifications existantes
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();
        
        // Créer l'élément notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">×</button>
        `;
        
        // Définir les couleurs selon le type
        const colors = {
            success: '#22c55e',  // Vert
            error: '#ef4444',    // Rouge
            warning: '#f59e0b',  // Orange
            info: '#3b82f6'      // Bleu
        };
        
        // Appliquer les styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${colors[type] || colors.info};
            color: white;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 1rem;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        `;
        
        // Ajouter au DOM
        document.body.appendChild(notification);
        
        // Supprimer automatiquement après 5 secondes
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
};


/* ==========================================================================
   3. FONCTIONS UTILITAIRES
   ==========================================================================
   Fonctions réutilisables dans tout le site.
   ========================================================================== */

const Utils = {
    /**
     * Formater une date en français
     * @param {string} dateStr - La date en format ISO
     * @returns {string} La date formatée (ex: "15 janvier 2025")
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
     * Débounce une fonction pour éviter les appels trop fréquents
     * @param {Function} func - La fonction à débouncer
     * @param {number} wait - Le délai en millisecondes
     * @returns {Function} La fonction debouncée
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    /**
     * Scroll fluide vers un élément
     * @param {HTMLElement} target - L'élément cible
     * @param {number} offset - Décalage en pixels (pour le header fixe)
     */
    scrollTo(target, offset = 80) {
        if (!target) return;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
};


/* ==========================================================================
   4. INJECTION DES STYLES D'ANIMATION
   ==========================================================================
   Ajoute les keyframes CSS nécessaires pour les animations JS.
   ========================================================================== */

(function injectAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        .notification button {
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            line-height: 1;
        }
    `;
    document.head.appendChild(style);
})();


/* ==========================================================================
   5. EXPORT
   ==========================================================================
   Rendre les modules accessibles globalement.
   ========================================================================== */

// Exposer globalement pour les autres modules
window.NomadRise = window.NomadRise || {};
window.NomadRise.DOM = DOM;
window.NomadRise.Notification = Notification;
window.NomadRise.Utils = Utils;

// Fonction raccourcie pour les notifications
window.showNotification = Notification.show.bind(Notification);
