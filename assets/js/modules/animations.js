/**
 * ============================================================================
 * NOMAD RISE - Module : Animations
 * ============================================================================
 * 
 * SOMMAIRE :
 * ---------------------------------------------------------------------------
 * 1. Animation au Scroll (Intersection Observer)
 * 2. Animation des Compteurs
 * 3. Initialisation
 * 
 * DESCRIPTION :
 * Gère les animations déclenchées par le scroll et les animations de compteurs.
 * Utilise l'API Intersection Observer pour de meilleures performances.
 * 
 * ============================================================================
 */


/* ==========================================================================
   1. ANIMATION AU SCROLL (INTERSECTION OBSERVER)
   ==========================================================================
   Déclenche des animations quand les éléments entrent dans le viewport.
   Utilise la classe 'scroll-animate' et 'visible'.
   ========================================================================== */

/**
 * Configuration de l'observer
 */
const observerOptions = {
    root: null,           // Utilise le viewport
    rootMargin: '0px',    // Pas de marge supplémentaire
    threshold: 0.1        // Déclenche quand 10% de l'élément est visible
};

/**
 * Callback appelé quand un élément entre/sort du viewport
 */
const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Ajouter la classe visible pour déclencher l'animation
            entry.target.classList.add('visible');
            // Arrêter d'observer cet élément (animation unique)
            observer.unobserve(entry.target);
        }
    });
};

// Créer l'observer
const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);

/**
 * Initialise les animations au scroll
 * Ajoute la classe scroll-animate aux éléments et les observe
 */
function initScrollAnimations() {
    // Sélectionner tous les éléments à animer
    const animateElements = document.querySelectorAll(
        '.service-card, .camp-feature, .camp-feature-card, .coach-card, ' +
        '.option-card, .timeline-item, .benefit, .tour-benefit, .gallery-item'
    );
    
    // Ajouter la classe et observer chaque élément
    animateElements.forEach((el, index) => {
        el.classList.add('scroll-animate');
        // Délai progressif pour effet cascade
        el.style.transitionDelay = `${index * 0.05}s`;
        scrollObserver.observe(el);
    });
}


/* ==========================================================================
   2. ANIMATION DES COMPTEURS
   ==========================================================================
   Anime les nombres (statistiques) de 0 à leur valeur finale.
   ========================================================================== */

/**
 * Anime un compteur de 0 à la valeur cible
 * @param {HTMLElement} element - L'élément contenant le nombre
 * @param {number} target - La valeur cible
 * @param {number} duration - Durée de l'animation en ms
 */
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16); // ~60fps
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            // Animation terminée
            element.textContent = target + (element.dataset.suffix || '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + (element.dataset.suffix || '');
        }
    }, 16); // ~60fps
}

/**
 * Observer pour les compteurs
 * Déclenche l'animation quand les stats sont visibles
 */
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = entry.target;
            const value = target.textContent;
            // Extraire la valeur numérique (ignorer +, %, etc.)
            const numericValue = parseInt(value.replace(/\D/g, ''));
            
            if (numericValue) {
                // Sauvegarder le suffixe (%, +, etc.)
                target.dataset.suffix = value.replace(/[\d.]/g, '');
                // Lancer l'animation
                animateCounter(target, numericValue);
            }
            // Arrêter d'observer
            statsObserver.unobserve(target);
        }
    });
}, { threshold: 0.5 }); // Déclenche quand 50% est visible

/**
 * Initialise les animations de compteurs
 */
function initCounterAnimations() {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => statsObserver.observe(stat));
}


/* ==========================================================================
   3. INITIALISATION
   ==========================================================================
   Fonction principale qui initialise toutes les animations.
   ========================================================================== */

function initAnimations() {
    initScrollAnimations();
    initCounterAnimations();
    
    // Ajouter la classe 'loaded' au body pour les animations initiales
    document.body.classList.add('loaded');
}

// Initialiser au chargement du DOM
document.addEventListener('DOMContentLoaded', initAnimations);


/* ==========================================================================
   EXPORT
   ==========================================================================
   Rendre les fonctions accessibles globalement si nécessaire.
   ========================================================================== */

window.NomadRise = window.NomadRise || {};
window.NomadRise.Animations = {
    init: initAnimations,
    initScroll: initScrollAnimations,
    initCounters: initCounterAnimations,
    animateCounter: animateCounter
};
