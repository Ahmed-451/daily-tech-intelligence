# Daily Tech Intelligence — Product Vision & Technical Plan

> **Purpose:** Long-term project context for building a public, free-to-use AI-powered technical learning platform that helps users develop deep engineering intuition rather than merely consume technical content.
>
> **Status note (2026-09-17):** This document is the original long-term vision (sections 1–45).
> An immediate **V0 pre-MVP scope** has since been layered on top — see **Section 0** below —
> to validate the core loop before building the full V1 MVP. See `DECISIONS_LOG.md` for the
> reasoning behind every deviation from the original plan, recorded as it happens.

---

# 0. V0 — Immediate Build Target (Pre-MVP)

Before building the V1 MVP in Section 29, ship a lean V0 to validate that the interactive
learning loop is actually compelling, with minimal infrastructure investment.

**V0 includes:**

- No authentication
- No onboarding flow
- No diagnostic assessment
- A small hand-curated topic set (10–15 topics, stored as static JSON/hardcoded — not
  DB-driven yet), covering a spread of the categories in Section 12
- The daily mission loop end-to-end: Hook → Think → Learn → Under the Hood → Challenge →
  AI Evaluation → Teach-back (Section 10), running through a real server-side AI mentor route
- Progress = local-only state (streak count, topics completed) — browser storage, no backend
  persistence

**V0 excludes (deferred to V1+):** accounts, DB-backed profiles, diagnostic assessment,
knowledge graph, spaced repetition, weekly/monthly reviews, rate limiting infrastructure.

**Success criterion:** real users (5–10) voluntarily return and report the loop itself —
being asked to think before being taught, then evaluated, then teaching it back — feels
valuable. If that's not true in this minimal form, no amount of additional engineering
(knowledge graph, spaced repetition, adaptive scoring) will fix it.

Once validated, proceed to Section 29 (V1 — MVP) as originally scoped.

---

# 0.1 Architecture Decisions Layered on the Original Plan

These decisions refine (but do not contradict) the tech stack in Section 33 and the
architecture questions in Section 43. Full reasoning for each is in `DECISIONS_LOG.md`.

- **AI provider abstraction:** use the **Vercel AI SDK** rather than hand-rolling the
  `AIService` interface sketched in Section 16 — same goal (swappable providers, streaming,
  backend-only calls), less custom code, native fit with Next.js/Vercel.
- **Knowledge graph storage:** plain **Postgres adjacency tables**
  (`topic_prerequisites`, `topic_relationships`) — no dedicated graph database. Revisit only
  if query patterns genuinely outgrow recursive CTEs.
- **Deterministic vs AI-driven split** (answers open question in Section 43 #10):
  - Deterministic: topic selection algorithm, streak calculation, difficulty progression
  - AI-driven: conversational explanation/personalization, evaluation of open-ended answers
    and teach-back
- **Content pipeline:** hand-write/heavily edit ~15–20 gold-standard topics first; use them
  as few-shot templates for AI-assisted generation of the remaining library, rather than
  free-form AI generation (directly addresses the risk named in Section 38).
- **Rate limiting / caching:** deferred until V1+ when accounts exist; likely
  **Upstash Redis** (serverless, Vercel-native) when it's needed.
- **Freemium scaffolding:** add a `plan` (`free`/`pro`) field and a lightweight
  `ai_usage`/`usage_events` table to the schema as soon as a database exists, with all
  limits left unenforced until pricing is finalized. Proposed (not final) split:
  - **Free:** daily mission, basic progress tracking, capped AI messages/day
  - **Pro:** unlimited mentor conversation, "go deeper" drill-downs, Build Mode, weekly/
    monthly reviews, multi-day deep-dive series, stronger model for evaluations
  - **Open question:** exact free-tier daily AI-message cap — not yet decided.

---

## 1. Product Vision

The original idea is a daily technology-learning chat for a Computer Science graduate interested in Software Development, AI/ML, systems, cloud, networking, databases, and emerging technologies.

The refined product should **not** be positioned as simply:

> "A website that gives you an AI-generated tech topic every day."

Instead:

> **A personal technical-learning system that progressively builds engineering intuition.**

Think of the experience as a combination of:

- Daily technical learning
- Interactive questioning
- AI mentorship
- Adaptive curriculum
- Spaced repetition
- Knowledge mapping
- Practical engineering challenges
- Progress tracking
- Current technology awareness

The core promise should be:

> **Spend ~20 minutes learning and become a better engineer.**

---

# 2. Core Learning Loop

The central product loop is:

**Discover → Learn → Think → Answer → Get evaluated → Practice → Remember → Connect → Progress**

A typical session:

1. Introduce a compelling technical topic.
2. Give the user a question/problem before revealing the answer.
3. Let the user reason.
4. Teach the concept.
5. Explain what happens under the hood.
6. Show real-world applications.
7. Explore trade-offs and failure scenarios.
8. Give a practical challenge.
9. Evaluate the user's reasoning.
10. Ask the user to teach the concept back.
11. Update their knowledge/progress.
12. Schedule future review.
13. Use the result to choose better future topics.

The product should feel like **learning + engineering mentorship + technical interview reasoning**, not like reading an AI-generated article.

---

# 3. Target Users

Primary audience:

- Computer Science students
- Recent graduates
- Junior software engineers
- Developers transitioning into AI/ML
- Developers who want stronger systems knowledge
- Engineers who want broad technical awareness
- Self-taught developers who want structured CS depth

Potential future audience:

- Mid-level engineers
- Senior engineers wanting cross-domain knowledge
- Technical interview candidates
- Engineering teams
- Universities / developer communities

---

# 4. Product Principles

## Principle 1 — Reasoning over memorization

Prefer questions such as:

- Why was this designed this way?
- What would break if we removed this?
- What happens when this scales 1,000×?
- What becomes the bottleneck?
- Which approach would you choose and why?
- What trade-off are we making?

Definitions are useful, but reasoning is the priority.

## Principle 2 — Under-the-hood understanding

The product should continually answer:

- What actually happens internally?
- What happens in memory?
- What happens on the network?
- What happens inside the CPU?
- What happens inside the database?
- What happens when something fails?

## Principle 3 — Active learning

Do not make learning passive.

Mandatory pattern for important concepts:

**Teach → Predict → Answer → Evaluate → Correct → Go Deeper → Challenge**

If the user is wrong:

- Attempt 1
- Small hint
- Attempt 2
- Explanation

Do not immediately rescue the user unless they ask for the answer.

## Principle 4 — Build connected knowledge

Topics should not be isolated. The system should understand prerequisites and relationships between concepts.

## Principle 5 — Quality over quantity

Avoid generic AI-generated "Wikipedia-style" content.

A smaller library of excellent topics is better than thousands of shallow ones.

---

# 5. User Flow

## First Visit

```text
Landing Page
    ↓
"What kind of engineer do you want to become?"
    ↓
Quick onboarding
    ↓
Create account
    ↓
Learning profile
    ↓
Initial knowledge assessment
    ↓
Personalized learning map
    ↓
Today's Mission
```

## Returning User

```text
Home
  ↓
Today's Mission
  ↓
Learn
  ↓
Think
  ↓
Answer
  ↓
AI evaluates
  ↓
Challenge
  ↓
Teach-back
  ↓
Progress updated
  ↓
Knowledge graph updated
  ↓
Tomorrow's topic selected
```

> **V0 note:** the flows above are the long-term (V1+) target. In V0 there is no landing
> page funnel, account creation, or assessment — the user goes straight into a mission.

---

# 6. Landing Page

The landing page should clearly explain:

### Problem

Most people consume technical content but forget it and rarely develop engineering intuition.

### Solution

A daily interactive technical-learning system that adapts to what the user knows and helps them reason about technology.

### Core message

Possible positioning:

> **Don't just learn technology. Learn to think like an engineer.**

Explain the loop:

**Learn → Think → Build → Remember**

Primary CTA:

> Start Learning Free

Secondary CTA:

> See How It Works

The product should remain free at its core to maximize accessibility, but avoid promising unlimited free AI usage.

---

# 7. Onboarding

Keep onboarding to approximately 2–3 minutes.

Ask:

## Interests

- Software Engineering
- AI/ML
- Systems
- Cloud
- Cybersecurity
- Data Engineering
- Web Development
- Mobile
- Robotics
- Other

## Current level

- Beginner
- CS Student
- Graduate
- Junior Engineer
- Mid-level Engineer
- Experienced Engineer

## Goal

Examples:

- AI Engineer
- ML Engineer
- Backend Engineer
- Full-stack Engineer
- Systems Engineer
- Generalist Engineer

## Available time

- 10 min/day
- 20 min/day
- 30 min/day
- 60+ min/day

Do not rely only on self-reported skill.

---

# 8. Initial Knowledge Assessment

Give users a short diagnostic assessment, approximately 10 questions.

Cover:

- Programming
- CS fundamentals
- Systems
- Networking
- Databases
- AI/ML
- Software engineering

Prefer reasoning questions over definitions.

Example:

> "Your application suddenly becomes 10× slower when traffic increases. What would you investigate first?"

The assessment creates a baseline such as:

```text
Software Engineering   ███████░░░
Systems                 ████░░░░░░
Networking              ██████░░░░
Databases               ████████░░
AI/ML                   █████░░░░░
Distributed Systems     ██░░░░░░░░
```

This becomes the initial learning profile.

---

# 9. Home Page

The Home page is the heart of the product.

Suggested structure:

```text
Good morning 👋

🔥 7 day streak
127 concepts explored
Level: Systems Explorer

---------------------------------

TODAY'S MISSION

Why databases use Write-Ahead Logs

⏱ ~20 minutes
🧠 Difficulty: Advanced

[ Start Today's Mission ]

---------------------------------

Continue Learning

Distributed Systems    ███████░ 70%
AI/ML                  █████░░░ 50%
Networking              ████░░░ 40%
```

Keep the dashboard simple. Avoid turning it into a SaaS analytics dashboard.

---

# 10. Today's Mission

The daily experience should be an interactive mission rather than a passive article.

Example:

## Stage 1 — Hook

> Your database suddenly crashes while writing data.

## Stage 2 — Think

> What do you think happens to the data?

User answers.

## Stage 3 — Learn

Explain Write-Ahead Logging.

## Stage 4 — Under the Hood

Show the flow:

```text
Application
    ↓
Database
    ↓
WAL
    ↓
Disk
    ↓
Data Pages
```

## Stage 5 — Challenge

> Design a recovery strategy after a crash.

## Stage 6 — AI Evaluation

Evaluate the user's answer.

## Stage 7 — Teach-back

> Explain WAL to a junior engineer.

## Stage 8 — Completion

```text
✓ Concept learned
✓ Challenge completed
✓ Teach-back completed

Knowledge +12
Systems +2%
```

---

# 11. Daily Topic Structure

Every major lesson should include:

1. Today's Topic
2. Hook
3. Think Before Learning
4. What Problem Does It Solve?
5. Simple Explanation
6. Under the Hood
7. Real-World Implementation
8. Technical / Code Example where appropriate
9. Engineering Trade-offs
10. What Happens If...?
11. Connect the Dots
12. Engineer's Insight
13. Surprising Technical Fact
14. Teach-back
15. Mini Challenge
16. Active Recall
17. Engineering Design Challenge for major topics

---

# 12. Topic Categories

The platform should intelligently rotate between:

## Computer Science Fundamentals

- Data structures
- Algorithms
- Operating systems
- Computer architecture
- Memory
- CPU
- Processes
- Threads
- Concurrency
- Parallelism
- Compilers
- Programming languages
- Runtime systems

## Software Engineering

- Clean architecture
- Design patterns
- APIs
- Microservices
- Monoliths
- Event-driven architecture
- Testing
- Debugging
- Code quality
- Performance engineering
- Software architecture
- System design

## Computer Systems

- CPU caches
- Virtual memory
- Page tables
- System calls
- Interrupts
- Kernel
- Scheduling
- File systems
- SSDs
- I/O
- GPU architecture
- Instruction execution
- Branch prediction
- Memory hierarchy

## Networking

- TCP/IP
- DNS
- HTTP
- HTTPS
- TLS
- TCP congestion control
- UDP
- QUIC
- WebSockets
- Routing
- NAT
- Load balancing
- CDNs
- Network failures
- How the Internet works

## Databases

- SQL
- Indexing
- Query optimization
- Transactions
- ACID
- MVCC
- WAL
- Replication
- Sharding
- Partitioning
- Caching
- NoSQL
- Distributed databases
- Database internals

## Distributed Systems

- CAP theorem
- Consistency
- Availability
- Partition tolerance
- Replication
- Consensus
- Raft
- Paxos
- Leader election
- Distributed locks
- Message queues
- Event-driven systems
- Fault tolerance
- Distributed transactions
- Service discovery

## AI / ML

- ML fundamentals
- Neural networks
- Backpropagation
- Optimization
- CNNs
- RNNs
- Transformers
- Attention
- Embeddings
- Vector databases
- RAG
- Fine-tuning
- Reinforcement learning
- Multimodal models
- Model evaluation
- ML infrastructure

## Generative AI

- Tokenization
- LLM token generation
- Attention
- KV cache
- Context windows
- Positional encoding
- Quantization
- Mixture of Experts
- Speculative decoding
- Inference optimization
- Model serving
- RAG
- AI agents
- Tool calling
- MCP
- AI memory
- Agent architectures
- AI evaluation

## Cloud & Infrastructure

- AWS
- Azure
- GCP
- Docker
- Kubernetes
- Containers
- Serverless
- CI/CD
- Infrastructure as Code
- Observability
- Autoscaling
- Cloud networking
- Service architecture

## Cybersecurity

- Authentication
- Authorization
- Encryption
- Hashing
- TLS
- OAuth
- JWT
- Zero Trust
- Common vulnerabilities
- Secure software design

## Developer Technologies

- Git
- Linux
- Docker
- Kubernetes
- Redis
- Kafka
- Nginx
- PostgreSQL
- Elasticsearch
- GitHub Actions

## Emerging Technology

- AI
- Robotics
- Edge computing
- Quantum computing
- New programming languages
- New databases
- AI infrastructure
- Hardware
- Cloud technologies
- Developer tools
- Open-source projects
- New computing architectures

---

# 13. Knowledge Graph

This should eventually become one of the core differentiators.

Do not store only:

```text
User learned TCP
User learned Redis
User learned Kubernetes
```

Represent relationships:

```text
Networking
    │
    ├── TCP
    │    └── Congestion Control
    │          └── QUIC
    │
    ├── DNS
    │
    └── HTTP
         └── HTTPS
```

Database example:

```text
Database
    │
    ├── Indexes
    │
    ├── Transactions
    │      └── ACID
    │            └── MVCC
    │
    └── WAL
           └── Recovery
```

The system should eventually identify logical next concepts.

Example:

> User understands transactions but has not learned MVCC.

Therefore:

> MVCC is a strong candidate for the next lesson.

> **Architecture note:** implement this as Postgres adjacency tables
> (`topic_prerequisites`, `topic_relationships`), not a dedicated graph database.
> See `DECISIONS_LOG.md`.

---

# 14. Progress Tracking

Do not make "topics completed" the primary progress metric.

Track multiple dimensions:

## Exposure

Has the user encountered the concept?

## Understanding

How well did they answer questions?

## Retention

Can they still answer later?

## Application

Can they use the concept in a practical problem?

## Explanation

Can they teach it?

Example:

```text
TCP

Exposure        ██████████
Understanding   ████████░░
Retention       ██████░░░░
Application     ███████░░░
Explanation     █████████░
```

This creates meaningful progress.

---

# 15. Spaced Repetition

Use adaptive review.

Example schedule:

```text
Day 1
  ↓
Day 3
  ↓
Day 7
  ↓
Day 21
  ↓
Day 60
```

The exact schedule should adapt based on performance.

Reviews should use new contexts rather than simply repeating the original lesson.

Example:

After learning CAP theorem, later ask:

> "A distributed database sacrifices consistency during a network partition. What property is affected and why?"

---

# 16. AI Mentor Architecture

Do NOT expose a provider API key directly to users.

Use:

```text
User
  ↓
Your Backend
  ↓
AI Gateway
  ↓
LLM Provider
```

The backend controls:

- Rate limits
- Token limits
- Model selection
- Abuse prevention
- Cost
- Prompt injection defenses
- Logging
- Caching

> **Architecture note:** implement this gateway using the **Vercel AI SDK** rather than a
> fully custom `AIService` abstraction — it already provides multi-provider swapping,
> streaming, and tool-calling hooks on top of the Next.js/Vercel stack. The conceptual
> abstraction below still holds; the SDK is the implementation of it.

Create an AI provider abstraction:

```text
AIService
    ├── OpenAI
    ├── Gemini
    ├── Anthropic
    └── Local Models
```

Potential model routing:

- Cheap model → everyday explanations
- Stronger model → evaluations/design challenges
- Embedding model → semantic retrieval

---

# 17. Do Not Generate Everything from Scratch

Avoid:

```text
User clicks Today's Topic
        ↓
LLM invents entire lesson
```

Instead maintain a curated Topic/Concept Library.

Example Topic object:

```text
Topic
 ├── ID
 ├── Title
 ├── Category
 ├── Difficulty
 ├── Prerequisites
 ├── Concepts
 ├── Learning Objectives
 ├── Challenges
 ├── Related Topics
 ├── Resources
 └── Version
```

The AI should personalize and adapt the experience around a quality-controlled content foundation.

This provides:

**Quality + consistency + personalization**

---

# 18. Topic Selection Engine

Eventually implement a scoring system similar to:

```text
NextTopicScore =
    KnowledgeGap
  + PrerequisiteReadiness
  + UserInterest
  + RetentionNeed
  + CareerRelevance
  + DifficultyFit
  + Novelty
  + CurrentImportance
```

The system selects the highest-value topic for that user.

This is much better than random topic generation.

> **V0/V1 note:** this 8-factor score is a V2/V3 target. For V0/V1, use a simple weighted
> rotation (category coverage + basic knowledge gap) — most of the perceived benefit, a
> fraction of the implementation cost. This is also where topic selection is deterministic,
> not AI-driven — see Section 0.1.

---

# 19. Build Mode

A major future feature:

> **"Want to build it?"**

After learning:

- Redis → build a cache
- TCP → build a simple TCP server
- Kafka → build an event pipeline
- RAG → build a RAG system
- Distributed systems → build a key-value store

This moves the product from:

**Education → Engineering capability**

> **Freemium note:** Build Mode is a candidate Pro-tier feature. See Section 0.1.

---

# 20. Tech Radar

Create a section for important technology developments.

Do not make it a generic news feed.

Classify technologies:

```text
🔥 Worth Learning

🟡 Emerging

🟢 Established

🔴 Mostly Hype
```

For each technology explain:

- What problem it solves
- Why it matters
- Current maturity
- Real-world adoption
- Whether the user should learn it
- Prerequisites
- Opportunity cost

Distinguish:

**Established vs Emerging vs Experimental vs Hype**

---

# 21. Career Relevance

Occasionally classify technologies:

- 🔥 Must Know
- ⭐ Very Valuable
- 📚 Good to Know
- 👀 Keep an Eye On
- ❌ Probably Not Worth Prioritizing

Explain why briefly.

Career relevance should guide prioritization but should not dominate every lesson.

---

# 22. Technical Communication Training

Occasionally ask users to explain concepts as if speaking to:

- A junior developer
- A senior engineer
- An interviewer
- A non-technical person

Evaluate:

- Accuracy
- Mental model
- Technical depth
- Clarity
- Missing details

This develops technical communication in addition to technical knowledge.

---

# 23. Difficulty System

Track:

**Level 1 — Foundation**

**Level 2 — Working Knowledge**

**Level 3 — Strong Understanding**

**Level 4 — Advanced**

**Level 5 — Engineer-Level Intuition**

If the user demonstrates strong understanding, skip basics and go deeper.

---

# 24. Weekly Review

Approximately every 7 topics:

## Weekly Tech Intelligence Review

Include:

1. Topics Learned
2. Knowledge Map
3. Strong Areas
4. Weak Areas
5. Biggest Misconceptions
6. Top 5 Takeaways
7. Combined Challenge
8. Next Week's Learning Direction

> **Freemium note:** candidate Pro-tier feature. See Section 0.1.

---

# 25. Monthly Engineer Level-Up

Approximately every 30 topics:

Assess:

- CS fundamentals
- Systems
- Networking
- Databases
- Distributed systems
- Software engineering
- AI/ML
- Cloud
- Security
- Emerging technology

Output:

> "If you were interviewing for a strong software/AI engineering role today, these are your strengths and biggest gaps."

Then create a targeted improvement path.

> **Freemium note:** candidate Pro-tier feature. See Section 0.1.

---

# 26. Multi-Day Deep Dives

Some subjects deserve series rather than one lesson.

Example:

### Distributed Systems Series

Day 1 → Why distributed systems are difficult  
Day 2 → CAP theorem  
Day 3 → Replication  
Day 4 → Consensus  
Day 5 → Raft  
Day 6 → Distributed transactions  
Day 7 → Design a distributed system

Do not abandon a topic before important prerequisites are understood.

> **Freemium note:** candidate Pro-tier feature. See Section 0.1.

---

# 27. Wildcard Days

Occasionally provide:

> **YOU PROBABLY DON'T KNOW THIS**

Potential examples:

- Branch prediction
- False sharing
- Write-ahead logging
- SSD internals
- Out-of-order execution
- Garbage collection
- DNS internals
- TCP congestion control
- Kernel mechanisms
- GPU memory
- KV caching
- Distributed failure modes
- Database query planners
- Memory allocators

The topic should be relatively uncommon but genuinely useful.

---

# 28. Commands

Users should be able to interact with the learning system using simple commands:

### Today's topic
Choose today's topic.

### Go deeper
Take the current concept into advanced internals.

### Explain simply
Explain with intuitive analogies.

### Why?
Focus on the underlying reasoning.

### Under the hood
Skip basics and explain implementation details.

### Quiz me
Test understanding without immediately revealing answers.

### Challenge me
Give a practical engineering challenge.

### Hint
Give a small hint without revealing the answer.

### Evaluate me
Critique technical reasoning.

### Teach back
Ask the user to explain the concept.

### Connect the dots
Connect the current topic with previous knowledge.

### Real world
Show production use cases.

### Interview
Show interview applications.

### Should I learn this?
Evaluate career/engineering value.

### Review
Review previous knowledge and identify gaps.

### Surprise me
Give an unusual but valuable topic.

### Next
Move to the next topic.

---

# 29. MVP Scope

Do not attempt to build everything initially.

> **Note:** as of 2026-09-17, this V1 MVP is preceded by an even leaner **V0** (Section 0)
> to validate the core loop first. Treat this section as the target *after* V0 validates.

## V1 — MVP

Build:

- Landing page
- Authentication
- Onboarding
- Diagnostic assessment
- User profile
- Topic library
- Today's topic
- Interactive lesson
- AI mentor
- Quiz
- Challenge
- Basic progress tracking
- Topic history

This is enough to validate the product.

---

# 30. V2

Add:

- Knowledge graph
- Spaced repetition
- Learning paths
- Weekly review
- Streaks
- Badges
- Difficulty adaptation
- Topic recommendations
- Bookmarks
- Search
- Deeper mentor commands

---

# 31. V3

Add:

- Technical projects
- System design challenges
- Coding environments
- AI interview mode
- Research-paper mode
- GitHub/project integration
- Personalized career paths
- Community
- Leaderboards
- Public profiles

---

# 32. Features NOT to Build Initially

Avoid:

- Social network
- Community forum
- Leaderboards
- Native mobile app
- Complex gamification
- Kubernetes
- Microservices
- Custom ML models
- Separate vector database
- Coding IDE
- Thousands of topics
- AI agents everywhere

The first question is:

> **Can a person come back every day and genuinely become more technically capable?**

---

# 33. Recommended Tech Stack

## Frontend

**Next.js + TypeScript**

Reasons:

- React ecosystem
- Full-stack capability
- SEO
- Easy deployment
- Strong developer experience

## UI

**Tailwind CSS**

Plus **shadcn/ui** or a similar component system.

## Backend

Initially:

**Next.js server-side APIs / Server Actions**

Do not create a separate backend immediately.

Later, if ML-heavy functionality justifies it:

**FastAPI / Python**

## Database

**PostgreSQL**

Avoid introducing MongoDB without a real need.

## Authentication

Potential options:

- Supabase Auth
- Auth.js
- Clerk

A strong MVP choice is **Supabase** because it can provide:

```text
PostgreSQL
+
Authentication
+
Storage
+
Realtime
```

## Vector Search

Start with:

**PostgreSQL + pgvector**

Avoid a dedicated vector database until scale requires it.

## AI Provider Abstraction

**Vercel AI SDK** (see Section 0.1 / `DECISIONS_LOG.md`) — provides multi-provider
swapping, streaming, and tool-calling on top of the Next.js/Vercel stack, replacing the
fully custom `AIService` originally sketched in Section 16.

## Background Jobs

Potential choices:

- Inngest
- Trigger.dev
- Managed job system

Use them for:

- Daily processing
- Spaced repetition
- Weekly reports
- Tech radar updates
- Embedding generation
- Content validation

## Rate Limiting / Caching

**Upstash Redis** — serverless, Vercel-native. Introduce at V1 (once accounts/AI usage
exist), not needed for V0.

## Billing (future)

**Stripe** — once the freemium split is finalized (see Section 0.1). Schema fields for
`plan` and usage tracking should exist before this is needed, per Section 0.1.

## Deployment

**Vercel**

## Analytics

**PostHog**

## Monitoring

**Sentry**

---

# 34. Suggested High-Level Architecture

```text
                    ┌────────────────────┐
                    │      Next.js       │
                    │      Frontend      │
                    └─────────┬──────────┘
                              │
                              ↓
                    ┌────────────────────┐
                    │ Application Server │
                    └─────────┬──────────┘
                              │
            ┌─────────────────┼─────────────────┐
            ↓                 ↓                 ↓
      PostgreSQL          AI Gateway       Topic Engine
            │                 │                 │
            │                 ↓                 │
            │            LLM Provider           │
            │                                   │
            └──────────────┬────────────────────┘
                           ↓
                    Knowledge Graph
```

---

# 35. Suggested Database Model

Core entities:

```text
users
profiles
learning_goals

topics
concepts
topic_prerequisites
topic_relationships

lessons
learning_sessions

user_topics
user_concepts

quiz_attempts
challenge_attempts
teachback_attempts

reviews
spaced_repetition_items

achievements
streaks

resources
ai_conversations
ai_messages

-- Added 2026-09-17 for freemium scaffolding (see Section 0.1 / DECISIONS_LOG.md):
-- users.plan            ('free' | 'pro')
-- ai_usage / usage_events
```

Important relationship:

```text
User
 │
 ├── Profile
 ├── Learning Goals
 ├── Learning Sessions
 ├── Topic Progress
 │      └── Concept Progress
 ├── Quiz Attempts
 ├── Challenges
 └── Reviews


Topic
 │
 ├── Concepts
 ├── Prerequisites
 ├── Related Topics
 ├── Lessons
 └── Challenges
```

---

# 36. AI Cost Strategy

The platform can remain free, but **unlimited free AI should not be promised initially**.

Risks:

- API abuse
- Automated requests
- Unexpected token costs
- Users intentionally consuming huge contexts

Use:

- Backend-only API keys
- Rate limiting
- Daily/monthly quotas
- Token limits
- Model routing
- Caching
- Monitoring
- Abuse detection

Possible model strategy:

```text
Simple task
    ↓
Low-cost model

Complex evaluation
    ↓
Stronger model

Semantic retrieval
    ↓
Embedding model
```

Core learning should remain free where financially sustainable.

Potential future premium features:

- Higher AI limits
- Advanced learning paths
- Projects
- Interview mode
- Research mode
- Advanced analytics
- Higher usage limits

> See Section 0.1 for the current (still open) proposed free/paid split.

---

# 37. PWA / Mobile Strategy

Do not build a native mobile application initially.

Make the web app a **PWA**.

Benefits:

- Installable on phones
- App-like experience
- Home-screen access
- Notifications
- One codebase

True home-screen widgets are platform-specific and should be treated as a later native-app feature.

Initial mobile strategy:

**Responsive Web → PWA → Native app only if usage justifies it**

---

# 38. Content Quality System

The largest product risk is **AI-generated content becoming generic or inaccurate**.

Each topic should ideally contain:

```text
Learning objectives
Prerequisites
Core explanation
Deep explanation
Examples
Misconceptions
Questions
Challenges
Real-world applications
Related concepts
Resources
```

AI should personalize the experience around a quality-controlled foundation.

Eventually support:

- Human-reviewed canonical topics
- Versioned topic content
- Content quality scoring
- Source/reference tracking
- User feedback
- Error reporting

> **Pipeline decision (2026-09-17):** hand-write/heavily edit ~15–20 gold-standard topics
> first; use them as few-shot templates for AI-assisted generation of the rest. See
> `DECISIONS_LOG.md`.

---

# 39. Analytics

Track meaningful events:

```text
onboarding_completed
assessment_completed
topic_started
topic_completed
question_answered
challenge_completed
lesson_abandoned
mentor_message_sent
teachback_completed
review_completed
```

North-star metric:

> **Weekly Active Learners who complete learning sessions and retain knowledge.**

Do not optimize only for:

- Registrations
- Page views
- Topics generated
- AI messages

---

# 40. Product Moat

Do not compete on:

> "We use AI."

Everyone does.

The defensible value should come from:

### 1. Knowledge Graph
Understanding relationships between technical concepts.

### 2. Learning History
Knowing what each user actually understands.

### 3. Adaptive Curriculum
Knowing what they should learn next.

### 4. Engineering Evaluation
Evaluating reasoning, not just quiz scores.

### 5. High-Quality Content
Curated + AI enhanced.

### 6. Long-Term Retention
Spaced repetition + application.

This is much harder to copy than a simple AI wrapper.

---

# 41. Product North Star

A user should be able to open the application and experience:

```text
Your mission for today is ready.

"How does Google Maps know there's traffic?"

        ↓

Before I explain:
What do you think happens?

        ↓

User reasons

        ↓

AI:
Good intuition. You're right about X,
but you're missing Y.

        ↓

Deep explanation

        ↓

"What happens if 10 million users
use this simultaneously?"

        ↓

User reasons

        ↓

AI evaluates

        ↓

"Explain this like you're interviewing
for a backend engineering role."

        ↓

Teach-back

        ↓

Mission Complete

        ↓

Knowledge graph updated

        ↓

Tomorrow's topic selected based
on what the user should learn next.
```

That is the product.

---

# 42. Development Roadmap

> **Note:** Phase 0 below now includes the V0 loop-validation step (Section 0) before
> Phase 1 infrastructure work begins.

## Phase 0 — Product Definition (+ V0 validation)

Before coding:

- Product name
- Target audience
- Core promise
- MVP scope
- User journeys
- Information architecture
- Design direction
- **Build and test V0 (Section 0) with real users**

## Phase 1 — Foundation

Build:

- Next.js project
- Database
- Authentication
- User profile
- UI system

## Phase 2 — Learning Engine

Build:

- Topic database
- Concept database
- Topic prerequisites
- Topic selection algorithm
- Daily mission

## Phase 3 — AI Mentor

Build:

- AI gateway
- Structured prompts
- Context injection
- Conversation system
- Answer evaluation
- Cost controls

## Phase 4 — Learning Loop

Build:

**Learn → Think → Answer → Evaluate → Challenge → Teach-back**

## Phase 5 — Progress

Build:

- Knowledge levels
- Topic history
- Knowledge map
- Streak
- Weekly review

## Phase 6 — Retention

Build:

- Spaced repetition
- Review engine
- Weak-topic detection

## Phase 7 — Polish

Build:

- PWA
- Notifications
- Landing page
- SEO
- Analytics
- Error monitoring

Then launch and learn from real users.

---

# 43. Critical Product Questions to Solve Before Coding

These should be resolved during the technical/product specification phase:

1. How should technical knowledge be represented?
2. How do we determine whether a user actually understands a concept?
3. How do we choose the next best topic?
4. How do we prevent AI-generated lessons from becoming generic or inaccurate?
5. How do we measure retention?
6. How do we keep AI costs sustainable while keeping the core product free?
7. How much content should be human-curated vs AI-generated?
8. What is the minimum daily experience that creates genuine learning?
9. What data should be stored about user reasoning and performance?
10. What should be deterministic vs AI-driven? — **Answered 2026-09-17, see Section 0.1**
11. How should the knowledge graph evolve?
12. How do we prevent the system from repeatedly teaching concepts the user already understands?
13. How should emerging technology information be sourced and validated?
14. What privacy/data retention policies are required?
15. How do we evaluate whether the product actually improves technical ability?

---

# 44. Recommended Immediate Next Step

> **Superseded in part by Section 0 (2026-09-17):** build and validate V0 first. The
> detailed spec below is still the right next step once V0 confirms the loop works, or can
> be drafted in parallel for the parts (schema, API shape) V0 also needs.

Do **not** start by building the landing page.

The next step should be a detailed:

## Product + Technical Specification

Define:

1. MVP scope
2. User journeys
3. Screen-by-screen UX
4. Database schema
5. Knowledge graph model
6. Topic model
7. Learning state model
8. Topic selection algorithm
9. AI architecture
10. Prompt architecture
11. API endpoints
12. Authentication
13. Rate limiting
14. Cost controls
15. Analytics events
16. Folder/project structure
17. Deployment architecture
18. Security considerations
19. Content pipeline
20. Testing strategy

Only after this should implementation begin.

---

# 45. Golden Rule

The product is not trying to make people memorize more technologies.

It is trying to make people:

- Think more clearly
- Understand systems deeply
- Reason about unfamiliar technology
- Make better engineering decisions
- Retain what they learn
- Build what they understand
- Communicate technical concepts clearly

The central philosophy is:

> **Learn → Think → Build → Remember**

And the ultimate goal is:

> **Make users capable of reasoning about systems they have never seen before.**