# Daily Tech Intelligence — Codex Instructions

## Project

Build Daily Tech Intelligence, an adaptive technical learning platform
that helps software engineers develop engineering intuition.

## Product principle

The goal is not to generate random AI lessons.

The goal is:

Discover → Learn → Think → Answer → Evaluate → Practice →
Remember → Connect → Progress

## Engineering principles

- Prefer simple architecture.
- Start with a modular monolith.
- Do not introduce microservices without a demonstrated need.
- Do not over-engineer.
- Write production-quality TypeScript.
- Keep business logic separate from UI.
- Validate inputs at system boundaries.
- Never expose secrets to the client.
- Never commit environment variables or API keys.
- Prefer typed interfaces and schemas.
- Write tests for important business logic.
- Keep components small and understandable.

## AI principles

- Never expose provider API keys to the browser.
- AI calls must go through the server.
- Do not generate arbitrary lessons without structure.
- AI responses should follow defined learning objectives.
- Minimize token usage.
- Design the system so models can be swapped later.

## Development workflow

Before implementing a major feature:

1. Understand the existing architecture.
2. Explain the proposed approach.
3. Identify affected files.
4. Implement the smallest correct solution.
5. Run tests/type checking/linting.
6. Review the changes.
7. Explain what changed.

Do not rewrite unrelated code.

Do not install dependencies unless necessary.

Do not make architectural changes without explaining why.