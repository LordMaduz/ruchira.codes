import { expect, test } from "vitest";
import { PROJECTS, orgName } from "./projects";
import { SKILLS } from "./skills";
import { STOPS } from "./stops";
import { ANSWERS, FALLBACK } from "./answers";

const all = JSON.stringify([PROJECTS, SKILLS, STOPS, ANSWERS, FALLBACK]);

test("no em or en dashes in copy", () => expect(all).not.toMatch(/[—–]/));

test("content rules: no start year, visa or backend-only wording; Straker only where allowed", () => {
  expect(all).not.toMatch(/2019|backend work/i);
  // LandedNZ plans around its users' visas; nothing else may mention a visa
  const notLanded = JSON.stringify([PROJECTS.filter((p) => p.id !== "landednz"), SKILLS, STOPS, ANSWERS, FALLBACK]);
  expect(notLanded).not.toMatch(/visa/i);
  expect(all.match(/Straker/g)).toEqual(["Straker"]);
  expect(all).toMatch(/\(formerly Straker\)/);
});

test("singapore stop shows 2022 to 2026", () => expect(STOPS.find((s) => s.name === "Singapore")!.short).toBe("2022 to 2026"));

test("project ids are unique and every reference resolves", () => {
  const ids = PROJECTS.map((p) => p.id);
  expect(new Set(ids).size).toBe(5);
  SKILLS.forEach((k) => k.proof.forEach(([id]) => expect(ids).toContain(id)));
  PROJECTS.forEach((p) => p.edges.forEach(([a, b]) => expect(p.nodes.map((n) => n.id)).toEqual(expect.arrayContaining([a, b]))));
});

test("orgName trims the org to the company", () => expect(orgName("straker")).toBe("Arbitr"));

test("before-Arbitr answer uses the new full-stack wording", () =>
  expect(ANSWERS.some((a) => a.text.includes("Before Arbitr I was at DBS Bank"))).toBe(true));

test("no confidential Arbitr wording on the site", () =>
  expect(all).not.toMatch(/xss|9,084|\$0 an hour|tenant-isolation/i));
