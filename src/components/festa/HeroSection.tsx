import { motion } from 'framer-motion';
import { ArrowDown, CalendarDays, MapPin } from 'lucide-react';
import { IMAGENS, imagemPorTipo } from '../../lib/imagens';
import type { Convite, Entidade, EventDetails } from '../../types';

interface HeroSectionProps {
  convite: Convite;
  entidade: Entidade | null;
  event: EventDetails;
}

export function HeroSection({ convite, entidade, event }: HeroSectionProps) {
  const entityImage = imagemPorTipo(entidade?.type);

  return (
    <section className="ritual-hero" style={{ backgroundImage: `url('${IMAGENS.hero}')` }}>
      <div className="ritual-hero-overlay" />
      <div className="ritual-container relative z-10 flex min-h-[88vh] flex-col items-center justify-center py-28 text-center">
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="flex flex-col items-center"
        >
          <span className="ritual-kicker">Convite exclusivo · {event.subtitle}</span>
          <h1 className="ritual-display mt-4 text-5xl sm:text-7xl">Festa da Menina</h1>
          <div className="ritual-ornament my-6" />
          <p className="ritual-script text-2xl sm:text-4xl">{convite.medium_name}, sua gira foi chamada.</p>
          <p className="ritual-muted mt-4 max-w-xl text-balance">
            A casa agradece a sua presença e a força de {convite.entidade_name} para celebrar esta noite de axé, canto e partilha.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
            <span className="ritual-pill">
              <CalendarDays className="h-3.5 w-3.5" />
              {event.dateStr} · {event.startTime}
            </span>
            <span className="ritual-pill">
              <MapPin className="h-3.5 w-3.5" />
              {event.houseName}
            </span>
          </div>
          <a href="#rsvp" className="ritual-button ritual-button-primary mt-10">
            Responder ao convite
            <ArrowDown className="h-4 w-4" />
          </a>
        </motion.div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
          <img src={entityImage} alt="" className="mx-auto mb-2 h-10 w-10 rounded-full border border-[#c5a059]/40 object-cover opacity-70" />
          <span className="ritual-caption">o espelho da sua entidade</span>
        </div>
      </div>
    </section>
  );
}
