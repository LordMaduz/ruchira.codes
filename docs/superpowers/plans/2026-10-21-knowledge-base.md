# Knowledge Base and Public Export Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A private, labelled knowledge base of Ruchira's career whose public part feeds the Ask box, a project-drawer decision log, `llms.txt`, `resume.json` and the JSON-LD block.

**Architecture:** `Me/kb/kb.json` (private, gitignored) is the master. A local Node script filters it to public entries, checks a private denylist, and writes committed outputs (`src/data/kb.public.json`, `public/llms.txt`, `public/resume.json`, JSON-LD in `index.html`). The React site reads `kb.public.json` through one typed module.

**Tech Stack:** Vite + React + TypeScript, Vitest (node env), plain Node ESM for the script, Playwright smoke script.

**Spec:** `docs/superpowers/specs/2026-10-21-knowledge-base-design.md`

## Global Constraints

- Nothing under `Me/` or `Straker/` is ever staged. Stage explicit paths; before any push, `git log main..HEAD --oneline -- Me Straker` must print nothing.
- Public copy: "7 years"; Arbitr (formerly Straker), "Straker" appears once only (existing content test); no client names, internal product names or ticket IDs; no "backend" identity label; no em or en dashes; no 2019; "visa" only inside LandedNZ copy (existing content test).
- Every public `text`/`publicText`/answer passes the `humanizer` skill before it is shown to the user.
- Visibility values: `public` · `on-request` · `private`. Evidence values: `production` · `merged` · `pre-prod` · `offline` · `own-statement`.
- Details found only in AI-drafted prep files (`Me/Stories/westpac-interview-prep/08-*`, unconfirmed parts of `02a`) are never public. The file-ops "parallel run / per-tenant cutover" detail is unconfirmed.
- No new dependencies.
- Any new UI is shown as a Claude Artifact mockup (desktop and ~390px) and agreed before it is built.

## Review Focus

- Questions with capitals, punctuation or plurals ("DBS?", "Languages") still match the right answer. Pinned in Task 5.
- Two answers with the same score: the earlier one in the list wins, every time. Pinned in Task 5.
- A denylisted client name in different case or inside a URL is still caught. Pinned in Task 3.
- Running the export twice gives byte-identical files, and a missing JSON-LD marker fails instead of appending a second block. Pinned in Task 3.
- A project with no public decisions shows no empty "Decisions" heading. Pinned in Task 4 and Task 6.

---

## File structure

| Path | Responsibility | In git |
|---|---|---|
| `Me/kb/kb.json` | Private master | no |
| `Me/kb/kb.md` | Readable review copy, generated | no |
| `Me/kb/denylist.txt` | One private term per line | no |
| `scripts/kb/lib.mjs` | Pure functions: validate, filter, guard, render | yes |
| `scripts/kb/lib.test.mjs` | Tests for `lib.mjs` with inline fixtures | yes |
| `scripts/kb/export.mjs` | CLI: read files, call `lib.mjs`, write outputs | yes |
| `src/data/kb.public.json` | Generated public KB | yes |
| `src/data/kb.ts` | Typed access for the site | yes |
| `src/data/kb.test.ts` | Metric and link integrity tests | yes |
| `public/llms.txt`, `public/resume.json` | Generated | yes |

## Shared types (`src/data/types.ts`, added in Task 4)

```ts
export type Evidence = "production" | "merged" | "pre-prod" | "offline" | "own-statement";
export type KbLink = { label: string; project?: string; story?: string; href?: string };
export type KbRole = { org: string; title: string; when: string; summary: string };
export type KbFact = { id: string; text: string; project?: string; metrics?: string[]; evidence: Evidence; source: string };
export type KbStory = { id: string; project: string; title: string; questions: string[]; publicText: string; evidence: Evidence; source: string };
export type KbDecision = { project: string; chose: string; over: string; because: string; evidence: Evidence; source: string };
export type KbAnswer = { id: string; keys: string[]; text: string; links: KbLink[] };
export type KbProof = { label: string; href: string; kind: "repo" | "post" | "cert" | "site"; project?: string };
export type KbIdentity = {
  name: string; title: string; employer: string; city: string; country: "NZ"; workRights: string; years: string;
  url: string; links: Record<string, string>; certificates: { name: string; issuer: string; href: string }[]; roles: KbRole[];
};
export type KbPublic = { identity: KbIdentity; facts: KbFact[]; stories: KbStory[]; decisions: KbDecision[]; answers: KbAnswer[]; proof: KbProof[] };
```

`Answer` in `types.ts` becomes an alias: `export type Answer = KbAnswer;`.

The private master has the same shape, plus `visibility` on every entry in `facts`, `stories`, `decisions`, `answers` and `proof`, `ownWords?: string` on stories, and a `logistics` object (never exported). `identity` is public as a whole.

---

### Task 1: Fix the GitHub profile README

**Files:** `README.md` in the `LordMaduz/LordMaduz` repo (separate repo, cloned to the scratchpad)

- [ ] **Step 1:** `gh repo clone LordMaduz/LordMaduz <scratchpad>/profile-readme`
- [ ] **Step 2:** In the LandedNZ mermaid block, change `U["Mobile and web app"]` to `U["Web app"]`. Change nothing else.
- [ ] **Step 3:** `grep -n -i "mobile" README.md` prints nothing.
- [ ] **Step 4:** Commit `fix: LandedNZ is a web app` with the attribution line. **Ask the user before pushing**; pushing updates the public GitHub profile.

### Task 2: Write the private knowledge base

**Files:** Create `Me/kb/kb.json`, `Me/kb/kb.md`, `Me/kb/denylist.txt` (all private)

Sources, in priority order: `Me/kb/interview-notes.md`, `Me/Stories/westpac-interview-prep/03-star-behavioural-bank 2.pages` (own words), `Me/ABOUT ME/projects.md`, `Me/ABOUT ME/career-bank.md`, `Straker/Analysis/straker-cv-reference.md` (its status labels map to `evidence`: PROD→production, MERGED-FOR-RELEASE→merged, PRE-PROD→pre-prod, OFFLINE→offline, PROCESS/CANDIDATE-ATTESTED→own-statement), the GitHub profile README for `proof`.

- [ ] **Step 1:** Fill `identity` (roles for DirectFN, GrubTech, DBS, Arbitr with the `when` strings already on the site), `logistics` (notice, salary, work mode, references, leaving reason: all `private` or `on-request`).
- [ ] **Step 2:** Facts: one public fact for **every** `metrics[].v` currently in `src/data/projects.ts`, with that exact string in `metrics` (e.g. `"2 hrs"`, `"50K+"`, `"<1s"`). Task 4's test depends on this.
- [ ] **Step 3:** Stories: STAR 7.1–7.10 plus Arbitr S1, S11, S18 and S-AGENT. `ownWords` verbatim (private); `publicText` 2–4 sentences. Drop the 08-file extras.
- [ ] **Step 4:** Decisions: 2–3 per project id in `projects.ts` (`straker`, `landednz`, `globe`, `dega`, `grubtech`), from `projects.ts` "Key decisions" and the STAR bank.
- [ ] **Step 5:** Answers: start from the 5 entries in `src/data/answers.ts` (same ids order first, same texts unless a fact changed), then add answers for every green "public" row in the question map. Each has `links`.
- [ ] **Step 6:** Proof: Credly badge `https://www.credly.com/badges/4c0cce51-2177-4c55-8781-e31bec65ff8c/public_url`, Hugging Face certificate `https://huggingface.co/datasets/agents-course/final-certificates/resolve/main/certificates/maduzrajapaksha/2026-01-19.png`, the repos and posts from the profile README.
- [ ] **Step 7:** `denylist.txt`: every real name in section 0.6 of `straker-cv-reference.md`, plus `RAY-`.
- [ ] **Step 8:** Run the humanizer skill on every public `text`, `publicText`, decision and answer; apply its edits.
- [ ] **Step 9:** Generate `kb.md` (grouped by visibility, then section) and **stop for the user's review**. Apply their changes before Task 4's real export.

### Task 3: Export library

**Files:** Create `scripts/kb/lib.mjs`, `scripts/kb/lib.test.mjs`

**Interfaces — Produces (all pure, no file access):**
- `validate(kb) -> string[]`: problems, each naming the entry (`"facts[3] (id x): missing evidence"`). Checks: every entry in the five arrays has `visibility` in the allowed set; facts, stories, decisions have `evidence` in the allowed set and a non-empty `source`; every `links[].project`/`story` refers to an existing project id (passed in) or story id; every `href` starts with `https://`.
  Signature: `validate(kb, projectIds: string[])`.
- `toPublic(kb) -> KbPublic`: keeps `identity`, keeps entries with `visibility === "public"`, strips `visibility` and `ownWords`, drops `logistics`. Preserves order.
- `findDenied(text: string, terms: string[]) -> string[]`: terms found, case-insensitive substring match; blank terms ignored.
- `renderLlms(pub: KbPublic) -> string`, `renderResume(pub: KbPublic) -> object`, `renderJsonLd(pub: KbPublic) -> object`, `injectJsonLd(html: string, jsonld: object) -> string`.

- [ ] **Step 1: Write failing tests** in `scripts/kb/lib.test.mjs` with a small inline fixture (one public and one private entry per array, one `logistics` field):
  - `toPublic drops private entries, ownWords and logistics` — private fact id absent; `"ownWords" in stories[0]` false; `logistics` undefined.
  - `toPublic keeps order` — public answers come out in input order.
  - `validate reports a missing evidence by entry` — result contains `"facts[0] (id f1): missing evidence"`.
  - `validate rejects unknown link targets and http links`.
  - `findDenied is case-insensitive and finds terms inside URLs` — `findDenied("see https://x.com/ZURU-toys", ["Zuru"])` equals `["Zuru"]`; blank line in terms ignored.
  - `injectJsonLd replaces between markers and is idempotent` — applying twice equals applying once; the output contains exactly one `application/ld+json`.
  - `injectJsonLd throws when markers are missing`.
  - `renderLlms` output starts with `# <name>` and contains every public proof href.
  - `renderResume` has `basics.name`, `basics.location.city === "Auckland"`, `work.length === roles.length`, no `email` and no `phone`.
- [ ] **Step 2:** `pnpm test scripts/kb` → FAIL (module not found).
- [ ] **Step 3:** Implement `lib.mjs`. JSON-LD markers are `<!-- kb:jsonld -->` and `<!-- /kb:jsonld -->`; the block between them is `<script type="application/ld+json">` + `JSON.stringify(jsonld, null, 2)` + `</script>`. `renderJsonLd` produces `@type: "Person"` with `name`, `jobTitle`, `worksFor` (employer), `address` (city, country), `url`, `sameAs` (values of `links`). `renderResume` follows JSON Resume: `basics` (name, label = title, url, summary, location, profiles from `links`), `work` from `roles` (`name`, `position`, `summary`; no dates), `certificates` from identity.
- [ ] **Step 4:** `pnpm test scripts/kb` → PASS.
- [ ] **Step 5:** Commit `scripts/kb/lib.mjs scripts/kb/lib.test.mjs` as `feat: knowledge base export library`.

### Task 4: Export CLI, generated files and typed access

**Files:** Create `scripts/kb/export.mjs`, `src/data/kb.ts`, `src/data/kb.test.ts`; generate `src/data/kb.public.json`, `public/llms.txt`, `public/resume.json`; modify `index.html:38-53`, `package.json` scripts, `src/data/types.ts`

**Interfaces:**
- Consumes: Task 3 functions.
- Produces: `src/data/kb.ts` exports `KB: KbPublic`, `decisionsFor(projectId: string): KbDecision[]`, `proofFor(projectId: string): KbProof[]`, `storyById(id: string): KbStory | undefined`.

- [ ] **Step 1:** Wrap the existing JSON-LD `<script>` in `index.html` with the two markers.
- [ ] **Step 2:** `export.mjs`: read `Me/kb/kb.json` and `Me/kb/denylist.txt`; read project ids from `src/data/projects.ts` with `/^ {4}id: "([a-z]+)", org/gm` (the `org` anchor skips the diagram node ids; expect `straker, landednz, globe, dega, grubtech`). Run `validate`; if any problems, print them and `process.exit(1)` before writing anything. Build all outputs in memory, run `findDenied` on each serialized output; any hit exits 1 naming the file and term. Only then write the four files. Add `"kb:export": "node scripts/kb/export.mjs"` to `package.json`.
- [ ] **Step 3: Write failing tests** in `src/data/kb.test.ts`:
  - `every metric on the site is a public fact` — collect `PROJECTS.flatMap(p => p.metrics.map(m => m.v))`; each is in `KB.facts.flatMap(f => f.metrics ?? [])`.
  - `public KB carries no visibility, ownWords or logistics` — `JSON.stringify(KB)` has none of `"visibility"`, `"ownWords"`, `"logistics"`.
  - `every answer and proof link resolves` — project links are in `PROJECTS` ids, story links pass `storyById`, hrefs start with `https://`.
  - `decisionsFor returns [] for a project with none` — `decisionsFor("nope")` equals `[]`.
- [ ] **Step 4:** `pnpm kb:export` (after the user approved Task 2), then `pnpm test` → the new tests PASS and the existing ones still PASS. Run `pnpm kb:export` a second time and `git diff --stat` shows no change to the generated files.
- [ ] **Step 5:** Commit `scripts/kb/export.mjs src/data/kb.ts src/data/kb.test.ts src/data/kb.public.json src/data/types.ts public/llms.txt public/resume.json index.html package.json` as `feat: export public knowledge base`.

### Task 5: Ask box on the knowledge base

**Files:** Modify `src/data/answers.ts`, `src/lib/ask.ts`, `src/lib/ask.test.ts`, `src/components/AskBox.tsx`

**Interfaces:**
- Consumes: `KB` from Task 4.
- Produces: `answerFor(q: string): KbAnswer | null` (null = no match); `getAnswer(q: string): Promise<{ text: string; links: KbLink[] }>` (fallback text with `links: []` when null). `ANSWERS` in `answers.ts` becomes `KB.answers`; `FALLBACK` stays as is.

- [ ] **Step 1: Rewrite `ask.test.ts`** to assert by answer `id` (ids from Task 2), keeping today's cases and adding:
  - `scores beat first match` — a question hitting two keys of answer B and one of answer A returns B.
  - `ties go to the earlier answer` — a question hitting one key each of A (earlier) and B returns A.
  - `capitals, punctuation and plurals still match` — `"DBS?"` and `"Which LANGUAGES?"` return their answers.
  - `"know" does not match "now"` and `empty or whitespace question returns null`.
  - `getAnswer returns fallback with no links on no match`.
- [ ] **Step 2:** `pnpm test src/lib` → FAIL.
- [ ] **Step 3:** Implement scoring in `answerFor`: lowercase the question; score = number of `keys` whose `\b<key>` regex matches; keep the highest score, first wins on ties; score 0 → null. Escape regex characters in keys.
- [ ] **Step 4:** `AskBox.tsx`: hold the links with the answer; render them under the finished answer (not while typing) as `<ul className="ask-links">` of `<a>`. A `project` link opens that project's drawer the same way the Work cards do (pass an `onOpenProject(id, el)` prop to `AskBox`, the same callback `ProjectsSection` receives); a `story` link opens the story's project; an `href` opens in a new tab with `rel="noopener"`. Update `CHIPS` only if the Task 2 answer ids changed their questions.
- [ ] **Step 5:** `pnpm test` → PASS; `pnpm build && pnpm smoke` → PASS.
- [ ] **Step 6:** Commit the four files as `feat: ask box answers from the knowledge base with proof links`.

### Task 6: Decision log in the project drawer

**Files:** Modify `src/components/ProjectDrawer.tsx:50-56`, its stylesheet, `scripts/smoke.mjs`

- [ ] **Step 1:** Publish a Claude Artifact mockup of the drawer with a "Decisions" section (chose X over Y because Z, evidence links) at desktop and ~390px, light and dark. **Stop until the user agrees.**
- [ ] **Step 2:** Build it as mocked, between "What happened" and "Built with", reading `decisionsFor(p.id)` and `proofFor(p.id)`. Render nothing (no heading) when both are empty.
- [ ] **Step 3:** Extend `scripts/smoke.mjs`: open the `straker` drawer at 360px and 1440px, assert the Decisions heading is visible and the page does not scroll sideways (reuse `noHScroll`).
- [ ] **Step 4:** `pnpm test && pnpm build && pnpm smoke` → PASS.
- [ ] **Step 5:** Commit as `feat: decision log in the project drawer`.

### Task 7: Final check

- [ ] **Step 1:** `pnpm lint && pnpm test && pnpm build && pnpm smoke` all pass.
- [ ] **Step 2:** `git log main..HEAD --oneline -- Me Straker` prints nothing; `git status --short` shows no file under `Me/` or `Straker/`.
- [ ] **Step 3:** Open `http://localhost:4173/ruchira.codes/llms.txt` and `/resume.json` from `pnpm preview`; both load.
