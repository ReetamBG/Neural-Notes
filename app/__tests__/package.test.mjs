import { describe, it } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('package.json validation', () => {
  let packageJson;

  it('should be valid JSON', () => {
    const content = readFileSync(join(__dirname, '..', 'package.json'), 'utf-8');
    packageJson = JSON.parse(content);
    assert.ok(packageJson, 'package.json should be parsed successfully');
  });

  it('should have required fields', () => {
    const content = readFileSync(join(__dirname, '..', 'package.json'), 'utf-8');
    packageJson = JSON.parse(content);

    assert.ok(packageJson.name, 'package.json should have a name field');
    assert.ok(packageJson.version, 'package.json should have a version field');
    assert.ok(packageJson.scripts, 'package.json should have scripts field');
  });

  it('should have valid name', () => {
    const content = readFileSync(join(__dirname, '..', 'package.json'), 'utf-8');
    packageJson = JSON.parse(content);

    assert.strictEqual(typeof packageJson.name, 'string', 'name should be a string');
    assert.ok(packageJson.name.length > 0, 'name should not be empty');
    assert.strictEqual(packageJson.name, 'neural-notes', 'name should be neural-notes');
  });

  it('should have valid version', () => {
    const content = readFileSync(join(__dirname, '..', 'package.json'), 'utf-8');
    packageJson = JSON.parse(content);

    assert.strictEqual(typeof packageJson.version, 'string', 'version should be a string');
    assert.match(packageJson.version, /^\d+\.\d+\.\d+$/, 'version should follow semver format');
  });

  it('should have required scripts', () => {
    const content = readFileSync(join(__dirname, '..', 'package.json'), 'utf-8');
    packageJson = JSON.parse(content);

    assert.ok(packageJson.scripts.dev, 'should have dev script');
    assert.ok(packageJson.scripts.build, 'should have build script');
    assert.ok(packageJson.scripts.start, 'should have start script');
    assert.ok(packageJson.scripts.lint, 'should have lint script');
  });

  it('should have dependencies object', () => {
    const content = readFileSync(join(__dirname, '..', 'package.json'), 'utf-8');
    packageJson = JSON.parse(content);

    assert.ok(packageJson.dependencies, 'should have dependencies field');
    assert.strictEqual(typeof packageJson.dependencies, 'object', 'dependencies should be an object');
  });

  it('should have devDependencies object', () => {
    const content = readFileSync(join(__dirname, '..', 'package.json'), 'utf-8');
    packageJson = JSON.parse(content);

    assert.ok(packageJson.devDependencies, 'should have devDependencies field');
    assert.strictEqual(typeof packageJson.devDependencies, 'object', 'devDependencies should be an object');
  });

  it('should have Next.js as a dependency', () => {
    const content = readFileSync(join(__dirname, '..', 'package.json'), 'utf-8');
    packageJson = JSON.parse(content);

    assert.ok(packageJson.dependencies.next, 'should have next as a dependency');
    assert.ok(packageJson.dependencies.react, 'should have react as a dependency');
    assert.ok(packageJson.dependencies['react-dom'], 'should have react-dom as a dependency');
  });

  it('should have TypeScript in devDependencies', () => {
    const content = readFileSync(join(__dirname, '..', 'package.json'), 'utf-8');
    packageJson = JSON.parse(content);

    assert.ok(packageJson.devDependencies.typescript, 'should have typescript in devDependencies');
  });

  it('should have valid dependency versions', () => {
    const content = readFileSync(join(__dirname, '..', 'package.json'), 'utf-8');
    packageJson = JSON.parse(content);

    const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };

    for (const [name, version] of Object.entries(allDeps)) {
      assert.ok(version, `${name} should have a version specified`);
      assert.strictEqual(typeof version, 'string', `${name} version should be a string`);
      assert.ok(version.length > 0, `${name} version should not be empty`);
    }
  });

  it('should use turbopack flag in scripts', () => {
    const content = readFileSync(join(__dirname, '..', 'package.json'), 'utf-8');
    packageJson = JSON.parse(content);

    assert.ok(packageJson.scripts.dev.includes('--turbopack'), 'dev script should use turbopack');
    assert.ok(packageJson.scripts.build.includes('--turbopack'), 'build script should use turbopack');
  });

  it('should not have any malformed JSON syntax', () => {
    const content = readFileSync(join(__dirname, '..', 'package.json'), 'utf-8');

    // Check for common JSON issues
    assert.ok(!content.includes(',}'), 'should not have trailing commas in objects');
    assert.ok(!content.includes(',]'), 'should not have trailing commas in arrays');

    // Should be parseable (this will throw if malformed)
    const parsed = JSON.parse(content);
    assert.ok(parsed, 'JSON should be well-formed');
  });
});