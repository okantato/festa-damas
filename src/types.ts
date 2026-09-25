export type TabType = 'convite' | 'rsvp' | 'n8n';

export type GuestRole = 'Médium da Casa' | 'Médium Visitante' | 'Convidado / Amigo' | 'Familiar';

export type ConviteStatus = 'pending' | 'confirmed' | 'declined';

export type EntityType = 'pombogira' | 'exu';

export interface Entidade {
  id?: string;
  name: string;
  type: EntityType;
  description?: string;
  greeting?: string;
  created_date?: string;
}

export interface Convite {
  id?: string;
  medium_name: string;
  entidade_name: string;
  token: string;
  status: ConviteStatus;
  confirmed_at?: string | null;
  decline_reason?: string | null;
  phone?: string;
  role?: GuestRole;
  companions_count?: number;
  companion_names?: string;
  drink_or_offering?: string;
  notes?: string;
  checked_in?: boolean;
  created_date?: string;
}

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
  targetDateTime: string;
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
