import { cpSync, existsSync, mkdirSync, rmSync, copyFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const outputDir = resolve(root, ".output");
const distDir = resolve(root, "dist");
const serverSource = resolve(outputDir, "server");
const publicSource = resolve(outputDir, "public");
const hostingSource = resolve(root, ".openai", "hosting.json");

for (const path of [serverSource, publicSource, hostingSource]) {
  if (!existsSync(path)) {
    throw new Error(`Missing required Sites build input: ${path}`);
  }
}

rmSync(distDir, { recursive: true, force: true });
mkdirSync(resolve(distDir, ".openai"), { recursive: true });
cpSync(serverSource, resolve(distDir, "server"), { recursive: true });
cpSync(publicSource, resolve(distDir, "client"), { recursive: true });
copyFileSync(resolve(distDir, "server", "index.mjs"), resolve(distDir, "server", "index.js"));
copyFileSync(hostingSource, resolve(distDir, ".openai", "hosting.json"));

console.log("Prepared Sites artifact in dist/");
