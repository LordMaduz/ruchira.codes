import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initializeTheme } from './store/themeStore';

// Initialize theme before rendering to prevent flash
initializeTheme();

createRoot(document.getElementById('root')!).render(<App />);
