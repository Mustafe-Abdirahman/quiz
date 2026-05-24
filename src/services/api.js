const API_BASE = import.meta.env.VITE_API_URL || '/api';

function getToken() {
  return localStorage.getItem('quiz_token');
}

function setToken(token) {
  if (token) localStorage.setItem('quiz_token', token);
}

function removeToken() {
  localStorage.removeItem('quiz_token');
}

async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  } catch {
    if (options.method && options.method !== 'GET') {
      throw new Error('Offline');
    }
    throw new Error('Offline');
  }

  if (res.status === 401) {
    removeToken();
    localStorage.removeItem('quiz_session');
    window.location.href = `${import.meta.env.BASE_URL}login`;
    throw new Error('Session expired');
  }

  if (!res.ok) {
    if (res.status >= 500) throw new Error('Offline');
    let message = `Server error (${res.status})`;
    try {
      const err = await res.json();
      if (err.message) message = err.message;
    } catch {}
    throw new Error(message);
  }

  try {
    return await res.json();
  } catch {
    throw new Error('Invalid response from server');
  }
}

export const api = {
  get: (url) => request(url),
  post: (url, data) => request(url, { method: 'POST', body: JSON.stringify(data) }),
  put: (url, data) => request(url, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (url) => request(url, { method: 'DELETE' }),
  setToken,
  removeToken,
  getToken,
};
