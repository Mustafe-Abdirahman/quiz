import { useState, useEffect, useMemo } from 'react';
import { FiCheck, FiUsers, FiSearch, FiSave, FiUserCheck, FiBookOpen, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import AdminLayout from '../../layouts/AdminLayout';
import Select from '../../components/ui/Select';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { useToast } from '../../components/ui/Toast';
import { useQuiz } from '../../context/QuizContext';
import { quizService } from '../../services/quizService';
import { authService } from '../../services/authService';

export default function AssignQuizPage() {
  const { addToast } = useToast();
  const { quizzes } = useQuiz();
  const [users, setUsers] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState('');
  const [assignedIds, setAssignedIds] = useState(new Set());
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [showAll, setShowAll] = useState(true);

  const quizOptions = useMemo(() => quizzes.map(q => ({
    value: q.id,
    label: `${q.thumbnail || '📝'} ${q.title}`,
  })), [quizzes]);

  const selectedQuiz = useMemo(() => quizzes.find(q => q.id === selectedQuizId), [quizzes, selectedQuizId]);

  useEffect(() => {
    authService.getUsers().then(data => setUsers(data.filter(u => u.role === 'user'))).catch(() => setUsers([]));
  }, []);

  useEffect(() => {
    if (!selectedQuizId) { setAssignedIds(new Set()); return; }
    quizService.getAssignedUserIds(selectedQuizId).then(ids => setAssignedIds(new Set(ids))).catch(() => setAssignedIds(new Set()));
  }, [selectedQuizId]);

  const toggleUser = (userId) => {
    setAssignedIds(prev => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId); else next.add(userId);
      return next;
    });
  };

  const selectAll = () => setAssignedIds(new Set(filteredUsers.map(u => u.id)));
  const deselectAll = () => setAssignedIds(new Set());

  const handleSave = async () => {
    if (!selectedQuizId) return;
    setSaving(true);
    const result = await quizService.assignQuiz(selectedQuizId, [...assignedIds]);
    if (result.success) {
      addToast(`Assigned to ${assignedIds.size} user(s)`, 'success');
    } else {
      addToast(result.message || 'Failed to assign', 'error');
    }
    setSaving(false);
  };

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.toLowerCase();
    return users.filter(u =>
      u.username.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.fullName || '').toLowerCase().includes(q)
    );
  }, [users, search]);

  const selectedCount = assignedIds.size;

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 sm:p-8 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <FiUserCheck size={24} />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold">Assign Quiz to Users</h1>
          </div>
          <p className="text-indigo-100 text-sm sm:text-base max-w-xl">
            Select a quiz, then choose which users can see and take it. Only assigned users will see the quiz in their dashboard.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="hidden sm:flex w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 items-center justify-center shrink-0">
              <FiBookOpen size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Choose a Quiz
              </label>
              <Select
                value={selectedQuizId}
                onChange={e => setSelectedQuizId(e.target.value)}
                options={[{ value: '', label: 'Select a quiz to assign...' }, ...quizOptions]}
                placeholder="Select a quiz"
              />
              {selectedQuiz && (
                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <span>{selectedQuiz.thumbnail || '📝'} <strong className="text-gray-700 dark:text-gray-200">{selectedQuiz.title}</strong></span>
                  <span className="hidden sm:inline">&middot;</span>
                  <span className="text-xs capitalize">{selectedQuiz.difficulty}</span>
                  <span className="hidden sm:inline">&middot;</span>
                  <span>{selectedQuiz.category}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {selectedQuizId && (
          <>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 ${
                  selectedCount > 0
                    ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                }`}>
                  <FiUsers size={16} />
                  <span>{selectedCount} / {users.length} selected</span>
                </div>
                <Badge variant={selectedCount === users.length ? 'success' : selectedCount > 0 ? 'warning' : 'default'}>
                  {selectedCount === users.length ? 'All' : selectedCount > 0 ? 'Partial' : 'None'}
                </Badge>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none sm:w-56">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-shadow"
                  />
                </div>
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors lg:hidden"
                >
                  {showAll ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
                </button>
              </div>
            </div>

            <div className={`bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden transition-all ${showAll ? '' : 'lg:block'}`}>
              <div className="hidden sm:flex items-center justify-between px-5 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <span className="w-5"></span>
                  <span className="w-8"></span>
                  <span>User</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={selectAll} className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline px-2 py-1">Select All</button>
                  <span className="text-gray-300 dark:text-gray-600">|</span>
                  <button onClick={deselectAll} className="text-xs font-medium text-gray-500 dark:text-gray-400 hover:underline px-2 py-1">Clear</button>
                </div>
              </div>

              <div className={`${showAll ? 'max-h-96' : 'max-h-0 lg:max-h-96'} overflow-y-auto transition-all duration-300`}>
                {filteredUsers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <FiUsers size={40} className="mb-3 opacity-50" />
                    <p className="text-sm font-medium">No users found</p>
                    <p className="text-xs mt-1">Try a different search term</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
                    {filteredUsers.map((u, idx) => (
                      <div
                        key={u.id}
                        onClick={() => toggleUser(u.id)}
                        className={`flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3 cursor-pointer transition-all ${
                          assignedIds.has(u.id)
                            ? 'bg-indigo-50/80 dark:bg-indigo-900/15 hover:bg-indigo-100/80 dark:hover:bg-indigo-900/25'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-700/30'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 ${
                          assignedIds.has(u.id)
                            ? 'bg-indigo-500 border-indigo-500 text-white shadow-sm shadow-indigo-200 dark:shadow-indigo-900/40 scale-105'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}>
                          {assignedIds.has(u.id) && <FiCheck size={13} strokeWidth={3} />}
                        </div>
                        <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 transition-all ${
                          assignedIds.has(u.id)
                            ? 'bg-indigo-500 text-white shadow-sm shadow-indigo-200 dark:shadow-indigo-900/40'
                            : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                        }`}>
                          {(u.fullName || u.username)[0].toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {u.fullName || u.username}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{u.email}</p>
                        </div>
                        <div className="hidden xs:flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                          {u.username && <span className="hidden sm:inline">@{u.username}</span>}
                        </div>
                        {idx % 5 === 0 && (
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            assignedIds.has(u.id) ? 'bg-indigo-400' : 'bg-gray-300 dark:bg-gray-600'
                          }`} />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="px-4 sm:px-5 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-indigo-500 inline-block"></span>
                    Selected ({selectedCount})
                  </span>
                  <button onClick={selectAll} className="text-indigo-600 dark:text-indigo-400 hover:underline sm:hidden">Select All</button>
                  <button onClick={deselectAll} className="text-gray-500 dark:text-gray-400 hover:underline sm:hidden">Clear</button>
                </div>
                <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
                  <FiSave size={16} />
                  {saving ? 'Saving...' : `Save Assignments (${selectedCount})`}
                </Button>
              </div>
            </div>
          </>
        )}

        {!selectedQuizId && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-600 p-8 sm:p-12">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                <FiUserCheck size={28} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No quiz selected</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                Choose a quiz from the dropdown above to manage which users can access it.
              </p>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}