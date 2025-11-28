const prefixes = [
  "Mind", "Shadow", "Digital", "Cyber", "Neon", "Ghost", "Void", 
  "Echo", "Phantom", "Crystal", "Neural", "Quantum", "Stellar",
  "Mystic", "Cosmic", "Binary", "Flux", "Pulse", "Matrix"
];

const suffixes = [
  "Traveler", "Node", "Walker", "Seeker", "Runner", "Drifter",
  "Wanderer", "Sentinel", "Guardian", "Rider", "Hunter", "Weaver",
  "Dreamer", "Phantom", "Ghost", "Spirit", "Soul", "Mind"
];

export function generateAnonymousName(): string {
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  const number = Math.floor(Math.random() * 100);
  return `${prefix}${suffix}${number}`;
}
