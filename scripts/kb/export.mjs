// Builds the public knowledge base files from the private master in Me/kb/. Run locally: `pnpm kb:export`.
// Writes nothing unless validation and the denylist check both pass.
import { readFileSync, writeFileSync } from "node:fs";
import { validate, toPublic, findDenied, renderLlms, renderResume, renderJsonLd, injectJsonLd } from "./lib.mjs";

const kb = JSON.parse(readFileSync("Me/kb/kb.json", "utf8"));
const denylist = readFileSync("Me/kb/denylist.txt", "utf8").split("\n");
// the `org` anchor skips the diagram node ids that also use `id:`
const projectIds = [...readFileSync("src/data/projects.ts", "utf8").matchAll(/^ {4}id: "([a-z]+)", org/gm)].map((m) => m[1]);

const problems = validate(kb, projectIds);
if (problems.length) {
  console.error(`kb.json has ${problems.length} problem(s):\n- ${problems.join("\n- ")}`);
  process.exit(1);
}

const pub = toPublic(kb);
const outputs = {
  "src/data/kb.public.json": JSON.stringify(pub, null, 2) + "\n",
  "public/llms.txt": renderLlms(pub),
  "public/resume.json": JSON.stringify(renderResume(pub), null, 2) + "\n",
  "index.html": injectJsonLd(readFileSync("index.html", "utf8"), renderJsonLd(pub)),
};

const leaks = Object.entries(outputs).flatMap(([file, text]) => findDenied(text, denylist).map((t) => `${file}: "${t}"`));
if (leaks.length) {
  console.error(`Private terms found, nothing written:\n- ${leaks.join("\n- ")}`);
  process.exit(1);
}

for (const [file, text] of Object.entries(outputs)) writeFileSync(file, text);
console.log(`Exported ${pub.facts.length} facts, ${pub.stories.length} stories, ${pub.decisions.length} decisions, ${pub.answers.length} answers, ${pub.proof.length} proof links, ${pub.aiPractice.length} AI practice entries.`);
