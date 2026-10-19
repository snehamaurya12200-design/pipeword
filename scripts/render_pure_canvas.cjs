const { execSync } = require('child_process');
const fs = require('fs');

const chromePath = '/ms-playwright/chromium_headless_shell-1247/chrome-headless-shell-linux64/chrome-headless-shell';

function renderPage(drawFnName, isPortrait, outputPath, width, height, isOpaque = false) {
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
            background: ${isOpaque ? '#fffaf2' : 'transparent'};
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

          // Helper star
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

          function drawRoundRect(x, y, w, h, r) {
            ctx.beginPath();
            ctx.moveTo(x + r, y);
            ctx.lineTo(x + w - r, y);
            ctx.quadraticCurveTo(x + w, y, x + w, y + r);
            ctx.lineTo(x + w, y + h - r);
            ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
            ctx.lineTo(x + r, y + h);
            ctx.quadraticCurveTo(x, y + h, x, y + h - r);
            ctx.lineTo(x, y + r);
            ctx.quadraticCurveTo(x, y, x + r, y);
            ctx.closePath();
          }

          function drawPipMaster(isPortrait) {
            const W = canvas.width;
            const H = canvas.height;
            const cx = W / 2;
            const baseY = isPortrait ? 510 : 340;

            if (isPortrait) {
              // Warm cream parchment background
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
              ctx.fillStyle = "#fef08a";
              ctx.beginPath(); ctx.arc(W * 0.22, 320, 2.5, 0, Math.PI * 2); ctx.fill();
              ctx.beginPath(); ctx.arc(W * 0.78, 330, 2.5, 0, Math.PI * 2); ctx.fill();
              ctx.beginPath(); ctx.arc(W * 0.72, 110, 3, 0, Math.PI * 2); ctx.fill();

              // Sleeping Crescent Moon (Top Right)
              ctx.save();
              ctx.translate(W * 0.78, 100);
              const moonHalo = ctx.createRadialGradient(0, 0, 10, 0, 0, 50);
              moonHalo.addColorStop(0, "rgba(254, 240, 138, 0.4)");
              moonHalo.addColorStop(1, "rgba(254, 240, 138, 0)");
              ctx.fillStyle = moonHalo;
              ctx.beginPath(); ctx.arc(0, 0, 50, 0, Math.PI * 2); ctx.fill();

              ctx.fillStyle = "#fef08a";
              ctx.beginPath();
              ctx.arc(0, 0, 32, -Math.PI * 0.4, Math.PI * 0.6);
              ctx.bezierCurveTo(8, 18, 12, -10, 0, -32);
              ctx.fill();

              ctx.strokeStyle = "#854d0e";
              ctx.lineWidth = 2.2;
              ctx.lineCap = "round";
              ctx.beginPath();
              ctx.arc(8, 3, 6, 0.1 * Math.PI, 0.9 * Math.PI);
              ctx.stroke();
              ctx.beginPath(); ctx.moveTo(14, 6); ctx.lineTo(17, 9); ctx.stroke();
              ctx.beginPath();
              ctx.arc(10, 14, 4, 0.1 * Math.PI, 0.8 * Math.PI);
              ctx.stroke();
              ctx.fillStyle = "rgba(244, 114, 182, 0.6)";
              ctx.beginPath(); ctx.arc(14, 11, 4.5, 0, Math.PI * 2); ctx.fill();
              ctx.restore();
            }

            // ================= 1. CLOUD BASE =================
            ctx.save();
            const cloudY = baseY;
            ctx.fillStyle = "rgba(225, 200, 210, 0.45)";
            ctx.beginPath();
            ctx.ellipse(cx, cloudY + 16, 175, 40, 0, 0, Math.PI * 2);
            ctx.fill();

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

            ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
            ctx.lineWidth = 5;
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(cx - 130, cloudY - 22);
            ctx.bezierCurveTo(cx - 70, cloudY - 38, cx + 70, cloudY - 38, cx + 130, cloudY - 22);
            ctx.stroke();

            // Cloud text: "♥ Pip ♥"
            ctx.save();
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.font = "bold 32px 'Brush Script MT', 'Snell Roundhand', 'Comic Sans MS', cursive, sans-serif";
            ctx.fillStyle = "#f472b6";
            ctx.fillText("♥ Pip ♥", cx, cloudY + 14);
            ctx.restore();
            ctx.restore();

            // ================= 2. ONESIE PAJAMAS LOWER BODY =================
            ctx.save();
            const bodyY = baseY - 90;
            const onesieGrad = ctx.createRadialGradient(cx, bodyY, 15, cx, bodyY, 70);
            onesieGrad.addColorStop(0, "#ffffff");
            onesieGrad.addColorStop(0.5, "#fdf2f8");
            onesieGrad.addColorStop(1, "#fce7f3");
            ctx.fillStyle = onesieGrad;
            ctx.strokeStyle = "#fbcfe8";
            ctx.lineWidth = 2;

            ctx.beginPath();
            ctx.ellipse(cx, bodyY + 10, 68, 50, 0, 0, Math.PI * 2);
            ctx.fill(); ctx.stroke();

            // Left leg
            ctx.save();
            ctx.translate(cx - 55, bodyY + 35);
            ctx.rotate(-0.25);
            ctx.fillStyle = onesieGrad;
            ctx.beginPath();
            ctx.ellipse(0, 0, 38, 26, 0, 0, Math.PI * 2);
            ctx.fill(); ctx.stroke();
            ctx.fillStyle = "#c084fc";
            ctx.beginPath();
            ctx.ellipse(-24, 10, 22, 17, -0.1, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#e9d5ff";
            ctx.beginPath();
            ctx.ellipse(-24, 10, 16, 11, -0.1, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            // Right leg
            ctx.save();
            ctx.translate(cx + 55, bodyY + 35);
            ctx.rotate(0.25);
            ctx.fillStyle = onesieGrad;
            ctx.beginPath();
            ctx.ellipse(0, 0, 38, 26, 0, 0, Math.PI * 2);
            ctx.fill(); ctx.stroke();
            ctx.fillStyle = "#c084fc";
            ctx.beginPath();
            ctx.ellipse(24, 10, 22, 17, 0.1, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#e9d5ff";
            ctx.beginPath();
            ctx.ellipse(24, 10, 16, 11, 0.1, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            // Front seam and buttons
            ctx.strokeStyle = "#f472b6";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(cx, bodyY - 25);
            ctx.lineTo(cx, bodyY + 35);
            ctx.stroke();

            ctx.fillStyle = "#f472b6";
            [bodyY - 12, bodyY + 4, bodyY + 20].forEach(function(by) {
              ctx.beginPath(); ctx.arc(cx, by, 3, 0, Math.PI * 2); ctx.fill();
            });

            // Mini hearts on pajamas
            ctx.fillStyle = "rgba(244, 114, 182, 0.45)";
            function drawMiniHeart(hx, hy) {
              ctx.beginPath();
              ctx.arc(hx - 2, hy - 2, 2.5, Math.PI, 0, false);
              ctx.arc(hx + 2, hy - 2, 2.5, Math.PI, 0, false);
              ctx.lineTo(hx, hy + 4);
              ctx.closePath();
              ctx.fill();
            }
            drawMiniHeart(cx - 24, bodyY);
            drawMiniHeart(cx + 26, bodyY + 8);
            drawMiniHeart(cx - 36, bodyY + 22);
            drawMiniHeart(cx + 34, bodyY + 25);
            ctx.restore();

            // ================= 3. ARMS & HELD OBJECTS =================
            // Left arm (holding lantern)
            ctx.save();
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
            rays.forEach(function(r) {
              ctx.beginPath(); ctx.moveTo(r[0], r[1]); ctx.lineTo(r[2], r[3]); ctx.stroke();
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
            drawRoundRect(lanX + 14, lanY + 40, 36, 32, 4);
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
            drawRoundRect(lanX + 11, lanY + 72, 42, 7, 2);
            ctx.fill(); ctx.stroke();
            drawRoundRect(lanX + 16, lanY + 79, 32, 5, 2);
            ctx.fill(); ctx.stroke();

            // Right arm (holding music box)
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

            // MINI UNICORN ON TOP
            const uX = boxX + 22;
            const uY = boxY - 2;

            ctx.fillStyle = "#ffffff";
            ctx.strokeStyle = "#c7d2fe";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.ellipse(uX + 14, uY + 20, 11, 8, 0, 0, Math.PI * 2);
            ctx.fill(); ctx.stroke();

            [uX + 7, uX + 11, uX + 17, uX + 21].forEach(function(lx) {
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

            // ================= 4. ADORABLE SKULL HEAD =================
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

            // Cranial suture
            ctx.strokeStyle = "rgba(213, 199, 184, 0.75)";
            ctx.lineWidth = 1.5;
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(cx, headY - 58);
            ctx.quadraticCurveTo(cx - 3, headY - 48, cx + 1, headY - 38);
            ctx.quadraticCurveTo(cx - 2, headY - 30, cx, headY - 22);
            ctx.stroke();

            // Eye sockets
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

            // Eye golden glow points
            [cx - 26, cx + 26].forEach(function(ex) {
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

            // Nose
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

            // Smile
            ctx.strokeStyle = "#3b2b45";
            ctx.lineWidth = 2.8;
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.arc(cx, headY + 32, 10, 0.15 * Math.PI, 0.85 * Math.PI);
            ctx.stroke();

            // Pink cheeks
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

            // Drooping tail
            ctx.beginPath();
            ctx.moveTo(cx - 35, capY - 42);
            ctx.bezierCurveTo(cx - 85, capY - 42, cx - 118, capY - 5, cx - 124, capY + 35);
            ctx.bezierCurveTo(cx - 128, capY + 60, cx - 110, capY + 70, cx - 105, capY + 55);
            ctx.bezierCurveTo(cx - 100, capY + 32, cx - 75, capY - 10, cx - 35, capY - 42);
            ctx.closePath();
            ctx.fill(); ctx.stroke();

            // Pom-pom
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

            // Brim band
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
            ].forEach(function(pt) {
              ctx.beginPath(); ctx.arc(pt[0], pt[1], 2.2, 0, Math.PI * 2); ctx.fill();
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
          }

          // Invoke drawing function
          if ("${drawFnName}" === "pipMaster") {
            drawPipMaster(${isPortrait});
          }
        </script>
      </body>
    </html>
  `);

  try {
    const bgParam = isOpaque ? '--default-background-color=fffaf2' : '--default-background-color=00000000';
    execSync(`${chromePath} --headless --no-sandbox --disable-gpu --screenshot=${outputPath} --window-size=${width},${height} ${bgParam} file://${tmpHtml}`, { stdio: 'pipe' });
    console.log(`Rendered ${outputPath} (${width}x${height}) - size: ${fs.statSync(outputPath).size} bytes`);
  } finally {
    try { fs.unlinkSync(tmpHtml); } catch (e) {}
  }
}

console.log('Rendering full Pip characters...');
renderPage('pipMaster', false, '/app/applet/public/assets/pip-waving-cloud.png', 512, 512, false);
renderPage('pipMaster', false, '/app/applet/public/assets/pip_avatar_cloud.png', 512, 512, false);
renderPage('pipMaster', true,  '/app/applet/public/assets/pip_portrait.png', 512, 768, true);

// Copies
fs.copyFileSync('/app/applet/public/assets/pip_portrait.png', '/app/applet/public/assets/pip_portrait.jpg');
fs.copyFileSync('/app/applet/public/assets/pip_avatar_cloud.png', '/app/applet/public/assets/pip_avatar_cloud.jpg');

console.log('ALL PIP CHARACTERS RENDERED!');
