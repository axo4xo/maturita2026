# 19 • Webové aplikace

> SPA, MPA, request-response, HTTP(S), návratové kódy, metody HTTP
> 

# Webová stránka vs webová aplikace

Hranice je rozmazaná, ale principiální rozdíl je v tom, **co uživatel s obsahem dělá**:

|  | Webová stránka | Webová aplikace |
| --- | --- | --- |
| **Účel** | Zobrazení informací | Vykonávání úkolů |
| **Interaktivita** | Minimální (formuláře, odkazy) | Vysoká (přihlášení, správa dat, real-time) |
| **Obsah** | Převážně statický | Dynamický, personalizovaný |
| **Stav** | Pomíjivý | Persistentní (user profile, data) |
| **Příklad** | Blog, zpravodajský portál, dokumentace | Gmail, Notion, Figma, e-shop |

V praxi nejsou ostré hranice: zpravodajský web má komentáře (kus aplikace), aplikace má marketingové stránky (kus webu).

# **Architektury webových aplikací**

### CSR: Client-Side Rendering (= klasická SPA)

Server pošle prakticky **prázdný HTML s odkazem na JS bundle**. Veškerý rendering probíhá v prohlížeči poté, co se stáhne a spustí JavaScript.

![image.png](19%20%E2%80%A2%20Webov%C3%A9%20aplikace/image.png)

| Plusy | Mínusy |
| --- | --- |
| Plynulé navigace (žádné refreshe) | Pomalé první načítání |
| Snadné offline funkce | Horší SEO bez prerendering |
| Klasická SPA architektura | Vyžaduje JS, slabší zařízení trpí |

Příklad: čistá React/Vue/Angular SPA bez SSR.

### SSR: Server-Side Rendering

Server vyrenderuje **kompletní HTML** a pošle ho klientovi. JavaScript se pak "připne" k existujícímu DOMu (proces zvaný **hydration**).

![image.png](19%20%E2%80%A2%20Webov%C3%A9%20aplikace/image%201.png)

| Plusy | Mínusy |
| --- | --- |
| Rychlé první načtení | Vyšší zátěž serveru |
| Excelentní SEO | Komplikovanější deploy |
| Funguje i bez JS | "Hydration mismatch" debugování |

Příklad: Next.js (App Router s `getServerSideProps`), Remix, Nuxt.

### SSG: Static Site Generation

HTML se vygeneruje **při buildu**, ne při requestu. Server vlastně nepotřebuješ: výsledné soubory si CDN obslouží.

1. Build time: pro každou URL se vygeneruje HTML
2. Deploy: HTML soubory na CDN
3. Request: CDN obslouží statický soubor (rychlost světla)

| Plusy | Mínusy |
| --- | --- |
| Nejrychlejší možný hosting | Obsah jen z build time |
| Žádný server runtime | Nehodí se pro velmi dynamický obsah |
| Levný hosting (CDN) | Rebuild při změně obsahu |

Příklad: Astro, Next.js (`getStaticProps`), Hugo, Eleventy, dokumentace, marketing weby.

### ISR: Incremental Static Regeneration

Hybrid SSG a SSR: stránky se vygenerují staticky, ale **revalidují se v určitém intervalu** nebo on-demand. Nejlepší z obou světů.

1. Build: vygenerovaná statická stránka
2. Request: CDN obslouží statickou verzi (rychlé)
3. Po X minutách: server v pozadí vygeneruje novou verzi
4. Další request: dostane novou verzi

Příklad: Next.js s `revalidate: 60`, e-shopy s občasnou změnou katalogu.

### **MPA: Multi-Page Application (tradiční model)**

Každá akce uživatele (klik na odkaz, submit formuláře) odešle **nový HTTP request** a server vrátí **celou novou HTML stránku**. Žádný JavaScript framework není potřeba.

1. Uživatel klikne na odkaz
2. Prohlížeč pošle HTTP request
3. Server vygeneruje a vrátí HTML
4. Prohlížeč nahradí celou stránku

| Plusy | Mínusy |
| --- | --- |
| Jednoduchá architektura | Pomalejší přechody mezi stránkami |
| Excelentní SEO out of the box | Mírně horší UX (refresh, ztráta scroll pozice) |
| Funguje bez JS | Náročnější UI interakce |
| Standardní formuláře, browser history |  |

Příklad: PHP (Laravel, Symfony, WordPress), Ruby on Rails, ASP.NET MVC, Django.

### Srovnání všech architektur

|  | First load | Navigace | SEO | Server zátěž |
| --- | --- | --- | --- | --- |
| **CSR (SPA)** | Pomalý | Bleskově rychlá | Špatné bez prerender | Nízká (jen API) |
| **SSR** | Rychlý | Záleží na implementaci | Excelentní | Vyšší |
| **SSG** | Nejrychlejší | Bleskově rychlá | Excelentní | Nulová |
| **ISR** | Rychlý | Bleskově rychlá | Excelentní | Nízká |
| **MPA** | Rychlý | Pomalá (full refresh) | Excelentní | Středně vysoká |

## Request-Response model

Základní způsob komunikace mezi **klientem** (typicky prohlížeč) a **serverem**. Klient pošle **request**, server vrátí **response**.

**Struktura HTTP requestu**

```bash
POST /api/users HTTP/1.1
Host: api.studybuddy.minjiya.com
Content-Type: application/json
Authorization: Bearer eyJhbGc...
Accept: application/json
User-Agent: Mozilla/5.0 ...

{
  "name": "axo",
  "email": "axo@ax4.cz"
}
```

| Část | Popis | Příklad |
| --- | --- | --- |
| **Start line** | Metoda + URL + verze | `POST /api/users HTTP/1.1` |
| **Headers** | Metadata (typ, autentizace, jazyk) | `Content-Type: application/json` |
| **Empty line** | Oddělí hlavičky od těla | (jeden CRLF) |
| **Body** | Data (u POST/PUT/PATCH) | JSON, form data, soubor |

**Struktura HTTP response**

```bash
HTTP/1.1 201 Created
Content-Type: application/json
Location: /api/users/42
Set-Cookie: session=abc123; HttpOnly; Secure

{
  "id": 42,
  "name": "axo",
  "email": "axo@ax4.cz"
}
```

| Část | Popis |
| --- | --- |
| **Status line** | Verze + stavový kód + zpráva |
| **Headers** | Metadata odpovědi |
| **Body** | Vrácená data (HTML, JSON, obrázek, ...) |

### Důležité hlavičky

| Request hlavička | Co dělá |
| --- | --- |
| `Host` | Doména, na kterou jde request (povinná u HTTP/1.1) |
| `Content-Type` | Typ dat v těle requestu |
| `Accept` | Jaký typ odpovědi klient akceptuje |
| `Authorization` | Autentizační údaje (`Bearer token`, `Basic base64`) |
| `User-Agent` | Identifikace klienta (prohlížeč, OS) |
| `Cookie` | Cookies poslané klientem |
| `Referer` | URL stránky, ze které request pochází |

| Response hlavička | Co dělá |
| --- | --- |
| `Content-Type` | Typ dat v těle odpovědi |
| `Content-Length` | Délka těla v bytech |
| `Set-Cookie` | Nastavení cookies u klienta |
| `Location` | URL pro přesměrování (3xx) nebo nově vytvořený zdroj (201) |
| `Cache-Control` | Pravidla cachování |
| `Access-Control-Allow-Origin` | CORS, kdo smí číst odpověď |

# HTTP protokol

**HTTP** *(HyperText Transfer Protocol)* je textový protokol pro komunikaci klient-server, postavený nad **TCP**. **HTTPS** je HTTP přes TLS šifrování.

### Verze HTTP

| Verze | Rok | Klíčové vlastnosti |
| --- | --- | --- |
| **HTTP/0.9** | 1991 | Jen GET, jen HTML, žádné hlavičky |
| **HTTP/1.0** | 1996 | Hlavičky, status kódy, různé typy obsahu |
| **HTTP/1.1** | 1997 | Persistent connections (keep-alive), chunked encoding, host header |
| **HTTP/2** | 2015 | Binární, multiplexing, komprese hlaviček (HPACK), server push |
| **HTTP/3** | 2022 | Postavený na **QUIC** místo TCP (běží na UDP), rychlejší handshake |

### Bezstavovost (stateless)

HTTP je **bezstavový**: server si standardně **nepamatuje** předchozí requesty. Každý request se chová jako první kontakt.

Stav (kdo je přihlášen, co má v košíku) se řeší přes:

- **Cookies**: malé textové soubory, klient je posílá s každým requestem na danou doménu
- **Session ID**: server si pamatuje stav v paměti/DB, klient drží jen ID v cookie
- **JWT tokeny**: klient drží podepsaný token s informacemi, server jen ověří podpis
- **LocalStorage / SessionStorage**: trvalé úložiště v prohlížeči

### HTTP vs HTTPS

|  | HTTP | HTTPS |
| --- | --- | --- |
| **Port** | 80 | 443 |
| **Šifrování** | Žádné | TLS |
| **Certifikát** | Není potřeba | Povinný (od CA) |
| **Bezpečnost** | Žádná | Vysoká |
| **SEO ranking** | Hendikep | Plus |

### Certifikáty

Veřejné weby používají certifikáty od **Certifikační autority (CA)**:

| CA | Specifikum |
| --- | --- |
| **Let's Encrypt** | Zdarma, automatická obnova, 90denní platnost |
| **DigiCert, Sectigo** | Placené, často s vyšší úrovní validace |
| **Cloudflare** | Zdarma, automatické přes jejich proxy |

# HTTP metody

| Metoda | Účel | Má tělo? | Bezpečná? | Idempotentní? |
| --- | --- | --- | --- | --- |
| **GET** | Získat zdroj | Ne | Ano | Ano |
| **POST** | Vytvořit nový záznam | Ano | Ne | **Ne** |
| **PUT** | Nahradit celý zdroj | Ano | Ne | Ano |
| **PATCH** | Částečná úprava | Ano | Ne | **Ne** (obecně) |
| **DELETE** | Smazat zdroj | Volitelně | Ne | Ano |
| **HEAD** | Jako GET, ale jen hlavičky | Ne | Ano | Ano |
| **OPTIONS** | Zjistit dostupné metody | Ne | Ano | Ano |

### Bezpečnost vs idempotence

| Pojem | Definice | Příklad |
| --- | --- | --- |
| **Bezpečná** (safe) | Nemění stav serveru | GET vrátí seznam, nic se neuloží |
| **Idempotentní** | Opakované volání má stejný výsledek | DELETE /users/5 opakovaně: smazaný uživatel zůstane smazaný |

### REST CRUD mapping

```bash
GET    /users         → seznam uživatelů
GET    /users/1       → detail uživatele
POST   /users         → vytvoření nového uživatele
PUT    /users/1       → nahrazení uživatele 1 (celý objekt)
PATCH  /users/1       → úprava uživatele 1 (jen poslané fieldy)
DELETE /users/1       → smazání uživatele 1
```

### POST vs PUT vs PATCH (klasická matoucí trojka)

```bash
POST /users
{ "name": "Axo", "email": "..." }
→ Vytvoří nového uživatele, server přidělí ID

PUT /users/42
{ "name": "Axo", "email": "...", "role": "admin" }
→ Nahradí celého uživatele 42 (chybějící fieldy se vynulují)

PATCH /users/42
{ "role": "admin" }
→ Změní jen role, ostatní fieldy zůstanou
```

# HTTP stavové kódy

Třímístné číslo, které říká, **jak request dopadl**.

| Skupina | Rozsah | Význam |
| --- | --- | --- |
| **1xx** | 100-199 | Informační (zřídka v praxi) |
| **2xx** | 200-299 | Úspěch |
| **3xx** | 300-399 | Přesměrování |
| **4xx** | 400-499 | Chyba klienta |
| **5xx** | 500-599 | Chyba serveru |

### Nejdůležitější kódy

### 2xx (Úspěch)

| Kód | Význam |
| --- | --- |
| **200 OK** | Vše proběhlo, odpověď obsahuje data |
| **201 Created** | Záznam byl úspěšně vytvořen (typicky po POST), `Location` header obsahuje URL |
| **202 Accepted** | Request přijat, ale ještě se zpracovává (async operace) |
| **204 No Content** |  |

### 3xx (Přesměrování)

| Kód | Význam |
| --- | --- |
| **301 Moved Permanently** | Trvalé přesměrování, prohlížeč si pamatuje |
| **302 Found** | Dočasné přesměrování |
| **304 Not Modified** | Obsah se nezměnil (cache stále platí), nemusí stahovat znovu |
| **307 Temporary Redirect** | Jako 302, ale zachovává HTTP metodu |
| **308 Permanent Redirect** | Jako 301, ale zachovává HTTP metodu |

### 4xx (Chyba klienta)

| Kód | Význam |
| --- | --- |
| **400 Bad Request** | Špatně formulovaný request (chybný JSON, validace) |
| **401 Unauthorized** | Není přihlášen *(zavádějící název, mělo být "Unauthenticated")* |
| **403 Forbidden** | Přihlášen, ale nemá oprávnění |
| **404 Not Found** | Zdroj neexistuje |
| **405 Method Not Allowed** | Tato metoda na tomto URL není povolená |
| 409 Conflict | Konflikt se stávajícím stavem (duplicitní e-mail) |
| 410 Gone | Zdroj definitivně zmizel (proti 404 silnější signal) |
| 422 Unprocessable Entity | Syntakticky OK, ale data nedávají sémantický smysl |
| **429 Too Many Requests** | Rate limiting, klient posílá moc requestů |
| **451 Unavailable For Legal Reasons** | Cenzura, GDPR, soudní zákaz (odkaz na 451 °F) |

### 5xx (Chyba serveru)

| Kód | Význam |
| --- | --- |
| **500 Internal Server Error** | Něco se rozbilo na serveru, klient za to nemůže |
| **502 Bad Gateway** | Proxy/load balancer dostal špatnou odpověď z upstream serveru |
| **503 Service Unavailable** | Server dočasně nedostupný (údržba, přetížení) |
| **504 Gateway Timeout** | Proxy nedostala odpověď z upstream serveru včas |

### 401 vs 403 (klasická chyba)

|  | 401 Unauthorized | 403 Forbidden |
| --- | --- | --- |
| **Význam** | "Kdo jsi? Přihlas se." | "Vím, kdo jsi, ale tohle nesmíš." |
| **Klient by měl** | Přihlásit se | Smířit se / požádat admina |
| **Typický důvod** | Chybí/neplatný token | Neexistující role |

# **Autentizace a autorizace**

| Pojem | Význam |
| --- | --- |
| **Autentizace** *(authentication)* | "Kdo jsi?" Ověření identity |
| **Autorizace** *(authorization)* | "Co smíš?" Kontrola oprávnění |

### Hlavní mechanismy autentizace

### Session-based (cookies + server session)

1. Klient: POST /login s heslem
2. Server: ověří heslo, vytvoří session v DB, vrátí cookie s session ID
3. Klient: každý další request automaticky pošle cookie
4. Server: najde session podle ID, ví, kdo je přihlášen

| Plusy | Mínusy |
| --- | --- |
| Snadné odhlásit (smazat session) | Server musí udržovat session storage |
| Bezpečnější (server kontroluje) | Horší škálovatelnost (sticky sessions) |

### Token-based (typicky JWT)

1. Klient: POST /login s heslem
2. Server: ověří, vrátí JWT token (podepsaný)
3. Klient: ukládá token (cookie / LocalStorage)
4. Každý další request: Authorization: Bearer <token>
5. Server: ověří podpis tokenu (žádné DB volání)

**JWT** *(JSON Web Token)* má tři části oddělené tečkami:

```bash
eyJhbGc...header.eyJzdWI...payload.SflKxw...signature
```

- **Header**: typ tokenu, algoritmus podpisu
- **Payload**: data o uživateli (id, role, expiration)
- **Signature**: podpis serverem (HMAC nebo RSA)

| Plusy | Mínusy |
| --- | --- |
| Bez serverové session storage | Nelze "odhlásit" jednoduše (token platí do expirace) |
| Dobrá škálovatelnost | Při kompromitaci podepisovacího klíče se tokeny dají falšovat |
| Stateless servery | Větší velikost než session ID |

### OAuth 2.0 / OpenID Connect

Standardní protokol pro "Přihlásit se přes Google / Facebook / GitHub". Klient nemusí spravovat hesla, deleguje autentizaci na externí poskytovatele.

1. Klient klikne "Přihlásit se přes Google"
2. Přesměrování na Google login
3. Uživatel se přihlásí u Google
4. Google přesměruje zpět s autorizačním kódem
5. Aplikace si kód vymění za access token
6. Aplikace volá Google API s tokenem (např. pro email)

# CORS (Cross-Origin Resource Sharing)

Prohlížeče mají **Same-Origin Policy**: JavaScript ze stránky `https://app.example.com` **nesmí** dělat HTTP requesty na `https://api.example.com` (jiná origin).

**Origin** = schéma + host + port. Stejný host na jiném portu je jiná origin.

**CORS** je mechanismus, kterým server může explicitně povolit některým originům přístup. Klíčové hlavičky:

```bash
Access-Control-Allow-Origin: https://app.example.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

### Preflight request

Před "non-simple" requestem (s vlastními hlavičkami, jinou metodou než GET/POST) prohlížeč pošle **OPTIONS preflight**:

1. Prohlížeč: OPTIONS /api/users (preflight)
Origin: [https://app.example.com](https://app.example.com/)
Access-Control-Request-Method: DELETE
2. Server: 204 No Content
Access-Control-Allow-Origin: [https://app.example.com](https://app.example.com/)
Access-Control-Allow-Methods: GET, POST, DELETE
3. Prohlížeč: teprve teď pošle skutečný DELETE

Pokud server CORS hlavičky nepošle, prohlížeč **blokuje** odpověď a v konzoli vyvolá chybu. Pozor: request fyzicky proběhne, jen ho prohlížeč klientskému JS skryje.

# Cookies a klientské úložiště

### Cookies

Malé textové údaje, které **server uloží u klienta** a klient je posílá s **každým requestem** na danou doménu.

```bash
# Server pošle cookie
Set-Cookie: session=abc123; HttpOnly; Secure; SameSite=Strict; Max-Age=3600

# Klient pošle s requestem
Cookie: session=abc123
```

| Atribut | Co dělá |
| --- | --- |
| `HttpOnly` | Cookie není dostupná z JavaScriptu (ochrana proti XSS) |
| `Secure` | Posílá se jen přes HTTPS |
| `SameSite=Strict|Lax|None` | Ochrana proti CSRF |
| `Max-Age` / `Expires` | Doba platnosti |
| `Domain` | Která doména cookie sdílí |
| `Path` | Pro které URL se cookie posílá |

### Storage v prohlížeči

| Úložiště | Velikost | Posílá se serveru? | Životnost |
| --- | --- | --- | --- |
| **Cookies** | ~4 KB | Ano, s každým requestem | Podle `Max-Age` |
| **LocalStorage** | ~5 MB | Ne | Trvale (do smazání) |
| **SessionStorage** | ~5 MB | Ne | Konec session/tab |
| **IndexedDB** | Stovky MB | Ne | Trvale |
| **Cache API** | Velká | Ne | Spravováno Service Workerem |

# REST API design

**REST** *(Representational State Transfer)* je architektonický styl, ne standard. Definuje principy:

| Princip | Význam |
| --- | --- |
| **Resource-oriented** | URL identifikuje zdroj, ne akci (`/users/1`, ne `/getUser?id=1`) |
| **HTTP metody** | Akce přes metodu (GET/POST/PUT/DELETE), ne přes URL |
| **Stateless** | Server si nepamatuje předchozí requesty |
| **Unified interface** | Konzistentní API napříč zdroji |
| **Cacheable** | Odpovědi mohou nést info o cachování |

### Typické URL vzory

```bash
GET    /api/users               # seznam
GET    /api/users/42            # detail
POST   /api/users               # vytvořit
PUT    /api/users/42            # nahradit
PATCH  /api/users/42            # upravit
DELETE /api/users/42            # smazat

GET    /api/users/42/posts      # vnořený zdroj
GET    /api/posts?author=42     # filtrování
GET    /api/posts?page=2&limit=20  # paginace
```

**API versioning**

```bash
/api/v1/users        # verze 1
/api/v2/users        # verze 2 (breaking changes)
```

## Alternativy a komplementy HTTP

### GraphQL

|  | REST | GraphQL |
| --- | --- | --- |
| **Endpoint** | Mnoho (jeden na zdroj) | Jeden (`/graphql`) |
| **Data** | Server určuje, co vrátí | Klient si v dotazu vybere fieldy |
| **Over-fetching** | Časté (vrátí víc, než potřebuješ) | Vyřešeno (vrátí jen co chceš) |
| **Verze** | `/v1`, `/v2` | Schéma se vyvíjí (deprecate fieldů) |
| **Cache** | Snadná (HTTP cache) | Náročnější |

```graphql
query {
  user(id: 42) {
    name
    email
    posts {
      title
    }
  }
}
```

### WebSocket

Trvalé obousměrné spojení mezi klientem a serverem. Po handshake přes HTTP se "upgraduje" na WebSocket protocol.

```jsx
const ws = new WebSocket('wss://example.com/socket');
ws.onmessage = (event) => console.log('Server poslal:', event.data);
ws.send('Hello server!');
```

| Použití | Příklady |
| --- | --- |
| Real-time chat | Slack, Discord, WhatsApp Web |
| Live notifikace | Sociální sítě |
| Spolupráce v reálném čase | Google Docs, Figma |
| Online hry | Multiplayer |
| Live data | Burzy, sportovní výsledky |

### **Server-Sent Events (SSE)**

Jednosměrný stream od serveru k klientovi přes HTTP. Lehčí než WebSocket pro use case, kde stačí jeden směr.

```jsx
const events = new EventSource('/api/notifications');
events.onmessage = (e) => console.log(e.data);
```

# PWA (Progressive Web Application)

Webová aplikace, která **vypadá a chová se jako nativní app**:

- Funguje **offline** (Service Worker cachuje requesty)
- Lze ji **nainstalovat** na home screen
- Push notifikace
- Přístup k zařízením (kamera, GPS, ...)
- Rychlá, responzivní

### Service Worker

Speciální JavaScript běžící na pozadí prohlížeče, mimo hlavní vlákno. Funguje jako **proxy** mezi aplikací a sítí. Zachytává requesty, může je cachovat, vracet offline kopie atd.

```jsx
// service-worker.js
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
```

### Web App Manifest

JSON soubor v rootu webu, který definuje, jak se aplikace zachová při instalaci:

```json
{
  "name": "f1.stvr.cz",
  "short_name": "f1",
  "start_url": "/",
  "display": "standalone",
  "icons": [{ "src": "icon.png", "sizes": "512x512" }]
}
```

# WebAssembly (Wasm)

Binární formát, který umožňuje spouštět **vysoce výkonný nativní kód** přímo v prohlížeči (téměř na úrovni nativního výkonu).

- Jazyky **C, C++, Rust, Go, AssemblyScript** se kompilují do Wasm
- Spouští se v sandboxu prohlížeče
- Doplněk JS, ne náhrada (často se kombinují)
- Standardizován W3C v roce 2019

**Použití:**

| Aplikace | Konkrétní příklad |
| --- | --- |
| 3D editory v prohlížeči | AutoCAD Web, Figma (částečně) |
| Image/video editing | Photopea, Adobe Lightroom Web |
| Hry | Unity WebGL, Unreal |
| Krypto a math | TensorFlow.js, blockchain wallety |
| Office sady | Google Docs (částečně) |

MIME typ: `application/wasm`.

# Tipy pro ústní zkoušku

### Jak začít

> *"Webová aplikace komunikuje s uživatelem přes prohlížeč a se serverem typicky přes HTTP nebo HTTPS protokol. Architektonicky existuje několik modelů: klasická MPA, kde server vrací celé stránky, SPA pro plynulé UX, a moderní hybridy jako SSR a SSG. Komunikace se serverem probíhá v request-response modelu pomocí HTTP metod a stavových kódů."*
> 

### Co komise typicky chce slyšet

- **SPA vs MPA** s konkrétním příkladem.
- **Bezstavovost HTTP** a jak se řeší (cookies, sessions, tokeny).
- **HTTP metody** GET/POST/PUT/PATCH/DELETE s REST CRUD mappingem.
- **Status kódy** alespoň 200, 201, 301, 400, 401, 403, 404, 500.
- **Rozdíl 401 vs 403** (klasický chyták).
- **HTTPS přes TLS** a co znamená certifikát.
- **Request a response struktura** (start line, headers, body).

### Doplňky, které komisi potěší

- **SSR / SSG / ISR** jako moderní hybridy SPA a MPA.
- **HTTP/3 nad QUIC** (UDP, rychlejší handshake).
- **JWT** a token-based auth jako moderní alternativa k session-based.
- **CORS** jako mechanismus pro cross-origin requesty.
- **PATCH neidempotentní** (na rozdíl od PUT) podle RFC 5789.
- **WebSocket / Server-Sent Events** pro real-time.
- **Cookies vs LocalStorage** rozdíl (automatické vs manuální posílání).
- **Service Worker** v PWA jako proxy pro requesty.

### Časté chytáky

| Otázka | Odpověď |
| --- | --- |
| *Rozdíl 401 a 403?* | 401 = nepřihlášen (chybí auth), 403 = přihlášen ale nesmíš (chybí oprávnění). |
| *Je HTTP stavový nebo bezstavový?* | Bezstavový. Stav se řeší cookies, sessions, JWT. |
| *Co je idempotence?* | Opakované volání má stejný výsledek. GET, PUT, DELETE ano. POST, PATCH typicky ne. |
| *Proč MPA má lepší SEO než SPA?* | Historicky ano, ale dnes ne tak jednoznačně. SSR (Next.js) dává SPA stejně dobré SEO jako MPA. |
| *Co je rozdíl HTTP a HTTPS?* | HTTPS přidává TLS šifrování přes port 443. Vyžaduje certifikát od CA. |
| *Co je CORS?* | Mechanismus, kterým server explicitně povolí cross-origin requesty. Same-Origin Policy je default. |
| *Co je JWT?* | JSON Web Token, podepsaný kontejner s daty. Server stačí ověřit podpis, nepotřebuje session storage. |