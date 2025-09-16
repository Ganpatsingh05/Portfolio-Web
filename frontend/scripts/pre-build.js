#!/usr/bin/env node

/**
 * Pre-build verification script for Vercel deployment
 * This script checks for common issues that can cause deployment failures
 */

console.log('🔍 Running pre-build verification...');

// Check environment variables
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY'
];

const optionalEnvVars = [
  'BACKEND_URL',
  'NEXT_PUBLIC_API_URL',
  'SUPABASE_SERVICE_ROLE_KEY'
];

console.log('📋 Checking environment variables...');

let missingRequired = [];
let missingOptional = [];

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    missingRequired.push(varName);
  } else {
    console.log(`✅ ${varName} is set`);
  }
});

optionalEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    missingOptional.push(varName);
  } else {
    console.log(`✅ ${varName} is set`);
  }
});

if (missingRequired.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingRequired.forEach(varName => {
    console.error(`   - ${varName}`);
  });
  process.exit(1);
}

if (missingOptional.length > 0) {
  console.warn('⚠️  Missing optional environment variables (using defaults):');
  missingOptional.forEach(varName => {
    console.warn(`   - ${varName}`);
  });
}

// Check if critical files exist
const fs = require('fs');
const path = require('path');

const criticalFiles = [
  'src/app/layout.tsx',
  'src/app/page.tsx',
  'src/lib/supabase.ts'
];

console.log('📁 Checking critical files...');

criticalFiles.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${filePath} exists`);
  } else {
    console.error(`❌ ${filePath} missing`);
    process.exit(1);
  }
});

console.log('🚀 Pre-build verification completed successfully!');
console.log('💡 Environment info:');
console.log(`   - Node version: ${process.version}`);
console.log(`   - Platform: ${process.platform}`);
console.log(`   - Architecture: ${process.arch}`);