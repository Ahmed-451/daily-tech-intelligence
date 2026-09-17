# Daily Tech Intelligence — Codex Instructions

## Project

Build Daily Tech Intelligence, an adaptive technical learning platform
that helps software engineers develop engineering intuition.

**Current build target: V0 (pre-MVP).** See `product-context.md` Section 0 and
`DECISIONS_LOG.md` for what V0 includes/excludes. Do not build authentication,
onboarding, or the diagnostic assessment until V0 is validated.

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
- Model the knowledge graph as plain Postgres adjacency tables
  (`topic_prerequisites`, `topic_relationships`) — no graph database.
- Topic selection, streaks, and difficulty progression are deterministic
  (rule-based); do not route these through the LLM. See `DECISIONS_LOG.md`.

## AI principles

- Never expose provider API keys to the browser.
- AI calls must go through the server.
- Do not generate arbitrary lessons without structure.
- AI responses should follow defined learning objectives.
- Minimize token usage.
- Design the system so models can be swapped later.
- Use the **Vercel AI SDK** as the provider abstraction (streaming, multi-provider,
  tool calling) rather than a fully custom AI service layer.
- AI is used for conversation, personalization, and evaluation of open-ended
  answers/teach-back — not for topic selection or progress calculations.

## Content principles

- Do not free-form generate the topic library. Start from ~15–20 hand-written/
  heavily-edited gold-standard topics; use them as few-shot templates when
  AI-assisting the rest of the library.

## Freemium principles (schema only, unenforced for now)

- Include a `plan` field (`free` | `pro`) on the user model and a lightweight
  usage-tracking table once a database exists, even though no limits are
  enforced yet. Do not build billing/Stripe integration until scope is finalized.

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

Do not make architectural changes without explaining why — and record any such
change in `DECISIONS_LOG.md`.