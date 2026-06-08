/** tex-docctor backend — build configured LaTeX project via CLI. */

import { copyFile, stat, mkdir } from 'fs/promises';
import { resolve, basename, join } from 'path';
import { execFileSync } from 'child_process';
import { existsSync } from 'fs';
import { normalizeReport, failureReport } from './contract.mjs';
import { loadLatexConfig } from './index.mjs';
import { ROOT } from '../../lib/root.mjs';

function resolveTexDocctorCli(td) {
  if (process.env.CAREER_OPS_TEX_DOCCTOR_CLI) {
    return { command: process.env.CAREER_OPS_TEX_DOCCTOR_CLI, argsPrefix: [] };
  }
  if (td.cli && td.cli !== 'tex-docctor' && existsSync(td.cli)) {
    return { command: td.cli, argsPrefix: [] };
  }
  try {
    execFileSync('tex-docctor', ['--help'], { stdio: 'pipe', timeout: 5000 });
    return { command: 'tex-docctor', argsPrefix: [] };
  } catch { /* fall through */ }

  const candidates = [
    process.env.TEX_DOCCTOR_ROOT,
    join(ROOT, '../../../tool-set/tex-docctor'),
    join(ROOT, '../../../../tool-set/tex-docctor'),
  ].filter(Boolean);

  for (const root of candidates) {
    const venvCli = join(root, '.venv/bin/tex-docctor');
    if (existsSync(venvCli)) {
      return { command: venvCli, argsPrefix: [] };
    }
    try {
      execFileSync('uv', ['--version'], { stdio: 'pipe' });
      return { command: 'uv', argsPrefix: ['run', '--directory', root, 'tex-docctor'] };
    } catch { /* next */ }
  }

  return { command: td.cli || 'tex-docctor', argsPrefix: [] };
}

function runTexDocctorBuild(projectDir, td) {
  const { command, argsPrefix } = resolveTexDocctorCli(td);
  const args = [
    ...argsPrefix,
    'build',
    '--plain',
    '--main', td.main,
    '--out', td.out_dir,
    '--build-dir', td.build_dir,
    '--engine', td.engine,
  ];
  return execFileSync(command, args, {
    cwd: projectDir,
    stdio: ['pipe', 'pipe', 'pipe'],
    timeout: 180_000,
    encoding: 'utf-8',
  });
}

export async function runTexDocctorBackend(inputPath, outputPath) {
  const absInput = resolve(inputPath);
  const config = loadLatexConfig();
  const td = config.tex_docctor;

  if (!td.project_dir && !process.env.CAREER_OPS_TEX_DOCCTOR_PROJECT_DIR) {
    return failureReport({
      path: absInput,
      backend: 'tex-docctor',
      issues: ['cv.tex_docctor.project_dir is not set in config/profile.yml'],
    });
  }

  const envProject = process.env.CAREER_OPS_TEX_DOCCTOR_PROJECT_DIR;
  const projectDir = resolve(
    String(envProject || td.project_dir).replace(/^~/, process.env.HOME || ''),
  );
  if (!existsSync(projectDir)) {
    return failureReport({
      path: absInput,
      backend: 'tex-docctor',
      issues: [`project_dir not found: ${projectDir}`],
    });
  }

  const targetPdf = outputPath
    ? resolve(outputPath)
    : resolve(join(absInput, '..', `${basename(absInput, '.tex')}.pdf`));

  await mkdir(resolve(targetPdf, '..'), { recursive: true });

  let exitCode = 1;
  let stderr = '';
  try {
    runTexDocctorBuild(projectDir, td);
    exitCode = 0;
  } catch (err) {
    exitCode = err.status ?? 1;
    stderr = err.stderr?.toString?.() || err.message || '';
  }

  const mainStem = basename(String(td.main), '.tex');
  const builtPdf = resolve(projectDir, td.out_dir, `${mainStem}.pdf`);

  const report = normalizeReport({
    file: basename(absInput),
    path: absInput,
    valid: true,
    issues: [],
    compiled: exitCode === 0 && existsSync(builtPdf),
    engine: 'tex-docctor',
    backend: 'tex-docctor',
    compileError: exitCode !== 0 ? (stderr || `tex-docctor exited ${exitCode}`) : null,
  });

  if (!report.compiled) {
    return report;
  }

  try {
    await copyFile(builtPdf, targetPdf);
    const pdfStat = await stat(targetPdf);
    report.pdf = {
      path: targetPdf,
      sizeKB: parseFloat((pdfStat.size / 1024).toFixed(1)),
      source_pdf: builtPdf,
    };
  } catch (err) {
    report.compiled = false;
    report.postCompileError = `Failed to copy PDF: ${err.message}`;
  }

  return report;
}
