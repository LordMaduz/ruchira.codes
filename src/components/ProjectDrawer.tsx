import { useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { PROJECTS } from "@/data/projects";
import { decisionsFor, proofFor } from "@/data/kb";
import { countFrame } from "@/lib/countUp";
import FlowDiagram from "./FlowDiagram";

function Metric({ v }: { v: string }) {
  const reduce = useReducedMotion();
  const [text, setText] = useState(reduce ? v : countFrame(v, 0));
  useEffect(() => {
    if (reduce) { setText(v); return; }
    let raf = 0;
    const t0 = performance.now();
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / 700);
      setText(countFrame(v, k));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [v, reduce]);
  return <dd>{text}</dd>;
}

type Props = { id: string | null; opener: HTMLElement | null; onClose: () => void };

// Project story in a panel from the right. Radix Dialog traps focus; we hand focus back to the button that opened it.
function Decisions({ id }: { id: string }) {
  const decisions = decisionsFor(id).slice(0, 3); // spec: two or three per drawer; llms.txt keeps the rest
  const proof = proofFor(id);
  if (!decisions.length && !proof.length) return null;
  return (
    <>
      <h3>Decisions I made</h3>
      {decisions.length > 0 && <>
        <p className="dec-intro">The main trade-offs on this project. Each one starts with the problem, then what I picked and why.</p>
        <ul className="dec">
          {decisions.map((d) => (
            <li key={d.question}>
              <p className="dec-q">{d.question}</p>
              <dl>
                <dt>What I did</dt><dd className="dec-did">{d.chose}</dd>
                <dt>Instead of</dt><dd>{d.over}</dd>
                <dt>Why</dt><dd>{d.because}</dd>
              </dl>
            </li>
          ))}
        </ul>
      </>}
      {proof.length > 0 && <>
        <p className="dec-label">See the work</p>
        <ul className="dec-proof">
          {proof.map((x) => <li key={x.href}><a href={x.href} target="_blank" rel="noopener noreferrer">{x.label} <span aria-hidden="true">↗</span></a></li>)}
        </ul>
      </>}
    </>
  );
}

export default function ProjectDrawer({ id, opener, onClose }: Props) {
  const p = PROJECTS.find((x) => x.id === id);
  // closing clears `opener` before Radix asks where focus should go, so remember the last one
  const lastOpener = useRef(opener);
  if (opener) lastOpener.current = opener;
  return (
    <Dialog.Root open={!!p} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="drawer">
          <Dialog.Content className="dr-box" aria-describedby={undefined} onCloseAutoFocus={(e) => { e.preventDefault(); lastOpener.current?.focus(); }}>
            <Dialog.Close className="ic close" aria-label="Close"><X aria-hidden="true" /></Dialog.Close>
            {p && (
              <div className="dr-body">
                <div className="pmeta"><span>{p.org}</span><span>{p.role}</span><span>{p.when}</span></div>
                <Dialog.Title>{p.title}</Dialog.Title>
                <p className="psum">{p.summary}</p>
                <div className="diagram">
                  <div className="d-wide"><FlowDiagram project={p} /></div>
                  <div className="d-tall"><FlowDiagram project={p} vertical /></div>
                </div>
                {p.note && <p className="pnote">{p.note}</p>}
                <dl className="pstats">{p.metrics.map((m) => <div key={m.l}><dt>{m.l}</dt><Metric v={m.v} /></div>)}</dl>
                <h3>The problem</h3><p>{p.problem}</p>
                <h3>What I did</h3><ul className="did">{p.did.map((d) => <li key={d}>{d}</li>)}</ul>
                <h3>What happened</h3><p>{p.result}</p>
                <Decisions id={p.id} />
                <h3>Built with</h3><ul className="pills">{p.stack.map((s) => <li key={s}>{s}</li>)}</ul>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
