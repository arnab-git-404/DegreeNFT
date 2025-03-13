import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { SolanaProvider } from './context/SolanaContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>

    <SolanaProvider>
      <App />
    </SolanaProvider>
  
  </StrictMode>
)
