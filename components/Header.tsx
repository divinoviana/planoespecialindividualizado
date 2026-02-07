
import React from 'react';
import { BookOpen, RefreshCw } from 'lucide-react';

interface HeaderProps {
  onNew?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNew }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              Crie seu PEI de forma simples
            </h1>
          </div>
          
          <nav className="flex gap-4">
            {onNew && (
              <button
                onClick={onNew}
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Criar Novo PEI</span>
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
