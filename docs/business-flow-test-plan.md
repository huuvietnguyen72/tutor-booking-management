# Business Flow Test Plan

## Automated E2E Coverage

The local deterministic seed is exercised by these Playwright journeys:

- `frontend/e2e/parent-children.spec.ts`: a seeded parent sees both children and the normalized `GOOD` academic level.
- `frontend/e2e/booking-course-review.spec.ts`: a Sunday one-time booking cannot submit a Monday slot; a recurring Monday booking from 2026-09-06 through 2026-10-06 estimates five sessions at 1.000.000d, is accepted by the tutor, and appears as 0/5 with five sessions; a completed booking accepts one review only.
- `frontend/e2e/tutor-applications.spec.ts`: a tutor views the seeded pending application and withdraws the exact application ID.
- `frontend/e2e/tutor-profile-approval.spec.ts`: a rejected tutor updates qualifications and returns to pending review.

Each mutating E2E suite restores the local seed in an `afterAll` hook. Playwright runs with one worker so seed restoration cannot race another suite.

## E2E Execution

Run only against the configured local MySQL instance and local application servers:

```powershell
npm run db:seed:test
npm --prefix frontend run test:e2e
npm run db:seed:test
```

## Release Verification

```powershell
.\mvnw.cmd clean test
npm --prefix frontend run test:unit
npm --prefix frontend run lint
npm --prefix frontend run build
npm test
```

Before release, also inspect the final worktree:

```powershell
git diff --check
git status --short
git diff --stat
```

Confirm that no applied migration changed, no credential or token was added, and no unrelated user change was overwritten.

## Unexecuted Coverage

This document records only the local flows above. Security and P0 cases not executed by these commands are not marked as passing.
