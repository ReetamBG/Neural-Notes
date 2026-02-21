import { describe, it } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('package.json extended validation', () => {
  let packageJson;

  it('should have private field set correctly', () => {
    const content = readFileSync(join(__dirname, '..', 'package.json'), 'utf-8');
    packageJson = JSON.parse(content);

    assert.strictEqual(packageJson.private, true, 'package should be marked as private');
  });

  it('should have all scripts as non-empty strings', () => {
    const content = readFileSync(join(__dirname, '..', 'package.json'), 'utf-8');
    packageJson = JSON.parse(content);

    for (const [scriptName, scriptCommand] of Object.entries(packageJson.scripts)) {
      assert.strictEqual(typeof scriptCommand, 'string', `${scriptName} script should be a string`);
      assert.ok(scriptCommand.trim().length > 0, `${scriptName} script should not be empty`);
    }
  });

  it('should not have dependency version conflicts', () => {
    const content = readFileSync(join(__dirname, '..', 'package.json'), 'utf-8');
    packageJson = JSON.parse(content);

    // Check that dependencies and devDependencies don't overlap
    const depNames = Object.keys(packageJson.dependencies || {});
    const devDepNames = Object.keys(packageJson.devDependencies || {});

    const overlap = depNames.filter(name => devDepNames.includes(name));
    assert.strictEqual(overlap.length, 0, `Dependencies should not be in both dependencies and devDependencies: ${overlap.join(', ')}`);
  });

  it('should have consistent React ecosystem versions', () => {
    const content = readFileSync(join(__dirname, '..', 'package.json'), 'utf-8');
    packageJson = JSON.parse(content);

    const reactVersion = packageJson.dependencies.react;
    const reactDomVersion = packageJson.dependencies['react-dom'];

    assert.ok(reactVersion, 'React should be listed in dependencies');
    assert.ok(reactDomVersion, 'React DOM should be listed in dependencies');
    assert.strictEqual(reactVersion, reactDomVersion, 'React and React DOM versions should match');
  });

  it('should have valid Next.js version for React 19', () => {
    const content = readFileSync(join(__dirname, '..', 'package.json'), 'utf-8');
    packageJson = JSON.parse(content);

    const nextVersion = packageJson.dependencies.next;
    const reactVersion = packageJson.dependencies.react;

    assert.ok(nextVersion, 'Next.js should be in dependencies');
    assert.ok(reactVersion, 'React should be in dependencies');

    // React 19 requires Next.js 15+
    if (reactVersion.includes('19')) {
      assert.ok(nextVersion.includes('15'), 'React 19 requires Next.js 15+');
    }
  });

  it('should have Clerk authentication package', () => {
    const content = readFileSync(join(__dirname, '..', 'package.json'), 'utf-8');
    packageJson = JSON.parse(content);

    assert.ok(packageJson.dependencies['@clerk/nextjs'], 'Should have Clerk Next.js package for authentication');
  });

  it('should have Prisma ORM packages', () => {
    const content = readFileSync(join(__dirname, '..', 'package.json'), 'utf-8');
    packageJson = JSON.parse(content);

    assert.ok(packageJson.dependencies['@prisma/client'], 'Should have Prisma client in dependencies');
    assert.ok(packageJson.devDependencies.prisma, 'Should have Prisma CLI in devDependencies');
  });

  it('should have TipTap editor packages', () => {
    const content = readFileSync(join(__dirname, '..', 'package.json'), 'utf-8');
    packageJson = JSON.parse(content);

    assert.ok(packageJson.dependencies['@tiptap/react'], 'Should have TipTap React package');
    assert.ok(packageJson.dependencies['@tiptap/starter-kit'], 'Should have TipTap starter kit');
  });

  it('should have Radix UI primitives', () => {
    const content = readFileSync(join(__dirname, '..', 'package.json'), 'utf-8');
    packageJson = JSON.parse(content);

    const radixPackages = Object.keys(packageJson.dependencies).filter(dep => dep.startsWith('@radix-ui/'));
    assert.ok(radixPackages.length > 0, 'Should have Radix UI packages');
  });

  it('should have Tailwind CSS and related packages', () => {
    const content = readFileSync(join(__dirname, '..', 'package.json'), 'utf-8');
    packageJson = JSON.parse(content);

    assert.ok(packageJson.devDependencies.tailwindcss, 'Should have Tailwind CSS in devDependencies');
    assert.ok(packageJson.dependencies['tailwind-merge'], 'Should have tailwind-merge utility');
  });

  it('should have state management with Zustand', () => {
    const content = readFileSync(join(__dirname, '..', 'package.json'), 'utf-8');
    packageJson = JSON.parse(content);

    assert.ok(packageJson.dependencies.zustand, 'Should have Zustand for state management');
  });

  it('should have axios for HTTP requests', () => {
    const content = readFileSync(join(__dirname, '..', 'package.json'), 'utf-8');
    packageJson = JSON.parse(content);

    assert.ok(packageJson.dependencies.axios, 'Should have axios for API requests');
  });

  it('should not have any empty dependency versions', () => {
    const content = readFileSync(join(__dirname, '..', 'package.json'), 'utf-8');
    packageJson = JSON.parse(content);

    const allDeps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies
    };

    for (const [name, version] of Object.entries(allDeps)) {
      assert.ok(version && version.trim().length > 0, `${name} should have a non-empty version`);
    }
  });

  it('should have version prefixes in semver format', () => {
    const content = readFileSync(join(__dirname, '..', 'package.json'), 'utf-8');
    packageJson = JSON.parse(content);

    const allDeps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies
    };

    for (const [name, version] of Object.entries(allDeps)) {
      // Should start with ^, ~, or exact version number
      const validPrefix = /^[\^~]?\d/.test(version);
      assert.ok(validPrefix, `${name} version "${version}" should have valid semver prefix`);
    }
  });

  it('should not contain test or example scripts in package', () => {
    const content = readFileSync(join(__dirname, '..', 'package.json'), 'utf-8');
    packageJson = JSON.parse(content);

    // Ensure no accidentally included test files in "files" field
    if (packageJson.files) {
      const testPatterns = ['test', '__tests__', 'spec', '*.test.', '*.spec.'];
      for (const file of packageJson.files) {
        const hasTestPattern = testPatterns.some(pattern => file.includes(pattern));
        assert.ok(!hasTestPattern, `Files array should not include test files: ${file}`);
      }
    }
  });

  it('should have ESLint configuration', () => {
    const content = readFileSync(join(__dirname, '..', 'package.json'), 'utf-8');
    packageJson = JSON.parse(content);

    assert.ok(packageJson.devDependencies.eslint, 'Should have ESLint in devDependencies');
    assert.ok(packageJson.scripts.lint, 'Should have lint script');
  });

  it('should use consistent casing in package names', () => {
    const content = readFileSync(join(__dirname, '..', 'package.json'), 'utf-8');
    packageJson = JSON.parse(content);

    assert.strictEqual(packageJson.name, packageJson.name.toLowerCase(), 'Package name should be lowercase');
  });

  it('should not have deprecated script naming', () => {
    const content = readFileSync(join(__dirname, '..', 'package.json'), 'utf-8');
    packageJson = JSON.parse(content);

    // Check for common deprecated patterns
    assert.ok(!packageJson.scripts.prepublish, 'Should not use deprecated prepublish script');
  });

  it('should have valid package structure for Next.js app', () => {
    const content = readFileSync(join(__dirname, '..', 'package.json'), 'utf-8');
    packageJson = JSON.parse(content);

    // Next.js apps should have these scripts
    assert.ok(packageJson.scripts.dev, 'Next.js app should have dev script');
    assert.ok(packageJson.scripts.build, 'Next.js app should have build script');
    assert.ok(packageJson.scripts.start, 'Next.js app should have start script');
  });

  it('should not have security vulnerabilities in config', () => {
    const content = readFileSync(join(__dirname, '..', 'package.json'), 'utf-8');

    // Check for accidentally committed sensitive data patterns
    assert.ok(!content.includes('password'), 'Should not contain password strings');
    assert.ok(!content.includes('secret_key'), 'Should not contain secret key strings');
    assert.ok(!content.includes('api_key'), 'Should not contain API key strings');
  });
});