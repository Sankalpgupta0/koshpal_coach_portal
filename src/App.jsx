import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Sessions from './pages/Sessions'
import Clients from './pages/Clients'
import Calendar from './pages/Calendar'
import Availability from './pages/Availability'
import Payments from './pages/Payments'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import ClientOverview from './pages/ClientOverview'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import { ThemeProvider } from './components/ThemeProvider'
import './App.css'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Login - Public route */}
          <Route path="/login" element={<Login />} />
          
          {/* Calendar - Standalone (manages its own sidebar) */}
          <Route path="/calendar" element={
            <ProtectedRoute>
              <Calendar />
            </ProtectedRoute>
          } />
          
          {/* Dashboard - Standalone */}
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          {/* Sessions - Standalone */}
          <Route path="/sessions" element={
            <ProtectedRoute>
              <Sessions />
            </ProtectedRoute>
          } />
          
          {/* Clients - Standalone */}
          <Route path="/clients" element={
            <ProtectedRoute>
              <Clients />
            </ProtectedRoute>
          } />
          
          {/* Client Overview - Standalone */}
          <Route path="/client-overview" element={
            <ProtectedRoute>
              <ClientOverview />
            </ProtectedRoute>
          } />
          
          {/* Availability - Standalone */}
          <Route path="/availability" element={
            <ProtectedRoute>
              <Availability />
            </ProtectedRoute>
          } />
          
          {/* Payments - Standalone */}
          <Route path="/payments" element={
            <ProtectedRoute>
              <Payments />
            </ProtectedRoute>
          } />
          
          {/* Reports - Standalone */}
          <Route path="/reports" element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          } />
          
          {/* Settings - Standalone */}
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />

          {/* Catch all - redirect to login or dashboard */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
