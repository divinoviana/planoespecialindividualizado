
import React, { useState } from 'react';
import Header from './components/Header';
import PEIForm from './components/PEIForm';
import PEIDisplay from './components/PEIDisplay';
import { PEIData } from './types';

const App: React.FC = () => {
  const [currentPei, setCurrentPei] = useState<PEIData | null>(null);

  const handlePeiGenerated = (data: PEIData) => {
    setCurrentPei(data);
  };

  const handleCreateNew = () => {
    if (confirm("Tem certeza? O PEI atual será perdido se você não tiver salvo o PDF.")) {
      setCurrentPei(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header onNew={currentPei ? handleCreateNew : undefined} />
      
      <main className="flex-grow">
        {!currentPei ? (
          <PEIForm onGenerated={handlePeiGenerated} />
        ) : (
          <PEIDisplay 
            pei={currentPei} 
            onBack={handleCreateNew} 
          />
        )}
      </main>

      <footer className="py-8 bg-white border-t border-slate-100 text-center no-print">
        <p className="text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} - Desenvolvido por Prof.Me. Divino Ribeiro Viana
        </p>
      </footer>
    </div>
  );
};

export default App;
