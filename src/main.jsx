import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ClipsProvider } from './context/ClipsContext';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from "@/context/UserContext";

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ClipsProvider>
        <UserProvider>
          <App />
        </UserProvider>
      </ClipsProvider>
    </BrowserRouter>
  </React.StrictMode>
);
