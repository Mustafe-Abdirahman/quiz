import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiBookOpen, FiChevronDown, FiChevronUp, FiSliders } from 'react-icons/fi';
import UserLayout from '../../layouts/UserLayout';
import Select from '../../components/ui/Select';
import QuizCard from '../../components/common/QuizCard';
import EmptyState from '../../components/common/EmptyState';
import { useQuiz } from '../../context/QuizContext';

export default function QuizList() {
  const navigate = useNavigate();
  const { quizzes, questions, categories } = useQuiz();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const quizQuestionCounts = useMemo(() => {
    const counts = {};
    questions.forEach(q => {
      if (q.quizId) counts[q.quizId] = (counts[q.quizId] || 0) + 1;
    });
    return counts;
  }, [questions]);

  const filtered = useMemo(() => {
    let result = quizzes;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(x => x.title.toLowerCase().includes(q) || (x.description || '').toLowerCase().includes(q));
    }
    if (category) result = result.filter(x => x.category === category);
    if (difficulty) result = result.filter(x => x.difficulty === difficulty);
    return result;
  }, [quizzes, search, category, difficulty]);

  const handlePlay = (quizId) => navigate(`/user/play/${quizId}`);

  const hasActiveFilters = search || category || difficulty;

  return (
    <UserLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-violet-500 to-indigo-600 rounded-2xl p-6 sm:p-8 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <FiBookOpen size={24} />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold">Available Quizzes</h1>
          </div>
          <p className="text-indigo-100 text-sm sm:text-base max-w-xl">
            Choose a quiz to test your knowledge. {quizzes.length} quiz{quizzes.length !== 1 ? 'zes' : ''} available.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search quizzes by title or description..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-shadow"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2.5 rounded-xl border transition-all ${
                  showFilters || hasActiveFilters
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400'
                    : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <FiSliders size={18} />
              </button>
            </div>

            <div className={`overflow-hidden transition-all duration-300 ${showFilters ? 'mt-4 max-h-20' : 'max-h-0'}`}>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 sm:flex-none sm:w-48">
                  <Select value={category} onChange={e => setCategory(e.target.value)}
                    options={[{ value: '', label: 'All Categories' }, ...categories.map(c => ({ value: c.name, label: c.name }))]} />
                </div>
                <div className="flex-1 sm:flex-none sm:w-40">
                  <Select value={difficulty} onChange={e => setDifficulty(e.target.value)}
                    options={[{ value: '', label: 'All Levels' }, { value: 'easy', label: 'Easy' }, { value: 'medium', label: 'Medium' }, { value: 'hard', label: 'Hard' }]} />
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={() => { setSearch(''); setCategory(''); setDifficulty(''); }}
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline shrink-0 self-center sm:self-auto"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-600 p-12 sm:p-16">
            <EmptyState
              icon={FiSearch}
              title="No quizzes found"
              description={hasActiveFilters ? 'Try adjusting your search or filter criteria.' : 'No quizzes are available yet. Check back later!'}
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {filtered.map(quiz => (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                onPlay={handlePlay}
                questionCount={quizQuestionCounts[quiz.id] || 0}
              />
            ))}
          </div>
        )}
      </div>
    </UserLayout>
  );
}