import { useState } from 'react';
import { Activity, RefreshCcw } from 'lucide-react';
import { AccountDetail } from './components/AccountDetail';
import { AccountTable } from './components/AccountTable';
import { FilterPanel } from './components/FilterPanel';
import { MetricCards } from './components/MetricCards';
import { OwnerWorkload } from './components/OwnerWorkload';
import { useAccounts } from './hooks/useAccounts';
import type { AccountFilters, CustomerAccount } from './types';
import { calculateMetrics, filterAccounts } from './utils/performanceHotspots';

const initialFilters: AccountFilters = {
  keyword: '',
  region: 'all',
  riskLevel: 'all',
  ownerTeam: 'all',
  minRenewalAmount: 0,
  onlyRenewalIn90Days: false,
};

export default function App() {
  const { accounts, isLoading, error } = useAccounts();
  const [filters, setFilters] = useState<AccountFilters>(initialFilters);
  const [selectedAccount, setSelectedAccount] = useState<CustomerAccount | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const startedAt = performance.now();
  const filteredAccounts = filterAccounts(accounts, filters);
  const metrics = calculateMetrics(filteredAccounts);
  const calculationCost = Math.round((performance.now() - startedAt) * 100) / 100;

  function handleSelect(account: CustomerAccount) {
    setSelectedAccount(account);
  }

  function handleRefresh() {
    setRefreshKey((value) => value + 1);
    localStorage.setItem('last-refresh', new Date().toISOString());
  }

  return (
    <main className="app-shell" data-refresh-key={refreshKey}>
      <header className="topbar">
        <div>
          <span>客户运营中心</span>
          <h1>续约风险与服务质量工作台</h1>
        </div>
        <button className="primary-action" onClick={handleRefresh}>
          <RefreshCcw size={18} />
          刷新数据
        </button>
      </header>

      {isLoading ? (
        <section className="loading-state">正在加载客户运营数据...</section>
      ) : error ? (
        <section className="error-state">加载失败：{error}</section>
      ) : (
        <>
          <MetricCards metrics={metrics} />
          <FilterPanel filters={filters} onChange={setFilters} />

          <section className="insight-strip">
            <Activity size={18} />
            <span>本次筛选与统计计算耗时：{calculationCost} ms</span>
            <span>当前渲染行数：{filteredAccounts.length.toLocaleString('zh-CN')}</span>
            <span>数据规模：{accounts.length.toLocaleString('zh-CN')} 客户</span>
          </section>

          <section className="workspace-grid">
            <div className="left-column">
              <AccountTable accounts={filteredAccounts} selectedId={selectedAccount?.id ?? null} onSelect={handleSelect} />
            </div>
            <div className="right-column">
              <AccountDetail account={selectedAccount} />
              <OwnerWorkload accounts={filteredAccounts} />
            </div>
          </section>
        </>
      )}
    </main>
  );
}
