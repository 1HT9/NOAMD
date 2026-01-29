/**
 * ============================================================================
 * NOMAD RISE - Module : Navigation
 * ============================================================================
 * 
 * SOMMAIRE :
 * ---------------------------------------------------------------------------
 * 1. Effet de Scroll sur la Navbar
 * 2. Menu Mobile
 * 3. Scroll Fluide
 * 4. Lien Actif selon la Section
 * 5. Bouton Retour en Haut
 * 6. Initialisation
 * 
 * DESCRIPTION :
 * Gère tous les comportements liés à la navigation : effet de scroll,
 * menu mobile, défilement fluide et mise à jour du lien actif.
 * 
 * ============================================================================
 */


/* ==========================================================================
   1. EFFET DE SCROLL SUR LA NAVBAR
   ==========================================================================
   Ajoute une classe 'scrolled' à la navbar quand l'utilisateur défile.
   Cela permet d'appliquer un style différent (fond plus sombre, ombre...).
   ========================================================================== */

function initScrollEffect() {
    const navbar = document.getElementById('navbar');
    const backToTopBtn = document.getElementById('backToTop');
    
    if (!navbar) return;
    
    window.addEventListener('scroll', () => {
        // Ajouter/retirer la classe scrolled à 50px de scroll
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Afficher/masquer le bouton retour en haut à 500px
        if (backToTopBtn) {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }

        // Mettre à jour le lien actif dans la navigation
        updateActiveNavLink();
    });
}


/* ==========================================================================
   2. MENU MOBILE
   ==========================================================================
   Gère l'ouverture et la fermeture du menu hamburger sur mobile.
   ========================================================================== */

function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    const body = document.body;
    const html = document.documentElement;
    
    if (!mobileMenuBtn || !navLinks) return;
    
    function openMenu() {
        mobileMenuBtn.classList.add('active');
        navLinks.classList.add('active');
        body.style.overflow = 'hidden';
        html.style.overflow = 'hidden';
    }
    
    function closeMenu() {
        mobileMenuBtn.classList.remove('active');
        navLinks.classList.remove('active');
        body.style.overflow = '';
        html.style.overflow = '';
    }
    
    // Toggle du menu au clic sur le bouton hamburger
    mobileMenuBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (navLinks.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Fermer le menu quand on clique sur un lien
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });
    
    // Fermer le menu quand on clique en dehors (sur l'overlay)
    navLinks.addEventListener('click', (e) => {
        if (e.target === navLinks) {
            closeMenu();
        }
    });
    
    // Fermer le menu avec la touche Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // Fermer le menu lors du redimensionnement si on passe en desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 900 && navLinks.classList.contains('active')) {
            closeMenu();
        }
    });
}


/* ==========================================================================
   3. SCROLL FLUIDE
   ==========================================================================
   Permet un défilement fluide vers les ancres de la page.
   Tient compte du header fixe avec un offset.
   ========================================================================== */

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                const headerOffset = 80; // Hauteur du header fixe
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}


/* ==========================================================================
   4. LIEN ACTIF SELON LA SECTION
   ==========================================================================
   Met à jour le lien actif dans la navigation selon la section visible.
   Utilise la position de scroll pour déterminer quelle section est active.
   ========================================================================== */

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        // Si on est dans cette section
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            // Retirer la classe active de tous les liens
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
                // Ajouter la classe active au lien correspondant
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}


/* ==========================================================================
   5. BOUTON RETOUR EN HAUT
   ==========================================================================
   Gère le clic sur le bouton pour remonter en haut de la page.
   ========================================================================== */

function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (!backToTopBtn) return;
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}


/* ==========================================================================
   6. INITIALISATION
   ==========================================================================
   Fonction principale qui initialise tous les composants de navigation.
   ========================================================================== */

function initNavigation() {
    initScrollEffect();
    initMobileMenu();
    initSmoothScroll();
    initBackToTop();
}

// Initialiser au chargement du DOM
document.addEventListener('DOMContentLoaded', initNavigation);


/* ==========================================================================
   EXPORT
   ==========================================================================
   Rendre les fonctions accessibles globalement si nécessaire.
   ========================================================================== */

window.NomadRise = window.NomadRise || {};
window.NomadRise.Navigation = {
    init: initNavigation,
    updateActiveLink: updateActiveNavLink
};
