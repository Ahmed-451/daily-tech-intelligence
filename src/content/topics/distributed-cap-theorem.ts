import { Topic } from "../../types/topic";

export const capTheorem: Topic = {
  id: "distributed-cap-theorem",
  title: "CAP Theorem: The Trade-off You Can't Engineer Away",
  category: "distributed-systems",
  difficulty: 4,
  estimatedMinutes: 20,
  prerequisites: ["distributed-systems-intro", "database-replication"],
  relatedTopics: ["distributed-consensus-raft", "database-wal", "distributed-leader-election"],
  concepts: ["consistency", "availability", "partition-tolerance", "network-partition"],
  learningObjectives: [
    "State CAP precisely enough to avoid the common oversimplifications",
    "Explain what actually happens to a distributed database during a real network partition",
    "Reason about which CAP trade-off fits a given real-world system's requirements",
  ],
  stages: {
    hook: "A network cable gets cut between your database's US and EU data centers. Both sides are still up, still healthy, still receiving writes from users — they just can't talk to each other anymore.",

    thinkPrompt:
      "Each side has to decide, right now, how to respond to a write request it receives. What are its options, and what does each option cost you?",

    explanationSimple:
      "CAP theorem says a distributed system that's split by a network partition has to choose: either keep answering requests on both sides (Availability) even though the two sides might now disagree with each other, or refuse/delay requests on one side until it can be sure it's not disagreeing with the other (Consistency). You can't have perfect versions of both once the network is actually partitioned — that part isn't a design failure, it's a fact about physics and networks.",

    explanationDeep:
      "CAP theorem, precisely: in the presence of a network Partition (P — which is not optional, networks do partition), a distributed system must choose between Consistency (every read reflects the most recent write, system-wide) and Availability (every request that reaches a live node gets a response). Partition tolerance isn't really a third knob you tune — it's the premise: real networks partition, so the honest framing is 'CP vs AP under partition,' not 'pick any 2 of 3.' Outside of an actual partition, most systems can offer both C and A just fine; CAP is specifically about what a system must sacrifice during the partition itself. A CP system (e.g., a majority-quorum system like etcd or a single-primary Postgres cluster with synchronous replication) will refuse writes on the minority side of a partition rather than risk inconsistency. An AP system (e.g., Cassandra in its default configuration, DynamoDB) keeps accepting writes on both sides and reconciles the resulting conflicts later, accepting temporary divergence.",

    underTheHood:
      "During the partition:\n" +
      "  US side           |  (network cut)  |  EU side\n" +
      "  receives write W1 |                  |  receives write W2\n" +
      "  for the same key  |                  |  for the same key\n\n" +
      "CP choice: one side (e.g., the side without quorum) rejects the write.\n" +
      "  → No conflict, but that side is unavailable for this key until the partition heals.\n\n" +
      "AP choice: both sides accept their write.\n" +
      "  → Both sides stay available, but you now have two divergent values for the same key,\n" +
      "    which must be reconciled once the partition heals (last-write-wins, vector clocks,\n" +
      "    CRDTs, or application-level conflict resolution).\n\n" +
      "Once the partition heals, the system's reconciliation strategy is what actually determines\n" +
      "correctness — CAP describes the choice made *during* the split, not how you clean up after.",

    realWorldExamples: [
      "DynamoDB and Cassandra default to AP behavior — designed for shopping-cart-style workloads where staying available matters more than every replica agreeing instantly.",
      "etcd and ZooKeeper are CP by design — they back systems (like Kubernetes' control plane) where an inconsistent answer about 'who's the leader right now' is worse than briefly unavailable.",
      "Traditional single-primary relational databases with synchronous replicas are effectively CP for writes: if the replica can't confirm, the primary can be configured to refuse the write rather than risk it being lost.",
    ],

    codeExample: {
      language: "text",
      code:
        "// Conceptual: how a CP system's write path reacts to a partition\n" +
        "function handleWrite(key, value):\n" +
        "  acks = broadcastToReplicas(key, value)\n" +
        "  if acks.count >= QUORUM:\n" +
        "    commit(key, value)\n" +
        "    return SUCCESS\n" +
        "  else:\n" +
        "    return UNAVAILABLE  // refuses rather than risk inconsistency\n\n" +
        "// Conceptual: how an AP system's write path reacts to the same partition\n" +
        "function handleWrite(key, value):\n" +
        "  writeLocally(key, value)\n" +
        "  asyncReplicateWhenReachable(key, value)  // best-effort, may lag or conflict\n" +
        "  return SUCCESS  // always available, consistency deferred",
      explanation:
        "Same partition, same incoming write — the only difference is whether the system is willing to say 'no' in order to protect consistency, or always says 'yes' and pushes the consistency problem to reconciliation time.",
    },

    tradeoffs: [
      "CP systems are easier to reason about (readers never see stale/conflicting data) but sacrifice availability exactly when you might need it most — during an outage.",
      "AP systems maximize uptime but push real complexity onto conflict resolution and onto application developers who must handle 'the data disagreed with itself' as a normal case, not an edge case.",
      "Many real systems are tunable per-operation (e.g., Cassandra's consistency levels) rather than globally CP or AP — but that tunability is itself a complexity cost.",
    ],

    whatHappensIf: [
      {
        scenario: "A distributed database sacrifices consistency during a network partition. What property is affected and why?",
        discussion:
          "Reads may return stale or divergent values across the partition's two sides, because the system chose Availability (A) over Consistency (C) for the duration of the split — it kept answering requests rather than blocking them, at the cost of a temporarily inconsistent view of the data.",
      },
      {
        scenario: "What if the partition heals in 2 seconds instead of 2 hours — does the CP/AP choice still matter?",
        discussion:
          "Yes, proportionally less painful but the choice was still made in real time: a CP system still rejected some requests during those 2 seconds, and an AP system still has to reconcile whatever divergent writes happened in that window, however small.",
      },
    ],

    connectTheDots: [
      {
        relatedTopicId: "database-wal",
        connection:
          "WAL guarantees a single node's committed write survives a crash (durability); CAP is about what happens across multiple nodes when they can't talk to each other — durability and distributed consistency are related but distinct concerns, and it's a common mistake to conflate them.",
      },
      {
        relatedTopicId: "distributed-consensus-raft",
        connection:
          "Raft is one concrete way to build a CP system: it requires a majority quorum to commit anything, which is precisely the mechanism that makes the minority side of a partition unavailable rather than inconsistent.",
      },
    ],

    engineersInsight:
      "The most common misuse of CAP in interviews and design docs is treating it as 'pick any 2 of 3.' Partition tolerance isn't optional in a real distributed system — the honest framing is always CP-vs-AP-during-a-partition, and the real engineering skill is knowing which one your specific feature actually needs, because most systems don't need the same answer for every operation.",

    surprisingFact:
      "A system can be CP for some operations and AP for others by design — e.g., a banking system might be strictly CP for balance transfers but AP for something like 'recently viewed transactions,' because the cost of inconsistency is wildly different for each.",

    teachBackPrompt:
      "Explain to a non-technical product manager why your team can't build a system that's 'always available AND always perfectly consistent, no trade-offs' — using an analogy, not the acronym CAP.",

    miniChallenge: {
      prompt:
        "You're designing the backend for a ride-sharing app's 'driver location' feature. A network partition splits your data centers for 30 seconds. Would you make this feature CP or AP, and why? What actually breaks for the user if you choose wrong?",
      evaluationCriteria: [
        "Chooses AP and justifies it: stale driver location for a few seconds is far less harmful than the app becoming unavailable",
        "Contrasts this with a feature that should be CP (e.g., ride payment/fare charge) to show they understand the choice is per-feature, not global",
        "Describes the concrete user-facing failure mode of choosing wrong in either direction",
      ],
    },

    activeRecall: [
      {
        question: "Why is 'pick any 2 of 3' a misleading way to state CAP theorem?",
        idealAnswerPoints: [
          "Partition tolerance isn't a feature you can opt out of — real networks partition regardless of what you choose",
          "The actual choice is only meaningful during a partition, and it's between C and A, not a free pick among three equal options",
        ],
      },
      {
        question: "Give an example of a system that should probably be AP, and one that should probably be CP, and justify each briefly.",
        idealAnswerPoints: [
          "AP example: shopping cart, social media likes/counts, driver-location-style features where staleness is a minor annoyance",
          "CP example: leader election, financial balance updates, anything where two disagreeing answers is worse than a delayed answer",
        ],
      },
    ],

    designChallenge: {
      prompt:
        "Design a globally distributed 'seat inventory' system for an airline booking site (multiple data centers, must never sell the same seat twice, must stay responsive to users worldwide). Where do you land on CP vs AP, and what mechanism enforces your choice during a partition?",
      evaluationCriteria: [
        "Identifies seat allocation as needing CP-like guarantees (correctness > availability for the actual sale)",
        "Proposes a concrete mechanism: quorum-based commit, single source-of-truth per seat/region with reconciliation, or optimistic reservation with a hard confirm step",
        "Acknowledges the user-facing cost of the CP choice (some users may see 'seat unavailable, please retry' during a partition) and how to soften that experience",
      ],
    },
  },
  resources: [
    { title: "Brewer's original CAP conjecture talk notes", url: "https://users.cs.utah.edu/~lifeifei/references/BrewerConjecture.pdf" },
    { title: "Gilbert & Lynch — Brewer's Conjecture and the Feasibility of Consistent, Available, Partition-Tolerant Web Services", url: "https://users.ece.cmu.edu/~adrian/731-sp04/readings/GL-cap.pdf" },
  ],
  version: 1,
};