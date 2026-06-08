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
  console.log("Starting Knockout Simulation (ARG vs BRA) for Match 73...");

  // 1. Find Match 73
  const { data: match, error: mError } = await supabase
    .from('partidos')
    .select('*')
    .eq('numero_partido', 73)
    .single();

  if (mError) throw mError;
  console.log(`Found Match 73 with ID: ${match.id}`);

  // 2. Clean up old events for this match
  console.log("Cleaning up old events...");
  await supabase.from('eventos_partido').delete().eq('partido_id', match.id);

  // Set match teams to ARG and BRA, and reset scores
  console.log("Initializing teams and resetting scoreboard...");
  const { error: resetError } = await supabase.from('partidos')
    .update({
      team1_id: 'ARG',
      team2_id: 'BRA',
      estado: 'en_curso',
      goles_team1: 0,
      goles_team2: 0,
      penales_team1: null,
      penales_team2: null,
      minuto_actual: 0,
      cronometro_corriendo: true,
      hora_inicio_periodo: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
      tiempo_adicional: 0
    })
    .eq('id', match.id);
  if (resetError) throw resetError;

  await sleep(2000);

  // 3. Goal Argentina (1-0) - Messi min 20
  console.log("Minute 20: Messi scores! ARG 1 - 0 BRA...");
  await supabase.from('partidos').update({
    goles_team1: 1,
    minuto_actual: 0,
    hora_inicio_periodo: new Date(Date.now() - 20 * 60 * 1000).toISOString()
  }).eq('id', match.id);
  await supabase.from('eventos_partido').insert({
    partido_id: match.id, tipo: 'gol', minuto: 20, jugador: 'Lionel Messi', equipo_id: 'ARG', detalle: 'Remate colocado de zurda tras pase de De Paul'
  });

  await sleep(2000);

  // 4. Goal Brazil (1-1) - Neymar min 65
  console.log("Minute 65: Neymar scores! ARG 1 - 1 BRA...");
  await supabase.from('partidos').update({
    goles_team2: 1,
    minuto_actual: 45,
    hora_inicio_periodo: new Date(Date.now() - 20 * 60 * 1000).toISOString() // 45 + 20 = 65
  }).eq('id', match.id);
  await supabase.from('eventos_partido').insert({
    partido_id: match.id, tipo: 'gol', minuto: 65, jugador: 'Neymar Jr', equipo_id: 'BRA', detalle: 'Tiro libre al ángulo izquierdo'
  });

  await sleep(2000);

  // 5. End of Normal Time (1-1) - Pause
  console.log("Minute 90: Normal time finished in draw. Transitioning to Extra Time (Pausa)...");
  await supabase.from('partidos').update({
    minuto_actual: 90,
    cronometro_corriendo: false,
    hora_inicio_periodo: null
  }).eq('id', match.id);

  await sleep(3000);

  // 6. Start 1st Extra Time (min 90)
  console.log("Start of First Extra Time...");
  await supabase.from('partidos').update({
    cronometro_corriendo: true,
    minuto_actual: 90,
    hora_inicio_periodo: new Date().toISOString()
  }).eq('id', match.id);

  await sleep(2000);

  // 7. Goal Argentina (2-1) - Lautaro Martínez min 102
  console.log("Minute 102: Lautaro scores! ARG 2 - 1 BRA...");
  await supabase.from('partidos').update({
    goles_team1: 2,
    minuto_actual: 90,
    hora_inicio_periodo: new Date(Date.now() - 12 * 60 * 1000).toISOString() // 90 + 12 = 102
  }).eq('id', match.id);
  await supabase.from('eventos_partido').insert({
    partido_id: match.id, tipo: 'gol', minuto: 102, jugador: 'Lautaro Martínez', equipo_id: 'ARG', detalle: 'Remate dentro del área tras rebote'
  });

  await sleep(2000);

  // 8. End of 1st Extra Time (min 105) - Pause
  console.log("End of First Extra Time. Pausa...");
  await supabase.from('partidos').update({
    minuto_actual: 105,
    cronometro_corriendo: false,
    hora_inicio_periodo: null
  }).eq('id', match.id);

  await sleep(2500);

  // 9. Start 2nd Extra Time (min 105)
  console.log("Start of Second Extra Time...");
  await supabase.from('partidos').update({
    cronometro_corriendo: true,
    minuto_actual: 105,
    hora_inicio_periodo: new Date().toISOString()
  }).eq('id', match.id);

  await sleep(2000);

  // 10. Goal Brazil (2-2) - Vinicius Jr min 115
  console.log("Minute 115: Vinícius Jr scores! ARG 2 - 2 BRA...");
  await supabase.from('partidos').update({
    goles_team2: 2,
    minuto_actual: 105,
    hora_inicio_periodo: new Date(Date.now() - 10 * 60 * 1000).toISOString() // 105 + 10 = 115
  }).eq('id', match.id);
  await supabase.from('eventos_partido').insert({
    partido_id: match.id, tipo: 'gol', minuto: 115, jugador: 'Vinícius Jr', equipo_id: 'BRA', detalle: 'Contraataque veloz y disparo rasante'
  });

  await sleep(2000);

  // 11. End of Extra Time (2-2) - Transitioning to Penalties
  console.log("Minute 120: Extra time finished. Preparing for Penalty Shootout...");
  await supabase.from('partidos').update({
    minuto_actual: 121,
    cronometro_corriendo: false,
    hora_inicio_periodo: null,
    penales_team1: 0,
    penales_team2: 0
  }).eq('id', match.id);

  await sleep(3000);

  // 12. Penalty Kick 1 (ARG) - Messi (Goal)
  console.log("Penalty 1 ARG: Messi... SCORES! (1-0)");
  await supabase.from('partidos').update({ penales_team1: 1 }).eq('id', match.id);
  await supabase.from('eventos_partido').insert({
    partido_id: match.id, tipo: 'penal_anotado', minuto: 121, jugador: 'Lionel Messi', equipo_id: 'ARG', detalle: 'Remate suave al lado derecho'
  });

  await sleep(2000);

  // 13. Penalty Kick 1 (BRA) - Neymar (Goal)
  console.log("Penalty 1 BRA: Neymar... SCORES! (1-1)");
  await supabase.from('partidos').update({ penales_team2: 1 }).eq('id', match.id);
  await supabase.from('eventos_partido').insert({
    partido_id: match.id, tipo: 'penal_anotado', minuto: 122, jugador: 'Neymar Jr', equipo_id: 'BRA', detalle: 'Engaña al portero con amago previo'
  });

  await sleep(2000);

  // 14. Penalty Kick 2 (ARG) - Di María (Missed)
  console.log("Penalty 2 ARG: Di María... MISSED! (1-1)");
  await supabase.from('eventos_partido').insert({
    partido_id: match.id, tipo: 'penal_fallado', minuto: 123, jugador: 'Ángel Di María', equipo_id: 'ARG', detalle: 'El remate pega en el travesaño'
  });

  await sleep(2000);

  // 15. Penalty Kick 2 (BRA) - Richarlison (Goal)
  console.log("Penalty 2 BRA: Richarlison... SCORES! (1-2)");
  await supabase.from('partidos').update({ penales_team2: 2 }).eq('id', match.id);
  await supabase.from('eventos_partido').insert({
    partido_id: match.id, tipo: 'penal_anotado', minuto: 124, jugador: 'Richarlison', equipo_id: 'BRA', detalle: 'Disparo potente al centro'
  });

  await sleep(2000);

  // 16. Penalty Kick 3 (ARG) - Julián Álvarez (Goal)
  console.log("Penalty 3 ARG: Julián Álvarez... SCORES! (2-2)");
  await supabase.from('partidos').update({ penales_team1: 2 }).eq('id', match.id);
  await supabase.from('eventos_partido').insert({
    partido_id: match.id, tipo: 'penal_anotado', minuto: 125, jugador: 'Julián Álvarez', equipo_id: 'ARG', detalle: 'Remate esquinado e inalcanzable'
  });

  await sleep(2000);

  // 17. Penalty Kick 3 (BRA) - Casemiro (Missed)
  console.log("Penalty 3 BRA: Casemiro... SAVED BY MARTINEZ! (2-2)");
  await supabase.from('eventos_partido').insert({
    partido_id: match.id, tipo: 'penal_fallado', minuto: 126, jugador: 'Casemiro', equipo_id: 'BRA', detalle: 'Atajó Dibu Martínez recostándose a la izquierda'
  });

  await sleep(2000);

  // 18. Penalty Kick 4 (ARG) - Alexis Mac Allister (Goal)
  console.log("Penalty 4 ARG: Mac Allister... SCORES! (3-2)");
  await supabase.from('partidos').update({ penales_team1: 3 }).eq('id', match.id);
  await supabase.from('eventos_partido').insert({
    partido_id: match.id, tipo: 'penal_anotado', minuto: 127, jugador: 'Alexis Mac Allister', equipo_id: 'ARG', detalle: 'Remate cruzado raso'
  });

  await sleep(2000);

  // 19. Penalty Kick 4 (BRA) - Marquinhos (Goal)
  console.log("Penalty 4 BRA: Marquinhos... SCORES! (3-3)");
  await supabase.from('partidos').update({ penales_team2: 3 }).eq('id', match.id);
  await supabase.from('eventos_partido').insert({
    partido_id: match.id, tipo: 'penal_anotado', minuto: 128, jugador: 'Marquinhos', equipo_id: 'BRA', detalle: 'Remate sutil al poste derecho'
  });

  await sleep(2000);

  // 20. Penalty Kick 5 (ARG) - Gonzalo Montiel (Goal)
  console.log("Penalty 5 ARG: Montiel... SCORES! (4-3)");
  await supabase.from('partidos').update({ penales_team1: 4 }).eq('id', match.id);
  await supabase.from('eventos_partido').insert({
    partido_id: match.id, tipo: 'penal_anotado', minuto: 129, jugador: 'Gonzalo Montiel', equipo_id: 'ARG', detalle: 'Remate colocado a la derecha'
  });

  await sleep(2000);

  // 21. Penalty Kick 5 (BRA) - Rodrygo (Missed)
  console.log("Penalty 5 BRA: Rodrygo... SAVED BY MARTINEZ! Argentina wins! (4-3)");
  await supabase.from('eventos_partido').insert({
    partido_id: match.id, tipo: 'penal_fallado', minuto: 130, jugador: 'Rodrygo', equipo_id: 'BRA', detalle: 'Disparo a media altura atajado por Dibu Martínez'
  });

  await sleep(2000);

  // 22. Match Finalized
  console.log("Finalizing match... Argentina wins on penalties!");
  const { error: finalError } = await supabase.from('partidos')
    .update({
      estado: 'finalizado',
      minuto_actual: 120,
      cronometro_corriendo: false
    })
    .eq('id', match.id);
  if (finalError) throw finalError;

  console.log("Knockout simulation completed successfully!");
}

run().catch(err => {
  console.error("Error in knockout simulation:", err);
  process.exit(1);
});
