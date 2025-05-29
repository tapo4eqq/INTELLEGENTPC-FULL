// accessibility.js
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация панели доступности
    const accessibilityBtn = document.getElementById('accessibilityBtn');
    const accessibilityMenu = document.getElementById('accessibilityMenu');
    
    if (accessibilityBtn && accessibilityMenu) {
        accessibilityBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            accessibilityMenu.classList.toggle('active');
        });
        
        // Закрытие меню при клике вне его
        document.addEventListener('click', function() {
            accessibilityMenu.classList.remove('active');
        });
        
        // Предотвращаем закрытие при клике внутри меню
        accessibilityMenu.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    // Восстановление настроек при загрузке
    if (localStorage.getItem('accessibilityMode') === 'true') {
        document.body.classList.add('accessibility-mode');
    }
    if (localStorage.getItem('highContrast') === 'true') {
        document.body.classList.add('high-contrast');
    }
    if (localStorage.getItem('lightTheme') === 'true') {
        document.body.classList.add('light-theme');
    }
    if (localStorage.getItem('reducedMotion') === 'true') {
        document.body.classList.add('accessibility-reduced-motion');
    }
});

// Глобальные функции доступности
function toggleAccessibilityMode() {
    document.body.classList.toggle('accessibility-mode');
    localStorage.setItem('accessibilityMode', document.body.classList.contains('accessibility-mode'));
}

function toggleHighContrast() {
    document.body.classList.toggle('high-contrast');
    localStorage.setItem('highContrast', document.body.classList.contains('high-contrast'));
}

function toggleLightTheme() {
    document.body.classList.toggle('light-theme');
    localStorage.setItem('lightTheme', document.body.classList.contains('light-theme'));
}

function toggleReducedMotion() {
    document.body.classList.toggle('accessibility-reduced-motion');
    localStorage.setItem('reducedMotion', document.body.classList.contains('accessibility-reduced-motion'));
}

function resetAccessibility() {
    document.body.classList.remove('accessibility-mode', 'high-contrast', 'light-theme', 'accessibility-reduced-motion');
    localStorage.removeItem('accessibilityMode');
    localStorage.removeItem('highContrast');
    localStorage.removeItem('lightTheme');
    localStorage.removeItem('reducedMotion');
}