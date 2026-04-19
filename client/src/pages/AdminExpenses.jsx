import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { adminService } from '../services/endpoints';
import { formatCurrency, formatDate, CATEGORIES } from '../utils/constants';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import toast from 'react-hot-toast';

const AdminExpenses = () => {
  const { darkMode } = useTheme();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  useEffect(() => { fetchExpenses(); }, [pagination.page]);

  const fetchExpenses = async () => {
    try {
      const { data } = await adminService.getAllExpenses({ page: pagination.page, limit: 20 });
      setExpenses(data.data);
      setPagination(data.pagination);
    } catch { toast.error('Failed to load platform transactions'); }
    finally { setLoading(false); }
  };

  if (loading) return <LoadingSpinner text="Fetching platform-wide transactions..." />;

  const buttonClasses = "px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 disabled:opacity-30 hover:translate-y-[-1px] active:translate-y-0 shadow-sm";

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className={`text-3xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-surface-900'}`}>Platform Transactions</h1>
        <p className={`text-base mt-2 ${darkMode ? 'text-surface-400' : 'text-surface-500'}`}>
          Monitoring <span className="font-bold text-primary-500">{pagination.total}</span> records across all platform members.
        </p>
      </div>

      {expenses.length > 0 ? (
        <div className="space-y-6">
          {/* Desktop Table View */}
          <div className={`hidden lg:block rounded-2xl overflow-hidden shadow-md border ${darkMode ? 'bg-surface-800/80 border-surface-700/50' : 'bg-white border-surface-100'}`}>
            <table className="w-full">
              <thead>
                <tr className={`border-b ${darkMode ? 'bg-surface-700/50 border-surface-700' : 'bg-surface-50 border-surface-100'}`}>
                  {['User Member','Category','Type','Amount','Date Recorded'].map(h => (
                    <th key={h} className={`text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest ${darkMode ? 'text-surface-400' : 'text-surface-500'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className={`divide-y ${darkMode ? 'divide-surface-700/50' : 'divide-surface-100'}`}>
                {expenses.map(exp => {
                  const cat = CATEGORIES.find(c => c.value === exp.category);
                  return (
                    <tr key={exp._id} className={`transition-colors duration-200 ${darkMode ? 'hover:bg-surface-700/30' : 'hover:bg-surface-50/50'}`}>
                      <td className="px-6 py-4">
                        <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-surface-900'}`}>{exp.user?.name || 'Deleted User'}</p>
                        <p className={`text-xs font-medium ${darkMode ? 'text-surface-400' : 'text-surface-500'}`}>{exp.user?.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <span className="text-lg">{cat?.icon || '📦'}</span>
                          <span className={`text-sm font-bold ${darkMode ? 'text-surface-300' : 'text-surface-700'}`}>{exp.category}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md border ${
                          exp.type === 'income' 
                            ? 'bg-accent-500/10 text-accent-500 border-accent-500/20' 
                            : 'bg-danger-500/10 text-danger-500 border-danger-500/20'
                        }`}>
                          {exp.type}
                        </span>
                      </td>
                      <td className={`px-6 py-4 text-sm font-black ${exp.type === 'income' ? 'text-accent-500' : 'text-danger-500'}`}>
                        {exp.type === 'income' ? '+' : '-'}{formatCurrency(exp.amount)}
                      </td>
                      <td className={`px-6 py-4 text-sm font-medium ${darkMode ? 'text-surface-400' : 'text-surface-500'}`}>{formatDate(exp.date)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-4">
            {expenses.map(exp => {
              const cat = CATEGORIES.find(c => c.value === exp.category);
              return (
                <div key={exp._id} className={`p-5 rounded-2xl shadow-md border transition-all duration-300 animate-fade-in ${
                  darkMode ? 'bg-surface-800/80 border-surface-700/50 hover:border-surface-600' : 'bg-white border-surface-100 hover:border-surface-200'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-surface-500/10">
                        {cat?.icon || '📦'}
                      </div>
                      <div>
                        <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-surface-900'}`}>{exp.category}</p>
                        <p className={`text-xs font-medium ${darkMode ? 'text-surface-400' : 'text-surface-500'}`}>{exp.user?.name}</p>
                      </div>
                    </div>
                    <span className={`text-base font-black ${exp.type === 'income' ? 'text-accent-500' : 'text-danger-500'}`}>
                      {exp.type === 'income' ? '+' : '-'}{formatCurrency(exp.amount)}
                    </span>
                  </div>
                  <div className={`flex items-center justify-between pt-4 border-t ${darkMode ? 'border-surface-700/50' : 'border-surface-100'}`}>
                    <span className={`text-xs font-black uppercase tracking-widest ${exp.type === 'income' ? 'text-accent-500' : 'text-danger-500'}`}>{exp.type}</span>
                    <span className={`text-xs font-bold ${darkMode ? 'text-surface-400' : 'text-surface-500'}`}>{formatDate(exp.date)}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-4 py-4 animate-fade-in">
              <button 
                onClick={() => setPagination(p => ({...p, page: p.page-1}))} 
                disabled={pagination.page <= 1} 
                className={`${buttonClasses} ${darkMode ? 'bg-surface-800 text-surface-300' : 'bg-white text-surface-600 border border-surface-200'}`}
              >
                Previous
              </button>
              <span className={`text-sm font-bold ${darkMode ? 'text-surface-400' : 'text-surface-500'}`}>
                Page {pagination.page} of {pagination.pages}
              </span>
              <button 
                onClick={() => setPagination(p => ({...p, page: p.page+1}))} 
                disabled={pagination.page >= pagination.pages} 
                className={`${buttonClasses} ${darkMode ? 'bg-surface-800 text-surface-300' : 'bg-white text-surface-600 border border-surface-200'}`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      ) : (
        <EmptyState icon="📊" title="No platform transactions" description="Platform-wide history is currently empty. Data will appear as members record expenses." />
      )}
    </div>
  );
};

export default AdminExpenses;
