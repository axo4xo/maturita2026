# 15 • ER model a návrh databáze

## 3 úrovně návrhu DB

- **Konceptuální model:** Řeší, *co* chceme ukládat. Kreslíme si objekty a vztahy z reálného světa (např. škola má studenty). Vůbec nás tady nezajímá, jak přesně to bude v databázi naprogramované.
- **Logický model:** Překlápí koncept do podoby tabulek. Tady už definuješ, jaké konkrétní tabulky vzniknou, jaké budou mít primární a cizí klíče a jak se přes ně tabulky propojí.
- **Fyzický model:** Dodává technické detaily pro konkrétní databázový systém (např. MySQL, Oracle). Řeší datové typy (zda je číslo `INT` nebo text `VARCHAR`), přidává indexy pro rychlejší vyhledávání…

## ER modelování (Entity-Relationship)

vytvoření konceptuálního modelu

výsledkem je ER diagram (obvykle kreslený pomocí UML), kde jsou obdélníky propojené čarami

- **Entita:** Představuje typ objektu z reálného světa, který chceme evidovat (podstatné jméno – `Student`, `Kniha`, `Auto`). Je to "šablona", ne konkrétní záznam (nekreslíš studenta Nováka, ale obecnou entitu Student).
- **Atributy:** Vlastnosti dané entity (u studenta to bude Jméno, Věk). Píšou se dovnitř entity.
- **Relace (čára):** Vztah, který spojuje entity a říká, jak spolu souvisí.

**Změna názvosloví (přechod do logického modelu):**
Jakmile přejdeš od kreslení k návrhu samotné databáze, mění se pojmy:

- Entita ⇒ **Tabulka**
- Atribut ⇒ **Sloupeček (Column)**
- Relace ⇒ **Propojení přes klíče**

## klíče v DB

slouží k tomu, abychom každý záznam (řádek) v tabulce jednoznačně identifikovali

- **Kandidátní klíč:** Jakýkoliv sloupeček (nebo kombinace sloupečků), který dokáže stoprocentně a unikátně určit jeden řádek. Příklad: Rodné číslo, e-mail.
- *Problém přirozených identifikátorů:* Rodné číslo se nabízí, ale je to citlivý údaj a navíc ne každý ho má validní (např. cizinci). Není to dobrý primární klíč.
- **Primární klíč (PK - Primary Key):** Jeden vybraný kandidátní klíč, který budeme reálně používat pro identifikaci řádku a tvorbu vazeb. Dnes se skoro výhradně používají **umělé klíče** – obyčejné číselné počítadlo (1, 2, 3...) nebo unikátní řetězec (GUID/CUID).
- **Cizí klíč (FK - Foreign Key):** Sloupeček, který odkazuje na primární klíč v *jiné* tabulce. Tím se fyzicky tvoří relace mezi tabulkami.

## Kardinalita (typy vazeb)

určuje, kolik záznamů na jedné straně může být napojeno na kolik záznamů na straně druhé

- **1:1:** *Člověk – Občanka*. Jeden člověk má max jednu občanku a ta patří jen jemu.
    - Do tabulky `Člověk` se prostě přidá sloupeček `Číslo_občanky` a buď se vyplní, nebo zůstane prázdný.
- **1:N (Jedna ku mnoha):** Nejběžnější typ. Např. *Třída – Student*. Jedna třída má mnoho studentů, ale student chodí jen do jedné třídy.
    - Do tabulky *Student* se přidá cizí klíč, který ukazuje na primární klíč *Třídy*.
- **M:N (Mnohá ku mnoha):** Např. *Autor – Kniha*. Autor napíše víc knih a kniha může mít víc autorů.
    - Databáze tohle technologicky neumí napřímo! V logickém návrhu **musíš vždy vytvořit třetí (spojovací) tabulku** (např. `Autor_Kniha`), do které dáš cizí klíč z Autora a cizí klíč z Knihy. Vazba M:N se tak rozpadne na dvě proveditelné vazby 1:N.

## Složitější a speciální vazby

- **Rekurzivní vztah:** Tabulka má vazbu sama na sebe.
    - Vztah *Rodič – Potomek* nebo *Zaměstnanec – Šéf*. Šéf je taky zaměstnanec, takže leží ve stejné tabulce.
    - Řeší se to tak, že se do tabulky `Zaměstnanci` přidá cizí klíč `ID_Šéfa`, který ukazuje na primární klíč do té samé tabulky.
- **Vazba ISA (Dědičnost):** Znamená, že "něco je druhem něčeho" (např. *Student ISA Člověk*). Jsou dvě hlavní cesty realizace:
    1. Mít jen obří tabulku `Člověk` se všemi myslitelnými sloupci. Kdo není student, bude mít ve studentských sloupcích prázdno (`NULL`).
    2. Udělat tabulku `Člověk` (základní údaje) a samostatnou menší tabulku `Student` (jen věci navíc) a propojit je nadstavbovou vazbou 1:1.

---

praktická otázka!!!

vymodelovat db podle textovýho zadání

namalování, bez pc, stačí na papír

databáze bude trošku vypečená

- rekurzivní vztah
- vazba 1:1
- vazba M:N