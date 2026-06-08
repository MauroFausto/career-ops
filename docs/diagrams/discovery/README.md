# Modo: discovery — `/career-ops` (sem argumentos)

## Propósito

Exibir o menu de comandos disponíveis quando o usuário invoca `/career-ops` sem subcomando nem texto de vaga.

## Atores

| Ator              | Papel                                              |
|-------------------|----------------------------------------------------|
| Candidato         | Invoca o slash command vazio                       |
| Agente IA         | Lê `SKILL.md`, detecta modo `discovery`          |
| SKILL.md          | Define roteamento e texto do menu                  |

## Entradas

- Comando: `/career-ops` (argumento `$mode` vazio).

## Saídas

- Texto formatado no chat (menu de comandos).
- **Nenhuma** escrita em disco.

## Fluxo resumido

1. Agente carrega `.claude/skills/career-ops/SKILL.md`.
2. `$mode` está vazio → modo `discovery`.
3. Renderiza o bloco "Discovery Mode" com todos os subcomandos, atalhos e dicas (`pipeline.md`, colar JD).

## Detecção vs. auto-pipeline

Se `$mode` **não** for subcomando conhecido **e** contiver sinais de JD (URL, "requirements", "responsibilities", etc.), o roteador escolhe `auto-pipeline` em vez de `discovery`.

## Artefatos tocados

Nenhum. Modo somente leitura de instruções do skill.

## Diagramas

- [data-flow.mmd](data-flow.mmd)
- [sequence.mmd](sequence.mmd)
