# Modo: deep — `/career-ops deep`

## Propósito

Gerar um **prompt estruturado de pesquisa aprofundada** sobre a empresa e a vaga — para usar em Perplexity, Claude, ChatGPT ou pesquisa manual — com 6 eixos de inteligência para entrevista.

Não executa a pesquisa automaticamente; produz o artefato de prompt personalizado.

## Atores

| Ator              | Papel                                              |
|-------------------|----------------------------------------------------|
| Candidato         | Indica empresa + role (ou usa report existente)    |
| Agente IA         | Monta prompt com contexto do perfil                |

## Entradas

| Fonte              | Uso                                              |
|--------------------|--------------------------------------------------|
| `cv.md`            | Experiência para eixo "Candidate angle"           |
| `config/profile.yml` | North Star, preferências                     |
| JD / report        | Contexto da vaga específica                      |

## Saídas

- Documento markdown no chat: `## Deep Research: [Company] — [Role]` com 6 seções.

## Os 6 eixos

| # | Eixo                  | Perguntas-chave                                  |
|---|-----------------------|--------------------------------------------------|
| 1 | AI Strategy           | Produtos AI, stack, blog eng, papers             |
| 2 | Recent moves (6 mo)   | Hires, M&A, launches, funding                    |
| 3 | Engineering culture   | Ship cadence, stack, remote, reviews             |
| 4 | Likely challenges     | Scale, cost, migrations, pain points             |
| 5 | Competitors           | Moat, posicionamento                             |
| 6 | Candidate angle       | Valor único, projetos relevantes, story entrevista |

## Diagramas

- [data-flow.mmd](data-flow.mmd)
- [sequence.mmd](sequence.mmd)
