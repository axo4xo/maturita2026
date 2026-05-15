# 3 • Flexbox a rozmístění prvků

> Flexbox, zarovnání, rozmístění, mezery
> 

---

# Část 1: Teorie

### Co je Flexbox

**Flexbox** (CSS Flexible Box Layout) je jednorozměrný layout systém v CSS. Rozmísťuje prvky **buď v řádku, nebo ve sloupci** s velkou kontrolou nad zarovnáním, mezerami a velikostmi.

### Krátký kontext

Před Flexboxem se layout dělal různými hacky:

| Éra | Technika | Problémy |
| --- | --- | --- |
| 90. léta | `<table>` pro layout | Sémanticky špatně, neresponzivní |
| 2000-2010 | `float: left/right` | Komplikované, vyžadovalo clearfix hacks |
| 2010-2015 | `display: inline-block` | Problém s mezerami, vertikálním zarovnáním |
| **2015+** | **Flexbox** | Elegantní, intuitivní, plně podporovaný |
| 2017+ | CSS Grid | Pro 2D layout |

Flexbox finalizován jako W3C standard v roce 2017, prohlížeče ho podporují od roku 2015. Dnes funguje **úplně všude**, žádné prefixy nepotřebuješ.

### K čemu se hodí

- Navbary (logo vlevo, nav vpravo)
- Karty v řadě (rovnoměrně rozložené, stejně vysoké)
- **Vertikální zarovnání** (konečně bez hacků)
- Footer "vždy dole" (sticky footer)
- Layout formulářů
- Holy Grail layout (header / sidebar / main / footer)

> **Flexbox vs Grid:** Flexbox = **1D** (jen řádek nebo jen sloupec). Grid = **2D** (řádky a sloupce současně). Pro layout stránky se kombinují: Grid pro vnější layout, Flexbox uvnitř.
> 

---

### Základní pojmy

![image.png](3%20%E2%80%A2%20Flexbox%20a%20rozm%C3%ADst%C4%9Bn%C3%AD%20prvk%C5%AF/image.png)

| Pojem | Co to je |
| --- | --- |
| **Flex container** | Rodič s `display: flex` |
| **Flex item** | Přímý potomek flex containeru |
| **Main axis** | Hlavní osa, směr řadění prvků (default vodorovně) |
| **Cross axis** | Příčná osa, kolmá k hlavní (default svisle) |
| **main-start, main-end** | Začátek a konec hlavní osy |
| **cross-start, cross-end** | Začátek a konec příčné osy |

> **Klíč k pochopení**: `justify-content` zarovnává podél **hlavní** osy. `align-items` podél **příčné** osy. Když změníš `flex-direction` na `column`, **osy se prohodí** a `justify-content` zarovnává najednou vertikálně.
> 

---

### Vytvoření flex containeru

```css
.container {
    display: flex;         /* nebo inline-flex */
}
```

Tím se **přímí potomci** stanou flex itemy a srovnají se vedle sebe (default `flex-direction: row`).

```html
<div class="container">
    <div>1</div>
    <div>2</div>
    <div>3</div>
</div>
```

Výsledek: `[ 1 ][ 2 ][ 3 ]`

> **Důležité**: Flexbox působí **jen na přímé potomky**. Vnoučata (potomci potomků) se neovlivní, pokud jim taky nedáš `display: flex` na jejich rodiče.
> 

---

### Vlastnosti containeru

### `flex-direction`: směr hlavní osy

```css
.container { flex-direction: row; }            /* default, zleva doprava */
.container { flex-direction: row-reverse; }    /* zprava doleva */
.container { flex-direction: column; }         /* shora dolů */
.container { flex-direction: column-reverse; } /* zdola nahoru */
```

```
row:           [ 1 ][ 2 ][ 3 ]
row-reverse:   [ 3 ][ 2 ][ 1 ]

column:        [ 1 ]       column-reverse:  [ 3 ]
               [ 2 ]                        [ 2 ]
               [ 3 ]                        [ 1 ]
```

> **Pozor**: `column` prohazuje hlavní a příčnou osu. `justify-content` pak zarovnává **vertikálně**, `align-items` **horizontálně**. Trápí mě to taky.
> 

### `flex-wrap`: halamování řádků

```css
.container { flex-wrap: nowrap; }       /* default, vše na jednom řádku */
.container { flex-wrap: wrap; }         /* zalomí na další řádek */
.container { flex-wrap: wrap-reverse; } /* zalomí opačně */
```

```
nowrap (vše na jeden řádek, prvky se případně zmenší):
[ 1 ][ 2 ][ 3 ][ 4 ][ 5 ][ 6 ]

wrap (na nový řádek, když se nevejdou):
[ 1 ][ 2 ][ 3 ]
[ 4 ][ 5 ][ 6 ]
```

### `flex-flow`: zkratka

```css
.container { flex-flow: row wrap; }
/* je to to samé jako:
   flex-direction: row;
   flex-wrap: wrap;
*/
```

### `justify-content`: zarovnání podél HLAVNÍ osy

```css
.container { justify-content: flex-start; }     /* default, k začátku */
.container { justify-content: flex-end; }       /* na konec */
.container { justify-content: center; }         /* na střed */
.container { justify-content: space-between; }  /* mezery MEZI prvky, krajní u kraje */
.container { justify-content: space-around; }   /* mezery KOLEM prvků */
.container { justify-content: space-evenly; }   /* mezery STEJNĚ velké včetně krajních */
```

```
flex-start:     [1][2][3]................
flex-end:       ................[1][2][3]
center:         ........[1][2][3]........

space-between:  [1]........[2]........[3]
                (krajní u kraje, zbytek mezi)

space-around:   ....[1]....[2]....[3]....
                (každý prvek má kolem polovinu)

space-evenly:   ......[1]......[2]......[3]......
                (všechny mezery stejné)
```

### `align-items`: zarovnání podél PŘÍČNÉ osy (jednoho řádku)

```css
.container { align-items: stretch; }    /* default, prvky se roztáhnou na výšku */
.container { align-items: flex-start; } /* k hornímu okraji */
.container { align-items: flex-end; }   /* ke spodnímu okraji */
.container { align-items: center; }     /* na střed (vertikálně) */
.container { align-items: baseline; }   /* zarovnat podle textu (baseline písmen) */
```

```
stretch (default):             center:
┌─────────────┐               ┌─────────────┐
│[ ][ ][ ][ ] │               │             │
│[ ][ ][ ][ ] │               │[1][2][3][4] │
│[ ][ ][ ][ ] │               │             │
└─────────────┘               └─────────────┘
(prvky stejně vysoké)         (prvky uprostřed)
```

### `align-content`: zarovnání více řádků (jen u `flex-wrap: wrap`)

```css
.container {
    flex-wrap: wrap;
    align-content: flex-start | flex-end | center | space-between | space-around | stretch;
}
```

> **Rozdíl `align-items` vs `align-content`:**
> 
> - `align-items` zarovnává **prvky v rámci jednoho řádku**
> - `align-content` zarovnává **víc řádků navzájem** (smysl jen při `wrap`)

### `gap`: mezery mezi prvky

```css
.container { gap: 1rem; }              /* mezera mezi všemi (řádky i sloupci) */
.container { gap: 1rem 2rem; }         /* row-gap column-gap */
.container { row-gap: 1rem; }
.container { column-gap: 2rem; }
```

> **`gap` je dnes preferovaný způsob mezery**, nahrazuje stará řešení s `margin` na jednotlivé prvky. Funguje krásně i s `flex-wrap`.
> 

---

### Vlastnosti flex itemů

### `flex-grow`: kolik volného místa zabere navíc

```css
.item { flex-grow: 0; }   /* default, neroste */
.item { flex-grow: 1; }   /* rozdělí volné místo rovnoměrně */
.item { flex-grow: 2; }   /* dostane 2× víc volného místa než ostatní s grow: 1 */
```

```html
<div class="container">
    <div style="flex-grow: 1">A</div>
    <div style="flex-grow: 2">B</div>   <!-- 2× větší podíl volného místa -->
    <div style="flex-grow: 1">C</div>
</div>
```

```
[  A  ][      B      ][  C  ]
   1         2           1
```

### `flex-shrink`: kolik se zmenší, když není dost místa

```css
.item { flex-shrink: 1; }   /* default, smršťuje se proporcionálně */
.item { flex-shrink: 0; }   /* nikdy se nezmenší (typicky pro logo/ikonu) */
.item { flex-shrink: 2; }   /* smršťuje se 2× rychleji */
```

### `flex-basis`: výchozí velikost před růstem nebo smršťováním

```css
.item { flex-basis: auto; }    /* default, podle obsahu nebo width */
.item { flex-basis: 200px; }   /* výchozí 200 px */
.item { flex-basis: 0; }       /* začne od 0, pak grow rozdělí prostor přesně */
```

### `flex`: zkratka (grow / shrink / basis)

> Nejčastější způsob nastavení, doporučuje se používat zkratku.
> 

```css
.item { flex: 1; }            /* = flex: 1 1 0    roste, smršťuje, basis 0 */
.item { flex: 0 0 200px; }    /* fixní 200 px, nemění se */
.item { flex: auto; }         /* = flex: 1 1 auto výchozí podle obsahu */
.item { flex: none; }         /* = flex: 0 0 auto pevné podle obsahu */
.item { flex: 2 1 200px; }    /* roste 2×, smršťuje 1×, basis 200 px */
```

> **Pravidlo:**
> 
> - `flex: 1` na všech itemech = **stejně široké**
> - Jeden má `flex: 2` a další `flex: 1` = první je **dvojnásobný**

### `align-self`: přepsat `align-items` pro jeden item

```css
.item { align-self: center; }
.item { align-self: flex-end; }
```

Tato vlastnost ovlivní **jen tento konkrétní item**, ostatní zůstanou podle nastavení rodiče.

### `order`: změnit pořadí

```css
.item { order: 0; }     /* default */
.item { order: -1; }    /* posune dopředu */
.item { order: 1; }     /* posune dozadu */
```

```html
<div class="container">
    <div style="order: 2">1</div>    <!-- vidíš jako třetí -->
    <div style="order: 1">2</div>    <!-- vidíš jako druhý -->
    <div style="order: -1">3</div>   <!-- vidíš jako první -->
</div>
```

> **Důležité**: `order` mění **vizuální pořadí**, NE pořadí v DOM. Pro **screen readery a klávesovou navigaci** platí původní HTML pořadí. Nepoužívej `order` pro významné přeskupení obsahu.
> 

---

### Časté patterns

### Vertikální + horizontální centrování

Klasický problém, který byl před Flexboxem peklo. Dnes:

```css
.parent {
    display: flex;
    justify-content: center;   /* horizontálně */
    align-items: center;       /* vertikálně */
    min-height: 100vh;         /* aby bylo co centrovat */
}
```

### Navbar: logo vlevo, nav vpravo

```html
<nav class="navbar">
    <div class="logo">Logo</div>
    <ul class="links"><li>...</li></ul>
</nav>
```

```css
.navbar {
    display: flex;
    justify-content: space-between;   /* logo vlevo, nav vpravo */
    align-items: center;              /* svisle uprostřed */
    padding: 1rem 2rem;
}
```

### Karty stejné výšky v řadě

```css
.cards {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}
.card {
    flex: 1 1 250px;   /* roste, smršťuje, min šířka 250 px */
}
```

> Default `align-items: stretch` zajistí, že všechny karty jsou **stejně vysoké**, i když mají různě dlouhý obsah.
> 

### Sticky footer (footer vždy dole)

```css
body {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}
main {
    flex: 1;   /* main zabere všechen volný prostor */
}
/* footer se přirozeně zarazí na konec */
```

Princip: body je flex column s minimální výškou viewport. Main má `flex: 1`, takže "tlačí" footer dolů, i když má main málo obsahu.

### Holy Grail layout

```css
body {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.middle {
    display: flex;
    flex: 1;   /* zabere zbytek výšky */
}

.sidebar { flex: 0 0 200px; }   /* pevná šířka 200 px */
.main    { flex: 1; }           /* zbytek šířky */
```

```
┌────────── header ──────────┐
├──────┬─────────────┬───────┤
│      │             │       │
│ side │    main     │  ad   │
│      │             │       │
├──────┴─────────────┴───────┤
│           footer           │
└────────────────────────────┘
```

### Form layout

```css
.form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.form-row {
    display: flex;
    gap: 1rem;
    align-items: center;
}

.form-row label {
    flex: 0 0 120px;   /* pevný label */
}

.form-row input {
    flex: 1;            /* input zabere zbytek */
}
```

### Reverz pořadí pro mobil (pomocí media query)

```css
.hero {
    display: flex;
    flex-direction: row;     /* desktop: text vlevo, obrázek vpravo */
}

@media (max-width: 600px) {
    .hero {
        flex-direction: column;          /* mobil: pod sebou */
    }
    /* nebo flex-direction: column-reverse pokud chceš obrázek nahoře */
}
```

---

### Flexbox vs Grid: kdy co použít

| Použij **Flexbox** | Použij **Grid** |
| --- | --- |
| 1D layout (jen řádek, nebo jen sloupec) | 2D layout (řádky × sloupce současně) |
| Komponenty (navbar, karta, formulář) | Layout celé stránky |
| Velikost prvků určuje obsah | Velikost prvků určuje rodič |
| Rozmísťuješ děti rodičem | Umisťuješ položky do pevné mřížky |

V praxi: **layout stránky = Grid (vnější), jednotlivé sekce uvnitř = Flexbox (vnitřní)**.

---

### Cheat sheet: Flex Container

| Vlastnost | Hodnoty | Co dělá |
| --- | --- | --- |
| `display` | `flex`, `inline-flex` | Aktivuje flexbox |
| `flex-direction` | `row` / `row-reverse` / `column` / `column-reverse` | Směr hlavní osy |
| `flex-wrap` | `nowrap` / `wrap` / `wrap-reverse` | Zalamování řádků |
| `flex-flow` | Shorthand pro direction + wrap |  |
| `justify-content` | `flex-start` / `flex-end` / `center` / `space-between` / `space-around` / `space-evenly` | Zarovnání po hlavní ose |
| `align-items` | `stretch` / `flex-start` / `flex-end` / `center` / `baseline` | Zarovnání po příčné ose (jeden řádek) |
| `align-content` | Jako justify-content | Zarovnání víc řádků |
| `gap` | délka | Mezery mezi itemy |

### Cheat sheet: Flex Item

| Vlastnost | Hodnoty | Co dělá |
| --- | --- | --- |
| `flex-grow` | Číslo (default 0) | Poměr růstu |
| `flex-shrink` | Číslo (default 1) | Poměr smršťování |
| `flex-basis` | Délka nebo `auto` (default `auto`) | Výchozí velikost |
| `flex` | Shorthand grow/shrink/basis | Nejčastější způsob |
| `align-self` | Jako align-items | Přepíše align-items pro jeden item |
| `order` | Celé číslo (default 0) | Změna pořadí |

---

### Časté chyby

| Chyba | Důsledek | Řešení |
| --- | --- | --- |
| Aplikuju `flex` na vnouče místo dítěte | Nefunguje (flex působí jen na přímé potomky) | Dát flex na rodiče správného itemu |
| `justify-content: center` ve `flex-direction: column` necentruje horizontálně | Hlavní osa je teď svislá | Použít `align-items: center` |
| `align-content` nefunguje | Container nemá `flex-wrap: wrap` nebo má jen 1 řádek | Přidat `flex-wrap: wrap` |
| Item přetéká container | Default min-width je `auto`, nezmenší se | Nastavit `min-width: 0` na item |
| `margin: auto` ve flex containeru se chová divně | Margin auto zabírá veškerý volný prostor | Buď to znát jako trik, nebo `gap` |
| Když změním pořadí přes `order`, screen reader to nevidí | Visual reorder ≠ DOM reorder | Pro významné přeskupení změň HTML, ne CSS |

---

# Část 2: Praktická úloha

### Co může praktická úloha obsahovat

Typická Flexbox praktika:

- **Sticky footer**: body jako flex column, main flex: 1, footer vždy dole
- **Navbar pattern**: logo vlevo, nav vpravo, vertikálně zarovnané (`space-between` + `align-items: center`)
- **Hero sekce**: text + tlačítko (nebo obrázek) vedle sebe, na mobilu pod sebou
- **Karty se stejnou výškou**: flex container s gap, karty s `flex: 1 1 ...`
- **`flex-grow` v různých poměrech**: jedna karta širší než ostatní
- **`order` pro přeskupení**: prvek v HTML poslední, vizuálně první
- **`flex: 0 0 ...`** pro neměnné prvky (logo, avatar, ikona)
- **Responzivita**: na mobilu změna `flex-direction` z `row` na `column`

### Příklad zadání: FlexFit Studio

Vytvoř stránku fitness studia. HTML kostra a základní styly jsou napsané, doplnit Flexboxem:

1. **Sticky footer**: body jako flex column, footer vždy dole
2. **Navbar**: logo vlevo, navigace vpravo, vertikálně zarovnané
3. **Hero sekce**: text vlevo, tlačítko vpravo, svisle uprostřed
4. **Karta s lektorem**: fotka vlevo, info vpravo, vertikálně uprostřed
5. **3 karty kurzů**: různě široké (`flex-grow` s různými poměry), "Bestseller" karta musí být **vizuálně první** (přes `order`, ne přes HTML pořadí)
6. **Footer**: copyright vlevo, sociální ikony vpravo

**Bonusy:**

- Karta lektora na mobilu jako sloupec (avatar nahoře, text dole)
- Hero responzivně do sloupce na mobilu
- Vertikální varianta navbaru (přepínací třída)

### Řešení: kompletní `styly.css`

```css
/* ===== RESET ===== */
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: system-ui, sans-serif; line-height: 1.6; color: #222; }
img { max-width: 100%; display: block; }
a { color: inherit; text-decoration: none; }

/* ===== STICKY FOOTER (TODO 1) ===== */
body {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

main {
    flex: 1;   /* hlavní obsah si vezme všechen volný prostor */
}

/* ===== NAVBAR (TODO 2) ===== */
.navbar {
    background: #1f2937;
    color: white;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;   /* logo vlevo, nav vpravo */
    align-items: center;              /* svisle uprostřed */
}

.logo { font-size: 1.5rem; font-weight: bold; }

.nav {
    display: flex;
    gap: 1.5rem;
}

/* ===== HERO (TODO 3) ===== */
.hero {
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: white;
    padding: 3rem 2rem;
    min-height: 50vh;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 2rem;
}

.hero-text h1 { font-size: 2.5rem; margin-bottom: 1rem; }

.btn {
    display: inline-block;
    padding: 0.75rem 2rem;
    background: white;
    color: #6366f1;
    border-radius: 4px;
    font-weight: bold;
    white-space: nowrap;
}

/* ===== SEKCE ===== */
.sekce { padding: 3rem 2rem; max-width: 1200px; margin: 0 auto; }
.sekce h2 { margin-bottom: 1.5rem; text-align: center; }

/* ===== KARTA LEKTORA (TODO 4) ===== */
.karta-lektora {
    background: #f3f4f6;
    padding: 1.5rem;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 2rem;
}

.avatar {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    object-fit: cover;
    flex: 0 0 200px;   /* neroste, nesmršťuje se, fixních 200 px */
}

.karta-info h3 { margin-bottom: 0.5rem; }
.karta-info .role { color: #6366f1; font-weight: bold; margin-bottom: 0.5rem; }

/* ===== KURZY (TODO 5) ===== */
.kurzy {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
}

.kurz {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 1.5rem;
    flex: 1 1 200px;   /* roste, smršťuje, min 200 px */
}

/* TODO 5a: hlavní kurz dvojnásobně široký */
.kurz.hlavni {
    flex: 2 1 200px;   /* roste 2× rychleji */
    background: #fef3c7;
}

/* TODO 5b: bestseller je v HTML poslední, ale vizuálně první */
.kurz.bestseller {
    order: -1;
    border-color: #f59e0b;
    border-width: 2px;
}

.kurz h3 { margin-bottom: 0.5rem; }
.kurz .cena { margin-top: 1rem; font-weight: bold; color: #6366f1; }

/* ===== FOOTER (TODO 6) ===== */
.footer {
    background: #1f2937;
    color: white;
    padding: 1.5rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.socky {
    display: flex;
    gap: 1rem;
}

/* ============ BONUSY ============ */

/* Bonus A: karta lektora na mobilu jako sloupec */
@media (max-width: 600px) {
    .karta-lektora {
        flex-direction: column;
        text-align: center;
    }

    .avatar {
        flex: 0 0 auto;   /* už nemusí být přesně 200, může se přizpůsobit */
    }
}

/* Bonus B: hero responzivně do sloupce */
@media (max-width: 600px) {
    .hero {
        flex-direction: column;
        text-align: center;
    }

    .hero-text h1 { font-size: 1.75rem; }
}

/* Bonus C: vertikální navbar přes přepínací třídu */
.navbar.vertical {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
}

.navbar.vertical .nav {
    flex-direction: column;
    gap: 0.5rem;
}
```

---

## Část 3: Tipy pro obhajobu

### Co u obhajoby říct

> *"V zadání jsem dostal HTML pro fitness studio FlexFit a doplnil layout pomocí Flexboxu. Pro sticky footer jsem nastavil body jako flex column s min-height 100vh a main s flex: 1, takže main vyplní celý dostupný prostor a footer se zarazí dolů. Navbar a footer používají justify-content: space-between s align-items: center, klasický pattern. V hero sekci jsem stejně tak nastavil text vlevo a tlačítko vpravo přes space-between. Karta lektora má flex s align-items: center, avatar je flex: 0 0 200px (neměnný), info část se přizpůsobí. U kurzů jsem použil flex-wrap pro responzivitu a flex-grow pro různé šířky: běžné karty mají flex 1, hlavní kurz flex 2 (dvakrát širší). Bestseller karta je v HTML poslední, ale order: -1 ji vizuálně posune na první místo, beze změny DOM pořadí."*
> 

### Klíčové pojmy pro teorii

| Pojem | Rychlá odpověď |
| --- | --- |
| **Flexbox** | 1D layout systém v CSS pro řádek nebo sloupec |
| **Flex container** | Rodič s `display: flex` |
| **Flex item** | Přímý potomek flex containeru |
| **Main axis** | Hlavní osa, default vodorovně |
| **Cross axis** | Příčná osa, kolmá k hlavní |
| **`flex-direction`** | Směr hlavní osy: row / column / row-reverse / column-reverse |
| **`flex-wrap`** | Zalamování: nowrap / wrap / wrap-reverse |
| **`justify-content`** | Zarovnání po hlavní ose |
| **`align-items`** | Zarovnání po příčné ose (jeden řádek) |
| **`align-content`** | Zarovnání víc řádků (jen s wrap) |
| **`gap`** | Mezery mezi prvky (preferovaný způsob) |
| **`flex-grow`** | Poměr růstu (default 0) |
| **`flex-shrink`** | Poměr smršťování (default 1) |
| **`flex-basis`** | Výchozí velikost (default auto) |
| **`flex: 1`** | Zkratka, item roste rovnoměrně |
| **`flex: 0 0 200px`** | Pevná velikost 200 px, neroste, nesmršťuje |
| **`align-self`** | Přepsat align-items pro jeden item |
| **`order`** | Změna vizuálního pořadí (ne DOM) |

### Časté chytáky

| Otázka | Odpověď |
| --- | --- |
| *Rozdíl Flexbox a Grid?* | Flexbox je 1D (jen řádek nebo jen sloupec). Grid je 2D (řádky a sloupce současně). Pro celý layout se kombinují. |
| *Co je hlavní a co příčná osa?* | Při `flex-direction: row` je hlavní osa vodorovná, příčná svislá. Při `column` se prohodí. |
| *Justify-content a align-items?* | Justify-content je po hlavní ose, align-items po příčné. Tedy záleží na flex-direction. |
| *Co dělá `flex: 1`?* | Zkratka pro `flex: 1 1 0` (roste, smršťuje, basis 0). Item bude rovnoměrně sdílet všechen prostor s ostatními `flex: 1`. |
| *Rozdíl `gap` a `margin`?* | Gap je mezi prvky uvnitř containeru, nepřidává ze stran. Margin přidává všude, včetně okrajů. Gap je modernější a čistější. |
| *Kdy `order` použít a kdy ne?* | Pro vizuální přeskupení v UI, ne pro významné změny obsahu (kvůli accessibility). |
| *Proč nevidím flex účinek na vnoučatech?* | Flexbox působí jen na **přímé** potomky. Vnoučata musí mít svého vlastního flex rodiče. |
| *Jak udělat sticky footer?* | Body jako flex column s min-height 100vh, main s `flex: 1`, footer se zarazí dolů. |

### Časté chyby v praktické úloze

- Zapomenutý `display: flex` na rodiči (vlastnosti jako `justify-content` na něm bez flex containeru nefungují)
- Aplikace flex vlastností na nesprávnou úroveň (vnouče místo dítěte)
- `justify-content: center` ve `flex-direction: column` (centruje pak svisle, ne vodorovně)
- Sticky footer bez `min-height: 100vh` na body (footer nebude opravdu dole)
- Sticky footer bez `flex: 1` na main (main bude jen tak velký jako obsah)
- `order` na **textových odstavcích** v článku (rozbije čtení screen readeru)
- Avatar v kartě lektora bez `flex: 0 0 ...` (zmenší se, když je málo místa)
- Karty s `flex: 1` bez `flex-wrap: wrap` (na mobilu se stlačí, nezalomí)
- Hardcoded šířky v pixelech místo `flex` (špatně responzivní)
- Margin místo `gap` na flex itemech (komplikovanější a má problémy s krajními prvky)
- Kombinace `column` s `align-items: center` a očekávat horizontální centrování (jo, ale jde po správné ose, jen je to mateoucí)