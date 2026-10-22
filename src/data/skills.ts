import type { Skill } from "./types";

export const SKILLS: Skill[] = [
  { t: "AI that knows its limits", s: "Most AI looks great in a demo. I work on the week after, when real client jobs run through it.",
    tools: ["PydanticAI", "LiteLLM", "Claude API", "RAG", "pgvector"],
    proof: [["straker", "The agent that picks translation vendors only auto-selects approved ones, and doubtful translations go to a human reviewer."],
            ["landednz", "The AI chat reads your plan but never builds it, so the plan still works if the chat is down."]] },
  { t: "Systems under load", s: "Half a million orders a day, and the person waiting for lunch shouldn't feel any of it.",
    tools: ["Redis", "Redis Streams", "Spring WebFlux", "Project Reactor", "MongoDB"],
    proof: [["grubtech", "Write-behind caching with Redis cut database write load by 40% and made order confirmations 35% faster."],
            ["dega", "A reactive pipeline handles 50K+ trade files a month, some over 100 MB, without memory climbing."]] },
  { t: "Rules the owners can change", s: "Tax rules change every quarter. I'd rather give the tax team the pen than make them wait for a release.",
    tools: ["Java", "Spring Boot", "MVEL", "MongoDB"],
    proof: [["globe", "Tax teams edit versioned rule templates themselves. Each country went from 5 days to 2 hours."]] },
  { t: "Security", s: "The best security is the kind nobody notices. Somebody still has to go looking for the holes.",
    tools: ["FastAPI", "Pydantic", "Python"],
    proof: [["straker", "In my second week I merged a fix that closed a stored XSS hole across 5 services."]] },
  { t: "Finding what broke", s: "When a job gets stuck, I'd rather follow the logs than guess.",
    tools: ["PostgreSQL", "Redis Streams", "Python"],
    proof: [["straker", "A 12-language client job got stuck. I traced it through the logs and the database and had a fix merged in about a day. The 9,084 credits the client had paid for were not charged again."]] },
  { t: "Building the whole thing", s: "I like owning a product from the first screen to the last API call.",
    tools: ["Next.js", "Fastify", "PostgreSQL", "Vue"],
    proof: [["landednz", "I built the web app, the backend and the AI pipeline myself."]] }
];
