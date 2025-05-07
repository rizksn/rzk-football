import fs from 'fs';
import path from 'path';

function cleanAdpData() {
  const rawPath = path.join(process.cwd(), 'src', 'data', 'raw-adp-draftsharks.json');
  const srcPath = path.join(process.cwd(), 'src', 'data', 'adp-draftsharks.json');
  const publicPath = path.join(process.cwd(), 'public', 'adp-draftsharks.json');

  const raw = fs.readFileSync(rawPath, 'utf-8');
  const json = JSON.parse(raw);

  // Step 1: Clean ADP strings and assign stable IDs
  const cleanedPlayers = json.data.map((player: any) => {
    const cleanedAdp = player.adp?.split(' ')[0]?.trim(); // "1.10 Show Trend »" → "1.10"
    const id = `${player.name}_${player.team}`
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^\w\-]/g, ''); // Clean non-word chars

    return {
      ...player,
      adp: cleanedAdp,
      id,
    };
  });

  // Step 2: Filter and log invalid players
  const validPlayers = cleanedPlayers.filter((p: any) => {
    const isValid = p.name && p.position && p.team && /^\d+(\.\d{1,2})?$/.test(p.adp);
    if (!isValid) {
      console.warn('🛑 Filtered out:', p);
    }
    return isValid;
  });

  const cleaned = {
    ...json,
    data: validPlayers,
  };

  [srcPath, publicPath].forEach((filePath) => {
    fs.writeFileSync(filePath, JSON.stringify(cleaned, null, 2));
    console.log(`✅ Wrote cleaned ADP to ${filePath}`);
  });

  console.log(`🎯 ADP cleaned and synced successfully`);
}

cleanAdpData();
