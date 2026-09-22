import {readFile,writeFile} from 'node:fs/promises';

const ORIGIN='https://www.imlandradio.it';
const OUTPUT=new URL('./content-sync.js',import.meta.url);
const decode=value=>String(value||'').replace(/<!-- -->/g,'').replace(/&#x27;|&#39;|&apos;/g,"'").replace(/&quot;/g,'"').replace(/&agrave;/g,'à').replace(/&egrave;/g,'è').replace(/&eacute;/g,'é').replace(/&igrave;/g,'ì').replace(/&ograve;/g,'ò').replace(/&ugrave;/g,'ù').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
const absolute=value=>{try{return new URL(decode(value),ORIGIN).href}catch{return''}};
const external=value=>{const url=absolute(value);try{return new URL(url).origin===ORIGIN?'':url}catch{return''}};
const localDetail=(value,fallback)=>{const url=absolute(value);try{const parsed=new URL(url);if(parsed.origin!==ORIGIN)return'';const slug=parsed.pathname.split('/').filter(Boolean).at(-1);return slug?`${fallback}?slug=${encodeURIComponent(slug)}`:fallback}catch{return fallback}};

async function page(path){
  const response=await fetch(`${ORIGIN}${path}`,{headers:{accept:'text/html','user-agent':'IMLAND local content sync'},signal:AbortSignal.timeout(15000)});
  if(!response.ok)throw new Error(`${path}: HTTP ${response.status}`);
  return response.text();
}

const metaValue=(html,key)=>decode(html.match(new RegExp(`<meta[^>]+(?:property|name)="${key}"[^>]+content="([^"]*)"`,'i'))?.[1]||html.match(new RegExp(`<meta[^>]+content="([^"]*)"[^>]+(?:property|name)="${key}"`,'i'))?.[1]);
const negativeNews=/omicid|uccis|morto|morte|incidente|arrest|denunc|aggress|accoltell|droga|spaccio|rapina|furto|violenz|maltratt|abuso|process|indagat|carabinier|polizia|traged|ferit|cadaver|suicid|pusher|chiude|licenzi|bollett.*aument|emergenza|alluvion|sicurezza|politic|partit|governo|\bddl\b|votiam|destra|sinistra|divisiv|antisemit/i;
const positiveNews=/cultur|evento|festival|mostra|musica|teatro|libro|arte|premio|success|inaugur|ricerca|innovaz|impres|solidar|inclus|turismo|territorio|sport|scuol|universit|giovani|volontari|tradizion|enogastr|natura|ambiente|restaur|progetto|eccellen|festa|benessere|comunit|shopping|muse/i;
const isPositive=item=>{const text=`${item?.title||''} ${item?.description||''}`;return !negativeNews.test(text)&&positiveNews.test(text)};
const sourceName=url=>{const host=new URL(url).hostname.replace(/^www\./,'');return ({'ansa.it':'ANSA Piemonte','videoembed.ansa.it':'ANSA Piemonte','newsbiella.it':'NewsBiella','infovercelli24.it':'InfoVercelli24','primanovara.it':'Prima Novara','lopinionista.it':"L'Opinionista"})[host]||host};

async function latestPositiveNews(){
  const indexUrls=[
    'https://www.ansa.it/piemonte/notizie/spettacolo.shtml',
    'https://www.ansa.it/piemonte/notizie/economia.shtml',
    'https://www.newsbiella.it/2026/09/22/tutte-le-notizie.html',
    'https://www.newsbiella.it/2026/09/21/tutte-le-notizie.html',
    'https://www.infovercelli24.it/2026/09/22/tutte-le-notizie.html',
    'https://www.infovercelli24.it/2026/09/21/tutte-le-notizie.html',
    'https://primanovara.it/attualita/'
  ];
  const indexes=await Promise.all(indexUrls.map(async sourceUrl=>({sourceUrl,html:await fetch(sourceUrl,{headers:{accept:'text/html','user-agent':'IMLAND news sync'},signal:AbortSignal.timeout(15000)}).then(response=>response.ok?response.text():'')})));
  const seedUrls=[
    'https://www.ansa.it/piemonte/notizie/2026/09/19/microchirurgia-migliora-autonomia-14enne-dopo-paralisi-cerebrale-infantile_733f761e-a7b4-4582-888d-0cc2d242413c.html',
    'https://videoembed.ansa.it/piemonte/notizie/2026/09/18/lambasciatrice-daustralia-incontra-le-imprese-piemontesi_4d5f1ddc-8ca9-4c8d-bc64-63e6a2d28279.html',
    'https://videoembed.ansa.it/piemonte/notizie/2026/09/18/cna-torino-compie-80-anni-sabato-18-settembre-festa-al-sermig_d1d605b9-dc00-4cbc-a0fd-902b28f0e112.html',
    'https://www.ansa.it/piemonte/notizie/2026/09/12/stati-generali-mab-unesco-il-piemonte-si-candida-a-laboratorio-nazionale_e8e77027-7e11-4844-9f63-1e111c29de56.html',
    'https://www.newsbiella.it/2026/09/16/leggi-notizia/argomenti/music-cafe-1/articolo/shiftwork-festival-buona-la-prima-con-oltre-3500-presenze-foto.html',
    'https://www.newsbiella.it/2026/09/09/leggi-notizia/argomenti/benessere-e-salute/articolo/la-via-del-dono-arriva-a-biella-musica-fotografia-e-solidarieta-a-palazzo-gromo-losa.html',
    'https://www.infovercelli24.it/2026/09/19/leggi-notizia/argomenti/attualita-7/articolo/torna-il-fora-tut-festa-dello-shopping-allaperto.html',
    'https://www.infovercelli24.it/2026/09/12/leggi-notizia/argomenti/attualita-7/articolo/riso-tra-talk-show-cooking-e-cultura-una-giornata-per-vivere-a-vercelli.html',
    'https://www.lopinionista.it/con-una-penna-in-mano-il-libro-di-nicola-gardini-229729.html'
  ];
  const discovered=indexes.flatMap(({sourceUrl,html})=>[...html.matchAll(/href=["']([^"']*(?:\/2026\/09\/|\/attualita\/)[^"'#?]+(?:\.html|\/))["']/gi)].map(match=>{try{return new URL(match[1],sourceUrl).href}catch{return''}})).filter(Boolean);
  const urls=[...new Set([...seedUrls,...discovered])].slice(0,140);
  const items=(await Promise.all(urls.map(async url=>{
    try{
      const html=await fetch(url,{headers:{accept:'text/html','user-agent':'IMLAND news sync'},signal:AbortSignal.timeout(12000)}).then(response=>response.ok?response.text():'');
      const publishedAt=metaValue(html,'article:published_time');
      if(!html||!publishedAt)return null;
      const dateValue=new Date(publishedAt);
      return {source:sourceName(url),area:'Piemonte',date:new Intl.DateTimeFormat('it-IT',{day:'numeric',month:'short',year:'numeric'}).format(dateValue),publishedAt,title:metaValue(html,'og:title').replace(/\s*-\s*Notizie\s*[-|].*$/i,''),description:metaValue(html,'og:description'),image:metaValue(html,'og:image'),url};
    }catch{return null}
  }))).filter(item=>item?.title&&item?.url&&isPositive(item)).sort((a,b)=>new Date(b.publishedAt)-new Date(a.publishedAt));
  const perDay=new Map(),perDaySource=new Map();
  const perSource=new Map();
  return items.filter(item=>{const day=item.publishedAt.slice(0,10),dayCount=perDay.get(day)||0,sourceCount=perSource.get(item.source)||0,daySourceKey=`${day}|${item.source}`,daySourceCount=perDaySource.get(daySourceKey)||0;if(dayCount>=5||sourceCount>=8||daySourceCount>=2)return false;perDay.set(day,dayCount+1);perSource.set(item.source,sourceCount+1);perDaySource.set(daySourceKey,daySourceCount+1);return true}).slice(0,25);
}

async function previousPayload(){
  try{
    const source=await readFile(OUTPUT,'utf8');
    const json=source.match(/^window\.IMLAND_SYNC_DATA=([\s\S]*);\s*$/)?.[1];
    return json?JSON.parse(json):{};
  }catch{return{}}
}

function territoryNews(html){
  const items=[];
  for(const match of html.matchAll(/<article class="group flex h-full[\s\S]*?<\/article>/gi)){
    const article=match[0];
    const links=[...article.matchAll(/<a[^>]+href="([^"]+)"/gi)].map(item=>item[1]);
    const time=article.match(/<time[^>]+dateTime="([^"]+)"[^>]*>([\s\S]*?)<\/time>/i);
    const title=decode(article.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i)?.[1]);
    const url=links.map(external).find(Boolean);
    if(!title||!url||!time)continue;
    const meta=[...article.matchAll(/<span(?:\s[^>]*)?>([\s\S]*?)<\/span>/gi)].map(item=>decode(item[1])).filter(value=>value&&value!=='·');
    items.push({source:meta[0]||'Fonte originale',area:meta[1]||'Territorio',date:decode(time[2]),publishedAt:time[1],title,description:decode(article.match(/<p class="mt-2[^>]*>([\s\S]*?)<\/p>/i)?.[1]),image:absolute(article.match(/<img[^>]+src="([^"]+)"/i)?.[1]),url});
  }
  return items;
}

function confirmedEvents(html){
  const items=[];
  for(const match of html.matchAll(/<article(?:\s[^>]*)?>([\s\S]*?)<\/article>/gi)){
    const article=match[0];
    const time=article.match(/<time[^>]*dateTime="([^"]+)"[^>]*>([\s\S]*?)<\/time>/i);
    const title=decode(article.match(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/i)?.[1]);
    if(!time||!title)continue;
    const paragraphs=[...article.matchAll(/<p(?:\s[^>]*)?>([\s\S]*?)<\/p>/gi)].map(item=>decode(item[1])).filter(Boolean);
    const href=article.match(/<a[^>]+href="([^"]+)"/i)?.[1]||'';
    items.push({title,date:decode(time[2]),startsAt:time[1],location:paragraphs[0]||'',description:paragraphs.slice(1).join(' '),image:absolute(article.match(/<img[^>]+src="([^"]+)"/i)?.[1]),url:localDetail(href,'eventi.html')});
  }
  return items.filter((item,index,array)=>array.findIndex(other=>other.title===item.title&&other.startsAt===item.startsAt)===index);
}

function memberNews(html){
  const heading=html.search(/NEWS DEI MEMBER|News dei Member/i);
  if(heading<0)return[];
  const start=Math.max(html.lastIndexOf('<section',heading),heading);
  const end=html.indexOf('</section>',heading);
  const section=html.slice(start,end>heading?end+10:heading+30000);
  const items=[];
  for(const match of section.matchAll(/<article(?:\s[^>]*)?>([\s\S]*?)<\/article>/gi)){
    const article=match[0];
    const title=decode(article.match(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/i)?.[1]);
    const href=article.match(/<a[^>]+href="([^"]+)"/i)?.[1]||'';
    if(!title||!/news\//i.test(href))continue;
    const time=article.match(/<time[^>]*(?:dateTime="([^"]+)")?[^>]*>([\s\S]*?)<\/time>/i);
    items.push({member:decode(article.match(/<(?:span|small)[^>]*>([\s\S]*?)<\/(?:span|small)>/i)?.[1])||'IMLAND Member',title,description:decode(article.match(/<p(?:\s[^>]*)?>([\s\S]*?)<\/p>/i)?.[1]),date:decode(time?.[2]),publishedAt:time?.[1]||'',image:absolute(article.match(/<img[^>]+src="([^"]+)"/i)?.[1]),url:localDetail(href,'news-member.html')});
  }
  return items.filter((item,index,array)=>array.findIndex(other=>other.title===item.title)===index);
}

const previous=await previousPayload();
let news=previous.news||[],events=previous.events||[],members=previous.memberNews||[];
const availability={news:'fallback',events:'fallback',memberNews:'fallback'};
try{
  const html=await page('/news');
  news=territoryNews(html).filter(isPositive).slice(0,18);
  members=memberNews(html).slice(0,12);
  availability.news=news.length?'live':'empty';
  availability.memberNews=members.length?'live':'empty';
}catch(error){console.warn(`News IMLAND non disponibili, mantengo il fallback locale: ${error.message}`)}
try{
  const latest=await latestPositiveNews();
  if(latest.length){const merged=[...latest,...news].filter((item,index,array)=>array.findIndex(other=>other.url===item.url)===index).filter(isPositive).sort((a,b)=>new Date(b.publishedAt)-new Date(a.publishedAt));const perDay=new Map(),perSource=new Map(),perDaySource=new Map();news=merged.filter(item=>{const day=String(item.publishedAt||'').slice(0,10),dayCount=perDay.get(day)||0,sourceCount=perSource.get(item.source)||0,daySourceKey=`${day}|${item.source}`,daySourceCount=perDaySource.get(daySourceKey)||0;if(dayCount>=5||sourceCount>=8||daySourceCount>=2)return false;perDay.set(day,dayCount+1);perSource.set(item.source,sourceCount+1);perDaySource.set(daySourceKey,daySourceCount+1);return true}).slice(0,25);availability.news='live'}
}catch(error){console.warn(`Aggiornamento rassegna positiva non disponibile: ${error.message}`)}
try{
  events=confirmedEvents(await page('/eventi')).slice(0,24);
  availability.events=events.length?'live':'empty';
}catch(error){console.warn(`Eventi IMLAND non disponibili, mantengo il fallback locale: ${error.message}`)}

const metadataUrl='https://streaming-api.aiir.com/mounts/metadata/history/ylpompusqpatv?limit=1';
let radio=previous.radio??null;
try{
  const response=await fetch(metadataUrl,{signal:AbortSignal.timeout(10000)});
  const history=response.ok?await response.json():[];
  const current=Array.isArray(history)?history[0]:null;
  if(current?.title){const [title,...artist]=String(current.title).split(' - ');radio={title:title.trim(),artist:artist.join(' - ').trim()||'IMLAND Radio',listeners:current.listeners??null,timestamp:current.timestamp??Date.now()}}
}catch(error){console.warn(`Metadati radio non disponibili: ${error.message}`)}

const payload={generatedAt:new Date().toISOString(),news,events,memberNews:members,radio,availability,sources:{news:`${ORIGIN}/news`,events:`${ORIGIN}/eventi`,memberNews:`${ORIGIN}/news`,radio:metadataUrl}};
await writeFile(OUTPUT,`window.IMLAND_SYNC_DATA=${JSON.stringify(payload,null,2)};\n`,'utf8');
console.log(`Contenuti sincronizzati: ${news.length} news territorio; ${events.length} eventi confermati; ${members.length} News Member; radio ${radio?'aggiornata/fallback':'senza metadati disponibili'}.`);
