<<<<<<< HEAD
# Enterprise LLM Wiki - Copilot Workspace

这是一个用于企业级 LLM Wiki 方案设计、任务拆解、估算与客户演示的 GitHub Copilot 工作区。
=======
# LLMWiki Template Pack

这是一套以LLMWiki系统为样例，面向企业项目的 GitHub Copilot 模板包，覆盖以下环节：
>>>>>>> affdbb6e4a077384002de33b60fab086b4feecde

当前仓库已经包含从研究、需求、方案、backlog、估算到演示页的完整骨架。

## 当前目录结构

```text
.
├─ .github/
│  ├─ AGENTS.md
│  ├─ copilot-instructions.md
│  ├─ instructions/
│  │  ├─ backend-api.instructions.md
│  │  ├─ docs-adr.instructions.md
│  │  └─ frontend-react.instructions.md
│  └─ prompts/
│     ├─ create-backlog.prompt.md
│     ├─ develop-protoype.prompt.md
│     ├─ estimate-work.prompt.md
│     ├─ implementation-plan.prompt.md
│     ├─ peer-review.prompt.md
│     └─ solution-design.prompt.md
├─ docs/
│  ├─ Enterprise LLM Wiki System Research Report.md
│  ├─ requirements.md
│  ├─ solution-design.md
│  ├─ backlogs.md
│  └─ estimation.md
├─ ppt/
│  ├─ index.html
│  ├─ 01-cover.html
│  ├─ 02-purpose-scope.html
│  ├─ 03-business-value.html
│  ├─ 04-architecture.html
│  ├─ 05-tech-stack.html
│  ├─ 06-estimation.html
│  ├─ 07-ai-savings.html
│  ├─ 08-work-plan.html
│  ├─ 09-risks.html
│  ├─ 10-next-steps.html
│  └─ assets/
├─ src/
├─ templates/
│  └─ requirements.template.md
└─ DemoSteps.md
```

## 文档与产物说明

- `docs/Enterprise LLM Wiki System Research Report.md`：研究报告输入。
- `docs/requirements.md`：需求文档。
- `docs/solution-design.md`：解决方案设计。
- `docs/backlogs.md`：Epic/Feature/Task backlog。
- `docs/estimation.md`：工作量评估。
- `ppt/`：客户演示用 HTML Deck。
- `src/`：原型或实现代码目录（当前预留）。

## Prompt 清单

- `/solution-design`：生成方案设计。
- `/create-backlog`：生成任务拆解。
- `/estimate-work`：生成估算。
- `/implementation-plan`：生成实施计划。
- `/peer-review`：生成评审报告。
- `/develop-protoype`：基于 requirements、solution-design、feature backlog 生成可交互原型 UI 代码。

## 推荐流程

1. 参考 `templates/requirements.template.md` 完成 `docs/requirements.md`。
2. 执行 `/solution-design` 生成 `docs/solution-design.md`。
3. 执行 `/create-backlog` 生成 `docs/backlogs.md`。
4. 执行 `/estimate-work` 生成 `docs/estimation.md`。
5. 执行 `/develop-protoype` 产出可交互原型 UI（建议输出到 `src/`）。
6. 结合 `docs/solution-design.md` 与 `docs/estimation.md` 更新 `ppt/` 演示页面。
7. 执行 `/peer-review` 形成评审结论。

## 使用建议

- Prompt 内容建议使用英文，产出更稳定。
- 面向内部评审和客户沟通的文档可使用中文。
- backlog 与 estimation 建议保留人工复核与签字环节。
