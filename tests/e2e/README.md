# Test end-to-end

Script Playwright (Python) che verificano percorsi pubblici, protezione delle
route, login/logout e le azioni like/unlike.

```bash
python3 tests/e2e/run_e2e.py            # tutti i test
BASE_URL=http://localhost:8080 python3 tests/e2e/run_e2e.py
```

Con una sessione disponibile (variabili `LOVABLE_BROWSER_SUPABASE_*` iniettate
dalla preview) vengono eseguiti anche i test autenticati: login persistito,
like/unlike su una puntata, gestione dell'errore di rete e logout.
Senza sessione quei test vengono saltati e riportati come `SKIP`.
