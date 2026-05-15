---
description: Two-phase work estimation — Phase 1 produces a structured Epic/Feature/Task breakdown; Phase 2 assigns roles, three-point estimates, AI assistance savings, and risk buffers per task, then aggregates totals by role (PM, Architect, Consultant) in a Role Summary Table with AI-adjusted effort
name: estimate-work
agent: Plan
argument-hint: Ensure docs/requirements.md and docs/solution-design.md exist. Each must contain at least one paragraph per mandatory section (scope, stakeholders, functional requirements, constraints, solution components) and an explicit description of every functional requirement and solution component. If any required file is missing, output an error line naming the missing file(s) and stop. If a file exists but a mandatory section is empty or missing, list the gap under 'Top unknowns' and continue with the remaining tasks.
---
Create a **Work Estimation** for the requested scope, with effort broken down by role.

Process this in two strictly sequential phases. **Complete Phase 1 in full before beginning Phase 2.**

- **Phase 1 — Breakdown only**: Identify all Epics, Features, and Tasks. For each task, output **only** Objective and Key activities. Do **not** assign roles, estimates, AI fields, dependencies, or risk buffers in Phase 1. Output the full breakdown before proceeding.
- **Phase 2 — Estimation**: For each task from Phase 1, add the remaining fields and aggregates by following Phase 2 sub-steps 2A–2D below in order.

## Role Definitions

Apply the following role boundaries consistently throughout the estimation:

| Role | Responsibility Focus |
|------|----------------------|
| **Project Manager (PM)** | Project governance, planning, stakeholder communication, risk tracking, milestone management, change control, acceptance coordination |
| **Architect** | Solution design, technology decisions, architecture review, non-functional requirements, integration design, security/compliance guidance, proof-of-concept validation |
| **Consultant** | Business analysis, requirements elicitation, process design, data modeling, configuration, implementation delivery, testing, documentation, knowledge transfer |

---

## AI Assistance Definitions

AI assistance levels classify how much AI tooling (vibe coding, Copilot, AI agents, etc.) can accelerate a task. Apply these consistently when assigning the **AI Assistance Level** field to each task.

| Level | Savings Range | Description | Typical Tooling |
|-------|--------------|-------------|-----------------|
| **None** | 0% | Fully manual — human judgment, negotiation, or governance activity where AI adds no meaningful leverage | — |
| **Low** | 10–20% | AI assists with lookup, summarisation, or light drafting; human still drives most of the work | AI Chat (Copilot Chat, Claude), AI-assisted review, AI grammar/spell check |
| **Medium** | 25–40% | AI accelerates a significant portion of structured, pattern-driven work; human reviews and refines output | Vibe coding (GitHub Copilot, Cursor) for implementation, AI test generation, AI-assisted data modelling |
| **High** | 45–65% | Task is largely templated or repetitive; AI generates the bulk of the artefact and human validates | AI scaffolding/boilerplate generation, AI-generated documentation, AI configuration generation, AI diagram drafting |

Use one **Delivery Mode** per task to avoid overestimating AI-led tasks:

| Delivery Mode | Definition | Typical human effort profile |
|--------------|------------|------------------------------|
| **Human-led (AI-assisted)** | Human performs most implementation; AI accelerates selected steps | Human implementation dominates; review is part of normal delivery |
| **AI-led (Human-reviewed)** | AI generates most deliverables; human validates, fixes edge cases, and approves | Human effort is primarily prompt/orchestration + review + targeted rework |

> **Vibe coding** (GitHub Copilot / Cursor / AI pair-programming): applies primarily to implementation, configuration, and test tasks where the developer prompts the AI to generate, complete, or refactor code in real time. Savings are highest for well-defined, pattern-heavy work (CRUD, boilerplate, unit tests) and lowest for novel algorithm design or security-sensitive logic.

> **Savings ranges are indicative estimates**, not guarantees. They depend on team AI proficiency, task clarity, and tooling availability. Always apply professional judgment when committing to AI-adjusted figures.

---

## Requirements

1. Break the scope into:
   - **Epic** — major capability or phase
   - **Feature** — deliverable within an epic
   - **Task** — atomic unit of work within a feature

2. Phase 2 sub-steps. Process each Task by completing all four sub-steps in order before moving to the next Task. Do not interleave sub-steps across Tasks.

   **Phase 1 fields (already produced):**
   - **Objective**: what done looks like
   - **Key activities**: 2–4 bullet actions

   **Sub-step 2A — Roles, dependencies, assumptions:**
   - **Primary role**: PM / Architect / Consultant (one dominant role per task)
   - **Supporting roles**: other roles with minor involvement (if any)
   - **Dependencies**: internal tasks or external blockers
   - **Assumptions**: facts assumed true for this estimate

   **Sub-step 2B — Sizing and three-point estimate:**
   - **Complexity**: S / M / L / XL
   - **Optimistic estimate** (person-days, best case)
   - **Likely estimate** (person-days, most probable — gross, before AI adjustment)
   - **Pessimistic estimate** (person-days, worst case)
   - **Risk buffer** (% added on top of likely, with rationale)

   **Sub-step 2C — AI assistance fields:**
    - **Delivery Mode**: Human-led (AI-assisted) / AI-led (Human-reviewed)
   - **AI Assistance Level**: None / Low / Medium / High (refer to AI Assistance Definitions above)
   - **AI Tools Applicable**: list the specific tools relevant to this task (e.g., GitHub Copilot, Cursor, AI Chat, AI Test Gen, AI Docs)
   - **Estimated AI Savings**: percentage effort reduction and one-line rationale (e.g., "30% — vibe coding covers CRUD boilerplate and unit test scaffolding")
    - **Human implementation effort** (person-days): hands-on build/config/test effort by humans
    - **Human review effort** (person-days): review/QA/acceptance effort by humans
    - **Human rework contingency** (person-days): expected fix-up effort after review
    - **Human-Adjusted Likely** (person-days):
       - If **Delivery Mode = Human-led (AI-assisted)**: `Likely × (1 − Estimated AI Savings %)`
       - If **Delivery Mode = AI-led (Human-reviewed)**: `Human implementation effort + Human review effort + Human rework contingency`
    - For **AI-led (Human-reviewed)** tasks, keep **Estimated AI Savings** in the **65–85%** range unless a clear reason justifies lower/higher values

   **Sub-step 2D — Review flag:**
   - **⚠️ Needs Human Review?** Yes / No — flag if high uncertainty or external dependency

3. Highlight tasks with:
   - High external dependency (third-party APIs, procurement, approvals)
   - High uncertainty (novel technology, unclear requirements, regulatory TBD)

4. After the task breakdown, provide a **Role Summary Table** aggregating:
   - Total optimistic / likely / pessimistic person-days per role (PM / Architect / Consultant)
   - Total AI savings (person-days) per role, derived from summing each task's (Likely × Savings %)
   - Human-Adjusted Likely per role, derived from summing each task's Human-Adjusted Likely
   - Count of tasks by Delivery Mode per role (Human-led vs AI-led)
   - Overall project totals for all columns
   - Implied calendar duration based on Human-Adjusted Likely (the recommended planning baseline)

5. Add an **Estimation Method Note** that explicitly states:
   - AI-led tasks are estimated from human review/rework workload, not from gross manual effort only
   - Human-Adjusted Likely is the commitment baseline; Gross Likely is for audit and comparison

6. End with:
   - **Top estimation risks** (≤ 5 items)
   - **Top unknowns** requiring resolution before commitment
   - **Management note** on uncertainty and validation needs

7. Do not provide a single-point commitment.

---

## Output Format

```
## Estimation Summary
[3–5 sentence narrative: scope, total gross effort range, total AI savings, net human-adjusted effort, key risks, recommended next step]

## Role Summary Table
| Role        | Optimistic | Likely (Gross) | Pessimistic | AI Savings | Human-Adjusted Likely | Tasks (Human-led / AI-led) | Notes |
|-------------|-----------|----------------|-------------|------------|----------------------|----------------------------|-------|
| PM          | X days    | X days         | X days      | X days     | X days               | X / X                      | ...   |
| Architect   | X days    | X days         | X days      | X days     | X days               | X / X                      | ...   |
| Consultant  | X days    | X days         | X days      | X days     | X days               | X / X                      | ...   |
| **Total**   | X days    | X days         | X days      | X days     | X days               | X / X                      |       |

> **Human-Adjusted Likely** is the recommended baseline for project planning and commitments. Gross Likely is retained for auditability.

## AI Savings Summary
| Category | Gross Likely (days) | AI Savings (days) | Savings % | Net Human Effort (days) |
|----------|--------------------|--------------------|-----------|-------------------------|
| High AI leverage tasks (Level: High) | X | X | ~55% avg | X |
| Medium AI leverage tasks (Level: Medium) | X | X | ~32% avg | X |
| Low AI leverage tasks (Level: Low) | X | X | ~15% avg | X |
| No AI leverage tasks (Level: None) | X | 0 | 0% | X |
| **Total** | X | X | X% | X |

[2–3 sentence narrative: which task categories yield the most AI savings, which tools drive the biggest reductions, and any caveats on AI savings realisation (e.g., team AI proficiency, tooling procurement, prompt quality).]

## Epic / Feature / Task Breakdown
[Structured table or nested bullets per task with all fields from Requirement 2, including Delivery Mode and the three human-effort fields]

## Estimation Risks & Unknowns
[Risks + unknowns + management note]
```

---

## Input

### Requirements
${file:docs/requirements.md}

### Solution Design
${file:docs/solution-design.md}

### Backlog Plan
${file:docs/backlogs.md}

## Output
Save as `docs/estimation.md` and mark 'Human review needed' if any task
   