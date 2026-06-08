# Modo: pipeline — `/career-ops pipeline`

## Propósito

Processar URLs pendentes em `data/pipeline.md` (inbox / second brain): para cada `- [ ]`, rodar auto-pipeline e mover para `Processed`.

Tipicamente alimentado pelo modo `scan`.

## Atores

| Ator              | Papel                                              |
|-------------------|----------------------------------------------------|
| Candidato         | Adiciona URLs manualmente ou via scan              |
| Agente IA         | Processa fila; paraleliza se 3+ pendentes          |
| Playwright        | Extração JD por URL                                |
| Node              | `cv-sync-check.mjs`, `merge-tracker.mjs`           |

## Entradas

| Fonte                         | Uso                                           |
|-------------------------------|-----------------------------------------------|
| `data/pipeline.md`            | Seções Pending / Processed                    |
| `config/profile.yml`          | `auto_pdf_score_threshold` (default 3.0)      |
| `cv.md`, modos oferta/pdf     | Mesmo contrato do auto-pipeline               |

## Saídas

| Artefato        | Efeito                                           |
|-----------------|--------------------------------------------------|
| `reports/*.md`  | Um por URL processada                            |
| `output/*.pdf`  | Se score ≥ `auto_pdf_score_threshold`            |
| `pipeline.md`   | `- [x] #NNN | url | company | role | score | PDF` |
| Tracker TSV     | Via `batch/tracker-additions/` + merge           |

## Formato pipeline.md

```markdown
## Pending
- [ ] https://jobs.example.com/123 | Acme | PM AI
- [!] https://private.url — Error: login required

## Processed
- [x] #143 | https://... | Acme | PM AI | 4.2/5 | PDF ✅
```

## Casos especiais

| Caso            | Tratamento                                       |
|-----------------|--------------------------------------------------|
| LinkedIn login  | Marcar `[!]`, pedir paste manual                 |
| URL é PDF       | Read tool direto                                 |
| `local:jds/...` | Ler arquivo em `jds/`                            |
| URL inacessível | `[!]` com nota, continuar próxima                |

## Gate de PDF configurável

- `auto_pdf_score_threshold` em `profile.yml` (default **3.0** neste modo).
- Score abaixo: relatório sim, PDF não — header indica `/career-ops pdf {slug}`.
- `0` = PDF para todas; `4.0` = só vagas fortes.

## Pré-check

```bash
node src/pipeline/cv-sync-check.mjs
```

## Diagramas

- [data-flow.mmd](data-flow.mmd)
- [sequence.mmd](sequence.mmd)
