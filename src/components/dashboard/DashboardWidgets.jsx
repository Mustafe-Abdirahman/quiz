import { FiUsers, FiBookOpen, FiCheckCircle, FiXCircle, FiTarget, FiBarChart2 } from 'react-icons/fi';
import StatCard from '../ui/StatCard';

export function AdminStats({ stats, links = {} }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatCard icon={FiUsers} label="Total Users" value={stats.totalUsers} color="indigo" to={links.users} />
      <StatCard icon={FiBookOpen} label="Total Quizzes" value={stats.totalQuizzes} color="blue" to={links.quizzes} />
      <StatCard icon={FiCheckCircle} label="Total Questions" value={stats.totalQuestions} color="green" to={links.questions} />
      <StatCard icon={FiBarChart2} label="Total Attempts" value={stats.totalAttempts} color="purple" />
      <StatCard icon={FiTarget} label="Avg Score" value={stats.avgScore} color="yellow" subtext={`${stats.totalAttempts} attempts`} />
      <StatCard icon={FiUsers} label="Best Performer" value={stats.bestPerformer || 'N/A'} color="green" />
    </div>
  );
}

export function UserStats({ stats }) {
  const s = stats || { totalQuizzes: 0, totalCorrect: 0, totalIncorrect: 0, bestScore: 0, averageScore: 0, totalAccuracy: 0 };
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatCard icon={FiBookOpen} label="Quizzes Taken" value={s.totalQuizzes} color="indigo" />
      <StatCard icon={FiCheckCircle} label="Correct" value={s.totalCorrect} color="green" />
      <StatCard icon={FiXCircle} label="Incorrect" value={s.totalIncorrect} color="red" />
      <StatCard icon={FiTarget} label="Best Score" value={s.bestScore} color="blue" />
      <StatCard icon={FiBarChart2} label="Avg Score" value={s.averageScore} color="purple" />
      <StatCard icon={FiTarget} label="Accuracy" value={`${s.totalAccuracy}%`} color="yellow" />
    </div>
  );
}
