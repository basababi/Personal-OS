// Google Fonts-оос Golos Text + JetBrains Mono variable woff2-уудыг татаж
// локалд хадгална (апп офлайн ажиллана). src/fonts.css-ийг үүсгэнэ.
const fs = require('fs');
const path = require('path');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36';
const CSS_URL = 'https://fonts.googleapis.com/css2?family=Golos+Text:wght@400..800&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap';

async function main() {
  const fontsDir = path.join(__dirname, '..', 'src', 'assets', 'fonts');
  fs.mkdirSync(fontsDir, { recursive: true });

  const res = await fetch(CSS_URL, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error('css fetch failed: ' + res.status);
  let css = await res.text();

  const urls = [...css.matchAll(/url\((https:[^)]+\.woff2)\)/g)].map(m => m[1]);
  const seen = new Map();
  let n = 0;
  for (const u of urls) {
    if (seen.has(u)) continue;
    const fname = 'f' + n++ + '.woff2';
    seen.set(u, fname);
    const r = await fetch(u, { headers: { 'User-Agent': UA } });
    if (!r.ok) throw new Error('font fetch failed: ' + u);
    fs.writeFileSync(path.join(fontsDir, fname), Buffer.from(await r.arrayBuffer()));
  }
  for (const [u, fname] of seen) css = css.split('url(' + u + ')').join("url('./assets/fonts/" + fname + "')");
  fs.writeFileSync(path.join(__dirname, '..', 'src', 'fonts.css'), css);
  console.log('fonts:', seen.size, 'files →', fontsDir);
}

main().catch(e => {
  // Офлайн үед: хоосон fonts.css — системийн фонтоор fallback хийнэ
  console.error('font fetch failed, writing empty fonts.css:', e.message);
  fs.mkdirSync(path.join(__dirname, '..', 'src'), { recursive: true });
  fs.writeFileSync(path.join(__dirname, '..', 'src', 'fonts.css'), '/* fonts unavailable offline */\n');
});
