import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Register PWA Service Worker
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => {
        console.log('PWA Service Worker registered successfully:', reg.scope);
      })
      .catch((err) => {
        console.warn('PWA Service Worker registration failed:', err);
      });
  });
} else if ('serviceWorker' in navigator) {
  // Also register in dev for easier testing if needed, or keeping it enabled
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => {
        console.log('PWA Service Worker registered (Dev):', reg.scope);
      })
      .catch((err) => {
        console.warn('PWA Service Worker registration failed (Dev):', err);
      });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
