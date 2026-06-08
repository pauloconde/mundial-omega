-- supabase/migrations/20260608130000_update_event_types_constraint.sql
-- Migration to update check constraint on public.eventos_partido to support penalty shootout events

ALTER TABLE public.eventos_partido DROP CONSTRAINT IF EXISTS eventos_partido_tipo_check;

ALTER TABLE public.eventos_partido ADD CONSTRAINT eventos_partido_tipo_check 
CHECK (tipo IN ('gol', 'tarjeta_amarilla', 'tarjeta_roja', 'falta', 'cambio', 'penal_anotado', 'penal_fallado'));
