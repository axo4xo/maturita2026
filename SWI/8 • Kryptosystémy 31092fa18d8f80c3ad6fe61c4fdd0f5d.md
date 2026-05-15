# 8 • Kryptosystémy

> Kryptosystémy, kryptografie, digitální otisk, digitální podpis, TLS/SSL
> 

## Základní pojmy

| Pojem | Definice |
| --- | --- |
| **Kryptografie** | Věda o zabezpečení komunikace: důvěrnost, integrita, autenticita, nepopiratelnost |
| **Kryptoanalýza** | Věda o prolamování šifer |
| **Kryptologie** | Kryptografie + kryptoanalýza dohromady |
| **Kryptosystém** | Ucelený soubor algoritmů, klíčů a postupů pro bezpečnou komunikaci |

| Vlastnost | Co znamená | Jak se zajišťuje |
| --- | --- | --- |
| **Důvěrnost** *(confidentiality)* | Data nikdo cizí nepřečte | Šifrování |
| **Integrita** | Data nebyla cestou změněna | Hash, MAC, digitální podpis |
| **Autenticita** | Známe identitu protistrany | Certifikáty, digitální podpis |
| **Nepopiratelnost** *(non-repudiation)* | Odesílatel nemůže popřít odeslání | Digitální podpis |

---

## Krátká historie

| Éra | Příklad | Princip |
| --- | --- | --- |
| **Antika** | Caesarova šifra (50 př. n. l.) | Posun písmen v abecedě |
| **Středověk** | Vigenère (16. st.) | Polyalfabetická substituce |
| **2. světová válka** | Enigma | Mechanický šifrátor s rotory |
| **70. léta** | DES | První moderní symetrická šifra |
| **70. léta** | RSA (1977) | První praktická asymetrická šifra |
| **2000+** | AES (2001) | Současný standard symetrické šifry |
| **Dnes** | ECC, ChaCha20, post-quantum | Eliptické křivky, kvantově odolné algoritmy |

**Enigma** je krásný příklad: Němci ji považovali za neprolomitelnou, ale Britové ji ve Bletchley Park (Alan Turing) prolomili a tím podstatně zkrátili válku.

**Kerckhoffsův princip** (1883): bezpečnost kryptosystému by měla záviset **jen na utajení klíče**, ne na utajení algoritmu. Moderní kryptografie tomu věří.

---

## Symetrická kryptografie

Obě strany sdílí **jeden tajný klíč** pro šifrování i dešifrování.

```
Odesílatel              Příjemce
   │                       │
   │  klíč K               │ klíč K (stejný)
   │  ▼                    │  ▼
   │ ┌──────┐    šifr     ┌──────┐
   │ │šifr. │ ──────────▶ │dešif.│
   │ └──────┘             └──────┘
   │                       │
   │ "Hello" → "X#9$@"    "X#9$@" → "Hello"
```

| Plusy | Mínusy |
| --- | --- |
| Rychlá (i 10 GB/s s HW akcelerací) | Jak bezpečně předat klíč? |
| Krátké klíče (128-256 bitů stačí) | N stran = N(N-1)/2 klíčů |
| Vhodná pro velké objemy dat | Žádná autentizace odesílatele |

### Klíčové symetrické algoritmy

| Algoritmus | Rok | Délka klíče | Stav |
| --- | --- | --- | --- |
| **DES** | 1977 | 56 bitů | **Prolomeno**, nepoužívat |
| **3DES** | 1995 | 168 bitů (3× DES) | Deprecated v 2023 |
| **AES** | 2001 | 128/192/256 bitů | **Standard**, používá se všude |
| **ChaCha20** | 2008 | 256 bitů | Moderní alternativa AES, rychlejší v SW |

**AES** (Advanced Encryption Standard, původně Rijndael) je dnešní zlatý standard. Vyhrál soutěž NIST v roce 2000, kde se hledal nástupce DES. Používá se v HTTPS, WPA2/3 (WiFi), disková šifrování (BitLocker, FileVault, LUKS).

### Módy blokových šifer

Blokové šifry (jako AES) šifrují **fixní bloky** (typicky 128 bitů). Pro delší zprávu se používá **mód operace**.

| Mód | Princip | Bezpečnost |
| --- | --- | --- |
| **ECB** *(Electronic Codebook)* | Každý blok zvlášť, nezávisle | **Špatný** (vzory v datech viditelné) |
| **CBC** *(Cipher Block Chaining)* | Každý blok XORován s předchozím | OK, ale bez authentication |
| **CTR** *(Counter)* | Šifruje čítač, výsledek XOR s daty | Dobrý, paralelizovatelný |
| **GCM** *(Galois/Counter Mode)* | CTR + autentizace integrity | **Moderní standard** (AES-GCM) |

**Slavný ECB obrázek**: pokud zašifruješ obrázek tučňáka pomocí AES-ECB, na výsledku **stále uvidíš tučňáka** (jen zdeformovaného). Stejné bloky se zašifrují stejně, vzory zůstanou. To je důvod, proč se ECB nepoužívá.

![{3E52BA6E-AFD8-4AEA-A3B4-D207F1640E86}.png](8%20%E2%80%A2%20Kryptosyst%C3%A9my/3E52BA6E-AFD8-4AEA-A3B4-D207F1640E86.png)

---

## Asymetrická kryptografie

Každý má **dvojici klíčů**: veřejný (sdílí volně) a soukromý (drží v tajnosti).

```
Odesílatel                          Příjemce
                                    privátní klíč S
                                    veřejný klíč V
   │                                   │
   │   zná V od příjemce                │
   │   ▼                                │  ▼
   │ ┌──────┐         šifr            ┌──────┐
   │ │ šifr.│ ──────────────────────▶ │dešif.│
   │ │ (V)  │                          │ (S)  │
   │ └──────┘                          └──────┘
```

### Princip: matematicky obtížné úlohy

Asymetrická kryptografie staví na problémech, které jsou:

- **Snadné v jednom směru** (rychle spočítáš)
- **Nepředstavitelně těžké v opačném směru** (žádný známý efektivní algoritmus)

Příklady:

- **RSA**: násobení dvou prvočísel je snadné, faktorizace zpět je extrémně těžká
- **ECC**: násobení bodů na eliptické křivce je snadné, "logaritmus" zpět je těžký
- **Diffie-Hellman**: modulární umocňování je snadné, diskrétní logaritmus zpět je těžký

### Klíčové asymetrické algoritmy

| Algoritmus | Princip | Typická délka klíče |
| --- | --- | --- |
| **RSA** | Faktorizace velkých čísel | 2048-4096 bitů |
| **ECC** *(Elliptic Curve)* | Eliptické křivky | 256-384 bitů (ekvivalent RSA 3072+) |
| **DH** *(Diffie-Hellman)* | Diskrétní logaritmus | 2048+ bitů |
| **ECDSA** | Eliptické křivky + podpis | 256+ bitů |
| **Ed25519** | EdDSA na Curve25519 | 256 bitů |

**ECC vyhrává**: stejná bezpečnost při kratších klíčích. 256-bit ECC ≈ 3072-bit RSA. Důsledek: rychlejší, menší certifikáty, lépe pro mobil/IoT.

| Plusy | Mínusy |
| --- | --- |
| Bezpečná výměna klíčů přes nezabezpečený kanál | Pomalá (100x až 1000x oproti symetrické) |
| Digitální podpisy | Krátká data (RSA šifruje jen velikost klíče) |
| Identita ověřená přes certifikáty | Velké klíče (RSA 2048+ bitů) |

### Diffie-Hellman: kouzlo výměny klíčů

**Cíl**: Alice a Bob chtějí mít stejný tajný klíč, ale komunikují jen přes nezabezpečený kanál (kdokoli odposlouchá).

**Princip míchání barev** (analogie):

![{4BCC501A-9E26-468B-BFED-5E9A7E395FD6}.png](8%20%E2%80%A2%20Kryptosyst%C3%A9my/4BCC501A-9E26-468B-BFED-5E9A7E395FD6.png)

```
1. Alice a Bob veřejně domluví "základní barvu": žlutá
   (Eva odposlouchá, ale to nevadí)

2. Alice si vybere TAJNOU barvu: červená (nikomu neřekne)
   Smíchá: žlutá + červená = oranžová
   Pošle ORANŽOVOU Bobovi (veřejně)

3. Bob si vybere TAJNOU barvu: modrá (nikomu neřekne)
   Smíchá: žlutá + modrá = zelená
   Pošle ZELENOU Alici (veřejně)

4. Alice smíchá: oranžová (Bobova zelená) + červená (tajná) = hnědá
   Bob smíchá: zelená (Alicina oranžová) + modrá (tajná) = hnědá

   OBA MAJÍ HNĚDOU! Eva ne, protože by potřebovala červenou nebo modrou.
```

Matematicky se používá **modulární umocňování** místo míchání barev. Pro Evu je extrémně těžké zpětně spočítat soukromá čísla.

**ECDH** (Elliptic Curve Diffie-Hellman) je moderní varianta na eliptických křivkách. Používá se v TLS 1.3 pro výměnu klíčů.

### Forward Secrecy

**Perfect Forward Secrecy (PFS)** znamená: i kdyby útočník v budoucnu získal **soukromý klíč serveru**, **nemůže dešifrovat staré odposlechnuté komunikace**.

Jak se dosáhne: pro každé spojení se vygeneruje **efemérní (jednorázový) klíč** přes Diffie-Hellman. Po skončení spojení se zahodí. Soukromý klíč serveru slouží jen k autentizaci, ne k šifrování dat.

TLS 1.3 vyžaduje PFS povinně. TLS 1.2 ho má volitelně (`ECDHE` cipher suites).

---

## Hybridní šifrování

Symetrické šifrování je rychlé, ale problém je výměna klíče. Asymetrické řeší výměnu, ale je pomalé. **Hybrid**: použij obojí.

```
1. Vygeneruj náhodný symetrický klíč K (např. AES-256)
2. Zašifruj klíč K asymetricky veřejným klíčem příjemce
3. Pošli: zašifrovaný K + symetricky zašifrovaná data
4. Příjemce dešifruje K svým privátním klíčem
5. Použije K na dešifrování dat
```

Tohle je princip **TLS, SSH, PGP, S/MIME** a dalších. Spojuje rychlost symetrického šifrování s pohodlností asymetrické výměny.

---

## Digitální otisk: Hash

**Hash** je matematický "mlýnek na maso": data jdou dovnitř, pevně dlouhý otisk ven. **Není to šifrování** (nelze vrátit zpět).

```
"heslo123"         →  SHA-256  →  "ef92b778ba3cb..."
"heslo124"         →  SHA-256  →  "5d41402abc4b..."  ← úplně jiný (laviovat)
celá 4GB kniha     →  SHA-256  →  stejně dlouhý 64-znakový řetězec
```

### Vlastnosti kryptografického hashe

| Vlastnost | Význam |
| --- | --- |
| **Jednosměrnost** | Z hashe nelze rekonstruovat původní data |
| **Fixní délka** | Bez ohledu na vstup, výstup vždy stejně dlouhý |
| **Lavinový efekt** | Změna 1 bitu vstupu = úplně jiný hash |
| **Determinismus** | Stejný vstup → stejný hash, vždy |
| **Pre-image resistance** | Pro daný hash H je těžké najít vstup, který ho produkuje |
| **Collision resistance** | Těžké najít dva různé vstupy se stejným hashem |

### Hashovací funkce

| Algoritmus | Velikost výstupu | Stav |
| --- | --- | --- |
| **MD5** | 128 bitů | **Prolomeno** (kolize od 2004), nepoužívat |
| **SHA-1** | 160 bitů | **Prolomeno** (Google demo 2017), nepoužívat |
| **SHA-256** | 256 bitů | **Standard**, bezpečný |
| **SHA-3** | 224-512 bitů | Moderní alternativa, jiný princip |
| **BLAKE3** | Variabilní | Velmi rychlý, moderní |

> **Důležité:** "prolomeno" znamená, že existují **kolize** (dva vstupy se stejným hashem). Pro hashování souborů ke kontrole integrity to může být problém, pro hashování hesel je situace ještě složitější (viz dál).
> 

### Použití hashe

### 1. Kontrola integrity (checksum)

Stáhneš `.iso` z internetu. Autor zveřejnil SHA-256. Ty si spočítáš lokálně a porovnáš:

```bash
$ sha256sum ubuntu-22.04.iso
2ba8e3...   ubuntu-22.04.iso

# Porovnáš s oficiálním
```

Pokud se shoduje, soubor je v pořádku (nikdo nezavedl malware do staženého souboru).

### 2. Ukládání hesel

Databáze **nesmí** ukládat hesla v plaintext. Místo toho ukládá hash + salt.

```
Při registraci:
  heslo "axoaxo69" + náhodný salt "abc123" → hash (uloží se hash + salt)

Při přihlášení:
  zadané heslo + uložený salt → hash → porovnání s uloženým hashem
```

Pro hesla se **nepoužívá SHA-256** (je moc rychlý, dá se brute-forcovat). Místo toho **bcrypt, scrypt, Argon2** (záměrně pomalé). Viz otázka 20 (Ověřování identity).

### 3. Digitální podpis (viz dál)

### 4. Blockchain a Merkle stromy

Bitcoin používá SHA-256 pro proof-of-work. Každý blok obsahuje hash předchozího, tím vzniká neměnný řetěz.

### HMAC: hash s klíčem

**HMAC** (Hash-based Message Authentication Code) kombinuje **hash s tajným klíčem**:

```
HMAC(klíč, zpráva) → krátký kód, který ověří současně:
- Že zpráva nebyla změněna (integrita)
- Že zprávu poslal někdo, kdo zná klíč (autenticita)
```

Použití: JWT podpisy (HS256 = HMAC-SHA256), API podpisy (AWS, Stripe webhooks), TLS.

---

## Digitální podpis

Slouží k ověření **autora** (autenticita), **integrity** (nezměněno) a **nepopiratelnosti** (autor nemůže popřít). Kombinuje **hash + asymetrickou kryptografii**.

### Jak se podpisuje

```
PODPIS:
1. Vytvoříš dokument
2. Spočítáš jeho hash (SHA-256)
3. Hash zašifruješ svým PRIVÁTNÍM klíčem → toto je digitální podpis
4. Pošleš: dokument + podpis

OVĚŘENÍ:
1. Příjemce dešifruje podpis tvým VEŘEJNÝM klíčem → získá hash z podpisu
2. Sám spočítá hash z přijatého dokumentu
3. Porovná oba hashe

   Shodují se?  →  dokument je pravý a nezměněný
   Neshodují se? → buď byl dokument upraven, nebo podpis je falešný
```

### Proč to funguje

- **Privátní klíč má jen autor** → jen on mohl vytvořit ten podpis (nepopiratelnost)
- **Pokud dokument změníme**, jeho hash bude jiný a neshodne se s tím v podpisu (integrita)
- **Veřejný klíč je dostupný komukoli** → kdokoli může ověřit

### Použití digitálních podpisů

| Použití | Detail |
| --- | --- |
| **HTTPS / TLS certifikáty** | Server prokazuje identitu podepsaným certifikátem |
| **JWT tokeny** | Server podepisuje (RS256, ES256) |
| **Software podpisy** | Microsoft, Apple podepisují své spustitelné soubory |
| **Bitcoin / blockchain transakce** | Každá transakce je podepsaná soukromým klíčem majitele |
| **PDF / e-podpisy** | Adobe Sign, DocuSign, kvalifikované elektronické podpisy v EU |
| **Git commits** | GPG/SSH podpisy commitů (`git commit -S`) |
| **Email** | S/MIME, PGP |

---

## Digitální certifikát a PKI

**Digitální certifikát** je **elektronicky podepsaný veřejný klíč** s metadata o vlastníkovi. Vydává ho **Certifikační autorita (CA)**, kterou systém považuje za důvěryhodnou.

### Obsah certifikátu

- **Veřejný klíč** vlastníka
- **Identita** (jméno, email, doména `terpino.cz`)
- **Doba platnosti** (typicky 90 dní u Let's Encrypt, 1 rok u placených)
- **Vydávající CA** a její podpis
- **Použití** (server auth, code signing, email)

### Chain of trust (řetězec důvěry)

> V zápiscích chyběl, přitom je to základ celého PKI.
> 

CA má hierarchii: **Root CA** (nejvyšší, samopodepsaný) → **Intermediate CA** (mezilehlé) → **End-entity certifikát** (tvůj web).

```
Root CA  (důvěryhodný, v OS / prohlížeči preinstalovaný)
   │
   │ podpis
   ▼
Intermediate CA  ("Let's Encrypt R3")
   │
   │ podpis
   ▼
Server certifikát  (terpino.cz)
```

Prohlížeč ověří terpino.cz tak, že projde řetězec až k Root CA, kterou má v seznamu důvěryhodných.

### Hlavní certifikační autority

| CA | Charakteristika |
| --- | --- |
| **Let's Encrypt** | Zdarma, automatická obnova, 90denní platnost, dnes dominantní |
| **DigiCert** | Placená, často s Extended Validation |
| **Sectigo** *(dříve Comodo)* | Placená, různé úrovně |
| **Cloudflare** | Zdarma přes jejich proxy |
| **PostSignum** | Česká kvalifikovaná CA |

### Self-signed certifikáty

Certifikát podepsaný **sám sebou** (neuznaný žádnou CA). Použitelný pro:

- Vývoj na localhostu
- Interní firemní systémy
- IoT zařízení

Prohlížeč zobrazí varování ("Nelze ověřit identitu"), protože nemůže ověřit identitu zvenku.

### Certificate Transparency

Veřejný log všech vydaných certifikátů. Pokud někdo vydá falešný cert pro `google.com`, objeví se v logu a Google si toho všimne. Implementováno od 2018, aktivně používáno.

---

## TLS / SSL: zabezpečení internetu

| Verze | Rok | Stav |
| --- | --- | --- |
| **SSL 1.0** | 1994 | Nikdy nevyšel (bezpečnostní díry) |
| **SSL 2.0** | 1995 | **Deprecated** 2011 |
| **SSL 3.0** | 1996 | **Deprecated** 2015 (POODLE útok) |
| **TLS 1.0** | 1999 | **Deprecated** 2020 |
| **TLS 1.1** | 2006 | **Deprecated** 2020 |
| **TLS 1.2** | 2008 | Stále široce používaný |
| **TLS 1.3** | 2018 | **Moderní standard**, doporučený |

> **Drobnost:** Slovo "SSL" žije už jen v marketingu (např. "SSL certifikát" = vlastně TLS certifikát). Reálně se TLS používá výhradně.
> 

### TLS 1.2 Handshake (klasický)

```
KLIENT (prohlížeč)                    SERVER (banka)
   │                                       │
   │── 1. ClientHello ─────────────────▶  │
   │      (TLS verze, šifry, random)      │
   │                                       │
   │◀──── 2. ServerHello ─────────────── │
   │       (vybraná šifra, random)        │
   │                                       │
   │◀──── 3. Certifikát ──────────────── │
   │       (řetězec důvěry)               │
   │                                       │
   │  [ověří cert proti CA store]          │
   │                                       │
   │── 4. ClientKeyExchange ───────────▶  │
   │      (asymetrický nebo ECDHE)         │
   │                                       │
   │ [oba vypočítají sdílený klíč K]       │
   │                                       │
   │── 5. Finished (zašifrované) ──────▶  │
   │                                       │
   │◀──── 6. Finished (zašifrované) ─── │
   │                                       │
   │═══ 7. Aplikační data (AES-GCM) ═════ │
```

**Klíčové momenty:**

1. **Hello fáze**: domluví se TLS verze a cipher suite (AES-128-GCM, AES-256-GCM, ChaCha20-Poly1305...)
2. **Server pošle certifikát**: klient ho ověří proti důvěryhodným CA
3. **Výměna klíčů**: asymetricky (RSA) nebo přes ECDHE (modernější, forward secrecy)
4. **Symetrický klíč**: oba mají stejný, dál komunikují symetricky (rychle)

Klasický handshake potřebuje **2 round-trips** (RTT) než začne aplikační komunikace.

### TLS 1.3 Handshake (zjednodušený, 1-RTT)

TLS 1.3 výrazně zjednodušil:

- Odstranil starší slabé algoritmy (RSA key exchange, CBC mode)
- **Povinný PFS** přes (EC)DHE
- **1-RTT** handshake (klient pošle key share rovnou v ClientHello)
- **0-RTT resumption**: pokud klient už server zná, může poslat data v prvním paketu

```
KLIENT                                      SERVER
   │                                            │
   │── ClientHello + KeyShare + Cipher ────▶   │
   │                                            │
   │◀── ServerHello + KeyShare ───────────────│
   │    + Certificate (encrypted!)             │
   │    + Finished                             │
   │                                            │
   │── Finished ─────────────────────────────▶ │
   │                                            │
   │═══ Application data ═══════════════════════│
```

### Cipher suite: jak vypadá

```
TLS_AES_256_GCM_SHA384
│   │       │   │      │
│   │       │   │      └── Hash pro KDF (SHA-384)
│   │       │   └────────── Mód operace (GCM)
│   │       └────────────── Délka klíče (256 bitů)
│   └────────────────────── Symetrická šifra (AES)
└────────────────────────── Protokol
```

V TLS 1.3 jsou cipher suites zjednodušené (klíčová výměna a podpis se vyjednávají zvlášť).

---

## Klasické útoky na kryptosystémy

> V původních zápiscích chybělo. Komise se na útoky často ptá.
> 

### Brute force

Zkoušení všech možných klíčů. Pomáhá: dlouhý klíč.

- DES (56-bit klíč) **prolomen brute-forcem** v roce 1997 (96 dní), dnes minuty
- AES (128-bit) by trval miliardy let
- AES (256-bit) je kvantově odolný proti brute-force (s Groverovým algoritmem se efektivně sníží na 128-bit)

### Dictionary attack

Zkoušení slov ze slovníku (typicky pro hesla). Pomáhá: silná hesla.

### Rainbow tables

Předem spočítané hash hodnoty běžných hesel. Pomáhá: **salt**.

### Man-in-the-Middle (MITM)

Útočník se vloží mezi klienta a server. Pomáhá: certifikáty (CA), HSTS.

```
Klient ←→ Útočník ←→ Server
         (proxy)
```

Útočník vidí komunikaci a může ji měnit. TLS to řeší tak, že **klient ověří identitu serveru přes certifikát**, takže "útočník" by potřeboval cert podepsaný důvěryhodnou CA.

### Replay attack

Útočník zachytí legitimní zprávu a později ji znovu pošle. Pomáhá: **nonce** (one-time number), timestamps, sekvenční čísla.

### Padding Oracle

Útok na špatně implementované CBC mode šifrování. Útočník iterativně mění padding a podle odpovědi serveru vyvodí plaintext. Pomáhá: **autentizované šifrování** (AES-GCM).

### Side channel attack

Útočník neměří kryptografii samotnou, ale **vedlejší kanály**: spotřebu energie, čas operací, elektromagnetické záření, zvuk. Pomáhá: konstantní časová implementace.

### Birthday attack

Hledání kolizí v hash funkci. Pro N-bit hash stačí cca 2^(N/2) pokusů (ne 2^N). Důsledek: SHA-256 se pro praktickou kolizní odolnost chová jako 128-bit.

---

## End-to-end encryption (E2EE)

Šifrování, kdy data **vidí jen odesílatel a příjemce**, ani server uprostřed ne. Klíče jsou jen u koncových uživatelů.

| Aplikace | Protokol |
| --- | --- |
| **Signal** | Signal Protocol (Double Ratchet, X3DH) |
| **WhatsApp** | Signal Protocol |
| **iMessage** | Apple proprietary |
| **Threema** | NaCl/Libsodium |
| **ProtonMail** | OpenPGP |

E2EE komplikuje serveru:

- Server nemůže prohledávat zprávy (důsledek: search funguje jen lokálně)
- Server nemůže obsah moderovat
- Pokud zapomeneš klíč, ztratíš všechny zprávy

---

## Post-quantum kryptografie (PQC)

> Bonus pro chytráka. V 2026 je to hot topic.
> 

**Problém:** dostatečně silný **kvantový počítač** by mohl prolomit RSA a ECC ve zlomku sekundy (Shorův algoritmus, 1994). Symetrické šifry (AES) jsou jen oslabené (Groverův algoritmus).

**Současný stav (2026):**

- Kvantové počítače existují, ale nedostatečně silné (max stovky qubitů, potřebujeme miliony)
- **NIST** v 2024 standardizoval první post-quantum algoritmy:
    - **CRYSTALS-Kyber** (key encapsulation, založené na latticích)
    - **CRYSTALS-Dilithium** (digitální podpisy)
    - **SPHINCS+** (alternativní podpisy, založené na hash)
- Probíhá migrace: TLS 1.3 začíná podporovat hybridní (klasická + PQC) výměnu klíčů
- Chrome od 2024 nabízí Kyber768 v TLS

**"Harvest now, decrypt later"** útok: státy a velké hráče sbírají dnes zašifrovaný traffic, čekají na kvantové počítače, pak ho dešifrují. Proto se s PQC pospíchá.

---

## Rychlý tahák

| Pojem | Klíčová fakta |
| --- | --- |
| **Kryptografie** | Důvěrnost, integrita, autenticita, nepopiratelnost |
| **Kryptosystém** | Ucelený soubor algoritmů, klíčů a postupů |
| **Kerckhoffsův princip** | Bezpečnost na utajení klíče, ne algoritmu |
| **Symetrická** | Jeden klíč, rychlá, problém s výměnou |
| **AES** | Standard symetrické šifry (128/192/256-bit) |
| **Módy** | ECB špatný, GCM moderní (authenticated) |
| **Asymetrická** | Veřejný + privátní klíč, pomalá |
| **RSA** | Faktorizace prvočísel, 2048+ bitů |
| **ECC** | Eliptické křivky, kratší klíče (256-bit ≈ RSA 3072) |
| **Diffie-Hellman** | Bezpečná výměna klíče přes nezabezpečený kanál |
| **Forward Secrecy** | Stará komunikace bezpečná i po úniku klíče serveru |
| **Hybridní šifrování** | Asymetricky vyměnit klíč, symetricky šifrovat data |
| **Hash** | Jednosměrný otisk, fixní délka, lavinový efekt |
| **SHA-256** | Standard, bezpečný |
| **MD5, SHA-1** | Prolomeny, kolize, nepoužívat |
| **HMAC** | Hash s klíčem, autenticita zprávy |
| **Salt** | Náhodný řetězec u hesla, brání rainbow tables |
| **Bcrypt/Argon2** | Pomalé hashe pro hesla |
| **Digitální podpis** | Hash zašifrovaný privátním klíčem |
| **Certifikát** | Veřejný klíč podepsaný CA |
| **PKI** | Infrastruktura pro správu klíčů a certifikátů |
| **Chain of trust** | Root CA → Intermediate → End-entity |
| **Let's Encrypt** | Zdarma CA, dnes dominantní |
| **TLS 1.2 / 1.3** | Aktuální protokoly |
| **SSL** | Deprecated, jen marketing |
| **TLS Handshake** | Hello → cert → výměna klíčů → symetricky |
| **Cipher suite** | TLS_AES_256_GCM_SHA384 |
| **MITM** | Útok prostředníka, řeší certifikáty |
| **Replay attack** | Opakování staré zprávy, řeší nonce |
| **E2EE** | End-to-end (Signal, WhatsApp), klíče u uživatelů |
| **PQC** | Post-quantum, NIST standardizoval Kyber/Dilithium |

---

## Tipy pro ústní zkoušku

### Jak začít

> *"Kryptografie není jen o šifrování. Moderní kryptosystém řeší čtyři vlastnosti: důvěrnost přes šifrování, integritu přes hashe, autenticitu přes digitální podpisy a nepopiratelnost přes certifikáty. Existují dvě základní rodiny šifer: symetrická s jedním sdíleným klíčem a asymetrická s párem veřejný/privátní klíč. V praxi se kombinují v hybridním schématu, jako v TLS."*
> 

### Co komise typicky chce slyšet

- **Rozdíl symetrické a asymetrické** s konkrétními příklady (AES vs RSA).
- **Hash funkce**: jednosměrnost, lavinový efekt, fixní délka.
- **Hash použití**: integrita souborů, hesla.
- **Digitální podpis**: postup krok za krokem (hash + zašifrovat privátním klíčem).
- **TLS handshake**: výměna klíče asymetricky, pak symetricky.
- **Certifikát a CA**.

### Doplňky, které komisi potěší

- **Kerckhoffsův princip**: bezpečnost na utajení klíče.
- **Hybridní šifrování** v TLS: kombinace rychlosti a bezpečnosti.
- **Diffie-Hellman** s analogií míchání barev.
- **Forward Secrecy** v TLS 1.3.
- **ECC výhody** oproti RSA (kratší klíče, stejná bezpečnost).
- **AES módy**: ECB špatný, GCM moderní.
- **MD5 a SHA-1 jsou prolomeny**.
- **Chain of trust** v PKI.
- **Post-quantum kryptografie** (NIST Kyber/Dilithium 2024).
- **TLS 1.3 zjednodušení** (1-RTT, PFS povinný).

### Časté chytáky

| Otázka | Odpověď |
| --- | --- |
| *Je hash šifrování?* | Ne, hash je jednosměrný (nelze dešifrovat). Šifrování lze vrátit klíčem. |
| *Proč ECB nepoužívat?* | Šifruje každý blok nezávisle, vzory v datech zůstanou viditelné (slavný "ECB tučňák"). |
| *Co je rozdíl SSL a TLS?* | SSL je starý, deprecated. TLS je moderní nástupce. "SSL" žije jen v marketingu. |
| *Co dělá digitální podpis bezpečným?* | Privátní klíč má jen autor, nikdo jiný stejný podpis nevytvoří. Hash garantuje integritu. |
| *Jak funguje Diffie-Hellman?* | Obě strany si vyrobí tajná čísla, vymění mezi sebou výsledky modulárního umocňování. Z toho si nezávisle spočítají stejný klíč, ale útočník to ze zveřejněných čísel nesvede. |
| *Co je MITM útok?* | Útočník se vloží mezi klienta a server. TLS to řeší ověřením certifikátu. |
| *Proč pro hesla bcrypt a ne SHA-256?* | SHA-256 je rychlý (GPU brute force za hodiny). Bcrypt je záměrně pomalý a pevně memory-bound. |

### Časté chyby, kterým se vyhnout

- Říkat, že **hash je šifrování** (není, je jednosměrný).
- Tvrdit, že **SSL se stále používá** (deprecated od 2015).
- Plést si **integritu a autenticitu** (integrita: nezměněno; autenticita: víme, kdo to poslal).
- Říkat, že **MD5 je bezpečný hash** (prolomen 2004).
- Tvrdit, že **digitální podpis je šifrování dokumentu** (šifruje se jen hash, dokument zůstává čitelný).
- Plést si **certifikát a klíč** (certifikát obsahuje veřejný klíč + identitu + podpis CA).
- Říkat, že **TLS šifruje URL** (TLS chrání data, ale doménu vidí kdokoli skrz SNI nebo DNS).
- Tvrdit, že **asymetrická kryptografie je vždy bezpečnější** (záleží na implementaci a délce klíče).