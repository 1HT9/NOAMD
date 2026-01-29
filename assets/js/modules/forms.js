/**
 * ============================================================================
 * NOMAD RISE - Module : Formulaires
 * ============================================================================
 * 
 * SOMMAIRE :
 * ---------------------------------------------------------------------------
 * 1. Formulaire de Contact
 * 2. Formulaire de Réservation (Booking)
 * 3. Formulaire Personnel (Page Réservation)
 * 4. Validation des Points de Focus
 * 5. Synchronisation Durée
 * 6. Initialisation
 * 
 * DESCRIPTION :
 * Gère toutes les soumissions de formulaires du site : contact, réservation,
 * et les validations associées (limite de sélection, champs requis...).
 * 
 * ============================================================================
 */


/* ==========================================================================
   1. FORMULAIRE DE CONTACT
   ==========================================================================
   Gère la soumission du formulaire de contact de la page principale.
   ========================================================================== */

function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Afficher l'état de chargement
        submitBtn.innerHTML = '<span class="loading"></span> Envoi...';
        submitBtn.disabled = true;

        try {
            // Simuler l'envoi (remplacer par un vrai appel API / EmailJS)
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Afficher le succès
            submitBtn.textContent = '✓ Message envoyé!';
            submitBtn.style.background = '#22c55e';
            submitBtn.style.color = '#ffffff';

            showNotification('Votre message a été envoyé avec succès!', 'success');

            // Réinitialiser le formulaire
            contactForm.reset();

            // Restaurer le bouton après 3 secondes
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.background = '';
                submitBtn.style.color = '';
                submitBtn.disabled = false;
            }, 3000);
            
        } catch (error) {
            submitBtn.textContent = 'Erreur - Réessayer';
            submitBtn.style.background = '#ef4444';
            showNotification('Erreur lors de l\'envoi. Veuillez réessayer.', 'error');
            
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 3000);
        }
    });
}


/* ==========================================================================
   2. FORMULAIRE DE RÉSERVATION (BOOKING)
   ==========================================================================
   Gère la soumission du formulaire de réservation intégré à la page Fit.
   ========================================================================== */

function initBookingForm() {
    const bookingForm = document.getElementById('bookingForm');
    
    if (!bookingForm) return;
    
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = bookingForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Récupérer les données du formulaire
        const formData = new FormData(bookingForm);
        const data = Object.fromEntries(formData.entries());
        
        // Récupérer les points de focus sélectionnés
        const duree = data.duree;
        let focusPoints = [];
        
        if (duree === '30') {
            const selected = document.querySelector('input[name="focus30"]:checked');
            if (selected) focusPoints.push(selected.value);
        } else if (duree === '60') {
            const selected = document.querySelectorAll('input[name="focus60"]:checked');
            selected.forEach(input => focusPoints.push(input.value));
        }
        
        // Valider les points de focus
        if (duree === '30' && focusPoints.length !== 1) {
            showNotification('Veuillez sélectionner 1 point à travailler pour la séance de 30 minutes.', 'error');
            return;
        }
        if (duree === '60' && focusPoints.length !== 2) {
            showNotification('Veuillez sélectionner 2 points à travailler pour la séance de 60 minutes.', 'error');
            return;
        }
        
        data.focusPoints = focusPoints;
        
        // Afficher l'état de chargement
        submitBtn.innerHTML = '<span class="loading"></span> Réservation...';
        submitBtn.disabled = true;

        try {
            // Simuler la soumission (remplacer par un vrai appel API / Google Calendar)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            console.log('Booking data:', data);
            
            // Afficher le succès
            submitBtn.textContent = '✓ Réservation confirmée!';
            submitBtn.style.background = '#22c55e';
            submitBtn.style.color = '#ffffff';
            
            showNotification(`Réservation confirmée! Un email a été envoyé à ${data.coach}.`, 'success');

            // Réinitialiser le formulaire
            bookingForm.reset();
            
            // Réinitialiser l'état visuel des checkboxes
            document.querySelectorAll('.focus-point').forEach(fp => {
                const input = fp.querySelector('input');
                if (input) input.checked = false;
            });

            // Restaurer le bouton après 3 secondes
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.background = '';
                submitBtn.style.color = '';
                submitBtn.disabled = false;
            }, 3000);
            
        } catch (error) {
            submitBtn.textContent = 'Erreur - Réessayer';
            submitBtn.style.background = '#ef4444';
            showNotification('Erreur lors de la réservation. Veuillez réessayer.', 'error');
            
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 3000);
        }
    });
}


/* ==========================================================================
   3. FORMULAIRE PERSONNEL (PAGE RÉSERVATION)
   ==========================================================================
   Gère la soumission du formulaire sur la page de réservation dédiée.
   ========================================================================== */

function initPersonalForm() {
    const personalForm = document.getElementById('personalForm');
    
    if (!personalForm) return;
    
    personalForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Collecter toutes les données
        const coach = document.querySelector('input[name="coach"]:checked')?.value;
        const heure = document.querySelector('input[name="heure"]:checked')?.value;
        const duree = document.querySelector('input[name="duree"]:checked')?.value;
        
        // Points de focus selon la durée
        const focusPoints = duree === '30' 
            ? [document.querySelector('input[name="focus30"]:checked')?.value].filter(Boolean)
            : Array.from(document.querySelectorAll('input[name="focus60"]:checked')).map(cb => cb.value);
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        data.coach = coach;
        data.heure = heure;
        data.duree = duree;
        data.focusPoints = focusPoints;
        
        // Validation
        if (!coach || !heure || !duree) {
            showNotification('Veuillez remplir tous les champs requis.', 'error');
            return;
        }
        
        if (duree === '30' && focusPoints.length !== 1) {
            showNotification('Veuillez sélectionner 1 compétence pour la séance de 1h.', 'error');
            return;
        }
        
        if (duree === '60' && focusPoints.length !== 2) {
            showNotification('Veuillez sélectionner 2 compétences pour la séance de 2h.', 'error');
            return;
        }
        
        // Afficher l'état de chargement
        submitBtn.innerHTML = '<span class="loading"></span> Réservation...';
        submitBtn.disabled = true;

        try {
            // Simuler la soumission
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            console.log('Réservation data:', data);
            showNotification('Réservation confirmée ! Un email de confirmation vous sera envoyé.', 'success');
            e.target.reset();
            
        } catch (error) {
            showNotification('Erreur lors de la réservation.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}


/* ==========================================================================
   4. VALIDATION DES POINTS DE FOCUS
   ==========================================================================
   Limite le nombre de points de focus sélectionnables pour la formule 60 min.
   ========================================================================== */

function initFocusPointsValidation() {
    const focus60Checkboxes = document.querySelectorAll('input[name="focus60"]');
    
    focus60Checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const checked = document.querySelectorAll('input[name="focus60"]:checked');
            if (checked.length > 2) {
                checkbox.checked = false;
                showNotification('Vous ne pouvez sélectionner que 2 points pour une séance de 60 minutes.', 'warning');
            }
        });
    });
}


/* ==========================================================================
   5. SYNCHRONISATION DURÉE
   ==========================================================================
   Synchronise la sélection de durée avec les options visuelles.
   ========================================================================== */

function initDurationSync() {
    const durationSelect = document.getElementById('bookingDuree');
    
    if (!durationSelect) return;
    
    durationSelect.addEventListener('change', (e) => {
        const option30 = document.getElementById('option30');
        const option60 = document.getElementById('option60');
        
        if (!option30 || !option60) return;
        
        if (e.target.value === '30') {
            option30.style.borderColor = 'var(--white)';
            option60.style.borderColor = 'var(--gray-700)';
        } else if (e.target.value === '60') {
            option30.style.borderColor = 'var(--gray-700)';
            option60.style.borderColor = 'var(--white)';
        } else {
            option30.style.borderColor = 'var(--gray-700)';
            option60.style.borderColor = 'var(--white)';
        }
    });
}


/* ==========================================================================
   6. INITIALISATION
   ==========================================================================
   Fonction principale qui initialise tous les formulaires.
   ========================================================================== */

function initForms() {
    initContactForm();
    initBookingForm();
    initPersonalForm();
    initFocusPointsValidation();
    initDurationSync();
}

// Initialiser au chargement du DOM
document.addEventListener('DOMContentLoaded', initForms);


/* ==========================================================================
   EXPORT
   ==========================================================================
   Rendre les fonctions accessibles globalement si nécessaire.
   ========================================================================== */

window.NomadRise = window.NomadRise || {};
window.NomadRise.Forms = {
    init: initForms,
    initContact: initContactForm,
    initBooking: initBookingForm,
    initPersonal: initPersonalForm
};
