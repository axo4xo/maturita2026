# 7 • Tabulky v HTML a jejich stylování

> Struktura tabulky, vzhled tabulky pomocí CSS, sloučení buněk (rowspan, colspan)
> 

> **Formát:** 30 min praktická úloha, 15 min obhajoba + teorie. Tady je teorie kompletní (i s tím, co tvoje původní zápisky neměly: `<caption>`, `scope`, responsive tables, sticky header) a praktika s řešením.
> 

---

# Část 1: Teorie

### K čemu tabulky slouží (a k čemu NE)

**Tabulky jsou pro tabulková data**: informace organizované do řádků a sloupců, kde má smysl je porovnávat (ceník, rozvrh, výsledky, statistiky, technické parametry produktu).

> **Důležitý kontext**: V 90. letech a začátku 2000. let se tabulky používaly pro **layout celé stránky** (různě vnořené `<table>` pro hlavičku, sidebar, main). To byl klasický anti-pattern, který zabíjel SEO, accessibility a zpomaloval rendering. Dnes jsou pro layout **Flexbox a Grid**, tabulky **jen pro skutečná tabulková data**.
> 

| Použít tabulku | Nepoužívat tabulku |
| --- | --- |
| Ceník služeb | Layout celé stránky |
| Rozvrh hodin | Mřížka karet produktů (použij Grid) |
| Sportovní výsledky | Formulář (použij CSS Grid nebo Flexbox) |
| Technické parametry | Galerie obrázků |
| Porovnání produktových plánů | Vícesloupcový text (použij CSS columns) |
| Bankovní výpisy | Hero sekce, navbar, footer |

---

### Základní struktura

```html
<table>
    <tr>                           <!-- table row -->
        <th>Jméno</th>             <!-- table header (záhlaví buňka) -->
        <th>Věk</th>
        <th>Město</th>
    </tr>
    <tr>
        <td>axo</td>               <!-- table data (běžná buňka) -->
        <td>18</td>
        <td>Liberec</td>
    </tr>
    <tr>
        <td>karel</td>
        <td>19</td>
        <td>Praha</td>
    </tr>
</table>
```

| Element | Plný název | K čemu |
| --- | --- | --- |
| `<table>` | Table | Kořen tabulky |
| `<tr>` | Table Row | Jeden řádek |
| `<th>` | Table Header | Záhlaví (bold, centrované) |
| `<td>` | Table Data | Běžná buňka |

> **Drobnost:** atribut `<table border="1">` je **HTML4 přežitek**. Dnes se ohraničení dělá výhradně v CSS. Pro maturitu si to pamatuj: `border="1"` v HTML je deprecated.
> 

---

### Sémantické sekce: thead, tbody, tfoot

Tabulku lze (a měla by se) rozdělit na tři logické části:

```html
<table>
    <thead>
        <tr>
            <th>Produkt</th>
            <th>Cena</th>
            <th>Dostupnost</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Notebook</td>
            <td>20 000 Kč</td>
            <td>Skladem</td>
        </tr>
        <tr>
            <td>Telefon</td>
            <td>10 000 Kč</td>
            <td>Není skladem</td>
        </tr>
    </tbody>
    <tfoot>
        <tr>
            <td colspan="3">Ceny jsou včetně DPH.</td>
        </tr>
    </tfoot>
</table>
```

| Element | K čemu |
| --- | --- |
| `<thead>` | Hlavička (typicky 1 řádek s `<th>` názvy sloupců) |
| `<tbody>` | Tělo (data) |
| `<tfoot>` | Patička (typicky souhrn, total, poznámka) |

**Výhody rozdělení:**

- **Sémantika**: prohlížeč i screen reader chápou strukturu
- **Tisk**: thead/tfoot se opakují na každé stránce při tisku dlouhé tabulky
- **CSS**: lze stylovat různé sekce odlišně
- **Sticky header**: `position: sticky` na `<thead>` přilepí hlavičku při scrollu

---

### Caption: nadpis tabulky

`<caption>` je **popisek tabulky**. Píše se jako **první dítě** `<table>`.

```html
<table>
    <caption>Ceník produktů (květen 2026)</caption>
    <thead>...</thead>
    <tbody>...</tbody>
</table>
```

**Proč caption:**

- Pro screen readery: oznámí, o čem tabulka je, **před** čtením obsahu
- Pro hledání: caption je strojově čitelný popis
- Pro SEO: pomáhá vyhledávačům pochopit obsah

Default vizuálně se zobrazí nad tabulkou (lze přesunout přes `caption-side: bottom`).

---

### Sloučení buněk: `colspan` a `rowspan`

### `colspan`: sloučení napříč sloupci (horizontálně)

```html
<table>
    <tr>
        <th colspan="2">Kontakt</th>   <!-- jedna buňka přes 2 sloupce -->
    </tr>
    <tr>
        <td>Email</td>
        <td>axo@example.com</td>
    </tr>
    <tr>
        <td>Telefon</td>
        <td>+420 123 456 789</td>
    </tr>
</table>
```

Vykresleno:

```
┌─────────────────────────────┐
│        Kontakt              │   ← colspan="2"
├─────────┬───────────────────┤
│ Email   │ axo@example.com   │
├─────────┼───────────────────┤
│ Telefon │ +420 123 456 789  │
└─────────┴───────────────────┘
```

### `rowspan`: sloučení napříč řádky (vertikálně)

```html
<table>
    <tr>
        <td rowspan="3">Kategorie A</td>   <!-- jedna buňka přes 3 řádky -->
        <td>Produkt 1</td>
        <td>500 Kč</td>
    </tr>
    <tr>
        <td>Produkt 2</td>
        <td>700 Kč</td>
    </tr>
    <tr>
        <td>Produkt 3</td>
        <td>900 Kč</td>
    </tr>
</table>
```

```
┌─────────────┬───────────┬────────┐
│             │ Produkt 1 │ 500 Kč │
│ Kategorie A ├───────────┼────────┤
│  (rowspan)  │ Produkt 2 │ 700 Kč │
│             ├───────────┼────────┤
│             │ Produkt 3 │ 900 Kč │
└─────────────┴───────────┴────────┘
```

### Kombinace colspan a rowspan

```html
<table>
    <tr>
        <th>Den</th>
        <th>Dopoledne</th>
        <th>Odpoledne</th>
    </tr>
    <tr>
        <td>Pondělí</td>
        <td>Matematika</td>
        <td rowspan="2">Volno</td>    <!-- buňka 2 řádky vysoká -->
    </tr>
    <tr>
        <td>Úterý</td>
        <td>Čeština</td>
    </tr>
    <tr>
        <td>Středa</td>
        <td colspan="2">Výlet</td>     <!-- buňka přes 2 sloupce -->
    </tr>
</table>
```

> **Klasický chyták**: když máš `rowspan="2"`, musíš v dalším řádku **vynechat příslušnou buňku** (nepsat ji). Jinak tabulka přesune sloupce o jednu pozici a rozsype se.
> 

---

### Accessibility: `scope` atribut

`scope` říká, k čemu `<th>` patří. Pomáhá screen readerům správně přiřadit hlavičky k datům.

```html
<table>
    <thead>
        <tr>
            <th scope="col">Jméno</th>      <!-- záhlaví sloupce -->
            <th scope="col">Věk</th>
            <th scope="col">Město</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th scope="row">axo</th>         <!-- záhlaví řádku (vlevo) -->
            <td>18</td>
            <td>Liberec</td>
        </tr>
        <tr>
            <th scope="row">karel</th>
            <td>19</td>
            <td>Praha</td>
        </tr>
    </tbody>
</table>
```

Hodnoty `scope`:

- `col`: záhlaví sloupce (default chování pro `<th>` v `<thead>`)
- `row`: záhlaví řádku (vlevo)
- `colgroup`: záhlaví skupiny sloupců
- `rowgroup`: záhlaví skupiny řádků

> V malých jednoduchých tabulkách prohlížeč scope odvodí. Ve složitějších (s rowspan/colspan) by se měl psát explicitně.
> 

---

### CSS pro tabulky

### Základní stylování

```css
table {
    width: 100%;
    border-collapse: collapse;       /* sloučí dvojité bordery */
}

th, td {
    border: 1px solid #ddd;
    padding: 0.75rem;
    text-align: left;
}

th {
    background-color: #f3f4f6;
    font-weight: bold;
}
```

### `border-collapse`: kritická vlastnost

| Hodnota | Co dělá |
| --- | --- |
| `separate` (default) | Každá buňka má vlastní border, mezi nimi mezera |
| `collapse` | Bordery sousedních buněk se slučují (jeden border místo dvou) |

```
border-collapse: separate          border-collapse: collapse
┌───────┐ ┌───────┐ ┌───────┐     ┌───────┬───────┬───────┐
│       │ │       │ │       │     │       │       │       │
└───────┘ └───────┘ └───────┘     ├───────┼───────┼───────┤
┌───────┐ ┌───────┐ ┌───────┐     │       │       │       │
│       │ │       │ │       │     └───────┴───────┴───────┘
└───────┘ └───────┘ └───────┘
(dvojité bordery)                  (jeden border, čisté)
```

V praxi **téměř vždy `collapse`**.

### `border-spacing` (jen s `separate`)

```css
table {
    border-collapse: separate;
    border-spacing: 0.5rem;       /* mezera mezi buňkami */
}
```

### Striped rows (zebra efekt)

```css
tbody tr:nth-child(even) {
    background-color: #f9fafb;
}
```

`:nth-child(even)` aplikuje na každý sudý řádek. Alternativy: `odd`, `2n+1`, `3n` (každý třetí).

### Hover na řádky

```css
tbody tr:hover {
    background-color: #eff6ff;
    cursor: pointer;
}
```

### Zarovnání

```css
td.cena {
    text-align: right;          /* čísla zprava */
    font-variant-numeric: tabular-nums;   /* všechna čísla stejně široká */
}

td.status {
    text-align: center;
}
```

### Sticky header

```css
thead th {
    position: sticky;
    top: 0;
    background: white;
    z-index: 1;
}
```

Při scrollu se hlavička přilepí nahoru. Funguje uvnitř kontejneru s `overflow: auto`.

### Responzivní tabulka

Tabulky se na mobilu špatně přizpůsobují. **Nejjednodušší řešení**: horizontální scroll v obalu:

```html
<div class="table-wrapper">
    <table>...</table>
</div>
```

```css
.table-wrapper {
    overflow-x: auto;     /* scroll horizontálně, když je potřeba */
    max-width: 100%;
}
```

### Kompletní hezký styl

```css
.table-wrapper {
    overflow-x: auto;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

table {
    width: 100%;
    border-collapse: collapse;
    background: white;
}

caption {
    font-weight: bold;
    padding: 1rem;
    text-align: left;
    background: #f9fafb;
}

th {
    background: #1f2937;
    color: white;
    padding: 0.75rem 1rem;
    text-align: left;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.85rem;
    letter-spacing: 0.05em;
}

td {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #e5e7eb;
}

tbody tr:nth-child(even) {
    background: #f9fafb;
}

tbody tr:hover {
    background: #eff6ff;
}

tfoot td {
    background: #f3f4f6;
    font-style: italic;
    color: #6b7280;
}
```

---

### Pokročilejší: `<colgroup>` a `<col>`

> Vzácně potřeba, ale stojí za znát.
> 

Umožňuje stylovat **celé sloupce** najednou (jinak musíš stylovat každou buňku).

```html
<table>
    <colgroup>
        <col style="background: #fef3c7">     <!-- první sloupec žlutý -->
        <col>
        <col style="width: 150px">             <!-- třetí sloupec 150 px -->
    </colgroup>
    <thead>...</thead>
    <tbody>...</tbody>
</table>
```

V CSS lze cílit `col` selectorem:

```css
col.zvyrazneny {
    background: #fef3c7;
}
```

Některé CSS vlastnosti na `<col>` fungují (background, width, border), jiné ne (padding, text-align: musíš stylovat buňky).

---

### Pokročilé: data tables (dynamické)

V reálných aplikacích se používají knihovny pro sortable, filterable, paginated tabulky:

- **DataTables** (jQuery, klasika)
- **AG Grid** (modern, výkonný)
- **TanStack Table** (React, Vue, headless)
- Vlastní řešení s `<table>` + JS sort/filter logikou

Pro maturitu stačí znát strukturu HTML/CSS.

---

### Časté chyby

| Chyba | Důsledek | Řešení |
| --- | --- | --- |
| `<table border="1">` v moderním HTML | Funguje, ale je deprecated | Border dělat v CSS |
| Tabulky pro layout | Špatné SEO, accessibility, výkon | Flexbox / Grid |
| `rowspan` bez vynechání buňky v dalším řádku | Tabulka se rozsype | Vynechat buňku, kterou rowspan pokrývá |
| Bez `border-collapse: collapse` | Dvojité bordery, vypadá zle | Vždy `collapse` (kromě výjimek) |
| `<th>` ve všech řádcích bez `scope` | Screen reader neví, jak je číst | Přidat `scope="col"` / `scope="row"` |
| Žádné `<thead>/<tbody>` | Funguje, ale méně sémantické | Vždy rozdělit, hlavně u větších tabulek |
| Tabulka přetéká na mobilu | UI rozbité | Obalit `overflow-x: auto` wrapperem |
| Čísla zarovnaná doleva | Špatně se čte | Pro čísla `text-align: right` |
| `<caption>` po hlavičce | Nezobrazí se nebo invalidní | Caption musí být **první** dítě `<table>` |

---

# Část 2: Praktická úloha

### Co může praktická úloha obsahovat

Typická úloha:

- **Tabulka s daty** (ceník, rozvrh, výsledky, srovnání)
- **`<thead>`, `<tbody>`, `<tfoot>`** sémantické rozdělení
- **`<caption>`** popisek
- **`colspan`** nebo **`rowspan`** sloučení buněk
- **CSS styling**: border-collapse, padding, hover, zebra rows
- **Responzivita**: overflow-x na wrapperu
- **Sticky header** (volitelně)

### Příklad zadání: Harmonogram konference

Vytvoř HTML tabulku **harmonogramu konference TechConf 2026** s následujícími požadavky:

1. **Caption**: "Harmonogram konference TechConf 2026 (Liberec)"
2. **`<thead>`**: Den / 9:00 / 11:00 / 13:00 / 15:00
3. **`<tbody>`**: 3 dny s programem
4. **Sloučené buňky**:
    - "Společný oběd" zabírá víc sloupců (`colspan`) v jednom čase
    - "Networking" zabírá víc řádků (`rowspan`) přes víc dní
5. **`<tfoot>`**: poznámka přes celou šířku (registrace povinná)
6. **CSS**: border-collapse, padding, zebra rows, hover, hezké hlavičky, responzivní wrapper

### Řešení: `index.html`

```html
<!DOCTYPE html>
<html lang="cs">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TechConf 2026 - Harmonogram</title>
    <link rel="stylesheet" href="styly.css">
</head>
<body>

<h1>TechConf 2026</h1>

<div class="table-wrapper">
    <table>
        <caption>Harmonogram konference TechConf 2026 (Liberec)</caption>

        <thead>
            <tr>
                <th scope="col">Den</th>
                <th scope="col">9:00</th>
                <th scope="col">11:00</th>
                <th scope="col">13:00</th>
                <th scope="col">15:00</th>
            </tr>
        </thead>

        <tbody>
            <tr>
                <th scope="row">Pondělí</th>
                <td>Úvodní keynote</td>
                <td>Web Development</td>
                <td colspan="2">Společný oběd a networking</td>
            </tr>
            <tr>
                <th scope="row">Úterý</th>
                <td>AI a strojové učení</td>
                <td>Cloud architecture</td>
                <td>Workshop: Docker</td>
                <td rowspan="2">Networking koktejl</td>
            </tr>
            <tr>
                <th scope="row">Středa</th>
                <td>Bezpečnost a kryptografie</td>
                <td>DevOps trendy</td>
                <td>Závěrečný panel</td>
            </tr>
        </tbody>

        <tfoot>
            <tr>
                <td colspan="5">Registrace povinná na <a href="https://techconf.cz">techconf.cz</a>. Cena 1 990 Kč.</td>
            </tr>
        </tfoot>
    </table>
</div>

</body>
</html>
```

### Řešení: `styly.css`

```css
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
    font-family: system-ui, sans-serif;
    line-height: 1.6;
    color: #222;
    background: #f3f4f6;
    padding: 2rem;
}

h1 {
    margin-bottom: 1.5rem;
    color: #1f2937;
}

/* Responzivní wrapper */
.table-wrapper {
    overflow-x: auto;
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

table {
    width: 100%;
    border-collapse: collapse;
    min-width: 600px;       /* na mobilu wrapper umožní scroll */
}

caption {
    padding: 1rem;
    text-align: left;
    font-weight: bold;
    background: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
    caption-side: top;
}

thead th {
    background: #1f2937;
    color: white;
    padding: 0.75rem 1rem;
    text-align: left;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.85rem;
    letter-spacing: 0.05em;
    position: sticky;
    top: 0;
}

tbody th {
    background: #f3f4f6;
    text-align: left;
    padding: 0.75rem 1rem;
    font-weight: 600;
}

td {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #e5e7eb;
}

tbody tr:nth-child(even) td {
    background: #f9fafb;
}

tbody tr:hover td,
tbody tr:hover th {
    background: #eff6ff;
}

tfoot td {
    background: #f3f4f6;
    font-style: italic;
    color: #6b7280;
    padding: 1rem;
    border-bottom: none;
}

tfoot a {
    color: #6366f1;
    text-decoration: none;
    font-weight: 500;
}

tfoot a:hover {
    text-decoration: underline;
}
```

### Co se v řešení děje

- **`<caption>`** jako první dítě tabulky popisuje, o čem to je. Default umístění nad tabulkou.
- **`<thead>`** obsahuje hlavičky sloupců se `scope="col"` (řádky času).
- **`<tbody>`** obsahuje data, kde každý den má vlevo `<th scope="row">` (záhlaví řádku).
- **`colspan="2"`** v pondělí spojí buňky 13:00 a 15:00 do jedné "Společný oběd a networking".
- **`rowspan="2"`** v úterním 15:00 spojí buňky v 15:00 přes úterý a středu do jednoho "Networking koktejl". Pozor: ve středu jsem **vynechal poslední `<td>`** (rowspan už to pokrývá).
- **`<tfoot>`** s `colspan="5"` (Den + 4 časy = 5 sloupců) přes celou šířku.
- **CSS**: `border-collapse: collapse`, zebra rows přes `nth-child(even)`, hover na řádky, sticky thead, responzivní wrapper s `overflow-x: auto`.

### Co je nejtěžší zapamatovat

**Rowspan rozbije počet buněk!** Když má buňka `rowspan="2"`, v dalším řádku **musíš vynechat** odpovídající `<td>`. Jinak se ti tabulka rozsype, protože tam bude o jeden sloupec navíc.

```html
<!-- ✓ Správně -->
<tr>
    <td>Úterý</td>
    <td>A</td>
    <td>B</td>
    <td>C</td>
    <td rowspan="2">D-E</td>       <!-- rowspan -->
</tr>
<tr>
    <td>Středa</td>
    <td>F</td>
    <td>G</td>
    <td>H</td>
    <!-- ŽÁDNÝ <td> tady, D-E nahoře to zabírá -->
</tr>

<!-- ❌ Špatně, tabulka se rozsype -->
<tr>
    <td>Středa</td>
    <td>F</td>
    <td>G</td>
    <td>H</td>
    <td>X</td>   <!-- tohle nepatří, posune ostatní sloupce -->
</tr>
```

---

## Část 3: Tipy pro obhajobu

### Co u obhajoby říct

> *"V zadání jsem vytvořil tabulku harmonogramu konference. Použil jsem sémantické rozdělení do thead, tbody a tfoot. V thead jsou hlavičky sloupců s scope='col', v tbody mají dny vlevo th s scope='row', což pomáhá screen readerům správně přiřadit data k hlavičkám. Caption jako první dítě tabulky popisuje její obsah. Pro sloučení buněk jsem použil colspan v pondělí pro společný oběd přes dva časy a rowspan u Networking koktejlu, který běží úterý i středu v 15:00 - důležité je, že v řádku středy jsem příslušný td vynechal, jinak by se tabulka rozsypala. CSS používá border-collapse collapse, zebra rows přes nth-child(even), hover na řádky a sticky header. Pro responzivitu je tabulka v wrapperu s overflow-x: auto, takže na mobilu se dá scrollovat horizontálně."*
> 

### Klíčové pojmy pro teorii

| Pojem | Rychlá odpověď |
| --- | --- |
| **`<table>`** | Kořen tabulky |
| **`<tr>`** | Table row, jeden řádek |
| **`<th>`** | Table header, záhlaví (bold, centrované) |
| **`<td>`** | Table data, běžná buňka |
| **`<thead>`, `<tbody>`, `<tfoot>`** | Sémantické sekce tabulky |
| **`<caption>`** | Popisek tabulky, první dítě `<table>` |
| **`colspan="N"`** | Buňka přes N sloupců (horizontálně) |
| **`rowspan="N"`** | Buňka přes N řádků (vertikálně) |
| **`scope="col"` / `"row"`** | Pro accessibility: th patří k sloupci/řádku |
| **`border-collapse: collapse`** | Sloučení sousedních borderů |
| **`border-spacing`** | Mezera mezi buňkami (jen s separate) |
| **`:nth-child(even)`** | Zebra rows (každý druhý řádek) |
| **`overflow-x: auto`** | Horizontální scroll pro responzivitu |
| **`<colgroup>`, `<col>`** | Stylování celých sloupců |

### Časté chytáky

| Otázka | Odpověď |
| --- | --- |
| *Proč nepoužívat tabulky pro layout?* | Špatná accessibility, SEO, zpomalí rendering. Flexbox a Grid jsou na to. Tabulky **jen pro tabulková data**. |
| *Rozdíl `<th>` a `<td>`?* | `<th>` je záhlaví (bold, centrované, sémanticky důležité). `<td>` je běžná buňka. |
| *K čemu `<thead>` a `<tbody>`?* | Sémantické rozdělení, lepší accessibility, opakování thead při tisku víc-stránkové tabulky, snazší CSS styling. |
| *Co je rozdíl colspan a rowspan?* | colspan slučuje horizontálně (přes sloupce), rowspan slučuje vertikálně (přes řádky). |
| *Co je `border-collapse: collapse`?* | Sloučí sousední bordery do jednoho. Bez toho má každá buňka vlastní border a vypadají dvojité. |
| *Co je caption?* | Popisek tabulky, musí být první dítě `<table>`. Hlavně pro accessibility. |
| *Co dělá `scope`?* | Říká screen readerům, jestli je `<th>` záhlaví sloupce (`scope="col"`) nebo řádku (`scope="row"`). |
| *Jak udělat tabulku responzivní?* | Obalit ji `<div class="table-wrapper">` s `overflow-x: auto`. Na mobilu se dá scrollovat horizontálně. |
| *Proč `:nth-child(even)`?* | Zebra rows (stripped pattern). Každý druhý řádek má jinou barvu pozadí pro lepší čitelnost dlouhých tabulek. |
| *Co se stane, když mám rowspan="2" a nevynechám buňku?* | Tabulka se rozsype, sloupce se posunou. V druhém řádku musíš vynechat `<td>`, který rowspan pokrývá. |

### Časté chyby v praktické úloze

- Tabulka pro layout místo skutečných dat (anti-pattern)
- `<table border="1">` místo CSS borderu (HTML4 přežitek)
- Chybějící `<caption>` (špatné pro accessibility)
- Bez `<thead>/<tbody>` rozdělení (méně sémantické)
- `rowspan` bez vynechání buňky v dalším řádku (tabulka se rozsype)
- Bez `border-collapse: collapse` (dvojité bordery, vypadá špatně)
- Bez `scope` u th (screen reader nečte správně)
- Tabulka přetéká na mobilu (chybí responsive wrapper)
- Čísla zarovnaná doleva (`text-align: left`) místo doprava
- Caption až za thead (musí být před, jako první dítě table)
- `<th>` všude, i u dat (mělo by být jen u hlaviček)
- Nesouhlasící počet buněk v řádku (rowspan/colspan špatně spočítané)
- Sticky header bez `background` (text obsahu prosvítá pod hlavičkou)
- `colspan="3"` v tfoot, ale tabulka má 4 sloupce (špatný součet)