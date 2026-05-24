const CACHE_PREFIX = 'quiz_offline_';
const QUEUE_KEY = 'quiz_offline_queue';

const cache = {
  get(key) {
    try {
      const data = localStorage.getItem(CACHE_PREFIX + key);
      return data ? JSON.parse(data) : null;
    } catch { return null; }
  },

  set(key, value) {
    try {
      localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(value));
      return true;
    } catch { return false; }
  },

  remove(key) {
    try { localStorage.removeItem(CACHE_PREFIX + key); return true; }
    catch { return false; }
  },

  getAllKeys() {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(CACHE_PREFIX)) keys.push(k.slice(CACHE_PREFIX.length));
    }
    return keys;
  },
};

export const offlineCache = {
  saveQuizzes(quizzes) { cache.set('quizzes', quizzes); },
  getQuizzes() { return cache.get('quizzes') || []; },

  saveQuestions(questions) { cache.set('questions', questions); },
  getQuestions() { return cache.get('questions') || []; },

  saveCategories(categories) { cache.set('categories', categories); },
  getCategories() { return cache.get('categories') || []; },

  saveQuizById(id, quiz) {
    const all = this.getQuizzes();
    const idx = all.findIndex(q => q.id === id);
    if (idx >= 0) all[idx] = quiz;
    else all.push(quiz);
    this.saveQuizzes(all);
  },

  saveQuestionsByQuizId(quizId, questions) {
    const all = cache.get('questions_by_quiz') || {};
    all[quizId] = questions;
    cache.set('questions_by_quiz', all);
  },

  getQuestionsByQuizId(quizId) {
    const all = cache.get('questions_by_quiz') || {};
    return all[quizId] || null;
  },
};

export const offlineQueue = {
  getQueue() {
    try {
      const data = localStorage.getItem(QUEUE_KEY);
      return data ? JSON.parse(data) : [];
    } catch { return []; }
  },

  add(entry) {
    const queue = this.getQueue();
    queue.push({ ...entry, _queuedAt: Date.now() });
    try {
      localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    } catch {}
  },

  remove(id) {
    const queue = this.getQueue().filter(e => e._id !== id);
    try {
      localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    } catch {}
  },

  clear() {
    try { localStorage.removeItem(QUEUE_KEY); } catch {}
  },

  get pendingCount() {
    return this.getQueue().length;
  },
};

export async function syncOfflineData() {
  const queue = offlineQueue.getQueue();
  if (queue.length === 0) return { synced: 0, failed: 0 };

  let synced = 0;
  let failed = 0;

  for (const entry of queue) {
    try {
      const { _id, _queuedAt, ...clean } = entry;
      const res = await fetch('/api/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('quiz_token')}` },
        body: JSON.stringify(clean),
      });
      if (res.ok) {
        offlineQueue.remove(entry._id);
        synced++;
      } else {
        failed++;
      }
    } catch {
      failed++;
    }
  }

  return { synced, failed };
}
