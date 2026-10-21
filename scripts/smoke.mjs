// Browser smoke checks against the built site. Run `pnpm build` first.
// Set SHOTS_DIR to also save screenshots.
import { preview } from "vite";
import { chromium } from "playwright";
import assert from "node:assert/strict";

const server = await preview({ preview: { port: 4173, strictPort: true }, logLevel: "silent" });
const URL = "http://localhost:4173/ruchira.codes/";
const shots = process.env.SHOTS_DIR;
const browser = await chromium.launch();
const dark = () => localStorage.setItem("theme-storage", '{"state":{"theme":"dark"},"version":0}');
const noHScroll = (p) => p.evaluate(() => document.documentElement.scrollWidth <= innerWidth);

async function page(opts = {}, theme) {
  const ctx = await browser.newContext(opts);
  const p = await ctx.newPage();
  if (theme === "dark") await p.addInitScript(dark);
  await p.goto(URL);
  return p;
}

try {
  // 1. no sideways scroll on phones or desktop, light and dark, drawer closed and open
  for (const [w, h] of [[360, 780], [1440, 900]]) for (const theme of ["light", "dark"]) {
    const p = await page({ viewport: { width: w, height: h } }, theme);
    for (const id of ["about", "skills", "work", "contact"]) await p.evaluate((i) => document.getElementById(i).scrollIntoView(), id);
    await p.waitForTimeout(400);
    assert.ok(await noHScroll(p), `page scrolls sideways at ${w}px ${theme}`);
    if (shots) await p.screenshot({ path: `${shots}/page-${w}-${theme}.png`, fullPage: true });
    await p.locator("#work .slot.active").click();
    await p.locator(".dr-box").waitFor();
    assert.ok(await noHScroll(p), `drawer makes the page scroll sideways at ${w}px ${theme}`);
    if (shots) await p.screenshot({ path: `${shots}/drawer-${w}-${theme}.png` });
    await p.context().close();
  }

  // 2. a "Seen in" button opens the drawer, Escape closes it and focus goes back to that button
  {
    const p = await page({ viewport: { width: 1440, height: 900 } });
    const btn = p.locator("#skills .slot.active .proofs button").first();
    await btn.scrollIntoViewIfNeeded();
    await btn.click();
    await p.locator(".dr-box").waitFor();
    await p.keyboard.press("Escape");
    await p.locator(".dr-box").waitFor({ state: "detached" });
    // Radix hands focus back on the next tick
    const handle = await btn.elementHandle();
    await p.waitForFunction((el) => el === document.activeElement, handle, { timeout: 1000 }).catch(() => assert.fail("focus did not return to the Seen in button"));
    await p.context().close();
  }

  // 3. if web3forms is down the visitor keeps what they typed and sees the error
  {
    const p = await page({ viewport: { width: 375, height: 812 } });
    await p.route("https://api.web3forms.com/**", (r) => r.fulfill({ status: 500, body: "{}" }));
    await p.fill("#c-name", "Jane Smith"); await p.fill("#c-email", "jane@company.co.nz"); await p.fill("#c-message", "Hello there");
    await p.click(".contact .send");
    await p.locator("[role=alert]").waitFor();
    assert.equal(await p.locator("[role=alert]").textContent(), "That didn't send. Try again, or message me on LinkedIn.");
    assert.deepEqual([await p.inputValue("#c-name"), await p.inputValue("#c-email"), await p.inputValue("#c-message")], ["Jane Smith", "jane@company.co.nz", "Hello there"]);
    await p.context().close();
  }

  // 3b. after a successful send the hidden fields can't be tabbed into
  {
    const p = await page({ viewport: { width: 375, height: 812 } });
    await p.route("https://api.web3forms.com/**", (r) => r.fulfill({ status: 200, contentType: "application/json", body: '{"success":true}' }));
    await p.fill("#c-name", "Jane Smith"); await p.fill("#c-email", "jane@company.co.nz"); await p.fill("#c-message", "Hello there");
    await p.click(".contact .send");
    await p.locator(".sent").waitFor();
    assert.equal(await p.locator("#c-name").evaluate((el) => !!el.closest("[inert]")), true, "fields stay reachable behind the thank-you panel");
    await p.context().close();
  }

  // 4. ask box: empty submit does nothing, a second question while typing is ignored
  {
    const p = await page({ viewport: { width: 1440, height: 900 } });
    await p.fill("#ask-in", "   ");
    await p.click(".ask .go");
    assert.equal(await p.locator(".convo > *").count(), 0, "empty question was asked");
    const chips = p.locator(".chip");
    const first = await chips.nth(0).textContent();
    await chips.nth(0).click(); await chips.nth(1).click();
    assert.equal(await p.locator(".convo .q").textContent(), first, "second question interrupted the first");
    // screen readers hear the finished answer once, not every typed fragment
    assert.equal(await p.locator(".convo").getAttribute("aria-live"), null, "typing area is a live region");
    await p.waitForFunction(() => document.querySelector("[data-ask-live]")?.textContent?.startsWith("I'm an AI Product Engineer"), null, { timeout: 8000 })
      .catch(() => assert.fail("finished answer was not announced"));
    await p.context().close();
  }

  // 5. reduced motion: metrics and answers show in full straight away
  {
    const p = await page({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
    await p.locator(".chip").first().click();
    await p.waitForTimeout(100);
    assert.match(await p.locator(".convo .a").textContent(), /^I'm an AI Product Engineer at Arbitr.*\.$/);
    await p.evaluate(() => document.getElementById("work").scrollIntoView());
    await p.locator("#work .slot.active").click();
    assert.equal(await p.locator(".pstats dd").first().textContent(), "0.80");
    await p.context().close();
  }
  console.log("smoke: all checks passed");
} finally {
  await browser.close();
  await new Promise((r) => server.httpServer.close(r));
}
