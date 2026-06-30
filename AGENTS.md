# AGENTS.md

## Global Working Conventions

- If a task requires installing a database, middleware, queue, cache, search engine, or another service, prefer Docker / Docker Compose with official or trusted images. Install directly on the host only if the user explicitly requests it, or if the service must run on the host and the user confirms.

## Local Verification

- The local development service is already running.
- When validation requires opening or calling the storefront, use `http://localhost:3000`.
- Do not start another local development service unless the user explicitly asks for it.

## Implementation Rules

- Do not add fallback behavior, compatibility branches, silent defaults, or error-swallowing logic just to keep a feature running.
- If implementation or validation exposes a problem, surface the problem directly and explain what needs to be fixed. Hidden fallback behavior makes issues harder to test and should be avoided unless the user explicitly requests it.
