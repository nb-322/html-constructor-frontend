import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { ErrorBoundary } from './components/ErrorBoundary'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <ErrorBoundary>
          <AuthProvider>
              <ThemeProvider>
                  <App></App>
              </ThemeProvider>
          </AuthProvider>
      </ErrorBoundary>
  </StrictMode>,
)
