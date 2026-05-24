import { useState, useMemo } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiBookOpen, FiSearch, FiCopy } from 'react-icons/fi';
import AdminLayout from '../../layouts/AdminLayout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { useQuiz } from '../../context/QuizContext';
import { useToast } from '../../components/ui/Toast';
import { useAuth } from '../../context/AuthContext';
import QuizCard from '../../components/common/QuizCard';

const difficultyConfig = {
  easy: { gradient: 'from-emerald-500 to-emerald-600', badge: 'success', label: 'Easy' },
  medium: { gradient: 'from-amber-500 to-amber-600', badge: 'warning', label: 'Medium' },
  hard: { gradient: 'from-rose-500 to-rose-600', badge: 'danger', label: 'Hard' },
};

export default function QuizManagement() {
  const { quizzes, questions, categories, addQuiz, editQuiz, removeQuiz } = useQuiz();
  const { addToast } = useToast();
  const { user } = useAuth();
  const [modal, setModal] = useState({ open: false, mode: 'create', quiz: null });
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [search, setSearch] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const [form, setForm] = useState({
    title: '', description: '', category: 'General', difficulty: 'medium',
    timePerQuestion: 60, thumbnail: '📝', maxPlayers: 4,
    startMode: 'manual', scheduledStart: '',
  });

  const openCreate = () => {
    setForm({ title: '', description: '', category: 'General', difficulty: 'medium', timePerQuestion: 60, thumbnail: '📝', maxPlayers: 4, startMode: 'manual', scheduledStart: '' });
    setModal({ open: true, mode: 'create', quiz: null });
  };

  const openEdit = (quiz) => {
    setForm({
      title: quiz.title, description: quiz.description || '', category: quiz.category,
      difficulty: quiz.difficulty, timePerQuestion: quiz.timePerQuestion, thumbnail: quiz.thumbnail || '📝',
      maxPlayers: quiz.maxPlayers || 4, startMode: quiz.startMode || 'manual',
      scheduledStart: quiz.scheduledStart ? quiz.scheduledStart.slice(0, 16) : '',
    });
    setModal({ open: true, mode: 'edit', quiz });
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) { addToast('Title is required', 'error'); return; }
    if (modal.mode === 'create') {
      await addQuiz({ ...form, createdBy: user?.userId });
      addToast('Quiz created successfully! Now add questions to it.', 'success');
    } else {
      await editQuiz(modal.quiz.id, form);
      addToast('Quiz updated', 'success');
    }
    setModal({ open: false, mode: 'create', quiz: null });
  };

  const handleDelete = async (quiz) => {
    setConfirmDelete(quiz);
  };

  const confirmDeleteQuiz = async () => {
    if (!confirmDelete) return;
    await removeQuiz(confirmDelete.id);
    addToast('Quiz deleted', 'success');
    setConfirmDelete(null);
  };

  const getQuestionCount = (quiz) => questions.filter(q => q.quizId === quiz.id).length;

  const difficultyOptions = [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' },
  ];

  const categoryOptions = categories.map(c => ({ value: c.name, label: `${c.icon || ''} ${c.name}` }));

  const filtered = useMemo(() => {
    let result = [...quizzes].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(x => x.title.toLowerCase().includes(q) || (x.description || '').toLowerCase().includes(q));
    }
    if (difficultyFilter) result = result.filter(x => x.difficulty === difficultyFilter);
    if (categoryFilter) result = result.filter(x => x.category === categoryFilter);
    return result;
  }, [quizzes, search, difficultyFilter, categoryFilter]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <FiBookOpen size={20} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Quiz Management</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">{quizzes.length} quizzes &bull; {questions.length} questions</p>
            </div>
          </div>
          <Button onClick={openCreate}><FiPlus size={16} /> Create</Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search quizzes..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-shadow"
            />
          </div>
          <div className="w-full sm:w-44">
            <Select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
              options={[{ value: '', label: 'All Categories' }, ...categoryOptions.length ? categoryOptions : [{ value: 'General', label: 'General' }]]} />
          </div>
          <div className="w-full sm:w-36">
            <Select value={difficultyFilter} onChange={e => setDifficultyFilter(e.target.value)}
              options={[{ value: '', label: 'All Levels' }, { value: 'easy', label: 'Easy' }, { value: 'medium', label: 'Medium' }, { value: 'hard', label: 'Hard' }]} />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-600 p-12">
            <EmptyState
              icon={quizzes.length === 0 ? FiPlus : FiSearch}
              title={quizzes.length === 0 ? 'No quizzes yet' : 'No quizzes match'}
              description={quizzes.length === 0 ? 'Create your first quiz to get started.' : 'Try adjusting your search or filters.'}
              action={quizzes.length === 0 ? <Button onClick={openCreate}><FiPlus size={16} /> Create Quiz</Button> : undefined}
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {filtered.map(q => (
              <div key={q.id}>
                <QuizCard quiz={q} questionCount={getQuestionCount(q)} admin onEdit={() => openEdit(q)} onDelete={() => handleDelete(q)} />
                <div className="mt-1.5 flex items-center gap-2 px-0.5">
                  <div className="flex-1 h-1 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${
                      difficultyConfig[q.difficulty]?.gradient || 'from-indigo-500 to-indigo-600'
                    }`} style={{ width: `${Math.min(100, (getQuestionCount(q) / Math.max(...filtered.map(x => getQuestionCount(x)), 1)) * 100)}%` }} />
                  </div>
                  <span className="text-[9px] font-medium text-gray-400 dark:text-gray-500 shrink-0">{getQuestionCount(q)}Q</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <Modal isOpen={modal.open} onClose={() => setModal({ open: false })} title={modal.mode === 'create' ? 'Create Quiz' : 'Edit Quiz'}>
          <div className="space-y-4">
            <Input label="Quiz Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Enter quiz title" />
            <Input label="Quiz Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Short description of the quiz" />
            <div className="grid grid-cols-2 gap-4">
              <Select label="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                options={categoryOptions.length ? categoryOptions : [{ value: 'General', label: 'General' }]} />
              <Select label="Difficulty" value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })} options={difficultyOptions} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Timer (seconds)" type="number" min="10" max="300" value={form.timePerQuestion}
                onChange={e => setForm({ ...form, timePerQuestion: Number(e.target.value) })} />
              <Input label="Thumbnail (emoji)" value={form.thumbnail} onChange={e => setForm({ ...form, thumbnail: e.target.value })} placeholder="📝" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Max Players</label>
              <div className="flex gap-1.5 sm:gap-2 flex-wrap justify-center sm:justify-start">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                  <button key={n} type="button" onClick={() => setForm({ ...form, maxPlayers: n })}
                    className={`min-w-[44px] min-h-[44px] sm:w-10 sm:h-10 rounded-lg text-xs sm:text-sm font-medium border-2 transition-all ${
                      form.maxPlayers === n
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 shadow-sm'
                        : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}>
                    {n}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400">Players allowed in multiplayer mode</p>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Start Mode</label>
              <div className="flex gap-2">
                <button type="button" onClick={() => setForm({ ...form, startMode: 'manual', scheduledStart: '' })}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium border-2 transition-all ${
                    form.startMode === 'manual'
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                      : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}>
                  Manual Start
                </button>
                <button type="button" onClick={() => setForm({ ...form, startMode: 'scheduled' })}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium border-2 transition-all ${
                    form.startMode === 'scheduled'
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                      : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}>
                  Scheduled
                </button>
              </div>
            </div>

            {form.startMode === 'scheduled' && (
              <Input label="Scheduled Start" type="datetime-local" value={form.scheduledStart}
                onChange={e => setForm({ ...form, scheduledStart: e.target.value })} />
            )}

            {modal.mode === 'edit' && (
              <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-sm text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
                <FiCopy size={14} />
                Total Questions: {getQuestionCount(modal.quiz)}
              </div>
            )}
            <Button onClick={handleSubmit} className="w-full">
              {modal.mode === 'create' ? 'Create Quiz' : 'Save Changes'}
            </Button>
          </div>
        </Modal>

        <ConfirmDialog
          isOpen={!!confirmDelete}
          onClose={() => setConfirmDelete(null)}
          onConfirm={confirmDeleteQuiz}
          title="Delete Quiz"
          message={confirmDelete ? `Are you sure you want to delete "${confirmDelete.title}"? This will also remove all associated questions.` : ''}
        />
      </div>
    </AdminLayout>
  );
}