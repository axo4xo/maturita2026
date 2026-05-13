# 23 • Událostmi řízené programování

> Návrhové vzory v událostmi řízeném programování, Event, subscriber, publisher, přihlášení a odhlášení
> 

---

## Co je událostmi řízené programování

**Event-Driven Programming (EDP)** je programovací paradigma, kde tok programu **neurčuje lineární kód**, ale **události** (events): akce uživatele, systémové signály, síťové requesty, hardwarové impulsy.

Místo *"udělej krok 1, pak krok 2, pak krok 3 a skonči"* program říká *"když nastane X, zareaguj takto. Mezitím čekej."*

```
Imperativní program:    Start → Krok 1 → Krok 2 → Krok 3 → Konec
                        (program ovládá tok)

Událostmi řízený:       Start → [čekám] → Událost → Reakce → [čekám] → ...
                        (události ovládají tok)
```

### Kde se EDP používá

| Doména | Příklady událostí |
| --- | --- |
| **GUI aplikace** | Klik, stisk klávesy, změna velikosti okna |
| **Webový frontend** | Klik, scroll, submit formuláře, fokus |
| **Síťové aplikace** | Příchozí HTTP request, dokončení API volání |
| **IoT / embedded** | Data ze senzoru, stisk tlačítka, timer |
| **Hry** | Kolize, vstup hráče, herní timer, network packet |
| **Backend (Node.js)** | Příchozí request, čtení souboru, DB callback |

V současnosti je EDP **dominantní paradigma pro UI**: bez něj by aplikace pořád blokovala čekáním a uživatel by nemohl interagovat.

---

## Tři klíčové role: Publisher, Subscriber, Event

### Publisher (vydavatel)

Objekt, ve kterém událost **vzniká**: třeba **tlačítko**, časovač, síťové spojení, senzor. Publisher **neví**, kdo ho poslouchá. Je mu jedno, jestli reaguje jeden subscriber nebo deset, nebo nikdo.

Publisher udělá dvě věci:

1. **Definuje událost** (deklaruje, že na něčem může být `Click`, `DataReceived`...)
2. **Vystřelí** (raise / fire / emit) událost, když ten okamžik nastane

### Subscriber (odběratel)

Objekt, který **chce reagovat** na událost (formulář). Aby se k ní dostal, musí se k publisheru **přihlásit** (subscribe). Subscriber obsahuje **Event Handler**: metodu, která se vykoná, když událost přijde.

### Event (událost)

"Most" mezi publisherem a subscriberem. Technicky je to typicky **seznam odkazů na metody** (handlery), které se mají zavolat. Když publisher událost vystřelí, framework projde seznam a zavolá každý handler.

```
Publisher (Tlačítko)
    │
    │  vystřelí událost Click
    ▼
Event (interní seznam handlerů)
    │
    ├──▶ Handler1 (zavře okno)
    ├──▶ Handler2 (přehraje zvuk)
    └──▶ Handler3 (zapíše do logu)
```

### Loose coupling

Klíčová vlastnost: **publisher a subscriber se navzájem neznají přímo**. Tlačítko neví, co se má stát po kliku. Posluchač neví, kdo tu událost spustil. Komunikují přes **rozhraní events**.

Důsledek:

- **Modularita**: lze přidávat/odebírat subscribery bez změny publishera
- **Znovupoužitelnost**: publisher je univerzální
- **Testovatelnost**: snadno se mockují

---

## Návrhové vzory v EDP

EDP není jeden konkrétní vzor, ale **kategorie vzorů**. Hlavní jsou:

### Observer pattern (Pozorovatel)

Behaviorální vzor od GoF. **Jeden Subject** notifikuje **mnoho Observers** (1:N). Komunikace **přímá**: Subject drží seznam observerů a sám je notifikuje.

```
   ┌──────────┐
   │ Subject  │
   └──────────┘
        │
        │  notify()
        ├──────▶ Observer1
        ├──────▶ Observer2
        └──────▶ Observer3
```

| Role | Co dělá |
| --- | --- |
| **Subject** (Publisher) | Drží seznam observerů, volá `notify()` |
| **Observer** (Subscriber) | Implementuje `update()`, registruje se |
| `attach()` / `subscribe()` | Přihlášení |
| `detach()` / `unsubscribe()` | Odhlášení |
| `notify()` | Zavolá `update()` na všech observerech |

### Publish-Subscribe (Pub-Sub)

Volnější varianta. Publisher **nemá přímou referenci na subscribery**, místo toho posílá zprávy přes **prostředníka** (message broker, event bus). Subscribery se přihlašují k **typu zprávy / topicu**.

```
   ┌──────────┐    ┌───────────┐    ┌──────────────┐
   │ Publisher│───▶│ Message   │───▶│ Subscriber1  │
   └──────────┘    │ Broker    │───▶│ Subscriber2  │
   ┌──────────┐    │ (Bus)     │───▶│ Subscriber3  │
   │ Publisher│───▶│           │    └──────────────┘
   └──────────┘    └───────────┘
```

|  | Observer | Pub-Sub |
| --- | --- | --- |
| **Propojení** | Přímé (Subject zná Observers) | Přes brokera |
| **Topicy** | Ne (Subject vystřelí všem) | Ano (subscribery se přihlašují k topic) |
| **Komunikace** | 1:N přímá | N:M přes prostředníka |
| **Použití** | Desktop UI (WinForms, WPF) | Mikroslužby, Kafka, RabbitMQ |
| **Latence** | Bleskově | Vyšší (broker overhead) |
| **Spolehlivost** | V paměti | Persistence, retry, queueing |

---

## Implementace v C#: Delegáti a Eventy

### Delegát: předpis pro tvar metody

Delegát definuje **podpis metody** (parametry + návratový typ). Metody, které tomu podpisu vyhoví, se dají do něj uložit.

```csharp
// Delegát: "metoda, která bere (object, EventArgs) a vrací void"
public delegate void VideoEncodedEventHandler(object source, EventArgs args);
```

Delegát funguje jako "typové bezpečný ukazatel na funkci".

### Event: zapouzdřený delegát

`event` je klíčové slovo, které **omezí přístup**. Mimo třídu lze jen `+=` a `-=` (přihlásit/odhlásit), nelze událost vyvolat zvenku ani přepsat seznam handlerů.

```csharp
public event VideoEncodedEventHandler VideoEncoded;
```

Bez `event` by každý zvenku mohl přepsat seznam handlerů na null nebo vyvolat událost neoprávněně.

### Kompletní příklad

```csharp
// ═══════════════════════════════════
// 1. PUBLISHER
// ═══════════════════════════════════
public class VideoEncoder
{
    public event EventHandler<VideoEventArgs> VideoEncoded;

    public void Encode(string filename)
    {
        Console.WriteLine($"Kóduji {filename}...");
        Thread.Sleep(2000);

        OnVideoEncoded(filename);
    }

    // Konvence: vystřelení události se dělá v protected virtual metodě
    protected virtual void OnVideoEncoded(string filename)
    {
        VideoEncoded?.Invoke(this, new VideoEventArgs { Filename = filename });
        //          ^^ null-conditional: neselže, když nikdo neposlouchá
    }
}

public class VideoEventArgs : EventArgs
{
    public string Filename { get; set; }
}

// ═══════════════════════════════════
// 2. SUBSCRIBER
// ═══════════════════════════════════
public class MailService
{
    public void OnVideoEncoded(object source, VideoEventArgs e)
    {
        Console.WriteLine($"Email: Video '{e.Filename}' bylo zakódováno.");
    }
}

// ═══════════════════════════════════
// 3. PROPOJENÍ
// ═══════════════════════════════════
var encoder = new VideoEncoder();
var mailService = new MailService();

// Subscribe
encoder.VideoEncoded += mailService.OnVideoEncoded;

encoder.Encode("vacation.mp4");
// → "Kóduji vacation.mp4..."
// → "Email: Video 'vacation.mp4' bylo zakódováno."

// Unsubscribe (důležité kvůli memory leaks)
encoder.VideoEncoded -= mailService.OnVideoEncoded;
```

### Konvence pro event handler v .NET

```csharp
// Standardní podpis pro event handlery v .NET
void Handler(object sender, EventArgs e)
{
    // sender = kdo událost vystřelil (typicky publisher)
    // e      = data o události (nebo EventArgs.Empty)
}
```

Pro vlastní data se dědí z `EventArgs`:

```csharp
public class ClickEventArgs : EventArgs
{
    public int X { get; set; }
    public int Y { get; set; }
}
```

---

## Implementace v JavaScriptu: addEventListener

```jsx
const button = document.getElementById("submit");

// Subscribe
button.addEventListener("click", function(e) {
    console.log("Kliknuto na:", e.clientX, e.clientY);
});

// Unsubscribe (vyžaduje referenci na stejnou funkci)
const handler = (e) => console.log("klik");
button.addEventListener("click", handler);
button.removeEventListener("click", handler);
```

> **Klasický chyták:** `removeEventListener` musí dostat **přesně stejnou referenci**, jakou jsi dal `addEventListener`. Anonymní funkce nelze odebrat:
> 
> 
> ```jsx
> button.addEventListener("click", () => console.log("klik"));
> button.removeEventListener("click", () => console.log("klik"));  // nepomůže!
> // Dvě různé funkce, i když text vypadá stejně
> ```
> 

### Mapování JS ↔ C#

| C# | JavaScript |
| --- | --- |
| `button.Click += handler` | `button.addEventListener("click", handler)` |
| `button.Click -= handler` | `button.removeEventListener("click", handler)` |
| `EventArgs e` | `event e` (Event objekt) |
| `sender` | `e.target` nebo `e.currentTarget` |
| `event` klíčové slovo | (žádný ekvivalent, JS je dynamický) |

---

## DOM eventy: bubbling, capturing, delegation

### Bubbling (probublávání)

Když uživatel klikne na element, event se nezastaví u něj: **bublá** směrem **nahoru** ke všem rodičovským elementům.

```html
<div id="outer">
  <div id="middle">
    <button id="btn">Klikni</button>
  </div>
</div>
```

```jsx
outer.addEventListener("click", () => console.log("outer"));
middle.addEventListener("click", () => console.log("middle"));
btn.addEventListener("click", () => console.log("btn"));

// Klik na button vypíše:
// btn
// middle
// outer
```

### Capturing (zachytávání)

Opačná fáze: event nejdřív projde **od kořene dolů** k cíli, pak teprve bublá zpět. Aktivuje se třetím parametrem `addEventListener`:

```jsx
outer.addEventListener("click", handler, true);  // capturing fáze
outer.addEventListener("click", handler);        // default: bubbling fáze
```

V praxi se používá hlavně bubbling. Capturing zřídka.

### Tři fáze eventu

```
1. CAPTURING:   document → html → body → outer → middle → btn (cíl)
2. TARGET:      btn (cíl) zpracuje handler
3. BUBBLING:    btn → middle → outer → body → html → document
```

### stopPropagation a preventDefault

```jsx
button.addEventListener("click", (e) => {
    e.stopPropagation();   // zastaví probublávání nahoru
    e.preventDefault();    // zruší default chování (např. submit formu)
});
```

| Metoda | Co dělá |
| --- | --- |
| `e.stopPropagation()` | Zabrání bubblingu na další rodiče |
| `e.stopImmediatePropagation()` | Stopne i ostatní handlery na stejném elementu |
| `e.preventDefault()` | Zruší výchozí chování (klik na link, submit form, scroll) |

### Event delegation (vzorec)

Místo přidávání event listeneru na **každý prvek seznamu**, přidáš ho na **rodiče** a v handleru zjistíš, kdo to byl skrze `e.target`.

```html
<ul id="todoList">
  <li>úkol 1</li>
  <li>úkol 2</li>
  <li>úkol 3</li>
  <!-- ... může jich být 1000 ... -->
</ul>
```

```jsx
// ❌ Špatně: listener na každém li (1000 listenerů, problém s dynamicky přidanými)
document.querySelectorAll("#todoList li").forEach(li => {
    li.addEventListener("click", () => console.log(li.textContent));
});

// ✓ Lépe: jeden listener na rodiči (event delegation)
todoList.addEventListener("click", (e) => {
    if (e.target.tagName === "LI") {
        console.log(e.target.textContent);
    }
});
```

**Výhody event delegation:**

- Jen jeden listener bez ohledu na počet prvků
- Funguje i pro **dynamicky přidané** elementy (přidaní `<li>` později taky bude reagovat)
- Menší paměťová stopa

---

## Custom Events v JavaScriptu

Nejen builtin eventy (click, scroll, ...), ale i vlastní:

```jsx
// Vytvoření custom eventu
const customEvent = new CustomEvent("uzivatelPrihlasen", {
    detail: { username: "axo", timestamp: Date.now() }
});

// Posluchač
document.addEventListener("uzivatelPrihlasen", (e) => {
    console.log("Přihlásil se:", e.detail.username);
});

// Vyvolání
document.dispatchEvent(customEvent);
```

Custom eventy umožňují **decoupling** mezi částmi aplikace bez globálního stavu.

---

## Memory leak při zapomenutém odhlášení

```
Publisher → drží referenci na Subscriber (přes event)
Garbage Collector vidí: "Subscriber má živou referenci → nesmazat"
Subscriber zůstává v paměti i když ho aplikace už nepotřebuje
```

### Praktický scénář v JS

```jsx
function vytvorWidget() {
    const widget = { name: "popup" };

    window.addEventListener("resize", () => {
        console.log(widget.name);  // closure drží referenci na widget
    });

    // widget už není potřeba, ale window ho drží přes listener
}

vytvorWidget();
vytvorWidget();
vytvorWidget();
// 3 widgety navždy v paměti, 3 listenery navždy aktivní
```

### Řešení: AbortController (moderní JS)

> Tahle moderní technika v původních zápiscích chyběla.
> 

`AbortController` je elegantní způsob, jak naráz odhlásit **víc listenerů**:

```jsx
const controller = new AbortController();
const signal = controller.signal;

window.addEventListener("resize", handler1, { signal });
window.addEventListener("scroll", handler2, { signal });
document.addEventListener("click", handler3, { signal });

// Když chceš zrušit všechny tři najednou:
controller.abort();
```

V Reactu pro cleanup v `useEffect`:

```jsx
useEffect(() => {
    const controller = new AbortController();

    window.addEventListener("resize", handleResize, {
        signal: controller.signal
    });

    return () => controller.abort();  // cleanup
}, []);
```

---

## Node.js EventEmitter

`EventEmitter` je třída v Node.js standardní knihovně pro vlastní eventy:

```jsx
const EventEmitter = require("events");

class Database extends EventEmitter {
    connect() {
        console.log("Připojuji...");
        setTimeout(() => {
            this.emit("connected", { time: Date.now() });
        }, 1000);
    }
}

const db = new Database();

db.on("connected", (data) => {
    console.log("Připojeno v:", data.time);
});

db.once("connected", () => {
    console.log("Tohle se zavolá jen jednou.");
});

db.connect();
```

| Metoda | Co dělá |
| --- | --- |
| `emitter.on(event, handler)` | Subscribe (jako `addEventListener`) |
| `emitter.once(event, handler)` | Subscribe **jen na první** emit |
| `emitter.off(event, handler)` | Unsubscribe |
| `emitter.emit(event, ...args)` | Vystřelí událost |
| `emitter.removeAllListeners(event)` | Odebere všechny posluchače |

Většina Node.js core modulů extends `EventEmitter`: streams, HTTP server, FS watcher.

---

## React Synthetic Events

React má vlastní vrstvu nad DOM eventy: **Synthetic Events**. Důvod: konzistence napříč prohlížeči a delegace eventů na root elementu.

```jsx
function Button() {
    const handleClick = (e) => {
        console.log(e);            // SyntheticEvent (React wrapper)
        console.log(e.nativeEvent); // Skutečný DOM event
        console.log(e.target);
    };

    return <button onClick={handleClick}>Klikni</button>;
}
```

### Klíčové rozdíly

- **CamelCase**: `onClick`, ne `onclick`
- **Hodnota je funkce**: `onClick={handleClick}`, ne string
- **Event delegation pod kapotou**: do React 17 jeden handler na document, od R17 na root
- **Automatický unmount cleanup**: React odebere listenery při unmount komponenty

```jsx
useEffect(() => {
    const handler = () => console.log("resize");
    window.addEventListener("resize", handler);

    return () => window.removeEventListener("resize", handler);  // cleanup!
}, []);
```

---

## Event Loop

Mechanismus, který umožňuje JavaScript zpracovávat asynchronní operace bez blokování. Zásadní pro pochopení EDP v JS / Node.

### Komponenty

![image.png](23%20%E2%80%A2%20Ud%C3%A1lostmi%20%C5%99%C3%ADzen%C3%A9%20programov%C3%A1n%C3%AD/image.png)

### Algoritmus event loopu (zjednodušeně)

```
1. Vykonej všechen synchronní kód z Call Stacku
2. Když je Call Stack prázdný:
   a. Vykonej VŠECHNY úlohy z Microtask Queue
   b. Vykonej JEDNU úlohu z Task Queue (macrotask)
3. Vykresli stránku, pokud je třeba
4. Opakuj
```

### Microtask vs Macrotask priorita

```jsx
console.log("1");                              // sync

setTimeout(() => console.log("4"), 0);        // macrotask

Promise.resolve().then(() => console.log("3"));// microtask

console.log("2");                              // sync

// Output: 1, 2, 3, 4
```

**Klíčové:** Mikrotasky **vždy předbíhají** macrotasky. Promise `.then()` má prioritu před `setTimeout(..., 0)`.

### Co je macrotask a microtask

| Macrotask | Microtask |
| --- | --- |
| `setTimeout`, `setInterval` | `Promise.then/catch/finally` |
| DOM eventy (click, ...) | `queueMicrotask()` |
| I/O callbacks (Node) | `MutationObserver` |
| `requestAnimationFrame` (browser) | `process.nextTick` (Node, ještě vyšší prioritu) |

---

## Synchronní vs asynchronní eventy

|  | Synchronní | Asynchronní |
| --- | --- | --- |
| **Kdy se handler spustí** | Hned při emit | Až event loop dovolí |
| **Klasická událost** | DOM click v JS, C# event | Promise resolve, setTimeout |
| **Pořadí** | Předvídatelné, sekvenční | Závisí na event loopu |

```jsx
// Synchronní: handler proběhne PŘED dalším řádkem
button.click();          // pokud existuje listener
console.log("po click"); // proběhne až po handleru

// Asynchronní: handler proběhne POZDĚJI
setTimeout(() => console.log("async"), 0);
console.log("sync");
// Output: "sync", potom "async"
```

---

## Výhody a nevýhody EDP

| Plusy | Mínusy |
| --- | --- |
| **Reaktivnost**: aplikace reaguje na vstupy v reálném čase | **Složitější ladění**: tok kódu není lineární |
| **Modularita**: loose coupling mezi komponentami | **Callback hell**: vnořené callbacky špatně čitelné |
| **Efektivita**: nezatěžuje CPU pasivním čekáním | **Memory leaks**: zapomenuté unsubscribe |
| **Škálovatelnost**: vhodné pro IO-bound aplikace (Node.js) | **Race conditions**: pořadí eventů není garantované |
| **Užité v UI**: standard pro grafické aplikace | **Mentální zátěž**: vyšší pro nováčky |

---

## Rychlý tahák

| Pojem | Klíčová fakta |
| --- | --- |
| **EDP** | Tok programu řízen událostmi, ne lineárním kódem |
| **Publisher** | Vystřelí událost, neví, kdo poslouchá |
| **Subscriber** | Přihlásí se a reaguje skrz handler |
| **Event Handler** | Metoda, která se vykoná při události |
| **Event** | "Most" mezi publisherem a subscriberem |
| **Observer pattern** | 1:N, přímá komunikace |
| **Pub-Sub** | N:M, přes brokera |
| **Mediator pattern** | Vše přes prostředníka místo přímé komunikace |
| **Delegát (C#)** | Předpis pro tvar metody |
| **`event` (C#)** | Zapouzdřený delegát, mimo třídu jen `+=` a `-=` |
| **`+=` / `-=`** | Subscribe / unsubscribe v C# |
| **`addEventListener`** | Subscribe v JS |
| **`removeEventListener`** | Unsubscribe, vyžaduje stejnou referenci |
| **Bubbling** | Event prochází od cíle k rodičům |
| **Capturing** | Event prochází od kořene k cíli |
| **`stopPropagation`** | Zastaví bubbling |
| **`preventDefault`** | Zruší default chování (form submit, scroll) |
| **Event delegation** | Listener na rodiči místo na každém dítěti |
| **Custom Events** | `new CustomEvent()`, `dispatchEvent()` |
| **AbortController** | Moderní cleanup pro víc listenerů naráz |
| **EventEmitter (Node)** | `.on()`, `.emit()`, `.once()`, `.off()` |
| **React SyntheticEvent** | Wrapper nad DOM eventy, camelCase, delegation |
| **Memory leak** | Publisher drží Subscribera, GC nesmaže |
| **Event loop** | JS mechanismus pro async, Call Stack + Queues |
| **Microtask** | `Promise.then`, vyšší prioritu než macrotask |
| **Macrotask** | `setTimeout`, DOM events |

---

## Tipy pro ústní zkoušku

### Jak začít

> *"Událostmi řízené programování je paradigma, kde tok programu neurčuje sekvenční kód, ale události. Aplikace čeká a reaguje na signály: kliknutí, síťové requesty, timery. Klíčové role jsou Publisher (kdo událost vystřelí), Subscriber (kdo se přihlásí a reaguje) a Event (most mezi nimi). Hlavní návrhový vzor je Observer."*
> 

### Co komise typicky chce slyšet

- **Definice EDP** a kontrast s imperativním kódem.
- **Tři role**: Publisher, Subscriber, Event.
- **Observer pattern** jako základ.
- **Implementace v C#**: delegát, event, `+=`, `=`.
- **Implementace v JS**: addEventListener / removeEventListener.
- **Memory leak** při zapomenutém unsubscribe.
- **Loose coupling** jako výhoda.

### Doplňky, které komisi potěší

- **Rozdíl Observer vs Pub-Sub** (přímá komunikace vs broker).
- **Mediator pattern** jako alternativa.
- **DOM bubbling a capturing**, **event delegation**.
- **`stopPropagation` a `preventDefault`**.
- **Custom Events** v JS.
- **AbortController** pro moderní cleanup.
- **Node.js EventEmitter**.
- **React Synthetic Events**.
- **Event Loop**: microtask vs macrotask priorita.

### Časté chytáky

| Otázka | Odpověď |
| --- | --- |
| *Rozdíl Observer a Pub-Sub?* | Observer: Subject zná Observers, přímá komunikace. Pub-Sub: přes brokera s topicy, decoupled. |
| *Co je delegát v C#?* | Předpis pro tvar metody (parametry + návratový typ). Funguje jako typesafe ukazatel na funkci. |
| *Proč `event` keyword v C#?* | Zapouzdří delegát, takže mimo třídu lze jen `+=` a `-=`. Bez něj by mohl kdokoli přepsat seznam handlerů. |
| *Co je bubbling?* | DOM event prochází od cíle (target) směrem nahoru k rodičovským elementům. |
| *Proč event delegation?* | Místo X listenerů na X elementech máš jeden listener na rodiči, který funguje i pro dynamicky přidané prvky. |
| *Co je memory leak při eventech?* | Publisher drží referenci na subscribera, GC ho nemůže smazat. Řešení: unsubscribe (`-=` nebo `removeEventListener`). |
| *Microtask vs macrotask?* | Microtask (Promise.then) má **vždy** vyšší prioritu než macrotask (setTimeout). |