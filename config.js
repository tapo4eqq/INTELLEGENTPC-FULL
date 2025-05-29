// Добавим в начало файла функцию обновления счетчика корзины
function updateCartCounter() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll('.cart-counter').forEach(counter => {
        counter.textContent = totalItems;
    });
}

// Обновленная функция покупки текущей сборки
function buyBuild() {
    // Проверяем, что выбраны все компоненты
    const missingComponents = Object.entries(currentBuild)
        .filter(([type, component]) => !component)
        .map(([type]) => type);
    
    if (missingComponents.length > 0) {
        alert(`Пожалуйста, выберите все компоненты перед покупкой!\nНе выбрано: ${missingComponents.join(', ')}`);
        return;
    }

    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    // Добавляем каждый компонент в корзину как отдельный товар
    Object.values(currentBuild).forEach(component => {
        if (!component) return;
        
        const existingItem = cartItems.find(item => item.id === component.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cartItems.push({
                id: component.id,
                name: component.name,
                code: `#${component.id}`,
                image: getComponentImage(component.id),
                price: component.price,
                quantity: 1,
                specs: component.specs
            });
        }
    });
    
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartCounter();
    
    // Показываем уведомление и предлагаем перейти в корзину
    if (confirm('Сборка добавлена в корзину! Перейти в корзину?')) {
        window.location.href = 'cart.html';
    }
}

// Обновленная функция покупки сохраненной сборки
function buySavedBuild(index) {
    const savedBuilds = JSON.parse(localStorage.getItem('savedBuilds')) || [];
    
    if (index >= 0 && index < savedBuilds.length) {
        const build = savedBuilds[index];
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        
        // Добавляем каждый компонент в корзину как отдельный товар
        Object.values(build.components).forEach(component => {
            if (!component) return;
            
            const existingItem = cartItems.find(item => item.id === component.id);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cartItems.push({
                    id: component.id,
                    name: component.name,
                    code: `#${component.id}`,
                    image: getComponentImage(component.id),
                    price: component.price,
                    quantity: 1,
                    specs: component.specs
                });
            }
        });
        
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateCartCounter();
        
        // Показываем уведомление и предлагаем перейти в корзину
        if (confirm('Сборка добавлена в корзину! Перейти в корзину?')) {
            window.location.href = 'cart.html';
        }
    }
}

// В функции initConfigurator() обновляем обработчики событий:
function initConfigurator() {
    // ... остальной код инициализации ...
    
    // Обработчики событий для кнопок
    document.getElementById('save-build').addEventListener('click', saveBuild);
    document.getElementById('buy-build').addEventListener('click', buyBuild);

    // Делегирование событий для сохраненных сборок
    document.getElementById('saved-builds-list').addEventListener('click', function(e) {
        const btn = e.target.closest('button');
        if (!btn) return;
        
        const index = btn.dataset.index;
        if (!index) return;
        
        if (btn.classList.contains('load-build')) {
            loadBuild(index);
        } else if (btn.classList.contains('buy-build')) {
            buySavedBuild(index);
        } else if (btn.classList.contains('delete-build')) {
            deleteBuild(index);
        }
    });
    
    // ... остальной код инициализации ...
}




// База данных компонентов
const components = {
    cpu: [
        { id: 'cpu1', name: 'Intel Core i5-12400F', price: 15999, specs: ['6 ядер', '12 потоков', '2.5-4.4 GHz'] },
        { id: 'cpu2', name: 'AMD Ryzen 5 5600X', price: 17999, specs: ['6 ядер', '12 потоков', '3.7-4.6 GHz'] },
        { id: 'cpu3', name: 'Intel Core i7-12700K', price: 29999, specs: ['12 ядер', '20 потоков', '3.6-5.0 GHz'] },
        { id: 'cpu4', name: 'AMD Ryzen 7 5800X', price: 25999, specs: ['8 ядер', '16 потоков', '3.8-4.7 GHz'] }
    ],
    mobo: [
        { id: 'mobo1', name: 'ASUS PRIME B660M-K', price: 8999, specs: ['LGA 1700', 'DDR4', 'Micro-ATX'] },
        { id: 'mobo2', name: 'Gigabyte B550 AORUS ELITE', price: 12999, specs: ['AM4', 'DDR4', 'ATX'] },
        { id: 'mobo3', name: 'MSI MAG Z690 TOMAHAWK', price: 21999, specs: ['LGA 1700', 'DDR5', 'ATX'] },
        { id: 'mobo4', name: 'ASUS ROG STRIX X570-E', price: 24999, specs: ['AM4', 'DDR4', 'ATX'] }
    ],
    gpu: [
        { id: 'gpu1', name: 'NVIDIA GeForce RTX 3060', price: 34999, specs: ['12GB GDDR6', '3584 ядер'] },
        { id: 'gpu2', name: 'AMD Radeon RX 6700 XT', price: 39999, specs: ['12GB GDDR6', '2560 ядер'] },
        { id: 'gpu3', name: 'NVIDIA GeForce RTX 3070', price: 49999, specs: ['8GB GDDR6', '5888 ядер'] },
        { id: 'gpu4', name: 'AMD Radeon RX 6800', price: 54999, specs: ['16GB GDDR6', '3840 ядер'] }
    ],
    ram: [
        { id: 'ram1', name: 'Kingston FURY 16GB (2x8GB)', price: 5999, specs: ['DDR4', '3200 MHz'] },
        { id: 'ram2', name: 'Corsair Vengeance RGB 32GB (2x16GB)', price: 12999, specs: ['DDR4', '3600 MHz'] },
        { id: 'ram3', name: 'G.Skill Trident Z5 32GB (2x16GB)', price: 17999, specs: ['DDR5', '6000 MHz'] },
        { id: 'ram4', name: 'HyperX Predator 64GB (2x32GB)', price: 24999, specs: ['DDR4', '3200 MHz'] }
    ],
    storage: [
        { id: 'storage1', name: 'Kingston NV1 500GB', price: 3999, specs: ['NVMe SSD', '500GB'] },
        { id: 'storage2', name: 'Samsung 980 1TB', price: 7999, specs: ['NVMe SSD', '1TB'] },
        { id: 'storage3', name: 'WD Black SN850 2TB', price: 17999, specs: ['NVMe SSD', '2TB'] },
        { id: 'storage4', name: 'Seagate BarraCuda 4TB', price: 8999, specs: ['HDD', '4TB', '7200 RPM'] }
    ],
    psu: [
        { id: 'psu1', name: 'be quiet! System Power 9 500W', price: 4999, specs: ['500W', '80+ Bronze'] },
        { id: 'psu2', name: 'Corsair RM750x', price: 10999, specs: ['750W', '80+ Gold'] },
        { id: 'psu3', name: 'Seasonic PRIME TX-1000', price: 21999, specs: ['1000W', '80+ Titanium'] },
        { id: 'psu4', name: 'Cooler Master V850 Gold', price: 12999, specs: ['850W', '80+ Gold'] }
    ],
    case: [
        { id: 'case1', name: 'Zalman S2', price: 3999, specs: ['Mid-Tower', '3x120mm'] },
        { id: 'case2', name: 'NZXT H510 Flow', price: 7999, specs: ['Mid-Tower', '2x120mm'] },
        { id: 'case3', name: 'Lian Li PC-O11 Dynamic', price: 12999, specs: ['Full-Tower', '3x120mm'] },
        { id: 'case4', name: 'Fractal Design Torrent', price: 15999, specs: ['Full-Tower', '5x140mm'] }
    ]
};

// Текущая сборка
let currentBuild = {
    cpu: null,
    mobo: null,
    gpu: null,
    ram: null,
    storage: null,
    psu: null,
    case: null
};

// Инициализация конфигуратора
function initConfigurator() {
    // Заполняем выпадающие списки
    fillSelect('cpu-select', components.cpu);
    fillSelect('mobo-select', components.mobo);
    fillSelect('gpu-select', components.gpu);
    fillSelect('ram-select', components.ram);
    fillSelect('storage-select', components.storage);
    fillSelect('psu-select', components.psu);
    fillSelect('case-select', components.case);

    // Добавляем обработчики событий
    document.getElementById('cpu-select').addEventListener('change', (e) => updateBuild('cpu', e.target.value));
    document.getElementById('mobo-select').addEventListener('change', (e) => updateBuild('mobo', e.target.value));
    document.getElementById('gpu-select').addEventListener('change', (e) => updateBuild('gpu', e.target.value));
    document.getElementById('ram-select').addEventListener('change', (e) => updateBuild('ram', e.target.value));
    document.getElementById('storage-select').addEventListener('change', (e) => updateBuild('storage', e.target.value));
    document.getElementById('psu-select').addEventListener('change', (e) => updateBuild('psu', e.target.value));
    document.getElementById('case-select').addEventListener('change', (e) => updateBuild('case', e.target.value));

    document.getElementById('save-build').addEventListener('click', saveBuild);
    document.getElementById('buy-build').addEventListener('click', buyBuild);

    // Загружаем сохраненные сборки
    loadSavedBuilds();
}

// Заполнение выпадающего списка
function fillSelect(selectId, items) {
    const select = document.getElementById(selectId);
    items.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = `${item.name} - ${item.price.toLocaleString('ru-RU')} ₽`;
        select.appendChild(option);
    });
}

// Обновление текущей сборки
function updateBuild(componentType, componentId) {
    const component = components[componentType].find(item => item.id === componentId);
    currentBuild[componentType] = component;
    updateBuildSummary();
}

// Обновление сводки сборки
function updateBuildSummary() {
    const summaryElement = document.getElementById('build-summary');
    const totalPriceElement = document.getElementById('total-price');
    
    // Очищаем сводку
    summaryElement.innerHTML = '';
    
    let totalPrice = 0;
    let hasComponents = false;

    // Добавляем выбранные компоненты
    for (const [type, component] of Object.entries(currentBuild)) {
        if (component) {
            hasComponents = true;
            totalPrice += component.price;
            
            const itemElement = document.createElement('div');
            itemElement.className = 'build-item';
            itemElement.innerHTML = `
                <div class="build-item-name">${component.name}</div>
                <div class="build-item-price">${component.price.toLocaleString('ru-RU')} ₽</div>
            `;
            summaryElement.appendChild(itemElement);
        }
    }

    // Если нет компонентов, показываем сообщение
    if (!hasComponents) {
        summaryElement.innerHTML = '<p>Выберите компоненты для отображения сборки</p>';
    }

    // Обновляем итоговую цену
    totalPriceElement.textContent = totalPrice.toLocaleString('ru-RU');
}

// Сохранение текущей сборки
function saveBuild() {
    // Проверяем, что выбраны все компоненты
    for (const component of Object.values(currentBuild)) {
        if (!component) {
            alert('Пожалуйста, выберите все компоненты перед сохранением сборки!');
            return;
        }
    }

    const buildName = prompt('Введите название для вашей сборки:', `Моя сборка ${new Date().toLocaleDateString()}`);
    
    if (buildName) {
        const savedBuilds = JSON.parse(localStorage.getItem('savedBuilds')) || [];
        
        // Создаем копию текущей сборки с именем
        const buildToSave = {
            name: buildName,
            components: {...currentBuild},
            totalPrice: calculateTotalPrice()
        };
        
        savedBuilds.push(buildToSave);
        localStorage.setItem('savedBuilds', JSON.stringify(savedBuilds));
        
        // Обновляем список сохраненных сборок
        loadSavedBuilds();
        alert('Сборка успешно сохранена!');
    }
}

// Загрузка сохраненных сборок
function loadSavedBuilds() {
    const savedBuilds = JSON.parse(localStorage.getItem('savedBuilds')) || [];
    const savedBuildsList = document.getElementById('saved-builds-list');
    
    savedBuildsList.innerHTML = '';
    
    savedBuilds.forEach((build, index) => {
        const li = document.createElement('li');
        li.className = 'saved-build';
        li.innerHTML = `
            <div class="saved-build-name">${build.name}</div>
            <div class="saved-build-price">${build.totalPrice.toLocaleString('ru-RU')} ₽</div>
            <div class="saved-build-actions">
                <button class="load-build" data-index="${index}"><i class="fas fa-upload"></i></button>
                <button class="buy-build" data-index="${index}"><i class="fas fa-shopping-cart"></i></button>
                <button class="delete-build" data-index="${index}"><i class="fas fa-trash"></i></button>
            </div>
        `;
        savedBuildsList.appendChild(li);
    });

    // Добавляем обработчики для кнопок
    document.querySelectorAll('.load-build').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.closest('button').dataset.index;
            loadBuild(index);
        });
    });

    document.querySelectorAll('.buy-build').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.closest('button').dataset.index;
            buySavedBuild(index);
        });
    });

    document.querySelectorAll('.delete-build').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.closest('button').dataset.index;
            deleteBuild(index);
        });
    });
}

// Загрузка сохраненной сборки
function loadBuild(index) {
    const savedBuilds = JSON.parse(localStorage.getItem('savedBuilds')) || [];
    
    if (index >= 0 && index < savedBuilds.length) {
        const build = savedBuilds[index];
        currentBuild = {...build.components};
        
        // Устанавливаем значения в выпадающих списках
        for (const [type, component] of Object.entries(currentBuild)) {
            if (component) {
                document.getElementById(`${type}-select`).value = component.id;
            }
        }
        
        updateBuildSummary();
    }
}

// Покупка текущей сборки
function buyBuild() {
    // Проверяем, что выбраны все компоненты
    for (const component of Object.values(currentBuild)) {
        if (!component) {
            alert('Пожалуйста, выберите все компоненты перед покупкой!');
            return;
        }
    }

    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const buildName = `Сборка: ${Object.values(currentBuild).map(c => c.name).join(' + ')}`;
    
    // Добавляем каждый компонент в корзину как отдельный товар
    Object.values(currentBuild).forEach(component => {
        const existingItem = cartItems.find(item => item.id === component.id);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cartItems.push({
                id: component.id,
                name: component.name,
                code: `#${component.id}`,
                image: getComponentImage(component.id),
                price: component.price,
                quantity: 1,
                specs: component.specs
            });
        }
    });
    
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartCounter();
    alert('Сборка добавлена в корзину!');
}

// Покупка сохраненной сборки
function buySavedBuild(index) {
    const savedBuilds = JSON.parse(localStorage.getItem('savedBuilds')) || [];
    
    if (index >= 0 && index < savedBuilds.length) {
        const build = savedBuilds[index];
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        
        // Добавляем каждый компонент в корзину как отдельный товар
        Object.values(build.components).forEach(component => {
            const existingItem = cartItems.find(item => item.id === component.id);
            
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cartItems.push({
                    id: component.id,
                    name: component.name,
                    code: `#${component.id}`,
                    image: getComponentImage(component.id),
                    price: component.price,
                    quantity: 1,
                    specs: component.specs
                });
            }
        });
        
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateCartCounter();
        alert('Сборка добавлена в корзину!');
    }
}

// Удаление сохраненной сборки
function deleteBuild(index) {
    if (confirm('Вы уверены, что хотите удалить эту сборку?')) {
        const savedBuilds = JSON.parse(localStorage.getItem('savedBuilds')) || [];
        
        if (index >= 0 && index < savedBuilds.length) {
            savedBuilds.splice(index, 1);
            localStorage.setItem('savedBuilds', JSON.stringify(savedBuilds));
            loadSavedBuilds();
        }
    }
}

// Получение изображения для компонента (заглушка)
function getComponentImage(componentId) {
    // В реальном проекте здесь должна быть логика получения изображения
    const type = componentId.substring(0, 3);
    switch(type) {
        case 'cpu': return 'pic/cpu-example.jpg';
        case 'mob': return 'pic/mobo-example.jpg';
        case 'gpu': return 'pic/gpu-example.jpg';
        case 'ram': return 'pic/ram-example.jpg';
        case 'sto': return 'pic/ssd-example.jpg';
        case 'psu': return 'pic/psu-example.jpg';
        case 'cas': return 'pic/case-example.jpg';
        default: return 'pic/default-component.jpg';
    }
}

// Подсчет общей стоимости
function calculateTotalPrice() {
    return Object.values(currentBuild)
        .filter(component => component)
        .reduce((total, component) => total + component.price, 0);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    initConfigurator();
    updateCartCounter();
});