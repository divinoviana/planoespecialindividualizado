
import { GoogleGenAI, Type } from "@google/genai";
import { PEIContent } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generatePEIContent = async (formData: {
  studentName: string;
  className: string;
  subject: string;
  period: string;
  frequency: string;
  teacher: string;
  team: string;
  executionPeriod: string;
  extraContext?: string;
  pdfBase64?: string;
}): Promise<PEIContent> => {
  const textPrompt = `
    Você é um especialista em Educação Especial e Inclusiva no Brasil, com profundo conhecimento da BNCC (Base Nacional Comum Curricular) e do DCT (Documento Curricular do Território do Tocantins).
    
    INSTRUÇÃO PRINCIPAL: 
    ${formData.pdfBase64 ? "Analise cuidadosamente o LAUDO MÉDICO/PEDAGÓGICO em anexo (PDF) para extrair informações clínicas, diagnósticos e necessidades específicas do estudante." : ""}
    Use os dados abaixo e o contexto do laudo para gerar um Plano de Ensino Individualizado (PEI) completo.

    DADOS DO ESTUDANTE:
    Nome: ${formData.studentName}
    Turma: ${formData.className}
    Componente Curricular: ${formData.subject}
    Período: ${formData.period}
    Periodicidade: ${formData.frequency}
    Professor Regente: ${formData.teacher}
    Equipe de Colaboração: ${formData.team}
    Período de Execução: ${formData.executionPeriod}
    Contexto Adicional: ${formData.extraContext || 'Nenhum contexto adicional fornecido.'}

    O PEI deve ser pedagógico, empático e focado na superação de barreiras, respeitando as leis de inclusão brasileiras.
  `;

  const parts: any[] = [{ text: textPrompt }];

  if (formData.pdfBase64) {
    parts.push({
      inlineData: {
        mimeType: 'application/pdf',
        data: formData.pdfBase64
      }
    });
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          historicoClinico: { type: Type.STRING, description: '1⁰ - Breve histórico clínico e familiar do estudante (Baseado no laudo se disponível)' },
          condicaoEspecifica: { type: Type.STRING, description: '2⁰ - Breve descrição da condição específica do estudante (Diagnóstico e implicações)' },
          habilidadesAfinidades: { type: Type.STRING, description: '3⁰ - Conhecimentos, habilidades e afinidades do estudante' },
          barreiras: { type: Type.STRING, description: '4⁰ - Principais barreiras a serem superadas pelo estudante' },
          habilidadesBNCC: { type: Type.STRING, description: '5⁰ - Habilidades da turma (BNCC/DCT)' },
          habilidadesAdaptadas: { type: Type.STRING, description: '6⁰ - Habilidades da turma (Adaptação e Flexibilização)' },
          objetoConhecimentoBNCC: { type: Type.STRING, description: '7⁰ - Objeto do Conhecimento (BNCC/DCT)' },
          objetoConhecimentoAdaptado: { type: Type.STRING, description: '8⁰ - Objeto do Conhecimento (Adaptação e Flexibilização)' },
          objetivosPEI: { type: Type.STRING, description: '9⁰ - Objetivos do PEI para o estudante' },
          metodologias: { type: Type.STRING, description: '10⁰ - Metodologias (Recursos e Estratégias utilizadas)' },
          avaliacao: { type: Type.STRING, description: '11⁰ - Avaliação (ponto de partida, avanços e retomadas)' },
        },
        required: [
          'historicoClinico', 'condicaoEspecifica', 'habilidadesAfinidades', 'barreiras',
          'habilidadesBNCC', 'habilidadesAdaptadas', 'objetoConhecimentoBNCC',
          'objetoConhecimentoAdaptado', 'objetivosPEI', 'metodologias', 'avaliacao'
        ]
      }
    }
  });

  return JSON.parse(response.text.trim()) as PEIContent;
};
