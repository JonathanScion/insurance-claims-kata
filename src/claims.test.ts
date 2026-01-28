import { test, expect } from '@playwright/test';
import { evaluateClaim, Claim, Policy } from './claims';

test.describe('Claims Processing', () => {
  
  // Business Rule: Payout = amountClaimed - deductible
  test('should approve a valid claim and calculate correct payout', () => {
    // Arrange
    const policies: Policy[] = [
      {
        policyId: 'POL123',
        startDate: new Date('2023-01-01'),
        endDate: new Date('2024-01-01'),
        deductible: 500,
        coverageLimit: 10000,
        coveredIncidents: ['accident', 'fire'],
      },
    ];

    const claim: Claim = {
      policyId: 'POL123',
      incidentType: 'fire',
      incidentDate: new Date('2023-06-15'),
      amountClaimed: 3000,
    };

    // Act
    const result = evaluateClaim(claim, policies);

    // Assert
    expect(result.approved).toBe(true);
    expect(result.payout).toBe(2500); // 3000 - 500 deductible
    expect(result.reasonCode).toBe('APPROVED');
  });

  // My assumption: Policy not found → POLICY_NOT_FOUND reason code (not in original spec)
  test('should reject claim when policy is not found', () => {
    // Arrange
    const policies: Policy[] = [
      {
        policyId: 'POL123',
        startDate: new Date('2023-01-01'),
        endDate: new Date('2024-01-01'),
        deductible: 500,
        coverageLimit: 10000,
        coveredIncidents: ['accident', 'fire'],
      },
    ];

    const claim: Claim = {
      policyId: 'UNKNOWN_POLICY',
      incidentType: 'fire',
      incidentDate: new Date('2023-06-15'),
      amountClaimed: 3000,
    };

    // Act
    const result = evaluateClaim(claim, policies);

    // Assert
    expect(result.approved).toBe(false);
    expect(result.payout).toBe(0);
    expect(result.reasonCode).toBe('POLICY_NOT_FOUND');
  });

  // Business Rule: The policy must be active on the incidentDate
  test('should reject claim when policy is not active on incident date', () => {
    // Arrange
    const policies: Policy[] = [
      {
        policyId: 'POL123',
        startDate: new Date('2023-01-01'),
        endDate: new Date('2024-01-01'),
        deductible: 500,
        coverageLimit: 10000,
        coveredIncidents: ['accident', 'fire'],
      },
    ];

    const claim: Claim = {
      policyId: 'POL123',
      incidentType: 'fire',
      incidentDate: new Date('2025-01-01'), // After policy ended
      amountClaimed: 3000,
    };

    // Act
    const result = evaluateClaim(claim, policies);

    // Assert
    expect(result.approved).toBe(false);
    expect(result.payout).toBe(0);
    expect(result.reasonCode).toBe('POLICY_INACTIVE');
  });

  // Business Rule: The incidentType must be included in the policy's coveredIncidents
  test('should reject claim when incident type is not covered', () => {
    // Arrange
    const policies: Policy[] = [
      {
        policyId: 'POL123',
        startDate: new Date('2023-01-01'),
        endDate: new Date('2024-01-01'),
        deductible: 500,
        coverageLimit: 10000,
        coveredIncidents: ['accident', 'fire'], // Does NOT include 'water damage'
      },
    ];

    const claim: Claim = {
      policyId: 'POL123',
      incidentType: 'water damage', // Not covered!
      incidentDate: new Date('2023-06-15'),
      amountClaimed: 3000,
    };

    // Act
    const result = evaluateClaim(claim, policies);

    // Assert
    expect(result.approved).toBe(false);
    expect(result.payout).toBe(0);
    expect(result.reasonCode).toBe('NOT_COVERED');
  });

  // Business Rule: If payout is zero or negative, return 0 with reasonCode: ZERO_PAYOUT
  test('should return zero payout when claim amount is less than deductible', () => {
    // Arrange
    const policies: Policy[] = [
      {
        policyId: 'POL123',
        startDate: new Date('2023-01-01'),
        endDate: new Date('2024-01-01'),
        deductible: 500,
        coverageLimit: 10000,
        coveredIncidents: ['accident', 'fire'],
      },
    ];

    const claim: Claim = {
      policyId: 'POL123',
      incidentType: 'fire',
      incidentDate: new Date('2023-06-15'),
      amountClaimed: 300, // Less than $500 deductible
    };

    // Act
    const result = evaluateClaim(claim, policies);

    // Assert
    expect(result.approved).toBe(false);
    expect(result.payout).toBe(0);
    expect(result.reasonCode).toBe('ZERO_PAYOUT');
  });

  // Business Rule: The payout may not exceed the coverageLimit
  test('should cap payout at coverage limit', () => {
    // Arrange
    const policies: Policy[] = [
      {
        policyId: 'POL123',
        startDate: new Date('2023-01-01'),
        endDate: new Date('2024-01-01'),
        deductible: 500,
        coverageLimit: 10000,
        coveredIncidents: ['accident', 'fire'],
      },
    ];

    const claim: Claim = {
      policyId: 'POL123',
      incidentType: 'fire',
      incidentDate: new Date('2023-06-15'),
      amountClaimed: 12000, // 12000 - 500 = 11500, but limit is 10000
    };

    // Act
    const result = evaluateClaim(claim, policies);

    // Assert
    expect(result.approved).toBe(true);
    expect(result.payout).toBe(10000); // Capped at coverage limit
    expect(result.reasonCode).toBe('APPROVED');
  });

});