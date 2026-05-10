/**
 * Componente raíz de enrutamiento de ComplexityLab.
 * Define todas las rutas de la aplicación y aplica el layout correspondiente a cada una.
 *
 * Estructura de rutas:
 * - / : LandingPage (público, footer completo)
 * - /login, /register : Páginas de autenticación (sin footer)
 * - /challenges : Listado de desafíos (público, footer completo)
 * - /dashboard : Dashboard del usuario (protegido, mini footer)
 * - /challenges/new : Crear desafío (protegido, mini footer)
 * - /challenges/:id/edit : Editar desafío (protegido, mini footer)
 * - * : Página 404
 */

import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MiniFooter } from '@/components/layout/MiniFooter';
import { RouteGuard } from '@/components/layout/RouteGuard';

/* Carga diferida de páginas para code-splitting automático de Vite */
const LandingPage      = lazy(() => import('@/pages/LandingPage'));
const LoginPage        = lazy(() => import('@/pages/LoginPage'));
const RegisterPage     = lazy(() => import('@/pages/RegisterPage'));
const ChallengesPage   = lazy(() => import('@/pages/ChallengesPage'));
const DashboardPage    = lazy(() => import('@/pages/DashboardPage'));
const ChallengeFormPage = lazy(() => import('@/pages/ChallengeFormPage'));
const SolvePage        = lazy(() => import('@/pages/SolvePage'));
const NotFoundPage     = lazy(() => import('@/pages/NotFoundPage'));

/** Spinner de carga mientras se descarga el chunk de la página */
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-dark-900">
      <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin-fast" />
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Rutas con footer completo */}
        <Route
          path="/"
          element={
            <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-dark-900">
              <Navbar />
              <main className="flex-1">
                <LandingPage />
              </main>
              <Footer />
            </div>
          }
        />
        <Route
          path="/challenges"
          element={
            <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-dark-900">
              <Navbar />
              <main className="flex-1">
                <ChallengesPage />
              </main>
              <Footer />
            </div>
          }
        />

        {/* Rutas de auth (sin footer) */}
        <Route
          path="/login"
          element={
            <div className="min-h-screen bg-zinc-50 dark:bg-dark-900">
              <LoginPage />
            </div>
          }
        />
        <Route
          path="/register"
          element={
            <div className="min-h-screen bg-zinc-50 dark:bg-dark-900">
              <RegisterPage />
            </div>
          }
        />

        {/* Ruta de resolución: layout full-height sin footer */}
        <Route
          path="/challenges/:id/solve"
          element={
            <RouteGuard>
              <div className="flex flex-col h-screen overflow-hidden bg-zinc-50 dark:bg-dark-900">
                <Navbar />
                <main className="flex-1 overflow-hidden">
                  <SolvePage />
                </main>
              </div>
            </RouteGuard>
          }
        />

        {/* Rutas protegidas con mini footer */}
        <Route
          path="/dashboard"
          element={
            <RouteGuard>
              <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-dark-900">
                <Navbar />
                <main className="flex-1">
                  <DashboardPage />
                </main>
                <MiniFooter />
              </div>
            </RouteGuard>
          }
        />
        <Route
          path="/challenges/new"
          element={
            <RouteGuard>
              <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-dark-900">
                <Navbar />
                <main className="flex-1">
                  <ChallengeFormPage />
                </main>
                <MiniFooter />
              </div>
            </RouteGuard>
          }
        />
        <Route
          path="/challenges/:id/edit"
          element={
            <RouteGuard>
              <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-dark-900">
                <Navbar />
                <main className="flex-1">
                  <ChallengeFormPage />
                </main>
                <MiniFooter />
              </div>
            </RouteGuard>
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={
            <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-dark-900">
              <Navbar />
              <main className="flex-1">
                <NotFoundPage />
              </main>
              <MiniFooter />
            </div>
          }
        />
      </Routes>
    </Suspense>
  );
}
