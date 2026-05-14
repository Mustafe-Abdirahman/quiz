export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateUsername = (username) => {
  return username && username.trim().length >= 2;
};

export const validateQuizTitle = (title) => {
  return title && title.trim().length >= 3;
};

export const validateQuestion = (question) => {
  return question && question.text?.trim() && question.options?.length >= 2 && question.correctAnswer !== undefined;
};
