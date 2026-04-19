import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { CATEGORIES, formatDateInput } from '../utils/constants';
import { HiOutlineX } from 'react-icons/hi';

const ExpenseModal = ({ expense, onClose, onSubmit }) => {
  const { darkMode } = useTheme();
  const isEdit = Boolean(expense?._id);

  const [form, setForm] = useState({
    amount: expense?.amount || '',
    type: expense?.type || 'expense',
    category: expense?.category || 'Food',
    description: expense?.description || '',
    date: expense?.date ? formatDateInput(expense.date) : formatDateInput(new Date()),
  });
  const [customCategory, setCustomCategory] = useState('');
  const [useCustom, setUseCustom] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = {
        ...form,
        amount: parseFloat(form.amount),
        category: useCustom ? customCategory : form.category,
      };
      await onSubmit(data);
    } catch {
      setSubmitting(false);
    }
  };

  const inputClasses = `w-full px-4 py-3 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 ${
    darkMode
      ? 'bg-surface-700/80 text-white border border-surface-600 placeholder-surface-500 hover:border-surface-500'
      : 'bg-surface-50 text-surface-900 border border-surface-200 placeholder-surface-400 hover:border-surface-300'
  }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-md rounded-2xl shadow-2xl p-6 animate-slide-up ${
          darkMode ? 'bg-surface-800 border border-surface-700' : 'bg-white'
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-surface-900'}`}>
            {isEdit ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-all duration-200 ${
              darkMode ? 'hover:bg-surface-700 text-surface-400 hover:text-surface-200' : 'hover:bg-surface-100 text-surface-500 hover:text-surface-700'
            }`}
          >
            <HiOutlineX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Type Toggle */}
          <div className={`flex rounded-xl p-1 ${darkMode ? 'bg-surface-700' : 'bg-surface-100'}`}>
            <button
              type="button"
              onClick={() => setForm({ ...form, type: 'income' })}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                form.type === 'income'
                  ? 'bg-accent-500 text-white shadow-md'
                  : darkMode ? 'text-surface-400 hover:text-surface-200' : 'text-surface-500 hover:text-surface-700'
              }`}
            >
              Income
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, type: 'expense' })}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                form.type === 'expense'
                  ? 'bg-danger-500 text-white shadow-md'
                  : darkMode ? 'text-surface-400 hover:text-surface-200' : 'text-surface-500 hover:text-surface-700'
              }`}
            >
              Expense
            </button>
          </div>

          {/* Amount */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-surface-300' : 'text-surface-700'}`}>
              Amount (₹)
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              required
              placeholder="0.00"
              className={`${inputClasses} !text-lg !font-semibold`}
            />
          </div>

          {/* Category */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={`text-sm font-medium ${darkMode ? 'text-surface-300' : 'text-surface-700'}`}>
                Category
              </label>
              <button
                type="button"
                onClick={() => setUseCustom(!useCustom)}
                className="text-xs text-primary-500 hover:text-primary-400 font-medium transition-colors duration-200"
              >
                {useCustom ? 'Use preset' : '+ Custom'}
              </button>
            </div>
            {useCustom ? (
              <input
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                required
                placeholder="Custom category..."
                className={inputClasses}
              />
            ) : (
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={inputClasses}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Description */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-surface-300' : 'text-surface-700'}`}>
              Description
            </label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="What's this for?"
              maxLength={200}
              className={inputClasses}
            />
          </div>

          {/* Date */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-surface-300' : 'text-surface-700'}`}>
              Date
            </label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
              className={inputClasses}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:translate-y-[-1px] active:translate-y-0 mt-1"
          >
            {submitting ? 'Saving...' : isEdit ? 'Update Transaction' : 'Add Transaction'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ExpenseModal;
