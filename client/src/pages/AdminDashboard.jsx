import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { adminService } from '../services/endpoints';
import { formatCurrency } from '../utils/constants';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { HiOutlineUsers, HiOutlineBan, HiOutlineCurrencyRupee, HiOutlineDocumentText } from 'react-icons/hi';

const AdminDashboard = () => {
  const { darkMode } = useTheme();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await adminService.getStats();
        setStats(data.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  if (loading) return <LoadingSpinner text="Accessing administrative data..." />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className={`text-3xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-surface-900'}`}>Admin Overview</h1>
        <p className={`text-base mt-2 ${darkMode ? 'text-surface-400' : 'text-surface-500'}`}>Platform-wide statistics and management dashboard.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
        <StatCard title="Active Users" value={stats?.totalUsers || 0} icon={<HiOutlineUsers size={24} />} color="primary" />
        <StatCard title="Blocked Accounts" value={stats?.blockedUsers || 0} icon={<HiOutlineBan size={24} />} color="danger" />
        <StatCard title="Total Transactions" value={stats?.totalExpenses || 0} icon={<HiOutlineDocumentText size={24} />} color="warn" />
        <StatCard title="Platform Volume" value={formatCurrency((stats?.totalIncome || 0) + (stats?.totalExpenseAmount || 0))} icon={<HiOutlineCurrencyRupee size={24} />} color="accent" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Categories */}
        <div className={`rounded-2xl p-6 shadow-md border animate-fade-in ${darkMode ? 'bg-surface-800/80 border-surface-700/50' : 'bg-white border-surface-100'}`}>
          <h3 className={`text-lg font-bold mb-6 ${darkMode ? 'text-white' : 'text-surface-900'}`}>Top Expense Categories</h3>
          <div className="space-y-4">
            {stats?.topCategories?.length > 0 ? stats.topCategories.map((cat, i) => (
              <div 
                key={cat._id} 
                className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
                  darkMode ? 'bg-surface-700/30 border-surface-600/50 hover:bg-surface-700/50' : 'bg-surface-50 border-surface-200/50 hover:bg-surface-100/50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black shadow-sm ${
                    darkMode ? 'bg-primary-500/20 text-primary-400' : 'bg-primary-100 text-primary-600'
                  }`}>{i + 1}</span>
                  <div>
                    <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-surface-900'}`}>{cat._id}</p>
                    <p className={`text-xs font-medium ${darkMode ? 'text-surface-400' : 'text-surface-500'}`}>{cat.count} records</p>
                  </div>
                </div>
                <span className={`text-sm font-black ${darkMode ? 'text-white' : 'text-surface-900'}`}>{formatCurrency(cat.total)}</span>
              </div>
            )) : <p className={`text-sm font-medium text-center py-10 ${darkMode ? 'text-surface-400' : 'text-surface-500'}`}>No platform data recorded yet</p>}
          </div>
        </div>

        {/* Recent Users */}
        <div className={`rounded-2xl p-6 shadow-md border animate-fade-in ${darkMode ? 'bg-surface-800/80 border-surface-700/50' : 'bg-white border-surface-100'}`}>
          <h3 className={`text-lg font-bold mb-6 ${darkMode ? 'text-white' : 'text-surface-900'}`}>Newest Members</h3>
          <div className="space-y-4">
            {stats?.recentUsers?.length > 0 ? stats.recentUsers.map(u => (
              <div 
                key={u._id} 
                className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
                  darkMode ? 'bg-surface-700/30 border-surface-600/50 hover:bg-surface-700/50' : 'bg-surface-50 border-surface-200/50 hover:bg-surface-100/50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-base font-black shadow-sm ${
                    darkMode ? 'bg-primary-500/20 text-primary-400' : 'bg-primary-100 text-primary-600'
                  }`}>
                    {u.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-surface-900'}`}>{u.name}</p>
                    <p className={`text-xs font-medium ${darkMode ? 'text-surface-400' : 'text-surface-500'}`}>{u.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {u.isBlocked && <span className="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md bg-danger-500/10 text-danger-500 border border-danger-500/20">Blocked</span>}
                  {u.role === 'admin' && <span className="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md bg-primary-500/10 text-primary-500 border border-primary-500/20">Admin</span>}
                </div>
              </div>
            )) : <p className={`text-sm font-medium text-center py-10 ${darkMode ? 'text-surface-400' : 'text-surface-500'}`}>No registered users found</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
