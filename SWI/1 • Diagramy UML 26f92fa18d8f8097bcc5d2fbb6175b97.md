# 1 • Diagramy UML

> UML, diagramy, schémata programu, datových struktur, databází
> 

---

## Co je UML

**UML** *(Unified Modeling Language)* je standardizovaný grafický jazyk pro **vizualizaci, návrh a dokumentaci** softwarových systémů. Vznikl v 90. letech sloučením tří dřívějších metod (Booch, Rumbaugh OMT, Jacobson OOSE).

### K čemu UML slouží

- **Komunikace v týmu** mezi vývojáři, analytiky a zákazníkem
- **Dokumentace** architektury systému
- **Návrh** před samotným kódováním (analýza, plánování)
- **Reverse engineering** existujícího kódu do diagramů
- **Code generation** z diagramů (vzácné, ale možné)

---

## Rozdělení UML diagramů

> Drobnost: zápisky uvádí 6 typů. UML 2.x **specifikuje 14 typů** diagramů, rozdělených do dvou hlavních kategorií. Pro maturitu nemusíš znát všech 14 detailně, ale mít přehled se vyplatí.
> 

| Skupina | Účel | Otázka |
| --- | --- | --- |
| **Strukturální** (7) | Statická struktura systému | Z čeho je systém složený? |
| **Behaviorální** (7) | Dynamické chování | Jak systém funguje? |

### Strukturální diagramy

| Diagram | Co ukazuje |
| --- | --- |
| **Class diagram** | Třídy, atributy, metody, vztahy |
| **Object diagram** | Konkrétní instance tříd v daný moment |
| **Package diagram** | Logické skupiny tříd (moduly) |
| **Component diagram** | Softwarové komponenty a jejich rozhraní |
| Composite structure | Vnitřní struktura komponenty |
| Deployment diagram | Fyzické nasazení (servery, hardware) |
| Profile diagram | Rozšíření UML pro doménu (málokdy potřeba) |

### Behaviorální diagramy

| Diagram | Co ukazuje |
| --- | --- |
| **Use case diagram** | Co může uživatel se systémem dělat |
| **Activity diagram** | Tok aktivit (jako vývojový diagram) |
| **State machine** | Stavy objektu a přechody mezi nimi |
| **Sequence diagram** | Časová posloupnost zpráv mezi objekty |
| **Communication diagram** | Vztahy mezi objekty (bez časové osy) |
| Timing diagram | Změny stavu v čase |
| Interaction overview | Kombinace activity a interakce |

V praxi se nejčastěji potkáš s těmito 5: **Class, Use Case, Activity, State Machine, Sequence**.

---

## Class diagram (diagram tříd)

**Nejdůležitější UML diagram.** Slouží jako návod pro programátora: musí být úplný a konkrétní.

### Anatomie třídy

![image.png](1%20%E2%80%A2%20Diagramy%20UML/image.png)

### Viditelnost (visibility modifiers)

| Symbol | Význam | Java/C# ekvivalent |
| --- | --- | --- |
| `+` | Public | `public` |
| `-` | Private | `private` |
| `#` | Protected | `protected` |
| `~` | Package | `internal` (C#) / package-private (Java) |

### Speciální značení

|  | Jak |
| --- | --- |
| **Abstraktní třída** | Název *kurzívou* nebo stereotyp `<<abstract>>` |
| **Statický člen** | Podtržené |
| **Rozhraní** | Stereotyp `<<interface>>` nad názvem |
| **Enumeration** | Stereotyp `<<enumeration>>` |
| **Abstraktní metoda** | *Kurzívou* |

### Příklad: dědičnost a rozhraní

![image.png](1%20%E2%80%A2%20Diagramy%20UML/image%201.png)

---

## Object diagram (diagram objektů)

Zachycuje **konkrétní instance tříd v jednom okamžiku** za běhu systému. Ukazuje skutečné hodnoty atributů, bez metod a bez násobnosti.

![image.png](1%20%E2%80%A2%20Diagramy%20UML/image%202.png)

Object diagram je vlastně "snapshot" class diagramu se skutečnými hodnotami.

---

## Package diagram (diagram balíčků)

Sdružuje třídy do logických celků (modulů). Pro přehled architektury velkých systémů.

![image.png](1%20%E2%80%A2%20Diagramy%20UML/image%203.png)

Šipka mezi balíčky znamená **závislost** (balíček A používá balíček B).

---

## Component diagram

Ukazuje **softwarové komponenty** (knihovny, moduly, služby) a jejich **rozhraní**. Komponenta je samostatně nasaditelná jednotka.

![image.png](1%20%E2%80%A2%20Diagramy%20UML/image%204.png)

`○` = required interface (potřebné), `)` = provided interface (poskytované).

---

## Use Case diagram (diagram užití)

Vizualizuje **interakce mezi aktérem (uživatelem) a systémem**. Odpovídá na otázku: **co může uživatel se systémem dělat?**

![image.png](1%20%E2%80%A2%20Diagramy%20UML/image%205.png)

### Klíčové prvky

| Prvek | Význam |
| --- | --- |
| **Actor** (postavička) | Uživatel nebo externí systém |
| **Use case** (elipsa) | Akce, kterou aktér s systémem dělá |
| **System boundary** (obdélník) | Hranice systému |
| **Association** (čára) | Aktér používá use case |
| **`<<include>>`** | Use case A vždy zahrnuje use case B (přihlášení) |
| **`<<extend>>`** | Use case B volitelně rozšiřuje A (zapomenuté heslo) |
| **Generalization** | Dědičnost mezi use cases nebo aktéry |

### Praktická pravidla

- Aktér je **role**, ne konkrétní osoba
- Use case popisuje **co**, ne **jak** (žádné implementační detaily)
- Use case má vždy konkrétní výsledek pro aktéra
- Vícenásobné role: jeden uživatel může být v různých kontextech různý aktér

---

## Activity diagram (diagram aktivit)

> Tahle sekce v původních zápiscích chyběla, přitom je to **vlastně moderní verze vývojového diagramu** a komise se ráda ptá.
> 

Popisuje **tok aktivit**, podobně jako vývojový diagram. Velmi vhodný pro modelování business procesů a algoritmů.

![image.png](1%20%E2%80%A2%20Diagramy%20UML/image%206.png)

### Klíčové elementy

| Tvar | Význam |
| --- | --- |
| ● (plný kruh) | Začátek |
| ⬤ (kruh v kruhu) | Konec celého toku |
| ⊗ (kruh s X) | Konec jedné větve, ne celého toku |
| Zaoblený obdélník | Krok aktivity |
| ◇ (kosočtverec) | Větvení (if/switch), s `[guard]` |
| ◇ (kosočtverec) | Spojení po větvení |
| ▬ (tlustá čára) | Paralelní rozdělení |
| ▬ (tlustá čára) | Synchronizace paralelních větví |
| Sloupec | Kdo akci provádí (oddělení/role) |

---

## State machine diagram (stavový diagram)

Popisuje **životní cyklus objektu**: stavy, ve kterých se může nacházet, a přechody mezi nimi.

![image.png](1%20%E2%80%A2%20Diagramy%20UML/image%207.png)

### Elementy

| Element | Význam |
| --- | --- |
| **State** | Stav, ve kterém objekt je |
| **Transition** | Přechod mezi stavy, popsaný `událost [guard] / akce` |
| **Initial state** ● | Startovní stav |
| **Final state** ⬤ | Konečný stav |
| **Composite state** | Stav obsahující vnořené substavy |
| **Self-transition** | Přechod do sebe (při události provede akci) |
| **Guard** `[podmínka]` | Přechod proběhne jen pokud podmínka platí |
| **Entry / exit / do** | Akce při vstupu / opuštění / průběhu stavu |

---

## Sequence diagram (sekvenční diagram)

Zobrazuje **časovou posloupnost zpráv** mezi objekty. Kdo komu volá a v jakém pořadí. Čas plyne **shora dolů**.

![image.png](1%20%E2%80%A2%20Diagramy%20UML/image%208.png)

### Klíčové elementy

| Element | Význam |
| --- | --- |
| **Lifeline** (svislá přerušovaná čára) | Časová osa objektu |
| **Activation bar** (úzký obdélník na lifeline) | Doba, kdy objekt něco vykonává |
| **Synchronous message** (plná šipka) | Volání, čeká na návrat |
| **Asynchronous message** (otevřená šipka) | Volání, nečeká |
| **Return message** (přerušovaná šipka) | Návratová hodnota |
| **Self-message** | Volání na sebe |
| **Object creation** | Šipka přímo na objekt |
| **Object destruction** | × na konci lifeline |

### Combined fragments (rámečky)

Pro řízení toku v sequence diagramu:

| Fragment | Co dělá |
| --- | --- |
| `alt` | Alternativa (if-else) |
| `opt` | Volitelná akce (if) |
| `loop` | Cyklus |
| `par` | Paralelní vykonání |
| `break` | Předčasné ukončení |
| `critical` | Kritická sekce |

---

## Communication diagram (komunikační diagram)

Alternativa k sequence diagramu. Zaměřuje se na **vztahy mezi objekty**, ne na časovou osu. Zprávy jsou číslovány.

![image.png](1%20%E2%80%A2%20Diagramy%20UML/image%209.png)

Sequence i Communication diagram zobrazují stejné informace, jen z jiného úhlu. Lze mezi nimi automaticky konvertovat.

---

## Vztahy v UML class diagramu

| Vztah | Značka | Význam |
| --- | --- | --- |
| **Asociace** | `───────` | Základní vztah, objekty si o sobě "vědí" |
| **Agregace** | `───────◇` | Celek-část, část přežije celek |
| **Kompozice** | `───────◆` | Silná vazba, část bez celku nedává smysl |
| **Generalizace** | `───────▷` | Dědičnost, šipka míří na rodiče |
| **Realizace** | `- - - -▷` | Implementace rozhraní |
| **Závislost** | `- - - -▶` | A používá B, ale neukládá si referenci |

### Agregace vs Kompozice (klasický chyták)

|  | Agregace | Kompozice |
| --- | --- | --- |
| Značka | `─◇` (prázdný kosočtverec) | `─◆` (plný kosočtverec) |
| Životní cyklus | Část přežije celek | Část umírá s celkem |
| Příklad | Tým ◇ Hráč (hráč přežije tým) | Dům ◆ Pokoj (pokoj neexistuje bez domu) |
| Jiný příklad | Knihovna ◇ Kniha | Auto ◆ Motor |
| Sdílení | Část může být v víc celcích | Část v jednom celku |

### Asociace s rolemi

```
        zaměstnává
[Firma] ◆──────────▷ [Zaměstnanec]
        zaměstnavatel   zaměstnanec
        1               *
```

Role popisují, jakou funkci hraje objekt ve vztahu.

---

## Multiplicita (násobnost)

| Zápis | Význam |
| --- | --- |
| `1` | Právě jeden |
| `0..1` | Žádný nebo jeden (nepovinný) |
| `*` nebo `0..*` | Libovolný počet (i 0) |
| `1..*` | Alespoň jeden |
| `2..5` | Od dvou do pěti |
| `n` | Konkrétní počet (např. `8` rohů kostky) |

```
[Student] 1 ──── 1..* [Kurz]
```

Student se může zapsat na 1 a více kurzů, kurz má 1 nebo více studentů.

```
[Auto] 1 ──── 4 [Kolo]
```

Auto má vždy přesně 4 kola.

```
[Osoba] 0..1 ──── 0..* [Telefon]
```

Telefon má nula nebo jednoho majitele, osoba může mít libovolně mnoho telefonů.

---

## UML pro datové struktury

UML class diagram se používá i pro modelování datových struktur jako spojový seznam, strom, hashmapa.

### Spojový seznam (linked list)

```
┌───────────────┐         ┌───────────────┐         ┌───────────────┐
│     Node      │  next   │     Node      │  next   │     Node      │
├───────────────┤────────▷├───────────────┤────────▷├───────────────┤
│ - value: int  │ 0..1    │ - value: int  │ 0..1    │ - value: int  │──▷ null
│ - next: Node  │         │ - next: Node  │         │ - next: Node  │
└───────────────┘         └───────────────┘         └───────────────┘
```

### Binární strom

```
┌──────────────────┐
│   TreeNode       │
├──────────────────┤   left    ┌──────────────────┐
│ - value: int     │──────────▷│   TreeNode       │ (recursive)
│ - left: TreeNode │          │                  │
│ - right: TreeNode│  right   ├──────────────────┤
└──────────────────┘─────────▷│ - value: int     │
                              │ ...              │
                              └──────────────────┘
```

---

## UML vs ER pro databáze

### ER diagram

![image.png](1%20%E2%80%A2%20Diagramy%20UML/image%2010.png)

### Vztahy v ER

| Kardinalita | Význam |
| --- | --- |
| **1:1** | Jeden má jednoho (student má jeden pas) |
| **1:N** | Jeden má víc (učitel má víc kurzů) |
| **N:M** | Více má víc (studenti se zapisují na víc kurzů) |

### Vazební tabulka pro N:M

```
STUDENT (id PK, jmeno, email)
KURZ (id PK, nazev, kredity)
ZAPIS (student_id FK, kurz_id FK, datum_zapisu)   ← vazební tabulka
```

V relačních DB se vztah N:M nedá uložit přímo, vždy potřebuje **vazební tabulku** s dvojicí cizích klíčů.

---

## Nástroje pro tvorbu UML

| Nástroj | Charakter |
| --- | --- |
| **Draw.io / diagrams.net** | Zdarma, browser, jednoduchý |
| **PlantUML** | Text-to-diagram, perfektní pro git verzování |
| **Mermaid** | Markdown-friendly, podpora v GitHubu, Notion |
| **Modelio** | Open source, plnohodnotný UML editor |
| **Lucidchart** | Online, kolaborace v reálném čase |
| **Visual Paradigm** | Profesionální, placené |
| **Enterprise Architect** | Enterprise standard pro velké projekty |
| **StarUML** | Lehký desktop editor |
| **ChatGPT Image** | Prostě mu řekni, ať ti to vygeneruje. Lol. |

Z těchto pár řádků PlantUML vygeneruje hotový diagram. Skvělé pro dokumentaci, kterou chceš verzovat v gitu.

---

## Rychlý tahák

| Pojem | Klíčová fakta |
| --- | --- |
| **UML** | Standardizovaný grafický jazyk pro návrh softwaru, UML 2.5.1 |
| **OMG** | Object Management Group, standardizuje UML |
| **14 typů diagramů** | 7 strukturálních + 7 behaviorálních |
| **Strukturální** | Class, Object, Package, Component, Composite, Deployment, Profile |
| **Behaviorální** | Use Case, Activity, State Machine, Sequence, Communication, Timing, Interaction Overview |
| **Class diagram** | Třídy + atributy + metody + vztahy, nejdůležitější |
| **Visibility** | `+` public, `-` private, `#` protected, `~` package |
| **Object diagram** | Konkrétní instance s hodnotami, "snapshot" |
| **Use Case** | Aktér + akce, co může uživatel se systémem dělat |
| **`<<include>>`** | Use case A vždy zahrnuje B |
| **`<<extend>>`** | Use case B volitelně rozšiřuje A |
| **Activity diagram** | Tok aktivit, jako vývojový diagram, kosočtverec = if |
| **Decision** | Kosočtverec v activity, s `[guard]` podmínkou |
| **Fork / Join** | Paralelní rozdělení a spojení |
| **State diagram** | Stavy objektu a přechody mezi nimi |
| **Sequence diagram** | Časová posloupnost zpráv shora dolů |
| **Lifeline** | Svislá přerušovaná čára objektu v sequence |
| **Combined fragments** | alt, opt, loop, par v sequence |
| **Asociace** | Plná čára, základní vztah |
| **Agregace** ◇ | Část přežije celek |
| **Kompozice** ◆ | Část umírá s celkem |
| **Generalizace** ▷ | Dědičnost, šipka na rodiče |
| **Realizace** ┄▷ | Implementace rozhraní |
| **Multiplicita** | `1`, `*`, `0..1`, `1..*`, `2..5` |
| **ER diagram** | NENÍ součástí UML, samostatná notace (Chen 1976) |
| **Crow's Foot** | Nejpopulárnější DB notace dnes |
| **N:M v DB** | Vyžaduje vazební tabulku s FK na obě entity |

---

## Tipy pro ústní zkoušku

### Jak začít

> *"UML je standardizovaný grafický jazyk pro vizualizaci a návrh softwaru, spravovaný organizací OMG. Definuje 14 typů diagramů ve dvou kategoriích: strukturální popisují, z čeho je systém složený, behaviorální popisují, jak funguje. V praxi se používá kombinace 4-5 nejčastějších diagramů: Class, Use Case, Activity, State Machine, Sequence."*
> 

### Co komise typicky chce slyšet

- **Rozdělení strukturální vs behaviorální** s ukázkou diagramů v každé kategorii.
- **Class diagram** podrobně: třída, atributy, metody, viditelnost (+/-/#), vztahy.
- **Rozdíl agregace vs kompozice** s konkrétním příkladem.
- **Use Case diagram**: aktér, system boundary, include/extend.
- **Multiplicita** se zápisy a praktickou ukázkou.

### Doplňky, které komisi potěší

- **OMG** jako standardizační organizace, **UML 2.5.1**.
- **Activity diagram** s decision (kosočtverec) a swimlanes.
- **State diagram** s guards a self-transitions.
- **Sequence diagram s combined fragments** (alt, opt, loop).
- **PlantUML / Mermaid** jako moderní text-based UML.
- **ER vs UML rozlišení**, Crow's Foot notace.