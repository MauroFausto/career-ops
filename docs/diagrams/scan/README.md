# Modo: scan — `/career-ops scan`

## Propósito

Descobrir vagas novas em portais configurados, filtrar por título/localização, deduplicar e enfileirar em `data/pipeline.md` para avaliação posterior.

## Dois caminhos de execução

| Caminho              | Custo LLM | Quando usar                                      |
|----------------------|-----------|--------------------------------------------------|
| `scan.mjs` (Node)    | Zero      | Empresas com `provider:` ou API/parser local     |
| Agente (4 níveis)    | Tokens    | Complemento: Playwright, WebSearch, empresas sem provider |

Ver também:

- [scan-providers-explicit/](../scan-providers-explicit/) — detalhe do script zero-token
- [scan-websearch-llm/](../scan-websearch-llm/) — Nível 3 WebSearch + verificação Playwright

## Atores

| Ator              | Papel                                              |
|-------------------|----------------------------------------------------|
| Agente IA         | Orquestra workflow em `modes/scan.md`             |
| `scan.mjs`        | HTTP + parsers locais + APIs ATS                  |
| Playwright        | Nível 1 (careers_url) e liveness Nível 3          |
| WebSearch         | Nível 3 — descoberta transversal                  |

## Entradas

| Fonte                    | Uso                                                |
|--------------------------|----------------------------------------------------|
| `portals.yml`            | `tracked_companies`, `search_queries`, filtros     |
| `data/scan-history.tsv`  | URLs já vistas                                     |
| `data/applications.md`   | Dedup empresa+rol                                  |
| `data/pipeline.md`       | Dedup URLs pendentes                               |

## Saídas

| Artefato                 | Conteúdo                                           |
|--------------------------|----------------------------------------------------|
| `data/pipeline.md`       | Novas linhas em `## Pending`                       |
| `data/scan-history.tsv`  | Todas URLs: `added`, `skipped_*`                   |
| `jds/*.md`               | JDs de URLs privadas (`local:jds/...`)             |

## Estratégia em 4 níveis (agente)

| Nível | Método           | Custo      | Cobertura                          |
|-------|------------------|------------|------------------------------------|
| 0     | Local parser     | Zero       | `parser.command` + script em YAML  |
| 1     | Playwright       | Alto       | `careers_url` (SPAs, tempo real)   |
| 2     | API ATS          | Baixo      | Greenhouse, Ashby, Lever, …        |
| 3     | WebSearch        | Médio      | Queries `site:` transversais       |

**Regra `local_parser_ok`:** empresa com parser bem-sucedido no Nível 0 **não** repete em Níveis 1–2; no Nível 3 só filtra hits dessa empresa.

## Filtros e dedup

1. `title_filter` — keywords positive/negative/seniority_boost
2. `location_filter` — allow/block/always_allow (opcional)
3. Dedup: `scan-history.tsv`, `applications.md`, `pipeline.md`
4. Liveness (só Nível 3): Playwright sequencial → `skipped_expired`

## Providers em `src/scan/providers/`

| Provider          | Detecção / `provider:`                             |
|-------------------|----------------------------------------------------|
| `local-parser`    | `parser.command` + `parser.script`                 |
| `greenhouse`      | `boards-api.greenhouse.io`                         |
| `ashby`           | GraphQL `ApiJobBoardWithTeams`                       |
| `lever`           | `api.lever.co`                                     |
| `workable`        | API Workable                                       |
| `recruitee`       | API Recruitee                                      |
| `smartrecruiters` | API SmartRecruiters                                |

## Diagramas

- [data-flow.mmd](data-flow.mmd)
- [sequence.mmd](sequence.mmd)
