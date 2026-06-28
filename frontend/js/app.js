import { apiRequest } from './api.js';
import { saveAuthData, clearAuthData, isAuthenticated, getUsername, getToken } from './auth.js';
import { renderOrderItems, openModal, closeModal, showView, showError, clearErrors, updateDashboardHeader, showModule, renderClients, renderProducts, renderOrders, updatePaginationUI } from './ui.js';

// Зберігаємо поточний стан інтерфейсу (Пагінація)
let currentModule = 'mod-orders'; // Який модуль зараз відкритий
let currentPage = 1;
const PER_PAGE = 6; // По 100 елементів на сторінку за умовою

document.addEventListener('DOMContentLoaded', () => {
    if (isAuthenticated()) {
        openDashboard();
    } else {
        showView('view-login');
    }
});

// Керування бічним меню (Sidebar navigation)
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        currentModule = e.target.getAttribute('data-target');
        currentPage = 1; // Скидаємо на 1 сторінку при переході
        showModule(currentModule);
        loadModuleData();
    });
});

// Керування кнопками Пагінації
document.getElementById('pag-prev').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        loadModuleData();
    }
});

document.getElementById('pag-next').addEventListener('click', () => {
    currentPage++;
    loadModuleData();
});

/* --- ГОЛОВНА ФУНКЦІЯ ЗАВАНТАЖЕННЯ ДАНИХ (ЗАПИТИ ДО СЕРВЕРА) --- */
async function loadModuleData() {
    const token = getToken();
    
    // Формуємо параметри запиту для пагінації (наприклад: /api/clients?page=1&per_page=100)
    const queryParams = `?page=${currentPage}&per_page=${PER_PAGE}`;

    if (currentModule === 'mod-clients') {
        const response = await apiRequest(`/api/clients${queryParams}`, 'GET', null, token);
        if (response.ok) {
            renderClients(response.data.clients);
            updatePaginationUI(currentPage, response.data.total_pages);
        }
    } 
    else if (currentModule === 'mod-products') {
        const response = await apiRequest(`/api/products${queryParams}`, 'GET', null, token);
        if (response.ok) {
            renderProducts(response.data.products);
            updatePaginationUI(currentPage, response.data.total_pages);
        }
    } 
    else if (currentModule === 'mod-orders') {
        const response = await apiRequest(`/api/orders${queryParams}`, 'GET', null, token);
        if (response.ok) {
            renderOrders(response.data.orders);
            updatePaginationUI(currentPage, response.data.total_pages);
        }
    }
}

// Стара логіка авторизації залишається...
document.getElementById('link-to-register').addEventListener('click', (e) => { e.preventDefault(); clearErrors(); showView('view-register'); });
document.getElementById('link-to-login').addEventListener('click', (e) => { e.preventDefault(); clearErrors(); showView('view-login'); });

document.getElementById('form-login').addEventListener('submit', async (e) => {
    e.preventDefault(); clearErrors();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const response = await apiRequest('/api/login', 'POST', { username, password });
    if (response.ok) {
        saveAuthData(response.data.token, username);
        openDashboard();
        e.target.reset();
    } else {
        showError('login-error', response.data.reason || 'Authentication failed');
    }
});

document.getElementById('form-register').addEventListener('submit', async (e) => {
    e.preventDefault(); clearErrors();
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;
    const response = await apiRequest('/api/register', 'POST', { username, password });
    if (response.ok) {
        alert('Registration successful! Please log in.');
        showView('view-login');
        e.target.reset();
    } else {
        showError('reg-error', response.data.reason || 'User already exists');
    }
});

document.getElementById('btn-logout').addEventListener('click', () => {
    clearAuthData();
    showView('view-login');
});

function openDashboard() {
    const username = getUsername();
    updateDashboardHeader(username);
    showView('view-dashboard');
    showModule(currentModule); // Відкриваємо дефолтний модуль (Orders)
    loadModuleData();          // Стягуємо перші дані з бази
}


// Відкриття модалки створення клієнта
document.getElementById('btn-add-client').addEventListener('click', () => {
    document.getElementById('form-add-client').reset(); // Очищаємо поле вводу
    openModal('modal-add-client');
});

// Закриття модалки по кнопці CANCEL
document.getElementById('btn-close-client').addEventListener('click', () => {
    closeModal('modal-add-client');
});

// Відправка форми на сервер
document.getElementById('form-add-client').addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();
    
    // Беремо ім'я з поля вводу
    const name = document.getElementById('client-name').value;

    // URLSearchParams автоматично перетворить пробіли та кирилицю у правильний формат (%D0%9A...)
    const params = new URLSearchParams({ name });
    const token = getToken();
    
    // Робимо GET запит до твого API
    const response = await apiRequest(`/api/create_client?${params.toString()}`, 'GET', null, token);

    if (response.ok) {
        closeModal('modal-add-client'); // Ховаємо вікно
        loadModuleData(); // Перезавантажуємо таблицю, щоб клієнт одразу з'явився
    } else {
        showError('client-error', response.data?.reason || 'Failed to create client');
    }
});

// Відкриття модалки створення продукту
document.getElementById('btn-add-product').addEventListener('click', () => {
    document.getElementById('form-add-product').reset(); // Очищаємо форму перед відкриттям
    openModal('modal-add-product');
});

// Закриття модалки по кнопці CANCEL
document.getElementById('btn-close-modal').addEventListener('click', () => {
    closeModal('modal-add-product');
});

// Відправка форми на сервер
document.getElementById('form-add-product').addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();
    
    // Збираємо дані з полів
    const article_code = document.getElementById('prod-code').value;
    const name = document.getElementById('prod-name').value;
    const description = document.getElementById('prod-desc').value;
    const price = document.getElementById('prod-price').value; // в копійках

    // Формуємо рядок параметрів (це автоматично зробить %D0%9A%D1%96... для кирилиці)
    const params = new URLSearchParams({
        article_code,
        name,
        description,
        price
    });
    
    const token = getToken();
    
    // Робимо запит до твого API. 
    const response = await apiRequest(`/api/create_article?${params.toString()}`, 'POST', null, token);

    if (response.ok) {
        closeModal('modal-add-product'); // Закриваємо вікно
        loadModuleData(); // Одразу перезавантажуємо таблицю, щоб побачити новий товар
    } else {
        showError('prod-error', response.data?.reason || 'Failed to create product');
    }
});

// Відстежуємо клік по таблиці замовлень
document.querySelector('#table-orders tbody').addEventListener('click', async (e) => {
    // Шукаємо найближчий рядок (tr) з класом clickable-row
    const row = e.target.closest('.clickable-row');
    if (!row) return; // Якщо клікнули кудись повз, нічого не робимо

    const orderId = row.getAttribute('data-id');
    const token = getToken();
    
    // Запитуємо деталі замовлення у сервера
    const response = await apiRequest(`/api/orders/${orderId}`, 'GET', null, token);

    if (response.ok) {
        // Змінюємо заголовок
        document.getElementById('details-order-title').innerText = `[ ORDER_DETAILS: #${orderId} ]`;
        
        // Малюємо таблицю з товарами
        renderOrderItems(response.data.items);
        
        // Відкриваємо модуль деталей
        showModule('mod-order-details');
    } else {
        alert('Failed to load order details');
    }
});

// Кнопка НАЗАД в замовлення
document.getElementById('btn-back-to-orders').addEventListener('click', () => {
    showModule('mod-orders');
});


// Змінна для зберігання всіх товарів, щоб будувати випадаючі списки
let globalProductsCache = [];

// 1. Відкриття вікна створення замовлення
document.getElementById('btn-add-order').addEventListener('click', async () => {
    document.getElementById('order-error').innerText = '';
    document.getElementById('order-items-container').innerHTML = ''; // Очищаємо кошик
    const token = getToken();

    // Паралельно завантажуємо клієнтів і товари (беремо багато, щоб помістилися всі)
    const [clientsRes, productsRes] = await Promise.all([
        apiRequest('/api/clients?per_page=1000', 'GET', null, token),
        apiRequest('/api/products?per_page=1000', 'GET', null, token)
    ]);

    if (clientsRes.ok && productsRes.ok) {
        globalProductsCache = productsRes.data.products;
        
        // Заповнюємо список клієнтів
        const clientSelect = document.getElementById('order-client');
        clientSelect.innerHTML = clientsRes.data.clients
            .map(c => `<option value="${c.id}">${c.name}</option>`)
            .join('');

        // Додаємо перший рядок з товаром
        addOrderItemRow();
        openModal('modal-add-order');
    } else {
        alert("Failed to fetch data for order creation.");
    }
});

// Закриття вікна
document.getElementById('btn-close-order').addEventListener('click', () => {
    closeModal('modal-add-order');
});

// Кнопка додавання ще одного товару
document.getElementById('btn-add-item-row').addEventListener('click', () => {
    addOrderItemRow();
});

// 2. Функція, яка генерує HTML для одного рядка "Товар - Кількість"
function addOrderItemRow() {
    const container = document.getElementById('order-items-container');
    const row = document.createElement('div');
    row.className = 'order-item-row';

    // Будуємо options для товарів
    const productOptions = globalProductsCache
        .map(p => `<option value="${p.id}">${p.name} - ${(Number(p.price)/100).toFixed(2)}$</option>`)
        .join('');

    row.innerHTML = `
        <select class="item-select" required>
            <option value="" disabled selected>Select product...</option>
            ${productOptions}
        </select>
        <input type="number" class="item-qty" placeholder="Qty" min="1" required>
        <button type="button" class="btn-remove-row">X</button>
    `;

    // Видалення рядка
    row.querySelector('.btn-remove-row').addEventListener('click', () => row.remove());
    container.appendChild(row);
}

// 3. Відправка замовлення
document.getElementById('form-add-order').addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    const clientId = document.getElementById('order-client').value;
    const rows = document.querySelectorAll('.order-item-row');
    const cartItems = [];

    // Збираємо дані з кожного рядка
    rows.forEach(row => {
        const articleId = row.querySelector('.item-select').value;
        const qty = row.querySelector('.item-qty').value;
        
        if (articleId && qty) {
            cartItems.push({
                article_id: parseInt(articleId),
                quantity: parseInt(qty)
            });
        }
    });

    if (cartItems.length === 0) {
        showError('order-error', 'Add at least one product to the order!');
        return;
    }

    const token = getToken();
    
    // ВАЖЛИВО: Тут метод POST і передаємо об'єкт (JSON) третім параметром
    const response = await apiRequest('/api/create_order', 'POST', {
        client_id: parseInt(clientId),
        cart_items: cartItems
    }, token);

    if (response.ok) {
        closeModal('modal-add-order');
        loadModuleData(); // Оновлюємо таблицю замовлень
    } else {
        showError('order-error', response.data?.reason || 'Failed to create order');
    }
});