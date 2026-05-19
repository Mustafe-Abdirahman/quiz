import { useState, useEffect, useMemo } from 'react';
import { FiCheck, FiUsers, FiSearch, FiSave } from 'react-icons/fi';
import AdminLayout from '../../layouts/AdminLayout';
import Select from '../../components/ui/Select';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
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

  const quizOptions = useMemo(() => quizzes.map(q => ({
    value: q.id,
    label: `${q.thumbnail || '📝'} ${q.title}`,
  })), [quizzes]);

  useEffect(() => {
    authService.getUsers().then(data => setUsers(data.filter(u => u.role === 'user'))).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedQuizId) { setAssignedIds(new Set()); return; }
    quizService.getAssignedUserIds(selectedQuizId).then(ids => setAssignedIds(new Set(ids)));
  }, [selectedQuizId]);

  const toggleUser = (userId) => {
    setAssignedIds(prev => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId); else next.add(userId);
      return next;
    });
  };

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

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FiUsers className="text-indigo-500" />
            Assign Quiz to Users
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Select a quiz, then choose which users can see and take it.</p>
        </div>

        <div className="max-w-md">
          <Select
            label="Select Quiz"
            value={selectedQuizId}
            onChange={e => setSelectedQuizId(e.target.value)}
            options={[{ value: '', label: 'Choose a quiz...' }, ...quizOptions]}
          />
        </div>

        {selectedQuizId && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <FiUsers size={16} />
                <span>{assignedIds.size} of {users.length} users selected</span>
              </div>
              <div className="w-64">
                <Input
                  placeholder="Search users..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  icon={FiSearch}
                />
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto p-2">
              {filteredUsers.length === 0 ? (
                <p className="text-center text-sm text-gray-400 py-8">No users found</p>
              ) : (
                <div className="grid gap-1">
                  {filteredUsers.map(u => (
                    <label
                      key={u.id}
                      onClick={() => toggleUser(u.id)}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        assignedIds.has(u.id)
                          ? 'bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 border border-transparent'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        assignedIds.has(u.id)
                          ? 'bg-indigo-500 border-indigo-500 text-white'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}>
                        {assignedIds.has(u.id) && <FiCheck size={14} />}
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-300 shrink-0">
                        {(u.fullName || u.username)[0].toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{u.fullName || u.username}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{u.email}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <Button onClick={handleSave} disabled={saving}>
                <FiSave size={16} /> {saving ? 'Saving...' : `Save (${assignedIds.size} users)`}
              </Button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}