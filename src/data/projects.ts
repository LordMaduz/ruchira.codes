import type { Project } from "./types";

export const PROJECTS: Project[] = [
  {
    id: "straker", org: "Arbitr (formerly Straker)", role: "AI Product Engineer", when: "June 2026 to now", years: "2026 to now",
    title: "Guardrails for AI agents",
    summary: "Arbitr is an AI-first translation platform. AI agents and machine translation do the first pass, and people review what needs a human. I work across its services, mostly on the orchestration side: what the agents may decide alone, and the route to a person when they shouldn't.",
    h: 190, label: "Client text goes through AI agents and then checks. Confident work is delivered and the rest goes to a person.",
    nodes: [
      { id: "a", x: 4, y: 69, t: "Client text", s: "source files" },
      { id: "b", x: 170, y: 69, t: "AI agents", s: "translate, fix terms", k: "ai" },
      { id: "c", x: 336, y: 69, t: "Checks", s: "score and rules" },
      { id: "d", x: 500, y: 14, t: "Delivered", s: "when it's sure" },
      { id: "e", x: 500, y: 124, t: "A person", s: "when it isn't", k: "person" }
    ],
    edges: [["a", "b"], ["b", "c"], ["c", "d"], ["c", "e", "review"]],
    metrics: [
      { v: "0.80", l: "quality score cap that sends doubtful translations to a reviewer" },
      { v: "9,084", l: "credits protected when a client job got stuck" },
      { v: "5", l: "services covered by a security fix I merged in week two" }
    ],
    stack: ["Python", "FastAPI", "PydanticAI", "Redis Streams", "LiteLLM", "Vue", "Nuxt"],
    problem: "AI agents make a lot of small decisions on Arbitr: which vendor gets a job, whether a translation is good enough, whether the client's required terms are used. Most of those calls are fine. The ones that aren't can cost a client money or trust.",
    did: [
      "Added a guardrail to the AI agent that picks translation vendors, so it only auto-selects approved ones. A project manager can override it with a logged reason. It went live for a new product's first client jobs.",
      "Capped a quality score at 0.80 for one enterprise client, so machine translation with the wrong meaning goes to a human reviewer before delivery.",
      "Designed an LLM agent that repairs client terminology after the other agents finish, so the final text uses the client's exact terms.",
      "When a 12-language client job got stuck, I traced it through the logs and the database and had a recovery fix merged within about a day. A senior engineer ran the recovery, and the 9,084 credits the client had already paid for were not charged again."
    ],
    result: "The agents handle more on their own, and the risky cases reach a person. I came in as a Java engineer and learned Python and Vue on the job. I also review a lot of my teammates' code, about 35 pull requests so far."
  },
  {
    id: "landednz", org: "LandedNZ", role: "Built it alone", when: "February 2026 to now", years: "2026 to now",
    title: "A planner for moving to New Zealand",
    summary: "When my wife got into university in Auckland, we planned the move from dozens of browser tabs that disagreed with each other. So I built the planner we wished we'd had.",
    h: 200, label: "Your details go into a rules engine that builds your plan. An AI chat reads the plan and answers questions.",
    nodes: [
      { id: "a", x: 4, y: 20, t: "Your details", s: "visa, city, family" },
      { id: "b", x: 252, y: 20, t: "Roadmap engine", s: "plain rules, no AI" },
      { id: "c", x: 500, y: 20, t: "Your plan", s: "21 tasks, 90 days" },
      { id: "d", x: 500, y: 130, t: "AI chat", s: "reads your plan", k: "ai" }
    ],
    edges: [["a", "b"], ["b", "c"], ["c", "d", "soft"]],
    note: "The roadmap never fails because the AI does.",
    metrics: [
      { v: "21", l: "tasks across your first 90 days" },
      { v: "5", l: "things shape your plan: visa, city, family, job and arrival date" },
      { v: "<1s", l: "before the chat's answer starts streaming" }
    ],
    stack: ["Next.js", "Fastify", "PostgreSQL", "pgvector", "Claude API", "SSE"],
    problem: "If you miss your IRD number in the first week, you pay emergency tax on every pay. Signing a lease before checking school zones can cost thousands. New arrivals often learn the right order of things too late.",
    did: [
      "Split the product into two parts. A rules engine builds your plan from your visa, city, family, job and arrival date, with no AI involved.",
      "Put an AI chat on top that answers questions about your plan, using a RAG pipeline with pgvector search and the Claude API, streamed as it writes.",
      "Built the web app, the backend and the AI pipeline myself."
    ],
    result: "If the chat is slow or down, your plan is still there and still correct, because the AI never sits on the critical path."
  },
  {
    id: "globe", org: "DBS Bank, Singapore", role: "Lead Solutions Architect", when: "June 2024 to June 2025", years: "2024 to 2025",
    title: "A global minimum tax engine",
    summary: "New OECD rules set a 15% global minimum tax from 2025, with different formulas in every country. I designed an engine where tax teams edit the rules themselves, so a formula change doesn't wait for a software release.",
    h: 110, label: "Tax teams edit rule templates, the engine runs them, and results come out for more than 15 countries.",
    nodes: [
      { id: "a", x: 4, y: 29, t: "Tax teams", s: "edit rule templates" },
      { id: "b", x: 252, y: 29, t: "Rules engine", s: "MVEL, versioned" },
      { id: "c", x: 500, y: 29, t: "15+ countries", s: "quarterly results" }
    ],
    edges: [["a", "b"], ["b", "c"]],
    metrics: [
      { v: "2 hrs", l: "per country, down from 5 days" },
      { v: "15+", l: "countries on one engine" },
      { v: "60%", l: "less IT involvement in rule changes" }
    ],
    stack: ["Java", "Spring Boot", "MVEL", "MongoDB", "HFM", "Docker"],
    problem: "Pillar Two rules needed quarterly provisioning with country-specific formulas, and the old systems made every rule change an IT project.",
    did: [
      "Designed a calculation engine on MVEL with versioned rule templates that tax teams can change themselves.",
      "Connected it to the bank's financial systems, including HFM and country-by-country reporting.",
      "Led an 8-person technical team, working with stakeholders across more than 15 countries."
    ],
    result: "Processing went from 5 days to 2 hours per country, and the bank was ready 3 months before the FY2025 deadline."
  },
  {
    id: "dega", org: "DBS Bank, Singapore", role: "Senior Application Developer", when: "September 2022 to April 2024", years: "2022 to 2024",
    title: "Trade file processing for derivatives",
    summary: "The derivatives desk receives trade and market files from Bloomberg all day, some over 100 MB. The old system slowed down exactly when markets got busy, so I moved it to a reactive pipeline.",
    h: 110, label: "Bloomberg files flow through a reactive pipeline to the trading desk.",
    nodes: [
      { id: "a", x: 4, y: 29, t: "Bloomberg files", s: "50K+ a month" },
      { id: "b", x: 252, y: 29, t: "Reactive pipeline", s: "WebFlux and S3" },
      { id: "c", x: 500, y: 29, t: "Trading desk", s: "settlement, risk" }
    ],
    edges: [["a", "b"], ["b", "c"]],
    metrics: [
      { v: "50K+", l: "trade files a month" },
      { v: "60%", l: "faster uploads and downloads" },
      { v: "20%", l: "lower infrastructure cost" }
    ],
    stack: ["Java 17", "Spring WebFlux", "Project Reactor", "AWS S3", "OpenShift"],
    problem: "Blocking file handling became a bottleneck when volumes spiked during volatile markets, which delayed settlement and risk reports.",
    did: [
      "Moved file handling to the reactive AWS SDK v2 with Spring WebFlux.",
      "Streamed large files in parallel so memory stayed flat, even for 100 MB trade confirmations."
    ],
    result: "Uploads and downloads got 60% faster for more than 1,000 daily users, and infrastructure cost dropped by 20%."
  },
  {
    id: "grubtech", org: "GrubTech, Sri Lanka", role: "Senior Software Engineer", when: "April 2022 to September 2022", years: "2022",
    title: "Food orders at lunch-rush scale",
    summary: "A platform taking orders for many restaurant brands at once. At lunch and dinner peaks the database fell behind, so confirmations were slow and stock counts drifted.",
    h: 110, label: "Orders go to a Redis cache that writes behind to MongoDB.",
    nodes: [
      { id: "a", x: 4, y: 29, t: "Orders", s: "500K+ a day" },
      { id: "b", x: 252, y: 29, t: "Redis cache", s: "write-behind" },
      { id: "c", x: 500, y: 29, t: "MongoDB", s: "40% less load" }
    ],
    edges: [["a", "b"], ["b", "c"]],
    metrics: [
      { v: "500K+", l: "orders a day" },
      { v: "40%", l: "less database write load" },
      { v: "35%", l: "faster order confirmations" }
    ],
    stack: ["Java 11", "Spring Boot", "Redis", "Redisson", "MongoDB", "Kafka"],
    problem: "Peak hours overloaded the database. Order confirmations slowed down and stock levels fell out of sync, which risked overselling.",
    did: [
      "Built write-behind caching with Redis and Redisson, so orders are confirmed straight away and saved to the database shortly after.",
      "Added automatic stock syncing across brands, with conflict handling, so the same item can't be oversold."
    ],
    result: "Database write load fell by 40% and order confirmations got 35% faster."
  }
];

// "Arbitr (formerly Straker)" -> "Arbitr", for short labels like the skills "Seen in" buttons
export const orgName = (id: string) => PROJECTS.find((p) => p.id === id)!.org.split(/[,(]/)[0].trim();
