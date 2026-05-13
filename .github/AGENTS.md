# Agent Guidance

## Operating model
- Start by understanding the goal, constraints, and repository context.
- For multi-step work, propose a short plan before editing many files.
- Prefer minimal, reviewable changes.
- If a task is unclear or high risk, stop and ask for clarification.

## Validation expectations
- Run or propose the most relevant validation steps available in the repository.
- Prefer failing fast over making broad speculative changes.
- Summarize what changed, how it was validated, and what remains uncertain.

## Pull request expectations
- Provide a concise summary of changes.
- List validation evidence.
- Call out risks, assumptions, follow-up items, and rollback considerations.

## Architectural guardrails
- Respect documented module boundaries.
- Avoid introducing new dependencies unless justified.
- Prefer patterns already used by the repository unless there is a clear improvement case.
