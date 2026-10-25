import {
  siCplusplus, siGo, siOpenjdk, siC, siRust, siPython, siTypescript, siGnubash, siLinux,
  siPostgresql, siMysql, siMongodb, siSqlite, siSpringboot, siNodedotjs, siExpress, siFastapi,
  siReact, siGit, siDocker, siCmake, siGithubactions, siMedium, siLeetcode, siCodeforces,
  siCoursera, siGooglecolab, siJupyter, siPandas, siNumpy, siVercel, siSolana, siTauri, siVite,
  siTailwindcss, siLangchain, siGithub, siX, siCodechef, siHackerrank, siPytorch, siScikitlearn,
  siGmail, siElixir, siFlutter, siLatex, siArxiv,
  type SimpleIcon,
} from 'simple-icons';
import { cn } from '../../lib/utils';

// Official brand logos for technologies, platforms and tools, looked up by the name used in
// the data files (skills, project tags, contact links). Unknown names render nothing, so a
// pill simply shows its text.
const icons: Record<string, SimpleIcon | { img: string }> = {
  'c++': siCplusplus, 'c++20': siCplusplus, go: siGo, java: siOpenjdk, c: siC, rust: siRust,
  python: siPython, typescript: siTypescript, bash: siGnubash, linux: siLinux,
  postgresql: siPostgresql, mysql: siMysql, mongodb: siMongodb, sqlite: siSqlite, sql: siPostgresql,
  'spring boot': siSpringboot, 'node.js': siNodedotjs, node: siNodedotjs, express: siExpress,
  fastapi: siFastapi, react: siReact, git: siGit, docker: siDocker, cmake: siCmake,
  'github actions': siGithubactions, medium: siMedium, leetcode: siLeetcode,
  codeforces: siCodeforces, coursera: siCoursera, colab: siGooglecolab, 'google colab': siGooglecolab,
  jupyter: siJupyter, pandas: siPandas, numpy: siNumpy, vercel: siVercel, solana: siSolana,
  tauri: siTauri, vite: siVite, tailwind: siTailwindcss, langchain: siLangchain, github: siGithub,
  x: siX, codechef: siCodechef, hackerrank: siHackerrank, pytorch: siPytorch,
  'scikit-learn': siScikitlearn,
  grpc: { img: '/logos/grpc.png' }, 'grpc / protobuf': { img: '/logos/grpc.png' },
  protobuf: { img: '/logos/grpc.png' }, openai: { img: '/logos/openai.png' },
  gmail: siGmail, elixir: siElixir, flutter: siFlutter, latex: siLatex, arxiv: siArxiv,
  gssoc: { img: '/logos/gssoc.png' },
};

export const hasTechLogo = (name: string) => name.toLowerCase() in icons;

// Near-black brand colours would vanish in dark mode, so those follow the text colour.
const isDark = (hex: string) => {
  const n = parseInt(hex, 16);
  return 0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255) < 60;
};

const TechLogo = ({ name, size = 14, className }: { name: string; size?: number; className?: string }) => {
  const icon = icons[name.toLowerCase()];
  if (!icon) return null;
  if ('img' in icon) {
    return <img src={icon.img} alt="" className={cn('shrink-0 rounded-[3px] object-cover', className)} style={{ width: size, height: size }} />;
  }
  const dark = isDark(icon.hex);
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn('shrink-0', dark && 'fill-foreground', className)}
      fill={dark ? undefined : `#${icon.hex}`}
      style={{ width: size, height: size }}
    >
      <path d={icon.path} />
    </svg>
  );
};

export default TechLogo;

// App-icon-sized tile holding a brand logo (used in grouped list rows).
export const BrandTile = ({ name, size = 32 }: { name: string; size?: number }) => (
  <span
    className="app-icon inline-flex shrink-0 items-center justify-center bg-white dark:bg-zinc-800"
    style={{ width: size, height: size }}
  >
    <TechLogo name={name} size={Math.round(size * 0.56)} />
  </span>
);
