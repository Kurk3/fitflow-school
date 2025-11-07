import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import GoalsWizard from './pages/GoalsWizard'
import './index.css'

// Protected Route Component
function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

// Wizard Route - vyžaduje auth, ale presmeruje na dashboard ak už je hotový
function WizardRoute({ children }) {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
  const onboardingCompleted = localStorage.getItem('onboardingCompleted') === 'true'

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (onboardingCompleted) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/goals"
          element={
            <WizardRoute>
              <GoalsWizard />
            </WizardRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
