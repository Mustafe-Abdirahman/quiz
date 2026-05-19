import { FiClock, FiPlay, FiAlertCircle, FiUsers, FiBarChart2 } from 'react-icons/fi';
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
    <div className={`group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden transition-all duration-300 ${
      hasQuestions
        ? 'hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-0.5'
        : 'opacity-75'
    }`}>
      <div className={`h-2 bg-gradient-to-r ${cfg.gradient}`} />

      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 flex items-center justify-center text-2xl shrink-0 shadow-sm">
            {quiz.thumbnail || '📝'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className={`font-semibold text-base leading-tight transition-colors truncate ${
                hasQuestions
                  ? 'text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {quiz.title}
              </h3>
              <Badge variant={cfg.badge} className="shrink-0 mt-0.5 capitalize">{cfg.label}</Badge>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{quiz.category}</p>
          </div>
        </div>

        {quiz.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">
            {quiz.description}
          </p>
        )}

        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className={`p-2.5 rounded-xl text-center transition-colors ${
            hasQuestions
              ? 'bg-indigo-50 dark:bg-indigo-900/20'
              : 'bg-gray-50 dark:bg-gray-700/50'
          }`}>
            <p className={`text-lg font-extrabold ${hasQuestions ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500'}`}>
              {qCount}
            </p>
            <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-0.5">Questions</p>
          </div>
          <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-center">
            <p className="text-lg font-extrabold text-gray-700 dark:text-gray-300">{quiz.timePerQuestion}s</p>
            <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-0.5">Per Q</p>
          </div>
          <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-center">
            <p className="text-lg font-extrabold text-gray-700 dark:text-gray-300">{quiz.playCount || 0}</p>
            <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-0.5">Plays</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500 mb-4">
          <span className="flex items-center gap-1"><FiClock size={12} /> {quiz.timePerQuestion}s</span>
          <span className="flex items-center gap-1"><FiUsers size={12} /> {quiz.maxPlayers || 4}p</span>
          <span className="flex items-center gap-1"><FiBarChart2 size={12} /> {qCount} Q</span>
        </div>

        {admin ? null : onPlay ? (
          hasQuestions ? (
            <Button onClick={() => onPlay(quiz.id)} size="sm" className="w-full">
              <FiPlay size={14} />
              Play Now
            </Button>
          ) : (
            <div className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-xs text-gray-500 dark:text-gray-400 cursor-not-allowed">
              <FiAlertCircle size={14} />
              No questions available yet
            </div>
          )
        ) : null}
      </div>
    </div>
  );
}