import { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import AdminLayout from '../../layouts/AdminLayout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Modal from '../../components/ui/Modal';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/common/EmptyState';
import { useQuiz } from '../../context/QuizContext';
import { useToast } from '../../components/ui/Toast';
import { useAuth } from '../../context/AuthContext';

export default function QuizManagement() {
  const { quizzes, questions, categories, addQuiz, editQuiz, removeQuiz } = useQuiz();
  const { addToast } = useToast();
  const { user } = useAuth();
  const [modal, setModal] = useState({ open: false, mode: 'create', quiz: null });
  const [form, setForm] = useState({
    title: '', description: '', category: 'General', difficulty: 'medium',
    timePerQuestion: 60, thumbnail: '📝', maxPlayers: 4,
  });

  const openCreate = () => {
    setForm({ title: '', description: '', category: 'General', difficulty: 'medium', timePerQuestion: 60, thumbnail: '📝', maxPlayers: 4 });
    setModal({ open: true, mode: 'create', quiz: null });
  };

  const openEdit = (quiz) => {
    setForm({
      title: quiz.title, description: quiz.description || '', category: quiz.category,
      difficulty: quiz.difficulty, timePerQuestion: quiz.timePerQuestion, thumbnail: quiz.thumbnail || '📝',
      maxPlayers: quiz.maxPlayers || 4,
    });
    setModal({ open: true, mode: 'edit', quiz });
  };

  const handleSubmit = () => {
    if (!form.title.trim()) { addToast('Title is required', 'error'); return; }
    if (modal.mode === 'create') {
      addQuiz({ ...form, createdBy: user?.userId });
      addToast('Quiz created successfully! Now add questions to it.', 'success');
    } else {
      editQuiz(modal.quiz.id, form);
      addToast('Quiz updated', 'success');
    }
    setModal({ open: false, mode: 'create', quiz: null });
  };

  const handleDelete = (quiz) => {
    if (window.confirm(`Delete quiz "${quiz.title}"? This will also remove all associated questions.`)) {
      removeQuiz(quiz.id);
      addToast('Quiz deleted', 'success');
    }
  };

  const getQuestionCount = (quiz) => {
    return questions.filter(q => q.quizId === quiz.id).length;
  };

  const difficultyOptions = [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' },
  ];

  const categoryOptions = categories.map(c => ({ value: c.name, label: `${c.icon || ''} ${c.name}` }));

  const sortedQuizzes = [...quizzes].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quiz Management</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{quizzes.length} quizzes total</p>
          </div>
          <Button onClick={openCreate}><FiPlus size={16} /> Create Quiz</Button>
        </div>

        {quizzes.length === 0 ? (
          <EmptyState
            icon={FiPlus}
            title="No quizzes yet"
            description="Create your first quiz. After creation, you can add questions to it from the Question Management page."
            action={<Button onClick={openCreate}>Create Quiz</Button>}
          />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedQuizzes.map(q => {
              const qCount = getQuestionCount(q);
              return (
                <Card key={q.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className={`h-2 bg-gradient-to-r ${q.difficulty === 'easy' ? 'from-green-500 to-green-600' : q.difficulty === 'medium' ? 'from-yellow-500 to-yellow-600' : 'from-red-500 to-red-600'}`} />
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{q.thumbnail || '📝'}</span>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-white truncate">{q.title}</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{q.category}</p>
                        </div>
                      </div>
                    </div>

                    {q.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{q.description}</p>
                    )}

                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
                        <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{qCount}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Questions</p>
                      </div>
                      <div className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
                        <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{q.playCount || 0}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Plays</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <Badge variant={q.difficulty}>{q.difficulty}</Badge>
                      <span className="text-xs text-gray-500">{q.timePerQuestion}s per Q</span>
                      <span className="text-xs text-gray-500">{q.maxPlayers || 4}p max</span>
                      <span className="text-xs text-gray-500">{new Date(q.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary" onClick={() => openEdit(q)}><FiEdit2 size={14} /> Edit</Button>
                      <Button size="sm" variant="danger" onClick={() => handleDelete(q)}><FiTrash2 size={14} /> Delete</Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        <Modal isOpen={modal.open} onClose={() => setModal({ open: false })} title={modal.mode === 'create' ? 'Create Quiz' : 'Edit Quiz'}>
          <div className="space-y-4">
            <Input label="Quiz Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Enter quiz title" />
            <Input label="Quiz Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Short description of the quiz" />
            <div className="grid grid-cols-2 gap-4">
              <Select label="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                options={categoryOptions.length ? categoryOptions : [{ value: 'General', label: 'General' }]} />
              <Select label="Difficulty Level" value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })} options={difficultyOptions} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Timer Duration (seconds)" type="number" min="10" max="300" value={form.timePerQuestion}
                onChange={e => setForm({ ...form, timePerQuestion: Number(e.target.value) })} />
              <Input label="Quiz Thumbnail (emoji)" value={form.thumbnail} onChange={e => setForm({ ...form, thumbnail: e.target.value })} placeholder="📝" />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Max Players</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                  <button key={n} type="button" onClick={() => setForm({ ...form, maxPlayers: n })}
                    className={`w-10 h-10 rounded-lg text-sm font-medium border-2 transition-all ${
                      form.maxPlayers === n
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                        : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}>
                    {n}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400">Number of players allowed in multiplayer mode</p>
            </div>
            {modal.mode === 'edit' && (
              <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-sm text-indigo-700 dark:text-indigo-300">
                Total Questions: {getQuestionCount(modal.quiz)}
              </div>
            )}
            <Button onClick={handleSubmit} className="w-full">
              {modal.mode === 'create' ? 'Create Quiz' : 'Save Changes'}
            </Button>
          </div>
        </Modal>
      </div>
    </AdminLayout>
  );
}
