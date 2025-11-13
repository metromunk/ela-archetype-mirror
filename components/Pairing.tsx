
import React, { useState, useEffect } from 'react';
import { Archetype, PairingInsight } from '../types';
import { Users } from 'lucide-react';

interface PairingProps {
  archetypes: Archetype[];
  pairings: { [pairId: string]: PairingInsight };
  initialPair: [string, string] | null;
  onBack: () => void;
}

const Pairing: React.FC<PairingProps> = ({ archetypes, pairings, initialPair, onBack }) => {
  const [archetypeA, setArchetypeA] = useState<string>(initialPair ? initialPair[0] : archetypes[0].id);
  const [archetypeB, setArchetypeB] = useState<string>(initialPair ? initialPair[1] : archetypes[1].id);
  const [insight, setInsight] = useState<PairingInsight | null>(null);

  useEffect(() => {
    const key = `${archetypeA}+${archetypeB}`;
    const reverseKey = `${archetypeB}+${archetypeA}`;
    const foundInsight = pairings[key] || pairings[reverseKey] || null;
    setInsight(foundInsight);
  }, [archetypeA, archetypeB, pairings]);

  return (
    <div className="max-w-3xl mx-auto p-4 animate-fade-in">
      <button onClick={onBack} className="text-primary hover:underline mb-6">&larr; Back</button>
      <div className="text-center mb-8">
        <Users className="h-12 w-12 mx-auto text-primary mb-2" />
        <h1 className="text-3xl md:text-4xl font-bold font-serif">Archetype Pairing</h1>
        <p className="text-muted-foreground mt-2">Explore the attraction, shadow, and light potential between two archetypes.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 bg-card p-6 rounded-lg border border-border">
        <div>
          <label htmlFor="archetypeA" className="block text-sm font-medium text-muted-foreground mb-1">My Archetype</label>
          <select
            id="archetypeA"
            value={archetypeA}
            onChange={(e) => setArchetypeA(e.target.value)}
            className="w-full bg-background border border-input rounded-md p-2"
          >
            {archetypes.map(a => <option key={a.id} value={a.id}>{a.maskName}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="archetypeB" className="block text-sm font-medium text-muted-foreground mb-1">Their Archetype</label>
          <select
            id="archetypeB"
            value={archetypeB}
            onChange={(e) => setArchetypeB(e.target.value)}
            className="w-full bg-background border border-input rounded-md p-2"
          >
            {archetypes.filter(a => a.id !== archetypeA).map(a => <option key={a.id} value={a.id}>{a.maskName}</option>)}
          </select>
        </div>
      </div>

      {insight ? (
        <div className="space-y-6">
          <InsightSection title="Attraction Pattern" items={insight.attraction} />
          <InsightSection title="Shadow Dance" items={insight.shadowDance} />
          <InsightSection title="Trigger Loop" items={insight.triggerLoop} />
          <InsightSection title="Light-Side Potential" items={insight.lightPotential} />
          <InsightSection title="Integration Practices" items={insight.integrationPractices} />
        </div>
      ) : (
        <div className="text-center bg-card p-6 rounded-lg border border-border">
          <p className="text-muted-foreground">Insight for this specific pairing is not yet available. Please check one of the 14 primary pairings.</p>
        </div>
      )}
    </div>
  );
};

const InsightSection: React.FC<{title: string, items: string[]}> = ({title, items}) => (
  <div className="bg-card p-5 rounded-lg border border-border">
    <h3 className="text-xl font-semibold font-serif text-card-foreground mb-3">{title}</h3>
    <ul className="list-disc list-inside space-y-2 text-card-foreground/90">
      {items.map((item, index) => <li key={index}>{item}</li>)}
    </ul>
  </div>
);

export default Pairing;
