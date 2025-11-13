
import { useState, useEffect } from 'react';
import { Archetype, ArchetypeTestQuestion, PairingInsight } from '../types';

type ArchetypeMap = { [id: string]: Archetype };
type PairingMap = { [pairId: string]: PairingInsight };

export const useArchetypeData = () => {
  const [archetypes, setArchetypes] = useState<Archetype[]>([]);
  const [archetypeMap, setArchetypeMap] = useState<ArchetypeMap>({});
  const [testQuestions, setTestQuestions] = useState<ArchetypeTestQuestion[]>([]);
  const [pairings, setPairings] = useState<PairingMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [archetypeRes, testRes, pairingRes] = await Promise.all([
          fetch('./data/archetypes.json'),
          fetch('./data/testQuestions.json'),
          fetch('./data/pairings.json')
        ]);

        if (!archetypeRes.ok || !testRes.ok || !pairingRes.ok) {
            throw new Error('Failed to load data files.');
        }

        const archetypeData = await archetypeRes.json();
        const testData = await testRes.json();
        const pairingData = await pairingRes.json();

        const loadedArchetypes: Archetype[] = archetypeData.archetypes;
        setArchetypes(loadedArchetypes);
        
        const aMap: ArchetypeMap = loadedArchetypes.reduce((acc, arch) => {
            acc[arch.id] = arch;
            return acc;
        }, {} as ArchetypeMap);
        setArchetypeMap(aMap);

        setTestQuestions(testData.testQuestions as ArchetypeTestQuestion[]);

        const primaryPairings = pairingData.primaryPairings as PairingInsight[];
        const pMap: PairingMap = {};

        primaryPairings.forEach(p => {
            pMap[`${p.archetypeA}+${p.archetypeB}`] = p;
            pMap[`${p.archetypeB}+${p.archetypeA}`] = {
                ...p,
                archetypeA: p.archetypeB,
                archetypeB: p.archetypeA,
            };
        });
        setPairings(pMap);

      } catch (error) {
        console.error("Failed to fetch archetype data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getArchetypeById = (id: string): Archetype | undefined => {
    return archetypeMap[id];
  };

  return { archetypes, testQuestions, pairings, loading, getArchetypeById };
};
