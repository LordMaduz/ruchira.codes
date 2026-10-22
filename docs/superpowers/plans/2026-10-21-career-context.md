# Career Context Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Every Claude session opened in this repo auto-loads a short private brief about Ruchira (identity, AI practice, direction, job-search logistics, copy rules), generated from the one knowledge base.

**Architecture:** `Me/kb/kb.json` gains `aiPractice` and `direction` sections. `pnpm kb:export` keeps writing the public files and now also writes two private files: `Me/kb/kb.md` (full readable copy, read on demand) and `CLAUDE.local.md` (the auto-loaded brief, at most 200 lines, gitignored). All rendering lives in pure functions in `scripts/kb/lib.mjs`; `scripts/kb/export.mjs` does the file and git I/O.

**Tech Stack:** Node ESM scripts, Vitest, pnpm.

**Spec:** `docs/superpowers/specs/2026-10-21-career-context-design.md`

## Global Constraints

- `Me/`, `Straker/` and `CLAUDE.local.md` are never staged. Stage explicit paths only; never `git add -A` or `git add .`.
- Public copy rules: "7 years", full-stack framing (never "backend engineer"), "Arbitr (formerly Straker)", no client names, no private years or dates (career start year, Singapore move dates, graduation date), every public sentence passes the humanizer skill.
- Default visibility for imported AI-practice material: colleague names, ticket ids, internal service and tool names, and the employer's internal direction are `private`. Public wording follows `Straker/Analysis/straker-cv-reference.md` ("adopted, extended and operationalised"; never "relied on AI").
- `direction` never reaches any public output, whatever its visibility.
- The brief is at most 200 lines. Every content line starts with `[public]`, `[on-request]` or `[private]`. `ownWords` never appears in the brief.
- The export writes nothing if any check fails.
- Smoke runs as `SMOKE_PORT=4199 pnpm smoke` (the user's preview holds 4173).

## Review Focus

- A `kb.json` without `aiPractice` or `direction` keys (today's shape) still validates and exports. Pinned in Task 1.
- A `direction` entry marked `public` still never appears in `kb.public.json` or `llms.txt`. Pinned in Task 1.
- Entry text containing newlines does not break the one-tag-per-line rule in the brief. Pinned in Task 3.
- A brief of exactly 200 lines passes and 201 fails. Pinned in Task 3.
- When the brief check fails, none of the outputs are written, public ones included. Pinned in Task 3 (export ordering) and checked by hand in Task 3 Step 6.

---

### Task 1: `aiPractice` and `direction` in validation and the public export

**Files:**
- Modify: `scripts/kb/lib.mjs` (`SECTIONS`, `NEEDS_EVIDENCE`, `validate`, `toPublic`, `renderLlms`)
- Modify: `scripts/kb/export.mjs` (summary line)
- Test: `scripts/kb/lib.test.mjs`

**Interfaces:**
- Produces: entry shapes `aiPractice: { id, visibility, topic, text, metrics?: string[], evidence, source }` with `topic` in `["loop", "models", "review", "memory", "cost", "tools", "enablement"]`, and `direction: { id, visibility, kind, text, when?, evidence, source }` with `kind` in `["company", "mine", "exploring"]` and `when` an ISO date (`YYYY-MM-DD`). `validate` and `toPublic` keep their signatures.

- [ ] **Step 1: Write the failing tests.** Add to the fixture one public and one private `aiPractice` entry (`topic: "loop"`) and one public `direction` entry (`kind: "mine"`). Tests:
  - `validate passes a kb without aiPractice or direction`: delete both keys from the fixture; `validate(kb, ["p1"])` returns `[]` and `toPublic(kb)` does not throw.
  - `validate checks aiPractice and direction entries`: remove `evidence` from the aiPractice entry, set the direction `kind` to `"other"` and its `when` to `"soon"`. Expect `aiPractice[0] (id …): missing evidence`, a problem matching `/direction\[0\].*kind/` and one matching `/direction\[0\].*when/`.
  - `validate rejects an unknown aiPractice topic`: `topic: "misc"` gives a problem matching `/aiPractice\[0\].*topic/`.
  - `toPublic keeps public aiPractice and drops direction entirely`: `pub.aiPractice` has only the public id, without `source` or `visibility`; `"direction" in pub` is `false`.
  - `renderLlms adds How I work with AI from public aiPractice`: output contains `"## How I work with AI"` and the public entry's text, not the private one's, and not the direction text.
- [ ] **Step 2: Run** `pnpm vitest run scripts/kb`. Expected: the new tests FAIL.
- [ ] **Step 3: Implement.** Treat a missing section as `[]` everywhere (`kb[sec] ?? []`). Add `aiPractice` and `direction` to evidence checks; validate `topic`, `kind` and `when` (`/^\d{4}-\d{2}-\d{2}$/`). `toPublic` maps `aiPractice` like the other sections and never copies `direction`. `renderLlms` puts `## How I work with AI` after `## Decisions`, one `- text` line per public entry, and skips the section when empty. The export's summary line also prints the public aiPractice count.
- [ ] **Step 4: Run** `pnpm test`. Expected: all pass.
- [ ] **Step 5: Commit** `scripts/kb/lib.mjs scripts/kb/lib.test.mjs scripts/kb/export.mjs` as `feat: ai practice and direction in the knowledge base export`.

### Task 2: Generate `Me/kb/kb.md` from `kb.json`

**Files:**
- Modify: `scripts/kb/lib.mjs` (new `renderKbMd`), `scripts/kb/export.mjs`
- Test: `scripts/kb/lib.test.mjs`

**Interfaces:**
- Produces: `renderKbMd(kb) -> string`. Headings, in this order, are exactly: `## Identity`, `## Job search`, `## Facts`, `## Stories`, `## Decisions`, `## AI practice`, `## Direction`, `## Ask box answers`, `## Proof`. Task 3's "where things live" map names these headings.

Ruling carried from planning: today's `kb.md` was written by hand once and is already stale. Generating it keeps the on-demand reads current.

- [ ] **Step 1: Write the failing tests.**
  - `renderKbMd has every section heading in order`: on the fixture, the indexes of the nine headings above are strictly increasing.
  - `renderKbMd tags each entry with its visibility`: the private fact's line starts with `- [private]`, the public fact's with `- [public]`.
  - `renderKbMd includes ownWords for review`: the story's `ownWords` text appears (this file is private).
- [ ] **Step 2: Run** `pnpm vitest run scripts/kb`. Expected: FAIL, `renderKbMd` is not exported.
- [ ] **Step 3: Implement `renderKbMd(kb)`.** Top line `# Knowledge base`, then one line saying it is generated by `pnpm kb:export` and edits go in `kb.json`. Entries as `- [visibility] text (evidence, source)`. Facts are grouped under `### <topic>` (`general` when absent), stories under `### <title>` with `questions`, `publicText` and `ownWords`, decisions as question / did / instead of / why, AI practice grouped by `topic`, direction grouped by `kind` with `when` shown. Job search lists every `logistics` key. Export writes it to `Me/kb/kb.md` with the other outputs; the denylist check skips it because it is private.
- [ ] **Step 4: Run** `pnpm test && pnpm kb:export`. Expected: tests pass; `Me/kb/kb.md` is rewritten. `git status --short` shows no path under `Me/`.
- [ ] **Step 5: Commit** `scripts/kb/lib.mjs scripts/kb/lib.test.mjs scripts/kb/export.mjs` as `feat: generate the private kb review copy`.

### Task 3: The brief, its guards, and `.gitignore`

**Files:**
- Modify: `scripts/kb/lib.mjs` (new `renderBrief`, `checkBrief`), `scripts/kb/export.mjs`, `.gitignore`
- Test: `scripts/kb/lib.test.mjs`

**Interfaces:**
- Consumes: Task 2's headings (for the map), Task 1's entry shapes.
- Produces: `renderBrief(kb, date: string) -> string` and `checkBrief(text: string, isIgnored: boolean) -> string[]` (problems; `[]` when fine). `BRIEF_MAX_LINES = 200`.

- [ ] **Step 1: Write the failing tests.**
  - `renderBrief tags every content line`: every line that starts with `- ` matches `/^- \[(public|on-request|private)\] /`.
  - `renderBrief omits ownWords`: the fixture story's `ownWords` text is absent.
  - `renderBrief keeps multi-line text on one line`: an aiPractice `text` of `"a\nb"` renders as one line containing `a b`.
  - `renderBrief opens with the generated header`: line 1 is `# Ruchira's career context`, and the output contains `Generated from Me/kb/kb.json on 2026-10-21` for `date = "2026-10-21"`.
  - `renderBrief holds the standing rule`: output contains `add it to Me/kb/kb.json` and `pnpm kb:export`.
  - `checkBrief allows 200 lines and rejects 201`: 200 lines with `true` gives `[]`; 201 gives one problem matching `/201 lines/`.
  - `checkBrief rejects a brief that is not gitignored`: `checkBrief("x", false)` gives one problem matching `/CLAUDE.local.md is not gitignored/`.
- [ ] **Step 2: Run** `pnpm vitest run scripts/kb`. Expected: FAIL, functions not exported.
- [ ] **Step 3: Implement `renderBrief`.** Sections in spec order: header; `## Who` (name, title, employer, city, years, work rights, one line per role); `## AI practice` (one line per entry, grouped by topic); `## Direction` (company, then mine, then exploring sorted by `when` descending); `## Job search` (one line per `logistics` key); `## Rules` (fixed text: the tag meanings, only `[public]` lines may be used as written, the Global Constraints copy rules, run the humanizer skill on all copy, never stage `Me/`, `Straker/` or `CLAUDE.local.md`, claim rules in `Straker/Analysis/straker-cv-reference.md`); `## Where things live` (`Me/kb/kb.md` with Task 2's headings, `Straker/Analysis/breakdown.md`, `Straker/Analysis/straker-cv-reference.md`, `Me/Resume/`, and the resume-tailor application tracker `OUTPUT/index.md` when it exists); `## Keep this current` (the standing rule from spec §3 item 8). Identity fields are public; tag them `[public]`. Collapse whitespace in every entry text.
- [ ] **Step 4: Implement `checkBrief`** and wire the export: build every output first (public files, `Me/kb/kb.md`, `CLAUDE.local.md` from `renderBrief(kb, today)`), run validation, the denylist check and `checkBrief(brief, isIgnored)`, and write nothing unless all three are clean. `isIgnored` is `spawnSync("git", ["check-ignore", "-q", "CLAUDE.local.md"]).status === 0`. Add `CLAUDE.local.md` to `.gitignore` under the `Me/` line.
- [ ] **Step 5: Run** `pnpm test && pnpm kb:export`. Expected: tests pass; `CLAUDE.local.md` exists; `git check-ignore CLAUDE.local.md` prints the path; `wc -l CLAUDE.local.md` is 200 or fewer.
- [ ] **Step 6: Check the no-partial-write rule by hand.** Temporarily remove the `.gitignore` line, note `git status --short`, run `pnpm kb:export`. Expected: exit 1 with the not-gitignored message, and `git status --short` unchanged. Restore the line.
- [ ] **Step 7: Commit** `scripts/kb/lib.mjs scripts/kb/lib.test.mjs scripts/kb/export.mjs .gitignore` as `feat: generate a private career brief for every session`.

### Task 4: Import AI practice and company direction

**Files:** Modify `Me/kb/kb.json` (private, never committed)

- [ ] **Step 1:** From `Straker/Analysis/breakdown.md` §6 and §7, write `aiPractice` entries: one per workflow-loop stage group, the multi-model setup, cross-model review and the bugs it caught, subagent orchestration, MCP use, memory rules, cost discipline (RTK figures as `metrics`), the evolution timeline as one `tools` entry, the CE vs superpowers evaluation, and §7's authored-shared, authored-local and adopted lists as separate `enablement` entries. `source` is `breakdown.md §6` or `§7`. `evidence` follows the source's status labels.
- [ ] **Step 2:** From §8, write `direction` entries with `kind: "company"`, one per row, each naming the company direction and Ruchira's matching practice. All `private`.
- [ ] **Step 3:** Apply the Global Constraints visibility defaults. For each entry worth showing publicly, write a separate `public` entry in plain words with no names, ticket ids or internal tool names. Run the humanizer skill on every public entry.
- [ ] **Step 4: Run** `pnpm kb:export && pnpm test`. Expected: pass; `public/llms.txt` gains `## How I work with AI`; `grep -c "RAY-" public/llms.txt src/data/kb.public.json` prints 0 for both.
- [ ] **Step 5: STOP for the user's review** of `Me/kb/kb.md` § AI practice and § Direction. Apply their changes, re-export, then commit only the regenerated public files that changed (from `public/llms.txt src/data/kb.public.json public/resume.json index.html`) as `feat: how I work with AI in the public knowledge base`.

### Task 5: Fold `Me/ABOUT ME/` into the KB and archive it

**Files:** Modify `Me/kb/kb.json`; move `Me/ABOUT ME/` to `Me/archive/ABOUT ME/` (all private)

- [ ] **Step 1:** Compare each file in `Me/ABOUT ME/` with `kb.md`. List every fact, rule or goal missing from the KB. Conflicts resolve to the KB.
- [ ] **Step 2:** Add the missing items: facts to `facts` (with `topic`), job-search goals and the "saying no to" list to `logistics`, and voice rules from `anti-ai-writing-style.md` as a `logistics.voice` entry. Use `private` unless the content is already public on the site.
- [ ] **Step 3:** Move the folder unchanged to `Me/archive/ABOUT ME/` and re-run `pnpm kb:export && pnpm test`. Expected: pass; no path under `Me/` in `git status --short`.

### Task 6: Interview for direction and current exploration

**Files:** Modify `Me/kb/interview-notes.md`, `Me/kb/kb.json` (private)

- [ ] **Step 1:** Ask the user these questions one at a time, recording answers verbatim in `interview-notes.md` under a dated heading:
  1. What kind of role do you want next, and in what kind of company?
  2. Which parts of AI-native development do you want to go deeper on?
  3. What have you tried outside Arbitr in the last three months (tools, models, side projects)?
  4. What do you think most teams get wrong about AI-assisted development?
  5. Which of your AI practices would you bring to a new team first, and why?
  6. Where do you want to be in two to three years?
  7. What would make you turn a role down, AI-wise?
  8. Anything about your AI work you want recruiters to know that isn't in your profiles yet?
- [ ] **Step 2:** Turn each answer into `direction` entries (`mine` or `exploring`, with `when` set to the interview date for `exploring`), visibility as the user says. Keep the user's own phrasing.
- [ ] **Step 3: STOP for the user's review** of the new entries in `kb.md` § Direction. Apply changes, then `pnpm kb:export && pnpm test`. Expected: pass; `wc -l CLAUDE.local.md` is 200 or fewer. Nothing to commit (all private).

### Task 7: Point `resume-tailor` at the KB and check end to end

**Files:** Modify `~/.claude/skills/resume-tailor/SKILL.md` (outside the repo)

- [ ] **Step 1:** Draft the change: the "Locate the source files" and file list sections read `CLAUDE.local.md` first, then `Me/kb/kb.md` sections (Task 2's headings), with `Me/archive/ABOUT ME/resume-*.md` kept only as positioning skeletons. Metrics come from `kb.md` § Facts `metrics`. Show the user the diff and apply it only after they agree.
- [ ] **Step 2: End-to-end check.** From the repo root run `claude -p "What is my AI workflow, and where am I heading next? Answer from what you already know; do not read files." --max-turns 1`. Expected: the answer names the workflow loop and at least one `direction` entry from the brief. Show the user the answer.
- [ ] **Step 3:** Final check: `pnpm lint && pnpm test && pnpm build && SMOKE_PORT=4199 pnpm smoke` pass; `git log main..HEAD --oneline -- Me Straker CLAUDE.local.md` prints nothing.
