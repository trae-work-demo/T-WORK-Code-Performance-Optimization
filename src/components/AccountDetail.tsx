import { useEffect, useState } from 'react';
import { CalendarClock, Gauge, MessageSquareText, Ticket } from 'lucide-react';
import { fetchAccountHealthSnapshot } from '../data/api';
import type { CustomerAccount } from '../types';
import { calculateAccountPriority } from '../utils/performanceHotspots';

interface AccountDetailProps {
  account: CustomerAccount | null;
}

interface HealthSnapshot {
  trend: Array<{ month: number; usage: number; nps: number; riskSignal: number }>;
}

export function AccountDetail({ account }: AccountDetailProps) {
  const [snapshot, setSnapshot] = useState<HealthSnapshot | null>(null);

  useEffect(() => {
    if (!account) {
      setSnapshot(null);
      return;
    }

    fetchAccountHealthSnapshot(account.id).then(setSnapshot);
  }, [account]);

  if (!account) {
    return (
      <aside className="detail-panel empty-detail">
        <Gauge size={24} />
        <p>选择一个客户查看续约风险、工单和最近活动。</p>
      </aside>
    );
  }

  return (
    <aside className="detail-panel">
      <div className="detail-title">
        <div>
          <span>{account.id}</span>
          <h2>{account.name}</h2>
        </div>
        <strong>{calculateAccountPriority(account)}</strong>
      </div>

      <div className="detail-stats">
        <div><Gauge size={18} />健康分 {account.healthScore}</div>
        <div><Ticket size={18} />未关工单 {account.openTicketCount}</div>
        <div><CalendarClock size={18} />续约 {new Date(account.renewalDate).toLocaleDateString('zh-CN')}</div>
      </div>

      <section>
        <h3>风险标签</h3>
        <div className="tag-list">
          {account.tags.map((tag) => <span key={tag}>{tag}</span>)}
        </div>
      </section>

      <section>
        <h3>最近活动</h3>
        <ul className="activity-list">
          {account.activities.map((activity) => (
            <li key={activity.id}>
              <MessageSquareText size={16} />
              <div>
                <strong>{activity.title}</strong>
                <span>{new Date(activity.createdAt).toLocaleDateString('zh-CN')} / 分数变化 {activity.scoreDelta}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3>健康快照</h3>
        <div className="snapshot-grid">
          {(snapshot?.trend ?? []).slice(-6).map((item) => (
            <div key={item.month}>
              <span>M{item.month}</span>
              <strong>{item.usage}%</strong>
              <em>{item.riskSignal}</em>
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
}
