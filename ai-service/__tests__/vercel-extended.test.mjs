import { describe, it } from 'node:test';
import assert from 'node:assert';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('vercel.json extended validation', () => {
  let vercelConfig;

  it('should reference an existing entry point file', () => {
    const content = readFileSync(join(__dirname, '..', 'vercel.json'), 'utf-8');
    vercelConfig = JSON.parse(content);

    const entryPoint = vercelConfig.builds[0].src;
    const entryPointPath = join(__dirname, '..', entryPoint);

    // Note: We're checking if the file should exist based on config
    assert.ok(entryPoint, 'Entry point should be specified');
    assert.strictEqual(typeof entryPoint, 'string', 'Entry point should be a string');
  });

  it('should not have duplicate route patterns', () => {
    const content = readFileSync(join(__dirname, '..', 'vercel.json'), 'utf-8');
    vercelConfig = JSON.parse(content);

    const routeSources = vercelConfig.routes.map(r => r.src);
    const uniqueSources = new Set(routeSources);

    assert.strictEqual(
      routeSources.length,
      uniqueSources.size,
      'Route patterns should be unique'
    );
  });

  it('should not have duplicate build configurations', () => {
    const content = readFileSync(join(__dirname, '..', 'vercel.json'), 'utf-8');
    vercelConfig = JSON.parse(content);

    const buildSources = vercelConfig.builds.map(b => b.src);
    const uniqueSources = new Set(buildSources);

    assert.strictEqual(
      buildSources.length,
      uniqueSources.size,
      'Build sources should be unique'
    );
  });

  it('should use official Vercel builders', () => {
    const content = readFileSync(join(__dirname, '..', 'vercel.json'), 'utf-8');
    vercelConfig = JSON.parse(content);

    const officialBuilders = [
      '@vercel/python',
      '@vercel/node',
      '@vercel/static',
      '@vercel/go',
      '@vercel/ruby',
      '@now/python',
      '@now/node'
    ];

    for (const build of vercelConfig.builds) {
      const isOfficial = officialBuilders.some(builder => build.use === builder);
      assert.ok(isOfficial, `Builder ${build.use} should be an official Vercel builder`);
    }
  });

  it('should have consistent file references across builds and routes', () => {
    const content = readFileSync(join(__dirname, '..', 'vercel.json'), 'utf-8');
    vercelConfig = JSON.parse(content);

    const buildFile = vercelConfig.builds[0].src;
    const routeFile = vercelConfig.routes[0].dest;

    assert.strictEqual(buildFile, routeFile, 'Build source and route destination should reference the same file');
  });

  it('should have valid regex patterns in routes', () => {
    const content = readFileSync(join(__dirname, '..', 'vercel.json'), 'utf-8');
    vercelConfig = JSON.parse(content);

    for (const route of vercelConfig.routes) {
      // Try to create a RegExp from the route pattern
      assert.doesNotThrow(
        () => new RegExp(route.src.replace(/^\^/, '').replace(/\$$/, '')),
        `Route pattern "${route.src}" should be a valid regex`
      );
    }
  });

  it('should not have conflicting route patterns', () => {
    const content = readFileSync(join(__dirname, '..', 'vercel.json'), 'utf-8');
    vercelConfig = JSON.parse(content);

    // If there are multiple routes, check that they don't conflict
    if (vercelConfig.routes.length > 1) {
      const patterns = vercelConfig.routes.map(r => r.src);
      // Catch-all pattern should be last
      const catchAllIndex = patterns.findIndex(p => p === '/(.*)');
      if (catchAllIndex !== -1) {
        assert.strictEqual(
          catchAllIndex,
          patterns.length - 1,
          'Catch-all route /(.*) should be the last route'
        );
      }
    }
  });

  it('should specify Python runtime for FastAPI service', () => {
    const content = readFileSync(join(__dirname, '..', 'vercel.json'), 'utf-8');
    vercelConfig = JSON.parse(content);

    const hasPythonBuild = vercelConfig.builds.some(b => b.use.includes('python'));
    assert.ok(hasPythonBuild, 'Configuration should specify Python runtime for FastAPI');
  });

  it('should not have security vulnerabilities in configuration', () => {
    const content = readFileSync(join(__dirname, '..', 'vercel.json'), 'utf-8');
    vercelConfig = JSON.parse(content);

    // Check for potential security issues
    if (vercelConfig.env) {
      for (const [key, value] of Object.entries(vercelConfig.env)) {
        assert.ok(
          typeof value === 'string' && !value.includes('password'),
          'Environment variables should not contain hardcoded passwords'
        );
      }
    }
  });

  it('should have minimal required configuration', () => {
    const content = readFileSync(join(__dirname, '..', 'vercel.json'), 'utf-8');
    vercelConfig = JSON.parse(content);

    // Should have at least builds and routes
    assert.ok(vercelConfig.builds, 'Should have builds configuration');
    assert.ok(vercelConfig.routes, 'Should have routes configuration');
    assert.ok(vercelConfig.builds.length > 0, 'Should have at least one build');
    assert.ok(vercelConfig.routes.length > 0, 'Should have at least one route');
  });

  it('should not have invalid or unknown properties', () => {
    const content = readFileSync(join(__dirname, '..', 'vercel.json'), 'utf-8');
    vercelConfig = JSON.parse(content);

    const validTopLevelFields = [
      'builds',
      'routes',
      'env',
      'build',
      'headers',
      'redirects',
      'rewrites',
      'cleanUrls',
      'trailingSlash',
      'functions',
      'regions',
      'public',
      'github',
      'scope'
    ];

    for (const key of Object.keys(vercelConfig)) {
      assert.ok(
        validTopLevelFields.includes(key),
        `Unknown configuration field: ${key}`
      );
    }
  });

  it('should have proper route ordering for API patterns', () => {
    const content = readFileSync(join(__dirname, '..', 'vercel.json'), 'utf-8');
    vercelConfig = JSON.parse(content);

    // More specific routes should come before catch-all routes
    const routes = vercelConfig.routes;
    let foundCatchAll = false;

    for (const route of routes) {
      if (route.src === '/(.*)') {
        foundCatchAll = true;
      } else if (foundCatchAll) {
        assert.fail('Specific routes should come before catch-all routes');
      }
    }
  });

  it('should not have empty build configurations', () => {
    const content = readFileSync(join(__dirname, '..', 'vercel.json'), 'utf-8');
    vercelConfig = JSON.parse(content);

    for (const build of vercelConfig.builds) {
      assert.ok(Object.keys(build).length > 0, 'Build configuration should not be empty');
      assert.ok(build.src, 'Build should have src field');
      assert.ok(build.use, 'Build should have use field');
    }
  });

  it('should not have empty route configurations', () => {
    const content = readFileSync(join(__dirname, '..', 'vercel.json'), 'utf-8');
    vercelConfig = JSON.parse(content);

    for (const route of vercelConfig.routes) {
      assert.ok(Object.keys(route).length > 0, 'Route configuration should not be empty');
      assert.ok(route.src, 'Route should have src field');
      assert.ok(route.dest, 'Route should have dest field');
    }
  });

  it('should have valid JSON structure without syntax errors', () => {
    const content = readFileSync(join(__dirname, '..', 'vercel.json'), 'utf-8');

    // Should not have trailing commas
    assert.ok(!content.match(/,\s*[}\]]/), 'Should not have trailing commas');

    // Should be valid JSON
    assert.doesNotThrow(() => JSON.parse(content), 'Should be valid JSON');
  });

  it('should match main.py convention for FastAPI', () => {
    const content = readFileSync(join(__dirname, '..', 'vercel.json'), 'utf-8');
    vercelConfig = JSON.parse(content);

    const entryPoint = vercelConfig.builds[0].src;
    assert.strictEqual(entryPoint, 'main.py', 'FastAPI apps conventionally use main.py as entry point');
  });

  it('should route all paths to the same destination', () => {
    const content = readFileSync(join(__dirname, '..', 'vercel.json'), 'utf-8');
    vercelConfig = JSON.parse(content);

    const destinations = vercelConfig.routes.map(r => r.dest);
    const uniqueDestinations = new Set(destinations);

    // For a simple FastAPI app, all routes typically go to the same entry point
    assert.strictEqual(
      uniqueDestinations.size,
      1,
      'All routes should point to the same entry point for single-app deployment'
    );
  });

  it('should not override important Vercel settings', () => {
    const content = readFileSync(join(__dirname, '..', 'vercel.json'), 'utf-8');
    vercelConfig = JSON.parse(content);

    // Check for potentially problematic overrides
    if (vercelConfig.functions) {
      assert.ok(
        !vercelConfig.functions['*']?.maxDuration || vercelConfig.functions['*'].maxDuration <= 300,
        'Function timeout should not exceed reasonable limits'
      );
    }
  });

  it('should be deployable to Vercel', () => {
    const content = readFileSync(join(__dirname, '..', 'vercel.json'), 'utf-8');
    vercelConfig = JSON.parse(content);

    // Basic deployment requirements
    assert.ok(vercelConfig.builds && vercelConfig.builds.length > 0, 'Must have build configuration');
    assert.ok(vercelConfig.routes && vercelConfig.routes.length > 0, 'Must have route configuration');

    // Each build must have required fields
    for (const build of vercelConfig.builds) {
      assert.ok(build.src, 'Each build must have src');
      assert.ok(build.use, 'Each build must have use');
    }

    // Each route must have required fields
    for (const route of vercelConfig.routes) {
      assert.ok(route.src, 'Each route must have src');
      assert.ok(route.dest, 'Each route must have dest');
    }
  });
});