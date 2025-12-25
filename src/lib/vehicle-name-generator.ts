const ADJECTIVES = [
  'rapide', 'furtif', 'agile', 'cosmique', 'stellaire', 'atomique',
  'fulgurant', 'argente', 'turbo', 'bionique', 'cybernetique', 'dynamique'
];

const NOUNS = [
  'faucon', 'tigre', 'eclair', 'fusee', 'ombre', 'comete', 'vortex',
  'pionnier', 'spectre', 'chronos', 'quasar', 'nova'
];

function capitalize(s: string) {
  if (typeof s !== 'string' || s.length === 0) {
    return '';
  }
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function generateVehicleName(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  return `${noun}${capitalize(adj)}`;
}
