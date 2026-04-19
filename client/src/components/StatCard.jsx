import { useTheme } from '../context/ThemeContext';

const StatCard = ({ title, value, icon, trend, color = 'primary', className = '' }) => {
  const { darkMode } = useTheme();

  const colorMap = {
    primary: {
      bg: darkMode ? 'bg-primary-500/10' : 'bg-primary-50',
      icon: 'text-primary-500',
      border: darkMode ? 'border-primary-500/20' : 'border-primary-100',
    },
    accent: {
      bg: darkMode ? 'bg-accent-500/10' : 'bg-emerald-50',
      icon: 'text-accent-500',
      border: darkMode ? 'border-accent-500/20' : 'border-emerald-100',
    },
    danger: {
      bg: darkMode ? 'bg-danger-500/10' : 'bg-red-50',
      icon: 'text-danger-500',
      border: darkMode ? 'border-danger-500/20' : 'border-red-100',
    },
    warn: {
      bg: darkMode ? 'bg-warn-500/10' : 'bg-amber-50',
      icon: 'text-warn-500',
      border: darkMode ? 'border-warn-500/20' : 'border-amber-100',
    },
  };

  const c = colorMap[color] || colorMap.primary;

  return (
    <div
      className={`rounded-[2rem] p-8 transition-all duration-500 hover:translate-y-[-4px] hover:shadow-2xl border-2 ${
        darkMode
          ? 'bg-surface-800/80 border-surface-700/50 hover:border-surface-600 shadow-xl shadow-black/20'
          : 'bg-white border-surface-50 shadow-lg shadow-surface-100 hover:shadow-surface-200/50'
      } ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-3 ${darkMode ? 'text-surface-500' : 'text-surface-400'}`}>
            {title}
          </p>
          <p className={`text-3xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-surface-900'}`}>
            {value}
          </p>
          {trend && (
            <div className={`flex items-center gap-1.5 mt-4 px-2 py-1 rounded-lg w-fit ${
              trend > 0 ? 'bg-accent-500/10 text-accent-500' : 'bg-danger-500/10 text-danger-500'
            }`}>
              <span className="text-xs font-black uppercase tracking-wider">
                {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
              </span>
            </div>
          )}
        </div>
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 ${c.bg} ${c.border} shadow-lg transition-transform hover:scale-110`}>
          <span className={`text-2xl ${c.icon}`}>{icon}</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
