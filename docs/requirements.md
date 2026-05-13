# 企业级 LLM 自维护知识库系统 —— 需求描述文件

> 本文档基于 `docs/Enterprise LLM Wiki System Research Report.md`（Karpathy LLM 自维护 Wiki 模式）及业务需求概要，参照 `templates/requirements.template.md` 模板生成（使用中文）。标注 **TBD** 的字段需在方案设计评审前由干系人确认。

---

## 1. 业务问题（Business Problem）

企业内部知识散落在 OneDrive、邮件、聊天记录、Office 文档等多个平台，存在以下核心痛点：

- **知识无积累**：传统 RAG 检索每次从头检索，无跨文档持久记忆，无"知识复利"效应。
- **维护成本高**：员工手动维护 Confluence / Wiki 的成本远超产出，知识库最终沦为"知识坟场"。
- **内容不一致**：多份文档存在矛盾时，问答系统每次回答可能自相矛盾，无法消解冲突。
- **知识孤岛严重**：知识沉淀于个人，人员离职或跨团队协作时出现严重断层。

**受影响群体：**
- **知识工作者（约 5,000 人）**：花费大量时间重复检索、整理和核对矛盾文档。
- **新员工**：缺乏结构化、可导航的组织知识视图，上手慢。
- **业务负责人 / 管理层**：无法信任内部内容的时效性与准确性，影响决策质量。
- **合规 / 风险团队**：难以及时发现过时政策和相互矛盾的规定。

**机遇**：采用 Karpathy 提出的"LLM 自维护 Wiki"范式，由 AI Agent 持续摄入来自企业 OneDrive for Business 的文档，将其编译为结构化、交叉链接、无矛盾的 Markdown 知识库，并从这一提炼层回答用户问题——将每次交互转化为知识积累，而非一次性检索。

---

## 2. 业务目标（Business Goal / Objective）

构建**企业级 LLM 自维护知识库 Web 应用**，使其成为组织权威、自我维护的"企业大脑（Company Brain）"：

- 与现有内网 / RAG 搜索相比，内部知识查询的**平均响应时间缩短 ≥ 50%**。
- **≥ 90%** 的日常 Wiki 维护工作（摘要生成、交叉链接、矛盾标记、时效检查）由 LLM Agent 自动完成。
- Wiki 页面与 OneDrive 原始文档之间的**事实一致性 ≥ 95%**（通过抽样审计衡量）。
- 在首年内完成 **5,000 名活跃用户**的接入，每用户最多索引 **1,000 个** OneDrive 文件（全量约 500 万份源文档）。
- 通过 Microsoft Entra ID 与 Azure 区域锁定服务，落实企业级身份管控、访问控制、可审计性与数据驻留要求。

**成功标准**：形成员工优先使用、信任度高的 Wiki 系统，重复提问次数与过时内容事故显著下降。

---

## 3. 系统范围（System Scope）

**全新系统建设（Greenfield）**，基于 Microsoft Azure 构建企业内部 Web 应用。范围内：

- **Web 前端**：浏览器端 Wiki UI，支持浏览、搜索、问答、查看来源引用、变更历史、页面所有权管理。
- **身份与访问管理**：Microsoft Entra ID（Azure AD）认证与授权（SSO、条件访问、MFA、基于角色的访问控制）。
- **数据摄入**：通过 Microsoft Graph API（委托权限）接入 **OneDrive for Business**，支持 Office 文档（docx/xlsx/pptx）、PDF、Markdown、纯文本及图片（OCR）。
- **LLM 编排层**：Agent 服务，实现 *摄入（Ingest）*、*查询（Query）*、*审查（Lint）* 三大工作流。
- **Wiki 知识库**：结构化 Markdown 页面（主题摘要、实体词条、索引、FAQ），含双向链接、版本控制及页面元数据（负责人、时效、来源引用、敏感度、置信度）。
- **检索层**：混合检索（全文 + 向量 Embedding + Wiki 图谱遍历），支持按用户权限过滤（Permission Trimming）。
- **治理模块**：页面所有权、敏感更新审批工作流、审计日志、矛盾/时效报告、Schema/AGENTS 配置管理。
- **运营支撑**：遥测、监控、告警、LLM 成本管控与预算护栏。

---

## 4. 不在范围内（Out of Scope）

- 面向外部客户的公开访问（MVP 仅限内部员工）。
- 回写 / 修改 OneDrive 源文件（系统对源文件只读）。
- 原生移动端应用（MVP 仅提供响应式 Web）。
- 非 OneDrive 的其他连接器（SharePoint 站点、Confluence、Jira、Slack/Teams、GitHub、邮件）——规划于后续阶段。
- Wiki 页面的实时多人协同编辑（人工负责审核/审批 LLM 生成的变更；手动创作为二期功能）。
- 基础模型的微调或企业数据训练。
- Wiki 内容的多语言翻译与跨语言综合（MVP 支持文档原始语言；多语言综合超出范围）。
- 替代任何数据系统的记录来源（OneDrive、HR 系统、ERP），Wiki 是派生知识层而非事实来源。
- 使用非 Microsoft / 非 Azure 托管的 LLM 端点。

---

## 5. 现状（Current State）

- **OneDrive for Business** 是企业事实上的文档存储（约 5,000 名用户，每用户最多 1,000 个文件）。
- 内网门户提供关键词搜索，但用户反映精准度低、结果陈旧。
- 员工个人化、零散使用消费级 GenAI 聊天工具，缺乏治理、无企业数据落地、回答不一致。
- 无结构化、机器维护的知识层；部落知识散落在聊天记录、个人笔记和 OneDrive 私人文件夹中。
- 身份已通过 **Microsoft Entra ID** 联邦化，M365 / Graph API 可用。

**痛点**：重复劳动、回答不一致、新员工上手慢、过时文档导致合规盲区。

---

## 6. 目标状态（Target State）

基于 Microsoft Azure 构建云原生企业内部 Web 应用，采用与 Karpathy 三层模型对齐的分层架构：

1. **原始素材层（Raw Source Layer）**：通过 Microsoft Graph 委托权限对 OneDrive for Business 内容进行只读镜像/索引，增量刷新（Delta 查询 + 变更通知）。源文件仍保留在 OneDrive，系统仅存储提取的文本、元数据和向量 Embedding。
2. **Wiki 知识库层（Wiki Knowledge Layer）**：LLM 维护的 Markdown 页面（主题/实体/索引/FAQ），含双向链接，版本化存储（Git 或数据库后端）。每页包含元数据：来源引用、负责人、时效时间戳、敏感度标签、置信度评分。
3. **Schema / 治理层（Schema / Governance Layer）**：人工编写的配置（AGENTS.md 风格的指令、分类体系、命名规范、敏感规则、审批策略），约束 LLM 行为。

**优选架构模式：**
- **事件驱动摄入**：OneDrive 变更通知 → 摄入队列（Azure Service Bus） → Pipeline Worker。
- **多阶段摄入 Pipeline**：扫描 → 过滤 → 提取/OCR → 分类（小模型） → 摘要/整合（大模型） → 质量门控 → 写入。
- **模块化服务**：身份认证、摄入、LLM 编排、Wiki 存储、检索、Web API、前端各自独立。
- **混合检索**：Azure AI Search（BM25 + 向量）+ Wiki 图谱遍历。
- **质量门控**：第二个评估模型在提交前审查 LLM 生成的页面；低置信度或敏感变更路由至人工审批。
- **查询时权限过滤（Permission Trimming）**：确保用户不会看到其无权访问的 OneDrive 文件所派生的内容。
- **可观测性与成本护栏**：从第一天起内建（租户级预算、≥70% Pipeline 步骤走小模型路由）。

---

## 7. 干系人（Stakeholders）

| 角色 | 姓名 / 团队 |
|------|-------------|
| 产品负责人（Product Owner） | TBD — 知识管理 / 数字化工作场所 |
| 技术负责人（Tech Lead） | TBD — 云与 AI 工程 |
| 安全审查（Security Reviewer） | TBD — 信息安全 / 身份团队 |
| 架构审批（Architecture Approver） | TBD — 企业架构委员会 |
| 数据 / 合规负责人 | TBD — 数据治理 / 隐私办公室 |
| Microsoft 365 / Entra ID 管理员 | TBD — IT 运营 |
| 最终用户代表 | TBD — 试点业务单元 |

---

## 8. 约束条件（Constraints）

- **技术栈**：优先使用 Microsoft Azure PaaS；OneDrive 接入通过 Microsoft Graph；身份认证使用 Microsoft Entra ID；LLM 推理使用 Azure OpenAI（或 Azure AI Foundry 托管模型）。**禁止**使用消费级 / 第三方 LLM 端点。
- **云提供商**：仅限 Azure，部署在租户批准的区域。
- **身份认证**：所有认证**必须**使用 Microsoft Entra ID（OIDC / OAuth 2.0），不允许本地账号。条件访问和 MFA 策略继承租户配置。
- **源文件访问模型**：OneDrive 摄入使用**委托权限（Delegated Permission）**（保留每位用户现有的 OneDrive ACL），除非信息安全团队明确批准使用应用级广泛权限。
- **数据驻留**：企业数据、Embedding 及 LLM Prompt/Response 日志**必须**保留在合同批准的 Azure 地理区域（具体区域 TBD）。不得将数据外传至非 Azure SaaS。
- **用户规模**：设计支持 **5,000 名命名用户**，最多 **500 万份源文件**（约 1,000 文件/用户），系统须在此规模下保持响应能力，并预留扩展至约 10,000 用户的余量。
- **预算**：云 + LLM 稳态月支出须在批准的月度上限内（TBD）。成本管控手段（小模型路由、批量 Embedding、缓存、熔断器硬上限）为强制要求。
- **时间线**：MVP（一个业务单元试点，≤500 用户）目标约 6 个月内上线；向 5,000 用户全面推广约 12 个月内完成。具体日期 TBD。
- **团队规模**：TBD — 假设为跨职能团队（后端、前端、AI/ML、DevOps 工程师 + 兼职安全和 PM）。
- **合规要求**：须遵守企业现有数据保护制度（如 GDPR 同等要求）、内部数据分级策略及审计要求。敏感文档处理规则（PII、机密、受限）适用。

---

## 9. 假设（Assumptions）

- Microsoft Entra ID 租户已配置且已联邦化，目标用户群可使用 SSO。
- **OneDrive for Business** 是 MVP 的**主要**数据源；其他系统（SharePoint、Teams、Confluence 等）在后续阶段接入。
- 企业持有 Microsoft 365 许可证，可通过 Graph API 访问 OneDrive 内容。
- 所选区域的 Azure OpenAI（或等效 Foundry 托管模型）容量可用，配额申请将获批准。
- 源文件平均大小适中（≤ 数 MB）；超大文件和专有二进制格式超出范围或降级为仅元数据索引。
- 用户接受**最终一致性**模型：OneDrive 新增/更新文件在数分钟到数小时内反映到 Wiki，不要求秒级同步。
- 人工审核人员可参与**审批工作流**，处理敏感或低置信度 Wiki 更新。
- Azure 服务到 Microsoft Graph 和 Azure OpenAI 的网络连通性稳定，无网闸（Air-gapped）部署需求。
- 所有 Wiki 内容均派生自请求用户已有权访问的源文件；系统**执行**而非**扩大**现有 OneDrive 权限。
- 稳态 Wiki 规模预估：5 万 – 20 万个 LLM 维护页面。

---

## 10. 非功能性需求（Non-Functional Requirements）

| 分类 | 需求项 | 目标值 |
|------|--------|--------|
| **可用性** | Web 应用 + 查询 API 在线率（SLA） | ≥ 99.9%（月度，业务时段关键） |
| **响应时延** | P50 Wiki 页面加载 | < 500 ms |
| **响应时延** | P95 Wiki 混合检索（不含 LLM） | < 1.5 s |
| **响应时延** | P95 LLM 问答响应（基于 Wiki，流式输出） | 首 Token < 3 s；总计 < 15 s |
| **吞吐量** | 峰值并发用户数 | ≥ 500（约为 5,000 用户的 10%） |
| **吞吐量** | 峰值问答 QPS | 持续 ≥ 20 QPS，突发 50 QPS |
| **摄入** | 初始全量索引 | 500 万文件积压在初始导入窗口内完成（目标以周计，而非月） |
| **摄入** | 增量变更 → Wiki 可见延迟 | P95 ≤ 1 小时 |
| **可扩展性** | 注册用户总数 | 5,000（预留扩展至 10,000） |
| **可扩展性** | 索引源文件总数 | 500 万（1,000 文件/用户 × 5,000 用户） |
| **可扩展性** | LLM 维护的 Wiki 页面数 | 5 万 – 20 万 |
| **安全 - 认证** | 身份认证机制 | Microsoft Entra ID（OIDC）；强制 MFA + 条件访问 |
| **安全 - 授权** | 权限控制 | Wiki 管理员/编辑者/读者 RBAC，叠加与 OneDrive ACL 对齐的来源权限过滤 |
| **安全 - 密钥** | 密钥与凭证管理 | Azure Key Vault；服务间认证使用托管标识；源码中不存在密钥 |
| **安全 - 传输/存储** | 数据加密 | 传输中 TLS 1.2+；静态加密（平台托管最低要求，可选 CMK） |
| **数据驻留** | 区域约束 | 企业数据、Embedding 及 LLM 日志保留在批准的 Azure 地理区域（具体区域 TBD） |
| **灾难恢复** | RTO / RPO | RTO ≤ 4 h；RPO ≤ 1 h（源文件可从 OneDrive 重新索引） |
| **可观测性** | 日志 / 链路追踪 / 告警 | Azure Monitor + Application Insights；结构化日志；摄入与查询路径的分布式追踪；错误率、时延、LLM 成本、摄入延迟告警 |
| **可审计性** | Wiki 变更历史与访问审计 | 每次 LLM 驱动的 Wiki 编辑均含来源引用、模型、Prompt 哈希版本记录；用户查询与访问事件保留 ≥ 12 个月 |
| **隐私** | PII / 敏感数据处理 | 遵循敏感度标签；支持配置脱敏或排除规则；企业数据不发送至未批准的模型端点 |
| **成本** | LLM 成本护栏 | 租户级月度上限 + 告警；≥70% Pipeline 步骤走小模型路由；超支熔断器 |
| **无障碍访问** | Web UI | WCAG 2.1 AA |
| **浏览器支持** | Web UI | Edge、Chrome、Firefox、Safari 最新两个版本 |

> 标注 TBD 的项目（具体 Azure 区域、月度预算上限、时间节点）须在方案设计评审前由干系人确认。

---

## 11. 集成点（Integration Points）

| 系统 | 方向 | 协议 / API | 说明 |
|------|------|-----------|------|
| **Microsoft Entra ID** | 入站（认证） | OIDC / OAuth 2.0 / MSAL | SSO、MFA、条件访问；应用注册含委托 Graph 权限范围 |
| **Microsoft Graph — OneDrive for Business** | 入站（数据） | Graph REST + Delta Query + 变更通知（Webhook） | 委托权限；增量同步；遵循用户文件权限 |
| **Microsoft Graph — 用户 / 组配置文件** | 入站 | Graph REST | 用户元数据、基于组的授权 |
| **Azure OpenAI / Azure AI Foundry** | 出站（LLM） | REST（私有端点） | Chat Completions + Embeddings；多模型分级（小模型用于分类/路由，大模型用于综合） |
| **Azure AI Search** | 出站（检索） | REST / SDK | 混合索引：BM25 + 向量；支持文档级 ACL 过滤 |
| **Azure Blob Storage** | 出站（存储） | REST / SDK | 提取的文本、OCR 输出、中间产物 |
| **Wiki 内容存储（Git 仓库或数据库）** | 双向 | Git over HTTPS / 数据库驱动 | 含元数据的版本化 Markdown 页面 |
| **Azure Key Vault** | 出站 | REST / SDK + 托管标识 | 密钥、密码、证书管理 |
| **Azure Monitor / Application Insights** | 出站 | OpenTelemetry / SDK | 日志、指标、链路追踪、告警 |
| **邮件 / Teams 通知（审批工作流）** | 出站 | Graph API（sendMail、Teams 消息） | 通知负责人/审批人 Wiki 变更或时效告警 |
| **OCR / 文档提取（Azure AI Document Intelligence）** | 出站 | REST / SDK | 从 PDF、扫描件、图片中提取文本 |

---

## 12. 已知风险（Known Risks）

| 风险 | 应对思路 |
|------|---------|
| **LLM 幻觉 / 知识失真** — LLM 可能臆造事实、摘要有误或产生错误交叉链接，污染知识库 | 质量门控评估模型；强制来源引用；敏感页面须人工审批；定期抽样审计 |
| **权限泄露风险** — Wiki 页面综合了多份不同 ACL 的源文件，可能将内容暴露给无权访问底层源文件的用户 | 查询时按用户权限过滤；追踪每份来源片段的 ACL；对检索 Pipeline 进行安全审查 |
| **敏感数据暴露给 LLM** — 机密或 PII 内容发送至模型端点 | 通过私有端点访问 Azure OpenAI；敏感度标签感知过滤；脱敏规则；禁止使用未批准模型端点 |
| **LLM 推理成本超支** — 500 万文件摄入 + 持续 Lint 周期可能导致 Token 费用失控 | 小模型路由；批量 Embedding；缓存；租户级月度硬上限 + 告警 + 熔断器 |
| **摄入规模与 Graph API 限流** — 数百万文件的初始积压加上持续增量可能超出 Graph API 限速和 Pipeline 容量 | 增量 Delta Query 设计；指数退避重试；按用户并发限制；Pipeline 幂等性与断点续跑 |
| **Wiki 内容陈旧或存在矛盾** — 即使有 Lint 周期，Wiki 仍可能与源文件产生偏差 | 时效元数据；定期 Lint 任务；矛盾报告推送给负责人；来源引用链接方便快速核查 |
| **OneDrive 内容异构** — 格式多样、文件过大、扫描件 PDF、密码保护文档、多媒体 | 多阶段提取器；OCR；明确"无法处理"状态；降级为仅元数据索引 |
| **用户采纳风险** — 用户可能不信任 LLM 生成的内容或回归旧习惯 | 透明的来源引用；时效指示器；种子用户先行推广；关键页面标注"人工审核通过"徽章 |
| **厂商 / 模型依赖** — 依赖 Azure OpenAI 容量和特定模型版本 | 抽象模型提供商层；容量预留；监控模型弃用；备用模型分级 |
| **合规与数据驻留违规** — 配置错误可能将数据路由至未批准的地理区域 | 私有端点；区域锁定资源；Azure Policy as Code；定期合规扫描 |
| **运营复杂度** — 多服务 Pipeline（摄入、检索、编排、治理）扩大了值班范围 | 完善可观测性；运维手册（Runbook）；各服务 SLO；灰度发布 |
| **Schema / 治理漂移** — 若缺乏对 AGENTS.md 规则的严格管理，Wiki 结构随时间退化 | 版本化 Schema 管理；Pipeline 内强制执行 Lint 规则；定期治理评审 |
