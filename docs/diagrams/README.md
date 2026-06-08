# Diagramas de fluxo — career-ops

Documentação visual dos **12 modos de uso** descritos na seção *Uso* do README, mais **2 diagramas especializados** sobre o modo `scan` (providers explícitos vs. WebSearch com LLM).

Cada modo tem um diretório próprio com:

| Arquivo           | Conteúdo                                      |
|-------------------|-----------------------------------------------|
| `README.md`       | Descrição detalhada, atores, artefatos, regras |
| `data-flow.mmd`   | Diagrama de fluxo de dados (Mermaid flowchart)  |
| `sequence.mmd`    | Diagrama de sequência (Mermaid sequenceDiagram)|

## Índice por comando

| Comando slash              | Diretório                    | Modo interno      |
|----------------------------|------------------------------|-------------------|
| `/career-ops`              | [discovery/](discovery/)     | `discovery`       |
| `/career-ops {cole um JD}` | [auto-pipeline/](auto-pipeline/) | `auto-pipeline` |
| `/career-ops scan`         | [scan/](scan/)               | `scan`            |
| `/career-ops pdf`          | [pdf/](pdf/)                 | `pdf`             |
| `/career-ops batch`        | [batch/](batch/)             | `batch`           |
| `/career-ops tracker`      | [tracker/](tracker/)         | `tracker`         |
| `/career-ops apply`        | [apply/](apply/)             | `apply`           |
| `/career-ops pipeline`     | [pipeline/](pipeline/)       | `pipeline`        |
| `/career-ops contacto`     | [contacto/](contacto/)         | `contacto`        |
| `/career-ops deep`         | [deep/](deep/)               | `deep`            |
| `/career-ops training`     | [training/](training/)       | `training`        |
| `/career-ops project`      | [project/](project/)         | `project`         |

## Scan — variantes técnicas

| Tópico                                      | Diretório                                              |
|---------------------------------------------|--------------------------------------------------------|
| Providers explícitos + `scan.mjs` zero-token| [scan-providers-explicit/](scan-providers-explicit/)   |
| WebSearch + LLM (fluxo agente, Nível 3)     | [scan-websearch-llm/](scan-websearch-llm/)            |

O modo [scan/](scan/) documenta o **fluxo completo** (agente + script). Os dois diretórios acima detalham caminhos alternativos dentro do mesmo modo.

## Arquitetura comum

```
┌─────────────────────────────────────────────────────────────┐
│  CLI de código com IA (Claude Code, OpenCode, Gemini, …)    │
│  Skill: .claude/skills/career-ops/SKILL.md → roteador       │
└──────────────────────────┬──────────────────────────────────┘
                           │
         ┌─────────────────┼─────────────────┐
         ▼                 ▼                 ▼
   modes/*.md        src/*.mjs         User layer
   (instruções)      (automação)       cv.md, profile.yml,
                                       portals.yml, data/*
```

### Camadas de dados (DATA_CONTRACT)

| Camada   | Exemplos                                      | Quem escreve        |
|----------|-----------------------------------------------|---------------------|
| User     | `cv.md`, `config/profile.yml`, `portals.yml`  | Usuário / agente    |
| User     | `data/applications.md`, `reports/`, `output/` | Pipeline de saída   |
| System   | `modes/_shared.md`, `src/`, `templates/`      | Updates upstream    |

### Roteamento (SKILL.md)

1. `$mode` vazio → `discovery` (menu).
2. `$mode` = subcomando conhecido → modo correspondente.
3. `$mode` contém JD ou URL → `auto-pipeline`.
4. Modos `scan`, `apply`, `pipeline` (3+ URLs) → frequentemente delegados a subagente.

## Como visualizar

```bash
# Com extensão Mermaid no editor, ou:
npx -y @mermaid-js/mermaid-cli -i docs/diagrams/auto-pipeline/data-flow.mmd -o /tmp/auto-pipeline.png
```

Diagramas legados (visão geral do monorepo) permanecem em:

- `docs/diagrams/data-flow/career-ops-entrypoint-dataflow.mmd`
- `docs/diagrams/sequence/career-ops-sequencia.mmd`
- `docs/diagrams/dependencies/`

## Referências

- [ARCHITECTURE.md](../ARCHITECTURE.md)
- [modes/scan.md](../../modes/scan.md) — 4 níveis de descoberta
- [AGENTS.md](../../AGENTS.md) — contrato de dados e integridade do pipeline
