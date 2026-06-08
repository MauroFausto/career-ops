## 2026-06-04 - (sessão)
- Tutorial execução padrão e debug do Dashboard Go em `docs/DASHBOARD.md`.
- Desvio `--no-alt-screen` + detecção TracerPid para debug TUI sem alternate screen buffer.

--- Seção Opcional Dashboard ---
`useAltScreen()` desliga `tea.WithAltScreen()` com flag, env `CAREER_OPS_TUI_NO_ALT_SCREEN=1`, ou debugger ptrace (Linux). Perfil launch atualizado com `--no-alt-screen`, `console: integratedTerminal`, env.

--- TimeLine das mudanças no código/documentos ---
- `docs/DASHBOARD.md` — criado (tutorial completo)
- `dashboard/main.go` — `useAltScreen`, `--no-alt-screen`, `debuggerAttached()`
- `tool-set/.vscode/launch.json` — perfil Go Dashboard com no-alt-screen
