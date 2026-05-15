# 11 • Kolekce: pole, zásobník, fronta, slovník

> Kolekce a pole, zásobník, fronta, slovník
> 

> **Formát:** 30 min praktická úloha, 15 min obhajoba + teorie. Teorie pokrývá pole, generické kolekce a hash-based struktury. Praktika: implementovat vlastní Stack a Queue pomocí Listu, plus třída se slovníkem.
> 

---

## Část 1: Teorie

### Co jsou kolekce

**Kolekce** je abstraktní datový typ pro **ukládání a správu skupiny objektů**. Na rozdíl od jednotlivých proměnných umožňují pracovat s víc prvky najednou.

Proč potřebujeme kolekce, když máme pole:

| Pole (Array) | Kolekce (`List`, `Stack`, atd.) |
| --- | --- |
| Pevná velikost | Dynamická velikost |
| Manuální resize (znovu alokovat) | Auto-resize, vestavěné metody |
| Jen index-based přístup | Různé přístupové vzory (FIFO, LIFO, by key) |
| Žádné vestavěné metody | `Add`, `Remove`, `Contains`, `Sort`... |

V C# se rozdělují na:

- **Negenerické** (`ArrayList`, `Hashtable`): legacy, dnes se nepoužívají
- **Generické** (`List<T>`, `Stack<T>`, `Queue<T>`, `Dictionary<K,V>`): standardní volba
- **Souběžné (concurrent)** (`ConcurrentDictionary` atd.): thread-safe pro paralelní kód
- **Specializované** (`SortedDictionary`, `LinkedList<T>`): speciální chování

> Pro maturitu se zaměříme na generické. Negenerické jsou přežitek z .NET 1.x (před generikami v roce 2005) a dnes je nepoužívej, jsou pomalejší a méně bezpečné.
> 

---

### Pole (Array)

**Pole** je **primitivní kolekce** s pevnou velikostí, kde prvky leží **bezprostředně za sebou v paměti** (souvislý blok).

```csharp
int[] cisla = new int[5];           // pole o velikosti 5
cisla[0] = 10;
cisla[1] = 20;

int[] inicializovane = { 1, 2, 3, 4, 5 };

Console.WriteLine(cisla[0]);         // přístup přes index
Console.WriteLine(cisla.Length);     // 5
```

### Vlastnosti pole

| Vlastnost | Hodnota |
| --- | --- |
| **Velikost** | Pevná, určí se při vytvoření |
| **Přístup přes index** | O(1), díky kontinuální paměti |
| **Insert/Delete uprostřed** | O(n), nutné posunout prvky |
| **Resize** | Nelze přímo, musíš alokovat nové pole a kopírovat |
| **Typ prvků** | Stejný (homogenní) |

### Proč je přístup O(1)?

Pole je v paměti souvislý blok, takže adresa prvku `i` se spočítá jako:

```
adresa_pole + i * velikost_typu
```

Procesor jednoduše vypočítá adresu a sáhne tam. Žádné procházení.

### Vícerozměrná a jagged pole

```csharp
// Klasické 2D pole (matice 3x4)
int[,] matice = new int[3, 4];
matice[0, 0] = 1;

// Jagged pole (pole polí, každé může mít jinou délku)
int[][] jagged = new int[3][];
jagged[0] = new int[2] { 1, 2 };
jagged[1] = new int[5] { 1, 2, 3, 4, 5 };
jagged[2] = new int[3] { 1, 2, 3 };
```

### Vizualizace pole v paměti

```
Adresa:  100  104  108  112  116
       ┌────┬────┬────┬────┬────┐
       │ 10 │ 20 │ 30 │ 40 │ 50 │
       └────┴────┴────┴────┴────┘
Index:   0    1    2    3    4

cisla[2] = co je na adrese (100 + 2*4) = 108 → 30
```

---

### List (dynamická kolekce)

**`List<T>`** je nejpoužívanější kolekce. Funguje jako pole, ale **automaticky se zvětšuje**.

```csharp
List<int> cisla = new List<int> { 1, 2, 3 };
cisla.Add(4);                    // přidání na konec
cisla.Insert(0, 0);              // vložení na index 0
cisla.Remove(2);                 // odstranění prvku s hodnotou 2
cisla.RemoveAt(0);               // odstranění na indexu 0
bool obsahuje = cisla.Contains(3);
int index = cisla.IndexOf(4);
cisla.Sort();
cisla.Reverse();
Console.WriteLine(cisla.Count);  // velikost
```

### Jak List interně funguje

Uvnitř Listu je **schované obyčejné pole**. Když se naplní:

1. List vytvoří **nové pole, typicky dvojnásobné velikosti**
2. **Zkopíruje** všechny prvky ze starého do nového
3. Staré pole **zahodí** (garbage collection)

```
Začátek (kapacita 4):                    Po přidání 5. prvku (kapacita 8):
┌────┬────┬────┬────┐                    ┌────┬────┬────┬────┬────┬────┬────┬────┐
│ 1  │ 2  │ 3  │ 4  │  ─── grow ───▶     │ 1  │ 2  │ 3  │ 4  │ 5  │    │    │    │
└────┴────┴────┴────┘                    └────┴────┴────┴────┴────┴────┴────┴────┘
                                           (4 prázdné sloty rezervované)
```

> **Drobnost:** Tahle realokace stojí čas, ale **amortizovaně** je `Add()` pořád O(1), protože probíhá zřídka (každé zdvojnásobení).
> 

### Klíčové metody List<T>

| Metoda | Co dělá | Složitost |
| --- | --- | --- |
| `Add(item)` | Přidat na konec | O(1) amortizovaně |
| `Insert(index, item)` | Vložit na pozici | O(n) (posun) |
| `Remove(item)` | Odstranit první výskyt | O(n) (najít + posun) |
| `RemoveAt(index)` | Odstranit na pozici | O(n) (posun) |
| `Contains(item)` | Obsahuje? | O(n) |
| `IndexOf(item)` | Index nebo -1 | O(n) |
| `Sort()` | Seřadit | O(n log n) |
| `Count` | Velikost | O(1) |
| `list[i]` | Přístup přes index | O(1) |

> ArrayList je **negenerická legacy verze** Listu (`ArrayList list = new ArrayList()`). Ukládá objekty různých typů. **Nepoužívej**, je pomalejší (boxing/unboxing) a méně bezpečný.
> 

---

### Zásobník (Stack): LIFO

**Stack** (zásobník): kolekce, kde se přidává a odebírá **z jednoho konce** (vrcholu). Princip **Last-In-First-Out**: poslední dovnitř, první ven.

### Vizualizace

```
Push("A"):       Push("B"):       Push("C"):       Pop():        ← vrátí "C"

  │ A │            │ B │            │ C │            │ B │
                   │ A │            │ B │            │ A │
                                    │ A │
   ▲                ▲                ▲                ▲
  TOP              TOP              TOP              TOP

(Jako talíře na sobě: dáváš a bereš shora.)
```

### Operace

| Metoda | Co dělá | Složitost |
| --- | --- | --- |
| `Push(item)` | Přidá na vrchol | O(1) |
| `Pop()` | Odebere a vrátí vrchol | O(1) |
| `Peek()` | Vrátí vrchol bez odebrání | O(1) |
| `Count` | Velikost | O(1) |

### Použití v C#

```csharp
Stack<int> stack = new Stack<int>();
stack.Push(10);
stack.Push(20);
stack.Push(30);

Console.WriteLine(stack.Pop());    // 30
Console.WriteLine(stack.Peek());   // 20 (jen mrkne, neodebere)
Console.WriteLine(stack.Count);    // 2
```

### Reálné použití

- **Undo historie** (Ctrl+Z): poslední akce, kterou jsi udělal, je první, kterou vrátíš zpět
- **Volání funkcí** (call stack): poslední zavolaná funkce se vrátí jako první
- **Vyhodnocování výrazů** (RPN, parsování závorek)
- **Backtracking** algoritmy (DFS, řešení bludišť)
- **Hanojské věže**

---

### Fronta (Queue): FIFO

**Queue** (fronta): kolekce, kde se přidává **na konec** a odebírá **ze začátku**. Princip **First-In-First-Out**: první dovnitř, první ven.

### Vizualizace

```
Enqueue:   X → Y → Z → ... → ▶ (konec fronty, zezadu)
Dequeue:                     ▶ X (přední, vepředu)

Stav fronty po Enqueue("X"), Enqueue("Y"), Enqueue("Z"):

   front                        back
     ▼                            ▼
   ┌───┬───┬───┐
   │ X │ Y │ Z │
   └───┴───┴───┘
     ▲
   Dequeue() vrátí "X" (nejstarší)

Po Dequeue():
   ┌───┬───┐
   │ Y │ Z │
   └───┴───┘
```

### Operace

| Metoda | Co dělá | Složitost |
| --- | --- | --- |
| `Enqueue(item)` | Přidá na konec | O(1) |
| `Dequeue()` | Odebere a vrátí první | O(1) |
| `Peek()` | Vrátí první bez odebrání | O(1) |
| `Count` | Velikost | O(1) |

### Použití v C#

```csharp
Queue<string> queue = new Queue<string>();
queue.Enqueue("X");
queue.Enqueue("Y");
queue.Enqueue("Z");

Console.WriteLine(queue.Dequeue());   // "X" (první)
Console.WriteLine(queue.Peek());       // "Y"
Console.WriteLine(queue.Count);        // 2
```

### Reálné použití

- **Fronta u pokladny / na úřadě** (jak jinak)
- **Tisková fronta** (printer queue)
- **Zpracování událostí** (event loop, message queue)
- **BFS algoritmus** (procházení grafu/stromu do šířky)
- **Buffer pro produkční/konzumentský pattern**

---

### Slovník (Dictionary): k:v

**`Dictionary<TKey, TValue>`**: kolekce **párů klíč-hodnota**. Místo indexu (0, 1, 2...) je **klíč** (typicky string, ale lze i jiný typ).

### Princip: hashovací tabulka

Aby počítač nemusel hledat lineárně, **klíč se zahashuje** na číslo a to slouží jako index do vnitřního pole.

```
Dictionary<string, int> ages = ...

  ages["Alice"] = 25;

  "Alice" → hash("Alice") = 4172 → bucket[4172 % 16] = bucket[12]

  vnitřní pole (buckets):
  ┌───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬─────────┬───┬───┬───┐
  │   │   │   │   │   │   │   │   │   │   │   │   │ Alice→25│   │   │   │
  └───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴─────────┴───┴───┴───┘
                                                       ▲
                                                   bucket 12

  ages["Alice"] → hash znovu spočítá → jdi do bucketu 12 → vrať 25
```

> Díky tomu je **`ages["Alice"]` operace O(1)**, místo O(n) jako u Listu.
> 

### Operace

| Metoda | Co dělá | Složitost |
| --- | --- | --- |
| `dict[key] = value` | Přidat/aktualizovat | O(1) průměrně |
| `dict[key]` | Získat | O(1) průměrně |
| `Add(key, value)` | Přidat (chyba při kolizi klíče) | O(1) průměrně |
| `Remove(key)` | Odstranit | O(1) průměrně |
| `ContainsKey(key)` | Obsahuje klíč? | O(1) průměrně |
| `TryGetValue(key, out value)` | Bezpečné získání | O(1) průměrně |
| `Count` | Velikost | O(1) |

### Použití v C#

```csharp
Dictionary<string, int> veky = new Dictionary<string, int>
{
    { "axo", 18 },
    { "martin", 19 },
    { "roman", 20 }
};

Console.WriteLine(veky["axo"]);             // 18

veky["axo"] = 19;                            // update
veky.Add("standa", 17);                       // přidání nového

if (veky.ContainsKey("eva"))
{
    Console.WriteLine(veky["eva"]);
}

// Bezpečnější přístup
if (veky.TryGetValue("eva", out int vek))
{
    Console.WriteLine(vek);
}

// Iterace
foreach (KeyValuePair<string, int> par in veky)
{
    Console.WriteLine($"{par.Key}: {par.Value}");
}
```

### Reálné použití

- **Cache** (klíč → výsledek)
- **Indexování dat** (ID studenta → objekt studenta)
- **Počítání výskytů** (slovo → počet)
- **Konfigurace** (název nastavení → hodnota)
- **Phone book** (jméno → telefon)
- **DNS** (doména → IP)

---

### HashSet: unikátní hodnoty

**`HashSet<T>`**: jako Dictionary, ale **jen klíče, žádné hodnoty**. Slouží pro **rychlou kolekci bez duplikátů**.

```csharp
HashSet<string> jmena = new HashSet<string>();
jmena.Add("axo");
jmena.Add("martin");
jmena.Add("axo");                            // ignorováno (už tam je)

Console.WriteLine(jmena.Count);              // 2
Console.WriteLine(jmena.Contains("axo"));    // True (O(1))
```

### Operace

| Metoda | Co dělá | Složitost |
| --- | --- | --- |
| `Add(item)` | Přidá pokud není | O(1) průměrně |
| `Remove(item)` | Odstraní | O(1) průměrně |
| `Contains(item)` | Obsahuje? | O(1) průměrně |

### HashSet vs List

|  | List<T> | HashSet<T> |
| --- | --- | --- |
| Duplikáty | Povoleny | Zakázány |
| Pořadí | Zachované | Nezachované |
| Přístup přes index | Ano | Ne |
| `Contains()` | O(n) | O(1) |
| Vhodný pro | Sekvenční data | Test příslušnosti |

### Kdy HashSet

Když máš velký seznam a často potřebuješ ověřit, jestli něco obsahuje:

```csharp
// Pomalu: list.Contains() je O(n), pro 1M prvků 1M operací
List<string> emails = new List<string>(/* milion emailů */);
if (emails.Contains("axo@example.com")) { ... }

// Rychle: hashset.Contains() je O(1), pro 1M prvků 1 operace
HashSet<string> emailySet = new HashSet<string>(emails);
if (emailySet.Contains("axo@example.com")) { ... }
```

---

### Další kolekce (krátce)

### `LinkedList<T>`

Klasický spojový seznam, který znáš z otázky 9. V .NET je obousměrný.

```csharp
LinkedList<int> ll = new LinkedList<int>();
ll.AddFirst(1);
ll.AddLast(2);
ll.AddLast(3);
```

Použití: vzácně. Pro většinu úloh je `List<T>` dostatečný a rychlejší (lepší cache locality).

### `SortedDictionary<K, V>`

Dictionary, ale **vnitřně Red-Black tree**. Pomalejší než Dictionary (O(log n)), ale **klíče jsou seřazené**.

```csharp
SortedDictionary<string, int> sorted = new SortedDictionary<string, int>();
sorted["b"] = 2;
sorted["a"] = 1;
sorted["c"] = 3;

foreach (var par in sorted)
{
    Console.WriteLine(par.Key);    // a, b, c (seřazeně)
}
```

### Concurrent kolekce

Pro vícevláknové (paralelní) programování. Thread-safe, atomické operace.

```csharp
ConcurrentDictionary<int, string> dict = new ConcurrentDictionary<int, string>();

Parallel.For(0, 1000, i =>
{
    dict.TryAdd(i, $"Hodnota {i}");
});
```

| Typ | Klasická verze |
| --- | --- |
| `ConcurrentDictionary<K,V>` | `Dictionary<K,V>` |
| `ConcurrentStack<T>` | `Stack<T>` |
| `ConcurrentQueue<T>` | `Queue<T>` |
| `ConcurrentBag<T>` | (žádná) |

> Pro maturitu stačí vědět, že existují. Detailně se s nimi pracuje při paralelizaci.
> 

---

### Srovnání všech kolekcí: Big O

| Kolekce | Přidání | Odstranění | Vyhledání | Přístup |
| --- | --- | --- | --- | --- |
| **Array** | O(n) (nelze přímo) | O(n) (nelze přímo) | O(n) | O(1) |
| **List<T>** | O(1) ¹ | O(n) | O(n) | O(1) |
| **Stack<T>** | O(1) (Push) | O(1) (Pop) | O(n) | jen vrchol |
| **Queue<T>** | O(1) (Enqueue) | O(1) (Dequeue) | O(n) | jen přední |
| **Dictionary<K,V>** | O(1) | O(1) | O(1) | O(1) přes klíč |
| **HashSet<T>** | O(1) | O(1) | O(1) | (test obsažení) |
| **LinkedList<T>** | O(1) na okrajích | O(1) známý uzel | O(n) | O(n) |
| **SortedDictionary<K,V>** | O(log n) | O(log n) | O(log n) | O(log n) přes klíč |

¹ Amortizovaně, občas O(n) při realokaci.

---

### Časté chyby

| Chyba | Důsledek | Řešení |
| --- | --- | --- |
| Použití `ArrayList` místo `List<T>` | Boxing/unboxing, pomalé | Vždy generika `List<T>` |
| `list[i]` mimo rozsah | `IndexOutOfRangeException` | Kontrola `i < list.Count` |
| `dict[klic]` pro neexistující klíč | `KeyNotFoundException` | Použít `TryGetValue` nebo `ContainsKey` |
| `Pop`/`Dequeue` na prázdné kolekci | `InvalidOperationException` | Kontrola `Count > 0` |
| Modifikace kolekce během `foreach` | `InvalidOperationException` | Iterovat přes kopii nebo `for` cyklus |
| Použití HashSet pro pořadí | Pořadí není zaručené | Použít `List` nebo `SortedSet` |
| Třída bez `GetHashCode/Equals` jako klíč | Špatné chování v Dictionary | Implementovat oba (nebo `record`) |

---

# Část 2: Praktická úloha

### Co může praktická úloha obsahovat

Typická úloha:

- **Implementace vlastního Stack<T>** pomocí `List<T>` nebo pole jako underlying struktury
- **Implementace vlastní Queue<T>** pomocí `List<T>` nebo pole
- **Vlastní třída využívající Dictionary** (telefonní seznam, evidence studentů, slovník)
- **Demonstrace operací**: Push/Pop, Enqueue/Dequeue, přístup přes klíč
- **Generika `<T>`** pro typovou bezpečnost

### Příklad zadání: Vlastní kolekce + Telefonní seznam

Vytvoř v C# program, který:

1. **Implementuje generickou třídu `MujStack<T>`** s metodami:
    - `Push(T item)`
    - `Pop()`: odebere a vrátí vrchol
    - `Peek()`: vrátí vrchol bez odebrání
    - `Count` (property)
    - `IsEmpty` (property)
    - Vnitřně používá `List<T>`
2. **Implementuje generickou třídu `MujQueue<T>`** s analogickými metodami:
    - `Enqueue(T item)`
    - `Dequeue()`
    - `Peek()`
    - `Count`, `IsEmpty`
3. **Implementuje třídu `TelefonniSeznam`** pomocí `Dictionary<string, string>`:
    - `Pridat(string jmeno, string telefon)`
    - `Najit(string jmeno)`: vrátí číslo nebo null
    - `Odebrat(string jmeno)`
    - `Pocet` (property)
4. **V `Main` demonstruj použití** všech tří tříd.

### Řešení: kompletní C# kód

```csharp
using System;
using System.Collections.Generic;

// ===== VLASTNÍ ZÁSOBNÍK (LIFO) =====
class MujStack<T>
{
    private List<T> _items = new List<T>();

    public int Count => _items.Count;
    public bool IsEmpty => _items.Count == 0;

    public void Push(T item)
    {
        _items.Add(item);                         // přidám na konec listu
    }

    public T Pop()
    {
        if (IsEmpty)
            throw new InvalidOperationException("Stack je prázdný");

        int posledniIndex = _items.Count - 1;
        T item = _items[posledniIndex];           // vezmu poslední
        _items.RemoveAt(posledniIndex);           // odeberu poslední
        return item;
    }

    public T Peek()
    {
        if (IsEmpty)
            throw new InvalidOperationException("Stack je prázdný");

        return _items[_items.Count - 1];          // jen vrátím, neodebírám
    }
}

// ===== VLASTNÍ FRONTA (FIFO) =====
class MujQueue<T>
{
    private List<T> _items = new List<T>();

    public int Count => _items.Count;
    public bool IsEmpty => _items.Count == 0;

    public void Enqueue(T item)
    {
        _items.Add(item);                         // přidám na konec
    }

    public T Dequeue()
    {
        if (IsEmpty)
            throw new InvalidOperationException("Queue je prázdná");

        T item = _items[0];                       // vezmu první
        _items.RemoveAt(0);                       // odeberu první (O(n)!)
        return item;
    }

    public T Peek()
    {
        if (IsEmpty)
            throw new InvalidOperationException("Queue je prázdná");

        return _items[0];                         // jen vrátím první
    }
}

// ===== TŘÍDA SE SLOVNÍKEM =====
class TelefonniSeznam
{
    private Dictionary<string, string> _kontakty = new Dictionary<string, string>();

    public int Pocet => _kontakty.Count;

    public void Pridat(string jmeno, string telefon)
    {
        _kontakty[jmeno] = telefon;               // přepíše, pokud existuje
    }

    public string Najit(string jmeno)
    {
        if (_kontakty.TryGetValue(jmeno, out string telefon))
            return telefon;
        return null;                              // nenalezeno
    }

    public bool Odebrat(string jmeno)
    {
        return _kontakty.Remove(jmeno);           // true pokud odebráno
    }

    public void Vypis()
    {
        foreach (KeyValuePair<string, string> par in _kontakty)
        {
            Console.WriteLine($"  {par.Key}: {par.Value}");
        }
    }
}

// ===== DEMONSTRACE =====
class Program
{
    static void Main()
    {
        // --- Stack ---
        Console.WriteLine("=== MujStack ===");
        MujStack<int> stack = new MujStack<int>();
        stack.Push(10);
        stack.Push(20);
        stack.Push(30);

        Console.WriteLine($"Count: {stack.Count}");        // 3
        Console.WriteLine($"Peek: {stack.Peek()}");        // 30
        Console.WriteLine($"Pop:  {stack.Pop()}");         // 30
        Console.WriteLine($"Pop:  {stack.Pop()}");         // 20
        Console.WriteLine($"Count: {stack.Count}");        // 1

        // --- Queue ---
        Console.WriteLine("\n=== MujQueue ===");
        MujQueue<string> queue = new MujQueue<string>();
        queue.Enqueue("axo");
        queue.Enqueue("martin");
        queue.Enqueue("roman");

        Console.WriteLine($"Count: {queue.Count}");        // 3
        Console.WriteLine($"Peek: {queue.Peek()}");        // "axo"
        Console.WriteLine($"Dequeue: {queue.Dequeue()}");  // "axo"
        Console.WriteLine($"Dequeue: {queue.Dequeue()}");  // "martin"
        Console.WriteLine($"Count: {queue.Count}");        // 1

        // --- Telefonní seznam (Dictionary) ---
        Console.WriteLine("\n=== TelefonniSeznam ===");
        TelefonniSeznam seznam = new TelefonniSeznam();
        seznam.Pridat("axo", "+420 123 456 789");
        seznam.Pridat("martin", "+420 987 654 321");
        seznam.Pridat("roman", "+420 555 666 777");

        Console.WriteLine($"Počet kontaktů: {seznam.Pocet}");
        Console.WriteLine($"Najít axo: {seznam.Najit("axo")}");
        Console.WriteLine($"Najít eva: {seznam.Najit("eva") ?? "nenalezeno"}");

        seznam.Odebrat("martin");
        Console.WriteLine($"\nPo odebrání martina:");
        seznam.Vypis();
    }
}
```

### Výstup programu

```
=== MujStack ===
Count: 3
Peek: 30
Pop:  30
Pop:  20
Count: 1

=== MujQueue ===
Count: 3
Peek: axo
Dequeue: axo
Dequeue: martin
Count: 1

=== TelefonniSeznam ===
Počet kontaktů: 3
Najít axo: +420 123 456 789
Najít eva: nenalezeno

Po odebrání martina:
  axo: +420 123 456 789
  roman: +420 555 666 777
```

### Co se v řešení děje

**MujStack** používá `List<T>` jako underlying. Push přidává na konec (`_items.Add()`), Pop bere poslední a odebírá (`RemoveAt(Count-1)`). Tím dosahujeme LIFO chování. Vrchol je vždy poslední prvek.

**MujQueue** taky používá `List<T>`. Enqueue přidává na konec, Dequeue bere první (`_items[0]`) a odebírá (`RemoveAt(0)`). Tím dosahujeme FIFO. Pozor: `RemoveAt(0)` je O(n), protože List musí posunout všechny prvky doleva. V reálné implementaci se používá **kruhový buffer** nebo `LinkedList<T>` pro O(1).

**TelefonniSeznam** zapouzdřuje `Dictionary<string, string>` (jméno → telefon). `TryGetValue` je bezpečnější než `dict[key]`, protože nevyhodí výjimku při neexistujícím klíči.

**Generika `<T>`** v MujStack a MujQueue umožňují použít kolekce pro libovolný typ (int, string, vlastní třídy...).

---

### Bonusy

### Bonus A: Stack pro Undo historie

```csharp
class TextEditor
{
    private string _text = "";
    private MujStack<string> _historie = new MujStack<string>();

    public string Text => _text;

    public void Pridat(string co)
    {
        _historie.Push(_text);             // ulož starý stav
        _text += co;
    }

    public void Undo()
    {
        if (!_historie.IsEmpty)
            _text = _historie.Pop();        // vrať poslední stav
    }
}

// Použití:
var editor = new TextEditor();
editor.Pridat("Ahoj ");
editor.Pridat("axo!");
Console.WriteLine(editor.Text);    // "Ahoj axo!"
editor.Undo();
Console.WriteLine(editor.Text);    // "Ahoj "
```

### Bonus B: Počítání slov pomocí Dictionary

```csharp
string text = "axo axo martin roman axo martin";
string[] slova = text.Split(' ');

Dictionary<string, int> pocty = new Dictionary<string, int>();

foreach (string slovo in slova)
{
    if (pocty.ContainsKey(slovo))
        pocty[slovo]++;
    else
        pocty[slovo] = 1;
}

foreach (var par in pocty)
{
    Console.WriteLine($"{par.Key}: {par.Value}");
}
// axo: 3
// martin: 2
// roman: 1
```

### Bonus C: HashSet pro unikátnost

```csharp
List<string> emaily = new List<string>
{
    "axo@example.com",
    "martin@example.com",
    "axo@example.com",
    "roman@example.com",
    "martin@example.com"
};

HashSet<string> unikatne = new HashSet<string>(emaily);
Console.WriteLine($"Celkem: {emaily.Count}");          // 5
Console.WriteLine($"Unikátní: {unikatne.Count}");      // 3
```

---

## Část 3: Tipy pro obhajobu

### Co u obhajoby říct

> *"V zadání jsem implementoval generickou třídu MujStack a MujQueue, obě používají List jako underlying strukturu. Stack funguje LIFO: Push přidává na konec listu, Pop bere poslední a odebírá. Queue funguje FIFO: Enqueue přidává na konec, Dequeue bere první a odebírá z indexu 0. Důležitá poznámka: v mé implementaci je Dequeue O(n), protože RemoveAt(0) musí posunout všechny prvky doleva. Pro produkční použití by se použil kruhový buffer nebo LinkedList. Pro slovník jsem vytvořil TelefonniSeznam, který zapouzdřuje Dictionary string string. Použil jsem TryGetValue místo dict[klic], což je bezpečnější, protože nevyhodí výjimku při neexistujícím klíči. Generika umožňují použít kolekce pro libovolný typ."*
> 

### Klíčové pojmy pro teorii

| Pojem | Rychlá odpověď |
| --- | --- |
| **Kolekce** | Abstraktní datový typ pro ukládání skupiny objektů |
| **Pole (Array)** | Souvislý blok paměti, pevná velikost, O(1) přístup přes index |
| **List<T>** | Dynamická kolekce, uvnitř pole, automatické zvětšování |
| **Stack<T>** | LIFO, Push/Pop/Peek, undo, call stack |
| **Queue<T>** | FIFO, Enqueue/Dequeue/Peek, tisková fronta, BFS |
| **Dictionary<K,V>** | Key-value, hashovací tabulka, O(1) průměrně |
| **HashSet<T>** | Unikátní hodnoty, hash-based, O(1) Contains |
| **Generika `<T>`** | Typová parametrizace, bezpečnost při kompilaci |
| **Hashovací tabulka** | Interní struktura Dictionary a HashSet |
| **Hash funkce** | Mapuje klíč na číslo (index do interního pole) |
| **LIFO** | Last-In-First-Out (zásobník) |
| **FIFO** | First-In-First-Out (fronta) |
| **Amortizovaná složitost** | Průměrná složitost přes víc operací (List.Add) |
| **Boxing/unboxing** | Konverze value type na object a zpět (pomalé, vyhneme se generiky) |
| **Concurrent kolekce** | Thread-safe verze pro paralelní programování |

### Časté chytáky

| Otázka | Odpověď |
| --- | --- |
| *Rozdíl pole a List?* | Pole má pevnou velikost a žádné metody. List se dynamicky zvětšuje, má Add/Remove/Sort... Uvnitř Listu je ale stejně pole. |
| *Rozdíl Stack a Queue?* | Stack je LIFO (poslední dovnitř, první ven). Queue je FIFO (první dovnitř, první ven). |
| *Jak interně funguje Dictionary?* | Hashovací tabulka. Klíč se zahashuje na číslo, to slouží jako index do interního pole. Díky tomu je přístup O(1). |
| *Kdy List a kdy Dictionary?* | List pro sekvenční data, kde záleží na pořadí. Dictionary pro rychlé hledání podle klíče. |
| *Kdy HashSet místo Listu?* | Když potřebuješ ověřit obsah (Contains) a nezáleží na duplikátech/pořadí. HashSet má O(1) Contains, List O(n). |
| *Co je generika a proč?* | Typová parametrizace `<T>`. Bezpečnější (chyba při kompilaci), rychlejší (žádný boxing). |
| *Proč ArrayList nepoužívat?* | Negenerická, ukládá objekty, vyžaduje boxing/unboxing primitiv. Pomalá, méně bezpečná. Použij `List<T>`. |
| *Co je collision v Dictionary?* | Když dva klíče mají stejný hash. Řeší se chaining (linked list v bucketu) nebo open addressing. |
| *Kdy LinkedList<T> místo Listu?* | Velmi vzácně. Když děláš hodně Insert/Remove uprostřed a nepotřebuješ index. V praxi je List skoro vždy rychlejší (cache locality). |
| *Co je amortizovaná složitost Listu?* | List.Add je obvykle O(1). Občas (při překročení kapacity) musí realokovat a kopírovat, to je O(n). Ale "v průměru" zůstává O(1). |

### Časté chyby v praktické úloze

- `MujStack` bez kontroly prázdnosti v Pop (vyhodí IndexOutOfRange)
- `MujQueue.Dequeue` přes `RemoveAt(0)` je O(n) (přijatelné pro maturitu, ale zmínit)
- Použití ArrayList místo `List<T>` (boxing, pomalejší)
- `dict[klic]` bez kontroly existence (KeyNotFoundException)
- Modifikace Dictionary během foreach loop (InvalidOperationException)
- HashSet místo List, když záleží na pořadí
- List místo HashSet pro test Contains v hot loop (O(n) vs O(1))
- Stack.Pop bez Peek-check (popnu, ale nepoužiju)
- Žádná generika, jen object (boxing, type erasure)
- Třída jako klíč Dictionary bez GetHashCode/Equals (špatné chování)
- Zapomenutí, že Dictionary nezachovává pořadí (na rozdíl od SortedDictionary)
- `IsEmpty` přes `Count == 0` místo readable property (kosmetika)