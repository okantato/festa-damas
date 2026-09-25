const env = import.meta.env as Record<string, string | undefined>;

export const APP_ID = env.VITE_BASE44_APP_ID || '';
export const APP_BASE_URL = env.VITE_APP_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : '');
export const FUNCTIONS_VERSION = env.VITE_BASE44_FUNCTIONS_VERSION || '';
export const IS_BASE44_CONFIGURED = Boolean(APP_ID);

export const STORAGE_KEYS = {
  convites: 'festa_da_menina_convites',
  entidades: 'festa_da_menina_entidades',
  n8n: 'festa_da_menina_n8n',
  localAdmin: 'festa_da_menina_local_admin',
};
