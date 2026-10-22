# Portfolio redesign: design spec

Date: 2026-10-21
Status: approved 2026-10-21

## Goal

Update ruchira.codes for the 2027 Auckland job market, with Ruchira presented as an AI Product Engineer. A hiring manager should leave knowing three things:

- what Ruchira does at Arbitr
- what Ruchira built before Arbitr
- how to book a chat

The site keeps the look of the current live site. The new parts are a globe About section, a side drawer for project stories, an "Ask me anything" box, and rewritten copy.

## Source of truth

The approved mockup is the reference for layout, copy, motion and mobile behaviour. If this spec and the mockup disagree, the mockup wins, unless this spec says the change is on purpose.

- Mockup page: https://claude.ai/artifact/CM7z5JBMJcKVSxqAbhVzTa (version 5)
- Mockup source, kept in the session scratchpad:
  - `orig/body.html`: markup
  - `orig/head.html`: CSS tokens and styles
  - `orig/app.js`: carousels, drawer, contact form, ask box, phone menu
  - `hero2/home.src.html`: `PROJECTS`, `SKILLS`, `ANSWERS`, the globe, `STOPS`
- Before the build starts, copy these files into `docs/superpowers/mockup/` so the plan and the build don't depend on a temporary folder. Run a check first: no ticket IDs, no client names, and no copy from `straker-cv-traceability.md`.

## Content rules

These rules apply to every string on the site.

- Take facts only from `Straker/Analysis/straker-cv-reference.md` or the existing site.
- Name only "Arbitr" (once as "Arbitr (formerly Straker)"). No client names, ticket IDs or teammates.
- Describe Arbitr as the whole platform first, then Ruchira's part in it.
- Claim limits:
  - The S-AGENT work is "designed".
  - S1 is "protected 9,084 credits".
  - Nothing that is merged but not yet released is called "live".
- No visa content.
- About is about life, not the job.
- Before release, run all copy through `humanizer`. It must not contain:
  - em or en dashes
  - "not X but Y" contrasts
  - forced lists of three
  - one-line closers

## Sections

The page order stays the same: Navigation, Home, About, Skills, Work, Contact, Footer. No new sections.

### Navigation (`Navigation.tsx`)

Keep the current layout:

- Left side: icon links for LinkedIn, GitHub, Hugging Face, AWS badges and email, plus a "Connect" pill.
- Right side: theme switch, resume download and "Book a call".

On phones, a menu button opens a panel with the social links and three full-width buttons: "More ways to connect", "Download resume" and "Book a call". Escape closes the panel and focus goes back to the menu button.

The resume link keeps using `VITE_RESUME_DRIVE_FILE_ID`.

### Home (`HomeSection.tsx`)

- Photo, then "Hey, I'm Ruchira." with "AI Product Engineer" under it.
- Status line: "Open to new roles" and "Auckland, New Zealand".
- The two lede paragraphs, word for word from the mockup.
- Buttons: "Book a 20-minute chat" (cal.com) and "See my work" (scrolls to Work).
- The ask box, described below.

### Ask me anything (new: `AskBox.tsx`, `src/lib/ask.ts`)

The front end works as in the mockup:

- an input and an "Ask" button
- four suggested questions
- one question and one answer shown at a time
- a typing indicator
- the answer types itself out; with reduced motion it appears all at once
- the note: "Answers come from my CV and project notes only..."

This build ships the box with the mockup's scripted `ANSWERS` only (keyword match, with the fallback line). The real AI back end comes later as its own piece of work: Ruchira and Claude will first write a proper knowledge file about Ruchira from everything gathered so far plus what Ruchira adds, then design the back end around it (the earlier idea was a Cloudflare Worker with a cheap model and a daily limit).

To make that later swap easy, `AskBox.tsx` gets its answers from one function, `getAnswer(q): Promise<string>`, in `src/lib/ask.ts`. Today it wraps `answerFor`. Later it calls the back end and falls back to `answerFor` on error.

### About (`AboutSection.tsx`, new `Globe.tsx`)

This replaces the text About with the globe story from the mockup:

- Heading: "Story behind the code".
- An orthographic globe on a canvas, with a flight from Sri Lanka to Singapore to Auckland.
- Three stops, each with a git-command chapter (`git init`, `git checkout -b new-zealand`, `git merge new-zealand`). Each has a title and story text taken from `STOPS`.
- Visitors can drag the globe. A "Fly it again" button replays the flight.
- With reduced motion, the globe skips the flight animation and shows the whole route.

Data and dependencies:

- Use `d3-geo` as the only new dependency. The mockup loads all of d3, but the globe uses only the projection and path code.
- Move the land shape from the mockup's inline `LAND` into `src/data/land.json`.

Phone: the globe sits on top and the story sits under it, as in the mockup screenshots `mf-*.png`.

### Skills (`SkillsSection.tsx`)

Keep the live carousel: centred card, faded cards on each side, arrows and dots.

Each card shows:

- the title
- tool pills (on the active card only)
- "How I use it", with the mockup's copy
- a "Seen in" row of buttons. Each button opens that project in the drawer, labelled by the organisation name only, for example "Arbitr".

Remove the `impact` field and its unverified numbers.

### Work (`ProjectsSection.tsx`, new `ProjectDrawer.tsx`)

Keep the live card carousel. Each card shows:

- the title
- organisation, dates and role
- the summary
- "Click to view details"

There are five projects, newest first, using the mockup's `PROJECTS` data. The first card's org reads "Arbitr (formerly Straker)", with the platform-first summary.

Clicking the centred card opens a side drawer, which replaces the live full-screen modal. The drawer shows:

- org, role and dates
- the title and summary
- a flow diagram: wide on desktop, tall on phones
- an optional note
- metric tiles that count up
- "The problem", "What I did", "What happened" and "Built with"

Drawer behaviour:

- Escape, the close button or a click outside closes it.
- Focus moves to the close button when it opens and goes back to the button that opened it.
- On phones it takes the full width.
- Build it on the existing shadcn `Sheet` (Radix Dialog), which already handles focus trapping.

Remove the hidden `impact` text in `ProjectsSection.tsx`.

### Contact (`ContactSection.tsx`)

- A booking line with Auckland's local time, updated every 30 seconds, and an "Open my calendar" button.
- The form: name, email and message, with inline errors as in the mockup. It posts to web3forms with `VITE_WEB3FORMS_ACCESS_KEY`, as it does today.
- On success, show the mockup's thank-you panel ("Thanks, <first name>") and a "Send another" button.
- On a network or API error, keep what the visitor typed and show: "That didn't send. Try again, or message me on LinkedIn."

### Footer

Keep it as it is.

## Code structure

- `src/data/projects.ts`, `skills.ts`, `stops.ts` and `answers.ts` hold the content as typed arrays, ported from the mockup. Components only render them.
- `src/data/land.json` holds the globe's land shape.
- New components: `AskBox.tsx`, `Globe.tsx`, `ProjectDrawer.tsx`, `FlowDiagram.tsx` (the drawer's SVG diagram) and `Carousel.tsx`.
  - `Carousel.tsx` is the shared carousel for Skills and Work, ported from the mockup's `carousel()`.
  - If the existing carousel is easier to reuse, use it instead of porting.
- Fix `src/pages/Index.tsx`. It imports `ResumeSection`, `CertificationsSection`, `EducationSection` and `RecommendationSection`, which don't exist, so the build fails. Remove those imports.
- Theme stays on the existing zustand store. The light and dark photos swap with the theme, as they do now.
- Add `Straker/` to `.gitignore` explicitly. The current `Straker` line works, but only because the match ignores case.

## Mobile

Every section must render at 360px width with:

- no horizontal page scroll
- a 16px side gutter
- tap targets at least 44px

Check against the phone screenshots in the mockup folder (`m-*.png` and `mf-*.png`).

## Checks before release

1. `pnpm build` and `pnpm lint` pass.
2. Small unit tests, run with Vitest, which this adds as a dev dependency:
   - the scripted `answerFor` keyword match and its fallback
   - the contact form validation
3. Playwright screenshots at 1440px and 375px, in light and dark, compared against the mockup.
4. `web-design-guidelines` review, covering accessibility, focus and reduced motion.
5. `seo-audit`, covering the title, meta description, Open Graph tags and a `Person` JSON-LD block.
6. `web-perf` review: the globe must not block the first paint. Load `Globe.tsx` lazily when About comes near the viewport.
7. `humanizer` pass on all final copy.

## Out of scope

- LinkedIn, resume and case-study pages, which are separate pieces of work.
- The ask box's AI back end and its knowledge file (planned later, see Ask me anything).
- A blog, testimonials and a photo gallery.
- Moving off GitHub Pages.

## Content decisions (from Ruchira, 2026-10-21)

- The ask answer "Six years of backend work..." becomes: "Before Arbitr I was at DBS Bank in Singapore, working on a tax engine that runs across more than 15 countries, and before that at GrubTech in Sri Lanka. I work across the whole stack, from services to web apps. On LandedNZ I built the mobile app and the AI pipeline as well." The site never shows a career start year, and copy must not describe Ruchira as backend only.
- Lived in Singapore from September 2022 to June 2026. The globe's Singapore stop reads "2022 to 2026" (the mockup says "2022 to 2025"). Project dates stay as the mockup has them.
- The AWS certification is valid, so the AWS badges link stays.
- Keep the current anime-style photos (`src/assets/Ruchira_Black.png` and `Ruchira_White.png`). No photo change.
