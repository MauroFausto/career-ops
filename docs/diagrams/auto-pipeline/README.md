# Modo: auto-pipeline — `/career-ops {cole um JD}`

## Propósito

Pipeline completo automático: extrair JD → avaliação A–G → relatório → PDF → rascunho de candidatura (se score ≥ 4.5) → tracker.

Também dispara quando o usuário cola URL ou texto de vaga **sem** subcomando explícito.

## Atores

| Ator              | Papel                                              |
|-------------------|----------------------------------------------------|
| Candidato         | Cola URL ou texto da vaga                          |
| Agente IA         | Orquestra modos `oferta` + `pdf`/`latex`           |
| Playwright        | Extrai JD de SPAs (Lever, Ashby, Greenhouse…)     |
| Node              | `generate-pdf.mjs` ou `generate-latex.mjs`        |
| Node              | `merge-tracker.mjs` (via TSV em batch/)           |

## Entradas

| Fonte            | Conteúdo                                           |
|------------------|----------------------------------------------------|
| Chat             | URL ou texto do JD                                 |
| `cv.md`          | CV canônico                                        |
| `article-digest.md` | Proof points (opcional)                         |
| `config/profile.yml` | Identidade, `cv.output_format`, thresholds    |
| `modes/_shared.md` | Arquétipos, pesos, tom                           |
| `modes/oferta.md` | Blocos A–G                                         |
| `modes/pdf.md` ou `modes/latex.md` | Geração de CV              |

## Saídas

| Artefato                              | Caminho                                      |
|---------------------------------------|----------------------------------------------|
| Relatório de avaliação                | `reports/{###}-{company}-{date}.md`          |
| PDF ou LaTeX                          | `output/cv-{candidate}-{company}-{date}.pdf` |
| Linha do tracker (TSV)                | `batch/tracker-additions/{num}-{slug}.tsv`   |
| Tracker consolidado                   | `data/applications.md` (após merge)          |
| Seção H (rascunho formulário)         | Dentro do relatório (score ≥ 4.5)            |

## Etapas (modes/auto-pipeline.md)

| Step | Ação                                                                 |
|------|----------------------------------------------------------------------|
| 0    | Extrair JD: Playwright → WebFetch → WebSearch → pedir paste manual  |
| 1    | Avaliação A–G (`oferta`): arquétipo, match CV, comp, STAR, legitimidade |
| 2    | Salvar `reports/*.md` com URL e Legitimacy no cabeçalho              |
| 3    | PDF/LaTeX conforme `profile.yml` → `cv.output_format`                |
| 4    | Se score ≥ 4.5: rascunho respostas formulário (seção H)            |
| 5    | TSV em `batch/tracker-additions/`; falhas parciais marcam pendência |

## Regras críticas

- **Verificação de vaga ativa:** Playwright obrigatório para URLs (não confiar só em WebSearch).
- **Integridade:** nunca adicionar linha direta em `applications.md`; usar TSV + `merge-tracker.mjs`.
- **Ética:** score &lt; 4.0 → recomendar fortemente não candidatar.
- **Humano no loop:** nunca enviar candidatura automaticamente.

## Diagramas

- [data-flow.mmd](data-flow.mmd)
- [sequence.mmd](sequence.mmd)
