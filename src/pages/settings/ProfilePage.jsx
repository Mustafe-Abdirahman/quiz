import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiCamera, FiSave, FiArrowLeft, FiCalendar, FiShield, FiAtSign } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { useToast } from '../../components/ui/Toast';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (user && !loaded) {
      setUsername(user.username || '');
      setEmail(user.email || '');
      setFullName(user.fullName || '');
      setAvatar(user.avatar || null);
      setLoaded(true);
    }
  }, [user, loaded]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      addToast('Image must be under 2MB', 'error');
      return;
    }
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setAvatar(ev.target.result);
    reader.readAsDataURL(file);
  };

  const removeAvatar = () => {
    setAvatar(null);
    setAvatarFile(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = { username, email, fullName };
      if (password) data.password = password;
      data.avatar = avatar;

      const result = await authService.updateProfile(data);
      if (result.success) {
        addToast('Profile updated successfully', 'success');
        setPassword('');
        setAvatarFile(null);
        await refreshUser();
      } else {
        addToast(result.message || 'Failed to update profile', 'error');
      }
    } catch {
      addToast('Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const isAdmin = user?.role === 'admin';
  const dashPath = isAdmin ? '/admin/dashboard' : '/user/dashboard';
  const initials = (user?.fullName || user?.username || '?').split(' ').map(s => s[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <button onClick={() => navigate(dashPath)} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-8 transition-colors group">
          <span className="p-1 rounded-lg group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors"><FiArrowLeft size={14} /></span>
          Back to Dashboard
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
          <div className="h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-12 mb-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white dark:bg-gray-800 ring-4 ring-white dark:ring-gray-800 shadow-lg flex items-center justify-center">
                  {avatar ? (
                    <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 flex items-center justify-center">
                      <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{initials}</span>
                    </div>
                  )}
                </div>
                <button type="button" onClick={() => fileRef.current?.click()} className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg flex items-center justify-center transition-colors">
                  <FiCamera size={14} />
                </button>
              </div>
              <div className="text-center sm:text-left flex-1">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">{user?.fullName || user?.username}</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">@{user?.username}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                  isAdmin
                    ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                    : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                }`}>
                  <FiShield size={12} />
                  {isAdmin ? 'Admin' : 'User'}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-4">
              <span className="flex items-center gap-1.5"><FiMail size={12} /> {user?.email}</span>
              <span className="flex items-center gap-1.5"><FiCalendar size={12} /> Member</span>
              <span className="flex items-center gap-1.5"><FiAtSign size={12} /> ID: {user?.userId?.slice(0, 8)}...</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <Card className="p-6">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Personal Information</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Update your account details</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" icon={FiUser} />
              <Input label="Username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" icon={FiUser} required />
              <div className="sm:col-span-2">
                <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" icon={FiMail} required />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Change Password</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Leave blank to keep your current password</p>
            <div className="max-w-sm">
              <Input label="New Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter new password" icon={FiLock} />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Profile Photo</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Upload a profile photo (JPG, PNG or GIF, max 2MB)</p>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0">
                {avatar ? (
                  <img src={avatar} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <FiUser size={24} className="text-gray-400" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                  <FiCamera size={14} /> Choose File
                </Button>
                {avatar && (
                  <Button type="button" variant="ghost" size="sm" onClick={removeAvatar} className="text-red-500 hover:text-red-700">
                    Remove
                  </Button>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </div>
          </Card>

          <div className="flex items-center justify-between gap-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Save changes</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Make sure to review your changes before saving</p>
            </div>
            <Button type="submit" variant="primary" disabled={saving}>
              <FiSave size={16} /> {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
