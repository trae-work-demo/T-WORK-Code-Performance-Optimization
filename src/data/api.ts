import { generateAccounts } from './accounts';
import type { CustomerAccount } from '../types';

let cachedAccounts: CustomerAccount[] | null = null;

export async function fetchAccounts(): Promise<CustomerAccount[]> {
  await new Promise((resolve) => setTimeout(resolve, 180));

  if (!cachedAccounts) {
    cachedAccounts = generateAccounts();
  }

  return cachedAccounts;
}

export async function fetchAccountHealthSnapshot(accountId: string) {
  await new Promise((resolve) => setTimeout(resolve, 80));
  const accounts = await fetchAccounts();
  const account = accounts.find((item) => item.id === accountId);

  if (!account) {
    throw new Error('account not found');
  }

  return {
    accountId,
    trend: account.usageTrend.map((usage, index) => ({
      month: index + 1,
      usage,
      nps: account.npsTrend[index],
      riskSignal: Math.max(0, 100 - account.healthScore + account.openTicketCount * 2),
    })),
  };
}
