# Solution Design Requirements

> **Instructions:**
> 1. Copy this file to `docs/requirements.md` (keep the template untouched for reuse).
> 2. Fill in each section. Leave a field as `TBD` if unknown — the prompt will surface it as a clarifying question.
> 3. Run the `solution-design` prompt and attach your filled file: type `#file:docs/requirements.md` in the chat input.

---

## 1. Business Problem

> Describe the core problem being solved. Who is affected? What pain points or opportunities are driving this initiative?

(Fill in here)

---

## 2. Business Goal / Objective

> What does success look like? What outcome is the business trying to achieve?

(Fill in here)

---

## 3. System Scope

> Which systems, services, or domains are in scope?
> Is this greenfield development or a change to an existing system?

(Fill in here)

---

## 4. Out of Scope

> Explicitly list what is NOT included in this initiative.

- (Item 1)
- (Item 2)

---

## 5. Current State

> Describe the existing architecture, process, or tooling being replaced or extended.
> Include a diagram link or short description if available.

(Fill in here)

---

## 6. Target State

> Describe the desired end-state architecture or process.
> Include preferred patterns (e.g., event-driven, microservices, monolith) if any.

(Fill in here)

---

## 7. Stakeholders

> List key stakeholders, owners, and approvers.

| Role                  | Name / Team |
|-----------------------|-------------|
| Product Owner         | TBD         |
| Tech Lead             | TBD         |
| Security Reviewer     | TBD         |
| Architecture Approver | TBD         |

---

## 8. Constraints

> Hard constraints on technology stack, cloud provider, budget, timeline, regulatory requirements, or team capacity.

- **Technology stack:** (e.g., must use Azure, .NET 8)
- **Cloud provider:** (e.g., Azure only)
- **Budget:** (e.g., < $5,000/month cloud spend)
- **Timeline:** (e.g., MVP by Q3 2026)
- **Team size / capacity:** (e.g., 2 backend engineers, part-time)
- **Regulatory / compliance:** (e.g., GDPR, ISO 27001, SOC 2)

---

## 9. Assumptions

> State any assumptions made due to incomplete information.

- (Assumption 1)
- (Assumption 2)

---

## 10. Non-Functional Requirements (NFRs)

> Fill in each row with a target value or leave as `TBD`.

| Category        | Requirement               | Target |
|-----------------|---------------------------|--------|
| Availability    | Uptime SLA                | TBD    |
| Latency         | P99 response time         | TBD    |
| Throughput      | Peak requests/sec         | TBD    |
| Scalability     | Max concurrent users      | TBD    |
| Security        | Auth mechanism            | TBD    |
| Data residency  | Region constraint         | TBD    |
| Disaster recovery | RTO / RPO               | TBD    |
| Observability   | Logging / tracing / alerting | TBD |

---

## 11. Integration Points

> List upstream and downstream systems this solution must integrate with.

| System              | Direction | Protocol / API | Notes |
|---------------------|-----------|----------------|-------|
| (e.g., CRM)         | Inbound   | REST           | TBD   |
| (e.g., Data warehouse) | Outbound | Event stream  | TBD   |

---

## 12. Known Risks

> List any known risks upfront. The solution design will expand on mitigations.

- (Risk 1)
- (Risk 2)
