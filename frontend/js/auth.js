export function saveAuthData(token, username) {
    localStorage.setItem('access_token', token);
    localStorage.setItem('username', username);
}

export function clearAuthData() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('username');
}

export function getToken() {
    return localStorage.getItem('access_token');
}

export function getUsername() {
    return localStorage.getItem('username');
}

export function isAuthenticated() {
    return !!getToken();
}