
import { GoogleGenAI, Type } from "@google/genai";
import { PEIContent } from "../types";

// A chave é injetada pelo Vite durante o build/runtime via process.env.API_KEY
const getAIClient = () => {
  const apiKey = (process.env as any).API_KEY || "";
  return new GoogleGenAI({ apiKey });
};

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
  const ai = getAIClient();
  
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
          historicoClinico: { type: Type.STRING },
          condicaoEspecifica: { type: Type.STRING },
          habilidadesAfinidades: { type: Type.STRING },
          barreiras: { type: Type.STRING },
          habilidadesBNCC: { type: Type.STRING },
          habilidadesAdaptadas: { type: Type.STRING },
          objetoConhecimentoBNCC: { type: Type.STRING },
          objetoConhecimentoAdaptado: { type: Type.STRING },
          objetivosPEI: { type: Type.STRING },
          metodologias: { type: Type.STRING },
          avaliacao: { type: Type.STRING },
        },
        required: [
          'historicoClinico', 'condicaoEspecifica', 'habilidadesAfinidades', 'barreiras',
          'habilidadesBNCC', 'habilidadesAdaptadas', 'objetoConhecimentoBNCC',
          'objetoConhecimentoAdaptado', 'objetivosPEI', 'metodologias', 'avaliacao'
        ]
      }
    }
  });

  const text = response.text || "{}";
  return JSON.parse(text.trim()) as PEIContent;
};
