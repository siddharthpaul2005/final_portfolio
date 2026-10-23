import {
  siOpenrouter,
  siAnthropic,
  siClaude,
  siOllama,
  siLmstudio,
  siLangchain,
  siMeta,
  siPytorch,
  siHuggingface,
  siScikitlearn,
  siModelcontextprotocol,
  siCursor,
  siPerplexity,
  siNotebooklm,
  type SimpleIcon,
} from 'simple-icons';
import { cn } from '../../lib/utils';

// Brand marks for the AI Toolkit. Simple Icons where available (bundled SVG, themeable);
// project favicons saved in public/logos for brands Simple Icons doesn't carry;
// a monogram for concepts that have no logo (algorithms, techniques).
type Logo = { kind: 'svg'; icon: SimpleIcon } | { kind: 'img'; src: string } | { kind: 'mono'; text: string };

const logos: Record<string, Logo> = {
  openrouter: { kind: 'svg', icon: siOpenrouter },
  openai: { kind: 'img', src: '/logos/openai.png' },
  anthropic: { kind: 'svg', icon: siAnthropic },
  claude: { kind: 'svg', icon: siClaude },
  groq: { kind: 'img', src: '/logos/groq.png' },
  ollama: { kind: 'svg', icon: siOllama },
  llamacpp: { kind: 'img', src: '/logos/ggml.png' },
  lmstudio: { kind: 'svg', icon: siLmstudio },
  langchain: { kind: 'svg', icon: siLangchain },
  meta: { kind: 'svg', icon: siMeta },
  pytorch: { kind: 'svg', icon: siPytorch },
  huggingface: { kind: 'svg', icon: siHuggingface },
  scikitlearn: { kind: 'svg', icon: siScikitlearn },
  mcp: { kind: 'svg', icon: siModelcontextprotocol },
  cursor: { kind: 'svg', icon: siCursor },
  perplexity: { kind: 'svg', icon: siPerplexity },
  notebooklm: { kind: 'svg', icon: siNotebooklm },
  grpc: { kind: 'img', src: '/logos/grpc.png' },
  ai4bharat: { kind: 'img', src: '/logos/ai4bharat.png' },
  bm25: { kind: 'mono', text: 'BM25' },
  hnsw: { kind: 'mono', text: 'HNSW' },
  rrf: { kind: 'mono', text: 'RRF' },
  json: { kind: 'mono', text: '{ }' },
};

// Near-black brand colours would vanish in dark mode, so those follow the text colour instead.
const isDark = (hex: string) => {
  const n = parseInt(hex, 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 60;
};

const LogoMark = ({ id, size = 32, className }: { id: string; size?: number; className?: string }) => {
  const logo = logos[id];
  const tile = cn(
    'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-[9px] bg-white ring-1 ring-black/5 dark:bg-zinc-800 dark:ring-white/10',
    className
  );

  if (!logo || logo.kind === 'mono') {
    return (
      <span className={cn(tile, 'font-mono font-bold text-foreground')} style={{ width: size, height: size, fontSize: size * 0.27 }}>
        {logo?.text ?? '•'}
      </span>
    );
  }

  if (logo.kind === 'img') {
    return (
      <span className={tile} style={{ width: size, height: size }}>
        <img src={logo.src} alt="" className="h-full w-full object-cover" loading="lazy" />
      </span>
    );
  }

  const dark = isDark(logo.icon.hex);
  return (
    <span className={tile} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        style={{ width: size * 0.6, height: size * 0.6 }}
        className={dark ? 'fill-zinc-900 dark:fill-zinc-100' : undefined}
        fill={dark ? undefined : `#${logo.icon.hex}`}
      >
        <path d={logo.icon.path} />
      </svg>
    </span>
  );
};

export default LogoMark;
