import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// If localStorage has the old mock data seeded, wipe it so we start clean.
// This runs only once when the key is absent.
if (!localStorage.getItem('cms_initialized')) {
  localStorage.removeItem('cms_jobs');
  localStorage.setItem('cms_initialized', 'true');
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

