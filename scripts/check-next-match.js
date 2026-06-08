import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

// Read .env file
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

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const now = new Date();
  console.log('Current local time:', now.toString());
  console.log('Current UTC time:', now.toUTCString());

  const { data: matches, error } = await supabase
    .from('partidos')
    .select('*, sedes(*)');

  if (error) throw error;

  matches.sort((a, b) => new Date(a.fecha_inicio_utc).getTime() - new Date(b.fecha_inicio_utc).getTime());

  // Find next match
  const future = matches
    .filter(m => new Date(m.fecha_inicio_utc) > now)
    .sort((a, b) => new Date(a.fecha_inicio_utc).getTime() - new Date(b.fecha_inicio_utc).getTime());

  console.log('Total matches:', matches.length);
  console.log('Future matches count:', future.length);

  if (future.length > 0) {
    const next = future[0];
    console.log('Next Match:', {
      id: next.id,
      num: next.numero_partido,
      ronda: next.ronda,
      team1: next.team1_id,
      team2: next.team2_id,
      estado: next.estado,
      fecha_inicio_utc: next.fecha_inicio_utc,
      goles_team1: next.goles_team1,
      goles_team2: next.goles_team2
    });
  } else {
    console.log('No future matches found!');
    // Let's print the first few matches
    console.log('First 5 matches:');
    matches.slice(0, 5).forEach(m => {
      console.log(`Match #${m.numero_partido}: ${m.team1_id} vs ${m.team2_id} (${m.estado}) at ${m.fecha_inicio_utc}`);
    });
  }
}

run().catch(console.error);
