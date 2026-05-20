import { useState, useMemo, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiSearch, FiUserPlus, FiShield, FiEye, FiEyeOff } from 'react-icons/fi';
import AdminLayout from '../../layouts/AdminLayout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Modal from '../../components/ui/Modal';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { authService } from '../../services/authService';
import { getInitials } from '../../utils/helpers';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function UserManagement() {
  const { refreshUser } = useAuth();
  const { addToast } = useToast();
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [editModal, setEditModal] = useState({ open: false, user: null });
  const [editForm, setEditForm] = useState({ username: '', email: '', role: 'user' });
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [registerModal, setRegisterModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [registerForm, setRegisterForm] = useState({
    fullName: '', username: '', email: '', password: '', role: 'user',
  });
  const [registerErrors, setRegisterErrors] = useState({});
  const [registerLoading, setRegisterLoading] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await authService.getUsers();
      setUsers(data);
    }
    load();
  }, []);

  const filteredUsers = useMemo(() => {
    if (!search) return users;
    const q = search.toLowerCase();
    return users.filter(u => u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  }, [users, search]);

  const refresh = async () => {
    const data = await authService.getUsers();
    setUsers(data);
    refreshUser();
  };

  const openEdit = (user) => {
    setEditForm({ username: user.username, email: user.email, role: user.role });
    setEditModal({ open: true, user });
  };

  const handleEdit = async () => {
    const result = await authService.updateUser(editModal.user.id, editForm);
    if (result.success) {
      addToast('User updated successfully', 'success');
      setEditModal({ open: false, user: null });
      await refresh();
    }
  };

  const handleDelete = async (id, username) => {
    setConfirmDelete({ id, username });
  };

  const confirmDeleteUser = async () => {
    if (!confirmDelete) return;
    await authService.deleteUser(confirmDelete.id);
    addToast('User deleted', 'success');
    setConfirmDelete(null);
    await refresh();
  };

  const openRegister = () => {
    setRegisterForm({ fullName: '', username: '', email: '', password: '', role: 'user' });
    setRegisterErrors({});
    setShowPassword(false);
    setRegisterModal(true);
  };

  const validateRegister = () => {
    const errors = {};
    if (!registerForm.fullName.trim() || registerForm.fullName.trim().length < 2) errors.fullName = 'Full name must be at least 2 characters';
    if (!registerForm.username.trim() || registerForm.username.trim().length < 2) errors.username = 'Username must be at least 2 characters';
    else if (!/^[a-zA-Z0-9_]+$/.test(registerForm.username)) errors.username = 'Letters, numbers, and underscores only';
    if (!registerForm.email.trim()) errors.email = 'Email is required';
    else if (!EMAIL_REGEX.test(registerForm.email)) errors.email = 'Invalid email format';
    if (!registerForm.password) errors.password = 'Password is required';
    else if (registerForm.password.length < 6) errors.password = 'Minimum 6 characters';
    return errors;
  };

  const handleRegisterSubmit = async () => {
    const errors = validateRegister();
    if (Object.keys(errors).length) { setRegisterErrors(errors); return; }

    setRegisterLoading(true);
    const result = await authService.createUser({
      fullName: registerForm.fullName.trim(),
      username: registerForm.username.trim(),
      email: registerForm.email.trim(),
      password: registerForm.password,
      role: registerForm.role,
    });
    setRegisterLoading(false);

    if (result.success) {
      addToast('User created successfully', 'success');
      setRegisterModal(false);
      await refresh();
    } else {
      setRegisterErrors({ general: result.message });
      addToast(result.message, 'error');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{users.length} total users</p>
          </div>
          <Button onClick={openRegister}>
            <FiUserPlus size={16} />
            Add User
          </Button>
        </div>

        <div className="max-w-sm">
          <Input placeholder="Search users..." icon={FiSearch} value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <Card className="overflow-hidden">
          {filteredUsers.length === 0 ? (
            <EmptyState icon={FiShield} title="No users found" description="Try a different search term." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">User</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Email</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Role</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Joined</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-400">
                            {getInitials(u.username)}
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{u.username}</span>
                            {u.fullName && <p className="text-xs text-gray-500 dark:text-gray-400">{u.fullName}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{u.email}</td>
                      <td className="px-4 py-3">
                        <Badge variant={u.role}>{u.role}</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEdit(u)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                            <FiEdit2 size={14} />
                          </button>
                          {u.role !== 'admin' && (
                            <button onClick={() => handleDelete(u.id, u.username)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400">
                              <FiTrash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Modal isOpen={editModal.open} onClose={() => setEditModal({ open: false, user: null })} title="Edit User">
          <div className="space-y-4">
            <Input label="Username" value={editForm.username} onChange={e => setEditForm({ ...editForm, username: e.target.value })} />
            <Input label="Email" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} />
            <Select label="Role" value={editForm.role} onChange={e => setEditForm({ ...editForm, role: e.target.value })}
              options={[{ value: 'user', label: 'User' }, { value: 'admin', label: 'Admin' }]} />
            <Button onClick={handleEdit} className="w-full">Save Changes</Button>
          </div>
        </Modal>

        <Modal isOpen={registerModal} onClose={() => setRegisterModal(false)} title="Register New User" size="md">
          <div className="space-y-4">
            <Input label="Full Name" value={registerForm.fullName} onChange={e => setRegisterForm({ ...registerForm, fullName: e.target.value })}
              error={registerErrors.fullName} placeholder="John Doe" />
            <Input label="Username" value={registerForm.username} onChange={e => setRegisterForm({ ...registerForm, username: e.target.value })}
              error={registerErrors.username} placeholder="johndoe" />
            <Input label="Email Address" type="email" value={registerForm.email} onChange={e => setRegisterForm({ ...registerForm, email: e.target.value })}
              error={registerErrors.email} placeholder="john@example.com" />
            <div className="relative">
              <Input label="Password" type={showPassword ? 'text' : 'password'} value={registerForm.password}
                onChange={e => setRegisterForm({ ...registerForm, password: e.target.value })}
                error={registerErrors.password} placeholder="Min 6 characters" />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
            <Select label="Role" value={registerForm.role} onChange={e => setRegisterForm({ ...registerForm, role: e.target.value })}
              options={[{ value: 'user', label: 'User' }, { value: 'admin', label: 'Admin' }]} />
            <Button onClick={handleRegisterSubmit} className="w-full" disabled={registerLoading}>
              {registerLoading ? 'Registering...' : 'Register User'}
            </Button>
          </div>
        </Modal>

        <ConfirmDialog
          isOpen={!!confirmDelete}
          onClose={() => setConfirmDelete(null)}
          onConfirm={confirmDeleteUser}
          title="Delete User"
          message={confirmDelete ? `Are you sure you want to delete user "${confirmDelete.username}"? This action cannot be undone.` : ''}
        />
      </div>
    </AdminLayout>
  );
}
