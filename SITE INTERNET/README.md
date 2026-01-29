²# 🏀 NOMAD RISE - Site Web

Site web officiel de Nomad Rise, coaching basketball premium.

---

## 📁 Structure du Projet

```
SITE INTERNET/
│
├── 📄 index.html              # Page d'accueil principale
├── 📄 reservation.html        # Page de réservation
├── 📄 photos.json             # Données des photos de la galerie
├── 📄 README.md               # Ce fichier
│
├── 📂 assets/                 # Ressources statiques
│   │
│   ├── 📂 css/               # Feuilles de style
│   │   ├── 📄 main.css       # Point d'entrée (importe tous les CSS)
│   │   ├── 📄 base.css       # Variables, reset, typographie
│   │   ├── 📄 components.css # Composants réutilisables
│   │   │
│   │   └── 📂 pages/         # Styles par section/page
│   │       ├── 📄 home.css         # Section Hero
│   │       ├── 📄 services.css     # Vue d'ensemble services
│   │       ├── 📄 rise-camp.css    # Section RISE CAMP
│   │       ├── 📄 rise-fit.css     # Section RISE FIT
│   │       ├── 📄 rise-tour.css    # Section RISE TOUR
│   │       ├── 📄 galerie.css      # Section Galerie
│   │       ├── 📄 contact.css      # Section Contact + Footer
│   │       └── 📄 reservation.css  # Page Réservation
│   │
│   ├── 📂 js/                # Scripts JavaScript
│   │   ├── 📄 main.js        # Point d'entrée principal
│   │   │
│   │   ├── 📂 core/          # Modules fondamentaux
│   │   │   └── 📄 dom.js     # Éléments DOM, Notifications, Utils
│   │   │
│   │   ├── 📂 modules/       # Modules fonctionnels
│   │   │   ├── 📄 navbar.js      # Navigation, menu mobile
│   │   │   ├── 📄 forms.js       # Formulaires (contact, réservation)
│   │   │   ├── 📄 gallery.js     # Galerie photos, lightbox
│   │   │   └── 📄 animations.js  # Animations au scroll, compteurs
│   │   │
│   │   └── 📂 pages/         # Scripts spécifiques aux pages
│   │       └── (vide pour l'instant)
│   │
│   └── 📂 img/               # Images
│       ├── 📂 photos/        # Photos de la galerie
│       │   ├── 📂 camps/     # Photos des camps
│       │   ├── 📂 coaching/  # Photos de coaching
│       │   └── 📂 tournois/  # Photos des tournois
│       │
│       └── 📂 ui/            # Images de l'interface
│           └── 📂 icons/     # Icônes
│
├── 📂 data/                   # Fichiers de données
│   ├── 📄 site.json          # Configuration du site
│   └── 📂 photos/            # (réservé pour données photos)
│
├── 📂 img/                    # Dossier images original (legacy)
├── 📂 photos/                 # Dossier photos original (legacy)
│
└── 📄 generate-photos.js      # Script de génération photos.json
```

---

## 🎨 Architecture CSS

### Fichiers de Base

| Fichier | Description |
|---------|-------------|
| `base.css` | Variables CSS, reset navigateur, typographie, utilitaires |
| `components.css` | Composants réutilisables (boutons, nav, formulaires, cartes) |
| `main.css` | Fichier principal qui importe tous les autres |

### Fichiers par Page

| Fichier | Section |
|---------|---------|
| `home.css` | Section Hero (bannière principale) |
| `services.css` | Vue d'ensemble des 3 services |
| `rise-camp.css` | Section RISE CAMP (stages) |
| `rise-fit.css` | Section RISE FIT (coaching individuel) |
| `rise-tour.css` | Section RISE TOUR (voyages) |
| `galerie.css` | Section Galerie photos |
| `contact.css` | Section Contact + Footer |
| `reservation.css` | Page de réservation complète |

### Variables CSS Principales

```css
/* Couleurs */
--black: #000000;
--white: #ffffff;
--gray-100 à --gray-900;

/* Rayons de bordure */
--radius, --radius-lg, --radius-xl, --radius-full;

/* Ombres */
--shadow, --shadow-lg;

/* Transition */
--transition: all 0.3s ease;
```

---

## ⚡ Architecture JavaScript

### Module Core

| Fichier | Contenu |
|---------|---------|
| `dom.js` | Sélection DOM centralisée, système de notifications, utilitaires |

### Modules Fonctionnels

| Fichier | Fonctionnalités |
|---------|-----------------|
| `navbar.js` | Menu mobile, scroll fluide, liens actifs, bouton retour en haut |
| `forms.js` | Formulaire contact, réservation, validation des champs |
| `gallery.js` | Chargement photos, filtres, grille, lightbox, navigation clavier |
| `animations.js` | Animations au scroll (Intersection Observer), compteurs animés |

### Objet Global

Tous les modules sont attachés à `window.NomadRise` :

```javascript
window.NomadRise = {
    version: '2.0.0',
    DOM: { /* éléments DOM */ },
    Notification: { show() },
    Utils: { formatDate(), debounce(), scrollTo() },
    Navigation: { init(), updateActiveLink() },
    Forms: { init(), initContact(), initBooking() },
    Animations: { init(), animateCounter() },
    debug: function() { /* ... */ }
};

// Accès rapide aux notifications
window.showNotification(message, type);

// Gestionnaire de galerie
window.GalleryManager;
```

---

## 📝 Documentation des Fichiers

Chaque fichier contient un **sommaire en français** en commentaire d'en-tête :

```css
/**
 * ============================================================================
 * NOMAD RISE - Nom du Fichier
 * ============================================================================
 * 
 * SOMMAIRE :
 * ---------------------------------------------------------------------------
 * 1. Première section
 * 2. Deuxième section
 * 3. ...
 * 
 * DESCRIPTION :
 * Explication du rôle du fichier.
 * 
 * ============================================================================
 */
```

---

## 🚀 Utilisation

### Développement

1. Ouvrir le projet dans VS Code
2. Utiliser Live Server pour le développement local
3. Les fichiers CSS sont chargés via `assets/css/main.css`
4. Les fichiers JS sont chargés individuellement dans le HTML

### Production

Pour la production, il est recommandé de :
1. Minifier les fichiers CSS et JS
2. Concaténer les fichiers en un seul bundle
3. Optimiser les images

### Ajouter une nouvelle section

1. Créer `assets/css/pages/nouvelle-section.css`
2. Ajouter l'import dans `assets/css/main.css`
3. Si nécessaire, créer le JS dans `assets/js/modules/`

---

## 📸 Galerie Photos

### Structure des photos

Les photos sont organisées par catégorie dans `photos/` :
- `camps/` - Photos des stages
- `coaching/` - Photos de coaching individuel
- `tournois/` - Photos des tournois

### Générer photos.json

```bash
node generate-photos.js
```

Ce script scanne les dossiers et génère automatiquement `photos.json`.

---

## 🎯 Services

| Service | Description |
|---------|-------------|
| **RISE CAMP** | Stages intensifs de basketball (1 semaine) |
| **RISE FIT** | Coaching individuel personnalisé (1h ou 2h) |
| **RISE TOUR** | Voyages basketball à l'étranger |

---

## 📞 Contact

- **Site Web** : [nomadrise.fr](https://nomadrise.fr)
- **Email** : contact@nomadrise.fr
- **Instagram** : @nomadrise

---

## 📄 Licence

© 2025 Nomad Rise. Tous droits réservés.
