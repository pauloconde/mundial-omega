-- supabase/migrations/20260608110000_enable_replica_identity_full.sql
-- Migration to enable REPLICA IDENTITY FULL on eventos_partido to allow
-- Supabase Realtime client-side filters (like partido_id=eq.X) to receive DELETE events.

ALTER TABLE public.eventos_partido REPLICA IDENTITY FULL;
