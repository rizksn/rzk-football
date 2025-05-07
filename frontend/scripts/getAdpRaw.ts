import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

async function scrapeAdpRaw() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  );
  await page.setViewport({ width: 1280, height: 800 });

  await page.goto('https://www.draftsharks.com/adp/half-ppr/consensus/12', {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });

  // Scroll logic to load full table
  await page.evaluate(() => {
    return new Promise((resolve) => {
      let lastRowCount = 0;
      let sameCountCounter = 0;

      const interval = setInterval(() => {
        window.scrollBy(0, 1000);
        const currentRowCount = document.querySelectorAll('table tbody tr').length;

        if (currentRowCount === lastRowCount) {
          sameCountCounter++;
          if (sameCountCounter >= 3) {
            clearInterval(interval);
            resolve(null);
          }
        } else {
          lastRowCount = currentRowCount;
          sameCountCounter = 0;
        }
      }, 500);
    });
  });

  const players = await page.evaluate(() => {
    console.log("🧪 Running in browser context");
  
    const rows = Array.from(document.querySelectorAll('table tbody tr'));
    console.log('🧪 Found rows:', rows.length);
  
    const data = rows.map((row, i) => {
      const nameEl = row.querySelector('.player-name');
      const adpEl = row.querySelector('span.adp-value');
  
      const fullText = nameEl?.textContent?.trim() || '';
      const adpRaw = adpEl?.textContent?.trim() || '';
  
      const parts = fullText.split(' ');
      const team = parts.pop();
      const pos = parts.pop();
      const name = parts.join(' ');
  
      console.log(`Row ${i + 1}:`, { name, pos, team, adpRaw });
  
      return {
        name,
        position: pos || '',
        team: team || '',
        adp: adpRaw,
      };
    });
  
    return data.filter(p => p.name && p.position && p.team && p.adp);
  });
  

  await browser.close();

  const payload = {
    source: 'Draft Sharks',
    format: 'Redraft 1QB',
    lastUpdated: new Date().toISOString(),
    data: players,
  };

  const rawPath = path.join(process.cwd(), 'src', 'data', 'raw-adp-draftsharks.json');
  fs.writeFileSync(rawPath, JSON.stringify(payload, null, 2));

  console.log(`✅ Scraped ${players.length} players from Draft Sharks`);
  console.log(`📁 Saved to ${rawPath}`);
}

scrapeAdpRaw();
