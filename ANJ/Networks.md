# Networks
### 1. Basic Concept & Types of Networks (Základy a dělení podle velikosti)

Vysvětli, proč vůbec sítě máme (sdílení dat a hardwaru) a hned je rozděl podle rozsahu. To je absolutní školní základ.

- **LAN (Local Area Network):** Síť v jedné budově (škola, dům). Devices are connected via switches or Wi-Fi.
    
- **WAN (Wide Area Network):** Propojuje velká území. The biggest WAN is the Internet.
    
- **WLAN (Wireless LAN):** To je prostě Wi-Fi. No cables needed, uses radio waves.
    
- **VPN (Virtual Private Network):** Secure, encrypted connection over the public internet. _(Tohle zmiň, zní to profi – používá se to při remote worku do firemní sítě)._
    

### 2. Network Topologies (Topologie - jak to vypadá zapojené)

Tohle učitelé strašně rádi slyší. Zmiň, že se tak určuje fyzické uspořádání sítě.

- **Star topology (Hvězda):** Dnes nejběžnější. All nodes (uzly) are connected to a central device (switch). Když vypadne jeden kabel, zbytek sítě jede.
    
- **Bus topology (Sběrnice):** Zastaralé. All devices share one main cable. Když se přeruší hlavní kabel, spadne všechno.
    
- **Ring topology (Kruh):** Data travel in one direction in a closed loop.
    
- **Mesh topology (Síť):** Every device is connected to every other device. Extrémně spolehlivé, ale drahé na kabely.
    

### 3. Hardware (Co k tomu fyzicky potřebuješ)

Rozděl to na aktivní a pasivní prvky.

- **Router (Směrovač):** Connects different networks together (e.g., your home LAN to the Internet). Routuje traffic a většinou přiděluje IP adresy přes DHCP.
    
- **Switch (Přepínač):** Connects devices within the _same_ network. Je chytřejší než starý hub, protože posílá data jen konkrétnímu zařízení.
    
- **Server vs. Client:** Server provides services (hosting, files, databases), client requests them (tvůj noťas nebo mobil).
    
- **Transmission media (Kabely):** * **Twisted pair cable / Ethernet:** Klasický UTP kabel s RJ-45 koncovkou.
    
    - **Fibre optics (Optika):** Uses light to transfer data. Ultra fast, used for internet backbone.
        

### 4. Protocols & Addressing (Tvoje eso v rukávu)

Tady zkus komisi utéct od suché teorie k praxi. Všechno na webu komunikuje přes protokoly.

- **IP Address:** Každé zařízení musí mít adresu. Zmiň, že nám docházejí staré **IPv4** (např. `192.168.1.1`), a proto přecházíme na **IPv6** (delší, hexadecimální formát).
    
- **DNS (Domain Name System):** The phonebook of the internet. Překládá lidská jména (např. `google.com`) na IP adresy strojů, protože čísla si nikdo nepamatuje.
    
- **HTTP / HTTPS:** Protocols for transferring web pages. Zmiň to "S" na konci – **Secure**. Znamená to, že data (třeba když platíš na e-shopu) jsou šifrovaná přes SSL/TLS certifikát.