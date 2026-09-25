import { FormEvent, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown, Heart, Phone, Sparkles, Users, Wine, X } from 'lucide-react';
import { playLaugh } from '../../lib/audioscape';
import type { Convite, GuestRole } from '../../types';
import { PetalsFall } from './PetalsFall';

interface RsvpSectionProps {
  convite: Convite;
  onConfirm: (details: Partial<Convite>) => Promise<void>;
  onDecline: () => Promise<void>;
}

const ROLES: GuestRole[] = ['Médium da Casa', 'Médium Visitante', 'Convidado / Amigo', 'Familiar'];

export function RsvpSection({ convite, onConfirm, onDecline }: RsvpSectionProps) {
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [phone, setPhone] = useState(convite.phone || '');
  const [role, setRole] = useState<GuestRole>(convite.role || 'Médium Visitante');
  const [companionsCount, setCompanionsCount] = useState(convite.companions_count || 0);
  const [companionNames, setCompanionNames] = useState(convite.companion_names || '');
  const [drinkOrOffering, setDrinkOrOffering] = useState(convite.drink_or_offering || '');
  const [notes, setNotes] = useState(convite.notes || '');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    await playLaugh();
    if (typeof navigator.vibrate === 'function') navigator.vibrate(60);
    await onConfirm({
      status: 'confirmed',
      confirmed_at: new Date().toISOString(),
      phone: phone.trim(),
      role,
      companions_count: companionsCount,
      companion_names: companionNames.trim(),
      drink_or_offering: drinkOrOffering.trim(),
      notes: notes.trim(),
    });
    setSaving(false);
  };

  const decline = async () => {
    setSaving(true);
    await onDecline();
    setSaving(false);
  };

  return (
    <section id="rsvp" className="ritual-section ritual-rsvp">
      <PetalsFall />
      <div className="ritual-container relative z-10">
        <div className="mb-9 text-center">
          <span className="ritual-kicker">o pacto de confirmação</span>
          <h2 className="ritual-display mt-3 text-4xl sm:text-5xl">Você atravessa o portal?</h2>
          <p className="ritual-muted mx-auto mt-3 max-w-lg">Sua resposta ajuda a casa a preparar a gira com carinho e respeito.</p>
        </div>

        <AnimatePresence mode="wait">
          {convite.status === 'confirmed' ? (
            <motion.div key="confirmed" initial={false} animate={{ opacity: 1, scale: 1 }} className="ritual-card status-card status-confirmed">
              <div className="status-icon"><Check className="h-6 w-6" /></div>
              <span className="ritual-kicker mt-5">presença selada</span>
              <h3 className="ritual-display mt-2 text-4xl">O pacto está selado.</h3>
              <p className="ritual-muted mt-3 max-w-md">A casa recebeu a sua confirmação. Até a noite, leve o seu melhor axé.</p>
            </motion.div>
          ) : convite.status === 'declined' ? (
            <motion.div key="declined" initial={false} animate={{ opacity: 1, scale: 1 }} className="ritual-card status-card">
              <div className="status-icon status-icon-muted"><X className="h-6 w-6" /></div>
              <span className="ritual-kicker mt-5">caminho guardado</span>
              <h3 className="ritual-display mt-2 text-4xl">Que o seu caminho seja guardado.</h3>
              <p className="ritual-muted mt-3 max-w-md">Se mudar de ideia, fale com a pessoa que lhe enviou o convite.</p>
            </motion.div>
          ) : showForm ? (
            <motion.form key="form" onSubmit={submit} initial={false} animate={{ opacity: 1, y: 0 }} className="ritual-card rsvp-form">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <span className="ritual-kicker">sele seu axé</span>
                  <h3 className="ritual-title mt-2 text-2xl">Confirmar presença</h3>
                </div>
                <button type="button" className="ritual-icon-button" onClick={() => setShowForm(false)} aria-label="Fechar formulário"><X className="h-4 w-4" /></button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="ritual-field">
                  <span><Phone className="mr-1.5 inline h-3.5 w-3.5" />WhatsApp</span>
                  <input required value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="(11) 99999-9999" />
                </label>
                <label className="ritual-field">
                  <span><Users className="mr-1.5 inline h-3.5 w-3.5" />Como você chega?</span>
                  <span className="relative block">
                    <select value={role} onChange={(event) => setRole(event.target.value as GuestRole)} className="appearance-none pr-9">
                      {ROLES.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#958e98]" />
                  </span>
                </label>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="ritual-field">
                  <span>Acompanhantes</span>
                  <select value={companionsCount} onChange={(event) => setCompanionsCount(Number(event.target.value))}>
                    {[0, 1, 2, 3, 4].map((value) => <option key={value} value={value}>{value === 0 ? 'Apenas eu' : `+ ${value}`}</option>)}
                  </select>
                </label>
                <label className="ritual-field">
                  <span><Wine className="mr-1.5 inline h-3.5 w-3.5" />Bebida ou oferenda</span>
                  <input value={drinkOrOffering} onChange={(event) => setDrinkOrOffering(event.target.value)} placeholder="Ex.: champanhe e rosas" />
                </label>
              </div>
              {companionsCount > 0 ? (
                <label className="ritual-field mt-4">
                  <span>Nome dos acompanhantes</span>
                  <input value={companionNames} onChange={(event) => setCompanionNames(event.target.value)} placeholder="Ex.: Aline e Pedro" />
                </label>
              ) : null}
              <label className="ritual-field mt-4">
                <span>Recado para a organização</span>
                <textarea rows={3} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Alguma restrição ou palavra para a gira?" />
              </label>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button type="button" className="ritual-button ritual-button-ghost flex-1" onClick={() => setShowForm(false)}>Agora não</button>
                <button type="submit" disabled={saving} className="ritual-button ritual-button-primary flex-1 disabled:cursor-wait disabled:opacity-60">
                  <Heart className="h-4 w-4" />
                  {saving ? 'Selando...' : 'Selar minha presença'}
                </button>
              </div>
            </motion.form>
          ) : (
            <motion.div key="choice" initial={false} animate={{ opacity: 1, y: 0 }} className="ritual-card status-card">
              <div className="status-icon"><Sparkles className="h-6 w-6" /></div>
              <p className="ritual-muted mt-5 max-w-md">Confirme para a casa reserve o seu lugar e registre a presença da sua entidade.</p>
              <div className="mt-7 flex w-full max-w-md flex-col gap-3 sm:flex-row">
                <button type="button" disabled={saving} onClick={() => setShowForm(true)} className="ritual-button ritual-button-primary flex-1"><Check className="h-4 w-4" /> Confirmar presença</button>
                <button type="button" disabled={saving} onClick={decline} className="ritual-button ritual-button-ghost flex-1">Não poderei comparecer</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
