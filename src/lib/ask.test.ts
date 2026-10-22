import { expect, test } from "vitest";
import { answerFor, getAnswer, scoreAnswers } from "./ask";
import { FALLBACK } from "@/data/answers";

const id = (q: string) => answerFor(q)?.id ?? null;

test("matches a keyword regardless of case", () => expect(id("What do you WORK ON?")).toBe("now"));
test("before-Arbitr question gets the career answer", () => expect(id("what did you do before")).toBe("before"));
test("unknown question returns null", () => expect(id("favourite colour")).toBeNull());
test("keywords match word starts only", () => expect(id("Do you know Rust?")).toBeNull());
test("'know' does not trigger the 'now' answer", () => expect(id("What languages do you know?")).toBe("stack"));
test("capitals, punctuation and plurals still match", () => {
  expect(id("DBS?")).toBe("before");
  expect(id("Which LANGUAGES?")).toBe("stack");
});
test("empty or whitespace question returns null", () => {
  expect(id("")).toBeNull();
  expect(id("   ")).toBeNull();
});
test("new topics reach their answers", () => {
  expect(id("Where did you study?")).toBe("education");
  expect(id("Tell me about a mistake you made")).toBe("mistake");
  expect(id("How do you use Claude Code?")).toBe("workflow");
});

const A = { id: "a", keys: ["alpha"], text: "A", links: [] };
const B = { id: "b", keys: ["beta", "gamma"], text: "B", links: [] };

test("the highest score beats the first match", () => expect(scoreAnswers("alpha beta gamma", [A, B])?.id).toBe("b"));
test("ties go to the earlier answer", () => expect(scoreAnswers("alpha beta", [A, B])?.id).toBe("a"));
test("regex characters in keys are treated literally", () =>
  expect(scoreAnswers("do you know next.js", [{ id: "n", keys: ["next.js"], text: "N", links: [] }])?.id).toBe("n"));

test("getAnswer resolves the answer with its links", async () => {
  const a = await getAnswer("how do I reach you");
  expect(a.text).toMatch(/Book a 20-minute chat/);
  expect(a.links.length).toBeGreaterThan(0);
});
test("getAnswer returns the fallback with no links on no match", async () =>
  expect(await getAnswer("favourite colour")).toEqual({ text: FALLBACK, links: [] }));
