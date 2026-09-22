import React from 'react';
import { TabType } from '../types';
import { Gift, Users, Cpu } from 'lucide-react';

interface BottomNavProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  confirmedCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
  confirmedCount,
}) => {
  const tabs: { id: TabType; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'convite',
      label: 'Convite',
      icon: <Gift className="w-5 h-5" />,
    },
    {
      id: 'rsvp',
      label: 'RSVP',
      icon: <Users className="w-5 h-5" />,
      badge: confirmedCount,
    },
    {
      id: 'n8n',
      label: 'n8n / Zap',
      icon: <Cpu className="w-5 h-5" />,
    },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-[#131315]/92 backdrop-blur-xl border-t border-[#cca830]/15">
      <div className="max-w-lg mx-auto flex justify-around items-center h-18 sm:h-20 px-4">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`tab-btn-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center gap-1 w-20 h-14 sm:w-24 sm:h-15 rounded-xl transition-all ${
                isActive
                  ? 'bg-[#2a1b3d] text-[#d3beea] shadow-[0_0_15px_rgba(211,190,234,0.15)] font-bold border border-[#d3beea]/20'
                  : 'text-[#ccc4ce] hover:text-[#e5e1e4] hover:bg-[#201f21]/60'
              }`}
            >
              <div className="relative">
                {tab.icon}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-[#ac012c] text-[#ffdad9] text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-[16px] text-center border border-[#ffb3b4]/30">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] sm:text-xs tracking-wider font-medium">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
