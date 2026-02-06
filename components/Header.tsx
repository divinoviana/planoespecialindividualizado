
import React from 'react';
import { BookOpen, Plus, ClipboardList } from 'lucide-react';

interface HeaderProps {
  onNavigate: (view: 'LIST' | 'FORM') => void;
  currentView: string;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentView }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('LIST')}>
            <div className="bg-indigo-600 p-2 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              EducaIA PEI
            </h1>
          </div>
          
          <nav className="flex gap-4">
            <button
              onClick={() => onNavigate('LIST')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                currentView === 'LIST' 
                  ? 'bg-indigo-50 text-indigo-700' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              <span className="hidden sm:inline">Meus Planos</span>
            </button>
            <button
              onClick={() => onNavigate('FORM')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all shadow-sm ${
                currentView === 'FORM'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-indigo-500 text-white hover:bg-indigo-600'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Novo PEI</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
