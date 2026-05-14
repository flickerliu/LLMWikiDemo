# LLMWiki Template Pack

这是一套以LLMWiki系统为样例，面向企业项目的 GitHub Copilot 模板包，覆盖以下环节：

- 方案设计（Solution Design）
- 架构评审（Architecture Review）
- 工作量预估（Estimate Work）
- 任务拆解（Create Backlog）
- 实施计划（Implementation Plan）
- 项目级指令（Repository Instructions）
- 模块级指令（Path-specific Instructions）
- Agent 行为约束（AGENTS.md）

## 目录结构

```text
.github/
  copilot-instructions.md
  AGENTS.md
  instructions/
    frontend-react.instructions.md
    backend-api.instructions.md
    docs-adr.instructions.md
  prompts/
    solution-design.prompt.md
    architecture-review.prompt.md
    estimate-work.prompt.md
    create-backlog.prompt.md
    implementation-plan.prompt.md
```

## 推荐使用顺序

1. 先补充 `.github/copilot-instructions.md` 中的组织级规则与技术栈约束。
2. 按项目需要调整 `instructions/` 下的模块级规范。
3. 使用 `/solution-design` 输出方案初稿。
4. 使用 `/architecture-review` 做备选方案与权衡。
5. 使用 `/estimate-work` 做任务拆解与三点估算。
6. 使用 `/create-backlog` 把方案转为 Epic / Feature / Task。
7. 使用 `/implementation-plan` 生成实施步骤、验证与回滚计划。

## 建议定制项

请优先替换以下占位符：

- `[YOUR_ORG]`
- `[YOUR_SYSTEM]`
- `[YOUR_TECH_STACK]`
- `[SECURITY_BASELINE]`
- `[COMPLIANCE_REQUIREMENTS]`
- `[NFR_REQUIREMENTS]`

## 小建议

- Prompt 文件建议优先使用英文，以获得更稳定的一致性输出。
- README/注释可保留中文，便于团队推广。
- 对估算结果务必做人工复核，不要直接作为承诺值。
