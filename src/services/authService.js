import { api } from './api';

export const authService = {
  async init() {},

  async login(email, password) {
    try {
      const result = await api.post('/auth/login', { email, password });
      if (result.success) {
        api.setToken(result.token);
        localStorage.setItem('quiz_session', JSON.stringify(result.user));
      }
      return result;
    } catch (e) {
      return { success: false, message: e.message };
    }
  },

  async register(userData) {
    try {
      const result = await api.post('/auth/register', userData);
      if (result.success && result.token) {
        api.setToken(result.token);
        localStorage.setItem('quiz_session', JSON.stringify(result.user));
      }
      return result;
    } catch (e) {
      return { success: false, message: e.message };
    }
  },

  async createUser(userData) {
    return api.post('/users', userData);
  },

  logout() {
    api.removeToken();
    localStorage.removeItem('quiz_session');
  },

  getSession() {
    const session = localStorage.getItem('quiz_session');
    return session ? JSON.parse(session) : null;
  },

  async refreshSession() {
    try {
      const result = await api.get('/auth/session');
      if (result.success) {
        localStorage.setItem('quiz_session', JSON.stringify(result.user));
      }
      return result;
    } catch {
      return { success: false };
    }
  },

  async getUsers() {
    const result = await api.get('/users');
    return result.success ? result.users : [];
  },

  async getUserById(id) {
    const result = await api.get(`/users/${id}`);
    return result.success ? result.user : null;
  },

  async updateUser(id, updates) {
    return api.put(`/users/${id}`, updates);
  },

  async updateProfile(data) {
    const result = await api.put('/auth/profile', data);
    if (result.success) {
      localStorage.setItem('quiz_session', JSON.stringify(result.user));
    }
    return result;
  },

  async deleteUser(id) {
    return api.delete(`/users/${id}`);
  },

  isAdmin() {
    const session = this.getSession();
    return session && session.role === 'admin';
  },

  isAuthenticated() {
    return !!this.getSession();
  },
};
