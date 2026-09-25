import { motion } from 'framer-motion';
import { Eye, Flame, Sparkles } from 'lucide-react';
import { imagemPorTipo } from '../../lib/imagens';
import type { Entidade } from '../../types';

export function EntityReflection({ entidade, mediumName }: { entidade: Entidade | null; mediumName: string }) {
  if (!entidade) {
    return (
      <section className="ritual-section">
        <div className="ritual-container">
          <div className="ritual-card p-8 text-center">
            <Sparkles className="mx-auto h-8 w-8 text-[#c5a059]" />
            <h2 className="ritual-title mt-4 text-3xl">O espelho está em silêncio</h2>
            <p className="ritual-muted mt-3">A entidade desta gira será revelada pelo astral da casa.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="ritual-section">
      <div className="ritual-container">
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="entity-reflection"
        >
          <div className="entity-portrait-wrap">
            <img src={imagemPorTipo(entidade.type)} alt={`Retrato de ${entidade.name}`} className="entity-portrait" />
            <div className="entity-portrait-frame" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <span className="ritual-kicker">espelho da entidade</span>
            <h2 className="ritual-display mt-3 text-4xl sm:text-5xl">{entidade.name}</h2>
            <p className="ritual-script mt-4 text-xl text-[#d6b56b]">{entidade.greeting || 'Que a sua presença seja guardada por axé.'}</p>
            <p className="ritual-muted mt-4 max-w-xl">{entidade.description}</p>
            <div className="mt-6 flex flex-wrap gap-2 sm:justify-start">
              <span className="ritual-pill">
                <Eye className="h-3.5 w-3.5" />
                {entidade.type === 'exu' ? 'Exu · O caminho' : 'Pombogira · A gira'}
              </span>
              <span className="ritual-pill">
                <Flame className="h-3.5 w-3.5" />
                carregada por {mediumName.split(' ')[0]}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
