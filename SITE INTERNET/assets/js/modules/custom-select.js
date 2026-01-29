/**
 * ============================================================================
 * NOMAD RISE - Module : Custom Select
 * ============================================================================
 * 
 * DESCRIPTION :
 * Remplace les selects natifs par des dropdowns personnalisés et stylisés.
 * Permet un contrôle total sur l'apparence du dropdown.
 * 
 * ============================================================================
 */

class CustomSelect {
    constructor(selectElement) {
        this.select = selectElement;
        this.options = Array.from(selectElement.options);
        this.isOpen = false;
        
        this.createCustomSelect();
        this.bindEvents();
    }
    
    createCustomSelect() {
        // Créer le wrapper
        this.wrapper = document.createElement('div');
        this.wrapper.className = 'custom-select';
        
        // Créer le bouton de sélection
        this.trigger = document.createElement('div');
        this.trigger.className = 'custom-select-trigger';
        
        // Texte sélectionné
        this.selectedText = document.createElement('span');
        this.selectedText.className = 'custom-select-value';
        this.selectedText.textContent = this.getSelectedOptionText();
        
        // Icône flèche
        this.arrow = document.createElement('span');
        this.arrow.className = 'custom-select-arrow';
        this.arrow.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
        `;
        
        this.trigger.appendChild(this.selectedText);
        this.trigger.appendChild(this.arrow);
        
        // Créer le dropdown
        this.dropdown = document.createElement('div');
        this.dropdown.className = 'custom-select-dropdown';
        
        // Créer les options
        this.optionElements = [];
        this.options.forEach((option, index) => {
            if (option.disabled && option.value === '') return; // Skip placeholder
            
            const optionEl = document.createElement('div');
            optionEl.className = 'custom-select-option';
            optionEl.dataset.value = option.value;
            optionEl.dataset.index = index;
            optionEl.textContent = option.textContent;
            
            if (option.selected && option.value !== '') {
                optionEl.classList.add('selected');
            }
            
            this.dropdown.appendChild(optionEl);
            this.optionElements.push(optionEl);
        });
        
        // Assembler
        this.wrapper.appendChild(this.trigger);
        this.wrapper.appendChild(this.dropdown);
        
        // Insérer après le select et cacher le select
        this.select.parentNode.insertBefore(this.wrapper, this.select.nextSibling);
        this.select.style.display = 'none';
        this.select.classList.add('has-custom-select');
        
        // Si placeholder, ajouter classe
        if (!this.select.value) {
            this.wrapper.classList.add('placeholder');
        }
    }
    
    getSelectedOptionText() {
        const selectedOption = this.options.find(opt => opt.selected);
        if (selectedOption && selectedOption.value !== '') {
            return selectedOption.textContent;
        }
        // Retourner le placeholder
        const placeholder = this.options.find(opt => opt.disabled && opt.value === '');
        return placeholder ? placeholder.textContent : 'Sélectionner...';
    }
    
    bindEvents() {
        // Toggle dropdown
        this.trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggle();
        });
        
        // Sélection d'une option
        this.optionElements.forEach(optionEl => {
            optionEl.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectOption(optionEl);
            });
        });
        
        // Fermer au clic extérieur
        document.addEventListener('click', (e) => {
            if (!this.wrapper.contains(e.target)) {
                this.close();
            }
        });
        
        // Navigation clavier
        this.trigger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggle();
            } else if (e.key === 'Escape') {
                this.close();
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.navigateOptions(1);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.navigateOptions(-1);
            }
        });
        
        // Rendre le trigger focusable
        this.trigger.setAttribute('tabindex', '0');
        this.trigger.setAttribute('role', 'listbox');
    }
    
    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }
    
    open() {
        this.isOpen = true;
        this.wrapper.classList.add('open');
        this.trigger.setAttribute('aria-expanded', 'true');
    }
    
    close() {
        this.isOpen = false;
        this.wrapper.classList.remove('open');
        this.trigger.setAttribute('aria-expanded', 'false');
    }
    
    selectOption(optionEl) {
        const value = optionEl.dataset.value;
        const index = parseInt(optionEl.dataset.index);
        
        // Mettre à jour le select natif
        this.select.selectedIndex = index;
        this.select.value = value;
        
        // Déclencher l'événement change
        const event = new Event('change', { bubbles: true });
        this.select.dispatchEvent(event);
        
        // Mettre à jour l'affichage
        this.selectedText.textContent = optionEl.textContent;
        this.wrapper.classList.remove('placeholder');
        
        // Mettre à jour les classes selected
        this.optionElements.forEach(opt => opt.classList.remove('selected'));
        optionEl.classList.add('selected');
        
        this.close();
    }
    
    navigateOptions(direction) {
        const currentIndex = this.optionElements.findIndex(opt => opt.classList.contains('selected'));
        let newIndex = currentIndex + direction;
        
        if (newIndex < 0) newIndex = this.optionElements.length - 1;
        if (newIndex >= this.optionElements.length) newIndex = 0;
        
        this.selectOption(this.optionElements[newIndex]);
    }
}

// Initialiser tous les selects personnalisés
function initCustomSelects() {
    const selects = document.querySelectorAll('select[data-custom-select], .form-field select, .personal-form select');
    
    selects.forEach(select => {
        if (!select.classList.contains('has-custom-select')) {
            new CustomSelect(select);
        }
    });
}

// Initialiser au chargement du DOM
document.addEventListener('DOMContentLoaded', initCustomSelects);

// Export
window.CustomSelect = CustomSelect;
window.initCustomSelects = initCustomSelects;
