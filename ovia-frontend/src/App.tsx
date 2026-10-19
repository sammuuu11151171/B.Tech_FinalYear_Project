import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AccessibilityProvider } from './contexts/AccessibilityContext';
import { PublicLayout } from './layouts/PublicLayout';
import { StudentLayout } from './layouts/StudentLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { LandingPage } from './pages/public/LandingPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { UnauthorizedPage } from './pages/public/UnauthorizedPage';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { LearnPage } from './pages/student/LearnPage';
import { LessonDetailPage } from './pages/student/LessonDetailPage';
import { QuizzesPage } from './pages/student/QuizzesPage';
import { QuizAttemptPage } from './pages/student/QuizAttemptPage';
import { AITutorPage } from './pages/student/AITutorPage';
import { ProgressPage } from './pages/student/ProgressPage';
import { ProfilePage } from './pages/student/ProfilePage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminModulePage } from './pages/admin/AdminModulePage';
import './App.css';

const App: React.FC = () => (
  <BrowserRouter>
    <AccessibilityProvider>
      <AuthProvider>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="/learn" element={<Navigate to="/student/learn" replace />} />
            <Route path="/quizzes" element={<Navigate to="/student/quizzes" replace />} />
            <Route path="/ai-tutor" element={<Navigate to="/student/ai-tutor" replace />} />
          </Route>
          <Route path="/student" element={<StudentLayout />}>
            <Route index element={<StudentDashboard />} />
            <Route path="learn" element={<LearnPage />} />
            <Route path="learn/:id" element={<LessonDetailPage />} />
            <Route path="quizzes" element={<QuizzesPage />} />
            <Route path="quizzes/:id" element={<QuizAttemptPage />} />
            <Route path="ai-tutor" element={<AITutorPage />} />
            <Route path="progress" element={<ProgressPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminModulePage />} />
            <Route path="audit-logs" element={<AdminModulePage />} />
            <Route path="system-health" element={<AdminModulePage />} />
            <Route path="profile" element={<AdminModulePage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </AccessibilityProvider>
  </BrowserRouter>
);

export default App;
