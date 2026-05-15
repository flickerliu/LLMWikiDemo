# Backlog — 企业级 LLM 自维护知识库系统

> **状态：草案 — Human review needed**（标注 `⚑ HR` 的条目需人工 review/澄清）
> 来源：[requirements.md](requirements.md) + [solution-design.md](solution-design.md)
> 生成依据：`.github/prompts/create-backlog.prompt.md`

## Clarifications needed

1. ⚑ HR — Azure 目标区域 (TBD)。
2. ⚑ HR — 云+LLM 月度预算上限 (TBD)。
3. ⚑ HR — Wiki 后端 (Azure DevOps Repos vs. 其他) 与元数据库 (PostgreSQL Flex) 的最终批准。
4. ⚑ HR — CI/CD 平台 (GitHub Actions vs. Azure DevOps Pipelines)。
5. ⚑ HR — CMK 强制范围、敏感度分类/脱敏矩阵、审批组映射、试点业务单元、时间线节点、审计 WORM 要求、通知渠道（详见 [solution-design.md §16](solution-design.md)）。

未确认前，下列估算与切分基于 solution-design.md 的"假设"值；高不确定性项已标 ⚑ HR。

## Default assumptions

- 1 Epic / 主要能力域；2–5 Features/Epic；3–8 Tasks/Feature。
- 默认 owner：API/数据 = Backend Engineer；UI = Frontend Engineer；基础设施/CI = DevOps Engineer；架构/跨领域 = Tech Lead；AI 流水线 = AI/ML Engineer；安全/合规 = Security Engineer。
- 标签：`architecture` / `security` / `backend` / `frontend` / `ops` / `ai` / `data` / `needs-review`。

---

## Epic E1 — Platform Foundation（IaC、网络、身份、CI/CD）

- **Title**: Platform Foundation
- **Purpose**: 建立安全、可重复部署的 Azure 着陆区，作为后续所有服务的承载基线。
- **Scope**: Bicep 模块、Hub-Spoke 网络、Private Endpoint、Entra ID 应用注册、Key Vault、CI/CD、Azure Policy。
- **Acceptance Criteria**: Dev/Test/Prod 三套环境通过 IaC 一键部署；私有端点 100% 覆盖；Entra OIDC 登录可用；Policy 合规扫描通过。
- **Dependencies**: 区域批准、订阅就绪、Hub 网络可用。
- **Suggested owner role**: Tech Lead + DevOps Engineer
- **Markers**: ⚑ HR（区域、CI/CD 平台、CMK 决策）

### Feature E1-F1 — Landing Zone & 网络

- **Purpose**: 建立订阅、网络、私有端点拓扑。
- **Scope**: 资源组、VNet/Subnet、NSG、Private DNS Zone、Azure Firewall（如适用）、Front Door 接入。
- **Acceptance Criteria**: 公网仅 Front Door；所有数据面服务私有端点；DNS 解析正常。
- **Dependencies**: Hub 网络由企业网络组提供。
- **Suggested owner role**: DevOps Engineer
- **Labels**: `architecture`, `ops`, `security`

#### Tasks

| # | Title | Purpose | Scope | AC | Deps | Owner | AI-deliverable | Human review effort |
|---|-------|---------|-------|----|------|-------|----------------|---------------------|
| T1 | Bicep 仓库脚手架 | 建立模块化 IaC 结构 | repo + 模块骨架 + lint | `bicep build` 通过 | — | DevOps | Yes | ~30 min |
| T2 | VNet/Subnet/NSG 模块 | 标准化网络模块 | 子网划分、NSG 规则模板 | what-if 通过 Dev 部署 | T1 | DevOps | Yes | ~1 hr |
| T3 | Private DNS Zone 模块 | OpenAI/Search/PG/KV/Blob 私有 DNS | 各 zone + link | 解析测试通过 | T2 | DevOps | Yes | ~30 min |
| T4 | Front Door + WAF 模块 | 边缘接入 | Premium SKU、WAF 规则集 | 公网仅 FD 可达 | T2 | DevOps | Yes | ~1 hr |
| T5 | ⚑ HR Hub-Spoke 对等与 Firewall 规则评审 | 与企业网络组对齐 | 路由表/NVA 规则 | 网络评审签字 | T2 | Tech Lead | No — 需企业网络组协同 | Implementation: ~3 days; Review: ~2 hr |
| T6 | Azure Policy 集合（区域/PE/SKU/Diag） | 强制合规 | initiative + assignment | 合规扫描 100% | T2 | Security | Yes | ~1 hr |
| T7 | 跨环境参数化（Dev/Test/Prod） | 三环境一键部署 | parameters + pipeline | 三环境干跑通过 | T1–T6 | DevOps | Yes | ~1 hr |

### Feature E1-F2 — Entra ID 与密钥

- **Purpose**: 应用注册、委托权限、Managed Identity、Key Vault 一站式就绪。
- **Acceptance Criteria**: SSO 登录闭环；服务全部使用 MI；Key Vault 中无明文密钥外泄。
- **Suggested owner role**: Security Engineer
- **Labels**: `security`, `architecture`

#### Tasks

| # | Title | Purpose | AC | AI-deliverable | Human review effort |
|---|-------|---------|----|----------------|---------------------|
| T1 | Entra App Registration（Web + API） | OIDC + 委托 Graph 权限 | Token 流通过 | No — 需租户管理员同意 | Implementation: ~4 hr; Review: ~30 min |
| T2 | MSAL 前端集成示例 | PKCE 登录 | 登录回调通过 | Yes | ~30 min |
| T3 | API JWT 验证中间件 | 校验 Bearer Token | 单测覆盖 | Yes | ~30 min |
| T4 | Key Vault 模块 + Diagnostic | 集中密钥 | RBAC 模型生效 | Yes | ~30 min |
| T5 | Managed Identity 分配模板 | 服务到服务无密钥 | RBAC 校验脚本通过 | Yes | ~1 hr |
| T6 | ⚑ HR 委托/应用权限范围评审 | 与信安确认 | 信安签字 | No — 需信安评审 | Review: ~2 hr |

### Feature E1-F3 — CI/CD 与发布

- **Purpose**: 代码到 Prod 全自动 + 审批门控。
- **Acceptance Criteria**: PR → Dev 自动；Test/Prod 审批；OIDC 联邦无密钥。
- **Suggested owner role**: DevOps Engineer
- **Labels**: `ops`

#### Tasks

| # | Title | AI-deliverable | Human review effort |
|---|-------|----------------|---------------------|
| T1 | ⚑ HR 选定 CI/CD 平台（GH Actions vs ADO） | No — 决策项 | Decision: ~1 hr |
| T2 | 仓库分支策略 + PR 模板 | Yes | ~15 min |
| T3 | 容器构建 + ACR 推送流水线 | Yes | ~30 min |
| T4 | Bicep 部署流水线（Dev 自动） | Yes | ~45 min |
| T5 | Test/Prod 审批门 + what-if 报告 | Yes | ~1 hr |
| T6 | OIDC 联邦至 Azure | No — 需 Entra 管理员配置 | Implementation: ~2 hr; Review: ~30 min |

---

## Epic E2 — OneDrive Ingestion Pipeline

- **Purpose**: 建立事件驱动、幂等、可断点续跑的摄入流水线，将 OneDrive 文档转为 Wiki 候选。
- **Scope**: Graph Webhook、Service Bus、Container Apps Jobs、Document Intelligence、Delta Query、限流处理。
- **Acceptance Criteria**: P95 增量延迟 ≤ 1 h；干跑 ≥10 万文件无丢失；Graph 429 自动退避。
- **Dependencies**: E1-F2 Graph 权限、Service Bus & Document Intelligence 配额。
- **Suggested owner role**: Backend + AI/ML Engineer
- **Markers**: ⚑ HR — Graph 应用权限范围（如离线 Lint 需要）

### Feature E2-F1 — Graph 接入与变更感知

#### Tasks

| # | Title | AI-deliverable | Human review effort |
|---|-------|----------------|---------------------|
| T1 | Graph Webhook 接收 Function | Yes | ~45 min |
| T2 | Webhook 订阅生命周期（创建/续订/失效） | Yes | ~1 hr |
| T3 | Delta Query 兜底任务（Container Apps Job） | Yes | ~1 hr |
| T4 | DriveItem 元数据规范化 | Yes | ~30 min |
| T5 | Graph 限流与重试策略（exp backoff + per-driveId 并发） | Yes | ~1 hr |
| T6 | ⚑ HR 大规模订阅扩展性验证（5,000 用户） | No — 需联合测试 | Implementation: ~3 days; Review: ~2 hr |

### Feature E2-F2 — 消息总线与 Worker 编排

#### Tasks

| # | Title | AI-deliverable | Human review effort |
|---|-------|----------------|---------------------|
| T1 | Service Bus（Premium）拓扑：主题/队列/DLQ | Yes | ~30 min |
| T2 | 幂等键（`driveItemId@etag`）去重 | Yes | ~45 min |
| T3 | Container Apps Jobs 触发器与 KEDA 伸缩 | Yes | ~1 hr |
| T4 | 死信处理与重投工具 | Yes | ~45 min |
| T5 | 摄入作业 Checkpoint / Resume | Yes | ~1 hr |

### Feature E2-F3 — 提取、OCR 与分类

#### Tasks

| # | Title | AI-deliverable | Human review effort |
|---|-------|----------------|---------------------|
| T1 | Office (docx/xlsx/pptx) 原生解析器 | Yes | ~1 hr |
| T2 | Markdown / 纯文本提取器 | Yes | ~15 min |
| T3 | PDF / 图片走 Document Intelligence OCR | Yes | ~1 hr |
| T4 | 提取文本去重哈希 + Blob 落地 | Yes | ~45 min |
| T5 | 小模型分类/路由（主题/实体/Wiki 目标页面） | No — 需 Prompt 调优与基线评估 | Implementation: ~2 days; Review: ~3 hr |
| T6 | 不可处理（密码保护/超大）降级策略 | Yes | ~30 min |

---

## Epic E3 — LLM Orchestration & Quality Gate

- **Purpose**: 实现摄入综合、Lint、问答的 LLM 调度与质量护栏。
- **Acceptance Criteria**: ≥70% 步骤走小模型；评估模型可拦截事实不一致；置信度阈值生效。
- **Suggested owner role**: AI/ML Engineer + Tech Lead
- **Markers**: ⚑ HR — 模型分级配额、敏感度过滤矩阵

### Feature E3-F1 — 模型抽象与提供商层

| # | Title | AI-deliverable | Human review effort |
|---|-------|----------------|---------------------|
| T1 | 模型客户端抽象（Chat/Embedding/Eval） | Yes | ~1 hr |
| T2 | Azure OpenAI 私有端点接入 | Yes | ~30 min |
| T3 | 模型分级路由（小/大/评估） | Yes | ~1 hr |
| T4 | 重试/超时/熔断（Polly 等） | Yes | ~45 min |
| T5 | Token 计量与审计字段（modelDeployment/promptHash） | Yes | ~45 min |

### Feature E3-F2 — 综合（Summarize/Integrate）Pipeline

| # | Title | AI-deliverable | Human review effort |
|---|-------|----------------|---------------------|
| T1 | Wiki 页面综合 Prompt 模板（含 AGENTS.md 注入） | No — 需多轮迭代评估 | Implementation: ~3 days; Review: ~4 hr |
| T2 | 双向链接生成与图谱更新 | Yes | ~1 hr |
| T3 | 来源引用强制注入（front matter + 行内） | Yes | ~45 min |
| T4 | 增量合并（已有页 vs 新片段） | No — 复杂合并语义 | Implementation: ~2 days; Review: ~3 hr |

### Feature E3-F3 — 质量门控（Eval Model）

| # | Title | AI-deliverable | Human review effort |
|---|-------|----------------|---------------------|
| T1 | 评估器：事实一致性 / 矛盾 / 置信度 | No — 需评估集与基线 | Implementation: ~3 days; Review: ~4 hr |
| T2 | 阈值路由（自动通过/人工审批） | Yes | ~45 min |
| T3 | 评估指标导出 App Insights | Yes | ~30 min |
| T4 | ⚑ HR 抽样审计（≥200 页） | No — 需人工评审 | Review: ~2 days |

### Feature E3-F4 — 查询编排

| # | Title | AI-deliverable | Human review effort |
|---|-------|----------------|---------------------|
| T1 | Query Pipeline：检索 → 上下文拼装 → 大模型 | Yes | ~2 hr |
| T2 | 流式响应（SSE/HTTP streaming） | Yes | ~1 hr |
| T3 | 引用强制 + 答案模板 | Yes | ~1 hr |
| T4 | 降级策略（LLM 不可用 → 列表） | Yes | ~30 min |

---

## Epic E4 — Wiki Knowledge Store & 元数据

- **Purpose**: 版本化 Wiki 内容与元数据持久化。
- **Acceptance Criteria**: Wiki 页面 PR/版本可追溯；元数据查询性能满足 SLA。
- **Suggested owner role**: Backend Engineer
- **Markers**: ⚑ HR — Wiki 后端选型、PostgreSQL 批准

### Feature E4-F1 — Wiki Git 后端

| # | Title | AI-deliverable | Human review effort |
|---|-------|----------------|---------------------|
| T1 | ⚑ HR Wiki 后端选型 ADR | No — 决策 | Decision: ~1 day; Review: ~2 hr |
| T2 | Git 仓库结构 + 分类目录约定 | Yes | ~1 hr |
| T3 | Wiki 提交服务（PR/直接 commit 模式开关） | Yes | ~2 hr |
| T4 | Front matter 校验器 | Yes | ~1 hr |
| T5 | 冲突合并策略（同页并发更新） | No — 需评审策略 | Implementation: ~1 day; Review: ~2 hr |

### Feature E4-F2 — 元数据库 PostgreSQL

| # | Title | AI-deliverable | Human review effort |
|---|-------|----------------|---------------------|
| T1 | PostgreSQL Flex（HA + 私有端点）部署 | Yes | ~1 hr |
| T2 | 表结构：pages/page_versions/approvals/ingest_jobs/audit_events/cost_meter_daily | Yes | ~1 hr |
| T3 | 数据访问层 + 迁移工具 | Yes | ~1 hr |
| T4 | 备份 / Geo-Backup 配置 | No — 涉及 DR 演练前置 | Implementation: ~4 hr; Review: ~1 hr |

---

## Epic E5 — Hybrid Retrieval & Q&A API

- **Purpose**: AI Search 混合检索 + 查询时权限过滤 + 公开 Q&A API。
- **Acceptance Criteria**: P95 检索 < 1.5 s；权限过滤红队 0 越权；首 Token < 3 s。
- **Suggested owner role**: Backend + AI/ML Engineer

### Feature E5-F1 — AI Search 索引

| # | Title | AI-deliverable | Human review effort |
|---|-------|----------------|---------------------|
| T1 | 索引 Schema（含 `aclGroupSids`、向量字段） | Yes | ~1 hr |
| T2 | 索引器/数据源（来自 Blob + DB） | Yes | ~1 hr |
| T3 | 向量化任务（批量 Embedding + 缓存） | Yes | ~1 hr |
| T4 | 重建/回填脚本 | Yes | ~1 hr |

### Feature E5-F2 — 权限过滤

| # | Title | AI-deliverable | Human review effort |
|---|-------|----------------|---------------------|
| T1 | 用户 Entra 组解析 + 缓存 | Yes | ~1 hr |
| T2 | `search.in()` 过滤注入 | Yes | ~30 min |
| T3 | 摄入侧 ACL 快照与刷新 | Yes | ~1 hr |
| T4 | ⚑ HR 红队越权测试 | No — 需安全团队 | Review: ~1 day |

### Feature E5-F3 — Q&A API

| # | Title | AI-deliverable | Human review effort |
|---|-------|----------------|---------------------|
| T1 | REST API（`/ask`、`/pages/{id}`、`/search`） | Yes | ~2 hr |
| T2 | APIM 鉴权 + 限流 + 配额 | Yes | ~1 hr |
| T3 | 审计字段写入（promptHash/model/userId） | Yes | ~45 min |
| T4 | 负载测试脚本（500 并发 / 50 QPS 突发） | Yes | ~1 hr |

---

## Epic E6 — Web Frontend

- **Purpose**: 提供浏览/搜索/问答/引用/历史/所有权 UI。
- **Acceptance Criteria**: WCAG 2.1 AA；P50 页面加载 < 500 ms；现代浏览器最近两版兼容。
- **Suggested owner role**: Frontend Engineer

### Feature E6-F1 — 应用骨架 & 登录

| # | Title | AI-deliverable | Human review effort |
|---|-------|----------------|---------------------|
| T1 | 框架脚手架（React/Vite 等，按企业前端栈） | Yes | ~1 hr |
| T2 | MSAL 登录 + Token 注入 | Yes | ~1 hr |
| T3 | 路由 + 布局 + 设计系统接入 | Yes | ~2 hr |
| T4 | A11y 基线（语义/对比度/键盘） | Yes | ~2 hr |

### Feature E6-F2 — 浏览 / 搜索 / 问答

| # | Title | AI-deliverable | Human review effort |
|---|-------|----------------|---------------------|
| T1 | 页面渲染（Markdown + front matter 可视化） | Yes | ~2 hr |
| T2 | 全文/向量搜索 UI + 过滤器 | Yes | ~2 hr |
| T3 | 问答会话 UI（流式 + 引用展开） | Yes | ~3 hr |
| T4 | 时效徽章 / 置信度 / "人工审核通过"标记 | Yes | ~1 hr |
| T5 | 变更历史 / Diff 查看 | Yes | ~2 hr |

### Feature E6-F3 — 所有权与反馈

| # | Title | AI-deliverable | Human review effort |
|---|-------|----------------|---------------------|
| T1 | 页面 Owner 视图与认领 | Yes | ~1 hr |
| T2 | 反馈/纠错入口 → 工单 | Yes | ~1 hr |
| T3 | 用户偏好（订阅、最近浏览） | Yes | ~1 hr |

---

## Epic E7 — Governance, Approval & Audit

- **Purpose**: 敏感/低置信变更审批、AGENTS.md 治理、审计留存。
- **Acceptance Criteria**: 审批 SLA 内闭环；AGENTS.md 违规可被拦截；审计日志 ≥ 12 个月可查。
- **Suggested owner role**: Tech Lead + Security Engineer
- **Markers**: ⚑ HR — 审批组、敏感度矩阵、审计 WORM

### Feature E7-F1 — 审批工作流

| # | Title | AI-deliverable | Human review effort |
|---|-------|----------------|---------------------|
| T1 | 审批数据模型 + 状态机 | Yes | ~1 hr |
| T2 | PR 触发的审批通知（Graph sendMail / Teams） | Yes | ~1 hr |
| T3 | 审批 UI（列表/详情/通过/驳回） | Yes | ~2 hr |
| T4 | ⚑ HR 审批组映射与 SLA | No — 业务流程定义 | Decision + Implementation: ~2 days |

### Feature E7-F2 — Schema / AGENTS.md 治理

| # | Title | AI-deliverable | Human review effort |
|---|-------|----------------|---------------------|
| T1 | AGENTS.md 仓库与版本化 | Yes | ~30 min |
| T2 | Pipeline 内 Lint 规则执行器 | Yes | ~2 hr |
| T3 | 违规报告 → 页面/Owner | Yes | ~1 hr |
| T4 | 治理评审节奏（Runbook） | No — 流程文档 | Implementation: ~4 hr; Review: ~1 hr |

### Feature E7-F3 — 审计与日志保留

| # | Title | AI-deliverable | Human review effort |
|---|-------|----------------|---------------------|
| T1 | 审计事件 schema + 写入 | Yes | ~1 hr |
| T2 | Log Analytics 长期保留 + 导出 | Yes | ~45 min |
| T3 | ⚑ HR WORM/不可变存储评估 | No — 合规决策 | Decision: ~1 day |

---

## Epic E8 — Observability, Cost Guardrails & Operations

- **Purpose**: 全链路可观测性、Token 成本护栏、SLO/告警/Runbook。
- **Acceptance Criteria**: 关键 SLO 仪表化；月度 Token 上限熔断器演练通过；DR 演练 RTO ≤ 4 h / RPO ≤ 1 h。
- **Suggested owner role**: DevOps + Tech Lead
- **Markers**: ⚑ HR — 月度预算上限

### Feature E8-F1 — 遥测与告警

| # | Title | AI-deliverable | Human review effort |
|---|-------|----------------|---------------------|
| T1 | OpenTelemetry SDK 接入（API/Worker/Function） | Yes | ~2 hr |
| T2 | 结构化日志字段标准 | Yes | ~30 min |
| T3 | App Insights 仪表板（摄入/查询/成本/错误） | Yes | ~2 hr |
| T4 | 告警规则集（P95、错误率、Token 80%、KV 过期） | Yes | ~1 hr |

### Feature E8-F2 — LLM 成本护栏

| # | Title | AI-deliverable | Human review effort |
|---|-------|----------------|---------------------|
| T1 | 每日成本计量任务 + `cost_meter_daily` | Yes | ~1 hr |
| T2 | 租户月度上限熔断器 | Yes | ~1 hr |
| T3 | 模型分级强制（≥70% 小模型）校验 | Yes | ~1 hr |
| T4 | Embedding 缓存 + 批量调用 | Yes | ~1 hr |
| T5 | ⚑ HR 月度预算与告警阈值确认 | No — 财务/管理层决策 | Decision: ~2 hr |

### Feature E8-F3 — DR / 运维 Runbook

| # | Title | AI-deliverable | Human review effort |
|---|-------|----------------|---------------------|
| T1 | DR 设计文档 + 跨区域备份 | No — 架构评审 | Implementation: ~2 days; Review: ~3 hr |
| T2 | DR 演练脚本与报告 | No — 需联合演练 | Implementation: ~3 days; Review: ~4 hr |
| T3 | 值班 Runbook（摄入/查询/Graph 限流/成本熔断） | Yes | ~3 hr |
| T4 | 灰度发布流程（Container Apps revisions） | Yes | ~1 hr |

---

## Cross-cutting markers

- **Blockers**: 区域批准（影响 E1, E2, E3, E5, E8）；月度预算（E8）；Wiki 后端选型（E4）。
- **External dependencies**: 企业网络组（E1-F1 T5）、信安/合规（E1-F2 T6, E5-F2 T4, E7-F3 T3）、Entra 管理员（E1-F2 T1, E1-F3 T6）。
- **Architecture review gates**:
  - 在 E1-F1 完成后冻结网络拓扑。
  - 在 E4-F1 T1 决策后冻结 Wiki 后端。
  - 在 E3-F2/F3 完成基线评估后冻结模型分级与 Prompt 模板。
  - 在 E8-F3 T2 演练通过后才允许 5,000 用户全量推广。
