# 17 • Rest API v ASP.NET

> Implementace REST API v ASP.NET, routování, controller, metody HTTP (GET, POST, PUT, DELETE)
> 

> **Formát:** 30 min praktická úloha, 15 min obhajoba + teorie. Podle informací z minulých let se u praktiky **dodělává endpoint do existujícího starter projektu**. Připraveno na to.
> 

---

## Část 1: Teorie

### Co je REST

**REST** (Representational State Transfer) je **architektonický styl** pro komunikaci klient-server přes HTTP. Každý zdroj (resource) má svou URL a operace s ním odpovídají HTTP metodám.

> **Klasický chyták**: REST není protokol, je to architektonický styl. HTTP je protokol, REST se postavil nad ním jako konvence "jak ho používat".
> 

### Klíčové vlastnosti

| Vlastnost | Co znamená |
| --- | --- |
| **Stateless** | Server si nepamatuje stav klienta. Každý request obsahuje vše potřebné (token, ID, atd.) |
| **Client-Server** | Klient a server jsou odděleny, komunikují přes HTTP |
| **Uniform Interface** | Jednotné konvence pro URL a metody |
| **Cacheable** | Odpovědi lze cachovat (GET typicky ano, POST ne) |
| **Layered System** | Klient nemusí vědět, jestli komunikuje přímo se serverem nebo přes proxy/CDN |
| **Resource-based** | Vše je "zdroj" identifikovaný URL |

> **Stateless je důležitý pojem**: server si **nic** nepamatuje mezi requesty. Proto se token posílá v hlavičce každého requestu, ne v session.
> 

---

### HTTP metody + CRUD

| HTTP Metoda | CRUD | Atribut v ASP.NET | Stav úspěchu | Vrátí tělo |
| --- | --- | --- | --- | --- |
| **GET** | Read | `[HttpGet]` | 200 OK | Ano |
| **POST** | Create | `[HttpPost]` | 201 Created | Ano (nový záznam) |
| **PUT** | Update (celý) | `[HttpPut("{id}")]` | 200 OK nebo 204 No Content | Volitelné |
| **PATCH** | Update (část) | `[HttpPatch("{id}")]` | 200 OK | Ano |
| **DELETE** | Delete | `[HttpDelete("{id}")]` | 204 No Content | Ne |

### Idempotence: důležitý pojem

Idempotentní operace = **můžeš ji volat víckrát se stejným výsledkem**.

| Metoda | Idempotentní | Bezpečná |
| --- | --- | --- |
| GET | Ano | Ano (nemění data) |
| POST | **Ne** (vytvoří nový záznam pokaždé) | Ne |
| PUT | Ano (nahradí stejně) | Ne |
| PATCH | Záleží na implementaci | Ne |
| DELETE | Ano (smazáno = smazáno) | Ne |

### Konvence URL endpointů

```
GET    /api/produkty          → seznam všech
GET    /api/produkty/{id}     → jeden záznam
POST   /api/produkty          → vytvoř nový
PUT    /api/produkty/{id}     → nahraď celý
PATCH  /api/produkty/{id}     → uprav část
DELETE /api/produkty/{id}     → smaž

GET    /api/produkty/{id}/recenze    → vnořený zdroj
GET    /api/produkty?skladem=true    → filtrace přes query string
```

---

### HTTP stavové kódy (nejdůležitější)

### 2xx: Success

| Kód | Název | Kdy |
| --- | --- | --- |
| **200** | OK | GET nebo PUT úspěšný |
| **201** | Created | POST: záznam vytvořen |
| **204** | No Content | DELETE, nebo PUT bez těla odpovědi |

### 4xx: Client Error (chyba klienta)

| Kód | Název | Kdy |
| --- | --- | --- |
| **400** | Bad Request | Špatný request (chybí pole, špatný formát) |
| **401** | Unauthorized | Není přihlášen (žádný token) |
| **403** | Forbidden | Přihlášen, ale nemá oprávnění |
| **404** | Not Found | Záznam neexistuje |
| **409** | Conflict | Konflikt (duplicitní email atd.) |
| **422** | Unprocessable Entity | Validace selhala |

### 5xx: Server Error (chyba serveru)

| Kód | Název | Kdy |
| --- | --- | --- |
| **500** | Internal Server Error | Neošetřená výjimka v kódu |
| **502** | Bad Gateway | Proxy nedostala odpověď |
| **503** | Service Unavailable | Server přetížený nebo údržba |

> **Pamatuj si**: 4xx = něco udělal špatně **klient**, 5xx = něco udělal špatně **server**. Když máš 500, je to bug v tvém kódu.
> 

---

### Struktura projektu ASP.NET Web API

```
MujApi/
├── Controllers/
│   └── ProduktyController.cs    ← controllery (logika endpointů)
├── Models/
│   └── Produkt.cs               ← datové třídy
├── Services/                    ← business logika (volitelné)
│   └── ProduktyService.cs
├── Program.cs                   ← konfigurace, DI, middleware pipeline
└── MujApi.csproj                ← konfigurace projektu
```

### Vytvoření projektu

```bash
dotnet new webapi -n MujApi --no-openapi
cd MujApi
dotnet run
```

---

### Model

Jednoduchá POCO třída (Plain Old CLR Object):

```csharp
public class Produkt
{
    public int Id { get; set; }
    public string Nazev { get; set; } = "";
    public decimal Cena { get; set; }
    public int Skladem { get; set; }
}
```

ASP.NET automaticky serializuje/deserializuje do/z JSON díky `System.Text.Json`.

Z C# objektu:

```csharp
new Produkt { Id = 1, Nazev = "Notebook", Cena = 25000, Skladem = 5 }
```

Vznikne JSON:

```json
{
    "id": 1,
    "nazev": "Notebook",
    "cena": 25000,
    "skladem": 5
}
```

> Default jsou jména **camelCase** v JSONu (i když v C# jsou PascalCase). System.Text.Json to dělá automaticky.
> 

---

### Controller: základ

```csharp
using Microsoft.AspNetCore.Mvc;

[ApiController]                        // automatická validace modelu
[Route("api/[controller]")]            // URL = api/produkty
public class ProduktyController : ControllerBase
{
    // "databáze" v paměti (pro maturitu stačí)
    private static List<Produkt> _produkty = new()
    {
        new Produkt { Id = 1, Nazev = "Notebook", Cena = 25000, Skladem = 5 },
        new Produkt { Id = 2, Nazev = "Myš",      Cena = 350,   Skladem = 20 }
    };
}
```

### Klíčové atributy

| Atribut | Co dělá |
| --- | --- |
| `[ApiController]` | Zapne automatickou validaci, binding z body, ProblemDetails chyby |
| `[Route("api/[controller]")]` | URL prefix, `[controller]` se nahradí jménem třídy bez "Controller" |
| `[HttpGet]` | Mapuje na `GET /api/produkty` |
| `[HttpGet("{id}")]` | Mapuje na `GET /api/produkty/5` |
| `[HttpPost]` | Mapuje na `POST /api/produkty` |
| `[HttpPut("{id}")]` | Mapuje na `PUT /api/produkty/5` |
| `[HttpDelete("{id}")]` | Mapuje na `DELETE /api/produkty/5` |
| `[FromBody]` | Čte parametr z těla requestu |
| `[FromRoute]` | Čte parametr z URL (default pro `{id}`) |
| `[FromQuery]` | Čte parametr z query string (`?key=value`) |

### Co dělá `[ApiController]`

Šetří hromadu práce, zapne:

- **Automatickou validaci `ModelState`**: pokud model selže validací (např. chybí required pole), automaticky vrátí 400 Bad Request
- **Implicitní `[FromBody]`** pro komplexní typy (nemusí se psát)
- **Implicitní `[FromRoute]`** pro parametry odpovídající template
- **`ProblemDetails`** chybové odpovědi (standardní RFC 7807 formát)

Bez `[ApiController]` bys musel psát validaci ručně.

---

### GET: čtení dat

### GET všechny

```csharp
// GET /api/produkty
[HttpGet]
public ActionResult<List<Produkt>> GetAll()
{
    return Ok(_produkty);     // 200 OK + JSON
}
```

### GET podle ID

```csharp
// GET /api/produkty/1
[HttpGet("{id}")]
public ActionResult<Produkt> GetById(int id)
{
    var produkt = _produkty.FirstOrDefault(p => p.Id == id);
    if (produkt == null)
        return NotFound();        // 404
    return Ok(produkt);           // 200 + JSON
}
```

---

### POST: vytvoření záznamu

```csharp
// POST /api/produkty
// Tělo requestu: { "nazev": "Klávesnice", "cena": 800, "skladem": 10 }
[HttpPost]
public ActionResult<Produkt> Create([FromBody] Produkt novy)
{
    novy.Id = _produkty.Count > 0 ? _produkty.Max(p => p.Id) + 1 : 1;
    _produkty.Add(novy);

    // 201 Created + Location header (kde najít nový záznam)
    return CreatedAtAction(nameof(GetById), new { id = novy.Id }, novy);
}
```

> **`[FromBody]`**: čti data z těla HTTP requestu (JSON). S `[ApiController]` je **implicitní pro komplexní typy**, takže nemusíš psát.
> 

> **`CreatedAtAction`**: vrátí 201 Created plus Location header, který říká, **kde nový záznam najít** (typicky URL GET endpointu). Tohle je důležitý detail REST API.
> 

---

### PUT: nahrazení celého záznamu

```csharp
// PUT /api/produkty/1
// Tělo: { "nazev": "Notebook Pro", "cena": 30000, "skladem": 3 }
[HttpPut("{id}")]
public IActionResult Update(int id, [FromBody] Produkt updated)
{
    var index = _produkty.FindIndex(p => p.Id == id);
    if (index == -1)
        return NotFound();           // 404

    updated.Id = id;                 // id z URL má přednost
    _produkty[index] = updated;

    return NoContent();              // 204: úspěch, bez těla
}
```

> **Důležitý detail**: ID se bere z URL, ne z těla. Klient by neměl měnit ID přes PUT, jen ostatní pole.
> 

---

### DELETE: smazání

```csharp
// DELETE /api/produkty/1
[HttpDelete("{id}")]
public IActionResult Delete(int id)
{
    var produkt = _produkty.FirstOrDefault(p => p.Id == id);
    if (produkt == null)
        return NotFound();           // 404

    _produkty.Remove(produkt);
    return NoContent();              // 204
}
```

---

### Návratové typy action metod

| Co vrátit | Metoda | Kód |
| --- | --- | --- |
| Data (objekt) | `Ok(data)` | 200 |
| Nový záznam | `CreatedAtAction(...)` | 201 |
| Prázdná odpověď | `NoContent()` | 204 |
| Nenalezeno | `NotFound()` | 404 |
| Špatný request | `BadRequest("zpráva")` | 400 |
| Vlastní kód | `StatusCode(418, "I'm a teapot")` | libovolný |

### `IActionResult` vs `ActionResult<T>`

```csharp
// IActionResult: flexibilní (různé typy odpovědí)
[HttpGet("{id}")]
public IActionResult GetById(int id) { /* může vrátit Ok, NotFound, atd. */ }

// ActionResult<T>: navíc TYPUJE výstup pro Swagger a klienty
[HttpGet("{id}")]
public ActionResult<Produkt> GetById(int id) { /* explicitně říká, že vrací Produkt */ }
```

Pro maturitu: `ActionResult<T>` u GET (vrací data), `IActionResult` u DELETE/PUT (vrací jen status).

---

### Routování: shrnutí

```csharp
[Route("api/[controller]")]   →  /api/produkty

[HttpGet]                     →  GET  /api/produkty
[HttpGet("{id}")]             →  GET  /api/produkty/5
[HttpGet("aktivni")]          →  GET  /api/produkty/aktivni    (pojmenovaná trasa)
[HttpGet("{id}/detail")]      →  GET  /api/produkty/5/detal
[HttpGet("kategorie/{kat}/produkty")]  →  GET  /api/produkty/kategorie/elektronika/produkty
```

### Vícenásobné routy

```csharp
[Route("api/[controller]")]
[Route("api/v1/[controller]")]      // dvě cesty na stejný controller
public class ProduktyController : ControllerBase { }
```

---

### `Program.cs`: registrace a pipeline

```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();          // přidá podporu controllerů
builder.Services.AddEndpointsApiExplorer(); // pro Swagger
builder.Services.AddSwaggerGen();           // Swagger UI

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();                     // dostupné na /swagger
}

app.MapControllers();                       // mapuje controller endpoints
app.Run();
```

### Co je Swagger

**Swagger** (dnes OpenAPI) je automaticky vygenerované interaktivní UI pro testování API. Najdeš ho na `/swagger`. Generuje se ze atributů controllerů.

Pro maturitu **ideální místo pro ověření funkčnosti** API: vidíš všechny endpointy, můžeš je zkusit kliknutím (jako Postman v prohlížeči).

---

### Dependency Injection (briefly)

V reálném projektu se logika z controlleru přesouvá do **services**, které se injektují přes konstruktor:

```csharp
public class ProduktyController : ControllerBase
{
    private readonly IProduktyService _service;

    public ProduktyController(IProduktyService service)   // DI
    {
        _service = service;
    }

    [HttpGet]
    public ActionResult<List<Produkt>> GetAll()
        => Ok(_service.GetAll());
}
```

Registrace v `Program.cs`:

```csharp
builder.Services.AddScoped<IProduktyService, ProduktyService>();
```

Lifetimy:

- `AddSingleton`: jedna instance pro celou aplikaci
- `AddScoped`: jedna instance na request
- `AddTransient`: nová instance při každém vyžádání

> Pro maturitu **stačí static List přímo v controlleru**. DI je bonus, který by se mohli zeptat.
> 

---

### Testování API

### Swagger (nejjednodušší)

Otevři `https://localhost:5001/swagger`, vyber endpoint, "Try it out", napiš parametry, "Execute".

### Postman / Bruno (desktop klient)

GUI klient pro REST API. Snadné posílání requestů s autentizací, history, kolekce.

### cURL (terminál)

```bash
# GET
curl https://localhost:5001/api/produkty

# POST
curl -X POST https://localhost:5001/api/produkty \
     -H "Content-Type: application/json" \
     -d '{"nazev":"Klávesnice","cena":800,"skladem":10}'

# PUT
curl -X PUT https://localhost:5001/api/produkty/1 \
     -H "Content-Type: application/json" \
     -d '{"nazev":"Notebook Pro","cena":30000,"skladem":3}'

# DELETE
curl -X DELETE https://localhost:5001/api/produkty/1
```

---

### Časté chyby

| Chyba | Důsledek | Řešení |
| --- | --- | --- |
| `[Route("api/produkty")]` místo `[controller]` | Hard-coded URL | Použít `[controller]` token |
| Zapomenutý `[ApiController]` | Žádná auto-validace | Vždy přidat |
| POST vrací `Ok(novy)` (200) | Špatný stavový kód | `CreatedAtAction` (201) |
| DELETE vrací `Ok()` (200) | Špatný stavový kód | `NoContent()` (204) |
| Použití `static List` v produkci | Sdílí se mezi requesty, ztratí se při restartu | Použít databázi (EF Core) |
| Chybí check existence v PUT/DELETE | 500 místo 404 | Vždy zkontrolovat `null` |
| Použití `string id` místo `int id` | Chybný typový binding | Definovat správný typ |
| Pojmenování endpointu velbloudem | Endpoint `/api/Produkty` (uppercase) | URL jsou case-sensitive, držet se camelCase |
| POST endpoint s ID v URL | Špatné REST | POST do `/api/resource`, ID generuje server |
| Smíchání `[FromBody]` a `[FromQuery]` | Konflikt | Komplexní typy z body, primitivní z query/route |

---

# Část 2: Praktická úloha

### Co může praktická úloha obsahovat

Podle leaku bude úloha typicky **doplnit endpoint do existujícího starter projektu**. To znamená:

1. **Otevřít** poskytnutý starter projekt
2. **Přečíst si** existující kód a model
3. **Spustit** projekt přes `dotnet run` a otevřít Swagger
4. **Doplnit chybějící endpointy** podle TODO komentářů
5. **Otestovat** každý endpoint ve Swaggeru po implementaci
6. **Případně** doplnit bonus endpoint

### Workflow při zadání

```
1. ls Controllers/                 → kolik tříd
2. Otevřít existující Controller   → vidět konvence
3. Otevřít Model                   → znát fieldy
4. Spustit dotnet run + /swagger
5. Začít s prvním TODO
6. Otestovat ve Swaggeru
7. Pokračovat dalšími TODOs
8. Bonus pokud zbude čas
```

### Příklad zadání: Knihovna API

Máš API pro správu knih (`KnihyController`). Projekt je z části hotový, máš model, router a 2 funkční endpointy (GET all a GET by id). Tvůj úkol: **doplnit chybějící endpointy** (POST, PUT, DELETE) přesně podle TODO komentářů + **bonus** endpoint pro dostupné knihy.

### Starter kód

### `Models/Kniha.cs`

```csharp
namespace KnihovnaApi.Models;

public class Kniha
{
    public int Id { get; set; }
    public string Nazev { get; set; } = "";
    public string Autor { get; set; } = "";
    public int RokVydani { get; set; }
    public bool Dostupna { get; set; } = true;
}
```

### `Controllers/KnihyController.cs` (starter, neúplný)

```csharp
using Microsoft.AspNetCore.Mvc;
using KnihovnaApi.Models;

namespace KnihovnaApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class KnihyController : ControllerBase
{
    private static List<Kniha> _knihy = new()
    {
        new Kniha { Id = 1, Nazev = "Stopařův průvodce galaxií", Autor = "Douglas Adams", RokVydani = 1979, Dostupna = true },
        new Kniha { Id = 2, Nazev = "1984", Autor = "George Orwell", RokVydani = 1949, Dostupna = false },
        new Kniha { Id = 3, Nazev = "Pán prstenů", Autor = "J. R. R. Tolkien", RokVydani = 1954, Dostupna = true }
    };

    // ✓ HOTOVO: GET všechny knihy
    [HttpGet]
    public ActionResult<List<Kniha>> GetAll()
    {
        return Ok(_knihy);
    }

    // ✓ HOTOVO: GET kniha podle ID
    [HttpGet("{id}")]
    public ActionResult<Kniha> GetById(int id)
    {
        var kniha = _knihy.FirstOrDefault(k => k.Id == id);
        if (kniha == null) return NotFound();
        return Ok(kniha);
    }

    // TODO 1: POST - přidat novou knihu
    //   Přijme Kniha z těla, přidělí Id, přidá do seznamu.
    //   Vrátí 201 Created s novou knihou.

    // TODO 2: PUT - aktualizovat celou knihu
    //   Přijme id z URL a Kniha z těla.
    //   Pokud Id neexistuje → 404. Jinak nahraď → 204.

    // TODO 3: DELETE - smazat knihu
    //   Přijme id z URL.
    //   Pokud Id neexistuje → 404. Jinak smaž → 204.

    // BONUS: GET pouze dostupné knihy
    //   GET /api/knihy/dostupne
    //   Vrátí seznam kde Dostupna == true.
}
```

### Řešení: kompletní `KnihyController.cs`

```csharp
using Microsoft.AspNetCore.Mvc;
using KnihovnaApi.Models;

namespace KnihovnaApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class KnihyController : ControllerBase
{
    private static List<Kniha> _knihy = new()
    {
        new Kniha { Id = 1, Nazev = "Stopařův průvodce galaxií", Autor = "Douglas Adams", RokVydani = 1979, Dostupna = true },
        new Kniha { Id = 2, Nazev = "1984", Autor = "George Orwell", RokVydani = 1949, Dostupna = false },
        new Kniha { Id = 3, Nazev = "Pán prstenů", Autor = "J. R. R. Tolkien", RokVydani = 1954, Dostupna = true }
    };

    // ===== GET všechny =====
    [HttpGet]
    public ActionResult<List<Kniha>> GetAll()
    {
        return Ok(_knihy);
    }

    // ===== GET podle ID =====
    [HttpGet("{id}")]
    public ActionResult<Kniha> GetById(int id)
    {
        var kniha = _knihy.FirstOrDefault(k => k.Id == id);
        if (kniha == null)
            return NotFound();
        return Ok(kniha);
    }

    // ===== TODO 1: POST nová kniha =====
    [HttpPost]
    public ActionResult<Kniha> Create([FromBody] Kniha nova)
    {
        // Přidělíme nové Id (max existující + 1, nebo 1 pokud prázdné)
        nova.Id = _knihy.Count > 0 ? _knihy.Max(k => k.Id) + 1 : 1;
        _knihy.Add(nova);

        // 201 Created + Location header
        return CreatedAtAction(nameof(GetById), new { id = nova.Id }, nova);
    }

    // ===== TODO 2: PUT aktualizace =====
    [HttpPut("{id}")]
    public IActionResult Update(int id, [FromBody] Kniha aktualizovana)
    {
        var index = _knihy.FindIndex(k => k.Id == id);
        if (index == -1)
            return NotFound();

        aktualizovana.Id = id;             // ID z URL má přednost
        _knihy[index] = aktualizovana;

        return NoContent();                // 204
    }

    // ===== TODO 3: DELETE =====
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var kniha = _knihy.FirstOrDefault(k => k.Id == id);
        if (kniha == null)
            return NotFound();

        _knihy.Remove(kniha);
        return NoContent();                // 204
    }

    // ===== BONUS: GET dostupné =====
    [HttpGet("dostupne")]
    public ActionResult<List<Kniha>> GetDostupne()
    {
        var dostupne = _knihy.Where(k => k.Dostupna).ToList();
        return Ok(dostupne);
    }
}
```

### `Program.cs` (beze změny)

```csharp
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();
app.UseSwagger();
app.UseSwaggerUI();
app.MapControllers();
app.Run();
```

### Testování ve Swaggeru

1. Spustit přes `dotnet run`
2. Otevřít `https://localhost:5001/swagger` v prohlížeči
3. **GET `/api/knihy`** → vrátí seznam 3 knih
4. **GET `/api/knihy/1`** → vrátí "Stopařův průvodce galaxií"
5. **GET `/api/knihy/999`** → vrátí 404 Not Found
6. **POST `/api/knihy`** s tělem:
→ vrátí 201 Created s knihou ID 4
    
    ```json
    { "nazev": "Hobit", "autor": "J. R. R. Tolkien", "rokVydani": 1937, "dostupna": true }
    ```
    
7. **PUT `/api/knihy/1`** s tělem:
→ vrátí 204 No Content
    
    ```json
    { "nazev": "Stopařův průvodce galaxií", "autor": "Douglas Adams", "rokVydani": 1979, "dostupna": false }
    ```
    
8. **DELETE `/api/knihy/2`** → vrátí 204 No Content
9. **GET `/api/knihy/dostupne`** → vrátí jen knihy s `Dostupna: true`

### Co se v řešení děje

**TODO 1 (POST)**: `[FromBody]` čte JSON z těla requestu (s `[ApiController]` implicitně). Vygenerujeme nové ID jako max existujícího + 1. Přidáme do listu. Vrátíme `CreatedAtAction`, což vytvoří 201 Created a do hlavičky `Location` dá URL nově vytvořené knihy (`/api/knihy/{novéId}`).

**TODO 2 (PUT)**: Najdeme index podle ID. Pokud neexistuje, 404. Jinak nastavíme ID z URL (klient by ho neměl měnit) a nahradíme záznam celý. Vrátíme 204 No Content (úspěch bez těla).

**TODO 3 (DELETE)**: Najdeme knihu. Neexistuje → 404. Existuje → odebereme a 204.

**Bonus (GET dostupné)**: Atribut `[HttpGet("dostupne")]` mapuje na `/api/knihy/dostupne`. LINQ `Where` filtruje, `ToList` materializuje. `Ok` vrátí 200 s JSON polem.

---

### Další bonusy

### Bonus A: Filtrace přes query string

```csharp
// GET /api/knihy/hledat?autor=Tolkien
[HttpGet("hledat")]
public ActionResult<List<Kniha>> Hledej([FromQuery] string autor)
{
    var vysledky = _knihy
        .Where(k => k.Autor.Contains(autor, StringComparison.OrdinalIgnoreCase))
        .ToList();
    return Ok(vysledky);
}
```

### Bonus B: Validace s ModelState

```csharp
public class Kniha
{
    public int Id { get; set; }

    [Required, MinLength(1)]
    public string Nazev { get; set; } = "";

    [Required]
    public string Autor { get; set; } = "";

    [Range(1000, 2100)]
    public int RokVydani { get; set; }

    public bool Dostupna { get; set; } = true;
}
```

S `[ApiController]` se validace provede automaticky a vrátí 400 Bad Request s detaily, pokud něco neprojde.

### Bonus C: PATCH endpoint (částečný update)

```csharp
public class KnihaUpdate
{
    public string? Nazev { get; set; }
    public string? Autor { get; set; }
    public bool? Dostupna { get; set; }
}

[HttpPatch("{id}")]
public IActionResult Patch(int id, [FromBody] KnihaUpdate update)
{
    var kniha = _knihy.FirstOrDefault(k => k.Id == id);
    if (kniha == null) return NotFound();

    if (update.Nazev != null) kniha.Nazev = update.Nazev;
    if (update.Autor != null) kniha.Autor = update.Autor;
    if (update.Dostupna != null) kniha.Dostupna = update.Dostupna.Value;

    return NoContent();
}
```

---

## Část 3: Tipy pro obhajobu

### Co u obhajoby říct

> *"V zadání jsem dostal hotový starter projekt s controllerem pro správu knih a doplnil chybějící endpointy podle TODO komentářů. POST endpoint přijímá knihu z těla requestu přes FromBody (s ApiController atributem implicitně), generuje nové ID a vrací CreatedAtAction s 201 Created a Location headerem. PUT najde knihu podle ID, vrátí 404 pokud neexistuje, jinak nahradí celý záznam a vrátí 204 No Content. DELETE pracuje obdobně. Bonus endpoint dostupne používá LINQ Where pro filtraci. Všechno jsem testoval ve Swaggeru, který je integrovaný v projektu."*
> 

### Klíčové pojmy pro teorii

| Pojem | Rychlá odpověď |
| --- | --- |
| **REST** | Architektonický styl pro komunikaci klient-server přes HTTP |
| **Stateless** | Server si nepamatuje stav klienta, každý request je samostatný |
| **CRUD** | Create, Read, Update, Delete (POST, GET, PUT/PATCH, DELETE) |
| **Idempotence** | Volání víckrát má stejný výsledek (GET, PUT, DELETE ano, POST ne) |
| **HTTP metody** | GET, POST, PUT, PATCH, DELETE |
| **HTTP status kódy** | 200 OK, 201 Created, 204 No Content, 400/404, 500 |
| **`[ApiController]`** | Auto-validace, FromBody binding, ProblemDetails |
| **`[Route("api/[controller]")]`** | URL prefix, `[controller]` nahradí jméno třídy |
| **`[FromBody]`** | Čte parametr z těla JSON requestu |
| **`[FromRoute]`, `[FromQuery]`** | Z URL, z query stringu |
| **`Ok()`** | 200 OK + data |
| **`CreatedAtAction()`** | 201 Created + Location header |
| **`NoContent()`** | 204 (úspěch bez těla) |
| **`NotFound()`** | 404 |
| **`BadRequest()`** | 400 |
| **`ActionResult<T>`** | Typovaný návratový typ pro Swagger |
| **`IActionResult`** | Netypovaný (flexibilní) |
| **Swagger / OpenAPI** | Auto-generated dokumentace + testovací UI |
| **DI (Dependency Injection)** | Vstřikování závislostí přes konstruktor |
| **Middleware pipeline** | Posloupnost zpracování requestu v Program.cs |

### Časté chytáky

| Otázka | Odpověď |
| --- | --- |
| *Co je REST?* | Architektonický styl pro komunikaci klient-server přes HTTP. Stateless, resource-based, používá HTTP metody pro CRUD. |
| *Rozdíl PUT a PATCH?* | PUT nahrazuje celý objekt, PATCH mění jen některá pole. PUT je idempotentní vždy, PATCH záleží na implementaci. |
| *Co dělá `[ApiController]`?* | Auto-validaci ModelState, implicit FromBody pro komplexní typy, ProblemDetails chybové odpovědi. |
| *Jaký status vrátí `NoContent`?* | 204 No Content (úspěch, ale nic v těle). |
| *Proč POST vrací 201 a ne 200?* | 200 znamená OK obecně, 201 explicitně "vytvořeno". REST konvence. Plus 201 dovoluje Location header. |
| *Co je `[FromBody]`?* | Čte parametr z těla HTTP requestu (JSON). Potřeba pro POST/PUT s objekty. |
| *Co znamená "REST je stateless"?* | Server si nepamatuje stav klienta mezi requesty. Každý request musí obsahovat vše potřebné (token v hlavičce, ne v session). |
| *Jak funguje `[Route("api/[controller]")]`?* | `[controller]` se nahradí jménem třídy bez sufixu "Controller". `ProduktyController` → `/api/produkty`. |
| *Co je idempotence?* | Volání operace víckrát má stejný výsledek. GET, PUT, DELETE jsou idempotentní. POST není. |
| *Co je Swagger?* | OpenAPI dokumentace plus interaktivní UI pro testování API. Auto-generated z atributů controlleru. |

### Časté chyby v praktické úloze

- POST vrací `Ok(novy)` (200) místo `CreatedAtAction` (201)
- DELETE vrací `Ok()` (200) místo `NoContent()` (204)
- Chybí check `null` v PUT/DELETE (500 Internal Server Error místo 404)
- Hardcoded route `[Route("api/knihy")]` místo `[controller]` tokenu
- ID v POST endpointu (klient by neměl posílat ID, generuje server)
- Použití `string` pro ID místo `int` (špatný binding)
- Zapomenutý `[ApiController]` (žádná auto-validace, žádný implicit FromBody)
- Špatný pořadí atributů u routy (`[HttpGet("dostupne")]` před `[HttpGet("{id}")]` může vést k matching dostupne jako ID parametr)
- Forgotten `[FromBody]` u PATCH (binduje špatně)
- Použití `IActionResult` všude (lépe `ActionResult<T>` pro typování Swageru)
- Generování ID bez `Max + 1` (např. `Count + 1`, problém po smazání)
- `_knihy.Remove(kniha)` pak `_knihy.Add(kniha)` v PUT (špatný způsob update, použít `[index] = ...`)
- Vrácení 200 OK z DELETE (REST konvence je 204)
- Změna ID v PUT z těla, ne z URL (klient může vytvořit nesoulad)