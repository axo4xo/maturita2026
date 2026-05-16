# 24 • React Router

> React Router, routování mezi stránkami, BrowserRouter, Route, Link, Navigate
> 

> **Formát:** 30 min praktická úloha, 15 min obhajoba + teorie. Teorie pokrývá client-side routing v Reactu, klíčové komponenty a hooks. Praktika: mini e-shop s nested routes, protected route a query parametry.
> 

---

## Část 1: Teorie

### Proč React Router

React je **knihovna pro UI**, sám neumí routování. V čistě reactové SPA aplikaci (`vite` šablona) je vše jedna HTML stránka. Když chceš víc "stránek" (`/`, `/about`, `/products`), potřebuješ **client-side routing**.

| Přístup | Jak funguje | Příklad |
| --- | --- | --- |
| **Server-side routing** | Každý odkaz → nový HTTP request → server vrátí HTML | Klasický PHP web |
| **Client-side routing (SPA)** | Odkaz nezpůsobí reload, JS přepne komponentu | React + React Router, Vue Router |
| **File-based routing** | Routy se generují ze složkové struktury | Next.js (App Router), SvelteKit |

**React Router** je nejpoužívanější knihovna pro client-side routing v Reactu. Přepíná komponenty podle URL **bez reloadu stránky**.

> **Pro context**: pokud používáš Next.js, **React Router NEPOUŽÍVÁŠ**. Next.js má vlastní file-based routing (`app/` složka). React Router je pro **plain React** aplikace (Vite, CRA).
> 

> **React Router v7** (vydaná listopad 2024) sjednotila Remix a React Router pod jednu knihovnu a přidává opt-in framework features. Pro tyhle zápisky a běžnou maturitu stačí **v6 patterny** (`BrowserRouter`, `Routes`, `Route`...), které jsou v v7 plně podporované.
> 

---

### Jak SPA routing funguje

```
Server-side routing:                    Client-side routing (SPA):

Klik na /about                          Klik na /about
    ▼                                       ▼
Browser → HTTP GET /about               Browser History API (pushState)
    ▼                                       ▼
Server vrátí celý HTML                  URL se změní bez reloadu
    ▼                                       ▼
Browser reloaduje stránku               React Router detekuje změnu
                                            ▼
                                        Přepne komponentu (rerender)
```

V SPA prohlížeč **nikdy nepošle nový HTTP request** při klikání mezi stránkami (jen při prvním načtení). React Router používá **History API** (`pushState`, `popState`) ke změně URL bez reloadu.

---

### Instalace a setup

```bash
npm install react-router-dom
```

```tsx
// main.tsx: obal celé aplikace do BrowserRouter
import { BrowserRouter } from 'react-router-dom';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);
```

`BrowserRouter` poslouchá změny URL (přes History API) a poskytuje router context všem dětem.

> **Pozn.**: `BrowserRouter` patří **jednou na root**, ne na každou stránku. Jinak by se router context "překryl" sám sebou.
> 

---

### Definice rout: `Routes` + `Route`

```tsx
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProductsPage from './pages/ProductsPage';

function App() {
    return (
        <Routes>
            <Route path="/"         element={<HomePage />} />
            <Route path="/about"    element={<AboutPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="*"         element={<NotFoundPage />} />  {/* fallback: 404 */}
        </Routes>
    );
}
```

| Atribut | Význam |
| --- | --- |
| `path` | URL cesta (`/`, `/about`, `/users/:id`) |
| `element` | Komponenta, která se zobrazí pro daný path |
| `path="*"` | Fallback, match cokoliv co předtím nesedělo (typicky 404) |

> **Pořadí v `Routes` nezáleží**: React Router automaticky vybere **nejspecifičtější match**. `/users/:id` je specifičtější než `*`, takže se vybere první.
> 

---

### `Link`: odkazy bez reloadu

```tsx
import { Link } from 'react-router-dom';

function Navigace() {
    return (
        <nav>
            <Link to="/">Domů</Link>
            <Link to="/about">O nás</Link>
            <Link to="/products">Produkty</Link>
        </nav>
    );
}
```

> **Nikdy nepoužívej `<a href>`** uvnitř SPA, způsobí **plný reload** stránky a ztratí React state. Vždy `<Link to>`.
> 

### Kdy `<a href>` je OK

- **Externí linky** (jiný web): `<a href="https://github.com">GitHub</a>`
- **Stahování souborů**: `<a href="/files/doc.pdf" download>`
- **Mailto/tel**: `<a href="mailto:axo@example.com">`

### `NavLink`: Link s aktivní třídou

```tsx
import { NavLink } from 'react-router-dom';

<NavLink
    to="/about"
    className={({ isActive }) => isActive ? 'aktivni' : ''}
>
    O nás
</NavLink>
```

`NavLink` automaticky pozná, jestli aktuální URL odpovídá `to`. Ideální pro zvýraznění aktivní položky v menu.

> **Pozor na root `/`**: `NavLink to="/"` bude aktivní pro **každou URL** (každá začíná `/`). Přidej atribut `end`: `<NavLink to="/" end>`.
> 

---

### Dynamické routy: `:param`

```tsx
<Route path="/users/:id" element={<UserDetailPage />} />
```

URL `/users/67` → komponenta dostane `id = "67"`. Hodnotu získáš přes hook **`useParams`**.

```tsx
import { useParams } from 'react-router-dom';

type Params = { id: string };

function UserDetailPage() {
    const { id } = useParams<Params>();    // id je string!
    const userId = Number(id);             // konverze na číslo

    return <h1>Uživatel #{userId}</h1>;
}
```

> **Hodnota z URL je vždy string** (i `:id`). Chceš-li číslo, převeď přes `Number()` nebo `parseInt()`. Pokud chybí, `useParams` vrátí `undefined`.
> 

### Více parametrů

```tsx
<Route path="/shop/:kategorie/:id" element={<ProduktPage />} />
// /shop/elektronika/67

const { kategorie, id } = useParams<{ kategorie: string; id: string }>();
```

---

### `useNavigate`: programatická navigace

Hook pro **navigaci z kódu** (ne z odkazu). Typicky po odeslání formuláře, po přihlášení, po kliknutí na tlačítko.

```tsx
import { useNavigate } from 'react-router-dom';

function PrihlasovaciFormular() {
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const ok = await prihlasit();
        if (ok) {
            navigate('/dashboard');                          // přesměruj
            // navigate('/dashboard', { replace: true });   // bez přidání do historie
            // navigate(-1);                                // jako tlačítko zpět
        }
    };

    return <form onSubmit={handleSubmit}>...</form>;
}
```

| Volání | Co udělá |
| --- | --- |
| `navigate('/cesta')` | Normální navigace (push do historie) |
| `navigate('/cesta', { replace: true })` | Nahradí aktuální záznam (Back nepůjde zpátky) |
| `navigate(-1)` | Jako tlačítko Back v prohlížeči |
| `navigate(1)` | Forward |

### Kdy `replace: true`

- **Po loginu**: nechceš, aby uživatel klikl Back a vrátil se na `/login`
- **Po platbě**: aby refresh stránky znova neprovedl platbu
- **Při redirectu** z chyby (např. 404 → home)

---

### `Navigate`: deklarativní redirect (komponenta)

Místo hooku se dá redirect provést **renderem** `<Navigate>` komponenty.

```tsx
import { Navigate } from 'react-router-dom';

function PrivatniStranka({ uzivatel }: { uzivatel: User | null }) {
    if (!uzivatel) {
        return <Navigate to="/login" replace />;   // přesměruj
    }
    return <h1>Vítej, {uzivatel.jmeno}</h1>;
}
```

**Kdy `Navigate` vs `useNavigate`:**

|  | `<Navigate>` | `useNavigate()` |
| --- | --- | --- |
| Kde se používá | V JSX (return) | V handlerech (onClick, onSubmit) |
| Kdy | "Už při renderu vím, že přesměrovat" | "Přesměrovat až po události" |
| Příklad | Nepřihlášený → /login | Po submit → /dashboard |

---

### Nested routes + `Outlet`

Pro layouty se sdílenou částí (navbar, sidebar) napříč více stránkami.

```tsx
import { Outlet } from 'react-router-dom';

// Layout komponenta: obsahuje sdílenou strukturu + <Outlet /> jako placeholder
function MainLayout() {
    return (
        <div>
            <nav>
                <Link to="/">Domů</Link> | <Link to="/about">O nás</Link>
            </nav>
            <main>
                <Outlet />        {/* zde se vykreslí dítě (HomePage, AboutPage...) */}
            </main>
            <footer>© 2026</footer>
        </div>
    );
}

// V App.tsx
<Routes>
    <Route element={<MainLayout />}>
        <Route path="/"      element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/admin" element={<AdminLayout />}>       {/* nested */}
            <Route index           element={<AdminHome />} />  {/* /admin */}
            <Route path="users"    element={<UsersList />} />  {/* /admin/users */}
            <Route path="settings" element={<Settings />} />   {/* /admin/settings */}
        </Route>
    </Route>
    <Route path="*" element={<NotFoundPage />} />
</Routes>
```

| Co | Jak |
| --- | --- |
| `<Outlet />` | Placeholder, kde se vykreslí dítě v layoutu |
| `<Route index />` | "Výchozí" dítě, vykreslí se na URL rodiče bez dalšího segmentu |
| Nested `<Route path="users">` uvnitř `<Route path="/admin">` | URL bude `/admin/users` |

> Klíčová idea: layout zůstává, jen se mění obsah uvnitř `<Outlet />`. Když přepneš z `/admin` na `/admin/users`, navbar a sidebar se **nepřekreslí**.
> 

---

### Protected route (chráněná stránka)

Wrapper komponenta, která zkontroluje přihlášení. Pokud ne → `Navigate`.

```tsx
type Props = {
    uzivatel: User | null;
    children: React.ReactNode;
};

function ChranenaRoute({ uzivatel, children }: Props) {
    if (!uzivatel) return <Navigate to="/login" replace />;
    return <>{children}</>;
}

// Použití
<Route path="/dashboard" element={
    <ChranenaRoute uzivatel={uzivatel}>
        <DashboardPage />
    </ChranenaRoute>
} />
```

Alternativa: **inline check v `element`**:

```tsx
<Route
    path="/dashboard"
    element={
        prihlasen
            ? <DashboardPage />
            : <Navigate to="/login" replace />
    }
/>
```

> Wrapper komponenta je čistší, když ho používáš víckrát.
> 

---

### Query parametry (`?key=value`)

Pro filtry, vyhledávání, stránkování. Ne pro identitu zdroje (k tomu jsou path parametry).

```tsx
import { useSearchParams } from 'react-router-dom';

function ProductsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const kategorie = searchParams.get('kategorie') ?? 'vse';
    const strana = Number(searchParams.get('strana') ?? 1);

    const zmenitKategorii = (k: string) => {
        setSearchParams({ kategorie: k, strana: '1' });
    };

    return (
        <div>
            <p>Kategorie: {kategorie}, strana: {strana}</p>
            <button onClick={() => zmenitKategorii('elektronika')}>Elektronika</button>
        </div>
    );
}
```

URL: `/products?kategorie=elektronika&strana=1`

### Path param vs query param

|  | Path param (`/users/:id`) | Query param (`?strana=2`) |
| --- | --- | --- |
| **Co** | Identita zdroje | Modifikátor (filtr, sort, paging) |
| **Příklad** | `/users/67`, `/products/macbook` | `/products?max=1000&sort=cena` |
| **Povinné** | Ano (chybí → 404) | Volitelné |
| **Routing** | Definuješ v `<Route path>` | Mimo `Route`, čteš přes hook |

---

### `useLocation`: informace o aktuální URL

```tsx
import { useLocation } from 'react-router-dom';

function Sledovat() {
    const location = useLocation();

    useEffect(() => {
        console.log('Změna URL:', location.pathname);
    }, [location.pathname]);

    return <p>Jsi na: {location.pathname}</p>;
}
```

`location` objekt obsahuje:

- `pathname`: cesta (`/products/67`)
- `search`: query string (`?max=1000`)
- `hash`: fragment (`#section`)
- `state`: data předaná přes `navigate('/cesta', { state: {...} })`

---

### Kompletní přehled API

| API | Typ | K čemu |
| --- | --- | --- |
| `<BrowserRouter>` | Komponenta | Obal aplikace, povolí routování (jednou v root) |
| `<Routes>` | Komponenta | Obal pro definice rout |
| `<Route path element>` | Komponenta | Jedna routa: URL → komponenta |
| `<Link to>` | Komponenta | Odkaz bez reloadu |
| `<NavLink to>` | Komponenta | Link s detekcí aktivního stavu |
| `<Outlet>` | Komponenta | Placeholder pro nested route |
| `<Navigate to>` | Komponenta | Deklarativní redirect (v JSX) |
| `useNavigate()` | Hook | Programatická navigace (v handlerech) |
| `useParams()` | Hook | Čtení URL parametrů (`:id`) |
| `useSearchParams()` | Hook | Čtení/zápis query parametrů |
| `useLocation()` | Hook | Info o aktuální URL |

---

### Časté chyby

| Chyba | Důsledek | Řešení |
| --- | --- | --- |
| `useNavigate must be used within a Router` | Chybí `<BrowserRouter>` | Obal `<App />` v main.tsx |
| `<a href>` reloaduje stránku | Full page reload | Použít `<Link to>` |
| Všechny `NavLink` jsou aktivní | `NavLink to="/"` matchuje vše | Přidat `end` atribut |
| Param je string, srovnávám s number | `id` z `useParams` je string | `Number(id)` před srovnáním |
| 404 nefunguje | Chybí fallback route | `<Route path="*" element={<NotFoundPage />} />` |
| Po loginu Back vrátí na /login | Login zůstal v historii | `navigate('/login', { replace: true })` |
| Nested routy se nezobrazují | Chybí `<Outlet />` | Layout musí obsahovat `<Outlet />` |
| `useParams` vrací undefined | Param jméno nesedí | `useParams<{ id: string }>()` matchuje `:id` |
| `<a href>` pro vnitřní link | Full reload, ztráta state | `<Link to>` |
| `<Link>` v emailu nebo HTML | Pracuje jen v React app | Pro external použij `<a href>` |
| Forgotten `BrowserRouter` v `main.tsx` | Routy nefungují | Obal celé App jednou |

---

# Část 2: Praktická úloha

### Co může praktická úloha obsahovat

Typická úloha:

- **Více stránek** se sdíleným layoutem (navbar, footer)
- **Statické routy** (`/`, `/about`)
- **Dynamická routa** (`/products/:id`) s `useParams`
- **Nested routes** s `<Outlet />`
- **Protected route** (chráněná stránka)
- **Programatická navigace** (`useNavigate`) po události
- **NavLink** s aktivní třídou
- **Bonus**: query parametry pro filtr, nested dashboard

### Příklad zadání: Mini e-shop

Aplikace s 5 stránkami:

- `/`: Home
- `/about`: O nás
- `/products`: Seznam produktů
- `/products/:id`: Detail produktu
- `/dashboard`: Chráněná (vyžaduje přihlášení)
- `/login`: Přihlášení
- : 404

Sdílený layout s navbarem a footerem.

### Setup

```bash
npm create vite@latest mini-eshop -- --template react-ts
cd mini-eshop
npm install
npm install react-router-dom
npm run dev
```

### Řešení

### `main.tsx`

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
);
```

### `data/products.ts`

```tsx
export type Produkt = {
    id: number;
    nazev: string;
    cena: number;
};

export const PRODUKTY: Produkt[] = [
    { id: 1, nazev: 'Notebook', cena: 25000 },
    { id: 2, nazev: 'Myš', cena: 350 },
    { id: 3, nazev: 'Klávesnice', cena: 800 },
    { id: 4, nazev: 'Monitor', cena: 7500 }
];
```

### `App.tsx`

```tsx
import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetail from './pages/ProductDetail';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
    const [prihlasen, setPrihlasen] = useState(false);

    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/"             element={<HomePage />} />
                <Route path="/about"        element={<AboutPage />} />
                <Route path="/products"     element={<ProductsPage />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/login"        element={<LoginPage onLogin={() => setPrihlasen(true)} />} />

                {/* Protected route: pokud nepřihlášen → redirect na /login */}
                <Route
                    path="/dashboard"
                    element={
                        prihlasen
                            ? <DashboardPage />
                            : <Navigate to="/login" replace />
                    }
                />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}
```

### `layouts/MainLayout.tsx`

```tsx
import { Outlet, NavLink } from 'react-router-dom';

export default function MainLayout() {
    // Helper pro NavLink: vrátí className podle isActive
    const linkClass = ({ isActive }: { isActive: boolean }) =>
        isActive ? 'aktivni' : '';

    return (
        <div>
            <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', background: '#eee' }}>
                <NavLink to="/"          end          className={linkClass}>Domů</NavLink>
                <NavLink to="/about"                  className={linkClass}>O nás</NavLink>
                <NavLink to="/products"               className={linkClass}>Produkty</NavLink>
                <NavLink to="/dashboard"              className={linkClass}>Dashboard</NavLink>
                <NavLink to="/login"                  className={linkClass}>Login</NavLink>
            </nav>

            <main style={{ padding: '1rem' }}>
                <Outlet />        {/* sem se vykreslí dětská stránka */}
            </main>

            <footer style={{ padding: '1rem', textAlign: 'center' }}>
                © 2026 Mini e-shop
            </footer>
        </div>
    );
}
```

> **`end` na NavLink `/`** je nutné! Bez něj by `/` byl "aktivní" pro každou URL (každá začíná `/`).
> 

### `pages/ProductsPage.tsx`

```tsx
import { Link } from 'react-router-dom';
import { PRODUKTY } from '../data/products';

export default function ProductsPage() {
    return (
        <div>
            <h1>Produkty</h1>
            <ul>
                {PRODUKTY.map(p => (
                    <li key={p.id}>
                        <Link to={`/products/${p.id}`}>
                            {p.nazev}: {p.cena} Kč
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
```

### `pages/ProductDetail.tsx`

```tsx
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PRODUKTY } from '../data/products';

export default function ProductDetail() {
    const { id } = useParams<{ id: string }>();   // id je string ("67")
    const navigate = useNavigate();

    const productId = Number(id);                  // konverze na number
    const produkt = PRODUKTY.find(p => p.id === productId);

    if (!produkt) {
        return (
            <div>
                <p>Produkt nenalezen.</p>
                <Link to="/products">← Zpět na seznam</Link>
            </div>
        );
    }

    return (
        <div>
            <h1>{produkt.nazev}</h1>
            <p>Cena: {produkt.cena} Kč</p>
            <button onClick={() => navigate(-1)}>← Zpět</button>
            {' '}
            <button onClick={() => navigate('/products')}>Na seznam</button>
        </div>
    );
}
```

### `pages/LoginPage.tsx`

```tsx
import { useNavigate } from 'react-router-dom';

type Props = { onLogin: () => void };

export default function LoginPage({ onLogin }: Props) {
    const navigate = useNavigate();

    const handleLogin = () => {
        onLogin();                                   // změní state v App
        navigate('/dashboard', { replace: true });   // replace: Back nepůjde na /login
    };

    return (
        <div>
            <h1>Přihlášení</h1>
            <button onClick={handleLogin}>Přihlásit (simulace)</button>
        </div>
    );
}
```

### `pages/HomePage.tsx`, `AboutPage.tsx`, `DashboardPage.tsx`, `NotFoundPage.tsx`

Jednoduché placeholdery:

```tsx
export default function HomePage() {
    return <h1>Vítej v Mini e-shopu</h1>;
}

export default function AboutPage() {
    return <h1>O nás</h1>;
}

export default function DashboardPage() {
    return <h1>Dashboard (jen pro přihlášené)</h1>;
}

export default function NotFoundPage() {
    return (
        <div>
            <h1>404</h1>
            <p>Stránka nenalezena.</p>
            <Link to="/">Domů</Link>
        </div>
    );
}
```

### Co se v řešení děje

**`main.tsx`**: `<BrowserRouter>` jednou obaluje celou aplikaci. Poskytuje router context všem dětem.

**`App.tsx`**: definice rout. Klíčové:

1. **Layout pattern**: `<Route element={<MainLayout />}>` obaluje ostatní routy. `MainLayout` má `<Outlet />`, kam se vykreslují dětské stránky.
2. **Dynamická routa**: `path="/products/:id"` chytá `/products/1`, `/products/67`, atd.
3. **Protected route**: ternární operátor v `element`. Když není přihlášen, `<Navigate to="/login" replace />` přesměruje.
4. **Fallback 404**: `path="*"` mimo layout, takže 404 stránka má vlastní bezvý layout.

**`MainLayout.tsx`**: `NavLink` s `isActive` callback. `end` na `/` brání tomu, aby byl "Domů" aktivní pro každou stránku. `<Outlet />` je placeholder pro dětský obsah.

**`ProductsPage.tsx`**: `map` přes pole, `<Link to={`/products/${p.id}`}>` generuje URL pro detail.

**`ProductDetail.tsx`**: `useParams` čte `id` z URL (string). Převedeme `Number(id)`, najdeme produkt. Pokud neexistuje, vrátíme fallback. `navigate(-1)` jako Back, `navigate('/products')` jako absolute.

**`LoginPage.tsx`**: po kliknutí volá `onLogin` (callback z App, nastaví `prihlasen`) a `navigate('/dashboard', { replace: true })`. **`replace: true` je klíčový**: bez něj by Back tlačítko vrátilo zpět na `/login`, což je špatný UX.

---

### Bonusy

### Bonus A: Query parametry pro filtr ceny

```tsx
// pages/ProductsPage.tsx
import { Link, useSearchParams } from 'react-router-dom';
import { PRODUKTY } from '../data/products';

export default function ProductsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const max = Number(searchParams.get('max')) || Infinity;

    const filtrovane = PRODUKTY.filter(p => p.cena <= max);

    return (
        <div>
            <h1>Produkty</h1>
            <div>
                Max cena:{' '}
                <button onClick={() => setSearchParams({})}>Vše</button>
                <button onClick={() => setSearchParams({ max: '1000' })}>do 1000</button>
                <button onClick={() => setSearchParams({ max: '500' })}>do 500</button>
            </div>
            <ul>
                {filtrovane.map(p => (
                    <li key={p.id}>
                        <Link to={`/products/${p.id}`}>{p.nazev}: {p.cena} Kč</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
```

URL bude např. `/products?max=1000`. Stav je v URL, tedy **shareable**: pošleš někomu link a uvidí stejný filtr.

### Bonus B: Nested dashboard

```tsx
// V App.tsx: místo jedné /dashboard stránky
<Route
    path="/dashboard"
    element={prihlasen ? <DashboardLayout /> : <Navigate to="/login" replace />}
>
    <Route index           element={<DashboardHome />} />     {/* /dashboard */}
    <Route path="profile"  element={<DashboardProfile />} />  {/* /dashboard/profile */}
    <Route path="settings" element={<DashboardSettings />} /> {/* /dashboard/settings */}
</Route>

// DashboardLayout.tsx
function DashboardLayout() {
    return (
        <div style={{ display: 'flex' }}>
            <aside>
                <NavLink to="/dashboard" end>Přehled</NavLink>
                <NavLink to="/dashboard/profile">Profil</NavLink>
                <NavLink to="/dashboard/settings">Nastavení</NavLink>
            </aside>
            <section style={{ flex: 1 }}>
                <Outlet />
            </section>
        </div>
    );
}
```

### Bonus C: Programmatic redirect po smazání

```tsx
// V ProductDetail.tsx
const smaz = async () => {
    await fetch(`/api/products/${productId}`, { method: 'DELETE' });
    navigate('/products');   // přesměruj zpět na seznam
};

return (
    <div>
        {/* ... */}
        <button onClick={smaz}>Smazat produkt</button>
    </div>
);
```

### Bonus D: ChranenaRoute jako reusable wrapper

```tsx
// components/ChranenaRoute.tsx
import { Navigate } from 'react-router-dom';

type Props = {
    prihlasen: boolean;
    children: React.ReactNode;
};

export default function ChranenaRoute({ prihlasen, children }: Props) {
    if (!prihlasen) return <Navigate to="/login" replace />;
    return <>{children}</>;
}

// V App.tsx
<Route path="/dashboard" element={
    <ChranenaRoute prihlasen={prihlasen}>
        <DashboardPage />
    </ChranenaRoute>
} />
<Route path="/admin" element={
    <ChranenaRoute prihlasen={prihlasen}>
        <AdminPage />
    </ChranenaRoute>
} />
```

---

## Část 3: Tipy pro obhajobu

### Co u obhajoby říct

> *"V zadání jsem postavil mini e-shop s React Routerem. Aplikace má 7 rout včetně dynamické na detail produktu a chráněné dashboard stránky. BrowserRouter obaluje celou aplikaci v main.tsx, poslouchá změny URL přes History API. Routes a Route definují, která komponenta se zobrazí pro daný path. Pro sdílený layout (navbar + footer) jsem použil pattern s MainLayout a Outlet komponentou: layout obsahuje placeholder Outlet, kam se vykreslí aktuální dětská stránka. Detail produktu používá dynamickou routu /products/:id, ID čtu přes useParams jako string a převádím na number. Login používá useNavigate s replace: true, takže po přihlášení Back nevrátí na login. Chráněná dashboard má inline ternární kontrolu: pokud nepřihlášen, Navigate to /login replace. Pro navbar jsem použil NavLink s isActive callback, end atribut na root linku je nutný, jinak by byl aktivní vždy. Fallback 404 je path star, který chytá vše, co nesedělo na předchozí routy."*
> 

### Klíčové pojmy pro teorii

| Pojem | Rychlá odpověď |
| --- | --- |
| **React Router** | Knihovna pro client-side routing v React aplikacích |
| **Client-side routing** | URL se mění bez reloadu stránky, JS přepne komponentu |
| **History API** | Browser API pro `pushState`, `popState`, používá ho React Router |
| **`BrowserRouter`** | Obal celé aplikace, poskytuje router context |
| **`Routes`** | Wrapper pro `Route` definice |
| **`Route`** | Jedna definice: `path` + `element` |
| **`Link`** | Odkaz bez reloadu, používá History API |
| **`NavLink`** | `Link` + detekce aktivního stavu (`isActive`) |
| **`Outlet`** | Placeholder v layoutu, kam se vykreslí dětská routa |
| **`Navigate`** | Komponenta pro deklarativní redirect (v JSX) |
| **`useNavigate`** | Hook pro programatickou navigaci (v handlerech) |
| **`useParams`** | Hook pro čtení URL parametrů (`:id`) |
| **`useSearchParams`** | Hook pro query parametry (`?key=value`) |
| **`useLocation`** | Hook pro info o aktuální URL |
| **Path parametr** | `:id` v URL, pro identitu zdroje |
| **Query parametr** | `?key=value`, pro filtry, sort, paging |
| **Nested route** | `Route` uvnitř `Route`, sdílený layout |
| **Index route** | `<Route index>`, výchozí dítě na URL rodiče |
| **Protected route** | Wrapper s kontrolou přihlášení a redirectem |
| **Fallback 404** | `<Route path="*">`, match cokoliv |

### Časté chytáky

| Otázka | Odpověď |
| --- | --- |
| *Co je client-side routing?* | URL se mění, ale stránka se nereloaduje. JS přepne komponentu. Přes History API. |
| *Proč React potřebuje React Router?* | React je UI knihovna, sám neumí routování. React Router přidá schopnost mít víc "stránek" v SPA. |
| *Proč ne `<a href>` v SPA?* | Způsobí plný reload, ztratíš celý React state, aplikace se znovu inicializuje. |
| *Co dělá `BrowserRouter`?* | Obaluje aplikaci, poslouchá změny URL přes History API a poskytuje router context dětem. |
| `*Routes` vs `Route`?* | `Routes` je wrapper, `Route` jedna definice. React Router automaticky najde nejspecifičtější match. |
| `*Navigate` vs `useNavigate`?* | Navigate komponenta v JSX (render-time redirect). useNavigate hook v handlerech (po události). |
| *Co je `useParams`?* | Hook vrací objekt s URL parametry. Pro `/users/:id` vrátí `{ id: "67" }`. Vždy string. |
| *Co je `Outlet`?* | Placeholder v layout komponentě, kde se vykreslí dětská routa. Umožňuje sdílený obal napříč stránkami. |
| *Path vs query param?* | Path (`/users/:id`) pro identitu zdroje. Query (`?strana=2`) pro modifikátory (filtr, sort, paging). |
| *Protected route?* | Wrapper komponenta nebo inline kontrola: `prihlasen ? <Strana /> : <Navigate to="/login" replace />`. |
| *Proč `replace: true`?* | Nahradí aktuální záznam v historii. Po loginu Back nevrátí na /login. |
| *Co `end` na NavLink?* | Bez něj NavLink to="/" matchuje každou URL (každá začíná /). End říká "jen exact match". |
| *Co je fallback 404?* | `<Route path="*" element={<NotFoundPage />} />`. Hvězdička matchuje cokoliv, co nesedělo. |

### Časté chyby v praktické úloze

- `useNavigate must be used within a Router` (chybí `<BrowserRouter>` v `main.tsx`)
- `<a href>` místo `<Link to>` (full reload, ztráta state)
- `NavLink to="/"` bez `end` (aktivní pro každou URL)
- `useParams` vrací string, srovnání s number (`p.id === id` selže, použij `Number(id)`)
- Chybí fallback `<Route path="*">` (404 nefunguje)
- Login bez `replace: true` (Back vrátí na /login)
- Nested routy bez `<Outlet />` v layoutu (dítě se nevykreslí)
- `useParams<{ jmeno: string }>()` ale routa má `:id` (jméno nesedí)
- `<Link to>` pro externí URL (R. Router je interní)
- Forgotten `import { BrowserRouter } from 'react-router-dom'`
- `BrowserRouter` v každé komponentě (musí být jen jednou na rootu)
- Protected route bez `replace` (uživatel může klikat Forward a vrátit se na chráněnou stránku)
- Změna URL ručně místo `navigate()` (window.location.href, ztratí React state)
- `useParams` pro query stringy (pleti se s `useSearchParams`)