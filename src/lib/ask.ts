import { ANSWERS, FALLBACK } from "@/data/answers";
import type { Answer, KbLink } from "@/data/types";

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Keys must start a word, so "now" doesn't match inside "know"; plurals like "languages" still match.
// The answer hitting the most keys wins; ties go to the earlier answer.
export const scoreAnswers = (q: string, answers: Answer[]): Answer | null => {
  const s = q.toLowerCase();
  let best: Answer | null = null, top = 0;
  for (const a of answers) {
    const score = a.keys.filter((k) => new RegExp(`\\b${escape(k)}`).test(s)).length;
    if (score > top) { best = a; top = score; }
  }
  return best;
};

export const answerFor = (q: string) => scoreAnswers(q, ANSWERS);

// The AI back end plugs in here later, falling back to answerFor on error.
export const getAnswer = async (q: string): Promise<{ text: string; links: KbLink[] }> => {
  const a = answerFor(q);
  return a ? { text: a.text, links: a.links } : { text: FALLBACK, links: [] };
};
