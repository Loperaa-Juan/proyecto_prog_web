/**
 * Punto de entrada principal de la aplicación ComplexityLab.
 * Monta el árbol de React con todos los providers globales en el orden correcto:
 *   ThemeProvider → AuthProvider → ToastProvider → BrowserRouter → App
 *
 * El orden importa: App usa rutas que usan auth, y auth puede mostrar toasts.
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import App from './App';
import './index.css';

const root = document.getElementById('root');
if (!root) throw new Error('No se encontró el elemento #root en el DOM');

createRoot(root).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
);
