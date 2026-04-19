import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { expenseService } from '../services/endpoints';
import { formatCurrency, getGreeting, CATEGORIES, CHART_COLORS } from '../utils/constants';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { HiOutlineTrendingUp, HiOutlineTrendingDown, HiOutlineCash, HiOutlineCalendar } from 'react-icons/hi';
import { formatDate } from '../utils/constants';

const Dashboard = () => {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await expenseService.getStats();
      setStats(data.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading dashboard..." />;

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const monthlyData = {};
  stats?.monthlyTrends?.forEach((item) => {
    const key = `${monthNames[item._id.month - 1]}`;
    if (!monthlyData[key]) monthlyData[key] = { name: key, income: 0, expense: 0 };
    if (item._id.type === 'income') monthlyData[key].income = item.total;
    if (item._id.type === 'expense') monthlyData[key].expense = item.total;
  });
  const barData = Object.values(monthlyData);

  const pieData = stats?.categoryStats?.map((cat) => ({
    name: cat._id,
    value: cat.total,
  })) || [];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`px-5 py-3 rounded-2xl shadow-2xl text-sm border-2 ${
          darkMode ? 'bg-surface-800/90 border-surface-700 text-white' : 'bg-white border-surface-50 text-surface-900 shadow-surface-100'
        }`}>
          <p className="font-black mb-1.5 uppercase tracking-wider text-[10px] opacity-60">
            {payload[0].name || payload[0].payload?.name}
          </p>
          <p className="font-black text-primary-500 text-base">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="main-container space-y-10">
      {/* Header */}
      <div className="animate-fade-in py-2">
        <h1 className={`text-4xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-surface-900'}`}>
          {getGreeting()}, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className={`text-lg font-medium mt-3 leading-relaxed ${darkMode ? 'text-surface-400' : 'text-surface-500'}`}>
          Welcome back to your financial control center.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="animate-slide-up delay-100">
          <StatCard
            title="Total Balance"
            value={formatCurrency(stats?.balance || 0)}
            icon={<HiOutlineCash size={24} />}
            color="primary"
          />
        </div>
        <div className="animate-slide-up delay-200">
          <StatCard
            title="Total Income"
            value={formatCurrency(stats?.totalIncome || 0)}
            icon={<HiOutlineTrendingUp size={24} />}
            color="accent"
          />
        </div>
        <div className="animate-slide-up delay-300">
          <StatCard
            title="Total Expenses"
            value={formatCurrency(stats?.totalExpense || 0)}
            icon={<HiOutlineTrendingDown size={24} />}
            color="danger"
          />
        </div>
        <div className="animate-slide-up delay-400">
          <StatCard
            title="Transactions"
            value={stats?.recentTransactions?.length || 0}
            icon={<HiOutlineCalendar size={24} />}
            color="warn"
          />
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Trends */}
        <div className={`rounded-[2rem] p-8 sm:p-10 shadow-xl border-2 animate-fade-in transition-all duration-500 hover:shadow-2xl ${
          darkMode ? 'bg-surface-800/80 border-surface-700/50' : 'bg-white border-surface-50'
        }`}>
          <div className="flex items-center justify-between mb-10">
            <h3 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-surface-900'}`}>
              Monthly Trends
            </h3>
            <div className="flex gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-accent-500" />
                <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Income</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-danger-500" />
                <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Expense</span>
              </div>
            </div>
          </div>
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="6 6" vertical={false} stroke={darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} stroke={darkMode ? '#475569' : '#94a3b8'} fontSize={11} fontWeight={700} dy={15} />
                <YAxis axisLine={false} tickLine={false} stroke={darkMode ? '#475569' : '#94a3b8'} fontSize={11} fontWeight={700} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.01)' }} />
                <Bar dataKey="income" fill="#10b981" radius={[6, 6, 0, 0]} barSize={16} />
                <Bar dataKey="expense" fill="#ef4444" radius={[6, 6, 0, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[320px] text-surface-400 font-bold italic">
              Awaiting data...
            </div>
          )}
        </div>

        {/* Category Breakdown */}
        <div className={`rounded-[2rem] p-8 sm:p-10 shadow-xl border-2 animate-fade-in transition-all duration-500 hover:shadow-2xl ${
          darkMode ? 'bg-surface-800/80 border-surface-700/50' : 'bg-white border-surface-50'
        }`}>
          <h3 className={`text-xl font-black mb-10 ${darkMode ? 'text-white' : 'text-surface-900'}`}>
            Expense Allocation
          </h3>
          {pieData.length > 0 ? (
            <div className="flex flex-col h-[320px]">
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={110}
                      paddingAngle={6}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} className="hover:opacity-80 transition-all duration-300 cursor-pointer" />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-3 justify-center mt-6">
                {pieData.map((item, i) => (
                  <div key={item.name} className="flex items-center gap-2.5">
                    <div
                      className="w-3 h-3 rounded-full shadow-lg"
                      style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                    />
                    <span className={`text-[11px] font-black uppercase tracking-wider ${darkMode ? 'text-surface-400' : 'text-surface-600'}`}>
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[320px] text-surface-400 font-bold italic">
              No allocation data...
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className={`rounded-[2rem] p-8 sm:p-10 shadow-xl border-2 animate-fade-in ${
        darkMode ? 'bg-surface-800/80 border-surface-700/50' : 'bg-white border-surface-50'
      }`}>
        <div className="flex items-center justify-between mb-10">
          <h3 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-surface-900'}`}>
            Recent Activity
          </h3>
          <button className="text-xs font-black uppercase tracking-widest text-primary-500 hover:text-primary-400 transition-all hover:translate-x-1">
            Explore All →
          </button>
        </div>
        <div className="space-y-6">
          {stats?.recentTransactions?.length > 0 ? (
            stats.recentTransactions.map((tx) => {
              const cat = CATEGORIES.find((c) => c.value === tx.category);
              return (
                <div
                  key={tx._id}
                  className={`flex items-center justify-between p-6 rounded-2xl transition-all duration-300 border-2 border-transparent ${
                    darkMode ? 'bg-surface-700/20 hover:bg-surface-700/40 hover:border-surface-600' : 'bg-surface-50 hover:bg-surface-100/70 hover:border-surface-100'
                  }`}
                >
                  <div className="flex items-center gap-5">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg transition-transform hover:scale-110"
                      style={{ backgroundColor: (cat?.color || '#64748b') + '20', color: cat?.color || '#64748b' }}
                    >
                      {cat?.icon || '📦'}
                    </div>
                    <div>
                      <p className={`text-base font-black ${darkMode ? 'text-white' : 'text-surface-900'}`}>
                        {tx.description || tx.category}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                         <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${darkMode ? 'bg-surface-800 text-surface-500' : 'bg-white text-surface-400 shadow-sm'}`}>
                            {cat?.label || tx.category}
                         </span>
                         <span className="text-[10px] font-bold opacity-30">•</span>
                         <p className={`text-[10px] font-black uppercase tracking-widest ${darkMode ? 'text-surface-500' : 'text-surface-400'}`}>
                           {formatDate(tx.date)}
                         </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-black tracking-tight ${
                      tx.type === 'income' ? 'text-accent-500' : 'text-danger-500'
                    }`}>
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-16 opacity-50">
               <p className={`text-base font-bold italic ${darkMode ? 'text-surface-500' : 'text-surface-400'}`}>
                Your transaction history is currently silent.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
