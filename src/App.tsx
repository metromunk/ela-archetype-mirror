import React, { useState, useCallback, useEffect } from 'react';
import { Archetype, ArchetypeResult, PairingInsight } from './types';
import Home from './components/Home';
import Test from './components/Test';
import Results from './components/Results';
import Library from './components/Library';
import Pairing from './components/Pairing';
import ChakraMap from './components/ChakraMap';
import { Moon, Sun } from 'lucide-react';

export type View = 'home' | 'test' | 'results' | 'library' | 'pairing' | 'chakraMap' | 'archetypeDetail';

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [results, setResults] = useState<ArchetypeResult | null>(null);
  const [selectedArchetype, setSelectedArchetype] = useState<Archetype | null>(null);
  const [selectedPairing, setSelectedPairing] = useState<[string, string] | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const archetypes = [];
  const testQuestions = [];
  const pairings: PairingInsight[] = [];

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const handleTestComplete = useCallback((result: ArchetypeResult) => {
    setResults(result);
    setView('results');
  }, []);

  const handleShowLibrary = () => setView('library');

  const handleShowPairing = (initialPair: [string, string] | null = null) => {
    setSelectedPairing(initialPair);
    setView('pairing');
  };

  const handleShowChakraMap = () => setView('chakraMap');

  const handleShowArchetypeDetail = (archetype: Archetype) => {
    setSelectedArchetype(archetype);
    setView('archetypeDetail');
  };

  const handleBack = () => {
    if(view === 'archetypeDetail') setView('library');
    else setView('home');
  };

  const getArchetypeById = (id: string) => {
    return archetypes.find(a => a.id === id) || null;
  };

  const renderContent = () => {
    switch (view) {
      case 'test':
        return <Test questions={testQuestions} onComplete={handleTestComplete} />;
      case 'results':
        return results && (
          <Results 
            result={results}
            getArchetypeById={getArchetypeById}
            onShowPairing={handleShowPairing}
            onShowChakraMap={handleShowChakraMap}
            onRetake={() => setView('test')}
            archetypes={archetypes}
          />
        );
      case 'library':
        return (
          <Library 
            archetypes={archetypes} 
            onSelectArchetype={handleShowArchetypeDetail} 
            onBack={handleBack} 
          />
        );
      case 'archetypeDetail':
        return selectedArchetype && (
          <ArchetypeDetail 
            archetype={selectedArchetype} 
            onBack={() => setView('library')} 
          />
        );
      case 'pairing':
        return (
          <Pairing 
            archetypes={archetypes} 
            pairings={pairings} 
            initialPair={selectedPairing} 
            onBack={handleBack}
          />
        );
      case 'chakraMap':
        return results && (
          <ChakraMap 
            result={results} 
            getArchetypeById={getArchetypeById} 
            onBack={() => setView('results')} 
          />
        );
      default:
        return (
          <Home 
            onStartTest={() => setView('test')} 
            onShowLibrary={handleShowLibrary} 
            onShowPairing={handleShowPairing} 
          />
        );
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
    <div className="max-w-3xl
