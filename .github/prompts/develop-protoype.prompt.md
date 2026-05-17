---
description: "Use when: generating a mock-data-driven interactive prototype UI for customer demos and requirement validation."
name: develop-protoype
agent: "agent"
argument-hint: "requirements, solution design, feature backlog, target users, brand constraints, demo goals. If one or more core inputs are missing, state assumptions and generate at least one end-to-end workflow with mock data, list/detail views, and one simulated action."
---

Create a **mock-data-driven interactive system prototype UI** for customer demos, stakeholder walkthroughs, and requirement confirmation.

The prototype must feel like a realistic functional scenario demo, not a static screen mockup. It must use representative sample data to drive visible screens, user flows, state changes, filters, detail views, and simulated business actions.

## Objective

Generate a lightweight, demo-ready UI implementation that helps customers validate:

- Whether the core business workflows are correct
- Whether users can navigate and complete the most important scenarios
- Whether information architecture, data fields, status labels, and interaction behavior match expectations
- Whether missing requirements, unclear rules, or workflow gaps can be discussed during the demo

## Scope

In scope:

- Interactive frontend prototype code in `src/prototype`
- Realistic mock data that represents the target business domain
- Simulated user interactions and state transitions backed by mock data
- Loaded, empty, error, selected, editing, confirmation, and result states where relevant
- A coherent end-to-end demo journey across the most important workflows
- Supporting notes that explain assumptions, trade-offs, and validation points

Out of scope:

- Production backend services
- Real authentication, authorization, persistence, or network integrations
- Unrequested features outside the provided requirements, solution design, or backlog
- Pixel-perfect implementation unless brand or design constraints are provided

## Priority Order

1. **Primary:** infer the most important workflows, screens, roles, entities, data fields, and user interactions from the provided inputs.
2. **Secondary:** implement the prototype so every major screen and interaction is powered by realistic mock data instead of hard-coded static page text.
3. **Tertiary:** make the prototype visually polished, easy to run, and suitable for customer-facing demos and workshop validation.

If workflow validation and mock data realism conflict, favor workflow validation. Use simpler but coherent sample data, then mark any realism gaps for customer review.

## Mock Data Requirements

The prototype must include representative mock data that is rich enough to demonstrate realistic scenarios.

Mock data checklist:

- Store sample data separately from UI rendering logic, preferably in `src/prototype/mock-data.js` unless the existing prototype structure uses a different pattern.
- Include multiple realistic records for each important business entity, not only one happy-path item.
- Include varied statuses, owners, dates, categories, priorities, metrics, tags, relationships, and edge cases where relevant.
- Include enough data to make search, filtering, sorting, selection, dashboards, detail panels, and status changes meaningful.
- Include at least one explicit data-source-to-Wiki example that shows source records/documents, extracted signals or fields, generated Wiki content, citations, metadata, and validation questions.
- Include at least one empty-state scenario and one simulated error or warning scenario when relevant to the workflow.
- Use domain-appropriate names and values inferred from the requirements. If the domain is unclear, state assumptions and create neutral but realistic sample data.

Mock data must drive the UI behavior. Do not create a prototype where cards, tables, counters, charts, or detail pages are disconnected from the sample data.

## Interaction Requirements

Implement realistic simulated interactions using frontend state.

Interaction checklist:

- Navigation between major screens or workflow steps
- Search, filter, sort, and clear-filter behavior over mock data
- Select a record and show a data-driven detail view
- Inspect a generated Wiki page or page preview and trace visible content back to source records, extracted facts, citations, and confidence metadata.
- Trigger a representative business action, then update the visible mock state
- Show confirmation, success, warning, empty, and validation states
- Display computed metrics, counters, summaries, or status indicators from mock data
- Preserve a coherent demo flow so the presenter can tell an end-to-end story

Actions may be simulated in memory. Do not call real APIs unless the input explicitly requires a backend and provides enough integration detail.

## Implementation Guidance

- Prefer a single coherent web prototype experience over fragmented partial pages.
- Use the existing repository patterns and `src/prototype` structure when available.
- If the implementation approach is unclear, choose a lightweight HTML/CSS/JavaScript prototype that can run locally without build tooling.
- Keep code easy to inspect, present, and iterate during a workshop.
- Make UI text concrete and business-facing. Avoid placeholder copy like "Lorem ipsum" or unexplained generic labels.
- Keep scope aligned to selected features and the demo goal.
- Do not build unrelated capabilities simply because they are easy to add.

## Handling Incomplete Input

If input is incomplete or ambiguous:

1. Add **Clarifications Needed** at the top of the response.
2. State explicit assumptions.
3. Proceed with a minimal, functional prototype that includes at least one end-to-end workflow, one mock data model, one list or dashboard view, one detail view, and one simulated business action.
4. Mark every assumption or unresolved dependency that should be confirmed with the customer.

If no files or inline context are provided, generate a generic but runnable demo prototype template and clearly list the missing requirement inputs.

## Recommended Output Structure

- Short summary of what the prototype covers
- Clarifications Needed, if any
- Assumptions
- Scope / Out of Scope
- Key user flows represented in the prototype
- Mock data model and example scenarios represented
- Implementation notes
- Generated or updated files
- Validation checklist for customer review
- Risks, trade-offs, and gaps to confirm

## Input

- Requirements: attach `docs/requirements.md`
- Solution Design: attach `docs/solution-design.md`
- Feature Backlog: attach `docs/backlogs.md`
- If files are not attached, use inline context for the same three inputs:

${input:context:Paste the requirements summary, solution design summary, feature backlog items, target users, demo goals, and any brand or UX constraints}

## Output

Generate the prototype UI code and supporting notes needed for a customer-facing demo.

The implementation must:

- Generate or update code in `src/prototype`
- Include mock data that supports realistic interactive scenarios
- Use mock data to render tables, cards, counters, detail views, workflow states, and simulated actions
- Include a visible example Wiki page or page preview generated from extracted mock source data, with traceable citations back to the sources
- Avoid backend dependencies unless clearly required and sufficiently specified
- Mark unresolved assumptions, missing dependencies, and customer validation questions clearly
- Include concise run instructions if the prototype requires a local server