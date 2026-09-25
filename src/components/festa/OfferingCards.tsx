import { motion } from 'framer-motion';
import { GlassWater, Shirt, Sparkles } from 'lucide-react';
import type { EventDetails } from '../../types';

export function OfferingCards({ event }: { event: EventDetails }) {
  return (
    <section className="ritual-section ritual-section-tight">
      <div className="ritual-container">
        <div className="mb-10 text-center">
          <span className="ritual-kicker">o que a casa pede</span>
          <h2 className="ritual-title mt-3 text-3xl sm:text-4xl">Traje & oferenda</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <motion.article initial={false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="ritual-card offering-card">
            <div className="offering-icon"><Shirt className="h-5 w-5" /></div>
            <span className="ritual-kicker mt-5">{event.dressCodeTitle}</span>
            <h3 className="ritual-title mt-2 text-2xl">Presença vestida de axé</h3>
            <p className="ritual-muted mt-3 text-sm">{event.dressCodeDesc}</p>
          </motion.article>
          <motion.article initial={false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.12 }} className="ritual-card offering-card">
            <div className="offering-icon offering-icon-crimson"><GlassWater className="h-5 w-5" /></div>
            <span className="ritual-kicker mt-5">{event.drinkRuleTitle}</span>
            <h3 className="ritual-title mt-2 text-2xl">A oferta da sua entidade</h3>
            <p className="ritual-muted mt-3 text-sm">{event.drinkRuleDesc}</p>
            <div className="mt-5 flex items-center gap-2 text-xs text-[#c5a059]"><Sparkles className="h-3.5 w-3.5" /> traga o que sua entidade pede</div>
          </motion.article>
        </div>
        <div className="ritual-note mt-4">
          <span className="ritual-kicker">segurança da casa</span>
          <p className="ritual-muted mt-2 text-sm">{event.safetyRuleDesc}</p>
        </div>
      </div>
    </section>
  );
}
