#!/usr/bin/env node

/**
 * Documentation Build Script for GRAPES Hub
 *
 * Builds the Docusaurus documentation site with proper error handling.
 * Usage: node scripts/docs-build.mjs
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DOCS_DIR = join(__dirname, '..', 'docs');
const BUILD_DIR = join(DOCS_DIR, 'build');

/**
 * Execute command with proper error handling
 */
function execCommand(command, cwd, description) {
  console.log(`📦 ${description}...`);
  try {
    execSync(command, {
      cwd,
      stdio: 'inherit',
      env: {
        ...process.env,
        NODE_ENV: 'production'
      }
    });
    console.log(`✅ ${description} completed`);
    return true;
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    return false;
  }
}

/**
 * Main build process
 */
function main() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📚 GRAPES Documentation Build');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Check if docs directory exists
  if (!existsSync(DOCS_DIR)) {
    console.error(`❌ Documentation directory not found: ${DOCS_DIR}`);
    process.exit(1);
  }

  // Check if package.json exists
  const packageJson = join(DOCS_DIR, 'package.json');
  if (!existsSync(packageJson)) {
    console.error(`❌ package.json not found: ${packageJson}`);
    process.exit(1);
  }

  console.log(`📂 Documentation directory: ${DOCS_DIR}`);
  console.log(`📂 Build output directory: ${BUILD_DIR}\n`);

  // Install dependencies
  if (!execCommand('npm ci', DOCS_DIR, 'Installing dependencies')) {
    console.error('\n❌ Build failed during dependency installation');
    process.exit(1);
  }

  console.log('');

  // Build documentation
  if (!execCommand('npm run build', DOCS_DIR, 'Building documentation')) {
    console.error('\n❌ Build failed during documentation build');
    process.exit(1);
  }

  // Verify build output
  if (!existsSync(BUILD_DIR)) {
    console.error(`\n❌ Build directory not created: ${BUILD_DIR}`);
    process.exit(1);
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ Documentation Build Successful');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log(`📂 Build output: ${BUILD_DIR}`);
  console.log('');
  console.log('To serve locally:');
  console.log('  cd docs && npm run serve');
  console.log('');
}

// Run main function
try {
  main();
} catch (error) {
  console.error('❌ Unexpected error:', error.message);
  process.exit(1);
}
