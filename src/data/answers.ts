import type { Answer } from "./types";

export const ANSWERS: Answer[] = [
  { keys: ["work on", "working", "straker", "arbitr", "job", "now", "do you do"], text: "I'm an AI Product Engineer at Arbitr in Auckland. Arbitr is an AI-first translation platform where clients upload content, AI agents and machine translation do the first pass, and people review it where needed. I work across its services and web apps, mostly on what the AI can do on its own and the path to a person when it shouldn't." },
  { keys: ["before", "dbs", "bank", "experience", "years", "singapore", "background"], text: "Before Arbitr I was at DBS Bank in Singapore, working on a tax engine that runs across more than 15 countries, and before that at GrubTech in Sri Lanka. I work across the whole stack, from services to web apps. On LandedNZ I built the mobile app and the AI pipeline as well." },
  { keys: ["language", "python", "java", "stack", "tech", "vue", "skills", "tools"], text: "Java for most of my career. At Arbitr I picked up Python with FastAPI and Vue with Nuxt on the job. On my side project, LandedNZ, I use the Claude API with pgvector for search." },
  { keys: ["reach", "contact", "email", "hire", "book", "chat", "talk", "call"], text: "The quickest way is the Book a 20-minute chat button on this page. You can also find me on LinkedIn." },
  { keys: ["game", "kid", "hobby", "fun", "play"], text: "As a kid in Sri Lanka I wanted to make video games. I still want to know how things get made, and that's most of why I write software." }
];
export const FALLBACK = "I don't have that in my notes. Book a 20-minute chat and ask me directly.";
