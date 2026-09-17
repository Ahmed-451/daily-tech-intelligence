import { Topic } from "../../types/topic";

export const tcpCongestionControl: Topic = {
  id: "networking-tcp-congestion-control",
  title: "Why TCP Deliberately Slows Itself Down",
  category: "networking",
  difficulty: 4,
  estimatedMinutes: 20,
  prerequisites: ["networking-tcp-fundamentals"],
  relatedTopics: ["networking-quic", "networking-load-balancing", "networking-cdns"],
  concepts: ["congestion-control", "congestion-window", "slow-start", "packet-loss-signaling"],
  learningObjectives: [
    "Explain why TCP treats packet loss as a signal to slow down rather than just an error to retry",
    "Describe slow start and additive-increase/multiplicative-decrease (AIMD) behavior",
    "Reason about why a single greedy connection can hurt everyone sharing a link",
  ],
  stages: {
    hook: "You're on a video call. A second device on your home network starts a large download. Your call doesn't crash — it just gets a bit worse for both of you, then stabilizes.",

    thinkPrompt:
      "Why doesn't the download simply take all the bandwidth it can get, starving the call? What do you think is negotiating this, and where does that negotiation happen — your router, your ISP, or the applications themselves?",

    explanationSimple:
      "TCP doesn't know how fast the network path can go — there's no central authority telling it. So each TCP connection starts slow, sends a little, watches whether packets make it through, and gradually sends more. If packets start getting lost, that's treated as a strong signal 'you're going faster than the network can handle' — so TCP cuts its rate hard and starts creeping back up again. Every connection does this independently, which is why your call and the download settle into sharing the link instead of one starving the other.",

    explanationDeep:
      "Each TCP sender maintains a congestion window (cwnd) — the amount of unacknowledged data it's allowed to have in flight. It starts small (slow start): cwnd roughly doubles every round-trip as ACKs confirm delivery, growing exponentially until it either hits a threshold or a loss occurs. After that it switches to congestion avoidance, growing cwnd by roughly one segment per round-trip (linear/additive increase) rather than doubling — deliberately probing gently for more bandwidth. When a loss is detected (a timeout, or the more precise fast-retransmit via duplicate ACKs), classic TCP (Reno/NewReno) cuts cwnd sharply — often by half — before resuming the slow linear climb. This additive-increase/multiplicative-decrease (AIMD) pattern is what produces the characteristic sawtooth throughput graph, and critically, it's what makes many independent connections converge to sharing a bottleneck link roughly fairly, without any of them coordinating explicitly.",

    underTheHood:
      "Congestion window over time (classic Reno-style AIMD):\n" +
      "  cwnd\n" +
      "   |        loss              loss\n" +
      "   |       ╱|                ╱|\n" +
      "   |      ╱ |               ╱ |\n" +
      "   |     ╱  ↓ (cut ~half)  ╱  ↓\n" +
      "   |    ╱                 ╱\n" +
      "   |   ╱ slow start      ╱ linear growth\n" +
      "   |  ╱ (exponential)   ╱ (congestion avoidance)\n" +
      "   +---------------------------------------→ time\n\n" +
      "Loss detection paths:\n" +
      "  3 duplicate ACKs  → fast retransmit (loss inferred quickly, cwnd halved)\n" +
      "  no ACK, timer expires → retransmission timeout (loss inferred slowly, cwnd reset near 1 MSS — much more punishing)\n\n" +
      "This is why a single random-loss event (e.g., a flaky wifi hop) can tank throughput far more " +
      "than the actual congestion warranted — TCP can't distinguish 'the network is congested' from " +
      "'a packet got corrupted by noise,' so it treats all loss the same way.",

    realWorldExamples: [
      "Home routers' fair queuing / SQM (smart queue management) exists specifically to help many TCP flows share a slow uplink without one flow's aggressive slow-start starving a video call — it's compensating for exactly this algorithm.",
      "CDNs and video streaming services tune initial congestion window sizes (some start larger than the historical default of ~10 segments) to get more throughput in the first RTT for short-lived, latency-sensitive connections.",
      "Data center TCP stacks (e.g., DCTCP) replace loss-based signaling with explicit congestion notification (ECN) because in a data center, waiting for packet loss to signal congestion is far too slow and wasteful.",
    ],

    codeExample: {
      language: "text",
      code:
        "// Simplified AIMD pseudocode\n" +
        "on ACK received:\n" +
        "  if in slow_start:\n" +
        "    cwnd += MSS               // exponential growth per RTT\n" +
        "    if cwnd >= ssthresh: switch to congestion_avoidance\n" +
        "  else: // congestion_avoidance\n" +
        "    cwnd += MSS * MSS / cwnd  // ~+1 MSS per RTT, linear growth\n\n" +
        "on loss detected (3 dup ACKs):\n" +
        "  ssthresh = cwnd / 2\n" +
        "  cwnd = ssthresh\n" +
        "  switch to congestion_avoidance\n\n" +
        "on loss detected (timeout):\n" +
        "  ssthresh = cwnd / 2\n" +
        "  cwnd = 1 * MSS              // much harsher: back to slow start",
      explanation:
        "Notice the two loss paths are treated very differently — a fast retransmit is a gentler signal than a full timeout, because a timeout implies the sender has heard nothing at all, a much stronger sign of serious congestion (or an outage).",
    },

    tradeoffs: [
      "Loss-based congestion control is simple and needs no cooperation from routers, but it's reactive — it only backs off after damage (loss) has already happened, and it can't distinguish real congestion from random transmission errors.",
      "Larger initial congestion windows improve short-flow latency but increase the risk of bursty loss/congestion for everyone sharing the link at connection start.",
      "Newer algorithms like BBR model available bandwidth and RTT directly instead of relying on loss, trading TCP-Reno's simplicity and decades of deployment experience for better performance on lossy or highly variable links — but with real fairness debates when BBR flows compete against classic AIMD flows.",
    ],

    whatHappensIf: [
      {
        scenario: "What if 10,000 TCP connections all start slow-start at the exact same instant on a shared, moderately-sized link?",
        discussion:
          "Aggregate demand spikes rapidly during the exponential-growth phase, likely causing a burst of packet loss across many flows simultaneously (this is sometimes called a 'TCP incast' pattern in data centers) — many connections then simultaneously halve their cwnd and re-grow, which can produce synchronized oscillation rather than smooth convergence.",
      },
      {
        scenario: "What if the network path has a satellite hop with a very high RTT?",
        discussion:
          "Because congestion-avoidance growth is roughly '+1 MSS per RTT,' a high-RTT path grows its window far more slowly in wall-clock time than a low-RTT path — this is the classic reason long-fat-network (LFN) links historically struggled to reach high throughput with plain Reno-style TCP, motivating window-scaling and alternative algorithms.",
      },
    ],

    connectTheDots: [
      {
        relatedTopicId: "networking-quic",
        connection:
          "QUIC runs its own congestion control (often BBR-like) inside a userspace/UDP-based transport instead of the kernel's TCP stack — same underlying problem, but freed from decades of TCP kernel-implementation inertia.",
      },
      {
        relatedTopicId: "networking-load-balancing",
        connection:
          "Load balancers terminating many TCP connections have to manage per-connection congestion state independently — congestion control is fundamentally end-to-end per connection, not something a middlebox can shortcut.",
      },
    ],

    engineersInsight:
      "Congestion control is a beautiful example of a fully decentralized control system: there is no coordinator, yet thousands of independent TCP senders converge to roughly fair sharing of a bottleneck purely because they all react to the same implicit signal (loss) in a compatible way. Break that compatibility (e.g., one flow ignoring loss signals) and the whole implicit fairness contract collapses — which is exactly why misbehaving/aggressive TCP stacks are treated as a network citizenship problem.",

    surprisingFact:
      "Classic TCP congestion control cannot tell the difference between 'the network is overloaded' and 'a packet got corrupted by wifi interference' — both look identical (a lost packet) to the algorithm, so both trigger the same throughput-halving response, even though only one of them is actually about congestion.",

    teachBackPrompt:
      "Explain to a junior engineer why a download and a video call on the same home connection usually settle into 'sharing' bandwidth instead of one completely starving the other — without using the word 'algorithm' more than once.",

    miniChallenge: {
      prompt:
        "Your team ships a mobile app that opens 6 parallel TCP connections per screen to speed up loading. Users on congested cellular networks report the app feels slower than competitors who use 1–2 connections. Reason through why this might be, using what you know about slow start and AIMD.",
      evaluationCriteria: [
        "Recognizes each new connection restarts slow start from scratch — no shared history of the path's capacity",
        "Notes 6 connections competing simultaneously can trigger a synchronized loss/backoff event, worse than fewer flows growing more gently",
        "Mentions that HTTP/2 or HTTP/3 multiplexing over a single connection avoids re-paying the slow-start cost per request",
      ],
    },

    activeRecall: [
      {
        question: "Why does a timeout-triggered loss reset cwnd more aggressively than a fast-retransmit-triggered loss?",
        idealAnswerPoints: [
          "A timeout means the sender heard nothing at all — a stronger, more ambiguous signal of serious trouble than a few missing-but-surrounded-by-later-ACKs packets",
          "Fast retransmit implies most of the flow is still getting through fine, so a milder response (halve, don't reset to 1) is appropriate",
        ],
      },
      {
        question: "Why does slow start grow exponentially instead of linearly like congestion avoidance?",
        idealAnswerPoints: [
          "At the very start there's no information about the path's capacity, so probing quickly (doubling) finds the right order of magnitude fast",
          "Once a loss/threshold signals you're near capacity, growth switches to cautious, gentle linear probing to avoid repeatedly overshooting",
        ],
      },
    ],
  },
  resources: [
    { title: "RFC 5681 — TCP Congestion Control", url: "https://www.rfc-editor.org/rfc/rfc5681" },
    { title: "BBR Congestion Control (Google)", url: "https://research.google/pubs/pub45646/" },
  ],
  version: 1,
};