import { test, expect } from '@playwright/test';
import { evaluateClaim, Claim, Policy } from './claims';
//commit 2: this test is going to fail
test.describe('Claims Processing', () => {
  
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

});