# MZ 2026

## Wiki

Tento repozitář se dá renderovat jako statická wiki přes VitePress.

```bash
npm install
npm run dev
npm run build
```

- Lokální preview běží standardně na `http://localhost:5173`.
- Produkční build se generuje do `.vitepress/dist`.
- GitHub Actions workflow v `.github/workflows/wiki.yml` nasazuje build na GitHub Pages.
- Soubor `.vitepress/public/CNAME` nastavuje doménu `maturita.ax4.cz`.
- Markdown poznámky zůstávají zdrojem pravdy; VitePress je pouze renderer.
- 📅 [Maturitní plán do 25. 5.](./PLAN.md)

## 📚 Materiály
- 💻 [SWI](https://axo4xo.notion.site/swi)
- 💻 [DAT](https://axo4xo.notion.site/dat)
- 📚 [Maturitní četba (ČJL)](https://axo4xo.notion.site/matcetba)

## 📂 Otázky v repu

- [ANJ](./ANJ) — Anglický jazyk
- [DAT](./DAT) — Data a kódování
- [SWI](./SWI) — Softwarové inženýrství
