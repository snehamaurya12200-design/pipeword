const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// CRC32 table
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
  ihdrData[8] = 8; // 8 bits per channel
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;
  const ihdr = makeChunk('IHDR', ihdrData);

  const scanlineSize = 1 + width * 4;
  const rawData = Buffer.alloc(height * scanlineSize);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * scanlineSize;
    rawData[rowOffset] = 0; // Filter: none
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

// Generate Pip Character artwork matching the reference image
function renderPip(x, y, w, h) {
  const cx = w / 2;
  const cy = h / 2;
  const nx = (x - cx) / (w / 2);
  const ny = (y - cy) / (h / 2);

  // Default transparent
  let r = 0, g = 0, b = 0, a = 0;

  // Cloud at bottom (ny from 0.35 to 0.85)
  const cloudDist1 = Math.hypot(nx, ny - 0.55);
  const cloudDist2 = Math.hypot(nx - 0.38, ny - 0.52);
  const cloudDist3 = Math.hypot(nx + 0.38, ny - 0.52);
  const cloudDist4 = Math.hypot(nx - 0.65, ny - 0.62);
  const cloudDist5 = Math.hypot(nx + 0.65, ny - 0.62);

  if (cloudDist1 < 0.38 || cloudDist2 < 0.34 || cloudDist3 < 0.34 || cloudDist4 < 0.28 || cloudDist5 < 0.28) {
    const minD = Math.min(cloudDist1, cloudDist2, cloudDist3, cloudDist4, cloudDist5);
    r = 245 - minD * 40;
    g = 240 - minD * 35;
    b = 255;
    a = 250;
    return [Math.round(r), Math.round(g), Math.round(b), a];
  }

  // Pajama body: ellipse around (0, 0.25)
  const bodyDist = Math.hypot(nx / 0.3, (ny - 0.25) / 0.25);
  if (bodyDist < 1.0) {
    // Dark navy purple pajamas
    r = 28; g = 32; b = 64; a = 255;
    // Pink collar
    if (Math.hypot(nx / 0.2, (ny - 0.08) / 0.06) < 1.0) {
      r = 244; g = 166; b = 184;
    }
    return [r, g, b, a];
  }

  // Head: smooth round skull ellipse around (0, -0.15)
  const headDist = Math.hypot(nx / 0.44, (ny + 0.12) / 0.4);
  if (headDist < 1.0) {
    // Round white/cream skull
    const shade = 1.0 - headDist * 0.2;
    r = 253 * shade;
    g = 250 * shade;
    b = 243 * shade;
    a = 255;

    // Soft pink blush on cheeks
    const blushL = Math.hypot(nx + 0.28, ny - 0.02);
    const blushR = Math.hypot(nx - 0.28, ny - 0.02);
    if (blushL < 0.12 || blushR < 0.12) {
      r = 248; g = 180; b = 195;
    }

    // Left eye socket around (-0.16, -0.12)
    const eyeL = Math.hypot((nx + 0.16) / 0.12, (ny + 0.14) / 0.14);
    // Right eye socket around (0.16, -0.12)
    const eyeR = Math.hypot((nx - 0.16) / 0.12, (ny + 0.14) / 0.14);

    if (eyeL < 1.0 || eyeR < 1.0) {
      // Dark eye socket
      r = 22; g = 26; b = 48;
      // Warm yellow glowing star pinprick inside
      const pupilL = Math.hypot(nx + 0.16, ny + 0.14);
      const pupilR = Math.hypot(nx - 0.16, ny + 0.14);
      if (pupilL < 0.045 || pupilR < 0.045) {
        // Bright star yellow
        r = 254; g = 230; b = 80;
      } else if (pupilL < 0.07 || pupilR < 0.07) {
        // Warm halo
        r = 180; g = 150; b = 70;
      }
    }

    // Crooked smile around (0, 0.06)
    if (ny > 0.03 && ny < 0.09 && Math.abs(nx) < 0.16) {
      const curve = 0.05 + (nx * nx) * 1.2;
      if (Math.abs(ny - curve) < 0.015) {
        r = 45; g = 40; b = 65;
      }
    }

    return [Math.round(r), Math.round(g), Math.round(b), a];
  }

  // Bedtime nightcap drooping to the right
  // Cap cone
  const capDist = Math.hypot((nx - 0.18) / 0.45, (ny + 0.38) / 0.3);
  if (capDist < 1.0 && ny < -0.15) {
    // Dark navy purple cap
    r = 38; g = 34; b = 72; a = 255;
    // Stars on cap
    if (Math.hypot(nx - 0.15, ny + 0.45) < 0.04 || Math.hypot(nx + 0.05, ny + 0.35) < 0.035 || Math.hypot(nx - 0.3, ny + 0.3) < 0.03) {
      r = 253; g = 224; b = 71; // gold star
    }
    return [r, g, b, a];
  }

  // Pink Brim Band of Nightcap
  if (ny > -0.25 && ny < -0.16 && Math.abs(nx) < 0.46) {
    r = 244; g = 166; b = 184; a = 255; // dusty pink
    return [r, g, b, a];
  }

  // Pink Bow on cap (around 0.48, -0.18)
  if (Math.hypot(nx - 0.44, ny + 0.15) < 0.08) {
    r = 244; g = 166; b = 184; a = 255;
    return [r, g, b, a];
  }

  // Antique Golden Lantern held in left hand around (-0.52, 0.22)
  const lanternDist = Math.hypot((nx + 0.52) / 0.14, (ny - 0.22) / 0.22);
  if (lanternDist < 1.0) {
    // Lantern glow inside
    if (Math.hypot((nx + 0.52) / 0.09, (ny - 0.24) / 0.13) < 1.0) {
      r = 254; g = 236; b = 120; a = 255; // warm yellow lamp glow
    } else {
      r = 175; g = 135; b = 50; a = 255; // antique brass frame
    }
    return [r, g, b, a];
  }

  return [0, 0, 0, 0];
}

const assetsDir = path.resolve(__dirname, '../public/assets');
fs.mkdirSync(assetsDir, { recursive: true });

console.log('Generating PNG assets in', assetsDir);

// 1. pip-waving-cloud.png (300x300)
const buf1 = createPng(300, 300, renderPip);
fs.writeFileSync(path.join(assetsDir, 'pip-waving-cloud.png'), buf1);
fs.writeFileSync(path.join(assetsDir, 'pip_avatar_cloud.png'), buf1);
fs.writeFileSync(path.join(assetsDir, 'pip_avatar_cloud.jpg'), buf1);
fs.writeFileSync(path.join(assetsDir, 'pip_dream_lantern.png'), buf1);
fs.writeFileSync(path.join(assetsDir, 'pip_dream_lantern.jpg'), buf1);
fs.writeFileSync(path.join(assetsDir, 'pip_lullaby_box.png'), buf1);
fs.writeFileSync(path.join(assetsDir, 'pip_lullaby_box.jpg'), buf1);
fs.writeFileSync(path.join(assetsDir, 'pip_portrait.png'), buf1);
fs.writeFileSync(path.join(assetsDir, 'pip_portrait.jpg'), buf1);

console.log('Assets created successfully!');
