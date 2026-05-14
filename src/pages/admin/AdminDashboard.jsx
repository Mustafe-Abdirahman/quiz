import { useMemo } from 'react';
import { FiUsers, FiBookOpen, FiBarChart2 } from 'react-icons/fi';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import AdminLayout from '../../layouts/AdminLayout';
import { AdminStats } from '../../components/dashboard/DashboardWidgets';
import Card from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { useQuiz } from '../../context/QuizContext';
import { quizService } from '../../services/quizService';
import { getInitials } from '../../utils/helpers';
import EmptyState from '../../components/common/EmptyState';

const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#22c55e', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6'];

export default function AdminDashboard() {
  const { user } = useAuth();
  const { quizzes, questions } = useQuiz();
  const allUsers = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('quiz_users')) || []; } catch { return []; }
  }, []);

  const allAttempts = useMemo(() => quizService.getAllAttempts(), []);

  const stats = useMemo(() => {
    const totalUsers = allUsers.length;
    const totalQuizzes = quizzes.length;
    const totalQuestions = questions.length;
    const totalAttempts = allAttempts.length;
    const totalScore = allAttempts.reduce((s, a) => s + a.score, 0);
    const avgScore = totalAttempts > 0 ? Math.round(totalScore / totalAttempts) : 0;

    const userScoreMap = {};
    allAttempts.forEach(a => {
      userScoreMap[a.userId] = (userScoreMap[a.userId] || 0) + a.score;
    });
    let bestPerformer = 'N/A';
    let bestScore = 0;
    Object.entries(userScoreMap).forEach(([uid, score]) => {
      if (score > bestScore) {
        bestScore = score;
        const u = allUsers.find(u => u.id === uid);
        if (u) bestPerformer = u.username;
      }
    });

    return { totalUsers, totalQuizzes, totalQuestions, totalAttempts, avgScore, bestPerformer };
  }, [allUsers, quizzes, questions, allAttempts]);

  const recentAttempts = useMemo(() => {
    return [...allAttempts].sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt)).slice(0, 5);
  }, [allAttempts]);

  const popularQuizzes = useMemo(() => {
    return [...quizzes].sort((a, b) => (b.playCount || 0) - (a.playCount || 0)).slice(0, 5);
  }, [quizzes]);

  const attemptsOverTime = useMemo(() => {
    const last30 = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      last30.push({ date: key, attempts: 0 });
    }
    allAttempts.forEach(a => {
      const day = a.completedAt?.slice(0, 10);
      const entry = last30.find(e => e.date === day);
      if (entry) entry.attempts++;
    });
    return last30.map(d => ({ ...d, date: d.date.slice(5) }));
  }, [allAttempts]);

  const quizPerformance = useMemo(() => {
    return quizzes.map(q => {
      const quizAttempts = allAttempts.filter(a => a.quizId === q.id);
      const avg = quizAttempts.length ? Math.round(quizAttempts.reduce((s, a) => s + a.score, 0) / quizAttempts.length) : 0;
      return { name: q.title.length > 12 ? q.title.slice(0, 12) + '...' : q.title, avgScore: avg, plays: quizAttempts.length };
    }).filter(q => q.plays > 0);
  }, [quizzes, allAttempts]);

  const difficultyData = useMemo(() => {
    const counts = { easy: 0, medium: 0, hard: 0 };
    questions.forEach(q => { counts[q.difficulty] = (counts[q.difficulty] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));
  }, [questions]);

  const categoryData = useMemo(() => {
    const counts = {};
    quizzes.forEach(q => { counts[q.category] = (counts[q.category] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [quizzes]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Welcome back, {user?.username}</p>
        </div>

        <AdminStats stats={stats} links={{ users: '/admin/users', quizzes: '/admin/quizzes', questions: '/admin/questions' }} />

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-5">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FiBarChart2 size={18} className="text-indigo-500" />
              Recent Activity
            </h3>
            {recentAttempts.length === 0 ? (
              <EmptyState icon={FiBarChart2} title="No attempts yet" description="Quiz attempts will appear here." />
            ) : (
              <div className="space-y-3">
                {recentAttempts.map(a => {
                  const u = allUsers.find(u => u.id === a.userId);
                  return (
                    <div key={a.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        {getInitials(u?.username || '?')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{u?.username || 'Unknown'}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{a.quizTitle} - Score: {a.score}/{a.totalQuestions}</p>
                      </div>
                      <span className="text-xs text-gray-400">{new Date(a.completedAt).toLocaleDateString()}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          <Card className="p-5">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FiBookOpen size={18} className="text-indigo-500" />
              Popular Quizzes
            </h3>
            {popularQuizzes.length === 0 ? (
              <EmptyState icon={FiBookOpen} title="No quizzes yet" description="Create quizzes to see them here." />
            ) : (
              <div className="space-y-3">
                {popularQuizzes.map(q => (
                  <div key={q.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <span className="text-2xl">{q.thumbnail || '📝'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{q.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{q.category} • {q.playCount || 0} plays</p>
                    </div>
                    <span className="text-xs font-medium text-gray-500">{q.difficulty}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FiBarChart2 size={16} className="text-indigo-500" />
              Attempts Over Time (30 days)
            </h3>
            {attemptsOverTime.every(d => d.attempts === 0) ? (
              <EmptyState icon={FiBarChart2} title="No data yet" description="Complete quizzes to see trends." />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={attemptsOverTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#9ca3af" interval="preserveStartEnd" />
                  <YAxis allowDecimals={false} tick={{ fontSize: 10 }} stroke="#9ca3af" />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Line type="monotone" dataKey="attempts" stroke="#6366f1" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Card>

          <Card className="p-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FiBookOpen size={16} className="text-indigo-500" />
              Quiz Performance (Avg Score)
            </h3>
            {quizPerformance.length === 0 ? (
              <EmptyState icon={FiBookOpen} title="No data yet" description="Complete quizzes to see performance." />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={quizPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="#9ca3af" />
                  <YAxis tick={{ fontSize: 10 }} stroke="#9ca3af" />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Bar dataKey="avgScore" fill="#6366f1" radius={[4, 4, 0, 0]} name="Avg Score" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Difficulty Distribution</h3>
            {difficultyData.every(d => d.value === 0) ? (
              <EmptyState icon={FiBarChart2} title="No questions yet" description="Add questions to see distribution." />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={difficultyData} cx="50%" cy="50%" outerRadius={80} innerRadius={40} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {difficultyData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Card>

          <Card className="p-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Quizzes by Category</h3>
            {categoryData.length === 0 ? (
              <EmptyState icon={FiBarChart2} title="No quizzes yet" description="Create quizzes to see categories." />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={categoryData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" tick={{ fontSize: 10 }} stroke="#9ca3af" />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} stroke="#9ca3af" width={90} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} name="Quizzes">
                    {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
