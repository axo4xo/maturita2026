# 4 • CSS Grid a tvorba layoutu

> CSS Grid, řádky a sloupce, rozmístění oblastí
> 

> **Formát:** 30 min praktická úloha, 15 min obhajoba + teorie. Teorie tak komplexní, že z ní dáš i praktiku, plus celá úloha s řešením a bonusy.
> 

---

# Část 1: Teorie

### Co je CSS Grid

**CSS Grid Layout** je **dvourozměrný** layout systém v CSS. Rozmísťuje prvky **současně po řádcích a sloupcích**. Dává naprostou kontrolu nad mřížkou stránky.

### Krátký kontext

| Éra | Technika |
| --- | --- |
| 90. léta | `<table>` (sémanticky špatně) |
| 2000-2010 | `float`, `position: absolute` |
| 2010-2015 | `display: inline-block` |
| 2015+ | **Flexbox** (1D) |
| **2017+** | **CSS Grid** (2D) |

CSS Grid byl finalizován jako W3C standard v roce 2017. Dnes funguje **úplně všude** ve všech moderních prohlížečích bez prefixů.

### K čemu se hodí

- **Layout celé stránky** (header, sidebar, main, footer)
- **Galerie obrázků** v mřížce
- **Dashboard** s widgety
- **Magazínové layouty** (různě velké karty)
- **Kalendář, rozvrh hodin**
- **Komplexní formuláře** s pevně danou strukturou

> **Grid vs Flexbox**: Flexbox = **1D**, Grid = **2D**. Grid pro velký layout, Flexbox pro menší komponenty uvnitř.
> 

---

### Základní pojmy

![image.png](4%20%E2%80%A2%20CSS%20Grid%20a%20tvorba%20layoutu/image.png)

| Pojem | Co to je |
| --- | --- |
| **Grid Container** | Rodič s `display: grid` |
| **Grid Item** | Přímý potomek grid containeru |
| **Grid Lines** | Vodorovné a svislé čáry mřížky, číslované od 1 |
| **Grid Track** | Prostor mezi dvěma sousedními čarami (= řádek nebo sloupec) |
| **Grid Cell** | Průnik jednoho řádku a jednoho sloupce (jedna buňka) |
| **Grid Area** | Obdélníková oblast přes víc buněk |

---

### Vytvoření grid containeru

```css
.container {
    display: grid;        /* nebo inline-grid */
}
```

Přímí potomci se stanou grid itemy. Bez definice mřížky se ale řadí pod sebe. Musíš definovat **sloupce a řádky**.

---

### Definice mřížky

### `grid-template-columns` a `grid-template-rows`

```css
.container {
    display: grid;
    grid-template-columns: 200px 200px 200px;   /* 3 sloupce po 200 px */
    grid-template-rows: 100px 100px;            /* 2 řádky po 100 px */
}
```

```
┌────────┬────────┬────────┐
│        │        │        │  ← 100px
├────────┼────────┼────────┤
│        │        │        │  ← 100px
└────────┴────────┴────────┘
  200px    200px    200px
```

### Jednotka `fr` (fraction)

Asi nejdůležitější jednotka v Gridu. `fr` znamená **díl volného místa** (fraction), podobně jako `flex-grow`.

```css
.container {
    grid-template-columns: 1fr 1fr 1fr;     /* 3 stejně široké */
    grid-template-columns: 1fr 2fr 1fr;     /* prostřední 2× širší */
    grid-template-columns: 200px 1fr;       /* sidebar 200 px + main na zbytek */
    grid-template-columns: 200px 1fr 250px; /* sidebar + main + ad */
}
```

> **`1fr 1fr 1fr` je nejjednodušší způsob 3 stejně širokých sloupců.** Lepší než počítat procenta.
> 

### `repeat()`: opakování

```css
.container {
    grid-template-columns: repeat(3, 1fr);             /* = 1fr 1fr 1fr */
    grid-template-columns: repeat(12, 1fr);            /* 12 sloupců (Bootstrap-style) */
    grid-template-columns: repeat(4, 100px 200px);     /* opakuje pár 100/200 4× */
}
```

### `minmax()`: minimální a maximální velikost

```css
.container {
    grid-template-columns: minmax(100px, 1fr) 2fr;
    /* první sloupec: minimálně 100 px, jinak 1fr */
}
```

### `auto-fill` vs `auto-fit`: responzivní mřížka bez media queries

```css
.container {
    /* Vytvoří tolik sloupců po min 200 px, kolik se vejde */
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}
```

| Hodnota | Co dělá |
| --- | --- |
| `auto-fill` | Vyplní řádek prázdnými sloupci, kdyby zbylo místo (zachová "neviditelné" sloty) |
| `auto-fit` | Existující sloupce se roztáhnou, aby vyplnily celý řádek |

V praxi se víc používá `auto-fit` (nemáš prázdné sloty na konci).

> **Magická řádka pro responzivní galerii:**
> 
> 
> ```css
> grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
> ```
> 
> Karty se samy přebalí podle šířky okna, bez jediné media query.
> 

### Hodnoty velikostí

| Hodnota | Význam |
| --- | --- |
| `100px`, `5rem`, `20%` | Pevná hodnota |
| `auto` | Podle obsahu |
| `1fr` | Díl volného místa |
| `min-content` | Nejmenší možná šířka (typicky nejdelší slovo) |
| `max-content` | Šířka, kdyby se nic nezalomilo |
| `fit-content(200px)` | Mezi min-content a 200 px |
| `minmax(100px, 1fr)` | Min 100 px, max 1fr |

---

### Mezery: `gap`

```css
.container {
    gap: 1rem;              /* mezera mezi všemi (řádky i sloupce) */
    gap: 1rem 2rem;         /* row-gap column-gap */
    row-gap: 1rem;
    column-gap: 2rem;
}
```

> Stejná vlastnost jako u Flexboxu. Starší syntaxe `grid-gap`, `grid-row-gap`, `grid-column-gap` ještě funguje, ale je zastaralá.
> 

---

### Pojmenované oblasti: `grid-template-areas`

> Nejmocnější vlastnost Gridu. Pojmenuješ oblasti a graficky je "nakreslíš" v CSS.
> 

```css
.container {
    display: grid;
    grid-template-columns: 200px 1fr;
    grid-template-rows: 80px 1fr 60px;
    grid-template-areas:
        "header  header"
        "sidebar main"
        "footer  footer";
    min-height: 100vh;
}

.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.footer  { grid-area: footer; }
```

```html
<div class="container">
    <header class="header">...</header>
    <aside class="sidebar">...</aside>
    <main class="main">...</main>
    <footer class="footer">...</footer>
</div>
```

**Výsledek:**

```
┌────────────────────────────┐
│          header            │  ← zabírá oba sloupce
├────────┬───────────────────┤
│        │                   │
│ sidebar│       main        │
│        │                   │
├────────┴───────────────────┤
│          footer            │  ← zabírá oba sloupce
└────────────────────────────┘
```

### Pravidla pro `grid-template-areas`

1. Každý řádek mřížky = jeden string v uvozovkách
2. Stejné jméno opakované **vedle sebe** = jedna oblast přes víc buněk
3. Jméno musí tvořit **obdélník** (ne L-tvar, ne T-tvar)
4. Tečka `.` = prázdná buňka (žádná oblast)

```css
grid-template-areas:
    "header header header"
    "sidebar main    .   "    /* tečka = prázdná buňka */
    "footer  footer  footer";
```

---

### Umístění itemu po číslech

Každá grid linie má číslo, počínaje 1. Item můžeš umístit pomocí čísel od/do kterých linií má sahat.

```
     line 1       line 2       line 3       line 4
line 1 ┼────────────┼────────────┼────────────┼
       │            │            │            │
line 2 ┼────────────┼────────────┼────────────┼
       │            │            │            │
line 3 ┼────────────┼────────────┼────────────┼
```

### `grid-column` a `grid-row`

```css
.item {
    grid-column-start: 1;
    grid-column-end: 3;       /* od linie 1 do linie 3 = 2 sloupce */
    grid-row-start: 1;
    grid-row-end: 2;
}

/* Zkráceně přes lomítko */
.item {
    grid-column: 1 / 3;       /* start / end */
    grid-row: 1 / 2;
}
```

> **Klasický chyták**: `grid-column: 1 / 3` zabere **2 sloupce** (od linie 1 do linie 3). Linie jsou jako sloupy zábradlí, sloupce jsou prostor mezi nimi.
> 

### `span` (rozsah)

```css
.item {
    grid-column: 1 / span 2;   /* začíná linií 1, zabírá 2 sloupce */
    grid-row: span 3;          /* zabírá 3 řádky (kdekoli auto-placement určí) */
}
```

### Záporné čísla (od konce)

```css
.item {
    grid-column: 1 / -1;       /* od první do poslední linie (celá šířka) */
    grid-column: -3 / -1;      /* od předposlední do poslední (2 sloupce zprava) */
}
```

### `grid-area` shorthand

```css
.item {
    /* row-start / column-start / row-end / column-end */
    grid-area: 1 / 2 / 3 / 4;

    /* Nebo jméno z grid-template-areas: */
    grid-area: header;
}
```

---

### Zarovnání obsahu

CSS Grid má 6 hlavních zarovnávacích vlastností: 3 v containeru pro itemy, 3 pro celou mřížku.

### Zarovnání itemů uvnitř buněk

| Vlastnost | Co dělá | Default |
| --- | --- | --- |
| `justify-items` | Zarovnání itemu vodorovně v buňce | `stretch` |
| `align-items` | Zarovnání itemu svisle v buňce | `stretch` |
| `place-items` | Zkratka: align-items + justify-items |  |

```css
.container {
    justify-items: center;
    align-items: center;
    /* nebo */
    place-items: center;     /* obojí najednou */
    /* nebo */
    place-items: center start;  /* svisle center, vodorovně start */
}
```

Hodnoty: `start`, `end`, `center`, `stretch` (default).

### Zarovnání jednoho itemu: `justify-self`, `align-self`, `place-self`

```css
.item {
    justify-self: end;
    align-self: center;
    /* nebo */
    place-self: center end;
}
```

### Zarovnání celé mřížky uvnitř containeru

Pokud je mřížka **menší než container** (typicky když fixní šířky sloupců dohromady jsou menší než šířka rodiče).

| Vlastnost | Co dělá |
| --- | --- |
| `justify-content` | Posun mřížky vodorovně |
| `align-content` | Posun mřížky svisle |
| `place-content` | Zkratka |

Hodnoty: `start`, `end`, `center`, `space-between`, `space-around`, `space-evenly`.

> **Klíčový rozdíl k zapamatování:**
> 
> - `-items` = jak vypadají **itemy uvnitř buněk**
> - `-content` = jak je posazená **celá mřížka v containeru**

---

### Implicit grid (auto-placement)

Když je itemů víc než buněk v explicitně definované mřížce, Grid vytvoří **implicitní** řádky nebo sloupce.

```css
.container {
    grid-template-columns: 1fr 1fr;
    /* žádný grid-template-rows */
}
```

S 6 itemy a 2 sloupci se vytvoří 3 řádky automaticky. Velikost těchto řádků určí výška obsahu.

### `grid-auto-rows` a `grid-auto-columns`

```css
.container {
    grid-template-columns: 1fr 1fr 1fr;
    grid-auto-rows: 200px;    /* každý NOVÝ implicitní řádek bude 200 px */
}
```

### `grid-auto-flow`

| Hodnota | Co dělá |
| --- | --- |
| `row` (default) | Itemy se plní po řádcích zleva doprava |
| `column` | Po sloupcích shora dolů |
| `row dense` | Pokouší se zaplnit i vzniklé díry ("tetris" algoritmus) |
| `column dense` | Totéž pro sloupce |

```css
.container {
    grid-auto-flow: dense;   /* zaplnit díry, i kdyby to změnilo pořadí */
}
```

`dense` se hodí pro Pinterest-style layouty, kde větší prvky vytvářejí mezery.

---

### Subgrid (moderní feature)

> Bonus: subgrid umožňuje, aby vnořený grid sdílel mřížku se svým rodičem. Podpora ve všech prohlížečích od konce roku 2023, dnes plně použitelný.
> 

```css
.parent {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 1rem;
}

.child {
    grid-column: span 3;
    display: grid;
    grid-template-columns: subgrid;   /* používá sloupce rodiče */
}
```

Použití: zarovnání obsahu vnořených komponent (např. produktové karty s nadpisem, popisem a cenou, kde všechny ceny mají být na stejné výšce).

---

### Časté patterns

### Holy Grail layout (s `grid-template-areas`)

```css
.page {
    display: grid;
    grid-template-columns: 200px 1fr 200px;
    grid-template-rows: auto 1fr auto;
    grid-template-areas:
        "header  header  header"
        "sidebar main    aside"
        "footer  footer  footer";
    min-height: 100vh;
    gap: 1rem;
}
.page > header  { grid-area: header; }
.page > .sidebar { grid-area: sidebar; }
.page > main     { grid-area: main; }
.page > .aside   { grid-area: aside; }
.page > footer  { grid-area: footer; }
```

### Responzivní galerie (auto-fit)

```css
.galerie {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
}
```

Žádné media queries, automatické přebalení podle šířky okna.

### Magazínový layout (různě velké karty)

```css
.magazine {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: 200px;
    gap: 1rem;
}

.feature {
    grid-column: span 2;     /* 2 sloupce */
    grid-row: span 2;        /* 2 řádky */
}

.wide {
    grid-column: span 2;     /* zabírá 2 sloupce, 1 řádek */
}
```

### Centrování v 1 řádku

```css
.parent {
    display: grid;
    place-items: center;
    min-height: 100vh;
}
```

> **Nejkratší způsob vertikálního i horizontálního centrování v moderním CSS.**
> 

### Card layout (header / body / footer)

```css
.card {
    display: grid;
    grid-template-rows: auto 1fr auto;   /* hlavička + obsah + patička */
    min-height: 300px;
}
```

Body se s `1fr` roztáhne, footer se přilepí dolů.

### Form layout

```css
.form {
    display: grid;
    grid-template-columns: 150px 1fr;
    gap: 1rem;
}

.form label { text-align: right; }
.form input { /* zabere 1fr automaticky */ }

/* Tlačítko přes celou šířku */
.form button {
    grid-column: 1 / -1;
}
```

---

### Grid vs Flexbox: kdy co

| Použij **Grid** | Použij **Flexbox** |
| --- | --- |
| 2D layout (řádky × sloupce) | 1D (jen řádek nebo jen sloupec) |
| Layout celé stránky | Komponenty (navbar, karta) |
| Velikost prvků určuje rodič (pevná mřížka) | Velikost prvků určuje obsah |
| Potřebuješ pojmenované oblasti | Stačí seřadit prvky vedle sebe |
| Magazínové layouty s různými velikostmi | Toolbary, navigace, ovládací prvky |

V praxi: **Layout stránky = Grid (vnější), jednotlivé komponenty uvnitř = Flexbox (vnitřní)**.

---

### Cheat sheet: Grid Container

| Vlastnost | Hodnoty | Co dělá |
| --- | --- | --- |
| `display` | `grid`, `inline-grid` | Aktivuje grid |
| `grid-template-columns` | Velikosti, `repeat()`, `minmax()` | Definice sloupců |
| `grid-template-rows` | Velikosti | Definice řádků |
| `grid-template-areas` | Stringy s názvy | Grafická definice oblastí |
| `gap` | Délka | Mezery mezi buňkami |
| `justify-items` | `start`/`end`/`center`/`stretch` | Zarovnání itemů vodorovně v buňce |
| `align-items` | `start`/`end`/`center`/`stretch` | Zarovnání itemů svisle v buňce |
| `place-items` | Shorthand | Obojí |
| `justify-content` | Jako u flex | Posun mřížky vodorovně |
| `align-content` | Jako u flex | Posun mřížky svisle |
| `grid-auto-rows` | Velikost | Velikost implicitních řádků |
| `grid-auto-columns` | Velikost | Velikost implicitních sloupců |
| `grid-auto-flow` | `row`/`column`/`dense` | Směr auto-plnění |

### Cheat sheet: Grid Item

| Vlastnost | Hodnoty | Co dělá |
| --- | --- | --- |
| `grid-column` | `start / end` nebo `span N` | Umístění do sloupců |
| `grid-row` | `start / end` nebo `span N` | Umístění do řádků |
| `grid-area` | Jméno z areas nebo 4 čísla | Shorthand |
| `justify-self` | Jako justify-items | Tento item vodorovně |
| `align-self` | Jako align-items | Tento item svisle |
| `place-self` | Shorthand | Obojí |

---

### Časté chyby

| Chyba | Důsledek | Řešení |
| --- | --- | --- |
| Zapomněl `display: grid` na rodiči | `grid-column` na itemech neudělá nic | Dát rodiči `display: grid` |
| Itemy přetékají mimo definovanou mřížku | Auto-placement vytvořil nové implicitní řádky | Nastavit `grid-auto-rows` nebo definovat víc řádků |
| `grid-template-areas` nedělá to, co chci | Jména musí tvořit obdélník, ne L | Každé jméno = obdélníková oblast |
| `grid-column: 1 / 3` vytváří 1 sloupec, ne 2 | Špatné počítání | Linie 1 a 3 ohraničují 2 sloupce mezi nimi. Lepší použít `span 2` |
| `gap` nepřidává mezeru po krajích | `gap` je jen mezi buňkami | Použít `padding` na container |
| Itemy roztažené přes celou buňku | Default je `stretch` | Nastavit `justify-items: start` (nebo jiné) |
| Sidebar má pevnou šířku, ale obsah se zalomí | Hodnota `1fr` má `min-width: auto` (= obsah) | Použít `minmax(0, 1fr)` na hlavní sloupec |

---

# Část 2: Praktická úloha

### Co může praktická úloha obsahovat

Typická Grid praktika:

- **Hlavní layout stránky** přes `grid-template-areas` (header, sidebar, main, footer)
- **Mřížka karet** v hlavním obsahu (typicky 3 sloupce, responzivně 1 na mobilu)
- **Feature card** zabírající víc buněk (přes `grid-column: span N` a `grid-row: span N`)
- **Responzivní galerie** přes `repeat(auto-fit, minmax(...))`
- **Vnořený grid** (galerie uvnitř main)
- **Mobilní layout**: přepis `grid-template-areas` pro 1 sloupec přes media query
- **Centrování** přes `place-items: center`

### Příklad zadání: Magazín "GridZine"

Vytvoř hlavní stránku online magazínu. HTML obsahuje 4 sekce stránky + 6 článků. Pomocí CSS Grid (žádný flex pro hlavní layout!) vytvoř:

1. Hlavní layout stránky přes `grid-template-areas`: header, sidebar, main, footer
2. Mřížku článků v main: 3 sloupce, mezery
3. **Feature článek**: zabírá 2 sloupce a 2 řádky
4. Galerie obrázků: responzivní (auto-fit + minmax)
5. Sidebar s vertikálním menu kategorií

**Bonusy:**

- Mobilní layout přes přepsané `grid-template-areas`
- CTA sekce s `place-items: center`
- Asymetrické články přes `grid-column: span 2`

### Řešení: kompletní `styly.css`

```css
/* ===== RESET ===== */
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: system-ui, sans-serif; line-height: 1.5; color: #222; background: #f5f5f5; }
img { max-width: 100%; display: block; }
a { color: inherit; text-decoration: none; }

/* ===== HLAVNÍ LAYOUT STRÁNKY (TODO 1) ===== */
.page {
    display: grid;
    grid-template-columns: 220px 1fr;
    grid-template-rows: auto 1fr auto;
    grid-template-areas:
        "header   header"
        "sidebar  main"
        "footer   footer";
    min-height: 100vh;
    gap: 1rem;
}

.header {
    grid-area: header;
    background: #1f2937;
    color: white;
    padding: 1.5rem 2rem;
}

.sidebar {
    grid-area: sidebar;
    background: white;
    padding: 1.5rem;
}

.main {
    grid-area: main;
    background: white;
    padding: 1.5rem;
}

.footer {
    grid-area: footer;
    background: #1f2937;
    color: white;
    padding: 1rem 2rem;
    text-align: center;
}

/* ===== SIDEBAR ===== */
.sidebar h2 { margin-bottom: 1rem; }
.sidebar nav { display: flex; flex-direction: column; gap: 0.5rem; }
.sidebar a { padding: 0.5rem; border-radius: 4px; }
.sidebar a:hover { background: #f3f4f6; }

/* ===== MŘÍŽKA ČLÁNKŮ (TODO 2) ===== */
.clanky {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-bottom: 2rem;
    margin-top: 1rem;
}

.clanek {
    background: #f9fafb;
    padding: 1rem;
    border-radius: 6px;
    border: 1px solid #e5e7eb;
}
.clanek h3 { margin-bottom: 0.25rem; }
.clanek .autor { font-size: 0.85rem; color: #6b7280; }

/* ===== FEATURE ČLÁNEK (TODO 3) ===== */
.feature {
    grid-column: span 2;
    grid-row: span 2;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: white;
    border: none;
    padding: 2rem;
}
.feature .autor { color: rgba(255, 255, 255, 0.8); }

/* ===== GALERIE (TODO 4) ===== */
.galerie {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
}
.galerie img {
    border-radius: 6px;
    width: 100%;
    height: 150px;
    object-fit: cover;
}

h2 { margin-bottom: 0.5rem; }

/* ============ BONUSY ============ */

/* Bonus A: mobilní layout přes přepsané grid-template-areas */
@media (max-width: 768px) {
    .page {
        grid-template-columns: 1fr;
        grid-template-areas:
            "header"
            "sidebar"
            "main"
            "footer";
    }

    /* Bonusem: na mobilu i články pod sebe */
    .clanky {
        grid-template-columns: 1fr;
    }

    .feature {
        grid-column: span 1;
        grid-row: span 1;
    }
}

/* Bonus B: CTA sekce centrovaná přes place-items */
.cta {
    display: grid;
    place-items: center;
    min-height: 200px;
    background: #6366f1;
    color: white;
    margin: 2rem 0;
    border-radius: 8px;
}

/* Bonus C: asymetrické články (druhý a třetí běžný článek 2× širší) */
.clanek:nth-of-type(3),
.clanek:nth-of-type(4) {
    grid-column: span 2;
}
```

### Co se v řešení děje

**Hlavní layout (TODO 1)**: `grid-template-areas` definuje rozložení jako "obrázek". Header a footer zabírají oba sloupce (jejich jméno se opakuje), sidebar a main jsou vedle sebe.

**Mřížka článků (TODO 2)**: `repeat(3, 1fr)` vytvoří 3 stejně široké sloupce.

**Feature článek (TODO 3)**: `grid-column: span 2` zabírá 2 sloupce, `grid-row: span 2` zabírá 2 řádky. Zbylé články se auto-placement rozmístí do volných buněk.

**Galerie (TODO 4)**: `repeat(auto-fit, minmax(200px, 1fr))` automaticky vytvoří tolik sloupců po min 200 px, kolik se vejde. Žádné media queries.

**Bonus A**: Na mobilu přepíšeme `grid-template-areas` s jedním sloupcem a všemi sekcemi pod sebe. Krásné: layout změna v jednom CSS přepise.

**Bonus B**: `place-items: center` v 1 řádce vycentruje obsah svisle i vodorovně.

**Bonus C**: `:nth-of-type` selector pro asymetrické články, kde každý zabírá 2 sloupce.

---

## Část 3: Tipy pro obhajobu

### Co u obhajoby říct

> *"V zadání jsem dostal HTML magazínu GridZine. Použil jsem CSS Grid pro hlavní layout přes grid-template-areas: definoval jsem rozložení jako vizuální mřížku, kde header a footer zabírají oba sloupce, sidebar a main jsou vedle sebe. Pro mřížku článků v main jsem použil repeat(3, 1fr) pro 3 stejně široké sloupce. Feature článek má grid-column: span 2 a grid-row: span 2, takže zabírá 2x2 buněk, ostatní články auto-placement rozmístí do volných buněk. Pro galerii jsem použil repeat(auto-fit, minmax(200px, 1fr)), což automaticky přizpůsobí počet sloupců šířce okna, bez media queries. V bonusu jsem na mobilu přepsal grid-template-areas na jeden sloupec se vším pod sebou."*
> 

### Klíčové pojmy pro teorii

| Pojem | Rychlá odpověď |
| --- | --- |
| **CSS Grid** | 2D layout systém v CSS pro řádky a sloupce současně |
| **Grid container** | Rodič s `display: grid` |
| **Grid item** | Přímý potomek grid containeru |
| **Grid line** | Vodorovná nebo svislá čára mřížky, číslovaná od 1 |
| **Grid track** | Řádek nebo sloupec (mezi dvěma sousedními liniemi) |
| **Grid cell** | Jedna buňka (průnik řádku a sloupce) |
| **Grid area** | Obdélníková oblast přes víc buněk |
| **`fr` unit** | Díl volného místa (jako flex-grow) |
| **`repeat(N, val)`** | Opakování hodnoty N krát |
| **`minmax(min, max)`** | Min a max velikost |
| **`auto-fit` / `auto-fill`** | Responzivní mřížka bez media queries |
| **`grid-template-areas`** | Grafická definice oblastí pomocí jmen |
| **`grid-column: span N`** | Item zabírá N sloupců |
| **`grid-row: span N`** | Item zabírá N řádků |
| **`place-items: center`** | Centrování v 1 řádku |
| **Implicit grid** | Auto-placement, když je itemů víc než buněk |
| **`grid-auto-flow: dense`** | "Tetris" algoritmus pro zaplnění děr |

### Časté chytáky

| Otázka | Odpověď |
| --- | --- |
| *Rozdíl Grid a Flexbox?* | Flexbox je 1D (řádek NEBO sloupec), Grid je 2D (oba současně). Grid pro layout stránky, Flexbox pro komponenty. |
| *Co je `fr`?* | "Fraction", díl volného místa. `1fr 2fr 1fr` = první 25 %, druhý 50 %, třetí 25 %. Funguje jako flex-grow. |
| *Co dělá `repeat(auto-fit, minmax(200px, 1fr))`?* | Vytvoří tolik sloupců po minimálně 200 px, kolik se vejde do containeru. Pak je roztáhne tak, aby vyplnily celou šířku. Responzivita zdarma. |
| *Rozdíl `auto-fit` a `auto-fill`?* | `auto-fit` roztáhne existující sloupce, aby zaplnily řádek. `auto-fill` ponechá prázdné "neviditelné" sloupce. |
| *Co je `grid-template-areas`?* | Pojmenované oblasti definované jako vizuální mřížka v CSS. Stejné jméno opakované vedle sebe vytvoří jednu velkou oblast. |
| *Co dělá `grid-column: 1 / -1`?* | Item zabere celou šířku (od první linie do poslední). -1 znamená "poslední". |
| *Proč `grid-column: 1 / 3` znamená 2 sloupce?* | Linie 1 a 3 ohraničují 2 sloupce mezi nimi. Linie jsou jako sloupy, sloupce jsou prostor mezi nimi. |
| *Co je `place-items: center`?* | Zkratka pro `align-items: center; justify-items: center`. Centruje itemy v buňkách svisle i vodorovně. |
| *Jak fungují implicitní řádky?* | Když je itemů víc než buněk, Grid vytvoří nové řádky podle obsahu. Velikost lze nastavit přes `grid-auto-rows`. |

### Časté chyby v praktické úloze

- Zapomenutý `display: grid` na rodiči (vlastnosti jako `grid-template-areas` neudělají nic)
- `grid-area: header` na elementu, ale v `grid-template-areas` jméno `header` neexistuje
- `grid-template-areas` s jmény, která netvoří obdélníky (L-tvar nebo T-tvar = error)
- Mřížka 2x2 nazvaná `"a b" "c c"` (správně, `c` je 1x2) ale `"a b" "c b"` (špatně, `b` je nesouvislý L)
- `grid-column: span 2` na itemu, ale grid má jen 1 sloupec
- Chybějící `min-height: 100vh` na hlavním gridu (footer nebude opravdu dole)
- Galerie s `repeat(3, 1fr)` místo `auto-fit` (není responzivní)
- `grid-template-columns: 200px 1fr` ale obsah v main se nezalomí (potřeba `minmax(0, 1fr)`)
- Vnořený grid s vlastním `grid-template-areas`, jména se kryjí s rodičovskými
- Na mobilu zapomenutý přepis `grid-template-columns: 1fr` (sidebar zůstane těsný)
- Použití `flex` pro hlavní layout místo Grid (zadání explicitně chce Grid)
- `gap` nemyslíš jako padding (gap je jen mezi buňkami, ne kolem)