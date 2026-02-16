import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Fonts
import '@fontsource/unbounded/400.css';
import '@fontsource/unbounded/500.css';
import '@fontsource/unbounded/600.css'; // Semibold
import '@fontsource/unbounded/700.css'; // Bold
import '@fontsource/unbounded/800.css'; // ExtraBold
import '@fontsource/unbounded/900.css'; // Black

import '@fontsource/manrope/400.css';
import '@fontsource/manrope/500.css'; // Medium
import '@fontsource/manrope/600.css'; // Semibold (just in case)
import '@fontsource/manrope/700.css'; // Bold

import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
