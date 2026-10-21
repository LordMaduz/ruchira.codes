import { ANSWERS, FALLBACK } from "@/data/answers";

export const answerFor = (q: string) => {
  const s = q.toLowerCase();
  // keys must start a word, so "now" doesn't match inside "know"; plurals like "languages" still match
  return ANSWERS.find((a) => a.keys.some((k) => new RegExp(`\\b${k}`).test(s)))?.text ?? FALLBACK;
};

// The AI back end plugs in here later, falling back to answerFor on error.
export const getAnswer = async (q: string) => answerFor(q);
