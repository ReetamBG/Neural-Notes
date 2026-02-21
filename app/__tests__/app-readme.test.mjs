import { describe, it } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('App README.md validation', () => {
  let readmeContent;

  it('should exist and be readable', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');
    assert.ok(readmeContent, 'README.md should be readable');
    assert.ok(readmeContent.length > 0, 'README.md should not be empty');
  });

  it('should identify as Neural Notes Frontend', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');
    const isFrontend = readmeContent.includes('Frontend') || readmeContent.includes('frontend');
    assert.ok(isFrontend, 'Should identify as frontend application');
  });

  it('should have tech stack section', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');
    assert.ok(readmeContent.includes('Tech Stack'), 'Should have Tech Stack section');
  });

  it('should mention Next.js framework', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');
    assert.ok(readmeContent.includes('Next.js'), 'Should mention Next.js');
  });

  it('should mention TypeScript', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');
    assert.ok(readmeContent.includes('TypeScript'), 'Should mention TypeScript');
  });

  it('should have getting started section', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');
    assert.ok(readmeContent.includes('Getting Started'), 'Should have Getting Started section');
  });

  it('should have prerequisites', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');
    assert.ok(readmeContent.includes('Prerequisites'), 'Should have Prerequisites section');
  });

  it('should mention Node.js requirement', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');
    assert.ok(readmeContent.includes('Node.js'), 'Should mention Node.js requirement');
  });

  it('should have installation instructions', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');
    const hasInstall = readmeContent.includes('npm install') ||
                       readmeContent.includes('yarn install') ||
                       readmeContent.includes('pnpm install');
    assert.ok(hasInstall, 'Should have package installation instructions');
  });

  it('should mention environment configuration', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');
    const hasEnvConfig = readmeContent.includes('.env') ||
                        readmeContent.includes('environment variable') ||
                        readmeContent.includes('Environment Configuration');
    assert.ok(hasEnvConfig, 'Should mention environment configuration');
  });

  it('should mention Clerk authentication', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');
    assert.ok(readmeContent.includes('Clerk'), 'Should mention Clerk authentication');
  });

  it('should mention Prisma database', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');
    assert.ok(readmeContent.includes('Prisma'), 'Should mention Prisma ORM');
  });

  it('should have database setup instructions', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');
    const hasDbSetup = readmeContent.includes('prisma generate') ||
                       readmeContent.includes('prisma migrate') ||
                       readmeContent.includes('Database Setup');
    assert.ok(hasDbSetup, 'Should have database setup instructions');
  });

  it('should have development server instructions', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');
    assert.ok(readmeContent.includes('npm run dev'), 'Should have dev server instructions');
  });

  it('should mention localhost port', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');
    assert.ok(readmeContent.includes('localhost:3000'), 'Should mention default Next.js port');
  });

  it('should have production build section', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');
    const hasBuild = readmeContent.includes('npm run build') ||
                     readmeContent.includes('Production Build');
    assert.ok(hasBuild, 'Should have production build instructions');
  });

  it('should have project structure section', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');
    assert.ok(readmeContent.includes('Project Structure'), 'Should have Project Structure section');
  });

  it('should mention src directory structure', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');
    assert.ok(readmeContent.includes('src/'), 'Should reference src directory');
  });

  it('should have available scripts section', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');
    const hasScripts = readmeContent.includes('Available Scripts') ||
                       readmeContent.includes('Scripts');
    assert.ok(hasScripts, 'Should have Available Scripts section');
  });

  it('should document key components', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');
    const hasComponents = readmeContent.includes('Components') ||
                         readmeContent.includes('Editor') ||
                         readmeContent.includes('Chat');
    assert.ok(hasComponents, 'Should document key components');
  });

  it('should mention AI service integration', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');
    const hasAiService = readmeContent.includes('AI Service') ||
                        readmeContent.includes('localhost:8000');
    assert.ok(hasAiService, 'Should mention AI service integration');
  });

  it('should have troubleshooting section', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');
    assert.ok(readmeContent.includes('Troubleshooting'), 'Should have Troubleshooting section');
  });

  it('should mention Tailwind CSS', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');
    assert.ok(readmeContent.includes('Tailwind'), 'Should mention Tailwind CSS');
  });

  it('should have valid markdown syntax', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');

    const lines = readmeContent.split('\n');
    for (const line of lines) {
      if (line.startsWith('#')) {
        assert.ok(/^#{1,6}\s+.+/.test(line), `Invalid header: ${line}`);
      }
    }
  });

  it('should reference correct package manager commands', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');

    // Should use consistent package manager or show alternatives
    const hasNpm = readmeContent.includes('npm');
    const hasYarn = readmeContent.includes('yarn');
    const hasPnpm = readmeContent.includes('pnpm');

    assert.ok(hasNpm || hasYarn || hasPnpm, 'Should reference at least one package manager');
  });
});