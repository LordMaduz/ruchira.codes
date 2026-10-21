/* ---------- theme (the live site defaults to light) ---------- */
document.getElementById("theme").addEventListener("click", () => {
  root.dataset.theme = isDark() ? "light" : "dark";
  photo.src = IMG[isDark() ? "dark" : "light"];
});
const photo = document.getElementById("photo");
photo.src = IMG[isDark() ? "dark" : "light"];

/* ---------- carousels: the live site's centred cards, arrows and dots ---------- */
const chev = (d) => `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="${d}"/></svg>`;
function carousel(host, items, card, name, onOpen) {
  host.innerHTML = `<button class="arrow prev" type="button" aria-label="Previous ${name}">${chev("M15 18l-6-6 6-6")}</button>
    <button class="arrow next" type="button" aria-label="Next ${name}">${chev("M9 18l6-6-6-6")}</button>
    <div class="track">${items.map((it, i) => `<div class="slot" data-i="${i}">${card(it)}</div>`).join("")}</div>
    <div class="dots">${items.map((_, i) => `<button type="button" aria-label="Go to ${name} ${i + 1}"></button>`).join("")}</div>`;
  const track = host.querySelector(".track"), slots = [...track.children], dots = [...host.querySelectorAll(".dots button")];
  let active = -1;
  const go = (i) => {
    const s = slots[Math.max(0, Math.min(slots.length - 1, i))];
    track.scrollTo({ left: s.offsetLeft - (track.clientWidth - s.clientWidth) / 2, behavior: reduce ? "auto" : "smooth" });
  };
  const mark = () => {
    const mid = track.scrollLeft + track.clientWidth / 2;
    let best = 0, bd = Infinity;
    slots.forEach((s, i) => { const d = Math.abs(s.offsetLeft + s.clientWidth / 2 - mid); if (d < bd) { bd = d; best = i; } });
    if (best === active) return;
    active = best;
    slots.forEach((s, i) => s.classList.toggle("active", i === best));
    dots.forEach((d, i) => d.setAttribute("aria-current", i === best));
  };
  track.addEventListener("scroll", () => requestAnimationFrame(mark));
  host.querySelector(".prev").addEventListener("click", () => go(active - 1));
  host.querySelector(".next").addEventListener("click", () => go(active + 1));
  dots.forEach((d, i) => d.addEventListener("click", () => go(i)));
  track.addEventListener("click", (e) => {
    const slot = e.target.closest(".slot");
    if (!slot) return;
    const i = +slot.dataset.i;
    if (i !== active) { e.preventDefault(); go(i); return; } // a faded card comes to the centre first
    onOpen?.(e, items[i]);
  });
  mark();
  return { go };
}

const ICON = {
  org: '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2M10 6h4M10 10h4M10 14h4M10 18h4"/>',
  when: '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  role: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  up: '<path d="m22 7-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/>'
};
const ic = (k) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[k]}</svg>`;
const orgOf = (id) => PROJECTS.find((p) => p.id === id).org.split(/[,(]/)[0].trim();

const work = carousel(document.getElementById("work-carousel"), PROJECTS, (p) => `<article class="card project">
    <h3>${p.title}</h3>
    <div class="meta"><span>${ic("org")}${p.org}</span><span>${ic("when")}${p.when}</span><span>${ic("role")}${p.role}</span></div>
    <div class="impact">${ic("up")}<p style="margin:0">${p.summary}</p></div>
    <button class="open-hint" type="button">Click to view details</button>
  </article>`, "project", (e, p) => openDrawer(p.id, e.target.closest(".slot").querySelector(".open-hint")));

carousel(document.getElementById("skill-carousel"), SKILLS, (k) => `<article class="card">
    <h3>${k.t}</h3>
    <ul class="pills only-active">${k.tools.map((x) => `<li>${x}</li>`).join("")}</ul>
    <div class="rule"><p class="label">How I use it</p><p class="body">${k.s}</p>
      <div class="proofs">Seen in ${[...new Set(k.proof.map(([id]) => id))].map((id) => `<button type="button" data-project="${id}">${orgOf(id)}</button>`).join("")}</div>
    </div>
  </article>`, "skill", (e) => {
    const b = e.target.closest("[data-project]");
    if (b) openDrawer(b.dataset.project, b);
  });

/* ---------- project details slide in from the side ---------- */
const drawer = document.getElementById("drawer"), drBody = drawer.querySelector(".dr-body");
let drFocus = null;
function openDrawer(id, from) {
  const p = PROJECTS.find((x) => x.id === id);
  drBody.innerHTML = `<div class="pmeta"><span>${p.org}</span><span>${p.role}</span><span>${p.when}</span></div>
    <h2 id="dr-title">${p.title}</h2>
    <p class="psum">${p.summary}</p>
    <div class="diagram"><div class="d-wide">${diagram(p, "dr")}</div><div class="d-tall">${diagram(tall(p), "drt", 320, true)}</div></div>
    ${p.note ? `<p class="pnote">${p.note}</p>` : ""}
    <dl class="pstats">${p.metrics.map((m) => `<div><dt>${m.l}</dt><dd>${m.v}</dd></div>`).join("")}</dl>
    <h3>The problem</h3><p>${p.problem}</p>
    <h3>What I did</h3><ul class="did">${p.did.map((d) => `<li>${d}</li>`).join("")}</ul>
    <h3>What happened</h3><p>${p.result}</p>
    <h3>Built with</h3><ul class="pills">${p.stack.map((s) => `<li>${s}</li>`).join("")}</ul>`;
  drFocus = from; drawer.hidden = false; drawer.querySelector(".dr-box").scrollTop = 0;
  drawer.querySelector(".close").focus();
  countUp(drBody);
}
function closeDrawer() { drawer.hidden = true; drFocus?.focus(); }
drawer.querySelector(".close").addEventListener("click", closeDrawer);
drawer.addEventListener("click", (e) => { if (e.target === drawer) closeDrawer(); });
addEventListener("keydown", (e) => { if (e.key === "Escape" && !drawer.hidden) closeDrawer(); });

/* ---------- contact form (mockup: nothing is sent; the real site posts to web3forms) ---------- */
const form = document.getElementById("msg-form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  let first = null;
  for (const el of form.querySelectorAll("[required]")) {
    const err = el.parentElement.querySelector(".err"), bad = !el.value.trim() || (el.type === "email" && !el.checkValidity());
    err.hidden = !bad;
    err.textContent = el.type === "email" ? "Add a valid email so I can reply." : `Add your ${el.name} to send.`;
    if (bad && !first) first = el;
  }
  if (first) { first.focus(); return; }
  const sent = form.querySelector(".sent");
  sent.querySelector("[data-name]").textContent = form.elements.name.value.trim().split(/\s+/)[0];
  sent.querySelector("[data-email]").textContent = form.elements.email.value.trim();
  sent.hidden = false; sent.focus();
});
document.getElementById("msg-again").addEventListener("click", () => {
  form.reset(); form.querySelector(".sent").hidden = true; form.elements.name.focus();
});
// Auckland time, so people in other time zones know when I'm around
const nzTime = document.getElementById("nz-time"), nzFmt = new Intl.DateTimeFormat("en-NZ", { timeZone: "Pacific/Auckland", weekday: "long", hour: "numeric", minute: "2-digit" });
const tickNz = () => { const x = Object.fromEntries(nzFmt.formatToParts(new Date()).map((p) => [p.type, p.value])); nzTime.textContent = `It's ${x.hour}:${x.minute} ${x.dayPeriod} on ${x.weekday} in Auckland`; };
tickNz(); setInterval(tickNz, 30000);

/* ---------- ask me anything (scripted answers for the mockup; the real one reads the CV) ---------- */
const ANSWERS = [
  { keys: ["work on", "working", "straker", "arbitr", "job", "now", "do you do"], text: "I'm an AI Product Engineer at Arbitr in Auckland. The company used to be called Straker. Arbitr is an AI-first translation platform where clients upload content, AI agents and machine translation do the first pass, and people review it where needed. I work across its services and web apps, mostly on what the AI can do on its own and the path to a person when it shouldn't." },
  { keys: ["before", "dbs", "bank", "experience", "years", "singapore", "background"], text: "Before Arbitr I was at DBS Bank in Singapore, working on a tax engine that runs across more than 15 countries, and before that at GrubTech in Sri Lanka. I work across the whole stack, from services to web apps. On LandedNZ I built the mobile app and the AI pipeline as well." },
  { keys: ["language", "python", "java", "stack", "tech", "vue", "skills", "tools"], text: "Java for most of my career. At Arbitr I picked up Python with FastAPI and Vue with Nuxt on the job. On my side project, LandedNZ, I use the Claude API with pgvector for search." },
  { keys: ["reach", "contact", "email", "hire", "book", "chat", "talk", "call"], text: "The quickest way is the Book a 20-minute chat button on this page. You can also find me on LinkedIn." },
  { keys: ["game", "kid", "hobby", "fun", "play"], text: "As a kid in Sri Lanka I wanted to make video games. I still want to know how things get made, and that's most of why I write software." }
];
const FALLBACK = "I don't have that in my notes. Book a 20-minute chat and ask me directly.";
const answerFor = (q) => { q = q.toLowerCase(); return (ANSWERS.find((x) => x.keys.some((k) => q.includes(k))) || { text: FALLBACK }).text; };
const askBox = document.querySelector(".ask"), askIn = askBox.querySelector("input"), convo = askBox.querySelector(".convo");
let asking = false;
function ask(q) {
  q = q.trim(); if (!q || asking) return;
  asking = true; askIn.value = "";
  const qe = document.createElement("div"), ae = document.createElement("div");
  qe.className = "q"; qe.textContent = q;
  ae.className = "a typing"; ae.innerHTML = "<span></span><span></span><span></span>";
  convo.replaceChildren(qe, ae);
  const text = answerFor(q);
  setTimeout(() => {
    ae.className = "a"; ae.textContent = "";
    if (reduce) { ae.textContent = text; asking = false; return; }
    let i = 0;
    const t = setInterval(() => { i += 2; ae.textContent = text.slice(0, i); if (i >= text.length) { clearInterval(t); asking = false; } }, 18);
  }, reduce ? 0 : 650);
}
askBox.querySelector("form").addEventListener("submit", (e) => { e.preventDefault(); ask(askIn.value); });
askBox.querySelectorAll(".chip").forEach((c) => c.addEventListener("click", () => ask(c.textContent)));

/* ---------- phone menu ---------- */
const menuBtn = document.querySelector(".menu-btn"), mmenu = document.getElementById("mmenu");
const setMenu = (open) => { mmenu.hidden = !open; menuBtn.setAttribute("aria-expanded", open); menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu"); };
menuBtn.addEventListener("click", () => setMenu(mmenu.hidden));
mmenu.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
addEventListener("keydown", (e) => { if (e.key === "Escape" && !mmenu.hidden) { setMenu(false); menuBtn.focus(); } });
