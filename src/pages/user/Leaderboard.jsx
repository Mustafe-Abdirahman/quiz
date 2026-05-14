import { useMemo } from 'react';
import { FiAward } from 'react-icons/fi';
import UserLayout from '../../layouts/UserLayout';
import Card from '../../components/ui/Card';
import EmptyState from '../../components/common/EmptyState';
import { quizService } from '../../services/quizService';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/helpers';

export default function Leaderboard() {
  const { user } = useAuth();
  const leaderboard = useMemo(() => quizService.getLeaderboard(), []);

  const getRankStyle = (i) => {
    if (i === 0) return 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-400';
    if (i === 1) return 'bg-gray-100 dark:bg-gray-700 border-gray-400';
    if (i === 2) return 'bg-orange-100 dark:bg-orange-900/30 border-orange-400';
    return 'border-transparent';
  };

  const getMedal = (i) => {
    if (i === 0) return '🥇';
    if (i === 1) return '🥈';
    if (i === 2) return '🥉';
    return `#${i + 1}`;
  };

  return (
    <UserLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FiAward className="text-yellow-500" />
            Leaderboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Top performing players</p>
        </div>

        {leaderboard.length === 0 ? (
          <EmptyState icon={FiAward} title="No rankings yet" description="Complete quizzes to appear on the leaderboard." />
        ) : (
          <Card className="overflow-hidden">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {leaderboard.map((entry, i) => {
                const isMe = entry.userId === user?.userId;
                return (
                  <div key={entry.userId} className={`flex items-center gap-4 p-4 ${getRankStyle(i)} ${isMe ? 'ring-2 ring-indigo-500' : ''}`}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shrink-0">
                      {i < 3 ? <span className="text-2xl">{getMedal(i)}</span> : <span className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-sm text-gray-600 dark:text-gray-400 font-bold">{i + 1}</span>}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-sm font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
                      {getInitials(entry.username)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{entry.username}</p>
                        {isMe && <span className="text-xs px-1.5 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded font-medium">You</span>}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {entry.attempts} quizzes • {entry.totalCorrect} correct • {entry.accuracy}% accuracy
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{entry.totalScore}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">points</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>
    </UserLayout>
  );
}
