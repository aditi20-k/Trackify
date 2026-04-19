import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineArrowRight } from 'react-icons/hi';

const Login = () => {
  const { login } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = `w-full pl-11 pr-4 py-3.5 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-500/10 ${darkMode
      ? 'bg-surface-800 text-white border-2 border-surface-700 placeholder-surface-500 hover:border-surface-600 focus:border-primary-500'
      : 'bg-surface-50 text-surface-900 border-2 border-surface-100 placeholder-surface-400 hover:border-surface-200 focus:border-primary-500'
    }`;

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 sm:p-8 relative overflow-hidden ${darkMode ? 'bg-surface-950' : 'bg-gradient-to-br from-primary-50 via-white to-primary-100'
      }`}>
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-96 h-96 rounded-full blur-[120px] opacity-30 ${darkMode ? 'bg-primary-600' : 'bg-primary-300'
          }`} />
        <div className={`absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-[120px] opacity-30 ${darkMode ? 'bg-accent-600' : 'bg-accent-300'
          }`} />
      </div>

      <div className={`relative w-full max-w-[440px] rounded-[2.5rem] p-10 sm:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] border animate-slide-up ${darkMode ? 'bg-surface-900/90 border-surface-800 backdrop-blur-2xl' : 'bg-white/95 border-white shadow-surface-200/50 backdrop-blur-xl'
        }`}>
        {/* Logo and Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-primary-600 via-primary-500 to-primary-400 flex items-center justify-center mb-8 shadow-2xl shadow-primary-500/40 rotate-6 hover:rotate-0 transition-all duration-500 cursor-pointer group">
            <span className="text-white text-4xl font-black group-hover:scale-110 transition-transform">S</span>
          </div>
          <h1 className={`text-4xl font-black tracking-tight mb-3 ${darkMode ? 'text-white' : 'text-surface-900'}`}>
            Trackify
          </h1>
          <p className={`text-base font-medium leading-relaxed ${darkMode ? 'text-surface-400' : 'text-surface-500'}`}>
            Securely manage your expenses with precision and ease.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2.5">
            <label className={`block text-[11px] font-black tracking-[0.1em] uppercase ml-1 ${darkMode ? 'text-surface-500' : 'text-surface-400'}`}>
              Email Address
            </label>
            <div className="relative group">
              <span className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${darkMode ? 'text-surface-500 group-focus-within:text-primary-400' : 'text-surface-300 group-focus-within:text-primary-500'}`}>
                <HiOutlineMail size={20} />
              </span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                placeholder="Enter your email"
                className={inputClasses}
              />
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between ml-1">
              <label className={`block text-[11px] font-black tracking-[0.1em] uppercase ${darkMode ? 'text-surface-500' : 'text-surface-400'}`}>
                Password
              </label>
              <button type="button" className="text-[11px] font-black tracking-wider uppercase text-primary-500 hover:text-primary-400 transition-colors">
                Forgot?
              </button>
            </div>
            <div className="relative group">
              <span className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${darkMode ? 'text-surface-500 group-focus-within:text-primary-400' : 'text-surface-300 group-focus-within:text-primary-500'}`}>
                <HiOutlineLockClosed size={20} />
              </span>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                placeholder="Enter your password"
                className={inputClasses}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group w-full py-4 rounded-2xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-black text-lg shadow-2xl shadow-primary-600/30 hover:shadow-primary-600/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:translate-y-[-3px] active:translate-y-0"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Validating...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Sign In <HiOutlineArrowRight className="group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-surface-200/10 text-center">
          <p className={`text-sm font-bold ${darkMode ? 'text-surface-400' : 'text-surface-500'}`}>
            New here?{' '}
            <Link to="/register" className="text-primary-500 font-black hover:text-primary-400 transition-all hover:underline decoration-2 underline-offset-4">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
