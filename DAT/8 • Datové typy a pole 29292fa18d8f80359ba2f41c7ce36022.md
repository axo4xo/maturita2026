# 8 • Datové typy a pole

datový typ určuje, jaké data proměnná nese a kolik místa zabírá v paměti

- elementární - nesou jednu nedělitelnou hodnotu (int, bool, char, float)
- strukturované - skládají se z více prvků (elementárních nebo jiných strukturovaných)
    - homogenní (stejnorodé) - např. pole, enum, string
    - heterogenní (různorodé) - např. třída, struktura

---

### homogenní struktury

sada prvků stejného typu, které jsou v paměti hned za sebou

string také příklad homogenní struktury 

- **indexování:** přístup přes číslo, začíná se od 0
- **velikost**: je statická - jakmile pole vyrobíš, nejde nafouknout
- **efektivita:**
    - čtení/zápis: O(1) - bleskurychlé.
    - vkládání/mazání: O(n) - pokud smažeš uprostřed, vznikne díra. všechno za ní se musí posunout.

**vícerozměrná pole**

- pravoúhlá: `[,]`
    - klasická matice
    - paměť: jeden velký souvislý blok
- zubatá (jagged): `[][]`
    - pole polí
    - každý řádek může být jinak dlouhý
    - data jsou rozprostřena na různých místech
    - větší zátěž pro **garbage collector**

---

### heterogenní struktury

**Struktura (**`struct`**)**

- typ: hodnotový (value)
- uložení obvykle na zásobníku (stack), pokud není součástí třídy
- kopírování: při `a = b` se data fyzicky zkopírují. dvě nezávislé kopie.
- použití: malé objekty, DTO, bod v grafu, komplexní číslo

**Třída (**`class`**)**

- typ: referenční (reference)
- uložení na heapu, proměnná obsahuje jen adresu (pointer)
- při `a = b` se kopíruje jen adresa, obě proměnné ukazují na stejný objekt
- OOP vlastnosti:
    - zapouzdření (private, public, protected)
    - dědičnost (dědění vlastností) - toto u struktur nejde

---

### hodnotové vs. referenční typy

| **Vlastnost** | **Hodnotové typy (Value Types)** | **Referenční typy (Reference Types)** |
| --- | --- | --- |
| **Zástupci** | `int`, `bool`, `double`, `enum`, `struct` | `class`, `string`, `pole`, `interface` |
| **Kde žijí** | Stack (Zásobník) – rychlý, malý | Heap – velký, pomalejší, řízený garbage collector |
| **Přiřazení** | Vytvoří se kopie hodnoty. | Kopíruje se odkaz (reference). |
| **Co je v proměnné** | Přímo data (např. číslo 5). | Adresa v paměti (např. 0xFA31). |

---

### výčtový typ (enum)

- datový typ s omezenou množinou stavů
- zvyšuje čitelnost kódu
- pro počítač je to číslo, pro programátora text
    - `enum Dny { Pondeli = 0, Utery = 1 ... }`
- v TS enum jako union: “red” | “green” | “blue”.
    - proměnná může být jedno z těchto.