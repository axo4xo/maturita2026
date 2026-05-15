# 19 • ASP.NET Tag Helpers a formuláře

> ASP.NET Tag Helpers, formuláře, vstupní prvky, validace
> 

> **Formát:** 30 min praktická úloha, 15 min obhajoba + teorie. Teorie pokrývá Tag Helpers a formuláře, praktika je komplexnější s EF Core a 3 stránkami.
> 

> **Pozn.**: Tahle otázka má velký překryv s DAT 18 (Razor Pages), ale zaměřuje se specificky na **Tag Helpers a formuláře**. Stojí za to znát obě otázky.
> 

---

## Část 1: Teorie

### Co jsou Tag Helpers

**Tag Helpers** jsou serverové komponenty v ASP.NET Core, které **rozšiřují HTML elementy** o atributy začínající `asp-`. Umožňují serverovému kódu účastnit se vykreslování HTML bez nutnosti opouštět HTML syntaxi.

```html
<!-- Klasické HTML -->
<input type="email" name="Email" id="Email" value="" />
<label for="Email">Email</label>

<!-- S Tag Helperem -->
<input asp-for="Email" />          <!-- vygeneruje vše výše + validační atributy -->
<label asp-for="Email"></label>    <!-- vygeneruje for + text -->
```

### Tag Helpers vs HTML Helpers (starší přístup)

| HTML Helper (starší) | Tag Helper (modernější) |
| --- | --- |
| `@Html.TextBoxFor(m => m.Email)` | `<input asp-for="Email" />` |
| Smíchání C# a HTML | Vypadá jako čisté HTML |
| Bez IntelliSense pro HTML | Plná podpora IntelliSense |
| Slabá typovost při psaní | Chyba při kompilaci, pokud vlastnost neexistuje |

> Tag Helpers jsou doporučovaný přístup od ASP.NET Core 1.0 (2016). HTML Helpers se v moderním kódu používají vzácně.
> 

---

### Aktivace Tag Helpers

Tag Helpers se aktivují v souboru `Pages/_ViewImports.cshtml`:

```csharp
@addTagHelper *, Microsoft.AspNetCore.Mvc.TagHelpers
```

- **Hvězdička** znamená "všechny Tag Helpers z daného assembly"
- **Soubor se dědí** do všech stránek ve složce a podsložkách, stačí nastavit jednou
- **Bez tohoto** atributy `asp-*` nedělají nic, jsou ignorovány

---

### Form Tag Helper

Rozšiřuje `<form>` element. Automaticky generuje atribut `action` a **anti-forgery token** (ochrana před CSRF útoky).

### Razor Pages (nejčastější použití)

```html
<form method="post">
    <!-- formulářové prvky -->
    <button type="submit">Odeslat</button>
</form>
```

V Razor Pages **není potřeba `asp-action` ani `asp-controller`**, formulář automaticky odešle POST na aktuální stránku.

### Odeslání na konkrétní handler

```html
<form method="post" asp-page-handler="Subscribe">
    <!-- prvky -->
</form>
```

Zavolá metodu `OnPostSubscribe()` nebo `OnPostSubscribeAsync()` v PageModelu.

### MVC Controller

```html
<form asp-controller="Home" asp-action="Register" method="post">
    <!-- prvky -->
</form>
```

### Předávání parametrů v URL

```html
<form method="post" asp-route-id="@Model.CourseId">
    <!-- prvky -->
</form>
```

Vygeneruje: `action="/Stránka?id=5"` (nebo `/Stránka/5` podle routy).

### Anti-forgery token (CSRF ochrana)

Form Tag Helper automaticky přidá skrytý:

```html
<input type="hidden" name="__RequestVerificationToken" value="..." />
```

> **CSRF (Cross-Site Request Forgery)**: útok, kdy zlomyslný web zneužije přihlášení uživatele a pošle požadavek jeho jménem. Anti-forgery token tomu brání: token je v cookie i v formuláři, musí se shodovat.
> 

V Razor Pages je validace tokenu **automatická**, nemusíš nic dělat. V MVC se přidává `[ValidateAntiForgeryToken]` na action.

---

### Input Tag Helper

Svazuje HTML `<input>` s vlastností modelu přes `asp-for`.

```html
<input asp-for="Email" />
```

Co vygeneruje:

- Správný `type` (podle Data Annotations a datového typu)
- Atributy `id` a `name` shodné s názvem vlastnosti
- Validační `data-val-*` atributy pro jQuery Validation
- Default `value` z modelu

### Automatické mapování typů

| Typ v C# / Data Annotation | Vygenerovaný type |
| --- | --- |
| `string` | `type="text"` |
| `bool` | `type="checkbox"` |
| `int`, `double`, `decimal` | `type="number"` |
| `DateTime` | `type="datetime-local"` |
| `[EmailAddress]` | `type="email"` |
| `[DataType(DataType.Password)]` | `type="password"` |
| `[DataType(DataType.Date)]` | `type="date"` |
| `[DataType(DataType.Url)]` | `type="url"` |
| `[DataType(DataType.PhoneNumber)]` | `type="tel"` |
| `[HiddenInput]` | `type="hidden"` |

### Příklady

```html
<input asp-for="Name" class="form-control"/>          <!-- text -->
<input asp-for="Email" class="form-control"/>          <!-- email (díky [EmailAddress]) -->
<input asp-for="Password" class="form-control"/>       <!-- password (díky [DataType(Password)]) -->
<input asp-for="CourseId" type="hidden"/>              <!-- explicitně skryté pole -->
<input asp-for="Vek" class="form-control"/>            <!-- number (int) -->
<input asp-for="DatumNarozeni" class="form-control"/>  <!-- date -->
```

---

### Label Tag Helper

Generuje `<label>` s atributem `for` navázaným na `id` příslušného inputu. Text popisku bere z `[Display(Name = "...")]` nebo z názvu vlastnosti.

```html
<label asp-for="Email"></label>
```

Pokud má model:

```csharp
[Display(Name = "E-mailová adresa")]
public string Email { get; set; } = "";
```

Vygeneruje:

```html
<label for="Email">E-mailová adresa</label>
```

Bez `[Display]` použije název vlastnosti přímo (`Email`).

---

### Select Tag Helper

Generuje `<select>` rozevírací seznam. Potřebuje:

- `asp-for`: vlastnost modelu, do které se uloží vybraná hodnota
- `asp-items`: seznam `SelectListItem` (nebo `SelectList`, nebo enum)

### Z `List<SelectListItem>`

```csharp
public class IndexModel : PageModel
{
    [BindProperty]
    public string SelectedCourse { get; set; } = "";

    public List<SelectListItem> Courses { get; set; } = new()
    {
        new SelectListItem { Value = "1", Text = "Webový vývoj" },
        new SelectListItem { Value = "2", Text = "Databáze" }
    };
}
```

```html
<select asp-for="SelectedCourse" asp-items="Model.Courses" class="form-control">
    <option value="">-- Vyberte kurz --</option>
</select>
```

### Ze `SelectList` ze seznamu objektů

```csharp
// V PageModelu
public SelectList CoursesSelect => new SelectList(courses, "Id", "Name");
```

```html
<select asp-for="CourseId" asp-items="Model.CoursesSelect"></select>
```

### Z enumu

```csharp
public enum CourseStatus { Aktivní, Plný, Zrušený }
```

```html
<select asp-for="Status" asp-items="Html.GetEnumSelectList<CourseStatus>()"></select>
```

### Multi-select (víc hodnot)

```csharp
[BindProperty]
public List<string> SelectedTags { get; set; } = new();
```

```html
<select asp-for="SelectedTags" asp-items="Model.AllTags" multiple>
</select>
```

---

### Textarea Tag Helper

Stejné jako Input, ale pro víceřádkový text:

```html
<textarea asp-for="Description" class="form-control" rows="4"></textarea>
```

Vygeneruje:

```html
<textarea name="Description" id="Description" rows="4">@Model.Description</textarea>
```

---

### Validation Tag Helpers

### Zpráva pro konkrétní pole: `asp-validation-for`

```html
<span asp-validation-for="Email" class="text-danger"></span>
```

Zobrazí chybovou zprávu pro vlastnost `Email`, pokud validace selže.

### Souhrn všech chyb: `asp-validation-summary`

```html
<div asp-validation-summary="ModelOnly" class="text-danger"></div>
```

| Hodnota | Co zobrazí |
| --- | --- |
| `All` | Chyby vlastností i modelu |
| `ModelOnly` | Pouze chyby modelu (nebýt chyby polí, ne ty z `AddModelError` na pole) |
| `None` | Nic |

> `ModelOnly` je nejčastější: chyby polí jsou už zobrazené pod každým inputem přes `asp-validation-for`, sumář by je opakoval. `ModelOnly` ukáže jen globální chyby (např. "Email už registrovaný").
> 

---

### Kompletní příklad formuláře s validací

```html
@page
@model SubscribeModel

<form method="post">
    <div asp-validation-summary="ModelOnly" class="text-danger"></div>

    <div class="mb-3">
        <label asp-for="Name" class="form-label"></label>
        <input asp-for="Name" class="form-control"/>
        <span asp-validation-for="Name" class="text-danger"></span>
    </div>

    <div class="mb-3">
        <label asp-for="Email" class="form-label"></label>
        <input asp-for="Email" class="form-control"/>
        <span asp-validation-for="Email" class="text-danger"></span>
    </div>

    <input asp-for="CourseId" type="hidden"/>

    <button type="submit" class="btn btn-primary">Odeslat</button>
</form>

@section Scripts {
    @{ await Html.RenderPartialAsync("_ValidationScriptsPartial"); }
}
```

> **Důležité**: Pro **klientskou (real-time) validaci** je nutné načíst `_ValidationScriptsPartial`, obsahuje jQuery Validation. Bez toho probíhá validace **pouze na serveru** po odeslání formuláře. Klientská validace je lepší UX (chyba se ukáže okamžitě, bez round-tripu).
> 

---

### Data Annotations: validace modelu

Atributy z `System.ComponentModel.DataAnnotations` přidané na vlastnosti modelu:

```csharp
using System.ComponentModel.DataAnnotations;

public class SubscriptionModel
{
    [Required(ErrorMessage = "Jméno je povinné")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Jméno musí mít 2 až 100 znaků")]
    [Display(Name = "Celé jméno")]
    public string Name { get; set; } = "";

    [Required(ErrorMessage = "Email je povinný")]
    [EmailAddress(ErrorMessage = "Zadejte platný email")]
    [Display(Name = "E-mailová adresa")]
    public string Email { get; set; } = "";

    [Required(ErrorMessage = "Vyberte kurz")]
    public int CourseId { get; set; }

    [Range(1, 120, ErrorMessage = "Věk musí být 1 až 120")]
    public int Age { get; set; }

    [DataType(DataType.Password)]
    [MinLength(8, ErrorMessage = "Heslo musí mít alespoň 8 znaků")]
    public string Password { get; set; } = "";

    [Compare("Password", ErrorMessage = "Hesla se neshodují")]
    public string ConfirmPassword { get; set; } = "";
}
```

### Přehled atributů

| Atribut | Popis |
| --- | --- |
| `[Required]` | Pole nesmí být prázdné |
| `[StringLength(max, MinimumLength = min)]` | Délka řetězce |
| `[Range(min, max)]` | Číselný rozsah |
| `[EmailAddress]` | Formát emailu |
| `[Url]` | Formát URL |
| `[Phone]` | Telefonní číslo |
| `[CreditCard]` | Číslo platební karty |
| `[MinLength(n)]` / `[MaxLength(n)]` | Min nebo max délka |
| `[Compare("Vlastnost")]` | Shoda s jinou vlastností |
| `[RegularExpression(pattern)]` | Vlastní regex |
| `[Display(Name = "...")]` | Zobrazovaný název v labelu |
| `[DataType(DataType.Password)]` | Typ vstupu (input type) |

---

### ModelState a zpracování formuláře

```csharp
public class SubscribePage : PageModel
{
    private readonly AppDbContext _db;
    public SubscribePage(AppDbContext db) { _db = db; }

    [BindProperty]
    public SubscriptionModel Subscription { get; set; } = new();

    // GET: zobrazení prázdného formuláře
    public IActionResult OnGet(int courseId)
    {
        Subscription = new SubscriptionModel { CourseId = courseId };
        return Page();
    }

    // POST: zpracování odeslaného formuláře
    public async Task<IActionResult> OnPostAsync()
    {
        if (!ModelState.IsValid)
            return Page();              // zobraz formulář znovu s chybami

        _db.Subscriptions.Add(Subscription);
        await _db.SaveChangesAsync();

        return RedirectToPage("./List");    // PRG pattern
    }
}
```

### Klíčové body

- **`[BindProperty]`**: vlastnost se automaticky naplní z dat odeslaného formuláře (POST body)
- **`ModelState.IsValid`**: vrátí true, pokud všechny Data Annotations prošly
- **`return Page()` při chybě**: znovu vykreslí stránku se zachovanými hodnotami a chybami
- **`return RedirectToPage(...)` po úspěchu**: zabrání dvojitému odeslání při obnovení stránky (PRG pattern)

### Ruční přidání chyby do ModelState

```csharp
// Chyba pro konkrétní pole (zobrazí asp-validation-for="Email")
ModelState.AddModelError("Email", "Tento email je už registrován.");

// Obecná chyba modelu (zobrazí asp-validation-summary="ModelOnly")
ModelState.AddModelError(string.Empty, "Obecná chyba modelu");

return Page();
```

Použití: serverové validace, které nelze vyjádřit Data Annotations (např. kontrola unikátnosti emailu v DB).

---

### Skryté pole: předávání dat mezi stránkami

### Metoda 1: Skryté pole v HTML

```html
<input type="hidden" asp-for="CourseId"/>
```

```csharp
[BindProperty]
public int CourseId { get; set; }

public IActionResult OnGet(int courseId)
{
    CourseId = courseId;      // naplní skryté pole
    return Page();
}
```

Pole se zobrazí v HTML jako `<input type="hidden">`, hodnota se odešle s formulářem.

> **Důležité**: skryté pole je v HTML, takže uživatel ho může vidět v DevTools nebo modifikovat. **Nikdy tam nedávej citlivá data** (ceny, role, ID admin uživatele). Použij ho jen pro **neutrální data jako odkazy na souvislé záznamy**.
> 

### Metoda 2: Přesměrování s parametrem v URL

```csharp
// Z Index stránky:
return RedirectToPage("./Subscribe", new { courseId = SelectedCourseId });

// V Subscribe stránce:
public IActionResult OnGet(int courseId)
{
    CourseId = courseId;
    return Page();
}
```

URL bude: `/Subscribe?courseId=5`

### Metoda 3: TempData (session-based)

```csharp
TempData["CourseId"] = SelectedCourseId;
return RedirectToPage("./Subscribe");

// V Subscribe:
public IActionResult OnGet()
{
    if (TempData["CourseId"] is int id)
        CourseId = id;
    return Page();
}
```

Plus: skryté před uživatelem. Mínus: vyžaduje session middleware.

---

### Cheat sheet

```html
asp-for="Vlastnost"                    → váže input/label/select/textarea na vlastnost
asp-items="Model.Seznam"               → seznam položek pro <select>
asp-validation-for="Vlastnost"         → zpráva validace pro jedno pole
asp-validation-summary="ModelOnly"     → souhrn všech chyb formuláře
asp-page-handler="Nazev"               → odešle formulář na OnPost{Nazev}()
asp-route-param="hodnota"              → přidá query parametr do URL formuláře
asp-page="/Detail"                     → bezpečný odkaz na Razor Page
```

---

### Časté chyby

| Chyba | Důsledek | Řešení |
| --- | --- | --- |
| Tag Helpers nefungují | `_ViewImports.cshtml` neaktivní | Přidat `@addTagHelper *, Microsoft.AspNetCore.Mvc.TagHelpers` |
| `asp-for` na model bez `[BindProperty]` | Hodnota nezůstane po POSTu | Přidat `[BindProperty]` |
| Klientská validace nefunguje | Chybí `_ValidationScriptsPartial` | Přidat `@section Scripts` |
| `<input>` mimo `<form>` | Tlačítko nic nedělá | Obal v `<form method="post">` |
| Chybí `asp-validation-for` | Chyby validace se nezobrazí | Přidat span za každý input |
| Zapomenutý `ModelState.IsValid` check | Uloží i nevalidní data | `if (!ModelState.IsValid) return Page();` |
| POST vrací data přes URL parametry s citlivými údaji | Bezpečnost | TempData / Session |
| Tag Helper bez `class` (např. `form-control`) | Vypadá to nestyovaně | Přidat CSS třídu |
| `<select>` bez výchozí option | "0" jako default value | Přidat `<option value="">-- Vyberte --</option>` |
| Změna `asp-for` na property z jiného typu | Type mismatch | Sjednotit typy |
| Multiple `asp-for` na jeden input | Override | Použít jen jednou |

---

# Část 2: Praktická úloha

### Co může praktická úloha obsahovat

Typická úloha:

- **Více Razor Pages** propojených redirectem (např. seznam → detail → formulář)
- **Formulář s validací** přes Data Annotations
- **Select** dynamicky naplněný z DB nebo statického listu
- **Skryté pole nebo URL parametry** pro předání ID mezi stránkami
- **Entity Framework Core** pro práci s databází (DbContext, DbSet)
- **PRG pattern** po úspěšném POST
- **Tabulkový výpis** záznamů na stránce List

### Příklad zadání: Přihlašování na kurzy

Aplikace pro přihlašování na kurzy s **třemi stránkami**:

**`/Index`**: Výběr kurzu

- `<select>` s dostupnými kurzy z DB
- Po výběru přesměrování na Subscribe s ID kurzu

**`/Subscribe`**: Přihlašovací formulář

- Uživatel zadá jméno a email
- Zvolený kurz předán skrytým polem
- Validace: jméno a email povinné, email validní formát

**`/List`**: Seznam přihlášek

- Tabulka odeslaných přihlášek s názvem kurzu (join)

### Řešení

### `Models/Subscription.cs` (Data Annotations)

```csharp
using System.ComponentModel.DataAnnotations;

namespace CourseRegistration.Models;

public class Subscription
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Jméno je povinné")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Jméno musí mít 2 až 100 znaků")]
    [Display(Name = "Celé jméno")]
    public string Name { get; set; } = "";

    [Required(ErrorMessage = "Email je povinný")]
    [EmailAddress(ErrorMessage = "Neplatný formát emailu")]
    [Display(Name = "E-mailová adresa")]
    public string Email { get; set; } = "";

    [Required(ErrorMessage = "Vyber kurz")]
    public int CourseId { get; set; }

    public Course? Course { get; set; }
}
```

### `Pages/Index.cshtml.cs`

```csharp
using CourseRegistration.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;

namespace CourseRegistration.Pages;

public class IndexModel : PageModel
{
    private readonly AppDbContext _db;
    public IndexModel(AppDbContext db) { _db = db; }

    [BindProperty]
    public int SelectedCourseId { get; set; }

    public List<SelectListItem> Courses { get; set; } = new();

    public async Task OnGetAsync()
    {
        // Načteme kurzy z DB a převedeme na SelectListItem
        Courses = await _db.Courses
            .Select(c => new SelectListItem
            {
                Value = c.Id.ToString(),
                Text = c.Name
            })
            .ToListAsync();
    }

    public IActionResult OnPost()
    {
        // Přesměrování na Subscribe s parametrem courseId
        if (SelectedCourseId == 0)
            return RedirectToPage();   // nebyl vybrán kurz, znovu

        return RedirectToPage("./Subscribe", new { courseId = SelectedCourseId });
    }
}
```

### `Pages/Index.cshtml`

```html
@page
@model IndexModel
@{ ViewData["Title"] = "Výběr kurzu"; }

<h2>Výběr kurzu</h2>

<form method="post">
    <div class="mb-3">
        <label class="form-label">Kurz</label>
        <select asp-for="SelectedCourseId" asp-items="Model.Courses" class="form-select">
            <option value="0">-- Vyberte kurz --</option>
        </select>
    </div>

    <button type="submit" class="btn btn-primary">Přihlásit se →</button>
</form>
```

### `Pages/Subscribe.cshtml.cs`

```csharp
using CourseRegistration.Data;
using CourseRegistration.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;

namespace CourseRegistration.Pages;

public class SubscribeModel : PageModel
{
    private readonly AppDbContext _db;
    public SubscribeModel(AppDbContext db) { _db = db; }

    [BindProperty]
    public Subscription Subscription { get; set; } = new();

    public string CourseName { get; set; } = "";

    public async Task<IActionResult> OnGetAsync(int courseId)
    {
        // Najdi kurz v DB
        var course = await _db.Courses.FindAsync(courseId);
        if (course == null)
            return RedirectToPage("./Index");

        Subscription.CourseId = courseId;
        CourseName = course.Name;
        return Page();
    }

    public async Task<IActionResult> OnPostAsync()
    {
        // Validace
        if (!ModelState.IsValid)
        {
            // Musíme znovu načíst CourseName pro nadpis
            var course = await _db.Courses.FindAsync(Subscription.CourseId);
            CourseName = course?.Name ?? "";
            return Page();
        }

        // Ulož přihlášku
        _db.Subscriptions.Add(Subscription);
        await _db.SaveChangesAsync();

        // PRG: přesměrování na List
        return RedirectToPage("./List");
    }
}
```

### `Pages/Subscribe.cshtml`

```html
@page
@model SubscribeModel
@{ ViewData["Title"] = "Přihlášení"; }

<h2>Přihlášení na kurz: <em>@Model.CourseName</em></h2>

<form method="post">
    <div asp-validation-summary="ModelOnly" class="text-danger"></div>

    <input asp-for="Subscription.CourseId" type="hidden"/>

    <div class="mb-3">
        <label asp-for="Subscription.Name" class="form-label"></label>
        <input asp-for="Subscription.Name" class="form-control"/>
        <span asp-validation-for="Subscription.Name" class="text-danger"></span>
    </div>

    <div class="mb-3">
        <label asp-for="Subscription.Email" class="form-label"></label>
        <input asp-for="Subscription.Email" class="form-control"/>
        <span asp-validation-for="Subscription.Email" class="text-danger"></span>
    </div>

    <button type="submit" class="btn btn-success">Přihlásit se</button>
    <a asp-page="./Index" class="btn btn-secondary">← Zpět</a>
</form>

@section Scripts {
    @{ await Html.RenderPartialAsync("_ValidationScriptsPartial"); }
}
```

### `Pages/List.cshtml.cs`

```csharp
using CourseRegistration.Data;
using CourseRegistration.Models;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;

namespace CourseRegistration.Pages;

public class ListModel : PageModel
{
    private readonly AppDbContext _db;
    public ListModel(AppDbContext db) { _db = db; }

    public List<Subscription> Subscriptions { get; set; } = new();

    public async Task OnGetAsync()
    {
        // Include() = JOIN s tabulkou Course
        Subscriptions = await _db.Subscriptions
            .Include(s => s.Course)
            .OrderByDescending(s => s.Id)
            .ToListAsync();
    }
}
```

### `Pages/List.cshtml`

```html
@page
@model ListModel
@{ ViewData["Title"] = "Seznam přihlášek"; }

<h2>Seznam přihlášek</h2>

<a asp-page="./Index" class="btn btn-primary mb-3">+ Nová přihláška</a>

@if (Model.Subscriptions.Count == 0)
{
    <div class="alert alert-info">
        Zatím žádné přihlášky. <a asp-page="./Index">Přihlas se jako první!</a>
    </div>
}
else
{
    <table class="table table-striped">
        <thead>
            <tr>
                <th>#</th>
                <th>Jméno</th>
                <th>Email</th>
                <th>Kurz</th>
            </tr>
        </thead>
        <tbody>
            @foreach (var s in Model.Subscriptions)
            {
                <tr>
                    <td>@s.Id</td>
                    <td>@s.Name</td>
                    <td>@s.Email</td>
                    <td>@s.Course?.Name</td>
                </tr>
            }
        </tbody>
    </table>
}
```

### Co se v řešení děje

**Models/Subscription.cs**: POCO model s plnými Data Annotations. `[Display(Name = ...)]` použije Label Tag Helper pro hezké popisky. Navigation property `Course?` umožní `Include()` pro JOIN.

**Index page**: `OnGetAsync` načte kurzy z DB pomocí EF Core a převede na `SelectListItem`. `OnPost` zkontroluje, že kurz byl vybrán (ne 0), a přesměruje na Subscribe.

**Subscribe page**: `OnGetAsync` přijme `courseId` z URL parametru, najde kurz a předvyplní skryté pole. `OnPostAsync` validuje a uloží přihlášku do DB. Při chybě validace musí znovu načíst `CourseName`, protože ho ztratíme (není v `[BindProperty]`).

**List page**: `OnGetAsync` načte všechny přihlášky s `Include(s => s.Course)`, což udělá JOIN na tabulku Course. V HTML pak používáme `s.Course?.Name`.

**Tag Helpers v praxi**:

- `<select asp-for="SelectedCourseId" asp-items="Model.Courses">` automaticky vyrendruje `<option>` pro každý SelectListItem
- `<input asp-for="Subscription.Name">` vygeneruje správný name/id + validační atributy
- `<label asp-for="Subscription.Email">` použije `[Display(Name = "E-mailová adresa")]`
- `<span asp-validation-for="Subscription.Name">` zobrazí chybu z `[Required]`

**PRG pattern**: Po úspěšném POST je vždy RedirectToPage. Refresh stránky List jen znovu načte data, neodešle formulář.

---

### Bonusy

### Bonus A: Kontrola duplicitního emailu

```csharp
public async Task<IActionResult> OnPostAsync()
{
    if (!ModelState.IsValid)
    {
        // ...
        return Page();
    }

    // Kontrola, zda email už existuje
    bool existuje = await _db.Subscriptions
        .AnyAsync(s => s.Email == Subscription.Email && s.CourseId == Subscription.CourseId);

    if (existuje)
    {
        ModelState.AddModelError("Subscription.Email", "Tento email je už na kurz přihlášený.");
        var course = await _db.Courses.FindAsync(Subscription.CourseId);
        CourseName = course?.Name ?? "";
        return Page();
    }

    _db.Subscriptions.Add(Subscription);
    await _db.SaveChangesAsync();
    return RedirectToPage("./List");
}
```

### Bonus B: Smazání přihlášky (pojmenovaný handler)

```csharp
// V ListModel
public async Task<IActionResult> OnPostDeleteAsync(int id)
{
    var subscription = await _db.Subscriptions.FindAsync(id);
    if (subscription != null)
    {
        _db.Subscriptions.Remove(subscription);
        await _db.SaveChangesAsync();
    }
    return RedirectToPage();
}
```

```html
<form method="post" asp-page-handler="Delete" asp-route-id="@s.Id" style="display:inline">
    <button type="submit" class="btn btn-sm btn-danger"
            onclick="return confirm('Opravdu smazat?')">Smazat</button>
</form>
```

### Bonus C: Confirmation page (3+1 stránka)

Po úspěšném přihlášení přesměrování na `/Confirm?id={subscriptionId}` místo List, kde se zobrazí potvrzení s detaily.

---

## Část 3: Tipy pro obhajobu

### Co u obhajoby říct

> *"V zadání jsem vyplnil rozdělaný projekt s třemi Razor Pages: Index, Subscribe a List. Použil jsem Tag Helpers pro generování formulářových prvků: asp-for vázal inputy na model, asp-items naplnil select kurzy načtenými z DB přes EF Core, asp-validation-for zobrazil chyby validace. Na modelu Subscription jsem nastavil Data Annotations: Required, StringLength, EmailAddress, Display. ID kurzu se mezi Index a Subscribe předává přes URL parametr (RedirectToPage s anonymním objektem), v Subscribe pak jako skryté pole, aby se zachovalo při validaci. Validace probíhá přes ModelState.IsValid, při chybě vracím Page() s chybami, při úspěchu RedirectToPage podle PRG patternu. List používá Include() pro JOIN s Course tabulkou."*
> 

### Klíčové pojmy pro teorii

| Pojem | Rychlá odpověď |
| --- | --- |
| **Tag Helpers** | Serverové komponenty rozšiřující HTML atributy o `asp-*` |
| **`_ViewImports.cshtml`** | Aktivace Tag Helpers (přes `@addTagHelper`) |
| **`asp-for`** | Váže input/label/select na vlastnost modelu |
| **`asp-items`** | Seznam položek pro `<select>` |
| **`asp-validation-for`** | Zpráva validace pro jedno pole |
| **`asp-validation-summary`** | Souhrn chyb (All / ModelOnly / None) |
| **`asp-page-handler`** | Odešle formulář na konkrétní handler |
| **`asp-route-*`** | Předání parametrů v URL |
| **Anti-forgery token** | CSRF ochrana, generována automaticky |
| **`[BindProperty]`** | Auto-bind formulářových dat na property |
| **`ModelState.IsValid`** | Výsledek validace přes Data Annotations |
| **`AddModelError`** | Ruční přidání chyby (např. duplicitní email) |
| **Data Annotations** | `[Required]`, `[EmailAddress]`, `[Range]`, `[Display]`, atd. |
| **PRG pattern** | Post-Redirect-Get, prevence dvojího odeslání |
| **`SelectListItem`** | Třída pro položku `<select>` (Value + Text) |
| **`[Display(Name=...)]`** | Hezký popisek pro label |
| **`Include()`** | EF Core JOIN s navigation property |
| **`_ValidationScriptsPartial`** | jQuery Validation pro client-side validaci |

### Časté chytáky

| Otázka | Odpověď |
| --- | --- |
| *Co jsou Tag Helpers?* | Serverové komponenty rozšiřující HTML elementy o atributy `asp-*`. Generují správné name/id/href/validační atributy z modelu. |
| *Jak se aktivují?* | V `_ViewImports.cshtml` přes `@addTagHelper *, Microsoft.AspNetCore.Mvc.TagHelpers`. Dědí se do celé složky. |
| *Co dělá `asp-for`?* | Váže input/label/select na vlastnost modelu. Generuje správné `name`, `id`, `value` a validační atributy. |
| *Jak funguje validace?* | Data Annotations na modelu (`[Required]`, atd.) definují pravidla. `ModelState.IsValid` zkontroluje. `asp-validation-for` zobrazí chyby. |
| *Co dělá `ModelOnly` u summary?* | Zobrazí jen chyby modelu jako celku (např. ručně přidané přes `AddModelError(string.Empty, ...)`), ne chyby jednotlivých polí. |
| *Co je anti-forgery token?* | CSRF ochrana. Form Tag Helper ho automaticky přidá jako skryté pole. ASP.NET ho validuje na serveru. |
| *Jak předat data mezi stránkami?* | URL parametr (`asp-route-*` nebo `RedirectToPage(..., new {...})`), skryté pole, TempData, Session. |
| *Co je `[BindProperty]`?* | Auto-bind HTTP requestu na property. Default jen POST, pro GET přidat `SupportsGet = true`. |
| *Rozdíl Page() a RedirectToPage()?* | Page() znovu vykreslí stránku (typicky při chybě validace). RedirectToPage() přesměruje (typicky po úspěchu). |
| *Co je PRG pattern?* | Post-Redirect-Get. Po POST vždy redirect, aby refresh stránky neodeslal formulář znovu. |
| *Jak funguje `asp-items` pro select?* | Bere `List<SelectListItem>` nebo `SelectList`. Vygeneruje `<option value="..">Text</option>` pro každou položku. |
| *Proč potřebujeme `_ValidationScriptsPartial`?* | Pro klientskou validaci (jQuery Validation). Bez něj validace probíhá jen na serveru po odeslání. |

### Časté chyby v praktické úloze

- Chybí `_ViewImports.cshtml` s `@addTagHelper` (Tag Helpers nefungují)
- `<select>` bez `asp-items` (prázdný, jen výchozí option)
- `asp-for` bez `[BindProperty]` v PageModelu (hodnota se neuloží)
- `<input>` mimo `<form>` (tlačítko nedělá nic)
- Chybí `if (!ModelState.IsValid) return Page();` (uloží i nevalidní)
- Při návratu `Page()` se ztratí pomocná data (např. CourseName), musí se znovu načíst
- POST vrací data přes URL místo `RedirectToPage` (refresh duplikuje)
- Citlivá data ve skrytém poli (uživatel je vidí v DevTools)
- Chybí `Include()` pro navigation property (relace je null)
- Chybí výchozí `<option value="">-- Vyberte --</option>` (0 jako "default" hodnota)
- `asp-validation-summary="All"` plus `asp-validation-for` (chyby se zobrazí dvakrát)
- Špatný `asp-for` namespace (např. `asp-for="Name"` místo `asp-for="Subscription.Name"`)
- Zapomenutý `@section Scripts` (klientská validace nefunguje)
- `RedirectToPage("Subscribe")` místo `RedirectToPage("./Subscribe")` (relative vs absolute, oba mohou fungovat ale leading slash je explicitnější)