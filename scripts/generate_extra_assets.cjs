const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) c = 0xedb88320 ^ (c >>> 1);
    else c = c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(12 + len);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const typeAndData = chunk.slice(4, 8 + len);
  chunk.writeUInt32BE(crc32(typeAndData), 8 + len);
  return chunk;
}

function createPng(width, height, pixelFn) {
  const header = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;
  ihdrData[9] = 6;
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;
  const ihdr = makeChunk('IHDR', ihdrData);

  const scanlineSize = 1 + width * 4;
  const rawData = Buffer.alloc(height * scanlineSize);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * scanlineSize;
    rawData[rowOffset] = 0;
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = pixelFn(x, y, width, height);
      const pixelOffset = rowOffset + 1 + x * 4;
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const compressed = zlib.deflateSync(rawData);
  const idat = makeChunk('IDAT', compressed);
  const iend = makeChunk('IEND', Buffer.alloc(0));
  return Buffer.concat([header, ihdr, idat, iend]);
}

// 1. Story Cover: Pip on cloud with storybook
function renderStory(x, y, w, h) {
  const nx = (x - w / 2) / (w / 2);
  const ny = (y - h / 2) / (h / 2);
  // Night sky background
  let r = 26 + (ny + 1) * 15;
  let g = 28 + (ny + 1) * 18;
  let b = 68 + (ny + 1) * 35;
  let a = 255;

  // Crescent moon at top right
  const moonDist = Math.hypot(nx - 0.55, ny + 0.45);
  const moonCut = Math.hypot(nx - 0.48, ny + 0.48);
  if (moonDist < 0.28 && moonCut > 0.23) {
    return [254, 230, 110, 255];
  }

  // Cloud base
  if (Math.hypot(nx / 0.8, (ny - 0.4) / 0.35) < 1.0) {
    return [240, 230, 255, 255];
  }

  // Pip figure on cloud
  if (Math.hypot(nx / 0.3, (ny + 0.05) / 0.35) < 1.0) {
    // Little skull face
    if (Math.hypot(nx / 0.2, (ny + 0.1) / 0.2) < 1.0) {
      return [253, 250, 243, 255];
    }
    // Cap
    if (ny < -0.1) return [40, 36, 75, 255];
    // Pajamas
    return [30, 34, 65, 255];
  }

  // Golden book in hands
  if (Math.abs(nx) < 0.15 && Math.abs(ny - 0.15) < 0.09) {
    return [245, 185, 75, 255];
  }

  // Twinkling stars
  if ((Math.abs(nx * 10) % 1.5 < 0.1 && Math.abs(ny * 10) % 2.0 < 0.1) || Math.hypot(nx + 0.6, ny + 0.3) < 0.03) {
    return [254, 240, 150, 255];
  }

  return [Math.round(r), Math.round(g), Math.round(b), a];
}

// 2. Sleeping Moon on cloud (Nightlight viewport)
function renderMoonCloud(x, y, w, h) {
  const nx = (x - w / 2) / (w / 2);
  const ny = (y - h / 2) / (h / 2);

  // Deep night sky
  let r = 16 + (ny + 1) * 10;
  let g = 20 + (ny + 1) * 12;
  let b = 48 + (ny + 1) * 20;

  // Cloud at bottom
  const c1 = Math.hypot(nx, ny - 0.42);
  const c2 = Math.hypot(nx - 0.35, ny - 0.38);
  const c3 = Math.hypot(nx + 0.35, ny - 0.38);
  if (c1 < 0.38 || c2 < 0.32 || c3 < 0.32) {
    return [250, 246, 255, 255];
  }

  // Golden sleeping crescent moon
  const mD = Math.hypot(nx + 0.05, ny + 0.05);
  const mCut = Math.hypot(nx + 0.18, ny + 0.02);
  if (mD < 0.52 && mCut > 0.44) {
    // Sleeping closed eye
    if (Math.hypot(nx - 0.02, ny - 0.02) < 0.04) {
      return [120, 80, 20, 255];
    }
    return [254, 225, 95, 255];
  }

  // Little nightcap on top of moon
  if (Math.hypot((nx - 0.1) / 0.2, (ny + 0.45) / 0.15) < 1.0) {
    return [244, 166, 184, 255]; // pink cap
  }

  // Twinkling stars
  if (Math.hypot(nx - 0.6, ny + 0.5) < 0.04 || Math.hypot(nx + 0.65, ny - 0.1) < 0.035 || Math.hypot(nx - 0.6, ny - 0.2) < 0.03) {
    return [254, 240, 160, 255];
  }

  return [Math.round(r), Math.round(g), Math.round(b), 255];
}

// 3. Dream Routes Map
function renderRoutes(x, y, w, h) {
  const nx = (x - w / 2) / (w / 2);
  const ny = (y - h / 2) / (h / 2);

  // Twilight sky
  let r = 24 + (nx + 1) * 12;
  let g = 28 + (ny + 1) * 15;
  let b = 64 + (ny + 1) * 25;

  // Floating cloud islands with cute houses
  const island1 = Math.hypot((nx + 0.5) / 0.25, (ny - 0.1) / 0.18);
  const island2 = Math.hypot(nx / 0.28, (ny + 0.05) / 0.18);
  const island3 = Math.hypot((nx - 0.52) / 0.25, (ny - 0.12) / 0.18);

  if (island1 < 1.0 || island2 < 1.0 || island3 < 1.0) {
    // Cloud island top
    return [245, 235, 255, 255];
  }

  // Miniature houses on islands
  if (Math.hypot((nx + 0.5) / 0.08, (ny + 0.05) / 0.08) < 1.0) return [244, 166, 184, 255]; // pink house
  if (Math.hypot(nx / 0.08, (ny + 0.18) / 0.08) < 1.0) return [254, 225, 95, 255]; // yellow house
  if (Math.hypot((nx - 0.52) / 0.08, (ny + 0.04) / 0.08) < 1.0) return [184, 169, 232, 255]; // lavender house

  // Dotted flight trail connecting islands
  const trailY = 0.08 * Math.sin(nx * 4);
  if (Math.abs(ny - trailY) < 0.02 && Math.abs(Math.sin(nx * 30)) > 0.5) {
    return [254, 235, 120, 255];
  }

  return [Math.round(r), Math.round(g), Math.round(b), 255];
}

const assetsDir = path.resolve(__dirname, '../public/assets');

fs.writeFileSync(path.join(assetsDir, 'story_origin.png'), createPng(320, 200, renderStory));
fs.writeFileSync(path.join(assetsDir, 'sleeping_moon.png'), createPng(260, 200, renderMoonCloud));
fs.writeFileSync(path.join(assetsDir, 'dream_routes.png'), createPng(360, 180, renderRoutes));

console.log('Story, moon, and route assets generated successfully!');
