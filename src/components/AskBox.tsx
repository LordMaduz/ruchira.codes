import { useEffect, useRef, useState, type FormEvent } from "react";
import { useReducedMotion } from "framer-motion";
import { getAnswer } from "@/lib/ask";
import { FALLBACK } from "@/data/answers";
import { storyById } from "@/data/kb";
import type { KbLink } from "@/data/types";

const CHIPS = ["What do you work on?", "What did you do before Arbitr?", "Which languages do you use?", "How do I reach you?"];

type Props = { onOpenProject?: (id: string, el: HTMLElement) => void };

export default function AskBox({ onOpenProject }: Props) {
  const reduce = useReducedMotion();
  const [input, setInput] = useState("");
  const [q, setQ] = useState("");
  const [a, setA] = useState<string | null>(null); // null while the typing dots show
  const [said, setSaid] = useState(""); // the finished answer, for screen readers
  const [links, setLinks] = useState<KbLink[]>([]);
  const busy = useRef(false);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearInterval), []);

  const ask = async (raw: string) => {
    const question = raw.trim();
    if (!question || busy.current) return;
    busy.current = true;
    setInput("");
    setQ(question);
    setA(null);
    setSaid("");
    setLinks([]);
    // a failed lookup must not leave the box locked
    const { text, links: found } = await getAnswer(question).catch(() => ({ text: FALLBACK, links: [] as KbLink[] }));
    if (reduce) { setA(text); setSaid(text); setLinks(found); busy.current = false; return; }
    timers.current.push(window.setTimeout(() => {
      let i = 0;
      const t = window.setInterval(() => {
        i += 2;
        setA(text.slice(0, i));
        if (i >= text.length) { clearInterval(t); setSaid(text); setLinks(found); busy.current = false; }
      }, 18);
      timers.current.push(t);
    }, 650));
  };

  const submit = (e: FormEvent) => { e.preventDefault(); ask(input); };

  return (
    <div className="ask">
      <label htmlFor="ask-in">Ask me anything</label>
      <form onSubmit={submit}>
        <input id="ask-in" type="text" autoComplete="off" placeholder="Type a question" value={input} onChange={(e) => setInput(e.target.value)} />
        <button className="go" type="submit">Ask</button>
      </form>
      <div className="chips">
        {CHIPS.map((c) => <button key={c} className="chip" type="button" onClick={() => ask(c)}>{c}</button>)}
      </div>
      <p className="sr-only" aria-live="polite" data-ask-live>{said}</p>
      <div className="convo">
        {q && <div className="q">{q}</div>}
        {q && (a === null
          ? <div className="a typing"><span /><span /><span /></div>
          : <div className="a">{a}</div>)}
        {said && links.length > 0 && (
          <ul className="ask-links" aria-label="Where this comes from">
            {links.map((l) => <li key={l.label}>{linkFor(l, onOpenProject)}</li>)}
          </ul>
        )}
      </div>
      <p className="fine">Answers come from my CV and project notes only. If something isn't there, it says so and points you to me.</p>
    </div>
  );
}

// A project or story link opens that project's drawer; a web link opens in a new tab.
function linkFor(l: KbLink, open?: Props["onOpenProject"]) {
  const project = l.project ?? (l.story ? storyById(l.story)?.project : undefined);
  if (l.href) return <a className="chip" href={l.href} target="_blank" rel="noopener noreferrer">{l.label}</a>;
  if (project && open) return <button type="button" className="chip" onClick={(e) => open(project, e.currentTarget)}>{l.label}</button>;
  return null;
}
