
import React, { useState, useCallback, useEffect } from 'react';
import { Archetype, ArchetypeResult, PairingInsight } from './types';
import Home from './components/Home';
import Test from './components/Test';
import Results from './components/Results';
import Library from './components/Library';
import Pairing from './components/Pairing';
import ChakraMap from './components/ChakraMap';
import { useArchetypeData } from './hooks/useArchetypeData';
import { Moon, Sun } from 'lucide-react';

export type View = 'home' | 'test' | 'results' | 'library' | 'pairing' | 'chakraMap' | 'archetypeDetail';

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [results, setResults] = useState<ArchetypeResult | null>(null);
  const [selectedArchetype, setSelectedArchetype] = useState<Archetype | null>(null);
  const [selectedPairing, setSelectedPairing] = useState<[string, string] | null>(null);
  const { archetypes, testQuestions, pairings, loading, getArchetypeById } = useArchetypeData();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleTestComplete = useCallback((result: ArchetypeResult) => {
    setResults(result);
    setView('results');
  }, []);

  const handleShowLibrary = useCallback(() => {
    setView('library');
  }, []);
  
  const handleShowPairing = useCallback((initialPair: [string, string] | null = null) => {
    setSelectedPairing(initialPair);
    setView('pairing');
  }, []);

  const handleShowChakraMap = useCallback(() => {
    setView('chakraMap');
  }, []);

  const handleShowArchetypeDetail = useCallback((archetype: Archetype) => {
    setSelectedArchetype(archetype);
    setView('archetypeDetail');
  }, []);

  const handleBack = useCallback(() => {
    if(view === 'archetypeDetail') setView('library');
    else setView('home');
  }, [view]);

  const renderContent = () => {
    if (loading) {
      return <div className="flex justify-center items-center h-screen">Loading Archetype Data...</div>;
    }
    switch (view) {
      case 'test':
        return <Test questions={testQuestions} onComplete={handleTestComplete} />;
      case 'results':
        return results && <Results 
            result={results} 
            getArchetypeById={getArchetypeById} 
            onShowPairing={handleShowPairing}
            onShowChakraMap={handleShowChakraMap} 
            onRetake={() => setView('test')}
            archetypes={archetypes}
            />;
      case 'library':
        return <Library archetypes={archetypes} onSelectArchetype={handleShowArchetypeDetail} onBack={handleBack}/>;
      case 'archetypeDetail':
        return selectedArchetype && <ArchetypeDetail archetype={selectedArchetype} onBack={() => setView('library')} />;
      case 'pairing':
        return <Pairing archetypes={archetypes} pairings={pairings} initialPair={selectedPairing} onBack={handleBack}/>;
      case 'chakraMap':
        return results && <ChakraMap result={results} getArchetypeById={getArchetypeById} onBack={() => setView('results')}/>;
      case 'home':
      default:
        return <Home onStartTest={() => setView('test')} onShowLibrary={handleShowLibrary} onShowPairing={handleShowPairing}/>;
    }
  };

  const Header = () => (
    <header className="py-4 px-6 md:px-8 border-b border-border">
      <div className="container mx-auto flex justify-between items-center">
        <h1 
          className="text-xl md:text-2xl font-serif font-bold cursor-pointer text-foreground"
          onClick={() => setView('home')}
        >
          ELA Archetype Mirror
        </h1>
        <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-accent">
          {isDarkMode ? <Sun className="h-5 w-5 text-foreground"/> : <Moon className="h-5 w-5 text-foreground"/>}
        </button>
      </div>
    </header>
  );

  const ArchetypeDetail: React.FC<{archetype: Archetype, onBack: () => void}> = ({archetype, onBack}) => (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-6 animate-fade-in">
        <button onClick={onBack} className="text-primary hover:underline mb-4">&larr; Back to Library</button>
        <h1 className="text-3xl font-bold font-serif text-primary">{archetype.maskName}</h1>
        <p className="text-lg text-muted-foreground font-serif">Sacred Archetype: {archetype.sacredArchetype}</p>

        <div className="space-y-6">
          <DetailSection title="Core Wound" content={archetype.wound} />
          <DetailSection title="Theme" content={archetype.theme} />
          <DetailSection title="Limiting Beliefs" items={archetype.limitingBeliefs} />
          <DetailSection title="Somatic Zones" items={archetype.somaticZones} />
          <DetailSection title="Light Gifts" items={archetype.lightGifts} />
          <DetailSection title="Integration Path" items={archetype.integrationPath} />
        </div>
    </div>
  );

  const DetailSection: React.FC<{title: string; content?: string; items?: string[]}> = ({title, content, items}) => (
    <section className="bg-card p-4 rounded-lg border border-border">
      <h2 className="text-xl font-semibold font-serif text-card-foreground mb-2">{title}</h2>
      {content && <p className="text-card-foreground/80">{content}</p>}
      {items && (
        <ul className="list-disc ml-5 space-y-1 text-card-foreground/80">
          {items.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      )}
    </section>
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-grow">
        {renderContent()}
      </main>
      <footer className="text-center py-4 border-t border-border text-muted-foreground text-sm">
          <p>Based on 'The Goddess Within' by Jennifer & Roger Woolger (1989), adapted within the Emotional Legacy Ascension (ELA) modality by Metro Munk.</p>
          <p className="mt-2">
            © 2025 Metro Munk All rights reserved. visit <a href="http://www.metromunk.com.au" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">www.metromunk.com.au</a>.
          </p>
      </footer>
    </div>
  );
};

export default App;
