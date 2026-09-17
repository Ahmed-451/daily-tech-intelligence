# Daily Tech Intelligence â€” Product + Technical Specification

## Document metadata

| Field | Value |
| --- | --- |
| Status | Approved Baseline |
| Purpose | Define the approved product direction, MVP boundaries, and implementation architecture before application work begins. |
| Last updated | 2026-09-09 |

## 1. Product vision

Daily Tech Intelligence helps students and early-career engineers understand how the technology around them actually works. It starts with familiar modern technologyâ€”such as YouTube, WhatsApp, Google Search, ChatGPT, UPI, Google Maps, Netflix, and Wi-Fiâ€”and progressively reveals the science, computer science, and engineering underneath.

It is not an AI article generator, news feed, generic quiz app, or a platform that primarily presents academic subject names. Engineering foundations remain the underlying learning system and knowledge model; the user-facing experience begins with curiosity about technology people already use.

The product guides a learner through a structured loop:

`Discover â†’ Learn â†’ Think â†’ Answer â†’ Evaluate â†’ Practice â†’ Remember â†’ Connect â†’ Progress`

The desired outcome is that, over time, users can reason clearly about familiar and unfamiliar technical systems, explain trade-offs, and apply conceptsâ€”not merely recognize definitions.

## 2. Target user for MVP

Primary MVP user:

- A CS student, recent graduate, or junior engineer.
- Comfortable with basic programming.
- Is curious about how everyday technology works and wants stronger systems, backend, database, networking, and general engineering reasoning.
- Has roughly 15â€“20 minutes per day.
- Wants structure without committing to a long course.

The MVP starts with 8â€“10 technology-driven missions backed by one focused starter curriculum, **Engineering Foundations for Modern Software**. The curriculum is an underlying knowledge framework, not the primary user-facing label. Its data model remains domain-agnostic for future AI/ML, cloud, security, frontend, mobile, hardware, and other curricula.

## 3. Core problem

Technical learners often consume fragmented content and use sophisticated technology without a usable mental model of what is happening beneath the interface:

- They read explanations but do not retrieve or apply knowledge.
- They learn tools before the principles beneath them.
- They do not know what to learn next.
- They receive little feedback on their reasoning.
- They forget concepts because learning is passive and disconnected.

The product solves both the gap between â€œI use this every dayâ€ and â€œI understand what is happening underneath,â€ and the gap between â€œI have seen this termâ€ and â€œI can reason about this system.â€

## 4. Core value proposition

In about 20 minutes, a learner starts with a familiar technology question, progressively uncovers the invisible system behind it, actively reasons about what changes under constraints, receives feedback, and connects the underlying concepts to other technologies.

Core promise:

> Understand how the technology around you actually worksâ€”and learn the engineering principles beneath it deeply enough to make better decisions.

## 5. Product principles

- **Reasoning over recall.** Definitions support learning; they are not the destination.
- **Active before passive.** Ask users to predict or explain before teaching.
- **Curiosity before terminology.** Start with a familiar technology or surprising question before naming the underlying subject area.
- **Start simple, never become inaccurate.** Simplifications and analogies must lead back to the correct technical mechanism.
- **Canonical content before AI improvisation.** Lessons are structured, reviewed, versioned source material.
- **AI enhances coaching.** AI adapts explanations and feedback; it does not define truth.
- **Progress represents capability.** Track evidence of understanding, application, retention, and explanation.
- **Simple, explainable personalization.** Early recommendations should be deterministic and inspectable.
- **Quality over catalog size.** A small set of excellent missions is more valuable than thousands of shallow topics.
- **Domain-agnostic architecture.** The first curriculum is narrow; the system must not encode â€œbackendâ€ assumptions.
- **Privacy and cost are product constraints.** Free access must have responsible limits.

## 6. MVP scope

The MVP includes:

- Marketing landing page.
- Email/social authentication.
- Lightweight onboarding.
- Short diagnostic assessment.
- One curated starter curriculum of 8â€“10 technology-driven missions.
- Daily Mission selection.
- Structured interactive missions:
  - curiosity hook and prediction;
  - system-level visual or representation;
  - canonical explanation with progressive depth;
  - applied challenge;
  - teach-back or recall;
  - completion.
- AI feedback for open-ended challenge and teach-back responses.
- Basic topic/concept progress.
- Topic history and a simple progress page.
- A minimal review queue, using fixed intervals.
- Internal analytics and operational logging.
- Admin/developer seed workflow for canonical content.

The MVP does not require an admin UI. Content can be authored in source-controlled structured files and seeded into the database.

## 7. Explicitly out-of-scope features

- Tech Radar, current-news ingestion, and trend classification.
- Social features, community, public profiles, and leaderboards.
- Native mobile apps.
- PWA notifications.
- Code execution environments or browser IDEs.
- Build-mode projects.
- Complex gamification, badges, levels, or virtual currency.
- Full visual knowledge graph.
- Adaptive spaced-repetition algorithms.
- Search and bookmarks.
- Multiple curriculum tracks at launch.
- Background-job platform unless a concrete scheduled workload requires it.
- Dedicated vector database, graph database, or microservices.
- Multi-provider AI routing.
- Arbitrary AI-generated lessons as canonical content.

## 8. Complete user journey

### First visit

1. User lands on the product page.
2. They understand the promise: short, active missions that develop engineering intuition.
3. They create an account.
4. They choose interests, experience level, goal, and daily time preference.
5. They complete a short diagnostic assessment.
6. The system assigns a starter curriculum and initial topic readiness.
7. The user begins their first technology-driven Daily Mission immediately.

### Returning user

1. User opens Home.
2. They see one recommended action:
   - todayâ€™s mission; or
   - a due review if it is more valuable.
3. They complete the mission: predict, see the system, learn, solve, receive feedback, teach back, and connect the concepts to other technologies.
4. The system records evidence and updates their learning state.
5. The user sees what improved and why a future mission is recommended.

### Missed-day behavior

There is no punitive streak system. The user returns to the next most valuable mission or review. The product should encourage continuity, not guilt.

## 9. Information architecture / page structure

```text
Public
â”œâ”€ /
â”œâ”€ /how-it-works
â”œâ”€ /privacy
â””â”€ /terms

Authentication
â”œâ”€ /sign-in
â””â”€ /auth/callback

Application
â”œâ”€ /onboarding
â”œâ”€ /assessment
â”œâ”€ /home
â”œâ”€ /learn/[sessionId]
â”œâ”€ /progress
â”œâ”€ /history
â””â”€ /settings
```

Navigation within the authenticated application should remain intentionally small:

- Home
- Progress
- History
- Settings

The mission experience should minimize navigation and distraction.

## 10. Onboarding flow

Onboarding should take under three minutes.

1. **Engineering interests**
   Multi-select domains: software engineering, systems, databases, networking, AI/ML, cloud, security, web, and mobile.

2. **Current experience**
   Beginner, CS student, graduate, junior engineer, mid-level+, or self-taught developer.

3. **Primary goal**
   Examples: understand everyday technology more deeply, become stronger at backend engineering, build systems intuition, prepare for engineering interviews, transition toward AI/ML.

4. **Available time**
   10, 20, 30, or 60+ minutes daily.

5. **Diagnostic assessment entry**
   Explain that it calibrates starting depth and does not grade the user.

Recommendation: store preferences as signals, never as hard constraints. Assessment performance and completed activity should eventually outweigh self-reported level.

**Alternative:** Collect a long profile with career history, languages, and detailed goals.
**Why not:** It creates onboarding drop-off and produces noisy data before the user sees value.

## 11. Diagnostic assessment design

The MVP assessment contains 6â€“8 questions, not 10+.

Question types:

- One multiple-choice conceptual question.
- Several scenario-based reasoning questions.
- One confidence rating after each answer.
- Optional open-ended explanation only if implementation capacity supports it.

Initial domains should be broad but lightweight:

- programming/runtime basics;
- databases;
- networking;
- systems;
- software design;
- debugging/performance.

Each question maps to one or more concepts and has:

- difficulty;
- expected answer/rubric;
- misconception tags;
- confidence prompt;
- scoring rule.

Output:

- Initial familiarity estimate per concept.
- Starter curriculum entry point.
- Optional â€œwe will begin hereâ€ explanation.

**Recommendation:** Start with deterministic scoring for assessment questions.
**Alternative:** Have AI grade all assessment responses.
**Why:** Deterministic scoring is cheaper, comparable, faster, and sufficient to place users approximately. AI grading can be introduced for selected open-ended answers later.

## 12. Daily Mission UX

A mission should take 12â€“20 minutes. It begins with a familiar technology question and uses one focused concept or tightly connected set of concepts beneath that experience.

### Mission stages

1. **Curiosity Hook**
   Start with a familiar technology or surprising question, such as: â€œHow does YouTube start your video in less than a second?â€

2. **Predict**
   The learner states what they think happens before any explanation.

3. **See the System**
   Show a simple, technically accurate system-level representation, such as `Viewer â†’ nearby CDN â†’ video segments â†’ player`, before introducing detailed terminology.

4. **Understand the Mental Model**
   Explain the core idea in accessible, technically accurate language. Use analogies only when they improve understanding.

5. **Under the Hood / Why It Works**
   Progressively reveal the canonical mechanisms and underlying computer-science, science, or engineering principle. A topic may stop at the depth appropriate for the MVP.

6. **Engineering Trade-offs**
   Explain why this system is designed this way, including relevant trade-offs such as latency versus throughput, cost versus performance, consistency versus availability, accuracy versus compute, or security versus convenience.

7. **Apply / Experiment**
   Give the learner a changed-condition scenario that requires reasoning about the system.

8. **AI Evaluation**
   Provide coaching feedback against the canonical rubric. The learner may request one hint before feedback.

9. **Teach Back**
   Ask the learner to explain the concept in their own words for a selected audience.

10. **Connect and Complete**
    Show related concepts and where the same principle appears elsewhere, then update evidence-based learning state.

The lesson should support optional â€œGo deeperâ€ material, but it must not make all depth levels mandatory to complete the mission.

## 13. Learning loop

| Product stage | MVP implementation |
| --- | --- |
| Discover | Home presents one familiar-technology question as the recommended mission |
| Learn | Canonical structured lesson, beginning with a simple system model |
| Think | Prediction prompt before explanation |
| Answer | User submits scenario response |
| Evaluate | Rubric-guided AI feedback |
| Practice | Applied challenge |
| Remember | Fixed-interval review prompts |
| Connect | Show prerequisite, related concepts, and cross-technology applications |
| Progress | Update topic and concept evidence |

**Recommendation:** Implement the full loop in a minimal form from the start.
**Alternative:** Launch as static lessons, adding interaction later.
**Why:** Active reasoning is the productâ€™s key hypothesis; removing it would validate the wrong product.

## 14. Topic/content model

A topic is a versioned learning unit with a user-facing technology question and an underlying concept model. For example, â€œHow does YouTube start your video in less than a second?â€ can teach CDNs, caching, latency, compression, and adaptive bitrate streaming.

Each topic contains:

```text
identity
â”œâ”€ id, slug, user-facing question, domain, status
curriculum metadata
â”œâ”€ difficulty, estimated duration, learning objectives
relationships
â”œâ”€ concepts, prerequisites, related topics
canonical lesson
â”œâ”€ curiosity hook and prediction prompt
â”œâ”€ simple mental model and system representation
â”œâ”€ explanation blocks
â”œâ”€ under-the-hood blocks
â”œâ”€ technical mechanisms and why-it-works explanation
â”œâ”€ examples
â”œâ”€ trade-offs
assessment
â”œâ”€ challenge prompt
â”œâ”€ challenge rubric
â”œâ”€ teach-back prompt
â””â”€ recall prompts
quality
â”œâ”€ author/reviewer metadata
â”œâ”€ sources
â””â”€ version
```

Content supports progressive depth:

| Level | Purpose |
| --- | --- |
| Level 1 â€” Intuition | Explain the idea to a smart learner without prior study. |
| Level 2 â€” Engineering | Explain what is actually happening inside the system. |
| Level 3 â€” Under the Hood | Explain the computer, network, hardware, or model mechanisms. |
| Level 4 â€” Engineering Trade-offs | Explain design choices and their consequences. |

Not every MVP topic must expose all four levels. The content model supports progressive depth without requiring it.

Canonical content should be authored in version-controlled JSON or MDX-with-frontmatter files, then seeded into the database as immutable topic versions. The structured content, rather than additional database tables, stores the question hook, system representation, depth blocks, misconceptions, applied scenarios, cross-technology connections, sources, and quality status.

**Recommendation:** Source-controlled content plus database snapshots.
**Alternative:** Database-only CMS content.
**Why:** Git review, diffs, rollback, developer-authored schema validation, and reproducibility matter more than editorial workflow in an early-stage product. A CMS can be added when non-technical editors become a real requirement.

## 15. Concept/prerequisite model

A concept is a reusable unit of technical understanding, independent of a lesson.

Examples of reusable concepts:

- transaction;
- durability;
- write-ahead log;
- crash recovery;
- TCP;
- congestion control.

Relationships:

- Topic â†” Concept: many-to-many.
- Topic â†’ Topic prerequisite: directed many-to-many.
- Concept â†’ Concept relation: directed, typed relationship:
  - prerequisite;
  - part-of;
  - related-to;
  - applied-by;
  - contrasts-with.

The model records recurring concepts rather than only course chapters. For example, caching connects DNS, browsers, CDNs, databases, and CPUs; latency connects networking, distributed systems, databases, and cloud systems. The graph remains relational and invisible in the MVP; it powers progression, recommendations, and the missionâ€™s â€œConnectâ€ step.

### 15.1 Starter curriculum mapping

The first 8â€“10 missions should be presented as technology-driven questions while mapping to reusable foundations. The exact content remains subject to canonical-content review.

| User-facing mission | Underlying concepts |
| --- | --- |
| How does a website appear after you enter a URL? | DNS, HTTP, TLS, servers, latency |
| How does YouTube start a video so quickly? | CDNs, caching, compression, adaptive bitrate streaming, networking |
| What happens when you send a WhatsApp message? | packets, routing, protocols, queues, reliability, distributed systems |
| How does Google Search find useful pages among billions? | crawling, indexing, ranking, distributed search |
| How does ChatGPT generate the next word? | tokens, embeddings, attention, transformers, probability |
| How can UPI move money between banks quickly? | APIs, authentication, transactions, idempotency, distributed systems |
| How does Google Maps find a good route? | graphs, shortest-path algorithms, GPS, routing |
| How does Netflix serve different video quality to millions of viewers? | codecs, CDNs, adaptive streaming, capacity, cost/performance trade-offs |
| How can Wi-Fi let many devices share the air? | radio waves, frequency, modulation, channels, collision avoidance |

This mapping demonstrates the architectural separation: user-facing learning is technology-driven, while the underlying knowledge structure remains reusable and domain-agnostic.

**Recommendation:** Model relationships in PostgreSQL join tables.
**Alternative:** Introduce a graph database.
**Why:** Relational tables cleanly support the MVP and preserve a future graph model without operational overhead. A graph database is only justified by proven query or scale needs.

## 16. User learning-state model

Learning state should be evidence-based rather than a single â€œmastery score.â€

For each user-topic and user-concept relationship, maintain:

- `exposure`: encountered the content.
- `understanding`: evidence from questions and feedback.
- `application`: evidence from applied challenges.
- `explanation`: evidence from teach-backs.
- `retention`: evidence from later reviews.
- `confidence`: learner self-report, separate from measured evidence.
- `last_seen_at`.
- `next_review_at`.
- `state_version`.

Each dimension is a bounded numeric score with an evidence count and timestamp. Scores are derived from attempts rather than invented by AI.

**Recommendation:** Separate dimensions and retain underlying attempts.
**Alternative:** One opaque mastery score.
**Why:** Separate dimensions produce better recommendations, clearer user feedback, and auditable scoring.

## 17. Progress model

The MVP progress UI should show:

- Missions completed.
- Concepts explored.
- Current starter curriculum position.
- A small set of topic areas with qualitative status:
  - not started;
  - exploring;
  - practicing;
  - strengthening.
- Due reviews.
- Recent strengths and misconceptions.
- Related technologies where a learned concept reappears.

Do not display false precision such as â€œyou are 73% proficient at distributed systems.â€ The early product will not have enough evidence to support it.

**Recommendation:** Use clear qualitative labels backed by evidence.
**Alternative:** Detailed numerical dashboards.
**Why:** Detailed metrics imply scientific validity the system does not yet possess and distract from the next learning action.

## 18. Topic selection algorithm

The MVP uses a deterministic, explainable scoring function to select a technology-driven mission whose underlying prerequisites are ready.

```text
score(topic) =
  prerequisiteReadiness
+ reviewUrgency
+ learnerInterestFit
+ curriculumSequenceFit
+ noveltyBonus
- recentlyCompletedPenalty
- difficultyMismatchPenalty
```

Rules:

1. If a review is due, prioritize it when it is not excessively difficult.
2. Only select topics whose required prerequisites are satisfied or explicitly included as a refresher.
3. Prefer the current curriculum sequence.
4. Use stated interests as a tie-breaker.
5. Avoid repeated domain concentration unless a learner intentionally pursues it.
6. Save the score components that produced each recommendation.

**Recommendation:** Deterministic rules first.
**Alternative:** ML recommendation system or AI-selected topics.
**Why:** There will be insufficient data for ML, and AI topic selection would be difficult to audit, expensive, and inconsistent. Rules can later provide features for a learned model.

## 19. AI mentor architecture

```text
Browser
  â†’ Next.js server action / route handler
  â†’ application AI service
  â†’ provider adapter
  â†’ LLM provider
```

The browser never receives provider credentials.

The AI service receives only explicitly assembled context:

- topic version, technology/question hook, and learning objectives;
- the relevant prompt;
- evaluation rubric;
- learner response;
- compact, relevant learning history;
- request type and usage budget.

Initial AI capabilities:

- challenge feedback;
- teach-back feedback;
- short hints;
- optional explanation simplification or depth adaptation from canonical content.

AI must not invent or silently replace canonical explanations of how a technology works.

The AI provider interface isolates implementation:

```ts
interface MentorProvider {
  evaluate(input: EvaluationInput): Promise<EvaluationResult>
  generateHint(input: HintInput): Promise<HintResult>
  adaptExplanation(input: ExplanationInput): Promise<ExplanationResult>
}
```

**Recommendation:** One provider behind a small adapter.
**Alternative:** Immediate support for multiple providers and model routing.
**Why:** An abstraction prevents lock-in without building an unnecessary platform. Routing becomes useful only when actual cost, quality, or availability data exists.

## 20. AI evaluation/rubric architecture

Each evaluable prompt has an author-defined rubric with:

- learning objective;
- required ideas;
- optional strong ideas;
- common misconceptions;
- unacceptable claims;
- scoring dimensions;
- feedback constraints;
- hint ladder.

Example dimensions:

- conceptual correctness;
- causal reasoning;
- trade-off awareness;
- technical clarity;
- completeness.

The model receives the rubric and returns a validated structured result:

```text
overall_band: needs_support | developing | solid | strong
dimension_scores
strengths[]
missing_ideas[]
misconceptions[]
feedback
hint
recommended_next_action
```

AI feedback must say that it is coaching feedback, not an objective certification of skill.

**Recommendation:** AI evaluates against a fixed rubric and constrained schema.
**Alternative:** Open-ended â€œgrade this answerâ€ prompting.
**Why:** Rubrics reduce hallucinated criteria, make feedback consistent, permit prompt testing, and retain human control over learning outcomes.

## 21. AI safety, abuse prevention, and cost controls

Required MVP controls:

- Server-only provider API keys.
- Authenticated AI endpoints only.
- Per-user request and token budgets.
- Maximum answer, context, and completion sizes.
- Rate limit per account and IP.
- Daily AI usage records.
- Input validation and output schema validation.
- Structured context; do not pass arbitrary database history.
- Prompt-injection resistance:
  - isolate user content as untrusted input;
  - never allow it to override system/rubric instructions;
  - do not expose internal prompts or secrets.
- Provider failure fallback.
- Ability to disable AI features globally.
- Operational dashboards or queryable logs for spend and failure rate.

**Recommendation:** Enforce quotas in the application/database layer initially.
**Alternative:** Add a dedicated rate-limiting service immediately.
**Why:** Application-level controls are sufficient for early traffic and reduce infrastructure. A managed limiter becomes appropriate when load or abuse demonstrates need.

## 22. Database schema

### Identity and preferences

| Table | Important fields | Relationships / indexes |
| --- | --- | --- |
| `profiles` | `user_id`, `display_name`, `onboarding_completed_at` | PK/FK to auth user; index onboarding state |
| `learning_preferences` | `user_id`, `daily_minutes`, `experience_level`, `goal` | one-to-one with profile |
| `user_interests` | `user_id`, `domain_id`, `weight` | unique `(user_id, domain_id)` |

### Content and curriculum

| Table | Important fields | Relationships / indexes |
| --- | --- | --- |
| `domains` | `id`, `slug`, `name`, `description` | unique slug |
| `curricula` | `id`, `slug`, `title`, `status` | unique slug |
| `curriculum_topics` | `curriculum_id`, `topic_id`, `sequence_position`, `required` | unique `(curriculum_id, topic_id)`; index sequence |
| `topics` | `id`, `slug`, `domain_id`, `title`, `difficulty`, `status`, `current_version_id` | `title` is the user-facing technology question; unique slug; indexes `(domain_id, status)`, difficulty |
| `topic_versions` | `id`, `topic_id`, `version`, `content_json`, `learning_objectives_json`, `estimated_minutes`, `published_at` | `content_json` carries structured hooks, system views, depth blocks, mechanisms, trade-offs, misconceptions, and connections; unique `(topic_id, version)` |
| `concepts` | `id`, `slug`, `domain_id`, `name`, `description` | unique slug; index domain |
| `topic_concepts` | `topic_id`, `concept_id`, `role`, `importance` | unique `(topic_id, concept_id)` |
| `topic_prerequisites` | `topic_id`, `prerequisite_topic_id`, `required` | unique pair; indexes both directions |
| `concept_relations` | `source_concept_id`, `target_concept_id`, `relation_type` | unique typed pair; indexes both concepts |
| `content_sources` | `id`, `topic_version_id`, `title`, `url`, `source_type` | index topic version |

### Assessment

| Table | Important fields | Relationships / indexes |
| --- | --- | --- |
| `assessment_questions` | `id`, `domain_id`, `prompt`, `question_type`, `answer_key_json`, `rubric_json`, `difficulty`, `active` | index active/domain |
| `assessment_question_concepts` | `question_id`, `concept_id`, `weight` | unique pair |
| `assessment_attempts` | `id`, `user_id`, `started_at`, `completed_at`, `result_json` | index `(user_id, completed_at desc)` |
| `assessment_responses` | `attempt_id`, `question_id`, `answer_json`, `confidence`, `score`, `feedback_json` | unique `(attempt_id, question_id)` |

### Sessions, attempts, and learning state

| Table | Important fields | Relationships / indexes |
| --- | --- | --- |
| `learning_sessions` | `id`, `user_id`, `topic_id`, `topic_version_id`, `kind`, `status`, `started_at`, `completed_at`, `selection_reason_json` | indexes `(user_id, status)`, `(user_id, completed_at desc)`, topic |
| `session_steps` | `id`, `session_id`, `step_type`, `position`, `status`, `started_at`, `completed_at` | unique `(session_id, position)` |
| `question_attempts` | `id`, `user_id`, `session_id`, `step_id`, `prompt_key`, `response_text`, `attempt_number`, `result_json` | index `(session_id, step_id)` |
| `user_topic_progress` | `user_id`, `topic_id`, dimension scores, evidence counts, `last_seen_at`, `next_review_at` | unique `(user_id, topic_id)`; indexes `(user_id, next_review_at)`, topic |
| `user_concept_progress` | `user_id`, `concept_id`, dimension scores, evidence counts, `last_seen_at`, `next_review_at` | unique `(user_id, concept_id)`; indexes `(user_id, next_review_at)`, concept |
| `review_schedule` | `id`, `user_id`, `topic_id`, `due_at`, `status`, `interval_days`, `source_session_id` | index `(user_id, status, due_at)` |

### AI, operations, and feedback

| Table | Important fields | Relationships / indexes |
| --- | --- | --- |
| `ai_interactions` | `id`, `user_id`, `session_id`, `kind`, `model`, `input_tokens`, `output_tokens`, `status`, `latency_ms`, `created_at` | indexes `(user_id, created_at)`, `(status, created_at)` |
| `ai_usage_daily` | `user_id`, `usage_date`, `requests`, `input_tokens`, `output_tokens` | unique `(user_id, usage_date)` |
| `content_feedback` | `id`, `user_id`, `topic_version_id`, `kind`, `detail`, `status`, `created_at` | index status/date |
| `audit_events` | `id`, `actor_user_id`, `event_type`, `entity_type`, `entity_id`, `metadata_json`, `created_at` | indexes entity/date and actor/date |

Database rules:

- Use UUID primary keys.
- Use UTC timestamps.
- Apply foreign keys and restrictive deletion policies to preserve learning history.
- Keep raw free-text answers only as long as privacy policy permits.
- Store mutable content separately from immutable version snapshots used by sessions.

## 23. Authentication and authorization model

Use Supabase Auth for identity and PostgreSQL row-level security for data access.

Roles:

- `learner`: own profile, attempts, sessions, progress, and feedback.
- `content_admin`: manages canonical content and publishing.
- `service`: server-side role used only for controlled internal operations.

Authorization principles:

- The browser accesses user-scoped data through authenticated Supabase sessions and row-level security.
- Sensitive actionsâ€”AI calls, topic selection, quotas, score updates, and content publishingâ€”run server-side.
- The service role key is never exposed to the browser.
- Content published for learners is readable; draft content is restricted.

**Recommendation:** Supabase Auth with database-enforced RLS.
**Alternative:** Auth.js plus independently managed database authorization.
**Why:** Supabase reduces MVP implementation time while pairing identity with an authorization model that remains useful as the product grows.

## 24. API/server architecture

Use Next.js Server Actions for product form mutations where appropriate, and Route Handlers for explicit APIs, integrations, or streaming.

Server modules:

```text
server/
â”œâ”€ auth/
â”œâ”€ db/
â”œâ”€ services/
â”‚  â”œâ”€ onboarding-service
â”‚  â”œâ”€ assessment-service
â”‚  â”œâ”€ topic-selection-service
â”‚  â”œâ”€ learning-session-service
â”‚  â”œâ”€ progress-service
â”‚  â”œâ”€ review-service
â”‚  â””â”€ ai-mentor-service
â”œâ”€ repositories/
â””â”€ validation/
```

Representative operations:

- `POST /api/onboarding/complete`
- `POST /api/assessment/submit`
- `POST /api/missions/create`
- `POST /api/sessions/:id/steps/:stepId/respond`
- `POST /api/sessions/:id/complete`
- `POST /api/ai/evaluate`
- `GET /api/home`
- `GET /api/progress`

**Recommendation:** Modular monolith in Next.js.
**Alternative:** Separate REST/FastAPI backend.
**Why:** A separate backend adds deployment, authentication, contract, observability, and operational complexity before the domain has earned it. Domain modules keep an extraction path available later.

## 25. Internal analytics/event model

Track product events, not vanity events.

Core events:

```text
account_created
onboarding_started
onboarding_completed
assessment_started
assessment_completed
mission_recommended
mission_started
mission_step_completed
challenge_submitted
ai_feedback_received
teachback_submitted
mission_completed
review_due
review_started
review_completed
mission_abandoned
content_feedback_submitted
ai_quota_reached
```

Common event fields:

- `user_id` or anonymous session identifier;
- timestamp;
- topic and topic version;
- curriculum;
- mission/session ID;
- event properties;
- application version.

**Recommendation:** Record a minimal first-party event log and add a dedicated analytics vendor after event definitions stabilize.
**Alternative:** Introduce PostHog immediately.
**Why:** Analytics tooling is useful, but early metric changes are likely. Start with an internal schema that preserves essential data and avoid premature vendor coupling.

## 26. Error handling and fallback behavior

| Failure | User behavior | System behavior |
| --- | --- | --- |
| AI response fails/times out | Preserve answer; show canonical rubric-based guidance or retry | Log failure; do not mark response failed permanently |
| AI quota exceeded | Explain daily limit and offer non-AI mission completion | Record quota event; prevent additional spend |
| Topic content invalid | Do not start mission; show generic unavailable state | Validate at publish/seed time; alert internally |
| Session save fails | Show retry state; do not claim completion | Idempotent mutation retries where safe |
| Authentication expires | Redirect to sign-in, preserving intended return path | No private data leaked |
| Database issue | Friendly generic error | Log correlation ID and monitor |
| Assessment interrupted | Resume unfinished attempt | Persist progress per response |

The product must never silently discard a learnerâ€™s response or present AI feedback as if it were saved when it was not.

## 27. Testing strategy

### Unit tests

Prioritize business logic:

- assessment scoring;
- topic eligibility and selection;
- progress updates;
- review scheduling;
- quota enforcement;
- validation;
- AI result parsing.

### Integration tests

Test:

- database migrations and constraints;
- row-level security policies;
- content seeding;
- session lifecycle;
- API authorization;
- idempotency and error paths.

### End-to-end tests

Cover the critical user journey:

1. sign up;
2. complete onboarding;
3. complete assessment;
4. start mission;
5. submit responses;
6. receive mocked AI feedback;
7. complete mission;
8. see updated progress.

### Content and prompt tests

- Schema validation of every topic version.
- Rubric completeness checks.
- Snapshot/fixture tests for representative AI outputs.
- Adversarial prompt-injection inputs.
- Human review of a small benchmark set before release.

**Recommendation:** Test domain rules heavily and keep UI testing focused on critical flows.
**Alternative:** Pursue exhaustive component-level tests.
**Why:** Recommendation, scoring, and authorization bugs are more consequential than minor visual regressions at this stage.

## 28. Security considerations

- HTTPS-only deployment.
- No client-side secrets.
- Row-level security on all user-scoped tables.
- Server-side authorization for sensitive mutations.
- Schema validation at all boundaries.
- CSRF protections appropriate to the authentication approach.
- Output encoding and safe Markdown rendering to prevent XSS.
- Rate limits on authentication, submissions, and AI endpoints.
- Audit logs for content publication and privileged actions.
- Dependency scanning and routine updates.
- Minimal collection of personal data.
- Defined retention policy for free-text learning answers and AI logs.
- Privacy policy that explains AI processing and content storage.
- No security claims about â€œobjective skill measurement.â€

## 29. Technology stack with justification

| Area | Recommendation | Alternative | Why this choice |
| --- | --- | --- | --- |
| Web app | Next.js + TypeScript | Separate React SPA and API | One deployment and codebase, server rendering, mature ecosystem |
| UI | Tailwind CSS with a small component layer | Heavy design system | Fast, consistent MVP UI without locking into a large abstraction |
| Database/auth | Supabase PostgreSQL + Auth | Auth.js + hosted PostgreSQL | Fast authentication, PostgreSQL, RLS, and managed operations |
| Validation | Zod | Ad hoc TypeScript types | Runtime boundary validation alongside typed interfaces |
| AI | One provider via server-side adapter | Multi-provider router | Lowest operational complexity while avoiding hard coupling |
| Canonical content | Source-controlled JSON/MDX, database snapshots | CMS-only authoring | Versioning and review preserve accurate progressive explanations while keeping editorial tooling simple |
| Tests | Vitest + integration/E2E tool selected during scaffold | No automated tests initially | Protects core learning and authorization logic from the first release |
| Hosting | Vercel or equivalent Next.js host | Containers/Kubernetes | Managed deployment suits a modular monolith |
| Observability | Structured server logs first; add Sentry when deployed | Full observability suite | Enough signal without premature vendor complexity |

## 30. Repository/folder structure

```text
src/
â”œâ”€ app/
â”‚  â”œâ”€ (marketing)/
â”‚  â”œâ”€ (auth)/
â”‚  â”œâ”€ (product)/
â”‚  â”‚  â”œâ”€ onboarding/
â”‚  â”‚  â”œâ”€ assessment/
â”‚  â”‚  â”œâ”€ home/
â”‚  â”‚  â”œâ”€ learn/[sessionId]/
â”‚  â”‚  â”œâ”€ progress/
â”‚  â”‚  â”œâ”€ history/
â”‚  â”‚  â””â”€ settings/
â”‚  â””â”€ api/
â”œâ”€ components/
â”‚  â”œâ”€ ui/
â”‚  â”œâ”€ learning/
â”‚  â”œâ”€ assessment/
â”‚  â””â”€ progress/
â”œâ”€ features/
â”‚  â”œâ”€ onboarding/
â”‚  â”œâ”€ assessment/
â”‚  â”œâ”€ topics/
â”‚  â”œâ”€ learning/
â”‚  â”œâ”€ progress/
â”‚  â””â”€ reviews/
â”œâ”€ server/
â”‚  â”œâ”€ auth/
â”‚  â”œâ”€ db/
â”‚  â”œâ”€ repositories/
â”‚  â”œâ”€ services/
â”‚  â”œâ”€ ai/
â”‚  â””â”€ validation/
â”œâ”€ lib/
â”œâ”€ types/
â””â”€ styles/

content/
â”œâ”€ domains/
â”œâ”€ curricula/
â””â”€ topics/

supabase/
â”œâ”€ migrations/
â”œâ”€ seed/
â””â”€ policies/

tests/
â”œâ”€ unit/
â”œâ”€ integration/
â”œâ”€ e2e/
â””â”€ fixtures/

docs/
```

## 31. Development roadmap

### Phase 0 â€” Specification approval

- Approve MVP user, starter curriculum, mission loop, content schema, and AI boundaries.
- Define 8â€“10 canonical, technology-driven missions and their rubrics before application implementation.

### Phase 1 â€” Foundation

- Scaffold application.
- Configure Supabase, environment validation, authentication, database migrations, RLS, and test baseline.
- Create design primitives and shell pages.

### Phase 2 â€” Content and assessment

- Implement content schema and seed pipeline.
- Create starter curriculum content.
- Build onboarding and deterministic assessment.

### Phase 3 â€” Learning session

- Implement mission selection.
- Build the complete no-AI session lifecycle.
- Persist attempts, completion, history, and progress.

### Phase 4 â€” AI mentor

- Add constrained evaluation, hints, quotas, logs, and fallbacks.
- Validate feedback quality against sample responses.

### Phase 5 â€” Review and progress

- Add fixed-interval reviews.
- Build progress and history views.
- Add analytics events and pilot instrumentation.

### Phase 6 â€” Pilot and iteration

- Recruit a small user cohort.
- Evaluate completion, return behavior, content quality, and cost.
- Improve curriculum and loop before adding major features.

## 32. MVP success metrics

Primary metric:

> Weekly active learners who complete at least two missions and return the following week.

Supporting metrics:

- Onboarding-to-first-mission completion rate.
- First-mission completion rate.
- Median mission completion time.
- Day-7 return rate.
- Share of learners completing an applied challenge.
- Share of learners completing teach-back.
- Review completion rate.
- AI feedback usefulness rating.
- Cost per completed mission.
- Content-error reports per completed mission.
- Percentage of recommendations accepted and completed.

A reasonable initial validation threshold is not mass sign-up volume; it is evidence that a small cohort voluntarily returns and completes multiple missions.

## 33. Major technical/product risks

- **Content quality risk:** Canonical lessons may still be generic, inaccurate, too long, or use familiar technologies as superficial wrappers rather than revealing real mechanisms.
- **Retention risk:** Users may enjoy one mission but not form a recurring habit.
- **Assessment validity risk:** Early scoring may incorrectly place learners.
- **Evaluation credibility risk:** AI feedback may feel vague, overly agreeable, or unfair.
- **Cost risk:** Open-ended AI interaction can make a free product unsustainable.
- **Scope risk:** The product plan can become a full learning platform before validating one mission loop.
- **Curriculum risk:** A focused starter path may exclude users who expect broad domain coverage immediately, while overly broad technology examples can dilute conceptual progression.
- **Progress-model risk:** Showing mastery-like scores without enough evidence undermines trust.
- **Operational risk:** Content versioning and review may become the bottleneck, not engineering.
- **Privacy risk:** Free-text explanations can reveal personal or workplace-sensitive information.
- **Motivation risk:** â€œDailyâ€ can feel like another obligation rather than useful learning.

## 34. Decisions that still require human approval

See [Open decisions](#c-open-decisions) at the end. No architectural changes should be made until those decisions are approved.

# A. What I think we are getting wrong

The largest risk is that this is still being framed as a broad platform before proving a small, specific behavior: will a learner repeatedly spend 15 minutes discovering the invisible system behind technology they use and reasoning through its trade-offs?

Several parts of the vision sound valuable but can conceal the hard work:

- **â€œAI mentorâ€ is not a differentiator by itself.** Users will quickly notice generic praise, shallow feedback, or hallucinated technical claims. The real product is curriculum quality and carefully designed prompts.
- **Familiar technology can become a gimmick.** â€œHow does Netflix work?â€ is compelling only if the mission genuinely leads to durable, reusable engineering models instead of a collection of fun facts.
- **The product may over-promise universal accessibility.** Starting from intuition does not remove the need for deliberate progression; some concepts require careful prerequisites and multiple exposures.
- **A knowledge graph is not a moat at launch.** A few relational prerequisites are useful. A graph becomes meaningful only after substantial, trustworthy learning evidence exists.
- **Progress can become theater.** Percentages and levels will be misleading without validated assessment design. It is better to show completed evidence and current learning direction.
- **Broad domain coverage is a trap.** Supporting systems, networking, databases, cloud, security, AI/ML, frontend, and mobile means producing and maintaining several distinct curricula. One high-quality path is difficult enough.
- **â€œDailyâ€ may be the wrong promise.** The learnerâ€™s real need is regular, high-value practice. A missed day should not feel like failure, and forcing daily content can encourage shallow missions.
- **The full learning loop is cognitively demanding.** Prediction, explanation, challenge, feedback, teach-back, and review cannot all be equally deep in 20 minutes. The mission needs ruthless editorial discipline.
- **Content operations may dominate application work.** A platform with weak canonical topics will not be rescued by polished UI or sophisticated AI.
- **Free AI is a business model decision, not merely an engineering concern.** Product limits, quality expectations, and cost per mission must be decided together.

# B. MVP I would actually ship

I would ship a deliberately smaller validation product:

- Authentication.
- A 6â€“8 question diagnostic assessment with deterministic scoring.
- One 8â€“10 mission starter curriculum, presented as familiar technology questions rather than academic chapters.
- A first mission that demonstrates the promise immediatelyâ€”for example, â€œHow does YouTube start your video so quickly?â€â€”and reveals caching, CDNs, latency, and trade-offs.
- One mission format:
  1. curiosity hook and prediction;
  2. simple system view and canonical mental model;
  3. one under-the-hood mechanism where appropriate;
  4. applied scenario;
  5. AI rubric feedback;
  6. one-sentence teach-back and a cross-technology connection.
- Topic history and minimal evidence-based completion state.
- One simple next-mission recommendation based on curriculum order, prerequisites, and completion.
- One fixed review prompt two days after completion.
- Hard daily AI limit.
- Internal event logging.
- Manual content authoring and seeding.

I would defer detailed progress dashboards, graph visualization, sophisticated selection, and additional curricula until users demonstrate repeat use.

This version validates the essential claim: technology-driven, active missions make learners want to return and help them form reusable engineering mental models.

# C. Open decisions

1. **Canonical content ownership:** Decide who will author and technically review the first 8â€“10 missions, rubrics, diagrams/system representations, and sources.

2. **Initial mission set:** Select and prioritize the first 8â€“10 technology-driven questions from the proposed mapping.

3. **AI provider and budget:** Choose the initial provider and set an acceptable per-user daily AI quota/cost target.

4. **Success threshold:** Define the pilot cohort size and what retention/completion behavior would justify expanding the product.
