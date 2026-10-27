import type { AlfredSkill } from './alfredStore';

/**
 * Starter skills. Future agentic behaviours (answering questions about the site, navigating,
 * pointing at sections, etc.) are added here and registered in AlfredBuddy.
 */

const quips = [
  "I'm ALFRED, Siddharth's assistant. Ask me anything about him.",
  'Tip: press Ctrl K to search the whole site.',
  'Hiring for backend or AI/ML? The contact page is one click away.',
];

const wakeLines = ["I'm up!", 'Back on duty.', 'Ready when you are.'];

let quipIndex = 0;
let wakeIndex = 0;

export const starterSkills: AlfredSkill[] = [
  {
    name: 'greet',
    description: 'Introduce myself to a first-time visitor.',
    run: ({ say }) => say("Hi, I'm ALFRED. I'll tag along while you look around.", 5000),
  },
  {
    name: 'quip',
    description: 'Say something about myself or the site.',
    run: ({ say }) => {
      say(quips[quipIndex % quips.length]);
      quipIndex++;
    },
  },
  {
    name: 'wake',
    description: 'React to being woken up.',
    run: ({ say }) => {
      say(wakeLines[wakeIndex % wakeLines.length], 2200);
      wakeIndex++;
    },
  },
];
