import { ANSWERS, FALLBACK } from "@/data/answers";

export const answerFor = (q: string) => {
  const s = q.toLowerCase();
  return ANSWERS.find((a) => a.keys.some((k) => s.includes(k)))?.text ?? FALLBACK;
};

// The AI back end plugs in here later, falling back to answerFor on error.
export const getAnswer = async (q: string) => answerFor(q);
