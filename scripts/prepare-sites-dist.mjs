import { cp, mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const output = resolve(root, ".output");
const dist = resolve(root, "dist");

await rm(dist, { recursive: true, force: true });
await mkdir(resolve(dist, "server"), { recursive: true });
await mkdir(resolve(dist, "client"), { recursive: true });
await mkdir(resolve(dist, ".openai"), { recursive: true });

await cp(resolve(output, "server"), resolve(dist, "server"), { recursive: true });
await rename(resolve(dist, "server", "index.mjs"), resolve(dist, "server", "index.js"));
await cp(resolve(output, "public"), resolve(dist, "client"), { recursive: true });

const hosting = await readFile(resolve(root, ".openai", "hosting.json"), "utf8");
await writeFile(resolve(dist, ".openai", "hosting.json"), hosting);
