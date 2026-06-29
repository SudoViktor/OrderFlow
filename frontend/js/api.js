import { clearAuthData } from './auth.js';

const BASE_URL = 'http://127.0.0.1:5001/';
export async function apiRequest(endpoint, method = 'GET', body = null, token = null) {
    const headers = {
        'Content-Type': 'application/json'
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        method: method,
        headers: headers
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, config);
        const data = await response.json();

        if (response.status === 401) {
            console.warn("Token expired or invalid. Logging out...");
            clearAuthData(); // Видаляємо токен з localStorage
            window.location.reload(); // Перезавантажуємо сторінку, щоб показати форму логіну
            return { ok: false, data: { reason: "Session expired" } };
        }

        return { ok: response.ok, status: response.status, data };
    } catch (error) {
        console.error('API Error:', error);
        return { ok: false, data: { reason: "Server connection failed" } };
    }
}
