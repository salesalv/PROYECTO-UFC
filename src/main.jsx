import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ClipsProvider } from './context/ClipsContext';
import './index.css';

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ClipsProvider>
      <App />
    </ClipsProvider>
  </React.StrictMode>
);
