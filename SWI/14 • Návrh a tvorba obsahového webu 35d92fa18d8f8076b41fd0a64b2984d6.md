# 14 • Návrh a tvorba obsahového webu

> Workflow, UX, UI, SEO, efektivita, responzivita (druhy viewportů)
> 

## Co je obsahový web

**Obsahový web** *(content-driven website)* je web, jehož **primárním účelem je publikovat a doručit obsah,** ne provádět transakce. Hlavní hodnota pro uživatele je informace, vzdělání, zábava nebo komunita.

### Typy obsahu

| Typ | Co obsahuje | Příklad |
| --- | --- | --- |
| **Text content** | Články, blogy, případové studie, dokumentace | iDnes.cz, Wikipedia, MDN |
| **Media content** | Fotky, video, audio, animace | YouTube, Stream.cz, Spotify |
| **Mixed** | Kombinace — typicky článek + media | BBC News, The Verge |
| **User-generated** | Obsah tvořený komunitou | Reddit, Stack Overflow, Wikipedia |

### Typy obsahových webů podle struktury

| Typ | Charakter | Příklad |
| --- | --- | --- |
| **Zpravodajský portál** | Vysoká frekvence publikování, krátká životnost obsahu | Novinky.cz, iDnes.cz |
| **Blog / magazín** | Tematicky zaměřený, hloubkové články | TechCrunch, Lupa.cz |
| **Dokumentace / knowledge base** | Strukturovaný, vyhledatelný obsah | docs.python.org, support.* |
| **Vzdělávací platforma** | Kurzy, lekce, postupy | Khan Academy, Seznam Učení |
| **Aggregator** | Sběr a třídění cizího obsahu | Hacker News, RSS čtečky |

# Workflow tvorby webu

### 1. Strategie a výzkum (Discovery)

- **Cílová skupina** — kdo bude web číst? Demografie, technická úroveň, zařízení.
- **Persony** — fiktivní reprezentanti hlavních typů uživatelů (např. "Marie, 34, učitelka, hledá ověřené informace o vakcinaci").
- **Cíle webu** — informovat, vzdělávat, budovat značku, sbírat e-maily, prodávat předplatné.
- **Konkurenční analýza** — co dělají ostatní, co nás odliší.
- **Klíčová slova** — co lidé v Googlu **opravdu** hledají *(SEO výzkum začíná tady, ne na konci)*.

### Informační architektura (IA)

- **Mapa stránek** *(sitemap)* — hierarchie a struktura obsahu.
- **Navigace** — hlavní, vedlejší, footer, breadcrumbs.
- **Card sorting** — uživatelé třídí obsah do skupin, výsledek určuje strukturu menu.
- **Taxonomie** — kategorie a tagy.
- **URL struktura** — čisté, čitelné, hierarchické (`/blog/clanek-o-seo` ne `/?p=123`).

### Wireframy a prototypy

- Návrh **rozložení prvků** bez grafiky (low-fidelity wireframy — šedé bloky).
- **User flow** — jak uživatel prochází webem cestou od vstupu k cíli.
- **Klikatelný prototyp** — testovatelný před napsáním kódu.
- **Nástroje:** Figma (dominantní), Adobe XD, Sketch, Balsamiq, Penpot (open-source).

### Vizuální design (UI)

- **Barvy** — paleta, kontrast, dark mode varianta.
- **Typografie** — písmo, velikosti, řádkování.
- **Komponenty** — knihovna znovu použitelných prvků (Design System).
- **High-fidelity mockup** — finální vizuál v Figmě, předávané vývojáři.

### Implementace

- **HTML, CSS, JS** — sémanticky správně, validně, přístupně.
- **Framework / CMS** — WordPress, Drupal, Ghost, Strapi (headless), nebo vlastní (Next.js, Astro, SvelteKit).
- **Responzivita** od začátku — mobile-first.
- **Performance budget** — limit na velikost stránky (např. první vykreslení do 1 MB), respektuj ho v průběhu.
- **Verzování** — Git, branch strategy, code review.

### Testování a QA

- **Funkční testování** — všechny odkazy fungují, formuláře odesílají.
- **Kompatibilita prohlížečů** — Chrome, Firefox, Safari, Edge (BrowserStack pro starší verze).
- **Responzivita** — testování na reálných zařízeních, ne jen v DevTools.
- **Přístupnost** — screen reader, klávesnicová navigace.
- **Výkonnostní audit** — Lighthouse, PageSpeed Insights, WebPageTest.
- **SEO audit** — meta tagy, sitemap, robots.txt, structured data.

### Nasazení (Deploy)

- **Hosting** — sdílený, VPS, dedikovaný, cloud (Vercel, Netlify).
- **CI/CD pipeline** — automatický build a deploy z gitu.
- **CDN** — distribuce assetů blíž k uživateli.
- **SSL certifikát** — HTTPS je dnes standard (Let's Encrypt zdarma).
- **Monitoring** — uptime (UptimeRobot), error tracking (Sentry), analytics.

### Údržba a iterace

- **Pravidelná aktualizace obsahu** — Google preferuje "živé" weby.
- **A/B testování** — testování dvou variant proti sobě, měření, která konvertuje líp.
- **SEO optimalizace** podle dat ze Search Console.
- **Bezpečnostní záplaty** — pravidelné aktualizace závislostí (`npm audit`, Dependabot).

# UX - User Experience

**UX řeší, jak se web používá.** Cílem je intuitivní, efektivní a příjemný zážitek. UX **není to samé** co UI — UX je strukturální (jak věci fungují), UI je vizuální (jak věci vypadají).

### Klíčové principy

| Princip | Popis |
| --- | --- |
| **Jednoduchost** | Méně je víc. Každý prvek musí mít důvod existovat. |
| **Konzistence** | Stejné věci se chovají stejně napříč webem. |
| **Předvídatelnost** | Uživatel tuší, co se stane po kliknutí. |
| **Zpětná vazba** | Systém okamžitě reaguje na akci (loading state, success message). |
| **Odpouští chyby** | Lze se vrátit, zrušit akci, opravit překlep. |
| **Dostupnost** | Funguje na různých zařízeních a pro různé uživatele. |
| **Rychlost** | Krátká doba načítání i interakce. |

### Nielsenových 10 heuristik použitelnosti

Klasický rámec pro hodnocení UX *(Jakob Nielsen, 1994 — stále platí)*:

1. **Viditelnost stavu systému** — uživatel vždy ví, co se děje.
2. **Soulad se světem uživatele** — používej jeho slova, ne technický žargon.
3. **Kontrola a svoboda** — undo, cancel, jasné východy.
4. **Konzistence a standardy** — drž se konvencí (košík vpravo nahoře).
5. **Prevence chyb** — lepší než chybová hláška.
6. **Rozpoznat než si pamatovat** — možnosti viditelné, ne skryté v paměti.
7. **Flexibilita a efektivita** — zkratky pro pokročilé, jednoduchost pro nováčky.
8. **Estetický a minimalistický design** — žádná informace navíc, která ředí podstatné.
9. **Pomoc rozpoznat a zotavit se z chyb** — chybové hlášky srozumitelně a s návrhem řešení.
10. **Nápověda a dokumentace** — pokud je potřeba, snadno dostupná a vyhledatelná.

### UX výzkum a testování

- **User interviews** — rozhovory s reálnými uživateli.
- **Usability testing** — pozorování, jak uživatel plní úkoly (klasický nález: stačí 5 lidí, abys odhalil 80 % problémů).
- **Card sorting** — pro informační architekturu.
- **A/B testování** — kvantitativní srovnání dvou variant.
- **Heatmapy** *(Hotjar, Microsoft Clarity)* — kde uživatelé klikají, jak scrollují.
- **Session recordings** — záznamy reálných návštěv.

# UI - User Interface

**UI řeší, jak web vypadá a jak s ním uživatel interaguje na úrovni rozhraní.**

### Komponenty UI

| Prvek | Popis |
| --- | --- |
| **Barvy** | Paleta, kontrast (WCAG), psychologie barev, dark mode |
| **Typografie** | Volba písma, velikosti, řádkování, čitelnost |
| **Layout** | Rozložení prvků (grid, flexbox), bílé místo |
| **Komponenty** | Tlačítka, ikony, formuláře, navigace, modaly |
| **Vizuální hierarchie** | Velikost, kontrast, umístění — co je důležité |
| **Konzistence** | Stejný styl napříč všemi stránkami |
| **Mikroanimace** | Hover, transitions, loading states — zpětná vazba |
| **Ikonografie** | Stejný styl ikon (line / filled), čitelné |

### Design Systems

**Design System** je sada znovu použitelných komponent a pravidel, která zajišťuje konzistenci napříč produktem. Příklady: **Material Design** (Google), **Apple HIG**, **Carbon** (IBM), **Polaris** (Shopify).

**Atomic Design** *(Brad Frost)* — metodika rozkládání UI:

- **Atomy** — tlačítko, input, ikona
- **Molekuly** — search bar (input + button)
- **Organismy** — hlavička webu (logo + nav + search)
- **Šablony** — layout stránky bez konkrétního obsahu
- **Stránky** — šablona s reálnými daty

### Nástroje

- **Návrh:** Figma (dominantní), Adobe XD, Sketch, Penpot
- **CSS frameworky:** Tailwind CSS *(utility-first)*, Bootstrap *(komponentový)*
- **UI knihovny:** shadcn/ui, Material UI, Radix UI, Headless UI

# **Přístupnost (a11y)**

**Přístupnost** *(accessibility, zkr. a11y)* znamená, že web mohou používat **všichni uživatelé včetně lidí s postižením** - zrakovým, sluchovým, motorickým, kognitivním.
****

### WCAG (Web Content Accessibility Guidelines)

Aktuální standard: **WCAG 2.2** (2023), tři úrovně shody:

| Úroveň | Co znamená |
| --- | --- |
| **A** | Minimální — nejzákladnější přístupnost |
| **AA** | **Standardní požadavek** — typická právní povinnost (i EAA) |
| **AAA** | Maximální — často nedosažitelná pro běžný obsah |

### Čtyři principy (POUR)

1. **Perceivable** *(vnímatelné)* — obsah je dostupný smysly, které uživatel má (alt texty u obrázků, titulky u videí).
2. **Operable** *(ovladatelné)* — vše jde ovládat klávesnicí, dostatek času.
3. **Understandable** *(srozumitelné)* — čitelný text, předvídatelné chování.
4. **Robust** *(robustní)* — funguje s asistivními technologiemi (screen readery)

### Praktické věci

| Co | Proč |
| --- | --- |
| **Sémantické HTML** *(`<nav>`, `<main>`, `<button>`, `<article>`)* | Screen reader rozumí struktuře |
| **Alt texty u obrázků** | Pro slepé uživatele i pro SEO |
| **Kontrast textu vs. pozadí** | Min. 4.5:1 pro běžný text (AA) |
| **Klávesnicová navigace** | Tab projde všechny interaktivní prvky |
| **Focus styles** | Viditelné, kterým prvkem se právě prochází |
| **ARIA atributy** *(`aria-label`, `aria-live`)* | Doplnění tam, kde sémantika nestačí |
| **Skip links** | "Přeskočit na obsah" pro klávesnicové uživatele |
| **prefers-reduced-motion** | Respekt k uživatelům citlivým na animace |

# SEO - Search Engine Optimization

**SEO = optimalizace webu pro vyhledávače**, aby byl lépe viditelný v **organických** (neplacených) výsledcích.

### Search intent — co uživatel opravdu chce

Před optimalizací musíš pochopit **záměr** za vyhledáváním:

| Záměr | Co uživatel chce | Příklad dotazu |
| --- | --- | --- |
| **Informational** | Informaci | "jak fungují solární panely" |
| **Navigational** | Konkrétní web | "facebook login" |
| **Commercial** | Porovnat před nákupem | "nejlepší ssd 2026" |
| **Transactional** | Koupit, stáhnout | "koupit iphone 16 pro" |

Pokud cílíš na informational a tvůj obsah je transactional, neuspěješ.
****

### On-page SEO

| Faktor | Detail |
| --- | --- |
| **Nadpisy** | **Jeden** `<h1>` na stránku, hierarchie h1 → h2 → h3 bez přeskakování |
| **Title tag** | `<title>` 50–60 znaků, klíčové slovo na začátku |
| **Meta description** | 150–160 znaků, motivuje ke kliknutí (nepovinné pro SEO, povinné pro CTR) |
| **URL struktura** | Krátké, čitelné, hierarchické (`/blog/seo-zaklady`) |
| **Interní prolinkování** | Propojení článků mezi sebou, anchor texty s klíčovými slovy |
| **Alt texty** | U všech obrázků, popisují obsah, ne dekoraci |
| **Obsah** | Hloubkový, originální, řeší konkrétní problém |
| **Schema.org** | Strukturovaná data v JSON-LD (viz níže) |

### E-E-A-T

Google hodnotí obsah podle čtyř kvalitativních faktorů:

- **Experience** - autor má reálnou zkušenost s tématem
- **Expertise** - odbornost
- **Authoritativeness** - autoritativnost (kdo o tobě/webu mluví)
- **Trustworthiness** - důvěryhodnost (HTTPS, kontakty, transparentnost)

Pro YMYL témata *(Your Money or Your Life - finance, zdraví, právo)* je E-E-A-T extrémně důležitý.

### Off-page SEO

| Faktor | Detail |
| --- | --- |
| **Zpětné odkazy (backlinks)** | Kvalita > kvantita. Jeden odkaz z autoritativního webu váží víc než 100 ze spamových. |
| **Anchor text** | Text odkazu nese kontext (ne "klikni sem"). |
| **Brand mentions** | Zmínky o značce bez odkazu - Google je taky započítává. |
| **Sociální signály** | Nepřímý faktor - viditelnost a traffic. |
| **Local SEO** | Google Business Profile, lokální odkazy, reviews. |

### Technické SEO

| Faktor | Detail |
| --- | --- |
| **Mobile-first indexing** | Google od 2019 indexuje **mobilní verzi** webu jako primární. Pokud máš špatnou mobilní verzi, máš špatné SEO. |
| **HTTPS** | Povinný rankovací faktor od 2014. |
| **sitemap.xml** | Mapa všech URL na webu pro vyhledávače. |
| **robots.txt** | Co vyhledávače smí / nesmí indexovat. |
| **Canonical URL** | `<link rel="canonical">` — která verze URL je "originál" (řeší duplicity). |
| **Open Graph + Twitter Cards** | Meta tagy pro sociální sítě (`og:title`, `og:image`). |
| **Strukturovaná data** | Schema.org v JSON-LD — pomáhá Googlu pochopit obsah, umožní rich results. |
| **hreflang** | Pro vícejazyčné weby — určuje jazyk a region varianty. |
| **Core Web Vitals** | Viz vlastní sekce níže — klíčové. |

### Co měřit a kde

- **Google Search Console** — co se zobrazuje, na co kliká, CTR, pozice.
- **Google Analytics 4** *(GA4)* — chování uživatelů na webu.
- **Lighthouse** v DevTools — rychlý audit 0–100 (Performance, Accessibility, SEO, Best Practices).
- **PageSpeed Insights** — Lighthouse + reálná data z Chromu (CrUX).
- **Ahrefs / Semrush / Mangools** — klíčová slova, backlinky, konkurence.

# Výkon a Core Web Vitals

**Core Web Vitals** jsou tři metriky, které Google používá k hodnocení reálného uživatelského zážitku:

| Metrika | Co měří | Cíl |
| --- | --- | --- |
| **LCP** *(Largest Contentful Paint)* | Doba načtení největšího prvku (hero obrázek, hlavní nadpis) | **< 2.5 s** |
| **INP** *(Interaction to Next Paint)* | Responzivita — doba mezi interakcí a vizuální odezvou | **< 200 ms** |
| **CLS** *(Cumulative Layout Shift)* | Vizuální stabilita — jak moc se layout posunuje při načítání | **< 0.1** |

### Jak optimalizovat výkon

| Technika | Co dělá |
| --- | --- |
| **Komprese obrázků** | WebP / AVIF místo JPEG (40–60 % menší soubory) |
| **Responsive images** | `<picture>`, `srcset` — různé rozlišení pro různé obrazovky |
| **Lazy loading** | `loading="lazy"` u obrázků a iframe pod foldem |
| **Code splitting** | Načítat jen JS, který je na dané stránce potřeba |
| **Minifikace** | Menší CSS/JS soubory (build tooly to dělají automaticky) |
| **CDN** | Servírovat assety z geograficky bližšího serveru |
| **Caching** | `Cache-Control` hlavičky, service workers |
| **HTTP/2 nebo HTTP/3** | Multiplexing, rychlejší handshake |
| **Preload / prefetch** | `<link rel="preload">` pro kritické zdroje |
| **Critical CSS** | Inline CSS pro první vykreslení, zbytek async |
| **Font display** | `font-display: swap` — text se vykreslí dřív, než dorazí font |

### Architektonické volby

| Přístup | Výhoda | Použití |
| --- | --- | --- |
| **SSR** *(Server-Side Rendering)* | Rychlé první vykreslení, dobré SEO | Next.js, Nuxt |
| **SSG** *(Static Site Generation)* | Nejrychlejší možný web, žádný server runtime | Astro, Hugo, Eleventy |
| **CSR** *(Client-Side Rendering)* | Bohatá interakce, ale horší SEO a první načtení | klasická React SPA |
| **JAMstack** | Statický build + API + CDN, super výkon a škálování | Next.js + Vercel, Astro + Netlify |

# Responzivita

**Responzivní design** = web se přizpůsobuje různým velikostem obrazovek bez nutnosti zoomování. Zachovává čitelnost a funkčnost na mobilu, tabletu i desktopu.

### Mobile-first přístup

Začínáš návrhem **pro nejmenší obrazovku** a postupně přidáváš features pro větší. **Důvod:** víc než 60 % globálního provozu jsou mobily, Google indexuje mobilní verzi jako primární, a omezení malé obrazovky tě donutí soustředit se na to podstatné.

V CSS to znamená používat `min-width` v media queries (ne `max-width`):

### Standardní breakpointy

| Zařízení | Šířka |
| --- | --- |
| Mobilní telefon | do **480–600 px** |
| Tablet | **768–1024 px** |
| Notebook / Desktop | **1280 px** a více |
| Velké displeje | **1920 px** a více |

### Tailwind CSS breakpointy *(mobile-first)*

| Prefix | Od šířky |
| --- | --- |
| *(žádný)* | 0 px *(default, mobile)* |
| `sm:` | 640 px |
| `md:` | 768 px |
| `lg:` | 1024 px |
| `xl:` | 1280 px |
| `2xl:` | 1536 px |

### Viewport meta tag — bez něj responzivita nefunguje

`<meta name="viewport" content="width=device-width, initial-scale=1">`

Tímhle prohlížeči řekneš, aby šířku stránky odpovídal reálné šířce zařízení. Bez tohohle mobil renderuje stránku jako desktop a zoomuje to.

### Media queries

CSS pravidla, která platí jen za určitých podmínek:

```css
@media (min-width: 768px) and (max-width: 1023px) {
  /* tablet only */
}

@media (prefers-color-scheme: dark) {
  /* dark mode */
}

@media (prefers-reduced-motion: reduce) {
  /* pro uživatele, kteří chtějí méně animací */
}

@media print {
  /* styly pro tisk */
}
```

### Container queries — moderní alternativa

Místo dotazování na velikost **obrazovky** se dotazuješ na velikost **kontejneru komponenty**. Funguje univerzálně podporovaná od 2023:

```css
.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card { display: grid; grid-template-columns: 1fr 2fr; }
}
```

### CSS jednotky pro responzivitu

| Jednotka | Význam |
| --- | --- |
| `px` | Pixely — pevné, neresponzivní |
| `%` | Procenta z rodičovského prvku |
| `em` | Násobek velikosti písma rodiče |
| `rem` | Násobek velikosti písma kořene (`<html>`) — **preferovaná pro velikosti** |
| `vw` / `vh` | 1 % šířky / výšky viewportu |
| `vmin` / `vmax` | Menší / větší z `vw` a `vh` |
| `fr` | Frakce v Grid layoutu |
| `ch` | Šířka znaku "0" — pro řádky textu |

### Flexbox vs. Grid

**Flexbox** — jednorozměrný layout (řada NEBO sloupec):

```css
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}
```

**Grid** — dvourozměrný layout (řádky A sloupce):

```css
.layout {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 1rem;
}
```

> Pravidlo palce: **Flex pro komponenty, Grid pro layout stránky.**
> 

# Měření efektivity

| Oblast | Co měřit | Nástroje |
| --- | --- | --- |
| **Návštěvnost** | Počet uživatelů, sessions, source | GA4, Plausible, Umami |
| **Chování** | Bounce rate, time on page, scroll depth | GA4, Hotjar |
| **Konverze** | Goal completions, funnel drop-off | GA4, Mixpanel |
| **Vizualizace** | Heatmapy, session recordings | Hotjar, Microsoft Clarity |
| **SEO** | Pozice, CTR, impressions | Google Search Console |
| **Výkon** | Core Web Vitals z reálných uživatelů | PageSpeed Insights, Search Console |
| **Chyby** | JS exceptions, server errors | Sentry, LogRocket |
| **Uptime** | Dostupnost serveru | UptimeRobot, BetterStack |

### GDPR a cookies

V EU musíš mít **cookie consent** pro analytické a marketingové cookies. Bez souhlasu smíš nahrávat jen **technicky nezbytné** cookies. Alternativa: **cookie-less analytics** (Plausible, Umami) — nepoužívají osobní data, žádný banner.

## Tipy pro ústní zkoušku

### Jak zarámovat odpověď

Začni vrstvami — komise tím vidí systematické myšlení:

> *"Tvorba obsahového webu prochází pevně danou posloupností fází, ale moderně se to dělá iterativně. Můžu projít celý workflow od strategie po nasazení, nebo se soustředit na jednu z klíčových oblastí — UX, UI, SEO, výkon, přístupnost — podle toho, co vás zajímá."*
> 

### Co komise typicky chce slyšet

- **Rozdíl UX vs. UI** — klasická otázka, mít odpověď v jedné větě.
- **Workflow krok za krokem** s odůvodněním proč v tomto pořadí.
- **Tři pilíře SEO** — on-page, off-page, technické — ke každému příklad.
- **Konkrétní breakpointy** a aspoň jednu media query rozpsanou.
- **Responzivita** propojená s **mobile-first** přístupem.
- **Lighthouse** jako praktický nástroj — 0–100 v kategoriích Performance / Accessibility / SEO / Best Practices.

### Doplňky, které komisi potěší

- **Core Web Vitals** (LCP, INP, CLS) jako oficiální ranking faktor.
- **Mobile-first indexing** od Googlu (od 2019).
- **WCAG 2.2 úroveň AA** jako standard přístupnosti.
- **European Accessibility Act** (od června 2025 povinný v EU).
- **JAMstack architektura** *(Next.js + Vercel, Astro)* — moderní přístup ke statickým webům.
- **Container queries** jako moderní alternativa k media queries.
- **Schema.org / JSON-LD** pro strukturovaná data a rich results.
- **Search intent** — proč je důležitější než klíčová slova.