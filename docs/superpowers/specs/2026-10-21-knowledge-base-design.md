# Knowledge base and public profile export: design

Date: 2026-10-21 · Branch: `redesign` · Status: draft for review

## Goal

One private source of truth about Ruchira's career, with every claim labelled by who may see it and what evidence backs it. The public part feeds the portfolio, the Ask box, and files AI recruiting tools read. A recruiter or their agent should be able to find the proof behind any public claim within seconds.

## Agreed facts this design relies on

- Raw interview answers: `Me/kb/interview-notes.md` (private, gitignored).
- Sources: `Me/ABOUT ME/career-bank.md`, `Me/ABOUT ME/projects.md`, `Me/Stories/` (STAR bank in the user's own words is the source of truth for stories), `Straker/Analysis/straker-cv-reference.md` (its status and anonymisation rules apply).
- Details that appear only in AI-drafted prep files are unconfirmed and never public.
- Copy rules: "7 years", balanced full-stack framing, Arbitr (formerly Straker), no client names, every public sentence passes the humanizer check.

## 1. Private master: `Me/kb/kb.json`

Gitignored (inside `Me/`). Maintained by Claude; a readable `Me/kb/kb.md` is generated from it for review.

Every entry carries:

| Field | Values |
|---|---|
| `visibility` | `public` · `on-request` · `private` |
| `evidence` | `production` · `merged` · `pre-prod` · `offline` · `own-statement` |
| `source` | file path or "user, 2026-10-21" |

Sections:

- `identity`: name, title, location, work rights, years, links, certificates (Credly badge, permanent Hugging Face certificate URL).
- `facts`: short statements, optional `metrics: string[]` holding the exact figures (e.g. `"9,084"`).
- `stories`: id, project, title, the recruiter questions it answers, `ownWords` (private, verbatim), `publicText` (humanized short version, only when public).
- `decisions`: per project, `{ chose, over, because }`.
- `answers`: Ask box entries, `{ id, keys[], text, links[] }`. A link points to a project id, a story id or a URL.
- `proof`: repos, Medium and Baeldung posts, certificates, each with a URL.
- `logistics`: notice, salary, work mode, references, leaving reason. Private or on-request only.

## 2. Export: `scripts/kb-export.mjs`

Runs locally (`pnpm kb:export`). CI never sees `Me/`, so the outputs are committed.

1. Read `Me/kb/kb.json`. Drop every entry whose `visibility` is not `public`, and drop `ownWords`.
2. Privacy guard: fail if any output contains a term from `Me/kb/denylist.txt` (client names, internal product names, ticket prefixes). The denylist stays private.
3. Write:
   - `src/data/kb.public.json`: the public entries.
   - `public/llms.txt`: plain-text summary (who, roles, projects with proof links, how to contact).
   - `public/resume.json`: JSON Resume schema, public tier only.
   - JSON-LD `Person` block in `index.html`, replaced between `<!-- kb:jsonld -->` markers.

## 3. Site changes

- Section copy in `projects.ts` and `skills.ts` stays hand-written. Each project gains `decisions` and `evidence` read from `kb.public.json` by project id.
- **Decision log in the project drawer**: two or three "chose X over Y because Z" items under the story, with evidence links. Mockup as a Claude Artifact first and agree before building. Mobile (~390px): the drawer is full width, decisions stack as a single column, links wrap, nothing scrolls sideways.
- **Ask box**: answers come from `kb.public.json` `answers` instead of `answers.ts`. Matching keeps today's word-start rule (`\bkey`) but scores every answer by the number of keys hit and returns the highest; ties go to the earlier entry; zero hits returns the fallback. Each answer shows its links under the text. No LLM. `getAnswer` stays the seam for a later AI back end.

## 4. Tests

- Every `metrics[].v` shown in `projects.ts` exists in some public fact's `metrics`. Catches unbacked numbers.
- `kb.public.json` has no entry with `visibility` other than `public` and no `ownWords` field.
- Ask box: sample questions map to the expected answer; an unrelated question returns the fallback; "know" does not match "now".
- Every public `links` target resolves (project or story id exists; URLs are https).

## 5. Error handling

- Export fails loudly (non-zero exit, names the entry) on: missing `visibility` or `evidence`, denylist hit, unknown link target, invalid JSON. It never writes partial outputs.
- If `kb.public.json` is missing a project's decisions, the drawer hides the section instead of showing an empty block.

## 6. Out of scope (each gets its own short spec later)

Generated PDF, per-company pages (`/for/<company>`), the video intro, the MCP endpoint, an LLM-backed Ask box and the LandedNZ redesign. The GitHub profile README fix moved into this plan (user, 2026-10-21).

## 7. Build order

1. Write `kb.json` from the sources and interview notes; user reviews `kb.md`.
2. Export script, privacy guard and tests.
3. Ask box on `kb.public.json`.
4. Decision log mockup, agree, then build.
5. `llms.txt`, `resume.json`, JSON-LD.
