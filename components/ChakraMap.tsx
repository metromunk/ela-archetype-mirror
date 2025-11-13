
import React from 'react';
import { ArchetypeResult, Archetype } from '../types';

interface ChakraMapProps {
  result: ArchetypeResult;
  getArchetypeById: (id: string) => Archetype | undefined;
  onBack: () => void;
}

const CHAKRA_INFO = {
    'Root': { color: 'bg-red-500', archetypes: ['lonewolf', 'rebel'] },
    'Sacral': { color: 'bg-orange-500', archetypes: ['seducer', 'martyr', 'savior'] },
    'Solar Plexus': { color: 'bg-yellow-500', archetypes: ['achiever', 'critic', 'rebel', 'shapeshifter'] },
    'Heart': { color: 'bg-green-500', archetypes: ['pleaser', 'niceone', 'shapeshifter', 'savior'] },
    'Throat': { color: 'bg-blue-500', archetypes: ['intellectual', 'performer', 'joker', 'niceone', 'shapeshifter'] },
    'Third Eye': { color: 'bg-indigo-500', archetypes: ['intellectual'] },
    'Crown': { color: 'bg-purple-500', archetypes: ['perfectionist'] }
};

const ChakraMap: React.FC<ChakraMapProps> = ({ result, onBack }) => {
    const userChakras = result.chakra;
    const primaryArchetype = result.primaryMaskId;

  return (
    <div className="max-w-2xl mx-auto p-4 animate-fade-in">
        <button onClick={onBack} className="text-primary hover:underline mb-6">&larr; Back to Results</button>
        <h1 className="text-3xl md:text-4xl font-bold font-serif text-center mb-2">Your Chakra Map</h1>
        <p className="text-center text-muted-foreground mb-8">
            This map shows the energetic centers highlighted by your primary archetype, <strong>{primaryArchetype}</strong>.
        </p>

        <div className="space-y-4">
            {Object.entries(CHAKRA_INFO).map(([name, info]) => {
                const isActive = userChakras.includes(name);
                return (
                    <div
                        key={name}
                        className={`p-4 rounded-lg border flex items-center transition-all duration-300 ${
                            isActive ? `bg-card shadow-lg border-primary` : 'bg-muted border-border opacity-60'
                        }`}
                    >
                        <div className={`w-8 h-8 rounded-full ${info.color} mr-4 flex-shrink-0`}></div>
                        <div>
                            <h3 className={`text-xl font-bold font-serif ${isActive ? 'text-primary' : 'text-foreground'}`}>{name}</h3>
                            <p className="text-sm text-muted-foreground">
                                Associated Archetypes: {info.archetypes.map(a => a.charAt(0).toUpperCase() + a.slice(1)).join(', ')}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
  );
};

export default ChakraMap;
