import { useState, useMemo, useRef } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiBookOpen, FiUpload, FiDownload, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import * as XLSX from 'xlsx';
import AdminLayout from '../../layouts/AdminLayout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Modal from '../../components/ui/Modal';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { useQuiz } from '../../context/QuizContext';
import { useToast } from '../../components/ui/Toast';

const EXPECTED_HEADERS = ['Question', 'Option A', 'Option B', 'Option C', 'Option D', 'Correct Answer', 'Difficulty', 'Type'];
const DIFFICULTIES = ['easy', 'medium', 'hard'];
const QUESTION_TYPES = [
  { value: 'multiple', label: 'Multiple Choice' },
  { value: 'truefalse', label: 'True / False' },
  { value: 'fill', label: 'Fill in the Blank' },
];

const typeBadgeColors = {
  multiple: 'blue',
  truefalse: 'purple',
  fill: 'orange',
};

function normalizeHeader(h) {
  if (!h) return '';
  const s = h.toString().trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  if (s === 'question' || s === 'questiontext' || s === 'text') return 'Question';
  if (s === 'optiona' || s === 'option1' || s === 'a') return 'Option A';
  if (s === 'optionb' || s === 'option2' || s === 'b') return 'Option B';
  if (s === 'optionc' || s === 'option3' || s === 'c') return 'Option C';
  if (s === 'optiond' || s === 'option4' || s === 'd') return 'Option D';
  if (s === 'correctanswer' || s === 'correct' || s === 'answer') return 'Correct Answer';
  if (s === 'difficulty' || s === 'level' || s === 'diff') return 'Difficulty';
  if (s === 'type') return 'Type';
  return h.toString().trim();
}

export default function QuestionManagement() {
  const { quizzes, questions, addQuestion, editQuestion, removeQuestion } = useQuiz();
  const { addToast } = useToast();
  const fileInputRef = useRef(null);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState({});
  const [modal, setModal] = useState({ open: false, mode: 'create', question: null, quizId: '' });
  const [form, setForm] = useState({ text: '', option1: '', option2: '', option3: '', option4: '', correctAnswer: '0', fillAnswer: '', type: 'multiple', difficulty: 'medium' });

  const questionsByQuiz = useMemo(() => {
    const map = {};
    questions.forEach(q => {
      if (!map[q.quizId]) map[q.quizId] = [];
      map[q.quizId].push(q);
    });
    return map;
  }, [questions]);

  const sortedQuizzes = useMemo(() => {
    return [...quizzes].sort((a, b) => a.title.localeCompare(b.title));
  }, [quizzes]);

  const toggleQuiz = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const openCreate = (quizId) => {
    setForm({ text: '', option1: '', option2: '', option3: '', option4: '', correctAnswer: '0', fillAnswer: '', type: 'multiple', difficulty: 'medium' });
    setModal({ open: true, mode: 'create', question: null, quizId });
  };

  const openEdit = (q) => {
    const isFill = q.type === 'fill';
    setForm({
      text: q.text,
      option1: q.options[0] || '',
      option2: q.options[1] || '',
      option3: q.options[2] || '',
      option4: q.options[3] || '',
      correctAnswer: String(q.correctAnswer),
      fillAnswer: isFill ? (q.options[0] || '') : '',
      type: q.type || 'multiple',
      difficulty: q.difficulty,
    });
    setModal({ open: true, mode: 'edit', question: q, quizId: q.quizId });
  };

  const handleSubmit = async () => {
    if (!form.text.trim()) { addToast('Question text is required', 'error'); return; }

    let options, correctAnswer;

    if (form.type === 'truefalse') {
      options = ['True', 'False'];
      correctAnswer = Number(form.correctAnswer);
    } else if (form.type === 'fill') {
      options = [form.option1, form.option2, form.option3, form.option4].filter(o => o.trim());
      if (options.length < 2) { addToast('At least 2 options required', 'error'); return; }
      correctAnswer = Number(form.correctAnswer);
    } else {
      options = [form.option1, form.option2, form.option3, form.option4].filter(o => o.trim());
      if (options.length < 2) { addToast('At least 2 options required', 'error'); return; }
      correctAnswer = Number(form.correctAnswer);
    }

    const quiz = quizzes.find(q => q.id === modal.quizId);
    const data = {
      text: form.text,
      options,
      correctAnswer,
      type: form.type,
      category: quiz?.category || 'General',
      difficulty: form.difficulty,
      quizId: modal.quizId,
    };

    if (modal.mode === 'create') {
      await addQuestion(data);
      addToast('Question created', 'success');
    } else {
      await editQuestion(modal.question.id, data);
      addToast('Question updated', 'success');
    }
    setModal({ open: false });
  };

  const handleDelete = async (q) => {
    if (window.confirm('Delete this question?')) {
      await removeQuestion(q.id);
      addToast('Question deleted', 'success');
    }
  };

  const parseImportedRow = (row, quizId) => {
    const q = row['Question'] || row['question'] || '';
    const oa = row['Option A'] || row['option1'] || '';
    const ob = row['Option B'] || row['option2'] || '';
    const oc = row['Option C'] || row['option3'] || '';
    const od = row['Option D'] || row['option4'] || '';
    let correct = row['Correct Answer'] ?? row['correctAnswer'] ?? row['correct'] ?? 0;
    const diff = row['Difficulty'] || row['difficulty'] || 'medium';
    const typeRaw = (row['Type'] || row['type'] || 'multiple').toString().toLowerCase();

    const type = ['truefalse', 'fill'].includes(typeRaw) ? typeRaw : 'multiple';

    if (typeof correct === 'string') {
      const uc = correct.toString().trim().toUpperCase();
      if (uc === 'A' || uc === '1') correct = 0;
      else if (uc === 'B' || uc === '2') correct = 1;
      else if (uc === 'C' || uc === '3') correct = 2;
      else if (uc === 'D' || uc === '4') correct = 3;
      else if (uc === 'TRUE') correct = 0;
      else if (uc === 'FALSE') correct = 1;
      else correct = parseInt(correct) || 0;
    }
    correct = Number(correct);
    if (correct < 0 || correct > 3) correct = 0;

    const difficulty = DIFFICULTIES.includes(diff.toString().toLowerCase()) ? diff.toString().toLowerCase() : 'medium';
    let options;
    if (type === 'truefalse') {
      options = ['True', 'False'];
    } else {
      options = [oa, ob, oc, od].filter(o => o.toString().trim());
    }
    if (!q.toString().trim()) return null;
    if (type !== 'fill' && options.length < 2) return null;

    return {
      text: q.toString().trim(),
      options,
      correctAnswer: correct,
      type,
      category: quizzes.find(qu => qu.id === quizId)?.category || 'General',
      difficulty,
      quizId,
    };
  };

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet, { defval: '' });

        if (!json.length) {
          addToast('File is empty or has no valid data', 'error');
          return;
        }

        const headers = Object.keys(json[0]).map(normalizeHeader);
        const hasRequired = EXPECTED_HEADERS.some(h => headers.includes(h));
        if (!hasRequired) {
          addToast('Unrecognized format. Expected columns: Question, Option A-D, Correct Answer, Difficulty, Type', 'error');
          return;
        }

        const normalized = json.map(row => {
          const nRow = {};
          Object.entries(row).forEach(([k, v]) => {
            nRow[normalizeHeader(k)] = v;
          });
          return nRow;
        });

        addToast('Select a quiz section to import into', 'error');
      } catch (err) {
        addToast(`Import failed: ${err.message}`, 'error');
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = '';
  };

  const handleExport = (quiz) => {
    const quizQuestions = questionsByQuiz[quiz.id] || [];
    if (!quizQuestions.length) {
      addToast('No questions to export', 'error');
      return;
    }

    const data = quizQuestions.map(q => ({
        Question: q.text,
        'Option A': q.options[0] || '',
        'Option B': q.options[1] || '',
        'Option C': q.options[2] || '',
        'Option D': q.options[3] || '',
        'Correct Answer': q.type === 'truefalse' ? (q.correctAnswer === 0 ? 'True' : 'False') : q.correctAnswer,
        Difficulty: q.difficulty,
        Type: q.type || 'multiple',
      }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Questions');
    const fileName = `${quiz.title}`.replace(/[^a-zA-Z0-9]/g, '_');

    XLSX.writeFile(wb, `${fileName}.xlsx`);
    addToast(`Exported ${quizQuestions.length} question(s)`, 'success');
  };

  const diffOptions = [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' },
  ];

  const typeOptions = QUESTION_TYPES;

  const correctOptions = form.type === 'truefalse'
    ? [{ value: '0', label: 'True' }, { value: '1', label: 'False' }]
    : [{ value: '0', label: 'Option 1' }, { value: '1', label: 'Option 2' }, { value: '2', label: 'Option 3' }, { value: '3', label: 'Option 4' }];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Question Management</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {questions.length} questions across {quizzes.length} quizzes
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleImport}
            className="hidden"
          />
        </div>

        <div className="max-w-sm">
          <Input
            placeholder="Search questions across all quizzes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {sortedQuizzes.length === 0 ? (
          <EmptyState
            icon={FiBookOpen}
            title="No quizzes yet"
            description="Create a quiz first before managing questions."
            action={
              <Button to="/admin/quizzes">
                <FiPlus size={16} /> Create Quiz
              </Button>
            }
          />
        ) : (
          <div className="space-y-4">
            {sortedQuizzes.map(quiz => {
              const quizQs = questionsByQuiz[quiz.id] || [];
              const filtered = search
                ? quizQs.filter(x => x.text.toLowerCase().includes(search.toLowerCase()))
                : quizQs;
              const isExpanded = expanded[quiz.id] !== false;
              const hasQuestions = quizQs.length > 0;

              if (search && filtered.length === 0) return null;

              return (
                <Card key={quiz.id} className="overflow-hidden">
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    onClick={() => toggleQuiz(quiz.id)}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {isExpanded ? <FiChevronDown size={18} className="text-gray-400 shrink-0" /> : <FiChevronRight size={18} className="text-gray-400 shrink-0" />}
                      <span className="text-lg">{quiz.thumbnail || '📝'}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{quiz.title}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge variant={quiz.difficulty}>{quiz.difficulty}</Badge>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{quiz.category}</span>
                          <span className="text-xs text-gray-400 dark:text-gray-500">·</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{quizQs.length} question{quizQs.length !== 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0" onClick={e => e.stopPropagation()}>
                      {hasQuestions && (
                        <Button variant="secondary" size="sm" onClick={() => handleExport(quiz)}>
                          <FiDownload size={14} /> Export
                        </Button>
                      )}
                      <Button size="sm" onClick={() => openCreate(quiz.id)}>
                        <FiPlus size={14} /> Add Question
                      </Button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-gray-100 dark:border-gray-700">
                      {filtered.length === 0 ? (
                        <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
                          {search ? 'No questions match your search' : 'No questions yet. Click "Add Question" to get started.'}
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-100 dark:divide-gray-700">
                          {filtered.map(q => (
                              <div key={q.id} className="p-4">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2">
                                      <p className="text-sm font-medium text-gray-900 dark:text-white">{q.text}</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                      {q.options.map((opt, i) => (
                                          <span key={i} className={`px-2 py-1 text-xs rounded-md ${i === q.correctAnswer ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}>
                                            {opt}
                                          </span>
                                        ))
                                        }
                                      </div>
                                    <div className="flex items-center gap-2 mt-2">
                                      <Badge variant={(typeBadgeColors[q.type] || 'blue')}>{q.type || 'multiple'}</Badge>
                                      <Badge variant={q.difficulty}>{q.difficulty}</Badge>
                                      <span className="text-xs text-gray-500 dark:text-gray-400">{q.category || quiz.category}</span>
                                    </div>
                                  </div>
                                  <div className="flex gap-1 shrink-0">
                                    <button onClick={() => openEdit(q)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-indigo-600">
                                      <FiEdit2 size={14} />
                                    </button>
                                    <button onClick={() => handleDelete(q)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-red-600">
                                      <FiTrash2 size={14} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}

        <Modal isOpen={modal.open} onClose={() => setModal({ open: false })} title={modal.mode === 'create' ? 'Add Question' : 'Edit Question'} size="lg">
          <div className="space-y-4">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-sm text-indigo-700 dark:text-indigo-300">
              {modal.mode === 'create' ? 'Adding question to' : 'Editing question in'}: <strong>{quizzes.find(q => q.id === modal.quizId)?.title}</strong>
            </div>
            <Input label="Question" value={form.text} onChange={e => setForm({ ...form, text: e.target.value })} placeholder="Enter question text" />
            <div className="grid grid-cols-2 gap-3">
              <Select label="Question Type" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} options={typeOptions} />
              <Select label="Difficulty" value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })} options={diffOptions} />
            </div>

            {form.type !== 'truefalse' && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Option 1" value={form.option1} onChange={e => setForm({ ...form, option1: e.target.value })} placeholder="Option A" />
                  <Input label="Option 2" value={form.option2} onChange={e => setForm({ ...form, option2: e.target.value })} placeholder="Option B" />
                  <Input label="Option 3" value={form.option3} onChange={e => setForm({ ...form, option3: e.target.value })} placeholder="Option C" />
                  <Input label="Option 4" value={form.option4} onChange={e => setForm({ ...form, option4: e.target.value })} placeholder="Option D" />
                </div>
                <Select label="Correct Answer" value={form.correctAnswer} onChange={e => setForm({ ...form, correctAnswer: e.target.value })}
                  options={correctOptions} />
              </>
            )}

            {form.type === 'truefalse' && (
              <Select label="Correct Answer" value={form.correctAnswer} onChange={e => setForm({ ...form, correctAnswer: e.target.value })}
                options={correctOptions} />
            )}

            <Button onClick={handleSubmit} className="w-full">{modal.mode === 'create' ? 'Add Question' : 'Save Changes'}</Button>
          </div>
        </Modal>
      </div>
    </AdminLayout>
  );
}
