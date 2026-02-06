
export interface PEIContent {
  historicoClinico: string;
  condicaoEspecifica: string;
  habilidadesAfinidades: string;
  barreiras: string;
  habilidadesBNCC: string;
  habilidadesAdaptadas: string;
  objetoConhecimentoBNCC: string;
  objetoConhecimentoAdaptado: string;
  objetivosPEI: string;
  metodologias: string;
  avaliacao: string;
}

export interface PEIData {
  id?: string;
  created_at?: string;
  student_name: string;
  class_name: string;
  subject: string;
  period: string;
  frequency: string;
  teacher_regent: string;
  collaboration_team: string;
  execution_period: string;
  content: PEIContent;
}

export type ViewState = 'LIST' | 'FORM' | 'VIEW';
