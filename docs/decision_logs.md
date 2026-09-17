# Decisions Log — Daily Tech Intelligence

> Append-only log of product and architecture decisions. Newest entries at the top.
> Each entry: date, decision, reasoning, alternatives considered, status.

---

## 2026-09-17 — V0 lean scope adopted (pre-MVP)

**Decision:** Before building the full V1 MVP described in `product-context.md` (auth, onboarding,
diagnostic assessment, DB-backed progress), ship a V0 first:

- No authentication
- No onboarding flow
- No diagnostic assessment
- 10–15 hand-curated topics (hardcoded/JSON, not DB-driven yet)
- The daily mission loop (Hook → Think → Learn → Under the Hood → Challenge → Evaluate → Teach-back)
  running through a server-side AI mentor route
- Progress = simple local state (streak count, topics completed) in browser storage only

**Reasoning:** The biggest unvalidated risk is whether the interactive loop itself is compelling.
Building accounts, a diagnostic assessment, and persistence before knowing that wastes effort.

**Status:** Approved by product owner. Supersedes "V1 — MVP" as the immediate build target;
V1 as originally scoped becomes the target once V0 validates the loop with real users.

---

## 2026-09-17 — Freemium scaffolding now, enforcement later

**Decision:** Add a `plan` field (`free` | `pro`) on the user model and a lightweight
`ai_usage` / `usage_events` table to the schema as soon as a database exists — but leave
all limits unenforced (effectively unlimited) until pricing is decided.

**Reasoning:** Retrofitting billing/entitlement fields onto an existing users table later is
more painful than including inert fields now. Costs nothing at V0/V1 scale.

**Proposed free/paid split (not yet final):**
- Free: daily mission, basic progress tracking, capped AI messages/day
- Pro: unlimited mentor conversation, "go deeper"/"under the hood" drill-downs, Build Mode,
  weekly/monthly reviews, multi-day deep-dive series, stronger model for evaluations

**Status:** Directional only. Free-tier AI message cap not yet decided — open question.

---

## 2026-09-17 — Use Vercel AI SDK instead of hand-rolled AIService

**Decision:** Use the Vercel AI SDK as the AI provider abstraction layer (streaming,
multi-provider swap, tool calling) rather than building a custom `AIService` interface
from scratch as originally sketched in `product-context.md` §16.

**Reasoning:** Same architectural goal (swappable providers, controlled backend calls),
less code to maintain, native fit with the chosen Next.js/Vercel stack.

**Status:** Approved.

---

## 2026-09-17 — Knowledge graph as Postgres adjacency tables, not a graph DB

**Decision:** Model topic relationships/prerequisites as plain Postgres tables
(`topic_prerequisites`, `topic_relationships`) rather than introducing a dedicated graph
database (e.g. Neo4j).

**Reasoning:** Consistent with the project's own "avoid over-engineering / modular monolith"
principle (see `AGENTS.md`). Revisit only if query patterns genuinely require graph traversal
that Postgres recursive CTEs can't handle well at scale.

**Status:** Approved.

---

## 2026-09-17 — Deterministic vs AI-driven split

**Decision:**
- **Deterministic (rule-based, no LLM):** topic selection algorithm, streak calculation,
  difficulty-level progression
- **AI-driven:** conversational explanation/personalization, evaluation of open-ended
  answers and teach-back responses

**Reasoning:** Keeps cost and reliability predictable for the parts of the product users
depend on being consistent (progress, sequencing), while reserving the LLM for the parts
that genuinely need judgment/language understanding.

**Status:** Approved. Answers open question #10 in `product-context.md` §43.

---

## 2026-09-17 — Content pipeline: hand-written gold-standard topics first

**Decision:** Write/heavily edit ~15–20 canonical topics by hand across the core categories
before using AI-assisted generation for the rest of the topic library. These gold-standard
topics serve as few-shot templates/exemplars for generating additional topics.

**Reasoning:** Directly addresses the product's largest named risk (`product-context.md`
§38, "AI-generated content becoming generic or inaccurate") at low cost — cheaper than full
human review of everything, much better than free-form generation.

**Status:** Approved.

---

## 2026-09-17 — Rate limiting/caching deferred to post-V0

**Decision:** Skip Upstash Redis (or any rate-limiting/caching layer) for V0. Introduce it
once auth and persistent AI usage exist (V1+).

**Reasoning:** No abuse surface worth protecting yet if V0 has no accounts and is used by a
small test group.

**Status:** Approved.