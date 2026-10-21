import { expect, test } from "vitest";
import { countFrame } from "./countUp";

test("end frame is the target", () => expect(countFrame("9,084", 1)).toBe("9,084"));
test("start frame is zero with the same decimals", () => expect(countFrame("0.80", 0)).toBe("0.00"));
test("keeps a < prefix and a text suffix", () => expect(countFrame("<2 hours", 1)).toBe("<2 hours"));
test("mid frame keeps thousands commas", () => expect(countFrame("9,084", 0.5)).toMatch(/^\d{1,3}(,\d{3})*$/));
test("non-numeric value is unchanged", () => expect(countFrame("Daily", 0.3)).toBe("Daily"));
