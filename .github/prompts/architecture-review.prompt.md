---
description: Compare architecture options and recommend one with trade-offs
name: architecture-review
agent: plan
argument-hint: system goal, constraints, NFRs, allowed tech stack
---
Perform an **Architecture Review** for the described scenario.

Requirements:
1. Identify the main architectural drivers.
2. Propose 2 to 3 viable architecture options.
3. For each option, analyze:
   - Strengths
   - Weaknesses
   - Cost impact
   - Delivery complexity
   - Security and compliance considerations
   - Scalability and resilience
   - Operational impact
4. Provide a decision matrix.
5. Recommend one option and explain why the others were not selected.
6. End with key risks, mitigation actions, and decision checkpoints.

Use a concise, decision-oriented style suitable for review meetings.

Input:
${input:context:Describe the target system, constraints, NFRs, and preferred technologies}
