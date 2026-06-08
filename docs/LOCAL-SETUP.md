# Local Setup — Mauro (dashboard Go + tex-docctor)

Configuração consolidada para esta instância de career-ops em  
`/home/mauro/development/PROJECTS_OUTPLACEMENT/job-search-tooling/career-ops/`.

Planejamento completo + checklist de gaps: [`PLANEJAMENTO.md`](PLANEJAMENTO.md).

## Stack padrão

| Componente | Papel |
|------------|--------|
| **Cursor CLI (`agent`)** | Agente — eval, scan, pipeline |
| **tex-docctor** | Compilação LaTeX (`cv.latex_backend: tex-docctor`) |
| **Dashboard Go** | TUI — browse tracker (`npm run dashboard`) |
| **modes/pt** | Eval e textos em PT-BR (`language.modes_dir`) |

## Arquivos user-layer (gitignored)

| Arquivo | Status |
|---------|--------|
| `config/profile.yml` | Identidade, CV output, tex-docctor paths |
| `cv.md` | CV markdown (fonte de verdade) |
| `modes/_profile.md` | Arquetipos, narrativa, regras LaTeX |
| `portals.yml` | Scanner de vagas |
| `data/applications.md` | Tracker |

## profile.yml — chaves críticas

```yaml
language:
  modes_dir: modes/pt

cv:
  output_format: latex
  latex_backend: tex-docctor
  tex_docctor:
    project_dir: /home/mauro/development/tool-set/tex-docctor/target-files/curriculum-vitae/mauro-cv-oficial/.build-workspace
    main: src/main.tex
    engine: latexmk
    out_dir: out
    build_dir: .tex-docctor/build

auto_pdf_score_threshold: 4.0
```

## Fluxo eval → PDF

1. Colar URL/JD → auto-pipeline
2. `cv.output_format: latex` → `modes/latex.md` (ou `modes/pt/` se configurado)
3. Agente ajusta seções em `{project_dir}/src/secoes/` conforme JD
4. `node src/generators/generate-latex.mjs …` → tex-docctor build → PDF em `output/`
5. Tracker TSV → `src/pipeline/merge-tracker.mjs`

## Dashboard

```bash
npm run dashboard:build   # uma vez (ou após mudanças Go)
npm run dashboard         # TUI
```

Atalhos: filtros por status, sort score, `r` refresh.

## tex-docctor — rebuild workspace base

```bash
cd /home/mauro/development/tool-set/tex-docctor
bash docs/curriculum-vitae/build-cv.sh mauro-cv-oficial
```

## MCP (opcional Cursor)

```json
{
  "tex-docctor": {
    "command": "uv",
    "args": ["run", "--directory", "/home/mauro/development/tool-set/tex-docctor", "tex-docctor-mcp"]
  },
  "typoruler": {
    "command": "uv",
    "args": ["run", "--directory", "/home/mauro/development/tool-set/typoruler", "typoruler-mcp"]
  }
}
```

## Verificação

```bash
npm run doctor
npm run sync-check
node src/generators/generate-latex.mjs output/.probe.tex output/.probe.pdf --backend=tex-docctor
```

## Limitações conhecidas

- **Batch** (`batch/batch-prompt.md`) ainda usa `generate-pdf.mjs` (HTML). Use pipeline interativo ou batch manual para LaTeX.
- **Personalização por vaga** com tex-docctor exige editar seções no workspace Jinja2 antes do build — não usa `templates/cv-template.tex` (sb2nov).

## Referências monorepo

Planejamento upstream:  
`/home/mauro/development/PROJECTS_OUTPLACEMENT/docs/monorepo-versioning-strategy.md`
