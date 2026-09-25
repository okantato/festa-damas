import { FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Flower2, KeyRound, LogIn } from 'lucide-react';
import { useAuth } from '../components/AuthContext';

export function Login() {
  const { login, loginWithGoogle, isConfigured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await login(email, password);
      const from = (location.state as { from?: string } | null)?.from;
      navigate(from || '/admin', { replace: true });
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Não foi possível entrar.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="ritual-page flex min-h-screen items-center justify-center px-6 py-12">
      <div className="ritual-card w-full max-w-md p-7 sm:p-9">
        <Link to="/" className="mx-auto flex w-fit items-center gap-2 text-[#c5a059]">
          <Flower2 className="h-5 w-5" />
          <span className="ritual-kicker">Festa da Menina</span>
        </Link>
        <div className="mt-7 text-center">
          <h1 className="ritual-display text-4xl">Abrir a casa</h1>
          <p className="ritual-muted mt-2 text-sm">Entre para cuidar dos convites e da lista de presença.</p>
        </div>

        {isConfigured ? (
          <>
            <form onSubmit={submit} className="mt-7 flex flex-col gap-4">
              <label className="ritual-field">
                <span>E-mail</span>
                <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="voce@exemplo.com" />
              </label>
              <label className="ritual-field">
                <span>Senha</span>
                <input type="password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" />
              </label>
              {error ? <p className="admin-alert admin-error">{error}</p> : null}
              <button type="submit" disabled={saving} className="ritual-button ritual-button-primary mt-2 w-full disabled:opacity-60">
                <KeyRound className="h-4 w-4" /> {saving ? 'Abrindo...' : 'Entrar'}
              </button>
            </form>
            <button type="button" onClick={loginWithGoogle} className="ritual-button ritual-button-ghost mt-3 w-full"><LogIn className="h-4 w-4" /> Continuar com Google</button>
          </>
        ) : (
          <div className="mt-7">
            <div className="admin-alert">O Base44 ainda não está configurado neste ambiente. Use o acesso local para visualizar o painel durante o desenvolvimento.</div>
            <button type="button" onClick={loginWithGoogle} className="ritual-button ritual-button-primary mt-4 w-full">Abrir painel local</button>
          </div>
        )}
        <Link to="/" className="mt-6 block text-center text-xs text-[#958e98] transition hover:text-[#c5a059]">Voltar ao convite</Link>
      </div>
    </div>
  );
}
