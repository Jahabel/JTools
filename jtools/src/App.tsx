import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './routes/Home'
import ToolsIndex from './routes/ToolsIndex'
import ToolPage from './routes/ToolPage'
import { toolRegistry } from './routes/ToolRegistry'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tools" element={<ToolsIndex />} />
        {toolRegistry.map((tool) => (
          <Route key={tool.slug} path={`/tools/${tool.slug}`} element={<ToolPage initialTool={tool} />} />
        ))}
        <Route path="/tools/:slug" element={<ToolPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

export default App
