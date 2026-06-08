# Scan: WebSearch com LLM — Nível 3 (fluxo agente)

## Contexto

O **Nível 3** do modo `scan` é executado pelo **agente IA**, não por `scan.mjs`. Usa ferramentas WebSearch do CLI para descoberta transversal em job boards (`site:jobs.ashbyhq.com`, `site:boards.greenhouse.io`, etc.).

Custo: **tokens LLM** por query + latência de indexação (resultados podem estar desatualizados).

## Quando entra em jogo

| Situação                                      | Nível 3                         |
|-----------------------------------------------|---------------------------------|
| Empresa nova não em `tracked_companies`       | Principal fonte de descoberta   |
| Queries `search_queries` com `enabled: true`  | Sempre executadas               |
| Empresa em `local_parser_ok`                  | Query roda, **hits filtrados**  |
| Empresa só com careers_url sem API            | Nível 1 Playwright cobre antes |

## Entrada: search_queries (portals.yml)

```yaml
search_queries:
  - name: Ashby — AI PM
    query: 'site:jobs.ashbyhq.com "AI" "Product Manager"'
    enabled: true
```

## Pipeline Nível 3

| Step | Ação                                                         |
|------|--------------------------------------------------------------|
| 1    | Para cada query enabled → WebSearch                          |
| 2    | Extrair `{title, url, company}` do snippet (regex `@`, `at`) |
| 3    | Descartar se `company` ∈ `local_parser_ok`                   |
| 4    | Merge com candidatos Níveis 0–2 + dedup                      |
| 5    | **Liveness Playwright** (sequencial) só URLs novas Nível 3     |
| 6    | `skipped_expired` em scan-history se link morto                |
| 7    | URLs ativas → `pipeline.md` + `scan-history.tsv` `added`     |

## Por que liveness obrigatório no Nível 3

WebSearch retorna cache de buscadores (semanas/meses). Níveis 0–2 são tempo real; Nível 3 **não**.

Sinais de expirada:

- Redirect `?error=true` (Greenhouse)
- Texto "job no longer available", "position filled"
- Só navbar/footer, conteúdo JD &lt; ~300 chars

**Regra:** Playwright **nunca** em paralelo para liveness.

## Extração título/empresa

Padrões comuns nos snippets:

| Portal     | Exemplo snippet                         | Parse                    |
|------------|-----------------------------------------|--------------------------|
| Ashby      | `Senior AI PM (Remote) @ EverAI`        | title antes de `@`       |
| Greenhouse | `AI Engineer at Anthropic`              | split em ` at `          |
| Lever      | `Product Manager - AI @ Temporal`       | split em `@`             |

Regex genérico: `(.+?)(?:\s*[@|—–-]\s*|\s+at\s+)(.+?)$`

## Contraste com providers explícitos

| Aspecto        | scan.mjs (providers)     | WebSearch LLM (Nível 3)      |
|----------------|--------------------------|------------------------------|
| Custo tokens   | Zero                     | Por query                    |
| Frescor        | API/página direta        | Cache de buscador            |
| Cobertura      | `tracked_companies`      | Descoberta transversal       |
| Liveness       | Opcional `--verify`      | **Obrigatório** Playwright   |
| Quem executa   | Node                     | Agente IA                    |

## Diagramas

- [data-flow.mmd](data-flow.mmd)
- [sequence.mmd](sequence.mmd)
