import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Analytics from './pages/Analytics';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminExpenses from './pages/AdminExpenses';
import LoadingSpinner from './components/LoadingSpinner';

const AppLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-64px)] pt-6 pb-12 animate-fade-in">
        {children}
      </main>
    </>
  );
};

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface-50 dark:bg-surface-950">
        <LoadingSpinner size="lg" text="Initialising App" />
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes (No Navbar/Layout) */}
      <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />

      {/* User Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
      <Route path="/expenses" element={<ProtectedRoute><AppLayout><Expenses /></AppLayout></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><AppLayout><Analytics /></AppLayout></ProtectedRoute>} />

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute adminOnly><AppLayout><AdminDashboard /></AppLayout></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute adminOnly><AppLayout><AdminUsers /></AppLayout></ProtectedRoute>} />
      <Route path="/admin/expenses" element={<ProtectedRoute adminOnly><AppLayout><AdminExpenses /></AppLayout></ProtectedRoute>} />

      {/* Default */}
      <Route path="*" element={<Navigate to={user ? (user.role === 'admin' ? '/admin' : '/dashboard') : '/login'} />} />
    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: { 
                borderRadius: '20px', 
                padding: '18px 24px', 
                fontSize: '15px',
                fontWeight: '700',
                boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.2)',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
              },
              success: { 
                style: { background: '#10b981', color: '#fff' } 
              },
              error: { 
                style: { background: '#ef4444', color: '#fff' } 
              },
            }}
          />
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
