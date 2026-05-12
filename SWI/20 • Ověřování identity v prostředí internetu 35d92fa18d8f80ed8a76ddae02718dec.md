# 20 • Ověřování identity v prostředí internetu

# Základní pojmy

| Pojem | Otázka | Význam |
| --- | --- | --- |
| **Identifikace** | "Kdo jsi?" | Uživatel říká, kdo je (zadá jméno, e-mail) |
| **Autentizace** *(authentication)* | "Opravdu jsi to ty?" | Ověření identity (heslo, otisk, token) |
| **Autorizace** *(authorization)* | "Co smíš dělat?" | Kontrola oprávnění (role, scope) |

**Pořadí: identifikace → autentizace → autorizace**.

> **Klasický chyták u maturity:** autentizace a autorizace se zaměňují, protože oboje začíná na "auto-". Mnemotechnika: **autentizace = identita, autorizace = pravomoc**.
> 

### Hashování vs šifrování (často matoucí)

|  | Hashování | Šifrování |
| --- | --- | --- |
| **Směr** | Jednosměrné (nelze vrátit) | Obousměrné (lze dešifrovat) |
| **Délka výstupu** | Pevná (např. 256 bitů) | Závisí na vstupu |
| **Použití** | Hesla, integrita souborů | Data v přenosu, citlivá data v DB |
| **Algoritmy** | bcrypt, Argon2, SHA-256 | AES, RSA, ChaCha20 |

Heslo se **hashuje**, jméno uživatele se nehashuje. Číslo kreditky se **šifruje** v DB, ale ne hashuje (musíš ho přečíst pro platbu).

# Faktory autentizace

Autentizace probíhá pomocí jednoho nebo více **faktorů**, typicky rozdělených do kategorií:

| Kategorie | Příklady |
| --- | --- |
| **Něco co víš** *(knowledge)* | Heslo, PIN, bezpečnostní otázka |
| **Něco co máš** *(possession)* | Telefon, hardwarový klíč (YubiKey), čipová karta |
| **Něco co jsi** *(inherence)* | Otisk prstu, Face ID, rozpoznávání hlasu |
| **Něco co děláš** | Vzor podpisu, vzorec klepání na klávesnici |
| **Kde jsi** | Geolokace, IP adresa, důvěryhodná síť |

### 1FA, 2FA, MFA

|  | Popis | Bezpečnost |
| --- | --- | --- |
| **1FA** | Jediný faktor (typicky heslo) | Slabá, závisí na síle hesla |
| **2FA** | Dva **různé** faktory | Výrazně lepší |
| **MFA** | Dva a více faktorů | Nejlepší, často s biometrií |

> **Důležité:** "Dva nezávislé faktory" znamená **z různých kategorií**. Heslo + PIN je pořád 1FA (oboje "něco co víš"). Heslo + SMS kód je 2FA (něco co víš + něco co máš).
> 

### Praktické 2FA/MFA metody

| Metoda | Popis | Bezpečnost |
| --- | --- | --- |
| **SMS kód** | Kód přijde na telefon | Nejslabší (SIM swap útok, SS7) |
| **E-mailový odkaz** | Klik na link v mailu | Slabé (úniky e-mailových účtů) |
| **TOTP** *(Time-based OTP)* | Aplikace (Google Auth, Authy, 1Password) generuje 6 číslic, mění se každých 30 sekund | Dobré, doporučené |
| **Push notifikace** | Klepnutí na "ANO" v appce (Microsoft Authenticator, Duo) | Dobré, ale citlivé na MFA fatigue |
| **Biometrie** | Otisk prstu, Face ID | Skvělé, ale jen pokud lokální (ne posláno na server) |
| **Hardwarový klíč** | YubiKey, Titan Key přes USB/NFC | Nejlepší, odolné i proti phishingu |
| **Passkey** | Kryptografický klíč v zařízení (WebAuthn/FIDO2) | Nejlepší, budoucnost |

### MFA fatigue (útok)

Pokud appka posílá push "ANO/NE" notifikace, útočník může spammovat přihlášení desítkami requestů. Unavený uživatel nakonec klepne "ANO" a útočník je uvnitř. Stalo se Uberu (2022). Řeší se přidáním **number matching** (uživatel musí zadat číslo, které vidí na webu).

# Hesla

### Bezpečné ukládání hesel: hashování + salt

Hesla se **nikdy neukládají v čistém textu**. Místo toho se ukládá jejich **hash**.

```json
Uživatel zadá:  "heslo123"
Systém uloží:   "$2b$10$N9qo8uLOickgx2ZMRZoMye..." (bcrypt hash se saltem)
```

Při přihlášení:

1. Systém vezme zadané heslo + uložený salt
2. Spočítá hash
3. Porovná s uloženým hashem
4. Pokud shoda → přístup povolen

### Co je salt a proč je kritický

**Salt** je náhodný řetězec, který se přidá k heslu **před hashováním**.

Bez saltu:

```json
heslo "password" → hash "5e884898da..."   ← stejný pro všechny
heslo "password" → hash "5e884898da..."   ← stejný hash znamená stejné heslo!
```

Útočník, který získá databázi hashů, může:

- **Rainbow tables**: předem spočítané hash hodnoty pro běžná hesla
- **Identifikovat duplicitní hesla**: stejný hash = stejné heslo, prozradí to vzorce

Se saltem:

```json
heslo "password" + salt "abc123" → hash "f4a92..." 
heslo "password" + salt "xyz789" → hash "e2c8b..."   ← jiný hash!
```

Každý uživatel má **vlastní unikátní salt**, který se ukládá vedle hashe. Rainbow tables se stávají k ničemu (musely by se přepočítat pro každý salt zvlášť).

**Pepper** *(volitelně)*: další secret string, ukládaný **mimo databázi** (v aplikační konfiguraci). Pokud útočník získá DB ale ne config, ani salt mu nepomůže.

### Algoritmy pro hashování hesel

Hashy obecných souborů (SHA-256, MD5) jsou **navrženy aby byly rychlé**. To je pro hesla **špatně**, protože útočník pak může za sekundu zkusit miliardy kombinací.

Algoritmy pro hashování hesel jsou **záměrně pomalé** a často náročné na paměť:

| Algoritmus | Rok | Charakteristika |
| --- | --- | --- |
| **bcrypt** | 1999 | Klasika, dodnes OK, ale neumí náročnost na paměť |
| **scrypt** | 2012 | Náročný na paměť (memory-hard), bránit ASIC útokům |
| **Argon2** | 2015 | Vítěz Password Hashing Competition, dnešní doporučení |
| **PBKDF2** | 2000 | NIST standard, slabší proti GPU útokům |

### Best practices pro hesla

| Doporučení (NIST 2017+) | Proč |
| --- | --- |
| **Délka > komplexita** | "correct horse battery staple" je silnější než "P@ssw0rd!" |
| **Min 8 znaků, lépe 12+** | Délka exponenciálně ztěžuje brute force |
| **Žádné nucené pravidelné změny** | Vede k slabším heslům ("Heslo1!", "Heslo2!"...) |
| **Kontrola proti známým únikům** | API jako "Have I Been Pwned" zachytí kompromitovaná hesla |
| **Žádné security questions** | "Jméno první školy" je dohledatelné |
| **Password manager** | Generuje a pamatuje silná unikátní hesla |

### Útoky na hesla

| Útok | Princip | Obrana |
| --- | --- | --- |
| **Brute force** | Zkoušet všechny kombinace | Pomalý hash, rate limiting, captcha |
| **Dictionary attack** | Zkoušet běžná hesla ze seznamu | Stejné jako brute force |
| **Rainbow tables** | Předem spočítané hashe | Salt |
| **Credential stuffing** | Zkoušet hesla uniklá odjinud | 2FA, kontrola proti HIBP |
| **Phishing** | Falešná přihlašovací stránka | 2FA, hardwarový klíč, Passkey |
| **Keylogger** | Záznam stisků kláves | Antivir, 2FA |
| **Shoulder surfing** | Sledování při zadávání | Soukromí, automatické zhasínání |
| **Man-in-the-middle** | Odposlech komunikace | HTTPS, certifikát pinning |

# Session-based vs token-based autentizace

![image.png](20%20%E2%80%A2%20Ov%C4%9B%C5%99ov%C3%A1n%C3%AD%20identity%20v%20prost%C5%99ed%C3%AD%20internetu/image.png)

### Srovnání

|  | Session-based | Token-based (JWT) |
| --- | --- | --- |
| **Stav na serveru** | Ano (DB nebo paměť) | Ne |
| **Odhlášení** | Trivální (smaž session) | Komplikované (token platí do expirace) |
| **Škálovatelnost** | Horší (sticky sessions, sdílená DB) | Lepší (stateless) |
| **Cross-domain** | Komplikované (cookies + CORS) | Snadné (header) |
| **Mobile apps** | Méně přirozené | Standard |
| **Revokace** | Okamžitá | Potřebuje blacklist nebo krátkou expiraci |

V praxi se často kombinují: short-lived JWT access token + dlouhodobý refresh token uložený v HttpOnly cookie.

# **Token a JWT**

### Co je token

Po úspěšném přihlášení server vydá uživateli **token**: dočasný digitální klíč, který slouží jako důkaz "Jsem přihlášen". Klient ho posílá místo hesla při každém requestu.

Bez tokenu (špatně):
Každý request → posílej heslo → útočník odposlechne → katastrofa

S tokenem (správně):
Login → server vydá token s krátkou expirací
Každý request → Authorization: Bearer <token>
Token vyprší → potřeba refresh nebo nový login

### JWT (JSON Web Token)

Specifický formát tokenu, který je **sám sebou důkazem**: data jsou v něm a podepsaná. Server nemusí dělat DB lookup, stačí ověřit podpis.

```json
xxxxx.yyyyyyy.zzzzz
  │      │      │
Header Payload Signature
```

### Struktura

### Header (algoritmus)

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

Algoritmy: `HS256` (HMAC, sdílený secret), `RS256` (RSA, asymetrické), `ES256` (ECDSA).

### Payload (data o uživateli)

```json
{
  "sub": "user_123",          // subject (ID uživatele)
  "iss": "https://example.com", // issuer (vydavatel)
  "aud": "moje-aplikace",     // audience (pro koho)
  "exp": 1718000000,          // expiration (Unix timestamp)
  "iat": 1717996400,          // issued at
  "role": "admin"             // libovolné vlastní claims
}
```

**Standardní claims:** `sub`, `iss`, `aud`, `exp`, `iat`, `nbf` (not before), `jti` (JWT ID).

### Signature (podpis)

```jsx
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret
)
```

### Klíčové vlastnosti JWT

| Vlastnost | Implikace |
| --- | --- |
| **Podpis nelze padělat** bez znalosti tajného klíče | Můžeš věřit obsahu |
| **Payload je Base64 kódovaný, ne šifrovaný** | Kdokoli ho přečte (jen Base64) |
| **Obsahuje expiraci** (`exp`) | Po vypršení nevalidní |
| **Self-contained** | Server nemusí dělat DB lookup |

### Bezpečnostní pasti JWT

| Past | Co se stane |
| --- | --- |
| **Algorithm "none"** | Pokud server akceptuje `alg: none`, útočník pošle nepodepsaný token a server mu věří |
| **Slabý secret** | Brute force secretu na offline, padělání tokenů |
| **Žádná expirace** | Ztracený token platí navždy |
| **Žádná revokace** | Po krádeži musíš čekat na expiraci nebo invalidovat všechny tokeny změnou secretu |
| **Storage** | LocalStorage je zranitelný na XSS, HttpOnly cookies na CSRF (řeší SameSite) |

### Access token + Refresh token

| Token | Typ | Životnost |
| --- | --- | --- |
| **Access token** | JWT, posílaný s requesty | Krátká (15 minut) |
| **Refresh token** | Random string, jen pro obnovu | Dlouhá (dny/týdny) |

Access token vyprší → klient pošle refresh token → server vydá nový access token

# OAuth 2.0 a OAuth 2.1

### Co OAuth řeší

**OAuth 2.0** je standardizovaný protokol pro **delegovaný přístup**. Aplikace získá omezený přístup k datům uživatele v jiné službě, aniž by se dozvěděla jeho heslo.

**Příklad:** Aplikace pro úpravu fotek chce přístup k Google Photos. OAuth umožní přístup **jen k fotkám**, ne k celému Google účtu (mailu, kalendáři, atd.).

> **Důležité:** OAuth **NENÍ** autentizační protokol. Je to autorizační protokol pro přístup k API. Pro autentizaci slouží **OpenID Connect** postavený nad OAuth (viz dál).
> 

### Role v OAuth 2.0

| Role | Popis |
| --- | --- |
| **Resource Owner** | Uživatel, který vlastní data a uděluje přístup |
| **Client** | Aplikace, která žádá o přístup |
| **Authorization Server** | Server, který ověřuje uživatele a vydává tokeny |
| **Resource Server** | Server, kde jsou chráněná data uložena |

![image.png](20%20%E2%80%A2%20Ov%C4%9B%C5%99ov%C3%A1n%C3%AD%20identity%20v%20prost%C5%99ed%C3%AD%20internetu/image%201.png)

### Důležité pojmy

| Pojem | Popis |
| --- | --- |
| **Access Token** | Krátkodobý token pro přístup k datům (obvykle JWT) |
| **Refresh Token** | Dlouhodobý token pro obnovení Access Tokenu |
| **Scope** | Rozsah přístupu (`read:photos`, `write:posts`) |
| **State** | Anti-CSRF parametr, klient si ho ověří v callbacku |
| **PKCE** | Proof Key for Code Exchange, ochrana pro public clients |

## OpenID Connect (OIDC)

**OpenID Connect** je **identitní vrstva nad OAuth 2.0**. Řeší autentizaci, zatímco OAuth řeší autorizaci.

|  | OAuth 2.0 | OpenID Connect |
| --- | --- | --- |
| **Řeší** | Autorizaci (co smíš) | Autentizaci (kdo jsi) |
| **Token** | Access Token (typicky opaque) | + ID Token (JWT s identitou) |
| **Výsledek** | Přístup k API | Potvrzená identita uživatele |

OIDC přidává **ID Token**: JWT obsahující informace o uživateli:

```json
{
  "sub": "user_123",
  "iss": "https://accounts.google.com",
  "aud": "moje-aplikace.cz",
  "exp": 1718000000,
  "iat": 1717996400,
  "name": "axo",
  "email": "axo@ax4.cz",
  "email_verified": true,
  "picture": "https://lh3.googleusercontent.com/..."
}
```

### Standardní scopes v OIDC

| Scope | Co poskytuje |
| --- | --- |
| `openid` | Povinný, aktivuje OIDC |
| `profile` | Jméno, příjmení, fotka, locale |
| `email` | E-mail + `email_verified` |
| `address` | Adresa |
| `phone` | Telefon |

# Sociální přihlašování (Third-party autentizace)

"Přihlásit se přes Google / Facebook / Apple / GitHub" je **OAuth 2.0 + OpenID Connect**.

| Plusy | Mínusy |
| --- | --- |
| Pohodlné pro uživatele | Závislost na třetí straně |
| Žádná nová hesla | Sdílení dat s velkými platformami |
| Méně přihlašovacích údajů ke správě | Pokud Google zruší účet, nemůžeš se přihlásit |
| Vyšší míra ověřených e-mailů | Single point of failure |

### Sign in with Apple

Apple vyžaduje, aby aplikace s Google/Facebook loginem nabízely i Apple Sign In (na iOS). Apple navíc nabízí **Hide My Email**: vygeneruje proxy adresu, takže aplikace nezná tvůj reálný e-mail.

# Bezheslové přihlašování a Passkeys

### Magic link

Místo hesla aplikace pošle **odkaz na e-mail**. Kliknutí na odkaz přihlásí. Vhodné pro málo časté přihlášení, ale závisí na bezpečnosti e-mailu.

### One-time codes

Aplikace pošle 6místný kód na telefon nebo e-mail. Slabší než magic link kvůli kratšímu kódu.

### Passkeys (FIDO2 / WebAuthn)

Moderní standard, který **nahrazuje hesla kryptografií**. Soukromý klíč nikdy neopustí zařízení.

### **Jak to funguje**

![image.png](20%20%E2%80%A2%20Ov%C4%9B%C5%99ov%C3%A1n%C3%AD%20identity%20v%20prost%C5%99ed%C3%AD%20internetu/image%202.png)

### Proč jsou Passkeys lepší než hesla

| Hesla | Passkeys |
| --- | --- |
| Sdílíš stejné mnohokrát | Každý web vlastní pár klíčů |
| Phishing riziko (zadáš na falešný web) | Nemožný phishing (klíč je vázaný na doménu) |
| Únik DB = problém | Únik DB = veřejné klíče nikomu nepomohou |
| Pamatuješ si je | Spravované zařízením/password managerem |
| Slabé/silné | Vždy maximálně silné (256+ bitů entropy) |

### Terminologie

| Pojem | Co znamená |
| --- | --- |
| **FIDO2** | Standardová sada (alliance FIDO) |
| **WebAuthn** | Web API pro FIDO2 v prohlížečích (W3C) |
| **CTAP** | Protokol mezi prohlížečem a hardwarovým klíčem |
| **Passkey** | Marketingový termín pro WebAuthn credentials, často synchronizované přes cloud |

### Sync vs hardware-only

- **Synced passkeys**: iCloud Keychain, Google Password Manager, 1Password. Sdílí se mezi tvými zařízeními.
- **Device-bound**: hardwarový klíč jako YubiKey. Nesynchronizuje, klíč se nikdy nedostane ven.

### Co kdo podporuje (květen 2026)

- **Apple**: iCloud Keychain napříč iOS/macOS, podpora od 2022
- **Google**: napříč Android/Chrome, podpora od 2023
- **Microsoft**: Windows Hello + Microsoft Account, podpora od 2023
- **Velké servery**: Google, Microsoft, Apple, GitHub, X, Amazon, eBay, PayPal a desítky dalších

# SSO (Single Sign-On)

**SSO** umožňuje uživateli **přihlásit se jednou** a pak přistupovat k mnoha různým aplikacím bez opakovaného přihlašování. Typické v firmách: jednou se přihlásíš do Microsoft Entra ID (dřív Azure AD) a máš přístup do Teams, SharePointu, Outlooku, GitHubu Enterprise atd.

### SSO protokoly

| Protokol | Použití |
| --- | --- |
| **OpenID Connect** | Moderní, OAuth-based, hlavně B2C |
| **SAML 2.0** | Starší, XML-based, enterprise SSO |
| **Kerberos** | Klasický enterprise (AD), interní sítě |

### IdP a SP

- **Identity Provider (IdP)**: ověřuje uživatele (Google, Microsoft, Okta, Auth0)
- **Service Provider (SP)**: aplikace, kterou chceš použít (Slack, Notion)

Když se chceš přihlásit do Slacku přes firemní Microsoft, Slack přesměruje na Microsoft, ten ověří a vrátí token. Slack tě přihlásí.

# Tipy pro ústní zkoušku

### Jak začít

> *"Ověřování identity online stojí na tří fázích: identifikace (kdo jsi), autentizace (opravdu jsi to ty) a autorizace (co smíš). Klasický model je heslo plus session, modernější přístup používá tokeny jako JWT a delegované protokoly OAuth 2.0 a OpenID Connect. Nejmodernější přístup jsou Passkeys, které úplně nahrazují hesla kryptografií."*
> 

### Co komise typicky chce slyšet

- **Identifikace vs autentizace vs autorizace** s konkrétním příkladem.
- **2FA a kategorie faktorů** (co víš/máš/jsi).
- **Hashování hesel** (NIKDY plain text, bcrypt/Argon2, **se saltem**).
- **JWT struktura** (header.payload.signature) a že je podepsaný, ne šifrovaný.
- **OAuth vs OpenID Connect** rozdíl (autorizace vs autentizace).
- **Sociální login** jako kombinace OAuth + OIDC.

### Doplňky, které komisi potěší

- **Salt** a proč brání rainbow tables.
- **PKCE** jako moderní rozšíření OAuth pro SPA a mobilní aplikace.
- **OAuth 2.1** (revize z 2024-2025) deprecates Implicit a Password flow.
- **Passkeys jako WebAuthn/FIDO2**, anti-phishing vlastnost.
- **JWT není šifrovaný**, jen podepsaný (klasický chyták).
- **MFA fatigue** jako moderní útok.
- **Hashing vs encryption** rozdíl.

### Časté chytáky

| Otázka | Odpověď |
| --- | --- |
| *Rozdíl autentizace a autorizace?* | Autentizace ověří identitu (kdo jsi), autorizace povolí akci (co smíš). |
| *Je JWT šifrovaný?* | Ne, je **podepsaný**. Payload je Base64 kódovaný a kdokoli ho přečte. Pro šifrování existuje JWE. |
| *Co je salt?* | Náhodný řetězec přidaný k heslu před hashováním. Brání rainbow table útokům. |
| *Proč ne SHA-256 pro hesla?* | SHA-256 je rychlý, navržený pro integrity check. Hesla potřebují **pomalý** hash (bcrypt, Argon2) proti brute force. |
| *Rozdíl OAuth 2 a OpenID Connect?* | OAuth řeší **autorizaci** (co smíš v API). OIDC přidává **autentizaci** (kdo jsi). |
| *Co je 2FA?* | Autentizace dvěma **různými** faktory. Heslo + SMS je 2FA, heslo + PIN není (oboje "co víš"). |
| *Co je phishing-resistant?* | Metody, které nelze obejít falešnou stránkou. Passkeys ano, SMS kód ne, hardwarový klíč ano. |
| *Co je Refresh Token?* | Dlouhodobý token pro získání nového Access Tokenu bez opakovaného přihlášení. |