import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiClock, FiAward, FiBookOpen, FiCheckCircle, FiXCircle, FiTarget, FiBarChart2, FiZap } from 'react-icons/fi';
import UserLayout from '../../layouts/UserLayout';
import Card from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { quizService } from '../../services/quizService';
import EmptyState from '../../components/common/EmptyState';

export default function UserDashboard() {
  const { user } = useAuth();
  const [attempts, setAttempts] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!user?.userId) return;
    async function load() {
      try {
        const [attemptsData, statsData] = await Promise.all([
          quizService.getUserAttempts(user.userId),
          quizService.getUserStats(user.userId),
        ]);
        setAttempts(attemptsData);
        setStats(statsData);
      } catch {
        setStats(null);
      }
    }
    load();
  }, [user]);

  const recentAttempts = useMemo(() => {
    return [...attempts].sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt)).slice(0, 5);
  }, [attempts]);

  const s = stats || { totalQuizzes: 0, totalCorrect: 0, totalIncorrect: 0, bestScore: 0, averageScore: 0, totalAccuracy: 0 };
  const totalQ = s.totalCorrect + s.totalIncorrect;

  return (
    <UserLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome, {user?.username}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Here's your quiz performance overview</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"><FiBookOpen size={16} /></div>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Quizzes Taken</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{s.totalQuizzes}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"><FiCheckCircle size={16} /></div>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Correct</span>
            </div>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{s.totalCorrect}</p>
            {totalQ > 0 && <p className="text-xs text-gray-400 mt-0.5">{Math.round((s.totalCorrect / totalQ) * 100)}% of answers</p>}
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"><FiXCircle size={16} /></div>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Incorrect</span>
            </div>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{s.totalIncorrect}</p>
            {totalQ > 0 && <p className="text-xs text-gray-400 mt-0.5">{Math.round((s.totalIncorrect / totalQ) * 100)}% of answers</p>}
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"><FiTarget size={16} /></div>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Best Score</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{s.bestScore}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"><FiBarChart2 size={16} /></div>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Avg Score</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{s.averageScore}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400"><FiZap size={16} /></div>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Accuracy</span>
            </div>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{s.totalAccuracy}%</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <FiClock size={18} className="text-indigo-500" />
                Recent Quizzes
              </h3>
              <Link to="/user/quizzes" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                View All <FiArrowRight size={14} />
              </Link>
            </div>
            {recentAttempts.length === 0 ? (
              <EmptyState icon={FiClock} title="No quizzes taken" description="Start a quiz to see your history here." action={<Link to="/user/quizzes" className="text-sm text-indigo-600 hover:underline">Browse Quizzes</Link>} />
            ) : (
              <div className="space-y-3">
                {recentAttempts.map(a => (
                  <div key={a.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{a.quizTitle}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Score: {a.score}/{a.totalQuestions} &bull; Accuracy: {a.accuracy}% &bull; {new Date(a.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${a.accuracy >= 70 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : a.accuracy >= 40 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                      {a.accuracy}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <FiAward size={18} className="text-indigo-500" />
                Leaderboard
              </h3>
              <Link to="/user/leaderboard" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                View All <FiArrowRight size={14} />
              </Link>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Check your ranking against all players on the leaderboard.</p>
            <Link to="/user/leaderboard" className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
              Go to Leaderboard <FiArrowRight size={14} />
            </Link>
          </Card>
        </div>
      </div>
    </UserLayout>
  );
}
