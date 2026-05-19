import { FiClock, FiPlay, FiAlertCircle, FiUsers } from 'react-icons/fi';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

const difficultyConfig = {
  easy: { gradient: 'from-emerald-500 to-emerald-600', badge: 'success', label: 'Easy' },
  medium: { gradient: 'from-amber-500 to-amber-600', badge: 'warning', label: 'Medium' },
  hard: { gradient: 'from-rose-500 to-rose-600', badge: 'danger', label: 'Hard' },
};

export default function QuizCard({ quiz, onPlay, questionCount, admin }) {
  const qCount = questionCount ?? quiz?.totalQuestions ?? quiz?.questions?.length ?? 0;
  const hasQuestions = qCount > 0;
  const cfg = difficultyConfig[quiz.difficulty] || difficultyConfig.medium;

  return (
    <div className={`group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden transition-all duration-200 ${
      hasQuestions
        ? 'hover:shadow-md hover:-translate-y-0.5'
        : 'opacity-75'
    }`}>
      <div className={`h-1.5 bg-gradient-to-r ${cfg.gradient}`} />

      <div className="p-4">
        <div className="flex items-start gap-2.5 mb-2.5">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 flex items-center justify-center text-lg shrink-0 shadow-sm">
            {quiz.thumbnail || '📝'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-1.5">
              <h3 className={`text-sm font-semibold leading-tight truncate transition-colors ${
                hasQuestions
                  ? 'text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {quiz.title}
              </h3>
              <Badge variant={cfg.badge} className="shrink-0 mt-0.5 text-[10px] px-1.5 py-0.5 capitalize">{cfg.label}</Badge>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 truncate">{quiz.category}</p>
          </div>
        </div>

        {quiz.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2 leading-relaxed">{quiz.description}</p>
        )}

        <div className="flex items-center gap-3 mb-3 text-[11px] text-gray-400 dark:text-gray-500">
          <span className="flex items-center gap-1"><FiClock size={11} /> {quiz.timePerQuestion}s</span>
          <span className="flex items-center gap-1"><FiUsers size={11} /> {quiz.maxPlayers || 4}p</span>
          <span className="font-medium text-gray-600 dark:text-gray-300">{qCount} Q</span>
          <span className="ml-auto text-[11px]">{quiz.playCount || 0} plays</span>
        </div>

        {admin ? null : onPlay ? (
          hasQuestions ? (
            <Button onClick={() => onPlay(quiz.id)} size="xs" className="w-full text-xs py-1.5">
              <FiPlay size={12} />
              Play Now
            </Button>
          ) : (
            <div className="flex items-center justify-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-[11px] text-gray-500 dark:text-gray-400 cursor-not-allowed">
              <FiAlertCircle size={12} />
              No questions yet
            </div>
          )
        ) : null}
      </div>
    </div>
  );
}