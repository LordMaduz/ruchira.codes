export type FlowNode = { id: string; x: number; y: number; t: string; s: string; k?: "ai" | "person" };
export type Project = {
  id: string; org: string; role: string; when: string; years: string; title: string; summary: string;
  h: number; label: string; nodes: FlowNode[]; edges: [string, string, string?][];
  metrics: { v: string; l: string }[]; stack: string[]; problem: string; did: string[]; result: string; note?: string;
};
export type Skill = { t: string; s: string; tools: string[]; proof: [projectId: string, text: string][] };
export type Stop = { at: [number, number]; name: string; short: string; side?: "below" | "left"; cmd: string; title: string; story: string };
export type Answer = KbAnswer;

export type Evidence = "production" | "merged" | "pre-prod" | "offline" | "own-statement";
export type KbLink = { label: string; project?: string; story?: string; href?: string };
export type KbRole = { org: string; title: string; when: string; summary: string };
export type KbFact = { id: string; text: string; project?: string; topic?: string; metrics?: string[]; evidence: Evidence; source: string };
export type KbStory = { id: string; project: string; title: string; questions: string[]; publicText: string; evidence: Evidence; source: string };
export type KbDecision = { project: string; chose: string; over: string; because: string; evidence: Evidence; source: string };
export type KbAnswer = { id: string; keys: string[]; text: string; links: KbLink[] };
export type KbProof = { label: string; href: string; kind: "repo" | "post" | "cert" | "site"; project?: string };
export type KbIdentity = {
  name: string; title: string; employer: string; city: string; country: string; workRights: string; years: string; url: string;
  links: Record<string, string>; certificates: { name: string; issuer: string; href: string }[]; roles: KbRole[];
  education: { degree: string; school: string; when: string }[]; skills: { group: string; items: string[] }[];
};
export type KbPublic = { identity: KbIdentity; facts: KbFact[]; stories: KbStory[]; decisions: KbDecision[]; answers: KbAnswer[]; proof: KbProof[] };
