import { Topic } from "../../types/topic";

export const kvCache: Topic = {
  id: "genai-kv-cache",
  title: "The KV Cache: Why LLMs Don't Re-Read Everything Every Token",
  category: "generative-ai",
  difficulty: 4,
  estimatedMinutes: 20,
  prerequisites: ["genai-attention", "genai-transformers"],
  relatedTopics: ["genai-context-windows", "genai-inference-optimization", "genai-quantization"],
  concepts: ["kv-cache", "self-attention", "autoregressive-decoding", "memory-bandwidth"],
  learningObjectives: [
    "Explain why naive autoregressive generation would be quadratically wasteful without caching",
    "Describe what's actually stored in a KV cache and why it grows with context length",
    "Reason about why KV cache size, not just model size, limits how many requests a server can serve at once",
  ],
  stages: {
    hook: "An LLM generates a 500-token response one token at a time. To generate token #500, does it really re-process all 499 previous tokens from scratch through every layer of the model?",

    thinkPrompt:
      "If it did re-process everything each time, what would that cost look like as the response gets longer? And if it doesn't, what would the model need to remember instead?",

    explanationSimple:
      "Without caching, generating each new token would mean re-running the entire prompt-so-far through the whole model again — token 500 would redo the work of tokens 1 through 499, every single step. The KV cache avoids this: at each layer, the model computes a 'Key' and 'Value' vector for every token as it's processed, and instead of throwing those away, it keeps them around. When generating the next token, it only needs to compute Key/Value for the *new* token and reuse everyone else's cached ones for the attention calculation.",

    explanationDeep:
      "In self-attention, each token produces a Query, Key, and Value vector per layer. Attention for a given token compares its Query against the Keys of all previous tokens to decide how much to 'attend' to each, then combines their Values weighted by that score. Because Keys and Values for already-processed tokens never change (they depend only on those tokens' own content and position, not on tokens generated after them), they can be computed once and cached. On each new decoding step, the model computes Q/K/V for only the single new token, appends its K and V to the cache, and computes attention using the new Query against the full cached K/V history. This turns each decoding step from O(n) work per layer (re-encoding the whole sequence) into O(1) new computation plus a lookup — the total cost across a full generation becomes roughly linear in sequence length rather than quadratic.",

    underTheHood:
      "Per-layer, per-token cache growth during generation:\n" +
      "  Prompt processed (prefill): compute K,V for all prompt tokens → store in cache\n" +
      "      ↓\n" +
      "  Generate token 1: compute Q,K,V for token 1 only\n" +
      "                    attend using new Q against [cached K,V + new K,V]\n" +
      "                    append token 1's K,V to cache\n" +
      "      ↓\n" +
      "  Generate token 2: compute Q,K,V for token 2 only\n" +
      "                    attend against cache (now prompt + token 1)\n" +
      "                    append token 2's K,V to cache\n" +
      "      ↓\n" +
      "  ... repeats, cache grows by one token's K,V per step, per layer, per attention head.\n\n" +
      "Cache size ≈ 2 (K and V) × num_layers × num_heads × head_dim × sequence_length × batch_size,\n" +
      "which is why doubling context length roughly doubles memory used by the cache — independent\n" +
      "of how many parameters the model itself has.",

    realWorldExamples: [
      "vLLM's PagedAttention manages KV cache memory like an OS manages virtual memory pages, avoiding fragmentation when many requests with different lengths share GPU memory — directly analogous to the memory-management topics elsewhere in this curriculum.",
      "Multi-query attention (MQA) and grouped-query attention (GQA), used in models like LLaMA 2/3 and Mistral, deliberately reduce the number of Key/Value heads (while keeping full Query heads) specifically to shrink KV cache size and memory-bandwidth cost during inference.",
      "Serving frameworks quote 'max concurrent requests' figures that are frequently limited by available KV cache memory on the GPU, not by compute — a long-context, high-concurrency workload can be memory-bound well before it's compute-bound.",
    ],

    codeExample: {
      language: "python",
      code:
        "# Simplified: attention with and without a KV cache during generation\n" +
        "\n" +
        "# WITHOUT cache — recomputes K,V for the whole sequence every step\n" +
        "def generate_step_naive(tokens_so_far, model):\n" +
        "    K, V = model.compute_kv(tokens_so_far)   # O(len(tokens_so_far)) work, every step\n" +
        "    Q = model.compute_q(tokens_so_far[-1])\n" +
        "    return attention(Q, K, V)\n" +
        "\n" +
        "# WITH cache — only computes K,V for the new token\n" +
        "def generate_step_cached(new_token, kv_cache, model):\n" +
        "    k_new, v_new = model.compute_kv(new_token)  # O(1) work\n" +
        "    kv_cache.append(k_new, v_new)\n" +
        "    Q = model.compute_q(new_token)\n" +
        "    return attention(Q, kv_cache.K, kv_cache.V)",
      explanation:
        "The naive version's cost per step grows with sequence length, making a full generation O(n²) overall; the cached version's per-step cost is constant, making a full generation O(n) overall.",
    },

    tradeoffs: [
      "The KV cache trades GPU memory for compute savings — it's almost always the right trade for autoregressive generation, but it means memory, not raw FLOPs, is frequently the binding constraint on how many concurrent users a server can support.",
      "GQA/MQA shrink the cache and speed up serving but can slightly reduce model quality compared to full multi-head attention — a real accuracy/throughput trade-off model designers must choose upfront (it can't be changed at serve time).",
      "Longer context windows are attractive to users but scale KV cache memory linearly with length, which is a large part of why very-long-context serving is expensive even when the model itself is unchanged.",
    ],

    whatHappensIf: [
      {
        scenario: "What if 100 users send requests with 32k-token contexts simultaneously to the same GPU server?",
        discussion:
          "Even if the GPU has enough compute to process all the attention math, it may run out of memory for KV caches before it runs out of compute — this is exactly the scenario PagedAttention-style systems are built to handle gracefully, by allocating cache memory more like a paging OS than a naive contiguous buffer.",
      },
      {
        scenario: "What if a model uses grouped-query attention with 8x fewer KV heads than query heads?",
        discussion:
          "The KV cache shrinks by roughly 8x compared to standard multi-head attention with the same head count, directly increasing how many concurrent requests/longer contexts fit in the same GPU memory — this is a major reason newer open models default to GQA.",
      },
    ],

    connectTheDots: [
      {
        relatedTopicId: "genai-context-windows",
        connection:
          "The practical cost of a 'context window' isn't just an abstract token limit — it's largely the KV cache memory that window implies, which is why context window size and serving cost are tightly linked.",
      },
      {
        relatedTopicId: "genai-quantization",
        connection:
          "KV cache quantization (storing cached K/V in lower precision, e.g., int8 or fp8) is a separate lever from model-weight quantization, and can meaningfully increase max context/concurrency for the same GPU memory budget.",
      },
    ],

    engineersInsight:
      "The KV cache is a textbook memoization pattern applied at massive scale: 'don't recompute something that hasn't changed.' Recognizing that Keys and Values for already-generated tokens are immutable once computed is the entire insight — the rest is engineering the memory management around that fact efficiently under concurrency.",

    surprisingFact:
      "For many real serving workloads, a GPU runs out of memory for KV caches long before it runs out of raw compute (FLOPs) — meaning the practical bottleneck on 'how many users can this server handle at once' is often memory bandwidth/capacity, not the model's raw speed.",

    teachBackPrompt:
      "Explain to a junior engineer why an LLM API's cost and latency depend so heavily on context length, not just on output length — using the KV cache, not vague 'it's more data' hand-waving.",

    miniChallenge: {
      prompt:
        "Your team's LLM-serving system is hitting out-of-memory errors under load, even though GPU compute utilization looks low. Given what you know about the KV cache, what's your first hypothesis, and what two concrete changes would you try?",
      evaluationCriteria: [
        "Correctly hypothesizes KV cache memory pressure rather than compute, explaining the low-compute-utilization clue",
        "Proposes at least one concrete mitigation: shorter max context, GQA/MQA model choice, KV cache quantization, or a paged-memory serving framework (e.g., vLLM)",
        "Recognizes this as a memory-capacity problem distinct from raw model size",
      ],
    },

    activeRecall: [
      {
        question: "Why does the KV cache make each generation step roughly O(1) new work instead of O(n)?",
        idealAnswerPoints: [
          "Only the new token's Q, K, V need to be computed; all previous tokens' K, V are reused from cache unchanged",
          "Attention still looks at the full cached history, but that lookup/weighted-sum cost is separate from the (much larger) cost of recomputing K, V from scratch for every prior token",
        ],
      },
      {
        question: "Why does doubling the context length roughly double KV cache memory usage?",
        idealAnswerPoints: [
          "Cache size scales linearly with number of cached tokens (one K,V pair stored per token per layer per head)",
          "This is independent of the model's parameter count — a bigger context on the same model needs proportionally more cache memory",
        ],
      },
    ],
  },
  resources: [
    { title: "vLLM — PagedAttention paper", url: "https://arxiv.org/abs/2309.06180" },
    { title: "GQA: Training Generalized Multi-Query Transformer Models", url: "https://arxiv.org/abs/2305.13245" },
  ],
  version: 1,
};