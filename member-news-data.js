/* Solo contenuti approvati dalla redazione. Se vuoto, resta un empty state onesto. */
window.IMLAND_MEMBER_NEWS = window.IMLAND_MEMBER_NEWS || (window.IMLAND_SYNC_DATA?.memberNews || []).map(item=>({
  ...item,
  excerpt:item.excerpt||item.description||'',
  external:false
}));
