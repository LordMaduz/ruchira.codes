import { expect, test } from "vitest";
import { answerFor, getAnswer } from "./ask";
import { FALLBACK } from "@/data/answers";

test("matches a keyword regardless of case", () => expect(answerFor("What do you WORK ON?")).toMatch(/^I'm an AI Product Engineer at Arbitr/));
test("before-Arbitr question gets the new answer", () => expect(answerFor("what did you do before")).toMatch(/^Before Arbitr/));
test("unknown question gets the fallback", () => expect(answerFor("favourite colour")).toBe(FALLBACK));
test("getAnswer resolves the scripted answer", async () => expect(await getAnswer("how do I reach you")).toMatch(/Book a 20-minute chat/));
