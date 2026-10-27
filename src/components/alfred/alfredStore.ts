import { create } from 'zustand';

/**
 * ALFRED's "brain" for the on-site companion: what it's doing, what it's saying, and the
 * skills it can run. The sprite (AlfredBuddy) only renders this state; new agentic
 * behaviours are added as skills and triggered with `run(name)`.
 *
 * Moods:
 *  - awake:    following the cursor
 *  - heading:  walking to its perch (beside the page title) to sleep
 *  - sleeping: asleep on the perch; one click wakes it
 *  - waking:   just woken, smiling for a moment before it gets back to work
 */

export type AlfredMood = 'awake' | 'heading' | 'sleeping' | 'waking';

export type AlfredSkill = {
  name: string;
  description: string;
  run: (ctx: AlfredContext) => void | Promise<void>;
};

export type AlfredContext = {
  say: (text: string, ms?: number) => void;
};

/** A place ALFRED offers to take the visitor (go=false) or takes them right away (go=true). */
export type AlfredAction = { path: string; section?: string; label: string; go: boolean };

/** `shown` is a shorter version of `content` for the chat window (content goes to the model). */
export type ChatTurn = { role: 'user' | 'assistant'; content: string; shown?: string; action?: AlfredAction };

/** Something the visitor long-pressed: a short name for the bubble, and the text around it. */
export type AlfredSubject = { label: string; context: string };

type AlfredState = {
  mood: AlfredMood;
  bubble: string | null;
  /** While set, the bubble asks whether the visitor wants info about this subject. */
  offer: AlfredSubject | null;
  offerHelp: (subject: AlfredSubject) => void;
  acceptOffer: () => void;
  skills: Record<string, AlfredSkill>;
  /** Chat with visitors (answered by api/alfred.ts). ALFRED holds still while it's open. */
  chatOpen: boolean;
  chat: ChatTurn[];
  thinking: boolean;
  /** Where ALFRED is taking the visitor; AlfredBuddy (inside the router) carries it out. */
  trip: AlfredAction | null;
  takeTo: (action: AlfredAction) => void;
  endTrip: () => void;
  openChat: () => void;
  closeChat: () => void;
  ask: (question: string, shown?: string) => Promise<void>;
  setMood: (mood: AlfredMood) => void;
  /** Walk to the perch and fall asleep there. */
  sleep: () => void;
  /** Open eyes, smile, and get back to following the cursor. */
  wake: () => void;
  say: (text: string, ms?: number) => void;
  hush: () => void;
  /** Keep the bubble up while the pointer is on it; let it fade shortly after it leaves. */
  holdBubble: (hold: boolean) => void;
  register: (skill: AlfredSkill) => void;
  run: (name: string) => void;
};

const ASLEEP_KEY = 'alfred_asleep';
const WAKING_MS = 1400;
const BUBBLE_LINGER_MS = 2000;
const OFFER_MS = 7000;

const readAsleep = () => {
  try {
    return localStorage.getItem(ASLEEP_KEY) === 'true';
  } catch {
    return false;
  }
};

const saveAsleep = (asleep: boolean) => {
  try {
    localStorage.setItem(ASLEEP_KEY, String(asleep));
  } catch {
    /* storage unavailable: the choice lasts for this visit */
  }
};

let bubbleTimer: ReturnType<typeof setTimeout> | undefined;
let wakingTimer: ReturnType<typeof setTimeout> | undefined;

export const useAlfred = create<AlfredState>((set, get) => ({
  mood: readAsleep() ? 'sleeping' : 'awake',
  bubble: null,
  offer: null,
  skills: {},
  chatOpen: false,
  chat: [],
  thinking: false,
  trip: null,

  offerHelp: (subject) => {
    get().wake();
    clearTimeout(bubbleTimer);
    set({ bubble: `Need info about “${subject.label}”?`, offer: subject });
    bubbleTimer = setTimeout(() => set({ bubble: null, offer: null }), OFFER_MS);
  },

  acceptOffer: () => {
    const subject = get().offer;
    if (!subject) return;
    get().openChat();
    const around = subject.context && subject.context !== subject.label ? ` It says: "${subject.context}"` : '';
    void get().ask(`Tell me about "${subject.label}" on this page.${around}`.slice(0, 600), `Tell me about “${subject.label}”`);
  },

  takeTo: (action) => set({ trip: action, chatOpen: false }),
  endTrip: () => set({ trip: null }),

  openChat: () => {
    get().hush();
    set({ chatOpen: true });
  },

  closeChat: () => set({ chatOpen: false }),

  ask: async (question, shown) => {
    const text = question.trim();
    if (!text || get().thinking) return;
    const chat: ChatTurn[] = [...get().chat, { role: 'user', content: text, shown }];
    set({ chat, thinking: true });
    let reply: string;
    let action: AlfredAction | undefined;
    try {
      const res = await fetch('/api/alfred', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: chat.map(({ role, content }) => ({ role, content })),
          page: window.location.pathname,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.action && typeof data.action.path === 'string') action = data.action;
      reply =
        res.ok && typeof data.reply === 'string'
          ? data.reply
          : res.status === 429
            ? "I'm a little busy right now. Try again in a minute?"
            : "I can't reach my brain right now. You can always reach Siddharth through /contact.";
    } catch {
      reply = "I can't reach my brain right now. You can always reach Siddharth through /contact.";
    }
    set({ chat: [...get().chat, { role: 'assistant', content: reply, action }], thinking: false });
    if (action?.go) setTimeout(() => get().takeTo(action), 900); // let them read the reply first
  },

  setMood: (mood) => {
    if (get().mood !== mood) set({ mood });
  },

  sleep: () => {
    const { mood } = get();
    if (mood === 'sleeping' || mood === 'heading') return;
    clearTimeout(wakingTimer);
    saveAsleep(true);
    get().hush();
    set({ mood: 'heading', chatOpen: false });
  },

  wake: () => {
    const { mood } = get();
    if (mood !== 'sleeping' && mood !== 'heading') return;
    saveAsleep(false);
    set({ mood: 'waking' });
    get().run('wake');
    clearTimeout(wakingTimer);
    wakingTimer = setTimeout(() => get().setMood('awake'), WAKING_MS);
  },

  say: (text, ms = 4500) => {
    clearTimeout(bubbleTimer);
    set({ bubble: text, offer: null });
    bubbleTimer = setTimeout(() => set({ bubble: null }), ms);
  },

  hush: () => {
    clearTimeout(bubbleTimer);
    set({ bubble: null, offer: null });
  },

  holdBubble: (hold) => {
    clearTimeout(bubbleTimer);
    if (!hold && get().bubble) bubbleTimer = setTimeout(() => set({ bubble: null, offer: null }), BUBBLE_LINGER_MS);
  },

  register: (skill) => set((s) => ({ skills: { ...s.skills, [skill.name]: skill } })),

  run: (name) => {
    const skill = get().skills[name];
    if (skill) void skill.run({ say: get().say });
  },
}));
