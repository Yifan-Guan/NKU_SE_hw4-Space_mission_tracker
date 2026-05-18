// generate-brief.js — Creates the official mission briefing .docx
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
  LevelFormat
} = require('docx');
const fs = require('fs');

const border = { style: BorderStyle.SINGLE, size: 1, color: 'C0C8D8' };
const borders = { top: border, bottom: border, left: border, right: border };

function headerCell(text) {
  return new TableCell({
    borders,
    shading: { fill: '0F2044', type: ShadingType.CLEAR },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    width: { size: 2340, type: WidthType.DXA },
    children: [new Paragraph({
      children: [new TextRun({ text, bold: true, color: '3ECFCF', font: 'Courier New', size: 18 })]
    })]
  });
}

function dataCell(text, width = 2340) {
  return new TableCell({
    borders,
    shading: { fill: '0A1628', type: ShadingType.CLEAR },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    width: { size: width, type: WidthType.DXA },
    children: [new Paragraph({
      children: [new TextRun({ text, font: 'Courier New', size: 18, color: 'A8C0E0' })]
    })]
  });
}

const missions = [
  { id: 'MSN-001', name: 'Helios Vanguard', dest: 'Mars Orbit',    status: 'EN ROUTE',  crew: 3 },
  { id: 'MSN-002', name: 'Artemis Deep',    dest: 'Europa',        status: 'LAUNCHED',  crew: 2 },
  { id: 'MSN-003', name: 'Outrider IX',     dest: 'Titan',         status: 'CRITICAL',  crew: 4 },
  { id: 'MSN-004', name: 'Solaris One',     dest: 'L2 Point',      status: 'COMPLETED', crew: 1 },
];

const doc = new Document({
  styles: {
    default: {
      document: { run: { font: 'Courier New', size: 22, color: 'C8D8F0' } }
    },
    paragraphStyles: [
      {
        id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 36, bold: true, font: 'Courier New', color: '3ECFCF' },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 }
      },
      {
        id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 26, bold: true, font: 'Courier New', color: 'A3E635' },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 }
      },
    ]
  },
  numbering: {
    config: [
      {
        reference: 'bullets',
        levels: [{ level: 0, format: LevelFormat.BULLET, text: '›', alignment: AlignmentType.LEFT,
          style: { run: { font: 'Courier New', color: '3ECFCF' },
                   paragraph: { indent: { left: 720, hanging: 360 } } } }]
      }
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    children: [
      // Title block
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 480, after: 80 },
        children: [new TextRun({ text: '★  CLASSIFIED  ★', bold: true, size: 44, font: 'Courier New', color: 'F87171' })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 60 },
        children: [new TextRun({ text: 'SPACE MISSION TRACKER', bold: true, size: 52, font: 'Courier New', color: '3ECFCF' })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 80 },
        children: [new TextRun({ text: 'OFFICIAL MISSION BRIEFING DOCUMENT', size: 24, font: 'Courier New', color: '94A3B8' })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 480 },
        children: [new TextRun({ text: 'Date: 2026-05-18  |  Clearance Level: ALPHA', size: 20, font: 'Courier New', color: '64748B' })]
      }),

      // Section 1
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('1. Executive Summary')] }),
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun({
          text: 'This document provides an authoritative overview of all active, launched, and completed deep-space missions under the jurisdiction of the Space Mission Tracker program. Mission commanders and ground control personnel are to treat this brief as the primary reference for operational status.',
          font: 'Courier New', size: 22, color: 'A8C0E0'
        })]
      }),

      // Section 2 — Mission Registry Table
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('2. Mission Registry')] }),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [1400, 2200, 2200, 1680, 1880],
        rows: [
          new TableRow({
            tableHeader: true,
            children: [
              headerCell('ID'),
              headerCell('Mission Name'),
              headerCell('Destination'),
              headerCell('Status'),
              headerCell('Crew'),
            ]
          }),
          ...missions.map(m => new TableRow({
            children: [
              dataCell(m.id, 1400),
              dataCell(m.name, 2200),
              dataCell(m.dest, 2200),
              dataCell(m.status, 1680),
              dataCell(String(m.crew) + ' personnel', 1880),
            ]
          }))
        ]
      }),

      // Section 3 — Mission Profiles
      new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 480 }, children: [new TextRun('3. Mission Profiles')] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('3.1 MSN-001 — Helios Vanguard')] }),
      new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: 'Target: Mars Orbit insertion via Hohmann transfer trajectory', font: 'Courier New', size: 22, color: 'A8C0E0' })] }),
      new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: 'Fuel reserve: 61% — within safe operational envelope', font: 'Courier New', size: 22, color: 'A8C0E0' })] }),
      new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: 'Signal delay: 314 seconds (5m 14s) — standard at current distance', font: 'Courier New', size: 22, color: 'A8C0E0' })] }),
      new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: 'All crew health indicators: NOMINAL', font: 'Courier New', size: 22, color: 'A8C0E0' })] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 240 }, children: [new TextRun('3.2 MSN-003 — Outrider IX (CRITICAL)')] }),
      new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: 'ALERT: Fuel reserves at 28% — immediate conservation protocol in effect', font: 'Courier New', size: 22, color: 'F87171' })] }),
      new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: 'Radiation levels elevated at 1.9 mSv — crew exposure monitoring active', font: 'Courier New', size: 22, color: 'F87171' })] }),
      new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: 'Crew members Clarke (CRITICAL) and Petrov/Park (DEGRADED) require medical attention', font: 'Courier New', size: 22, color: 'F87171' })] }),
      new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: 'Ground team to prepare contingency rescue trajectory', font: 'Courier New', size: 22, color: 'A8C0E0' })] }),

      // Section 4
      new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 480 }, children: [new TextRun('4. Authorization')] }),
      new Paragraph({
        spacing: { after: 480 },
        children: [new TextRun({ text: 'This brief is authorized by Mission Control HQ. Distribution restricted to personnel with clearance level ALPHA or above. Unauthorized disclosure is a breach of interplanetary security protocol.', font: 'Courier New', size: 20, color: '64748B' })]
      }),
      new Paragraph({
        children: [new TextRun({ text: '___________________________        ___________________________', font: 'Courier New', size: 20, color: '3ECFCF' })]
      }),
      new Paragraph({
        spacing: { after: 80 },
        children: [new TextRun({ text: 'Mission Director                   Chief of Operations', font: 'Courier New', size: 20, color: '94A3B8' })]
      }),
    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync('docs/mission-brief.docx', buf);
  console.log('✓ docs/mission-brief.docx created');
});
