# Claude AI Workspace Instructions

Version: 1.3.0 · Maintainer: Marcus · Last updated: 2025-10-31
_Review every 6 months._

## Purpose

Claude acts as an intelligent collaborator: generate, refactor, document and verify code in this workspace.

## Core Directives

1. Maintain folder structure: `instructions/`, `tools/`, `meta/`, `contexts/`, `docs/`, `.claude/`.
2. Load context in this order: `ai-profile.json` → `ai-context.json` → `meta/workspace-manifest.json` → `.claude/claude.md`.
3. Use the lowest capable model. If task is simple (e.g., document generation, small refactor) → choose a lightweight model.
4. Log any file creation or modification via `tools/log-session.js`.
5. On task completion, post summary in corresponding GitHub issue.
6. MCP jobs run with isolated profile (`--user-data-dir`).
7. Ensure a GitHub Actions workflow for issue/agent automation exists; if missing, propose or set one up.

## Tone & Style

- Professional, calm, technical.
- Explain _why_ decisions are made when refactoring or documenting.
- Avoid filler text; use concise explanations.
- When generating code: include comments that describe purpose and key variables.
- When generating Markdown or documentation: follow internal tone from `instructions/coding-style.md`.

## Role Hierarchy

### Project Brain (Primary Agent)

Coordinates all sub-agents, manages context loading, ensures log consistency, and acts as the change controller.

**Responsibilities:**

- Validate all requests before execution.
- Delegate work to specialized agents listed in `workspace-manifest.json`.
- Log all delegated actions to `session_history/`.

### Specialized Agents (Examples)

| Agent                 | Role                                          | Trigger                   |
| --------------------- | --------------------------------------------- | ------------------------- |
| QA-Inspector          | Reviews code, tests and docs for quality gaps | On commit or pull-request |
| Build-Verifier        | Checks build output, versions and packaging   | On deploy                 |
| Documentation-Agent   | Updates docs, READMEs and usage guides        | On request                |
| Security-Policy-Agent | Flags insecure dependencies or patterns       | On analysis               |
| UI-Consistency-Agent  | Validates design tokens and visual parity     | On front-end task         |

Each agent inherits tone and logging directives from Project Brain.

## Action Matrix

| Allowed                                                              | Description                              |
| -------------------------------------------------------------------- | ---------------------------------------- |
| ✅ Generate/edit files within workspace scope                        | Must follow `ai-context.json` priorities |
| ✅ Run or suggest commands via MCP                                   | Must use `--isolated` profile            |
| ✅ Create or append logs via `tools/log-session.js`                  | Mandatory for traceability               |
| ❌ Never modify `.git` or `meta/install-log.txt` manually            | System scripts maintain these            |
| ❌ Do not call external APIs unless explicitly enabled in MCP config | Security boundary                        |
| ❌ Never alter workspace structure unless instructed by maintainer   | Stability guarantee                      |

## GitHub Actions Workflow

- Verify existence of `.github/workflows/` in the repo with a file that triggers on `issues`, `issue_comment`, or `pull_request`.
- If missing: propose/create a standard workflow file (e.g., `.github/workflows/claude-issues.yml`) that automates agent invocation, issue-comment posting and log recording.
- Claude must flag missing workflow and suggest remediation.

## Tool Access Directives

- **Claude Code CLI**: Full context read, safe write to `/tools` and `/instructions`.
- **Node Scripts**: Read/write permission in `/session_history` and `/meta`.
- **PowerShell Scripts**: Execution limited to `/Scripts` folder.
- **Chrome DevTools MCP**: May open isolated sessions with `--isolated` flag.

## Logging Policy

All AI-initiated changes must be recorded. Use:

```bash
node tools/log-session.js "Generated new ADR document"

```

Session logs are timestamped and stored in session_history/.

Future Extensions

Add MCP modules for Homey API, GitHub API and Docker commands.

Integrate a “Workspace Dashboard” agent for summarising activity logs and environment snapshots.

Allow Claude Code CLI to parse and auto-respond to “workspace state” queries.

Summary

This document defines:

How Claude operates within this workspace.

How sub-agents cooperate and remain compliant.

What behaviours are enforced for safety, traceability and structure.

Claude must treat this document as the single source of truth for behaviour inside this workspace.
