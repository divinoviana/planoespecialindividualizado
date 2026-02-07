
import React, { useEffect } from 'react';
import { ArrowLeft, Printer, Download } from 'lucide-react';
import { PEIData } from '../types';

interface PEIDisplayProps {
  pei: PEIData;
  onBack: () => void;
}

const PEIDisplay: React.FC<PEIDisplayProps> = ({ pei, onBack }) => {
  
  useEffect(() => {
    // Rola para o topo ao carregar o resultado
    window.scrollTo(0, 0);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto p-4 animate-in slide-in-from-bottom-4 duration-500">
      
      {/* Barra de Ações (Não aparece na impressão) */}
      <div className="bg-indigo-900 text-white p-4 rounded-xl shadow-lg mb-6 flex flex-col md:flex-row justify-between items-center gap-4 no-print">
        <div className="flex items-center gap-2">
           <span className="bg-green-500 text-xs font-bold px-2 py-1 rounded text-white">SUCESSO</span>
           <span className="font-medium">O PEI foi gerado com sucesso!</span>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={onBack}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-indigo-800 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar
          </button>
          <button 
            onClick={handlePrint}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white text-indigo-900 hover:bg-indigo-50 px-6 py-2 rounded-lg transition-colors font-bold shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Imprimir / Salvar PDF</span>
            <span className="sm:hidden">PDF</span>
          </button>
        </div>
      </div>

      {/* Área Imprimível */}
      <div id="printable-pei" className="bg-white rounded-none md:rounded-2xl shadow-xl md:border border-slate-200 overflow-hidden print:shadow-none print:border-none print:m-0 print:w-full">
        <div className="bg-white border-b-2 border-slate-800 px-8 py-8 text-slate-900 text-center">
          <h1 className="text-2xl font-black uppercase tracking-tight mb-2">Plano de Ensino Individualizado (PEI)</h1>
          <p className="text-sm text-slate-500">Documento gerado automaticamente via EducaIA</p>
          
          <div className="mt-6 border border-slate-300 rounded-lg p-4 bg-slate-50/50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-8 text-left text-sm">
              <div>
                <span className="block text-xs font-bold text-slate-400 uppercase">Estudante</span>
                <span className="font-semibold text-slate-900">{pei.student_name}</span>
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-400 uppercase">Turma</span>
                <span className="font-semibold text-slate-900">{pei.class_name}</span>
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-400 uppercase">Matéria</span>
                <span className="font-semibold text-slate-900">{pei.subject}</span>
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-400 uppercase">Bimestre</span>
                <span className="font-semibold text-slate-900">{pei.period}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-8 print:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-sm border-b border-slate-200 pb-6">
            <div className="flex justify-between border-b border-dotted border-slate-300 py-1">
              <span className="text-slate-500">Professor Regente:</span> 
              <span className="font-medium">{pei.teacher_regent}</span>
            </div>
            <div className="flex justify-between border-b border-dotted border-slate-300 py-1">
              <span className="text-slate-500">Periodicidade:</span> 
              <span className="font-medium">{pei.frequency}</span>
            </div>
            <div className="flex justify-between border-b border-dotted border-slate-300 py-1">
              <span className="text-slate-500">Equipe Colaboração:</span> 
              <span className="font-medium text-right">{pei.collaboration_team}</span>
            </div>
            <div className="flex justify-between border-b border-dotted border-slate-300 py-1">
              <span className="text-slate-500">Execução:</span> 
              <span className="font-medium">{pei.execution_period}</span>
            </div>
          </div>

          <div className="space-y-8 print:space-y-6">
            <Section title="1. Histórico Clínico e Familiar" content={pei.content.historicoClinico} />
            <Section title="2. Descrição da Condição Específica" content={pei.content.condicaoEspecifica} />
            <Section title="3. Conhecimentos, Habilidades e Afinidades" content={pei.content.habilidadesAfinidades} />
            <Section title="4. Principais Barreiras" content={pei.content.barreiras} />
            <div className="break-inside-avoid">
              <Section title="5. Habilidades da Turma (BNCC/DCT)" content={pei.content.habilidadesBNCC} />
            </div>
            <Section title="6. Adaptação e Flexibilização" content={pei.content.habilidadesAdaptadas} />
            <div className="break-inside-avoid">
              <Section title="7. Objeto do Conhecimento (BNCC/DCT)" content={pei.content.objetoConhecimentoBNCC} />
            </div>
            <Section title="8. Adaptação do Objeto do Conhecimento" content={pei.content.objetoConhecimentoAdaptado} />
            <Section title="9. Objetivos do PEI" content={pei.content.objetivosPEI} />
            <Section title="10. Metodologias (Recursos e Estratégias)" content={pei.content.metodologias} />
            <div className="break-inside-avoid">
              <Section title="11. Avaliação e Retomada" content={pei.content.avaliacao} />
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t-2 border-slate-200 text-center break-inside-avoid">
            <p className="text-xs text-slate-400 mb-12 uppercase tracking-widest">Assinaturas</p>
            <div className="flex justify-around items-end">
              <div className="w-1/3 border-t border-slate-800 text-xs text-slate-800 pt-2 font-medium">Professor(a) Regente</div>
              <div className="w-1/3 border-t border-slate-800 text-xs text-slate-800 pt-2 font-medium">Coordenação / Responsável</div>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @media print {
          @page { margin: 1.5cm; size: A4; }
          .no-print { display: none !important; }
          body { background: white !important; }
          #root { width: 100%; }
          #printable-pei { 
            box-shadow: none !important; 
            border: none !important; 
            border-radius: 0 !important;
            width: 100% !important;
          }
          /* Garante que o texto preto seja realmente preto na impressão */
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}</style>
    </div>
  );
};

const Section: React.FC<{ title: string; content: string }> = ({ title, content }) => (
  <div className="mb-6">
    <h3 className="text-sm font-bold text-slate-900 bg-slate-100 px-3 py-1 mb-2 uppercase tracking-wide border-l-4 border-slate-800">{title}</h3>
    <div className="text-slate-800 text-sm leading-relaxed whitespace-pre-line text-justify px-2">
      {content}
    </div>
  </div>
);

export default PEIDisplay;
