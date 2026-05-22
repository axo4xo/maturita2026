# 8 • Datové typy a pole

> Elementární a strukturované typy, hodnotové vs referenční, enum, struct, class, 1D/2D/jagged pole
> 

> **Formát:** 30 min praktická úloha, 15 min obhajoba + teorie. Praktika je v **C# (.NET)** a podle zadání obsahuje demonstraci `enum`, `struct` vs `class`, 2D pole a jagged pole (typicky na příkladu rozvrhu hodin).
> 

---

# Část 1: Teorie

### Co je datový typ

**Datový typ** určuje:

- **Jaké hodnoty** může proměnná uchovávat (čísla, text, pravdivostní hodnota)
- **Jaké operace** lze nad ní provádět (sčítání, porovnání, indexování)
- **Kolik paměti** zabere (např. `int` = 4 bajty)
- **Jak se chová při předávání** (kopie hodnoty vs sdílení reference)
- **Kde žije v paměti** (stack vs heap)

```csharp
int vek = 18;              // 4 bajty, číselné operace, na stacku
string jmeno = "axo";      // referenční typ, na heapu
bool aktivni = true;       // 1 bit (technicky 1 bajt), logické operace
```

---

### Klasifikace datových typů

```
                    ┌─ Datové typy ─┐
                    │                │
        ┌───────────┴────┐    ┌──────┴──────────┐
        ▼                ▼    ▼                  ▼
  Elementární              Strukturované
  (jednoduché)             (složené)
  ─────────────            ──────────────
  int, double,             ┌─ Homogenní ─┐    ┌─ Heterogenní ─┐
  bool, char               │ stejný typ  │    │ různé typy    │
                           │             │    │               │
                           pole, string,    struct, class
                           enum            (záznamy)
```

### Elementární vs strukturované

**Elementární typy** nesou **jednu nedělitelnou hodnotu**:

- `int`, `long`, `short`, `byte` (celá čísla)
- `float`, `double`, `decimal` (desetinná)
- `bool` (true/false)
- `char` (jeden Unicode znak)

**Strukturované typy** se skládají z **více prvků**:

- **Homogenní** (stejnorodé): všechny prvky stejného typu
    - Pole (`int[]`, `string[]`)
    - `string` (vlastně pole `char`)
    - `enum` (sada konstant)
- **Heterogenní** (různorodé): prvky různého typu
    - `struct` (záznam s pojmenovanými poli)
    - `class` (objekt s daty + metodami)
    - `record` (immutable záznam)

---

### Hodnotové vs referenční typy: klíčový rozdíl

> **Zásadní téma, klasický maturitní chyták.**
> 

V C# (a v moderních jazycích obecně) existují dvě skupiny:

| **Hodnotové (value)** | **Referenční (reference)** |
| --- | --- |
| `int`, `long`, `double`, `float`, `bool`, `char` | `string`, pole (`int[]`) |
| `struct` (vlastní) | `class` (vlastní) |
| `enum` | `interface`, `delegate` |
| Žijí na **stack** (zásobník) | Žijí na **heap** (halda), proměnná drží odkaz |
| Kopírují se **hodnotou** | Kopírují se **odkazem** (referenci) |
| Default: `0`, `false`, prázdná struct | Default: `null` |
| Bez garbage collector | Spravované garbage collectorem |

### Vizualizace v paměti

```
HODNOTOVÝ TYP (int, struct, enum)        REFERENČNÍ TYP (class, array, string)

  ┌─ STACK ─────────┐                     ┌─ STACK ─────┐    ┌─ HEAP ──────┐
  │  a = 5          │                     │  a → ●──────┼───▶│ {1, 2, 3}   │
  │  b = 67         │                     │  b → ●──────┼─┐  └─────────────┘
  └─────────────────┘                     └─────────────┘ │
       celá hodnota                                        │  ┌─ HEAP ──────┐
       je přímo v proměnné                                 └─▶│ {4, 5, 6}   │
                                                              └─────────────┘
                                                       proměnná drží jen
                                                       odkaz (adresu)
```

### Co se stane při kopírování

```csharp
// HODNOTOVÝ TYP: vznikne nezávislá kopie
int a = 5;
int b = a;                                  // b = 5 (kopie)
b = 99;
Console.WriteLine(a);                       // 5 (nedotčené!)

// REFERENČNÍ TYP: sdílí se odkaz
int[] poleA = { 1, 2, 3 };
int[] poleB = poleA;                        // b ukazuje na STEJNÉ pole
poleB[0] = 99;
Console.WriteLine(poleA[0]);                // 99 (změna se projeví!)
```

> **Pravidlo**: když změna v jedné proměnné ovlivní druhou, máš **referenční typ**.
> 

### Default hodnoty

| Typ | Default |
| --- | --- |
| `int`, `long`, `double` | `0` |
| `bool` | `false` |
| `char` | `'\0'` (null char) |
| `struct` | Všechna pole na default |
| Všechny **referenční** typy | `null` |

```csharp
int x;                  // 0
bool b;                 // false
string s;               // null
int[] pole;             // null (samo pole, ne prvky)
int[] pole2 = new int[5];   // pole existuje, prvky všechny 0
```

---

### Boxing a unboxing (klasický chyták)

> Drobnost C#-specifická, dobře u zkoušejícího vypadá.
> 

**Boxing**: převod **hodnotového typu na referenční** (přes typ `object`). Vytvoří se objekt na heap.

```csharp
int hodnota = 42;
object zabaleno = hodnota;          // BOXING (kopie int → nový object na heap)
```

**Unboxing**: zpětný převod, kopie zpět na stack.

```csharp
int rozbaleno = (int)zabaleno;      // UNBOXING
```

> **Pozor na výkon**: boxing/unboxing **alokuje na heapu**, zpomaluje. Pro výkon kritické kódy se vyhýbej zbytečnému boxingu (např. použij `List<int>` místo `ArrayList`).
> 

---

### Heterogenní struktury: `struct`, `class`, `record`

### `struct`: hodnotový záznam

```csharp
struct Bod
{
    public int X;
    public int Y;
}

Bod p1 = new Bod { X = 3, Y = 5 };
Bod p2 = p1;                                // KOPIE!
p2.X = 99;
Console.WriteLine(p1.X);                    // 3 (původní nedotčen)
```

**Vlastnosti `struct`**:

- Hodnotový typ (na stacku)
- **Kopíruje se** při přiřazení
- **Nepodporuje dědičnost** (nelze `extends`)
- Vhodné pro **malá data** (typicky < 16 bajtů)
- Příklady: `Bod`, `Barva`, `Komplexní číslo`, `DateTime`

### `class`: referenční objekt

```csharp
class BodClass
{
    public int X;
    public int Y;
}

BodClass p1 = new BodClass { X = 3, Y = 5 };
BodClass p2 = p1;                           // SDÍLENÁ REFERENCE
p2.X = 99;
Console.WriteLine(p1.X);                    // 99 (změna se projeví!)
```

**Vlastnosti `class`**:

- Referenční typ (na heapu)
- **Sdílí referenci** při přiřazení
- **Podporuje dědičnost** (`class B : A`)
- Vhodné pro **komplexní objekty s chováním**
- Příklady: `Auto`, `Uživatel`, `Zaměstnanec`

### `record`: moderní C# (od C# 9, 2020)

```csharp
public record Osoba(string Jmeno, int Vek);

var o1 = new Osoba("axo", 18);
var o2 = o1 with { Vek = 19 };              // immutable kopie se změnou
Console.WriteLine(o1.Vek);                  // 18 (nezměněno)
Console.WriteLine(o2.Vek);                  // 19
```

**Vlastnosti `record`**:

- Default **referenční** (od C# 10 lze i `record struct`)
- **Immutable** (neměnné po vytvoření)
- **Value equality** (porovnává hodnoty, ne reference)
- `with` syntax pro tvorbu modifikované kopie
- Vhodné pro **DTO, hodnoty které se nemění**

### Srovnání

| Typ | Kategorie | Dědičnost | Mutabilita | Kdy použít |
| --- | --- | --- | --- | --- |
| `struct` | Hodnotový | Ne | Mutable | Malá data (Bod, Barva) |
| `class` | Referenční | Ano | Mutable | Komplexní objekty s chováním |
| `record` | Referenční (default) | Ano | **Immutable** | DTO, neměnná data |

### `readonly struct` (modernější přístup)

```csharp
readonly struct Bod
{
    public int X { get; }
    public int Y { get; }

    public Bod(int x, int y) { X = x; Y = y; }
}
```

`readonly struct` je **immutable** hodnotový typ. Brání náhodným modifikacím, kompilátor pomáhá s optimalizacemi.

---

### Výčtový typ: `enum`

**Enum** je sada **pojmenovaných konstant**. Pod kapotou jsou to čísla, ale v kódu se píše jméno.

### Proč enum

```csharp
// ❌ BEZ enum: "magická čísla"
if (stav == 2) { ... }                      // co znamená 2??
if (typ == 1) { ... }

// ✓ S enum: čitelné
if (stav == StavObjednavky.Odeslano) { ... }
if (typ == TypUctu.Premium) { ... }
```

### Definice a použití

```csharp
enum DenVTydnu
{
    Pondeli,                                // 0 (default)
    Utery,                                  // 1
    Streda,                                 // 2
    Ctvrtek,                                // 3
    Patek,                                  // 4
    Sobota,                                 // 5
    Nedele                                  // 6
}

DenVTydnu dnes = DenVTydnu.Streda;
Console.WriteLine(dnes);                    // "Streda"
Console.WriteLine((int)dnes);               // 2
```

### Vlastní hodnoty

```csharp
enum Znamka
{
    Vyborny = 1,
    Chvalitebny = 2,
    Dobry = 3,
    Dostatecny = 4,
    Nedostatecny = 5
}

Znamka z = Znamka.Vyborny;
int cislo = (int)z;                         // 1
```

> **K čemu vlastní hodnoty**: pokud enum reprezentuje **existující kódy** (např. HTTP status kódy 200, 404, 500), chceš mít konkrétní čísla, ne 0, 1, 2.
> 

### Konverze

```csharp
// enum → int
int n = (int)Znamka.Dobry;                  // 3

// int → enum
Znamka z = (Znamka)2;                       // Chvalitebny

// string → enum
Znamka z2 = Enum.Parse<Znamka>("Vyborny");

// Validation: existuje hodnota?
if (Enum.IsDefined(typeof(Znamka), 67))     // false
    ...
```

### Vlastnosti enum

- Zvyšuje **čitelnost kódu** (žádná magická čísla)
- **Bezpečnější**: kompilátor zkontroluje, že hodnota patří do množiny
- Hodí se pro **stavy** (StavObjednavky), **typy** (TypUctu), **volby** (Pohlavi)
- Není to třída, **nemá metody** (lze obejít přes extension methods)
- **Hodnotový typ** (na stacku)

### Enum v TypeScriptu (pro porovnání)

> Drobnost, pokud bys zmínil porovnání s jinými jazyky.
> 

TypeScript má `enum`, ale modernější přístup je **union typu literálů**:

```tsx
// Klasický TS enum (kompiluje na object)
enum Barva { Cervena, Zelena, Modra }

// Moderní union (jen typ, žádný runtime kód)
type Barva = "cervena" | "zelena" | "modra";
const b: Barva = "cervena";    // TS kontroluje, že je jedna z těchto
```

V Reactu a moderním TS se preferuje union typu literálů.

---

### Pole (Array)

**Pole** je uspořádaná kolekce prvků **stejného typu** s **pevnou velikostí**, přístup přes **index** (od 0).

### Vlastnosti

- **Pevná velikost** (po vytvoření už nelze měnit, "jakmile pole vyrobíš, nejde nafouknout")
- Všechny prvky **stejného typu** (homogenní)
- **Rychlý přístup** přes index: `O(1)`
- **Pomalé vkládání/mazání uprostřed**: `O(n)` (musí se posouvat ostatní prvky)
- Pro flexibilní velikost: `List<T>` (interně používá pole, automaticky zvětšuje)

### Efektivita operací

| Operace | Pole `T[]` | List `List<T>` |
| --- | --- | --- |
| Přístup k prvku `[i]` | `O(1)` | `O(1)` |
| Změna prvku | `O(1)` | `O(1)` |
| Přidání na konec | Nelze | `O(1)` amortizovaně |
| Přidání uprostřed | Nelze | `O(n)` |
| Smazání uprostřed | Nelze | `O(n)` |
| Hledání hodnoty | `O(n)` | `O(n)` |

> **List interně používá pole**, jen automaticky alokuje nové větší, když dochází místo. Princip "amortizovaně O(1)" pro Add.
> 

### Vizualizace 1D pole

```
   index:     0    1    2    3    4
             ┌────┬────┬────┬────┬────┐
   pole:     │ 10 │ 20 │ 30 │ 40 │ 50 │
             └────┴────┴────┴────┴────┘
   Length = 5
```

### Deklarace a inicializace

```csharp
// Prázdné pole o velikosti 5 (vyplněné defaultem: 0 pro int)
int[] pole = new int[5];

// S hodnotami
int[] cisla = { 10, 20, 30, 40, 50 };
int[] cisla2 = new int[] { 10, 20, 30 };

// Přístup
pole[0] = 100;                              // zápis
int x = pole[2];                            // čtení
int delka = pole.Length;                    // 5
```

### Iterace

```csharp
// Klasicky (s indexem)
for (int i = 0; i < cisla.Length; i++)
    Console.WriteLine($"pole[{i}] = {cisla[i]}");

// foreach (bez indexu)
foreach (int c in cisla)
    Console.WriteLine(c);
```

> **Pole je referenční typ!** I když obsahuje hodnotové typy (`int[]`), samotné pole žije na heap a proměnná drží odkaz. Důsledek: předáním pole do metody předáváš odkaz, změny se projeví venku.
> 

---

### Vícerozměrná pole: 2D, 3D

**Pravoúhlá tabulka** (matice): všechny řádky mají **stejnou délku**.

### Vizualizace 2D pole `int[3, 4]`

```
            sloupec: 0    1    2    3
                   ┌────┬────┬────┬────┐
   řádek 0:        │  1 │  2 │  3 │  4 │
                   ├────┼────┼────┼────┤
   řádek 1:        │  5 │  6 │  7 │  8 │
                   ├────┼────┼────┼────┤
   řádek 2:        │  9 │ 10 │ 11 │ 12 │
                   └────┴────┴────┴────┘
   matice[1, 2] = 7   ← přístup [řádek, sloupec]
```

### Deklarace

```csharp
// 2D pole 3x4 (3 řádky, 4 sloupce)
int[,] matice = new int[3, 4];

// S hodnotami
int[,] tabulka = {
    { 1, 2, 3, 4 },
    { 5, 6, 7, 8 },
    { 9, 10, 11, 12 }
};

// Přístup
tabulka[1, 2] = 99;                         // řádek 1, sloupec 2

// Rozměry
int radky = tabulka.GetLength(0);           // 3
int sloupce = tabulka.GetLength(1);         // 4
int celkem = tabulka.Length;                // 12 (všechny prvky)
```

### Iterace 2D pole

```csharp
for (int r = 0; r < tabulka.GetLength(0); r++)
{
    for (int s = 0; s < tabulka.GetLength(1); s++)
    {
        Console.Write(tabulka[r, s] + "\t");
    }
    Console.WriteLine();
}
```

### 3D pole

```csharp
int[,,] kostka = new int[3, 3, 3];          // x, y, z
kostka[0, 1, 2] = 5;
```

> **Použití 2D**: šachovnice, herní mřížka (piškvorky), tabulka pixelů, matice v matematice, mapa pro hru.
> 

---

### Jagged pole (zubaté, pole polí)

**Pole, jehož prvky jsou samotná pole**. Každé může mít **jinou délku**.

### Vizualizace `int[][] jagged`

```
   jagged[0] ──▶  ┌────┬────┐
                  │ 1  │ 2  │                              (2 prvky)
                  └────┴────┘

   jagged[1] ──▶  ┌────┬────┬────┬────┬────┐
                  │ 3  │ 4  │ 5  │ 6  │ 7  │              (5 prvků)
                  └────┴────┴────┴────┴────┘

   jagged[2] ──▶  ┌────┐
                  │ 8  │                                   (1 prvek)
                  └────┘

   jagged[3] ──▶  ┌────┬────┬────┐
                  │ 9  │ 10 │ 11 │                         (3 prvky)
                  └────┴────┴────┘
```

### Deklarace

```csharp
// Vytvoření vnějšího pole
int[][] jagged = new int[4][];

// Každý řádek samostatně
jagged[0] = new int[] { 1, 2 };
jagged[1] = new int[] { 3, 4, 5, 6, 7 };
jagged[2] = new int[] { 8 };
jagged[3] = new int[] { 9, 10, 11 };

// Přístup: DVA hranaté závorky!
int x = jagged[1][3];                       // 6
jagged[0][1] = 99;
```

### Iterace

```csharp
for (int i = 0; i < jagged.Length; i++)
{
    for (int j = 0; j < jagged[i].Length; j++)    // POZOR: jagged[i].Length
    {
        Console.Write(jagged[i][j] + " ");
    }
    Console.WriteLine();
}
```

> **Pozor na garbage collector**: jagged pole má **víc objektů na heapu** (vnější pole + každé vnitřní pole = víc alokací). 2D pole je naopak **jeden souvislý blok** v paměti, šetří GC práci a je rychlejší (cache-friendly).
> 

> **Použití jagged**: trojúhelníková matice (Pascalův trojúhelník), seznam objednávek (každá různý počet položek), kalendář (různé počty dnů v měsících), rozvrh hodin (různý počet hodin v různé dny).
> 

---

### 2D pole vs jagged: srovnání

```
   2D POLE (rectangular)              JAGGED POLE (pole polí)

   ┌────┬────┬────┬────┐              ┌────┬────┐
   │    │    │    │    │              │    │    │
   ├────┼────┼────┼────┤              ├────┼────┼────┼────┬────┐
   │    │    │    │    │              │    │    │    │    │    │
   ├────┼────┼────┼────┤              ├────┤
   │    │    │    │    │              │    │
   └────┴────┴────┴────┘              ├────┼────┼────┐
                                      │    │    │    │
   Všechny řádky stejně dlouhé        └────┴────┴────┘
   (3 × 4 = vždy 12 buněk)             "Zubaté": různé délky
```

| Vlastnost | **2D pole** `int[,]` | **Jagged** `int[][]` |
| --- | --- | --- |
| **Tvar** | Pravoúhlý, všechny řádky stejně | Nepravidelný, každý řádek jiná délka |
| **Syntaxe** | `arr[r, s]` (čárka) | `arr[r][s]` (dvě závorky) |
| **Paměť** | Souvislý blok | Oddělená pole (víc objektů na heap) |
| **Cache** | Cache-friendly (sousední prvky vedle sebe) | Cache-unfriendly (skoky v paměti) |
| **GC zátěž** | Nižší | Vyšší (víc alokací) |
| **Rychlost** | Mírně rychlejší | Pomalejší (extra dereference) |
| **Flexibilita** | Pevný počet sloupců | Každý řádek libovolná délka |
| **Inicializace** | `new int[3, 4]` jednou | `new int[3][]` + každé pole zvlášť |
| **Délka řádku** | `arr.GetLength(0/1)` | `arr.Length` / `arr[i].Length` |
| **Použití** | Matice, šachovnice, pixely | Rozvrh, kalendář, hierarchie |

> **Volba**: když jsou řádky stejně dlouhé, `int[,]`. Když ne, `int[][]`.
> 

---

### Bonus: `Span<T>` (moderní C#)

> Modern C# 7.2+ alternativa pro výkonný přístup k polím. Pro maturitu zmínit jen pokud máš čas.
> 

`Span<T>` je **odkaz na souvislý paměťový region** (pole, část pole, stack data) **bez alokace**.

```csharp
int[] pole = { 1, 2, 3, 4, 5, 6, 7, 8 };
Span<int> vyrez = pole.AsSpan(2, 4);        // {3, 4, 5, 6} bez kopírování!
vyrez[0] = 99;                              // mění původní pole
Console.WriteLine(pole[2]);                 // 99
```

Používá se v high-performance kódu (JSON parsing, networking). Nemusíš to zmiňovat, jen kdybys chtěl ukázat, že znáš ekosystém.

---

### Časté chyby

| Chyba | Důsledek | Řešení |
| --- | --- | --- |
| `IndexOutOfRangeException` | Sahám mimo pole | Kontrola `< Length` |
| Pole `null` vs prázdné | `NullReferenceException` | `pole != null && pole.Length > 0` |
| Zaměňuji `int[,]` a `int[][]` | Špatná syntaxe iterace | Pamatuj: čárka vs dvojité závorky |
| `enum` přiřazení čísla bez přetypování | Compile error | `Znamka z = (Znamka)1;` |
| `NullReferenceException` u jagged | Některý vnitřní řádek není inicializován | Před přístupem `jagged[i] = new int[...]` |
| `struct` "upravím" v kolekci | Modifikace vrátí kopii (foreach) | Použij `class` nebo přepiš celou strukturu |
| Změna pole v metodě se "nečekaně" projeví | Pole je referenční | Pokud chci kopii: `(int[])pole.Clone()` |
| Boxing v `ArrayList` | Zpomaluje při hodnotových typech | Použij `List<T>` |
| `string` srovnání přes `==` | Funguje v C#, ale specifický overload | OK v C#, pozor v Javě (tam `.equals()`) |
| Modifikace `foreach` proměnné | Compile error | Použij `for` |
| Velký `struct` (>16 bajtů) | Pomalé kopírování | Zvážit `class` nebo `readonly struct` |
| `int x; Console.WriteLine(x);` před inicializací | Lokální proměnná: compile error | Vždy inicializovat |

---

# Část 2: Praktická úloha

### Co může praktická úloha obsahovat

Podle informací z minulých let bude úloha v **C# (.NET)** a procvičí:

- **Enum** definice + použití
- **Struct vs class** demonstrace rozdílu (kopírování)
- **2D pole** (pravidelná mřížka)
- **Jagged pole** (různé délky řad)
- **Volba správné struktury** podle problému

### Příklad zadání: Rozvrh vyučovacích hodin

Vytvoř datovou strukturu pro rozvrh ve škole:

1. **Enum `TypVyuky`**: Prednaska, Cviceni, Laborator, Test
2. **Struct `VyucovaciHodinaStruct`**: Predmet, Typ, Ucitel
3. **Class `VyucovaciHodinaClass`** se stejnými vlastnostmi
4. **Demonstruj rozdíl struct vs class** v `Main()` (kopírování a změna)
5. **Implementuj rozvrh**:
    - **2D pole** `VyucovaciHodinaClass[,]` (5 dnů × 6 hodin)
    - **Jagged pole** `VyucovaciHodinaClass[][]` (každý den jiný počet)
6. **Naplň daty** Pondělí a Úterý
7. **Vypiš v tabulce** + zhodnoť, co je lepší a proč

### Setup

```bash
dotnet new console -n Rozvrh
cd Rozvrh
dotnet run
```

### Řešení: kompletní C# program

```csharp
using System;
using System.Collections.Generic;
using System.Linq;

namespace Rozvrh;

// ═══ ÚKOL 1: ENUM ═══
enum TypVyuky
{
    Prednaska,
    Cviceni,
    Laborator,
    Test
}

// ═══ ÚKOL 2: STRUCT ═══
struct VyucovaciHodinaStruct
{
    public string Predmet;
    public TypVyuky Typ;
    public string Ucitel;

    public override string ToString() => $"{Predmet} ({Typ}, {Ucitel})";
}

// ═══ ÚKOL 3: CLASS ═══
class VyucovaciHodinaClass
{
    public string Predmet { get; set; }
    public TypVyuky Typ { get; set; }
    public string Ucitel { get; set; }

    public override string ToString() => $"{Predmet}({Typ.ToString().Substring(0, 4)})";
}

class Program
{
    static readonly string[] DNY = { "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek" };

    static void Main()
    {
        DemonstraceStructVsClass();
        Rozvrh2D();
        RozvrhJagged();
        Zhodnoceni();

        // Bonusy
        BonusA_Record();
        BonusC_Statistika();
        BonusD_NejvicHodin();
    }

    // ═══ ÚKOL 4: STRUCT vs CLASS ═══
    static void DemonstraceStructVsClass()
    {
        Console.WriteLine("=== STRUCT (hodnotový typ) ===");
        var originalS = new VyucovaciHodinaStruct
        {
            Predmet = "MAT",
            Typ = TypVyuky.Prednaska,
            Ucitel = "Novák"
        };
        var kopieS = originalS;                 // KOPIE!
        kopieS.Predmet = "FYZ";                 // změna jen v kopii

        Console.WriteLine($"  Originál:  {originalS}");
        Console.WriteLine($"  Kopie:     {kopieS}");
        Console.WriteLine("  → STRUCT se kopíruje, originál NENÍ ovlivněn\n");

        Console.WriteLine("=== CLASS (referenční typ) ===");
        var originalC = new VyucovaciHodinaClass
        {
            Predmet = "MAT",
            Typ = TypVyuky.Prednaska,
            Ucitel = "Novák"
        };
        var kopieC = originalC;                 // SDÍLENÁ REFERENCE
        kopieC.Predmet = "FYZ";                 // změna se projeví u obou!

        Console.WriteLine($"  Originál:  {originalC}");
        Console.WriteLine($"  Kopie:     {kopieC}");
        Console.WriteLine("  → CLASS sdílí referenci, obě proměnné ukazují na stejný objekt\n");
    }

    // ═══ ÚKOL 5A: 2D POLE ═══
    static void Rozvrh2D()
    {
        Console.WriteLine("=== ROZVRH (2D pole 5×6) ===");

        // 5 dnů × 6 hodin
        var rozvrh = new VyucovaciHodinaClass[5, 6];

        // Pondělí
        rozvrh[0, 0] = new() { Predmet = "MAT", Typ = TypVyuky.Prednaska, Ucitel = "Novák" };
        rozvrh[0, 1] = new() { Predmet = "ČJ",  Typ = TypVyuky.Prednaska, Ucitel = "Svobodová" };
        rozvrh[0, 2] = new() { Predmet = "FYZ", Typ = TypVyuky.Laborator, Ucitel = "Dvořák" };
        rozvrh[0, 3] = new() { Predmet = "ANJ", Typ = TypVyuky.Cviceni,   Ucitel = "Černá" };
        rozvrh[0, 4] = new() { Predmet = "INF", Typ = TypVyuky.Cviceni,   Ucitel = "Novák" };
        // [0, 5] zůstane null

        // Úterý
        rozvrh[1, 0] = new() { Predmet = "ČJ",  Typ = TypVyuky.Prednaska, Ucitel = "Svobodová" };
        rozvrh[1, 1] = new() { Predmet = "MAT", Typ = TypVyuky.Test,      Ucitel = "Novák" };
        rozvrh[1, 2] = new() { Predmet = "DEJ", Typ = TypVyuky.Prednaska, Ucitel = "Hrubý" };
        rozvrh[1, 3] = new() { Predmet = "FYZ", Typ = TypVyuky.Prednaska, Ucitel = "Dvořák" };
        rozvrh[1, 4] = new() { Predmet = "ANJ", Typ = TypVyuky.Cviceni,   Ucitel = "Černá" };
        // [1, 5] zůstane null

        // Vypiš tabulku
        Console.Write("           ");
        for (int h = 0; h < rozvrh.GetLength(1); h++)
            Console.Write($"{h + 1}.h         ");
        Console.WriteLine();

        for (int d = 0; d < rozvrh.GetLength(0); d++)
        {
            if (rozvrh[d, 0] == null) continue;     // přeskoč prázdné dny

            Console.Write($"{DNY[d],-10} ");
            for (int h = 0; h < rozvrh.GetLength(1); h++)
            {
                if (rozvrh[d, h] != null)
                    Console.Write($"{rozvrh[d, h],-11} ");
                else
                    Console.Write("---         ");
            }
            Console.WriteLine();
        }
        Console.WriteLine();
    }

    // ═══ ÚKOL 5B: JAGGED POLE ═══
    static void RozvrhJagged()
    {
        Console.WriteLine("=== ROZVRH (jagged pole, různé délky) ===");

        var rozvrh = new VyucovaciHodinaClass[5][];

        // Pondělí: 5 hodin
        rozvrh[0] = new VyucovaciHodinaClass[]
        {
            new() { Predmet = "MAT", Typ = TypVyuky.Prednaska, Ucitel = "Novák" },
            new() { Predmet = "ČJ",  Typ = TypVyuky.Prednaska, Ucitel = "Svobodová" },
            new() { Predmet = "FYZ", Typ = TypVyuky.Laborator, Ucitel = "Dvořák" },
            new() { Predmet = "ANJ", Typ = TypVyuky.Cviceni,   Ucitel = "Černá" },
            new() { Predmet = "INF", Typ = TypVyuky.Cviceni,   Ucitel = "Novák" }
        };

        // Úterý: 6 hodin
        rozvrh[1] = new VyucovaciHodinaClass[]
        {
            new() { Predmet = "ČJ",  Typ = TypVyuky.Prednaska, Ucitel = "Svobodová" },
            new() { Predmet = "MAT", Typ = TypVyuky.Test,      Ucitel = "Novák" },
            new() { Predmet = "DEJ", Typ = TypVyuky.Prednaska, Ucitel = "Hrubý" },
            new() { Predmet = "FYZ", Typ = TypVyuky.Prednaska, Ucitel = "Dvořák" },
            new() { Predmet = "ANJ", Typ = TypVyuky.Cviceni,   Ucitel = "Černá" },
            new() { Predmet = "TEV", Typ = TypVyuky.Cviceni,   Ucitel = "Veselý" }
        };

        // Vypiš
        for (int d = 0; d < rozvrh.Length; d++)
        {
            if (rozvrh[d] == null) continue;        // přeskoč nedefinované dny

            Console.Write($"{DNY[d],-10} ({rozvrh[d].Length} hodin): ");
            for (int h = 0; h < rozvrh[d].Length; h++)
            {
                Console.Write($"{rozvrh[d][h].Predmet} ");
            }
            Console.WriteLine();
        }
        Console.WriteLine();
    }

    // ═══ ÚKOL 6: ZHODNOCENÍ ═══
    static void Zhodnoceni()
    {
        Console.WriteLine("=== ZHODNOCENÍ ===");
        Console.WriteLine("Pro reálný školní rozvrh je LEPŠÍ JAGGED POLE, protože:");
        Console.WriteLine("  - Dny mají různé počty hodin");
        Console.WriteLine("  - Nemusíme držet null pro prázdné pozice (úspora paměti)");
        Console.WriteLine("  - Snadnější přidání/ubrání hodiny v jednom dni");
        Console.WriteLine();
        Console.WriteLine("2D pole by bylo lepší pro PRAVIDELNOU strukturu, např.:");
        Console.WriteLine("  - Šachovnice (vždy 8×8)");
        Console.WriteLine("  - Pixely obrázku (vždy width × height)");
        Console.WriteLine("  - Matematická matice\n");
    }

    // ═══ BONUS A: RECORD ═══
    static void BonusA_Record()
    {
        Console.WriteLine("=== BONUS A: RECORD ===");

        // record je referenční, ale immutable + value equality
        var h1 = new VyucovaciHodinaRecord("MAT", TypVyuky.Prednaska, "Novák");
        var h2 = h1 with { Predmet = "FYZ" };   // immutable kopie se změnou

        Console.WriteLine($"  h1: {h1}");
        Console.WriteLine($"  h2: {h2}");
        Console.WriteLine($"  h1 == h2: {h1 == h2}");           // false (value equality)

        var h3 = new VyucovaciHodinaRecord("MAT", TypVyuky.Prednaska, "Novák");
        Console.WriteLine($"  h1 == h3: {h1 == h3}");           // true! stejné hodnoty
        Console.WriteLine("  → record má value equality, class má reference equality\n");
    }

    record VyucovaciHodinaRecord(string Predmet, TypVyuky Typ, string Ucitel);

    // ═══ BONUS C: STATISTIKA ═══
    static void BonusC_Statistika()
    {
        Console.WriteLine("=== BONUS C: STATISTIKA TYPŮ ===");

        // Použij jagged rozvrh (znovu vytvoř pro samostatnost)
        var rozvrh = VytvorRozvrhJagged();

        // Spočítej výskyty každého typu
        var stats = rozvrh
            .Where(d => d != null)
            .SelectMany(d => d)
            .GroupBy(h => h.Typ)
            .Select(g => new { Typ = g.Key, Pocet = g.Count() })
            .OrderByDescending(s => s.Pocet);

        foreach (var s in stats)
            Console.WriteLine($"  {s.Typ}: {s.Pocet}×");
        Console.WriteLine();
    }

    // ═══ BONUS D: UČITEL S NEJVÍC HODINAMI ═══
    static void BonusD_NejvicHodin()
    {
        Console.WriteLine("=== BONUS D: UČITEL S NEJVÍCE HODINAMI ===");

        var rozvrh = VytvorRozvrhJagged();

        // Dictionary pro počítání
        var pocty = new Dictionary<string, int>();
        foreach (var den in rozvrh.Where(d => d != null))
        {
            foreach (var hodina in den)
            {
                if (pocty.ContainsKey(hodina.Ucitel))
                    pocty[hodina.Ucitel]++;
                else
                    pocty[hodina.Ucitel] = 1;
            }
        }

        // Najdi maximum
        var nejvic = pocty.OrderByDescending(p => p.Value).First();
        Console.WriteLine($"  Učitel s nejvíce hodinami: {nejvic.Key} ({nejvic.Value}×)\n");
    }

    // Helper
    static VyucovaciHodinaClass[][] VytvorRozvrhJagged()
    {
        var r = new VyucovaciHodinaClass[5][];
        r[0] = new VyucovaciHodinaClass[]
        {
            new() { Predmet = "MAT", Typ = TypVyuky.Prednaska, Ucitel = "Novák" },
            new() { Predmet = "ČJ",  Typ = TypVyuky.Prednaska, Ucitel = "Svobodová" },
            new() { Predmet = "FYZ", Typ = TypVyuky.Laborator, Ucitel = "Dvořák" },
            new() { Predmet = "ANJ", Typ = TypVyuky.Cviceni,   Ucitel = "Černá" },
            new() { Predmet = "INF", Typ = TypVyuky.Cviceni,   Ucitel = "Novák" }
        };
        r[1] = new VyucovaciHodinaClass[]
        {
            new() { Predmet = "ČJ",  Typ = TypVyuky.Prednaska, Ucitel = "Svobodová" },
            new() { Predmet = "MAT", Typ = TypVyuky.Test,      Ucitel = "Novák" },
            new() { Predmet = "DEJ", Typ = TypVyuky.Prednaska, Ucitel = "Hrubý" },
            new() { Predmet = "FYZ", Typ = TypVyuky.Prednaska, Ucitel = "Dvořák" },
            new() { Predmet = "ANJ", Typ = TypVyuky.Cviceni,   Ucitel = "Černá" },
            new() { Predmet = "TEV", Typ = TypVyuky.Cviceni,   Ucitel = "Veselý" }
        };
        return r;
    }
}
```

### Co se v řešení děje

**Úkol 1-3 (enum, struct, class)**: tři typy se třemi různými chováními. `enum TypVyuky` ukládá typ hodiny. `struct VyucovaciHodinaStruct` se kopíruje hodnotou (pole jsou veřejná pro snadnost), `class VyucovaciHodinaClass` sdílí referenci.

**Úkol 4 (rozdíl struct vs class)**: stejný kód, jiné chování. Klíčový **demonstrace**: vytvořím instanci, zkopíruji do druhé proměnné, modifikuju druhou. U `struct` originál zůstane, u `class` se změní oba (jsou to stejný objekt).

**Úkol 5A (2D pole)**: pevná mřížka 5×6. Nedefinované hodiny jsou `null`. Iterace přes `GetLength(0)` (řádky) a `GetLength(1)` (sloupce). **Plýtvá paměť**: 30 buněk, ale jen 11 hodin reálně.

**Úkol 5B (jagged)**: každý den vlastní pole. `rozvrh[0].Length = 5`, `rozvrh[1].Length = 6`. **Šetří paměť**: jen tolik buněk, kolik hodin reálně je.

**Úkol 6 (zhodnocení)**: jagged je lepší pro nepravidelná data jako rozvrh. 2D pro pravidelné jako šachovnice, pixely, matice.

**Bonus A (record)**: `record VyucovaciHodinaRecord(...)` jednořádkový. `with` syntax pro immutable update. `==` porovnává hodnoty (value equality), ne reference.

**Bonus C (statistika)**: LINQ `SelectMany` + `GroupBy` + `Count` pro statistiku typů.

**Bonus D (nejvíc hodin)**: `Dictionary<string, int>` na sčítání, pak `OrderByDescending().First()` pro maximum.

---

## Část 3: Tipy pro obhajobu

### Co u obhajoby říct

> *"V zadání jsem definoval enum TypVyuky se 4 hodnotami pro typ vyučování. Enum zvyšuje čitelnost kódu, protože místo magických čísel jako 1, 2, 3 píšu Prednaska, Cviceni. Kompilátor také hlídá, že hodnota patří do množiny. Pak jsem definoval struct a class se stejnými vlastnostmi pro demonstraci rozdílu hodnotových a referenčních typů. Struct je hodnotový typ na stacku, při přiřazení vznikne kopie. Class je referenční na heapu, při přiřazení se sdílí odkaz. Demonstroval jsem to tak, že po vytvoření a zkopírování změním kopii: u struct zůstane originál nedotčen, u class se změní obě proměnné, protože ukazují na stejný objekt v paměti. Rozvrh jsem implementoval dvěma způsoby. 2D pole VyucovaciHodinaClass čárka má 5 řádků a 6 sloupců, ale šestá hodina je v obou dnech null. To je plýtvání pamětí. Jagged pole VyucovaciHodinaClass dvojité hranaté závorky umožňuje každému dni mít vlastní počet hodin, Pondělí 5 a Úterý 6. Pro reálný školní rozvrh je jagged lepší, protože dny mají různé počty hodin. 2D bych použil pro pravidelnou strukturu jako šachovnice nebo pixely obrázku, kde mám fixní rozměry. Bonus jsem ukázal record, který je referenční ale immutable s value equality, takže dvě recordy se stejnými hodnotami jsou si rovné, na rozdíl od class kde porovnání srovnává reference."*
> 

### Klíčové pojmy pro teorii

| Pojem | Rychlá odpověď |
| --- | --- |
| **Datový typ** | Určuje, jaké hodnoty, operace, kolik paměti, jak se chová |
| **Elementární typ** | Jedna nedělitelná hodnota (`int`, `bool`) |
| **Strukturovaný typ** | Skládá se z víc prvků (pole, struct) |
| **Homogenní** | Stejný typ prvků (pole, enum) |
| **Heterogenní** | Různé typy prvků (struct, class) |
| **Hodnotový typ** | Na stacku, kopie při přiřazení |
| **Referenční typ** | Na heapu, sdílí referenci |
| **Stack** | Rychlý, malý, lokální data, hodnotové typy |
| **Heap** | Velký, pomalejší, objekty, spravuje GC |
| **Garbage collector** | Uvolňuje nepoužitou paměť z heap |
| **Boxing** | Hodnotový → referenční (přes `object`) |
| **Unboxing** | Referenční → hodnotový zpět |
| **`struct`** | Vlastní hodnotový typ |
| **`class`** | Vlastní referenční typ s OOP |
| **`record`** | Immutable referenční typ s value equality |
| **`enum`** | Sada pojmenovaných konstant |
| **Pole** | Homogenní pevné velikosti, index od 0 |
| **2D pole** | Pravoúhlá matice (`int[,]`) |
| **Jagged pole** | Pole polí různé délky (`int[][]`) |
| **`Length`** | Počet prvků v poli |
| **`GetLength(n)`** | Délka v dimenzi `n` u 2D pole |
| **`IndexOutOfRangeException`** | Sahám mimo pole |
| **Value equality** | Srovnání hodnot (record) |
| **Reference equality** | Srovnání adres (class default) |
| **`readonly struct`** | Immutable hodnotový typ |
| **`List<T>`** | Dynamické pole (interně používá pole) |

### Časté chytáky

| Otázka | Odpověď |
| --- | --- |
| *Rozdíl hodnotový a referenční typ?* | Hodnotový žije na stacku, kopíruje se při přiřazení. Referenční na heapu, sdílí odkaz. |
| *Kde žije `int`?* | Stack (hodnotový typ). Pokud je field v třídě, žije na heap s tou třídou. |
| *Kde žije `string`?* | Heap (referenční typ). Proměnná drží odkaz. |
| *Proč enum místo int konstant?* | Čitelnost (žádná magická čísla), typová bezpečnost (kompilátor kontroluje hodnoty patří do enumu). |
| *Co se stane u `Bod p2 = p1` pro struct?* | Vznikne **kopie**, p1 a p2 jsou nezávislé. |
| *Co se stane u `Bod p2 = p1` pro class?* | p2 ukazuje na **stejný objekt** jako p1. Změna v p2 se projeví v p1. |
| *Co je boxing?* | Převod hodnotového typu na referenční (`object`). Alokuje na heapu, zpomaluje. |
| *Rozdíl `int[,]` a `int[][]`?* | `int[,]` 2D pole pravoúhlé. `int[][]` jagged, řady různé délky. |
| *Když je lepší 2D vs jagged?* | 2D pro pravidelné (šachovnice). Jagged pro různé délky (rozvrh, kalendář). |
| *Jak iterovat 2D pole?* | Vnořený for s `GetLength(0)` a `GetLength(1)`. |
| *Jak iterovat jagged?* | Vnořený for s `Length` a `arr[i].Length`. |
| *Default int?* | 0. |
| *Default string?* | null. |
| *Default bool?* | false. |
| *Default struct?* | Všechna pole na default (0, false, null). |
| *Lze struct dědit?* | Ne. Pro dědičnost je class. |
| *Rozdíl class a record?* | Record je immutable (default), s value equality a `with` syntax. Class je mutable, reference equality. |
| *Co je `Length` u pole?* | Počet všech prvků (u 2D matrix `rows × cols`). |
| *Proč jagged víc zatěžuje GC?* | Víc objektů na heap (vnější pole + každé vnitřní = víc alokací). |

### Časté chyby v praktické úloze

- Zaměňování `int[,]` a `int[][]` syntaxe (čárka vs dvojité závorky)
- Použití `arr.GetLength(1)` u jagged pole (jen `int[,]`, jagged má `arr[i].Length`)
- `null` u nedefinovaných položek 2D pole + `NullReferenceException` při zápisu
- Forgotten inicializace vnitřního pole jagged: `jagged[0].Length` crashne, pokud `jagged[0] == null`
- Modifikace `struct` v kolekci (foreach vrací kopii, změna se neuloží)
- Enum bez explicit hodnot, závislost na pořadí (přesun položky změní hodnoty)
- `IndexOutOfRangeException` pří nesprávných limitech ve for cyklu
- Pole jako parametr funkce + očekávání, že nepoškodím original (pole je referenční!)
- Cyklus `for (int i = 0; i <= pole.Length; i++)` (musí být `<`, ne `<=`)
- Boxing v `ArrayList` při použití hodnotových typů (lepší `List<int>`)
- `struct` s mnoha poli (>16 bajtů) zpomaluje kopírování
- Zapomenutí `new` u `class` instance (`BodClass p = new()` ne `BodClass p = ...`)
- `string` srovnání: v C# `==` funguje, v Javě by bylo `.equals()`