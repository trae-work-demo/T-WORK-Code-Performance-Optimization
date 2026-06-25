import type { CustomerAccount } from '../types';
import { calculateAccountPriority, isRenewalIn90Days } from '../utils/performanceHotspots';
import { Sparkline } from './Sparkline';

interface AccountTableProps {
  accounts: CustomerAccount[];
  selectedId: string | null;
  onSelect: (account: CustomerAccount) => void;
}

const currencyFormatter = new Intl.NumberFormat('zh-CN', {
  style: 'currency',
  currency: 'CNY',
  maximumFractionDigits: 0,
});

function riskLabel(risk: CustomerAccount['riskLevel']) {
  return risk === 'critical' ? 'P0' : risk === 'high' ? 'P1' : risk === 'medium' ? 'P2' : 'P3';
}

export function AccountTable({ accounts, selectedId, onSelect }: AccountTableProps) {
  return (
    <section className="table-section" aria-label="客户列表">
      <div className="table-header">
        <strong>客户列表</strong>
        <span>{accounts.length.toLocaleString('zh-CN')} 条结果</span>
      </div>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>客户</th>
              <th>风险</th>
              <th>健康分</th>
              <th>续约金额</th>
              <th>负责人</th>
              <th>未关工单</th>
              <th>使用趋势</th>
              <th>优先级</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => {
              const priority = calculateAccountPriority(account);
              return (
                <tr
                  key={account.id}
                  className={selectedId === account.id ? 'selected-row' : ''}
                  onClick={() => onSelect(account)}
                >
                  <td>
                    <strong>{account.name}</strong>
                    <span>{account.industry} / {account.region}</span>
                    {isRenewalIn90Days(account.renewalDate) ? <em>90 天内续约</em> : null}
                  </td>
                  <td>
                    <span className={`risk-pill risk-${account.riskLevel}`}>{riskLabel(account.riskLevel)}</span>
                  </td>
                  <td>{account.healthScore}</td>
                  <td>{currencyFormatter.format(account.renewalAmount)}</td>
                  <td>
                    {account.owner}
                    <span>{account.ownerTeam}</span>
                  </td>
                  <td>{account.openTicketCount}</td>
                  <td><Sparkline values={account.usageTrend} /></td>
                  <td>{priority}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
