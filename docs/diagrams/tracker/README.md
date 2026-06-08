# Modo: tracker — `/career-ops tracker`

## Propósito

Visualizar o status de todas as candidaturas em `data/applications.md` e, sob pedido, atualizar estados de entradas existentes.

## Atores

| Ator              | Papel                                              |
|-------------------|----------------------------------------------------|
| Candidato         | Consulta pipeline ou pede mudança de status        |
| Agente IA         | Lê/parseia tabela markdown                         |

## Entradas

| Fonte                    | Conteúdo                                         |
|--------------------------|--------------------------------------------------|
| `data/applications.md`   | Tabela canônica de candidaturas                  |
| `templates/states.yml`   | Estados válidos (Evaluated, Applied, …)          |

## Saídas

- Resumo no chat: totais por estado, score médio, % com PDF/report.
- Edição inline de **linhas existentes** (status, notas) — **não** adiciona novas entradas.

## Colunas do tracker

```
| # | Date | Company | Role | Score | Status | PDF | Report | Notes |
```

## Estados canônicos

| Status      | Significado                                      |
|-------------|--------------------------------------------------|
| Evaluated   | Relatório pronto, decisão pendente               |
| Applied     | Candidatura enviada                              |
| Responded   | Empresa respondeu (inbound)                      |
| Interview   | Em processo seletivo                             |
| Offer       | Oferta recebida                                  |
| Rejected    | Rejeitado pela empresa                           |
| Discarded   | Descartado pelo candidato ou vaga fechada        |
| SKIP        | Não se candidatar                                |

## Regras

- **Adicionar** entradas: apenas via TSV + `merge-tracker.mjs` (outros modos).
- **Atualizar** status/notas de linha existente: permitido neste modo.
- Sem markdown bold no campo Status; sem datas no Status.

## Diagramas

- [data-flow.mmd](data-flow.mmd)
- [sequence.mmd](sequence.mmd)
