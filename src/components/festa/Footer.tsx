import { Heart, Sparkles } from 'lucide-react';
import { IMAGENS } from '../../lib/imagens';
import type { EventDetails } from '../../types';

export function Footer({ event }: { event: EventDetails }) {
  return (
    <footer className="ritual-footer">
      <div className="ritual-container flex flex-col items-center gap-4 text-center">
        <img src={IMAGENS.emblem} alt="" className="h-10 w-10 rounded-full border border-[#c5a059]/50 object-cover opacity-80" />
        <div className="ritual-kicker">Laroyê Menina · Axé para todos nós</div>
        <p className="ritual-muted max-w-md text-sm">Com carinho, {event.houseName} · {event.dateStr} · {event.startTime}</p>
        <div className="flex items-center gap-1.5 text-xs text-[#958e98]"><Heart className="h-3.5 w-3.5 text-[#a1121f]" /> feito para uma noite de memória</div>
        <Sparkles className="h-4 w-4 text-[#c5a059]/60" />
      </div>
    </footer>
  );
}
