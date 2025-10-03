import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './App.css';
import './i18n';

// Components
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TendersPage from './pages/TendersPage';
import TenderDetailPage from './pages/TenderDetailPage';
import MyTendersPage from './pages/MyTendersPage';
import MyBidsPage from './pages/MyBidsPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Protected Route Component
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  

  
  return children;
}

// Main App Layout
function AppLayout() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-background">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex">
        {user && (
          <Sidebar 
            isOpen={sidebarOpen} 
            onClose={() => setSidebarOpen(false)} 
          />
        )}
        
        <main className={`flex-1 transition-all duration-300 ${
          user && sidebarOpen ? 'ml-64' : user ? 'ml-16' : 'ml-0'
        }`}>
          <div className="p-6">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={
                user ? <Navigate to="/" replace /> : <LoginPage />
              } />
              <Route path="/register" element={
                user ? <Navigate to="/" replace /> : <RegisterPage />
              } />
              
              {/* Protected Routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              } />
              
              <Route path="/tenders" element={
                <ProtectedRoute>
                  <TendersPage />
                </ProtectedRoute>
              } />
              
              <Route path="/tenders/:id" element={
                <ProtectedRoute>
                  <TenderDetailPage />
                </ProtectedRoute>
              } />
              
              <Route path="/my-tenders" element={
                <ProtectedRoute>
                  <MyTendersPage />
                </ProtectedRoute>
              } />
              
              <Route path="/my-bids" element={
                <ProtectedRoute>
                  <MyBidsPage />
                </ProtectedRoute>
              } />
              
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminPage />
                </ProtectedRoute>
              } />
              
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

function App() {
  const { i18n } = useTranslation();
  
  useEffect(() => {
    // Set document language
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppLayout />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
