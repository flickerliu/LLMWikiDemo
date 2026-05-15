---
description: Generate interactive prototype UI code for customer demos and requirement validation
name: develop-protoype
agent: Plan
argument-hint: requirements, solution design, feature backlog, target users, brand constraints, demo goals. If the input is incomplete or ambiguous, explicitly state assumptions and proceed with the safest prototype-first interpretation.
---
Create a **system prototype UI implementation** that is suitable for customer demos, stakeholder walkthroughs, and requirement confirmation.

Requirements:
1. Use the provided inputs to infer the product's core workflows, screens, and user interactions.
2. Generate a prototype that is **interactive** and visually polished, but clearly scoped as a demo-ready prototype rather than production code.
3. Prefer a user journey that covers the most important end-to-end scenarios from the requirements, solution design, and feature backlog.
4. If the input is incomplete or ambiguous, list **Clarifications Needed** at the top, then continue with explicit assumptions.
5. Optimize for customer validation: the UI should make it easy to confirm navigation, states, empty/error/loaded views, and key business flows.
6. Include realistic mock data and simulated interactions where needed, but avoid backend dependencies unless they are already clearly defined in the input.
7. Produce code that is easy to run, inspect, and present in a workshop or demo setting.
8. If the best implementation approach is unclear, choose a lightweight, modern web prototype that can be delivered quickly and iterated on.
9. Keep the scope aligned to the selected features; do not expand into unrelated capabilities.
10. Highlight any trade-offs, assumptions, and gaps that should be validated with the customer.

Recommended output structure:
- Short summary of what the prototype covers
- Clarifications Needed, if any
- Assumptions
- Key user flows represented in the prototype
- Implementation notes
- Generated UI code
- Validation checklist for customer review

Input:
- Requirements: attach `docs/requirements.md`
- Solution Design: attach `docs/solution-design.md`
- Feature Backlog: attach `docs/backlogs.md`
- If files are not attached, use inline context for the same three inputs:
${input:context:Paste the requirements summary, solution design summary, and feature backlog items}

Output:
- Generate the prototype UI code and supporting notes needed for a customer-facing demo.
- Prefer a single coherent prototype experience over fragmented partial pages.
- Mark any unresolved assumption or missing dependency clearly so the customer can confirm it.
- Generate the protocodes on the directory `docs/prototype`