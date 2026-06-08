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

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  console.log("Simulating Match 1 (MEX vs RSA)...");

  // Find Match 1
  const { data: match, error: mError } = await supabase
    .from('partidos')
    .select('*')
    .eq('numero_partido', 1)
    .single();

  if (mError) throw mError;
  console.log(`Found match with ID: ${match.id}. Resetting score and setting to 'en_curso'...`);

  // Clear any old events for this match
  const { error: dError } = await supabase.from('eventos_partido').delete().eq('partido_id', match.id);
  if (dError) throw dError;

  // 1. Start Match (Minute 1, Score 0-0)
  const { error: u1Error } = await supabase.from('partidos')
    .update({ 
      estado: 'en_curso', 
      minuto_actual: 0, 
      goles_team1: 0, 
      goles_team2: 0,
      cronometro_corriendo: true,
      hora_inicio_periodo: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
      tiempo_adicional: 0
    })
    .eq('id', match.id);
  if (u1Error) throw u1Error;
  console.log("Match started. Live indicator active on website.");

  await sleep(1500);

  // 2. Foul by RSA (Minute 5)
  console.log("Simulating Minute 5: Foul by RSA...");
  await supabase.from('partidos').update({ minuto_actual: 0, hora_inicio_periodo: new Date(Date.now() - 5 * 60 * 1000).toISOString() }).eq('id', match.id);
  await supabase.from('eventos_partido').insert({
    partido_id: match.id, tipo: 'falta', minuto: 5, jugador: 'Percy Tau', equipo_id: 'RSA', detalle: 'Falta fuerte a media cancha'
  });

  await sleep(1500);

  // 3. Foul by MEX (Minute 12)
  console.log("Simulating Minute 12: Foul by MEX...");
  await supabase.from('partidos').update({ minuto_actual: 0, hora_inicio_periodo: new Date(Date.now() - 12 * 60 * 1000).toISOString() }).eq('id', match.id);
  await supabase.from('eventos_partido').insert({
    partido_id: match.id, tipo: 'falta', minuto: 12, jugador: 'César Montes', equipo_id: 'MEX', detalle: 'Falta en ataque'
  });

  await sleep(1500);

  // 4. Yellow Card for MEX (Minute 15)
  console.log("Simulating Minute 15: Yellow Card MEX...");
  await supabase.from('partidos').update({ minuto_actual: 0, hora_inicio_periodo: new Date(Date.now() - 15 * 60 * 1000).toISOString() }).eq('id', match.id);
  await supabase.from('eventos_partido').insert({
    partido_id: match.id, tipo: 'tarjeta_amarilla', minuto: 15, jugador: 'Edson Álvarez', equipo_id: 'MEX', detalle: 'Falta táctica en medio campo'
  });

  await sleep(1500);

  // 5. Substitution MEX (Minute 22)
  console.log("Simulating Minute 22: Substitution MEX...");
  await supabase.from('partidos').update({ minuto_actual: 0, hora_inicio_periodo: new Date(Date.now() - 22 * 60 * 1000).toISOString() }).eq('id', match.id);
  await supabase.from('eventos_partido').insert({
    partido_id: match.id, tipo: 'cambio', minuto: 22, jugador: 'Entra: Uriel Antuna / Sale: Hirving Lozano', equipo_id: 'MEX', detalle: 'Cambio por lesión'
  });

  await sleep(1500);

  // 6. Yellow Card RSA (Minute 28)
  console.log("Simulating Minute 28: Yellow Card RSA...");
  await supabase.from('partidos').update({ minuto_actual: 0, hora_inicio_periodo: new Date(Date.now() - 28 * 60 * 1000).toISOString() }).eq('id', match.id);
  await supabase.from('eventos_partido').insert({
    partido_id: match.id, tipo: 'tarjeta_amarilla', minuto: 28, jugador: 'Teboho Mokoena', equipo_id: 'RSA', detalle: 'Reclamos airados al árbitro'
  });

  await sleep(1500);

  // 7. Goal for MEX (Minute 34, Score 1-0)
  console.log("Simulating Minute 34: Goal MEX! Score: 1-0...");
  await supabase.from('partidos').update({ minuto_actual: 0, goles_team1: 1, hora_inicio_periodo: new Date(Date.now() - 34 * 60 * 1000).toISOString() }).eq('id', match.id);
  await supabase.from('eventos_partido').insert({
    partido_id: match.id, tipo: 'gol', minuto: 34, jugador: 'Santiago Giménez', equipo_id: 'MEX', detalle: 'Remate potente tras pase de Antuna'
  });

  await sleep(1500);

  // 8. Foul by RSA (Minute 42)
  console.log("Simulating Minute 42: Foul by RSA...");
  await supabase.from('partidos').update({ minuto_actual: 0, hora_inicio_periodo: new Date(Date.now() - 42 * 60 * 1000).toISOString() }).eq('id', match.id);
  await supabase.from('eventos_partido').insert({
    partido_id: match.id, tipo: 'falta', minuto: 42, jugador: 'Aubrey Modiba', equipo_id: 'RSA', detalle: 'Empujón por detrás'
  });

  await sleep(1500);

  // 9. Added Time 1T (Minute 45, 3 Mins Added)
  console.log("Simulating Minute 45: Added Time 1T (+3)...");
  await supabase.from('partidos').update({ minuto_actual: 45, tiempo_adicional: 3, hora_inicio_periodo: new Date(Date.now() - 45 * 60 * 1000).toISOString() }).eq('id', match.id);

  await sleep(1500);

  // 10. Pause / Entretiempo (Minute 45)
  console.log("Simulating Entretiempo (Pausa)...");
  await supabase.from('partidos').update({ minuto_actual: 45, cronometro_corriendo: false, hora_inicio_periodo: null, tiempo_adicional: 0 }).eq('id', match.id);

  await sleep(3000);

  // 11. Start 2T (Minute 45, Score 1-0)
  console.log("Simulating Minute 45: Second Half Starts...");
  await supabase.from('partidos').update({ minuto_actual: 45, cronometro_corriendo: true, hora_inicio_periodo: new Date(Date.now() - 0 * 60 * 1000).toISOString() }).eq('id', match.id);

  await sleep(1500);

  // 12. Yellow Card MEX (Minute 48)
  console.log("Simulating Minute 48: Yellow Card MEX...");
  await supabase.from('partidos').update({ minuto_actual: 45, hora_inicio_periodo: new Date(Date.now() - 3 * 60 * 1000).toISOString() }).eq('id', match.id);
  await supabase.from('eventos_partido').insert({
    partido_id: match.id, tipo: 'tarjeta_amarilla', minuto: 48, jugador: 'César Montes', equipo_id: 'MEX', detalle: 'Zancadilla'
  });

  await sleep(1500);

  // 13. Substitution RSA (Minute 55)
  console.log("Simulating Minute 55: Substitution for RSA...");
  await supabase.from('partidos').update({ minuto_actual: 45, hora_inicio_periodo: new Date(Date.now() - 10 * 60 * 1000).toISOString() }).eq('id', match.id);
  await supabase.from('eventos_partido').insert({
    partido_id: match.id, tipo: 'cambio', minuto: 55, jugador: 'Entra: John Doe / Sale: Jane Smith', equipo_id: 'RSA', detalle: 'Cambio ofensivo'
  });

  await sleep(1500);

  // 14. Foul by MEX (Minute 62)
  console.log("Simulating Minute 62: Foul by MEX...");
  await supabase.from('partidos').update({ minuto_actual: 45, hora_inicio_periodo: new Date(Date.now() - 17 * 60 * 1000).toISOString() }).eq('id', match.id);
  await supabase.from('eventos_partido').insert({
    partido_id: match.id, tipo: 'falta', minuto: 62, jugador: 'Luis Chávez', equipo_id: 'MEX', detalle: 'Corte de juego con la mano'
  });

  await sleep(1500);

  // 15. Substitution MEX (Minute 70)
  console.log("Simulating Minute 70: Substitution MEX...");
  await supabase.from('partidos').update({ minuto_actual: 45, hora_inicio_periodo: new Date(Date.now() - 25 * 60 * 1000).toISOString() }).eq('id', match.id);
  await supabase.from('eventos_partido').insert({
    partido_id: match.id, tipo: 'cambio', minuto: 70, jugador: 'Entra: Henry Martín / Sale: Santiago Giménez', equipo_id: 'MEX', detalle: 'Sustitución hombre por hombre'
  });

  await sleep(1500);

  // 16. Red Card RSA (Minute 75)
  console.log("Simulating Minute 75: Direct Red Card for RSA...");
  await supabase.from('partidos').update({ minuto_actual: 45, hora_inicio_periodo: new Date(Date.now() - 30 * 60 * 1000).toISOString() }).eq('id', match.id);
  await supabase.from('eventos_partido').insert({
    partido_id: match.id, tipo: 'tarjeta_roja', minuto: 75, jugador: 'Percy Tau', equipo_id: 'RSA', detalle: 'Entrada desproporcionada por detrás'
  });

  await sleep(1500);

  // 17. Goal for RSA (Minute 81, Score 1-1)
  console.log("Simulating Minute 81: Goal RSA! Score: 1-1...");
  await supabase.from('partidos').update({ minuto_actual: 45, goles_team2: 1, hora_inicio_periodo: new Date(Date.now() - 36 * 60 * 1000).toISOString() }).eq('id', match.id);
  await supabase.from('eventos_partido').insert({
    partido_id: match.id, tipo: 'gol', minuto: 81, jugador: 'John Doe', equipo_id: 'RSA', detalle: 'Remate de cabeza en tiro de esquina'
  });

  await sleep(1500);

  // 18. Yellow Card RSA (Minute 85)
  console.log("Simulating Minute 85: Yellow Card RSA...");
  await supabase.from('partidos').update({ minuto_actual: 45, hora_inicio_periodo: new Date(Date.now() - 40 * 60 * 1000).toISOString() }).eq('id', match.id);
  await supabase.from('eventos_partido').insert({
    partido_id: match.id, tipo: 'tarjeta_amarilla', minuto: 85, jugador: 'Ronwen Williams', equipo_id: 'RSA', detalle: 'Hacer tiempo'
  });

  await sleep(1500);

  // 19. Goal for MEX (Minute 88, Score 2-1)
  console.log("Simulating Minute 88: Goal MEX! Score: 2-1...");
  await supabase.from('partidos').update({ minuto_actual: 45, goles_team1: 2, hora_inicio_periodo: new Date(Date.now() - 43 * 60 * 1000).toISOString() }).eq('id', match.id);
  await supabase.from('eventos_partido').insert({
    partido_id: match.id, tipo: 'gol', minuto: 88, jugador: 'Uriel Antuna', equipo_id: 'MEX', detalle: 'Disparo cruzado de pierna derecha'
  });

  await sleep(1500);

  // 20. End Match (Minute 90, Finished, Score 2-1)
  console.log("Simulating Minute 90: Match finished! Score: 2-1...");
  const { error: u6Error } = await supabase.from('partidos')
    .update({ 
      estado: 'finalizado', 
      minuto_actual: 90,
      cronometro_corriendo: false,
      hora_inicio_periodo: null
    })
    .eq('id', match.id);
  if (u6Error) throw u6Error;

  console.log("Match simulation completed successfully!");
}

run().catch(err => {
  console.error("Error in simulation:", err);
  process.exit(1);
});
