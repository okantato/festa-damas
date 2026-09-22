export type TabType = 'convite' | 'rsvp' | 'n8n';

export type GuestRole = 'Médium da Casa' | 'Médium Visitante' | 'Convidado / Amigo' | 'Familiar';

export interface RsvpGuest {
  id: string;
  name: string;
  phone: string;
  role: GuestRole;
  entityName?: string;
  companionsCount: number;
  companionNames?: string;
  drinkOrOffering?: string;
  status: 'confirmado' | 'pendente' | 'cancelado';
  checkedIn?: boolean;
  notes?: string;
  createdAt: string;
}

export interface EventDetails {
  title: string;
  subtitle: string;
  houseName: string;
  address: string;
  locationDetails: string;
  dateStr: string;
  targetDateTime: string; // ISO string for countdown
  startTime: string;
  endTime: string;
  bbqTime: string;
  dressCodeTitle: string;
  dressCodeDesc: string;
  drinkRuleTitle: string;
  drinkRuleDesc: string;
  safetyRuleTitle: string;
  safetyRuleDesc: string;
  invitationNote: string;
}

export interface N8nSettings {
  webhookUrl: string;
  apiKey?: string;
  autoSync: boolean;
  lastSync?: string;
}
