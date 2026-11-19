# Recall — Flashcard revision

A small React + TypeScript app for revising interview topics with flashcards. Built as a learning project: React + JavaScript first, with TypeScript added as a documented second step. See [TYPESCRIPT-WALKTHROUGH.md](TYPESCRIPT-WALKTHROUGH.md) for a line-by-line explanation of every type annotation.

## What it does

- Flip a card to reveal the answer.
- Mark a card **Got it** or **Review again**.
- Filter by subject, browse the card library, edit or delete cards.
- Add your own cards with a labelled dialog form.
- Keyboard shortcuts: `Space` flips, `←` / `→` move between cards, `Esc` closes the dialog.
- Light/dark theme and cards saved in `localStorage`.

Everything runs in the browser. There is no account, no backend and no network call.

## What I built

This is a solo project. I wrote the React components, the CSS, the localStorage hook and the starter questions. The starter questions are standard computer-science topics — they are study content, not a claim about any coursework or project result.

## Run it locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

To check types and build:

```bash
npm run typecheck
npm run build
```

## Project structure

```
src/
  App.tsx                  state, handlers, keyboard shortcuts, layout
  types.ts                 Card, Theme and CardDraft definitions
  components/
    Flashcard.tsx          the card face and study actions
    Sidebar.tsx            subject filters and progress
    CardList.tsx           library of cards with edit/delete
    CardForm.tsx           add/edit dialog
  hooks/useLocalStorage.ts persists state between reloads
  data/seed.ts             starter questions and subject list
  index.css                all styling and theme tokens
```

## Stack

React 19, TypeScript (basic), Vite, plain CSS. No UI library and no state library.
TypeScript is applied at a basic level: interfaces for props and data, a union type
for the theme, one generic hook, and typed events/refs. See the walkthrough for details.
