import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';

const cwd = process.cwd();
const out = path.join(cwd, 'dist');
fs.mkdirSync(out, { recursive: true });
await build({ entryPoints: ['react-src/client.jsx'], outfile: 'dist/react-app.js', bundle: true, minify: true, format: 'iife', platform: 'browser', jsx: 'automatic', define: { 'process.env.NODE_ENV': '"production"' } });
await build({ entryPoints: ['react-src/app.jsx'], outfile: 'react-src/.render.mjs', bundle: true, format: 'esm', platform: 'node', packages: 'external', jsx: 'automatic', define: { 'process.env.NODE_ENV': '"production"' } });
const { App } = await import(pathToFileURL(path.join(cwd, 'react-src/.render.mjs')).href + `?t=${Date.now()}`);
const React = (await import('react')).default;
const { renderToString } = await import('react-dom/server');
for (const entry of fs.readdirSync(cwd, { withFileTypes: true })) {
  if (entry.name === 'dist' || entry.name === 'node_modules' || entry.name === 'react-src' || entry.name === '.git' || entry.name === '.openai' || entry.name === 'supabase' || entry.name.startsWith('.') || /^(?:DESIGN|PRODUCT)\.md$/.test(entry.name) || /^package(?:-lock)?\.json$/.test(entry.name) || entry.name.endsWith('.mjs')) continue;
  if (entry.isDirectory()) fs.cpSync(entry.name, path.join(out, entry.name), { recursive: true, force: true });
  else if (entry.isFile() && !entry.name.endsWith('.html')) fs.copyFileSync(entry.name, path.join(out, entry.name));
}
for (const name of fs.readdirSync(cwd).filter(name => name.endsWith('.html'))) {
  const source = fs.readFileSync(name, 'utf8');
  const head = source.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] || '';
  const body = source.match(/<body\b([^>]*)>([\s\S]*?)<\/body>/i);
  if (!body) continue;
  const scripts = [];
  const markup = body[2].replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi, (_, attrs, code) => {
    const src = attrs.match(/\bsrc\s*=\s*["']([^"']+)["']/i)?.[1];
    if (src || code.trim()) scripts.push(src ? { src } : { code });
    return '';
  });
  const rendered = renderToString(React.createElement(App, { markup }));
  const state = JSON.stringify({ markup, scripts }).replace(/</g, '\\u003c');
  const html = `<!doctype html><html lang="it"><head>${head}</head><body${body[1]}><div id="imland-react-root">${rendered}</div><script>window.__IMLAND_PAGE__=${state}</script><script src="react-app.js" defer></script></body></html>`;
  fs.writeFileSync(path.join(out, name), html);
}
fs.rmSync('react-src/.render.mjs', { force: true });
