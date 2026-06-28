export function showView(viewId) {
    document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
}

export function showError(elementId, message) {
    document.getElementById(elementId).innerText = message;
}

export function clearErrors() {
    document.querySelectorAll('.error-msg').forEach(el => el.innerText = '');
}

export function updateDashboardHeader(username) {
    document.getElementById('user-greeting').innerText = `HOST: ${username.toUpperCase()}`;
}


/* --- ФУНКЦІЇ ДЛЯ ЗАПОВНЕННЯ ТАБЛИЦЬ ДАНИМИ --- */

export function renderClients(clients) {
    const tbody = document.querySelector('#table-clients tbody');
    tbody.innerHTML = clients.map(c => `
        <tr>
            <td>${c.id}</td>
            <td>${c.name}</td>
        </tr>
    `).join('') || '...';
}

export function renderProducts(products) {
    const tbody = document.querySelector('#table-products tbody');
    tbody.innerHTML = products.map(p => `
        <tr>
            <td>${p.article_code}</td>
            <td>${p.name}</td>
            <td>${p.description || '-'}</td>
            <td>${(p.price / 100).toFixed(2)} USD</td>
        </tr>
    `).join('') || '<tr><td colspan="4" style="text-align:center; color:gray;">Inventory empty.</td></tr>';
}

// ОНОВЛЕНА ФУНКЦІЯ: Ховаємо пагінацію, якщо відкриті деталі
export function showModule(moduleId) {
    document.querySelectorAll('.module-view').forEach(m => m.classList.remove('active'));
    
    // Якщо це не деталі замовлення, оновлюємо активні кнопки меню
    if (moduleId !== 'mod-order-details') {
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        const targetBtn = document.querySelector(`[data-target="${moduleId}"]`);
        if(targetBtn) targetBtn.classList.add('active');
    }
    
    document.getElementById(moduleId).classList.add('active');
    
    // Ховаємо пагінацію в деталях замовлення
    const pagination = document.querySelector('.pagination-footer');
    if (moduleId === 'mod-order-details') {
        pagination.style.display = 'none';
    } else {
        pagination.style.display = 'flex';
    }
}

// ОНОВЛЕНА ФУНКЦІЯ: Додано клас clickable-row та data-id
export function renderOrders(orders) {
    const tbody = document.querySelector('#table-orders tbody');
    tbody.innerHTML = orders.map(o => `
        <tr class="clickable-row" data-id="${o.id}">
            <td>#${o.id}</td>
            <td>${new Date(o.date_created).toLocaleDateString()}</td>
            <td>${o.client_name || `Client ID: ${o.client_id}`}</td>
            <td>${o.items_count}</td>
            <td>${(Number(o.total_price) / 100).toFixed(2)} USD</td>
        </tr>
    `).join('') || '<tr><td colspan="5" style="text-align:center; color:gray;">No orders registered.</td></tr>';
}

// НОВА ФУНКЦІЯ: Малюємо товари всередині замовлення
export function renderOrderItems(items) {
    const tbody = document.querySelector('#table-order-items tbody');
    tbody.innerHTML = items.map(i => `
        <tr>
            <td>${i.article_code}</td>
            <td>${i.name}</td>
            <td>${i.quantity}</td>
            <td>${(Number(i.price) / 100).toFixed(2)} USD</td>
            <td>${((Number(i.price) * Number(i.quantity)) / 100).toFixed(2)} USD</td>
        </tr>
    `).join('') || '<tr><td colspan="5" style="text-align:center; color:gray;">No items found.</td></tr>';
}

// Оновлення кнопок та інфо тексту пагінації
export function updatePaginationUI(currentPage, totalPages) {
    document.getElementById('pag-info').innerText = `PAGE ${currentPage} / ${totalPages || 1}`;
    document.getElementById('pag-prev').disabled = currentPage <= 1;
    document.getElementById('pag-next').disabled = currentPage >= totalPages;
}

export function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

export function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    clearErrors();
}