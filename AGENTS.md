# AGENTS.md

Guidance for AI agents working in this repository.

## Repository status

**Cursed_Trades** is currently a skeleton repository: the only tracked file is `README.md` (title only). There is no application source, package manifest, Docker setup, CI config, or tests yet. End-to-end dev workflows (lint, test, build, run) cannot be executed until a stack and project layout are added.

## Cursor Cloud specific instructions

### Services

| Service | Status | Notes |
|---------|--------|--------|
| Application / API / frontend | Not present | Add manifests and run scripts when the stack is chosen |
| Database / cache / message queue | Not present | Document in this table when added |

### Dependency refresh (VM startup)

The VM `update_script` is intentionally a no-op until this repo defines dependencies (e.g. `package.json`, `requirements.txt`). After adding a stack, update the script via `SetupVmEnvironment` to run the appropriate install command (`npm install`, `pnpm install`, `pip install -r requirements.txt`, etc.).

### Lint / test / build / run

No project commands exist yet. When code is added, document the canonical commands here (or link to `README.md` / `package.json` scripts) so future agents do not guess.

### VM tooling (available now)

These tools are present on Cursor Cloud VMs and ready for future setup:

- **Node.js** v22.x (via nvm; `npm`, `pnpm`, `yarn` available)
- **Python** 3.12 (`python3`, `pip`)
- **Git** 2.43

### Git

- Default branch: `main`
- Remote: `origin` → `github.com/ActOfRod/Cursed_Trades`
