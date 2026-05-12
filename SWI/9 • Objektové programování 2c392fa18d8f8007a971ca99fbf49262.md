# 9 • Objektové programování

### třída vs. objekt

- **třída** (class): šablona - definuje, jak bude objekt vypadat a co bude umět.
- **objekt** (instance): konkrétní výtvor podle šablony (třídy)

třída `Auto`(má barvu, umí jet) – objekt `skodaFabiaCombi2007` 

**třída obsahuje**:

1. vlastnosti (atributy): data (`string Jmeno;`)
2. metody (jak se s tím pracuje): chování, funkce (`JdiPesky()`)
3. konstruktory (jakým způsobem se vytváří): speciální metoda, která se volá při vytváření objektu (`new`); **nedědí se!!!**
4. destruktory (jakým způsobem zaniká): volá se při zániku. V C# se nepoužívá.

---

### Tři Pilíře OOP

1. **zapouzdření (encapsulation)**
    
    objekt by měl skrývat vnitřní data a nabízet jen to, co je bezpečné (vnější rozhraní)
    
    - v C# velmi striktně omezené, Py/Js: dá se dostat i k privátním členům
    
    modifikátory přístupu:
    
    - **private** (vidí jen ta samá třída)
    - **protected** (vidí pouze třída a její potomci)
    - **public** (viditelné pro všechny)
2. **dědičnost (inheritance)**

schopnost vytvořit novou třídu na základě existující

- `Student` : `Clovek`
- student obsahuje všechno, co má člověk (možná i něco navíc)
- v C# se dá dědit jen z jedné třídy (ale z mnoha interfaces)
- nejdřív se volá konstuktor předka (rodiče), pak potomka
1. **polymorfismus** (mnohotvarnost)
    
    schopnost objektů chovat se různě podle situace nebo typu
    
    1. přetěžování podle parametrů:
        - více metod se stejným názvem, ale jinými parametry
        - `Vypis(int cislo)` x `Vypis(string text)`
    2. přetížení metod podle instance:
        - situace, kdy **potomek změní chování metody** zděděné od předka
        - defaultně se volá metoda z předka
        - klíčová slova:
            - `virtual` (u předka) - tahle metoda se dá změnit
            - `override` (u potomka) - mění chování metody
        
        chyták:
        
        ```jsx
        Clovek osoba = new Student(); // Proměnná je typu Člověk, ale uvnitř je Student
        osoba.Pozdrav();
        ```
        
        pokud je Pozdrav `virtual/override` , zavolá se metoda ze Studenta
        
        pokud ne, zavolá se z Člověka
        
    
    ---
    

### abstraktní třídy a Interface

**abstraktní třída (`abstract` )**

- společný **základ (předek)** pro skupinu tříd; “nehotová” třída
- nelze z ní vytvořit instanci
- může obsahovat dva typy metod:
    - **hotové** metody (mají **tělo** a kód, dědí se tak, jak jsou)
    - **abstraktní** metody (jen popis, bez těla) - potomek je **MUSÍ** dopsat

**rozhraní** (Interface)

- definuje smlouvu. říká **CO** má třída umět, ale neřeší J**AK** to udělá
- neobsahuje žádný kód: **jen seznam** metod a vlastností (žádnou programovací logiku)
- vynucení implementace - třída, která interface používá, **MUSÍ** naprogramovat **všechny** jeho metody
- třída může implementovat více interface najednou (`class Pes: IZvire, IChlupatej`)

`IComparable, IEnumerable`

---

### další důležité pojmy

**statika (`static`)**

- patří třídě, ne objektu
- nepotřebuješ instanci třídy, abys metodu zavolal

`Math.Sqrt()` , `Console.WriteLine()` 

**sealed (`sealed class`)**

- od této třídy nelze dědit

**generika (`<T>`)**

- šablona pro typy
- umožňuje napsat metodu univerzálně pro různé datové typy
- konkrétní typ se doplní až při použití: `List<int> cisla = new List<int>();`