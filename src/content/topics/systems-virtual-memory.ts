import { Topic } from "../../types/topic";

export const virtualMemory: Topic = {
  id: "systems-virtual-memory",
  title: "Virtual Memory: The Lie Every Program Believes",
  category: "computer-systems",
  difficulty: 3,
  estimatedMinutes: 20,
  prerequisites: ["systems-memory-basics"],
  relatedTopics: ["systems-page-tables", "systems-processes", "systems-kernel"],
  concepts: ["virtual-memory", "page-table", "address-translation", "memory-isolation", "paging"],
  learningObjectives: [
    "Explain why every process believes it has its own private, contiguous address space",
    "Describe how a virtual address gets translated to a physical one",
    "Reason about what a page fault is and why it isn't always an error",
  ],
  stages: {
    hook: "Two programs on your laptop both think they own memory address 0x00400000. Neither is wrong, and neither can see or corrupt the other's data.",

    thinkPrompt:
      "How is that possible if they're running on the same physical RAM at the same time? What has to sit between a program and the actual memory chips for this illusion to work?",

    explanationSimple:
      "Every process gets its own virtual address space — a private range of addresses it believes is real memory, laid out however is convenient (starting from address 0, contiguous, as big as it wants). The CPU and OS translate every one of those virtual addresses into wherever the data actually lives in physical RAM (or even on disk) behind the scenes, invisibly, on every single memory access. The program never sees physical addresses at all — it's operating entirely on a convincing illusion.",

    explanationDeep:
      "Virtual memory maps each process's virtual address space to physical RAM in fixed-size chunks called pages (commonly 4KB). A per-process page table records which virtual page maps to which physical page frame — and critically, that mapping can point to 'not currently in RAM at all.' The CPU's Memory Management Unit (MMU) walks this page table on every memory access to translate virtual → physical addresses, with a Translation Lookaside Buffer (TLB) caching recent translations so this doesn't have to happen at full cost every single time. Because each process has its own page table, one process's virtual address 0x00400000 can point to a totally different physical page than another process's identical virtual address — this is what makes process memory isolation possible without programs needing to coordinate addresses with each other at all.",

    underTheHood:
      "Address translation flow on a memory access:\n" +
      "  Program uses virtual address VA\n" +
      "      ↓\n" +
      "  CPU checks TLB for a cached VA→PA translation\n" +
      "      ↓ (TLB miss)\n" +
      "  MMU walks the process's page table\n" +
      "      ↓\n" +
      "  Page table entry found?\n" +
      "    ├── Yes, mapped to a physical frame → translate, access RAM, cache in TLB\n" +
      "    └── No / marked 'not present' → PAGE FAULT\n" +
      "                                       ↓\n" +
      "                              OS handler decides:\n" +
      "                                - page is on disk (swapped out) → load it, retry\n" +
      "                                - page was never allocated → illegal access, kill process\n" +
      "                                - copy-on-write page → allocate real copy, retry\n\n" +
      "Note that a page fault is a normal, expected event in the first two branches — it's the\n" +
      "mechanism that makes swapping and lazy allocation work, not merely an error condition.",

    realWorldExamples: [
      "fork() on Linux uses copy-on-write pages: the child process's page table initially points at the exact same physical pages as the parent, and a real copy only happens (via a page fault) the instant either process actually writes to a shared page — an efficient shortcut, not a hack.",
      "Memory-mapped files (mmap) let a program treat a file on disk as if it were part of its address space; reads that aren't in RAM yet trigger a page fault that transparently loads the needed chunk from disk.",
      "'Out of memory' killers (like Linux's OOM killer) exist partly because virtual memory lets processes *request* far more virtual address space than physically exists — overcommit — so the system needs a policy for when physical pressure finally becomes real.",
    ],

    codeExample: {
      language: "text",
      code:
        "// Two processes, same virtual address, different physical reality\n" +
        "\n" +
        "Process A page table:\n" +
        "  VA 0x00400000 → Physical Frame 0x00A1000\n" +
        "\n" +
        "Process B page table:\n" +
        "  VA 0x00400000 → Physical Frame 0x00F3000\n" +
        "\n" +
        "// Identical virtual address, completely separate physical memory —\n" +
        "// process A writing to 0x00400000 can never touch process B's data.",
      explanation:
        "This is the concrete mechanism behind process isolation: it's not that the OS is watchfully preventing programs from reading each other's memory — it's that programs literally cannot express an address that maps into another process's physical pages, because each process only has its own page table.",
    },

    tradeoffs: [
      "Address translation adds overhead to every memory access — mitigated heavily by the TLB, but a TLB miss (or worse, a full page fault requiring disk I/O) can be orders of magnitude slower than a cache hit.",
      "Virtual memory enables convenient abstractions (isolation, overcommit, memory-mapped files, easy fork) at the cost of real complexity in the OS and real, sometimes surprising performance cliffs (e.g., 'thrashing' when a system swaps pages to disk constantly under memory pressure).",
      "Larger page sizes reduce page-table/TLB overhead but waste memory on partially-used pages (internal fragmentation) — 'huge pages' are a real, tunable trade-off in production systems.",
    ],

    whatHappensIf: [
      {
        scenario: "What if a process tries to access a virtual address that was never allocated to it at all?",
        discussion:
          "The page table has no valid entry for it, the MMU raises a page fault, and the OS's fault handler recognizes this as an illegal access rather than a legitimate 'load from disk' or 'copy-on-write' case — this is the mechanism behind a segmentation fault.",
      },
      {
        scenario: "What if physical RAM is nearly full and a process touches a page that was swapped out to disk?",
        discussion:
          "A page fault occurs, the OS must evict some other page (per its page-replacement policy, e.g., LRU-approximate) to free a physical frame, then load the needed page from disk into that frame — this round trip to disk is dramatically slower than RAM access, which is why heavy swapping ('thrashing') causes such severe slowdowns.",
      },
    ],

    connectTheDots: [
      {
        relatedTopicId: "systems-page-tables",
        connection:
          "This topic is the 'why' behind page tables; the page-tables topic goes deeper into multi-level table structures and how they keep translation efficient for huge address spaces.",
      },
      {
        relatedTopicId: "systems-processes",
        connection:
          "Process isolation is often described at the level of 'the OS keeps processes separate' — virtual memory is the actual low-level mechanism that makes that promise concrete and enforceable by hardware, not just policy.",
      },
    ],

    engineersInsight:
      "Virtual memory is a great example of an abstraction so effective that most engineers never have to think about it — until it leaks through as a real performance problem (TLB misses, page faults, swapping), at which point understanding the mechanism underneath the illusion becomes the only way to diagnose what's actually happening.",

    surprisingFact:
      "A process can be allowed to *reserve* far more virtual address space than the machine has physical RAM (or even physical RAM + swap) — this is called overcommit, and it's routine: the OS is betting that not all of that virtual memory will actually be touched at once.",

    teachBackPrompt:
      "Explain to a junior engineer why two unrelated programs can both use memory address 0x00400000 at the same time without any conflict — walk them through what actually happens on a memory access.",

    miniChallenge: {
      prompt:
        "Your application's latency has unpredictable multi-millisecond spikes under memory pressure, even though CPU usage looks fine. Using what you know about page faults and swapping, describe your investigation plan.",
      evaluationCriteria: [
        "Hypothesizes major page faults / swapping to disk as a likely cause given the CPU-idle-but-slow symptom",
        "Names concrete tools/signals to check (e.g., page fault counters, swap usage/activity, `vmstat`-style metrics)",
        "Proposes mitigations: reducing memory footprint, pinning critical memory, adding RAM, tuning swappiness",
      ],
    },

    activeRecall: [
      {
        question: "Why is a page fault not always an error?",
        idealAnswerPoints: [
          "It's the normal mechanism triggering 'load a swapped-out page from disk' or 'allocate a real copy-on-write page' — both legitimate, expected outcomes",
          "Only some page faults (accessing memory with no valid mapping and no legitimate resolution) indicate an actual bug/illegal access",
        ],
      },
      {
        question: "What role does the TLB play, and why does it matter for performance?",
        idealAnswerPoints: [
          "It caches recent virtual-to-physical translations so the CPU doesn't have to walk the page table on every single memory access",
          "A TLB miss forces a full page-table walk, which is meaningfully slower — TLB hit rate is a real, measurable performance factor",
        ],
      },
    ],
  },
  resources: [
    { title: "OSTEP — Virtual Memory: Mechanisms", url: "https://pages.cs.wisc.edu/~remzi/OSTEP/vm-mechanism.pdf" },
    { title: "Linux Kernel Docs — Memory Management", url: "https://www.kernel.org/doc/html/latest/admin-guide/mm/index.html" },
  ],
  version: 1,
};