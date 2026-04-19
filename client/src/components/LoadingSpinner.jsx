import { useTheme } from '../context/ThemeContext';

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const { darkMode } = useTheme();
  const sizes = { 
    sm: 'w-6 h-6 border-2', 
    md: 'w-12 h-12 border-4', 
    lg: 'w-20 h-20 border-4' 
  };

  return (
    <div className="flex flex-col items-center justify-center py-20 gap-6 animate-fade-in">
      <div className="relative">
        {/* Outer track */}
        <div className={`${sizes[size]} border-surface-200 dark:border-surface-800 rounded-full`} />
        {/* Spinning indicator */}
        <div className={`absolute inset-0 ${sizes[size]} border-t-primary-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin`} />
        
        {/* Inner glow effect */}
        <div className={`absolute inset-0 ${sizes[size]} rounded-full blur-sm border-t-primary-500/30 border-transparent opacity-50`} />
      </div>
      
      {text && (
        <div className="space-y-1 text-center">
          <p className={`text-sm font-black tracking-widest uppercase ${darkMode ? 'text-primary-400' : 'text-primary-600'}`}>
            {text}
          </p>
          <div className="flex gap-1 justify-center">
             <div className="w-1.5 h-1.5 rounded-full bg-primary-500/40 animate-bounce delay-100" />
             <div className="w-1.5 h-1.5 rounded-full bg-primary-500/60 animate-bounce delay-200" />
             <div className="w-1.5 h-1.5 rounded-full bg-primary-500/80 animate-bounce delay-300" />
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;
