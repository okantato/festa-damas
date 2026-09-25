import { createClient, type Base44Client, type User } from '@base44/sdk';
import { APP_BASE_URL, APP_ID, FUNCTIONS_VERSION, IS_BASE44_CONFIGURED } from './app-params';

let client: Base44Client | null = null;

export function isBase44Configured() {
  return IS_BASE44_CONFIGURED;
}

export function getBase44() {
  if (!client) {
    client = createClient({
      appId: APP_ID,
      appBaseUrl: APP_BASE_URL,
      functionsVersion: FUNCTIONS_VERSION || undefined,
    });
  }

  return client;
}

export async function getCurrentUser(): Promise<User | null> {
  if (!isBase44Configured()) return null;

  try {
    return await getBase44().auth.me();
  } catch {
    return null;
  }
}
