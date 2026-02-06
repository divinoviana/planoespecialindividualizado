
import React from 'react';
import { User, BookOpen, Calendar, ChevronRight, Search } from 'lucide-react';
import { PEIData } from '../types';

interface PEIListProps {
  peis: PEIData[];
  onSelect: (pei: PEIData) => void;
}

const PEIList: React.FC<PEIListProps> = ({ peis, onSelect }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredPeis = peis.filter(pei => 
    pei.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pei.class_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Meus Planos de Ensino</h2>
          <p className="text-slate-500 mt-1">Gerencie os PEIs criados para seus alunos.</p>
        </div>
        
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por estudante ou turma..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none shadow-sm"
          />
        </div>
      </div>

      {filteredPeis.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
          <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700">Nenhum PEI encontrado</h3>
          <p className="text-slate-500 mt-1">Comece criando seu primeiro plano individualizado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPeis.map((pei) => (
            <div
              key={pei.id}
              onClick={() => onSelect(pei)}
              className="group bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl hover:shadow-indigo-50 hover:border-indigo-200 transition-all cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="w-5 h-5 text-indigo-400" />
              </div>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                  <User className="w-6 h-6 text-indigo-600 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors truncate max-w-[180px]">
                    {pei.student_name}
                  </h4>
                  <p className="text-sm text-slate-500">{pei.class_name}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <BookOpen className="w-4 h-4 text-slate-400" />
                  <span>{pei.subject}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Criado em: {new Date(pei.created_at || '').toLocaleDateString('pt-BR')}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center text-xs text-slate-400">
                <span>{pei.period}</span>
                <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded uppercase tracking-wider font-semibold">
                  {pei.execution_period}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PEIList;
