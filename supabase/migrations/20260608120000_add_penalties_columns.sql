-- supabase/migrations/20260608120000_add_penalties_columns.sql
-- Migration to add penalty shootout scores to partidos table

ALTER TABLE public.partidos 
ADD COLUMN IF NOT EXISTS penales_team1 INT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS penales_team2 INT DEFAULT NULL;
