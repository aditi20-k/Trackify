export const CATEGORIES = [
  { value: 'Food', label: 'Food & Dining', icon: '🍕', color: '#f97316' },
  { value: 'Transport', label: 'Transport', icon: '🚗', color: '#3b82f6' },
  { value: 'Shopping', label: 'Shopping', icon: '🛍️', color: '#ec4899' },
  { value: 'Entertainment', label: 'Entertainment', icon: '🎬', color: '#8b5cf6' },
  { value: 'Bills', label: 'Bills & Utilities', icon: '💡', color: '#f59e0b' },
  { value: 'Health', label: 'Health', icon: '🏥', color: '#10b981' },
  { value: 'Education', label: 'Education', icon: '📚', color: '#06b6d4' },
  { value: 'Salary', label: 'Salary', icon: '💰', color: '#22c55e' },
  { value: 'Freelance', label: 'Freelance', icon: '💻', color: '#14b8a6' },
  { value: 'Other', label: 'Other', icon: '📦', color: '#64748b' },
];

export const CHART_COLORS = [
  '#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6',
  '#8b5cf6', '#f97316', '#06b6d4', '#ef4444', '#64748b',
];

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const formatDateInput = (date) => {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

export const exportToCSV = (expenses) => {
  const headers = ['Date', 'Type', 'Category', 'Amount', 'Description'];
  const rows = expenses.map((e) => [
    formatDate(e.date),
    e.type,
    e.category,
    e.amount,
    e.description || '',
  ]);

  const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `expenses_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};
