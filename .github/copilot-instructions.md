# Copilot instructions for TailoraX

## Project overview

This repository is a small React + Vite single-page application. The app entry point is `src/main.jsx`, which mounts the root React tree into `#root` and wraps it in `<StrictMode>`. The main UI lives in `src/App.jsx`; global styling is in `src/index.css`, while component-specific styling is in `src/App.css`.

The project currently has no backend or data layer; it is a frontend-only app served by Vite. Keep changes scoped to the frontend and avoid introducing extra framework patterns unless there is a clear product need.

Important repository state: in this checkout, `src/App.jsx` is missing, so `src/main.jsx` currently cannot resolve the root component and the Vite build fails until that file is restored or replaced. If linting fails with an `oxlint` native-binding error, clean reinstall the dependencies (`rm -rf node_modules package-lock.json` or delete the folder in Windows Explorer, then run `npm install`) before assuming the toolchain itself is broken.

## Build, test, and lint commands

Use the scripts defined in `package.json`:

- Install dependencies: `npm install`
- Start development server: `npm run dev`
- Build production bundle: `npm run build`
- Lint the project: `npm run lint`
- Preview production build locally: `npm run preview`

There is no `test` script configured in this repository, and there are no test files present at the moment. For validation, prefer `npm run lint` and `npm run build` after modifying UI or configuration. If a future test runner is added, run a single test file or test name with the project’s runner rather than the full suite when iterating.

## Architecture and file responsibilities

- `index.html` is the Vite HTML shell; it includes the root mount point used by `src/main.jsx`.
- `src/main.jsx` is the bootstrap file and should remain the place where the app is mounted.
- `src/App.jsx` is the app root. Keep app-level composition and top-level state here until a feature grows enough to justify a dedicated module.
- `src/index.css` holds global CSS variables, root-level styling, layout, and shared typography rules.
- `src/App.css` holds styling that is specific to the current screen/component structure.
- `public/` and `src/assets/` are for static assets and images; import assets through the bundler rather than manual path references when possible.
- `vite.config.js` configures the Vite React pipeline; if you change build behavior, validate it with `npm run build`.

## Conventions specific to this repo

- The codebase uses plain JavaScript with React function components and hooks, not TypeScript.
- Imports are ES module style (`import ... from ...`), matching the Vite + React default setup.
- Styling is CSS-first and file-based; prefer updates to `src/index.css` and `src/App.css` over inline styles or CSS-in-JS unless the project explicitly adopts a different pattern.
- Keep the app architecture intentionally lightweight. This repository does not yet have feature folders, state management, or API abstractions; do not introduce them without a clear need.
- When adding UI behavior, prefer small, composable React components instead of embedding large blocks of logic in a single file.
- Preserve the existing Vite conventions: do not rename the root entry point or move critical app bootstrap behavior away from `src/main.jsx` without updating the generated project structure accordingly.

## Repo-specific guidance

- The project is generated from the standard Vite React template, so the current baseline is intentionally minimal. Changes should stay consistent with that baseline unless the product requirement calls for expansion.
- If you add new packages or scripts, update `package.json` and validate the related commands with the real project workflow.
- Favor the smallest change that fits the existing structure; this repo is not organized around a large service or layered architecture yet.
