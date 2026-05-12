# 3 • Reprezentace dat

> Jednotky, datum, číselné soustavy, znaky, základní a složené typy
> 

---

## Princip

Počítač je v zásadě hodně sofistikovaný kalkulátor pracující s **jedničkami a nulami**. Důvod je fyzikální: tranzistory mají dva stavy (proud teče / neteče, napětí vysoké / nízké), a binární logika je nejspolehlivější a nejlevnější způsob výpočtu.

Všechno, s čím počítač pracuje, je nakonec sekvence bitů: text, čísla, obrázky, videa, kód, paměť, datum, IP adresa. Co se s těmito bity stane, závisí na **interpretaci** (jakým způsobem se na ně díváme).

```
01000001  =  číslo 65
01000001  =  písmeno 'A'    (ASCII interpretace)
01000001  =  barva tmavě červená   (jeden kanál RGB)
```

Stejné bity, různé významy. Proto datové typy v jazycích nejsou jen formalita: říkají počítači, jak má bytes interpretovat.

---

## Bit, bajt a jednotky

### Základní jednotky

| Jednotka | Symbol | Hodnota |
| --- | --- | --- |
| **bit** | b | 0 nebo 1 (nejmenší jednotka) |
| **Bajt** | B | 8 bitů (256 možností) |
| **nibble** | (zřídka) | 4 bity (16 možností, jedna hex cifra) |
| **Word** | (zřídka) | Závisí na architektuře (32-bit / 64-bit) |

### Násobky: SI vs binární prefixy

| Symbol | Hodnota | Použití |
| --- | --- | --- |
| **KB** *(kilobajt)* | 1 000 B | Výrobci disků |
| **KiB** *(kibibajt)* | 1 024 B | OS, IT |
| **MB** | 1 000 000 B | Marketing |
| **MiB** | 1 048 576 B | RAM, soubory |
| **GB** | 10⁹ B | Disk |
| **GiB** | 2³⁰ B (cca 1.074 × 10⁹) | RAM, OS |
| **TB / TiB** | … |  |

Proto má "1 TB disk" reálně jen cca **931 GiB** podle Windows. Není to lež, jen použití SI místo binárních prefixů. Linux a macOS dnes typicky používají SI a počítají disk správně.

### Adresový prostor procesoru

| Architektura | Maximum RAM | Důvod |
| --- | --- | --- |
| 8-bit | 256 B | 2⁸ |
| 16-bit | 64 KB | 2¹⁶ |
| 32-bit | **4 GB** | 2³² |
| 64-bit | 16 EB (exabajtů) teoreticky | 2⁶⁴ |

32-bitové systémy nemohou efektivně využít víc než 4 GB RAM. Proto se kolem roku 2010 přešlo masově na 64-bit.

---

## Číselné soustavy

Soustava popisuje, **kolik symbolů** používáme a **jakou váhu** každá pozice má.

### Hlavní soustavy v informatice

| Soustava | Základ | Číslice | Číslo 67 | Prefix |
| --- | --- | --- | --- | --- |
| **Binární (dvojková)** | 2 | 0, 1 | `1000011` | `0b` |
| **Osmičková (oktalová)** | 8 | 0-7 | `103` | `0o` |
| **Desítková (decimální)** | 10 | 0-9 | `67` | (žádný) |
| **Šestnáctková (hexadecimální)** | 16 | 0-9, A-F | `43` | `0x` |

### Proč hex?

- **Binární je pro lidi dlouhé**: `01000011` je hůř čitelné než `43`.
- **1 hex cifra = přesně 4 bity** (nibble): snadný převod tam a zpět.
- **1 bajt = přesně 2 hex cifry**: kompaktní reprezentace.
- Používá se v **adresách paměti** (`0x7FFE0000`), **barvách** (`#FF5733`), **ASCII tabulkách**, **MAC adresách** (`AA:BB:CC:DD:EE:FF`).

### Historické soustavy (kulturní bonus)

| Soustava | Kde | Proč |
| --- | --- | --- |
| **Dvanáctková** | Hodiny, kalendář (12 měsíců) | Dělitelná 2, 3, 4, 6 (snadné dělení) |
| **Dvacítková** | Mayové, francouzština | Prsty na rukou i nohou |
| **Šedesátková** | Babylon, dodnes čas a úhly (60 minut, 360°) | Hodně dělitelů (1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30) |

---

### Mocniny 2, které stojí za pamatování

| 2ⁿ | Hodnota |
| --- | --- |
| 2⁰ | 1 |
| 2¹ | 2 |
| 2² | 4 |
| 2³ | 8 |
| 2⁴ | 16 |
| 2⁵ | 32 |
| 2⁶ | 64 |
| 2⁷ | 128 |
| 2⁸ | 256 |
| 2¹⁰ | 1024 (≈ kilo) |
| 2¹⁶ | 65 536 |
| 2³² | cca 4.3 miliardy |

---

## Reprezentace čísel

### Unsigned (bez znaménka) vs Signed (se znaménkem)

| 8-bit | Unsigned rozsah | Signed rozsah |
| --- | --- | --- |
| Min | 0 | -128 |
| Max | 255 | +127 |
| Počet hodnot | 256 | 256 |

Stejná velikost (256 hodnot), jen jiné rozdělení. **Unsigned** nemá záporná čísla, **signed** má polovinu pro záporná.

### Dvojkový doplněk (two's complement)

**Pravidlo:** první bit signed čísla je **znaménko** (0 = kladné, 1 = záporné).

**Jak udělat z čísla -X dvojkový doplněk:**

1. Zapiš X v binárce (s pevnou šířkou)
2. Invertuj všechny bity (`0 → 1`, `1 → 0`)
3. Přičti 1

Ověření: 5 + (-5) = 0. `0000 0101 + 1111 1011 = 1 0000 0000`. Bit na pozici 8 přeteče a zahazuje se, výsledek je 0.

### Integer overflow

Když překročíš maximum, číslo se "přetočí":

```
unsigned 8-bit: 255 + 1 = 0  (přeteklo)
signed 8-bit:   127 + 1 = -128  (přetočilo z max na min)
```

V některých jazycích (C, C#) overflow signed int je **undefined behavior**. V Pythonu jsou int neomezené (auto-promotion). V JavaScriptu se používají 64-bit floaty, takže velká celá čísla se hroutí na floating point.

### IEEE 754: reálná čísla

Claude ego-tripping. Tady se reálně hodí jen vědět, že to je OP datovej typ pro čísla a že to využívá hlavně JavaScript v prohlížeči. 

Příklad: 1.67e+4

### Slavný problém: `0.1 + 0.2 ≠ 0.3`

```jsx
0.1 + 0.2 === 0.3   // false!
0.1 + 0.2           // 0.30000000000000004
```

Důvod: `0.1` a `0.2` nelze v binární soustavě **přesně** vyjádřit (podobně jako `1/3 = 0.333...` v desítkové). Mantisa má jen 23 nebo 52 bitů, takže se to zaokrouhlí. Při sčítání se chyby kumulují.

**Důsledek:** **NIKDY** nepoužívej `float` pro peníze. Místo toho použij **integer** (cena v haléřích / centech) nebo **decimal** typ (Java `BigDecimal`, C# `decimal`, Python `Decimal`).

### Speciální hodnoty IEEE 754

| Hodnota | Co znamená |
| --- | --- |
| `+Infinity` | Přetečení nahoru (1.0 / 0.0) |
| `-Infinity` | Přetečení dolů (-1.0 / 0.0) |
| `NaN` *(Not a Number)* | Nedefinované (0.0 / 0.0, sqrt(-1)) |
| `+0` a `-0` | Existují obě nuly (rozdíl při dělení) |

---

## Znaky a kódování

### ASCII

- **7 bitů → 128 znaků** (0-127)
- Anglická abeceda, číslice, interpunkce, řídicí znaky
- `'A'` = 65, `'a'` = 97, `'0'` = 48, mezera = 32
- Rozdíl velkých a malých písmen: **přesně 32** (bit 5)

```
'A' = 0100 0001 = 65
'a' = 0110 0001 = 97       ← bit 5 je zapnutý
```

### ASCII Extended

- **8 bitů → 256 znaků**
- Druhých 128 znaků není standardizováno: existují různé "code pages" (Windows-1252, ISO 8859-1 "Latin-1", ISO 8859-2 "Latin-2" pro střední Evropu)
- Tady vzniká klasický problém “mojibake” (špatně dekódovaná diakritika)

### Unicode

ASCII nestačí pro čínštinu, arabštinu, devanagari, emoji. Unicode přiřazuje každému znaku **code point** (např. `U+0041` = `'A'`, `U+1F600` = 😀). Podporuje přes **1.1 milionu znaků**.

### UTF-8 (variabilní délka, dnes standard)

| Code point | Bytes | Schéma |
| --- | --- | --- |
| U+0000 - U+007F (ASCII) | **1 B** | `0xxxxxxx` |
| U+0080 - U+07FF | 2 B | `110xxxxx 10xxxxxx` |
| U+0800 - U+FFFF | 3 B | `1110xxxx 10xxxxxx 10xxxxxx` |
| U+10000 - U+10FFFF | 4 B | `11110xxx 10xxxxxx 10xxxxxx 10xxxxxx` |

> **Geniální vlastnost UTF-8:** je **zpětně kompatibilní s ASCII**. Anglický text v UTF-8 vypadá identicky jako v ASCII. Diakritika a non-ASCII znaky zaberou víc bytů.
> 

```
"axo"  → 1+1+1 = 3 bytes
"axé"  → 1+1+2 = 4 bytes (é potřebuje 2 B v UTF-8)
"axo😀" → 1+1+1+4 = 7 bytes (emoji potřebuje 4 B)
```

### Srovnání kódování

| Kódování | Velikost znaku | Použití |
| --- | --- | --- |
| ASCII | 1 B (7 bitů) | Legacy, anglický text |
| Windows-1252 | 1 B | Starší Windows |
| ISO 8859-2 | 1 B | Starší český web |
| **UTF-8** | **1-4 B** | **Dnes default všude (web, Linux, macOS)** |
| UTF-16 | 2 nebo 4 B | Windows interně, Java strings |
| UTF-32 | 4 B (fixní) | Jednoduché parsing, neefektivní |

## Datum a čas

### Unix timestamp

Počet **sekund od 1. ledna 1970 00:00:00 UTC** (epocha). Negativní hodnoty pro datumy před 1970.

```
1717996800  =  10. června 2024 00:00:00 UTC
1730000000  =  27. října 2024 03:33:20 UTC
```

### Y2K38 problem

32-bit signed integer Unix timestamp přeteče **19. ledna 2038 v 03:14:07 UTC**. Po přetečení se vrátí na rok 1901. Tomuto se říká **"Year 2038 problem"** nebo **Y2K38**. Dnes většina systémů používá 64-bit, tam přetečení nehrozí (cca 292 miliard let).

### Y2K (Y2K problem)

Klasická historka: starší systémy ukládaly rok na 2 znaky (`98` místo `1998`). Při přechodu z `99` na `00` byly obavy z chaosu (počítače si budou myslet, že je rok 1900). Na opravách v 90. letech se utratily miliardy.

### Formáty datumu

| Formát | Příklad | Použití |
| --- | --- | --- |
| **Unix timestamp** | `1717996800` | API, interní výpočty |
| **ISO 8601** | `2026-05-13T14:00:00Z` | API, mezinárodní standard, doporučený |
| **RFC 2822** | `Tue, 13 May 2026 14:00:00 +0000` | E-maily, HTTP hlavičky |
| **SQL DATETIME** | `2026-05-13 14:00:00` | Databáze |
| **EU formát** | `13.5.2026` nebo `13/05/2026` | Den.měsíc.rok |
| **US formát** | `5/13/2026` | Měsíc/den/rok (matoucí pro Evropany) |
| **Excel** | Sériové číslo s odvinutou epochou 1900-01-00 | Tabulky |

### Časová pásma a UTC

- **UTC** *(Coordinated Universal Time)*: referenční čas, dříve GMT.
- **Local time**: čas v daném regionu (s offsetem od UTC).
- **CET / CEST**: středoevropský čas (zima +1, léto +2).
- **Z** v ISO 8601 znamená UTC (`2026-05-13T14:00:00Z`).
- Offsetový zápis: `2026-05-13T16:00:00+02:00` (CEST).

---

## Základní (primitivní) datové typy

Stavební kameny všech proměnných. Přímo odpovídají operacím procesoru.

| Typ | Příklad | Velikost (typicky) | Rozsah |
| --- | --- | --- | --- |
| **Boolean** | `bool x = true;` | 1 B (1 bit logicky) | `true` / `false` |
| **Char** | `char c = 'A';` | 1 B | ASCII znak |
| **Byte** | `byte b = 67;` | 1 B | 0-255 (unsigned) / -128..127 (signed) |
| **Short** | `short s = 1000;` | 2 B | -32 768 až 32 767 |
| **Int** | `int x = 67;` | 4 B | cca ±2.1 miliardy |
| **Long** | `long l = 1L;` | 8 B | cca ±9.2 × 10¹⁸ |
| **Float** | `float f = 3.14f;` | 4 B | IEEE 754, ~7 desetinných cifer přesnosti |
| **Double** | `double d = 3.14;` | 8 B | IEEE 754, ~15 desetinných cifer přesnosti |
| **Pointer / Reference** | `int* p = &x;` | 4 nebo 8 B | Adresa v paměti |

> **Drobnost:** velikosti závisí na jazyce a platformě.
> 

### Pointer vs reference

|  | Pointer (C/C++) | Reference (Java, C#, Python) |
| --- | --- | --- |
| **Co je** | Proměnná s adresou | Skrytý odkaz na objekt |
| **Manipulace** | Lze měnit (`++`, aritmetika) | Imutabilní (kam ukazuje) |
| **Null** | Lze | V Javě/C# může být `null` |
| **Dereference** | Explicitní (`*p`, `p->x`) | Implicitní (`obj.x`) |
| **Bezpečnost** | Nebezpečné (segfault) | Bezpečné (NullPointerException) |

V moderních jazycích (Python, JavaScript) je téměř všechno **reference**, není potřeba o tom přemýšlet. Objekty mají hodnotu = jejich identitu v paměti.

### Value type vs Reference type

|  | Value type | Reference type |
| --- | --- | --- |
| **Co se přiřadí** | Hodnota se zkopíruje | Odkaz se sdílí |
| **Příklad** | `int`, `bool`, `struct` v C# | `class`, `object`, `array` |
| **Modifikace** | Změna kopie neovlivní original | Změna objektu skrz odkaz ovlivní všechny odkazy |

```jsx
let a = 5;
let b = a;
b = 10;
// a = 5, b = 10  (value type, kopie)

let obj1 = { x: 5 };
let obj2 = obj1;
obj2.x = 10;
// obj1.x = 10, obj2.x = 10  (reference type, sdílené)
```

---

## Složené (kompozitní) datové typy

Sestavené z více primitivních prvků.

### Pole (Array)

Kolekce prvků **stejného typu** uložených za sebou v paměti. Přístup přes index od 0.

```c
int znamky[5] = {1, 2, 3, 4, 5};
znamky[0]  // = 1
```

| Vlastnost |  |
| --- | --- |
| **Velikost** | Pevná (u statických polí) |
| **Typ prvků** | Všechny stejné |
| **Přístup** | O(1) přes index |
| **Paměť** | Souvislý blok |

V moderních jazycích jsou **dynamická pole**: Pythonský `list`, C# `List<T>`, Java `ArrayList`, JS Array. Umí měnit velikost (s vnitřní realokací).

### Řetězec (String)

Sekvence znaků, technicky **pole charů**. V Javě, C#, Pythonu je `String` objekt s metodami a typicky **immutable** (každá změna vytvoří nový string).

```python
s = "axo"        # 3 charactery, 3 bytes v UTF-8
s.upper()        # "AXO" (nová instance)
```

### Struktura (Struct / Record)

Seskupuje proměnné **různých typů** pod jedním názvem.

```c
struct Student {
    char name[20];
    int age;
    bool passed;
};

struct Student stu = {"axo", 18, true};
printf("%s je %d let", stu.name, stu.age);
```

### Výčet (Enum)

Sada **pojmenovaných konstant**. Interně typicky `int`.

```c
enum Color { RED, GREEN, BLUE };
// RED = 0, GREEN = 1, BLUE = 2
```

```tsx
enum HttpStatus {
  OK = 200,
  NotFound = 404,
  ServerError = 500
}
```

### Třída a objekt (Class / Object)

Rozšíření struktury o **metody** (chování). Základ OOP.

```python
class Student:
    def __init__(self, jmeno, vek):
        self.jmeno = jmeno
        self.vek = vek

    def pozdrav(self):
        return f"Ahoj, jsem {self.jmeno}"

uzivatel = Student("axo", 18)
print(uzivatel.pozdrav())
```

### Rozhraní (Interface)

Definuje **kontrakt**: co třída musí implementovat, ne jak.

```tsx
interface Animal {
  name: string;
  makeSound(): void;
}

class Dog implements Animal {
  name = "Rex";
  makeSound() { console.log("Woof!"); }
}
```

### Slovník / Mapa (Dictionary / Map / HashMap)

Páry klíč-hodnota, lookup typicky O(1) (přes hash).

```python
ages = {"axo": 18, "harry": 19}
ages["axo"]  # 18
```

### Množina (Set)

Kolekce **unikátních** prvků bez pořadí.

```python
unikatni = {1, 2, 3, 2, 1}  # {1, 2, 3}
"a" in unikatni  # False
```

### Tuple (n-tice)

**Pevně velká, neměnitelná** kolekce různých typů.

```python
souradnice = (50.7, 14.6)   # nelze měnit
```

---

## 11 • Praktický příklad: hex barvy

```css
color: #FF5733;
```

- `#FF5733` je 6 hex cifer = 3 bajty = RGB barva
- `FF` = červená kanál = 255 (max)
- `57` = zelená kanál = 87
- `33` = modrá kanál = 51

S alpha kanálem (průhlednost):

```css
background: #FF5733A0;
```

- dvojice `A0` = 160 (cca 63% průhlednost)

Krásné spojení reprezentace dat (hex), znaků (`#`) a barev v CSS.

---

## 12 • Rychlý tahák

| Pojem | Klíčová fakta |
| --- | --- |
| **Bit** | 0 nebo 1, nejmenší jednotka |
| **Bajt (B)** | 8 bitů, 256 hodnot |
| **KB vs KiB** | KB = 1000 B (SI), KiB = 1024 B (binární) |
| **Adresový prostor** | 32-bit max 4 GB, 64-bit prakticky neomezené |
| **Binární** | Základ 2, 0-1, prefix `0b` |
| **Hex** | Základ 16, 0-9 + A-F, prefix `0x`, 1 bajt = 2 hex cifry |
| **Bin ↔ Hex** | Skupiny po 4 bitech = 1 hex cifra |
| **Signed vs Unsigned** | Stejná velikost, jiné rozdělení |
| **Dvojkový doplněk** | Záporná čísla: invertuj bity + přičti 1 |
| **Integer overflow** | Po max se vrátí na min (přetečení) |
| **0.1 + 0.2 ≠ 0.3** | Floating-point chyby, pro peníze používat decimal |
| **NaN** | Not a Number, NaN === NaN je false |
| **ASCII** | 7 bitů, 128 znaků, `'A'` = 65 |
| **UTF-8** | 1-4 bajty, zpětně kompatibilní s ASCII, dnešní standard |
| **Unicode code point** | Identifikátor znaku (`U+1F600` = 😀) |
| **Unix timestamp** | Sekundy od 1.1.1970 UTC |
| **Y2K38** | Přetečení 32-bit timestamp 19.1.2038 |
| **ISO 8601** | `2026-05-13T14:00:00Z`, bezpečný formát |
| **Boolean** | true/false, 1 bit |
| **Int** | Typicky 4 B (32 bit), ±2.1 mld |
| **Float / Double** | 4 B / 8 B, IEEE 754 |
| **Pointer** | Adresa v paměti, C/C++ |
| **Reference** | Skrytý odkaz, Java/C#/Python |
| **Array** | Stejný typ, index od 0, pevná velikost |
| **String** | Sekvence znaků, typicky immutable |
| **Struct** | Různé typy pod jedním názvem |
| **Class** | Struct + metody = OOP |
| **Enum** | Pojmenované konstanty |
| **HashMap** | Páry klíč-hodnota, O(1) lookup |
| **Set** | Unikátní prvky |
| **Tuple** | Pevně velká, neměnitelná |

---

## 13 • Tipy pro ústní zkoušku

### Jak začít

> *"V počítači je všechno reprezentované jako sekvence bitů, nul a jedniček. Datový typ určuje, jak se na tu sekvenci máme dívat: jako na číslo, znak, barvu nebo cokoli jiného. Můžu projít jednotky, číselné soustavy, kódování znaků, datumy a typy dat."*
> 

### Co komise typicky chce slyšet

- **Bit a bajt** jako základ.
- **KB vs KiB** rozdíl (SI vs binární prefix).
- **Hex** a proč ho používáme.
- **Převody soustav** s ukázkou (binární ↔ desítková ↔ hex).
- **ASCII vs UTF-8**.
- **Unix timestamp** a problém 2038.
- **Základní vs složené typy** s příklady.

### Doplňky, které komisi potěší

- **Dvojkový doplněk** s konkrétním převodem.
- **Floating-point chyby** (`0.1 + 0.2`).
- **NaN se nerovná sám sobě** (`NaN === NaN` je false).
- **Hex barvy** jako praktický příklad.
- **UTF-8 je zpětně kompatibilní s ASCII**.
- **Y2K vs Y2K38** problém.

### Časté chytáky

| Otázka | Odpověď |
| --- | --- |
| *Kolik je 1 GB?* | Záleží: SI 10⁹ B = 1 mld, binární (GiB) je 2³⁰ B ≈ 1.074 mld. Disky používají SI, paměť binární. |
| *Proč hex a ne binární?* | Hex je kompaktnější (1 B = 2 hex cifry), čitelnější a přesně mapuje na bity. |
| *Co je dvojkový doplněk?* | Reprezentace záporných čísel: invertuj bity a přičti 1. |
| *Proč není `0.1 + 0.2 == 0.3`?* | Desetinná čísla se v binárce ne vždy přesně vyjádří (mantisa má omezené bity). |
| *Co je rozdíl ASCII a UTF-8?* | ASCII má 128 znaků (1 B, anglicky). UTF-8 má 1-4 B, podporuje miliony znaků včetně diakritiky a emoji. |
| *Co je epocha?* | Referenční bod v čase, od kterého se počítají sekundy. Unix epocha je 1.1.1970 UTC. |
| *Co je problém roku 2038?* | 32-bit signed Unix timestamp přeteče 19.1.2038, vrátí se na rok 1901. |