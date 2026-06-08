# Modo: training — `/career-ops training`

## Propósito

Avaliar se um curso ou certificação vale o investimento de tempo/dinheiro em relação ao **North Star** do candidato (objetivo de carreira em AI production-grade).

## Atores

| Ator              | Papel                                              |
|-------------------|----------------------------------------------------|
| Candidato         | Descreve curso/cert (nome, URL, duração, custo)    |
| Agente IA         | Pontua 6 dimensões e emite veredicto                |

## Entradas

| Fonte              | Uso                                              |
|--------------------|--------------------------------------------------|
| Descrição do curso | Syllabus, provider, preço, duração               |
| `config/profile.yml` | North Star, roles alvo                       |
| `cv.md`            | Lacunas vs. credibilidade atual                  |

## Saídas

- Tabela 6 dimensões + veredicto + plano (se aplicável).

## 6 dimensões

| Dimensão              | O que avalia                                    |
|-----------------------|-------------------------------------------------|
| Alineação North Star  | Aproxima ou afasta do objetivo                  |
| Sinal recruiter       | O que HMs pensam ao ver no CV                   |
| Tempo e esforço       | Semanas × horas/semana                          |
| Custo de oportunidade | O que deixa de fazer no período                 |
| Riscos                | Conteúdo outdated, brand fraco, nível básico    |
| Entregável portfolio  | Produz artefato demonstrável?                    |

## Veredictos

| Veredicto           | Entrega                                         |
|---------------------|-------------------------------------------------|
| FAZER               | Plano 4–12 semanas com entregáveis semanais     |
| NÃO FAZER           | Alternativa melhor justificada                  |
| FAZER COM TIMEBOX   | Plano condensado, só essencial (máx X semanas)  |

## Prioridade temática (AI production-grade)

1. Evals e testing de LLMs
2. Observability e monitoring
3. Trade-offs cost/reliability
4. AI governance e safety
5. Enterprise AI architecture

## Diagramas

- [data-flow.mmd](data-flow.mmd)
- [sequence.mmd](sequence.mmd)
