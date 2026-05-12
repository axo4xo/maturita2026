# 24 • Programovací jazyky

### co je to programovací jazyk?

formální jazyk (prostředek) pro zápis algoritmů, kterým dáváme instrukce počítači

- **lexikální struktura:** jazyk má svou "gramatiku" (syntaxi) a "význam" (sémantiku)
    - **klíčová slova (keywords):** rezervovaná slova, která mají speciální význam
        
        (`if`, `while`, `class`, `public`).
        
    - **syntaxe: p**ravidla, jak se kód píše (závorky, středníky, odsazení).
- **úroveň jazyka:**
    - **nízkourovňové:** blízko hardwaru (assembler, strojový kód).
    - **vysokoúrovňové:** srozumitelné pro člověka (C#, Python, Java).
    - **esoterické:** např. *Brainfuck*

---

### rozdělení dle způsobu zpracování

jak se dostane text, co napíšeš, do procesoru

- **kompilované** jazyky (C, C++, Pascal)
    - kód se celý najednou přeloží do strojového kódu pro konkrétní procesor
    - chyby se objeví při kompilaci
    - výhody: **rychlost** (běží přímo na HW)
    - nevýhody: kompilace pro každý OS zvlášť. při změně kódu nutnost rekompilace.
- **interpretované** jazyky (Python (ne úplně), PHP, JS)
    - interpretuje se zatímco běží
    - postupně řádek po řádku
    - jazyk nahlásí chyby až v době, kdy na ně narazí
    - výhody: přenositelnost, flexibilita, rychlý vývoj
- **hybridní** / manažované jazyky (C#, Java)
    - kombinují oba principy
    - zdroják se kompiluje do tzv. **mezikódu** (IL, Bytecode)
    - mezikód spustí VM (CLR u .NET, JVM u Java)
    - VM ho pomocí JIT (Just-In-Time) kompilace převede na machine code přímo ve chvíli, kdy je to potřeba

---

### paradigmata

většina moderních jazyků je multi-paradigmatických

**imperativní**: např. s prvky GOTO - BASIC, C

**objektově orientované** (OOP) - C#, Java, nevynuceno v Pythonu 

**funkcionální:** vychází z matematiky - ****F#, Haskell, Excel

---

### procedurální / neprocedurální jazyky

jakým způsobem píšeš algoritmus

**procedurální**

- píšeš **krok za krokem**, co se má stát, aby se počítač dostal k výsledku
- strukturované jazyky:
    - pořádek, logika
    - dělí se na logické bloky
    - cykly, podmínky, sekvence
    - kód teče shora dolů
    - C, Pascal
- objektově orientované:
    - svět plný objektů, které spolu komunikují
    - **objekt** - má své **vlastnosti** a **metody**
    - **Auto** - má barvu `barva`- a může `jet()`
    - C++, C#, Java, Python (nevynucené)

**neprocedurální**

- deklarativní přístup, píšeš, **co chceš získat**, neřešíš **jak**
- funkcionální jazyky:
    - vše je chápáno jako matematický výpočet
    - vhodíš data, funkce je zpracuje a vyhodí výsledek
    - Excel, Haskell, F#

---

### syntaxe

jak jazyk vypadá na pohled

- **C-derived**
    - závorky, brackets, středníky;
    - C, C++, C#, Java, JavaScript, PHP
- **odsazovací**
    - logika kódu přes odsazení (tab/mezery)
    - nutí programátora psát čitelný kód
    - Python
- **ostatní**
    - keyword-based: Pascal/Delphi (`begin ... end`), Lua (`do ... end`)
    - skriptovací: Bash, PowerShell (`Get-Help`)
    - SQL: deklarativní jazyk - píšeš CO chceš, ne JAK to chceš udělat

---

### architektura .NET

nevím, jestli tohle máme umět, ale je to zajímavý

- **.NET Framework**: starší, pouze pro Windows
- **.NET (Core)**: Moderní, rychlý, běží všude
- **Mono:** OSS implementace, umožnila C# na mobilech

využití:

- **MAUI / Xamarin**: Vývoj mobilních aplikací v C#
- **Unity**: Herní engine (C#)
- **ASP.NET**: Webové aplikace