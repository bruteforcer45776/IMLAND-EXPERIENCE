const feeds={
  'Assaggi':'https://podcast.imlandradio.it/podcast/imland-assaggi.xml',
  'Carta Canta':'https://podcast.imlandradio.it/podcast/imland-cartacanta.xml',
  'Casual Nerd Stories':'https://podcast.imlandradio.it/podcast/imland-Casualnerdstories.xml',
  'Grigliata Mista':'https://podcast.imlandradio.it/podcast/imland-grigliata.xml',
  'IMWeekend':'https://podcast.imlandradio.it/podcast/imland-imweekend.xml',
  'Istruzioni per l’uso':'https://podcast.imlandradio.it/podcast/imland-istruzioni.xml',
  'Schema Libero':'https://podcast.imlandradio.it/podcast/imland-schemalibero.xml',
  'Stuzzicaziende':'https://podcast.imlandradio.it/podcast/imland-stuzzicaziende.xml',
  'Terra di Diamanti':'https://podcast.imlandradio.it/podcast/imland-diamanti.xml',
  'TEDx Biella 2025':'https://podcast.imlandradio.it/podcast/imland-tedxbiella2025.xml',
  'Mirabilis — Mente, Cura, Futuro':'https://podcast.imlandradio.it/podcast/imland-Mirabilis.xml'
};
const decode=value=>value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,'$1').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
const take=(xml,tag)=>{const match=xml.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`,'i'));return match?decode(match[1]):''};
const catalog={};
for(const [show,url] of Object.entries(feeds)){
  const response=await fetch(url);
  if(!response.ok)throw new Error(`${show}: HTTP ${response.status}`);
  const xml=await response.text();
  catalog[show]=[...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].map(([,item])=>({
    title:take(item,'title'),
    date:take(item,'pubDate'),
    audio:item.match(/<enclosure[^>]+url=["']([^"']+)["']/i)?.[1]?.replace(/&amp;/g,'&')||''
  })).filter(episode=>episode.title&&episode.audio);
}
await writeFile(new URL('./podcast-episodes.js',import.meta.url),`const podcastEpisodeCatalog=${JSON.stringify(catalog,null,2)};\n`,'utf8');
console.log(`Podcast sincronizzati: ${Object.keys(catalog).length} canali, ${Object.values(catalog).reduce((total,episodes)=>total+episodes.length,0)} episodi.`);
import {writeFile} from 'node:fs/promises';
