
import React, { useState, useRef } from 'react';
import { Sparkles, Loader2, Save, ArrowLeft, FileText, X, Upload } from 'lucide-react';
import { generatePEIContent } from '../services/geminiService';
import { PEIContent, PEIData } from '../types';

interface PEIFormProps {
  onSave: (data: PEIData) => Promise<void>;
  onCancel: () => void;
}

const PEIForm: React.FC<PEIFormProps> = ({ onSave, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    studentName: '',
    className: '',
    subject: '',
    period: '',
    frequency: '',
    teacher: '',
    team: '',
    executionPeriod: '',
    extraContext: ''
  });
  
  const [generatedContent, setGeneratedContent] = useState<PEIContent | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result?.toString().split(',')[1];
        if (base64String) setPdfBase64(base64String);
      };
      reader.readAsDataURL(selectedFile);
    } else if (selectedFile) {
      alert('Por favor, selecione apenas arquivos PDF.');
    }
  };

  const removeFile = () => {
    setFile(null);
    setPdfBase64(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const content = await generatePEIContent({
        ...formData,
        pdfBase64: pdfBase64 || undefined
      });
      setGeneratedContent(content);
    } catch (error) {
      console.error('Erro ao gerar PEI:', error);
      alert('Houve um erro ao gerar o PEI. Verifique sua conexão ou tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSave = async () => {
    if (!generatedContent) return;
    setLoading(true);
    try {
      await onSave({
        student_name: formData.studentName,
        class_name: formData.className,
        subject: formData.subject,
        period: formData.period,
        frequency: formData.frequency,
        teacher_regent: formData.teacher,
        collaboration_team: formData.team,
        execution_period: formData.executionPeriod,
        content: generatedContent
      });
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar o PEI no banco de dados.');
    } finally {
      setLoading(false);
    }
  };

  if (generatedContent) {
    return (
      <div className="max-w-4xl mx-auto p-4 animate-in fade-in duration-500">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => setGeneratedContent(null)} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Voltar à Edição
          </button>
          <button 
            onClick={handleFinalSave}
            disabled={loading}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium shadow-lg shadow-green-200 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Salvar PEI Finalizado
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-indigo-600 px-8 py-6 text-white">
            <h2 className="text-2xl font-bold">PEI Gerado: {formData.studentName}</h2>
            <p className="text-indigo-100 opacity-90 mt-1">{formData.subject} - {formData.className}</p>
          </div>
          
          <div className="p-8 space-y-8">
            <PEISection title="1⁰ - Histórico Clínico e Familiar" content={generatedContent.historicoClinico} />
            <PEISection title="2⁰ - Condição Específica" content={generatedContent.condicaoEspecifica} />
            <PEISection title="3⁰ - Conhecimentos, Habilidades e Afinidades" content={generatedContent.habilidadesAfinidades} />
            <PEISection title="4⁰ - Principais Barreiras" content={generatedContent.barreiras} />
            <PEISection title="5⁰ - Habilidades da Turma (BNCC/DCT)" content={generatedContent.habilidadesBNCC} />
            <PEISection title="6⁰ - Adaptação e Flexibilização de Habilidades" content={generatedContent.habilidadesAdaptadas} />
            <PEISection title="7⁰ - Objeto do Conhecimento (BNCC/DCT)" content={generatedContent.objetoConhecimentoBNCC} />
            <PEISection title="8⁰ - Adaptação do Objeto do Conhecimento" content={generatedContent.objetoConhecimentoAdaptado} />
            <PEISection title="9⁰ - Objetivos do PEI" content={generatedContent.objetivosPEI} />
            <PEISection title="10⁰ - Metodologias (Recursos e Estratégias)" content={generatedContent.metodologias} />
            <PEISection title="11⁰ - Avaliação e Retomada" content={generatedContent.avaliacao} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-indigo-600 px-8 py-6 text-white">
          <h2 className="text-2xl font-bold">Criar Novo PEI</h2>
          <p className="text-indigo-100 opacity-90">Preencha os dados e anexe o laudo para que a IA gere o plano pedagógico.</p>
        </div>

        <form onSubmit={handleGenerate} className="p-8 space-y-6">
          <div className="bg-indigo-50 border-2 border-dashed border-indigo-200 rounded-2xl p-6 transition-all hover:bg-indigo-100/50">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="bg-white p-3 rounded-full shadow-sm mb-3">
                <FileText className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="font-bold text-slate-800">Anexar Laudo do Estudante (PDF)</h3>
              <p className="text-sm text-slate-500 mb-4">A IA analisará o PDF para preencher os dados clínicos e pedagógicos.</p>
              
              {!file ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 bg-white text-indigo-600 border border-indigo-200 px-4 py-2 rounded-lg font-medium hover:bg-indigo-50 transition-all shadow-sm"
                >
                  <Upload className="w-4 h-4" /> Selecionar Arquivo PDF
                </button>
              ) : (
                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg border border-indigo-200 shadow-sm">
                  <span className="text-sm font-medium text-slate-700 truncate max-w-[200px]">{file.name}</span>
                  <button type="button" onClick={removeFile} className="p-1 hover:bg-red-50 rounded-full text-red-500 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="application/pdf" 
                className="hidden" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Nome do Estudante" name="studentName" value={formData.studentName} onChange={handleInputChange} placeholder="Ex: João da Silva" required />
            <FormField label="Turma" name="className" value={formData.className} onChange={handleInputChange} placeholder="Ex: 5º Ano A" required />
            <FormField label="Componente Curricular" name="subject" value={formData.subject} onChange={handleInputChange} placeholder="Ex: Matemática" required />
            <FormField label="Período" name="period" value={formData.period} onChange={handleInputChange} placeholder="Ex: 1º Bimestre" required />
            <FormField label="Periodicidade" name="frequency" value={formData.frequency} onChange={handleInputChange} placeholder="Ex: Semanal" required />
            <FormField label="Professor Regente" name="teacher" value={formData.teacher} onChange={handleInputChange} placeholder="Nome do Professor" required />
            <FormField label="Equipe de Colaboração" name="team" value={formData.team} onChange={handleInputChange} placeholder="Ex: Coordenação, AEE, Psicóloga" required />
            <FormField label="Período de Execução" name="executionPeriod" value={formData.executionPeriod} onChange={handleInputChange} placeholder="Ex: 01/02 a 30/04" required />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Observações Adicionais (Contexto do Aluno)</label>
            <textarea
              name="extraContext"
              value={formData.extraContext}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none resize-none"
              placeholder="Descreva particularidades do aluno que você gostaria que a IA considerasse (Interesses, dificuldades pontuais, etc.)"
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 text-slate-600 font-medium hover:text-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Gerando PEI...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Gerar PEI com IA
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const FormField: React.FC<{
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required?: boolean;
}> = ({ label, name, value, onChange, placeholder, required }) => (
  <div>
    <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
    />
  </div>
);

const PEISection: React.FC<{ title: string; content: string }> = ({ title, content }) => (
  <div className="group">
    <h3 className="text-lg font-bold text-slate-800 mb-3 group-hover:text-indigo-600 transition-colors">{title}</h3>
    <div className="text-slate-600 leading-relaxed whitespace-pre-line p-4 bg-slate-50 rounded-xl border border-slate-100">
      {content}
    </div>
  </div>
);

export default PEIForm;
