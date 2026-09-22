import React from 'react';
import { ASSETS } from '../constants';
import { Sparkles, Flower2, Share2 } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  petalsEnabled: boolean;
  onTogglePetals: () => void;
  onShare: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  petalsEnabled,
  onTogglePetals,
  onShare,
}) => {
  const getTabTitle = () => {
    switch (currentTab) {
      case 'rsvp':
        return 'Confirmação RSVP';
      case 'n8n':
        return 'n8n & WhatsApp';
      default:
        return 'Convite';
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[#131315]/85 backdrop-blur-xl border-b border-[#cca830]/15">
      <div className="max-w-lg mx-auto h-16 px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#eac34a] animate-pulse" />
          <span className="font-['Syne'] font-bold text-sm sm:text-base uppercase tracking-widest text-[#e5e1e4]">
            {getTabTitle()}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            id="toggle-petals-btn"
            onClick={onTogglePetals}
            title={petalsEnabled ? 'Desativar pétalas' : 'Ativar pétalas'}
            className={`p-2 rounded-full border transition-all ${
              petalsEnabled
                ? 'bg-[#2a1b3d] border-[#eac34a]/40 text-[#eac34a]'
                : 'bg-[#201f21] border-[#4a454d]/40 text-[#958e98]'
            }`}
          >
            <Flower2 className="w-4 h-4" />
          </button>

          <button
            id="share-app-btn"
            onClick={onShare}
            title="Compartilhar Convite"
            className="p-2 rounded-full bg-[#201f21] border border-[#eac34a]/30 text-[#e5e1e4] hover:text-[#eac34a] transition-all"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <div
            className="w-9 h-9 rounded-full overflow-hidden border border-[#eac34a]/40 p-0.5 bg-gradient-to-tr from-[#cca830]/30 to-[#ac012c]/30 shadow-md flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
            title="Rosa de Ouro - Festa da Menina"
          >
            <img
              src={ASSETS.GOLD_ROSE_EMBLEM}
              alt="Rosa Dourada Emblema"
              className="w-full h-full object-cover rounded-full"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
