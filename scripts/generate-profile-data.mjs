import { performance } from 'node:perf_hooks';

const accountCount = Number(process.env.ACCOUNT_COUNT ?? 4200);
const runs = Number(process.env.PROFILE_RUNS ?? 10);

function pseudoRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function buildAccounts(count) {
  return Array.from({ length: count }, (_, index) => ({
    id: `acc-${String(index + 1).padStart(5, '0')}`,
    riskLevel: ['critical', 'high', 'medium', 'low'][Math.floor(pseudoRandom(index * 3) * 4)],
    healthScore: Math.round(30 + pseudoRandom(index * 7) * 70),
    renewalAmount: 80000 + Math.floor(pseudoRandom(index * 47) * 2400000),
    openTicketCount: Math.floor(pseudoRandom(index * 43) * 60),
    renewalDate: new Date(Date.now() + (Math.floor(pseudoRandom(index * 19) * 210) - 30) * 86400000).toISOString(),
    usageTrend: Array.from({ length: 12 }, (_, trendIndex) => Math.round(pseudoRandom(index * 53 + trendIndex) * 100)),
    npsTrend: Array.from({ length: 12 }, (_, trendIndex) => Math.round(pseudoRandom(index * 59 + trendIndex) * 100)),
    activities: Array.from({ length: 8 }, (_, activityIndex) => ({ scoreDelta: Math.round((pseudoRandom(index * 17 + activityIndex) - 0.42) * 18) })),
  }));
}

function priority(account) {
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
  score += account.renewalAmount > 1000000 ? 15 : 0;
  return Math.round(score);
}

const accounts = buildAccounts(accountCount);
const measurements = [];

for (let run = 0; run < runs; run += 1) {
  const startedAt = performance.now();
  accounts
    .filter((account) => account.renewalAmount >= 500000)
    .sort((a, b) => priority(b) - priority(a))
    .slice(0, 200);
  measurements.push(Math.round((performance.now() - startedAt) * 100) / 100);
}

console.log(JSON.stringify({ accountCount, runs, measurements }, null, 2));
