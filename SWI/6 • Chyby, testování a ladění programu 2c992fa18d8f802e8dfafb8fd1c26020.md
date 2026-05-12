# 6 • Chyby, testování a ladění programu

### **druhy chyb**

- **syntaktické** (compile-time)
    - porušení pravidel jazyka (chybějící středník, překlep, …)
    - odchytí: kompilátor nebo překladač před spuštěním
    - kočka přeběhla přes klávesnici
- **sémantické** (logické)
    - program jde spustit, nepadá, ale počítá nesmysly
    - je tam špatná myšlenka
    - špatný algoritmus, nekonečný cyklus, špatný vzoreček, off-by-one, špatná podmínka
- **typové** chyby
    - TS: řeší při transpilaci
    - v C# hlídá kompilátor
    - `var` - typ se odvodí při kompilaci; `dynamic` obchází kontrolu typu
- **běhové chyby** (runtime errors / exception)
    - program je v pořádku, dělá co má, ale stane se něco neočekávaného v prostředí
    - dojde k chybě při běhu
    - několik důvodů
        - “uživatel je debil” - ve vstupech je něco, s čím se nepočítalo (zadá text místo čísla)
        - uživatel je zákeřná, zlá bytost
        - soubory neexistujou (jsou r/o), disk je plný, vypadl internet, …
        - hardware se najednou odpojí..

---

### způsoby řešení

- **vyhýbání se chybám** (defensivní programování)
    - snažíme se ověřit stav předtím, než akci provedeme
    - `if (File.Exists(cesta)) { ... }`
    - chyba se může objevit stejně až potom
        - tzv. **race condition** - např.: než do souboru začneme zapisovat, jiný soubor ho smaže
- **řešení chyb** (ošetřování výjimek)
    - necháme chybu nastat, ale chytíme ji
    - **`try` -** blok kódu, kde čekáme problém
    - **`catch`** - co se má stát, když chyba nastane
    - **`finally`** (optional) - blok, který se provede vždy (např. úklid)

---

### ladění

hledáme, proč program nefunguje

- hromada `console.log` / `Console.WriteLine`
- **prostředky pro ladění**
    - **breakpoint**: určíme místo, kde se program má zastavit
    - **watch:** okno, kde vidíme aktuální hodnoty proměnných v naším programu
    - **krokování** (stepping):
        - Step Over - přejde na další řádek
        - Step Into - vleze dovnitř volané funkce
    - nefunguje moc dobře u asynchronní metody

---

### testování

prostě si napíšeme kód, co vyzkouší limity programu

dělí se podle rozsahu:

- **unit tests** (jednotkové):
    - testují nejmenší část kódu (jednu metodu/funkci) izolovaně
    - mockování: např. pokud metoda potřebuje DB, dáme ji falešnou
    - cílem je testovat **edge cases** (hraniční stavy) - např. prázdný vstup, null, záporné číslo
- **integrační testy:**
    - “mám hotovej nějakou část programu a teď testuju, jak ta část programu zapadá do zbytku programu”
    - testují, jak spolupracují různé moduly (např. komunikace API s DB)
    - ověřuje, jestli do sebe “kolečka zapadají”
- **e2e testy (end-to-end):**
    - simulují reálného uživatele
    - nástroje jako Cypress, Playwright klikají v prohlížeči
    - testování proti reálný DB
    - testuje se celý průchod: přihlášení → vložení do košíku → objednávka
- test  renderování komponent

---

### mechanismy hlášení chyb

- **návratové kódy** (starší přístup):
    - příklad: funkce vrací `int`. pokud vrátí `0` = OK. pokud `-1` = chyba.
    - nevýhoda: musíme po každým volání psát `if (vysledek == -1)`
- **výjimky** (moderní přístup, OOP):
    - když nastane chyba, program vyhodí objekt `Exception`
    - chyba jede nahoru zásobníkem (call stack), dokud ji nikdo nechytí (`catch`)
    - pokud jí nikdo nechytí, aplikace spadne