import { forwardRef, useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUp, X } from 'lucide-react';
import { useAlfred } from './alfredStore';

/**
 * The chat window that opens next to ALFRED. AlfredBuddy positions it (via the forwarded ref)
 * in its animation loop so it stays beside the sprite and on screen.
 */

export const CHAT_WIDTH = 300;

const suggestions = ['What is he building right now?', 'Is he open to internships?', "What's his tech stack?"];

// Turn site paths in a reply ("/projects/alfred", "/contact") into links.
const withLinks = (text: string): ReactNode[] =>
  text.split(/(?<=^|\s|\()(\/[a-z0-9][a-z0-9\-/]*[a-z0-9])/g).map((part, i) =>
    i % 2 ? (
      <Link key={i} to={part} className="font-medium text-[#2563eb] underline-offset-2 hover:underline dark:text-[#60a5fa]">
        {part}
      </Link>
    ) : (
      part
    ),
  );

const AlfredChat = forwardRef<HTMLDivElement>((_, ref) => {
  const { chat, thinking, ask, closeChat, takeTo } = useAlfred();
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeChat();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeChat]);

  // Keep the newest message in view.
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [chat.length, thinking]);

  const send = (text: string) => {
    if (!text.trim() || thinking) return;
    setDraft('');
    void ask(text);
  };

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label="Chat with ALFRED"
      className="lg-chrome fixed left-0 top-0 z-[61] flex max-w-[calc(100vw-16px)] flex-col rounded-[18px]"
      style={{ width: CHAT_WIDTH, visibility: 'hidden' }}
    >
      <div className="relative z-[2] flex items-center justify-between px-3.5 pb-1.5 pt-3">
        <p className="text-[13px] font-semibold text-foreground">Ask ALFRED</p>
        <button
          type="button"
          onClick={closeChat}
          aria-label="Close chat"
          className="grid h-6 w-6 place-items-center rounded-full text-label-2 hover:bg-black/5 dark:hover:bg-white/10 hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div ref={listRef} className="relative z-[2] flex max-h-[260px] flex-col gap-2 overflow-y-auto px-3.5 py-1">
        {chat.length === 0 && (
          <>
            <p className="text-[12.5px] leading-snug text-label-2">
              Ask me anything about Siddharth: his projects, skills, or how to reach him.
            </p>
            <div className="flex flex-wrap gap-1.5 pb-1">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-full border border-black/15 dark:border-white/15 px-2.5 py-1 text-left text-[11.5px] text-foreground hover:border-[#3b82f6]/60"
                >
                  {s}
                </button>
              ))}
            </div>
          </>
        )}
        {chat.map((m, i) => (
          <div key={i} className={`flex max-w-[88%] flex-col gap-1 ${m.role === 'user' ? 'self-end items-end' : 'self-start items-start'}`}>
            <p
              className={`whitespace-pre-wrap rounded-[14px] px-3 py-1.5 text-[12.5px] leading-snug ${
                m.role === 'user' ? 'bg-[#2563eb] text-white' : 'bg-black/[0.06] dark:bg-white/10 text-foreground'
              }`}
            >
              {m.role === 'assistant' ? withLinks(m.content) : m.content}
            </p>
            {m.action && (
              <button
                type="button"
                onClick={() => takeTo({ ...m.action!, go: true })}
                className="inline-flex items-center gap-1 rounded-full border border-[#2563eb]/40 px-2.5 py-1 text-[11.5px] font-semibold text-[#2563eb] hover:bg-[#2563eb]/10 dark:border-[#60a5fa]/40 dark:text-[#60a5fa]"
              >
                {m.action.label}
                <ArrowRight className="h-3 w-3" />
              </button>
            )}
          </div>
        ))}
        {thinking && (
          <p className="self-start rounded-[14px] bg-black/[0.06] dark:bg-white/10 px-3 py-2" aria-label="ALFRED is thinking">
            <span className="alfred-typing inline-flex gap-1">
              <i className="h-1.5 w-1.5 rounded-full bg-current text-label-2" />
              <i className="h-1.5 w-1.5 rounded-full bg-current text-label-2" />
              <i className="h-1.5 w-1.5 rounded-full bg-current text-label-2" />
            </span>
          </p>
        )}
      </div>

      <form
        className="relative z-[2] m-2.5 mt-2 flex items-center gap-1.5 rounded-full border border-black/10 dark:border-white/15 py-1 pl-3 pr-1"
        onSubmit={(e) => {
          e.preventDefault();
          send(draft);
        }}
      >
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          maxLength={600}
          placeholder="Ask something…"
          aria-label="Your question for ALFRED"
          className="min-w-0 flex-1 bg-transparent text-[13px] text-foreground outline-none placeholder:text-label-2"
        />
        <button
          type="submit"
          disabled={!draft.trim() || thinking}
          aria-label="Send"
          className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#2563eb] text-white disabled:opacity-40"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
});

AlfredChat.displayName = 'AlfredChat';

export default AlfredChat;
