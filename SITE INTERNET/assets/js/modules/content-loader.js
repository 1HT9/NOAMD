/**
 * ============================================================================
 * NOMAD RISE - Module : Chargement du Contenu CMS
 * ============================================================================
 * 
 * DESCRIPTION :
 * Ce module charge le contenu depuis les fichiers JSON générés par Decap CMS
 * et l'injecte dynamiquement dans le HTML.
 * 
 * ============================================================================
 */

const ContentLoader = {
    
    // Cache pour stocker le contenu chargé
    cache: {},
    
    /**
     * Charger un fichier JSON
     * @param {string} path - Chemin vers le fichier JSON
     * @returns {Promise<Object>} - Contenu du fichier
     */
    async load(path) {
        // Vérifier le cache
        if (this.cache[path]) {
            return this.cache[path];
        }
        
        try {
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`Erreur chargement: ${path}`);
            }
            const data = await response.json();
            this.cache[path] = data;
            return data;
        } catch (error) {
            console.warn(`ContentLoader: ${error.message}`);
            return null;
        }
    },
    
    /**
     * Charger et appliquer le contenu de la page d'accueil
     */
    async loadHome() {
        const data = await this.load('/content/pages/home.json');
        if (!data) return;
        
        // Badge
        const badge = document.querySelector('.hero-badge');
        if (badge) badge.textContent = data.badge;
        
        // Titre
        const h1 = document.querySelector('.hero-content-centered h1');
        if (h1) {
            h1.innerHTML = `${data.title_line1}<br><span class="gradient-text">${data.title_line2}</span>`;
        }
        
        // Sous-titre
        const subtitle = document.querySelector('.hero-subtitle');
        if (subtitle) subtitle.textContent = data.subtitle;
        
        // Boutons CTA
        const buttons = document.querySelectorAll('.hero-buttons .btn');
        if (buttons[0] && data.cta_primary) {
            buttons[0].textContent = data.cta_primary.text;
            buttons[0].href = data.cta_primary.link;
        }
        if (buttons[1] && data.cta_secondary) {
            buttons[1].textContent = data.cta_secondary.text;
            buttons[1].href = data.cta_secondary.link;
        }
    },
    
    /**
     * Charger et appliquer les paramètres généraux
     */
    async loadSettings() {
        const data = await this.load('/content/settings/general.json');
        if (!data) return;
        
        // Logo
        const logos = document.querySelectorAll('.logo-img');
        logos.forEach(logo => {
            if (data.logo) logo.src = data.logo;
        });
        
        // Contact
        if (data.contact) {
            const emailEl = document.querySelector('.contact-method .method-info span');
            // Appliquer les infos de contact si les éléments existent
        }
    },
    
    /**
     * Charger le contenu Rise Camp
     */
    async loadCamp() {
        const data = await this.load('/content/pages/camp.json');
        if (!data) return;
        
        // Titre
        const title = document.querySelector('#camp .camp-header h2');
        if (title && data.title) {
            const parts = data.title.split(',');
            if (parts.length > 1) {
                title.innerHTML = `${parts[0]},${parts[1]}, <span class="gradient-text">${parts[2] || ''}</span>`;
            }
        }
        
        // Sous-titre
        const subtitle = document.querySelector('.camp-subtitle');
        if (subtitle && data.subtitle) subtitle.textContent = data.subtitle;
        
        // Image
        const image = document.querySelector('.camp-main-image');
        if (image && data.image) image.src = data.image;
        
        // Statistiques
        if (data.stats) {
            const statItems = document.querySelectorAll('.camp-stat-item');
            data.stats.forEach((stat, i) => {
                if (statItems[i]) {
                    statItems[i].querySelector('.stat-number').textContent = stat.number;
                    statItems[i].querySelector('.stat-label').textContent = stat.label;
                }
            });
        }
        
        // Features
        if (data.features) {
            const featureCards = document.querySelectorAll('.camp-feature-card');
            data.features.forEach((feature, i) => {
                if (featureCards[i]) {
                    featureCards[i].querySelector('.feature-card-icon span').textContent = feature.icon;
                    featureCards[i].querySelector('h4').textContent = feature.title;
                    featureCards[i].querySelector('p').textContent = feature.description;
                }
            });
        }
        
        // Sessions
        if (data.sessions) {
            const sessionsList = document.querySelector('.sessions-list');
            if (sessionsList) {
                sessionsList.innerHTML = data.sessions.map(session => `
                    <a href="${session.link}" class="session-chip session-chip-link">
                        <span class="chip-dot"></span>${session.name}
                    </a>
                `).join('');
            }
        }
    },
    
    /**
     * Charger le contenu Rise Fit
     */
    async loadFit() {
        const data = await this.load('/content/pages/fit.json');
        if (!data) return;
        
        // Slogan
        const title = document.querySelector('#fit .section-header h2');
        if (title && data.slogan) {
            title.innerHTML = `"${data.slogan.split(',')[0]}, <span class="gradient-text">${data.slogan.split(',')[1] || ''}"</span>`;
        }
        
        // Introduction
        const intro = document.querySelector('.fit-intro');
        if (intro && data.intro) intro.textContent = data.intro;
        
        // Objectif
        const objective = document.querySelector('.fit-objective p');
        if (objective && data.objective) {
            objective.innerHTML = `<strong>Objectif :</strong> ${data.objective}`;
        }
        
        // Avantages
        if (data.benefits) {
            const benefitCards = document.querySelectorAll('.fit-benefit-card');
            data.benefits.forEach((benefit, i) => {
                if (benefitCards[i]) {
                    benefitCards[i].querySelector('.fit-benefit-icon').textContent = benefit.icon;
                    benefitCards[i].querySelector('h3').textContent = benefit.title;
                    benefitCards[i].querySelector('p').textContent = benefit.description;
                }
            });
        }
        
        // Horaire
        const schedule = document.querySelector('.schedule-text');
        if (schedule && data.schedule) schedule.textContent = data.schedule;
    },
    
    /**
     * Charger le contenu Rise Tour
     */
    async loadTour() {
        const data = await this.load('/content/pages/tour.json');
        if (!data) return;
        
        // Introduction
        const intro = document.querySelector('.tour-intro-text');
        if (intro && data.intro) intro.textContent = data.intro;
        
        // Dates de détection
        if (data.detection_dates) {
            const datesContainer = document.querySelector('.detection-dates');
            if (datesContainer) {
                datesContainer.innerHTML = data.detection_dates.map(date => `
                    <div class="detection-date">
                        <span class="detection-month">${date.month}</span>
                        <span class="detection-info">${date.info}</span>
                    </div>
                `).join('');
            }
        }
        
        // Tournois
        if (data.tournaments) {
            const grid = document.querySelector('.timeline-grid');
            if (grid) {
                grid.innerHTML = data.tournaments.map(t => `
                    <div class="timeline-item">
                        <div class="timeline-date">
                            <span class="month">${t.month}</span>
                            <span class="year">${t.year}</span>
                        </div>
                        <div class="timeline-content">
                            <div class="location-flag">${t.flag}</div>
                            <h3>${t.city}</h3>
                            <p>${t.country}</p>
                            <span class="tour-status upcoming">${t.status}</span>
                        </div>
                    </div>
                `).join('');
            }
        }
    },
    
    /**
     * Initialiser le chargement de tout le contenu
     */
    async init() {
        console.log('📦 ContentLoader: Chargement du contenu CMS...');
        
        await Promise.all([
            this.loadSettings(),
            this.loadHome(),
            this.loadCamp(),
            this.loadFit(),
            this.loadTour()
        ]);
        
        console.log('✅ ContentLoader: Contenu chargé avec succès');
    }
};

// Initialiser au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    ContentLoader.init();
});

// Export
window.ContentLoader = ContentLoader;
