
import React from 'react';
import { Shield, Sparkles, Users, Map } from 'lucide-react';

interface HomeProps {
  onStartTest: () => void;
  onShowLibrary: () => void;
  onShowPairing: () => void;
}

const Home: React.FC<HomeProps> = ({ onStartTest, onShowLibrary, onShowPairing }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-4 animate-fade-in">
      <Sparkles className="h-16 w-16 text-primary mb-4" />
      <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4 text-foreground">
        ELA Archetype Mirror
      </h1>
      <p className="max-w-2xl text-lg text-muted-foreground mb-8">
        Discover the mask you created to stay safe… and the sacred archetype beneath.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onStartTest}
          className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-3 px-8 rounded-lg text-lg shadow-lg transition-transform transform hover:scale-105"
        >
          Start the Archetype Test
        </button>
      </div>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl w-full">
         <HomeCard 
            icon={<Shield className="h-8 w-8 mb-2 text-secondary-foreground" />}
            title="Explore All Archetypes"
            description="Browse the library of all 14 masks and their sacred gifts."
            onClick={onShowLibrary}
         />
         <HomeCard 
            icon={<Users className="h-8 w-8 mb-2 text-secondary-foreground" />}
            title="Pairing Insights"
            description="Understand the dynamics between your archetype and others."
            onClick={() => onShowPairing()}
         />
      </div>
    </div>
  );
};

interface HomeCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    onClick: () => void;
}

const HomeCard: React.FC<HomeCardProps> = ({ icon, title, description, onClick }) => (
    <div 
        onClick={onClick}
        className="bg-card border border-border rounded-lg p-6 flex flex-col items-center text-center cursor-pointer hover:shadow-md hover:border-primary transition-all duration-300"
    >
        {icon}
        <h3 className="text-xl font-semibold font-serif text-card-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
    </div>
);

export default Home;
