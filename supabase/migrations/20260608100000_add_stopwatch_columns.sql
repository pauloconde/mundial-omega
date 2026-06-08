-- supabase/migrations/20260608100000_add_stopwatch_columns.sql
-- Migration to add stopwatch controls and added time to partidos

ALTER TABLE public.partidos 
ADD COLUMN IF NOT EXISTS hora_inicio_periodo TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS cronometro_corriendo BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS tiempo_adicional INT DEFAULT 0;
