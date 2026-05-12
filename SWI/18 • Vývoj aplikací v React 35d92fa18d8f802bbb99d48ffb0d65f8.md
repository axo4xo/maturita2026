# 18 • Vývoj aplikací v React

> DOM, ShadowDOM, transpilace kódu, JSX, toolchain, funkcionální komponenty, javascript v prohlížeči
> 

# Co je React

**React** je open-source JavaScriptová **knihovna** pro tvorbu uživatelských rozhraní. Vytvořila ho firma **Meta** (tehdá Facebook), poprvé vydaná v roce 2013. Aktuální verze je **React 19** (stabilní od prosince 2024).

### Klíčové vlastnosti

- **Komponentový přístup**: aplikace je strom znovupoužitelných komponent
- **Deklarativní**: popisuješ **jak má UI vypadat** pro daný stav, ne **jak ho měnit**
- **Virtual DOM**: optimalizace překreslování (do React 18, dnes částečně nahrazené)
- **Unidirectional data flow**: data tečou od rodiče k potomkům přes `props`

### Use cases

| Typ aplikace | Vhodné? |
| --- | --- |
| SPA (Single Page Application) | Klasické use case |
| Webové aplikace s komplexním UI | Ideální |
| Statické weby (blog, portfolio) | Spíš použij Astro / Hugo |
| Mobilní aplikace | React Native (jiná knihovna, podobné API) |
| Desktop aplikace | Electron + React |

# JavaScript v prohlížeči

Tři pilíře webu (rekapitulace):

| Technologie | Účel |
| --- | --- |
| HTML | Struktura a sémantika obsahu |
| CSS | Vizuální prezentace |
| **JavaScript** | **Logika, interaktivita, komunikace se serverem** |

### JS Engine

Každý prohlížeč má **JavaScript engine**, který parsuje a vykonává JS:

| Prohlížeč | JS Engine |
| --- | --- |
| Chrome, Edge, Opera | **V8** (Google) |
| Firefox | **SpiderMonkey** (Mozilla) |
| Safari | **JavaScriptCore (Nitro)** (Apple) |

**Event loop a asynchronnost**

JavaScript je **single-threaded** (jedno vlákno), ale dokáže být asynchronní díky **event loopu**: dlouhé operace (síťové requesty, timery) se vykonávají mimo hlavní vlákno a callback se zařadí do fronty, až jsou hotové.

```jsx
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');

// Output: 1, 4, 3, 2
// Synchronní kód → microtasks (Promise) → macrotasks (setTimeout)
```

**Co JS v prohlížeči umí**

```jsx
// 1. Manipulace s DOM
document.getElementById("nadpis").textContent = "Nový text";

// 2. Asynchronní HTTP requesty
const data = await fetch("https://api.example.com/users");
const json = await data.json();

// 3. Eventy uživatele
button.addEventListener("click", () => console.log("klik!"));

// 4. Storage
localStorage.setItem("key", "value");

// 5. Web APIs (geolocation, notifications, webcam, ...)
navigator.geolocation.getCurrentPosition(pos => console.log(pos));
```

### ES moduly

Moderní JavaScript používá nativní moduly (od ES2015, podpora v prohlížečích od 2018):

```jsx
<script type="module" src="app.js"></script>
```

```jsx
// utils.js
export const sum = (a, b) => a + b;

// app.js
import { sum } from './utils.js';
```

V Reactu se vždy pracuje s moduly: každá komponenta typicky vlastní soubor.

# DOM, Virtual DOM, Shadow DOM

### DOM (Document Object Model)

**DOM** je stromová reprezentace HTML dokumentu, kterou prohlížeč vytvoří při parsování. Každý element je uzel (objekt), se kterým může JavaScript manipulovat.

```
document
└── html
    ├── head
    │   └── title
    └── body
        ├── header
        └── main
            └── p
```

**Problém přímé manipulace s DOMem:**

| Operace | Co dělá | Cena |
| --- | --- | --- |
| **Reflow** | Přepočet layoutu (pozice, velikosti) | Drahý |
| **Repaint** | Překreslení pixelů | Levnější |
| **Composite** | Skládání vrstev (GPU) | Nejlevnější |

Změna jedné vlastnosti může spustit reflow celé stránky. Proto **frameworky DOM manipulaci batchují**.

### Virtual DOM

**Virtual DOM** je odlehčená kopie skutečného DOMu uložená v JavaScript paměti. React s ní pracuje místo přímé manipulace s reálným DOMem.

![image.png](18%20%E2%80%A2%20V%C3%BDvoj%20aplikac%C3%AD%20v%20React/image.png)

**Výhoda:** developer píše deklarativní kód ("takhle to má vypadat"), React řeší optimální cestu k reálnému DOMu.

**Mýtus:** Virtual DOM **není** vždy rychlejší než vanilla JS. Pro malé interakce je vlastně pomalejší (overhead diffingu). Výhoda je u **velkých UI s častými změnami stavu**, kde manuální optimalizace by byla peklo.

### Shadow DOM

**Shadow DOM** je nativní webová technologie umožňující **kompletní izolaci stylů a struktury** uvnitř komponenty. Vytváří oddělený DOM strom uvnitř prvku, který je skrytý před zbytkem stránky.

|  | Klasický DOM | Shadow DOM |
| --- | --- | --- |
| **Izolace stylů** | Ne, styly se prolínají | Ano, kompletní |
| **Viditelnost zvenku** | Globální | Zapouzdřená |
| **Použití** | Běžné HTML | Web Components |

```jsx
const element = document.querySelector('#muj-prvek');
const shadow = element.attachShadow({ mode: 'open' });
shadow.innerHTML = `
  <style>p { color: red; }</style>
  <p>Toto je izolovaný obsah</p>
`;
```

`<p>` uvnitř Shadow DOM bude červený, **ale jiné `<p>` na stránce ne**. Styly z hlavního dokumentu se dovnitř taky nedostanou.

### Důležitý chyták: React nepoužívá Shadow DOM

|  | Co řeší | Kde |
| --- | --- | --- |
| **Virtual DOM** | Výkon při překreslování | React, Vue (do v3), Preact |
| **Shadow DOM** | Izolace stylů a struktury | Web Components, video element |

React má vlastní mechanismus izolace stylů (CSS Modules, styled-components, Tailwind utility classes), ne Shadow DOM. Zaměňování je u maturity klasický chyták.

# JSX (JavaScript XML)

**JSX** je rozšíření syntaxe JavaScriptu, které umožňuje psát něco podobného HTML přímo v JS kódu. **Není to HTML** ani čistý JavaScript. Babel (nebo SWC) ho transpiluje na volání `React.createElement()`.

```jsx
// Co píšeš
const element = <h1 className="nadpis">Ahoj, {jmeno}!</h1>;

// Co z toho vznikne po transpilaci
const element = React.createElement(
  "h1",
  { className: "nadpis" },
  "Ahoj, ", jmeno, "!"
);
```

**Pravidla JSX**

```jsx
// 1. Jeden kořenový element
const App = () => (
  <>
    <h1>Nadpis</h1>
    <p>Odstavec</p>
  </>
);

// 2. Atributy v camelCase
<div className="card" tabIndex={0} onClick={handleClick}>...</div>
//   ↑ ne "class"      ↑ ne "tabindex"  ↑ ne "onclick"

// 3. Vyhrazená slova musí být přejmenovaná
<label htmlFor="email">E-mail</label>   // "for" je vyhrazené slovo v JS

// 4. JavaScript výrazy ve složených závorkách
<p>2 + 2 = {2 + 2}</p>
<img src={imgUrl} alt={altText} />

// 5. Samouzavírací tagy
<img />
<br />
<MyComponent />

// 6. Inline styly jako objekty
<div style={{ color: 'red', fontSize: '16px' }}>...</div>
//           ↑ JS objekt      ↑ camelCase property

// 7. Komentáře uvnitř JSX
<div>
  {/* Toto je komentář */}
  <p>Text</p>
</div>
```

**Conditional rendering**

```jsx
const Komponenta = ({ user }) => {
  // 1. Ternární operátor
  return user ? <Profile user={user} /> : <Login />;
};

// 2. Logical AND (rendering jen pokud true)
{isLoading && <Spinner />}
{errors.length > 0 && <ErrorList errors={errors} />}

// 3. Vícero podmínek (přes if v těle funkce)
const Status = ({ status }) => {
  if (status === 'loading') return <Spinner />;
  if (status === 'error') return <Error />;
  return <Content />;
};
```

**Lists a keys**

Renderování seznamů se dělá přes `.map()`:

```jsx
const Seznam = ({ items }) => (
  <ul>
    {items.map(item => (
      <li key={item.id}>{item.name}</li>
    ))}
  </ul>
);
```

**Atribut `key` je povinný** u každého renderovaného prvku v listu. React ho používá k identifikaci, který prvek se změnil, přidal nebo smazal. Bez něj může React překreslit zbytečně moc nebo se zmást.

| Co použít jako key | Vhodné? |
| --- | --- |
| Unikátní ID z dat (`item.id`) | Nejlepší |
| Slug nebo URL | Dobré |
| Index pole (`map((item, i) => key={i})`) | Jen pokud se seznam nemění |
| `Math.random()` | Špatně, key se mění každý render |

# Transpilace kódu

### Transpilace vs kompilace

|  | Kompilace | Transpilace |
| --- | --- | --- |
| **Výstup** | Strojový kód (binární) | Jiný zdrojový kód (stále čitelný) |
| **Příklad** | C → strojový kód procesoru | JSX → JavaScript, TypeScript → JavaScript |
| **Čitelnost výstupu** | Ne, jen pro CPU | Ano, lidsky čitelný |
| **Alternativní název** | Compiler | Source-to-source compiler |

**K čemu se transpilace v React projektu používá**

```
JSX            → JavaScript      (přes Babel/SWC)
TypeScript     → JavaScript      (přes tsc/Babel/SWC)
Moderní ES2024 → ES2015 (ES6)    (pro starší prohlížeče)
ES modules     → CommonJS        (pro Node.js bez modulů)
```

**Příklad transpilace JSX**

```jsx
// Vstup (moderní JSX + ES6+)
const Pozdrav = ({ jmeno }) => <h1>Ahoj, {jmeno}!</h1>;

// Výstup po transpilaci Babelem do ES5
var Pozdrav = function(props) {
  return React.createElement("h1", null, "Ahoj, ", props.jmeno, "!");
};
```

### Hlavní transpilery v React ekosystému

| Nástroj | Co dělá |
| --- | --- |
| **Babel** | Klasický JS transpiler, JSX, TS, ES2024+ → ES5, plugins ekosystém |
| **SWC** | Náhrada Babelu napsaná v Rustu, 10-20× rychlejší. Default ve Vite a Next.js. |
| **esbuild** | Bundler i transpiler v Go, ještě rychlejší. Default ve Vite pro dev. |
| **tsc** | TypeScript kompilátor, oficiální od Microsoftu |

V roce 2026 jsou Babel hodně na ústupu ve prospěch SWC a esbuild kvůli rychlosti.

# Toolchain v Reactu

**Toolchain** je sada nástrojů, které spolupracují při vývoji aplikace.

| Nástroj | Účel |
| --- | --- |
| **Node.js** | Běhové prostředí JavaScriptu mimo prohlížeč. Nutné pro vývojové nástroje. |
| **npm / pnpm / yarn / bun** | Správa balíčků (knihoven) |
| **Vite** | Moderní dev server + bundler, dominantní volba |
| **Webpack** | Starší bundler, stále se používá, ale ztrácí pozici |
| **Babel / SWC** | Transpiler JSX + moderního JS |
| **ESLint** | Linter, hlídá chyby a styl kódu |
| **Prettier** | Automatické formátování kódu |
| **TypeScript** | Statické typování JavaScriptu |

**Vytvoření React projektu (2026)**

```bash
# Vite (doporučované pro pure React SPA)
npm create vite@latest moje-aplikace -- --template react-ts

# Next.js (doporučované pro produkční web aplikace)
npx create-next-app@latest moje-aplikace

# create-react-app (CRA) je od února 2023 oficiálně deprecated, NEPOUŽÍVAT
```

### Bundler (Vite/Webpack)

**Bundler** spojí všechny tvé JS soubory, CSS, obrázky a další asety do několika optimalizovaných souborů, které prohlížeč zvládne efektivně načíst.

**Build pipeline**

![image.png](18%20%E2%80%A2%20V%C3%BDvoj%20aplikac%C3%AD%20v%20React/image%201.png)

### Package.json

Manifest projektu:

```json
{
  "name": "moje-aplikace",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.0.0"
  }
}
```

`dependencies` jsou knihovny potřebné v runtime, `devDependencies` jen při buildu.

# Funkcionální komponenty

**Komponenta** je znovupoužitelný stavební blok UI. Přijímá **props** (vstupní data) a vrací **JSX** (co se zobrazí).

**Základní komponenta**

```jsx
// Definice
const Pozdrav = ({ jmeno, vek }) => {
  return (
    <div>
      <h1>Ahoj, {jmeno}!</h1>
      <p>Je ti {vek} let.</p>
    </div>
  );
};

// Použití
<Pozdrav jmeno="Jan" vek={20} />
```

**Props (properties)**

**Props jsou immutable** (neměnitelná) data, která komponenta dostává od rodiče. Komponenta je nesmí modifikovat.

```jsx
// Destructuring v parametrech
const Karta = ({ title, body, footer = "Bez patičky" }) => (
  <div className="card">
    <h2>{title}</h2>
    <p>{body}</p>
    <small>{footer}</small>
  </div>
);

// Spread props
const props = { title: "Hi", body: "Text" };
<Karta {...props} />
```

### Children prop

Speciální prop, který obsahuje obsah mezi otevíracím a uzavíracím tagem komponenty:

```jsx
const Karta = ({ children, title }) => (
  <div className="card">
    <h2>{title}</h2>
    {children}
  </div>
);

// Použití
<Karta title="Novinka">
  <p>Toto je obsah karty.</p>
  <button>Klikni</button>
</Karta>
```

### Třídní vs funkcionální komponenty

|  | Třídní (starší) | Funkcionální (moderní) |
| --- | --- | --- |
| Syntaxe | `class X extends Component` | `const X = () => {}` |
| Stav | `this.state`, `this.setState()` | `useState()` |
| Lifecycle | `componentDidMount`, atd. | `useEffect()` |
| `this` | Komplikované | Není potřeba |
| Boilerplate | Hodně | Málo |
| Dnes | Legacy code, nepiš nové | Standard |

V roce 2026 se funkcionální komponenty s hooky používají téměř výhradně. Třídní komponenty potkáš jen ve starých projektech.

# Hooks

**Hooks** jsou funkce začínající `use`, které dávají funkcionálním komponentám schopnosti dřív vyhrazené třídním (stav, lifecycle, ref...).

### `useState` (lokální stav)

```jsx
import { useState } from 'react';

const Pocitadlo = () => {
  const [pocet, setPocet] = useState(0);
  //     ↑ aktuální hodnota  ↑ funkce pro změnu

  return (
    <div>
      <p>Kliknuto: {pocet}×</p>
      <button onClick={() => setPocet(pocet + 1)}>Klikni</button>
    </div>
  );
};
```

Pokud změníš obyčejnou proměnnou, UI se nepřekreslí. Jen volání setteru z `useState` říká Reactu "překresli komponentu". Pokud nový stav závisí na předchozím, použij funkční formu: `setPocet(p => p + 1)`.

### `useEffect` (vedlejší efekty)

Spustí kód po renderu komponenty. Pro API volání, timery, manipulaci s DOMem.

```jsx
import { useState, useEffect } from 'react';

const Profil = ({ userId }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(setUser);

    // Cleanup funkce (volaná před dalším spuštěním nebo unmount)
    return () => {
      console.log('cleanup');
    };
  }, [userId]);   // dependency array: spustí se při změně userId

  return user ? <p>{user.name}</p> : <p>Načítám...</p>;
};
```

### Dependency array semantika

| Hodnota | Chování |
| --- | --- |
| Neuvedeno | Spustí se po každém renderu |
| `[]` (prázdné) | Spustí se jen jednou po mountu |
| `[var1, var2]` | Spustí se, když se kterákoli závislost změní |

### Nejdůležitější hooks (přehled)

| Hook | K čemu slouží |
| --- | --- |
| `useState` | Lokální stav komponenty |
| `useEffect` | Vedlejší efekty (API, timery, DOM manipulace) |
| `useContext` | Sdílení dat napříč komponentami bez prop drilling |
| `useRef` | Reference na DOM element nebo mutable hodnota bez triggeringu re-renderu |
| `useReducer` | Komplexní stav (alternativa k useState) |
| `useMemo` | Memoizace náročných výpočtů |
| `useCallback` | Memoizace funkcí (stabilní reference) |
| `useId` | Generování unikátních ID (pro accessibility) |

### Custom hooks

Vlastní funkce začínající `use`, která uvnitř používá jiné hooky. Abstrakce sdíleného chování:

```jsx
// Custom hook: useFetch
const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(url).then(r => r.json()).then(d => {
      setData(d);
      setLoading(false);
    });
  }, [url]);

  return { data, loading };
};

// Použití v komponentě
const Profil = ({ userId }) => {
  const { data: user, loading } = useFetch(`/api/users/${userId}`);
  if (loading) return <Spinner />;
  return <h1>{user.name}</h1>;
};
```

### Pravidla hooks

1. Hooks se volají **jen na nejvyšší úrovni** komponenty, ne v cyklech, podmínkách nebo nested funkcích.
2. Hooks se volají **jen z React komponent nebo custom hooks**, ne z obyčejných funkcí.

# React 19 a moderní React (2026)

### React Server Components (RSC)

Komponenty, které se renderují **na serveru**, ne v prohlížeči. Klient dostává už hotové HTML/data, ne JavaScript pro renderování.

```jsx
// app/page.jsx - Server Component (defaultně v Next.js App Router)
async function Page() {
  const users = await db.users.findAll();   // přímý DB přístup!
  return (
    <ul>
      {users.map(u => <li key={u.id}>{u.name}</li>)}
    </ul>
  );
}
```

| Server Component | Client Component |
| --- | --- |
| Renderuje se na serveru | Renderuje se v prohlížeči |
| Nemůže používat useState, useEffect | Může používat hooky |
| Může používat `async/await` přímo | Ne přímo |
| Menší JS bundle pro klienta | Větší bundle |
| Defaultní v Next.js App Router | Vyžaduje `"use client"` direktivu |

**React Compiler (dřív "React Forget")**

Nový kompilátor, který **automaticky memoizuje** komponenty a hodnoty. Konec ručního `useMemo`/`useCallback`/`React.memo`

```jsx
// Před React 19 (musíš ručně optimalizovat)
const expensive = useMemo(() => calculate(a, b), [a, b]);
const stableFn = useCallback(() => doSomething(x), [x]);

// S React Compiler (automaticky optimalizováno)
const expensive = calculate(a, b);
const stableFn = () => doSomething(x);
```

Compiler analyzuje kód a vkládá memoizaci tam, kde dává smysl.

**Actions a form handling**

```jsx
async function updateName(formData) {
  "use server";
  const name = formData.get("name");
  await db.users.update({ name });
}

const Form = () => (
  <form action={updateName}>
    <input name="name" />
    <button type="submit">Uložit</button>
  </form>
);
```

### `use()` hook

Nový primitiv pro práci s promises a context **podmíněně** (porušuje staré pravidlo "jen na nejvyšší úrovni"):

```jsx
const Profil = ({ userPromise }) => {
  const user = use(userPromise);   // suspense pod kapotou
  return <h1>{user.name}</h1>;
};
```

### Další novinky v React 19

- **`ref` jako prop**: žádný `forwardRef`, jednoduše předáš `ref` jako kterýkoli jiný prop
- **Document metadata**: `<title>`, `<meta>`, `<link>` v komponentě, React je hoistne do `<head>`
- **Stylesheet hoisting**: `<link rel="stylesheet">` v komponentě
- **`useOptimistic`**: optimistic UI updates
- **`useFormStatus`**: stav formuláře v nested komponentě
- **Improved error messages**: lepší debug info v dev modu

# State management

Pro lokální stav stačí `useState`. Pro **globální** stav (sdílený přes komponenty) jsou možnosti:

| Řešení | Kdy použít |
| --- | --- |
| **Lifting state up** | Sdílení mezi sourozenci, stav přesunout do nejbližšího společného rodiče |
| **`useContext`** | Globální stav bez prop drilling (téma, auth, language) |
| **`useReducer`** | Komplexní stav se zřejmou logikou změn |
| **Zustand** | Lehká globální stav knihovna, dnes populární |
| **Redux (Toolkit)** | Robustní state management, větší aplikace |
| **TanStack Query** | Server state (cache, refetch, optimistic updates) |
| **Jotai / Recoil** | Atomic state management |

**Context API příklad**

```jsx
import { createContext, useContext } from 'react';

const ThemeContext = createContext('light');

const App = () => (
  <ThemeContext.Provider value="dark">
    <Header />
  </ThemeContext.Provider>
);

const Header = () => {
  const theme = useContext(ThemeContext);
  return <header className={theme}>...</header>;
};
```

# Stylování v Reactu

| Přístup | Příklad |
| --- | --- |
| **Globální CSS** | `import './styles.css'` |
| **CSS Modules** | `import s from './Button.module.css'; <button className={s.btn}>` |
| **Tailwind CSS** | `<button className="bg-blue-500 px-4 py-2">` |
| **styled-components (Emotion)** | `const Button = styled.button``color: red``` |
| **Inline styles** | `<div style={{color: 'red'}}>` |
| **CSS-in-JS (vanilla-extract)** | Type-safe CSS v TS souborech |

V roce 2026 je **Tailwind CSS** asi nejpopulárnější volba, CSS Modules druhé místo.

## Frameworky postavené na Reactu

| Framework | Specifikace |
| --- | --- |
| **Next.js** | SSR, SSG, App Router, RSC. Dominantní volba. (Vercel) |
| **Remix** | Web-standardy-first, nested routing. (Shopify) |
| **Gatsby** | SSG zaměřený na obsah. Ztrácí pozice. |
| **Astro** | Multi-framework, "islands architecture". Není čistě React. |

## Tipy pro ústní zkoušku

### Jak začít

> *"React je JavaScriptová knihovna pro tvorbu uživatelských rozhraní, vyvinutá firmou Meta. Aplikace se skládá ze znovupoužitelných komponent, každá má vlastní stav a renderovací logiku. Tradičně používá Virtual DOM pro optimalizaci překreslování, v aktuální verzi React 19 přidává Server Components a auto-optimalizační kompilátor."*
> 

### Co komise typicky chce slyšet

- **Rozdíl knihovna vs framework** (s nuancí, že hranice je dnes rozmazaná).
- **DOM vs Virtual DOM vs Shadow DOM**, klasický chyták (Virtual DOM výkon, Shadow DOM izolace, React jen Virtual).
- **JSX není HTML** ani čistý JS, je to syntaktický cukr pro `React.createElement()`.
- **Transpilace vs kompilace** s příkladem (Babel transpiluje JSX, gcc kompiluje C).
- **Funkční komponenty s hooky** jako standard.
- **`useState`** a proč obyčejná proměnná nestačí.
- **Lists s `key`** a proč jsou klíče důležité.

### Doplňky, které komisi potěší

- **React Server Components** v React 19 a Next.js App Router.
- **React Compiler** jako náhrada ručního memoizování.
- **SWC vs Babel** jako moderní rychlejší transpiler.
- **Custom hooks** pro znovupoužitelnou logiku.
- **Context API** vs prop drilling.
- **TanStack Query** pro server state.
- **`create-react-app` je deprecated** od 2023, dnes Vite nebo Next.js.