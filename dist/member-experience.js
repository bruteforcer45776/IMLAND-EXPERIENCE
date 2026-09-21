(function () {
  const root = document.querySelector('.member-news');
  if (!root) return;
  const items = Array.isArray(window.IMLAND_MEMBER_NEWS) ? window.IMLAND_MEMBER_NEWS : [];
  const filters = [...root.querySelectorAll('[data-member-filter]')];
  const labels = { imprese: 'Imprese', professionisti: 'Professionisti', associazioni: 'Associazioni' };
  const clean = value => String(value || '').trim();
  const esc = value => clean(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'})[c]);
  const valid = item => item && clean(item.title) && clean(item.url) && clean(item.category);
  function render(category = 'all') {
    const visible = items.filter(valid).filter(item => category === 'all' || clean(item.category).toLowerCase() === category);
    root.querySelector('.member-news-grid')?.remove();
    const empty = root.querySelector('.member-news-empty');
    if (!visible.length) {
      if (empty) {
        empty.hidden = false;
        const heading = empty.querySelector('h3');
        const copy = empty.querySelector('p');
        if (heading) heading.innerHTML = category === 'all' ? 'Le prossime novità della rete<br>appariranno qui.' : `Nessuna News ${esc(labels[category] || category).toLowerCase()}<br>pubblicata al momento.`;
        if (copy) copy.textContent = category === 'all' ? 'Pubblicheremo solo contenuti inviati e verificati dalla redazione IMLAND.' : `Non ci sono ancora contenuti verificati nella categoria ${(labels[category] || category).toLowerCase()}.`;
      }
      return;
    }
    if (empty) empty.hidden = true;
    const grid = document.createElement('div');
    grid.className = 'member-news-grid';
    grid.innerHTML = visible.map(item => `<article class="member-news-card"><a class="member-news-card-image" href="${esc(item.url)}"${item.external ? ' target="_blank" rel="noreferrer"' : ''} aria-label="Leggi: ${esc(item.title)}">${item.image ? `<img src="${esc(item.image)}" alt="" loading="lazy">` : '<span>IMLAND MEMBER</span>'}</a><div><p>${esc(item.category)}${item.date ? `<time>${esc(item.date)}</time>` : ''}</p><h3>${esc(item.title)}</h3>${item.excerpt ? `<span>${esc(item.excerpt)}</span>` : ''}<a href="${esc(item.url)}"${item.external ? ' target="_blank" rel="noreferrer"' : ''}>Leggi la news <b>→</b></a></div></article>`).join('');
    root.append(grid);
  }
  filters.forEach(button => button.addEventListener('click', () => {
    filters.forEach(item => item.setAttribute('aria-selected', String(item === button)));
    render(button.dataset.memberFilter || 'all');
  }));
  render();
  const details = window.IMLAND_MEMBER_DETAILS || {};
  const total = Object.keys(details).length;
  const mapped = Object.values(details).filter(item => (item.addresses || []).some(address => address.coordinates)).length;
  const note = document.querySelector('.official-map-note');
  if (note && total) note.innerHTML = `<strong>${mapped} Member cartografati su ${total}</strong>. La mappa mostra esclusivamente sedi con coordinate verificate; gli indirizzi ancora in aggiornamento non vengono posizionati in modo presunto.`;

  /* Distribuisce visivamente i loghi che condividono la stessa coordinata,
     mantenendo il punto geografico reale come centro del gruppo. */
  const map = document.querySelector('#imland-live-map');
  const spreadCoincidentMarkers = () => {
    if (!map) return;
    const groups = [];
    map.querySelectorAll('.official-logo-marker').forEach(marker => {
      const values = (marker.style.transform.match(/-?\d+(?:\.\d+)?/g) || []).map(Number);
      const point = { x: values[1] || 0, y: values[2] || 0 };
      let group = groups.find(item => Math.hypot(item.x - point.x, item.y - point.y) < 30);
      if (!group) { group = { ...point, markers: [] }; groups.push(group); }
      group.markers.push(marker);
    });
    groups.forEach(group => group.markers.forEach((marker, index) => {
      const span = marker.querySelector('span');
      if (!span) return;
      const count = group.markers.length;
      const radius = count > 1 ? Math.min(30, 14 + count * 4) : 0;
      const angle = (Math.PI * 2 * index / count) - Math.PI / 2;
      span.style.setProperty('--marker-spread-x', `${Math.cos(angle) * radius}px`);
      span.style.setProperty('--marker-spread-y', `${Math.sin(angle) * radius}px`);
      marker.style.zIndex = String(500 + index);
    }));
  };
  if (map) {
    const observer = new MutationObserver(spreadCoincidentMarkers);
    observer.observe(map, { childList: true, subtree: true });
    spreadCoincidentMarkers();
  }
})();
