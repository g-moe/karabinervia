# Contributing

KarabinerVIA is a work-in-progress VIA frontend fork for planning MacBook keyboard layers and exporting Karabiner-Elements configuration.

## Runtime

Use the exact Node version pinned in `.node-version` and `.nvmrc`.

```bash
nvm install
nvm use
corepack enable
corepack prepare pnpm@11.5.3 --activate
pnpm install
```

The repo uses `engine-strict=true`, so installs fail when Node does not satisfy `package.json#engines`.

## Checks

Run the full local verification gate before opening a pull request:

```bash
pnpm verify
```

For narrower loops:

```bash
pnpm format
pnpm lint
pnpm typecheck
pnpm test:unit
pnpm test:e2e
pnpm build
pnpm pack:dry-run
```

Formatting uses Oxfmt. Static analysis uses Oxlint. TypeScript is strict for the app, Node config files, and tests.

## Tests

All tests live under `__tests__`.

- Unit tests mirror source paths under `__tests__`.
- End-to-end tests live under `__tests__/__e2e__`.
- Production app typechecking does not include tests; `tsconfig.test.json` typechecks tests explicitly.

## GitHub OAuth

GitHub save/load flows require `VITE_GITHUB_CLIENT_ID` at build time and a deployment endpoint at `POST /api/GithubOAuth`. Copy `.env.example` when enabling that path locally or in a deployment.
