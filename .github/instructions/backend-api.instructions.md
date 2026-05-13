---
name: Backend API Standards
description: Standards for backend services and APIs
applyTo: "**/*.cs,**/*.java,**/*.py,**/*.go,**/api/**/*.ts"
---
# Backend and API standards
- Prefer clear boundaries between controller, service, domain, and data access responsibilities.
- Validate inputs and fail with meaningful error responses.
- Consider idempotency, retries, and timeout handling for external calls.
- Log with structured context and avoid sensitive data in logs.
- Document API contract changes and backward compatibility impact.
- Add or update tests for business logic, API contracts, and failure paths.
- Consider security, rate limits, and observability for every new endpoint.
