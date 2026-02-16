/**
 * Project Face — Main Application
 * AI-Powered Skin Analysis by GlowStarLabs
 */
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Analyze from './pages/Analyze';
import HistoryPage from './pages/HistoryPage';
import Trials from './pages/Trials';
import Tourism from './pages/Tourism';
import EcoPage from './pages/EcoPage';
import Premium from './pages/Premium';
import SettingsPage from './pages/SettingsPage';

function ProtectedRoute({ children, isAuthenticated }: { children: React.ReactNode; isAuthenticated: boolean }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  const { user, isAuthenticated, login, register, logout, refreshUser } = useAuth();

  return (
    <BrowserRouter>
      <Layout
        isAuthenticated={isAuthenticated}
        onLogout={logout}
        userName={user?.full_name}
      >
        <Routes>
          {/* Public */}
          <Route
            path="/"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Landing />}
          />
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login onLogin={login} />}
          />
          <Route
            path="/register"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register onRegister={register} />}
          />

          {/* Protected */}
          <Route path="/dashboard" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Dashboard user={user!} />
            </ProtectedRoute>
          } />
          <Route path="/analyze" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Analyze />
            </ProtectedRoute>
          } />
          <Route path="/history" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <HistoryPage />
            </ProtectedRoute>
          } />
          <Route path="/trials" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Trials />
            </ProtectedRoute>
          } />
          <Route path="/tourism" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Tourism />
            </ProtectedRoute>
          } />
          <Route path="/eco" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <EcoPage />
            </ProtectedRoute>
          } />
          <Route path="/premium" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Premium />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <SettingsPage user={user!} onUpdate={refreshUser} />
            </ProtectedRoute>
          } />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
