import {readFile,writeFile} from 'node:fs/promises';

const ORIGIN='https://www.imlandradio.it';
const OUTPUT=new URL('./content-sync.js',import.meta.url);
const decode=value=>String(value||'').replace(/<!-- -->/g,'').replace(/&#x27;|&#39;|&apos;/g,"'").replace(/&quot;/g,'"').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
const absolute=value=>{try{return new URL(decode(value),ORIGIN).href}catch{return''}};
const external=value=>{const url=absolute(value);try{return new URL(url).origin===ORIGIN?'':url}catch{return''}};
const localDetail=(value,fallback)=>{const url=absolute(value);try{const parsed=new URL(url);if(parsed.origin!==ORIGIN)return'';const slug=parsed.pathname.split('/').filter(Boolean).at(-1);return slug?`${fallback}?slug=${encodeURIComponent(slug)}`:fallback}catch{return fallback}};

async function page(path){
  const response=await fetch(`${ORIGIN}${path}`,{headers:{accept:'text/html','user-agent':'IMLAND local content sync'},signal:AbortSignal.timeout(15000)});
  if(!response.ok)throw new Error(`${path}: HTTP ${response.status}`);
  return response.text();
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
  news=territoryNews(html).slice(0,12);
  members=memberNews(html).slice(0,12);
  availability.news=news.length?'live':'empty';
  availability.memberNews=members.length?'live':'empty';
}catch(error){console.warn(`News IMLAND non disponibili, mantengo il fallback locale: ${error.message}`)}
try{
  events=confirmedEvents(await page('/eventi')).slice(0,24);
  availability.events=events.length?'live':'empty';
}catch(error){console.warn(`Eventi IMLAND non disponibili, mantengo il fallback locale: ${error.message}`)}

const metadataUrl='https://streaming-api.aiir.com/mounts/metadata/history/ylpompusqpate?limit=1';
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
