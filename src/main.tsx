/**
 * Main entry point for the React application
 * Initializes the app with proper providers and routing
 */

// Import polyfills first to fix Node.js compatibility issues
import './polyfills';

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './shadcn.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
