#!/usr/bin/env node

/**
 * Cost Tracking Script for GRAPES Hub
 *
 * Tracks and reports on evaluation costs across providers.
 * Usage: node scripts/cost-tracker.mjs <results-dir>
 */

import fs from 'fs';
import path from 'path';

/**
 * Load all JSON files from directory
 */
function loadResults(dirPath) {
  const results = [];

  try {
    const files = fs.readdirSync(dirPath);

    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(dirPath, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(content);
        results.push({ file, data });
      }
    }
  } catch (error) {
    console.error(`Error loading results from ${dirPath}:`, error.message);
  }

  return results;
}

/**
 * Calculate cost statistics
 */
function calculateStats(results) {
  const stats = {
    totalCost: 0,
    totalTests: 0,
    byProvider: {},
    byDay: {},
    avgCostPerTest: 0
  };

  for (const { file, data } of results) {
    const testResults = data.results || [];
    const provider = data.provider || 'unknown';
    const date = data.date || new Date().toISOString().split('T')[0];

    // Initialize provider stats
    if (!stats.byProvider[provider]) {
      stats.byProvider[provider] = {
        totalCost: 0,
        totalTests: 0,
        avgCost: 0
      };
    }

    // Initialize day stats
    if (!stats.byDay[date]) {
      stats.byDay[date] = {
        totalCost: 0,
        totalTests: 0
      };
    }

    for (const result of testResults) {
      const cost = result.cost || 0;

      stats.totalCost += cost;
      stats.totalTests += 1;

      stats.byProvider[provider].totalCost += cost;
      stats.byProvider[provider].totalTests += 1;

      stats.byDay[date].totalCost += cost;
      stats.byDay[date].totalTests += 1;
    }
  }

  // Calculate averages
  stats.avgCostPerTest = stats.totalTests > 0
    ? stats.totalCost / stats.totalTests
    : 0;

  for (const provider in stats.byProvider) {
    const providerStats = stats.byProvider[provider];
    providerStats.avgCost = providerStats.totalTests > 0
      ? providerStats.totalCost / providerStats.totalTests
      : 0;
  }

  return stats;
}

/**
 * Format currency
 */
function formatCurrency(amount) {
  return `$${amount.toFixed(4)}`;
}

/**
 * Generate report
 */
function generateReport(stats) {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('💰 GRAPES Cost Tracking Report');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log('Overall Statistics:');
  console.log(`  Total Cost:         ${formatCurrency(stats.totalCost)}`);
  console.log(`  Total Tests:        ${stats.totalTests}`);
  console.log(`  Avg Cost per Test:  ${formatCurrency(stats.avgCostPerTest)}\n`);

  if (Object.keys(stats.byProvider).length > 0) {
    console.log('Cost by Provider:');
    for (const [provider, providerStats] of Object.entries(stats.byProvider)) {
      console.log(`\n  ${provider}:`);
      console.log(`    Total Cost:  ${formatCurrency(providerStats.totalCost)}`);
      console.log(`    Tests Run:   ${providerStats.totalTests}`);
      console.log(`    Avg Cost:    ${formatCurrency(providerStats.avgCost)}`);
    }
    console.log('');
  }

  if (Object.keys(stats.byDay).length > 0) {
    console.log('Cost by Day (last 7 days):');
    const days = Object.entries(stats.byDay)
      .sort(([a], [b]) => b.localeCompare(a))
      .slice(0, 7);

    for (const [date, dayStats] of days) {
      console.log(`  ${date}: ${formatCurrency(dayStats.totalCost)} (${dayStats.totalTests} tests)`);
    }
    console.log('');
  }

  // Cost warnings
  if (stats.totalCost > 10) {
    console.log('⚠️  Warning: Total cost exceeds $10.00');
  }

  if (stats.avgCostPerTest > 0.10) {
    console.log('⚠️  Warning: Average cost per test exceeds $0.10');
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

/**
 * Save report
 */
function saveReport(stats, outputPath) {
  const report = {
    generatedAt: new Date().toISOString(),
    ...stats
  };

  try {
    fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
    console.log(`📊 Cost report saved to: ${outputPath}\n`);
  } catch (error) {
    console.error('Error saving report:', error.message);
  }
}

/**
 * Main execution
 */
function main() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.error('Usage: node cost-tracker.mjs <results-dir> [output.json]');
    console.error('Example: node cost-tracker.mjs eval/output eval/output/cost-report.json');
    process.exit(1);
  }

  const [resultsDir] = args;
  const outputPath = args[1] || path.join(resultsDir, 'cost-report.json');

  console.log(`Loading results from: ${resultsDir}`);

  const results = loadResults(resultsDir);

  if (results.length === 0) {
    console.error('No results found in directory');
    process.exit(1);
  }

  console.log(`Loaded ${results.length} result file(s)`);

  const stats = calculateStats(results);

  saveReport(stats, outputPath);
  generateReport(stats);
}

main();
