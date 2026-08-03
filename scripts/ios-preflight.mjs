import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const requiredCapacitorVersion = '8.4.2';
const capacitorPackages = ['@capacitor/android', '@capacitor/cli', '@capacitor/core', '@capacitor/ios'];
const nativePlugins = [
  '@capacitor/app',
  '@capacitor/browser',
  '@capacitor/haptics',
  '@capacitor/local-notifications',
  '@capacitor/network',
  '@capacitor/preferences',
  '@capacitor/push-notifications',
  '@capacitor/share',
  '@capgo/capacitor-native-biometric',
  '@capgo/capacitor-social-login',
  '@revenuecat/purchases-capacitor',
];

const failures = [];

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function installedPackage(name) {
  const path = join(root, 'node_modules', name, 'package.json');
  if (!existsSync(path)) {
    failures.push(`${name} is not installed. Run npm ci.`);
    return null;
  }
  return readJson(path);
}

for (const name of capacitorPackages) {
  const pkg = installedPackage(name);
  if (pkg && pkg.version !== requiredCapacitorVersion) {
    failures.push(
      `${name} is ${pkg.version}; expected ${requiredCapacitorVersion}. Run npm ci before syncing iOS.`,
    );
  }
}

for (const name of nativePlugins) {
  const pkg = installedPackage(name);
  if (!pkg) continue;

  const manifest = join(root, 'node_modules', name, 'Package.swift');
  if (!existsSync(manifest)) {
    failures.push(`${name}@${pkg.version} does not include Package.swift.`);
    continue;
  }

  const source = readFileSync(manifest, 'utf8');
  if (!source.includes('capacitor-swift-pm.git')) {
    failures.push(`${name}@${pkg.version} does not declare capacitor-swift-pm.`);
  }
  if (source.includes('from: "7.')) {
    failures.push(`${name}@${pkg.version} still requires Capacitor Swift PM 7.x.`);
  }
}

const generatedManifest = join(root, 'ios', 'App', 'CapApp-SPM', 'Package.swift');
if (existsSync(generatedManifest)) {
  const source = readFileSync(generatedManifest, 'utf8');
  const capacitorSwiftPmVersion = source.match(
    /capacitor-swift-pm\.git[\s\S]{0,160}?(?:from:\s*|exact:\s*)["'](\d+)\./,
  );
  if (!capacitorSwiftPmVersion || capacitorSwiftPmVersion[1] !== '8') {
    failures.push(
      'ios/App/CapApp-SPM/Package.swift is not on Capacitor Swift PM 8.x. Run npx cap sync ios with CLI 8.4.2.',
    );
  }
} else {
  console.log('ℹ Generated iOS package is not present yet; run npx cap sync ios, then run this check again.');
}

if (failures.length > 0) {
  console.error('\n✖ iOS preflight failed:\n');
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`✓ Capacitor CLI/Core/iOS are aligned at ${requiredCapacitorVersion}.`);
  console.log('✓ Every native plugin has a Capacitor 8-compatible Swift package manifest.');
  if (existsSync(generatedManifest)) {
    console.log('✓ Generated CapApp-SPM requires Capacitor Swift PM 8.x.');
  }
}