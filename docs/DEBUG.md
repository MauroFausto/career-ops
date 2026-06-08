# Debug — career-ops

Perfis em [`tool-set/.vscode/launch.json`](../../../../tool-set/.vscode/launch.json). Workspace root: **`tool-set`** (não `career-ops`).

Paths usam `${workspaceFolder}/../PROJECTS_OUTPLACEMENT/job-search-tooling/career-ops`.

## Pré-requisitos

| Runtime | Uso | Instalação |
|---------|-----|------------|
| **Go 1.21+** | Dashboard TUI | `sudo apt install golang-go` |
| **Node 18+** | Scripts `src/*.mjs` | já no PATH |
| **Go extension** | Debug Go no Cursor | marketplace: `golang.go` |

## Cursor CLI (agente)

Fluxo operacional — **não** usa `claude`:

```bash
cd /home/mauro/development/PROJECTS_OUTPLACEMENT/job-search-tooling/career-ops
agent   # colar URL vaga → eval → PDF LaTeX
```

Agente lê `AGENTS.md`, `modes/*.md`, user-layer (`cv.md`, `profile.yml`, …) e invoca scripts Node quando necessário.

## Perfis Go

| Perfil | Entry | Args |
|--------|-------|------|
| **career-ops: Go Dashboard TUI** | `dashboard/main.go` | `--path` → career-ops root |
| **career-ops: Go Dashboard (test package)** | `dashboard/...` | modo test |

Breakpoint úteis:

- `dashboard/main.go` — bootstrap, `ParseApplications`
- `dashboard/internal/data/career.go` — parse tracker, enrich URLs
- `dashboard/internal/ui/screens/pipeline.go` — TUI, filtros, status update

## Perfis Node (.mjs)

| Perfil | Script |
|--------|--------|
| **career-ops: Node doctor** | `src/system/doctor.mjs` |
| **career-ops: Node generate-latex (tex-docctor)** | probe build tex-docctor |
| **career-ops: Node generate-pdf (HTML/Playwright)** | HTML → PDF |
| **career-ops: Node merge-tracker** | TSV → `applications.md` |
| **career-ops: Node verify-pipeline** | health check tracker |
| **career-ops: Node scan (portals)** | `src/scan/scan.mjs` |
| **career-ops: Node analyze-patterns** | `src/analysis/analyze-patterns.mjs` |
| **career-ops: Node Current .mjs file** | arquivo aberto no editor |
| **career-ops: Node Attach (port 9229)** | attach manual |

Para attach manual:

```bash
node --inspect-brk=9229 src/generators/generate-latex.mjs output/.probe.tex output/.probe.pdf --backend=tex-docctor
```

Depois: **Run and Debug** → **career-ops: Node Attach (port 9229)**.

## Variáveis de ambiente (debug LaTeX)

```bash
export CAREER_OPS_TEX_DOCCTOR_PROJECT_DIR=/path/to/.build-workspace
export CAREER_OPS_TEX_DOCCTOR_CLI=/path/to/tex-docctor
export TEX_DOCCTOR_ROOT=/home/mauro/development/tool-set/tex-docctor
```

Adicionar em `launch.json` → `"env": { ... }` no perfil desejado.

## Diagrama de fluxo de dados

5 faixas horizontais (A→E), fonte 26px — alinhado a `career-ops-deps.mmd`:

| Faixa | Conteúdo |
|-------|----------|
| **A** | Entrypoint `agent` + contexto |
| **B** | Pipeline agente (eval → tailor) |
| **C** | Subprocess Node (`src/`) |
| **D** | Store filesystem |
| **E** | Dashboard Go (leitura + status) |

Arquivos:

- [`diagrams/data-flow/career-ops-entrypoint-dataflow.mmd`](diagrams/data-flow/career-ops-entrypoint-dataflow.mmd)
- [`diagrams/data-flow/career-ops-entrypoint-dataflow.png`](diagrams/data-flow/career-ops-entrypoint-dataflow.png)

Render local:

```bash
npx @mermaid-js/mermaid-cli \
  -i docs/diagrams/data-flow/career-ops-entrypoint-dataflow.mmd \
  -o docs/diagrams/data-flow/career-ops-entrypoint-dataflow.png \
  -b white -w 2200
```
