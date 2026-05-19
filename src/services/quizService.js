import { api } from './api';

export const quizService = {
  async getQuizzes() {
    const result = await api.get('/quizzes');
    return result.success ? result.quizzes : [];
  },

  async getQuizById(id) {
    const result = await api.get(`/quizzes/${id}`);
    return result.success ? result.quiz : null;
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
    const result = await api.get('/questions');
    return result.success ? result.questions : [];
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
    const result = await api.get(`/questions/quiz/${quizId}`);
    return result.success ? result.questions : [];
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
    const result = await api.get('/categories');
    return result.success ? result.categories : [];
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
    return api.post('/attempts', attemptData);
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
