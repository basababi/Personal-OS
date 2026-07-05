// Апп болон tray-ийн PNG икон үүсгэнэ (purple дөрвөлжин + цагаан цахилгаан).
// Гадны сангүйгээр PNG-г гараар энкодлоно: zlib deflate + CRC32.
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// ── CRC32 ──
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}
function encodePNG(w, h, rgba) {
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) {
    raw[y * (w * 4 + 1)] = 0; // filter: none
    rgba.copy(raw, y * (w * 4 + 1) + 1, y * w * 4, (y + 1) * w * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; ihdr[9] = 6; // 8-bit RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

// ── Геометр ──
// Лого цахилгаан: viewBox 24 — M13 2 L4 14 h6 l-1 8 9-12 h-6 l1-8 z
const BOLT = [[13, 2], [4, 14], [10, 14], [9, 22], [18, 10], [12, 10]];
function inPoly(px, py, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
function inRoundRect(x, y, size, r) {
  if (x < 0 || y < 0 || x > size || y > size) return false;
  const cx = Math.max(r, Math.min(size - r, x));
  const cy = Math.max(r, Math.min(size - r, y));
  return (x - cx) ** 2 + (y - cy) ** 2 <= r * r || (x >= r && x <= size - r) || (y >= r && y <= size - r);
}

function drawIcon(size) {
  const rgba = Buffer.alloc(size * size * 4);
  const SS = 4; // supersampling
  const bg = [0x7f, 0x77, 0xdd], fg = [0xff, 0xff, 0xff];
  const radius = size * 0.28;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let bgHit = 0, fgHit = 0;
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const px = x + (sx + 0.5) / SS, py = y + (sy + 0.5) / SS;
          if (!inRoundRect(px, py, size, radius)) continue;
          bgHit++;
          // 24-грид → икон координат (0.72 масштаб, төвд)
          const gx = ((px / size) - 0.5) / 0.72 * 24 + 12;
          const gy = ((py / size) - 0.5) / 0.72 * 24 + 12;
          if (inPoly(gx, gy, BOLT)) fgHit++;
        }
      }
      const total = SS * SS;
      const a = Math.round((bgHit / total) * 255);
      const fMix = bgHit ? fgHit / bgHit : 0;
      const i = (y * size + x) * 4;
      rgba[i] = Math.round(bg[0] + (fg[0] - bg[0]) * fMix);
      rgba[i + 1] = Math.round(bg[1] + (fg[1] - bg[1]) * fMix);
      rgba[i + 2] = Math.round(bg[2] + (fg[2] - bg[2]) * fMix);
      rgba[i + 3] = a;
    }
  }
  return encodePNG(size, size, rgba);
}

// ICO контейнер (PNG-компресстэй entry-үүд — Vista+ дэмждэг), shortcut-ийн иконд
function encodeICO(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(pngs.length, 4);
  const entries = [];
  let offset = 6 + pngs.length * 16;
  for (const { size, buf } of pngs) {
    const e = Buffer.alloc(16);
    e[0] = size >= 256 ? 0 : size; // 0 = 256
    e[1] = size >= 256 ? 0 : size;
    e.writeUInt16LE(1, 4);  // planes
    e.writeUInt16LE(32, 6); // bpp
    e.writeUInt32LE(buf.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += buf.length;
    entries.push(e);
  }
  return Buffer.concat([header, ...entries, ...pngs.map(p => p.buf)]);
}

const outDir = path.join(__dirname, '..', 'assets');
fs.mkdirSync(outDir, { recursive: true });
const png256 = drawIcon(256), png64 = drawIcon(64), png32 = drawIcon(32), png16 = drawIcon(16);
fs.writeFileSync(path.join(outDir, 'icon.png'), png256);
fs.writeFileSync(path.join(outDir, 'tray.png'), png32);
fs.writeFileSync(path.join(outDir, 'tray@2x.png'), png64);
fs.writeFileSync(path.join(outDir, 'icon.ico'), encodeICO([
  { size: 256, buf: png256 }, { size: 64, buf: png64 }, { size: 32, buf: png32 }, { size: 16, buf: png16 }
]));
console.log('icons written to', outDir);
