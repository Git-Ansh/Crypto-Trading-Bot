import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { CustomizationProvider } from '../src/contexts/CustomizationContext';
import AppRouter from './Router';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <CustomizationProvider>
            <BrowserRouter>
                <AppRouter />
            </BrowserRouter>        
        </CustomizationProvider>
    </React.StrictMode>
);