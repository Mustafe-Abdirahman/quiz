import { FiPlay, FiClock, FiAlertCircle, FiEdit2, FiTrash2 } from 'react-icons/fi';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

const difficultyConfig = {
  easy: { gradient: 'from-emerald-500 to-emerald-600', badge: 'success', label: 'Easy' },
  medium: { gradient: 'from-amber-500 to-amber-600', badge: 'warning', label: 'Medium' },
  hard: { gradient: 'from-rose-500 to-rose-600', badge: 'danger', label: 'Hard' },
};

function formatScheduledTime(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function isScheduledAvailable(dateStr) {
  if (!dateStr) return true;
  return new Date(dateStr) <= new Date();
}

export default function QuizCard({ quiz, onPlay, questionCount, admin, onEdit, onDelete }) {
  const qCount = questionCount ?? quiz?.totalQuestions ?? quiz?.questions?.length ?? 0;
  const hasQuestions = qCount > 0;
  const cfg = difficultyConfig[quiz.difficulty] || difficultyConfig.medium;
  const isScheduled = quiz.startMode === 'scheduled' && quiz.scheduledStart;
  const isAvailable = isScheduled ? isScheduledAvailable(quiz.scheduledStart) : true;
  const scheduledPast = isScheduled && isAvailable;

  return (
    <div className={`group bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden transition-all duration-200 ${
      hasQuestions && (admin || isAvailable) ? 'hover:shadow-md' : 'opacity-75'
    }`}>
      <div className={`h-1 bg-gradient-to-r ${isScheduled && !scheduledPast ? 'from-purple-500 to-violet-600' : cfg.gradient}`} />
      <div className="p-3">
        <div className="flex items-start gap-2 mb-2">
          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 flex items-center justify-center text-sm shrink-0">
            {quiz.thumbnail || '📝'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-1">
              <h3 className={`text-xs font-semibold leading-tight truncate transition-colors ${
                hasQuestions && (admin || isAvailable)
                  ? 'text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {quiz.title}
              </h3>
              <div className="flex items-center gap-1 shrink-0">
                {isScheduled && (
                  <Badge variant={scheduledPast ? 'success' : 'warning'} className="shrink-0 text-[9px] px-1 py-0.5 leading-none flex items-center gap-0.5">
                    <FiClock size={8} />
                    {scheduledPast ? 'Live' : 'Scheduled'}
                  </Badge>
                )}
                <Badge variant={cfg.badge} className="shrink-0 text-[9px] px-1 py-0.5 capitalize leading-none">{cfg.label}</Badge>
              </div>
            </div>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">{quiz.category}</p>
          </div>
        </div>

        {quiz.description && (
          <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-2 line-clamp-1 leading-relaxed">{quiz.description}</p>
        )}

        <div className="flex items-center gap-2 mb-2 text-[10px] text-gray-400 dark:text-gray-500">
          <span className="font-medium text-gray-600 dark:text-gray-300">{qCount} Q</span>
          <span>&middot;</span>
          <span>{quiz.timePerQuestion}s</span>
          {isScheduled && !scheduledPast && (
            <>
              <span>&middot;</span>
              <span className="text-purple-600 dark:text-purple-400 flex items-center gap-0.5">
                <FiClock size={9} />
                {formatScheduledTime(quiz.scheduledStart)}
              </span>
            </>
          )}
          <span className="ml-auto flex items-center gap-1.5">
            {admin && (
              <span className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity mr-1">
                <button onClick={(e) => { e.stopPropagation(); onEdit?.(quiz); }}
                  className="p-0.5 rounded text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  title="Edit quiz"
                >
                  <FiEdit2 size={11} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); onDelete?.(quiz); }}
                  className="p-0.5 rounded text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  title="Delete quiz"
                >
                  <FiTrash2 size={11} />
                </button>
              </span>
            )}
            <span>{quiz.playCount || 0} plays</span>
          </span>
        </div>

        {!admin && onPlay ? (
          hasQuestions && isAvailable ? (
            <Button onClick={() => onPlay(quiz.id)} size="xs" className="w-full text-[10px] min-h-[44px]">
              <FiPlay size={10} />
              {scheduledPast ? 'Play Now' : 'Play Now'}
            </Button>
          ) : (
            <div className="flex items-center justify-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-[10px] text-gray-500 dark:text-gray-400 cursor-not-allowed">
              {isScheduled && !scheduledPast ? (
                <><FiClock size={10} /> Starts {formatScheduledTime(quiz.scheduledStart)}</>
              ) : (
                <><FiAlertCircle size={10} /> No questions yet</>
              )}
            </div>
          )
        ) : null}
      </div>
    </div>
  );
}