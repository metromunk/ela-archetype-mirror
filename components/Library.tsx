
import React from 'react';
import { Archetype } from '../types';
import { ArrowRight } from 'lucide-react';

interface LibraryProps {
  archetypes: Archetype[];
  onSelectArchetype: (archetype: Archetype) => void;
  onBack: () => void;
}

const Library: React.FC<LibraryProps> = ({ archetypes, onSelectArchetype, onBack }) => {
  return (
    <div className="max-w-4xl mx-auto p-4 animate-fade-in">
      <button onClick={onBack} className="text-primary hover:underline mb-6">&larr; Back to Home</button>
      <h1 className="text-3xl md:text-4xl font-bold font-serif text-center mb-8">Archetype Library</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {archetypes.map((archetype) => (
          <div
            key={archetype.id}
            onClick={() => onSelectArchetype(archetype)}
            className="bg-card border border-border p-6 rounded-lg shadow-sm hover:shadow-lg hover:border-primary transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <h2 className="text-2xl font-bold font-serif text-primary">{archetype.maskName}</h2>
              <p className="text-muted-foreground mb-4">
                <span className="text-foreground">Sacred Archetype:</span> {archetype.sacredArchetype}
              </p>
            </div>
            <div className="flex items-center justify-end text-sm text-primary font-semibold">
              View Profile <ArrowRight className="h-4 w-4 ml-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Library;
