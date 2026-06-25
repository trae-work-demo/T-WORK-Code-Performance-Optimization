export type RiskLevel = 'critical' | 'high' | 'medium' | 'low';
export type ContractStage = 'new' | 'active' | 'renewal' | 'churn-risk';
export type Region = '华北' | '华东' | '华南' | '西南' | '海外';
export type OwnerTeam = '客户成功一组' | '客户成功二组' | '行业运营组' | '战略客户组';

export interface Activity {
  id: string;
  type: 'meeting' | 'ticket' | 'training' | 'renewal' | 'risk-review';
  title: string;
  createdAt: string;
  scoreDelta: number;
}

export interface CustomerAccount {
  id: string;
  name: string;
  industry: string;
  region: Region;
  owner: string;
  ownerTeam: OwnerTeam;
  stage: ContractStage;
  riskLevel: RiskLevel;
  healthScore: number;
  renewalAmount: number;
  seats: number;
  activeUsers: number;
  ticketCount: number;
  openTicketCount: number;
  usageTrend: number[];
  npsTrend: number[];
  renewalDate: string;
  tags: string[];
  activities: Activity[];
}

export interface AccountFilters {
  keyword: string;
  region: 'all' | Region;
  riskLevel: 'all' | RiskLevel;
  ownerTeam: 'all' | OwnerTeam;
  minRenewalAmount: number;
  onlyRenewalIn90Days: boolean;
}

export interface DashboardMetrics {
  totalAccounts: number;
  totalRenewalAmount: number;
  averageHealthScore: number;
  criticalAccounts: number;
  openTickets: number;
  renewalIn90Days: number;
}
