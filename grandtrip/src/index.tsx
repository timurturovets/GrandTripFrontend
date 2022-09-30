import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthContextProvider } from './AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root') || document.body);

root.render(
        <AuthContextProvider>
                <App />
        </AuthContextProvider>
);