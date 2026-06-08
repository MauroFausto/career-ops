# Mapa de strings em espanhol — fontes Go e JavaScript

Documento de referência para internacionalização e remoção de legado espanhol no código-fonte de **career-ops**.

**Gerado em:** 2026-06-07  
**Escopo:** arquivos `.go`, `.js`, `.mjs`, `.cjs` em `job-search-tooling/career-ops/`  
**Fora do escopo:** conteúdo de `modes/*.md`, `data/*`, READMEs traduzidos, templates HTML/LaTeX

---

## Resumo

| Categoria                         | Arquivos | Strings distintas | Prioridade de mudança |
|-----------------------------------|----------|-------------------|-----------------------|
| Aliases de status (pipeline)      | 7        | ~25 tokens        | Alta — duplicados     |
| Marcadores de seção (`pipeline`)  | 1        | 2                 | Média — acoplamento a `data/pipeline.md` |
| Parsing de relatórios             | 1        | 1 (`Remoto`)      | Baixa — tolerância i18n |
| Liveness (botões Apply)           | 1        | 1 (`solicitar`)   | Baixa — detecção multi-idioma |
| Nomes de modo (paths)             | 3        | 3 arquivos        | Alta — breaking change de CLI |
| Saída CLI / testes                | 2        | 3                 | Média                 |
| Comentários e documentação inline | 5        | vários            | Baixa                 |

**Fonte de verdade canônica:** `templates/states.yml` (inglês). O espanhol permanece no código principalmente por **retrocompatibilidade** com trackers e relatórios históricos do autor original.

---

## 1. Aliases de status — núcleo duplicado

Estes tokens espanhol mapeiam estados do tracker para equivalentes em inglês. Aparecem em **7 arquivos** com pequenas variações.

### Tabela de tokens

| Token (ES)      | Canônico (EN) | Onde aparece                                      |
|-----------------|---------------|---------------------------------------------------|
| `evaluada`      | evaluated     | todos os mappers                                  |
| `evaluar`       | evaluated     | todos os mappers                                  |
| `verificar`     | evaluated     | todos os mappers                                  |
| `condicional`   | evaluated     | todos (também EN/ambig.)                          |
| `monitor`       | skip          | todos (também EN/ambig.)                          |
| `aplicado`      | applied       | todos                                             |
| `enviada`       | applied       | todos                                             |
| `aplicada`      | applied       | todos                                             |
| `respondido`    | responded     | todos                                             |
| `entrevista`    | interview     | todos                                             |
| `oferta`        | offer         | todos                                             |
| `rechazado`     | rejected      | todos                                             |
| `rechazada`     | rejected      | todos                                             |
| `descartado`    | discarded     | todos                                             |
| `descartada`    | discarded     | todos                                             |
| `cerrada`       | discarded     | todos                                             |
| `cancelada`     | discarded     | todos                                             |
| `no aplicar`    | skip          | todos                                             |
| `no_aplicar`    | skip          | todos                                             |
| `duplicado`     | discarded     | merge, normalize                                  |
| `geo blocker`   | skip          | todos (inglês, mas par histórico ES)              |

### Arquivos e localização

| Arquivo                                              | Símbolo / função              | Linhas (aprox.) |
|------------------------------------------------------|-------------------------------|-----------------|
| `dashboard/internal/data/career.go`                  | `NormalizeStatus()`           | 477–503         |
| `src/analysis/analyze-patterns.mjs`                  | `ALIASES` + `normalizeStatus` | 54–66           |
| `src/analysis/followup-cadence.mjs`                  | `ALIASES` + `normalizeStatus` | 43–55           |
| `src/pipeline/verify-pipeline.mjs`                   | `ALIASES`                     | 39–48           |
| `src/pipeline/merge-tracker.mjs`                     | `aliases` em `normalizeStatus`| 48–64, 219–220  |
| `src/pipeline/normalize-statuses.mjs`                | `normalizeStatus()`           | 28–85           |
| `src/pipeline/dedup-tracker.mjs`                     | `STATUS_RANK`                 | 37–48           |

### Regex compartilhada (detecção de coluna status em TSV)

`merge-tracker.mjs` linhas 219–220:

```javascript
/^(evaluated|applied|...|evaluada|aplicado|respondido|entrevista|oferta|rechazado|descartado|no aplicar|cerrada|duplicado|...)/i
```

**Ação futura sugerida:** extrair um módulo único (`src/lib/status-aliases.mjs`) e espelhar em Go (`internal/data/status.go`) ou gerar ambos a partir de `templates/states.yml`.

---

## 2. Go — dashboard

### `dashboard/internal/data/career.go`

| Linha | Tipo        | String / padrão ES                          | Propósito                          |
|-------|-------------|---------------------------------------------|------------------------------------|
| 477   | comentário  | `"aplicado 2026-03-12"`                     | exemplo de strip de data           |
| 483   | comentário  | `accepts both English and Spanish`          | documentação                       |
| 484   | literal     | `"no aplicar"`, `"no_aplicar"`              | alias → `skip`                     |
| 486   | literal     | `"entrevista"`                              | alias → `interview`                |
| 488   | literal     | `"oferta"`                                  | alias → `offer`                    |
| 490   | literal     | `"respondido"`                              | alias → `responded`                |
| 492   | literal     | `"aplicado"`, `"enviada"`, `"aplicada"`     | alias → `applied`                  |
| 494   | literal     | `"rechazado"`, `"rechazada"`                | alias → `rejected`                 |
| 496–497 | literal   | `"descartado"`, `"descartada"`, `"cerrada"`, `"cancelada"`, `"duplicado"` | alias → `discarded` |
| 499   | literal     | `"evaluada"`, `"condicional"`, `"evaluar"`, `"verificar"` | alias → `evaluated` |

**Demais arquivos `.go`:** UI do dashboard (`pipeline.go`, `progress.go`, `viewer.go`, `main.go`) usa **inglês** nas strings visíveis ao usuário.

---

## 3. JavaScript — pipeline

### `src/pipeline/normalize-statuses.mjs`

| Linha | Tipo       | String ES                                              |
|-------|------------|--------------------------------------------------------|
| 6     | docblock   | lista: `Evaluada, Aplicado, Respondido, Entrevista, Oferta, Rechazado, Descartado, NO APLICAR` |
| 9     | docblock   | `DUPLICADO`                                            |
| 33–34 | regex      | `/^duplicado/i`                                        |
| 38–42 | regex/lit. | `cerrada`, `cancelada`, `descartada`, `descartado`     |
| 44–46 | regex/lit. | `rechazada`, `rechazado`                               |
| 48–49 | regex      | `/^aplicado\s+\d{4}/i`                                 |
| 52    | regex      | `evaluar`, `verificar`, `condicional`                  |
| 75–82 | arrays     | aliases ES → canônicos EN                              |
| 104   | comentário | colunas: `fecha`, `empresa`, `rol`, `notas`            |
| 125   | comentário | `DUPLICADO info to notes`                              |

### `src/pipeline/merge-tracker.mjs`

| Linha | Tipo     | String ES                                                |
|-------|----------|----------------------------------------------------------|
| 49    | comentário | `Spanish → English`                                    |
| 50–57 | objeto   | mapa completo de aliases                                 |
| 63–64 | comentário/regex | `DUPLICADO`, `/^(duplicado\|dup\|repost)/i`     |
| 219–220 | regex  | tokens ES na detecção de coluna status                   |
| 271   | literal  | `'Empresa'` — pula linha de cabeçalho PT/ES da tabela   |

### `src/pipeline/verify-pipeline.mjs`

| Linha | Tipo    | String ES                          |
|-------|---------|------------------------------------|
| 39–47 | objeto  | `ALIASES` (mesmo conjunto)         |
| 153   | literal | `'Empresa'` — skip header row      |

### `src/pipeline/dedup-tracker.mjs`

| Linha | Tipo       | String ES                                      |
|-------|------------|------------------------------------------------|
| 26    | comentário | `Aplicado > Rechazado because...`              |
| 37    | comentário | `Spanish aliases — kept for backwards compat`  |
| 38–48 | objeto     | chaves ES em `STATUS_RANK`                     |

---

## 4. JavaScript — análise

### `src/analysis/analyze-patterns.mjs`

| Linha | Tipo   | String ES                          |
|-------|--------|------------------------------------|
| 54–65 | objeto | `ALIASES`                          |
| 229   | regex  | `(?:Remote\|Remoto\|Location)` — parse de campo remoto em relatórios |

### `src/analysis/followup-cadence.mjs`

| Linha | Tipo   | String ES    |
|-------|--------|--------------|
| 43–54 | objeto | `ALIASES`    |

---

## 5. JavaScript — scan e liveness

### `src/scan/scan.mjs`

| Linha | Tipo    | String ES              | Propósito                                      |
|-------|---------|------------------------|------------------------------------------------|
| 232–233 | literal | `'## Pendientes'`    | marcador de seção em `data/pipeline.md`        |
| 236–237 | literal | `'## Procesadas'`    | marcador alternativo ao inserir ofertas novas   |

**Nota:** estes headers devem coincidir com o conteúdo de `data/pipeline.md` do usuário. Migrar exige migração de dados + script.

### `src/liveness/liveness-core.mjs`

| Linha | Tipo  | String ES     | Propósito                                |
|-------|-------|---------------|------------------------------------------|
| 30    | regex | `/\bsolicitar\b/i` | botão “Apply” em páginas ES (intencional) |

---

## 6. Nomes de modo em espanhol (paths, não UI)

Identificadores de arquivo herdados do sistema original. Referenciados como **paths literais**, não como texto exibido.

| Arquivo                         | Strings / paths                          |
|---------------------------------|------------------------------------------|
| `src/system/update-system.mjs`  | `'modes/oferta.md'`, `'modes/contacto.md'`, `'modes/ofertas.md'` |
| `src/tests/test-all.mjs`        | `'oferta.md'`, `'contacto.md'`, `'ofertas.md'` (validação de arquivos) |
| `src/tests/gemini-eval.mjs`     | `modes/oferta.md`, variável `oferta`, label `oferta.md` |

**Impacto de renomear:** quebra comandos `/career-ops oferta`, skills, update-system paths e testes CI.

---

## 7. Saída CLI e testes com espanhol

| Arquivo                    | Linha | String ES / referência                              | Contexto                    |
|----------------------------|-------|-----------------------------------------------------|-----------------------------|
| `src/tests/gemini-eval.mjs`| 337   | `Evaluada`                                          | exemplo de linha de tracker na saída |
| `src/tests/test-all.mjs`   | 330–331 | `no repetir scraping caro`, `nombre no listado en \`local_parser_ok\`` | asserts sobre **conteúdo** de `modes/scan.md` (espanhol no modo, não no `.mjs`) |

---

## 8. Comentários em espanhol (sem efeito runtime)

| Arquivo                              | Exemplos                                              |
|--------------------------------------|-------------------------------------------------------|
| `dashboard/internal/data/career.go`  | `"aplicado 2026-03-12"`, `English and Spanish`        |
| `src/pipeline/dedup-tracker.mjs`     | `Aplicado > Rechazado`, `Spanish aliases`             |
| `src/pipeline/merge-tracker.mjs`     | `Spanish → English`, `DUPLICADO`                      |
| `src/pipeline/normalize-statuses.mjs`| docblock com lista de estados ES, `fecha/empresa/rol/notas` |
| `src/scan/scan.mjs`                  | comentários `Pendientes`, `Procesadas`                |

---

## 9. Matriz de dependências (o que mudar junto)

```
templates/states.yml
        │
        ├── career.go NormalizeStatus()
        ├── verify-pipeline.mjs ALIASES
        ├── merge-tracker.mjs aliases + regex coluna
        ├── normalize-statuses.mjs normalizeStatus()
        ├── dedup-tracker.mjs STATUS_RANK
        ├── analyze-patterns.mjs ALIASES
        └── followup-cadence.mjs ALIASES

data/pipeline.md (user layer)
        └── scan.mjs → "## Pendientes" / "## Procesadas"

modes/oferta.md, contacto.md, ofertas.md
        ├── update-system.mjs SYSTEM_PATHS
        ├── test-all.mjs
        └── gemini-eval.mjs
```

---

## 10. Checklist para refatoração futura

- [ ] Decidir se aliases ES permanecem indefinidamente (dados legados) ou entram em fase de depreciação
- [ ] Centralizar mapa de aliases em um único módulo JS + testes de paridade Go
- [ ] Migrar `data/pipeline.md` headers `Pendientes`/`Procesadas` → `Pending`/`Processed` (+ script de migração)
- [ ] Renomear modes `oferta`/`ofertas`/`contacto` → inglês com redirects ou aliases de CLI
- [ ] Corrigir `gemini-eval.mjs` linha 337: `Evaluada` → `Evaluated`
- [ ] Manter `solicitar` em liveness-core (detecção multi-idioma) salvo política contrária
- [ ] Traduzir comentários inline para inglês ou português conforme padrão do fork

---

## 11. Arquivos verificados sem strings ES relevantes

Go: `main.go`, `pipeline.go`, `progress.go`, `viewer.go`, `theme/*`, `model/*`, `*_test.go` (exceto comentário de exemplo em `career.go`).

JS: `src/generators/*`, `src/scan/providers/*`, `src/liveness/check-liveness.mjs`, `src/liveness/liveness-browser.mjs`, `src/system/doctor.mjs`, `src/pipeline/cv-sync-check.mjs`, `src/lib/root.mjs`, `src/tests/test-latex-adapter.mjs`.

**Outros workspaces:** `tool-set/` e `Build-In-Public/` — nenhum `.go`/`.js` com strings ES encontrado.
