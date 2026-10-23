import React, { useState } from 'react';
import { ArrowUp, Check, Loader2, Mail, PenLine, Code2 } from 'lucide-react';
import PageShell from '../components/ios/PageShell';
import AppIcon from '../components/ios/AppIcon';
import { InsetGroup, ListRow } from '../components/ios/InsetList';
import { LinkedinIcon, XIcon } from '../components/icons/SocialIcons';
import { socials } from '../data/socials';

const empty = { name: '', email: '', subject: '', message: '' };

// iOS Mail-compose style form: labelled rows inside one glass group.
const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <label className="ios-row relative flex items-center gap-3 px-4 min-h-[50px]">
    <span className="w-16 shrink-0 text-[15px] text-label-2">{label}</span>
    {children}
  </label>
);

const inputClass =
  'w-full bg-transparent py-3 text-[15px] text-foreground placeholder:text-label-2/60 outline-none';

const Contact = () => {
  const [formData, setFormData] = useState(empty);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSent(false);
    setStatus(null);

    try {
      const response = await fetch(`https://formspree.io/f/${import.meta.env.VITE_FORMSPREE_FORM_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('Message sent. I usually reply within a couple of days.');
        setFormData(empty);
        setSent(true);
      } else {
        setStatus('Something went wrong. Please try again, or email me directly.');
      }
    } catch (error) {
      console.error(error);
      setStatus('Could not send right now. Please email me directly.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <PageShell
      title="Contact"
      subtitle="Backend SWE or AI/ML roles (internship or full-time), collaborations, or just to talk systems."
    >
      <form onSubmit={handleSubmit}>
        <InsetGroup title="New message">
          <Field label="From">
            <input name="name" required value={formData.name} onChange={handleChange} placeholder="Your name" className={inputClass} />
          </Field>
          <Field label="Email">
            <input
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="you@company.com"
              className={inputClass}
            />
          </Field>
          <Field label="Subject">
            <input name="subject" value={formData.subject} onChange={handleChange} placeholder="Backend / AI-ML role" className={inputClass} />
          </Field>
          <div className="ios-row relative px-4">
            <textarea
              name="message"
              required
              rows={7}
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell me what you're building…"
              className={`${inputClass} resize-none`}
            />
          </div>
        </InsetGroup>

        <div className="-mt-4 mb-8 flex items-center justify-between gap-4 px-1">
          <p className="text-[13px] text-label-2 min-h-[1.25rem]">{status}</p>
          <button
            type="submit"
            disabled={loading || sent}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#0a84ff] px-5 py-2.5 text-[15px] font-semibold text-white shadow-lg shadow-[#0a84ff]/25 transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : sent ? <Check className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />}
            {loading ? 'Sending' : sent ? 'Sent' : 'Send'}
          </button>
        </div>
      </form>

      <InsetGroup title="Or reach me directly">
        <ListRow
          icon={<AppIcon icon={Mail} color="blue" size={32} />}
          title="Email"
          subtitle={socials.email}
          href={`mailto:${socials.email}`}
        />
        <ListRow
          icon={
            <span className="app-icon inline-flex h-8 w-8 items-center justify-center bg-[#0a66c2]">
              <LinkedinIcon size="17" className="stroke-white" />
            </span>
          }
          title="LinkedIn"
          href={socials.linkedin}
        />
        <ListRow
          icon={
            <span className="app-icon inline-flex h-8 w-8 items-center justify-center bg-black">
              <XIcon size="13" className="fill-white" />
            </span>
          }
          title="X"
          href={socials.twitter}
        />
        <ListRow
          icon={<AppIcon icon={PenLine} color="black" size={32} />}
          title="Medium"
          subtitle="Long-form writing"
          href={socials.medium}
        />
        <ListRow
          icon={<AppIcon icon={Code2} color="orange" size={32} />}
          title="LeetCode"
          href={socials.leetcode}
        />
        <ListRow
          icon={<AppIcon icon={Code2} color="blue" size={32} />}
          title="Codeforces"
          href={socials.codeforces}
        />
      </InsetGroup>
    </PageShell>
  );
};

export default Contact;
