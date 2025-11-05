// Mapovanie technických názvov z 3D modelu na slovenské názvy svalov
// Používa sa pre klikanie a zobrazovanie info

export const MUSCLE_MAPPING = {
  // Hrudník
  'chest': 'Hrudník (Pectorals)',
  'pectorals': 'Hrudník (Pectorals)',
  'pecs': 'Hrudník (Pectorals)',

  // Brucho
  'abs': 'Brucho (Abs)',
  'abdominals': 'Brucho (Abs)',
  'core': 'Brucho (Abs)',

  // Ramená
  'shoulders': 'Ramená (Shoulders)',
  'deltoids': 'Ramená (Shoulders)',
  'delts': 'Ramená (Shoulders)',

  // Ruky - Biceps
  'biceps': 'Biceps',
  'bicep': 'Biceps',
  'arms': 'Biceps',

  // Ruky - Triceps
  'triceps': 'Triceps',
  'tricep': 'Triceps',

  // Predlaktia
  'forearms': 'Predlaktia (Forearms)',
  'forearm': 'Predlaktia (Forearms)',

  // Chrbát
  'back': 'Chrbát (Back)',
  'lats': 'Široké svaly chrbta (Lats)',
  'latissimus': 'Široké svaly chrbta (Lats)',
  'traps': 'Trapézy (Traps)',
  'trapezius': 'Trapézy (Traps)',

  // Nohy - Stehná
  'quads': 'Stehná (Quads)',
  'quadriceps': 'Stehná (Quads)',
  'thighs': 'Stehná (Quads)',
  'legs': 'Stehná (Quads)',

  // Nohy - Hamstringy
  'hamstrings': 'Zadné stehenné svaly (Hamstrings)',
  'hamstring': 'Zadné stehenné svaly (Hamstrings)',

  // Nohy - Lýtka
  'calves': 'Lýtka (Calves)',
  'calf': 'Lýtka (Calves)',

  // Zadok
  'glutes': 'Zadok (Glutes)',
  'gluteus': 'Zadok (Glutes)',
  'butt': 'Zadok (Glutes)',

  // Default pre neznáme
  'unknown': 'Neznáma partia',
  'object': 'Časť tela',
}

// Funkcia na získanie slovenského názvu svalu
export const getMuscleName = (technicalName) => {
  if (!technicalName) return 'Neznáma partia'

  // Konvertuj na lowercase a odstrán čísla a podčiarkovníky
  const cleaned = technicalName
    .toLowerCase()
    .replace(/[0-9_]/g, '')
    .trim()

  // Hľadaj v mappingu
  for (const [key, value] of Object.entries(MUSCLE_MAPPING)) {
    if (cleaned.includes(key) || key.includes(cleaned)) {
      return value
    }
  }

  // Ak sa nenašlo, vráť pôvodný názov
  return technicalName
}

// Kategórie svalov pre organizáciu
export const MUSCLE_CATEGORIES = {
  upper: ['Hrudník (Pectorals)', 'Ramená (Shoulders)', 'Biceps', 'Triceps', 'Predlaktia (Forearms)', 'Chrbát (Back)', 'Široké svaly chrbta (Lats)', 'Trapézy (Traps)'],
  core: ['Brucho (Abs)'],
  lower: ['Stehná (Quads)', 'Zadné stehenné svaly (Hamstrings)', 'Lýtka (Calves)', 'Zadok (Glutes)'],
}
