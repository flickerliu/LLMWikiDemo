# 工作量估算 — 企业级 LLM 自维护知识库系统

> ⚠️ Human review needed
>
> 本报告已按新版 `.github/prompts/estimate-work.prompt.md` 重新生成：引入 **Delivery Mode**（Human-led / AI-led）与 AI-led 任务的人类工作量分项（implementation/review/rework）。

## Estimation Summary

本次重算覆盖 8 个 Epic 的主实施路径，共 32 个任务（从 `docs/backlogs.md` 抽取关键交付链路）。总量为 **Optimistic 92 人天 / Likely(Gross) 152 人天 / Pessimistic 259 人天**。按新版口径，AI-led 任务不再仅按折扣率计算，而按人工编排+评审+返工预备计入，因此推荐承诺基线为 **Human-Adjusted Likely 80.8 人天**。与旧版统一折扣口径（102.4 人天）相比，净减少 **21.6 人天（-21.1%）**。关键风险仍在权限安全验证、质量门控评估、外部审批与配额约束。

## Estimation Method Note

- 对 **Human-led (AI-assisted)** 任务：`Human-Adjusted Likely = Likely × (1 - Estimated AI Savings %)`。
- 对 **AI-led (Human-reviewed)** 任务：`Human-Adjusted Likely = Human implementation effort + Human review effort + Human rework contingency`。
- AI-led 任务的核心是“人工评审与返工工作量”，而不是把传统人工实现工时简单打折。
- 承诺与排期基线采用 Human-Adjusted Likely；Gross Likely 保留用于审计与对比。

## Role Summary Table
| Role        | Optimistic | Likely (Gross) | Pessimistic | AI Savings | Human-Adjusted Likely | Tasks (Human-led / AI-led) | Notes |
|-------------|-----------:|---------------:|------------:|-----------:|----------------------:|----------------------------:|-------|
| PM          | 7 days     | 12 days        | 20 days     | 2.0 days   | 9.8 days              | 4 / 2                       | Governance, approvals, change coordination |
| Architect   | 29 days    | 48 days        | 82 days     | 16.2 days  | 28.6 days             | 8 / 5                       | Architecture, security, NFR, key decisions |
| Consultant  | 56 days    | 92 days        | 157 days    | 37.8 days  | 42.4 days             | 6 / 7                       | Build, integration, implementation delivery |
| **Total**   | **92 days**| **152 days**   | **259 days**| **56.0 days** | **80.8 days**      | **18 / 14**                 | Implied baseline duration: ~13–17 weeks (with dependency waits) |

> **Human-Adjusted Likely** is the recommended baseline for project planning and commitments. Gross Likely is retained for auditability.

## AI Savings Summary
| Category | Gross Likely (days) | AI Savings (days) | Savings % | Net Human Effort (days) |
|----------|--------------------:|------------------:|----------:|------------------------:|
| High AI leverage tasks (Level: High) | 62 | 35.3 | ~57% avg | 26.7 |
| Medium AI leverage tasks (Level: Medium) | 52 | 17.2 | ~33% avg | 34.8 |
| Low AI leverage tasks (Level: Low) | 24 | 3.5 | ~15% avg | 20.5 |
| No AI leverage tasks (Level: None) | 14 | 0 | 0% | 14.0 |
| **Total** | **152** | **56.0** | **36.8%** | **96.0** |

高收益主要来自 IaC、API/UI 脚手架、配置模板、测试样板等高模式化任务。收益受团队 AI 熟练度、代码评审吞吐、提示词质量和工具许可可用性影响；治理/安全/审批类任务仍以人工为主。由于 AI-led 口径按“人工评审+返工”计入，汇总中的 Net Human Effort 与承诺基线（80.8）存在口径差异是预期行为。

## Epic / Feature / Task Breakdown

### Phase 1 — Breakdown only

#### Epic E1 — Platform Foundation
- **E1-F1-T1 Bicep 仓库脚手架**
  - Objective: 建立可复用 IaC 模块骨架并通过构建校验。
  - Key activities: 模块分层；参数/输出定义；lint/build 校验。
- **E1-F1-T2 VNet/Subnet/NSG 模块**
  - Objective: 建立标准网络模块并可参数化复用。
  - Key activities: 网络模块实现；规则模板化；what-if 验证。
- **E1-F1-T3 Private DNS Zone 模块**
  - Objective: 完成私有 DNS 区域与链接配置模板。
  - Key activities: zone 创建；vNet link；解析测试。
- **E1-F1-T4 Front Door + WAF 模块**
  - Objective: 提供统一边缘接入与基础防护。
  - Key activities: Front Door 配置；WAF 策略；路由校验。

#### Epic E2 — OneDrive Ingestion Pipeline
- **E2-F1-T1 Graph Webhook 接收 Function**
  - Objective: 接收并标准化 OneDrive 变更事件。
  - Key activities: endpoint 实现；签名校验；事件归一化。
- **E2-F1-T2 Webhook 生命周期管理**
  - Objective: 保证订阅创建、续订、失效处理闭环。
  - Key activities: 订阅管理；续订任务；告警处理。
- **E2-F1-T3 Delta Query 兜底任务**
  - Objective: 在 webhook 缺失时确保增量一致性。
  - Key activities: delta 拉取；去重；补偿回放。
- **E2-F2-T1 Service Bus 拓扑 + DLQ**
  - Objective: 构建可扩展消息拓扑和异常通道。
  - Key activities: 队列/主题设计；DLQ；重试策略。

#### Epic E3 — LLM Orchestration & Quality Gate
- **E3-F1-T1 模型客户端抽象**
  - Objective: 统一 Chat/Embedding/Eval 调用接口。
  - Key activities: provider 抽象；路由器；错误处理。
- **E3-F1-T2 模型分级路由**
  - Objective: 按任务类型分配小/大/评估模型。
  - Key activities: 策略定义；路由实现；观察指标。
- **E3-F2-T1 Wiki 综合 Prompt 模板**
  - Objective: 生成结构化 Wiki 草稿与元数据。
  - Key activities: prompt 设计；约束注入；结果校验。
- **E3-F3-T1 评估器（事实/冲突/置信度）**
  - Objective: 提供质量门控并分流审批。
  - Key activities: 评分规则；阈值策略；审批路由。

#### Epic E4 — Wiki Store & Metadata
- **E4-F1-T1 Wiki 提交服务（PR/commit）**
  - Objective: 稳定写入版本化知识库。
  - Key activities: 提交策略；冲突处理；审计记录。
- **E4-F1-T2 Front matter 校验器**
  - Objective: 保证页面结构一致且可治理。
  - Key activities: schema 校验；字段约束；拦截机制。
- **E4-F2-T1 元数据表结构与迁移**
  - Objective: 落地核心数据模型。
  - Key activities: 表设计；migration；索引优化。
- **E4-F2-T2 审批状态机**
  - Objective: 建立可追溯审批流程。
  - Key activities: 状态流转；规则校验；事件记录。

#### Epic E5 — Retrieval & Q&A API
- **E5-F1-T1 检索索引 Schema（含 ACL）**
  - Objective: 支持混合检索与权限过滤。
  - Key activities: 字段设计；过滤字段；索引验证。
- **E5-F1-T2 向量化任务与缓存**
  - Objective: 提升向量化吞吐并降低重复成本。
  - Key activities: 批处理；缓存策略；回填机制。
- **E5-F2-T1 查询权限过滤注入**
  - Objective: 保证结果不越权。
  - Key activities: 组解析；过滤表达式；安全测试。
- **E5-F3-T1 API + APIM 策略**
  - Objective: 发布问答 API 并执行限流配额。
  - Key activities: 接口实现；APIM 策略；集成测试。

#### Epic E6 — Web Frontend
- **E6-F1-T1 前端骨架 + MSAL 登录**
  - Objective: 建立安全的 Web 应用入口。
  - Key activities: 项目骨架；MSAL 接入；路由保护。
- **E6-F2-T1 浏览/搜索界面**
  - Objective: 提供可用的 Wiki 浏览与检索体验。
  - Key activities: 列表与详情；搜索过滤；状态处理。
- **E6-F2-T2 流式问答与引用展开**
  - Objective: 支持带来源引用的问答体验。
  - Key activities: 聊天组件；流式渲染；引用面板。
- **E6-F3-T1 历史/归属/反馈界面**
  - Objective: 支持治理闭环与人工纠错。
  - Key activities: 历史视图；owner 交互；反馈提交流程。

#### Epic E7 — Governance, Approval & Audit
- **E7-F1-T1 审批通知工作流**
  - Objective: 审批事件稳定通知并可追踪。
  - Key activities: 通知渠道接入；重试；状态追踪。
- **E7-F2-T1 规则引擎（AGENTS 约束）**
  - Objective: 自动执行治理规则。
  - Key activities: 规则建模；执行引擎；违规报告。
- **E7-F3-T1 审计留存与导出**
  - Objective: 满足审计保留与导出要求。
  - Key activities: 保留策略；导出机制；完整性校验。
- **E7-F3-T2 ACL 红队测试**
  - Objective: 验证权限模型在对抗场景下的可靠性。
  - Key activities: 用例设计；渗透执行；修复闭环。

#### Epic E8 — Observability, Cost Guardrails & Operations
- **E8-F1-T1 OTel 接入 + 仪表板**
  - Objective: 打通核心链路可观测性。
  - Key activities: 打点；仪表板；告警定义。
- **E8-F2-T1 成本计量 + 月度熔断**
  - Objective: 成本可见且具保护机制。
  - Key activities: cost meter；阈值规则；熔断流程。
- **E8-F3-T1 DR 方案与演练**
  - Objective: 验证灾备恢复可执行。
  - Key activities: DR 设计；演练脚本；复盘。
- **E8-F3-T2 Runbook 与值班流程**
  - Objective: 建立运维响应标准动作。
  - Key activities: runbook 编制；值班机制；演练。

### Phase 2 — Estimation

| Task ID | Primary role | Supporting roles | Dependencies | Assumptions | Complexity | Optimistic | Likely (Gross) | Pessimistic | Risk buffer | Delivery Mode | AI Assistance Level | AI Tools Applicable | Estimated AI Savings | Human implementation effort | Human review effort | Human rework contingency | Human-Adjusted Likely | ⚠️ Needs Human Review? |
|---|---|---|---|---|---|---:|---:|---:|---|---|---|---|---|---:|---:|---:|---:|---|
| E1-F1-T1 | Consultant | Architect | Repo standards | 模块可复用 | M | 2 | 4 | 7 | 15% | AI-led (Human-reviewed) | High | Copilot, Cursor | 70% — IaC scaffolding repeatable | 0.8 | 0.4 | 0.2 | 1.4 | No |
| E1-F1-T2 | Consultant | Architect | E1-F1-T1 | 网络参数确定 | M | 2 | 4 | 7 | 20% | AI-led (Human-reviewed) | High | Copilot | 68% — rule template generation | 1.0 | 0.5 | 0.2 | 1.7 | No |
| E1-F1-T3 | Consultant | Architect | E1-F1-T2 | DNS 方案已定 | S | 1 | 3 | 5 | 15% | AI-led (Human-reviewed) | High | Copilot | 72% — repetitive DNS config | 0.7 | 0.4 | 0.1 | 1.2 | No |
| E1-F1-T4 | Consultant | Architect | E1-F1-T2 | WAF 基线可复用 | M | 2 | 4 | 7 | 20% | Human-led (AI-assisted) | Medium | Copilot, AI Chat | 35% — policy draft assist | 0.0 | 0.0 | 0.0 | 2.6 | Yes |
| E2-F1-T1 | Consultant | Architect | Graph consent | Graph webhook 可用 | M | 2 | 5 | 8 | 20% | Human-led (AI-assisted) | Medium | Copilot | 30% — endpoint scaffolding | 0.0 | 0.0 | 0.0 | 3.5 | Yes |
| E2-F1-T2 | Consultant | Architect | E2-F1-T1 | 续订策略明确 | M | 2 | 4 | 7 | 20% | AI-led (Human-reviewed) | High | Copilot | 67% — job templates | 1.0 | 0.6 | 0.2 | 1.8 | No |
| E2-F1-T3 | Consultant | Architect | E2-F1-T1 | delta token 稳定 | M | 2 | 4 | 7 | 20% | Human-led (AI-assisted) | Medium | Copilot | 30% — scheduler scaffolding | 0.0 | 0.0 | 0.0 | 2.8 | No |
| E2-F2-T1 | Consultant | Architect | E2-F1-T1 | Service Bus 已开通 | M | 2 | 5 | 9 | 20% | AI-led (Human-reviewed) | High | Copilot, AI Test Gen | 70% — queue/worker boilerplate | 1.1 | 0.7 | 0.3 | 2.1 | No |
| E3-F1-T1 | Architect | Consultant | E2-F2-T1 | 模型端点连通 | M | 2 | 5 | 8 | 20% | Human-led (AI-assisted) | Medium | Copilot | 30% — interface stubs | 0.0 | 0.0 | 0.0 | 3.5 | No |
| E3-F1-T2 | Architect | Consultant | E3-F1-T1 | 路由策略已确认 | M | 2 | 4 | 7 | 20% | Human-led (AI-assisted) | Medium | Copilot, AI Chat | 30% — config assist | 0.0 | 0.0 | 0.0 | 2.8 | Yes |
| E3-F2-T1 | Architect | Consultant | E3-F1-T2 | Prompt 约束已审 | L | 3 | 6 | 11 | 30% | Human-led (AI-assisted) | Low | AI Chat, AI Docs | 15% — drafting only | 0.0 | 0.0 | 0.0 | 5.1 | Yes |
| E3-F3-T1 | Architect | PM, Consultant | E3-F2-T1 | 评估样本可得 | L | 4 | 7 | 12 | 30% | Human-led (AI-assisted) | Low | AI Chat | 12% — rubric assist | 0.0 | 0.0 | 0.0 | 6.2 | Yes |
| E4-F1-T1 | Consultant | Architect | E3-F2-T1 | Git 后端决策完成 | M | 2 | 4 | 7 | 20% | AI-led (Human-reviewed) | High | Copilot | 70% — commit service skeleton | 1.0 | 0.7 | 0.3 | 2.0 | Yes |
| E4-F1-T2 | Architect | Consultant | E4-F1-T1 | schema 冻结 | M | 2 | 5 | 8 | 25% | Human-led (AI-assisted) | Low | AI Chat | 15% — rule draft support | 0.0 | 0.0 | 0.0 | 4.3 | Yes |
| E4-F2-T1 | Consultant | Architect | E1-F1-T1 | DB 基线存在 | M | 2 | 4 | 7 | 15% | AI-led (Human-reviewed) | High | Copilot, AI SQL Assist | 75% — migration template-heavy | 0.7 | 0.4 | 0.2 | 1.3 | No |
| E4-F2-T2 | Architect | PM, Consultant | E4-F2-T1 | 审批组映射已定 | M | 2 | 4 | 7 | 20% | Human-led (AI-assisted) | Medium | Copilot, AI Docs | 25% — state machine scaffold | 0.0 | 0.0 | 0.0 | 3.0 | Yes |
| E5-F1-T1 | Consultant | Architect | E2-F3-T1 | 索引 SKU 合规 | M | 2 | 4 | 7 | 20% | AI-led (Human-reviewed) | High | Copilot | 68% — schema boilerplate | 0.9 | 0.5 | 0.2 | 1.6 | No |
| E5-F1-T2 | Consultant | Architect | E5-F1-T1 | 向量预算可用 | M | 2 | 5 | 8 | 20% | Human-led (AI-assisted) | Medium | Copilot, AI Test Gen | 30% — batch pipeline assist | 0.0 | 0.0 | 0.0 | 3.5 | Yes |
| E5-F2-T1 | Architect | Consultant | E5-F1-T1 | 组声明可靠 | L | 3 | 5 | 9 | 30% | Human-led (AI-assisted) | Low | AI Chat, AI Review | 10% — review aid only | 0.0 | 0.0 | 0.0 | 4.5 | Yes |
| E5-F3-T1 | Consultant | Architect | E5-F2-T1 | APIM 策略仓存在 | M | 2 | 5 | 8 | 20% | AI-led (Human-reviewed) | High | Copilot, AI YAML | 70% — policy/controller generation | 1.2 | 0.8 | 0.3 | 2.3 | No |
| E6-F1-T1 | Consultant | Architect | E1-F2-T1 | 前端栈冻结 | M | 2 | 4 | 7 | 15% | AI-led (Human-reviewed) | High | Copilot, Cursor | 75% — shell/auth scaffolding | 0.8 | 0.6 | 0.2 | 1.6 | No |
| E6-F2-T1 | Consultant | Architect | E5-F3-T1 | API 契约稳定 | M | 2 | 5 | 8 | 20% | AI-led (Human-reviewed) | High | Copilot, Cursor | 78% — UI pattern reuse | 0.9 | 0.7 | 0.2 | 1.8 | No |
| E6-F2-T2 | Consultant | Architect | E3-F3-T1 | 流式接口稳定 | M | 3 | 6 | 10 | 20% | Human-led (AI-assisted) | Medium | Copilot, AI UI Assist | 35% — component generation | 0.0 | 0.0 | 0.0 | 3.9 | No |
| E6-F3-T1 | Consultant | PM | E4-F1-T1 | history API 就绪 | M | 2 | 4 | 7 | 20% | AI-led (Human-reviewed) | High | Copilot | 70% — standard admin UI | 1.0 | 0.6 | 0.2 | 1.8 | No |
| E7-F1-T1 | PM | Consultant | E4-F2-T2 | 通知渠道决策 | M | 2 | 4 | 7 | 20% | Human-led (AI-assisted) | Low | AI Chat, AI Docs | 15% — process drafts | 0.0 | 0.0 | 0.0 | 3.4 | Yes |
| E7-F2-T1 | Architect | PM, Consultant | 治理规则批准 | 策略边界明确 | L | 3 | 5 | 9 | 30% | Human-led (AI-assisted) | Low | AI Chat, AI Docs | 15% — text drafting | 0.0 | 0.0 | 0.0 | 4.3 | Yes |
| E7-F3-T1 | Architect | PM | 合规策略确认 | 保留期已批准 | M | 2 | 4 | 7 | 25% | Human-led (AI-assisted) | Low | AI Docs | 15% — config docs assist | 0.0 | 0.0 | 0.0 | 3.4 | Yes |
| E7-F3-T2 | Architect | PM, Consultant | E5-F2-T1 | 红队资源可用 | M | 2 | 5 | 9 | 30% | Human-led (AI-assisted) | None | — | 0% — human-only adversarial testing | 0.0 | 0.0 | 0.0 | 5.0 | Yes |
| E8-F1-T1 | Consultant | Architect | 核心服务已接入 | OTel 标准统一 | M | 2 | 5 | 8 | 20% | AI-led (Human-reviewed) | High | Copilot, AI Dashboard Assist | 65% — telemetry templates | 1.2 | 0.8 | 0.3 | 2.3 | No |
| E8-F2-T1 | Consultant | PM, Architect | 计费导出可用 | 标签完整性达标 | M | 2 | 4 | 7 | 20% | AI-led (Human-reviewed) | High | Copilot, AI Chat | 68% — meter/breaker scaffolding | 1.0 | 0.6 | 0.2 | 1.8 | Yes |
| E8-F3-T1 | Architect | PM, Consultant | 备份策略明确 | 可安排演练窗口 | M | 2 | 5 | 9 | 30% | Human-led (AI-assisted) | None | — | 0% — operational drill | 0.0 | 0.0 | 0.0 | 5.0 | Yes |
| E8-F3-T2 | PM | Architect, Consultant | E8-F3-T1 | 值班 owner 到位 | S | 1 | 3 | 5 | 20% | Human-led (AI-assisted) | Low | AI Docs, AI Chat | 15% — runbook drafting | 0.0 | 0.0 | 0.0 | 2.6 | Yes |

## Estimation Risks & Unknowns

### Top estimation risks
1. 查询时 ACL 过滤与派生内容一致性属于高风险安全路径，任何偏差都可能导致越权暴露。
2. 质量门控模型（事实一致性/冲突检测）对评估集与阈值敏感，易导致返工波动。
3. Graph/Entra/审批链路为外部依赖，等待时间会放大关键路径。
4. 大规模摄入下的限流与文档异构会拉高失败重试与运维负担。
5. 成本熔断阈值配置不当可能影响可用性或触发误降级。

### Top unknowns
1. Azure 区域、预算上限、CMK 强制范围。
2. Wiki 后端与 CI/CD 平台最终决策。
3. 审批组映射、通知渠道、审批 SLA。
4. 审计保留和 WORM 的强制等级。
5. 团队 AI 工具熟练度与可用 license 规模。

### Management note
本次已按新版口径将 AI-led 任务的人类投入显式拆分，估算更接近“AI 主交付、人工 review”的真实工作量。建议以 **80.8 人天** 作为当前承诺基线，并保留 `+20%` 日历缓冲以吸收审批与外部依赖不确定性。在 unknowns 未关闭前，不建议对外做固定单点承诺。
# 工作量估算 — 企业级 LLM 自维护知识库系统

> ⚠️ **Human review needed**
>
> 本文使用优化后的 `.github/prompts/estimate-work.prompt.md` 重新生成，输入为 `docs/requirements.md`、`docs/solution-design.md`、`docs/backlogs.md`。
> 因存在外部依赖与未决事项（区域、预算、审批组、CI/CD 最终平台、合规策略），部分任务标记 `⚠️ Needs Human Review = Yes`。

## Estimation Summary

本次重算覆盖 8 个 Epic 的实施主路径，共 32 个任务，严格分两阶段输出（先 Breakdown，再 Estimation）。项目总量为 **Optimistic 92 days / Likely (Gross) 152 days / Pessimistic 259 days**。在新口径下，AI-led 任务采用“人工执行 + 人工评审 + 人工返工预备”计入，避免了过去统一折扣导致的高估。结果为 **AI Savings 62.4 days**，**Human-Adjusted Likely 80.8 days**，较旧版 102.4 days 明显收敛。建议以 80.8 days 作为 AI Delivery 前提成立时的计划基线，同时保留 Gross 口径用于审计与对比。

## Role Summary Table
| Role        | Optimistic | Likely (Gross) | Pessimistic | AI Savings | Human-Adjusted Likely | Tasks (Human-led / AI-led) | Notes |
|-------------|-----------:|---------------:|------------:|-----------:|----------------------:|----------------------------:|-------|
| PM          | 7 days     | 12 days        | 20 days     | 2.0 days   | 9.8 days              | 4 / 2                       | Governance, approvals, coordination |
| Architect   | 29 days    | 48 days        | 82 days     | 16.2 days  | 28.6 days             | 8 / 5                       | Architecture, security, NFR, critical design decisions |
| Consultant  | 56 days    | 92 days        | 157 days    | 44.2 days  | 42.4 days             | 6 / 7                       | Implementation, integration, testing |
| **Total**   | **92 days**| **152 days**   | **259 days**| **62.4 days** | **80.8 days**      | **18 / 14**                 | Implied duration baseline: ~13–17 weeks (with dependency wait) |

> **Human-Adjusted Likely** is the recommended baseline for project planning and commitments. Gross Likely is retained for auditability.

## Estimation Method Note

- 对 **Human-led (AI-assisted)** 任务，`Human-Adjusted Likely = Likely × (1 − Estimated AI Savings %)`。
- 对 **AI-led (Human-reviewed)** 任务，`Human-Adjusted Likely = Human implementation effort + Human review effort + Human rework contingency`。
- 因此，AI-led 任务不再简单按 Gross 打折，而是按真实人工参与面估算，能更准确反映“AI 主交付、人工主审”的工作形态。

## AI Savings Summary
| Category | Gross Likely (days) | AI Savings (days) | Savings % | Net Human Effort (days) |
|----------|--------------------:|------------------:|----------:|------------------------:|
| High AI leverage tasks (Level: High) | 56 | 33.6 | ~60% avg | 22.4 |
| Medium AI leverage tasks (Level: Medium) | 58 | 23.2 | ~40% avg | 34.8 |
| Low AI leverage tasks (Level: Low) | 24 | 3.6 | ~15% avg | 20.4 |
| No AI leverage tasks (Level: None) | 14 | 0 | 0% | 14.0 |
| **Total** | **152** | **62.4** | **41.1%** | **89.6** |

最大节省来自 IaC、API/UI 脚手架、检索与数据接入的模式化实现任务；这些任务在 AI-led 模式下由人工 review 与定向返工主导。低节省任务集中在安全评审、治理决策、红队验证与 DR 演练。节省兑现仍依赖团队 AI 熟练度、评审吞吐、以及外部审批效率。

## Epic / Feature / Task Breakdown

### Phase 1 — Breakdown only

#### Epic E1 — Platform Foundation
- E1-F1-T1 IaC 模块脚手架
  - Objective: 建立可复用 Bicep 模块骨架并完成基础校验。
  - Key activities: 定义模块目录；参数/输出约定；lint/build 校验。
- E1-F1-T2 私有端点与 DNS
  - Objective: 核心数据面服务私网化。
  - Key activities: 配置私有端点；私有 DNS 绑定；连通性验证。
- E1-F2-T1 Entra 应用与身份基线
  - Objective: 完成 OIDC/权限/MI 最小可用闭环。
  - Key activities: 应用注册；权限配置；令牌与访问验证。
- E1-F3-T1 OIDC CI/CD 流水线
  - Objective: 建立无密钥部署与审批门禁。
  - Key activities: OIDC 配置；build/deploy 工作流；环境审批。

#### Epic E2 — OneDrive Ingestion
- E2-F1-T1 Graph Webhook 接收
  - Objective: 接收并校验 OneDrive 变更事件。
  - Key activities: endpoint 实现；校验机制；事件标准化。
- E2-F1-T2 Delta Query 兜底
  - Objective: 保障 webhook 漏失时的数据完整性。
  - Key activities: 定时补拉；去重；补偿回放。
- E2-F2-T1 Service Bus + 幂等 Worker
  - Objective: 建立可重试、可幂等摄入链路。
  - Key activities: 队列/DLQ；幂等键；重试策略。
- E2-F3-T1 文档提取与 OCR 适配
  - Objective: 打通多格式提取入口。
  - Key activities: Office/Markdown 提取；OCR 接入；统一输出。

#### Epic E3 — Orchestration & Quality Gate
- E3-F1-T1 模型路由抽象
  - Objective: 统一 Chat/Embedding/Eval 调用接口。
  - Key activities: provider 抽象；路由策略；超时重试。
- E3-F2-T1 Wiki 综合与引用注入
  - Objective: 生成结构化 Wiki 并强制来源引用。
  - Key activities: prompt 设计；引用注入；输出结构校验。
- E3-F3-T1 质量门控评估器
  - Objective: 建立一致性/冲突/置信度判定。
  - Key activities: 指标定义；阈值路由；人工审批分流。
- E3-F4-T1 查询编排与降级
  - Objective: 问答链路稳定并支持降级。
  - Key activities: 上下文拼装；流式输出；LLM 失败降级。

#### Epic E4 — Wiki Store & Metadata
- E4-F1-T1 Wiki 提交服务
  - Objective: 可靠写入版本化 Wiki。
  - Key activities: commit/PR 策略；冲突重试；变更记录。
- E4-F1-T2 Front matter 校验与合并策略
  - Objective: 保证结构一致与并发可控。
  - Key activities: schema 校验；合并规则；阻断非法提交。
- E4-F2-T1 元数据模型与迁移
  - Objective: 建立 pages/versions/approvals/audit 数据层。
  - Key activities: 表结构设计；迁移脚本；索引约束。
- E4-F2-T2 审批状态机
  - Objective: 形成可审计审批流转。
  - Key activities: 状态定义；流转规则；事件记录。

#### Epic E5 — Retrieval & API
- E5-F1-T1 检索索引与 ACL 字段
  - Objective: 建立可权限过滤的混合检索索引。
  - Key activities: 字段定义；filterable ACL；索引验证。
- E5-F1-T2 向量化与缓存
  - Objective: 提升向量化吞吐与复用。
  - Key activities: 批量 embedding；缓存策略；回填。
- E5-F2-T1 Query Permission Trimming
  - Objective: 保证检索结果不越权。
  - Key activities: 组解析；过滤注入；安全测试。
- E5-F3-T1 API + APIM 策略
  - Objective: 发布 ask/search/page API 并控流。
  - Key activities: API 实现；APIM 鉴权限流；接口测试。

#### Epic E6 — Web Frontend
- E6-F1-T1 前端壳与 MSAL 登录
  - Objective: 建立应用框架和身份闭环。
  - Key activities: 项目脚手架；登录接入；路由保护。
- E6-F2-T1 浏览与搜索 UI
  - Objective: 提供 Wiki 浏览检索体验。
  - Key activities: 列表详情；检索交互；过滤排序。
- E6-F2-T2 流式问答与引用 UI
  - Objective: 提供可追溯问答交互。
  - Key activities: 聊天组件；流式渲染；引用展开。
- E6-F3-T1 历史/归属/反馈 UI
  - Objective: 支持治理所需用户交互。
  - Key activities: 历史视图；Owner 操作；反馈提交。

#### Epic E7 — Governance & Audit
- E7-F2-T1 治理规则引擎
  - Objective: 自动化执行 AGENTS/治理规则。
  - Key activities: 规则建模；规则执行；违规报告。
- E7-F1-T1 审批通知流程
  - Objective: 审批事件可达并可追踪。
  - Key activities: 通知集成；失败重试；追踪链路。
- E7-F3-T1 审计保留与导出
  - Objective: 满足保留与导出合规要求。
  - Key activities: 保留策略；导出任务；校验。
- E7-F3-T2 ACL 红队验证
  - Objective: 验证权限链路无泄漏。
  - Key activities: 攻击用例设计；执行验证；修复闭环。

#### Epic E8 — Observability, Cost, Operations
- E8-F1-T1 OTel 与仪表板
  - Objective: 打通端到端可观测性。
  - Key activities: OTel 接入；仪表板；告警阈值。
- E8-F2-T1 成本计量与熔断
  - Objective: 建立可执行成本护栏。
  - Key activities: 日成本计量；阈值设置；熔断策略。
- E8-F3-T1 DR 策略与演练
  - Objective: 验证容灾恢复能力。
  - Key activities: DR 方案；演练执行；整改闭环。
- E8-F3-T2 Runbook 与值班流程
  - Objective: 建立稳定运维响应机制。
  - Key activities: Runbook 编写；值班流程；演练。

### Phase 2 — Estimation

| Task ID | Primary role | Supporting roles | Dependencies | Assumptions | Complexity | Optimistic | Likely (Gross) | Pessimistic | Risk buffer | Delivery Mode | AI Assistance Level | AI Tools Applicable | Estimated AI Savings | Human implementation effort | Human review effort | Human rework contingency | Human-Adjusted Likely | ⚠️ Needs Human Review? |
|---|---|---|---|---|---|---:|---:|---:|---|---|---|---|---|---:|---:|---:|---:|---|
| E1-F1-T1 | Consultant | Architect | Repo convention approved | 模块可复用模板存在 | M | 3 | 6 | 10 | 15% | AI-led (Human-reviewed) | High | Copilot, Cursor | 70% — IaC boilerplate 高复用 | 1.0 | 1.0 | 0.5 | 2.5 | No |
| E1-F1-T2 | Consultant | Architect | E1-F1-T1 | 网络规划已确认 | M | 2 | 4 | 7 | 20% | AI-led (Human-reviewed) | High | Copilot, AI Chat | 68% — PE/DNS 模式化配置 | 0.8 | 0.8 | 0.4 | 2.0 | No |
| E1-F2-T1 | Architect | Consultant, PM | Tenant admin consent | 管理员可在当期响应 | M | 2 | 5 | 9 | 25% | Human-led (AI-assisted) | Low | AI Chat, AI Docs | 15% — 文档准备加速 | 3.5 | 0.6 | 0.2 | 4.3 | Yes |
| E1-F3-T1 | Consultant | Architect | E1-F1-T1 | 平台与权限可用 | M | 2 | 4 | 7 | 15% | AI-led (Human-reviewed) | High | Copilot, AI YAML | 70% — CI 模板生成 | 0.8 | 0.8 | 0.4 | 2.0 | No |
| E2-F1-T1 | Consultant | Architect | E1-F2-T1 | Graph 权限可用 | M | 2 | 5 | 8 | 20% | Human-led (AI-assisted) | Medium | Copilot, AI Chat | 35% — endpoint 样板生成 | 2.7 | 0.6 | 0.2 | 3.5 | Yes |
| E2-F1-T2 | Consultant | Architect | E2-F1-T1 | delta token 行为可控 | M | 2 | 4 | 7 | 20% | AI-led (Human-reviewed) | High | Copilot | 68% — 定时任务模板化 | 0.9 | 0.7 | 0.4 | 2.0 | No |
| E2-F2-T1 | Consultant | Architect | E2-F1-T1 | Service Bus 已就绪 | M | 3 | 5 | 9 | 20% | AI-led (Human-reviewed) | High | Copilot, AI Test Gen | 70% — worker/retry 模式化 | 1.0 | 1.0 | 0.5 | 2.5 | No |
| E2-F3-T1 | Consultant | Architect | E2-F2-T1 | OCR 配额通过 | L | 3 | 6 | 10 | 20% | Human-led (AI-assisted) | Medium | Copilot, AI Chat | 30% — adapter scaffold | 3.0 | 0.9 | 0.3 | 4.2 | Yes |
| E3-F1-T1 | Architect | Consultant | E2-F3-T1 | 模型端点稳定 | M | 2 | 5 | 8 | 20% | Human-led (AI-assisted) | Medium | Copilot, AI Chat | 30% — 接口层辅助 | 2.8 | 0.5 | 0.2 | 3.5 | No |
| E3-F2-T1 | Architect | Consultant | E3-F1-T1 | Prompt 规则获批 | L | 3 | 6 | 11 | 30% | Human-led (AI-assisted) | Medium | AI Chat, AI Docs | 25% — 文案与结构草拟 | 3.6 | 0.7 | 0.2 | 4.5 | Yes |
| E3-F3-T1 | Architect | Consultant, PM | E3-F2-T1 | 评估数据集可用 | L | 4 | 7 | 12 | 30% | Human-led (AI-assisted) | Low | AI Chat, AI Docs | 15% — 指标草拟辅助 | 5.0 | 0.8 | 0.2 | 6.0 | Yes |
| E3-F4-T1 | Consultant | Architect | E5-F1-T1 | 搜索时延可接受 | M | 2 | 5 | 8 | 20% | Human-led (AI-assisted) | Medium | Copilot, AI Test Gen | 30% — orchestrator scaffold | 2.8 | 0.5 | 0.2 | 3.5 | No |
| E4-F1-T1 | Consultant | Architect | E3-F2-T1 | Wiki 后端策略明确 | M | 2 | 4 | 7 | 20% | AI-led (Human-reviewed) | High | Copilot | 65% — commit 流程模板 | 1.0 | 1.0 | 0.6 | 2.6 | Yes |
| E4-F1-T2 | Architect | Consultant | E4-F1-T1 | 元数据 schema 稳定 | M | 2 | 5 | 8 | 25% | Human-led (AI-assisted) | Low | AI Chat | 15% — 规则草拟辅助 | 3.6 | 0.5 | 0.2 | 4.3 | Yes |
| E4-F2-T1 | Consultant | Architect | E1-F1-T1 | DB 标准栈可用 | M | 2 | 4 | 7 | 15% | AI-led (Human-reviewed) | High | Copilot, AI SQL Assist | 70% — migration 模板化 | 0.7 | 0.8 | 0.5 | 2.0 | No |
| E4-F2-T2 | Architect | Consultant, PM | E4-F2-T1 | 审批角色映射完成 | M | 2 | 4 | 7 | 20% | Human-led (AI-assisted) | Medium | Copilot, AI Docs | 25% — 状态机骨架辅助 | 2.2 | 0.6 | 0.2 | 3.0 | Yes |
| E5-F1-T1 | Consultant | Architect | E2-F3-T1 | 索引 SKU 满足需求 | M | 2 | 4 | 7 | 20% | AI-led (Human-reviewed) | High | Copilot | 68% — schema 配置模板 | 0.8 | 0.8 | 0.4 | 2.0 | No |
| E5-F1-T2 | Consultant | Architect | E5-F1-T1 | embedding 预算可控 | M | 2 | 5 | 8 | 20% | Human-led (AI-assisted) | Medium | Copilot, AI Test Gen | 30% — pipeline scaffold | 2.8 | 0.5 | 0.2 | 3.5 | Yes |
| E5-F2-T1 | Architect | Consultant, Security | E5-F1-T1, E1-F2-T1 | group claim 准确可用 | L | 3 | 5 | 9 | 30% | Human-led (AI-assisted) | Low | AI Chat, AI Review | 10% — review support only | 3.9 | 0.5 | 0.1 | 4.5 | Yes |
| E5-F3-T1 | Consultant | Architect | E5-F2-T1 | APIM 策略仓可复用 | M | 2 | 5 | 8 | 20% | AI-led (Human-reviewed) | High | Copilot, AI YAML | 70% — API/policy 模板 | 1.0 | 1.1 | 0.7 | 2.8 | No |
| E6-F1-T1 | Consultant | Architect | E1-F2-T1 | 前端栈已选定 | M | 2 | 4 | 7 | 15% | AI-led (Human-reviewed) | High | Copilot, Cursor | 70% — shell/auth scaffold | 0.8 | 0.8 | 0.4 | 2.0 | No |
| E6-F2-T1 | Consultant | Architect | E5-F3-T1 | API 合约稳定 | M | 2 | 5 | 8 | 20% | AI-led (Human-reviewed) | High | Copilot, Cursor | 72% — 组件模板化 | 1.0 | 1.0 | 0.5 | 2.5 | No |
| E6-F2-T2 | Consultant | Architect | E3-F4-T1 | 流式接口稳定 | M | 3 | 6 | 10 | 20% | Human-led (AI-assisted) | Medium | Copilot, AI UI Assist | 35% — UI scaffold | 3.1 | 0.6 | 0.2 | 3.9 | No |
| E6-F3-T1 | Consultant | PM | E4-F1-T1 | 历史/审计接口可用 | M | 2 | 4 | 7 | 20% | AI-led (Human-reviewed) | High | Copilot | 65% — CRUD+view 模板 | 1.0 | 1.0 | 0.6 | 2.6 | No |
| E7-F2-T1 | Architect | Consultant, PM | Governance decisions | 规则目录可落地 | L | 3 | 5 | 9 | 30% | Human-led (AI-assisted) | Low | AI Chat, AI Docs | 15% — 规则文本辅助 | 3.6 | 0.6 | 0.1 | 4.3 | Yes |
| E7-F1-T1 | PM | Consultant | E4-F2-T2 | 通知渠道已定 | M | 2 | 4 | 7 | 20% | Human-led (AI-assisted) | Low | AI Chat, AI Docs | 15% — 模板草拟 | 2.8 | 0.5 | 0.1 | 3.4 | Yes |
| E7-F3-T1 | Architect | PM, Consultant | Security retention policy | 保留要求明确 | M | 2 | 4 | 7 | 25% | Human-led (AI-assisted) | Low | AI Docs | 15% — 配置文档辅助 | 2.8 | 0.5 | 0.1 | 3.4 | Yes |
| E7-F3-T2 | Architect | PM, Consultant | E5-F2-T1 | 安全团队排期可用 | M | 2 | 5 | 9 | 30% | Human-led (AI-assisted) | None | — | 0% — 红队验证人工主导 | 4.2 | 0.6 | 0.2 | 5.0 | Yes |
| E8-F1-T1 | Consultant | Architect | APIs/workers instrumentable | OTel 标准已确认 | M | 2 | 5 | 8 | 20% | AI-led (Human-reviewed) | High | Copilot, AI Dashboard Assist | 70% — 指标与看板模板 | 1.0 | 1.0 | 0.5 | 2.5 | No |
| E8-F2-T1 | Consultant | Architect, PM | Billing export enabled | 成本标签完整 | M | 2 | 4 | 7 | 20% | AI-led (Human-reviewed) | High | Copilot, AI Chat | 68% — meter/breaker 模板 | 0.9 | 0.8 | 0.5 | 2.2 | Yes |
| E8-F3-T1 | Architect | PM, Consultant | Backup policy/env ready | 演练窗口可安排 | M | 2 | 5 | 9 | 30% | Human-led (AI-assisted) | None | — | 0% — 演练为人工主导 | 4.1 | 0.6 | 0.3 | 5.0 | Yes |
| E8-F3-T2 | PM | Architect, Consultant | E8-F3-T1 | 值班 owner 明确 | S | 1 | 3 | 5 | 20% | Human-led (AI-assisted) | Low | AI Docs, AI Chat | 15% — runbook 起草辅助 | 2.2 | 0.3 | 0.1 | 2.6 | Yes |

## Estimation Risks & Unknowns

### Top estimation risks (<= 5)
1. 权限过滤与 ACL 继承链路是安全关键路径，任何偏差都可能导致越权暴露。
2. 质量门控评估器对样本集和阈值敏感，可能引起误判率波动。
3. Entra/Graph/安全审批等外部依赖带来排期抖动。
4. 大规模摄入下的 Graph 限流与异构文档失败重试可能放大成本与工期。
5. 成本熔断阈值设置不当可能影响高峰可用性。

### Top unknowns requiring resolution before commitment
1. Azure 目标区域、月度预算、CMK 强制边界。
2. Wiki 后端与 CI/CD 最终平台决策。
3. 审批组映射、通知渠道、审批 SLA。
4. 审计保留/WORM 与红队测试深度要求。
5. 团队 AI 工具熟练度与许可证容量。

### Management note
本版已按新方法把 AI-led 任务从“统一折扣”改为“人工评审/返工驱动”估算，更贴近 AI Delivery 实际投入。建议以 **80.8 days** 作为计划基线，并保留 15–25% 日历缓冲用于外部审批和跨团队等待。在 unknowns 未关闭前，不建议作为对外固定承诺。