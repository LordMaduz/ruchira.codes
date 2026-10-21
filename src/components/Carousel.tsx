import { useCallback, useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props<T> = {
  items: T[];
  label: string;
  renderCard: (item: T, active: boolean) => ReactNode;
  onOpen?: (item: T, e: MouseEvent) => void;
};

// The live site's centred cards: scroll-snap track, arrows and dots. Port of the mockup's carousel().
export default function Carousel<T>({ items, label, renderCard, onOpen }: Props<T>) {
  const reduce = useReducedMotion();
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const go = (i: number) => {
    const t = track.current, s = t?.children[Math.max(0, Math.min(items.length - 1, i))] as HTMLElement | undefined;
    if (t && s) t.scrollTo({ left: s.offsetLeft - (t.clientWidth - s.clientWidth) / 2, behavior: reduce ? "auto" : "smooth" });
  };

  const mark = useCallback(() => {
    const t = track.current;
    if (!t) return;
    const mid = t.scrollLeft + t.clientWidth / 2;
    let best = 0, bd = Infinity;
    [...t.children].forEach((c, i) => {
      const s = c as HTMLElement, d = Math.abs(s.offsetLeft + s.clientWidth / 2 - mid);
      if (d < bd) { bd = d; best = i; }
    });
    setActive(best);
  }, []);

  useEffect(() => {
    mark();
    addEventListener("resize", mark);
    return () => removeEventListener("resize", mark);
  }, [mark]);

  const click = (e: MouseEvent, i: number) => {
    if (i !== active) { e.preventDefault(); go(i); return; } // a faded card comes to the centre first
    onOpen?.(items[i], e);
  };

  return (
    <div className="carousel">
      <button className="arrow prev" type="button" aria-label={`Previous ${label}`} onClick={() => go(active - 1)}><ChevronLeft size={24} aria-hidden="true" /></button>
      <button className="arrow next" type="button" aria-label={`Next ${label}`} onClick={() => go(active + 1)}><ChevronRight size={24} aria-hidden="true" /></button>
      <div className="track" ref={track} onScroll={() => requestAnimationFrame(mark)}>
        {items.map((it, i) => (
          <div key={i} className={`slot${i === active ? " active" : ""}`} onClick={(e) => click(e, i)}>
            {renderCard(it, i === active)}
          </div>
        ))}
      </div>
      <div className="dots">
        {items.map((_, i) => <button key={i} type="button" aria-label={`Go to ${label} ${i + 1}`} aria-current={i === active} onClick={() => go(i)} />)}
      </div>
    </div>
  );
}
