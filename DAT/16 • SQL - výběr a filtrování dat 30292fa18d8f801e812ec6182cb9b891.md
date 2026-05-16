# 16 • SQL - výběr a filtrování dat

> SELECT, JOIN, WHERE, ORDER BY, GROUP BY, HAVING, LIMIT, agregace
> 

> **Formát:** 30 min praktická úloha, 15 min obhajoba + teorie. Praktika je psaní SQL dotazů nad existující databází (typicky `exams.sqlite`) v DB Browser for SQLite. Otázky pokrývají 4 kategorie: jednoduché SELECTy, JOINy, GROUP BY, HAVING.
> 

---

# Část 1: Teorie

### Co je SQL a proč existuje

**SQL (Structured Query Language)** je standardizovaný **deklarativní** jazyk pro práci s relačními databázemi. Říkám **CO chci**, ne **jak to najít**. Optimalizátor DB plánuje vlastní cestu.

```sql
SELECT jmeno FROM student WHERE vek > 18;  -- čitelné jako věta
```

> **Deklarativní vs imperativní**: V imperativním kódu (JavaScript) bys psal smyčku přes pole, kontroloval podmínku, pushoval výsledky. V SQL prostě řekneš "chci to a to". DBMS si rozhodne, jestli použije index, full table scan, parallel query, atd.
> 

### Skupiny SQL příkazů (pro ústní zkoušku)

| Skupina | Příkazy | K čemu |
| --- | --- | --- |
| **DDL** (Data Definition) | `CREATE`, `ALTER`, `DROP`, `TRUNCATE` | Struktura DB (tabulky, sloupce) |
| **DML** (Data Manipulation) | `INSERT`, `UPDATE`, `DELETE` | Data v tabulkách |
| **DQL** (Data Query) | `SELECT` | Výběr dat |
| **DCL** (Data Control) | `GRANT`, `REVOKE` | Oprávnění |
| **TCL** (Transaction Control) | `COMMIT`, `ROLLBACK`, `SAVEPOINT` | Transakce |

> Tahle otázka se týká hlavně **DQL** (`SELECT`). Někdy se DQL považuje za podmnožinu DML.
> 

---

### Anatomie `SELECT` dotazu

Pevné **syntaktické pořadí** klauzulí, vždy stejné:

```sql
SELECT     sloupce                -- 1. co chci zobrazit
FROM       tabulka                -- 2. odkud
JOIN       jina ON podmínka       -- 3. připojení dalších tabulek
WHERE      podmínka               -- 4. filtrace ŘÁDKŮ
GROUP BY   sloupce                -- 5. seskupení
HAVING     podmínka               -- 6. filtrace SKUPIN
ORDER BY   sloupce                -- 7. řazení
LIMIT      n OFFSET m;            -- 8. stránkování
```

> **Logické (vykonávací) pořadí je úplně jiné**, DB nejdřív zjistí tabulku, pak spojí, pak filtruje, atd:
> 
> 
> ```
> FROM → JOIN → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → LIMIT
> ```
> 
> Důsledek: v `WHERE` **nemůžu použít alias ze `SELECT`** (ten ještě neexistuje), ale v `ORDER BY` ano.
> 

---

### `SELECT` + `FROM`: základ

```sql
SELECT * FROM student;                             -- všechny sloupce
SELECT jmeno, prijmeni FROM student;               -- jen vybrané
SELECT jmeno AS J FROM student;                    -- alias sloupce
SELECT DISTINCT trida_id FROM student;             -- bez duplicit
SELECT jmeno, vek + 1 AS pristi_rok FROM student;  -- výpočet
```

**Alias tabulky** (užitečné u JOINů):

```sql
SELECT s.jmeno, t.nazev
FROM student AS s
JOIN trida AS t ON s.trida_id = t.id;
```

> **Pozor na `SELECT *`**: pro učení a debug fajn, v produkci špatně. Pokud někdo přidá sloupec, dotaz vrátí víc dat, než aplikace očekává. Plus zbytečně přenášíš data po síti.
> 

### Kartézský součin (pozor!)

Pokud v `FROM` napíšeš víc tabulek bez podmínky propojení:

```sql
SELECT * FROM student, trida;
-- nebo
SELECT * FROM student CROSS JOIN trida;
```

Dostaneš **každou kombinaci**: 7 studentů × 3 třídy = 21 řádků. U velkých tabulek katastrofa (1000 × 1000 = 1 000 000 řádků). Proto **vždy používej `JOIN ... ON`** s podmínkou.

---

### `WHERE`: filtrování řádků

| Operátor | Příklad | Význam |
| --- | --- | --- |
| `=` `<` `>` `<=` `>=` `!=` (nebo `<>`) | `vek >= 18` | Porovnání |
| `BETWEEN x AND y` | `vek BETWEEN 15 AND 19` | Rozsah (vč. krajů) |
| `IN (a, b, c)` | `trida_id IN (1, 2)` | Hodnota ze seznamu |
| `LIKE 'vzor'` | `jmeno LIKE 'J%'` | `%` = libovolný počet znaků, `_` = právě jeden |
| `IS NULL` / `IS NOT NULL` | `email IS NULL` | Kontrola prázdné hodnoty |
| `AND` `OR` `NOT` |  | Logické operátory |

```sql
SELECT * FROM student
WHERE vek > 18 AND trida_id = 1;

SELECT * FROM student
WHERE prijmeni LIKE 'No%';                -- Novák, Novotný, Nováková

SELECT * FROM student
WHERE trida_id IN (1, 3);
```

### NULL je speciální

> **`WHERE sloupec = NULL` NEFUNGUJE!** NULL není rovno ničemu, ani sobě. Vždy `IS NULL` / `IS NOT NULL`.
> 

```sql
-- ❌ Špatně, vždy vrátí 0 řádků
SELECT * FROM student WHERE email = NULL;

-- ✓ Správně
SELECT * FROM student WHERE email IS NULL;
```

### `LIKE` vzory

| Vzor | Co matchuje |
| --- | --- |
| `'A%'` | Začíná na A (Anna, Adam) |
| `'%a'` | Končí na a (Anna, Ivona) |
| `'%an%'` | Obsahuje "an" (Anna, Daniela) |
| `'A_a'` | A, libovolný 1 znak, a (Aba, Ada) |
| `'_____'` | Přesně 5 znaků |

---

### `ORDER BY` a `LIMIT`

```sql
SELECT * FROM student
ORDER BY prijmeni ASC;             -- vzestupně (výchozí)

ORDER BY vek DESC;                  -- sestupně

ORDER BY prijmeni ASC, jmeno ASC;  -- víc kritérií (sekundární řazení)

-- Stránkování: 2. stránka po 3 záznamech (přeskoč 3, vezmi 3)
SELECT * FROM student
ORDER BY prijmeni
LIMIT 3 OFFSET 3;
```

> **MS SQL Server** používá `TOP 5` místo `LIMIT 5` a `OFFSET ... FETCH NEXT` místo `LIMIT ... OFFSET`. SQLite/MySQL/PostgreSQL: `LIMIT ... OFFSET`.
> 

---

### `JOIN`: spojování tabulek

Spojuje řádky z víc tabulek **přes společný klíč** (typicky FK ↔ PK).

```
INNER JOIN:        LEFT JOIN:         RIGHT JOIN:        FULL OUTER JOIN:
   ┌──┐ ┌──┐         ┌──┐ ┌──┐          ┌──┐ ┌──┐           ┌──┐ ┌──┐
   │  │ │  │         │██│ │██│          │██│ │██│           │██│ │██│
   │██│ │██│         │██│ │██│          │██│ │██│           │██│ │██│
   │██│ │██│         │██│ │██│          │██│ │██│           │██│ │██│
   │  │ │  │         │██│ │  │          │  │ │██│           │██│ │██│
   └──┘ └──┘         └──┘ └──┘          └──┘ └──┘           └──┘ └──┘
  Průnik          Vše z levé        Vše z pravé          Vše z obou
```

| Typ | Co vrátí |
| --- | --- |
| `INNER JOIN` | Jen řádky se **shodou v obou** tabulkách |
| `LEFT JOIN` | **Všechny z levé** + shoda z pravé (NULL kde není shoda) |
| `RIGHT JOIN` | Všechny z pravé + shoda z levé (méně časté) |
| `FULL OUTER JOIN` | Vše z obou (NULL kde není shoda), MySQL ani SQLite nemá |
| `CROSS JOIN` | Kartézský součin (každý s každým) |
| `SELF JOIN` | Tabulka sama se sebou (rekurzivní vazba) |

### Příklady

```sql
-- INNER JOIN: studenti, kteří MAJÍ aspoň jedno hodnocení
SELECT s.jmeno, h.skore
FROM student s
INNER JOIN hodnoceni h ON s.id = h.student_id;

-- LEFT JOIN: VŠICHNI studenti, i bez hodnocení (NULL ve sloupcích z hodnoceni)
SELECT s.jmeno, h.skore
FROM student s
LEFT JOIN hodnoceni h ON s.id = h.student_id;

-- 3 tabulky najednou: student → hodnoceni → predmet
SELECT s.jmeno, p.nazev, h.skore
FROM student s
JOIN hodnoceni h ON s.id = h.student_id
JOIN predmet   p ON p.id = h.predmet_id;
```

### SELF JOIN: tabulka sama se sebou

Pro rekurzivní vazby (manager_id v zaměstnanci):

```sql
SELECT z.jmeno AS zamestnanec, m.jmeno AS manager
FROM zamestnanec z
LEFT JOIN zamestnanec m ON z.manager_id = m.id;
```

Stejná tabulka, 2 různé aliasy (`z` a `m`).

---

### `GROUP BY` + agregační funkce

`GROUP BY` seskupí řádky se **stejnou hodnotou sloupce** do jednoho výsledku. Pak na každou skupinu aplikuju **agregační funkci**.

| Funkce | K čemu |
| --- | --- |
| `COUNT(*)` | Počet řádků ve skupině |
| `COUNT(sloupec)` | Počet řádků kde sloupec NENÍ NULL |
| `COUNT(DISTINCT sloupec)` | Počet unikátních hodnot |
| `SUM(sloupec)` | Součet |
| `AVG(sloupec)` | Průměr |
| `MIN`, `MAX` | Minimum, maximum |

```sql
-- Počet studentů v každé třídě
SELECT trida_id, COUNT(*) AS pocet
FROM student
GROUP BY trida_id;

-- Průměrné skóre každého studenta napříč všemi předměty
SELECT student_id, AVG(skore) AS prumer
FROM hodnoceni
GROUP BY student_id
ORDER BY prumer DESC
LIMIT 5;                          -- top 5
```

> **Pravidlo**: vše v `SELECT`, co **není agregační funkce**, musí být v `GROUP BY` (nebo funkčně závislé na PK skupiny).
> 

### Klasická chyba

```sql
-- ❌ Špatně: jmeno není v GROUP BY ani v agregaci
SELECT trida_id, jmeno, COUNT(*) FROM student GROUP BY trida_id;

-- ✓ Buď přidat do GROUP BY (ale pak nemá smysl):
SELECT trida_id, jmeno, COUNT(*) FROM student GROUP BY trida_id, jmeno;

-- ✓ Nebo agregovat (např. první jmeno abecedně):
SELECT trida_id, MIN(jmeno), COUNT(*) FROM student GROUP BY trida_id;
```

---

### `HAVING`: filtrování skupin

`WHERE` filtruje **řádky před agregací**. `HAVING` filtruje **skupiny po agregaci**. Můžu tam použít agregační funkce (`AVG`, `COUNT`, ...), což ve `WHERE` nejde.

```sql
-- Předměty s průměrným skóre > 80
SELECT predmet_id, AVG(skore) AS prumer
FROM hodnoceni
GROUP BY predmet_id
HAVING AVG(skore) > 80;

-- Třídy, kde jsou víc než 2 studenti
SELECT trida_id, COUNT(*) AS pocet
FROM student
GROUP BY trida_id
HAVING COUNT(*) > 2;
```

### `WHERE` vs `HAVING` (klasický chyták)

|  | `WHERE` | `HAVING` |
| --- | --- | --- |
| **Filtruje** | Jednotlivé řádky | Skupiny po `GROUP BY` |
| **Před / po agregaci** | **Před** | **Po** |
| **Agregační funkce** | Ne | Ano |
| **Bez `GROUP BY`** | Ano | Lze, ale neobvyklé |

```sql
-- Praktický příklad obou v jednom dotazu:
-- Studenti starší 17 let, sloučení do tříd, jen třídy s víc než 2 takovými
SELECT trida_id, COUNT(*) AS pocet
FROM student
WHERE vek > 17                              -- nejdřív filtruj řádky (před agregací)
GROUP BY trida_id
HAVING COUNT(*) > 2;                        -- pak filtruj skupiny (po agregaci)
```

---

### Subquery (poddotaz)

Dotaz **uvnitř jiného dotazu**. Často nahraditelný `JOIN`em, ale někdy přehlednější.

### Skalární subquery (vrací 1 hodnotu)

```sql
-- Studenti starší než průměr
SELECT jmeno, vek
FROM student
WHERE vek > (SELECT AVG(vek) FROM student);
```

### Subquery s `IN`

```sql
-- Studenti, kteří mají hodnocení z předmětu "Databáze"
SELECT jmeno FROM student
WHERE id IN (
    SELECT student_id FROM hodnoceni
    WHERE predmet_id = (SELECT id FROM predmet WHERE nazev = 'Databáze')
);
```

### Korelovaný poddotaz

Na každý řádek vnějšího dotazu se spustí znovu (pomalejší):

```sql
-- Pro každý předmět student s nejvyšším skóre
SELECT p.nazev, s.jmeno, h.skore
FROM hodnoceni h
JOIN student s ON s.id = h.student_id
JOIN predmet p ON p.id = h.predmet_id
WHERE h.skore = (
    SELECT MAX(h2.skore)
    FROM hodnoceni h2
    WHERE h2.predmet_id = h.predmet_id    -- korelace s vnějším h.predmet_id
);
```

### Subquery ve `FROM`

```sql
-- Tabulka průměrů + JOIN
SELECT s.jmeno, p.prumer
FROM (
    SELECT student_id, AVG(skore) AS prumer
    FROM hodnoceni
    GROUP BY student_id
) AS p
JOIN student s ON s.id = p.student_id;
```

---

### CTE: Common Table Expression (`WITH`)

Pojmenovaný dočasný výsledek, čitelnější než vnořené subquery.

```sql
WITH prumery AS (
    SELECT student_id, AVG(skore) AS prumer
    FROM hodnoceni
    GROUP BY student_id
)
SELECT s.jmeno, p.prumer
FROM prumery p
JOIN student s ON s.id = p.student_id
ORDER BY p.prumer DESC
LIMIT 5;
```

**Výhody CTE**:

- **Čitelnější** než vnořené subquery (čteš shora dolů)
- Můžeš mít víc CTE oddělených čárkami
- Lze rekurzivní (`WITH RECURSIVE`) pro stromy

```sql
-- Víc CTE najednou
WITH
    prumery AS (SELECT student_id, AVG(skore) AS prumer FROM hodnoceni GROUP BY student_id),
    nejlepsi AS (SELECT MAX(prumer) AS max_prumer FROM prumery)
SELECT s.jmeno, p.prumer
FROM prumery p
JOIN student s ON s.id = p.student_id
WHERE p.prumer = (SELECT max_prumer FROM nejlepsi);
```

---

### Window funkce (pro pokročilejší dotazy)

> Pro otázku **"N-tý nejvyšší záznam"** (otázka 7 v zadání) je tohle elegantní řešení.
> 

Window funkce počítají **agregace přes "okno" řádků**, ale **nesloučí je**. Každý řádek si zachová svou identitu plus dostane navíc agregovaný sloupec.

```sql
-- Pořadí studentů podle skóre v každém předmětu
SELECT
    s.jmeno,
    p.nazev,
    h.skore,
    RANK() OVER (PARTITION BY h.predmet_id ORDER BY h.skore DESC) AS poradi
FROM hodnoceni h
JOIN student s ON s.id = h.student_id
JOIN predmet p ON p.id = h.predmet_id;
```

| Funkce | K čemu |
| --- | --- |
| `ROW_NUMBER()` | Pořadí (vždy unikátní 1, 2, 3...) |
| `RANK()` | Pořadí s mezerami při shodě (1, 1, 3) |
| `DENSE_RANK()` | Pořadí bez mezer (1, 1, 2) |
| `LAG(col)` | Hodnota z předchozího řádku |
| `LEAD(col)` | Hodnota z následujícího řádku |
| `SUM() OVER (...)` | Běžný součet |

### N-tý nejvyšší záznam

```sql
-- 3. nejvyšší skóre celkově
SELECT skore FROM (
    SELECT skore, DENSE_RANK() OVER (ORDER BY skore DESC) AS r
    FROM hodnoceni
) AS rs
WHERE r = 3;
```

> Window funkce fungují v SQLite 3.25+, MySQL 8+, PostgreSQL všech moderních. Starší MySQL je nepodporuje.
> 

---

### Set operace: `UNION`, `INTERSECT`, `EXCEPT`

Kombinují výsledky dvou `SELECT`ů.

| Operace | Co dělá |
| --- | --- |
| `UNION` | Sjednocení (bez duplicit) |
| `UNION ALL` | Sjednocení (s duplicity), rychlejší |
| `INTERSECT` | Průnik (řádky v obou) |
| `EXCEPT` (PostgreSQL) / `MINUS` (Oracle) | Rozdíl (v prvním, ale ne v druhém) |

```sql
-- Studenti z 1.A NEBO mající skóre nad 90
SELECT jmeno FROM student WHERE trida_id = 1
UNION
SELECT s.jmeno FROM student s
JOIN hodnoceni h ON s.id = h.student_id
WHERE h.skore > 90;
```

> **Podmínka**: oba `SELECT`y musí mít **stejný počet sloupců** a **kompatibilní datové typy**.
> 

---

### Užitečné funkce

```sql
-- Textové
UPPER('ahoj')                       -- 'AHOJ'
LOWER('AHOJ')                       -- 'ahoj'
LENGTH(jmeno)                       -- délka stringu
SUBSTR(jmeno, 1, 3)                 -- prvních 3 znaků (SQLite)
SUBSTRING(jmeno, 1, 3)              -- MySQL/PostgreSQL
jmeno || ' ' || prijmeni            -- concat v SQLite/PostgreSQL
CONCAT(jmeno, ' ', prijmeni)        -- concat v MySQL

-- Číselné
ROUND(prumer, 2)                    -- zaokrouhlení na 2 desetinná místa
ABS(-67)                            -- 67
CEIL(2.3)                           -- 3 (zaokrouhlení nahoru)
FLOOR(2.7)                          -- 2 (zaokrouhlení dolů)

-- Datumové (SQLite syntax)
DATE('now')                         -- aktuální datum
DATETIME('now')                     -- aktuální datum + čas
STRFTIME('%Y', datum)               -- jen rok
JULIANDAY(d1) - JULIANDAY(d2)       -- rozdíl ve dnech

-- Datumové (MySQL)
NOW()                               -- aktuální datum + čas
CURDATE()                           -- aktuální datum
YEAR(datum)                         -- jen rok
DATEDIFF(d1, d2)                    -- rozdíl ve dnech

-- Podmíněné
COALESCE(sloupec, 'default')        -- vrátí první ne-NULL hodnotu
NULLIF(a, b)                        -- NULL pokud a = b, jinak a
CASE WHEN podminka THEN ... ELSE ... END   -- switch-like
```

### `CASE WHEN` (jako switch v SQL)

```sql
SELECT jmeno, vek,
    CASE
        WHEN vek < 18 THEN 'Mladší'
        WHEN vek BETWEEN 18 AND 20 THEN 'Střední'
        ELSE 'Starší'
    END AS kategorie
FROM student;
```

---

### Pořadí provádění (důležité pro ústní zkoušku)

**Logické pořadí**, jak DB skutečně zpracovává dotaz:

```
1. FROM            -- vezmi tabulky
2. JOIN            -- spoj je
3. WHERE           -- filtruj řádky (před agregací)
4. GROUP BY        -- seskup
5. HAVING          -- filtruj skupiny (po agregaci)
6. SELECT          -- spočti sloupce, vytvoř aliasy
7. DISTINCT        -- odstraň duplicity
8. ORDER BY        -- seřaď
9. LIMIT/OFFSET    -- stránkuj
```

**Důsledky**:

- `ORDER BY alias` funguje (`SELECT` už proběhl)
- `WHERE alias` **nefunguje** (`SELECT` ještě neproběhl)
- `WHERE AVG(x) > 5` **nefunguje** (agregace je až v `GROUP BY`) → použij `HAVING`
- `SELECT` se vyhodnocuje **až po `GROUP BY`/`HAVING`**, takže můžeš v `HAVING` použít agregaci, kterou jsi ještě nevypsal

---

### SQLite specifika

> Pro praktickou úlohu typicky pracuješ se `exams.sqlite` v **DB Browser for SQLite**. Pár specifik:
> 
- **`AUTO_INCREMENT`** je `AUTOINCREMENT` (nebo prostě `INTEGER PRIMARY KEY`, dělá to samo)
- **`VARCHAR`** v SQLite neexistuje, používá se `TEXT` (ale `VARCHAR(50)` se přijme jako alias)
- **Žádné `FULL OUTER JOIN`** ani `RIGHT JOIN` (do verze 3.39), použij `LEFT JOIN` s otočením
- **Typování dynamické**: SQLite kontroluje typ jen jako "doporučení"
- **Datumy** jako TEXT v ISO formátu `YYYY-MM-DD`
- **`STRFTIME`** pro formátování datumů (ne `YEAR()`)

```bash
# Otevření z příkazové řádky
sqlite3 exams.sqlite
> .tables                    # výpis tabulek
> .schema Student            # struktura tabulky
> SELECT * FROM Student;
> .quit
```

---

### Časté chyby

| Chyba | Důsledek | Řešení |
| --- | --- | --- |
| `WHERE sloupec = NULL` | Vrátí 0 řádků | `IS NULL` |
| `UPDATE/DELETE` bez `WHERE` | Smaže/přepíše **celou tabulku** | Vždy `WHERE` |
| `SELECT jmeno, COUNT(*) FROM ...` bez `GROUP BY` | Chyba "non-aggregated column" | Přidat do GROUP BY |
| `WHERE COUNT(*) > 5` | Agregace ve WHERE nejde | Použít `HAVING` |
| `JOIN` bez `ON` | Kartézský součin (m × n řádků) | Vždy `ON` podmínka |
| Porovnání case-sensitive vs insensitive | Závisí na collation | `LOWER(sloupec) = LOWER('hodnota')` |
| `WHERE alias` z `SELECT` | Alias ještě neexistuje | Použít plnou expression nebo subquery |
| `ORDER BY` před `LIMIT` ignorováno | DB může změnit pořadí | Vždy `ORDER BY` + `LIMIT` |
| Forgotten alias u JOINu | "Ambiguous column" | `s.id`, `t.id` |
| `SELECT *` v produkci | Křehkost na změny schématu | Vyjmenovat sloupce |
| `LIKE` bez `%` | Hledá exact match | `LIKE 'A%'` ne `LIKE 'A'` |

---

# Část 2: Praktická úloha

### Co může praktická úloha obsahovat

![image.png](16%20%E2%80%A2%20SQL%20-%20v%C3%BDb%C4%9Br%20a%20filtrov%C3%A1n%C3%AD%20dat/image.png)

Typická úloha: databáze v SQLite formátu (např. `exams.sqlite`), otevíráš v **DB Browser for SQLite**. Píšeš dotazy ze 4 kategorií:

1. **Jednoduché SELECTy** (s WHERE, ORDER BY)
2. **JOINy** (INNER, LEFT, víc tabulek)
3. **GROUP BY** + agregace
4. **HAVING** filtry skupin

### Příklad zadání: Školní databáze

### Schéma

```
   ┌──────────┐         ┌─────────────┐         ┌───────────┐
   │  Trida   │ 1 ── N  │   Student   │ 1 ── N  │ Hodnoceni │ N ── 1  ┌──────────┐
   │ id       │         │ id          │         │ student_id│         │ Predmet  │
   │ nazev    │         │ jmeno       │         │ predmet_id│         │ id       │
   └──────────┘         │ prijmeni    │         │ skore     │         │ nazev    │
                        │ vek         │         │ datum     │         └──────────┘
                        │ trida_id FK │         └───────────┘
                        └─────────────┘
```

- **Trida** 1:N **Student** (jeden student v jedné třídě)
- **Student** N:M **Predmet** přes vazební **Hodnoceni** (s atributem `skore` a `datum`)

### Řešení: SQL dotazy

### Úkol 1: Jednoduché SELECTy

**1a) Jména všech studentů**

```sql
SELECT jmeno FROM Student;
```

**1b) Studenti ze třídy "1.A"**

```sql
-- Varianta s JOIN
SELECT s.jmeno, s.prijmeni
FROM Student s
JOIN Trida t ON s.trida_id = t.id
WHERE t.nazev = '1.A';

-- Varianta se subquery (taky funguje)
SELECT jmeno, prijmeni FROM Student
WHERE trida_id = (SELECT id FROM Trida WHERE nazev = '1.A');
```

**1c) Studenti starší než 18 let, seřazení podle příjmení**

```sql
SELECT jmeno, prijmeni, vek
FROM Student
WHERE vek > 18
ORDER BY prijmeni ASC;
```

---

### Úkol 2: JOINy

**2a) Studenti, kteří mají hodnocení z předmětu "Databáze"**

```sql
SELECT DISTINCT s.jmeno, s.prijmeni
FROM Student s
JOIN Hodnoceni h ON s.id = h.student_id
JOIN Predmet p ON p.id = h.predmet_id
WHERE p.nazev = 'Databáze';
```

> **`DISTINCT`** protože student může mít víc hodnocení z předmětu (různá data). Bez DISTINCT by se zobrazil víckrát.
> 

**2b) Všichni studenti + název jejich třídy (vč. studentů bez hodnocení)**

```sql
-- Tady je třída povinná (trida_id NOT NULL), takže LEFT JOIN není potřeba pro třídu
-- ale použijeme ho na hodnocení pro úplnost
SELECT s.jmeno, s.prijmeni, t.nazev AS trida
FROM Student s
JOIN Trida t ON s.trida_id = t.id
ORDER BY t.nazev, s.prijmeni;
```

**2c) Všechna hodnocení s celým jménem a názvem předmětu**

```sql
SELECT
    s.jmeno || ' ' || s.prijmeni AS cele_jmeno,    -- SQLite/PostgreSQL concat
    p.nazev AS predmet,
    h.skore
FROM Hodnoceni h
JOIN Student s ON s.id = h.student_id
JOIN Predmet p ON p.id = h.predmet_id
ORDER BY s.prijmeni, p.nazev;
```

---

### Úkol 3: GROUP BY + agregace

**3a) Pro každý předmět student s nejvyšším skóre**

```sql
-- Varianta 1: korelovaný subquery (klasický přístup)
SELECT p.nazev AS predmet, s.jmeno || ' ' || s.prijmeni AS student, h.skore
FROM Hodnoceni h
JOIN Student s ON s.id = h.student_id
JOIN Predmet p ON p.id = h.predmet_id
WHERE h.skore = (
    SELECT MAX(h2.skore)
    FROM Hodnoceni h2
    WHERE h2.predmet_id = h.predmet_id
)
ORDER BY p.nazev;
```

**3b) Top 5 studentů podle průměrného skóre**

```sql
SELECT
    s.jmeno || ' ' || s.prijmeni AS student,
    ROUND(AVG(h.skore), 2) AS prumer
FROM Student s
JOIN Hodnoceni h ON s.id = h.student_id
GROUP BY s.id, s.jmeno, s.prijmeni
ORDER BY prumer DESC
LIMIT 5;
```

---

### Úkol 4: HAVING

**4a) Předměty s průměrným skóre > 80**

```sql
SELECT
    p.nazev,
    ROUND(AVG(h.skore), 2) AS prumer
FROM Predmet p
JOIN Hodnoceni h ON p.id = h.predmet_id
GROUP BY p.id, p.nazev
HAVING AVG(h.skore) > 80
ORDER BY prumer DESC;
```

**4b) Třídy, kde je víc než 2 studenti**

```sql
SELECT
    t.nazev AS trida,
    COUNT(s.id) AS pocet_studentu
FROM Trida t
JOIN Student s ON s.trida_id = t.id
GROUP BY t.id, t.nazev
HAVING COUNT(s.id) > 2;
```

---

### Bonusy

### Bonus A: Studenti BEZ hodnocení

```sql
SELECT s.jmeno, s.prijmeni
FROM Student s
LEFT JOIN Hodnoceni h ON s.id = h.student_id
WHERE h.student_id IS NULL;
```

> **Princip**: `LEFT JOIN` vrátí všechny studenty. Ti bez hodnocení mají v `h.student_id` hodnotu NULL. Filtrujeme `IS NULL`.
> 

### Bonus B: Statistika za každý předmět

```sql
SELECT
    p.nazev,
    COUNT(h.skore) AS pocet_hodnoceni,
    ROUND(AVG(h.skore), 2) AS prumer,
    MIN(h.skore) AS min_skore,
    MAX(h.skore) AS max_skore
FROM Predmet p
LEFT JOIN Hodnoceni h ON p.id = h.predmet_id
GROUP BY p.id, p.nazev
ORDER BY pocet_hodnoceni DESC;
```

> **`LEFT JOIN`** aby se ukázaly i předměty bez hodnocení (počet = 0).
> 

### Bonus C: Hodnocení nad celkovým průměrem

```sql
SELECT
    s.jmeno || ' ' || s.prijmeni AS student,
    p.nazev AS predmet,
    h.skore
FROM Hodnoceni h
JOIN Student s ON s.id = h.student_id
JOIN Predmet p ON p.id = h.predmet_id
WHERE h.skore > (SELECT AVG(skore) FROM Hodnoceni)
ORDER BY h.skore DESC;
```

> **Subquery `(SELECT AVG(skore) FROM Hodnoceni)`** vrátí jednu hodnotu (celkový průměr), kterou pak porovnáváme s každým hodnocením.
> 

### Bonus D: Stránkování

```sql
-- 2. stránka po 3 záznamech (přeskoč prvních 3, vezmi další 3)
SELECT jmeno, prijmeni
FROM Student
ORDER BY prijmeni
LIMIT 3 OFFSET 3;
```

### Bonus E: CTE pro úkol 3b

```sql
WITH prumery AS (
    SELECT
        student_id,
        AVG(skore) AS prumer
    FROM Hodnoceni
    GROUP BY student_id
)
SELECT
    s.jmeno || ' ' || s.prijmeni AS student,
    ROUND(p.prumer, 2) AS prumer
FROM prumery p
JOIN Student s ON s.id = p.student_id
ORDER BY p.prumer DESC
LIMIT 5;
```

> **CTE výhoda**: jasně oddělené "co spočítat" (průměry) a "co s tím udělat" (JOIN, sort, limit). Čteš to shora dolů jako prozaický postup.
> 

---

### Co se v řešení děje

**Úkol 1**: jednoduché `SELECT` + `WHERE` + `ORDER BY`. 1b ukázal dvě varianty: JOIN (rychlejší pro velké tabulky, optimalizátor lépe pracuje) vs subquery (čitelnější pro 1 hodnotu).

**Úkol 2**: trojnásobný JOIN přes vazební tabulku `Hodnoceni`. `DISTINCT` v 2a je důležité, protože jeden student může mít víc hodnocení z předmětu. `||` operátor pro spojení stringů (SQLite/PostgreSQL).

**Úkol 3**: hlavní téma agregací. **3a má 2 řešení**: korelovaný subquery (klasika) a window funkce (modern). Window je elegantnější, ale potřebuje SQLite 3.25+. **3b je classic top-N pattern**: GROUP BY + AVG + ORDER BY DESC + LIMIT.

**Úkol 4**: HAVING filtruje skupiny **po agregaci**, něco, co WHERE neumí. Klíčový rozdíl pro obhajobu.

**Bonus A** demonstruje **anti-join pattern** (LEFT JOIN + IS NULL): najdi to, co tam **chybí**.

**Bonus C** používá **non-correlated subquery** (spustí se jednou, vrátí 1 hodnotu).

**Bonus E** ukazuje, jak CTE čistí dotaz: místo dvou JOIN + AVG + GROUP BY v jedné větě máš logické dva kroky.

---

## Část 3: Tipy pro obhajobu

### Co u obhajoby říct

> *"V zadání jsem psal SQL dotazy nad školní databází v SQLite. Začnu rolí SQL: deklarativní jazyk, říkám co chci, ne jak to získat. SQL příkazy se dělí na DDL (CREATE, ALTER), DML (INSERT, UPDATE, DELETE), DQL (SELECT) a další skupiny. Pro tuhle otázku je hlavní DQL. Pořadí klauzulí SELECTu je pevné: SELECT, FROM, JOIN, WHERE, GROUP BY, HAVING, ORDER BY, LIMIT. Ale logické (vykonávací) pořadí je jiné: FROM, JOIN, WHERE, GROUP BY, HAVING, SELECT, ORDER BY, LIMIT. Proto v WHERE nemůžeš použít alias z SELECT, ale v ORDER BY ano. Klíčový rozdíl je WHERE vs HAVING: WHERE filtruje řádky před agregací, HAVING skupiny po agregaci, takže agregační funkce jako AVG, COUNT lze použít jen v HAVING. Pro spojení tabulek jsem použil INNER JOIN (jen shody) a LEFT JOIN (všechny z levé + shody). LEFT JOIN je užitečný pro hledání "co tam chybí": LEFT JOIN tabulka ON podmínka WHERE druha_tabulka.id IS NULL najde studenty bez hodnocení. Pro group operace jsem použil GROUP BY s agregacemi COUNT, AVG, MIN, MAX. Pravidlo: vše v SELECT, co není agregace, musí být v GROUP BY. Pro top-N pattern jsem použil ORDER BY DESC + LIMIT. Pro pokročilejší dotazy jsem mohl použít window funkce jako RANK() OVER PARTITION BY pro pořadí v rámci skupiny, nebo CTE pro čistší strukturu komplexních dotazů."*
> 

### Klíčové pojmy pro teorii

| Pojem | Rychlá odpověď |
| --- | --- |
| **SQL** | Deklarativní jazyk pro relační DB |
| **DDL** | `CREATE`, `ALTER`, `DROP`, struktura |
| **DML** | `INSERT`, `UPDATE`, `DELETE`, data |
| **DQL** | `SELECT`, výběr dat |
| **DCL** | `GRANT`, `REVOKE`, oprávnění |
| **TCL** | `COMMIT`, `ROLLBACK`, transakce |
| **`SELECT`** | Co chci vidět (sloupce) |
| **`FROM`** | Odkud (tabulka) |
| **`WHERE`** | Filtrace řádků **před** agregací |
| **`GROUP BY`** | Seskupení řádků |
| **`HAVING`** | Filtrace skupin **po** agregaci |
| **`ORDER BY`** | Řazení (ASC/DESC) |
| **`LIMIT n OFFSET m`** | Stránkování |
| **`INNER JOIN`** | Průnik (shoda v obou) |
| **`LEFT JOIN`** | Vše z levé + shody |
| **`RIGHT JOIN`** | Vše z pravé + shody (málo časté) |
| **`FULL OUTER JOIN`** | Vše z obou (MySQL/SQLite nemá) |
| **`CROSS JOIN`** | Kartézský součin |
| **`SELF JOIN`** | Tabulka sama se sebou |
| **`COUNT`, `SUM`, `AVG`, `MIN`, `MAX`** | Agregační funkce |
| **`DISTINCT`** | Bez duplicit |
| **Subquery** | Dotaz uvnitř dotazu |
| **Korelovaný subquery** | Spustí se pro každý řádek vnějšího |
| **CTE (`WITH`)** | Pojmenovaný dočasný výsledek |
| **Window funkce** | Agregace přes okno bez sloučení |
| **`UNION`** | Sjednocení dvou SELECTů |
| **`NULL`** | Speciální hodnota, `IS NULL` ne `= NULL` |
| **Kartézský součin** | Každý s každým, m×n řádků |

### Časté chytáky

| Otázka | Odpověď |
| --- | --- |
| *Rozdíl `WHERE` a `HAVING`?* | WHERE filtruje řádky před agregací, HAVING skupiny po agregaci. Agregační funkce (`AVG`, `COUNT`) lze jen v HAVING. |
| *Rozdíl `INNER JOIN` a `LEFT JOIN`?* | INNER vrací jen shody v obou tabulkách. LEFT vrací vše z levé + shody z pravé (NULL kde není shoda). |
| *Proč `WHERE jmeno = NULL` nefunguje?* | NULL není rovno ničemu, ani sobě. Musíš `IS NULL` nebo `IS NOT NULL`. |
| *Logické pořadí SELECT?* | FROM, JOIN, WHERE, GROUP BY, HAVING, SELECT, DISTINCT, ORDER BY, LIMIT. |
| *K čemu `GROUP BY`?* | Seskupení řádků se stejnou hodnotou sloupce pro agregaci. Vše v SELECT, co není agregace, musí být v GROUP BY. |
| *Co se stane při `JOIN` bez `ON`?* | Kartézský součin, každý řádek levé × každý řádek pravé. m × n řádků, typicky chyba. |
| *Jak najdu N-tý nejvyšší záznam?* | Window funkce `DENSE_RANK() OVER (ORDER BY skore DESC)` v subquery, filtruj `WHERE r = N`. Nebo `ORDER BY skore DESC LIMIT 1 OFFSET N-1` pro N-tý unikátní. |
| *Co je CTE a kdy víc než subquery?* | Common Table Expression, pojmenovaný dočasný výsledek. Čitelnější pro komplexní dotazy. Můžeš mít víc CTE oddělených čárkami, lze i rekurzivní. |
| *Co dělá `DISTINCT`?* | Odstraní duplicitní řádky z výsledku. |
| `*UNION` vs `UNION ALL`?* | UNION odstraní duplicity (pomalejší), UNION ALL je ponechá (rychlejší). |
| *Co je deklarativní jazyk?* | Říkám CO chci, ne JAK to získat. Optimalizátor DB rozhodne strategii. |
| *Co je kartézský součin?* | Spojení tabulek bez podmínky, každý řádek levé s každým pravé. Vyhnout se přes `JOIN ... ON`. |
| *Kdy korelovaný vs ne-korelovaný subquery?* | Ne-korelovaný se spustí jednou, vrátí konstantu. Korelovaný se spustí pro každý řádek vnějšího (pomalejší). |
| *Proč `UPDATE`/`DELETE` bez `WHERE` katastrofa?* | Smaže nebo přepíše **celou tabulku**, bez možnosti undo (kromě ROLLBACK před COMMIT). |

### Časté chyby v praktické úloze

- `WHERE sloupec = NULL` místo `IS NULL`
- `SELECT col, AGG(x) FROM ... GROUP BY` bez `col` v GROUP BY
- Agregace ve `WHERE` (musí být v `HAVING`)
- JOIN bez `ON` (kartézský součin)
- Forgotten `DISTINCT` při JOIN, který může duplikovat řádky
- `ORDER BY` na alias, který je v `WHERE` (alias ještě neexistuje)
- `UPDATE/DELETE` bez `WHERE` (smaže vše)
- Wildcardy v LIKE bez `%` (`'A'` najde jen přesné A, ne Anna)
- `LIMIT` bez `ORDER BY` (DB může vrátit jiné pořadí)
- Forgotten alias u stejných názvů sloupců z různých tabulek
- `SELECT *` v produkci (křehkost na schéma změny)
- Subquery vrací víc řádků tam, kde má vrátit 1 (skalární kontext)
- `INNER JOIN` místo `LEFT JOIN` při hledání "chybí v druhé tabulce"
- Concat operátor: SQLite/PostgreSQL `||` vs MySQL `CONCAT()` (přehození vede k chybě)
- `COUNT(sloupec)` místo `COUNT(*)`: rozdíl při NULL hodnotách
- Forgotten `GROUP BY` u základu pro každou skupinu (např. `GROUP BY p.id, p.nazev` ne jen `p.id`)