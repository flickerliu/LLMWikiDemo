# Enterprise LLM Wiki Interactive Prototype

## Summary

This prototype demonstrates a mock-data-driven Enterprise LLM Wiki experience for customer walkthroughs and requirements validation. It focuses on the highest-value workflows from `docs/requirements.md`, `docs/solution-design.md`, and `docs/backlogs.md`: OneDrive ingestion, LLM-maintained Wiki pages, permission-aware Q&A, governance approvals, audit evidence, and LLM cost guardrails.

## Clarifications Needed

- Approved Azure region and data residency boundary are still TBD.
- Cloud and LLM monthly budget cap is still TBD.
- Final Wiki backend decision is still TBD: Azure DevOps Repos is assumed for the prototype narrative.
- Approval groups, sensitivity matrix, WORM retention, and pilot business unit remain customer validation items.

## Assumptions

- The target users are internal knowledge workers, knowledge managers, platform operators, security reviewers, and compliance reviewers.
- The demo user has ordinary employee access plus limited Finance and pilot group access; restricted evidence is intentionally shown as permission-trimmed.
- All actions are simulated in browser memory; no authentication, backend, Microsoft Graph, Azure OpenAI, Azure AI Search, or persistence is implemented.
- Mock data is representative rather than exhaustive and is designed to prompt validation discussions.

## Scope / Out of Scope

In scope: static frontend prototype, realistic mock data, list/detail views, filters, sorting, simulated state changes, approval confirmation, Q&A fallback, warning/error/empty states, and customer validation notes.

Out of scope: production authentication, real RBAC enforcement, network calls, file parsing, LLM calls, persistent storage, deployment infrastructure, and pixel-perfect brand implementation.

## Key User Flows Represented

- Operator starts or inspects a OneDrive delta ingestion job.
- Knowledge manager searches Wiki pages, reviews generated content, edits metadata, and requests human review.
- Employee asks a Wiki-grounded question and receives citations or a permission-trimmed warning.
- Security or compliance reviewer approves or rejects a sensitive generated update.
- Operations reviewer checks audit events and LLM model-routing cost guardrails.

## Mock Data Model

- `wikiPages`: generated Wiki pages with status, owner, sensitivity, confidence, freshness, tags, citations, warnings, history, and metrics.
- `sourceDocuments`: OneDrive source documents with type, location, ACL group examples, processing status, and page relationships.
- `ingestJobs`: pipeline jobs that show OCR, quality gate, completion, failure, and retry scenarios.
- `approvals`: governance queue items with proposed diffs, approvers, priorities, and due dates.
- `auditEvents` and `costDays`: operational evidence for access decisions, warnings, and LLM spend.

## Run Instructions

Open `src/prototype/index.html` directly in a browser. A local server is optional; if preferred, serve the folder with any static web server, for example:

```powershell
cd src/prototype
python -m http.server 5173
```

Then open `http://localhost:5173`.

## Validation Checklist

- Confirm the primary roles, navigation labels, and data fields match customer expectations.
- Confirm approval status names, confidence thresholds, and sensitive-change routing rules.
- Confirm how empty search results, permission trimming, degraded Q&A fallback, and password-protected files should behave.
- Confirm whether cost guardrails need tenant, department, or user-level budget displays.
- Confirm which audit events must be visible to operators versus compliance reviewers.

## Risks, Trade-offs, and Gaps

- The prototype simplifies actual ACL behavior into group labels; production must validate derived-content leakage risks in depth.
- The Q&A simulation uses deterministic mock matching rather than retrieval or model inference.
- The ingestion view represents major stages but does not model 5 million file scale, Graph throttling behavior, or checkpoint recovery in detail.
- UI language and information architecture should be validated with pilot users before production design work begins.