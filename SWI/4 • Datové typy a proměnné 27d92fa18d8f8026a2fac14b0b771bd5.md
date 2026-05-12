# 4 • Datové typy a proměnné

> Datové typy, proměnné, statická a dynamická typovost, deklarace, inicializace, reference, imutabilita, referenční a hodnotové, obor platnosti, přetypování
> 

---

## Základní pojmy

**Proměnná** je pojmenované místo v paměti počítače, do kterého lze uložit hodnotu. Skrz název se k té hodnotě dostaneš a můžeš ji měnit (pokud to typ a jazyk dovolí).

**Datový typ** definuje, **jaký druh dat** lze do proměnné uložit (celé číslo, text, objekt...), **jakou velikost** v paměti zabere a **jaké operace** s ní jsou povolené.

```csharp
int vek = 18;         // typ: int, název: vek, hodnota: 18
string jmeno = "axo"; // typ: string, název: jmeno, hodnota: "axo"
```

---

## Klasifikace programovacích jazyků

### Kompilované vs interpretované jazyky

|  | Kompilované | Interpretované |
| --- | --- | --- |
| **Co se stane** | Kód se přeloží do strojového kódu **před spuštěním** | Kód se čte řádek po řádku **za běhu** |
| **Rychlost běhu** | Rychlé (nativní instrukce CPU) | Pomalejší (interpret stojí mezi) |
| **Doba "buildu"** | Pomalá první kompilace | Žádná, spustíš a běží |
| **Chyby** | Mnohé chytne kompilátor předem | Často až za běhu |
| **Příklady** | C, C++, Rust, Go | Python, PHP, JavaScript |
| **Hybrid** | C#, Java (JIT kompilace v JVM/CLR) |  |

### JIT a moderní hybridy

**JIT** *(Just-In-Time)* kompilace je mezistupeň: kód se kompiluje za běhu do strojového kódu (s cachováním). Používají JVM (Java), CLR (.NET). Výsledek: skoro rychlost kompilovaného jazyka s pohodlím interpretovaného.

> V8 (JavaScript) je taky JIT compiler. Ale byl bych **HODNĚ** opatrnej tohle vůbec zmiňovat.
> 

### Příklad Babel, TypeScript

V JavaScript ekosystému je situace zajímavá:

- JS je **interpretovaný** v prohlížeči
- **TypeScript** se před spuštěním **transpiluje** do JS (přes tsc / Babel / SWC)
- TS přidává statické typování, které JS sám o sobě nemá

```tsx
// TypeScript (statické typování, transpiluje se na JS)
let vek: number = 18;
vek = "axo";  // ❌ chyba při kompilaci

// Po transpilaci (čistý JS, dynamicky typovaný)
let vek = 18;
vek = "axo";  // ✓ JS to dovolí
```

---

## Statická vs dynamická typovost

|  | Staticky typovaný | Dynamicky typovaný |
| --- | --- | --- |
| **Jazyk** | C#, Java, C++, Rust, TypeScript | JavaScript, Python, PHP, Ruby |
| **Typ je určen** | Při deklaraci (kompilací) | Za běhu, podle aktuální hodnoty |
| **Typ proměnné** | Pevný | Může se měnit |
| **Kontrola typů** | Při kompilaci | Až za běhu |
| **Kdy se chytí chyba** | Před spuštěním | Při spuštění daného řádku |

### Statické typování (C#)

```csharp
string jmeno = "axo";
jmeno = 67;       // ❌ chyba při kompilaci
                  // Cannot implicitly convert int to string
```

### Dynamické typování (JavaScript)

```jsx
let data = "axo";   // string
data = 67;          // ✓ teď je to number
data = true;        // ✓ teď bool
data = [1, 2, 3];   // ✓ teď array
```

V dynamicky typovaném jazyce si typy hlídáš sám (nebo testy). Kompilátor ti nezahlásí, že děláš nesmysl.

---

## Silné vs slabé typování (rozdílná osa)

| Pojem | Význam |
| --- | --- |
| **Silné typování** | Žádné implicitní konverze mezi nesouvisejícími typy. `"5" + 5` je chyba. |
| **Slabé typování** | Implicitní konverze povolené. `"5" + 5 = "55"` (v JS). |

```python
# Python: dynamicky + silně typovaný
"5" + 5  # ❌ TypeError: can only concatenate str to str
```

```jsx
// JavaScript: dynamicky + slabě typovaný
"5" + 5    // "55" (číslo se převede na string)
"5" - 5    // 0   (string se převede na číslo!)
true + 1   // 2
```

```csharp
// C#: staticky + silně typovaný
"5" + 5    // "55"  ← výjimka, protože + je v C# přetížen pro string
"5" - 5    // ❌ chyba při kompilaci
```

| Dimenze | Možnosti |
| --- | --- |
| **Statické / Dynamické** | Kdy se kontrolují typy (compile-time vs runtime) |
| **Silné / Slabé** | Jestli povoluje implicitní konverze |

---

## Type inference (odvozování typu)

Mnoho moderních staticky typovaných jazyků umí typ **odvodit z hodnoty**, takže ho nemusíš psát. Typ je pořád statický, jen ho neuvádíš explicitně.

```csharp
// C# s explicitním typem
int x = 67;
string name = "axo";

// C# s odvozením
var x = 67;          // x je odvozeno jako int
var name = "axo";    // name je odvozeno jako string
var list = new List<int>();  // List<int>
```

```tsx
// TypeScript
let x = 67;          // typ je odvozen jako number
let name = "axo";    // typ je odvozen jako string
```

> **Pozor**: `var` v JavaScriptu **není** type inference. JS je dynamicky typovaný a `var` je jen klíčové slovo pro deklaraci.
> 

---

## Základní datové typy (rekap)

| Typ | Příklad | Popis |
| --- | --- | --- |
| `int` (`int32`) | `67`, `-10` | Celé číslo, typicky 4 byty |
| `long` (`int64`) | `9999999999L` | Velké celé číslo, 8 bytů |
| `float` | `3.14f` | Reálné číslo, 4 byty, ~7 cifer přesnosti |
| `double` | `3.14159265358979` | Reálné číslo, 8 bytů, ~15 cifer přesnosti |
| `bool` (`boolean`) | `true`, `false` | Logická hodnota |
| `char` | `'A'` | Jeden znak |
| `string` | `"Hello"` | Sekvence znaků |
| `object` | `{ jmeno: "axo" }` | Kolekce klíč-hodnota |

> **JavaScript**: nemá `int` ani `float`, jen `Number` (IEEE 754). Pro velmi velká celá čísla má `BigInt` (od ES2020). TypeScript přidává statické typy, ale za běhu zůstává JS Number.
> 

---

## Deklarace a inicializace

| Pojem | Význam |
| --- | --- |
| **Deklarace** | Vytvoření proměnné a "rezervace" místa v paměti |
| **Inicializace** | První přiřazení hodnoty |
| **Přiřazení** | Jakákoli změna hodnoty |

```csharp
int vek;          // deklarace (vek je null nebo default value)
vek = 18;         // inicializace (první přiřazení)
vek = 19;         // přiřazení (změna)

int rok = 2026;   // deklarace + inicializace v jednom řádku
```

```jsx
let vek;          // deklarace, vek je undefined
vek = 18;         // inicializace

let rok = 2026;   // deklarace + inicializace
```

### Klíčová slova pro deklaraci v JS

| Klíčové slovo | Scope | Reassign? | Hoisting | Doporučení |
| --- | --- | --- | --- | --- |
| `var` | Function scope | Ano | Ano (initialized to `undefined`) | **Nepoužívat** (legacy) |
| `let` | Block scope | Ano | Ano (ale v TDZ do init) | Pro proměnlivé hodnoty |
| `const` | Block scope | Ne | Ano (TDZ) | Default volba |

```jsx
{
  var a = 1;      // viditelné mimo blok!
  let b = 2;      // viditelné jen v bloku
  const c = 3;    // viditelné jen v bloku, neměnitelné
}
console.log(a);   // 1
console.log(b);   // ❌ ReferenceError
```

V moderním JS: **vždy `const`** (default), `let` jen když opravdu reassignuješ. `var` je legacy.

---

## Hodnotové vs referenční typy

### Hodnotové typy (value types)

Proměnná obsahuje **přímo hodnotu**. Při přiřazení nebo předání do funkce se hodnota **kopíruje**.

Hodnotové typy: `int`, `float`, `bool`, `char`, `struct` (v C#).

```csharp
int a = 100;
int b = a;   // b je kopie hodnoty
b = 200;
// a = 100, b = 200  ← nezávislé proměnné
```

### Referenční typy (reference types)

Proměnná obsahuje **odkaz** (adresu paměti) na místo, kde jsou data uložena. Při přiřazení se kopíruje **jen odkaz**, ne data.

Referenční typy: `object`, `array`, `class`, většinou `string` (s nuancí).

```csharp
Person p1 = new Person { Name = "axo" };
Person p2 = p1;   // p2 ukazuje na STEJNÝ objekt jako p1

p2.Name = "hbgv";

// p1.Name je teď "hbgv" taky!
// Obě proměnné sdílí stejnou paměť.
```

### Vizualizace

```
Value type:
  ┌────┐    ┌────┐
  │ a  │    │ b  │
  │ 100│    │ 200│
  └────┘    └────┘
  (samostatné kopie)

Reference type:
  ┌────┐    ┌────┐
  │ p1 │    │ p2 │
  │ ●──┼───┐│ ●──┼───┐
  └────┘   ▽└────┘   ▽
        (oba ukazují na)
        ┌──────────────┐
        │ { Name: "..." }│
        └──────────────┘
```

### Praktická pravidla

- **Čísla, booleany**: kopírují se
- **Objekty, pole, funkce**: sdílí se přes referenci
- **String je zvláštní případ**: technicky reference, ale chová se jako hodnota (immutable, viz dál)

### Předávání do funkce

```csharp
void IncrementValue(int x) { x++; }
void IncrementName(Person p) { p.Name += "!"; }

int num = 5;
IncrementValue(num);
// num = 5  (kopie, original nezměněn)

Person osoba = new Person { Name = "axo" };
IncrementName(osoba);
// osoba.Name = "axo!"  (reference, modifikuje původní)
```

---

## Obor platnosti (Scope)

Definuje, **kde v kódu je proměnná viditelná**.

### Globální vs lokální

```jsx
const global = "viditelné všude";

function mojeFunkce() {
  const local = "jen tady";
  console.log(global);   // ✓ viditelné
  console.log(local);    // ✓ viditelné
}

console.log(global);    // ✓ viditelné
console.log(local);     // ❌ ReferenceError
```

### Block scope vs function scope

```jsx
function priklad() {
  if (true) {
    var a = 1;     // function scope (viditelné v celé funkci)
    let b = 2;     // block scope (jen v if bloku)
    const c = 3;   // block scope
  }
  console.log(a);  // ✓ 1
  console.log(b);  // ❌ b is not defined
  console.log(c);  // ❌ c is not defined
}
```

Block scope se chová předvídatelně, function scope vede ke skrytým bugům. Proto `let` a `const` v moderním JS.

### Lexical scoping a closures

Funkce "vidí" proměnné z místa, **kde byla definována** (ne kde se volá).

```jsx
function vytvorPocitadlo() {
  let pocet = 0;
  return function() {
    pocet++;
    return pocet;
  };
}

const counter = vytvorPocitadlo();
counter();  // 1
counter();  // 2
counter();  // 3
```

Vnitřní funkce má přístup k `pocet`, i když vnější funkce už skončila. Tomu se říká **closure**.

---

## Konstanta vs imutabilita

### Konstanta (`const`)

Chrání **přiřazení proměnné**. Identifikátor je trvale svázán s hodnotou nebo referencí. **Nelze ho přepsat**, ale obsah objektu změnit lze.

```jsx
const x = 7;
x = 4;   // ❌ TypeError: Assignment to constant variable

const osoba = { jmeno: "axo" };
osoba = { jmeno: "hbgv" };   // ❌ nelze přepsat referenci
osoba.jmeno = "hbgv";         // ✓ obsah objektu lze měnit
```

### Imutabilita

Vlastnost **samotné hodnoty**. Po vytvoření **nelze vnitřně modifikovat**. Pokud chceš změnu, vytvoříš novou instanci.

Příklady:

- `string` v Javě, C#, JS, Pythonu je immutable
- Records v C#, frozen objekty v JS
- Immutable data structures (Immutable.js)

```python
# String v Pythonu: immutable
s = "axo"
s.upper()        # vrátí "AXO" (nová instance)
print(s)         # stále "axo"  ← původní se nezměnil
```

```csharp
// C# záznam (record): imutabilní z principu
public record Person(string Name, int Age);

var p1 = new Person("axo", 18);
var p2 = p1 with { Age = 19 };  // vytvoří NOVOU instanci

// p1 = Person { Name = axo, Age = 18 }
// p2 = Person { Name = axo, Age = 19 }
```

### React states: imutabilita v praxi

```jsx
const [user, setUser] = useState({ name: "axo", age: 18 });

// ❌ Špatně: mutuje stav přímo
user.age = 19;
// React si nevšimne, stránka se nepřekreslí

// ✓ Správně: vytvoří nový objekt
setUser({ ...user, age: 19 });
// React detekuje změnu reference → re-render
```

### Klíčový rozdíl

|  | `const` (konstanta) | Imutabilita |
| --- | --- | --- |
| Chrání | **Přiřazení proměnné** | **Obsah hodnoty** |
| `const obj = {x: 1}; obj.x = 2;` | ✓ OK | ❌ porušení (kdyby obj byl immutable) |
| `obj = {x: 2};` | ❌ TypeError | Jen pokud je obj const |

---

## `null` a `undefined`

### V JavaScriptu

|  | `null` | `undefined` |
| --- | --- | --- |
| **Kdo to nastavuje** | Vývojář (záměrně) | JS automaticky (nepřiřazená proměnná) |
| **Význam** | "Vědomá nepřítomnost hodnoty" | "Hodnota nebyla nastavena" |
| **typeof** | `"object"` (historický bug!) | `"undefined"` |
| `null == undefined` | `true` | (loose equality) |
| `null === undefined` | `false` | (strict equality, různé typy) |

### V C#

C# má `null` (reference types), kladná čísla mají defaultně 0. Pro nullable hodnotové typy slouží `int?`:

```csharp
int x = null;       // ❌ chyba (int nemá null)
int? y = null;      // ✓ nullable int

string z = null;    // ✓ reference type může být null
```

---

## Přetypování (Type Casting / Conversion)

Změna hodnoty z jednoho typu na jiný. Existují tři způsoby.

### 1. Implicitní (automatické)

Jazyk provede sám, bez tvého zásahu. Tam, kde **nehrozí ztráta dat** (typicky menší → větší typ).

```csharp
int a = 67;
double b = a;     // ✓ automaticky, b = 67.0
long c = a;       // ✓ int se vejde do long
```

### 2. Explicitní (cast)

Programátor výslovně přikáže převod. **Hrozí ztráta dat,** programátor přebírá zodpovědnost.

```csharp
double a = 15.9;
int b = (int)a;       // b = 15 (desetinná část se zahodí)

long velke = 9999999999L;
int prepsane = (int)velke;  // overflow, číslo neplatné
```

```tsx
// TypeScript: type assertion
let data: unknown = "axo";
let str = data as string;
```

### 3. Konverze pomocí metod

Pro **nekompatibilní typy**, kde převod není triviální (string ↔ číslo). Volá se speciální metoda. **Může selhat** a vyhodit výjimku.

```csharp
string text = "67";
int cislo = int.Parse(text);         // ✓ cislo = 67

string blbost = "ahoj";
int chyba = int.Parse(blbost);       // ❌ FormatException

// Bezpečnější varianta
if (int.TryParse(text, out int vysledek)) {
    // úspěch, vysledek obsahuje hodnotu
} else {
    // neúspěch, vysledek = 0
}
```

```jsx
// JS přetypování
Number("67")      // 67
Number("axo")     // NaN
parseInt("67px")  // 67
Number(true)      // 1
String(67)        // "67"
Boolean(0)        // false
```

| Druh | Kdy | Riziko |
| --- | --- | --- |
| **Implicitní** | Menší → větší typ, bez ztráty | Žádné |
| **Explicitní** | Větší → menší typ | Ztráta dat (truncation, overflow) |
| **Konverze metodou** | Nekompatibilní typy | Výjimka při chybném vstupu |

Proto se v JS doporučuje:

- **Vždy `===`** (strict equality) místo `==`
- **Explicitní konverze** (`Number(x)`, `String(x)`, `Boolean(x)`)
- **TypeScript** pro statickou typovou kontrolu

---

## First-class funkce

> "i funkce je normální proměnná" se hodí rozšířit.
> 

V mnoha jazycích jsou **funkce hodnoty první třídy** *(first-class citizens)*: lze je přiřazovat do proměnných, předávat jako argumenty, vracet z funkcí.

```jsx
// Funkce uložená do proměnné
const pozdrav = function(name) {
  return `Ahoj, ${name}`;
};

// Funkce předaná jako argument
[1, 2, 3].map(x => x * 2);   // [2, 4, 6]

// Funkce vracející funkci
function vytvorPridavac(x) {
  return (y) => x + y;
}
const pridejPet = vytvorPridavac(5);
pridejPet(67);  // 72
```

```csharp
// C#: delegates a Func<>
Func<int, int> dvojnasobek = x => x * 2;
dvojnasobek(67);  // 134

int[] cisla = { 1, 2, 3 };
var dvojnasobky = cisla.Select(x => x * 2);
```

Tato vlastnost je základem **funkcionálního programování** a moderních callbacků, promisů, event handlerů.

---

## Garbage collection (krátce)

V jazycích s referenčními typy se musí někdo postarat o **uvolnění paměti**, když objekt už není potřeba.

| Přístup | Jazyky | Princip |
| --- | --- | --- |
| **Manuální management** | C, C++ | Programátor volá `malloc/free`. Riziko memory leak. |
| **Reference counting** | Python (částečně), Swift | Každý objekt má počítadlo referencí. Při dosažení 0 se uvolní. |
| **GC** | JavaScript, Java, C# | Garbage collector pravidelně prochází paměť a uvolňuje nedostupné objekty. |
| **Ownership** | Rust | Statická analýza, žádný GC. Pravidla vlastnictví v době kompilace. |

V moderních jazycích (JS, Python, Java, C#) se o paměť starat nemusíš. V C/C++ ano (a chyby v ní jsou klasický zdroj security bugů).

---

## Rychlý tahák

| Pojem | Klíčová fakta |
| --- | --- |
| **Proměnná** | Pojmenované místo v paměti |
| **Datový typ** | Určuje druh dat, velikost, povolené operace |
| **Deklarace** | Vytvoření proměnné |
| **Inicializace** | První přiřazení hodnoty |
| **Kompilovaný jazyk** | Před spuštěním do strojového kódu (C, Rust) |
| **Interpretovaný jazyk** | Za běhu interpret čte řádek po řádku (Python, JS) |
| **JIT** | Hybrid: kompilace za běhu s cache (Java, C#) |
| **Statické typování** | Typ fixní při deklaraci (C#, Java, TS) |
| **Dynamické typování** | Typ se mění za běhu (JS, Python) |
| **Silné typování** | Žádné implicitní konverze (Python, C#) |
| **Slabé typování** | Implicitní konverze (JS) |
| **Type inference** | Typ se odvodí (var, let, auto) |
| **Hodnotový typ** | Proměnná drží hodnotu, kopíruje se |
| **Referenční typ** | Proměnná drží odkaz, sdílí se |
| **Scope** | Kde je proměnná viditelná |
| **Block scope** | Mezi { }, let a const v JS |
| **Function scope** | V celé funkci, var v JS |
| **Closure** | Funkce drží přístup k vnějšímu scope |
| **const** | Chrání **přiřazení** (referenci) |
| **Imutabilita** | Chrání **obsah** hodnoty |
| **null vs undefined** | Záměrně prázdné vs nepřiřazené (JS) |
| **Implicitní cast** | Automatický, bezpečný (menší → větší) |
| **Explicitní cast** | Ruční, riziko ztráty dat |
| **Konverze metodou** | Pro nekompatibilní typy (Parse, Convert) |
| **Garbage collection** | Automatické uvolnění nepoužívané paměti |

---

## Tipy pro ústní zkoušku

### Jak začít

> *"Proměnná je pojmenované místo v paměti, do které lze uložit hodnotu. Datový typ určuje, jaký druh dat tam může být, jakou velikost zabere a jaké operace s ní jdou. Datové typy se dělí na základní (int, bool, char) a složené (object, array). Jazyky se liší v tom, jestli kontrolují typy při kompilaci (staticky) nebo za běhu (dynamicky), a jestli povolují implicitní konverze."*
> 

### Co komise typicky chce slyšet

- **Definice** proměnné a datového typu.
- **Deklarace vs inicializace**.
- **Statické vs dynamické** typování s příklady jazyků.
- **Hodnotový vs referenční typ** s konkrétní ukázkou (číslo vs objekt).
- **Scope**: globální vs lokální.
- **Konstanta vs imutabilita**: oblíbený chyták.
- **Tři druhy přetypování**: implicitní, explicitní, konverze.

### Doplňky, které komisi potěší

- **Silné vs slabé** typování jako jiná dimenze (`"5" + 5` v JS vs Python).
- **Type inference** s `var` v C#.
- **Closures** jako důsledek lexical scope.
- **First-class funkce** (funkce jako hodnota).
- **Garbage collection** jako automatická správa paměti.
- **`null` vs `undefined`** v JS (a `typeof null === "object"` bug).
- **JS coercion** a proč `===`.

### Časté chytáky

| Otázka | Odpověď |
| --- | --- |
| *Rozdíl const a imutabilita?* | `const` chrání přiřazení proměnné. Imutabilita chrání obsah hodnoty. `const obj = {x:1}; obj.x = 2;` projde, ale `obj = {}` ne. |
| *Statické vs silné typování?* | Statické: kdy se typy kontrolují (compile-time). Silné: jestli povolí implicitní konverze. JS je dynamické a slabé. Python je dynamický a silný. |
| *Co je closure?* | Funkce, která drží přístup k proměnným z vnějšího scope, i když ten už neexistuje. |
| *typeof null v JS?* | `"object"` (historický bug, vůle zachovat zpětnou kompatibilitu). |
| *Var vs let vs const v JS?* | var = function scope, legacy. let = block scope. const = block scope + nelze reassign. |
| *Když mám `Person p2 = p1`, co se zkopíruje?* | Reference (adresa), ne data. p1 a p2 sdílí stejný objekt v paměti. |
| *Co se stane při explicitním castu double na int?* | Desetinná část se zahodí (truncation), `(int)15.9 = 15`. |