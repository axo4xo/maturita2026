# 9 • Spojové struktury a stromy

> Spojové seznamy, ukazatele, stromy (binární strom)
> 

> **Formát:** 30 min praktická úloha, 15 min obhajoba + teorie. Teorie pokrývá linked listy, BST a tree traversals. U téhle otázky **malujte jako diví**: diagramy stromů jsou klíčové.
> 

---

# Část 1: Teorie

### K čemu spojové struktury

Klasické **pole** má pevnou velikost a vkládání/mazání je drahé (musí se přesouvat prvky). Spojové struktury řeší:

- Neznáme velikost dopředu
- Často **vkládáme a mažeme** prvky
- Potřebujeme **hierarchickou** strukturu (stromy)

```
Datové struktury
   ├─ Lineární
   │   ├─ Pole (array) ........... pevná velikost, indexový přístup
   │   ├─ Spojový seznam ......... dynamická velikost, sekvenční přístup
   │   └─ Fronta, zásobník ....... omezený přístup (FIFO, LIFO)
   ├─ Hierarchické
   │   ├─ Strom (Tree)
   │   ├─ Binární strom
   │   └─ BST (Binary Search Tree)
   └─ Síťové
       └─ Graf
```

---

### Ukazatele a reference

### Ukazatel v C (klasický pointer)

```c
int a = 10;
int* p = &a;       // p drží ADRESU proměnné a
printf("%d", *p);  // dereference: vypíše 10
```

| Symbol | Význam |
| --- | --- |
| `&a` | Adresa proměnné `a` v paměti |
| `*p` | Dereference: co je na adrese, kterou drží `p` |

**Výhody C pointerů**: přímá práce s pamětí, výkon.
**Nevýhody**: segfault, memory leaks, neintuitivní.

### Reference v C# (bezpečná alternativa)

C# pointery běžně **nepoužívá**, místo nich má **reference**, které jsou součástí jazyka pro každý `class`.

```csharp
class Person { public string Name; }

Person p1 = new Person();
Person p2 = p1;               // p2 ukazuje na STEJNÝ objekt
p2.Name = "axo";
Console.WriteLine(p1.Name);   // "axo": obě ukazují na totéž
```

```
   STACK              HEAP
  ┌──────┐           ┌──────────────────┐
  │ p1 → ●──────────▶│ Person {axo}     │
  │ p2 → ●──────────▶│                  │
  └──────┘           └──────────────────┘
       Obě reference ukazují na 1 objekt
```

> V C# je každá `class` automaticky **referenční typ**: proměnná drží adresu, ne data. To je přesně to, co potřebujeme pro spojové struktury.
> 

### Pointery v C# (`unsafe`)

C# pointery povoluje, ale jen v `unsafe` bloku:

```csharp
unsafe
{
    int a = 10;
    int* p = &a;
    Console.WriteLine(*p);   // 10
}
```

> Použití: jen nízkoúrovňová optimalizace (interop s C, performance kritický kód). Pro běžnou práci není potřeba.
> 

---

### Spojový seznam (Linked List)

Datová struktura, kde každý prvek (uzel) obsahuje:

1. **data** (hodnotu)
2. **odkaz na další uzel** (`Next`)

```
   HEAD
    │
    ▼
  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
  │ data:10 │    │ data:20 │    │ data:30 │    │ data:40 │
  │ next: ●─┼───▶│ next: ●─┼───▶│ next: ●─┼───▶│ next:nil│
  └─────────┘    └─────────┘    └─────────┘    └─────────┘
```

### Implementace v C#

```csharp
class Node
{
    public int Value;
    public Node Next;        // odkaz na další uzel (může být null)
}
```

### Druhy spojových seznamů

```
JEDNOSMĚRNÝ (singly linked)
  HEAD ─▶ [10|●] ─▶ [20|●] ─▶ [30|●] ─▶ null

OBOUSMĚRNÝ (doubly linked)
  HEAD ⇄ [10|●|●] ⇄ [20|●|●] ⇄ [30|●|●] ⇄ null
                  každý uzel má Prev i Next

CYKLICKÝ (circular)
  ┌──────────────────────────────────────┐
  │                                      ▼
  └── [10|●] ─▶ [20|●] ─▶ [30|●] ─▶ [40|●]
        (poslední Next ukazuje na první)
```

### Operace a jejich složitost

| Operace | Složitost | Proč |
| --- | --- | --- |
| Přidání na začátek | **O(1)** | Jen napojím nový uzel před head |
| Přidání na konec | O(n) | Musím projít na konec (pokud nedržím `tail`) |
| Vyhledání hodnoty | O(n) | Procházím od head |
| Smazání známého uzlu | O(1) | Přepojím Next |
| Přístup na index `i` | O(n) | Žádný random access (na rozdíl od pole) |

### Vložení mezi dva uzly (vizuálně)

```
Před vložením 25 mezi 20 a 30:

   [20|●] ─▶ [30|●] ─▶ ...

Po:

   [20|●] ─▶ [25|●] ─▶ [30|●] ─▶ ...

Změny:
  - vytvořím new Node { Value = 25 }
  - 25.Next = 20.Next         (25 ukazuje tam, kam ukazoval 20)
  - 20.Next = 25              (20 teď ukazuje na 25)
```

Klíčové: **jen 2 přepojení ukazatelů**, žádné kopírování paměti.

### Smazání uzlu

```
Před smazáním 20:

   [10|●] ─▶ [20|●] ─▶ [30|●] ─▶ ...

Po:

   [10|●] ───────────▶ [30|●] ─▶ ...
            (10.Next = 20.Next, čili teď ukazuje na 30)
```

### Výhody vs nevýhody

| Plusy | Mínusy |
| --- | --- |
| Dynamická velikost | Pomalý přístup (O(n) na index) |
| Rychlé vkládání/mazání (O(1)) | Větší paměť (každý uzel drží i odkaz) |
| Žádné kopírování při růstu | Špatná cache locality (uzly rozházeny v heapu) |

### Pole vs spojový seznam

```
   POLE (souvislé v paměti)              SPOJOVÝ SEZNAM (rozházeno v heapu)

   ┌────┬────┬────┬────┬────┐            ┌──┐    ┌──┐    ┌──┐    ┌──┐
   │ 10 │ 20 │ 30 │ 40 │ 50 │            │10│──▶ │20│──▶ │30│──▶ │40│──▶ null
   └────┴────┴────┴────┴────┘            └──┘    └──┘    └──┘    └──┘

   Random access O(1)                    Sekvenční přístup O(n)
   Insert/delete O(n)                    Insert/delete O(1)
```

> **Volba podle operace**: pokud budeš **hodně procházet a indexovat**, pole. Pokud **hodně vkládat/mazat**, linked list.
> 

---

### Stromy

**Strom** je hierarchická struktura uzlů, kde každý uzel může mít **více potomků** (children).

```
              [10]      ← KOŘEN (root)
             /    \
          [5]      [15]   ← UZLY (nodes)
         /  \        \
       [3]  [7]      [20]  ← LISTY (leaves), bez potomků
```

### Terminologie

| Pojem | Význam |
| --- | --- |
| **Uzel (node)** | Prvek stromu (data + odkazy na potomky) |
| **Kořen (root)** | Nejvyšší uzel, strom má právě jeden |
| **List (leaf)** | Uzel bez potomků |
| **Rodič (parent)** | Uzel, který ukazuje na jiný uzel |
| **Potomek (child)** | Uzel pod rodičem |
| **Sourozenci (siblings)** | Uzly se stejným rodičem |
| **Hloubka (depth)** | Délka cesty od kořene k uzlu |
| **Výška (height)** | Hloubka nejhlubšího listu |
| **Podstrom (subtree)** | Uzel + všechno pod ním |

### Analogie: HTML DOM je strom

Nejlepší analogie je **HTML DOM**: kořen jako `<html>`, uzly jako `<head>` a `<body>`, listy jako `<img>` nebo text.

```tsx
                       <html>                ← KOŘEN (root)
                      /      \
                  <head>      <body>          ← UZLY (nodes)
                  /    \      /    \
              <title> <meta> <h1>  <div>      ← UZLY
                  |           |    /    \
                "axo"      "Ahoj" <p>  <img>  ← LISTY (leaves)
                                  |
                                "text"
```

Když si představíš, jak prohlížeč parsuje HTML, vytváří **přesně tuhle stromovou strukturu** v paměti (DOM = Document Object Model). Každý element je uzel se vztahem rodič-potomek. `document.querySelector("body")` je vlastně sjetí stromu od root.

Stejně tak souborový systém: kořen jako `/` (root), uzly jako složky, listy jako soubory.

---

### Binární strom

Každý uzel má **maximálně 2 potomky**: `Left` a `Right`.

```csharp
class TreeNode
{
    public int Value;
    public TreeNode? Left;     // levý potomek (může být null)
    public TreeNode? Right;    // pravý potomek (může být null)
}
```

```
                 [50]
                /    \
             [30]    [70]
             /  \    /  \
          [20] [40][60] [80]
```

---

### BST: Binary Search Tree

Speciální binární strom s **pravidlem uspořádání**:

> **Pro každý uzel platí**: všechno **vlevo je menší**, všechno **vpravo je větší**.
> 

```
                 [50]
                /    \
              <50    >50
              /        \
          [30]         [70]
         /    \       /    \
        <30  >30    <70    >70
        /      \    /        \
      [20]   [40][60]      [80]
```

### Proč je to úžasné

Vyhledání hodnoty trvá **O(log n)** místo O(n), v každém kroku zahodím polovinu stromu.

```
Hledám 60 ve stromě výše:

  50 → 60 > 50, jdu vpravo
  70 → 60 < 70, jdu vlevo
  60 → NAŠEL!

  3 kroky pro 7 prvků
  V poli by to bylo až 7 kroků
  Pro 1 000 000 prvků: BST cca 20 kroků, lineární vyhledávání milion kroků
```

### Vložení (Insert)

```
Vložit 25 do stromu:

       [50]                    [50]
       /  \                    /  \
    [30]  [70]   ───▶       [30]  [70]
    /  \                    /  \
  [20] [40]               [20] [40]
                           \
                          [25]    ← 25 > 20, jde vpravo od 20
```

**Algoritmus:**

1. Začni v kořeni
2. Pokud `value < uzel.Value`, jdi doleva, jinak doprava
3. Když narazíš na `null`, vlož tam nový uzel

### Vyhledání (Contains)

Stejný princip jako insert: porovnávám a jdu doleva/doprava. Když najdu hledanou hodnotu, vrátím true. Když dojdu na null, false.

### Mazání (Delete): nejtěžší operace

| Případ | Co dělat |
| --- | --- |
| **Mazaný uzel je leaf** | Stačí ho odpojit (rodič ukazuje na `null`) |
| **Mazaný uzel má 1 potomka** | Rodič začne ukazovat na potomka |
| **Mazaný uzel má 2 potomky** | Najít in-order successor, nahradit, smazat ho |

Třetí případ je matoucí, proto je mazání ze stromu složitější než vkládání.

---

### Průchody stromem (Traversal)

Existují 4 hlavní způsoby, jak projít všechny uzly stromu.

```
Klasifikace průchodů:

       DFS (do hloubky)                    BFS (do šířky)
       ─────────────────                   ──────────────
       3 varianty:                         1 varianta:
       - In-order  (L → root → R)         - Level-order (po úrovních)
       - Pre-order (root → L → R)
       - Post-order (L → R → root)

       Implementace: rekurze nebo stack    Implementace: fronta (queue)
```

### Příklad pro tento strom

```
         [50]
         /  \
      [30]  [70]
      /  \
    [20] [40]
```

| Průchod | Pořadí | Výsledek | Použití |
| --- | --- | --- | --- |
| **In-order** (L → root → R) | levý, kořen, pravý | 20, 30, 40, 50, 70 | **Seřazený výpis** BST |
| **Pre-order** (root → L → R) | kořen, levý, pravý | 50, 30, 20, 40, 70 | Kopie stromu |
| **Post-order** (L → R → root) | levý, pravý, kořen | 20, 40, 30, 70, 50 | Mazání stromu (od listů) |
| **BFS / Level-order** | po úrovních | 50, 30, 70, 20, 40 | Hledání nejkratší cesty |

### In-order traversal (nejdůležitější pro BST)

```csharp
void InOrder(TreeNode node)
{
    if (node == null) return;
    InOrder(node.Left);                   // 1. levý podstrom
    Console.Write(node.Value + " ");       // 2. uzel
    InOrder(node.Right);                  // 3. pravý podstrom
}
```

Pro BST vrátí **seřazený výpis** od nejmenšího po největší. Tohle je důležitý vedlejší efekt definice BST.

---

### Výhody a problémy BST

| Plusy | Mínusy |
| --- | --- |
| Vyhledávání O(log n) | Jen pokud je **vyvážený** |
| Přirozeně udržuje uspořádání | Při vkládání seřazených dat se zdegeneruje |
| Snadná rekurzivní implementace | Mazání uzlu se 2 potomky je složité |

### Degenerace BST

Když vkládáš **už seřazená data** do prostého BST, stane se z něj jednosměrný seznam:

```
Vkládám 1, 2, 3, 4, 5 (seřazeně):

      [1]
        \
        [2]
          \
          [3]            ← Z BST se stal jednosměrný seznam!
            \              Vyhledání už je O(n), ne O(log n)
            [4]
              \
              [5]
```

**Řešení**: **vyvážené stromy** (AVL, Red-Black), automaticky se přerovnávají. Volba pivota pro vyvážení už není triviální záležitost a v SŠ se tím detailně nezabýváme.

---

### Speciální typy stromů

| Typ | K čemu |
| --- | --- |
| **Binární strom** | Obecný, každý uzel max 2 potomci |
| **BST** | Vyhledávací, vlevo menší, vpravo větší |
| **AVL strom** | Vyvážený BST (rozdíl výšek max 1) |
| **Red-Black strom** | Vyvážený BST s barvenými uzly (.NET `SortedDictionary`) |
| **Heap (halda)** | Strom s prioritou, pro `PriorityQueue` |
| **Trie** | Strom pro vyhledávání řetězců (autocomplete) |
| **N-ární strom** | Více než 2 potomci (souborový systém, DOM) |
| **B-strom, B+ strom** | Databázové indexy |

---

### Reálné použití

| Kde | Co se používá |
| --- | --- |
| Souborový systém | Strom (složky a soubory) |
| HTML DOM | Strom uzlů |
| Databázový index | B-strom, B+ strom |
| Auto-complete | Trie |
| Undo/Redo | Strom historie (větvení) |
| Game AI | Decision tree, Min-Max |
| Komprese (Huffman) | Binární strom |
| `SortedDictionary` v .NET | Red-Black tree |
| `PriorityQueue` v .NET | Heap (halda) |

---

### Cheat sheet

```csharp
// === LINKED LIST UZEL ===
class Node
{
    public int Value;
    public Node Next;
}

class LinkedList // wrapper
{
    public Node Head;

    // O(1) vložení na začátek
    public void AddFirst(int value)
    {
        Node n = new Node { Value = value, Next = Head };
        Head = n;
    }

    // O(n) vyhledání
    public bool Contains(int value)
    {
        Node n = Head;
        while (n != null)
        {
            if (n.Value == value) return true;
            n = n.Next;
        }
        return false;
    }
}

// === BST UZEL ===
class TreeNode
{
    public int Value;
    public TreeNode? Left, Right;
    
    // konstruktor
    public TreeNode(int v) { 
	    Value = v; 
    }
}

class BST
{
    public TreeNode Root;

    // Insert (rekurzivně)
    public void Insert(int value)
    {
        Root = InsertNode(Root, value);
    }

    private TreeNode InsertNode(TreeNode node, int value)
    {
        if (node == null) return new TreeNode(value);
        if (value < node.Value)
            node.Left = InsertNode(node.Left, value);
        else
            node.Right = InsertNode(node.Right, value);
        return node;
    }

    // Contains (rekurzivně)
    public bool Contains(int value) => ContainsNode(Root, value);

    private bool ContainsNode(TreeNode node, int value)
    {
        if (node == null) return false;
        if (node.Value == value) return true;
        return value < node.Value
            ? ContainsNode(node.Left, value)
            : ContainsNode(node.Right, value);
    }

    // In-order (seřazený výpis)
    public void PrintInOrder() => InOrder(Root);

    private void InOrder(TreeNode node)
    {
        if (node == null) return;
        InOrder(node.Left);
        Console.Write(node.Value + " ");
        InOrder(node.Right);
    }
}
```

---

### Časté chyby

| Chyba | Důsledek | Řešení |
| --- | --- | --- |
| Zapomenu inicializovat `Next` na `null` | NullReference při průchodu | V C# default referenční typ je null, ale myslet na to |
| Při insertu BST nezachytím rovnost | Vznik duplicit nebo nekonečný cyklus | Definuj politiku (`<` vs `<=`) |
| Procházím seznam bez zastavení | Nekonečný cyklus | `while (node != null)` |
| Mažu uzel s 2 potomky bez náhrady | Rozpadne se strom | Najít in-order successor |
| Vkládám seřazená data do prostého BST | Degenerace na seznam | Použít AVL nebo Red-Black |
| Pletu si in-order / pre-order | Špatný výstup | In-order = LRR (levý, kořen, pravý) |
| Zapomenu return v rekurzi | Strom se nevrátí správně | Vždy vracet `node` z metod |

---

# Část 2: Praktická úloha

### Co může praktická úloha obsahovat

Typická praktika pro tuhle otázku:

- **Implementovat třídu Node** (uzel s daty a odkazem)
- **Implementovat LinkedList** s vkládáním, mazáním, vyhledáváním
- **Implementovat BST** s Insert, Contains, traversaly
- **Tree traversal**: in-order, pre-order, post-order, BFS
- **Konkrétní úkol nad strukturou**: najít minimum/maximum, spočítat uzly, najít hloubku, otočit seznam
- **Nakreslit strukturu po sérii operací** (typicky na papír)

### Příklad zadání: BST se základními operacemi

Vytvoř v C# program, který:

1. **Implementuje třídu `TreeNode`** s vlastnostmi `Value`, `Left`, `Right`
2. **Implementuje třídu `BST`** s metodami:
    - `Insert(int value)`: vloží hodnotu do správného místa
    - `Contains(int value)`: vrátí true/false
    - `PrintInOrder()`: vytiskne hodnoty seřazeně
    - `FindMin()`, `FindMax()`: najde nejmenší a největší hodnotu
    - `Count()`: vrátí počet uzlů
3. **V `Main` metodě** vytvoř strom z hodnot: `50, 30, 70, 20, 40, 60, 80, 25, 35`
4. **Vytiskni výsledek** pro:
    - In-order výpis
    - Contains pro hodnoty 35 a 100
    - Min a Max
    - Počet uzlů

**Bonus:**

- Implementuj `PrintPreOrder()` a `PrintPostOrder()`
- Implementuj `Height()`: vrátí výšku stromu
- Nakresli strom po vložení všech hodnot na papír

### Startovací kód

```csharp
using System;

class TreeNode
{
    public int Value;
    public TreeNode Left;
    public TreeNode Right;

    public TreeNode(int value)
    {
        Value = value;
    }
}

class BST
{
    public TreeNode Root;

    // TODO: Insert
    public void Insert(int value)
    {
        // doplň
    }

    // TODO: Contains
    public bool Contains(int value)
    {
        // doplň
    }

    // TODO: PrintInOrder
    public void PrintInOrder()
    {
        // doplň
    }

    // TODO: FindMin a FindMax
    public int FindMin()
    {
        // doplň
    }

    public int FindMax()
    {
        // doplň
    }

    // TODO: Count
    public int Count()
    {
        // doplň
    }
}

class Program
{
    static void Main()
    {
        BST tree = new BST();
        int[] values = { 50, 30, 70, 20, 40, 60, 80, 25, 35 };

        foreach (int v in values)
        {
            tree.Insert(v);
        }

        // TODO: výpisy
    }
}
```

### Řešení: kompletní C# kód

```csharp
using System;

class TreeNode
{
    public int Value;
    public TreeNode Left;
    public TreeNode Right;

    public TreeNode(int value)
    {
        Value = value;
    }
}

class BST
{
    public TreeNode Root;

    // ===== INSERT =====
    public void Insert(int value)
    {
        Root = InsertNode(Root, value);
    }

    private TreeNode InsertNode(TreeNode node, int value)
    {
        if (node == null)
            return new TreeNode(value);

        if (value < node.Value)
            node.Left = InsertNode(node.Left, value);
        else if (value > node.Value)
            node.Right = InsertNode(node.Right, value);
        // pokud value == node.Value, ignoruj (žádné duplikáty)

        return node;
    }

    // ===== CONTAINS =====
    public bool Contains(int value)
    {
        return ContainsNode(Root, value);
    }

    private bool ContainsNode(TreeNode node, int value)
    {
        if (node == null) return false;
        if (node.Value == value) return true;
        return value < node.Value
            ? ContainsNode(node.Left, value)
            : ContainsNode(node.Right, value);
    }

    // ===== IN-ORDER PRINT =====
    public void PrintInOrder()
    {
        InOrder(Root);
        Console.WriteLine();
    }

    private void InOrder(TreeNode node)
    {
        if (node == null) return;
        InOrder(node.Left);
        Console.Write(node.Value + " ");
        InOrder(node.Right);
    }

    // ===== FIND MIN / MAX =====
    public int FindMin()
    {
        if (Root == null) throw new InvalidOperationException("Strom je prázdný");

        TreeNode current = Root;
        while (current.Left != null)
            current = current.Left;        // nejmenší je nejlevější uzel
        return current.Value;
    }

    public int FindMax()
    {
        if (Root == null) throw new InvalidOperationException("Strom je prázdný");

        TreeNode current = Root;
        while (current.Right != null)
            current = current.Right;       // největší je nejpravější uzel
        return current.Value;
    }

    // ===== COUNT =====
    public int Count()
    {
        return CountNodes(Root);
    }

    private int CountNodes(TreeNode node)
    {
        if (node == null) return 0;
        return 1 + CountNodes(node.Left) + CountNodes(node.Right);
    }

    // ===== BONUS: PRE-ORDER =====
    public void PrintPreOrder()
    {
        PreOrder(Root);
        Console.WriteLine();
    }

    private void PreOrder(TreeNode node)
    {
        if (node == null) return;
        Console.Write(node.Value + " ");
        PreOrder(node.Left);
        PreOrder(node.Right);
    }

    // ===== BONUS: POST-ORDER =====
    public void PrintPostOrder()
    {
        PostOrder(Root);
        Console.WriteLine();
    }

    private void PostOrder(TreeNode node)
    {
        if (node == null) return;
        PostOrder(node.Left);
        PostOrder(node.Right);
        Console.Write(node.Value + " ");
    }

    // ===== BONUS: HEIGHT =====
    public int Height()
    {
        return GetHeight(Root);
    }

    private int GetHeight(TreeNode node)
    {
        if (node == null) return 0;
        int leftHeight = GetHeight(node.Left);
        int rightHeight = GetHeight(node.Right);
        return 1 + Math.Max(leftHeight, rightHeight);
    }
}

class Program
{
    static void Main()
    {
        BST tree = new BST();
        int[] values = { 50, 30, 70, 20, 40, 60, 80, 25, 35 };

        foreach (int v in values)
        {
            tree.Insert(v);
        }

        Console.WriteLine("In-order:");
        tree.PrintInOrder();
        // Output: 20 25 30 35 40 50 60 70 80

        Console.WriteLine($"\nContains(35): {tree.Contains(35)}");   // True
        Console.WriteLine($"Contains(100): {tree.Contains(100)}");   // False

        Console.WriteLine($"\nMin: {tree.FindMin()}");               // 20
        Console.WriteLine($"Max: {tree.FindMax()}");                 // 80

        Console.WriteLine($"\nPočet uzlů: {tree.Count()}");           // 9

        // Bonus
        Console.WriteLine("\nPre-order:");
        tree.PrintPreOrder();
        // Output: 50 30 20 25 40 35 70 60 80

        Console.WriteLine("Post-order:");
        tree.PrintPostOrder();
        // Output: 25 20 35 40 30 60 80 70 50

        Console.WriteLine($"\nVýška stromu: {tree.Height()}");        // 4
    }
}
```

### Vizualizace výsledného stromu

Po vložení `50, 30, 70, 20, 40, 60, 80, 25, 35` vznikne:

```
                    [50]                ← root
                   /    \
                [30]    [70]
               /    \    /  \
            [20]  [40][60] [80]
              \    /
            [25][35]
```

**Krok za krokem:**

```
1. Insert 50:        [50]

2. Insert 30:        [50]
                    /
                  [30]

3. Insert 70:        [50]
                    /    \
                  [30]   [70]

4. Insert 20:        [50]
                    /    \
                  [30]   [70]
                  /
                [20]

5. Insert 40:        [50]
                    /    \
                  [30]   [70]
                  /  \
                [20] [40]

6. Insert 60:        [50]
                    /    \
                  [30]   [70]
                  /  \    /
                [20] [40][60]

7. Insert 80:        [50]
                    /    \
                  [30]   [70]
                  /  \    / \
                [20][40][60][80]

8. Insert 25:        [50]
                    /    \
                  [30]    [70]
                  /  \    / \
                [20][40][60][80]
                  \
                  [25]    ← 25 > 20, jde vpravo od 20

9. Insert 35:        [50]
                    /    \
                  [30]    [70]
                  /  \    / \
                [20][40][60][80]
                  \   /
                 [25][35]    ← 35 < 40, jde vlevo od 40
```

### Co se v řešení děje

**Insert**: rekurzivně sjedu strom doleva nebo doprava (podle porovnání) až narazím na null, kam vložím nový uzel.

**Contains**: stejný princip, jen vracím true při shodě nebo false při null.

**FindMin/Max**: nejmenší je nejlevější uzel (vždy jdu doleva), největší je nejpravější (vždy jdu doprava). Iterativně.

**Count**: rekurze, `1 + Count(left) + Count(right)`. Báze: null vrátí 0.

**Traversals (In/Pre/Post-order)**: rekurzivně. Rozdíl je v pořadí, **kdy** zpracuji uzel:

- **In-order**: před, mezi, po (`Left → Self → Right`)
- **Pre-order**: nejdřív self (`Self → Left → Right`)
- **Post-order**: jako poslední (`Left → Right → Self`)

**Height**: rekurze, vrátí 1 + maximum z výšek podstromů. Báze: null vrátí 0.

---

## Část 3: Tipy pro obhajobu

### Co u obhajoby říct

> *"V zadání jsem implementoval binární vyhledávací strom (BST) v C#. Třída TreeNode má hodnotu a dva odkazy: Left a Right. Třída BST drží referenci na kořen a metody pro práci. Insert používá rekurzi: porovnává hodnoty a sjíždí doleva nebo doprava, dokud nenarazí na null, kam vloží nový uzel. Contains funguje stejně, jen vrací true/false. FindMin je iterativně po levé větvi, FindMax po pravé. Count je rekurze 1 plus podstromy. In-order traversal vrátí pro BST seřazené hodnoty. Důležitá vlastnost BST je vyhledávání O(log n), ale pozor: jen pokud je strom vyvážený. Pokud bys vkládal seřazená data, strom by se zdegeneroval na linked list."*
> 

### Klíčové pojmy pro teorii

| Pojem | Rychlá odpověď |
| --- | --- |
| **Spojový seznam** | Sekvence uzlů, každý drží data a odkaz na další |
| **Uzel (Node)** | Prvek struktury, data + reference |
| **Reference** | Odkaz na objekt v paměti (v C# default pro class) |
| **Pointer** | Surová adresa v paměti (v C#, unsafe blok) |
| **Singly linked** | Jeden směr (jen Next) |
| **Doubly linked** | Oba směry (Next i Prev) |
| **Cyklický seznam** | Poslední ukazuje na první |
| **Strom (Tree)** | Hierarchická struktura, root + potomci |
| **Kořen, list, hloubka** | Top uzel, koncový uzel, vzdálenost od kořene |
| **Binární strom** | Max 2 potomci na uzel |
| **BST** | Binary Search Tree, vlevo menší, vpravo větší |
| **Vyhledávání v BST** | O(log n) ve vyváženém, O(n) v degenerovaném |
| **In-order traversal** | Levý → uzel → pravý, dá seřazený výpis BST |
| **Pre-order traversal** | Uzel → levý → pravý |
| **Post-order traversal** | Levý → pravý → uzel |
| **BFS (level-order)** | Procházení po úrovních, používá frontu |
| **Degenerace BST** | Vkládání seřazených dat → linked list |
| **AVL, Red-Black** | Samo-vyvažující BST |

### Časté chytáky

| Otázka | Odpověď |
| --- | --- |
| *Rozdíl pole a linked list?* | Pole: souvislé v paměti, O(1) přístup. Linked list: rozházené, O(1) insert/delete, ale O(n) přístup. |
| *Proč BST a ne pole?* | BST má vyhledávání O(log n), pole O(n). Pro 1M prvků: 20 kroků vs 1M kroků. |
| *Co je rozdíl reference a pointer?* | Pointer (C) je surová adresa v paměti, dá se s ní aritmeticky pracovat. Reference (C#, Java) je bezpečná, nemůžeš ji "rozbít". |
| *Kdy se BST zdegeneruje?* | Když do něj vkládáš seřazená data (1, 2, 3, 4, 5). Stane se z něj linked list, vyhledávání O(n). |
| *Co je in-order a proč se hodí?* | Levý → uzel → pravý. Pro BST vrátí hodnoty **seřazené vzestupně**. |
| *Jak najít minimum v BST?* | Stále jdi doleva, dokud existuje levý potomek. Nejlevější uzel je minimum. |
| *Jak smazat uzel s 2 potomky?* | Najít in-order successor (nejlevější v pravém podstromu), nahradit jím mazaný uzel, smazat successor. |
| *Proč rekurze pro stromové operace?* | Strom je rekurzivní struktura (podstrom je taky strom). Rekurze přirozeně mapuje na tuto strukturu. |
| *Co je AVL strom?* | Samo-vyvažující BST. Rozdíl výšek levého a pravého podstromu je max 1. Garantuje O(log n). |

### Časté chyby v praktické úloze

- Insert nevrací návratovou hodnotu z rekurze (parent neaktualizuje child)
- Contains zapomíná case s null (NullReferenceException)
- In-order, ale s pořadím Self → Left → Right (to je Pre-order!)
- FindMin/Max začíná z null root bez kontroly
- Count chybí báze pro null (nekonečná rekurze)
- Insert povoluje duplikáty bez politiky (může způsobit redundanci)
- Height vrací 0 pro single node místo 1 (závisí na definici)
- Mazání uzlu se 2 potomky bez náhrady (rozsype strom)
- Použití pointerů v C# bez nutnosti (zbytečné komplikace)
- TreeNode bez konstruktoru (musí se každý field nastavit zvlášť)
- Test bez kreslení stromu na papír (těžko se debuguje)
- Tvrdit, že BST má vždy O(log n) (záleží na vyváženosti)

### Co kreslit na papír (důležité!)

U téhle otázky **dělej diagramy**. Komise je velmi ocení:

1. **Strom po každém Insertu**: krok za krokem
2. **Cesta při Contains**: šipky, jak jdeš doleva/doprava
3. **In-order traversal**: pořadí navštívení uzlů s čísly 1, 2, 3, ...
4. **Linked list operace**: Insert mezi 2 uzly s šipkama
5. **Degenerovaný BST**: co se stane při seřazených datech

Doslova **vytáhni propisku a kresli**, i kdyby tě o to nikdo nepožádal. Je to nejlepší způsob, jak ukázat, že tomu rozumíš.