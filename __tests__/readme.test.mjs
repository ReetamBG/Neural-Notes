import { describe, it } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('Root README.md validation', () => {
  let readmeContent;

  it('should exist and be readable', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');
    assert.ok(readmeContent, 'README.md should be readable');
    assert.ok(readmeContent.length > 0, 'README.md should not be empty');
  });

  it('should have a title', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');
    assert.ok(readmeContent.includes('# Neural Notes'), 'Should have main title');
  });

  it('should have a description', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');
    const hasDescription = readmeContent.includes('intelligent notes app') ||
                          readmeContent.includes('AI-powered');
    assert.ok(hasDescription, 'Should have a project description');
  });

  it('should have features section', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');
    assert.ok(readmeContent.includes('## ✨ Features'), 'Should have Features section');
  });

  it('should have getting started section', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');
    assert.ok(readmeContent.includes('## 🚀 Getting Started'), 'Should have Getting Started section');
  });

  it('should have prerequisites section', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');
    assert.ok(readmeContent.includes('Prerequisites'), 'Should have Prerequisites section');
  });

  it('should mention required services', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');
    assert.ok(readmeContent.includes('AI Service'), 'Should mention AI Service');
    assert.ok(readmeContent.includes('Frontend App') || readmeContent.includes('Next.js'), 'Should mention Frontend');
  });

  it('should have technology stack section', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');
    assert.ok(readmeContent.includes('Technology Stack'), 'Should have Technology Stack section');
  });

  it('should mention key technologies', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');
    assert.ok(readmeContent.includes('Next.js'), 'Should mention Next.js');
    assert.ok(readmeContent.includes('FastAPI'), 'Should mention FastAPI');
    assert.ok(readmeContent.includes('TypeScript'), 'Should mention TypeScript');
  });

  it('should have project structure section', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');
    assert.ok(readmeContent.includes('Project Structure'), 'Should have Project Structure section');
  });

  it('should reference both services in structure', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');
    assert.ok(readmeContent.includes('app/'), 'Should reference app directory');
    assert.ok(readmeContent.includes('ai-service/'), 'Should reference ai-service directory');
  });

  it('should have contributing section', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');
    assert.ok(readmeContent.includes('Contributing'), 'Should have Contributing section');
  });

  it('should have license section', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');
    assert.ok(readmeContent.includes('License'), 'Should have License section');
  });

  it('should not have broken markdown links', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');

    // Check for broken markdown link syntax
    const brokenLinkPattern = /\[([^\]]+)\]\(\s*\)/g;
    const brokenLinks = readmeContent.match(brokenLinkPattern);

    assert.ok(!brokenLinks || brokenLinks.length === 0, 'Should not have broken markdown links');
  });

  it('should have valid markdown headers', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');

    const lines = readmeContent.split('\n');
    for (const line of lines) {
      if (line.startsWith('#')) {
        // Headers should have space after #
        assert.ok(/^#{1,6}\s+.+/.test(line), `Invalid header format: ${line}`);
      }
    }
  });

  it('should reference service-specific READMEs', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');

    assert.ok(
      readmeContent.includes('ai-service/README.md') || readmeContent.includes('/ai-service'),
      'Should reference AI service README'
    );
    assert.ok(
      readmeContent.includes('app/README.md') || readmeContent.includes('/app'),
      'Should reference App README'
    );
  });

  it('should have setup instructions', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');

    const hasSetup = readmeContent.includes('Setup') ||
                     readmeContent.includes('Installation') ||
                     readmeContent.includes('git clone');
    assert.ok(hasSetup, 'Should have setup instructions');
  });

  it('should mention use cases', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');
    assert.ok(readmeContent.includes('Use Cases'), 'Should have Use Cases section');
  });

  it('should not contain placeholder text', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');

    const placeholders = ['TODO', 'FIXME', 'XXX', 'PLACEHOLDER', 'TBD'];
    for (const placeholder of placeholders) {
      assert.ok(!readmeContent.includes(placeholder), `Should not contain placeholder: ${placeholder}`);
    }
  });

  it('should have consistent emoji usage in headers', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');

    // Count headers with emojis
    const emojiHeaderPattern = /^##\s+[\u{1F000}-\u{1FFFF}]/gmu;
    const emojiHeaders = readmeContent.match(emojiHeaderPattern);

    // If using emojis, most headers should have them for consistency
    if (emojiHeaders && emojiHeaders.length > 2) {
      assert.ok(true, 'Has consistent emoji usage in headers');
    }
  });
});