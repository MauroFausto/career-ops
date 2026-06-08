## 2026-06-03 - 10:45
- Movido `solution0/career-ops/` → `job-search-tooling/career-ops/`; removido `solution0/`;
- Removidos dotdirs caveman/multi-CLI (29 dirs) + `skills/` + `skills-lock.json`; mantidos `.agents/`, `.claude/`, `.claude-plugin/`, `.qwen/`, `.github/`, `.git`;
- Scripts reorganizados em `src/{generators,pipeline,scan,liveness,analysis,system,tests,lib}/`; refs atualizadas em package.json, modes, docs, CI, batch-runner;
- Testes `--quick`: 153 passed após `npm install`.

--- TimeLine das mudanças no código/documentos ---
- `src/lib/root.mjs` — helper ROOT compartilhado
- 18 `.mjs` movidos da raiz para subdirs funcionais
- `providers/` → `src/scan/providers/`
- `package.json` npm scripts + `test` script
- `.github/workflows/test.yml`, `batch/batch-runner.sh`, `update-system.mjs` SYSTEM_PATHS
- ~42 arquivos markdown/yml com paths `node src/...`
