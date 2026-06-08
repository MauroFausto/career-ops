## 2026-06-07 - sessão
- Tradução de strings ES → PT-BR conforme `docs/mapa-strings-espanhol-fonte.md`;
- Aliases de status PT-BR adicionados em 7 arquivos + `templates/states.yml`;
- `scan.mjs`: marcadores de pipeline PT-BR com fallback ES/EN;
- `liveness-core.mjs`: detecção de botão Apply em PT-BR;
- `gemini-eval.mjs`: status de exemplo corrigido para canônico `Evaluated`;
- Testes: 167 passed, 0 failed.

--- Seção Aliases PT-BR adicionados ---
| ES (legado) | PT-BR |
| evaluada | avaliada |
| evaluar | avaliar |
| rechazado/rechazada | rejeitado/rejeitada |
| cerrada | fechada |
| no aplicar | não candidatar / nao_candidatar |
| aplicado | candidatado (adicional) |
| Pendientes/Procesadas | Pendentes/Processadas |

Aliases ES mantidos para retrocompatibilidade com dados históricos.

--- TimeLine das mudanças no código/documentos ---
- `templates/states.yml` — aliases PT-BR
- `dashboard/internal/data/career.go` — NormalizeStatus()
- `src/pipeline/{merge-tracker,normalize-statuses,dedup-tracker,verify-pipeline}.mjs`
- `src/analysis/{analyze-patterns,followup-cadence}.mjs`
- `src/scan/scan.mjs`, `src/liveness/liveness-core.mjs`
- `src/tests/gemini-eval.mjs`

Fora do escopo (conforme mapa): renomear `modes/oferta.md` etc.; conteúdo de `modes/*.md` e `data/*`.
