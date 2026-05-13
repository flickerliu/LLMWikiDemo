---
description: Convert a solution or requirement into epic, feature, and task backlog items
name: create-backlog
agent: plan
argument-hint: solution summary, scope, milestones, constraints
---
Create a **GitHub Backlog Structure** from the provided solution context.

Requirements:
1. Produce backlog items in three levels:
   - Epic
   - Feature
   - Task
2. For each item, include:
   - Title
   - Purpose
   - Scope
   - Acceptance Criteria
   - Dependencies
   - Suggested owner role
3. Prefer backlog items that are reviewable and executable within a sprint.
4. If an item is too large, split it further.
5. Mark blockers, external dependencies, and architecture review gates.

Optional:
- Add labels such as `architecture`, `security`, `backend`, `frontend`, `ops`, `needs-review`.

Input:
${input:context:Paste the solution summary or requirement set}
