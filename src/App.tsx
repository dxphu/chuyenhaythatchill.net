import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { MainLayout } from './components/Layout/MainLayout';
import { Home } from './pages/Home';
import { StoryDetail } from './pages/StoryDetail';
import { Reader } from './pages/Reader';
import { WriterDashboard } from './pages/WriterDashboard';
import { Login } from './pages/Login';

const ProtectedRoute = ({ children, role }: { children: React.ReactNode; role?: string }) => {
  const { user, profile, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (role && profile?.role !== role) return <Navigate to="/" />;

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={<MainLayout><Home /></MainLayout>} />
          <Route path="/story/:id" element={<MainLayout><StoryDetail /></MainLayout>} />
          <Route path="/story/:storyId/chapter/:chapterId" element={<Reader />} />

          {/* Protected Writer Routes */}
          <Route 
            path="/writer/*" 
            element={
              <ProtectedRoute role="writer">
                <MainLayout><WriterDashboard /></MainLayout>
              </ProtectedRoute>
            } 
          />

          {/* 404 Redirect */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
