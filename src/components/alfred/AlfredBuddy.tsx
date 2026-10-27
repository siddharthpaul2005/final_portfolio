import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAlfred } from './alfredStore';
import { starterSkills } from './skills';
import AlfredChat, { CHAT_WIDTH } from './AlfredChat';

/**
 * ALFRED, the on-site companion: a dot-matrix robot (same language as the banner) that follows
 * the cursor and sleeps beside the page title when told to. Positioning runs in one
 * requestAnimationFrame loop that writes to the DOM directly; React only re-renders when the
 * face changes.
 * Skills live in ./skills.ts and the shared state in ./alfredStore.ts.
 */

const COLS = 15; // sprite is COLS x ROWS dots
const ROWS = 12;
const W = 44; // sprite box in px
const H = (W * ROWS) / COLS;
const KEEP_AWAY = 48; // stop this far from the cursor so it never blocks clicks
const EASE = 0.045; // pull toward the target per frame
const MAX_SPEED = 4.5; // px per frame at 60fps
const SMOOTHING = 0.12; // how quickly velocity follows the pull
const TOUCH_NAP_MS = 6000; // on touch devices, doze off again after a tap
const GREETED_KEY = 'alfred_greeted';

// A round little head on stubby feet: 'o' outline, '.' open face (no dot), 'a' antenna bobble.
const BODY = [
  '       a       ',
  '       o       ',
  '    ooooooo    ',
  '  oo.......oo  ',
  ' o...........o ',
  'oo...........oo',
  'oo...........oo',
  ' o...........o ',
  ' o...........o ',
  '  oo.......oo  ',
  '    ooooooo    ',
  '    oo   oo    ',
];

type Face = 'open' | 'blink' | 'asleep' | 'happy';
type Look = { x: -1 | 0 | 1; y: -1 | 0 | 1 };
type Dot = [col: number, row: number, kind: 'eye' | 'mouth'];

// Face dots drawn over the fill: big 2x2 eyes and a tiny mouth.
const faceDots = (face: Face, look: Look): Dot[] => {
  if (face === 'asleep')
    return [
      [3, 5, 'eye'], [4, 6, 'eye'], [5, 6, 'eye'], [6, 5, 'eye'], // sleepy arcs
      [8, 5, 'eye'], [9, 6, 'eye'], [10, 6, 'eye'], [11, 5, 'eye'],
      [7, 9, 'mouth'],
    ];
  if (face === 'happy')
    return [
      [3, 6, 'eye'], [4, 5, 'eye'], [5, 5, 'eye'], [6, 6, 'eye'], // ^ ^
      [8, 6, 'eye'], [9, 5, 'eye'], [10, 5, 'eye'], [11, 6, 'eye'],
      [5, 8, 'mouth'], [6, 9, 'mouth'], [7, 9, 'mouth'], [8, 9, 'mouth'], [9, 8, 'mouth'],
    ];
  const mouth: Dot[] = [[6, 8, 'mouth'], [7, 9, 'mouth'], [8, 8, 'mouth']];
  if (face === 'blink')
    return [[4, 6, 'eye'], [5, 6, 'eye'], [9, 6, 'eye'], [10, 6, 'eye'], ...mouth];
  const { x, y } = look;
  return [
    [4 + x, 5 + y, 'eye'], [5 + x, 5 + y, 'eye'], [4 + x, 6 + y, 'eye'], [5 + x, 6 + y, 'eye'],
    [9 + x, 5 + y, 'eye'], [10 + x, 5 + y, 'eye'], [9 + x, 6 + y, 'eye'], [10 + x, 6 + y, 'eye'],
    ...mouth,
  ];
};

const DOT_CLASS = {
  eye: 'fill-[#2563eb] dark:fill-[#60a5fa]',
  mouth: 'fill-current',
};

// Mouse-driven following needs a fine pointer; also respect reduced motion.
const canFollow = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Find a heading on the current page by its text ("Projects", "Achievements · 5", ...).
const findSection = (name: string) => {
  const want = name.trim().toLowerCase();
  const headings = Array.from(document.querySelectorAll<HTMLElement>('main h1, main h2, main h3'));
  const text = (el: HTMLElement) => (el.textContent ?? '').trim().toLowerCase();
  return headings.find((el) => text(el) === want) ?? headings.find((el) => text(el).startsWith(want)) ?? null;
};

// Where ALFRED sleeps: just right of the page title's text (the name on Home).
const perchPoint = () => {
  const el = document.querySelector('[data-alfred-perch]') ?? document.querySelector('main h1');
  if (el) {
    const range = document.createRange();
    range.selectNodeContents(el);
    const r = range.getBoundingClientRect();
    if (r.width) {
      return { x: Math.min(r.right + 8, window.innerWidth - W - 4), y: r.bottom - H + 3 };
    }
  }
  return { x: window.innerWidth - W - 24, y: window.innerHeight - H - 120 };
};

const AlfredBuddy = () => {
  const { mood, bubble, chatOpen, trip, register, run, sleep, wake, setMood, openChat, closeChat, holdBubble, endTrip, say } =
    useAlfred();
  const navigate = useNavigate();
  const [follow] = useState(canFollow);
  const rootRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const [look, setLook] = useState<Look>({ x: 0, y: 0 });
  const [blink, setBlink] = useState(false);
  const [bubbleSide, setBubbleSide] = useState({ right: true, below: false });

  // Take the visitor where they asked: change page, then scroll to the section and light it up.
  useEffect(() => {
    if (!trip) return;
    const { path, section } = trip;
    endTrip();
    if (window.location.pathname !== path) navigate(path);
    let tries = 0;
    let timer: ReturnType<typeof setTimeout>;
    const land = () => {
      const el = section ? findSection(section) : null;
      if (section && !el && tries++ < 25) {
        timer = setTimeout(land, 120); // the new page is still rendering
        return;
      }
      if (el) {
        window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 96, behavior: 'smooth' });
        el.animate(
          [{ backgroundColor: 'rgba(59,130,246,0.22)' }, { backgroundColor: 'rgba(59,130,246,0)' }],
          { duration: 1800, easing: 'ease-out' },
        );
      }
      say(el ? `Here's ${section}.` : 'Here we are.', 2500);
    };
    timer = setTimeout(land, 400); // after the page transition and scroll reset
    return () => clearTimeout(timer);
  }, [trip, endTrip, navigate, say]);

  // Register the starter skills once.
  useEffect(() => {
    starterSkills.forEach(register);
  }, [register]);

  // Without a mouse to follow, ALFRED just naps on its perch.
  useEffect(() => {
    if (!follow) setMood('sleeping');
  }, [follow, setMood]);

  // Blink every few seconds while awake.
  useEffect(() => {
    if (mood !== 'awake') return;
    let t: ReturnType<typeof setTimeout>;
    const loop = () => {
      t = setTimeout(() => {
        setBlink(true);
        t = setTimeout(() => {
          setBlink(false);
          loop();
        }, 140);
      }, 3200 + Math.random() * 2400);
    };
    loop();
    return () => clearTimeout(t);
  }, [mood]);

  useEffect(() => {
    let pos: { x: number; y: number } | null = null;
    const vel = { x: 0, y: 0 };
    const mouse = { x: 0, y: 0, seen: false };
    let frame = 0;
    let last = performance.now();
    let awakeSince = last;
    let lastMood = useAlfred.getState().mood;
    let side = { right: true, below: false };
    let lookKey = '0,0';

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.seen = true;
    };

    const tick = (now: number) => {
      const dt = Math.min(3, (now - last) / 16.67); // frames elapsed at 60fps
      last = now;
      const { mood, chatOpen, bubble } = useAlfred.getState();
      if (mood !== lastMood) {
        if (mood === 'awake') awakeSince = now;
        lastMood = mood;
      }
      const perch = perchPoint();
      if (!pos) pos = { ...perch };

      if (mood === 'sleeping' || (mood === 'awake' && (!mouse.seen || !follow)) || (mood === 'waking' && !mouse.seen)) {
        // Resting on the perch; it scrolls with the page.
        pos.x = perch.x;
        pos.y = perch.y;
        vel.x = vel.y = 0;
        if (!follow && mood === 'awake' && !chatOpen && now - awakeSince > TOUCH_NAP_MS) setMood('sleeping');
      } else if ((mood === 'awake' && !chatOpen && !bubble) || mood === 'heading') {
        let tx: number;
        let ty: number;
        if (mood === 'heading') {
          tx = perch.x;
          ty = perch.y;
        } else {
          // Head for the point KEEP_AWAY short of the cursor.
          const dx = mouse.x - (pos.x + W / 2);
          const dy = mouse.y - (pos.y + H / 2);
          const d = Math.hypot(dx, dy) || 1;
          const reach = Math.max(0, d - KEEP_AWAY);
          tx = pos.x + (dx / d) * reach;
          ty = pos.y + (dy / d) * reach;
        }
        let wx = (tx - pos.x) * EASE;
        let wy = (ty - pos.y) * EASE;
        const w = Math.hypot(wx, wy);
        if (w > MAX_SPEED) {
          wx = (wx / w) * MAX_SPEED;
          wy = (wy / w) * MAX_SPEED;
        }
        vel.x += (wx - vel.x) * SMOOTHING * dt;
        vel.y += (wy - vel.y) * SMOOTHING * dt;
        pos.x += vel.x * dt;
        pos.y += vel.y * dt;

        if (mood === 'heading' && Math.hypot(perch.x - pos.x, perch.y - pos.y) < 2) setMood('sleeping');
        if (mood === 'awake') {
          pos.x = Math.max(4, Math.min(window.innerWidth - W - 4, pos.x));
          pos.y = Math.max(4, Math.min(window.innerHeight - H - 4, pos.y));
        }
      } else {
        // Talking (bubble or chat open), or waking after the mouse has moved: stay put so the
        // pointer can reach the buttons.
        vel.x = vel.y = 0;
      }

      if (rootRef.current) {
        rootRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
        rootRef.current.style.visibility = 'visible';
      }
      // Lean into the direction of travel.
      if (bodyRef.current) bodyRef.current.style.transform = `rotate(${Math.max(-8, Math.min(8, vel.x * 2))}deg)`;

      // Eyes look toward the cursor, one dot at most in each direction.
      if (mouse.seen) {
        const dx = mouse.x - (pos.x + W / 2);
        const dy = mouse.y - (pos.y + H / 2);
        const d = Math.hypot(dx, dy) || 1;
        const lx = (Math.abs(dx / d) > 0.45 ? Math.sign(dx) : 0) as Look['x'];
        const ly = (Math.abs(dy / d) > 0.45 ? Math.sign(dy) : 0) as Look['y'];
        const key = `${lx},${ly}`;
        if (key !== lookKey) {
          lookKey = key;
          setLook({ x: lx, y: ly });
        }
      }

      // Chat window: above ALFRED when there's room, otherwise below; always on screen.
      const panel = chatRef.current;
      if (panel) {
        const pw = Math.min(CHAT_WIDTH, window.innerWidth - 16);
        const ph = panel.offsetHeight;
        const left = Math.max(8, Math.min(window.innerWidth - pw - 8, pos.x + W / 2 - pw / 2));
        const above = pos.y - ph - 10;
        const top = above >= 8 ? above : Math.min(window.innerHeight - ph - 8, pos.y + H + 10);
        panel.style.transform = `translate3d(${left}px, ${Math.max(8, top)}px, 0)`;
        panel.style.visibility = 'visible';
      }

      const nextSide = { right: pos.x > window.innerWidth - 260, below: pos.y < 96 };
      if (nextSide.right !== side.right || nextSide.below !== side.below) {
        side = nextSide;
        setBubbleSide(nextSide);
      }

      frame = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    frame = requestAnimationFrame(tick);

    // Greet first-time visitors once.
    let greetTimer: ReturnType<typeof setTimeout> | undefined;
    try {
      if (follow && !localStorage.getItem(GREETED_KEY) && useAlfred.getState().mood === 'awake') {
        greetTimer = setTimeout(() => {
          run('greet');
          localStorage.setItem(GREETED_KEY, '1');
        }, 1800);
      }
    } catch {
      /* storage unavailable: skip the greeting */
    }

    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(frame);
      clearTimeout(greetTimer);
    };
  }, [follow, run, setMood]);

  const asleep = mood === 'sleeping';
  const face: Face = mood === 'waking' ? 'happy' : asleep ? 'asleep' : blink ? 'blink' : 'open';
  const lit = new Map(faceDots(face, look).map(([c, r, kind]) => [`${c},${r}`, kind]));

  const onClick = () => {
    if (mood === 'sleeping' || mood === 'heading') wake();
    else if (chatOpen) closeChat();
    else if (mood === 'awake') run('quip');
  };

  return (
    <>
      {chatOpen && <AlfredChat ref={chatRef} />}
      <div
        ref={rootRef}
        className="pointer-events-none fixed left-0 top-0 z-[60] text-foreground"
        style={{ width: W, height: H, willChange: 'transform', visibility: 'hidden' }}
        aria-live="polite"
      >
        {/* Speech bubble */}
        <AnimatePresence>
          {bubble && (
            <motion.div
              initial={{ opacity: 0, y: bubbleSide.below ? -6 : 6, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.18 }}
              onPointerEnter={() => holdBubble(true)}
              onPointerLeave={() => holdBubble(false)}
              className={`lg-chrome pointer-events-auto absolute w-max max-w-[230px] rounded-[14px] px-3 py-2 ${
                bubbleSide.right ? 'right-0' : 'left-0'
              } ${bubbleSide.below ? 'top-[calc(100%+8px)]' : 'bottom-[calc(100%+8px)]'}`}
            >
              <div className="relative z-[2]">
                <p className="text-[12.5px] leading-snug text-foreground">{bubble}</p>
                {mood === 'awake' && (
                  <div className="mt-1.5 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={openChat}
                      className="text-[11.5px] font-semibold text-[#2563eb] hover:underline dark:text-[#60a5fa]"
                    >
                      Talk to ALFRED
                    </button>
                    {follow && (
                      <button
                        type="button"
                        onClick={sleep}
                        className="text-[11px] font-medium text-label-2 hover:text-foreground"
                      >
                        Put to sleep
                      </button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sleep "z z" */}
        {asleep && (
          <span className="alfred-zzz absolute -right-2 -top-3 select-none font-mono text-[11px] font-bold text-[#3b82f6]">
            z<span className="ml-0.5 text-[9px]">z</span>
          </span>
        )}

        <button
          type="button"
          aria-label={asleep ? 'ALFRED is asleep. Click to wake it up.' : "ALFRED, Siddharth's assistant. Click to chat."}
          title={asleep ? 'Wake ALFRED' : undefined}
          onClick={onClick}
          className="pointer-events-auto block h-full w-full cursor-pointer"
        >
          <div ref={bodyRef} className="h-full w-full transition-transform duration-200">
            <svg viewBox={`0 0 ${COLS} ${ROWS}`} className={`h-full w-full ${asleep ? 'alfred-breathe' : 'alfred-bob'}`}>
              {BODY.flatMap((row, r) =>
                row.split('').map((ch, c) => {
                  const key = `${c},${r}`;
                  const kind = lit.get(key);
                  if (kind) return <circle key={key} cx={c + 0.5} cy={r + 0.5} r={0.4} className={DOT_CLASS[kind]} />;
                  if (ch === 'o') return <circle key={key} cx={c + 0.5} cy={r + 0.5} r={0.36} fill="currentColor" opacity={0.85} />;
                  if (ch === 'a')
                    return (
                      <circle
                        key={key}
                        cx={c + 0.5}
                        cy={r + 0.5}
                        r={0.42}
                        className={`fill-[#2563eb] dark:fill-[#60a5fa] ${asleep ? 'opacity-40' : 'alfred-pulse'}`}
                      />
                    );
                  return null;
                }),
              )}
            </svg>
          </div>
        </button>
      </div>
    </>
  );
};

export default AlfredBuddy;
