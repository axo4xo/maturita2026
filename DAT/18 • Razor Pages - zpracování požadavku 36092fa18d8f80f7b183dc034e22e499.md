# 18 • Razor Pages - zpracování požadavku

> RazorPages, GET a POST požadavky, bindování dat, návratové metody (Redirect, Page)
> 

> **Formát:** 30 min praktická úloha, 15 min obhajoba + teorie. Podle informací z minulých let bude praktika **vyplnit kostru projektu** (registrační formulář). Připraveno na to.
> 

---

# Část 1: Teorie

### Co jsou Razor Pages

**Razor Pages** je moderní způsob tvorby webových stránek v ASP.NET Core (od .NET Core 2.0, 2017). Každá stránka je **samostatná jednotka**: má vlastní HTML šablonu a vlastní C# logiku.

Každá Razor Page se skládá ze **2 souborů**:

```
Pages/
├── Kontakty.cshtml       ← HTML šablona (Razor syntaxe, C# v HTML)
└── Kontakty.cshtml.cs    ← C# logika (třída PageModel)
```

### Razor Pages vs MVC vs Web API

|  | Razor Pages | MVC | Web API |
| --- | --- | --- | --- |
| **Architektura** | Stránka jako jednotka | Controller-Action-View | Controller-Endpoint |
| **Vrací** | HTML | HTML | JSON/XML |
| **Pro co** | Klasické weby s formuláři | Komplexní weby | API pro frontend/mobile |
| **Logika** | V PageModel (1:1 se stránkou) | Sdílená v Controlleru | V Controlleru |
| **Routing** | Podle souborové struktury | Podle atributů / konvence | Podle atributů |
| **Náročnost** | Jednodušší | Středně | Středně |

> Razor Pages se hodí pro **klasické weby**, kde stránky představují stránky (formuláře, seznamy, detaily). Web API se hodí pro **frontendy v Reactu/Vue** nebo mobilní aplikace.
> 

---

### Direktivy na začátku `.cshtml`

```html
@page                    ← POVINNÉ, říká ASP.NET, že jde o Razor Page
@model KontaktyModel     ← propojí šablonu s PageModel třídou
```

> Bez `@page` soubor **není** Razor Page, framework ho ignoruje a soubor není dostupný jako URL.
> 

### Routing podle souborové struktury

| Soubor | URL |
| --- | --- |
| `Pages/Index.cshtml` | `/` |
| `Pages/Kontakty.cshtml` | `/Kontakty` |
| `Pages/Kontakty/Detail.cshtml` | `/Kontakty/Detail` |
| `Pages/Admin/Kontakty/Index.cshtml` | `/Admin/Kontakty` |

### Routing s parametrem

```csharp
@page "{id:int}"           // /Kontakty/5
@page "{id:int?}"          // /Kontakty nebo /Kontakty/5 (volitelný)
@page "{slug}"             // /Kontakty/anykoliv-text
```

---

### Struktura PageModel (`.cshtml.cs`)

```csharp
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

public class KontaktyModel : PageModel    // dědí z PageModel
{
    // Properties dostupné v .cshtml jako @Model.SeznamKontaktu
    public List<string> SeznamKontaktu { get; set; } = new();

    // Handler pro GET request (otevření stránky)
    public void OnGet()
    {
        SeznamKontaktu = new List<string> { "axo", "karel" };
    }

    // Handler pro POST request (odeslání formuláře)
    public IActionResult OnPost()
    {
        return RedirectToPage();          // přesměruj na GET té samé stránky
    }
}
```

---

### GET request: `OnGet()`

Spustí se při **otevření stránky** (URL v prohlížeči, link, refresh).

```csharp
// Jednoduchý GET, naplní data pro zobrazení
public void OnGet()
{
    Kontakty = _service.GetAll();
}

// GET s parametrem z URL (z @page "{id:int}")
public void OnGet(int id)
{
    Kontakt = _service.GetById(id);
}

// GET s query string parametrem (/Kontakty?email=...)
public void OnGet(string? email = null)
{
    if (email != null)
        Email = email;
}

// Asynchronní verze (pokud čteš z DB / voláš API)
public async Task OnGetAsync()
{
    Kontakty = await _service.GetAllAsync();
}
```

---

### POST request: `OnPost()`

Spustí se při **odeslání formuláře** (`<form method="post">`).

```csharp
public IActionResult OnPost()
{
    if (!ModelState.IsValid)       // validace bindovaných dat
        return Page();             // znovu zobraz stránku s chybami

    _service.Add(NovyKontakt);
    return RedirectToPage();       // PRG pattern, přesměruj na GET
}

// Asynchronní
public async Task<IActionResult> OnPostAsync()
{
    if (!ModelState.IsValid)
        return Page();

    await _service.AddAsync(NovyKontakt);
    return RedirectToPage();
}
```

---

### Bindování dat: `[BindProperty]`

Automaticky přiřadí data z **formuláře / query stringu** do C# property při POST requestu.

```csharp
[BindProperty]
public string Jmeno { get; set; } = "";

[BindProperty]
public Kontakt NovyKontakt { get; set; } = new();
```

```html
<!-- V .cshtml: asp-for váže na [BindProperty] -->
<form method="post">
    <input asp-for="Jmeno"/>
    <input asp-for="NovyKontakt.Email"/>
    <button type="submit">Přidat</button>
</form>
```

### `[BindProperty(SupportsGet = true)]`

Default `[BindProperty]` funguje **jen pro POST**. Pro GET (query string) musíš přidat `SupportsGet = true`:

```csharp
[BindProperty(SupportsGet = true)]
public string Hledani { get; set; } = "";
```

URL `/Kontakty?hledani=axo` → automaticky naplní property `Hledani`.

> **Důležitý rozdíl**: `[BindProperty]` bez `SupportsGet` ignoruje data v GET requestu (i kdyby tam byly).
> 

---

### Návratové metody

Handlerová metoda obvykle vrací `IActionResult` (nebo `void` / `Task` když nepotřebuje redirect).

| Metoda | Co udělá | HTTP kód |
| --- | --- | --- |
| `Page()` | Zobrazí aktuální Razor Page (stejnou stránku) | 200 |
| `RedirectToPage()` | Přesměruje na GET té samé stránky | 302 |
| `RedirectToPage("Index")` | Přesměruje na `/Index` | 302 |
| `RedirectToPage("/Kontakty/Detail", new { id = 5 })` | Přesměruje s parametrem | 302 |
| `NotFound()` | Vrátí 404 | 404 |
| `BadRequest()` | Vrátí 400 | 400 |
| `RedirectToAction(...)` | Přesměruje na MVC Controller action | 302 |

### PRG pattern (Post-Redirect-Get)

Klíčový princip pro Razor Pages s formuláři.

```
POST /Kontakty  →  uložení dat  →  RedirectToPage()  →  GET /Kontakty
```

**Proč redirect a ne přímo `Page()`**: kdyby POST vrátil přímo `Page()`, **refresh stránky** by znovu odeslal formulář (duplicitní záznam, druhá objednávka, atd.). Redirect to zabrání.

```csharp
public IActionResult OnPost()
{
    _kontakty.Add(NovyKontakt);
    return RedirectToPage();    // → prohlížeč udělá GET → bezpečný refresh
}
```

> **Klasický bug v webech**: dvojklikem na "Odeslat objednávku" se objednávka odešle dvakrát. PRG pattern to elegantně řeší.
> 

---

### Pojmenované handlery

Jedna stránka může mít **více POST handlerů** pro různá tlačítka.

```html
<!-- .cshtml -->
<form method="post">
    <button asp-page-handler="Ulozit">Uložit</button>
    <button asp-page-handler="Smazat">Smazat</button>
</form>
```

```csharp
// .cshtml.cs
public IActionResult OnPostUlozit()
{
    // logika uložení
    return RedirectToPage();
}

public IActionResult OnPostSmazat()
{
    // logika smazání
    return RedirectToPage();
}
```

URL pak bude: `POST /Kontakty?handler=Ulozit` nebo `POST /Kontakty?handler=Smazat`.

> Konvence: `OnPost{Jmeno}` a `asp-page-handler="{Jmeno}"`. Stejně tak `OnGet{Jmeno}` pro GET handlery.
> 

---

### Validace formuláře

### DataAnnotations na modelu

```csharp
using System.ComponentModel.DataAnnotations;

public class Kontakt
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Jméno je povinné")]
    [StringLength(50, ErrorMessage = "Maximálně 50 znaků")]
    public string Jmeno { get; set; } = "";

    [Required]
    [EmailAddress(ErrorMessage = "Neplatný email")]
    public string Email { get; set; } = "";

    [Range(18, 99, ErrorMessage = "Věk musí být 18-99")]
    public int Vek { get; set; }

    [RegularExpression(@"^\+420\d{9}$", ErrorMessage = "Telefon ve formátu +420...")]
    public string? Telefon { get; set; }
}
```

### Kontrola v handleru

```csharp
public IActionResult OnPost()
{
    if (!ModelState.IsValid)
        return Page();             // zobrazí stránku s chybami

    _kontakty.Add(NovyKontakt);
    return RedirectToPage();
}
```

### Zobrazení chyb v HTML

```html
<input asp-for="NovyKontakt.Jmeno"/>
<span asp-validation-for="NovyKontakt.Jmeno" class="text-danger"></span>
```

> **`ModelState.IsValid`**: ASP.NET automaticky validuje data podle DataAnnotations, jakmile přijde request. Stačí se zeptat, nic nevoláš ručně.
> 

---

### Tag Helpers pro formuláře

Tag Helpers jsou HTML atributy začínající `asp-`. Generují správné `name`, `id`, `href`, hodnoty atd.

| Tag Helper | Co generuje |
| --- | --- |
| `asp-for="Jmeno"` | `name="Jmeno" id="Jmeno"` + value z modelu |
| `asp-page="/Index"` | `href="/Index"` (bezpečný odkaz na Razor Page) |
| `asp-page-handler="Ulozit"` | Přidá `?handler=Ulozit` do action formuláře |
| `asp-route-id="5"` | Přidá `/5` nebo `?id=5` do URL |
| `asp-route-{cokoliv}="hodnota"` | Přidá `?cokoliv=hodnota` do URL |
| `asp-validation-for="Jmeno"` | Zobrazí chybovou hlášku pro pole |
| `asp-asp-area`, `asp-controller`, `asp-action` | Pro MVC (méně časté v Razor Pages) |

```html
<!-- Link na detail s parametrem -->
<a asp-page="/Kontakty/Detail" asp-route-id="@item.Id">Detail</a>

<!-- Formulář -->
<form method="post">
    <input asp-for="NovyKontakt.Jmeno" class="form-control"/>
    <span asp-validation-for="NovyKontakt.Jmeno" class="text-danger"></span>

    <select asp-for="NovyKontakt.Kategorie">
        @foreach (var kat in Model.Kategorie)
        {
            <option value="@kat">@kat</option>
        }
    </select>

    <button asp-page-handler="Ulozit">Uložit</button>
</form>
```

---

### Razor syntaxe: základy

```html
@* komentář *@

@Model.Jmeno                        <!-- výpis property -->
@(Model.Jmeno + " " + Model.Prijmeni)   <!-- složitější výraz v závorkách -->

@{
    var dnes = DateTime.Now;         <!-- C# blok -->
    var pocet = Model.Kontakty.Count;
}
<p>Dnes je @dnes.ToShortDateString(), kontaktů @pocet</p>

@if (Model.Kontakty.Count == 0)
{
    <p>Žádné kontakty.</p>
}
else
{
    <p>Máš @Model.Kontakty.Count kontaktů.</p>
}

<ul>
@foreach (var k in Model.Kontakty)
{
    <li>@k.Jmeno: @k.Email</li>
}
</ul>

<!-- HTML enkódování (default, bezpečné proti XSS) -->
<p>@Model.UserInput</p>

<!-- Raw HTML (NEBEZPEČNÉ, jen pro důvěryhodný obsah) -->
<p>@Html.Raw(Model.TrustedHtml)</p>
```

---

### Předávání dat mezi stránkami

### 1. Přes URL parametry (query string)

```csharp
// Z Register.cshtml.cs
return RedirectToPage("Confirm", new { jmeno = "axo", email = "x@example.com" });

// V Confirm.cshtml.cs
public void OnGet(string jmeno, string email)
{
    Jmeno = jmeno;
    Email = email;
}
```

URL bude: `/Confirm?jmeno=axo&email=x@example.com`

**Plus**: jednoduché, RESTful, sdílitelné odkazy.
**Mínus**: viditelné v URL, citlivá data tam nepatří, omezená délka.

### 2. Přes `TempData` (session-based, jednorázové)

```csharp
// V OnPost
TempData["Jmeno"] = "axo";
TempData["Email"] = "x@example.com";
return RedirectToPage("Confirm");

// V Confirm.OnGet
public void OnGet()
{
    Jmeno = TempData["Jmeno"]?.ToString() ?? "";
}
```

**Plus**: skryté, lze i citlivá data.
**Mínus**: vyžaduje session, smaže se po prvním čtení.

### 3. Přes Session

```csharp
HttpContext.Session.SetString("Jmeno", "axo");
// později:
var jmeno = HttpContext.Session.GetString("Jmeno");
```

**Plus**: dlouho-žijící data.
**Mínus**: vyžaduje konfiguraci session middleware v Program.cs.

> Pro maturitu nejčastěji **URL parametry** (jednoduché, viditelné, neztratí se).
> 

---

### Program.cs: registrace Razor Pages

```csharp
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddRazorPages();              // přidá Razor Pages
// builder.Services.AddScoped<MojeSluzba>();  // vlastní služby pro DI

var app = builder.Build();

app.UseHttpsRedirection();
app.UseStaticFiles();                          // wwwroot (CSS, JS, obrázky)
app.UseRouting();
app.UseAuthorization();

app.MapRazorPages();                           // zaregistruje všechny Pages/

app.Run();
```

---

### Flow celého GET + POST requestu

```
[Uživatel otevře stránku]
  GET /Kontakty
       │
       ▼
  OnGet() spustí se
  Naplní se properties (SeznamKontaktu, ...)
       │
       ▼
  .cshtml vykreslí HTML s daty z @Model
       │
       ▼
  Prohlížeč zobrazí stránku s formulářem

[Uživatel vyplní formulář a klikne Odeslat]
  POST /Kontakty
       │
       ▼
  [BindProperty] naplní NovyKontakt z formuláře
       │
       ▼
  OnPost() spustí se
  ModelState.IsValid?
       │
       ├─ NE  → Page() (zobraz znovu s chybami)
       │
       └─ ANO → ulož, RedirectToPage()
                  │
                  ▼
              302 Redirect → prohlížeč udělá GET /Kontakty
                  │
                  ▼
              OnGet() → zobrazí aktualizovaný seznam
```

---

### Časté chyby

| Chyba | Důsledek | Řešení |
| --- | --- | --- |
| Zapomenuté `@page` | Stránka nefunguje, 404 | Vždy první řádek `.cshtml` |
| `@model` neodpovídá třídě | Razor neumí použít `@Model.X` | Sjednotit jména |
| POST vrací `Page()` místo `RedirectToPage` | Refresh duplikuje odeslání | PRG pattern |
| `[BindProperty]` bez `SupportsGet = true` v GET | Property zůstane prázdná při GET | `SupportsGet = true` pro GET |
| Validace bez `[ApiController]` přístupu (Razor Pages) | Musí být manuální `ModelState.IsValid` | Vždy kontrolovat v OnPost |
| Chybějící `asp-validation-for` v HTML | Chyby validace se nezobrazí | Přidat span pod každý input |
| `<input type="submit">` bez `<form>` | Tlačítko nic nedělá | Obal v `<form method="post">` |
| Zapomenutý CSRF token (`<form>`) | 400 Bad Request | Razor Pages automaticky generuje, `<form>` musí být s `method="post"` |
| `asp-route-id` ale property se jmenuje `Id` | OK | Razor Pages je case-insensitive |
| Modifikace globálních static List | Funguje, ale ne v produkci | Pro maturitu OK, v produkci databáze |

---

## Část 2: Praktická úloha

### Co může praktická úloha obsahovat

Podle informací z minulých let bude úloha typicky **vyplnit kostru projektu** s následujícími prvky:

- **Form na jedné stránce** (Register / Login / Kontakt)
- **POST handler** s validací
- **Confirm/Success stránka** s daty z předchozí
- **Předvyplnění** formuláře přes URL parametr
- **Validace** přes DataAnnotations
- **Select z dynamického listu**
- **Tag Helpers** (asp-for, asp-page, asp-route-, asp-validation-for)
- **PRG pattern**

### Příklad zadání: Registrační formulář kurzu

Vytvoř ASP.NET Core aplikaci pomocí Razor Pages. Aplikace má dvě stránky:

**`/Register`** - formulář pro registraci:

- Jméno, příjmení, email, výběr kurzu
- Zpracovat přes POST
- Při validním vyplnění přesměrovat na `/Confirm` s parametry
- Pokud přijde `?email=...` v URL při GET, předvyplnit email

**`/Confirm`** - potvrzení:

- Zobrazit data předaná přes redirect parametry
- Link zpět na Register s předvyplněným emailem

### Starter kód

### `Models/Registrace.cs`

```csharp
using System.ComponentModel.DataAnnotations;

namespace KurzApp.Models;

public class Registrace
{
    //TODO: [Required] na Jmeno a Prijmeni
    public string Jmeno    { get; set; } = "";
    public string Prijmeni { get; set; } = "";

    //TODO: [Required] a [EmailAddress]
    public string Email    { get; set; } = "";

    //TODO: [Required]
    public string Kurz     { get; set; } = "";

    public static readonly List<string> DostupneKurzy = new()
    {
        "C# základy",
        "ASP.NET Core",
        "React",
        "SQL a databáze"
    };
}
```

### Řešení: kompletní kód

### `Models/Registrace.cs` (dořešené)

```csharp
using System.ComponentModel.DataAnnotations;

namespace KurzApp.Models;

public class Registrace
{
    [Required(ErrorMessage = "Jméno je povinné")]
    public string Jmeno { get; set; } = "";

    [Required(ErrorMessage = "Příjmení je povinné")]
    public string Prijmeni { get; set; } = "";

    [Required(ErrorMessage = "Email je povinný")]
    [EmailAddress(ErrorMessage = "Neplatný formát emailu")]
    public string Email { get; set; } = "";

    [Required(ErrorMessage = "Vyber kurz")]
    public string Kurz { get; set; } = "";

    public static readonly List<string> DostupneKurzy = new()
    {
        "C# základy",
        "ASP.NET Core",
        "React",
        "SQL a databáze"
    };
}
```

### `Pages/Register.cshtml.cs`

```csharp
using KurzApp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace KurzApp.Pages;

public class RegisterModel : PageModel
{
    [BindProperty]
    public Registrace Registrace { get; set; } = new();

    public List<string> DostupneKurzy { get; set; } = new();

    public void OnGet(string? email = null)
    {
        DostupneKurzy = Registrace.DostupneKurzy;

        // Pokud přišel email v URL, předvyplníme ho
        if (email != null)
        {
            Registrace.Email = email;
        }
    }

    public IActionResult OnPost()
    {
        // Při návratu Page() musíme znova naplnit kurzy (jinak <select> bude prázdný)
        DostupneKurzy = Registrace.DostupneKurzy;

        if (!ModelState.IsValid)
            return Page();

        // Validní data, redirect na Confirm s parametry
        return RedirectToPage("Confirm", new
        {
            jmeno = Registrace.Jmeno,
            prijmeni = Registrace.Prijmeni,
            email = Registrace.Email,
            kurz = Registrace.Kurz
        });
    }
}
```

### `Pages/Register.cshtml`

```html
@page
@model RegisterModel
@{
    ViewData["Title"] = "Registrace kurzu";
}

<h1>Registrace kurzu</h1>

<form method="post">
    <div class="mb-3">
        <label asp-for="Registrace.Jmeno" class="form-label">Jméno</label>
        <input asp-for="Registrace.Jmeno" class="form-control"/>
        <span asp-validation-for="Registrace.Jmeno" class="text-danger"></span>
    </div>

    <div class="mb-3">
        <label asp-for="Registrace.Prijmeni" class="form-label">Příjmení</label>
        <input asp-for="Registrace.Prijmeni" class="form-control"/>
        <span asp-validation-for="Registrace.Prijmeni" class="text-danger"></span>
    </div>

    <div class="mb-3">
        <label asp-for="Registrace.Email" class="form-label">Email</label>
        <input asp-for="Registrace.Email" type="email" class="form-control"/>
        <span asp-validation-for="Registrace.Email" class="text-danger"></span>
    </div>

    <div class="mb-3">
        <label asp-for="Registrace.Kurz" class="form-label">Kurz</label>
        <select asp-for="Registrace.Kurz" class="form-select">
            <option value="">-- Vyber kurz --</option>
            @foreach (var k in Model.DostupneKurzy)
            {
                <option value="@k">@k</option>
            }
        </select>
        <span asp-validation-for="Registrace.Kurz" class="text-danger"></span>
    </div>

    <button type="submit" class="btn btn-primary">Registrovat</button>
</form>
```

### `Pages/Confirm.cshtml.cs`

```csharp
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace KurzApp.Pages;

public class ConfirmModel : PageModel
{
    public string Jmeno { get; set; } = "";
    public string Prijmeni { get; set; } = "";
    public string Email { get; set; } = "";
    public string Kurz { get; set; } = "";

    public void OnGet(string jmeno, string prijmeni, string email, string kurz)
    {
        Jmeno = jmeno;
        Prijmeni = prijmeni;
        Email = email;
        Kurz = kurz;
    }
}
```

### `Pages/Confirm.cshtml`

```html
@page
@model ConfirmModel
@{
    ViewData["Title"] = "Potvrzení registrace";
}

<h1>Registrace potvrzena!</h1>

<div class="card">
    <div class="card-body">
        <p><strong>Jméno:</strong> @Model.Jmeno @Model.Prijmeni</p>
        <p><strong>Email:</strong> @Model.Email</p>
        <p><strong>Kurz:</strong> @Model.Kurz</p>
    </div>
</div>

<div class="mt-3">
    <a asp-page="Register" asp-route-email="@Model.Email" class="btn btn-secondary">
        Upravit (předvyplní email)
    </a>
    <a asp-page="Register" class="btn btn-primary">
        Nová registrace
    </a>
</div>
```

### `Program.cs` (kompletní)

```csharp
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddRazorPages();

var app = builder.Build();
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.MapRazorPages();
app.Run();
```

### Co se v řešení děje

**Model (`Registrace`)**: POCO s `DataAnnotations`. `[Required]` u všech polí, `[EmailAddress]` u emailu. `DostupneKurzy` jako static field, aby byl sdílený a snadno přístupný.

**Register OnGet**: Naplníme `DostupneKurzy` pro `<select>`. Pokud přijde `?email=` v URL, předvyplníme `Registrace.Email`. Důležité: protože parametr je optional s default null, funguje to i bez něj.

**Register OnPost**:

1. Znovu naplníme `DostupneKurzy` (musí být i při návratu `Page()`, jinak by `<select>` byl prázdný)
2. Pokud validace selže, `Page()` vrátí stránku s chybami (ASP.NET je zobrazí přes `asp-validation-for`)
3. Pokud validace projde, `RedirectToPage("Confirm", new {...})` přesměruje na Confirm s parametry v URL

**Confirm OnGet**: Přijme parametry z URL a uloží do properties. Razor Pages binduje parametry automaticky podle jmen (case-insensitive).

**Tag Helpers v HTML**:

- `asp-for="Registrace.Jmeno"` generuje `name="Registrace.Jmeno"`, vazba na property
- `asp-validation-for="..."` zobrazuje chyby validace
- `asp-page="Register"` generuje link s správnou URL
- `asp-route-email="@Model.Email"` přidá `?email=...` do URL linku

**PRG pattern**: POST → uložení → Redirect → GET na Confirm. Refresh stránky Confirm jen znovu zobrazí data, neodešle formulář.

---

### Další bonusy

### Bonus A: Persistence do souboru / paměti

```csharp
public class RegisterModel : PageModel
{
    private static List<Registrace> _registrace = new();

    [BindProperty]
    public Registrace Registrace { get; set; } = new();

    public IActionResult OnPost()
    {
        if (!ModelState.IsValid)
        {
            DostupneKurzy = Registrace.DostupneKurzy;
            return Page();
        }

        _registrace.Add(Registrace);   // ulož

        return RedirectToPage("Confirm", new { /* ... */ });
    }
}
```

### Bonus B: TempData místo URL parametrů

```csharp
// Register.OnPost
TempData["Registrace"] = JsonSerializer.Serialize(Registrace);
return RedirectToPage("Confirm");

// Confirm.OnGet
public void OnGet()
{
    if (TempData["Registrace"] is string json)
    {
        var data = JsonSerializer.Deserialize<Registrace>(json);
        // použij data
    }
}
```

Výhoda: data nejsou v URL.

### Bonus C: Vlastní validační atribut

```csharp
public class CzechPhoneAttribute : ValidationAttribute
{
    public override bool IsValid(object? value)
    {
        if (value is string s)
            return Regex.IsMatch(s, @"^\+420\d{9}$");
        return false;
    }
}

// Použití
[CzechPhone(ErrorMessage = "Telefon ve formátu +420...")]
public string Telefon { get; set; } = "";
```

---

## Část 3: Tipy pro obhajobu

### Co u obhajoby říct

> *"V zadání jsem vytvořil dvě Razor Pages: Register a Confirm. Register má formulář s validací přes DataAnnotations Required a EmailAddress. V OnGet jsem implementoval předvyplnění emailu z URL parametru: pokud přijde query string ?email=, naplní se Registrace.Email. OnPost validuje ModelState a při chybě vrací Page() s chybami, jinak přesměruje na Confirm s parametry přes RedirectToPage. Tohle je PRG pattern: Post-Redirect-Get, aby refresh stránky znovu neodeslal formulář. Confirm.OnGet přijme parametry z URL a zobrazí je. Pro formulář jsem použil Tag Helpers asp-for, asp-validation-for a asp-page-handler, které generují správné name atributy a validační hlášky."*
> 

### Klíčové pojmy pro teorii

| Pojem | Rychlá odpověď |
| --- | --- |
| **Razor Pages** | ASP.NET Core framework, každá stránka = .cshtml + .cshtml.cs |
| **`@page`** | Povinná direktiva, dělá z souboru Razor Page |
| **`PageModel`** | Bázová třída, dědí ji každá Razor Page |
| **`OnGet()`** | Handler pro GET request (otevření stránky) |
| **`OnPost()`** | Handler pro POST request (formulář) |
| **`OnGetAsync()` / `OnPostAsync()`** | Asynchronní varianty |
| **`[BindProperty]`** | Auto bind formuláře/query do property (default jen POST) |
| **`[BindProperty(SupportsGet = true)]`** | Bind i pro GET |
| **`Page()`** | Vrátí 200 + znovu vykreslí stránku (při chybě validace) |
| **`RedirectToPage()`** | 302 redirect na GET té samé stránky |
| **`RedirectToPage("X", new {...})`** | Redirect s parametry |
| **PRG pattern** | Post-Redirect-Get, brání duplicitnímu odeslání |
| **`ModelState.IsValid`** | Auto-validace podle DataAnnotations |
| **`[Required]`, `[EmailAddress]`, `[Range]`** | DataAnnotations pro validaci |
| **Pojmenované handlery** | `OnPostUlozit()` + `asp-page-handler="Ulozit"` |
| **Tag Helpers (asp-*)** | HTML atributy pro generování názvů a hodnot |
| **`asp-for`** | Vazba inputu na property |
| **`asp-validation-for`** | Zobrazení chyby validace |
| **`asp-page`, `asp-route-*`** | Generování linků a URL |

### Časté chytáky

| Otázka | Odpověď |
| --- | --- |
| *Rozdíl Razor Pages a MVC?* | Razor Pages = stránka jako jednotka (1:1 .cshtml + .cshtml.cs). MVC = oddělené Controllers/Views/Models. Razor Pages je jednodušší pro klasické weby. |
| *Rozdíl Razor Pages a Web API?* | Razor Pages vrací HTML, Web API vrací JSON. Razor Pages je pro klasické weby, Web API pro frontend SPA / mobile. |
| *Co je `@page`?* | Povinná direktiva na začátku .cshtml. Bez ní soubor není Razor Page. |
| *Co je `[BindProperty]`?* | Automaticky naplní property z HTTP requestu. Default jen POST, pro GET přidat `SupportsGet = true`. |
| *Co je PRG pattern?* | Post-Redirect-Get. Po úspěšném POST vždy redirect, aby refresh stránky znovu neodesílal formulář. |
| *Page() vs RedirectToPage()?* | Page() znovu vykreslí stránku (typicky při chybě validace). RedirectToPage() přesměruje (typicky po úspěchu). |
| *Co dělá `ModelState.IsValid`?* | Vrátí true, pokud všechny validace přes DataAnnotations prošly. ASP.NET to provede automaticky. |
| *Jak předat data mezi stránkami?* | Nejjednodušší: URL parametry přes `RedirectToPage("X", new {...})`. Alternativy: TempData, Session. |
| *Co je `asp-route-id="5"`?* | Tag Helper, který přidá `?id=5` nebo `/5` do URL linku. |
| *Jak fungují pojmenované handlery?* | `OnPostUlozit()` + `asp-page-handler="Ulozit"` na tlačítku. Razor Pages volá handler podle jména. |

### Časté chyby v praktické úloze

- Zapomenuté `@page` (stránka nefunguje, 404)
- POST vrací `Page()` místo `RedirectToPage` (refresh duplikuje záznam)
- `[BindProperty]` bez `SupportsGet` v GET handleru s parametrem (property zůstane null)
- Chybějící `if (!ModelState.IsValid)` (uloží i nevalidní data)
- Pří návratu `Page()` neznovu nenaplní data pro `<select>` (kurzy zmizí)
- Chybějící `<form method="post">` (nebo `method="get"` při formuláři)
- `asp-validation-for` cílí na špatnou property (chyba se nezobrazí)
- Předání citlivých dat přes URL (`?heslo=...`) (mělo by být TempData/Session)
- Tlačítko `<button>` mimo `<form>` (nic nedělá)
- Validační atributy bez `ErrorMessage` (default hlášky v angličtině)
- `asp-page="/Register"` místo `asp-page="Register"` (záleží na cestě, oba mohou fungovat ale relativní lepší)
- Použití `[BindProperty]` na celý PageModel místo property (binduje úplně vše)
- Confirm bere data jako `[BindProperty]` místo z OnGet parametrů (špatně, OnGet má parametry z URL)
- Static List v PageModel pro produkci (ztratí se při restartu, sdíleno mezi uživateli)