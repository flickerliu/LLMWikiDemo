# 工作量估算 — 企业级 LLM 自维护知识库系统

> ⚠️ **Human review needed** — 估算基于 docs/solution-design.md 中标注 [TBD] 的假设（团队规模、预算、时间线、数据驻留区域、吞吐目标未定）。具体承诺前需业务/技术负责人复核高不确定任务（标记为 ⚠️ Needs Human Review）。

---

## Estimation Summary

本估算覆盖三阶段交付（Phase 1 客服 FAQ MVP / Phase 2 企业接入扩展 / Phase 3 全面治理与推广），总毛估 Likely 约 **402 人天**（Optimistic 271 / Pessimistic 631），AI 辅助（Copilot 编码、AI 文档/测试生成）预计可节省 **约 124 人天（~31%）**，**人调整后 Likely 约 278 人天**——作为承诺基线。三类角色拆分：PM ~46 天、Architect ~63 天、Consultant ~169 天（人调整后）。隐含日历周期（5 人复合团队 @ 70% 利用率，并行执行）：约 12–14 周完成 Phase 1，全量 3 阶段约 7–9 个月。最大不确定来源：质量门控双模型机制、双向链接维护、外部数据源 API 接入审批、合规/数据驻留 [TBD]。建议下一步：解锁 [TBD] 项后启动 Phase 1 详细 Sprint 计划与外部接入审批流程。

---

## Role Summary Table

| Role        | Optimistic | Likely (Gross) | Pessimistic | AI Savings | Human-Adjusted Likely | Notes |
|-------------|-----------:|---------------:|------------:|-----------:|----------------------:|-------|
| PM          | 36 天      | 54 天          | 84 天       | 8 天       | 46 天                 | 治理、UAT、变更管理、跨阶段协调 |
| Architect   | 56 天      | 84 天          | 132 天      | 21 天      | 63 天                 | 架构设计、安全/合规、关键复杂决策 |
| Consultant  | 179 天     | 264 天         | 415 天      | 95 天      | 169 天                | 实施、连接器、UI、测试、文档 |
| **Total**   | **271 天** | **402 天**     | **631 天**  | **124 天** | **278 天**            | |

> **Human-Adjusted Likely** 为承诺与排期基线。Gross Likely 保留以备审计追溯。
> 隐含日历周期（基于 5 人并行小队，70% 利用率）：Phase 1 ≈ 12–14 周；Phase 2 ≈ 8–10 周；Phase 3 ≈ 8–10 周；总周期约 **30–34 周（7–9 个月）**。

---

## AI Savings Summary

| Category | Gross Likely (days) | AI Savings (days) | Savings % | Net Human Effort (days) |
|----------|--------------------:|------------------:|----------:|------------------------:|
| High AI leverage (Level: High) | 92 | 47 | ~51% | 45 |
| Medium AI leverage (Level: Medium) | 198 | 65 | ~33% | 133 |
| Low AI leverage (Level: Low) | 84 | 12 | ~14% | 72 |
| No AI leverage (Level: None) | 28 | 0 | 0% | 28 |
| **Total** | **402** | **124** | **~31%** | **278** |

AI 节省最高的领域：(1) IaC/脚手架（Bicep、Container Apps、CI/CD）由 Copilot 大幅加速；(2) 前端 Next.js 组件与 CRUD UI；(3) 文档与测试生成。节省最低的领域：双模型质量门控逻辑、双向链接图算法、合规/安全治理决策（需人类判断）。**节省落地依赖**：开发团队需熟练使用 GitHub Copilot/Cursor、企业已批准 AI 编码工具采购、Prompt 模板成熟度。若团队 AI 使用经验有限，建议将节省比例下调 30–50%。

---

## Epic / Feature / Task Breakdown

### Phase 1 — 核心引擎 MVP（客服 FAQ 试点）

#### Epic 1.1 — Project Initiation & Governance

| Task | Primary | Supporting | O / L / P (天) | Buffer | AI Level | AI 工具 | AI 节省 | Adj. Likely | ⚠️ |
|------|---------|------------|---------------:|-------:|----------|---------|--------:|------------:|----|
| 1.1.1 项目章程与启动会 — 利益相关方对齐、章程签署 | PM | Architect | 3 / 5 / 8 | 10% | Low | AI Chat | 15% — 模板/会议纪要起草 | 4.3 | No |
| 1.1.2 需求基线确认与签署 — 需求复核、TBD 项跟进 | PM | Consultant | 2 / 4 / 6 | 15% | Medium | AI Chat, AI Docs | 30% — 摘要/差异分析 | 2.8 | Yes（含 TBD） |
| 1.1.3 架构评审准备（材料、备选评估） | Architect | PM | 2 / 3 / 5 | 10% | Medium | AI Chat, AI Docs | 35% — 文档结构化生成 | 2.0 | No |

**关键活动**：章程起草、利益相关方矩阵、TBD 项跟踪、架构评审 deck。

#### Epic 1.2 — Foundation Architecture & Infrastructure

| Task | Primary | Supporting | O / L / P | Buffer | AI Level | AI 工具 | AI 节省 | Adj. Likely | ⚠️ |
|------|---------|------------|----------:|-------:|----------|---------|--------:|------------:|----|
| 1.2.1 Azure 订阅/网络拓扑设计（VNet、Private Endpoint） | Architect | Consultant | 3 / 5 / 8 | 20% | Low | AI Chat | 15% | 4.3 | Yes（合规依赖） |
| 1.2.2 IaC：Azure OpenAI / AI Search / ACA / Service Bus / Blob / Key Vault 资源置备 | Consultant | Architect | 5 / 8 / 12 | 15% | High | Copilot, Bicep templates | 50% — IaC 模板高度可复用 | 4.0 | No |
| 1.2.3 CI/CD 流水线（Azure DevOps Pipelines / GitHub Actions） | Consultant | — | 3 / 5 / 8 | 15% | High | Copilot, AI YAML | 50% | 2.5 | No |
| 1.2.4 安全基线（RBAC、Private Endpoint、TLS、Key Vault 集成） | Architect | Consultant | 3 / 5 / 7 | 15% | Low | AI Chat | 20% — 安全决策需人工 | 4.0 | No |
| 1.2.5 Entra ID 应用注册 & SSO 配置 | Architect | Consultant | 2 / 3 / 5 | 15% | Low | AI Chat | 20% | 2.4 | Yes（外部审批依赖） |

**Dependencies**：Azure OpenAI 配额申请、信息安全评审、Entra ID 管理员审批。

#### Epic 1.3 — Schema & Governance Layer

| Task | Primary | Supporting | O / L / P | Buffer | AI Level | AI 工具 | AI 节省 | Adj. Likely | ⚠️ |
|------|---------|------------|----------:|-------:|----------|---------|--------:|------------:|----|
| 1.3.1 AGENTS.md Schema 设计（目录/命名/治理规则） | Architect | Consultant | 2 / 4 / 6 | 20% | Medium | AI Chat, AI Docs | 30% | 2.8 | Yes（业务定义） |
| 1.3.2 客服 FAQ 目录与命名规范实例化 | Consultant | — | 1 / 2 / 3 | 10% | Medium | AI Chat | 30% | 1.4 | No |
| 1.3.3 数据分类标签体系（公开/内部/机密） | Architect | — | 2 / 3 / 5 | 20% | Low | AI Chat | 15% | 2.6 | Yes（治理依赖） |

#### Epic 1.4 — Ingest Pipeline（核心模块，最大风险点）

| Task | Primary | Supporting | O / L / P | Buffer | AI Level | AI 工具 | AI 节省 | Adj. Likely | ⚠️ |
|------|---------|------------|----------:|-------:|----------|---------|--------:|------------:|----|
| 1.4.1 飞书连接器 + 手动上传通道 | Consultant | — | 4 / 7 / 12 | 20% | Medium | Copilot, AI Test Gen | 35% | 4.6 | Yes（飞书 API 审批） |
| 1.4.2 Azure Document Intelligence 文档解析集成（PDF/Word/OCR） | Consultant | — | 2 / 4 / 6 | 15% | High | Copilot, AI Docs | 50% | 2.0 | No |
| 1.4.3 规则筛选层（去重、过滤、噪声消除） | Consultant | — | 2 / 3 / 5 | 10% | Medium | Copilot, AI Test Gen | 35% | 2.0 | No |
| 1.4.4 GPT-4o-mini 分类 & 摘要服务 | Consultant | Architect | 4 / 6 / 10 | 20% | Medium | Copilot, AI Chat | 35% | 3.9 | No |
| 1.4.5 双模型质量门控（评分 + 阈值路由） | Architect | Consultant | 4 / 7 / 12 | 25% | Low | Copilot, AI Chat | 20% — 评估逻辑非标 | 5.6 | **Yes** |
| 1.4.6 Wiki 写入 + Git PR 生成 | Consultant | — | 3 / 5 / 8 | 15% | Medium | Copilot | 35% | 3.3 | No |
| 1.4.7 双向链接维护（图算法、引用更新） | Consultant | Architect | 4 / 6 / 10 | 25% | Medium | Copilot, AI Chat | 30% | 4.2 | **Yes**（复杂度高） |
| 1.4.8 Azure AI Search 索引同步（向量 + 全文增量） | Consultant | — | 2 / 4 / 6 | 15% | Medium | Copilot | 35% | 2.6 | No |
| 1.4.9 幂等性 & 断点续跑（Service Bus 检查点） | Architect | Consultant | 3 / 5 / 8 | 25% | Low | Copilot, AI Chat | 20% | 4.0 | Yes |

#### Epic 1.5 — Query API & Backend

| Task | Primary | Supporting | O / L / P | Buffer | AI Level | AI 工具 | AI 节省 | Adj. Likely | ⚠️ |
|------|---------|------------|----------:|-------:|----------|---------|--------:|------------:|----|
| 1.5.1 FastAPI 后端骨架 + Entra ID 认证中间件 | Consultant | — | 2 / 4 / 6 | 15% | High | Copilot, AI Test Gen | 50% | 2.0 | No |
| 1.5.2 Query API 与混合检索（向量 + BM25 + 重排序） | Consultant | Architect | 4 / 6 / 10 | 20% | Medium | Copilot | 35% | 3.9 | No |
| 1.5.3 答案综合与有价值问答回写 Wiki 逻辑 | Architect | Consultant | 3 / 5 / 8 | 25% | Medium | Copilot, AI Chat | 30% | 3.5 | Yes |
| 1.5.4 审计日志（操作者/时间/LLM 来源） | Consultant | — | 2 / 3 / 5 | 10% | Medium | Copilot | 40% | 1.8 | No |

#### Epic 1.6 — Frontend & Admin UI

| Task | Primary | Supporting | O / L / P | Buffer | AI Level | AI 工具 | AI 节省 | Adj. Likely | ⚠️ |
|------|---------|------------|----------:|-------:|----------|---------|--------:|------------:|----|
| 1.6.1 Next.js 项目脚手架 + 认证集成 | Consultant | — | 2 / 4 / 6 | 15% | High | Copilot, Cursor | 55% | 1.8 | No |
| 1.6.2 Wiki 浏览器（分类、搜索、版本历史、原文溯源） | Consultant | — | 4 / 7 / 10 | 15% | High | Copilot, Cursor | 50% | 3.5 | No |
| 1.6.3 Q&A 对话界面 + 流式响应 | Consultant | — | 3 / 5 / 8 | 15% | High | Copilot, Cursor | 50% | 2.5 | No |
| 1.6.4 人工审核操作台（diff 视图、批准/拒绝/修改） | Consultant | — | 4 / 6 / 10 | 20% | Medium | Copilot, Cursor | 35% | 3.9 | No |
| 1.6.5 知识健康仪表盘(基础版) | Consultant | — | 3 / 5 / 8 | 15% | High | Copilot | 50% | 2.5 | No |

#### Epic 1.7 — Observability & Cost Controls

| Task | Primary | Supporting | O / L / P | Buffer | AI Level | AI 工具 | AI 节省 | Adj. Likely | ⚠️ |
|------|---------|------------|----------:|-------:|----------|---------|--------:|------------:|----|
| 1.7.1 App Insights + Azure Monitor 接入与仪表盘 | Consultant | — | 2 / 3 / 5 | 10% | Medium | Copilot, AI Chat | 40% | 1.8 | No |
| 1.7.2 LLM 调用追踪 & 成本告警（每日预算阈值） | Consultant | Architect | 2 / 3 / 5 | 15% | Medium | Copilot | 35% | 2.0 | No |
| 1.7.3 运维 Runbook（故障预案、回滚指南） | Architect | — | 1 / 2 / 4 | 10% | High | AI Docs | 50% | 1.0 | No |

#### Epic 1.8 — MVP Validation & Pilot

| Task | Primary | Supporting | O / L / P | Buffer | AI Level | AI 工具 | AI 节省 | Adj. Likely | ⚠️ |
|------|---------|------------|----------:|-------:|----------|---------|--------:|------------:|----|
| 1.8.1 客服 FAQ 初始语料导入与清洗 | Consultant | PM | 2 / 4 / 6 | 20% | Low | AI Chat | 20% | 3.2 | Yes（语料质量） |
| 1.8.2 用户验收测试（UAT） | PM | Consultant | 3 / 5 / 8 | 20% | Low | AI Chat | 15% | 4.3 | No |
| 1.8.3 准确率抽样 & 评估（≥85% 目标） | Consultant | PM | 2 / 3 / 5 | 15% | Medium | AI Chat | 30% | 2.1 | Yes |
| 1.8.4 客服团队试点上线 & 变更管理 | PM | — | 2 / 3 / 5 | 15% | None | — | 0% | 3.0 | No |

**Phase 1 小计**：Optimistic ≈ 90 / Likely ≈ 142 / Pessimistic ≈ 220 / Adjusted ≈ 99 天

---

### Phase 2 — 企业接入扩展

#### Epic 2.1 — Additional Connectors

| Task | Primary | Supporting | O / L / P | Buffer | AI Level | AI 工具 | AI 节省 | Adj. Likely | ⚠️ |
|------|---------|------------|----------:|-------:|----------|---------|--------:|------------:|----|
| 2.1.1 Confluence REST API 连接器 | Consultant | — | 3 / 5 / 8 | 15% | Medium | Copilot, AI Test Gen | 35% | 3.3 | No |
| 2.1.2 GitHub / Azure DevOps Webhook 连接器 | Consultant | — | 3 / 5 / 8 | 15% | High | Copilot | 45% | 2.8 | No |
| 2.1.3 邮件连接器（Exchange / Microsoft Graph） | Consultant | — | 3 / 5 / 8 | 20% | Medium | Copilot | 30% | 3.5 | Yes（权限审批） |
| 2.1.4 Jira REST API 连接器 | Consultant | — | 2 / 4 / 6 | 15% | High | Copilot | 45% | 2.2 | No |

#### Epic 2.2 — Lint Service

| Task | Primary | Supporting | O / L / P | Buffer | AI Level | AI 工具 | AI 节省 | Adj. Likely | ⚠️ |
|------|---------|------------|----------:|-------:|----------|---------|--------:|------------:|----|
| 2.2.1 Azure Functions Timer 调度框架 | Consultant | — | 2 / 3 / 5 | 10% | High | Copilot | 50% | 1.5 | No |
| 2.2.2 冲突检测逻辑（LLM 对比扫描） | Consultant | Architect | 3 / 5 / 8 | 25% | Medium | Copilot, AI Chat | 30% | 3.5 | Yes |
| 2.2.3 过时页面检测（时间/引用启发式） | Consultant | — | 2 / 3 / 5 | 15% | Medium | Copilot | 35% | 2.0 | No |
| 2.2.4 通知集成（飞书/邮件 Webhook） | Consultant | — | 1 / 2 / 4 | 10% | High | Copilot | 50% | 1.0 | No |

#### Epic 2.3 — RBAC Refinement

| Task | Primary | Supporting | O / L / P | Buffer | AI Level | AI 工具 | AI 节省 | Adj. Likely | ⚠️ |
|------|---------|------------|----------:|-------:|----------|---------|--------:|------------:|----|
| 2.3.1 多业务域权限模型设计 | Architect | Consultant | 2 / 4 / 6 | 20% | Low | AI Chat | 20% | 3.2 | Yes |
| 2.3.2 RBAC 实现 & 单元/集成测试 | Consultant | — | 3 / 5 / 8 | 15% | Medium | Copilot, AI Test Gen | 40% | 3.0 | No |

#### Epic 2.4 — Hybrid Search Optimization

| Task | Primary | Supporting | O / L / P | Buffer | AI Level | AI 工具 | AI 节省 | Adj. Likely | ⚠️ |
|------|---------|------------|----------:|-------:|----------|---------|--------:|------------:|----|
| 2.4.1 知识图谱关系建模与抽取 Pipeline | Architect | Consultant | 3 / 6 / 10 | 25% | Medium | Copilot, AI Chat | 30% | 4.2 | **Yes** |
| 2.4.2 查询重排序优化与 A/B 评估 | Consultant | — | 2 / 4 / 7 | 20% | Medium | Copilot | 35% | 2.6 | Yes |

#### Epic 2.5 — Multi-domain Wiki Extension

| Task | Primary | Supporting | O / L / P | Buffer | AI Level | AI 工具 | AI 节省 | Adj. Likely | ⚠️ |
|------|---------|------------|----------:|-------:|----------|---------|--------:|------------:|----|
| 2.5.1 研发文档域 AGENTS.md 与目录扩展 | Consultant | Architect | 2 / 3 / 5 | 15% | Medium | AI Chat | 30% | 2.1 | No |
| 2.5.2 决策记录（ADR）域接入 | Consultant | — | 1 / 2 / 4 | 10% | High | AI Docs | 50% | 1.0 | No |
| 2.5.3 域级配置面板（前端） | Consultant | — | 2 / 4 / 6 | 15% | High | Copilot, Cursor | 50% | 2.0 | No |

**Phase 2 小计**：Optimistic ≈ 34 / Likely ≈ 60 / Pessimistic ≈ 98 / Adjusted ≈ 38 天

---

### Phase 3 — 全面治理与推广

#### Epic 3.1 — Governance System

| Task | Primary | Supporting | O / L / P | Buffer | AI Level | AI 工具 | AI 节省 | Adj. Likely | ⚠️ |
|------|---------|------------|----------:|-------:|----------|---------|--------:|------------:|----|
| 3.1.1 数据分类落地（标签注入 Pipeline） | Consultant | Architect | 3 / 5 / 8 | 20% | Medium | Copilot | 30% | 3.5 | Yes |
| 3.1.2 内容 Owner 机制 & 责任流程 | PM | Architect | 2 / 4 / 6 | 15% | Low | AI Chat | 20% | 3.2 | Yes |
| 3.1.3 合规审查工作流（敏感内容路由） | Architect | Consultant | 3 / 5 / 8 | 25% | Low | AI Chat | 20% | 4.0 | **Yes**（合规 [TBD]） |

#### Epic 3.2 — Advanced Health Dashboard

| Task | Primary | Supporting | O / L / P | Buffer | AI Level | AI 工具 | AI 节省 | Adj. Likely | ⚠️ |
|------|---------|------------|----------:|-------:|----------|---------|--------:|------------:|----|
| 3.2.1 全域健康指标 & 趋势分析视图 | Consultant | — | 3 / 5 / 8 | 15% | High | Copilot, Cursor | 50% | 2.5 | No |
| 3.2.2 成本监控与预算建模视图 | Consultant | — | 2 / 4 / 6 | 15% | High | Copilot | 50% | 2.0 | No |

#### Epic 3.3 — Bot Integrations

| Task | Primary | Supporting | O / L / P | Buffer | AI Level | AI 工具 | AI 节省 | Adj. Likely | ⚠️ |
|------|---------|------------|----------:|-------:|----------|---------|--------:|------------:|----|
| 3.3.1 飞书机器人集成（消息内查询） | Consultant | — | 3 / 5 / 8 | 20% | Medium | Copilot | 35% | 3.3 | Yes（飞书审批） |
| 3.3.2 Slack Bot 集成 | Consultant | — | 2 / 4 / 6 | 15% | High | Copilot | 50% | 2.0 | No |

#### Epic 3.4 — Performance & Scale

| Task | Primary | Supporting | O / L / P | Buffer | AI Level | AI 工具 | AI 节省 | Adj. Likely | ⚠️ |
|------|---------|------------|----------:|-------:|----------|---------|--------:|------------:|----|
| 3.4.1 100K+ 文档规模性能调优（索引分片、缓存） | Architect | Consultant | 4 / 7 / 12 | 25% | Low | AI Chat | 20% | 5.6 | **Yes** |
| 3.4.2 LLM 调用批处理优化与成本下降验证 | Consultant | Architect | 2 / 4 / 7 | 20% | Medium | Copilot | 30% | 2.8 | Yes |

#### Epic 3.5 — DR & Operational Readiness

| Task | Primary | Supporting | O / L / P | Buffer | AI Level | AI 工具 | AI 节省 | Adj. Likely | ⚠️ |
|------|---------|------------|----------:|-------:|----------|---------|--------:|------------:|----|
| 3.5.1 灾难恢复方案设计与备份策略 | Architect | Consultant | 2 / 4 / 6 | 20% | Low | AI Chat | 20% | 3.2 | Yes |
| 3.5.2 DR 演练（验证 RTO<4h / RPO<1h） | Consultant | PM | 2 / 4 / 6 | 20% | None | — | 0% | 4.0 | Yes |
| 3.5.3 全员推广培训与文档发布 | PM | Consultant | 3 / 5 / 8 | 15% | Medium | AI Docs | 35% | 3.3 | No |
| 3.5.4 项目收尾、复盘与运营移交 | PM | Architect | 2 / 4 / 6 | 10% | Low | AI Chat, AI Docs | 20% | 3.2 | No |

**Phase 3 小计**：Optimistic ≈ 38 / Likely ≈ 64 / Pessimistic ≈ 103 / Adjusted ≈ 46 天

---

## Estimation Risks & Unknowns

### 五大估算风险

1. **质量门控双模型机制 (1.4.5)**：评分阈值与拒绝策略需多轮迭代，实际工作量可能超出 25% 缓冲；建议预留 PoC 阶段（2–3 天）先验证可行性。
2. **双向链接图维护 (1.4.7)**：Wiki 规模增长后图遍历与更新成本非线性；100K 页面级别下需重新评估。
3. **外部数据源 API 接入审批**：飞书/Confluence/邮件权限审批周期不可控，可能延误 Phase 1 与 Phase 2 启动。
4. **数据驻留 [TBD] 切换至 Azure 中国区（世纪互联）**：若需切换，部分服务（如 AI Search 高级功能、Doc Intelligence 区域可用性）将影响架构与重做估算（+15–25%）。
5. **AI 节省落地不确定性**：估算假设团队具备熟练 Copilot/Cursor 使用能力；若团队 AI 经验不足，节省比例可能下调 30–50%（即净人工增加 35–60 天）。

### 待解锁的关键未知项

- 预算上限与 LLM API 月度成本承受范围
- 项目时间线与里程碑硬约束
- 团队规模与角色配置（当前估算假设 5 人复合团队 + 70% 利用率）
- 数据驻留合规要求（国内 vs Azure Global）
- 峰值并发查询/用户数目标
- 现有飞书/Confluence/GitHub API 配额与审批路径
- 利益相关方（Product Owner、Security Reviewer、Architecture Approver）人选

### 管理说明

本估算为**三点估算 + AI 调整后基线**，不构成单点承诺。Human-Adjusted Likely（278 天）建议作为内部排期与商务报价基线，并视团队 AI 熟练度按 ±20% 浮动；Pessimistic（631 天）应用于风险准备金测算。所有标注 ⚠️ 的任务在进入对应 Sprint 前需完成需求/技术 Spike 重新评估。Phase 1 完成后强烈建议召开复盘，更新 Phase 2/3 估算（基于 MVP 实际生产率系数）。

---

*文档版本：v0.1 | 创建日期：2026-05-13 | 状态：待业务/技术负责人复核*
*⚠️ Human review needed — 标注 [TBD] / ⚠️ 项需在估算签署前确认*
