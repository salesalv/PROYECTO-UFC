import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ClipsProvider } from './context/ClipsContext';
import './index.css';
import { BrowserRouter } from 'react-router-dom';

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ClipsProvider>
        <App />
      </ClipsProvider>
    </BrowserRouter>
  </React.StrictMode>
);
