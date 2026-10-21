import { expect, test } from "vitest";
import { validate, toPublic, findDenied, renderLlms, renderResume, renderJsonLd, injectJsonLd, renderKbMd } from "./lib.mjs";

const fixture = () => ({
  identity: {
    name: "Test Person", title: "Engineer", employer: "Acme", city: "Auckland", country: "NZ", workRights: "Open", years: "7 years",
    url: "https://example.com/", links: { github: "https://github.com/x" },
    certificates: [{ name: "Cert", issuer: "AWS", href: "https://cert.example.com" }],
    roles: [{ org: "Acme", title: "Engineer", when: "2026 to now", summary: "Builds things." }],
  },
  logistics: { salary: { visibility: "private", text: "secret" } },
  facts: [
    { id: "f1", visibility: "public", text: "Public fact", metrics: ["9,084"], evidence: "production", source: "s" },
    { id: "f2", visibility: "private", text: "Private fact", evidence: "production", source: "s" },
  ],
  stories: [
    { id: "s1", visibility: "public", project: "p1", title: "T", questions: ["q"], publicText: "P", ownWords: "raw words", evidence: "production", source: "s" },
    { id: "s2", visibility: "on-request", project: "p1", title: "T2", questions: [], publicText: "", ownWords: "", evidence: "production", source: "s" },
  ],
  decisions: [
    { project: "p1", visibility: "public", question: "Q?", chose: "A", over: "B", because: "C", evidence: "production", source: "s" },
    { project: "p1", visibility: "private", question: "Q2?", chose: "X", over: "Y", because: "Z", evidence: "production", source: "s" },
  ],
  answers: [
    { id: "a1", visibility: "public", keys: ["one"], text: "First", links: [{ label: "P", project: "p1" }] },
    { id: "a2", visibility: "private", keys: ["two"], text: "Hidden", links: [] },
    { id: "a3", visibility: "public", keys: ["three"], text: "Third", links: [{ label: "S", story: "s1" }, { label: "W", href: "https://w.example.com" }] },
  ],
  proof: [
    { visibility: "public", label: "Repo", href: "https://github.com/x/repo", kind: "repo" },
    { visibility: "private", label: "Hidden", href: "https://hidden.example.com", kind: "repo" },
  ],
  aiPractice: [
    { id: "ai1", visibility: "public", topic: "loop", text: "Public loop", evidence: "own-statement", source: "s" },
    { id: "ai2", visibility: "private", topic: "loop", text: "Private loop", evidence: "own-statement", source: "s" },
  ],
  direction: [
    { id: "d1", visibility: "public", kind: "mine", text: "Where I go", evidence: "own-statement", source: "s" },
  ],
});

test("toPublic drops private entries, ownWords and logistics", () => {
  const pub = toPublic(fixture());
  expect(pub.facts.map((f) => f.id)).toEqual(["f1"]);
  expect(pub.stories.map((s) => s.id)).toEqual(["s1"]);
  expect("ownWords" in pub.stories[0]).toBe(false);
  expect("visibility" in pub.facts[0]).toBe(false);
  expect(pub.logistics).toBeUndefined();
  expect(pub.proof.map((p) => p.label)).toEqual(["Repo"]);
});

test("toPublic keeps order", () => expect(toPublic(fixture()).answers.map((a) => a.id)).toEqual(["a1", "a3"]));

test("validate passes a clean fixture", () => expect(validate(fixture(), ["p1"])).toEqual([]));

test("validate reports a missing evidence by entry", () => {
  const kb = fixture();
  delete kb.facts[0].evidence;
  expect(validate(kb, ["p1"])).toContain("facts[0] (id f1): missing evidence");
});

test("validate rejects a bad visibility", () => {
  const kb = fixture();
  kb.proof[0].visibility = "secret";
  expect(validate(kb, ["p1"]).join("\n")).toMatch(/proof\[0\].*visibility/);
});

test("validate rejects unknown link targets and http links", () => {
  const kb = fixture();
  kb.answers[0].links = [{ label: "x", project: "nope" }, { label: "y", story: "missing" }, { label: "z", href: "http://insecure.example.com" }];
  const problems = validate(kb, ["p1"]).join("\n");
  expect(problems).toMatch(/answers\[0\].*nope/);
  expect(problems).toMatch(/answers\[0\].*missing/);
  expect(problems).toMatch(/answers\[0\].*https/);
});

test("findDenied is case-insensitive and finds terms inside URLs", () =>
  expect(findDenied("see https://x.com/ZURU-toys", ["Zuru", "", "Other"])).toEqual(["Zuru"]));

const html = `<head>\n<!-- kb:jsonld -->\n<script type="application/ld+json">{}</script>\n<!-- /kb:jsonld -->\n</head>`;

test("injectJsonLd replaces between markers and is idempotent", () => {
  const once = injectJsonLd(html, { a: 1 });
  expect(injectJsonLd(once, { a: 1 })).toBe(once);
  expect(once.match(/application\/ld\+json/g)).toHaveLength(1);
  expect(once).toContain('"a": 1');
});

test("injectJsonLd throws when markers are missing", () => expect(() => injectJsonLd("<head></head>", {})).toThrow(/kb:jsonld/));

test("renderLlms starts with the name and lists every public proof link", () => {
  const pub = toPublic(fixture());
  const txt = renderLlms(pub);
  expect(txt.startsWith("# Test Person")).toBe(true);
  pub.proof.forEach((p) => expect(txt).toContain(p.href));
  expect(txt).toContain("### T\n\nP");
  expect(txt).not.toContain("hidden.example.com");
  expect(txt).toContain("- Q?\n  - What I did: A\n  - Instead of: B\n  - Why: C");
});

test("validate reports a decision without a question", () => {
  const kb = fixture();
  delete kb.decisions[0].question;
  expect(validate(kb, ["p1"])).toContain("decisions[0]: missing question");
});

test("renderResume follows JSON Resume with no contact details", () => {
  const r = renderResume(toPublic(fixture()));
  expect(r.basics.name).toBe("Test Person");
  expect(r.basics.location.city).toBe("Auckland");
  expect(r.work).toHaveLength(1);
  expect(r.basics.email).toBeUndefined();
  expect(r.basics.phone).toBeUndefined();
});

test("renderJsonLd is a Person with sameAs profile links, not the booking link", () => {
  const kb = fixture();
  kb.identity.links.booking = "https://cal.example.com/me";
  const j = renderJsonLd(toPublic(kb));
  expect(j["@type"]).toBe("Person");
  expect(j.sameAs).toEqual(["https://github.com/x"]);
});

test("validate passes a kb without aiPractice or direction", () => {
  const kb = fixture();
  delete kb.aiPractice;
  delete kb.direction;
  expect(validate(kb, ["p1"])).toEqual([]);
  expect(() => toPublic(kb)).not.toThrow();
});

test("validate checks aiPractice and direction entries", () => {
  const kb = fixture();
  delete kb.aiPractice[0].evidence;
  kb.direction[0].kind = "other";
  kb.direction[0].when = "soon";
  const problems = validate(kb, ["p1"]);
  expect(problems).toContain("aiPractice[0] (id ai1): missing evidence");
  expect(problems.join("\n")).toMatch(/direction\[0\].*kind/);
  expect(problems.join("\n")).toMatch(/direction\[0\].*when/);
});

test("validate rejects an unknown aiPractice topic", () => {
  const kb = fixture();
  kb.aiPractice[0].topic = "misc";
  expect(validate(kb, ["p1"]).join("\n")).toMatch(/aiPractice\[0\].*topic/);
});

test("toPublic keeps public aiPractice and drops direction entirely", () => {
  const pub = toPublic(fixture());
  expect(pub.aiPractice.map((e) => e.id)).toEqual(["ai1"]);
  expect("source" in pub.aiPractice[0]).toBe(false);
  expect("visibility" in pub.aiPractice[0]).toBe(false);
  expect("direction" in pub).toBe(false);
});

test("renderLlms adds How I work with AI from public aiPractice", () => {
  const txt = renderLlms(toPublic(fixture()));
  expect(txt).toContain("## How I work with AI");
  expect(txt).toContain("Public loop");
  expect(txt).not.toContain("Private loop");
  expect(txt).not.toContain("Where I go");
});

test("renderKbMd has every section heading in order", () => {
  const md = renderKbMd(fixture());
  const at = ["Identity", "Job search", "Facts", "Stories", "Decisions", "AI practice", "Direction", "Ask box answers", "Proof"]
    .map((h) => md.indexOf(`\n## ${h}\n`));
  at.forEach((n, i) => expect(n).toBeGreaterThan(i ? at[i - 1] : -1));
});

test("renderKbMd tags each entry with its visibility", () => {
  const lines = renderKbMd(fixture()).split("\n");
  expect(lines.find((l) => l.includes("Private fact"))).toMatch(/^- \[private\] /);
  expect(lines.find((l) => l.includes("Public fact"))).toMatch(/^- \[public\] /);
});

test("renderKbMd includes ownWords for review", () => expect(renderKbMd(fixture())).toContain("raw words"));
