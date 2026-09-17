/**
 * Topic schema — Daily Tech Intelligence
 *
 * This is the canonical data contract for a lesson. It implements:
 *   - The Topic object sketched in product-context.md §17
 *   - The Daily Topic Structure in product-context.md §11
 *   - The Difficulty System in product-context.md §23
 *
 * V0 note: topics are static data (see src/content/topics/*.ts), not DB rows.
 * The shape is designed to move into a `topics` table unchanged when V1 adds
 * a database (product-context.md §35).
 */

export type TopicCategory =
  | "cs-fundamentals"
  | "software-engineering"
  | "computer-systems"
  | "networking"
  | "databases"
  | "distributed-systems"
  | "ai-ml"
  | "generative-ai"
  | "cloud-infrastructure"
  | "cybersecurity"
  | "developer-technologies"
  | "emerging-technology";

/**
 * product-context.md §23 — Difficulty System
 * 1 Foundation · 2 Working Knowledge · 3 Strong Understanding
 * 4 Advanced · 5 Engineer-Level Intuition
 */
export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

export interface WhatHappensIfCase {
  /** The perturbation, e.g. "What if 10 million users hit this at once?" */
  scenario: string;
  /** The reasoning/discussion the mentor walks the user through. */
  discussion: string;
}

export interface ConnectTheDots {
  /** id of a related topic/concept already in the library. */
  relatedTopicId: string;
  /** One or two sentences on how the two concepts relate. */
  connection: string;
}

export interface CodeExample {
  language: string;
  code: string;
  explanation: string;
}

export interface ChallengePrompt {
  prompt: string;
  /** What a good answer touches on — used by the AI evaluator, not shown to the user up front. */
  evaluationCriteria: string[];
}

export interface ActiveRecallQuestion {
  question: string;
  /** Key points an ideal answer contains — used by the AI evaluator. */
  idealAnswerPoints: string[];
}

export interface Resource {
  title: string;
  url: string;
}

/**
 * The full daily lesson structure (product-context.md §11), stage by stage.
 * `designChallenge` is optional — only major/advanced topics get one.
 */
export interface TopicStages {
  hook: string;
  thinkPrompt: string;
  explanationSimple: string;
  explanationDeep: string;
  underTheHood: string;
  realWorldExamples: string[];
  codeExample?: CodeExample;
  tradeoffs: string[];
  whatHappensIf: WhatHappensIfCase[];
  connectTheDots: ConnectTheDots[];
  engineersInsight: string;
  surprisingFact: string;
  teachBackPrompt: string;
  miniChallenge: ChallengePrompt;
  activeRecall: ActiveRecallQuestion[];
  designChallenge?: ChallengePrompt;
}

export interface Topic {
  id: string;
  title: string;
  category: TopicCategory;
  difficulty: DifficultyLevel;
  estimatedMinutes: number;
  /** ids of topics that should be understood first. */
  prerequisites: string[];
  /** ids of topics this connects to / naturally follows. */
  relatedTopics: string[];
  /** Named sub-concepts this topic covers, for knowledge-graph tagging. */
  concepts: string[];
  learningObjectives: string[];
  stages: TopicStages;
  resources: Resource[];
  /** Bump when content is materially edited; keeps history honest per §38. */
  version: number;
}