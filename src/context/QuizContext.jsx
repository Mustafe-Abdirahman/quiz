import { createContext, useContext, useState, useCallback } from 'react';
import { quizService } from '../services/quizService';

const QuizContext = createContext(null);

export function QuizProvider({ children }) {
  const [quizzes, setQuizzes] = useState(() => quizService.getQuizzes());
  const [questions, setQuestions] = useState(() => quizService.getQuestions());
  const [categories, setCategories] = useState(() => quizService.getCategories());

  const refresh = useCallback(() => {
    setQuizzes(quizService.getQuizzes());
    setQuestions(quizService.getQuestions());
    setCategories(quizService.getCategories());
  }, []);

  const addQuiz = useCallback((data) => {
    const result = quizService.createQuiz(data);
    if (result.success) refresh();
    return result;
  }, [refresh]);

  const editQuiz = useCallback((id, data) => {
    const result = quizService.updateQuiz(id, data);
    if (result.success) refresh();
    return result;
  }, [refresh]);

  const removeQuiz = useCallback((id) => {
    const result = quizService.deleteQuiz(id);
    if (result.success) refresh();
    return result;
  }, [refresh]);

  const addQuestion = useCallback((data) => {
    const result = quizService.createQuestion(data);
    if (result.success) refresh();
    return result;
  }, [refresh]);

  const editQuestion = useCallback((id, data) => {
    const result = quizService.updateQuestion(id, data);
    if (result.success) refresh();
    return result;
  }, [refresh]);

  const removeQuestion = useCallback((id) => {
    const result = quizService.deleteQuestion(id);
    if (result.success) refresh();
    return result;
  }, [refresh]);

  return (
    <QuizContext.Provider value={{
      quizzes, questions, categories, refresh,
      addQuiz, editQuiz, removeQuiz,
      addQuestion, editQuestion, removeQuestion,
    }}>
      {children}
    </QuizContext.Provider>
  );
}

export const useQuiz = () => {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error('useQuiz must be used within QuizProvider');
  return ctx;
};
