---
description: Generate a phased implementation plan with rollout, validation, and rollback
name: implementation-plan
agent: Plan
argument-hint: approved solution, delivery scope, target release approach
---
Create an **Implementation Plan** for the approved solution.

If the input files (`docs/requirements.md` or `docs/solution-design.md`) are missing or incomplete, produce a placeholder implementation plan based on available information and flag the gaps under a `Human review needed` section at the top of the output.

Requirements:
1. Organize the plan into phases.
2. For each phase, use the following section format:
   - **Objective**: one sentence describing the phase goal.
   - **Activities**: bullet list of work items.
   - **Dependencies**: upstream phases, teams, or systems required.
   - **Entry criteria**: conditions that must be true before starting.
   - **Exit criteria**: conditions that must be true to complete.
   - **Validation steps**: how completion is verified.
   - **Rollback considerations**: how to revert if the phase fails.
   - **Observability / support impact**: monitoring, alerting, and runbook changes.
3. Include deployment and release considerations.
4. Include testing strategies that apply to the approved solution from this list: unit, integration, UAT, performance, security, and operational checks. For each one included, briefly state why it applies; for any omitted, briefly state why it does not.
5. End with a concise go-live readiness checklist.

Use a practical style suitable for project delivery and change review.

Input:
### Requirements
${file:docs/requirements.md}

### Solution Design
${file:docs/solution-design.md}

## Output
Save as `docs/backlogs.md` and mark 'Human review needed' if any task
