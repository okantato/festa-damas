import { ASSETS } from '../constants';
import type { EntityType } from '../types';

export const IMAGENS = {
  hero: ASSETS.MYSTIC_BG_SILHOUETTE,
  pombogira: ASSETS.GOLD_ROSE_EMBLEM,
  exu: ASSETS.GOLD_ROSE_EMBLEM,
  emblem: ASSETS.GOLD_ROSE_EMBLEM,
  map: ASSETS.MAP_IMAGE,
};

export function imagemPorTipo(tipo?: EntityType) {
  return tipo === 'exu' ? IMAGENS.exu : IMAGENS.pombogira;
}
