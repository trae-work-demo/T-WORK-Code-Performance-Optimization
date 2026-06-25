import { describe, expect, it } from 'vitest';
import { generateAccounts } from '../data/accounts';
import { calculateMetrics, filterAccounts } from '../utils/performanceHotspots';
import type { AccountFilters } from '../types';

const defaultFilters: AccountFilters = {
  keyword: '',
  region: 'all',
  riskLevel: 'all',
  ownerTeam: 'all',
  minRenewalAmount: 0,
  onlyRenewalIn90Days: false,
};

describe('performance hotspot utilities', () => {
  it('generates deterministic account data', () => {
    const first = generateAccounts(5);
    const second = generateAccounts(5);

    expect(first).toHaveLength(5);
    expect(first[0].id).toBe('acc-00001');
    expect(first[3].name).toBe(second[3].name);
  });

  it('filters by risk and renewal amount', () => {
    const accounts = generateAccounts(120);
    const filtered = filterAccounts(accounts, {
      ...defaultFilters,
      riskLevel: 'critical',
      minRenewalAmount: 500000,
    });

    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.every((account) => account.riskLevel === 'critical')).toBe(true);
    expect(filtered.every((account) => account.renewalAmount >= 500000)).toBe(true);
  });

  it('calculates dashboard metrics for visible accounts', () => {
    const accounts = generateAccounts(40);
    const metrics = calculateMetrics(accounts);

    expect(metrics.totalAccounts).toBe(40);
    expect(metrics.totalRenewalAmount).toBeGreaterThan(0);
    expect(metrics.averageHealthScore).toBeGreaterThan(0);
    expect(metrics.openTickets).toBeGreaterThanOrEqual(0);
  });
});
