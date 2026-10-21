// Pure helpers for the knowledge base export: no file access here, so they can be tested directly.

const VISIBILITY = ["public", "on-request", "private"];
const EVIDENCE = ["production", "merged", "pre-prod", "offline", "own-statement"];
const SECTIONS = ["facts", "stories", "decisions", "answers", "proof", "aiPractice", "direction"];
const NEEDS_EVIDENCE = ["facts", "stories", "decisions", "aiPractice", "direction"];
const TOPICS = ["loop", "models", "review", "memory", "cost", "tools", "enablement"];
const KINDS = ["company", "mine", "exploring"];

const label = (sec, i, e) => `${sec}[${i}]${e.id ? ` (id ${e.id})` : ""}`;

export function validate(kb, projectIds) {
  const problems = [];
  const storyIds = new Set(kb.stories.map((s) => s.id));
  for (const sec of SECTIONS) {
    (kb[sec] ?? []).forEach((e, i) => {
      const at = label(sec, i, e);
      if (!VISIBILITY.includes(e.visibility)) problems.push(`${at}: bad visibility "${e.visibility}"`);
      if (NEEDS_EVIDENCE.includes(sec)) {
        if (!e.evidence) problems.push(`${at}: missing evidence`);
        else if (!EVIDENCE.includes(e.evidence)) problems.push(`${at}: bad evidence "${e.evidence}"`);
        if (!e.source) problems.push(`${at}: missing source`);
      }
      if (sec === "decisions" && !e.question) problems.push(`${at}: missing question`);
      if (sec === "aiPractice" && !TOPICS.includes(e.topic)) problems.push(`${at}: bad topic "${e.topic}"`);
      if (sec === "direction" && !KINDS.includes(e.kind)) problems.push(`${at}: bad kind "${e.kind}"`);
      if (sec === "direction" && e.when !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(e.when)) problems.push(`${at}: bad when "${e.when}"`);
      const hrefs = [e.href, ...(e.links ?? []).map((l) => l.href)].filter(Boolean);
      hrefs.forEach((h) => { if (!h.startsWith("https://")) problems.push(`${at}: link must be https: ${h}`); });
      (e.links ?? []).forEach((l) => {
        if (l.project && !projectIds.includes(l.project)) problems.push(`${at}: unknown project "${l.project}"`);
        if (l.story && !storyIds.has(l.story)) problems.push(`${at}: unknown story "${l.story}"`);
      });
    });
  }
  return problems;
}

export function toPublic(kb) {
  const strip = ({ visibility, ownWords, source, ...rest }) => rest;
  // graduation dates stay private: they give away the career start year
  const pub = { identity: { ...kb.identity, education: kb.identity.education?.map(({ when, ...e }) => e) } };
  // direction is never public, whatever its visibility
  for (const sec of SECTIONS.filter((s) => s !== "direction")) pub[sec] = (kb[sec] ?? []).filter((e) => e.visibility === "public").map(strip);
  return pub;
}

export const findDenied = (text, terms) => {
  const t = text.toLowerCase();
  return terms.filter((term) => term.trim() && t.includes(term.trim().toLowerCase()));
};

export function renderLlms(pub) {
  const i = pub.identity;
  const out = [
    `# ${i.name}`, "",
    `> ${i.title} at ${i.employer}, ${i.city}. ${i.years}. ${i.workRights}.`, "",
    `Portfolio: ${i.url}`, "",
    "## Roles", "",
    ...i.roles.map((r) => `- ${r.title}, ${r.org} (${r.when}): ${r.summary}`), "",
  ];
  if (i.education?.length) out.push("## Education", "", ...i.education.map((e) => `- ${e.degree}, ${e.school}${e.when ? ` (${e.when})` : ""}`), "");
  out.push("## Selected facts", "", ...pub.facts.map((f) => `- ${f.text}`), "");
  out.push("## Stories", "", ...pub.stories.flatMap((s) => [`### ${s.title}`, "", s.publicText, ""]));
  out.push("## Decisions", "", ...pub.decisions.map((d) => `- ${d.question}\n  - What I did: ${d.chose}\n  - Instead of: ${d.over}\n  - Why: ${d.because}`), "");
  if (pub.aiPractice?.length) out.push("## How I work with AI", "", ...pub.aiPractice.map((e) => `- ${e.text}`), "");
  out.push("## Proof", "", ...pub.proof.map((p) => `- [${p.label}](${p.href})`), "");
  out.push("## Links", "", ...Object.entries(i.links).map(([k, v]) => `- ${k}: ${v}`), "");
  return out.join("\n");
}

export function renderResume(pub) {
  const i = pub.identity;
  return {
    $schema: "https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json",
    basics: {
      name: i.name, label: i.title, url: i.url,
      summary: `${i.title} at ${i.employer}. ${i.years}. ${i.workRights}.`,
      location: { city: i.city, countryCode: i.country },
      profiles: Object.entries(i.links).map(([network, url]) => ({ network, url })),
    },
    work: i.roles.map((r) => ({ name: r.org, position: r.title, summary: `${r.summary} (${r.when})` })),
    education: (i.education ?? []).map((e) => ({ institution: e.school, studyType: e.degree, endDate: e.when })),
    certificates: i.certificates.map((c) => ({ name: c.name, issuer: c.issuer, url: c.href })),
    skills: (i.skills ?? []).map((s) => ({ name: s.group, keywords: s.items })),
  };
}

export function renderJsonLd(pub) {
  const i = pub.identity;
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: i.name,
    jobTitle: i.title,
    worksFor: { "@type": "Organization", name: i.employer },
    address: { "@type": "PostalAddress", addressLocality: i.city, addressCountry: i.country },
    url: i.url,
    sameAs: Object.entries(i.links).filter(([k]) => k !== "booking").map(([, v]) => v),
  };
}

const OPEN = "<!-- kb:jsonld -->";
const CLOSE = "<!-- /kb:jsonld -->";

export function injectJsonLd(html, jsonld) {
  const a = html.indexOf(OPEN), b = html.indexOf(CLOSE);
  if (a < 0 || b < a) throw new Error("index.html is missing the <!-- kb:jsonld --> markers");
  const block = `${OPEN}\n  <script type="application/ld+json">\n${JSON.stringify(jsonld, null, 2)}\n  </script>\n  `;
  return html.slice(0, a) + block + html.slice(b);
}

const groupBy = (list, key) => list.reduce((g, e) => ((g[key(e)] ??= []).push(e), g), {});
const tagged = (e, text) => `- [${e.visibility}] ${text}`;
const cite = (e) => `(${e.evidence}, ${e.source})`;

// Private review copy of the whole KB, ownWords included. Read on demand; never published.
export function renderKbMd(kb) {
  const i = kb.identity;
  const out = [
    "# Knowledge base", "",
    "Generated by `pnpm kb:export` from `Me/kb/kb.json`. Edit kb.json, not this file.", "",
    "## Identity", "",
    `- ${i.name}, ${i.title} at ${i.employer}, ${i.city}. ${i.years}. ${i.workRights}.`,
    ...Object.entries(i.links).map(([k, v]) => `- ${k}: ${v}`),
    ...i.roles.map((r) => `- ${r.title}, ${r.org} (${r.when}): ${r.summary}`),
    ...(i.education ?? []).map((e) => `- ${e.degree}, ${e.school}${e.when ? ` (${e.when})` : ""}`),
    ...i.certificates.map((c) => `- ${c.name}, ${c.issuer}: ${c.href}`),
    ...(i.skills ?? []).map((s) => `- ${s.group}: ${s.items.join(", ")}`), "",
    "## Job search", "",
    ...Object.entries(kb.logistics ?? {}).map(([k, e]) => tagged(e, `${k}: ${e.text}`)), "",
    "## Facts", "",
  ];
  for (const [topic, facts] of Object.entries(groupBy(kb.facts, (f) => f.topic ?? "general")))
    out.push(`### ${topic}`, "", ...facts.map((f) => tagged(f, `${f.text}${f.metrics?.length ? ` [metrics: ${f.metrics.join(", ")}]` : ""} ${cite(f)}`)), "");
  out.push("## Stories", "");
  for (const s of kb.stories)
    out.push(`### ${s.title}`, "", tagged(s, `${s.project} ${cite(s)}`), `- Questions: ${s.questions.join(" | ")}`, `- Public text: ${s.publicText}`, `- Own words: ${s.ownWords}`, "");
  out.push("## Decisions", "", ...kb.decisions.map((d) => tagged(d, `${d.question} Did: ${d.chose} Instead of: ${d.over} Why: ${d.because} ${cite(d)}`)), "");
  out.push("## AI practice", "");
  for (const [topic, list] of Object.entries(groupBy(kb.aiPractice ?? [], (e) => e.topic)))
    out.push(`### ${topic}`, "", ...list.map((e) => tagged(e, `${e.text}${e.metrics?.length ? ` [metrics: ${e.metrics.join(", ")}]` : ""} ${cite(e)}`)), "");
  out.push("## Direction", "");
  for (const [kind, list] of Object.entries(groupBy(kb.direction ?? [], (e) => e.kind)))
    out.push(`### ${kind}`, "", ...list.map((e) => tagged(e, `${e.when ? `${e.when}: ` : ""}${e.text} ${cite(e)}`)), "");
  out.push("## Ask box answers", "", ...kb.answers.map((a) => tagged(a, `${a.keys.join(", ")}: ${a.text}`)), "");
  out.push("## Proof", "", ...kb.proof.map((p) => tagged(p, `[${p.label}](${p.href}) (${p.kind})`)), "");
  return out.join("\n");
}

export const BRIEF_MAX_LINES = 200;
const oneLine = (t) => t.replace(/\s+/g, " ").trim();
const tag = (vis, text) => `- [${vis}] ${oneLine(text)}`;

// The short private brief Claude Code auto-loads as CLAUDE.local.md. ownWords never goes in.
export function renderBrief(kb, date) {
  const i = kb.identity;
  const dir = kb.direction ?? [];
  const exploring = dir.filter((e) => e.kind === "exploring").sort((a, b) => (b.when ?? "").localeCompare(a.when ?? ""));
  const rule = (t) => tag("private", t);
  const out = [
    "# Ruchira's career context", "",
    `Generated from Me/kb/kb.json on ${date} by \`pnpm kb:export\`. Edit the KB, not this file.`, "",
    "## Who", "",
    tag("public", `${i.name}, ${i.title} at ${i.employer}, ${i.city}. ${i.years}. ${i.workRights}.`),
    ...i.roles.map((r) => tag("public", `${r.title}, ${r.org} (${r.when}): ${r.summary}`)), "",
    "## AI practice", "",
  ];
  for (const [topic, list] of Object.entries(groupBy(kb.aiPractice ?? [], (e) => e.topic)))
    out.push(`### ${topic}`, ...list.map((e) => tag(e.visibility, e.text)), "");
  out.push("## Direction", "");
  for (const [kind, list] of [["company", dir.filter((e) => e.kind === "company")], ["mine", dir.filter((e) => e.kind === "mine")], ["exploring", exploring]])
    if (list.length) out.push(`### ${kind}`, ...list.map((e) => tag(e.visibility, `${e.when ? `${e.when}: ` : ""}${e.text}`)), "");
  out.push(
    "## Job search", "",
    ...Object.entries(kb.logistics ?? {}).map(([k, e]) => tag(e.visibility, `${k}: ${e.text}`)), "",
    "## Rules", "",
    rule("Tags: [public] may be used in copy as written; [on-request] is shared only after first contact; [private] never leaves this machine."),
    rule('Copy says "7 years", frames the work as full stack (never "backend engineer"), and names the employer "Arbitr (formerly Straker)".'),
    rule("No client names and no private years or dates (career start year, Singapore move dates, graduation date) in public copy."),
    rule("Run the humanizer skill on every piece of copy before it ships."),
    rule("Never stage Me/, Straker/ or CLAUDE.local.md. Stage explicit paths only."),
    rule("Claim and attribution rules live in Straker/Analysis/straker-cv-reference.md."), "",
    "## Where things live", "",
    rule("Me/kb/kb.md, the full KB, read on demand: Identity, Job search, Facts, Stories, Decisions, AI practice, Direction, Ask box answers, Proof."),
    rule("Straker/Analysis/breakdown.md: evidence for Arbitr work and AI practice."),
    rule("Straker/Analysis/straker-cv-reference.md: evidence and claim rules."),
    rule("Me/Resume/: resumes. The resume-tailor skill writes resumes and its application tracker under Me/OUTPUT/."), "",
    "## Keep this current", "",
    rule("When the user shares something new (a tool tried, a change in direction, an achievement), add it to Me/kb/kb.json with a date, visibility, evidence and source, then re-run pnpm kb:export."), "",
  );
  return out.join("\n");
}

export function checkBrief(text, isIgnored) {
  const problems = [];
  const lines = text.replace(/\n$/, "").split("\n").length;
  if (lines > BRIEF_MAX_LINES) problems.push(`CLAUDE.local.md is ${lines} lines, over the ${BRIEF_MAX_LINES} limit`);
  if (!isIgnored) problems.push("CLAUDE.local.md is not gitignored");
  return problems;
}
