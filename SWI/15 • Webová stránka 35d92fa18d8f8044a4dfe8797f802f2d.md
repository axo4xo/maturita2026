# 15 • Webová stránka

> HTML tagy, atributy, struktura stránky, header tagy
> 

# Co je HTML

**HTML** *(HyperText Markup Language)* je **značkovací jazyk** pro tvorbu webových stránek. Neřeší vzhled, to je práce **CSS**. Neřeší chování, to je práce **JavaScriptu**. HTML definuje **strukturu a sémantiku** obsahu: co je nadpis, co odstavec, co navigace, co obrázek.

### Tři pilíře webu

| Technologie | Co dělá |
| --- | --- |
| **HTML** | Struktura a sémantika obsahu |
| **CSS** | Vzhled (barvy, layout, animace) |
| **JavaScript** | Chování a interaktivita |

### Hypertext

První dvě písmena HTML - **HyperText** - odkazuje na **hypertextové odkazy**, díky kterým je web "web" *(=pavučina)*. Bez hyperlinků by HTML byl jen formátovací jazyk.

# Základní syntaxe

### Tag

Tag je **značka uzavřená do špičatých závorek** `< >`. Většina tagů je párová, má **otevírací** a **uzavírací** část:

```html
<p>Toto je odstavec.</p>
```

Některé tagy jsou **nepárové** (void elements) — nemají obsah ani uzavírací tag:

```html
<img src="foto.jpg" alt="Popis">
<br>
<hr>
<meta charset="UTF-8">
```

### Vnořování

Tagy se vnořují do sebe — vždy se uzavírají v opačném pořadí, než byly otevřeny:

```html
<p>Text obsahuje <strong>tučné <em>a kurzivní</em></strong> slovo.</p>
```

**Špatně** *(překřížené tagy)*:

```html
<p><strong>Text</p></strong>  <!-- ❌ -->
```

### Atributy

**Atribut** je dodatečná informace v otevíracím tagu, syntaxe `název="hodnota"`:

```html
<a href="https://example.com" target="_blank">Odkaz</a>
```

### Komentáře

```html
<!-- Toto je komentář, prohlížeč ho ignoruje -→
```

### Speciální znaky (HTML entity)

Některé znaky mají v HTML speciální význam (`<`, `>`, `&`) — musí se zapsat jako entity:

| Entita | Znak | Význam |
| --- | --- | --- |
| `&lt;` | `<` | menší než |
| `&gt;` | `>` | větší než |
| `&amp;` | `&` | ampersand |
| `&quot;` | `"` | uvozovky |
| `&nbsp;` | (nezalomitelná mezera) | spojí dvě slova |
| `&copy;` | `©` | copyright |
| `&trade;` | `™` | trademark |
| `&#9731;` | ☃ | jakýkoli Unicode znak podle kódu |

# Struktura HTML dokumentu

Každá HTML stránka má **pevnou základní strukturu**:

```html
<!DOCTYPE html>
<html lang="cs">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Název stránky</title>
    <link rel="stylesheet" href="styles.css">
  </head>

  <body>
    <header>...</header>
    <main>...</main>
    <footer>...</footer>
  </body>
</html>
```

### `<!DOCTYPE html>`

**Není to tag**, je to **deklarace typu dokumentu**. Prohlížeči říká *"toto je HTML5+, použij standardní režim renderování"*. Bez ní se prohlížeč přepne do **quirks mode** - režimu kompatibility se starými stránkami, kde se věci zobrazují jinak (např. box model funguje špatně). Vždy patří jako **úplně první řádek**.

### `<html lang="cs">`

Kořenový element celé stránky. **Atribut `lang`** říká screen readerům, jakým jazykem se má text číst, a Googlu, pro jakou jazykovou skupinu stránku zobrazit. **Nezapomínej ho nastavit** - chybějící `lang` je v každém Lighthouse auditu chyba přístupnosti.

### `<head>` vs `<body>`

| Sekce | Obsah |
| --- | --- |
| **`<head>`** | **Metadata** — informace o stránce, nejsou vidět v těle prohlížeče *(kromě `<title>`, který se zobrazí na záložce)* |
| **`<body>`** | **Viditelný obsah** — vše, co uživatel uvidí na stránce |

# `<head>`: co všechno tam patří

### Povinné minimum

```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Název stránky</title>
```

| Element | Co dělá |
| --- | --- |
| `<meta charset="UTF-8">` | **Kódování znaků** — bez něj se diakritika zobrazí jako otazníky nebo "krakatice". UTF-8 je dnes standard. Musí být v prvních 1024 bytech dokumentu. |
| `<meta name="viewport"...>` | **Klíčový pro responzivitu** — bez něj mobil renderuje stránku jako desktop a zoomuje to. |
| `<title>` | **Záložka prohlížeče + zásadní pro SEO** — toto se zobrazuje ve výsledcích Googlu. 50–60 znaků. |

### SEO meta tagy

```html
<meta name="description" content="Stručný popis obsahu pro Google (150–160 znaků).">
<meta name="author" content="Jan Novák">
<meta name="robots" content="index, follow">
```

### Connections: CSS, JS, fonty, ikony

```html
<link rel="stylesheet" href="styles.css">              <!-- externí CSS -->
<link rel="icon" href="favicon.ico">                   <!-- favicon -->
<link rel="canonical" href="https://example.com/...">  <!-- kanonická URL -->
<script src="app.js" defer></script>                   <!-- JS s odloženým spuštěním -->
```

### Open Graph: náhled na sociálních sítích

```html
<meta property="og:title" content="Název stránky">
<meta property="og:description" content="Popis stránky">
<meta property="og:image" content="https://example.com/preview.jpg">
<meta property="og:url" content="https://example.com">
<meta property="og:type" content="article">
```

Bez OG tagů Facebook, LinkedIn, Discord ani Slack neumí stránku pěkně zobrazit při sdílení — ukáže jen holé URL.

### Twitter Cards

```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Název stránky">
<meta name="twitter:image" content="https://example.com/preview.jpg">
```

# Sémantické tagy (HTML5)

**Sémantické tagy** říkají **co obsah znamená,** pomáhají prohlížečům, vyhledávačům i screen readerům pochopit strukturu stránky. Bez nich byl web "moře `<div>`-ů" a nikdo nepoznal, co je co.

| Tag | Co označuje |
| --- | --- |
| `<header>` | Záhlaví stránky **nebo sekce** (logo, název, navigace). Může být na stránce vícekrát. |
| `<nav>` | **Hlavní** navigační menu. Ne každý seznam odkazů musí být `<nav>` — jen ty důležité. |
| `<main>` | Hlavní unikátní obsah stránky. **Jen jednou na stránku.** |
| `<article>` | **Samostatný ucelený obsah** — blog post, novinový článek, komentář. Mělo by dávat smysl i vytržené ze stránky. |
| `<section>` | **Tematická sekce** s vlastním nadpisem. Když nevíš, jestli `<section>` nebo `<div>`, použij `<div>`. |
| `<aside>` | **Doplňkový obsah** — sidebar, související články, citace. |
| `<footer>` | Zápatí stránky nebo sekce (copyright, kontakty, sociální sítě). |
| `<figure>` + `<figcaption>` | Obrázek/diagram s popiskem |
| `<time datetime="2026-05-11">11. května 2026</time>` | Datum a čas v strojově čitelné podobě |
| `<address>` | Kontaktní údaje |
| `<mark>` | Zvýrazněný text (jako žluté zvýraznění) |

### Příklad správné struktury

```html
<body>
  <header>
    <h1>Můj blog</h1>
    <nav>
      <ul>
        <li><a href="/">Úvod</a></li>
        <li><a href="/o-mne">O mně</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <article>
      <header>
        <h2>Název článku</h2>
        <time datetime="2026-05-11">11. května 2026</time>
      </header>
      <p>Obsah článku...</p>
      <footer>Autor: Axo</footer>
    </article>

    <aside>
      <h3>Související články</h3>
      <ul>...</ul>
    </aside>
  </main>

  <footer>
    <p>&copy; 2026 Můj blog</p>
  </footer>
</body>
```

### Proč to vůbec dělat

1. **SEO:** Google pak rozumí struktuře a může lépe rankovat.
2. **Přístupnost:** screen readery umí přeskočit na hlavní obsah pomocí "landmark" navigace.
3. **Údržba kódu:**  `<section class="header">` vs `<header>` — co je čitelnější?
4. **Stylování:** můžeš CSS targetovat sémantické elementy bez tříd.

# **Strukturální a textové tagy**

### Nadpisy

```html
<h1>Hlavní nadpis stránky</h1>     <!-- jen JEDEN na celou stránku -->
<h2>Hlavní sekce</h2>
<h3>Podsekce</h3>
<h4>...</h4>                       <!-- h5, h6 — málokdy potřeba -->
```

**Pravidla:**

- **`<h1>`** by měl být **jen jeden** — definuje téma celé stránky.
- Hierarchie se **nesmí přeskakovat** (`<h1>` → `<h3>` bez `<h2>` je špatně).
- Hierarchie pomáhá SEO i přístupnosti (screen reader umí navigovat po nadpisech).
- Nedělej z nadpisu obyčejný velký text — pro vizuální velikost je `font-size` v CSS.

### Odstavce a inline elementy

```html
<p>Odstavec textu.</p>

<strong>Důležitý text</strong>      <!-- sémanticky důležité, vizuálně tučně -->
<em>Zdůrazněný text</em>             <!-- sémanticky zdůrazněné, vizuálně kurzivou -->
<b>Tučně bez sémantiky</b>          <!-- jen vizuál, používat opatrně -->
<i>Kurziva bez sémantiky</i>        <!-- jen vizuál (cizí slova, technické termíny) -->
<u>Podtrženě</u>                     <!-- pozor, vypadá jako odkaz -->
<s>Přeškrtnuto</s>                   <!-- už neplatné, smazané -->
<code>kód</code>                     <!-- monospace, kus kódu -->
<kbd>Ctrl+C</kbd>                    <!-- klávesa -->
<mark>zvýrazněno</mark>              <!-- jako fixou -->
<small>drobné poznámky</small>
<sub>2</sub>                         <!-- dolní index (H<sub>2</sub>O) -->
<sup>2</sup>                         <!-- horní index (E=mc<sup>2</sup>) -->
<br>                                 <!-- konec řádku (nepárový) -->
<hr>                                 <!-- horizontální čára (nepárový) -->
```

### Seznamy

```html
<!-- Neuspořádaný (bullet points) -->
<ul>
  <li>První</li>
  <li>Druhý</li>
</ul>

<!-- Uspořádaný (číslovaný) -->
<ol start="3" reversed>
  <li>Třetí</li>
  <li>Druhý</li>
</ol>

<!-- Definiční -->
<dl>
  <dt>HTML</dt>
  <dd>HyperText Markup Language</dd>
  <dt>CSS</dt>
  <dd>Cascading Style Sheets</dd>
</dl>
```

### Kontejnery bez sémantiky

```html
<div>Blokový kontejner</div>          <!-- nový řádek, šířka 100% -->
<span>Inline kontejner</span>          <!-- inline, jen kolem textu -->
```

Použij je, **když žádný sémantický tag nepasuje** — typicky pro stylování přes CSS

## Block vs inline elementy

| Typ | Charakteristika | Příklady |
| --- | --- | --- |
| **Block-level** | Vždy začíná na novém řádku, defaultně zabírá celou šířku rodiče | `<div>`, `<p>`, `<h1>`–`<h6>`, `<ul>`, `<section>`, `<article>`, `<header>`, `<footer>` |
| **Inline** | Zůstává v řádku, šířka jen kolik potřebuje obsah | `<span>`, `<a>`, `<strong>`, `<em>`, `<img>`, `<input>`, `<code>` |
| **Inline-block** | Inline chování, ale lze nastavit šířku/výšku | `<img>`, `<button>` *(v některých prohlížečích)* |

### Pravidla pro vnořování

- **Block element může obsahovat blocky i inline.**
- **Inline element nesmí obsahovat block element.**

```html
<p>Odstavec se <span>spanem</span>.</p>     <!-- ✓ -->
<span>Span s <p>odstavcem</p></span>        <!-- ❌ -->
```

# Odkazy a navigace

### `<a>`: hypertext anchor

```html
<a href="https://example.com">Externí odkaz</a>
<a href="/o-nas">Interní odkaz (kořenově relativní)</a>
<a href="kapitola-2.html">Interní odkaz (dokumentově relativní)</a>
<a href="#kotva">Odkaz na kotvu na stejné stránce</a>
<a href="mailto:axo@example.com">E-mail</a>
<a href="tel:+420123456789">Telefon</a>
<a href="dokument.pdf" download>Stáhnout PDF</a>
```

### Důležité atributy `<a>`

| Atribut | Co dělá |
| --- | --- |
| `href` | Cíl odkazu |
| `target="_blank"` | Otevře v novém panelu |
| `rel="noopener noreferrer"` | **Vždy** s `target="_blank"` - bezpečnost (jinak nová stránka může manipulovat tu původní) |
| `download` | Stáhne místo otevření |
| `title` | Tooltip při najetí myší |

```html
<!-- Bezpečný externí odkaz -->
<a href="https://example.com" target="_blank" rel="noopener noreferrer">
  Externí web
</a>
```

---

# Obrázky a média

### `<img>`

```html
<img src="foto.jpg" alt="Popis obrázku" width="800" height="600" loading="lazy">
```

| Atribut | Co dělá |
| --- | --- |
| `src` | Cesta k obrázku |
| `alt` | **Alternativní text** — povinný pro přístupnost a SEO |
| `width` / `height` | Pomáhá prohlížeči rezervovat místo → lepší **CLS** *(Cumulative Layout Shift)* |
| `loading="lazy"` | Načte až když uživatel doscrolluje |
| `decoding="async"` | Dekódování mimo hlavní vlákno |

### `<picture>` responzivní obrázky

```html
<picture>
  <source srcset="hero.avif" type="image/avif">
  <source srcset="hero.webp" type="image/webp">
  <img src="hero.jpg" alt="Hero">
</picture>
```

Prohlížeč si vybere **první formát, který umí** — moderní prohlížeč dostane AVIF (nejmenší), starší WebP, fallback JPEG.

### `<video>` a `<audio>`

```html
<video controls width="640" poster="preview.jpg">
  <source src="video.webm" type="video/webm">
  <source src="video.mp4" type="video/mp4">
  <track kind="subtitles" src="titulky-cs.vtt" srclang="cs" label="Čeština">
  Tvůj prohlížeč nepodporuje video.
</video>

<audio src="zvuk.mp3" controls></audio>
```

| Atribut | Co dělá |
| --- | --- |
| `controls` | Zobrazí ovládací prvky |
| `autoplay` | Automatické přehrání *(blokované u videí se zvukem)* |
| `loop` | Smyčka |
| `muted` | Bez zvuku *(nutné pro autoplay)* |
| `poster` | Náhledový obrázek před přehráním |

# Formuláře

### Základní struktura

```html
<form action="/odeslat" method="POST" enctype="multipart/form-data">
  <label for="jmeno">Jméno:</label>
  <input type="text" id="jmeno" name="jmeno" required>

  <label for="email">E-mail:</label>
  <input type="email" id="email" name="email" required>

  <button type="submit">Odeslat</button>
</form>
```

### `<form>` atributy

| Atribut | Co dělá |
| --- | --- |
| `action` | URL, kam se data odešlou |
| `method` | `GET` *(data v URL, viditelná)* nebo `POST` *(v těle requestu, neviditelná)* |
| `enctype` | Kódování dat — `multipart/form-data` pro upload souborů |
| `autocomplete` | `on` / `off` — povolit automatické doplnění |
| `novalidate` | Vypne HTML5 validaci |

### `<input type="">` — typy

| Typ | Použití |
| --- | --- |
| `text` | Krátký text |
| `email` | E-mail (validace formátu) |
| `password` | Heslo (skrytý vstup) |
| `number` | Číslo (s šipkami) |
| `tel` | Telefon (na mobilu otevře číselnou klávesnici) |
| `url` | URL |
| `search` | Vyhledávací pole |
| `date` | Datum (native datepicker) |
| `time` | Čas |
| `datetime-local` | Datum + čas |
| `month` / `week` | Měsíc / týden |
| `color` | Color picker |
| `range` | Slider |
| `file` | Upload souboru |
| `checkbox` | Zaškrtávací políčko (více možností) |
| `radio` | Přepínač (jen jedna možnost ze skupiny) |
| `hidden` | Skryté pole (technická data) |
| `submit` | Tlačítko odeslat |
| `reset` | Tlačítko resetovat |

### `<input>` důležité atributy

```html
<input type="text"
       id="username"
       name="username"
       value="výchozí hodnota"
       placeholder="Zadej jméno"
       required
       minlength="3"
       maxlength="50"
       pattern="[A-Za-z]+"
       autocomplete="username"
       autofocus>

<input type="number" min="0" max="100" step="5">
<input type="file" accept="image/png, image/jpeg" multiple>
<input type="checkbox" checked>
<input type="radio" name="size" value="m" checked>
```

### `<label>` a proč na něm záleží

```html
<!-- Pomocí for + id -->
<label for="email">E-mail:</label>
<input type="email" id="email" name="email">

<!-- Pomocí obalení -->
<label>
  E-mail:
  <input type="email" name="email">
</label>
```

**Bez `<label>`** screen reader neví, co input znamená. Navíc kliknutí na label aktivuje input - důležité pro malé prvky jako checkboxy.
****

### Další formulářové prvky

```html
<!-- Víceřádkový text -->
<textarea name="zprava" rows="5" cols="40" placeholder="Vaše zpráva"></textarea>

<!-- Výběr ze seznamu -->
<select name="zeme">
  <option value="">-- Vyber zemi --</option>
  <optgroup label="Evropa">
    <option value="cz" selected>Česko</option>
    <option value="sk">Slovensko</option>
  </optgroup>
  <optgroup label="Asie">
    <option value="jp">Japonsko</option>
  </optgroup>
</select>

<!-- Autocomplete -->
<input list="prohlizece" name="prohlizec">
<datalist id="prohlizece">
  <option value="Chrome">
  <option value="Firefox">
  <option value="Safari">
</datalist>

<!-- Skupiny prvků -->
<fieldset>
  <legend>Kontaktní údaje</legend>
  <input type="text" name="jmeno">
  <input type="email" name="email">
</fieldset>

<!-- Tlačítka -->
<button type="submit">Odeslat</button>
<button type="reset">Reset</button>
<button type="button" onclick="alert('hi')">Akce</button>  <!-- type="button" je důležité, jinak je default submit -->
```

### Validace v HTML5

HTML umí **základní validaci** bez JavaScriptu:

| Atribut | Co kontroluje |
| --- | --- |
| `required` | Pole musí být vyplněné |
| `minlength` / `maxlength` | Minimální/maximální délka textu |
| `min` / `max` | Minimum/maximum pro číslo nebo datum |
| `pattern="regex"` | Regulární výraz pro formát |
| `type="email"` | Validní formát e-mailu |
| `type="url"` | Validní formát URL |

```html
<input type="email" required>
<input type="password" minlength="8" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}">
```

# Tabulky

- pro tabulková data, **NE PRO LAYOUT!!!!**

```html
<table>
  <caption>Známky za 1. pololetí</caption>
  <thead>
    <tr>
      <th>Předmět</th>
      <th>Známka</th>
      <th>Učitel</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Matematika</td>
      <td>2</td>
      <td>Novák</td>
    </tr>
    <tr>
      <td>Programování</td>
      <td>1</td>
      <td>Svoboda</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td colspan="2">Průměr</td>
      <td>1.5</td>
    </tr>
  </tfoot>
</table>
```

### Tagy tabulky

| Tag | Význam |
| --- | --- |
| `<table>` | Celá tabulka |
| `<caption>` | Popisek tabulky |
| `<thead>` / `<tbody>` / `<tfoot>` | Hlavička / tělo / patička |
| `<tr>` | Row — řádek |
| `<th>` | Table header — hlavičková buňka *(sloupec/řádek)* |
| `<td>` | Table data — datová buňka |

### Slučování buněk

```html
<td colspan="2">přes dva sloupce</td>
<td rowspan="3">přes tři řádky</td>
```

# Atributy podrobně

### Globální atributy *(fungují na všech tazích)*

| Atribut | Co dělá |
| --- | --- |
| `id` | **Unikátní** identifikátor (jen jednou na stránku). Pro JS a CSS targetování, kotvy v URL. |
| `class` | CSS třída, **může se opakovat** a může jich být víc (`class="btn primary big"`). |
| `style` | Inline CSS — používat opatrně, raději v externím CSS. |
| `title` | Tooltip při najetí myší. |
| `lang` | Jazyk obsahu (`lang="en"` u anglické citace v české stránce). |
| `hidden` | Skryje element. |
| `tabindex` | Pořadí klávesnicové navigace (`0` = v pořadí, `-1` = přeskočit). |
| `contenteditable` | Element je editovatelný uživatelem. |
| `draggable` | Lze přetahovat. |

### `data-*` atributy: vlastní data pro JavaScript

```html
<button data-user-id="42" data-action="delete">Smazat</button>
```

```jsx
const btn = document.querySelector('button');
console.log(btn.dataset.userId);   // "42"
console.log(btn.dataset.action);    // "delete"
```

Jakákoli vlastní data, která potřebuješ v JS, by měla být v `data-*` atributech. Nesahej do `id` nebo `class` na ukládání hodnot.

### `aria-*` atributy — přístupnost

```html
<button aria-label="Zavřít dialog">×</button>
<div aria-live="polite">Načítání...</div>
<input aria-describedby="hint">
<p id="hint">Heslo musí mít aspoň 8 znaků.</p>
```

ARIA *(Accessible Rich Internet Applications)* doplňuje sémantiku tam, kde HTML nestačí, především u JS aplikací s vlastními widgety.

### Boolean atributy

Některé atributy fungují jako "ano/ne" — stačí jejich přítomnost, nemusí mít hodnotu:

```html
<input type="checkbox" checked>
<input disabled>
<video autoplay muted loop>
<script defer>
<button hidden>
```

`checked="checked"` a `checked` znamenají to samé. 

### Specifické atributy

Některé atributy fungují jen na konkrétních tazích — `href` jen na `<a>` a `<link>`, `src` jen na `<img>`, `<video>`, `<script>`, `alt` jen na `<img>` atd.

# Skripty a styly

### `<script>`

```html
<!-- Inline -->
<script>
  console.log('ahoj');
</script>

<!-- Externí -->
<script src="app.js"></script>

<!-- Modul (moderní JS) -->
<script src="app.js" type="module"></script>

<!-- S odloženým spuštěním -->
<script src="app.js" defer></script>

<!-- Asynchronně -->
<script src="app.js" async></script>
```

| Atribut | Chování |
| --- | --- |
| *(nic)* | Stáhne a spustí **synchronně** — blokuje parsování HTML |
| `defer` | Stáhne paralelně, spustí **až po dočtení HTML** (zachová pořadí skriptů) |
| `async` | Stáhne paralelně, spustí **hned po stažení** (nezávisle na ostatních) |
| `type="module"` | ES6 moduly s `import`/`export`, defaultně chová se jako `defer` |

Skripty patří **na konec `<body>` nebo do `<head>` s `defer`**, aby neblokovaly načítání stránky.

### `<style>` a `<link>`

```html
<!-- Inline CSS -->
<style>
  body { font-family: sans-serif; }
</style>

<!-- Externí CSS -->
<link rel="stylesheet" href="styles.css">

<!-- Conditional loading -->
<link rel="stylesheet" href="print.css" media="print">
<link rel="stylesheet" href="dark.css" media="(prefers-color-scheme: dark)">
```

# Moderní HTML5 elementy

> Tyto elementy často překvapí, že existují nativně bez JS.
> 

### `<details>` a `<summary>` — disclosure widget

```html
<details>
<summary>Klikni pro zobrazení</summary>
<p>Skrytý obsah, který se rozbalí.</p>
</details>
```

Native rozbalovací sekce **bez JavaScriptu**. Skvělé pro FAQ.

### `<dialog>` — modal

```html
<dialog id="myDialog">
  <p>Obsah dialogu</p>
  <button onclick="document.getElementById('myDialog').close()">Zavřít</button>
</dialog>

<button onclick="document.getElementById('myDialog').showModal()">Otevřít</button>
```

Native modální dialog — řeší focus trap, ESC pro zavření, backdrop. **Dřív se na to potřebovala knihovna**, dnes je to nativní HTML.

### `<progress>` a `<meter>`

```html
<progress value="70" max="100">70 %</progress>     <!-- progress bar -->
<meter value="0.6" min="0" max="1">60 %</meter>    <!-- jako baterie -->
```

### `<template>` — neviditelný šablonovací element

```html
<template id="card">
  <div class="card">
    <h3></h3>
    <p></p>
  </div>
</template>
```

Obsah se nerenderuje, dokud ho JS nevyklonuje a nepřidá do DOMu. Užitečné pro dynamický obsah.

### `<iframe>` — vložený dokument

```html
<iframe src="https://example.com"
        width="600" height="400"
        sandbox="allow-scripts"
        loading="lazy"
        title="Externí obsah"></iframe>
```

Vkládá jinou stránku do té tvojí. Pozor na bezpečnost — `sandbox` atribut omezuje, co může iframe dělat.

# Validace a best practices

### Validace HTML

Standard W3C má **oficiální validátor** na [validator.w3.org](https://validator.w3.org/). Hledá:

- Špatně vnořené tagy
- Chybějící povinné atributy (`alt`, `lang`)
- Duplicitní `id`
- Neplatné atributy pro daný tag

### Best practices

- **Sémantika nad `<div>` polévkou** — používej správné HTML elementy.
- **`alt` u všech obrázků** — i kdyby byl prázdný `alt=""` pro dekorativní obrázky.
- **`lang` na `<html>`** — neprominout.
- **Jeden `<h1>` na stránku.**
- **Skripty s `defer`** nebo na konci `<body>`.
- **Externí CSS a JS** v samostatných souborech *(kromě build-time inline kritického CSS pro výkon)*.
- **Konzistentní formátování** — odsazování 2 nebo 4 mezery, ale jednotně.
- **Komentáře** ke složitějším částem, ne k samozřejmému.
- **Žádný inline JS** (`onclick="..."` atributy) — espresso podléhá zákonu o CSP a hůř se udržuje.

## Tipy pro ústní zkoušku

### Jak začít

> *"HTML je značkovací jazyk, který definuje strukturu a sémantiku obsahu webové stránky. Neřeší vzhled — to je práce CSS — ani chování — to je JavaScript. Můžu projít základní strukturu HTML dokumentu, nebo se zaměřit na konkrétní téma — sémantické tagy, atributy, formuláře, tabulky."*
> 

### Co komise typicky chce slyšet

- **DOCTYPE** a proč je důležitý.
- **Rozdíl `<head>` vs `<body>`.**
- **Sémantické tagy** a proč je používat místo `<div>`.
- **Jeden `<h1>`** a hierarchie nadpisů.
- **Atribut `alt`** — proč je povinný (přístupnost + SEO).
- **`id` vs `class`** — unikátní vs opakovatelný.
- **Formulářové prvky** — `<form>`, `<input>` s různými typy, `<label>` a proč je důležitý.
- **Párový vs nepárový tag** s příklady.