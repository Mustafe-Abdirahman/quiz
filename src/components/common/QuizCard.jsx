import { FiClock, FiPlay, FiAlertCircle } from 'react-icons/fi';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

const difficultyColors = {
  easy: 'from-green-500 to-green-600',
  medium: 'from-yellow-500 to-yellow-600',
  hard: 'from-red-500 to-red-600',
};

export default function QuizCard({ quiz, onPlay, questionCount }) {
  const qCount = questionCount ?? quiz?.totalQuestions ?? quiz?.questions?.length ?? 0;
  const hasQuestions = qCount > 0;

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden group ${hasQuestions ? 'hover:shadow-md transition-all duration-200' : 'opacity-75'}`}>
      <div className={`h-2 bg-gradient-to-r ${difficultyColors[quiz.difficulty] || 'from-indigo-500 to-indigo-600'}`} />
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{quiz.thumbnail || '📝'}</span>
            <div>
              <h3 className={`font-semibold transition-colors ${hasQuestions ? 'text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400' : 'text-gray-500 dark:text-gray-400'}`}>
                {quiz.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{quiz.category}</p>
            </div>
          </div>
        </div>
        {quiz.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{quiz.description}</p>
        )}
        <div className="flex items-center gap-2 mb-4">
          <Badge variant={quiz.difficulty}>{quiz.difficulty}</Badge>
          <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <FiClock size={12} />
            {quiz.timePerQuestion}s
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {qCount} {qCount === 1 ? 'question' : 'questions'}
          </span>
        </div>
        {onPlay && (
          hasQuestions ? (
            <Button onClick={() => onPlay(quiz.id)} size="sm" className="w-full">
              <FiPlay size={14} />
              Play Now
            </Button>
          ) : (
            <div className="flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs text-gray-500 dark:text-gray-400 cursor-not-allowed">
              <FiAlertCircle size={14} />
              This quiz currently has no questions available.
            </div>
          )
        )}
      </div>
    </div>
  );
}
