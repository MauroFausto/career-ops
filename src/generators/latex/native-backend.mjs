/** Native sb2nov backend — validate + tectonic/pdflatex compile. */

import { readFile, writeFile, stat, copyFile, rm } from 'fs/promises';
import { resolve, basename, dirname, join } from 'path';
import { execFileSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import { normalizeReport } from './contract.mjs';

const REQUIRED_SECTIONS = [
  '\\\\section{Education}',
  '\\\\section{Work Experience}',
  '\\\\section{Personal Projects}',
  '\\\\section{Technical Skills}',
];

const REQUIRED_COMMANDS = [
  '\\\\resumeSubheading',
  '\\\\resumeItem',
  '\\\\resumeProjectHeading',
];

export async function runNativeBackend(inputPath, outputPath) {
  const absPath = resolve(inputPath);
  let content;
  try {
    content = await readFile(absPath, 'utf-8');
  } catch (err) {
    throw new Error(`Error reading ${absPath}: ${err.message}`);
  }

  const issues = [];

  for (const pattern of REQUIRED_SECTIONS) {
    if (!new RegExp(pattern).test(content)) {
      issues.push(`Missing section matching: ${pattern}`);
    }
  }

  for (const cmd of REQUIRED_COMMANDS) {
    if (!new RegExp(cmd).test(content)) {
      issues.push(`Missing command: ${cmd}`);
    }
  }

  if (!content.includes('\\begin{document}')) {
    issues.push('Missing \\begin{document}');
  }
  if (!content.includes('\\end{document}')) {
    issues.push('Missing \\end{document}');
  }

  const unresolvedMatch = content.match(/\{\{[A-Z_]+\}\}/g);
  if (unresolvedMatch) {
    issues.push(`Unresolved placeholders: ${[...new Set(unresolvedMatch)].join(', ')}`);
  }

  const lines = content.split('\n');
  let resumeItemCount = 0;
  let subheadingCount = 0;
  let projectHeadingCount = 0;

  for (const line of lines) {
    if (/\\resumeItem\{/.test(line)) resumeItemCount++;
    if (/\\resumeSubheading[^C]/.test(line)) subheadingCount++;
    if (/\\resumeProjectHeading/.test(line)) projectHeadingCount++;
  }

  if (!content.includes('\\pdfgentounicode=1')) {
    issues.push('Missing \\pdfgentounicode=1 (ATS compatibility)');
  }

  const fileInfo = await stat(absPath);
  const report = normalizeReport({
    file: basename(absPath),
    path: absPath,
    sizeKB: parseFloat((fileInfo.size / 1024).toFixed(1)),
    counts: {
      resumeItems: resumeItemCount,
      subheadings: subheadingCount,
      projectHeadings: projectHeadingCount,
    },
    issues,
    valid: issues.length === 0,
    backend: 'native',
  });

  if (issues.length > 0) {
    return report;
  }

  const texDir = dirname(absPath);
  const texBase = basename(absPath, '.tex');
  const defaultPdf = join(texDir, `${texBase}.pdf`);
  const targetPdf = outputPath ? resolve(outputPath) : defaultPdf;

  const targetDir = dirname(targetPdf);
  if (!existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true });
  }

  let engine = null;
  for (const candidate of ['tectonic', 'pdflatex']) {
    try {
      execFileSync(candidate, ['--version'], { stdio: 'pipe' });
      engine = candidate;
      break;
    } catch { /* not found */ }
  }

  if (!engine) {
    report.compiled = false;
    report.compileError = 'No LaTeX engine found. Install tectonic or pdflatex.';
    return report;
  }

  report.engine = engine;

  let compilePath = absPath;
  if (engine === 'tectonic') {
    const patched = content
      .replace(/\\pdfgentounicode\s*=\s*\d+[^\n]*\n?/g, '')
      .replace(/\\input\{glyphtounicode\}[^\n]*\n?/g, '');
    compilePath = join(texDir, `${texBase}._tectonic.tex`);
    await writeFile(compilePath, patched, 'utf-8');
  }

  try {
    if (engine === 'tectonic') {
      execFileSync('tectonic', ['--outdir', texDir, compilePath], {
        cwd: texDir,
        stdio: 'pipe',
        timeout: 120_000,
      });
    } else {
      const pdflatexArgs = [
        '-no-shell-escape',
        '-interaction=nonstopmode',
        '-halt-on-error',
        `-output-directory=${texDir}`,
        absPath,
      ];
      execFileSync('pdflatex', pdflatexArgs, { cwd: texDir, stdio: 'pipe', timeout: 120_000 });
      execFileSync('pdflatex', pdflatexArgs, { cwd: texDir, stdio: 'pipe', timeout: 120_000 });
    }
    report.compiled = true;
  } catch (err) {
    const logPath = join(texDir, `${texBase}.log`);
    let latexError = err.message;
    try {
      const log = await readFile(logPath, 'utf-8');
      const errorLines = log.split('\n').filter(l => l.startsWith('!'));
      if (errorLines.length > 0) {
        latexError = errorLines.join('\n');
      }
    } catch { /* no log */ }
    report.compiled = false;
    report.compileError = latexError;
    return report;
  }

  const compileBase = basename(compilePath, '.tex');
  const compiledPdf = join(texDir, `${compileBase}.pdf`);

  try {
    await copyFile(compiledPdf, targetPdf);
    if (resolve(compiledPdf) !== resolve(targetPdf)) {
      await rm(compiledPdf).catch(() => {});
    }
    const pdfStat = await stat(targetPdf);
    report.pdf = {
      path: targetPdf,
      sizeKB: parseFloat((pdfStat.size / 1024).toFixed(1)),
    };
  } catch (err) {
    report.postCompileError = `Failed to finalize PDF: ${err.message}`;
    report.compiled = false;
  }

  const auxExts = ['.aux', '.log', '.out', '.fls', '.fdb_latexmk', '.synctex.gz'];
  for (const ext of auxExts) {
    await rm(join(texDir, `${compileBase}${ext}`)).catch(() => {});
  }
  if (engine === 'tectonic') {
    await rm(compilePath).catch(() => {});
  }

  return report;
}
