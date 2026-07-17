import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { ToastContainer } from './components/ui/Toast'
import { useToast } from './hooks/useToast'

// Pages
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { ChurnPrediction } from './pages/ChurnPrediction'
import { Segmentation } from './pages/Segmentation'
import { Upload } from './pages/Upload'
import { Settings } from './pages/Settings'

const AppContent: React.FC = () => {
  const { toasts, removeToast } = useToast()

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/churn"
          element={
            <ProtectedRoute>
              <ChurnPrediction />
            </ProtectedRoute>
          }
        />
        <Route
          path="/segmentation"
          element={
            <ProtectedRoute>
              <Segmentation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  )
}
