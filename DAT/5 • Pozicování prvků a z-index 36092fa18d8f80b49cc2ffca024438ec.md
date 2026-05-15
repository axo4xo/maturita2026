# 5 • Pozicování prvků a z-index

> Pozicování: absolutní, relativní, sticky, fixed, obtékání textem, stacking context (z-index)
> 

> **Formát:** 30 min praktická úloha, 15 min obhajoba + teorie. Teorie pokrývá všech 5 hodnot `position`, float pro obtékání, z-index a stacking context, plus kompletní řešení úlohy.
> 

---

# Část 1: Teorie

### Co znamená "pozicování"

V CSS existuje několik způsobů, jak určit, **kde se prvek na stránce zobrazí**. Hlavní mechanismy:

1. **Normální tok dokumentu** (default): prvky jdou jeden za druhým
2. **Flexbox**: 1D layout v řádku nebo sloupci (otázka 3)
3. **CSS Grid**: 2D layout (otázka 4)
4. **Pozicování přes `position`**: vyjmutí z toku, ruční umístění
5. **Float**: prvek se "vyplaví" doleva nebo doprava, text ho obtéká

Tahle otázka je o posledních dvou.

---

### `position`: 5 hodnot

```css
.element {
    position: static;      /* default, normální tok */
    position: relative;    /* posun od původní pozice */
    position: absolute;    /* vyjmutí z toku, podle pozicovacího rodiče */
    position: fixed;       /* podle viewportu */
    position: sticky;      /* hybrid: tok + sticky efekt */
}
```

### `position: static` (default)

Default chování. Prvek je v normálním toku, vlastnosti `top/right/bottom/left/z-index` ho neovlivní.

```css
.element {
    position: static;     /* explicitní zápis, většinou ho nepíšeš */
}
```

Static má své místo: vrátit prvek do normálního toku po nějakém media query přepise.

### `position: relative`

Prvek **zůstává v toku**, ale lze ho posunout od jeho původní pozice pomocí `top/right/bottom/left`. **Místo, které původně zabíral, zůstává prázdné** (ostatní prvky se neposunou).

```css
.element {
    position: relative;
    top: 20px;
    left: 30px;
}
```

![image.png](5%20%E2%80%A2%20Pozicov%C3%A1n%C3%AD%20prvk%C5%AF%20a%20z-index/image.png)

**Hlavní použití `relative` v praxi**: vytvořit **kontext pro absolutně pozicované děti**, i bez offsetů.

```css
.parent {
    position: relative;   /* sám se neposouvá, jen je referenční bod pro děti */
}
.child {
    position: absolute;
    top: 0;
    right: 0;             /* posune se k pravému hornímu rohu .parent */
}
```

### `position: absolute`

Prvek se **vyjme z normálního toku** (jako by tam nebyl, ostatní prvky se posunou) a umístí se podle **nejbližšího pozicovaného předka** (předka s position relative/absolute/fixed/sticky). Pokud žádný takový předek neexistuje, umístí se podle `<html>` (viewportu).

```css
.parent {
    position: relative; /* nutné, aby .child fungoval relativně k rodiči */
}
.child {
    position: absolute;
    top: 0;
    right: 0;
}
```

**Důsledky:**

- Prvek **nezabírá místo** (jako by tam nebyl)
- Inline elementy se stanou `block` nebo `inline-block`
- `width: auto` znamená "podle obsahu" (ne podle rodiče)
- Lze ho roztáhnout přes celý containing block pomocí `top: 0; right: 0; bottom: 0; left: 0`

> **Klíčový pojem: containing block.** To je prvek, podle kterého se počítá `top/right/bottom/left`. Pro absolute je to nejbližší pozicovaný předek. Pro fixed je to viewport.
> 

### `position: fixed`

Prvek **vyjmut z toku** a pozicován **podle viewportu** (okna prohlížeče). Při scrollování **zůstává na svém místě**.

```css
.fab {
    position: fixed;
    bottom: 30px;
    right: 30px;
}
```

Použití:

- Floating action button (FAB)
- Cookies banner
- Modální dialog
- Chat widget v pravém dolním rohu
- Fixed navbar (i když dnes většinou `sticky`)

> **Pozor**: Fixed prvek se chová podle viewportu **pokud žádný předek nemá `transform`, `perspective` nebo `filter`**. Tyto vlastnosti vytváří nový containing block i pro fixed. Klasický bug.
> 

### `position: sticky`

Hybrid: prvek je **v normálním toku**, ale při scrollu se v určitém momentu "přilepí" k okraji a zůstává viditelný.

```css
.navbar {
    position: sticky;
    top: 0;          /* přilepí se nahoře viewportu */
}
```

Sticky se aktivuje, když:

1. Prvek je v toku (zabírá místo)
2. Začne se scrollovat
3. Hranice prvku dosáhne nastavené pozice (`top: 0`)
4. Prvek se "zafixuje" a drží se tam
5. Když rodič odscrolluje pryč, prvek odejde s ním

```
Stav 1 (před):    Stav 2 (scrolluje):    Stav 3 (rodič pryč):
═════ navbar ═══  ═════ navbar ═══       ──── obsah ────
──── obsah ────   ──── obsah ────        ──── obsah ────
                                          ═════ navbar ═══
                                          (drží se s rodičem)
```

**Důležité:** sticky funguje jen v rámci **scrollovacího kontextu rodiče**. Pokud rodič má `overflow: hidden` nebo `overflow: auto`, sticky se přilepí v něm, ne ke viewportu.

---

### `top`, `right`, `bottom`, `left`, `inset`

Tyto vlastnosti **fungují jen na pozicovaných prvcích** (non-static).

```css
.element {
    position: absolute;
    top: 20px;       /* 20 px od horního okraje containing blocku */
    right: 0;        /* přilepený k pravému okraji */
    bottom: 30px;    /* 30 px od spodního okraje */
    left: 50%;       /* polovina šířky rodiče zleva */
}
```

### `inset` shorthand (moderní CSS)

```css
.element {
    inset: 0;                /* = top:0 right:0 bottom:0 left:0 */
    inset: 10px 20px;        /* = top/bottom: 10px, left/right: 20px */
    inset: 10px 20px 30px 40px;  /* všech 4 stran */
}
```

`inset: 0` na absolutním prvku ho roztáhne přes celý containing block. Skvělé pro modální backdrop.

### Co dělá `width: auto` u absolute?

U `position: absolute` se chová jinak než u normálního prvku:

- **Normálně**: `width: auto` = 100% šířky rodiče
- **Absolute**: `width: auto` = podle obsahu

Pokud nastavíš `left` i `right`, šířka se dopočítá z těchto hodnot:

```css
.element {
    position: absolute;
    left: 20px;
    right: 20px;
    /* width se dopočítá: viewport - 40px */
}
```

---

### Centrování absolutního prvku

Klasický trik:

```css
.modal {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
```

Jak to funguje:

1. `top: 50%` posune **levý horní roh** prvku do středu rodiče
2. Prvek je teď posunutý doprava dolů
3. `transform: translate(-50%, -50%)` posune prvek o **polovinu jeho vlastní šířky doleva a polovinu výšky nahoru**
4. Výsledek: prvek je dokonale vystředěný

Moderní alternativa (jednodušší):

```css
.parent {
    position: relative;
    display: grid;
    place-items: center;
}
.child {
    position: absolute;
}
```

Nebo s `inset` na absolute prvku a `margin: auto`:

```css
.child {
    position: absolute;
    inset: 0;
    margin: auto;
    width: 300px;
    height: 200px;
}
```

---

### `float` a `clear`

Před Flexboxem a Gridem byl **float** hlavním layout mechanismem. Dnes se používá hlavně pro **obtékání textu kolem obrázku**.

```css
img.vlevo {
    float: left;
    margin-right: 1rem;
    margin-bottom: 0.5rem;
}
```

```html
<p>
    <img src="..." class="vlevo">
    Tento dlouhý text se bude obtékat kolem obrázku zprava a zezdola.
    Obrázek je vlevo, text plyne kolem něj.
</p>
```

```
┌──────┐
│      │ Text obtéká
│ IMG  │ obrázek
│      │ zprava
└──────┘
A tady už pokračuje plnou
šířkou.
```

### `clear`: zrušit obtékání

```css
.next-section {
    clear: both;     /* tento prvek nesmí obtékat nic vedle sebe */
}
```

Hodnoty:

- `clear: left`: nebude vedle prvků s float: left
- `clear: right`: nebude vedle prvků s float: right
- `clear: both`: nebude vedle žádných

### Modern alternative: `shape-outside`

```css
img.vlevo {
    float: left;
    shape-outside: circle(50%);     /* text obtéká kruh, ne obdélník */
}
```

> **Důležité:** Pro layout dnes Float nepoužívej, jsou Flexbox/Grid. Float zachovej **jen pro skutečné obtékání textem v článku**.
> 

---

### z-index a stacking context

### z-index: pořadí překrývání

Když se prvky překrývají, **z-index určuje, který je nahoře**. Vyšší číslo = nahoře.

```css
.element-a { z-index: 1; }       /* dole */
.element-b { z-index: 10; }      /* nahoře */
.element-c { z-index: 999; }     /* ještě výš */
.element-d { z-index: -1; }      /* za vším */
```

### Kdy funguje z-index?

Funguje na prvcích, které vytvářejí **stacking context**. Hlavní triggery:

1. **`position: relative/absolute/fixed/sticky` + jakýkoli `z-index`** (typický případ)
2. **Flex item s `z-index`** (nepotřebuje position!)
3. **Grid item s `z-index`** (nepotřebuje position!)
4. `opacity` menší než 1
5. `transform` jiný než `none`
6. `filter` jiný než `none`
7. `mix-blend-mode` jiný než `normal`
8. `isolation: isolate`
9. `will-change` na některé vlastnosti

> **Drobnost**: "z-index funguje jen u prvků s position jiným než static" je staré pravidlo, **které dnes není úplně přesné**. Flex a Grid itemy mohou mít z-index i bez position, protože automaticky vytváří stacking context. Pro klasické case ale platí: bez `position` z-index nefunguje.
> 

### Stacking context (kontext řazení)

Když prvek vytvoří stacking context, vytvoří **uzavřený svět** pro řazení svých dětí. Z-index dětí se počítá **jen v rámci tohoto kontextu**.

```html
<div class="parent" style="position: relative; z-index: 1">
    <div class="child" style="position: absolute; z-index: 9999">
        Dítě s vysokým z-index
    </div>
</div>

<div class="overlay" style="position: absolute; z-index: 2">
    Tento prvek je VŽDY NAD .child!
</div>
```

I když má `.child` z-index 9999, je v stacking contextu rodiče s z-index 1. `.overlay` s z-index 2 je výše v hlavním kontextu, takže ho překryje. Klasický **pain in the ass** moment.

### Vizualizace

```
Hlavní stacking context (root):
├─ .overlay (z-index: 2)            ← bude úplně nahoře
└─ .parent (z-index: 1) ─────────── ← stacking context
   ├─ .child (z-index: 9999)        ← nahoře v parentu
   └─ .another-child (z-index: 100)
```

### Negativní z-index

Záporné hodnoty posunou prvek **pod** ostatní v rámci stacking contextu. Funguje, ale často vyústí v problémy:

```css
.background-decoration {
    position: absolute;
    z-index: -1;        /* za obsahem */
}
```

Stacking context **kořenu** (typicky `<body>`) má z-index 0. Negativní hodnoty jsou tedy pod nulou ale stále nad pozadím.

---

### Pseudoelementy a pozicování

`::before` a `::after` lze pozicovat jako kterýkoli jiný element.

```css
.element {
    position: relative;       /* aby pseudoelement věděl, kam se umístit */
}

.element::after {
    content: "";              /* MUSÍ být, jinak se pseudoelement nezobrazí */
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(to right, #6366f1, #ec4899);
}
```

Použití:

- Dekorativní podtržení nadpisů
- Tooltipy
- Ikony bez `<img>` tagu
- Quote marks u citací
- Custom checkbox / radio button

---

### Časté patterns

### Sticky navbar

```css
.navbar {
    position: sticky;
    top: 0;
    z-index: 100;     /* nad ostatní obsah */
    background: white;
}
```

### Hero s textem přes obrázek

```html
<section class="hero">
    <img src="..." class="hero-img">
    <div class="hero-text">
        <h1>Nadpis</h1>
    </div>
</section>
```

```css
.hero {
    position: relative;    /* containing block pro hero-text */
}
.hero-img {
    width: 100%;
}
.hero-text {
    position: absolute;
    bottom: 30px;
    left: 30px;
    color: white;
}
```

### Karta s badge "NEW" v rohu

```css
.card {
    position: relative;
}
.badge {
    position: absolute;
    top: -10px;        /* mírně vyčnívá ven */
    right: -10px;
    background: #ef4444;
    color: white;
    padding: 4px 10px;
    border-radius: 999px;
}
```

### Floating Action Button (FAB)

```css
.fab {
    position: fixed;
    bottom: 30px;
    right: 30px;
    z-index: 50;
    width: 56px;
    height: 56px;
    border-radius: 50%;
}
```

### Modal s backdrop

```css
.modal-backdrop {
    position: fixed;
    inset: 0;                       /* roztáhne přes celý viewport */
    background: rgba(0, 0, 0, 0.5);
    display: grid;
    place-items: center;
    z-index: 1000;
}

.modal {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    max-width: 400px;
    width: 90%;
}
```

### Image s text wrap (článek)

```css
img.vlevo {
    float: left;
    margin-right: 1rem;
    margin-bottom: 0.5rem;
    max-width: 250px;
}
```

### Tooltip s pseudoelementem

```css
.btn[data-tooltip] {
    position: relative;
}

.btn[data-tooltip]:hover::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: 100%;            /* nad tlačítkem */
    left: 50%;
    transform: translateX(-50%);
    background: #1f2937;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    white-space: nowrap;
}
```

---

### Cheat sheet

| Hodnota `position` | Vyňato z toku? | Kontext (containing block) | Posun přes top/left? |
| --- | --- | --- | --- |
| `static` | Ne | Ne aplikovatelné | Ne |
| `relative` | Ne | Vlastní původní pozice | Ano |
| `absolute` | Ano | Nejbližší pozicovaný předek | Ano |
| `fixed` | Ano | Viewport | Ano |
| `sticky` | Ne (do trigger) | Scroll kontext rodiče | Ano |

| Vlastnost | Co dělá |
| --- | --- |
| `top`, `right`, `bottom`, `left` | Posun od hran containing blocku |
| `inset` | Shorthand pro všechny čtyři |
| `z-index` | Pořadí překrývání (vyšší = nahoře) |
| `float` | Plovoucí prvek, text obtéká |
| `clear` | Zrušit obtékání (clear: both) |
| `transform: translate(-50%, -50%)` | Centrovací trik pro absolute |

---

### Časté chyby

| Chyba | Důsledek | Řešení |
| --- | --- | --- |
| Absolute dítě bez relative rodiče | Posouvá se podle `<html>` | Přidat `position: relative` na rodiče |
| z-index nefunguje | Chybí `position` (nebo flex/grid) | Přidat `position: relative` |
| Sticky se neaktivuje | Rodič má `overflow: hidden/auto` | Změnit overflow rodiče |
| Sticky se aktivuje, ale špatně | Chybí `top: 0` (nebo bottom/left/right) | Nastavit offset |
| Fixed se neumístí podle viewportu | Předek má `transform` | Přemístit fixed prvek nebo odstranit transform |
| z-index 9999 nepřebije z-index 2 | Jsou v různých stacking contexts | Pochopit hierarchie kontextů |
| Float prvek "vyleze" z rodiče | Float vyjímá z toku, rodič se nezná výšku | `clearfix` hack nebo `overflow: hidden` na rodiči |
| Pseudoelement se nezobrazí | Chybí `content: ""` | Přidat content vlastnost |
| Absolute v inline rodiči | Chyba pozicování | Inline rodič nemá rozumný containing block |
| Modal nepokrývá celou stránku | Chybí `inset: 0` nebo `top/right/bottom/left: 0` | Použít `inset: 0` |

---

# Část 2: Praktická úloha

### Co může praktická úloha obsahovat

Typická úloha:

- **Sticky navbar** (`position: sticky; top: 0; z-index: ...`)
- **Hero s textem přes obrázek** (absolute v relative rodiči)
- **Badge/štítek v rohu karty** (absolute, často s negativním top/right pro vyčnívání)
- **Obrázek obtékaný textem** v článku (`float: left/right`)
- **Floating Action Button (FAB)** fixovaný v rohu viewportu
- **Modal s backdropem** (fixed + inset: 0 + z-index)
- **Centrování modalu** přes `transform: translate(-50%, -50%)` nebo `place-items: center`

### Příklad zadání: Wanderlust Blog

Vytvoř stránku fotoblogu o cestování. Pomocí pozicování doplnit:

1. **Sticky navbar** (zůstává nahoře při scrollu)
2. **Hero s textem přes obrázek** (nadpis vlevo dole na obrázku)
3. **Karta s badge "NEW"** (žluté kolečko vpravo nahoře, mírně vyčnívá)
4. **Obrázek obtékaný textem** v článku (float left)
5. **Floating Action Button "↑ Nahoru"** (fixed v pravém dolním rohu)
6. **Modal "Přihlásit k odběru"** (překrývá celou stránku)

### Řešení: kompletní `styly.css`

```css
/* ===== RESET ===== */
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: system-ui, sans-serif; line-height: 1.6; color: #222; }
img { max-width: 100%; display: block; }
a { color: inherit; text-decoration: none; }

/* ===== TODO 1: STICKY NAVBAR ===== */
.navbar {
    background: #1f2937;
    color: white;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    z-index: 100;
}
.navbar a { margin-left: 1rem; }

/* ===== TODO 2: HERO S OVERLAY TEXTEM ===== */
.hero {
    position: relative;           /* containing block pro .hero-text */
}
.hero-img {
    width: 100%;
    height: 400px;
    object-fit: cover;
}
.hero-text {
    position: absolute;
    bottom: 30px;
    left: 30px;
    color: white;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}
.hero-text h1 { font-size: 3rem; }

/* ===== ČLÁNEK ===== */
.clanek {
    max-width: 700px;
    margin: 3rem auto;
    padding: 0 1rem;
}
.clanek h2 { margin-bottom: 1rem; }
.clanek p { margin-bottom: 1rem; }

/* ===== TODO 3: OBRÁZEK OBTÉKANÝ TEXTEM ===== */
.vlevo {
    float: left;
    margin-right: 1rem;
    margin-bottom: 0.5rem;
    border-radius: 4px;
}

/* ===== TODO 4: KARTA S BADGE ===== */
.produkty { max-width: 400px; margin: 3rem auto; padding: 0 1rem; }
.produkty h2 { margin-bottom: 1rem; }

.karta {
    background: white;
    padding: 1.5rem;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    position: relative;           /* containing block pro .badge */
}
.karta h3 { margin-bottom: 0.5rem; }
.karta .cena { margin-top: 1rem; font-weight: bold; color: #6366f1; }

.badge {
    background: #ef4444;
    color: white;
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 0.8rem;
    font-weight: bold;
    position: absolute;
    top: -10px;                   /* záporné = vyčnívá nahoru */
    right: -10px;
}

/* ===== TODO 5: FLOATING ACTION BUTTON ===== */
.fab {
    width: 56px;
    height: 56px;
    background: #6366f1;
    color: white;
    border-radius: 50%;
    display: grid;
    place-items: center;
    font-size: 1.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    position: fixed;
    bottom: 30px;
    right: 30px;
    z-index: 50;
}

/* ===== TODO 6: MODAL ===== */
.modal-backdrop {
    position: fixed;
    inset: 0;                     /* = top:0 right:0 bottom:0 left:0 */
    background: rgba(0, 0, 0, 0.5);
    display: grid;
    place-items: center;
    z-index: 1000;
}
.modal {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    max-width: 400px;
    width: 90%;
}
.modal h2 { margin-bottom: 0.5rem; }
.modal input {
    width: 100%;
    padding: 0.5rem;
    margin: 1rem 0;
    border: 1px solid #d1d5db;
    border-radius: 4px;
}
.modal button {
    width: 100%;
    padding: 0.75rem;
    background: #6366f1;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

/* Pro testování sticky efektu */
body {
    min-height: 200vh;
    padding-bottom: 100px;
}

/* ============ BONUSY ============ */

/* Bonus A: schovat modal */
.hidden {
    display: none;
}

/* Bonus B: centrování modalu přes transform */
/*
.modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
}
.modal {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
*/
```

### Co se v řešení děje

**TODO 1 (Sticky navbar)**: `position: sticky` + `top: 0` zajistí, že navbar se přilepí nahoře při scrollu. `z-index: 100` je nad zbytkem obsahu, ale pod modálem.

**TODO 2 (Hero overlay)**: Klasický pattern. `.hero` má `relative` jako kontext, `.hero-text` má `absolute` s `bottom: 30px; left: 30px`, takže je vlevo dole na obrázku.

**TODO 3 (Float obtékání)**: `float: left` pohne obrázek doleva, text ho obtéká zprava. Margin přidá mezeru, aby se text obrázku "nelepil".

**TODO 4 (Badge v rohu)**: `.karta` jako `relative` rodič, `.badge` jako `absolute` s **zápornými hodnotami** `top: -10px; right: -10px`, takže vyčnívá ven z karty.

**TODO 5 (FAB)**: `position: fixed` znamená "podle viewportu", takže drží svou pozici i při scrollu. `z-index: 50` ho dá nad obsah, ale pod modal.

**TODO 6 (Modal)**: `.modal-backdrop` je `fixed` s `inset: 0` (přes celý viewport). `display: grid; place-items: center` vycentruje obsah. `z-index: 1000` ho dá nad všechno.

---

## Část 3: Tipy pro obhajobu

### Co u obhajoby říct

> *"V zadání jsem použil pozicování pro různé úlohy. Pro navbar jsem použil position sticky s top 0 a z-index 100, takže zůstává nahoře při scrollu. Pro hero overlay jsem použil klasický pattern: rodič má position relative, vnořený text má position absolute s bottom a left, takže je vlevo dole nad obrázkem. Badge v kartě používá záporné offsety, takže vyčnívá ven z karty. FAB má position fixed, drží se viewportu při scrollu. Modal používá fixed s inset 0 přes celý viewport, díky display grid a place-items center je obsah vycentrovaný. Pro obtékání textem kolem obrázku v článku jsem použil float left s marginy."*
> 

### Klíčové pojmy pro teorii

| Pojem | Rychlá odpověď |
| --- | --- |
| **`static`** | Default, prvek v normálním toku |
| **`relative`** | V toku, lze posunout, místo zůstává; vytváří kontext pro absolute děti |
| **`absolute`** | Vyjmuto z toku, podle pozicovaného předka |
| **`fixed`** | Vyjmuto z toku, podle viewportu (drží se při scrollu) |
| **`sticky`** | V toku, při scrollu se přilepí (hybrid) |
| **Containing block** | Prvek, podle kterého se pozicuje absolute (nejbližší pozicovaný předek) |
| **`top`, `right`, `bottom`, `left`** | Posun od hran containing blocku |
| **`inset: 0`** | Shorthand pro top/right/bottom/left: 0 |
| **`z-index`** | Pořadí překrývání (vyšší = nahoře) |
| **Stacking context** | "Uzavřený svět" pro z-index, vytvořený position + z-index, flex/grid item s z-index, opacity < 1, transform, filter |
| **`float`** | Plovoucí prvek, dnes hlavně pro obtékání textem |
| **`clear`** | Zrušit obtékání (clear: both) |
| **Pseudoelement** | `::before`, `::after`, vyžadují `content: ""` |

### Časté chytáky

| Otázka | Odpověď |
| --- | --- |
| *Rozdíl `relative` a `absolute`?* | Relative zůstává v toku a místo zachová. Absolute vyjme z toku a umístí podle nejbližšího pozicovaného předka. |
| *Co je containing block?* | Prvek, podle kterého se počítá pozice absolute. Default je `<html>`, ale jakýkoli předek s position relative/absolute/fixed/sticky se stane containing blockem. |
| *Kdy `fixed` a kdy `sticky`?* | Fixed je vždy připnutý k viewportu. Sticky je v toku do okamžiku, kdy dosáhne nastaveného bodu, pak se přilepí. Sticky je modernější a hezčí UX. |
| *Proč můj z-index nefunguje?* | Buď chybí `position`, nebo jsi v jiném stacking contextu, který má nižší z-index než element který tě překrývá. |
| *Co je rozdíl `static` a `relative` bez offsetů?* | Vizuálně žádný. Ale relative vytváří containing block pro absolute děti, static ne. |
| *Proč prvek s float vyleze z rodiče?* | Float vyjímá z toku, rodič nevidí jeho výšku. Řešení: clearfix nebo overflow: hidden na rodiči. |
| *Proč fixed prvek nezůstává na pozici?* | Pravděpodobně předek má `transform` nebo `filter`, což vytváří nový containing block i pro fixed. |
| *Co je inset?* | Modern shorthand pro top/right/bottom/left. `inset: 0` znamená "roztáhnout přes celý containing block". |

### Časté chyby v praktické úloze

- Absolute dítě bez `position: relative` na rodiči (umístí se podle viewportu)
- Sticky bez `top: 0` (sticky se neaktivuje)
- Sticky v rodiči s `overflow: hidden/auto` (sticky se přilepí v rodiči, ne ve viewportu)
- z-index na elementu bez `position` (nefunguje, kromě flex/grid itemů)
- Fixed v rodiči s `transform` (chová se jako absolute)
- Modal bez `inset: 0` (nepokrývá celou stránku)
- Float bez clear na následujícím prvku (layout se rozhází)
- Pseudoelement bez `content: ""` (nezobrazí se)
- Badge s `top: -10px` ale bez `overflow: visible` na rodiči (skryje se)
- z-index hierarchie: sticky navbar 100, FAB 50, modal 1000 (modal překryje vše)
- Centrování přes `transform: translate(-50%, -50%)` ale bez `position` (transform funguje, ale offsety ne)
- Kombinace pixel hodnot s % bez pochopení (`top: 50%; left: 50%` bez transform necentruje, jen posune levý horní roh)