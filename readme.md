//the spec at https://github.com/uplift-delivery/katas/tree/main/insurance

some assumptions I made:
Policy not found → POLICY_NOT_FOUND reason code
Dates are inclusive (incident on endDate is still covered)
Capped payout still returns APPROVED
Check order: exists → active → covered → calculate

my TDD-based work:
In TDD, we always start with a failing test. This proves:

The test actually tests something (it's not passing by accident)
We understand the requirement before writing code