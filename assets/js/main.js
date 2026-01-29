/**
 * ============================================================================
 * NOMAD RISE - Fichier JavaScript Principal
 * ============================================================================
 * 
 * Ce fichier charge tous les modules JavaScript du site.
 * Il sert de point d'entrée unique pour les scripts.
 * 
 * SOMMAIRE DES MODULES :
 * ---------------------------------------------------------------------------
 * 1. Core - DOM et Utilitaires de base
 * 2. Navigation - Menu, scroll, liens actifs
 * 3. Formulaires - Contact, réservation, validation
 * 4. Galerie - Photos, filtres, lightbox
 * 5. Animations - Scroll animations, compteurs
 * 
 * ARCHITECTURE :
 * Le site utilise une architecture modulaire où chaque module est autonome
 * et gère une fonctionnalité spécifique. Tous les modules sont attachés
 * à l'objet global window.NomadRise pour faciliter le débogage.
 * 
 * ============================================================================
 */


/* ==========================================================================
   CHARGEMENT DES MODULES
   ==========================================================================
   Les modules sont chargés via des balises <script> dans le HTML.
   Ce fichier sert de point de documentation et d'initialisation finale.
   ========================================================================== */

// Note : Les modules sont chargés individuellement dans le HTML :
// - assets/js/core/dom.js       (éléments DOM et utilitaires)
// - assets/js/modules/navbar.js (navigation)
// - assets/js/modules/forms.js  (formulaires)
// - assets/js/modules/gallery.js (galerie photos)
// - assets/js/modules/animations.js (animations)


/* ==========================================================================
   INITIALISATION PRINCIPALE
   ==========================================================================
   Cette fonction est appelée une fois que tous les modules sont chargés.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Log de bienvenue dans la console
    console.log('%c🏀 NOMAD RISE', 'font-size: 24px; font-weight: bold; color: #ffffff; background: #000; padding: 10px 20px;');
    console.log('%c   Coaching Basketball Premium', 'font-size: 14px; color: #888;');
    console.log('');
    console.log('📦 Modules chargés :');
    console.log('   ├── Core (DOM, Utils, Notifications)');
    console.log('   ├── Navigation (Menu, Scroll, Liens actifs)');
    console.log('   ├── Forms (Contact, Réservation, Validation)');
    console.log('   ├── Gallery (Photos, Filtres, Lightbox)');
    console.log('   └── Animations (Scroll, Compteurs)');
    console.log('');
    console.log('✅ Site initialisé avec succès !');
});


/* ==========================================================================
   GESTIONNAIRE D'ERREURS GLOBAL
   ==========================================================================
   Capture les erreurs JavaScript non gérées pour le débogage.
   ========================================================================== */

window.addEventListener('error', (event) => {
    console.error('❌ Erreur JavaScript :', event.message);
    console.error('   Fichier :', event.filename);
    console.error('   Ligne :', event.lineno);
});


/* ==========================================================================
   API PUBLIQUE
   ==========================================================================
   Expose une API propre pour interagir avec le site depuis la console.
   ========================================================================== */

window.NomadRise = window.NomadRise || {};

// Version du site
window.NomadRise.version = '2.0.0';

// Méthode pour afficher les infos de debug
window.NomadRise.debug = function() {
    console.log('=== NOMAD RISE DEBUG INFO ===');
    console.log('Version:', this.version);
    console.log('Modules:', Object.keys(this).filter(k => k !== 'version' && k !== 'debug'));
    console.log('DOM éléments:', this.DOM ? Object.keys(this.DOM).length : 0);
    return this;
};
