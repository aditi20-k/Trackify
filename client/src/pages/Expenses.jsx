import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { expenseService } from '../services/endpoints';
import { formatCurrency, formatDate, CATEGORIES, exportToCSV } from '../utils/constants';
import ExpenseModal from '../components/ExpenseModal';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import toast from 'react-hot-toast';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineFilter, HiOutlineDownload, HiOutlineX } from 'react-icons/hi';

const Expenses = () => {
  const { darkMode } = useTheme();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editExpense, setEditExpense] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [filters, setFilters] = useState({ category: '', type: '', startDate: '', endDate: '' });

  useEffect(() => { fetchExpenses(); }, [pagination.page, filters]);

  const fetchExpenses = async () => {
    try {
      const params = { page: pagination.page, limit: 15 };
      Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
      const { data } = await expenseService.getAll(params);
      setExpenses(data.data);
      setPagination(data.pagination);
    } catch { toast.error('Failed to load expenses'); }
    finally { setLoading(false); }
  };

  const handleCreate = async (formData) => {
    await expenseService.create(formData);
    toast.success('Transaction added!');
    setShowModal(false);
    fetchExpenses();
  };

  const handleUpdate = async (formData) => {
    await expenseService.update(editExpense._id, formData);
    toast.success('Transaction updated!');
    setEditExpense(null);
    fetchExpenses();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return;
    await expenseService.delete(id);
    toast.success('Deleted');
    fetchExpenses();
  };

  const clearFilters = () => {
    setFilters({ category: '', type: '', startDate: '', endDate: '' });
    setPagination(p => ({ ...p, page: 1 }));
  };

  const hasFilters = Object.values(filters).some(Boolean);
  if (loading) return <LoadingSpinner text="Loading expenses..." />;

  const buttonClasses = "flex items-center gap-2.5 px-6 py-3.5 rounded-2xl text-sm font-black uppercase tracking-wider transition-all duration-300 hover:translate-y-[-2px] active:translate-y-0 shadow-xl shadow-primary-500/10 hover:shadow-primary-500/30";
  const inputClasses = `px-5 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-500/10 ${
    darkMode 
      ? 'bg-surface-700/50 text-white border-2 border-surface-600 hover:border-surface-500 focus:border-primary-500' 
      : 'bg-surface-50 text-surface-900 border-2 border-surface-100 hover:border-surface-200 focus:border-primary-500'
  }`;

  return (
    <div className="main-container space-y-10">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 animate-fade-in py-2">
        <div>
          <h1 className={`text-4xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-surface-900'}`}>Transactions</h1>
          <p className={`text-lg font-medium mt-3 ${darkMode ? 'text-surface-400' : 'text-surface-500'}`}>
            Explore your spending history across <span className="font-black text-primary-500">{pagination.total}</span> records.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <button 
            onClick={() => exportToCSV(expenses)} 
            className={`${buttonClasses} ${darkMode ? 'bg-surface-800 text-surface-300 hover:bg-surface-700 border-2 border-surface-700' : 'bg-white text-surface-600 hover:bg-surface-50 border-2 border-surface-100'}`}
          >
            <HiOutlineDownload size={18} />Export
          </button>
          <button 
            onClick={() => setShowFilters(!showFilters)} 
            className={`${buttonClasses} ${hasFilters ? 'bg-primary-500 text-white' : darkMode ? 'bg-surface-800 text-surface-300 hover:bg-surface-700 border-2 border-surface-700' : 'bg-white text-surface-600 hover:bg-surface-50 border-2 border-surface-100'}`}
          >
            <HiOutlineFilter size={18} />Filters
          </button>
          <button 
            onClick={() => setShowModal(true)} 
            className={`${buttonClasses} bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-primary-600/20`}
          >
            <HiOutlinePlus size={18} />Add Transaction
          </button>
        </div>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className={`rounded-[2rem] p-8 sm:p-10 shadow-2xl border-2 animate-slide-up ${darkMode ? 'bg-surface-800/80 border-surface-700/50' : 'bg-white border-surface-50'}`}>
          <div className="flex items-center justify-between mb-8">
            <h3 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-surface-900'}`}>Refine History</h3>
            {hasFilters && (
              <button 
                onClick={clearFilters} 
                className="text-xs font-black tracking-widest uppercase text-primary-500 hover:text-primary-400 transition-all flex items-center gap-2"
              >
                <HiOutlineX size={16} />Reset Filters
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${darkMode ? 'text-surface-500' : 'text-surface-400'}`}>Type</label>
              <select value={filters.type} onChange={e => { setFilters({...filters, type: e.target.value}); setPagination(p=>({...p,page:1})); }} className={`${inputClasses} w-full`}>
                <option value="">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${darkMode ? 'text-surface-500' : 'text-surface-400'}`}>Category</label>
              <select value={filters.category} onChange={e => { setFilters({...filters, category: e.target.value}); setPagination(p=>({...p,page:1})); }} className={`${inputClasses} w-full`}>
                <option value="">All Categories</option>
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${darkMode ? 'text-surface-500' : 'text-surface-400'}`}>Start Date</label>
              <input type="date" value={filters.startDate} onChange={e => { setFilters({...filters, startDate: e.target.value}); setPagination(p=>({...p,page:1})); }} className={`${inputClasses} w-full`} />
            </div>
            <div className="space-y-2">
              <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${darkMode ? 'text-surface-500' : 'text-surface-400'}`}>End Date</label>
              <input type="date" value={filters.endDate} onChange={e => { setFilters({...filters, endDate: e.target.value}); setPagination(p=>({...p,page:1})); }} className={`${inputClasses} w-full`} />
            </div>
          </div>
        </div>
      )}

      {/* Expenses List */}
      {expenses.length > 0 ? (
        <div className="space-y-8 pb-4">
          <div className="space-y-6">
            {expenses.map((exp) => {
              const cat = CATEGORIES.find(c => c.value === exp.category);
              return (
                <div 
                  key={exp._id} 
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-8 rounded-[2rem] transition-all duration-500 border-2 hover:shadow-2xl animate-fade-in ${
                    darkMode ? 'bg-surface-800/80 border-surface-700/50 hover:border-surface-600' : 'bg-white border-surface-50 hover:border-surface-100 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-6 flex-1 min-w-0">
                    <div 
                      className="w-16 h-16 rounded-[1.25rem] flex items-center justify-center text-3xl shrink-0 shadow-lg" 
                      style={{ backgroundColor: (cat?.color||'#64748b')+'20', color: cat?.color||'#64748b' }}
                    >
                      {cat?.icon||'📦'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-lg font-black truncate ${darkMode ? 'text-white' : 'text-surface-900'}`}>
                        {exp.description || exp.category}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                         <span className={`text-[11px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${darkMode ? 'bg-surface-700 text-surface-400' : 'bg-surface-50 text-surface-500'}`}>
                            {exp.category}
                         </span>
                         <span className="opacity-30 font-bold">•</span>
                         <p className={`text-[11px] font-black uppercase tracking-widest ${darkMode ? 'text-surface-500' : 'text-surface-400'}`}>
                           {formatDate(exp.date)}
                         </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-10 mt-6 sm:mt-0">
                    <span className={`text-2xl font-black tracking-tight whitespace-nowrap ${exp.type==='income' ? 'text-accent-500' : 'text-danger-500'}`}>
                      {exp.type==='income'?'+':'-'}{formatCurrency(exp.amount)}
                    </span>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setEditExpense(exp)} 
                        className={`p-3 rounded-xl transition-all duration-300 ${darkMode ? 'hover:bg-surface-700 text-surface-500 hover:text-white border border-transparent hover:border-surface-600' : 'hover:bg-surface-50 text-surface-300 hover:text-surface-900 border border-transparent hover:border-surface-200'}`}
                        title="Edit Transaction"
                      >
                        <HiOutlinePencil size={20} />
                      </button>
                      <button 
                        onClick={() => handleDelete(exp._id)} 
                        className="p-3 rounded-xl hover:bg-danger-500/10 text-danger-300 hover:text-danger-500 transition-all duration-300 border border-transparent hover:border-danger-500/20"
                        title="Delete Transaction"
                      >
                        <HiOutlineTrash size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-6 py-10 animate-fade-in">
              <button 
                onClick={() => setPagination(p=>({...p, page: p.page-1}))} 
                disabled={pagination.page<=1} 
                className={`${buttonClasses} !px-8 ${darkMode ? 'bg-surface-800 text-surface-300 border-2 border-surface-700' : 'bg-white text-surface-600 border-2 border-surface-100'}`}
              >
                Previous
              </button>
              <div className="flex flex-col items-center">
                 <span className={`text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ${darkMode ? 'text-white' : 'text-surface-900'}`}>Progress</span>
                 <span className={`text-sm font-black mt-1 ${darkMode ? 'text-primary-400' : 'text-primary-600'}`}>
                   {pagination.page} / {pagination.pages}
                 </span>
              </div>
              <button 
                onClick={() => setPagination(p=>({...p, page: p.page+1}))} 
                disabled={pagination.page>=pagination.pages} 
                className={`${buttonClasses} !px-8 ${darkMode ? 'bg-surface-800 text-surface-300 border-2 border-surface-700' : 'bg-white text-surface-600 border-2 border-surface-100'}`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      ) : (
        <EmptyState 
          icon="💳" 
          title="No transactions found" 
          description={hasFilters ? "We couldn't find any transactions matching your specific filters. Try expanding your search." : "Your financial history is a blank canvas. Start adding transactions to see your progress!"} 
          action={!hasFilters && (
            <button 
              onClick={() => setShowModal(true)} 
              className={`${buttonClasses} bg-gradient-to-r from-primary-600 to-primary-500 text-white px-10`}
            >
              Add First Record
            </button>
          )} 
        />
      )}

      {showModal && <ExpenseModal onClose={() => setShowModal(false)} onSubmit={handleCreate} />}
      {editExpense && <ExpenseModal expense={editExpense} onClose={() => setEditExpense(null)} onSubmit={handleUpdate} />}
    </div>
  );
};

export default Expenses;
