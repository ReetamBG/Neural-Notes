import { describe, it } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('AI Service README.md validation', () => {
  let readmeContent;

  it('should exist and be readable', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');
    assert.ok(readmeContent, 'README.md should be readable');
    assert.ok(readmeContent.length > 0, 'README.md should not be empty');
  });

  it('should identify as AI Service', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');
    assert.ok(readmeContent.includes('AI Service'), 'Should identify as AI Service');
  });

  it('should mention FastAPI framework', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');
    assert.ok(readmeContent.includes('FastAPI'), 'Should mention FastAPI framework');
  });

  it('should have tech stack section', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');
    assert.ok(readmeContent.includes('Tech Stack'), 'Should have Tech Stack section');
  });

  it('should mention Python requirement', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');
    assert.ok(readmeContent.includes('Python'), 'Should mention Python requirement');
  });

  it('should mention FFmpeg requirement', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');
    assert.ok(readmeContent.includes('FFmpeg') || readmeContent.includes('ffmpeg'), 'Should mention FFmpeg requirement');
  });

  it('should mention OpenRouter API', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');
    assert.ok(readmeContent.includes('OpenRouter'), 'Should mention OpenRouter API');
  });

  it('should have prerequisites section', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');
    assert.ok(readmeContent.includes('Prerequisites'), 'Should have Prerequisites section');
  });

  it('should have setup instructions', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');
    const hasSetup = readmeContent.includes('Setup') ||
                     readmeContent.includes('Getting Started');
    assert.ok(hasSetup, 'Should have setup instructions');
  });

  it('should mention virtual environment setup', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');
    const hasVenv = readmeContent.includes('venv') ||
                    readmeContent.includes('virtual environment');
    assert.ok(hasVenv, 'Should mention virtual environment setup');
  });

  it('should mention requirements.txt installation', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');
    assert.ok(readmeContent.includes('requirements.txt'), 'Should mention requirements.txt');
  });

  it('should have environment configuration section', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');
    const hasEnvConfig = readmeContent.includes('.env') ||
                        readmeContent.includes('Environment') ||
                        readmeContent.includes('OPENROUTER_API_KEY');
    assert.ok(hasEnvConfig, 'Should have environment configuration section');
  });

  it('should mention API key configuration', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');
    assert.ok(readmeContent.includes('API key') || readmeContent.includes('OPENROUTER_API_KEY'), 'Should mention API key configuration');
  });

  it('should have API endpoints section', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');
    assert.ok(readmeContent.includes('API Endpoints'), 'Should have API Endpoints section');
  });

  it('should document upload endpoints', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');
    const hasUpload = readmeContent.includes('/upload') ||
                      readmeContent.includes('POST') && readmeContent.includes('pdf');
    assert.ok(hasUpload, 'Should document upload endpoints');
  });

  it('should document chat endpoints', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');
    const hasChat = readmeContent.includes('/chat');
    assert.ok(hasChat, 'Should document chat endpoints');
  });

  it('should document analysis endpoints', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');
    const hasAnalysis = readmeContent.includes('/analysis');
    assert.ok(hasAnalysis, 'Should document analysis endpoints');
  });

  it('should mention health check endpoint', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');
    assert.ok(readmeContent.includes('/health'), 'Should mention health check endpoint');
  });

  it('should mention localhost port 8000', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');
    assert.ok(readmeContent.includes('8000'), 'Should mention port 8000');
  });

  it('should have development workflow section', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');
    const hasDev = readmeContent.includes('Development') ||
                   readmeContent.includes('Running');
    assert.ok(hasDev, 'Should have development workflow section');
  });

  it('should mention uvicorn server', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');
    assert.ok(readmeContent.includes('uvicorn'), 'Should mention uvicorn server');
  });

  it('should have troubleshooting section', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');
    assert.ok(readmeContent.includes('Troubleshooting'), 'Should have Troubleshooting section');
  });

  it('should mention LangChain', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');
    assert.ok(readmeContent.includes('LangChain'), 'Should mention LangChain');
  });

  it('should mention ChromaDB', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');
    assert.ok(readmeContent.includes('Chroma'), 'Should mention ChromaDB');
  });

  it('should mention Vosk', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');
    assert.ok(readmeContent.includes('Vosk'), 'Should mention Vosk for speech recognition');
  });

  it('should have API documentation reference', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');
    const hasDocs = readmeContent.includes('/docs') ||
                    readmeContent.includes('API Documentation');
    assert.ok(hasDocs, 'Should reference API documentation');
  });

  it('should mention NLTK', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');
    assert.ok(readmeContent.includes('NLTK'), 'Should mention NLTK');
  });

  it('should have code examples or curl commands', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');
    const hasExamples = readmeContent.includes('curl') ||
                       readmeContent.includes('```bash') ||
                       readmeContent.includes('```python');
    assert.ok(hasExamples, 'Should have code examples or curl commands');
  });

  it('should mention required directories', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');
    const hasDirs = readmeContent.includes('data/') ||
                    readmeContent.includes('mkdir');
    assert.ok(hasDirs, 'Should mention required directories');
  });

  it('should have valid markdown headers', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');

    const lines = readmeContent.split('\n');
    for (const line of lines) {
      if (line.startsWith('#')) {
        assert.ok(/^#{1,6}\s+.+/.test(line), `Invalid header: ${line}`);
      }
    }
  });

  it('should mention model downloads', () => {
    readmeContent = readFileSync(join(__dirname, '..', 'README.md'), 'utf-8');
    const hasModels = readmeContent.includes('model') ||
                      readmeContent.includes('download');
    assert.ok(hasModels, 'Should mention model downloads');
  });
});