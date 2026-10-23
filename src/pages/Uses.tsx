import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import PageShell from '../components/ios/PageShell';
import LogoMark from '../components/ios/LogoMark';
import { InsetGroup } from '../components/ios/InsetList';
import { toolGroups } from '../data/uses';

const totalTools = toolGroups.reduce((n, g) => n + g.tools.length, 0);
const provenTools = toolGroups.reduce((n, g) => n + g.tools.filter((t) => t.proof).length, 0);

const Uses = () => (
  <PageShell
    eyebrow={`${totalTools} tools · ${provenTools} used in shipped projects`}
    title="AI Toolkit"
    subtitle="Models, retrieval, inference and agent tooling I work with. Tools tagged with a project are ones I've shipped with."
  >
    {toolGroups.map((group) => {
      return (
        <InsetGroup key={group.title} title={group.title}>
          {group.tools.map((tool) => (
            <div key={tool.name} className="ios-row relative flex items-start gap-3.5 px-4 py-3">
              <LogoMark id={tool.logo} size={34} className="mt-0.5" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <a
                    href={tool.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[15px] font-semibold text-foreground hover:text-[#0a84ff] transition-colors"
                  >
                    {tool.name}
                    <ArrowUpRight className="h-3.5 w-3.5 text-label-2" />
                  </a>
                  {tool.proof && (
                    <Link
                      to={tool.proof.to}
                      className="rounded-full bg-[#30d158]/15 px-2 py-0.5 text-[11px] font-semibold text-[#1f9d45] dark:text-[#30d158] hover:opacity-80"
                    >
                      Used in {tool.proof.label}
                    </Link>
                  )}
                </div>
                <p className="mt-0.5 text-[13.5px] leading-snug text-label-2">{tool.note}</p>
              </div>
            </div>
          ))}
        </InsetGroup>
      );
    })}
  </PageShell>
);

export default Uses;
