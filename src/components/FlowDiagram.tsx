import { useReducedMotion } from "framer-motion";
import type { Project } from "@/data/types";

const NW = 136, NH = 52;

// Phones get the same diagram stacked top to bottom, one row per step.
function tall(p: Project): Project {
  const W = 320, gap = 16, rank: Record<string, number> = Object.fromEntries(p.nodes.map((n) => [n.id, 0]));
  p.nodes.forEach(() => p.edges.forEach(([f, t]) => (rank[t] = Math.max(rank[t], rank[f] + 1))));
  const rows: Project["nodes"][] = [];
  p.nodes.forEach((n) => (rows[rank[n.id]] ||= []).push(n));
  const nodes = rows.flatMap((row, r) => row.map((n, j) => ({ ...n, x: (W - row.length * NW - (row.length - 1) * gap) / 2 + j * (NW + gap), y: 6 + r * 88 })));
  return { ...p, nodes, h: rows.length * 88 - 24 };
}

export default function FlowDiagram({ project, vertical = false }: { project: Project; vertical?: boolean }) {
  const reduce = useReducedMotion();
  const p = vertical ? tall(project) : project, W = vertical ? 320 : 640, pre = vertical ? "dt" : "dw";
  const N = Object.fromEntries(p.nodes.map((n) => [n.id, n]));
  const edges = p.edges.map(([f, t, k = "go"], i) => {
    const a = N[f], b = N[t];
    let d;
    if (!vertical && b.x > a.x + NW / 2) {
      const x1 = a.x + NW, y1 = a.y + NH / 2, x2 = b.x, y2 = b.y + NH / 2, mx = (x1 + x2) / 2;
      d = `M${x1} ${y1} C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`;
    } else {
      const x1 = a.x + NW / 2, y1 = a.y + NH, x2 = b.x + NW / 2, y2 = b.y, my = (y1 + y2) / 2;
      d = `M${x1} ${y1} C${x1} ${my} ${x2} ${my} ${x2} ${y2}`;
    }
    return { d, k, id: `${pre}-${p.id}-${i}` };
  });

  return (
    <svg viewBox={`0 0 ${W} ${p.h}`} role="img" aria-label={p.label}>
      {edges.map((e) => <path key={e.id} id={e.id} d={e.d} className={`edge ${e.k}`} />)}
      {!reduce && edges.map((e, i) => {
        if (e.k === "soft") return null;
        const n = e.k === "review" ? 1 : 3, dur = e.k === "review" ? 3.6 : 2.4;
        // negative begin so every dot is already on its path at first paint
        return Array.from({ length: n }, (_, j) => (
          <circle key={`${e.id}-${j}`} r="4" className={`flow ${e.k}`}>
            <animateMotion dur={`${dur}s`} begin={`-${(j * dur / n + i * 0.35).toFixed(2)}s`} repeatCount="indefinite"><mpath href={`#${e.id}`} /></animateMotion>
          </circle>
        ));
      })}
      {p.nodes.map((n) => (
        <g key={n.id} className={n.k || ""}>
          <rect x={n.x} y={n.y} width={NW} height={NH} rx="14" />
          <text className="nt" x={n.x + NW / 2} y={n.y + 23}>{n.t}</text>
          <text className="ns" x={n.x + NW / 2} y={n.y + 40}>{n.s}</text>
        </g>
      ))}
    </svg>
  );
}
