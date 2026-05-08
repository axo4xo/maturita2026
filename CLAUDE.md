# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository purpose

This is **not a software project** — it's a personal study repo for Czech maturita exams 2026 (high school finals). It contains study materials, question lists, and a study plan. There is no build/test/lint tooling.

## Layout

Per-subject content is split across two parallel hierarchies:

- **`<SUBJECT>/`** — finished/clean study notes for the subject (currently HTML and PDF exports of compiled notes).
- **`_podklady/<SUBJECT>/`** — raw source materials: official question lists (CSV/XLSX), sample assignments, speaking topics, etc.

Subjects: `ANJ` (English), `CJL` (Czech language & literature), `DAT` (Data & coding), `SWI` (Software engineering). Some subject folders are still empty placeholders.

The canonical question lists live in `_podklady/<SUBJECT>/<SUBJECT>_seznam_otazek.csv` — these define what topics actually need to be covered. When adding or organizing notes, cross-reference these CSVs.

## Top-level files

- `README.md` — index with links to study materials and external Notion pages (PRG, ČJL maturitní četba). **Note:** the linked Notion pages may contain different and likely more up-to-date data than what's in this repo — treat Notion as more authoritative when content diverges.
- `PLAN.MD` — day-by-day study schedule through 2026-05-25 (exam day). Linked from README.
- `_podklady/probrane_otazky_*.pdf` — list of topics already covered in class.

## Working with this repo

- When the user asks about exam topics, check `_podklady/<SUBJECT>/*_seznam_otazek.csv` first — that's the authoritative scope.
- Existing notes are HTML/PDF exports, not source files. Don't try to "edit" the PDFs; if changes are needed, work in markdown or ask where the source lives.
- `PLAN.MD` is the user's living schedule — update dates and tasks there rather than creating new planning docs.
