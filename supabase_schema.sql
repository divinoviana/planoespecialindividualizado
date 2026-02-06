
-- Tabela para armazenar os Planos de Ensino Individualizados (PEI)
CREATE TABLE IF NOT EXISTS peis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  -- Campos de Identificação
  student_name TEXT NOT NULL,
  class_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  period TEXT NOT NULL,
  frequency TEXT NOT NULL,
  teacher_regent TEXT NOT NULL,
  collaboration_team TEXT NOT NULL,
  execution_period TEXT NOT NULL,
  
  -- Conteúdo do PEI (os 11 blocos em formato JSON)
  content JSONB NOT NULL
);

-- Ativar Row Level Security (RLS)
ALTER TABLE peis ENABLE ROW LEVEL SECURITY;

-- Como o app usa uma chave pública e é focado em facilidade de uso para o protótipo:
-- Criar política que permite anonimato total (leitura/escrita)
-- Em produção, isso seria restrito ao auth.uid()
CREATE POLICY "Permitir acesso total público" ON peis
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Função para atualizar o timestamp de updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_peis_updated_at BEFORE UPDATE ON peis FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
