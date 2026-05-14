const STORAGE_KEYS = {
  USERS: 'quiz_users',
  SESSION: 'quiz_session',
  QUIZZES: 'quiz_quizzes',
  QUESTIONS: 'quiz_questions',
  CATEGORIES: 'quiz_categories',
  ATTEMPTS: 'quiz_attempts',
  ROOMS: 'quiz_rooms',
  THEME: 'quiz_theme',
};

const get = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

const set = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

const remove = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
};

export const storage = {
  get,
  set,
  remove,
  keys: STORAGE_KEYS,
};
