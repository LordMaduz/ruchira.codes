# Career context for every session: design

Date: 2026-10-21 · Branch: `redesign` · Status: draft for review

## Goal

Any Claude session opened in this repo for career work (resumes, LinkedIn, Seek NZ, other profiles) starts out knowing who Ruchira is, how Ruchira works with AI, where the industry and Ruchira's employer are taking AI, and where Ruchira wants to go next, without Ruchira re-explaining it. The context stays private, and one source of truth feeds both the public site and the private brief.

## Agreed decisions (user, 2026-10-21)

- Sessions run in this repo (`ruchira.codes`). No separate career folder, no global `~/.claude/CLAUDE.md` changes.
- `Me/kb/kb.json` is the only source. Content in `Me/ABOUT ME/` that the KB lacks is folded in, then those files are archived.
- New material is captured by importing what already exists, then a short interview for the gaps.
- Each session auto-loads a short brief and reads `kb.md` sections on demand. It does not load the whole KB.

## Sources

- `Straker/Analysis/breakdown.md` §6 (AI-native engineering), §7 (team enablement and tools), §8 (alignment with company AI direction). The evidence and attribution rules in `Straker/Analysis/straker-cv-reference.md` apply.
- `Me/ABOUT ME/*.md`: career bank, projects, variant resumes, about-me, my-company, anti-AI writing style.
- Interview answers in `Me/kb/interview-notes.md` (private).
- Existing copy rules: "7 years", full-stack framing, Arbitr (formerly Straker), no client names, private years and dates stay off public copy, every public sentence passes the humanizer check.

## 1. KB additions

Two new sections in `kb.json`. Every entry carries `visibility`, `evidence` and `source`, as existing entries do.

- `aiPractice`: `{ id, topic, text, metrics?: string[] }`. Topics: `loop` (brainstorm → spec → plan → TDD → multi-agent review → cross-model review → memory), `models` (multi-model setup and routing), `review`, `memory`, `cost`, `tools` (MCPs, evaluations), `enablement` (split into authored-shared, authored-local and adopted, kept apart so attribution stays honest).
- `direction`: `{ id, kind, text, when? }`. `kind` is `company` (where the employer is taking AI, from §8), `mine` (where Ruchira wants to go) or `exploring` (what Ruchira is trying now). `when` is an ISO date for `exploring` entries.

Default visibility: names of colleagues, ticket ids, internal service and tool names, and the employer's internal direction are `private`. Public wording follows the CV reference ("adopted, extended and operationalised"; never "relied on AI").

`toPublic` passes only `public` `aiPractice` entries, with `visibility`, `ownWords` and `source` stripped. It omits `direction` entirely, whatever its visibility. `llms.txt` gains a "How I work with AI" section built from public `aiPractice` entries.

## 2. Retire `Me/ABOUT ME/`

Facts, voice rules and job-search goals missing from the KB move into `kb.json` (`facts`, `identity`, `logistics`). Conflicts resolve to the KB, which is newer ("7 years", full stack). The originals move to `Me/archive/ABOUT ME/` unchanged. The global `resume-tailor` skill is changed to read `Me/kb/kb.md` and `CLAUDE.local.md` instead of `ABOUT ME/`. That edit is outside this repo, so the user sees the diff before it is applied.

## 3. The brief: `CLAUDE.local.md`

Claude Code auto-loads `CLAUDE.local.md` at the repo root as personal, uncommitted instructions. It is added to `.gitignore`.

`pnpm kb:export` generates it with a pure `renderBrief(kb)` in `scripts/kb/lib.mjs`. It is limited to 200 lines and holds:

1. Header: generated from `Me/kb/kb.json` on a given date; edit the KB, not this file.
2. Identity and positioning.
3. AI practice summary, one line per topic.
4. Direction: company, mine, exploring (latest first).
5. Job-search logistics (salary band, notice, work mode).
6. Rules: visibility tags, copy rules, humanizer, the private folders are never staged, claim rules live in `straker-cv-reference.md`.
7. Where things live: `kb.md` headings, evidence files, the application tracker.
8. Standing rule: when the user shares something new (a tool tried, a change in direction, an achievement), add it to `kb.json` with a date, visibility and source, then re-run `pnpm kb:export`.

Every content line starts with `[public]`, `[on-request]` or `[private]`. Only `[public]` lines may be used verbatim in copy. `ownWords` never appears in the brief.

## 4. Error handling

The export fails with a non-zero exit, names the problem and writes no outputs when:

- an `aiPractice` or `direction` entry lacks `visibility`, `evidence` or `source`, or has a bad value;
- the brief exceeds 200 lines;
- `git check-ignore CLAUDE.local.md` reports the file is not ignored.

The denylist check still runs on public outputs only. The brief is private and is not denylist-checked.

## 5. Tests

- `renderBrief` tags every content line with a visibility and omits `ownWords`.
- The brief built from the real `kb.json` is 200 lines or fewer.
- `toPublic` drops non-public `aiPractice` entries and the whole `direction` section; `kb.public.json` has no `direction` key and no `source`.
- `validate` reports missing or bad `visibility`, `evidence` and `source` in the new sections.
- The export refuses to write when the ignore check fails (the check is injected, so the test never calls real git).
- Manual end-to-end check: in a fresh session in this repo, "what's my AI workflow and where am I heading?" is answered from the brief without reading other files.

## 6. Build order and review stops

1. Types and validation for `aiPractice` and `direction`.
2. Import `breakdown.md` §6–8 with visibility labels and a humanizer pass. **Stop: user reviews `kb.md`.**
3. Fold `ABOUT ME/` gaps into the KB; archive the originals.
4. Interview (about 8 questions) on direction and current exploration; add the answers. **Stop: user reviews the new entries.**
5. `renderBrief`, the ignore guard, `.gitignore` entry; generate `CLAUDE.local.md`.
6. Point `resume-tailor` at the KB (diff shown first).
7. End-to-end check in a fresh session.

## 7. Out of scope

Writing LinkedIn, Seek or resume copy (the first task done with this setup, in its own session), syncing to other machines, and a public "direction" page on the site.
