// Preset Avatar Catalog for DevConnect
// 24 unique, high-resolution vector and stylized developer avatars across 4 categories

export interface PresetAvatar {
  id: string;
  name: string;
  category: 'developer' | 'geometric' | 'gradient' | 'minimal';
  svg: string;
  bgGradient: string;
}

// Deterministic gradient generator for initials
export function getDeterministicGradient(name: string): string {
  const gradients = [
    'from-[#6D95FF] to-[#9D83FF]',
    'from-[#FF6B6B] to-[#FFE66D]',
    'from-[#4E65FF] to-[#92EFFD]',
    'from-[#0575E6] to-[#00F260]',
    'from-[#B92B27] to-[#1565C0]',
    'from-[#8A2387] to-[#E94057]',
    'from-[#F27121] to-[#E94057]',
    'from-[#00C9FF] to-[#92FE9D]',
    'from-[#FC466B] to-[#3F5EFB]',
    'from-[#3F2B96] to-[#A8C0FF]',
    'from-[#11998E] to-[#38EF7D]',
    'from-[#EAafC8] to-[#654EA3]'
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
}

export const PRESET_AVATARS: PresetAvatar[] = [
  // 1. Developer Avatars
  {
    id: 'preset:dev-1',
    name: 'Terminal Master',
    category: 'developer',
    bgGradient: 'from-blue-600 to-indigo-900',
    svg: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="20" fill="url(#bg1)"/>
      <circle cx="20" cy="15" r="7" fill="#F4F6FC"/>
      <path d="M10 32C10 26.4772 14.4772 22 20 22C25.5228 22 30 26.4772 30 32" stroke="#6D95FF" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M16 14L18 16L16 18" stroke="#090C13" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <line x1="19" y1="18" x2="22" y2="18" stroke="#090C13" stroke-width="1.5" stroke-linecap="round"/>
      <defs><linearGradient id="bg1" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse"><stop stop-color="#1E293B"/><stop offset="1" stop-color="#0F172A"/></linearGradient></defs>
    </svg>`
  },
  {
    id: 'preset:dev-2',
    name: 'Cyber Architect',
    category: 'developer',
    bgGradient: 'from-purple-600 to-indigo-950',
    svg: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="20" fill="#151F30"/>
      <circle cx="20" cy="14" r="6" fill="#9D83FF"/>
      <path d="M12 33C12 27 15.5 24 20 24C24.5 24 28 27 28 33" stroke="#9D83FF" stroke-width="2"/>
      <circle cx="18" cy="13" r="1" fill="#090C13"/>
      <circle cx="22" cy="13" r="1" fill="#090C13"/>
      <path d="M17 17C18.5 18 21.5 18 23 17" stroke="#090C13" stroke-width="1.2" stroke-linecap="round"/>
      <rect x="14" y="27" width="12" height="6" rx="2" fill="#6D95FF" opacity="0.4"/>
    </svg>`
  },
  {
    id: 'preset:dev-3',
    name: 'Rustacean Forge',
    category: 'developer',
    bgGradient: 'from-orange-600 to-amber-950',
    svg: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="20" fill="#1F1510"/>
      <circle cx="20" cy="15" r="7" fill="#F97316"/>
      <path d="M11 33C11 27 15 23 20 23C25 23 29 27 29 33" stroke="#F97316" stroke-width="2"/>
      <path d="M16 15H24M20 11V19" stroke="#1F1510" stroke-width="1.8" stroke-linecap="round"/>
      <circle cx="20" cy="15" r="2" fill="#F97316"/>
    </svg>`
  },
  {
    id: 'preset:dev-4',
    name: 'Neural AI Thinker',
    category: 'developer',
    bgGradient: 'from-emerald-600 to-teal-950',
    svg: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="20" fill="#0C1F1D"/>
      <circle cx="20" cy="14" r="6" fill="#10B981"/>
      <path d="M12 32C12 26 15.5 23 20 23C24.5 23 28 26 28 32" stroke="#10B981" stroke-width="2"/>
      <line x1="20" y1="8" x2="20" y2="4" stroke="#34D399" stroke-width="2" stroke-linecap="round"/>
      <circle cx="20" cy="3" r="1.5" fill="#34D399"/>
    </svg>`
  },
  {
    id: 'preset:dev-5',
    name: 'Cloud Captain',
    category: 'developer',
    bgGradient: 'from-sky-600 to-blue-950',
    svg: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="20" fill="#0C1B2A"/>
      <circle cx="20" cy="14" r="6" fill="#38BDF8"/>
      <path d="M11 33C11 26 15 23 20 23C25 23 29 26 29 33" stroke="#38BDF8" stroke-width="2"/>
      <path d="M15 13C16 11 18 10 20 10C22 10 24 11 25 13" stroke="#0C1B2A" stroke-width="1.5"/>
    </svg>`
  },
  {
    id: 'preset:dev-6',
    name: 'Full-Stack Scout',
    category: 'developer',
    bgGradient: 'from-cyan-600 to-slate-900',
    svg: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="20" fill="#151F30"/>
      <circle cx="20" cy="15" r="6.5" fill="#67E8F9"/>
      <path d="M11 32C11 26 15 22.5 20 22.5C25 22.5 29 26 29 32" stroke="#67E8F9" stroke-width="2"/>
      <rect x="17" y="13" width="6" height="3" rx="1.5" fill="#090C13"/>
    </svg>`
  },

  // 2. Geometric Avatars
  {
    id: 'preset:geo-1',
    name: 'Bauhaus Prisms',
    category: 'geometric',
    bgGradient: 'from-pink-500 to-indigo-600',
    svg: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="20" fill="#151F30"/>
      <polygon points="20,8 32,28 8,28" fill="#6D95FF"/>
      <circle cx="20" cy="22" r="5" fill="#9D83FF"/>
      <rect x="15" y="12" width="10" height="3" fill="#F4F6FC"/>
    </svg>`
  },
  {
    id: 'preset:geo-2',
    name: 'Hexagon Node',
    category: 'geometric',
    bgGradient: 'from-cyan-500 to-blue-700',
    svg: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="20" fill="#101725"/>
      <polygon points="20,7 31,13 31,27 20,33 9,27 9,13" stroke="#6D95FF" stroke-width="2.5" fill="none"/>
      <circle cx="20" cy="20" r="4.5" fill="#6D95FF"/>
    </svg>`
  },
  {
    id: 'preset:geo-3',
    name: 'Concentric Rings',
    category: 'geometric',
    bgGradient: 'from-amber-500 to-rose-600',
    svg: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="20" fill="#181320"/>
      <circle cx="20" cy="20" r="14" stroke="#F43F5E" stroke-width="1.5" stroke-dasharray="3 3"/>
      <circle cx="20" cy="20" r="9" stroke="#FB7185" stroke-width="2"/>
      <circle cx="20" cy="20" r="4" fill="#FDA4AF"/>
    </svg>`
  },
  {
    id: 'preset:geo-4',
    name: 'Tesseract Matrix',
    category: 'geometric',
    bgGradient: 'from-emerald-500 to-indigo-800',
    svg: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="20" fill="#0E1A1E"/>
      <rect x="11" y="11" width="18" height="18" stroke="#10B981" stroke-width="1.8" rx="2"/>
      <rect x="15" y="15" width="10" height="10" fill="#10B981" opacity="0.5" rx="1"/>
    </svg>`
  },
  {
    id: 'preset:geo-5',
    name: 'Diagonal Vector',
    category: 'geometric',
    bgGradient: 'from-violet-600 to-fuchsia-700',
    svg: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="20" fill="#1B1229"/>
      <path d="M8 32L32 8M8 20L20 8M20 32L32 20" stroke="#C084FC" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`
  },
  {
    id: 'preset:geo-6',
    name: 'Dual Orbit',
    category: 'geometric',
    bgGradient: 'from-blue-500 to-teal-400',
    svg: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="20" fill="#0C1B26"/>
      <ellipse cx="20" cy="20" rx="14" ry="6" transform="rotate(-30 20 20)" stroke="#38BDF8" stroke-width="1.8"/>
      <ellipse cx="20" cy="20" rx="14" ry="6" transform="rotate(30 20 20)" stroke="#2DD4BF" stroke-width="1.8"/>
      <circle cx="20" cy="20" r="3.5" fill="#F0FDFA"/>
    </svg>`
  },

  // 3. Abstract Gradients
  {
    id: 'preset:grad-1',
    name: 'Cosmic Neon',
    category: 'gradient',
    bgGradient: 'from-blue-600 via-purple-600 to-pink-500',
    svg: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="20" fill="url(#cosmic)"/>
      <defs><linearGradient id="cosmic" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse"><stop stop-color="#3B82F6"/><stop offset="0.5" stop-color="#8B5CF6"/><stop offset="1" stop-color="#EC4899"/></linearGradient></defs>
    </svg>`
  },
  {
    id: 'preset:grad-2',
    name: 'Hyper Aurora',
    category: 'gradient',
    bgGradient: 'from-teal-400 via-emerald-500 to-sky-600',
    svg: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="20" fill="url(#aurora)"/>
      <defs><linearGradient id="aurora" x1="0" y1="40" x2="40" y2="0" gradientUnits="userSpaceOnUse"><stop stop-color="#2DD4BF"/><stop offset="0.6" stop-color="#10B981"/><stop offset="1" stop-color="#0284C7"/></linearGradient></defs>
    </svg>`
  },
  {
    id: 'preset:grad-3',
    name: 'Electric Sunset',
    category: 'gradient',
    bgGradient: 'from-amber-400 via-rose-500 to-purple-700',
    svg: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="20" fill="url(#sunset)"/>
      <defs><linearGradient id="sunset" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse"><stop stop-color="#F59E0B"/><stop offset="0.5" stop-color="#F43F5E"/><stop offset="1" stop-color="#7E22CE"/></linearGradient></defs>
    </svg>`
  },
  {
    id: 'preset:grad-4',
    name: 'Deep Oceanic',
    category: 'gradient',
    bgGradient: 'from-cyan-400 via-blue-600 to-slate-900',
    svg: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="20" fill="url(#oceanic)"/>
      <defs><linearGradient id="oceanic" x1="40" y1="0" x2="0" y2="40" gradientUnits="userSpaceOnUse"><stop stop-color="#38BDF8"/><stop offset="0.5" stop-color="#2563EB"/><stop offset="1" stop-color="#0F172A"/></linearGradient></defs>
    </svg>`
  },
  {
    id: 'preset:grad-5',
    name: 'Midnight Velvet',
    category: 'gradient',
    bgGradient: 'from-indigo-900 via-purple-900 to-slate-950',
    svg: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="20" fill="url(#velvet)"/>
      <defs><linearGradient id="velvet" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse"><stop stop-color="#312E81"/><stop offset="0.5" stop-color="#581C87"/><stop offset="1" stop-color="#020617"/></linearGradient></defs>
    </svg>`
  },
  {
    id: 'preset:grad-6',
    name: 'Solar Flare',
    category: 'gradient',
    bgGradient: 'from-yellow-300 via-orange-500 to-red-600',
    svg: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="20" fill="url(#solar)"/>
      <defs><linearGradient id="solar" x1="0" y1="20" x2="40" y2="20" gradientUnits="userSpaceOnUse"><stop stop-color="#FDE047"/><stop offset="0.5" stop-color="#F97316"/><stop offset="1" stop-color="#DC2626"/></linearGradient></defs>
    </svg>`
  },

  // 4. Minimal Characters
  {
    id: 'preset:min-1',
    name: 'Mono Hacker',
    category: 'minimal',
    bgGradient: 'from-zinc-700 to-zinc-900',
    svg: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="20" fill="#18181B"/>
      <circle cx="20" cy="15" r="5" stroke="#FAFAFA" stroke-width="1.8"/>
      <path d="M12 30C12 25 15.5 22 20 22C24.5 22 28 25 28 30" stroke="#FAFAFA" stroke-width="1.8" stroke-linecap="round"/>
    </svg>`
  },
  {
    id: 'preset:min-2',
    name: 'Pixel Cadet',
    category: 'minimal',
    bgGradient: 'from-blue-700 to-slate-900',
    svg: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="20" fill="#0F172A"/>
      <rect x="14" y="11" width="12" height="10" rx="2" stroke="#60A5FA" stroke-width="1.8"/>
      <circle cx="17" cy="16" r="1.5" fill="#60A5FA"/>
      <circle cx="23" cy="16" r="1.5" fill="#60A5FA"/>
      <path d="M11 31C11 26 15 23 20 23C25 23 29 26 29 31" stroke="#60A5FA" stroke-width="1.8"/>
    </svg>`
  },
  {
    id: 'preset:min-3',
    name: 'Neon Spark',
    category: 'minimal',
    bgGradient: 'from-amber-600 to-stone-900',
    svg: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="20" fill="#1C1917"/>
      <polygon points="20,8 24,18 34,20 25,26 28,36 20,30 12,36 15,26 6,20 16,18" fill="#FBBF24"/>
    </svg>`
  },
  {
    id: 'preset:min-4',
    name: 'Zen Dev',
    category: 'minimal',
    bgGradient: 'from-emerald-700 to-zinc-900',
    svg: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="20" fill="#141E18"/>
      <circle cx="20" cy="15" r="6" stroke="#34D399" stroke-width="1.5"/>
      <path d="M17 15C18 16 22 16 23 15" stroke="#34D399" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M12 30C12 25 15.5 22.5 20 22.5C24.5 22.5 28 25 28 30" stroke="#34D399" stroke-width="1.5"/>
    </svg>`
  },
  {
    id: 'preset:min-5',
    name: 'Spectre Shadow',
    category: 'minimal',
    bgGradient: 'from-purple-800 to-zinc-950',
    svg: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="20" fill="#130E1F"/>
      <path d="M20 9C15 9 12 13 12 18V29L16 27L20 29L24 27L28 29V18C28 13 25 9 20 9Z" stroke="#A855F7" stroke-width="1.8" stroke-linejoin="round"/>
      <circle cx="17" cy="18" r="1.5" fill="#A855F7"/>
      <circle cx="23" cy="18" r="1.5" fill="#A855F7"/>
    </svg>`
  },
  {
    id: 'preset:min-6',
    name: 'Code Pulse',
    category: 'minimal',
    bgGradient: 'from-blue-800 to-slate-950',
    svg: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="20" fill="#0F172A"/>
      <path d="M8 20H14L17 12L23 28L26 20H32" stroke="#38BDF8" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`
  }
];

export function getPresetAvatar(idOrUrl: string | null | undefined): PresetAvatar | undefined {
  if (!idOrUrl) return undefined;
  return PRESET_AVATARS.find(a => a.id === idOrUrl);
}
