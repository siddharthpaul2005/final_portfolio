// Architecture sketch for the ALFRED project page (imported from src/content/projects/alfred.mdx).
const agents = ['Email', 'Calendar', 'Files', 'Research', 'Dev', 'System', 'Messaging', 'Media', 'Phone', 'Hands'];
const clients = ['Laptops', 'Android', 'Telegram', 'Web app'];

const Box = ({ title, sub, accent }: { title: string; sub?: string; accent?: boolean }) => (
  <div
    className={`rounded-[16px] px-4 py-3 text-center ${
      accent ? 'bg-[#0a84ff]/12 ring-1 ring-[#0a84ff]/40' : 'lg'
    }`}
  >
    <div className="relative z-[2]">
      <p className="text-[14px] font-semibold text-foreground">{title}</p>
      {sub && <p className="mt-0.5 text-[12px] text-label-2">{sub}</p>}
    </div>
  </div>
);

const Arrow = ({ label }: { label?: string }) => (
  <div className="flex flex-col items-center py-1.5 text-label-2">
    <span className="h-4 w-px bg-[var(--label-2)]" />
    {label && <span className="my-0.5 text-[11px] font-medium">{label}</span>}
    <span className="text-[10px] leading-none">▼</span>
  </div>
);

const AlfredArchitecture = () => (
  <figure className="not-prose my-8">
    <div className="flex flex-wrap justify-center gap-2">
      {clients.map((c) => (
        <span key={c} className="rounded-full border border-dashed border-[var(--label-2)] px-3 py-1 text-[12px] text-label-2">
          {c} <span className="opacity-70">(later)</span>
        </span>
      ))}
    </div>
    <Arrow />
    <Box title="Windows PC: always-on hub" sub="Runs everything; other devices connect to it" />
    <Arrow />
    <Box title="LLM planner: the brain" sub="Turns a request into steps for the agents" accent />
    <Arrow />
    <Box title="Go orchestrator" sub="Supervises agents, dispatches steps, enforces the safety gate" />
    <Arrow label="gRPC" />
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
      {agents.map((a) => (
        <div key={a} className="lg rounded-[12px] px-2 py-2 text-center">
          <p className="relative z-[2] text-[12.5px] font-medium text-foreground">{a}</p>
        </div>
      ))}
    </div>
    <figcaption className="mt-3 text-center text-[12px] text-label-2">
      Ten Python agents, each with real capabilities; every action passes the safety gate.
    </figcaption>
  </figure>
);

export default AlfredArchitecture;
