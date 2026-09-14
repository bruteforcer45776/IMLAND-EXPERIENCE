#!/usr/bin/env python3
"""Visual regression per la gerarchia degli sfondi IMLAND.

Uso:
  python3 tests/visual/visual_regression.py --update   # crea/aggiorna le baseline
  python3 tests/visual/visual_regression.py            # confronta con le baseline

Cattura screenshot desktop e mobile delle pagine principali e, per ogni sezione
con un ruolo semantico (section-atmosphere / canvas / focus / editorial /
closing), registra il colore di sfondo calcolato in modo che una regressione
della gerarchia faccia fallire il test anche senza differenze di pixel evidenti.
"""

import argparse
import asyncio
import json
import os
import sys
from pathlib import Path

from PIL import Image, ImageChops
from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parent
BASE_URL = os.environ.get("VISUAL_BASE_URL", "http://localhost:8080")
BASELINE_DIR = ROOT / "baseline"
CURRENT_DIR = ROOT / "current"
DIFF_DIR = ROOT / "diff"
PAGES = json.loads((ROOT / "pages.json").read_text())
VIEWPORTS = [
    ("desktop", {"width": 1280, "height": 1800}),
    ("mobile", {"width": 390, "height": 1400}),
]
# tolleranza pixel: gradienti e antialiasing hanno micro-variazioni
PIXEL_TOLERANCE = 0.015
# larghezza in px della striscia laterale usata per il confronto degli sfondi
EDGE_STRIP = 48


SECTION_PROBE = """
() => Array.from(document.querySelectorAll(
  '.section-atmosphere, .section-canvas, .section-focus, .section-editorial, .section-closing'
)).map((el) => {
  const s = getComputedStyle(el);
  const before = getComputedStyle(el, '::before');
  return {
    role: Array.from(el.classList).filter((c) => c.startsWith('section-')).sort().join(' '),
    color: s.color,
    backgroundColor: s.backgroundColor,
    beforeBackground: before.backgroundImage !== 'none' ? 'image' : before.backgroundColor,
    fullBleed: Math.round(el.getBoundingClientRect().width) >= Math.round(document.documentElement.clientWidth) - 2
      || before.content !== 'none',
  };
});
"""

FREEZE_CSS = """
*, *::before, *::after {
  animation: none !important;
  transition: none !important;
  animation-play-state: paused !important;
  caret-color: transparent !important;
}
/* media e contenuti dinamici non fanno parte del contratto visivo delle fasce */
canvas, video, iframe, img, svg, [data-visual-unstable="true"] { visibility: hidden !important; }
"""

# ferma slideshow/marquee guidati da timer JS e media in riproduzione
FREEZE_JS = """
() => {
  document.querySelectorAll('video').forEach((v) => { try { v.pause(); v.currentTime = 0; } catch (e) {} });
  document.getAnimations?.().forEach((a) => { try { a.cancel(); } catch (e) {} });
  const maxId = setTimeout(() => {}, 0);
  for (let id = 0; id <= maxId; id++) { clearInterval(id); clearTimeout(id); }
}
"""




async def capture(update: bool) -> list[str]:
    failures: list[str] = []
    out_dir = BASELINE_DIR if update else CURRENT_DIR
    out_dir.mkdir(parents=True, exist_ok=True)
    DIFF_DIR.mkdir(parents=True, exist_ok=True)

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        for label, viewport in VIEWPORTS:
            context = await browser.new_context(viewport=viewport)
            page = await context.new_page()
            # evita che il popup "scarica app" copra gli screenshot
            await page.add_init_script(
                "try { sessionStorage.setItem('imland-download-popup', 'seen'); } catch (e) {}"
            )
            for entry in PAGES:
                key = f"{entry['name']}-{label}"
                await page.goto(BASE_URL + entry["path"], wait_until="domcontentloaded")
                await page.wait_for_timeout(2500)
                await page.evaluate("window.scrollTo(0, 0)")
                # congela animazioni, slideshow, canvas e media: contano solo le fasce
                await page.add_style_tag(content=FREEZE_CSS)
                await page.evaluate(FREEZE_JS)
                await page.wait_for_timeout(600)
                shot = out_dir / f"{key}.png"
                await page.screenshot(path=str(shot))


                sections = await page.evaluate(SECTION_PROBE)
                meta_path = (BASELINE_DIR if update else CURRENT_DIR) / f"{key}.json"
                meta_path.write_text(json.dumps(sections, indent=2))

                if not sections:
                    failures.append(f"{key}: nessuna sezione con ruolo semantico trovata")
                for i, sec in enumerate(sections):
                    if not sec["fullBleed"]:
                        failures.append(f"{key}: sezione #{i} ({sec['role']}) non full-bleed")

                if not update:
                    failures += compare(key)
            await context.close()
        await browser.close()
    return failures


def compare(key: str) -> list[str]:
    problems: list[str] = []
    base_img, cur_img = BASELINE_DIR / f"{key}.png", CURRENT_DIR / f"{key}.png"
    base_meta, cur_meta = BASELINE_DIR / f"{key}.json", CURRENT_DIR / f"{key}.json"

    if not base_img.exists():
        return [f"{key}: baseline mancante (esegui con --update)"]

    a, b = Image.open(base_img).convert("RGB"), Image.open(cur_img).convert("RGB")
    if a.size != b.size:
        problems.append(f"{key}: dimensioni diverse {a.size} vs {b.size}")
    else:
        # confronto sulle colonne laterali: lì si vedono solo le fasce di sfondo,
        # non i contenuti dinamici (news, orari, feed) che cambiano legittimamente
        strip = (0, 0, EDGE_STRIP, a.size[1])
        diff = ImageChops.difference(a.crop(strip), b.crop(strip))
        changed = sum(1 for px in diff.getdata() if max(px) > 12)
        ratio = changed / (EDGE_STRIP * a.size[1])
        if ratio > PIXEL_TOLERANCE:
            ImageChops.difference(a, b).save(DIFF_DIR / f"{key}.png")
            problems.append(f"{key}: sfondi diversi dalla baseline ({ratio:.3%} > {PIXEL_TOLERANCE:.1%})")


    if base_meta.exists():
        expected = json.loads(base_meta.read_text())
        actual = json.loads(cur_meta.read_text())
        exp_roles = [s["role"] for s in expected]
        act_roles = [s["role"] for s in actual]
        if exp_roles != act_roles:
            problems.append(f"{key}: gerarchia sezioni cambiata\n  attesa: {exp_roles}\n  attuale: {act_roles}")
        else:
            for i, (e, c) in enumerate(zip(expected, actual)):
                for field in ("color", "backgroundColor", "beforeBackground"):
                    if e[field] != c[field]:
                        problems.append(
                            f"{key}: sezione #{i} ({e['role']}) {field} {e[field]} -> {c[field]}"
                        )
    return problems


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--update", action="store_true", help="rigenera le baseline")
    args = parser.parse_args()

    failures = asyncio.run(capture(args.update))
    if args.update:
        print(f"Baseline aggiornate in {BASELINE_DIR}")
    if failures:
        print("\n".join(f"FAIL {f}" for f in failures))
        return 1
    print("OK: gerarchia degli sfondi coerente su tutte le pagine e viewport")
    return 0


if __name__ == "__main__":
    sys.exit(main())
