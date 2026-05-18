import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiCheck, FiX, FiAlertCircle, FiArrowLeft } from 'react-icons/fi';
import Timer from '../../components/common/Timer';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { quizService } from '../../services/quizService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { shuffleArray } from '../../utils/helpers';

export default function QuizPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [unanswered, setUnanswered] = useState(0);
  const [results, setResults] = useState([]);
  const [finished, setFinished] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [timerKey, setTimerKey] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [loading, setLoading] = useState(true);
  const [emptyQuiz, setEmptyQuiz] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const q = await quizService.getQuizById(id);
      if (!q) { navigate('/user/quizzes'); return; }
      if (cancelled) return;
      setQuiz(q);
      const qs = await quizService.getQuestionsByQuizId(id);
      if (cancelled) return;
      if (qs.length === 0) {
        setEmptyQuiz(true);
        setLoading(false);
        return;
      }
      setQuestions(shuffleArray(qs));
      setLoading(false);
      setStartTime(Date.now());
      await quizService.incrementPlayCount(id);
    }
    load();
    return () => { cancelled = true; };
  }, [id, navigate]);

  const handleAnswer = useCallback((idx) => {
    if (answered) return;
    setSelectedAnswer(idx);
    setAnswered(true);
    setIsRunning(false);

    const isCorrect = idx === questions[currentQ].correctAnswer;
    if (isCorrect) {
      setScore(s => s + 10);
      setCorrect(c => c + 1);
    } else {
      setIncorrect(c => c + 1);
    }

    setResults(prev => [...prev, {
      question: questions[currentQ].text,
      selected: idx,
      correct: questions[currentQ].correctAnswer,
      isCorrect,
    }]);
  }, [answered, questions, currentQ]);

  const handleTimeUp = useCallback(() => {
    if (answered) return;
    setAnswered(true);
    setIsRunning(false);
    setUnanswered(c => c + 1);
    const q = questions[currentQ];
    setResults(prev => [...prev, {
      question: q.text,
      selected: -1,
      correct: q.correctAnswer,
      isCorrect: false,
    }]);
  }, [answered, questions, currentQ]);

  const nextQuestion = useCallback(async () => {
    if (currentQ + 1 < questions.length) {
      setCurrentQ(c => c + 1);
      setSelectedAnswer(null);
      setAnswered(false);
      setIsRunning(true);
      setTimerKey(k => k + 1);
    } else {
      const timeTaken = Math.floor((Date.now() - startTime) / 1000);
      const total = questions.length;
      const correctCount = correct;
      const incorrectCount = incorrect;
      const unansweredCount = unanswered;

      await quizService.saveAttempt({
        userId: user?.userId,
        quizId: id,
        quizTitle: quiz?.title,
        score,
        totalQuestions: total,
        correct: correctCount,
        incorrect: incorrectCount,
        unanswered: unansweredCount,
        accuracy: total > 0 ? Math.round((correctCount / total) * 100) : 0,
        timeTaken,
        answers: results,
        mode: 'solo',
      });

      setFinished(true);
    }
  }, [currentQ, questions.length, startTime, correct, incorrect, unanswered, score, quiz, id, user, results]);

  useEffect(() => {
    if (finished) {
      addToast('Quiz completed!', 'success');
    }
  }, [finished, addToast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (emptyQuiz) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="p-8 text-center">
            <div className="p-4 bg-yellow-100 dark:bg-yellow-900/20 rounded-full inline-flex mb-4">
              <FiAlertCircle size={40} className="text-yellow-600 dark:text-yellow-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Questions Available</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              This quiz currently has no questions available.
            </p>
            <Button onClick={() => navigate('/user/quizzes')}>
              <FiArrowLeft size={16} /> Back to Quizzes
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  if (finished) {
    const total = questions.length;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(timeTaken / 60);
    const seconds = timeTaken % 60;

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center animate-scaleIn">
            <div className="text-5xl mb-4">{accuracy >= 80 ? '🏆' : accuracy >= 50 ? '🎉' : '💪'}</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Quiz Complete!</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">{quiz?.title}</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{score}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Score</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{accuracy}%</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Accuracy</p>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Correct</span>
                <span className="font-medium text-green-600 dark:text-green-400">{correct}/{total}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Incorrect</span>
                <span className="font-medium text-red-600 dark:text-red-400">{incorrect}/{total}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Unanswered</span>
                <span className="font-medium text-gray-600 dark:text-gray-400">{unanswered}/{total}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Time Taken</span>
                <span className="font-medium text-gray-900 dark:text-white">{minutes}:{seconds.toString().padStart(2, '0')}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => navigate('/user/quizzes')} className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                Back to Quizzes
              </button>
              <button onClick={() => navigate(`/user/play/${id}`)} className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                Play Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQ];
  if (!question) return null;
  const isTrueFalse = question.type === 'truefalse';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{quiz?.thumbnail || '📝'}</span>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">{quiz?.title}</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Question {currentQ + 1} of {questions.length}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{score} pts</p>
            </div>
          </div>

          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full transition-all duration-300" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }} />
          </div>
        </div>

        <Timer
          key={timerKey}
          duration={quiz?.timePerQuestion || 60}
          onTimeUp={handleTimeUp}
          isRunning={isRunning}
        />

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mt-4 animate-fadeIn">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
              {(() => {
                const parts = question.text.split(/_{3,}/);
                return parts.map((part, i) =>
                  i === 0 ? part : (
                    <span key={i}>
                      <span className="px-3 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded border-2 border-dashed border-indigo-300 dark:border-indigo-600 font-semibold">
                        {answered ? question.options[selectedAnswer] : '______'}
                      </span>
                      {part}
                    </span>
                  )
                );
              })()}
            </h2>

            <div className="space-y-3">
              {question.options.map((opt, idx) => {
                let btnClass = 'border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20';

                if (answered) {
                  if (idx === question.correctAnswer) {
                    btnClass = 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400';
                  } else if (idx === selectedAnswer && idx !== question.correctAnswer) {
                    btnClass = 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400';
                  } else {
                    btnClass = 'border-gray-200 dark:border-gray-600 opacity-50';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={answered}
                    className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all duration-200 flex items-center gap-3 ${btnClass}`}
                  >
                    <span className="w-7 h-7 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold shrink-0">
                      {isTrueFalse ? (idx === 0 ? 'T' : 'F') : String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1 text-sm font-medium">{opt}</span>
                    {answered && idx === question.correctAnswer && <FiCheck className="text-green-500 shrink-0" size={18} />}
                    {answered && idx === selectedAnswer && idx !== question.correctAnswer && <FiX className="text-red-500 shrink-0" size={18} />}
                  </button>
                );
              })}
            </div>

            {answered && (
              <div className="mt-6 animate-fadeIn">
                {selectedAnswer === question.correctAnswer ? (
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-sm text-green-700 dark:text-green-400 font-medium flex items-center gap-2">
                    <FiCheck size={16} /> Correct!
                  </div>
                ) : (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-sm text-red-700 dark:text-red-400 font-medium flex items-center gap-2">
                    <FiX size={16} /> Incorrect! The correct answer was: {question.options[question.correctAnswer]}
                  </div>
                )}
              </div>
            )}
            {answered && (
              <button
                onClick={nextQuestion}
                className="mt-4 w-full px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                {currentQ + 1 < questions.length ? 'Next Question' : 'See Results'}
              </button>
            )}
        </div>
      </div>
    </div>
  );
}
