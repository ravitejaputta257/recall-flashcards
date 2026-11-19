# TypeScript walkthrough — what changed and why

This app was first built in React + JavaScript. Then we converted it to TypeScript.
This document explains **every type we added** so you can explain it yourself.

The short version: TypeScript is JavaScript with a checking step. It runs before the
browser and says "you promised this prop would be a number, but you passed a string."
It does not change what the app does at runtime.

---

## 1. New file: `src/types.ts` — the vocabulary

```ts
export interface Card {
  id: string;
  subject: string;
  question: string;
  answer: string;
  known: boolean;
}
```

An **interface** describes the shape of an object. Every card in this app must have
exactly these five fields with these types. `id` is a `string`, `known` is a `boolean`.

```ts
export type Theme = "dark" | "light";
```

A **union type**. The theme can be one of two literal strings — nothing else.
Writing `setTheme("blue")` would now be a compile error, which is the point.

```ts
export interface CardDraft {
  subject: string;
  question: string;
  answer: string;
}
```

The form does not create the `id` or set `known`, so it returns a smaller object.
This is why we need a second interface instead of reusing `Card`.

**Say it like this:** "I defined a Card interface and a Theme union in a shared types
file, then imported them wherever I needed them."

---

## 2. `useLocalStorage.ts` — the generic

```ts
export function useLocalStorage<T>(key: string, initialValue: T) {
```

- `key: string` — the storage key must be a string.
- `initialValue: T` — whatever type the caller passes in.
- `<T>` is a **generic**: a placeholder filled in at the call site.

```ts
const [value, setValue] = useState<T>(() => { ... });
```

The state now holds a `T`, not an unknown value.

```ts
return stored === null ? initialValue : (JSON.parse(stored) as T);
```

`JSON.parse` always returns `any` in JavaScript. The `as T` is us telling TypeScript:
"trust me, what we saved under this key is the same type we put in." This is the one
place we override the checker, and it is deliberate.

```ts
return [value, setValue] as const;
```

Without `as const`, TypeScript sees a plain array. With it, the return is a fixed
two-item tuple, so destructuring gives the right types for each position.

**Call sites in `App.tsx`:**

```ts
const [cards, setCards] = useLocalStorage<Card[]>(CARDS_KEY, seedCards);
const [theme, setTheme] = useLocalStorage<Theme>(THEME_KEY, "dark");
```

`Card[]` means an array of Cards. So `cards.map(card => card.question)` is checked:
`card` is known to be a Card, and `question` is known to exist.

---

## 3. `App.tsx` — state annotations

```ts
const [activeSubject, setActiveSubject] = useState<string>("All");
const [currentIndex, setCurrentIndex] = useState<number>(0);
const [flipped, setFlipped] = useState<boolean>(false);
const [dialogOpen, setDialogOpen] = useState<boolean>(false);
```

TypeScript can already infer `string`, `number` and `boolean` from the starting value.
These angle brackets are written out for teaching — in real code you can leave them off.

```ts
const [editing, setEditing] = useState<Card | null>(null);
```

This one **is required**. Starting from `null`, TypeScript would otherwise assume the
state is always `null`, and `setEditing(card)` would fail. `Card | null` says:
"either no card is being edited, or a Card is."

**Handler parameters:**

```ts
function go(delta: number) { ... }
function mark(known: boolean) { ... }
function selectSubject(name: string) { ... }
function saveCard(values: CardDraft) { ... }
```

These are the function versions of prop types: they state what each handler accepts.

**Keyboard event:**

```ts
function onKeyDown(event: KeyboardEvent) { ... }
const tag = (event.target as HTMLElement | null)?.tagName;
```

The window's `keydown` event gives a `KeyboardEvent`, which has `key` and `code`.
`event.target` is only typed as a generic `EventTarget`, so we narrow it to
`HTMLElement` to read `tagName`. That is what the `as` cast is for.

---

## 4. Component props — the part interviewers ask about

Every component declares an interface for its props. Example from `Flashcard.tsx`:

```ts
interface FlashcardProps {
  card: Card | null;
  flipped: boolean;
  onFlip: () => void;
  onMarkKnown: () => void;
  onPrev: () => void;
  onNext: () => void;
  index: number;
  total: number;
}

export default function Flashcard({ ... }: FlashcardProps) { ... }
```

- `() => void` means "a function that takes no arguments and returns nothing."
- `Card | null` because there may be no card in the selected subject.
- The final `: FlashcardProps` after the destructured props is what enforces the
  contract. Forget to pass `onFlip` in `App.tsx` and the build fails.

`CardList.tsx` and `Sidebar.tsx` use the same pattern, with function props that take
arguments:

```ts
onEdit: (card: Card) => void;
onDelete: (id: string) => void;
```

`CardForm.tsx` adds two more:

```ts
import type { FormEvent } from "react";
function handleSubmit(event: FormEvent<HTMLFormElement>) { ... }

const firstField = useRef<HTMLSelectElement | null>(null);
```

- `FormEvent<HTMLFormElement>` is React's type for a form submit event.
- `useRef<HTMLSelectElement | null>` tells React the ref points at a `<select>`,
  so `firstField.current?.focus()` is known to be a real method.

---

## 5. `main.tsx` — the non-null assertion

```ts
createRoot(document.getElementById("root")!).render(...)
```

`getElementById` can return `null`. The `!` says "this element exists in index.html,
so treat it as non-null." If it were missing, the app would fail at runtime anyway.

---

## 6. Config files (no logic, just settings)

- `tsconfig.json` points at two sub-configs.
- `tsconfig.app.json` checks `src`; `tsconfig.node.json` checks `vite.config.ts`.
- `"strict": true` turns on all the safety checks.
- `"noEmit": true` means TypeScript only checks — Vite does the actual building.
- `npm run build` runs `tsc -b` first, then `vite build`, so a type error blocks the build.

---

## 7. Interview answers (30 seconds each)

**Q: What is TypeScript?**
"A superset of JavaScript that adds static types. It catches shape and type mistakes
before runtime, then compiles away to plain JavaScript."

**Q: What is the difference between an interface and a type?**
"An interface describes an object's shape and can be extended. A type can also alias
unions and primitives, which is why I used `type` for the two-value Theme."

**Q: What are props in React, and how did you type them?**
"Props are inputs from parent to child. I declared an interface per component and
annotated the props parameter with it, so a missing or wrongly typed prop fails the build."

**Q: Why did you use a generic in the localStorage hook?**
"Because the hook does not care what it stores. `<T>` lets the caller decide — cards
in one place, theme in another — while still getting checked types back."

**Q: What does `as` do?**
"It tells TypeScript to treat a value as a type it cannot prove on its own. I used it
for parsed localStorage data and for the keyboard event target."

**Q: What does `strict: true` mean?**
"It enables the full set of checks, including null checks. That is why `editing` had
to be typed as `Card | null` instead of just `Card`."

---

## Honest scope

This app uses: interfaces, union types, generics in one hook, prop typing, event typing,
refs, and a couple of casts. It does not use advanced types, enums, decorators or
generics in components. If asked, say exactly that — "basic TypeScript, applied to a
small app I built" — rather than claiming more.
