// Pure helpers for the knowledge base export: no file access here, so they can be tested directly.

const VISIBILITY = ["public", "on-request", "private"];
const EVIDENCE = ["production", "merged", "pre-prod", "offline", "own-statement"];
const SECTIONS = ["facts", "stories", "decisions", "answers", "proof"];
const NEEDS_EVIDENCE = ["facts", "stories", "decisions"];

const label = (sec, i, e) => `${sec}[${i}]${e.id ? ` (id ${e.id})` : ""}`;

export function validate(kb, projectIds) {
  const problems = [];
  const storyIds = new Set(kb.stories.map((s) => s.id));
  for (const sec of SECTIONS) {
    kb[sec].forEach((e, i) => {
      const at = label(sec, i, e);
      if (!VISIBILITY.includes(e.visibility)) problems.push(`${at}: bad visibility "${e.visibility}"`);
      if (NEEDS_EVIDENCE.includes(sec)) {
        if (!e.evidence) problems.push(`${at}: missing evidence`);
        else if (!EVIDENCE.includes(e.evidence)) problems.push(`${at}: bad evidence "${e.evidence}"`);
        if (!e.source) problems.push(`${at}: missing source`);
      }
      if (sec === "decisions" && !e.question) problems.push(`${at}: missing question`);
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
  for (const sec of SECTIONS) pub[sec] = kb[sec].filter((e) => e.visibility === "public").map(strip);
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
