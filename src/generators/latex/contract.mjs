/** Shared JSON contract for generate-latex backends. */

export function normalizeReport(raw) {
  return {
    file: raw.file ?? null,
    path: raw.path ?? null,
    sizeKB: raw.sizeKB ?? null,
    counts: raw.counts ?? null,
    issues: raw.issues ?? [],
    valid: Boolean(raw.valid),
    compiled: Boolean(raw.compiled),
    engine: raw.engine ?? null,
    pdf: raw.pdf ?? null,
    compileError: raw.compileError ?? null,
    postCompileError: raw.postCompileError ?? null,
    backend: raw.backend ?? 'native',
  };
}

export function failureReport({ path, issues, backend = 'native', engine = null }) {
  return normalizeReport({
    path,
    issues,
    valid: false,
    compiled: false,
    backend,
    engine,
  });
}
