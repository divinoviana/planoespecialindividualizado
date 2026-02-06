
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import PEIForm from './components/PEIForm';
import PEIList from './components/PEIList';
import PEIDisplay from './components/PEIDisplay';
import { ViewState, PEIData } from './types';
import { supabase } from './services/supabase';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('LIST');
  const [peis, setPeis] = useState<PEIData[]>([]);
  const [selectedPei, setSelectedPei] = useState<PEIData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPeis = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('peis')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setPeis(data || []);
    } catch (error) {
      console.error('Erro ao carregar PEIs:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPeis();
  }, [fetchPeis]);

  const handleSavePei = async (peiData: PEIData) => {
    try {
      const { error } = await supabase
        .from('peis')
        .insert([peiData]);

      if (error) throw error;
      
      await fetchPeis();
      setView('LIST');
    } catch (error) {
      console.error('Erro ao salvar PEI:', error);
      throw error;
    }
  };

  const handleDeletePei = async (id: string) => {
    if (!confirm('Deseja realmente excluir este PEI?')) return;
    
    try {
      const { error } = await supabase
        .from('peis')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchPeis();
      setView('LIST');
      setSelectedPei(null);
    } catch (error) {
      console.error('Erro ao excluir PEI:', error);
      alert('Erro ao excluir o plano.');
    }
  };

  const handleSelectPei = (pei: PEIData) => {
    setSelectedPei(pei);
    setView('VIEW');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header 
        onNavigate={(v) => {
          setView(v);
          setSelectedPei(null);
        }} 
        currentView={view} 
      />
      
      <main className="flex-grow">
        {loading && view === 'LIST' ? (
          <div className="flex items-center justify-center h-[60vh]">
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-12 h-12 bg-indigo-200 rounded-full mb-4"></div>
              <div className="h-4 w-48 bg-slate-200 rounded"></div>
            </div>
          </div>
        ) : (
          <>
            {view === 'LIST' && (
              <PEIList peis={peis} onSelect={handleSelectPei} />
            )}
            {view === 'FORM' && (
              <PEIForm 
                onSave={handleSavePei} 
                onCancel={() => setView('LIST')} 
              />
            )}
            {view === 'VIEW' && selectedPei && (
              <PEIDisplay 
                pei={selectedPei} 
                onBack={() => setView('LIST')} 
                onDelete={handleDeletePei}
              />
            )}
          </>
        )}
      </main>

      <footer className="py-8 bg-white border-t border-slate-100 text-center no-print">
        <p className="text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} EducaIA PEI - Tocantins. Tecnologia a serviço da inclusão escolar.
        </p>
      </footer>
    </div>
  );
};

export default App;
