import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { adminService } from '../services/endpoints';
import { formatCurrency, formatDate } from '../utils/constants';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import toast from 'react-hot-toast';
import { HiOutlineBan, HiOutlineCheckCircle, HiOutlineTrash } from 'react-icons/hi';

const AdminUsers = () => {
  const { darkMode } = useTheme();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await adminService.getUsers();
      setUsers(data.data);
    } catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  };

  const handleToggleBlock = async (id) => {
    try {
      const { data } = await adminService.toggleBlock(id);
      toast.success(data.message);
      fetchUsers();
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user and all their expenses?')) return;
    try {
      await adminService.deleteUser(id);
      toast.success('User deleted');
      fetchUsers();
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
  };

  if (loading) return <LoadingSpinner text="Loading platform members..." />;

  const buttonClasses = "flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 hover:translate-y-[-1px] active:translate-y-0";

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className={`text-3xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-surface-900'}`}>User Management</h1>
        <p className={`text-base mt-2 ${darkMode ? 'text-surface-400' : 'text-surface-500'}`}>
          Manage access for <span className="font-bold text-primary-500">{users.length}</span> registered users.
        </p>
      </div>

      {users.length > 0 ? (
        <div className="space-y-4">
          {users.map(user => (
            <div 
              key={user._id} 
              className={`flex flex-col md:flex-row md:items-center justify-between p-6 rounded-2xl transition-all duration-300 border hover:shadow-md animate-fade-in ${
                darkMode ? 'bg-surface-800/80 border-surface-700/50 hover:bg-surface-800 hover:border-surface-600' : 'bg-white border-surface-100 hover:border-surface-200'
              }`}
            >
              <div className="flex items-center gap-5 mb-4 md:mb-0">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-xl font-black shrink-0 shadow-sm ${
                  user.isBlocked ? 'bg-danger-500/10 text-danger-500' : user.role === 'admin' ? 'bg-primary-500/10 text-primary-500' : darkMode ? 'bg-surface-700 text-surface-300' : 'bg-surface-100 text-surface-600'
                }`}>
                  {user.name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center flex-wrap gap-2 mb-1">
                    <p className={`text-base font-bold truncate ${darkMode ? 'text-white' : 'text-surface-900'}`}>{user.name}</p>
                    <div className="flex gap-1.5">
                      {user.role === 'admin' && <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-primary-500/10 text-primary-500 border border-primary-500/20">Admin</span>}
                      {user.isBlocked && <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-danger-500/10 text-danger-500 border border-danger-500/20">Blocked</span>}
                    </div>
                  </div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-surface-400' : 'text-surface-500'}`}>{user.email}</p>
                  <div className={`flex items-center gap-3 text-xs font-bold mt-2 ${darkMode ? 'text-surface-500' : 'text-surface-400'}`}>
                    <span className="flex items-center gap-1"><HiOutlineDocumentText className="opacity-50" /> {user.expenseCount} tx</span>
                    <span className="opacity-30">•</span>
                    <span>Spent: <span className="text-primary-500">{formatCurrency(user.totalSpent)}</span></span>
                    <span className="opacity-30 md:inline hidden">•</span>
                    <span className="md:inline hidden">Joined: {formatDate(user.createdAt)}</span>
                  </div>
                </div>
              </div>
              
              {user.role !== 'admin' && (
                <div className="flex items-center gap-3 self-end md:self-auto">
                  <button 
                    onClick={() => handleToggleBlock(user._id)} 
                    className={`${buttonClasses} ${
                      user.isBlocked 
                        ? 'bg-accent-500/10 text-accent-500 hover:bg-accent-500/20 border border-accent-500/20' 
                        : 'bg-warn-500/10 text-warn-500 hover:bg-warn-500/20 border border-warn-500/20'
                    }`}
                  >
                    {user.isBlocked ? <><HiOutlineCheckCircle size={16} />Unblock</> : <><HiOutlineBan size={16} />Block User</>}
                  </button>
                  <button 
                    onClick={() => handleDelete(user._id)} 
                    className={`${buttonClasses} bg-danger-500/10 text-danger-500 hover:bg-danger-500/20 border border-danger-500/20`}
                  >
                    <HiOutlineTrash size={16} />Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon="👥" title="No platform members" description="It looks like there are no registered users on the platform yet." />
      )}
    </div>
  );
};

export default AdminUsers;
