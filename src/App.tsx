import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { MainLayout } from './components/Layout/MainLayout';
import { Home } from './pages/Home';
import { StoryDetail } from './pages/StoryDetail';
import { Reader } from './pages/Reader';
import { WriterDashboard } from './pages/WriterDashboard';
import { EditStory } from './pages/Writer/EditStory';
import { ManageChapters } from './pages/Writer/ManageChapters';
import { Login } from './pages/Login';

const ProtectedRoute = ({ children, role }: { children: React.ReactNode; role?: string }) => {
  const { profile, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!profile) return <Navigate to="/login" />;
  if (role && profile?.role !== role && profile?.role !== 'admin') return <Navigate to="/" />;

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
            path="/writer" 
            element={
              <ProtectedRoute role="writer">
                <MainLayout><WriterDashboard /></MainLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/writer/new-story" 
            element={
              <ProtectedRoute role="writer">
                <MainLayout><EditStory /></MainLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/writer/edit-story/:id" 
            element={
              <ProtectedRoute role="writer">
                <MainLayout><EditStory /></MainLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/writer/manage-chapters/:storyId" 
            element={
              <ProtectedRoute role="writer">
                <MainLayout><ManageChapters /></MainLayout>
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
