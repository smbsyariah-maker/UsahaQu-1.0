/**
 * Theme Manager Utility - Usaha Qu 1.0
 * 6 Variasi Tema Tampilan:
 * 1. Cerah (Bright / Outdoor Siang)
 * 2. Zamrud Hijau Klasik (Emerald)
 * 3. Dark (Midnight OLED)
 * 4. Neon Cyber Glow
 * 5. Ocean Blue (Safir)
 * 6. Royal Ruby (Merah Mewah)
 */

export type ThemeId = 'bright' | 'emerald' | 'midnight' | 'cyber' | 'ocean' | 'ruby';

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  shortName: string;
  desc: string;
  color: string;
  badge: string;
  headerBgClass: string;
  headerHex: string;
  viewportBgClass: string;
  textColorClass: string;
  accentBorderClass: string;
}

export const APP_THEMES: ThemeDefinition[] = [
  {
    id: 'bright',
    name: '1. Cerah (Bright / Outdoor Siang)',
    shortName: 'Outdoor Siang',
    desc: 'Kontras ultra-tajam anti-silau di bawah sinar matahari dengan latar bersih dan garis tegas.',
    color: '#d97706',
    badge: 'Outdoor Anti-Silau',
    headerBgClass: 'bg-amber-600',
    headerHex: '#d97706',
    viewportBgClass: 'bg-white',
    textColorClass: 'text-slate-900',
    accentBorderClass: 'border-amber-600'
  },
  {
    id: 'emerald',
    name: '2. Zamrud Hijau Klasik (Emerald)',
    shortName: 'Hijau Emerald',
    desc: 'Aksen hijau segar bawaan Usaha Qu yang sejuk, bersih, profesional, dan ramah kasir.',
    color: '#008952',
    badge: 'Bawaan Usaha Qu',
    headerBgClass: 'bg-[#008952]',
    headerHex: '#008952',
    viewportBgClass: 'bg-slate-50',
    textColorClass: 'text-slate-800',
    accentBorderClass: 'border-emerald-600'
  },
  {
    id: 'midnight',
    name: '3. Dark (Midnight OLED)',
    shortName: 'Midnight OLED',
    desc: 'Mode gelap sejati (deep black) hemat baterai layar AMOLED, nyaman untuk shift malam.',
    color: '#09090b',
    badge: 'Hemat Baterai AMOLED',
    headerBgClass: 'bg-[#09090b]',
    headerHex: '#09090b',
    viewportBgClass: 'bg-[#000000]',
    textColorClass: 'text-slate-100',
    accentBorderClass: 'border-zinc-800'
  },
  {
    id: 'cyber',
    name: '4. Neon Cyber Glow',
    shortName: 'Cyber Glow',
    desc: 'Tampilan futuristik berenergi tinggi dengan garis neon electric cyan/lime yang memukau.',
    color: '#06b6d4',
    badge: 'Futuristik Neon',
    headerBgClass: 'bg-[#0b1329]',
    headerHex: '#0b1329',
    viewportBgClass: 'bg-[#050814]',
    textColorClass: 'text-cyan-50',
    accentBorderClass: 'border-cyan-500'
  },
  {
    id: 'ocean',
    name: '5. Ocean Blue (Safir)',
    shortName: 'Ocean Safir',
    desc: 'Palet biru laut korporat dan profesional yang menenangkan untuk manajemen ritel & toko.',
    color: '#0284c7',
    badge: 'Korporat & Ritel',
    headerBgClass: 'bg-[#0369a1]',
    headerHex: '#0369a1',
    viewportBgClass: 'bg-sky-50/40',
    textColorClass: 'text-slate-800',
    accentBorderClass: 'border-sky-600'
  },
  {
    id: 'ruby',
    name: '6. Royal Ruby (Merah Mewah)',
    shortName: 'Royal Ruby',
    desc: 'Warna merah delima tegas, prestisius, dan dinamis ala kafe, resto, dan kuliner eksklusif.',
    color: '#e11d48',
    badge: 'Mewah & Dinamis',
    headerBgClass: 'bg-[#be123c]',
    headerHex: '#be123c',
    viewportBgClass: 'bg-rose-50/30',
    textColorClass: 'text-slate-800',
    accentBorderClass: 'border-rose-600'
  }
];

export function getActiveTheme(id?: string): ThemeDefinition {
  const found = APP_THEMES.find(t => t.id === id);
  return found || APP_THEMES[1]; // default emerald
}
