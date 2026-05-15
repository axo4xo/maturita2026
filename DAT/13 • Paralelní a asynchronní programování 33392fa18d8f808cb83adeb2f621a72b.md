# 13 • Paralelní a asynchronní programování

> Použití, výhody, async/await, thread, Task, Parallel, vracení a předávání dat mezi vlákny, synchronizace
> 

> **Formát:** 30 min praktická úloha, 15 min obhajoba + teorie. Teorie pokrývá threads, tasks, async/await, Parallel a synchronizaci. Praktika: hledání maxima paralelně vs sekvenčně s měřením času.
> 

---

# Část 1: Teorie

### Proč to potřebujeme

Moderní procesory mají **více jader** (cores). Program běžící v jednom vlákně využívá jen jedno jádro, ostatní jsou nečinná. Paralelní a asynchronní programování umožňuje:

- **Zrychlit výpočty** rozdělením práce mezi víc jader (CPU-bound)
- **Neblokovat UI / hlavní vlákno** během čekání na pomalé operace (I/O-bound: čtení souboru, HTTP požadavek, dotaz do DB)
- **Reagovat na události** (UI reaguje, zatímco se na pozadí stahují data)

> **Klasický příklad**: webový server zpracovává 1000 požadavků současně. Bez paralelismu by každý uživatel čekal, než server vyřídí předchozího.
> 

---

### Concurrent vs Parallel

| Pojem | Význam |
| --- | --- |
| **Concurrent (souběžný)** | Více úloh se **střídá** na jednom jádře (rychlé přepínání). Vypadá to paralelně. |
| **Parallel (paralelní)** | Více úloh běží **opravdu současně** na různých jádrech. |

```
Concurrent (1 jádro, střídání):
  Jádro 1: [A][B][A][B][A][B][A]   ← rychlé přepínání mezi úlohami

Parallel (2 jádra, opravdu zároveň):
  Jádro 1: [A][A][A][A][A][A][A]
  Jádro 2: [B][B][B][B][B][B][B]
```

V praxi se pojmy často zaměňují. .NET ti to navíc skrývá: napíšeš `Task.Run(...)` a runtime se rozhodne, zda ho pustí na samostatném jádru, nebo přidá do fronty.

---

### CPU-bound vs I/O-bound

Klíčové rozdělení úloh:

| Typ | Co dělá | Jak řešit |
| --- | --- | --- |
| **CPU-bound** | Náročný výpočet (faktoriál, šifrování, zpracování obrazu) | `Task.Run`, `Parallel.For` (využít víc jader) |
| **I/O-bound** | Čeká na vnější zdroj (disk, síť, DB) | `async`/`await` (vlákno se uvolní pro jinou práci) |

> **Pravidlo**: `Task.Run` použij na **výpočty**. `await` použij na **čekání**. Když to obrátíš, plýtváš zdroji.
> 

---

### Process, Thread, Task

| Pojem | Co to je |
| --- | --- |
| **Process (proces)** | Spuštěná instance programu s vlastní pamětí (např. `chrome.exe`) |
| **Thread (vlákno)** | Jednotka výkonu uvnitř procesu, sdílí paměť s ostatními vlákny |
| **Task (úloha)** | Abstrakce nad vlákny, reprezentuje budoucí výsledek operace na ThreadPool |

```
┌─────────── PROCES (chrome.exe) ───────────┐
│                                            |
│  ┌─Sdílená paměť (kód, data, heap)   ─┐    │
│  └────────────────────────────────────┘    │
│                                            │
│  ┌─ Vlákno 1  ─┐  ┌─ Vlákno 2  ─┐  ┌── ─┐  │
│  │ stack       │  │ stack       │  │ ...│  │
│  │ registry    │  │ registry    │  │    │  │
│  └─────────────┘  └─────────────┘  └────┘  │
└────────────────────────────────────────────┘
```

### Thread Pool

.NET má vestavěný **ThreadPool**: sadu předem vytvořených vláken, které se znovupoužívají. Když pustíš `Task.Run(...)`, .NET si vezme volné vlákno z ThreadPoolu a po skončení ho vrátí.

> Vytváření nového `Thread` je drahé (operační systém ho musí vytvořit), proto preferujeme `Task`, který recykluje vlákna z poolu.
> 

---

### Thread (System.Threading.Thread)

**Nízkoúrovňové API**, přímo vytvoří OS vlákno. V moderním .NET kódu se používá zřídka, preferuj `Task`.

```csharp
using System.Threading;

Thread t = new Thread(() => {
    Console.WriteLine("Běžím v jiném vlákně!");
});
t.Start();   // spustí vlákno
t.Join();    // počká, až skončí
```

### Předání parametru do Thread

```csharp
// 1. Přes lambda capture (nejčastější)
int x = 5;
Thread t1 = new Thread(() => Console.WriteLine(x));
t1.Start();

// 2. Přes ParameterizedThreadStart (object → cast)
Thread t2 = new Thread(param => {
    int n = (int)param;
    Console.WriteLine(n);
});
t2.Start(69);
```

### Vrácení hodnoty z Thread

> **Drobnost k tvé poznámce**: Thread **umí** vracet data, ale **ne přímo přes return value**. Musí to být přes **sdílenou proměnnou** zachycenou v closure.
> 

```csharp
int vysledek = 0;
Thread t = new Thread(() => vysledek = 1 + 2);
t.Start();
t.Join();
Console.WriteLine(vysledek); // 3
```

Tohle je nepříjemné a chyby-prone (musíš si pamatovat na Join před čtením). Proto se v moderním .NET preferuje **`Task<T>`**, který má vracení v sobě.

---

### Task (System.Threading.Tasks.Task)

**Vysokoúrovňová abstrakce**, používá se v 99 % případů.

### Task (bez návratové hodnoty)

```csharp
Task t = Task.Run(() => {
    Console.WriteLine("Pracuji...");
});
t.Wait();    // počká synchronně (blokuje vlákno)
// nebo:
await t;     // počká asynchronně (uvolní vlákno)
```

### Task<T> (s návratovou hodnotou)

```csharp
Task<int> t = Task.Run(() => {
    Thread.Sleep(1000);
    return 67;
});

int vysledek = await t;
Console.WriteLine(vysledek);   // 67
```

### Více úloh paralelně

```csharp
Task<int> t1 = Task.Run(() => Pocitej(1));
Task<int> t2 = Task.Run(() => Pocitej(2));
Task<int> t3 = Task.Run(() => Pocitej(3));

// Počká na všechny, vrátí pole výsledků
int[] vysledky = await Task.WhenAll(t1, t2, t3);

// Nebo: počkej na první hotový
Task<int> prvni = await Task.WhenAny(t1, t2, t3);
```

### Důležité metody

| Metoda | Co dělá |
| --- | --- |
| `Task.Run(action)` | Pustí akci na ThreadPool |
| `Task.WhenAll(tasks)` | Skončí, až skončí všechny |
| `Task.WhenAny(tasks)` | Skončí, až skončí první |
| `Task.Delay(ms)` | Asynchronní čekání (nahrazuje Thread.Sleep) |
| `Task.Wait()` | Synchronně počká (blokuje, pozor na deadlock) |
| `await task` | Asynchronně počká (uvolní vlákno) |

---

### async / await

Klíčová slova pro **asynchronní programování**. Nezakládají vlákno, pouze umožní vláknu se uvolnit, dokud čeká.

### Syntaxe

```csharp
public async Task<string> StahniDataAsync()
{
    using HttpClient klient = new HttpClient();
    string odpoved = await klient.GetStringAsync("https://api.example.com/data");
    return odpoved;
}
```

**Pravidla:**

- Metoda musí mít klíčové slovo `async`
- Návratový typ musí být `Task`, `Task<T>` nebo `void` (jen pro event handlery)
- Konvence: jméno končí na `Async`
- `await` může být jen uvnitř `async` metody

### Jak to funguje pod kapotou

```csharp
async Task PrikladAsync()
{
    Console.WriteLine("Před await");
    await Task.Delay(1000);            // ← zde se vlákno uvolní pro jinou práci
    Console.WriteLine("Po await");      // ← může běžet na jiném vlákně
}
```

Kompilátor přepíše metodu na **state machine**: rozdělí ji na části před a po každém `await`. Vlákno se vrátí volajícímu, a po dokončení Task se metoda obnoví (často na jiném vlákně).

```
Synchronní (blokuje):              Asynchronní (uvolňuje vlákno):

Vlákno: [───čekám 1s───][pokračuji]    Vlákno: [─][pracuje jinde][pokračuji]
        ↑                                       ↑                  ↑
       čeká bezvýznamně                       await spuštěno      Task dokončen
```

### async void: pozor

```csharp
async void Nebezpecne()    // ← VYHNI SE TOMUTO
{
    await Task.Delay(1000);
    throw new Exception();   // tato výjimka spadne celou aplikaci!
}
```

`async void` použij **jen pro event handlery** (např. `Button_Click`). Jinak **vždy `async Task`**.

---

### Parallel (System.Threading.Tasks.Parallel)

Třída pro **paralelní iteraci**, automaticky rozdělí práci mezi vlákna.

### Parallel.For

```csharp
// Synchronně iteruje 0..99, ale paralelně
Parallel.For(0, 100, i => {
    Console.WriteLine($"i = {i}");
});
```

Vlákna si práci rozdělí samy. Pořadí výstupu je nedeterministické.

### Parallel.ForEach

```csharp
string[] soubory = { "a.txt", "b.txt", "c.txt" };
Parallel.ForEach(soubory, soubor => {
    string obsah = File.ReadAllText(soubor);
    Zpracuj(obsah);
});
```

### Parallel.Invoke

Spustí víc různých metod paralelně:

```csharp
Parallel.Invoke(
    () => Metoda1(),
    () => Metoda2(),
    () => Metoda3()
);
```

### ParallelOptions: řízení počtu vláken

```csharp
ParallelOptions opts = new ParallelOptions
{
    MaxDegreeOfParallelism = Environment.ProcessorCount   // počet jader
};

Parallel.For(0, 1000, opts, i => Pracuj(i));
```

`Environment.ProcessorCount` vrátí počet logických jader CPU.

---

### Předávání a vracení dat mezi vlákny

### Předání dat (input)

Nejjednodušší: **lambda capture** (zachycení proměnné).

```csharp
int n = 10;
Task t = Task.Run(() => Console.WriteLine(n));   // n je zachyceno
```

**Pozor na closure v cyklu**: proměnná cyklu je sdílená!

```csharp
// ❌ ŠPATNĚ: všechny tasky vypíší 10
for (int i = 0; i < 10; i++)
{
    Task.Run(() => Console.WriteLine(i));
}

// ✓ SPRÁVNĚ: vytvoř lokální kopii
for (int i = 0; i < 10; i++)
{
    int kopie = i;
    Task.Run(() => Console.WriteLine(kopie));
}
```

> Tohle je klasický bug. Lambda zachytí **referenci** na proměnnou `i`, ne její hodnotu. Než se task spustí, `i` může být už jiné. Trochu menší riziko ve `foreach` (od C# 5+ má každá iterace svou proměnnou).
> 

### Vrácení dat (output)

| Způsob | Příklad |
| --- | --- |
| **`Task<T>` (preferované)** | `int v = await Task.Run(() => 67);` |
| Sdílená proměnná + Join() | `Thread t = ...; t.Join(); var x = sdilena;` |
| `out` parametr | Nelze v async metodách |
| Callback | `Task.Run(() => { var v = ...; OnHotovo(v); });` |

---

### Synchronizace

Když více vláken čte/zapisuje do stejné proměnné, vznikají **race conditions**: nedeterministické chyby.

### Problém: Race condition

```csharp
int citac = 0;

Parallel.For(0, 1_000_000, i => {
    citac++;   // ← race condition!
});

Console.WriteLine(citac);   // očekáváme 1 000 000, ale je to méně
```

`citac++` **není atomická operace**, je to: čtení → přičtení → zápis. Dvě vlákna mohou přečíst stejnou hodnotu a vzájemně se přepsat.

```
Vlákno A: čte citac (5) → +1 → píše 6
Vlákno B: čte citac (5) → +1 → píše 6     ← mělo být 7!
```

### Řešení 1: `lock`

```csharp
object zamek = new object();
int citac = 0;

Parallel.For(0, 1_000_000, i => {
    lock (zamek)
    {
        citac++;
    }
});
```

`lock` zajistí, že **jen jedno vlákno** je v daném bloku najednou. Ostatní čekají.

**Pravidla pro lock:**

- Vždy zamykej **`private readonly object`**, ne `this` ani typ
- Drž zámek **co nejkratší dobu**
- **Nikdy ne `await` uvnitř lock** (může způsobit deadlock)

### Řešení 2: `Interlocked` (rychlejší pro jednoduché operace)

```csharp
int citac = 0;
Parallel.For(0, 1_000_000, i => {
    Interlocked.Increment(ref citac);
});
```

| Metoda | Co dělá |
| --- | --- |
| `Interlocked.Increment(ref x)` | `x++` atomicky |
| `Interlocked.Decrement(ref x)` | `x--` atomicky |
| `Interlocked.Add(ref x, n)` | `x += n` atomicky |
| `Interlocked.Exchange(ref x, n)` | Atomicky nastav novou hodnotu |

Interlocked je rychlejší než lock pro jednoduché aritmetické operace (CPU má speciální atomické instrukce).

### Řešení 3: Concurrent kolekce

Místo zamykání běžné kolekce použij **thread-safe verzi**:

| Standardní | Thread-safe |
| --- | --- |
| `List<T>` | `ConcurrentBag<T>` |
| `Dictionary<K,V>` | `ConcurrentDictionary<K,V>` |
| `Queue<T>` | `ConcurrentQueue<T>` |
| `Stack<T>` | `ConcurrentStack<T>` |

```csharp
ConcurrentBag<int> bag = new ConcurrentBag<int>();
Parallel.For(0, 1000, i => bag.Add(i));   // bezpečné
```

---

### Další synchronizační primitiva

| Primitivum | Použití |
| --- | --- |
| **`Monitor`** | `lock` je syntaktický cukr nad ním |
| **`Mutex`** | Jako `lock`, ale i mezi procesy |
| **`SemaphoreSlim`** | Povolí N současných přístupů (např. max 3 tasky) |
| **`ManualResetEvent`** | Signalizace (jedno vlákno čeká, druhé "otevře dveře") |
| **`CancellationToken`** | Zrušení dlouho běžícího Tasku |

---

### Deadlock

Vznikne, když dvě vlákna čekají navzájem na uvolnění zámku:

```
Vlákno A:  lock(X) { lock(Y) { ... } }
Vlákno B:  lock(Y) { lock(X) { ... } }
```

A drží X, čeká na Y. B drží Y, čeká na X. **Zamrznutí**.

**Prevence**: Vždy zamykej zámky ve **stejném pořadí** (např. abecedně podle jména).

---

### CancellationToken: zrušení Tasku

```csharp
CancellationTokenSource cts = new CancellationTokenSource();
CancellationToken token = cts.Token;

Task t = Task.Run(() => {
    for (int i = 0; i < 100; i++)
    {
        token.ThrowIfCancellationRequested();
        Thread.Sleep(100);
    }
}, token);

// Po 1 s zruš
await Task.Delay(1000);
cts.Cancel();   // způsobí OperationCanceledException uvnitř Tasku
```

Použití: storno tlačítko v UI, timeout pro HTTP request, atd.

---

### PLINQ (Parallel LINQ)

Paralelní verze LINQ. Přidáš `.AsParallel()` a runtime úlohu rozdělí:

```csharp
int[] cisla = Enumerable.Range(1, 1_000_000).ToArray();

int suma = cisla.AsParallel()           // ← spustí to paralelně
                .Where(x => x % 2 == 0)
                .Sum();
```

> **Pozor**: PLINQ má **overhead** (rozdělení práce, synchronizace, sloučení výsledků). Pro malá data je pomalejší než LINQ. Vyplatí se pro **velká data nebo náročné operace**.
> 

---

### Měření času: Stopwatch

```csharp
using System.Diagnostics;

Stopwatch sw = Stopwatch.StartNew();

// ... práce ...

sw.Stop();
Console.WriteLine($"Trvalo: {sw.ElapsedMilliseconds} ms");
```

`Stopwatch` je přesnější než `DateTime.Now` (high-resolution timer).

---

### Cheat sheet

| Situace | Použij |
| --- | --- |
| Stáhnout data z internetu | `await HttpClient.GetAsync(...)` |
| Načíst soubor | `await File.ReadAllTextAsync(...)` |
| Náročný výpočet | `await Task.Run(() => ...)` |
| Více výpočtů paralelně | `Parallel.For` nebo `Task.WhenAll` |
| Iterovat kolekci paralelně | `Parallel.ForEach` |
| Čekat na všechny | `await Task.WhenAll(t1, t2)` |
| Čekat na první | `await Task.WhenAny(t1, t2)` |
| Asynchronní pauza | `await Task.Delay(1000)` |
| Synchronizace | `lock`, `Interlocked`, `Concurrent*` |
| Zrušit Task | `CancellationToken` |
| Měřit čas | `Stopwatch.StartNew()` |

---

### Časté chyby

| Chyba | Důsledek | Řešení |
| --- | --- | --- |
| `Thread.Sleep` v async metodě | Blokuje vlákno | `await Task.Delay(...)` |
| `task.Wait()` v UI vlákně | Deadlock | `await task` |
| `async void` mimo event handler | Nelze odchytit výjimku | `async Task` |
| Sdílená proměnná bez `lock` | Race condition | `lock` / `Interlocked` |
| Lambda capture proměnné v `for` | Všichni vidí poslední hodnotu | Lokální kopie uvnitř cyklu |
| `await` uvnitř `lock` | Může deadlockovat | Refaktorovat, lock nesmí čekat |
| `Task.Run` pro I/O operace | Plýtvání vláken | Přímo `await asyncMethoda()` |
| Příliš mnoho tasků pro malý data | Overhead > zisk | Pro málo dat sekvenčně |
| Nezamykat zámky ve stejném pořadí | Deadlock | Konzistentní pořadí |

---

# Část 2: Praktická úloha

### Co může praktická úloha obsahovat

Typická úloha:

- **Sekvenční vs paralelní výpočet** s měřením času (`Stopwatch`)
- **Rozdělení pole** na N částí podle počtu jader
- **`Task.Run`** pro každou část s návratovou hodnotou (`Task<T>`)
- **`Task.WhenAll`** pro čekání na všechny tasky
- **Demo zrychlení**: porovnat časy obou variant
- **Bonus**: `Parallel.For`, PLINQ, `async/await` s `Task.Delay`

### Příklad zadání: Hledání maxima paralelně vs sekvenčně

Vytvoř konzolovou aplikaci v C#, která **najde největší číslo v poli** dvěma způsoby a **porovná čas**:

1. **Sekvenčně**: klasický `for` cyklus na jednom vlákně
2. **Paralelně**: pomocí `Task` rozděleného na N částí (N = počet jader)

Nakonec vypiš výsledek a délku obou variant. U velkých polí má být paralelní verze znatelně rychlejší.

### Řešení: kompletní `Program.cs`

```csharp
using System.Diagnostics;

class Program
{
    static async Task Main()
    {
        // 1) Vygeneruj velké pole
        const int VELIKOST = 100_000_000;
        int[] cisla = VygenerujPole(VELIKOST);

        Console.WriteLine($"Pole obsahuje {VELIKOST:N0} čísel.");
        Console.WriteLine($"Počet jader CPU: {Environment.ProcessorCount}\n");

        // 2) SEKVENČNĚ
        Stopwatch sw1 = Stopwatch.StartNew();
        int maxSekvencne = NajdiMaxSekvencne(cisla);
        sw1.Stop();
        Console.WriteLine($"Sekvenčně:  max = {maxSekvencne}, čas = {sw1.ElapsedMilliseconds} ms");

        // 3) PARALELNĚ
        Stopwatch sw2 = Stopwatch.StartNew();
        int maxParalelne = await NajdiMaxParalelne(cisla);
        sw2.Stop();
        Console.WriteLine($"Paralelně:  max = {maxParalelne}, čas = {sw2.ElapsedMilliseconds} ms");

        // 4) Zrychlení
        double zrychleni = (double)sw1.ElapsedMilliseconds / sw2.ElapsedMilliseconds;
        Console.WriteLine($"\nZrychlení: {zrychleni:F2}×");
    }

    // ===== POMOCNÉ METODY =====

    static int[] VygenerujPole(int velikost)
    {
        Random rnd = new Random(67);   // seed pro opakovatelnost
        int[] pole = new int[velikost];
        for (int i = 0; i < velikost; i++)
            pole[i] = rnd.Next();
        return pole;
    }

    // ===== SEKVENČNÍ HLEDÁNÍ =====
    static int NajdiMaxSekvencne(int[] pole)
    {
        int max = pole[0];
        for (int i = 1; i < pole.Length; i++)
        {
            if (pole[i] > max)
                max = pole[i];
        }
        return max;
    }

    // ===== PARALELNÍ HLEDÁNÍ =====
    static async Task<int> NajdiMaxParalelne(int[] pole)
    {
        int pocetJader = Environment.ProcessorCount;
        int velikostCasti = pole.Length / pocetJader;

        // Vytvoříme task pro každou část pole
        Task<int>[] tasky = new Task<int>[pocetJader];

        for (int j = 0; j < pocetJader; j++)
        {
            int start = j * velikostCasti;
            int end = (j == pocetJader - 1)
                ? pole.Length          // poslední část vezme zbytek
                : start + velikostCasti;

            // Lokální proměnné kvůli closure (DŮLEŽITÉ!)
            int lokalniStart = start;
            int lokalniEnd = end;

            tasky[j] = Task.Run(() => NajdiMaxVCasti(pole, lokalniStart, lokalniEnd));
        }

        // Počkáme na všechny tasky
        int[] dilciMaxima = await Task.WhenAll(tasky);

        // Vrátíme maximum ze všech dílčích maxim
        int celkoveMax = dilciMaxima[0];
        for (int i = 1; i < dilciMaxima.Length; i++)
        {
            if (dilciMaxima[i] > celkoveMax)
                celkoveMax = dilciMaxima[i];
        }
        return celkoveMax;
    }

    // Pomocná metoda: najde max v dané části pole
    static int NajdiMaxVCasti(int[] pole, int start, int end)
    {
        int max = pole[start];
        for (int i = start + 1; i < end; i++)
        {
            if (pole[i] > max)
                max = pole[i];
        }
        return max;
    }
}
```

### Očekávaný výstup

```
Pole obsahuje 100,000,000 čísel.
Počet jader CPU: 8

Sekvenčně:  max = 2147483594, čas = 350 ms
Paralelně:  max = 2147483594, čas = 60 ms

Zrychlení: 5.83×
```

> Konkrétní časy závisí na hardwaru. Důležité je, že paralelní je **výrazně rychlejší** a obě varianty vrátí **stejný výsledek**.
> 

### Co se v řešení děje

**Sekvenční verze** je klasický for cyklus: projde všechna čísla, drží si dosavadní maximum. O(n), jedno vlákno.

**Paralelní verze** rozdělí práci:

1. Spočítá počet jader (`Environment.ProcessorCount`)
2. Rozdělí pole na N stejně velkých částí (poslední vezme i zbytek po dělení)
3. Pro každou část vytvoří `Task<int>`, který najde max v té části
4. **Lokální proměnné `lokalniStart` a `lokalniEnd` jsou klíčové** kvůli closure: bez nich by všechny tasky používaly stejné finální hodnoty z for cyklu
5. `Task.WhenAll` počká na všechny tasky a vrátí pole výsledků (dílčí maxima)
6. Finálně najde maximum ze všech dílčích maxim

**Proč to zrychluje**: na 8 jádrech každé jádro zpracuje 1/8 pole paralelně. Teoretické zrychlení 8×, reálné 5-6× (kvůli overhead).

### Bonusy

### Bonus A: Parallel.For s lockem

```csharp
static int NajdiMaxParallelFor(int[] pole)
{
    object zamek = new object();
    int globalniMax = pole[0];

    Parallel.For(0, pole.Length, i => {
        if (pole[i] > globalniMax)
        {
            lock (zamek)
            {
                if (pole[i] > globalniMax)   // double-check
                    globalniMax = pole[i];
            }
        }
    });

    return globalniMax;
}
```

> **Pozor**: `Parallel.For` s lockem na každé iteraci je **pomalejší** než ruční rozdělení tasků, protože lock se volá milionkrát. Lepší je použít overload `Parallel.For` s **thread-local state**.
> 

### Bonus A2: Parallel.For s thread-local state (rychlejší)

```csharp
static int NajdiMaxParallelForLocal(int[] pole)
{
    object zamek = new object();
    int globalniMax = pole[0];

    Parallel.For(
        0, pole.Length,
        () => int.MinValue,                  // init lokálního stavu
        (i, state, localMax) =>              // tělo iterace
            pole[i] > localMax ? pole[i] : localMax,
        localMax =>                          // finalizace (sloučení)
        {
            lock (zamek)
            {
                if (localMax > globalniMax)
                    globalniMax = localMax;
            }
        }
    );

    return globalniMax;
}
```

Každé vlákno má vlastní `localMax`, lock se volá jen jednou na konci. Mnohem rychlejší.

### Bonus B: PLINQ (nejjednodušší zápis)

```csharp
static int NajdiMaxPLINQ(int[] pole)
{
    return pole.AsParallel().Max();
}
```

Jedna řádka. .NET runtime to optimálně rozdělí. V praxi srovnatelně rychlé jako ruční verze.

### Bonus C: async/await s loadingem

```csharp
static async Task DemoSLoadingem(int[] cisla)
{
    using CancellationTokenSource cts = new CancellationTokenSource();

    // Spustíme loading task
    Task loading = Task.Run(async () => {
        while (!cts.Token.IsCancellationRequested)
        {
            Console.WriteLine("Pracuji...");
            try
            {
                await Task.Delay(500, cts.Token);
            }
            catch (OperationCanceledException) { return; }
        }
    });

    // Spustíme výpočet
    Task<int> vypocet = NajdiMaxParalelne(cisla);

    int vysledek = await vypocet;
    cts.Cancel();   // zastav loading
    await loading;

    Console.WriteLine($"Hotovo, max = {vysledek}");
}
```

---

## Část 3: Tipy pro obhajobu

### Co u obhajoby říct

> *"V zadání jsem implementoval hledání maxima v poli sekvenčně a paralelně, s měřením času přes Stopwatch. Sekvenční verze je obyčejný for cyklus. Paralelní verze rozdělí pole na N částí, kde N je počet jader procesoru zjištěný přes Environment.ProcessorCount. Pro každou část vytvořím Task, který najde maximum v té části. Task.WhenAll počká na všechny tasky a vrátí pole dílčích maxim, ze kterých pak najdu celkové maximum. Důležitý detail: v lambda capture for cyklu musím použít lokální proměnné, jinak by všechny tasky používaly stejnou finální hodnotu i. U mě na 8 jádrech bylo zrychlení cca 5 a půl násobné, teoreticky možné je 8x, ale je tam overhead na vytvoření tasků a slučování výsledků."*
> 

### Klíčové pojmy pro teorii

| Pojem | Rychlá odpověď |
| --- | --- |
| **Concurrent** | Více úloh se střídá na jednom jádře |
| **Parallel** | Více úloh běží opravdu současně na různých jádrech |
| **CPU-bound** | Náročný výpočet, řešit `Task.Run` nebo `Parallel.For` |
| **I/O-bound** | Čekání na vnější zdroj, řešit `async`/`await` |
| **Process** | Spuštěný program s vlastní pamětí |
| **Thread** | Vlákno uvnitř procesu, sdílí paměť |
| **Task** | Abstrakce nad vlákny, používá ThreadPool |
| **ThreadPool** | Sada znovupoužitelných vláken |
| **`async` / `await`** | Asynchronní programování bez blokování vlákna |
| **`Task.Run`** | Pustí akci na ThreadPool |
| **`Task.WhenAll`** | Počká na všechny tasky |
| **`Task.WhenAny`** | Počká na první hotový task |
| **`Parallel.For`** | Paralelní cyklus |
| **`Parallel.ForEach`** | Paralelní iterace kolekce |
| **PLINQ** | `AsParallel()`, paralelní LINQ |
| **Race condition** | Více vláken zapisuje do stejné proměnné, nedeterministická chyba |
| **`lock`** | Synchronizace, jen jedno vlákno v bloku |
| **`Interlocked`** | Atomické operace bez locku |
| **Concurrent kolekce** | Thread-safe verze (`ConcurrentDictionary`...) |
| **Deadlock** | Dvě vlákna se navzájem čekají, zamrznutí |
| **`CancellationToken`** | Zrušení tasku |
| **`Stopwatch`** | Měření času (high-resolution) |

### Časté chytáky

| Otázka | Odpověď |
| --- | --- |
| *Rozdíl async a parallel?* | Async je o čekání bez blokování (I/O). Parallel je o paralelním výpočtu (CPU). Async nepotřebuje víc jader. |
| *Kdy Task.Run a kdy await?* | Task.Run pro CPU práci. await pro čekání na něco asynchronního (HTTP, soubor, DB). |
| *Co je race condition?* | Bug při souběhu, kdy dvě vlákna pracují se stejnou proměnnou a výsledek závisí na pořadí (nedeterministicky). |
| *Co je deadlock?* | Dvě vlákna se navzájem čekají na zámek, který drží to druhé. Zamrznutí. |
| *Rozdíl lock a Interlocked?* | Lock je blok kódu, Interlocked atomická operace (pro `++`, `+=`). Interlocked je rychlejší pro jednoduché aritmetické úkoly. |
| *Proč `async void` špatně?* | Nelze odchytit výjimku (spadne aplikace), nejde čekat na dokončení. Použij `async Task`. |
| *Co je ThreadPool?* | Sada předem vytvořených vláken, které se recyklují. Task.Run je dává do tohoto poolu. |
| *Co dělá `Task.WhenAll`?* | Vrátí task, který se dokončí, až se dokončí všechny předané tasky. Pak vrátí pole výsledků. |
| *Co je closure problém v cyklu?* | Lambda zachytí referenci na proměnnou, ne hodnotu. V for cyklu všechny lambdy vidí stejnou finální hodnotu. Řešení: lokální kopie. |
| *Proč ne `lock` na `this`?* | Někdo jiný (mimo třídu) může taky zamykat na tom objektu a způsobit deadlock. Vždy `private readonly object`. |

### Časté chyby v praktické úloze

- Sdílená proměnná (max) bez locku v paralelní verzi (race condition, špatný výsledek)
- Closure v for cyklu bez lokální kopie (všechny tasky vidí stejné `i`)
- `Task.Wait()` místo `await` (deadlock v UI vláknu)
- `Thread.Sleep` v async metodě (blokuje vlákno)
- Zapomenutý `await` u Task (neprovede se v očekávaný okamžik)
- `Parallel.For` s lockem na každé iteraci (pomalejší než sekvenční)
- Příliš mnoho tasků (overhead > zisk)
- Měření času zahrnuje i `VygenerujPole` (zkresluje výsledek)
- Zapomenutý sloupový case: pole `pole.Length / pocetJader` nedělí beze zbytku, poslední task musí brát víc
- Vrácení `int.MinValue` jako počáteční hodnoty pro empty pole (lepší throw)
- `async void` mimo event handler (spadne aplikace při výjimce)
- Synchronní volání `.Result` v UI vlákně (deadlock)