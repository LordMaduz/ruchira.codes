# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild ruchira.codes to match the approved mockup:

- the globe About section
- the side drawer for project stories
- the scripted ask box
- the new copy, built from typed data files

The site keeps its current look.

**Architecture:**

- All copy moves into typed files under `src/data/`. Components only render that data.
- One generic `Carousel` serves both Skills and Work.
- `Index.tsx` owns the "which project is open" state and renders a single `ProjectDrawer`.
- Both Skills ("Seen in" buttons) and Work (cards) open that drawer.
- The globe loads lazily, using `d3-geo` on a canvas.

**Tech Stack:**

- React 19, Vite and Tailwind, with shadcn components (`Sheet`, which is built on Radix Dialog).
- zustand for the theme, react-hook-form with zod for the contact form, and framer-motion, which is already installed.
- New dependencies: `d3-geo`, plus dev dependencies `vitest`, `@types/d3-geo` and `playwright@1.58.0`.

**Spec:** `docs/superpowers/specs/2026-10-21-portfolio-redesign-design.md`

**Mockup:**

- Version 5: https://claude.ai/artifact/CM7z5JBMJcKVSxqAbhVzTa
- Task 1 copies the mockup source into `docs/superpowers/mockup/`.
- Every task matches the mockup's markup, CSS (`head.html`) and behaviour (`app.js`), translated to Tailwind classes. Reuse the colours and spacing the site already uses where the mockup copied them from the live site.

## Global Constraints

**Copy**

- Every string comes from the mockup data, as changed by the spec's "Content decisions" section. Don't write new copy. When something is missing, use the mockup's wording.
- "Straker" appears only once, in "Arbitr (formerly Straker)" (the first project's `org`). Past employers that the mockup already names (DBS Bank, GrubTech) stay.
- No em dash (—) or en dash (–) in any user-visible string.
- No career start year, no visa wording, and nothing that calls Ruchira backend only.
- The Singapore globe stop reads "2022 to 2026".

**Layout and behaviour**

- At 360px width there is no horizontal page scroll, the side gutter is 16px, and tap targets are at least 44px.
- `prefers-reduced-motion` skips:
  - the typing animation
  - the globe flight
  - the metric count-up
  - smooth carousel scrolling

**Config**

- Keep the env vars `VITE_WEB3FORMS_ACCESS_KEY` and `VITE_RESUME_DRIVE_FILE_ID`. Add no new ones.
- Keep `base: '/ruchira.codes/'` in `vite.config.ts`.
- The theme comes from `useThemeStore` in `src/store/themeStore.ts`. The light theme is the default.
- Keep the photos `src/assets/Ruchira_Black.png` (dark theme) and `Ruchira_White.png` (light theme).

## Review Focus

These cases are most likely to hurt a visitor. Each one has a test in the task that owns it.

1. **A phone 360px wide.** Long pills, a long project title or the diagram must not widen the page. Task 9's smoke test checks that `scrollWidth <= innerWidth` with the drawer both open and closed.
2. **Drawer opened from a Skills "Seen in" button, then Escape.** The drawer closes, focus goes back to that same button, and page scroll works again. Task 9's smoke test checks this.
3. **web3forms is down or returns `success: false`.** The visitor's name, email and message stay in the form, and the spec's error line shows. Task 9's smoke test checks this by routing `api.web3forms.com` to a 500 response.
4. **Ask box misuse:**
   - Submitting while empty, or with only spaces, does nothing.
   - A second question sent while an answer is still typing is ignored.
   - A question that matches nothing gets the fallback line.

   The unit tests are in Task 3 and the browser checks are in Task 9.
5. **Reduced motion is on.** A metric shows its final value straight away, and the answer appears whole. Task 4 has a unit test for `countFrame`, and Task 9's smoke test runs with `reducedMotion: 'reduce'`.

---

### Task 1: Branch, mockup reference, broken build, test runner

**Files:**
- Create: `docs/superpowers/mockup/` containing:
  - `body.html`, `head.html` and `app.js`, from the scratchpad's `orig/`
  - `home.src.html`, from the scratchpad's `hero2/`
  - `portfolio.html`, the built mockup
  - the phone screenshots `m-*.png` and `mf-*.png`
- Modify: `src/pages/Index.tsx` (remove the 4 missing imports), `.gitignore` (`Straker` becomes `Straker/`), `package.json` (scripts and dev dependencies)
- Create: `vitest.config.ts`, `src/lib/smoke.test.ts`

The scratchpad is `/private/tmp/claude-501/-Users-ruchira-Development-Portfolio-ruchira-codes/c3022b39-b707-42f4-ac4a-7d5abae6b2fd/scratchpad`.

- [ ] **Step 1:** Run `git checkout -b redesign`.
- [ ] **Step 2:** Copy the mockup files, then scan them. Run `grep -nE '[A-Z]{2,6}-[0-9]{2,}|PR ?#[0-9]+|traceability' docs/superpowers/mockup/*.html docs/superpowers/mockup/*.js`.
  - Expected: no output.
  - If anything matches, stop and show the user.
- [ ] **Step 3:** Change `.gitignore`: replace the line `Straker` with `Straker/`. Then run `git check-ignore Straker/Analysis/straker-cv-reference.md`. Expected: it prints the path.
- [ ] **Step 4:** In `src/pages/Index.tsx`, delete the imports of `ResumeSection`, `CertificationsSection`, `EducationSection` and `RecommendationSection`. Then run `pnpm build`. Expected: the build succeeds.
- [ ] **Step 5:** Run `pnpm add -D vitest`. Add the script `"test": "vitest run"`. Create `vitest.config.ts` with `environment: 'node'` and the same `@` alias as `vite.config.ts`. Add `src/lib/smoke.test.ts` containing `expect(1).toBe(1)`. Run `pnpm test`. Expected: 1 test passes.
- [ ] **Step 6:** Delete `smoke.test.ts`. Then commit with the message `chore: mockup reference, fix missing imports, add vitest`.

### Task 2: Content data files

**Files:**
- Create: `src/data/types.ts`, `projects.ts`, `skills.ts`, `stops.ts`, `answers.ts` and `land.json`, all in `src/data/`
- Test: `src/data/content.test.ts`

**Interfaces:**
- Produces, in `types.ts`:
  ```ts
  type FlowNode = { id: string; x: number; y: number; t: string; s: string; k?: "ai" | "person" };
  type Project = { id: string; org: string; role: string; when: string; years: string; title: string; summary: string;
    h: number; label: string; nodes: FlowNode[]; edges: [string, string, string?][];
    metrics: { v: string; l: string }[]; stack: string[]; problem: string; did: string[]; result: string; note?: string };
  type Skill = { t: string; s: string; tools: string[]; proof: [projectId: string, text: string][] };
  type Stop = { at: [number, number]; name: string; short: string; side?: "below" | "left"; cmd: string; title: string; story: string };
  type Answer = { keys: string[]; text: string };
  ```
- Produces the exports `PROJECTS: Project[]`, `SKILLS: Skill[]`, `STOPS: Stop[]`, `OVERVIEW: [number, number]`, `ANSWERS: Answer[]` and `FALLBACK: string`. The default export of `land.json` is a GeoJSON Feature.
- Produces `orgName(id: string): string`, exported from `projects.ts`. It returns the org up to the first `,` or `(`, trimmed, so the Arbitr project gives "Arbitr".

- [ ] **Step 1: Write the failing test** `content.test.ts`:
  ```ts
  const all = JSON.stringify([PROJECTS, SKILLS, STOPS, ANSWERS, FALLBACK]);
  test("no dashes", () => expect(all).not.toMatch(/[—–]/));
  test("rules", () => { expect(all).not.toMatch(/2019|visa|backend work/i); expect(all.match(/Straker/g)).toEqual(["Straker", "Straker"]); expect(all).toMatch(/\(formerly Straker\)/); expect(all).toMatch(/used to be called Straker\./); });
  test("singapore years", () => expect(STOPS.find(s => s.name === "Singapore")!.short).toBe("2022 to 2026"));
  test("ids unique, proofs resolve", () => {
    const ids = PROJECTS.map(p => p.id); expect(new Set(ids).size).toBe(5);
    SKILLS.forEach(k => k.proof.forEach(([id]) => expect(ids).toContain(id)));
    PROJECTS.forEach(p => p.edges.forEach(([a, b]) => expect(p.nodes.map(n => n.id)).toEqual(expect.arrayContaining([a, b]))));
  });
  test("orgName", () => expect(orgName("straker")).toBe("Arbitr"));
  test("new before-Arbitr answer", () => expect(ANSWERS.some(a => a.text.startsWith("Before Arbitr I was at DBS Bank"))).toBe(true));
  ```
- [ ] **Step 2:** Run `pnpm test`. Expected: FAIL, because the modules aren't found.
- [ ] **Step 3:** Port the data word for word from `docs/superpowers/mockup/home.src.html`: `PROJECTS`, `SKILLS`, `STOPS`, `OVERVIEW`, `ANSWERS` and `FALLBACK`. For `ANSWERS` and `FALLBACK`, use `app.js`, which has the version 5 text. Move the inline `LAND` object into `land.json`. Apply the spec's "Content decisions" section. Copy text as it is: the tests catch rule breaks, so don't reword.
- [ ] **Step 4:** Run `pnpm test`. Expected: PASS. If the "no dashes" or "rules" test fails on mockup text, fix only the failing string, run it through the `humanizer` skill, and mention the change in the commit body.
- [ ] **Step 5:** Commit with the message `feat: typed content data from mockup`.

### Task 3: Ask box and Home

**Files:**
- Create: `src/lib/ask.ts`, `src/components/AskBox.tsx`
- Modify: `src/components/HomeSection.tsx`
- Test: `src/lib/ask.test.ts`

**Interfaces:**
- Consumes `ANSWERS` and `FALLBACK` from Task 2.
- Produces:
  - `answerFor(q: string): string`, which lowercases `q` and returns the first answer that has a key contained in `q`, or `FALLBACK`.
  - `getAnswer(q: string): Promise<string>`, which resolves `answerFor(q)` for now. It is the hook point for the later AI back end.

- [ ] **Step 1: Write the failing test:**
  ```ts
  test("keyword", () => expect(answerFor("What do you WORK ON?")).toMatch(/^I'm an AI Product Engineer at Arbitr/));
  test("before", () => expect(answerFor("what did you do before")).toMatch(/^Before Arbitr/));
  test("fallback", () => expect(answerFor("favourite colour")).toBe(FALLBACK));
  test("async", async () => expect(await getAnswer("how do I reach you")).toMatch(/Book a 20-minute chat/));
  ```
- [ ] **Step 2:** Run `pnpm test src/lib/ask.test.ts`. Expected: FAIL.
- [ ] **Step 3:** Implement `ask.ts`.
- [ ] **Step 4:** Run the tests again. Expected: PASS.
- [ ] **Step 5:** Build `AskBox.tsx` following the mockup's `.ask` markup and the `ask()` function in `app.js`:
  - Label "Ask me anything", an input and an "Ask" button.
  - The 4 chips in the mockup's order. Clicking a chip asks that chip's text.
  - A `convo` area with `aria-live="polite"` that shows one question and one answer.
  - A 650 ms typing indicator, then the answer typed 2 characters every 18 ms.
  - With reduced motion, no delay and the answer appears whole. Use framer-motion's `useReducedMotion()`.
  - Ignore submits that are empty after `trim()`, and ignore new questions while an answer is still typing.
  - The fine-print line, copied word for word from `body.html`.
  - Clear any interval when the component unmounts.
- [ ] **Step 6:** Update `HomeSection.tsx` to match the mockup's `section.home`:
  - Keep the photo and its theme swap.
  - Heading "Hey, I'm Ruchira." with the "AI Product Engineer" span under it.
  - The status line: a green dot with "Open to new roles", then the location pin with "Auckland, New Zealand".
  - The 2 ledes, word for word.
  - Buttons: "Book a 20-minute chat" opens `https://cal.com/ruchira-rajapaksha` in a new tab with `rel="noopener"`, and "See my work" calls the existing `scrollToSection('work')`.
  - `<AskBox />` below the buttons.
- [ ] **Step 7:** Run `pnpm build && pnpm dev`. At 1440px and 375px, compare with the mockup's home section.
- [ ] **Step 8:** Commit with the message `feat: home copy and scripted ask box`.

### Task 4: Flow diagram, project drawer, Work carousel

**Files:**
- Create: `src/components/Carousel.tsx`, `FlowDiagram.tsx` and `ProjectDrawer.tsx` in `src/components/`, and `src/lib/countUp.ts`
- Modify: `src/components/ProjectsSection.tsx` (rewrite it; drop the old modal, the tabs, `impact` and the logo imports), `src/pages/Index.tsx`
- Test: `src/lib/countUp.test.ts`

**Interfaces:**
- Consumes `PROJECTS` and `Project` from Task 2.
- Produces:
  - `countFrame(target: string, k: number): string`. For `k` from 0 to 1, it eases with `1 - (1-k)^3` and keeps the prefix `<`, the decimal places, the thousands commas and the suffix. A string with no leading number comes back unchanged.
  - `Carousel<T>({ items, label, renderCard, onOpen }: { items: T[]; label: string; renderCard: (item: T, active: boolean) => ReactNode; onOpen?: (item: T, e: React.MouseEvent) => void })`. This is a port of the mockup's `carousel()`:
    - a scroll-snap track with prev and next arrows labelled "Previous {label}" and "Next {label}"
    - dots, with `aria-current` on the active one
    - the active card is the one nearest the centre
    - clicking a card that isn't centred scrolls it to the centre first; clicking the centred card calls `onOpen`
  - `FlowDiagram({ project, vertical }: { project: Project; vertical?: boolean })`. This is a port of the mockup's `diagram()` and `tall()`, drawn as an SVG with `role="img"` and `aria-label={project.label}`.
  - `ProjectDrawer({ id, opener, onClose }: { id: string | null; opener: HTMLElement | null; onClose: () => void })`
  - In `Index.tsx`: `const [open, setOpen] = useState<{ id: string; el: HTMLElement } | null>(null)`, and `openProject(id: string, el: HTMLElement)`, which is passed to `ProjectsSection` and `SkillsSection` as the `onOpenProject` prop.

- [ ] **Step 1: Write the failing test:**
  ```ts
  test("end", () => expect(countFrame("9,084", 1)).toBe("9,084"));
  test("start", () => expect(countFrame("0.80", 0)).toBe("0.00"));
  test("prefix", () => expect(countFrame("<2 hours", 1)).toBe("<2 hours"));
  test("mid commas", () => expect(countFrame("9,084", 0.5)).toMatch(/^\d{1,3}(,\d{3})*$/));
  test("non-numeric", () => expect(countFrame("Daily", 0.3)).toBe("Daily"));
  ```
- [ ] **Step 2:** Run the test. Expected: FAIL.
- [ ] **Step 3:** Implement `countFrame`.
- [ ] **Step 4:** Run the test again. Expected: PASS.
- [ ] **Step 5:** Build `Carousel` and `FlowDiagram`.
  - In `FlowDiagram`, the "ai" and "person" node kinds use the mockup's accent colours.
  - The drawer shows the wide version at `sm` and up, and the tall version below `sm`.
- [ ] **Step 6:** Build `ProjectDrawer` on `Sheet` with `side="right"` and a width of `w-full sm:max-w-xl`. Its content order follows `openDrawer()` in `app.js`:
  - meta row, `SheetTitle`, summary, diagram, the note if there is one
  - the metrics as a `<dl>`, with values animated by `countFrame` over 700 ms (final values at once with reduced motion)
  - "The problem", "What I did", "What happened" and "Built with"

  Focus return: in `onCloseAutoFocus`, call `e.preventDefault()` and then `opener?.focus()`.
- [ ] **Step 7:** Rewrite `ProjectsSection` with the heading and subline from `body.html` and `<Carousel>` over `PROJECTS`. Each card has:
  - the title
  - a meta row with org, when and role, using lucide icons (`Building2`, `Calendar`, `Users`)
  - the summary with the `TrendingUp` icon
  - the "Click to view details" hint

  `onOpen` calls `onOpenProject(p.id, the card's hint button)`. Wire `ProjectDrawer` in `Index.tsx`.
- [ ] **Step 8:** Run `pnpm build && pnpm test`. In `pnpm dev`, open each project and check:
  - Escape, the close button and a click outside all close the drawer.
  - Focus goes back to the card's hint button.
- [ ] **Step 9:** Commit with the message `feat: work carousel with side drawer`.

### Task 5: Skills

**Files:**
- Modify: `src/components/SkillsSection.tsx` (rewrite it and drop `impact`)

**Interfaces:**
- Consumes:
  - `SKILLS` and `orgName` from Task 2
  - `Carousel` from Task 4
  - the `onOpenProject(id, el)` prop from Task 4

- [ ] **Step 1:** Rewrite the section with the heading "What I can do" and the subline from `body.html`. It renders `<Carousel label="skill">`. Each card has:
  - the title `t`
  - the `tools` pills, rendered only when `active`
  - the label "How I use it" with the text `s`
  - "Seen in" followed by one button per unique proof project id, labelled with `orgName(id)`

  A button click calls `onOpenProject(id, e.currentTarget)` and stops the card's own click.
- [ ] **Step 2:** Run `pnpm build`. Then run `grep -n impact src/components/SkillsSection.tsx src/components/ProjectsSection.tsx`. Expected: no output.
- [ ] **Step 3:** Commit with the message `feat: skills carousel with seen-in links`.

### Task 6: About globe

**Files:**
- Create: `src/components/Globe.tsx`
- Modify: `src/components/AboutSection.tsx` (rewrite it), `package.json` (`d3-geo`, `@types/d3-geo`)

**Interfaces:**
- Consumes `STOPS`, `OVERVIEW` and `land.json` from Task 2.
- Produces `Globe` as the default export of `Globe.tsx`, with no props. `AboutSection` loads it with `React.lazy`.

- [ ] **Step 1:** Run `pnpm add d3-geo && pnpm add -D @types/d3-geo`.
- [ ] **Step 2:** Port the globe from the mockup's `/* about: globe journey */` block in `home.src.html` into `Globe.tsx`. It includes:
  - the canvas, the pins, the `journey-info` panel with `aria-live`, and the "Fly it again" button
  - the canvas `aria-label` from `body.html`
  - drag to rotate

  Rules for the port:
  - Import from `d3-geo` only: `geoOrthographic`, `geoPath`, `geoInterpolate`, `geoGraticule10`, or whichever of these the mockup uses.
  - Read the colours from the CSS variables, as the mockup's `css()` helper does. Add `--sea1`, `--sea2`, `--land`, `--land-edge` and `--grat` for light and dark to `src/index.css`, with the values from `head.html`.
  - Redraw when `useThemeStore` changes the theme.
  - With reduced motion, show `OVERVIEW` with the whole route and no flight.
  - Cancel `requestAnimationFrame` and remove the listeners when the component unmounts.
- [ ] **Step 3:** Rewrite `AboutSection` with the heading "Story behind the code" and the `about-lede` from `body.html`.
  - Render `<Suspense>` with a fixed-height placeholder (no layout shift), and mount the lazy `Globe` only after an `IntersectionObserver` with `rootMargin: '300px'` fires.
  - Phone layout: the globe on top, the story below, matching `mf-*.png`.
- [ ] **Step 4:** Run `pnpm build`. Expected: `d3-geo` lands in a separate chunk from the main bundle. Check the `dist/assets` file list in the build output.
- [ ] **Step 5:** In `pnpm dev`, test in light, in dark, with reduced motion (Chrome DevTools rendering emulation) and at 375px.
- [ ] **Step 6:** Commit with the message `feat: about globe journey`.

### Task 7: Contact

**Files:**
- Create: `src/lib/contact.ts`
- Modify: `src/components/ContactSection.tsx`
- Test: `src/lib/contact.test.ts`

**Interfaces:**
- Produces:
  - `contactSchema`, a zod object of `name`, `email` and `message`, each trimmed and required. The error messages come from `app.js`: "Add your name to send.", "Add a valid email so I can reply." and "Add your message to send."
  - `nzTimeLabel(d: Date): string`, which returns `It's {h}:{mm} {am|pm} on {Weekday} in Auckland`, using `Intl.DateTimeFormat("en-NZ", { timeZone: "Pacific/Auckland", weekday: "long", hour: "numeric", minute: "2-digit" })`.

- [ ] **Step 1: Write the failing test:**
  ```ts
  test("blank name", () => expect(contactSchema.safeParse({ name: "  ", email: "a@b.co", message: "hi" }).error?.issues[0].message).toBe("Add your name to send."));
  test("bad email", () => expect(contactSchema.safeParse({ name: "A", email: "nope", message: "hi" }).error?.issues[0].message).toBe("Add a valid email so I can reply."));
  test("ok", () => expect(contactSchema.safeParse({ name: "A", email: "a@b.co", message: "hi" }).success).toBe(true));
  test("nz time", () => expect(nzTimeLabel(new Date("2026-10-21T00:30:00Z"))).toBe("It's 1:30 pm on Wednesday in Auckland"));
  ```
- [ ] **Step 2:** Run the test. Expected: FAIL.
- [ ] **Step 3:** Implement `contact.ts`.
- [ ] **Step 4:** Run the test again. Expected: PASS. If `en-NZ` formats the day period differently, adjust the label builder, not the test string.
- [ ] **Step 5:** Rewrite `ContactSection` to match the mockup's `section.contact`:
  - The booking line, with `nzTimeLabel(new Date())` refreshed every 30 s (clear the interval on unmount), and "Open my calendar" linking to cal.com.
  - The form using react-hook-form with `zodResolver(contactSchema)`, with inline `<p>` errors linked by `aria-describedby`.
  - Keep the existing web3forms `fetch` body.
  - On success, show the thank-you panel ("Thanks, {first name}" and "I'll reply to {email}"), focus it, and offer "Send another", which resets the form and focuses the name field.
  - On a thrown error or `success: false`, keep the values and show "That didn't send. Try again, or email me from LinkedIn." with `role="alert"`.
  - Remove the `sonner` toasts from this section.
- [ ] **Step 6:** Run `pnpm build && pnpm test`. Then commit with the message `feat: contact booking line and inline form states`.

### Task 8: Navigation and SEO

**Files:**
- Modify: `src/components/Navigation.tsx`, `index.html`

- [ ] **Step 1:** Match the mockup's `nav` in `Navigation.tsx`.
  - Icon links on the left, each with an `aria-label`: Home, LinkedIn, GitHub, Hugging Face, AWS certifications and Email, plus the "Connect" pill linking to linktr.ee.
  - On the right: the theme switch (the existing `ThemeToggle`), resume download (the existing Drive link built from `VITE_RESUME_DRIVE_FILE_ID`) and "Book a call".
  - Below `md`, a menu button with `aria-expanded` and `aria-controls="mmenu"` opens the panel from the mockup: the "Connect" heading, the 4 social links, then "More ways to connect", "Download resume" and "Book a call".
  - Escape closes the panel and focuses the menu button, and clicking a link inside the panel closes it.
  - Keep the existing active-section tracking.
- [ ] **Step 2:** Update `index.html`:
  - `<title>Ruchira Rajapaksha | AI Product Engineer in Auckland</title>`
  - `meta description`: "AI Product Engineer at Arbitr in Auckland, New Zealand. Guardrails and human review for AI agents, and LandedNZ, a planner for moving to New Zealand."
  - `og:title`, `og:description`, `og:url` and `og:image`. The image is `icon.png` with an absolute URL under `https://lordmaduz.github.io/ruchira.codes/`.
  - Replace the old "Solutions Architect, Banking" keywords.
  - Add a `<script type="application/ld+json">` `Person` block with `name`, `jobTitle` "AI Product Engineer", `worksFor` Arbitr, `address` Auckland, NZ, and `sameAs` with the LinkedIn, GitHub and Hugging Face URLs. No email.
  - Run the description through the `humanizer` skill before committing.
- [ ] **Step 3:** Run `pnpm build`. Then commit with the message `feat: nav phone menu and SEO meta`.

### Task 9: Smoke test and release checks

**Files:**
- Create: `scripts/smoke.mjs`
- Modify: `package.json` (dev dependency `playwright@1.58.0` and the script `"smoke": "node scripts/smoke.mjs"`)

- [ ] **Step 1:** Write `scripts/smoke.mjs`. It starts `vite preview` on port 4173, then uses the Playwright chromium API against `http://localhost:4173/ruchira.codes/`. It exits non-zero on the first failed check:
  1. For each viewport, 360×780 and 1440×900, and each theme (seed `localStorage['theme-storage']` with `{"state":{"theme":"dark"},"version":0}` through `addInitScript`): check `document.documentElement.scrollWidth <= innerWidth` with the drawer closed, then again with the first project's drawer open. Save screenshots to `scratchpad/shots/`.
  2. Click the first Skills card's first "Seen in" button and press Escape. Check that the drawer is gone and that `document.activeElement` is that button.
  3. `page.route('https://api.web3forms.com/**', r => r.fulfill({ status: 500, body: '{}' }))`. Fill the form and submit. Check that the alert text is shown and that all 3 inputs still hold their values.
  4. Submit the ask box while it's empty and check that `.convo` is still empty. Then click a chip, and immediately click a second chip, and check that the question shown is the first chip's text.
  5. Open a new context with `reducedMotion: 'reduce'`. Open the Arbitr project and check that the first metric reads `0.80` right away. Ask a chip question and check that the full answer appears within 100 ms.
- [ ] **Step 2:** Run `pnpm build && pnpm smoke`. Expected: every check passes. Fix any failure in the task that owns that code.
- [ ] **Step 3:** Compare the screenshots in `scratchpad/shots/` with `docs/superpowers/mockup/m-*.png` and `mf-*.png`. Show the user the 375px light and dark home, drawer and globe screenshots.
- [ ] **Step 4:** Run the reviews and fix what they find:
  - the `web-design-guidelines` skill on `src/components/`
  - the `web-perf` skill on the built site, which must not let the globe block first paint
  - the `seo-audit` skill on `index.html`
  - the `humanizer` skill over all of `src/data/*.ts`, the components' inline strings and `index.html`

  Commit each round of fixes separately.
- [ ] **Step 5:** Run `pnpm lint && pnpm test && pnpm build && pnpm smoke`. Expected: all pass. Then commit with the message `test: smoke checks for layout, drawer focus, form errors, ask box, reduced motion`.
- [ ] **Step 6:** Hand over with the `superpowers:finishing-a-development-branch` skill. Don't merge to `main` without the user's yes, because pushing to `main` deploys the live site.
