---
description: Generate a structured solution design for a project or feature
name: solution-design
agent: Plan
argument-hint: problem statement, business goal, constraints, NFRs, current-state context. If the input data is incomplete or ambiguous, explicitly state assumptions made to fill the gaps.
---
Create a **Solution Design** based on the provided input.

Requirements:
1. Start with a short executive summary.
2. If critical information necessary to complete the solution design is missing, list **Clarifying Questions** first.
3. Focus on the following core sections first: **Background**, **Objective**, **Scope**, and **Proposed Solution**. Then include additional sections as needed:
   - Out of Scope
   - Assumptions
   - Constraints
   - Current State (if known)
   - Target State
   - Key Design Principles
   - Dependencies
   - Risks and Mitigations
   - Validation Criteria
   - Next Steps
4. Keep the output suitable for architecture review or project initiation.
5. Prefer concise bullets over long paragraphs.
6. If applicable, highlight security, compliance, cost, resilience, and operability considerations.

Input:
Attach your filled requirements document via `#file:docs/requirements.md` when invoking this prompt.
If no file is attached, use the inline context below:
${input:context:Paste a summary of business problem, scope, constraints, and NFRs}

Output:
Save as `docs/solution-design.md` and mark 'Huaman review needed' if any assumptions were made or critical information is missing.