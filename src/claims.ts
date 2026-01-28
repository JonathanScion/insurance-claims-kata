// Types
export type IncidentType = 'accident' | 'theft' | 'fire' | 'water damage';

export interface Policy {
  policyId: string;
  startDate: Date;
  endDate: Date;
  deductible: number;
  coverageLimit: number;
  coveredIncidents: IncidentType[];
}

export interface Claim {
  policyId: string;
  incidentType: IncidentType;
  incidentDate: Date;
  amountClaimed: number;
}

export interface ClaimResult {
  approved: boolean;
  payout: number;
  reasonCode: string;
}

// Evaluate a claim against available policies
// My assumption: Check order is exists → active → covered → calculate
export function evaluateClaim(claim: Claim, policies: Policy[]): ClaimResult {
  const policy = policies.find(p => p.policyId === claim.policyId);

  // Guard: policy must exist
  // My assumption: Policy not found → POLICY_NOT_FOUND reason code (not in original spec, but necessary for real-world usage)
  if (!policy) {
    return {
      approved: false,
      payout: 0,
      reasonCode: 'POLICY_NOT_FOUND',
    };
  }

  // Guard: policy must be active on incident date
  // My assumption: Dates are inclusive (incident on endDate is still covered)
  const incidentTime = claim.incidentDate.getTime();
  const isActive = incidentTime >= policy.startDate.getTime()
                && incidentTime <= policy.endDate.getTime();
  
  if (!isActive) {
    return {
      approved: false,
      payout: 0,
      reasonCode: 'POLICY_INACTIVE',
    };
  }

  // Guard: incident type must be covered
  if (!policy.coveredIncidents.includes(claim.incidentType)) {
    return {
      approved: false,
      payout: 0,
      reasonCode: 'NOT_COVERED',
    };
  }

  // Calculate payout
  const calculatedPayout = claim.amountClaimed - policy.deductible;

  // Guard: payout must be positive
  if (calculatedPayout <= 0) {
    return {
      approved: false,
      payout: 0,
      reasonCode: 'ZERO_PAYOUT',
    };
  }

  // Cap payout at coverage limit
  // My assumption: Capped payout still returns APPROVED
  const payout = Math.min(calculatedPayout, policy.coverageLimit);

  return {
    approved: true,
    payout,
    reasonCode: 'APPROVED',
  };
}