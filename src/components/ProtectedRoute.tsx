import { Navigate, useLocation } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from './AuthContext';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin, isConfigured } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="ritual-page flex min-h-screen items-center justify-center px-6 text-center">
        <div className="ritual-loader" aria-label="Carregando" />
      </div>
    );
  }

  if (isConfigured && !user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (isConfigured && !isAdmin) {
    return (
      <div className="ritual-page flex min-h-screen items-center justify-center px-6">
        <div className="ritual-card max-w-md p-8 text-center">
          <ShieldAlert className="mx-auto mb-4 h-10 w-10 text-[#d0a85c]" />
          <h1 className="ritual-title text-2xl">Acesso restrito</h1>
          <p className="ritual-muted mt-3">Esta área é exclusiva para a administração da festa.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
