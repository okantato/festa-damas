import React from 'react';
import { ASSETS } from '../../constants';
import { EventDetails } from '../../types';
import { CountdownTimer } from '../CountdownTimer';
import {
  Sparkles,
  Calendar,
  Clock,
  Sun,
  Flame,
  Gem,
  Shirt,
  Wine,
  Car,
  MapPin,
  CheckCircle2,
  Download,
  Share2,
  ExternalLink,
} from 'lucide-react';

interface InviteTabProps {
  event: EventDetails;
  onGoToRsvp: () => void;
  onOpenDownloadModal: () => void;
  onShareWhatsApp: () => void;
}

export const InviteTab: React.FC<InviteTabProps> = ({
  event,
  onGoToRsvp,
  onOpenDownloadModal,
  onShareWhatsApp,
}) => {
  const openLocationOnMap = () => {
    const query = encodeURIComponent(`${event.houseName}, São Paulo - SP`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-lg mx-auto pb-8 pt-2">
      {/* Hero / Golden Rose Emblem Section */}
      <div className="flex flex-col items-center text-center gap-4 pt-1">
        <div className="relative p-1.5 rounded-full bg-gradient-to-tr from-[#eac34a]/40 via-[#ffb3b4]/30 to-[#ac012c]/40 shadow-[0_0_35px_rgba(234,195,74,0.25)]">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-[#353437] border-2 border-[#eac34a]/40 flex items-center justify-center p-1.5 shadow-inner">
            <img
              src={ASSETS.GOLD_ROSE_EMBLEM}
              alt="Rosa de Ouro - Festa da Menina"
              className="w-full h-full object-cover rounded-full animate-[pulse-glow_4s_ease-in-out_infinite]"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5 px-2">
          <div className="flex items-center justify-center gap-2 text-[#eac34a]">
            <Sparkles className="w-4 h-4" />
            <span className="font-['Syne'] text-xs uppercase tracking-[0.25em] font-bold text-[#eac34a]">
              {event.title}
            </span>
            <Sparkles className="w-4 h-4" />
          </div>

          <h1 className="font-['Syne'] text-3xl sm:text-4xl font-extrabold text-[#e5e1e4] tracking-tight">
            {event.subtitle}
          </h1>

          <p className="text-sm sm:text-base text-[#ccc4ce] max-w-sm mx-auto italic leading-relaxed pt-1">
            "Com muita alegria e respeito, convidamos você e sua entidade para celebrar conosco mais uma noite de festa, força e axé."
          </p>
        </div>
      </div>

      {/* Countdown Timer Card */}
      <CountdownTimer targetDate={event.targetDateTime} />

      {/* Cronograma & Data */}
      <div className="bg-[#2a1b3d]/50 backdrop-blur-md p-4 sm:p-5 rounded-2xl shadow-lg border border-[#d3beea]/20 flex flex-col gap-3">
        <div className="flex items-center gap-2 text-[#d3beea]">
          <Calendar className="w-5 h-5 text-[#eac34a]" />
          <h3 className="font-['Syne'] font-bold text-base sm:text-lg text-[#e5e1e4]">
            Cronograma & Data
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-2 text-sm text-[#ccc4ce]">
          <div className="flex justify-between items-center py-1.5 border-b border-[#4a454d]/30">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#eac34a]" /> Data
            </span>
            <strong className="text-[#e5e1e4] font-semibold">{event.dateStr}</strong>
          </div>

          <div className="flex justify-between items-center py-1.5 border-b border-[#4a454d]/30">
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#eac34a]" /> Início
            </span>
            <strong className="text-[#e5e1e4] font-semibold">{event.startTime}</strong>
          </div>

          <div className="flex justify-between items-center py-1.5 border-b border-[#4a454d]/30">
            <span className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-[#eac34a]" /> Encerramento
            </span>
            <strong className="text-[#e5e1e4] font-semibold">{event.endTime}</strong>
          </div>

          <div className="flex justify-between items-center py-1.5">
            <span className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#ffb3b4]" /> Churrasco
            </span>
            <strong className="text-[#e5e1e4] font-semibold">{event.bbqTime}</strong>
          </div>
        </div>
      </div>

      {/* Diretrizes da Casa */}
      <div className="bg-[#201f21]/85 backdrop-blur-md p-4 sm:p-5 rounded-2xl shadow-lg border border-[#4a454d]/30 flex flex-col gap-4">
        <div className="flex items-center gap-2 text-[#ffb3b4]">
          <Gem className="w-5 h-5 text-[#ffb3b4]" />
          <h3 className="font-['Syne'] font-bold text-base sm:text-lg text-[#e5e1e4]">
            Diretrizes da Casa
          </h3>
        </div>

        <div className="flex flex-col gap-3.5 text-sm text-[#ccc4ce]">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#ac012c]/20 border border-[#ffb3b4]/20 text-[#ffb3b4] mt-0.5">
              <Shirt className="w-4 h-4" />
            </div>
            <div>
              <strong className="text-[#e5e1e4] block font-semibold text-sm">
                {event.dressCodeTitle}
              </strong>
              <span className="text-xs text-[#ccc4ce]/90 leading-relaxed">
                {event.dressCodeDesc}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#ac012c]/20 border border-[#ffb3b4]/20 text-[#ffb3b4] mt-0.5">
              <Wine className="w-4 h-4" />
            </div>
            <div>
              <strong className="text-[#e5e1e4] block font-semibold text-sm">
                {event.drinkRuleTitle}
              </strong>
              <span className="text-xs text-[#ccc4ce]/90 leading-relaxed">
                {event.drinkRuleDesc}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#cca830]/20 border border-[#eac34a]/20 text-[#eac34a] mt-0.5">
              <Car className="w-4 h-4" />
            </div>
            <div>
              <strong className="text-[#e5e1e4] block font-semibold text-sm">
                {event.safetyRuleTitle}
              </strong>
              <span className="text-xs text-[#ccc4ce]/90 leading-relaxed">
                {event.safetyRuleDesc}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Localização */}
      <div className="bg-[#201f21]/85 backdrop-blur-md p-4 sm:p-5 rounded-2xl shadow-lg border border-[#4a454d]/30 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#eac34a]">
            <MapPin className="w-5 h-5 text-[#eac34a]" />
            <h3 className="font-['Syne'] font-bold text-base sm:text-lg text-[#e5e1e4]">
              Localização
            </h3>
          </div>
          <button
            onClick={openLocationOnMap}
            className="text-xs text-[#eac34a] hover:underline flex items-center gap-1 font-medium"
          >
            Abrir no Maps <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        <div>
          <strong className="text-[#e5e1e4] block font-semibold text-sm">
            {event.houseName}
          </strong>
          <span className="text-xs text-[#ccc4ce]">
            {event.address} ({event.locationDetails})
          </span>
        </div>

        {/* Map Preview Image */}
        <div
          onClick={openLocationOnMap}
          className="group relative w-full h-36 bg-cover bg-center rounded-xl overflow-hidden border border-[#4a454d]/40 shadow-inner cursor-pointer"
          style={{ backgroundImage: `url('${ASSETS.MAP_IMAGE}')` }}
        >
          <div className="absolute inset-0 bg-[#131315]/20 group-hover:bg-[#131315]/10 transition-colors flex items-center justify-center">
            <span className="px-3 py-1.5 rounded-full bg-[#131315]/80 backdrop-blur-md border border-[#eac34a]/40 text-xs font-semibold text-[#eac34a] flex items-center gap-1.5 shadow-lg group-hover:scale-105 transition-transform">
              <MapPin className="w-3.5 h-3.5 text-[#ffb3b4]" /> Ver Trajeto no GPS
            </span>
          </div>
        </div>
      </div>

      {/* Closing Note */}
      <div className="text-center px-4 py-2">
        <p className="text-sm sm:text-base text-[#eac34a] italic leading-relaxed font-serif font-light">
          {event.invitationNote}
        </p>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex flex-col gap-3 pt-1">
        <button
          id="btn-confirmar-presenca"
          onClick={onGoToRsvp}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#eac34a] via-[#cca830] to-[#eac34a] text-[#3c2f00] font-['Syne'] font-bold text-base flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(234,195,74,0.3)] hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer"
        >
          <CheckCircle2 className="w-5 h-5 text-[#3c2f00]" />
          Confirmar Presença (RSVP)
        </button>

        <button
          id="btn-baixar-convite"
          onClick={onOpenDownloadModal}
          className="w-full py-3.5 px-6 rounded-xl bg-[#353437] text-[#e5e1e4] font-['Syne'] font-semibold text-base flex items-center justify-center gap-2 border border-[#eac34a]/30 hover:bg-[#39393b] active:scale-[0.99] transition-all cursor-pointer shadow-md"
        >
          <Download className="w-5 h-5 text-[#eac34a]" />
          Baixar Convite em Imagem
        </button>

        <button
          id="btn-compartilhar-whatsapp"
          onClick={onShareWhatsApp}
          className="w-full py-2.5 px-4 rounded-xl bg-[#201f21] text-[#ccc4ce] hover:text-[#e5e1e4] text-xs font-medium flex items-center justify-center gap-1.5 border border-[#4a454d]/40 transition-colors"
        >
          <Share2 className="w-3.5 h-3.5 text-[#ffb3b4]" />
          Compartilhar Convite no WhatsApp
        </button>
      </div>
    </div>
  );
};
