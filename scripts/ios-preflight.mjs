import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

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
const packageJsonPath = join(root, 'package.json');
const packageLockPath = join(root, 'package-lock.json');
const xcodeProject = join(root, 'ios', 'App', 'App.xcodeproj');
const xcodeProjectFile = join(xcodeProject, 'project.pbxproj');

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

const declaredPackages = readJson(packageJsonPath).dependencies ?? {};
const lockedPackages = readJson(packageLockPath).packages?.['']?.dependencies ?? {};

for (const name of capacitorPackages) {
  if (declaredPackages[name] !== requiredCapacitorVersion) {
    failures.push(
      `${name} is declared as ${declaredPackages[name] ?? 'missing'}; expected exact version ${requiredCapacitorVersion}.`,
    );
  }
  if (lockedPackages[name] !== requiredCapacitorVersion) {
    failures.push(
      `${name} is locked as ${lockedPackages[name] ?? 'missing'}; expected exact version ${requiredCapacitorVersion}. Run npm install.`,
    );
  }
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
  failures.push('Generated CapApp-SPM is missing. Run npx cap sync ios, then run this check again.');
}

if (!existsSync(xcodeProjectFile)) {
  failures.push('The generated Xcode project is missing. Recreate iOS, then run npx cap sync ios.');
} else {
  const projectSource = readFileSync(xcodeProjectFile, 'utf8');
  const requiredProjectMarkers = [
    ['XCLocalSwiftPackageReference "CapApp-SPM"', 'the local CapApp-SPM package reference'],
    ['relativePath = "CapApp-SPM";', 'the CapApp-SPM relative path'],
    ['XCSwiftPackageProductDependency', 'the Swift package product dependency section'],
    ['productName = "CapApp-SPM";', 'the linked CapApp-SPM product'],
    ['CapApp-SPM in Frameworks', 'the CapApp-SPM framework build link'],
  ];

  for (const [marker, description] of requiredProjectMarkers) {
    if (!projectSource.includes(marker)) {
      failures.push(`App.xcodeproj is missing ${description}. Recreate the iOS platform; do not add it manually.`);
    }
  }
}

if (failures.length > 0) {
  console.error('\n✖ iOS preflight failed:\n');
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`✓ Capacitor CLI/Core/iOS/Android are exactly pinned at ${requiredCapacitorVersion}.`);
  console.log('✓ Every native plugin has a Capacitor 8-compatible Swift package manifest.');
  console.log('✓ Generated CapApp-SPM requires Capacitor Swift PM 8.x.');
  console.log('✓ App.xcodeproj links the local CapApp-SPM package and product.');

  if (process.platform === 'darwin') {
    console.log('• Asking Xcode to resolve the complete Swift package graph...');
    const resolve = spawnSync(
      'xcodebuild',
      ['-resolvePackageDependencies', '-project', xcodeProject, '-scheme', 'App'],
      { cwd: root, encoding: 'utf8' },
    );
    if (resolve.status !== 0) {
      console.error('\n✖ Xcode package resolution failed:\n');
      console.error(resolve.stderr || resolve.stdout || 'xcodebuild returned no diagnostic output.');
      process.exitCode = 1;
    } else {
      console.log('✓ Xcode resolved the complete Swift package graph.');

      console.log('• Compiling the unsigned iOS app to verify `import Capacitor`...');
      const build = spawnSync(
        'xcodebuild',
        [
          '-project', xcodeProject,
          '-scheme', 'App',
          '-configuration', 'Release',
          '-destination', 'generic/platform=iOS',
          'CODE_SIGNING_ALLOWED=NO',
          'build',
        ],
        { cwd: root, encoding: 'utf8' },
      );
      if (build.status !== 0) {
        console.error('\n✖ Unsigned Xcode compile failed:\n');
        console.error(build.stderr || build.stdout || 'xcodebuild returned no diagnostic output.');
        process.exitCode = 1;
      } else {
        console.log('✓ Xcode compiled the app and resolved the Capacitor module.');
      }
    }
  } else {
    console.log('ℹ Run this command on the Mac to execute the Xcode resolution and compile gates.');
  }
}