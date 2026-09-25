import { getBase44, isBase44Configured } from './base44';
import { STORAGE_KEYS } from './app-params';
import type { Convite, Entidade } from '../types';

const DEMO_ENTIDADES: Entidade[] = [
  {
    id: 'entidade-maria-padilha',
    name: 'Maria Padilha',
    type: 'pombogira',
    description: 'A rainha das estradas, dona do domínio e da magia do axé.',
    greeting: 'Que a sua gira seja intensa, automática e cheia de axé.',
  },
  {
    id: 'entidade-tranca-ruas',
    name: 'Tranca Ruas',
    type: 'exu',
    description: 'O senhor dos caminhos, dono da palavra e da proteção de quem passa.',
    greeting: 'Que o seu caminho seja aberto, forte e guiado pela palavra.',
  },
];

const DEMO_CONVITES: Convite[] = [
  {
    id: 'demo-padilha-2026',
    medium_name: 'Pai Jorge d’Ogum',
    entidade_name: 'Maria Padilha',
    token: 'demo-padilha-2026',
    status: 'pending',
    role: 'Médium da Casa',
    companions_count: 1,
    companion_names: 'Mãe Clara de Oyá',
    drink_or_offering: 'Champanhe Rosé & Rosas Vermelhas',
    notes: 'Chegaremos às 18h30 para ajudar nos preparativos.',
  },
  {
    id: 'demo-trancaruas-2026',
    medium_name: 'Mariana Silveira',
    entidade_name: 'Tranca Ruas',
    token: 'demo-trancaruas-2026',
    status: 'pending',
    role: 'Médium Visitante',
    companions_count: 0,
    drink_or_offering: 'Licor de Cereja & Cigarros de Menta',
    notes: 'Será uma honra saudar a Menina.',
  },
];

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function readStorage<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback;

  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function normalizeEntidade(value: any): Entidade {
  return {
    id: value?.id,
    name: value?.name || 'Entidade da Casa',
    type: value?.type === 'exu' ? 'exu' : 'pombogira',
    description: value?.description,
    greeting: value?.greeting,
    created_date: value?.created_date,
  };
}

function normalizeConvite(value: any): Convite {
  return {
    id: value?.id,
    medium_name: value?.medium_name || value?.name || 'Médium convidado',
    entidade_name: value?.entidade_name || value?.entityName || 'Entidade da Casa',
    token: value?.token || '',
    status: value?.status === 'confirmed' || value?.status === 'declined' ? value.status : 'pending',
    confirmed_at: value?.confirmed_at,
    decline_reason: value?.decline_reason,
    phone: value?.phone,
    role: value?.role,
    companions_count: Number(value?.companions_count ?? value?.companionsCount ?? 0),
    companion_names: value?.companion_names || value?.companionNames,
    drink_or_offering: value?.drink_or_offering || value?.drinkOrOffering,
    notes: value?.notes,
    checked_in: Boolean(value?.checked_in ?? value?.checkedIn),
    created_date: value?.created_date,
  };
}

function localEntidades() {
  const stored = readStorage<Entidade[]>(STORAGE_KEYS.entidades, []);
  return stored.length ? stored : DEMO_ENTIDADES;
}

function localConvites() {
  const stored = readStorage<Convite[]>(STORAGE_KEYS.convites, []);
  return stored.length ? stored : DEMO_CONVITES;
}

function saveLocalEntidades(value: Entidade[]) {
  writeStorage(STORAGE_KEYS.entidades, value);
}

function saveLocalConvites(value: Convite[]) {
  writeStorage(STORAGE_KEYS.convites, value);
}

function entityHandler(name: string): any {
  return (getBase44().entities as any)[name];
}

export function createToken() {
  const random = Math.random().toString(36).slice(2, 10);
  const time = Date.now().toString(36);
  return `convite-${time}-${random}`;
}

export async function listEntidades(): Promise<Entidade[]> {
  if (isBase44Configured()) {
    try {
      const rows = await entityHandler('Entidade').list('-created_date', 200);
      return Array.isArray(rows) ? rows.map(normalizeEntidade) : [];
    } catch {
      return [];
    }
  }

  return localEntidades();
}

export async function getEntidadeByName(name: string): Promise<Entidade | null> {
  if (isBase44Configured()) {
    try {
      const rows = await entityHandler('Entidade').filter({ name }, '-created_date', 1);
      return Array.isArray(rows) && rows.length ? normalizeEntidade(rows[0]) : null;
    } catch {
      return null;
    }
  }

  return localEntidades().find((item) => item.name.toLowerCase() === name.toLowerCase()) || null;
}

export async function listConvites(): Promise<Convite[]> {
  if (isBase44Configured()) {
    try {
      const rows = await entityHandler('Convite').list('-created_date', 200);
      return Array.isArray(rows) ? rows.map(normalizeConvite) : [];
    } catch {
      return [];
    }
  }

  return localConvites();
}

export async function getConviteByToken(token: string): Promise<Convite | null> {
  if (isBase44Configured()) {
    try {
      const rows = await entityHandler('Convite').filter({ token }, '-created_date', 1);
      return Array.isArray(rows) && rows.length ? normalizeConvite(rows[0]) : null;
    } catch {
      return null;
    }
  }

  return localConvites().find((item) => item.token === token) || null;
}

export async function createConvite(input: Omit<Convite, 'id' | 'created_date'>): Promise<Convite> {
  if (isBase44Configured()) {
    const created = await entityHandler('Convite').create({ ...input });
    return normalizeConvite(created);
  }

  const current = localConvites();
  const created = normalizeConvite({
    ...input,
    id: input.token,
    created_date: new Date().toISOString(),
  });
  saveLocalConvites([created, ...current.filter((item) => item.token !== created.token)]);
  return created;
}

export async function updateConvite(id: string, patch: Partial<Convite>): Promise<Convite> {
  if (isBase44Configured()) {
    const updated = await entityHandler('Convite').update(id, patch);
    return normalizeConvite(updated);
  }

  const current = localConvites();
  const found = current.find((item) => item.id === id || item.token === id);
  if (!found) throw new Error('Convite não encontrado');
  const updated = normalizeConvite({ ...found, ...patch, id: found.id, token: found.token });
  saveLocalConvites(current.map((item) => (item.id === id || item.token === id ? updated : item)));
  return updated;
}

export async function deleteConvite(id: string): Promise<void> {
  if (isBase44Configured()) {
    await entityHandler('Convite').delete(id);
    return;
  }

  saveLocalConvites(localConvites().filter((item) => item.id !== id && item.token !== id));
}

export async function setCheckIn(id: string, checkedIn: boolean): Promise<Convite> {
  return updateConvite(id, { checked_in: checkedIn });
}

export function getLocalAdminEnabled() {
  return canUseStorage() && window.localStorage.getItem(STORAGE_KEYS.localAdmin) === 'true';
}

export function setLocalAdminEnabled(enabled: boolean) {
  if (canUseStorage()) window.localStorage.setItem(STORAGE_KEYS.localAdmin, String(enabled));
}
