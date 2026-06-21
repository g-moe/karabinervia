# WIP - KarabinerVIA

KarabinerVIA is a work-in-progress fork of the VIA frontend. The goal is to keep the strong visual keyboard-planning workflow from VIA while replacing the QMK/device backend with a Mac and Karabiner-focused model.

This fork is currently scoped to Apple laptop keyboards. It is intended to help plan QWERTY macOS layouts with layers, tap actions, hold actions, and Karabiner export support.

## Current Scope

- Visual planning for a MacBook Pro keyboard with Touch ID.
- Karabiner-oriented key/action modeling instead of live QMK device configuration.
- Editing for macOS keys except the function row, Touch ID, and the globe key.
- A single local workspace rather than hardware connection management.

## Development

This project targets Node 24 LTS. Use the exact version in `.node-version`
or `.nvmrc`.

This project uses pnpm through Corepack. Dependency installs are gated by a
14-day minimum release age in `pnpm-workspace.yaml`.

```bash
corepack enable
corepack prepare pnpm@11.5.3 --activate
pnpm install
pnpm dev
```

The local dev server runs with Vite. Build the app with:

```bash
pnpm build
```

Run the verification suites with:

```bash
pnpm verify
```

GitHub save/load flows are optional. When they are enabled, copy
`.env.example`, set `VITE_GITHUB_CLIENT_ID`, and deploy a compatible
`POST /api/GithubOAuth` endpoint.

See `CONTRIBUTING.md` for the full local lifecycle.

## Upstream

KarabinerVIA is derived from the open-source VIA app. This fork is not affiliated with VIA, QMK, Apple, or Karabiner-Elements.
