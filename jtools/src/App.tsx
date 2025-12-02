import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Landing from './routes/Landing'
import ToolPage from './routes/ToolPage'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/tools/:slug" element={<ToolPage />} />
      </Routes>
    </Layout>
  )
}

export default App
