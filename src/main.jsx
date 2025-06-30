import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ClipsProvider } from './context/ClipsContext';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import './i18n';

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
      <ClipsProvider>
        <App />
      </ClipsProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
