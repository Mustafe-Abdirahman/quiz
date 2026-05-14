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
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatCard icon={FiBookOpen} label="Quizzes Taken" value={stats.totalQuizzes} color="indigo" />
      <StatCard icon={FiCheckCircle} label="Correct" value={stats.totalCorrect} color="green" />
      <StatCard icon={FiXCircle} label="Incorrect" value={stats.totalIncorrect} color="red" />
      <StatCard icon={FiTarget} label="Best Score" value={stats.bestScore} color="blue" />
      <StatCard icon={FiBarChart2} label="Avg Score" value={stats.averageScore} color="purple" />
      <StatCard icon={FiTarget} label="Accuracy" value={`${stats.totalAccuracy}%`} color="yellow" />
    </div>
  );
}
