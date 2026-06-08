# Modo: pdf — `/career-ops pdf`

## Propósito

Gerar CV otimizado para ATS (PDF ou LaTeX) personalizado para uma vaga específica, sem rodar avaliação completa A–G — embora use o JD para injeção de keywords.

## Atores

| Ator              | Papel                                              |
|-------------------|----------------------------------------------------|
| Candidato         | Fornece JD (ou já está no contexto)                |
| Agente IA         | Personaliza conteúdo a partir de `cv.md`           |
| Playwright        | Extrai JD se URL                                   |
| Node              | `generate-pdf.mjs` (Playwright/Chromium)           |

## Entradas

| Fonte                         | Uso                                           |
|-------------------------------|-----------------------------------------------|
| `cv.md`                       | Fonte de verdade — nunca inventar skills      |
| `config/profile.yml`          | Nome, contato, `cv.output_format`             |
| JD (texto/URL)                | 15–20 keywords, idioma, arquétipo             |
| `templates/cv-template.html`  | Layout ATS single-column                      |
| `fonts/`                      | Space Grotesk + DM Sans                         |

## Saídas

| Artefato     | Caminho                                              |
|--------------|------------------------------------------------------|
| HTML temp    | `/tmp/cv-{candidate}-{company}.html`                 |
| PDF          | `output/cv-{candidate}-{company}-{YYYY-MM-DD}.pdf`   |

## Pipeline (14 passos resumidos)

1. Ler `cv.md`
2. Obter JD (perguntar se ausente)
3. Extrair keywords do JD
4. Detectar idioma → CV no idioma do JD
5. Formato papel: `letter` (US/CA) ou `a4` (resto)
6. Detectar arquétipo → framing
7. Reescrever Professional Summary com keywords
8. Top 3–4 projetos relevantes
9. Reordenar bullets por relevância
10. Grid de competências (6–8 frases)
11. Injeção ética de keywords em achievements reais
12. Montar HTML com placeholders `{{...}}`
13. Normalizar nome do candidato (kebab-case)
14. `node src/generators/generate-pdf.mjs`

## Regras ATS

- Layout single-column, headers padrão, texto selecionável UTF-8
- Sem info crítica em header/footer do PDF
- Keywords distribuídas: Summary, primeiro bullet por role, Skills

## Diagramas

- [data-flow.mmd](data-flow.mmd)
- [sequence.mmd](sequence.mmd)
