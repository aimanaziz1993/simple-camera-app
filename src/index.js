import React from 'react';
import ReactDOM from 'react-dom/client';
import { FpjsProvider } from '@fingerprintjs/fingerprintjs-pro-react';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <FpjsProvider
      loadOptions={{
        apiKey: "GzuVdUvjogngbi8Qrgrp",
        cacheLocation: 'localstorage'
      }}
    >
      <App />
    </FpjsProvider>
  </React.StrictMode>
);
