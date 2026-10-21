import { useEffect, useRef, useState, type FormEvent } from "react";
import { useReducedMotion } from "framer-motion";
import { getAnswer } from "@/lib/ask";
import { FALLBACK } from "@/data/answers";

const CHIPS = ["What do you work on?", "What did you do before Arbitr?", "Which languages do you use?", "How do I reach you?"];

export default function AskBox() {
  const reduce = useReducedMotion();
  const [input, setInput] = useState("");
  const [q, setQ] = useState("");
  const [a, setA] = useState<string | null>(null); // null while the typing dots show
  const [said, setSaid] = useState(""); // the finished answer, for screen readers
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
    // a failed lookup must not leave the box locked
    const text = await getAnswer(question).catch(() => FALLBACK);
    if (reduce) { setA(text); setSaid(text); busy.current = false; return; }
    timers.current.push(window.setTimeout(() => {
      let i = 0;
      const t = window.setInterval(() => {
        i += 2;
        setA(text.slice(0, i));
        if (i >= text.length) { clearInterval(t); setSaid(text); busy.current = false; }
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
      </div>
      <p className="fine">Answers come from my CV and project notes only. If something isn't there, it says so and points you to me.</p>
    </div>
  );
}
