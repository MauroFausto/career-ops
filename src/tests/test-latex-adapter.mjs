#!/usr/bin/env node

/**
 * Unit-style checks for LaTeX adapter (contract, config, backend routing).
 */

import { strict as assert } from 'assert';
import { writeFileSync, mkdirSync, rmSync, existsSync } from 'fs';
import { join } from 'path';
import { normalizeReport, failureReport } from '../generators/latex/contract.mjs';
import { loadLatexConfig, resolveBackendName } from '../generators/latex/index.mjs';
import { ROOT } from '../lib/root.mjs';

let passed = 0;
let failed = 0;

function ok(label, fn) {
  try {
    fn();
    console.log(`  ✅ ${label}`);
    passed++;
  } catch (err) {
    console.log(`  ❌ ${label}: ${err.message}`);
    failed++;
  }
}

console.log('\n=== LaTeX Adapter Tests ===\n');

ok('normalizeReport sets defaults', () => {
  const r = normalizeReport({ valid: true, compiled: true });
  assert.equal(r.backend, 'native');
  assert.deepEqual(r.issues, []);
});

ok('failureReport marks invalid', () => {
  const r = failureReport({ path: '/tmp/x.tex', issues: ['missing section'], backend: 'tex-docctor' });
  assert.equal(r.valid, false);
  assert.equal(r.backend, 'tex-docctor');
});

const profileBackup = join(ROOT, 'config/profile.yml');
const hadProfile = existsSync(profileBackup);

const testProfileDir = join(ROOT, 'config');
mkdirSync(testProfileDir, { recursive: true });
const tmpProfile = join(testProfileDir, '.profile-adapter-test.yml');

writeFileSync(
  tmpProfile,
  `cv:
  latex_backend: tex-docctor
  tex_docctor:
    project_dir: /tmp/tex-docctor-test
    main: src/main.tex
    engine: latexmk
`,
  'utf-8'
);

ok('resolveBackendName honors override', () => {
  assert.equal(resolveBackendName('tex-docctor'), 'tex-docctor');
  assert.equal(resolveBackendName('native'), 'native');
});

ok('loadLatexConfig reads defaults when profile missing fields', () => {
  const cfg = loadLatexConfig();
  assert.ok(['native', 'tex-docctor'].includes(cfg.latex_backend));
  assert.ok(cfg.tex_docctor);
  assert.equal(cfg.tex_docctor.main, 'src/main.tex');
});

console.log(`\n📊 Adapter tests: ${passed} passed, ${failed} failed\n`);
rmSync(tmpProfile, { force: true });
process.exit(failed > 0 ? 1 : 0);
