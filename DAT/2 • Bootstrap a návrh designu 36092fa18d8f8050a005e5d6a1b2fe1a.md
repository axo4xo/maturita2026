# 2 • Bootstrap a návrh designu

> Návrh designu ve frameworku Bootstrap, grid systém, komponenty
> 

> **Formát:** 30 min praktická úloha, 15 min obhajoba + teorie. Tady je teorie dost komplexní (z ní zvládneš praktiku, i kdybys Bootstrap neviděl), plus konkrétní úloha s řešením a tipy.
> 

---

## Část 1: Teorie

### Co je Bootstrap

**Bootstrap** je CSS framework s předpřipravenými třídami a JavaScriptovými komponentami. Místo psaní vlastního CSS přidáváš třídy přímo do HTML.

|  |  |
| --- | --- |
| **Vznik** | 2011, vyvinuto v Twitteru (Mark Otto, Jacob Thornton) |
| **Aktuální verze** | 5.3.x (rok 2024 a později), čistý CSS bez jQuery |
| **Princip** | Mobile-first, utility-driven, responzivní |
| **Velikost** | CSS 200 KB, JS 80 KB (minifikováno + gzip) |

### Bootstrap vs alternativy

| Framework | Charakteristika |
| --- | --- |
| **Bootstrap** | Komponentový, "vše hotové", typický look |
| **Tailwind CSS** | Utility-first, žádné komponenty, větší flexibilita ale víc psaní |
| **Material UI** | React komponenty podle Material Designu (Google) |
| **Bulma** | Modernější CSS framework, lehčí než Bootstrap |
| **Foundation** | Konkurent Bootstrapu, dnes spíš v ústraní |

**Plusy Bootstrapu:**

- Rychlý prototyping
- Responzivita zdarma
- Konzistence napříč prohlížeči
- Bohatá dokumentace, ohromná komunita

**Mínusy:**

- "Bootstrap look": weby bez custom CSS vypadají podobně
- Větší CSS než vlastní řešení
- Někdy je jednodušší napsat vlastní CSS

---

### Instalace

### Přes CDN (nejjednodušší)

```html
<!DOCTYPE html>
<html lang="cs">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bootstrap stránka</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <!-- obsah -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
```

> **Důležité:** `bootstrap.bundle.min.js` obsahuje Popper.js (potřeba pro dropdown, tooltip, modal). Stačí jeden script tag.
> 

### Přes npm (pro reálné projekty)

```bash
npm install bootstrap
# v JS: import 'bootstrap/dist/css/bootstrap.min.css'
```

---

### Grid systém

Bootstrap grid stojí na **flexboxu** a dělí šířku na **12 sloupců**. Třídy říkají, kolik sloupců prvek zabírá na různých velikostech obrazovky.

### Breakpointy

| Název | Třída | Min šířka | Container max-width |
| --- | --- | --- | --- |
| Extra small | *(žádná)* | 0 px | auto |
| Small | `sm` | ≥ 576 px | 540 px |
| Medium | `md` | ≥ 768 px | 720 px |
| Large | `lg` | ≥ 992 px | 960 px |
| Extra large | `xl` | ≥ 1200 px | 1140 px |
| Extra extra large | `xxl` | ≥ 1400 px | 1320 px |

### Základní struktura

```html
<div class="container">       <!-- centruje, padding zleva i zprava -->
    <div class="row">         <!-- flex řádek, negative margin pro gutters -->
        <div class="col-6">Levý sloupec (6 z 12 = 50%)</div>
        <div class="col-6">Pravý sloupec</div>
    </div>
</div>
```

**Pravidlo:** `container` → `row` → `col-*`. Nikdy nevynechávej `row` mezi containerem a sloupci.

### Varianty containeru

```html
<div class="container">       <!-- fixed width podle breakpointu -->
<div class="container-fluid"> <!-- vždy 100% šířka -->
<div class="container-md">    <!-- fluid do md, pak fixed -->
```

### Třídy sloupců

```html
<!-- Číslo = kolik z 12 sloupců (1 až 12) -->
<div class="col-4">4 sloupce (33%)</div>
<div class="col-8">8 sloupců (67%)</div>

<!-- Bez čísla = rovnoměrně rozdělit zbývající místo -->
<div class="col">auto</div>
<div class="col">auto</div>
<div class="col">auto</div>

<!-- Responzivně: mobil celá šířka, od md 4 sloupce -->
<div class="col-12 col-md-4">...</div>

<!-- Pro každý breakpoint jinak -->
<div class="col-12 col-md-6 col-lg-4">
    Mobil: 100%, tablet: 50%, desktop: 33%
</div>
```

### `row-cols-*` (rychlejší zápis pro pravidelné mřížky)

```html
<!-- 1 sloupec na mobilu, 2 na tabletu, 3 na desktopu -->
<div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
    <div class="col"><div class="card">...</div></div>
    <div class="col"><div class="card">...</div></div>
    <div class="col"><div class="card">...</div></div>
</div>
```

### Gutters (mezery mezi sloupci)

```html
<div class="row g-4">    <!-- mezera 1.5rem všude -->
<div class="row gx-3">   <!-- jen horizontálně -->
<div class="row gy-2">   <!-- jen vertikálně -->
<div class="row g-0">    <!-- žádné mezery -->
```

### Offset, alignment

```html
<!-- Posunutí sloupců (offset) -->
<div class="col-4 offset-4">Uprostřed (přeskočí 4 sloupce zleva)</div>

<!-- Horizontální zarovnání obsahu řádku -->
<div class="row justify-content-center">
<div class="row justify-content-between">
<div class="row justify-content-end">

<!-- Vertikální zarovnání -->
<div class="row align-items-center" style="height: 200px">
<div class="row align-items-start">
<div class="row align-items-end">
```

---

### Mobile-first přístup

Bootstrap je **mobile-first**: třídy **bez** breakpointu platí pro **všechny** velikosti, třídy **s** breakpointem platí **od** dané velikosti **nahoru**.

```html
<!-- ✓ Správně: mobil základ, větší obrazovky rozšíření -->
<div class="col-12 col-md-6 col-lg-4">
<!--      ↑ mobil   ↑ tablet+   ↑ desktop+ -->
<!-- col-12 (mobil) zůstává až do md, kde se přepíše col-md-6 -->
```

Bootstrap se píše **odzdola nahoru**: nejdřív definuj layout pro mobil, pak postupně přidávej třídy pro větší obrazovky.

---

### Typografie

### Display headings (velké nadpisy)

Pro hero sekce a důležité nadpisy. Větší než klasické `h1`-`h6`.

```html
<h1 class="display-1">Display 1 (5rem)</h1>
<h1 class="display-2">Display 2 (4.5rem)</h1>
<h1 class="display-3">Display 3 (4rem)</h1>
<h1 class="display-4">Display 4 (3.5rem)</h1>
<h1 class="display-5">Display 5 (3rem)</h1>
<h1 class="display-6">Display 6 (2.5rem)</h1>
```

### Lead odstavec

```html
<p class="lead">Větší a výraznější odstavec, typicky pro intro text.</p>
```

### Text utility třídy

```html
<p class="text-center">Centrovaný</p>
<p class="text-start">Vlevo (default)</p>
<p class="text-end">Vpravo</p>

<p class="text-muted">Šedý text</p>
<p class="text-primary">Modrá barva</p>
<p class="text-danger">Červená</p>
<p class="text-white">Bílá (na tmavé pozadí)</p>

<p class="fw-bold">Tučný</p>
<p class="fw-light">Tenký</p>
<p class="fst-italic">Kurzíva</p>

<p class="text-uppercase">VELKÁ</p>
<p class="text-lowercase">malá</p>
<p class="text-capitalize">První Písmena</p>

<p class="fs-1">Velikost 1 (největší, 2.5rem)</p>
<p class="fs-6">Velikost 6 (nejmenší, 1rem)</p>

<p class="text-truncate" style="width: 150px">Dlouhý text se zkrátí třemi tečkami...</p>
```

---

### Komponenty

### Navbar

Nejpoužívanější komponenta. Responzivní s hamburger menu.

```html
<nav class="navbar navbar-expand-lg bg-dark navbar-dark">
    <div class="container">
        <a class="navbar-brand" href="#">MůjWeb</a>

        <button class="navbar-toggler" type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navMenu">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navMenu">
            <ul class="navbar-nav ms-auto">
                <li class="nav-item"><a class="nav-link active" href="#">Domů</a></li>
                <li class="nav-item"><a class="nav-link" href="#">O nás</a></li>
                <li class="nav-item"><a class="nav-link" href="#">Kontakt</a></li>
            </ul>
        </div>
    </div>
</nav>
```

| Třída | Co dělá |
| --- | --- |
| `navbar` | Základní komponenta |
| `navbar-expand-lg` | Plný navbar od `lg`, pod tím hamburger menu |
| `bg-dark` / `bg-light` | Barva pozadí |
| `navbar-dark` / `navbar-light` | Barva textu (světlá pro tmavé pozadí a naopak) |
| `navbar-brand` | Logo / název webu |
| `navbar-toggler` | Hamburger tlačítko |
| `data-bs-target="#id"` | ID collapse divu (musí odpovídat) |
| `ms-auto` | Odsune položky doprava (margin-start: auto) |
| `nav-item`, `nav-link` | Položka menu |
| `active` | Aktivní (současná) položka |
| `sticky-top` | Navbar přilepený nahoře při scrollu |
| `fixed-top` | Navbar fixně nahoře vždy |

### Card

Univerzální komponenta pro produkty, články, profily.

```html
<div class="card h-100 shadow-sm">
    <img src="foto.jpg" class="card-img-top" alt="Popis">
    <div class="card-body">
        <h5 class="card-title">Název</h5>
        <p class="card-text">Popis obsahu.</p>
        <a href="#" class="btn btn-primary">Více info</a>
    </div>
    <div class="card-footer text-muted">
        Aktualizováno před 3 minutami
    </div>
</div>
```

| Třída | Co dělá |
| --- | --- |
| `card` | Hlavní kontejner |
| `card-img-top` | Obrázek nahoře |
| `card-body` | Sekce s odsazením a obsahem |
| `card-title`, `card-text` | Nadpis a text |
| `card-header`, `card-footer` | Záhlaví a zápatí karty |
| `h-100` | Karta na plnou výšku sloupce (důležité v gridu) |
| `shadow-sm` | Drobný stín |
| `card-img-overlay` | Obsah přes obrázek |

### Buttons

```html
<!-- Barvy (Solid) -->
<button class="btn btn-primary">Primární (modrá)</button>
<button class="btn btn-secondary">Sekundární (šedá)</button>
<button class="btn btn-success">Úspěch (zelená)</button>
<button class="btn btn-danger">Nebezpečí (červená)</button>
<button class="btn btn-warning">Varování (žlutá)</button>
<button class="btn btn-info">Info (světle modrá)</button>
<button class="btn btn-light">Světlé</button>
<button class="btn btn-dark">Tmavé</button>
<button class="btn btn-link">Vypadá jako link</button>

<!-- Outline varianty -->
<button class="btn btn-outline-primary">Outline</button>

<!-- Velikosti -->
<button class="btn btn-primary btn-lg">Velké</button>
<button class="btn btn-primary btn-sm">Malé</button>

<!-- Plná šířka kontejneru -->
<button class="btn btn-primary w-100">Celá šířka</button>

<!-- Vypnutý stav -->
<button class="btn btn-primary" disabled>Disabled</button>
```

### Badges (štítky)

```html
<h2>Nadpis <span class="badge bg-primary">Nové</span></h2>

<button class="btn btn-primary">
    Zprávy <span class="badge bg-light text-dark">4</span>
</button>

<!-- Tvar tabletky (pill) -->
<span class="badge rounded-pill bg-success">Online</span>
<span class="badge rounded-pill bg-warning text-dark">Připraveno</span>
```

### Alert (upozornění)

```html
<div class="alert alert-success" role="alert">
    Operace proběhla úspěšně.
</div>

<div class="alert alert-danger" role="alert">
    Něco se pokazilo. Zkus to znovu.
</div>

<!-- S možností zavřít -->
<div class="alert alert-warning alert-dismissible fade show" role="alert">
    <strong>Pozor!</strong> Toto je důležité varování.
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
</div>
```

### List group

```html
<ul class="list-group">
    <li class="list-group-item active">Aktivní položka</li>
    <li class="list-group-item">Druhá</li>
    <li class="list-group-item">Třetí</li>

    <!-- Položka s badge vpravo -->
    <li class="list-group-item d-flex justify-content-between align-items-center">
        Zprávy
        <span class="badge bg-primary rounded-pill">14</span>
    </li>
</ul>
```

### Forms (formuláře)

```html
<form>
    <!-- Text input -->
    <div class="mb-3">
        <label for="jmeno" class="form-label">Jméno</label>
        <input type="text" class="form-control" id="jmeno" placeholder="Tvoje jméno">
    </div>

    <!-- Email s pomocným textem -->
    <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input type="email" class="form-control" id="email">
        <div class="form-text">Nikdy jej nikomu nedáme.</div>
    </div>

    <!-- Heslo -->
    <div class="mb-3">
        <label for="heslo" class="form-label">Heslo</label>
        <input type="password" class="form-control" id="heslo">
    </div>

    <!-- Select -->
    <div class="mb-3">
        <label for="zeme" class="form-label">Země</label>
        <select class="form-select" id="zeme">
            <option>Vyber...</option>
            <option value="cz">Česko</option>
            <option value="sk">Slovensko</option>
        </select>
    </div>

    <!-- Textarea -->
    <div class="mb-3">
        <label for="zprava" class="form-label">Zpráva</label>
        <textarea class="form-control" id="zprava" rows="4"></textarea>
    </div>

    <!-- Checkbox -->
    <div class="mb-3 form-check">
        <input type="checkbox" class="form-check-input" id="souhlas">
        <label class="form-check-label" for="souhlas">Souhlasím s podmínkami</label>
    </div>

    <!-- Radio buttons -->
    <div class="mb-3">
        <div class="form-check">
            <input class="form-check-input" type="radio" name="pohlavi" id="muz">
            <label class="form-check-label" for="muz">Muž</label>
        </div>
        <div class="form-check">
            <input class="form-check-input" type="radio" name="pohlavi" id="zena">
            <label class="form-check-label" for="zena">Žena</label>
        </div>
    </div>

    <!-- Switch (přepínač) -->
    <div class="form-check form-switch mb-3">
        <input class="form-check-input" type="checkbox" id="notifikace">
        <label class="form-check-label" for="notifikace">Povolit notifikace</label>
    </div>

    <!-- Tlačítko submit -->
    <button type="submit" class="btn btn-primary">Odeslat</button>
</form>
```

**Klíčové formulářové třídy:**

| Třída | Co dělá |
| --- | --- |
| `form-label` | Stylovaný label |
| `form-control` | Stylovaný input/textarea |
| `form-select` | Stylovaný select |
| `form-check` | Wrapper pro checkbox/radio |
| `form-check-input`, `form-check-label` | Checkbox/radio elementy |
| `form-switch` | Stylování jako přepínač |
| `form-text` | Pomocný text pod inputem |
| `is-valid`, `is-invalid` | Validace (zelený/červený rámeček) |
| `valid-feedback`, `invalid-feedback` | Zpráva pod inputem |

### Modal (dialog)

Velmi často potřebný (přihlašovací formulář, potvrzení, "více info").

```html
<!-- Tlačítko, které modal otevře -->
<button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#mujModal">
    Otevřít modal
</button>

<!-- Modal -->
<div class="modal fade" id="mujModal" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Název modalu</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                Obsah modalu...
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Zavřít</button>
                <button type="button" class="btn btn-primary">Uložit</button>
            </div>
        </div>
    </div>
</div>
```

### Carousel (slideshow)

```html
<div id="mujCarousel" class="carousel slide" data-bs-ride="carousel">
    <div class="carousel-inner">
        <div class="carousel-item active">
            <img src="img1.jpg" class="d-block w-100" alt="...">
        </div>
        <div class="carousel-item">
            <img src="img2.jpg" class="d-block w-100" alt="...">
        </div>
    </div>
    <button class="carousel-control-prev" type="button" data-bs-target="#mujCarousel" data-bs-slide="prev">
        <span class="carousel-control-prev-icon"></span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#mujCarousel" data-bs-slide="next">
        <span class="carousel-control-next-icon"></span>
    </button>
</div>
```

### Accordion (rozbalovací sekce)

```html
<div class="accordion" id="mujAccordion">
    <div class="accordion-item">
        <h2 class="accordion-header">
            <button class="accordion-button" type="button"
                    data-bs-toggle="collapse" data-bs-target="#item1">
                První otázka
            </button>
        </h2>
        <div id="item1" class="accordion-collapse collapse show" data-bs-parent="#mujAccordion">
            <div class="accordion-body">Odpověď.</div>
        </div>
    </div>
</div>
```

### Pagination

```html
<nav>
    <ul class="pagination">
        <li class="page-item disabled"><a class="page-link">Předchozí</a></li>
        <li class="page-item active"><a class="page-link" href="#">1</a></li>
        <li class="page-item"><a class="page-link" href="#">2</a></li>
        <li class="page-item"><a class="page-link" href="#">3</a></li>
        <li class="page-item"><a class="page-link" href="#">Další</a></li>
    </ul>
</nav>
```

### Spinner (loading)

```html
<div class="spinner-border text-primary" role="status">
    <span class="visually-hidden">Načítám...</span>
</div>
```

### Progress bar

```html
<div class="progress">
    <div class="progress-bar" style="width: 67%">67%</div>
</div>
```

---

### Utility třídy

Single-purpose CSS třídy. Díky nim málokdy potřebuješ vlastní CSS.

### Spacing (mezery)

Vzor: `{property}{side}-{size}` (například `mt-3`, `px-4`, `mb-0`)

| Property |  |
| --- | --- |
| `m` | margin |
| `p` | padding |

| Side |  |
| --- | --- |
| `t` | top |
| `b` | bottom |
| `s` | start (vlevo v LTR) |
| `e` | end (vpravo v LTR) |
| `x` | x-axis (left + right) |
| `y` | y-axis (top + bottom) |
| *(prázdno)* | všechny strany |

| Size | Hodnota |
| --- | --- |
| `0` | 0 |
| `1` | 0.25rem (4 px) |
| `2` | 0.5rem (8 px) |
| `3` | 1rem (16 px) |
| `4` | 1.5rem (24 px) |
| `5` | 3rem (48 px) |
| `auto` | auto |

```html
<div class="mt-3 mb-5 px-4">margin-top: 1rem, margin-bottom: 3rem, padding-x: 1.5rem</div>
<div class="mx-auto" style="width: 200px">centrování bloku</div>
<div class="m-0 p-0">Žádné mezery</div>
```

### Display

```html
<div class="d-none">Skryté vždy</div>
<div class="d-none d-md-block">Skryté na mobilu, viditelné od md</div>
<div class="d-block d-lg-none">Viditelné do lg, pak skryté</div>
<div class="d-flex">Flexbox</div>
<div class="d-grid">CSS Grid</div>
<div class="d-inline-block">Inline-block</div>
```

### Flexbox utility

```html
<div class="d-flex justify-content-between align-items-center">
    <span>Vlevo</span>
    <span>Vpravo</span>
</div>

<div class="d-flex gap-3">Položky s gap 1rem</div>

<div class="d-flex flex-column">
    <div>Nahoře</div>
    <div class="mt-auto">Dole (push to bottom)</div>
</div>

<div class="d-flex flex-wrap">Wrapování položek</div>
<div class="d-flex flex-row-reverse">Obrácené pořadí</div>
```

| Justify content | Align items |
| --- | --- |
| `justify-content-start` | `align-items-start` |
| `justify-content-end` | `align-items-end` |
| `justify-content-center` | `align-items-center` |
| `justify-content-between` | `align-items-baseline` |
| `justify-content-around` | `align-items-stretch` |
| `justify-content-evenly` |  |

### Barvy

```html
<!-- Pozadí -->
<div class="bg-primary text-white">Modré</div>
<div class="bg-success text-white">Zelené</div>
<div class="bg-light">Světlé</div>
<div class="bg-body-secondary">Sekundární</div>

<!-- Text -->
<p class="text-primary">Modrý text</p>
<p class="text-muted">Šedý text</p>
<p class="text-white-50">Poloprůhledná bílá</p>
```

### Borders, shadows, rounded

```html
<div class="border">Hranice všude</div>
<div class="border border-primary">Modrá hranice</div>
<div class="border-top border-3">Hranice jen nahoře, tlustá</div>
<div class="border-0">Bez hranice</div>

<div class="rounded">Standardní zaoblení</div>
<div class="rounded-3">Více zaoblené</div>
<div class="rounded-pill">Pilulka (úplně zaoblené)</div>
<div class="rounded-circle">Kruh</div>

<div class="shadow-sm">Malý stín</div>
<div class="shadow">Středně</div>
<div class="shadow-lg">Velký stín</div>
```

### Obrázky

```html
<!-- Responzivní obrázek (100% šířky rodiče, max-width auto) -->
<img src="..." class="img-fluid" alt="...">

<!-- Zaoblený -->
<img src="..." class="img-fluid rounded" alt="...">

<!-- Kruhový (pro avatary) -->
<img src="..." class="rounded-circle" alt="..." style="width: 80px">

<!-- S rámečkem -->
<img src="..." class="img-thumbnail" alt="...">
```

### Sizing

```html
<div class="w-25">25% šířka</div>
<div class="w-50">50%</div>
<div class="w-75">75%</div>
<div class="w-100">100%</div>
<div class="w-auto">auto</div>

<div class="h-100">100% výška (vyžaduje rodič s výškou)</div>
<div class="vh-100">100% viewport height (celá obrazovka)</div>
<div class="vw-100">100% viewport width</div>
```

### Position

```html
<div class="position-relative">Relativní (kontext pro absolutní)</div>
<div class="position-absolute top-0 end-0">Pravý horní roh</div>
<div class="position-fixed bottom-0 start-0">Fixní vlevo dole</div>
<div class="position-sticky top-0">Sticky nahoře</div>
```

---

### Bootstrap Icons

Bootstrap má vlastní knihovnu ikon. Není součástí core CSS, přidává se zvlášť.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css">

<!-- Použití -->
<i class="bi bi-house-door"></i> Domů
<i class="bi bi-envelope"></i> Kontakt
<i class="bi bi-cart-fill"></i> Košík
<i class="bi bi-search"></i>

<button class="btn btn-primary">
    <i class="bi bi-download"></i> Stáhnout
</button>
```

Více než 2000 ikon: [icons.getbootstrap.com](https://icons.getbootstrap.com/)

---

### Customizace

### CSS Variables (Bootstrap 5)

```css
:root {
    --bs-primary: #ff6b35;       /* Přepíše modrou na oranžovou */
    --bs-body-font-family: 'Inter', sans-serif;
}
```

### Vlastní CSS

```html
<!-- Po Bootstrap, ne před -->
<link href="bootstrap.min.css" rel="stylesheet">
<link href="moje-styly.css" rel="stylesheet">
```

```css
/* moje-styly.css */
.btn-primary {
    background-color: #ff6b35;
    border-color: #ff6b35;
}

/* Override Bootstrap třídy přidáním specificity */
.navbar-brand.custom-logo {
    font-family: 'Lora', serif;
    font-size: 1.5rem;
}
```

---

# Část 2: Praktická úloha

### Co může praktická úloha obsahovat

Typická praktika v Bootstrapu:

- **Navbar** s logem a hamburger menu pro mobil
- **Hero sekce** s velkým nadpisem (display-*) a CTA tlačítkem
- **Grid karet** (produkty, články, služby), responzivní 1/2/3 sloupce
- **Dvou-sloupcová sekce** (text + obrázek), responzivně pod sebou
- **Formulář** (kontakt, registrace, rezervace)
- **Modal** (např. po kliknutí na "Rezervovat")
- **List group** (otevírací doba, ceník)
- **Footer** s informacemi a copyrightem

### Příklad zadání: Restaurant "U Starého Mlýna"

Vytvoř stránku pro fiktivní restauraci pomocí Bootstrap 5. Dostaneš kostru HTML s CDN, ale chybí Bootstrap třídy a komponenty.

**Co musíš doplnit:**

1. **Navbar** s logem, navigací (Domů, Jídelní lístek, O nás, Rezervace), responzivní hamburger
2. **Hero sekce** s nadpisem, podtitulem, tlačítkem "Rezervovat stůl"
3. **Grid s kartami**: 3 doporučená jídla (1 mobil / 3 desktop)
4. **Informační sekce**: 2 sloupce (otevírací doba + obrázek), na mobilu pod sebou
5. **Footer**: copyright, tmavé pozadí

### Řešení: kompletní index.html

```html
<!DOCTYPE html>
<html lang="cs">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>U Starého Mlýna</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>

    <!-- ====== NAVBAR ====== -->
    <nav class="navbar navbar-expand-lg bg-dark navbar-dark sticky-top">
        <div class="container">
            <a class="navbar-brand fw-bold" href="#">U Starého Mlýna</a>

            <button class="navbar-toggler" type="button"
                    data-bs-toggle="collapse" data-bs-target="#nav">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="nav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item"><a class="nav-link active" href="#">Domů</a></li>
                    <li class="nav-item"><a class="nav-link" href="#">Jídelní lístek</a></li>
                    <li class="nav-item"><a class="nav-link" href="#">O nás</a></li>
                    <li class="nav-item"><a class="nav-link" href="#">Rezervace</a></li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- ====== HERO SEKCE ====== -->
    <section class="bg-dark text-white py-5 text-center">
        <div class="container">
            <h1 class="display-4 fw-bold">Vítejte v restauraci U Starého Mlýna</h1>
            <p class="lead">Tradiční česká kuchyně v srdci města</p>
            <a href="#rezervace" class="btn btn-light btn-lg mt-3">Rezervovat stůl</a>
        </div>
    </section>

    <!-- ====== DOPORUČENÁ JÍDLA ====== -->
    <section class="py-5">
        <div class="container">
            <h2 class="text-center mb-4">Doporučujeme dnes</h2>

            <div class="row row-cols-1 row-cols-md-3 g-4">

                <!-- Karta 1: Svíčková -->
                <div class="col">
                    <div class="card h-100 shadow-sm">
                        <img src="img/svickova.jpg" class="card-img-top" alt="Svíčková">
                        <div class="card-body">
                            <h5 class="card-title">Svíčková na smetaně</h5>
                            <p class="card-text">Hovězí svíčková s houskovým knedlíkem.</p>
                        </div>
                        <div class="card-footer d-flex justify-content-between align-items-center">
                            <span class="badge bg-success">Denní menu</span>
                            <strong>189 Kč</strong>
                        </div>
                    </div>
                </div>

                <!-- Karta 2: Řízek -->
                <div class="col">
                    <div class="card h-100 shadow-sm">
                        <img src="img/rizek.jpg" class="card-img-top" alt="Řízek">
                        <div class="card-body">
                            <h5 class="card-title">Smažený řízek</h5>
                            <p class="card-text">Vepřový řízek s bramborovým salátem.</p>
                        </div>
                        <div class="card-footer text-end">
                            <strong>149 Kč</strong>
                        </div>
                    </div>
                </div>

                <!-- Karta 3: Guláš -->
                <div class="col">
                    <div class="card h-100 shadow-sm">
                        <img src="img/gulas.jpg" class="card-img-top" alt="Guláš">
                        <div class="card-body">
                            <h5 class="card-title">Hovězí guláš</h5>
                            <p class="card-text">Guláš s chlebovým knedlíkem a okurkou.</p>
                        </div>
                        <div class="card-footer d-flex justify-content-between align-items-center">
                            <span class="badge bg-warning text-dark">Bestseller</span>
                            <strong>129 Kč</strong>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </section>

    <!-- ====== INFORMACE O RESTAURACI ====== -->
    <section class="py-5 bg-light">
        <div class="container">
            <div class="row align-items-center g-4">

                <!-- Levý sloupec: text -->
                <div class="col-12 col-md-6">
                    <h2 class="mb-4">Navštivte nás</h2>
                    <ul class="list-group">
                        <li class="list-group-item d-flex justify-content-between">
                            <span>Pondělí - Pátek</span>
                            <span class="fw-bold">11:00 - 22:00</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between">
                            <span>Sobota</span>
                            <span class="fw-bold">12:00 - 23:00</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between">
                            <span>Neděle</span>
                            <span class="fw-bold">12:00 - 20:00</span>
                        </li>
                    </ul>
                </div>

                <!-- Pravý sloupec: obrázek -->
                <div class="col-12 col-md-6">
                    <img src="img/restaurace.jpg"
                         alt="Interiér restaurace"
                         class="img-fluid rounded shadow">
                </div>

            </div>
        </div>
    </section>

    <!-- ====== FOOTER ====== -->
    <footer class="bg-dark text-white text-center py-4 mt-auto">
        <p class="mb-0 text-white-50">&copy; 2026 U Starého Mlýna. Všechna práva vyhrazena.</p>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
```

---

## Část 3: Tipy pro obhajobu

### Co u obhajoby říct

> *"V zadání jsem dostal kostru webu pro restauraci a doplnil Bootstrap třídy a komponenty. Použil jsem mobile-first grid: 12 sloupcový flexbox systém. Nejdřív navbar s navbar-expand-lg (hamburger menu pod lg breakpointem), pak hero sekce s display-4 nadpisem a lead odstavcem. Pro karty jídel jsem použil row-cols-1 row-cols-md-3 pro responzivní mřížku 1 na mobilu, 3 na tabletu a výš, plus g-4 pro gutters. Informační sekce má dvou-sloupcový layout col-12 col-md-6, na mobilu se sloučí pod sebe. Obrázek používá img-fluid pro responzivitu. Footer je tmavý s text-white-50 pro decentní copyright."*
> 

### Klíčové pojmy pro teorii

| Pojem | Rychlá odpověď |
| --- | --- |
| **Bootstrap** | CSS framework s předpřipravenými třídami, mobile-first |
| **Grid systém** | 12-sloupcový flexbox layout s 6 breakpointy |
| **Mobile-first** | Styluje se odzdola nahoru (mobil → tablet → desktop) |
| **Breakpoint** | Šířka okna, kde se mění layout (sm 576, md 768, lg 992, xl 1200, xxl 1400) |
| **Container** | Wrapper centrující obsah, limituje max-width |
| **Row** | Flex řádek, MUSÍ být mezi container a col-* |
| **`col-md-6`** | Prvek zabírá 6/12 sloupců od `md` breakpointu nahoru |
| **Utility třídy** | Single-purpose třídy (mt-3, text-center, d-flex...) |
| **CDN** | Content Delivery Network, načtení Bootstrap přímo z webu |
| **Bootstrap JS bundle** | Obsahuje Popper.js, nutné pro modal, dropdown, tooltip |
| **`img-fluid`** | Responzivní obrázek (max-width: 100%, height: auto) |
| **`display-1` až `display-6`** | Velké display headings (5rem až 2.5rem) |
| **`lead`** | Větší úvodní odstavec |
| **`h-100`** | Karta na plnou výšku sloupce (důležité v gridu) |
| **`ms-auto`** | Margin-start auto (odsune doprava ve flex) |
| **`sticky-top`** | Element přilepený nahoře při scrollu |

### Časté chytáky

| Otázka | Odpověď |
| --- | --- |
| *Kolik sloupců má Bootstrap grid?* | 12. Třídy se kombinují tak, aby v součtu na řádku tvořily 12. |
| *Co je rozdíl `container` a `container-fluid`?* | Container má max-width podle breakpointu, container-fluid je vždy 100%. |
| *Proč mobile-first?* | Mobil má menší obrazovku a méně místa, je jednodušší přidávat než ubírat. Plus většina návštěvníků dnes přichází z mobilu. |
| *Co je `row-cols-md-3`?* | Od `md` breakpointu rozděl řádek na 3 stejně velké sloupce. |
| *Kdy `col-12` a kdy `col`?* | `col-12` je vždy 100% (celá šířka). `col` (bez čísla) se dělí rovnoměrně se sourozenci. |
| *Co dělá `g-4`?* | Nastaví gutters (mezery) mezi sloupci na 1.5rem. `gx-` jen horizontálně, `gy-` jen vertikálně. |
| *Co je `data-bs-toggle`?* | HTML data atribut, který Bootstrap JavaScript hledá pro spouštění komponent (modal, collapse, tooltip). |
| *Proč potřebuje Bootstrap JS Popper?* | Popper.js je pro pozicování plovoucích prvků (dropdown, tooltip, popover). Je součástí `bootstrap.bundle.min.js`. |
| *Co je rozdíl `m-3` a `p-3`?* | `m` = margin (vnější mezera), `p` = padding (vnitřní mezera). |
| *Co dělá `h-100` na kartě v gridu?* | Karta zaplní výšku celého sloupce, takže všechny karty v řádku jsou stejně vysoké. |

### Časté chyby v praktické úloze

- Zapomenutý `row` mezi `container` a `col-*` (sloupce nebudou fungovat správně)
- Chybějící `bootstrap.bundle.min.js` (modal/navbar collapse nefunguje)
- `data-bs-target` nesouhlasí s `id` collapse divu (hamburger menu nefunguje)
- `col-12 col-md-6` ale na desktopu nejde do dvou sloupců (chybí `row`)
- `card-img-top` použitý mimo `card` strukturu
- `img-fluid` zapomenutý u obrázku (na mobilu trčí ven)
- `h-100` na kartě bez `h-100` na řádku (karty různě vysoké)
- Hardcoded styly inline místo Bootstrap utility tříd
- Kombinace `text-white` na `bg-light` (špatně viditelné)
- `ms-auto` použit mimo `d-flex` kontext (nepracuje)
- Bootstrap CSS načtený **po** vlastním CSS (vlastní styly přepsány Bootstrapem)
- Chybějící `<meta viewport>` (responzivita nefunguje)