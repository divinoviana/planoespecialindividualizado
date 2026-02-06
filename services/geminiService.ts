
import { GoogleGenAI, Type } from "@google/genai";
import { PEIContent } from "../types";

const getAIClient = () => {
  // @ts-ignore
  const apiKey = process.env.API_KEY || "";
  if (!apiKey) {
    console.error("ERRO: API_KEY não configurada no ambiente.");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Limpa a resposta da IA caso ela venha envolvida em blocos de markdown ```json ... ```
 */
const cleanJsonResponse = (text: string): string => {
  let cleaned = text.trim();
  // Remove blocos de código markdown se existirem
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```json\n?/, '').replace(/```$/, '').trim();
  }
  return cleaned;
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
    Você é um especialista em Educação Especial e Inclusiva no Brasil, com profundo conhecimento da BNCC e do DCT (Tocantins).
    
    INSTRUÇÃO: 
    ${formData.pdfBase64 ? "Analise o PDF em anexo (Laudo) para extrair dados clínicos e pedagógicos." : "Gere o plano com base nos dados fornecidos."}
    Crie um Plano de Ensino Individualizado (PEI) pedagógico, empático e técnico.

    ESTUDANTE: ${formData.studentName}
    TURMA: ${formData.className}
    DISCIPLINA: ${formData.subject}
    BIMESTRE: ${formData.period}
    PROFESSOR: ${formData.teacher}
    CONTEXTO EXTRA: ${formData.extraContext || 'Nenhum'}

    IMPORTANTE: Retorne APENAS o JSON puro, sem explicações adicionais.
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

  try {
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

    const rawText = response.text || "";
    const cleanedJson = cleanJsonResponse(rawText);
    
    try {
      return JSON.parse(cleanedJson) as PEIContent;
    } catch (parseError) {
      console.error("Erro ao parsear JSON da IA:", rawText);
      throw new Error("A IA retornou um formato inválido.");
    }
  } catch (apiError) {
    console.error("Erro na chamada da API Gemini:", apiError);
    throw apiError;
  }
};
