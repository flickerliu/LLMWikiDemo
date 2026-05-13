---
description: Generate a phased implementation plan with rollout, validation, and rollback
name: implementation-plan
agent: plan
argument-hint: approved solution, delivery scope, target release approach
---
Create an **Implementation Plan** for the approved solution.

Requirements:
1. Organize the plan into phases.
2. For each phase, include:
   - Objective
   - Activities
   - Dependencies
   - Entry criteria
   - Exit criteria
   - Validation steps
   - Rollback considerations
   - Observability / support impact
3. Include deployment and release considerations.
4. Include testing strategy: unit, integration, UAT, performance, security, or operational checks where relevant.
5. End with a concise go-live readiness checklist.

Use a practical style suitable for project delivery and change review.

Input:
${input:context:Paste the approved design or implementation scope}
