import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { quizService } from '../services/quizService';

const QuizContext = createContext(null);

export function QuizProvider({ children }) {
  const [quizzes, setQuizzes] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAll = useCallback(async () => {
    setLoading(true);
    const [q, qs, cats] = await Promise.all([
      quizService.getQuizzes(),
      quizService.getQuestions(),
      quizService.getCategories(),
    ]);
    setQuizzes(q);
    setQuestions(qs);
    setCategories(cats);
    setLoading(false);
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const refresh = useCallback(() => { loadAll(); }, [loadAll]);

  const addQuiz = useCallback(async (data) => {
    const result = await quizService.createQuiz(data);
    if (result.success) refresh();
    return result;
  }, [refresh]);

  const editQuiz = useCallback(async (id, data) => {
    const result = await quizService.updateQuiz(id, data);
    if (result.success) refresh();
    return result;
  }, [refresh]);

  const removeQuiz = useCallback(async (id) => {
    const result = await quizService.deleteQuiz(id);
    if (result.success) refresh();
    return result;
  }, [refresh]);

  const addQuestion = useCallback(async (data) => {
    const result = await quizService.createQuestion(data);
    if (result.success) refresh();
    return result;
  }, [refresh]);

  const editQuestion = useCallback(async (id, data) => {
    const result = await quizService.updateQuestion(id, data);
    if (result.success) refresh();
    return result;
  }, [refresh]);

  const removeQuestion = useCallback(async (id) => {
    const result = await quizService.deleteQuestion(id);
    if (result.success) refresh();
    return result;
  }, [refresh]);

  return (
    <QuizContext.Provider value={{
      quizzes, questions, categories, loading, refresh,
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
