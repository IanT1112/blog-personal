import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Admin from './pages/Admin.jsx'
import ArticlePage from './pages/ArticlePage.jsx'

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <Routes>
        <Route path="/"           element={<App />} />
        <Route path="/admin"      element={<Admin />} />
        <Route path="/post/:id"   element={<ArticlePage />} />
      </Routes>
    </BrowserRouter>
)