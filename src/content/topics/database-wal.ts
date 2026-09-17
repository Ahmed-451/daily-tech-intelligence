import { Topic } from "../../types/topic";

/**
 * Gold-standard topic #1 of the ~15–20 hand-written exemplars called for in
 * DECISIONS_LOG.md (2026-09-17, "Content pipeline"). This is the template
 * every AI-assisted topic should be shaped like — do not let generation
 * drift from this level of specificity.
 */
export const databaseWAL: Topic = {
  id: "database-wal",
  title: "Why Databases Use Write-Ahead Logs",
  category: "databases",
  difficulty: 4,
  estimatedMinutes: 20,
  prerequisites: ["database-transactions-acid"],
  relatedTopics: ["database-mvcc", "database-replication", "filesystems-journaling"],
  concepts: ["write-ahead-log", "durability", "crash-recovery", "sequential-io"],
  learningObjectives: [
    "Explain why writing to a log before the data file is safer than writing to the data file directly",
    "Describe what happens during crash recovery using a WAL",
    "Reason about the durability/performance trade-off WAL makes",
  ],
  stages: {
    hook: "Your database suddenly crashes — power loss, OOM kill, doesn't matter — in the middle of writing a transaction to disk.",

    thinkPrompt:
      "Before I explain: what do you think happens to the data that was mid-write? Is it lost? Corrupted? Fine? What would you check first after restart?",

    explanationSimple:
      "A Write-Ahead Log (WAL) is a simple rule: never modify the actual data file until you've first written down, in a separate append-only log, exactly what change you're about to make. If the database crashes mid-write, it can replay the log on restart and finish (or safely undo) whatever it had promised — like a to-do list you write before doing the task, so you know what you were in the middle of if you get interrupted.",

    explanationDeep:
      "The data file (the 'heap' or table pages) is optimized for reads: fixed-size pages, random access, indexes pointing into it. That layout makes safe, atomic random writes expensive and slow. The WAL is optimized for the opposite: a single append-only sequential file. Every change is recorded as a small log record (transaction id, page, before/after values or the operation itself) and fsync'd to disk *before* the corresponding change is applied to the actual data pages. This gives you two guarantees for the price of one cheap sequential write: (1) durability — once the WAL record is fsync'd, the transaction is safe even if the data pages haven't been touched yet, because they can be reconstructed from the log; (2) crash recovery — on restart, the database replays the WAL from the last checkpoint, redoing committed transactions and undoing uncommitted ones, bringing the data files back to a consistent state.",

    underTheHood:
      "Flow on a write:\n" +
      "  Application issues COMMIT\n" +
      "      ↓\n" +
      "  Database appends log record to WAL (sequential write)\n" +
      "      ↓\n" +
      "  WAL record fsync'd to disk  ← transaction is now durable\n" +
      "      ↓\n" +
      "  COMMIT returns success to the application\n" +
      "      ↓\n" +
      "  (later, lazily) Data pages in the heap are updated to match the WAL\n" +
      "      ↓\n" +
      "  Checkpoint: once data pages are confirmed updated, older WAL records\n" +
      "  can be discarded/archived\n\n" +
      "Notice the data pages can lag behind the WAL by design — that's the whole point. " +
      "The WAL, not the heap, is the source of truth for 'did this really happen.'",

    realWorldExamples: [
      "PostgreSQL's WAL is exactly this mechanism, and also powers streaming replication — replicas just apply the same log records.",
      "MySQL's InnoDB uses a redo log for the same purpose (plus a separate undo log for rollback).",
      "SQLite has a WAL journal mode as an alternative to its default rollback journal, trading some durability guarantees for concurrent readers during writes.",
      "Filesystems like ext4 and NTFS use the identical idea at the block level — it's called 'journaling' there.",
    ],

    codeExample: {
      language: "text",
      code:
        "-- Conceptually, what PostgreSQL's WAL record for this looks like:\n" +
        "BEGIN;\n" +
        "UPDATE accounts SET balance = balance - 100 WHERE id = 1;\n" +
        "UPDATE accounts SET balance = balance + 100 WHERE id = 2;\n" +
        "COMMIT;\n" +
        "-- Two WAL records are appended (one per page changed) and fsync'd\n" +
        "-- BEFORE either 'accounts' heap page is actually rewritten on disk.",
      explanation:
        "Both UPDATEs' effects exist durably in the WAL the instant COMMIT returns — even though the actual 'accounts' table pages on disk might not be rewritten until seconds later.",
    },

    tradeoffs: [
      "Extra write amplification: every change is written twice (once to WAL, once eventually to the data file) — but the WAL write is cheap sequential I/O, so this is a good trade.",
      "Recovery time after a crash is proportional to how much unapplied WAL exists since the last checkpoint — frequent checkpoints mean faster recovery but more I/O overhead day-to-day.",
      "WAL alone gives durability and crash consistency, not isolation between concurrent transactions — that's what MVCC or locking is layered on top for.",
    ],

    whatHappensIf: [
      {
        scenario: "What if the database crashes right after the WAL fsync but before the data page is updated?",
        discussion:
          "No data loss. On restart, the recovery process reads the WAL from the last checkpoint forward, sees this transaction's committed log record, and redoes it against the data pages — the transaction survives even though it never touched the heap before the crash.",
      },
      {
        scenario: "What if the disk holding the WAL is on much slower storage than the data files?",
        discussion:
          "This inverts the intended trade-off. Since every commit must wait for a WAL fsync before returning, WAL latency becomes your commit latency — this is exactly why production Postgres/MySQL deployments often put the WAL on the fastest available disk (or a dedicated device).",
      },
    ],

    connectTheDots: [
      {
        relatedTopicId: "database-transactions-acid",
        connection:
          "WAL is the primary mechanism that implements the 'Durability' letter in ACID — without it, a crash mid-commit could leave you unsure whether a transaction happened.",
      },
      {
        relatedTopicId: "database-replication",
        connection:
          "Streaming replication in Postgres/MySQL works by shipping WAL records to replicas and having them replay the same log — replication and crash recovery are the same mechanism pointed at two problems.",
      },
    ],

    engineersInsight:
      "The general pattern — 'record the intent durably and cheaply before doing the expensive/risky operation' — shows up everywhere, not just databases: filesystem journaling, message queues with write-ahead commit logs (Kafka), even distributed consensus logs (Raft) are the same idea at a different layer.",

    surprisingFact:
      "Right after a WAL fsync, the data pages on disk can be stale for seconds or minutes and the database is still 100% correct and durable — because the WAL, not the heap file, is legally the source of truth for what happened.",

    teachBackPrompt:
      "Explain Write-Ahead Logging to a junior engineer who just asked 'why don't we just write directly to the table and be done with it?'",

    miniChallenge: {
      prompt:
        "Design a crash-recovery strategy: your database just restarted after a power loss. Walk through, step by step, how it should figure out which transactions to redo, which to undo, and in what order — using only the WAL and the last known checkpoint.",
      evaluationCriteria: [
        "Recognizes recovery starts from the last checkpoint, not the beginning of time",
        "Distinguishes committed transactions (redo) from uncommitted/in-flight ones (undo)",
        "Mentions replaying WAL records in log order",
        "Notes recovery must be idempotent (safe to redo even if partially applied before the crash)",
      ],
    },

    activeRecall: [
      {
        question:
          "A distributed database sacrifices consistency during a network partition. What property is affected and why?",
        idealAnswerPoints: [
          "This is a CAP theorem framing, not strictly WAL — flags a review question testing whether the user connects durability (WAL) with consistency (CAP) as distinct concerns",
          "WAL guarantees durability of a committed write on a single node; it says nothing about whether replicas agree during a partition",
        ],
      },
      {
        question: "Why is the WAL write sequential/append-only instead of also being random-access like the heap?",
        idealAnswerPoints: [
          "Sequential writes are dramatically cheaper on both spinning disks and SSDs than random writes",
          "Append-only also simplifies fsync durability guarantees and makes replay order unambiguous",
        ],
      },
    ],

    designChallenge: {
      prompt:
        "You're designing a new embedded database for a mobile app. Storage is flash (SSD-like), and the app cannot tolerate losing a transaction even if the phone loses power mid-write. Would you use a WAL? If so, what would you do differently than a server-grade Postgres deployment, given you have a single writer and extremely constrained I/O?",
      evaluationCriteria: [
        "Recognizes WAL is still the right durability mechanism even embedded (cites SQLite WAL mode as real precedent)",
        "Reasons about single-writer simplifying concurrency concerns vs. server databases",
        "Considers flash-specific concerns: write amplification, wear leveling interaction with frequent small fsyncs",
        "Considers checkpoint frequency trade-off in a resource-constrained device",
      ],
    },
  },
  resources: [
    { title: "PostgreSQL Docs — Write-Ahead Logging (WAL)", url: "https://www.postgresql.org/docs/current/wal-intro.html" },
    { title: "SQLite Docs — Write-Ahead Logging", url: "https://www.sqlite.org/wal.html" },
  ],
  version: 1,
};