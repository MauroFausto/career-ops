# Modo: batch — `/career-ops batch`

## Propósito

Avaliar múltiplas vagas em paralelo usando workers headless (`claude -p`, `gemini -p`, etc.), cada um com contexto limpo (~200K tokens).

## Modos de operação

| Modo        | Orquestrador        | Extração JD                          |
|-------------|---------------------|--------------------------------------|
| A Conductor | Agente + Chrome     | DOM em tempo real, sessões logadas   |
| B Standalone| `batch-runner.sh`   | URLs já em `batch-input.tsv`         |

## Atores

| Ator              | Papel                                              |
|-------------------|----------------------------------------------------|
| Conductor         | Agente IA navega portal, dispara workers           |
| Worker headless   | CLI `-p` com `batch-prompt.md` autocontido         |
| `batch-runner.sh` | Paralelismo, retries, estado, resume               |
| Node              | `merge-tracker.mjs` ao final                       |

## Entradas

| Arquivo                  | Conteúdo                                         |
|--------------------------|--------------------------------------------------|
| `batch/batch-input.tsv`  | id, url, source                                  |
| `batch/batch-state.tsv`  | progresso (auto-gerado)                          |
| `batch/batch-prompt.md`  | Prompt template para workers                     |
| `cv.md`, `profile.yml`   | Contexto embutido no prompt                      |

## Saídas (por worker)

| Artefato     | Destino                                            |
|--------------|----------------------------------------------------|
| Report       | `reports/{num}-{slug}-{date}.md`                   |
| PDF          | `output/cv-*.pdf` (se score ≥ threshold)           |
| Tracker line | `batch/tracker-additions/{num}.tsv`                |
| Log          | `batch/logs/{num}-{id}.log`                        |

## Opções `batch-runner.sh`

| Flag            | Efeito                                           |
|-----------------|--------------------------------------------------|
| `--dry-run`     | Lista pendentes sem executar                     |
| `--retry-failed`| Só jobs com status failed                        |
| `--parallel N`  | N workers simultâneos                            |
| `--start-from N`| Resume a partir de ID                            |

## Regras

- Workers em batch: WebFetch como fallback (sem Playwright); marcar `Verification: unconfirmed (batch mode)`.
- Após lote: **sempre** `node src/pipeline/merge-tracker.mjs`.
- Resumível via `batch-state.tsv`.

## Diagramas

- [data-flow.mmd](data-flow.mmd)
- [sequence.mmd](sequence.mmd)
