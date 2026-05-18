import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiCamera, FiSave, FiArrowLeft } from 'react-icons/fi';
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

  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(user?.avatar || null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [saving, setSaving] = useState(false);

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button onClick={() => navigate(dashPath)} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-6 transition-colors">
          <FiArrowLeft size={16} /> Back to Dashboard
        </button>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your profile information and photo</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profile Photo</h2>
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  {avatar ? (
                    <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <FiUser size={36} className="text-gray-400" />
                  )}
                </div>
                <button type="button" onClick={() => fileRef.current?.click()} className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <FiCamera size={20} />
                </button>
              </div>
              <div className="space-y-2">
                <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                  <FiCamera size={14} /> Upload Photo
                </Button>
                {avatar && (
                  <Button type="button" variant="ghost" size="sm" onClick={removeAvatar} className="text-red-500 hover:text-red-700">
                    Remove
                  </Button>
                )}
                <p className="text-xs text-gray-400">JPG, PNG or GIF. Max 2MB.</p>
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h2>

            <Input label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" icon={FiUser} />

            <Input label="Username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" icon={FiUser} required />

            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" icon={FiMail} required />
          </Card>

          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Change Password</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Leave blank to keep your current password</p>
            <Input label="New Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter new password" icon={FiLock} />
          </Card>

          <div className="flex justify-end">
            <Button type="submit" variant="primary" disabled={saving}>
              <FiSave size={16} /> {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
