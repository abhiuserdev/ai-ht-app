import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import AIAssistant from './pages/AIAssistant'
import HealthTracker from './pages/HealthTracker'
import ReportAnalyzer from './pages/ReportAnalyzer'
import Insights from './pages/Insights'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/assistant" element={<AIAssistant />} />
        <Route path="/tracker" element={<HealthTracker />} />
        <Route path="/reports" element={<ReportAnalyzer />} />
        <Route path="/insights" element={<Insights />} />
      </Routes>
    </Layout>
  )
}

export default App
