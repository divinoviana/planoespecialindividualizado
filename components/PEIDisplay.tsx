
import React from 'react';
import { ArrowLeft, Printer, Trash2 } from 'lucide-react';
import { PEIData } from '../types';

interface PEIDisplayProps {
  pei: PEIData;
  onBack: () => void;
  onDelete: (id: string) => void;
}

const PEIDisplay: React.FC<PEIDisplayProps> = ({ pei, onBack, onDelete }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto p-4 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-6 no-print">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar à Lista
        </button>
        <div className="flex gap-3">
          <button 
            onClick={() => pei.id && onDelete(pei.id)}
            className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Excluir
          </button>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-4 py-2 rounded-lg transition-colors"
          >
            <Printer className="w-4 h-4" /> Imprimir / PDF
          </button>
        </div>
      </div>

      <div id="printable-pei" className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-indigo-800 px-8 py-8 text-white text-center">
          <h1 className="text-3xl font-black uppercase tracking-tight">Plano de Ensino Individualizado (PEI)</h1>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-bold uppercase opacity-90">
            <div><span className="opacity-70">Estudante:</span> {pei.student_name}</div>
            <div><span className="opacity-70">Turma:</span> {pei.class_name}</div>
            <div><span className="opacity-70">Matéria:</span> {pei.subject}</div>
            <div><span className="opacity-70">Periodo:</span> {pei.period}</div>
          </div>
        </div>
        
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm">
            <div><span className="font-bold text-slate-700">Professor Regente:</span> {pei.teacher_regent}</div>
            <div><span className="font-bold text-slate-700">Periodicidade:</span> {pei.frequency}</div>
            <div><span className="font-bold text-slate-700">Equipe de Colaboração:</span> {pei.collaboration_team}</div>
            <div><span className="font-bold text-slate-700">Período de Execução:</span> {pei.execution_period}</div>
          </div>

          <div className="space-y-10">
            <Section title="1⁰ - Histórico Clínico e Familiar" content={pei.content.historicoClinico} />
            <Section title="2⁰ - Descrição da Condição Específica" content={pei.content.condicaoEspecifica} />
            <Section title="3⁰ - Conhecimentos, Habilidades e Afinidades" content={pei.content.habilidadesAfinidades} />
            <Section title="4⁰ - Principais Barreiras" content={pei.content.barreiras} />
            <Section title="5⁰ - Habilidades da Turma (BNCC/DCT)" content={pei.content.habilidadesBNCC} />
            <Section title="6⁰ - Adaptação e Flexibilização para o Estudante" content={pei.content.habilidadesAdaptadas} />
            <Section title="7⁰ - Objeto do Conhecimento (BNCC/DCT)" content={pei.content.objetoConhecimentoBNCC} />
            <Section title="8⁰ - Adaptação do Objeto do Conhecimento" content={pei.content.objetoConhecimentoAdaptado} />
            <Section title="9⁰ - Objetivos do PEI" content={pei.content.objetivosPEI} />
            <Section title="10⁰ - Metodologias (Recursos e Estratégias)" content={pei.content.metodologias} />
            <Section title="11⁰ - Avaliação e Retomada" content={pei.content.avaliacao} />
          </div>
          
          <div className="mt-16 pt-8 border-t border-slate-200 text-center">
            <div className="flex justify-around items-end h-24">
              <div className="w-1/3 border-t border-slate-400 text-xs text-slate-500 pt-2">Assinatura Professor(a)</div>
              <div className="w-1/3 border-t border-slate-400 text-xs text-slate-500 pt-2">Assinatura Responsável / Coordenação</div>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; padding: 0 !important; margin: 0 !important; }
          #printable-pei { border: none !important; box-shadow: none !important; }
          .rounded-2xl { border-radius: 0 !important; }
        }
      `}</style>
    </div>
  );
};

const Section: React.FC<{ title: string; content: string }> = ({ title, content }) => (
  <div>
    <h3 className="text-sm font-bold text-indigo-900 border-l-4 border-indigo-600 pl-3 mb-2 uppercase tracking-wide">{title}</h3>
    <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-line text-justify">
      {content}
    </div>
  </div>
);

export default PEIDisplay;
