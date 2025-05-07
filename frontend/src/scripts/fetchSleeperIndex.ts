// src/scripts/fetchSleeperIndex.ts
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

const SLEEPER_API = 'https://api.sleeper.app/v1/players/nfl';
const OUTPUT_PATH = path.join(__dirname, '../data/sleeperPlayerIndex.json');

async function fetchAndSaveSleeperIndex() {
  try {
    const res = await fetch(SLEEPER_API);
    if (!res.ok) throw new Error(`Failed to fetch, status: ${res.status}`);

    const data = await res.json() as Record<string, any>;
    const keys = Object.keys(data);
    console.log(`✅ Pulled ${keys.length} players from Sleeper`);

    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(data, null, 2));
    console.log(`✅ Sleeper player index saved to ${OUTPUT_PATH}`);
  } catch (err) {
    console.error('❌ Failed to fetch Sleeper index:', err);
  }
}

fetchAndSaveSleeperIndex();
