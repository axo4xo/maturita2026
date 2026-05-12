# 8 • Kryptosystémy

## Kryptosystémy - základní přehled

Kryptosystém je ucelený soubor algoritmů a pravidel, které zajišťují bezpečnou komunikaci.

Neřeší jen samotné šifrování, ale i to, jak se generují a vyměňují klíče, jak se ověřuje identita a jak se kontroluje, že data nikdo cestou neupravil.

Typickým příkladem, kde se zapojuje všechno najednou, je komunikace klient-server (např. ty a tvé internetové bankovnictví).

## Hashovací funkce a Digitální otisk (Fingerprint)

Hashování **není šifrování**, protože nejde vrátit zpět. Je to matematický "mlýnek na maso". Hodíš do něj jakákoliv data (slovo, celou knihu, 4GB film) a on ti vyplivne **digitální otisk (hash)**.

**Základní vlastnosti hashe:**

- **Jednosměrnost:** Z hashe nikdy nedostaneš zpět původní data.
- **Fixní délka:** Ať tam vložíš cokoliv, výsledek (hash) je vždy stejně dlouhý řetězec znaků.
- **Lavinový efekt:** Sebemenší změna na vstupu (změníš jediné písmenko v knize) způsobí, že výsledný hash bude úplně, ale úplně jiný.

**K čemu se hash používá:**

1. **Checksum (Kontrola integrity):** Stáhneš si velký soubor a k němu dostaneš od autora jeho hash. Ty si soubor u sebe proženeš hashovací funkcí a výsledky porovnáš. Sedí? Soubor se stáhl v pořádku a nikdo ho cestou nezaviroval. Nesedí? Soubor je poškozený nebo pozměněný.
2. **Ukládání hesel:** Databáze nesmí ukládat hesla v čistém textu. Uloží se jen jejich hash. Když se přihlašuješ, systém zahashuje to, co jsi napsal, a porovná to s hashem v databázi. 

## Digitální podpis

Digitální podpis slouží k tomu, abys prokázal, že jsi dokument opravdu poslal ty (autenticita) a že ho nikdo cestou nezměnil (integrita). Využívá se k tomu kombinace hashe a **asymetrické kryptografie**.

**Jak to funguje krok za krokem:**

1. Napíšeš dokument (smlouvu).
2. Pomocí hashovací funkce z něj vytvoříš **otisk (hash)**.
3. Tento hash **zašifruješ svým PRIVÁTNÍM klíčem**. A přesně tohle zašifrované smítko dat je tvůj **digitální podpis**!
4. Pošleš dokument i s podpisem.
5. Příjemce vezme tvůj podpis a dešifruje ho tvým **VEŘEJNÝM klíčem** (tím ověří, že je to od tebe, protože nikdo jiný nemá tvůj privátní klíč). Získá tak původní hash.
6. Příjemce si sám zahashuje přijatý dokument.
7. Porovná oba hashe. Pokud jsou stejné, dokument je pravý a nezměněný.

## TLS/SSL - zabezpečení internetu

SSL (Secure Sockets Layer) je starý a dnes už nepoužívaný protokol. Jeho moderní a bezpečný nástupce je **TLS (Transport Layer Security)**. Je to to "S" v `HTTPS`.

Tento protokol je krásnou ukázkou toho, jak se všechny výše zmíněné technologie (asymetrické šifrování, symetrické šifrování, certifikáty a hashe) spojí dohromady.

**Jak probíhá navázání spojení (tzv. TLS Handshake):**

1. **Pozdrav:** Tvůj prohlížeč (klient) se spojí se serverem (bankou) a řeknou si, jaké šifrovací standardy oba umí.
2. **Ověření identity:** Server pošle svůj **digitální certifikát** (obsahující jeho veřejný klíč podepsaný certifikační autoritou). Prohlížeč si ověří, že mluví opravdu s bankou a ne s podvodníkem.
3. **Výměna klíčů (Klíčový moment):** Pomocí asymetrické kryptografie (např. veřejného klíče banky) nebo protokolu Diffie-Hellman se obě strany bezpečně dohodnou na **jednom tajném symetrickém klíči**.
4. **Bezpečná komunikace:** Asymetrické šifrování je náročné a pomalé. Proto se od této chvíle odloží. Zbytek komunikace už probíhá velmi rychle pomocí **symetrického šifrování**, které používá onen dohodnutý tajný klíč.