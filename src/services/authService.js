import { storage } from './storage';
import { generateId } from '../utils/helpers';
import { defaultAdmin, defaultCategories, defaultQuestions, defaultQuiz } from '../data/seedData';

export const authService = {
  init() {
    if (!storage.get(storage.keys.USERS)) {
      storage.set(storage.keys.USERS, [defaultAdmin]);
    }
    if (!storage.get(storage.keys.CATEGORIES)) {
      storage.set(storage.keys.CATEGORIES, defaultCategories);
    }
    if (!storage.get(storage.keys.QUIZZES)) {
      const seededQuiz = {
        ...defaultQuiz,
        questions: defaultQuestions.filter(q => defaultQuiz.questions.includes(q.id)).map(q => q.id),
        totalQuestions: defaultQuiz.questions.length,
      };
      storage.set(storage.keys.QUIZZES, [seededQuiz]);
    }
    if (!storage.get(storage.keys.QUESTIONS)) {
      const seededQuestions = defaultQuestions.map(q => ({
        ...q,
        quizId: defaultQuiz.questions.includes(q.id) ? defaultQuiz.id : null,
      }));
      storage.set(storage.keys.QUESTIONS, seededQuestions);
    }
    if (!storage.get(storage.keys.ATTEMPTS)) {
      storage.set(storage.keys.ATTEMPTS, []);
    }
    if (!storage.get(storage.keys.ROOMS)) {
      storage.set(storage.keys.ROOMS, []);
    }
  },

  login(email, password) {
    const users = storage.get(storage.keys.USERS) || [];
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      const session = { userId: user.id, role: user.role, username: user.username, email: user.email, fullName: user.fullName || user.username };
      storage.set(storage.keys.SESSION, session);
      return { success: true, user: session };
    }
    return { success: false, message: 'Invalid email or password' };
  },

  register(userData) {
    const users = storage.get(storage.keys.USERS) || [];
    if (users.find(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
      return { success: false, message: 'Email already registered' };
    }
    if (users.find(u => u.username.toLowerCase() === userData.username.toLowerCase())) {
      return { success: false, message: 'Username already taken' };
    }
    const role = userData.role === 'admin' ? 'admin' : 'user';
    const newUser = {
      id: generateId(),
      fullName: userData.fullName || userData.username,
      username: userData.username,
      email: userData.email,
      password: userData.password,
      role,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    storage.set(storage.keys.USERS, users);
    const existingSession = storage.get(storage.keys.SESSION);
    if (!existingSession) {
      const session = { userId: newUser.id, role: newUser.role, username: newUser.username, email: newUser.email, fullName: newUser.fullName };
      storage.set(storage.keys.SESSION, session);
    }
    return { success: true, user: newUser };
  },

  logout() {
    storage.remove(storage.keys.SESSION);
  },

  getSession() {
    return storage.get(storage.keys.SESSION);
  },

  getUsers() {
    return storage.get(storage.keys.USERS) || [];
  },

  getUserById(id) {
    const users = this.getUsers();
    return users.find(u => u.id === id);
  },

  updateUser(id, updates) {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) return { success: false, message: 'User not found' };
    users[idx] = { ...users[idx], ...updates };
    storage.set(storage.keys.USERS, users);
    const session = storage.get(storage.keys.SESSION);
    if (session && session.userId === id) {
      storage.set(storage.keys.SESSION, { ...session, ...updates });
    }
    return { success: true };
  },

  deleteUser(id) {
    let users = this.getUsers();
    users = users.filter(u => u.id !== id);
    storage.set(storage.keys.USERS, users);
    return { success: true };
  },

  isAdmin() {
    const session = this.getSession();
    return session && session.role === 'admin';
  },

  isAuthenticated() {
    return !!this.getSession();
  },
};
