# dat-14-git-github

# DAT 14 • Verzovací systémy: Git a GitHub

> Verzovací systémy (Git & GitHub), commit, branch, merge, konflikty, remote, workflow
> 

> **Formát:** 30 min praktická úloha v terminálu (Git Bash / PowerShell), 15 min obhajoba + teorie. Praktika je workflow s vytvořením repa, větve a vyřešením konfliktu. Podle leaku 2026 jde o **nejlehčí DAT otázku**, takže ji buď zvládneš plynule, nebo to bude vypadat divně.
> 

---

## Část 1: Teorie

### 1.1 Co je verzovací systém (VCS)

**Version Control System** je nástroj, který zaznamenává **změny v souborech v průběhu času**, aby ses k libovolné starší verzi mohl vrátit.

Bez VCS:

```
projekt_v1.zip
projekt_v2.zip
projekt_final.zip
projekt_FINAL_OPRAVENO.zip
projekt_OPRAVDU_FINAL_v2.zip
```

S VCS: jedna složka projektu + celá historie schovaná v `.git/`.

### Proč VCS používat

| Důvod | Co umožňuje |
| --- | --- |
| **Historie** | Vrátit se k libovolné předchozí verzi |
| **Spolupráce** | Více lidí na stejném projektu bez přepisování |
| **Experimentování** | Bezpečně zkoušet nové funkce ve vedlejších větvích |
| **Záloha** | Repo na serveru je záloha celé historie |
| **Audit** | `git blame`: kdo a kdy co změnil |
| **Bisect** | Najít commit, který něco rozbil (binární vyhledávání) |

---

### 1.2 Centralizované vs distribuované VCS

Existují dva přístupy.

### Centralizované (CVCS): SVN, CVS, Perforce

```
                   [SERVER: jediná historie]
                       /     |      \
                  pull/push  ↕       ↕
                    /        |        \
               [Klient 1] [Klient 2] [Klient 3]
               jen aktuální verze, ne historie
```

Vlastnosti:

- Existuje **jediný centrální server**, který drží historii.
- Klient má jen aktuální verzi (nebo malou část historie).
- Pokud nejde internet nebo server, **nemůžeš commitovat**.
- Pokud spadne server a není záloha, je po historii.
- Ukládá primárně **rozdíly (diffs/deltas)** mezi verzemi.

### Distribuované (DVCS): Git, Mercurial

```
        [GitHub: jeden z mnoha 'remotes']
            ↕         ↕         ↕
       [Klient 1] [Klient 2] [Klient 3]
       kompletní  kompletní  kompletní
       historie   historie   historie
            ↕         ↕         ↕
            └──peer-to-peer──┘
```

Vlastnosti:

- **Každý klient má lokálně kompletní kopii** celé historie projektu.
- Můžeš pracovat offline a poslat změny na server později.
- Pokud spadne server, kdokoliv může z lokálu obnovit celé repo.
- Git ukládá **snapshoty** (ne diffy, viz dále).
- GitHub není povinný: distribuované znamená, že synchronizace může jít přímo mezi klienty (peer-to-peer).

|  | Centralizované | Distribuované (Git) |
| --- | --- | --- |
| Historie | Jen na serveru | Každý klient kompletní |
| Práce offline | Ne (commit = na server) | Ano (commit lokálně) |
| Server spadne | Nikdo nemůže nic | Klienti pracují dál |
| Rychlost | Limit sítí | Lokální = rychle |
| Příklady | SVN, CVS, Perforce | Git, Mercurial |

---

### 1.3 Git: historie a princip

- Stvořil **Linus Torvalds** v roce **2005**.
- Důvod: po sporu s BitKeeperem (proprietary VCS pro kernel) chtěl rychlý, distribuovaný, integritně chráněný systém pro vývoj Linux kernelu.
- Cíle: **rychlost, distribuovanost, integrita dat, nelineární workflow** (větve), schopnost zvládnout obří projekty.
- Jméno “git” je britský slang pro “blbec, idiot”: Linus to o sobě řekl s humorem.

### Snapshoty místo diffů

Starší systémy (SVN, CVS) ukládaly **diffs**: výchozí soubor + seznam změn mezi verzemi.

Git ukládá **snapshoty**: každý commit je odraz **celého souborového systému** v daný moment.

```
SVN přístup:
verze1: [soubor.txt: "ahoj"]
verze2: + diff (přidán "svet")
verze3: + diff (změněn "svet" na "svete")

Git přístup:
commit1: snapshot {soubor.txt: "ahoj"}
commit2: snapshot {soubor.txt: "ahoj svet"}
commit3: snapshot {soubor.txt: "ahoj svete"}
```

Aby Git nezabíral tunu místa, **soubory, které se nezměnily, neukládá znovu**, jen odkaz na předchozí verzi. Pokud se soubor mění, ukládá ho jako nový objekt (komprimovaný zlibem).

### Identita commitu: SHA-1 hash

Každý commit má unikátní ID: **40znakový hexadecimální hash** (SHA-1), např. `a3c5f9e8b71d4e6f...`. V zápiscích a příkazech stačí prvních 7 znaků (`a3c5f9e`).

Hash se počítá z obsahu commitu (soubory + autor + datum + zpráva + rodič). Pokud se cokoliv v historii změní (i jeden znak), všechny následující hashe se přepočítají. Proto Git může garantovat **integritu**: nikdo neupravil historii bez tvého vědomí.

> **Kolize SHA-1:** Teoreticky možné, prakticky extrémně nepravděpodobné. V roce 2017 Google demonstroval první kolizi (SHAttered), Git proto postupně přechází na SHA-256, ale pro běžnou práci je to irelevantní.
> 

---

### 1.4 Tři stavy souborů

V Gitu se každý soubor může nacházet v jednom ze tří stavů:

```
   Working Directory       Staging Area (Index)      Local Repository
   ┌──────────────┐        ┌──────────────┐          ┌──────────────┐
   │ Editor       │        │ Připravená   │          │ Trvalá       │
   │ Soubory      │ git    │ zóna před    │ git      │ historie     │
   │ na disku     │  add   │ commitem     │  commit  │ (.git/)      │
   └──────────────┘  ───►  └──────────────┘  ───►    └──────────────┘
                                                            │
                                                            │ git push
                                                            ▼
                                                     ┌──────────────┐
                                                     │ Remote (GitHub)
                                                     └──────────────┘
```

| Oblast | Co obsahuje | Jak se mění |
| --- | --- | --- |
| **Working Directory** | Soubory na disku (jak je upravuješ) | Editor, IDE |
| **Staging Area** (Index) | Připravená zóna, co půjde do dalšího commitu | `git add` |
| **Local Repository** (`.git/`) | Trvalé snapshoty historie | `git commit` |
| **Remote Repository** | Záloha na serveru | `git push` / `git pull` |

**Proč staging area existuje?** Aby sis mohl commit připravit přesně: třeba ze 4 změněných souborů přidat do commitu jen 2 (logicky patří k sobě) a zbytek nechat na další commit.

### Stavy souboru v Git slovníku

- **Untracked**: Git tento soubor zatím nezná. Nově vytvořený soubor v projektu.
- **Tracked**: Git ho sleduje. Tracked může být:
    - **Unmodified**: od posledního commitu se nezměnil.
    - **Modified**: změnil ses od posledního commitu, ale není ve stagingu.
    - **Staged**: připraven k zařazení do dalšího commitu.

```
Untracked  ──(git add)──►  Staged  ──(git commit)──►  Unmodified
                                                          │
                                                       (editace)
                                                          ▼
                                                       Modified  ──(git add)──►  Staged
```

---

### 1.5 Co je commit

**Commit** je neměnitelný **snapshot** všech souborů v daném okamžiku plus metadata:

- **Hash (SHA-1)**: unikátní ID, např. `a3c5f9e8`
- **Autor**: jméno + email z `git config`
- **Datum a čas**
- **Zpráva** (commit message)
- **Parent commit**: předchozí commit (kromě úplně prvního, který je “root”)

```
Commit graf:
                                          HEAD
                                            ↓
   c1 ◄── c2 ◄── c3 ◄── c4 ◄── c5         main
   │      │      │      │      │
   First  Add    Fix    Refac  Docs
   commit form   bug    tor    update
```

Šipky ukazují **dozadu**: každý commit zná svého rodiče. To umožňuje rekonstruovat libovolnou předchozí verzi.

### HEAD: kde právě jsi

**HEAD** je speciální ukazatel: říká, **na kterém commitu právě stojíš** (a obvykle na které větvi). Když uděláš commit, HEAD se posune na nový commit. Když přepneš větev, HEAD se přesune na hlavičku té větve.

```
                             HEAD
                              │
                              ▼
                              ┌── feature
                              │
   c1 ◄── c2 ◄── c3 ◄── c4    │
                       \      │
                        \     c5
                         \
                          ◄── c6 (main)
```

### Detached HEAD

Když uděláš `git checkout <hash>` (přejdeš na konkrétní commit, ne na větev), HEAD ukazuje přímo na commit, ne na větev: tomu se říká **detached HEAD**.

```
        HEAD
         │
         ▼
   c1 ◄── c2 ◄── c3 (main)
```

Není to chyba, jen varování: pokud teď uděláš commit a přepneš větev, ten commit “ztratíš” (nebude na žádné větvi a Git ho po čase smaže). Záchrana: vytvoř větev (`git switch -c moje-vetev`).

---

### 1.6 Skrytá složka `.git/`

Vznikne příkazem `git init`. Obsahuje **kompletní historii** repozitáře:

```
.git/
├── HEAD                    # ukazatel na aktuální větev
├── config                  # konfigurace repa
├── refs/
│   ├── heads/              # lokální větve (main, feature/...)
│   ├── tags/               # tagy
│   └── remotes/            # vzdálené větve (origin/main)
├── objects/                # všechny commity, soubory, stromy (komprimované zlibem)
└── logs/                   # historie pohybů HEAD a větví (reflog)
```

> **Smažeš `.git/` ─► ztratíš celou historii** (zůstanou jen aktuální soubory). Proto se `.git/` nikdy necommituje (ani nelze, je to ten Git sám).
> 

### Reflog: záchranná síť

`git reflog` ukáže **historii všech pohybů HEAD** za posledních 90 dní (default). I commity, které jsi “smazal” přes `reset --hard`, jsou tu pořád. Když uděláš blbost, často se z toho dostaneš přes `git reset --hard HEAD@{2}` (vrátit se na stav před 2 operacemi).

---

## Část 2: Základní příkazy CLI

### 2.1 Konfigurace (jednorázově po instalaci)

```bash
git config --global user.name "Jan Novák"
git config --global user.email "jan@example.com"
git config --global init.defaultBranch main      # nová repa pojmenovat main (ne master)
git config --global core.editor "code --wait"    # VS Code jako editor pro commit zprávy
```

> **Proč `main` místo `master`:** GitHub v roce 2020 (a po něm další služby) přejmenoval default větev z politických důvodů. Funkčně se nic nemění.
> 

### 2.2 Založení repozitáře

```bash
git init                    # vytvoří .git/ ve stávající složce
git clone <URL>             # stáhne existující repo z GitHubu
git clone <URL> <slozka>    # naklonuje do konkrétní složky
```

### 2.3 Denní práce

```bash
git status                  # co je změněno, co je staged, na jaké větvi jsi
git add <soubor>            # přidá soubor do stagingu
git add .                   # přidá VŠECHNY změny v aktuální složce
git add -p                  # interaktivně: ptá se po každé části změny
git commit -m "Popis"       # vytvoří snapshot
git commit -am "Popis"      # add + commit pro tracked soubory (untracked neudělá)
git commit --amend          # uprav poslední commit (zprávu nebo přidej soubory)
git log                     # historie commitů
git log --oneline           # každý commit na jeden řádek
git log --oneline --graph --all  # vizuální graf všech větví
git log -p                  # včetně diffů
git diff                    # co jsi změnil (working dir → staging)
git diff --staged           # co je staged (staging → poslední commit)
git diff HEAD               # co se změnilo od posledního commitu (vč. unstaged)
git show <hash>             # detail konkrétního commitu
```

### 2.4 Synchronizace s remotem

```bash
git remote -v                         # výpis remotes
git remote add origin <URL>           # přidat vzdálený repo
git push -u origin main               # první push (-u = nastavit upstream)
git push                              # další pushy
git pull                              # = git fetch + git merge
git pull --rebase                     # = git fetch + git rebase (lineární historie)
git fetch                             # stáhne, ale NEslučuje (bezpečnější)
git fetch --all                       # stáhne ze všech remotes
```

> **`pull` vs `fetch`:** `fetch` jen stáhne nové commity do `origin/main`, neudělá s tvojí prací nic. `pull` to udělá a hned to **sloučí do tvé aktuální větve**. Pokud chceš opatrně zjistit, co je nového, použij `fetch` a pak `git log origin/main`. Pak teprve merguj.
> 

### 2.5 Vrácení změn

```bash
git restore <soubor>                  # zahodit změny ve working dir (vrátit na poslední commit)
git restore --staged <soubor>         # vyndat ze stagingu (zachovat změny ve working dir)
git checkout <soubor>                 # starší syntaxe pro git restore
git reset --soft HEAD~1               # zrušit poslední commit, změny zůstanou ve stagingu
git reset --mixed HEAD~1              # zrušit commit, změny ve working dir (default)
git reset --hard HEAD~1               # ZRUŠÍ commit i změny (nelze vrátit běžně!)
git revert <hash>                     # vytvoří NOVÝ commit, který vrátí změny (bezpečné)
git clean -fd                         # smaže untracked soubory a složky
```

### Reset varianty: rozdíl

| Varianta | Working Directory | Staging | Local Repo |
| --- | --- | --- | --- |
| `--soft` | nezměněno | zachová změny | vrátí commit |
| `--mixed` (default) | nezměněno | vyčistí | vrátí commit |
| `--hard` | **přepíše!** | vyčistí | vrátí commit |

**Pravidlo:** `git reset --hard` na **pushnutý** commit = velký problém (přepíšeš historii kolegům). Na sdílených větvích vždy `git revert`.

### Revert vs Reset

```
Před:           c1 ◄── c2 ◄── c3 (HEAD, main)

git reset --hard HEAD~1:
                c1 ◄── c2 (HEAD, main)   ← c3 "zmizel" (lze obnovit přes reflog)

git revert HEAD:
                c1 ◄── c2 ◄── c3 ◄── c4 (HEAD, main)
                                     ↑
                            c4 = "anti-c3", vrací změny z c3
```

### 2.6 Stash: dočasné odložení změn

Občas potřebuješ rychle přepnout větev, ale máš rozpracované změny, které nechceš commitovat. `git stash` je odloží na vedlejší koleji.

```bash
git stash                             # odloží všechny změny (working dir + staging)
git stash -u                          # včetně untracked souborů
git stash push -m "popis"             # se zprávou
git stash list                        # seznam všech stashů
git stash pop                         # aplikuje poslední stash a smaže ho ze seznamu
git stash apply                       # aplikuje, ale nesmaže (lze použít víckrát)
git stash drop stash@{0}              # smaže konkrétní stash
git stash clear                       # smaže všechny stashe
```

**Typický scénář:** Pracuješ na feature, šéf zavolá “rychle oprav production”. `git stash` ► přepneš na main ► hotfix ► `git stash pop` ► pokračuješ.

---

## Část 3: Větve (Branches)

**Větev** je pohyblivý ukazatel na commit. Umožňuje **paralelní vývoj**: pracuješ na nové funkci bez ovlivnění hlavního stabilního kódu.

### 3.1 Vizualizace

```
               c4 ◄── feature/add-form
              /
   c1 ◄── c2 ◄── c3
              \
               c5 ◄── main
   - main pokračuje v c5
   - feature/add-form pokračuje v c4
   - obě začaly z c3
```

Vlastně větev je jen **textový soubor v `.git/refs/heads/`**, který obsahuje hash commitu. Levný jako blázen, vytvoření je atomická operace.

### 3.2 Příkazy

```bash
git branch                            # seznam větví (* = aktuální)
git branch <jmeno>                    # vytvoří větev (nepřepne!)
git branch -a                         # včetně remote větví
git checkout <jmeno>                  # přepnout (starší příkaz, dělá víc věcí)
git switch <jmeno>                    # přepnout (novější, jasnější)
git switch -c feature/add-form        # vytvoří + přepne najednou
git checkout -b feature/add-form      # starší ekvivalent
git branch -d <jmeno>                 # smazat větev (jen pokud je sloučená)
git branch -D <jmeno>                 # smazat I nesloučenou (pozor!)
git branch -m <stare> <nove>          # přejmenovat
```

> **`checkout` vs `switch`:** `git checkout` historicky dělá víc věcí (přepnutí větve, checkout souborů, detached HEAD na commit). Pro přehlednost zavedli `git switch` (jen větve) a `git restore` (jen soubory). `checkout` ale funguje pořád a starší tutoriály ho používají.
> 

### 3.3 Konvence pojmenování

| Prefix | Účel | Příklad |
| --- | --- | --- |
| `feature/` | Nová funkčnost | `feature/login-form` |
| `fix/` nebo `bugfix/` | Oprava bugu | `fix/null-pointer` |
| `hotfix/` | Urgentní oprava produkce | `hotfix/security-patch` |
| `refactor/` | Refaktoring bez nové funkčnosti | `refactor/extract-service` |
| `docs/` | Jen dokumentace | `docs/readme-update` |
| `chore/` | Údržba, build, závislosti | `chore/upgrade-deps` |
| `test/` | Testy | `test/login-coverage` |

---

## Část 4: Sloučení (Merge a Rebase)

### 4.1 Fast-forward merge (lineární)

Když na `main` od oddělení větve **nepřibyl žádný commit**, Git jen posune ukazatel `main` dopředu:

```
Před:                                Po git merge feature:
   feature                              feature, main (oba na c4)
      ▼                                      ▼
   c1 ◄── c2 ◄── c3 ◄── c4              c1 ◄── c2 ◄── c3 ◄── c4
                  ▲
                  main
```

Žádný nový commit, jen posun ukazatele.

### 4.2 Merge commit (3-way merge)

Když na **obou větvích** vznikly nové commity od jejich oddělení, Git vytvoří **nový merge commit** se 2 rodiči:

```
Před:                                Po git merge feature:
        c4 (feature)                                   ┌── feature
       /                                              c4
   c1 ◄── c2 ◄── c3            c1 ◄── c2 ◄── c3       │
                  \                            \       ▼
                   c5 (main)                    c5 ◄── M (main)
                                                ▲      ↑
                                                └──────┘
                                          (M má 2 rodiče: c4 a c5)
```

```bash
git switch main
git merge feature/add-form    # sloučí feature do main
git merge --no-ff feature     # vynucený merge commit i když by šel FF (zachová "historii větve")
```

### 4.3 Merge vs Rebase

| Merge | Rebase |
| --- | --- |
| Zachová historii větvení | Vytvoří **lineární historii** |
| Vytvoří merge commit | “Přepíše” commity na nový base |
| Bezpečnější pro sdílenou práci | **Nepoužívat** na pushnuté commity! |
| `git merge feature` | `git rebase main` (na feature větvi) |

```
REBASE:
Před:           c3 ◄── c4 (feature)
                /
   c1 ◄── c2 ◄── c5 ◄── main

git switch feature
git rebase main:

   c1 ◄── c2 ◄── c5 ◄── c3' ◄── c4' (feature)
                  ▲
                  main
                  (c3' a c4' jsou "přemístěné" kopie c3 a c4 s novými hashi)
```

**Zlaté pravidlo rebase:** **Nikdy nedělej rebase na commity, které jsi už pushnul a které někdo jiný má!** Přepíšeš historii a kolegům to rozhází.

### 4.4 Squash merge

Sloučí všechny commity z feature větve do **jednoho commitu** na main:

```bash
git merge --squash feature/add-form
git commit -m "Add task form (#42)"
```

Hodí se, když má feature 20 “WIP”, “fix typo”, “fix again” commitů a chceš čistou historii. GitHub Pull Request to umí jedním kliknutím (Squash and merge).

---

## Část 5: Konflikty (Merge Conflicts)

**Vznikne**, když dva lidé (nebo dvě větve) změní **stejný řádek** ve stejném souboru jinak. Git neví, čí změna je správná, a požádá tě o ruční rozhodnutí.

### 5.1 Typy konfliktů

| Typ | Kdy nastane |
| --- | --- |
| **edit/edit** | Oba změnili stejný řádek (nejčastější) |
| **delete/edit** | Jeden smazal soubor, druhý ho upravil |
| **rename/rename** | Oba přejmenovali soubor jinak |
| **add/add** | Oba vytvořili nový soubor stejného jména |

### 5.2 Vizualizace

```
   main:                   feature:
   line 1                  line 1
   text starý ◄─┐    ┌─►   text NOVÝ
   line 3       │    │     line 3
                │    │
                └────┴── KONFLIKT na řádku 2!
```

### 5.3 Jak se projeví v souboru

Po `git merge` Git označí konflikt v souboru:

```
line 1
<<<<<<< HEAD
text starý
=======
text NOVÝ
>>>>>>> feature/add-form
line 3
```

| Marker | Význam |
| --- | --- |
| `<<<<<<< HEAD` | Začátek tvé verze (current branch) |
| `=======` | Oddělovač |
| `>>>>>>> feature` | Konec verze z mergované větve |

### 5.4 Postup řešení

1. **`git status`** ukáže, které soubory mají konflikt
2. **Otevři soubor**, najdi `<<<<<<<`
3. **Ručně vyber správnou verzi** (smaž markery, nechej co má zůstat: buď jednu, druhou, nebo kombinaci obou)
4. **`git add <soubor>`**: označ jako vyřešený
5. **`git commit`**: dokončí merge (Git připraví výchozí zprávu typu “Merge branch ‘feature’ into main”)

```bash
# Pokud chceš celý merge zahodit:
git merge --abort
```

### 5.5 Jak konfliktům předcházet

- **Často `git pull`** (synchronizace): minimum změn na každé větvi
- **Krátce žijící větve**: slučovat do main do týdne
- **Jasné rozdělení práce**: nepracujeme oba na stejném souboru
- **Komunikace** v týmu
- **Malé commity**: snadnější merge

### 5.6 Pomocné nástroje

```bash
git mergetool                # spustí grafický merge tool (VS Code, kdiff3, meld...)
git config --global merge.tool vscode
```

VS Code má vestavěný UI pro řešení konfliktů: tlačítka “Accept Current”, “Accept Incoming”, “Accept Both”.

---

## Část 6: Tagy

**Tag** je pojmenovaná značka konkrétního commitu, typicky verze release.

```bash
git tag                                  # výpis všech tagů
git tag v1.0.0                           # lightweight tag (jen ukazatel)
git tag -a v1.0.0 -m "First release"     # annotated tag (má autora, datum, zprávu)
git tag -a v1.0.0 <hash>                 # tag na konkrétní starší commit
git show v1.0.0                          # detail tagu
git push origin v1.0.0                   # push konkrétního tagu (push standardně tagy neposílá!)
git push --tags                          # push všech tagů
git tag -d v1.0.0                        # smazat lokálně
git push origin --delete v1.0.0          # smazat na remote
```

### Lightweight vs Annotated

|  | Lightweight | Annotated |
| --- | --- | --- |
| Co je | Ukazatel na commit | Plnohodnotný objekt s metadaty |
| Metadata | Ne | Autor, datum, zpráva, podpis |
| Použití | Lokální označení | Release verzí |

**Konvence pojmenování:** `v1.0.0`, `v2.3.1` (semver: major.minor.patch).

GitHub na základě tagu umí vytvořit **Release** (stránka s changelogem, ZIP/TAR ke stažení).

---

## Část 7: GitHub a vzdálené repozitáře

### 7.1 Git vs GitHub: klíčový rozdíl

| **Git** | **GitHub** |
| --- | --- |
| Nástroj (program) na lokále | Webová služba (hosting) |
| `git init`, `git commit`, … | `github.com/uzivatel/repo` |
| Funguje **offline** | Cloud, potřebuje internet |
| Open source, zdarma | Komerční (zdarma do limitu) |
| Vznik 2005 | Vznik 2008 |
| Linus Torvalds | GitHub Inc., dnes Microsoft |

> **Alternativy GitHubu:** **GitLab** (selfhost možný), **Bitbucket** (Atlassian, integrace s Jirou), **Codeberg** (komunitní, Gitea), **Gitea** / **Forgejo** (self-hosted), **SourceHut**. Princip stejný, UI a feature set jiný.
> 

### 7.2 Funkce GitHubu nad rámec Git

| Funkce | Co dělá |
| --- | --- |
| **Remote repository** | Záloha kódu v cloudu, sdílení |
| **Pull Request (PR)** | Žádost o merge: kolega zkontroluje (Code Review), může komentovat, schválit |
| **Issues** | Sledování chyb a úkolů (jednoduchá Jira) |
| **GitHub Actions** | CI/CD: automatické testy, build, deploy po každém pushi |
| **Fork** | Kopie cizího projektu na tvůj účet (typické u open source) |
| **GitHub Pages** | Statický web hostovaný zdarma z repa |
| **Codespaces** | Cloudové VS Code dev prostředí |
| **Wiki** | Dokumentace |
| **Projects** | Kanban / table na issues a PRs |
| **Discussions** | Diskuze ke komunitním projektům |
| **Security alerts** | Dependabot, scan zranitelností |

### 7.3 Workflow: Pull Request

```
1. Vytvořím větev z main:        git switch -c feature/login
2. Commity:                       (kód) → git add → git commit
3. Push na GitHub:                git push -u origin feature/login
4. Na GitHubu otevřu PR:          z feature/login → do main
5. Code Review:                   kolegové komentují, dávají change requests
6. Buď úprav (push do stejné větve, PR se aktualizuje) nebo schváleno
7. Merge přes GitHub UI:          Squash / Merge commit / Rebase
8. Smazání větve:                 GitHub nabídne smazat feature/login
9. Lokálně:                       git switch main → git pull → git branch -d feature/login
```

### 7.4 Fork: práce s cizím projektem

```
Originál (cizí):       github.com/torvalds/linux
Můj fork:              github.com/jaaa/linux  (vytvořeno přes "Fork" tlačítko)

1. Forknu si projekt
2. git clone https://github.com/jaaa/linux
3. Vytvořím feature větev, commitnu, pushnu
4. Otevřu PR ze svého forku do originálu
5. Maintainer zkontroluje, mergne (nebo zamítne)
```

Toto je standardní open source workflow.

### 7.5 Force push: kdy a proč ne

```bash
git push --force                      # přepíše historii na remote (nebezpečné!)
git push --force-with-lease           # bezpečnější: jen pokud nikdo jiný nepushnul
```

**Force push** je potřeba po `rebase` nebo `commit --amend` (změnily se hashe). Ale na sdílené větvi (typicky `main`) je to **katastrofa**: přepíšeš historii ostatním.

**Pravidlo:** force push jen na své vlastní feature větve, nikdy na `main` / `develop` / sdílené.

---

## Část 8: `.gitignore`

Soubor v root složce repa. Každý řádek = vzor, který se ignoruje.

```
# Build outputy
bin/
obj/
build/
dist/
target/

# Závislosti
node_modules/
packages/
vendor/

# IDE a editory
.vscode/
.idea/
*.suo
*.user
*.swp

# Logy a dočasné
*.log
*.tmp
.DS_Store
Thumbs.db

# Citlivé (NIKDY necommitovat!)
.env
.env.local
secrets.json
appsettings.Production.json
*.pem
*.key
```

**Pravidla syntaxe:**

- `node_modules/` ► celá složka
- `.log` ► všechny `.log` soubory
- `!important.log` ► výjimka (toto neignoruj)
- `/build` ► jen v root (ne v podsložkách)
- `*/temp` ► v jakékoliv hloubce
- `#` ► komentář

> **Důležité:** `.gitignore` se **commituje** (sdílí mezi vývojáři). Pokud už je soubor sledován, `.gitignore` ho **nepřestane sledovat**: musíš `git rm --cached <soubor>` (smaže z indexu, ale ne z disku) a pak commitnout.
> 

### Šablony

`gitignore.io` nebo přímo GitHub má sbírku šablon pro každý jazyk/framework: Node, Python, .NET, Java, Unity, atd. Při `git init` jen zkopíruj relevantní.

---

## Část 9: Workflow modely

### 9.1 GitHub Flow (jednoduchý, pro web/SaaS)

```
main: vždy deployovatelná
  │
  ├─ feature/login → PR → review → merge → main → deploy
  ├─ feature/cart  → PR → review → merge → main → deploy
  └─ fix/bug-123   → PR → review → merge → main → deploy
```

Vlastnosti:

- Jedna hlavní větev (`main`)
- Každá změna přes feature větev a PR
- Continuous deployment (každý merge do main jde do produkce)
- Vhodné pro webové aplikace, mikroservisy

### 9.2 Git Flow (komplexní, pro release-based produkty)

```
main          ─── stabilní produkce (jen tagged release)
develop       ─── integrace nových featur
feature/*     ─── nové funkce (vznikají z develop, mergují zpět)
release/*     ─── příprava verze (z develop, finální testy, pak na main)
hotfix/*      ─── urgentní opravy v produkci (z main, mergují i do develop)
```

Vlastnosti:

- Dvě dlouhodobé větve (`main`, `develop`)
- Plánované releasy s verzováním
- Vhodné pro desktop apps, mobilní apps, knihovny
- Dnes méně populární, většina projektů přešla na GitHub Flow

### 9.3 Trunk-Based Development

Všichni pracují přímo na `main` (s feature flags pro nedokončené věci). Vyžaduje silnou CI/CD a kulturu testování. Google, Facebook.

---

## Část 10: CLI vs GUI klient

### 10.1 CLI (Command Line): terminál

```bash
git status
git add .
git commit -m "Add login form"
git push
```

| ✓ Výhody | ✗ Nevýhody |
| --- | --- |
| Rychlé | Pamatovat příkazy |
| Plná kontrola | Strmější křivka učení |
| Skriptovatelné (CI/CD) | Méně intuitivní pro vizuální typy |
| Funguje všude (SSH, server) |  |

### 10.2 GUI klienti

| Klient | Vlastnost |
| --- | --- |
| **GitHub Desktop** | Jednoduchý, oficiální, free |
| **SourceTree** | Atlassian, free, plný features |
| **GitKraken** | Pěkné UI, placené pro privátní repa |
| **VS Code Git tab** | Integrovaný v editoru, dnes nejpopulárnější |
| **JetBrains Git** | V IntelliJ / Rider / PyCharm |
| **Fork** | Mac / Windows, čisté UI |
| **Lazygit** | Terminálové TUI, hybrid CLI/GUI |

| ✓ Výhody | ✗ Nevýhody |
| --- | --- |
| Vizuální historie (graf větví) | Skrývá co se děje na pozadí |
| Snadné řešení konfliktů (klikání) | Někdy neumí pokročilé příkazy |
| Intuitivní pro začátečníky | Závislost na konkrétní aplikaci |

> **Doporučení:** uměj **CLI** (na pohovor / maturitu) + používej **VS Code Git tab** v denní práci. Kombinace je nejlepší.
> 

---

## Část 11: Časté chyby

| Chyba | Důsledek | Řešení |
| --- | --- | --- |
| Commit hesel / `.env` do repa | Bezpečnost (i po smazání zůstává v historii!) | `.gitignore` + `git rm --cached` + rotovat heslo |
| `git push --force` na main | Přepíše historii kolegům | Nikdy! Použij PR a normální merge |
| `git reset --hard` na pushnutém commitu | Rozhází ostatním historii | Použij `git revert` |
| Velké binární soubory (videa, ZIPy) | Repo nabobtná, pomalé klonování | Git LFS nebo cloudové úložiště |
| Commit messages “fix” / “aaa” / “.” | Nečitelná historie | Imperativ: “Add login validation” |
| Merge bez PR review | Špatný kód v main | Vždy code review |
| Práce v `main` bez větve | Konflikty, rozbitý main | Vždy `git switch -c feature/...` |
| `git add .` ve špatné složce | Přidání nechtěných souborů | `git status` před commitem |
| Zapomenout `git pull` před prací | Konflikty | `git pull` jako první ráno |
| `commit --amend` na pushnutý commit | Force push nutnost | Amend jen na nepushnuté |

---

## Část 12: Cheat sheet

```bash
# === ZALOŽENÍ ===
git init                              # nový lokální repo
git clone https://github.com/u/r.git  # naklonovat existující

# === DENNÍ PRÁCE ===
git status                            # co se děje
git add .                             # vše do stagingu
git add soubor.txt                    # konkrétní
git commit -m "Add login"             # vytvořit snapshot
git log --oneline --graph --all       # historie

# === VĚTVE ===
git branch                            # seznam
git switch -c feature/login           # vytvořit a přepnout
git switch main                       # přepnout zpět
git merge feature/login               # sloučit do current
git branch -d feature/login           # smazat sloučenou

# === REMOTE ===
git remote add origin URL             # přidat vzdálený
git push -u origin main               # 1. push
git push                              # další
git pull                              # stáhnout + sloučit
git fetch                             # jen stáhnout

# === VRÁCENÍ ===
git restore soubor.txt                # zahodit změny
git restore --staged soubor.txt       # vyndat ze stagingu
git reset --soft HEAD~1               # zpět commit, zachovat změny
git revert <hash>                     # bezpečný undo (nový commit)

# === STASH ===
git stash                             # odložit změny
git stash pop                         # vrátit poslední
git stash list                        # seznam

# === TAGY ===
git tag -a v1.0 -m "First release"    # annotated tag
git push origin v1.0                  # push tagu
git push --tags                       # push všech tagů

# === KONFLIKT ===
# 1. otevři soubor s <<<<<<<
# 2. uprav ručně, smaž markery
git add soubor.txt                    # označ vyřešený
git commit                            # dokonči merge
# nebo
git merge --abort                     # zruš merge

# === ZÁCHRANA ===
git reflog                            # historie HEAD (i smazané commity)
git reset --hard HEAD@{2}             # vrátit se 2 operace zpět
```

---

# Část B: Praktická úloha

## B.1 Zadání (leak 2026)

> Vytvoření git repa, přidání souborů, branche, merge, merge conflict.
> 

Předveď v terminálu (Git Bash / PowerShell) kompletní Git workflow, který obsahuje:

1. Vytvoření nového lokálního repa
2. Přidání souborů + commit
3. Vytvoření větve (branch)
4. Změny na obou větvích záměrně tak, aby vznikl konflikt
5. Merge + řešení konfliktu
6. (volitelně) Push na GitHub

Po každém kroku spusť `git status` nebo `git log --oneline --all --graph`, abys mohl komentovat stav.

### Co se procvičí

- ✓ Inicializace repa (`git init`)
- ✓ `.gitignore`: co Git nesleduje
- ✓ Staging + commit (`add`, `commit`)
- ✓ Větve (`switch -c`, `merge`)
- ✓ Konflikt: vznik + ruční řešení
- ✓ GitHub: `remote add`, `push`
- ✓ Tagy (`git tag`)
- ✓ Čtení historie (`log --graph`)

### Vizualizace cílového stavu

```
                                   ┌── feature/add-form
                                   │
                                   c3 (přidá formulář)
                                  /
   c1 ◄── c2 ◄────────────────── M ◄── main
                              │
                              c4 (změní text v stejném souboru)
                              ↑
                         KONFLIKT vyřešen v M
```

### Stromová struktura projektu po dokončení

```
todo-app/
├── .git/                      ← skrytá Git složka (po git init)
├── .gitignore                 ← bin/, obj/, *.log
├── index.html                 ← s formulářem
└── app.js                     ← s handlerem
```

---

## B.2 Kompletní řešení

### Krok 1: Inicializace

```bash
mkdir todo-app
cd todo-app
git init
git config user.name "Tvoje jméno"
git config user.email "ty@example.com"
```

Výstup `git init`:

```
Initialized empty Git repository in /home/axo/todo-app/.git/
```

Zkontroluj:

```bash
ls -la
# .git/  (skrytá složka existuje)
git status
# On branch main
# No commits yet
# nothing to commit
```

### Krok 2: `.gitignore` + první commit

Vytvoř `.gitignore`:

```
bin/
obj/
*.log
node_modules/
.vscode/
.env
```

Vytvoř `index.html`:

```html
<!DOCTYPE html>
<html lang="cs">
<head>
    <meta charset="UTF-8">
    <title>Todo App</title>
</head>
<body>
    <h1>Můj seznam úkolů</h1>
    <p>Zatím prázdné.</p>
    <script src="app.js"></script>
</body>
</html>
```

Vytvoř `app.js`:

```jsx
// Todo App: hlavní soubor
console.log("App spuštěna");
```

První commit:

```bash
git add .
git status
```

Výstup:

```
On branch main
No commits yet
Changes to be committed:
  (use "git rm --cached <file>..." to unstage)
        new file:   .gitignore
        new file:   app.js
        new file:   index.html
```

```bash
git commit -m "Initial scaffold"
git log --oneline
```

Výstup `git log`:

```
a3c5f9e (HEAD -> main) Initial scaffold
```

### Krok 3: Vytvoření feature větve

```bash
git switch -c feature/add-form
git branch
```

Výstup:

```
* feature/add-form
  main
```

Uprav `index.html` (přidej formulář mezi `<h1>` a `<script>`):

```html
<!DOCTYPE html>
<html lang="cs">
<head>
    <meta charset="UTF-8">
    <title>Todo App</title>
</head>
<body>
    <h1>Můj seznam úkolů</h1>
    <form id="todo-form">
        <input type="text" id="todo-input" placeholder="Nový úkol">
        <button type="submit">Přidat</button>
    </form>
    <ul id="todo-list"></ul>
    <script src="app.js"></script>
</body>
</html>
```

Uprav `app.js`:

```jsx
// Todo App: s formulářem
console.log("App s formulářem spuštěna");

document.getElementById("todo-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const text = document.getElementById("todo-input").value;
    const li = document.createElement("li");
    li.textContent = text;
    document.getElementById("todo-list").appendChild(li);
});
```

Commit na feature větvi:

```bash
git add .
git commit -m "Add task form and submit handler"
git log --oneline
```

Výstup:

```
b7d2a1f (HEAD -> feature/add-form) Add task form and submit handler
a3c5f9e (main) Initial scaffold
```

### Krok 4: Záměrný konflikt na main

Přepni zpět na main:

```bash
git switch main
```

Tady ZÁMĚRNĚ změň **stejné místo** v `app.js` (řádek s `console.log`):

```jsx
// Todo App: hlavní soubor
console.log("App startuje verze 1.0");
```

Commit:

```bash
git add app.js
git commit -m "Update startup message"
git log --oneline --all --graph
```

Výstup:

```
* c1d9e84 (HEAD -> main) Update startup message
| * b7d2a1f (feature/add-form) Add task form and submit handler
|/
* a3c5f9e Initial scaffold
```

Pěkně vidíš rozvětvení.

### Krok 5: Merge ► KONFLIKT

```bash
git merge feature/add-form
```

Git vypíše:

```
Auto-merging app.js
CONFLICT (content): Merge conflict in app.js
Automatic merge failed; fix conflicts and then commit the result.
```

`git status`:

```
On branch main
You have unmerged paths.
  (fix conflicts and run "git commit")
  (use "git merge --abort" to abort the merge)

Unmerged paths:
  (use "git add <file>..." to mark resolution)
        both modified:   app.js
```

Otevři `app.js`, uvidíš:

```jsx
<<<<<<< HEAD
// Todo App: hlavní soubor
console.log("App startuje verze 1.0");
=======
// Todo App: s formulářem
console.log("App s formulářem spuštěna");
>>>>>>> feature/add-form

document.getElementById("todo-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const text = document.getElementById("todo-input").value;
    const li = document.createElement("li");
    li.textContent = text;
    document.getElementById("todo-list").appendChild(li);
});
```

### Krok 6: Vyřešení konfliktu

Smaž markery (`<<<<<<<`, `=======`, `>>>>>>>`), ponechej kombinaci, která dává smysl (chceš oboje: verzi 1.0 i info o formuláři):

```jsx
// Todo App: s formulářem v1.0
console.log("App startuje verze 1.0");

document.getElementById("todo-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const text = document.getElementById("todo-input").value;
    const li = document.createElement("li");
    li.textContent = text;
    document.getElementById("todo-list").appendChild(li);
});
```

Dokonči merge:

```bash
git add app.js
git status
# All conflicts fixed but you are still merging.
git commit -m "Merge feature/add-form, resolve conflict in app.js"
git log --oneline --all --graph
```

Výstup:

```
*   d4f8b2c (HEAD -> main) Merge feature/add-form, resolve conflict in app.js
|\
| * b7d2a1f (feature/add-form) Add task form and submit handler
* | c1d9e84 Update startup message
|/
* a3c5f9e Initial scaffold
```

### Krok 7: Push na GitHub (volitelně)

Na GitHubu vytvoř prázdné repo `todo-app` (bez README, .gitignore, license: jinak konflikt při prvním pushi).

```bash
git remote add origin https://github.com/tvuj-uzivatel/todo-app.git
git push -u origin main
```

Výstup:

```
Enumerating objects: 12, done.
Counting objects: 100% (12/12), done.
...
To https://github.com/tvuj-uzivatel/todo-app.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

Push i feature větev:

```bash
git push origin feature/add-form
# nebo všechny větve najednou:
git push --all
```

Tag pro release:

```bash
git tag -a v0.1.0 -m "First version with form"
git push origin v0.1.0
```

---

## B.3 Bonusy

### Bonus A: Rebase místo merge

Na začátku kroku 5 místo `git merge` zkus:

```bash
git switch feature/add-form
git rebase main
```

Co se stane: Git vezme commit `b7d2a1f` (Add task form), “přesune” ho NAD `c1d9e84` (Update startup message) na main. Vznikne **lineární** historie. Pokud nastane konflikt, řešíš ho podobně, ale dokončuješ `git rebase --continue` místo `git commit`.

Výsledek:

```
* xyz789a (HEAD -> feature/add-form) Add task form and submit handler
* c1d9e84 (main) Update startup message
* a3c5f9e Initial scaffold
```

### Bonus B: Vrátit poslední commit

Po dokončení workflow zkus:

- **`git reset --soft HEAD~1`** ► smaže commit, ale změny zůstanou ve stagingu (můžeš dělat nový commit)
- **`git revert HEAD`** ► vytvoří NOVÝ commit, který vrací změny (původní commit zůstává v historii, bezpečné u pushnuté práce)

```bash
git revert HEAD
# Git otevře editor pro zprávu nového commitu
# Po dokončení vznikne nový commit "Revert ..." s opačnými změnami
```

### Bonus C: Stash

```bash
# Začneš na main upravovat něco, ale ještě nechceš commitovat
echo "rozpracovaná změna" >> README.md

# Šéf zavolá: rychle musíš na feature
git stash push -m "rozpracované README"
git status   # vše čisté
git switch feature/add-form
# práce...

# Vrátíš se a obnovíš
git switch main
git stash list
# stash@{0}: On main: rozpracované README
git stash pop
# README se vrátí, rozpracované
```

### Bonus D: `.gitignore` pro již sledovaný soubor

```bash
# Vytvoříš secret.env a commitneš
echo "API_KEY=tajne" > secret.env
git add secret.env
git commit -m "ups"

# Pak přidáš do .gitignore
echo "secret.env" >> .gitignore
git add .gitignore
git commit -m "Ignore secret.env"

# Git ale soubor STÁLE sleduje! Musíš:
git rm --cached secret.env
git commit -m "Untrack secret.env"
# Teď je secret.env ignorovaný, ale BACHA: v historii pořád je!
```

> **Důležité:** Pokud jsi commitnul heslo, **musíš ho rotovat**. Sám z historie ho jen tak nesmažeš (vyžaduje `git filter-branch` nebo `BFG Repo Cleaner`, a stejně ostatní mají kopie).
> 

### Bonus E: Pull Request flow

Místo přímého merge na lokále:

1. Pushni feature větev na GitHub
2. Otevři Pull Request (z `feature/add-form` do `main`)
3. Vyplň popis: co PR dělá, proč
4. Pokud máš kolegy, requestneš review. Pokud jsi sám, schválíš si ho
5. GitHub nabídne 3 typy merge:
    - **Create a merge commit** (klasický merge commit)
    - **Squash and merge** (všechny commity z PR ► jeden commit na main)
    - **Rebase and merge** (rebase, lineární historie)
6. Merge a smazání větve přes UI
7. Lokálně:
    
    ```bash
    git switch main
    git pull
    git branch -d feature/add-form
    ```
    

---

# Část C: Tipy pro ústní zkoušku

## C.1 Vzorová odpověď: úvod (3 min)

> Verzovací systém je nástroj, který zaznamenává změny v souborech v průběhu času. Místo, abys měl sérii ZIP archivů, máš jeden soubor s celou historií. Nejpoužívanější dnes je Git, který stvořil Linus Torvalds v roce 2005 pro vývoj Linux kernelu.
> 
> 
> Git je **distribuovaný** systém: každý vývojář má lokálně kompletní kopii historie. Tím se liší od starších centralizovaných systémů jako SVN, kde existuje jeden centrální server a klient má jen aktuální verzi. Distribuovanost přináší výhody: práce offline, rychlost, žádný single point of failure.
> 
> Git ukládá data jako **snapshoty**, ne diffy. Každý commit je celý stav projektu v daném okamžiku, identifikovaný SHA-1 hashem.
> 
> GitHub je oddělená věc: je to **webová služba pro hosting Git repozitářů**. Git je nástroj, GitHub je platforma. Alternativy jsou GitLab, Bitbucket, Codeberg.
> 

## C.2 Co určitě zmínit (checklist)

- ✓ Linus Torvalds, 2005, kernel
- ✓ Distribuovaný vs centralizovaný (SVN)
- ✓ Snapshoty místo diffů
- ✓ SHA-1 hash jako identita commitu
- ✓ Tři stavy: working dir, staging, repo
- ✓ HEAD jako ukazatel
- ✓ Větve = ukazatel na commit, levné
- ✓ Fast-forward vs merge commit
- ✓ Konflikty: kdy vznikají, jak se řeší
- ✓ Git vs GitHub: rozdíl
- ✓ Pull request flow
- ✓ `.gitignore` a co do něj nepatří (hesla!)

## C.3 Klíčové pojmy (musíš umět)

| Pojem | Definice (1 věta) |
| --- | --- |
| **Repository** | Složka s `.git/` obsahující celou historii |
| **Commit** | Snapshot souborů + metadata (autor, datum, zpráva, parent) |
| **Branch** | Pohyblivý ukazatel na commit |
| **HEAD** | Speciální ukazatel: kde právě jsi |
| **Working Directory** | Soubory na disku, jak je vidíš |
| **Staging Area** | Připravená zóna před commitem |
| **Remote** | Vzdálený repozitář (GitHub apod.) |
| **Origin** | Default jméno hlavního remote |
| **Pull Request** | Žádost o merge přes web UI (GitHub) |
| **Fork** | Kopie repa na můj účet |
| **Merge** | Sloučení dvou větví |
| **Rebase** | Přemístění commitů na nový base |
| **Conflict** | Když Git neví, kterou změnu vzít |
| **Tag** | Pojmenovaná značka commitu (verze) |
| **Stash** | Dočasné odložení změn |
| **Hash** | SHA-1, unikátní ID commitu |
| **Snapshot** | Stav projektu v daném commitu |
| **Diff** | Rozdíl mezi dvěma verzemi |
| **`.gitignore`** | Soubor s vzory, co Git nesleduje |
| **Reflog** | Historie pohybů HEAD (záchrana smazaných commitů) |

## C.4 Časté chytáky (přípravené odpovědi)

### „Jaký je rozdíl mezi `git pull` a `git fetch`?”

`fetch` jen **stáhne** nové commity z remotu do lokálního `origin/main`, ale neudělá s tvou prací nic. `pull` udělá fetch a **rovnou sloučí** do tvé aktuální větve. `pull` = `fetch + merge`. Pokud chceš opatrně vidět, co je nového, použij `fetch` a pak se rozhodni.

### „Jaký je rozdíl mezi `merge` a `rebase`?”

`merge` vytvoří nový **merge commit** se dvěma rodiči, zachová historii větvení. `rebase` “přepíše” commity feature větve nad current state main: výsledkem je **lineární historie**, ale commity dostanou nové hashe. Rebase nikdy nedělej na pushnutých commitech.

### „Proč je `git reset --hard` nebezpečný?”

Smaže commit i změny ve working dir. Pokud commit byl jen lokální, je to OK (a navíc reflog ti ho 90 dní drží). Pokud byl pushnutý, přepisuješ historii kolegům: jejich `git pull` přestane fungovat, mají rozhozený lokál. Místo toho `git revert`, který vytvoří nový “anti-commit”.

### „Jak vrátíš commit, který je už pushnutý?”

`git revert <hash>` ► vytvoří nový commit s opačnými změnami. Původní commit zůstává v historii (transparentnost), ale efekt je negován. Pak `git push` jako obvykle.

### „Co je Pull Request?”

Mechanismus na GitHubu / GitLabu. **Žádost o sloučení** feature větve do main, přes webové UI. Umožňuje **code review** (kolega okomentuje, schválí), automatické testy (CI), diskuzi nad změnami. Po schválení se mergne kliknutím. Klíčový workflow ve většině týmů.

### „Co znamená ‘distribuovaný’ VCS?”

Každý klient má lokálně **kompletní** historii repozitáře. Můžeš commitovat offline, větvit, prohlížet historii bez serveru. Synchronizace s ostatními je separátní operace (`push`/`pull`). Opak je centralizovaný (SVN): klient má jen aktuální verzi, commit jde rovnou na server, bez internetu nemůžeš.

### „Co je `.gitignore` a co do něj patří?”

Soubor v root repa, kde říkáš Gitu, co **nemá sledovat**. Patří tam: build outputy (`bin/`, `node_modules/`), IDE konfigurace (`.vscode/`, `.idea/`), dočasné soubory (`*.log`), a **citlivé věci** (`.env`, hesla, klíče). Sám se `.gitignore` commituje (sdílí mezi vývojáři). Pokud soubor už byl sledován, `gitignore` ho nepřestane sledovat: musíš `git rm --cached`.

### „Co když omylem commituješ heslo do public repa?”

1. **Okamžitě rotuj heslo** (zruš ho a vytvoř nové): protože heslo už je v historii, kdokoliv ho mohl vidět.
2. Smaž ho ze souboru a commitni.
3. Přidej do `.gitignore`.
4. Z historie ho odstranit je složité (`git filter-branch`, `BFG Repo Cleaner`) a stejně ostatní mají kopie. Rotace je důležitější.

### „Jaký je rozdíl mezi `git switch` a `git checkout`?”

`git checkout` historicky dělal **víc věcí** (přepínání větví, checkout souborů, detached HEAD na konkrétní commit). To bylo matoucí. V Git 2.23 (2019) zavedli **`git switch`** (jen větve) a **`git restore`** (jen soubory) jako jasnější rozdělení. `checkout` ale funguje pořád.

### „K čemu slouží `git stash`?”

Dočasné odložení rozpracovaných změn (working dir + staging) na “vedlejší koleji”, aniž bys je commitnul. Hodí se, když potřebuješ rychle přepnout větev (např. urgentní hotfix na main). `git stash` odloží, `git stash pop` vrátí.

### „Co je HEAD?”

Speciální ukazatel: **na kterém commitu právě stojíš**. Obvykle ukazuje na aktuální větev, která ukazuje na poslední commit. Když uděláš commit, HEAD se posune.

### „Co je detached HEAD?”

Když `git checkout <hash>` (přejdeš na konkrétní commit místo větve), HEAD ukazuje **přímo na commit**, ne na větev. Není to chyba, jen warning: nové commity by se ztratily, dokud nevytvoříš větev (`git switch -c moje-vetev`).

### „Jaký je rozdíl mezi fast-forward a 3-way merge?”

**Fast-forward**: main od oddělení feature neudělal žádný commit ► Git jen posune ukazatel main na poslední commit feature. **Žádný nový commit**, lineární historie.

**3-way merge**: obě větve dostaly nové commity ► Git vytvoří nový **merge commit** se dvěma rodiči. Z toho je vidět, že větve existovaly paralelně.

## C.5 Časté chyby v praxi

- Commitnout heslo / API klíč (často: `.env`, `appsettings.json`, AWS credentials)
- Velké binární soubory bez Git LFS (ZIP, MP4, datasety)
- Commit messages typu “asd”, “fix”, “.”, “wip” (nečitelná historie)
- Práce přímo na `main` bez větve
- `git push --force` na sdílenou větev
- Zapomenutý `git pull` před začátkem práce
- Ignorování `git status` před commitem (přidáš omylem soubor co tam nechceš)
- `git add .` v špatné složce (přidání node_modules apod.)
- Konflikty ponechané s markery `<<<<<<<` v kódu (zapomenuté při řešení)
- Strach z větví (všechno na main)

## C.6 Bonusová moudra do diskuze

- **Conventional Commits**: formát zpráv `feat: ...`, `fix: ...`, `chore: ...` pro automatický changelog (`feat: add login form`).
- **Semantic Versioning** (semver): `major.minor.patch`: major = breaking, minor = nová feature, patch = bugfix. Tagy ve formátu `v1.2.3`.
- **Hooks**: skripty v `.git/hooks/`, které se spouštějí při událostech (pre-commit, post-merge). Často přes `husky` (npm balík) pro linting před commitem.
- **Submodules**: vnořené repo uvnitř repa. Funkčně přežité, dnes spíš monorepa nebo package managery.
- **Git LFS** (Large File Storage): pro binární soubory (videa, modely). Místo souboru se commituje jen pointer.
- **Sparse checkout**: stáhneš jen část obrovského repa.
- **Worktree**: víc working directories pro jedno repo (kontext switching bez stashe).

---

## Co určitě nezapomenout v praktice u maturity

1. **Konfigurovat `user.name` a `user.email` na začátku**: jinak commit projde s warning, ale je to neprofesionální.
2. **Po každém kroku `git status` nebo `git log --oneline --all --graph`**: zkoušející chce vidět, že rozumíš, co se děje.
3. **Komentovat nahlas**: “Teď jsem na feature větvi, vytvořím commit s formulářem, pak přepnu na main.”
4. **Konflikt vyřešit s rozmyslem**: nevybírej náhodně, vysvětli proč ponecháváš tu kombinaci.
5. **Po merge zkontrolovat `git log --graph`**: ukáže krásný graf s rozvětvením a M commitem.
6. **Tag a push, pokud je čas**: bonus body za kompletnost.