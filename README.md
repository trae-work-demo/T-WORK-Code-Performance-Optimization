# T-WORK Code Performance Optimization

MIT-licensed React performance optimization demo for Trae Work Code mode POC.

This project simulates a customer success operations dashboard used to identify renewal risk, review service quality, and assign follow-up actions. The code is intentionally realistic enough for an AI coding tool to inspect project structure, run tests, profile bottlenecks, change implementation, and report before/after results.

## Scenario

The page renders thousands of customer accounts with:

- dashboard metrics
- multi-condition filtering
- risk-based sorting
- customer detail panel
- activity timeline
- owner workload ranking
- mock API calls
- test coverage for core data paths

The demo is suitable for the POC case:

> 诊断性能问题并输出优化前后对比

## Tech Stack

- React 18
- TypeScript
- Vite
- Vitest
- Testing Library
- ESLint
- lucide-react

## Quick Start

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Verification Commands

```bash
npm run test
npm run build
npm run profile
```

`npm run profile` prints a lightweight baseline for filtering and sorting a large account dataset. It is not a replacement for browser profiling, but it gives an easy measurable signal for before/after comparison.

## Suggested Trae Work Prompt

```text
请接手这个客户运营工作台项目，先运行并理解项目，然后找出影响性能和体验的问题，直接完成优化和必要修复。完成后请运行验证命令，并输出你发现的问题、修改内容、优化前后对比、验证结果和仍需人工确认的风险。

要求：
1. 先给出你发现的性能瓶颈和定位依据。
3. 补充或调整必要测试，确保核心业务路径不回归。
4. 运行测试、构建和 profile 脚本。
5. 输出优化前后对比，包括筛选/排序耗时、渲染行数、交互响应、构建结果或其他可量化指标。
6. 说明修改文件、关键改动、验证命令、验证结果和仍需人工确认的风险。
```

## POC Demonstration Flow

1. Clone this repository into Trae Work Code mode.
2. Run `npm install`, `npm run dev`, `npm run test`, and `npm run profile`.
3. Ask Trae Work to diagnose and optimize performance with the prompt above.
4. Compare before/after profile output and browser interaction.
5. Review changed files and generated explanation.

## License

MIT
