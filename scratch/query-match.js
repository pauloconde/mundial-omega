import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

const envPath = path.join(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    env[match[1]] = (match[2] || '').trim().replace(/^['"]|['"]$/g, '');
  }
});

const supabase = createClient(env.PUBLIC_SUPABASE_URL, env.PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  const { data: match, error } = await supabase
    .from('partidos')
    .select('*')
    .eq('numero_partido', 73)
    .single();

  if (error) throw error;
  console.log("Match 73 from DB:", match);
  
  const { data: events, error: eError } = await supabase
    .from('eventos_partido')
    .select('*')
    .eq('partido_id', match.id);
  if (eError) throw eError;
  console.log(`Associated events count: ${events.length}`);
}

run().catch(console.error);
