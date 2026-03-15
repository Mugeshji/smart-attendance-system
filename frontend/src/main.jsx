import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgba(17, 17, 40, 0.95)',
              color: '#e2e8f0',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: '12px',
            },
          }}
        />
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
