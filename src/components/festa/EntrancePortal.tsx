import { motion } from 'framer-motion';
import { IMAGENS } from '../../lib/imagens';
import { LockKeyhole, Sparkles } from 'lucide-react';

export function EntrancePortal({ onEnter }: { onEnter: () => void }) {
  return (
    <motion.div
      className="portal-overlay"
      initial={false}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="portal-card">
        <div className="portal-rose-wrap">
          <img src={IMAGENS.emblem} alt="Rosa dourada" className="portal-rose" />
        </div>
        <div className="portal-kicker">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Convite ritualístico</span>
          <Sparkles className="h-3.5 w-3.5" />
        </div>
        <h1 className="ritual-display text-4xl sm:text-5xl">Festa da Menina</h1>
        <p className="ritual-muted max-w-sm text-center">
          O portal se abre para quem foi chamado. Entre para ouvir a gira e receber a benção da casa.
        </p>
        <button type="button" className="ritual-button ritual-button-primary w-full max-w-xs" onClick={onEnter}>
          <LockKeyhole className="h-4 w-4" />
          Entrar na gira
        </button>
        <span className="ritual-caption">o som é parte da cerimônia</span>
      </div>
    </motion.div>
  );
}
