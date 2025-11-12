#!/usr/bin/env node

/**
 * ADR Auto-Index Generator for GRAPES Hub
 *
 * Automatically generates an index of Architecture Decision Records (ADRs)
 * Usage: node scripts/adr-index.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ADR_DIR = path.join(__dirname, '..', '.adr');
const OUTPUT_FILE = path.join(__dirname, '..', 'docs', 'docs', 'adr.md');

/**
 * Extract title from ADR markdown file
 */
function extractTitle(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    // Look for first markdown heading
    for (const line of lines) {
      const match = line.match(/^#\s+(.+)$/);
      if (match) {
        return match[1].trim();
      }
    }

    // Fallback to filename
    return path.basename(filePath, '.md');
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    return path.basename(filePath, '.md');
  }
}

/**
 * Extract date from ADR content
 */
function extractDate(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const dateMatch = content.match(/Date:\s*(\d{4}-\d{2}-\d{2})/);
    return dateMatch ? dateMatch[1] : 'N/A';
  } catch (error) {
    return 'N/A';
  }
}

/**
 * Extract status from ADR content
 */
function extractStatus(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const statusMatch = content.match(/Status:\s*(\w+)/i);
    return statusMatch ? statusMatch[1] : 'Unknown';
  } catch (error) {
    return 'Unknown';
  }
}

/**
 * Get all ADR files
 */
function getADRFiles() {
  try {
    const files = fs.readdirSync(ADR_DIR);
    return files
      .filter(f => f.match(/^\d+.*\.md$/))
      .sort((a, b) => {
        const numA = parseInt(a.match(/^(\d+)/)?.[1] || '0');
        const numB = parseInt(b.match(/^(\d+)/)?.[1] || '0');
        return numA - numB;
      });
  } catch (error) {
    console.error(`Error reading ADR directory: ${error.message}`);
    return [];
  }
}

/**
 * Generate ADR index markdown
 */
function generateIndex(adrFiles) {
  const lines = [];

  // Header
  lines.push('---');
  lines.push('sidebar_position: 9');
  lines.push('---');
  lines.push('');
  lines.push('# Architecture Decision Records');
  lines.push('');
  lines.push('This page provides an index of all Architecture Decision Records (ADRs) in the GRAPES Hub project.');
  lines.push('');
  lines.push('## What are ADRs?');
  lines.push('');
  lines.push('Architecture Decision Records document important architectural decisions made in the project,');
  lines.push('including the context, decision, and consequences of each choice.');
  lines.push('');
  lines.push('## ADR Index');
  lines.push('');

  if (adrFiles.length === 0) {
    lines.push('*No ADRs found.*');
    lines.push('');
    return lines.join('\n');
  }

  // Table header
  lines.push('| # | Title | Date | Status |');
  lines.push('|---|-------|------|--------|');

  // Table rows
  for (const file of adrFiles) {
    const filePath = path.join(ADR_DIR, file);
    const number = file.match(/^(\d+)/)?.[1] || '?';
    const title = extractTitle(filePath);
    const date = extractDate(filePath);
    const status = extractStatus(filePath);
    const relativePath = `../../.adr/${file}`;

    lines.push(`| ${number} | [${title}](${relativePath}) | ${date} | ${status} |`);
  }

  lines.push('');
  lines.push('## Creating a New ADR');
  lines.push('');
  lines.push('To create a new ADR:');
  lines.push('');
  lines.push('1. Create a new file in `.adr/` with format `NNNN-title-in-kebab-case.md`');
  lines.push('2. Use the next available number (check existing ADRs)');
  lines.push('3. Follow the ADR template structure:');
  lines.push('');
  lines.push('```markdown');
  lines.push('# N. Title');
  lines.push('');
  lines.push('Date: YYYY-MM-DD');
  lines.push('');
  lines.push('## Status');
  lines.push('');
  lines.push('Proposed | Accepted | Deprecated | Superseded');
  lines.push('');
  lines.push('## Context');
  lines.push('');
  lines.push('What is the issue motivating this decision?');
  lines.push('');
  lines.push('## Decision');
  lines.push('');
  lines.push('What is the change we are proposing?');
  lines.push('');
  lines.push('## Consequences');
  lines.push('');
  lines.push('What becomes easier or more difficult?');
  lines.push('```');
  lines.push('');
  lines.push('4. Commit and push - the ADR index will be automatically updated');
  lines.push('');
  lines.push('## Resources');
  lines.push('');
  lines.push('- [ADR GitHub Organization](https://adr.github.io/)');
  lines.push('- [Joel Parker Henderson\'s ADR Templates](https://github.com/joelparkerhenderson/architecture-decision-record)');
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push(`*This index was automatically generated on ${new Date().toISOString().split('T')[0]}*`);
  lines.push('');

  return lines.join('\n');
}

/**
 * Main execution
 */
function main() {
  console.log('🔍 Scanning for ADR files...');

  const adrFiles = getADRFiles();
  console.log(`📄 Found ${adrFiles.length} ADR file(s)`);

  console.log('📝 Generating ADR index...');
  const indexContent = generateIndex(adrFiles);

  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write index file
  fs.writeFileSync(OUTPUT_FILE, indexContent);
  console.log(`✅ ADR index generated: ${OUTPUT_FILE}`);

  // Also create a simple README in .adr directory
  const readmePath = path.join(ADR_DIR, 'README.md');
  const readmeContent = [
    '# Architecture Decision Records',
    '',
    'This directory contains Architecture Decision Records (ADRs) for GRAPES Hub.',
    '',
    `**Total ADRs:** ${adrFiles.length}`,
    '',
    '## ADRs',
    '',
    ...adrFiles.map(file => {
      const filePath = path.join(ADR_DIR, file);
      const title = extractTitle(filePath);
      return `- [${title}](${file})`;
    }),
    '',
    '---',
    '',
    `*Last updated: ${new Date().toISOString().split('T')[0]}*`,
    ''
  ].join('\n');

  fs.writeFileSync(readmePath, readmeContent);
  console.log(`✅ ADR README generated: ${readmePath}`);
}

main();
