# 20 • Next.js a serverové vs klientské renderování

> Routování, server-side rendering (SSR), client-side rendering (CSR), file-based routing
> 

> **Formát:** 30 min praktická úloha, 15 min obhajoba + teorie. Teorie pokrývá Next.js App Router, rendering modely a moderní features. Praktika: blog s dynamickou routou, klientskou stránkou a API routes.
> 

---

# Část 1: Teorie

### Co je Next.js a proč ho používáme

**Next.js** je React **framework** od firmy Vercel. Přidává nad React věci, které samotný React neumí.

| Funkce | Plain React (Vite, CRA) | Next.js |
| --- | --- | --- |
| **Routování** | Nutná knihovna (`react-router`) | **Automatické** z file systému |
| **SSR** | Žádné (vždy CSR) | Výchozí chování |
| **SEO** | Špatné (prázdný HTML skeleton) | Hotové HTML rovnou |
| **API endpointy** | Nutný separátní backend | `route.ts` ve stejném projektu |
| **Optimalizace obrázků** | Manuální | `<Image />` komponenta |
| **Optimalizace fontů** | Manuální | `next/font` |
| **Code splitting** | Manuální config | Automaticky podle stránky |

**Kdy Next.js**: e-shop, blog, marketing web, firemní web, kdykoli záleží na SEO a rychlosti načtení.

**Kdy plain React**: interní dashboardy, admin panely, aplikace za přihlášením, kdy SEO nehraje roli.

### Pages Router vs App Router

> Next.js má **dva** systémy routování. Důležité vědět který se používá.
> 

|  | Pages Router (legacy) | App Router (moderní) |
| --- | --- | --- |
| **Složka** | `pages/` | `app/` |
| **Verze** | Od Next.js 1 | Next.js 13+ (2022) |
| **Stabilní** | Ano, dlouho | Od Next.js 13.4 (2023) |
| **Server Components** | Ne | Ano |
| **Streaming** | Ne | Ano |
| **Data fetching** | `getServerSideProps` / `getStaticProps` | `async` komponenty + `fetch` |

**Pro nový projekt používej App Router**, je to současný standard. Tahle otázka je o něm.

---

### App Router: file-based routing

Next.js vytváří routy **automaticky ze složkové struktury** uvnitř `app/`. Každá složka = segment URL. Každý `page.tsx` = stránka dostupná na té URL.

```
app/
├── page.tsx              →  /
├── about/
│   └── page.tsx          →  /about
├── blog/
│   ├── page.tsx          →  /blog
│   └── [slug]/
│       └── page.tsx      →  /blog/:slug         (dynamická)
├── shop/
│   └── [category]/
│       └── [id]/
│           └── page.tsx  →  /shop/:category/:id (vnořená dynamická)
├── api/
│   └── hello/
│       └── route.ts      →  GET/POST /api/hello (API endpoint)
└── layout.tsx            →  sdílený layout
```

### Speciální soubory

| Soubor | K čemu |
| --- | --- |
| `page.tsx` | Obsah stránky na dané URL |
| `layout.tsx` | Obal stránky, přetrvává při navigaci (navbar, footer) |
| `route.ts` | API endpoint (nahrazuje backend) |
| `loading.tsx` | Skeleton/spinner zobrazovaný při načítání |
| `error.tsx` | Chybová stránka pro daný segment |
| `not-found.tsx` | Vlastní 404 |
| `template.tsx` | Jako layout, ale **překresluje se** při navigaci |
| `middleware.ts` | Spustí se před každým requestem (auth, redirect) |

### Vnořené routy a layouty

```
app/
├── layout.tsx              ← root layout (povinný, <html><body>)
├── page.tsx                ← /
└── dashboard/
    ├── layout.tsx          ← layout JEN pro /dashboard a jeho podstránky
    ├── page.tsx            ← /dashboard
    └── settings/
        └── page.tsx        ← /dashboard/settings
```

Layouty se **vnořují**: `/dashboard/settings` použije root layout + dashboard layout. Při navigaci mezi `/dashboard` a `/dashboard/settings` se root i dashboard layout **nepřekresluje**, jen vnitřní `page`.

---

### Statická routa

```tsx
// app/about/page.tsx → dostupné na /about
export default function AboutPage() {
    return <h1>O nás</h1>;
}
```

### Dynamická routa: `[param]`

Složka v hranatých závorkách = proměnný segment URL.

```tsx
// app/blog/[slug]/page.tsx → /blog/cokoliv

type Props = {
    params: { slug: string };
};

export default function BlogPost({ params }: Props) {
    return <h1>Článek: {params.slug}</h1>;
}
```

Více segmentů:

```tsx
// app/shop/[category]/[id]/page.tsx → /shop/elektronika/67
type Props = {
    params: { category: string; id: string };
};
```

### Speciální dynamické routy

| Syntaxe | Význam |
| --- | --- |
| `[slug]` | Jeden segment |
| `[...slug]` | Catch-all: víc segmentů (`/blog/a/b/c` → `slug: ['a','b','c']`) |
| `[[...slug]]` | Optional catch-all (i bez segmentů) |
| `(group)` | Group route (neovlivňuje URL, jen organizace) |

```
app/(marketing)/about/page.tsx  → /about (group "(marketing)" se skryje z URL)
app/(marketing)/contact/page.tsx → /contact
```

---

### Layout (`layout.tsx`)

Obaluje všechny stránky v dané složce. Při navigaci se **nepřekresluje** (perfect pro navbar a footer).

```tsx
// app/layout.tsx (kořenový layout, povinný)
export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="cs">
            <body>
                <nav>Navigace</nav>
                {children}          {/* zde se vykreslí obsah aktuální stránky */}
                <footer>Footer</footer>
            </body>
        </html>
    );
}
```

> **Root layout musí obsahovat `<html>` a `<body>`**, je to jediný layout, který je vidí. Ostatní layouty jen wrappery v `children`.
> 

---

### `next/link`: client-side navigace

Místo `<a href="...">` pro vnitřní navigaci používej **`<Link>`** komponentu z `next/link`:

```tsx
import Link from 'next/link';

<Link href="/blog/nextjs-zaklady">Číst článek</Link>
```

Výhody oproti `<a>`:

- **Client-side navigace**: nepřenačte celou stránku, jen vymění `page` obsah (rychlejší)
- **Automatický prefetch**: Next.js stáhne stránku do cache, jakmile link uvidí ve viewportu
- **Plynulejší UX**: žádné bíle bliknutí
- **Pro externí linky** (`https://...`) stále používej `<a>`

```tsx
// ✓ Interní navigace
<Link href="/blog">Blog</Link>
<Link href={`/blog/${slug}`}>Článek</Link>

// ✓ Externí navigace
<a href="https://github.com" target="_blank">GitHub</a>
```

---

### SSR: Server-Side Rendering

**Výchozí chování** v Next.js App Routeru. Komponenta se **vykreslí na serveru**, prohlížeč dostane hotové HTML.

```
Požadavek prohlížeče
       ▼
Next.js server
(spustí komponentu, počká na data, sestaví HTML)
       ▼
Hotový HTML → prohlížeč
(viditelný okamžitě, bez JS nutného k zobrazení)
```

### Vlastnosti

- **SEO**: search engine vidí hotový obsah
- **Rychlý první render** (First Contentful Paint)
- **Data fetch přímo v komponentě** (`async/await`)
- **Nelze**: `useState`, `useEffect`, `useRef`, event handlery (`onClick`)
- **Každý request může být pomalejší** (server musí data připravit)

```tsx
// app/products/page.tsx (SERVER COMPONENT, výchozí)
async function getProducts() {
    const res = await fetch('https://api.example.com/products', {
        cache: 'no-store'      // vždy čerstvá data
    });
    return res.json();
}

export default async function ProductsPage() {
    const products = await getProducts();   // await přímo v komponentě!

    return (
        <ul>
            {products.map((p: any) => (
                <li key={p.id}>{p.name}</li>
            ))}
        </ul>
    );
}
```

> Server Components jsou unikátní React 18 / Next.js 13+ feature. Mohou být `async` (klasické React komponenty nemohou).
> 

### Cache strategie pro fetch

```tsx
// 1. SSG (Static Site Generation): cache navždy
fetch('/api/data', { cache: 'force-cache' });

// 2. SSR (Server-Side Rendering): vždy čerstvé
fetch('/api/data', { cache: 'no-store' });

// 3. ISR (Incremental Static Regeneration): re-fetch po N sekundách
fetch('/api/data', { next: { revalidate: 60 } });

// 4. Tag-based revalidation
fetch('/api/data', { next: { tags: ['products'] } });
// pak: revalidateTag('products') uvnitř Server Action
```

---

### CSR: Client-Side Rendering

Označíš komponentu direktivou **`'use client'`**, Next.js ji pak spustí v prohlížeči. Data se stahují až po načtení stránky.

```
Prohlížeč dostane HTML skeleton (z layoutu)
        ▼
Prohlížeč stáhne a spustí JavaScript
        ▼
Komponenta se spustí v prohlížeči, fetchne data
        ▼
UI se aktualizuje
```

### Vlastnosti

- **Interaktivita**: `useState`, `useEffect`, event handlery (`onClick`)
- **Rychlé opakované navigace** (JS je už v prohlížeči)
- **Horší SEO**: crawler uvidí jen skeleton
- **Pomalejší první render**

```tsx
// app/komentare/page.tsx (CLIENT COMPONENT)
'use client';      // ← MUSÍ být první řádka

import { useEffect, useState } from 'react';

export default function Komentare() {
    const [komentare, setKomentare] = useState<any[]>([]);

    useEffect(() => {
        fetch('/api/komentare')
            .then(res => res.json())
            .then(setKomentare);
    }, []);

    return (
        <ul>
            {komentare.map(k => <li key={k.id}>{k.text}</li>)}
        </ul>
    );
}
```

---

### Srovnání SSR vs CSR

|  | SSR (Server Component) | CSR (Client Component) |
| --- | --- | --- |
| **Direktiva** | Žádná (výchozí) | `'use client'` |
| **Kde běží** | Na serveru | V prohlížeči |
| **Hooks** | Nelze (`useState` atd.) | Všechny React hooky |
| **SEO** | Výborné | Špatné |
| **Data fetching** | `async/await` přímo | `useEffect` + `fetch` |
| **Interaktivita** | Statický HTML | Klikání, formuláře, animace |
| **Velikost bundle** | Nepřidává JS klientovi | Přidává JS do bundlu |
| **Kdy použít** | Stránky, blog, e-shop listing | Komentáře, lajky, real-time, formuláře |

**Praktické pravidlo**: Začni jako Server Component. Přepni na Client (`'use client'`) **jen když potřebuješ hooks nebo interaktivitu**. Většina stránky bývá server, dílčí interaktivní komponenty client.

---

### Doporučené: Kombinace SSR + CSR na jedné stránce

Stránka může být Server Component, ale obsahovat Client sub-komponenty:

```tsx
// app/blog/[slug]/page.tsx (Server Component, SSR)
import Komentare from '@/components/Komentare';   // Client Component

export default async function BlogPost({ params }: { params: { slug: string } }) {
    const post = await fetchPost(params.slug);    // server-side fetch

    return (
        <article>
            <h1>{post.title}</h1>
            <p>{post.content}</p>
            <Komentare postId={post.id} />        {/* Client Component, interaktivní */}
        </article>
    );
}
```

```tsx
// components/Komentare.tsx (Client Component, CSR)
'use client';
import { useState } from 'react';
// ...
```

Výsledek: obsah článku je SEO-friendly (SSR), komentáře jsou interaktivní (CSR). Tohle je **typický pattern**.

---

### API routes: `route.ts`

Místo separátního backendu můžeš definovat API endpointy přímo v Next.js projektu.

```
app/api/produkty/route.ts → GET/POST /api/produkty
```

```tsx
// app/api/produkty/route.ts
import { NextResponse } from 'next/server';

const produkty = [
    { id: 1, nazev: 'Notebook', cena: 25000 },
    { id: 2, nazev: 'Myš', cena: 350 }
];

// GET /api/produkty
export async function GET() {
    return NextResponse.json(produkty);
}

// POST /api/produkty
export async function POST(req: Request) {
    const novy = await req.json();
    novy.id = produkty.length + 1;
    produkty.push(novy);
    return NextResponse.json(novy, { status: 201 });
}

// PUT /api/produkty/:id (vyžaduje [id] složku)
// DELETE /api/produkty/:id (vyžaduje [id] složku)
```

Každá exportovaná funkce (`GET`, `POST`, `PUT`, `DELETE`, `PATCH`) odpovídá HTTP metodě.

### Dynamické API routes

```
app/api/produkty/[id]/route.ts → /api/produkty/:id
```

```tsx
export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    const produkt = produkty.find(p => p.id === Number(params.id));
    if (!produkt) return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    return NextResponse.json(produkt);
}
```

---

### Server Actions: moderní alternativa

> Server Actions jsou novější feature (Next.js 13.4+, stabilní v 14). Stojí za zmínku, zkoušející možná ocení.
> 

Místo psaní API route + fetch z klienta můžeš zavolat **funkci přímo na serveru**:

```tsx
// lib/kosik.ts
'use server';

export async function pridatDoKosiku(produktId: number, mnozstvi: number = 1) {
    const kosik = JSON.parse(cookies().get('kosik')?.value ?? '[]');
    kosik.push({ produktId, mnozstvi });
    cookies().set('kosik', JSON.stringify(kosik));
    revalidatePath('/');
}
```

```tsx
'use client';
import { pridatDoKosiku } from '@/lib/kosik';

export default function PridatTlacitko({ produktId }: { produktId: number }) {
    return (
        <button onClick={() => pridatDoKosiku(produktId, 1)}>
            Přidat do košíku
        </button>
    );
}
```

Žádný `fetch`, žádné API route. Next.js to za tebe propojí.

---

### Metadata API: SEO

> SEO zkoušející určitě ocení.
> 

```tsx
// app/blog/[slug]/page.tsx
import { Metadata } from 'next';

// Statická metadata
export const metadata: Metadata = {
    title: 'Blog',
    description: 'Můj blog o programování'
};

// Dynamická metadata (z dat)
export async function generateMetadata({ params }): Promise<Metadata> {
    const post = await fetchPost(params.slug);
    return {
        title: post.title,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            images: [post.image]
        }
    };
}
```

Next.js to vyrendruje do `<head>` jako `<title>`, `<meta>` a Open Graph tagy. Stará Pages Router používala `<Head>` komponentu.

---

### Další moderní features (general knowledge bonus)

### `next/image` pro optimalizaci

```tsx
import Image from 'next/image';

<Image src="/produkt.jpg" alt="..." width={500} height={300} />
```

Automaticky: WebP konverze, lazy loading, responsive sizes, blur placeholder, CDN optimalizace.

### `next/font` pro fonty

```tsx
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function Layout({ children }) {
    return <body className={inter.className}>{children}</body>;
}
```

Self-hosted fonts s zero layout shift, no external requests.

---

### Rendering strategie: přehled

| Strategie | Kdy se renderuje | Použití |
| --- | --- | --- |
| **SSG (Static)** | Build time | Marketing, dokumentace |
| **SSR** | Každý request | Personalizovaný obsah |
| **ISR** | Build time + revalidace | Blog, e-shop produkty |
| **CSR** | Browser, po načtení | Dashboardy za přihlášením |
| **Streaming** | Postupně během requestu | Pomalé komponenty |

V App Routeru je rendering určen kombinací cache options a `'use client'`.

---

### Časté chyby

| Chyba | Důsledek | Řešení |
| --- | --- | --- |
| `useState` v Server Component | Chyba kompilace | Přidat `'use client'` |
| `'use client'` až někde uprostřed | Direktiva nefunguje | Musí být PRVNÍ řádka |
| `<a href="...">` pro vnitřní linky | Full page reload | `<Link>` z `next/link` |
| `fetch` bez cache options | Default chování (může být nečekané) | Explicit `cache: 'no-store'` nebo `'force-cache'` |
| API route bez `NextResponse.json` | Nesprávný Content-Type | `NextResponse.json(data)` |
| Server Action bez `'use server'` | Nefunguje | `'use server'` na začátku |
| `params` bez await v Next 15+ | Warning | `const { slug } = await params;` |
| Forgotten `key` v mapách | React warning | Vždy unique `key` |
| `useEffect` na fetch dat při SSR | Spustí se v prohlížeči zbytečně | Použít Server Component a `async` |

---

# Část 2: Praktická úloha

### Co může praktická úloha obsahovat

Typická úloha:

- **Statické a dynamické routy** (`page.tsx` ve různých složkách)
- **Server Component** s `async`/`await` pro fetch dat
- **Client Component** s `'use client'`, `useState`, `useEffect`
- **API endpoint** v `route.ts` (GET, POST)
- **`layout.tsx`** se sdíleným obsahem
- **`<Link>`** pro client-side navigaci
- **Předání dat** mezi server a client komponentami přes props

### Příklad zadání: Blog s komentáři

Máš Next.js projekt: jednoduchý blog. Část je hotová, doplníš podle TODO komentářů.

**Struktura:**

```
app/
├── page.tsx              ✓ hotovo: homepage se seznamem článků (SSR)
├── layout.tsx            ✓ hotovo: navbar + footer
├── blog/
│   └── [slug]/
│       └── page.tsx      TODO 1: dynamická routa s SSR
├── oblibene/
│   └── page.tsx          TODO 2: CSR stránka s useState
└── api/
    └── posts/
        └── route.ts      TODO 3: API endpoint GET + POST
```

### Řešení

### TODO 1: `app/blog/[slug]/page.tsx` (Server Component)

```tsx
// app/blog/[slug]/page.tsx
import Link from 'next/link';

type Props = {
    params: { slug: string };
};

// Simulace fetch z API (mohlo by být skutečné fetch)
async function getPost(slug: string) {
    const POSTS: Record<string, { title: string; content: string }> = {
        'nextjs-zaklady': {
            title: 'Next.js základy',
            content: 'Next.js je React framework od Vercelu, který přidává SSR, file-based routing a další features.'
        },
        'ssr-vs-csr': {
            title: 'SSR vs CSR',
            content: 'SSR renderuje na serveru, CSR v prohlížeči. Volba závisí na potřebě SEO a interaktivity.'
        },
        'typescript-tips': {
            title: 'TypeScript tipy',
            content: 'Tipy a triky pro efektivnější použití TypeScriptu v React projektech.'
        }
    };
    return POSTS[slug] || null;
}

export default async function BlogPost({ params }: Props) {
    const post = await getPost(params.slug);

    if (!post) {
        return (
            <main>
                <h1>Článek nenalezen</h1>
                <Link href="/">← Zpět na seznam</Link>
            </main>
        );
    }

    return (
        <main>
            <Link href="/">← Zpět na seznam</Link>
            <article>
                <h1>{post.title}</h1>
                <p>{post.content}</p>
            </article>
        </main>
    );
}
```

### TODO 2: `app/oblibene/page.tsx` (Client Component)

```tsx
// app/oblibene/page.tsx
'use client';

import { useState } from 'react';

export default function OblibenePage() {
    const [oblibene, setOblibene] = useState<string[]>([]);
    const [input, setInput] = useState('');

    function pridat() {
        if (input.trim() === '') return;
        setOblibene([...oblibene, input.trim()]);
        setInput('');
    }

    function odebrat(index: number) {
        setOblibene(oblibene.filter((_, i) => i !== index));
    }

    return (
        <main>
            <h1>Moje oblíbené články</h1>

            <div style={{ marginBottom: '1rem' }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Název článku"
                    onKeyDown={(e) => e.key === 'Enter' && pridat()}
                />
                <button onClick={pridat}>Přidat</button>
            </div>

            {oblibene.length === 0 ? (
                <p>Zatím žádné oblíbené.</p>
            ) : (
                <ul>
                    {oblibene.map((nazev, i) => (
                        <li key={i}>
                            {nazev}
                            <button onClick={() => odebrat(i)} style={{ marginLeft: '0.5rem' }}>
                                ✕
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            <p>Počet: {oblibene.length}</p>
        </main>
    );
}
```

### TODO 3: `app/api/posts/route.ts`

```tsx
// app/api/posts/route.ts
import { NextResponse } from 'next/server';

type Post = {
    id: number;
    slug: string;
    title: string;
};

let POSTS: Post[] = [
    { id: 1, slug: 'nextjs-zaklady', title: 'Next.js základy' },
    { id: 2, slug: 'ssr-vs-csr', title: 'SSR vs CSR' }
];

// GET /api/posts
export async function GET() {
    return NextResponse.json(POSTS);
}

// POST /api/posts
// Body: { "slug": "novy-clanek", "title": "Nový článek" }
export async function POST(req: Request) {
    try {
        const data = await req.json();

        // Validace
        if (!data.slug || !data.title) {
            return NextResponse.json(
                { error: 'slug a title jsou povinné' },
                { status: 400 }
            );
        }

        const novy: Post = {
            id: POSTS.length > 0 ? Math.max(...POSTS.map(p => p.id)) + 1 : 1,
            slug: data.slug,
            title: data.title
        };

        POSTS.push(novy);
        return NextResponse.json(novy, { status: 201 });
    } catch (err) {
        return NextResponse.json(
            { error: 'Neplatný JSON v těle' },
            { status: 400 }
        );
    }
}
```

### Co se v řešení děje

**TODO 1 (Dynamická routa)**: `app/blog/[slug]/page.tsx` je Server Component (žádné `'use client'`). Je `async`, takže může používat `await`. Funkce `getPost` simuluje fetch (v praxi by mohla volat `fetch('/api/posts/${slug}')`). Pokud post neexistuje, zobrazí fallback místo crashe. Pro navigaci zpět používá `<Link>` z `next/link` (client-side, rychlejší).

**TODO 2 (CSR stránka)**: První řádka `'use client'` přepíná do client módu. `useState` drží list oblíbených a current input. `onClick` event handlery jsou možné jen v client components. `onKeyDown` umožní přidávat Enterem. State updaty přes spread operator (immutability).

**TODO 3 (API route)**: Exportované `GET` a `POST` funkce reagují na HTTP metody. `NextResponse.json(data, options)` vrátí JSON odpověď se správným Content-Type. POST validuje vstup (vrátí 400, když chybí povinná pole). Pro generování ID použít `Math.max(...IDs) + 1` (bezpečnější než `length + 1` po smazání).

---

### Bonusy

### Bonus A: Propojit Client komponent s API route

```tsx
// app/oblibene/page.tsx
'use client';

import { useEffect, useState } from 'react';

export default function OblibenePage() {
    const [posts, setPosts] = useState<any[]>([]);
    const [oblibene, setOblibene] = useState<string[]>([]);

    useEffect(() => {
        fetch('/api/posts')
            .then(r => r.json())
            .then(setPosts);
    }, []);

    return (
        <main>
            <h1>Vyber oblíbené</h1>
            <ul>
                {posts.map(p => (
                    <li key={p.id}>
                        {p.title}
                        <button onClick={() => setOblibene([...oblibene, p.title])}>
                            ★ Přidat
                        </button>
                    </li>
                ))}
            </ul>
            <h2>Oblíbené ({oblibene.length})</h2>
            <ul>
                {oblibene.map((o, i) => <li key={i}>{o}</li>)}
            </ul>
        </main>
    );
}
```

### Bonus B: Loading a Error stránky

```tsx
// app/blog/[slug]/loading.tsx
export default function Loading() {
    return <div>Načítám článek...</div>;
}

// app/blog/[slug]/error.tsx
'use client';
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
    return (
        <div>
            <h2>Něco se pokazilo!</h2>
            <p>{error.message}</p>
            <button onClick={reset}>Zkusit znovu</button>
        </div>
    );
}
```

### Bonus C: Metadata pro SEO

```tsx
// app/blog/[slug]/page.tsx
import { Metadata } from 'next';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const post = await getPost(params.slug);
    return {
        title: post?.title ?? 'Článek nenalezen',
        description: post?.content.substring(0, 160) ?? ''
    };
}
```

---

## Část 3: Tipy pro obhajobu

### Co u obhajoby říct

> *"V zadání jsem vyplnil 3 části Next.js blogu. Pro dynamickou routu jsem vytvořil složku blog/[slug] s page.tsx jako Server Component, který je async a může používat await přímo v komponentě. Slug se přijme přes params. Pro stránku oblíbených jsem použil 'use client' direktivu, protože potřebuju useState pro lokální state. Přidávání funguje přes onClick handler. API route jsem implementoval jako route.ts s exportovanými GET a POST funkcemi: GET vrací NextResponse.json s polem, POST přijme tělo přes req.json(), validuje a vrátí 201. Klíčový rozdíl mezi server a client komponentou: server je výchozí a podporuje async/await + fetch přímo, client potřebuje 'use client' a podporuje React hooks. Volba ovlivňuje SEO: server komponenty jsou SEO-friendly, client jsou pomalejší pro crawlery."*
> 

### Klíčové pojmy pro teorii

| Pojem | Rychlá odpověď |
| --- | --- |
| **Next.js** | React framework od Vercelu s SSR, file-based routingem, API |
| **App Router** | Moderní routing (Next.js 13+), složka `app/` |
| **Pages Router** | Legacy routing, složka `pages/` |
| **File-based routing** | Složka = URL segment, `page.tsx` = stránka |
| **`page.tsx`** | Obsah stránky na URL |
| **`layout.tsx`** | Obal stránek, nepřekresluje se při navigaci |
| **`route.ts`** | API endpoint (GET/POST funkce) |
| **Dynamická routa** | `[param]` v názvu složky, hodnota přes `params` |
| **Server Component** | Default, vykresluje se na serveru, podpora async |
| **Client Component** | `'use client'`, vykresluje se v prohlížeči, hooks |
| **SSR** | Server-Side Rendering, server pošle hotový HTML |
| **CSR** | Client-Side Rendering, browser fetchuje data |
| **SSG** | Static Site Generation, build time |
| **ISR** | Incremental Static Regeneration, revalidate intervaly |
| **`'use client'`** | Direktiva pro Client Component (PRVNÍ řádka!) |
| **`next/link`** | `<Link>` pro client-side navigaci |
| **`next/image`** | Optimalizace obrázků |
| **`NextResponse.json()`** | Helper pro API JSON odpovědi |
| **Server Actions** | Funkce volaná z formuláře, `'use server'` |
| **Metadata API** | `export const metadata` pro SEO tagy |

### Časté chytáky

| Otázka | Odpověď |
| --- | --- |
| *Co je file-based routing?* | Routing se generuje ze struktury složek. `app/about/page.tsx` automaticky vytvoří `/about`. |
| *Rozdíl SSR a CSR?* | SSR: server sestaví hotový HTML. CSR: prohlížeč dostane skeleton a fetchuje data. SSR je lepší pro SEO. |
| *Proč SSR pro SEO?* | Crawlery často nezpracují JavaScript dobře nebo dlouho čekají. SSR jim dá hotový obsah hned. |
| *Co dělá `'use client'`?* | Říká Next.js, že komponenta (a všechny její importy) má běžet v prohlížeči. Umožní useState/useEffect/onClick. |
| *Proč v Server Component nelze useState?* | Server Component se spustí jednou na serveru a vrátí HTML. State nemá smysl, server si nemůže pamatovat stav mezi requesty (Next.js je stateless). |
| *Rozdíl layout.tsx a page.tsx?* | Layout je obal, který přetrvává při navigaci. Page je konkrétní obsah té stránky. Layout dostává `children` (vykreslí page uvnitř). |
| *Jak funguje dynamická routa?* | Složka `[slug]` znamená proměnný segment. URL `/blog/hello` → komponenta dostane `params.slug = 'hello'`. |
| *Rozdíl `route.ts` a `page.tsx`?* | Page vrací JSX (HTML). Route exportuje funkce GET/POST a vrací JSON. Page je pro UI, Route pro API. |
| *Kdy SSR a kdy CSR?* | SSR pro statický obsah a SEO (blog, e-shop listing). CSR pro interaktivitu (formuláře, komentáře, dashboardy). |
| *Co je `cache: 'no-store'` ve fetch?* | Říká Next.js, že má vždy stáhnout čerstvá data (každý request znovu). Default je cachování. |
| *Proč `<Link>` místo `<a>`?* | Link dělá client-side navigaci (rychlejší, bez page reload), prefetchuje budoucí stránky. `<a>` udělá full reload. |
| *Co jsou Server Actions?* | Funkce, kterou napíšeš na serveru a zavoláš přímo z client formuláře. Místo API route + fetch, jen `action={funkce}`. |

### Časté chyby v praktické úloze

- `useState` v Server Component (chyba kompilace, chybí `'use client'`)
- `'use client'` v půlce souboru místo na 1. řádku
- `<a href="/...">` pro vnitřní linky (full reload, ztráta UX)
- API route bez `NextResponse.json` (špatný Content-Type)
- `fetch` bez cache options (nejasné chování)
- `useEffect` pro fetch dat, které mohly být v Server Component (zbytečně pomalé)
- Forgotten `key` u `.map` (React warning)
- `params` jako objekt místo Promise v Next 15+ (warning, async params)
- Page server component bez `export default`
- API route bez return statement (server crashne)
- Client komponenta importuje Server-only kód (chyba)
- Nezachycený error v API (vrátí 500)
- POST endpoint bez validace vstupu (zápis garbage do DB)
- `Math.random()` pro ID v API (kolize, lepší DB autoincrement nebo crypto)
- Žádné loading nebo error state pro pomalé komponenty (špatný UX)