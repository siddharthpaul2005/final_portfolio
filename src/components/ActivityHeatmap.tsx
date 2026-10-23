import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { siGithub, siLeetcode, siCodeforces, type SimpleIcon } from 'simple-icons';
import { codingHandles } from '../data/coding';

type Source = 'github' | 'leetcode' | 'codeforces';
type DailyCounts = Record<string, number>;
type Activity = Partial<Record<Source, DailyCounts | null>>;

const sources: Record<Source, { label: string; unit: string; color: string; icon: SimpleIcon; href: (h: string) => string }> = {
  github: { label: 'GitHub', unit: 'contributions', color: '#2ea043', icon: siGithub, href: (h) => `https://github.com/${h}` },
  leetcode: { label: 'LeetCode', unit: 'submissions', color: '#ffa116', icon: siLeetcode, href: (h) => `https://leetcode.com/u/${h}` },
  codeforces: { label: 'Codeforces', unit: 'submissions', color: '#1f8acb', icon: siCodeforces, href: (h) => `https://codeforces.com/profile/${h}` },
};
const order: Source[] = ['github', 'leetcode', 'codeforces'];

const WEEKS = 53;
const CACHE_KEY = 'coding_activity';
const CACHE_MS = 60 * 60 * 1000;

// Today in IST (the API buckets days in IST / UTC, so this keeps "today" aligned for India).
const todayIST = () => new Date(Date.now() + 5.5 * 3600 * 1000).toISOString().slice(0, 10);
const addDays = (iso: string, n: number) => {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};
const weekday = (iso: string) => new Date(`${iso}T00:00:00Z`).getUTCDay();
const prettyDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

const loadCached = (): Activity | null => {
  try {
    const c = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
    return c && Date.now() - c.at < CACHE_MS ? c.data : null;
  } catch {
    return null;
  }
};

// Colour with alpha for intensity levels 1–4.
const levelColor = (hex: string, level: number) => {
  const alpha = [0, 0.32, 0.55, 0.78, 1][level];
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
};

const ActivityHeatmap = () => {
  const [data, setData] = useState<Activity | null>(loadCached);
  const [failed, setFailed] = useState(false);
  const available = order.filter((s) => codingHandles[s] && data?.[s]);
  const [selected, setSelected] = useState<Source[]>([]);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (data) return;
    fetch('/api/activity')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((json: Activity) => {
        setData(json);
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data: json }));
        } catch {
          /* storage unavailable */
        }
      })
      .catch(() => setFailed(true));
  }, [data]);

  // Default to every source that returned data.
  useEffect(() => {
    if (available.length && selected.length === 0) setSelected(available);
  }, [available.join(), selected.length]);

  // On narrow screens the grid scrolls; start at the most recent weeks.
  useEffect(() => {
    if (scroller.current) scroller.current.scrollLeft = scroller.current.scrollWidth;
  }, [data]);

  const today = todayIST();
  // Grid starts on the Sunday 52 weeks before this week's Sunday.
  const start = addDays(today, -(weekday(today) + (WEEKS - 1) * 7));

  const days = useMemo(() => {
    const out: { date: string; total: number; per: Partial<Record<Source, number>>; future: boolean }[] = [];
    for (let i = 0; i < WEEKS * 7; i++) {
      const date = addDays(start, i);
      const per: Partial<Record<Source, number>> = {};
      let total = 0;
      for (const s of selected) {
        const n = data?.[s]?.[date] ?? 0;
        if (n) per[s] = n;
        total += n;
      }
      out.push({ date, total, per, future: date > today });
    }
    return out;
  }, [data, selected, start, today]);

  const stats = useMemo(() => {
    const past = days.filter((d) => !d.future);
    const total = past.reduce((n, d) => n + d.total, 0);
    const active = past.filter((d) => d.total > 0).length;
    let longest = 0;
    let run = 0;
    for (const d of past) {
      run = d.total > 0 ? run + 1 : 0;
      longest = Math.max(longest, run);
    }
    // Current streak may end yesterday if nothing has been logged yet today.
    let current = 0;
    for (let i = past.length - 1; i >= 0; i--) {
      if (past[i].total > 0) current++;
      else if (i === past.length - 1) continue;
      else break;
    }
    const max = Math.max(1, ...past.map((d) => d.total));
    return { total, active, longest, current, max };
  }, [days]);

  const level = (total: number) => {
    if (!total) return 0;
    // sqrt scale so one huge day doesn't wash everything else out
    return Math.min(4, Math.max(1, Math.ceil(Math.sqrt(total / stats.max) * 4)));
  };

  const cellColor = (d: (typeof days)[number]) => {
    if (d.future) return 'transparent';
    if (!d.total) return 'var(--heat-empty)';
    // Mixed selection: colour by the source with the most activity that day.
    const lead = (Object.entries(d.per) as [Source, number][]).sort((a, b) => b[1] - a[1])[0][0];
    return levelColor(sources[lead].color, level(d.total));
  };

  const months = useMemo(() => {
    const labels: { col: number; label: string }[] = [];
    let last = '';
    for (let w = 0; w < WEEKS; w++) {
      const m = days[w * 7].date.slice(0, 7);
      if (m !== last) {
        last = m;
        // Skip a month that only has a sliver of weeks at either edge (its label would be clipped).
        const next = days[Math.min(w + 2, WEEKS - 1) * 7].date.slice(0, 7);
        if (w < WEEKS - 2 && !(w === 0 && next !== m)) labels.push({ col: w, label: new Date(`${m}-01T00:00:00Z`).toLocaleString('en-US', { month: 'short', timeZone: 'UTC' }) });
      }
    }
    return labels;
  }, [days]);

  const toggle = (s: Source) =>
    setSelected((cur) => (cur.includes(s) ? (cur.length > 1 ? cur.filter((x) => x !== s) : cur) : [...cur, s]));

  if (failed && !data) return null;

  const unit =
    selected.length === 1 ? sources[selected[0]].unit : 'contributions & submissions';

  return (
    <div className="lg rounded-[26px] p-4 sm:p-5">
      <div className="relative z-[2]">
        {/* Source toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {(data ? available : order.filter((s) => codingHandles[s])).map((s) => {
            const on = selected.includes(s);
            const meta = sources[s];
            return (
              <button
                key={s}
                type="button"
                onClick={() => toggle(s)}
                aria-pressed={on}
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[13px] font-semibold transition-all ${
                  on ? 'bg-[var(--lg-hover)] text-foreground ring-1 ring-[var(--lg-separator)]' : 'text-label-2 opacity-60 hover:opacity-100'
                }`}
              >
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: meta.color, opacity: on ? 1 : 0.4 }} />
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
                  <path d={meta.icon.path} />
                </svg>
                {meta.label}
              </button>
            );
          })}
          <span className="ml-auto text-[12px] text-label-2">Last 12 months</span>
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { label: unit, value: stats.total },
            { label: 'active days', value: stats.active },
            { label: 'current streak', value: `${stats.current}d` },
            { label: 'longest streak', value: `${stats.longest}d` },
          ].map((s) => (
            <div key={s.label} className="rounded-[14px] bg-[var(--lg-tint)] px-3 py-2">
              <p className="font-display text-[20px] font-bold leading-tight text-foreground tabular-nums">{data ? s.value : '—'}</p>
              <p className="text-[11.5px] leading-tight text-label-2">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Grid */}
        <div ref={scroller} className="no-scrollbar mt-4 overflow-x-auto">
          <div className="w-max">
            <div className="relative mb-1.5 h-3 text-[10px] text-label-2">
              {months.map((m) => (
                <span key={m.col} className="absolute" style={{ left: m.col * 12 }}>
                  {m.label}
                </span>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: data ? 1 : 0.4 }}
              className="grid grid-flow-col gap-[2px]"
              style={{ gridTemplateRows: 'repeat(7, 10px)', gridAutoColumns: '10px' }}
            >
              {days.map((d) => {
                const detail = (Object.entries(d.per) as [Source, number][])
                  .map(([s, n]) => `${n} ${sources[s].label}`)
                  .join(' · ');
                return (
                  <div
                    key={d.date}
                    title={d.future ? undefined : `${prettyDate(d.date)}: ${detail || 'no activity'}`}
                    className="rounded-[2.5px]"
                    style={{ backgroundColor: data ? cellColor(d) : 'var(--heat-empty)' }}
                  />
                );
              })}
            </motion.div>
          </div>
        </div>

        {/* Legend + profile links */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11.5px] text-label-2">
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {selected.map((s) => (
              <a key={s} href={sources[s].href(codingHandles[s])} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
                {sources[s].label} ↗
              </a>
            ))}
          </div>
          <div className="flex items-center gap-1">
            Less
            {[0, 1, 2, 3, 4].map((l) => (
              <span
                key={l}
                className="h-[10px] w-[10px] rounded-[2.5px]"
                style={{
                  backgroundColor:
                    l === 0 ? 'var(--heat-empty)' : levelColor(sources[selected.length === 1 ? selected[0] : 'github'].color, l),
                }}
              />
            ))}
            More
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityHeatmap;
