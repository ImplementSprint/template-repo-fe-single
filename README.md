# FE Single Template (Next.js)

Minimal Next.js + TypeScript boilerplate configured to call reusable CI/CD workflows from `ImplementSprint/central-workflow`.

## Local Commands

```bash
npm install
npm run dev
npm run test
npm run lint
npm run build
```

## CI/CD Setup Required

This repository keeps a thin caller workflow in `.github/workflows/fe-pipeline-caller.yml`.
It delegates orchestration to `ImplementSprint/central-workflow/.github/workflows/master-pipeline-fe.yml@v1`.

### 1) Required Branches

- `test`
- `uat`
- `main`

### 2) Required Repository Secrets

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- A secret that stores your Vercel Project ID (for example: `VERCEL_PROJECT_ID_FE_SINGLE`)

For promotion PR jobs and deployment comment updates:

- `GH_PR_TOKEN`

### 3) Required Repository Variable

- `FE_SINGLE_SYSTEMS_JSON`
  - A JSON object (or one-item array) with keys: `name`, `dir`, `image`, `vercel_project_secret`.
  - Example: `{"name":"Frontend-Root","dir":".","image":"fe-single-web","vercel_project_secret":"VERCEL_PROJECT_ID_FE_SINGLE"}`

### 4) Pipeline Behavior

- This template is fixed to single mode (`pipeline_mode: single`).
- Manual dispatch exposes only essential toggles (`enable_playwright`, `enable_grafana_k6`, deploy/promotion and dry-run flags).
- Branch flow is `test -> uat -> main`.

### 5) Vercel Project Settings

- Link this repository to a Vercel project.
- Set Vercel Root Directory to `.` for this single frontend setup.

## Notes

- Unit tests generate `coverage/coverage-summary.json` for the test workflow.
- `tests/e2e/playwright-e2e.ts` and `tests/performance/k6-smoke.ts` are included so default QA jobs can run without extra setup.
- `Dockerfile` is included so the main-branch container flow can run.
