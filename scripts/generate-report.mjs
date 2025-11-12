#!/usr/bin/env node

/**
 * Evaluation Report Generator for GRAPES Hub
 *
 * Generates HTML report from evaluation results.
 * Usage: node scripts/generate-report.mjs <results.json> [output.html]
 */

import fs from 'fs';
import path from 'path';

/**
 * Load JSON file
 */
function loadJSON(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error.message);
    process.exit(1);
  }
}

/**
 * Generate HTML report
 */
function generateHTML(data) {
  const timestamp = new Date().toISOString();
  const results = data.results || [];
  const summary = data.summary || {};

  const passRate = summary.passRate || 0;
  const statusColor = passRate >= 90 ? '#10b981' : passRate >= 70 ? '#f59e0b' : '#ef4444';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GRAPES Evaluation Report</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #1f2937;
      background: #f3f4f6;
      padding: 2rem;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem;
    }
    .header h1 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }
    .header p {
      opacity: 0.9;
      font-size: 0.95rem;
    }
    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      padding: 2rem;
      background: #f9fafb;
      border-bottom: 1px solid #e5e7eb;
    }
    .metric {
      text-align: center;
    }
    .metric-value {
      font-size: 2.5rem;
      font-weight: bold;
      color: ${statusColor};
    }
    .metric-label {
      font-size: 0.875rem;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-top: 0.5rem;
    }
    .results {
      padding: 2rem;
    }
    .results h2 {
      font-size: 1.5rem;
      margin-bottom: 1.5rem;
      color: #111827;
    }
    .test-result {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 1.5rem;
      margin-bottom: 1rem;
    }
    .test-result:hover {
      background: #f3f4f6;
    }
    .test-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    .test-name {
      font-weight: 600;
      font-size: 1.1rem;
    }
    .test-badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.875rem;
      font-weight: 500;
    }
    .badge-success {
      background: #d1fae5;
      color: #065f46;
    }
    .badge-failure {
      background: #fee2e2;
      color: #991b1b;
    }
    .test-meta {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #e5e7eb;
    }
    .test-meta-item {
      font-size: 0.875rem;
    }
    .test-meta-label {
      color: #6b7280;
      margin-right: 0.5rem;
    }
    .test-meta-value {
      font-weight: 500;
      color: #111827;
    }
    .footer {
      padding: 1.5rem 2rem;
      background: #f9fafb;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
      font-size: 0.875rem;
    }
    .no-results {
      text-align: center;
      padding: 3rem;
      color: #6b7280;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🍇 GRAPES Evaluation Report</h1>
      <p>GitHub Remote AI Powered Evaluation Solution</p>
      <p style="margin-top: 1rem; opacity: 0.8;">Generated: ${timestamp}</p>
    </div>

    <div class="summary">
      <div class="metric">
        <div class="metric-value">${summary.totalTests || 0}</div>
        <div class="metric-label">Total Tests</div>
      </div>
      <div class="metric">
        <div class="metric-value" style="color: #10b981;">${summary.passed || 0}</div>
        <div class="metric-label">Passed</div>
      </div>
      <div class="metric">
        <div class="metric-value" style="color: #ef4444;">${summary.failed || 0}</div>
        <div class="metric-label">Failed</div>
      </div>
      <div class="metric">
        <div class="metric-value">${passRate.toFixed(1)}%</div>
        <div class="metric-label">Pass Rate</div>
      </div>
      ${summary.averageLatency ? `
      <div class="metric">
        <div class="metric-value" style="color: #3b82f6; font-size: 2rem;">${summary.averageLatency}ms</div>
        <div class="metric-label">Avg Latency</div>
      </div>` : ''}
      ${summary.totalCost ? `
      <div class="metric">
        <div class="metric-value" style="color: #8b5cf6; font-size: 2rem;">$${summary.totalCost.toFixed(4)}</div>
        <div class="metric-label">Total Cost</div>
      </div>` : ''}
    </div>

    <div class="results">
      <h2>Test Results</h2>
      ${results.length > 0 ? results.map((result, index) => `
        <div class="test-result">
          <div class="test-header">
            <div class="test-name">${result.test || `Test ${index + 1}`}</div>
            <span class="test-badge ${result.success ? 'badge-success' : 'badge-failure'}">
              ${result.success ? '✓ PASS' : '✗ FAIL'}
            </span>
          </div>
          <div class="test-meta">
            ${result.score !== undefined ? `
            <div class="test-meta-item">
              <span class="test-meta-label">Score:</span>
              <span class="test-meta-value">${(result.score * 100).toFixed(1)}%</span>
            </div>` : ''}
            ${result.latency !== undefined ? `
            <div class="test-meta-item">
              <span class="test-meta-label">Latency:</span>
              <span class="test-meta-value">${result.latency}ms</span>
            </div>` : ''}
            ${result.cost !== undefined ? `
            <div class="test-meta-item">
              <span class="test-meta-label">Cost:</span>
              <span class="test-meta-value">$${result.cost.toFixed(4)}</span>
            </div>` : ''}
          </div>
        </div>
      `).join('') : '<div class="no-results">No test results available</div>'}
    </div>

    <div class="footer">
      <p>Generated by GRAPES Hub | <a href="https://github.com/tbowman01/grapes" style="color: #667eea;">GitHub</a></p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Main execution
 */
function main() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.error('Usage: node generate-report.mjs <results.json> [output.html]');
    console.error('Example: node generate-report.mjs eval/output/latest.json eval/output/report.html');
    process.exit(1);
  }

  const [inputPath] = args;
  const outputPath = args[1] || inputPath.replace('.json', '.html');

  console.log(`Loading results from: ${inputPath}`);

  const data = loadJSON(inputPath);
  const html = generateHTML(data);

  try {
    fs.writeFileSync(outputPath, html);
    console.log(`✅ Report generated successfully: ${outputPath}`);
  } catch (error) {
    console.error('Error writing report:', error.message);
    process.exit(1);
  }
}

main();
