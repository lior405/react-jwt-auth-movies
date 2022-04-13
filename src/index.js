import React from 'react';
import './index.css';
import App from './App';
import { createRoot } from 'react-dom/client';
import { UserProvider } from './components/UserContext';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(<UserProvider> <App tab="home" /> </UserProvider>);



