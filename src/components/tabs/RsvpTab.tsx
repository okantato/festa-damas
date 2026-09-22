import React, { useState } from 'react';
import { RsvpGuest, GuestRole } from '../../types';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  UserPlus,
  Users,
  Search,
  MessageSquare,
  Sparkles,
  Trash2,
  Check,
  Copy,
  Download,
  Wine,
  Phone,
  UserCheck,
} from 'lucide-react';

interface RsvpTabProps {
  guests: RsvpGuest[];
  onAddGuest: (guest: Omit<RsvpGuest, 'id' | 'createdAt'>) => void;
  onToggleCheckIn: (id: string) => void;
  onDeleteGuest: (id: string) => void;
}

export const RsvpTab: React.FC<RsvpTabProps> = ({
  guests,
  onAddGuest,
  onToggleCheckIn,
  onDeleteGuest,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<GuestRole>('Médium Visitante');
  const [entityName, setEntityName] = useState('');
  const [companionsCount, setCompanionsCount] = useState(0);
  const [companionNames, setCompanionNames] = useState('');
  const [drinkOrOffering, setDrinkOrOffering] = useState('');
  const [notes, setNotes] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddGuest({
      name: name.trim(),
      phone: phone.trim() || 'Não informado',
      role,
      entityName: entityName.trim() || undefined,
      companionsCount: Number(companionsCount),
      companionNames: companionNames.trim() || undefined,
      drinkOrOffering: drinkOrOffering.trim() || undefined,
      status: 'confirmado',
      checkedIn: false,
      notes: notes.trim() || undefined,
    });

    // Fire golden & crimson confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#eac34a', '#ac012c', '#eedcff', '#ffe088'],
      });
    } catch {
      // ignore
    }

    setFormSubmitted(true);
    setName('');
    setPhone('');
    setEntityName('');
    setCompanionsCount(0);
    setCompanionNames('');
    setDrinkOrOffering('');
    setNotes('');

    setTimeout(() => {
      setFormSubmitted(false);
      setShowForm(false);
    }, 1800);
  };

  // Stats
  const totalGuests = guests.reduce((acc, g) => acc + 1 + (g.companionsCount || 0), 0);
  const confirmedCount = guests.filter((g) => g.status === 'confirmado').length;
  const houseMediums = guests.filter((g) => g.role === 'Médium da Casa').length;
  const visitingMediums = guests.filter((g) => g.role === 'Médium Visitante').length;
  const checkedInCount = guests.filter((g) => g.checkedIn).length;

  const filteredGuests = guests.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (g.entityName && g.entityName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      g.phone.includes(searchTerm);
    const matchesRole = selectedRoleFilter === 'all' || g.role === selectedRoleFilter;
    return matchesSearch && matchesRole;
  });

  const copyGuestListToWhatsApp = () => {
    const listText = [
      `🌹 *LISTA DE PRESENÇA - FESTA DA MENINA* 🌹`,
      `📅 15 de Outubro | Ilé Axé Omo Nanã`,
      `Total confirmado: ${totalGuests} pessoas (${guests.length} titulares)`,
      `Check-ins realizados: ${checkedInCount}`,
      `----------------------------------------`,
      ...guests.map(
        (g, i) =>
          `${i + 1}. *${g.name}* (${g.role})${
            g.entityName ? `\n   Entidade: ${g.entityName}` : ''
          }${g.companionsCount > 0 ? `\n   +${g.companionsCount} acomp.` : ''}${
            g.drinkOrOffering ? `\n   Oferenda: ${g.drinkOrOffering}` : ''
          }${g.checkedIn ? ' ✅ Presente' : ''}`
      ),
      `----------------------------------------`,
      `Laroyê Pomba Gira Menina! 💃✨`,
    ].join('\n');

    navigator.clipboard.writeText(listText);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2500);
  };

  const exportToCSV = () => {
    const headers = ['Nome', 'Telefone', 'Categoria', 'Entidade', 'Acompanhantes', 'Oferenda/Bebida', 'Check-in', 'Notas'];
    const rows = guests.map((g) => [
      `"${g.name}"`,
      `"${g.phone}"`,
      `"${g.role}"`,
      `"${g.entityName || ''}"`,
      g.companionsCount,
      `"${g.drinkOrOffering || ''}"`,
      g.checkedIn ? 'Sim' : 'Não',
      `"${g.notes || ''}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `lista_festa_da_menina_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-5 w-full max-w-lg mx-auto pb-12 pt-2">
      {/* Title & Stats */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-['Syne'] text-2xl font-bold text-[#e5e1e4] flex items-center gap-2">
              <Users className="w-6 h-6 text-[#eac34a]" /> Lista de RSVP
            </h2>
            <p className="text-xs text-[#ccc4ce]">
              Confirmações de presença para a Festa da Menina
            </p>
          </div>

          <button
            id="btn-toggle-rsvp-form"
            onClick={() => setShowForm(!showForm)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#eac34a] to-[#cca830] text-[#3c2f00] font-semibold text-xs flex items-center gap-1.5 shadow-md hover:brightness-105 active:scale-95 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            {showForm ? 'Fechar' : 'Confirmar'}
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-[#201f21] p-2.5 rounded-xl border border-[#eac34a]/20 text-center">
            <span className="block font-['Syne'] font-bold text-xl text-[#eac34a]">
              {totalGuests}
            </span>
            <span className="block text-[10px] text-[#ccc4ce] uppercase tracking-wider">
              Total Pessoas
            </span>
          </div>

          <div className="bg-[#201f21] p-2.5 rounded-xl border border-[#d3beea]/20 text-center">
            <span className="block font-['Syne'] font-bold text-xl text-[#d3beea]">
              {houseMediums}
            </span>
            <span className="block text-[10px] text-[#ccc4ce] uppercase tracking-wider">
              Da Casa
            </span>
          </div>

          <div className="bg-[#201f21] p-2.5 rounded-xl border border-[#ffb3b4]/20 text-center">
            <span className="block font-['Syne'] font-bold text-xl text-[#ffb3b4]">
              {visitingMediums}
            </span>
            <span className="block text-[10px] text-[#ccc4ce] uppercase tracking-wider">
              Visitantes
            </span>
          </div>

          <div className="bg-[#201f21] p-2.5 rounded-xl border border-[#4a454d]/30 text-center">
            <span className="block font-['Syne'] font-bold text-xl text-[#e5e1e4]">
              {checkedInCount}
            </span>
            <span className="block text-[10px] text-[#ccc4ce] uppercase tracking-wider">
              Portaria
            </span>
          </div>
        </div>
      </div>

      {/* Confirmation Form (Animated / Collapsible) */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-[#201f21]/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-[#eac34a]/40 shadow-2xl flex flex-col gap-3.5"
        >
          <div className="flex items-center gap-2 border-b border-[#4a454d]/30 pb-2">
            <Sparkles className="w-4 h-4 text-[#eac34a]" />
            <h3 className="font-['Syne'] font-bold text-base text-[#e5e1e4]">
              Confirmar Minha Presença
            </h3>
          </div>

          {formSubmitted ? (
            <div className="p-6 rounded-xl bg-[#2a1b3d] border border-[#d3beea]/30 text-center flex flex-col items-center gap-2">
              <CheckCircle2 className="w-10 h-10 text-[#eac34a] animate-bounce" />
              <h4 className="font-['Syne'] font-bold text-lg text-[#e5e1e4]">
                Presença Confirmada com Axé!
              </h4>
              <p className="text-xs text-[#ccc4ce]">
                Aguardamos você e sua entidade para essa linda celebração.
              </p>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs font-medium text-[#ccc4ce] mb-1">
                  Seu Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Mariana Silveira"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#131315] border border-[#4a454d] text-sm text-[#e5e1e4] focus:outline-none focus:border-[#eac34a] transition-colors placeholder:text-[#958e98]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#ccc4ce] mb-1">
                    WhatsApp / Telefone *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="(11) 99999-9999"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#131315] border border-[#4a454d] text-sm text-[#e5e1e4] focus:outline-none focus:border-[#eac34a] transition-colors placeholder:text-[#958e98]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#ccc4ce] mb-1">
                    Categoria *
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as GuestRole)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#131315] border border-[#4a454d] text-sm text-[#e5e1e4] focus:outline-none focus:border-[#eac34a] transition-colors"
                  >
                    <option value="Médium da Casa">Médium da Casa</option>
                    <option value="Médium Visitante">Médium Visitante</option>
                    <option value="Convidado / Amigo">Convidado / Amigo</option>
                    <option value="Familiar">Familiar</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#ccc4ce] mb-1">
                  Nome da Entidade que Trabalhará / Saudará (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Menina da Praia, Rosa Vermelha..."
                  value={entityName}
                  onChange={(e) => setEntityName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#131315] border border-[#4a454d] text-sm text-[#e5e1e4] focus:outline-none focus:border-[#eac34a] transition-colors placeholder:text-[#958e98]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#ccc4ce] mb-1">
                    Acompanhantes (+ quantos?)
                  </label>
                  <select
                    value={companionsCount}
                    onChange={(e) => setCompanionsCount(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#131315] border border-[#4a454d] text-sm text-[#e5e1e4] focus:outline-none focus:border-[#eac34a] transition-colors"
                  >
                    <option value={0}>Apenas eu</option>
                    <option value={1}>+ 1 acompanhante</option>
                    <option value={2}>+ 2 acompanhantes</option>
                    <option value={3}>+ 3 acompanhantes</option>
                    <option value={4}>+ 4 acompanhantes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#ccc4ce] mb-1">
                    Bebida / Oferenda que Trará
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Licor, Champanhe, Cigarros..."
                    value={drinkOrOffering}
                    onChange={(e) => setDrinkOrOffering(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#131315] border border-[#4a454d] text-sm text-[#e5e1e4] focus:outline-none focus:border-[#eac34a] transition-colors placeholder:text-[#958e98]"
                  />
                </div>
              </div>

              {companionsCount > 0 && (
                <div>
                  <label className="block text-xs font-medium text-[#ccc4ce] mb-1">
                    Nome(s) do(s) Acompanhante(s)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Carlos e Beatriz"
                    value={companionNames}
                    onChange={(e) => setCompanionNames(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#131315] border border-[#4a454d] text-sm text-[#e5e1e4] focus:outline-none focus:border-[#eac34a] transition-colors placeholder:text-[#958e98]"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-[#ccc4ce] mb-1">
                  Mensagem ou Observação
                </label>
                <textarea
                  rows={2}
                  placeholder="Alguma restrição ou recado para a organização?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#131315] border border-[#4a454d] text-sm text-[#e5e1e4] focus:outline-none focus:border-[#eac34a] transition-colors placeholder:text-[#958e98] resize-none"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="w-1/3 py-2.5 rounded-xl bg-[#353437] text-[#e5e1e4] text-xs font-semibold hover:bg-[#39393b] transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 rounded-xl bg-gradient-to-r from-[#eac34a] to-[#cca830] text-[#3c2f00] font-['Syne'] font-bold text-sm shadow-md hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" /> Confirmar Agora
                </button>
              </div>
            </>
          )}
        </form>
      )}

      {/* Filters and Search */}
      <div className="flex flex-col gap-2">
        <div className="relative">
          <Search className="w-4 h-4 text-[#958e98] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nome, telefone ou entidade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#201f21] border border-[#4a454d]/40 text-xs sm:text-sm text-[#e5e1e4] focus:outline-none focus:border-[#eac34a] transition-colors placeholder:text-[#958e98]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'Médium da Casa', label: 'Da Casa' },
            { id: 'Médium Visitante', label: 'Visitantes' },
            { id: 'Convidado / Amigo', label: 'Convidados' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedRoleFilter(f.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedRoleFilter === f.id
                  ? 'bg-[#eac34a] text-[#3c2f00] font-bold shadow-sm'
                  : 'bg-[#201f21] text-[#ccc4ce] hover:bg-[#353437]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Guests List */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between text-xs text-[#ccc4ce] px-1">
          <span>{filteredGuests.length} confirmações encontradas</span>
          <div className="flex gap-2">
            <button
              onClick={copyGuestListToWhatsApp}
              className="text-[#eac34a] hover:underline flex items-center gap-1 font-medium"
            >
              {copiedSuccess ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedSuccess ? 'Copiado!' : 'Copiar p/ Zap'}
            </button>
            <span className="text-[#4a454d]">|</span>
            <button
              onClick={exportToCSV}
              className="text-[#d3beea] hover:underline flex items-center gap-1 font-medium"
            >
              <Download className="w-3.5 h-3.5" /> Exportar CSV
            </button>
          </div>
        </div>

        {filteredGuests.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#201f21]/60 border border-[#4a454d]/30 text-center flex flex-col items-center gap-2 text-[#ccc4ce]">
            <Users className="w-8 h-8 text-[#958e98]" />
            <p className="text-sm">Nenhum convidado encontrado com esses filtros.</p>
          </div>
        ) : (
          filteredGuests.map((guest) => {
            const roleBadgeClass =
              guest.role === 'Médium da Casa'
                ? 'bg-[#2a1b3d] text-[#d3beea] border-[#d3beea]/30'
                : guest.role === 'Médium Visitante'
                ? 'bg-[#ac012c]/20 text-[#ffb3b4] border-[#ffb3b4]/30'
                : 'bg-[#353437] text-[#e5e1e4] border-[#4a454d]';

            return (
              <div
                key={guest.id}
                className={`p-3.5 sm:p-4 rounded-xl border transition-all ${
                  guest.checkedIn
                    ? 'bg-[#201f21]/90 border-green-500/40 shadow-sm'
                    : 'bg-[#201f21]/80 border-[#4a454d]/30 hover:border-[#eac34a]/30'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <strong className="text-sm font-semibold text-[#e5e1e4]">
                        {guest.name}
                      </strong>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${roleBadgeClass}`}>
                        {guest.role}
                      </span>
                      {guest.checkedIn && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-950/60 text-green-300 border border-green-500/40 font-medium flex items-center gap-1">
                          <Check className="w-2.5 h-2.5" /> Presente
                        </span>
                      )}
                    </div>

                    {guest.entityName && (
                      <div className="text-xs text-[#eac34a] flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#eac34a]" /> Entidade:{' '}
                        <span className="font-medium text-[#ffe088]">{guest.entityName}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-3 text-xs text-[#ccc4ce] flex-wrap mt-0.5">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-[#958e98]" /> {guest.phone}
                      </span>
                      {guest.companionsCount > 0 && (
                        <span className="flex items-center gap-1 text-[#ffb3b4]">
                          <Users className="w-3 h-3" /> +{guest.companionsCount} acomp.
                          {guest.companionNames ? ` (${guest.companionNames})` : ''}
                        </span>
                      )}
                      {guest.drinkOrOffering && (
                        <span className="flex items-center gap-1 text-[#d3beea]">
                          <Wine className="w-3 h-3" /> {guest.drinkOrOffering}
                        </span>
                      )}
                    </div>

                    {guest.notes && (
                      <p className="text-[11px] text-[#958e98] italic mt-1 bg-[#131315]/50 px-2 py-1 rounded">
                        "{guest.notes}"
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => onToggleCheckIn(guest.id)}
                      title={guest.checkedIn ? 'Remover check-in' : 'Fazer check-in na portaria'}
                      className={`p-2 rounded-lg border transition-all ${
                        guest.checkedIn
                          ? 'bg-green-900/40 border-green-500/50 text-green-300'
                          : 'bg-[#1c1b1d] border-[#4a454d]/40 text-[#ccc4ce] hover:text-[#eac34a]'
                      }`}
                    >
                      <UserCheck className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        const cleanPhone = guest.phone.replace(/\D/g, '');
                        if (cleanPhone) {
                          window.open(
                            `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(
                              `Olá, ${guest.name}! Confirmamos sua presença na Festa da Menina. Nos vemos no dia 15 de Outubro! 🌹 Axé!`
                            )}`,
                            '_blank'
                          );
                        }
                      }}
                      title="Conversar no WhatsApp"
                      className="p-2 rounded-lg bg-[#1c1b1d] border border-[#4a454d]/40 text-[#ccc4ce] hover:text-green-400 transition-all"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onDeleteGuest(guest.id)}
                      title="Excluir da lista"
                      className="p-2 rounded-lg bg-[#1c1b1d] border border-[#4a454d]/40 text-[#ccc4ce] hover:text-red-400 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
