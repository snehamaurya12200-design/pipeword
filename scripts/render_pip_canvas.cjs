const { execSync } = require('child_process');
const fs = require('fs');

const chromePath = '/ms-playwright/chromium_headless_shell-1247/chrome-headless-shell-linux64/chrome-headless-shell';

function renderCanvasToPng(canvasCode, outputPath, width, height, isOpaque = false) {
  const tmpHtml = `/tmp/render_canvas_${Date.now()}_${Math.random().toString(36).substring(7)}.html`;
  fs.writeFileSync(tmpHtml, `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            width: ${width}px;
            height: ${height}px;
            background: ${isOpaque ? '#fffaf0' : 'transparent'};
            overflow: hidden;
          }
          canvas {
            display: block;
            width: ${width}px;
            height: ${height}px;
          }
        </style>
      </head>
      <body>
        <canvas id="c" width="${width}" height="${height}"></canvas>
        <script>
          const canvas = document.getElementById("c");
          const ctx = canvas.getContext("2d");
          
          // Safe roundRect polyfill
          ctx.roundRect = function(x, y, w, h, r) {
            if (!r) r = 0;
            this.beginPath();
            this.moveTo(x + r, y);
            this.lineTo(x + w - r, y);
            this.quadraticCurveTo(x + w, y, x + w, y + r);
            this.lineTo(x + w, y + h - r);
            this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
            this.lineTo(x + r, y + h);
            this.quadraticCurveTo(x, y + h, x, y + h - r);
            this.lineTo(x, y + r);
            this.quadraticCurveTo(x, y, x + r, y);
            this.closePath();
            return this;
          };

          try {
            ${canvasCode}
          } catch (e) {
            console.error("CANVAS DRAW ERROR:", e);
          }
        </script>
      </body>
    </html>
  `);

  try {
    const bgParam = isOpaque ? '--default-background-color=fffaf0' : '--default-background-color=00000000';
    execSync(`${chromePath} --headless --no-sandbox --disable-gpu --screenshot=${outputPath} --window-size=${width},${height} ${bgParam} file://${tmpHtml}`, { stdio: 'pipe' });
    console.log(`Rendered ${outputPath} (${width}x${height}) - size: ${fs.statSync(outputPath).size} bytes`);
  } finally {
    try { fs.unlinkSync(tmpHtml); } catch (e) {}
  }
}

// 1. Pip Master Character Drawer
const pipDrawingCode = (isPortrait = false) => `
  const W = canvas.width;
  const H = canvas.height;
  const cx = W / 2;
  const baseY = isPortrait ? 510 : 340;

  function drawStar(x, y, r1, r2, color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const a = (i * Math.PI) / 2;
      const b = a + Math.PI / 4;
      if (i === 0) ctx.moveTo(x + Math.cos(a) * r1, y + Math.sin(a) * r1);
      else ctx.lineTo(x + Math.cos(a) * r1, y + Math.sin(a) * r1);
      ctx.lineTo(x + Math.cos(b) * r2, y + Math.sin(b) * r2);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  ${isPortrait ? `
    // Background gradient for portrait
    const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
    bgGrad.addColorStop(0, "#fffaf2");
    bgGrad.addColorStop(0.5, "#fdf5e8");
    bgGrad.addColorStop(1, "#f7ebd7");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Floating dream stars
    drawStar(W * 0.85, 170, 16, 5, "#d8b4e2");
    drawStar(W * 0.86, 270, 14, 4, "#fde047");
    drawStar(W * 0.84, 380, 12, 4, "#c4b5fd");
    drawStar(W * 0.15, 270, 15, 5, "#fde047");
    drawStar(W * 0.16, 380, 12, 4, "#e9d5ff");
    // Little sparkles
    ctx.fillStyle = "#fef08a";
    ctx.beginPath(); ctx.arc(W * 0.22, 320, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(W * 0.78, 330, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(W * 0.72, 110, 3, 0, Math.PI * 2); ctx.fill();

    // Sleeping Crescent Moon (Top Right)
    ctx.save();
    ctx.translate(W * 0.78, 100);
    // Moon halo
    const moonHalo = ctx.createRadialGradient(0, 0, 10, 0, 0, 50);
    moonHalo.addColorStop(0, "rgba(254, 240, 138, 0.4)");
    moonHalo.addColorStop(1, "rgba(254, 240, 138, 0)");
    ctx.fillStyle = moonHalo;
    ctx.beginPath(); ctx.arc(0, 0, 50, 0, Math.PI * 2); ctx.fill();

    // Moon body
    ctx.fillStyle = "#fef08a";
    ctx.beginPath();
    ctx.arc(0, 0, 32, -Math.PI * 0.4, Math.PI * 0.6);
    ctx.bezierCurveTo(8, 18, 12, -10, 0, -32);
    ctx.fill();

    // Sleeping eye
    ctx.strokeStyle = "#854d0e";
    ctx.lineWidth = 2.2;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(8, 3, 6, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.stroke();
    ctx.beginPath(); ctx.moveTo(14, 6); ctx.lineTo(17, 9); ctx.stroke();
    // Smile
    ctx.beginPath();
    ctx.arc(10, 14, 4, 0.1 * Math.PI, 0.8 * Math.PI);
    ctx.stroke();
    // Rosy pink cheek
    ctx.fillStyle = "rgba(244, 114, 182, 0.6)";
    ctx.beginPath(); ctx.arc(14, 11, 4.5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  ` : ''}

  // ================= 1. FLUFFY DREAM CLOUD BASE =================
  ctx.save();
  const cloudY = baseY;

  // Cloud ambient shadow underneath
  ctx.fillStyle = "rgba(225, 200, 210, 0.5)";
  ctx.beginPath();
  ctx.ellipse(cx, cloudY + 15, 175, 42, 0, 0, Math.PI * 2);
  ctx.fill();

  // Overlapping cloud puffs
  const puffs = [
    { x: cx - 110, y: cloudY - 5, r: 45 },
    { x: cx - 65,  y: cloudY + 5, r: 52 },
    { x: cx - 140, y: cloudY - 8, r: 35 },
    { x: cx - 160, y: cloudY - 12, r: 24 },
    { x: cx + 110, y: cloudY - 5, r: 45 },
    { x: cx + 65,  y: cloudY + 5, r: 52 },
    { x: cx + 140, y: cloudY - 8, r: 35 },
    { x: cx + 160, y: cloudY - 12, r: 24 },
    { x: cx,       y: cloudY + 10, r: 56 },
    { x: cx - 35,  y: cloudY - 2, r: 52 },
    { x: cx + 35,  y: cloudY - 2, r: 52 },
  ];

  puffs.forEach(p => {
    const puffGrad = ctx.createRadialGradient(p.x, p.y - p.r * 0.3, p.r * 0.1, p.x, p.y, p.r);
    puffGrad.addColorStop(0, "#ffffff");
    puffGrad.addColorStop(0.7, "#fff5f7");
    puffGrad.addColorStop(1, "#fce7f3");
    ctx.fillStyle = puffGrad;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  });

  // Soft pink cloud rim highlight
  ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(cx - 130, cloudY - 22);
  ctx.bezierCurveTo(cx - 70, cloudY - 38, cx + 70, cloudY - 38, cx + 130, cloudY - 22);
  ctx.stroke();

  // Cloud Script Text: "♥ Pip ♥"
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "bold 32px 'Brush Script MT', 'Snell Roundhand', 'Comic Sans MS', cursive, sans-serif";
  ctx.fillStyle = "#f472b6";
  ctx.fillText("♥ Pip ♥", cx, cloudY + 14);
  ctx.restore();

  ctx.restore();

  // ================= 2. PIP BODY & LEGS (CROSS-LEGGED) =================
  ctx.save();
  const bodyY = baseY - 90;

  // Onesie Body
  const onesieGrad = ctx.createRadialGradient(cx, bodyY, 15, cx, bodyY, 70);
  onesieGrad.addColorStop(0, "#ffffff");
  onesieGrad.addColorStop(0.5, "#fdf2f8");
  onesieGrad.addColorStop(1, "#fce7f3");
  ctx.fillStyle = onesieGrad;
  ctx.strokeStyle = "#fbcfe8";
  ctx.lineWidth = 2;

  // Lower torso
  ctx.beginPath();
  ctx.ellipse(cx, bodyY + 10, 68, 50, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Folded legs
  ctx.save();
  ctx.translate(cx - 55, bodyY + 35);
  ctx.rotate(-0.25);
  ctx.fillStyle = onesieGrad;
  ctx.beginPath();
  ctx.ellipse(0, 0, 38, 26, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#c084fc";
  ctx.beginPath();
  ctx.ellipse(-24, 10, 22, 17, -0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#e9d5ff";
  ctx.beginPath();
  ctx.ellipse(-24, 10, 16, 11, -0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.translate(cx + 55, bodyY + 35);
  ctx.rotate(0.25);
  ctx.fillStyle = onesieGrad;
  ctx.beginPath();
  ctx.ellipse(0, 0, 38, 26, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#c084fc";
  ctx.beginPath();
  ctx.ellipse(24, 10, 22, 17, 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#e9d5ff";
  ctx.beginPath();
  ctx.ellipse(24, 10, 16, 11, 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Front seam & buttons
  ctx.strokeStyle = "#f472b6";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, bodyY - 25);
  ctx.lineTo(cx, bodyY + 35);
  ctx.stroke();

  ctx.fillStyle = "#f472b6";
  [bodyY - 12, bodyY + 4, bodyY + 20].forEach(by => {
    ctx.beginPath(); ctx.arc(cx, by, 3, 0, Math.PI * 2); ctx.fill();
  });

  // Tiny hearts on onesie
  ctx.fillStyle = "rgba(244, 114, 182, 0.45)";
  const drawMiniHeart = (hx, hy) => {
    ctx.beginPath();
    ctx.arc(hx - 2, hy - 2, 2.5, Math.PI, 0, false);
    ctx.arc(hx + 2, hy - 2, 2.5, Math.PI, 0, false);
    ctx.lineTo(hx, hy + 4);
    ctx.closePath();
    ctx.fill();
  };
  drawMiniHeart(cx - 24, bodyY);
  drawMiniHeart(cx + 26, bodyY + 8);
  drawMiniHeart(cx - 36, bodyY + 22);
  drawMiniHeart(cx + 34, bodyY + 25);
  ctx.restore();

  // ================= 3. PIP ARMS & HELD OBJECTS =================
  ctx.save();
  // Left arm holding lantern
  ctx.fillStyle = "#fdf2f8";
  ctx.strokeStyle = "#fbcfe8";
  ctx.lineWidth = 2;
  ctx.save();
  ctx.translate(cx - 65, bodyY - 15);
  ctx.rotate(0.35);
  ctx.beginPath();
  ctx.ellipse(0, 0, 18, 28, 0, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.translate(cx - 78, bodyY + 12);
  ctx.rotate(-0.2);
  ctx.beginPath();
  ctx.ellipse(0, 0, 15, 22, 0, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = "#fffdfa";
  ctx.strokeStyle = "#e8ded2";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0, 18, 9, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();
  ctx.restore();

  // DREAM LANTERN
  ctx.save();
  const lanX = cx - 110;
  const lanY = bodyY + 30;

  const lanGlow = ctx.createRadialGradient(lanX + 32, lanY + 50, 8, lanX + 32, lanY + 50, 55);
  lanGlow.addColorStop(0, "rgba(254, 240, 138, 0.7)");
  lanGlow.addColorStop(0.5, "rgba(253, 224, 71, 0.35)");
  lanGlow.addColorStop(1, "rgba(253, 224, 71, 0)");
  ctx.fillStyle = lanGlow;
  ctx.beginPath(); ctx.arc(lanX + 32, lanY + 50, 55, 0, Math.PI * 2); ctx.fill();

  ctx.strokeStyle = "#fde047";
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  const rays = [
    [lanX + 32, lanY + 8, lanX + 32, lanY + 1],
    [lanX + 32, lanY + 92, lanX + 32, lanY + 99],
    [lanX - 10, lanY + 50, lanX - 17, lanY + 50],
    [lanX + 74, lanY + 50, lanX + 81, lanY + 50],
    [lanX + 3,  lanY + 21, lanX - 3,  lanY + 15],
    [lanX + 61, lanY + 79, lanX + 67, lanY + 85],
    [lanX + 3,  lanY + 79, lanX - 3,  lanY + 85],
    [lanX + 61, lanY + 21, lanX + 67, lanY + 15]
  ];
  rays.forEach(([x1, y1, x2, y2]) => {
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  });

  ctx.strokeStyle = "#eab308";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(lanX + 32, lanY + 20, 10, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = "#eab308";
  ctx.strokeStyle = "#ca8a04";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(lanX + 12, lanY + 36);
  ctx.quadraticCurveTo(lanX + 32, lanY + 24, lanX + 52, lanY + 36);
  ctx.lineTo(lanX + 54, lanY + 40);
  ctx.lineTo(lanX + 10, lanY + 40);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  drawStar(lanX + 32, lanY + 31, 5, 2.5, "#fffbeb");

  ctx.fillStyle = "#fffbeb";
  ctx.strokeStyle = "#ca8a04";
  ctx.lineWidth = 3;
  ctx.roundRect(lanX + 14, lanY + 40, 36, 32, 4);
  ctx.fill(); ctx.stroke();

  const flameGlow = ctx.createRadialGradient(lanX + 32, lanY + 56, 3, lanX + 32, lanY + 56, 16);
  flameGlow.addColorStop(0, "#ffffff");
  flameGlow.addColorStop(0.4, "#fef08a");
  flameGlow.addColorStop(0.8, "#f59e0b");
  flameGlow.addColorStop(1, "#d97706");
  ctx.fillStyle = flameGlow;
  ctx.beginPath(); ctx.arc(lanX + 32, lanY + 56, 14, 0, Math.PI * 2); ctx.fill();
  drawStar(lanX + 32, lanY + 56, 4, 2, "#ffffff");

  ctx.strokeStyle = "#ca8a04";
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(lanX + 26, lanY + 40); ctx.lineTo(lanX + 26, lanY + 72);
  ctx.moveTo(lanX + 38, lanY + 40); ctx.lineTo(lanX + 38, lanY + 72);
  ctx.stroke();

  ctx.fillStyle = "#eab308";
  ctx.strokeStyle = "#ca8a04";
  ctx.lineWidth = 2;
  ctx.roundRect(lanX + 11, lanY + 72, 42, 7, 2);
  ctx.fill(); ctx.stroke();
  ctx.roundRect(lanX + 16, lanY + 79, 32, 5, 2);
  ctx.fill(); ctx.stroke();
  ctx.restore();

  // RIGHT ARM & LULLABY MUSIC BOX WITH UNICORN
  ctx.save();
  ctx.fillStyle = "#fdf2f8";
  ctx.strokeStyle = "#fbcfe8";
  ctx.lineWidth = 2;
  ctx.save();
  ctx.translate(cx + 65, bodyY - 15);
  ctx.rotate(-0.35);
  ctx.beginPath();
  ctx.ellipse(0, 0, 18, 28, 0, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.translate(cx + 78, bodyY + 12);
  ctx.rotate(0.25);
  ctx.beginPath();
  ctx.ellipse(0, 0, 15, 22, 0, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = "#fffdfa";
  ctx.strokeStyle = "#e8ded2";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0, 18, 9, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();
  ctx.restore();

  // MUSIC BOX
  ctx.save();
  const boxX = cx + 60;
  const boxY = bodyY + 36;

  ctx.fillStyle = "#c7d2fe";
  ctx.strokeStyle = "#818cf8";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(boxX + 8, boxY + 28);
  ctx.lineTo(boxX + 8, boxY + 54);
  ctx.bezierCurveTo(boxX + 8, boxY + 62, boxX + 64, boxY + 62, boxX + 64, boxY + 54);
  ctx.lineTo(boxX + 64, boxY + 28);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  ctx.fillStyle = "#fbcfe8";
  ctx.strokeStyle = "#f472b6";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(boxX + 36, boxY + 28, 28, 8, 0, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();

  ctx.fillStyle = "#fef08a";
  ctx.beginPath();
  ctx.ellipse(boxX + 36, boxY + 28, 24, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  drawStar(boxX + 22, boxY + 44, 4.5, 2, "#fde047");
  drawStar(boxX + 36, boxY + 46, 5, 2.2, "#fde047");
  drawStar(boxX + 50, boxY + 44, 4.5, 2, "#fde047");

  ctx.strokeStyle = "#ca8a04";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(boxX + 64, boxY + 42); ctx.lineTo(boxX + 74, boxY + 42);
  ctx.stroke();
  ctx.fillStyle = "#fde047";
  ctx.beginPath(); ctx.arc(boxX + 74, boxY + 42, 5, 0, Math.PI * 2); ctx.fill();
  ctx.stroke();

  // MINIATURE UNICORN FIGURINE ON TOP
  ctx.save();
  const uX = boxX + 22;
  const uY = boxY - 2;

  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#c7d2fe";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(uX + 14, uY + 20, 11, 8, 0, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();

  [uX + 7, uX + 11, uX + 17, uX + 21].forEach(lx => {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(lx, uY + 24, 3, 7);
    ctx.fillStyle = "#fde047";
    ctx.fillRect(lx, uY + 29, 3, 2);
  });

  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.moveTo(uX + 20, uY + 19);
  ctx.lineTo(uX + 25, uY + 10);
  ctx.lineTo(uX + 29, uY + 11);
  ctx.lineTo(uX + 27, uY + 17);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  ctx.beginPath();
  ctx.ellipse(uX + 27, uY + 11, 5.5, 4.5, 0, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();

  ctx.fillStyle = "#4338ca";
  ctx.beginPath(); ctx.arc(uX + 27, uY + 10, 1.3, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = "#fde047";
  ctx.strokeStyle = "#ca8a04";
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(uX + 27, uY + 7); ctx.lineTo(uX + 29, uY + 1); ctx.lineTo(uX + 31, uY + 7);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  ctx.strokeStyle = "#f472b6";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(uX + 23, uY + 8);
  ctx.quadraticCurveTo(uX + 20, uY + 14, uX + 22, uY + 20);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(uX + 6, uY + 20);
  ctx.quadraticCurveTo(uX + 1, uY + 23, uX + 3, uY + 28);
  ctx.stroke();
  ctx.restore();

  ctx.restore();

  ctx.restore();

  // ================= 4. PIP'S ADORABLE SKULL HEAD =================
  ctx.save();
  const headY = baseY - 165;

  const skullGrad = ctx.createRadialGradient(cx - 5, headY - 10, 10, cx, headY, 70);
  skullGrad.addColorStop(0, "#ffffff");
  skullGrad.addColorStop(0.7, "#fdf9f4");
  skullGrad.addColorStop(1, "#f4ece1");
  ctx.fillStyle = skullGrad;
  ctx.strokeStyle = "#ebdcd0";
  ctx.lineWidth = 2.2;

  ctx.beginPath();
  ctx.ellipse(cx, headY, 68, 64, 0, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx - 58, headY + 5);
  ctx.bezierCurveTo(cx - 65, headY + 38, cx - 35, headY + 52, cx, headY + 52);
  ctx.bezierCurveTo(cx + 35, headY + 52, cx + 65, headY + 38, cx + 58, headY + 5);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  ctx.strokeStyle = "rgba(213, 199, 184, 0.75)";
  ctx.lineWidth = 1.5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(cx, headY - 58);
  ctx.quadraticCurveTo(cx - 3, headY - 48, cx + 1, headY - 38);
  ctx.quadraticCurveTo(cx - 2, headY - 30, cx, headY - 22);
  ctx.stroke();

  const eyeSocketGrad = ctx.createRadialGradient(cx - 30, headY + 7, 3, cx - 30, headY + 7, 24);
  eyeSocketGrad.addColorStop(0, "#1f1728");
  eyeSocketGrad.addColorStop(1, "#0d0713");
  ctx.fillStyle = eyeSocketGrad;

  ctx.beginPath();
  ctx.ellipse(cx - 30, headY + 8, 21, 24, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(cx + 30, headY + 8, 21, 24, 0, 0, Math.PI * 2);
  ctx.fill();

  // Eye glow
  [cx - 26, cx + 26].forEach(ex => {
    const ey = headY + 10;
    const eg = ctx.createRadialGradient(ex, ey, 1, ex, ey, 12);
    eg.addColorStop(0, "rgba(255, 255, 255, 1)");
    eg.addColorStop(0.3, "rgba(254, 240, 138, 0.9)");
    eg.addColorStop(0.7, "rgba(245, 158, 11, 0.5)");
    eg.addColorStop(1, "rgba(245, 158, 11, 0)");
    ctx.fillStyle = eg;
    ctx.beginPath(); ctx.arc(ex, ey, 12, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.beginPath(); ctx.arc(ex, ey, 2.5, 0, Math.PI * 2); ctx.fill();

    ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(ex, ey - 6); ctx.lineTo(ex, ey + 6);
    ctx.moveTo(ex - 6, ey); ctx.lineTo(ex + 6, ey);
    ctx.stroke();
  });

  ctx.fillStyle = "#2d2235";
  ctx.beginPath();
  ctx.moveTo(cx - 3, headY + 26);
  ctx.lineTo(cx + 3, headY + 26);
  ctx.lineTo(cx, headY + 31);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#18101e";
  ctx.beginPath(); ctx.arc(cx - 1.5, headY + 27, 1.2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx + 1.5, headY + 27, 1.2, 0, Math.PI * 2); ctx.fill();

  ctx.strokeStyle = "#3b2b45";
  ctx.lineWidth = 2.8;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(cx, headY + 32, 10, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();

  const blushLeft = ctx.createRadialGradient(cx - 48, headY + 28, 2, cx - 48, headY + 28, 18);
  blushLeft.addColorStop(0, "rgba(252, 165, 165, 0.75)");
  blushLeft.addColorStop(0.6, "rgba(244, 114, 182, 0.45)");
  blushLeft.addColorStop(1, "rgba(244, 114, 182, 0)");
  ctx.fillStyle = blushLeft;
  ctx.beginPath(); ctx.arc(cx - 48, headY + 28, 18, 0, Math.PI * 2); ctx.fill();

  const blushRight = ctx.createRadialGradient(cx + 48, headY + 28, 2, cx + 48, headY + 28, 18);
  blushRight.addColorStop(0, "rgba(252, 165, 165, 0.75)");
  blushRight.addColorStop(0.6, "rgba(244, 114, 182, 0.45)");
  blushRight.addColorStop(1, "rgba(244, 114, 182, 0)");
  ctx.fillStyle = blushRight;
  ctx.beginPath(); ctx.arc(cx + 48, headY + 28, 18, 0, Math.PI * 2); ctx.fill();
  ctx.restore();

  // ================= 5. SLEEPY NIGHTCAP WITH BOW & POM-POM =================
  ctx.save();
  const capY = headY - 45;

  const capGrad = ctx.createLinearGradient(cx - 70, capY - 40, cx + 70, capY + 40);
  capGrad.addColorStop(0, "#ffffff");
  capGrad.addColorStop(0.3, "#fce7f3");
  capGrad.addColorStop(0.7, "#fbcfe8");
  capGrad.addColorStop(1, "#f4a6b8");
  ctx.fillStyle = capGrad;
  ctx.strokeStyle = "#f4a6b8";
  ctx.lineWidth = 2.2;

  ctx.beginPath();
  ctx.moveTo(cx - 62, capY + 22);
  ctx.bezierCurveTo(cx - 75, capY - 15, cx - 55, capY - 50, cx, capY - 52);
  ctx.bezierCurveTo(cx + 50, capY - 52, cx + 72, capY - 20, cx + 64, capY + 22);
  ctx.bezierCurveTo(cx + 40, capY + 16, cx - 40, capY + 16, cx - 62, capY + 22);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx - 35, capY - 42);
  ctx.bezierCurveTo(cx - 85, capY - 42, cx - 118, capY - 5, cx - 124, capY + 35);
  ctx.bezierCurveTo(cx - 128, capY + 60, cx - 110, capY + 70, cx - 105, capY + 55);
  ctx.bezierCurveTo(cx - 100, capY + 32, cx - 75, capY - 10, cx - 35, capY - 42);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#fbcfe8";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(cx - 120, capY + 50, 18, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = "#fff7ed";
  ctx.beginPath();
  ctx.arc(cx - 123, capY + 47, 13, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#fdf2f8";
  ctx.strokeStyle = "#fbcfe8";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - 64, capY + 20);
  ctx.quadraticCurveTo(cx, capY + 10, cx + 64, capY + 20);
  ctx.quadraticCurveTo(cx, capY + 28, cx - 64, capY + 20);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  drawStar(cx - 5, capY - 25, 4.5, 2, "#fde047");
  drawStar(cx + 30, capY - 16, 4.5, 2, "#fde047");
  drawStar(cx - 75, capY + 5, 4, 1.8, "#fde047");
  ctx.fillStyle = "#ffffff";
  [
    [cx - 25, capY - 15],
    [cx + 12, capY - 32],
    [cx + 45, capY],
    [cx - 92, capY + 25]
  ].forEach(([px, py]) => {
    ctx.beginPath(); ctx.arc(px, py, 2.2, 0, Math.PI * 2); ctx.fill();
  });

  // Pink Bow
  ctx.save();
  ctx.translate(cx - 46, capY + 17);
  ctx.fillStyle = "#f472b6";
  ctx.strokeStyle = "#db2777";
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(-18, -14, -24, 6, -4, 5);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(18, -14, 24, 6, 4, 5);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  ctx.fillStyle = "#fbcfe8";
  ctx.beginPath();
  ctx.ellipse(0, 0, 6, 5, 0, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();

  ctx.fillStyle = "#f472b6";
  ctx.beginPath();
  ctx.moveTo(-2, 2); ctx.quadraticCurveTo(-8, 14, -12, 18); ctx.lineTo(-6, 18); ctx.quadraticCurveTo(-2, 12, 0, 4);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(2, 2); ctx.quadraticCurveTo(8, 14, 12, 18); ctx.lineTo(6, 18); ctx.quadraticCurveTo(2, 12, 0, 4);
  ctx.fill();
  ctx.restore();

  ctx.restore();
`;

// 2. Focused Dream Lantern Canvas Code
const lanternCanvasCode = `
  const W = canvas.width;
  const H = canvas.height;
  const cx = W / 2;
  const cy = H / 2;

  const halo = ctx.createRadialGradient(cx, cy + 5, 10, cx, cy + 5, W * 0.45);
  halo.addColorStop(0, "rgba(254, 240, 138, 0.8)");
  halo.addColorStop(0.5, "rgba(253, 224, 71, 0.35)");
  halo.addColorStop(1, "rgba(253, 224, 71, 0)");
  ctx.fillStyle = halo;
  ctx.beginPath(); ctx.arc(cx, cy + 5, W * 0.45, 0, Math.PI * 2); ctx.fill();

  ctx.strokeStyle = "#fde047";
  ctx.lineWidth = 3.5;
  ctx.lineCap = "round";
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    const r1 = W * 0.38;
    const r2 = W * 0.45;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * r1, cy + 5 + Math.sin(a) * r1);
    ctx.lineTo(cx + Math.cos(a) * r2, cy + 5 + Math.sin(a) * r2);
    ctx.stroke();
  }

  ctx.strokeStyle = "#eab308";
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.arc(cx, cy - 80, 24, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = "#eab308";
  ctx.strokeStyle = "#713f12";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx - 65, cy - 35);
  ctx.quadraticCurveTo(cx, cy - 65, cx + 65, cy - 35);
  ctx.lineTo(cx + 70, cy - 20);
  ctx.lineTo(cx - 70, cy - 20);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  function drawStar(x, y, r1, r2, color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const a = (i * Math.PI) / 2;
      const b = a + Math.PI / 4;
      if (i === 0) ctx.moveTo(x + Math.cos(a) * r1, y + Math.sin(a) * r1);
      else ctx.lineTo(x + Math.cos(a) * r1, y + Math.sin(a) * r1);
      ctx.lineTo(x + Math.cos(b) * r2, y + Math.sin(b) * r2);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  drawStar(cx, cy - 42, 9, 4.5, "#fffbeb");

  ctx.fillStyle = "#fffbeb";
  ctx.strokeStyle = "#ca8a04";
  ctx.lineWidth = 6;
  ctx.roundRect(cx - 56, cy - 20, 112, 85, 8);
  ctx.fill(); ctx.stroke();

  const flame = ctx.createRadialGradient(cx, cy + 22, 6, cx, cy + 22, 38);
  flame.addColorStop(0, "#ffffff");
  flame.addColorStop(0.35, "#fef08a");
  flame.addColorStop(0.75, "#f59e0b");
  flame.addColorStop(1, "#d97706");
  ctx.fillStyle = flame;
  ctx.beginPath(); ctx.arc(cx, cy + 22, 34, 0, Math.PI * 2); ctx.fill();
  drawStar(cx, cy + 22, 10, 5, "#ffffff");

  ctx.strokeStyle = "#ca8a04";
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(cx - 20, cy - 20); ctx.lineTo(cx - 20, cy + 65);
  ctx.moveTo(cx + 20, cy - 20); ctx.lineTo(cx + 20, cy + 65);
  ctx.stroke();

  ctx.fillStyle = "#eab308";
  ctx.strokeStyle = "#713f12";
  ctx.lineWidth = 3;
  ctx.roundRect(cx - 68, cy + 65, 136, 18, 5);
  ctx.fill(); ctx.stroke();
  ctx.roundRect(cx - 52, cy + 83, 104, 12, 4);
  ctx.fill(); ctx.stroke();
`;

// 3. Focused Lullaby Music Box Canvas Code
const musicBoxCanvasCode = `
  const W = canvas.width;
  const H = canvas.height;
  const cx = W / 2;
  const cy = H / 2 + 30;

  function drawStar(x, y, r1, r2, color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const a = (i * Math.PI) / 2;
      const b = a + Math.PI / 4;
      if (i === 0) ctx.moveTo(x + Math.cos(a) * r1, y + Math.sin(a) * r1);
      else ctx.lineTo(x + Math.cos(a) * r1, y + Math.sin(a) * r1);
      ctx.lineTo(x + Math.cos(b) * r2, y + Math.sin(b) * r2);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  drawStar(cx - 90, cy - 110, 10, 4, "#fde047");
  drawStar(cx + 90, cy - 90, 11, 4.5, "#fde047");
  ctx.fillStyle = "#f472b6";
  ctx.beginPath(); ctx.arc(cx - 70, cy - 50, 4, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#c084fc";
  ctx.beginPath(); ctx.arc(cx + 80, cy - 40, 4.5, 0, Math.PI * 2); ctx.fill();

  // MINIATURE UNICORN FIGURINE ON TOP
  ctx.save();
  const uX = cx - 35;
  const uY = cy - 130;

  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#c7d2fe";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.ellipse(uX + 32, uY + 45, 24, 16, 0, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();

  [uX + 16, uX + 26, uX + 38, uX + 48].forEach(lx => {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(lx, uY + 54, 6, 18);
    ctx.fillStyle = "#fde047";
    ctx.fillRect(lx, uY + 68, 6, 4);
  });

  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.moveTo(uX + 45, uY + 44);
  ctx.lineTo(uX + 56, uY + 22);
  ctx.lineTo(uX + 66, uY + 24);
  ctx.lineTo(uX + 62, uY + 38);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  ctx.beginPath();
  ctx.ellipse(uX + 62, uY + 24, 11, 9, 0, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();

  ctx.fillStyle = "#4338ca";
  ctx.beginPath(); ctx.arc(uX + 62, uY + 22, 2.5, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = "#fde047";
  ctx.strokeStyle = "#ca8a04";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(uX + 62, uY + 16); ctx.lineTo(uX + 67, uY + 2); ctx.lineTo(uX + 71, uY + 16);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  ctx.strokeStyle = "#f472b6";
  ctx.lineWidth = 5.5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(uX + 51, uY + 18);
  ctx.quadraticCurveTo(uX + 44, uY + 28, uX + 48, uY + 40);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(uX + 13, uY + 42);
  ctx.quadraticCurveTo(uX + 3, uY + 46, uX + 7, uY + 58);
  ctx.stroke();
  ctx.restore();

  // Music Box Cylinder Body
  ctx.fillStyle = "#c7d2fe";
  ctx.strokeStyle = "#818cf8";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(cx - 75, cy - 25);
  ctx.lineTo(cx - 75, cy + 45);
  ctx.bezierCurveTo(cx - 75, cy + 65, cx + 75, cy + 65, cx + 75, cy + 45);
  ctx.lineTo(cx + 75, cy - 25);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  ctx.fillStyle = "#fbcfe8";
  ctx.strokeStyle = "#f472b6";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(cx, cy - 25, 75, 20, 0, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();

  ctx.fillStyle = "#fef08a";
  ctx.beginPath();
  ctx.ellipse(cx, cy - 25, 68, 16, 0, 0, Math.PI * 2);
  ctx.fill();

  drawStar(cx - 40, cy + 18, 10, 4.5, "#fde047");
  drawStar(cx, cy + 22, 12, 5, "#fde047");
  drawStar(cx + 40, cy + 18, 10, 4.5, "#fde047");

  ctx.strokeStyle = "#ca8a04";
  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(cx + 75, cy + 10); ctx.lineTo(cx + 100, cy + 10);
  ctx.stroke();
  ctx.fillStyle = "#fde047";
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(cx + 100, cy + 10, 11, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
`;

// 4. Focused Sleeping Moon Canvas Code
const moonCanvasCode = `
  const W = canvas.width;
  const H = canvas.height;
  const cx = W / 2;
  const cy = H / 2 - 10;

  function drawStar(x, y, r1, r2, color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const a = (i * Math.PI) / 2;
      const b = a + Math.PI / 4;
      if (i === 0) ctx.moveTo(x + Math.cos(a) * r1, y + Math.sin(a) * r1);
      else ctx.lineTo(x + Math.cos(a) * r1, y + Math.sin(a) * r1);
      ctx.lineTo(x + Math.cos(b) * r2, y + Math.sin(b) * r2);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  const halo = ctx.createRadialGradient(cx, cy, 30, cx, cy, 140);
  halo.addColorStop(0, "rgba(254, 240, 138, 0.6)");
  halo.addColorStop(0.6, "rgba(253, 224, 71, 0.2)");
  halo.addColorStop(1, "rgba(253, 224, 71, 0)");
  ctx.fillStyle = halo;
  ctx.beginPath(); ctx.arc(cx, cy, 140, 0, Math.PI * 2); ctx.fill();

  drawStar(cx - 100, cy - 70, 14, 5, "#f472b6");
  drawStar(cx + 100, cy + 80, 15, 5, "#c084fc");
  ctx.fillStyle = "#fde047";
  ctx.beginPath(); ctx.arc(cx - 90, cy + 80, 4.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx + 100, cy - 80, 5, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = "#fef08a";
  ctx.strokeStyle = "#f59e0b";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(cx + 40, cy - 40, 95, 0.45 * Math.PI, 1.45 * Math.PI, false);
  ctx.bezierCurveTo(cx - 20, cy + 10, cx - 10, cy - 80, cx + 40, cy - 40);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  ctx.strokeStyle = "#78350f";
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(cx - 15, cy - 10, 11, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx - 6, cy - 3); ctx.lineTo(cx - 1, cy + 2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx - 24, cy - 3); ctx.lineTo(cx - 29, cy + 2); ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx - 10, cy + 20, 8, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();

  ctx.fillStyle = "rgba(244, 114, 182, 0.65)";
  ctx.beginPath(); ctx.arc(cx + 2, cy + 5, 12, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#fce7f3";
  ctx.lineWidth = 2.5;
  [
    { x: cx - 45, y: cy + 95, r: 28 },
    { x: cx,      y: cy + 100, r: 34 },
    { x: cx + 45, y: cy + 95, r: 26 }
  ].forEach(p => {
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  });
`;

console.log('Rendering all assets with pure HTML5 Canvas 2D...');

// Render transparent Pip character
renderCanvasToPng(pipDrawingCode(false), '/app/applet/public/assets/pip-waving-cloud.png', 512, 512, false);
renderCanvasToPng(pipDrawingCode(false), '/app/applet/public/assets/pip_avatar_cloud.png', 512, 512, false);

// Render full framed portrait with warm cream background, crescent moon, and stars
renderCanvasToPng(pipDrawingCode(true),  '/app/applet/public/assets/pip_portrait.png', 512, 768, true);

// Render isolated Track 1 tools
renderCanvasToPng(lanternCanvasCode,   '/app/applet/public/assets/pip_dream_lantern.png', 384, 384, false);
renderCanvasToPng(musicBoxCanvasCode,  '/app/applet/public/assets/pip_lullaby_box.png', 384, 384, false);
renderCanvasToPng(moonCanvasCode,      '/app/applet/public/assets/sleeping_moon.png', 384, 384, false);

// Save JPEG copies for compatibility
fs.copyFileSync('/app/applet/public/assets/pip_portrait.png', '/app/applet/public/assets/pip_portrait.jpg');
fs.copyFileSync('/app/applet/public/assets/pip_avatar_cloud.png', '/app/applet/public/assets/pip_avatar_cloud.jpg');
fs.copyFileSync('/app/applet/public/assets/pip_dream_lantern.png', '/app/applet/public/assets/pip_dream_lantern.jpg');
fs.copyFileSync('/app/applet/public/assets/pip_lullaby_box.png', '/app/applet/public/assets/pip_lullaby_box.jpg');

console.log('PURE CANVAS RENDERING COMPLETED SUCCESSFULLY!');
