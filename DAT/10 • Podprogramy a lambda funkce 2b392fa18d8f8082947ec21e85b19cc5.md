# 10 • Podprogramy a lambda funkce

> Funkce, procedury, parametry, hodnotové vs referenční typy, rekurze, lambda, closure
> 

> **Formát:** 30 min praktická úloha, 15 min obhajoba + teorie. Praktika je v C# (.NET) a podle informací z minulých let obsahuje 4 části: faktoriál rekurze vs iterace s měřením, hodnotové vs referenční typy, lambda každý-s-každým, a closure.
> 

---

# Část 1: Teorie

### Co je podprogram

**Podprogram** je pojmenovaný blok kódu, který vykoná určitý úkol a lze ho **opakovaně volat** z různých míst programu. Synonyma: funkce, procedura, metoda (v OOP).

**Skládá se z:**

- **Vstupy**: parametry (formální), argumenty (skutečné při volání)
- **Tělo**: samotný kód, logika
- **Výstup**: návratová hodnota (`return`) - jen u funkcí

**Proč používat podprogramy:**

- **Snižují opakování** kódu (DRY: Don't Repeat Yourself)
- **Zpřehledňují kód** (každý úkol má jméno)
- Podporují **modulární návrh** (rozdělení velkého problému)
- Zjednodušují **testování a údržbu** (testuje se jednotka)

---

### Funkce vs procedura

|  | **Funkce** | **Procedura** |
| --- | --- | --- |
| **Návratová hodnota** | Ano (např. `int`, `string`) | Ne (`void`) |
| **Klíčové slovo** | Datový typ návratu | `void` |
| **Použití ve výrazu** | Ano (`x = Plus(2, 3)`) | Ne |
| **Typický účel** | Výpočet, transformace | Akce, výpis, modifikace |
| **Příklady** | `Math.Sqrt`, `int.Parse` | `Console.WriteLine` |

```csharp
// Funkce: vrací hodnotu
int Plus(int a, int b)
{
    return a + b;
}

int vysledek = Plus(3, 5);          // 8
Console.WriteLine(Plus(2, 67));     // 69, výsledek lze rovnou použít

// Procedura: provede akci, nevrací
void Vypis(string text)
{
    Console.WriteLine(text);
    // žádný return s hodnotou
}

Vypis("Ahoj");
```

> **Historicky**: v Pascalu byly `function` a `procedure` **oddělené klíčové slovo**. V C#/Java/Pythonu jsou procedury jen funkce s `void` návratem. Formálně všechny jsou "metody" (pokud jsou v třídě).
> 

### Výrazové tělo (expression-bodied)

Krátká syntaxe pro jednořádkové funkce:

```csharp
int Plus(int a, int b) => a + b;     // místo { return a + b; }
void Vypis(string s) => Console.WriteLine(s);
```

---

### Parametry

**Parametry** jsou vstupy, které funkce dostane při zavolání.

```csharp
void Pozdrav(string jmeno, int vek)
//          ^^^^^^^^^^^^^  ^^^^^^^^
//          parametry (FORMÁLNÍ, v definici)

Pozdrav("axo", 18);
//      ^^^^^  ^^
//      argumenty (SKUTEČNÉ, při volání)
```

### Druhy parametrů

**1. Poziční**: pořadí rozhoduje

```csharp
void Info(string jmeno, int vek) { ... }
Info("axo", 18);                          // jmeno=axo, vek=18
```

**2. Pojmenované**: určujeme jménem, pořadí je jedno

```csharp
Info(vek: 18, jmeno: "axo");              // funguje stejně
```

**3. Výchozí (default)**: pokud argument neuvedeš

```csharp
void Pozdrav(string jmeno, string osloveni = "Pane")
{
    Console.WriteLine($"{osloveni} {jmeno}");
}

Pozdrav("Novák");                         // "Pane Novák"
Pozdrav("Nováková", "Paní");              // "Paní Nováková"
```

**4. `params`**: proměnný počet argumentů

```csharp
int Soucet(params int[] cisla)
{
    int s = 0;
    foreach (var c in cisla) s += c;
    return s;
}

Soucet(1, 2, 3);                          // 6
Soucet(1, 2, 3, 4, 5);                    // 15
Soucet();                                 // 0
```

---

### Předávání parametrů: hodnotou vs odkazem

> **KLÍČOVÉ TÉMA pro otázku, často chyták.**
> 

### Pass-by-Value (předávání hodnotou): DEFAULT

Funkce dostane **kopii hodnoty**. Změna uvnitř funkce **neovlivní** originál.

```csharp
void Zmenit(int x)
{
    x = 99;                               // mění JEN lokální kopii
}

int a = 5;
Zmenit(a);
Console.WriteLine(a);                     // 5 (nezměněno!)
```

```
PŘED voláním:          BĚHEM funkce:           PO návratu:

   STACK                   STACK                   STACK
   ┌──────┐               ┌──────┐                 ┌──────┐
   │ a=5  │               │ a=5  │                 │ a=5  │  ← nezměněno
   └──────┘               │ x=99 │                 └──────┘
                          └──────┘
                          x je KOPIE
```

### Pass-by-Reference (`ref`): odkaz

Funkce dostane **odkaz na původní proměnnou v paměti**. Změna se projeví venku.

```csharp
void Zvys(ref int x)
{
    x = x + 10;                           // mění OBA: venkovní i lokální
}

int a = 5;
Zvys(ref a);                              // POZOR: ref i u volání
Console.WriteLine(a);                     // 15 (změněno!)
```

**Pravidla `ref`**:

- Proměnná musí být **inicializovaná** před voláním
- Před parametrem **i při volání** se píše `ref`
- Lze **číst i zapisovat** uvnitř

### `out`: jen výstup

Podobné jako `ref`, ale:

- Proměnná **NEMUSÍ být inicializovaná** před voláním
- Funkce **MUSÍ přiřadit** hodnotu před návratem
- Hodí se pro **vrácení více hodnot**

```csharp
void NajdiMinMax(int[] pole, out int min, out int max)
{
    min = pole[0];
    max = pole[0];
    foreach (var x in pole)
    {
        if (x < min) min = x;
        if (x > max) max = x;
    }
}

int[] cisla = { 3, 7, 1, 9, 4 };
NajdiMinMax(cisla, out int min, out int max);
Console.WriteLine($"Min={min}, Max={max}");    // Min=1, Max=9
```

> **Klasické použití**: `int.TryParse("67", out int cislo)` vrací `bool` (uspělo/nepodařilo) a přes `out` skutečné číslo.
> 

### `in`: read-only odkaz (performance optimalizace)

```csharp
void Spocti(in BigStruct s)
{
    // s.Field = 10;  // ❌ chyba, in je read-only
    Console.WriteLine(s.Field);
}
```

Předá odkaz (žádné kopírování velké struktury), ale uvnitř se nesmí měnit.

### Srovnání všech čtyř

| Modifikátor | Inicializace před | Lze číst | Lze zapsat | Použití |
| --- | --- | --- | --- | --- |
| (žádný) | Ano | Ano | Ano (jen lokálně) | Default (kopie) |
| `ref` | **Ano** | Ano | Ano (i venku) | Vstup i výstup |
| `out` | **Ne** | (po přiřazení) | **Musí přiřadit** | Více výstupů |
| `in` | Ano | Ano | **Ne** | Optimalizace velkých structs |

### Pass-by-Name (historické, ALGOL 60)

Argument se "dosadí jako text" pokaždé, když je použit (jako makra). Dnes se nepoužívá, ale **dobré pro ústní zkoušku** zmínit jako historický koncept.

### Modernější alternativa: Tuple jako návratová hodnota

Místo `out` parametrů lze vrátit více hodnot přes tuple:

```csharp
(int min, int max) NajdiMinMax(int[] pole)
{
    int min = pole[0], max = pole[0];
    foreach (var x in pole)
    {
        if (x < min) min = x;
        if (x > max) max = x;
    }
    return (min, max);
}

// Volání s dekonstrukci
var (mn, mx) = NajdiMinMax(cisla);
Console.WriteLine($"Min={mn}, Max={mx}");
```

Čistší než `out`, doporučená moderní praxe.

---

### Hodnotové vs referenční typy

> **Klíčové pro otázku 2 v praktice.**
> 

V C# existují dvě skupiny typů:

| Hodnotové typy | Referenční typy |
| --- | --- |
| `int`, `long`, `double`, `float`, `bool`, `char` | `string`, pole (`int[]`) |
| `struct` (vlastní) | `class` (vlastní) |
| `enum` | `interface`, `delegate` |
| Žijí na **stack** (zásobníku) | Žijí na **heap** (haldě), proměnná drží odkaz |
| Kopírují se **hodnotou** | Kopírují se **odkazem** (referenci) |

### Demonstrace na poli (referenční typ)

```csharp
void Zmenit(int[] pole)
{
    pole[0] = 99;                         // mění objekt na heapu, projeví se venku!
}

int[] x = { 1, 2, 3 };
Zmenit(x);
Console.WriteLine(x[0]);                  // 99, i bez ref!
```

> **Pozor**: `int[]` se chová jako by byl `ref`, protože pole je referenční typ. To **není** "pass by reference", ale "pass reference by value": předáváš **kopii odkazu**, který ukazuje na **ten samý objekt** v paměti.
> 

### Struct vs class

```csharp
struct Bod  { public int X, Y; }
class BodC  { public int X, Y; }

// struct: kopie
Bod b1 = new() { X = 3, Y = 5 };
Bod b2 = b1;                              // KOPIE
b2.X = 99;
// b1.X == 3, b2.X == 99 (různé!)

// class: sdílená reference
BodC c1 = new() { X = 3, Y = 5 };
BodC c2 = c1;                             // ODKAZ na ten samý objekt
c2.X = 99;
// c1.X == 99, c2.X == 99 (stejné!)
```

```
struct (hodnotový typ):           class (referenční typ):

  STACK                              STACK              HEAP
  ┌──────┐                           ┌──────┐         ┌────────┐
  │ b1   │ X=3 Y=5                   │ c1   │────────▶│ X=3    │
  ├──────┤                           ├──────┤    ┌───▶│ Y=5    │
  │ b2   │ X=99 Y=5                  │ c2   │────┘    └────────┘
  └──────┘                           └──────┘
   (oba živé, oba                       (oba ukazují
    s vlastními daty)                    na ten samý objekt)
```

---

### Obor platnosti proměnné (Variable Scope)

**Scope** = oblast kódu, kde je proměnná viditelná a dostupná.

### Lokální proměnné

Existují jen uvnitř bloku (`{ }`), ve kterém vznikly.

```csharp
void Funkce()
{
    int lokalni = 10;                     // existuje JEN v této metodě
    Console.WriteLine(lokalni);
}

// Console.WriteLine(lokalni);            // CHYBA: venku neexistuje
```

### Blokový scope

Proměnné existují jen uvnitř svého `{ }`:

```csharp
void Demo()
{
    int x = 5;
    if (x > 0)
    {
        int y = 10;                       // viditelná jen v tomto if-bloku
        Console.WriteLine(x + y);
    }
    // Console.WriteLine(y);              // CHYBA: venku už neexistuje
}
```

### Vizualizace scope

```
┌─ TŘÍDA Program ───────────────────────────────────────────┐
│                                                            │
│   static int polni;     ← field třídy, viditelný všude    │
│                                                            │
│   ┌─ METODA Main ────────────────────────────────────┐    │
│   │                                                   │    │
│   │   int x = 5;        ← lokální, jen v Main        │    │
│   │                                                   │    │
│   │   ┌─ if (x > 0) { ─────────────────────────┐    │    │
│   │   │                                         │    │    │
│   │   │   int y = 10;    ← jen uvnitř if       │    │    │
│   │   │                                         │    │    │
│   │   └─────────────────────────────────────────┘    │    │
│   │                                                   │    │
│   │   // y už NENÍ dostupné                          │    │
│   └───────────────────────────────────────────────────┘    │
│                                                            │
│   ┌─ METODA Jina ────────────────────────────────────┐    │
│   │                                                   │    │
│   │   // x z Main NENÍ dostupné                      │    │
│   │   Console.WriteLine(polni);  ← OK, field          │    │
│   └───────────────────────────────────────────────────┘    │
└────────────────────────────────────────────────────────────┘
```

### Globální proměnné v C#?

C# **nemá** globální proměnné v klasickém smyslu (jako Python/JS). Místo nich:

- **Static fields** v třídě: `public static int citac;`
- Singleton pattern (jedna instance třídy)

> **JavaScript zvláštnost: hoisting**: v JS se deklarace proměnných vynesou na začátek scope. Můžeš použít proměnnou před řádkem deklarace (bude `undefined`). V C# tohle není.
> 

> **Proč je scope důležitý**:
> 
> - Zabraňuje **konfliktům jmen** (různé `i` v různých for cyklech)
> - Zlepšuje **čitelnost** (vím odkud co je)
> - Snižuje **chybovost**: proměnné neunikají kam nemají

---

### Rekurze

**Rekurze** je technika, kdy funkce **volá sama sebe** k vyřešení menší verze problému.

### Dvě povinné součásti

1. **Terminační podmínka** (base case): kdy se zastavit
2. **Rekurzivní krok**: volá se s menším vstupem

### Klasický příklad: faktoriál

Matematická definice:

```
n! = n × (n-1) × (n-2) × ... × 1
0! = 1   (definice)
```

```csharp
long Faktorial(int n)
{
    if (n <= 1) return 1;                 // base case: konec rekurze
    return n * Faktorial(n - 1);          // rekurzivní krok
}
```

### Vizualizace volání `Faktorial(4)`

```
Faktorial(4)
  └─ 4 * Faktorial(3)
              └─ 3 * Faktorial(2)
                          └─ 2 * Faktorial(1)
                                      └─ return 1   ← base!
                          └─ return 2 * 1 = 2
              └─ return 3 * 2 = 6
  └─ return 4 * 6 = 24

Výsledek: 24
```

Každé volání zabere **frame na call stacku**. Pro `n = 1 000 000` by stack byl milion framů hluboký, **stack overflow**!

### Rekurze vs iterace

```csharp
// REKURZIVNĚ
long Faktorial(int n) => n <= 1 ? 1 : n * Faktorial(n - 1);

// ITERATIVNĚ
long FaktorialIter(int n)
{
    long vysledek = 1;
    for (int i = 2; i <= n; i++)
        vysledek *= i;
    return vysledek;
}
```

|  | **Rekurze** | **Iterace** |
| --- | --- | --- |
| **Čitelnost** | Elegantní pro stromové struktury | Někdy přímější |
| **Rychlost** | Pomalejší (volání metod) | Rychlejší |
| **Paměť** | Roste s hloubkou rekurze (stack) | Konstantní |
| **Stack overflow** | **Hrozí** při velkém n | Ne |
| **Vhodné pro** | Stromy, fraktály, divide-and-conquer | Lineární průchody |

> **Tail-call optimization**: některé jazyky (F#, Scheme, Haskell) umí "tail-call" rekurzi optimalizovat na cyklus (`return f(...)` na konci se reusne stack frame, žádný overflow). **C# tuhle optimalizaci nemá reliable**, JIT to **může** udělat, ale neudělá to konzistentně. Spoléhat na ni nelze.
> 

### Typické příklady rekurze

- Faktoriál
- Fibonacciho čísla
- Procházení stromu (DFS: depth-first search)
- Prohledávání adresářů (`Directory.GetFiles` rekurzivně)
- Quicksort, Mergesort
- Hanojské věže
- Procházení rekurzivních datových struktur (LinkedList, Tree, JSON)

### Pozor na exponenciální složitost

```csharp
long Fib(int n)
{
    if (n <= 1) return n;
    return Fib(n - 1) + Fib(n - 2);       // 2 volání → exponenciální!
}

Fib(50);                                  // trvá hodiny, 2^50 volání
```

Naivní Fibonacci je `O(2^n)`. Řešení: memoizace, dynamické programování, nebo iterace.

---

### Lambda funkce

**Lambda** je malá **anonymní** funkce definovaná inline (nemá jméno). Často nazývaná "arrow function".

### Obecný formát

```csharp
(parametry) => výraz                       // jednovýrazová
(parametry) => { příkazy; return v; }      // víceřádková
```

### Příklady

```csharp
// 1) Jeden parametr, jeden výraz
Func<int, int> druhaMocnina = x => x * x;
Console.WriteLine(druhaMocnina(5));        // 25

// 2) Dva parametry
Func<int, int, int> plus = (a, b) => a + b;
Console.WriteLine(plus(3, 4));             // 7

// 3) Žádný parametr
Func<string> ahoj = () => "Ahoj axo!";
Console.WriteLine(ahoj());

// 4) Víceřádková (závorky a return)
Func<int, string> popis = n =>
{
    if (n > 0) return "kladné";
    if (n < 0) return "záporné";
    return "nula";
};
```

---

### `Func`, `Action`, `Predicate`

C# nabízí **3 typové delegáty** (typový předpis pro lambdy):

| Typ | Vrací | Použití |
| --- | --- | --- |
| `Func<T1, ..., TResult>` | Hodnotu | Funkce s návratem |
| `Action<T1, ...>` | Nic (`void`) | Procedura |
| `Predicate<T>` | `bool` | Test/filtr |

```csharp
// Func: funkce
Func<int, int> mocnina = x => x * x;
int v = mocnina(4);                        // 16

// Action: procedura
Action<string> tisk = s => Console.WriteLine(s);
tisk("Ahoj");

// Predicate: testovací funkce (vrací bool)
Predicate<int> jeSude = x => x % 2 == 0;
bool b = jeSude(4);                        // true
```

### Delegát: obecný princip

**Delegát** je proměnná, která drží odkaz na funkci. Šablona/předpis, který říká, jakou signaturu funkce přijme.

```csharp
delegate int Operace(int a, int b);

Operace plus = (a, b) => a + b;
Operace minus = (a, b) => a - b;

Console.WriteLine(plus(3, 4));             // 7
Console.WriteLine(minus(10, 3));           // 7
```

`Func`, `Action`, `Predicate` jsou jen předem definované generické delegáty.

---

### Funkce vyššího řádu

**Funkce vyššího řádu** je funkce, která buď:

- **Přijímá jinou funkci** jako parametr, nebo
- **Vrací funkci** jako návratovou hodnotu

```csharp
// Funkce přijímající funkci jako parametr
T[] Filtruj<T>(T[] pole, Predicate<T> podminka)
{
    var l = new List<T>();
    foreach (var x in pole) if (podminka(x)) l.Add(x);
    return l.ToArray();
}

int[] cisla = { 1, 2, 3, 4, 5, 6, 7, 8 };
int[] suda = Filtruj(cisla, x => x % 2 == 0);

// Funkce vracející funkci
Func<int, int> NasobitelKonstantou(int k)
{
    return x => x * k;
}

var ztrojnasob = NasobitelKonstantou(3);
Console.WriteLine(ztrojnasob(67));         // 201
```

LINQ v C# je celý postavený na funkcích vyššího řádu (`Where`, `Select`, `Aggregate`...).

---

### Lambda + LINQ: typické použití

```csharp
int[] cisla = { 1, 2, 3, 4, 5, 6, 7, 8 };

// Where: filtr (lambda jako Predicate)
var suda = cisla.Where(x => x % 2 == 0);
// → 2, 4, 6, 8

// Select: transformace (lambda jako Func)
var mocniny = cisla.Select(x => x * x);
// → 1, 4, 9, 16, 25, 36, 49, 64

// OrderBy: řazení podle klíče
var serazeno = cisla.OrderByDescending(x => x);
// → 8, 7, 6, 5, 4, 3, 2, 1

// Sum, Count, Average: agregace
int soucet = cisla.Sum();                  // 36
int pocet = cisla.Count(x => x > 3);       // 5
double prumer = cisla.Average();           // 4.5

// SelectMany: kartézský součin / flatten
var dvojice = cisla.SelectMany(a => cisla.Select(b => (a, b)));
// → (1,1), (1,2), (1,3)... (8,8) = 64 dvojic
```

---

### Closure (uzávěr)

> **Klíčový koncept pro otázku 4 v praktice.**
> 

**Closure** je lambda (nebo anonymní funkce), která **zachycuje proměnné z okolního scope**. Lambda si "pamatuje prostředí, ve kterém vznikla".

```csharp
int prah = 10;
Func<int, bool> nadPrahem = x => x > prah;     // ZACHYTILA prah

Console.WriteLine(nadPrahem(15));              // True
Console.WriteLine(nadPrahem(5));               // False
```

### Klíčový detail: zachycuje **referenci, ne hodnotu**

```csharp
int multiplicita = 2;
Func<int, int> square = x => x * multiplicita;

Console.WriteLine(square(5));                  // 10 (5 * 2)

multiplicita = 3;                              // ZMĚNA proměnné venku
Console.WriteLine(square(5));                  // 15 (5 * 3)! Lambda vidí novou hodnotu
```

> Lambda si **drží odkaz** na proměnnou, ne kopii. Když se proměnná změní, lambda to "uvidí".
> 

### Klasická past: closure v `for` cyklu

```csharp
// ❌ Past: všechny akce vypíšou stejnou hodnotu
var akce = new List<Action>();
for (int i = 0; i < 3; i++)
{
    akce.Add(() => Console.WriteLine(i));      // zachycuje i (proměnnou, ne hodnotu)
}
foreach (var a in akce) a();                   // V C# 5+ vypíše 0, 1, 2 (každá iterace má vlastní i)
                                                // Ve starším C# by vypsalo 3, 3, 3
```

```csharp
// ✓ Řešení: lokální kopie
var akce = new List<Action>();
for (int i = 0; i < 3; i++)
{
    int lokalni = i;                           // kopie pro tenhle scope
    akce.Add(() => Console.WriteLine(lokalni));
}
// Vypíše 0, 1, 2
```

> **Historická zajímavost**: v C# 5 (2012) změnili chování `foreach` tak, aby proměnná měla scope **uvnitř** iterace. Před tím byla sdílená, což způsobovalo časté bugy.
> 

### Praktická použití closure

```csharp
// 1) Filtr s parametrem v LINQ
int prahCeny = 1000;
var drahe = produkty.Where(p => p.Cena > prahCeny);    // closure prahCeny

// 2) Callback s konfigurací
void NastavTimer(int sekundy, Action callback)
{
    // ... naplánuj callback
}
string zprava = "Hotovo!";
NastavTimer(10, () => Console.WriteLine(zprava));      // closure zprava

// 3) Event handler s kontextem
button.Click += (s, e) => Console.WriteLine($"Klik na {button.Name}");

// 4) Factory funkce (counter)
Func<int> VytvorCitac()
{
    int citac = 0;
    return () => ++citac;                              // closure citac
}
var c = VytvorCitac();
Console.WriteLine(c());                                // 1
Console.WriteLine(c());                                // 2
Console.WriteLine(c());                                // 3
```

---

### Přetížení (Overloading)

Více metod **stejného jména** s **různými signaturami** (typy/počet parametrů):

```csharp
int Plus(int a, int b) => a + b;
double Plus(double a, double b) => a + b;
string Plus(string a, string b) => a + b;              // konkatenace

Plus(1, 2);                                            // volá int verzi
Plus(1.5, 2.5);                                        // volá double verzi
Plus("Ahoj ", "axo");                                  // volá string verzi
```

> **Kompilátor podle typů argumentů** vybere správnou verzi. Pomáhá to vytvářet intuitivní API: jedna logika, různé typy.
> 

---

### Funkcionální programování

**Funkcionální paradigma** vychází z matematiky:

- Funkce jako **first-class citizen** (lze je předávat, vracet, ukládat)
- Důraz na **immutability** (neměnné hodnoty)
- **Žádné side effects** (funkce jen počítá, nemění globální stav)
- Funkce vyššího řádu, lambda, closure
- Rekurze místo cyklů

**Čistě funkcionální jazyky**: Haskell, F#, Scheme, Clojure, Erlang. Excel je taky funkcionální (vzorce).

**C# podporuje funkcionální styl**: LINQ, lambdy, expression-bodied members, immutable records (`record` od C# 9), pattern matching. Lze psát funkcionálně i v OOP jazyce.

---

### Časté chyby

| Chyba | Důsledek | Řešení |
| --- | --- | --- |
| Zapomenutý `return` ve funkci | Compile error | Doplnit `return` |
| Použití proměnné mimo její scope | Compile error | Přesunout deklaraci výš |
| Zapomenuté `ref` při volání | Compile error | `Funkce(ref a)` při volání |
| `out` parametr bez přiřazení uvnitř | Compile error | Funkce ho musí přiřadit |
| Stack overflow u rekurze | Crash | Zkontrolovat base case, použít iteraci pro velké n |
| Lambda zachytí měnící se proměnnou | Nečekané chování | Lokální kopie před lambdou |
| Nekonečná rekurze (chybí base case) | Stack overflow | Vždy mít terminační podmínku |
| Modifikace prvků `params` pole | Modifikuje original | `params int[]` je referenční |
| Spletení funkce a procedury | Funkce nic nevrací, není to funkce | Doplnit return nebo změnit na void |
| Nasamý JIT spoléhání na tail-call | Pro C# neplatí, overflow zůstane | Iterace pro hlubokou rekurzi |
| Static field místo lokální | Race condition v multithreaded kódu | Použít lokální nebo synchronizovat |

---

## Část 2: Praktická úloha

### Co může praktická úloha obsahovat

Podle informací z minulých let bude úloha v **C# (.NET)** s **4 částmi**:

1. **Faktoriál rekurzivně + iterativně + měření efektivity** (čas + paměť)
2. **Program1 s hodnotovými typy** vs **Program2 s referenčními typy**
3. **Lambda každý-s-každým** v listu (kartézský součin)
4. **Vysvětlit closure** na konkrétním kódu

### Setup

```bash
dotnet new console -n PodprogramyMaturita
cd PodprogramyMaturita
dotnet run
```

### Řešení: kompletní C# program

```csharp
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Numerics;                              // BigInteger pro velký faktoriál

namespace PodprogramyMaturita;

// ===== ÚLOHA 2: HODNOTOVÝ TYP =====
struct Bod
{
    public int X;
    public int Y;
}

// ===== ÚLOHA 2: REFERENČNÍ TYP =====
class BodClass
{
    public int X;
    public int Y;
}

class Program
{
    // ═══════════════════════════════════════════════════
    // ÚLOHA 1: FAKTORIÁL: REKURZE vs ITERACE + MĚŘENÍ
    // ═══════════════════════════════════════════════════

    // BigInteger umožňuje obrovská čísla (1M! má statisíce cifer)
    static BigInteger FaktorialRekurzivni(int n)
    {
        if (n <= 1) return 1;                       // base case
        return n * FaktorialRekurzivni(n - 1);      // rekurzivní krok
    }

    static BigInteger FaktorialIterativni(int n)
    {
        BigInteger vysledek = 1;
        for (int i = 2; i <= n; i++)
            vysledek *= i;
        return vysledek;
    }

    static void UlohaFaktorial()
    {
        Console.WriteLine("=== ÚLOHA 1: FAKTORIÁL: REKURZE vs ITERACE ===\n");

        // Malé n: oba zvládnou
        int n = 20;
        var sw = Stopwatch.StartNew();
        BigInteger r1 = FaktorialRekurzivni(n);
        sw.Stop();
        Console.WriteLine($"n={n} rekurzivně:  {r1} ({sw.ElapsedMilliseconds} ms)");

        sw.Restart();
        BigInteger i1 = FaktorialIterativni(n);
        sw.Stop();
        Console.WriteLine($"n={n} iterativně:  {i1} ({sw.ElapsedMilliseconds} ms)\n");

        // Velké n: iterace zvládne, rekurze spadne
        int velke = 1_000_000;

        // Měření paměti před a po
        long pamPred = GC.GetTotalMemory(true);
        sw.Restart();
        BigInteger v = FaktorialIterativni(velke);
        sw.Stop();
        long pamPo = GC.GetTotalMemory(false);

        // Vypiš prvních 20 cifer výsledku (celý je obrovský)
        string vStr = v.ToString();
        Console.WriteLine($"n={velke} iterativně: {vStr.Substring(0, 20)}... ({vStr.Length} cifer)");
        Console.WriteLine($"  Čas: {sw.ElapsedMilliseconds} ms");
        Console.WriteLine($"  Paměť: {(pamPo - pamPred) / 1024.0 / 1024.0:F2} MB\n");

        // Pokus o rekurzi: stack overflow
        Console.WriteLine($"Pokus o rekurzi pro n={velke}:");
        try
        {
            FaktorialRekurzivni(velke);
            Console.WriteLine("  Podařilo se?! (nečekané)");
        }
        catch (StackOverflowException)
        {
            // Tahle catch nezachytí StackOverflow v C#, je to non-recoverable!
            Console.WriteLine("  StackOverflowException (ale tento catch nepomůže)");
        }
        // Pozn.: V C# StackOverflowException nelze chytit normálním try-catch
        // od .NET 2.0+. Proces vždy spadne. Demonstrace by reálně shodila program.
        Console.WriteLine("  V realitě by program crashnul.\n");
    }

    // ═══════════════════════════════════════════════════
    // ÚLOHA 2: PROGRAM 1 (HODNOTOVÉ) vs PROGRAM 2 (REFERENČNÍ)
    // ═══════════════════════════════════════════════════

    static void ZmenInt(int x)
    {
        x = 99;                                     // mění JEN lokální kopii
    }

    static void Program1_HodnotoveTypy()
    {
        Console.WriteLine("=== PROGRAM 1: HODNOTOVÉ TYPY ===");

        // int demo
        int a = 5;
        Console.WriteLine($"  int před voláním: a = {a}");
        ZmenInt(a);
        Console.WriteLine($"  int po volání:    a = {a}  (nezměněno, kopie)\n");

        // struct demo
        Bod b1 = new() { X = 3, Y = 5 };
        Bod b2 = b1;                                // KOPIE!
        b2.X = 99;
        Console.WriteLine($"  Bod b1 původní:    X={b1.X}, Y={b1.Y}");
        Console.WriteLine($"  Bod b2 (po změně): X={b2.X}, Y={b2.Y}");
        Console.WriteLine($"  Bod b1 stále:      X={b1.X}, Y={b1.Y}  (struct = kopie)\n");
    }

    static void ZmenPole(int[] pole)
    {
        pole[0] = 99;                               // mění objekt na heapu, projeví se venku
    }

    static void Program2_ReferencniTypy()
    {
        Console.WriteLine("=== PROGRAM 2: REFERENČNÍ TYPY ===");

        // pole demo
        int[] pole = { 1, 2, 3 };
        Console.WriteLine($"  Pole před:  [{string.Join(", ", pole)}]");
        ZmenPole(pole);
        Console.WriteLine($"  Pole po:    [{string.Join(", ", pole)}]  (změněno, ref typ)\n");

        // class demo
        BodClass c1 = new() { X = 3, Y = 5 };
        BodClass c2 = c1;                           // sdílí REFERENCI!
        c2.X = 99;
        Console.WriteLine($"  BodClass c1 původní:    X={c1.X}");
        Console.WriteLine($"  BodClass c2 (po změně): X={c2.X}");
        Console.WriteLine($"  BodClass c1 stále:      X={c1.X}  (class = sdílená reference!)\n");
    }

    // ═══════════════════════════════════════════════════
    // ÚLOHA 3: LAMBDA KAŽDÝ S KAŽDÝM
    // ═══════════════════════════════════════════════════

    static void KazdySKazdym()
    {
        Console.WriteLine("=== ÚLOHA 3: KAŽDÝ S KAŽDÝM ===");

        List<int> list = new() { 1, 2, 3, 4 };

        // SelectMany: kartézský součin
        var dvojice = list.SelectMany(a => list.Select(b => (a, b)));

        // Vypiš jako tabulku
        foreach (var a in list)
        {
            foreach (var b in list)
            {
                Console.Write($"{a}×{b}={a * b,2}  ");
            }
            Console.WriteLine();
        }

        // BONUS: součet všech součinů
        int soucetSoucinu = list.SelectMany(a => list.Select(b => a * b)).Sum();
        Console.WriteLine($"\nSoučet všech součinů: {soucetSoucinu}\n");

        // Alternativní zápis (jen 1× každá dvojice, bez (b,a) duplicit)
        var unikatniDvojice = list.SelectMany((a, i) => list.Skip(i).Select(b => (a, b)));
        Console.WriteLine($"Unikátní dvojice: {string.Join(", ", unikatniDvojice)}\n");
    }

    // ═══════════════════════════════════════════════════
    // ÚLOHA 4: CLOSURE
    // ═══════════════════════════════════════════════════

    static void ClosureDemo()
    {
        Console.WriteLine("=== ÚLOHA 4: CLOSURE ===\n");

        // ZADANÝ KÓD
        int multiplicita = 2;
        Func<int, int> square = x => x * multiplicita;
        Console.WriteLine($"  multiplicita = 2");
        Console.WriteLine($"  square(5) = {square(5)}     // 10\n");

        // Změň multiplicitu a zavolej znova
        multiplicita = 3;
        Console.WriteLine($"  multiplicita změněno na 3");
        Console.WriteLine($"  square(5) = {square(5)}     // 15 (lambda vidí novou hodnotu!)\n");

        Console.WriteLine("  VYSVĚTLENÍ:");
        Console.WriteLine("  Lambda zachytila proměnnou 'multiplicita' jako referenci, ne kopii.");
        Console.WriteLine("  Toto se nazývá CLOSURE (uzávěr). Lambda si 'pamatuje prostředí',");
        Console.WriteLine("  ve kterém vznikla. Když se proměnná změní, lambda to vidí.\n");

        // BONUS: 2 reálná použití closure

        // 1) Filtr v LINQ s parametrem
        Console.WriteLine("  Použití 1: filtr v LINQ");
        int prah = 5;
        int[] cisla = { 1, 3, 5, 7, 9 };
        var nadPrahem = cisla.Where(x => x > prah).ToList();    // closure prah
        Console.WriteLine($"    Čísla nad {prah}: {string.Join(", ", nadPrahem)}\n");

        // 2) Factory funkce: counter (closure pro privátní stav)
        Console.WriteLine("  Použití 2: counter s privátním stavem");
        Func<int> citac = VytvorCitac();
        Console.WriteLine($"    citac() = {citac()}");          // 1
        Console.WriteLine($"    citac() = {citac()}");          // 2
        Console.WriteLine($"    citac() = {citac()}\n");        // 3
    }

    static Func<int> VytvorCitac()
    {
        int citac = 0;
        return () => ++citac;                       // closure: lambda si pamatuje citac
    }

    // ═══════════════════════════════════════════════════
    // MAIN
    // ═══════════════════════════════════════════════════

    static void Main()
    {
        UlohaFaktorial();
        Program1_HodnotoveTypy();
        Program2_ReferencniTypy();
        KazdySKazdym();
        ClosureDemo();
    }
}
```

### Co se v řešení děje

### Úloha 1: Faktoriál

- **Rekurzivní verze** používá klasický pattern: base case (`n <= 1`) + rekurzivní krok (`n * Faktorial(n-1)`)
- **Iterativní verze** používá `for` cyklus s akumulátorem
- **`BigInteger`** z `System.Numerics` umí libovolně velká čísla. Faktoriál 1M! má statisíce cifer, do `long` se nevejde (přetekl by už kolem 20!)
- **`Stopwatch`** měří čas v milisekundách: `Stopwatch.StartNew()`, `sw.Stop()`, `sw.ElapsedMilliseconds`
- **`GC.GetTotalMemory(true)`**: vynutí garbage collection a vrátí použitou paměť. Volání před a po měří spotřebu
- **`StackOverflowException`**: v C# **NELZE chytit** normálním `try-catch` (od .NET 2.0), proces se ukončí. To je důležité vědět pro obhajobu

### Úloha 2: Hodnotové vs referenční typy

- **`int`** (hodnotový): kopie na stack. Změna v metodě se neprojeví venku
- **`struct Bod`** (hodnotový): celý objekt na stack, kopie při přiřazení. `b2 = b1` udělá kopii dat
- **`int[]`** (referenční): pole je objekt na heap, proměnná drží odkaz. Předání do metody předává **kopii odkazu**, oba odkazy ukazují na stejné pole
- **`class BodClass`** (referenční): instance na heap. `c2 = c1` udělá kopii **odkazu**, ne dat. `c2.X = 99` mění objekt, na který oba ukazují

### Úloha 3: Lambda každý-s-každým

- **`SelectMany`** je LINQ operátor pro **flatten + map**. Místo seznamu seznamů vrátí jeden plochý seznam
- `list.SelectMany(a => list.Select(b => (a, b)))` projde každé `a`, pro každé `a` projde každé `b`, vytvoří tuple `(a, b)`. Výsledek: všechny dvojice = kartézský součin
- **Tuple `(a, b)`**: C# 7+ syntax, lze dekonstruovat: `var (a, b) = dvojice.First();`
- **Bonus**: součet součinů přes `.SelectMany(...).Sum()` v jednom řádku

### Úloha 4: Closure

- Lambda `x => x * multiplicita` **zachytí proměnnou** `multiplicita` ze zdrojového scope
- Po definici lambdy lze proměnnou změnit a lambda **vidí novou hodnotu** (zachytává referenci, ne hodnotu)
- **`VytvorCitac()`** vrátí lambdu, která má **přístup k lokální proměnné `citac`** i po skončení `VytvorCitac()`. Lambda "drží proměnnou naživu". Klasická factory pro privátní stav

---

### Výsledek běhu (přibližně)

```
=== ÚLOHA 1: FAKTORIÁL: REKURZE vs ITERACE ===

n=20 rekurzivně:  2432902008176640000 (0 ms)
n=20 iterativně:  2432902008176640000 (0 ms)

n=1000000 iterativně: 82639316883177070... (5565709 cifer)
  Čas: 4521 ms
  Paměť: 67.34 MB

Pokus o rekurzi pro n=1000000:
  V realitě by program crashnul.

=== PROGRAM 1: HODNOTOVÉ TYPY ===
  int před voláním: a = 5
  int po volání:    a = 5  (nezměněno, kopie)

  Bod b1 původní:    X=3, Y=5
  Bod b2 (po změně): X=99, Y=5
  Bod b1 stále:      X=3, Y=5  (struct = kopie)

=== PROGRAM 2: REFERENČNÍ TYPY ===
  Pole před:  [1, 2, 3]
  Pole po:    [99, 2, 3]  (změněno, ref typ)

  BodClass c1 původní:    X=3
  BodClass c2 (po změně): X=99
  BodClass c1 stále:      X=99  (class = sdílená reference!)

=== ÚLOHA 3: KAŽDÝ S KAŽDÝM ===
1×1= 1  1×2= 2  1×3= 3  1×4= 4
2×1= 2  2×2= 4  2×3= 6  2×4= 8
3×1= 3  3×2= 6  3×3= 9  3×4=12
4×1= 4  4×2= 8  4×3=12  4×4=16

Součet všech součinů: 100

Unikátní dvojice: (1, 1), (1, 2), (1, 3), (1, 4), (2, 2), (2, 3), (2, 4), (3, 3), (3, 4), (4, 4)

=== ÚLOHA 4: CLOSURE ===

  multiplicita = 2
  square(5) = 10     // 10

  multiplicita změněno na 3
  square(5) = 15     // 15 (lambda vidí novou hodnotu!)

  VYSVĚTLENÍ: ...

  Použití 1: filtr v LINQ
    Čísla nad 5: 7, 9

  Použití 2: counter s privátním stavem
    citac() = 1
    citac() = 2
    citac() = 3
```

---

## Část 3: Tipy pro obhajobu

### Co u obhajoby říct

> *"V zadání jsem řešil 4 úlohy. V první jsem porovnal rekurzivní a iterativní faktoriál. Rekurzivní volá sám sebe s base case n menší nebo rovno 1, iterativní používá for cyklus s akumulátorem. Pro velká n (milion) rekurzivní spadne na stack overflow, protože každé volání zabere frame na call stacku. Iterativní zvládne miliony bez problému. Použil jsem BigInteger ze System.Numerics, protože 1M! má přes pět milionů cifer, nevešlo by se to do long. Čas jsem měřil přes Stopwatch, paměť přes GC.GetTotalMemory. V druhé úloze jsem demonstroval rozdíl hodnotových a referenčních typů. Int a struct se kopírují hodnotou: změna kopie neovlivní original. Pole a class jsou referenční typy: leží na heapu, proměnná drží odkaz. Předání do metody předává kopii odkazu, takže metoda může modifikovat objekt skrz tu kopii a změna se projeví venku. Ve třetí úloze jsem použil LINQ SelectMany na kartézský součin: SelectMany projde každé a v listu a pro každé a vytvoří dvojice s každým b. Lambdy fungují jako Func a Predicate. Ve čtvrté úloze jsem vysvětlil closure: lambda zachytí proměnnou multiplicita z okolního scope, ne jako kopii, ale jako referenci. Když se proměnná venku změní, lambda to vidí. Closure umožňuje například factory funkce s privátním stavem: VytvorCitac vrátí lambdu, která uchovává lokální proměnnou citac naživu i po skončení VytvorCitac."*
> 

### Klíčové pojmy pro teorii

| Pojem | Rychlá odpověď |
| --- | --- |
| **Podprogram** | Pojmenovaný blok kódu, opakovaně volatelný |
| **Funkce** | Vrací hodnotu (přes `return`) |
| **Procedura** | Nic nevrací (`void`) |
| **Metoda** | Funkce/procedura v třídě (OOP) |
| **Parametr (formální)** | V definici metody |
| **Argument (skutečný)** | Při volání metody |
| **Pass-by-value** | Default, kopie hodnoty |
| **Pass-by-reference (`ref`)** | Odkaz, lze číst i měnit |
| **`out`** | Výstup, musí přiřadit |
| **`in`** | Read-only odkaz (optimalizace) |
| **`params`** | Variabilní počet argumentů |
| **Hodnotový typ** | `int`, `struct`, na stack |
| **Referenční typ** | `class`, pole, na heap |
| **Scope (obor platnosti)** | Kde proměnná existuje |
| **Rekurze** | Funkce volá sama sebe |
| **Base case** | Terminační podmínka rekurze |
| **Stack overflow** | Příliš hluboká rekurze |
| **Lambda** | Anonymní funkce inline |
| **Delegát** | Typ pro proměnnou držící funkci |
| **`Func<T, TResult>`** | Delegát pro funkci s návratem |
| **`Action<T>`** | Delegát pro proceduru |
| **`Predicate<T>`** | Delegát vracející `bool` |
| **Funkce vyššího řádu** | Přijímá nebo vrací funkci |
| **Closure** | Lambda zachycující proměnné z okolí |
| **Přetížení** | Více metod stejného jména, různé signatury |
| **LINQ** | Library s funkcemi vyššího řádu pro kolekce |
| **`BigInteger`** | Libovolně velká celá čísla |
| **`Stopwatch`** | Měření času |

### Časté chytáky

| Otázka | Odpověď |
| --- | --- |
| *Rozdíl funkce a procedura?* | Funkce vrací hodnotu (`return`), procedura nic (`void`). V C# obě "metody". |
| *Co je pass-by-value?* | Funkce dostane kopii hodnoty, změna uvnitř neovlivní original. Default v C#. |
| *Co dělá `ref`?* | Funkce dostane odkaz, lze číst i měnit. Změny se projeví venku. |
| `*ref` vs `out`?* | `ref` musí být inicializované před voláním. `out` ne, ale musí být přiřazené uvnitř. |
| *Proč `int[]` se chová jako by byl `ref`?* | Pole je referenční typ. Proměnná drží odkaz, předáváš kopii odkazu, oba ukazují na stejný objekt. |
| *Rozdíl `struct` a `class`?* | `struct` hodnotový (kopie na stack), `class` referenční (sdílený objekt na heap). |
| *Co je rekurze?* | Funkce volá sama sebe. Vyžaduje base case (terminační podmínka) a rekurzivní krok. |
| *Proč `Fib(50)` trvá hodiny?* | Naivní implementace je exponenciální `O(2^n)`. Řešení: memoizace nebo iterace. |
| *Co je lambda?* | Anonymní funkce inline, syntaxe `(parametry) => výraz` nebo `=> { ... }`. |
| `*Func` vs `Action` vs `Predicate`?* | Func vrací hodnotu, Action je void, Predicate vrací bool. |
| *Co je closure?* | Lambda zachytí proměnné z okolního scope. Pamatuje si "prostředí, ve kterém vznikla". |
| *Closure zachycuje hodnotu nebo referenci?* | **Referenci**. Změna proměnné venku se projeví uvnitř lambdy. |
| *Co je funkce vyššího řádu?* | Funkce, která přijímá funkci jako parametr nebo funkci vrací. |
| *Lze chytit `StackOverflowException`?* | V C# **ne** (od .NET 2.0), proces vždy spadne. |
| *Proč C# nemá tail-call optimalizaci?* | JIT to může, ale neudělá to spolehlivě. Pro hlubokou rekurzi spoléhat nelze, použij iteraci. |

### Časté chyby v praktické úloze

- Použití `long` místo `BigInteger` pro velký faktoriál (overflow už kolem 20!)
- Zapomenuté `using System.Numerics;` pro BigInteger
- `try-catch` na `StackOverflowException` (nelze chytit)
- `int[]` jako příklad hodnotového typu (je referenční!)
- Modifikace `struct` přes metodu bez `ref` (modifikuje kopii, nikdy original)
- Forgotten `Stopwatch.Restart()` mezi měřeními
- Měření paměti bez `GC.GetTotalMemory(true)` (true vynutí GC)
- Lambda zachytí měnící se `i` v `for` cyklu (klasická past)
- `SelectMany` vs `Select`: `Select` vrátí seznam seznamů, `SelectMany` plochý seznam
- Rekurze bez base case (nekonečná, stack overflow)
- Closure factory bez návratu lambdy (vrací jen hodnotu)
- Přístup k lokální proměnné z lambdy po skončení metody (předtím to byl bug, dnes closure to drží naživu)
- Forgotten `static` u helper metod v `Main` programu
- Použití `Func<int, int, int>` místo třeba `Func<int, int, double>` pro děl. nepřesnost
- Volání lambdy bez závorek: `square` vs `square(5)`

### )