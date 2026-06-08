# Scan: providers explícitos — `scan.mjs` zero-token

## Contexto

`src/scan/scan.mjs` é o caminho **sem custo de tokens LLM**: HTTP direto + execução local de parsers. Roda no início do workflow do agente (`npm run scan` ou `node src/scan/scan.mjs`).

Empresas **sem** `provider:` resolvível nem parser local são **ignoradas** pelo script — o agente deve cobri-las nos Níveis 1–3.

## Resolução de provider

Ordem em `resolveProvider()`:

| Prioridade | Condição                              | Provider            |
|------------|---------------------------------------|---------------------|
| 1          | Campo `provider:` em portals.yml     | ID explícito        |
| 2          | `parser.command` + `parser.script`  | `local-parser`      |
| 3          | `detect(entry)` de cada `*.mjs`     | Primeiro match (ordem alfabética) |

## Providers disponíveis (`src/scan/providers/`)

| ID                | Fonte típica                                      |
|-------------------|---------------------------------------------------|
| `local-parser`    | Script stdout JSON (`jobs-json-v1`)               |
| `greenhouse`      | `boards-api.greenhouse.io/v1/boards/{co}/jobs`    |
| `ashby`           | GraphQL `ApiJobBoardWithTeams`                    |
| `lever`           | `api.lever.co/v0/postings/{co}?mode=json`         |
| `workable`        | API pública Workable                              |
| `recruitee`       | API Recruitee                                     |
| `smartrecruiters` | API SmartRecruiters                               |

## Configuração explícita em portals.yml

```yaml
- name: Cohere
  careers_url: https://cohere.com/careers
  provider: greenhouse    # bypass detect()
  enabled: true
```

```yaml
- name: Example Co
  careers_url: https://example.com/careers
  scan_method: local_parser
  parser:
    command: node
    script: src/parsers/example-jobs.js
    args: ["{company}"]
  enabled: true
```

## Fallback local-parser → API

Se `local-parser.fetch()` falha, `scan.mjs` chama `resolveProvider()` novamente com `skipIds: ['local-parser']` e tenta API ATS detectada.

## Pós-processamento (dentro do script)

1. `title_filter` — positive/negative keywords
2. `location_filter` — allow/block/always_allow (opcional)
3. Dedup: `scan-history.tsv`, `applications.md`, `pipeline.md`
4. Opcional `--verify`: Playwright sequencial (liveness)
5. Escrita: `pipeline.md` + `scan-history.tsv`

## Flags CLI

| Flag           | Efeito                                           |
|----------------|--------------------------------------------------|
| (default)      | Escaneia todas empresas enabled                  |
| `--dry-run`    | Preview sem gravar                               |
| `--company X`  | Filtra por nome                                  |
| `--verify`     | Playwright liveness antes de adicionar ao pipeline |

## Diagramas

- [data-flow.mmd](data-flow.mmd)
- [sequence.mmd](sequence.mmd)
