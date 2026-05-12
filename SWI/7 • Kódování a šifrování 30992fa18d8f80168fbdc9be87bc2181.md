# 7 • Kódování a šifrování

## Kódování vs. Šifrování

Ačkoliv se to v běžné řeči plete, v informatice jde o dvě úplně odlišné věci:

- **Kódování (Encoding):** Neslouží k utajení! Účelem je převést data do takového formátu, aby šla snadno přenést, uložit nebo aby jim rozuměl počítač (případně jiný systém). Kódování je veřejně známé a kdokoliv ho může dekódovat zpět.
- **Šifrování (Encryption):** Účelem je **bezpečnost a utajení**. Zpráva se změní tak, aby si ji mohl přečíst *pouze* ten, kdo má správný dešifrovací klíč. Pro kohokoliv jiného to musí vypadat jako náhodný shluk znaků.

## Kódování dat

Kódování řeší to, jak zapsat lidské znaky tak, aby se s nimi dalo technologicky pracovat.

- **Morseovka:** Kódování písmen do krátkých a dlouhých signálů pro přenos po telegrafu.
- **ASCII:** Základní americká tabulka. Každé písmeno a znak má přiřazené číslo (např. 'A' je 65). Protože vznikla v USA, používá jen 7 bitů a obsahuje jen základní anglickou abecedu. Neumí háčky, čárky, azbuku ani rozsypaný čaj.
- **Lokální kódování (Čeština):** Jakmile se počítače rozšířily, vznikla potřeba národních abeced. Vznikly 8bitové tabulky jako `Windows-1250` (od Microsoftu) nebo `ISO-8859-2`. Problém byl, že když jsi otevřel text ve špatném kódování, místo "Ř" jsi viděl nesmyslné znaky.
- **UTF-8 (Unicode):** Dnešní moderní standard. Je to obrovská mezinárodní tabulka, která obsahuje znaky všech jazyků světa, smajlíky i speciální symboly. Zajišťuje, že se text zobrazí správně všude.

## 3. Historické a klasické šifrování

 **Transpozice** a **Substituce**.

- **Transpozice:** Písmena ve zprávě zůstávají stejná, ale **mění se jejich pořadí** (zamíchají se). Je to v podstatě přesmyčka (např. slovo "AHOJ" napíšeš pozpátku jako "JOHA").
- **Substituce:** Písmena zůstávají na svém místě, ale **nahrazují se jinými písmeny** nebo znaky.
    - **Cézarova šifra:** Klasická substituce. Každé písmeno posuneš v abecedě o pevný počet míst (např. o 3 místa: A ⇒ D, B ⇒ E).
    - **Vigenèrova šifra:** Složitější substituce (polyalfabetická). K posunu se nepoužívá jedno číslo, ale heslo. Každé písmeno zprávy se posune o jiný počet míst podle toho, jaké písmeno hesla je zrovna na řadě.
    - **Enigma:** Německý šifrovací stroj z 2. světové války. Byla to extrémně složitá mechanická a elektrická symetrická substituce, kde se pravidlo nahrazování měnilo s každým stisknutím klávesy.

## 4. Moderní kryptografie

[symmetric vs asymmetric encryption diagram, vygenerováno umělou inteligencí](https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcQgJxiIqMgq3fvbvOghimyI-sZTlDpleYEJTQhA-QZP8fX5jgZJ8MjD1JhUgPmdwQvf7NFsbRrfsrgMH_pad-v817Xj2_SnM4-glqIATeuodtp8Rt8)

- **Symetrické šifrování:** Odesílatel i příjemce mají **jeden stejný tajný klíč**. Tím samým klíčem se zpráva zamkne i odemkne. (Je to rychlé, ale problém je, jak si ten klíč na dálku bezpečně předat).
- **Asymetrické šifrování (např. RSA):** Každý má klíče dva – **veřejný a soukromý**. Veřejný klíč dáš komukoliv. Kdokoliv ti jím může zprávu zašifrovat. Ale odšifrovat ji můžeš už jen ty pomocí svého soukromého klíče, který nikomu nedáš. Řeší to problém s předáváním klíčů přes internet.

*Jak si přes odposlouchávaný internet ten společný klíč bezpečně předat, aniž by ho někdo cestou ukradl?*

### **Diffie-Hellmanův protokol (DH)**

- matematický způsob **bezpečné výměny klíčů** přes nezabezpečený kanál
- **Jak to funguje:** Představ si, že ty a banka máte každý svou tajnou barvu (např. ty červenou, banka modrou). Dále se veřejně dohodnete na jedné společné barvě (např. žluté). Ty smícháš svou tajnou červenou se žlutou a pošleš tenhle mix bance. Banka smíchá svou tajnou modrou se žlutou a pošle to tobě. Hacker vidí jen ty mixy, ale z nich nedokáže zjistit původní tajné barvy. Nakonec ty do bankovního mixu přidáš svou tajnou červenou a banka do tvého mixu svou tajnou modrou. Oba tak získáte naprosto stejnou výslednou barvu (společný tajný klíč), aniž byste si tu výslednou barvu museli po internetu posílat.

![{0A343147-BB89-41BB-8117-60949FC5CF60}.png](7%20%E2%80%A2%20K%C3%B3dov%C3%A1n%C3%AD%20a%20%C5%A1ifrov%C3%A1n%C3%AD/0A343147-BB89-41BB-8117-60949FC5CF60.png)

- **Praxe:** Dnes se Diffie-Hellman (nebo asymetrické šifrování RSA) používá přesně k tomuto účelu – na začátku komunikace si bezpečně "domluvíme" symetrický klíč a dál už šifrujeme rychle tím symetrickým. Tomu se říká **hybridní šifrování**.