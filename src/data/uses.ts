/**
 * AI toolkit shown at /uses.
 * `proof` links a tool to a project where it was actually used, and those rows get a "Used in" tag.
 * Delete any entry you couldn't comfortably talk about in an interview.
 */

export type Tool = {
  name: string;
  logo: string; // key in components/ios/LogoMark.tsx
  note: string;
  href: string;
  proof?: { label: string; to: string };
};

export type ToolGroup = {
  title: string;
  tools: Tool[];
};

const rag = { label: 'Voice RAG', to: '/projects/voice-rag' };
const tutor = { label: 'RAG Tutor', to: '/projects/ai-rag-tutor' };
const daemon = { label: 'Agent daemon', to: '/projects/multi-agent-orchestrator' };

export const toolGroups: ToolGroup[] = [
  {
    title: 'Model gateways & APIs',
    tools: [
      { name: 'OpenRouter', logo: 'openrouter', note: 'One API across frontier and open models, so I can swap models per task and compare cost and latency.', href: 'https://openrouter.ai' },
      { name: 'OpenAI API', logo: 'openai', note: 'Generation and embeddings behind my first RAG pipeline.', href: 'https://platform.openai.com', proof: tutor },
      { name: 'Anthropic Claude API', logo: 'claude', note: 'Long-context reasoning, tool use and structured outputs.', href: 'https://docs.anthropic.com' },
      { name: 'Groq', logo: 'groq', note: 'Very low-latency inference on open models when speed matters more than size.', href: 'https://groq.com' },
    ],
  },
  {
    title: 'Local inference',
    tools: [
      { name: 'Ollama', logo: 'ollama', note: 'Running open-weight models locally for private, offline experiments.', href: 'https://ollama.com' },
      { name: 'llama.cpp', logo: 'llamacpp', note: 'Quantized GGUF models on CPU; a good way to understand inference at the systems level.', href: 'https://github.com/ggml-org/llama.cpp' },
      { name: 'LM Studio', logo: 'lmstudio', note: 'Quickly trying and benchmarking local models with an OpenAI-compatible server.', href: 'https://lmstudio.ai' },
    ],
  },
  {
    title: 'Retrieval & embeddings',
    tools: [
      { name: 'BM25', logo: 'bm25', note: 'Sparse lexical retrieval, the half of hybrid search that dense models still miss.', href: 'https://en.wikipedia.org/wiki/Okapi_BM25', proof: rag },
      { name: 'HNSW', logo: 'hnsw', note: 'Approximate nearest-neighbour index for dense vectors.', href: 'https://github.com/nmslib/hnswlib', proof: rag },
      { name: 'multilingual-e5', logo: 'huggingface', note: 'Multilingual sentence embeddings that make Hindi and Bengali queries searchable.', href: 'https://huggingface.co/intfloat/multilingual-e5-small', proof: rag },
      { name: 'Reciprocal Rank Fusion', logo: 'rrf', note: 'Fusing sparse and dense rankings without having to tune score weights.', href: 'https://plg.uwaterloo.ca/~gvcormac/cormacksigir09-rrf.pdf', proof: rag },
      { name: 'LangChain', logo: 'langchain', note: 'Chunking, embedding and retrieval plumbing.', href: 'https://www.langchain.com', proof: tutor },
      { name: 'FAISS', logo: 'meta', note: 'Vector search at scale when a dataset outgrows a simple index.', href: 'https://github.com/facebookresearch/faiss' },
    ],
  },
  {
    title: 'Speech',
    tools: [
      { name: 'Whisper / faster-whisper', logo: 'openai', note: 'Speech-to-text for voice-first interfaces.', href: 'https://github.com/SYSTRAN/faster-whisper' },
      { name: 'AI4Bharat', logo: 'ai4bharat', note: 'Indic-language datasets and models, including MSMARCO-XI.', href: 'https://ai4bharat.iitm.ac.in', proof: rag },
    ],
  },
  {
    title: 'Models & training',
    tools: [
      { name: 'PyTorch', logo: 'pytorch', note: 'Building and training networks from first principles.', href: 'https://pytorch.org' },
      { name: 'Hugging Face', logo: 'huggingface', note: 'Transformers, Datasets and the Hub for models and data.', href: 'https://huggingface.co' },
      { name: 'scikit-learn', logo: 'scikitlearn', note: 'Classical ML baselines before reaching for deep learning.', href: 'https://scikit-learn.org', proof: { label: 'Stock Predictor', to: '/projects/stock-price-predictor' } },
    ],
  },
  {
    title: 'Agents & protocols',
    tools: [
      { name: 'gRPC / Protobuf', logo: 'grpc', note: 'Typed contracts between a Go control plane and Python agents.', href: 'https://grpc.io', proof: daemon },
      { name: 'Model Context Protocol (MCP)', logo: 'mcp', note: 'The emerging standard for exposing tools and data to LLM agents.', href: 'https://modelcontextprotocol.io' },
      { name: 'Tool use & structured outputs', logo: 'json', note: 'Function calling and JSON-schema outputs for reliable agent steps.', href: 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use' },
    ],
  },
  {
    title: 'AI in my workflow',
    tools: [
      { name: 'Claude Code', logo: 'claude', note: 'Agentic coding in the terminal. I use AI to accelerate the work, not to replace understanding it.', href: 'https://www.anthropic.com/claude-code' },
      { name: 'Cursor', logo: 'cursor', note: 'AI-native editor for fast iteration.', href: 'https://cursor.com' },
      { name: 'Perplexity', logo: 'perplexity', note: 'Research with sources I can actually check.', href: 'https://www.perplexity.ai' },
      { name: 'NotebookLM', logo: 'notebooklm', note: 'Grounded Q&A over papers and lecture notes while studying.', href: 'https://notebooklm.google' },
    ],
  },
];
