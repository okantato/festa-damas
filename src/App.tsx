import React, { useState, useEffect } from 'react';
import { TabType, RsvpGuest, EventDetails, N8nSettings } from './types';
import {
  ASSETS,
  DEFAULT_EVENT_DETAILS,
  INITIAL_GUESTS,
  DEFAULT_N8N_SETTINGS,
} from './constants';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { FallingPetals } from './components/FallingPetals';
import { InviteTab } from './components/tabs/InviteTab';
import { RsvpTab } from './components/tabs/RsvpTab';
import { IntegrationTab } from './components/tabs/IntegrationTab';
import { DownloadInviteModal } from './components/DownloadInviteModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('convite');
  const [petalsEnabled, setPetalsEnabled] = useState(true);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  // Persistence: Event Details
  const [eventDetails, setEventDetails] = useState<EventDetails>(() => {
    const saved = localStorage.getItem('festa_da_menina_event');
    return saved ? JSON.parse(saved) : DEFAULT_EVENT_DETAILS;
  });

  // Persistence: RSVP Guests
  const [guests, setGuests] = useState<RsvpGuest[]>(() => {
    const saved = localStorage.getItem('festa_da_menina_guests');
    return saved ? JSON.parse(saved) : INITIAL_GUESTS;
  });

  // Persistence: n8n Settings
  const [n8nSettings, setN8nSettings] = useState<N8nSettings>(() => {
    const saved = localStorage.getItem('festa_da_menina_n8n');
    return saved ? JSON.parse(saved) : DEFAULT_N8N_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('festa_da_menina_event', JSON.stringify(eventDetails));
  }, [eventDetails]);

  useEffect(() => {
    localStorage.setItem('festa_da_menina_guests', JSON.stringify(guests));
  }, [guests]);

  useEffect(() => {
    localStorage.setItem('festa_da_menina_n8n', JSON.stringify(n8nSettings));
  }, [n8nSettings]);

  const handleAddGuest = async (newGuestData: Omit<RsvpGuest, 'id' | 'createdAt'>) => {
    const newGuest: RsvpGuest = {
      ...newGuestData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    setGuests((prev) => [newGuest, ...prev]);

    // If n8n autoSync is active, dispatch webhook asynchronously
    if (n8nSettings.autoSync && n8nSettings.webhookUrl) {
      try {
        fetch(n8nSettings.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'novo_rsvp',
            convidado: newGuest,
            timestamp: new Date().toISOString(),
          }),
          mode: 'no-cors',
        }).catch(() => {});
      } catch {
        // quiet catch
      }
    }
  };

  const handleToggleCheckIn = (id: string) => {
    setGuests((prev) =>
      prev.map((g) => (g.id === id ? { ...g, checkedIn: !g.checkedIn } : g))
    );
  };

  const handleDeleteGuest = (id: string) => {
    setGuests((prev) => prev.filter((g) => g.id !== id));
  };

  const handleShareWhatsApp = () => {
    const msg = encodeURIComponent(
      `✨ *FESTA DA MENINA - Da Vó da Casa* ✨\n\n"Com muita alegria e respeito, convidamos você e sua entidade para celebrar conosco mais uma noite de festa, força e axé." 🌹\n\n📅 *Data:* ${eventDetails.dateStr}\n⏰ *Início:* ${eventDetails.startTime}\n📍 *Local:* ${eventDetails.houseName} (${eventDetails.address})\n\nConfirme sua presença no app oficial:\n${window.location.href}`
    );
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: 'Festa da Menina - Da Vó da Casa',
          text: 'Com muita alegria e respeito, convidamos você e sua entidade para celebrar conosco mais uma noite de festa, força e axé.',
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      handleShareWhatsApp();
    }
  };

  return (
    <div className="bg-[#131315] text-[#e5e1e4] min-h-screen flex flex-col relative selection:bg-[#cca830]/30 selection:text-[#ffe088]">
      {/* Mystic Background with Garden/Calunga Silhouette Effect */}
      <div
        className="fixed inset-0 z-0 opacity-25 bg-cover bg-center pointer-events-none"
        style={{ backgroundImage: `url('${ASSETS.MYSTIC_BG_SILHOUETTE}')` }}
      />
      <div className="fixed inset-0 z-0 mystic-bg opacity-90 pointer-events-none" />

      {/* Floating Animated Falling Petals */}
      <FallingPetals enabled={petalsEnabled} />

      {/* Fixed Top Header */}
      <Header
        currentTab={currentTab}
        petalsEnabled={petalsEnabled}
        onTogglePetals={() => setPetalsEnabled(!petalsEnabled)}
        onShare={handleNativeShare}
      />

      {/* Main Content Area */}
      <main className="flex-grow relative z-20 px-4 sm:px-6 pt-20 pb-28 max-w-lg mx-auto w-full">
        {currentTab === 'convite' && (
          <InviteTab
            event={eventDetails}
            onGoToRsvp={() => setCurrentTab('rsvp')}
            onOpenDownloadModal={() => setIsDownloadModalOpen(true)}
            onShareWhatsApp={handleShareWhatsApp}
          />
        )}

        {currentTab === 'rsvp' && (
          <RsvpTab
            guests={guests}
            onAddGuest={handleAddGuest}
            onToggleCheckIn={handleToggleCheckIn}
            onDeleteGuest={handleDeleteGuest}
          />
        )}

        {currentTab === 'n8n' && (
          <IntegrationTab
            settings={n8nSettings}
            onUpdateSettings={setN8nSettings}
            recentGuests={guests}
          />
        )}
      </main>

      {/* Fixed Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
        confirmedCount={guests.length}
      />

      {/* Download Card Image Modal */}
      <DownloadInviteModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        event={eventDetails}
      />
    </div>
  );
}
