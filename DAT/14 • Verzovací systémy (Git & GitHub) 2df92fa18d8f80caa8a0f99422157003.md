# 14 • Verzovací systémy (Git & GitHub)

řeší problém “jak pracovat v týmu na jednom kódu” a “jak se vrátit, když něco rozbiju”

nahrazuje peklo typu `oauth_final_v2_opravdu_final_final2.zip`

### teorie, historie

- git stvořil Linus Torvalds, potřeboval spravovat vývoj Linux Kernelu
- centralizované vs distribuované:
- **SVN** (subversion): starší systém
    - existuje jeden centrální server
    - když nejde internet, nemůžeš verzovat
    - ukládá primárně rozdíly (diffs/deltas)
- **git** (distribuovaný):
    - každý vývojář má na disku **kompletní kopii** celé historie projektu
    - můžeš pracovat offline a na server (GitHub) to poslat až potom

---

### jak to funguje uvnitř

- staré systémy **(SVN)** ukládal změny (diffy) mezi soubory
- **git** ukládá **snapshoty**.
    - každý commit je odraz celého souborového systému v daný moment
    - git je chytrý - aby nezabíralo tunu místa, git si udělá jen odkaz
- složka **`.git`**
    - skrytá složka v kořenu projektu
    - tady je celá db historie
    - pokud ji smažeš, přijdeš o historii

---

### git workflow

tři stavy, kde se soubor může nacházet:

1. **working directory** (kde reálně píšeš kód)
2. **staging area**: přípravná zóna (`git add`), sem dáváš to, co chceš dál poslat
3. **repository**: uložená historie (`git commit`)

---

### příkazy

**základ:**

`git init` - založení nového repozitáře (složka .git)

`git clone <url>` - stáhne existující projekt ze serveru

**klasika:**

`git add .` - přesune změny do “staging area” (`.`  znamená všechno)

`git status` - řekne ti, co je změněno, co je ve staging area, na jaký branchi seš

`git commit -m "zpráva"` - vytvoření commitu (checkpointu v historii)

**historie a návrat:**

`git log` - historie commitů (kdo, kdy, hash)

`git diff` - rozdíl mezi 2 verzemi (konkrétní změny, řádek po řádku)

`git revert` - vrácení commitu

**větvení (branching)** - umožňuje pracovat mimo master/**main**

`git branch` - výpis větví

`git branch <název>` - vytvoření větve

`git switch <název>` nebo `git checkout` - přepnutí do jiné větve

`git merge <název>` - sloučení větve do té aktuální

- **merge conflict**: když dva lidi změní stejný řádek - git neví, co je správně
- nutno opravit ručně

---

### vzdálené repozitáře (remotes: GitHub, GitLab)

**git** = ****nástroj u tebe. **GitHub** = webová služba (hosting) pro git repozitáře. ****

**GitLab** = selfhostovatelná obdoba GitHubu

`git remote add origin <url>` - propojení local gitu se serverem

`git push` - odeslání změn na server

`git pull` - stažení změn ze serveru, sloučení

`git fetch`  - jen stažení informací

**features githubu:**

- **fork** - kopie cizího projektu k tobě na účet
- **pull request (PR)** - schvalování tvých změn správci repa - základ open-source metodiky
- **issues:** nahlašování chyb, úkolů (Jira)
- **GitHub Actions:** CI/CD - např. automatické testy po každém pushi
- `.gitignore` - tam píšeš, co git nemá vůbec vidět (hesla, .env, `node_modules`, `bin`)

---

### praktická úloha

- vytvořte repozitář
- přidejte `README.md` a vytvořte zmněnu
- změnte sobor
- přidejte změnu
- zobrazte historii
- porovnejte změny
- **řešení**
    
    **1. Vytvořte repozitář**
    
    ```bash
    mkdir MaturitaProjekt
    cd MaturitaProjekt
    git init
    ```
    
    **2. Přidejte README.md a vytvořte změnu**
    
    ```bash
    # Vytvoření souboru (na Windows v PowerShellu: echo "# Můj Projekt" > README.md)
    echo "# Můj Projekt" > README.md
    ```
    
    **3. Přidejte změnu (Staging)**
    
    ```bash
    git status   # Uvidíš, že README.md je červené (untracked)
    git add README.md
    git status   # Teď je zelené (ready to commit)
    ```
    
    **4. Vytvoření commitu**
    
    ```bash
    git commit -m "Initial commit: Přidán README"
    ```
    
    **5. Změňte soubor**
    
    ```bash
    # Připíšeme další řádek
    echo "Další text v souboru" >> README.md
    ```
    
    **6. Porovnejte změny**
    
    ```bash
    git diff
    # Ukáže ti + "Další text v souboru"
    ```
    
    **7. Zobrazte historii**
    
    ```bash
    git add .
    git commit -m "Update README"
    git log
    # Uvidíš dva commity pod sebou
    ```
    

---

primárně **příkazová řádka**

- dale ve vscode, github desktop