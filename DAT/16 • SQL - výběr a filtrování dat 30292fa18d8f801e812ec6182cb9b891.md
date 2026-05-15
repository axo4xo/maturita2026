# 16 • SQL - výběr a filtrování dat

## Základní struktura dotazu (`SELECT` a `FROM`)

Každý dotaz na výběr dat začíná klíčovým slovem `SELECT`, které vrací výsledky vždy ve formě dvojrozměrné tabulky (řádky a sloupce).

- **`SELECT`**: Říká, **jaké sloupečky** chceme ve výsledku vidět. (Např. `SELECT jmeno, prijmeni`). Můžeš použít i `SELECT *` pro výběr všech sloupců.
- **`FROM`**: Říká, **z jaké tabulky** (nebo tabulek) budeme data brát. (Např. `FROM studenti`).
    - *Pozor na kartézský součin:* Pokud do `FROM` napíšeš více tabulek (např. `FROM studenti, tridy`) a neřekneš, jak jsou propojené, databáze udělá kartézský součin – spojí každý řádek z první tabulky s každým řádkem z druhé. To je obrovská a zbytečná zátěž, proto se k propojování používá `JOIN`.

## Spojování tabulek (`JOIN`)

Když potřebujeme data z více tabulek (např. jméno studenta a název jeho třídy), musíme tabulky spojit přes jejich klíče (obvykle cizí klíč jedné se rovná primárnímu klíči druhé).

- **`INNER JOIN` (průnik):** Vrátí jen ty řádky, které mají **shodu v obou** tabulkách.
    - Studenti, kteří mají přiřazenou třídu AND třídy, ve kterých je nějaký student.
- **`LEFT JOIN` (nebo Left Outer Join):** Vrátí **úplně všechny řádky z levé tabulky** (té první) a k ním připojí odpovídající data z pravé tabulky.
    - Pokud k levému záznamu neexistuje pravý, doplní se tam prázdné hodnoty (`NULL`).
    - Např. vypíše všechny studenty, i ty, kteří zatím nemají přiřazenou třídu.
- **`RIGHT JOIN`**: Funguje úplně stejně jako `LEFT JOIN`, akorát naopak – bere vše z pravé tabulky. V praxi se používá málokdy, prostě se radši otočí pořadí tabulek a použije se `LEFT JOIN`.
- **`FULL OUTER JOIN`**: Vrátí úplně všechno z obou tabulek, "všechno se vším", ale narozdíl od kartézského součinu se to snaží spárovat. Kde páry chybí, hodí `NULL`.

## 3. Filtrování dat (`WHERE`)

Slouží k omezení jaké **řádky** se nám vrátí.

- Píšeš sem logické podmínky (operátory `=`, `<`, `>`, `!=`, `AND`, `OR`).
- Např. `WHERE vek > 18 AND mesto = 'Praha'`.

## Seskupování a agregace (`GROUP BY` a `HAVING`)

Když chceš z dat dělat statistiky (počítat průměry, součty, počty), potřebuješ data seskupit.

- **`GROUP BY`**: Vytvoří z dat skupiny podle společného kritéria (např. `GROUP BY trida` udělá z každé třídy jednu skupinu). Obvykle se používá s agregačními funkcemi jako `COUNT()` (počet), `SUM()` (součet), `AVG()` (průměr).
- **`HAVING`**: Tohle je v podstatě **WHERE pro skupiny**. Klasické `WHERE` totiž neumí pracovat s agregacemi. Pokud chceš vypsat jen třídy, kde je víc než 20 studentů, musíš použít `HAVING COUNT(student_id) > 20`.

## Řazení a limit (`ORDER BY` a `LIMIT` / `TOP`)

přicházejí na řadu až úplně na konci

- **`ORDER BY`**: Seřadí výsledky podle zadaného sloupečku. Můžeš řadit vzestupně `ASC` (od A do Z, od 1 do 10 – to je výchozí) nebo sestupně `DESC` (od Z do A, od 10 do 1).
- **`LIMIT` (`TOP` v MS SQL):** Doslova ustřihne výsledek na určitý počet řádků. Např. spojením `ORDER BY body DESC LIMIT 3` dostaneš 3 nejlepší studenty.

---

## Pořadí zpracování dotazu - jak to čte databáze

To, jak SQL dotaz píšeme (začínáme `SELECTem`), vůbec neodpovídá tomu, jak ho databáze reálně fyzicky zpracovává. 

Databáze postupuje takto:

1. **`FROM` a `JOIN`**: Nejdřív si najde tabulky, sáhne si pro data a rovnou je propojí.
2. **`WHERE`**: Z téhle masy dat vyfiltruje jen ty řádky (selekce), které splňují základní podmínky.
3. **`GROUP BY`**: Pokud existuje, roztřídí zbylé řádky do skupin.
4. **`HAVING`**: Profikne a zahodí skupiny, které nesplňují agregační podmínku.
5. **`SELECT`**: Až teď si databáze vybere jen ty sloupečky (projekce), které chceš reálně vypsat.
6. **`ORDER BY`**: Výslednou tabulku seřadí.
7. **`LIMIT` / `TOP`**: Vrátí jen požadovaný počet řádků.