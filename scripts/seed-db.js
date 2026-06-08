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

const TEAM_ES = {
  'ALG': 'Argelia', 'ARG': 'Argentina', 'AUS': 'Australia', 'AUT': 'Austria', 'BEL': 'Bélgica', 'BIH': 'Bosnia y Herzegovina',
  'BRA': 'Brasil', 'CAN': 'Canadá', 'CIV': 'Costa de Marfil', 'COD': 'Rep. Dem. del Congo', 'COL': 'Colombia', 'CPV': 'Cabo Verde',
  'CRO': 'Croacia', 'CUR': 'Curazao', 'CZE': 'República Checa', 'ECU': 'Ecuador', 'EGY': 'Egipto', 'ENG': 'Inglaterra',
  'ESP': 'España', 'FRA': 'Francia', 'GER': 'Alemania', 'GHA': 'Ghana', 'HAI': 'Haití', 'IRN': 'Irán', 'IRQ': 'Irak',
  'JOR': 'Jordania', 'JPN': 'Japón', 'KOR': 'Corea del Sur', 'KSA': 'Arabia Saudita', 'MAR': 'Marruecos', 'MEX': 'México',
  'NED': 'Países Bajos', 'NOR': 'Noruega', 'NZL': 'Nueva Zelanda', 'PAN': 'Panamá', 'PAR': 'Paraguay', 'POR': 'Portugal',
  'QAT': 'Catar', 'RSA': 'Sudáfrica', 'SCO': 'Escocia', 'SEN': 'Senegal', 'SUI': 'Suiza', 'SWE': 'Suecia', 'TUN': 'Túnez',
  'TUR': 'Turquía', 'URU': 'Uruguay', 'USA': 'EE. UU.', 'UZB': 'Uzbekistán'
};

const VENUES = [
  { name: 'Estadio Azteca',          cityEn: 'Ciudad de México',                          cityEs: 'Ciudad de México',                      countryEn: 'Mexico',  countryEs: 'México',        capacity: '87,523', imageKey: 'mexico-city' },
  { name: 'Estadio Akron',           cityEn: 'Guadalajara',                               cityEs: 'Guadalajara',                           countryEn: 'Mexico',  countryEs: 'México',        capacity: '49,850', imageKey: 'guadalajara' },
  { name: 'Estadio BBVA',            cityEn: 'Monterrey',                                 cityEs: 'Monterrey',                             countryEn: 'Mexico',  countryEs: 'México',        capacity: '53,500', imageKey: 'monterrey' },
  { name: 'SoFi Stadium',            cityEn: 'Los Angeles',                               cityEs: 'Los Ángeles',                           countryEn: 'USA',     countryEs: 'EE. UU.',       capacity: '70,240', imageKey: 'los-angeles' },
  { name: 'AT&T Stadium',            cityEn: 'Dallas',                                    cityEs: 'Dallas',                                countryEn: 'USA',     countryEs: 'EE. UU.',       capacity: '80,000', imageKey: 'dallas' },
  { name: 'MetLife Stadium',         cityEn: 'Nueva York/Nueva Jersey',                   cityEs: 'Nueva York/Nueva Jersey',               countryEn: 'USA',     countryEs: 'EE. UU.',       capacity: '82,500', imageKey: 'new-york' },
  { name: 'Hard Rock Stadium',       cityEn: 'Miami',                                     cityEs: 'Miami',                                 countryEn: 'USA',     countryEs: 'EE. UU.',       capacity: '64,767', imageKey: 'miami' },
  { name: "Levi's Stadium",          cityEn: 'Área de la Bahía de San Francisco',         cityEs: 'Área de la Bahía de San Francisco',     countryEn: 'USA',     countryEs: 'EE. UU.',       capacity: '68,500', imageKey: 'san-francisco' },
  { name: 'NRG Stadium',             cityEn: 'Houston',                                   cityEs: 'Houston',                               countryEn: 'USA',     countryEs: 'EE. UU.',       capacity: '72,220', imageKey: 'houston' },
  { name: 'Lincoln Financial Field', cityEn: 'Philadelphia',                              cityEs: 'Filadelfia',                            countryEn: 'USA',     countryEs: 'EE. UU.',       capacity: '69,796', imageKey: 'philadelphia' },
  { name: 'Gillette Stadium',        cityEn: 'Boston',                                    cityEs: 'Boston',                                countryEn: 'USA',     countryEs: 'EE. UU.',       capacity: '65,878', imageKey: 'boston' },
  { name: 'Mercedes-Benz Stadium',   cityEn: 'Atlanta',                                   cityEs: 'Atlanta',                               countryEn: 'USA',     countryEs: 'EE. UU.',       capacity: '71,000', imageKey: 'atlanta' },
  { name: 'Lumen Field',             cityEn: 'Seattle',                                   cityEs: 'Seattle',                               countryEn: 'USA',     countryEs: 'EE. UU.',       capacity: '68,740', imageKey: 'seattle' },
  { name: 'Arrowhead Stadium',       cityEn: 'Kansas City',                               cityEs: 'Kansas City',                           countryEn: 'USA',     countryEs: 'EE. UU.',       capacity: '76,416', imageKey: 'kansas-city' },
  { name: 'BC Place',                cityEn: 'Vancouver',                                 cityEs: 'Vancouver',                             countryEn: 'Canada',  countryEs: 'Canadá',        capacity: '54,500', imageKey: 'vancouver' },
  { name: 'BMO Field',               cityEn: 'Toronto',                                   cityEs: 'Toronto',                               countryEn: 'Canada',  countryEs: 'Canadá',        capacity: '45,736', imageKey: 'toronto' },
];

const venueMap = {
  "Ciudad de México": "mexico-city",
  "Guadalajara": "guadalajara",
  "Monterrey": "monterrey",
  "Los Ángeles": "los-angeles",
  "Los Angeles": "los-angeles",
  "Dallas": "dallas",
  "Nueva York / Nueva Jersey": "new-york",
  "Nueva York/Nueva Jersey": "new-york",
  "Miami": "miami",
  "San Francisco Bay Area": "san-francisco",
  "Área de la Bahía de San Francisco": "san-francisco",
  "Houston": "houston",
  "Filadelfia": "philadelphia",
  "Philadelphia": "philadelphia",
  "Boston": "boston",
  "Atlanta": "atlanta",
  "Seattle": "seattle",
  "Kansas City": "kansas-city",
  "Vancouver": "vancouver",
  "Toronto": "toronto"
};

function translateTeam(name) {
  if (TEAM_ES[name]) return TEAM_ES[name];
  if (/^Winner\s+(?:Match\s+)?(\d+)$/i.test(name)) {
    return name.replace(/^Winner\s+(?:Match\s+)?(\d+)$/i, 'Ganador $1');
  }
  if (/^Loser\s+(?:Match\s+)?(\d+)$/i.test(name)) {
    return name.replace(/^Loser\s+(?:Match\s+)?(\d+)$/i, 'Perdedor $1');
  }
  if (/^W(\d+)$/i.test(name)) {
    return name.replace(/^W(\d+)$/i, 'G$1');
  }
  if (/^L(\d+)$/i.test(name)) {
    return name.replace(/^L(\d+)$/i, 'P$1');
  }
  if (/^RU(\d+)$/i.test(name)) {
    return name.replace(/^RU(\d+)$/i, 'P$1');
  }
  return name;
}

function parseMatchDate(dateStr, timeStr) {
  if (!timeStr) {
    return new Date(dateStr);
  }
  const [hStr, mStr] = timeStr.split(':');
  if (!hStr || !mStr) return new Date(`${dateStr}T12:00:00Z`);
  const etHour = parseInt(hStr, 10);
  const min  = parseInt(mStr, 10);
  const utcHour = etHour + 4; // Eastern Daylight Time (EDT) is UTC-4 in summer
  return new Date(Date.UTC(
    parseInt(dateStr.slice(0, 4), 10),
    parseInt(dateStr.slice(5, 7), 10) - 1,
    parseInt(dateStr.slice(8, 10), 10),
    utcHour,
    min
  ));
}

async function run() {
  console.log("Fetching worldcup2026.json...");
  const res = await fetch('https://cqexjtuffyqgfxthvjhp.supabase.co/storage/v1/object/public/mundial/worldcup2026.json');
  if (!res.ok) {
    throw new Error(`Failed to fetch JSON: HTTP ${res.status}`);
  }
  const data = await res.json();
  console.log(`Fetched ${data.matches.length} matches.`);

  // 1. Insert venues
  console.log("Inserting venues...");
  const venuesData = VENUES.map(v => ({
    id: v.imageKey,
    nombre_estadio: v.name,
    ciudad_es: v.cityEs,
    ciudad_en: v.cityEn,
    pais_es: v.countryEs,
    capacidad: parseInt(v.capacity.replace(/,/g, ''), 10)
  }));
  const { error: vError } = await supabase.from('sedes').upsert(venuesData);
  if (vError) throw vError;
  console.log("Venues inserted successfully.");

  // 2. Insert teams
  console.log("Collecting teams...");
  const uniqueTeams = new Set();
  data.matches.forEach(m => {
    uniqueTeams.add(m.team1);
    uniqueTeams.add(m.team2);
  });

  const teamsData = Array.from(uniqueTeams).map(code => {
    let nameEs = translateTeam(code);
    let nameEn = code;
    // Common translations for major hosts/countries
    if (code === 'MEX') nameEn = 'Mexico';
    else if (code === 'USA') nameEn = 'USA';
    else if (code === 'CAN') nameEn = 'Canada';
    else if (TEAM_ES[code]) nameEn = TEAM_ES[code];

    return {
      codigo_fifa: code,
      nombre_es: nameEs,
      nombre_en: nameEn,
      codigo_bandera: code.length === 3 ? code.toLowerCase().substring(0, 2) : null
    };
  });

  console.log(`Inserting ${teamsData.length} teams (including placeholders)...`);
  const { error: tError } = await supabase.from('equipos').upsert(teamsData);
  if (tError) throw tError;
  console.log("Teams inserted successfully.");

  // 3. Insert matches
  console.log("Inserting matches...");
  const matchesData = data.matches.map((m, index) => {
    const venueId = venueMap[m.ground];
    if (!venueId) {
      console.warn(`Warning: Ground "${m.ground}" could not be mapped to any venue ID.`);
    }
    const kickoff = parseMatchDate(m.date, m.time);
    
    // Check if there is a score
    const hasScore = m.score && m.score.ft;
    const goalsT1 = hasScore ? m.score.ft[0] : 0;
    const goalsT2 = hasScore ? m.score.ft[1] : 0;
    const estado = hasScore ? 'finalizado' : 'programado';

    return {
      numero_partido: m.num || (index + 1),
      ronda: m.round,
      grupo: m.group || null,
      fecha_inicio_utc: kickoff.toISOString(),
      team1_id: m.team1,
      team2_id: m.team2,
      sede_id: venueId || null,
      estado: estado,
      goles_team1: goalsT1,
      goles_team2: goalsT2,
      minuto_actual: hasScore ? 90 : 0
    };
  });

  const { error: mError } = await supabase.from('partidos').upsert(matchesData);
  if (mError) throw mError;
  console.log("Matches inserted successfully.");
  console.log("Database seeded successfully!");
}

run().catch(err => {
  console.error("Error seeding database:", err);
  process.exit(1);
});
