import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import GoalsWizard from './pages/GoalsWizard'
import MyPlan from './pages/MyPlan'
import { WorkoutProvider } from './context/WorkoutContext'
import { ToastProvider } from './context/ToastContext'
import { NotificationProvider } from './context/NotificationContext'
import Toast from './components/UI/Toast'
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
      <ToastProvider>
        <NotificationProvider>
          <WorkoutProvider>
            <Toast />
            <Routes>
              <Route path="/landing" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/goals"
                element={
                  <WizardRoute>
                    <GoalsWizard />
                  </WizardRoute>
                }
              />
              <Route
                path="/my-plan"
                element={
                  <ProtectedRoute>
                    <MyPlan />
                  </ProtectedRoute>
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
          </WorkoutProvider>
        </NotificationProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}

export default App
