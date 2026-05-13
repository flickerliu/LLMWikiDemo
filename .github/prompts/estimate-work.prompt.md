---
description: Break work into deliverables and provide structured three-point estimates
name: estimate-work
agent: plan
argument-hint: scope, features, assumptions, target timeline, team composition
---
Create a **Work Estimation** for the requested scope.

Requirements:
1. Break the scope into:
   - Epic
   - Feature
   - Task
2. For each task, provide:
   - Objective
   - Key activities
   - Dependencies
   - Assumptions
   - Complexity (S / M / L / XL)
   - Optimistic estimate
   - Likely estimate
   - Pessimistic estimate
   - Risk buffer
   - Required role(s)
   - Needs Human Review? (Yes / No)
3. Highlight tasks with high external dependency or high uncertainty.
4. At the end, summarize major estimation risks and the top unknowns.
5. Do not provide a single-point commitment.

Output format:
- Start with an estimation summary.
- Then provide a structured markdown table or bullets.
- End with a short management note on uncertainty and validation needs.

Input:
${input:context:Describe the scope, expected deliverables, constraints, timeline, and team assumptions}
