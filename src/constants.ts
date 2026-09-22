import { EventDetails, RsvpGuest, N8nSettings } from './types';

// Direct Image URLs provided from HTML & Assets
export const ASSETS = {
  GOLD_ROSE_EMBLEM:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAVLFbo3dK5KL094z6TMHenbmohcwYy7ruwrWekA2GdElu00468QQ4zUn4nLzjESWBWichduD6GMllTnCmd5jc-aBQ1ohK1EOq8Sf-kwQpT9AocdRg7xvWzz-YQ6ksNWj5ktWCEVjmmvbp-JTL8Zz_R1A_prbz5Md_G6h6AAeA8BT4Gk9ky3IlD3qMLJhNusBacxiZcWDyvyx78ZNzra8cXyNxFm49zC7Bi6M6xn5RK_2LtdmnwpsL0',
  MYSTIC_BG_SILHOUETTE:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCoCwTYBbRe5Od-ZqZs7UyjQ5gI7PVTvClFyqFgLtrWcu3ZzVycvF7Sh5k2UrUJvCG2cnCUn6Dj-BGZDQrUV9r-P3tHwWTCPz2iiaNFmbjzEu1xtIL1tXOBQBw5qQ4m66qxIfpaCEkTNV7chcEN02KwCjEmFcSoArpRdLo7O4Z5Tzr9LmxHbv0RchQiVVNMm66u2lPJyhFBBI5X8eB5Dac9G1hw-kSBsnk45SkPVVvXg9TkRc8jiqJx',
  MAP_IMAGE:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCu8BPEJ_TneJYhhh41zXEkJ6k1XY0jYi_VhEJAk1m3G4Qhy1OBewXhe4qXO1VetZFptErTdfTv-PLX00AYhJxKO-6CcozAOVaf9D6I_U5h4YbxXfeKM9dNN6qzMzxqZt7ERH-Uo2FgIVNv5mTdBYUWlxqJM-wE-HdkTokYyO-PCojg3W_pTtsZvntEpqVyNj179atDrTe3KPI5F5DpMap-HFfQEvOKBosRJeXLGgRBdF20DF-co22l',
};

// Target date: 15 de Outubro (or dynamic future date for realistic countdown ticking)
const futureDate = new Date();
futureDate.setDate(futureDate.getDate() + 18);
futureDate.setHours(19, 0, 0, 0);

export const DEFAULT_EVENT_DETAILS: EventDetails = {
  title: 'FESTA DA MENINA',
  subtitle: 'Da Vó da Casa',
  houseName: 'Ilé Axé Omo Nanã',
  address: 'Endereço Privado - SP',
  locationDetails: 'Bairro da Lapa / Perdizes - São Paulo, SP',
  dateStr: '15 de Outubro',
  targetDateTime: futureDate.toISOString(),
  startTime: '19h00',
  endTime: 'No dia seguinte',
  bbqTime: 'A partir das 12h',
  dressCodeTitle: 'TRAJE: Luxo',
  dressCodeDesc: 'Roupas elegantes em harmonia com a energia da celebração.',
  drinkRuleTitle: 'BEBIDA E FUMO',
  drinkRuleDesc: 'Cada médium deverá trazer a bebida e o fumo de sua entidade.',
  safetyRuleTitle: 'IMPORTANTE: Segurança',
  safetyRuleDesc:
    'Se você for dirigir, não beba. Pensando na segurança de todos, teremos organização para que ninguém precise dirigir após consumir bebida alcoólica.',
  invitationNote:
    '"Venha preparado para celebrar, cantar, dar e firmar essa noite especial junto à Menina. Sua presença é muito importante para nós." 🌹',
};

export const INITIAL_GUESTS: RsvpGuest[] = [
  {
    id: '1',
    name: 'Pai Jorge d’Ogum',
    phone: '(11) 98765-4321',
    role: 'Médium da Casa',
    entityName: 'Caboclo Rompe Mato & Menina da Praia',
    companionsCount: 1,
    companionNames: 'Mãe Clara de Oyá',
    drinkOrOffering: 'Champanhe Rosé & Rosas Vermelhas',
    status: 'confirmado',
    checkedIn: false,
    notes: 'Chegaremos às 18h30 para auxílio nos preparativos.',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Mariana Silveira',
    phone: '(11) 97123-8899',
    role: 'Médium Visitante',
    entityName: 'Pomba Gira Menina da Noite',
    companionsCount: 0,
    drinkOrOffering: 'Licor de Cereja & Cigarros de Menta',
    status: 'confirmado',
    checkedIn: false,
    notes: 'Será uma honra imensa saudar a Menina.',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Carlos Eduardo Santos',
    phone: '(11) 99456-1122',
    role: 'Convidado / Amigo',
    companionsCount: 2,
    companionNames: 'Aline e Pedro',
    drinkOrOffering: 'Vinho Tinto Doce',
    status: 'confirmado',
    checkedIn: false,
    notes: 'Respeito e gratidão pelo convite.',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Irmã Beatriz de Iemanjá',
    phone: '(11) 96541-7788',
    role: 'Médium da Casa',
    entityName: 'Menina dos Sete Cruzeiros',
    companionsCount: 0,
    drinkOrOffering: 'Martini Bianco & Perfume de Rosas',
    status: 'confirmado',
    checkedIn: false,
    notes: 'Firmeza pronta!',
    createdAt: new Date().toISOString(),
  },
];

export const DEFAULT_N8N_SETTINGS: N8nSettings = {
  webhookUrl: 'https://n8n.webhook.site/webhook/festa-da-menina-rsvp',
  apiKey: '',
  autoSync: true,
};

export const WHATSAPP_TEMPLATES = [
  {
    id: 'convite_oficial',
    title: '🌹 Convite Oficial',
    desc: 'Mensagem poética com todos os dados da festa para enviar aos convidados e médiuns.',
    text: `✨ *FESTA DA MENINA - Da Vó da Casa* ✨\n\n"Com muita alegria e respeito, convidamos você e sua entidade para celebrar conosco mais uma noite de festa, força e axé." 🌹\n\n📅 *Data:* 15 de Outubro\n⏰ *Início:* 19h00 (Churrasco a partir das 12h)\n📍 *Local:* Ilé Axé Omo Nanã (Endereço Privado - SP)\n\n👗 *Traje:* Luxo (Roupas elegantes em harmonia com a celebração)\n🍾 *Bebida & Fumo:* Cada médium traz a bebida e o fumo de sua entidade.\n🚗 *Segurança:* Se for dirigir, não beba. Teremos apoio para translado seguro.\n\n👉 *Confirme sua presença no link do app:* {APP_URL}\n\nAxé para todos nós! Laroyê Menina! 💃✨`,
  },
  {
    id: 'confirmacao_rsvp',
    title: '✅ Confirmação de Presença',
    desc: 'Mensagem enviada automaticamente para o convidado confirmando o cadastro.',
    text: `🌹 *Presença Confirmada na Festa da Menina!* 🌹\n\nOlá, *{NOME}*!\nRecebemos com muita alegria a sua confirmação para a nossa grande celebração.\n\n👥 Acompanhantes: {ACOMPANHANTES}\n✨ Entidade: {ENTIDADE}\n\nNos vemos no Ilé Axé Omo Nanã no dia 15 de Outubro a partir das 19h.\nLaroyê! Saravá a Menina! 💃🍷`,
  },
  {
    id: 'lembrete_24h',
    title: '⏰ Lembrete 24h Antes',
    desc: 'Lembrete de véspera com instruções finais de traje e estacionamento.',
    text: `✨ *É AMANHÃ! Festa da Menina da Vó da Casa* ✨\n\nPassando para lembrar que amanhã, 15 de Outubro às 19h, abriremos as portas para mais uma gira de axé, beleza e fartura.\n\nLembre-se:\n• Traje: Luxo\n• Bebida e fumo de sua entidade\n• Se beber, vá de aplicativo\n\nEstamos de braços abertos esperando por você! 🌹`,
  },
];
