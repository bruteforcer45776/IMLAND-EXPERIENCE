# Test visual/regressione — gerarchia degli sfondi

Controlla che le fasce semantiche (`section-atmosphere`, `section-canvas`, `section-focus`, `section-editorial`, `section-closing`) restino coerenti su Home, Radio, Podcast, Eventi, Member, News e Chi siamo, in desktop e mobile.

## Come si usa

Con il dev server attivo su `http://localhost:8080`:

```bash
# prima volta o dopo un cambio di design voluto
python3 tests/visual/visual_regression.py --update

# controllo di regressione
python3 tests/visual/visual_regression.py
```

Il test fallisce se:

- la sequenza dei ruoli di sezione di una pagina cambia;
- cambiano colore testo o sfondo calcolati di una sezione;
- una fascia non è più full-bleed;
- la differenza pixel sulle strisce laterali (dove si vedono solo le fasce) supera l'1,5%.

Durante la cattura animazioni, timer, video, canvas e immagini vengono congelati/nascosti: contano le fasce e i layout, non i contenuti dinamici come il feed news.

Gli screenshot correnti finiscono in `current/`, le differenze in `diff/`.
Aggiungi o togli pagine in `pages.json`.
Per puntare a un altro host: `VISUAL_BASE_URL=https://... python3 tests/visual/visual_regression.py`.
