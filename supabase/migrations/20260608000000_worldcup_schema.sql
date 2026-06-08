-- supabase/migrations/20260608000000_worldcup_schema.sql
-- Migration to set up World Cup database tables

-- 1. Create table equipos
CREATE TABLE IF NOT EXISTS public.equipos (
    codigo_fifa VARCHAR(10) PRIMARY KEY,
    nombre_es VARCHAR(100) NOT NULL,
    nombre_en VARCHAR(100) NOT NULL,
    codigo_bandera VARCHAR(10)
);

-- 2. Create table sedes
CREATE TABLE IF NOT EXISTS public.sedes (
    id VARCHAR(100) PRIMARY KEY,
    nombre_estadio VARCHAR(200) NOT NULL,
    ciudad_es VARCHAR(150) NOT NULL,
    ciudad_en VARCHAR(150) NOT NULL,
    pais_es VARCHAR(100) NOT NULL,
    capacidad INT
);

-- 3. Create table partidos
CREATE TABLE IF NOT EXISTS public.partidos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero_partido INT UNIQUE,
    ronda VARCHAR(100) NOT NULL,
    grupo VARCHAR(50),
    fecha_inicio_utc TIMESTAMP WITH TIME ZONE NOT NULL,
    team1_id VARCHAR(10) REFERENCES public.equipos(codigo_fifa) ON UPDATE CASCADE,
    team2_id VARCHAR(10) REFERENCES public.equipos(codigo_fifa) ON UPDATE CASCADE,
    sede_id VARCHAR(100) REFERENCES public.sedes(id) ON UPDATE CASCADE,
    estado VARCHAR(20) DEFAULT 'programado' CHECK (estado IN ('programado', 'en_curso', 'finalizado')),
    goles_team1 INT DEFAULT 0,
    goles_team2 INT DEFAULT 0,
    minuto_actual INT DEFAULT 0
);

-- 4. Create table eventos_partido
CREATE TABLE IF NOT EXISTS public.eventos_partido (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partido_id UUID NOT NULL REFERENCES public.partidos(id) ON DELETE CASCADE,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('gol', 'tarjeta_amarilla', 'tarjeta_roja', 'falta', 'cambio')),
    minuto INT NOT NULL,
    jugador VARCHAR(200),
    equipo_id VARCHAR(10) REFERENCES public.equipos(codigo_fifa) ON UPDATE CASCADE,
    detalle VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. RLS Policies
-- Enable RLS on all tables
ALTER TABLE public.equipos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sedes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eventos_partido ENABLE ROW LEVEL SECURITY;

-- Enable SELECT for everyone (anon and authenticated)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read of equipos') THEN
        CREATE POLICY "Allow public read of equipos" ON public.equipos FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read of sedes') THEN
        CREATE POLICY "Allow public read of sedes" ON public.sedes FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read of partidos') THEN
        CREATE POLICY "Allow public read of partidos" ON public.partidos FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read of eventos_partido') THEN
        CREATE POLICY "Allow public read of eventos_partido" ON public.eventos_partido FOR SELECT USING (true);
    END IF;
END $$;

-- Enable all operations for authenticated users (admins)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated manage of equipos') THEN
        CREATE POLICY "Allow authenticated manage of equipos" ON public.equipos FOR ALL TO authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated manage of sedes') THEN
        CREATE POLICY "Allow authenticated manage of sedes" ON public.sedes FOR ALL TO authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated manage of partidos') THEN
        CREATE POLICY "Allow authenticated manage of partidos" ON public.partidos FOR ALL TO authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated manage of eventos_partido') THEN
        CREATE POLICY "Allow authenticated manage of eventos_partido" ON public.eventos_partido FOR ALL TO authenticated USING (true);
    END IF;
END $$;

-- 6. Add to Realtime publication
-- Ensure publication exists and tables are added to it
DO $$
BEGIN
    -- Create publication if not exists
    IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        CREATE PUBLICATION supabase_realtime;
    END IF;

    -- Add table partidos to publication if not already there
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'partidos'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.partidos;
    END IF;
    
    -- Add table eventos_partido to publication if not already there
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'eventos_partido'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.eventos_partido;
    END IF;
END $$;
