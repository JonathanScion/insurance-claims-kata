# Insurance Claims Processing

A TDD-based implementation of an insurance claims evaluation system.

Spec: https://github.com/uplift-delivery/katas/tree/main/insurance

## Running the App

```bash
npm install
npm test
```

## Assumptions & Decisions

- Policy not found → `POLICY_NOT_FOUND` reason code (not in original spec, but necessary for real-world usage)
- Dates are inclusive (incident on endDate is still covered)
- Capped payout still returns `APPROVED`
- Check order: exists → active → covered → calculate

I added these assumptions next to the code where they are relevant

## TDD Approach

In TDD, we always start with a failing test. This proves:
- The test actually tests something (it's not passing by accident)
- We understand the requirement before writing code

## What I'd Do With More Time

- Add input validation (negative amounts, invalid dates, null checks)
- Add edge case tests (boundary dates, exact deductible amount equals claim)
- Extract policy lookup into a repository pattern for better testability
- Add logging for audit trail of claim decisions