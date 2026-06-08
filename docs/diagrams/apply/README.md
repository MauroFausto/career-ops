# Modo: apply — `/career-ops apply`

## Propósito

Assistente interativo para preencher formulários de candidatura: lê a página ativa, carrega contexto do relatório avaliado e gera respostas personalizadas para copy-paste.

**Nunca clica Submit** — humano no loop obrigatório.

## Atores

| Ator              | Papel                                              |
|-------------------|----------------------------------------------------|
| Candidato         | Navega formulário no browser                       |
| Agente IA         | Analisa perguntas e gera respostas                 |
| Playwright        | Snapshot da aba ativa (modo visível preferido)     |

## Entradas

| Fonte              | Uso                                              |
|--------------------|--------------------------------------------------|
| Página do form     | URL, título, campos visíveis                     |
| `reports/*.md`     | Match por empresa (grep case-insensitive)        |
| Seção G/H          | Rascunhos prévios de auto-pipeline                 |
| `cv.md`            | Proof points para perguntas novas                |

## Saídas

- Bloco formatado no chat: pergunta → resposta sugerida.
- Opcional: atualização de role no tracker se título mudou.

## Workflow (8 passos)

| Step | Ação                                                         |
|------|--------------------------------------------------------------|
| 1    | Detectar job (Playwright snapshot ou screenshot manual)      |
| 2    | Identificar empresa + role                                   |
| 3    | Buscar relatório em `reports/`                               |
| 4    | Carregar blocos B, F, seção G/H                              |
| 5    | Comparar role avaliado vs. tela — alertar se divergiu        |
| 6    | Listar todas perguntas visíveis (texto, dropdown, upload)    |
| 7    | Gerar resposta por pergunta (tom "I'm choosing you")         |
| 8    | Apresentar para copy-paste — **parar antes de Submit**       |

## Fallback sem Playwright

- Screenshot compartilhado (Read tool).
- Perguntas coladas manualmente.
- Empresa + role para localizar relatório.

## Diagramas

- [data-flow.mmd](data-flow.mmd)
- [sequence.mmd](sequence.mmd)
