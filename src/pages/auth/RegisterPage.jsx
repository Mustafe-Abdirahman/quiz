import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterPage() {
  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({ fullName: '', username: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.fullName || form.fullName.trim().length < 2) newErrors.fullName = 'Full name must be at least 2 characters';
    if (!form.username || form.username.trim().length < 2) newErrors.username = 'Username must be at least 2 characters';
    else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) newErrors.username = 'Username can only contain letters, numbers, and underscores';
    if (!form.email) newErrors.email = 'Email is required';
    else if (!EMAIL_REGEX.test(form.email)) newErrors.email = 'Please enter a valid email address';
    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!form.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }

    setLoading(true);
    const result = await register({
      fullName: form.fullName.trim(),
      username: form.username.trim(),
      email: form.email.trim(),
      password: form.password,
      role: 'user',
    });
    setLoading(false);

    if (result.success) {
      addToast('Account created successfully!', 'success');
      navigate('/user/dashboard');
    } else {
      addToast(result.message, 'error');
    }
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <span className="text-3xl">🧠</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create your account</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Join the quiz community</p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input label="Full Name" name="fullName" placeholder="John Doe" value={form.fullName} onChange={handleChange} error={errors.fullName} icon={FiUser} />
            <Input label="Username" name="username" placeholder="johndoe" value={form.username} onChange={handleChange} error={errors.username} icon={FiUser} />
            <Input label="Email Address" name="email" type="email" placeholder="john@example.com" value={form.email} onChange={handleChange} error={errors.email} icon={FiMail} />

            <div className="relative">
              <Input label="Password" name="password" type={showPassword ? 'text' : 'password'} placeholder="Min 6 characters" value={form.password} onChange={handleChange} error={errors.password} icon={FiLock} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>

            <div className="relative">
              <Input label="Confirm Password" name="confirmPassword" type={showConfirm ? 'text' : 'password'} placeholder="Repeat password" value={form.confirmPassword} onChange={handleChange} error={errors.confirmPassword} icon={FiLock} />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showConfirm ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>
        </Card>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
