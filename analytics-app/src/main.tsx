import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Fonts
import '@fontsource/unbounded/600.css'; // Semibold
import '@fontsource/unbounded/700.css'; // Bold
import '@fontsource/unbounded/800.css'; // ExtraBold

import '@fontsource/manrope/400.css';
import '@fontsource/manrope/500.css'; // Medium
import '@fontsource/manrope/700.css'; // Bold

import './index.css'
import App from './App.tsx'

import GlobalDebug from './components/dev/GlobalDebug.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GlobalDebug />
    <App />
  </StrictMode>,
)

// Remove the static loader after React takes over
const loader = document.getElementById('app-loader')
if (loader) {
  // Small delay to ensure the first react paint is visible
  setTimeout(() => {
    loader.classList.add('fade-out')
    setTimeout(() => loader.remove(), 300)
  }, 100)
}
