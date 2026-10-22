import { expect, test } from "vitest";
import { contactSchema, nzTimeLabel } from "./contact";

const firstError = (v: object) => contactSchema.safeParse(v).error?.issues[0].message;

test("blank name is rejected with the mockup's message", () => expect(firstError({ name: "  ", email: "a@b.co", message: "hi" })).toBe("Add your name to send."));
test("bad email is rejected with the mockup's message", () => expect(firstError({ name: "A", email: "nope", message: "hi" })).toBe("Add a valid email so I can reply."));
test("blank message is rejected", () => expect(firstError({ name: "A", email: "a@b.co", message: " " })).toBe("Add your message to send."));
test("a filled form passes", () => expect(contactSchema.safeParse({ name: "A", email: "a@b.co", message: "hi" }).success).toBe(true));
test("Auckland time label", () => expect(nzTimeLabel(new Date("2026-10-21T00:30:00Z"))).toBe("It's 1:30 pm on Wednesday in Auckland"));
