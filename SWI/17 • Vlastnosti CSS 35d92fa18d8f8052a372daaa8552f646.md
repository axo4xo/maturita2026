# 17 • Vlastnosti CSS

> CSS jednotky, barvy, proměnné, písma a ligatury
> 

## Co jsou vlastnosti CSS

**Vlastnosti CSS** *(CSS properties)* jsou parametry, které definují, jak má prvek vypadat. Každé pravidlo má tvar `vlastnost: hodnota;` a každá vlastnost má vlastní pravidla, jaké hodnoty přijímá.

```css
p {
  color: red;          /* barva textu */
  font-size: 16px;     /* velikost písma */
  margin: 1rem;        /* vnější odsazení */
}
```

CSS dnes obsahuje **stovky vlastností**, ale ovládat jich aktivně potřebuješ jen pár desítek. Důležité je rozumět, jak fungují **hodnoty a jednotky**, které do vlastností dosazuješ.

# CSS jednotky

Jednotky určují číselné hodnoty (rozměry, velikosti písma, mezery). Dělí se na **absolutní** (pevně dané) a **relativní** (závisí na kontextu).

### Absolutní jednotky

| Jednotka | Popis | Kdy použít |
| --- | --- | --- |
| `px` | CSS pixel, logická jednotka | Univerzální, nejpoužívanější |
| `cm`, `mm`, `in` | Fyzické délky | Tiskové stylesheets |
| `pt` | Bod, 1pt = 1/72 palce | Tisk, typografie |
| `pc` | Pica, 1pc = 12pt | Tisk |

> **Pozor:** CSS pixel není fyzický pixel. Na HiDPI displejích (Retina, OLED telefonech) odpovídá **více fyzickým pixelům**. Prohlížeč to řeší automaticky, ale je dobré o tom vědět při práci s `image-rendering` nebo `<canvas>`.
> 

### Relativní jednotky podle písma

| Jednotka | Závisí na | Příklad |
| --- | --- | --- |
| `em` | `font-size` **rodičovského** prvku | Mezery uvnitř textu |
| `rem` | `font-size` kořenového `<html>` | Globální konzistentní velikosti |
| `ex` | Výšce "x" v aktuálním písmu | Vertikální zarovnání |
| `ch` | Šířce znaku "0" v aktuálním písmu | Šířka inputu pro N znaků |
| `lh` | Aktuální `line-height` | Vertikální mezery podle řádku |
| `cap` | Výšce kapitálky | Mřížka podle velkých písmen |

### em vs rem (klíčový rozdíl)

```css
html { font-size: 16px; }

.rodic {
  font-size: 20px;
}

.rodic .dite {
  font-size: 1.5em;   /* 1.5 × 20px = 30px (závisí na rodiči) */
  margin: 1rem;       /* 1 × 16px = 16px (závisí na :root, předvídatelné) */
}
```

`rem` je **předvídatelnější**, protože nezávisí na vnořování. Doporučení:

- `rem` pro `font-size`, `margin`, `padding`, `gap` (globální mezery)
- `em` pro vlastnosti, které mají škálovat s textem (např. `border-radius` u tlačítka)
- `px` pro tenké okraje (`border: 1px solid`) a stínítka

### Viewport jednotky

| Jednotka | Co znamená |
| --- | --- |
| `vw` | 1 % šířky viewportu |
| `vh` | 1 % výšky viewportu |
| `vmin` | 1 % menší ze stran viewportu |
| `vmax` | 1 % větší ze stran viewportu |

### Moderní viewport jednotky (mobilní problém)

Klasický `100vh` na mobilu zlobí: ve Safari to často přesahuje obrazovku, protože nezohledňuje adresní řádek. Proto W3C přidalo dynamické varianty:

| Prefix | Význam |
| --- | --- |
| `sv*` (small) | Nejmenší možná výška viewportu (adresní řádek viditelný) |
| `lv*` (large) | Největší možná výška viewportu (adresní řádek skrytý) |
| `dv*` (dynamic) | Dynamická, mění se za běhu |

```css
.hero {
  min-height: 100dvh;   /* zaplní celou obrazovku bez ohledu na stav UI prohlížeče */
}
```

Verze pro každý rozměr: `svh`, `lvh`, `dvh`, `svw`, `lvw`, `dvw`, `svmin`, `lvmin`, `dvmin`, atd.

### Container query jednotky

Místo viewportu reagují na **velikost kontejneru**.

| Jednotka | Co znamená |
| --- | --- |
| `cqw`, `cqh` | 1 % šířky / výšky kontejneru |
| `cqi`, `cqb` | 1 % inline / block dimenze kontejneru |
| `cqmin`, `cqmax` | Menší / větší rozměr kontejneru |

```css
.card-container { container-type: inline-size; }

.card-title {
  font-size: clamp(1rem, 5cqi, 2rem);   /* roste se šířkou karty */
}
```

### Grid jednotka

`fr`  - frakce zbývajícího místa v layoutu

```css
.grid {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;   /* prostřední je 2× širší */
}
```

### Procenta

```css
.box {
  width: 50%;        /* 50 % šířky rodiče */
  font-size: 120%;   /* 120 % font-size rodiče */
}
```

`%` se vždy vztahuje k rodičovskému prvku, ale **k čemu konkrétně** závisí na vlastnosti (šířka, výška, font-size, atd.).

# **CSS funkce pro hodnoty**

### `calc()` (výpočet)

Umožňuje matematické operace včetně různých jednotek:

```css
.sidebar {
  width: calc(100% - 300px);   /* zbytek po hlavním obsahu */
  font-size: calc(1rem + 2vw); /* fluidní typografie */
}
```

### `min()`, `max()`

```css
.container {
  width: min(90%, 1200px);     /* menší ze dvou: 90% rodiče, nebo 1200px */
  font-size: max(1rem, 2vw);   /* větší ze dvou: 1rem nebo 2vw */
}
```

**`clamp()` (omezení mezi min a max)**

```css
.heading {
  /* font-size se škáluje s viewportem, ale nikdy pod 1.5rem a nikdy nad 4rem */
  font-size: clamp(1.5rem, 4vw, 4rem);
}
```

`clamp(MIN, IDEAL, MAX)` je dnes hlavní nástroj pro **fluidní typografii**: text se plynule škáluje s velikostí obrazovky, ale s rozumnými hranicemi.

# CSS barvy

### Formáty zápisu barev

| Formát | Příklad | Popis |
| --- | --- | --- |
| **Klíčové slovo** | `red`, `aliceblue`, `rebeccapurple` | 147 pojmenovaných barev plus `transparent` a `currentColor` |
| **HEX** | `#FF0000` nebo `#F00` | Hexadecimální RGB |
| **HEX s alpha** | `#FF0000B3` nebo `#F00B` | RGBA jako 8 nebo 4 znaky |
| **RGB / RGBA** | `rgb(255 0 0 / 0.5)` | Klasický model |
| **HSL / HSLA** | `hsl(0 100% 50% / 0.5)` | Odstín, sytost, světlost |
| **HWB** | `hwb(0 0% 0%)` | Odstín, bílá, černá |
| **OKLCH** | `oklch(62% 0.25 29)` | Moderní, lineární vnímání, široký gamut |
| **LAB / LCH** | `lab(50% 40 30)` | Perceptuálně uniformní prostor |

**HEX podrobně**

```css
color: #3b82f6;       /* RGB, 6 znaků */
color: #3b82f680;     /* RGBA, 8 znaků (80 = alpha cca 50 %) */
color: #f00;          /* zkrácená forma RGB */
color: #f008;         /* zkrácená forma RGBA */
```

### Moderní syntaxe RGB/HSL

Současný standard (CSS Color Level 4) preferuje **mezery místo čárek** a lomítko pro alpha:

```css
/* Stará syntaxe (stále funguje) */
color: rgb(255, 0, 0);
color: rgba(255, 0, 0, 0.5);

/* Moderní syntaxe */
color: rgb(255 0 0);
color: rgb(255 0 0 / 0.5);
color: rgb(255 0 0 / 50%);     /* alpha jako procenta */
```

**HSL pro intuitivní ladění**

```css
background: hsl(220 90% 56%);   /* modrá */
background: hsl(140 90% 56%);   /* zelená (jen jiný odstín) */
background: hsl(0 0% 50%);      /* šedá (sytost 0) */
background: hsl(220 90% 90%);   /* světle modrá (vyšší světlost) */
```

Skvělé pro **generování barevných palet**: měníš jen jeden parametr.

### Moderní barevné prostory

**`oklch()`** je doporučený formát pro moderní design systémy. Důvod: na rozdíl od HSL jsou barvy se stejnou hodnotou `L` (lightness) skutečně vnímány jako stejně světlé.

```css
color: oklch(70% 0.15 250);   /* světlost / chroma / hue */
```

V HSL `hsl(60 100% 50%)` (žlutá) a `hsl(240 100% 50%)` (modrá) mají stejnou L = 50 %, ale oko je vnímá výrazně jinak. OKLCH to opravuje.

**`color-mix()` (míchání barev)**

Široká podpora od 2023:

```css
.button:hover {
  background: color-mix(in oklch, var(--primary) 80%, white);
}
```

Smíchá `--primary` s bílou v poměru 80:20. Dřív se to muselo dělat manuálně nebo přes Sass.

### Speciální klíčová slova

| Slovo | Co znamená |
| --- | --- |
| `transparent` | Kompletně průhledná (`rgba(0,0,0,0)`) |
| `currentColor` | Aktuální hodnota vlastnosti `color` |

`currentColor` je extrémně užitečné pro SVG ikony, které mají dědit barvu z okolí:

```css
.icon {
  fill: currentColor;   /* ikona bude mít barvu okolního textu */
}

.warning {
  color: red;
}
.warning .icon { /* automaticky červená */ }
```

### Kontrast a přístupnost

WCAG 2.2 definuje minimální poměry kontrastu mezi textem a pozadím:

| Úroveň | Normální text | Velký text *(18pt+ nebo 14pt+ tučný)* |
| --- | --- | --- |
| **AA** *(standard)* | 4.5 : 1 | 3 : 1 |
| **AAA** *(maximum)* | 7 : 1 | 4.5 : 1 |

# CSS proměnné (Custom Properties)

CSS proměnné jsou "vlastnosti" s **dvěma pomlčkami na začátku**. Můžou obsahovat jakoukoli validní CSS hodnotu, dědí se a fungují přes celou kaskádu.

```css
:root {
  --primary-color: #3b82f6;
  --font-size-base: 16px;
  --spacing-md: 1rem;
  --border-radius: 8px;
  --shadow-lg: 0 10px 25px rgb(0 0 0 / 0.1);
}

.button {
  background-color: var(--primary-color);
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-lg);
}
```

### Scope (působnost)

Proměnné se definují **na elementu** a dědí se na potomky. `:root` znamená globální dostupnost (kořen dokumentu), ale můžeš proměnnou přepsat kdekoli:

```css
:root {
  --color: blue;
}

.warning {
  --color: red;   /* uvnitř .warning je var(--color) červené */
}

p {
  color: var(--color);   /* modré všude, červené uvnitř .warning */
}
```

### Fallback hodnoty

Druhý argument `var()` je fallback, pokud proměnná neexistuje nebo je neplatná:

```css
.button {
  color: var(--btn-color, blue);   /* pokud --btn-color není definované */
}
```

### Dynamické změny z JavaScriptu

Hlavní výhoda oproti Sass proměnným: lze měnit **za běhu**.

```css
document.documentElement.style.setProperty('--primary-color', 'green');
```

Tím se okamžitě překreslí všechno, co tu proměnnou používá. Skvělé pro:

- Themes (light/dark)
- Customizovatelná barva podle uživatele
- Animace přes JavaScript

**Dark mode přes proměnné:**

```css
:root {
  --bg: white;
  --text: black;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #1a1a1a;
    --text: #e0e0e0;
  }
}

body {
  background: var(--bg);
  color: var(--text);
}
```

### Design tokens

V design systémech se proměnné rozdělují na úrovně:

```css
:root {
  /* Primitivní (raw hodnoty) */
  --blue-500: #3b82f6;
  --gray-100: #f3f4f6;

  /* Sémantické (role) */
  --color-primary: var(--blue-500);
  --color-surface: var(--gray-100);

  /* Komponentové */
  --button-bg: var(--color-primary);
}
```

Když budeš měnit barvu primary, stačí to udělat na jednom místě a propíše se to dál.

# Písma v CSS

### Základní vlastnosti

```css
.text {
  font-family: 'Inter', Arial, sans-serif;
  font-size: 1rem;
  font-weight: 700;             /* 100-900, normal=400, bold=700 */
  font-style: italic;
  font-variant: small-caps;
  line-height: 1.5;
  letter-spacing: 0.05em;
  word-spacing: 0.1em;
  text-align: center;
  text-transform: uppercase;
  text-decoration: underline wavy red;
  text-indent: 2rem;
}
```

### Font stack (záložní písma)

Vždy definuj **řetězec záložních písem** pro případ, že primární není dostupné:

```css
font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
/*           ↑ vlastní  ↑ macOS systémové  ↑ Win/Linux  ↑ generic */
```

Generické kategorie (vždy poslední fallback):

| Kategorie | Příklad |
| --- | --- |
| `serif` | Times, Georgia |
| `sans-serif` | Arial, Helvetica |
| `monospace` | Courier, JetBrains Mono |
| `cursive` | Comic Sans (pls don't) |
| `fantasy` | Papyrus, Impact |
| `system-ui` | Aktuální systémové písmo OS |
| `ui-serif`, `ui-sans-serif`, `ui-monospace` | Systémové varianty |

### System font stack

Pro nativní vzhled bez stahování fontů:

```css
font-family:
  -apple-system,            /* macOS Safari */
  BlinkMacSystemFont,        /* macOS Chrome */
  'Segoe UI',                /* Windows */
  Roboto,                    /* Android */
  Oxygen, Ubuntu, Cantarell, /* Linux */
  sans-serif;
```

Výhody: žádné stahování, perfektní rendering, písmo, na které je uživatel zvyklý.

**`@font-face` (vlastní písmo)**

```css
@font-face {
  font-family: 'MujFont';
  src: url('fonts/mujfont.woff2') format('woff2'),
       url('fonts/mujfont.woff') format('woff');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0000-00FF, U+0100-017F;   /* základní latin + latin extended */
}
```

**`font-display` (důležité pro výkon)**

Kontroluje, co prohlížeč udělá, **dokud se font stahuje**:

| Hodnota | Chování |
| --- | --- |
| `auto` | Default, závisí na prohlížeči (typicky `block`) |
| `block` | Text neviditelný po dobu max 3 sekund, pak fallback (FOIT) |
| `swap` | Hned zobrazí fallback, vymění za font po stažení (FOUT). **Doporučené.** |
| `fallback` | Krátká neviditelnost (100ms), pak fallback, výměna jen pokud font dorazí brzy |
| `optional` | Krátká neviditelnost, pak fallback, font se použije jen na příští návštěvu |

**FOIT** *(Flash Of Invisible Text)* je horší než **FOUT** *(Flash Of Unstyled Text)*: prázdná stránka vypadá jako rozbitá, fallback text se aspoň dá číst.

```css
@font-face {
  font-family: 'Inter';
  src: url('inter.woff2') format('woff2');
  font-display: swap;   /* user vidí text okamžitě */
}
```

### Formáty fontů

| Formát | Popis |
| --- | --- |
| **WOFF2** | Aktuální standard, nejmenší velikost (kompresí Brotli) |
| WOFF | Starší varianta, fallback |
| TTF/OTF | Originální desktopové formáty, větší |
| EOT | Jen pro stará IE, dnes mrtvé |
| SVG fonts | Mrtvé, neimplementované v moderních prohlížečích |

V praxi stačí **jen WOFF2**, kompatibilní s 96 % prohlížečů.

**Variable fonts (moderní)**

```css
@font-face {
  font-family: 'Inter Variable';
  src: url('inter-variable.woff2') format('woff2-variations');
  font-weight: 100 900;   /* rozsah, ne jen jedna hodnota */
}

.heading {
  font-family: 'Inter Variable';
  font-weight: 387;       /* libovolná hodnota v rozsahu, ne jen 400/500/600 */
}
```

Výhody:

- **Jeden soubor** místo 9 (regular, bold, light, italic, atd.)
- **Plynulé animace tučnosti**: `transition: font-weight 0.3s`
- **Designové osy nad rámec tloušťky**: některé fonty mají `slnt` (slant), `wdth` (width), `opsz` (optical size), atd.

```css
.fancy {
  font-variation-settings: 'wght' 500, 'wdth' 110, 'slnt' -5;
}
```

**Preload kritického fontu**

```css
<link rel="preload"
      href="/fonts/inter.woff2"
      as="font"
      type="font/woff2"
      crossorigin>
```

Bez tohoto prohlížeč objeví font až při parsování CSS, což zpožďuje vykreslení textu.

# Ligatury a font features

**Ligatura** je grafické spojení dvou nebo více znaků do jednoho glyfu. Vylepšuje typografickou estetiku a v programátorských fontech může reprezentovat symboly jako `=>`, `!=`, `>=`.

### Typy ligatur

```css
.text {
  font-variant-ligatures: 
    common-ligatures /* fi, fl, ff (zapnuto defaultně) */
    discretionary-ligatures /* nepovinné dekorativní (Th, ct...) */
    historical-ligatures /* staré historické */ 
    contextual; /* kontextové (závisí na okolních znacích) */
}

/* Vypnutí ligatur */
.no-ligatures {
  font-variant-ligatures: none;
}
```

### `font-feature-settings` (nízkoúrovňový přístup)

Přímý přístup k OpenType funkcím fontu:

```css
.text {
  font-feature-settings:
    "liga" 1,    /* standardní ligatury */
    "dlig" 1,    /* discretionary ligatures */
    "smcp" 1,    /* small caps */
    "onum" 1,    /* old-style numerals */
    "tnum" 1,    /* tabular (monospace) numerals */
    "frac" 1,    /* automatické zlomky 1/2 → ½ */
    "ss01" 1;    /* stylistic set #1 (font-specific) */
}
```

Moderní alternativa je `font-variant-*` rodina vlastností:

```css
.text {
  font-variant-caps: small-caps;
  font-variant-numeric: tabular-nums oldstyle-nums;
  font-variant-ligatures: common-ligatures;
}
```

### Programovací fonty s ligaturami

Fonty jako **Fira Code**, **JetBrains Mono**, **Cascadia Code**, **Monaspace** transformují vícezakové operátory na jeden symbol:

```css
== → =       != → ≠       => → ⇒       >= → ≥
=== → ≡      <= → ≤       -> → →       <-- → ←
```

V kódu vidíš krásné symboly, ale soubor stále obsahuje `=>`. Někteří lidi to milují, jiní nesnáší (`font-variant-ligatures: none`).

### Font Icons (ikonická písma)

Speciální font, kde místo písmen jsou vektorové ikony:

```css
@font-face {
  font-family: 'MyIcons';
  src: url('icons.woff2') format('woff2');
}

.icon { font-family: 'MyIcons'; }

/* Material Icons styl: text "home" se zobrazí jako ikona */
.icon-home::before { content: "home"; }
```

| Výhody Font Icons | Nevýhody |
| --- | --- |
| Stylovatelné jako text (`color`, `font-size`) | Jen jednobarevné |
| Vektorové (ostré na všech rozlišeních) | Jeden font načítá všechny ikony |
| Snadné použití | Pro 5 ikon je to overkill |
|  | Hůř accessible (často potřeba `aria-label`) |

## Tipy pro ústní zkoušku

### Jak začít

> *"CSS vlastnosti definují, jak má prvek vypadat. Klíčové oblasti jsou jednotky (kterými zadáváme rozměry a velikosti), barvy (s několika formáty zápisu), proměnné (pro znovupoužitelné hodnoty), a typografie včetně ligatur. Můžu projít každou oblast zvlášť, nebo se zaměřit na konkrétní téma."*
> 

### Co komise typicky chce slyšet

- Rozdíl **absolutní vs relativní jednotky** s příkladem.
- **`em` vs `rem`**: oblíbená otázka, mít připravenou jasnou odpověď.
- **HEX, RGB, HSL** formáty a kdy co použít.
- **CSS proměnné** propojené s **dark mode** jako praktický příklad.
- **`@font-face`** a `.woff2` jako moderní formát.
- **Ligatury** propojené s **Font Icons** jako konkrétní use case.

### Doplňky, které komisi potěší

- **`dvh`, `svh`, `lvh`** jako řešení mobilního "100vh" problému s adresním řádkem.
- **Container query jednotky** (`cqi`, `cqw`).
- **`clamp()`** pro fluidní typografii.
- **OKLCH** jako perceptuálně uniformní barevný prostor.
- **`color-mix()`** pro míchání barev nativně v CSS.
- **`currentColor`** pro SVG ikony, které dědí barvu.
- **Variable fonts** a `font-variation-settings`.
- **`font-display: swap`** jako Core Web Vitals optimalizace.

### Časté chytáky

| Otázka | Odpověď |
| --- | --- |
| *Co se stane s `1em` u tří úrovní vnoření, každá `font-size: 1.2em`?* | Násobí se: 1.2 × 1.2 × 1.2 = 1.728. To je důvod, proč pro globální mezery preferujeme `rem`. |
| *Kdy použít HSL místo HEX?* | Když potřebuješ ladit nebo generovat varianty (světlejší, tmavší). Stačí změnit jeden parametr. |
| *Co je `transparent`?* | Klíčové slovo ekvivalentní `rgba(0,0,0,0)`, plně průhledná barva. |
| *Proč CSS proměnné a ne Sass proměnné?* | CSS proměnné jsou runtime (lze měnit z JS, dědí se, fungují v media queries), Sass je compile-time. |
| *Co je rozdíl `var(--x)` a `--x`?* | `--x` je definice (vlastnost), `var(--x)` je čtení hodnoty té proměnné. |
| *Proč `font-display: swap`?* | Aby uživatel viděl text okamžitě v fallback fontu. Bez něj může být text 3 sekundy neviditelný (FOIT). |
| *Co je ligatura?* | Sloučení vícero znaků do jednoho glyfu. V typografii kvůli estetice (fi, fl), v programovacích fontech pro operátory (=>, !=). |