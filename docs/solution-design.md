# 企业级 LLM 自维护知识库系统 —— 解决方案设计

> **状态：草案 — 需人工审核（Human review needed）**
> 本文基于 [docs/requirements.md](requirements.md) 与 [docs/Enterprise LLM Wiki System Research Report.md](Enterprise%20LLM%20Wiki%20System%20Research%20Report.md)（Karpathy LLM 自维护 Wiki 范式）撰写，遵循 `.github/prompts/solution-design.prompt.md` 输出规范。
> 文中标注 **TBD** 或 **假设** 的项目须在架构评审前由干系人确认（详见 §12 待确认事项）。

---

## 1. 执行摘要（Executive Summary）

- 构建一套基于 Microsoft Azure 的企业内部 Web 应用，作为组织"企业大脑（Company Brain）"，将 OneDrive for Business 中散落的文档持续编译为结构化、交叉链接、低矛盾的 LLM 自维护 Wiki。
- 架构对齐 Karpathy 三层模型：**原始素材层（OneDrive 镜像/索引） → Wiki 知识库层（版本化 Markdown） → Schema/治理层（AGENTS.md 风格规则）**，由 LLM Agent 驱动 *摄入 / 查询 / Lint* 三大工作流。
- 关键技术选择：**Azure Container Apps** 承载 Web/API 与 Pipeline Worker、**Service Bus** 解耦事件驱动摄入、**Azure AI Search** 提供 BM25+向量混合检索、**Azure OpenAI（私有端点）** 分级模型路由（≥70% 走小模型）、**Azure DevOps Repos（Git）** 作为 Wiki 版本化后端、**PostgreSQL Flex** 存储元数据与审计、**Microsoft Entra ID + 委托 Graph 权限** 实现端到端身份与查询时权限过滤（Permission Trimming）。
- 安全与合规优先：私有端点 + 区域锁定 + 托管标识 + Key Vault + 敏感度标签感知过滤；月度 Token 熔断器与小模型路由约束 LLM 成本。
- 路线图：**MVP（≤500 用户试点）≈6 个月** → **5,000 用户全量 ≈12 个月**；多项 TBD（区域、预算、Wiki 后端正式批准）须先行确认。

---

## 2. 背景（Background）

- 企业知识散落于 OneDrive、邮件、Teams、Office 文档中；传统 RAG 每次从头检索，无跨文档持久记忆，无"知识复利"。
- 人工 Confluence/Wiki 维护成本远超产出，最终沦为"知识坟场"；多文档矛盾导致问答不一致；个人知识孤岛在人员流动时形成断层。
- 受影响群体：约 **5,000 名知识工作者**、新员工、业务负责人、合规/风险团队。
- 现状：OneDrive for Business 是事实文档存储；Microsoft Entra ID 已联邦化；M365 + Graph API 可用；员工正以未受治理方式个人化使用消费级 GenAI。
- 机遇：采用 Karpathy "LLM 自维护 Wiki" 范式，让每次交互沉淀为可复用知识，而非一次性检索。

---

## 3. 目标（Objective）

承接需求 §2，量化目标如下：

- 内部知识查询**平均响应时间较现有内网/RAG 缩短 ≥ 50%**。
- **≥ 90%** 日常 Wiki 维护（摘要、交叉链接、矛盾标记、时效检查）由 LLM Agent 自动完成。
- Wiki 与 OneDrive 源文档的**事实一致性 ≥ 95%**（抽样审计）。
- 首年覆盖 **5,000 名活跃用户**，每用户最多 **1,000 个**源文件（合计约 **500 万**份）。
- 通过 Entra ID + 区域锁定服务落实身份管控、访问控制、可审计性与数据驻留。

---

## 4. 范围（Scope）

**范围内：**

- Web 前端（浏览/搜索/问答/引用/历史/页面所有权）。
- 身份与访问管理（Entra ID OIDC、SSO、MFA、条件访问、RBAC）。
- 数据摄入（Microsoft Graph 委托权限接入 OneDrive；docx/xlsx/pptx/PDF/Markdown/纯文本/图片 OCR）。
- LLM 编排层（Ingest / Query / Lint 工作流）。
- Wiki 知识库（结构化 Markdown，含双向链接、版本控制、元数据：负责人/时效/来源/敏感度/置信度）。
- 检索层（BM25 + 向量 + 图谱遍历，按用户权限过滤）。
- 治理模块（所有权、敏感更新审批、审计日志、矛盾/时效报告、Schema 配置）。
- 运营支撑（遥测、监控、告警、LLM 成本管控）。

---

## 5. 不在范围内（Out of Scope）

- 面向外部客户的公开访问；非 OneDrive 连接器（SharePoint 站点、Confluence、Jira、Slack、GitHub、邮件）。
- 回写或修改 OneDrive 源文件（系统对源只读）。
- 原生移动端应用；Wiki 实时多人协同编辑；手动创作（二期）。
- 基础模型微调或企业数据训练；多语言翻译/跨语言综合。
- 替代 OneDrive、HR、ERP 作为记录来源（系统是派生层）。
- 使用非 Microsoft / 非 Azure 托管的 LLM 端点。

---

## 6. 假设（Assumptions）

- Entra ID 租户已联邦化，目标用户可 SSO；M365 许可证可访问 Graph/OneDrive。
- 所选 Azure 区域内 Azure OpenAI 容量配额可申请获批。
- 用户接受**最终一致性**：源文件变更在数分钟到数小时内反映到 Wiki。
- 人工审核人员可参与敏感/低置信度 Wiki 变更审批。
- Wiki 内容均派生自请求用户已有权访问的源文件——系统**执行**而非**扩大**现有 OneDrive 权限。
- 稳态 Wiki 规模 5 万–20 万页；源文件平均 ≤ 数 MB，超大或专有二进制文件降级为元数据索引。
- 无气隙（Air-gapped）部署需求；Azure → Graph、Azure OpenAI 网络连通正常。

---

## 7. 约束条件（Constraints）

- **云**：仅限 Azure；**身份**：仅 Entra ID（OIDC/OAuth 2.0）；**LLM**：仅 Azure OpenAI / Azure AI Foundry 托管模型，禁用消费级端点。
- **OneDrive 接入**：默认**委托权限**，保留每用户 ACL；如需应用级权限须信安审批。
- **数据驻留**：企业数据、Embedding、LLM Prompt/Response 日志须保留在批准的 Azure 地理区域（**TBD**）。
- **规模**：5,000 命名用户 / 500 万源文件，预留扩展至 10,000 用户。
- **预算**：云 + LLM 月度上限（**TBD**）；强制成本管控（小模型路由、批量 Embedding、缓存、熔断器）。
- **时间线**：MVP ≈6 个月、全量 ≈12 个月（**具体日期 TBD**）。
- **合规**：GDPR 等价数据保护、内部数据分级、审计要求。

---

## 8. 当前状态（Current State）

- OneDrive 为事实文档存储；内网门户搜索精准度低、结果陈旧。
- 个人化使用消费级 GenAI 工具，无治理、无企业数据落地、回答不一致。
- 无机器维护的结构化知识层；部落知识散落于聊天与个人文件夹。
- Entra ID 已就绪；M365/Graph 可用。

---

## 9. 目标状态（Target State）

云原生分层架构（与 Karpathy 模型对齐）：

1. **原始素材层**：Graph 委托权限只读镜像/索引 OneDrive；增量刷新（Delta Query + 变更通知）；源文件保留在 OneDrive，本系统仅存提取文本、元数据、Embedding。
2. **Wiki 知识库层**：版本化 Markdown 页面（主题/实体/索引/FAQ），双向链接，含元数据。
3. **Schema/治理层**：AGENTS.md 风格规则（分类体系、命名规范、敏感规则、审批策略），约束 LLM 行为。

---

## 10. 方案设计（Proposed Solution）

### 10.1 架构总览

逻辑视图（自上而下）：

```
[ 用户浏览器 ]
        │  HTTPS (OIDC via Entra ID)
        ▼
[ Azure Front Door + WAF ]
        ▼
[ Web Frontend (Container Apps) ]──┐
        │                            │
        ▼                            │
[ API Gateway (APIM) ]               │
        ▼                            │
[ Query / Wiki API (Container Apps) ]│
        │                            │
        ├──► [ Azure AI Search ] (BM25 + 向量 + ACL 过滤)
        ├──► [ Wiki Store: Azure DevOps Repos (Git) ]
        ├──► [ Metadata DB: PostgreSQL Flex ]
        └──► [ Azure OpenAI (Private Endpoint) ]
                         ▲
                         │
[ Ingestion Pipeline ]   │
  Graph Webhook (Functions)
  → Service Bus
  → Container Apps Jobs (Workers)
      ├─ Extract / OCR (Document Intelligence)
      ├─ Classify / Route (small model)
      ├─ Summarize / Integrate (large model)
      ├─ Quality Gate (eval model)
      └─ Commit → Git + Search Index + Metadata DB

[ 治理 / Lint 调度作业 (Container Apps Jobs) ]
[ 通知 (Graph sendMail / Teams) ]
[ 可观测性: Azure Monitor + App Insights + OTel ]
[ 密钥: Key Vault + Managed Identity ]
```

### 10.2 组件 → Azure 服务映射

| 组件 | Azure 服务 | 选型理由 |
|------|-----------|---------|
| 边缘接入 / WAF | Azure Front Door (Premium) | 全球加速、WAF、私有源（Private Link 至 Container Apps） |
| API 网关 | Azure API Management | 统一鉴权、限流、版本、配额、审计 |
| Web 前端 / API | Azure Container Apps | 容器化、自动伸缩、KEDA；运维成本低于 AKS，规模充足 |
| 摄入 Worker | Container Apps **Jobs** + Service Bus 触发 | 长任务、可重试、按队列长度伸缩 |
| Graph 变更 Webhook 接收 | Azure Functions（HTTP） | 弹性、低成本、与 Service Bus 集成 |
| 消息总线 | Azure Service Bus（Premium） | 解耦摄入、死信队列、会话保序 |
| 检索 | Azure AI Search（标准+） | BM25+向量混合、可过滤字段、安全过滤器 |
| LLM 推理 | Azure OpenAI（私有端点）；备选 Azure AI Foundry | 区域锁定、企业 SLA、模型分级 |
| 文档提取 / OCR | Azure AI Document Intelligence | 处理 PDF / 扫描件 / 复杂表格 |
| Wiki 后端 | **Azure DevOps Repos（Git）**（**假设**，待批） | 原生版本控制、PR 审批、diff/blame、与人工审核工作流契合 |
| 元数据 / 审计 | Azure Database for PostgreSQL Flex | 关系模型适合元数据、所有权、审批状态、审计；HA 可用 |
| 对象存储 | Azure Blob Storage（ZRS） | 提取文本、OCR 输出、中间产物 |
| 身份 | Microsoft Entra ID + MSAL | OIDC / 委托 Graph / 条件访问 / MFA |
| 密钥 | Azure Key Vault + Managed Identity | 无源码密钥；服务间用托管标识 |
| 可观测性 | Azure Monitor + Application Insights + Log Analytics | 结构化日志、分布式追踪、告警 |
| IaC / 策略 | Bicep + Azure Policy | 区域锁定、私有端点强制、SKU 守护 |
| CI/CD | GitHub Actions（**假设**） | 与代码托管对齐；OIDC 联邦至 Azure |

### 10.3 关键工作流

#### 10.3.1 摄入（Ingest）Pipeline

1. **变更感知**：Microsoft Graph `subscriptions` Webhook → Azure Functions 接收；定时 Delta Query 兜底。
2. **入队**：每文件事件投递到 Service Bus（按 driveId 分区，幂等键 = `driveItemId@etag`）。
3. **多阶段处理**（Container Apps Jobs）：
   - **扫描**：取 driveItem 元数据；尺寸/类型过滤。
   - **提取**：原生解析 Office/Markdown；PDF/图片走 Document Intelligence OCR。
   - **分类（小模型）**：判定主题、实体、是否值得纳入 Wiki、目标页面。
   - **综合（大模型）**：生成/更新 Wiki 页面 Markdown、双向链接、来源引用。
   - **质量门控（评估模型）**：事实一致性、矛盾检测、置信度评分；低置信或敏感 → 人工审批队列。
   - **提交**：写入 Wiki Git 仓库（PR 或直接 commit）+ 更新 AI Search 索引 + 写元数据/审计 DB。
4. **失败/重试**：指数退避；最终失败入死信，告警值班。
5. **指标**：摄入延迟、Token 用量、按阶段成功率、Graph 限流计数。

#### 10.3.2 查询 / 问答（Query）Pipeline

1. 用户在 Web 端发起问题；前端附带 Entra Access Token 调 API。
2. API 解析用户身份，拉取 Entra 组成员（缓存）。
3. 构造检索：AI Search 混合查询（BM25 + 向量），使用 `search.in(aclGroupSids, '<user groups>')` **查询时权限过滤**；附加 Wiki 图谱遍历扩展上下文。
4. 组装受限上下文 → 调用 Azure OpenAI 大模型生成答案，**强制引用** Wiki 页面与源文档链接；流式回传。
5. 记录 Prompt 哈希、模型版本、来源、Token、用户 ID（审计 12+ 个月）。
6. 失败降级：LLM 不可用 → 退化为 Wiki 检索结果列表。

#### 10.3.3 Lint / 治理 Pipeline

- **定时作业**（每日/每周）扫描全量或抽样 Wiki：
  - 与最新源文档比对 → 检测过时 / 矛盾。
  - 时效元数据更新；冲突报告写入页面或推送给负责人。
  - 对 AGENTS.md 规则违规（命名、分类、敏感）打标。
- 通知通过 Graph `sendMail` 或 Teams 消息推送给 Owner / 审批人。
- 敏感更新走审批工作流（PR + 多人 Reviewer + 审计记录）。

### 10.4 数据模型

**Wiki 页面 Front Matter（YAML）**：

```yaml
id: <stable-uuid>
title: <string>
owners: ["upn or group SID"]
sources:
  - driveItemId: <id>
    etag: <etag>
    aclGroupSids: ["..."]
    lastSeen: <iso8601>
sensitivity: Public | Internal | Confidential | Restricted
freshness:
  lastReviewed: <iso8601>
  nextReviewDue: <iso8601>
confidence: 0.0-1.0
modelVersion: <azure-openai-deployment@version>
promptHash: <sha256>
links:
  out: ["page-id-..."]
  in:  ["page-id-..."]
```

**AI Search 索引字段（节选）**：`pageId`、`chunkId`、`text`、`vector`、`aclGroupSids (Collection<string>, filterable)`、`sensitivity`、`pageOwners`、`lastUpdated`、`sourceDriveItemIds`。

**PostgreSQL 表**：`pages`、`page_versions`、`approvals`、`ingest_jobs`、`audit_events`、`cost_meter_daily`。

### 10.5 安全与身份

- **认证**：所有用户走 Entra ID OIDC；前端 PKCE，API 受 OAuth 2.0 Bearer 保护；继承租户 MFA 与条件访问。
- **授权**：
  - **应用层 RBAC**：Wiki Admin / Editor / Approver / Reader（映射 Entra 组）。
  - **来源权限过滤**：摄入时记录每分块的源文件 ACL（组 SID 集合）；查询时按用户组过滤，确保派生内容不超出原始访问范围。
- **服务到服务**：全部使用 **Managed Identity**；无连接字符串/密钥落码。
- **网络**：Azure OpenAI、AI Search、PostgreSQL、Blob、Key Vault 一律 **Private Endpoint**；公网仅 Front Door；出站经 NAT/Firewall。
- **密钥**：Key Vault 集中存储；轮换策略；CI/CD 通过 OIDC 联邦无密钥部署。
- **敏感数据**：尊重 M365 敏感度标签；Restricted 文档默认排除或走专属审批；可配置脱敏（PII 检测）。
- **传输/静态**：TLS 1.2+；存储默认平台密钥；如合规要求可启用 **CMK（TBD）**。
- **审计**：所有 LLM 编辑、用户查询、权限变更进 Log Analytics，保留 ≥ 12 个月，支持导出。

### 10.6 可靠性与扩展

- 全部计算无状态；Container Apps + Functions 自动伸缩。
- 摄入 Pipeline **幂等 + 可断点续跑**（按 `driveItemId@etag` 去重）；Service Bus 死信兜底。
- 多副本 + 区域内可用区冗余（PostgreSQL HA、Storage ZRS、Service Bus Premium）。
- **DR**：跨区域被动备份（PostgreSQL Geo-Backup、Git 仓库镜像、Search 索引可重建）；**RTO ≤ 4 h、RPO ≤ 1 h**；源文件可由 OneDrive 重新索引。
- Graph 限流：客户端配额 + 指数退避 + 429/503 重试；按 driveId 并发上限。
- 灰度发布：Container Apps revision 流量切分；Front Door 路由切换。

### 10.7 可观测性与成本治理

- **遥测**：OpenTelemetry SDK → App Insights；结构化日志含 `requestId / userId / pageId / promptHash / tokenIn / tokenOut / modelDeployment`。
- **仪表板**：摄入延迟、查询 P50/P95、LLM Token 与费用（按租户/团队/模型）、错误率、Graph 限流。
- **告警**：摄入积压、P95 超阈、错误率突增、Token 日预算超 80%、Key Vault 即将过期。
- **成本护栏**：
  - **模型分级**：≥70% Pipeline 步骤走小模型（如 gpt-4o-mini 级）；大模型仅用于综合与最终问答。
  - **Embedding 缓存** + 批量调用；提取文本去重哈希。
  - **租户级月度 Token 上限 + 熔断器**：超阈自动停摄入、降级问答。
  - 每日 `cost_meter_daily` 滚动统计 + 周报。

### 10.8 部署与环境

- **环境**：Dev / Test / Prod 三套订阅（或资源组隔离），通过 Bicep 参数化部署。
- **IaC**：Bicep 模块；Azure Policy 强制（区域白名单、私有端点必启、公网拒绝、SKU 守护、Diagnostic Settings 必配）。
- **CI/CD**：GitHub Actions（**假设**）；分支 → Dev 自动、Test 手动审批、Prod PR + 双人审批；OIDC 联邦至 Azure 无密钥。
- **配置管理**：App Configuration + Key Vault 引用；功能开关用于 Pipeline 阶段灰度。

---

## 11. 关键设计原则（Key Design Principles）

- 安全默认开启（Private Endpoint / Managed Identity / 最小权限）。
- Wiki 是**派生层**，OneDrive 是**事实来源**。
- 权限**继承而非扩张**：永不扩大用户访问范围。
- 模型分级 + 成本护栏从第一天起内建。
- 可观测性、审计、Schema/治理皆以代码（IaC + Policy + AGENTS.md）管理。
- 模块化、松耦合、幂等、可替换（模型/检索/存储抽象）。
- 透明可追溯：每条答案/每页内容都有可点击来源引用。

---

## 12. 依赖（Dependencies）

- Azure OpenAI 在目标区域的容量配额获批。
- Microsoft Graph API 配额、Webhook 订阅生命周期管理。
- Entra ID 应用注册 + 委托权限管理员同意（`Files.Read.All` 委托、`User.Read`、`Sites.Read.All` 等）。
- 敏感度标签分类体系与脱敏规则定义（信安/合规）。
- 审批组与负责人组织映射（HR/AD）。
- 私有 DNS 区域、Hub-Spoke 网络、Azure Firewall（如适用）。
- IT Ops / SOC 接入告警与值班流程。

---

## 13. 风险与缓解（Risks & Mitigations）

| 风险 | 设计缓解 |
|------|---------|
| LLM 幻觉 / 知识失真 | 评估模型质量门控；强制来源引用；敏感页人工审批；定期抽样审计；置信度阈值路由 |
| 权限泄露（综合页跨 ACL 暴露） | 摄入时记录每分块 ACL；AI Search `search.in()` 查询时过滤；红队测试；权限审计仪表板 |
| 敏感数据泄漏至 LLM | Azure OpenAI 私有端点；敏感度标签感知排除；PII 脱敏；禁用未批准模型端点（Azure Policy 强制） |
| LLM 成本超支 | 小模型路由 ≥70%；批量 Embedding + 缓存；租户月度上限 + 熔断器；每日成本监控告警 |
| Graph API 限流 / 摄入瓶颈 | Delta Query 增量；指数退避；按 driveId 并发上限；Service Bus 缓冲 + 死信 + 重试 |
| Wiki 陈旧/矛盾 | Lint 定时作业；时效元数据；冲突报告推送 Owner；源引用便于核查 |
| OneDrive 内容异构 | 多阶段提取器；Document Intelligence OCR；明确"无法处理"状态；元数据降级索引 |
| 用户采纳风险 | 透明引用；时效徽章；试点先行；"人工审核通过"标记 |
| 厂商/模型版本依赖 | 模型提供商抽象层；容量预留；监控弃用；备用分级模型 |
| 区域 / 数据驻留违规 | 私有端点 + 区域锁定 + Azure Policy as Code + 定期合规扫描 |
| 运营复杂度上升 | 各服务 SLO + Runbook；统一可观测性；灰度发布 |
| Schema / 治理漂移 | AGENTS.md 版本化 + Pipeline 强制 Lint 规则 + 治理评审节奏 |

---

## 14. 验收标准（Validation Criteria）

- **性能**：负载测试达成 500 并发用户、问答持续 20 QPS / 突发 50 QPS；P95 检索 < 1.5 s、首 Token < 3 s。
- **摄入**：选取 ≥10 万文件子集做端到端干跑，验证 P95 增量 ≤ 1 小时。
- **安全**：权限过滤红队测试 0 越权；Azure Policy 合规 100%；私有端点全覆盖。
- **质量**：抽样 ≥200 个 Wiki 页与源文档比对，事实一致性 ≥ 95%；幻觉率审计基线建立。
- **成本**：基于干跑外推月度 Token 费用 ≤ 批准上限；熔断器触发演练通过。
- **DR**：完成一次故障切换演练，RTO ≤ 4 h、RPO ≤ 1 h。
- **无障碍**：WCAG 2.1 AA 自动 + 人工评估通过。
- **审计**：日志可查询、保留期合规；至少一次外部安全评审通过。

---

## 15. 后续步骤（Next Steps）

1. 干系人确认 §16 全部 TBD（区域、预算、Wiki 后端、敏感度分类、CMK 要求、审批组）。
2. 输出关键 ADR：Wiki 后端（Git vs DB）、模型分级与提供商抽象、网络拓扑、元数据库选型。
3. 准备 MVP 待办（≤500 用户试点，≈6 个月）：Entra 应用注册、Graph 订阅原型、单业务单元摄入、最小问答闭环。
4. 信安评审 + DPIA（数据保护影响评估）。
5. Bicep 脚手架与 Landing Zone 接入；CI/CD 流水线建立。
6. 容量与配额申请：Azure OpenAI 部署、Service Bus Premium、AI Search 标准+。

---

## 16. 待确认事项（Clarifying Questions）

> 以下事项阻塞最终设计与评审决策，请在架构评审前确认。

1. **Azure 目标区域**：合同/合规批准的区域是哪个（如 `Sweden Central` / `East US 2` / `Japan East`）？是否要求多区域？
2. **月度预算上限**：云 + LLM 合并稳态月度上限金额？是否按业务单元分摊？
3. **Wiki 后端选型批准**：是否同意采用 Azure DevOps Repos（Git）作为 Wiki 版本化存储？或要求 Cosmos DB / 其他？
4. **元数据库选型批准**：PostgreSQL Flex 是否符合企业 DBA 标准？或要求 Azure SQL / Cosmos DB？
5. **CI/CD 平台**：GitHub Actions 还是 Azure DevOps Pipelines？
6. **CMK（客户托管密钥）**：是否强制要求 Storage / PostgreSQL / Search 启用 CMK？
7. **敏感度标签分类与脱敏规则**：M365 现有标签清单与处理矩阵（哪些禁送 LLM、哪些需脱敏）？
8. **审批组定义**：敏感/低置信度 Wiki 变更的审批人/组如何映射到 Entra 组？SLA 是多少？
9. **OneDrive 接入权限模型**：确认采用委托权限；如需部分应用级权限（例如离线 Lint）须信安审批范围。
10. **时间线节点**：MVP 上线日期与全量推广日期的具体目标。
11. **团队组成**：后端 / 前端 / AI / DevOps / 安全 / PM 头数与外部顾问安排。
12. **试点业务单元**：首批 ≤500 用户来自哪个业务单元？文档形态是否典型？
13. **审计日志保留**：12 个月是否满足合规？是否需要 WORM/不可变存储？
14. **通知渠道**：Owner/审批通知优先 Teams 还是邮件？是否需要 Webhook 至 ITSM？

---

> **审查标记**：本设计在 §10.2（Wiki 后端、CI/CD）、§10.5（CMK）及 §16 全部条目处包含**假设或 TBD**，须**人工审核确认**后方可进入实施阶段。
