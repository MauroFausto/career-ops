# Modo: contacto — `/career-ops contacto`

## Propósito

Gerar mensagem de outreach no LinkedIn (máx. 300 caracteres para connection request) com framework de 3 frases adaptado ao tipo de contato.

## Atores

| Ator              | Papel                                              |
|-------------------|----------------------------------------------------|
| Candidato         | Indica empresa/vaga ou contexto de entrevista      |
| Agente IA         | Pesquisa alvos e redige mensagens                  |
| WebSearch         | Encontrar hiring manager, recruiter, peers         |

## Entradas

| Fonte              | Uso                                              |
|--------------------|--------------------------------------------------|
| Contexto da vaga   | Empresa, role, JD (relatório existente ideal)    |
| `cv.md`            | Proof points para frase 2                        |
| WebSearch          | Nomes e cargos de contatos                       |

## Saídas

- Mensagem principal (EN ou ES) ≤ 300 chars.
- Alvos alternativos com justificativa.
- Versões por tipo de contato.

## Tipos de contato

| Tipo            | Frase 1        | Frase 2           | Frase 3 (CTA)                    |
|-----------------|----------------|-------------------|----------------------------------|
| Recruiter       | Fit direto     | Dados de triagem  | Oferecer CV                      |
| Hiring Manager  | Hook desafio   | Prova quantificada| Pergunta sobre desafio do time   |
| Peer            | Interesse genuíno | Conexão no espaço | Pedir opinião (não pedir vaga) |
| Interviewer     | Pesquisa prévia   | Contexto leve     | Antecipar conversa na data       |

## Regras de mensagem

- Sem corporate-speak, sem "I'm passionate about…"
- Nunca incluir telefone
- Peer: **não** pedir emprego diretamente

## Diagramas

- [data-flow.mmd](data-flow.mmd)
- [sequence.mmd](sequence.mmd)
