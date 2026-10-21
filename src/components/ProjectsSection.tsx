import { Building2, Calendar, TrendingUp, Users } from "lucide-react";
import { PROJECTS } from "@/data/projects";
import Carousel from "./Carousel";

type Props = { onOpenProject: (id: string, el: HTMLElement) => void };

export default function ProjectsSection({ onOpenProject }: Props) {
  return (
    <section className="work" id="work">
      <div className="wrap">
        <div className="sec-h"><h2>What I've built and why</h2><p>Five projects, newest first. Open one to see how it works.</p></div>
        <Carousel
          items={PROJECTS}
          label="project"
          renderCard={(p) => (
            <article className="card project">
              <h3>{p.title}</h3>
              <div className="meta">
                <span><Building2 aria-hidden="true" />{p.org}</span>
                <span><Calendar aria-hidden="true" />{p.when}</span>
                <span><Users aria-hidden="true" />{p.role}</span>
              </div>
              <div className="card-sum"><TrendingUp aria-hidden="true" /><p style={{ margin: 0 }}>{p.summary}</p></div>
              <button className="open-hint" type="button">Click to view details</button>
            </article>
          )}
          onOpen={(p, e) => onOpenProject(p.id, (e.currentTarget as HTMLElement).querySelector(".open-hint") as HTMLElement)}
        />
      </div>
    </section>
  );
}
