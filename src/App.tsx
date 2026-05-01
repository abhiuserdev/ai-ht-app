import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import AIAssistant from './pages/AIAssistant'
import HealthTracker from './pages/HealthTracker'
import ReportAnalyzer from './pages/ReportAnalyzer'
import Insights from './pages/Insights'
import Settings from './pages/Settings'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/assistant" element={<AIAssistant />} />
                  <Route path="/tracker" element={<HealthTracker />} />
                  <Route path="/reports" element={<ReportAnalyzer />} />
                  <Route path="/insights" element={<Insights />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  )
}

export default App
