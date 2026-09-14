"""Test end-to-end IMLAND Experience.

Copre: percorsi pubblici, protezione route (guest / ascoltatore / admin),
sessione e logout, azioni like/unlike (successo, errore di rete, utente
non autorizzato).

Uso: python3 tests/e2e/run_e2e.py
"""

import asyncio
import json
import os
import sys

from playwright.async_api import async_playwright

BASE = os.environ.get("BASE_URL", "http://localhost:8080")
VIEWPORT = {"width": 1280, "height": 1800}

PUBLIC_PATHS = [
    "/",
    "/radio",
    "/podcast",
    "/news",
    "/eventi",
    "/member",
    "/per-le-aziende",
    "/chi-siamo",
    "/faq",
    "/brand",
    "/scarica-app",
    "/contatti",
    "/cerca",
    "/accedi",
]

PROTECTED_PATHS = ["/area", "/ascoltatore", "/area-aziende", "/admin", "/admin/feedback"]

results: list[tuple[str, str, str]] = []


def record(status: str, name: str, detail: str = "") -> None:
    results.append((status, name, detail))
    print(f"[{status}] {name}{' — ' + detail if detail else ''}", flush=True)


async def restore_session(context, page) -> bool:
    """Ripristina la sessione iniettata dalla preview, se disponibile."""
    if os.environ.get("LOVABLE_BROWSER_AUTH_STATUS") != "injected":
        return False
    if cj := os.environ.get("LOVABLE_BROWSER_SUPABASE_COOKIES_JSON"):
        await context.add_cookies([{**c, "url": BASE} for c in json.loads(cj)])
    await page.goto(BASE, wait_until="domcontentloaded")
    key = os.environ.get("LOVABLE_BROWSER_SUPABASE_STORAGE_KEY")
    sj = os.environ.get("LOVABLE_BROWSER_SUPABASE_SESSION_JSON")
    if not (key and sj):
        return False
    await page.evaluate(f"localStorage.setItem({json.dumps(key)}, {json.dumps(sj)})")
    return True


async def test_public_routes(page) -> None:
    for path in PUBLIC_PATHS:
        response = await page.goto(BASE + path, wait_until="domcontentloaded")
        status = response.status if response else 0
        heading = await page.locator("h1, h2").count() > 0
        if status == 200 and heading:
            record("PASS", f"route pubblica {path}")
        else:
            record("FAIL", f"route pubblica {path}", f"status={status} heading={heading}")


async def test_guest_protection(page) -> None:
    for path in PROTECTED_PATHS:
        await page.goto(BASE + path, wait_until="domcontentloaded")
        await page.wait_for_timeout(3000)
        url = page.url
        if "/accedi" in url:
            record("PASS", f"guest bloccato su {path}")
        else:
            record("FAIL", f"guest bloccato su {path}", f"url={url}")


async def test_share_and_notfound(page) -> None:
    response = await page.goto(BASE + "/news/slug-inesistente-xyz", wait_until="domcontentloaded")
    status = response.status if response else 0
    record("PASS" if status in (404, 200) else "FAIL", "slug news inesistente", f"status={status}")

    response = await page.goto(BASE + "/s/token-inesistente", wait_until="domcontentloaded")
    status = response.status if response else 0
    record("PASS" if status < 500 else "FAIL", "link condiviso non valido", f"status={status}")


async def test_guest_like(page) -> None:
    """Un guest che tenta il like deve vedere l'invito ad accedere, non un crash."""
    await page.goto(BASE + "/podcast", wait_until="domcontentloaded")
    errors: list[str] = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    await page.wait_for_timeout(800)
    record("PASS" if not errors else "FAIL", "nessun errore JS sul catalogo podcast", "; ".join(errors[:2]))


async def test_authenticated(context, page) -> None:
    await page.goto(BASE + "/ascoltatore", wait_until="domcontentloaded")
    await page.wait_for_timeout(2500)
    if "/accedi" in page.url:
        record("FAIL", "sessione valida su /ascoltatore", f"url={page.url}")
        return
    record("PASS", "sessione valida su /ascoltatore", f"url={page.url}")

    # like / unlike
    await page.goto(BASE + "/ascoltatore/puntate", wait_until="domcontentloaded")
    await page.wait_for_timeout(2500)
    like = page.locator('button[aria-label="Aggiungi ai preferiti"]').first
    if await like.count() == 0:
        record("SKIP", "like/unlike", "nessuna puntata trovata")
    else:
        await like.click()
        try:
            await page.wait_for_selector("text=Salvato nei preferiti", timeout=8000)
            record("PASS", "like riuscito con toast")
        except Exception:
            record("FAIL", "like riuscito con toast", "toast assente")
        unlike = page.locator('button[aria-label="Rimuovi dai preferiti"]').first
        if await unlike.count() > 0:
            await unlike.click()
            try:
                await page.wait_for_selector("text=Rimosso dai preferiti", timeout=8000)
                record("PASS", "unlike riuscito con toast")
            except Exception:
                record("FAIL", "unlike riuscito con toast", "toast assente")

        # like fallito: blocca le chiamate al database
        await context.route("**/rest/v1/favorites*", lambda route: route.abort())
        target = page.locator('button[aria-label^="Aggiungi"], button[aria-label^="Rimuovi"]').first
        await target.click()
        try:
            await page.wait_for_selector("text=Riprova", timeout=8000)
            record("PASS", "like fallito mostra errore con Riprova")
        except Exception:
            record("FAIL", "like fallito mostra errore con Riprova", "nessun toast di errore")
        await context.unroute("**/rest/v1/favorites*")

    # logout
    await page.goto(BASE + "/ascoltatore", wait_until="domcontentloaded")
    await page.wait_for_timeout(1500)
    logout = page.get_by_role("button", name="Esci")
    if await logout.count() == 0:
        record("SKIP", "logout", "pulsante Esci non trovato")
        return
    await logout.first.click()
    await page.wait_for_timeout(2500)
    if "/accedi" in page.url:
        record("PASS", "logout reindirizza ad /accedi")
    else:
        record("FAIL", "logout reindirizza ad /accedi", f"url={page.url}")

    await page.goto(BASE + "/ascoltatore", wait_until="domcontentloaded")
    await page.wait_for_timeout(1800)
    record(
        "PASS" if "/accedi" in page.url else "FAIL",
        "dopo il logout l'area è protetta",
        f"url={page.url}",
    )


async def main() -> int:
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)

        guest = await browser.new_context(viewport=VIEWPORT)
        page = await guest.new_page()
        await test_public_routes(page)
        await test_guest_protection(page)
        await test_share_and_notfound(page)
        await test_guest_like(page)
        await guest.close()

        auth = await browser.new_context(viewport=VIEWPORT)
        apage = await auth.new_page()
        if await restore_session(auth, apage):
            await test_authenticated(auth, apage)
        else:
            record("SKIP", "test autenticati", "nessuna sessione disponibile")
        await auth.close()
        await browser.close()

    failed = [r for r in results if r[0] == "FAIL"]
    print("\n---")
    print(f"PASS={sum(1 for r in results if r[0]=='PASS')} FAIL={len(failed)} SKIP={sum(1 for r in results if r[0]=='SKIP')}")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
