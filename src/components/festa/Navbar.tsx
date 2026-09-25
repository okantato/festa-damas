import { Link } from 'react-router-dom';
import { Flower2, LogIn, Volume2, VolumeX } from 'lucide-react';
import { IMAGENS } from '../../lib/imagens';
import { isMuted, setMuted } from '../../lib/audioscape';
import { useState } from 'react';

export function Navbar() {
  const [muted, setMutedState] = useState(isMuted());

  const toggleSound = async () => {
    const next = !muted;
    await setMuted(next);
    setMutedState(next);
  };

  return (
    <header className="ritual-nav">
      <div className="ritual-container flex h-full items-center justify-between gap-4">
        <Link to="/" className="flex min-w-0 items-center gap-2.5" aria-label="Festa da Menina">
          <img src={IMAGENS.emblem} alt="" className="h-8 w-8 rounded-full border border-[#c5a059]/60 object-cover" />
          <span className="ritual-kicker truncate">Festa da Menina</span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="ritual-icon-button"
            onClick={toggleSound}
            aria-label={muted ? 'Ativar som' : 'Silenciar som'}
            title={muted ? 'Ativar som' : 'Silenciar som'}
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          <Link to="/admin" className="ritual-icon-button" title="Administração">
            <LogIn className="h-4 w-4" />
          </Link>
          <Flower2 className="hidden h-4 w-4 text-[#c5a059] sm:block" aria-hidden="true" />
        </div>
      </div>
    </header>
  );
}
