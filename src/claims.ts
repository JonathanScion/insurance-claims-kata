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
export function evaluateClaim(claim: Claim, policies: Policy[]): ClaimResult {
  const policy = policies.find(p => p.policyId === claim.policyId);

  // Guard: policy must exist
  if (!policy) {
    return {
      approved: false,
      payout: 0,
      reasonCode: 'POLICY_NOT_FOUND',
    };
  }

  const payout = claim.amountClaimed - policy.deductible;

  return {
    approved: true,
    payout,
    reasonCode: 'APPROVED',
  };
}