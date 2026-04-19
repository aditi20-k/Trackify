import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

const Register = () => {
  const { register } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const user = await register({ name: form.name, email: form.email, password: form.password });
      toast.success(`Welcome, ${user.name}!`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = `w-full px-4 py-3 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50 ${
    darkMode
      ? 'bg-surface-800 text-white border border-surface-700 placeholder-surface-500 hover:border-surface-600'
      : 'bg-surface-50 text-surface-900 border border-surface-200 placeholder-surface-400 hover:border-surface-300'
  }`;

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 relative overflow-hidden ${
      darkMode ? 'bg-surface-950' : 'bg-gradient-to-br from-primary-50 via-white to-primary-50'
    }`}>
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -left-40 w-96 h-96 rounded-full blur-[100px] opacity-20 ${
          darkMode ? 'bg-primary-500' : 'bg-primary-400'
        }`} />
        <div className={`absolute -bottom-40 -right-40 w-96 h-96 rounded-full blur-[100px] opacity-20 ${
          darkMode ? 'bg-accent-500' : 'bg-accent-400'
        }`} />
      </div>

      <div className={`relative w-full max-w-md rounded-2xl p-8 shadow-2xl border animate-slide-up ${
        darkMode ? 'bg-surface-900/90 border-surface-800 backdrop-blur-xl' : 'bg-white border-surface-100 shadow-surface-200/50'
      }`}>
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mb-6 shadow-xl shadow-primary-500/25 -rotate-3 hover:rotate-0 transition-transform duration-300">
            <span className="text-white text-3xl font-black">S</span>
          </div>
          <h1 className={`text-3xl font-black tracking-tight mb-2 ${darkMode ? 'text-white' : 'text-surface-900'}`}>
            Create Account
          </h1>
          <p className={`text-base font-medium ${darkMode ? 'text-surface-400' : 'text-surface-500'}`}>
            Join Trackify and take control of your wealth
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className={`block text-xs font-bold tracking-wide uppercase ${darkMode ? 'text-surface-400' : 'text-surface-600'}`}>
              Full Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              placeholder="John Doe"
              className={inputClasses}
            />
          </div>

          <div className="space-y-1.5">
            <label className={`block text-xs font-bold tracking-wide uppercase ${darkMode ? 'text-surface-400' : 'text-surface-600'}`}>
              Email Address
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              placeholder="name@company.com"
              className={inputClasses}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={`block text-xs font-bold tracking-wide uppercase ${darkMode ? 'text-surface-400' : 'text-surface-600'}`}>
                Password
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                placeholder="••••••••"
                className={inputClasses}
              />
            </div>
            <div className="space-y-1.5">
              <label className={`block text-xs font-bold tracking-wide uppercase ${darkMode ? 'text-surface-400' : 'text-surface-600'}`}>
                Confirm
              </label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                required
                placeholder="••••••••"
                className={inputClasses}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold text-base shadow-xl shadow-primary-500/25 hover:shadow-primary-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:translate-y-[-2px] active:translate-y-0 mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-surface-200/10 text-center">
          <p className={`text-sm font-medium ${darkMode ? 'text-surface-400' : 'text-surface-500'}`}>
            Already have an account?{' '}
            <Link to="/login" className="text-primary-500 font-bold hover:text-primary-400 transition-colors underline-offset-4 hover:underline">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
