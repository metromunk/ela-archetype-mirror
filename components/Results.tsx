
import React, { useState, useEffect } from 'react';
import { Archetype, ArchetypeResult } from '../types';
import { generateArchetypePdf } from '../utils/pdfGenerator';
import { getAIPersonalizedSummary } from '../services/geminiService';
import { Download, Users, Map, RefreshCw, Sparkles, Loader2 } from 'lucide-react';

interface ResultsProps {
  result: ArchetypeResult;
  getArchetypeById: (id: string) => Archetype | undefined;
  onShowPairing: (initialPair: [string, string]) => void;
  onShowChakraMap: () => void;
  onRetake: () => void;
  archetypes: Archetype[];
}

const Results: React.FC<ResultsProps> = ({ result, getArchetypeById, onShowPairing, onShowChakraMap, onRetake, archetypes }) => {
  const [primaryArchetype, setPrimaryArchetype] = useState<Archetype | null>(null);
  const [secondaryArchetype, setSecondaryArchetype] = useState<Archetype | null>(null);
  const [aiSummary, setAiSummary] = useState('');
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  useEffect(() => {
    const primary = getArchetypeById(result.primaryMaskId);
    const secondary = getArchetypeById(result.secondaryMaskId);
    if (primary) {
      setPrimaryArchetype(primary);
      // Combine chakras from both archetypes, removing duplicates
      result.chakra = [...new Set([...(primary.chakra || []), ...(secondary?.chakra || [])])];
    }
    if (secondary) setSecondaryArchetype(secondary);
  }, [result, getArchetypeById]);
  
  const handleDownloadPdf = () => {
    if (!primaryArchetype || !secondaryArchetype) return;

    generateArchetypePdf({
      archetypeResult: result,
      primaryArchetype,
      secondaryArchetype,
      dateGenerated: new Date().toLocaleDateString(),
      // @ts-ignore - Pass all archetypes for the helper function inside pdfGenerator
      allArchetypes: archetypes,
    });
  };

  const handleGetAiSummary = async () => {
    if (!primaryArchetype || !secondaryArchetype) return;
    setIsLoadingAi(true);
    const summary = await getAIPersonalizedSummary(primaryArchetype, secondaryArchetype);
    setAiSummary(summary);
    setIsLoadingAi(false);
  };

  if (!primaryArchetype || !secondaryArchetype) {
    return <div className="text-center">Loading results...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 animate-fade-in">
      <h1 className="text-3xl md:text-4xl font-bold font-serif text-center mb-8">Your Archetype Results</h1>
      
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <ArchetypeCard title="Primary Mask" archetype={primaryArchetype} isPrimary />
        <ArchetypeCard title="Secondary Mask" archetype={secondaryArchetype} />
      </div>

      <div className="bg-card border border-border p-6 rounded-lg mb-8">
        <h3 className="text-2xl font-semibold font-serif mb-4 flex items-center">
            <Sparkles className="h-6 w-6 mr-2 text-primary" /> Gemini AI Insight
        </h3>
        {aiSummary ? (
            <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: aiSummary.replace(/\n/g, '<br />') }} />
        ) : (
            <>
                <p className="text-muted-foreground mb-4">Get a personalized summary of how your primary and secondary archetypes interact, including unique challenges and integration paths.</p>
                <button
                    onClick={handleGetAiSummary}
                    disabled={isLoadingAi}
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold py-2 px-4 rounded-lg shadow-md transition-all flex items-center disabled:opacity-50"
                >
                    {isLoadingAi ? (
                        <>
                            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                            Generating...
                        </>
                    ) : (
                       'Get Fast AI Insight'
                    )}
                </button>
            </>
        )}
      </div>

      <div className="bg-card border border-border p-6 rounded-lg">
        <h3 className="text-2xl font-semibold font-serif mb-4">Next Steps</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <ActionButton icon={<Users className="h-5 w-5 mr-2"/>} label="Explore Pairing" onClick={() => onShowPairing([result.primaryMaskId, 'achiever'])} />
          <ActionButton icon={<Map className="h-5 w-5 mr-2"/>} label="See Chakra Map" onClick={onShowChakraMap} />
          <ActionButton icon={<Download className="h-5 w-5 mr-2"/>} label="Download PDF" onClick={handleDownloadPdf} />
        </div>
      </div>
      
      <div className="text-center mt-12">
        <button onClick={onRetake} className="text-primary hover:underline flex items-center justify-center mx-auto">
            <RefreshCw className="h-4 w-4 mr-2"/>
            Retake the Test
        </button>
      </div>
    </div>
  );
};

const ArchetypeCard: React.FC<{title: string, archetype: Archetype, isPrimary?: boolean}> = ({title, archetype, isPrimary}) => (
    <div className={`p-6 rounded-lg border ${isPrimary ? 'bg-secondary/30 border-primary' : 'bg-card border-border'}`}>
        <h2 className="text-sm font-bold uppercase text-muted-foreground">{title}</h2>
        <h3 className="text-3xl font-bold font-serif text-primary">{archetype.maskName}</h3>
        <p className="text-muted-foreground mb-4">Sacred Archetype: {archetype.sacredArchetype}</p>
        <div className="space-y-2 text-sm">
            <p><strong className="font-semibold">Wound:</strong> {archetype.wound}</p>
            <p><strong className="font-semibold">Theme:</strong> {archetype.theme}</p>
        </div>
    </div>
);

const ActionButton: React.FC<{icon: React.ReactNode, label: string, onClick: () => void}> = ({icon, label, onClick}) => (
    <button onClick={onClick} className="w-full bg-background border border-border hover:bg-accent text-foreground font-semibold py-3 px-4 rounded-lg shadow-sm transition-all flex items-center justify-center">
        {icon}
        {label}
    </button>
);


export default Results;
