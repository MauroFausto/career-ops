# Modo: project — `/career-ops project`

## Propósito

Avaliar uma ideia de projeto de portfólio contra roles alvo: matriz de 6 dimensões ponderadas, veredicto BUILD/SKIP/PIVOT e plano 80/20 de 2 semanas.

## Atores

| Ator              | Papel                                              |
|-------------------|----------------------------------------------------|
| Candidato         | Descreve ideia de projeto (URL opcional)           |
| Agente IA         | Pontua dimensões e define Interview Pack           |

## Entradas

| Fonte              | Uso                                              |
|--------------------|--------------------------------------------------|
| Ideia do projeto   | Escopo, stack, público-alvo                      |
| `config/profile.yml` | Roles alvo                                   |
| `cv.md`            | Gaps que o projeto poderia cobrir                |

## Saídas

- Matriz 6 dimensões (1–5) com pesos.
- Veredicto: **BUILD**, **SKIP**, ou **PIVOT TO [alternativa]**.
- Plano 80/20: semana 1 MVP, semana 2 polish + interview pack.

## Dimensões e pesos

| Dimensão            | Peso | 5 =                          | 1 =                |
|---------------------|------|------------------------------|--------------------|
| Signal for roles    | 25%  | Demonstra skill do JD        | Não relacionado    |
| Uniqueness          | 20%  | Ninguém fez isso               | Muito comum        |
| Demo ability        | 20%  | Demo live em 2 min             | Só código          |
| Metrics potential   | 15%  | Latency, cost, accuracy        | Sem métricas       |
| Time to MVP         | 10%  | 1 semana                       | 3+ meses           |
| STAR story potential| 10%  | História rica com trade-offs   | Só implementação   |

## Interview Pack (se BUILD)

1. One-pager: produto + arquitetura + métricas + eval plan
2. Demo: URL live ou walkthrough 2 min
3. Postmortem: o que funcionou, o que não, mitigações

## Diagramas

- [data-flow.mmd](data-flow.mmd)
- [sequence.mmd](sequence.mmd)
