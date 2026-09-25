import { lazy, Suspense } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ScrollToTop } from './components/ScrollToTop';
import { Home } from './pages/Home';

const Admin = lazy(() => import('./pages/Admin').then((module) => ({ default: module.Admin })));
const Login = lazy(() => import('./pages/Login').then((module) => ({ default: module.Login })));

function NotFound() {
  return (
    <div className="ritual-page flex min-h-screen items-center justify-center px-6">
      <div className="ritual-card max-w-md p-8 text-center">
        <span className="ritual-kicker">portal perdido</span>
        <h1 className="ritual-display mt-3 text-4xl">A gira não está aqui</h1>
        <p className="ritual-muted mt-3">Volte ao convite ou abra o painel da casa.</p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center"><Link to="/" className="ritual-button ritual-button-primary">Ir para o convite</Link><Link to="/admin" className="ritual-button ritual-button-ghost">Abrir painel</Link></div>
      </div>
    </div>
  );
}

function RouteFallback() {
  return (
    <div className="ritual-page flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <span className="ritual-kicker">a casa prepara o portal</span>
        <span className="h-8 w-8 animate-spin rounded-full border border-[#c5a059]/30 border-t-[#c5a059]" />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}
