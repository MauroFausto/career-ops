/** Load cv.latex settings from config/profile.yml */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import yaml from 'js-yaml';
import { ROOT } from '../../lib/root.mjs';

const DEFAULTS = {
  latex_backend: 'native',
  tex_docctor: {
    project_dir: null,
    main: 'src/main.tex',
    engine: 'latexmk',
    out_dir: 'out',
    build_dir: '.tex-docctor/build',
    cli: 'tex-docctor',
  },
};

export function loadLatexConfig() {
  const profilePath = join(ROOT, 'config/profile.yml');
  if (!existsSync(profilePath)) {
    return { ...DEFAULTS, tex_docctor: { ...DEFAULTS.tex_docctor } };
  }
  const profile = yaml.load(readFileSync(profilePath, 'utf-8')) || {};
  const cv = profile.cv || {};
  const td = cv.tex_docctor || {};
  return {
    latex_backend: cv.latex_backend || DEFAULTS.latex_backend,
    tex_docctor: {
      ...DEFAULTS.tex_docctor,
      ...td,
    },
  };
}

export function resolveBackendName(override) {
  if (override) return override;
  return loadLatexConfig().latex_backend;
}
