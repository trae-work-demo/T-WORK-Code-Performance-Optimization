import { RotateCcw, Search } from 'lucide-react';
import type { AccountFilters, OwnerTeam, Region, RiskLevel } from '../types';

interface FilterPanelProps {
  filters: AccountFilters;
  onChange: (filters: AccountFilters) => void;
}

const regions: Array<'all' | Region> = ['all', '华北', '华东', '华南', '西南', '海外'];
const risks: Array<'all' | RiskLevel> = ['all', 'critical', 'high', 'medium', 'low'];
const teams: Array<'all' | OwnerTeam> = ['all', '客户成功一组', '客户成功二组', '行业运营组', '战略客户组'];

const defaultFilters: AccountFilters = {
  keyword: '',
  region: 'all',
  riskLevel: 'all',
  ownerTeam: 'all',
  minRenewalAmount: 0,
  onlyRenewalIn90Days: false,
};

export function FilterPanel({ filters, onChange }: FilterPanelProps) {
  return (
    <section className="filter-panel" aria-label="筛选客户">
      <label className="search-box">
        <Search size={18} />
        <input
          aria-label="搜索客户、负责人或标签"
          value={filters.keyword}
          placeholder="搜索客户、负责人、行业或标签"
          onChange={(event) => onChange({ ...filters, keyword: event.target.value })}
        />
      </label>

      <label>
        区域
        <select value={filters.region} onChange={(event) => onChange({ ...filters, region: event.target.value as AccountFilters['region'] })}>
          {regions.map((item) => (
            <option key={item} value={item}>
              {item === 'all' ? '全部' : item}
            </option>
          ))}
        </select>
      </label>

      <label>
        风险
        <select value={filters.riskLevel} onChange={(event) => onChange({ ...filters, riskLevel: event.target.value as AccountFilters['riskLevel'] })}>
          {risks.map((item) => (
            <option key={item} value={item}>
              {item === 'all' ? '全部' : item}
            </option>
          ))}
        </select>
      </label>

      <label>
        团队
        <select value={filters.ownerTeam} onChange={(event) => onChange({ ...filters, ownerTeam: event.target.value as AccountFilters['ownerTeam'] })}>
          {teams.map((item) => (
            <option key={item} value={item}>
              {item === 'all' ? '全部' : item}
            </option>
          ))}
        </select>
      </label>

      <label>
        最低续约金额
        <input
          type="range"
          min="0"
          max="1800000"
          step="100000"
          value={filters.minRenewalAmount}
          onChange={(event) => onChange({ ...filters, minRenewalAmount: Number(event.target.value) })}
        />
        <span>{Math.round(filters.minRenewalAmount / 10000)} 万</span>
      </label>

      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={filters.onlyRenewalIn90Days}
          onChange={(event) => onChange({ ...filters, onlyRenewalIn90Days: event.target.checked })}
        />
        仅看 90 天内续约
      </label>

      <button type="button" className="icon-button" onClick={() => onChange(defaultFilters)} aria-label="重置筛选">
        <RotateCcw size={18} />
      </button>
    </section>
  );
}
