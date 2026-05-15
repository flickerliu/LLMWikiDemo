---
description: Convert a solution or requirement into epic, feature, and task backlog items
name: create-backlog
agent: Plan
argument-hint: solution summary, scope, milestones, constraints
---
Create a **GitHub Backlog Structure** from the provided solution context.

If the input is incomplete or ambiguous, list the missing or unclear elements under a `Clarifications needed` section at the top, then proceed using these defaults and explicitly mark any assumed values:
- One Epic per major capability area mentioned in the input.
- 2–5 Features per Epic, each representing a user-visible outcome.
- 3–8 Tasks per Feature, each scoped to a single component or layer.
- Default `Suggested owner role` to `Backend Engineer` for API/data work, `Frontend Engineer` for UI work, `DevOps Engineer` for infra/CI work, and `Tech Lead` for architecture or cross-cutting items.

Use the table below as the required field set per level, then follow the steps in order.

| Level   | Required fields                                                                                          |
| ------- | -------------------------------------------------------------------------------------------------------- |
| Epic    | Title, Purpose, Scope, Acceptance Criteria, Dependencies, Suggested owner role                           |
| Feature | Title, Purpose, Scope, Acceptance Criteria, Dependencies, Suggested owner role                           |
| Task    | Title, Purpose, Scope, Acceptance Criteria, Dependencies, Suggested owner role, AI-deliverable (vibe coding), Human review effort |

Follow these steps in order:

Step 1 — Create Epics using the Epic fields from the table.

Step 2 — Under each Epic, create Features using the Feature fields from the table.

Step 3 — Under each Feature, create Tasks using the Task fields from the table. Define the two Task-only fields as:
   - **AI-deliverable (vibe coding)**: `Yes` if the Task can plausibly be completed end-to-end by an AI coding agent through vibe coding (clear scope, low ambiguity, no novel architecture decisions, no privileged access required); otherwise `No` with a one-line reason.
   - **Human review effort**: estimated wall-clock time a human reviewer needs (e.g., `~15 min`, `~1 hr`, `~4 hr`). If `AI-deliverable = No`, also estimate the human implementation effort separately (e.g., `Implementation: ~1 day`).

   Each Task must be sized so it can be completed, reviewed, and merged within a single two-week sprint; if a Task cannot meet that bar, split it further.

Step 4 — On every item from any level, mark blockers, external dependencies, and architecture review gates.

Optional:
- Add labels such as `architecture`, `security`, `backend`, `frontend`, `ops`, `needs-review`.

---

## Input

### Requirements
${file:docs/requirements.md}

### Solution Design
${file:docs/solution-design.md}

## Output
Save as `docs/backlogs.md` and mark 'Human review needed' if any task