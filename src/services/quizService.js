import { api } from './api';
import { offlineCache, offlineQueue } from './offlineSync';

export const quizService = {
  async getQuizzes() {
    try {
      const result = await api.get('/quizzes');
      if (result.success) {
        offlineCache.saveQuizzes(result.quizzes);
        return result.quizzes;
      }
      return [];
    } catch {
      return offlineCache.getQuizzes();
    }
  },

  async getQuizById(id) {
    try {
      const result = await api.get(`/quizzes/${id}`);
      if (result.success) {
        offlineCache.saveQuizById(id, result.quiz);
        return result.quiz;
      }
      return null;
    } catch {
      const quizzes = offlineCache.getQuizzes();
      return quizzes.find(q => q.id === id) || null;
    }
  },

  async createQuiz(quizData) {
    return api.post('/quizzes', quizData);
  },

  async updateQuiz(id, updates) {
    return api.put(`/quizzes/${id}`, updates);
  },

  async deleteQuiz(id) {
    return api.delete(`/quizzes/${id}`);
  },

  async incrementPlayCount(id) {
    return api.post(`/quizzes/${id}/play`);
  },

  async getQuestions() {
    try {
      const result = await api.get('/questions');
      if (result.success) {
        offlineCache.saveQuestions(result.questions);
        return result.questions;
      }
      return [];
    } catch {
      return offlineCache.getQuestions();
    }
  },

  async getQuestionById(id) {
    const questions = await this.getQuestions();
    return questions.find(q => q.id === id);
  },

  async getQuestionsByIds(ids) {
    const all = await this.getQuestions();
    return ids.map(id => all.find(q => q.id === id)).filter(Boolean);
  },

  async getQuestionsByQuizId(quizId) {
    try {
      const result = await api.get(`/questions/quiz/${quizId}`);
      if (result.success) {
        offlineCache.saveQuestionsByQuizId(quizId, result.questions);
        return result.questions;
      }
      return [];
    } catch {
      const cached = offlineCache.getQuestionsByQuizId(quizId);
      if (cached) return cached;
      const all = offlineCache.getQuestions();
      return all.filter(q => q.quizId === quizId);
    }
  },

  async createQuestion(questionData) {
    return api.post('/questions', questionData);
  },

  async updateQuestion(id, updates) {
    return api.put(`/questions/${id}`, updates);
  },

  async deleteQuestion(id) {
    return api.delete(`/questions/${id}`);
  },

  async getQuizQuestionCount(quizId) {
    const questions = await this.getQuestionsByQuizId(quizId);
    return questions.length;
  },

  async getCategories() {
    try {
      const result = await api.get('/categories');
      if (result.success) {
        offlineCache.saveCategories(result.categories);
        return result.categories;
      }
      return [];
    } catch {
      return offlineCache.getCategories();
    }
  },

  async addCategory(categoryData) {
    return api.post('/categories', categoryData);
  },

  async deleteCategory(id) {
    return api.delete(`/categories/${id}`);
  },

  async getAttempts() {
    const result = await api.get('/attempts');
    return result.success ? result.attempts : [];
  },

  async saveAttempt(attemptData) {
    try {
      return await api.post('/attempts', attemptData);
    } catch {
      offlineQueue.add({ ...attemptData, _id: Date.now().toString(36) + Math.random().toString(36).slice(2) });
      return { success: true, offline: true };
    }
  },

  async getUserAttempts(userId) {
    const result = await api.get(`/attempts/user/${userId}`);
    return result.success ? result.attempts : [];
  },

  async getUserStats(userId) {
    const result = await api.get(`/attempts/user/${userId}/stats`);
    return result.success ? result.stats : { totalQuizzes: 0, totalCorrect: 0, totalIncorrect: 0, bestScore: 0, averageScore: 0, totalAccuracy: 0 };
  },

  async getLeaderboard() {
    const result = await api.get('/attempts/leaderboard');
    return result.success ? result.leaderboard : [];
  },

  async getAllAttempts() {
    return this.getAttempts();
  },

  async assignQuiz(quizId, userIds) {
    return api.post(`/quizzes/${quizId}/assign`, { userIds });
  },

  async getAssignedUserIds(quizId) {
    const result = await api.get(`/quizzes/${quizId}/assignments`);
    return result.success ? result.userIds : [];
  },
};
