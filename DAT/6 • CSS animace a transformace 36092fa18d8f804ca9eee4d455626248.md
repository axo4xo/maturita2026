# 6 • CSS animace a transformace

> Transformace, přechody, animace klíčových snímků (keyframes)
> 

> **Formát:** 30 min praktická úloha, 15 min obhajoba + teorie. Teorie pokrývá tři pilíře (transform, transition, animation), performance, accessibility a praktiku.
> 

---

# Část 1: Teorie

### Tři pojmy, tři vlastnosti

| Pojem | CSS vlastnost | K čemu slouží |
| --- | --- | --- |
| **Transformace** | `transform` | Statická změna podoby prvku (posun, rotace, zvětšení, zkosení) |
| **Přechody** | `transition` | Plynulá změna mezi dvěma stavy (typicky `:hover`) |
| **Animace** | `@keyframes` + `animation` | Předdefinovaná posloupnost změn, může běžet sama dokola |

> **Vztah mezi nimi**: Transformace **se transformuje** (jak teď vypadá). Transition a animation **animují přechod** (jak se mění v čase). Často se kombinují: `transition` plynule posune `transform`, `keyframes` mění `transform` po snímcích.
> 

### Krátký kontext

CSS animations a transitions byly přidány do specifikace **CSS3** v roce 2009-2012. Před nimi se UI animace dělaly v JavaScriptu (jQuery animations) nebo Flash. Dnes je CSS animation hlavní way to go, jQuery animace jsou legacy.

Moderní rozšíření:

- **View Transitions API** (2023+): smooth přechody mezi stránkami / stavy SPA
- **Scroll-driven animations** (2024): animace navázané na scroll pozici, bez JS
- **`@starting-style`** (2024): animace při prvním zobrazení elementu

Pro maturitu stačí klasické tři vlastnosti, ale stojí za to vědět, že CSS animace se dál vyvíjejí.

---

### Část teorie A: Transformace (`transform`)

`transform` mění tvar nebo polohu prvku, **aniž by ovlivnil layout**. Ostatní prvky se neposunou, prvek si "ukočičí svoji vlastní reality bez okolního světa".

### Funkce `transform`

| Funkce | Příklad | Co dělá |
| --- | --- | --- |
| `translate(x, y)` | `translate(20px, 50px)` | Posun po obou osách |
| `translateX(x)` / `translateY(y)` | `translateY(-10px)` | Posun po jedné ose |
| `rotate(angle)` | `rotate(45deg)` | Otočení (kladné = po směru hodinových ručiček) |
| `scale(x, y)` | `scale(1.2)` nebo `scale(2, 0.5)` | Zvětšení / zmenšení |
| `scaleX(x)` / `scaleY(y)` | `scaleY(0.5)` | Zvětšení po jedné ose |
| `skew(x, y)` | `skew(20deg, 0)` | Zkosení (lichoběžník, kosočtverec) |
| `matrix(...)` | `matrix(1, 0, 0, 1, 0, 0)` | Vše najednou (ručně se nepoužívá) |

### Kombinace více transformací

```css
.box {
    transform: translate(20px, 30px) rotate(45deg) scale(1.5);
}
```

> **Pozor na pořadí!** Transformace se aplikují **zleva doprava**.
> 
> - `rotate(45deg) translate(0, 100px)` → otočí o 45°, pak posune o 100 px ve směru nové orientace
> - `translate(0, 100px) rotate(45deg)` → posune o 100 px svisle, pak otočí na místě

### `transform-origin`: bod, kolem kterého se transformuje

```css
.box {
    transform: rotate(45deg);
    transform-origin: top left;     /* default je center center (50% 50%) */
}
```

| Hodnota | Co znamená |
| --- | --- |
| `center` nebo `50% 50%` | Default, otáčí se kolem středu |
| `top left` nebo `0 0` | Otáčí se kolem levého horního rohu |
| `bottom right` nebo `100% 100%` | Pravý dolní roh |
| `0 50%` | Levý okraj uprostřed |

### 3D transformace

```css
.cube {
    transform: rotateY(45deg);
    transform-style: preserve-3d;   /* aby se 3D efekt projevil na potomky */
}
.parent {
    perspective: 600px;                  /* hloubka 3D scény */
}
```

| 3D funkce | Co dělá |
| --- | --- |
| `translateZ(d)` | Posun směrem k uživateli nebo od něj |
| `rotateX(a)` | Otočení kolem vodorovné osy (jako salto) |
| `rotateY(a)` | Otočení kolem svislé osy (jako otevírání dveří) |
| `rotateZ(a)` | Otočení v rovině (= `rotate()`) |
| `perspective(n)` | Hloubka pohledu |

### Proč je `transform` rychlý

Transformace běží **na GPU**, **nezpůsobuje layout reflow ani repaint** (jako třeba `width` nebo `top`). Proto:

> **Pravidlo:** Pro plynulou animaci animuj **`transform`** a **`opacity`**. **NIKDY `width`, `height`, `top`, `left`** (jsou pomalé, "blikají").
> 

---

### Část teorie B: Přechody (`transition`)

`transition` říká: *"Když se ta vlastnost změní, neudělej to skokem, ale plynule za X sekund."*

```css
.button {
    background: blue;
    transition: background 0.3s ease;
}
.button:hover {
    background: red;        /* plynule za 0.3 s */
}
```

### Vlastnosti transition

```css
.box {
    transition-property: transform, opacity;      /* které vlastnosti */
    transition-duration: 0.5s;                     /* jak dlouho */
    transition-timing-function: ease-in-out;      /* křivka rychlosti */
    transition-delay: 0.1s;                        /* čekání před začátkem */
}

/* Shorthand: property duration timing-function delay */
.box {
    transition: transform 0.5s ease-in-out 0.1s;
}

/* Více vlastností najednou */
.box {
    transition: transform 0.3s ease, opacity 0.5s linear;
}

/* Vše */
.box {
    transition: all 0.3s ease;     /* pohodlné, ale animuje úplně všechno (pomalé) */
}
```

### Easing (timing functions): křivka rychlosti

| Hodnota | Popis | Kdy použít |
| --- | --- | --- |
| `linear` | Konstantní rychlost po celou dobu | Spinner, pokračující pohyb |
| `ease` | Default, mírně ease-in-out | Když nejsi jistý → ease |
| `ease-in` | Pomalý začátek, rychlý konec | Něco se objevuje, akceleruje |
| `ease-out` | Rychlý začátek, pomalý konec | Něco dojíždí, vychází |
| `ease-in-out` | Pomalé krajní body, rychlejší střed | Plynulé tam-zpět |
| `cubic-bezier(x1, y1, x2, y2)` | Vlastní křivka | Specifický feel (např. iOS bounce) |
| `steps(n)` | Skoková animace v n krocích | Sprite animace, typewriter |

### Co lze a nelze animovat

**Lze:** `transform`, `opacity`, `background-color`, `color`, `border-radius`, `width`, `height`, `box-shadow`, `filter`, `font-size`, `letter-spacing` a další.

**Nelze (skok):** `display`, `position` (hodnota), `font-family`, většina diskrétních (`visibility` má svůj timing trik).

> **Trik s `display: none`**: nelze plynule animovat. Místo toho použij kombinaci `opacity` + `visibility` + `pointer-events`:
> 
> 
> ```css
> .modal { opacity: 0; visibility: hidden; pointer-events: none;
>           transition: opacity 0.3s, visibility 0s 0.3s; }
> .modal.open { opacity: 1; visibility: visible; pointer-events: auto;
>                transition: opacity 0.3s, visibility 0s; }
> ```
> 

### Klíčový pattern: hover lift

```css
.card {
    transform: translateY(0);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}
```

> **Důležité:** `transition` musí být v **základním stavu**, ne v `:hover`. Jinak by animace fungovala jen při najetí, ne při odjetí.
> 

---

### Část teorie C: Animace klíčových snímků (`@keyframes`)

`@keyframes` definuje **posloupnost stavů** v procentech času. `animation` pak tuto posloupnost přehrává.

### Definice klíčových snímků

```css
/* Forma 1: from/to (jednoduché) */
@keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
}

/* Forma 2: procenta (víc kroků) */
@keyframes bounce {
    0%   { transform: translateY(0); }
    50%  { transform: translateY(-30px); }
    100% { transform: translateY(0); }
}

/* Forma 3: víc procent najednou */
@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50%      { transform: scale(1.1); }
}
```

### Aplikace animace na prvek

```css
.box {
    animation-name: bounce;
    animation-duration: 1s;
    animation-timing-function: ease-in-out;
    animation-delay: 0s;
    animation-iteration-count: infinite;     /* nebo číslo: 1, 3, 10... */
    animation-direction: alternate;          /* normal, reverse, alternate */
    animation-fill-mode: both;               /* co před a po animaci */
    animation-play-state: running;           /* nebo paused */
}

/* Shorthand */
.box {
    animation: bounce 1s ease-in-out 0s infinite alternate both;
    /*         name   dur  timing   delay iter direction fill */
}
```

### Klíčové vlastnosti `animation`

| Vlastnost | Hodnoty | Co dělá |
| --- | --- | --- |
| `animation-name` | Jméno z `@keyframes` | Kterou animaci přehrát |
| `animation-duration` | Čas (`1s`, `500ms`) | Doba jednoho cyklu |
| `animation-timing-function` | Jako u transition | Easing |
| `animation-delay` | Čas | Čekání před prvním spuštěním |
| `animation-iteration-count` | Číslo nebo `infinite` | Kolikrát opakovat |
| `animation-direction` | `normal` / `reverse` / `alternate` / `alternate-reverse` | Směr přehrávání |
| `animation-fill-mode` | `none` / `forwards` / `backwards` / `both` | Co před a po animaci |
| `animation-play-state` | `running` / `paused` | Pauza animace (typicky přes JS nebo `:hover`) |

### `animation-direction`: chování opakování

| Hodnota | Co dělá |
| --- | --- |
| `normal` (default) | Vždy 0% → 100%, pak skok zpět |
| `reverse` | Vždy 100% → 0% |
| `alternate` | Tam-zpět: 0% → 100% → 0% → 100% (tam i zpět animace) |
| `alternate-reverse` | Začne reverse |

### `animation-fill-mode`: co před a po

| Hodnota | Před začátkem (delay) | Po skončení |
| --- | --- | --- |
| `none` (default) | Default styly | Default styly (skok zpět) |
| `forwards` | Default | **Zůstane na 100% snímku** |
| `backwards` | **Předem převezme 0% snímek** | Default |
| `both` | Předem 0%, na konci 100% |  |

> **`forwards` je nejčastější potřeba**: chceš, aby animace **zůstala kde skončila**, nepřeskočila zpět.
> 

### Pauza při hover

```css
.spinner {
    animation: spin 1s linear infinite;
}
.spinner:hover {
    animation-play-state: paused;
}
```

---

### Transition vs Animation: kdy co

| Aspekt | `transition` | `animation` |
| --- | --- | --- |
| **Trigger** | Změna vlastnosti (hover, focus, JS class) | Spustí se sama (load nebo přidáním class) |
| **Stavů** | 2 (z A do B) | Libovolný počet (přes %) |
| **Opakování** | Ne | Ano (`iteration-count`) |
| **Kontrola** | Implicitní (změna spouští) | Explicitní (přesné keyframes) |
| **Použití** | Hover efekty, state changes | Spinner, loading, atrakce |

```
Mám trigger jako :hover/:focus?
├─ Ano → transition (jednoduchý přechod ze stavu A do B)
└─ Ne, má běžet sama
   ├─ Víc kroků nebo opakování? → animation + @keyframes
   └─ Jednou na začátku → animation s iteration-count: 1 + fill-mode: forwards
```

---

### Performance a accessibility

### Co animovat (rychlé, GPU)

- `transform` (translate, rotate, scale)
- `opacity`

Tyhle běží na GPU. Animace je plynulá i na slabém HW (60fps).

### Co NE-animovat (pomalé, CPU layout reflow)

- `width`, `height` (CSS musí přepočítat layout pozice)
- `top`, `left`, `right`, `bottom`
- `margin`, `padding`, `border-width`
- `font-size` (na velkém textu)

> Místo `top: 100px → 0` použij `transform: translateY(100px) → 0`. Vypadá stejně, ale je 10× rychlejší.
> 

### `will-change`: hint pro prohlížeč

```css
.box {
    will-change: transform;     /* slíbí prohlížeči, že tahle vlastnost se bude měnit */
}
```

Prohlížeč si může předem připravit GPU vrstvu. **Nepoužívat plošně**, jen u prvků, kde **opravdu** budeš animovat.

### `prefers-reduced-motion`: accessibility

Někteří uživatelé mají v OS zapnuto "omezit pohyb" (vestibulární poruchy, migrény, epilepsie). CSS to umí detekovat:

```css
@media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }
}
```

Nepoužívej v praxi `animation: none`, ale **velmi krátkou dobu** (0.01 ms), aby JavaScript spoléhající na `animationend` event nepřestal fungovat.

---

### Moderní features (general knowledge bonus)

> Tyhle nejsou klasická SŠ látka, ale stojí za zmínku.
> 

### View Transitions API (2023+)

Smooth přechody mezi stránkami / stavy SPA, bez JS animation knihoven.

```jsx
// JS trigger
document.startViewTransition(() => {
    updateUI();
});
```

```css
::view-transition-old(root) { animation: fade-out 0.3s; }
::view-transition-new(root) { animation: fade-in 0.3s; }
```

### Scroll-driven animations (2024)

Animace navázané na scroll pozici, bez JS:

```css
@keyframes reveal {
    from { opacity: 0; transform: translateY(50px); }
    to   { opacity: 1; transform: translateY(0); }
}

.card {
    animation: reveal linear;
    animation-timeline: view();        /* animace navázaná na viewport scroll */
    animation-range: entry 0% cover 30%;
}
```

### `@starting-style` (2024)

Pro animace při prvním zobrazení (object insertion):

```css
.modal {
    opacity: 1;
    transition: opacity 0.3s;
}
@starting-style {
    .modal { opacity: 0; }
}
```

---

### Časté patterns

### Spinner (nekonečné rotování)

```css
@keyframes spin {
    to { transform: rotate(360deg); }
}

.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #e5e7eb;
    border-top-color: #6366f1;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}
```

### Pulse (notifikační dot)

```css
@keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50%      { transform: scale(1.5); opacity: 0.5; }
}

.dot {
    animation: pulse 1.5s ease-in-out infinite;
}
```

### Fade-in při loadu

```css
@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
}

.hero {
    animation: fadeInUp 0.6s ease-out both;
}
```

### Hover lift

```css
.card {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}
```

### Tlačítko press efekt

```css
.btn {
    transition: transform 0.1s ease, background 0.2s ease;
}
.btn:hover {
    background: #4f46e5;
    transform: scale(1.05);
}
.btn:active {
    transform: scale(0.95);
}
```

### Skeleton loading shimmer

```css
@keyframes shimmer {
    from { background-position: -200% 0; }
    to   { background-position: 200% 0; }
}

.skeleton {
    background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s linear infinite;
}
```

### Card flip ve 3D

```css
.flip-card {
    perspective: 1000px;
}
.flip-card-inner {
    transition: transform 0.6s;
    transform-style: preserve-3d;
}
.flip-card:hover .flip-card-inner {
    transform: rotateY(180deg);
}
.flip-card-front, .flip-card-back {
    backface-visibility: hidden;
    position: absolute;
    inset: 0;
}
.flip-card-back {
    transform: rotateY(180deg);
}
```

---

### Cheat sheet

### Transform

```css
transform: translate(x, y) | translateX | translateY | translateZ;
transform: rotate(deg) | rotateX | rotateY | rotateZ;
transform: scale(n) | scaleX | scaleY;
transform: skew(x, y) | skewX | skewY;
transform-origin: center | top left | 50% 50% | 0 0;
```

### Transition (shorthand)

```css
transition: <property> <duration> <timing-function> <delay>;
transition: transform 0.3s ease 0s;
transition: all 0.2s ease-out;
```

### Animation (shorthand)

```css
animation: <name> <duration> <timing> <delay> <iteration> <direction> <fill-mode>;
animation: spin 1s linear infinite;
animation: fadeIn 0.5s ease-out forwards;
animation: bounce 1s ease-in-out 0.2s 3 alternate both;
```

---

### Časté chyby

| Chyba | Důsledek | Řešení |
| --- | --- | --- |
| `transition` v `:hover`, ne v základním stavu | Animuje jen najetí, ne odjetí | Dát transition do základního stavu |
| Animuju `width`/`top` | Sekaná animace | Použít `transform` |
| Po skončení animace prvek skočí zpět | Default `fill-mode: none` | Přidat `animation-fill-mode: forwards` |
| `display: none` se neanimuje | Display je diskrétní vlastnost | Použít `opacity` + `visibility` |
| Spinner zpomaluje na konci a začíná pomalu | Default `ease` | Pro nekonečnou rotaci vždy `linear` |
| `transform` se aplikuje špatně | Pořadí transformací! | Změnit pořadí (zprava doleva) |
| Karta při rotaci "blikne" | Backface viditelný | `backface-visibility: hidden` |
| Animace ignorována uživatelem s motion preference | Není respektován prefers-reduced-motion | Přidat media query |
| `will-change` aplikováno všude | Paměťový bloat | Jen u prvků, které opravdu animuješ |

---

## Část 2: Praktická úloha

### Co může praktická úloha obsahovat

Typická úloha kombinuje:

- **Hero / element fade-in při loadu** (`@keyframes` + `animation: ... forwards`)
- **Hover lift na kartách** (`transition: transform`, `:hover { transform: translateY }`)
- **Hover efekt na tlačítku** (`transition` na color + scale)
- **Press efekt** (`:active { transform: scale(0.95) }`)
- **Spinner** (`@keyframes spin`, `animation: spin 1s linear infinite`)
- **Pulse notifikace** (`@keyframes pulse` se scale a opacity, `alternate` direction)
- **Bonus**: skeleton shimmer, card flip ve 3D, prefers-reduced-motion

### Příklad zadání: PixelShop

Vytvoř stránku e-shopu. Pomocí CSS doplnit:

1. **Hero fade-in** při loadu (`@keyframes fadeInUp`)
2. **Spinner načítání** (`@keyframes spin`, infinite linear)
3. **Karty hover lift** (`transition` + `transform: translateY`)
4. **Tlačítko Koupit hover + press efekt**
5. **Notification dot pulse** (`@keyframes pulse`, infinite)
6. **Bonusy**: skeleton, 3D flip, prefers-reduced-motion

### Řešení: kompletní `styly.css`

```css
/* ===== RESET ===== */
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: system-ui, sans-serif; line-height: 1.6; color: #222; background: #f3f4f6; padding: 2rem; }

/* ===== TODO 1: HERO FADE-IN ===== */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.hero {
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: white;
    padding: 3rem;
    text-align: center;
    border-radius: 12px;
    margin-bottom: 2rem;
    animation: fadeInUp 0.8s ease-out both;
}
.hero h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }

/* ===== TODO 2: SPINNER ===== */
@keyframes spin {
    to { transform: rotate(360deg); }
}

.loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
    color: #6b7280;
}

.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #e5e7eb;
    border-top-color: #6366f1;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

/* ===== KARTY ===== */
.produkty {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1.5rem;
}

/* ===== TODO 3: KARTY HOVER LIFT ===== */
.karta {
    position: relative;
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.karta:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}
.karta h3 { margin-bottom: 0.5rem; }
.karta .cena { margin: 1rem 0; font-weight: bold; color: #6366f1; }

/* ===== TODO 4: TLAČÍTKO KOUPIT ===== */
.btn {
    width: 100%;
    padding: 0.75rem;
    background: #6366f1;
    color: white;
    border: none;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.2s ease, transform 0.1s ease;
}
.btn:hover {
    background: #4f46e5;
    transform: scale(1.05);
}
.btn:active {
    transform: scale(0.95);
}

/* ===== TODO 5: PULSE NOTIFIKACE ===== */
@keyframes pulse {
    0%, 100% {
        transform: scale(1);
        opacity: 1;
    }
    50% {
        transform: scale(1.5);
        opacity: 0.5;
    }
}

.dot {
    position: absolute;
    top: -6px;
    right: -6px;
    width: 16px;
    height: 16px;
    background: #ef4444;
    border-radius: 50%;
    animation: pulse 1.5s ease-in-out infinite;
}

/* ============ BONUSY ============ */

/* Bonus A: Skeleton loading shimmer */
@keyframes shimmer {
    from { background-position: -200% 0; }
    to   { background-position: 200% 0; }
}

.skeleton {
    height: 20px;
    background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s linear infinite;
    border-radius: 4px;
}

/* Bonus B: Card flip ve 3D */
.flip-karta {
    perspective: 1000px;
    width: 220px;
    height: 300px;
}

.flip-karta-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.6s;
    transform-style: preserve-3d;
}

.flip-karta:hover .flip-karta-inner {
    transform: rotateY(180deg);
}

.flip-karta-front, .flip-karta-back {
    position: absolute;
    inset: 0;
    backface-visibility: hidden;
    border-radius: 8px;
    padding: 1.5rem;
    display: grid;
    place-items: center;
}

.flip-karta-front {
    background: white;
}

.flip-karta-back {
    background: #6366f1;
    color: white;
    transform: rotateY(180deg);
}

/* Bonus C: prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }
}
```

### Co se v řešení děje

**TODO 1 (Hero fade-in)**: `@keyframes fadeInUp` definuje dva stavy (skryté + posunuté dolů → viditelné + na místě). `animation: fadeInUp 0.8s ease-out both` spustí jednou s `fill-mode: both`, takže element začne neviditelný a zůstane viditelný.

**TODO 2 (Spinner)**: `@keyframes spin` rotuje od 0 do 360°. Klíčové je `linear` (žádné zpomalování) a `infinite` (donekonečna).

**TODO 3 (Hover lift)**: Transition v základním stavu, transform v `:hover`. Karta se zvedne nahoru a získá výraznější stín, plynule v obou směrech.

**TODO 4 (Button)**: `transition` v základu na background a transform. Hover má větší scale + tmavší barvu. `:active` (kliknutí) má scale 0.95 → "zmáčknutí".

**TODO 5 (Pulse)**: `@keyframes pulse` se třemi snímky (0%, 50%, 100%). Default direction `normal`, takže scale jede 1 → 1.5 → 1 v každém cyklu.

**Bonus A (Shimmer)**: Background-size 200% a animace background-position se širokém přechodu vytváří "lesk", co projíždí elementem.

**Bonus B (Flip)**: `perspective` na rodiči, `transform-style: preserve-3d` na inner kontejneru, `rotateY(180deg)` na hover. Backface-visibility skrývá rubovou stranu.

**Bonus C (Reduced motion)**: Pro uživatele s preferencí omezeného pohybu se animace prakticky vypnou (0.01 ms).

---

## Část 3: Tipy pro obhajobu

### Co u obhajoby říct

> *"V zadání jsem použil všechny tři pilíře CSS animací. Pro transformace jsem využil translateY a scale, které běží na GPU a jsou plynulé. Transitions jsem použil pro hover efekty: karty a tlačítka mají transition v základním stavu, takže přechod funguje plynule v obou směrech, najetí i odjetí. Animace přes keyframes jsem použil tam, kde má něco běžet samo: hero fade-in při loadu jednou s fill-mode forwards, spinner s infinite linear (linear je důležité, jinak by spinner zpomaloval), pulse notifikace s infinite alternate. V bonusu jsem přidal skeleton shimmer přes posun background-position, 3D flip karty s perspective a backface-visibility, a respekt pro prefers-reduced-motion media query."*
> 

### Klíčové pojmy pro teorii

| Pojem | Rychlá odpověď |
| --- | --- |
| **`transform`** | Statická změna podoby (translate, rotate, scale, skew), neovlivňuje layout |
| **`transition`** | Plynulý přechod mezi dvěma stavy, trigger je změna vlastnosti |
| **`animation`** | Předdefinovaná posloupnost přes `@keyframes`, může běžet sama |
| **`@keyframes`** | Definice klíčových snímků (from/to nebo procenta) |
| **`transform-origin`** | Bod, kolem kterého se transformuje (default center) |
| **GPU akcelerace** | transform a opacity běží na GPU, jsou rychlé |
| **`fill-mode: forwards`** | Animace zůstane na 100% snímku po skončení |
| **`iteration-count: infinite`** | Nekonečné opakování |
| **`direction: alternate`** | Tam-zpět: 0→100→0→100 |
| **`linear` timing** | Konstantní rychlost (pro spinner) |
| **`will-change`** | Hint pro prohlížeč, který vlastnosti budou animovány |
| **`prefers-reduced-motion`** | Media query pro accessibility |
| **`backface-visibility`** | Skrytí rubu při 3D rotaci |

### Časté chytáky

| Otázka | Odpověď |
| --- | --- |
| *Rozdíl transition a animation?* | Transition reaguje na změnu vlastnosti (hover). Animation má vlastní průběh (keyframes), může běžet sama, opakovat se. |
| *Co animovat, co ne?* | Animuj `transform` a `opacity` (GPU, rychlé). Nikdy ne `width`, `top`, `left` (layout reflow, pomalé). |
| *Proč transition v base, ne v hover?* | Aby animovalo oběma směry. V `:hover` by se transition aplikoval jen při najetí. |
| *Co je fill-mode?* | Co se zobrazí před spuštěním a po skončení. `forwards` znamená "zůstaň na konci". |
| *Proč spinner `linear`?* | Default `ease` by zpomaloval na konci. Linear je konstantní rychlost, vypadá to jako opravdové točení. |
| *Co je `transform-origin`?* | Bod, kolem kterého se transformuje. Default `center center`. |
| *Lze animovat `display`?* | Ne, je to diskrétní vlastnost. Použij `opacity` + `visibility`. |
| *Co je `prefers-reduced-motion`?* | Media query pro uživatele, kteří mají v OS zapnuto omezit animace (epilepsie, migrény). |
| *Co je `will-change`?* | Hint pro prohlížeč, že prvek bude animován. Pomáhá s performance. |

### Časté chyby v praktické úloze

- `transition` v `:hover`, ne v základním stavu (animuje jen najetí)
- Animace `width` nebo `top` místo `transform` (pomalé, sekané)
- Po animaci skok zpět: chybí `animation-fill-mode: forwards`
- Spinner s `ease` místo `linear` (zpomaluje)
- Pulse bez `alternate` (skok zpět na začátek místo plynulého tam-zpět)
- Hover bez transition (animace najednou skoková)
- Display none v animaci (nelze plynule)
- 3D flip bez `perspective` na rodiči (rotace vypadá ploše)
- 3D flip bez `backface-visibility: hidden` (vidíš rub karty)
- `prefers-reduced-motion` s `animation: none` místo krátkého trvání (rozbije JS spoléhající na `animationend`)
- Pulse s opacity menší než 0 (neviditelný moment, vypadá to jako blikání)
- Hover lift s `top` místo `translateY` (sekané, pomalé)
- `will-change` aplikované plošně (memory bloat)