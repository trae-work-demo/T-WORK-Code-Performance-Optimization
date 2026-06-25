import type { CustomerAccount } from '../types';
import { buildOwnerWorkload } from '../utils/performanceHotspots';

interface OwnerWorkloadProps {
  accounts: CustomerAccount[];
}

export function OwnerWorkload({ accounts }: OwnerWorkloadProps) {
  const workload = buildOwnerWorkload(accounts).slice(0, 8);

  return (
    <section className="workload-panel">
      <div className="table-header">
        <strong>负责人负载</strong>
        <span>按未关工单排序</span>
      </div>
      {workload.map((item) => (
        <div className="workload-row" key={item.owner}>
          <span>{item.owner}</span>
          <div>
            <strong>{item.openTickets}</strong>
            <em>{item.accounts} 客户</em>
          </div>
        </div>
      ))}
    </section>
  );
}
