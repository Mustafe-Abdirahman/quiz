import { storage } from './storage';
import { generateId } from '../utils/helpers';

export const quizService = {
  getQuizzes() {
    return storage.get(storage.keys.QUIZZES) || [];
  },

  getQuizById(id) {
    const quizzes = this.getQuizzes();
    return quizzes.find(q => q.id === id);
  },

  createQuiz(quizData) {
    const quizzes = this.getQuizzes();
    const newQuiz = {
      id: generateId(),
      title: quizData.title,
      description: quizData.description || '',
      category: quizData.category || 'General',
      difficulty: quizData.difficulty || 'medium',
      timePerQuestion: Number(quizData.timePerQuestion) || 60,
      thumbnail: quizData.thumbnail || '📝',
      maxPlayers: Number(quizData.maxPlayers) || 4,
      questions: [],
      totalQuestions: 0,
      createdAt: new Date().toISOString(),
      createdBy: quizData.createdBy || 'admin',
      playCount: 0,
    };
    quizzes.push(newQuiz);
    storage.set(storage.keys.QUIZZES, quizzes);
    return { success: true, quiz: newQuiz };
  },

  updateQuiz(id, updates) {
    const quizzes = this.getQuizzes();
    const idx = quizzes.findIndex(q => q.id === id);
    if (idx === -1) return { success: false, message: 'Quiz not found' };
    quizzes[idx] = { ...quizzes[idx], ...updates };
    storage.set(storage.keys.QUIZZES, quizzes);
    return { success: true };
  },

  deleteQuiz(id) {
    let quizzes = this.getQuizzes();
    quizzes = quizzes.filter(q => q.id !== id);
    storage.set(storage.keys.QUIZZES, quizzes);
    return { success: true };
  },

  incrementPlayCount(id) {
    const quiz = this.getQuizById(id);
    if (quiz) {
      this.updateQuiz(id, { playCount: (quiz.playCount || 0) + 1 });
    }
  },

  getQuestions() {
    return storage.get(storage.keys.QUESTIONS) || [];
  },

  getQuestionById(id) {
    const questions = this.getQuestions();
    return questions.find(q => q.id === id);
  },

  getQuestionsByIds(ids) {
    const questions = this.getQuestions();
    return ids.map(id => questions.find(q => q.id === id)).filter(Boolean);
  },

  getQuestionsByQuizId(quizId) {
    const quiz = this.getQuizById(quizId);
    if (!quiz) return [];
    return this.getQuestionsByIds(quiz.questions || []);
  },

  createQuestion(questionData) {
    const questions = this.getQuestions();
    const newQuestion = {
      id: generateId(),
      text: questionData.text,
      options: questionData.options,
      correctAnswer: Number(questionData.correctAnswer),
      category: questionData.category || 'General',
      difficulty: questionData.difficulty || 'medium',
      quizId: questionData.quizId || null,
    };
    questions.push(newQuestion);
    storage.set(storage.keys.QUESTIONS, questions);

    if (newQuestion.quizId) {
      const quiz = this.getQuizById(newQuestion.quizId);
      if (quiz) {
        const updatedQuestions = [...(quiz.questions || []), newQuestion.id];
        this.updateQuiz(newQuestion.quizId, {
          questions: updatedQuestions,
          totalQuestions: updatedQuestions.length,
        });
      }
    }

    return { success: true, question: newQuestion };
  },

  updateQuestion(id, updates) {
    const questions = this.getQuestions();
    const idx = questions.findIndex(q => q.id === id);
    if (idx === -1) return { success: false, message: 'Question not found' };
    questions[idx] = { ...questions[idx], ...updates };
    storage.set(storage.keys.QUESTIONS, questions);
    return { success: true };
  },

  deleteQuestion(id) {
    const question = this.getQuestionById(id);
    let questions = this.getQuestions();
    questions = questions.filter(q => q.id !== id);
    storage.set(storage.keys.QUESTIONS, questions);

    if (question && question.quizId) {
      const quiz = this.getQuizById(question.quizId);
      if (quiz) {
        const updatedQuestions = (quiz.questions || []).filter(qid => qid !== id);
        this.updateQuiz(question.quizId, {
          questions: updatedQuestions,
          totalQuestions: updatedQuestions.length,
        });
      }
    }

    return { success: true };
  },

  getQuizQuestionCount(quizId) {
    const quiz = this.getQuizById(quizId);
    return quiz ? (quiz.questions?.length || 0) : 0;
  },

  getCategories() {
    return storage.get(storage.keys.CATEGORIES) || [];
  },

  addCategory(categoryData) {
    const categories = this.getCategories();
    const newCat = { id: generateId(), name: categoryData.name, icon: categoryData.icon || '📁' };
    categories.push(newCat);
    storage.set(storage.keys.CATEGORIES, categories);
    return { success: true, category: newCat };
  },

  deleteCategory(id) {
    let categories = this.getCategories();
    categories = categories.filter(c => c.id !== id);
    storage.set(storage.keys.CATEGORIES, categories);
    return { success: true };
  },

  getAttempts() {
    return storage.get(storage.keys.ATTEMPTS) || [];
  },

  saveAttempt(attemptData) {
    const attempts = this.getAttempts();
    const newAttempt = {
      id: generateId(),
      userId: attemptData.userId,
      quizId: attemptData.quizId,
      quizTitle: attemptData.quizTitle,
      score: attemptData.score,
      totalQuestions: attemptData.totalQuestions,
      correct: attemptData.correct,
      incorrect: attemptData.incorrect,
      unanswered: attemptData.unanswered,
      accuracy: attemptData.accuracy,
      timeTaken: attemptData.timeTaken,
      answers: attemptData.answers || [],
      completedAt: new Date().toISOString(),
      mode: attemptData.mode || 'solo',
    };
    attempts.push(newAttempt);
    storage.set(storage.keys.ATTEMPTS, attempts);
    return { success: true, attempt: newAttempt };
  },

  getUserAttempts(userId) {
    const attempts = this.getAttempts();
    return attempts.filter(a => a.userId === userId);
  },

  getUserStats(userId) {
    const attempts = this.getUserAttempts(userId);
    if (attempts.length === 0) {
      return { totalQuizzes: 0, totalCorrect: 0, totalIncorrect: 0, bestScore: 0, averageScore: 0, totalAccuracy: 0 };
    }
    const totalQuizzes = attempts.length;
    const totalCorrect = attempts.reduce((sum, a) => sum + a.correct, 0);
    const totalIncorrect = attempts.reduce((sum, a) => sum + a.incorrect, 0);
    const bestScore = Math.max(...attempts.map(a => a.score));
    const averageScore = Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / totalQuizzes);
    const totalAccuracy = Math.round(attempts.reduce((sum, a) => sum + a.accuracy, 0) / totalQuizzes);
    return { totalQuizzes, totalCorrect, totalIncorrect, bestScore, averageScore, totalAccuracy };
  },

  getLeaderboard() {
    const attempts = this.getAttempts();
    const users = storage.get(storage.keys.USERS) || [];
    const userScores = {};
    attempts.forEach(a => {
      if (!userScores[a.userId]) {
        userScores[a.userId] = { totalScore: 0, totalCorrect: 0, totalQuestions: 0, count: 0, username: '' };
      }
      const u = users.find(user => user.id === a.userId);
      userScores[a.userId].username = u ? u.username : 'Unknown';
      userScores[a.userId].totalScore += a.score;
      userScores[a.userId].totalCorrect += a.correct;
      userScores[a.userId].totalQuestions += a.totalQuestions;
      userScores[a.userId].count += 1;
    });
    return Object.entries(userScores)
      .map(([userId, data]) => ({
        userId,
        username: data.username,
        totalScore: data.totalScore,
        totalCorrect: data.totalCorrect,
        totalQuestions: data.totalQuestions,
        attempts: data.count,
        accuracy: data.totalQuestions > 0 ? Math.round((data.totalCorrect / data.totalQuestions) * 100) : 0,
      }))
      .sort((a, b) => b.totalScore - a.totalScore || b.accuracy - a.accuracy);
  },

  getAllAttempts() {
    return this.getAttempts();
  },
};
