#!/usr/bin/env node

/**
 * Baseline Comparison Script for GRAPES Hub
 *
 * Compares current evaluation results against baseline to detect regressions.
 * Usage: node scripts/baseline-compare.mjs <current-results.json> <baseline.json>
 */

import fs from 'fs';
import path from 'path';

const THRESHOLD_PERCENTAGE = 10; // Alert if scores differ by more than 10%

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
 * Calculate score from results
 */
function calculateScore(results) {
  if (!results || !Array.isArray(results)) {
    return 0;
  }

  const totalTests = results.length;
  if (totalTests === 0) return 0;

  const passedTests = results.filter(r => r.success === true).length;
  return (passedTests / totalTests) * 100;
}

/**
 * Compare metrics between current and baseline
 */
function compareMetrics(current, baseline) {
  const comparison = {
    passed: true,
    regressions: [],
    improvements: [],
    summary: {}
  };

  const currentScore = calculateScore(current.results);
  const baselineScore = calculateScore(baseline.results);
  const scoreDiff = currentScore - baselineScore;
  const scoreChangePercent = baselineScore > 0
    ? ((currentScore - baselineScore) / baselineScore) * 100
    : 0;

  comparison.summary = {
    currentScore: currentScore.toFixed(2),
    baselineScore: baselineScore.toFixed(2),
    difference: scoreDiff.toFixed(2),
    percentageChange: scoreChangePercent.toFixed(2)
  };

  // Check for regression
  if (scoreDiff < 0 && Math.abs(scoreChangePercent) > THRESHOLD_PERCENTAGE) {
    comparison.passed = false;
    comparison.regressions.push({
      metric: 'Overall Pass Rate',
      current: currentScore.toFixed(2),
      baseline: baselineScore.toFixed(2),
      change: scoreDiff.toFixed(2)
    });
  }

  // Check for improvement
  if (scoreDiff > 0 && Math.abs(scoreChangePercent) > THRESHOLD_PERCENTAGE) {
    comparison.improvements.push({
      metric: 'Overall Pass Rate',
      current: currentScore.toFixed(2),
      baseline: baselineScore.toFixed(2),
      change: scoreDiff.toFixed(2)
    });
  }

  return comparison;
}

/**
 * Generate report
 */
function generateReport(comparison) {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 GRAPES Baseline Comparison Report');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log('Summary:');
  console.log(`  Current Score:  ${comparison.summary.currentScore}%`);
  console.log(`  Baseline Score: ${comparison.summary.baselineScore}%`);
  console.log(`  Difference:     ${comparison.summary.difference}%`);
  console.log(`  Change:         ${comparison.summary.percentageChange}%\n`);

  if (comparison.regressions.length > 0) {
    console.log('⚠️  Regressions Detected:');
    comparison.regressions.forEach(reg => {
      console.log(`  - ${reg.metric}: ${reg.current}% (was ${reg.baseline}%, change: ${reg.change}%)`);
    });
    console.log('');
  }

  if (comparison.improvements.length > 0) {
    console.log('✅ Improvements Detected:');
    comparison.improvements.forEach(imp => {
      console.log(`  - ${imp.metric}: ${imp.current}% (was ${imp.baseline}%, change: ${imp.change}%)`);
    });
    console.log('');
  }

  if (comparison.passed) {
    console.log('✅ Status: PASSED - No significant regressions detected\n');
    return 0;
  } else {
    console.log('❌ Status: FAILED - Regressions detected above threshold\n');
    return 1;
  }
}

/**
 * Save comparison results
 */
function saveComparison(comparison, outputPath) {
  try {
    fs.writeFileSync(outputPath, JSON.stringify(comparison, null, 2));
    console.log(`📄 Comparison results saved to: ${outputPath}\n`);
  } catch (error) {
    console.error('Error saving comparison results:', error.message);
  }
}

/**
 * Main execution
 */
function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error('Usage: node baseline-compare.mjs <current-results.json> <baseline.json>');
    console.error('Example: node baseline-compare.mjs eval/output/latest.json eval/baselines/baseline-v1.json');
    process.exit(1);
  }

  const [currentPath, baselinePath] = args;
  const outputPath = args[2] || 'eval/output/comparison.json';

  console.log(`Loading current results from: ${currentPath}`);
  console.log(`Loading baseline from: ${baselinePath}`);

  const current = loadJSON(currentPath);
  const baseline = loadJSON(baselinePath);

  const comparison = compareMetrics(current, baseline);

  saveComparison(comparison, outputPath);

  const exitCode = generateReport(comparison);
  process.exit(exitCode);
}

main();
