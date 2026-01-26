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

// Function stub - not implemented yet
export function evaluateClaim(claim: Claim, policies: Policy[]): ClaimResult {
  throw new Error('Not implemented');
}