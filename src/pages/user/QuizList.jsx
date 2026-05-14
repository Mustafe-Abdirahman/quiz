import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiFilter } from 'react-icons/fi';
import UserLayout from '../../layouts/UserLayout';
import Input from '../../components/ui/Input';
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

  const quizQuestionCounts = useMemo(() => {
    const counts = {};
    questions.forEach(q => {
      if (q.quizId) {
        counts[q.quizId] = (counts[q.quizId] || 0) + 1;
      }
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

  const handlePlay = (quizId) => {
    navigate(`/user/play/${quizId}`);
  };

  return (
    <UserLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Available Quizzes</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Choose a quiz to test your knowledge</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input placeholder="Search quizzes..." icon={FiSearch} value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="w-full sm:w-44">
            <Select value={category} onChange={e => setCategory(e.target.value)}
              options={[{ value: '', label: 'All Categories' }, ...categories.map(c => ({ value: c.name, label: c.name }))]} />
          </div>
          <div className="w-full sm:w-40">
            <Select value={difficulty} onChange={e => setDifficulty(e.target.value)}
              options={[{ value: '', label: 'All Levels' }, { value: 'easy', label: 'Easy' }, { value: 'medium', label: 'Medium' }, { value: 'hard', label: 'Hard' }]} />
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={FiFilter} title="No quizzes match your filters" description="Try adjusting your search or filter criteria." />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
