# 1 • HTML5 a sémantika

> Struktura stránky, sémantické tagy v HTML5, typografie na webu
> 

> **Formát zkoušky:** 30 minut příprava praktické úlohy, 15 minut obhajoba + náhodná teorie. Tady je teorie hutně, ale ne tryhardně, a celá praktická úloha s řešením.
> 

---

## Část 1: Teorie

### Co je sémantické HTML

Sémantické HTML znamená používat **elementy podle významu obsahu**, ne podle vizuálního efektu. Element popisuje, **co** je jeho obsah, ne **jak vypadá**. Styling je práce CSS.

| Nesémanticky | Sémanticky | Rozdíl |
| --- | --- | --- |
| `<div class="header">` | `<header>` | Prohlížeč, čtečka i vývojář ví, co to je |
| `<div class="nav">` | `<nav>` | Navigace je jasně označená |
| `<b>důležité</b>` | `<strong>důležité</strong>` | Sděluje důležitost, ne jen tučnost |
| `<i>název</i>` | `<em>název</em>` | Sděluje důraz, ne jen kurzívu |

### Proč na tom záleží

- **Přístupnost (accessibility)**: čtečky obrazovky pro nevidomé se orientují podle sémantiky
- **SEO**: vyhledávače lépe pochopí strukturu obsahu
- **Čitelnost kódu**: vývojář vidí strukturu bez čtení class atributů
- **Standardizace**: konzistentní napříč projekty a vývojáři

---

### Základní struktura HTML5 stránky

```html
<!DOCTYPE html>
<html lang="cs">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Popis stránky pro SEO">
    <title>Název stránky</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>Název webu</h1>
        <nav>
            <ul>
                <li><a href="/">Domů</a></li>
                <li><a href="/o-nas">O nás</a></li>
                <li><a href="/kontakt">Kontakt</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <article>
            <header>
                <h2>Název článku</h2>
                <time datetime="2026-05-13">13. května 2026</time>
            </header>
            <section>
                <h3>První část</h3>
                <p>Obsah...</p>
            </section>
        </article>

        <aside>
            <h2>Související články</h2>
            <ul><li><a href="#">Článek 67</a></li></ul>
        </aside>
    </main>

    <footer>
        <p>&copy; 2026 Název webu</p>
        <address>
            Kontakt: <a href="mailto:info@example.com">info@example.com</a>
        </address>
    </footer>
</body>
</html>
```

### Povinné části `<head>`

| Element | Účel |
| --- | --- |
| `<!DOCTYPE html>` | Říká prohlížeči "jde o HTML5", bez něj quirks mode |
| `<meta charset="UTF-8">` | Kódování znaků, bez toho nefunguje diakritika |
| `<meta name="viewport"...>` | Responzivita, správné zobrazení na mobilu |
| `<title>` | Text v záložce + nadpis v Google výsledcích |

### `<meta name="viewport">`

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

`width=device-width`: šířka stránky se přizpůsobí šířce zařízení.
`initial-scale=1.0`: výchozí zoom 100 %.

Bez tohoto meta tagu mobilní prohlížeče zobrazí stránku jakoby na desktopu (zoom out) a text bude maličký.

---

### Sémantické strukturní elementy

### `<header>`

Záhlaví: může být **globální** (celá stránka) nebo **lokální** (uvnitř `<article>` nebo `<section>`).

```html
<!-- Globální -->
<header>
    <h1>Logo</h1>
    <nav>...</nav>
</header>

<!-- Lokální v článku -->
<article>
    <header>
        <h2>Název článku</h2>
        <p>Autor: axo | <time datetime="2026-05-13">13. 5. 2026</time></p>
    </header>
</article>
```

### `<nav>`

Hlavní navigační bloky. Ne pro **každý** seznam odkazů, jen pro významné navigace (menu, breadcrumbs, footer links).

```html
<nav aria-label="Hlavní menu">
    <ul>
        <li><a href="/" aria-current="page">Domů</a></li>
        <li><a href="/blog">Blog</a></li>
    </ul>
</nav>
```

### `<main>`

Hlavní obsah stránky. **Jednou na stránku**, přímo v `<body>`. Obsahuje to, co je **unikátní pro danou stránku** (ne logo, nav, footer, ty se opakují).

### `<article>`

**Samostatný, přenositelný kus obsahu**: dával by smysl i vyjmutý z kontextu stránky.

- Blogový příspěvek
- Novinový článek
- Produktová karta
- Komentář uživatele

### `<section>`

**Tematická skupina obsahu** uvnitř stránky nebo článku. Obvykle začíná nadpisem.

```html
<main>
    <section>
        <h2>Novinky</h2>
        <article>...</article>
        <article>...</article>
    </section>
    <section>
        <h2>Populární</h2>
        <article>...</article>
    </section>
</main>
```

> **Klasický chyták `<article>` vs `<section>`**:
> 
> - `<article>` = samostatný (smysl bez kontextu)
> - `<section>` = tematická skupina (smysl jen v kontextu stránky)

### `<aside>`

Vedlejší obsah nepřímo související s hlavním obsahem. Postranní panel, "související články", reklama.

### `<footer>`

Zápatí: copyright, kontakty, SEO odkazy, mapa webu. Stejně jako `<header>` může být globální i lokální.

### `<figure>` a `<figcaption>`

Obrázek (nebo jiná ilustrace) s popiskem.

```html
<figure>
    <img src="diagram.png" alt="Schéma struktury HTML stránky">
    <figcaption>Obr. 1: Typická struktura HTML5 stránky</figcaption>
</figure>
```

### `<time>`

Strojově čitelné datum nebo čas. Atribut `datetime` je v ISO 8601 formátu.

```html
<time datetime="2026-05-13">13. května 2026</time>
<time datetime="14:30">14:30</time>
<time datetime="2026-05-13T14:30">13. 5. 2026 v 14:30</time>
```

### `<address>`

Kontaktní informace **vztahující se k dokumentu nebo autorovi**, ne pro libovolnou poštovní adresu.

```html
<address>
    Napsal <a href="mailto:axo@example.com">axo</a>.<br>
    Sídlo: Náměstí 67, Liberec.
</address>
```

---

### Sémantické inline elementy

| Element | Význam | Default styl |
| --- | --- | --- |
| `<strong>` | Důležitý text | Tučně |
| `<em>` | Zdůraznění | Kurzívou |
| `<mark>` | Zvýraznění (relevantní pro kontext) | Žluté pozadí |
| `<abbr title="...">` | Zkratka s vysvětlením | Podtrženo, tooltip |
| `<cite>` | Název díla nebo citace | Kurzívou |
| `<code>` | Kód v textu | Monospace |
| `<kbd>` | Klávesa / vstup | Monospace s rámečkem |
| `<small>` | Drobné tisky | Menší text |
| `<del>` / `<ins>` | Smazaný / vložený | Přeškrtnuto / podtrženo |
| `<sup>` / `<sub>` | Horní / dolní index | x² / H₂O |

```html
<p>
    <strong>Důležité</strong>: Přečti si <em>celý dokument</em>.
    Zkratka <abbr title="HyperText Markup Language">HTML</abbr> znamená...
    Spusť <code>npm install</code> a stiskni <kbd>Enter</kbd>.
</p>
```

### Nesémantické: `<div>` a `<span>`

Neutrální kontejnery bez sémantického významu. Použij **jen pokud žádný sémantický element neodpovídá**.

```html
<!-- ❌ Špatně: div místo sémantiky -->
<div class="header">
    <div class="nav">...</div>
</div>

<!-- ✓ Správně -->
<header>
    <nav>...</nav>
</header>

<!-- ✓ OK: div jako layout wrapper -->
<div class="container">
    <main>...</main>
</div>

<!-- ✓ OK: span pro stylování části textu -->
<p>Cena: <span class="price">299 Kč</span></p>
```

---

### Typografie na webu

### Základní vlastnosti

```css
body {
    font-family: 'Roboto', Arial, sans-serif;
    font-size: 16px;
    font-weight: 400;       /* 400 = normal, 700 = bold */
    line-height: 1.6;       /* doporučeno 1.5 až 1.8 */
    color: #333;
    letter-spacing: 0.02em;
}
```

### Jednotky velikosti

| Jednotka | Význam | Kdy použít |
| --- | --- | --- |
| `px` | Absolutní pixely | Bordery, malé fixní rozměry |
| `em` | Relativní k rodičovskému font-size | Padding, margin u textu |
| `rem` | Relativní k root `<html>` | **Velikosti fontů, nejlepší volba** |
| `%` | Procento z rodiče | Šířky layoutu |
| `vw` / `vh` | % šířky / výšky viewportu | Hero sekce, fullscreen |
| `ch` | Šířka znaku "0" | `max-width` pro čitelnost textu |

```css
html { font-size: 16px; }    /* 1rem = 16px */

h1 { font-size: 2.5rem; }    /* 40px */
h2 { font-size: 1.75rem; }   /* 28px */
h3 { font-size: 1.25rem; }   /* 20px */
p  { font-size: 1rem; }      /* 16px */
small { font-size: 0.875rem; } /* 14px */
```

### Zlaté pravidlo čitelnosti

```css
p {
    max-width: 65ch;   /* optimální délka řádku 60 až 75 znaků */
    line-height: 1.7;  /* dostatek prostoru mezi řádky */
}
```

Delší řádky ztěžují čtení: oko musí "hledat" začátek dalšího řádku.

### Zarovnání

```css
p { text-align: left; }            /* default, nejčtivější pro dlouhé texty */
h1 { text-align: center; }         /* středové nadpisy */
.legal { text-align: justify; }    /* do bloku, pozor na "rivers of white" */
```

### Dekorace a transformace

```css
a { text-decoration: none; }
a:hover { text-decoration: underline; }

.tag { text-transform: uppercase; }       /* VELKÁ */
.title { text-transform: capitalize; }    /* Každé Slovo */
```

### Web fonty

**Google Fonts** (nejjednodušší):

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&family=Lora&display=swap" rel="stylesheet">
```

```css
body { font-family: 'Roboto', sans-serif; }
h1, h2 { font-family: 'Lora', serif; }
```

**Vlastní font** přes `@font-face`:

```css
@font-face {
    font-family: 'MujFont';
    src: url('fonts/mujfont.woff2') format('woff2');
    font-display: swap;   /* fallback dokud se font nestáhne */
}
```

### Font stack: záchranná síť

Vždy uveď víc fontů. Pokud první není k dispozici, použije se další:

```css
font-family: 'Inter', 'Segoe UI', Arial, sans-serif;  /* sans */
font-family: 'Lora', 'Georgia', 'Times New Roman', serif;  /* serif */
font-family: 'Fira Code', 'Consolas', 'Courier New', monospace;  /* mono */
```

`font-display: swap` říká prohlížeči: "dokud se nestáhne web font, zobraz fallback, pak prohoď". Bez toho můžeš mít několik sekund neviditelný text (FOIT).

---

## Část 2: Praktická úloha

### Co může praktická úloha obsahovat

Zadání pro tuhle teoretickou oblast typicky:

- **Nahradit `<div>` sémantickými HTML5 elementy** v rozdělaném kódu
- **Doplnit chybějící HTML elementy** podle TODO komentářů (často `<header>`, `<figure>`, `<time>`, `<address>`)
- **Přidat meta tagy** do `<head>` (charset, viewport, description, title)
- **Importovat Google Fonts** a aplikovat fonty
- **Doplnit CSS typografii**: velikosti, řádkování, max-width pro čitelnost
- **Doplnit responzivní viewport** meta tag
- **Validovat HTML** (žádné `<div>` tam, kde patří sémantický element)

### Příklad zadání: Blog s článkem

Dostaneš rozdělanou HTML stránku jednoduchého blogu napsanou nesémanticky pomocí `<div>` tagů a s chybějící typografií. Úkol:

1. Nahradit `<div>` správnými sémantickými HTML5 elementy
2. Doplnit chybějící elementy tam, kde jsou `<!--TODO-->` komentáře
3. Doplnit CSS typografii: fonty, velikosti, řádkování, Google Fonts

### Startovací kód: index.html

```html
<!DOCTYPE html>
<html lang="cs">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Můj blog</title>
    <!--TODO: přidej odkaz na Google Fonts (Roboto 400, 700 a Lora 400) -->
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <!--TODO: nahraď div správným sémantickým elementem pro záhlaví -->
    <div class="header">
        <h1>Můj blog</h1>
        <!--TODO: nahraď div správným sémantickým elementem pro navigaci -->
        <div class="nav">
            <ul>
                <li><a href="/">Domů</a></li>
                <li><a href="/kategorie">Kategorie</a></li>
                <li><a href="/o-mne">O mně</a></li>
            </ul>
        </div>
    </div>

    <!--TODO: nahraď div správným sémantickým elementem pro hlavní obsah -->
    <div class="main">
        <!--TODO: nahraď div správným sémantickým elementem pro článek -->
        <div class="article">
            <!--TODO: přidej sémantický header článku obsahující:
                       - h2 s názvem "Jak jsem se naučil HTML5"
                       - odstavec s autorem a datem pomocí <time datetime="2026-05-10"> -->

            <!--TODO: nahraď div správným sémantickým elementem pro sekci -->
            <div class="section">
                <h3>Začátky</h3>
                <p>Všechno začalo, když jsem poprvé otevřel editor a napsal svůj první
                <code>Hello World</code>. Byl to <strong>zlomový moment</strong>.</p>
            </div>

            <!--TODO: nahraď div správným sémantickým elementem pro sekci -->
            <div class="section">
                <h3>Sémantika</h3>
                <p>Postupně jsem pochopil, že <em>jak</em> píšeš HTML je stejně důležité
                jako <em>co</em> píšeš.</p>
                <!--TODO: přidej obrázek s popiskem pomocí <figure> a <figcaption>
                           src="img/html-schema.png", alt="Schéma struktury HTML5 stránky"
                           popisek: "Obr. 1: Typická struktura HTML5 stránky" -->
            </div>

            <!--TODO: nahraď div správným sémantickým elementem pro sekci -->
            <div class="section">
                <h3>Závěr</h3>
                <p>Kontaktovat mě můžeš na
                <!--TODO: obal e-mail správným sémantickým elementem pro kontakt -->
                <a href="mailto:jan@blog.cz">jan@blog.cz</a>.</p>
            </div>
        </div>

        <!--TODO: nahraď div správným sémantickým elementem pro postranní panel -->
        <div class="aside">
            <h2>O autorovi</h2>
            <p>axo: webový vývojář z Liberce.</p>
            <h2>Populární články</h2>
            <ul>
                <li><a href="#">CSS Grid za 10 minut</a></li>
                <li><a href="#">Flexbox pro začátečníky</a></li>
            </ul>
        </div>
    </div>

    <!--TODO: nahraď div správným sémantickým elementem pro zápatí -->
    <div class="footer">
        <p>&copy; 2026 Můj blog. Všechna práva vyhrazena.</p>
    </div>
</body>
</html>
```

### Řešení: hotové index.html

```html
<!DOCTYPE html>
<html lang="cs">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Můj blog</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&family=Lora&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>Můj blog</h1>
        <nav>
            <ul>
                <li><a href="/">Domů</a></li>
                <li><a href="/kategorie">Kategorie</a></li>
                <li><a href="/o-mne">O mně</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <article>
            <header>
                <h2>Jak jsem se naučil HTML5</h2>
                <p>Napsal axo, <time datetime="2026-05-10">10. května 2026</time></p>
            </header>

            <section>
                <h3>Začátky</h3>
                <p>Všechno začalo, když jsem poprvé otevřel editor a napsal svůj první
                <code>Hello World</code>. Byl to <strong>zlomový moment</strong>.</p>
            </section>

            <section>
                <h3>Sémantika</h3>
                <p>Postupně jsem pochopil, že <em>jak</em> píšeš HTML je stejně důležité
                jako <em>co</em> píšeš.</p>
                <figure>
                    <img src="img/html-schema.png" alt="Schéma struktury HTML5 stránky">
                    <figcaption>Obr. 1: Typická struktura HTML5 stránky</figcaption>
                </figure>
            </section>

            <section>
                <h3>Závěr</h3>
                <p>Kontaktovat mě můžeš na
                <address style="display: inline">
                    <a href="mailto:jan@blog.cz">jan@blog.cz</a>
                </address>.</p>
            </section>
        </article>

        <aside>
            <h2>O autorovi</h2>
            <p>axo: webový vývojář z Liberce.</p>
            <h2>Populární články</h2>
            <ul>
                <li><a href="#">CSS Grid za 10 minut</a></li>
                <li><a href="#">Flexbox pro začátečníky</a></li>
            </ul>
        </aside>
    </main>

    <footer>
        <p>&copy; 2026 Můj blog. Všechna práva vyhrazena.</p>
    </footer>
</body>
</html>
```

### Řešení: doplněné style.css

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Roboto', Arial, sans-serif;
    font-size: 16px;
    line-height: 1.6;
    color: #333;
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 1rem;
}

/* === HEADER === */
header {
    background: #1a1a2e;
    color: white;
    padding: 1.5rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

header h1 {
    font-family: 'Lora', serif;
    font-size: 2rem;
    color: white;
}

/* === NAV === */
nav ul {
    list-style: none;
    display: flex;
    gap: 1.5rem;
}

nav a {
    color: white;
    text-decoration: none;
    font-weight: 500;
}

nav a:hover {
    text-decoration: underline;
}

/* === MAIN === */
main {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 2rem;
    padding: 2rem 0;
}

/* === ČLÁNEK === */
article {
    max-width: 70ch;
}

article h2,
article h3 {
    font-family: 'Lora', serif;
    color: #1a1a2e;
    margin-bottom: 0.75rem;
}

article h2 { font-size: 1.75rem; }
article h3 { font-size: 1.25rem; margin-top: 1.5rem; }

article p {
    font-size: 1rem;
    line-height: 1.8;
    margin-bottom: 1.25rem;
}

/* === FIGURE === */
figure {
    margin: 1.5rem 0;
    text-align: center;
}

figure img {
    max-width: 100%;
    border-radius: 4px;
}

figcaption {
    font-size: 0.875rem;
    color: #666;
    margin-top: 0.5rem;
}

/* === ASIDE === */
aside {
    background: #f8f9fa;
    padding: 1.5rem;
    border-radius: 8px;
    align-self: start;
}

aside h2 {
    font-size: 1.1rem;
    color: #1a1a2e;
    margin-bottom: 0.5rem;
    margin-top: 1rem;
}

aside h2:first-child { margin-top: 0; }

aside ul {
    list-style: none;
    margin-top: 0.5rem;
}

aside li {
    padding: 0.4rem 0;
    border-bottom: 1px solid #dee2e6;
}

aside a {
    color: #0066cc;
    text-decoration: none;
}

aside a:hover {
    text-decoration: underline;
}

/* === FOOTER === */
footer {
    background: #1a1a2e;
    color: #aaa;
    text-align: center;
    padding: 1.5rem;
    font-size: 0.875rem;
    margin-top: 2rem;
}
```

---

## Část 3: Tipy pro obhajobu

### Co u obhajoby říct

Začni přehledem, co jsi udělal:

> *"V zadání jsem dostal blog napsaný nesémanticky přes divy. Nahradil jsem je sémantickými HTML5 elementy: header pro záhlaví, nav pro navigaci, main pro hlavní obsah, article pro článek, section pro tematické bloky, aside pro postranní panel a footer pro zápatí. Doplnil jsem header článku s nadpisem h2 a time elementem pro datum. Přidal jsem figure s figcaption pro obrázek a address pro kontakt. V CSS jsem importoval Google Fonts (Roboto pro text, Lora pro nadpisy) a nastavil typografii: line-height 1.6, max-width 70ch pro čitelnost."*
> 

### Klíčové pojmy pro teorii (co se zkoušející ptá)

| Pojem | Odpověď |
| --- | --- |
| **Sémantika** | HTML elementy popisují, co je obsah, ne jak vypadá |
| **Accessibility** | Přístupnost pro lidi se zdravotním postižením (čtečky obrazovky) |
| **SEO** | Search Engine Optimization, sémantika zlepšuje indexaci |
| **`<main>`** | Jedinečný obsah stránky, použít **jednou** na stránku |
| **`<article>` vs `<section>`** | article = přenositelný (smysl bez kontextu), section = tematická skupina |
| **`<header>`** | Záhlaví, může být globální i lokální |
| **`<nav>`** | Hlavní navigační bloky, ne pro každý seznam odkazů |
| **`<figure>` + `<figcaption>`** | Obrázek s popiskem |
| **`<time datetime="...">`** | Strojově čitelné datum v ISO 8601 |
| **`<address>`** | Kontakt **vztažený k dokumentu nebo autorovi** |
| **`rem` vs `em`** | rem = relativní k root html, em = relativní k rodiči |
| **`max-width: 65ch`** | Optimální délka řádku 60-75 znaků pro čitelnost |
| **`line-height: 1.6`** | Výška řádku, 1.5-1.8 doporučená |
| **Web font** | Font stažený ze serveru (Google Fonts, @font-face) |
| **Font stack** | Seznam fontů, první dostupný se použije |
| **`font-display: swap`** | Fallback font dokud se web font nestáhne |
| **`<meta viewport>`** | Responzivita, bez něj mobilní zoom out |

### Časté chytáky

| Otázka | Odpověď |
| --- | --- |
| *Proč nestačí styling pomocí divů?* | Čtečky pro nevidomé, vyhledávače a další vývojáři nepoznají strukturu jen z CSS tříd. |
| *Kdy section a kdy article?* | Article: blogový post, produkt, komentář (přenositelné). Section: skupiny obsahu uvnitř stránky (Novinky, Galerie). |
| *Může být víc `<main>` na stránce?* | Ne. Jen jeden `<main>` na stránku, drží unikátní obsah. |
| *Co dělá `<meta charset="UTF-8">`?* | Nastaví kódování. Bez něj se diakritika zobrazí jako otazníky nebo čtverečky. |
| *Proč `<time datetime="...">`?* | Strojově čitelný formát, čtečky a vyhledávače to umí pochopit. Text uvnitř je pro lidi. |
| `*<strong>` vs `<b>`?* | `<strong>` má sémantický význam důležitosti. `<b>` je jen vizuální tučnost bez významu. |
| *Co je font-display: swap?* | Když se web font načítá, zobrazí se fallback font. Po načtení se prohodí. Bez toho je text 1-3 sekundy neviditelný. |
| *Kdy `<address>`?* | Jen pro kontaktní info k dokumentu (autor článku, kontakt na firmu v patičce). Ne pro libovolnou poštovní adresu v textu. |

### Časté chyby v praktické úloze

- Zapomenuté `<main>` (typicky student nahradí jen vnitřní divy)
- `<nav>` použitý pro každý `<ul>` s odkazy (např. patičkové linky uvnitř `<footer>` v pohodě, ale ne pro každý seznam)
- `<section>` bez nadpisu (sekce by měla začínat h2/h3)
- `<article>` použitý jako prostý wrapper bez vlastního obsahu
- Zapomenutý `<figcaption>` u `<figure>`
- `<time>` bez `datetime` atributu (ztrácí strojovou čitelnost)
- `font-display: swap` chybí (text "blikne" když se font načte)
- `max-width` pro text na příliš velkém čísle (60-75ch je optimum)
- Hardcoded velikosti v `px` místo `rem` (horší pro accessibility)
- Chybějící font fallback (jen `font-family: 'Roboto'` bez fallbacku)