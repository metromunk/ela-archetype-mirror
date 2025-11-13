
export interface Archetype {
  id: string;
  maskName: string;
  sacredArchetype: string;
  wound: string;
  theme: string;
  limitingBeliefs: string[];
  somaticZones: string[];
  chakra: string[];
  lightGifts: string[];
  integrationPath: string[];
}

export interface ArchetypeTestOption {
  id: string;
  questionId: string;
  label: string;
  mapsTo: string[];
}

export interface ArchetypeTestQuestion {
  id: string;
  question: string;
  options: ArchetypeTestOption[];
}

export interface ArchetypeResult {
  primaryMaskId: string;
  secondaryMaskId: string;
  chakra: string[];
}

export interface PairingInsight {
  pairId: string;
  archetypeA: string;
  archetypeB: string;
  attraction: string[];
  shadowDance: string[];
  triggerLoop: string[];
  lightPotential: string[];
  integrationPractices: string[];
}

export interface ChakraMapData {
  chakra: string;
  archetypes: string[];
}

export interface PdfReportPayload {
  userName?: string;
  archetypeResult: ArchetypeResult;
  primaryArchetype: Archetype;
  secondaryArchetype: Archetype;
  pairingInsight?: PairingInsight;
  dateGenerated: string;
}

export interface TestAnswer {
  optionId: string;
  mapsTo: string[];
}

export interface TestScore {
  [archetypeId: string]: number;
}
