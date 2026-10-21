import { KB } from "./kb";
import type { Answer } from "./types";

// Answers live in the knowledge base (Me/kb/kb.json, exported by `pnpm kb:export`).
export const ANSWERS: Answer[] = KB.answers;
export const FALLBACK = "I don't have that in my notes. Book a 20-minute chat and ask me directly.";
