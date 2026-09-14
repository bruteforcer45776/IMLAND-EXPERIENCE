delete from public.news_article_sources where article_id in (select id from public.news_articles);
delete from public.news_articles;

with data(title, slug, subtitle, summary, body, category_slug, scope, province, cover, cover_alt, published_at, source_name, source_url, original_title) as (
  values
  (
    'La Pedemontana attira nuovi investimenti.',
    'pedemontana-nuovi-investimenti-imprese',
    'Alcune grandi aziende guardano al territorio tra Biellese, Valsesia e Vercellese.',
    'Il corridoio della Pedemontana torna al centro dell''interesse industriale: secondo Notizia Oggi diverse grandi aziende stanno valutando insediamenti e ampliamenti nell''area.',
    E'Il corridoio della Pedemontana torna a essere osservato con attenzione dal mondo produttivo.\nSecondo quanto riportato da Notizia Oggi, alcune grandi aziende stanno valutando insediamenti e ampliamenti lungo l''asse che collega Biellese, Valsesia e Vercellese.\n\nIl tema centrale resta l''accessibilità: la nuova viabilità e i collegamenti verso le autostrade rendono l''area più competitiva rispetto agli anni scorsi.\nAccanto alle infrastrutture pesano la disponibilità di aree industriali e la presenza di una filiera meccanica e tessile già radicata.\n\nPer il territorio si tratta di un segnale importante in termini di occupazione e di servizi.\nRestano però da sciogliere i nodi legati ai tempi delle opere e alla formazione di personale qualificato.',
    'economia', 'piemonte', 'Vercelli',
    '/__l5e/assets-v1/c535edd5-c3ab-4cc2-9dbf-f1b9caafa233/news-pedemontana.webp',
    'Area industriale tra le colline della Pedemontana piemontese',
    '2026-08-30 08:30:00+02',
    'Notizia Oggi', 'https://notiziaoggi.it/feed/', 'La Pedemontana attira investimenti: alcune grandi aziende guardano al territorio'
  ),
  (
    '«Sono un poliziotto»: anziana derubata in casa.',
    'truffa-finto-poliziotto-anziana-derubata',
    'Denaro e gioielli portati via con la tecnica del finto agente.',
    'Una donna anziana è stata raggirata da un uomo che si è presentato come poliziotto e le ha chiesto di consegnare denaro e gioielli.',
    E'Ancora una truffa messa a segno con la tecnica del finto poliziotto.\nUna donna anziana si è vista portare via denaro e gioielli da un uomo che si è presentato come agente in servizio, chiedendo di mettere i valori «al sicuro».\n\nLo schema è sempre lo stesso: una telefonata o un contatto diretto, un tono autorevole, la fretta.\nLa vittima viene convinta che i familiari siano in pericolo o coinvolti in un''indagine e consegna tutto ciò che ha in casa.\n\nLe forze dell''ordine ricordano che nessun agente chiede denaro o gioielli a domicilio.\nIn caso di dubbio la regola resta una sola: chiudere la porta e chiamare il 112.',
    'cronaca', 'piemonte', 'Vercelli',
    '/__l5e/assets-v1/d646e198-6828-448f-b397-811c2a300190/news-truffa.webp',
    'Mani di una donna anziana su un telefono fisso in casa',
    '2026-08-30 09:10:00+02',
    'Notizia Oggi', 'https://notiziaoggi.it/feed/', '«Sono un poliziotto, deve consegnarci i soldi»: anziana derubata di denaro e gioielli'
  ),
  (
    'Serravalle piange Luciano Vidale.',
    'serravalle-luciano-vidale-artigiano',
    'Il paese saluta un artigiano conosciuto da tutti.',
    'Serravalle si è raccolta intorno alla famiglia di Luciano Vidale, artigiano molto conosciuto in paese e ricordato per la sua disponibilità.',
    E'Serravalle si è fermata per salutare Luciano Vidale.\nArtigiano conosciuto da generazioni di famiglie, era una di quelle presenze che tengono insieme la vita di un paese.\n\nChi lo ha conosciuto ne ricorda la disponibilità e la capacità di risolvere problemi con poche parole.\nNel racconto di Notizia Oggi emerge il ritratto di un uomo legato al lavoro manuale e alla comunità.\n\nLa notizia ha attraversato rapidamente il paese e i gruppi del volontariato locale.\nRestano il cordoglio della famiglia e il ricordo di una bottega che per anni è stata un punto di riferimento.',
    'territorio', 'piemonte', 'Vercelli',
    '/__l5e/assets-v1/624f01cd-0e6d-4f0c-adeb-93ecdf8a74ba/news-serravalle.webp',
    'Piazza di un piccolo paese piemontese al crepuscolo',
    '2026-08-30 10:05:00+02',
    'Notizia Oggi', 'https://notiziaoggi.it/feed/', 'Serravalle piange Luciano Vidale, artigiano dal cuore grande'
  ),
  (
    'Vacanza in Valsesia finita in ospedale.',
    'valsesia-91enne-vacanza-ospedale',
    'Un uomo di 91 anni soccorso durante il soggiorno in montagna.',
    'Il soggiorno estivo in Valsesia si è trasformato in un''emergenza sanitaria per un uomo di 91 anni, soccorso e trasportato in ospedale.',
    E'La vacanza in Valsesia si è trasformata in un''emergenza per un uomo di 91 anni.\nSecondo la ricostruzione di Notizia Oggi, l''anziano ha avuto bisogno di soccorso durante il soggiorno in montagna ed è stato trasportato in ospedale.\n\nLa vicenda riporta l''attenzione sulla rete sanitaria delle valli, soprattutto nei mesi di maggiore afflusso turistico.\nDistanze, tempi di percorrenza e disponibilità dei mezzi restano nodi noti per i comuni più piccoli.\n\nPer i residenti la richiesta è sempre la stessa: presidi stabili e continuità dei servizi.\nLa stagione estiva, con migliaia di presenze in più, mette il sistema alla prova ogni anno.',
    'sanita', 'piemonte', 'Vercelli',
    '/__l5e/assets-v1/ea067c44-faec-4e58-9130-3a5a4821f7b9/news-ospedale.webp',
    'Ingresso del pronto soccorso di un ospedale con ambulanza',
    '2026-08-30 11:00:00+02',
    'Notizia Oggi', 'https://notiziaoggi.it/feed/', 'La vacanza in Valsesia finisce in un incubo per un 91enne'
  ),
  (
    'Malore in allenamento, muore a 32 anni.',
    'malore-allenamento-capitano-casalino',
    'Il capitano del Casalino si è sentito male durante la seduta di allenamento.',
    'Il capitano del Casalino è morto a 32 anni dopo un malore avvenuto durante l''allenamento: sgomento in tutto il calcio dilettantistico locale.',
    E'Il calcio dilettantistico del territorio si è fermato davanti a una notizia che nessuno voleva leggere.\nIl capitano del Casalino è morto a 32 anni dopo un malore avvenuto durante una seduta di allenamento.\n\nI compagni di squadra e la società hanno espresso il proprio dolore, ricordandone il ruolo di guida nello spogliatoio.\nLa comunità sportiva si è stretta intorno alla famiglia nelle ore successive.\n\nEpisodi come questo riaprono il tema della prevenzione e dei controlli cardiologici nello sport amatoriale.\nResta il vuoto lasciato da un giocatore che era diventato un simbolo per la squadra.',
    'sport', 'piemonte', 'Novara',
    '/__l5e/assets-v1/7f451766-8620-4114-a903-9b20cb7a52f7/news-calcio.webp',
    'Campo da calcio di paese al tramonto con fascia da capitano',
    '2026-08-30 12:15:00+02',
    'Notizia Oggi', 'https://notiziaoggi.it/feed/', 'Malore durante l''allenamento, muore a 32 anni il capitano del Casalino'
  ),
  (
    'Islanda: il 52,8% dice no all''Unione europea.',
    'islanda-referendum-no-negoziati-ue',
    'Il Sì prevale soltanto nei due collegi della capitale Reykjavík.',
    'Nel referendum islandese il 52,8% degli elettori ha respinto l''avvio dei negoziati di adesione all''Unione europea. Il Sì vince solo a Reykjavík.',
    E'L''Islanda ha detto no all''apertura dei negoziati di adesione all''Unione europea.\nSecondo i dati riportati dall''ANSA, il fronte contrario si è fermato al 52,8% dei voti, mentre il Sì ha prevalso soltanto nei due collegi della capitale Reykjavík.\n\nLa premier Kristrún ha commentato con soddisfazione la partecipazione al voto, invitando a rispettare l''esito delle urne.\nIl risultato conferma la frattura tra l''area urbana e il resto del Paese, storicamente più legato a pesca e sovranità sulle risorse.\n\nIl voto è già diventato materia di dibattito politico europeo.\nA destra, Marine Le Pen ha letto il risultato come la prova che «un''altra Europa è possibile».',
    'nazionale', 'italia', null,
    '/__l5e/assets-v1/c12d145c-84de-4549-9c53-579a70108bd3/news-islanda.webp',
    'Bandiera dell''Unione europea davanti a un edificio pubblico a Reykjavík',
    '2026-08-30 11:38:00+02',
    'ANSA', 'https://www.ansa.it/sito/notizie/mondo/europa/2026/08/30/referendum-islanda-il-528-dice-no-ai-negoziati-con-lue_f75a5ea5-c4b9-4063-acf8-5c4c73fbfcdd.html', 'Referendum Islanda, il 52,8% dice no ai negoziati con l''Ue'
  ),
  (
    'Mosca minaccia l''energia ucraina.',
    'mosca-attacchi-massicci-energia-ucraina',
    'I vertici russi annunciano raid contro i settori energetici, «in risposta ai siti civili colpiti».',
    'Secondo i vertici militari russi Mosca è pronta a sferrare attacchi massicci contro il settore energetico ucraino, presentati come risposta a raid contro siti civili russi.',
    E'Nuova escalation nel conflitto in Ucraina.\nSecondo quanto riferito dall''ANSA, alti vertici russi annunciano di essere pronti a sferrare attacchi massicci contro i settori energetici ucraini, presentandoli come risposta ai raid contro siti civili russi.\n\nLa minaccia riguarda infrastrutture già colpite negli inverni precedenti: centrali, sottostazioni e reti di distribuzione.\nPer la popolazione significa il rischio concreto di nuovi blackout prolungati.\n\nSul piano diplomatico resta aperta la partita del dialogo.\nMonsignor Gallagher ha ribadito che, per risolvere la guerra, la strada non può essere l''isolamento totale di Mosca.',
    'nazionale', 'italia', null,
    '/__l5e/assets-v1/9b88f7a4-f56e-4435-bb38-b6292eb5b48d/news-ucraina.webp',
    'Tralicci e sottostazione elettrica al crepuscolo',
    '2026-08-30 10:22:00+02',
    'ANSA', 'https://www.ansa.it/sito/notizie/mondo/europa/2026/08/30/mosca-pronti-a-sferrare-massicci-attacchi-contro-settori-energitici-ucraini_9e4df8fd-3e41-4cef-a6bd-791e81ccfb84.html', 'Mosca, pronti a sferrare massicci attacchi contro settori energetici ucraini'
  ),
  (
    'Il Giappone rientra con i Tomahawk a bordo.',
    'giappone-cacciatorpediniere-tomahawk',
    'Svolta conservatrice: Tokyo si dota di capacità di colpire basi nemiche.',
    'Un cacciatorpediniere giapponese è rientrato in porto con missili Tomahawk statunitensi a bordo: Tokyo acquisisce così capacità di attacco a distanza.',
    E'Tokyo compie un passo che cambia la postura militare del Paese.\nUn cacciatorpediniere della Marina giapponese è rientrato in porto con missili Tomahawk statunitensi a bordo, secondo quanto riportato dall''ANSA.\n\nLa dotazione consente al Giappone di colpire basi nemiche a distanza, superando una linea rimasta a lungo intoccabile nella dottrina difensiva del dopoguerra.\nLa decisione si inserisce in una più ampia svolta conservatrice sulla sicurezza nazionale.\n\nL''iniziativa va letta nel contesto delle tensioni regionali con Cina e Corea del Nord.\nPer i Paesi vicini si tratta di un cambiamento destinato a ridefinire gli equilibri dell''Indo-Pacifico.',
    'nazionale', 'italia', null,
    '/__l5e/assets-v1/60d708b1-6a29-4848-98f0-141312b4bced/news-giappone.webp',
    'Cacciatorpediniere in ingresso in un porto all''alba',
    '2026-08-30 11:45:00+02',
    'ANSA', 'https://www.ansa.it/sito/notizie/mondo/asia/2026/08/30/giappone-cacciatorpediniere-rientra-con-i-tomahawk-usa-a-bordo_cefd8ac3-f3e0-4ce6-95d6-bae0f7fc3b91.html', 'Giappone, cacciatorpediniere rientra con i Tomahawk Usa a bordo'
  ),
  (
    'Traghetto affondato: sette vittime.',
    'traghetto-affondato-cipro-nord-vittime',
    'Il primo bilancio parla di 23 dispersi e 237 persone tratte in salvo.',
    'Un traghetto è affondato al largo di Cipro: il primo bilancio indica sette morti, 23 dispersi e 237 persone salvate dai soccorritori.',
    E'Tragedia in mare al largo di Cipro.\nUn traghetto è affondato e il primo bilancio, riferito dall''ANSA, parla di sette morti, 23 dispersi e 237 persone tratte in salvo.\n\nI numeri sono stati diffusi dal premier della autoproclamata Repubblica Turca di Cipro del Nord, mentre l''ambasciatore turco a Nicosia confermava le prime vittime.\nLe operazioni di ricerca sono proseguite per ore con mezzi navali e aerei.\n\nResta da chiarire la dinamica dell''affondamento e il numero esatto delle persone a bordo.\nLe autorità hanno annunciato accertamenti sulle condizioni dell''imbarcazione e sulla gestione dell''emergenza.',
    'nazionale', 'italia', null,
    '/__l5e/assets-v1/fe048557-f6f8-4adb-92e0-5c2f9d362dca/news-traghetto.webp',
    'Mezzi di soccorso in mare durante un''operazione di ricerca',
    '2026-08-30 16:03:00+02',
    'ANSA', 'https://www.ansa.it/sito/notizie/mondo/europa/2026/08/30/traghetto-affondato-7-morti-23-dispersi-e-237-salvati_7da41933-052f-4f9b-b5e9-0b67754afb69.html', 'Traghetto affondato, 7 morti, 23 dispersi e 237 salvati'
  ),
  (
    'Gaza: bambino di tre anni ucciso in un raid.',
    'gaza-raid-idf-bambino-tre-anni',
    'Secondo i media locali nell''attacco sono morti anche due adulti.',
    'I media di Gaza riferiscono la morte di un bambino di tre anni in un raid dell''esercito israeliano: nell''attacco hanno perso la vita anche due adulti.',
    E'Nuove vittime civili nella Striscia di Gaza.\nSecondo i media locali citati dall''ANSA, un bambino di tre anni è stato ucciso in un raid dell''esercito israeliano; nell''attacco sono morte anche due persone adulte.\n\nLe notizie provenienti dall''area restano difficili da verificare in modo indipendente, come segnalano le stesse agenzie internazionali.\nLe organizzazioni umanitarie continuano a denunciare condizioni sanitarie e alimentari critiche per la popolazione.\n\nSul piano diplomatico la pressione per una tregua stabile non si è fermata.\nOgni nuovo episodio, però, allontana le possibilità di un accordo di lungo periodo.',
    'nazionale', 'italia', null,
    '/__l5e/assets-v1/e0e5a8bb-ca70-4419-9185-68f9dbddc627/news-gaza.webp',
    'Edifici distrutti e macerie in una città del Medio Oriente',
    '2026-08-30 14:41:00+02',
    'ANSA', 'https://www.ansa.it/sito/notizie/mondo/mediooriente/2026/08/30/media-gaza-un-bambino-di-tre-anni-ucciso-in-un-raid-dellidf_6dc5eb65-7359-4fbc-adb0-6737dcaea42c.html', 'Media Gaza, un bambino di tre anni ucciso in un raid dell''Idf'
  )
), inserted as (
  insert into public.news_articles (
    title, slug, subtitle, summary, body, category_slug, geographic_scope, province,
    relevance_score, credibility_score, cover_image_url, cover_image_alt,
    status, published_at, generated_by_ai, verification_status, seo_title, seo_description
  )
  select d.title, d.slug, d.subtitle, d.summary, d.body, d.category_slug, d.scope::news_coverage_scope, d.province,
    82, 90, d.cover, d.cover_alt,
    'published'::news_article_status, d.published_at::timestamptz, true, 'verified'::news_verification_status,
    d.title, d.summary
  from data d
  returning id, slug
)
insert into public.news_article_sources (article_id, source_name, original_title, original_url, published_at)
select i.id, d.source_name, d.original_title, d.source_url, d.published_at::timestamptz
from inserted i join data d on d.slug = i.slug;