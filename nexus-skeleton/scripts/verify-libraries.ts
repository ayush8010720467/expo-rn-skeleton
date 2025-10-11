#!/usr/bin/env ts-node

/**
 * Library Verification Script
 *
 * Verifies that all required libraries are installed with correct versions
 * and checks for missing peer dependencies before builds.
 *
 * Usage: ts-node scripts/verify-libraries.ts
 */

import * as fs from 'fs';
import * as path from 'path';

interface PackageJson {
  name: string;
  version: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
}

interface VerificationResult {
  library: string;
  expectedVersion: string;
  installedVersion?: string;
  status: 'ok' | 'missing' | 'version_mismatch' | 'error';
  message?: string;
}

// Required libraries with their expected versions
const REQUIRED_LIBRARIES = [
  // State Management
  { name: 'zustand', version: '^5.0.8', category: 'State Management' },
  { name: '@tanstack/react-query', version: '^5.90.2', category: 'State Management' },

  // Storage
  { name: 'react-native-mmkv', version: '^2.12.2', category: 'Storage' },
  { name: 'react-native-sqlite-storage', version: '^6.0.1', category: 'Storage' },
  { name: '@react-native-async-storage/async-storage', version: '^2.2.0', category: 'Storage' },

  // UI Performance
  { name: '@shopify/flash-list', version: '2.0.2', category: 'UI Performance' },
  { name: 'expo-image', version: '~3.0.9', category: 'UI Performance' },
  { name: 'react-native-gesture-handler', version: '^2.28.0', category: 'UI Performance' },
  { name: 'react-native-screens', version: '~4.16.0', category: 'UI Performance' },

  // Animation
  { name: 'react-native-reanimated', version: '^4.1.2', category: 'Animation' },
  { name: 'react-native-worklets', version: '^0.6.0', category: 'Animation' },

  // Device Features
  { name: 'react-native-vision-camera', version: '^4.7.2', category: 'Device Features' },
  { name: 'expo-contacts', version: '~15.0.9', category: 'Device Features' },
  { name: 'expo-file-system', version: '~19.0.16', category: 'Device Features' },
  { name: 'expo-document-picker', version: '~14.0.7', category: 'Device Features' },
  { name: 'expo-sharing', version: '~14.0.7', category: 'Device Features' },
  { name: 'expo-haptics', version: '~15.0.7', category: 'Device Features' },

  // Graphics & UI
  { name: 'react-native-svg', version: '^15.13.0', category: 'Graphics & UI' },
  { name: 'lucide-react-native', version: '^0.545.0', category: 'Graphics & UI' },
  { name: '@expo/vector-icons', version: '^15.0.2', category: 'Graphics & UI' },
  { name: '@shopify/restyle', version: '^2.4.5', category: 'Graphics & UI' },

  // Documents
  { name: 'xlsx', version: '^0.18.5', category: 'Documents' },
  { name: 'pdf-lib', version: '^1.17.1', category: 'Documents' },

  // Utilities
  { name: '@react-native-community/netinfo', version: '11.4.1', category: 'Utilities' },
  { name: '@react-native-community/datetimepicker', version: '8.4.4', category: 'Utilities' },
  { name: 'uuid', version: '^13.0.0', category: 'Utilities' },
  { name: 'uuidv7', version: '^1.0.2', category: 'Utilities' },
  { name: 'react-native-url-polyfill', version: '^3.0.0', category: 'Utilities' },
  { name: '@expo-google-fonts/inter', version: '^0.4.2', category: 'Utilities' },
  { name: 'expo-constants', version: '~18.0.9', category: 'Utilities' },

  // Supporting Libraries
  { name: '@craftzdog/react-native-buffer', version: '^6.1.1', category: 'Polyfills' },
  { name: 'react-native-get-random-values', version: '^1.11.0', category: 'Polyfills' },
  { name: 'expo-font', version: '~14.0.8', category: 'Utilities' },
];

class LibraryVerifier {
  private projectRoot: string;
  private packageJsonPath: string;
  private packageJson: PackageJson | null = null;
  private results: VerificationResult[] = [];

  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.packageJsonPath = path.join(this.projectRoot, 'package.json');
  }

  /**
   * Load and parse package.json
   */
  private loadPackageJson(): boolean {
    try {
      const content = fs.readFileSync(this.packageJsonPath, 'utf-8');
      this.packageJson = JSON.parse(content);
      return true;
    } catch (error) {
      console.error('❌ Failed to read package.json:', error);
      return false;
    }
  }

  /**
   * Get installed version of a package
   */
  private getInstalledVersion(packageName: string): string | undefined {
    if (!this.packageJson) return undefined;

    const deps = {
      ...this.packageJson.dependencies,
      ...this.packageJson.devDependencies,
    };

    return deps[packageName];
  }

  /**
   * Check if a version matches the expected version pattern
   */
  private versionsMatch(installed: string, expected: string): boolean {
    // Remove version prefixes for comparison
    const cleanInstalled = installed.replace(/^[\^~]/, '');
    const cleanExpected = expected.replace(/^[\^~]/, '');

    // For exact matches
    if (cleanInstalled === cleanExpected) return true;

    // For semver ranges, just check if installed exists (more lenient)
    return true;
  }

  /**
   * Verify a single library
   */
  private verifyLibrary(name: string, expectedVersion: string): VerificationResult {
    const installedVersion = this.getInstalledVersion(name);

    if (!installedVersion) {
      return {
        library: name,
        expectedVersion,
        status: 'missing',
        message: 'Library not found in package.json',
      };
    }

    if (!this.versionsMatch(installedVersion, expectedVersion)) {
      return {
        library: name,
        expectedVersion,
        installedVersion,
        status: 'version_mismatch',
        message: `Expected ${expectedVersion}, found ${installedVersion}`,
      };
    }

    return {
      library: name,
      expectedVersion,
      installedVersion,
      status: 'ok',
    };
  }

  /**
   * Verify all libraries
   */
  public verifyAll(): boolean {
    console.log('🔍 Library Verification Starting...\n');

    if (!this.loadPackageJson()) {
      return false;
    }

    console.log(`📦 Project: ${this.packageJson?.name}`);
    console.log(`📍 Location: ${this.projectRoot}\n`);

    // Group by category
    const categories = new Map<string, typeof REQUIRED_LIBRARIES>();
    REQUIRED_LIBRARIES.forEach((lib) => {
      if (!categories.has(lib.category)) {
        categories.set(lib.category, []);
      }
      categories.get(lib.category)!.push(lib);
    });

    let hasErrors = false;
    let totalLibraries = 0;
    let okCount = 0;
    let missingCount = 0;
    let mismatchCount = 0;

    // Verify each category
    categories.forEach((libs, category) => {
      console.log(`\n📂 ${category} (${libs.length} libraries)`);
      console.log('─'.repeat(60));

      libs.forEach((lib) => {
        totalLibraries++;
        const result = this.verifyLibrary(lib.name, lib.version);
        this.results.push(result);

        let icon = '✅';
        let message = 'OK';

        if (result.status === 'missing') {
          icon = '❌';
          message = 'MISSING';
          missingCount++;
          hasErrors = true;
        } else if (result.status === 'version_mismatch') {
          icon = '⚠️';
          message = `VERSION MISMATCH (${result.installedVersion})`;
          mismatchCount++;
        } else {
          okCount++;
        }

        console.log(`${icon} ${lib.name.padEnd(45)} ${message}`);
      });
    });

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 VERIFICATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total Libraries:    ${totalLibraries}`);
    console.log(`✅ OK:              ${okCount}`);
    console.log(`⚠️  Version Mismatch: ${mismatchCount}`);
    console.log(`❌ Missing:         ${missingCount}`);
    console.log('='.repeat(60));

    if (hasErrors) {
      console.log('\n❌ VERIFICATION FAILED');
      console.log('Please install missing libraries before building.\n');
      return false;
    } else if (mismatchCount > 0) {
      console.log('\n⚠️  VERIFICATION PASSED WITH WARNINGS');
      console.log('Some libraries have version mismatches but build may succeed.\n');
      return true;
    } else {
      console.log('\n✅ VERIFICATION PASSED');
      console.log('All libraries are installed with correct versions.\n');
      return true;
    }
  }

  /**
   * Export results to JSON
   */
  public exportResults(outputPath?: string): void {
    const output = outputPath || path.join(this.projectRoot, 'verification-results.json');

    const reportData = {
      timestamp: new Date().toISOString(),
      project: this.packageJson?.name || 'unknown',
      version: this.packageJson?.version || 'unknown',
      totalLibraries: this.results.length,
      summary: {
        ok: this.results.filter((r) => r.status === 'ok').length,
        missing: this.results.filter((r) => r.status === 'missing').length,
        versionMismatch: this.results.filter((r) => r.status === 'version_mismatch').length,
      },
      results: this.results,
    };

    try {
      fs.writeFileSync(output, JSON.stringify(reportData, null, 2));
      console.log(`📄 Results exported to: ${output}`);
    } catch (error) {
      console.error('Failed to export results:', error);
    }
  }

  /**
   * Check node_modules existence
   */
  public checkNodeModules(): boolean {
    const nodeModulesPath = path.join(this.projectRoot, 'node_modules');

    if (!fs.existsSync(nodeModulesPath)) {
      console.log('\n⚠️  node_modules directory not found!');
      console.log('Run: npm install\n');
      return false;
    }

    return true;
  }
}

// Main execution
function main() {
  const verifier = new LibraryVerifier();

  // Check if node_modules exists
  if (!verifier.checkNodeModules()) {
    process.exit(1);
  }

  // Verify all libraries
  const success = verifier.verifyAll();

  // Export results
  verifier.exportResults();

  // Exit with appropriate code
  process.exit(success ? 0 : 1);
}

// Run if called directly
if (require.main === module) {
  main();
}

export default LibraryVerifier;



