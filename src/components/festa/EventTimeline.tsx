import { motion } from 'framer-motion';
import { Moon, Sparkles, Sun } from 'lucide-react';
import type { EventDetails } from '../../types';

const RITMOS = [
  { icon: Moon, title: 'A Descida', time: '19h00', text: 'O primeiro chamado. As portas da gira se abrem e a casa acende suas velas.' },
  { icon: Sparkles, title: 'A Vigília', time: '21h00', text: 'O momento de firmar o pacto entre o médium, a entidade e o axé que chega.' },
  { icon: Sun, title: 'O Banquete', time: '00h00', text: 'A mesa está posta. A festa se completa em canto, troca e fartura.' },
];

export function EventTimeline({ event }: { event: EventDetails }) {
  return (
    <section className="ritual-section ritual-section-tight">
      <div className="ritual-container">
        <div className="mb-10 text-center">
          <span className="ritual-kicker">os ritmos da noite</span>
          <h2 className="ritual-title mt-3 text-3xl sm:text-4xl">A noite tem um ritmo</h2>
          <p className="ritual-muted mx-auto mt-3 max-w-lg">Venha com o coração aberto. A casa conduz cada etapa da celebração.</p>
        </div>
        <div className="ritual-timeline">
          {RITMOS.map((ritmo, index) => {
            const Icon = ritmo.icon;
            return (
              <motion.div
                key={ritmo.title}
                initial={false}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ delay: index * 0.12, duration: 0.6 }}
                className="ritual-timeline-item"
              >
                <div className="ritual-timeline-icon"><Icon className="h-5 w-5" /></div>
                <div className="ritual-timeline-line" />
                <div className="flex-1 pb-8 sm:pb-0">
                  <span className="ritual-caption">{ritmo.time} · {event.startTime === '19h00' ? 'entrada' : 'continuidade'}</span>
                  <h3 className="ritual-title mt-2 text-2xl">{ritmo.title}</h3>
                  <p className="ritual-muted mt-2 text-sm">{ritmo.text}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
