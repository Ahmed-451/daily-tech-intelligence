import { Topic } from "../types/topic";
import { databaseWAL } from "./topics/database-wal";
    import { tcpCongestionControl } from "./topics/networking-tcp-congestion-control";
    import { capTheorem } from "./topics/distributed-cap-theorem";
    import { kvCache } from "./topics/genai-kv-cache";
    import { virtualMemory } from "./topics/systems-virtual-memory";

/**
 * The curated Topic Library (product-context.md §17).
 *
 * This is a static array for V0 (no database yet — see DECISIONS_LOG.md,
 * "V0 lean scope adopted"). Every entry here must match the level of
 * specificity in database-wal.ts (the first gold-standard exemplar) —
 * do not add thin/generic topics.
 *
 * V0 topic selection (product-context.md §18) is a simple deterministic
 * rotation over this array, NOT the full 8-factor NextTopicScore, and NOT
 * AI-driven — see DECISIONS_LOG.md, "Deterministic vs AI-driven split."
 */
export const topicLibrary: Topic[] = [
  databaseWAL,
  tcpCongestionControl,
  capTheorem,
  kvCache,
  virtualMemory,
];

export function getTopicById(id: string): Topic | undefined {
  return topicLibrary.find((t) => t.id === id);
}

/** Simple deterministic rotation for V0: cycles through the library by index. */
export function getTopicForDay(dayIndex: number): Topic {
  return topicLibrary[dayIndex % topicLibrary.length];
}