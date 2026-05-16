# 22 • React - komponenty a props

> React komponenty (funkcionální), props, předávání callback funkcí
> 

> **Formát:** 30 min praktická úloha, 15 min obhajoba + teorie. Praktika je v React + TypeScript (Vite šablona), focus na komponenty, typované props a callback funkce.
> 

# Část 1: Teorie

### Co je React a proč ho používáme

**React** je knihovna pro tvorbu uživatelských rozhraní (UI) od Mety. Postavená na principu **komponentové architektury**: UI se skládá z malých, znovupoužitelných bloků.

Klíčové vlastnosti:

- **Deklarativní**: popíšeš **jak má UI vypadat**, ne jak ho dosáhnout (vs imperativní DOM manipulace)
- **Komponentové**: vše je komponenta, kompozice je základ
- **Jednosměrný tok dat**: data tečou shora dolů (rodič → dítě)
- **Virtual DOM**: efektivní re-rendering

> **React vs Vanilla JS**: ve Vanilla JS bys ručně manipuloval DOM (`document.createElement`, `appendChild`, `addEventListener`...). V Reactu jen popíšeš stav UI, knihovna se postará o DOM aktualizace.
> 

> **React vs framework (Next.js)**: React je **knihovna** (UI vrstva), Next.js je **framework** postavený na Reactu (routing, SSR, build, atd.). Této otázce stačí čistý React (typicky Vite + TS).
> 

---

### Funkcionální vs třídní komponenty

Historicky React měl 2 typy komponent:

|  | Funkcionální (moderní) | Třídní (legacy) |
| --- | --- | --- |
| **Syntax** | Funkce vracející JSX | `class extends Component` |
| **State** | `useState` hook | `this.state`, `this.setState` |
| **Lifecycle** | `useEffect` hook | `componentDidMount`, `componentWillUnmount`... |
| **`this`** | Žádné `this` | Vázání `this` je problém |
| **Boilerplate** | Minimální | Hodně |
| **Hooks** | Plně podporované | Nepodporované |
| **React doporučuje** | **Ano** | Ne, jen legacy code |

> **Pravidlo**: **Vždy funkcionální komponenty**. Třídní jsou v moderním Reactu (16.8+, 2019) deprecated. Pokud někde uvidíš `class Foo extends Component`, je to starý kód.
> 

---

### Co jsou komponenty

**Komponenta** je znovupoužitelný stavební blok UI. Vrací JSX (popis toho, co se má zobrazit). Aplikace je strom komponent.

```
<App>
├── <Header />
├── <Main>
│   ├── <ProductList>
│   │   ├── <ProductCard />
│   │   ├── <ProductCard />
│   │   └── <ProductCard />
│   └── <Sidebar />
└── <Footer />
```

**Výhody:**

- **Znovupoužitelnost** (jedna karta, mnoho produktů)
- **Izolace** (každá komponenta má svou logiku a styl)
- **Čitelnost** (rozdělíš velký UI na malé části)
- **Testovatelnost** (komponenty se testují izolovaně)

---

### Funkcionální komponenta: základ v TypeScriptu

Komponenta je TypeScript funkce, která vrací JSX. Soubor má příponu `.tsx`. Začíná **velkým písmenem** (jinak React si myslí, že je to HTML element).

```tsx
// Nejjednodušší komponenta bez props
function Pozdrav() {
    return <h1>Ahoj!</h1>;
}

// Stejné jako arrow function
const Pozdrav = () => <h1>Ahoj!</h1>;

// Použití
<Pozdrav />
```

### Pravidla

- Jméno **musí** začínat velkým písmenem (`Pozdrav`, ne `pozdrav`)
- Přípona souboru: `.tsx` (s React JSX), nebo `.ts` (čisté TS moduly bez JSX)
- Vrací **jeden kořenový element** (nebo Fragment `<>...</>`)
- TS výrazy v JSX se dávají do `{}`

```tsx
const Komponenta = () => {
    const jmeno: string = 'axo';
    const vek: number = 18;

    return (
        <>
            <h1>Ahoj, {jmeno}!</h1>
            <p>Je ti {vek} let.</p>
            <p>Za 10 let ti bude {vek + 10}.</p>
        </>
    );
};
```

### Proč velké písmeno

```tsx
// React vidí jako HTML element (input, div, span...)
<input />

// React vidí jako TVOJI komponentu
<MujInput />
```

Bez toho by React `<pozdrav />` chápal jako neznámý HTML element a vykreslil to jako `<pozdrav>` v DOM (bez tvého renderu).

---

### `React.FC` (pozor, neuvádět)

> Drobnost, ale zkoušející může chytit.
> 

Starší kód používá `React.FC` (FunctionComponent):

```tsx
// Starý styl, NEDOPORUČUJE SE
const Komponenta: React.FC<Props> = ({ jmeno }) => {
    return <h1>{jmeno}</h1>;
};
```

Moderní React tým **doporučuje vyhýbat se `React.FC`** (problém: implicitně přidá `children` prop, i když ji nepoužíváš; nepodporuje generiku dobře). Místo toho:

```tsx
// Moderní styl
function Komponenta({ jmeno }: Props) {
    return <h1>{jmeno}</h1>;
}

// Nebo arrow function
const Komponenta = ({ jmeno }: Props) => <h1>{jmeno}</h1>;
```

---

### Props: předávání dat dovnitř (s typy)

**Props (properties)** = vstupní data, která komponenta dostává od svého rodiče. V TypeScriptu **typujeme každou prop**.

### Inline typování (krátké)

```tsx
function Pozdrav({ jmeno }: { jmeno: string }) {
    return <h1>Ahoj, {jmeno}!</h1>;
}

<Pozdrav jmeno="axo" />
```

### Type alias (preferované pro 2+ props)

```tsx
type PozdravProps = {
    jmeno: string;
    vek: number;
};

function Pozdrav({ jmeno, vek }: PozdravProps) {
    return (
        <div>
            <h1>Ahoj, {jmeno}!</h1>
            <p>Je ti {vek} let.</p>
        </div>
    );
}

<Pozdrav jmeno="axo" vek={18} />
```

> **Konvence**: typ propsů se jmenuje `JmenoKomponentyProps` (např. `PozdravProps`). Nemusí to být, ale je to standardní.
> 

### Volitelné a defaultní hodnoty

```tsx
type TlacitkoProps = {
    text: string;            // povinný
    barva?: string;          // volitelný (otazník)
    pocet?: number;
};

function Tlacitko({ text, barva = 'blue', pocet = 0 }: TlacitkoProps) {
    return (
        <button style={{ backgroundColor: barva }}>
            {text} ({pocet})
        </button>
    );
}

<Tlacitko text="Klikni" />                       // jen povinné
<Tlacitko text="Odeslat" barva="green" />        // s volitelným
<Tlacitko text="X" barva="red" pocet={67} />     // všechny
```

### Typy hodnot v props

```tsx
type Props = {
    nazev:   string;                              // string
    cena:    number;                              // number
    skladem: boolean;                             // boolean
    tagy:    string[];                            // pole stringů
    produkt: { id: number; nazev: string };       // objekt
    onClick: () => void;                          // funkce bez parametrů
    onChange: (text: string) => void;             // funkce s parametrem
    icon?: React.ReactNode;                       // libovolný JSX (volitelný)
};
```

> **Vše kromě stringů jde do `{}`**: `cena={25000}`, `skladem={true}`. `{}` říká "toto je TS výraz". Stringy můžou být `"text"` nebo `{"text"}`.
> 

---

### `children`: speciální prop

Co je **mezi otevírací a uzavírací značkou** komponenty, je dostupné jako `children`. Typ je `React.ReactNode`.

```tsx
type KartaProps = {
    children: React.ReactNode;
};

function Karta({ children }: KartaProps) {
    return <div className="karta">{children}</div>;
}

// Použití
<Karta>
    <h2>Nadpis</h2>
    <p>Obsah karty</p>
</Karta>
```

Ideální pro layouty (Modal, Card, Section): komponenta neví předem, co bude uvnitř.

### `React.ReactNode` typy

Typ `React.ReactNode` zahrnuje vše, co React umí vykreslit:

- JSX elementy (`<div>`, `<MujComponent />`)
- Stringy a čísla
- Pole jiných ReactNode
- `null`, `undefined`, `false` (nevykreslí nic)
- Fragment (`<>...</>`)

---

### Props jsou READ-ONLY

> **Props NIKDY nemodifikuj uvnitř komponenty.** TypeScript ti to navíc neumožní bez explicitní mutace.
> 

```tsx
// ❌ ŠPATNĚ: měnění props
function Pocitadlo({ pocet }: { pocet: number }) {
    pocet = pocet + 1;        // logická chyba (i když TS to dovolí)
    return <p>{pocet}</p>;
}

// ✓ SPRÁVNĚ: počítání ze vstupu (read-only)
function Pocitadlo({ pocet }: { pocet: number }) {
    const dalsi = pocet + 1;
    return <p>{dalsi}</p>;
}
```

Pokud potřebuješ měnit hodnotu, **použij `useState`** (lokální stav komponenty).

---

### `useState` s typy

```tsx
import { useState } from 'react';

// Typ se odvodí z výchozí hodnoty
const [pocet, setPocet] = useState(0);              // useState<number>
const [text, setText] = useState('');               // useState<string>
const [aktivni, setAktivni] = useState(false);      // useState<boolean>

// Když nelze odvodit (default null nebo prázdné pole) → explicitní typ
const [uzivatel, setUzivatel] = useState<User | null>(null);
const [polozky, setPolozky] = useState<string[]>([]);
const [filter, setFilter] = useState<'vse' | 'aktivni' | 'hotove'>('vse');
```

### Pravidla `useState`

- **Setter funkce NEMĚNÍ proměnnou přímo** (proto neudělá `pocet++`)
- **Setter spustí re-render** komponenty
- Aktualizace přes funkci pro spoléhání na starý stav:

```tsx
// ❌ Špatně (race condition)
const pridej = () => setPocet(pocet + 1);

// ✓ Lépe (vždy aktuální stav)
const pridej = () => setPocet(prev => prev + 1);
```

---

### Krátká zmínka o dalších hooks

> Pro úplnost, zkoušející může chtít.
> 

| Hook | K čemu |
| --- | --- |
| **`useState`** | Lokální stav komponenty |
| **`useEffect`** | Side effects (fetch, subscriptions, manuální DOM) |
| **`useRef`** | Reference na DOM element, nebo mutable value bez re-renderu |
| **`useMemo`** | Cache pro drahé výpočty |
| **`useCallback`** | Cache pro funkce (pro memoizaci) |
| **`useContext`** | Sdílený stav přes Context API |
| **`useReducer`** | Pro komplexní stav (jako Redux mini) |

```tsx
// useEffect: spustí se po každém renderu (defaultně)
useEffect(() => {
    fetch('/api/data')
        .then(r => r.json())
        .then(setData);
}, []);    // [] = jen jednou (po mountu)

// useRef: reference na input element
const inputRef = useRef<HTMLInputElement>(null);
// ... <input ref={inputRef} />
// ... inputRef.current?.focus();
```

---

### Datový tok: odshora dolů

Data tečou v Reactu **jednosměrně**: rodič → dítě (přes props). Dítě nemůže přímo měnit data rodiče.

```
[App]  ← drží stav (uzivatel)
  │
  │ props: uzivatel
  ▼
[Hlavicka]
  │
  │ props: uzivatel
  ▼
[UzivatelInfo]  → zobrazí jméno
```

**Co když dítě potřebuje změnit data rodiče?** → Rodič předá **callback funkci** jako prop. Dítě ji zavolá, rodič si změní svůj stav.

---

### Předávání callback funkcí (klíčové téma)

**Callback** = funkce předaná jako prop. Dítě ji zavolá, čímž "informuje" rodiče. V TS typujeme signaturu funkce.

```tsx
import { useState } from 'react';

// RODIČ: drží stav, předává callback dítěti
function App() {
    const [pocet, setPocet] = useState(0);

    const pridej = () => setPocet(pocet + 1);    // callback funkce

    return (
        <div>
            <p>Aktuálně: {pocet}</p>
            <Tlacitko onKlik={pridej} />          {/* předáno přes prop */}
        </div>
    );
}

// DÍTĚ: přijme typovaný callback v props
type TlacitkoProps = {
    onKlik: () => void;                           // funkce, nic nevrací
};

function Tlacitko({ onKlik }: TlacitkoProps) {
    return <button onClick={onKlik}>+1</button>;
}
```

### Předávání argumentu callbacku

```tsx
type Polozka = { id: number; nazev: string };

type SeznamProps = {
    polozky: Polozka[];
};

function Seznam({ polozky }: SeznamProps) {
    const smaz = (id: number) => {
        console.log('Smazat ID:', id);
    };

    return (
        <ul>
            {polozky.map(p => (
                <PolozkaItem key={p.id} polozka={p} onSmaz={smaz} />
            ))}
        </ul>
    );
}

type PolozkaItemProps = {
    polozka: Polozka;
    onSmaz: (id: number) => void;                  // funkce s argumentem
};

function PolozkaItem({ polozka, onSmaz }: PolozkaItemProps) {
    return (
        <li>
            {polozka.nazev}
            <button onClick={() => onSmaz(polozka.id)}>Smazat</button>
        </li>
    );
}
```

> **Klíčový chyták**: `onClick={onSmaz(polozka.id)}` je **chyba!** To by zavolalo funkci hned při renderu (vykreslení komponenty). Správně `onClick={() => onSmaz(polozka.id)}`: wrapping arrow funkcí znamená "zavolej to AŽ při kliknutí".
> 

```tsx
// ❌ ŠPATNĚ: zavolá smaz(1) při RENDERU, vrátí jeho návratovou hodnotu (undefined)
<button onClick={onSmaz(polozka.id)}>Smazat</button>

// ✓ SPRÁVNĚ: předá funkci, která se zavolá při kliknutí
<button onClick={() => onSmaz(polozka.id)}>Smazat</button>

// ✓ TAKY OK (bez argumentu): předá referenci
<button onClick={onSmaz}>Smazat</button>
```

---

### Typy event handlerů

```tsx
// Klik na tlačítko
<button onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
    console.log(e.currentTarget);
}}>OK</button>

// Změna inputu
<input onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
}} />

// Submit formuláře
<form onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
}}>
```

V praxi typ často **odvodíš automaticky**: pokud handler předáš inline jako `onClick={...}`, TS si typ doplní sám:

```tsx
<button onClick={(e) => {     // e je automaticky React.MouseEvent<HTMLButtonElement>
    console.log(e);
}}>OK</button>
```

> Typ explicitně píšeš jen když handler definuješ **mimo JSX** (jako samostatnou funkci nahoře).
> 

### Časté event typy

| Event | Typ |
| --- | --- |
| `onClick` | `React.MouseEvent<HTMLButtonElement>` |
| `onChange` (input) | `React.ChangeEvent<HTMLInputElement>` |
| `onChange` (select) | `React.ChangeEvent<HTMLSelectElement>` |
| `onSubmit` | `React.FormEvent<HTMLFormElement>` |
| `onKeyDown` | `React.KeyboardEvent<HTMLInputElement>` |
| `onFocus`/`onBlur` | `React.FocusEvent<HTMLInputElement>` |

---

### Lifting State Up (zvedání stavu nahoru)

Když 2 sourozenci potřebují sdílet data, **přesuň stav do jejich společného rodiče**.

```tsx
// SPRÁVNĚ: stav v rodiči, předaný oběma dětem
function App() {
    const [text, setText] = useState('');

    return (
        <>
            <Input hodnota={text} onZmena={setText} />
            <Vysledek text={text} />
        </>
    );
}

type InputProps = {
    hodnota: string;
    onZmena: (h: string) => void;
};

function Input({ hodnota, onZmena }: InputProps) {
    return (
        <input
            value={hodnota}
            onChange={e => onZmena(e.target.value)}
        />
    );
}

function Vysledek({ text }: { text: string }) {
    return <p>Napsáno: {text}</p>;
}
```

Bez liftingu by `Input` musel mít vlastní stav, ale `Vysledek` by k němu neměl přístup. Lifting umožní sdílení.

---

### Renderování seznamu (`map` + `key`)

```tsx
type Uzivatel = { id: number; jmeno: string };

type Props = { uzivatele: Uzivatel[] };

function SeznamUzivatelu({ uzivatele }: Props) {
    return (
        <ul>
            {uzivatele.map(u => (
                <li key={u.id}>{u.jmeno}</li>
            ))}
        </ul>
    );
}
```

> **`key` je povinný** atribut na nejvyšším elementu uvnitř `map`. React ho používá k **optimalizaci re-renderů** (reconciliation). Měl by být:
> 
> - **Unikátní** mezi sourozenci
> - **Stabilní** (nemění se mezi rendery, ne `Math.random()`)
> - Ideálně **id z dat** (ne index pole, pokud se seznam mění)

### Proč ne index jako klíč

```tsx
// ❌ Špatně, pokud se seznam mění
{polozky.map((p, index) => <li key={index}>{p.text}</li>)}

// ✓ Správně, pokud máš stabilní ID
{polozky.map(p => <li key={p.id}>{p.text}</li>)}
```

Index funguje, pokud seznam **nikdy nemění pořadí ani neodebírá prvky**. Když se mění (přidávání, odebírání, řazení), index jako klíč způsobí buggy chování (např. checkbox stavy zůstanou na špatných položkách).

---

### Podmíněné renderování

```tsx
function Pozdrav({ uzivatel }: { uzivatel: Uzivatel | null }) {
    // 1. if/else před returnem
    if (!uzivatel) {
        return <p>Načítám...</p>;
    }
    return <h1>Ahoj, {uzivatel.jmeno}!</h1>;
}

// 2. Ternární operátor v JSX
function Status({ online }: { online: boolean }) {
    return <p>{online ? '🟢 online' : '🔴 offline'}</p>;
}

// 3. Logické && (zobraz jen když true)
function Notifikace({ pocet }: { pocet: number }) {
    return (
        <div>
            Doručená pošta
            {pocet > 0 && <span>({pocet} nových)</span>}
        </div>
    );
}
```

> **Pozor na číslo 0 v `&&`**: `{pocet && <span>...</span>}` vykreslí "0" když je pocet = 0! Proto vždy explicit boolean: `{pocet > 0 && <span>...</span>}`.
> 

---

### Kompozice komponent

Komponenta může uvnitř používat jiné komponenty. Stačí je naimportovat.

```tsx
// components/Card.tsx
type CardProps = {
    title: string;
    children: React.ReactNode;
};

export function Card({ title, children }: CardProps) {
    return (
        <div className="card">
            <h2>{title}</h2>
            <div>{children}</div>
        </div>
    );
}
```

```tsx
// App.tsx
import { Card } from './components/Card';

function App() {
    return (
        <div>
            <Card title="Vítejte">
                <p>Toto je obsah karty.</p>
            </Card>
            <Card title="Druhá karta">
                <button>Klikni</button>
            </Card>
        </div>
    );
}
```

---

### Časté chyby

| Chyba | Důsledek | Řešení |
| --- | --- | --- |
| Jméno komponenty malým písmenem | React si myslí, že je to HTML element | Vždy velkým písmenem |
| Modifikace props | Bug, neočekávané chování | Použít useState |
| `onClick={fn()}` místo `onClick={fn}` | Funkce se zavolá při renderu, ne při kliku | `onClick={() => fn(arg)}` |
| Chybějící `key` v `map` | React warning, neefektivní renders | Vždy `key={item.id}` |
| Index jako key v měnícím se seznamu | Buggy state | Použít stabilní ID |
| Více kořenových elementů v komponentě | Syntax error | Obal v `<>...</>` (Fragment) |
| Stav v dítěti, který sourozenec taky potřebuje | Nelze sdílet | Lift state up |
| `{pocet && <X />}` kde pocet je 0 | Vykreslí se "0" | `{pocet > 0 && <X />}` |
| Mutace stavu (`array.push(x)`) | Re-render nenastane | Vytvořit nové pole `[...array, x]` |
| `useEffect` bez dependency array | Spustí se po každém renderu | `useEffect(() => {...}, [])` |
| `React.FC` | Implicit children, generika problém | Function declaration nebo arrow |

---

# Část 2: Praktická úloha

### Co může praktická úloha obsahovat

Typická úloha:

- **3 až 4 komponenty** rozdělené podle zodpovědnosti
- **TypeScript typing** props a stavu
- **Lifting state up**: stav v root komponentě
- **Callbacky** předávané dolů (`onPridej`, `onSmaz`...)
- **Renderování seznamu** s `map` + `key`
- **Podmíněné renderování** (prázdný seznam, hotový úkol)
- **Event handlers** (`onClick`, `onChange`, `onSubmit`)
- **`useState`** s explicitním typem

### Příklad zadání: TodoList

Vytvoř React + TypeScript aplikaci **TodoList** rozdělenou na komponenty:

- `App`: drží stav (seznam úkolů + textový vstup)
- `TodoForm`: formulář pro přidání nového úkolu
- `TodoList`: vykreslí seznam úkolů
- `TodoItem`: jeden úkol s tlačítkem hotovo + smazat

### Setup

```bash
npm create vite@latest todolist
cd todolist
npm install
npm run dev
```

Šablona `react-ts` vytvoří projekt s TypeScriptem a Reactem (.tsx soubory).

### Datový model

```tsx
// types.ts (nebo přímo v App.tsx)
export type Ukol = {
    id: number;          // unikátní (Date.now() nebo counter)
    text: string;
    hotovo: boolean;
};
```

### Řešení

### `App.tsx`

```tsx
import { useState } from 'react';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';

export type Ukol = {
    id: number;
    text: string;
    hotovo: boolean;
};

export default function App() {
    const [ukoly, setUkoly] = useState<Ukol[]>([
        { id: 1, text: 'Naučit se React', hotovo: false },
        { id: 2, text: 'Maturita', hotovo: false }
    ]);

    // Přidá nový úkol
    const pridatUkol = (text: string) => {
        const novyUkol: Ukol = {
            id: Date.now(),     // unikátní ID
            text: text,
            hotovo: false
        };
        setUkoly([...ukoly, novyUkol]);    // nové pole (immutability)
    };

    // Přepne hotovo
    const prepnoutHotovo = (id: number) => {
        setUkoly(ukoly.map(u =>
            u.id === id ? { ...u, hotovo: !u.hotovo } : u
        ));
    };

    // Smaže úkol
    const smazatUkol = (id: number) => {
        setUkoly(ukoly.filter(u => u.id !== id));
    };

    return (
        <div style={{ maxWidth: 600, margin: '2rem auto', padding: '1rem' }}>
            <h1>Můj TodoList</h1>
            <TodoForm onPridej={pridatUkol} />
            <TodoList
                ukoly={ukoly}
                onHotovo={prepnoutHotovo}
                onSmaz={smazatUkol}
            />
        </div>
    );
}
```

### `components/TodoForm.tsx`

```tsx
import { useState } from 'react';

type TodoFormProps = {
    onPridej: (text: string) => void;
};

export default function TodoForm({ onPridej }: TodoFormProps) {
    const [text, setText] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const trimnuty = text.trim();
        if (trimnuty === '') return;     // ignoruj prázdný

        onPridej(trimnuty);              // zavolej callback od rodiče
        setText('');                     // vyčisti input
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
            <input
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Co je třeba udělat?"
                style={{ padding: '0.5rem', marginRight: '0.5rem' }}
            />
            <button type="submit">Přidat</button>
        </form>
    );
}
```

### `components/TodoList.tsx`

```tsx
import { Ukol } from '../App';
import TodoItem from './TodoItem';

type TodoListProps = {
    ukoly: Ukol[];
    onHotovo: (id: number) => void;
    onSmaz: (id: number) => void;
};

export default function TodoList({ ukoly, onHotovo, onSmaz }: TodoListProps) {
    if (ukoly.length === 0) {
        return <p>Žádné úkoly.</p>;
    }

    return (
        <ul style={{ listStyle: 'none', padding: 0 }}>
            {ukoly.map(u => (
                <TodoItem
                    key={u.id}              // POVINNÝ key na nejvyšším elementu v map
                    ukol={u}
                    onHotovo={onHotovo}
                    onSmaz={onSmaz}
                />
            ))}
        </ul>
    );
}
```

### `components/TodoItem.tsx`

```tsx
import { Ukol } from '../App';

type TodoItemProps = {
    ukol: Ukol;
    onHotovo: (id: number) => void;
    onSmaz: (id: number) => void;
};

export default function TodoItem({ ukol, onHotovo, onSmaz }: TodoItemProps) {
    return (
        <li style={{
            padding: '0.5rem',
            borderBottom: '1px solid #eee',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
        }}>
            <input
                type="checkbox"
                checked={ukol.hotovo}
                onChange={() => onHotovo(ukol.id)}
            />
            <span style={{
                flex: 1,
                textDecoration: ukol.hotovo ? 'line-through' : 'none',
                color: ukol.hotovo ? '#888' : '#000'
            }}>
                {ukol.text}
            </span>
            <button onClick={() => onSmaz(ukol.id)}>
                ✕
            </button>
        </li>
    );
}
```

### Co se v řešení děje

**`App`** (root komponenta): drží `ukoly` stav. Definuje 3 callbacky:

- `pridatUkol(text)`: vytvoří `Ukol` objekt s ID `Date.now()` a přidá do pole **přes spread** (immutability!)
- `prepnoutHotovo(id)`: `map` přes pole, najde úkol s daným ID a překlopí `hotovo` (taky immutable, nové objekty)
- `smazatUkol(id)`: `filter` přes pole, ponechá jen ty s jiným ID

**`TodoForm`** má **vlastní lokální stav** (`text`) jen pro input. Při submitu zavolá callback `onPridej` (od rodiče) s aktuálním textem a vyčistí input. `e.preventDefault()` brání default form submitu (reload stránky).

**`TodoList`** je **stateless** (jen vykresluje, nemá vlastní stav). Předává callbacky dál do `TodoItem`. Klíčový detail: **`key={u.id}` je na `TodoItem`**, ne uvnitř. React potřebuje key na top-level elementu uvnitř `map`.

**`TodoItem`** taky **stateless**. Checkbox volá `onHotovo(ukol.id)`, tlačítko volá `onSmaz(ukol.id)`. `onChange={() => onHotovo(ukol.id)}` musí být wrapping arrow function (jinak by se zavolalo při renderu).

**Tok dat (callback flow)**:

```
Klik na checkbox v TodoItem
    ↓
onChange() volá onHotovo(ukol.id)
    ↓
onHotovo je callback z App
    ↓
App.prepnoutHotovo(id) změní stav přes setUkoly
    ↓
React re-renderuje App → TodoList → TodoItem (s novým hotovo)
```

**Immutability**: nikdy `ukoly.push()` nebo `ukol.hotovo = !ukol.hotovo`. Vždycky **vytvoř nové pole/objekt** (`[...ukoly, novy]`, `{...ukol, hotovo: !ukol.hotovo}`). React detekuje změny porovnáním referencí, mutace nezpůsobí re-render.

---

### Bonusy

### Bonus A: Filtr (Vše / Nehotové / Hotové)

```tsx
// V App.tsx
const [filter, setFilter] = useState<'vse' | 'nehotove' | 'hotove'>('vse');

const filtrovane = ukoly.filter(u => {
    if (filter === 'nehotove') return !u.hotovo;
    if (filter === 'hotove') return u.hotovo;
    return true;
});

return (
    <div>
        <h1>Můj TodoList</h1>
        <TodoForm onPridej={pridatUkol} />

        <div>
            <button onClick={() => setFilter('vse')}>Vše</button>
            <button onClick={() => setFilter('nehotove')}>Nehotové</button>
            <button onClick={() => setFilter('hotove')}>Hotové</button>
        </div>

        <TodoList ukoly={filtrovane} onHotovo={prepnoutHotovo} onSmaz={smazatUkol} />
    </div>
);
```

### Bonus B: Počet zbývajících

```tsx
// V App.tsx, nad TodoList
<p>Zbývá {ukoly.filter(u => !u.hotovo).length} úkolů</p>
```

### Bonus C: Vlastní `Tlacitko` komponenta

```tsx
// components/Tlacitko.tsx
type TlacitkoProps = {
    text: string;
    varianta?: 'primary' | 'danger';
    onClick: () => void;
};

export default function Tlacitko({ text, varianta = 'primary', onClick }: TlacitkoProps) {
    const styly = {
        primary: { background: 'blue', color: 'white' },
        danger: { background: 'red', color: 'white' }
    };

    return (
        <button onClick={onClick} style={{ ...styly[varianta], padding: '0.5rem' }}>
            {text}
        </button>
    );
}
```

### Bonus D: Edit režim (dvojklik na text)

```tsx
// V TodoItem.tsx
const [editujem, setEditujem] = useState(false);
const [editText, setEditText] = useState(ukol.text);

const ulozit = () => {
    onZmen(ukol.id, editText);    // další callback z rodiče
    setEditujem(false);
};

return (
    <li>
        {editujem ? (
            <input
                value={editText}
                onChange={e => setEditText(e.target.value)}
                onBlur={ulozit}
                onKeyDown={e => e.key === 'Enter' && ulozit()}
                autoFocus
            />
        ) : (
            <span onDoubleClick={() => setEditujem(true)}>
                {ukol.text}
            </span>
        )}
    </li>
);
```

---

## Část 3: Tipy pro obhajobu

### Co u obhajoby říct

> *"V zadání jsem rozdělil TodoList na 4 komponenty: App, TodoForm, TodoList a TodoItem. App je root komponenta s celým stavem, ostatní jsou stateless a dostávají data přes props. Pro každou komponentu jsem definoval type Props se signaturami callbacků: onPridej je funkce string → void, onHotovo a onSmaz jsou číslo → void. Stav drží App, dětem předává jak data (ukoly), tak funkce pro modifikaci. Tohle je classic pattern Lifting State Up: stav patří do společného rodiče. Při změně volá dítě callback od rodiče, ne přímo modifikuje. Důležitý detail: v map() je key na TodoItem, ne uvnitř, jinak React vyhodí warning. Použil jsem ukol.id jako key, ne index, protože seznam se může měnit. Pro immutability používám spread operator a map/filter, ne push nebo přímé přiřazení, jinak by React nezachytil změnu."*
> 

### Klíčové pojmy pro teorii

| Pojem | Rychlá odpověď |
| --- | --- |
| **React** | Knihovna pro UI, komponentová architektura, deklarativní |
| **Komponenta** | Znovupoužitelný stavební blok UI, funkce vracející JSX |
| **JSX** | TypeScript/JavaScript v HTML, v `.tsx` souborech |
| **Funkcionální vs třídní** | Moderní = funkcionální (od 2019, hooks) |
| **`React.FC`** | Starý styl, dnes nedoporučovaný |
| **Props** | Vstupní data komponenty (read-only) |
| **`children`** | Speciální prop pro obsah mezi značkami (`React.ReactNode`) |
| **`useState`** | Hook pro lokální stav komponenty |
| **`useEffect`** | Hook pro side effects (fetch, subscriptions) |
| **Callback prop** | Funkce předaná jako prop, dítě ji volá k informování rodiče |
| **Lifting State Up** | Přesunutí stavu do společného rodiče sourozenců |
| **`map` + `key`** | Renderování seznamu, key je povinný atribut |
| **Reconciliation** | React algoritmus pro detekci změn, používá keys |
| **Immutability** | Vytvoř nové objekty/pole, nemodifikuj přímo |
| **Fragment `<>...</>`** | Wrapper pro víc elementů bez vlastního DOM |
| **Event handlers** | `onClick`, `onChange`, `onSubmit`, typované přes `React.X.Event` |
| **Jednosměrný tok dat** | Data tečou rodič → dítě, ne obráceně |
| **Re-render** | Komponenta se znovu vykreslí při změně stavu/props |
| **Virtual DOM** | React's vnitřní reprezentace, efektivní DOM updaty |

### Časté chytáky

| Otázka | Odpověď |
| --- | --- |
| *Co je komponenta?* | Znovupoužitelný stavební blok UI. TypeScript funkce, která vrací JSX. Soubor s příponou `.tsx`. |
| *Proč velké písmeno?* | React rozliší tvoji komponentu od HTML elementu. `<div>` je HTML, `<Div>` by byl tvůj component. |
| *Co jsou props?* | Vstupní data komponenty, jednosměrný tok rodič → dítě. Read-only. V TS vždy typované. |
| *Proč jsou props read-only?* | Aby byl tok dat předvídatelný. Pokud potřebuješ změnit hodnotu, použij useState. |
| *Jak dítě informuje rodiče?* | Rodič předá funkci jako prop, dítě ji zavolá. Tomu se říká callback prop. |
| *Proč `onClick={fn}` a ne `onClick={fn()}`?* | Bez závorek = předáš referenci na funkci, zavolá se při kliknutí. Se závorkami = zavoláš ji hned při renderu. |
| *Co je `children`?* | Speciální prop pro obsah mezi otevírací a uzavírací značkou komponenty. Typ `React.ReactNode`. |
| *Co je Lifting State Up?* | Když dvě komponenty potřebují sdílet data, přesunu stav do jejich společného rodiče. |
| *Proč `key` v `map()`?* | React ho používá pro reconciliation (porovnání stavů mezi rendery). Musí být unikátní a stabilní. |
| *Proč ne index jako key?* | Pokud se seznam mění (přidávání, odebírání, řazení), index změní význam a React zachová stav na špatných položkách. |
| *Co je immutability?* | Nikdy nemodifikuj stav přímo (push, přiřazení). Vytvoř nové pole/objekt. React detekuje změny porovnáním referencí. |
| *Funkcionální vs třídní komponenta?* | Funkcionální = moderní, s hooks. Třídní = legacy. Pro novou práci vždy funkcionální. |

### Časté chyby v praktické úloze

- Jméno komponenty malým písmenem (`todoForm` místo `TodoForm`)
- Stav v `TodoItem`, sourozenec `TodoForm` ho nevidí (chybí lift up)
- `onClick={onSmaz(ukol.id)}` (zavolá se při renderu) místo `onClick={() => onSmaz(ukol.id)}`
- Chybějící `key` v `map` (React warning)
- `key` uvnitř komponenty místo na top-level v `map` (nefunkční)
- Index jako `key` v měnícím se seznamu (buggy state)
- `ukoly.push(novy)` místo `setUkoly([...ukoly, novy])` (re-render nenastane)
- `ukol.hotovo = !ukol.hotovo` místo `{...ukol, hotovo: !ukol.hotovo}`
- Chybějící `e.preventDefault()` v `onSubmit` (form reloaduje stránku)
- Chybějící typování props v TS (zbytečně any)
- `React.FC<Props>` místo function declaration (deprecated pattern)
- Předávání všech callbacků individuálně místo objektu (kosmetika)
- Modifikace `props.X = ...` (logická chyba, props jsou read-only)
- Více kořenových elementů v komponentě (bez Fragmentu)
- `useState` setter nečekaně synchronní? (není, plánuje re-render)