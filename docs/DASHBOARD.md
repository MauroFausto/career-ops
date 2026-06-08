# Dashboard Go — execução e debug

TUI em Go (Bubble Tea) para navegar o tracker `data/applications.md`, abrir relatórios, alterar status e ver métricas de progresso.

Código: `dashboard/` · entrypoint: `dashboard/main.go`

## Pré-requisitos

| Item | Detalhe |
|------|---------|
| **Go** | `go 1.24.2` no `dashboard/go.mod`; toolchain baixa automaticamente se o Go do sistema for mais antigo |
| **Dados** | `data/applications.md` (ou `applications.md` na raiz) — sem isso o dashboard encerra com erro |
| **Terminal** | TUI usa *alternate screen*; rode em terminal real (integrado ou externo), não em output estático de CI |

Verificação rápida:

```bash
go version
test -f /home/mauro/development/PROJECTS_OUTPLACEMENT/job-search-tooling/career-ops/data/applications.md && echo OK
```

## Execução padrão

### Opção A — npm (recomendado)

Na raiz de `career-ops`:

```bash
cd /home/mauro/development/PROJECTS_OUTPLACEMENT/job-search-tooling/career-ops

npm run dashboard:build   # compila binário (necessário na 1ª vez ou após mudanças Go)
npm run dashboard         # build lazy + execução com --path ..
```

O script `dashboard` em `package.json` compila `career-dashboard` se ainda não existir e passa `--path ..` (raiz do career-ops).

### Opção B — Go direto

```bash
cd /home/mauro/development/PROJECTS_OUTPLACEMENT/job-search-tooling/career-ops/dashboard

go build -o career-dashboard .
./career-dashboard --path ..
```

### Opção C — outro diretório de dados

Flag `--path` aponta para a **raiz** do career-ops (onde ficam `data/`, `reports/`, etc.):

```bash
./career-dashboard --path /caminho/para/career-ops
```

### Task no Cursor (workspace `tool-set`)

Com a pasta `tool-set` aberta como workspace:

1. **Terminal → Run Task…**
2. `career-ops: dashboard:build`

Depois rode `npm run dashboard` no terminal ou execute o binário manualmente.

## Debug no Cursor / VS Code

Os perfis de launch ficam em **`tool-set/.vscode/launch.json`**, não dentro de `career-ops`. O workspace root deve ser **`/home/mauro/development/tool-set`**.

### Setup único

1. Instalar extensão **Go** (`golang.go`)
2. Abrir workspace **`tool-set`** (File → Open Folder)
3. Garantir `dlv` (Delve): a extensão Go instala sob demanda, ou `go install github.com/go-delve/delve/cmd/dlv@latest`

### Iniciar debug do dashboard

1. Abrir um arquivo Go do dashboard (ex.: `dashboard/main.go` no monorepo)
2. Colocar breakpoint (ex.: linha do `ParseApplications` em `main.go`)
3. **Run and Debug** (Ctrl+Shift+D) → perfil **`career-ops: Go Dashboard TUI`**
4. F5

Configuração equivalente (já no `launch.json`):

| Campo | Valor |
|-------|-------|
| `program` | `…/career-ops/dashboard` |
| `args` | `--path` → raiz `career-ops` |
| `cwd` | `…/career-ops/dashboard` |

### Breakpoints úteis

| Arquivo | Momento |
|---------|---------|
| `dashboard/main.go` | Bootstrap, carga inicial do tracker |
| `dashboard/internal/data/career.go` | Parse de `applications.md`, enrich de URLs |
| `dashboard/internal/ui/screens/pipeline.go` | Input TUI, filtros, update de status |
| `dashboard/internal/ui/screens/viewer.go` | Visualizador de relatório markdown |

### Debug dos testes Go

Perfil **`career-ops: Go Dashboard (test package)`** — roda `go test` com Delve em `dashboard/...`.

Terminal:

```bash
cd /home/mauro/development/PROJECTS_OUTPLACEMENT/job-search-tooling/career-ops/dashboard
dlv test ./... -- -test.v
```

### Debug via CLI (sem IDE)

```bash
cd /home/mauro/development/PROJECTS_OUTPLACEMENT/job-search-tooling/career-ops/dashboard
dlv debug . -- --path ..
```

Comandos Delve comuns: `break main.main`, `continue`, `next`, `print apps`.

## Atalhos na TUI (pipeline)

Barra de ajuda na parte inferior da tela. Resumo:

| Tecla | Ação |
|-------|------|
| `↑` `↓` / `j` `k` | Navegar lista |
| `←` `→` / `h` `l` | Trocar aba de filtro (ALL, EVALUATED, APPLIED, …) |
| `/` | Busca (filtro ao digitar; Enter confirma; Esc cancela) |
| `s` | Ciclar ordenação: score → date → company → status |
| `r` | Recarregar dados do disco |
| `Enter` | Abrir relatório da linha selecionada |
| `o` | Abrir URL da vaga no browser (`xdg-open` no Linux) |
| `c` | Alterar status da candidatura |
| `v` | Alternar vista agrupada / flat |
| `p` | Tela de progresso / analytics |
| `g` / `G` | Ir ao topo / fim da lista |
| `PgUp`/`PgDn`, `Ctrl+U`/`Ctrl+D` | Meia página |
| `q` | Sair (Esc **não** encerra — só limpa busca) |

No visualizador de relatório: `q` ou Esc fecha; scroll com setas / PgUp/PgDn.

## O que o dashboard lê e escreve

```
career-ops/
├── data/applications.md    ← leitura principal (tracker)
└── reports/*.md            ← leitura (preview + viewer)
```

**Escrita:** alteração de status via `c` persiste em `applications.md` (função `UpdateApplicationStatus`).

Não executa scripts Node; eval/PDF/merge continuam no pipeline do agente ou CLI.

## Problemas comuns

| Sintoma | Causa provável | Ação |
|---------|----------------|------|
| `could not find applications.md` | Tracker ausente ou `--path` errado | Criar `data/applications.md` ou corrigir `--path` |
| `go: command not found` | Go não instalado | [go.dev/dl](https://go.dev/dl/) ou `sudo apt install golang-go` |
| Build pede Go 1.24 | Toolchain | Deixar `go build` baixar (` GOTOOLCHAIN=auto` é default) |
| TUI quebrada no debug | Console sem suporte a alt screen | Usar **integratedTerminal**; evitar Debug Console para TUI |
| Perfil Go não aparece | Workspace errado | Abrir **`tool-set`**, não só a pasta `career-ops` |
| Lista vazia após eval | Tracker não mergeado | `npm run merge` e depois `r` no dashboard |

## Referências

- [DEBUG.md](DEBUG.md) — todos os perfis launch (Go + Node)
- [LOCAL-SETUP.md](LOCAL-SETUP.md) — stack local (dashboard + tex-docctor)
- [ARCHITECTURE.md](ARCHITECTURE.md) — papel do dashboard no sistema
- Diagrama de fluxo: [diagrams/data-flow/career-ops-entrypoint-dataflow.mmd](diagrams/data-flow/career-ops-entrypoint-dataflow.mmd)
