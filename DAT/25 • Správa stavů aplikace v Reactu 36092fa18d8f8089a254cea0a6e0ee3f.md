# 25 • Správa stavů aplikace v Reactu

> 
> 
> 
> useContext, useReducer, správa stavů složitější aplikace
> 

> **Formát:** 30 min praktická úloha, 15 min obhajoba + teorie. Teorie pokrývá `useState`, `useReducer`, `useContext` a jejich kombinaci. Praktika: e-shop s košíkem postaveným na Context + Reducer patternu.
> 

https://xn--hga.vercel.app/

---

# Část 1: Teorie

### Co je "stav" a proč je správa důležitá

**Stav (state)** jsou jakákoliv data, která se mohou v čase měnit a ovlivňují to, co uživatel vidí (přihlášený uživatel, položky košíku, otevřený modal, theme, formulářová data, načtené API výsledky a další).

V Reactu existuje **několik úrovní**, kde stav může žít:

| Úroveň | Kde žije | K čemu |
| --- | --- | --- |
| **Lokální** | Jedna komponenta (`useState`) | Input formuláře, otevření menu, hover stav |
| **Lifted** | Rodič dvou komponent | Sdílená data mezi sourozenci |
| **Globální** | Celá aplikace (`useContext` + Reducer / Zustand / Redux) | Uživatel, theme, košík, jazyk |
| **Server state** | Data z backendu (cache, refetch) | Seznam produktů, profil uživatele |

S rostoucí aplikací se zvyšuje **složitost stavu**. Ručně předávat props 5 úrovní hluboko (**props drilling**) je špatné. Pak nastupuje **Context API** nebo **useReducer**.

---

### `useState`: lokální stav (rekapitulace)

```tsx
const [pocet, setPocet] = useState(0);
const [text, setText] = useState('');
```

Vhodné pro **jednoduché, izolované hodnoty**. Funguje skvěle, když:

- Stav patří jedné komponentě (max. 1-2 dětem přes props)
- Hodnota je primitivní (string, number, boolean) nebo malý objekt
- Změny jsou jednoduché (`set(novaHodnota)`)

Začíná to být **nepřehledné** když:

- Máš 5+ `useState` v jedné komponentě, které spolu souvisí
- Změna jednoho stavu ovlivňuje další (komplexní logika v handlerech)
- Sdílíš stav přes mnoho úrovní komponent (props drilling)

---

### `useReducer`: komplexní stav s jasnými akcemi

`useReducer` je alternativa k `useState` pro **komplexnější stav**. Inspirováno Reduxem. Stav se mění **pouze přes akce** zpracované **reducerem** (čistá funkce).

```tsx
import { useReducer } from 'react';

// 1. STAV: typ tvého stavu
type State = { pocet: number };

// 2. AKCE: všechny možné typy akcí (union type)
type Action =
    | { type: 'PRIDEJ' }
    | { type: 'UBER' }
    | { type: 'NASTAV'; hodnota: number }
    | { type: 'RESET' };

// 3. REDUCER: čistá funkce (state, action) => new state
function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'PRIDEJ':  return { pocet: state.pocet + 1 };
        case 'UBER':    return { pocet: state.pocet - 1 };
        case 'NASTAV':  return { pocet: action.hodnota };
        case 'RESET':   return { pocet: 0 };
    }
}

// 4. POUŽITÍ V KOMPONENTĚ
function Pocitadlo() {
    const [state, dispatch] = useReducer(reducer, { pocet: 0 });

    return (
        <div>
            <p>Počet: {state.pocet}</p>
            <button onClick={() => dispatch({ type: 'PRIDEJ' })}>+</button>
            <button onClick={() => dispatch({ type: 'UBER' })}>-</button>
            <button onClick={() => dispatch({ type: 'NASTAV', hodnota: 67 })}>Set 67</button>
            <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
        </div>
    );
}
```

### Anatomie

![{07108413-4D03-4E25-90F8-C54B4E7EE3E7}.png](25%20%E2%80%A2%20Spr%C3%A1va%20stav%C5%AF%20aplikace%20v%20Reactu/07108413-4D03-4E25-90F8-C54B4E7EE3E7.png)

> **"Čistá funkce"** znamená: stejný vstup → stejný výstup, žádné side effects (no `fetch`, no `setTimeout`, no logging). Reducer **musí být** čistá funkce, jinak se rozbije čas (např. StrictMode v dev modu spouští reducery 2x na test čistoty).
> 

### Vysvětlení

1. useReducer hook se rozloží na `[state, dispatch]`state je ta proměnná, která se bude vykreslovat v DOMu a `dispatch` je funkce, která posílá do `semaforu` action
2. Kliknutím na tlačítko se zavolá `dispatch(Action)`. Ten pošle action do naší fce `reducer`
3. `reducer` na základě actionu změní state a vrátí ho
4. `state` se aktualizuje a zobrazí se v DOMu

---

### `useState` vs `useReducer`

|  | `useState` | `useReducer` |
| --- | --- | --- |
| **Pro** | Jednoduché hodnoty (string, number, malý objekt) | Komplexní stav (objekty, pole) |
| **Logika změny** | Inline v handleru `setX(...)` | Centralizovaná v reduceru |
| **Akce** | Nepojmenované (`setPocet(5)`) | Pojmenované (`{ type: 'NASTAV' }`) |
| **Testovatelnost** | Těžší, logika je rozprostřená | Snadná, reducer je čistá funkce |
| **Boilerplate** | Minimální | Větší (typy + reducer + dispatch) |
| **Čitelnost při růstu** | Klesá s počtem stavů | Konstantní, všechny změny na jednom místě |
| **DevTools podpora** | Žádná | Lze logovat všechny akce |

### Kdy `useReducer`

**Použij,** když:

- Stav je **objekt s více poli** která se mění společně
- Máš **5+ různých typů změn** (přidat/ubrat/reset/nastavit/přepnout...)
- Změny **závisí na jiných polích** stavu
- Chceš **logování / debug** akcí (všechny dispatch projdou jedním místem)
- Chceš **historii akcí** (undo/redo)

**Nepoužívej,** když:

- Stav je jeden boolean nebo primitivní hodnota
- Změny jsou jednoduché (`setText(e.target.value)`)
- Komponenta je malá

### Konkrétní příklad: kdy přechod z useState na useReducer dává smysl

```tsx
// Před: 5 useState, logika rozprostřená
const [polozky, setPolozky] = useState<Polozka[]>([]);
const [text, setText] = useState('');
const [filtr, setFiltr] = useState('vse');
const [edituji, setEdituji] = useState<number | null>(null);
const [chyba, setChyba] = useState('');

// Změna jedné věci často mění víc stavů → handler je dlouhý

// Po: jeden useReducer, jasné akce
type State = {
    polozky: Polozka[];
    text: string;
    filtr: 'vse' | 'hotove' | 'nehotove';
    edituji: number | null;
    chyba: string;
};

type Action =
    | { type: 'PRIDEJ_POLOZKU' }
    | { type: 'NASTAV_TEXT'; hodnota: string }
    | { type: 'NASTAV_FILTR'; hodnota: State['filtr'] }
    | { type: 'ZACNI_EDITOVAT'; id: number }
    | { type: 'ULOZ_EDIT'; id: number; text: string }
    | { type: 'SMAZ_POLOZKU'; id: number };
```

---

### Context API: globální stav bez props drilling

**Context** je mechanismus pro **sdílení dat napříč komponentovým stromem** bez nutnosti je předávat přes props na každé úrovni.

### Problém: props drilling

```
[App] (uzivatel)
  ├── [Header] (uzivatel: propaguje dál)
  │   └── [UserMenu] (uzivatel: konečně použito)
  └── [Main] (uzivatel: propaguje dál)
      └── [ProfilePage] (uzivatel: konečně použito)
```

`Header` a `Main` nepotřebují uzivatele, jen ho propagují. **Context to obejde.**

### Řešení: 3 kroky

**1. Vytvoř Context (`createContext`)**

```tsx
// contexts/UserContext.tsx
import { createContext } from 'react';

type User = { id: number; jmeno: string };

type UserContextValue = {
    user: User | null;
    prihlasit: (u: User) => void;
    odhlasit: () => void;
};

// Default hodnota: nikdy se nepoužije, pokud máš Provider
export const UserContext = createContext<UserContextValue | null>(null);
```

**2. Obal aplikaci v `Provider`**

```tsx
// contexts/UserProvider.tsx
import { useState, ReactNode } from 'react';
import { UserContext } from './UserContext';

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    const prihlasit = (u: User) => setUser(u);
    const odhlasit = () => setUser(null);

    return (
        <UserContext.Provider value={{ user, prihlasit, odhlasit }}>
            {children}
        </UserContext.Provider>
    );
}

// V App.tsx
<UserProvider>
    <App />
</UserProvider>
```

**3. Použij `useContext` v dítěti**

```tsx
import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';

function UserMenu() {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error('UserMenu musí být uvnitř UserProvider');

    const { user, odhlasit } = ctx;

    if (!user) return <p>Nepřihlášen</p>;

    return (
        <div>
            Ahoj, {user.jmeno}
            <button onClick={odhlasit}>Odhlásit</button>
        </div>
    );
}
```

### Custom hook pattern (čistší)

```tsx
// contexts/UserContext.tsx
import { useContext } from 'react';

export function useUser() {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error('useUser musí být uvnitř UserProvider');
    return ctx;
}

// V komponentě
const { user, odhlasit } = useUser();   // jednodušší, typově bezpečné
```

**Výhody custom hooku**:

- **Null-check na jednom místě** (ne v každé komponentě)
- **Typově bezpečné** (`ctx` po null-check je `UserContextValue`)
- **Snadno refactorovatelné** (změna implementace v hook ovlivní jen jedno místo)

---

### React 19 a `use()` hook

> Drobnost pro extra body u zkoušejícího.
> 

V **Reactu 19** (vyšlo prosinec 2024) přibyl nový hook **`use()`**, který je flexibilnější náhradou za `useContext`:

```tsx
import { use } from 'react';

// Místo useContext:
const ctx = useContext(UserContext);

// Můžeš použít use() (React 19+):
const ctx = use(UserContext);
```

**Rozdíl**: `use()` lze volat **podmíněně** (v `if` bloku), což `useContext` neumí (porušuje pravidla hooks). Plus `use()` umí i Promises (await přímo v komponentě, pro Server Components).

Pro maturitu klidně zmiňuj `useContext`, ale **dobré vědět, že `use()` existuje** jako modernější alternativa.

---

### `useContext` + `useReducer` = malý Redux

Kombinace Contextu (sdílení) a Reduceru (správa změn) dává **globální správu stavu** bez externí knihovny.

```tsx
// contexts/CartContext.tsx
import { createContext, useReducer, useContext, ReactNode, Dispatch } from 'react';

type Polozka = { id: number; nazev: string; mnozstvi: number };
type State = { polozky: Polozka[] };
type Action =
    | { type: 'PRIDEJ'; polozka: Polozka }
    | { type: 'ODEBER'; id: number }
    | { type: 'VYPRAZDNI' };

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'PRIDEJ':    return { polozky: [...state.polozky, action.polozka] };
        case 'ODEBER':    return { polozky: state.polozky.filter(p => p.id !== action.id) };
        case 'VYPRAZDNI': return { polozky: [] };
    }
}

const CartContext = createContext<{
    state: State;
    dispatch: Dispatch<Action>;
} | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(reducer, { polozky: [] });
    return (
        <CartContext.Provider value={{ state, dispatch }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart musí být uvnitř CartProvider');
    return ctx;
}
```

Použití:

```tsx
function ProduktKarta({ produkt }: { produkt: Polozka }) {
    const { dispatch } = useCart();
    return (
        <button onClick={() => dispatch({ type: 'PRIDEJ', polozka: produkt })}>
            Přidat do košíku
        </button>
    );
}

function Kosik() {
    const { state, dispatch } = useCart();
    return (
        <ul>
            {state.polozky.map(p => (
                <li key={p.id}>
                    {p.nazev}
                    <button onClick={() => dispatch({ type: 'ODEBER', id: p.id })}>×</button>
                </li>
            ))}
        </ul>
    );
}
```

---

### Performance: Context re-render warning

> Klasický interview chyták, dobré znát.
> 

**Každá změna v Context hodnotě překreslí všechny komponenty, které ji čtou** přes `useContext`. Pokud je tvůj Context obrovský a obsahuje hodně dat, můžou nastat zbytečné re-rendery.

```tsx
// ❌ Špatně: jeden velký Context pro celou aplikaci
const AppContext = createContext({
    user: null,
    cart: [],
    theme: 'light',
    notifications: []
});
// Když změníš theme, překreslí se i komponenta, která čte jen user!
```

**Řešení**:

1. **Rozdělit na víc Contextů** (`UserContext`, `CartContext`, `ThemeContext`)
2. **Použít `useMemo`** pro hodnotu Provideru, pokud obsahuje objekty/funkce
3. **Knihovny jako Zustand**, které tohle řeší přes "selector" pattern

```tsx
// Lepší: rozdělené Contexty
<UserProvider>
    <CartProvider>
        <ThemeProvider>
            <App />
        </ThemeProvider>
    </CartProvider>
</UserProvider>
```

---

### Alternativy pro velké aplikace

Když Context + Reducer začne být nepřehledný a perf neudržitelná, dá se sáhnout po:

| Knihovna | Filozofie | Velikost | Učení |
| --- | --- | --- | --- |
| **Zustand** | Minimalistický, hook-based, selectory | Velmi malá (~1 KB) | Snadné |
| **Redux Toolkit** | Klasika, single store, akce, immer | Větší | Středně-pokročilé |
| TanStack Query | Server state (fetch, cache, refetch) | Středně | Snadné |
| Jotai | Atomic state, podobné Recoilu | Malá | Středně |
| MobX | Reactive state, automatické sledování | Středně | Středně |

> Pro maturitu **stačí Context + Reducer**. Tyhle knihovny zmiňuj jen pokud chceš show off, že znáš ekosystém.
> 

---

### Přehled: kdy co použít

| Situace | Řešení |
| --- | --- |
| Hodnota v jedné komponentě | `useState` |
| Sdílená mezi sourozenci | Lift state up + props |
| Komplexní stav s mnoha akcemi | `useReducer` |
| Globální stav (uživatel, theme) přístupný odkudkoliv | `useContext` |
| Globální komplexní stav (košík) | `useContext` + `useReducer` |
| Server data, cache, refetching | TanStack Query, SWR |
| Velmi velká aplikace | Zustand, Redux Toolkit, Jotai |

---

### Časté chyby

| Chyba | Důsledek | Řešení |
| --- | --- | --- |
| Context bez Provideru | `useContext` vrátí null, crash | Vždy null-check nebo custom hook |
| Mutace stavu v reduceru | React nezjistí změnu | Vrátit nový objekt (`{...state, ...}`) |
| Side effects v reduceru | Nečistá funkce, bug v StrictMode | Side effects do `useEffect` nebo handleru |
| Příliš velký Context | Zbytečné re-rendery | Rozdělit na víc Contextů |
| Forgotten `dispatch` import | Crash | `Dispatch` type z 'react' |
| `useState` všude místo `useReducer` | Nepřehledné při růstu | useReducer pro 5+ akcí |
| `useContext` mimo Provider | null context | Custom hook s error |
| Action bez payload typu | TS nepozná, co očekává | Diskriminované union types |
| Mutace v `case 'PRIDEJ'` přes `push` | Stav se nezmění | `[...state.polozky, novy]` |

---

# Část 2: Praktická úloha

### Co může praktická úloha obsahovat

Podle informací z minulých let bude úloha typicky **vyplnit Context Provider** s reducerem a aplikovat `useContext` v komponentách. To znamená:

- **Vytvořit Context** s typed hodnotou
- **Custom Provider** komponenta wrappující `useReducer`
- **Custom hook** `useCart()` (nebo podobně) s null-check
- **Reducer** s 4+ akcemi (PRIDEJ, ODEBER, ZMEN_MNOZSTVI, VYPRAZDNI)
- **Použít `useContext`** v komponentách (3+ úrovně hluboko)
- **Vysvětlit `useReducer` vs `useState`** u obhajoby

### Příklad zadání: Košík s Context + Reducer

Aplikace mini e-shop s košíkem rozdělená na komponenty. Stav košíku **musí být dostupný napříč komponentami** přes Context. Logika košíku (přidat/odebrat/změnit množství) je v reducer funkci.

### Datový model

```tsx
// types.ts
export type Produkt = {
    id: number;
    nazev: string;
    cena: number;
};

export type Polozka = Produkt & {
    mnozstvi: number;
};
```

### Struktura komponent

```
<App>
  └── <CartProvider>          ← Context Provider
        └── <Layout>
              ├── <Header>
              │     └── <CartIcon />     ← useContext (počet)
              └── <Main>
                    ├── <ProduktList>
                    │     └── <ProduktCard />  ← useContext (dispatch PRIDEJ)
                    └── <Kosik>          ← useContext (state + dispatch)
```

### Řešení

### `contexts/CartContext.tsx`

```tsx
import {
    createContext,
    useContext,
    useReducer,
    ReactNode,
    Dispatch
} from 'react';
import { Polozka, Produkt } from '../types';

// ===== STATE =====
type State = { polozky: Polozka[] };

// ===== AKCE =====
type Action =
    | { type: 'PRIDEJ'; produkt: Produkt }
    | { type: 'ODEBER'; id: number }
    | { type: 'ZMEN_MNOZSTVI'; id: number; mnozstvi: number }
    | { type: 'VYPRAZDNI' };

// ===== REDUCER =====
function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'PRIDEJ': {
            // Najdi, jestli produkt už v košíku je
            const existujici = state.polozky.find(p => p.id === action.produkt.id);

            if (existujici) {
                // Zvyš množství
                return {
                    polozky: state.polozky.map(p =>
                        p.id === action.produkt.id
                            ? { ...p, mnozstvi: p.mnozstvi + 1 }
                            : p
                    )
                };
            }

            // Přidej nový s mnozstvi: 1
            return {
                polozky: [...state.polozky, { ...action.produkt, mnozstvi: 1 }]
            };
        }

        case 'ODEBER': {
            return {
                polozky: state.polozky.filter(p => p.id !== action.id)
            };
        }

        case 'ZMEN_MNOZSTVI': {
            // Pokud mnozstvi <= 0, odeber položku
            if (action.mnozstvi <= 0) {
                return {
                    polozky: state.polozky.filter(p => p.id !== action.id)
                };
            }

            // Jinak nastav nové množství
            return {
                polozky: state.polozky.map(p =>
                    p.id === action.id ? { ...p, mnozstvi: action.mnozstvi } : p
                )
            };
        }

        case 'VYPRAZDNI': {
            return { polozky: [] };
        }
    }
}

// ===== CONTEXT =====
type CartContextValue = {
    state: State;
    dispatch: Dispatch<Action>;
};

const CartContext = createContext<CartContextValue | null>(null);

// ===== PROVIDER =====
export function CartProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(reducer, { polozky: [] });

    return (
        <CartContext.Provider value={{ state, dispatch }}>
            {children}
        </CartContext.Provider>
    );
}

// ===== CUSTOM HOOK =====
export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) {
        throw new Error('useCart musí být uvnitř CartProvider');
    }
    return ctx;
}
```

### `App.tsx`

```tsx
import { CartProvider } from './contexts/CartContext';
import Layout from './components/Layout';

export default function App() {
    return (
        <CartProvider>
            <Layout />
        </CartProvider>
    );
}
```

### `components/Layout.tsx`

```tsx
import Header from './Header';
import ProduktList from './ProduktList';
import Kosik from './Kosik';

export default function Layout() {
    return (
        <div>
            <Header />
            <main style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr',
                gap: '1rem',
                padding: '1rem'
            }}>
                <ProduktList />
                <Kosik />
            </main>
        </div>
    );
}
```

### `components/Header.tsx` (s `CartIcon`)

```tsx
import { useCart } from '../contexts/CartContext';

function CartIcon() {
    const { state } = useCart();
    // Spočítej celkové množství všech položek
    const pocet = state.polozky.reduce((s, p) => s + p.mnozstvi, 0);

    return <span>🛒 {pocet}</span>;
}

export default function Header() {
    return (
        <header style={{
            background: '#333',
            color: 'white',
            padding: '1rem',
            display: 'flex',
            justifyContent: 'space-between'
        }}>
            <h1>Mini e-shop</h1>
            <CartIcon />
        </header>
    );
}
```

### `components/ProduktList.tsx`

```tsx
import { useCart } from '../contexts/CartContext';
import { Produkt } from '../types';

const PRODUKTY: Produkt[] = [
    { id: 1, nazev: 'Notebook', cena: 25000 },
    { id: 2, nazev: 'Myš', cena: 350 },
    { id: 3, nazev: 'Klávesnice', cena: 1200 }
];

function ProduktCard({ produkt }: { produkt: Produkt }) {
    const { dispatch } = useCart();

    return (
        <div style={{
            border: '1px solid #ccc',
            padding: '1rem',
            marginBottom: '0.5rem'
        }}>
            <h3>{produkt.nazev}</h3>
            <p>{produkt.cena} Kč</p>
            <button onClick={() => dispatch({ type: 'PRIDEJ', produkt })}>
                Přidat do košíku
            </button>
        </div>
    );
}

export default function ProduktList() {
    return (
        <div>
            <h2>Produkty</h2>
            {PRODUKTY.map(p => <ProduktCard key={p.id} produkt={p} />)}
        </div>
    );
}
```

### `components/Kosik.tsx`

```tsx
import { useCart } from '../contexts/CartContext';

export default function Kosik() {
    const { state, dispatch } = useCart();

    if (state.polozky.length === 0) {
        return (
            <aside style={{ padding: '1rem', background: '#f5f5f5' }}>
                <h2>Košík</h2>
                <p>Košík je prázdný</p>
            </aside>
        );
    }

    // Celková cena
    const celkem = state.polozky.reduce(
        (s, p) => s + p.cena * p.mnozstvi,
        0
    );

    return (
        <aside style={{ padding: '1rem', background: '#f5f5f5' }}>
            <h2>Košík</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {state.polozky.map(p => (
                    <li key={p.id} style={{ marginBottom: '0.5rem' }}>
                        <div>{p.nazev}</div>
                        <div>
                            <input
                                type="number"
                                min={0}
                                value={p.mnozstvi}
                                onChange={e => dispatch({
                                    type: 'ZMEN_MNOZSTVI',
                                    id: p.id,
                                    mnozstvi: Number(e.target.value)
                                })}
                                style={{ width: 60 }}
                            />
                            <span> × {p.cena} Kč</span>
                            <button onClick={() => dispatch({ type: 'ODEBER', id: p.id })}>
                                ×
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            <p><strong>Celkem: {celkem} Kč</strong></p>
            <button onClick={() => dispatch({ type: 'VYPRAZDNI' })}>
                Vyprázdnit
            </button>
        </aside>
    );
}
```

### Co se v řešení děje

**`CartContext.tsx`**: Centrální soubor pro celý košík.

1. `State` a `Action` definice s diskriminovaným union typem (`type: 'PRIDEJ' | 'ODEBER' | ...`)
2. **Reducer** je čistá funkce. PRIDEJ má vnitřní logiku: kontroluje, jestli produkt už v košíku je. Pokud ano, zvýší množství, pokud ne, přidá s mnozstvi=1.
3. **ZMEN_MNOZSTVI** automaticky odebere položku, pokud množství klesne na 0 nebo méně. Tahle "smart" logika v reduceru je důvod, proč je `useReducer` lepší než `useState`: kdyby to byl `useState`, musel bys mít tu logiku v komponentě.
4. **Immutability všude**: `[...state.polozky, ...]`, `state.polozky.map(p => p.id === action.id ? {...p, mnozstvi: ...} : p)`, `state.polozky.filter(...)`. Žádné `.push`, žádné `p.mnozstvi = ...`.
5. **CartProvider** wrappuje `useReducer` do Contextu.
6. **`useCart` custom hook** s error pokud chybí Provider.

**`App.tsx`**: `CartProvider` obaluje `Layout`. Vše uvnitř má přístup k košíku.

**`CartIcon`**: 3 úrovně hluboko (`App > CartProvider > Layout > Header > CartIcon`), používá `useCart` přímo, žádné props drilling. Spočítá `reduce` celkové množství.

**`ProduktCard`**: volá `dispatch({ type: 'PRIDEJ', produkt })`. Reducer rozhodne, jestli přidat nový nebo zvýšit existující.

**`Kosik`**: čte `state` (zobrazení) i `dispatch` (akce). Input pro množství volá `ZMEN_MNOZSTVI`.

**Proč to není props drilling**: `App` ani `Layout` ani `Main` nepotřebuje znát košík. Pouze komponenty, které ho fakt používají (`CartIcon`, `ProduktCard`, `Kosik`), si ho přes `useCart` vyžádají. Krása Contextu.

---

### Bonusy

### Bonus A: Persist do localStorage

```tsx
// V CartProvider:
import { useEffect } from 'react';

export function CartProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(reducer, { polozky: [] });

    // Load při mount
    useEffect(() => {
        const saved = localStorage.getItem('cart');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                // Custom action pro načtení (nebo dispatch víc akcí)
                data.polozky?.forEach((p: Polozka) => {
                    // Hack: přidej každou položku zvlášť
                    // Lepší: přidat action 'NACTI' do reduceru
                });
            } catch {
                // poškozená data, ignoruj
            }
        }
    }, []);

    // Save při změně
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(state));
    }, [state]);

    return (
        <CartContext.Provider value={{ state, dispatch }}>
            {children}
        </CartContext.Provider>
    );
}
```

### Bonus B: `useReducer` 3. argument (init function)

> Tohle je čistší řešení pro persist než Bonus A. Init function se spustí jen jednou.
> 

```tsx
// Init function, načte z localStorage
function init(): State {
    const saved = localStorage.getItem('cart');
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch {
            return { polozky: [] };
        }
    }
    return { polozky: [] };
}

export function CartProvider({ children }: { children: ReactNode }) {
    // 3. argument: init function (spustí se jen jednou)
    const [state, dispatch] = useReducer(reducer, undefined as unknown as State, init);

    // Save při změně
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(state));
    }, [state]);

    return (
        <CartContext.Provider value={{ state, dispatch }}>
            {children}
        </CartContext.Provider>
    );
}
```

### Bonus C: `useMemo` pro celkovou cenu

```tsx
import { useMemo } from 'react';

export default function Kosik() {
    const { state, dispatch } = useCart();

    // Memoized: přepočítá se jen když se polozky změní
    const celkem = useMemo(
        () => state.polozky.reduce((s, p) => s + p.cena * p.mnozstvi, 0),
        [state.polozky]
    );

    // ... rest
}
```

Pro malý košík to není critical, ale pokud bys měl 1000+ položek, `useMemo` zabrání zbytečnému přepočítávání při každém renderu.

### Bonus D: Druhý Context (Theme)

```tsx
// contexts/ThemeContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

const ThemeContext = createContext<{
    theme: Theme;
    toggle: () => void;
} | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>('light');
    const toggle = () => setTheme(t => t === 'light' ? 'dark' : 'light');

    return (
        <ThemeContext.Provider value={{ theme, toggle }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme musí být uvnitř ThemeProvider');
    return ctx;
}
```

```tsx
// App.tsx: víc Providerů zanořených
<ThemeProvider>
    <CartProvider>
        <Layout />
    </CartProvider>
</ThemeProvider>
```

Demonstruje: Contexty se **neslučují**, máš jich kolik chceš, každý pro jinou doménu.

---

## Část 3: Tipy pro obhajobu

### Co u obhajoby říct

> *"V zadání jsem postavil mini e-shop s košíkem postaveným na patternu Context + Reducer. CartContext je vytvořený přes createContext s typovanou hodnotou state plus dispatch. CartProvider wrappuje useReducer a poskytuje stav všem dětem. Reducer je čistá funkce, která má 4 akce: PRIDEJ chytře zjistí, jestli produkt už v košíku je, a buď zvýší množství nebo přidá nový. ODEBER odstraní celou položku. ZMEN_MNOZSTVI nastaví nové množství, ale pokud klesne na 0 nebo méně, automaticky odebere. VYPRAZDNI vrátí prázdné pole. Pro snadnější použití jsem napsal custom hook useCart s null-check, který hodí error, pokud komponenta není uvnitř CartProvider. Kombinace Context + Reducer dává moderní React malý Redux: globální stav s jasnými akcemi a bez externí knihovny. Důležitá poznámka: reducer musí být čistá funkce, žádné side effects, vždy vrací nový objekt místo mutace. Context plus Reducer řeší props drilling: CartIcon je 3 úrovně hluboko, ale dostane stav přímo bez předávání přes props."*
> 

### Klíčové pojmy pro teorii

| Pojem | Rychlá odpověď |
| --- | --- |
| **Stav (state)** | Data, která se mění v čase a ovlivňují UI |
| **`useState`** | Lokální stav, jednoduché hodnoty |
| **`useReducer`** | Komplexní stav s akcemi, alternativa useState |
| **Reducer** | Čistá funkce `(state, action) => newState` |
| **Action** | Objekt s `type` a optional payloadem |
| **`dispatch`** | Funkce pro odeslání akce do reduceru |
| **Čistá funkce** | Stejný vstup → stejný výstup, žádné side effects |
| **Context API** | Mechanismus pro sdílení dat napříč stromem |
| **`createContext`** | Vytvoří Context kontejner |
| **Provider** | Komponenta, která poskytuje hodnotu dětem |
| **`useContext`** | Hook pro čtení Context hodnoty |
| **`use()` hook** | React 19+, modernější alternativa useContext (lze i podmíněně) |
| **Props drilling** | Předávání props přes mnoho úrovní |
| **Custom hook** | Wrapper hook (`useCart`), čistší API + null-check |
| **Immutability** | Vracet nový objekt, ne modifikovat původní |
| **Zustand, Jotai, Redux** | Externí knihovny pro velké aplikace |
| **TanStack Query** | Pro server state (fetch, cache, refetch) |

### Časté chytáky

| Otázka | Odpověď |
| --- | --- |
| *Co je stav?* | Data, která se v čase mění a ovlivňují to, co uživatel vidí. |
| *Rozdíl useState a useReducer?* | useState pro jednoduché hodnoty (boolean, string). useReducer pro komplexní stav (objekt) s víc různými akcemi. Reducer centralizuje změny do jedné čisté funkce. |
| *Co je reducer?* | Čistá funkce, která bere aktuální stav a akci a vrací nový stav. Žádné side effects, žádná mutace. |
| *Co je čistá funkce?* | Stejný vstup → stejný výstup. Žádné side effects (fetch, console.log, setTimeout). |
| *Co řeší Context API?* | Props drilling: předávání props přes mnoho úrovní, kde mezikomponenty data jen propagují. |
| *3 kroky pro Context?* | createContext, Provider obal, useContext v dítěti. |
| *Proč custom hook `useCart`?* | Čistší API (jeden import), null-check na jednom místě, typově bezpečné po null-check. |
| *Co když useContext bez Provideru?* | Vrátí default hodnotu (typicky null), crash při použití. Proto null-check. |
| *Proč nemodifikovat stav v reduceru?* | React detekuje změnu porovnáním referencí. Stejná reference = no re-render. Vždy nový objekt. |
| *Výhoda Context + Reducer vs Redux?* | Built-in v Reactu, žádná dependency, jednodušší pro malé/střední aplikace. |
| *Proč rozdělit do víc Contextů?* | Performance: změna v jednom Contextu re-renderuje všechny konzumenty. Víc Contextů = jen relevantní komponenty se rendrují. |
| *Kdy useState i s useReducer?* | useState pro malé lokální věci (input v komponentě), useReducer pro sdílený nebo komplexní stav. |
| *Co je `use()` hook?* | React 19+ alternativa pro useContext, lze volat podmíněně a umí i Promises. |

### Časté chyby v praktické úloze

- Mutace stavu v reduceru (`state.polozky.push(novy)` místo `[...state.polozky, novy]`)
- Side effects v reduceru (fetch, console.log) - reducer musí být čistý
- Forgotten null-check v `useContext` (crash při null)
- Použití `useContext` mimo Provider (vrátí default null)
- Jeden velký Context pro celou aplikaci (perf, zbytečné re-rendery)
- Reducer bez `default` v switch (TS hlídá exhaustivní, ale runtime to projde)
- `useState` v Provideru pro komplexní stav (lepší `useReducer`)
- Předávání `dispatch` přes props z Provideru (smysl Contextu je vyhnout se props)
- Chybí typovaný Action union (TS nepozná, co očekává)
- Modifikace state v handleru (`state.polozky = [...]`)
- Forgotten `Dispatch<Action>` type pro Context value
- Špatný typ Contextu (`createContext({})` místo typovaného)
- Vytváření nového Context value při každém renderu Provideru (re-render všeho), řešení: `useMemo` na value
- Reducer logika v komponentě (přesuň do reduceru)
- Volání `dispatch` v render path (běh v cyklu)