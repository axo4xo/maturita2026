# 10 • Podprogramy a lambda funkce

### **podprogram**

(neboli funkce, procedura, metoda)

- oddělená část kódu, kterou můžeme volat opakovaně
- dělá jednu konkrétní věc
- slouží k rozdělení problému na menší části (dekompozice)

skládá se z:

- **vstupy**: parametry (argumenty), se kterými funkce pracuje
- **tělo**: samotný kód, logika
- **výstup**: návratová hodnota (return)
- - může i ošetření: validace vstupů, try-catch bloky

rozlišují se na **funkce** a **procedury:**

funkce:

- vrací výsledek (číslo, text, objekt), nějaká data
- má jasně daný výstup (návratový typ)
- musí mít klíčové slovo `return`

procedura:

- nic nevrací
- jejím úkolem je pouze něco provést (např. updatovat záznam v db)
- v C#, Java jako `void`

v OOP se funkce / procedura nazývá **metoda** (pokud je součástí třídy)

---

### **parametry a předávání dat**

když funkci předáme nějakou proměnnou, co se s ní stane?

**předávání hodnotou (value)**

- vytvoří se lokální kopie proměnné
- funkce dostane pouze kopii hodnoty
- jakákoliv změna proměnné uvnitř fce **neovlivní** původní proměnnou vně funkce
- **originál zůstává ČISTÝ**

**předávání referencí (reference)**

- funkce dostane **adresu** na původní proměnnou v paměti
- pracuje přímo s originálem
- **změna** uvnitř fce se **IHNED PROJEVÍ** i na původní proměnnou venku
- v C#:
    - `ref` = chceme, aby fce mohla **číst i měnit** již existující proměnnou (musí mít hodnotu)
    - `out` = funkce **musí** do této proměnné **něco zapsat** (vracení více výsledků najednou)
        - (např. metoda `int.TryParse` vrací `bool` a přes `out` parametr vrací převedené číslo)

---

### **scope (obor platnosti):**

definuje, odkud v kódu můžeme k jaké proměnné přistupovat

- global
    - dostupná v celé třídě / celém projektu
    - může být změněna odkudkoliv kýmkoliv
- lokální:
    - funkční
        - platí pouze uvnitř funkce
        - **hoisting (typické pro JS):** proměnná se vynese na začátek
            - dá se použít i před řádkem, kde je napsaná, ale bude undefined
            
            (mohu použít proměnnou nebo funkci ještě předtím, než jí napíšu)
            
    - bloková
        - proměnná je dostupná jen uvnitř nejbližších složených závorek { … }
        - (např. if, for, while)
        - jakmile program opustí blok, proměnná zemře a paměť se uvolní
- closure
    - funkce, která si pamatuje prostředí ve kterém vznikla, i když už toto prostředí dávno zaniklo
    - (funkce si pamatuje proměnné, které byly okolo ní, když vznikla)
    - vytváří se kopie prostředí
    - toto umožňuje funkcím mít “privátní” stav

---

### způsob, jak zapsat funkce

- pojmenovaná
    - klasika
    - voláme jí jménem
    
    ```csharp
    int Secti(int x) { return x + 1; }
    ```
    
- anonymní (delegate)
    - nemá jméno. vytvoříme jí hned, abychom jí někam předali
    - vytváří vlastní kontext, voláme jí přímo, či proměnnou (delegate)
    
    ```csharp
    delegate(int x) { return x + 1; }
    ```
    
- lambda
    - také arrow funkce
    - extrémně krátký a elegantní zápis anonymní funkce
    - `x ⇒ x + 1`
    - nevytváří kontext (JS a keyword `this`), přebírá ten, ve kterém byla definována

---

### delegát

proměnná jakožto držák na funkci

- šablona / předpis, který říká, jak má funkce vypadat
    - např. pasují pouze funkce, které berou `int` a vrací `bool`
- umožňuje předávat fci jako parametr jiné fce

### funkce vyššího řádu

- fce, která přijímá jinou funkci jako parametr, nebo funkci vrací
- příklad: `Pole.Where(x ⇒ x > 0)` je fce vyššího řádu; lambda fce jako argument
- typicky LINQ v C#

### funkcionální programování

- vychází z matematiky
- F#, Excel
- (i jako způsob psaní kódu v C#, Java - když se nepoužije OOP)

### rekurze

- funkce, která volá sama sebe
- používáme místo cyklů
- nutné 2 části:
    - ukončovací podmínka - kdy se má fce zastavit
        - hrozí StackOverflow
    - rekurzivní volání: volání sama sebe s jinými daty
- příkladem je alg pro výpočet faktoriálu

```csharp
int Faktorial(int n)
{
    if (n == 1) return 1;      // Ukončovací podmínka
    return n * Faktorial(n-1); // Rekurzivní volání
}
```