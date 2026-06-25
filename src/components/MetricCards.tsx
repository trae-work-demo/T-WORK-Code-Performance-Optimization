import { AlertTriangle, ChartNoAxesCombined, CircleDollarSign, TicketCheck, UsersRound } from 'lucide-react';
import type { DashboardMetrics } from '../types';

interface MetricCardsProps {
  metrics: DashboardMetrics;
}

const currencyFormatter = new Intl.NumberFormat('zh-CN', {
  style: 'currency',
  currency: 'CNY',
  maximumFractionDigits: 0,
});

export function MetricCards({ metrics }: MetricCardsProps) {
  const cards = [
    { label: '客户总数', value: metrics.totalAccounts.toLocaleString('zh-CN'), icon: UsersRound, tone: 'blue' },
    { label: '续约金额', value: currencyFormatter.format(metrics.totalRenewalAmount), icon: CircleDollarSign, tone: 'green' },
    { label: '平均健康分', value: String(metrics.averageHealthScore), icon: ChartNoAxesCombined, tone: 'purple' },
    { label: '高危客户', value: String(metrics.criticalAccounts), icon: AlertTriangle, tone: 'orange' },
    { label: '未关闭工单', value: metrics.openTickets.toLocaleString('zh-CN'), icon: TicketCheck, tone: 'red' },
  ];

  return (
    <section className="metric-grid" aria-label="运营指标">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <article className={`metric-card metric-card-${card.tone}`} key={card.label}>
            <Icon size={22} />
            <div>
              <span>{card.label}</span>
              <strong>{card.value}</strong>
            </div>
          </article>
        );
      })}
    </section>
  );
}
