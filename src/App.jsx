import React from 'react';
import { BrowserRouter } from 'react-router-dom';
// ✅ SPEED INSIGHTS PARA REACT + VITE:
import { SpeedInsights } from '@vercel/speed-insights/react';

// ℹ️ NOTA TÉCNICA:
// El import 'import { SpeedInsights } from "@vercel/speed-insights/next";'
// no se activa aquí porque requiere Next.js ('next/navigation').
// En proyectos Next.js se ubica en 'app/layout.jsx' o 'pages/_app.jsx'.

import { AuthProvider } from './modules/auth/states/AuthContext';
import { NotificationProvider } from './modules/core/states/NotificationContext';
import AppRouter from './modules/core/routes/AppRouter';

export const App = () => {
    return (<BrowserRouter>
      <NotificationProvider>
        <AuthProvider>
          <AppRouter />
          {/* Métricas de rendimiento Core Web Vitals en Vercel */}
          <SpeedInsights />
        </AuthProvider>
      </NotificationProvider>
    </BrowserRouter>);
};

export default App;


