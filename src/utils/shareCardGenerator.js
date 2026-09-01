/**
 * Instagram Stories & TikTok 9:16 Share Card Canvas Generator
 * Renders a crisp 1080x1920 high-res image with Stalkr editorial typography
 */

import { formatShortDate } from './dates';

// Cross-browser rounded rectangle helper (prevents TypeError on browsers without native ctx.roundRect)
function drawRoundedRect(ctx, x, y, width, height, radius) {
  if (typeof ctx.roundRect === 'function') {
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
  } else {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.arcTo(x, y + height, x, y, radius);
    ctx.arcTo(x, y, x + width, y, radius);
    ctx.closePath();
  }
}

export function generateShareCardCanvas({
  name = 'Marcus Vance',
  startDate = '2026-10-01',
  endDate = '2026-12-29',
  commitments = [],
  completedStats = { daysCompleted: 90, totalPercentage: 100 },
  intention = 'Get focused',
  cardType = 'contract' // 'contract' | 'completion'
}) {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');

    if (!ctx) return null;

    const isCompletion = cardType === 'completion';

    // 1. Stalkr Dark Obsidian Background
    const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1920);
    bgGrad.addColorStop(0, '#09090b');
    bgGrad.addColorStop(0.5, '#121215');
    bgGrad.addColorStop(1, '#050507');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1080, 1920);

    // Subtle Stalkr vermillion glow in center
    const glowGrad = ctx.createRadialGradient(540, 700, 10, 540, 700, 600);
    glowGrad.addColorStop(0, 'rgba(255, 69, 0, 0.15)');
    glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, 0, 1080, 1920);

    // Faint subtle grid line frame
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 2;
    ctx.strokeRect(80, 80, 920, 1760);

    // Corner Accents (Stalkr Vermillion)
    const armLen = 30;
    ctx.strokeStyle = 'rgba(255, 69, 0, 0.8)';
    ctx.lineWidth = 4;
    // Top-left
    ctx.beginPath(); ctx.moveTo(80, 80 + armLen); ctx.lineTo(80, 80); ctx.lineTo(80 + armLen, 80); ctx.stroke();
    // Top-right
    ctx.beginPath(); ctx.moveTo(1000 - armLen, 80); ctx.lineTo(1000, 80); ctx.lineTo(1000, 80 + armLen); ctx.stroke();
    // Bottom-left
    ctx.beginPath(); ctx.moveTo(80, 1840 - armLen); ctx.lineTo(80, 1840); ctx.lineTo(80 + armLen, 1840); ctx.stroke();
    // Bottom-right
    ctx.beginPath(); ctx.moveTo(1000 - armLen, 1840); ctx.lineTo(1000, 1840); ctx.lineTo(1000, 1840 - armLen); ctx.stroke();

    // 2. Header Brand
    ctx.textAlign = 'center';
    ctx.fillStyle = '#FF4500';
    ctx.font = '700 24px "JetBrains Mono", monospace';
    ctx.fillText('ARC 90', 540, 180);

    // 3. Main Title Badge: MY CONTRACT (Day 0) vs COMPLETE (Day 90)
    ctx.fillStyle = '#FF4500';
    ctx.font = '900 72px "Funnel Sans", "Inter", sans-serif';
    ctx.fillText(isCompletion ? 'COMPLETE' : 'MY CONTRACT', 540, 280);

    // Divider Line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(340, 320);
    ctx.lineTo(740, 320);
    ctx.stroke();

    // 4. User Name
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 64px "Funnel Sans", "Inter", sans-serif';
    ctx.fillText((name || 'ARC TRAVELER').toUpperCase(), 540, 420);

    if (intention) {
      ctx.fillStyle = '#FF4500';
      ctx.font = '600 28px "Inter", sans-serif';
      ctx.fillText(`"${intention}"`, 540, 470);
    }

    // 5. Stat Pills Container
    const startFormatted = formatShortDate(startDate);
    const endFormatted = formatShortDate(endDate);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.strokeStyle = 'rgba(255, 69, 0, 0.3)';
    ctx.lineWidth = 2;

    // Outer Pill Box for Dates & Days
    drawRoundedRect(ctx, 160, 530, 760, 140, 24);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 36px "JetBrains Mono", monospace';
    ctx.fillText('90 DAYS', 350, 590);
    ctx.fillStyle = '#a1a1aa';
    ctx.font = '600 22px "Inter", sans-serif';
    ctx.fillText('DURATION', 350, 630);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath();
    ctx.moveTo(540, 550);
    ctx.lineTo(540, 650);
    ctx.stroke();

    ctx.fillStyle = '#FF4500';
    ctx.font = '700 36px "JetBrains Mono", monospace';
    ctx.fillText(isCompletion ? `${completedStats.totalPercentage}%` : 'VERIFIED', 730, 590);
    ctx.fillStyle = '#a1a1aa';
    ctx.font = '600 22px "Inter", sans-serif';
    ctx.fillText(isCompletion ? 'CONSISTENCY' : 'PLEDGE STATUS', 730, 630);

    // Date Range Subtext
    ctx.fillStyle = '#FF4500';
    ctx.font = '700 26px "JetBrains Mono", monospace';
    ctx.fillText(`${startFormatted}  →  ${endFormatted}`, 540, 730);

    // 6. Commitments List Header
    ctx.fillStyle = '#a1a1aa';
    ctx.font = '600 22px "Inter", sans-serif';
    ctx.fillText(isCompletion ? 'PROOF OF COMMITMENTS' : 'PROMISED COMMITMENTS', 540, 820);

    // Render Commitments as cards
    const startY = 860;
    const itemHeight = 105;

    commitments.slice(0, 6).forEach((comm, idx) => {
      const y = startY + idx * itemHeight;

      // Card background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1.5;
      drawRoundedRect(ctx, 160, y, 760, 85, 16);
      ctx.fill();
      ctx.stroke();

      // Check Icon circle
      ctx.fillStyle = '#FF4500';
      ctx.beginPath();
      ctx.arc(220, y + 42.5, 22, 0, Math.PI * 2);
      ctx.fill();

      // Check mark text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px "Inter", sans-serif';
      ctx.fillText('✓', 220, y + 50);

      // Commitment text
      ctx.textAlign = 'left';
      ctx.fillStyle = '#f4f4f5';
      ctx.font = '700 28px "Inter", sans-serif';
      ctx.fillText((comm.name || '').toUpperCase(), 270, y + 52);

      // Category tag
      if (comm.category) {
        ctx.textAlign = 'right';
        ctx.fillStyle = '#FF4500';
        ctx.font = '700 20px "JetBrains Mono", monospace';
        ctx.fillText(comm.category.toUpperCase(), 890, y + 51);
      }
    });

    // 7. Footer Tagline
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.beginPath();
    ctx.moveTo(240, 1640);
    ctx.lineTo(840, 1640);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 42px "Funnel Sans", "Inter", sans-serif';
    ctx.fillText('START BEFORE JANUARY.', 540, 1720);

    ctx.fillStyle = '#FF4500';
    ctx.font = '900 44px "Funnel Sans", "Inter", sans-serif';
    ctx.fillText('FINISH WITH PROOF.', 540, 1780);

    return canvas.toDataURL('image/png');
  } catch (err) {
    console.error('Failed to generate share card canvas:', err);
    return null;
  }
}
