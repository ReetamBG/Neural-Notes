import { describe, it } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('vercel.json validation', () => {
  let vercelConfig;

  it('should be valid JSON', () => {
    const content = readFileSync(join(__dirname, '..', 'vercel.json'), 'utf-8');
    vercelConfig = JSON.parse(content);
    assert.ok(vercelConfig, 'vercel.json should be parsed successfully');
  });

  it('should have builds configuration', () => {
    const content = readFileSync(join(__dirname, '..', 'vercel.json'), 'utf-8');
    vercelConfig = JSON.parse(content);

    assert.ok(vercelConfig.builds, 'should have builds field');
    assert.ok(Array.isArray(vercelConfig.builds), 'builds should be an array');
    assert.ok(vercelConfig.builds.length > 0, 'builds array should not be empty');
  });

  it('should have routes configuration', () => {
    const content = readFileSync(join(__dirname, '..', 'vercel.json'), 'utf-8');
    vercelConfig = JSON.parse(content);

    assert.ok(vercelConfig.routes, 'should have routes field');
    assert.ok(Array.isArray(vercelConfig.routes), 'routes should be an array');
    assert.ok(vercelConfig.routes.length > 0, 'routes array should not be empty');
  });

  it('should specify correct Python builder', () => {
    const content = readFileSync(join(__dirname, '..', 'vercel.json'), 'utf-8');
    vercelConfig = JSON.parse(content);

    const build = vercelConfig.builds[0];
    assert.ok(build.use, 'build should have use field');
    assert.strictEqual(build.use, '@vercel/python', 'should use @vercel/python builder');
  });

  it('should specify correct entry point', () => {
    const content = readFileSync(join(__dirname, '..', 'vercel.json'), 'utf-8');
    vercelConfig = JSON.parse(content);

    const build = vercelConfig.builds[0];
    assert.ok(build.src, 'build should have src field');
    assert.strictEqual(build.src, 'main.py', 'should use main.py as entry point');
  });

  it('should have catch-all route', () => {
    const content = readFileSync(join(__dirname, '..', 'vercel.json'), 'utf-8');
    vercelConfig = JSON.parse(content);

    const route = vercelConfig.routes[0];
    assert.ok(route.src, 'route should have src field');
    assert.ok(route.dest, 'route should have dest field');
    assert.strictEqual(route.src, '/(.*)', 'should have catch-all route pattern');
    assert.strictEqual(route.dest, 'main.py', 'route should point to main.py');
  });

  it('should have valid route configuration structure', () => {
    const content = readFileSync(join(__dirname, '..', 'vercel.json'), 'utf-8');
    vercelConfig = JSON.parse(content);

    for (const route of vercelConfig.routes) {
      assert.ok(route.src, 'each route should have src field');
      assert.ok(route.dest, 'each route should have dest field');
      assert.strictEqual(typeof route.src, 'string', 'route src should be a string');
      assert.strictEqual(typeof route.dest, 'string', 'route dest should be a string');
    }
  });

  it('should have valid builds configuration structure', () => {
    const content = readFileSync(join(__dirname, '..', 'vercel.json'), 'utf-8');
    vercelConfig = JSON.parse(content);

    for (const build of vercelConfig.builds) {
      assert.ok(build.src, 'each build should have src field');
      assert.ok(build.use, 'each build should have use field');
      assert.strictEqual(typeof build.src, 'string', 'build src should be a string');
      assert.strictEqual(typeof build.use, 'string', 'build use should be a string');
    }
  });

  it('should not have any malformed JSON syntax', () => {
    const content = readFileSync(join(__dirname, '..', 'vercel.json'), 'utf-8');

    // Check for common JSON issues
    assert.ok(!content.includes(',}'), 'should not have trailing commas in objects');
    assert.ok(!content.includes(',]'), 'should not have trailing commas in arrays');

    // Should be parseable (this will throw if malformed)
    const parsed = JSON.parse(content);
    assert.ok(parsed, 'JSON should be well-formed');
  });

  it('should only contain expected top-level fields', () => {
    const content = readFileSync(join(__dirname, '..', 'vercel.json'), 'utf-8');
    vercelConfig = JSON.parse(content);

    const validFields = ['builds', 'routes', 'env', 'headers', 'rewrites', 'redirects', 'cleanUrls', 'trailingSlash'];
    const configKeys = Object.keys(vercelConfig);

    for (const key of configKeys) {
      assert.ok(validFields.includes(key), `${key} should be a valid Vercel configuration field`);
    }
  });

  it('should configure Python runtime correctly', () => {
    const content = readFileSync(join(__dirname, '..', 'vercel.json'), 'utf-8');
    vercelConfig = JSON.parse(content);

    const pythonBuild = vercelConfig.builds.find(b => b.use === '@vercel/python');
    assert.ok(pythonBuild, 'should have a Python build configuration');
    assert.strictEqual(pythonBuild.src, 'main.py', 'Python build should target main.py');
  });
});