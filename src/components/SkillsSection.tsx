import { SKILLS } from "@/data/skills";
import { orgName } from "@/data/projects";
import Carousel from "./Carousel";

type Props = { onOpenProject: (id: string, el: HTMLElement) => void };

export default function SkillsSection({ onOpenProject }: Props) {
  return (
    <section className="skills" id="skills">
      <div className="wrap">
        <div className="sec-h"><h2>What I can do</h2><p>Each one comes with a project you can check.</p></div>
        <Carousel
          items={SKILLS}
          label="skill"
          renderCard={(k, active) => (
            <article className="card">
              <h3>{k.t}</h3>
              {active && <ul className="pills">{k.tools.map((x) => <li key={x}>{x}</li>)}</ul>}
              <div className="rule">
                <p className="label">How I use it</p>
                <p className="body">{k.s}</p>
                <div className="proofs">
                  Seen in
                  {[...new Set(k.proof.map(([id]) => id))].map((id) => (
                    <button key={id} type="button" onClick={(e) => { if (active) { e.stopPropagation(); onOpenProject(id, e.currentTarget); } }}>{orgName(id)}</button>
                  ))}
                </div>
              </div>
            </article>
          )}
        />
      </div>
    </section>
  );
}
