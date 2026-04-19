import { useTheme } from '../context/ThemeContext';

const EmptyState = ({ icon, title, description, action }) => {
  const { darkMode } = useTheme();

  return (
    <div className={`flex flex-col items-center justify-center py-20 px-8 rounded-3xl border border-dashed animate-fade-in ${
      darkMode ? 'bg-surface-900/50 border-surface-700' : 'bg-surface-50 border-surface-200'
    }`}>
      <div className={`w-24 h-24 rounded-2xl flex items-center justify-center text-5xl mb-8 shadow-inner ${
        darkMode ? 'bg-surface-800 text-white' : 'bg-white text-surface-900 shadow-surface-200/50'
      }`}>
        {icon || '📭'}
      </div>
      <h3 className={`text-2xl font-black mb-3 tracking-tight ${darkMode ? 'text-white' : 'text-surface-900'}`}>
        {title || 'Nothing here yet'}
      </h3>
      <p className={`text-base font-medium text-center max-w-sm mb-10 leading-relaxed ${darkMode ? 'text-surface-400' : 'text-surface-500'}`}>
        {description || 'Start by adding your first item to see your data come alive.'}
      </p>
      {action && (
        <div className="animate-bounce-subtle">
           {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
