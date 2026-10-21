import { expect, test } from "vitest";
import { KB, decisionsFor, proofFor, storyById } from "./kb";
import { PROJECTS } from "./projects";

test("every metric on the site is a public fact", () => {
  const backed = new Set(KB.facts.flatMap((f) => f.metrics ?? []));
  const shown = PROJECTS.flatMap((p) => p.metrics.map((m) => m.v));
  expect(shown.filter((v) => !backed.has(v))).toEqual([]);
});

test("public KB carries no visibility, ownWords or logistics", () => {
  const s = JSON.stringify(KB);
  ["\"visibility\"", "\"ownWords\"", "\"logistics\""].forEach((k) => expect(s).not.toContain(k));
});

test("every answer and proof link resolves", () => {
  const ids = PROJECTS.map((p) => p.id);
  KB.answers.flatMap((a) => a.links).forEach((l) => {
    if (l.project) expect(ids).toContain(l.project);
    if (l.story) expect(storyById(l.story)).toBeDefined();
    if (l.href) expect(l.href).toMatch(/^https:\/\//);
  });
  KB.proof.forEach((p) => expect(p.href).toMatch(/^https:\/\//));
});

test("decisionsFor and proofFor return [] for a project with none", () => {
  expect(decisionsFor("nope")).toEqual([]);
  expect(proofFor("nope")).toEqual([]);
});

test("every site project has public decisions", () =>
  PROJECTS.forEach((p) => expect(decisionsFor(p.id).length, p.id).toBeGreaterThanOrEqual(2)));
