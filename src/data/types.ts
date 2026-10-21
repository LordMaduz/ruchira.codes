export type FlowNode = { id: string; x: number; y: number; t: string; s: string; k?: "ai" | "person" };
export type Project = {
  id: string; org: string; role: string; when: string; years: string; title: string; summary: string;
  h: number; label: string; nodes: FlowNode[]; edges: [string, string, string?][];
  metrics: { v: string; l: string }[]; stack: string[]; problem: string; did: string[]; result: string; note?: string;
};
export type Skill = { t: string; s: string; tools: string[]; proof: [projectId: string, text: string][] };
export type Stop = { at: [number, number]; name: string; short: string; side?: "below" | "left"; cmd: string; title: string; story: string };
export type Answer = { keys: string[]; text: string };
