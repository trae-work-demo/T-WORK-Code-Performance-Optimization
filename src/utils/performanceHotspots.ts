import type { AccountFilters, CustomerAccount, DashboardMetrics } from '../types';

export function isRenewalIn90Days(date: string) {
  const diff = new Date(date).getTime() - Date.now();
  return diff >= 0 && diff <= 90 * 86400000;
}

export function calculateAccountPriority(account: CustomerAccount) {
  let score = 0;

  for (let i = 0; i < account.usageTrend.length; i += 1) {
    for (let j = 0; j < account.npsTrend.length; j += 1) {
      score += Math.abs(account.usageTrend[i] - account.npsTrend[j]) * 0.003;
    }
  }

  for (const activity of account.activities) {
    score += activity.scoreDelta < 0 ? Math.abs(activity.scoreDelta) * 0.8 : activity.scoreDelta * 0.2;
  }

  score += account.openTicketCount * 3;
  score += account.riskLevel === 'critical' ? 80 : account.riskLevel === 'high' ? 50 : account.riskLevel === 'medium' ? 20 : 4;
  score += isRenewalIn90Days(account.renewalDate) ? 28 : 0;
  score += account.renewalAmount > 1000000 ? 15 : 0;

  return Math.round(score);
}

export function filterAccounts(accounts: CustomerAccount[], filters: AccountFilters) {
  return accounts
    .filter((account) => {
      const keyword = filters.keyword.trim().toLowerCase();
      const keywordMatched =
        keyword.length === 0 ||
        account.name.toLowerCase().includes(keyword) ||
        account.owner.toLowerCase().includes(keyword) ||
        account.tags.join(',').toLowerCase().includes(keyword) ||
        account.industry.toLowerCase().includes(keyword);

      return (
        keywordMatched &&
        (filters.region === 'all' || account.region === filters.region) &&
        (filters.riskLevel === 'all' || account.riskLevel === filters.riskLevel) &&
        (filters.ownerTeam === 'all' || account.ownerTeam === filters.ownerTeam) &&
        account.renewalAmount >= filters.minRenewalAmount &&
        (!filters.onlyRenewalIn90Days || isRenewalIn90Days(account.renewalDate))
      );
    })
    .sort((a, b) => calculateAccountPriority(b) - calculateAccountPriority(a));
}

export function calculateMetrics(accounts: CustomerAccount[]): DashboardMetrics {
  const initial: DashboardMetrics = {
    totalAccounts: accounts.length,
    totalRenewalAmount: 0,
    averageHealthScore: 0,
    criticalAccounts: 0,
    openTickets: 0,
    renewalIn90Days: 0,
  };

  const metrics = accounts.reduce((acc, account) => {
    acc.totalRenewalAmount += account.renewalAmount;
    acc.averageHealthScore += account.healthScore;
    acc.criticalAccounts += account.riskLevel === 'critical' ? 1 : 0;
    acc.openTickets += account.openTicketCount;
    acc.renewalIn90Days += isRenewalIn90Days(account.renewalDate) ? 1 : 0;
    return acc;
  }, initial);

  metrics.averageHealthScore = accounts.length > 0 ? Math.round(metrics.averageHealthScore / accounts.length) : 0;
  return metrics;
}

export function buildOwnerWorkload(accounts: CustomerAccount[]) {
  const workload: Record<string, { owner: string; accounts: number; amount: number; openTickets: number }> = {};

  for (const account of accounts) {
    if (!workload[account.owner]) {
      workload[account.owner] = { owner: account.owner, accounts: 0, amount: 0, openTickets: 0 };
    }
    workload[account.owner].accounts += 1;
    workload[account.owner].amount += account.renewalAmount;
    workload[account.owner].openTickets += account.openTicketCount;
  }

  return Object.values(workload).sort((a, b) => b.openTickets - a.openTickets);
}
