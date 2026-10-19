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

import './App.css';

function AdminDashboardPage() {
  return (
    <main className="ovia-admin-page">
      <header className="ovia-admin-header">
        <p className="ovia-admin-eyebrow">OVIA MANAGEMENT</p>
        <h1>Admin Dashboard</h1>
        <p>Overview of the inclusive learning portal.</p>
      </header>

      <section className="ovia-admin-grid">
        <article className="ovia-admin-card">
          <h2>User Management</h2>
          <p>Manage student accounts and user access in a future release.</p>
          <span className="ovia-admin-status">Coming soon</span>
        </article>

        <article className="ovia-admin-card">
          <h2>Learning Content</h2>
          <p>Review learning materials and lessons in a future release.</p>
          <span className="ovia-admin-status">Coming soon</span>
        </article>

        <article className="ovia-admin-card">
          <h2>System Overview</h2>
          <p>Monitor application activity when the required APIs are connected.</p>
          <span className="ovia-admin-status">Coming soon</span>
        </article>
      </section>
    </main>
  );
}

function App() {
  return (
    <AuthProvider>
      <AccessibilityProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/unauthorized"
                element={<UnauthorizedPage />}
              />
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
              <Route index element={<AdminDashboardPage />} />
            </Route>

            <Route
              path="/learn"
              element={<Navigate to="/student/learn" replace />}
            />

            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />
          </Routes>
        </BrowserRouter>
      </AccessibilityProvider>
    </AuthProvider>
  );
}

export default App;