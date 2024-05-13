import React from 'react';
import { Toaster } from 'react-hot-toast';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
