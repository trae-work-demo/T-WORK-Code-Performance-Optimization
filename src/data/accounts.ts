import type { Activity, CustomerAccount, Region, RiskLevel, ContractStage, OwnerTeam } from '../types';

const industries = ['制造', '零售', '金融', '教育', '医疗', '物流', '互联网', '能源'];
const regions: Region[] = ['华北', '华东', '华南', '西南', '海外'];
const teams: OwnerTeam[] = ['客户成功一组', '客户成功二组', '行业运营组', '战略客户组'];
const owners = ['陈晓', '王琳', '刘峰', '赵敏', '周宁', '李佳', '孙越', '高远'];
const stages: ContractStage[] = ['new', 'active', 'renewal', 'churn-risk'];
const risks: RiskLevel[] = ['critical', 'high', 'medium', 'low'];
const tags = ['重点客户', '集成中', '高频工单', '扩容机会', '竞品介入', '培训不足', '数据迁移', '预算冻结'];
const activityTypes: Activity['type'][] = ['meeting', 'ticket', 'training', 'renewal', 'risk-review'];

function pseudoRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function pick<T>(items: T[], seed: number) {
  return items[Math.floor(pseudoRandom(seed) * items.length)];
}

function buildTrend(seed: number, base: number, volatility: number) {
  return Array.from({ length: 12 }, (_, index) => {
    const wave = Math.sin((seed + index) / 2) * volatility;
    const noise = (pseudoRandom(seed * 31 + index) - 0.5) * volatility;
    return Math.max(0, Math.round(base + wave + noise));
  });
}

function buildActivities(accountIndex: number): Activity[] {
  return Array.from({ length: 8 }, (_, index) => {
    const type = pick(activityTypes, accountIndex * 13 + index);
    return {
      id: `act-${accountIndex}-${index}`,
      type,
      title: `${type === 'risk-review' ? '风险复盘' : type === 'ticket' ? '工单跟进' : type === 'training' ? '产品培训' : type === 'renewal' ? '续约沟通' : '客户会议'} #${index + 1}`,
      createdAt: new Date(Date.now() - (index + accountIndex % 30) * 86400000).toISOString(),
      scoreDelta: Math.round((pseudoRandom(accountIndex * 17 + index) - 0.42) * 18),
    };
  });
}

export function generateAccounts(count = 4200): CustomerAccount[] {
  return Array.from({ length: count }, (_, index) => {
    const risk = pick(risks, index * 3);
    const stage = risk === 'critical' ? 'churn-risk' : pick(stages, index * 5);
    const healthBase = risk === 'critical' ? 38 : risk === 'high' ? 55 : risk === 'medium' ? 72 : 86;
    const renewalDays = Math.floor(pseudoRandom(index * 19) * 210) - 30;
    const activeUsers = 20 + Math.floor(pseudoRandom(index * 23) * 900);
    const seats = activeUsers + 20 + Math.floor(pseudoRandom(index * 29) * 600);
    const ticketCount = Math.floor(pseudoRandom(index * 41) * 80);
    const openTicketCount = Math.floor(ticketCount * pseudoRandom(index * 43));

    return {
      id: `acc-${String(index + 1).padStart(5, '0')}`,
      name: `${pick(['北辰', '星河', '云岭', '同辉', '启明', '远帆', '万象', '联创'], index)}${pick(['科技', '集团', '制造', '医疗', '教育', '物流'], index * 7)}`,
      industry: pick(industries, index * 11),
      region: pick(regions, index * 17),
      owner: pick(owners, index * 21),
      ownerTeam: pick(teams, index * 31),
      stage,
      riskLevel: risk,
      healthScore: Math.max(1, Math.min(100, healthBase + Math.round((pseudoRandom(index * 37) - 0.5) * 22))),
      renewalAmount: 80000 + Math.floor(pseudoRandom(index * 47) * 2400000),
      seats,
      activeUsers,
      ticketCount,
      openTicketCount,
      usageTrend: buildTrend(index * 53, Math.round((activeUsers / seats) * 100), 18),
      npsTrend: buildTrend(index * 59, healthBase, 12),
      renewalDate: new Date(Date.now() + renewalDays * 86400000).toISOString(),
      tags: [pick(tags, index * 61), pick(tags, index * 67), pick(tags, index * 71)],
      activities: buildActivities(index),
    };
  });
}
