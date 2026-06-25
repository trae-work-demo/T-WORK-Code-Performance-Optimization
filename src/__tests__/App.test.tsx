import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from '../App';

describe('App', () => {
  it('renders customer dashboard and supports filtering', async () => {
    render(<App />);

    expect(screen.getByText('正在加载客户运营数据...')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText('客户列表')).toBeInTheDocument());

    await userEvent.selectOptions(screen.getByLabelText('风险'), 'critical');
    expect(screen.getByText(/本次筛选与统计计算耗时/)).toBeInTheDocument();
    expect(screen.getByText('负责人负载')).toBeInTheDocument();
  });
});
