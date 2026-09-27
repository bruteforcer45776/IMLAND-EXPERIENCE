import React from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import { App } from './app.jsx';

const root = document.getElementById('imland-react-root');
const page = window.__IMLAND_PAGE__;
if (root && page) {
  flushSync(() => createRoot(root).render(<App markup={page.markup} />));
  (async () => {
    for (const item of page.scripts) {
      await new Promise(resolve => {
        const script = document.createElement('script');
        if (item.src) {
          script.src = item.src;
          script.onload = resolve;
          script.onerror = resolve;
        } else {
          script.textContent = item.code;
        }
        document.body.append(script);
        if (!item.src) resolve();
      });
    }
    const refresh = document.querySelector('link[href^="layout-refresh.css"]');
    if (refresh) document.head.append(refresh);
  })();
}
