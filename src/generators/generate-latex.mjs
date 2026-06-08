#!/usr/bin/env node

/**
 * generate-latex.mjs — Validate and compile CV .tex to PDF (facade)
 *
 * Usage:
 *   node src/generators/generate-latex.mjs <input.tex> [output.pdf] [--backend=native|tex-docctor]
 *
 * Backends (config/profile.yml → cv.latex_backend):
 *   native      — sb2nov template + tectonic/pdflatex (default)
 *   tex-docctor — tex-docctor build in cv.tex_docctor.project_dir
 */

import { resolveBackendName } from './latex/index.mjs';
import { runNativeBackend } from './latex/native-backend.mjs';
import { runTexDocctorBackend } from './latex/tex-docctor-backend.mjs';

function parseArgs(argv) {
  const positional = [];
  let backendOverride = null;
  for (const arg of argv) {
    if (arg.startsWith('--backend=')) {
      backendOverride = arg.slice('--backend='.length);
    } else {
      positional.push(arg);
    }
  }
  return { inputPath: positional[0], outputPath: positional[1], backendOverride };
}

async function main() {
  const { inputPath, outputPath, backendOverride } = parseArgs(process.argv.slice(2));

  if (!inputPath) {
    console.error('Usage: node generate-latex.mjs <input.tex> [output.pdf] [--backend=native|tex-docctor]');
    process.exit(1);
  }

  const backend = resolveBackendName(backendOverride);
  let report;

  if (backend === 'tex-docctor') {
    report = await runTexDocctorBackend(inputPath, outputPath);
  } else {
    report = await runNativeBackend(inputPath, outputPath);
  }

  console.log(JSON.stringify(report, null, 2));
  process.exit(report.compiled ? 0 : 1);
}

main();
