import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { expenseService } from '../services/endpoints';
import { formatCurrency, CHART_COLORS, CATEGORIES } from '../utils/constants';
import LoadingSpinner from '../components/LoadingSpinner';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const Analytics = () => {
  const { darkMode } = useTheme();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await expenseService.getStats();
        setStats(data.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  if (loading) return <LoadingSpinner text="Analyzing your finances..." />;

  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const monthlyData = {};
  stats?.monthlyTrends?.forEach(item => {
    const key = monthNames[item._id.month - 1];
    if (!monthlyData[key]) monthlyData[key] = { name: key, income: 0, expense: 0 };
    monthlyData[key][item._id.type] = item.total;
  });
  const barData = Object.values(monthlyData);

  const pieData = stats?.categoryStats?.map(c => ({ name: c._id, value: c.total, count: c.count })) || [];
  const totalExpense = stats?.totalExpense || 1;

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
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
  };

  return (
    <div className="main-container space-y-10">
      {/* Header */}
      <div className="animate-fade-in py-2">
        <h1 className={`text-4xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-surface-900'}`}>Insights</h1>
        <p className={`text-lg font-medium mt-3 leading-relaxed ${darkMode ? 'text-surface-400' : 'text-surface-500'}`}>Deep dive into your financial flows and distribution.</p>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 animate-slide-up">
        {[
          { label: 'Total Income', val: stats?.totalIncome, cls: 'text-accent-500', bg: 'bg-accent-500/10', border: 'border-accent-500/20' },
          { label: 'Total Spending', val: stats?.totalExpense, cls: 'text-danger-500', bg: 'bg-danger-500/10', border: 'border-danger-500/20' },
          { label: 'Net Surplus', val: stats?.balance, cls: 'text-primary-500', bg: 'bg-primary-500/10', border: 'border-primary-500/20' },
        ].map(s => (
          <div key={s.label} className={`rounded-[2rem] p-8 shadow-xl border-2 transition-all duration-500 hover:translate-y-[-4px] hover:shadow-2xl ${
            darkMode ? 'bg-surface-800/80 border-surface-700/50' : 'bg-white border-surface-50'
          }`}>
            <div className="flex items-center justify-between mb-6">
               <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${darkMode ? 'text-surface-500' : 'text-surface-400'}`}>{s.label}</p>
               <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 ${s.bg} ${s.cls} ${s.border}`}>
                  <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
               </div>
            </div>
            <p className={`text-3xl font-black tracking-tight ${s.cls}`}>{formatCurrency(s.val || 0)}</p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Trend Chart */}
        <div className={`rounded-[2rem] p-8 sm:p-10 shadow-xl border-2 animate-fade-in ${
          darkMode ? 'bg-surface-800/80 border-surface-700/50' : 'bg-white border-surface-50'
        }`}>
          <h3 className={`text-xl font-black mb-10 ${darkMode ? 'text-white' : 'text-surface-900'}`}>Income vs Spending</h3>
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="6 6" vertical={false} stroke={darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} stroke={darkMode ? '#475569' : '#94a3b8'} fontSize={11} fontWeight={700} dy={15} />
                <YAxis axisLine={false} tickLine={false} stroke={darkMode ? '#475569' : '#94a3b8'} fontSize={11} fontWeight={700} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.01)' }} />
                <Bar dataKey="income" fill="#10b981" radius={[6,6,0,0]} barSize={18} name="Income" />
                <Bar dataKey="expense" fill="#ef4444" radius={[6,6,0,0]} barSize={18} name="Expense" />
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="flex items-center justify-center h-[320px] text-surface-400 font-bold italic">Awaiting data flows...</div>}
        </div>

        {/* Distribution Chart */}
        <div className={`rounded-[2rem] p-8 sm:p-10 shadow-xl border-2 animate-fade-in ${
          darkMode ? 'bg-surface-800/80 border-surface-700/50' : 'bg-white border-surface-50'
        }`}>
          <h3 className={`text-xl font-black mb-10 ${darkMode ? 'text-white' : 'text-surface-900'}`}>Expense Distribution</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={85} outerRadius={115} paddingAngle={6} dataKey="value" stroke="none">
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} className="hover:opacity-80 transition-all duration-300 cursor-pointer" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : <div className="flex items-center justify-center h-[320px] text-surface-400 font-bold italic">No allocation detected...</div>}
        </div>
      </div>

      {/* Detailed Table */}
      {pieData.length > 0 && (
        <div className={`rounded-[2rem] p-8 sm:p-10 shadow-xl border-2 animate-fade-in ${
          darkMode ? 'bg-surface-800/80 border-surface-700/50' : 'bg-white border-surface-50'
        }`}>
          <h3 className={`text-xl font-black mb-10 ${darkMode ? 'text-white' : 'text-surface-900'}`}>Segment Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pieData.map((cat, i) => {
              const pct = ((cat.value / totalExpense) * 100).toFixed(1);
              const catInfo = CATEGORIES.find(c => c.value === cat.name);
              const color = CHART_COLORS[i % CHART_COLORS.length];
              
              return (
                <div 
                  key={cat.name} 
                  className={`flex items-center gap-6 p-6 rounded-2xl border-2 transition-all duration-500 hover:shadow-lg ${
                    darkMode ? 'bg-surface-700/20 border-transparent hover:bg-surface-700/40 hover:border-surface-600' : 'bg-surface-50 border-transparent hover:bg-white hover:border-surface-100'
                  }`}
                >
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg shrink-0" 
                    style={{ backgroundColor: color + '15', color: color }}
                  >
                    {catInfo?.icon || '📦'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-base font-black truncate ${darkMode ? 'text-white' : 'text-surface-900'}`}>{cat.name}</span>
                      <span className={`text-base font-black ${darkMode ? 'text-white' : 'text-surface-900'}`}>{formatCurrency(cat.value)}</span>
                    </div>
                    <div className={`h-2.5 rounded-full overflow-hidden ${darkMode ? 'bg-surface-800 shadow-inner' : 'bg-surface-100'}`}>
                      <div 
                        className="h-full rounded-full transition-all duration-[1.5s] cubic-bezier(0.16, 1, 0.3, 1) shadow-lg" 
                        style={{ width: `${pct}%`, backgroundColor: color }} 
                      />
                    </div>
                    <div className="flex justify-between mt-3">
                      <span className={`text-[10px] font-black uppercase tracking-widest ${darkMode ? 'text-surface-500' : 'text-surface-400'}`}>{cat.count} records</span>
                      <span className={`text-[11px] font-black tracking-widest ${darkMode ? 'text-primary-400' : 'text-primary-600'}`}>{pct}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
