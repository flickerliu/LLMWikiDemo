# 工作量估算 — 企业级 LLM 自维护知识库系统

> ⚠️ **Human review needed** — 本估算依据 [docs/requirements.md](requirements.md) 与 [docs/solution-design.md](solution-design.md)；解决方案设计 §16 的 14 项 **TBD**（Azure 区域、月度预算上限、Wiki 后端选型、CI/CD 平台、CMK 要求、敏感度分类、审批组、时间线节点、团队组成、试点业务单元、审计保留、通知渠道、OneDrive 应用级权限、元数据库选型）尚未关闭，多项任务标记 ⚠️ 需在签署前由业务/技术/信安负责人复核。
>
> 本文遵循 [.github/prompts/estimate-work.prompt.md](../.github/prompts/estimate-work.prompt.md) 的两阶段流程与输出契约：先完成 Epic/Feature/Task **拆解（Phase A）**，再为每个任务赋值角色、三点估算、AI 辅助字段、依赖、风险缓冲（Phase B），最后输出聚合表与叙述。
>
> **承诺基线**：以「Human-Adjusted Likely」作为排期与商务基线；Pessimistic 用于风险准备金测算；本文不提供单点承诺。

---

## Estimation Summary

本估算覆盖**两阶段交付**：**MVP（≤500 用户单业务单元试点，~6 个月）** + **Scale-out（推广至 5,000 用户，再 ~6 个月）**，共 13 个 Epic、69 个原子任务。**毛估 Likely 总量约 313 人天**（Optimistic 186 / Pessimistic 512），AI 辅助（GitHub Copilot、Cursor、AI Test Gen、AI Docs、AI Chat）预计可节省**约 94.8 人天（~30%）**，**人调整后 Likely 约 218 人天**——作为承诺与排期基线。三类角色拆分（人调整后）：PM ≈ 41 天、Architect ≈ 68 天、Consultant ≈ 110 天。**最大不确定来源**：质量门控双模型机制、双向链接图维护、查询时权限过滤红队验证、Azure OpenAI 配额与 Graph API 限流的规模化验证、§16 全部 TBD 项。**建议下一步**：解锁 §16 TBD 后启动 Foundation Platform 与 Identity 双轨并行；同时排队 Azure OpenAI 配额申请与信安/DPIA 评审（外部依赖均为关键路径）。

---

## Role Summary Table

| Role        | Optimistic | Likely (Gross) | Pessimistic | AI Savings | Human-Adjusted Likely | Notes |
|-------------|-----------:|---------------:|------------:|-----------:|----------------------:|-------|
| PM          | 31 天      | 50 天          | 82 天       | 9 天       | **41 天**             | 治理、TBD 跟进、UAT、推广、变更管理 |
| Architect   | 51 天      | 87 天          | 142 天      | 19 天      | **68 天**             | 架构设计、ADR、安全/合规决策、关键算法 Spike |
| Consultant  | 104 天     | 176 天         | 288 天      | 67 天      | **110 天**            | IaC、Pipeline 实施、前后端、测试、文档 |
| **Total**   | **186 天** | **313 天**     | **512 天**  | **95 天**  | **218 天**            |       |

> **Human-Adjusted Likely** = Likely × (1 − AI Savings %)，作为承诺与排期基线；Gross Likely 保留以备审计追溯。

### 隐含日历周期

**团队组成假设（⚠️ TBD §16 Q11）**：1×PM @ 50% FTE、1×Architect @ 60% FTE、4×Consultant（后端×2、前端×1、AI/数据×1）@ 70% FTE，复合 3.9 FTE 跨职能团队。

| 阶段 | 调整后人天 | 角色瓶颈 | 含依赖 / 评审 / 灰度的实际日历 |
|------|----------:|---------|------------------------------|
| MVP（E1–E12） | ~187 | Architect (~54 天 / 0.6 FTE ≈ 90 工作日 ≈ 18 周) | **22–26 周（约 5.5–6.5 个月）** ✓ 符合需求 6 个月 MVP 目标 |
| Scale-out（E13） | ~31 | PM 与 Architect 并行 | **8–12 周（约 2–3 个月）** |
| **总周期** | **~218** | — | **30–38 周（约 7–9 个月）** ✓ 在 12 个月全量目标内留有缓冲 |

> 周期推导按 Architect（瓶颈角色）容量 + 30% 依赖/审批/灰度等待时间估算；若团队 Copilot 熟练度不足，节省比例下调 30–50% 时，工期需相应延长 2–4 周。

---

## AI Savings Summary

| Category | Gross Likely (天) | AI Savings (天) | Savings % | Net Human Effort (天) |
|----------|-----------------:|----------------:|----------:|----------------------:|
| High AI leverage（Level: High） | 65  | 32.8 | ~50% avg | 32.2 |
| Medium AI leverage（Level: Medium） | 148 | 47.7 | ~32% avg | 100.3 |
| Low AI leverage（Level: Low） | 83  | 14.3 | ~17% avg | 68.7 |
| No AI leverage（Level: None） | 17  | 0    | 0%       | 17.0 |
| **Total** | **313** | **94.8** | **~30%** | **218.2** |

**节省最大集中**于：(1) Foundation Platform 的 Bicep / IaC 与 CI/CD 脚手架（Copilot 复用度极高）；(2) Next.js 前端组件、CRUD UI、流式问答界面；(3) Document Intelligence、AI Search、Service Bus 等 SDK 接入样板；(4) 测试用例与运维文档生成。**节省最低**集中于：质量门控评估模型逻辑、双向链接图算法、查询时 ACL 红队测试、DPIA / 合规审查 / 渗透测试 / 推广变更管理（均为人类判断主导）。**节省落地依赖**：(a) GitHub Copilot Business 与 AI Chat 已在团队内规模化部署；(b) 团队具备 Prompt 工程与 AI 代码审查熟练度；(c) 企业 Bicep / Next.js 模板可复用。**若团队 AI 经验有限，建议将节省比例统一下调 30–50%**（即净人工增加 28–48 天），并相应延长 MVP 工期 2–4 周。

---

## Epic / Feature / Task Breakdown

> 每个任务包含：Objective、Key activities、Primary / Supporting roles、Dependencies、Assumptions、Complexity、O / L / P 三点估算、Risk Buffer %、AI Level、AI Tools、AI Savings、Adj. Likely、⚠️ Needs Human Review。任务总数 **69 个**，分布在 13 个 Epic（MVP 12 个 + Scale-out 1 个）。

### Phase 1 — MVP（≤500 用户试点，目标 6 个月）

#### Epic 1 — 项目启动与 TBD 决议（Project Initiation & TBD Resolution）

| # | Task & Objective / Key Activities | Primary / Supporting | Complexity | O / L / P | Buffer | AI Level | AI Tools | AI Savings | Adj. Likely | ⚠️ |
|---|-----------------------------------|---------------------|:----------:|----------:|:------:|:--------:|----------|----------:|-----------:|:--:|
| 1.1 | **项目章程与启动会** —— 完成签署版章程、利益相关方矩阵、启动会。Activities: 章程起草；干系人识别与映射；启动会纪要；目标 / 范围 / 角色对齐。 | PM / Architect | S | 2 / 3 / 5 | 10% | Low | AI Chat | 15% — 模板与会议纪要起草 | 2.6 | No |
| 1.2 | **§16 全部 TBD 项决议** —— 关闭 14 项 TBD（区域、预算、Wiki/元数据库、CI/CD、CMK、敏感度、审批组、时间线、团队、试点 BU、审计、通知、Graph 权限）。Activities: 跟进会议；决策记录；待办看板。 | PM / Architect | M | 4 / 6 / 10 | 20% | Low | AI Chat | 15% — 摘要/差异分析 | 5.1 | **Yes**（多项外部依赖） |
| 1.3 | **关键 ADR 立项与撰写**（4 个：Wiki 后端、模型分级与提供商抽象、网络拓扑、元数据库选型）。Activities: 备选评估；权衡矩阵；ADR 草稿；评审会。 | Architect / Consultant | M | 3 / 5 / 8 | 15% | Medium | AI Chat, AI Docs | 30% — 文档结构化生成 | 3.5 | Yes |
| 1.4 | **项目治理框架** —— Sprint 节奏、变更控制、风险登记、状态报告模板、RAID 表。Activities: 模板搭建；初次基线发布。 | PM / — | S | 2 / 3 / 5 | 10% | Medium | AI Docs, AI Chat | 30% | 2.1 | No |

#### Epic 2 — Foundation Platform & Landing Zone

| # | Task & Objective / Key Activities | Primary / Supporting | Complexity | O / L / P | Buffer | AI Level | AI Tools | AI Savings | Adj. Likely | ⚠️ |
|---|-----------------------------------|---------------------|:----------:|----------:|:------:|:--------:|----------|----------:|-----------:|:--:|
| 2.1 | **Azure Landing Zone 接入与 Hub-Spoke 网络设计**。Activities: 订阅/资源组结构；VNet/子网；防火墙策略；DNS 规划。 | Architect / Consultant | M | 3 / 5 / 8 | 20% | Low | AI Chat | 15% | 4.3 | **Yes**（合规与区域 TBD） |
| 2.2 | **Bicep 模块库**（ACA env、Service Bus Premium、AI Search、Blob、Key Vault、PostgreSQL Flex、Doc Intelligence、Functions、APIM）。Activities: 模块化拆分；参数化；单元测试；what-if。 | Consultant / Architect | L | 6 / 10 / 16 | 15% | High | Copilot, AI Bicep gen | 55% — IaC 模板高度可复用 | 4.5 | No |
| 2.3 | **私有端点 + Private DNS 配置** —— 全部 PaaS 走私有端点。Activities: 私有 DNS 区域；vNet link；端点策略。 | Consultant / — | M | 2 / 4 / 7 | 20% | Medium | Copilot | 35% | 2.6 | No |
| 2.4 | **Azure Policy as Code**（区域白名单、私有端点强制、SKU 守护、Diagnostic Settings 必配、公网拒绝）。Activities: Initiative 设计；Bicep 部署；合规扫描。 | Architect / Consultant | M | 3 / 5 / 8 | 15% | Medium | Copilot, AI Chat | 35% | 3.3 | No |
| 2.5 | **Front Door + WAF + APIM 边缘接入**。Activities: WAF 规则；APIM 策略（鉴权、限流、配额）；私有源链路。 | Consultant / — | M | 3 / 5 / 8 | 15% | Medium | Copilot | 35% | 3.3 | No |
| 2.6 | **CI/CD 流水线**（GitHub Actions OIDC 联邦至 Azure，无密钥）。Activities: 工作流模板；环境矩阵；审批门控；制品管理。 | Consultant / — | M | 3 / 5 / 8 | 15% | High | Copilot, AI YAML | 50% | 2.5 | No |
| 2.7 | **Dev / Test / Prod 三环境置备与配置**。Activities: 参数化部署；App Configuration；Key Vault 引用；功能开关。 | Consultant / — | S | 2 / 3 / 5 | 10% | High | Copilot | 50% | 1.5 | No |

#### Epic 3 — Identity & Access（Entra ID）

| # | Task & Objective / Key Activities | Primary / Supporting | Complexity | O / L / P | Buffer | AI Level | AI Tools | AI Savings | Adj. Likely | ⚠️ |
|---|-----------------------------------|---------------------|:----------:|----------:|:------:|:--------:|----------|----------:|-----------:|:--:|
| 3.1 | **Entra ID 应用注册**（前端 SPA + 后端 API + 委托 Graph 权限范围 `Files.Read.All` / `User.Read` / `Sites.Read.All`）。Activities: App 注册；Scope 配置；重定向 URI。 | Architect / Consultant | S | 2 / 3 / 5 | 15% | Low | AI Chat | 20% | 2.4 | **Yes**（管理员同意外部依赖） |
| 3.2 | **管理员同意流程与租户审批** —— 走租户管理员同意工作流。Activities: 同意请求；条件访问对齐；租户审批跟进。 | PM / Architect | S | 1 / 2 / 4 | 25% | None | — | 0% | 2.0 | **Yes**（审批周期不可控） |
| 3.3 | **应用层 RBAC 设计与实现**（Wiki Admin / Editor / Approver / Reader 映射 Entra 组）。Activities: 角色矩阵；后端策略实现；测试。 | Architect / Consultant | M | 3 / 5 / 8 | 15% | Medium | Copilot, AI Chat | 30% | 3.5 | No |
| 3.4 | **MSAL 集成**（前端 PKCE + 后端 Bearer 验证 + 用户组缓存）。Activities: 前端登录态；后端 JWT 校验；组成员获取。 | Consultant / — | M | 3 / 5 / 8 | 15% | High | Copilot | 45% | 2.8 | No |

#### Epic 4 — Schema & Governance Layer

| # | Task & Objective / Key Activities | Primary / Supporting | Complexity | O / L / P | Buffer | AI Level | AI Tools | AI Savings | Adj. Likely | ⚠️ |
|---|-----------------------------------|---------------------|:----------:|----------:|:------:|:--------:|----------|----------:|-----------:|:--:|
| 4.1 | **AGENTS.md 规则集设计**（分类体系、命名规范、敏感规则、审批策略）。Activities: 规则起草；评审；版本化；Pipeline 强制点定义。 | Architect / Consultant | M | 3 / 5 / 8 | 20% | Medium | AI Chat, AI Docs | 30% | 3.5 | **Yes**（业务定义 TBD） |
| 4.2 | **Wiki 页面 Front-Matter Schema 与版本约定**。Activities: YAML schema；校验脚本；样例页面。 | Architect / — | S | 1 / 2 / 4 | 15% | Medium | AI Docs | 35% | 1.3 | No |
| 4.3 | **敏感度标签矩阵**（M365 Public/Internal/Confidential/Restricted → 系统行为映射：脱敏 / 排除 / 走专属审批）。 | Architect / PM | M | 2 / 4 / 6 | 25% | Low | AI Chat | 20% | 3.2 | **Yes**（合规 TBD §16 Q7） |
| 4.4 | **审批工作流定义**（PR + Reviewer 矩阵 + SLA + 通知）。 | PM / Architect | S | 2 / 3 / 5 | 15% | Low | AI Chat | 20% | 2.4 | **Yes**（审批组 TBD §16 Q8） |

#### Epic 5 — Ingest Pipeline（核心模块，最大风险面）

| # | Task & Objective / Key Activities | Primary / Supporting | Complexity | O / L / P | Buffer | AI Level | AI Tools | AI Savings | Adj. Likely | ⚠️ |
|---|-----------------------------------|---------------------|:----------:|----------:|:------:|:--------:|----------|----------:|-----------:|:--:|
| 5.1 | **Microsoft Graph 订阅 Webhook**（Azure Functions HTTP）。Activities: 订阅生命周期管理；签名校验；Service Bus 投递。 | Consultant / — | M | 2 / 4 / 7 | 20% | High | Copilot | 50% | 2.0 | No |
| 5.2 | **Delta Query 增量与全量回填策略**。Activities: Delta token 持久化；回填批处理；限流回退。 | Consultant / Architect | M | 3 / 5 / 8 | 20% | Medium | Copilot | 35% | 3.3 | **Yes**（Graph 限流） |
| 5.3 | **Service Bus 编排与幂等键设计**（`driveItemId@etag`）。Activities: 队列拓扑；分区；死信策略；幂等去重。 | Architect / Consultant | M | 3 / 5 / 8 | 20% | Medium | Copilot, AI Chat | 30% | 3.5 | No |
| 5.4 | **提取阶段** —— Office 原生解析 + Document Intelligence OCR（PDF/图片/扫描件）。 | Consultant / — | M | 3 / 5 / 8 | 15% | High | Copilot | 50% | 2.5 | No |
| 5.5 | **分类阶段（小模型路由）** —— 主题/实体抽取、是否纳入 Wiki、目标页面。 | Consultant / — | M | 2 / 4 / 6 | 15% | Medium | Copilot | 35% | 2.6 | No |
| 5.6 | **综合阶段（大模型）** —— 生成/更新 Wiki 页面 Markdown、双向链接生成、来源引用注入。 | Consultant / Architect | L | 5 / 8 / 13 | 25% | Medium | Copilot, AI Chat | 30% | 5.6 | **Yes**（核心复杂度） |
| 5.7 | **质量门控（评估模型）** —— 事实一致性、矛盾检测、置信度评分；低置信 / 敏感 → 人工审批队列。 | Architect / Consultant | L | 4 / 7 / 12 | 30% | Low | Copilot, AI Chat | 20% — 评估逻辑非标 | 5.6 | **⚠️ Yes**（核心算法 Spike） |
| 5.8 | **提交阶段** —— Git PR + AI Search 索引更新 + Metadata DB 写入。 | Consultant / — | M | 3 / 5 / 8 | 15% | Medium | Copilot | 35% | 3.3 | No |
| 5.9 | **失败/重试/死信/端到端幂等性** —— Service Bus 检查点、断点续跑、告警。 | Architect / Consultant | M | 3 / 5 / 8 | 20% | Medium | Copilot, AI Chat | 30% | 3.5 | Yes |
| 5.10 | **ACL 元数据捕获** —— 每分块 `aclGroupSids` 抽取与持久化（驱动查询时权限过滤）。 | Consultant / Architect | M | 2 / 4 / 7 | 25% | Low | Copilot | 20% | 3.2 | **⚠️ Yes**（安全核心） |

#### Epic 6 — Wiki Store & Versioning

| # | Task & Objective / Key Activities | Primary / Supporting | Complexity | O / L / P | Buffer | AI Level | AI Tools | AI Savings | Adj. Likely | ⚠️ |
|---|-----------------------------------|---------------------|:----------:|----------:|:------:|:--------:|----------|----------:|-----------:|:--:|
| 6.1 | **Azure DevOps Repos 仓库结构与分支策略**（main/staging/per-domain branches、保护规则）。 | Architect / Consultant | S | 1 / 2 / 4 | 15% | Medium | AI Chat | 30% | 1.4 | **Yes**（后端选型 TBD §16 Q3） |
| 6.2 | **Git PR 自动化**（机器人账号、合并策略、CI 钩子）。 | Consultant / — | S | 2 / 3 / 5 | 10% | High | Copilot | 50% | 1.5 | No |
| 6.3 | **PostgreSQL Flex 元数据/审计表 schema 与迁移**（pages、page_versions、approvals、ingest_jobs、audit_events、cost_meter_daily）。 | Consultant / — | M | 3 / 5 / 8 | 15% | High | Copilot | 50% | 2.5 | No |
| 6.4 | **双向链接图维护与一致性**（图算法、引用更新、孤儿检测）。 | Consultant / Architect | L | 4 / 7 / 12 | 25% | Medium | Copilot, AI Chat | 30% | 4.9 | **⚠️ Yes**（规模化下复杂度高） |

#### Epic 7 — Retrieval & Q&A

| # | Task & Objective / Key Activities | Primary / Supporting | Complexity | O / L / P | Buffer | AI Level | AI Tools | AI Savings | Adj. Likely | ⚠️ |
|---|-----------------------------------|---------------------|:----------:|----------:|:------:|:--------:|----------|----------:|-----------:|:--:|
| 7.1 | **AI Search 索引设计**（BM25 + 向量 + ACL 字段 + 敏感度 + Owner + lastUpdated）。 | Architect / Consultant | M | 2 / 4 / 6 | 15% | Medium | Copilot | 35% | 2.6 | No |
| 7.2 | **查询时权限过滤** —— `search.in(aclGroupSids, '<user groups>')` + 用户组缓存。 | Consultant / Architect | M | 3 / 5 / 8 | 20% | Low | Copilot, AI Chat | 20% | 4.0 | **⚠️ Yes**（安全核心，需红队验证） |
| 7.3 | **混合检索 + Wiki 图谱遍历上下文扩展**。 | Consultant / — | M | 4 / 6 / 10 | 20% | Medium | Copilot | 30% | 4.2 | Yes |
| 7.4 | **Azure OpenAI 流式问答 + 强制引用**（Prompt 模板、引用格式、流式回传）。 | Consultant / Architect | M | 3 / 5 / 8 | 15% | Medium | Copilot | 35% | 3.3 | No |
| 7.5 | **失败降级** —— LLM 不可用 → 退化为 Wiki 检索结果列表。 | Consultant / — | S | 1 / 2 / 3 | 10% | Medium | Copilot | 35% | 1.3 | No |

#### Epic 8 — Lint / Governance Workflows

| # | Task & Objective / Key Activities | Primary / Supporting | Complexity | O / L / P | Buffer | AI Level | AI Tools | AI Savings | Adj. Likely | ⚠️ |
|---|-----------------------------------|---------------------|:----------:|----------:|:------:|:--------:|----------|----------:|-----------:|:--:|
| 8.1 | **ACA Jobs 定时调度框架**（每日/每周扫描）。 | Consultant / — | S | 1 / 2 / 4 | 10% | High | Copilot | 50% | 1.0 | No |
| 8.2 | **时效检测与冲突识别逻辑**（与最新源文档比对、置信度更新）。 | Consultant / Architect | M | 3 / 5 / 8 | 25% | Medium | Copilot, AI Chat | 30% | 3.5 | Yes |
| 8.3 | **敏感更新审批工作流**（PR + Reviewer 矩阵通知）。 | Consultant / PM | M | 3 / 5 / 8 | 20% | Medium | Copilot | 30% | 3.5 | **Yes**（审批组 TBD） |
| 8.4 | **通知集成**（Graph sendMail + Teams 消息）。 | Consultant / — | S | 2 / 3 / 5 | 10% | High | Copilot | 50% | 1.5 | No |

#### Epic 9 — Frontend Web App

| # | Task & Objective / Key Activities | Primary / Supporting | Complexity | O / L / P | Buffer | AI Level | AI Tools | AI Savings | Adj. Likely | ⚠️ |
|---|-----------------------------------|---------------------|:----------:|----------:|:------:|:--------:|----------|----------:|-----------:|:--:|
| 9.1 | **Next.js 项目脚手架 + Entra OIDC PKCE 集成**。 | Consultant / — | S | 2 / 3 / 5 | 10% | High | Copilot, Cursor | 55% | 1.4 | No |
| 9.2 | **Wiki 浏览器**（分类树、全文/向量搜索、版本历史、来源溯源 UI）。 | Consultant / — | L | 5 / 8 / 13 | 15% | High | Copilot, Cursor | 50% | 4.0 | No |
| 9.3 | **Q&A 流式问答界面 + 引用展示**。 | Consultant / — | M | 3 / 5 / 8 | 15% | High | Copilot, Cursor | 50% | 2.5 | No |
| 9.4 | **人工审核操作台**（diff 视图、批准/拒绝/修改、审批队列）。 | Consultant / — | L | 4 / 7 / 11 | 20% | Medium | Copilot, Cursor | 35% | 4.6 | No |
| 9.5 | **页面所有权与元数据管理 UI**（Owner、敏感度、时效、置信度）。 | Consultant / — | M | 2 / 4 / 6 | 15% | High | Copilot, Cursor | 50% | 2.0 | No |
| 9.6 | **WCAG 2.1 AA 无障碍合规**（自动 + 人工评估、修复）。 | Consultant / — | S | 2 / 3 / 5 | 15% | Low | AI Chat | 20% | 2.4 | No |

#### Epic 10 — Observability、Cost Guardrails & Audit

| # | Task & Objective / Key Activities | Primary / Supporting | Complexity | O / L / P | Buffer | AI Level | AI Tools | AI Savings | Adj. Likely | ⚠️ |
|---|-----------------------------------|---------------------|:----------:|----------:|:------:|:--------:|----------|----------:|-----------:|:--:|
| 10.1 | **OpenTelemetry → App Insights 接入** + 结构化日志（含 requestId/userId/pageId/promptHash/tokenIn/tokenOut/modelDeployment）。 | Consultant / — | S | 2 / 3 / 5 | 10% | Medium | Copilot | 40% | 1.8 | No |
| 10.2 | **仪表板**（摄入延迟、查询 P50/P95、Token 成本、错误率、Graph 限流）。 | Consultant / — | M | 2 / 4 / 6 | 15% | Medium | Copilot, AI Chat | 35% | 2.6 | No |
| 10.3 | **告警规则**（积压、超阈、错误突增、预算 80%、Key Vault 过期）。 | Consultant / — | S | 1 / 2 / 4 | 10% | Medium | Copilot | 35% | 1.3 | No |
| 10.4 | **LLM 成本计量 + 月度上限 + 熔断器**（cost_meter_daily、租户级硬上限、熔断后摄入暂停 + 问答降级）。 | Consultant / Architect | M | 3 / 5 / 8 | 20% | Medium | Copilot | 30% | 3.5 | **Yes**（预算上限 TBD §16 Q2） |
| 10.5 | **审计日志保留 ≥12 个月 + 查询/导出能力**。 | Consultant / — | S | 2 / 3 / 5 | 15% | Medium | Copilot | 35% | 2.0 | **Yes**（审计 TBD §16 Q13） |

#### Epic 11 — Security & Compliance Validation

| # | Task & Objective / Key Activities | Primary / Supporting | Complexity | O / L / P | Buffer | AI Level | AI Tools | AI Savings | Adj. Likely | ⚠️ |
|---|-----------------------------------|---------------------|:----------:|----------:|:------:|:--------:|----------|----------:|-----------:|:--:|
| 11.1 | **DPIA（数据保护影响评估）** —— 与隐私办公室协同。 | Architect / PM | M | 3 / 5 / 8 | 25% | Low | AI Chat, AI Docs | 15% | 4.3 | **Yes**（合规外部依赖） |
| 11.2 | **信安评审 + 私有端点覆盖核验**。 | Architect / — | S | 2 / 3 / 5 | 15% | None | — | 0% | 3.0 | **Yes**（信安外部审批） |
| 11.3 | **权限过滤红队测试** —— 跨 ACL 越权场景；目标 0 越权。 | Architect / Consultant | M | 3 / 5 / 8 | 25% | None | — | 0% — 安全人工判断 | 5.0 | **⚠️ Yes**（安全核心） |
| 11.4 | **Azure Policy 合规扫描与整改**。 | Consultant / — | S | 1 / 2 / 4 | 15% | Medium | Copilot, AI Chat | 35% | 1.3 | No |
| 11.5 | **渗透测试**（外部供应商协调与执行）。 | PM / Architect | S | 2 / 3 / 5 | 30% | None | — | 0% | 3.0 | **Yes**（外部供应商） |

#### Epic 12 — MVP Pilot Cutover（≤500 用户单业务单元）

| # | Task & Objective / Key Activities | Primary / Supporting | Complexity | O / L / P | Buffer | AI Level | AI Tools | AI Savings | Adj. Likely | ⚠️ |
|---|-----------------------------------|---------------------|:----------:|----------:|:------:|:--------:|----------|----------:|-----------:|:--:|
| 12.1 | **试点 BU 数据迁移与初始全量索引** —— ≤500 用户、约 50 万源文件子集。 | Consultant / PM | M | 3 / 5 / 8 | 25% | Low | AI Chat | 15% | 4.3 | **Yes**（语料质量与 Graph 限流） |
| 12.2 | **用户验收测试（UAT）** —— 场景脚本、缺陷修复迭代、签署。 | PM / Consultant | M | 3 / 5 / 8 | 20% | Low | AI Chat | 15% | 4.3 | No |
| 12.3 | **试点培训 + 变更管理** —— 用户手册、培训、内部宣传。 | PM / — | M | 3 / 5 / 8 | 15% | Medium | AI Docs | 35% | 3.3 | No |
| 12.4 | **试点上线 + 早期生命体征监控 + 问题快速响应**。 | PM / Consultant | M | 2 / 4 / 6 | 20% | None | — | 0% | 4.0 | **Yes**（上线初期不可预知问题） |

**MVP 小计**：Optimistic ≈ 168 / Likely ≈ 273 / Pessimistic ≈ 446 / Adj. Likely ≈ **187 天**

---

### Phase 2 — Scale-out（推广至 5,000 用户，目标再 6 个月）

#### Epic 13 — Scale-out to 5,000 Users

| # | Task & Objective / Key Activities | Primary / Supporting | Complexity | O / L / P | Buffer | AI Level | AI Tools | AI Savings | Adj. Likely | ⚠️ |
|---|-----------------------------------|---------------------|:----------:|----------:|:------:|:--------:|----------|----------:|-----------:|:--:|
| 13.1 | **容量规划 + Azure OpenAI 配额扩容申请**。 | Architect / PM | M | 2 / 4 / 6 | 25% | Low | AI Chat | 15% | 3.4 | **Yes**（配额外部依赖） |
| 13.2 | **性能/负载测试** —— 验证 500 并发、20 QPS 持续 / 50 QPS 突发、P95 检索 < 1.5s、首 Token < 3s。 | Consultant / Architect | L | 4 / 7 / 12 | 25% | Medium | Copilot, AI Test Gen | 30% | 4.9 | **⚠️ Yes**（NFR 验证） |
| 13.3 | **摄入吞吐优化** —— 500 万文件初始全量索引（目标周级完成）。 | Architect / Consultant | L | 4 / 7 / 12 | 25% | Low | Copilot, AI Chat | 20% | 5.6 | **⚠️ Yes**（规模未经验证） |
| 13.4 | **DR 设计 + 演练**（跨区域被动备份；RTO ≤ 4h、RPO ≤ 1h）。 | Architect / Consultant | M | 4 / 6 / 10 | 25% | Low | AI Chat | 20% | 4.8 | **Yes** |
| 13.5 | **分波次推广**（按业务单元渐进上线、变更管理、反馈循环）。 | PM / Consultant | L | 5 / 8 / 13 | 20% | Low | AI Chat | 15% | 6.8 | **Yes**（组织变革） |
| 13.6 | **运营移交 + Runbook + 7×24 值班 + SLO 达成评估**。 | PM / Architect | M | 3 / 5 / 8 | 15% | Medium | AI Docs | 35% | 3.3 | No |
| 13.7 | **项目收尾、复盘与文档归档**。 | PM / — | S | 2 / 3 / 5 | 10% | Medium | AI Docs, AI Chat | 30% | 2.1 | No |

**Scale-out 小计**：Optimistic ≈ 24 / Likely ≈ 40 / Pessimistic ≈ 66 / Adj. Likely ≈ **31 天**

---

## Estimation Risks & Unknowns

### 五大估算风险（Top 5）

1. **质量门控双模型机制（5.7）** —— 评估模型阈值与拒绝策略需多轮迭代，实际工作量可能超出 30% 缓冲；建议 Sprint 0 立 PoC（2–3 天）先验证可行性，结果反向校准 5.6 / 5.7 估算。
2. **双向链接图维护（6.4）+ 规模下退化** —— Wiki 规模从 MVP 万级增长至 5–20 万页时，图遍历与一致性更新成本可能非线性；当前估算未含规模化重构余量，13.3 性能优化可能需追加 3–5 天。
3. **查询时权限过滤红队验证（7.2、11.3）** —— 任一红队场景出现越权即触发设计回炉；当前 11.3 仅 5 天 + 25% 缓冲，若发现系统性缺陷可能追加 5–10 天 + 二次评审。
4. **Azure OpenAI 配额 + Graph API 限流（13.1、5.2、12.1）** —— 区域 [TBD §16 Q1]、配额申请周期、Graph 限流策略均不可控；可能延误试点上线 2–6 周（不计入估算）。
5. **AI 节省落地不确定性** —— 估算假设团队 Copilot 熟练；若实际不达预期，节省比例下调 30–50%，净人工增加 28–48 天，对应 MVP 工期延长 2–4 周。

### 待解锁的关键未知项（阻塞最终承诺）

直接对应 [docs/solution-design.md §16](solution-design.md#16-待确认事项clarifying-questions)：

- **Q1** Azure 目标区域（数据驻留批准）
- **Q2** 月度预算上限（云 + LLM）
- **Q3** Wiki 后端选型（DevOps Repos vs Cosmos DB vs 其他）
- **Q4** 元数据库选型（PostgreSQL Flex vs Azure SQL）
- **Q5** CI/CD 平台（GitHub Actions vs Azure DevOps Pipelines）
- **Q6** CMK 强制要求范围
- **Q7** 敏感度标签分类与脱敏规则矩阵
- **Q8** 敏感/低置信度变更的审批组与 SLA
- **Q9** OneDrive 接入是否需应用级权限补充
- **Q10** MVP 上线日期与全量推广日期
- **Q11** 团队头数与外部顾问安排（本估算的关键假设）
- **Q12** 试点业务单元与文档形态典型性
- **Q13** 审计 12 个月是否满足合规 / 是否需 WORM
- **Q14** 通知优先 Teams / 邮件 / ITSM Webhook

### 高外部依赖任务清单

- **3.1 / 3.2** Entra 应用注册 + 管理员同意（IT/信安）
- **11.1 / 11.2 / 11.5** DPIA / 信安评审 / 渗透测试（隐私办公室、信安、外部供应商）
- **13.1** Azure OpenAI 配额扩容（Microsoft 容量审批）
- **5.2 / 12.1** Graph API 限流（Microsoft 服务侧）
- **2.1** Landing Zone 接入（企业云团队）

### 高不确定性任务清单（⚠️ Spike 优先）

- **5.7** 质量门控评估模型 — 算法 Spike 优先
- **6.4** 双向链接图维护 — 规模化复杂度未验证
- **7.2** 查询时权限过滤 — 安全核心，需红队闭环
- **11.3** 权限红队测试 — 任何越权 = 阻断 GA
- **13.3** 500 万文件初始全量索引 — 规模化未经验证

### 管理说明（Management Note）

本估算为**三点估算 + AI 调整后基线**，**不构成单点承诺**。**Human-Adjusted Likely（218 天）** 推荐作为内部排期与商务报价基线，并按团队 Copilot 熟练度按 ±20% 浮动；**Pessimistic（512 天）** 应用于风险准备金（建议 30–35% 准备金率）。所有标注 ⚠️ 的任务在进入对应 Sprint 前需完成业务/技术 Spike 重新评估；§16 全部 TBD 项须在 Foundation Platform Sprint 启动前关闭，否则估算需重新校准。MVP 完成后强烈建议召开复盘并基于实际生产率系数（Velocity Multiplier）更新 Scale-out 估算。

---

> **审查标记**：本估算在团队组成（§Role Summary）、Wiki 后端（6.1）、§16 全部 TBD、5.7 / 6.4 / 7.2 / 11.3 / 13.3 等关键算法与规模化任务处包含**假设或高不确定性**，须**业务、技术、信安负责人联合复核**后方可进入实施承诺阶段。
>
> 文档版本：v0.2（重写以对齐当前 [solution-design.md](solution-design.md)） · 创建日期：2026-05-13 · 状态：⚠️ 待复核
