import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import LandingPage from './pages/LandingPage'
import ToolDetailPage from './pages/ToolDetailPage'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/tools/:slug" element={<ToolDetailPage />} />
      </Routes>
    </Layout>
  )
}

export default App
