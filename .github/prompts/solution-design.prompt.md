---
description: Generate a structured solution design for a project or feature
name: solution-design
agent: plan
argument-hint: problem statement, business goal, constraints, NFRs, current-state context
---
Create a **Solution Design** based on the provided input.

Requirements:
1. Start with a short executive summary.
2. If information is missing, list **Clarifying Questions** first.
3. Then provide the following sections:
   - Background
   - Objective
   - Scope
   - Out of Scope
   - Assumptions
   - Constraints
   - Current State (if known)
   - Target State
   - Key Design Principles
   - Proposed Solution
   - Dependencies
   - Risks and Mitigations
   - Validation Criteria
   - Next Steps
4. Keep the output suitable for architecture review or project initiation.
5. Prefer concise bullets over long paragraphs.
6. If applicable, highlight security, compliance, cost, resilience, and operability considerations.

Input:
${input:context:Describe the business problem, system scope, constraints, and NFRs}
