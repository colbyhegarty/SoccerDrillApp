import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Session } from '../types/session';
import { Drill } from '../types/drill';

function formatTime(minutes: number) {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hrs}:${mins.toString().padStart(2, '0')}`;
}

function formatBulletPoints(text: string): string[] {
  return text
    .split(/\n|(?:\d+\.\s)/)
    .map(line => line.replace(/^[-•*]\s*/, '').trim())
    .filter(Boolean);
}

function buildSessionHtml(session: Session, drillDetails?: Record<string, Drill>): string {
  const totalDuration = session.activities.reduce((s, a) => s + a.duration_minutes, 0);

  const dateStr = session.session_date
    ? new Date(session.session_date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    : '';

  let html = `
    <div style="font-family: -apple-system, 'Helvetica Neue', Helvetica, sans-serif; max-width: 780px; margin: 0 auto; padding: 20px 16px; color: #1a1a1a;">
      <!-- Header -->
      <div style="border-bottom: 2px solid #16a34a; padding-bottom: 12px; margin-bottom: 16px;">
        <h1 style="margin: 0 0 6px 0; font-size: 22px; font-weight: 700; color: #111;">${session.title || 'Training Session'}</h1>
        <div style="display: flex; flex-wrap: wrap; gap: 14px; font-size: 12px; color: #555; align-items: center;">
          ${dateStr ? `<span>📅 ${dateStr}</span>` : ''}
          ${session.session_time ? `<span>🕐 ${session.session_time}</span>` : ''}
          ${session.team_name ? `<span>👥 ${session.team_name}</span>` : ''}
          <span>⏱ ${totalDuration} min total</span>
        </div>
      </div>
  `;

  if (session.session_goals) {
    html += `
      <div style="background: #f0fdf4; border-left: 3px solid #16a34a; padding: 8px 12px; border-radius: 0 6px 6px 0; margin-bottom: 16px;">
        <div style="font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #16a34a; margin-bottom: 3px;">🎯 Session Goals</div>
        <p style="margin: 0; font-size: 12px; color: #333; line-height: 1.5;">${session.session_goals}</p>
      </div>
    `;
  }

  // Activities
  html += `<div style="font-weight: 700; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #16a34a; margin-bottom: 10px; padding-bottom: 4px; border-bottom: 1px solid #e5e7eb;">Activities</div>`;

  let currentTime = 0;
  session.activities.forEach((activity) => {
    const title = activity.title || activity.drill_name || 'Activity';
    const description = activity.description || '';
    const drillData = activity.library_drill_id && drillDetails ? drillDetails[activity.library_drill_id] : null;
    const instructions = drillData?.instructions || activity.drill_instructions || '';
    const setup = drillData?.setup || activity.drill_setup || '';

    html += `
      <div style="margin-bottom: 12px; page-break-inside: avoid; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
        <div style="background: #f8fafc; padding: 6px 12px; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center;">
          <div style="font-weight: 700; font-size: 12px; color: #111;">
            <span style="color: #16a34a; font-family: monospace; margin-right: 6px;">${formatTime(currentTime)}</span>
            ${title.toUpperCase()}
          </div>
          <div style="font-size: 11px; color: #666; font-weight: 600;">⏱ ${activity.duration_minutes} min</div>
        </div>
        <div style="padding: 10px 12px;">
    `;

    const hasRightContent = setup || instructions || description;

    if (activity.drill_svg_url && hasRightContent) {
      html += `<div style="display: flex; gap: 10px; align-items: flex-start;">`;
      html += `
        <div style="flex-shrink: 0; border-radius: 6px; overflow: hidden; width: 220px;">
          <img src="${activity.drill_svg_url}" style="width: 100%; height: auto; display: block;">
        </div>
      `;
      html += `<div style="flex: 1; min-width: 0;">`;

      if (description) {
        html += `<p style="color: #444; font-size: 11px; line-height: 1.5; margin: 0 0 6px 0;">${description}</p>`;
      }

      if (setup) {
        const setupPoints = formatBulletPoints(setup);
        if (setupPoints.length > 0) {
          html += `
            <div style="margin-bottom: 6px;">
              <div style="font-weight: 600; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; color: #16a34a; margin-bottom: 3px;">Setup</div>
              <div style="padding-left: 2px;">
                ${setupPoints.map(p => `<div style="font-size: 10px; color: #333; line-height: 1.4; margin-bottom: 1px;">▸ ${p}</div>`).join('')}
              </div>
            </div>
          `;
        }
      }

      if (instructions) {
        const points = formatBulletPoints(instructions);
        if (points.length > 0) {
          html += `
            <div style="margin-bottom: 6px;">
              <div style="font-weight: 600; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; color: #16a34a; margin-bottom: 3px;">Instructions</div>
              <div style="padding-left: 2px;">
                ${points.map(p => `<div style="font-size: 10px; color: #333; line-height: 1.4; margin-bottom: 1px;">▸ ${p}</div>`).join('')}
              </div>
            </div>
          `;
        }
      }

      html += `</div></div>`;
    } else {
      if (activity.drill_svg_url) {
        html += `
          <div style="margin-bottom: 8px; border-radius: 6px; overflow: hidden; max-width: 220px;">
            <img src="${activity.drill_svg_url}" style="width: 100%; height: auto; display: block;">
          </div>
        `;
      }
      if (description) {
        html += `<p style="color: #444; font-size: 11px; line-height: 1.5; margin: 0 0 6px 0;">${description}</p>`;
      }
    }

    if (activity.activity_notes) {
      html += `
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 5px 10px; border-radius: 6px; margin-top: 6px;">
          <span style="font-size: 10px; color: #166534;">📝 ${activity.activity_notes}</span>
        </div>
      `;
    }

    html += '</div></div>';
    currentTime += activity.duration_minutes;
  });

  // Equipment
  if (session.equipment.length > 0) {
    html += `
      <div style="margin-top: 16px; page-break-inside: avoid;">
        <div style="font-weight: 700; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #16a34a; margin-bottom: 8px; padding-bottom: 4px; border-bottom: 1px solid #e5e7eb;">Equipment Checklist</div>
        <div style="display: flex; flex-wrap: wrap; gap: 6px;">
          ${session.equipment.map(e => `<span style="display: inline-flex; align-items: center; gap: 5px; background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 16px; padding: 4px 12px; font-size: 11px;">☐ ${e.name}${e.quantity ? ` (×${e.quantity})` : ''}</span>`).join('')}
        </div>
      </div>
    `;
  }

  html += '</div>';
  return html;
}

/**
 * Generate a PDF from a session and open the native share sheet.
 */
export async function exportSessionToPDF(
  session: Session,
  drillDetails?: Record<string, Drill>,
): Promise<string> {
  const html = buildSessionHtml(session, drillDetails);

  const fullHtml = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
        <style>
          @media print {
            body { margin: 0; }
            @page { margin: 12mm; }
          }
        </style>
      </head>
      <body style="margin: 0; background: white;">
        ${html}
      </body>
    </html>
  `;

  const { uri } = await Print.printToFileAsync({
    html: fullHtml,
    base64: false,
  });

  return uri;
}

/**
 * Generate PDF and immediately open native share sheet.
 */
export async function exportAndSharePDF(
  session: Session,
  drillDetails?: Record<string, Drill>,
): Promise<void> {
  const uri = await exportSessionToPDF(session, drillDetails);
  await Sharing.shareAsync(uri, {
    mimeType: 'application/pdf',
    dialogTitle: `${session.title || 'Session'} PDF`,
    UTI: 'com.adobe.pdf',
  });
}

/**
 * Generate PDF and return the URI for use with email/SMS composing.
 */
export async function generatePDFUri(
  session: Session,
  drillDetails?: Record<string, Drill>,
): Promise<string> {
  return exportSessionToPDF(session, drillDetails);
}
