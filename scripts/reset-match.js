import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

// Leer archivo .env
const envPath = path.join(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    env[match[1]] = (match[2] || '').trim().replace(/^['"]|['"]$/g, '');
  }
});

const supabaseUrl = env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const matchNum = parseInt(process.argv[2] || '1', 10);
  console.log(`Resetting Match ${matchNum} to scheduled state...`);

  // Buscar el partido
  const { data: match, error: mError } = await supabase
    .from('partidos')
    .select('*')
    .eq('numero_partido', matchNum)
    .single();

  if (mError) throw mError;

  // Borrar eventos asociados
  const { error: dError } = await supabase.from('eventos_partido').delete().eq('partido_id', match.id);
  if (dError) throw dError;

  // Re-establecer estado programado
  const updateFields = { 
    estado: 'programado', 
    minuto_actual: 0, 
    goles_team1: 0, 
    goles_team2: 0,
    penales_team1: null,
    penales_team2: null,
    cronometro_corriendo: false,
    hora_inicio_periodo: null,
    tiempo_adicional: 0
  };

  if (matchNum === 73) {
    updateFields.team1_id = '2A';
    updateFields.team2_id = '2B';
  }

  const { error: uError } = await supabase.from('partidos')
    .update(updateFields)
    .eq('id', match.id);
  if (uError) throw uError;

  console.log(`Match ${matchNum} successfully reset!`);
}

run().catch(err => {
  console.error("Error in reset:", err);
  process.exit(1);
});
