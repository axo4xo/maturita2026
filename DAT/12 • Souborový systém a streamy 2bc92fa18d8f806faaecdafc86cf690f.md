# 12 • Souborový systém a streamy

> Souborový systém, hierarchie, cesty, kódování, streamy, čtení a zápis souborů
> 

> **Formát:** 30 min praktická úloha, 15 min obhajoba + teorie. Teorie pokrývá souborový systém, cesty, streamy a I/O v C#. Praktika: procházení adresáře, čtení textových souborů, zápis výstupu.
> 

---

# Část 1: Teorie

### Co je souborový systém

**Souborový systém** je způsob, jakým **operační systém organizuje data na disku**. Bez něj by byl disk jen hromada nul a jedniček bez začátku a konce.

```
Aplikace ──čte/zapisuje──▶ OS (souborový systém)
                                   │
                                   │ překládá na bloky
                                   ▼
                          Driver disku
                                   │
                                   │ fyzicky
                                   ▼
                          Disk (sektory)
```

OS zajišťuje:

- **Hierarchii** (složky a podsložky)
- **Metadata** (jméno, velikost, čas vytvoření)
- **Oprávnění** (kdo smí číst/zapisovat)

---

### Architektura: jak to funguje uvnitř

### Fyzická vs logická vrstva

```
FYZICKÁ:                          LOGICKÁ:
Disk = sektory (~512 B)           OS sdružuje do CLUSTERŮ (~4 KB)
┌─┬─┬─┬─┬─┬─┬─┬─┐                 ┌─────┬─────┬─────┬─────┐
│S│S│S│S│S│S│S│S│         →       │  C  │  C  │  C  │  C  │
└─┴─┴─┴─┴─┴─┴─┴─┘                 └─────┴─────┴─────┴─────┘
Příliš pomalé pro OS              Praktické jednotky alokace
```

> **Vnitřní fragmentace**: Soubor o velikosti 1 B zabere celý cluster (4 KB), zbytek je "mrtvý prostor".
> 

### Jak OS ví, kde soubor leží

| Systém | Princip | Použití |
| --- | --- | --- |
| **FAT** (FAT32, exFAT) | Velká tabulka na začátku disku, "kus tady, kus tam". Když se rozbije, data jsou pryč. | Flash disky, SD karty |
| **NTFS** | Žurnálovaný (deníček před zápisem), oprávnění, komprese, šifrování | Windows |
| **ext4** | Inody, každý soubor má "občanský průkaz" (metadata + adresy bloků). Jméno a data oddělené. | Linux |
| **APFS** | Snapshoty, copy-on-write | macOS |

### Žurnálování (deníček)

Před zápisem si systém poznamená "chci provést X". Když vypadne proud, po startu se podívá do deníčku a dokončí nebo vrátí změny. **Žádné poškozené soubory.**

---

### Hierarchie a cesty

### Strom složek

```
WINDOWS (každý disk vlastní strom):       LINUX (jeden strom):

C:\                                       /
├── Users\                                ├── home/
│   └── axo\                              │   └── axo/
│       └── Dokumenty\                    │       └── dokumenty/
│           └── ukol.txt                  │           └── ukol.txt
├── Program Files\                        ├── etc/
└── Windows\                              ├── usr/
                                          ├── var/
D:\                                       └── media/
└── ...                                       └── usb/   ← připojený disk (mount)
```

> V Linuxu platí pravidlo **"vše je soubor"**: i klávesnice (`/dev/input/...`), disk (`/dev/sda`), tiskárna. Operuje se s nimi stejně jako se souborem.
> 

### Rozdíly mezi OS

|  | Windows | Linux/macOS |
| --- | --- | --- |
| **Oddělovač cest** | `\` (zpětné lomítko) | `/` (lomítko) |
| **Kořen** | Každý disk vlastní (`C:\`, `D:\`) | Jeden kořen `/` |
| **Case sensitivity** | Nerozlišuje velikost písmen (`Foo.txt` = `foo.txt`) | Rozlišuje (`Foo.txt` ≠ `foo.txt`) |
| **Souborový systém** | NTFS, FAT32, exFAT | ext4, btrfs, XFS |

V C# se vyřeší multiplatformně přes `Path.Combine()`, který sám použije správný oddělovač.

### Absolutní vs relativní cesta

```
ABSOLUTNÍ (GPS souřadnice):            RELATIVNÍ (od pracovního adresáře):
─────────────────────────              ──────────────────────────────────
Win:   C:\Users\axo\ukol.txt           ukol.txt           (přímo tady)
Linux: /home/axo/ukol.txt              ./obrazky/foto.png  (./ aktuální)
                                       ../jine/text.txt    (.. o úroveň výš)

Funguje vždy, odkudkoliv.              Funguje jen z konkrétního adresáře.
```

### Cesty v C#

```csharp
using System.IO;

string p1 = Path.Combine("data", "subor.txt");        // "data\subor.txt" nebo "data/subor.txt"
string jmeno = Path.GetFileName(p1);                  // "subor.txt"
string ext = Path.GetExtension(p1);                   // ".txt"
string slozka = Path.GetDirectoryName(p1);            // "data"
string abs = Path.GetFullPath(p1);                    // "C:\...\projekt\data\subor.txt"
char sep = Path.DirectorySeparatorChar;               // '\' na Win, '/' na Linux
string jmenoBezExt = Path.GetFileNameWithoutExtension(p1);   // "subor"
```

> **Vždycky používej `Path.Combine`**, ne ruční spojování přes `+`. Funguje na všech OS a vyhneš se problémům s lomítky.
> 

---

### Metadata a oprávnění

**Metadata** jsou informace **o souboru** (ne jeho obsah): jméno, velikost, čas vytvoření, čas změny, vlastník.

### Linuxová oprávnění (r-w-x)

Každý soubor má práva pro 3 skupiny: **Vlastník (u), Skupina (g), Ostatní (o)**.

| Právo | Znak | Číslo (oktal) | U souboru | U složky |
| --- | --- | --- | --- | --- |
| Read | `r` | 4 | Číst obsah | Vidět seznam |
| Write | `w` | 2 | Měnit obsah | Mazat/přidávat |
| Execute | `x` | 1 | Spustit jako program | Vstoupit (cd) |

```
chmod 755   →   rwx r-x r-x
                 ↑   ↑   ↑
              vlast. skup. ostatní
              7=4+2+1  5=4+1  5=4+1

Vlastník vše, ostatní jen číst a spustit.
```

### Metadata v C#

```csharp
FileInfo fi = new FileInfo("subor.txt");
long velikost = fi.Length;                  // bajty
DateTime vytvoreno = fi.CreationTime;
DateTime upraveno = fi.LastWriteTime;
bool jenKeCteni = fi.IsReadOnly;
string ext = fi.Extension;                  // ".txt"
string nazev = fi.Name;                     // jen jméno bez cesty
string plnaCesta = fi.FullName;             // absolutní cesta
```

---

### Textové vs binární soubory

> **Důležitá poznámka**: koncovka souboru **nedefinuje, co je uvnitř!** O typu rozhoduje **hlavička souboru** (prvních pár bajtů, tzv. "magic number"). Soubor s koncovkou `.jpg` může uvnitř být cokoliv.
> 

Pro počítač jsou všechny soubory **jen nuly a jedničky**. Rozdíl je v tom, jak je čteme.

### Textové soubory

- Data určená pro **lidi**
- Bajty se převádějí na znaky podle **kódování**

```
Bajty:    72  101  108  108  111
           ↓   ↓    ↓    ↓    ↓     (ASCII)
Znaky:    H   e    l    l    o
```

Příklady: `.txt`, `.csv`, `.json`, `.xml`, `.html`, `.cs`

V C# se čtou typicky **po řádcích** (`ReadLine`) přes `StreamReader`.

### Kódování

| Kódování | Bity | Co umí |
| --- | --- | --- |
| **ASCII** | 7 | Jen angličtina (A-Z, 0-9, symboly) |
| **Windows-1250** | 8 | Středoevropské jazyky včetně češtiny (legacy) |
| **UTF-8** | 8+ | **Celý svět**, standard dneška. ASCII znaky 1 B, čeština 2 B, emoji 4 B |
| **UTF-16** | 16+ | Vnitřně Windows API a .NET strings |

UTF-8 je dnes default. Pokud čteš starší soubor v jiném kódování a vidíš **mojibake** ("Ť ďÁ"), musíš explicitně specifikovat:

```csharp
using StreamReader sr = new StreamReader("legacy.txt", Encoding.GetEncoding("windows-1250"));
```

### Konce řádků (EOL)

| OS | EOL znak(y) | Hex |
| --- | --- | --- |
| Windows | `\r\n` (CR LF) | 0D 0A |
| Linux/macOS | `\n` (LF) | 0A |
| Klasický Mac (do OS X) | `\r` (CR) | 0D |

> Velký zdroj problémů při sdílení souborů mezi systémy. Git má `core.autocrlf` na automatickou konverzi.
> 

### Binární soubory

- Data určená pro **stroje** (obrázky JPG/PNG, hudba MP3, video MP4, .exe, .pdf)
- **Žádné převádění**, čte se přesně, co je na disku
- Otevřeš obrázek v Notepadu → uvidíš "sypaný čaj" (Notepad si data zkouší interpretovat jako znaky)

```
TEXT (.txt):                       BINÁRNÍ (.png):
"Ahoj"                              89 50 4E 47 0D 0A 1A 0A ...
= bajty 65 68 6F 6A                 (PNG header + zkomprimovaná pixelová data)
Čitelné v editoru.                  Editor zobrazí nesmysly.
```

V C# se čtou **po blocích bajtů** (buffer) přes `FileStream` nebo `BinaryReader`.

---

### Postup práce se souborem

```
┌─────────┐   ┌──────────┐   ┌──────────┐
│ OTEVŘÍT │ → │ ZPRACOVAT│ → │  ZAVŘÍT  │
└─────────┘   └──────────┘   └──────────┘
```

**Otevřít**: získat handle (ukazatel) na soubor od OS.
**Zpracovat**: číst nebo zapisovat.
**Zavřít**: vrátit handle OS a uložit buffer.

### Režimy otevření

| Mode | Co dělá |
| --- | --- |
| **read** (`r`) | Jen čtení, pokud neexistuje → chyba |
| **write** (`w`) | Zápis, **smaže celý původní obsah!** |
| **append** (`a`) | Připisuje na konec |
| **binary** (`b`) | Pro binární data (`rb`, `wb`) |

V C#:

```csharp
FileMode.Open         // existující soubor
FileMode.Create       // přepsat nebo vytvořit (SMAŽE EXISTUJÍCÍ!)
FileMode.Append       // přidat na konec
FileMode.OpenOrCreate // otevři, neexistuje-li vytvoř
FileMode.Truncate     // otevřít a vyprázdnit

FileAccess.Read | FileAccess.Write | FileAccess.ReadWrite
```

### Buffer a Flush (důležité)

Zápis na disk je **pomalý**, takže program píše do **bufferu v RAM**. Až je plný, "spláchne" se na disk.

```
Write("ahoj")  →   ┌─ BUFFER (RAM)  ─┐
                   │ "ahoj"          │
                   └─────────────────┘
                          ▲
                          │  Flush() / Close()
                          ▼
                   ┌─ DISK  ─────────┐
                   │ "ahoj"          │
                   └─────────────────┘
```

> **Pokud program spadne před `Close()` nebo `Flush()`, data v bufferu se ZTRATÍ.** Proto vždy uzavírej soubory, nejlépe pomocí `using`.
> 

### `using` v C#: automatické uzavření

```csharp
// ❌ Bez using: když nastane výjimka, soubor se nezavře
StreamReader sr = new StreamReader("file.txt");
string text = sr.ReadToEnd();
sr.Close();    // pokud výjimka výše, sem se nedostaneme

// ✓ S using: GARANTOVANĚ zavře, i při výjimce
using (StreamReader sr = new StreamReader("file.txt"))
{
    string text = sr.ReadToEnd();
}   // tady automaticky Dispose() = Close()

// ✓ Ještě modernější (C# 8+):
using StreamReader sr = new StreamReader("file.txt");
string text = sr.ReadToEnd();
// uzavře na konci scope
```

---

### Ošetření chyb: try-catch je tady zákon

> Tahle sekce je extra důležitá, často se na ni ptají. **Všechny I/O operace jsou rizikové.**
> 

Rizika při práci se soubory:

- Soubor **neexistuje** (chybný název nebo cesta)
- Chybí **práva** k zápisu / čtení
- **Disk je plný**
- Soubor **využívá jiný proces**
- Disk **odpojen** (USB), síťová cesta **nedostupná**
- Cesta je **delší než maximum** (Windows 260 znaků default)

Vždy obal v `try-catch`:

```csharp
try
{
    string obsah = File.ReadAllText("data.txt");
    Console.WriteLine(obsah);
}
catch (FileNotFoundException)
{
    Console.WriteLine("Soubor neexistuje");
}
catch (UnauthorizedAccessException)
{
    Console.WriteLine("Nemám práva k souboru");
}
catch (IOException ex)
{
    Console.WriteLine($"I/O chyba: {ex.Message}");
}
```

Nejčastější výjimky:

| Výjimka | Kdy nastává |
| --- | --- |
| `FileNotFoundException` | Soubor neexistuje |
| `DirectoryNotFoundException` | Složka neexistuje |
| `UnauthorizedAccessException` | Chybí práva |
| `IOException` | Obecná I/O chyba (disk plný, soubor zamčený...) |
| `PathTooLongException` | Cesta je delší než limit |
| `ArgumentException` | Neplatná cesta (znaky, formát) |

---

### Třídy v .NET pro práci se soubory

```
Soubory v .NET
├── Statické (jednorázové operace)
│   ├── File.ReadAllText / WriteAllText
│   ├── File.ReadAllLines / WriteAllLines
│   ├── File.ReadAllBytes / WriteAllBytes
│   └── File.Exists / Delete / Move / Copy
│
├── Streamy (dlouhé / velké soubory)
│   ├── FileStream (bajty)
│   ├── StreamReader / StreamWriter (text)
│   └── BinaryReader / BinaryWriter (binár)
│
└── Adresáře
    ├── Directory.GetFiles / GetDirectories
    └── DirectoryInfo / FileInfo
```

### `File`: statické metody (rychlý kód)

```csharp
// Zápis a čtení textu
File.WriteAllText("a.txt", "Ahoj");
string text = File.ReadAllText("a.txt");

// Po řádcích
File.WriteAllLines("a.txt", new[] { "řádek 1", "řádek 2" });
string[] radky = File.ReadAllLines("a.txt");

// Binární
byte[] data = File.ReadAllBytes("a.png");
File.WriteAllBytes("kopie.png", data);

// Přidat na konec
File.AppendAllText("log.txt", "Nová položka\n");

// Operace
bool ex = File.Exists("a.txt");
File.Delete("a.txt");
File.Move("a.txt", "b.txt");
File.Copy("a.txt", "kopie.txt");
File.Copy("a.txt", "kopie.txt", overwrite: true);
```

### `Directory`: práce se složkami

```csharp
// Jen tato složka
string[] soubory = Directory.GetFiles("data");

// Rekurzivně všechny podsložky
string[] vse = Directory.GetFiles("data", "*", SearchOption.AllDirectories);

// Jen .txt soubory
string[] textove = Directory.GetFiles("data", "*.txt");

// Podsložky
string[] slozky = Directory.GetDirectories("data");

// Vytvoření
Directory.CreateDirectory("nova/podslozka");   // vytvoří i mezisložky

// Smazání
Directory.Delete("data", recursive: true);     // s obsahem

bool ex = Directory.Exists("data");
```

### `DirectoryInfo` / `FileInfo`: bohatší API

```csharp
DirectoryInfo di = new DirectoryInfo("data");

foreach (FileInfo f in di.GetFiles())
{
    Console.WriteLine($"{f.Name} - {f.Length} B");
}

foreach (DirectoryInfo sub in di.GetDirectories())
{
    Console.WriteLine($"[{sub.Name}]");
}
```

Rozdíl: `Directory` (statická) vrací jen stringy s cestami, `DirectoryInfo` vrací bohatší objekty s metadaty.

---

### Streamy (datové proudy)

### Analogie

| Soubor jako celek | Stream |
| --- | --- |
| Voda v **nádrži** | Voda v **hadici** |
| Můžeš se hrabat, skákat doprostřed | Teče k tobě, zpracováváš co přiteklo |
| Víš velikost | Nemusíš znát konec |
| Random access | Sekvenční |

### Co je `Stream` v .NET

`Stream` je **abstraktní třída** v `System.IO` reprezentující **posloupnost bajtů**. Z ní dědí:

- **`FileStream`**: bajty ze souboru
- **`MemoryStream`**: bajty v paměti
- **`NetworkStream`**: bajty ze sítě (socket)
- **`GZipStream`**: komprimovaný stream

Stream si pamatuje **aktuální pozici** (kurzor) v souboru.

### `StreamReader`: čtení textu

```csharp
using StreamReader sr = new StreamReader("velky.txt");

string radek;
while ((radek = sr.ReadLine()) != null)
{
    Console.WriteLine(radek);     // zpracuji Radek po Radku
}
```

> **Klíčová výhoda**: nečte celý soubor do paměti naráz. Zvládne i soubory **větší než RAM** (10 GB log file).
> 

### `StreamWriter`: zápis textu

```csharp
using StreamWriter sw = new StreamWriter("vystup.txt");
sw.WriteLine("První řádek");
sw.WriteLine("Druhý řádek");
// při Dispose se buffer flushne a zapíše na disk
```

### `BinaryReader` / `BinaryWriter`: binární data typovaně

```csharp
// ZÁPIS
using BinaryWriter bw = new BinaryWriter(File.Open("data.bin", FileMode.Create));
bw.Write(69);            // int (4 B)
bw.Write(3.14);          // double (8 B)
bw.Write("Ahoj");        // string s prefixem délky

// ČTENÍ (musíš číst ve stejném pořadí!)
using BinaryReader br = new BinaryReader(File.Open("data.bin", FileMode.Open));
int n = br.ReadInt32();
double d = br.ReadDouble();
string s = br.ReadString();
```

### `Seek`: skok v souboru

```csharp
using FileStream fs = File.Open("data.bin", FileMode.Open, FileAccess.ReadWrite);

fs.Seek(10, SeekOrigin.Begin);   // skok na bajt 10
fs.WriteByte(0xFF);              // přepsat tento bajt

fs.Seek(0, SeekOrigin.End);      // skok na konec
fs.Seek(-5, SeekOrigin.Current); // o 5 zpět od aktuální pozice
```

| `SeekOrigin` | Význam |
| --- | --- |
| `Begin` | Od začátku souboru |
| `Current` | Od aktuální pozice |
| `End` | Od konce |

---

### Standardní streamy konzole

Každý program má při startu **3 pipes**:

| # | Stream | Účel | C# |
| --- | --- | --- | --- |
| 0 | **stdin** | Vstup od uživatele | `Console.ReadLine()` |
| 1 | **stdout** | Výstup výsledku | `Console.WriteLine()` |
| 2 | **stderr** | Chybové hlášky | `Console.Error.WriteLine()` |

### Přesměrování (pipes)

```bash
program > vystup.txt           # stdout do souboru
program 2> chyby.log           # stderr do souboru
program < vstup.txt            # vstup ze souboru
program1 | program2            # stdout prvního → stdin druhého

cat seznam.txt | sort | uniq   # přečti, seřaď, deduplikuj
```

---

### CSV / JSON: strukturované soubory

### CSV (Comma Separated Values)

```
jmeno;email;vek
axo;axo@example.com;18
karel;karel@example.com;19
```

```csharp
foreach (var radek in File.ReadAllLines("data.csv").Skip(1))   // přeskoč hlavičku
{
    var p = radek.Split(';');
    Console.WriteLine($"{p[0]} ({p[1]}, {p[2]} let)");
}
```

### JSON (JavaScript Object Notation)

```json
{
    "jmeno": "axo",
    "vek": 18,
    "hasMaturita": false,    
}
```

V C# přes `System.Text.Json`:

```csharp
using System.Text.Json;

// Zápis
var osoba = new { Jmeno = "axo", Vek = 18 };
string json = JsonSerializer.Serialize(osoba, new JsonSerializerOptions { WriteIndented = true });
File.WriteAllText("a.json", json);

// Čtení
string raw = File.ReadAllText("a.json");
var data = JsonSerializer.Deserialize<MujRecord>(raw);
```

---

### Async I/O

Pro velké soubory nebo síťové zdroje. Neblokuje vlákno během čekání na disk:

```csharp
string text = await File.ReadAllTextAsync("velky.txt");
await File.WriteAllTextAsync("v.txt", text);

using StreamReader sr = new StreamReader("a.txt");
string line;
while ((line = await sr.ReadLineAsync()) != null) { /* ... */ }
```

---

### Cheat sheet

```csharp
using System.IO;

// === EXISTENCE ===
File.Exists("a.txt");
Directory.Exists("data");

// === RYCHLÉ TEXT ===
File.WriteAllText("a.txt", "obsah");
string s = File.ReadAllText("a.txt");
string[] r = File.ReadAllLines("a.txt");

// === BINÁRNÍ ===
byte[] b = File.ReadAllBytes("img.png");
File.WriteAllBytes("k.png", b);

// === STREAM (velké soubory) ===
using StreamReader sr = new StreamReader("v.txt");
string line;
while ((line = sr.ReadLine()) != null) { /* ... */ }

using StreamWriter sw = new StreamWriter("v.txt");
sw.WriteLine("text");

// === ADRESÁŘE ===
foreach (var f in Directory.GetFiles("data")) { }
foreach (var f in Directory.GetFiles("data", "*", SearchOption.AllDirectories)) { }
foreach (var d in Directory.GetDirectories("data")) { }
Directory.CreateDirectory("nova");

// === FileInfo ===
var fi = new FileInfo("a.txt");
fi.Length;          // bajty
fi.LastWriteTime;
fi.Extension;

// === PATH ===
Path.Combine("data", "sub", "f.txt");
Path.GetFileName(p);
Path.GetExtension(p);
Path.GetDirectoryName(p);
Path.GetFullPath(p);
```

---

### Časté chyby

| Chyba | Důsledek | Řešení |
| --- | --- | --- |
| Zapomenu `Close()` / nepoužiju `using` | Soubor zůstane otevřený, ztráta dat z bufferu | Vždy `using` |
| Otevření neexistujícího souboru pro čtení | `FileNotFoundException` | `File.Exists()` nebo try/catch |
| `FileMode.Create` se ztrátou obsahu | Smaže existující soubor | Použít `Append` nebo `Open` |
| Použití relativní cesty | Funguje jen z konkrétního adresáře | `Path.GetFullPath()` |
| Čtení binárního souboru přes `StreamReader` | Špatné kódování, poškozená data | `BinaryReader` nebo `File.ReadAllBytes` |
| Načtení 10 GB souboru přes `ReadAllText` | Out of memory | Stream + `ReadLine` po řádcích |
| Špatný EOL při sdílení mezi OS | Vše na jednom řádku, nebo dvojité prázdné | Otevřít v editoru s detekcí, normalizovat |
| Sdílený soubor mezi procesy | `IOException: file is being used` | `FileShare.Read` nebo mutex |
| Manuální spojování cest přes `+` | Špatný oddělovač na různých OS | `Path.Combine()` |
| Žádný try-catch okolo I/O | Crash při neexistujícím souboru | Vždy try-catch okolo I/O |

---

# Část 2: Praktická úloha

### Co může praktická úloha obsahovat

Typická úloha:

- **Procházení adresáře** rekurzivně (Directory.GetFiles s SearchOption)
- **Čtení textových souborů** přes File.ReadAllText nebo StreamReader
- **Zápis výstupu** do nového souboru
- **Spočítat statistiky** (počet souborů, celková velikost)
- **Filtrace** podle koncovky (`.txt`)
- **Vytvoření výstupní složky** (Directory.CreateDirectory)
- **Try-catch** pro I/O chyby

### Příklad zadání: Souborový průzkumník

Vytvoř konzolovou aplikaci v C#, která:

1. **Projde rekurzivně adresář `Data/`** a vypíše všechny soubory a složky se strukturou
2. **Vypíše velikost** každého souboru v bajtech
3. **Spočítá a vypíše** celkový počet souborů a složek + celkovou velikost
4. **Pro každý textový soubor** (`.txt`) v adresáři `Data/` vypíše obsah
5. **Vytvoří adresář `Output/`** a do něj soubor `jmena.txt` se **seznamem jmen všech nalezených souborů**
6. **Ošetří chyby** přes try-catch (neexistující složka, chybějící práva)

### Připravená struktura

```
projekt/
├── Program.cs
└── Data/
    ├── pozdrav.txt          ← "Ahoj axo"
    ├── poznamky.txt          ← víc řádků
    ├── obrazek.png           ← binární (ignoruje se při čtení obsahu)
    └── subor/
        └── vnoreny.txt       ← "vnoreny text"
```

### Řešení: kompletní `Program.cs`

```csharp
using System;
using System.IO;
using System.Linq;

class Program
{
    static string ZdrojovaSlozka = "Data";
    static string VystupniSlozka = "Output";

    static void Main()
    {
        try
        {
            // 1) Kontrola existence zdrojové složky
            if (!Directory.Exists(ZdrojovaSlozka))
            {
                Console.WriteLine($"Chyba: složka '{ZdrojovaSlozka}' neexistuje.");
                return;
            }

            // 2) Procházení struktury
            Console.WriteLine("=== STRUKTURA ADRESÁŘE ===\n");
            VypisStrukturu(ZdrojovaSlozka, 0);

            // 3) Statistiky
            Console.WriteLine("\n=== STATISTIKY ===\n");
            string[] vsechnySoubory = Directory.GetFiles(
                ZdrojovaSlozka, "*", SearchOption.AllDirectories);
            string[] vsechnySlozky = Directory.GetDirectories(
                ZdrojovaSlozka, "*", SearchOption.AllDirectories);

            long celkovaVelikost = vsechnySoubory.Sum(f => new FileInfo(f).Length);

            Console.WriteLine($"Počet souborů: {vsechnySoubory.Length}");
            Console.WriteLine($"Počet složek:  {vsechnySlozky.Length}");
            Console.WriteLine($"Celková velikost: {celkovaVelikost:N0} B");

            // 4) Vypsání obsahu textových souborů
            Console.WriteLine("\n=== OBSAH TEXTOVÝCH SOUBORŮ ===\n");
            string[] textoveSoubory = Directory.GetFiles(
                ZdrojovaSlozka, "*.txt", SearchOption.AllDirectories);

            foreach (string soubor in textoveSoubory)
            {
                VypisObsah(soubor);
            }

            // 5) Vytvoření Output složky a souboru se jmény
            ZapisJmena(vsechnySoubory);

            Console.WriteLine("\nHotovo!");
        }
        catch (UnauthorizedAccessException ex)
        {
            Console.WriteLine($"Nemám práva: {ex.Message}");
        }
        catch (IOException ex)
        {
            Console.WriteLine($"I/O chyba: {ex.Message}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Neočekávaná chyba: {ex.Message}");
        }
    }

    // ===== REKURZIVNÍ VÝPIS STRUKTURY =====
    static void VypisStrukturu(string cesta, int hloubka)
    {
        string odsazeni = new string(' ', hloubka * 2);
        DirectoryInfo di = new DirectoryInfo(cesta);

        // Vypíše jméno složky
        Console.WriteLine($"{odsazeni}[{di.Name}/]");

        // Soubory v této složce
        foreach (FileInfo soubor in di.GetFiles())
        {
            Console.WriteLine($"{odsazeni}  - {soubor.Name} ({soubor.Length:N0} B)");
        }

        // Rekurze do podsložek
        foreach (DirectoryInfo sub in di.GetDirectories())
        {
            VypisStrukturu(sub.FullName, hloubka + 1);
        }
    }

    // ===== VÝPIS OBSAHU SOUBORU =====
    static void VypisObsah(string cesta)
    {
        try
        {
            Console.WriteLine($"--- {Path.GetFileName(cesta)} ---");

            using StreamReader sr = new StreamReader(cesta);
            string radek;
            while ((radek = sr.ReadLine()) != null)
            {
                Console.WriteLine(radek);
            }

            Console.WriteLine();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Nelze přečíst {cesta}: {ex.Message}");
        }
    }

    // ===== ZÁPIS JMEN DO OUTPUT/JMENA.TXT =====
    static void ZapisJmena(string[] soubory)
    {
        // Vytvoříme Output složku pokud neexistuje
        Directory.CreateDirectory(VystupniSlozka);

        string vystupniCesta = Path.Combine(VystupniSlozka, "jmena.txt");

        using StreamWriter sw = new StreamWriter(vystupniCesta);
        sw.WriteLine($"# Seznam souborů ({DateTime.Now:yyyy-MM-dd HH:mm})");
        sw.WriteLine($"# Celkem: {soubory.Length}\n");

        foreach (string soubor in soubory)
        {
            sw.WriteLine(Path.GetFileName(soubor));
        }

        Console.WriteLine($"\nZapsáno do: {vystupniCesta}");
    }
}
```

### Očekávaný výstup

```
=== STRUKTURA ADRESÁŘE ===

[Data/]
  - pozdrav.txt (10 B)
  - poznamky.txt (45 B)
  - obrazek.png (8,234 B)
  [subor/]
    - vnoreny.txt (12 B)

=== STATISTIKY ===

Počet souborů: 4
Počet složek:  1
Celková velikost: 8,301 B

=== OBSAH TEXTOVÝCH SOUBORŮ ===

--- pozdrav.txt ---
Ahoj axo

--- poznamky.txt ---
První řádek
Druhý řádek
Třetí řádek

--- vnoreny.txt ---
vnoreny text

Zapsáno do: Output/jmena.txt

Hotovo!
```

A v `Output/jmena.txt`:

```
# Seznam souborů (2026-05-15 14:30)
# Celkem: 4

pozdrav.txt
poznamky.txt
obrazek.png
vnoreny.txt
```

### Co se v řešení děje

**Procházení struktury (rekurze)**: `VypisStrukturu` volá sám sebe pro každou podsložku. `DirectoryInfo.GetDirectories()` vrací podsložky, `GetFiles()` soubory. Hloubka řídí odsazení pro vizuální strom.

**Statistiky**: `Directory.GetFiles(path, "*", SearchOption.AllDirectories)` projde rekurzivně všechny soubory. `Sum` přes LINQ spočítá celkovou velikost.

**Filtrace textových souborů**: `*.txt` jako filtr v `GetFiles`. Funguje jen na základě koncovky, nikoliv hlavičky souboru.

**Čtení obsahu**: `StreamReader` s `using`, čtení po řádcích přes `ReadLine`. Try-catch okolo, kdyby šlo o binární soubor s `.txt` koncovkou (neexpire, ale bezpečnější).

**Zápis výstupu**: `Directory.CreateDirectory` vytvoří složku (nevadí, pokud existuje). `StreamWriter` zapisuje řádek po řádku.

**Path.Combine**: použito pro multiplatformní spojování cesty `Output/jmena.txt` (funguje na Win i Linux).

---

### Bonusy

### Bonus A: Filtrace podle velikosti

```csharp
static void VypisVelkeSoubory(string cesta, long minVelikost)
{
    var soubory = new DirectoryInfo(cesta)
        .GetFiles("*", SearchOption.AllDirectories)
        .Where(f => f.Length >= minVelikost)
        .OrderByDescending(f => f.Length);

    foreach (var f in soubory)
    {
        Console.WriteLine($"{f.FullName} ({f.Length:N0} B)");
    }
}

// Použití: vypsat soubory větší než 1 MB
VypisVelkeSoubory("Data", 1_000_000);
```

### Bonus B: Hledání slova v textových souborech

```csharp
static void NajdiSlovo(string cesta, string hledaneSlovo)
{
    string[] soubory = Directory.GetFiles(cesta, "*.txt", SearchOption.AllDirectories);

    foreach (string soubor in soubory)
    {
        string[] radky = File.ReadAllLines(soubor);
        for (int i = 0; i < radky.Length; i++)
        {
            if (radky[i].Contains(hledaneSlovo, StringComparison.OrdinalIgnoreCase))
            {
                Console.WriteLine($"{soubor}:{i + 1}: {radky[i]}");
            }
        }
    }
}
```

### Bonus C: Async verze pro velké soubory

```csharp
static async Task ZapisJmenaAsync(string[] soubory)
{
    Directory.CreateDirectory(VystupniSlozka);
    string cesta = Path.Combine(VystupniSlozka, "jmena.txt");

    var jmena = soubory.Select(Path.GetFileName);
    await File.WriteAllLinesAsync(cesta, jmena);
}
```

---

## Část 3: Tipy pro obhajobu

### Co u obhajoby říct

> *"V zadání jsem napsal konzolovou aplikaci v C#, která rekurzivně prochází adresář Data. Použil jsem Directory.GetFiles s SearchOption.AllDirectories pro získání všech souborů, FileInfo pro získání velikostí, a sum přes LINQ pro celkovou velikost. Pro výpis struktury jsem napsal rekurzivní metodu, která pro každou podsložku volá sama sebe, čímž vznikne strom. Textové soubory čtu přes StreamReader s using, takže se garantovaně zavřou i při výjimce. Výstup zapisuji do Output/jmena.txt přes Directory.CreateDirectory a StreamWriter. Cesty stavím přes Path.Combine, takže to funguje na Windows i Linux. Celé to mám obalené v try-catch pro typické I/O výjimky: FileNotFound, UnauthorizedAccess, IOException."*
> 

### Klíčové pojmy pro teorii

| Pojem | Rychlá odpověď |
| --- | --- |
| **Souborový systém** | Způsob, jak OS organizuje data na disku (hierarchie, metadata, oprávnění) |
| **NTFS, ext4, FAT32, APFS** | Konkrétní typy souborových systémů |
| **Žurnálování** | Deníček před zápisem, prevence poškození při výpadku |
| **Absolutní vs relativní cesta** | Absolutní od kořene (C:, /), relativní od pracovního adresáře |
| **`Path.Combine`** | Multiplatformní spojování cest |
| **Metadata** | Informace o souboru (jméno, velikost, čas, vlastník) |
| **Oprávnění rwx** | Linux: read/write/execute pro user/group/other |
| **Kódování (UTF-8, ASCII)** | Mapování bajtů na znaky |
| **EOL (`\r\n` vs `\n`)** | Konce řádků: Windows vs Linux |
| **`Stream`** | Abstraktní třída pro sekvenční čtení/zápis bajtů |
| **`FileStream`** | Stream pro soubor |
| **`StreamReader/Writer`** | Wrapper na Stream pro text |
| **`BinaryReader/Writer`** | Wrapper na Stream pro binární data typovaně |
| **Buffer** | Mezi-paměť v RAM před zápisem na disk |
| **Flush** | Spláchnutí bufferu na disk |
| **`using`** | Garantované zavření (Dispose) i při výjimce |
| **`File` (statická)** | Rychlé jednorázové operace (ReadAllText, WriteAllText...) |
| **`Directory`** | Operace nad složkami |
| **`FileInfo / DirectoryInfo`** | Bohatší API než statické metody |
| **`SearchOption.AllDirectories`** | Rekurzivní hledání |
| **stdin, stdout, stderr** | Standardní vstup, výstup, chybový výstup |

### Časté chytáky

| Otázka | Odpověď |
| --- | --- |
| *Co je rozdíl Stream a File?* | File je statická třída pro jednorázové operace. Stream je objekt pro postupné zpracování (po řádcích, blocích). |
| *Proč `using`?* | Garantuje zavření souboru (Dispose), i když nastane výjimka. Bez něj se může soubor "zaseknout" otevřený. |
| *Co je rozdíl `ReadAllText` a `StreamReader.ReadLine`?* | ReadAllText načte celý soubor do paměti. StreamReader čte po řádcích, vhodný pro velké soubory. |
| *Co je kódování?* | Mapování bajtů na znaky. UTF-8 je dnes standard, podporuje všechny jazyky. |
| *Proč Path.Combine, ne string +?* | Funguje multiplatformně (Win `\`, Linux `/`). |
| *Co je buffer?* | Mezi-paměť v RAM. Zápisy se ukládají do bufferu a jednorázově se "spláchnou" na disk (rychlejší). |
| *Co se stane když program spadne před `Close`?* | Data v bufferu se ztratí. Proto `using` nebo manuální `Flush`. |
| *Rozdíl textového a binárního souboru?* | Pro počítač jen bajty. Textový obsahuje znaky podle kódování, binární raw data (obrázek, exe). |
| *Co je SearchOption.AllDirectories?* | Rekurzivní prohledání všech podsložek (defautlně jen aktuální složka). |
| *Co dělá `try-catch` u I/O?* | Zachycuje výjimky typu FileNotFoundException, UnauthorizedAccess, IOException. Bez něj program crashne. |

### Časté chyby v praktické úloze

- Zapomenutý `using` u StreamReader/Writer (soubor zůstane otevřený)
- Manuální spojování cest přes `+` místo `Path.Combine` (nefunguje na Linuxu)
- `FileMode.Create` na existujícím souboru, který chceš zachovat (smaže obsah!)
- Žádný try-catch okolo I/O (crash při chybějícím souboru)
- `File.ReadAllText` pro velký soubor (Out of Memory)
- `Directory.GetFiles` bez `SearchOption.AllDirectories` (jen 1 úroveň)
- Čtení binárního souboru přes StreamReader (krakatice)
- Žádná kontrola `Directory.Exists` před procházením (FileNotFoundException)
- Použití hard-coded `\` v cestě (nefunguje na Linuxu)
- `Path.GetFileName` na cestě bez souboru (může vrátit prázdný string)
- Zapomenutí `Directory.CreateDirectory` před zápisem do nové složky (DirectoryNotFoundException)
- Nečíst rekurzivně, když to úloha vyžaduje (chybí podsložky ve výsledku)
- `File.ReadAllLines` v cyklu pro stejný soubor (zbytečně rychle načítá)