/**
 * Script de génération du fichier photos.json
 * 
 * Ce script parcourt le dossier /photos/ et génère un fichier JSON
 * contenant toutes les photos avec leurs métadonnées.
 * 
 * UTILISATION:
 * 1. Placez vos photos dans les dossiers appropriés:
 *    - photos/camps/2026-01-camp-hiver/photo1.jpg
 *    - photos/tournois/2026-01-12-nom-tournoi/photo1.jpg
 *    - photos/coaching/2026-01-15-u11/photo1.jpg
 * 
 * 2. Exécutez le script: node generate-photos.js
 * 
 * 3. Le fichier photos.json sera généré à la racine du site
 */

const fs = require('fs');
const path = require('path');

// Configuration
const PHOTOS_DIR = './photos';
const OUTPUT_FILE = './photos.json';
const SUPPORTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

// Catégories supportées (noms des dossiers de premier niveau)
const CATEGORIES = {
    'camps': 'Camps',
    'tournois': 'Tournois',
    'coaching': 'Coaching'
};

/**
 * Extrait la date du nom du dossier (format: YYYY-MM-... ou YYYY-MM-DD-...)
 */
function extractDate(folderName) {
    const dateMatch = folderName.match(/^(\d{4})-(\d{2})(?:-(\d{2}))?/);
    if (dateMatch) {
        const year = dateMatch[1];
        const month = dateMatch[2];
        const day = dateMatch[3] || '01';
        return `${year}-${month}-${day}`;
    }
    return new Date().toISOString().split('T')[0];
}

/**
 * Extrait le titre du nom du dossier (partie après la date)
 */
function extractTitle(folderName) {
    const titleMatch = folderName.replace(/^\d{4}-\d{2}(-\d{2})?-?/, '');
    return titleMatch
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ') || 'Sans titre';
}

/**
 * Obtient la taille du fichier en Ko
 */
function getFileSizeKB(filePath) {
    try {
        const stats = fs.statSync(filePath);
        return Math.round(stats.size / 1024);
    } catch {
        return 0;
    }
}

/**
 * Parcourt récursivement un dossier et retourne les photos
 */
function scanPhotos(baseDir) {
    const photos = [];
    
    // Vérifier si le dossier photos existe
    if (!fs.existsSync(baseDir)) {
        console.log(`⚠️  Le dossier ${baseDir} n'existe pas. Création...`);
        fs.mkdirSync(baseDir, { recursive: true });
        
        // Créer les sous-dossiers de catégories
        Object.keys(CATEGORIES).forEach(cat => {
            const catPath = path.join(baseDir, cat);
            if (!fs.existsSync(catPath)) {
                fs.mkdirSync(catPath, { recursive: true });
                console.log(`   📁 Créé: ${catPath}`);
            }
        });
        
        return photos;
    }
    
    // Parcourir chaque catégorie
    Object.keys(CATEGORIES).forEach(category => {
        const categoryPath = path.join(baseDir, category);
        
        if (!fs.existsSync(categoryPath)) {
            console.log(`   📁 Catégorie ${category} non trouvée, création...`);
            fs.mkdirSync(categoryPath, { recursive: true });
            return;
        }
        
        // Parcourir les sous-dossiers (événements)
        const eventFolders = fs.readdirSync(categoryPath, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);
        
        eventFolders.forEach(eventFolder => {
            const eventPath = path.join(categoryPath, eventFolder);
            const eventDate = extractDate(eventFolder);
            const eventTitle = extractTitle(eventFolder);
            
            // Parcourir les fichiers images
            const files = fs.readdirSync(eventPath, { withFileTypes: true })
                .filter(dirent => dirent.isFile())
                .filter(dirent => SUPPORTED_EXTENSIONS.includes(
                    path.extname(dirent.name).toLowerCase()
                ));
            
            files.forEach((file, index) => {
                const filePath = path.join(eventPath, file.name);
                const relativePath = `photos/${category}/${eventFolder}/${file.name}`;
                
                photos.push({
                    id: `${category}-${eventFolder}-${index}`.replace(/[^a-z0-9-]/gi, '-'),
                    url: relativePath,
                    thumbnail: relativePath, // Même URL pour l'instant (ajouter génération miniatures si besoin)
                    category: category,
                    categoryLabel: CATEGORIES[category],
                    date: eventDate,
                    event: eventTitle,
                    filename: file.name,
                    size: getFileSizeKB(filePath)
                });
            });
        });
        
        // Aussi scanner les images directement dans le dossier catégorie (pas dans sous-dossier)
        const directFiles = fs.readdirSync(categoryPath, { withFileTypes: true })
            .filter(dirent => dirent.isFile())
            .filter(dirent => SUPPORTED_EXTENSIONS.includes(
                path.extname(dirent.name).toLowerCase()
            ));
        
        directFiles.forEach((file, index) => {
            const filePath = path.join(categoryPath, file.name);
            const relativePath = `photos/${category}/${file.name}`;
            
            photos.push({
                id: `${category}-direct-${index}`.replace(/[^a-z0-9-]/gi, '-'),
                url: relativePath,
                thumbnail: relativePath,
                category: category,
                categoryLabel: CATEGORIES[category],
                date: new Date().toISOString().split('T')[0],
                event: CATEGORIES[category],
                filename: file.name,
                size: getFileSizeKB(filePath)
            });
        });
    });
    
    return photos;
}

/**
 * Génère le fichier JSON
 */
function generateJSON() {
    console.log('🔍 Scan du dossier photos...\n');
    
    const photos = scanPhotos(PHOTOS_DIR);
    
    // Trier par date décroissante
    photos.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    const output = {
        generated: new Date().toISOString(),
        total: photos.length,
        categories: Object.entries(CATEGORIES).map(([key, label]) => ({
            id: key,
            label: label,
            count: photos.filter(p => p.category === key).length
        })),
        photos: photos
    };
    
    // Écrire le fichier JSON
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf8');
    
    console.log(`✅ Fichier ${OUTPUT_FILE} généré avec succès!`);
    console.log(`   📷 ${photos.length} photo(s) trouvée(s)`);
    console.log('');
    
    output.categories.forEach(cat => {
        console.log(`   • ${cat.label}: ${cat.count} photo(s)`);
    });
    
    console.log('\n📌 Pour mettre à jour la galerie:');
    console.log('   1. Ajoutez vos photos dans les dossiers');
    console.log('   2. Relancez: node generate-photos.js');
    console.log('   3. Uploadez photos.json sur votre serveur');
}

// Exécuter
generateJSON();
